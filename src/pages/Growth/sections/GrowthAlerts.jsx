import { useState } from 'react';
import { GROWTH_ALERTS } from '../../../data/growth';

export default function GrowthAlerts() {
  const [filter, setFilter] = useState('all');
  const typeMap = { critical: { label: 'Critique', color: 'var(--red)', icon: '🚨' }, warning: { label: 'Warning', color: 'var(--yellow)', icon: '⚠️' }, opportunity: { label: 'Opportunité', color: 'var(--green)', icon: '💡' }, info: { label: 'Info', color: 'var(--blue)', icon: 'ℹ️' } };
  const filtered = filter === 'all' ? GROWTH_ALERTS : GROWTH_ALERTS.filter(a => a.type === filter);

  return (
    <div>
      <div className="flex gap-8 mb-20 flex-wrap">
        {['all', 'critical', 'warning', 'opportunity', 'info'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-orange' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Toutes' : typeMap[f]?.icon + ' ' + typeMap[f]?.label}
            <span className="gh-count-badge">{f === 'all' ? GROWTH_ALERTS.length : GROWTH_ALERTS.filter(a => a.type === f).length}</span>
          </button>
        ))}
      </div>
      {filtered.map(alert => {
        const t = typeMap[alert.type] || { label: alert.type, color: 'var(--muted)', icon: '📌' };
        return (
          <div key={alert.id} className="card mb-12" style={{ borderLeft: `4px solid ${t.color}`, opacity: alert.acknowledged ? 0.65 : 1 }}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-md font-bold text-dark">{t.icon} {alert.title}</div>
                <div className="text-xs text-muted">{alert.timestamp}</div>
              </div>
              <div className="flex gap-8 items-center">
                {alert.acknowledged && <span className="tag tag-muted">✓ Traitée</span>}
                <span className="tag" style={{ background: t.color + '18', color: t.color }}>{t.label}</span>
              </div>
            </div>
            <p className="text-sm mb-12" style={{ lineHeight: 1.6 }}>{alert.message}</p>
            <div className="flex gap-16 text-xs">
              <div><span className="text-muted">Métrique:</span> <strong>{alert.metric}</strong></div>
              <div><span className="text-muted">Seuil:</span> <strong>{alert.threshold}</strong></div>
              <div><span className="text-muted">Actuel:</span> <strong style={{ color: t.color }}>{alert.current}</strong></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
