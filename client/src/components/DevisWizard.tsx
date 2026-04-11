import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Plus, X, Loader2, Sparkles,
  Shield, User, Mail, Phone, ArrowRight, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { modules } from "@/data/pricing";

type BriefData = {
  companyName: string;
  activity: string;
  activityDescription: string;
  services: string[];
  differentiator: string;
  visitorActions: string[];
  socialInstagram: string;
  socialFacebook: string;
  socialGoogle: string;
  socialTiktok: string;
  socialLinkedin: string;
  languages: string[];
  objectives: string[];
  sitePhone: string;
  siteEmail: string;
  siteAddress: string;
  siteHours: string;
  hasPhotos: boolean | null;
  module: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
};

const INITIAL: BriefData = {
  companyName: "", activity: "", activityDescription: "", services: [],
  differentiator: "", visitorActions: [], socialInstagram: "", socialFacebook: "",
  socialGoogle: "", socialTiktok: "", socialLinkedin: "", languages: [],
  objectives: [], sitePhone: "", siteEmail: "", siteAddress: "", siteHours: "",
  hasPhotos: null, module: "", firstname: "", lastname: "", email: "", phone: "",
};

const TOTAL_STEPS = 13;

const VISITOR_ACTIONS = [
  { id: "call", label: "Appeler", emoji: "📞" },
  { id: "quote", label: "Demander un devis", emoji: "📋" },
  { id: "book", label: "Prendre rendez-vous", emoji: "📅" },
  { id: "reserve", label: "Réserver une table", emoji: "🍽️" },
  { id: "visit", label: "Venir en magasin", emoji: "🏪" },
  { id: "message", label: "Envoyer un message", emoji: "✉️" },
  { id: "order", label: "Commander en ligne", emoji: "🛒" },
  { id: "menu", label: "Voir le menu", emoji: "🍕" },
];

const LANGUAGES = [
  { id: "Français", flag: "🇫🇷" },
  { id: "English", flag: "🇬🇧" },
  { id: "Español", flag: "🇪🇸" },
  { id: "Deutsch", flag: "🇩🇪" },
  { id: "Italiano", flag: "🇮🇹" },
  { id: "Nederlands", flag: "🇳🇱" },
];

const OBJECTIVES = [
  { id: "leads", label: "Générer des prospects", emoji: "📩" },
  { id: "ecommerce", label: "Vendre en ligne", emoji: "🛒" },
  { id: "seo", label: "Être visible sur Google", emoji: "🔍" },
  { id: "brand", label: "Renforcer ma crédibilité", emoji: "🏆" },
];

function isStepValid(step: number, data: BriefData): boolean {
  switch (step) {
    case 1: return data.companyName.trim().length > 0;
    case 2: return data.activity.trim().length > 0;
    case 3: return data.activityDescription.trim().length > 0;
    case 4: return true;
    case 5: return true;
    case 6: return data.visitorActions.length > 0;
    case 7: return true;
    case 8: return data.languages.length > 0;
    case 9: return data.objectives.length > 0;
    case 10: return true;
    case 11: return data.hasPhotos !== null;
    case 12: return data.module !== "";
    case 13: return data.firstname.trim().length > 0 && data.email.trim().length > 0;
    default: return true;
  }
}

const OPTIONAL_STEPS = new Set([4, 5, 7, 10]);

