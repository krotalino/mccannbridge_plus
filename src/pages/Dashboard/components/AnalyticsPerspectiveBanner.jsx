import React from 'react';

export const ANALYTICS_PERSPECTIVES = [
  {
    id: 'traffic_ops',
    label: 'Traffic & Opérations',
    subtitle: 'Chef d’orchestre McCann',
    icon: '🚦',
    color: '#FF7900',
    desc: 'Supervision globale de la cadence des livrables, détection des goulots d’étranglement, respect des SLA et charge de production.',
    suggestedTab: 'overview',
  },
  {
    id: 'demandeur',
    label: 'Demandeur (Orange)',
    subtitle: 'Équipe Marque & Comms',
    icon: '🟠',
    color: '#FF7900',
    desc: 'Suivi de la performance des marques Orange, validation des BAT, portée organique, engagement des communautés et respect de la charte.',
    suggestedTab: 'calendar',
  },
  {
    id: 'media_buyer',
    label: 'Media Buyer / Ads',
    subtitle: 'Trading Desk & Sponsoring',
    icon: '⚡',
    color: '#F39C12',
    desc: 'Monitoring des campagnes publicitaires payantes Meta/TikTok/Google/LinkedIn, optimisation du ROAS, CPC, CTR et conversions.',
    suggestedTab: 'ads',
  },
  {
    id: 'finance',
    label: 'Finance / Contrôle',
    subtitle: 'Audit Budgets & CA',
    icon: '💰',
    color: '#27AE60',
    desc: 'Contrôle des décaissements HT, consommation des budgets annuels, facturation CA TTC, commissions d’agence McCann et reste à engager.',
    suggestedTab: 'finance',
  },
  {
    id: 'direction_iam',
    label: 'Direction & IAM',
    subtitle: 'Gouvernance & Audit',
    icon: '👥',
    color: '#8E44AD',
    desc: 'Audit de la sécurité, traçabilité des actions, taux d’adoption de la plateforme Bridge et conformité des habilitations RBAC.',
    suggestedTab: 'users',
  },
];

export default function AnalyticsPerspectiveBanner({
  currentPerspective,
  onChangePerspective,
  onQuickExport,
  onRefresh,
}) {
  const activeConfig = ANALYTICS_PERSPECTIVES.find(p => p.id === currentPerspective) || ANALYTICS_PERSPECTIVES[0];

  return (
    <div className="card mb-20 animate-fade" style={{ borderRadius: 12, padding: '16px 20px', border: '1px solid #E0E0E0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)' }}>
            Moteur de Perspectives & Droits Métier
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
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>📥</span> Exporter Rapport {activeConfig.label.split(' ')[0]}
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
        {ANALYTICS_PERSPECTIVES.map(p => {
          const isSelected = currentPerspective === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChangePerspective(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                border: isSelected ? '2px solid #FF7900' : '1px solid #E5E5E5',
                background: isSelected ? '#FFF8F2' : '#FAFAFA',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s ease',
              }}
            >
              <div 
                style={{ 
                  fontSize: 18, 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  background: isSelected ? 'rgba(255, 121, 0, 0.15)' : '#EEE', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {p.icon}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#FF7900' : 'var(--dark)', whiteSpace: 'nowrap' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                  {p.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Perspective Info Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '10px 14px',
          background: '#F9FAFB',
          borderRadius: 8,
          borderLeft: `4px solid ${activeConfig.color}`,
        }}
      >
        <div style={{ fontSize: 12, color: 'var(--body)', flex: 1, minWidth: 260 }}>
          <strong>{activeConfig.icon} Prisme {activeConfig.label} : </strong>
          {activeConfig.desc}
        </div>
      </div>
    </div>
  );
}
