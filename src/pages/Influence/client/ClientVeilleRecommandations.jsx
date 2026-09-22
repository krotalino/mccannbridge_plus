import React, { useState } from 'react';
import { INITIAL_CLIENT_BENCHMARK } from '../../../data/clientInfluenceData';

export default function ClientVeilleRecommandations({
  recommendations = [],
  onUpdateRecommendationStatus,
  onOpenRecommendationModal
}) {
  const [activeSubTab, setActiveSubTab] = useState('recommendations'); // 'recommendations' | 'benchmark'

  return (
    <div className="space-y-6 animate-fade">
      {/* ─── BANDEAU SUPÉRIEUR DE LA VEILLE & RECOMMANDATIONS ─── */}
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
              <span style={{ fontSize: 20 }}>💡</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                Veille Stratégique, Benchmark & Recommandations Actionnables
              </h3>
              <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                {recommendations.length} Fiches Actionnables (6 points)
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Décisions recommandées (amplifier, répliquer, adapter, arrêter, tester) et benchmark MTN / Wave
            </p>
          </div>

          <div style={{ display: 'flex', borderRadius: 6, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('recommendations')}
              style={{
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                border: 'none',
                background: activeSubTab === 'recommendations' ? '#FF7900' : '#FFF',
                color: activeSubTab === 'recommendations' ? '#FFF' : '#64748B',
                cursor: 'pointer'
              }}
            >
              Recommandations (6 pts)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('benchmark')}
              style={{
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                border: 'none',
                background: activeSubTab === 'benchmark' ? '#FF7900' : '#FFF',
                color: activeSubTab === 'benchmark' ? '#FFF' : '#64748B',
                cursor: 'pointer'
              }}
            >
              Benchmark Concurrents
            </button>
          </div>
        </div>
      </div>

      {/* ─── VUE 1 : FICHES ACTIONNABLES EN 6 POINTS (PAGE 7) ─── */}
      {activeSubTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const decisionColor =
              rec.decisionRecommandee === 'amplifier' ? '#DC2626' :
              rec.decisionRecommandee === 'répliquer' ? '#16A34A' :
              rec.decisionRecommandee === 'tester' ? '#2563EB' :
              rec.decisionRecommandee === 'adapter' ? '#D97706' : '#64748B';

            return (
              <div
                key={rec.id}
                className="card"
                style={{
                  borderRadius: 14,
                  padding: '20px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  marginBottom: 16
                }}
              >
                {/* Ligne En-tête : Titre, Type de Décision, Statut Orange */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 10,
                    paddingBottom: 12,
                    borderBottom: '1px solid #F1F5F9',
                    marginBottom: 14
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: `${decisionColor}15`,
                          color: decisionColor,
                          border: `1px solid ${decisionColor}40`,
                          textTransform: 'uppercase'
                        }}
                      >
                        Décision : {rec.decisionLabel}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                        Date : {rec.date}
                      </span>
                      {rec.budgetEstime && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>
                          • Enveloppe estimée : {rec.budgetEstime}
                        </span>
                      )}
                    </div>

                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                      {rec.title}
                    </h4>
                  </div>

                  {/* Sélecteur de statut Orange direct */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>
                      Statut décision Orange :
                    </span>
                    <select
                      className="form-control"
                      value={rec.statutDecisionOrange}
                      onChange={(e) => onUpdateRecommendationStatus(rec.id, e.target.value)}
                      style={{
                        height: 32,
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '0 8px',
                        borderRadius: 6,
                        color:
                          rec.statutDecisionOrange === 'accepte' ? '#166534' :
                          rec.statutDecisionOrange === 'en_test' ? '#1E40AF' :
                          rec.statutDecisionOrange === 'cloture' ? '#475569' : '#C2410C',
                        background:
                          rec.statutDecisionOrange === 'accepte' ? '#DCFCE7' :
                          rec.statutDecisionOrange === 'en_test' ? '#DBEAFE' :
                          rec.statutDecisionOrange === 'cloture' ? '#F1F5F9' : '#FFEDD5',
                        border: '1px solid #CBD5E1'
                      }}
                    >
                      <option value="a_examiner">À examiner par Orange</option>
                      <option value="accepte">Accepté par Orange</option>
                      <option value="en_test">En cours de test</option>
                      <option value="cloture">Clôturé / Archivé</option>
                    </select>
                  </div>
                </div>

                {/* ─── LES 6 POINTS MÉTHODOLOGIQUES DU CAHIER DES CHARGES (PAGE 7) ─── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Point 1 : Constat */}
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 2 }}>
                      1. Constat Factuel :
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                      {rec.constat}
                    </div>
                  </div>

                  {/* Point 2 : Preuve */}
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 2 }}>
                      2. Preuve Chiffrée :
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                      {rec.preuve}
                    </div>
                  </div>

                  {/* Point 3 : Interprétation */}
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 2 }}>
                      3. Interprétation Stratégique :
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                      {rec.interpretation}
                    </div>
                  </div>

                  {/* Point 4 & 5 : Décision Recommandée & Hypothèse de test */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: 10
                    }}
                  >
                    <div style={{ padding: '10px 12px', borderRadius: 8, background: '#FFF9F5', border: '1px solid #FFE4D0' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#E65100', marginBottom: 2 }}>
                        4. Décision Recommandée (McCann) :
                      </div>
                      <div style={{ fontSize: 12, color: '#334155', fontWeight: 700 }}>
                        {rec.decisionLabel}
                      </div>
                    </div>

                    <div style={{ padding: '10px 12px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#1D4ED8', marginBottom: 2 }}>
                        5. Hypothèse de Test Cadrée :
                      </div>
                      <div style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.4 }}>
                        {rec.hypotheseTest}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bouton pour ouvrir la modale détaillée */}
                <div style={{ marginTop: 14, textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onOpenRecommendationModal(rec)}
                    style={{ fontSize: 11, fontWeight: 700, color: '#FF7900' }}
                  >
                    Consulter la fiche complète & Historique →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── VUE 2 : BENCHMARK CONCURRENTIEL MARCHÉ CAMEROUN ─── */}
      {activeSubTab === 'benchmark' && (
        <div className="space-y-4">
          <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
              Surveillance Concurrentielle : Part de Voix & Stratégies Détectées
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {INITIAL_CLIENT_BENCHMARK.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    borderRadius: 12,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <strong style={{ fontSize: 15, color: 'var(--dark)' }}>{b.competitor}</strong>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 10,
                          background: '#E2E8F0',
                          color: '#1E293B'
                        }}
                      >
                        Part de Voix : {b.estimatedShareOfVoice}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>
                      <strong>Opération observée :</strong> {b.campaignObserved}
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                      👥 {b.influencersMobilized} influenceurs mobilisés • Canaux : {b.mainPlatform}
                    </div>

                    <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.4, marginBottom: 10 }}>
                      {b.analysis}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: '#FFF3E8',
                      border: '1px solid #FFD8BE',
                      fontSize: 11,
                      color: '#9A3412'
                    }}
                  >
                    <strong>Contre-mesure Orange recommandée :</strong>
                    <div style={{ marginTop: 2 }}>{b.orangeCountermeasure}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
