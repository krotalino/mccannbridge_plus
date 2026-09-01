import { 
  Eye, CheckCircle, Clock, AlertCircle, FileText, Download, 
  ExternalLink, User, Calendar, MoreVertical, ShieldAlert, Sparkles, Trash2 
} from 'lucide-react';
import { REPORT_STATUSES, REPORT_TYPES, BRANDS_LIST } from '../../../data/reportsData';

export default function ReportRequestsTable({
  reports,
  onSelectReport,
  onOpenWorkflow,
  onOpenExport,
  onDeleteReport,
  isAgency
}) {
  const getBrandChip = (brandName) => {
    const found = BRANDS_LIST.find(b => b.name === brandName);
    const color = found ? found.color : '#FF6600';
    return (
      <span
        key={brandName}
        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold text-white shadow-xs"
        style={{ backgroundColor: color + 'dd', border: `1px solid ${color}` }}
      >
        {brandName.replace('Orange ', '')}
      </span>
    );
  };

  const getTypeBadge = (typeId) => {
    const found = REPORT_TYPES.find(t => t.id === typeId);
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-200 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
        <span>{found?.icon || '📄'}</span>
        <span>{found?.label?.replace('Rapport ', '') || typeId}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority, reason) => {
    if (priority === 'urgente') {
      return (
        <span 
          className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.3)]"
          title={reason ? `Motif d'urgence : ${reason}` : 'Demande urgente SLA < 24h'}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Urgente
        </span>
      );
    }
    if (priority === 'haute') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FF6600]/20 text-[#FF8C00] border border-[#FF6600]/35">
          Haute
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        Normale
      </span>
    );
  };

  const getSlaIndicator = (dueDate, status, deliveredDate) => {
    if (status === 'delivered') {
      return (
        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
          <CheckCircle size={12} className="text-emerald-400" />
          Livré {deliveredDate ? `(${deliveredDate.slice(5)})` : ''}
        </span>
      );
    }
    if (!dueDate) return <span className="text-xs text-slate-500">—</span>;

    const today = new Date().toISOString().slice(0, 10);
    const isLate = dueDate < today;
    const isToday = dueDate === today;

    if (isLate) {
      return (
        <span className="text-[10px] font-black text-red-400 bg-red-500/20 px-2 py-0.5 rounded-md border border-red-500/30 flex items-center gap-1">
          <AlertCircle size={11} />
          Échu ({dueDate.slice(5)})
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1">
          <Clock size={11} />
          Aujourd'hui
        </span>
      );
    }

    return (
      <span className="text-[11px] text-slate-300 flex items-center gap-1 font-mono">
        <Calendar size={12} className="text-slate-400" />
        {dueDate}
      </span>
    );
  };

  if (reports.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl cosmic-glass-card border border-white/10">
        <FileText size={42} className="mx-auto text-slate-500 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Aucune demande trouvée</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Aucun rapport ne correspond à vos critères de recherche. Modifiez vos filtres ou créez une nouvelle demande.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl cosmic-glass-card border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-black/40 border-b border-white/10 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
              <th className="py-3.5 px-4">Réf & Titre</th>
              <th className="py-3.5 px-3">Type & Période</th>
              <th className="py-3.5 px-3">Marques & Périmètre</th>
              <th className="py-3.5 px-3">Demandeur / Analyste</th>
              <th className="py-3.5 px-3">Échéance SLA</th>
              <th className="py-3.5 px-3 text-center">Priorité</th>
              <th className="py-3.5 px-3">Statut Workflow</th>
              <th className="py-3.5 px-3 text-center">Complétude</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {reports.map((report) => {
              const statusCfg = REPORT_STATUSES[report.status] || REPORT_STATUSES.draft;
              return (
                <tr 
                  key={report.id}
                  className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                  onClick={() => onSelectReport(report)}
                >
                  {/* Reference & Title */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#FF6600] bg-[#FF6600]/15 px-2 py-0.5 rounded text-[11px] border border-[#FF6600]/30">
                        {report.id}
                      </span>
                      {report.version && (
                        <span className="text-[10px] text-slate-400 font-bold bg-white/5 px-1.5 py-0.5 rounded">
                          {report.version}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-white text-xs mt-1.5 line-clamp-1 group-hover:text-[#00D4FF] transition-colors">
                      {report.title}
                    </div>
                  </td>

                  {/* Type & Period */}
                  <td className="py-4 px-3">
                    <div className="mb-1">{getTypeBadge(report.type)}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 font-medium">
                      {report.period?.label || `${report.period?.start} au ${report.period?.end}`}
                    </div>
                  </td>

                  {/* Brands / BU */}
                  <td className="py-4 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[170px]">
                      {report.brands?.map(b => getBrandChip(b))}
                    </div>
                  </td>

                  {/* Requester & Assignee */}
                  <td className="py-4 px-3">
                    <div className="text-white font-semibold line-clamp-1 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 text-[9px] flex items-center justify-center font-bold">
                        {report.requester?.avatar || 'LN'}
                      </span>
                      <span>{report.requester?.name || 'Lauriane N.'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <span className="text-slate-500">→</span>
                      <span className="text-amber-300 font-semibold">{report.assignee?.name || 'Steve BESSOUBE'}</span>
                    </div>
                  </td>

                  {/* SLA Due Date */}
                  <td className="py-4 px-3">
                    {getSlaIndicator(report.dueDate, report.status, report.deliveredDate)}
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-3 text-center">
                    {getPriorityBadge(report.priority, report.urgentReason)}
                  </td>

                  {/* Workflow Status */}
                  <td className="py-4 px-3">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border shadow-xs"
                      style={{
                        backgroundColor: statusCfg.color + '20',
                        color: '#FFFFFF',
                        borderColor: statusCfg.color + '55'
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.color }}></span>
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Completeness meter */}
                  <td className="py-4 px-3 text-center">
                    <div className="inline-flex flex-col items-center gap-0.5">
                      <div className="w-12 bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/10">
                        <div 
                          className="bg-gradient-to-r from-[#00D4FF] to-emerald-400 h-full rounded-full transition-all"
                          style={{ width: `${report.briefCompleteness || 90}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">
                        {report.briefCompleteness || 90}%
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectReport(report)}
                        className="p-2 text-slate-300 hover:text-[#00D4FF] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        title="Consulter / Visualiser le rapport complet"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenWorkflow(report)}
                        className="p-2 text-slate-300 hover:text-[#FF6600] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        title="Gérer le workflow et validations"
                      >
                        <CheckCircle size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenExport(report)}
                        className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        title="Exporter en PDF / PowerPoint / CSV"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="py-3 px-5 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div>
          Affichage de <span className="font-bold text-white">{reports.length}</span> rapport(s) répertorié(s)
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Validé / Livré
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6600]"></span> Validation Client
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Revue Interne
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF]"></span> En production / Analyse
          </span>
        </div>
      </div>
    </div>
  );
}
