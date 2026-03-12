const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const HUBSPOT_API_URL = "https://api.hubapi.com";

type LeadToHubSpot = {
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  activity?: string | null;
  zone?: string | null;
  pages?: string | null;
  languages?: string | null;
  domain?: string | null;
  timing?: string | null;
  message?: string | null;
};

export async function pushLeadToHubSpot(lead: LeadToHubSpot): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!HUBSPOT_ACCESS_TOKEN) {
    console.warn("HUBSPOT_ACCESS_TOKEN not configured, skipping HubSpot sync");
    return { success: false, error: "No HubSpot token configured" };
  }

  const properties: Record<string, string> = {};

  if (lead.firstname && lead.firstname !== "Non renseigné") properties.firstname = lead.firstname;
  if (lead.lastname) properties.lastname = lead.lastname;
  if (lead.email) properties.email = lead.email;
  if (lead.phone) properties.phone = lead.phone;
  if (lead.company) properties.company = lead.company;

  const customNotes: string[] = [];
  if (lead.activity) customNotes.push(`Activité: ${lead.activity}`);
  if (lead.zone) customNotes.push(`Zone: ${lead.zone}`);
  if (lead.pages) customNotes.push(`Pages: ${lead.pages}`);
  if (lead.languages) customNotes.push(`Langues: ${lead.languages}`);
  if (lead.domain) customNotes.push(`Domaine: ${lead.domain}`);
  if (lead.timing) customNotes.push(`Délai: ${lead.timing}`);
  if (lead.message) customNotes.push(`Message: ${lead.message}`);

  if (customNotes.length > 0) {
    properties.message = customNotes.join(" | ");
  }

  properties.hs_lead_status = "NEW";
  properties.lifecyclestage = "lead";

  try {
    if (lead.email) {
      const searchRes = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: "email",
              operator: "EQ",
              value: lead.email,
            }],
          }],
        }),
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json() as { total: number; results: Array<{ id: string }> };
        if (searchData.total > 0) {
          const contactId = searchData.results[0].id;
          const updateRes = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/${contactId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({ properties }),
          });

          if (updateRes.ok) {
            console.log(`HubSpot contact updated: ${contactId}`);
            return { success: true, id: contactId };
          }

          const errText = await updateRes.text();
          console.error("HubSpot update error:", errText);
          return { success: false, error: errText };
        }
      }
    }

    const createRes = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ properties }),
    });

    if (createRes.ok) {
      const created = await createRes.json() as { id: string };
      console.log(`HubSpot contact created: ${created.id}`);
      return { success: true, id: created.id };
    }

    const errText = await createRes.text();
    console.error("HubSpot create error:", errText);
    return { success: false, error: errText };
  } catch (err) {
    console.error("HubSpot API error:", err);
    return { success: false, error: String(err) };
  }
}
