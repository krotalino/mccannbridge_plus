import React from 'react';

export const REPORTING_PERSPECTIVES = [
  {
    id: 'analyste',
    label: 'Analyste Data & Web',
    subtitle: 'Steve BESSOUBE (McCann)',
    icon: '📊',
    color: '#FF7900',
    desc: 'Production des fiches de synthèse, consolidation multi-sources, qualification des briefs et modélisation des prises de parole.',
    suggestedTab: 'demandes'
  },
  {
    id: 'direction_orange',
    label: 'Direction Marque (Orange)',
    subtitle: 'Chefs de Produit & Comms',
    icon: '🟠',
    color: '#FF7900',
    desc: 'Validation des livrables, consultation du Cockpit Exécutif, mesure de la portée organique et des retours sur investissement.',
    suggestedTab: 'cockpit'
  },
  {
    id: 'traffic_ops',
    label: 'Traffic & Opérations',
    subtitle: 'Supervision des Flux SLA',
    icon: '🚦',
    color: '#2980B9',
    desc: 'Gestion des priorités, cadencement des jalons de livraison, élimination des points de blocage et respect des délais contractuels.',
    suggestedTab: 'calendrier'
  },
  {
    id: 'media_buyer',
    label: 'Paid Media & Ads',
    subtitle: 'Performance & Sponsoring',
    icon: '⚡',
    color: '#F39C12',
    desc: 'Analyse de l’efficacité des boosts Meta/TikTok/Google, ROAS, CPM moyen et réallocation budgétaire par format.',
    suggestedTab: 'prises_parole'
  },
  {
    id: 'direction_generale',
    label: 'Direction Exécutive',
    subtitle: 'Gouvernance & C-Level',
    icon: '👑',
    color: '#27AE60',
    desc: 'Audit de performance trimestrielle, part de voix nationale (SOV vs MTN/Camtel), validation des bilans certifiés.',
    suggestedTab: 'livrables'
  }
];

export default function ReportingPerspectiveBanner({
  currentPerspective,
  onChangePerspective,
  onQuickExport,
  onRefresh,
  onNewRequest
}) {
  const activeConfig = REPORTING_PERSPECTIVES.find(p => p.id === currentPerspective) || REPORTING_PERSPECTIVES[0];

  return (
    <div className="card mb-20 animate-fade" style={{ borderRadius: 12, padding: '16px 20px', border: '1px solid #E0E0E0', background: '#FFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)' }}>
            Moteur de Perspectives Métier & Rôles
          </span>
          <span className="tag tag-blue" style={{ fontSize: 11, fontWeight: 700 }}>
            Perspective Active
          </span>
        </div>

        {/* Quick action buttons depending on perspective */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onRefresh}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
          >
            <span>🔄</span> Actualiser Flux
          </button>
          
          {onNewRequest && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onNewRequest}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF7900', color: '#FFF' }}
            >
              <span>+</span> Demander Bilan
            </button>
          )}

          {onQuickExport && (
            <button 
              type="button"
              className="btn btn-ghost btn-sm" 
              onClick={onQuickExport}
              style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
            >
              <span>📥</span> Export {activeConfig.label.split(' ')[0]}
            </button>
          )}
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
        {REPORTING_PERSPECTIVES.map(p => {
          const isSelected = p.id === currentPerspective;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChangePerspective(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                border: isSelected ? `2px solid ${p.color}` : '1px solid #E5E7EB',
                background: isSelected ? '#FFF8F2' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: 18 }}>{p.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: isSelected ? '#FF7900' : 'var(--dark)' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                  {p.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Perspective Description Box */}
      <div 
        style={{
          padding: '10px 14px',
          background: '#F9FAFB',
          borderRadius: 8,
          border: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 12,
          color: '#4B5563'
        }}
      >
        <span style={{ fontSize: 14 }}>💡</span>
        <span>
          <strong>Focus Métier :</strong> {activeConfig.desc}
        </span>
      </div>
    </div>
  );
}
