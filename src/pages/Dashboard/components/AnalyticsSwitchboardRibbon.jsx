import React from 'react';

export default function AnalyticsSwitchboardRibbon({ data, activeTab, onSelectTab }) {
  const { metrics } = data;

  // Calcul du statut de performance globale
  const isBudgetHigh = metrics.tauxConsommation > 85;
  const isCpaHigh = metrics.avgCPA > 1200;
  
  let healthStatus = 'nominal';
  if (isBudgetHigh || isCpaHigh) {
    healthStatus = 'vigilance';
  }

  const statusThemes = {
    nominal: {
      bg: 'rgba(39, 174, 96, 0.08)',
      border: '#27AE60',
      text: '#27AE60',
      badge: '🟢 Flux Nominal • Synchronisé',
      desc: 'Tous les indicateurs 360° sont au vert • Cadence de diffusion optimale'
    },
    vigilance: {
      bg: 'rgba(243, 156, 18, 0.08)',
      border: '#F39C12',
      text: '#F39C12',
      badge: '🟠 Vigilance Budgétaire Active',
      desc: 'Consommation budgétaire avancée (> 80%) sur certains postes Ads & Influence'
    }
  };

  const currentTheme = statusThemes[healthStatus];

  const switchboardNodes = [
    {
      id: 'overview',
      label: 'Cockpit 360°',
      icon: '📊',
      metric: 'Vue Globale',
      sub: '6 Modules croisés',
      color: '#FF7900'
    },
    {
      id: 'calendar',
      label: 'Contenus & Posts',
      icon: '📅',
      metric: `${metrics.totalPublications} livrables`,
      sub: `${metrics.totalSponsoredPubs} sponsorisés`,
      color: '#2980B9'
    },
    {
      id: 'ads',
      label: 'Ads & Sponsoring',
      icon: '⚡',
      metric: `${(metrics.totalAdsSpent / 1000000).toFixed(1)}M FCFA`,
      sub: `CTR ${metrics.avgCTR}% · ROAS 4.2x`,
      color: '#F39C12'
    },
    {
      id: 'finance',
      label: 'Facturation & CA',
      icon: '💰',
      metric: `${(metrics.totalTTC / 1000000).toFixed(1)}M TTC`,
      sub: `${metrics.tauxConsommation}% consommé`,
      color: '#27AE60'
    },
    {
      id: 'users',
      label: 'Utilisateurs & IAM',
      icon: '👥',
      metric: `${metrics.activeUsersCount} collaborateurs`,
      sub: 'Adoption 94.2%',
      color: '#8E44AD'
    },
    {
      id: 'influence',
      label: 'Talents & Influence',
      icon: '⭐',
      metric: `${metrics.activeInfluencersCount} créateurs`,
      sub: '22 contrats signés',
      color: '#E74C3C'
    }
  ];

  return (
    <div 
      className="card mb-20 bridge-ribbon-container animate-fade"
      style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        color: '#FFFFFF',
        borderRadius: 14,
        padding: '18px 24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {/* Background Animated Light Beam */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 121, 0, 0.15), rgba(39, 174, 96, 0.15), transparent)',
          animation: 'bridgeSweep 6s infinite linear',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 10, 
              background: 'rgba(255, 121, 0, 0.15)', 
              border: '1px solid rgba(255, 121, 0, 0.4)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 22 
            }}
          >
            📊
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.5px' }}>THE ANALYTICS SWITCHBOARD</span>
              <span 
                style={{ 
                  fontSize: 11, 
                  fontWeight: 700, 
                  padding: '3px 9px', 
                  borderRadius: 20, 
                  background: currentTheme.bg, 
                  color: currentTheme.text, 
                  border: `1px solid ${currentTheme.border}` 
                }}
              >
                {currentTheme.badge}
              </span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
              Tour de Contrôle Transverse • Consolidation directe <strong>Orange Cameroun ⇄ McCann Douala</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Audience Cumulée Reach</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#FF9D3D' }}>
              14.8M d'impressions
            </div>
          </div>
          <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 16 }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Facturation CA TTC</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#2ECC71' }}>
              {(metrics.totalTTC / 1000000).toFixed(1)}M FCFA
            </div>
          </div>
        </div>
      </div>

      {/* The Visual Bridge Ribbon (from Left Orange to Right McCann) */}
      <div 
        style={{
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF7900' }}></span>
            <span>ORANGE CAMEROUN (Gouvernance, Validations & Marque)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>MCCANN DOUALA (Production, Media Buying & Création)</span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2980B9' }}></span>
          </div>
        </div>

        {/* Step Nodes Ribbon */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 8,
            position: 'relative',
          }}
        >
          {switchboardNodes.map((node) => {
            const isSelected = activeTab === node.id;

            return (
              <button
                key={node.id}
                onClick={() => onSelectTab(node.id)}
                style={{
                  background: isSelected 
                    ? 'rgba(255, 121, 0, 0.25)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected 
                    ? '1px solid #FF7900' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  color: '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{node.icon}</span>
                  <span 
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: 10,
                      background: isSelected ? '#FF7900' : 'rgba(255,255,255,0.12)',
                      color: '#FFF'
                    }}
                  >
                    {isSelected ? 'ACTIF' : 'VOIR'}
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? '#FF9D3D' : '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.label}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#FFF', marginTop: 2 }}>
                  {node.metric}
                </div>
                <div style={{ fontSize: 10, opacity: 0.65, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
