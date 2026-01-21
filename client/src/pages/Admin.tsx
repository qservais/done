import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/config/brand";
import { Lock, Eye, Mail, Phone, Calendar, Building, Globe, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Lead = {
  id: string;
  activity: string;
  zone: string;
  siteType: string;
  pages: string;
  languages: string;
  domain: string;
  emailPro: string;
  timing: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  createdAt: string;
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const ADMIN_PASSWORD = "done2024";

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Erreur de chargement");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const leads: Lead[] = data?.leads || [];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Mot de passe incorrect");
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
            <Button type="submit" className="w-full h-12 bg-[#0a1628] hover:bg-[#1a2638]" data-testid="button-admin-login">
              Connexion
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
                <h1 className="text-2xl font-bold text-[#0a1628]">{selectedLead.name}</h1>
                <p className="text-gray-500">{selectedLead.activity}</p>
              </div>
              <span className="text-sm text-gray-400">{formatDate(selectedLead.createdAt)}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-[#0a1628] border-b pb-2">Contact</h3>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#3b5ccc]" />
                  <a href={`mailto:${selectedLead.email}`} className="text-[#3b5ccc] hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#3b5ccc]" />
                  <a href={`tel:${selectedLead.phone}`} className="text-[#3b5ccc] hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <span>{selectedLead.zone}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#0a1628] border-b pb-2">Projet</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <span className="text-gray-500">Type de site</span>
                  <span className="font-medium">{selectedLead.siteType}</span>
                  <span className="text-gray-500">Nombre de pages</span>
                  <span className="font-medium">{selectedLead.pages}</span>
                  <span className="text-gray-500">Langues</span>
                  <span className="font-medium">{selectedLead.languages}</span>
                  <span className="text-gray-500">Timing</span>
                  <span className="font-medium">{selectedLead.timing}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#0a1628] border-b pb-2">Domaine & Email</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <span className="text-gray-500">A un domaine</span>
                  <span className="font-medium">{selectedLead.domain === "oui" ? "Oui" : "Non"}</span>
                  <span className="text-gray-500">A un email pro</span>
                  <span className="font-medium">{selectedLead.emailPro === "oui" ? "Oui" : "Non"}</span>
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
              <Button asChild className="bg-[#3b5ccc] hover:bg-[#2a4bb8]">
                <a href={`mailto:${selectedLead.email}`} data-testid="button-email-lead">
                  <Mail className="w-4 h-4 mr-2" /> Répondre par email
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${selectedLead.phone}`} data-testid="button-call-lead">
                  <Phone className="w-4 h-4 mr-2" /> Appeler
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f3] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0a1628]">Dashboard Admin</h1>
            <p className="text-gray-500">{leads.length} lead{leads.length !== 1 ? "s" : ""} enregistré{leads.length !== 1 ? "s" : ""}</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" data-testid="button-refresh-leads">
            Actualiser
          </Button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500">Chargement...</p>
          </div>
        ) : leads.length === 0 ? (
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
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Email</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Type</th>
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
                      <div className="font-medium text-[#0a1628]">{lead.name}</div>
                      <div className="text-sm text-gray-500 md:hidden">{lead.activity}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-gray-600">{lead.activity}</td>
                    <td className="p-4 hidden lg:table-cell text-gray-600">{lead.email}</td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="px-2 py-1 bg-[#3b5ccc]/10 text-[#3b5ccc] rounded-full text-sm">
                        {lead.siteType}
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
        )}
      </div>
    </div>
  );
}
