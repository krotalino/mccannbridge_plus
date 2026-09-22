import React, { useState } from 'react';
import {
  BUDGET_VS_REEL_POSTES,
  MONTHLY_CONSUMPTION_DATA,
  CAMPAIGN_FINANCE_CARDS,
} from '../../../data/clientFinanceData';

export default function ClientBudgetPerformance({
  formatMoney,
  onOpenCampaignModal,
  onOpenReallocationSimulator,
}) {
  const [subTab, setSubTab] = useState('tableau_postes'); // 'tableau_postes' | 'performance_media' | 'fiches_campagnes'
  const [selectedPosteFilter, setSelectedPosteFilter] = useState('all');

  const filteredPostes = BUDGET_VS_REEL_POSTES.filter((p) => {
    if (selectedPosteFilter === 'all') return true;
    return p.categorie === selectedPosteFilter;
  });

  return (
    <div className="space-y-20 animate-fade">
      {/* ─── SOUS-NAVIGATION BUDGET & PERFORMANCE ─── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'tableau_postes', label: '📊 Tableau Budget vs Réel par Poste', count: '6 postes' },
            { id: 'performance_media', label: '🎯 Vue Performance & Arbitrage ROAS', count: 'Temps réel' },
            { id: 'fiches_campagnes', label: '📁 Fiches Budgétaires par Campagne', count: '4 campagnes' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
                border: subTab === tab.id ? '2px solid #FF7900' : '1px solid #CBD5E1',
                background: subTab === tab.id ? '#FFF8F2' : '#FFFFFF',
                color: subTab === tab.id ? '#D35400' : 'var(--dark)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 10,
                  background: subTab === tab.id ? '#FF7900' : '#E2E8F0',
                  color: subTab === tab.id ? '#FFFFFF' : '#475569',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenReallocationSimulator}
          className="btn btn-sm"
          style={{
            background: '#FF7900',
            color: '#FFFFFF',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            borderRadius: 8,
            border: 'none',
            padding: '7px 12px',
            cursor: 'pointer',
          }}
        >
          <span>⚖️</span> Arbitrer Réallocation Média
        </button>
      </div>

      {/* ─── CONTENU 1 : TABLEAU BUDGET VS RÉEL PAR POSTE ─── */}
      {subTab === 'tableau_postes' && (
        <div className="space-y-16">
          {/* Histogramme Visuel Comparatif : Budget vs Engagé vs Réalisé vs Prévision */}
          <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
                  HISTOGRAMME COMPARATIF : BUDGET APPROUVÉ VS ENGAGÉ VS RÉALISÉ VS PRÉVISION
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--muted)' }}>
                  Suivi par poste de dépenses — Seuil d’alerte contractuel à 80% de consommation
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#1E293B' }} />
                  Budget Approuvé
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#2563EB' }} />
                  Engagé (BC/Devis)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#D97706' }} />
                  Réalisé (Consommé)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#10B981' }} />
                  Prévision Fin Période
                </span>
              </div>
            </div>

            {/* Barres d'Histogramme par poste */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {BUDGET_VS_REEL_POSTES.map((poste) => {
                const maxVal = 200000000;
                const pctAlloue = (poste.budgetApprouve / maxVal) * 100;
                const pctEngage = (poste.engagement / maxVal) * 100;
                const pctRealise = (poste.realise / maxVal) * 100;
                const pctPrevision = (poste.prevision / maxVal) * 100;
                const pctConso = Math.round((poste.realise / poste.budgetApprouve) * 100);

                return (
                  <div key={poste.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                      <span style={{ fontWeight: 800, color: 'var(--dark)' }}>
                        {poste.poste}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: 6,
                            background: pctConso >= 80 ? '#FEE2E2' : '#E8F5E9',
                            color: pctConso >= 80 ? '#991B1B' : '#2E7D32',
                          }}
                        >
                          {pctConso}% consommé
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                          Dispo: <strong>{formatMoney(poste.resteDisponible)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Lignes superposées */}
                    <div style={{ width: '100%', height: 14, background: '#F1F5F9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                      {/* Budget */}
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pctAlloue}%`, background: '#CBD5E1', opacity: 0.6 }} />
                      {/* Engagé */}
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pctEngage}%`, background: '#93C5FD' }} />
                      {/* Réalisé */}
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pctRealise}%`, background: pctConso >= 80 ? '#EF4444' : '#F59E0B' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tableau Détaillé par Poste */}
          <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
                TABLEAU EXÉCUTIF BUDGET VS RÉEL
              </h3>

              {/* Filtre par poste */}
              <div style={{ display: 'flex', gap: 6 }}>
                {['all', 'media', 'influence', 'production', 'terrain'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedPosteFilter(f)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      border: 'none',
                      background: selectedPosteFilter === f ? '#FF7900' : '#F1F5F9',
                      color: selectedPosteFilter === f ? '#FFFFFF' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {f === 'all' ? 'Tous les postes' : f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: 'var(--muted)', fontSize: 11 }}>
                    <th style={{ padding: '10px 12px' }}>POSTE DE DÉPENSE</th>
                    <th style={{ padding: '10px 12px' }}>BUDGET APPROUVÉ</th>
                    <th style={{ padding: '10px 12px' }}>ENGAGEMENT (BC)</th>
                    <th style={{ padding: '10px 12px' }}>RÉALISÉ (CONSOMMÉ)</th>
                    <th style={{ padding: '10px 12px' }}>RESTE DISPONIBLE</th>
                    <th style={{ padding: '10px 12px' }}>ÉCART (%)</th>
                    <th style={{ padding: '10px 12px' }}>STATUT CONTRAT</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPostes.map((p) => {
                    const isSeuilCritique = p.statutColor === 'orange' || p.statutColor === 'red';
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px', fontWeight: 800, color: 'var(--dark)' }}>
                          <div>{p.poste}</div>
                          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>
                            Rattaché à : {p.campagneRef}
                          </div>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#1E293B' }}>
                          {formatMoney(p.budgetApprouve)}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#2563EB' }}>
                          {formatMoney(p.engagement)}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 800, color: '#D97706' }}>
                          {formatMoney(p.realise)}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 800, color: '#059669' }}>
                          {formatMoney(p.resteDisponible)}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              fontWeight: 800,
                              color: p.ecartPct > 0 ? '#DC2626' : '#059669',
                            }}
                          >
                            {p.ecartPct > 0 ? `+${p.ecartPct}%` : `${p.ecartPct}%`}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 10,
                              background: isSeuilCritique ? '#FEF3C7' : '#E8F5E9',
                              color: isSeuilCritique ? '#B45309' : '#15803D',
                              border: isSeuilCritique ? '1px solid #FDE68A' : '1px solid #C8E6C9',
                            }}
                          >
                            {p.statut}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={onOpenReallocationSimulator}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              background: '#FFF0E5',
                              color: '#D35400',
                              border: '1px solid #FFD0B0',
                              cursor: 'pointer',
                            }}
                          >
                            Arbitrer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Courbe Temporelle de Consommation Budgétaire */}
          <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
                ÉVOLUTION MENSUELLE DE LA CONSOMMATION (JANVIER - SEPTEMBRE 2026)
              </h3>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                Rythme d'exécution conforme aux jalons marketing
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8 }}>
              {MONTHLY_CONSUMPTION_DATA.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#F8FAFC',
                    borderRadius: 8,
                    padding: '8px 10px',
                    textAlign: 'center',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--dark)' }}>{m.month}</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: '#D97706', marginTop: 4 }}>
                    {Math.round(m.realise / 1000000)} M
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                    Budget: {Math.round(m.budget / 1000000)} M
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── CONTENU 2 : VUE PERFORMANCE FINANCIÈRE & ARBITRAGE ROAS (Page 3) ─── */}
      {subTab === 'performance_media' && (
        <div className="space-y-16">
          <div
            className="card p-16"
            style={{
              borderRadius: 12,
              border: '1px solid #BEE3F8',
              background: 'linear-gradient(135deg, #EBF8FF 0%, #FFFFFF 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🎯</span>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: '#2B6CB0', margin: 0 }}>
                  ARBITRAGE DE BUDGET MÉDIA SUR DONNÉES DE PERFORMANCE RÉELLES
                </h3>
                <p style={{ margin: '3px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
                  Conformément au cadre OCM, chaque franc CFA investi est mis en regard des impressions certifiées, du coût par acquisition (CPA), du coût par lead (CPL) et du retour sur investissement publicitaire (ROAS).
                </p>
              </div>
            </div>
          </div>

          {/* Grille de cartes de performance financière */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {BUDGET_VS_REEL_POSTES.filter((p) => p.kpisMedia).map((item) => (
              <div
                key={item.id}
                className="card p-16"
                style={{
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>
                      {item.poste}
                    </h4>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: '#E0F2FE',
                        color: '#0369A1',
                      }}
                    >
                      {item.campagneRef}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                    Investissement consommé : <strong style={{ color: '#D97706' }}>{formatMoney(item.realise)}</strong> / {formatMoney(item.budgetApprouve)}
                  </div>

                  {/* Métriques clés */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                    {item.kpisMedia.roas && (
                      <div style={{ background: '#F0FDF4', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#166534', fontWeight: 700 }}>ROAS</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: '#15803D' }}>{item.kpisMedia.roas}</div>
                      </div>
                    )}
                    {item.kpisMedia.cpa && (
                      <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>CPA</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>{item.kpisMedia.cpa}</div>
                      </div>
                    )}
                    {item.kpisMedia.conversions && (
                      <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>Conversions</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#2563EB' }}>{item.kpisMedia.conversions}</div>
                      </div>
                    )}
                    {item.kpisMedia.impressions && (
                      <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>Impressions</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>{item.kpisMedia.impressions}</div>
                      </div>
                    )}
                    {item.kpisMedia.ctr && (
                      <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>CTR Moyen</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>{item.kpisMedia.ctr}</div>
                      </div>
                    )}
                    {item.kpisMedia.cpl && (
                      <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>CPL (Leads)</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>{item.kpisMedia.cpl}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ paddingTop: 10, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    Données vérifiées par certificat de diffusion
                  </span>
                  <button
                    type="button"
                    onClick={onOpenReallocationSimulator}
                    className="btn btn-sm btn-ghost"
                    style={{ color: '#FF7900', fontWeight: 800, padding: '4px 8px' }}
                  >
                    Simuler arbitrage →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── CONTENU 3 : FICHES BUDGET / CAMPAGNE (Cahier des Charges Page 3-4) ─── */}
      {subTab === 'fiches_campagnes' && (
        <div className="space-y-16">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {CAMPAIGN_FINANCE_CARDS.map((cmp) => (
              <div
                key={cmp.id}
                className="card p-16"
                style={{
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#FF7900' }}>{cmp.code}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: '#FFF0E5',
                        color: '#D35400',
                      }}
                    >
                      {cmp.entite}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 900, margin: '0 0 6px 0', color: 'var(--dark)' }}>
                    {cmp.nom}
                  </h3>

                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                    {cmp.objectif}
                  </p>

                  {/* Résumé budgétaire */}
                  <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 10, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: 'var(--muted)' }}>Budget Initial :</span>
                      <strong>{formatMoney(cmp.budgetInitial)}</strong>
                    </div>
                    {cmp.avenantsMontant > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                        <span style={{ color: '#2563EB' }}>Avenants signés :</span>
                        <strong style={{ color: '#2563EB' }}>+{formatMoney(cmp.avenantsMontant)}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, borderTop: '1px solid #E2E8F0', paddingTop: 4 }}>
                      <span>Budget Final Révisé :</span>
                      <span style={{ color: '#1E293B' }}>{formatMoney(cmp.budgetFinal)}</span>
                    </div>
                  </div>

                  {/* Jauge de consommation */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                      <span>Consommé : {formatMoney(cmp.realise)}</span>
                      <span style={{ color: '#D97706' }}>{cmp.statutConsommation}</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${cmp.jaugeScore}%`, height: '100%', background: cmp.jaugeScore > 80 ? '#EF4444' : '#FF7900' }} />
                    </div>
                  </div>

                  {/* Responsables */}
                  <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 12 }}>
                    <div>👨‍💼 <strong>Lead McCann :</strong> {cmp.responsableMcCann}</div>
                    <div>✍️ <strong>Valideur Orange :</strong> {cmp.valideurOrange}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                  <button
                    type="button"
                    onClick={() => onOpenCampaignModal(cmp)}
                    className="btn btn-sm btn-primary"
                    style={{ flex: 1, background: '#FF7900', color: '#FFFFFF', fontWeight: 800 }}
                  >
                    Fiche Complète & Avenants
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
