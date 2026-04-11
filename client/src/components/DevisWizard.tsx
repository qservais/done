import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, X, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
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
  companyName: "",
  activity: "",
  activityDescription: "",
  services: [],
  differentiator: "",
  visitorActions: [],
  socialInstagram: "",
  socialFacebook: "",
  socialGoogle: "",
  socialTiktok: "",
  socialLinkedin: "",
  languages: [],
  objectives: [],
  sitePhone: "",
  siteEmail: "",
  siteAddress: "",
  siteHours: "",
  hasPhotos: null,
  module: "",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
};

const TOTAL_STEPS = 13;

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0 }),
};

const transition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="fixed top-0 left-0 right-0 z-20 px-4 pt-3 pb-2 bg-[#fafafa]">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5 max-w-lg mx-auto">
        <span>Étape {step} / {TOTAL_STEPS}</span>
        <span>{pct}%</span>
      </div>
      <div className="max-w-lg mx-auto h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[var(--accent)] rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}

function StepWrapper({
  children,
  dir,
  stepKey,
}: {
  children: React.ReactNode;
  dir: number;
  stepKey: number | string;
}) {
  return (
    <AnimatePresence mode="wait" custom={dir}>
      <motion.div
        key={stepKey}
        custom={dir}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function QuestionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
      {children}
    </h2>
  );
}

