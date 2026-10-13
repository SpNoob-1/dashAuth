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
            Si tú no solicitaste este cambio, puedes ignorar este mensaje.
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