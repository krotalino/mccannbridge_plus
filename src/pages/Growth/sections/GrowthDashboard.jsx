import { GROWTH_KPIS, GROWTH_EXPERIMENTS, GROWTH_ALERTS, GROWTH_NEXT_ACTIONS } from '../../../data/growth';

export default function GrowthDashboard({ onNavigate }) {
  const liveExps = GROWTH_EXPERIMENTS.filter(e => e.status === 'running');
  const critAlerts = GROWTH_ALERTS.filter(a => !a.acknowledged && (a.type === 'critical' || a.type === 'warning'));

  return (
    <div>
      {/* AI Briefing Banner */}
      <div className="ai-banner mb-20">
        <strong>🚀 BRIEFING GROWTH — Semaine 20</strong><br />
        {liveExps.length} expériences live • {critAlerts.length} alertes non traitées • LTV/CAC à 4.2x (+0.6) •
        Opportunité : conversion organique +18% cette semaine — investiguer les sources.
      </div>

      {/* KPI Grid */}
      <div className="grid grid-3 mb-20">
        {GROWTH_KPIS.map(kpi => (
          <div key={kpi.id} className="card gh-kpi-card">
            <div className="gh-kpi-icon">{kpi.icon}</div>
            <div className="gh-kpi-body">
              <div className="gh-kpi-label">{kpi.label}</div>
              <div className="gh-kpi-value">{kpi.value}</div>
              <div className={`gh-kpi-trend ${kpi.trendUp ? 'up' : 'down'}`}>
                {kpi.trendUp ? '▲' : '▼'} {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-2 gap-16">
        {/* Live Experiments */}
        <div>
          <h3 className="text-md font-bold text-dark mb-12">🧪 Expériences Live</h3>
          {liveExps.map(exp => {
            const sigColor = exp.significance >= 95 ? 'var(--green)' : exp.significance >= 85 ? 'var(--yellow)' : 'var(--muted)';
            return (
              <div key={exp.id} className="card mb-12" style={{ borderLeft: `4px solid ${sigColor}` }}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-sm font-bold text-dark">{exp.name}</div>
                    <div className="text-xs text-muted">{exp.stage} • {exp.owner} • {exp.daysLeft}j restants</div>
                  </div>
                  <span className="tag tag-orange">{exp.significance}%</span>
                </div>
                <div className="flex gap-12">
                  <div className="text-xs"><span className="text-muted">Baseline:</span> <strong>{exp.baseline}</strong></div>
                  <div className="text-xs"><span className="text-muted">Actuel:</span> <strong style={{ color: 'var(--green)' }}>{exp.current}</strong></div>
                  <div className="text-xs"><span className="text-muted">Cible:</span> <strong>{exp.target}</strong></div>
                </div>
              </div>
            );
          })}
          <button className="btn btn-ghost btn-sm btn-full mt-8" onClick={() => onNavigate('experiments')}>Voir toutes les expériences →</button>
        </div>

        {/* Next Best Actions */}
        <div>
          <h3 className="text-md font-bold text-dark mb-12">⚡ Actions Recommandées</h3>
          {GROWTH_NEXT_ACTIONS.map(act => {
            const uc = act.urgency === 'critical' ? 'var(--red)' : act.urgency === 'high' ? 'var(--orange)' : 'var(--blue)';
            const typeIcon = { decision: '🎯', deploy: '🚀', investigate: '🔍', fix: '🔧', plan: '📋' }[act.type] || '📌';
            return (
              <div key={act.id} className="card mb-8" style={{ borderLeft: `4px solid ${uc}`, padding: '14px 16px' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-dark">{typeIcon} {act.title}</div>
                    <div className="text-xs text-muted">{act.owner} • Échéance: {act.dueDate}</div>
                  </div>
                  <span className="tag" style={{ background: uc + '18', color: uc, fontSize: 10 }}>
                    {act.urgency.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Alerts */}
      {critAlerts.length > 0 && (
        <div className="mt-20">
          <h3 className="text-md font-bold text-dark mb-12">🔔 Alertes Non Traitées</h3>
          {critAlerts.map(alert => (
            <div key={alert.id} className={`alert ${alert.type === 'critical' ? 'alert-red' : 'alert-yellow'} mb-8`}>
              <strong>{alert.type === 'critical' ? '🚨' : '⚠️'} {alert.title}</strong>
              <div className="text-sm mt-4">{alert.message}</div>
              <div className="text-xs text-muted mt-4">{alert.timestamp}</div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm mt-8" onClick={() => onNavigate('alerts')}>Toutes les alertes →</button>
        </div>
      )}
    </div>
  );
}
