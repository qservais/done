import { Resend } from "resend";
import type { InsertBrief } from "@shared/schema";

const resend = new Resend(process.env.RESEND_API_KEY);
const STUDIO_EMAIL = process.env.STUDIO_EMAIL || "hello@madebydone.be";
const FROM_EMAIL = "done. <no-reply@madebydone.be>";

function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"']/g, (c) => map[c] || c);
}

function parseJsonArray(val: string | null | undefined): string {
  if (!val) return "—";
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) ? arr.join(", ") : val;
  } catch {
    return val;
  }
}

function moduleLabel(m: string | null | undefined): string {
  if (!m) return "—";
  const labels: Record<string, string> = {
    essentiel: "Module Essentiel — 5,90€/mois",
    performance: "Module Performance — 19,90€/mois",
    boost: "Module Google Boost — 49,90€/mois",
  };
  return labels[m] || m;
}

export async function sendBriefNotification(brief: InsertBrief): Promise<void> {
  const socials = [
    brief.socialInstagram ? `Instagram: ${brief.socialInstagram}` : null,
    brief.socialFacebook ? `Facebook: ${brief.socialFacebook}` : null,
    brief.socialGoogle ? `Google Business: ${brief.socialGoogle}` : null,
    brief.socialTiktok ? `TikTok: ${brief.socialTiktok}` : null,
    brief.socialLinkedin ? `LinkedIn: ${brief.socialLinkedin}` : null,
  ].filter(Boolean).join("<br>");

  const siteCoords = [
    brief.sitePhone ? `Tél: ${brief.sitePhone}` : null,
    brief.siteEmail ? `Email: ${brief.siteEmail}` : null,
    brief.siteAddress ? `Adresse: ${brief.siteAddress}` : null,
    brief.siteHours ? `Horaires: ${brief.siteHours}` : null,
  ].filter(Boolean).join("<br>");

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>
body { font-family: -apple-system, sans-serif; background: #f8f8f8; margin: 0; padding: 20px; }
.card { background: white; border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto; }
h1 { font-size: 22px; margin: 0 0 4px; }
.badge { display: inline-block; background: #1a1a1a; color: white; font-size: 11px; padding: 3px 10px; border-radius: 20px; margin-bottom: 24px; }
.row { margin: 12px 0; }
.label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #888; font-weight: 600; margin-bottom: 2px; }
.value { font-size: 15px; color: #1a1a1a; }
hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
.module-box { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 14px 16px; }
</style></head>
<body>
<div class="card">
  <div class="badge">Nouveau brief</div>
  <h1>📋 ${escapeHtml(brief.companyName)}</h1>
  <p style="color:#666;margin:0 0 24px">${escapeHtml(brief.activity)}</p>
  
  <div class="row"><div class="label">Contact</div><div class="value">${escapeHtml(brief.firstname)} ${escapeHtml(brief.lastname || "")}<br>${escapeHtml(brief.email)}${brief.phone ? `<br>${escapeHtml(brief.phone)}` : ""}</div></div>
  
  ${brief.activityDescription ? `<div class="row"><div class="label">Description activité</div><div class="value">${escapeHtml(brief.activityDescription)}</div></div>` : ""}
  
  ${brief.services ? `<div class="row"><div class="label">Services / produits</div><div class="value">${escapeHtml(parseJsonArray(brief.services))}</div></div>` : ""}
  
  ${brief.differentiator ? `<div class="row"><div class="label">Différenciation</div><div class="value">${escapeHtml(brief.differentiator)}</div></div>` : ""}
  
  <hr>
  
  ${brief.visitorActions ? `<div class="row"><div class="label">Actions visiteurs</div><div class="value">${escapeHtml(parseJsonArray(brief.visitorActions))}</div></div>` : ""}
  
  ${brief.languages ? `<div class="row"><div class="label">Langues du site</div><div class="value">${escapeHtml(parseJsonArray(brief.languages))}</div></div>` : ""}
  
  ${brief.objectives ? `<div class="row"><div class="label">Objectifs</div><div class="value">${escapeHtml(parseJsonArray(brief.objectives))}</div></div>` : ""}
  
  ${socials ? `<div class="row"><div class="label">Réseaux sociaux</div><div class="value">${socials}</div></div>` : ""}
  
  ${siteCoords ? `<div class="row"><div class="label">Coordonnées pour le site</div><div class="value">${siteCoords}</div></div>` : ""}
  
  ${brief.hasPhotos !== null && brief.hasPhotos !== undefined ? `<div class="row"><div class="label">Photos</div><div class="value">${brief.hasPhotos ? "✅ Le client enverra ses photos" : "📸 Images stock"}</div></div>` : ""}
  
  <hr>
  
  <div class="module-box">
    <div class="label">Module accompagnement choisi</div>
    <div class="value" style="font-weight:600;margin-top:4px">${moduleLabel(brief.module)}</div>
  </div>
</div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: STUDIO_EMAIL,
      subject: `📋 Nouveau brief — ${brief.companyName} (${brief.activity})`,
      html,
    });
  } catch (err) {
    console.error("Error sending brief notification email:", err);
  }
}
