import { NextRequest, NextResponse } from "next/server";
import { transporter, INQUIRY_TO, INQUIRY_FROM } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PHONE = "+44 1215 291630";
const PHONE_HREF = "tel:+441215291630";
const WA_HREF = "https://wa.me/441215291630";
const EMAIL = "inquires@terrifictravel.co.uk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      airport,
      date,
      category,
      duration,
      travelers,
      message,
      type,
      packageId,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    const tripDetails = JSON.stringify({
      airport,
      date,
      category,
      duration,
      travelers,
      packageId,
    });

    const formattedType = type
      ? type.charAt(0).toUpperCase() + type.slice(1)
      : "General Enquiry";

    await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        type: formattedType,
        message,
        tripDetails,
        status: "PENDING",
      },
    });

    const subject = type
      ? `New ${formattedType} Enquiry${packageId ? ` — ${packageId}` : ""} from ${name}`
      : `New General Enquiry from ${name}`;

    // ─── Company notification email ──────────────────────────────────────────
    const companyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      body, .email-bg-wrapper {
        background-color: #1a1010 !important;
      }
      .email-main-card {
        background-color: #2b1c1c !important;
        border-color: #4a3434 !important;
      }
      .email-details-card {
        background-color: #3d2727 !important;
        border-color: #5c3f3f !important;
      }
      .email-details-label {
        color: #eed6c4 !important;
        background-color: #2b1c1c !important;
      }
      .email-details-value {
        color: #fff3e4 !important;
      }
      .email-details-value a {
        color: #eed6c4 !important;
      }
      .email-details-row {
        border-bottom-color: #4a3434 !important;
      }
      .email-alert-banner {
        background-color: #3d2727 !important;
        border-bottom-color: #5c3f3f !important;
      }
      .email-alert-text {
        color: #eed6c4 !important;
      }
      .email-msg-td {
        background-color: #3d2727 !important;
        border-left-color: #eed6c4 !important;
      }
      .email-msg-label {
        color: #eed6c4 !important;
      }
      .email-msg-text {
        color: #fff3e4 !important;
      }
    }
  </style>
