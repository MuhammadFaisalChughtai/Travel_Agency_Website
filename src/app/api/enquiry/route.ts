import { NextRequest, NextResponse } from "next/server";
import { transporter, INQUIRY_TO, INQUIRY_FROM } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      message,
      type,
      packageId,
      ...tripDetailsObj
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    const referer = req.headers.get("referer") || "";
    const isRoadToUmrah = referer.includes("roadtoumrah");

    const brandName = isRoadToUmrah ? "Road To Umrah" : "Terrific Travel Ltd";
    const brandEmail = isRoadToUmrah ? "inquires@roadtoumrah.co.uk" : "info@terrifictravel.co.uk";
    const brandPhone = isRoadToUmrah ? "+44 1215 291630" : "+44 1234 567890"; // Using dummy phone for Terrific Travel if not specified
    const brandPhoneHref = isRoadToUmrah ? "tel:+441215291630" : "tel:+441234567890";
    const brandWaHref = isRoadToUmrah ? "https://wa.me/441215291630" : "https://wa.me/441234567890";
    const brandWebsite = isRoadToUmrah ? "roadtoumrah.co.uk" : "terrifictravel.co.uk";
    
    const primaryColor = isRoadToUmrah ? "#064e3b" : "#6b4f4f"; // Emerald / Brown
    const secondaryColor = isRoadToUmrah ? "#d4af37" : "#eed6c4"; // Gold / Beige
    const bgLight = isRoadToUmrah ? "#f8fafc" : "#f5f0eb"; // Slate / Sand
    const bgDark = isRoadToUmrah ? "#2a1a1a" : "#382626"; // Very dark / Dark Brown
    const textAccent = isRoadToUmrah ? "#fff3e4" : "#fff3e4";
    const highlight = isRoadToUmrah ? "#00b37a" : "#6b4f4f";

    const tripDetails = JSON.stringify({ ...tripDetailsObj, packageId });

    const formatLabel = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
    
    let companyTripDetailsRows = "";
    let customerTripDetailsRows = "";
    
    Object.entries(tripDetailsObj).forEach(([key, value]) => {
      if (value) {
        companyTripDetailsRows += `<tr><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid ${secondaryColor};width:130px;"><span class="email-details-label" style="font-size:11px;color:${primaryColor};font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">${formatLabel(key)}</span></td><td class="email-details-row" style="padding:7px 0;border-bottom:1px solid ${secondaryColor};"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:600;">${value}</span></td></tr>`;
        customerTripDetailsRows += `<tr><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid ${secondaryColor};width:145px;vertical-align:middle;"><span class="email-details-label" style="font-size:11px;color:${primaryColor};font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">${formatLabel(key)}</span></td><td class="email-details-row" style="padding:8px 0;border-bottom:1px solid ${secondaryColor};"><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:700;">${value}</span></td></tr>`;
      }
    });
    
    if (packageId) {
      companyTripDetailsRows += `<tr><td style="padding:7px 0;width:130px;"><span class="email-details-label" style="font-size:11px;color:${primaryColor};font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Package</span></td><td><span class="email-details-value" style="font-size:13px;color:#2a1a1a;font-weight:600;">${packageId}</span></td></tr>`;
    }

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
  </style>
