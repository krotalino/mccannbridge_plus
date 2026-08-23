import React from 'react';
import { getSlaCountdown } from '../../../utils/helpers';

export default function TrafficSmartAlerts({ tickets = [], onSelectTicket, onResolveBlockage }) {
  const alerts = [];

  // 1. Blocked tasks
  tickets.filter(t => t.blockage?.isBlocked).forEach(t => {
    alerts.push({
      id: `block-${t.id}`,
      type: 'critical',
      icon: '🚨',
      title: `Goulot d'étranglement actif : ${t.title} (${t.id})`,
      message: `Blocage signalé par ${t.blockage.reporter || 'Exécutant'} : "${t.blockage.reason}". Action requise du Traffic Manager.`,
      ticket: t,
      actionLabel: 'Débloquer',
      onAction: () => onResolveBlockage(t.id),
    });
  });

  // 2. Cold tasks (> 48h in production without progress update)
  tickets.filter(t => t.status === 'production' && t.progress < 50).forEach(t => {
    alerts.push({
      id: `cold-${t.id}`,
      type: 'warning',
      icon: '❄️',
      title: `Tâche froide en production : ${t.title} (${t.id})`,
      message: `La tâche est en production depuis plus de 48h sans progression significative (${t.progress}%). Relance automatique conseillée.`,
      ticket: t,
      actionLabel: 'Inspecter',
      onAction: () => onSelectTicket(t),
    });
  });

  // 3. Imminent deadlines (D <= 1 or passed)
  tickets.filter(t => t.status !== 'delivered' && t.daysLeft <= 1).forEach(t => {
    const isLate = t.daysLeft <= 0;
    alerts.push({
      id: `deadline-${t.id}`,
      type: isLate ? 'critical' : 'warning',
      icon: '⏳',
      title: `${isLate ? 'Deadline DÉPASSÉE' : 'Deadline imminente (J-1)'} : ${t.title}`,
      message: `Date limite fixée au ${t.deadline}. Statut actuel : ${t.status}.`,
      ticket: t,
      actionLabel: 'Accélérer',
      onAction: () => onSelectTicket(t),
    });
  });

  // 4. Client Review 48h SLA Alerts
  tickets.filter(t => t.status === 'client_review').forEach(t => {
    const sla = getSlaCountdown(t.clientReviewDeadline);
    alerts.push({
      id: `review-${t.id}`,
      type: sla.isPassed ? 'critical' : 'info',
      icon: '🟠',
      title: `Validation Client Orange en cours : ${t.title}`,
      message: sla.isPassed 
        ? `Le délai de 48h est expiré. Relance automatique de l'équipe Orange requise.` 
        : `Délai de réponse restant pour Orange Cameroun : ${sla.text}.`,
      ticket: t,
      actionLabel: 'Visualiser',
      onAction: () => onSelectTicket(t),
    });
  });

  // 5. Over-estimation > +20%
  tickets.filter(t => {
    const est = t.estimatedHours || 0;
    const log = t.loggedHours || 0;
    return est > 0 && ((log - est) / est) > 0.2;
  }).forEach(t => {
    const variance = Math.round(((t.loggedHours - t.estimatedHours) / t.estimatedHours) * 100);
    alerts.push({
      id: `overrun-${t.id}`,
      type: 'warning',
      icon: '⚠️',
      title: `Dépassement de charge (+${variance}%) : ${t.title}`,
      message: `Temps passé (${t.loggedHours}h) vs estimation initiale (${t.estimatedHours}h). Réévaluation recommandée.`,
      ticket: t,
      actionLabel: 'Auditer',
      onAction: () => onSelectTicket(t),
    });
  });

  return (
    <div className="card p-20 animate-fade" style={{ borderRadius: 12 }}>
      <div className="flex justify-between items-center mb-16">
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚡</span> SYSTÈME D'ALERTES & DÉTECTION INTELLIGENTE ({alerts.length})
          </h3>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            Surveillance continue des délais, des SLA contractuels et des goulets d'étranglement.
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="card p-24 text-center" style={{ background: '#F8F9FA' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>
            Aucune alerte critique active
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            Tous les flux de travail McCann ⇄ Orange Cameroun sont régulés et respectent les délais.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {alerts.map(alert => {
            const isCritical = alert.type === 'critical';
            const isWarning = alert.type === 'warning';

            return (
              <div
                key={alert.id}
                className="flex justify-between items-center flex-wrap gap-10"
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: isCritical ? '#FFF5F5' : isWarning ? '#FFFDF0' : '#F0F7FF',
                  borderLeft: `4px solid ${isCritical ? '#E74C3C' : isWarning ? '#F39C12' : '#2980B9'}`,
                  border: isCritical ? '1px solid #FFCDD2' : isWarning ? '1px solid #FFE082' : '1px solid #BBDEFB',
                }}
              >
                <div className="flex items-start gap-12" style={{ flex: 1 }}>
                  <span style={{ fontSize: 20 }}>{alert.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isCritical ? '#C62828' : isWarning ? '#E65100' : '#0D47A1' }}>
                      {alert.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--body)', marginTop: 2 }}>
                      {alert.message}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <button
                    className={`btn btn-sm ${isCritical ? 'btn-red' : isWarning ? 'btn-orange' : 'btn-blue'}`}
                    onClick={alert.onAction}
                  >
                    {alert.actionLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
