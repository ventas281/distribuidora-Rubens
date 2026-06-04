# Configuracion de pedidos

1. Ejecuta `supabase/pedidos.sql` en el SQL Editor del proyecto Supabase.
2. Configura estas variables en Vercel:

```text
SUPABASE_URL=https://jlxrrqjqqbbrzfzmlyuw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=...
```

WhatsApp oficial del negocio: `5539318779` (`https://wa.me/525539318779`).

`SUPABASE_SERVICE_ROLE_KEY`, `MAILGUN_API_KEY` y `MAILGUN_DOMAIN` deben existir
solo en Vercel, nunca en archivos publicos. El dominio configurado debe estar
verificado en Mailgun para usarlo como remitente.

La funcion `api/createOrder.js` guarda el pedido y llama internamente al helper
Mailgun para enviar la notificacion a ventas y la confirmacion al cliente. Si
Mailgun falla, el pedido permanece guardado. `api/send-order-email.js` reutiliza
el mismo helper para envios manuales o pruebas.
