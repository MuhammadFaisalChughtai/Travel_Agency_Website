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
      host: "terrifictravel.co.uk",
      port: 465,
      secure: true,
      auth: {
        user: "inquires@terrifictravel.co.uk",
        pass: process.env.SMTP_PASSWORD || "", // Using env variable for security
      },
      tls: {
        // Do not fail on invalid certs if any
        rejectUnauthorized: false
      }
    });

    let successCount = 0;
    
    // Send emails individually to personalize them
    for (const customer of customers) {
      const personalizedContent = content.replace(/{{name}}/g, customer.name);
      
      try {
        await transporter.sendMail({
          from: '"Terrific Travel" <inquires@terrifictravel.co.uk>',
          to: customer.email,
          subject: subject,
          html: personalizedContent,
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
