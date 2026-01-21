import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const STUDIO_EMAIL = process.env.STUDIO_EMAIL || "hello@madebydone.be";
const FROM_EMAIL = "done. <no-reply@madebydone.be>";

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

export async function sendConfirmationEmail(leadRaw: LeadData) {
  const lead = sanitizeLead(leadRaw);
  const packName = lead.pack || lead.siteType;
  const packPrice = formatPackPrice(leadRaw.packPrice);
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: leadRaw.email,
      subject: "Votre demande a bien été reçue — done",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f5f5f3; margin: 0; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background: #0a1628; padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">done<span style="color: #395af6;">.</span></h1>
            </div>
            <div style="padding: 40px 32px;">
              <h2 style="color: #0a1628; margin: 0 0 16px; font-size: 22px;">Merci ${lead.name} !</h2>
              <p style="color: #4a5568; line-height: 1.6; margin: 0 0 24px;">
                Votre demande de site web a bien été enregistrée. Notre équipe analyse votre projet et vous recontactera sous <strong>48h</strong>.
              </p>
              
              <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #0a1628; margin: 0 0 16px; font-size: 16px;">Récapitulatif de votre demande</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #718096; padding: 8px 0; font-size: 14px;">Activité</td>
                    <td style="color: #0a1628; padding: 8px 0; font-size: 14px; text-align: right; font-weight: 500;">${lead.activity}</td>
                  </tr>
                  <tr>
                    <td style="color: #718096; padding: 8px 0; font-size: 14px;">Pack choisi</td>
                    <td style="color: #395af6; padding: 8px 0; font-size: 14px; text-align: right; font-weight: 600;">${packName}</td>
                  </tr>
                  <tr>
                    <td style="color: #718096; padding: 8px 0; font-size: 14px;">Prix</td>
                    <td style="color: #0a1628; padding: 8px 0; font-size: 14px; text-align: right; font-weight: 600;">${packPrice}</td>
                  </tr>
                  <tr>
                    <td style="color: #718096; padding: 8px 0; font-size: 14px;">Délai souhaité</td>
                    <td style="color: #0a1628; padding: 8px 0; font-size: 14px; text-align: right; font-weight: 500;">${lead.timing}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #395af6; color: white; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0 0 8px; font-size: 14px; opacity: 0.9;">+ Abonnement mensuel</p>
                <p style="margin: 0; font-size: 24px; font-weight: 700;">19,99€<span style="font-size: 14px; font-weight: 400;">/mois</span></p>
                <p style="margin: 8px 0 0; font-size: 12px; opacity: 0.8;">Hébergement, maintenance, ajustements inclus</p>
              </div>

              <p style="color: #4a5568; line-height: 1.6; margin: 0 0 32px; font-size: 14px;">
                En attendant, n'hésitez pas à préparer vos contenus (textes, photos, logo) pour accélérer la création de votre site.
              </p>

              <div style="text-align: center;">
                <a href="https://madebydone.be" style="display: inline-block; background: #395af6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Visiter notre site</a>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 24px 32px; text-align: center;">
              <p style="color: #718096; margin: 0; font-size: 12px;">
                © 2026 done — Un site premium qui coûte moins qu'un logo.
              </p>
            </div>
          </div>
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
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: STUDIO_EMAIL,
      subject: `${isEcommerce ? "🛒 " : ""}Nouveau lead — ${lead.name} (${packName})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f5f5f3; margin: 0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background: ${isEcommerce ? '#f59e0b' : '#0a1628'}; padding: 24px 32px;">
              <h1 style="color: white; margin: 0; font-size: 20px;">${isEcommerce ? '🛒 Nouveau lead E-commerce !' : 'Nouveau lead reçu !'}</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #0a1628; margin: 0 0 8px; font-size: 24px;">${lead.name}</h2>
              <p style="color: #395af6; margin: 0 0 24px; font-size: 16px;">${lead.activity} — ${lead.zone}</p>
              
              <div style="background: ${isEcommerce ? '#fffbeb' : '#f0f4ff'}; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 2px solid ${isEcommerce ? '#f59e0b' : '#395af6'};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <p style="margin: 0; font-size: 12px; color: #718096; text-transform: uppercase;">Pack choisi</p>
                    <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #0a1628;">${packName}</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: ${isEcommerce ? '#f59e0b' : '#395af6'};">${packPrice}</p>
                  </div>
                </div>
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
                <a href="https://madebydone.be/admin" style="display: inline-block; background: #395af6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Voir dans l'admin</a>
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
