import nodemailer from "nodemailer";

const rawHost = process.env.SMTP_HOST;
// If the host is exactly the root domain, Cloudflare will block port 465. We force it to use 'mail.' to bypass proxy.
const safeHost = (!rawHost || rawHost === "terrifictravel.co.uk") ? "mail.terrifictravel.co.uk" : rawHost;

export const transporter = nodemailer.createTransport({
  host: safeHost,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER || "inquires@terrifictravel.co.uk",
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const INQUIRY_TO = "inquires@terrifictravel.co.uk";
export const INQUIRY_FROM = process.env.SMTP_FROM || "no-reply@terrifictravel.co.uk";
