import React, { useState } from 'react';

export default function ClientReportingAnalyses({ reportingData, onNavigateTab }) {
  const [activeAnalysisView, setActiveAnalysisView] = useState('rankings'); // 'rankings' | 'formats' | 'governance'

  const {
    topTalentsEngagement = [],
    topTalentsReach = [],
    topVideoContents = [],
    formatComparison = [],
    governanceTalents = []
  } = reportingData || {};

  return (
    <div className="space-y-6 animate-fade">
      {/* ─── BANDEAU SUPÉRIEUR DU REPORTING CLIENT ─── */}
      <div
        className="card"
        style={{
          borderRadius: 14,
          padding: '16px 20px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📈</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                Reporting Analytique & Palmarès des Performances
              </h3>
              <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                Données Consolidées Q3 2026
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Analyses multidimensionnelles : campagnes, talents, formats, audiences et recommandations de reconduction
            </p>
          </div>

          {/* Sélecteur de sous-vue */}
          <div style={{ display: 'flex', borderRadius: 6, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setActiveAnalysisView('rankings')}
              style={{
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                border: 'none',
                background: activeAnalysisView === 'rankings' ? '#FF7900' : '#FFF',
                color: activeAnalysisView === 'rankings' ? '#FFF' : '#64748B',
                cursor: 'pointer'
              }}
            >
              Top Performers
            </button>
            <button
              type="button"
              onClick={() => setActiveAnalysisView('formats')}
              style={{
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                border: 'none',
                background: activeAnalysisView === 'formats' ? '#FF7900' : '#FFF',
                color: activeAnalysisView === 'formats' ? '#FFF' : '#64748B',
                cursor: 'pointer'
              }}
            >
              Analyse par Format
            </button>
            <button
              type="button"
              onClick={() => setActiveAnalysisView('governance')}
              style={{
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                border: 'none',
                background: activeAnalysisView === 'governance' ? '#FF7900' : '#FFF',
                color: activeAnalysisView === 'governance' ? '#FFF' : '#64748B',
                cursor: 'pointer'
              }}
            >
              Gouvernance Talents
            </button>
          </div>
        </div>
      </div>

      {/* ─── VUE 1 : PALMARÈS TOP PERFORMERS (PAGE 6) ─── */}
      {activeAnalysisView === 'rankings' && (
        <div className="space-y-6">
          {/* Ligne : Top Engagement & Top Portée */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 20
            }}
          >
            {/* Top 5 Talents par Engagement */}
            <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>🔥</span>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
                  Top 5 Talents par Taux d'Engagement
                </h4>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F1F5F9', textAlign: 'left', color: 'var(--muted)' }}>
                      <th style={{ padding: '8px 4px' }}>Rang</th>
                      <th style={{ padding: '8px' }}>Talent</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Vues</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Tx Eng.</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTalentsEngagement.map((t) => (
                      <tr key={t.rank} style={{ borderBottom: '1px solid #F8FAFC' }}>
                        <td style={{ padding: '10px 4px', fontWeight: 800, color: t.rank === 1 ? '#FF7900' : 'var(--muted)' }}>
                          #{t.rank}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <div style={{ fontWeight: 800, color: 'var(--dark)' }}>{t.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--muted)' }}>{t.pseudo}</div>
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700 }}>
                          {t.views}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 900, color: '#059669' }}>
                          {t.rate}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: '#F1F5F9',
                              color: '#334155'
                            }}
                          >
                            {t.recommendation}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 5 Talents par Portée / Impressions */}
            <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>🌐</span>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
                  Top 5 Talents par Portée / Impressions
                </h4>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F1F5F9', textAlign: 'left', color: 'var(--muted)' }}>
                      <th style={{ padding: '8px 4px' }}>Rang</th>
                      <th style={{ padding: '8px' }}>Talent</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Impressions</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Communauté</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Ratio Coût</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTalentsReach.map((t) => (
                      <tr key={t.rank} style={{ borderBottom: '1px solid #F8FAFC' }}>
                        <td style={{ padding: '10px 4px', fontWeight: 800, color: t.rank === 1 ? '#FF7900' : 'var(--muted)' }}>
                          #{t.rank}
                        </td>
                        <td style={{ padding: '10px 8px', fontWeight: 800, color: 'var(--dark)' }}>
                          {t.name}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, color: '#FF7900' }}>
                          {t.reach}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--muted)' }}>
                          {t.followers}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: '#ECFDF5',
                              color: '#059669'
                            }}
                          >
                            {t.costRatio}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Contenus Vidéo */}
          <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 18 }}>🎬</span>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
                Top Contenus Vidéo & Viralité Organique
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {topVideoContents.map((v) => (
                <div
                  key={v.rank}
                  style={{
                    padding: '14px',
                    borderRadius: 10,
                    background: '#F8FAFC',
                    border: '1px solid #F1F5F9'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span className="tag tag-orange" style={{ fontSize: 9 }}>
                      #{v.rank} • {v.format}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>
                      Rétention : {v.retentionRate}
                    </span>
                  </div>

                  <h5 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                    {v.title}
                  </h5>

                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                    Créateur : <strong>{v.creator}</strong>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      paddingTop: 8,
                      borderTop: '1px solid #E2E8F0',
                      color: '#475569'
                    }}
                  >
                    <span>Vues : <strong>{v.views}</strong></span>
                    <span>Comms : <strong>{v.comments}</strong></span>
                    <span>Partages : <strong>{v.shares}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── VUE 2 : COMPARAISON DES FORMATS ÉDITORIAUX ─── */}
      {activeAnalysisView === 'formats' && (
        <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
            Efficacité Relative des Formats d'Influence
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9', textAlign: 'left', color: 'var(--muted)' }}>
                  <th style={{ padding: '8px' }}>Format Éditorial</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Volumes Publiés</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Vues Moyennes</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Taux d'Engagement</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Sentiment Audience</th>
                </tr>
              </thead>
              <tbody>
                {formatComparison.map((f, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 800, color: 'var(--dark)' }}>
                      {f.format}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 700 }}>
                      {f.count} livrables
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 800, color: '#FF7900' }}>
                      {f.avgViews}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                      {f.avgEngagement}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', color: '#16A34A', fontWeight: 700 }}>
                      {f.sentiment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── VUE 3 : GOUVERNANCE TALENTS (RECONDUIRE / CHALLENGER / REMPLACER) ─── */}
      {activeAnalysisView === 'governance' && (
        <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
                Matrice de Gouvernance & Recommandations d'Arbitrage Talents
              </h4>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                Évaluation continue de la relation de partenariat basée sur les données réelles
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {governanceTalents.map((g, idx) => {
              const isReconduire = g.statusAction === 'reconduire';
              const isChallenger = g.statusAction === 'challenger';

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 10,
                    background: isReconduire ? '#F0FDF4' : isChallenger ? '#FFFBEB' : '#FEF2F2',
                    border: `1px solid ${isReconduire ? '#BBF7D0' : isChallenger ? '#FDE68A' : '#FECACA'}`,
                    flexWrap: 'wrap',
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 14, color: 'var(--dark)' }}>{g.name}</strong>
                      <span className="tag" style={{ fontSize: 10 }}>{g.category}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                      {g.note}
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 800,
                      background: isReconduire ? '#16A34A' : isChallenger ? '#D97706' : '#DC2626',
                      color: '#FFFFFF'
                    }}
                  >
                    {g.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
