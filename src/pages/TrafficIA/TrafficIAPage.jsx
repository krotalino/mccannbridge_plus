import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TEAM, POLES } from '../../data/team';
import { TRAFFIC_STATUSES } from '../../data/tickets';
import { getFridayCountdown } from '../../utils/helpers';

// Components & Sections (Vue Agence Interne)
import BridgeSwitchboardRibbon from './components/BridgeSwitchboardRibbon';
import RolePerspectiveBanner from './components/RolePerspectiveBanner';
import TrafficKanbanView from './sections/TrafficKanbanView';
import TrafficChronosTimeline from './sections/TrafficChronosTimeline';
import TrafficCompetencesAndLoad from './sections/TrafficCompetencesAndLoad';
import TrafficDependenciesView from './sections/TrafficDependenciesView';
import TrafficSmartAlerts from './sections/TrafficSmartAlerts';

// Modals (Vue Agence)
import TicketDetailModal from './modals/TicketDetailModal';
import NewTicketModal from './modals/NewTicketModal';
import WeeklyTrafficReportModal from './modals/WeeklyTrafficReportModal';

// NOUVEAUX COMPOSANTS DÉDIÉS : VUE CLIENT (Conformes au Cahier des Charges & Design Influence)
import ClientTrafficSwitchboardRibbon from './client/ClientTrafficSwitchboardRibbon';
import ClientTrafficPerspectiveBanner from './client/ClientTrafficPerspectiveBanner';
import ClientTrafficContextBar from './client/ClientTrafficContextBar';
import ClientTrafficCockpit from './client/ClientTrafficCockpit';
import ClientTrafficPortfolio from './client/ClientTrafficPortfolio';
import ClientTrafficSharedCalendar from './client/ClientTrafficSharedCalendar';
import ClientTrafficRecommendations from './client/ClientTrafficRecommendations';
import ClientTrafficValidationCenter from './client/ClientTrafficValidationCenter';
import ClientTrafficLivrables from './client/ClientTrafficLivrables';
import ClientTrafficGovernance from './client/ClientTrafficGovernance';

// Modals Dédiés Client
import ClientNewBriefModal from './client/ClientNewBriefModal';
import ClientDossierDetailModal from './client/ClientDossierDetailModal';
import ClientValidationModal from './client/ClientValidationModal';
import ClientContentDetailModal from './client/ClientContentDetailModal';