function OptionCard({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
        selected
          ? "border-[var(--accent)] bg-[var(--accent)]/5 ring-2 ring-[var(--accent)]/20"
          : "border-gray-200 bg-white hover:border-gray-300"
      } ${className}`}
    >
      {children}
    </button>
  );
}

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
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 350);
  }, [step]);

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    setError("");
    setAiSuggestion("");
  };

  const next = () => go(step + 1);
  const back = () => go(step - 1);

  const set = <K extends keyof BriefData>(key: K, val: BriefData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const toggleArr = (key: "visitorActions" | "languages" | "objectives", val: string) => {
    setData((d) => {
      const arr = d[key] as string[];
      return { ...d, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
  };

  const addService = () => {
    const v = serviceInput.trim();
    if (v && !data.services.includes(v)) {
      set("services", [...data.services, v]);
    }
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
    } catch {
      // silent fail
    } finally {
      setAiLoading(false);
    }
  };

  const isValid = (): boolean => {
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
  };

  const handleSubmit = async () => {
    if (!isValid()) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
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
      };

      const res = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        setSubmitted(true);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[var(--accent)]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Votre brief est entre nos mains&nbsp;!
          </h1>
          <p className="text-gray-500 mb-3">On revient vers vous dans les 24h.</p>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 text-sm text-left mb-8 space-y-1">
            <p><span className="text-gray-400">Entreprise</span><br /><strong>{data.companyName}</strong></p>
            <p><span className="text-gray-400">Activité</span><br /><strong>{data.activity}</strong></p>
            {data.module && (
              <p><span className="text-gray-400">Module choisi</span><br />
              <strong>{modules.find((m) => m.id === data.module)?.name}</strong></p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/realisations" className="flex-1 py-3 px-5 rounded-full bg-[var(--accent)] text-white font-semibold text-center hover:bg-[var(--accent)]/90 transition-colors">
              Voir nos réalisations →
            </Link>
            <Link href="/" className="flex-1 py-3 px-5 rounded-full border border-gray-200 text-gray-700 font-semibold text-center hover:bg-gray-50 transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
          <p className="mt-8 font-serif font-bold text-xl text-gray-900">
            done<span className="text-[var(--accent)]">.</span>
          </p>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <QuestionTitle>Comment s'appelle votre entreprise&nbsp;?</QuestionTitle>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={data.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isValid() && next()}
              placeholder="Ex: Cabinet Dupont, La Bonne Fourchette…"
              className="w-full text-lg border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
            />
          </div>
        );

      case 2:
        return (
          <div>
            <QuestionTitle>Quelle est votre activité&nbsp;?</QuestionTitle>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={data.activity}
              onChange={(e) => set("activity", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isValid() && next()}
              placeholder="Ex: Dentiste spécialisé en orthodontie, Restaurant italien…"
              className="w-full text-lg border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
            />
          </div>
        );

      case 3:
        return (
          <div>
            <QuestionTitle>Décrivez votre activité en quelques lignes</QuestionTitle>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={data.activityDescription}
              onChange={(e) => set("activityDescription", e.target.value)}
              placeholder="Ce qui vous rend unique, votre histoire, vos atouts…"
              rows={4}
              className="w-full text-base border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-[var(--accent)] transition-colors bg-white resize-none"
            />
            <button
              type="button"
              onClick={generateDescription}
              disabled={aiLoading}
              className="mt-3 flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {aiLoading ? "Génération en cours…" : "✨ Générer avec l'IA"}
            </button>
            {aiSuggestion && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                type="button"
                onClick={() => {
                  set("activityDescription", aiSuggestion);
                  setAiSuggestion("");
                }}
                className="mt-3 w-full text-left bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
                  Notre suggestion — Cliquez pour utiliser
                </p>
                <p className="text-gray-700 leading-relaxed">{aiSuggestion}</p>
              </motion.button>
            )}
          </div>
        );

      case 4:
        return (
          <div>
            <QuestionTitle>Quels services ou produits proposez-vous&nbsp;?</QuestionTitle>
            <p className="text-sm text-gray-400 mb-4">Ajoutez autant de tags que vous voulez — étape optionnelle</p>
            <div className="flex gap-2 mb-4">
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addService(); } }}
                placeholder="Ex: Coiffure femme, Balayage…"
                className="flex-1 text-base border-2 border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
              />
              <button
                type="button"
                onClick={addService}
                className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent)]/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {data.services.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.services.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 bg-gray-100 rounded-full px-4 py-1.5 text-sm font-medium">
                    {s}
                    <button type="button" onClick={() => set("services", data.services.filter((x) => x !== s))} className="text-gray-400 hover:text-gray-700">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div>
            <QuestionTitle>Qu'est-ce qui vous différencie&nbsp;?</QuestionTitle>
            <p className="text-sm text-gray-400 mb-4">Ce qui fait que vos clients vous choisissent vous plutôt qu'un autre — optionnel</p>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={data.differentiator}
              onChange={(e) => set("differentiator", e.target.value)}
              placeholder="Ex: 15 ans d'expérience, livraison gratuite, service personnalisé…"
              rows={3}
              className="w-full text-base border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-[var(--accent)] transition-colors bg-white resize-none"
            />
          </div>
        );

      case 6: {
        const actions = [
          { id: "call", label: "Appeler", emoji: "📞" },
          { id: "quote", label: "Demander un devis", emoji: "📋" },
          { id: "book", label: "Prendre rendez-vous", emoji: "📅" },
          { id: "reserve", label: "Réserver une table", emoji: "🍽️" },
          { id: "visit", label: "Venir en magasin", emoji: "🏪" },
          { id: "message", label: "Envoyer un message", emoji: "✉️" },
          { id: "order", label: "Commander en ligne", emoji: "🛒" },
          { id: "menu", label: "Voir le menu", emoji: "🍕" },
        ];
        return (
          <div>
            <QuestionTitle>Que doivent faire vos visiteurs&nbsp;?</QuestionTitle>
            <p className="text-sm text-gray-400 mb-4">Plusieurs choix possibles</p>
            <div className="grid grid-cols-2 gap-2.5">
              {actions.map((a) => {
                const sel = data.visitorActions.includes(a.id);
                return (
                  <OptionCard key={a.id} selected={sel} onClick={() => toggleArr("visitorActions", a.id)}>
                    <span className="text-xl">{a.emoji}</span>
                    <p className="text-sm font-medium mt-1">{a.label}</p>
                  </OptionCard>
                );
              })}
            </div>
          </div>
        );
      }

      case 7: {
        const socials = [
          { key: "socialInstagram", label: "Instagram", icon: "📸", placeholder: "@votrecompte" },
          { key: "socialFacebook", label: "Facebook", icon: "👍", placeholder: "facebook.com/votrepages" },
          { key: "socialGoogle", label: "Google Business", icon: "📍", placeholder: "Nom de votre fiche" },
          { key: "socialTiktok", label: "TikTok", icon: "🎵", placeholder: "@votrecompte" },
          { key: "socialLinkedin", label: "LinkedIn", icon: "💼", placeholder: "linkedin.com/in/..." },
        ] as const;
        return (
          <div>
            <QuestionTitle>Vos réseaux sociaux</QuestionTitle>
            <p className="text-sm text-gray-400 mb-4">Pour les intégrer à votre site — optionnel</p>
            <div className="space-y-3">
              {socials.map((s) => (
                <div key={s.key} className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[var(--accent)] transition-colors">
                  <span className="text-xl flex-shrink-0">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 mb-0.5">{s.label}</p>
                    <input
                      type="text"
                      value={data[s.key]}
                      onChange={(e) => set(s.key, e.target.value)}
                      placeholder={s.placeholder}
                      className="w-full text-sm focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 8: {
        const langs = [
          { id: "Français", flag: "🇫🇷" },
          { id: "English", flag: "🇬🇧" },
          { id: "Español", flag: "🇪🇸" },
          { id: "Deutsch", flag: "🇩🇪" },
          { id: "Italiano", flag: "🇮🇹" },
          { id: "Nederlands", flag: "🇳🇱" },
        ];
        return (
          <div>
            <QuestionTitle>En quelle langue votre site&nbsp;?</QuestionTitle>
            <p className="text-sm text-gray-400 mb-4">Plusieurs langues possibles</p>
            <div className="grid grid-cols-2 gap-2.5">
              {langs.map((l) => {
                const sel = data.languages.includes(l.id);
                return (
                  <OptionCard key={l.id} selected={sel} onClick={() => toggleArr("languages", l.id)}>
                    <span className="text-2xl">{l.flag}</span>
                    <p className="text-sm font-medium mt-1">{l.id}</p>
                  </OptionCard>
                );
              })}
            </div>
          </div>
        );
      }

      case 9: {
        const objs = [
          { id: "leads", label: "Générer des prospects", emoji: "📩" },
          { id: "ecommerce", label: "Vendre en ligne", emoji: "🛒" },
          { id: "seo", label: "Être visible sur Google", emoji: "🔍" },
          { id: "brand", label: "Renforcer ma crédibilité", emoji: "🏆" },
        ];
        return (
          <div>
            <QuestionTitle>Quel est l'objectif principal de votre site&nbsp;?</QuestionTitle>
            <p className="text-sm text-gray-400 mb-4">Plusieurs choix possibles</p>
            <div className="grid grid-cols-2 gap-3">
              {objs.map((o) => {
                const sel = data.objectives.includes(o.id);
                return (
                  <OptionCard key={o.id} selected={sel} onClick={() => toggleArr("objectives", o.id)} className="py-5">
                    <span className="text-3xl block mb-2">{o.emoji}</span>
                    <p className="text-sm font-semibold">{o.label}</p>
                  </OptionCard>
                );
              })}
            </div>
          </div>
        );
      }

      case 10:
        return (
          <div>
            <QuestionTitle>Les infos de contact pour votre site</QuestionTitle>
            <p className="text-sm text-gray-400 mb-4">On les intégrera directement — optionnel</p>
            <div className="space-y-3">
              {[
                { key: "sitePhone", label: "Téléphone", icon: "📞", placeholder: "+32 470 00 00 00", type: "tel" },
                { key: "siteEmail", label: "Email", icon: "📧", placeholder: "contact@votreentreprise.be", type: "email" },
                { key: "siteAddress", label: "Adresse", icon: "📍", placeholder: "Rue de la Paix 1, 4000 Liège", type: "text" },
                { key: "siteHours", label: "Horaires d'ouverture", icon: "🕐", placeholder: "Lun–Ven 9h–18h, Sam 9h–13h", type: "text" },
              ].map((f) => (
                <div key={f.key} className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[var(--accent)] transition-colors">
                  <span className="text-xl flex-shrink-0">{f.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 mb-0.5">{f.label}</p>
                    <input
                      type={f.type}
                      value={data[f.key as keyof BriefData] as string}
                      onChange={(e) => set(f.key as keyof BriefData, e.target.value as never)}
                      placeholder={f.placeholder}
                      className="w-full text-sm focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 11:
        return (
          <div>
            <QuestionTitle>Avez-vous des photos de votre activité&nbsp;?</QuestionTitle>
            <div className="grid grid-cols-1 gap-3 mt-2">
              <button
                type="button"
                onClick={() => { set("hasPhotos", true); setTimeout(next, 200); }}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${data.hasPhotos === true ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <span className="text-3xl block mb-3">📷</span>
                <p className="font-bold text-gray-900">Oui, je les enverrai</p>
                <p className="text-sm text-gray-500 mt-1">Je fournirai des photos de mon activité</p>
              </button>
              <button
                type="button"
                onClick={() => { set("hasPhotos", false); setTimeout(next, 200); }}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${data.hasPhotos === false ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <span className="text-3xl block mb-3">📸</span>
                <p className="font-bold text-gray-900">Non, utilisez des images stock</p>
                <p className="text-sm text-gray-500 mt-1">done. choisira des images professionnelles adaptées</p>
              </button>
            </div>
          </div>
        );

      case 12:
        return (
          <div>
            <QuestionTitle>Choisissez votre module mensuel</QuestionTitle>
            <p className="text-sm text-gray-400 mb-5">Hébergement, maintenance et suivi — résiliable à tout moment</p>
            <div className="space-y-3">
              {modules.map((m) => {
                const sel = data.module === m.id;
                const priceStr = m.price.toFixed(2).replace(".", ",");
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => set("module", m.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      sel
                        ? "border-[var(--accent)] bg-[var(--accent)]/5"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg text-gray-900">{priceStr}€<span className="text-xs font-normal text-gray-400">/mois</span></p>
                        {m.popular && (
                          <span className="text-xs font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">★ Recommandé</span>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {m.features.map((f) => (
                        <li key={f} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-[var(--accent)] mt-0.5">✓</span> {f}
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
          <div>
            <QuestionTitle>Vos coordonnées pour vous recontacter</QuestionTitle>
            <p className="text-sm text-gray-400 mb-5">Devis gratuit, sans engagement — on vous répond sous 24h</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Prénom *</label>
                  <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={data.firstname}
                    onChange={(e) => set("firstname", e.target.value)}
                    placeholder="Prénom"
                    className="w-full text-base border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nom</label>
                  <input
                    type="text"
                    value={data.lastname}
                    onChange={(e) => set("lastname", e.target.value)}
                    placeholder="Nom de famille"
                    className="w-full text-base border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full text-base border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+32 470 00 00 00"
                  className="w-full text-base border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
                />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const optional = [4, 5, 7, 10].includes(step);
  const isLast = step === TOTAL_STEPS;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <ProgressBar step={step} />

      <div className="flex-1 flex flex-col pt-16 pb-28">
        <div className="flex-1 w-full max-w-lg mx-auto px-5 py-8 overflow-y-auto">
          <div className="mb-2">
            <Link href="/" className="font-serif font-bold text-lg text-gray-900 hover:opacity-70 transition-opacity">
              done<span className="text-[var(--accent)]">.</span>
            </Link>
          </div>
          <StepWrapper dir={dir} stepKey={step}>
            <div className="pt-4">
              {renderStep()}
            </div>
          </StepWrapper>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#fafafa]/95 backdrop-blur-sm border-t border-gray-100 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
          )}
          <div className="flex-1 flex flex-col gap-2">
            {isLast ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid() || submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[var(--accent)] text-white font-bold text-base hover:bg-[var(--accent)]/90 disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…</>
                ) : (
                  <>Envoyer mon brief <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                disabled={!isValid() && !optional}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[var(--accent)] text-white font-bold text-base hover:bg-[var(--accent)]/90 disabled:opacity-40 transition-all"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {optional && !isLast && (
              <button
                type="button"
                onClick={next}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
              >
                Passer cette étape →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
