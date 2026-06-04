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

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    setJsonHeaders(res);
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const SUPABASE_URL = String(process.env.SUPABASE_URL || '')
    .trim()
    .replace(/\/rest\/v1\/?$/, '')
    .replace(/\/+$/, '');
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
    console.log('TABLE', 'public.pedidos');
    console.log('SUPABASE_URL_FINAL', SUPABASE_URL);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .schema('public')
      .from('pedidos')
      .insert([safeOrder])
      .select()
      .single();

    if (error) {
      return sendJson(res, 500, {
        error: 'SUPABASE_INSERT_ERROR',
        SUPABASE_URL_FINAL: SUPABASE_URL,
        ...errorDetails(error),
      });
    }

    return sendJson(res, 201, { order: data || safeOrder });
  } catch (error) {
    return sendJson(res, 500, {
      error: 'SUPABASE_INSERT_ERROR',
      SUPABASE_URL_FINAL: SUPABASE_URL,
      ...errorDetails(error),
    });
  }
};
