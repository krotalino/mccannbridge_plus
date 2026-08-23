import React from 'react';
import { PRIORITY_LEVELS, TRAFFIC_STATUSES } from '../../../data/tickets';
import { POLES } from '../../../data/team';

export default function TrafficDependenciesView({ tickets = [], onSelectTicket }) {
  // Find all tickets that have dependencies or are dependencies of other tickets
  const ticketsWithDependencies = tickets.filter(t => t.dependencies && t.dependencies.length > 0);
  const blockingTicketIds = new Set();
  tickets.forEach(t => {
    (t.dependencies || []).forEach(depId => blockingTicketIds.add(depId));
  });

  const parentTickets = tickets.filter(t => blockingTicketIds.has(t.id));

  return (
    <div className="card p-20 animate-fade" style={{ borderRadius: 12 }}>
      <div className="mb-16">
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🔗</span> MATRICE DES DÉPENDANCES & CHEMIN CRITIQUE
        </h3>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
          Identification automatique des tâches mères bloquantes et calcul de l'impact en chaîne sur les livrables finals.
        </div>
      </div>

      {parentTickets.length === 0 && ticketsWithDependencies.length === 0 ? (
        <div className="card p-24 text-center" style={{ background: '#F8F9FA' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>
            Aucune dépendance bloquante en cours
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            Tous les flux peuvent progresser en parallèle sans verrouillage inter-pôles.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {parentTickets.map(parent => {
            const childTickets = tickets.filter(t => (t.dependencies || []).includes(parent.id));
            const statusConf = TRAFFIC_STATUSES.find(s => s.id === parent.status) || TRAFFIC_STATUSES[0];
            const isCompleted = parent.status === 'delivered';
            const isParentBlocked = parent.blockage?.isBlocked || parent.daysLeft <= 0;

            return (
              <div 
                key={parent.id} 
                className="card p-16" 
                style={{ 
                  borderRadius: 10, 
                  borderLeft: `5px solid ${isParentBlocked ? '#E74C3C' : statusConf.color}`,
                  background: isParentBlocked ? '#FFF9F9' : '#FFFFFF',
                  border: isParentBlocked ? '1px solid #E74C3C' : '1px solid #E5E5E5',
                }}
              >
                {/* Parent Task Header */}
                <div className="flex justify-between items-center flex-wrap gap-10 mb-12">
                  <div className="flex items-center gap-8">
                    <span className="tag tag-red" style={{ fontSize: 11, fontWeight: 800 }}>TÂCHE MÈRE BLOQUANTE</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                      {parent.title} ({parent.id})
                    </span>
                  </div>

                  <div className="flex items-center gap-8">
                    <span style={{ fontSize: 11, color: statusConf.color, fontWeight: 700 }}>
                      {statusConf.icon} {statusConf.label} ({parent.progress}%)
                    </span>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => onSelectTicket(parent)}
                    >
                      Inspecter
                    </button>
                  </div>
                </div>

                {isParentBlocked && (
                  <div className="alert alert-red mb-12" style={{ padding: '8px 12px', fontSize: 12 }}>
                    🚨 <strong>Retard sur la tâche mère :</strong> {parent.daysLeft <= 0 ? 'Deadline dépassée' : parent.blockage?.reason}. Les {childTickets.length} tâche(s) fille(s) ci-dessous sont en attente directe.
                  </div>
                )}

                {/* Arrow connector */}
                <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, margin: '8px 0', paddingLeft: 12 }}>
                  ↓ Débloque les tâches filles suivantes :
                </div>

                {/* Child tickets list */}
                <div className="flex flex-col gap-8" style={{ paddingLeft: 16 }}>
                  {childTickets.map(child => {
                    const childStatus = TRAFFIC_STATUSES.find(s => s.id === child.status) || TRAFFIC_STATUSES[0];
                    const childPriority = PRIORITY_LEVELS[child.priority] || PRIORITY_LEVELS.p1_strategic;
                    const childPole = POLES.find(p => p.id === child.pole) || POLES[0];

                    return (
                      <div 
                        key={child.id}
                        onClick={() => onSelectTicket(child)}
                        className="flex justify-between items-center"
                        style={{
                          padding: '10px 14px',
                          background: '#F8F9FA',
                          borderRadius: 8,
                          border: '1px solid #EBEBEB',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="flex items-center gap-10">
                          <span style={{ fontSize: 14 }}>{childPole.icon}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)' }}>
                              {child.title} ({child.id})
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                              Deadline : {child.deadline} • {childPriority.label}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <span 
                            style={{ 
                              fontSize: 11, 
                              fontWeight: 700, 
                              color: isCompleted ? '#27AE60' : '#E65100' 
                            }}
                          >
                            {isCompleted ? '✓ Prêt à démarrer' : '⏳ En attente mère'}
                          </span>
                          <span className="tag tag-blue" style={{ fontSize: 10 }}>{childStatus.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
