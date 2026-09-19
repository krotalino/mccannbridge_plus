import { useState } from 'react';
import { GROWTH_EXPERIMENTS } from '../../../data/growth';

export default function GrowthExperiments() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const statusMap = { 
    running: { label: 'En cours', color: '#FF7900' }, 
    paused: { label: 'En pause', color: '#F39C12' }, 
    completed: { label: 'Terminée', color: '#27AE60' }, 
    stopped: { label: 'Arrêtée', color: '#E74C3C' } 
  };
  
  const filtered = filter === 'all' ? GROWTH_EXPERIMENTS : GROWTH_EXPERIMENTS.filter(e => e.status === filter);
  const exp = selected ? GROWTH_EXPERIMENTS.find(e => e.id === selected) : null;

  if (exp) {
    const st = statusMap[exp.status] || { label: exp.status, color: '#7F8C8D' };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade">
        <button 
          type="button"
          className="btn btn-ghost btn-sm" 
          onClick={() => setSelected(null)}
          style={{ width: 'fit-content', border: '1px solid #D0D0D0', background: '#FFF' }}
        >
          ← Retour à la liste des expériences
        </button>

        {/* Header Fiche Expérience */}
        <div 
          className="card p-16"
          style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 11.5, background: '#FFF0E5', color: '#FF7900', padding: '2px 6px', borderRadius: 4 }}>
                  {exp.id}
                </span>
                <span className="tag" style={{ background: st.color + '18', color: st.color, border: `1px solid ${st.color}35`, fontSize: 11, fontWeight: 700 }}>
                  ● {st.label}
                </span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
                {exp.name}
              </h2>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                Étape : <strong>{exp.stage}</strong> • Responsable : <strong>{exp.owner}</strong> • Période : {exp.startDate} → {exp.endDate}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Significativité statistique</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: exp.significance >= 95 ? '#27AE60' : '#F39C12' }}>
                {exp.significance}%
              </div>
            </div>
          </div>
        </div>

        {/* Hypothèse */}
        <div 
          className="card p-16"
          style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
            💡 Hypothèse formulée
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#4B5563', margin: 0 }}>
            {exp.hypothesis}
          </p>
        </div>

        {/* 4 KPIs Clés */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div className="card p-14" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Métrique de succès</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>{exp.metric}</div>
          </div>
          <div className="card p-14" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Baseline (Référence)</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--dark)', marginTop: 4 }}>{exp.baseline}</div>
          </div>
          <div className="card p-14" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Résultat Actuel</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#27AE60', marginTop: 4 }}>{exp.current}</div>
          </div>
          <div className="card p-14" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Objectif Cible</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#FF7900', marginTop: 4 }}>{exp.target}</div>
          </div>
        </div>

        {/* Tableau des Variants */}
        <div 
          className="card p-16"
          style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden' }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', marginBottom: 12 }}>
            📊 Comparatif des Variants Testés
          </h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr style={{ background: '#F8F9FA' }}>
                  <th className="py-8 px-12 text-left text-xs font-bold text-muted">Variant</th>
                  <th className="py-8 px-12 text-center text-xs font-bold text-muted">Split Trafic</th>
                  <th className="py-8 px-12 text-center text-xs font-bold text-muted">Visiteurs Échantillon</th>
                  <th className="py-8 px-12 text-center text-xs font-bold text-muted">Taux de Conversion</th>
                </tr>
              </thead>
              <tbody>
                {exp.variants.map((v, i) => {
                  const isWinning = i > 0 && v.conversion > exp.variants[0].conversion;
                  return (
                    <tr key={i} className="border-b" style={{ borderColor: '#F0F0F0' }}>
                      <td className="py-10 px-12 font-bold text-dark text-sm">
                        {v.name} {i === 0 ? '(Contrôle)' : ''}
                      </td>
                      <td className="py-10 px-12 text-center text-sm">{v.traffic}%</td>
                      <td className="py-10 px-12 text-center text-sm">{v.visitors.toLocaleString()}</td>
                      <td className="py-10 px-12 text-center text-sm">
                        <strong style={{ color: isWinning ? '#27AE60' : 'inherit' }}>
                          {v.conversion}%
                        </strong>
                        {isWinning && (
                          <span className="tag ml-2" style={{ background: 'rgba(39, 174, 96, 0.15)', color: '#27AE60', fontSize: 10 }}>
                            +{(v.conversion - exp.variants[0].conversion).toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Score ICE & Tags */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
          <div className="card p-14" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 8 }}>Score ICE</h4>
            <div style={{ display: 'flex', gap: 16 }}>
              <div><div style={{ fontSize: 10, color: 'var(--muted)' }}>Impact</div><div style={{ fontSize: 16, fontWeight: 800 }}>{exp.scoreICE.impact}</div></div>
              <div><div style={{ fontSize: 10, color: 'var(--muted)' }}>Confiance</div><div style={{ fontSize: 16, fontWeight: 800 }}>{exp.scoreICE.confidence}</div></div>
              <div><div style={{ fontSize: 10, color: 'var(--muted)' }}>Facilité</div><div style={{ fontSize: 16, fontWeight: 800 }}>{exp.scoreICE.ease}</div></div>
              <div><div style={{ fontSize: 10, color: '#E65100', fontWeight: 700 }}>Total</div><div style={{ fontSize: 18, fontWeight: 900, color: '#FF7900' }}>{exp.scoreICE.total}</div></div>
            </div>
          </div>

          <div className="card p-14" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 8 }}>Tags & Canaux</h4>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {exp.tags.map(t => (
                <span key={t} className="tag tag-blue" style={{ fontSize: 11 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Apprentissage */}
        {exp.learning && (
          <div 
            className="card p-16" 
            style={{ 
              background: 'rgba(39, 174, 96, 0.05)', 
              borderRadius: 12, 
              border: '1px solid #A3E4D7', 
              borderLeft: '4px solid #27AE60' 
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#27AE60', marginBottom: 6 }}>
              📚 Apprentissage & Décision Produit
            </h4>
            <p style={{ fontSize: 13, color: 'var(--dark)', lineHeight: 1.6, margin: 0 }}>
              {exp.learning}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── FILTRES PIPELINE (Style Influence) ─── */}
      <div 
        className="card p-12"
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E0E0E0',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {['all', 'running', 'paused', 'completed'].map(f => {
          const isSel = filter === f;
          const count = f === 'all' ? GROWTH_EXPERIMENTS.length : GROWTH_EXPERIMENTS.filter(e => e.status === f).length;
          return (
            <button
              key={f}
              type="button"
              className="btn btn-sm"
              onClick={() => setFilter(f)}
              style={{
                background: isSel ? '#FF7900' : '#F3F4F6',
                color: isSel ? '#FFFFFF' : 'var(--dark)',
                fontWeight: 700,
                borderRadius: 6,
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>{f === 'all' ? 'Toutes' : statusMap[f]?.label}</span>
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 10,
                  background: isSel ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                  color: isSel ? '#FFF' : 'var(--dark)'
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── PIPELINE KANBAN (Style Influence) ─── */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16
        }}
      >
        {['running', 'paused', 'completed'].map(status => {
          const exps = GROWTH_EXPERIMENTS.filter(e => e.status === status);
          const st = statusMap[status];
          return (
            <div
              key={status}
              style={{
                background: '#F9FAFB',
                borderRadius: 12,
                border: '1px solid #E5E7EB',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              {/* Entête colonne */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  paddingBottom: 8, 
                  borderBottom: `2px solid ${st.color}` 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: st.color }}></span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--dark)' }}>{st.label}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>({exps.length})</span>
              </div>

              {/* Cartes d'expériences */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {exps.map(e => (
                  <div
                    key={e.id}
                    onClick={() => setSelected(e.id)}
                    className="card p-12 transition-all"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 10,
                      border: '1px solid #E0E0E0',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FF7900';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 121, 0, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E0E0E0';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 4, lineHeight: 1.3 }}>
                      {e.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                      {e.stage} • Resp: <strong>{e.owner}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #F3F4F6' }}>
                      <div style={{ fontSize: 11 }}>
                        <span style={{ color: 'var(--muted)' }}>Sig : </span>
                        <strong style={{ color: e.significance >= 95 ? '#27AE60' : '#F39C12' }}>
                          {e.significance}%
                        </strong>
                      </div>

                      {e.daysLeft > 0 && (
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                          ⏳ {e.daysLeft}j
                        </div>
                      )}

                      {e.result && (
                        <span 
                          className="tag" 
                          style={{ 
                            fontSize: 10, 
                            fontWeight: 700,
                            background: e.result === 'winner' ? 'rgba(39, 174, 96, 0.15)' : 'rgba(243, 156, 18, 0.15)', 
                            color: e.result === 'winner' ? '#27AE60' : '#F39C12' 
                          }}
                        >
                          {e.result === 'winner' ? '✓ Gagnant' : '~ Partiel'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
