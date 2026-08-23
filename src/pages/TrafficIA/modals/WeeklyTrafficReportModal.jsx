import React from 'react';
import { formatCurrency } from '../../../utils/helpers';
import { POLES } from '../../../data/team';

export default function WeeklyTrafficReportModal({ tickets = [], onClose }) {
  const activeTickets = tickets.filter(t => t.status !== 'delivered');
  const deliveredTickets = tickets.filter(t => t.status === 'delivered');
  const blockedTickets = tickets.filter(t => t.blockage?.isBlocked);

  // Compute metrics
  const totalHoursLogged = tickets.reduce((sum, t) => sum + (t.loggedHours || 0), 0);
  const totalBudget = tickets.reduce((sum, t) => sum + (t.budget || 0), 0);
  
  // Punctuality rate (tickets with daysLeft >= 0 or delivered on time)
  const onTimeCount = tickets.filter(t => t.daysLeft >= 0).length;
  const punctualityRate = tickets.length > 0 ? Math.round((onTimeCount / tickets.length) * 100) : 100;

  // Average time by pole
  const poleStats = POLES.map(pole => {
    const poleTickets = tickets.filter(t => t.pole === pole.id);
    const totalEst = poleTickets.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const totalLog = poleTickets.reduce((sum, t) => sum + (t.loggedHours || 0), 0);
    return {
      ...pole,
      count: poleTickets.length,
      totalEst,
      totalLog,
      avgHours: poleTickets.length > 0 ? Math.round((totalLog / poleTickets.length) * 10) / 10 : 0,
    };
  }).filter(p => p.count > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content animate-fade" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 800, width: '92%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 14, padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', color: '#FFF' }}>
          <div className="flex justify-between items-center">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FF7900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Rapport d'Activité Hebdomadaire
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: '2px 0 0 0' }}>
                DIGEST TRAFFIC & FLUX OPÉRATIONNELS (McCann ⇄ Orange)
              </h2>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>
                Semaine en cours • Synchronisation des livrables et audit de rentabilité
              </div>
            </div>

            <div className="flex items-center gap-10">
              <button className="btn btn-ghost btn-sm" onClick={handlePrint} style={{ color: '#FFF', border: '1px solid rgba(255,255,255,0.3)' }}>
                🖨️ Imprimer / PDF
              </button>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 20, cursor: 'pointer' }}>
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }} className="flex flex-col gap-20">
          {/* Key KPI Blocks */}
          <div className="grid grid-4" style={{ gap: 12 }}>
            <div className="card p-14 text-center" style={{ background: '#F8F9FA' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>BRIEFS ENTRÉS</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
                {tickets.length}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Ce cycle</div>
            </div>

            <div className="card p-14 text-center" style={{ background: '#F8F9FA' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>LIVRABLES CLÔTURÉS</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green)', marginTop: 4 }}>
                {deliveredTickets.length}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>100% Validés</div>
            </div>

            <div className="card p-14 text-center" style={{ background: '#F8F9FA' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>TAUX RESPECT SLA</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: punctualityRate >= 90 ? 'var(--green)' : 'var(--orange)', marginTop: 4 }}>
                {punctualityRate}%
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Ponctualité globale</div>
            </div>

            <div className="card p-14 text-center" style={{ background: '#F8F9FA' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>VOLUME HORAIRE</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)', marginTop: 4 }}>
                {totalHoursLogged}h
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Heures trackées</div>
            </div>
          </div>

          {/* Breakdown per Pole */}
          <div className="card p-16">
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, color: 'var(--dark)' }}>
              🎯 Performance & Débit par Pôle Métier
            </div>
            <div className="flex flex-col gap-10">
              {poleStats.map(stat => (
                <div key={stat.id} className="flex justify-between items-center" style={{ padding: '8px 12px', background: '#F8F9FA', borderRadius: 8, fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{stat.icon}</span>
                    <strong style={{ color: 'var(--dark)' }}>{stat.label}</strong>
                    <span className="tag tag-blue" style={{ fontSize: 10 }}>{stat.count} ticket(s)</span>
                  </div>

                  <div className="flex items-center gap-16">
                    <span style={{ color: 'var(--muted)' }}>Temps moyen : <strong>{stat.avgHours}h / ticket</strong></span>
                    <span style={{ fontWeight: 700, color: 'var(--dark)' }}>Total : {stat.totalLog}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Major Bottlenecks Resolved / In Progress */}
          <div className="card p-16">
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: 'var(--dark)' }}>
              🚧 Suivi des Goulets d'Étranglement & Arbitrages
            </div>
            {blockedTickets.length > 0 ? (
              <div className="flex flex-col gap-8">
                {blockedTickets.map(b => (
                  <div key={b.id} className="alert alert-red" style={{ padding: 10, fontSize: 12 }}>
                    <strong>{b.title} ({b.id}) :</strong> {b.blockage.reason} (Signalé par {b.blockage.reporter})
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                ✓ Aucun blocage non résolu cette semaine. Tous les flux opérationnels sont fluides.
              </div>
            )}
          </div>

          {/* Financial summary */}
          <div className="card p-16" style={{ background: '#FFF8F2', border: '1px solid #FFE0B2' }}>
            <div className="flex justify-between items-center">
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#E65100' }}>VALORISATION BUDGÉTAIRE HEBDOMADAIRE</div>
                <div style={{ fontSize: 11, color: '#5D4037', marginTop: 2 }}>Montant total des livrables engagés et validés auprès d'Orange Cameroun</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#E65100' }}>
                {formatCurrency(totalBudget)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
