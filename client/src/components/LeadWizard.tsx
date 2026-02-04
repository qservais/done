import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ChevronLeft, Loader2, FileText, Layout, Layers, ShoppingCart, Phone, FileQuestion, Calendar, MessageSquare, CreditCard, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";
import { DoneStamp } from "@/components/signature";
import { trackFormStart, trackFormStep, trackFormSubmit, trackFormError, trackPackSelect } from "@/lib/tracking";
import { CalPopupButton } from "@/components/CalEmbed";

type PackType = "landing" | "vitrine" | "multipage" | "ecommerce" | "";

type StepData = {
  siteStatus: string;
  objectifs: string[];
  activity: string;
  zone: string;
  pack: PackType;
  languages: string;
  domain: string;
  emailPro: string;
  siteInspi: string;
  timing: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  companyWebsite: string;
};

const initialData: StepData = {
  siteStatus: "",
  objectifs: [],
  activity: "",
  zone: "",
  pack: "",
  languages: "1",
  domain: "non",
  emailPro: "non",
  siteInspi: "",
  timing: "Normal (1 semaine)",
  name: "",
  email: "",
  phone: "",
  message: "",
  companyWebsite: "",
};

const siteStatusOptions = [
  { id: "nouveau", label: "Je n'ai pas encore de site", icon: Sparkles },
  { id: "refonte", label: "Je veux refaire mon site actuel", icon: RefreshCw },
];

const objectifOptions = [
  { id: "appel", label: "Vous appeler", description: "Afficher votre numéro", icon: Phone },
  { id: "devis", label: "Demander un devis", description: "Formulaire de demande", icon: FileQuestion },
  { id: "reservation", label: "Réserver / Prendre RDV", description: "Calendrier en ligne", icon: Calendar },
  { id: "message", label: "Vous contacter", description: "Formulaire de contact", icon: MessageSquare },
  { id: "achat", label: "Acheter directement", description: "Paiement en ligne", icon: CreditCard },
];

