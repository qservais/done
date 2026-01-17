import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ChevronLeft, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";

type StepData = {
  activity: string;
  zone: string;
  siteType: string;
  pages: string;
  formNeed: string;
  languages: string;
  domain: string;
  emailPro: string;
  timing: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialData: StepData = {
  activity: "",
  zone: "",
  siteType: "",
  pages: "1",
  formNeed: "non",
  languages: "1",
  domain: "non",
  emailPro: "non",
  timing: "flexible",
  budget: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function LeadWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const updateData = (key: keyof StepData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else calculateSummary();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const calculateSummary = () => {
    setStep(7); // Summary step
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-background border border-border rounded-xl p-8 text-center max-w-lg mx-auto shadow-lg">
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Message reçu !</h3>
        <p className="text-muted-foreground mb-8">
          On analyse votre demande et on vous recontacte sous {BRAND.SLA_HOURS}h.
          Surveillez vos emails ({data.email}).
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retour au site
        </Button>
      </div>
    );
  }

  // Summary logic
  let recommendedPackPrice = BRAND.PRICING.PACK_EXPRESS;
  let recommendedPackName = "Landing Express";

  if (data.pages === "2-5" || data.pages === "6+") {
    recommendedPackPrice = BRAND.PRICING.PACK_PREMIUM;
    recommendedPackName = "Multi-page Premium";
  } else if (data.formNeed === "oui" || data.formNeed === "multi") {
    recommendedPackPrice = BRAND.PRICING.PACK_CONTACT;
    recommendedPackName = "Vitrine Contact";
  } else if (data.siteType === "ecommerce") {
     // Custom logic for ecommerce usually higher
     recommendedPackPrice = 749;
     recommendedPackName = "E-commerce Start";
  }

  const subPrice = data.domain === "oui" ? BRAND.PRICING.SUB_LIGHT : BRAND.PRICING.SUB_FULL;

  if (step === 7) {
    return (
      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-xl max-w-2xl mx-auto">
        <div className="bg-primary p-6 text-primary-foreground">
          <h3 className="text-2xl font-serif font-bold">Récapitulatif de votre projet</h3>
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
               <span className="text-xs text-muted-foreground uppercase tracking-wider">Type de site</span>
               <p className="font-medium">{data.siteType === "landing" ? "Landing Page (1 page)" : data.siteType === "vitrine" ? "Site Vitrine" : "Autre"}</p>
             </div>
             <div className="space-y-1">
               <span className="text-xs text-muted-foreground uppercase tracking-wider">Pages estimées</span>
               <p className="font-medium">{data.pages}</p>
             </div>
           </div>

           <div className="border-t border-border pt-6">
             <h4 className="font-bold mb-4">Estimation budgétaire</h4>
             <div className="flex justify-between items-center mb-2 p-3 bg-secondary/50 rounded-lg">
               <span>Pack recommandé : <strong>{recommendedPackName}</strong></span>
               <span className="font-bold">{recommendedPackPrice}€</span>
             </div>
             <div className="flex justify-between items-center mb-2 p-3 bg-secondary/50 rounded-lg">
               <span>Abonnement mensuel :</span>
               <span className="font-bold">{subPrice}€/mois</span>
             </div>
             <p className="text-xs text-muted-foreground mt-4">
               *Estimation non contractuelle. Le devis final peut varier selon les options spécifiques.
             </p>
           </div>

           <div className="flex gap-4 pt-4">
             <Button variant="outline" onClick={() => setStep(6)}>Modifier</Button>
             <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={submitForm} disabled={isSubmitting}>
               {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
               Valider ma demande
             </Button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-background border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
      {/* Progress Bar */}
      <div className="h-2 bg-secondary w-full">
        <div className="h-full bg-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex-1">
           {/* Step 1: Activity */}
           {step === 1 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <h3 className="text-2xl font-bold font-serif">Parlons de vous.</h3>
               <div className="space-y-4">
                 <label className="block">
                   <span className="text-sm font-medium mb-1.5 block">Votre secteur d'activité</span>
                   <input 
                      type="text" 
                      className="w-full p-3 rounded-md border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                      placeholder="Ex: Architecte, Coach, Restaurant..."
                      value={data.activity}
                      onChange={(e) => updateData("activity", e.target.value)}
                   />
                 </label>
                 <label className="block">
                   <span className="text-sm font-medium mb-1.5 block">Zone géographique</span>
                   <select 
                      className="w-full p-3 rounded-md border border-input bg-transparent focus:ring-1 focus:ring-accent outline-none"
                      value={data.zone}
                      onChange={(e) => updateData("zone", e.target.value)}
                   >
                     <option value="">Choisir...</option>
                     <option value="Bruxelles">Bruxelles</option>
                     <option value="Wallonie">Wallonie</option>
                     <option value="Flandre">Flandre</option>
                     <option value="France">France</option>
                     <option value="Luxembourg">Luxembourg</option>
                   </select>
                 </label>
               </div>
             </motion.div>
           )}

           {/* Step 2: Need */}
           {step === 2 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <h3 className="text-2xl font-bold font-serif">Votre besoin.</h3>
               <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => updateData("siteType", "landing")}
                      className={cn("p-4 border rounded-lg text-left hover:border-accent transition-colors", data.siteType === "landing" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-input")}
                    >
                      <span className="font-bold block">One Page</span>
                      <span className="text-xs text-muted-foreground">Tout sur 1 page</span>
                    </button>
                    <button 
                      onClick={() => updateData("siteType", "vitrine")}
                      className={cn("p-4 border rounded-lg text-left hover:border-accent transition-colors", data.siteType === "vitrine" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-input")}
                    >
                      <span className="font-bold block">Vitrine</span>
                      <span className="text-xs text-muted-foreground">Plusieurs pages</span>
                    </button>
                 </div>

                 <label className="block">
                   <span className="text-sm font-medium mb-1.5 block">Nombre de pages estimé</span>
                   <div className="flex gap-2">
                     {["1", "2-5", "6+"].map((opt) => (
                       <button
                         key={opt}
                         onClick={() => updateData("pages", opt)}
                         className={cn("flex-1 p-2 border rounded-md text-sm", data.pages === opt ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-secondary")}
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                 </label>
               </div>
             </motion.div>
           )}

           {/* Step 3: Languages */}
           {step === 3 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <h3 className="text-2xl font-bold font-serif">Langues.</h3>
               <div className="space-y-4">
                 <label className="block">
                   <span className="text-sm font-medium mb-1.5 block">Combien de langues ?</span>
                   <div className="grid grid-cols-2 gap-3">
                     <button
                       onClick={() => updateData("languages", "1")}
                       className={cn("p-4 border rounded-lg text-center", data.languages === "1" ? "border-accent bg-accent/5" : "border-input")}
                     >
                       1 (FR par défaut)
                     </button>
                     <button
                       onClick={() => updateData("languages", "2")}
                       className={cn("p-4 border rounded-lg text-center", data.languages === "2" ? "border-accent bg-accent/5" : "border-input")}
                     >
                       2 (FR + EN/NL)
                     </button>
                   </div>
                   <p className="text-xs text-muted-foreground mt-2">Max 2 langues incluses. Plus sur devis.</p>
                 </label>
               </div>
             </motion.div>
           )}

           {/* Step 4: Domain */}
           {step === 4 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <h3 className="text-2xl font-bold font-serif">Technique.</h3>
               <div className="space-y-6">
                 <label className="block">
                   <span className="text-sm font-medium mb-2 block">Avez-vous déjà un nom de domaine ?</span>
                   <div className="flex gap-4">
                     <button
                       onClick={() => updateData("domain", "oui")}
                       className={cn("flex-1 p-3 border rounded-md", data.domain === "oui" ? "bg-primary text-primary-foreground" : "")}
                     >Oui</button>
                     <button
                       onClick={() => updateData("domain", "non")}
                       className={cn("flex-1 p-3 border rounded-md", data.domain === "non" ? "bg-primary text-primary-foreground" : "")}
                     >Non</button>
                   </div>
                 </label>
                 
                 <label className="block">
                   <span className="text-sm font-medium mb-2 block">Besoin d'une adresse email pro ?</span>
                   <div className="flex gap-4">
                     <button
                       onClick={() => updateData("emailPro", "oui")}
                       className={cn("flex-1 p-3 border rounded-md", data.emailPro === "oui" ? "bg-primary text-primary-foreground" : "")}
                     >Oui</button>
                     <button
                       onClick={() => updateData("emailPro", "non")}
                       className={cn("flex-1 p-3 border rounded-md", data.emailPro === "non" ? "bg-primary text-primary-foreground" : "")}
                     >Non</button>
                   </div>
                 </label>
               </div>
             </motion.div>
           )}

            {/* Step 5: Timing */}
           {step === 5 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <h3 className="text-2xl font-bold font-serif">Timing.</h3>
               <div className="space-y-4">
                 {["Urgent (24-48h)", "Normal (1 semaine)", "Flexible"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateData("timing", opt)}
                      className={cn("w-full p-3 border rounded-md text-left hover:border-accent transition-colors", data.timing === opt ? "border-accent bg-accent/5" : "border-input")}
                    >
                      {opt}
                    </button>
                 ))}
               </div>
             </motion.div>
           )}

           {/* Step 6: Contact Info */}
           {step === 6 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
               <h3 className="text-2xl font-bold font-serif">Dernière étape.</h3>
               <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nom complet" 
                    className="col-span-2 p-3 rounded-md border border-input bg-transparent"
                    value={data.name}
                    onChange={(e) => updateData("name", e.target.value)}
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="col-span-2 p-3 rounded-md border border-input bg-transparent"
                    value={data.email}
                    onChange={(e) => updateData("email", e.target.value)}
                  />
                  <input 
                    type="tel" 
                    placeholder="Téléphone" 
                    className="col-span-2 p-3 rounded-md border border-input bg-transparent"
                    value={data.phone}
                    onChange={(e) => updateData("phone", e.target.value)}
                  />
                  <textarea 
                    placeholder="Un petit mot sur votre projet..." 
                    className="col-span-2 p-3 rounded-md border border-input bg-transparent h-24 resize-none"
                    value={data.message}
                    onChange={(e) => updateData("message", e.target.value)}
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
            disabled={step === 1 && !data.activity} // Basic validation example
          >
            {step === totalSteps ? "Voir mon résumé" : "Continuer"} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
