import React, { useState } from 'react';
import { POLES, TEAM } from '../../../data/team';
import { PRIORITY_LEVELS, TRAFFIC_STATUSES } from '../../../data/tickets';

export default function TrafficChronosTimeline({ tickets = [], onSelectTicket }) {
  const [selectedPole, setSelectedPole] = useState('all');

  // Generate next 14 days timeline
  const today = new Date();
  const timelineDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const isoDate = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const isFriday = d.getDay() === 5;
    const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    return { date: isoDate, label: dayLabel, isWeekend, isFriday, fullDate: d };
  });

  const activeTickets = tickets.filter(t => {
    if (t.status === 'delivered') return false;
    if (selectedPole !== 'all' && t.pole !== selectedPole) return false;
    return true;
  });

  // Calculate daily workload / deliveries count
  const dailyDeliveriesMap = {};
  timelineDays.forEach(day => {
    dailyDeliveriesMap[day.date] = activeTickets.filter(t => t.deadline === day.date);
  });

  const allMembers = [
    ...(TEAM.creatives || []),
    ...(TEAM.cdp || []),
    ...(TEAM.cm || []),
    ...(TEAM.specialists || []),
  ];

  return (
    <div className="card p-20 animate-fade" style={{ borderRadius: 12 }}>
      {/* Header & Filter */}
      <div className="flex justify-between items-center flex-wrap gap-12 mb-16">
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⏳</span> VUE CHRONOS & FRISE DES DEADLINES
          </h3>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            Superposition temporelle des livrables et détection proactive des pics de charge opérationnels.
          </div>
        </div>

        <div className="flex items-center gap-10">
          <span style={{ fontSize: 12, fontWeight: 700 }}>Filtrer par Pôle :</span>
          <select 
            className="form-control" 
            value={selectedPole} 
            onChange={e => setSelectedPole(e.target.value)}
            style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, minWidth: 160 }}
          >
            <option value="all">Tous les Pôles</option>
            {POLES.map(p => (
              <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Congestion Alert Bar if any day has >= 3 deliveries */}
      {timelineDays.some(day => dailyDeliveriesMap[day.date]?.length >= 3) && (
        <div className="alert alert-red mb-16" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🚨</span>
          <div style={{ fontSize: 12 }}>
            <strong>Pic de charge critique détecté :</strong> Certaines journées cumulent 3 livraisons ou plus simultanées. Vérifiez les assignations ou débloquez les goulets d'étranglement.
          </div>
        </div>
      )}

      {/* Horizontal Gantt Calendar Ribbon */}
      <div style={{ overflowX: 'auto', paddingBottom: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, minmax(130px, 1fr))', gap: 8, minWidth: 1100 }}>
          {timelineDays.map(day => {
            const dayTickets = dailyDeliveriesMap[day.date] || [];
            const isCongested = dayTickets.length >= 3;
            const isHeavy = dayTickets.length === 2;

            return (
              <div
                key={day.date}
                style={{
                  background: isCongested 
                    ? '#FFF5F5' 
                    : isHeavy 
                    ? '#FFFDF0' 
                    : day.isWeekend 
                    ? '#F4F5F7' 
                    : '#FFFFFF',
                  border: isCongested 
                    ? '2px solid #E74C3C' 
                    : isHeavy 
                    ? '1px solid #F39C12' 
                    : '1px solid #E0E0E0',
                  borderRadius: 10,
                  padding: 10,
                  minHeight: 280,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Day Header */}
                <div 
                  style={{ 
                    borderBottom: '1px solid rgba(0,0,0,0.06)', 
                    paddingBottom: 6, 
                    marginBottom: 8,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: day.isFriday ? '#FF7900' : 'var(--dark)' }}>
                    {day.label} {day.isFriday && '🏁'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                    {dayTickets.length === 0 ? 'Aucune livraison' : `${dayTickets.length} livraison(s)`}
                  </div>
                </div>

                {/* Tickets delivered on this day */}
                <div className="flex flex-col gap-6" style={{ flex: 1 }}>
                  {dayTickets.map(t => {
                    const statusConf = TRAFFIC_STATUSES.find(s => s.id === t.status) || TRAFFIC_STATUSES[0];
                    const priorityConf = PRIORITY_LEVELS[t.priority] || PRIORITY_LEVELS.p1_strategic;
                    const assignee = allMembers.find(m => m.id === t.assignee);

                    return (
                      <div
                        key={t.id}
                        onClick={() => onSelectTicket(t)}
                        style={{
                          background: '#FFFFFF',
                          border: `1px solid ${t.blockage?.isBlocked ? '#E74C3C' : '#DDD'}`,
                          borderLeft: `3px solid ${statusConf.color}`,
                          borderRadius: 6,
                          padding: 8,
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span style={{ fontSize: 9, fontWeight: 800, color: priorityConf.color }}>
                            {priorityConf.icon} {t.id}
                          </span>
                          <span style={{ fontSize: 9, color: 'var(--muted)' }}>
                            {t.progress}%
                          </span>
                        </div>

                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--dark)', lineHeight: 1.2, marginBottom: 4 }}>
                          {t.title}
                        </div>

                        <div className="flex justify-between items-center" style={{ fontSize: 9, color: 'var(--muted)' }}>
                          <span>{assignee ? assignee.name.split(' ')[0] : 'Non assigné'}</span>
                          <span>{t.estimatedHours || 8}h</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
