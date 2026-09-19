import { GROWTH_WORKFLOWS } from '../../../data/growth';

export default function GrowthWorkflows() {
  const statusMap = { 
    active: { label: 'Actif', color: '#27AE60' }, 
    paused: { label: 'En pause', color: '#F39C12' }, 
    draft: { label: 'Brouillon', color: '#7F8C8D' } 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── BANDEAU EN-TÊTE AUTOMATISATION ─── */}
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
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
            ⚡ Moteur d'Automatisation des Règles Growth (Triggers & Actions)
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
            Déclencheurs événementiels temps réel pour réactiver les utilisateurs et synchroniser le CRM
          </p>
        </div>

        <button 
          type="button"
          className="btn btn-primary btn-sm"
          style={{ background: '#FF7900', color: '#FFF', fontWeight: 700 }}
        >
          + Nouveau Workflow
        </button>
      </div>

      {/* ─── LISTE DES WORKFLOWS ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {GROWTH_WORKFLOWS.map(wf => {
          const st = statusMap[wf.status] || { label: wf.status, color: '#7F8C8D' };
          return (
            <div 
              key={wf.id} 
              className="card p-16 transition-all"
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E0E0E0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF7900';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,121,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>⚙️</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)' }}>
                    {wf.name}
                  </span>
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
                    ● {st.label}
                  </span>
                </div>

                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                  <strong>{wf.executions}</strong> exécutions {wf.lastRun ? `• Dernière : ${wf.lastRun}` : ''}
                </div>
              </div>

              {/* Visualisation Flux Trigger -> Actions */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  background: '#F9FAFB', 
                  padding: '12px 16px', 
                  borderRadius: 10,
                  border: '1px solid #F3F4F6',
                  flexWrap: 'wrap'
                }}
              >
                {/* Déclencheur */}
                <div style={{ minWidth: 180, flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#FF7900', textTransform: 'uppercase', marginBottom: 4 }}>
                    DÉCLENCHEUR (TRIGGER)
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--dark)' }}>
                    {wf.trigger}
                  </div>
                </div>

                {/* Flèche */}
                <div style={{ fontSize: 20, color: '#D1D5DB' }}>
                  →
                </div>

                {/* Actions séquentielles */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#2980B9', textTransform: 'uppercase', marginBottom: 2 }}>
                    ACTIONS ORCHESTRÉES
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {wf.actions.map((a, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--dark)' }}>
                        <span 
                          style={{ 
                            width: 18, 
                            height: 18, 
                            borderRadius: '50%', 
                            background: '#2980B9', 
                            color: '#FFF', 
                            fontSize: 10, 
                            fontWeight: 800, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {i + 1}
                        </span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