export function DevisWizard() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<BriefData>(INITIAL);
  const [serviceInput, setServiceInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const progress = (step / TOTAL_STEPS) * 100;
  const isOptional = OPTIONAL_STEPS.has(step);
  const canContinue = isOptional || isStepValid(step, data);
  const isLast = step === TOTAL_STEPS;

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    setError("");
    setAiSuggestion("");
  };

  const set = <K extends keyof BriefData>(key: K, val: BriefData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const toggleArr = (key: "visitorActions" | "languages" | "objectives", val: string) =>
    setData((d) => {
      const arr = d[key] as string[];
      return { ...d, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });

  const addService = () => {
    const v = serviceInput.trim();
    if (v && !data.services.includes(v)) set("services", [...data.services, v]);
    setServiceInput("");
  };

  const generateDescription = async () => {
    setAiLoading(true);
    setAiSuggestion("");
    try {
      const res = await fetch("/api/briefs/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: data.companyName, activity: data.activity }),
      });
      const json = await res.json();
      if (json.success) setAiSuggestion(json.description);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid(13, data)) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.companyName,
          activity: data.activity,
          activityDescription: data.activityDescription || null,
          services: data.services.length > 0 ? JSON.stringify(data.services) : null,
          differentiator: data.differentiator || null,
          visitorActions: data.visitorActions.length > 0 ? JSON.stringify(data.visitorActions) : null,
          socialInstagram: data.socialInstagram || null,
          socialFacebook: data.socialFacebook || null,
          socialGoogle: data.socialGoogle || null,
          socialTiktok: data.socialTiktok || null,
          socialLinkedin: data.socialLinkedin || null,
          languages: data.languages.length > 0 ? JSON.stringify(data.languages) : null,
          objectives: data.objectives.length > 0 ? JSON.stringify(data.objectives) : null,
          sitePhone: data.sitePhone || null,
          siteEmail: data.siteEmail || null,
          siteAddress: data.siteAddress || null,
          siteHours: data.siteHours || null,
          hasPhotos: data.hasPhotos,
          module: data.module || null,
          firstname: data.firstname,
          lastname: data.lastname || null,
          email: data.email,
          phone: data.phone || null,
        }),
      });
      const json = await res.json();
      if (json.success) setSubmitted(true);
      else setError("Une erreur est survenue. Veuillez réessayer.");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="h-2 bg-accent w-full" />
        <div className="p-6 md:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Votre brief est entre nos mains&nbsp;!</h3>
          <p className="text-muted-foreground mb-6">On revient vers vous dans les 24h.</p>
          <div className="bg-secondary/60 border border-border rounded-xl p-4 text-left mb-6 space-y-1.5 text-sm">
            <p><span className="text-muted-foreground">Entreprise</span> — <strong>{data.companyName}</strong></p>
            <p><span className="text-muted-foreground">Activité</span> — <strong>{data.activity}</strong></p>
            {data.module && (
              <p><span className="text-muted-foreground">Module</span> — <strong>{modules.find(m => m.id === data.module)?.name}</strong></p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 rounded-full h-11 bg-accent hover:bg-accent/90 text-white" asChild>
              <Link href="/realisations">Voir nos réalisations <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button variant="outline" className="flex-1 rounded-full h-11" asChild>
              <Link href="/">← Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    const variants = {
      enter: (d: number) => ({ x: d > 0 ? 32 : -32, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (d: number) => ({ x: d < 0 ? 32 : -32, opacity: 0 }),
    };

    return (
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {stepContent()}
        </motion.div>
      </AnimatePresence>
    );
  };

  const badge = (
    <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">
      Étape {step}/{TOTAL_STEPS}{isOptional ? " — optionnelle" : ""}
    </span>
  );

  const optionCard = (
    selected: boolean,
    onClick: () => void,
    icon: string,
    title: string,
    subtitle?: string,
    arrow = true,
  ) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 p-3.5 border rounded-xl text-left transition-all group",
        selected
          ? "border-accent bg-accent/5 ring-1 ring-accent"
          : "border-input hover:border-accent/40 hover:bg-accent/[0.02]"
      )}
    >
      <span className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-colors",
        selected ? "bg-accent/15" : "bg-secondary"
      )}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-sm block">{title}</span>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
      {arrow && (
        <ArrowRight className={cn(
          "w-4 h-4 flex-shrink-0 transition-all",
          selected ? "text-accent" : "text-muted-foreground/40 group-hover:text-muted-foreground"
        )} />
      )}
      {!arrow && selected && <Check className="w-4 h-4 text-accent flex-shrink-0" />}
    </button>
  );

  const inputClass = "w-full p-3 rounded-xl border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none text-base transition-all";
  const textareaClass = "w-full p-3 rounded-xl border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none text-base resize-none transition-all";

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Comment s'appelle votre entreprise ?</h3>
            </div>
            <input
              type="text"
              value={data.companyName}
              onChange={e => set("companyName", e.target.value)}
              onKeyDown={e => e.key === "Enter" && isStepValid(1, data) && goTo(2)}
              placeholder="Ex: Cabinet Dupont, La Bonne Fourchette…"
              className={inputClass}
              autoComplete="organization"
              enterKeyHint="next"
              data-testid="input-devis-company"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Quelle est votre activité ?</h3>
              <p className="text-sm text-muted-foreground mt-1">Décrivez votre métier en quelques mots.</p>
            </div>
            <input
              type="text"
              value={data.activity}
              onChange={e => set("activity", e.target.value)}
              onKeyDown={e => e.key === "Enter" && isStepValid(2, data) && goTo(3)}
              placeholder="Ex: Dentiste spécialisé en orthodontie, Restaurant italien…"
              className={inputClass}
              autoComplete="off"
              enterKeyHint="next"
              data-testid="input-devis-activity"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Décrivez votre activité en quelques lignes</h3>
              <p className="text-sm text-muted-foreground mt-1">Ce texte sera utilisé comme base pour votre site.</p>
            </div>
            <div className="space-y-3">
              <textarea
                value={data.activityDescription}
                onChange={e => set("activityDescription", e.target.value)}
                placeholder="Ce qui vous rend unique, votre histoire, vos atouts…"
                rows={4}
                className={textareaClass}
                autoComplete="off"
                enterKeyHint="next"
                data-testid="textarea-devis-description"
              />
              <button
                type="button"
                onClick={generateDescription}
                disabled={aiLoading}
                className="flex items-center gap-2 text-sm font-semibold text-accent hover:opacity-75 transition-opacity disabled:opacity-50"
                data-testid="button-devis-ai"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading ? "Génération en cours…" : "✨ Générer avec l'IA"}
              </button>
              {aiSuggestion && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="button"
                  onClick={() => { set("activityDescription", aiSuggestion); setAiSuggestion(""); }}
                  className="w-full text-left bg-amber-50 border border-amber-200 rounded-xl p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
                    Suggestion IA — Cliquez pour utiliser
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{aiSuggestion}</p>
                </motion.button>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Quels services ou produits proposez-vous ?</h3>
              <p className="text-sm text-muted-foreground mt-1">Ajoutez des tags pour chaque service.</p>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serviceInput}
                  onChange={e => setServiceInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addService(); } }}
                  placeholder="Ex: Coiffure femme, Balayage…"
                  className={cn(inputClass, "flex-1")}
                  autoComplete="off"
                  enterKeyHint="done"
                  data-testid="input-devis-service"
                />
                <button
                  type="button"
                  onClick={addService}
                  className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {data.services.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.services.map(s => (
                    <span key={s} className="flex items-center gap-1.5 bg-secondary border border-border rounded-full px-3.5 py-1.5 text-sm font-medium">
                      {s}
                      <button type="button" onClick={() => set("services", data.services.filter(x => x !== s))} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Qu'est-ce qui vous différencie ?</h3>
              <p className="text-sm text-muted-foreground mt-1">Ce qui fait que vos clients vous choisissent.</p>
            </div>
            <textarea
              value={data.differentiator}
              onChange={e => set("differentiator", e.target.value)}
              placeholder="Ex: 15 ans d'expérience, service personnalisé, livraison gratuite…"
              rows={3}
              className={textareaClass}
              autoComplete="off"
              enterKeyHint="next"
              data-testid="textarea-devis-differentiator"
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Que doivent faire vos visiteurs ?</h3>
              <p className="text-sm text-muted-foreground mt-1">Plusieurs choix possibles.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {VISITOR_ACTIONS.map(a => {
                const sel = data.visitorActions.includes(a.id);
                return optionCard(sel, () => toggleArr("visitorActions", a.id), a.emoji, a.label, undefined, false);
              })}
            </div>
            {data.visitorActions.length === 0 && (
              <p className="text-xs text-muted-foreground text-center">Sélectionnez au moins une option pour continuer</p>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Vos réseaux sociaux</h3>
              <p className="text-sm text-muted-foreground mt-1">On les intégrera directement à votre site.</p>
            </div>
            <div className="space-y-2.5">
              {([
                { key: "socialInstagram", label: "Instagram", icon: "📸", placeholder: "@votrecompte" },
                { key: "socialFacebook", label: "Facebook", icon: "👍", placeholder: "facebook.com/votrepages" },
                { key: "socialGoogle", label: "Google Business", icon: "📍", placeholder: "Nom de votre fiche" },
                { key: "socialTiktok", label: "TikTok", icon: "🎵", placeholder: "@votrecompte" },
                { key: "socialLinkedin", label: "LinkedIn", icon: "💼", placeholder: "linkedin.com/in/..." },
              ] as const).map(f => (
                <div key={f.key} className="flex items-center gap-3 border border-input rounded-xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-accent focus-within:border-accent transition-all bg-transparent">
                  <span className="text-xl flex-shrink-0">{f.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground mb-0.5">{f.label}</p>
                    <input
                      type="text"
                      value={data[f.key]}
                      onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full text-base focus:outline-none bg-transparent"
                      enterKeyHint="next"
                      autoComplete="off"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">En quelle langue votre site ?</h3>
              <p className="text-sm text-muted-foreground mt-1">Plusieurs langues possibles.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LANGUAGES.map(l => {
                const sel = data.languages.includes(l.id);
                return optionCard(sel, () => toggleArr("languages", l.id), l.flag, l.id, undefined, false);
              })}
            </div>
            {data.languages.length === 0 && (
              <p className="text-xs text-muted-foreground text-center">Sélectionnez au moins une langue</p>
            )}
          </div>
        );

      case 9:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Quel est l'objectif principal de votre site ?</h3>
              <p className="text-sm text-muted-foreground mt-1">Plusieurs choix possibles.</p>
            </div>
            <div className="space-y-2.5">
              {OBJECTIVES.map(o => {
                const sel = data.objectives.includes(o.id);
                return optionCard(sel, () => toggleArr("objectives", o.id), o.emoji, o.label, undefined, false);
              })}
            </div>
            {data.objectives.length === 0 && (
              <p className="text-xs text-muted-foreground text-center">Sélectionnez au moins un objectif</p>
            )}
          </div>
        );

      case 10:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Les infos de contact pour votre site</h3>
              <p className="text-sm text-muted-foreground mt-1">On les intégrera directement.</p>
            </div>
            <div className="space-y-2.5">
              {([
                { key: "sitePhone", icon: "📞", label: "Téléphone", placeholder: "+32 470 00 00 00", type: "tel" },
                { key: "siteEmail", icon: "📧", label: "Email professionnel", placeholder: "contact@votreboite.be", type: "email" },
                { key: "siteAddress", icon: "📍", label: "Adresse", placeholder: "Rue de la Paix 1, 4000 Liège", type: "text" },
                { key: "siteHours", icon: "🕐", label: "Horaires d'ouverture", placeholder: "Lun–Ven 9h–18h, Sam 9h–13h", type: "text" },
              ] as const).map(f => (
                <div key={f.key} className="flex items-center gap-3 border border-input rounded-xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-accent focus-within:border-accent transition-all bg-transparent">
                  <span className="text-xl flex-shrink-0">{f.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground mb-0.5">{f.label}</p>
                    <input
                      type={f.type}
                      value={data[f.key]}
                      onChange={e => set(f.key, e.target.value as never)}
                      placeholder={f.placeholder}
                      className="w-full text-base focus:outline-none bg-transparent"
                      enterKeyHint="next"
                      autoComplete={f.type === "email" ? "email" : f.type === "tel" ? "tel" : "off"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Avez-vous des photos de votre activité ?</h3>
            </div>
            <div className="space-y-2.5">
              {optionCard(
                data.hasPhotos === true,
                () => { set("hasPhotos", true); setTimeout(() => goTo(12), 200); },
                "📷", "Oui, je les enverrai", "Je fournirai mes propres photos"
              )}
              {optionCard(
                data.hasPhotos === false,
                () => { set("hasPhotos", false); setTimeout(() => goTo(12), 200); },
                "📸", "Non, utilisez des images stock", "done. choisira des images adaptées"
              )}
            </div>
          </div>
        );

      case 12:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Choisissez votre module mensuel</h3>
              <p className="text-sm text-muted-foreground mt-1">Hébergement, maintenance et suivi — résiliable à tout moment.</p>
            </div>
            <div className="space-y-2.5">
              {modules.map(m => {
                const sel = data.module === m.id;
                const priceStr = m.price.toFixed(2).replace(".", ",");
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => set("module", m.id)}
                    className={cn(
                      "w-full text-left p-4 border rounded-xl transition-all",
                      sel
                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                        : "border-input hover:border-accent/40 hover:bg-accent/[0.02]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{m.name}</span>
                          {m.popular && (
                            <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">★ Recommandé</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{m.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-base">{priceStr}€<span className="text-xs font-normal text-muted-foreground">/mois</span></p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {m.features.map(f => (
                        <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="text-accent">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 13:
        return (
          <div className="space-y-5">
            <div>
              <div className="mb-2">{badge}</div>
              <h3 className="text-xl font-bold">Comment vous recontacter ?</h3>
              <p className="text-sm text-muted-foreground mt-1">On vous répond sous 24h avec une proposition.</p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground mb-1.5 block">Prénom *</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={data.firstname}
                      onChange={e => set("firstname", e.target.value)}
                      placeholder="Jean"
                      className="w-full p-3 pl-10 rounded-xl border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none text-base transition-all"
                      autoComplete="given-name"
                      enterKeyHint="next"
                      data-testid="input-devis-firstname"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground mb-1.5 block">Nom</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={data.lastname}
                      onChange={e => set("lastname", e.target.value)}
                      placeholder="Dupont"
                      className="w-full p-3 pl-10 rounded-xl border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none text-base transition-all"
                      autoComplete="family-name"
                      enterKeyHint="next"
                      data-testid="input-devis-lastname"
                    />
                  </div>
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground mb-1.5 block">Email *</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full p-3 pl-10 rounded-xl border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none text-base transition-all"
                    autoComplete="email"
                    inputMode="email"
                    enterKeyHint="next"
                    data-testid="input-devis-email"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground mb-1.5 block">Téléphone</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={e => set("phone", e.target.value)}
                    placeholder="0498 12 34 56"
                    className="w-full p-3 pl-10 rounded-xl border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none text-base transition-all"
                    autoComplete="tel"
                    inputMode="tel"
                    enterKeyHint="done"
                    data-testid="input-devis-phone"
                  />
                </div>
              </label>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground text-center">Prénom et email requis — le téléphone est optionnel.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="h-2 bg-secondary w-full">
        <motion.div
          className="h-full bg-accent"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="flex-1">
          {renderStep()}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo(step - 1)}
                className="flex-shrink-0"
                data-testid="button-devis-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {isLast ? (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid(13, data) || submitting}
                className="flex-1 bg-accent hover:bg-accent/90 text-white rounded-full h-12"
                data-testid="button-devis-submit"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi en cours…</>
                ) : (
                  <>Envoyer mon brief <ChevronRight className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => goTo(step + 1)}
                disabled={!canContinue}
                className="flex-1 bg-accent hover:bg-accent/90 text-white rounded-full h-12"
                data-testid="button-devis-next"
              >
                {isOptional && !isStepValid(step, data) ? (
                  <>Passer <ChevronRight className="w-4 h-4 ml-1" /></>
                ) : (
                  <>Continuer <ChevronRight className="w-4 h-4 ml-1" /></>
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
