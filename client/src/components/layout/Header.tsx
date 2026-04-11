import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { BRAND, LINKS } from "@/config/brand";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { label: "Offres", href: "/#packs" },
    { label: "Réalisations", href: "/#realizations" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
          scrolled || isOpen ? "bg-background/80 backdrop-blur-md border-border py-3" : "bg-transparent py-5"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-xl md:text-2xl tracking-tighter hover:opacity-80 transition-opacity">
            {BRAND.STUDIO_NAME}<span className="text-accent">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="h-4 w-px bg-border mx-2" />
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground">
              FR
            </button>
            <Button size="sm" className="rounded-full font-medium bg-accent hover:bg-accent/90" asChild>
              <Link href="/devis">Commencer</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 -mr-2 text-foreground z-50 relative"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden flex flex-col animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <nav className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-serif font-medium hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="h-px w-24 bg-border mx-auto my-4" />
            <div className="flex justify-center gap-4">
              <button className="text-lg font-bold">FR</button>
              <button className="text-lg text-muted-foreground">EN</button>
            </div>
            <Button size="lg" className="w-full mt-8 rounded-full text-lg bg-accent hover:bg-accent/90" onClick={() => setIsOpen(false)} asChild>
              <Link href="/devis">Commencer mon projet</Link>
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
