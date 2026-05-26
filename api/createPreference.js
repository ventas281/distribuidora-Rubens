const { MercadoPagoConfig, Preference } = require('mercadopago');

const fallbackItem = {
  title: 'Compra Rubens Distribuidora',
  quantity: 1,
  unit_price: 100,
  currency_id: 'MXN',
};

const getSiteUrl = () => {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://rubensdistribuidora.com';
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

const toPositiveNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return req.body;
};

const normalizeCartItems = (cart = [], payload = {}) => {
  const items = Array.isArray(cart) ? cart
    .map((item) => ({
      title: String(item.name || item.title || fallbackItem.title).slice(0, 250),
      quantity: Math.max(1, Math.round(toPositiveNumber(item.quantity, 1))),
      unit_price: toPositiveNumber(item.price || item.unit_price || item.unitPrice, 0),
      currency_id: 'MXN',
    }))
    .filter((item) => item.unit_price > 0) : [];

  if (items.length) return items;

  if (payload.title || payload.unit_price || payload.price) {
    return [{
      title: String(payload.title || fallbackItem.title).slice(0, 250),
      quantity: Math.max(1, Math.round(toPositiveNumber(payload.quantity, 1))),
      unit_price: toPositiveNumber(payload.unit_price || payload.price, fallbackItem.unit_price),
      currency_id: 'MXN',
    }];
  }

  return [fallbackItem];
};

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    setJsonHeaders(res);
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return sendJson(res, 500, {
      error: 'Missing Mercado Pago access token',
      message: 'Configura MERCADO_PAGO_ACCESS_TOKEN en Vercel Environment Variables.',
    });
  }

  let payload = {};
  try {
    payload = parseBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: 'Invalid JSON body' });
  }

  const items = normalizeCartItems(payload.cart, payload);
  const shippingCost = toPositiveNumber(payload.shippingCost, 0);

  if (shippingCost > 0) {
    items.push({
      title: 'Envio Ruben\'s Distribuidora',
      quantity: 1,
      unit_price: shippingCost,
      currency_id: 'MXN',
    });
  }

  try {
    const siteUrl = getSiteUrl();
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${siteUrl}/productos.html?status=approved`,
          failure: `${siteUrl}/productos.html?status=failure`,
          pending: `${siteUrl}/productos.html?status=pending`,
        },
        auto_return: 'approved',
        statement_descriptor: 'RUBENS DIST',
        metadata: {
          customer_name: payload.customer?.name || '',
          customer_phone: payload.customer?.phone || '',
          customer_email: payload.customer?.email || '',
          delivery_method: payload.deliveryMethod || '',
        },
      },
    });

    return sendJson(res, 200, {
      id: response.id,
      preference_id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: 'Mercado Pago preference error',
      message: error.message,
    });
  }
};
