const { createClient } = require('@supabase/supabase-js');
const { sendOrderEmails } = require('../lib/order-email');
const tableName = 'pedidos';
const schemaName = 'public';
const fallbackSupabaseUrl = 'https://jlxrrqjqqbbrzfzmlyuw.supabase.co';

const normalizeSupabaseUrl = (value) => {
  const rawUrl = String(value || fallbackSupabaseUrl).trim();
  const parsedUrl = new URL(rawUrl);
  const expectedUrl = new URL(fallbackSupabaseUrl);
  if (parsedUrl.hostname !== expectedUrl.hostname) {
    console.warn('SUPABASE_URL no apunta al proyecto esperado; usando proyecto configurado.', {
      receivedHost: parsedUrl.hostname,
      expectedHost: expectedUrl.hostname,
    });
    return expectedUrl.origin;
  }
  return parsedUrl.origin;
};

const setJsonHeaders = (res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
};

const sendJson = (res, statusCode, body) => {
  setJsonHeaders(res);
  return res.status(statusCode).json(body);
};

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return req.body;
};

const isValidOrder = (order) => (
  order
  && String(order.cliente_nombre || '').trim()
  && String(order.cliente_telefono || '').trim()
  && String(order.cliente_correo || '').trim()
  && String(order.metodo_pago || '').trim()
  && Array.isArray(order.productos)
  && order.productos.length > 0
);

const supabaseErrorDetails = (error, status = '') => ({
  message: error?.message || '',
  code: error?.code || '',
  details: error?.details || '',
  hint: error?.hint || '',
  status: error?.status || error?.statusCode || status,
});

module.exports = async (req, res) => {
  console.log('createOrder ejecutado');

  if (req.method === 'OPTIONS') {
    setJsonHeaders(res);
    return res.status(200).end();
  }
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  console.log('POST recibido en createOrder');
  console.log('Body:', req.body);

  let order;
  try {
    order = parseBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: 'Invalid JSON body' });
  }
  if (!isValidOrder(order)) return sendJson(res, 400, { error: 'Pedido incompleto' });

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let supabaseUrl;
  try {
    supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  } catch (error) {
    const details = supabaseErrorDetails(error);
    console.error('SUPABASE_CONNECTION_ERROR', details);
    return sendJson(res, 500, {
      error: 'SUPABASE_CONNECTION_ERROR',
      ...details,
    });
  }

  if (!serviceRoleKey) {
    return sendJson(res, 500, {
      error: 'Missing Supabase service role key',
      message: 'Configura SUPABASE_SERVICE_ROLE_KEY en Vercel.',
    });
  }

  const safeOrder = {
    cliente_nombre: String(order.cliente_nombre).trim(),
    cliente_telefono: String(order.cliente_telefono).replace(/\D/g, '').slice(-10),
    cliente_correo: String(order.cliente_correo).trim(),
    direccion: String(order.direccion || '').trim(),
    tipo_entrega: String(order.tipo_entrega || '').trim(),
    metodo_pago: String(order.metodo_pago).trim(),
    productos: order.productos,
    total: Math.max(0, Number(order.total) || 0),
    estado: 'Nuevo',
    notas: String(order.notas || '').trim(),
  };

  console.log('SUPABASE_URL=', supabaseUrl);
  console.log('SUPABASE_URL_RAW_PATH=', String(process.env.SUPABASE_URL || '').replace(supabaseUrl, '') || '/');
  console.log('TABLE=', `${schemaName}.${tableName}`);
  console.log('SERVICE_ROLE_EXISTS=', !!serviceRoleKey);
  console.log('PAYLOAD=', safeOrder);

  let supabasePhase = 'connection';
  let lastSupabaseStatus = '';
  try {
    console.log('Creando cliente Supabase');
    const supabaseFetch = async (url, options) => {
      console.log('SUPABASE_REQUEST_URL=', String(url));
      const response = await fetch(url, options);
      lastSupabaseStatus = response.status;
      console.log('SUPABASE_RESPONSE_STATUS=', response.status);
      return response;
    };
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: schemaName,
      },
      global: {
        fetch: supabaseFetch,
      },
    });

    console.log('Ejecutando select de diagnostico:', `${schemaName}.${tableName}`);
    const {
      data: connectionData,
      error: connectionError,
    } = await supabase.schema(schemaName).from(tableName).select('*').limit(1);
    console.log('Resultado conexion Supabase:', connectionData, connectionError);

    if (connectionError) {
      const error = supabaseErrorDetails(connectionError, lastSupabaseStatus);
      console.error('SUPABASE_CONNECTION_ERROR', error);
      return sendJson(res, 500, {
        error: 'SUPABASE_CONNECTION_ERROR',
        ...error,
      });
    }

    supabasePhase = 'insert';
    console.log('Ejecutando insert:', `${schemaName}.${tableName}`, safeOrder);
    const {
      data,
      error: insertError,
    } = await supabase.schema(schemaName).from(tableName).insert(safeOrder).select('*').single();
    console.log('Resultado Supabase:', data, insertError);

    if (insertError) {
      const error = supabaseErrorDetails(insertError, lastSupabaseStatus);
      console.error('SUPABASE_INSERT_ERROR', error);
      return sendJson(res, 500, {
        error: 'SUPABASE_INSERT_ERROR',
        ...error,
      });
    }

    const savedOrder = data;
    console.log('Pedido guardado correctamente', savedOrder);

    let mailgunResult;
    try {
      console.log('Intentando enviar correo con Mailgun', savedOrder.id);
      mailgunResult = await sendOrderEmails(savedOrder);
      console.log('Resultado Mailgun:', mailgunResult);
      console.log('Correo enviado correctamente', savedOrder.id);
    } catch (emailError) {
      console.error('Error enviando correo con Mailgun', emailError);
      mailgunResult = { sent: false, error: emailError.message };
      console.log('Resultado Mailgun:', mailgunResult);
      return sendJson(res, 200, {
        order: savedOrder,
        email: mailgunResult,
        warning: 'Pedido guardado, pero no fue posible enviar el correo.',
      });
    }

    return sendJson(res, 201, { order: savedOrder, email: mailgunResult });
  } catch (error) {
    const details = supabaseErrorDetails(error, lastSupabaseStatus);
    const errorType = supabasePhase === 'insert'
      ? 'SUPABASE_INSERT_ERROR'
      : 'SUPABASE_CONNECTION_ERROR';
    console.error(errorType, details);
    return sendJson(res, 500, {
      error: errorType,
      ...details,
    });
  }
};
