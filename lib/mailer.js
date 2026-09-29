import nodemailer from 'nodemailer';
import { getDb } from './db';

const RECIPIENT_EMAIL = 'Info@firstclassglobaleducation.com';

export async function sendLeadNotification(lead) {
  try {
    const db = getDb();
    const smtpSettings = db?.settings?.smtp || {};

    const host = smtpSettings.host || process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = smtpSettings.port || process.env.SMTP_PORT || 465;
    const user = smtpSettings.user || process.env.SMTP_USER || '';
    const pass = smtpSettings.pass || process.env.SMTP_PASS || '';
    const recipient = db?.settings?.leadEmail || RECIPIENT_EMAIL;

    // Build beautiful HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 24px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">First Class Global Education</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #cbd5e1;">🎓 New Student Admission & Demo Inquiry Received</p>
        </div>

        <div style="padding: 24px; color: #334155;">
          <div style="background: #f8fafc; border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #0f172a; font-weight: bold;">
              High Priority Lead: Call within 15-30 minutes for best conversion!
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b; width: 140px;">Student Name:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: bold; font-size: 15px;">${lead.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Phone Number:</td>
              <td style="padding: 10px 0;">
                <a href="tel:${lead.phone}" style="color: #ef4444; font-weight: bold; text-decoration: none; font-size: 15px;">
                  📞 ${lead.phone || 'N/A'}
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Email Address:</td>
              <td style="padding: 10px 0; color: #0f172a;">${lead.email || 'Not provided'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Interested Course:</td>
              <td style="padding: 10px 0; color: #1e3a8a; font-weight: bold;">${lead.course || 'IELTS Preparation'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Target Band / Score:</td>
              <td style="padding: 10px 0; color: #059669; font-weight: bold;">${lead.targetBand || '7.5+ Bands'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">City / Location:</td>
              <td style="padding: 10px 0; color: #0f172a;">${lead.city || 'Not provided'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Message / Query:</td>
              <td style="padding: 10px 0; color: #475569; font-style: italic;">"${lead.message || 'No additional message'}"</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Received At:</td>
              <td style="padding: 10px 0; color: #64748b;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 25px;">
            <a href="tel:${lead.phone}" style="background: #ef4444; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; margin-right: 10px;">
              Call Student Now
            </a>
            <a href="https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}" style="background: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
              WhatsApp Student
            </a>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          This lead was automatically captured from <strong>firstclassglobaleducation.com</strong>
        </div>
      </div>
    `;

    // If SMTP credentials are configured, dispatch real email
    if (user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"First Class Global Education Leads" <${user}>`,
        to: recipient,
        subject: `🔥 New Student Lead: ${lead.name} (${lead.course}) - ${lead.phone}`,
        html: htmlContent,
      });

      console.log(`[EMAIL DISPATCHED] Lead notification successfully sent to ${recipient}`);
      return { success: true };
    } else {
      console.log(`[EMAIL NOTICE] Lead captured for ${recipient}. To send live email via SMTP, please configure SMTP in Admin Settings or set SMTP_USER / SMTP_PASS.`);
      return { success: true, pendingSmtpConfig: true };
    }
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send lead notification:', error);
    return { success: false, error: error.message };
  }
}
