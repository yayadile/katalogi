import nodemailer from "nodemailer";

export const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  }); 

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const appName = process.env.APP_NAME ?? "Katalogi";
  const fromEmail = process.env.OTP_FROM_EMAIL ?? process.env.EMAIL_USER;

  await transporter.sendMail({
    from: `"${appName} OTP" <${fromEmail}>`,
    to: email,
    subject: `Kode OTP ${appName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h1 style="color: #333;">Kode OTP Anda</h1>
        <h2 style="letter-spacing: 8px; font-size: 32px; text-align: center; color: #6366f1;">${otp}</h2>
        <p style="color: #666;">Kode ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.</p>
      </div>
    `,
  });
}