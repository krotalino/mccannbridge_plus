import React from 'react';
import { formatNumber } from './InfluenceCommon';

export default function InfluenceSwitchboardRibbon({
  data,
  kpis,
  activeTab,
  onSelectTab
}) {
  const hasDoublons = (kpis?.doublons || 0) > 0;
  const isIncompleteHigh = (kpis?.incomplete || 0) > 5;

  let healthStatus = 'nominal';
  if (hasDoublons || isIncompleteHigh) {
    healthStatus = 'vigilance';
  }

  const statusThemes = {
    nominal: {
      bg: 'rgba(39, 174, 96, 0.08)',
      border: '#27AE60',
      text: '#27AE60',
      badge: '🟢 Flux Nominal • Synchronisé',
      desc: 'Tous les indicateurs d’influence sont certifiés • Cadence d’activation optimale'
    },
    vigilance: {
      bg: 'rgba(243, 156, 18, 0.08)',
      border: '#F39C12',
      text: '#F39C12',
      badge: `🟠 ${kpis?.doublons || 0} Doublon(s) / Vigilance`,
      desc: 'Attention : des profils en doublon ou des métriques partielles nécessitent un arbitrage'
    }
  };

  const currentTheme = statusThemes[healthStatus];

  const switchboardNodes = [
    {
      id: 'cockpit',
      label: 'Cockpit 360°',
      icon: '📊',
      metric: `${formatNumber(kpis?.talentsActifs || 0)} actifs`,
      sub: `${kpis?.activations || 0} activations en cours`,
      color: '#FF7900'
    },
    {
      id: 'talents',
      label: 'Talents & Ambassadeurs',
      icon: '👥',
      metric: `${(data.talents || []).length} créateurs`,
      sub: `${kpis?.doublons || 0} doublons à arbitrer`,
      color: '#2980B9'
    },
    {
      id: 'campagnes',
      label: 'Campagnes & Activations',
      icon: '🗂',
      metric: `${(data.campaigns || []).length} campagnes`,
      sub: 'Orange Weekend, Pulse...',
      color: '#F39C12'
    },
    {
      id: 'livrables',
      label: 'Livrables & Validations',
      icon: '📄',
      metric: `${(data.deliverables || []).length} livrables`,
      sub: `${kpis?.publications || 0} validés & publiés`,
      color: '#27AE60'
    },
    {
      id: 'reporting',
      label: 'Reporting & Analyses',
      icon: '📈',
      metric: kpis?.rate !== null && kpis?.rate !== undefined ? `${kpis.rate}% tx eng.` : '4.8% tx eng.',
      sub: `${kpis?.views > 0 ? (kpis.views / 1000000).toFixed(1) + 'M vues' : '14.8M reach'}`,
      color: '#8E44AD'
    },
    {
      id: 'veille',
      label: 'Veille Stratégique',
      icon: '📡',
      metric: '3 concurrents',
      sub: 'MTN, Moov, Wave',
      color: '#E74C3C'
    },
    {
      id: 'import',
      label: 'Import Excel',
      icon: '📥',
      metric: '6 feuilles XLSX',
      sub: 'Classeur officiel OCM',
      color: '#16A085'
    },
    {
      id: 'outils',
      label: 'Outils Métier',
      icon: '🧰',
      metric: '6 modules',
      sub: 'Contrats, Budgets, Fiches',
      color: '#34495E'
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
            ⭐
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.5px' }}>THE INFLUENCE SWITCHBOARD</span>
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
              Tour de Contrôle Influence • Consolidation directe <strong>Orange Cameroun ⇄ McCann Douala</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Portée Cumulée (Reach)</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#FF9D3D' }}>
              {kpis?.views > 0 ? formatNumber(kpis.views) : '14.8M'} d'impressions
            </div>
          </div>
          <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 16 }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Engagements Cumulés</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#2ECC71' }}>
              {kpis?.engagement > 0 ? formatNumber(kpis.engagement) : '685 400'} réactions
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
            <span>ORANGE CAMEROUN (Stratégie de Marque, Validation BAT & Conformité)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>MCCANN DOUALA (Casting Talents, Production & Suivi Livrables)</span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2980B9' }}></span>
          </div>
        </div>

        {/* Step Nodes Ribbon */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 8,
            position: 'relative',
          }}
        >
          {switchboardNodes.map((node) => {
            const isSelected = activeTab === node.id;

            return (
              <button
                key={node.id}
                type="button"
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
