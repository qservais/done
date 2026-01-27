import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ChevronLeft, Loader2, FileText, Layout, Layers, ShoppingCart, Phone, FileQuestion, Calendar, MessageSquare, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";
import { DoneStamp } from "@/components/signature";
import { trackFormStart, trackFormStep, trackFormSubmit, trackFormError, trackPackSelect } from "@/lib/tracking";

type PackType = "landing" | "vitrine" | "multipage" | "ecommerce" | "";

type StepData = {
  activity: string;
  zone: string;
  pack: PackType;
  languages: string;
  domain: string;
  emailPro: string;
  siteInspi: string;
  objectifs: string[];
  timing: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  companyWebsite: string;
};

const initialData: StepData = {
  activity: "",
  zone: "",
  pack: "",
  languages: "1",
  domain: "non",
  emailPro: "non",
  siteInspi: "",
  objectifs: [],
  timing: "Normal (1 semaine)",
  name: "",
  email: "",
  phone: "",
  message: "",
  companyWebsite: "",
};

const objectifOptions = [
  { id: "appel", label: "Vous appeler", description: "Afficher votre numéro", icon: Phone },
  { id: "devis", label: "Demander un devis", description: "Formulaire de demande", icon: FileQuestion },
  { id: "reservation", label: "Réserver / Prendre RDV", description: "Calendrier en ligne", icon: Calendar },
  { id: "message", label: "Vous contacter", description: "Formulaire de contact", icon: MessageSquare },
  { id: "achat", label: "Acheter directement", description: "Paiement en ligne", icon: CreditCard },
];

const MEET_BOOKING_URL = "https://calendar.app.google/zFbiLZ22gFyL1cGf8";

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

