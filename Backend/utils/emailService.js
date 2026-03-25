// Email service template
// For production, integrate with services like:
// - Nodemailer (SMTP)
// - SendGrid
// - AWS SES
// - Mailgun

const logger = require('./logger');

class EmailService {
  constructor() {
    // Initialize email service based on environment
    this.enabled = process.env.EMAIL_ENABLED === 'true';
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@hms.com';
    this.fromName = process.env.EMAIL_FROM_NAME || 'HMS System';
  }

  async sendEmail(to, subject, html, text) {
    if (!this.enabled) {
      logger.warn(`Email service disabled. Would send to ${to}: ${subject}`);
      return { success: true, message: 'Email service disabled (development mode)' };
    }

    try {
      // TODO: Implement actual email sending
      // Example with Nodemailer:
      // const transporter = nodemailer.createTransport({
      //   host: process.env.SMTP_HOST,
      //   port: process.env.SMTP_PORT,
      //   secure: true,
      //   auth: {
      //     user: process.env.SMTP_USER,
      //     pass: process.env.SMTP_PASS
      //   }
      // });
      // 
      // await transporter.sendMail({
      //   from: `"${this.fromName}" <${this.fromEmail}>`,
      //   to,
      //   subject,
      //   text,
      //   html
      // });

      logger.info(`Email sent to ${to}: ${subject}`);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(userEmail, firstName) {
    const subject = 'Welcome to HMS';
    const html = `
      <h1>Welcome to Hospital Management System</h1>
      <p>Hello ${firstName},</p>
      <p>Your account has been created successfully.</p>
      <p>Please complete your profile to get started.</p>
    `;
    const text = `Welcome ${firstName}, Your account has been created. Please complete your profile.`;

    return this.sendEmail(userEmail, subject, html, text);
  }

  async sendPasswordResetEmail(userEmail, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link will expire in 1 hour.</p>
    `;
    const text = `Password reset link: ${resetUrl}`;

    return this.sendEmail(userEmail, subject, html, text);
  }

  async sendAppointmentConfirmation(patientEmail, appointmentDetails) {
    const subject = 'Appointment Confirmed';
    const html = `
      <h1>Appointment Confirmed</h1>
      <p>Your appointment has been confirmed.</p>
      <p><strong>Date:</strong> ${appointmentDetails.date}</p>
      <p><strong>Time:</strong> ${appointmentDetails.time}</p>
      <p><strong>Doctor:</strong> ${appointmentDetails.doctor}</p>
    `;
    const text = `Appointment confirmed for ${appointmentDetails.date} at ${appointmentDetails.time}`;

    return this.sendEmail(patientEmail, subject, html, text);
  }
}

module.exports = new EmailService();
