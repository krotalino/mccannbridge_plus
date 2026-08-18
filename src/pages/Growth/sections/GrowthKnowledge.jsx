import { useState } from 'react';
import { GROWTH_KNOWLEDGE } from '../../../data/growth';

export default function GrowthKnowledge() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const resultMap = { winner: { label: 'Gagnant', color: 'var(--green)', icon: '✅' }, partial: { label: 'Partiel', color: 'var(--yellow)', icon: '⚡' }, loser: { label: 'Perdant', color: 'var(--red)', icon: '❌' } };
  const stages = [...new Set(GROWTH_KNOWLEDGE.map(k => k.stage))];

  let items = GROWTH_KNOWLEDGE;
  if (stageFilter !== 'all') items = items.filter(k => k.stage === stageFilter);
  if (search) items = items.filter(k => k.title.toLowerCase().includes(search.toLowerCase()) || k.insight.toLowerCase().includes(search.toLowerCase()) || k.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div className="flex gap-12 mb-20">
        <input className="form-input" style={{ flex: 1 }} placeholder="🔍 Rechercher dans les apprentissages..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-input" style={{ width: 180 }} value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="all">Toutes les étapes</option>
          {stages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {items.map(kb => {
        const r = resultMap[kb.result] || { label: kb.result, color: 'var(--muted)', icon: '📌' };
        return (
          <div key={kb.id} className="card mb-12" style={{ borderLeft: `4px solid ${r.color}` }}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-8 mb-4">
                  <span className="text-md font-bold text-dark">{r.icon} {kb.title}</span>
                  <span className="tag" style={{ background: r.color + '18', color: r.color }}>{r.label}</span>
                  <span className="tag tag-orange">{kb.uplift}</span>
                </div>
                <div className="text-xs text-muted">{kb.stage} • {kb.experiment} • {kb.date}</div>
              </div>
            </div>
            <div className="text-sm mb-12" style={{ lineHeight: 1.7, background: '#f9f9f9', padding: '12px 14px', borderRadius: 6 }}>
              <strong>Insight:</strong> {kb.insight}
            </div>
            <div className="text-sm mb-12" style={{ lineHeight: 1.7, background: 'rgba(39,174,96,0.04)', padding: '12px 14px', borderRadius: 6, borderLeft: '3px solid var(--green)' }}>
              <strong>Décision:</strong> {kb.decision}
            </div>
            <div className="flex gap-6 flex-wrap">
              {kb.tags.map(t => <span key={t} className="tag tag-blue">{t}</span>)}
            </div>
          </div>
        );
      })}
      {items.length === 0 && <div className="card text-center" style={{ padding: 40 }}><div className="text-muted">Aucun apprentissage trouvé pour cette recherche.</div></div>}
    </div>
  );
}
