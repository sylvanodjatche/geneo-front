// src/App.jsx
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import History from './pages/History';
import Admin from './pages/Admin';
import { GENEoLogo } from './components/Logo';
import './index.css';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState('loading'); // 'loading', 'ok', 'error'

  // Vérification de l'état de l'API
  const checkApiHealth = async () => {
    try {
      const response = await fetch('https://sylvanod-geneo-inference.hf.space/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // timeout 5 secondes
      });
      if (response.ok) {
        setApiStatus('ok');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      console.error('API health check failed:', error);
      setApiStatus('error');
    }
  };

  useEffect(() => {
    checkApiHealth(); // premier check immédiat
    const interval = setInterval(checkApiHealth, 30000); // toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/',        label: 'Analyse' },
    { to: '/history', label: 'Historique' },
    { to: '/admin',   label: 'Dashboard' },
    { to: '/about',   label: 'À propos' },
  ];

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Ambient top glow */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, #7c3aed, transparent)',
          zIndex: 100, opacity: scrolled ? 1 : 0, transition: 'opacity 0.4s',
        }} />

        {/* Navbar */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 99,
          background: scrolled ? 'rgba(5,7,15,0.92)' : 'rgba(5,7,15,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(99,130,255,0.18)' : 'transparent'}`,
          transition: 'all 0.4s ease',
          padding: '0 16px',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            display: 'flex', alignItems: 'center',
            height: 64, gap: 16,
          }}>
            {/* Burger button – à gauche, visible uniquement sur mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 8, cursor: 'pointer', color: 'var(--text-primary)',
                fontSize: 20,
              }}
              className="flex md:hidden"
            >
              {menuOpen ? '✕' : '☰'}
            </button>

            {/* Logo */}
            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <GENEoLogo size={28} showText={true} />
            </NavLink>

            {/* Desktop navigation – masquée sur mobile via la classe CSS .desktop-nav */}
            <div className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center', flex: 1 }}>
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right actions : API status (toujours à droite) */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px',
                background: apiStatus === 'ok' ? 'rgba(16,185,129,0.08)' : (apiStatus === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)'),
                border: `1px solid ${apiStatus === 'ok' ? 'rgba(16,185,129,0.2)' : (apiStatus === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)')}`,
                borderRadius: 20
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: apiStatus === 'ok' ? '#10b981' : (apiStatus === 'error' ? '#ef4444' : '#f59e0b'),
                  boxShadow: apiStatus === 'ok' ? '0 0 8px #10b981' : 'none',
                  animation: apiStatus === 'ok' ? 'pulse-glow 2s infinite' : 'none',
                }} />
                <span style={{ fontFamily: 'Space Mono', fontSize: '0.68rem', color: apiStatus === 'ok' ? '#34d399' : (apiStatus === 'error' ? '#fca5a5' : '#fbbf24'), letterSpacing: '0.05em' }}>
                  API
                </span>
              </div>
            </div>
          </div>

          {/* Mobile menu (dropdown) – s’ouvre quand burger est cliqué */}
          {menuOpen && (
            <div style={{
              borderTop: '1px solid var(--border)',
              padding: '16px 0',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ textDecoration: 'none', display: 'block', padding: '10px 16px', borderRadius: 8 }}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Page content */}
        <main style={{ flex: 1, padding: '40px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '20px 24px',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <GENEoLogo size={18} showText={false} />
            <span style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              © 2026 · GENEo · DJATCHE · GOUJOU · TAGNE · Université de Yaoundé I
            </span>
            <span style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              CAFA-6 · ESM-2 + GCN
            </span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;