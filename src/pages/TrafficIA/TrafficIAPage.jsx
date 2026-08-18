import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TEAM } from '../../data/team';
import { CALENDAR_HISTORY, WEEKEND_DUTY } from '../../data/calendar';
import { calcScore, getScoreColor, getCreativeLoad, getLoadColor, getFridayCountdown } from '../../utils/helpers';

export default function TrafficIAPage() {
  const { tickets, updateTicketStatus, reassignTicket, addNotification } = useApp();
  const [tab, setTab] = useState('priority');
  const [, setTick] = useState(0);
  const sortedTickets = [...tickets].sort((a, b) => calcScore(b) - calcScore(a));

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const countdown = getFridayCountdown();
  const punctuality = Math.round((CALENDAR_HISTORY.filter(h => h.deliveredOnTime).length / CALENDAR_HISTORY.length) * 100);

  const autoAssign = (ticketId) => {
    const loads = TEAM.creatives.map(c => ({ ...c, load: getCreativeLoad(c.id, tickets, TEAM.creatives) }));
    const available = loads.filter(c => c.load < 80).sort((a, b) => a.load - b.load);
    if (available.length > 0) {
      reassignTicket(ticketId, available[0].id, available[0].name);
    } else {
      addNotification('Tous les créatifs sont saturés !', 'warning');
    }
  };

  const georgesLoad = getCreativeLoad('georges', tickets, TEAM.creatives);
  const jourdainLoad = getCreativeLoad('jourdain', tickets, TEAM.creatives);

  const tabs = [
    { id: 'priority', label: 'File prioritaire' },
    { id: 'friday', label: 'Deadline Vendredi' },
    { id: 'overload', label: 'Alertes surcharge' },
    { id: 'waves', label: 'Waves' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-4">🤖 Traffic IA — Moteur central</h1>
      <p className="text-base text-muted mb-20">
        Priorisation automatique • Dispatch créatifs • Alertes prédictives — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div className="tab-bar">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab-item ${tab === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {/* AI Briefing */}
      <div className="ai-banner mb-20">
        <strong>🤖 BRIEFING IA — </strong>
        {sortedTickets.length} tickets actifs. {sortedTickets.filter(t => calcScore(t) >= 80).length} en zone rouge.
        {georgesLoad >= 85 && jourdainLoad < 70 && ' Recommandation : réassigner B044 de Georges → Jourdain.'}
        {tickets.filter(t => !t.assignee).length > 0 && ` ${tickets.filter(t => !t.assignee).length} ticket(s) non assigné(s).`}
      </div>

      {tab === 'priority' && (
        <div>
          {/* Friday Countdown Badge */}
          <div className={`card flex items-center gap-16 mb-16`} style={{ background: countdown.isPassed ? '#FFEBEE' : '#E8F5E9' }}>
            <div style={{ flex: 1 }}>
              <div className="text-sm font-bold" style={{ color: countdown.isPassed ? 'var(--red)' : 'var(--green)' }}>Délai Vendredi 17h</div>
              <div className="text-md font-bold" style={{ color: countdown.isPassed ? 'var(--red)' : 'var(--green)' }}>{countdown.days}j {countdown.hours}h {countdown.minutes}min</div>
            </div>
            <div className="text-right text-sm text-muted">Ponctualité: <strong className="text-dark">{punctuality}%</strong></div>
          </div>

          {/* Creative Load */}
          <div className="grid grid-4 mb-20">
            {TEAM.creatives.map(c => {
              const load = getCreativeLoad(c.id, tickets, TEAM.creatives);
              const color = getLoadColor(load);
              const count = tickets.filter(t => t.assignee === c.id && t.status !== 'livre').length;
              return (
                <div key={c.id} className="card" style={{ borderLeft: `4px solid ${color}` }}>
                  <div className="flex items-center gap-8 mb-8">
                    <div className="avatar avatar-sm" style={{ background: 'var(--dark)' }}>{c.avatar}</div>
                    <div>
                      <div className="text-sm font-bold text-dark">{c.name.split(' ')[0]}</div>
                      <div className="text-xs text-muted">{c.specialty}</div>
                    </div>
                  </div>
                  <div className="progress-track progress-track-lg mb-4">
                    <div className="progress-fill" style={{ background: color, width: `${load}%` }} />
                  </div>
                  <div className="text-xs text-muted">{count} ticket(s) actif(s){c.capacity < 100 ? ' • Part-time' : ''}</div>
                  {load >= 85 && <div className="text-xs text-red font-bold mt-8">🚫 Saturé</div>}
                </div>
              );
            })}
          </div>

          {/* Priority Queue */}
          <h2 className="text-lg font-bold text-dark mb-12">File de priorité IA</h2>
          <div className="flex flex-col gap-8">
            {sortedTickets.map(ticket => {
              const score = calcScore(ticket);
              const scoreColor = getScoreColor(score);
              const creative = TEAM.creatives.find(c => c.id === ticket.assignee);
              return (
                <div key={ticket.id} className="card traffic-ticket-card" style={{ borderLeft: `4px solid ${scoreColor}` }}>
                  <div className="traffic-score-col">
                    <div style={{ fontSize: 22, fontWeight: 700, color: scoreColor }}>{score}</div>
                    <div className="text-xs text-muted">/ 100</div>
                  </div>
                  <div className="traffic-info-col">
                    <div className="flex items-center gap-8 mb-4" style={{ flexWrap: 'wrap' }}>
                      <span className="text-base font-bold text-dark">{ticket.id} — {ticket.title}</span>
                      {ticket.blocksCalendar && <span className="tag tag-red">Bloque calendrier</span>}
                      <span className={`tag ${ticket.priority === 'critique' ? 'tag-red' : ticket.priority === 'urgente' ? 'tag-yellow' : 'tag-green'}`}>{ticket.priority}</span>
                    </div>
                    <div className="flex gap-4 mb-4">
                      {['visuel', 'copie', 'cta', 'sponsoValide'].map(k => (
                        <div key={k} className={`checklist-dot ${ticket.checklist[k] ? 'done' : 'pending'}`}>
                          {ticket.checklist[k] ? '✓' : ''}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-muted">
                      Deadline: {ticket.deadline} ({ticket.daysLeft}j) • Budget: {(ticket.budget / 1000).toFixed(0)}K • {ticket.segment}
                    </div>
                    <div className="flex items-center gap-8 mt-8">
                      <div className="progress-track" style={{ flex: 1 }}><div className="progress-fill" style={{ background: 'var(--blue)', width: `${ticket.progress}%` }} /></div>
                      <span className="text-xs text-muted">{ticket.progress}%</span>
                    </div>
                  </div>
                  <div className="traffic-actions-col">
                    {creative ? (
                      <div className="flex items-center gap-6">
                        <div className="avatar avatar-sm" style={{ background: 'var(--dark)' }}>{creative.avatar}</div>
                        <span className="text-sm">{creative.name.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <button onClick={() => autoAssign(ticket.id)} className="btn btn-orange btn-sm">🤖 Auto-assigner</button>
                    )}
                    <div className="flex gap-4 traffic-btn-group">
                      {ticket.status === 'attente' && <button onClick={() => updateTicketStatus(ticket.id, 'production')} className="btn btn-ghost btn-sm">Démarrer</button>}
                      {ticket.status === 'production' && <button onClick={() => updateTicketStatus(ticket.id, 'validation')} className="btn btn-ghost btn-sm">→ Validation</button>}
                      {ticket.status === 'validation' && <button onClick={() => updateTicketStatus(ticket.id, 'livre')} className="btn btn-green btn-sm">✓ Livré</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reassignment suggestion */}
          {georgesLoad >= 80 && jourdainLoad < 70 && (
            <div className="alert alert-yellow mt-16" style={{ padding: 16 }}>
              <div className="font-bold text-orange mb-4">🤖 SUGGESTION DE RÉASSIGNATION</div>
              <p className="text-sm mb-8">Georges est à {georgesLoad}% de charge. Jourdain est à {jourdainLoad}%. Transférer <strong>B044 (B2B LinkedIn)</strong> → Jourdain libère Georges pour B040 (critique).</p>
              <div className="flex gap-8">
                <button onClick={() => reassignTicket('B044', 'jourdain', 'Jourdain SONGUE')} className="btn btn-orange btn-sm">✓ Appliquer</button>
                <button onClick={() => addNotification('Suggestion ignorée', 'info')} className="btn btn-ghost btn-sm">Ignorer</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'friday' && (
        <div>
          <div className="countdown-hero mb-20">
            <div className="text-md font-semibold" style={{ opacity: 0.9, marginBottom: 12 }}>Délai jusqu'à validation Vendredi 17h</div>
            <div className="countdown-value">{countdown.days}j {countdown.hours}h {countdown.minutes}m</div>
            <div className="text-sm" style={{ opacity: 0.8, marginTop: 8 }}>{countdown.isPassed ? 'Deadline dépassée!' : 'Temps pour finaliser et livrer'}</div>
          </div>
          <h2 className="text-lg font-bold text-dark mb-12">Historique de ponctualité</h2>
          <div className="card mb-20">
            {CALENDAR_HISTORY.map(h => (
              <div key={h.week} className="flex items-center gap-12" style={{ paddingBottom: 12, borderBottom: '1px solid #e0e0e0', marginBottom: 12 }}>
                <div className="text-sm font-bold" style={{ minWidth: 60 }}>{h.week}</div>
                <div className="progress-track" style={{ flex: 1, height: 20 }}>
                  <div className="progress-fill" style={{ width: h.deliveredOnTime ? '100%' : '50%', background: h.deliveredOnTime ? 'var(--green)' : 'var(--red)' }} />
                </div>
                <div className="text-sm" style={{ minWidth: 120 }}>{h.deliveredOnTime ? 'À l\'heure' : 'Retard'} • {h.deliveryDay}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ background: '#E8F5E9', borderLeft: '4px solid var(--green)' }}>
            <div className="text-base font-bold text-green mb-4">Taux de ponctualité global</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)' }}>{punctuality}%</div>
            <div className="text-sm mt-8">Basé sur {CALENDAR_HISTORY.length} semaines</div>
          </div>
        </div>
      )}

      {tab === 'overload' && (
        <div>
          {(() => {
            const alerts = [];
            TEAM.creatives.forEach(c => {
              const load = getCreativeLoad(c.id, tickets, TEAM.creatives);
              const blocking = tickets.filter(t => t.assignee === c.id && t.blocksCalendar && t.status !== 'livre');
              if (load >= 85 && blocking.length > 0) alerts.push({ creative: c, load, blockingTickets: blocking });
            });
            return alerts.length > 0 ? (
              <div>
                <div className="alert alert-red mb-20" style={{ padding: 16 }}>
                  <div className="font-bold text-red">⚠ TOP PRIORITY — Surcharges détectées</div>
                  <div className="text-sm mt-4">Des créatifs à &gt;85% de capacité ont des tickets bloquant le calendrier.</div>
                </div>
                {alerts.map(a => (
                  <div key={a.creative.id} className="card mb-16" style={{ borderLeft: '4px solid var(--red)' }}>
                    <div className="flex items-center gap-12 mb-12">
                      <div className="avatar avatar-md" style={{ background: 'var(--dark)' }}>{a.creative.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div className="text-base font-bold text-dark">{a.creative.name}</div>
                        <div className="text-sm font-bold text-red">{a.load}% de capacité</div>
                      </div>
                      <button onClick={() => addNotification(`Alerte client envoyée pour ${a.creative.name}`, 'success')} className="btn btn-red btn-sm">Alerter le client</button>
                    </div>
                    {a.blockingTickets.map(t => (
                      <div key={t.id} className="flex justify-between items-center" style={{ padding: 8, background: '#fafafa', borderRadius: 4, marginBottom: 6, fontSize: 11 }}>
                        <div><strong>{t.id}</strong> — {t.title}</div>
                        <div className="text-muted">{t.progress}% • Deadline: {t.deadline}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center" style={{ background: '#E8F5E9' }}>
                <div className="text-sm font-semibold text-green">✓ Toutes les charges sont équilibrées!</div>
              </div>
            );
          })()}
        </div>
      )}

      {tab === 'waves' && (
        <div>
          <h2 className="text-lg font-bold text-dark mb-12">Distribution par vague (S15)</h2>
          {['jeudi_am', 'jeudi_pm', 'vendredi_am', 'vendredi_pm'].map(wave => {
            const items = tickets.filter(t => t.wave === wave.replace('_am', '').replace('_pm', ''));
            const waveLabel = wave === 'jeudi_am' ? 'Jeudi matin' : wave === 'jeudi_pm' ? 'Jeudi après-midi' : wave === 'vendredi_am' ? 'Vendredi matin' : 'Vendredi après-midi';
            return (
              <div key={wave} className="card mb-16">
                <div className="text-base font-bold text-dark mb-12">{waveLabel}</div>
                {items.length > 0 ? items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center" style={{ paddingBottom: 8, borderBottom: idx < items.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: 8 }}>
                    <div>
                      <div className="text-sm font-semibold text-dark">{item.id}</div>
                      <div className="text-xs text-muted">{item.title}</div>
                    </div>
                    <span className={`tag ${item.status === 'production' ? 'tag-blue' : item.status === 'livre' ? 'tag-green' : 'tag-yellow'}`}>
                      {item.status}
                    </span>
                  </div>
                )) : <div className="text-sm text-muted">Aucun item</div>}
              </div>
            );
          })}
          <div className="duty-card mt-20">
            <div className="flex items-center gap-12">
              <div style={{ fontSize: 24 }}>🌙</div>
              <div>
                <div className="text-sm font-bold">{WEEKEND_DUTY.onDuty.name} — Astreinte {WEEKEND_DUTY.currentWeek}</div>
                <div className="text-sm" style={{ marginTop: 4 }}>Backup: {WEEKEND_DUTY.backup.name}</div>
                <div className="text-xs" style={{ marginTop: 6, opacity: 0.8 }}>Heures: {WEEKEND_DUTY.hours}</div>
                <div className="text-xs" style={{ marginTop: 4 }}>{WEEKEND_DUTY.tasks.map((t, i) => <div key={i}>• {t}</div>)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
