import { mockStorage } from "@/types/mockData";

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  sentAt: Date;
  verificationCode?: string;
  verificationLink?: string;
}

// Sender email address for TeleHealth
export const TELEHEALTH_SENDER_EMAIL = "noreply@telehealth.com";
export const TELEHEALTH_SENDER_NAME = "TeleHealth";

/**
 * Generate a verification code
 */
function generateVerificationCode(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Generate a verification link
 */
function generateVerificationLink(email: string, code: string): string {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  return `${baseUrl}/verify-email?email=${encodeURIComponent(email)}&code=${code}`;
}

/**
 * Send a verification email (mock implementation)
 */
export function sendVerificationEmail(
  to: string,
  userName?: string
): EmailMessage {
  const verificationCode = generateVerificationCode();
  const verificationLink = generateVerificationLink(to, verificationCode);

  const email: EmailMessage = {
    id: `email_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    from: TELEHEALTH_SENDER_EMAIL,
    to: to,
    subject: "Verify Your TeleHealth Account",
    body: `Hello ${userName || "there"},

Thank you for signing up for TeleHealth!

Please verify your email address by clicking on the following link:
${verificationLink}

Or use this verification code: ${verificationCode}

This link will expire in 24 hours.

If you didn't create an account with TeleHealth, please ignore this email.

Best regards,
The TeleHealth Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Roboto', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #6685FF; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 30px; background-color: #6685FF; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TeleHealth</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hello ${userName || "there"},</p>
            <p>Thank you for signing up for TeleHealth!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            <p>Or use this verification code: <strong>${verificationCode}</strong></p>
            <p><small>This link will expire in 24 hours.</small></p>
            <p>If you didn't create an account with TeleHealth, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The TeleHealth Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    sentAt: new Date(),
    verificationCode: verificationCode,
    verificationLink: verificationLink,
  };

  // Store the email in mock storage
  const emailsKey = `emails:${to}`;
  const existingEmails = mockStorage.get(emailsKey);
  const emails: EmailMessage[] = existingEmails
    ? JSON.parse(existingEmails)
    : [];
  emails.push(email);
  mockStorage.set(emailsKey, JSON.stringify(emails));

  // Store verification code for verification
  mockStorage.set(`verification:${to}`, verificationCode);
  mockStorage.set(`verification:${verificationCode}`, to);

  console.log(
    `[Mock Email Service] Email sent from ${TELEHEALTH_SENDER_EMAIL} to ${to}`
  );
  console.log(`[Mock Email Service] Verification code: ${verificationCode}`);
  console.log(`[Mock Email Service] Verification link: ${verificationLink}`);

  return email;
}

/**
 * Get all emails sent to a specific address
 */
export function getEmailsForAddress(email: string): EmailMessage[] {
  const emailsKey = `emails:${email}`;
  const emailsData = mockStorage.get(emailsKey);
  if (!emailsData) return [];

  const emails: EmailMessage[] = JSON.parse(emailsData);
  return emails.map((email) => ({
    ...email,
    sentAt: new Date(email.sentAt),
  }));
}

/**
 * Verify an email with a code
 */
export function verifyEmailWithCode(email: string, code: string): boolean {
  const storedCode = mockStorage.get(`verification:${email}`);
  return storedCode === code;
}
