import { GROWTH_RECOMMENDATIONS } from '../../../data/growth';

export default function GrowthRecommendations({ onExecuteAction }) {
  const typeMap = { 
    action: { label: 'Action Directe', color: '#FF7900', icon: '⚡' }, 
    test: { label: 'Test à Lancer', color: '#2980B9', icon: '🧪' }, 
    investigate: { label: 'Investigation', color: '#8E44AD', icon: '🔍' } 
  };
  const prioMap = { 
    high: { label: 'Priorité Haute', color: '#E74C3C' }, 
    medium: { label: 'Priorité Moyenne', color: '#F39C12' }, 
    low: { label: 'Priorité Basse', color: '#2980B9' } 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── BANDEAU MOTEUR GEMINI GROWTH ─── */}
      <div 
        className="card p-16 animate-fade"
        style={{
          background: 'linear-gradient(135deg, #F5F0FF 0%, #EDE4FF 100%)',
          borderRadius: 12,
          border: '1px solid #D7C4F7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: '#8E44AD',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 2px 8px rgba(142,68,173,0.25)',
              flexShrink: 0
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#6C3483', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Moteur de Recommandations & Optimisations Gemini Growth
            </div>
            <div style={{ fontSize: 12.5, color: '#333', marginTop: 2 }}>
              Analyse heuristique corrélant les drops du funnel AARRR, l'historique des cohortes et le potentiel d'uplift business.
            </div>
          </div>
        </div>

        <span className="tag" style={{ background: '#8E44AD', color: '#FFF', fontWeight: 800, fontSize: 11 }}>
          {GROWTH_RECOMMENDATIONS.length} Pistes Prêtes
        </span>
      </div>

      {/* ─── CARTES DE RECOMMANDATIONS ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {GROWTH_RECOMMENDATIONS.map(rec => {
          const t = typeMap[rec.type] || { label: rec.type, color: '#7F8C8D', icon: '📌' };
          const p = prioMap[rec.priority] || { label: rec.priority, color: '#7F8C8D' };
          return (
            <div 
              key={rec.id} 
              className="card p-16 transition-all" 
              style={{ 
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E0E0E0',
                borderLeft: `4px solid ${t.color}` 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = t.color;
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)' }}>
                      {t.icon} {rec.title}
                    </span>
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
                    <span 
                      className="tag" 
                      style={{ 
                        background: p.color + '18', 
                        color: p.color, 
                        border: `1px solid ${p.color}35`,
                        fontSize: 10.5, 
                        fontWeight: 700 
                      }}
                    >
                      {p.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    Étape du Funnel : <strong style={{ color: '#FF7900' }}>{rec.stage}</strong>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, margin: '6px 0 12px 0' }}>
                {rec.description}
              </p>

              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: '#F9FAFB', 
                  padding: '10px 14px', 
                  borderRadius: 8, 
                  border: '1px solid #F3F4F6',
                  flexWrap: 'wrap',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>Impact Estimé</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#27AE60' }}>{rec.impact}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>Source IA</div>
                    <div style={{ fontSize: 12, color: '#6B7280', fontStyle: 'italic' }}>{rec.source}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ background: '#FF7900', color: '#FFF', fontWeight: 700 }}
                    onClick={() => onExecuteAction && onExecuteAction(rec)}
                  >
                    ✓ Appliquer la Recommandation
                  </button>
                  <button 
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ border: '1px solid #D0D0D0' }}
                  >
                    Planifier en Sprint
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
