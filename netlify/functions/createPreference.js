const { MercadoPagoConfig, Preference } = require('mercadopago');

const fallbackItem = {
  title: 'Compra Rubens Distribuidora',
  quantity: 1,
  unit_price: 100,
  currency_id: 'MXN',
};

const siteUrl = 'https://rubensdistribuidora.com';

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': siteUrl,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  },
  body: JSON.stringify(body),
});

const toPositiveNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const normalizeCartItems = (cart = []) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    return [fallbackItem];
  }

  const items = cart
    .map((item) => ({
      title: String(item.name || item.title || fallbackItem.title).slice(0, 250),
      quantity: Math.max(1, Math.round(toPositiveNumber(item.quantity, 1))),
      unit_price: toPositiveNumber(item.price || item.unit_price, 0),
      currency_id: 'MXN',
    }))
    .filter((item) => item.unit_price > 0);

  return items.length ? items : [fallbackItem];
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {});
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return jsonResponse(500, {
      error: 'Missing Mercado Pago access token',
      message: 'Configura MERCADO_PAGO_ACCESS_TOKEN en Netlify Environment Variables.',
    });
  }

  let payload = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const items = normalizeCartItems(payload.cart);
  const shippingCost = toPositiveNumber(payload.shippingCost, 0);

  if (shippingCost > 0) {
    items.push({
      title: 'Envío Ruben’s Distribuidora',
      quantity: 1,
      unit_price: shippingCost,
      currency_id: 'MXN',
    });
  }

  try {
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
          delivery_method: payload.deliveryMethod || '',
        },
      },
    });

    return jsonResponse(200, {
      preference_id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });
  } catch (error) {
    return jsonResponse(500, {
      error: 'Mercado Pago preference error',
      message: error.message,
    });
  }
};
