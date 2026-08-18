import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BRIEF_STATUSES, BRIEF_TYPOLOGIES } from '../../data/briefs';
import { formatCurrency } from '../../utils/helpers';
import BriefFormModal from './sections/BriefFormModal';
import BriefDetailModal from './sections/BriefDetailModal';
import BriefsKanban from './sections/BriefsKanban';
import BriefsProgressDashboard from './sections/BriefsProgressDashboard';
import BriefsListView from './sections/BriefsListView';

export default function BriefsPage() {
  const { briefs, updateBriefStatus } = useApp();
  const { isAgency } = useAuth();

  // Perspective: 'client' (Orange) or 'agency' (McCann)
  const [perspective, setPerspective] = useState(isAgency ? 'agency' : 'client');
  
  // View mode: 'dashboard' (Progression), 'kanban' (Cycle de vie 8 colonnes), 'list' (Tableau)
  const [viewMode, setViewMode] = useState('dashboard');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypology, setFilterTypology] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBrief, setEditingBrief] = useState(null);
  const [selectedBrief, setSelectedBrief] = useState(null);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = briefs.length;
    const inProd = briefs.filter(b => b.status === 'in_progress').length;
    const inUat = briefs.filter(b => b.status === 'uat').length;
    const live = briefs.filter(b => b.status === 'live').length;
    const totalBudget = briefs.reduce((acc, b) => acc + (b.budget || 0), 0);
    
    // Critical countdown (J <= 30)
    const upcomingDeadlines = briefs.filter(b => {
      if (!b.goLiveDate || b.status === 'live') return false;
      const diff = new Date(b.goLiveDate) - new Date();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days <= 30 && days > 0;
    }).length;

    return { total, inProd, inUat, live, totalBudget, upcomingDeadlines };
  }, [briefs]);

  // Filtered briefs
  const filteredBriefs = useMemo(() => {
    return briefs.filter(b => {
      const matchSearch =
        !searchTerm ||
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.userJourney && b.userJourney.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTypology = filterTypology === 'ALL' || b.typology === filterTypology;
      const matchStatus = filterStatus === 'ALL' || b.status === filterStatus;

      return matchSearch && matchTypology && matchStatus;
    });
  }, [briefs, searchTerm, filterTypology, filterStatus]);

  const handleEditBrief = (brief) => {
    setEditingBrief(brief);
    setIsCreateOpen(true);
  };

  return (
    <div className="briefs-page-container">
      {/* Top Page Header */}
      <div className="briefs-page-header">
        <div className="briefs-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="briefs-header-icon">📋</span>
            <div>
              <h1 className="text-2xl font-bold text-dark" style={{ margin: 0 }}>
                Briefs & Progress
              </h1>
              <p className="text-base text-muted" style={{ margin: '2px 0 0 0', fontSize: 13 }}>
                Plateforme de cadrage, spécifications techniques et suivi d'avancement modulaire
              </p>
            </div>
          </div>
        </div>

        <div className="briefs-header-actions">
          {/* Dual Perspective Toggle */}
          <div className="perspective-toggle-group">
            <button
              type="button"
              className={`toggle-btn ${perspective === 'client' ? 'active client' : ''}`}
              onClick={() => setPerspective('client')}
            >
              🟠 Vue Client (Orange)
            </button>
            <button
              type="button"
              className={`toggle-btn ${perspective === 'agency' ? 'active agency' : ''}`}
              onClick={() => setPerspective('agency')}
            >
              🏢 Vue Agence (McCann)
            </button>
          </div>

          {/* New Brief Button */}
          <button
            type="button"
            className="btn btn-orange"
            onClick={() => { setEditingBrief(null); setIsCreateOpen(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontSize: 13 }}
          >
            <span>+</span> Nouveau Brief (5 Sections)
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="briefs-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap blue">📋</div>
          <div>
            <div className="kpi-value">{stats.total}</div>
            <div className="kpi-label">Total Briefs Actifs</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap orange">🟠</div>
          <div>
            <div className="kpi-value">{stats.inProd}</div>
            <div className="kpi-label">En Production (UX & Dev)</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap purple">🧪</div>
          <div>
            <div className="kpi-value">{stats.inUat}</div>
            <div className="kpi-label">En Recette Client (UAT)</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap red">⚡</div>
          <div>
            <div className="kpi-value">{stats.upcomingDeadlines}</div>
            <div className="kpi-label">Alertes Go-Live (J-30)</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap green">💰</div>
          <div>
            <div className="kpi-value">{formatCurrency(stats.totalBudget)}</div>
            <div className="kpi-label">Budget Total Engagé</div>
          </div>
        </div>
      </div>

      {/* Navigation Controls & Filters Bar */}
      <div className="briefs-controls-bar">
        {/* View Mode Switcher */}
        <div className="view-mode-tabs">
          <button
            type="button"
            className={`view-tab ${viewMode === 'dashboard' ? 'active' : ''}`}
            onClick={() => setViewMode('dashboard')}
          >
            📊 Progression & Jalons
          </button>
          <button
            type="button"
            className={`view-tab ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
          >
            📋 Kanban Cycle de Vie (8 Statuts)
          </button>
          <button
            type="button"
            className={`view-tab ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📑 Liste Détaillée & Spécifications
          </button>
        </div>

        {/* Search and Filters */}
        <div className="filters-group">
          {/* Search Box */}
          <div className="search-input-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par mot-clé, réf. ou sponsor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>

          {/* Typology Filter */}
          <select
            className="filter-select"
            value={filterTypology}
            onChange={e => setFilterTypology(e.target.value)}
          >
            <option value="ALL">Toutes les typologies</option>
            {BRIEF_TYPOLOGIES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="filter-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Tous les statuts</option>
            {Object.values(BRIEF_STATUSES).map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      <div className="briefs-content-wrapper">
        {viewMode === 'dashboard' && (
          <BriefsProgressDashboard
            briefs={filteredBriefs}
            onSelectBrief={setSelectedBrief}
            perspective={perspective}
          />
        )}

        {viewMode === 'kanban' && (
          <BriefsKanban
            briefs={filteredBriefs}
            onSelectBrief={setSelectedBrief}
            onStatusChange={updateBriefStatus}
          />
        )}

        {viewMode === 'list' && (
          <BriefsListView
            briefs={filteredBriefs}
            onSelectBrief={setSelectedBrief}
            onStatusChange={updateBriefStatus}
            onEditBrief={handleEditBrief}
          />
        )}
      </div>

      {/* Modal Form: Create / Edit Brief */}
      {isCreateOpen && (
        <BriefFormModal
          isOpen={isCreateOpen}
          onClose={() => { setIsCreateOpen(false); setEditingBrief(null); }}
          editingBrief={editingBrief}
        />
      )}

      {/* Modal Detail: 360° Inspector */}
      {selectedBrief && (
        <BriefDetailModal
          isOpen={!!selectedBrief}
          onClose={() => setSelectedBrief(null)}
          brief={selectedBrief}
          onEdit={handleEditBrief}
        />
      )}
    </div>
  );
}
