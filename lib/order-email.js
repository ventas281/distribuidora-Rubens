const SALES_EMAIL = 'ventas@rubensdistribuidora.com';

const formatMoney = (value) => Number(value || 0).toFixed(2);

const productPresentation = (product) => (
  product.presentation
  || product.presentacion
  || product.size
  || product.selectedSize
  || product.description
  || ''
);

const formatProducts = (products = []) => products.map((product) => {
  const presentation = productPresentation(product);
  const detail = presentation ? ` (${presentation})` : '';
  return `${product.quantity || 1} x ${product.name || 'Producto'}${detail}`;
}).join('\n');

const sendMailgunMessage = async ({ apiKey, domain, to, subject, text }) => {
  const form = new FormData();
  form.set('from', `Rubens Distribuidora <pedidos@${domain}>`);
  form.set('to', to);
  form.set('subject', subject);
  form.set('text', text);

  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
    },
    body: form,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Mailgun HTTP ${response.status}`);
  }
  return data;
};

const sendOrderEmails = async (order) => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) {
    throw new Error('Configura MAILGUN_API_KEY y MAILGUN_DOMAIN en Vercel.');
  }

  const products = formatProducts(order.productos);
  const salesText = [
    `ID pedido: #${order.id}`,
    `Fecha: ${order.created_at || 'No indicada'}`,
    `Cliente: ${order.cliente_nombre}`,
    `Telefono: ${order.cliente_telefono || 'Sin telefono'}`,
    `Correo: ${order.cliente_correo || 'Sin correo'}`,
    `Direccion: ${order.direccion || 'No capturada'}`,
    `Metodo de pago: ${order.metodo_pago || 'No indicado'}`,
    `Productos:\n${products || 'Sin productos'}`,
    `Total: $${formatMoney(order.total)} MXN`,
    `Estado: ${order.estado || 'Nuevo'}`,
  ].join('\n\n');

  const messages = [
    sendMailgunMessage({
      apiKey,
      domain,
      to: SALES_EMAIL,
      subject: `Nuevo pedido Rubens Distribuidora #${order.id}`,
      text: salesText,
    }),
  ];

  if (String(order.cliente_correo || '').trim()) {
    messages.push(sendMailgunMessage({
      apiKey,
      domain,
      to: String(order.cliente_correo).trim(),
      subject: 'Recibimos tu pedido en Rubens Distribuidora',
      text: [
        `Hola ${order.cliente_nombre},`,
        '',
        `Recibimos tu pedido #${order.id}.`,
        'En breve confirmaremos disponibilidad, forma de entrega y seguimiento.',
        '',
        'Gracias por comprar en Rubens Distribuidora.',
      ].join('\n'),
    }));
  }

  const results = await Promise.all(messages);
  return { sent: true, emails: results.length };
};

module.exports = { sendOrderEmails };
