import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConsoleMode: boolean;

  constructor() {
    this.isConsoleMode = process.env.FDP_MAIL_PROVIDER !== 'smtp';

    if (!this.isConsoleMode && process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendEmail(opts: SendEmailOptions): Promise<boolean> {
    const from = process.env.EMAIL_FROM || '"Fair Deal Properties" <no-reply@fairdealng.com>';

    if (this.isConsoleMode || !this.transporter) {
      console.log('\n─────────────────────────────────────────────────────────────────────────────');
      console.log('📧 [EMAIL DISPATCHER (LOCAL/CONSOLE MODE)]');
      console.log(`To:      ${opts.to}`);
      console.log(`From:    ${from}`);
      console.log(`Subject: ${opts.subject}`);
      console.log('Content:');
      console.log(opts.text || opts.html.replace(/<[^>]*>?/gm, ''));
      console.log('─────────────────────────────────────────────────────────────────────────────\n');
      return true;
    }

    try {
      await this.transporter.sendMail({
        from,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      });
      return true;
    } catch (err) {
      console.error('❌ Failed to dispatch email via SMTP:', err);
      return false;
    }
  }

  async notifyAgentAssigned(agentEmail: string, agentName: string, itemType: string, reference: string, clientName?: string) {
    const subject = `[Assignment Alert] New ${itemType} assigned to you (${reference})`;
    const html = `
      <div style="font-family: sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="color: #0d2b1e;">Fair Deal Properties Ltd</h2>
        <p>Hello <strong>${agentName}</strong>,</p>
        <p>You have been assigned to handle a new <strong>${itemType}</strong>:</p>
        <ul>
          <li><strong>Reference:</strong> ${reference}</li>
          ${clientName ? `<li><strong>Client:</strong> ${clientName}</li>` : ''}
          <li><strong>Status:</strong> Active</li>
        </ul>
        <p>Please log in to the <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/admin">Admin Portal</a> to review the full details and initiate contact.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <small style="color: #6b7280;">Fair Deal Properties Ltd · Abuja, Nigeria</small>
      </div>
    `;
    return this.sendEmail({ to: agentEmail, subject, html });
  }

  async notifyInspectionStageUpdate(clientEmail: string, clientName: string, reference: string, stageNum: number, stageTitle: string, reportUrl?: string) {
    const subject = `[Inspection Update] Reference ${reference} - Stage ${stageNum}: ${stageTitle}`;
    const html = `
      <div style="font-family: sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="color: #0d2b1e;">Fair Deal Properties Ltd - Inspection Hub</h2>
        <p>Dear <strong>${clientName}</strong>,</p>
        <p>Your property inspection has advanced to <strong>Stage ${stageNum} of 9</strong>:</p>
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; margin: 16px 0;">
          <h3 style="margin: 0; color: #15803d;">${stageTitle}</h3>
        </div>
        ${reportUrl ? `<p>📄 <strong>Inspection Dossier Available:</strong> <a href="${reportUrl}">Download Verified Report</a></p>` : ''}
        <p>You can track the live progress of your inspection at any time on our portal:</p>
        <p><a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/inspections" style="display: inline-block; background-color: #0d2b1e; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 4px;">Track Inspection (${reference})</a></p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <small style="color: #6b7280;">Fair Deal Properties Ltd · Technology-Enabled Real Estate Verification</small>
      </div>
    `;
    return this.sendEmail({ to: clientEmail, subject, html });
  }

  async notifyPriceAlert(adminEmail: string, sourceName: string, targetTitle: string, oldValue: string, newValue: string) {
    const subject = `[Live Price Alert] Price/Rate movement detected from ${sourceName}`;
    const html = `
      <div style="font-family: sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="color: #0d2b1e;">Fair Deal Properties Ltd - Market Listener</h2>
        <p>The background price listener detected a rate or price update from <strong>${sourceName}</strong>:</p>
        <ul>
          <li><strong>Target:</strong> ${targetTitle}</li>
          <li><strong>Previous Value:</strong> ${oldValue || 'N/A'}</li>
          <li><strong>New Detected Value:</strong> <span style="color: #b91c1c; font-weight: bold;">${newValue}</span></li>
        </ul>
        <p>Log in to the Admin Portal to review and approve this update before it reflects publicly.</p>
      </div>
    `;
    return this.sendEmail({ to: adminEmail, subject, html });
  }
}

export const emailService = new EmailService();
