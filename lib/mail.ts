// lib/mail.ts
import { resend } from "./resend";

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: "Tu App <onboarding@resend.dev>",
      to: email,
      subject: "Restablecer contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Restablecer contraseña</h2>
          <p>Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${confirmLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
            Restablecer contraseña
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Si tú no solicitaste este cambio, puedes ignorar este mensaje. El enlace expirará pronto.
          </p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error al enviar el correo de restablecimiento:", error);
    return { success: false, error };
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verification?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: "Tu App <onboarding@resend.dev>",
      to: email,
      subject: "Confirma tu correo electrónico",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>¡Bienvenido a la plataforma!</h2>
          <p>Por favor, haz clic en el siguiente enlace para verificar tu cuenta de correo electrónico:</p>
          <a href="${confirmLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
            Verificar mi correo
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Si tú no solicitaste esto, puedes ignorar este mensaje.
          </p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error al enviar el correo de verificación:", error);
    return { success: false, error };
  }
};


// **************

const getBaseTemplate = (title: string, content: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
          <td style="background-color: #0f172a; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">E-Commerce Store</h1>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding: 30px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">© ${new Date().getFullYear()} E-Commerce Store. Todos los derechos reservados.</p>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;


// 2. Correo de Confirmación de Pedido
interface OrderEmailData {
  orderId: string;
  total: number | string;
  addressStreet: string;
  municipioName: string;
  items: Array<{ productName: string; quantity: number; unitPrice: number | string }>;
}

export async function sendOrderConfirmationEmail(email: string, orderData: OrderEmailData) {
  const itemsList = orderData.items
    .map(
      (item) => `
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${item.productName} (x${item.quantity})</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">Q${Number(item.unitPrice).toFixed(2)}</td>
            </tr>
        `
    )
    .join("");

  const content = `
        <h2 style="color: #0f172a; margin-top: 0;">¡Hemos recibido tu pedido! 📦</h2>
        <p>Gracias por tu compra. Tu pedido con ID <strong>#${orderData.orderId.slice(0, 8)}</strong> ha sido registrado correctamente y se encuentra en procesamiento.</p>
        
        <h3 style="color: #0f172a; margin-top: 20px;">Resumen de la compra:</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
            ${itemsList}
            <tr>
                <td style="padding: 12px 0; font-weight: bold; font-size: 16px;">Total Pagado:</td>
                <td style="padding: 12px 0; font-weight: bold; font-size: 16px; text-align: right; color: #16a34a;">Q${Number(orderData.total).toFixed(2)}</td>
            </tr>
        </table>

        <h3 style="color: #0f172a;">Dirección de Entrega:</h3>
        <p style="margin: 0; background-color: #f1f5f9; padding: 12px; border-radius: 6px;">
            ${orderData.addressStreet}, ${orderData.municipioName}
        </p>
    `;

  return await resend.emails.send({
    from: "Tu App <onboarding@resend.dev>",
    to: email,
    subject: `Confirmación de Pedido #${orderData.orderId.slice(0, 8)}`,
    html: getBaseTemplate("Confirmación de Pedido", content),
  });
}

// 3. Correo de Notificación "Pedido Listo" (Transición EN_PREPARACION -> LISTO)
export async function sendOrderReadyEmail(email: string, orderId: string, customerName: string) {
  const content = `
        <h2 style="color: #0f172a; margin-top: 0;">¡Tu pedido está listo! 🚀</h2>
        <p>Hola, <strong>${customerName}</strong>.</p>
        <p>Nos alegra informarte que tu pedido <strong>#${orderId.slice(0, 8)}</strong> ha sido preparado exitosamente y ya está listo para ser enviado o retirado según tus opciones de entrega.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${domain}/pedidos/${orderId}" style="background-color: #16a34a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Ver Estado del Pedido</a>
        </div>
    `;

  return await resend.emails.send({
    from: "Tu App <onboarding@resend.dev>",
    to: email,
    subject: `¡Tu pedido #${orderId.slice(0, 8)} está listo!`,
    html: getBaseTemplate("Pedido Listo", content),
  });
}