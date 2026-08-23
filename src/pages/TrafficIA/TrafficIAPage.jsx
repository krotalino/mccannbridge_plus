import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TEAM, POLES } from '../../data/team';
import { TRAFFIC_STATUSES } from '../../data/tickets';
import { getFridayCountdown } from '../../utils/helpers';

// Components & Sections
import BridgeSwitchboardRibbon from './components/BridgeSwitchboardRibbon';
import RolePerspectiveBanner from './components/RolePerspectiveBanner';
import TrafficKanbanView from './sections/TrafficKanbanView';
import TrafficChronosTimeline from './sections/TrafficChronosTimeline';
import TrafficCompetencesAndLoad from './sections/TrafficCompetencesAndLoad';
import TrafficDependenciesView from './sections/TrafficDependenciesView';
import TrafficSmartAlerts from './sections/TrafficSmartAlerts';

// Modals
import TicketDetailModal from './modals/TicketDetailModal';
import NewTicketModal from './modals/NewTicketModal';
import WeeklyTrafficReportModal from './modals/WeeklyTrafficReportModal';

export default function TrafficIAPage() {
  const {
    tickets = [],
    updateTicketStatus,
    updateTicket,
    reassignTicket,
    addTicket,
    reportTicketBlockage,
    resolveTicketBlockage,
    logTicketHours,
    isAgency,
  } = useApp();

  // Role Perspective State
  // Default to 'traffic_manager' if agency, 'demandeur' if client
  const [currentRole, setCurrentRole] = useState(isAgency ? 'traffic_manager' : 'demandeur');
  const [selectedExecutantId, setSelectedExecutantId] = useState('t1'); // Annette by default

  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'chronos' | 'load' | 'dependencies' | 'alerts'

  // Filters & Accordion
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedPoleFilter, setSelectedPoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState(false);

  // Modals state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);

  // Active filters count
  const activeFiltersCount = (selectedPoleFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0) + (selectedStatusFilter !== 'all' ? 1 : 0);

  // Friday countdown
  const fridayCount = getFridayCountdown();

  // Active tickets for alert counts
  const alertCount = tickets.filter(t => t.blockage?.isBlocked || (t.status !== 'delivered' && t.daysLeft <= 1) || t.status === 'client_review').length;

  return (
    <div className="traffic-manager-page animate-fade" style={{ paddingBottom: 60 }}>
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-14 mb-20">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              TRAFFIC MANAGER
            </h1>
            <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
              MCCANN × ORANGE CAMEROUN
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 13 }}>
            Régulation, fluidification et arbitrage des flux de travail entre McCann Douala et Orange Cameroun.
          </p>
        </div>

        {/* Action buttons & Friday Countdown */}
        <div className="flex items-center gap-12 flex-wrap">
          {/* Friday 17h milestone countdown */}
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
            }}
          >
            <span style={{ fontSize: 16 }}>🏁</span>
            <div>
              <div style={{ fontSize: 10, color: '#E65100', fontWeight: 700 }}>CLÔTURE VENDREDI 17H</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>
                {fridayCount.days}j {fridayCount.hours}h {fridayCount.minutes}m restants
              </div>
            </div>
          </div>

          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => setIsWeeklyReportOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
          >
            <span>📊</span> Rapport Hebdomadaire
          </button>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setIsNewTicketOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>+</span> {currentRole === 'demandeur' ? 'Nouveau Brief Orange' : 'Nouveau Ticket'}
          </button>
        </div>
      </div>

      {/* The Visual Bridge Switchboard Ribbon */}
      <BridgeSwitchboardRibbon 
        tickets={tickets}
        activeFilterStatus={selectedStatusFilter}
        onSelectStatus={setSelectedStatusFilter}
      />

      {/* Role & Permissions Banner */}
      <RolePerspectiveBanner 
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        selectedExecutantId={selectedExecutantId}
        onChangeExecutant={setSelectedExecutantId}
        onOpenNewTicket={() => setIsNewTicketOpen(true)}
      />

      {/* Main Tabs & Responsive Filter Switchboard */}
      <div className="card mb-20 p-12" style={{ borderRadius: 12 }}>
        <div className="flex justify-between items-center flex-wrap gap-12">
          {/* Navigation Tabs (Horizontal Scroll on Mobile/Tablet) */}
          <div 
            className="flex gap-6 overflow-x-auto pb-4 md:pb-0" 
            style={{ WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}
            role="tablist"
            aria-label="Modes d'affichage Traffic"
          >
            {[
              { id: 'kanban', label: '🚦 Vue Switchboard', icon: '🚦' },
              { id: 'chronos', label: '⏳ Vue Chronos', icon: '⏳' },
              { id: 'load', label: '📊 Compétences & Charge', icon: '📊' },
              { id: 'dependencies', label: '🔗 Dépendances', icon: '🔗' },
              { id: 'alerts', label: `⚡ Alertes (${alertCount})`, icon: '⚡' },
            ].map(tab => (
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
                }}
              >
                {tab.label}
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
              aria-controls="trafficFiltersContent"
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

        {/* Global Search & Pôle Filter (Always displayed on Desktop ≥ 1024px, Collapsible on Mobile/Tablet) */}
        <div 
          id="trafficFiltersContent" 
          className={`traffic-filters-collapsible ${isFilterAccordionOpen ? 'is-expanded' : ''}`}
        >
          <div className="flex items-center gap-10 flex-wrap pt-10 mt-10" style={{ borderTop: '1px solid #F0F0F0' }}>
            <div style={{ flex: '1 1 180px', minWidth: 160 }}>
              <label htmlFor="trafficPoleFilter" className="sr-only">Pôle</label>
              <select
                id="trafficPoleFilter"
                className="form-control w-full"
                value={selectedPoleFilter}
                onChange={e => setSelectedPoleFilter(e.target.value)}
                style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8, height: 42 }}
              >
                <option value="all">🏢 Tous les Pôles</option>
                {POLES.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '2 1 240px', minWidth: 200 }}>
              <label htmlFor="trafficSearchQuery" className="sr-only">Rechercher</label>
              <input
                id="trafficSearchQuery"
                type="search"
                className="form-control w-full"
                placeholder="🔍 Rechercher par titre, ID ou marque..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8, height: 42 }}
              />
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => { setSelectedPoleFilter('all'); setSearchQuery(''); setSelectedStatusFilter('all'); }}
                style={{ height: 42, padding: '0 14px', fontSize: 12 }}
              >
                ✕ Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Tab View Rendering */}
      {activeTab === 'kanban' && (
        <TrafficKanbanView 
          tickets={tickets}
          currentRole={currentRole}
          activeExecutantId={selectedExecutantId}
          selectedStatusFilter={selectedStatusFilter}
          selectedPoleFilter={selectedPoleFilter}
          searchQuery={searchQuery}
          onSelectTicket={setSelectedTicket}
          onUpdateStatus={updateTicketStatus}
          onOpenNewTicket={() => setIsNewTicketOpen(true)}
        />
      )}

      {activeTab === 'chronos' && (
        <TrafficChronosTimeline 
          tickets={tickets}
          onSelectTicket={setSelectedTicket}
        />
      )}

      {activeTab === 'load' && (
        <TrafficCompetencesAndLoad 
          tickets={tickets}
          onReassignTicket={reassignTicket}
          onSelectTicket={setSelectedTicket}
        />
      )}

      {activeTab === 'dependencies' && (
        <TrafficDependenciesView 
          tickets={tickets}
          onSelectTicket={setSelectedTicket}
        />
      )}

      {activeTab === 'alerts' && (
        <TrafficSmartAlerts 
          tickets={tickets}
          onSelectTicket={setSelectedTicket}
          onResolveBlockage={resolveTicketBlockage}
        />
      )}

      {/* Ticket Detail & Action Modal */}
      {selectedTicket && (
        <TicketDetailModal 
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          currentRole={currentRole}
          activeExecutantId={selectedExecutantId}
          onUpdateStatus={updateTicketStatus}
          onReassign={reassignTicket}
          onUpdateTicket={updateTicket}
          onReportBlockage={reportTicketBlockage}
          onResolveBlockage={resolveTicketBlockage}
          onLogHours={logTicketHours}
        />
      )}

      {/* New Ticket / Brief Modal */}
      {isNewTicketOpen && (
        <NewTicketModal 
          currentRole={currentRole}
          onClose={() => setIsNewTicketOpen(false)}
          onAddTicket={addTicket}
        />
      )}

      {/* Weekly Digest Modal */}
      {isWeeklyReportOpen && (
        <WeeklyTrafficReportModal 
          tickets={tickets}
          onClose={() => setIsWeeklyReportOpen(false)}
        />
      )}
    </div>
  );
}
