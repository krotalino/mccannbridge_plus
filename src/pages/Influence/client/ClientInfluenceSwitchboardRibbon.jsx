import React from 'react';

export default function ClientInfluenceSwitchboardRibbon({
  activeTab,
  onSelectTab,
  lastSyncTime,
  kpis,
  selectedEntity
}) {
  const switchboardNodes = [
    {
      id: 'cockpit',
      label: 'Cockpit 360°',
      icon: '📊',
      metric: `${kpis.talentsActifs || 24} actifs`,
      sub: `${kpis.activationsEnCours || 6} activations en cours`,
      color: '#FF7900'
    },
    {
      id: 'talents',
      label: 'Talents & Ambassadeurs',
      icon: '👥',
      metric: 'Vivier Qualifié',
      sub: 'Données protégées & conformité',
      color: '#2980B9'
    },
    {
      id: 'campagnes',
      label: 'Campagnes & Activations',
      icon: '🗂',
      metric: `${kpis.activationsEnCours || 6} opérations`,
      sub: 'Pulse, OM Otélé, B2B Cloud...',
      color: '#F39C12'
    },
    {
      id: 'calendrier',
      label: 'Calendrier & Contenus',
      icon: '📅',
      metric: 'Planning S38-S44',
      sub: 'Détecteur de conflits actif',
      color: '#27AE60'
    },
    {
      id: 'validations',
      label: 'Validations & Conformité',
      icon: '⚡',
      metric: `${kpis.livrablesAValider || 7} décisions`,
      sub: 'Checklist 9 points & BAT',
      color: '#E74C3C'
    },
    {
      id: 'reporting',
      label: 'Reporting & Analyses',
      icon: '📈',
      metric: `${kpis.tauxEngagement || '5.2%'} eng.`,
      sub: `${kpis.porteeCumulee || '16.4M'} reach cumulé`,
      color: '#8E44AD'
    },
    {
      id: 'veille',
      label: 'Veille & Recommandations',
      icon: '💡',
      metric: '3 Recom. Actives',
      sub: 'Benchmark MTN / Wave',
      color: '#16A085'
    }
  ];

  return (
    <div
      className="card mb-20 animate-fade"
      style={{
        borderRadius: 16,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #0B0F19 0%, #111827 50%, #1A2333 100%)',
        border: '1px solid rgba(255, 121, 0, 0.25)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20
      }}
    >
      {/* Halo lumineux d'ambiance Orange */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 121, 0, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Barre supérieure : Statut Paritaire & Synchronisation temps réel */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: 16,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(255, 121, 0, 0.15)',
              border: '1px solid rgba(255, 121, 0, 0.4)',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.5px',
              color: '#FF9E40'
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#FF7900',
                boxShadow: '0 0 8px #FF7900',
                display: 'inline-block'
              }}
            />
            TOUR DE CONTRÔLE INFLUENCE • VUE CLIENT ORANGE
          </div>

          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            Portefeuille d'activations • Confidentialité certifiée McCann × Orange Cameroun
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {selectedEntity && selectedEntity !== 'all' && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.1)',
                color: '#FFF'
              }}
            >
              Filtre : {selectedEntity.toUpperCase()}
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
            <span>⚡ Flux synchronisé :</span>
            <strong style={{ color: '#FF7900' }}>{lastSyncTime || 'En direct'}</strong>
          </div>
        </div>
      </div>

      {/* Grille des 7 nœuds interactifs du Switchboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
          gap: 10
        }}
      >
        {switchboardNodes.map((node) => {
          const isActive = activeTab === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectTab(node.id)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 12,
                background: isActive ? 'rgba(255, 121, 0, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                border: isActive ? `1.5px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 74
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{node.icon}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 5px',
                    borderRadius: 4,
                    background: isActive ? node.color : 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF'
                  }}
                >
                  {node.id.toUpperCase().slice(0, 4)}
                </span>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.9)' }}>
                  {node.label}
                </div>
                <div style={{ fontSize: 10, color: isActive ? node.color : 'rgba(255,255,255,0.5)', marginTop: 2, fontWeight: 600 }}>
                  {node.metric}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
