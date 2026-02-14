import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ChevronLeft, Loader2, Phone, Mail, User, MessageSquare, Shield, FileText, Languages, Globe, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";
import { DoneStamp } from "@/components/signature";
import { trackFormStart, trackFormStep, trackFormSubmit, trackFormError } from "@/lib/tracking";
import { CalPopupButton } from "@/components/CalEmbed";

type StepData = {
  businessName: string;
  activity: string;
  zone: string;
  pages: string;
  languages: string;
  domain: string;
  timing: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialData: StepData = {
  businessName: "",
  activity: "",
  zone: "",
  pages: "",
  languages: "",
  domain: "",
  timing: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

const activityOptions = [
  { value: "artisan", label: "Artisan / métier de service", description: "Plombier, électricien, peintre...", icon: "🔧" },
  { value: "horeca", label: "Restaurant / Horeca", description: "Restaurant, café, traiteur...", icon: "🍽️" },
  { value: "commerce", label: "Commerce / Boutique", description: "Fleuriste, coiffeur, magasin...", icon: "🏪" },
  { value: "tpe-pme", label: "TPE / PME", description: "Comptable, avocat, consultant...", icon: "🏢" },
  { value: "sante-beaute", label: "Santé / Beauté", description: "Esthétique, onglerie, bien-être...", icon: "💆" },
  { value: "autre", label: "Autre activité", description: "Association, freelance...", icon: "💼" },
];

const zoneOptions = [
  { value: "Belgique", label: "Belgique", flag: "🇧🇪" },
  { value: "France", label: "France", flag: "🇫🇷" },
  { value: "Luxembourg", label: "Luxembourg", flag: "🇱🇺" },
  { value: "Autre", label: "Autre pays", flag: "🌍" },
];

const pagesOptions = [
  { value: "1", label: "1 page", description: "Landing page" },
  { value: "2-3", label: "2-3 pages", description: "Site vitrine" },
  { value: "4-5", label: "4-5 pages", description: "Site complet" },
  { value: "5+", label: "5+ pages", description: "Sur mesure" },
];

const languagesOptions = [
  { value: "1", label: "1 langue" },
  { value: "2", label: "2 langues" },
  { value: "3+", label: "3+ langues" },
];

const domainOptions = [
  { value: "oui", label: "Oui, j'en ai un" },
  { value: "non", label: "Non, pas encore" },
  { value: "ne-sais-pas", label: "Je ne sais pas" },
];

const timingOptions = [
  { value: "pas-presse", label: "Pas pressé", description: "1-2 mois" },
  { value: "normal", label: "Normal", description: "2-4 semaines" },
  { value: "urgent", label: "Urgent", description: "< 2 semaines" },
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
  const dataRef = useRef<StepData>(initialData);
  const stepRef = useRef(1);

  const totalSteps = 3;
  const progress = Math.min((step / totalSteps) * 100, 100);

  const stepNames = ['activite', 'besoins', 'coordonnees'];

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
    }
  }, []);

  const savePartialLead = useCallback(async (currentData: StepData, currentStep: number) => {
    if (!sessionIdRef.current) return;
    
    try {
      await fetch("/api/partial-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          currentStep,
          businessName: currentData.businessName || null,
          activity: (activityOptions.find(a => a.value === currentData.activity)?.label || currentData.activity) || null,
          zone: currentData.zone || null,
          pages: currentData.pages || null,
          languages: currentData.languages || null,
          domain: currentData.domain || null,
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasStartedRef.current && sessionIdRef.current) {
        const payload = JSON.stringify({
          sessionId: sessionIdRef.current,
          currentStep: stepRef.current,
          businessName: dataRef.current.businessName || null,
          activity: (activityOptions.find(a => a.value === dataRef.current.activity)?.label || dataRef.current.activity) || null,
          zone: dataRef.current.zone || null,
          pages: dataRef.current.pages || null,
          languages: dataRef.current.languages || null,
          domain: dataRef.current.domain || null,
          timing: dataRef.current.timing || null,
          name: dataRef.current.name || null,
          email: dataRef.current.email || null,
          phone: dataRef.current.phone || null,
          message: dataRef.current.message || null,
        });
        navigator.sendBeacon("/api/partial-leads", new Blob([payload], { type: "application/json" }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && hasStartedRef.current) {
        handleBeforeUnload();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return Boolean(data.activity.trim() && data.zone);
      case 2:
        return Boolean(data.pages);
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
          businessName: data.businessName || null,
          activity: activityOptions.find(a => a.value === data.activity)?.label || data.activity,
          zone: data.zone,
          siteType: data.pages === "1" ? "landing" : data.pages === "2-3" ? "vitrine" : "multipage",
          pages: data.pages || "1",
          languages: data.languages || "1",
          domain: data.domain || "ne-sais-pas",
          timing: data.timing || "normal",
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
        pages: data.pages,
        languages: data.languages,
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
          Votre demande a été envoyée. On vous répond sous 24h avec une proposition adaptée.
        </p>
        <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-medium mb-2">Récapitulatif :</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Activité :</strong> {activityOptions.find(a => a.value === data.activity)?.label || data.activity}</p>
            <p><strong>Pages :</strong> {pagesOptions.find(p => p.value === data.pages)?.label || data.pages}</p>
            {data.languages && <p><strong>Langues :</strong> {languagesOptions.find(l => l.value === data.languages)?.label || data.languages}</p>}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Nos sites démarrent à {BRAND.PRICING.PACK_LANDING}€ + {BRAND.SUB_PRICE}€/mois
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Envie d'en parler de vive voix ?
        </p>
        <CalPopupButton variant="outline" className="w-full" data-testid="button-cal-popup" />
      </div>
    );
  }

  return (
    <div ref={formRef} className="w-full max-w-lg mx-auto bg-background border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col scroll-mt-8">
      <div className="h-2 bg-secondary w-full">
        <div className="h-full bg-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Question 1/3</span>
                </div>
                <h3 className="text-xl font-bold">Quelle est votre activité ?</h3>
              </div>
              <div className="space-y-2.5">
                {activityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      triggerFormStart();
                      updateData("activity", opt.value);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3.5 p-3.5 border rounded-xl text-left transition-all group",
                      data.activity === opt.value
                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                        : "border-input hover:border-accent/40 hover:bg-accent/[0.02]"
                    )}
                    data-testid={`button-activity-${opt.value}`}
                  >
                    <span className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-colors",
                      data.activity === opt.value
                        ? "bg-accent/15"
                        : "bg-secondary"
                    )}>
                      {opt.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm block">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.description}</span>
                    </div>
                    <ArrowRight className={cn(
                      "w-4 h-4 flex-shrink-0 transition-all",
                      data.activity === opt.value
                        ? "text-accent"
                        : "text-muted-foreground/40 group-hover:text-muted-foreground"
                    )} />
                  </button>
                ))}
              </div>

              {data.activity && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Où êtes-vous basé ?</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {zoneOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            triggerFormStart();
                            updateData("zone", opt.value);
                          }}
                          className={cn(
                            "flex items-center gap-2.5 p-3 border rounded-xl text-left transition-all",
                            data.zone === opt.value
                              ? "border-accent bg-accent/5 ring-1 ring-accent"
                              : "border-input hover:border-accent/40 hover:bg-accent/[0.02]"
                          )}
                          data-testid={`button-zone-${opt.value}`}
                        >
                          <span className="text-2xl leading-none">{opt.flag}</span>
                          <span className="font-medium text-sm">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.zone && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block">
                        <span className="text-sm font-medium mb-1.5 block">Nom de votre business <span className="text-muted-foreground font-normal">(optionnel)</span></span>
                        <input 
                          type="text" 
                          className="w-full p-3 rounded-xl border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none text-sm"
                          placeholder="Ex: Chez Marco, Studio Zen..."
                          value={data.businessName}
                          onChange={(e) => updateData("businessName", e.target.value)}
                          data-testid="input-wizard-business-name"
                        />
                      </label>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Question 2/3</span>
                </div>
                <h3 className="text-xl font-bold">Vos besoins</h3>
                <p className="text-sm text-muted-foreground mt-1">On adapte la formule à votre projet.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Combien de pages ?
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {pagesOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateData("pages", opt.value)}
                        className={cn(
                          "p-3 border rounded-lg text-left transition-all text-sm",
                          data.pages === opt.value
                            ? "border-accent bg-accent/5 ring-1 ring-accent"
                            : "border-input hover:border-accent/50"
                        )}
                        data-testid={`button-pages-${opt.value}`}
                      >
                        <span className="font-medium block">{opt.label}</span>
                        <span className="text-xs text-muted-foreground">{opt.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    Combien de langues ?
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {languagesOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateData("languages", opt.value)}
                        className={cn(
                          "p-3 border rounded-lg text-center transition-all text-sm",
                          data.languages === opt.value
                            ? "border-accent bg-accent/5 ring-1 ring-accent"
                            : "border-input hover:border-accent/50"
                        )}
                        data-testid={`button-languages-${opt.value}`}
                      >
                        <span className="font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    Avez-vous un nom de domaine ?
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {domainOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateData("domain", opt.value)}
                        className={cn(
                          "p-2.5 border rounded-lg text-center transition-all text-sm",
                          data.domain === opt.value
                            ? "border-accent bg-accent/5 ring-1 ring-accent"
                            : "border-input hover:border-accent/50"
                        )}
                        data-testid={`button-domain-${opt.value}`}
                      >
                        <span className="font-medium text-xs">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Quel délai ?
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {timingOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateData("timing", opt.value)}
                        className={cn(
                          "p-2.5 border rounded-lg text-center transition-all text-sm",
                          data.timing === opt.value
                            ? "border-accent bg-accent/5 ring-1 ring-accent"
                            : "border-input hover:border-accent/50"
                        )}
                        data-testid={`button-timing-${opt.value}`}
                      >
                        <span className="font-medium text-xs block">{opt.label}</span>
                        <span className="text-xs text-muted-foreground">{opt.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">Question 3/3</span>
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
