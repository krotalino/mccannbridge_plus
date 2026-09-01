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

  const cards = [
    {
      id: 'all',
      label: 'Total Demandes',
      count: total,
      icon: <Layers size={16} className="text-[#FF6600]" />,
      borderActive: 'border-[#FF6600] bg-gradient-to-b from-[#FF6600]/20 to-[#1A1F4E]/90 text-white shadow-[0_0_20px_rgba(255,102,0,0.35)]',
      badge: 'Tous types',
      badgeClass: 'bg-white/10 text-slate-300'
    },
    {
      id: 'to_process',
      label: 'À qualifier',
      count: toProcess,
      filterStatuses: ['submitted', 'qualified'],
      icon: <Send size={16} className="text-[#00D4FF]" />,
      borderActive: 'border-[#00D4FF] bg-gradient-to-b from-[#00D4FF]/20 to-[#1A1F4E]/90 text-white shadow-[0_0_20px_rgba(0,212,255,0.35)]',
      badge: 'Attente Assign.',
      badgeClass: 'bg-[#00D4FF]/20 text-[#00D4FF]'
    },
    {
      id: 'in_production',
      label: 'En production',
      count: inProd,
      filterStatuses: ['in_production', 'needs_info'],
      icon: <TrendingUp size={16} className="text-[#FF8C00]" />,
      borderActive: 'border-[#FF8C00] bg-gradient-to-b from-[#FF8C00]/20 to-[#1A1F4E]/90 text-white shadow-[0_0_20px_rgba(255,140,0,0.35)]',
      badge: 'Analyste Steve',
      badgeClass: 'bg-[#FF8C00]/20 text-[#FF8C00]'
    },
    {
      id: 'internal_review',
      label: 'Revue Interne',
      count: internalReview,
      filterStatuses: ['internal_review', 'internal_fixes'],
      icon: <UserCheck size={16} className="text-amber-400" />,
      borderActive: 'border-amber-400 bg-gradient-to-b from-amber-500/20 to-[#1A1F4E]/90 text-white shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      badge: 'Lead QA',
      badgeClass: 'bg-amber-400/20 text-amber-300'
    },
    {
      id: 'client_review',
      label: 'Validation Client',
      count: clientReview,
      filterStatuses: ['client_review', 'client_fixes'],
      icon: <Clock size={16} className="text-[#FF6600]" />,
      borderActive: 'border-[#FF6600] bg-gradient-to-b from-[#FF6600]/25 to-[#1A1F4E]/90 text-white shadow-[0_0_20px_rgba(255,102,0,0.4)]',
      badge: 'Action Orange',
      badgeClass: 'bg-[#FF6600]/20 text-[#FF8C00]'
    },
    {
      id: 'delivered',
      label: 'Validés & Livrés',
      count: approvedDelivered,
      filterStatuses: ['approved', 'delivered'],
      icon: <CheckCircle2 size={16} className="text-emerald-400" />,
      borderActive: 'border-emerald-400 bg-gradient-to-b from-emerald-500/20 to-[#1A1F4E]/90 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      badge: 'Archivés',
      badgeClass: 'bg-emerald-400/20 text-emerald-300'
    },
    {
      id: 'late',
      label: 'Alertes SLA',
      count: lateReports + (urgentReports > 0 ? ` (${urgentReports})` : ''),
      numCount: lateReports + urgentReports,
      isAlert: true,
      filterStatuses: ['late_or_urgent'],
      icon: <AlertTriangle size={16} className="text-rose-400" />,
      borderActive: 'border-rose-500 bg-gradient-to-b from-rose-500/25 to-[#1A1F4E]/90 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]',
      badge: 'Prioritaires',
      badgeClass: 'bg-rose-500/20 text-rose-300'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
      {cards.map((c) => {
        const isSelected = activeStatusFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onStatusFilterChange(isSelected && c.id !== 'all' ? 'all' : c.id)}
            className={`flex flex-col text-left p-3.5 rounded-xl transition-all duration-200 cursor-pointer relative overflow-hidden ${
              isSelected 
                ? c.borderActive + ' border ring-1 ring-white/30' 
                : 'bg-black/35 border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                {c.icon}
              </span>
              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${c.badgeClass}`}>
                {c.badge}
              </span>
            </div>

            <div className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
              {c.count}
            </div>

            <div className="text-[11px] text-slate-400 font-semibold leading-tight mt-0.5 truncate">
              {c.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
