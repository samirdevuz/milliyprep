/**
 * Delivery of verification codes. In development (no provider configured)
 * the code is logged to the server console and also returned to the client
 * so the flow is demonstrable. In production, plug in a real email (SMTP /
 * Resend) or SMS (Eskiz / Play Mobile) provider here.
 */

const isDev = process.env.NODE_ENV !== "production";

export interface DeliveryResult {
  delivered: boolean;
  /** In dev we expose the code so the UI can show it. Never set in prod. */
  devCode?: string;
}

export async function sendEmailCode(
  email: string,
  code: string
): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM ?? "MilliyPrep <no-reply@milliyprep.xyz>",
          to: email,
          subject: "MilliyPrep tasdiqlash kodi",
          text: `Tasdiqlash kodingiz: ${code}\nKod 10 daqiqa amal qiladi.`,
        }),
      });
      return { delivered: res.ok };
    } catch {
      return { delivered: false };
    }
  }

  // Dev fallback
  if (!isDev) {
    return { delivered: false };
  }
  console.info(`[MilliyPrep] Email kodi ${email}: ${code}`);
  return { delivered: true, devCode: code };
}

export async function sendSmsCode(
  phone: string,
  code: string
): Promise<DeliveryResult> {
  const eskizToken = process.env.ESKIZ_TOKEN;

  if (eskizToken) {
    try {
      const form = new URLSearchParams({
        mobile_phone: phone.replace(/\D/g, ""),
        message: `MilliyPrep tasdiqlash kodi: ${code}`,
        from: process.env.ESKIZ_FROM ?? "4546",
      });
      const res = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${eskizToken}` },
        body: form,
      });
      return { delivered: res.ok };
    } catch {
      return { delivered: false };
    }
  }

  if (!isDev) {
    return { delivered: false };
  }
  console.info(`[MilliyPrep] SMS kodi ${phone}: ${code}`);
  return { delivered: true, devCode: code };
}
