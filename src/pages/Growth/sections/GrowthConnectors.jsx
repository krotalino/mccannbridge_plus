import { GROWTH_CONNECTORS } from '../../../data/growth';

export default function GrowthConnectors() {
  const statusMap = { 
    active: { label: 'Connecté', color: '#27AE60', dot: '🟢' }, 
    warning: { label: 'Retard Sync', color: '#F39C12', dot: '🟡' }, 
    error: { label: 'Erreur Flux', color: '#E74C3C', dot: '🔴' }, 
    inactive: { label: 'Inactif', color: '#7F8C8D', dot: '⚪' } 
  };
  const byType = {};
  GROWTH_CONNECTORS.forEach(c => { 
    if (!byType[c.type]) byType[c.type] = []; 
    byType[c.type].push(c); 
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── BANDEAU SYNTHÈSE DES CONNECTEURS ─── */}
      <div 
        className="card p-14 animate-fade"
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E0E0E0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#27AE60' }}>
            ● {GROWTH_CONNECTORS.filter(c => c.status === 'active').length} Actifs
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F39C12' }}>
            ● {GROWTH_CONNECTORS.filter(c => c.status === 'warning').length} En Retard
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#E74C3C' }}>
            ● {GROWTH_CONNECTORS.filter(c => c.status === 'error').length} En Erreur
          </span>
        </div>

        <button 
          type="button"
          className="btn btn-primary btn-sm"
          style={{ background: '#FF7900', color: '#FFF', fontWeight: 700 }}
        >
          + Ajouter un Connecteur API
        </button>
      </div>

      {/* ─── GROUPES DE CONNECTEURS ─── */}
      {Object.entries(byType).map(([type, connectors]) => (
        <div key={type}>
          <h3 style={{ fontSize: 14, fontWeight: 900, color: 'var(--dark)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {type}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
            {connectors.map(c => {
              const st = statusMap[c.status] || statusMap.inactive;
              return (
                <div 
                  key={c.id} 
                  className="card p-16 transition-all" 
                  style={{ 
                    background: '#FFFFFF',
                    borderRadius: 12,
                    border: '1px solid #E0E0E0',
                    borderLeft: `4px solid ${st.color}` 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 26 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--dark)' }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.type}</div>
                      </div>
                    </div>

                    <span 
                      className="tag" 
                      style={{ 
                        background: st.color + '18', 
                        color: st.color, 
                        border: `1px solid ${st.color}35`,
                        fontSize: 10.5, 
                        fontWeight: 700 
                      }}
                    >
                      {st.dot} {st.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, background: '#F9FAFB', padding: '8px 10px', borderRadius: 8, border: '1px solid #F3F4F6' }}>
                    <div><span style={{ color: 'var(--muted)' }}>Dernière sync : </span><strong>{c.lastSync}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>Fraîcheur : </span><strong style={{ color: c.status === 'active' ? '#27AE60' : st.color }}>{c.freshness}</strong></div>
                  </div>

                  {c.status === 'error' && (
                    <button 
                      type="button"
                      className="btn btn-sm mt-8" 
                      style={{ width: '100%', background: '#FDEDEC', color: '#E74C3C', border: '1px solid #FADBD8', fontWeight: 700 }}
                    >
                      🔧 Reconnecter le flux webhook
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
