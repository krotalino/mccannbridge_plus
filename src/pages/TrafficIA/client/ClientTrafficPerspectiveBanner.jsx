import React from 'react';
import { CLIENT_ROLES } from '../../../data/clientTrafficData';
import { ShieldCheck, Plus, CheckCircle2, UserCheck, Eye, Compass } from 'lucide-react';

export default function ClientTrafficPerspectiveBanner({
  currentRole = 'valideur_orange',
  onChangeRole,
  onOpenNewBrief,
  onOpenValidations,
  pendingValidationsCount = 2,
}) {
  const activeRoleConfig = CLIENT_ROLES.find(r => r.id === currentRole) || CLIENT_ROLES[0];

  return (
    <div
      className="card mb-20 animate-fade"
      style={{
        borderRadius: 12,
        padding: '16px 20px',
        border: '1px solid #E0E0E0',
        background: '#FFFFFF',
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: 'var(--muted)',
            }}
          >
            MOTEUR DE RÔLES & DROITS CLIENT
          </span>
          <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
            Perspective active : {activeRoleConfig.label}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 12,
              background: '#F0F9FF',
              color: '#0369A1',
              border: '1px solid #BAE6FD',
            }}
          >
            {activeRoleConfig.badge}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {pendingValidationsCount > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onOpenValidations}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                borderColor: '#FF7900',
                background: '#FFF8F2',
                color: '#FF7900',
                fontWeight: 800,
              }}
            >
              <span>⚡</span>
              <span>{pendingValidationsCount} Validation(s) en attente</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenNewBrief}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FF7900',
              borderColor: '#FF7900',
              fontWeight: 800,
              boxShadow: '0 2px 6px rgba(255, 121, 0, 0.3)',
            }}
          >
            <Plus size={15} />
            <span>Nouveau Brief Structuré Orange</span>
          </button>
        </div>
      </div>

      {/* Role Selection Pills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10,
          marginBottom: 12,
        }}
      >
        {CLIENT_ROLES.map(role => {
          const isSelected = currentRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChangeRole(role.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                border: isSelected ? '2px solid #FF7900' : '1px solid #E5E7EB',
                background: isSelected ? '#FFF8F2' : '#FAFAFA',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 20 }}>{role.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: isSelected ? '#FF7900' : 'var(--dark)',
                    }}
                  >
                    {role.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 size={14} className="text-orange-600" />
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.3 }}>
                  {role.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Role Rights & Permissions Banner */}
      <div
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--dark)' }}>
            Droits autorisés pour {activeRoleConfig.label} :
          </span>
          {activeRoleConfig.permissions.map((perm, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 6,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#334155',
              }}
            >
              ✓ {perm}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          🔒 Cloisonnement garanti • Aucune exposition aux charges RH internes de l’agence
        </div>
      </div>
    </div>
  );
}
