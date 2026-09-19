import { useState } from 'react';
import { GROWTH_KNOWLEDGE } from '../../../data/growth';

export default function GrowthKnowledge() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const resultMap = { 
    winner: { label: 'Gagnant', color: '#27AE60', icon: '✅' }, 
    partial: { label: 'Partiel', color: '#F39C12', icon: '⚡' }, 
    loser: { label: 'Non concluant', color: '#E74C3C', icon: '❌' } 
  };
  const stages = [...new Set(GROWTH_KNOWLEDGE.map(k => k.stage))];

  let items = GROWTH_KNOWLEDGE;
  if (stageFilter !== 'all') items = items.filter(k => k.stage === stageFilter);
  if (search) items = items.filter(k => k.title.toLowerCase().includes(search.toLowerCase()) || k.insight.toLowerCase().includes(search.toLowerCase()) || k.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── BARRE DE RECHERCHE & FILTRES (Style Influence) ─── */}
      <div 
        className="card p-14 animate-fade"
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E0E0E0',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <input 
          className="form-input" 
          style={{ flex: '1 1 260px', height: 40, borderRadius: 8, fontSize: 13 }} 
          placeholder="🔍 Rechercher dans les playbooks, apprentissages, tags..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />

        <select 
          className="form-input" 
          style={{ width: 190, height: 40, borderRadius: 8, fontSize: 13 }} 
          value={stageFilter} 
          onChange={e => setStageFilter(e.target.value)}
        >
          <option value="all">Toutes les étapes ({GROWTH_KNOWLEDGE.length})</option>
          {stages.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ─── LISTE DES PLAYBOOKS & LEARNINGS ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(kb => {
          const r = resultMap[kb.result] || { label: kb.result, color: '#7F8C8D', icon: '📌' };
          return (
            <div 
              key={kb.id} 
              className="card p-16 transition-all" 
              style={{ 
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E0E0E0',
                borderLeft: `4px solid ${r.color}` 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = r.color;
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
                      {r.icon} {kb.title}
                    </span>
                    <span 
                      className="tag" 
                      style={{ 
                        background: r.color + '18', 
                        color: r.color, 
                        border: `1px solid ${r.color}35`,
                        fontSize: 10.5, 
                        fontWeight: 700 
                      }}
                    >
                      {r.label}
                    </span>
                    <span className="tag tag-orange" style={{ fontSize: 10.5, fontWeight: 800 }}>
                      {kb.uplift}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    Étape : <strong>{kb.stage}</strong> • Expérience liée : <strong>{kb.experiment}</strong> • Date : {kb.date}
                  </div>
                </div>
              </div>

              {/* Insight */}
              <div style={{ fontSize: 12.5, lineHeight: 1.6, background: '#F9FAFB', padding: '10px 14px', borderRadius: 8, border: '1px solid #F3F4F6', marginBottom: 8 }}>
                <strong style={{ color: 'var(--dark)' }}>💡 Constat & Insight :</strong> {kb.insight}
              </div>

              {/* Décision Produit */}
              <div style={{ fontSize: 12.5, lineHeight: 1.6, background: 'rgba(39,174,96,0.05)', padding: '10px 14px', borderRadius: 8, border: '1px solid #A3E4D7', borderLeft: '3px solid #27AE60', marginBottom: 10 }}>
                <strong style={{ color: '#27AE60' }}>🎯 Règle & Décision Validée :</strong> {kb.decision}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {kb.tags.map(t => (
                  <span key={t} className="tag tag-blue" style={{ fontSize: 10.5 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="card text-center p-24" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              Aucun apprentissage trouvé pour les filtres sélectionnés.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
