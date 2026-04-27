import { Resend } from 'resend';
import { env } from '../configs/env.config';
import { logger } from './logger';
import { render } from 'jsx-email';
import fs from 'fs';
import path from 'path';

const resend = new Resend(env.RESEND_API_KEY);

// Cache the logo buffer
let logoBuffer: Buffer | null = null;
try {
  const logoPath = path.join(process.cwd(), 'src/assets/logo-transparent.png');
  if (fs.existsSync(logoPath)) {
    logoBuffer = fs.readFileSync(logoPath);
  }
} catch (error) {
  logger.warn('Could not load email logo asset:', error);
}

export async function sendEmail(to: string, subject: string, html: string, attachments: any[] = []) {
  try {
    const finalAttachments = [...attachments];

    // Automatically attach logo if cid:logo is detected in html
    if (html.includes('cid:logo') && logoBuffer) {
      finalAttachments.push({
        filename: 'logo.png',
        content: logoBuffer,
        cid: 'logo'
      });
    }

    const { data, error } = await resend.emails.send({
      from: `${env.APP_NAME || 'SpeedKonnect'} <${env.SMTP_USER || ''}>`,
      to: [to],
      subject,
      html,
      attachments: finalAttachments.map(att => ({
        filename: att.filename,
        content: att.content || att.path,
        cid: att.cid
      })),
    });

    if (error) {
      logger.error('Resend email error:', error);
      throw error;
    }

    logger.info(`Email sent to ${to}`, { messageId: data?.id });
    return data;
  } catch (error: any) {
    logger.error('Failed to send email:', error.message);
    throw error;
  }
}

/**
 * Renders a React component to an HTML string using jsx-email
 */
export async function renderEmail(component: any) {
  return await render(component);
}

export default resend;
