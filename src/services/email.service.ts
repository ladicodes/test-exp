import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import ejs from "ejs";
import path from "path";
import fs from "fs/promises";
import { config } from "../config";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  data?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  private transporter: Transporter;
  private templatesPath: string;
  private defaultFrom: string;

  constructor(
    config: EmailConfig,
    templatesPath = path.join(process.cwd(), "src", "templates", "emails"),
    defaultFrom = config.auth.user
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    this.templatesPath = templatesPath;
    this.defaultFrom = defaultFrom;
  }

  /**
   * Verify the email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("Email service connection verified successfully");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }

  /**
   * Load and render an EJS template
   */
  private async renderTemplate(
    templateName: string,
    data: Record<string, any> = {}
  ): Promise<string> {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);
      const templateContent = await fs.readFile(templatePath, "utf-8");

      return ejs.render(templateContent, data);
    } catch (error) {
      throw new Error(
        `Failed to render template "${templateName}": ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Send a single email
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      let html = options.html;
      let text = options.text;

      if (options.template) {
        html = await this.renderTemplate(options.template, options.data || {});

        if (!text) {
          text = html
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim();
        }
      }

      const mailOptions: SendMailOptions = {
        from: this.defaultFrom,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        html,
        text,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error("Failed to send email:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Send multiple emails (batch)
   */
  async sendBulkEmails(emails: EmailOptions[]): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const email of emails) {
      const result = await this.sendEmail(email);
      results.push(result);

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(
    to: string,
    userData: { name: string; email: string }
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: "Welcome to Our Squad Hackademy!",
      template: "welcome",
      data: userData,
    });
  }

  /**
   * Send email confirmation
   */
  async sendEmailConfirmation(
    to: string,
    confirmationData: {
      name: string;
      email: string;
      otp: string;
      expirationTime?: string;
    }
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: "Please Confirm Your Email Address",
      template: "email-confirmation",
      data: confirmationData,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    data: { otp: string; name: string }
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: "Password Reset Request",
      template: "password-reset",
      data,
    });
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(
    to: string | string[],
    notificationData: { title: string; message: string; actionUrl?: string }
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: notificationData.title,
      template: "notification",
      data: notificationData,
    });
  }

  /**
   * Close the transporter connection
   */
  close(): void {
    this.transporter.close();
  }
}

export const createEmailService = (config: EmailConfig): EmailService => {
  return new EmailService(config);
};

export const emailServiceMiddleware = (emailService: EmailService) => {
  return (req: any, res: any, next: any) => {
    req.emailService = emailService;
    next();
  };
};

export const emailConfig: EmailConfig = {
  host: config.email.host || "smtp.gmail.com",
  port: config.email.port || 587,
  secure: config.email.secure || true,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
};

export const emailService = createEmailService(emailConfig);