</head>
<body class="email-bg-wrapper" style="margin:0;padding:0;background:#f5f0eb;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" class="email-bg-wrapper" style="background:#f5f0eb;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" class="email-main-card" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e8d5c0;">

      <!-- Header -->
      <tr>
        <td bgcolor="#382626" style="background-color:#382626;background:linear-gradient(135deg,#2a1a1a 0%,#5a3a3a 100%);padding:36px 32px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(238,214,196,0.3);border-radius:12px;padding:10px 24px;margin-bottom:12px;">
            <span style="color:#eed6c4;font-size:18px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;">Terrific Travel Ltd</span>
          </div>
          <p style="color:#fff3e4;font-size:12px;margin:0;opacity:0.7;letter-spacing:0.2em;text-transform:uppercase;">New Enquiry Received</p>
        </td>
      </tr>

      <!-- Alert banner -->
      <tr>
        <td class="email-alert-banner" style="background:#fff8f0;border-bottom:1px solid #eed6c4;padding:14px 32px;">
          <p class="email-alert-text" style="margin:0;font-size:13px;color:#6b4f4f;font-weight:700;">
            <strong>${subject}</strong>
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px;">

          <!-- Contact Details Card -->
          <table width="100%" cellpadding="0" cellspacing="0" class="email-details-card" style="background:#fff8f0;border-radius:14px;border:1px solid #eed6c4;overflow:hidden;margin-bottom:24px;">
            <tr>
              <td style="background:#6b4f4f;padding:10px 18px;">
                <span style="color:#fff3e4;font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;">Contact Details</span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${
                    name
                      ? `
                  <tr>
                    <td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;width:130px;vertical-align:top;">
                      <span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Name</span>
                    </td>
                    <td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;">
                      <span class="email-details-value" style="font-size:14px;color:#2a1a1a;font-weight:700;">${name}</span>
                    </td>
                  </tr>`
                      : ""
                  }
                  ${
                    email
                      ? `
                  <tr>
                    <td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;width:130px;vertical-align:top;">
                      <span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Email</span>
                    </td>
                    <td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;">
                      <span class="email-details-value" style="font-size:14px;color:#6b4f4f;font-weight:700;"><a href="mailto:${email}" style="color:#6b4f4f;text-decoration:none;">${email}</a></span>
                    </td>
                  </tr>`
                      : ""
                  }
                  ${
                    phone
                      ? `
                  <tr>
                    <td style="padding:8px 0;width:130px;vertical-align:top;">
                      <span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Phone</span>
                    </td>
                    <td style="padding:8px 0;">
                      <span class="email-details-value" style="font-size:14px;color:#6b4f4f;font-weight:700;"><a href="tel:${phone}" style="color:#6b4f4f;text-decoration:none;">${phone}</a></span>
                    </td>
                  </tr>`
                      : ""
                  }
                </table>
              </td>
            </tr>
          </table>

          <!-- Trip Details Card -->
          ${
            airport || date || category || duration || travelers || packageId
              ? `
          <table width="100%" cellpadding="0" cellspacing="0" class="email-details-card" style="background:#fff8f0;border-radius:14px;border:1px solid #eed6c4;overflow:hidden;margin-bottom:24px;">
            <tr>
              <td style="background:#6b4f4f;padding:10px 18px;">
                <span style="color:#fff3e4;font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;">Trip Details</span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${airport ? `<tr><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid #eed6c4;width:130px;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Airport</span></td><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid #eed6c4;"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:600;">${airport}</span></td></tr>` : ""}
                  ${date ? `<tr><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid #eed6c4;width:130px;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Travel Date</span></td><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid #eed6c4;"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:600;">${date}</span></td></tr>` : ""}
                  ${category ? `<tr><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid #eed6c4;width:130px;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Hotel</span></td><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid #eed6c4;"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:600;">${category}</span></td></tr>` : ""}
                  ${duration ? `<tr><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid #eed6c4;width:130px;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Duration</span></td><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid #eed6c4;"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:600;">${duration} Nights</span></td></tr>` : ""}
                  ${travelers ? `<tr><td class="email-details-row" style="padding:7px 0;border-bottom:${packageId ? "1px solid #eed6c4" : "none"};width:130px;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Travelers</span></td><td class="email-details-row" style="padding:7px 0;border-bottom:${packageId ? "1px solid #eed6c4" : "none"};"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:600;">${travelers}</span></td></tr>` : ""}
                  ${packageId ? `<tr><td style="padding:7px 0;width:130px;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Package</span></td><td><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:600;">${packageId}</span></td></tr>` : ""}
                </table>
              </td>
            </tr>
          </table>`
              : ""
          }

          <!-- Message -->
          ${
            message
              ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td class="email-msg-td" style="background:#fff8f0;border-left:4px solid #6b4f4f;border-radius:0 10px 10px 0;padding:16px 20px;">
                <p class="email-msg-label" style="font-size:10px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 8px;">Message</p>
                <p class="email-msg-text" style="font-size:14px;color:#382626;line-height:1.7;margin:0;">${message}</p>
              </td>
            </tr>
          </table>`
              : ""
          }

          <!-- CTA to reply -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding-top:8px;">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display:inline-block;background-color:#382626;background:linear-gradient(135deg,#5a3a3a,#2a1a1a);color:#fff3e4;font-size:13px;font-weight:800;text-decoration:none;padding:14px 32px;border-radius:50px;letter-spacing:0.1em;text-transform:uppercase;">
                  Reply to ${name} &#8594;
                </a>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#2a1a1a;padding:20px 32px;text-align:center;">
          <p style="color:#eed6c4;font-size:11px;margin:0;opacity:0.6;">Sent automatically from the Terrific Travel Ltd website enquiry form.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

    // ─── Customer confirmation email ─────────────────────────────────────────
    const customerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      body, .email-bg-wrapper {
        background-color: #1a1010 !important;
      }
      .email-main-card {
        background-color: #2b1c1c !important;
        border-color: #4a3434 !important;
      }
      .email-greeting-title {
        color: #eed6c4 !important;
      }
      .email-greeting-text {
        color: #dfc8b4 !important;
      }
      .email-details-card {
        background-color: #3d2727 !important;
        border-color: #5c3f3f !important;
      }
      .email-details-label {
        color: #eed6c4 !important;
      }
      .email-details-value {
        color: #fff3e4 !important;
      }
      .email-details-row {
        border-bottom-color: #4a3434 !important;
      }
    }
  </style>