// Données Métier Certifiées S38
import {
  INITIAL_CLIENT_DOSSIERS,
  INITIAL_CLIENT_VALIDATIONS,
  INITIAL_CLIENT_RECOMMENDATIONS,
  INITIAL_CLIENT_CALENDAR_ITEMS,
  INITIAL_CLIENT_LIVRABLES,
} from '../../data/clientTrafficData';

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

  const { isClient: authIsClient } = useAuth ? useAuth() : { isClient: false };

  // Mode d'affichage actif : par défaut 'client' pour respecter fidèlement la demande du cahier des charges
  const [activeViewMode, setActiveViewMode] = useState(authIsClient ? 'client' : 'client'); // 'client' | 'agency'

  // ─────────────────────────────────────────────────────────────
  // ÉTATS DE LA VUE CLIENT (Cahier des charges Septembre 2026)
  // ─────────────────────────────────────────────────────────────
  const [clientTab, setClientTab] = useState('cockpit'); // 'cockpit' | 'travaux' | 'calendrier' | 'recommandations' | 'validations' | 'livrables' | 'gouvernance'
  const [clientRole, setClientRole] = useState('valideur_orange'); // 'valideur_orange' | 'contributeur_orange' | 'lecteur_orange' | 'traffic_mccann'
  const [selectedPeriod, setSelectedPeriod] = useState('s38_2026');
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedUniverse, setSelectedUniverse] = useState('all');
  const [lastSyncTime, setLastSyncTime] = useState('15:50');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Données dynamiques de la vue client
  const [clientDossiers, setClientDossiers] = useState(INITIAL_CLIENT_DOSSIERS);
  const [clientValidations, setClientValidations] = useState(INITIAL_CLIENT_VALIDATIONS);
  const [clientRecommendations, setClientRecommendations] = useState(INITIAL_CLIENT_RECOMMENDATIONS);
  const [clientCalendarItems, setClientCalendarItems] = useState(INITIAL_CLIENT_CALENDAR_ITEMS);
  const [clientLivrables, setClientLivrables] = useState(INITIAL_CLIENT_LIVRABLES);

  // Modals de la vue client
  const [isClientNewBriefOpen, setIsClientNewBriefOpen] = useState(false);
  const [selectedClientDossier, setSelectedClientDossier] = useState(null);
  const [selectedClientValidation, setSelectedClientValidation] = useState(null);
  const [validationModalActionType, setValidationModalActionType] = useState('commenter');
  const [selectedClientContent, setSelectedClientContent] = useState(null);

  // ─────────────────────────────────────────────────────────────
  // ÉTATS DE LA VUE AGENCE INTERNE (Préservés)
  // ─────────────────────────────────────────────────────────────
  const [currentAgencyRole, setCurrentAgencyRole] = useState(isAgency ? 'traffic_manager' : 'demandeur');
  const [selectedExecutantId, setSelectedExecutantId] = useState('t1');
  const [agencyActiveTab, setAgencyActiveTab] = useState('kanban');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedPoleFilter, setSelectedPoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);

  // Friday countdown
  const fridayCount = getFridayCountdown();
  const alertCount = tickets.filter(t => t.blockage?.isBlocked || (t.status !== 'delivered' && t.daysLeft <= 1) || t.status === 'client_review').length;
  const activeFiltersCount = (selectedPoleFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0) + (selectedStatusFilter !== 'all' ? 1 : 0);

  // ─────────────────────────────────────────────────────────────
  // ACTIONS MÉTIER DE LA VUE CLIENT
  // ─────────────────────────────────────────────────────────────

  // 1. Approbation rapide d'une validation Orange
  const handleQuickApproveValidation = (validationId) => {
    setClientValidations(prev =>
      prev.map(v => (v.id === validationId ? { ...v, status: 'approuve' } : v))
    );
    // Mettre à jour le dossier correspondant si existant
    setClientDossiers(prev =>
      prev.map(d => {
        const val = clientValidations.find(v => v.id === validationId);
        if (val && d.id === val.ticketId) {
          return {
            ...d,
            clientStatus: 'production',
            nextStep: 'Validation enregistrée • Déploiement en production régie',
            risk: { level: 'vert', cause: 'Validé par Orange', consequence: 'Planning nominal', decisionDate: 'Terminé', recommendedAction: 'Suivre la diffusion' }
          };
        }
        return d;
      })
    );
    alert('Validation validée avec succès ! Le flux de production a été notifié.');
  };

  // 2. Traitement d'action modale (commenter, modifier, repousser, refuser)
  const handleSubmitValidationAction = ({ validationId, actionType, comment, postponedDate }) => {
    setClientValidations(prev =>
      prev.map(v => {
        if (v.id === validationId) {
          return {
            ...v,
            status: actionType === 'refuser' ? 'refuse' : 'en_attente',
            whatIsExpected: actionType === 'modifier' ? `Ajustements requis : ${comment}` : v.whatIsExpected,
            deadline: actionType === 'repousser' ? `Repoussé au ${postponedDate}` : v.deadline,
          };
        }
        return v;
      })
    );
    alert(`Action "${actionType}" enregistrée et transmise à McCann Douala.`);
  };

  // 3. Arbitrage direct d'une recommandation digitale
  const handleUpdateRecommendationDecision = (recId, decision) => {
    setClientRecommendations(prev =>
      prev.map(r => (r.id === recId ? { ...r, clientDecision: decision } : r))
    );
  };

  // 4. Création d'un nouveau brief structuré
  const handleSubmitNewBrief = (briefData) => {
    const newId = `TK-2026-BRIEF-${Math.floor(Math.random() * 800 + 100)}`;
    const newDossier = {
      id: newId,
      title: briefData.title,
      brand: briefData.brand,
      universe: 'social_media',
      type: 'crea',
      typeLabel: 'Nouveau Brief Structuré',
      aarrr: briefData.aarrr,
      priority: briefData.urgency.includes('P0') ? 'critique' : 'normale',
      mccannLead: { name: 'Directeur Conseil', role: 'Coordination Traffic', email: 'traffic@mccann.cm' },
      orangeContact: { name: briefData.orangeValidator, role: 'Validateur Orange', email: 'validation@orange.cm' },
      clientStatus: 'nouvelle_demande',
      nextStep: 'Prise en charge par le Traffic McCann pour qualification et estimation',
      deadline: briefData.desiredDeadline || '2026-09-30',
      risk: {
        level: 'vert',
        cause: 'Nouveau brief qualifié avec succès',
        consequence: 'En cours d’analyse',
        decisionDate: 'Cadrage sous 24h',
        recommendedAction: 'Attendre le retour de cadrage McCann',
      },
      lastActivity: 'Brief créé et synchronisé • À l’instant',
      timeline: [
        { step: 1, label: 'Demande créée', done: true, date: 'Aujourd’hui', user: briefData.orangeValidator },
        { step: 2, label: 'Brief complété', done: true, date: 'Aujourd’hui', user: briefData.orangeValidator },
        { step: 3, label: 'Cadrage et estimation partagés', done: false, date: 'En cours', user: 'Traffic McCann' },
        { step: 4, label: 'Planification confirmée', done: false, date: 'À venir', user: 'Traffic McCann' },
      ],
      assets: [],
    };

    setClientDossiers(prev => [newDossier, ...prev]);
    setClientTab('travaux');
    alert(`Le brief ${newId} a été transmis à McCann Douala avec succès.`);
  };

  // 5. Rafraîchissement simulé
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="traffic-manager-page animate-fade" style={{ paddingBottom: 60 }}>
      {/* ─── TOP BAR AVEC SÉLECTEUR DE VUE (CLIENT vs AGENCE) ─── */}
      <div className="flex justify-between items-center flex-wrap gap-14 mb-20">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              TRAFFIC MANAGER
            </h1>
            <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
              MCCANN DOUALA ⇄ ORANGE CAMEROUN
            </span>
            {activeViewMode === 'client' && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: '#E8F5E9',
                  color: '#2E7D32',
                  border: '1px solid #C8E6C9',
                }}
              >
                Vue Client Conforme Cahier des Charges
              </span>
            )}
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 13 }}>
            Plateforme de coordination, régulation des flux et prise de décision paritaire.
          </p>
        </div>

        {/* Boutons d'action supérieurs & Switcher de Vue */}
        <div className="flex items-center gap-12 flex-wrap">
          {/* Switcher Segmenté de Vue */}
          <div
            style={{
              display: 'flex',
              background: '#F3F4F6',
              padding: 3,
              borderRadius: 8,
              border: '1px solid #E5E7EB',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveViewMode('client')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 800,
                border: 'none',
                background: activeViewMode === 'client' ? '#FF7900' : 'transparent',
                color: activeViewMode === 'client' ? '#FFFFFF' : '#4B5563',
                cursor: 'pointer',
                boxShadow: activeViewMode === 'client' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>👁️ Vue Client (Cahier des Charges)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('agency')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 800,
                border: 'none',
                background: activeViewMode === 'agency' ? '#1E293B' : 'transparent',
                color: activeViewMode === 'agency' ? '#FFFFFF' : '#4B5563',
                cursor: 'pointer',
                boxShadow: activeViewMode === 'agency' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🏢 Vue Agence (Interne)</span>
            </button>
          </div>

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

          {activeViewMode === 'client' ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsClientNewBriefOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#FF7900',
                borderColor: '#FF7900',
                fontWeight: 800,
              }}
            >
              <span>+</span> Nouveau Brief Structuré
            </button>
          ) : (
            <>
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
                <span>+</span> Nouveau Ticket
              </button>
            </>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🅰️ RENDU PRINCIPAL : VUE CLIENT (CAHIER DES CHARGES SEPT. 2026)    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeViewMode === 'client' && (
        <div className="client-traffic-view-container space-y-20 animate-fade">
          {/* 1. The Bridge Switchboard Ribbon (Nocturnal Design & 6 Nodes) */}
          <ClientTrafficSwitchboardRibbon
            dossiers={clientDossiers}
            validations={clientValidations}
            recommendations={clientRecommendations}
            activeTab={clientTab}
            onSelectTab={setClientTab}
            selectedEntity={selectedEntity}
            lastSyncTime={lastSyncTime}
          />

          {/* 2. Perspective Banner (4 Rôles et Droits Client) */}
          <ClientTrafficPerspectiveBanner
            currentRole={clientRole}
            onChangeRole={setClientRole}
            onOpenNewBrief={() => setIsClientNewBriefOpen(true)}
            onOpenValidations={() => setClientTab('validations')}
            pendingValidationsCount={clientValidations.filter(v => v.status === 'en_attente').length}
          />

          {/* 3. Bandeau de Contexte & Filtres Métier (Période, Entité, Univers, Accès rapides) */}
          <ClientTrafficContextBar
            selectedPeriod={selectedPeriod}
            onChangePeriod={setSelectedPeriod}
            selectedEntity={selectedEntity}
            onChangeEntity={setSelectedEntity}
            selectedUniverse={selectedUniverse}
            onChangeUniverse={setSelectedUniverse}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            lastSyncTime={lastSyncTime}
            onQuickNav={setClientTab}
            validationsCount={clientValidations.filter(v => v.status === 'en_attente').length}
            dossiersCount={clientDossiers.length}
          />

          {/* 4. Barre de Navigation Principale des 7 Onglets Client */}
          <div
            className="card mb-20 p-8"
            style={{
              borderRadius: 12,
              background: '#FFFFFF',
              border: '1px solid #E0E0E0',
            }}
          >
            <div
              className="flex gap-6 overflow-x-auto pb-4 md:pb-0"
              style={{ WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}
              role="tablist"
              aria-label="Navigation Vue Client Traffic"
            >
              {[
                { id: 'cockpit', label: '🧭 1. Mon Cockpit', badge: null },
                { id: 'travaux', label: '📂 2. Travaux en cours', badge: clientDossiers.length },
                { id: 'calendrier', label: '📅 3. Calendrier partagé', badge: clientCalendarItems.length },
                { id: 'recommandations', label: '💡 4. Recommandations', badge: clientRecommendations.length },
                { id: 'validations', label: '⚡ 5. Mes validations', badge: clientValidations.filter(v => v.status === 'en_attente').length, isAlert: true },
                { id: 'livrables', label: '📁 6. Livrables & bilans', badge: clientLivrables.length },
                { id: 'gouvernance', label: '🛡️ 7. Historique & gouvernance', badge: null },
              ].map(tab => {
                const isActive = clientTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setClientTab(tab.id)}
                    className="btn btn-sm"
                    style={{
                      background: isActive ? '#FF7900' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--dark)',
                      fontWeight: 800,
                      borderRadius: 8,
                      border: isActive ? 'none' : '1px solid #E5E7EB',
                      whiteSpace: 'nowrap',
                      minHeight: 40,
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 2px 6px rgba(255, 121, 0, 0.3)' : 'none',
                    }}
                  >
                    <span>{tab.label}</span>
                    {tab.badge !== null && tab.badge > 0 && (
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 900,
                          padding: '1px 6px',
                          borderRadius: 10,
                          background: isActive ? 'rgba(0,0,0,0.25)' : tab.isAlert ? '#FF7900' : '#E5E7EB',
                          color: isActive ? '#FFFFFF' : tab.isAlert ? '#FFFFFF' : '#4B5563',
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

          {/* 5. Rendu Dynamique des 7 Sections Client */}
          {clientTab === 'cockpit' && (
            <ClientTrafficCockpit
              dossiers={clientDossiers}
              validations={clientValidations}
              recommendations={clientRecommendations}
              calendarItems={clientCalendarItems}
              onNavigateTab={setClientTab}
              onOpenValidation={(val) => {
                setSelectedClientValidation(val);
                setValidationModalActionType('commenter');
              }}
              onOpenDossier={setSelectedClientDossier}
              onOpenNewBrief={() => setIsClientNewBriefOpen(true)}
            />
          )}

          {clientTab === 'travaux' && (
            <ClientTrafficPortfolio
              dossiers={clientDossiers}
              onOpenDossier={setSelectedClientDossier}
              onOpenNewBrief={() => setIsClientNewBriefOpen(true)}
              selectedEntity={selectedEntity}
              selectedUniverse={selectedUniverse}
            />
          )}

          {clientTab === 'calendrier' && (
            <ClientTrafficSharedCalendar
              calendarItems={clientCalendarItems}
              onOpenContentDetail={setSelectedClientContent}
              onOpenNewContent={() => setIsClientNewBriefOpen(true)}
              selectedEntity={selectedEntity}
            />
          )}

          {clientTab === 'recommandations' && (
            <ClientTrafficRecommendations
              recommendations={clientRecommendations}
              onUpdateDecision={handleUpdateRecommendationDecision}
              onOpenNewProposal={() => setIsClientNewBriefOpen(true)}
              selectedEntity={selectedEntity}
            />
          )}

          {clientTab === 'validations' && (
            <ClientTrafficValidationCenter
              validations={clientValidations}
              onOpenValidationModal={(val, action) => {
                setSelectedClientValidation(val);
                setValidationModalActionType(action);
              }}
              onQuickApprove={handleQuickApproveValidation}
              selectedEntity={selectedEntity}
            />
          )}

          {clientTab === 'livrables' && (
            <ClientTrafficLivrables
              livrables={clientLivrables}
              selectedEntity={selectedEntity}
              selectedPeriod={selectedPeriod}
            />
          )}

          {clientTab === 'gouvernance' && (
            <ClientTrafficGovernance />
          )}

          {/* 6. Modals Dédiés Client */}
          <ClientNewBriefModal
            isOpen={isClientNewBriefOpen}
            onClose={() => setIsClientNewBriefOpen(false)}
            onSubmitBrief={handleSubmitNewBrief}
          />

          <ClientDossierDetailModal
            dossier={selectedClientDossier}
            isOpen={Boolean(selectedClientDossier)}
            onClose={() => setSelectedClientDossier(null)}
          />

          <ClientValidationModal
            validation={selectedClientValidation}
            actionType={validationModalActionType}
            isOpen={Boolean(selectedClientValidation)}
            onClose={() => setSelectedClientValidation(null)}
            onSubmitAction={handleSubmitValidationAction}
          />

          <ClientContentDetailModal
            content={selectedClientContent}
            isOpen={Boolean(selectedClientContent)}
            onClose={() => setSelectedClientContent(null)}
          />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🅱️ RENDU VUE AGENCE (INTERNE MCCANN)                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeViewMode === 'agency' && (
        <div className="agency-traffic-view-container space-y-20 animate-fade">
          {/* The Visual Bridge Switchboard Ribbon (Vue Agence) */}
          <BridgeSwitchboardRibbon
            tickets={tickets}
            activeFilterStatus={selectedStatusFilter}
            onSelectStatus={setSelectedStatusFilter}
          />

          {/* Role & Permissions Banner */}
          <RolePerspectiveBanner
            currentRole={currentAgencyRole}
            onChangeRole={setCurrentAgencyRole}
            selectedExecutantId={selectedExecutantId}
            onChangeExecutant={setSelectedExecutantId}
            onOpenNewTicket={() => setIsNewTicketOpen(true)}
          />

          {/* Main Tabs & Responsive Filter Switchboard */}
          <div className="card mb-20 p-12" style={{ borderRadius: 12 }}>
            <div className="flex justify-between items-center flex-wrap gap-12">
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
                    aria-selected={agencyActiveTab === tab.id}
                    onClick={() => setAgencyActiveTab(tab.id)}
                    className="btn btn-sm"
                    style={{
                      background: agencyActiveTab === tab.id ? '#1E293B' : 'transparent',
                      color: agencyActiveTab === tab.id ? '#FFFFFF' : 'var(--dark)',
                      fontWeight: 700,
                      borderRadius: 6,
                      border: agencyActiveTab === tab.id ? 'none' : '1px solid #E5E7EB',
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

              <div className="filter-accordion-toggle-wrap">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm filter-mobile-toggle"
                  onClick={() => setIsFilterAccordionOpen(!isFilterAccordionOpen)}
                  aria-expanded={isFilterAccordionOpen}
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

          {/* Active Tab View Rendering (Vue Agence) */}
          {agencyActiveTab === 'kanban' && (
            <TrafficKanbanView
              tickets={tickets}
              currentRole={currentAgencyRole}
              activeExecutantId={selectedExecutantId}
              selectedStatusFilter={selectedStatusFilter}
              selectedPoleFilter={selectedPoleFilter}
              searchQuery={searchQuery}
              onSelectTicket={setSelectedTicket}
              onUpdateStatus={updateTicketStatus}
              onOpenNewTicket={() => setIsNewTicketOpen(true)}
            />
          )}

          {agencyActiveTab === 'chronos' && (
            <TrafficChronosTimeline
              tickets={tickets}
              onSelectTicket={setSelectedTicket}
            />
          )}

          {agencyActiveTab === 'load' && (
            <TrafficCompetencesAndLoad
              tickets={tickets}
              onReassignTicket={reassignTicket}
              onSelectTicket={setSelectedTicket}
            />
          )}

          {agencyActiveTab === 'dependencies' && (
            <TrafficDependenciesView
              tickets={tickets}
              onSelectTicket={setSelectedTicket}
            />
          )}

          {agencyActiveTab === 'alerts' && (
            <TrafficSmartAlerts
              tickets={tickets}
              onSelectTicket={setSelectedTicket}
              onResolveBlockage={resolveTicketBlockage}
            />
          )}

          {/* Ticket Detail & Action Modal (Vue Agence) */}
          {selectedTicket && (
            <TicketDetailModal
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
              currentRole={currentAgencyRole}
              activeExecutantId={selectedExecutantId}
              onUpdateStatus={updateTicketStatus}
              onReassign={reassignTicket}
              onUpdateTicket={updateTicket}
              onReportBlockage={reportTicketBlockage}
              onResolveBlockage={resolveTicketBlockage}
              onLogHours={logTicketHours}
            />
          )}

          {/* New Ticket / Brief Modal (Vue Agence) */}
          {isNewTicketOpen && (
            <NewTicketModal
              currentRole={currentAgencyRole}
              onClose={() => setIsNewTicketOpen(false)}
              onAddTicket={addTicket}
            />
          )}

          {/* Weekly Digest Modal (Vue Agence) */}
          {isWeeklyReportOpen && (
            <WeeklyTrafficReportModal
              tickets={tickets}
              onClose={() => setIsWeeklyReportOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

