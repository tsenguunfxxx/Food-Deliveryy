/**
 * Имэйл илгээгч.
 *
 * RESEND_API_KEY тохируулсан бол Resend-ээр илгээнэ, үгүй бол
 * хөгжүүлэлтийн горимд холбоосыг лог руу хэвлэнэ. Өөр үйлчилгээ
 * (SendGrid, Postmark г.м.) руу шилжих бол зөвхөн энэ файлыг солино.
 */
const FROM = process.env.MAIL_FROM ?? "NomNom <onboarding@resend.dev>";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const send = async ({ to, subject, html, text }: SendArgs) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("\n─── ИМЭЙЛ (илгээгээгүй, RESEND_API_KEY алга) ───");
    console.log(`Хэнд : ${to}`);
    console.log(`Гарчиг: ${subject}`);
    console.log(text);
    console.log("───────────────────────────────────────────────\n");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html, text }),
  });

  if (!response.ok) {
    throw new Error(`Имэйл илгээж чадсангүй: ${await response.text()}`);
  }
};

export const sendPasswordResetEmail = async (to: string, link: string) => {
  await send({
    to,
    subject: "NomNom — нууц үг сэргээх",
    text: `Нууц үгээ шинэчлэхийн тулд энэ холбоосоор орно уу (1 цаг хүчинтэй):\n${link}\n\nХэрэв та хүсэлт илгээгээгүй бол энэ захиаг үл ойшооно уу.`,
    html: `
      <p>Нууц үгээ шинэчлэхийн тулд доорх холбоосоор орно уу. Холбоос <strong>1 цаг</strong> хүчинтэй.</p>
      <p><a href="${link}">Нууц үг шинэчлэх</a></p>
      <p style="color:#666;font-size:12px">Хэрэв та хүсэлт илгээгээгүй бол энэ захиаг үл ойшооно уу.</p>
    `,
  });
};
