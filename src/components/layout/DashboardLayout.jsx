import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AGENCE_SECTIONS, CLIENT_SECTIONS } from '../../utils/constants';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAgency } = useAuth();
  const { notifications } = useApp();

  const sections = isAgency ? AGENCE_SECTIONS : CLIENT_SECTIONS;
  const currentSection = sections.find(
    s => location.pathname === s.path || location.pathname.startsWith(s.path + '/')
  );

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-layout">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <button 
          className="mobile-hamburger-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Ouvrir le menu de navigation"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="mobile-avatar" style={{ background: 'var(--orange)' }}>
            {user?.user?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'BR'}
          </div>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div 
          className="mobile-backdrop" 
          onClick={() => setMobileOpen(false)} 
          aria-hidden="true"
        />
      )}

      {/* Sidebar with mobile drawer support */}
      <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="main-content">
        <div className="content-area animate-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
