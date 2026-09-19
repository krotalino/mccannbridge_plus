import React from 'react';
import { GROWTH_KPIS, GROWTH_EXPERIMENTS, GROWTH_ALERTS, GROWTH_IDEAS } from '../../../data/growth';

export default function GrowthSwitchboardRibbon({
  activeTab,
  onSelectTab
}) {
  const liveExps = GROWTH_EXPERIMENTS.filter(e => e.status === 'running');
  const critAlerts = GROWTH_ALERTS.filter(a => !a.acknowledged && (a.type === 'critical' || a.type === 'warning'));

  let healthStatus = 'nominal';
  if (critAlerts.length > 0) {
    healthStatus = 'vigilance';
  }

  const statusThemes = {
    nominal: {
      bg: 'rgba(39, 174, 96, 0.08)',
      border: '#27AE60',
      text: '#27AE60',
      badge: '🟢 Flux Growth Nominal • Synchronisé',
      desc: 'Tous les traceurs du funnel et expérimentations A/B délivrent une significativité certifiée'
    },
    vigilance: {
      bg: 'rgba(231, 76, 60, 0.08)',
      border: '#E74C3C',
      text: '#E74C3C',
      badge: `🟠 ${critAlerts.length} Alerte(s) Détectée(s) • Vigilance Funnel`,
      desc: 'Attention : dérive du churn cohorte M+1 ou friction au checkout nécessitent un arbitrage rapide'
    }
  };

  const currentTheme = statusThemes[healthStatus];

  const switchboardNodes = [
    {
      id: 'cockpit',
      label: 'Cockpit Growth',
      icon: '🚀',
      metric: '4.2x LTV/CAC',
      sub: 'MRR 284.5M FCFA',
      color: '#FF7900'
    },
    {
      id: 'ideas',
      label: "Backlog d'Idées",
      icon: '💡',
      metric: `${GROWTH_IDEAS.length} idées`,
      sub: 'Matrice ICE priorisée',
      color: '#F39C12'
    },
    {
      id: 'experiments',
      label: 'Expériences A/B',
      icon: '🧪',
      metric: `${liveExps.length} en cours`,
      sub: '97.8% max significativité',
      color: '#2980B9'
    },
    {
      id: 'funnel',
      label: 'Funnel & Cohortes',
      icon: '🔄',
      metric: '67% activation',
      sub: 'Parcours AARRR Maxit/OM',
      color: '#27AE60'
    },
    {
      id: 'alerts',
      label: 'Alertes & Signaux',
      icon: '🔔',
      metric: `${critAlerts.length} non résolues`,
      sub: 'Décrochages & anomalies',
      color: '#E74C3C'
    },
    {
      id: 'recommendations',
      label: 'Recommandations IA',
      icon: '🤖',
      metric: '5 pistes IA',
      sub: 'Scoring Gemini Growth',
      color: '#8E44AD'
    },
    {
      id: 'workflows',
      label: 'Automatisation',
      icon: '⚙️',
      metric: '4 flux actifs',
      sub: 'Triggers & Webhooks',
      color: '#16A085'
    },
    {
      id: 'knowledge',
      label: 'Base de Savoirs',
      icon: '📚',
      metric: '6 playbooks',
      sub: 'Méthodologie & Learnings',
      color: '#34495E'
    }
  ];

  return (
    <div
      className="card mb-20 animate-fade"
      style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        color: '#FFFFFF',
        borderRadius: 14,
        padding: '16px 20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20
      }}
    >
      {/* Halo radial de fond */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 121, 0, 0.18) 0%, rgba(255, 121, 0, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Bandeau supérieur de statut du switchboard */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: 12,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.7)',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '3px 8px',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            SWITCHBOARD GROWTH HACKING
          </span>

          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 20,
              background: currentTheme.bg,
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.text
            }}
          >
            {currentTheme.badge}
          </span>

          <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.65)' }}>
            {currentTheme.desc}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11.5, color: 'rgba(255, 255, 255, 0.6)' }}>
          <span>Expériences : <strong style={{ color: '#FF7900' }}>{liveExps.length} en cours</strong></span>
          <span>•</span>
          <span>Alertes : <strong style={{ color: critAlerts.length > 0 ? '#E74C3C' : '#27AE60' }}>{critAlerts.length}</strong></span>
          <span>•</span>
          <span>LTV/CAC : <strong style={{ color: '#27AE60' }}>4.2x</strong></span>
        </div>
      </div>

      {/* Grille des 8 nœuds interactifs du switchboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 10,
          marginTop: 14
        }}
      >
        {switchboardNodes.map((node) => {
          const isSelected = activeTab === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectTab && onSelectTab(node.id)}
              style={{
                background: isSelected ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                border: isSelected ? `2px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '10px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 82,
                outline: 'none',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }
              }}
            >
              {/* Header du nœud */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{node.icon}</span>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: node.color,
                    boxShadow: isSelected ? `0 0 8px ${node.color}` : 'none'
                  }}
                />
              </div>

              {/* Titre & métrique */}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.metric}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.5)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