</head>
<body class="email-bg-wrapper" style="margin:0;padding:0;background:#f5f0eb;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" class="email-bg-wrapper" style="background:#f5f0eb;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" class="email-main-card" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e8d5c0;">

      <!-- Header -->
      <tr>
        <td bgcolor="#382626" style="background-color:#382626;background:linear-gradient(135deg,#2a1a1a 0%,#5a3a3a 100%);padding:40px 32px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(238,214,196,0.3);border-radius:12px;padding:10px 24px;margin-bottom:16px;">
            <span style="color:#eed6c4;font-size:18px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;">Terrific Travel Ltd</span>
          </div>
          <br>
          <div style="display:inline-block;background:#00b37a;border-radius:50%;width:52px;height:52px;line-height:52px;text-align:center;font-size:24px;margin:8px 0 4px;color:#ffffff;font-weight:bold;">✓</div>
          <p style="color:#fff3e4;font-size:13px;margin:8px 0 0;font-weight:700;letter-spacing:0.08em;">Enquiry Confirmed</p>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding:36px 32px 0;">
          <h2 class="email-greeting-title" style="color:#2a1a1a;font-size:22px;font-weight:900;margin:0 0 12px;">Thank you, ${name}!</h2>
          <p class="email-greeting-text" style="color:#5a4040;font-size:14px;line-height:1.8;margin:0 0 24px;">
            We have received your enquiry and one of our travel consultants will be in touch with you
            <strong style="color:#2a1a1a;" class="email-greeting-title">within 24 hours</strong> to discuss your options and provide the best possible quote tailored to your needs.
          </p>
        </td>
      </tr>

      <!-- Enquiry Summary -->
      ${
        airport || date || category || duration || travelers
          ? `
      <tr>
        <td style="padding:0 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" class="email-details-card" style="background:#fff8f0;border-radius:14px;border:1px solid #e8d5c0;overflow:hidden;">
            <tr>
              <td style="background:#6b4f4f;padding:12px 20px;">
                <span style="color:#fff3e4;font-size:10px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;">Your Enquiry Summary</span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${airport ? `<tr><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;width:145px;vertical-align:middle;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Airport</span></td><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:700;">${airport}</span></td></tr>` : ""}
                  ${date ? `<tr><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;width:145px;vertical-align:middle;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Travel Date</span></td><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:700;">${date}</span></td></tr>` : ""}
                  ${category ? `<tr><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;width:145px;vertical-align:middle;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Hotel</span></td><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:700;">${category}</span></td></tr>` : ""}
                  ${duration ? `<tr><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;width:145px;vertical-align:middle;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Duration</span></td><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid #eed6c4;"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:700;">${duration} Nights</span></td></tr>` : ""}
                  ${travelers ? `<tr><td style="padding:8px 0;width:145px;vertical-align:middle;"><span class="email-details-label" style="font-size:11px;color:#6b4f4f;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Travelers</span></td><td><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:700;">${travelers}</span></td></tr>` : ""}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
          : ""
      }

      <!-- Contact Us -->
      <tr>
        <td style="padding:0 32px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#2a1a1a;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="color:#eed6c4;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.2em;margin:0 0 14px;">Need us sooner? Reach out directly:</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;">
                      <a href="${PHONE_HREF}" style="color:#fff3e4;font-size:15px;font-weight:800;text-decoration:none;">
                        Phone: ${PHONE}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;">
                      <a href="${WA_HREF}" style="color:#00d97e;font-size:15px;font-weight:800;text-decoration:none;">
                        WhatsApp: ${PHONE}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;">
                      <a href="mailto:${EMAIL}" style="color:#eed6c4;font-size:13px;font-weight:600;text-decoration:none;opacity:0.8;">
                        Email: ${EMAIL}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#2a1a1a;padding:20px 32px;text-align:center;">
          <p style="color:#eed6c4;font-size:11px;margin:0 0 4px;opacity:0.5;">Terrific Travel Ltd Ltd &nbsp;&middot;&nbsp; terrifictravel.co.uk</p>
          <p style="color:#eed6c4;font-size:10px;margin:0;opacity:0.35;">You are receiving this because you submitted an enquiry on our website.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

    // Send both emails
    await transporter.sendMail({
      from: `"Terrific Travel Ltd" <${INQUIRY_FROM}>`,
      to: INQUIRY_TO,
      replyTo: email,
      subject,
      html: companyHtml,
    });

    await transporter.sendMail({
      from: `"Terrific Travel Ltd" <${INQUIRY_FROM}>`,
      to: email,
      subject: `We've received your enquiry, ${name} — Terrific Travel Ltd`,
      html: customerHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("[ENQUIRY EMAIL ERROR]", err);
    return NextResponse.json(
      { error: "Failed to send enquiry. Please try again." },
      { status: 500 },
    );
  }
}
