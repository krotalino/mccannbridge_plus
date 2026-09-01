import { useState, useMemo } from 'react';
import { 
  Plus, Sparkles, Calendar as CalendarIcon, List, 
  Download, Layers, RefreshCw, BarChart2, ShieldCheck, 
  HelpCircle, ArrowLeft, CheckCircle2, TrendingUp, Cpu,
  Compass, Flame, Activity, LayoutDashboard, Globe, Zap
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
import ReportExecutiveCockpit from './components/ReportExecutiveCockpit';
import ReportAiInsightsStudio from './components/ReportAiInsightsStudio';

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
  const [activeModuleTab, setActiveModuleTab] = useState('cockpit'); // 'cockpit' | 'reports_list' | 'calendar' | 'ai_studio'

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

  const navTabs = [
    { id: 'cockpit', label: 'Cockpit Exécutif 360°', icon: <LayoutDashboard size={16} /> },
    { id: 'reports_list', label: `Registre des Rapports (${reports.length})`, icon: <List size={16} /> },
    { id: 'calendar', label: 'Calendrier & SLA', icon: <CalendarIcon size={16} /> },
    { id: 'ai_studio', label: 'IA Insights & Veille', icon: <Sparkles size={16} /> }
  ];

  return (
    <div className="cosmic-theme-root min-h-screen p-4 sm:p-6 lg:p-8 animate-fadeIn relative">
      
      {/* Floating particles aesthetic background lights */}
      <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full bg-[#00D4FF]/10 blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-20 right-1/4 w-96 h-96 rounded-full bg-[#FF6600]/10 blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

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
        /* Main Dashboard Experience */
        <div className="space-y-6 max-w-[1700px] mx-auto">
          
          {/* Top Cosmic Navigation Header */}
          <div className="p-6 rounded-3xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-[#00D4FF] p-[2px] shadow-[0_0_20px_rgba(255,102,0,0.4)]">
                <div className="w-full h-full bg-[#0A0E27] rounded-2xl flex items-center justify-center">
                  <BarChart2 size={24} className="text-[#00D4FF]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Reporting & Insights Stratégiques
                  </h1>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 tracking-wider">
                    Next-Gen Analytics
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Gouvernance des livrables de performance, cockpit exécutif, calendrier SLA et analyses concurrentielles McCann × Orange Cameroun
                </p>
              </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 w-full xl:w-auto overflow-x-auto">
              {navTabs.map(tab => {
                const isActive = activeModuleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModuleTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive 
                        ? 'cosmic-tab-active shadow-md' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Primary Action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch xl:self-auto justify-end">
              <button
                type="button"
                onClick={() => setIsTemplatesOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl cosmic-btn-glass text-slate-200 hover:text-white text-xs font-bold cursor-pointer"
              >
                <Sparkles size={15} className="text-[#00D4FF]" />
                <span>Modèles Standardisés</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrefilledTemplate(null);
                  setIsNewRequestOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl cosmic-btn-primary text-xs font-black shadow-lg cursor-pointer"
              >
                <Plus size={16} />
                <span>Nouvelle Demande</span>
              </button>
            </div>

          </div>

          {/* TAB 1: EXECUTIVE COCKPIT 360° */}
          {activeModuleTab === 'cockpit' && (
            <div className="space-y-6 animate-fadeIn">
              <ReportExecutiveCockpit
                reports={reports}
                onSelectReport={(rep) => setSelectedReportId(rep.id)}
                onCreateReport={() => {
                  setPrefilledTemplate(null);
                  setIsNewRequestOpen(true);
                }}
              />
            </div>
          )}

          {/* TAB 2: REGISTRY & LIST VIEW */}
          {activeModuleTab === 'reports_list' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Metric Summary Cards */}
              <ReportSummaryCards
                reports={reports}
                activeStatusFilter={activeStatusCardFilter}
                onStatusFilterChange={handleStatusCardFilterChange}
              />

              {/* Filters Bar */}
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

              {/* Table */}
              <ReportRequestsTable
                reports={filteredReports}
                onSelectReport={(rep) => setSelectedReportId(rep.id)}
                onOpenWorkflow={(rep) => setSelectedReportId(rep.id)}
                onOpenExport={(rep) => setExportModalReport(rep)}
                onDeleteReport={deleteReport}
                isAgency={isAgency}
              />
            </div>
          )}

          {/* TAB 3: CALENDAR & SLA */}
          {activeModuleTab === 'calendar' && (
            <div className="space-y-6 animate-fadeIn">
              <ReportCalendarView
                reports={reports}
                onSelectReport={(rep) => setSelectedReportId(rep.id)}
              />
            </div>
          )}

          {/* TAB 4: AI INSIGHTS STUDIO */}
          {activeModuleTab === 'ai_studio' && (
            <div className="space-y-6 animate-fadeIn">
              <ReportAiInsightsStudio
                reports={reports}
                onSelectReport={(rep) => setSelectedReportId(rep.id)}
              />
            </div>
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
