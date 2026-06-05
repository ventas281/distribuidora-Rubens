const VERIFY_TOKEN = 'MiTokenSecretoDistribuidoraRubens2026';
const EXECUTIVE_WHATSAPP = '525539318779';

const userStates = new Map();

const MAIN_MENU = [
  '\u00a1Hola! Bienvenido a Distribuidora Rubens. \ud83c\udfa8 Presiona una opci\u00f3n para ayudarte:',
  '1\ufe0f\u20e3 Pedido nuevo',
  '2\ufe0f\u20e3 Estatus de pedido',
  '3\ufe0f\u20e3 Ejecutivo',
].join('\n');

const getIncomingMessage = (body = {}) => {
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return null;

  return {
    from: message.from,
    text: String(message.text?.body || '').trim(),
  };
};

const getBotResponse = (from, text) => {
  const normalizedText = String(text || '').trim().toLowerCase();
  const currentState = userStates.get(from);

  if (currentState === 'ESPERANDO_ID_PEDIDO') {
    const pedidoId = normalizedText.replace(/\D/g, '');
    userStates.delete(from);
    return pedidoId
      ? `Gracias. Recibimos tu solicitud para consultar el pedido #${pedidoId}. Un ejecutivo revisar\u00e1 el estatus y te responder\u00e1 en este chat.`
      : 'Por favor, escribe el n\u00famero de ID de tu pedido (solo los n\u00fameros):';
  }

  switch (normalizedText) {
    case '1':
      return '\u00a1Perfecto! Para levantar tu pedido, por favor visita nuestra tienda en l\u00ednea para registrar tus datos de forma segura: https://distribuidora-rubens.vercel.app/';
    case '2':
      userStates.set(from, 'ESPERANDO_ID_PEDIDO');
      return 'Por favor, escribe el n\u00famero de ID de tu pedido (solo los n\u00fameros):';
    case '3':
      return `He pasado tu reporte al departamento de atenci\u00f3n. En lo que un ejecutivo se conecta en este chat, si lo prefieres puedes contactarlo directamente dando clic aqu\u00ed: wa.me/${EXECUTIVE_WHATSAPP}`;
    case 'hola':
    case 'buenas':
    case 'menu':
    case 'men\u00fa':
    case 'inicio':
      return MAIN_MENU;
    default:
      return MAIN_MENU;
  }
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

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message || `WhatsApp HTTP ${response.status}`);
  }
};

// Reemplaza tus export async function GET y POST con esto:
module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const { query } = req;
        const mode = query['hub.mode'];
        const token = query['hub.verify_token'];
        const challenge = query['hub.challenge'];

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            return res.status(200).send(challenge);
        }
        return res.status(403).send('Forbidden');
    }

    if (req.method === 'POST') {
        const body = req.body;
        // ... aquí va tu lógica de manejo de mensajes ...
        return res.status(200).send('EVENT_RECEIVED');
    }
};
