import nodemailer from 'nodemailer';
import { logger } from './logger';

let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    logger.info('Email transporter initialized');
  }
  return transporter;
}


export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = getEmailTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  logger.info(`Email sent to ${to}`, { messageId: info.messageId });
  return info;
}