import React from 'react';

export const INFLUENCE_PERSPECTIVES = [
  {
    id: 'traffic_ops',
    label: 'Traffic & Opérations',
    subtitle: 'Chef d’orchestre McCann',
    icon: '🚦',
    color: '#FF7900',
    desc: 'Supervision globale de la cadence des contenus d’influence, détection des retards de publication, respect des SLA et charge de coordination.',
    suggestedTab: 'cockpit',
  },
  {
    id: 'demandeur',
    label: 'Demandeur (Orange)',
    subtitle: 'Équipe Marque & Comms',
    icon: '🟠',
    color: '#FF7900',
    desc: 'Validation des contenus soumis par les créateurs, respect des éléments de langage Orange Cameroun, validation des BAT et conformité charte.',
    suggestedTab: 'livrables',
  },
  {
    id: 'talent_manager',
    label: 'Talent Manager & Casting',
    subtitle: 'Relations Créateurs',
    icon: '⭐',
    color: '#2980B9',
    desc: 'Gestion unifiée du vivier d’influenceurs et ambassadeurs, arbitrage des doublons d’annuaire, fiches profils et qualification des créateurs.',
    suggestedTab: 'talents',
  },
  {
    id: 'finance',
    label: 'Finance & Rémunérations',
    subtitle: 'Audit Budgets & EMV',
    icon: '💰',
    color: '#27AE60',
    desc: 'Contrôle des rémunérations et cachets, suivi de la valeur média acquise (Earned Media Value), justificatifs et conformité budgétaire.',
    suggestedTab: 'reporting',
  },
  {
    id: 'veille_concurrentielle',
    label: 'Veille & Stratégie',
    subtitle: 'Intelligence Marché',
    icon: '📡',
    color: '#8E44AD',
    desc: 'Monitoring des activations concurrentes (MTN, Moov, Wave), détection des nouvelles tendances virales TikTok/Reels et signaux faibles télécoms.',
    suggestedTab: 'veille',
  },
];

export default function InfluencePerspectiveBanner({
  currentPerspective,
  onChangePerspective,
  onQuickExport,
  onRefresh,
}) {
  const activeConfig = INFLUENCE_PERSPECTIVES.find(p => p.id === currentPerspective) || INFLUENCE_PERSPECTIVES[0];

  return (
    <div
      className="card mb-20 animate-fade"
      style={{
        borderRadius: 12,
        padding: '16px 20px',
        border: '1px solid #E0E0E0',
        marginBottom: 20
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)' }}>
            Moteur de Perspectives Métier Influence
          </span>
          <span className="tag tag-blue" style={{ fontSize: 11, fontWeight: 700 }}>
            Perspective Active
          </span>
        </div>

        {/* Quick action buttons depending on perspective */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onRefresh}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
          >
            <span>🔄</span> Actualiser Flux
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onQuickExport}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF7900', color: '#fff' }}
          >
            <span>📥</span> Exporter Fiche {activeConfig.label.split(' ')[0]}
          </button>
        </div>
      </div>

      {/* Perspective Switcher Pills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 8,
          marginBottom: 12
        }}
      >
        {INFLUENCE_PERSPECTIVES.map((p) => {
          const isActive = p.id === currentPerspective;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChangePerspective(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                border: isActive ? `2px solid ${p.color}` : '1px solid #E5E7EB',
                background: isActive ? 'rgba(255, 121, 0, 0.05)' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isActive ? p.color : '#F3F4F6',
                  color: isActive ? '#FFFFFF' : 'var(--dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0
                }}
              >
                {p.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? p.color : 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Perspective Contextual Banner */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: '#FFF8F2',
          borderLeft: `4px solid ${activeConfig.color}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>{activeConfig.icon}</span>
          <div>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>
              Angle Opérationnel : {activeConfig.label} ({activeConfig.subtitle})
            </span>
            <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--muted)' }}>
              {activeConfig.desc}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => onChangePerspective(activeConfig.id)}
          style={{ fontSize: 11, border: '1px solid #FF7900', color: '#FF7900' }}
        >
          Vue suggérée : {activeConfig.suggestedTab.toUpperCase()} →
        </button>
      </div>
    </div>
  );
}
