import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ChevronLeft, Loader2, FileText, Layout, Layers, ShoppingCart, Phone, Mail, User, MessageSquare, MapPin, Briefcase, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";
import { DoneStamp } from "@/components/signature";
import { trackFormStart, trackFormStep, trackFormSubmit, trackFormError, trackPackSelect } from "@/lib/tracking";
import { CalPopupButton } from "@/components/CalEmbed";

type PackType = "landing" | "vitrine" | "multipage" | "ecommerce" | "";

type StepData = {
  activity: string;
  zone: string;
  pack: PackType;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialData: StepData = {
  activity: "",
  zone: "",
  pack: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

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
    features: ["Tout de Landing +", "Formulaire de contact", "Plusieurs pages"],
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

  const totalSteps = 3;
  const progress = Math.min((step / totalSteps) * 100, 100);

  const stepNames = ['activite', 'pack', 'coordonnees'];

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
          activity: currentData.activity || null,
          zone: currentData.zone || null,
          pack: selectedPack?.name || currentData.pack || null,
          packPrice: selectedPack?.price ? String(selectedPack.price) : null,
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
        return Boolean(data.activity.trim() && data.zone);
      case 2:
        return Boolean(data.pack);
      case 3:
        return Boolean(data.email.trim() || data.phone.trim());
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!canProceed()) return;
    triggerFormStart();
    if (step < totalSteps) setStep(step + 1);
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
          languages: "1",
          domain: "non",
          emailPro: "non",
          timing: "Normal",
          name: data.name || "Non renseigné",
          email: data.email || "",
          phone: data.phone || "",
          message: data.message || "",
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
          Votre demande a été envoyée. On vous répond sous 24h avec une proposition.
        </p>
        <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-medium mb-2">Récapitulatif :</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Pack :</strong> {selectedPack?.name || data.pack}</p>
            <p><strong>Prix :</strong> {selectedPack?.price ? `${selectedPack.price}€` : "Sur devis"} + {BRAND.SUB_PRICE}€/mois</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Envie d'en parler de vive voix ?
        </p>
        <CalPopupButton variant="outline" className="w-full" data-testid="button-cal-popup" />
      </div>
    );
  }

  return (
    <div ref={formRef} className="w-full max-w-lg mx-auto bg-background border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[420px] scroll-mt-8">
      <div className="h-2 bg-secondary w-full">
        <div className="h-full bg-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Étape 1/3</span>
                  <span className="text-xs text-muted-foreground">— 30 secondes</span>
                </div>
                <h3 className="text-xl font-bold">Parlez-nous de vous</h3>
                <p className="text-sm text-muted-foreground mt-1">Pour vous proposer la meilleure formule.</p>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Votre activité</span>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      className="w-full p-3 pl-10 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                      placeholder="Ex: Restaurant, Coach sportif, Architecte..."
                      value={data.activity}
                      onChange={(e) => updateData("activity", e.target.value)}
                      onFocus={triggerFormStart}
                      data-testid="input-wizard-activity"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Où êtes-vous basé ?</span>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select 
                      className="w-full p-3 pl-10 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none appearance-none"
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
                  </div>
                </label>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Étape 2/3</span>
                </div>
                <h3 className="text-xl font-bold">Choisissez votre formule</h3>
                <p className="text-sm text-muted-foreground mt-1">Pas d'engagement — on adapte si besoin.</p>
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
                        Populaire
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
                + {BRAND.SUB_PRICE}€/mois (hébergement, maintenance, ajustements inclus)
              </p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Étape 3/3</span>
                  <span className="text-xs text-muted-foreground">— dernière étape</span>
                </div>
                <h3 className="text-xl font-bold">Comment vous joindre ?</h3>
                <p className="text-sm text-muted-foreground mt-1">On vous envoie une proposition sous 24h.</p>
              </div>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Votre nom <span className="text-muted-foreground font-normal">(optionnel)</span></span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      className="w-full p-3 pl-10 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                      placeholder="Jean Dupont"
                      value={data.name}
                      onChange={(e) => updateData("name", e.target.value)}
                      data-testid="input-wizard-name"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Email</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="email" 
                      className="w-full p-3 pl-10 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                      placeholder="votre@email.com"
                      value={data.email}
                      onChange={(e) => updateData("email", e.target.value)}
                      data-testid="input-wizard-email"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Téléphone</span>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="tel" 
                      className="w-full p-3 pl-10 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                      placeholder="0498 12 34 56"
                      value={data.phone}
                      onChange={(e) => updateData("phone", e.target.value)}
                      data-testid="input-wizard-phone"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Un message ? <span className="text-muted-foreground font-normal">(optionnel)</span></span>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea 
                      className="w-full p-3 pl-10 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none resize-none"
                      rows={2}
                      placeholder="Détails, questions, délai souhaité..."
                      value={data.message}
                      onChange={(e) => updateData("message", e.target.value)}
                      data-testid="input-wizard-message"
                    />
                  </div>
                </label>
                <p className="text-xs text-muted-foreground text-center">
                  Email ou téléphone suffit — on s'adapte à vous.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex gap-3">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="flex-shrink-0"
                data-testid="button-wizard-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex-1 bg-accent hover:bg-accent/90 text-white rounded-full h-12"
                data-testid="button-wizard-next"
              >
                Continuer <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={submitForm}
                disabled={isSubmitting || !canProceed()}
                className="flex-1 bg-accent hover:bg-accent/90 text-white rounded-full h-12"
                data-testid="button-wizard-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi...
                  </>
                ) : (
                  "Recevoir ma proposition gratuite"
                )}
              </Button>
            )}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Devis gratuit, sans engagement</span>
          </div>
        </div>
      </div>
    </div>
  );
}
