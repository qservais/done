import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const STUDIO_EMAIL = process.env.STUDIO_EMAIL || "hello@madebydone.be";
const FROM_EMAIL = "done. <no-reply@madebydone.be>";
const MEET_BOOKING_URL = process.env.MEET_BOOKING_URL || "https://cal.com/madebydone/30min";

type LeadData = {
  name: string;
  email: string;
  phone: string;
  activity: string;
  zone: string;
  siteType: string;
  pack?: string;
  packPrice?: string | number | null;
  pages: string;
  languages: string;
  domain: string;
  emailPro: string;
  timing: string;
  message?: string | null;
};

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

function sanitizeLead(lead: LeadData): LeadData {
  return {
    ...lead,
    name: escapeHtml(lead.name),
    email: escapeHtml(lead.email),
    phone: escapeHtml(lead.phone),
    activity: escapeHtml(lead.activity),
    zone: escapeHtml(lead.zone),
    siteType: escapeHtml(lead.siteType),
    pack: lead.pack ? escapeHtml(lead.pack) : undefined,
    pages: escapeHtml(lead.pages),
    languages: escapeHtml(lead.languages),
    domain: escapeHtml(lead.domain),
    emailPro: escapeHtml(lead.emailPro),
    timing: escapeHtml(lead.timing),
    message: lead.message ? escapeHtml(lead.message) : null,
  };
}

function formatPackPrice(price: string | number | null | undefined): string {
  if (!price) return "Sur devis";
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return isNaN(numPrice) ? "Sur devis" : `${numPrice}€`;
}

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0] || fullName;
}

function buildConfirmationText(lead: LeadData): string {
  const firstName = getFirstName(lead.name);
  return `Hello ${firstName},

Bien reçu ! On peut sortir une V1 preview en 72h.

Deux options pour démarrer :

OPTION A — Envoyer les éléments (le plus rapide)

Répondez directement à ce mail avec ce que vous avez :

1. Nom exact de l'activité + zone (ville/pays)
2. Ce que vous vendez (3 services/produits max)
3. Style souhaité (2-3 sites en inspi OU "sobre / premium / minimal")
4. Logo + couleurs (si vous avez) — sinon OK, on fait simple
5. Photos (3-10) — sinon on part sur vos réseaux / placeholders
6. Infos pratiques : horaires / adresse / téléphone / email
7. CTA principal : "appel", "devis", "réservation", "message"
8. Langues : FR / EN (max 2)

Si vous n'avez pas tout, ce n'est pas bloquant. Envoyez ce que vous avez !

OPTION B — Call 30 min (Google Meet)

Si vous préférez, on fait ça ensemble en 30 minutes :
${MEET_BOOKING_URL}

---

Rappel : projets à partir de 197€ + 19,99€/mois (hébergement & suivi).

Quentin — done
madebydone.be`;
}

export async function sendConfirmationEmail(leadRaw: LeadData) {
  const lead = sanitizeLead(leadRaw);
  const firstName = getFirstName(lead.name);
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: leadRaw.email,
      replyTo: STUDIO_EMAIL,
      subject: "done — on lance votre V1 (72h) ✅",
      text: buildConfirmationText(leadRaw),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <!--[if mso]>
          <style>table,td,div,p{font-family:Arial,sans-serif !important;}</style>
          <![endif]-->
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f3; margin: 0; padding: 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f3;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background: white; border-radius: 16px; overflow: hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: #0a1628; padding: 28px 32px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">done<span style="color: #395af6;">.</span></h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 36px 32px;">
                      
                      <!-- Intro -->
                      <p style="color: #0a1628; font-size: 18px; margin: 0 0 8px; font-weight: 600;">Hello ${firstName},</p>
                      <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
                        Bien reçu ✅ On peut sortir une <strong>V1 preview en 72h</strong>.
                      </p>
                      
                      <!-- Option A -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f8f9fa; border-radius: 12px; margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 24px;">
                            <p style="color: #395af6; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;">Option A — Le plus rapide</p>
                            <p style="color: #0a1628; font-size: 16px; font-weight: 600; margin: 0 0 16px;">Envoyer les éléments</p>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0 0 16px;">
                              Répondez à ce mail avec ce que vous avez :
                            </p>
                            <table role="presentation" cellspacing="0" cellpadding="0" style="font-size: 14px; color: #4a5568;">
                              <tr><td style="padding: 4px 0;">1. Nom exact de l'activité + zone</td></tr>
                              <tr><td style="padding: 4px 0;">2. Ce que vous vendez (3 max)</td></tr>
                              <tr><td style="padding: 4px 0;">3. Style (2-3 sites inspi OU "sobre / premium / minimal")</td></tr>
                              <tr><td style="padding: 4px 0;">4. Logo + couleurs (optionnel)</td></tr>
                              <tr><td style="padding: 4px 0;">5. Photos (3-10, optionnel)</td></tr>
                              <tr><td style="padding: 4px 0;">6. Infos : horaires / adresse / tel / email</td></tr>
                              <tr><td style="padding: 4px 0;">7. CTA principal : appel / devis / réservation</td></tr>
                              <tr><td style="padding: 4px 0;">8. Langues : FR / EN (max 2)</td></tr>
                            </table>
                            <p style="color: #718096; font-size: 13px; font-style: italic; margin: 16px 0 0;">
                              Si vous n'avez pas tout, ce n'est pas bloquant.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Option B -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #395af6 0%, #2a47c9 100%); border-radius: 12px; margin-bottom: 28px;">
                        <tr>
                          <td style="padding: 24px; text-align: center;">
                            <p style="color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;">Option B</p>
                            <p style="color: white; font-size: 16px; font-weight: 600; margin: 0 0 4px;">Préférez un call ?</p>
                            <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 0 0 16px;">On fait ça ensemble en 30 min (Google Meet)</p>
                            <a href="${MEET_BOOKING_URL}" style="display: inline-block; background: white; color: #395af6; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Réserver mon call →</a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Reminder -->
                      <p style="color: #718096; font-size: 13px; text-align: center; margin: 0 0 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        Rappel : projets à partir de 197€ + 19,99€/mois (hébergement & suivi).
                      </p>
                      
                      <!-- Signature -->
                      <p style="color: #0a1628; font-size: 14px; margin: 0;">
                        Quentin — <strong>done</strong><br>
                        <a href="https://madebydone.be" style="color: #395af6; text-decoration: none;">madebydone.be</a>
                      </p>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: #f8f9fa; padding: 20px 32px; text-align: center;">
                      <p style="color: #a0aec0; font-size: 11px; margin: 0;">
                        © 2026 done — Un site premium qui coûte moins qu'un logo.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      return { success: false, error };
    }

    console.log("Confirmation email sent:", data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Error sending confirmation email:", err);
    return { success: false, error: err };
  }
}

