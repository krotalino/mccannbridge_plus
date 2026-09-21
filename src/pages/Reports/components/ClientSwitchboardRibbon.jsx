import React from 'react';

export default function ClientSwitchboardRibbon({
  activeTab,
  onSelectTab,
  selectedBrand = 'all',
  compareMode = true,
  lastSyncTime = '11:42'
}) {
  const switchboardNodes = [
    {
      id: 'cockpit',
      label: '1. Cockpit Exécutif',
      icon: '📊',
      metric: '11.0M Reach',
      sub: '685K Eng. • 7 KPIs clés',
      color: '#FF7900',
      badge: 'S38 Live'
    },
    {
      id: 'brand',
      label: '2. Performance Marque',
      icon: '📈',
      metric: '4 Entités',
      sub: '7 Réseaux • Facebook, Insta...',
      color: '#2980B9',
      badge: 'Consolidé'
    },
    {
      id: 'campaigns',
      label: '3. Campagnes & Contenus',
      icon: '🎯',
      metric: 'Lions4Life & Pulse',
      sub: 'Top Posts & Formats Vidéo',
      color: '#F39C12',
      badge: 'Top 5'
    },
    {
      id: 'benchmark',
      label: '4. Benchmark & Insights',
      icon: '⚖️',
      metric: '90.3% SOV Telco',
      sub: '3 Espaces • Veille Concurrence',
      color: '#8E44AD',
      badge: '3 Espaces'
    },
    {
      id: 'action_plan',
      label: '5. Plan d’Action & Livrables',
      icon: '📋',
      metric: 'PDF S38 Prêt',
      sub: '6 Recommandations AARRR',
      color: '#27AE60',
      badge: 'Validé'
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
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: 20
      }}
    >
      {/* Background Animated Light Beam (identique au module Influence) */}
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

      {/* Header du Switchboard */}
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
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.5px' }}>
                THE EXECUTIVE REPORTING SWITCHBOARD
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 20,
                  background: 'rgba(39, 174, 96, 0.12)',
                  color: '#2ECC71',
                  border: '1px solid rgba(46, 204, 113, 0.4)'
                }}
              >
                🟢 Flux Nominal • S38 Certifié
              </span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
              Tour de Contrôle Décisionnelle • Consolidation directe <strong>Orange Cameroun ⇄ McCann Douala</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Portée Totale (Reach S38)</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#FF9D3D' }}>
              10 998 043 <span style={{ fontSize: 11, color: '#2ECC71' }}>▲ +18.4%</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 16 }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Engagements Cumulés</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#2ECC71' }}>
              685 412 <span style={{ fontSize: 11, color: '#2ECC71' }}>▲ +14.2%</span>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF7900' }}></span>
            <span>ORANGE CAMEROUN (Direction Marketing, Mobile Money, B2B & Pulse)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>MCCANN DOUALA (Data Intelligence, Social Media Ops & Planning)</span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2980B9' }}></span>
          </div>
        </div>

        {/* Step Nodes Ribbon */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: 8,
            position: 'relative',
          }}
        >
          {switchboardNodes.map((node) => {
            const isSelected = activeTab === node.id;
            return (
              <div
                key={node.id}
                onClick={() => onSelectTab(node.id)}
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  border: isSelected ? `1px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? `0 0 14px ${node.color}33` : 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{node.icon}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 10,
                      background: isSelected ? node.color : 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF'
                    }}
                  >
                    {node.badge}
                  </span>
                </div>

                <div style={{ fontSize: 12, fontWeight: 800, color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)' }}>
                  {node.label}
                </div>

                <div style={{ fontSize: 13, fontWeight: 900, color: node.color, marginTop: 3 }}>
                  {node.metric}
                </div>

                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
