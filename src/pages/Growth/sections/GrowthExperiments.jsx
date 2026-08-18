import { useState } from 'react';
import { GROWTH_EXPERIMENTS } from '../../../data/growth';

export default function GrowthExperiments() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const statusMap = { running: { label: 'En cours', color: 'var(--orange)' }, paused: { label: 'En pause', color: 'var(--yellow)' }, completed: { label: 'Terminée', color: 'var(--green)' }, stopped: { label: 'Arrêtée', color: 'var(--red)' } };
  const filtered = filter === 'all' ? GROWTH_EXPERIMENTS : GROWTH_EXPERIMENTS.filter(e => e.status === filter);
  const exp = selected ? GROWTH_EXPERIMENTS.find(e => e.id === selected) : null;

  if (exp) {
    const st = statusMap[exp.status] || { label: exp.status, color: 'var(--muted)' };
    return (
      <div>
        <button className="btn btn-ghost btn-sm mb-16" onClick={() => setSelected(null)}>← Retour à la liste</button>
        <div className="flex justify-between items-start mb-16">
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">{exp.name}</h2>
            <div className="text-sm text-muted">{exp.stage} • {exp.owner} • {exp.startDate} → {exp.endDate}</div>
          </div>
          <span className="tag" style={{ background: st.color + '20', color: st.color, fontSize: 12 }}>{st.label}</span>
        </div>
        <div className="card mb-16">
          <h3 className="text-base font-bold text-dark mb-8">Hypothèse</h3>
          <p className="text-sm" style={{ lineHeight: 1.7 }}>{exp.hypothesis}</p>
        </div>
        <div className="grid grid-4 mb-16">
          <div className="card kpi-card"><div className="kpi-label">Métrique</div><div className="text-md font-bold">{exp.metric}</div></div>
          <div className="card kpi-card"><div className="kpi-label">Baseline</div><div className="kpi-value" style={{ fontSize: 22 }}>{exp.baseline}</div></div>
          <div className="card kpi-card"><div className="kpi-label">Actuel</div><div className="kpi-value" style={{ fontSize: 22, color: 'var(--green)' }}>{exp.current}</div></div>
          <div className="card kpi-card"><div className="kpi-label">Significativité</div><div className="kpi-value" style={{ fontSize: 22, color: exp.significance >= 95 ? 'var(--green)' : 'var(--yellow)' }}>{exp.significance}%</div></div>
        </div>
        <div className="card mb-16">
          <h3 className="text-base font-bold text-dark mb-12">Variants</h3>
          <table className="table">
            <thead><tr><th>Variant</th><th className="text-center">Trafic</th><th className="text-center">Visiteurs</th><th className="text-center">Conversion</th></tr></thead>
            <tbody>
              {exp.variants.map((v, i) => (
                <tr key={i}>
                  <td className="font-bold">{v.name}</td>
                  <td className="text-center">{v.traffic}%</td>
                  <td className="text-center">{v.visitors.toLocaleString()}</td>
                  <td className="text-center"><strong style={{ color: i > 0 && v.conversion > exp.variants[0].conversion ? 'var(--green)' : 'inherit' }}>{v.conversion}%</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-2 gap-12 mb-16">
          <div className="card"><h3 className="text-base font-bold text-dark mb-8">Score ICE</h3>
            <div className="flex gap-16">
              <div><div className="text-xs text-muted">Impact</div><div className="text-lg font-bold">{exp.scoreICE.impact}</div></div>
              <div><div className="text-xs text-muted">Confidence</div><div className="text-lg font-bold">{exp.scoreICE.confidence}</div></div>
              <div><div className="text-xs text-muted">Ease</div><div className="text-lg font-bold">{exp.scoreICE.ease}</div></div>
              <div><div className="text-xs text-muted">Total</div><div className="text-lg font-bold text-orange">{exp.scoreICE.total}</div></div>
            </div>
          </div>
          <div className="card"><h3 className="text-base font-bold text-dark mb-8">Tags</h3>
            <div className="flex gap-6 flex-wrap">{exp.tags.map(t => <span key={t} className="tag tag-blue">{t}</span>)}</div>
          </div>
        </div>
        {exp.learning && (
          <div className="card" style={{ borderLeft: '4px solid var(--green)', background: 'rgba(39,174,96,0.04)' }}>
            <h3 className="text-base font-bold text-green mb-8">📚 Apprentissage</h3>
            <p className="text-sm" style={{ lineHeight: 1.7 }}>{exp.learning}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-8 mb-20">
        {['all', 'running', 'paused', 'completed'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-orange' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Toutes' : statusMap[f]?.label}
            {f !== 'all' && <span className="gh-count-badge">{GROWTH_EXPERIMENTS.filter(e => e.status === f).length}</span>}
          </button>
        ))}
      </div>
      <div className="gh-pipeline mb-20">
        {['running', 'paused', 'completed'].map(status => {
          const exps = GROWTH_EXPERIMENTS.filter(e => e.status === status);
          const st = statusMap[status];
          return (
            <div key={status} className="gh-pipeline-col">
              <div className="gh-pipeline-header" style={{ borderBottomColor: st.color }}>
                <span className="status-dot" style={{ background: st.color }}></span>
                <span className="text-sm font-bold">{st.label}</span>
                <span className="text-xs text-muted">({exps.length})</span>
              </div>
              {exps.map(e => (
                <div key={e.id} className="card gh-exp-card" onClick={() => setSelected(e.id)} style={{ cursor: 'pointer' }}>
                  <div className="text-sm font-bold text-dark mb-4">{e.name}</div>
                  <div className="text-xs text-muted mb-8">{e.stage} • {e.owner}</div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs"><span className="text-muted">Sig:</span> <strong style={{ color: e.significance >= 95 ? 'var(--green)' : 'var(--yellow)' }}>{e.significance}%</strong></div>
                    {e.daysLeft > 0 && <div className="text-xs text-muted">{e.daysLeft}j</div>}
                    {e.result && <span className="tag" style={{ fontSize: 9, background: e.result === 'winner' ? 'rgba(39,174,96,0.15)' : 'rgba(243,156,18,0.15)', color: e.result === 'winner' ? 'var(--green)' : 'var(--yellow)' }}>{e.result === 'winner' ? '✓ Gagnant' : '~ Partiel'}</span>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
