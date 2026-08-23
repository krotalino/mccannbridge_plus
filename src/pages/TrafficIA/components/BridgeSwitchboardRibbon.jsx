import React from 'react';
import { TRAFFIC_STATUSES } from '../../../data/tickets';

export default function BridgeSwitchboardRibbon({ tickets = [], onSelectStatus, activeFilterStatus }) {
  // Compute bridge flow metrics
  const totalActive = tickets.filter(t => t.status !== 'delivered').length;
  const blockedCount = tickets.filter(t => t.blockage?.isBlocked).length;
  const p0Count = tickets.filter(t => t.priority === 'p0_urgent' && t.status !== 'delivered').length;
  const revisionCount = tickets.filter(t => t.status === 'revisions').length;
  const inReviewCount = tickets.filter(t => t.status === 'client_review' || t.status === 'internal_review').length;

  // Determine overall bridge traffic health
  let bridgeStatus = 'fluide'; // fluide | ralenti | bouchon
  if (blockedCount > 0 || p0Count >= 3) {
    bridgeStatus = 'bouchon';
  } else if (revisionCount > 1 || inReviewCount > 3) {
    bridgeStatus = 'ralenti';
  }

  const statusColors = {
    fluide: { bg: 'rgba(39, 174, 96, 0.08)', border: '#27AE60', text: '#27AE60', badge: '🟢 Flux Fluide', desc: 'Débit nominal • Aucun blocage critique actif' },
    ralenti: { bg: 'rgba(243, 156, 18, 0.08)', border: '#F39C12', text: '#F39C12', badge: '🟠 Trafic Ralenti', desc: 'Révisions en cours ou validation en attente' },
    bouchon: { bg: 'rgba(231, 76, 60, 0.08)', border: '#E74C3C', text: '#E74C3C', badge: '🔴 Bouchon / Goulot', desc: 'Blocage signalé ou surcharge d’urgences P0' },
  };

  const currentTheme = statusColors[bridgeStatus];

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
            🌉
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.5px' }}>THE BRIDGE SWITCHBOARD</span>
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
              Le Standard du Pont • Canal de synchronisation direct <strong>Orange Cameroun ⇄ McCann Douala</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Débit opérationnel</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#FF9D3D' }}>
              {totalActive} flux en transit
            </div>
          </div>
          {blockedCount > 0 && (
            <div style={{ padding: '6px 12px', background: 'rgba(231, 76, 60, 0.2)', border: '1px solid #E74C3C', borderRadius: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#FF6B6B' }}>
                🚨 {blockedCount} goulot(s) d'étranglement
              </span>
            </div>
          )}
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
            <span>ORANGE CAMEROUN (Demandeurs & Validation)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>MCCANN DOUALA (Traffic & Production)</span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2980B9' }}></span>
          </div>
        </div>

        {/* Step Nodes Ribbon */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: 8,
            position: 'relative',
          }}
        >
          {TRAFFIC_STATUSES.map((st, idx) => {
            const count = tickets.filter(t => t.status === st.id).length;
            const isSelected = activeFilterStatus === st.id;
            const hasBlocked = tickets.some(t => t.status === st.id && t.blockage?.isBlocked);

            return (
              <button
                key={st.id}
                onClick={() => onSelectStatus(isSelected ? 'all' : st.id)}
                style={{
                  background: isSelected 
                    ? 'rgba(255, 121, 0, 0.25)' 
                    : hasBlocked 
                    ? 'rgba(231, 76, 60, 0.15)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected 
                    ? '1px solid #FF7900' 
                    : hasBlocked 
                    ? '1px solid #E74C3C' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  padding: '8px 10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{st.icon}</span>
                  <span 
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: 10,
                      background: count > 0 ? (hasBlocked ? '#E74C3C' : st.color) : 'rgba(255,255,255,0.1)',
                      color: '#FFF'
                    }}
                  >
                    {count}
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {st.shortLabel}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                  Étape {idx + 1}/8
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
