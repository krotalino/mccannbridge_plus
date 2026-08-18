import { 
  FileText, Clock, AlertTriangle, CheckCircle2, UserCheck, 
  Send, Layers, TrendingUp 
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
      icon: <Layers size={18} className="text-orange-500" />,
      bg: 'hover:border-orange-400',
      activeBorder: 'border-orange-500 bg-orange-50/40 text-orange-950',
      badge: 'Tous types',
      badgeColor: 'bg-gray-100 text-gray-700'
    },
    {
      id: 'to_process',
      label: 'À qualifier / traiter',
      count: toProcess,
      filterStatuses: ['submitted', 'qualified'],
      icon: <Send size={18} className="text-blue-500" />,
      bg: 'hover:border-blue-400',
      activeBorder: 'border-blue-500 bg-blue-50/40 text-blue-950',
      badge: 'Attente Assignation',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'in_production',
      label: 'En production',
      count: inProd,
      filterStatuses: ['in_production', 'needs_info'],
      icon: <TrendingUp size={18} className="text-amber-500" />,
      bg: 'hover:border-amber-400',
      activeBorder: 'border-amber-500 bg-amber-50/40 text-amber-950',
      badge: 'Analyste Steve B.',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'internal_review',
      label: 'Revue Interne McCann',
      count: internalReview,
      filterStatuses: ['internal_review', 'internal_fixes'],
      icon: <UserCheck size={18} className="text-yellow-600" />,
      bg: 'hover:border-yellow-400',
      activeBorder: 'border-yellow-500 bg-yellow-50/40 text-yellow-950',
      badge: 'Lead QA',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'client_review',
      label: 'En validation Client',
      count: clientReview,
      filterStatuses: ['client_review', 'client_fixes'],
      icon: <Clock size={18} className="text-orange-600" />,
      bg: 'hover:border-orange-400',
      activeBorder: 'border-orange-500 bg-orange-50/40 text-orange-950',
      badge: 'Action Orange',
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'delivered',
      label: 'Validés & Livrés',
      count: approvedDelivered,
      filterStatuses: ['approved', 'delivered'],
      icon: <CheckCircle2 size={18} className="text-green-600" />,
      bg: 'hover:border-green-400',
      activeBorder: 'border-green-500 bg-green-50/40 text-green-950',
      badge: 'Archivés officiels',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'late',
      label: 'En retard / Alertes SLA',
      count: lateReports + (urgentReports > 0 ? ` (${urgentReports} urgents)` : ''),
      numCount: lateReports + urgentReports,
      isAlert: true,
      filterStatuses: ['late_or_urgent'],
      icon: <AlertTriangle size={18} className="text-red-600" />,
      bg: 'hover:border-red-400',
      activeBorder: 'border-red-500 bg-red-50/50 text-red-950',
      badge: 'SLA < 48h',
      badgeColor: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
      {cards.map((c) => {
        const isSelected = activeStatusFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onStatusFilterChange(isSelected && c.id !== 'all' ? 'all' : c.id)}
            className={`flex flex-col text-left p-3.5 rounded-xl border bg-white shadow-xs transition-all duration-150 cursor-pointer ${
              isSelected ? c.activeBorder + ' shadow-sm ring-1 ring-orange-400' : 'border-gray-200 ' + c.bg
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">{c.icon}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${c.badgeColor}`}>
                {c.badge}
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 tracking-tight mt-1">
              {c.count}
            </div>
            <div className="text-xs text-gray-600 font-medium leading-tight mt-0.5 line-clamp-1">
              {c.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
