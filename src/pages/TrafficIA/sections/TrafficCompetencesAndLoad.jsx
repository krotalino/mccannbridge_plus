import React, { useState } from 'react';
import { POLES, TEAM } from '../../../data/team';
import { getCreativeLoad, getLoadColor } from '../../../utils/helpers';

export default function TrafficCompetencesAndLoad({
  tickets = [],
  onReassignTicket,
  onSelectTicket,
}) {
  const [selectedPole, setSelectedPole] = useState('all');

  const allMembers = [
    ...(TEAM.creatives || []),
    ...(TEAM.cdp || []),
    ...(TEAM.cm || []),
    ...(TEAM.specialists || []),
  ];

  // 80/20 Rule Calculation
  const activeTickets = tickets.filter(t => t.status !== 'delivered');
  const p0Tickets = activeTickets.filter(t => t.priority === 'p0_urgent');
  const p0Ratio = activeTickets.length > 0 ? Math.round((p0Tickets.length / activeTickets.length) * 100) : 0;
  const isP0Overloaded = p0Ratio > 20;

  // Calculate member loads
  const membersWithLoad = allMembers.map(member => {
    const assignedTickets = activeTickets.filter(t => t.assignee === member.id);
    const load = getCreativeLoad(member.id, tickets, TEAM);
    const backup = allMembers.find(m => m.id === member.backupId);

    // Check if this member is in a Bus Factor risk state (high load + has critical P0 ticket)
    const hasCriticalP0 = assignedTickets.some(t => t.priority === 'p0_urgent' || t.blockage?.isBlocked);
    const isBusFactorRisk = load >= 85 && hasCriticalP0;

    return {
      ...member,
      load,
      assignedTickets,
      backup,
      isBusFactorRisk,
    };
  });

  // Filter members by selected pole
  const filteredMembers = selectedPole === 'all'
    ? membersWithLoad
    : membersWithLoad.filter(m => m.pole === selectedPole);

  // Identify all high-risk Bus Factor candidates
  const busFactorRisks = membersWithLoad.filter(m => m.isBusFactorRisk);

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* Top Banner: 80/20 Rule & Capacity Health */}
      <div className="grid grid-3" style={{ gap: 14 }}>
        <div className="card p-16" style={{ borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            Règle des 80/20 (Urgences P0)
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: isP0Overloaded ? '#E74C3C' : 'var(--dark)', marginTop: 4 }}>
            {p0Ratio}% ({p0Tickets.length} / {activeTickets.length})
          </div>
          <div style={{ fontSize: 11, color: isP0Overloaded ? '#E74C3C' : 'var(--muted)', marginTop: 2 }}>
            {isP0Overloaded 
              ? '⚠️ Seuil de 20% dépassé : risque de cannibalisation des projets de fond.' 
              : '✅ Charge d’urgences sous contrôle (< 20%).'}
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            Membres en surcharge (&gt; 85%)
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: membersWithLoad.filter(m => m.load >= 85).length > 0 ? '#E74C3C' : '#27AE60', marginTop: 4 }}>
            {membersWithLoad.filter(m => m.load >= 85).length} / {membersWithLoad.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Alerte automatique émise pour réaffectation
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            Total Heures Actives en Production
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--blue)', marginTop: 4 }}>
            {activeTickets.reduce((sum, t) => sum + (t.estimatedHours || 8), 0)}h
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Répartis sur {activeTickets.length} livrables
          </div>
        </div>
      </div>

      {/* Bus Factor Red Alert Banner with 1-Click Reassignment */}
      {busFactorRisks.length > 0 && (
        <div className="card p-16" style={{ background: '#FFF5F5', border: '2px solid #E74C3C', borderRadius: 12 }}>
          <div className="flex items-center gap-10 mb-10">
            <span style={{ fontSize: 22 }}>🚨</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#C62828' }}>
                ALERTE ROUGE BUS FACTOR & GOULOT D'ÉTRANGLEMENT
              </div>
              <div style={{ fontSize: 12, color: '#5D4037' }}>
                Des tâches critiques (P0) sont assignées à des membres saturés à plus de 85%. Utilisez la réaffectation 1-clic vers le back-up humain.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {busFactorRisks.map(riskMember => {
              const criticalTicket = riskMember.assignedTickets.find(t => t.priority === 'p0_urgent' || t.blockage?.isBlocked) || riskMember.assignedTickets[0];
              const backup = riskMember.backup;

              if (!criticalTicket || !backup) return null;

              return (
                <div 
                  key={riskMember.id}
                  className="flex justify-between items-center flex-wrap gap-10"
                  style={{ background: '#FFFFFF', padding: 12, borderRadius: 8, border: '1px solid #FFCDD2' }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                      {criticalTicket.title} ({criticalTicket.id})
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      Assigné saturé : <strong>{riskMember.name}</strong> ({riskMember.load}% charge) ➔ Back-up recommandé : <strong>{backup.name}</strong> ({getCreativeLoad(backup.id, tickets, TEAM)}% charge)
                    </div>
                  </div>

                  <button
                    className="btn btn-red btn-sm"
                    onClick={() => onReassignTicket(criticalTicket.id, backup.id, backup.name, { assigneeRole: backup.role, backupId: riskMember.id })}
                  >
                    ⚡ Transférer immédiatement à {backup.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Competences & Load Grid */}
      <div className="card p-20" style={{ borderRadius: 12 }}>
        <div className="flex justify-between items-center flex-wrap gap-12 mb-16">
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
              📊 RÉPARTITION DES COMPÉTENCES & CHARGE ÉQUIPE
            </h3>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              Surveillance en temps réel de la charge optimale de chaque talent de l'agence.
            </div>
          </div>

          {/* Pole Selector */}
          <div className="flex items-center gap-8">
            <span style={{ fontSize: 12, fontWeight: 700 }}>Pôle :</span>
            <select 
              className="form-control" 
              value={selectedPole} 
              onChange={e => setSelectedPole(e.target.value)}
              style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, minWidth: 160 }}
            >
              <option value="all">Tous les Pôles ({allMembers.length} membres)</option>
              {POLES.map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-2" style={{ gap: 14 }}>
          {filteredMembers.map(member => {
            const loadColor = getLoadColor(member.load);
            const isSaturated = member.load >= 85;
            const poleInfo = POLES.find(p => p.id === member.pole) || POLES[0];

            return (
              <div 
                key={member.id} 
                className="card p-16" 
                style={{ 
                  borderRadius: 10, 
                  border: isSaturated ? '1px solid #E74C3C' : '1px solid #EBEBEB',
                  background: isSaturated ? '#FFFDFD' : '#FFFFFF',
                }}
              >
                {/* Member Header */}
                <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-10">
                    <div className="avatar avatar-md" style={{ background: '#1A1A2E', color: '#FFF' }}>
                      {member.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {member.role} • <strong>{poleInfo.icon} {poleInfo.label}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span 
                      style={{ 
                        fontSize: 13, 
                        fontWeight: 800, 
                        color: loadColor,
                        padding: '2px 8px', 
                        borderRadius: 12, 
                        background: 'rgba(0,0,0,0.05)' 
                      }}
                    >
                      {member.load}%
                    </span>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                      {isSaturated ? 'Surcharge' : 'Capacité OK'}
                    </div>
                  </div>
                </div>

                {/* Load Progress Bar */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ height: 6, background: '#E0E0E0', borderRadius: 3, overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${Math.min(100, member.load)}%`, 
                        background: loadColor, 
                        borderRadius: 3 
                      }} 
                    />
                  </div>
                </div>

                {/* Assigned Tasks list */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>
                    Tâches actives ({member.assignedTickets.length}) :
                  </div>
                  {member.assignedTickets.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {member.assignedTickets.map(t => (
                        <div 
                          key={t.id}
                          onClick={() => onSelectTicket(t)}
                          style={{
                            fontSize: 11,
                            padding: '4px 8px',
                            background: '#F8F9FA',
                            borderRadius: 4,
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{t.title}</span>
                          <span style={{ fontSize: 10, color: 'var(--muted)' }}>{t.estimatedHours || 8}h</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>
                      Disponible pour nouvelle affectation
                    </div>
                  )}
                </div>

                {/* Backup info */}
                {member.backup && (
                  <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 8, marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
                    🛡️ Back-up humain : <strong>{member.backup.name}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
