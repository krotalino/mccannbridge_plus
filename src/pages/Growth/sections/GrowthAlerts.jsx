import { useState } from 'react';
import { GROWTH_ALERTS } from '../../../data/growth';

export default function GrowthAlerts() {
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState(GROWTH_ALERTS);

  const typeMap = { 
    critical: { label: 'Critique', color: '#E74C3C', icon: '🚨' }, 
    warning: { label: 'Warning', color: '#F39C12', icon: '⚠️' }, 
    opportunity: { label: 'Opportunité', color: '#27AE60', icon: '💡' }, 
    info: { label: 'Info', color: '#2980B9', icon: 'ℹ️' } 
  };
  
  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);

  const handleToggleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: !a.acknowledged } : a));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── FILTRES BAR (Style Influence) ─── */}
      <div 
        className="card p-12 animate-fade"
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E0E0E0',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {['all', 'critical', 'warning', 'opportunity', 'info'].map(f => {
          const isSel = filter === f;
          const count = f === 'all' ? alerts.length : alerts.filter(a => a.type === f).length;
          const cfg = typeMap[f];
          return (
            <button
              key={f}
              type="button"
              className="btn btn-sm"
              onClick={() => setFilter(f)}
              style={{
                background: isSel ? '#FF7900' : '#F3F4F6',
                color: isSel ? '#FFFFFF' : 'var(--dark)',
                fontWeight: 700,
                borderRadius: 6,
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>{f === 'all' ? 'Toutes les alertes' : `${cfg.icon} ${cfg.label}`}</span>
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 10,
                  background: isSel ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                  color: isSel ? '#FFF' : 'var(--dark)'
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── LISTE DES ALERTES (Style Influence) ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(alert => {
          const t = typeMap[alert.type] || { label: alert.type, color: '#7F8C8D', icon: '📌' };
          return (
            <div
              key={alert.id}
              className="card p-16 transition-all"
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E0E0E0',
                borderLeft: `4px solid ${t.color}`,
                opacity: alert.acknowledged ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF7900';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 121, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                    <span style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--dark)' }}>
                      {alert.title}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, paddingLeft: 24 }}>
                    Horodatage : {alert.timestamp}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {alert.acknowledged ? (
                    <span className="tag" style={{ background: '#E8F8F0', color: '#27AE60', fontWeight: 700, fontSize: 10.5 }}>
                      ✓ Traitée
                    </span>
                  ) : (
                    <span className="tag" style={{ background: '#FADBD8', color: '#E74C3C', fontWeight: 700, fontSize: 10.5 }}>
                      Non résolue
                    </span>
                  )}

                  <span 
                    className="tag" 
                    style={{ 
                      background: t.color + '18', 
                      color: t.color, 
                      border: `1px solid ${t.color}35`,
                      fontSize: 10.5, 
                      fontWeight: 700 
                    }}
                  >
                    {t.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleAcknowledge(alert.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, border: '1px solid #E5E7EB', padding: '4px 8px' }}
                  >
                    {alert.acknowledged ? 'Marquer non-traitée' : 'Marquer comme traitée'}
                  </button>
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 1.6, margin: '6px 0 12px 0', paddingLeft: 24 }}>
                {alert.message}
              </p>

              <div 
                style={{ 
                  display: 'flex', 
                  gap: 16, 
                  fontSize: 11.5, 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: 8, 
                  marginLeft: 24, 
                  border: '1px solid #F3F4F6' 
                }}
              >
                <div><span style={{ color: 'var(--muted)' }}>Métrique : </span><strong>{alert.metric}</strong></div>
                <div><span style={{ color: 'var(--muted)' }}>Seuil d'alerte : </span><strong>{alert.threshold}</strong></div>
                <div><span style={{ color: 'var(--muted)' }}>Valeur constatée : </span><strong style={{ color: t.color }}>{alert.current}</strong></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
