import nodemailer, { Transporter, TransportOptions } from 'nodemailer';
import debug from 'debug';
import { Email } from '../interfaces/email.interface';

const log: debug.IDebugger = debug('app:email-service');

class EmailService {
  transporter: Transporter | undefined;

  constructor() {
    this.connect();
  }

  getTransporter() {
    return this.transporter;
  }

  connect = () => {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '578'),
      secure: (process.env.SMTP_SECURE || 'false') === 'true',
      requireTLS: (process.env.SMTP_TLS || 'true') === 'true',
      auth: {
        user: process.env.SMTP_USER || 'username',
        pass: process.env.SMTP_PASSWORD || 'password',
      },
      logger: false,
    } as TransportOptions);
  };

  async sendMail(requestId: string | number | string[], options: Email) {
    return await (this.transporter as Transporter)
      .sendMail({
        from: `"NO-REPLY" ${process.env.SMTP_SENDER || options.from}`,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
      })
      .then(info => {
        log(`${requestId} - Mail sent successfully`);
        log(
          `${requestId} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`,
        );

        return info;
      });
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return new Promise(resolve => resolve(false));
    }

    return this.transporter.verify();
  }
}

export default new EmailService();