const packs = [
  {
    id: "landing" as PackType,
    name: "Landing Express",
    price: BRAND.PRICING.PACK_LANDING,
    description: "1 page claire et premium",
    icon: FileText,
    features: ["Design mobile-first", "Sections essentielles", "1 langue"],
  },
  {
    id: "vitrine" as PackType,
    name: "Vitrine Contact",
    price: BRAND.PRICING.PACK_VITRINE,
    description: "Pour capter des clients",
    icon: Layout,
    popular: true,
    features: ["Tout de Landing +", "Formulaire de contact", "Protection anti-spam"],
  },
  {
    id: "multipage" as PackType,
    name: "Multi-page Premium",
    price: BRAND.PRICING.PACK_MULTIPAGE,
    description: "Jusqu'à 5 pages",
    icon: Layers,
    features: ["Tout de Vitrine +", "Jusqu'à 5 pages", "Animations premium"],
  },
  {
    id: "ecommerce" as PackType,
    name: "E-commerce",
    price: null,
    description: "Vente en ligne",
    icon: ShoppingCart,
    features: ["Boutique complète", "Paiement sécurisé", "Gestion produits"],
    onQuote: true,
  },
];

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function LeadWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const previousStepRef = useRef(1);
  const sessionIdRef = useRef<string>("");

  const totalSteps = 7;
  const progress = Math.min((step / totalSteps) * 100, 100);

  const stepNames = ['besoins', 'activite', 'pack', 'details', 'delai', 'coordonnees', 'recapitulatif'];

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
    }
  }, []);

  const savePartialLead = useCallback(async (currentData: StepData, currentStep: number) => {
    if (!sessionIdRef.current) return;
    
    try {
      const selectedPack = packs.find(p => p.id === currentData.pack);
      await fetch("/api/partial-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          currentStep,
          siteStatus: currentData.siteStatus || null,
          objectifs: currentData.objectifs.join(",") || null,
          activity: currentData.activity || null,
          zone: currentData.zone || null,
          pack: selectedPack?.name || currentData.pack || null,
          packPrice: selectedPack?.price ? String(selectedPack.price) : null,
          languages: currentData.languages || null,
          domain: currentData.domain || null,
          emailPro: currentData.emailPro || null,
          siteInspi: currentData.siteInspi || null,
          timing: currentData.timing || null,
          name: currentData.name || null,
          email: currentData.email || null,
          phone: currentData.phone || null,
          message: currentData.message || null,
        }),
      });
    } catch (error) {
      console.warn("Failed to save partial lead:", error);
    }
  }, []);

  const triggerFormStart = () => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackFormStart('lead_wizard');
      trackFormStep('lead_wizard', 1, stepNames[0]);
    }
  };

  useEffect(() => {
    if (step !== previousStepRef.current && hasStartedRef.current) {
      trackFormStep('lead_wizard', step, stepNames[step - 1] || 'unknown');
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      savePartialLead(data, step);
    }
    previousStepRef.current = step;
  }, [step, data, savePartialLead]);

  const updateData = <K extends keyof StepData>(key: K, value: StepData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const selectPack = (packId: PackType) => {
    triggerFormStart();
    setData((prev) => ({ ...prev, pack: packId }));
    const selectedPack = packs.find(p => p.id === packId);
    if (selectedPack) {
      trackPackSelect(selectedPack.name, selectedPack.price || 0);
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return Boolean(data.siteStatus);
      case 2:
        return Boolean(data.activity.trim() && data.zone);
      case 3:
        return Boolean(data.pack);
      case 4:
        return true;
      case 5:
        return Boolean(data.timing);
      case 6:
        return Boolean(data.name.trim() && data.email.trim() && data.phone.trim());
      case 7:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!canProceed()) return;
    triggerFormStart();
    savePartialLead(data, step);
    if (step < 7) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const selectedPack = packs.find(p => p.id === data.pack);

  const submitForm = async () => {
    setIsSubmitting(true);
    triggerFormStart();
    
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity: data.activity,
          zone: data.zone,
          siteType: data.pack || "landing",
          pack: selectedPack?.name || data.pack || "Landing Express",
          packPrice: selectedPack?.price ? String(selectedPack.price) : null,
          pages: data.pack === "multipage" ? "2-5" : "1",
          languages: data.languages,
          domain: data.domain,
          emailPro: data.emailPro,
          timing: data.timing,
          siteInspi: data.siteInspi || "",
          objectifs: data.objectifs.join(",") || "",
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message || "",
          companyWebsite: data.companyWebsite,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi");
      }

      if (sessionIdRef.current) {
        fetch(`/api/partial-leads/${sessionIdRef.current}/convert`, {
          method: "POST",
        }).catch(() => {});
      }

      trackFormSubmit('lead_wizard', {
        pack_name: selectedPack?.name || data.pack,
        pack_price: selectedPack?.price || 0,
        zone: data.zone,
        timing: data.timing,
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting lead:", error);
      trackFormError('lead_wizard', 'submission_failed');
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-background border border-border rounded-xl p-8 text-center max-w-lg mx-auto shadow-lg">
        <div className="flex justify-center mb-6">
          <DoneStamp size="lg" />
        </div>
        <h3 className="text-2xl font-bold mb-2">C'est parti !</h3>
        <p className="text-muted-foreground mb-4">
          Votre demande a été envoyée. On vous répond sous 24h.
        </p>
        <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-medium mb-2">Récapitulatif :</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Pack :</strong> {selectedPack?.name || data.pack}</p>
            <p><strong>Prix :</strong> {selectedPack?.price ? `${selectedPack.price}€` : "Sur devis"} + {BRAND.SUB_PRICE}€/mois</p>
            <p><strong>Délai :</strong> {data.timing}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Envie d'en parler de vive voix ?
        </p>
        <CalPopupButton variant="outline" className="w-full" data-testid="button-cal-popup" />
      </div>
    );
  }

  const getSummary = () => {
    const packName = selectedPack?.name || "Non choisi";
    const packPrice = selectedPack?.price ? `${selectedPack.price}€` : "Sur devis";
    const subPrice = `${BRAND.SUB_PRICE}€/mois`;
    
    return { packName, packPrice, subPrice };
  };

  const summary = getSummary();

  return (
    <div ref={formRef} className="w-full max-w-lg mx-auto bg-background border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px] scroll-mt-8">
      <div className="h-2 bg-secondary w-full">
        <div className="h-full bg-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Step 1: Besoins - Pourquoi un site ? */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Pourquoi voulez-vous un site ?</h3>
                <p className="text-sm text-muted-foreground mt-1">Ça nous aide à vous proposer la meilleure solution.</p>
              </div>
              
              <div className="space-y-3">
                {siteStatusOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = data.siteStatus === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        triggerFormStart();
                        updateData("siteStatus", opt.id);
                      }}
                      className={cn(
                        "w-full p-4 border-2 rounded-xl text-left transition-all flex items-center gap-4",
                        isSelected 
                          ? "border-accent bg-accent/5 shadow-sm" 
                          : "border-input hover:border-accent/50 hover:bg-muted/30"
                      )}
                      data-testid={`button-site-status-${opt.id}`}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                        isSelected ? "bg-accent text-white" : "bg-secondary"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-medium text-lg">{opt.label}</span>
                      {isSelected && (
                        <div className="ml-auto w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4">
                <span className="text-sm font-medium mb-3 block">Quand quelqu'un visite votre site, vous voulez qu'il... <span className="text-muted-foreground font-normal">(optionnel)</span></span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {objectifOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = data.objectifs.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          triggerFormStart();
                          const newObjectifs = isSelected
                            ? data.objectifs.filter(o => o !== opt.id)
                            : [...data.objectifs, opt.id];
                          updateData("objectifs", newObjectifs);
                        }}
                        className={cn(
                          "relative p-3 border rounded-lg text-center transition-all",
                          isSelected 
                            ? "border-accent bg-accent/5" 
                            : "border-input hover:border-accent/50"
                        )}
                        data-testid={`button-objectif-${opt.id}`}
                      >
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        <Icon className={cn("w-5 h-5 mx-auto mb-1", isSelected ? "text-accent" : "text-muted-foreground")} />
                        <p className="text-xs font-medium">{opt.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Activité & Zone */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Que faites-vous ?</h3>
                <p className="text-sm text-muted-foreground mt-1">Décrivez votre activité en quelques mots.</p>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Votre activité</span>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-md border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                    placeholder="Ex: Architecte, Coach sportif, Restaurant italien..."
                    value={data.activity}
                    onChange={(e) => updateData("activity", e.target.value)}
                    onFocus={triggerFormStart}
                    data-testid="input-wizard-activity"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Où êtes-vous basé ?</span>
                  <select 
                    className="w-full p-3 rounded-md border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                    value={data.zone}
                    onChange={(e) => updateData("zone", e.target.value)}
                    onFocus={triggerFormStart}
                    data-testid="select-wizard-zone"
                  >
                    <option value="">Choisir...</option>
                    <option value="Belgique">Belgique</option>
                    <option value="France">France</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Autre">Autre pays</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Pack Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">On vous propose...</h3>
                <p className="text-sm text-muted-foreground mt-1">Choisissez le pack qui correspond à vos besoins.</p>
              </div>
              <div className="space-y-3">
                {packs.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => selectPack(pack.id)}
                    className={cn(
                      "w-full p-4 border rounded-xl text-left hover:border-accent transition-all relative",
                      data.pack === pack.id ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-input",
                      pack.popular && "border-accent/50"
                    )}
                    data-testid={`button-pack-${pack.id}`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2 right-4 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Recommandé
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        data.pack === pack.id ? "bg-accent text-white" : "bg-secondary"
                      )}>
                        <pack.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold">{pack.name}</span>
                          <span className={cn(
                            "font-bold text-lg",
                            pack.onQuote ? "text-amber-600" : "text-accent"
                          )}>
                            {pack.onQuote ? "Sur devis" : `${pack.price}€`}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{pack.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {pack.features.map((f, i) => (
                            <span key={i} className="text-xs bg-secondary px-2 py-0.5 rounded">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                + Abonnement {BRAND.SUB_PRICE}€/mois (hébergement, maintenance, ajustements)
              </p>
            </div>
          )}

          {/* Step 4: Détails / Options */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Quelques détails</h3>
                <p className="text-sm text-muted-foreground mt-1">Pour personnaliser votre site.</p>
              </div>
              <div className="space-y-5">
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Un site web que vous aimez bien ? (optionnel)</span>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-md border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                    placeholder="Ex: www.exemple.com"
                    value={data.siteInspi}
                    onChange={(e) => updateData("siteInspi", e.target.value)}
                    data-testid="input-wizard-site-inspi"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Ça nous aide à comprendre le style que vous aimez</p>
                </label>

                <label className="block">
                  <span className="text-sm font-medium mb-2 block">Votre site sera en combien de langues ?</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateData("languages", "1")}
                      className={cn("p-3 border rounded-lg text-center text-sm", data.languages === "1" ? "border-accent bg-accent/5" : "border-input")}
                      data-testid="button-languages-1"
                    >
                      1 langue (FR)
                    </button>
                    <button
                      onClick={() => updateData("languages", "2")}
                      className={cn("p-3 border rounded-lg text-center text-sm", data.languages === "2" ? "border-accent bg-accent/5" : "border-input")}
                      data-testid="button-languages-2"
                    >
                      2 langues
                    </button>
                  </div>
                </label>
                
                <label className="block">
                  <span className="text-sm font-medium mb-2 block">Avez-vous déjà une adresse de site ? (nom de domaine)</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateData("domain", "oui")}
                      className={cn("flex-1 p-3 border rounded-md text-sm", data.domain === "oui" ? "bg-primary text-primary-foreground" : "border-input")}
                      data-testid="button-domain-oui"
                    >Oui, j'en ai une</button>
                    <button
                      onClick={() => updateData("domain", "non")}
                      className={cn("flex-1 p-3 border rounded-md text-sm", data.domain === "non" ? "bg-primary text-primary-foreground" : "border-input")}
                      data-testid="button-domain-non"
                    >Non, à créer</button>
                  </div>
                </label>
                
                <label className="block">
                  <span className="text-sm font-medium mb-2 block">Besoin d'une adresse email pro ? (ex: vous@votresite.be)</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateData("emailPro", "oui")}
                      className={cn("flex-1 p-3 border rounded-md text-sm", data.emailPro === "oui" ? "bg-primary text-primary-foreground" : "border-input")}
                      data-testid="button-email-pro-oui"
                    >Oui</button>
                    <button
                      onClick={() => updateData("emailPro", "non")}
                      className={cn("flex-1 p-3 border rounded-md text-sm", data.emailPro === "non" ? "bg-primary text-primary-foreground" : "border-input")}
                      data-testid="button-email-pro-non"
                    >Non</button>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Délai */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Quand en avez-vous besoin ?</h3>
                <p className="text-sm text-muted-foreground mt-1">On s'adapte à votre planning.</p>
              </div>
              <div className="space-y-3">
                {["Urgent (72h)", "Normal (1 semaine)", "Flexible"].map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => updateData("timing", opt)}
                    className={cn(
                      "w-full p-4 border rounded-lg text-left hover:border-accent transition-colors",
                      data.timing === opt ? "border-accent bg-accent/5" : "border-input"
                    )}
                    data-testid={`button-timing-${idx}`}
                  >
                    <span className="font-medium">{opt}</span>
                    {opt === "Urgent (72h)" && (
                      <p className="text-xs text-muted-foreground mt-1">Pour les projets prioritaires</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Coordonnées */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">Vos coordonnées</h3>
                <p className="text-sm text-muted-foreground mt-1">Pour qu'on puisse vous recontacter.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <input 
                    type="text" 
                    placeholder="Votre nom" 
                    className={cn(
                      "w-full p-3 rounded-md border bg-transparent transition-colors",
                      data.name.trim() ? "border-green-500/50" : "border-input"
                    )}
                    value={data.name}
                    onChange={(e) => updateData("name", e.target.value)}
                    data-testid="input-wizard-name"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Votre email" 
                    className={cn(
                      "w-full p-3 rounded-md border bg-transparent transition-colors",
                      data.email.includes("@") && data.email.includes(".") ? "border-green-500/50" : "border-input"
                    )}
                    value={data.email}
                    onChange={(e) => updateData("email", e.target.value)}
                    data-testid="input-wizard-email"
                  />
                  {data.email && (!data.email.includes("@") || !data.email.includes(".")) && (
                    <p className="text-xs text-amber-600 mt-1">Vérifiez votre adresse email</p>
                  )}
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Votre téléphone" 
                    className={cn(
                      "w-full p-3 rounded-md border bg-transparent transition-colors",
                      data.phone.replace(/\D/g, '').length >= 9 ? "border-green-500/50" : "border-input"
                    )}
                    value={data.phone}
                    onChange={(e) => updateData("phone", e.target.value)}
                    data-testid="input-wizard-phone"
                  />
                  {data.phone && data.phone.replace(/\D/g, '').length < 9 && (
                    <p className="text-xs text-amber-600 mt-1">Numéro trop court</p>
                  )}
                </div>
                <textarea 
                  placeholder="Un petit mot sur votre projet (optionnel)..." 
                  className="w-full p-3 rounded-md border border-input bg-transparent h-20 resize-none"
                  value={data.message}
                  onChange={(e) => updateData("message", e.target.value)}
                  data-testid="input-wizard-message"
                />
                <input
                  type="text"
                  name="company_website"
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="absolute opacity-0 pointer-events-none h-0 w-0"
                  value={data.companyWebsite}
                  onChange={(e) => updateData("companyWebsite", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 7: Récapitulatif */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Récapitulatif</h3>
                <p className="text-sm text-muted-foreground mt-1">Vérifiez vos informations avant d'envoyer.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{summary.packName}</span>
                    <span className="font-bold text-lg text-accent">{summary.packPrice}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">+ {summary.subPrice} (hébergement & maintenance)</p>
                </div>

                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Activité</span>
                    <span className="font-medium">{data.activity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Zone</span>
                    <span className="font-medium">{data.zone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Délai</span>
                    <span className="font-medium">{data.timing}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Langues</span>
                    <span className="font-medium">{data.languages === "1" ? "1 langue" : "2 langues"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Nom de domaine</span>
                    <span className="font-medium">{data.domain === "oui" ? "Existant" : "À créer"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Email pro</span>
                    <span className="font-medium">{data.emailPro === "oui" ? "Oui" : "Non"}</span>
                  </div>
                </div>

                <div className="bg-secondary/50 border border-border rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">Vos coordonnées</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{data.name}</p>
                    <p>{data.email}</p>
                    <p>{data.phone}</p>
                  </div>
                </div>

                {data.message && (
                  <div className="bg-secondary/50 border border-border rounded-lg p-4">
                    <p className="text-sm font-medium mb-1">Votre message</p>
                    <p className="text-sm text-muted-foreground">{data.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={step === 1}
            className={cn("pl-0 hover:bg-transparent", step === 1 && "invisible")}
            data-testid="button-wizard-back"
          >
            <ChevronLeft className="mr-1 w-4 h-4" /> Retour
          </Button>
          
          {step < 7 ? (
            <Button 
              onClick={nextStep}
              disabled={!canProceed()}
              className="rounded-full px-6"
              data-testid="button-wizard-next"
            >
              Continuer <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={submitForm}
              disabled={!canProceed() || isSubmitting}
              className="rounded-full px-6 bg-accent hover:bg-accent/90"
              data-testid="button-wizard-submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  Envoyer ma demande <Check className="ml-1 w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
