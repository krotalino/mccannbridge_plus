import { useState, useMemo } from 'react';
import { 
  Plus, Sparkles, Calendar as CalendarIcon, List, 
  Download, Layers, RefreshCw, BarChart2, ShieldCheck, 
  HelpCircle, ArrowLeft, CheckCircle2, TrendingUp 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ReportSummaryCards from './components/ReportSummaryCards';
import ReportFilters from './components/ReportFilters';
import ReportRequestsTable from './components/ReportRequestsTable';
import ReportCalendarView from './components/ReportCalendarView';
import NewReportRequestModal from './components/NewReportRequestModal';
import ReportTemplatesModal from './components/ReportTemplatesModal';
import ReportDetailView from './components/ReportDetailView';
import ReportExportModal from './components/ReportExportModal';

export default function ReportsPage() {
  const { 
    reports = [], 
    addReport, 
    updateReport, 
    updateReportStatus, 
    addReportComment, 
    addReportSpeech, 
    updateReportData, 
    deleteReport 
  } = useApp();

  const { currentUser, isAgency } = useAuth();

  // Navigation / View state
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [currentViewMode, setCurrentViewMode] = useState('list'); // 'list' | 'calendar'

  // Modals state
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [exportModalReport, setExportModalReport] = useState(null);
  const [prefilledTemplate, setPrefilledTemplate] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [activeStatusCardFilter, setActiveStatusCardFilter] = useState('all');

  // Currently selected report object
  const selectedReport = useMemo(() => {
    if (!selectedReportId) return null;
    return reports.find(r => r.id === selectedReportId) || null;
  }, [reports, selectedReportId]);

  // Handle card filter click
  const handleStatusCardFilterChange = (cardId) => {
    setActiveStatusCardFilter(cardId);
    if (cardId === 'all') {
      setSelectedStatus('all');
    } else if (cardId === 'to_process') {
      setSelectedStatus('submitted');
    } else if (cardId === 'in_production') {
      setSelectedStatus('in_production');
    } else if (cardId === 'internal_review') {
      setSelectedStatus('internal_review');
    } else if (cardId === 'client_review') {
      setSelectedStatus('client_review');
    } else if (cardId === 'delivered') {
      setSelectedStatus('delivered');
    } else if (cardId === 'late') {
      setSelectedPriority('urgente');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setActiveStatusCardFilter('all');
  };

  // Filtered reports calculation
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = r.id.toLowerCase().includes(query);
        const matchesTitle = r.title?.toLowerCase().includes(query);
        const matchesCampaign = r.context?.campaignName?.toLowerCase().includes(query);
        const matchesRequester = r.requester?.name?.toLowerCase().includes(query);
        const matchesAssignee = r.assignee?.name?.toLowerCase().includes(query);
        if (!matchesId && !matchesTitle && !matchesCampaign && !matchesRequester && !matchesAssignee) {
          return false;
        }
      }

      // Brand
      if (selectedBrand !== 'all') {
        if (!r.brands || !r.brands.includes(selectedBrand)) return false;
      }

      // Type
      if (selectedType !== 'all') {
        if (r.type !== selectedType) return false;
      }

      // Status
      if (selectedStatus !== 'all') {
        if (r.status !== selectedStatus) return false;
      }

      // Priority
      if (selectedPriority !== 'all') {
        if (r.priority !== selectedPriority) return false;
      }

      return true;
    });
  }, [reports, searchQuery, selectedBrand, selectedType, selectedStatus, selectedPriority]);

  // Quick Export list to CSV
  const handleExportFilteredCsv = () => {
    const headers = [
      'Référence', 'Titre', 'Type', 'Statut', 'Priorité', 
      'Marques', 'Demandeur', 'Analyste', 'Date Échéance', 'Date Livraison', 'Complétude'
    ];
    const rows = filteredReports.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.type,
      r.status,
      r.priority,
      `"${r.brands?.join(', ') || ''}"`,
      `"${r.requester?.name || ''}"`,
      `"${r.assignee?.name || ''}"`,
      r.dueDate || '',
      r.deliveredDate || '',
      `${r.briefCompleteness || 0}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rapports_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open creation from template
  const handleSelectTemplate = (template) => {
    setPrefilledTemplate(template);
    setIsTemplatesOpen(false);
    setIsNewRequestOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 animate-fadeIn">
      
      {/* If viewing a single report detail */}
      {selectedReport ? (
        <ReportDetailView
          report={selectedReport}
          onBack={() => setSelectedReportId(null)}
          onUpdateStatus={updateReportStatus}
          onAddComment={addReportComment}
          onAddSpeech={addReportSpeech}
          onUpdateData={updateReportData}
          onOpenExport={(rep) => setExportModalReport(rep)}
          isAgency={isAgency}
          currentUser={currentUser}
        />
      ) : (
        /* Main Dashboard & List View */
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-orange-600 text-white shadow-2xs">
                  <BarChart2 size={20} />
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Reporting & Insights Stratégiques
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Gouvernance des rapports de performance, calendrier des livraisons, analyses 360° et benchmark McCann × Orange Cameroun
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTemplatesOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Sparkles size={15} className="text-orange-500" />
                <span>Modèles Standardisés</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrefilledTemplate(null);
                  setIsNewRequestOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>Nouvelle Demande de Rapport</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <ReportSummaryCards
            reports={reports}
            activeStatusFilter={activeStatusCardFilter}
            onStatusFilterChange={handleStatusCardFilterChange}
          />

          {/* View Mode Switcher + Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center bg-gray-200/80 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCurrentViewMode('list')}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentViewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-2xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={14} />
                  <span>Vue Liste & Tableau</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentViewMode('calendar')}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentViewMode === 'calendar' 
                      ? 'bg-white text-gray-900 shadow-2xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CalendarIcon size={14} />
                  <span>Calendrier & Échéances SLA</span>
                </button>
              </div>

              <div className="text-xs text-gray-500 font-medium hidden sm:block">
                <span>{filteredReports.length}</span> demande(s) filtrée(s) sur un total de <span>{reports.length}</span>
              </div>
            </div>

            {/* Filters Bar (active in List view) */}
            {currentViewMode === 'list' && (
              <ReportFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedBrand={selectedBrand}
                onBrandChange={setSelectedBrand}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
                onReset={handleResetFilters}
                totalResults={filteredReports.length}
                onExportCsv={handleExportFilteredCsv}
              />
            )}
          </div>

          {/* Main View Area */}
          {currentViewMode === 'list' ? (
            <ReportRequestsTable
              reports={filteredReports}
              onSelectReport={(rep) => setSelectedReportId(rep.id)}
              onOpenWorkflow={(rep) => {
                setSelectedReportId(rep.id);
              }}
              onOpenExport={(rep) => setExportModalReport(rep)}
              onDeleteReport={deleteReport}
              isAgency={isAgency}
            />
          ) : (
            <ReportCalendarView
              reports={reports}
              onSelectReport={(rep) => setSelectedReportId(rep.id)}
            />
          )}

        </div>
      )}

      {/* MODAL 1: New Report Request */}
      <NewReportRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmitReport={addReport}
        currentUser={currentUser}
        prefilledTemplate={prefilledTemplate}
      />

      {/* MODAL 2: Report Templates Library */}
      <ReportTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* MODAL 3: Export & Sharing */}
      {exportModalReport && (
        <ReportExportModal
          isOpen={Boolean(exportModalReport)}
          onClose={() => setExportModalReport(null)}
          report={exportModalReport}
        />
      )}

    </div>
  );
}
