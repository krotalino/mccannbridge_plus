import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AGENCE_SECTIONS, CLIENT_SECTIONS } from '../../utils/constants';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAgency, isClient } = useAuth();
  const { notifications } = useApp();

  const isClientRole = isClient || user?.role === 'client' || !isAgency;
  const rawSections = isAgency && !isClientRole ? AGENCE_SECTIONS : CLIENT_SECTIONS;
  const sections = rawSections.filter(s => {
    if (isClientRole) {
      return s.id !== 'dashboard' && s.id !== 'users';
    }
    return true;
  });
  const currentSection = sections.find(
    s => location.pathname === s.path || location.pathname.startsWith(s.path + '/')
  );

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  return (
    <div className={`app-layout ${mobileOpen ? 'drawer-active' : ''}`}>
      {/* Mobile & Tablet Top Header (< 1024px) */}
      <header className="mobile-header" role="banner" aria-label="En-tête de navigation mobile">
        <button 
          className="mobile-hamburger-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
          aria-expanded={mobileOpen}
          aria-controls="appSidebar"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="mobile-header-title">
          <span className="mobile-logo-accent">BRIDGE</span>
          {currentSection && (
            <span className="mobile-current-page">
              <span className="mobile-page-separator">/</span>
              {currentSection.label}
            </span>
          )}
        </div>

        <div className="mobile-header-right">
          <div className="mobile-avatar" style={{ background: 'var(--orange)' }} title={user?.user || 'Utilisateur'}>
            {user?.user?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'BR'}
          </div>
        </div>
      </header>

      {/* Backdrop for mobile & tablet drawer */}
      <div 
        className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)} 
        aria-hidden="true"
      />

      {/* Sidebar with overlay drawer support on < 1024px */}
      <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="main-content" id="mainContent" role="main">
        <div className="content-area animate-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

