import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const INQUIRY_TO = "inquires@terrifictravel.co.uk";
export const INQUIRY_FROM = process.env.SMTP_FROM ?? "no-reply@terrifictravel.co.uk";
