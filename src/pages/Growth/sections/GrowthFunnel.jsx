import { GROWTH_FUNNEL } from '../../../data/growth';

export default function GrowthFunnel() {
  const maxVal = GROWTH_FUNNEL.stages[0].value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ─── EN-TÊTE DU FUNNEL ─── */}
      <div 
        className="card p-16 animate-fade"
        style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
              Entonnoir de Conversion AARRR (Acquisition → Rétention → Revenu)
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
              Mesure des volumes d'utilisateurs et des taux de conversion étape par étape
            </p>
          </div>
          <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 700 }}>
            {GROWTH_FUNNEL.stages.length} Étapes Traquées
          </span>
        </div>

        {/* Barres du Funnel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GROWTH_FUNNEL.stages.map((stage, i) => {
            const width = Math.max(22, (stage.value / maxVal) * 100);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                  <span style={{ fontWeight: 800, color: 'var(--dark)' }}>{stage.name}</span>
                  <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
                    <strong>{stage.value.toLocaleString()}</strong> utilisateurs ({stage.rate}%)
                  </span>
                </div>

                <div 
                  style={{ 
                    height: 22, 
                    background: '#F3F4F6', 
                    borderRadius: 6, 
                    overflow: 'hidden', 
                    position: 'relative' 
                  }}
                >
                  <div 
                    style={{ 
                      width: `${width}%`, 
                      background: stage.color, 
                      height: '100%', 
                      borderRadius: 6,
                      transition: 'width 0.4s ease',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 8
                    }}
                  >
                    <span style={{ fontSize: 10, color: '#FFF', fontWeight: 800 }}>{stage.rate}%</span>
                  </div>
                </div>

                {i < GROWTH_FUNNEL.stages.length - 1 && (
                  <div style={{ fontSize: 11, color: '#E74C3C', fontWeight: 700, paddingLeft: 6 }}>
                    ↓ Décrochage de {(100 - GROWTH_FUNNEL.stages[i + 1].rate).toFixed(0)}% vers l'étape suivante
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── POINTS DE FRICTION DÉTECTÉS ─── */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', marginBottom: 12 }}>
          🔍 Points de Friction Critiques Détectés
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
          {GROWTH_FUNNEL.frictions.map((f, i) => {
            const sevColor = f.severity === 'high' ? '#E74C3C' : f.severity === 'medium' ? '#F39C12' : '#2980B9';
            return (
              <div 
                key={i} 
                className="card p-14" 
                style={{ 
                  background: '#FFFFFF', 
                  borderRadius: 12, 
                  border: '1px solid #E0E0E0', 
                  borderLeft: `4px solid ${sevColor}` 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                    {f.from} → {f.to}
                  </div>
                  <span 
                    className="tag" 
                    style={{ 
                      background: sevColor + '18', 
                      color: sevColor, 
                      border: `1px solid ${sevColor}35`,
                      fontSize: 10, 
                      fontWeight: 700 
                    }}
                  >
                    {f.severity === 'high' ? '🔴 Critique' : f.severity === 'medium' ? '🟡 Moyen' : '🔵 Faible'}
                  </span>
                </div>

                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                  Taux de déperdition : <strong style={{ color: sevColor }}>{f.dropRate}%</strong>
                </div>

                <div style={{ fontSize: 12, lineHeight: 1.5, background: '#F9FAFB', padding: '8px 10px', borderRadius: 8, border: '1px solid #F3F4F6' }}>
                  💡 {f.insight}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── TABLE DE RÉTENTION PAR COHORTE ─── */}
      <div 
        className="card p-16" 
        style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden' }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', marginBottom: 12 }}>
          📊 Rétention par Cohorte Mensuelle (M0 à M+4)
        </h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr style={{ background: '#F8F9FA' }}>
                <th className="py-8 px-12 text-left text-xs font-bold text-muted">Cohorte</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">M0</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">M+1</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">M+2</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">M+3</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">M+4</th>
              </tr>
            </thead>
            <tbody>
              {GROWTH_FUNNEL.cohorts.map((c, i) => (
                <tr key={i} className="border-b" style={{ borderColor: '#F0F0F0' }}>
                  <td className="py-10 px-12 font-bold text-dark text-sm">{c.period}</td>
                  {[c.m0, c.m1, c.m2, c.m3, c.m4].map((val, j) => {
                    const bg = val === null ? 'transparent' : `rgba(39, 174, 96, ${Math.max(0.06, (val / 100) * 0.35)})`;
                    const color = val === null ? '#9CA3AF' : val >= 70 ? '#27AE60' : val >= 50 ? 'var(--dark)' : '#E74C3C';
                    return (
                      <td 
                        key={j} 
                        className="py-10 px-12 text-center text-sm" 
                        style={{ background: bg, color, fontWeight: 700 }}
                      >
                        {val !== null ? `${val}%` : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
