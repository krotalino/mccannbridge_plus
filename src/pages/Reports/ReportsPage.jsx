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

// Dashboard-inspired Ribbon and Perspectives components
import ReportingSwitchboardRibbon from './components/ReportingSwitchboardRibbon';
import ReportingPerspectiveBanner, { REPORTING_PERSPECTIVES } from './components/ReportingPerspectiveBanner';

// Sub-components aligned with the Dashboard Analytics design system
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

  // 7 numbered tabs matching the exact Dashboard Analytics & Platform architecture
  const tabs = [
    { id: 'demandes', label: '1. Registre des Demandes', icon: '📋', badge: `${reports.length}` },
    { id: 'cockpit', label: '2. Cockpit Exécutif 360°', icon: '📊', badge: 'Live' },
    { id: 'livrables', label: '3. Livrables & Fiches PDF', icon: '📄', badge: `${reports.filter(r => r.status === 'delivered' || r.status === 'approved').length}` },
    { id: 'prises_parole', label: '4. Prises de parole & Formats', icon: '⚡' },
    { id: 'benchmark', label: '5. Benchmark & Veille', icon: '🏆', badge: 'SOV' },
    { id: 'calendrier', label: '6. Calendrier & Échéances', icon: '📅' },
    { id: 'modeles_admin', label: '7. Modèles & Administration', icon: '⚙️' },
  ];

  const [activeTab, setActiveTab] = useState('demandes');
  const [currentPerspective, setCurrentPerspective] = useState('analyste');
  const [compareMode, setCompareMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );

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

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

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
        (activeStatusCardFilter === 'late' && report.dueDate && report.dueDate < new Date().toISOString().slice(0, 10) && report.status !== 'delivered') ||
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
    <div className="reports-analytics-container animate-fadeIn">
      {/* ─── 1. TOP HEADER (Identique au module Dashboard Analytics) ─── */}
      <div className="flex justify-between items-start flex-wrap gap-16 mb-20">
        <div>
          <div className="flex items-center gap-10 flex-wrap">
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              REPORTING & INSIGHTS
            </h1>
            <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
              MCCANN × ORANGE CAMEROUN
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 13 }}>
            Centre de pilotage analytique, production des bilans de performance, SLA de livraison et insights stratégiques 360°.
          </p>
        </div>

        {/* Action buttons & Live Sync Status */}
        <div className="flex items-center gap-12 flex-wrap">
          {/* Live sync chip exactly like Dashboard Analytics */}
          <div 
            className="card" 
            style={{ 
              padding: '6px 14px', 
              background: '#FFF8F2', 
              border: '1px solid #FFE0B2', 
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 0
            }}
          >
            <span style={{ fontSize: 16 }}>⚡</span>
            <div>
              <div style={{ fontSize: 10, color: '#E65100', fontWeight: 700 }}>SYNCHRONISATION ACTIVE</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>
                Flux Connecté • {lastSyncTime}
              </div>
            </div>
          </div>

          <button 
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0', background: '#FFF' }}
          >
            <span>🔄</span> {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </button>

          <button 
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setCompareMode(!compareMode)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              border: compareMode ? '1px solid #FF7900' : '1px solid #D0D0D0',
              background: compareMode ? '#FFF8F2' : '#FFF',
              color: compareMode ? '#FF7900' : 'var(--dark)'
            }}
          >
            <span>⚖️</span> {compareMode ? 'Comparatif N-1 Actif' : 'Période Fixe'}
          </button>

          <button 
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setPrefilledTemplate(null);
              setIsNewRequestOpen(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF7900', color: '#FFF' }}
          >
            <span>+</span> Nouvelle Demande
          </button>

          <button 
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleExportFilteredCsv}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0', background: '#FFF' }}
          >
            <span>📥</span> Exporter Fiche CSV
          </button>
        </div>
      </div>

      {/* ─── 2. THE VISUAL ANALYTICS SWITCHBOARD RIBBON ─── */}
      <ReportingSwitchboardRibbon 
        reports={reports}
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setSelectedReportId(null);
          setActiveTab(tabId);
        }}
      />

      {/* ─── 3. ROLE & PERSPECTIVES BANNER ─── */}
      <ReportingPerspectiveBanner 
        currentPerspective={currentPerspective}
        onChangePerspective={(roleId) => {
          setCurrentPerspective(roleId);
          const p = REPORTING_PERSPECTIVES.find(item => item.id === roleId);
          if (p?.suggestedTab) {
            setSelectedReportId(null);
            setActiveTab(p.suggestedTab);
          }
        }}
        onQuickExport={handleExportFilteredCsv}
        onRefresh={handleRefresh}
        onNewRequest={() => {
          setPrefilledTemplate(null);
          setIsNewRequestOpen(true);
        }}
      />

      {/* ─── 4. MAIN TABS SWITCHBOARD CARD ─── */}
      <div className="card mb-20 p-12" style={{ borderRadius: 12, background: '#FFF', border: '1px solid #E0E0E0' }}>
        <div className="flex justify-between items-center flex-wrap gap-12">
          {/* Navigation Tabs (Horizontal Scroll on Mobile/Tablet) */}
          <div 
            className="flex gap-6 overflow-x-auto pb-4 md:pb-0" 
            style={{ WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}
            role="tablist"
            aria-label="Navigation Reporting & Insights"
          >
            {tabs.map(tab => {
              const isSelected = activeTab === tab.id && !selectedReportId;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedReportId(null);
                    setActiveTab(tab.id);
                  }}
                  className="btn btn-sm"
                  style={{
                    background: isSelected ? '#FF7900' : 'transparent',
                    color: isSelected ? '#FFFFFF' : 'var(--dark)',
                    fontWeight: isSelected ? 800 : 600,
                    borderRadius: 6,
                    border: isSelected ? 'none' : '1px solid #E5E7EB',
                    whiteSpace: 'nowrap',
                    minHeight: 38,
                    padding: '6px 12px',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span 
                      style={{ 
                        fontSize: 10, 
                        fontWeight: 700,
                        padding: '1px 6px', 
                        borderRadius: 10, 
                        background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)', 
                        color: isSelected ? '#FFF' : 'var(--dark)' 
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 5. CONTENU DYNAMIQUE DE L'ONGLET SÉLECTIONNÉ ─── */}
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
              
              {/* En-tête de section (Dashboard Analytics Style) */}
              <div className="flex flex-wrap items-center justify-between gap-16 mb-16">
                <div className="flex items-center gap-10">
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: '#FF7900',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      boxShadow: '0 2px 8px rgba(255, 121, 0, 0.25)',
                    }}
                  >
                    📋
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
                      Registre & Demandes de Reporting — Performance Social Media & Paid
                    </h2>
                    <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, marginTop: 2 }}>
                      Gestion des demandes de bilans, qualification des briefs, cadencement SLA et avancement du workflow
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
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF7900', color: '#FFF' }}
                  >
                    <Plus size={15} />
                    <span>Nouvelle Demande</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportFilteredCsv}
                    className="btn btn-ghost btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0', background: '#FFF' }}
                  >
                    <Download size={15} />
                    <span>Exporter CSV</span>
                  </button>
                </div>
              </div>

              {/* 4 Macro KPI Cards (Dashboard Analytics Style) */}
              <ReportSummaryCards
                reports={reports}
                activeStatusFilter={activeStatusCardFilter}
                onStatusFilterChange={handleStatusCardFilterChange}
              />

              {/* Panneau de recherche & filtres (Dashboard Analytics Style) */}
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
              {/* Sous-onglets de Tab 7 (Dashboard Analytics Style) */}
              <div 
                className="card mb-16 p-10 flex flex-wrap gap-4" 
                style={{ 
                  background: '#FFF', 
                  borderRadius: 10, 
                  border: '1px solid #E0E0E0' 
                }}
              >
                <button
                  type="button"
                  onClick={() => setAdminSubTab('modeles')}
                  className="btn btn-sm"
                  style={{
                    background: adminSubTab === 'modeles' ? '#FF7900' : 'transparent',
                    color: adminSubTab === 'modeles' ? '#FFFFFF' : 'var(--dark)',
                    fontWeight: adminSubTab === 'modeles' ? 800 : 600,
                    borderRadius: 6,
                    border: adminSubTab === 'modeles' ? 'none' : '1px solid #E5E7EB',
                    padding: '6px 14px'
                  }}
                >
                  <Sparkles size={14} className="inline mr-1" />
                  Modèles Types Standardisés
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSubTab('settings')}
                  className="btn btn-sm"
                  style={{
                    background: adminSubTab === 'settings' ? '#FF7900' : 'transparent',
                    color: adminSubTab === 'settings' ? '#FFFFFF' : 'var(--dark)',
                    fontWeight: adminSubTab === 'settings' ? 800 : 600,
                    borderRadius: 6,
                    border: adminSubTab === 'settings' ? 'none' : '1px solid #E5E7EB',
                    padding: '6px 14px'
                  }}
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
