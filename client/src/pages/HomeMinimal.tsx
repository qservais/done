import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";

export default function HomeMinimal() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main>
        <Hero />
        
        <section style={{ backgroundColor: '#111', padding: '40px 20px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Section 2 - Problem</h3>
          <p style={{ color: '#888' }}>Contenu de test pour vérifier le scroll.</p>
        </section>
        
        <section style={{ padding: '40px 20px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Section 3 - Why</h3>
          <p style={{ color: '#888' }}>Contenu de test pour vérifier le scroll.</p>
        </section>
      </main>
      
      <footer style={{ padding: '40px 20px', borderTop: '1px solid #333', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>© 2025 done — Test page</p>
      </footer>
    </div>
  );
}
