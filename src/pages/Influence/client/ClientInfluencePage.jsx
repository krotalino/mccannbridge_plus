import React, { useState } from 'react';
import ClientInfluenceSwitchboardRibbon from './ClientInfluenceSwitchboardRibbon';
import ClientInfluencePerspectiveBanner from './ClientInfluencePerspectiveBanner';
import ClientInfluenceContextBar from './ClientInfluenceContextBar';
import ClientCockpitInfluence from './ClientCockpitInfluence';
import ClientTalentsAmbassadeurs from './ClientTalentsAmbassadeurs';
import ClientCampagnesActivations from './ClientCampagnesActivations';
import ClientCalendrierContenus from './ClientCalendrierContenus';
import ClientValidationsConformite from './ClientValidationsConformite';
import ClientReportingAnalyses from './ClientReportingAnalyses';
import ClientVeilleRecommandations from './ClientVeilleRecommandations';

// Modals
import ClientTalentDetailModal from './modals/ClientTalentDetailModal';
import ClientCampaignDetailModal from './modals/ClientCampaignDetailModal';
import ClientValidationModal from './modals/ClientValidationModal';
import ClientContentDetailModal from './modals/ClientContentDetailModal';
import ClientRecommendationModal from './modals/ClientRecommendationModal';

// Initial Data
import {
  INITIAL_CLIENT_COCKPIT_KPIS,
  INITIAL_CLIENT_A_RETENIR,
  INITIAL_CLIENT_TALENTS,
  INITIAL_CLIENT_CAMPAIGNS,
  INITIAL_CLIENT_CALENDAR_ITEMS,
  INITIAL_CLIENT_VALIDATIONS,
  INITIAL_CLIENT_ALERTS,
  INITIAL_CLIENT_REPORTING,
  INITIAL_CLIENT_RECOMMENDATIONS
} from '../../../data/clientInfluenceData';

