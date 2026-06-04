const { createClient } = require('@supabase/supabase-js');

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

const errorDetails = (error) => ({
  message: error?.message || '',
  code: error?.code || '',
  details: error?.details || '',
  hint: error?.hint || '',
  status: error?.status || error?.statusCode || '',
});

const normalizeSupabaseUrl = (value) => new URL(String(value || '').trim()).origin;

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    setJsonHeaders(res);
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  let SUPABASE_URL;
  try {
    SUPABASE_URL = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  } catch (error) {
    return sendJson(res, 500, {
      error: 'Invalid SUPABASE_URL',
      ...errorDetails(error),
    });
  }
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return sendJson(res, 500, {
      error: 'Missing Supabase environment variables',
      SUPABASE_URL_FINAL: SUPABASE_URL,
      serviceRoleExists: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    });
  }

  let order;
  try {
    order = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (error) {
    return sendJson(res, 400, { error: 'Invalid JSON body' });
  }
  const safeOrder = {
    cliente_nombre: String(order?.cliente_nombre || '').trim(),
    cliente_telefono: String(order?.cliente_telefono || '').replace(/\D/g, '').slice(-10),
    cliente_correo: String(order?.cliente_correo || '').trim(),
    direccion: String(order?.direccion || '').trim(),
    tipo_entrega: String(order?.tipo_entrega || '').trim(),
    metodo_pago: String(order?.metodo_pago || '').trim(),
    productos: Array.isArray(order?.productos) ? order.productos : [],
    total: Math.max(0, Number(order?.total) || 0),
    estado: 'Nuevo',
    notas: String(order?.notas || '').trim(),
  };

  if (!safeOrder.cliente_nombre
    || !safeOrder.cliente_telefono
    || !safeOrder.cliente_correo
    || !safeOrder.metodo_pago
    || safeOrder.productos.length === 0) {
    return sendJson(res, 400, { error: 'Pedido incompleto' });
  }

  try {
    console.log('SUPABASE_URL', SUPABASE_URL);
    console.log('SERVICE_ROLE_KEY_EXISTS', Boolean(SUPABASE_SERVICE_ROLE_KEY));
    console.log('TABLE', 'pedidos');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from('pedidos')
      .insert([safeOrder])
      .select()
      .single();
    console.log('SUPABASE_RESULT', { data, error });

    if (error) {
      console.error('SUPABASE_ERROR', error);
      return sendJson(res, 500, {
        error: 'SUPABASE_INSERT_ERROR',
        SUPABASE_URL_FINAL: SUPABASE_URL,
        ...errorDetails(error),
      });
    }

    return sendJson(res, 201, { order: data || safeOrder });
  } catch (error) {
    console.error('SUPABASE_ERROR', error);
    return sendJson(res, 500, {
      error: 'SUPABASE_INSERT_ERROR',
      SUPABASE_URL_FINAL: SUPABASE_URL,
      ...errorDetails(error),
    });
  }
};
