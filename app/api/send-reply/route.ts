import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, text, html } = await request.json();

    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: 'Missing required fields (to, subject, text)' },
        { status: 400 }
      );
    }

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      return NextResponse.json(
        { error: 'Server belum dikonfigurasi untuk mengirim email. Harap tambahkan EMAIL_USER dan EMAIL_PASS di Environment Variables Vercel.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: user.trim(),
        pass: pass.trim().replace(/\s+/g, ''), // Hapus spasi jika disalin dari format Google App Password (xxxx xxxx xxxx xxxx)
      },
    });

    const defaultHtml = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e4e4e7; background-color: #ffffff; color: #18181b;">
        <div style="border-bottom: 1px solid #e4e4e7; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 12px; font-weight: 800; letter-spacing: 0.05em; font-family: monospace; text-transform: uppercase; color: #18181b;">
            BALASAN PESAN
          </span>
        </div>
        <div style="font-size: 14px; line-height: 1.6; color: #27272a; white-space: pre-wrap;">${text}</div>
        <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #e4e4e7; font-size: 10px; color: #71717a; font-family: monospace; text-transform: uppercase; letter-spacing: 0.05em;">
          Pesan ini dikirim oleh pengelola portofolio.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Portofolio" <${user.trim()}>`,
      to,
      subject,
      text,
      html: html || defaultHtml,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, messageId: info.messageId }, { status: 200 });
  } catch (error: any) {
    console.error("Error sending email:", error);
    let errorMessage = error.message || 'Gagal mengirim email.';
    if (errorMessage.includes('535') || errorMessage.includes('BadCredentials') || errorMessage.includes('Username and Password not accepted')) {
      errorMessage = 'Gagal Autentikasi Gmail (535 Bad Credentials). Pastikan EMAIL_USER dan EMAIL_PASS (Google App Password 16 karakter) sudah dikonfigurasi di Environment Variables Vercel dan proyek telah di-redeploy.';
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
