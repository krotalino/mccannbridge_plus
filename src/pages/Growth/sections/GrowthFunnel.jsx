import { GROWTH_FUNNEL } from '../../../data/growth';

export default function GrowthFunnel() {
  const maxVal = GROWTH_FUNNEL.stages[0].value;

  return (
    <div>
      {/* Funnel Visualization */}
      <h3 className="text-md font-bold text-dark mb-16">Funnel AARRR — Vue d'ensemble</h3>
      <div className="card mb-20">
        <div className="gh-funnel">
          {GROWTH_FUNNEL.stages.map((stage, i) => {
            const width = Math.max(20, (stage.value / maxVal) * 100);
            return (
              <div key={i} className="gh-funnel-step">
                <div className="gh-funnel-label">
                  <span className="text-sm font-bold text-dark">{stage.name}</span>
                  <span className="text-xs text-muted">{stage.value.toLocaleString()} ({stage.rate}%)</span>
                </div>
                <div className="gh-funnel-bar-track">
                  <div className="gh-funnel-bar" style={{ width: `${width}%`, background: stage.color }}></div>
                </div>
                {i < GROWTH_FUNNEL.stages.length - 1 && (
                  <div className="gh-funnel-drop">
                    ↓ {(100 - GROWTH_FUNNEL.stages[i + 1].rate).toFixed(0)}% drop
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Frictions */}
      <h3 className="text-md font-bold text-dark mb-12">🔍 Points de Friction Détectés</h3>
      <div className="grid grid-1 mb-20">
        {GROWTH_FUNNEL.frictions.map((f, i) => {
          const sevColor = f.severity === 'high' ? 'var(--red)' : f.severity === 'medium' ? 'var(--yellow)' : 'var(--blue)';
          return (
            <div key={i} className="card mb-8" style={{ borderLeft: `4px solid ${sevColor}` }}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-sm font-bold text-dark">{f.from} → {f.to}</div>
                  <div className="text-xs text-muted">Drop rate: {f.dropRate}%</div>
                </div>
                <span className="tag" style={{ background: sevColor + '18', color: sevColor }}>
                  {f.severity === 'high' ? '🔴 Critique' : f.severity === 'medium' ? '🟡 Moyen' : '🔵 Faible'}
                </span>
              </div>
              <div className="text-sm" style={{ lineHeight: 1.6, background: '#f9f9f9', padding: '10px 12px', borderRadius: 6 }}>
                💡 {f.insight}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cohort Table */}
      <h3 className="text-md font-bold text-dark mb-12">📊 Table de Rétention par Cohorte</h3>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Cohorte</th><th className="text-center">M0</th><th className="text-center">M+1</th>
              <th className="text-center">M+2</th><th className="text-center">M+3</th><th className="text-center">M+4</th>
            </tr>
          </thead>
          <tbody>
            {GROWTH_FUNNEL.cohorts.map((c, i) => (
              <tr key={i}>
                <td className="font-bold">{c.period}</td>
                {[c.m0, c.m1, c.m2, c.m3, c.m4].map((val, j) => {
                  const bg = val === null ? 'transparent' : `rgba(39,174,96,${Math.max(0.05, (val / 100) * 0.4)})`;
                  const color = val === null ? 'var(--muted)' : val >= 70 ? 'var(--green)' : val >= 50 ? 'var(--body)' : 'var(--red)';
                  return (
                    <td key={j} className="text-center" style={{ background: bg, color, fontWeight: 600 }}>
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
  );
}
