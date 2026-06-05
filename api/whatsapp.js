const { createClient } = require('@supabase/supabase-js');

const userStates = new Map();
const MAIN_MENU = [
  '¡Hola! Bienvenido a Distribuidora Rubens. 🎨 Presiona una opción para ayudarte:',
  '1️⃣ Hacer un pedido nuevo',
  '2️⃣ Consultar el estatus de mi pedido',
  '3️⃣ Hablar con un ejecutivo',
].join('\n');

const normalizeSupabaseUrl = (value) => new URL(String(value || '').trim()).origin;

const sendJson = (res, statusCode, body) => res.status(statusCode).json(body);

const getIncomingMessage = (body = {}) => {
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return null;
  return {
    from: message.from,
    text: String(message.text?.body || '').trim(),
  };
};

const getSupabaseClient = () => {
  const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return createClient(supabaseUrl, serviceRoleKey);
};

const sendWhatsAppMessage = async (toNumber, messageText) => {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error('Missing WhatsApp Cloud API environment variables');
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: toNumber,
      type: 'text',
      text: {
        preview_url: true,
        body: messageText,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `WhatsApp HTTP ${response.status}`);
  }
  return data;
};

const getOrderStatusMessage = async (pedidoId) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('pedidos')
    .select('estado')
    .eq('id', pedidoId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return `No encontré un pedido con el ID #${pedidoId}. Verifica el número e inténtalo de nuevo.`;
    }
    throw error;
  }

  return `El estatus actual de tu pedido #${pedidoId} es: *${data.estado || 'Sin estado'}*`;
};

const getBotResponse = async (from, text) => {
  const normalizedText = text.toLowerCase();
  const currentState = userStates.get(from);

  if (currentState === 'ESPERANDO_ID_PEDIDO') {
    const pedidoId = text.replace(/\D/g, '');
    if (!pedidoId) {
      return 'Por favor, escribe el número de ID de tu pedido (solo los números):';
    }
    userStates.delete(from);
    return getOrderStatusMessage(pedidoId);
  }

  switch (normalizedText) {
    case '1':
      return '¡Perfecto! Para levantar tu pedido, por favor visita nuestra tienda en línea para registrar tus datos de forma segura: https://distribuidora-rubens.vercel.app/';
    case '2':
      userStates.set(from, 'ESPERANDO_ID_PEDIDO');
      return 'Por favor, escribe el número de ID de tu pedido (solo los números):';
    case '3':
      return 'He pasado tu reporte al departamento de atención. En lo que un ejecutivo se conecta en este chat, si lo prefieres puedes contactarlo directamente dando clic aquí: wa.me/525539318779';
    case 'menu':
    case 'hola':
    case 'buenas':
    case 'inicio':
      return MAIN_MENU;
    default:
      return MAIN_MENU;
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const incomingMessage = getIncomingMessage(req.body);
  if (!incomingMessage?.from) {
    return sendJson(res, 200, { ok: true, ignored: true });
  }

  try {
    const responseText = await getBotResponse(incomingMessage.from, incomingMessage.text);
    const whatsappResponse = await sendWhatsAppMessage(incomingMessage.from, responseText);
    return sendJson(res, 200, { ok: true, whatsappResponse });
  } catch (error) {
    console.error('WHATSAPP_WEBHOOK_ERROR', error);
    try {
      await sendWhatsAppMessage(
        incomingMessage.from,
        'Lo siento, por ahora no pude procesar tu solicitud. Un ejecutivo de Distribuidora Rubens te atenderá en breve.'
      );
    } catch (sendError) {
      console.error('WHATSAPP_FALLBACK_ERROR', sendError);
    }
    return sendJson(res, 200, { ok: false, error: error.message });
  }
};

module.exports.sendWhatsAppMessage = sendWhatsAppMessage;
