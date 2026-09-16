import { useState, useMemo } from 'react';
import { 
  FileText, Calendar, Sparkles, BarChart2, TrendingUp, 
  Plus, Search, Filter, Download, Layers, Settings, 
  Shield, CheckCircle2, Clock, AlertTriangle, ArrowLeft, 
  Database, Brain, Share2, Eye, RefreshCw, ChevronRight,
  MapPin, Mail, Hash, Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { REPORT_STATUSES, REPORT_TYPES, BRANDS_LIST } from '../../data/reportsData';

// Sub-components aligned with the Influence design system
import ReportExecutiveCockpit from './components/ReportExecutiveCockpit';
import ReportSummaryCards from './components/ReportSummaryCards';
import ReportFilters from './components/ReportFilters';
import ReportRequestsTable from './components/ReportRequestsTable';
import ReportDetailView from './components/ReportDetailView';
import ReportCalendarView from './components/ReportCalendarView';
import ReportDataStudio from './components/ReportDataStudio';
import ReportBenchmarkInsights from './components/ReportBenchmarkInsights';
import ReportLibraryView from './components/ReportLibraryView';
import ReportTemplatesView from './components/ReportTemplatesView';
import ReportAdminSettings from './components/ReportAdminSettings';
import NewReportRequestModal from './components/NewReportRequestModal';
import ReportExportModal from './components/ReportExportModal';

export default function ReportsPage() {
  const { 
    state, 
    addReport, 
    updateReport, 
    updateReportStatus, 
    addReportComment, 
    addReportSpeech, 
    updateReportData, 
    deleteReport 
  } = useApp();

  const reports = state?.reports || [];
  const currentUser = state?.currentUser || { user: 'Steve BESSOUBE', poste: 'Digital Web Analyst & Media' };
  const isAgency = state?.viewMode === 'agency' || (currentUser?.role || '').toLowerCase().includes('agency') || true;

  // 7 numbered tabs matching the exact Influence design architecture
  const tabs = [
    { id: 'demandes', label: '1. Registre des Demandes' },
    { id: 'cockpit', label: '2. Cockpit Exécutif 360°' },
    { id: 'livrables', label: '3. Livrables & Fiches PDF' },
    { id: 'prises_parole', label: '4. Prises de parole & Formats' },
    { id: 'benchmark', label: '5. Benchmark & Veille' },
    { id: 'calendrier', label: '6. Calendrier & Échéances' },
    { id: 'modeles_admin', label: '7. Modèles & Administration' },
  ];

  const [activeTab, setActiveTab] = useState('demandes');

  // Selected report for 360° detail view
  const [selectedReportId, setSelectedReportId] = useState(null);

  // Sub-toggle for Tab 7 (Modèles vs Paramètres)
  const [adminSubTab, setAdminSubTab] = useState('modeles'); // 'modeles' | 'settings'

  // Modals state
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [prefilledTemplate, setPrefilledTemplate] = useState(null);
  const [exportModalReport, setExportModalReport] = useState(null);

  // Filter state for Tab 1 (Demandes)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [activeStatusCardFilter, setActiveStatusCardFilter] = useState('all');

  // Current active report object when viewing details
  const activeReport = useMemo(() => {
    if (!selectedReportId) return null;
    return reports.find(r => r.id === selectedReportId) || null;
  }, [selectedReportId, reports]);

  // Filtered reports for Demandes table
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Search text
      const matchesSearch = !searchQuery.trim() || 
        report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.brands?.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
        report.context?.campaignName?.toLowerCase().includes(searchQuery.toLowerCase());

      // Brand filter
      const matchesBrand = selectedBrand === 'all' || 
        report.brands?.includes(selectedBrand);

      // Type filter
      const matchesType = selectedType === 'all' || 
        report.type === selectedType;

      // Status dropdown filter
      const matchesStatus = selectedStatus === 'all' || 
        report.status === selectedStatus;

      // Status card click filter
      const matchesCardStatus = activeStatusCardFilter === 'all' || 
        report.status === activeStatusCardFilter ||
        (activeStatusCardFilter === 'validated' && (report.status === 'approved' || report.status === 'delivered'));

      // Priority filter
      const matchesPriority = selectedPriority === 'all' || 
        report.priority === selectedPriority;

      return matchesSearch && matchesBrand && matchesType && matchesStatus && matchesCardStatus && matchesPriority;
    });
  }, [reports, searchQuery, selectedBrand, selectedType, selectedStatus, activeStatusCardFilter, selectedPriority]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setActiveStatusCardFilter('all');
  };

  const handleStatusCardFilterChange = (status) => {
    setActiveStatusCardFilter(prev => prev === status ? 'all' : status);
  };

  // Export filtered reports to CSV
  const handleExportFilteredCsv = () => {
    if (filteredReports.length === 0) return;
    const headers = ['ID', 'Titre', 'Type', 'Marques', 'Statut', 'Priorité', 'Échéance', 'Demandeur', 'Analyste'];
    const rows = filteredReports.map(r => [
      r.id,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      r.type,
      `"${(r.brands || []).join(', ')}"`,
      r.status,
      r.priority,
      r.dueDate,
      `"${r.requester?.name || ''}"`,
      `"${r.assignee?.name || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mccann_reporting_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUseTemplate = (template) => {
    setPrefilledTemplate(template);
    setIsNewRequestOpen(true);
  };

  return (
    <div>
      {/* Barre d'onglets principale identique au module Influence */}
      <div 
        className="tab-bar mb-20 flex flex-wrap gap-4" 
        style={{ 
          background: '#fff', 
          padding: '6px 12px', 
          borderRadius: 8, 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
        }}
      >
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedReportId(null);
              setActiveTab(t.id);
            }}
            className={`tab-item ${activeTab === t.id && !selectedReportId ? 'active' : ''}`}
            style={{ fontWeight: 700, fontSize: 13 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* VUE DÉTAILLÉE 360° DU RAPPORT */}
      {selectedReportId && activeReport ? (
        <ReportDetailView
          report={activeReport}
          reports={reports}
          onSelectReport={(id) => setSelectedReportId(id)}
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
        <>
          {/* TAB 1: REGISTRE DES DEMANDES */}
          {activeTab === 'demandes' && (
            <div className="space-y-4 animate-fadeIn pb-10">
              
              {/* En-tête de section (Style Influence) */}
              <div className="flex flex-wrap items-center justify-between gap-16 mb-16">
                <div className="flex items-center gap-10">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#FF7900',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(255, 121, 0, 0.25)',
                    }}
                  >
                    <FileText size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
                      1. Registre & Demandes — Performance Social Media & Paid
                    </h2>
                    <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
                      Gestion des demandes de rapports, qualification des briefs, délais SLA et statut du workflow
                    </p>
                  </div>
                </div>

                {/* Boutons d'actions */}
                <div className="flex items-center gap-8 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setPrefilledTemplate(null);
                      setIsNewRequestOpen(true);
                    }}
                    className="btn btn-orange text-xs font-semibold flex items-center gap-6 px-14 py-8 rounded-lg shadow-sm"
                  >
                    <Plus size={15} />
                    <span>Nouvelle Demande</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportFilteredCsv}
                    className="btn btn-ghost border text-xs font-semibold flex items-center gap-6 px-14 py-8 rounded-lg"
                    style={{ background: '#fff' }}
                  >
                    <Download size={15} />
                    <span>Exporter CSV</span>
                  </button>
                </div>
              </div>

              {/* 4 Macro KPI Cards */}
              <ReportSummaryCards
                reports={reports}
                activeStatusFilter={activeStatusCardFilter}
                onStatusFilterChange={handleStatusCardFilterChange}
              />

              {/* Panneau de recherche & filtres */}
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

              {/* Table des rapports */}
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

          {/* TAB 2: COCKPIT EXÉCUTIF 360° */}
          {activeTab === 'cockpit' && (
            <ReportExecutiveCockpit
              reports={reports}
              onNavigateToTab={(tabId) => {
                setSelectedReportId(null);
                setActiveTab(tabId);
              }}
              onOpenNewReport={() => {
                setPrefilledTemplate(null);
                setIsNewRequestOpen(true);
              }}
              onCreateReport={() => {
                setPrefilledTemplate(null);
                setIsNewRequestOpen(true);
              }}
              onSelectReport={(rep) => setSelectedReportId(rep.id)}
            />
          )}

          {/* TAB 3: LIVRABLES & FICHES PDF */}
          {activeTab === 'livrables' && (
            <ReportLibraryView
              reports={reports}
              onSelectReport={(rep) => setSelectedReportId(rep.id)}
              onOpenExport={(rep) => setExportModalReport(rep)}
              onCreateReport={() => {
                setPrefilledTemplate(null);
                setIsNewRequestOpen(true);
              }}
            />
          )}

          {/* TAB 4: PRISES DE PAROLE & FORMATS */}
          {activeTab === 'prises_parole' && (
            <ReportDataStudio
              reports={reports}
              onSelectReport={(rep) => setSelectedReportId(rep.id)}
              onAddSpeech={addReportSpeech}
              onUpdateData={updateReportData}
              isAgency={isAgency}
            />
          )}

          {/* TAB 5: BENCHMARK & VEILLE */}
          {activeTab === 'benchmark' && (
            <ReportBenchmarkInsights
              reports={reports}
              onSelectReport={(rep) => setSelectedReportId(rep.id)}
              onUpdateData={updateReportData}
              isAgency={isAgency}
            />
          )}

          {/* TAB 6: CALENDRIER & ÉCHÉANCES */}
          {activeTab === 'calendrier' && (
            <ReportCalendarView
              reports={reports}
              onSelectReport={(rep) => setSelectedReportId(rep.id)}
            />
          )}

          {/* TAB 7: MODÈLES & ADMINISTRATION */}
          {activeTab === 'modeles_admin' && (
            <div className="space-y-4">
              {/* Sous-onglets de Tab 7 */}
              <div 
                className="tab-bar mb-16 flex flex-wrap gap-4" 
                style={{ 
                  background: '#fff', 
                  padding: '6px 12px', 
                  borderRadius: 8, 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
                }}
              >
                <button
                  onClick={() => setAdminSubTab('modeles')}
                  className={`tab-item ${adminSubTab === 'modeles' ? 'active' : ''}`}
                  style={{ fontWeight: 700, fontSize: 13 }}
                >
                  <Sparkles size={14} className="inline mr-1" />
                  Modèles Types Standardisés
                </button>
                <button
                  onClick={() => setAdminSubTab('settings')}
                  className={`tab-item ${adminSubTab === 'settings' ? 'active' : ''}`}
                  style={{ fontWeight: 700, fontSize: 13 }}
                >
                  <Settings size={14} className="inline mr-1" />
                  Paramètres, Gouvernance & SLA
                </button>
              </div>

              {adminSubTab === 'modeles' ? (
                <ReportTemplatesView
                  onUseTemplate={handleUseTemplate}
                />
              ) : (
                <ReportAdminSettings />
              )}
            </div>
          )}

        </>
      )}

      {/* NOUVELLE DEMANDE MODAL */}
      <NewReportRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => {
          setIsNewRequestOpen(false);
          setPrefilledTemplate(null);
        }}
        onSubmitReport={addReport}
        currentUser={currentUser}
        prefilledTemplate={prefilledTemplate}
      />

      {/* MODAL EXPORT & PARTAGE */}
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
