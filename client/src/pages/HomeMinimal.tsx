export default function HomeMinimal() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: '#fafafa',
      fontFamily: 'Inter, sans-serif',
      padding: '20px'
    }}>
      <header style={{ padding: '20px 0', borderBottom: '1px solid #333' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>done</h1>
      </header>
      
      <main>
        <section style={{ padding: '60px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
            Un site premium qui coûte moins qu'un logo.
          </h2>
          <p style={{ color: '#888', marginBottom: '30px' }}>
            Sites web au rendu haut de gamme, livrés en 72h.
          </p>
          <button style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '999px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Demander mon site
          </button>
        </section>
        
        <section style={{ backgroundColor: '#111', margin: '0 -20px', padding: '40px 20px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Section 2 - Problem</h3>
          <p style={{ color: '#888' }}>Contenu de test pour vérifier le scroll.</p>
        </section>
        
        <section style={{ padding: '40px 0' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Section 3 - Why</h3>
          <p style={{ color: '#888' }}>Contenu de test pour vérifier le scroll.</p>
        </section>
        
        <section style={{ backgroundColor: '#111', margin: '0 -20px', padding: '40px 20px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Section 4 - Packs</h3>
          <p style={{ color: '#888' }}>Contenu de test pour vérifier le scroll.</p>
        </section>
        
        <section style={{ padding: '40px 0' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Section 5 - Contact</h3>
          <p style={{ color: '#888' }}>Contenu de test pour vérifier le scroll.</p>
        </section>
      </main>
      
      <footer style={{ padding: '40px 0', borderTop: '1px solid #333', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>© 2025 done — Test page</p>
      </footer>
    </div>
  );
}
