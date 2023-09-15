import nodemailer, { Transporter } from "nodemailer";
import { Options } from "nodemailer/lib/smtp-transport";
import dotenv from "dotenv";
dotenv.config();

const configOptions: Options = {
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export class Mailer {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(configOptions);
  }

  async sendFound(): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      subject: "Slot Available!",
      text: "New slots were found for scheduling.",
    });
  }
}
