import { BRAND, LINKS } from "@/config/brand";
import { Link } from "wouter";
import { DoneStamp } from "@/components/DoneStamp";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-serif text-2xl font-bold">{BRAND.STUDIO_NAME}</h3>
            <DoneStamp size="sm" variant="outline" className="border-white/30 text-white/70" />
          </div>
          <p className="text-white/60 max-w-sm mb-6 text-sm leading-relaxed">
            {BRAND.TAGLINE}
          </p>
          <div className="flex gap-4">
            <a 
              href={BRAND.INSTAGRAM_URL} 
              target="_blank" 
              rel="noopener" 
              className="text-white/50 hover:text-white transition-colors text-sm underline-offset-4 hover:underline"
              data-testid="link-footer-instagram"
            >
              Instagram
            </a>
            <a 
              href="#" 
              className="text-white/50 hover:text-white transition-colors text-sm underline-offset-4 hover:underline"
              data-testid="link-footer-linkedin"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Menu</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li>
              <a href="#packs" className="hover:text-white transition-colors underline-offset-4 hover:underline" data-testid="link-footer-packs">
                Offres
              </a>
            </li>
            <li>
              <Link href={LINKS.realizations} className="hover:text-white transition-colors underline-offset-4 hover:underline" data-testid="link-footer-realizations">
                Réalisations
              </Link>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition-colors underline-offset-4 hover:underline" data-testid="link-footer-faq">
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition-colors underline-offset-4 hover:underline" data-testid="link-footer-contact">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Légal</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li>
              <Link href={LINKS.mentions} className="hover:text-white transition-colors underline-offset-4 hover:underline" data-testid="link-footer-mentions">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href={LINKS.privacy} className="hover:text-white transition-colors underline-offset-4 hover:underline" data-testid="link-footer-privacy">
                Vie privée
              </Link>
            </li>
            <li>
              <Link href={LINKS.cookies} className="hover:text-white transition-colors underline-offset-4 hover:underline" data-testid="link-footer-cookies">
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-14 md:mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
        <p>© {new Date().getFullYear()} {BRAND.STUDIO_NAME}. Tous droits réservés.</p>
        <p className="flex items-center gap-2">
          <span>made in</span>
          <span className="text-white/60">Belgique</span>
          <span>🇧🇪</span>
        </p>
      </div>
    </footer>
  );
}
