import React from 'react';

export const CLIENT_REPORTING_PERSPECTIVES = [
  {
    id: 'direction_marketing',
    label: 'Direction Marketing & Marque',
    subtitle: 'Supervision Stratégique 360°',
    icon: '🟠',
    color: '#FF7900',
    desc: 'Contrôle de la synthèse exécutive 60s, arbitrage des priorités, alignement sur les objectifs de notoriété et de part de voix globale.',
    suggestedTab: 'cockpit',
  },
  {
    id: 'brand_consumer',
    label: 'Brand Manager Telco & Pulse',
    subtitle: 'Lions4Life & Formats Jeunes',
    icon: '🦁',
    color: '#2980B9',
    desc: 'Suivi des campagnes phares (Lions4Life, Pulse, Best Deal), analyse de performance des formats courts (TikTok/Reels) et taux d’engagement.',
    suggestedTab: 'campaigns',
  },
  {
    id: 'orange_money',
    label: 'Responsable Orange Money (OM)',
    subtitle: 'FinTech & Éducation Média',
    icon: '💳',
    color: '#27AE60',
    desc: 'Monitoring de l’adoption des services financiers mobiles, veille concurrentielle face à MTN MoMo et conversion des usages transactionnels.',
    suggestedTab: 'brand',
  },
  {
    id: 'b2b_enterprises',
    label: 'Orange Business (B2B)',
    subtitle: 'Corporate & Décideurs LinkedIn',
    icon: '💼',
    color: '#8E44AD',
    desc: 'Positionnement B2B premium sur LinkedIn et X, benchmark face à MTN Business et qualification de l’engagement des décideurs d’entreprise.',
    suggestedTab: 'benchmark',
  },
  {
    id: 'media_strategist',
    label: 'Analyste Média & Stratégie McCann',
    subtitle: 'Optimisation & Livrables S38',
    icon: '📊',
    color: '#E74C3C',
    desc: 'Suivi de l’efficacité paid vs organique, audit de conformité de la charte de diffusion, recommandations AARRR et génération du bilan PDF officiel.',
    suggestedTab: 'action_plan',
  },
];

export default function ClientPerspectiveBanner({
  currentPerspective,
  onChangePerspective,
  onQuickExport,
  onRefresh,
}) {
  const activeConfig = CLIENT_REPORTING_PERSPECTIVES.find(p => p.id === currentPerspective) || CLIENT_REPORTING_PERSPECTIVES[0];

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
            Moteur de Perspectives Métier — Reporting Exécutif
          </span>
          <span className="tag tag-blue" style={{ fontSize: 11, fontWeight: 700 }}>
            Perspective Active
          </span>
        </div>

        {/* Quick action buttons */}
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
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF7900', color: '#fff', border: 'none' }}
          >
            <span>📥</span> Télécharger Bilan PDF S38
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
        {CLIENT_REPORTING_PERSPECTIVES.map((p) => {
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
                padding: '10px 12px',
                borderRadius: 8,
                border: isActive ? `2px solid ${p.color}` : '1px solid #E0E0E0',
                background: isActive ? '#FFF8F2' : '#FAFAFA',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: 18 }}>{p.icon}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: isActive ? '#FF7900' : 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Perspective Detail Box */}
      <div
        style={{
          background: '#F8F9FB',
          borderLeft: `3px solid ${activeConfig.color}`,
          padding: '10px 14px',
          borderRadius: '0 8px 8px 0',
          fontSize: 12,
          color: 'var(--dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, color: activeConfig.color }}>
            Focus {activeConfig.label} :
          </span>
          <span style={{ color: '#4A5568' }}>
            {activeConfig.desc}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>
          <span>Onglet recommandé :</span>
          <span className="tag tag-orange" style={{ textTransform: 'capitalize' }}>
            {activeConfig.suggestedTab.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}
