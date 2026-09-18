import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  computeAnalytics,
  CLIENT_OPTIONS,
  CHANNEL_OPTIONS,
  PERIOD_OPTIONS
} from './analyticsDataEngine';

// Components & Sections
import AnalyticsSwitchboardRibbon from './components/AnalyticsSwitchboardRibbon';
import AnalyticsPerspectiveBanner, { ANALYTICS_PERSPECTIVES } from './components/AnalyticsPerspectiveBanner';
import OverviewView from './components/OverviewView';
import CalendarAnalyticsView from './components/CalendarAnalyticsView';
import AdsAnalyticsView from './components/AdsAnalyticsView';
import FinanceAnalyticsView from './components/FinanceAnalyticsView';
import UsersAnalyticsView from './components/UsersAnalyticsView';
import InfluenceAnalyticsView from './components/InfluenceAnalyticsView';
import ExportModal from './components/ExportModal';

export default function DashboardPage() {
  const { state, isAgency } = useApp();

  // Active Tab View Navigation
  const [activeTab, setActiveTab] = useState('overview');

  // Role Perspective State (modeled exclusively on Traffic Manager)
  const [currentPerspective, setCurrentPerspective] = useState(isAgency ? 'traffic_ops' : 'demandeur');

  // Global Filters State
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterClient, setFilterClient] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [compareMode, setCompareMode] = useState(true);
  const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState(false);

  // Modals & Synchronization State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('12:00');

  // Compute analytics dynamically
  const analyticsData = useMemo(() => {
    return computeAnalytics({
      appContextPublications: state?.publications || state?.calendar || [],
      appContextFinancialDocs: state?.financialDocuments || [],
      appContextInfluencers: state?.influencers || [],
      filterPeriod,
      filterClient,
      filterChannel,
      filterStatus,
      searchTerm
    });
  }, [state, filterPeriod, filterClient, filterChannel, filterStatus, searchTerm]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 500);
  };

  const handleResetFilters = () => {
    setFilterPeriod('all');
    setFilterClient('all');
    setFilterChannel('all');
    setFilterStatus('all');
    setSearchTerm('');
  };

  const activeFiltersCount = 
    (filterPeriod !== 'all' ? 1 : 0) +
    (filterClient !== 'all' ? 1 : 0) +
    (filterChannel !== 'all' ? 1 : 0) +
    (filterStatus !== 'all' ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  // Tabs configured with emojis and badges matching Traffic Manager
  const tabs = [
    { id: 'overview', label: 'Vue d’ensemble 360°', icon: '📊', badge: null },
    { id: 'calendar', label: 'Calendrier & Contenus', icon: '📅', badge: analyticsData.metrics.totalPublications },
    { id: 'ads', label: 'Ads & Sponsoring', icon: '⚡', badge: `${(analyticsData.metrics.totalAdsSpent / 1000000).toFixed(0)}M` },
    { id: 'finance', label: 'États Financiers', icon: '💰', badge: `${analyticsData.metrics.tauxConsommation}%` },
    { id: 'users', label: 'Utilisateurs & IAM', icon: '👥', badge: analyticsData.metrics.activeUsersCount },
    { id: 'influence', label: 'Influence & Talents', icon: '⭐', badge: analyticsData.metrics.activeInfluencersCount }
  ];

  return (
    <div className="dashboard-analytics-page animate-fade" style={{ paddingBottom: 60 }}>
      {/* ─── 1. TOP HEADER (Identical to Traffic Manager) ─── */}
      <div className="flex justify-between items-center flex-wrap gap-14 mb-20">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              DASHBOARD ANALYTICS
            </h1>
            <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
              MCCANN × ORANGE CAMEROUN
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 13 }}>
            Tour de contrôle, consolidation transversale et monitoring des performances 360° en temps réel.
          </p>
        </div>

        {/* Action buttons & Live Sync Status */}
        <div className="flex items-center gap-12 flex-wrap">
          {/* Live sync chip exactly like the Friday countdown in Traffic Manager */}
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
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
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
              background: compareMode ? '#FFF8F2' : 'transparent',
              color: compareMode ? '#FF7900' : 'var(--dark)'
            }}
          >
            <span>⚖️</span> {compareMode ? 'Comparatif N-1 Actif' : 'Période Fixe'}
          </button>

          <button 
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsExportModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>📥</span> Exporter Fiche Orange
          </button>
        </div>
      </div>

      {/* ─── 2. THE VISUAL ANALYTICS SWITCHBOARD RIBBON ─── */}
      <AnalyticsSwitchboardRibbon 
        data={analyticsData}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* ─── 3. ROLE & PERSPECTIVES BANNER ─── */}
      <AnalyticsPerspectiveBanner 
        currentPerspective={currentPerspective}
        onChangePerspective={(roleId) => {
          setCurrentPerspective(roleId);
          const p = ANALYTICS_PERSPECTIVES.find(item => item.id === roleId);
          if (p?.suggestedTab) {
            setActiveTab(p.suggestedTab);
          }
        }}
        onQuickExport={() => setIsExportModalOpen(true)}
        onRefresh={handleRefresh}
      />

      {/* ─── 4. MAIN TABS & RESPONSIVE FILTER SWITCHBOARD ─── */}
      <div className="card mb-20 p-12" style={{ borderRadius: 12 }}>
        <div className="flex justify-between items-center flex-wrap gap-12">
          {/* Navigation Tabs (Horizontal Scroll on Mobile/Tablet) */}
          <div 
            className="flex gap-6 overflow-x-auto pb-4 md:pb-0" 
            style={{ WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}
            role="tablist"
            aria-label="Modes d'affichage Dashboard"
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className="btn btn-sm"
                style={{
                  background: activeTab === tab.id ? '#FF7900' : 'transparent',
                  color: activeTab === tab.id ? '#FFFFFF' : 'var(--dark)',
                  fontWeight: 700,
                  borderRadius: 6,
                  border: activeTab === tab.id ? 'none' : '1px solid #E5E7EB',
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
                      padding: '1px 6px', 
                      borderRadius: 10, 
                      background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                      color: activeTab === tab.id ? '#FFF' : 'var(--dark)' 
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Accordion Toggle for Mobile / Tablet (< 1024px) */}
          <div className="filter-accordion-toggle-wrap">
            <button
              type="button"
              className="btn btn-ghost btn-sm filter-mobile-toggle"
              onClick={() => setIsFilterAccordionOpen(!isFilterAccordionOpen)}
              aria-expanded={isFilterAccordionOpen}
              aria-controls="analyticsFiltersContent"
              style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 38 }}
            >
              <span>🔍 Filtres & Recherche</span>
              {activeFiltersCount > 0 && (
                <span className="badge-count" style={{ background: '#FF7900', color: '#fff', padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>
                  {activeFiltersCount}
                </span>
              )}
              <span>{isFilterAccordionOpen ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>

        {/* Global Search & Multi-criteria Filters (Desktop & Collapsible Mobile/Tablet) */}
        <div 
          id="analyticsFiltersContent" 
          className={`traffic-filters-collapsible ${isFilterAccordionOpen ? 'is-expanded' : ''}`}
        >
          <div className="flex items-center gap-10 flex-wrap pt-10 mt-10" style={{ borderTop: '1px solid #F0F0F0' }}>
            <div style={{ flex: '1 1 160px', minWidth: 140 }}>
              <label htmlFor="analyticsPeriodFilter" className="sr-only">Période</label>
              <select
                id="analyticsPeriodFilter"
                className="form-control w-full"
                value={filterPeriod}
                onChange={e => setFilterPeriod(e.target.value)}
                style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8, height: 42 }}
              >
                {PERIOD_OPTIONS.map(p => (
                  <option key={p.id} value={p.id}>📅 {p.label}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 160px', minWidth: 140 }}>
              <label htmlFor="analyticsClientFilter" className="sr-only">Grand Compte</label>
              <select
                id="analyticsClientFilter"
                className="form-control w-full"
                value={filterClient}
                onChange={e => setFilterClient(e.target.value)}
                style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8, height: 42 }}
              >
                {CLIENT_OPTIONS.map(c => (
                  <option key={c.id} value={c.id}>🏢 {c.label}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 160px', minWidth: 140 }}>
              <label htmlFor="analyticsChannelFilter" className="sr-only">Canal / Régie</label>
              <select
                id="analyticsChannelFilter"
                className="form-control w-full"
                value={filterChannel}
                onChange={e => setFilterChannel(e.target.value)}
                style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8, height: 42 }}
              >
                {CHANNEL_OPTIONS.map(ch => (
                  <option key={ch.id} value={ch.id}>🌐 {ch.label}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '2 1 220px', minWidth: 180 }}>
              <label htmlFor="analyticsSearchQuery" className="sr-only">Rechercher</label>
              <input
                id="analyticsSearchQuery"
                type="search"
                className="form-control w-full"
                placeholder="🔍 Rechercher par titre, ID ou marque..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8, height: 42 }}
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleResetFilters}
                style={{ height: 42, padding: '0 14px', fontSize: 12 }}
              >
                ✕ Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── 5. ACTIVE TAB VIEW RENDERING ─── */}
      {activeTab === 'overview' && (
        <OverviewView 
          data={analyticsData}
          onNavigateTab={setActiveTab}
          currentPerspective={currentPerspective}
        />
      )}

      {activeTab === 'calendar' && (
        <CalendarAnalyticsView 
          data={analyticsData}
        />
      )}

      {activeTab === 'ads' && (
        <AdsAnalyticsView 
          data={analyticsData}
        />
      )}

      {activeTab === 'finance' && (
        <FinanceAnalyticsView 
          data={analyticsData}
        />
      )}

      {activeTab === 'users' && (
        <UsersAnalyticsView 
          data={analyticsData}
        />
      )}

      {activeTab === 'influence' && (
        <InfluenceAnalyticsView 
          data={analyticsData}
        />
      )}

      {/* ─── 6. EXPORT MODAL ─── */}
      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={analyticsData}
          activeTab={activeTab}
          filterClient={filterClient}
          filterPeriod={filterPeriod}
        />
      )}
    </div>
  );
}
