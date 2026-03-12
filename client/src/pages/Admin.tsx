import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/config/brand";
import { Lock, Eye, Mail, Phone, Building, ArrowLeft, Users, UserX, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Lead = {
  id: string;
  businessName: string | null;
  activity: string;
  zone: string;
  siteType: string;
  pack?: string;
  pages: string | null;
  languages: string | null;
  domain: string | null;
  emailPro?: string | null;
  timing: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  createdAt: string;
};

type PartialLead = {
  id: string;
  sessionId: string;
  currentStep: number;
  maxStepReached: number;
  businessName: string | null;
  activity: string | null;
  zone: string | null;
  pack: string | null;
  packPrice: string | null;
  pages: string | null;
  languages: string | null;
  domain: string | null;
  timing: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  converted: boolean;
  createdAt: string;
  updatedAt: string;
};

type TabType = "leads" | "abandons";

const stepNames = ["Activité", "Besoins", "Contact"];

function formatPages(pages: string | null): string {
  if (!pages) return "—";
  const map: Record<string, string> = {
    "1": "1 page (landing)",
    "2-3": "2-3 pages (vitrine)",
    "4-5": "4-5 pages (complet)",
    "5+": "5+ pages (sur mesure)",
  };
  return map[pages] || pages;
}

function formatLanguages(lang: string | null): string {
  if (!lang) return "—";
  const map: Record<string, string> = {
    "1": "1 langue",
    "2": "2 langues",
    "3+": "3+ langues",
  };
  return map[lang] || lang;
}

function formatDomain(domain: string | null): string {
  if (!domain) return "—";
  const map: Record<string, string> = {
    "oui": "Oui",
    "non": "Non",
    "ne-sais-pas": "Ne sait pas",
  };
  return map[domain] || domain;
}

function formatTiming(timing: string | null): string {
  if (!timing) return "—";
  const map: Record<string, string> = {
    "pas-presse": "Pas pressé",
    "normal": "Normal",
    "urgent": "Urgent",
  };
  return map[timing] || timing;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedPartialLead, setSelectedPartialLead] = useState<PartialLead | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("leads");

  const { data: leadsData, isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ["/api/leads", authToken],
    queryFn: async () => {
      const res = await fetch("/api/leads", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Erreur de chargement");
      return res.json();
    },
    enabled: isAuthenticated && !!authToken,
  });

  const { data: partialLeadsData, isLoading: partialLeadsLoading, refetch: refetchPartialLeads } = useQuery({
    queryKey: ["/api/partial-leads", authToken],
    queryFn: async () => {
      const res = await fetch("/api/partial-leads?unconverted=true", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Erreur de chargement");
      return res.json();
    },
    enabled: isAuthenticated && !!authToken,
  });

  const leads: Lead[] = leadsData?.leads || [];
  const partialLeads: PartialLead[] = partialLeadsData?.partialLeads || [];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
      } else {
        setError("Mot de passe incorrect");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-BE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStepLabel = (maxStep: number) => {
    const cappedStep = Math.min(maxStep, stepNames.length);
    return `${cappedStep}/${stepNames.length} - ${stepNames[cappedStep - 1] || "?"}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0a1628] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0a1628]">Admin {BRAND.STUDIO_NAME}</h1>
            <p className="text-gray-500 mt-2">Accès réservé</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
              data-testid="input-admin-password"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#0a1628] hover:bg-[#1a2638]" 
              data-testid="button-admin-login"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Connexion..." : "Connexion"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (selectedLead) {
    return (
      <div className="min-h-screen bg-[#f5f5f3] p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedLead(null)}
            className="mb-6"
            data-testid="button-back-to-list"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
          </Button>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[#0a1628]">
                  {selectedLead.businessName || selectedLead.activity}
                </h1>
                <p className="text-gray-500">{selectedLead.activity}{selectedLead.businessName ? ` — ${selectedLead.zone}` : ''}</p>
                {(selectedLead.name && selectedLead.name !== "Non renseigné" || selectedLead.lastname) && (
                  <p className="text-gray-400 text-sm">{[selectedLead.name !== "Non renseigné" ? selectedLead.name : null, selectedLead.lastname].filter(Boolean).join(" ")}</p>
                )}
              </div>
              <span className="text-sm text-gray-400">{formatDate(selectedLead.createdAt)}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-[#0a1628] border-b pb-2">Contact</h3>
                {selectedLead.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#3b5ccc]" />
                    <a href={`mailto:${selectedLead.email}`} className="text-[#3b5ccc] hover:underline" data-testid="link-lead-email">
                      {selectedLead.email}
                    </a>
                  </div>
                )}
                {selectedLead.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#3b5ccc]" />
                    <a href={`tel:${selectedLead.phone}`} className="text-[#3b5ccc] hover:underline" data-testid="link-lead-phone">
                      {selectedLead.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <span>{selectedLead.zone}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#0a1628] border-b pb-2">Besoins</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <span className="text-gray-500">Pages</span>
                  <span className="font-medium">{formatPages(selectedLead.pages)}</span>
                  <span className="text-gray-500">Langues</span>
                  <span className="font-medium">{formatLanguages(selectedLead.languages)}</span>
                  <span className="text-gray-500">Domaine</span>
                  <span className="font-medium">{formatDomain(selectedLead.domain)}</span>
                  <span className="text-gray-500">Délai</span>
                  <span className={cn("font-medium", selectedLead.timing === "urgent" && "text-red-600")}>
                    {formatTiming(selectedLead.timing)}
                  </span>
                </div>
              </div>

              {selectedLead.message && (
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-semibold text-[#0a1628] border-b pb-2">Message</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedLead.message}</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t flex gap-4">
              {selectedLead.email && (
                <Button asChild className="bg-[#3b5ccc] hover:bg-[#2a4bb8]">
                  <a href={`mailto:${selectedLead.email}`} data-testid="button-email-lead">
                    <Mail className="w-4 h-4 mr-2" /> Répondre par email
                  </a>
                </Button>
              )}
              {selectedLead.phone && (
                <Button asChild variant="outline">
                  <a href={`tel:${selectedLead.phone}`} data-testid="button-call-lead">
                    <Phone className="w-4 h-4 mr-2" /> Appeler
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPartialLead) {
    return (
      <div className="min-h-screen bg-[#f5f5f3] p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedPartialLead(null)}
            className="mb-6"
            data-testid="button-back-to-partial-list"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
          </Button>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[#0a1628]">
                  {selectedPartialLead.businessName || selectedPartialLead.activity || "Visiteur anonyme"}
                </h1>
                <p className="text-gray-500">{selectedPartialLead.activity || "Activité non renseignée"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    selectedPartialLead.converted 
                      ? "bg-green-100 text-green-700" 
                      : "bg-amber-100 text-amber-700"
                  )}>
                    {selectedPartialLead.converted ? "Converti" : `Abandonné à l'étape ${Math.min(selectedPartialLead.maxStepReached, stepNames.length)}`}
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-400">{formatDate(selectedPartialLead.updatedAt)}</span>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-[#0a1628] mb-3">Progression</h3>
              <div className="flex gap-2">
                {stepNames.map((name, index) => (
                  <div 
                    key={name}
                    className={cn(
                      "flex-1 p-2 rounded text-center text-xs",
                      index + 1 <= Math.min(selectedPartialLead.maxStepReached, stepNames.length)
                        ? "bg-accent text-white"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {(selectedPartialLead.email || selectedPartialLead.phone) && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0a1628] border-b pb-2">Contact</h3>
                  {selectedPartialLead.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#3b5ccc]" />
                      <a href={`mailto:${selectedPartialLead.email}`} className="text-[#3b5ccc] hover:underline" data-testid="link-partial-lead-email">
                        {selectedPartialLead.email}
                      </a>
                    </div>
                  )}
                  {selectedPartialLead.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#3b5ccc]" />
                      <a href={`tel:${selectedPartialLead.phone}`} className="text-[#3b5ccc] hover:underline" data-testid="link-partial-lead-phone">
                        {selectedPartialLead.phone}
                      </a>
                    </div>
                  )}
                  {selectedPartialLead.zone && (
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <span>{selectedPartialLead.zone}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold text-[#0a1628] border-b pb-2">Données collectées</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {selectedPartialLead.businessName && (
                    <>
                      <span className="text-gray-500">Business</span>
                      <span className="font-medium">{selectedPartialLead.businessName}</span>
                    </>
                  )}
                  {selectedPartialLead.activity && (
                    <>
                      <span className="text-gray-500">Activité</span>
                      <span className="font-medium">{selectedPartialLead.activity}</span>
                    </>
                  )}
                  {selectedPartialLead.zone && (
                    <>
                      <span className="text-gray-500">Zone</span>
                      <span className="font-medium">{selectedPartialLead.zone}</span>
                    </>
                  )}
                  {selectedPartialLead.pages && (
                    <>
                      <span className="text-gray-500">Pages</span>
                      <span className="font-medium">{formatPages(selectedPartialLead.pages)}</span>
                    </>
                  )}
                  {selectedPartialLead.languages && (
                    <>
                      <span className="text-gray-500">Langues</span>
                      <span className="font-medium">{formatLanguages(selectedPartialLead.languages)}</span>
                    </>
                  )}
                  {selectedPartialLead.domain && (
                    <>
                      <span className="text-gray-500">Domaine</span>
                      <span className="font-medium">{formatDomain(selectedPartialLead.domain)}</span>
                    </>
                  )}
                  {selectedPartialLead.timing && (
                    <>
                      <span className="text-gray-500">Délai</span>
                      <span className={cn("font-medium", selectedPartialLead.timing === "urgent" && "text-red-600")}>
                        {formatTiming(selectedPartialLead.timing)}
                      </span>
                    </>
                  )}
                  {selectedPartialLead.pack && (
                    <>
                      <span className="text-gray-500">Pack</span>
                      <span className="font-medium">{selectedPartialLead.pack}</span>
                    </>
                  )}
                </div>
              </div>

              {selectedPartialLead.message && (
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-semibold text-[#0a1628] border-b pb-2">Message</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedPartialLead.message}</p>
                </div>
              )}
            </div>

            {(selectedPartialLead.email || selectedPartialLead.phone) && (
              <div className="mt-8 pt-6 border-t flex gap-4">
                {selectedPartialLead.email && (
                  <Button asChild className="bg-[#3b5ccc] hover:bg-[#2a4bb8]" data-testid="button-email-partial-lead">
                    <a href={`mailto:${selectedPartialLead.email}`}>
                      <Mail className="w-4 h-4 mr-2" /> Relancer par email
                    </a>
                  </Button>
                )}
                {selectedPartialLead.phone && (
                  <Button asChild variant="outline" data-testid="button-call-partial-lead">
                    <a href={`tel:${selectedPartialLead.phone}`}>
                      <Phone className="w-4 h-4 mr-2" /> Appeler
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isLoading = activeTab === "leads" ? leadsLoading : partialLeadsLoading;
  const refetch = activeTab === "leads" ? refetchLeads : refetchPartialLeads;

  return (
    <div className="min-h-screen bg-[#f5f5f3] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0a1628]">Dashboard Admin</h1>
          </div>
          <Button onClick={() => refetch()} variant="outline" data-testid="button-refresh-leads">
            Actualiser
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "leads" ? "default" : "outline"}
            onClick={() => setActiveTab("leads")}
            className={activeTab === "leads" ? "bg-[#0a1628]" : ""}
            data-testid="tab-leads"
          >
            <Users className="w-4 h-4 mr-2" />
            Leads ({leads.length})
          </Button>
          <Button
            variant={activeTab === "abandons" ? "default" : "outline"}
            onClick={() => setActiveTab("abandons")}
            className={activeTab === "abandons" ? "bg-amber-600" : ""}
            data-testid="tab-abandons"
          >
            <UserX className="w-4 h-4 mr-2" />
            Abandons ({partialLeads.length})
          </Button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500">Chargement...</p>
          </div>
        ) : activeTab === "leads" ? (
          leads.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-gray-500">Aucun lead pour le moment</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0a1628] text-white">
                  <tr>
                    <th className="text-left p-4 font-medium">Nom</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Activité</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Contact</th>
                    <th className="text-left p-4 font-medium hidden sm:table-cell">Pages</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={cn(
                        "border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      )}
                      onClick={() => setSelectedLead(lead)}
                      data-testid={`row-lead-${lead.id}`}
                    >
                      <td className="p-4">
                        <div className="font-medium text-[#0a1628]">
                          {lead.businessName || lead.activity}
                        </div>
                        <div className="text-sm text-gray-500 md:hidden">{lead.activity}</div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-gray-600">{lead.activity}</td>
                      <td className="p-4 hidden lg:table-cell text-gray-600">
                        {lead.email || lead.phone || "—"}
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="px-2 py-1 bg-[#3b5ccc]/10 text-[#3b5ccc] rounded-full text-sm">
                          {formatPages(lead.pages)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{formatDate(lead.createdAt)}</td>
                      <td className="p-4">
                        <Button size="sm" variant="ghost" data-testid={`button-view-lead-${lead.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          partialLeads.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">Aucun abandon en cours</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-amber-600 text-white">
                  <tr>
                    <th className="text-left p-4 font-medium">Visiteur</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Activité</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Contact</th>
                    <th className="text-left p-4 font-medium">Étape</th>
                    <th className="text-left p-4 font-medium hidden sm:table-cell">Dernière activité</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {partialLeads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={cn(
                        "border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      )}
                      onClick={() => setSelectedPartialLead(lead)}
                      data-testid={`row-partial-lead-${lead.id}`}
                    >
                      <td className="p-4">
                        <div className="font-medium text-[#0a1628]">
                          {lead.businessName || lead.activity || "Visiteur anonyme"}
                        </div>
                        <div className="text-sm text-gray-500 md:hidden">
                          {lead.activity || "—"}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-gray-600">
                        {lead.activity || "—"}
                      </td>
                      <td className="p-4 hidden lg:table-cell text-gray-600">
                        {lead.email || lead.phone || "—"}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                          {getStepLabel(lead.maxStepReached)}
                        </span>
                      </td>
                      <td className="p-4 hidden sm:table-cell text-sm text-gray-500">
                        {formatDate(lead.updatedAt)}
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="ghost" data-testid={`button-view-partial-lead-${lead.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