export async function sendNotificationEmail(leadRaw: LeadData) {
  const lead = sanitizeLead(leadRaw);
  const packName = lead.pack || lead.siteType;
  const packPrice = formatPackPrice(leadRaw.packPrice);
  const isEcommerce = lead.siteType === "ecommerce" || packName.toLowerCase().includes("commerce");
  
  const textContent = `Nouveau lead — ${lead.name}

Activité: ${lead.activity} (${lead.zone})
Pack: ${packName} - ${packPrice}

Contact:
- Email: ${leadRaw.email}
- Téléphone: ${leadRaw.phone}

Détails:
- Langues: ${lead.languages === "1" ? "1 (FR)" : "2 langues"}
- Domaine: ${lead.domain === "oui" ? "Oui" : "Non"}
- Email pro: ${lead.emailPro === "oui" ? "Oui" : "Non"}
- Timing: ${lead.timing}

${lead.message ? `Message:\n${lead.message}` : ""}

---
Voir dans l'admin: https://madebydone.be/admin`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: STUDIO_EMAIL,
      replyTo: leadRaw.email,
      subject: `${isEcommerce ? "🛒 " : ""}Nouveau lead — ${lead.name} (${packName})`,
      text: textContent,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f3; margin: 0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background: ${isEcommerce ? '#f59e0b' : '#0a1628'}; padding: 24px 32px;">
              <h1 style="color: white; margin: 0; font-size: 20px;">${isEcommerce ? '🛒 Nouveau lead E-commerce !' : 'Nouveau lead reçu !'}</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #0a1628; margin: 0 0 8px; font-size: 24px;">${lead.name}</h2>
              <p style="color: #395af6; margin: 0 0 24px; font-size: 16px;">${lead.activity} — ${lead.zone}</p>
              
              <div style="background: ${isEcommerce ? '#fffbeb' : '#f0f4ff'}; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 2px solid ${isEcommerce ? '#f59e0b' : '#395af6'};">
                <table role="presentation" width="100%">
                  <tr>
                    <td>
                      <p style="margin: 0; font-size: 12px; color: #718096; text-transform: uppercase;">Pack choisi</p>
                      <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #0a1628;">${packName}</p>
                    </td>
                    <td style="text-align: right;">
                      <p style="margin: 0; font-size: 24px; font-weight: 700; color: ${isEcommerce ? '#f59e0b' : '#395af6'};">${packPrice}</p>
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-bottom: 24px;">
                <a href="mailto:${leadRaw.email}" style="display: block; color: #0a1628; text-decoration: none; padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px;">
                  📧 ${lead.email}
                </a>
                <a href="tel:${leadRaw.phone}" style="display: block; color: #0a1628; text-decoration: none; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                  📞 ${lead.phone}
                </a>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="color: #718096; padding: 12px 0;">Langues</td>
                  <td style="color: #0a1628; padding: 12px 0; font-weight: 600;">${lead.languages === "1" ? "1 (FR)" : "2 langues"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="color: #718096; padding: 12px 0;">A un domaine</td>
                  <td style="color: #0a1628; padding: 12px 0; font-weight: 600;">${lead.domain === "oui" ? "✅ Oui" : "❌ Non"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="color: #718096; padding: 12px 0;">Besoin email pro</td>
                  <td style="color: #0a1628; padding: 12px 0; font-weight: 600;">${lead.emailPro === "oui" ? "✅ Oui" : "❌ Non"}</td>
                </tr>
                <tr>
                  <td style="color: #718096; padding: 12px 0;">Timing</td>
                  <td style="color: #0a1628; padding: 12px 0; font-weight: 600;">${lead.timing}</td>
                </tr>
              </table>

              ${lead.message ? `
              <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <strong style="color: #92400e; display: block; margin-bottom: 8px;">💬 Message:</strong>
                <p style="color: #78350f; margin: 0;">${lead.message}</p>
              </div>
              ` : ''}

              <div style="text-align: center; margin-top: 32px;">
                <a href="mailto:${leadRaw.email}" style="display: inline-block; background: #395af6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 8px;">Répondre</a>
                <a href="https://madebydone.be/admin" style="display: inline-block; background: #e2e8f0; color: #0a1628; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Admin</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending notification email:", error);
      return { success: false, error };
    }

    console.log("Notification email sent:", data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Error sending notification email:", err);
    return { success: false, error: err };
  }
}
