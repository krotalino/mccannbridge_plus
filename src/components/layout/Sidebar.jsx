import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AGENCE_SECTIONS, CLIENT_SECTIONS } from '../../utils/constants';
import { calcScore } from '../../utils/helpers';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAgency } = useAuth();
  const { tickets, calendar, notifications } = useApp();
  const location = useLocation();
  const sections = isAgency ? AGENCE_SECTIONS : CLIENT_SECTIONS;

  const getBadge = (id) => {
    if (id === 'traffic-manager' || id === 'traffic-ia') {
      return tickets.filter(t => t.priority === 'p0_urgent' || t.status === 'backlog' || t.blockage?.isBlocked || calcScore(t) >= 80).length;
    }
    if (id === 'validation') return calendar.filter(c => c.status === 'pending').length;
    return 0;
  };

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-top">
          <div>
            <div className="sidebar-logo">BRIDGE</div>
            <div className="sidebar-subtitle">McCann × Orange Cameroun</div>
          </div>
          {/* Mobile Close Button */}
          <button 
            className="sidebar-mobile-close" 
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>
        <div className="sidebar-cloud-badge">
          <span className="sidebar-cloud-dot"></span>
          <span>Firebase Firestore Connecté</span>
        </div>
      </div>

      <div className="sidebar-nav">
        {sections.map(s => {
          const badge = getBadge(s.id);
          const isActive = location.pathname === s.path || location.pathname.startsWith(s.path + '/');
          return (
            <NavLink 
              key={s.id} 
              to={s.path} 
              onClick={handleNavClick}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{s.icon}</span>
              <span className="label">{s.label}</span>
              {badge > 0 && <span className="sidebar-badge">{badge}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar-notifications">
        <div className="sidebar-notif-title">NOTIFICATIONS</div>
        <div style={{ maxHeight: 160, overflowY: 'auto' }}>
          {notifications.length === 0 && (
            <div className="text-sm text-muted">Aucune notification</div>
          )}
          {notifications.slice(0, 5).map(n => (
            <div key={n.id} className="notif-item" style={{
              color: n.type === 'warning' ? 'var(--yellow)' : n.type === 'success' ? 'var(--green)' : 'rgba(255,255,255,0.7)'
            }}>
              <span className="notif-time">{n.time}</span> {n.text}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="flex items-center gap-12">
          <div className="avatar avatar-md" style={{ background: 'var(--orange)' }}>
            {user?.user?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'BR'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--white)' }}>{user?.user || 'Utilisateur'}</div>
            <div className="text-xs text-muted truncate">{user?.poste || (isAgency ? 'Admin Agence' : 'Client')}</div>
          </div>
        </div>
        <button onClick={logout} className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 10, color: 'var(--white)', borderColor: 'rgba(255,255,255,0.2)' }}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