export function LeadWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const totalSteps = 6;
  const progress = Math.min((step / totalSteps) * 100, 100);

  const stepNames = ['activite', 'pack', 'options', 'timing', 'coordonnees', 'recapitulatif'];
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (step === 1) {
      trackFormStart('lead_wizard');
    }
    trackFormStep('lead_wizard', step, stepNames[step - 1] || 'unknown');
    
    // Scroll to top of form on step change (but not on initial mount)
    if (formRef.current && !isInitialMount.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    isInitialMount.current = false;
  }, [step]);

  const updateData = <K extends keyof StepData>(key: K, value: StepData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const selectPack = (packId: PackType) => {
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
        return true;
      case 4:
        return Boolean(data.timing);
      case 5:
        return Boolean(data.name.trim() && data.email.trim() && data.phone.trim());
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!canProceed()) return;
    if (step < 5) setStep(step + 1);
    else calculateSummary();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const calculateSummary = () => {
    setStep(6);
  };

  const selectedPack = packs.find(p => p.id === data.pack);

  const submitForm = async () => {
    setIsSubmitting(true);
    
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
        <h3 className="text-2xl font-bold mb-4">Merci — on revient vers vous sous 48h.</h3>
        <p className="text-muted-foreground mb-6">
          Vérifiez votre boîte mail ({data.email}) — on vous a envoyé un récap + la liste des éléments pour démarrer.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          <strong>Pour aller plus vite :</strong> répondez directement à l'email qu'on vient de vous envoyer.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={MEET_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 font-semibold hover:bg-accent/90 transition-colors"
          >
            Réserver un call 30 min
          </a>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retour au site
          </Button>
        </div>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-xl max-w-2xl mx-auto">
        <div className="bg-primary p-6 text-primary-foreground">
          <h3 className="text-2xl font-bold">Récapitulatif de votre projet</h3>
          <p className="opacity-80">Vérifiez avant d'envoyer.</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Activité</span>
              <p className="font-medium">{data.activity || "Non spécifié"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Zone</span>
              <p className="font-medium">{data.zone || "Non spécifié"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Délai souhaité</span>
              <p className="font-medium">{data.timing}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Langues</span>
              <p className="font-medium">{data.languages === "1" ? "Français" : "FR + autre langue"}</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h4 className="font-bold mb-4">Votre pack</h4>
            {selectedPack && (
              <div className={cn(
                "p-4 rounded-lg border-2 flex justify-between items-center",
                selectedPack.onQuote ? "border-amber-500 bg-amber-50" : "border-accent bg-accent/5"
              )}>
                <div className="flex items-center gap-3">
                  <selectedPack.icon className="w-6 h-6 text-accent" />
                  <div>
                    <span className="font-bold">{selectedPack.name}</span>
                    <p className="text-sm text-muted-foreground">{selectedPack.description}</p>
                  </div>
                </div>
                <span className="font-bold text-xl">
                  {selectedPack.onQuote ? "Sur devis" : `${selectedPack.price}€`}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center mt-4 p-3 bg-secondary/50 rounded-lg">
              <span>Abonnement mensuel :</span>
              <span className="font-bold">{BRAND.SUB_PRICE}€/mois</span>
            </div>
            {selectedPack?.onQuote && (
              <p className="text-sm text-amber-700 mt-4 bg-amber-50 p-3 rounded-lg">
                Pour un projet e-commerce, on vous recontacte pour établir un devis personnalisé selon vos besoins.
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              *Estimation non contractuelle. Le devis final peut varier selon les options spécifiques.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setStep(5)}>Modifier</Button>
            <Button className="w-full bg-accent text-white hover:bg-accent/90 font-bold" onClick={submitForm} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Valider ma demande
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className="w-full max-w-lg mx-auto bg-background border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px] scroll-mt-8">
      <div className="h-2 bg-secondary w-full">
        <div className="h-full bg-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Step 1: Activity & Zone */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="text-2xl font-bold">Parlons de vous.</h3>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Que faites-vous ?</span>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-md border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                    placeholder="Ex: Architecte, Coach sportif, Restaurant italien..."
                    value={data.activity}
                    onChange={(e) => updateData("activity", e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Où êtes-vous basé ?</span>
                  <select 
                    className="w-full p-3 rounded-md border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                    value={data.zone}
                    onChange={(e) => updateData("zone", e.target.value)}
                  >
                    <option value="">Choisir...</option>
                    <option value="Belgique">Belgique</option>
                    <option value="France">France</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Autre">Autre pays</option>
                  </select>
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 2: Pack Selection */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="text-2xl font-bold">Choisissez votre pack.</h3>
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
            </motion.div>
          )}

          {/* Step 3: Options */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="text-2xl font-bold">Quelques détails.</h3>
              <div className="space-y-5">
                <div>
                  <span className="text-sm font-medium mb-3 block">Quand quelqu'un visite votre site, vous voulez qu'il... <span className="text-muted-foreground font-normal">(plusieurs choix possibles)</span></span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {objectifOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = data.objectifs.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            const newObjectifs = isSelected
                              ? data.objectifs.filter(o => o !== opt.id)
                              : [...data.objectifs, opt.id];
                            updateData("objectifs", newObjectifs);
                          }}
                          className={cn(
                            "relative p-4 border-2 rounded-xl text-center transition-all",
                            isSelected 
                              ? "border-accent bg-accent/5 shadow-sm" 
                              : "border-input hover:border-accent/50 hover:bg-muted/30"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <Icon className={cn("w-6 h-6 mx-auto mb-2", isSelected ? "text-accent" : "text-muted-foreground")} />
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-medium mb-1.5 block">Un site web que vous aimez bien ? (optionnel)</span>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-md border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                    placeholder="Ex: www.exemple.com"
                    value={data.siteInspi}
                    onChange={(e) => updateData("siteInspi", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Ça nous aide à comprendre le style que vous aimez</p>
                </label>

                <label className="block">
                  <span className="text-sm font-medium mb-2 block">Votre site sera en combien de langues ?</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateData("languages", "1")}
                      className={cn("p-3 border rounded-lg text-center text-sm", data.languages === "1" ? "border-accent bg-accent/5" : "border-input")}
                    >
                      1 langue (FR)
                    </button>
                    <button
                      onClick={() => updateData("languages", "2")}
                      className={cn("p-3 border rounded-lg text-center text-sm", data.languages === "2" ? "border-accent bg-accent/5" : "border-input")}
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
                    >Oui, j'en ai une</button>
                    <button
                      onClick={() => updateData("domain", "non")}
                      className={cn("flex-1 p-3 border rounded-md text-sm", data.domain === "non" ? "bg-primary text-primary-foreground" : "border-input")}
                    >Non, à créer</button>
                  </div>
                </label>
                
                <label className="block">
                  <span className="text-sm font-medium mb-2 block">Besoin d'une adresse email pro ? (ex: vous@votresite.be)</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateData("emailPro", "oui")}
                      className={cn("flex-1 p-3 border rounded-md text-sm", data.emailPro === "oui" ? "bg-primary text-primary-foreground" : "border-input")}
                    >Oui</button>
                    <button
                      onClick={() => updateData("emailPro", "non")}
                      className={cn("flex-1 p-3 border rounded-md text-sm", data.emailPro === "non" ? "bg-primary text-primary-foreground" : "border-input")}
                    >Non</button>
                  </div>
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 4: Timing */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="text-2xl font-bold">Quand en avez-vous besoin ?</h3>
              <div className="space-y-3">
                {["Urgent (72h)", "Normal (1 semaine)", "Flexible"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateData("timing", opt)}
                    className={cn(
                      "w-full p-4 border rounded-lg text-left hover:border-accent transition-colors",
                      data.timing === opt ? "border-accent bg-accent/5" : "border-input"
                    )}
                  >
                    <span className="font-medium">{opt}</span>
                    {opt === "Urgent (72h)" && (
                      <p className="text-xs text-muted-foreground mt-1">Pour les projets prioritaires</p>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Contact Info */}
          {step === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="text-2xl font-bold">Dernière étape.</h3>
              <p className="text-sm text-muted-foreground">Vos coordonnées pour qu'on vous recontacte.</p>
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
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={step === 1}
            className={cn("pl-0 hover:bg-transparent", step === 1 && "invisible")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour
          </Button>

          <Button 
            onClick={nextStep}
            className="rounded-full px-6"
            disabled={!canProceed()}
          >
            {step === 5 ? "Voir mon résumé" : "Continuer"} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