</head>
<body class="email-bg-wrapper" style="margin:0;padding:0;background:${bgLight};font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" class="email-bg-wrapper" style="background:${bgLight};padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" class="email-main-card" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid ${secondaryColor};">

      <!-- Header -->
      <tr>
        <td bgcolor="${bgDark}" style="background-color:${bgDark};padding:36px 32px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(238,214,196,0.3);border-radius:12px;padding:10px 24px;margin-bottom:12px;">
            <span style="color:${secondaryColor};font-size:18px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;">${brandName}</span>
          </div>
          <p style="color:${textAccent};font-size:12px;margin:0;opacity:0.7;letter-spacing:0.2em;text-transform:uppercase;">New Enquiry Received</p>
        </td>
      </tr>

      <!-- Alert banner -->
      <tr>
        <td class="email-alert-banner" style="background:#f8fafc;border-bottom:1px solid ${secondaryColor};padding:14px 32px;">
          <p class="email-alert-text" style="margin:0;font-size:13px;color:${primaryColor};font-weight:700;">
            <strong>${subject}</strong>
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px;">

          <!-- Contact Details Card -->
          <table width="100%" cellpadding="0" cellspacing="0" class="email-details-card" style="background:#f8fafc;border-radius:14px;border:1px solid ${secondaryColor};overflow:hidden;margin-bottom:24px;">
            <tr>
              <td style="background:${primaryColor};padding:10px 18px;">
                <span style="color:${textAccent};font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;">Contact Details</span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${
                    name
                      ? `
                  <tr>
                    <td class="email-details-row" style="padding:8px 0;border-bottom:1px solid ${secondaryColor};width:130px;vertical-align:top;">
                      <span class="email-details-label" style="font-size:11px;color:${primaryColor};font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Name</span>
                    </td>
                    <td class="email-details-row" style="padding:8px 0;border-bottom:1px solid ${secondaryColor};">
                      <span class="email-details-value" style="font-size:14px;color:#2a1a1a;font-weight:700;">${name}</span>
                    </td>
                  </tr>`
                      : ""
                  }
                  ${
                    email
                      ? `
                  <tr>
                    <td class="email-details-row" style="padding:8px 0;border-bottom:1px solid ${secondaryColor};width:130px;vertical-align:top;">
                      <span class="email-details-label" style="font-size:11px;color:${primaryColor};font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Email</span>
                    </td>
                    <td class="email-details-row" style="padding:8px 0;border-bottom:1px solid ${secondaryColor};">
                      <span class="email-details-value" style="font-size:14px;color:${primaryColor};font-weight:700;"><a href="mailto:${email}" style="color:${primaryColor};text-decoration:none;">${email}</a></span>
                    </td>
                  </tr>`
                      : ""
                  }
                  ${
                    phone
                      ? `
                  <tr>
                    <td style="padding:8px 0;width:130px;vertical-align:top;">
                      <span class="email-details-label" style="font-size:11px;color:${primaryColor};font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">Phone</span>
                    </td>
                    <td style="padding:8px 0;">
                      <span class="email-details-value" style="font-size:14px;color:${primaryColor};font-weight:700;"><a href="tel:${phone}" style="color:${primaryColor};text-decoration:none;">${phone}</a></span>
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
            Object.keys(tripDetailsObj).length > 0 || packageId
              ? `
          <table width="100%" cellpadding="0" cellspacing="0" class="email-details-card" style="background:#f8fafc;border-radius:14px;border:1px solid ${secondaryColor};overflow:hidden;margin-bottom:24px;">
            <tr>
              <td style="background:${primaryColor};padding:10px 18px;">
                <span style="color:${textAccent};font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;">Trip Details</span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${companyTripDetailsRows}
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
              <td class="email-msg-td" style="background:#f8fafc;border-left:4px solid ${primaryColor};border-radius:0 10px 10px 0;padding:16px 20px;">
                <p class="email-msg-label" style="font-size:10px;color:${primaryColor};font-weight:800;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 8px;">Message</p>
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
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display:inline-block;background-color:${bgDark};color:${textAccent};font-size:13px;font-weight:800;text-decoration:none;padding:14px 32px;border-radius:50px;letter-spacing:0.1em;text-transform:uppercase;">
                  Reply to ${name} &#8594;
                </a>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:${bgDark};padding:20px 32px;text-align:center;">
          <p style="color:${secondaryColor};font-size:11px;margin:0;opacity:0.6;">Sent automatically from the ${brandName} website enquiry form.</p>
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
  </style>
</head>
<body class="email-bg-wrapper" style="margin:0;padding:0;background:${bgLight};font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" class="email-bg-wrapper" style="background:${bgLight};padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" class="email-main-card" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid ${secondaryColor};">

      <!-- Header -->
      <tr>
        <td bgcolor="${bgDark}" style="background-color:${bgDark};padding:40px 32px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(238,214,196,0.3);border-radius:12px;padding:10px 24px;margin-bottom:16px;">
            <span style="color:${secondaryColor};font-size:18px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;">${brandName}</span>
          </div>
          <br>
          <div style="display:inline-block;background:${highlight};border-radius:50%;width:52px;height:52px;line-height:52px;text-align:center;font-size:24px;margin:8px 0 4px;color:#ffffff;font-weight:bold;">✓</div>
          <p style="color:${textAccent};font-size:13px;margin:8px 0 0;font-weight:700;letter-spacing:0.08em;">Enquiry Confirmed</p>
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
        Object.keys(tripDetailsObj).length > 0 || packageId
          ? `
      <tr>
        <td style="padding:0 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" class="email-details-card" style="background:#f8fafc;border-radius:14px;border:1px solid ${secondaryColor};overflow:hidden;">
            <tr>
              <td style="background:${primaryColor};padding:12px 20px;">
                <span style="color:${textAccent};font-size:10px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;">Your Enquiry Summary</span>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${customerTripDetailsRows}
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
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${bgDark};border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="color:${secondaryColor};font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.2em;margin:0 0 14px;">Need us sooner? Reach out directly:</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;">
                      <a href="${brandPhoneHref}" style="color:${textAccent};font-size:15px;font-weight:800;text-decoration:none;">
                        Phone: ${brandPhone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;">
                      <a href="${brandWaHref}" style="color:${highlight};font-size:15px;font-weight:800;text-decoration:none;">
                        WhatsApp: ${brandPhone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;">
                      <a href="mailto:${brandEmail}" style="color:${secondaryColor};font-size:13px;font-weight:600;text-decoration:none;opacity:0.8;">
                        Email: ${brandEmail}
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
        <td style="background:${bgDark};padding:20px 32px;text-align:center;">
          <p style="color:${secondaryColor};font-size:11px;margin:0 0 4px;opacity:0.5;">${brandName} &nbsp;&middot;&nbsp; ${brandWebsite}</p>
          <p style="color:${secondaryColor};font-size:10px;margin:0;opacity:0.35;">You are receiving this because you submitted an enquiry on our website.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

    // Send both emails
    await transporter.sendMail({
      from: `"${brandName}" <${INQUIRY_FROM}>`,
      to: INQUIRY_TO,
      replyTo: email,
      subject,
      html: companyHtml,
    });

    await transporter.sendMail({
      from: `"${brandName}" <${INQUIRY_FROM}>`,
      to: email,
      subject: `We've received your enquiry, ${name} — ${brandName}`,
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
