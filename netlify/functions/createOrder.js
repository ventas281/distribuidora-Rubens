const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jlxrrqjqqbbrzfzmlyuw.supabase.co';
const SALES_EMAIL = process.env.SALES_EMAIL || 'ventas@rubensdistribuidora.com';

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  },
  body: JSON.stringify(body),
});

const validOrder = (order) => (
  order
  && String(order.cliente_nombre || '').trim()
  && String(order.cliente_telefono || '').trim()
  && String(order.cliente_correo || '').trim()
  && String(order.metodo_pago || '').trim()
  && Array.isArray(order.productos)
  && order.productos.length > 0
);

const formatProducts = (products) => products.map((product) => (
  `${product.quantity || 1} x ${product.name || 'Producto'} - $${Number(product.lineTotal || 0).toFixed(2)} MXN`
)).join('\n');

const sendSalesEmail = async (order) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: 'RESEND_API_KEY no configurada' };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM || 'Rubens Distribuidora <pedidos@rubensdistribuidora.com>',
      to: [SALES_EMAIL],
      subject: 'Nuevo pedido Rubens Distribuidora',
      text: [
        `ID pedido: ${order.id}`,
        `Cliente: ${order.cliente_nombre}`,
        `Teléfono: ${order.cliente_telefono}`,
        `Correo: ${order.cliente_correo}`,
        `Productos:\n${formatProducts(order.productos)}`,
        `Total: $${Number(order.total || 0).toFixed(2)} MXN`,
        `Método de pago: ${order.metodo_pago}`,
        `Dirección: ${order.direccion || 'No indicada'}`,
        `Fecha: ${order.created_at}`,
      ].join('\n\n'),
    }),
  });

  if (!response.ok) throw new Error(`Resend HTTP ${response.status}`);
  return { sent: true };
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return jsonResponse(200, {});
  if (event.httpMethod !== 'POST') return jsonResponse(405, { error: 'Method not allowed' });

  let order;
  try {
    order = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  if (!validOrder(order)) {
    return jsonResponse(400, { error: 'Pedido incompleto' });
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

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return jsonResponse(500, {
      error: 'Missing Supabase service role key',
      message: 'Configura SUPABASE_SERVICE_ROLE_KEY en Netlify.',
    });
  }

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
      return jsonResponse(response.status, { error: 'Supabase order error', details: data });
    }

    const savedOrder = Array.isArray(data) ? data[0] : data;
    let email = { sent: false };
    try {
      email = await sendSalesEmail(savedOrder);
    } catch (error) {
      email = { sent: false, reason: error.message };
    }
    return jsonResponse(201, { order: savedOrder, email });
  } catch (error) {
    return jsonResponse(500, { error: 'Order creation error', message: error.message });
  }
};
