const { createClient } = require('@supabase/supabase-js');
const { sendOrderEmails } = require('../lib/order-email');
const tableName = 'pedidos';
const SUPABASE_URL = 'https://jlxrrqjqqbbrzfzmlyuw.supabase.co';

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

const supabaseErrorDetails = (error) => ({
  message: error?.message || '',
  code: error?.code || '',
  details: error?.details || '',
  hint: error?.hint || '',
  status: error?.status || error?.statusCode || '',
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

  console.log('SUPABASE_URL=', SUPABASE_URL);
  console.log('TABLE=', tableName);
  console.log('SERVICE_ROLE_EXISTS=', !!serviceRoleKey);
  console.log('PAYLOAD=', safeOrder);

  try {
    const supabase = createClient(SUPABASE_URL, serviceRoleKey);
    console.log('Ejecutando insert:', tableName, safeOrder);
    const {
      data,
      error: insertError,
    } = await supabase.from('pedidos').insert([safeOrder]).select();
    console.log('Resultado Supabase:', data, insertError);

    if (insertError) {
      const error = supabaseErrorDetails(insertError);
      console.error('SUPABASE_INSERT_ERROR', error);
      return sendJson(res, 500, {
        error: 'SUPABASE_INSERT_ERROR',
        ...error,
      });
    }

    const savedOrder = Array.isArray(data) && data.length > 0 ? data[0] : safeOrder;
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
    const details = supabaseErrorDetails(error);
    console.error('SUPABASE_INSERT_ERROR', details);
    return sendJson(res, 500, {
      error: 'SUPABASE_INSERT_ERROR',
      ...details,
    });
  }
};
