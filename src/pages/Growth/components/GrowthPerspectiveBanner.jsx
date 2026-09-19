import React from 'react';

export const GROWTH_PERSPECTIVES = [
  {
    id: 'growth_ops',
    label: 'Growth Engineer & Ops',
    subtitle: 'Exécution McCann',
    icon: '⚡',
    color: '#FF7900',
    desc: 'Supervision des expérimentations A/B actives, cadence de déploiement des tests, intégration des webhooks et tracking des signaux temps réel.',
    suggestedTab: 'experiments',
  },
  {
    id: 'digital_lead',
    label: 'Lead Marketing Digital',
    subtitle: 'Équipe Performance Orange',
    icon: '🟠',
    color: '#FF7900',
    desc: 'Arbitrage des budgets d’acquisition, pilotage du CAC moyen, ratio LTV/CAC et validation des hypothèses stratégiques de croissance.',
    suggestedTab: 'cockpit',
  },
  {
    id: 'product_growth',
    label: 'Product Growth Lead',
    subtitle: 'Maxit / Orange Money',
    icon: '📱',
    color: '#2980B9',
    desc: 'Optimisation des étapes d’activation et de conversion, réduction des abandons de parcours de paiement et engagement cohorte J+7 / J+30.',
    suggestedTab: 'funnel',
  },
  {
    id: 'data_analyst',
    label: 'Data Analyst & Tracking',
    subtitle: 'Mesure & Significativité',
    icon: '📊',
    color: '#27AE60',
    desc: 'Validation de la significativité statistique des tests A/B (p-value, seuil 95%), modélisation prédictive du churn et scoring ICE des opportunités.',
    suggestedTab: 'ideas',
  },
  {
    id: 'direction_strategique',
    label: 'Direction & Stratégie',
    subtitle: 'C-Level & Gouvernance',
    icon: '🎯',
    color: '#8E44AD',
    desc: 'Consolidation du MRR récurrent, rentabilité globale des leviers de croissance, impact business et conformité gouvernance & audit.',
    suggestedTab: 'audit',
  },
];

export default function GrowthPerspectiveBanner({
  currentPerspective,
  onChangePerspective,
  onQuickExport,
  onRefresh,
}) {
  const activeConfig = GROWTH_PERSPECTIVES.find(p => p.id === currentPerspective) || GROWTH_PERSPECTIVES[0];

  return (
    <div
      className="card mb-20 animate-fade"
      style={{
        borderRadius: 12,
        padding: '16px 20px',
        border: '1px solid #E0E0E0',
        background: '#FFFFFF',
        marginBottom: 20
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)' }}>
            Moteur de Perspectives Métier Growth
          </span>
          <span className="tag tag-blue" style={{ fontSize: 11, fontWeight: 700 }}>
            Perspective Active
          </span>
        </div>

        {/* Boutons d'action rapide selon la perspective */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onRefresh}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0', background: '#FFF' }}
          >
            <span>🔄</span> Actualiser Flux
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onQuickExport}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF7900', color: '#FFF' }}
          >
            <span>📥</span> Exporter Fiche {activeConfig.label.split(' ')[0]}
          </button>
        </div>
      </div>

      {/* Boutons Sélecteurs de Perspectives */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10
        }}
      >
        {GROWTH_PERSPECTIVES.map((p) => {
          const isActive = currentPerspective === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChangePerspective(p.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                background: isActive ? '#FFF8F2' : '#F9FAFB',
                border: isActive ? `2px solid ${p.color}` : '1px solid #E5E7EB',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{p.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: isActive ? '#FF7900' : 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {p.subtitle}
                </div>
              </div>
              {isActive && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: p.color,
                    marginTop: 4,
                    flexShrink: 0
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Encadré d'éclairage métier de la perspective */}
      <div
        style={{
          marginTop: 14,
          padding: '10px 14px',
          background: '#FFF8F2',
          borderLeft: `4px solid ${activeConfig.color}`,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ fontSize: 12, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, color: '#E65100' }}>Focus {activeConfig.label} :</span>
          <span>{activeConfig.desc}</span>
        </div>

        {activeConfig.suggestedTab && (
          <button
            type="button"
            onClick={() => onChangePerspective(activeConfig.id)}
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: '#E65100',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Accéder à l'onglet recommandé →
          </button>
        )}
      </div>
    </div>
  );
}
