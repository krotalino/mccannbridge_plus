import { 
  FileText, Clock, AlertTriangle, CheckCircle2, UserCheck, 
  Send, Layers, TrendingUp, Sparkles 
} from 'lucide-react';
import { REPORT_STATUSES } from '../../../data/reportsData';

export default function ReportSummaryCards({ reports, activeStatusFilter, onStatusFilterChange }) {
  const total = reports.length;
  
  const toProcess = reports.filter(r => r.status === 'submitted' || r.status === 'qualified').length;
  const inProd = reports.filter(r => r.status === 'in_production' || r.status === 'needs_info').length;
  const internalReview = reports.filter(r => r.status === 'internal_review' || r.status === 'internal_fixes').length;
  const clientReview = reports.filter(r => r.status === 'client_review' || r.status === 'client_fixes').length;
  const approvedDelivered = reports.filter(r => r.status === 'approved' || r.status === 'delivered').length;
  
  // Late reports calculation
  const todayStr = new Date().toISOString().slice(0, 10);
  const lateReports = reports.filter(r => 
    r.status !== 'delivered' && 
    r.status !== 'cancelled' && 
    r.status !== 'approved' &&
    r.dueDate && r.dueDate < todayStr
  ).length;

  const urgentReports = reports.filter(r => r.priority === 'urgente' && r.status !== 'delivered' && r.status !== 'cancelled').length;
  const onTimeCount = reports.filter(r => r.status === 'delivered' || (r.dueDate && r.dueDate >= todayStr)).length;
  const slaRate = total > 0 ? Math.round((onTimeCount / total) * 100) : 100;

  const statusPills = [
    {
      id: 'all',
      label: 'Toutes les demandes',
      count: total,
      badge: 'Total',
      color: '#FF7900'
    },
    {
      id: 'submitted',
      label: 'À qualifier',
      count: toProcess,
      badge: 'Assignation',
      color: '#0099FF'
    },
    {
      id: 'in_production',
      label: 'En production',
      count: inProd,
      badge: 'Analyste',
      color: '#FF7900'
    },
    {
      id: 'internal_review',
      label: 'Revue Interne (QA)',
      count: internalReview,
      badge: 'Lead QA',
      color: '#E65100'
    },
    {
      id: 'client_review',
      label: 'Validation Client',
      count: clientReview,
      badge: 'Orange CM',
      color: '#F59E0B'
    },
    {
      id: 'delivered',
      label: 'Validés & Livrés',
      count: approvedDelivered,
      badge: 'Clôturés',
      color: '#28A745'
    },
    {
      id: 'late',
      label: 'Alertes SLA',
      count: lateReports + (urgentReports > 0 ? ` (${urgentReports} urg.)` : ''),
      badge: 'Prioritaire',
      color: '#DC3545'
    }
  ];

  return (
    <div className="space-y-4 mb-5">
      {/* 4-KPI Bandeau (Exactement le style Influence) */}
      <div className="grid grid-4 gap-12">
        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #FF7900', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Total Livrables Suivis</div>
          <div className="text-xl font-bold text-dark">
            {total} <span className="text-xs font-normal text-muted">rapports au registre</span>
          </div>
        </div>

        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #0099FF', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">En Production & Revue</div>
          <div className="text-xl font-bold" style={{ color: '#0099FF' }}>
            {inProd + internalReview + clientReview} <span className="text-xs font-normal text-muted">en cours de traitement</span>
          </div>
        </div>

        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #28A745', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Rapports Livrés & Validés</div>
          <div className="text-xl font-bold" style={{ color: '#28A745' }}>
            {approvedDelivered} <span className="text-xs font-normal text-muted">sur {total} livrables</span>
          </div>
        </div>

        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #6C757D', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Respect SLA & Délais</div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-dark">{slaRate}%</div>
            <div style={{ flex: 1, maxWidth: 90, height: 6, background: '#e0e0e0', borderRadius: 3, marginLeft: 10, overflow: 'hidden' }}>
              <div style={{ width: `${slaRate}%`, height: '100%', background: slaRate >= 80 ? '#28A745' : '#FF7900', borderRadius: 3 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick filter pills by workflow status */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg" style={{ background: '#fff', border: '1px solid #e8e8e8', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <span className="text-xs font-bold text-muted px-2">Filtrer par étape :</span>
        {statusPills.map(pill => {
          const isSelected = activeStatusFilter === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onStatusFilterChange(isSelected && pill.id !== 'all' ? 'all' : pill.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer"
              style={{
                background: isSelected ? pill.color : '#f8f9fa',
                color: isSelected ? '#ffffff' : '#495057',
                border: isSelected ? `1px solid ${pill.color}` : '1px solid #e9ecef',
                boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'
              }}
            >
              <span>{pill.label}</span>
              <span 
                className="px-1.5 py-0.2 rounded-full text-[10px] font-black"
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.3)' : '#e9ecef',
                  color: isSelected ? '#ffffff' : '#212529'
                }}
              >
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
