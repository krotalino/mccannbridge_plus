import React from 'react';
import { TEAM, POLES } from '../../../data/team';

export const PERSPECTIVES = [
  {
    id: 'traffic_manager',
    label: 'Traffic Manager',
    subtitle: 'Chef d’orchestre McCann',
    icon: '🚦',
    color: '#FF7900',
    desc: 'Pouvoir exclusif de qualification, répartition, arbitrage et réaffectation des charges.',
    canAssign: true,
    canQualify: true,
    canViewInternalLoad: true,
  },
  {
    id: 'demandeur',
    label: 'Demandeur (Orange)',
    subtitle: 'Équipe Marque & Comms',
    icon: '🟠',
    color: '#FF7900',
    desc: 'Soumission de briefs, priorisation métier (P0/P1/P2) et validation des livrables sans voir la charge interne.',
    canSubmit: true,
    canValidateClient: true,
    canViewInternalLoad: false,
  },
  {
    id: 'responsable_pole',
    label: 'Directeur / Resp. Pôle',
    subtitle: 'Validation Qualité Interne',
    icon: '🔍',
    color: '#8E24AA',
    desc: 'Contrôle qualité interne (QA Créa & Technique) avant expédition client.',
    canReviewQA: true,
    canViewInternalLoad: true,
  },
  {
    id: 'executant',
    label: 'Exécutant Spécialiste',
    subtitle: 'Workbench Métier',
    icon: '🛠️',
    color: '#1976D2',
    desc: 'Vue personnalisée des tâches assignées, deadlines, timer et signalement de blocage.',
    canTrackTime: true,
    canReportBlockage: true,
    canViewInternalLoad: false,
  },
  {
    id: 'finance',
    label: 'Finance / Contrôle',
    subtitle: 'Audit Budgets & Temps',
    icon: '💰',
    color: '#388E3C',
    desc: 'Analyse des temps réels vs temps estimés, rentabilité horaire et validation facturation.',
    canAuditFinance: true,
    canViewInternalLoad: true,
  },
];

export default function RolePerspectiveBanner({
  currentRole,
  onChangeRole,
  selectedExecutantId,
  onChangeExecutant,
  onOpenNewTicket,
}) {
  const activeConfig = PERSPECTIVES.find(p => p.id === currentRole) || PERSPECTIVES[0];

  // List all operational executants across creatives, cm, specialists
  const allExecutants = [
    ...(TEAM.creatives || []),
    ...(TEAM.cm || []),
    ...(TEAM.specialists || []),
  ];

  const selectedExecutant = allExecutants.find(e => e.id === selectedExecutantId) || allExecutants[0];

  return (
    <div className="card mb-20 animate-fade" style={{ borderRadius: 12, padding: '16px 20px', border: '1px solid #E0E0E0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)' }}>
            Moteur de Rôles & Droits
          </span>
          <span className="tag tag-blue" style={{ fontSize: 11 }}>Perspective Active</span>
        </div>

        {/* Quick action button for new ticket depending on role */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {currentRole === 'demandeur' && (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={onOpenNewTicket}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>+</span> Soumettre une Demande (Brief)
            </button>
          )}
          {currentRole === 'traffic_manager' && (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={onOpenNewTicket}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>+</span> Créer un Ticket Opérationnel
            </button>
          )}
        </div>
      </div>

      {/* Role Switcher Pills */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 8,
          marginBottom: 12
        }}
      >
        {PERSPECTIVES.map(p => {
          const isSelected = currentRole === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChangeRole(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                border: isSelected ? '2px solid #FF7900' : '1px solid #E5E5E5',
                background: isSelected ? '#FFF8F2' : '#FAFAFA',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s ease',
              }}
            >
              <div 
                style={{ 
                  fontSize: 18, 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  background: isSelected ? 'rgba(255, 121, 0, 0.15)' : '#EEE', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {p.icon}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#FF7900' : 'var(--dark)', whiteSpace: 'nowrap' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                  {p.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Perspective Info Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '10px 14px',
          background: '#F9FAFB',
          borderRadius: 8,
          borderLeft: `4px solid ${activeConfig.color}`,
        }}
      >
        <div style={{ fontSize: 12, color: 'var(--body)', flex: 1, minWidth: 260 }}>
          <strong>{activeConfig.icon} Vue {activeConfig.label} : </strong>
          {activeConfig.desc}
        </div>

        {/* If executant is active, show selectable profile dropdown */}
        {currentRole === 'executant' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)' }}>Profil actif :</span>
            <select
              value={selectedExecutantId}
              onChange={(e) => onChangeExecutant(e.target.value)}
              className="form-control"
              style={{ padding: '4px 8px', fontSize: 12, borderRadius: 6, fontWeight: 600, minWidth: 190 }}
            >
              {allExecutants.map(exec => (
                <option key={exec.id} value={exec.id}>
                  {exec.name} ({exec.role})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
