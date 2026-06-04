const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jlxrrqjqqbbrzfzmlyuw.supabase.co';
const { sendOrderEmails } = require('../lib/order-email');

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

module.exports = async (req, res) => {
  console.log('createOrder ejecutado');

  if (req.method === 'OPTIONS') {
    setJsonHeaders(res);
    return res.status(200).end();
  }
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  console.log('createOrder POST recibido');
  console.log('body recibido', req.body);

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

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/pedidos?select=*`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(safeOrder),
    });
    const data = await response.json().catch(() => []);
    if (!response.ok) {
      return sendJson(res, response.status, { error: 'Supabase order error', details: data });
    }
    const savedOrder = Array.isArray(data) ? data[0] : data;
    console.log('Pedido guardado correctamente', savedOrder);

    let email = { sent: false };
    try {
      console.log('Intentando enviar correo con Mailgun', savedOrder.id);
      email = await sendOrderEmails(savedOrder);
      console.log('Correo enviado correctamente', savedOrder.id);
    } catch (emailError) {
      console.error('Error enviando correo con Mailgun', emailError);
      email = { sent: false, error: emailError.message };
    }

    return sendJson(res, 201, { order: savedOrder, email });
  } catch (error) {
    return sendJson(res, 500, { error: 'Order creation error', message: error.message });
  }
};
