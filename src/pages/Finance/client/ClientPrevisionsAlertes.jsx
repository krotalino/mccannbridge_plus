import React, { useState } from 'react';
import {
  CLIENT_FINANCIAL_ALERTS,
  CLIENT_FORECAST_SCENARIOS,
} from '../../../data/clientFinanceData';

export default function ClientPrevisionsAlertes({
  alerts = CLIENT_FINANCIAL_ALERTS,
  forecastData = CLIENT_FORECAST_SCENARIOS,
  formatMoney,
  onOpenReallocationSimulator,
  onOpenActionModal,
}) {
  const [selectedScenario, setSelectedScenario] = useState('nominal');
  const [alertSeverityFilter, setAlertSeverityFilter] = useState('all');

  const filteredAlerts = alerts.filter((a) => {
    if (alertSeverityFilter === 'all') return true;
    return a.niveau === alertSeverityFilter;
  });

  const activeScenarioObj = forecastData.scenarios.find((s) => s.id === selectedScenario) || forecastData.scenarios[0];

  return (
    <div className="space-y-20 animate-fade">
      {/* ─── 1. CENTRE D'ALERTES PAR SÉVÉRITÉ (Page 7 du Cahier des Charges) ─── */}
      <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
              CENTRE D’ALERTES PAR SÉVÉRITÉ & ACTIONS RECOMMANDÉES
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--muted)' }}>
              Suivi automatisé des seuils budgétaires (80%), des échéances critiques et des opportunités d'arbitrage.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all', label: 'Toutes les alertes' },
              { id: 'critique', label: 'Critiques' },
              { id: 'eleve', label: 'Élevées' },
              { id: 'moyen', label: 'Moyennes' },
              { id: 'information', label: 'Infos' },
            ].map((sev) => (
              <button
                key={sev.id}
                type="button"
                onClick={() => setAlertSeverityFilter(sev.id)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  border: 'none',
                  background: alertSeverityFilter === sev.id ? '#FF7900' : '#F1F5F9',
                  color: alertSeverityFilter === sev.id ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                }}
              >
                {sev.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredAlerts.map((alt) => {
            const isCrit = alt.niveau === 'critique';
            const isEleve = alt.niveau === 'eleve';
            const isMoy = alt.niveau === 'moyen';
            const bgBadge = isCrit ? '#FEE2E2' : isEleve ? '#FFEDD5' : isMoy ? '#FEF9C3' : '#E0F2FE';
            const colorBadge = isCrit ? '#991B1B' : isEleve ? '#9A3412' : isMoy ? '#854D0E' : '#0369A1';

            return (
              <div
                key={alt.id}
                style={{
                  borderRadius: 10,
                  border: '1px solid #E2E8F0',
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                  background: isCrit ? '#FFFDFD' : '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 260 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: bgBadge,
                      color: colorBadge,
                      textTransform: 'uppercase',
                      marginTop: 2,
                    }}
                  >
                    {alt.niveauLabel}
                  </span>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 13, color: 'var(--dark)' }}>{alt.titre}</strong>
                      <span style={{ fontSize: 11, color: '#FF7900', fontWeight: 700 }}>• {alt.campagne}</span>
                    </div>
                    <p style={{ margin: '3px 0 4px 0', fontSize: 12, color: 'var(--muted)' }}>
                      {alt.description}
                    </p>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#2563EB' }}>
                      💡 Action recommandée : {alt.actionProposee}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>{alt.date}</span>
                  {alt.actionId === 'reallocation' ? (
                    <button
                      type="button"
                      onClick={onOpenReallocationSimulator}
                      className="btn btn-xs"
                      style={{ background: '#FF7900', color: '#FFFFFF', fontWeight: 800, border: 'none' }}
                    >
                      ⚖️ Réallouer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenActionModal({ titre: alt.titre, campagne: alt.campagne, description: alt.actionProposee })}
                      className="btn btn-xs"
                      style={{ background: '#F1F5F9', color: '#1E293B', fontWeight: 700, border: '1px solid #CBD5E1' }}
                    >
                      Traiter
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 2. PRÉVISIONS BUDGÉTAIRES & SCÉNARIOS D’ATTERRISSAGE (Page 7) ─── */}
      <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
              PRÉVISIONS BUDGÉTAIRES & SCÉNARIOS D'ATTERRISSAGE Q3/Q4
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--muted)' }}>
              Projections statistiques calculées à partir des engagements signés et de la vélocité des campagnes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {forecastData.scenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedScenario(sc.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  border: selectedScenario === sc.id ? '2px solid #FF7900' : '1px solid #CBD5E1',
                  background: selectedScenario === sc.id ? '#FFF8F2' : '#F8FAFC',
                  color: selectedScenario === sc.id ? '#D35400' : '#475569',
                  cursor: 'pointer',
                }}
              >
                {sc.nom.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Détails du scénario actif */}
        <div
          style={{
            background: '#F8FAFC',
            borderRadius: 10,
            padding: 14,
            border: '1px solid #E2E8F0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>SCÉNARIO SÉLECTIONNÉ</div>
            <strong style={{ fontSize: 14, color: 'var(--dark)' }}>{activeScenarioObj.nom}</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>
              {activeScenarioObj.description}
            </p>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>ATTERRISSAGE ESTIMÉ</div>
            <strong style={{ fontSize: 16, color: '#1E293B' }}>{formatMoney(activeScenarioObj.atterrissageEstime)}</strong>
            <div style={{ fontSize: 11, color: '#D97706', marginTop: 2 }}>
              Taux de consommation : {activeScenarioObj.consommationFinQ3}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>SOLDE DISPONIBLE FINAL</div>
            <strong
              style={{
                fontSize: 16,
                color: activeScenarioObj.soldeFinalPrevu >= 0 ? '#059669' : '#DC2626',
              }}
            >
              {activeScenarioObj.soldeFinalPrevu >= 0 ? '+' : ''}{formatMoney(activeScenarioObj.soldeFinalPrevu)}
            </strong>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              ROAS moyen projeté : <strong>{activeScenarioObj.roasEstime}</strong>
            </div>
          </div>
        </div>

        {/* Recommandation du scénario */}
        <div
          style={{
            background: '#FFF9F5',
            border: '1px solid #FFD0B0',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div>
            <strong>💡 Synthèse & Conseil McCann :</strong> {activeScenarioObj.recommandation}
          </div>
          <button
            type="button"
            onClick={onOpenReallocationSimulator}
            className="btn btn-xs"
            style={{ background: '#FF7900', color: '#FFFFFF', fontWeight: 800, border: 'none' }}
          >
            Ajuster l'arbitrage
          </button>
        </div>
      </div>
    </div>
  );
}
