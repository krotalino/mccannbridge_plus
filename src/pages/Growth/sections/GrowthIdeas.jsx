import { useState } from 'react';
import { GROWTH_IDEAS, GROWTH_AARRR_STAGES } from '../../../data/growth';

export default function GrowthIdeas() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  const statusLabels = { submitted: 'Soumise', approved: 'Approuvée', in_test: 'En test', rejected: 'Rejetée' };
  const statusColors = { submitted: 'var(--blue)', approved: 'var(--green)', in_test: 'var(--orange)', rejected: 'var(--red)' };

  let ideas = filter === 'all' ? GROWTH_IDEAS : GROWTH_IDEAS.filter(i => i.stage === filter);
  if (sortBy === 'score') ideas = [...ideas].sort((a, b) => b.scoreICE.total - a.scoreICE.total);
  if (sortBy === 'votes') ideas = [...ideas].sort((a, b) => b.votes - a.votes);
  if (sortBy === 'date') ideas = [...ideas].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="flex justify-between items-center mb-20">
        <div className="flex gap-8 flex-wrap">
          <button className={`btn btn-sm ${filter === 'all' ? 'btn-orange' : 'btn-ghost'}`} onClick={() => setFilter('all')}>Toutes</button>
          {GROWTH_AARRR_STAGES.map(s => (
            <button key={s.id} className={`btn btn-sm ${filter === s.label ? 'btn-orange' : 'btn-ghost'}`} onClick={() => setFilter(s.label)}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
        <select className="form-input" style={{ width: 180 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="score">Trier par Score ICE</option>
          <option value="votes">Trier par Votes</option>
          <option value="date">Trier par Date</option>
        </select>
      </div>

      <div className="grid grid-1">
        {ideas.map(idea => {
          const sc = statusColors[idea.status] || 'var(--muted)';
          return (
            <div key={idea.id} className="card mb-8" style={{ borderLeft: `4px solid ${sc}` }}>
              <div className="flex justify-between items-start">
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-8 mb-4">
                    <span className="text-md font-bold text-dark">{idea.title}</span>
                    <span className="tag" style={{ background: sc + '18', color: sc }}>{statusLabels[idea.status]}</span>
                  </div>
                  <div className="text-xs text-muted">{idea.stage} • {idea.author} • {idea.date}</div>
                </div>
                <div className="flex gap-16 items-center">
                  <div className="text-center">
                    <div className="text-xs text-muted">Score ICE</div>
                    <div className="gh-ice-score">{idea.scoreICE.total}</div>
                  </div>
                  <div className="gh-ice-breakdown">
                    <div className="gh-ice-item"><span className="text-xs text-muted">I</span><span className="text-sm font-bold">{idea.scoreICE.impact}</span></div>
                    <div className="gh-ice-item"><span className="text-xs text-muted">C</span><span className="text-sm font-bold">{idea.scoreICE.confidence}</span></div>
                    <div className="gh-ice-item"><span className="text-xs text-muted">E</span><span className="text-sm font-bold">{idea.scoreICE.ease}</span></div>
                  </div>
                  <div className="text-center" style={{ minWidth: 50 }}>
                    <div className="text-xs text-muted">Votes</div>
                    <div className="text-md font-bold text-orange">👍 {idea.votes}</div>
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
