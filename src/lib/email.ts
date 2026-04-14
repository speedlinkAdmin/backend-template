import nodemailer from 'nodemailer';
import { logger } from './logger';
import { Resend } from 'resend';


// smtp transporter
let transporter: nodemailer.Transporter | null = null;

export function getSmtpTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT || '587'),
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
    logger.info('SMTP transporter initialized');
  }
  return transporter;
}


export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = getSmtpTransporter();

  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  logger.info(`Email sent to ${to}`, { messageId: info.messageId });
  return info;
}


// resend transporter
let resendTransporter: Resend | null = null;

export function getResendTransporter() {
  if (!resendTransporter) {
    resendTransporter = new Resend(env.RESEND_API_KEY);
    logger.info('Resend transporter initialized');
  }
  return resendTransporter;
}

// example
// await resendTransporter.emails.send({
//   from: env.EMAIL_FROM,
//   to: ['delivered@resend.dev'],
//   subject: 'hello world',
//   html: '<p>it works!</p>',
// });