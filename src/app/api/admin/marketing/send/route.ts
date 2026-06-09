import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 });
    }

    const customers = await prisma.customer.findMany();
    
    if (customers.length === 0) {
      return NextResponse.json({ error: "No customers found to send email to." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "mail.terrifictravel.co.uk",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || "inquires@terrifictravel.co.uk",
        pass: process.env.SMTP_PASSWORD || "", // Using env variable for security
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let successCount = 0;
    
    // Send emails individually to personalize them
    for (const customer of customers) {
      const personalizedContent = content.replace(/{{name}}/g, customer.name);
      const personalizedSubject = subject.replace(/{{name}}/g, customer.name);
      
      const htmlWrapper = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eed6c4;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      
      <!-- Header / Logo -->
      <tr>
        <td style="background-color:#382626;padding:32px;text-align:center;">
          <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(238,214,196,0.3);border-radius:12px;padding:16px 24px;display:inline-block;">
            <span style="color:#eed6c4;font-size:22px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;">Terrific Travel</span>
          </div>
        </td>
      </tr>

      <!-- Dynamic Content Body -->
      <tr>
        <td style="padding:40px 32px;color:#2a1a1a;font-size:15px;line-height:1.6;">
          ${personalizedContent}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f8fafc;padding:32px;border-top:1px solid #eed6c4;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:16px;">
                <p style="margin:0;font-size:14px;color:#6b4f4f;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;">Contact Us</p>
              </td>
            </tr>
            <tr>
              <td>
                <p style="margin:6px 0;font-size:13px;">
                  <strong style="color:#382626;">WhatsApp:</strong> 
                  <a href="https://wa.me/441215291630" style="color:#6b4f4f;text-decoration:none;font-weight:600;">+44 1215 291630</a>
                </p>
                <p style="margin:6px 0;font-size:13px;">
                  <strong style="color:#382626;">Direct Line:</strong> 
                  <a href="tel:+441215291630" style="color:#6b4f4f;text-decoration:none;font-weight:600;">+44 1215 291630</a>
                </p>
                <p style="margin:6px 0;font-size:13px;">
                  <strong style="color:#382626;">Email:</strong> 
                  <a href="mailto:inquires@terrifictravel.co.uk" style="color:#6b4f4f;text-decoration:underline;">inquires@terrifictravel.co.uk</a>
                </p>
                <p style="margin:6px 0;font-size:13px;">
                  <strong style="color:#382626;">Website:</strong> 
                  <a href="https://terrifictravel.co.uk" style="color:#6b4f4f;text-decoration:underline;">www.terrifictravel.co.uk</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Bottom Bar -->
      <tr>
        <td style="background:#382626;padding:16px;text-align:center;">
          <p style="margin:0;color:#eed6c4;font-size:11px;opacity:0.8;">&copy; ${new Date().getFullYear()} Terrific Travel Ltd. All rights reserved.</p>
        </td>
      </tr>
    </table>
    <p style="margin-top:16px;font-size:11px;color:#888;">You are receiving this email because you subscribed to Terrific Travel offers.</p>
  </td></tr>
</table>
</body>
</html>
      `;

      try {
        await transporter.sendMail({
          from: '"Terrific Travel" <inquires@terrifictravel.co.uk>',
          to: customer.email,
          subject: personalizedSubject,
          html: htmlWrapper,
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${customer.email}:`, err);
      }
    }

    // Save newsletter record
    await prisma.newsletter.create({
      data: {
        subject,
        content,
        recipientCount: successCount,
      }
    });

    return NextResponse.json({ success: true, count: successCount, total: customers.length });
  } catch (error: any) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ error: "Failed to process newsletter campaign." }, { status: 500 });
  }
}
