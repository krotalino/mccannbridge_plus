import React from 'react';

export default function ReportingSwitchboardRibbon({ reports = [], activeTab, onSelectTab }) {
  const total = reports.length;
  const delivered = reports.filter(r => r.status === 'delivered' || r.status === 'approved').length;
  const inProgress = reports.filter(r => r.status === 'in_production' || r.status === 'needs_info' || r.status === 'internal_review' || r.status === 'client_review').length;
  
  const todayStr = new Date().toISOString().slice(0, 10);
  const onTimeCount = reports.filter(r => r.status === 'delivered' || (r.dueDate && r.dueDate >= todayStr)).length;
  const slaRate = total > 0 ? Math.round((onTimeCount / total) * 100) : 100;
  const urgentCount = reports.filter(r => r.priority === 'urgente' && r.status !== 'delivered' && r.status !== 'cancelled').length;

  const isNominal = slaRate >= 85 && urgentCount === 0;

  const switchboardNodes = [
    {
      id: 'demandes',
      label: 'Registre & SLA',
      icon: '📋',
      metric: `${total} livrables`,
      sub: `${slaRate}% respect SLA`,
      color: '#FF7900'
    },
    {
      id: 'cockpit',
      label: 'Cockpit Exécutif',
      icon: '📊',
      metric: '14.8M Reach',
      sub: 'Audience 360° • +18.4%',
      color: '#2980B9'
    },
    {
      id: 'livrables',
      label: 'Livrables & PDF',
      icon: '📄',
      metric: `${delivered} validés`,
      sub: `${inProgress} en traitement`,
      color: '#27AE60'
    },
    {
      id: 'prises_parole',
      label: 'Prises de Parole',
      icon: '⚡',
      metric: 'Formats & Piliers',
      sub: 'Reels, Carrousels, Live',
      color: '#F39C12'
    },
    {
      id: 'benchmark',
      label: 'Benchmark & SOV',
      icon: '🏆',
      metric: 'Part de Voix',
      sub: 'Orange leader vs MTN',
      color: '#8E44AD'
    },
    {
      id: 'calendrier',
      label: 'Calendrier & Délais',
      icon: '📅',
      metric: `${reports.filter(r => r.dueDate).length} échéances`,
      sub: urgentCount > 0 ? `${urgentCount} urgent(s)` : 'Planning nominal',
      color: '#E74C3C'
    },
    {
      id: 'modeles_admin',
      label: 'Modèles & SLA',
      icon: '⚙️',
      metric: 'Gouvernance',
      sub: 'Standardisation QA',
      color: '#16A085'
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
      {/* Background Subtle Gradient Accents */}
      <div 
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          background: 'radial-gradient(circle, rgba(255,121,0,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Top Bar: Title & Global Health Status */}
      <div className="flex justify-between items-center flex-wrap gap-12 mb-16 relative z-10">
        <div className="flex items-center gap-10">
          <div 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: 8, 
              background: '#FF7900', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(255,121,0,0.4)'
            }}
          >
            📈
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              PLATEFORME REPORTING & INSIGHTS 360°
            </div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>
              Direction Marketing, Marques & Digital Web Analytics • Orange Cameroun × Agence McCann
            </div>
          </div>
        </div>

        {/* Global Health Status Chip */}
        <div 
          style={{
            padding: '5px 14px',
            borderRadius: 20,
            background: isNominal ? 'rgba(39, 174, 96, 0.15)' : 'rgba(243, 156, 18, 0.15)',
            border: `1px solid ${isNominal ? '#27AE60' : '#F39C12'}`,
            color: isNominal ? '#2ECC71' : '#F39C12',
            fontSize: 11,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span>{isNominal ? '🟢' : '🟠'}</span>
          <span>{isNominal ? 'Flux Reporting Nominal • Données Synchronisées' : 'Vigilance SLA • Délais Serrés'}</span>
        </div>
      </div>

      {/* Interactive Switchboard Nodes */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
          gap: 10,
          position: 'relative',
          zIndex: 10
        }}
      >
        {switchboardNodes.map(node => {
          const isSelected = activeTab === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectTab(node.id)}
              style={{
                background: isSelected 
                  ? 'rgba(255, 255, 255, 0.14)' 
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected 
                  ? `1px solid ${node.color}` 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '10px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
                outline: 'none'
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }
              }}
            >
              {isSelected && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: node.color
                  }}
                />
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{node.icon}</span>
                <span 
                  style={{ 
                    fontSize: 9, 
                    fontWeight: 800, 
                    textTransform: 'uppercase',
                    color: node.color,
                    background: 'rgba(0,0,0,0.3)',
                    padding: '2px 5px',
                    borderRadius: 4
                  }}
                >
                  {node.id}
                </span>
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                {node.label}
              </div>

              <div style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.2px' }}>
                {node.metric}
              </div>

              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {node.sub}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
