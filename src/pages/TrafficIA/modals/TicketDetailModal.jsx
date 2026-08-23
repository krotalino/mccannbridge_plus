import React, { useState, useEffect } from 'react';
import { TRAFFIC_STATUSES, PRIORITY_LEVELS } from '../../../data/tickets';
import { TEAM, POLES } from '../../../data/team';
import { formatCurrency, calcScore, getScoreColor, getSlaCountdown, getCreativeLoad } from '../../../utils/helpers';

export default function TicketDetailModal({
  ticket,
  onClose,
  currentRole,
  activeExecutantId,
  onUpdateStatus,
  onReassign,
  onUpdateTicket,
  onReportBlockage,
  onResolveBlockage,
  onLogHours,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [hoursToAdd, setHoursToAdd] = useState('');
  
  // QA rejection state
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Client revision state
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);

  // Blockage modal state
  const [blockageReason, setBlockageReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  // SLA Countdowns
  const qualificationSla = getSlaCountdown(ticket.qualificationDeadline);
  const clientReviewSla = getSlaCountdown(ticket.clientReviewDeadline);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleSaveTimerTime = () => {
    if (timerSeconds >= 60) {
      const additionalHours = Math.round((timerSeconds / 3600) * 10) / 10;
      onLogHours(ticket.id, additionalHours, ticket.loggedHours || 0);
      setTimerSeconds(0);
      setIsTimerRunning(false);
    }
  };

  const handleAddManualHours = (e) => {
    e.preventDefault();
    const num = parseFloat(hoursToAdd);
    if (!isNaN(num) && num > 0) {
      onLogHours(ticket.id, num, ticket.loggedHours || 0);
      setHoursToAdd('');
    }
  };

  // Find assigned member
  const allMembers = [
    ...(TEAM.creatives || []),
    ...(TEAM.cdp || []),
    ...(TEAM.cm || []),
    ...(TEAM.specialists || []),
  ];
  const assignedMember = allMembers.find(m => m.id === ticket.assignee);
  const backupMember = allMembers.find(m => m.id === ticket.backupId || m.id === assignedMember?.backupId);
  const reviewerMember = TEAM.directors?.find(d => d.id === ticket.reviewerId) || TEAM.cdp?.find(c => c.id === ticket.reviewerId);

  // Calculation of estimation variance
  const estimated = ticket.estimatedHours || 0;
  const logged = ticket.loggedHours || 0;
  const variance = estimated > 0 ? Math.round(((logged - estimated) / estimated) * 100) : 0;
  const isOverEstimated = variance > 20;

  // AI recommendations for assignment
  const recommendedProfiles = allMembers
    .filter(m => m.id !== ticket.assignee)
    .map(m => ({
      ...m,
      load: getCreativeLoad(m.id, [ticket], TEAM),
      isPoleMatch: m.pole === ticket.pole,
    }))
    .sort((a, b) => (b.isPoleMatch ? 1 : 0) - (a.isPoleMatch ? 1 : 0) || a.load - b.load)
    .slice(0, 3);

  const priorityConf = PRIORITY_LEVELS[ticket.priority] || PRIORITY_LEVELS.p1_strategic;
  const statusConf = TRAFFIC_STATUSES.find(s => s.id === ticket.status) || TRAFFIC_STATUSES[0];
  const poleConf = POLES.find(p => p.id === ticket.pole) || POLES[0];

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content animate-fade" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 880, width: '94%', maxHeight: '90vh', overflowY: 'auto', padding: 0, borderRadius: 14 }}
      >
        {/* Header */}
        <div 
          style={{ 
            padding: '20px 24px', 
            background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', 
            color: '#FFFFFF',
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.15)' }}>
                  {ticket.id}
                </span>
                <span 
                  style={{ 
                    fontSize: 11, 
                    fontWeight: 700, 
                    padding: '2px 8px', 
                    borderRadius: 4, 
                    background: priorityConf.bg, 
                    color: priorityConf.color 
                  }}
                >
                  {priorityConf.icon} {priorityConf.label}
                </span>
                <span 
                  style={{ 
                    fontSize: 11, 
                    fontWeight: 700, 
                    padding: '2px 8px', 
                    borderRadius: 4, 
                    background: statusConf.color, 
                    color: '#FFFFFF' 
                  }}
                >
                  {statusConf.icon} {statusConf.label}
                </span>
                {ticket.blockage?.isBlocked && (
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: '#E74C3C', color: '#FFF' }}>
                    🚨 BLOCAGE SIGNALÉ
                  </span>
                )}
                {ticket.revisionCount > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: '#E65100', color: '#FFF' }}>
                    🔄 Révision V{ticket.revisionCount + 1}
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
                {ticket.title}
              </h2>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                {ticket.brand || 'Orange Cameroun'} • Demandeur : <strong>{ticket.demandeur?.name || 'Orange Team'}</strong> • Deadline : <strong>{ticket.deadline}</strong>
              </div>
            </div>

            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 20, cursor: 'pointer', padding: 4 }}
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs inside Modal */}
          <div style={{ display: 'flex', gap: 6, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, overflowX: 'auto' }}>
            {[
              { id: 'overview', label: '📋 Aperçu & Brief' },
              { id: 'time', label: '⏱️ Temps & Chrono' },
              { id: 'assign', label: '🤖 Dispatch & IA' },
              { id: 'qa', label: '🔍 Contrôle QA Interne' },
              { id: 'client', label: '👁️ Validation Client' },
              { id: 'dependencies', label: '🔗 Dépendances' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  background: activeTab === t.id ? 'rgba(255, 121, 0, 0.3)' : 'transparent',
                  border: activeTab === t.id ? '1px solid #FF7900' : '1px solid transparent',
                  color: activeTab === t.id ? '#FF9D3D' : 'rgba(255,255,255,0.7)',
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 24 }}>
          {/* Active Blockage Alert Banner */}
          {ticket.blockage?.isBlocked && (
            <div 
              className="alert alert-red mb-20"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 14 }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#C62828' }}>
                  🚨 BLOCAGE OPÉRATIONNEL ACTIF
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>
                  <strong>Motif :</strong> {ticket.blockage.reason}
                </div>
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                  Signalé par {ticket.blockage.reporter || 'Exécutant'} • Date : {ticket.blockage.date ? new Date(ticket.blockage.date).toLocaleString('fr-FR') : 'Récemment'}
                </div>
              </div>
              {(currentRole === 'traffic_manager' || currentRole === 'responsable_pole') && (
                <button 
                  className="btn btn-green btn-sm"
                  onClick={() => onResolveBlockage(ticket.id)}
                >
                  ✓ Débloquer le ticket
                </button>
              )}
            </div>
          )}

          {/* TAB 1: OVERVIEW & BRIEF */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-16">
              {/* Quick Status Bar with Step Advance */}
              <div className="card" style={{ background: '#F8F9FA', padding: 14, borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Statut actuel : </span>
                    <strong style={{ fontSize: 13, color: statusConf.color }}>{statusConf.label}</strong>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{statusConf.desc}</div>
                  </div>

                  {/* Actions according to Role */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {ticket.status === 'backlog' && (currentRole === 'traffic_manager' || currentRole === 'responsable_pole') && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => onUpdateStatus(ticket.id, 'cadrage')}
                      >
                        📐 Passer en Cadrage & Estimation
                      </button>
                    )}

                    {ticket.status === 'cadrage' && (currentRole === 'traffic_manager' || currentRole === 'responsable_pole') && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => onUpdateStatus(ticket.id, 'ready')}
                      >
                        ⚡ Valider le Cadrage → Prêt à produire
                      </button>
                    )}

                    {ticket.status === 'ready' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => onUpdateStatus(ticket.id, 'production')}
                      >
                        🚀 Démarrer la Production
                      </button>
                    )}

                    {ticket.status === 'production' && (
                      <button 
                        className="btn btn-purple btn-sm"
                        onClick={() => onUpdateStatus(ticket.id, 'internal_review')}
                      >
                        🔍 Envoyer en Contrôle Qualité Interne
                      </button>
                    )}

                    {ticket.status === 'internal_review' && (currentRole === 'traffic_manager' || currentRole === 'responsable_pole') && (
                      <button 
                        className="btn btn-blue btn-sm"
                        onClick={() => onUpdateStatus(ticket.id, 'client_review', { clientReviewDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString() })}
                      >
                        👁️ Valider QA → Livrer pour avis Orange (48h)
                      </button>
                    )}

                    {ticket.status === 'client_review' && (currentRole === 'demandeur' || currentRole === 'traffic_manager') && (
                      <button 
                        className="btn btn-green btn-sm"
                        onClick={() => onUpdateStatus(ticket.id, 'delivered')}
                      >
                        ✅ Valider & Clôturer le Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-3" style={{ gap: 12 }}>
                <div className="card" style={{ padding: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>PÔLE / MÉTIER</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{poleConf.icon}</span> {poleConf.label}
                  </div>
                </div>

                <div className="card" style={{ padding: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>ASSIGNÉ PRINCIPAL</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {assignedMember ? (
                      <>
                        <div className="avatar avatar-sm" style={{ background: '#1A1A2E', color: '#FFF' }}>{assignedMember.avatar}</div>
                        <span>{assignedMember.name}</span>
                      </>
                    ) : (
                      <span style={{ color: '#E74C3C' }}>Non assigné</span>
                    )}
                  </div>
                </div>

                <div className="card" style={{ padding: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>BUDGET ALLOUÉ</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)', marginTop: 4 }}>
                    {formatCurrency(ticket.budget || 0)}
                  </div>
                </div>
              </div>

              {/* Deliverables & Assets */}
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: 'var(--dark)' }}>
                  📦 Livrables associés ({ticket.deliverables?.length || 0})
                </div>
                {ticket.deliverables && ticket.deliverables.length > 0 ? (
                  <div className="flex flex-col gap-8">
                    {ticket.deliverables.map((del, i) => (
                      <div key={i} className="flex justify-between items-center" style={{ padding: '8px 12px', background: '#F8F9FA', borderRadius: 8, fontSize: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{del.type === 'video' ? '🎬' : del.type === 'image' ? '🖼️' : '📄'}</span>
                          <span style={{ fontWeight: 600 }}>{del.name}</span>
                          <span style={{ fontSize: 10, color: 'var(--muted)' }}>({del.size || 'HD'})</span>
                        </div>
                        <span className="tag tag-green" style={{ fontSize: 10 }}>Prêt pour revue</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
                    Aucun fichier exporté pour le moment.
                  </div>
                )}
              </div>

              {/* Blockage button for Executant */}
              {!ticket.blockage?.isBlocked && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-red btn-sm"
                    onClick={() => setIsBlocking(true)}
                  >
                    🚨 Signaler un blocage sur ce ticket
                  </button>
                </div>
              )}

              {/* Sub-form to trigger blockage */}
              {isBlocking && (
                <div className="card" style={{ border: '1px solid #E74C3C', background: '#FFF5F5', padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#C62828', marginBottom: 6 }}>
                    Déclarer un blocage au Traffic Manager
                  </div>
                  <textarea
                    rows={2}
                    className="form-control mb-8"
                    placeholder="Précisez la raison (ex: brief incomplet, asset vidéo manquant, bug d'API, dépendance bloquée)..."
                    value={blockageReason}
                    onChange={e => setBlockageReason(e.target.value)}
                    style={{ fontSize: 12 }}
                  />
                  <div className="flex gap-8">
                    <button 
                      className="btn btn-red btn-sm"
                      disabled={!blockageReason.trim()}
                      onClick={() => {
                        onReportBlockage(ticket.id, blockageReason, assignedMember?.name || 'Exécutant');
                        setIsBlocking(false);
                        setBlockageReason('');
                      }}
                    >
                      Transmettre l'alerte immédiate
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setIsBlocking(false)}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TIME TRACKING & CHRONO */}
          {activeTab === 'time' && (
            <div className="flex flex-col gap-16">
              {/* Over-estimation Alert if > +20% */}
              {isOverEstimated && (
                <div className="alert alert-yellow" style={{ padding: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#E65100' }}>
                    ⚠️ ALERTE SOUS-ESTIMATION ({variance > 0 ? `+${variance}%` : `${variance}%`})
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Le temps passé ({logged}h) dépasse l'estimation initiale ({estimated}h) de plus de 20%. Le Traffic Manager est notifié pour ajuster le planning ou renégocier avec le client Orange.
                  </div>
                </div>
              )}

              {/* Timer Live Tracker */}
              <div className="card" style={{ background: '#1A1A2E', color: '#FFF', padding: 20, textAlign: 'center', borderRadius: 12 }}>
                <div style={{ fontSize: 12, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Minuteur d'Exécution en Direct
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'monospace', margin: '10px 0', color: isTimerRunning ? '#FF7900' : '#FFF' }}>
                  {String(Math.floor(timerSeconds / 3600)).padStart(2, '0')}:
                  {String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0')}:
                  {String(timerSeconds % 60).padStart(2, '0')}
                </div>
                <div className="flex justify-center gap-10">
                  {!isTimerRunning ? (
                    <button 
                      className="btn btn-orange"
                      onClick={() => setIsTimerRunning(true)}
                    >
                      ▶ Démarrer le chrono
                    </button>
                  ) : (
                    <button 
                      className="btn btn-yellow"
                      onClick={() => setIsTimerRunning(false)}
                    >
                      ⏸ Mettre en pause
                    </button>
                  )}
                  {timerSeconds >= 60 && (
                    <button 
                      className="btn btn-green"
                      onClick={handleSaveTimerTime}
                    >
                      💾 Enregistrer le temps (+{Math.round((timerSeconds / 3600) * 10) / 10}h)
                    </button>
                  )}
                </div>
              </div>

              {/* Comparison Stats */}
              <div className="grid grid-2" style={{ gap: 14 }}>
                <div className="card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>TEMPS ESTIMÉ</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
                    {estimated} heures
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Fiche charge de production</div>
                </div>

                <div className="card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>TEMPS RÉEL TRACKÉ</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: isOverEstimated ? '#E74C3C' : 'var(--blue)', marginTop: 4 }}>
                    {logged} heures
                  </div>
                  <div style={{ fontSize: 11, color: isOverEstimated ? '#E74C3C' : 'var(--muted)', marginTop: 2 }}>
                    Écart : {variance > 0 ? `+${variance}%` : `${variance}%`}
                  </div>
                </div>
              </div>

              {/* Manual Time Logging */}
              <form onSubmit={handleAddManualHours} className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--dark)' }}>
                  Ajouter manuellement des heures passées
                </div>
                <div className="flex gap-8">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="40"
                    className="form-control"
                    placeholder="Ex: 2.5 heures"
                    value={hoursToAdd}
                    onChange={e => setHoursToAdd(e.target.value)}
                    style={{ maxWidth: 200, fontSize: 13 }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    + Ajouter au journal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SMART DISPATCH & IA */}
          {activeTab === 'assign' && (
            <div className="flex flex-col gap-16">
              <div className="card" style={{ background: '#FFF8F2', border: '1px solid #FFE0B2', padding: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#E65100', marginBottom: 4 }}>
                  🤖 RECOMMANDATION IA DU SMART ROUTING
                </div>
                <div style={{ fontSize: 12, color: '#5D4037' }}>
                  L'algorithme de régulation analyse la compétence métier requise (<strong>{poleConf.label}</strong>), le niveau d'occupation hebdomadaire et le Bus Factor pour proposer les profils optimaux.
                </div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                Profils recommandés pour ce ticket :
              </div>

              <div className="flex flex-col gap-10">
                {recommendedProfiles.map(prof => {
                  const isSaturated = prof.load >= 85;
                  return (
                    <div 
                      key={prof.id} 
                      className="card flex items-center justify-between"
                      style={{ padding: 12, borderLeft: `4px solid ${isSaturated ? '#E74C3C' : '#27AE60'}` }}
                    >
                      <div className="flex items-center gap-10">
                        <div className="avatar avatar-md" style={{ background: '#1A1A2E', color: '#FFF' }}>{prof.avatar}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                            {prof.name} {prof.isPoleMatch && <span className="tag tag-green" style={{ fontSize: 9 }}>Expertise Pôle</span>}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                            {prof.role} • Spécialité : {prof.specialty}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-12">
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: isSaturated ? '#E74C3C' : '#27AE60' }}>
                            {prof.load}% de charge
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                            {isSaturated ? 'Charge critique' : 'Disponible'}
                          </div>
                        </div>

                        {currentRole === 'traffic_manager' && (
                          <button
                            className="btn btn-orange btn-sm"
                            onClick={() => onReassign(ticket.id, prof.id, prof.name, { assigneeRole: prof.role, backupId: prof.backupId || null })}
                          >
                            Assigner
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bus Factor Human Backup */}
              {backupMember && (
                <div className="card" style={{ padding: 14, background: '#F8F9FA' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                    🛡️ Plan de Continuité (Bus Factor Back-up)
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--body)' }}>
                    En cas d'absence ou d'urgence de <strong>{assignedMember?.name}</strong>, le back-up humain préconfiguré est <strong>{backupMember.name}</strong> ({backupMember.role}).
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INTERNAL QA REVIEW */}
          {activeTab === 'qa' && (
            <div className="flex flex-col gap-16">
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8, color: 'var(--dark)' }}>
                  Revue Qualité Interne (Directeur Créa & CDP Lead)
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                  Validation obligatoire avant que le livrable ne soit rendu accessible au client Orange.
                </div>

                {ticket.internalReviewNotes && (
                  <div className="card mb-12" style={{ background: '#F8F9FA', padding: 12, fontSize: 12 }}>
                    <strong>Notes de revue :</strong> {ticket.internalReviewNotes}
                  </div>
                )}

                {/* QA Checklist */}
                <div className="flex flex-col gap-8 mb-16">
                  {[
                    { key: 'briefValid', label: 'Conformité au brief stratégique' },
                    { key: 'visuel', label: 'Respect de la charte graphique Orange & DA' },
                    { key: 'copie', label: 'Wording, orthographe & mentions légales' },
                    { key: 'cta', label: 'CTA et format optimisé pour les canaux cibles' },
                  ].map(chk => (
                    <label key={chk.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!ticket.checklist?.[chk.key]}
                        onChange={(e) => {
                          const updated = { ...(ticket.checklist || {}), [chk.key]: e.target.checked };
                          onUpdateTicket(ticket.id, { checklist: updated });
                        }}
                      />
                      <span>{chk.label}</span>
                    </label>
                  ))}
                </div>

                {/* QA Sign-off buttons */}
                {(currentRole === 'responsable_pole' || currentRole === 'traffic_manager') && (
                  <div className="flex gap-10">
                    <button 
                      className="btn btn-green"
                      onClick={() => onUpdateStatus(ticket.id, 'client_review', {
                        internalReviewNotes: `Approuvé par ${currentRole === 'responsable_pole' ? 'le Directeur de Création' : 'le Traffic Manager'} le ${new Date().toLocaleDateString('fr-FR')}`,
                        clientReviewDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
                      })}
                    >
                      ✓ Valider QA & Transmettre à Orange (48h)
                    </button>

                    <button 
                      className="btn btn-red btn-sm"
                      onClick={() => setIsRejecting(!isRejecting)}
                    >
                      ✕ Refuser & Retour Production
                    </button>
                  </div>
                )}

                {/* Rejection comment form */}
                {isRejecting && (
                  <div className="card mt-12" style={{ border: '1px solid #E74C3C', background: '#FFF5F5', padding: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#C62828', marginBottom: 6 }}>
                      Commentaire obligatoire pour le retour en production :
                    </div>
                    <textarea
                      rows={3}
                      className="form-control mb-8"
                      placeholder="Précisez les corrections exigées (ex: recadrage du logo, contraste des textes)..."
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      style={{ fontSize: 12 }}
                    />
                    <div className="flex gap-8">
                      <button 
                        className="btn btn-red btn-sm"
                        disabled={!rejectReason.trim()}
                        onClick={() => {
                          onUpdateStatus(ticket.id, 'production', {
                            internalReviewNotes: `Refusé en QA : ${rejectReason}`,
                            progress: 50,
                          });
                          setIsRejecting(false);
                          setRejectReason('');
                        }}
                      >
                        Confirmer le renvoi en production
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setIsRejecting(false)}>
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CLIENT ORANGE VALIDATION */}
          {activeTab === 'client' && (
            <div className="flex flex-col gap-16">
              {/* 48h Countdown Banner */}
              <div 
                className="card" 
                style={{ 
                  background: clientReviewSla.isPassed ? '#FFEBEE' : '#E3F2FD', 
                  borderLeft: `4px solid ${clientReviewSla.isPassed ? '#E74C3C' : '#1E88E5'}`,
                  padding: 14 
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 13, color: clientReviewSla.isPassed ? '#C62828' : '#0D47A1' }}>
                  ⏳ DÉLAI DE VALIDATION CLIENT (SLA 48H)
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  {clientReviewSla.isPassed 
                    ? `Le délai de validation client a expiré. Une relance automatique a été émise.`
                    : `Temps restant pour le retour client : ${clientReviewSla.text}.`}
                </div>
              </div>

              {/* Secure Preview Player */}
              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                    👁️ Visualiseur Sécurisé de Livrable (Sans téléchargement brut)
                  </div>
                  <span className="tag tag-blue" style={{ fontSize: 10 }}>Mode Stream Sécurisé</span>
                </div>

                <div 
                  style={{ 
                    height: 220, 
                    background: '#1A1A2E', 
                    borderRadius: 8, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#FFF',
                    padding: 20,
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🎥</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{ticket.deliverables?.[0]?.name || `${ticket.title} (Export)`}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>Watermark McCann × Orange Cameroun • Visualisation en flux continu</div>
                </div>

                {/* Validation Actions for Orange */}
                {(currentRole === 'demandeur' || currentRole === 'traffic_manager') && (
                  <div className="flex gap-10 mt-16">
                    <button 
                      className="btn btn-green"
                      onClick={() => onUpdateStatus(ticket.id, 'delivered', { progress: 100 })}
                    >
                      ✅ Approuver & Valider le Livrable Final
                    </button>

                    <button 
                      className="btn btn-orange btn-sm"
                      onClick={() => setIsRequestingRevision(!isRequestingRevision)}
                    >
                      🔄 Demander des ajustements (V{(ticket.revisionCount || 0) + 2})
                    </button>
                  </div>
                )}

                {/* Revision Form */}
                {isRequestingRevision && (
                  <div className="card mt-12" style={{ border: '1px solid #E65100', background: '#FFF8F2', padding: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#E65100', marginBottom: 6 }}>
                      Formuler les ajustements demandés par Orange :
                    </div>
                    <textarea
                      rows={3}
                      className="form-control mb-8"
                      placeholder="Indiquez clairement les modifications souhaitées..."
                      value={revisionFeedback}
                      onChange={e => setRevisionFeedback(e.target.value)}
                      style={{ fontSize: 12 }}
                    />
                    <div className="flex gap-8">
                      <button 
                        className="btn btn-orange btn-sm"
                        disabled={!revisionFeedback.trim()}
                        onClick={() => {
                          const newRevCount = (ticket.revisionCount || 0) + 1;
                          const newHistory = [
                            ...(ticket.revisionHistory || []),
                            {
                              date: new Date().toISOString().split('T')[0],
                              author: currentRole === 'demandeur' ? 'Lauriane NGAMENI (Orange)' : 'Demandeur Orange',
                              comment: revisionFeedback,
                              version: `V${newRevCount + 1}`,
                            }
                          ];
                          onUpdateStatus(ticket.id, 'revisions', {
                            revisionCount: newRevCount,
                            revisionHistory: newHistory,
                            progress: Math.max(50, (ticket.progress || 80) - 20),
                          });
                          setIsRequestingRevision(false);
                          setRevisionFeedback('');
                        }}
                      >
                        Envoyer le retour de révision
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setIsRequestingRevision(false)}>
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: DEPENDENCIES & CRITICAL PATH */}
          {activeTab === 'dependencies' && (
            <div className="flex flex-col gap-16">
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                  🔗 Dépendances & Anti-blocage
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                  Si une tâche mère est retardée, le système ajuste automatiquement les dates cibles de la chaîne.
                </div>

                {ticket.dependencies && ticket.dependencies.length > 0 ? (
                  <div className="flex flex-col gap-8">
                    {ticket.dependencies.map(depId => (
                      <div key={depId} className="flex justify-between items-center" style={{ padding: 10, background: '#F8F9FA', borderRadius: 8, fontSize: 12 }}>
                        <div>
                          <strong>Prédécesseur : {depId}</strong>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Ce ticket ne peut pas être finalisé tant que {depId} n'est pas validé.</div>
                        </div>
                        <span className="tag tag-orange">Tâche bloquante</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
                    Aucune dépendance active. Ce ticket peut être produit en parallèle.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
