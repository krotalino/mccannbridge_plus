import { useState } from 'react';
import { GROWTH_IDEAS, GROWTH_AARRR_STAGES } from '../../../data/growth';

export default function GrowthIdeas({ onOpenNewIdea }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [ideasState, setIdeasState] = useState(GROWTH_IDEAS);

  const statusLabels = { submitted: 'Soumise', approved: 'Approuvée', in_test: 'En test', rejected: 'Rejetée' };
  const statusColors = { submitted: '#2980B9', approved: '#27AE60', in_test: '#FF7900', rejected: '#E74C3C' };

  let ideas = filter === 'all' ? ideasState : ideasState.filter(i => i.stage === filter);
  if (sortBy === 'score') ideas = [...ideas].sort((a, b) => b.scoreICE.total - a.scoreICE.total);
  if (sortBy === 'votes') ideas = [...ideas].sort((a, b) => b.votes - a.votes);
  if (sortBy === 'date') ideas = [...ideas].sort((a, b) => b.date.localeCompare(a.date));

  const handleVote = (id) => {
    setIdeasState(prev => prev.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── HEADER & FILTRES (Style Influence) ─── */}
      <div 
        className="card p-14"
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
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setFilter('all')}
            style={{
              background: filter === 'all' ? '#FF7900' : '#F3F4F6',
              color: filter === 'all' ? '#FFF' : 'var(--dark)',
              fontWeight: 700,
              borderRadius: 6,
              padding: '6px 12px'
            }}
          >
            Toutes ({ideasState.length})
          </button>
          {GROWTH_AARRR_STAGES.map(s => {
            const isSel = filter === s.label;
            return (
              <button
                key={s.id}
                type="button"
                className="btn btn-sm"
                onClick={() => setFilter(s.label)}
                style={{
                  background: isSel ? '#FF7900' : '#F3F4F6',
                  color: isSel ? '#FFF' : 'var(--dark)',
                  fontWeight: 600,
                  borderRadius: 6,
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            className="form-input"
            style={{ height: 38, fontSize: 12.5, borderRadius: 8, border: '1px solid #D1D5DB' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="score">Trier par Score ICE</option>
            <option value="votes">Trier par Votes</option>
            <option value="date">Trier par Date</option>
          </select>

          {onOpenNewIdea && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenNewIdea}
              style={{ background: '#FF7900', color: '#FFF', display: 'flex', alignItems: 'center', gap: 6, height: 38 }}
            >
              <span>+</span>
              <span>Proposer une Idée</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── LISTE DES IDÉES ICE (Style Influence) ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ideas.map(idea => {
          const sc = statusColors[idea.status] || '#7F8C8D';
          return (
            <div
              key={idea.id}
              className="card p-16 transition-all"
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E0E0E0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 14
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF7900';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 121, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--dark)' }}>
                    {idea.title}
                  </span>
                  <span
                    className="tag"
                    style={{
                      background: sc + '15',
                      color: sc,
                      border: `1px solid ${sc}35`,
                      fontSize: 10.5,
                      fontWeight: 700
                    }}
                  >
                    {statusLabels[idea.status]}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: '#555', marginBottom: 6, lineHeight: 1.5 }}>
                  {idea.hypothesis}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'var(--muted)', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#FF7900' }}>Étape : {idea.stage}</span>
                  <span>•</span>
                  <span>Auteur : <strong>{idea.author}</strong></span>
                  <span>•</span>
                  <span>Métrique : <strong>{idea.metric}</strong></span>
                  <span>•</span>
                  <span>Date : {idea.date}</span>
                </div>
              </div>

              {/* Score ICE & Votes */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
                {/* Total ICE Score */}
                <div 
                  style={{ 
                    textAlign: 'center', 
                    padding: '8px 14px', 
                    background: '#FFF8F2', 
                    borderRadius: 10, 
                    border: '1px solid #FFE0B2' 
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#E65100', textTransform: 'uppercase' }}>
                    Score ICE
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#FF7900' }}>
                    {idea.scoreICE.total}
                  </div>
                </div>

                {/* Breakdown I - C - E */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ textAlign: 'center', padding: '4px 8px', background: '#F9FAFB', borderRadius: 6, border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>Impact</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--dark)' }}>{idea.scoreICE.impact}</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '4px 8px', background: '#F9FAFB', borderRadius: 6, border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>Conf.</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--dark)' }}>{idea.scoreICE.confidence}</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '4px 8px', background: '#F9FAFB', borderRadius: 6, border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>Facilité</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--dark)' }}>{idea.scoreICE.ease}</div>
                  </div>
                </div>

                {/* Vote Button */}
                <button
                  type="button"
                  onClick={() => handleVote(idea.id)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    minWidth: 54
                  }}
                  title="Voter pour cette idée d'expérimentation"
                >
                  <span style={{ fontSize: 14 }}>👍</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#FF7900' }}>{idea.votes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
