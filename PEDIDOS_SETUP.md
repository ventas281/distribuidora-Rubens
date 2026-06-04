# Configuracion de pedidos

1. Ejecuta `supabase/pedidos.sql` en el SQL Editor del proyecto Supabase.
2. Configura estas variables en Netlify:

```text
SUPABASE_URL=https://jlxrrqjqqbbrzfzmlyuw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
SALES_EMAIL=ventas@rubensdistribuidora.com
ORDER_EMAIL_FROM=Rubens Distribuidora <pedidos@rubensdistribuidora.com>
```

WhatsApp oficial del negocio: `5539318779` (`https://wa.me/525539318779`).

`SUPABASE_SERVICE_ROLE_KEY` y `RESEND_API_KEY` deben existir solo en Netlify, nunca
en archivos publicos. El remitente configurado en `ORDER_EMAIL_FROM` debe estar
verificado en Resend.

La funcion `netlify/functions/createOrder.js` guarda el pedido y envia la
notificacion interna. Si el sitio se sirve sin funciones Netlify, el checkout
intenta guardar directamente con la clave publica y las politicas RLS incluidas
en `supabase/pedidos.sql`; en ese caso el correo automatico no se envia.
