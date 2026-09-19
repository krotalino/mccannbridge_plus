import { 
  Eye, CheckCircle, Clock, AlertCircle, FileText, Download, 
  Calendar, Trash2
} from 'lucide-react';
import { REPORT_STATUSES, REPORT_TYPES, BRANDS_LIST } from '../../../data/reportsData';

export default function ReportRequestsTable({
  reports = [],
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
        className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold"
        style={{ backgroundColor: color + '15', color: color, border: `1px solid ${color}35` }}
      >
        {brandName.replace('Orange ', '')}
      </span>
    );
  };

  const getTypeBadge = (typeId) => {
    const found = REPORT_TYPES.find(t => t.id === typeId);
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-dark bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
        <span>{found?.icon || '📄'}</span>
        <span>{found?.label?.replace('Rapport ', '') || typeId}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority, reason) => {
    if (priority === 'urgente') {
      return (
        <span 
          className="tag"
          style={{ background: 'rgba(220, 53, 69, 0.12)', color: 'var(--red)', fontSize: 10, fontWeight: 700 }}
          title={reason ? `Motif d'urgence : ${reason}` : 'Demande urgente SLA < 24h'}
        >
          🔥 Urgente
        </span>
      );
    }
    if (priority === 'haute') {
      return (
        <span 
          className="tag"
          style={{ background: 'rgba(255, 121, 0, 0.12)', color: 'var(--orange)', fontSize: 10, fontWeight: 700 }}
        >
          ⚡ Haute
        </span>
      );
    }
    return (
      <span 
        className="tag"
        style={{ background: 'rgba(40, 167, 69, 0.12)', color: 'var(--green)', fontSize: 10, fontWeight: 700 }}
      >
        Standard
      </span>
    );
  };

  const getSlaIndicator = (dueDate, status, deliveredDate) => {
    if (status === 'delivered') {
      return (
        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
          <CheckCircle size={13} className="text-green-600" />
          Livré {deliveredDate ? `(${deliveredDate.slice(5)})` : ''}
        </span>
      );
    }
    if (!dueDate) return <span className="text-xs text-muted">—</span>;

    const today = new Date().toISOString().slice(0, 10);
    const isLate = dueDate < today;
    const isToday = dueDate === today;

    if (isLate) {
      return (
        <span className="tag" style={{ background: 'rgba(220, 53, 69, 0.12)', color: 'var(--red)', fontSize: 10, fontWeight: 700 }}>
          <AlertCircle size={11} className="inline mr-1" />
          Échu ({dueDate.slice(5)})
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="tag" style={{ background: 'rgba(255, 193, 7, 0.2)', color: '#856404', fontSize: 10, fontWeight: 700 }}>
          <Clock size={11} className="inline mr-1" />
          Aujourd'hui
        </span>
      );
    }

    return (
      <span className="text-xs text-dark flex items-center gap-1 font-medium">
        <Calendar size={12} className="text-muted" />
        {dueDate}
      </span>
    );
  };

  if (reports.length === 0) {
    return (
      <div className="card p-24 text-center" style={{ background: '#FFF', borderRadius: 12, border: '1px solid #E0E0E0' }}>
        <FileText size={40} className="mx-auto text-muted mb-3 opacity-40" />
        <h3 className="text-base font-bold text-dark mb-1">Aucune demande trouvée</h3>
        <p className="text-xs text-muted max-w-md mx-auto">
          Aucun rapport ne correspond à vos filtres. Modifiez vos critères de recherche ou réinitialisez la sélection.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: '#FFF', borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden' }}>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
              <th className="py-12 px-14 text-xs font-bold text-muted uppercase tracking-wider text-left">Réf & Titre</th>
              <th className="py-12 px-10 text-xs font-bold text-muted uppercase tracking-wider text-left">Type & Période</th>
              <th className="py-12 px-10 text-xs font-bold text-muted uppercase tracking-wider text-left">Périmètre / Marques</th>
              <th className="py-12 px-10 text-xs font-bold text-muted uppercase tracking-wider text-left">Demandeur / Analyste</th>
              <th className="py-12 px-10 text-xs font-bold text-muted uppercase tracking-wider text-left">Échéance SLA</th>
              <th className="py-12 px-10 text-xs font-bold text-muted uppercase tracking-wider text-center">Priorité</th>
              <th className="py-12 px-10 text-xs font-bold text-muted uppercase tracking-wider text-left">Statut Workflow</th>
              <th className="py-12 px-10 text-xs font-bold text-muted uppercase tracking-wider text-center">Complétude</th>
              <th className="py-12 px-14 text-xs font-bold text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const statusCfg = REPORT_STATUSES[report.status] || REPORT_STATUSES.draft;
              return (
                <tr 
                  key={report.id}
                  className="border-b transition-colors cursor-pointer"
                  style={{ borderColor: '#F0F0F0' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF8F2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => onSelectReport(report)}
                >
                  {/* Reference & Title */}
                  <td className="py-12 px-14">
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-mono font-bold text-xs px-2 py-0.5 rounded"
                        style={{ background: '#FFF0E5', color: '#FF7900', border: '1px solid #FFD0B3' }}
                      >
                        {report.id}
                      </span>
                      {report.version && (
                        <span className="text-[10px] text-muted font-bold bg-gray-100 px-1.5 py-0.5 rounded">
                          {report.version}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-dark text-sm mt-1 line-clamp-1 hover:text-[#FF7900] transition-colors">
                      {report.title}
                    </div>
                  </td>

                  {/* Type & Period */}
                  <td className="py-12 px-10">
                    <div className="mb-1">{getTypeBadge(report.type)}</div>
                    <div className="text-xs text-muted line-clamp-1">
                      {report.period?.label || `${report.period?.start} au ${report.period?.end}`}
                    </div>
                  </td>

                  {/* Brands */}
                  <td className="py-12 px-10">
                    <div className="flex flex-wrap gap-1 max-w-[170px]">
                      {report.brands?.map(b => getBrandChip(b))}
                    </div>
                  </td>

                  {/* Requester & Assignee */}
                  <td className="py-12 px-10">
                    <div className="text-dark font-semibold text-xs flex items-center gap-1.5">
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px]"
                        style={{ background: '#0099FF20', color: '#0099FF', border: '1px solid #0099FF40' }}
                      >
                        {report.requester?.avatar || 'LN'}
                      </span>
                      <span>{report.requester?.name || 'Lauriane N.'}</span>
                    </div>
                    <div className="text-xs text-muted flex items-center gap-1 mt-1">
                      <span>→</span>
                      <span className="text-dark font-semibold">{report.assignee?.name || 'Steve BESSOUBE'}</span>
                    </div>
                  </td>

                  {/* SLA Due Date */}
                  <td className="py-12 px-10">
                    {getSlaIndicator(report.dueDate, report.status, report.deliveredDate)}
                  </td>

                  {/* Priority */}
                  <td className="py-12 px-10 text-center">
                    {getPriorityBadge(report.priority, report.urgentReason)}
                  </td>

                  {/* Workflow Status */}
                  <td className="py-12 px-10">
                    <span 
                      className="tag"
                      style={{
                        backgroundColor: statusCfg.color + '15',
                        color: statusCfg.color,
                        border: `1px solid ${statusCfg.color}35`,
                        fontSize: 11,
                        fontWeight: 700
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" style={{ backgroundColor: statusCfg.color }}></span>
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Completeness meter */}
                  <td className="py-12 px-10 text-center">
                    <div className="inline-flex flex-col items-center gap-0.5">
                      <div className="w-14 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${report.briefCompleteness || 90}%`,
                            backgroundColor: (report.briefCompleteness || 90) >= 80 ? '#27AE60' : '#FF7900'
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-muted">
                        {report.briefCompleteness || 90}%
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-12 px-14 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onSelectReport(report)}
                        className="btn btn-ghost"
                        style={{ padding: '6px 8px', borderRadius: 6, color: '#2980B9' }}
                        title="Consulter le rapport complet"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenWorkflow(report)}
                        className="btn btn-ghost"
                        style={{ padding: '6px 8px', borderRadius: 6, color: '#FF7900' }}
                        title="Gérer le workflow et validations"
                      >
                        <CheckCircle size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenExport(report)}
                        className="btn btn-ghost"
                        style={{ padding: '6px 8px', borderRadius: 6, color: '#27AE60' }}
                        title="Télécharger / Exporter"
                      >
                        <Download size={15} />
                      </button>
                      {isAgency && onDeleteReport && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Supprimer la demande "${report.title}" ?`)) {
                              onDeleteReport(report.id);
                            }
                          }}
                          className="btn btn-ghost"
                          style={{ padding: '6px 8px', borderRadius: 6, color: 'var(--red)' }}
                          title="Supprimer ce rapport"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
