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

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    setJsonHeaders(res);
    return res.status(200).end();
  }
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  let order;
  try {
    order = parseBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: 'Invalid JSON body' });
  }
  if (!order?.id || !order?.cliente_nombre || !Array.isArray(order?.productos)) {
    return sendJson(res, 400, { error: 'Pedido incompleto para correo' });
  }

  try {
    const result = await sendOrderEmails(order);
    return sendJson(res, 200, result);
  } catch (error) {
    console.error('Error enviando correo de pedido', error);
    return sendJson(res, 502, { error: 'Mailgun email error', message: error.message });
  }
};
