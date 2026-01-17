import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/section";
import { Realizations } from "@/components/sections/Realizations";

export default function RealizationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pt-24">
        <Section>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8">Toutes nos réalisations</h1>
            <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
                Des sites vitrines, des landing pages et des projets sur-mesure.
                Voici ce qu'on sait faire.
            </p>
            {/* Reusing the component but in a real app would probably map more items here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Just duplicating content for visual volume in this demo */}
               <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border">
                  <span className="text-muted-foreground">Projet 1</span>
               </div>
               <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border">
                  <span className="text-muted-foreground">Projet 2</span>
               </div>
               <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border">
                  <span className="text-muted-foreground">Projet 3</span>
               </div>
               <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border">
                  <span className="text-muted-foreground">Projet 4</span>
               </div>
               <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border">
                  <span className="text-muted-foreground">Projet 5</span>
               </div>
               <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border">
                  <span className="text-muted-foreground">Projet 6</span>
               </div>
            </div>
        </Section>
        <Realizations />
      </main>
      <Footer />
    </div>
  );
}
