import { 
  Eye, CheckCircle, Clock, AlertCircle, FileText, Download, 
  ExternalLink, User, Calendar, MoreVertical, ShieldAlert, Sparkles 
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
    const color = found ? found.color : '#FF7900';
    return (
      <span
        key={brandName}
        className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold text-white shadow-2xs"
        style={{ backgroundColor: color }}
      >
        {brandName.replace('Orange ', '')}
      </span>
    );
  };

  const getTypeBadge = (typeId) => {
    const found = REPORT_TYPES.find(t => t.id === typeId);
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
        <span>{found?.icon || '📄'}</span>
        <span>{found?.label?.replace('Rapport ', '') || typeId}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority, reason) => {
    if (priority === 'urgente') {
      return (
        <span 
          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 animate-pulse"
          title={reason ? `Motif d'urgence : ${reason}` : 'Demande urgente SLA < 24h'}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          Urgente
        </span>
      );
    }
    if (priority === 'haute') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
          Haute
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Normale
      </span>
    );
  };

  const getSlaIndicator = (dueDate, status, deliveredDate) => {
    if (status === 'delivered') {
      return (
        <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
          <CheckCircle size={12} className="text-emerald-600" />
          Livré {deliveredDate ? `le ${deliveredDate.slice(5)}` : ''}
        </span>
      );
    }
    if (!dueDate) return <span className="text-xs text-gray-400">—</span>;

    const today = new Date().toISOString().slice(0, 10);
    const isLate = dueDate < today;
    const isToday = dueDate === today;

    if (isLate) {
      return (
        <span className="text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 flex items-center gap-1">
          <AlertCircle size={12} />
          Échu ({dueDate.slice(5)})
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
          <Clock size={12} />
          Aujourd'hui
        </span>
      );
    }

    return (
      <span className="text-[11px] text-gray-600 flex items-center gap-1 font-mono">
        <Calendar size={12} className="text-gray-400" />
        {dueDate}
      </span>
    );
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
        <FileText size={40} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-base font-semibold text-gray-800 mb-1">Aucune demande trouvée</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Aucun rapport ne correspond à vos critères de recherche. Modifiez vos filtres ou créez une nouvelle demande.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Réf & Titre</th>
              <th className="py-3 px-3">Type & Période</th>
              <th className="py-3 px-3">Marques & Périmètre</th>
              <th className="py-3 px-3">Demandeur / Analyste</th>
              <th className="py-3 px-3">Échéance SLA</th>
              <th className="py-3 px-3 text-center">Priorité</th>
              <th className="py-3 px-3">Statut Workflow</th>
              <th className="py-3 px-3 text-center">Complétude</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {reports.map((report) => {
              const statusCfg = REPORT_STATUSES[report.status] || REPORT_STATUSES.draft;
              return (
                <tr 
                  key={report.id}
                  className="hover:bg-orange-50/30 transition-colors group cursor-pointer"
                  onClick={() => onSelectReport(report)}
                >
                  {/* Reference & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-[11px] border border-orange-200/60">
                        {report.id}
                      </span>
                      {report.version && (
                        <span className="text-[10px] text-gray-400 font-medium">
                          {report.version}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-gray-900 text-xs mt-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {report.title}
                    </div>
                  </td>

                  {/* Type & Period */}
                  <td className="py-3.5 px-3">
                    <div className="mb-1">{getTypeBadge(report.type)}</div>
                    <div className="text-[11px] text-gray-500 line-clamp-1 font-medium">
                      {report.period?.label || `${report.period?.start} au ${report.period?.end}`}
                    </div>
                  </td>

                  {/* Brands / BU */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[170px]">
                      {report.brands?.map(b => getBrandChip(b))}
                    </div>
                  </td>

                  {/* Requester & Assignee */}
                  <td className="py-3.5 px-3">
                    <div className="text-gray-900 font-medium line-clamp-1 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[9px] flex items-center justify-center font-bold">
                        {report.requester?.avatar || 'LN'}
                      </span>
                      <span>{report.requester?.name || 'Lauriane N.'}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <span className="text-gray-400">→</span>
                      <span className="text-amber-800 font-medium">{report.assignee?.name || 'Steve BESSOUBE'}</span>
                    </div>
                  </td>

                  {/* SLA Due Date */}
                  <td className="py-3.5 px-3">
                    {getSlaIndicator(report.dueDate, report.status, report.deliveredDate)}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3 text-center">
                    {getPriorityBadge(report.priority, report.urgentReason)}
                  </td>

                  {/* Workflow Status */}
                  <td className="py-3.5 px-3">
                    <span 
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                      style={{
                        backgroundColor: statusCfg.bg,
                        color: statusCfg.color,
                        borderColor: statusCfg.color + '40'
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.color }}></span>
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Completeness meter */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex flex-col items-center gap-0.5">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${report.briefCompleteness || 90}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600">
                        {report.briefCompleteness || 90}%
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectReport(report)}
                        className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                        title="Consulter / Visualiser le rapport complet"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenWorkflow(report)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Gérer le workflow et validations"
                      >
                        <CheckCircle size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenExport(report)}
                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
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
      <div className="py-3 px-4 bg-gray-50/60 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
        <div>
          Affichage de <span className="font-semibold text-gray-800">{reports.length}</span> rapport(s) répertorié(s)
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Validé / Livré
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Validation Client
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Revue Interne
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> À traiter / En cours
          </span>
        </div>
      </div>
    </div>
  );
}
