import { GROWTH_RECOMMENDATIONS } from '../../../data/growth';

export default function GrowthRecommendations() {
  const typeMap = { action: { label: 'Action', color: 'var(--orange)', icon: '⚡' }, test: { label: 'Test à lancer', color: 'var(--blue)', icon: '🧪' }, investigate: { label: 'Investigation', color: 'var(--purple)', icon: '🔍' } };
  const prioMap = { high: { label: 'Haute', color: 'var(--red)' }, medium: { label: 'Moyenne', color: 'var(--yellow)' }, low: { label: 'Basse', color: 'var(--blue)' } };

  return (
    <div>
      <div className="ai-banner mb-20">
        <strong>🤖 Recommandations Intelligentes</strong><br />
        Basées sur l'analyse des métriques, expériences et anomalies détectées. Les recommandations combinent règles métier et détection automatique.
      </div>
      {GROWTH_RECOMMENDATIONS.map(rec => {
        const t = typeMap[rec.type] || { label: rec.type, color: 'var(--muted)', icon: '📌' };
        const p = prioMap[rec.priority] || { label: rec.priority, color: 'var(--muted)' };
        return (
          <div key={rec.id} className="card mb-12 gh-rec-card" style={{ borderLeft: `4px solid ${t.color}` }}>
            <div className="flex justify-between items-start mb-8">
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-8 mb-4">
                  <span className="text-md font-bold text-dark">{t.icon} {rec.title}</span>
                  <span className="tag" style={{ background: t.color + '18', color: t.color }}>{t.label}</span>
                  <span className="tag" style={{ background: p.color + '18', color: p.color }}>{p.label}</span>
                </div>
                <div className="text-xs text-muted mb-8">{rec.stage}</div>
              </div>
            </div>
            <p className="text-sm mb-12" style={{ lineHeight: 1.6 }}>{rec.description}</p>
            <div className="flex gap-16">
              <div className="gh-rec-impact">
                <div className="text-xs text-muted">Impact estimé</div>
                <div className="text-sm font-bold text-green">{rec.impact}</div>
              </div>
              <div className="gh-rec-source">
                <div className="text-xs text-muted">Source</div>
                <div className="text-xs" style={{ fontStyle: 'italic' }}>{rec.source}</div>
              </div>
            </div>
            <div className="flex gap-8 mt-12">
              <button className="btn btn-orange btn-sm">✓ Appliquer</button>
              <button className="btn btn-ghost btn-sm">Planifier</button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--muted)', borderColor: 'var(--muted)' }}>Ignorer</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
