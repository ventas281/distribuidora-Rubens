const { createClient } = require('@supabase/supabase-js');

const MY_SECRET_TOKEN = 'MiTokenSecretoDistribuidoraRubens2026';
const EXECUTIVE_WHATSAPP = '525539318779';
const userStates = new Map();

const MAIN_MENU = [
  '¡Hola! Bienvenido a Distribuidora Rubens. 🎨 Presiona una opción para ayudarte:',
  '1️⃣ Pedido nuevo',
  '2️⃣ Estatus de pedido',
  '3️⃣ Ejecutivo',
].join('\n');

function normalizeSupabaseUrl(value) {
  return new URL(String(value || '').trim()).origin;
}

function extractIncomingMessage(body = {}) {
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return null;

  return {
    from: message.from,
    text: String(message.text?.body || '').trim(),
  };
}

function getSupabaseClient() {
  const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

async function getOrderStatusMessage(pedidoId) {
  try {
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

    return `El estatus actual de tu pedido #${pedidoId} es: *${data?.estado || 'Sin estado'}*`;
  } catch (error) {
    console.error('SUPABASE_STATUS_ERROR', error);
    return 'Por ahora no pude consultar el estatus de tu pedido. Un ejecutivo de Distribuidora Rubens te atenderá en breve.';
  }
}

async function getBotResponse(from, text) {
  const normalizedText = String(text || '').trim().toLowerCase();
  const currentState = userStates.get(from);

  if (currentState === 'ESPERANDO_ID_PEDIDO') {
    const pedidoId = normalizedText.replace(/\D/g, '');
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
      return `He pasado tu reporte al departamento de atención. En lo que un ejecutivo se conecta en este chat, si lo prefieres puedes contactarlo directamente dando clic aquí: wa.me/${EXECUTIVE_WHATSAPP}`;
    case 'hola':
    case 'buenas':
    case 'menu':
    case 'menú':
    case 'inicio':
      return MAIN_MENU;
    default:
      return MAIN_MENU;
  }
}

async function handler(req, res) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === MY_SECRET_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(challenge);
      }

      return res.status(403).end();
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const incomingMessage = extractIncomingMessage(req.body);
  if (!incomingMessage?.from) {
    return res.status(200).json({ ok: true, ignored: true });
  }

  try {
    const responseText = await getBotResponse(incomingMessage.from, incomingMessage.text);
    const whatsappResponse = await sendWhatsAppMessage(incomingMessage.from, responseText);
    return res.status(200).json({ ok: true, whatsappResponse });
  } catch (error) {
    console.error('WHATSAPP_WEBHOOK_ERROR', error);
    return res.status(200).json({ ok: false, error: error.message });
  }
}

async function sendWhatsAppMessage(toNumber, messageText) {
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
}

module.exports = handler;
module.exports.sendWhatsAppMessage = sendWhatsAppMessage;
