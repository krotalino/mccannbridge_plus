import React from 'react';
import { CLIENT_INFLUENCE_ROLES } from '../../../data/clientInfluenceData';

export default function ClientInfluencePerspectiveBanner({
  currentRole,
  onChangeRole,
  onRefresh,
  onExport,
  onNewBrief,
  isRefreshing
}) {
  const activeRoleConfig =
    CLIENT_INFLUENCE_ROLES.find(r => r.id === currentRole) || CLIENT_INFLUENCE_ROLES[0];

  return (
    <div
      className="card mb-20 animate-fade"
      style={{
        borderRadius: 14,
        padding: '16px 20px',
        border: '1px solid #E5E7EB',
        background: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        marginBottom: 20
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          marginBottom: 14
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--muted)'
            }}
          >
            Perspective & Droits Client Orange :
          </span>

          <span
            className="tag tag-orange"
            style={{ fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>{activeRoleConfig.icon}</span>
            <span>{activeRoleConfig.label}</span>
          </span>
        </div>

        {/* Boutons d'action rapide */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
          >
            <span>🔄</span> {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onNewBrief}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFF3E8',
              color: '#E65100',
              border: '1px solid #FFD8BE',
              fontWeight: 700
            }}
          >
            <span>+</span> Nouveau Brief Influence
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FF7900',
              color: '#FFF'
            }}
          >
            <span>📥</span> Exporter Portefeuille
          </button>
        </div>
      </div>

      {/* Sélecteur des 4 perspectives clients */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10,
          marginBottom: 14
        }}
      >
        {CLIENT_INFLUENCE_ROLES.map((role) => {
          const isSelected = role.id === currentRole;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChangeRole(role.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                border: isSelected ? '2px solid #FF7900' : '1px solid #E5E7EB',
                background: isSelected ? '#FFF8F2' : '#FAFAFA',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: 20 }}>{role.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: isSelected ? 800 : 700, color: isSelected ? '#E65100' : 'var(--dark)' }}>
                  {role.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {role.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bandeau d'information et permissions associées au rôle actif */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 280 }}>
          <span style={{ fontSize: 16 }}>ℹ️</span>
          <span style={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>
            <strong>Mission :</strong> {activeRoleConfig.description}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>Périmètre de décision :</span>
          {activeRoleConfig.permissions.map((perm, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                background: '#E2E8F0',
                color: '#1E293B'
              }}
            >
              ✓ {perm}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