export default function ClientInfluencePage({ onSwitchToAgencyView }) {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState('cockpit');
  const [currentRole, setCurrentRole] = useState('chef_de_marque');
  const [lastSyncTime, setLastSyncTime] = useState('14:32:05');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    entity: 'all',
    network: 'all',
    talentType: 'all',
    objective: 'all',
    status: 'all',
    period: 'all',
    campaignId: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Domain Data State
  const [kpis, setKpis] = useState(INITIAL_CLIENT_COCKPIT_KPIS);
  const [aRetenir, setARetenir] = useState(INITIAL_CLIENT_A_RETENIR);
  const [talents, setTalents] = useState(INITIAL_CLIENT_TALENTS);
  const [campaigns, setCampaigns] = useState(INITIAL_CLIENT_CAMPAIGNS);
  const [calendarItems, setCalendarItems] = useState(INITIAL_CLIENT_CALENDAR_ITEMS);
  const [validations, setValidations] = useState(INITIAL_CLIENT_VALIDATIONS);
  const [alerts, setAlerts] = useState(INITIAL_CLIENT_ALERTS);
  const [reportingData, setReportingData] = useState(INITIAL_CLIENT_REPORTING);
  const [recommendations, setRecommendations] = useState(INITIAL_CLIENT_RECOMMENDATIONS);

  // Modals State
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [validationModalItem, setValidationModalItem] = useState(null);
  const [validationModalAction, setValidationModalAction] = useState('commenter');

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      entity: 'all',
      network: 'all',
      talentType: 'all',
      objective: 'all',
      status: 'all',
      period: 'all',
      campaignId: 'all'
    });
    setSearchQuery('');
  };

  // Actions & Updates
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString('fr-FR'));
      setIsRefreshing(false);
    }, 450);
  };

  const handleExport = () => {
    const reportText = `PORTEFEUILLE INFLUENCE ORANGE CAMEROUN — EXTRACTION CERTIFIÉE\nDate: ${new Date().toLocaleString('fr-FR')}\nTalents Actifs: ${kpis.talentsActifs}\nActivations en cours: ${kpis.activationsEnCours}\nPortée Cumulée: ${kpis.porteeCumulee}\nDécisions Orange en attente: ${validations.filter(v => v.status === 'en_attente').length}`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporting_Influence_Orange_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleNewBrief = () => {
    setActiveTab('validations');
  };

  // Validation handlers
  const handleArbitrateValidation = (id, newStatus) => {
    setValidations(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            checklist: {
              ...item.checklist,
              validationOrangeObtenue: newStatus === 'approuve'
            }
          };
        }
        return item;
      })
    );
  };

  const handleOpenValidationModal = (item, action) => {
    setValidationModalItem(item);
    setValidationModalAction(action);
  };

  const handleConfirmValidationModal = (id, action, comment, checklist) => {
    setValidations(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: action === 'commenter' ? item.status : action,
            checklist: checklist,
            lastComment: comment || item.lastComment
          };
        }
        return item;
      })
    );
  };

  // Recommendation status update
  const handleUpdateRecommendationStatus = (id, newStatus) => {
    setRecommendations(prev =>
      prev.map(rec => {
        if (rec.id === id) {
          return {
            ...rec,
            statutDecisionOrange: newStatus,
            statutLabel:
              newStatus === 'accepte' ? 'Accepté par Orange (Mise en œuvre)' :
              newStatus === 'en_test' ? 'En cours de test (Phase pilote)' :
              newStatus === 'cloture' ? 'Clôturé / Archivé' : 'À examiner par Orange'
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="client-influence-page animate-fade" style={{ paddingBottom: 40 }}>
      {/* ─── 1. SWITCHBOARD RIBBON (NOCTURNE & DÉCISIONNEL) ─── */}
      <ClientInfluenceSwitchboardRibbon
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lastSyncTime={lastSyncTime}
        kpis={kpis}
        selectedEntity={filters.entity}
      />

      {/* ─── 2. BANDEAU DE PERSPECTIVES CLIENT ORANGE ─── */}
      <ClientInfluencePerspectiveBanner
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onNewBrief={handleNewBrief}
        isRefreshing={isRefreshing}
      />

      {/* ─── 3. BANDEAU DE FILTRES MULTI-CRITÈRES DU CAHIER DES CHARGES ─── */}
      <ClientInfluenceContextBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campaigns={campaigns}
      />

      {/* ─── 4. ONGLET 1 : COCKPIT 360° (9 KPI + BLOC À RETENIR + ALERTES) ─── */}
      {activeTab === 'cockpit' && (
        <ClientCockpitInfluence
          kpis={kpis}
          aRetenir={aRetenir}
          campaigns={campaigns}
          alerts={alerts}
          onNavigateTab={setActiveTab}
          onSelectCampaign={setSelectedCampaign}
          onSelectValidation={(v) => handleOpenValidationModal(v, 'approuve')}
        />
      )}

      {/* ─── 5. ONGLET 2 : CATALOGUE TALENTS & AMBASSADEURS ─── */}
      {activeTab === 'talents' && (
        <ClientTalentsAmbassadeurs
          talents={talents}
          onSelectTalent={setSelectedTalent}
          searchQuery={searchQuery}
          selectedCategory={filters.talentType}
        />
      )}

      {/* ─── 6. ONGLET 3 : CAMPAGNES & ACTIVATIONS ─── */}
      {activeTab === 'campagnes' && (
        <ClientCampagnesActivations
          campaigns={campaigns}
          onSelectCampaign={setSelectedCampaign}
          onNavigateTab={setActiveTab}
          selectedEntity={filters.entity}
        />
      )}

      {/* ─── 7. ONGLET 4 : CALENDRIER & CONTENUS ─── */}
      {activeTab === 'calendrier' && (
        <ClientCalendrierContenus
          calendarItems={calendarItems}
          onSelectContent={setSelectedContent}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* ─── 8. ONGLET 5 : VALIDATIONS & CONFORMITÉ ORANGE ─── */}
      {activeTab === 'validations' && (
        <ClientValidationsConformite
          validations={validations}
          alerts={alerts}
          onArbitrateValidation={handleArbitrateValidation}
          onOpenValidationModal={handleOpenValidationModal}
        />
      )}

      {/* ─── 9. ONGLET 6 : REPORTING ANALYTIQUE & BEST PERFORMERS ─── */}
      {activeTab === 'reporting' && (
        <ClientReportingAnalyses
          reportingData={reportingData}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* ─── 10. ONGLET 7 : VEILLE & RECOMMANDATIONS (6 POINTS) ─── */}
      {activeTab === 'veille' && (
        <ClientVeilleRecommandations
          recommendations={recommendations}
          onUpdateRecommendationStatus={handleUpdateRecommendationStatus}
          onOpenRecommendationModal={setSelectedRecommendation}
        />
      )}

      {/* ─── MODALES INTERACTIVES ─── */}
      {selectedTalent && (
        <ClientTalentDetailModal
          talent={selectedTalent}
          onClose={() => setSelectedTalent(null)}
        />
      )}

      {selectedCampaign && (
        <ClientCampaignDetailModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onNavigateTab={setActiveTab}
        />
      )}

      {selectedContent && (
        <ClientContentDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onNavigateTab={setActiveTab}
        />
      )}

      {validationModalItem && (
        <ClientValidationModal
          item={validationModalItem}
          initialAction={validationModalAction}
          onClose={() => setValidationModalItem(null)}
          onConfirm={handleConfirmValidationModal}
        />
      )}

      {selectedRecommendation && (
        <ClientRecommendationModal
          recommendation={selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
          onUpdateStatus={handleUpdateRecommendationStatus}
        />
      )}
    </div>
  );
}
