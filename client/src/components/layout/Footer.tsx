import { BRAND, LINKS } from "@/config/brand";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-serif text-2xl font-bold mb-4">{BRAND.STUDIO_NAME}</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            {BRAND.TAGLINE}
          </p>
          <div className="flex gap-4">
            {/* Socials placeholder */}
            <a href={BRAND.INSTAGRAM_URL} target="_blank" rel="noopener" className="text-muted-foreground hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">Menu</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#packs" className="hover:text-white transition-colors">Offres</a></li>
            <li><a href="#realizations" className="hover:text-white transition-colors">Réalisations</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">Légal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href={LINKS.mentions} className="hover:text-white transition-colors">Mentions légales</Link></li>
            <li><Link href={LINKS.privacy} className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
            <li><Link href={LINKS.cookies} className="hover:text-white transition-colors">Cookies</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BRAND.STUDIO_NAME}. Tous droits réservés.
      </div>
    </footer>
  );
}
