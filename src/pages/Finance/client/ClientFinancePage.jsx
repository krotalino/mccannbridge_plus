import React, { useState } from 'react';
import {
  CLIENT_COCKPIT_KPIS,
  DECISIONS_PRIORITAIRES,
  CLIENT_FINANCIAL_DOCUMENTS,
  CLIENT_PIPELINE_DOSSIERS,
  CLIENT_FINANCIAL_ACTIONS,
  CLIENT_FINANCIAL_ALERTS,
  CLIENT_FORECAST_SCENARIOS,
  CLIENT_AUDIT_LOGS,
  CAMPAIGN_FINANCE_CARDS,
  CURRENCY_RATES,
} from '../../../data/clientFinanceData';

// Composants de la Vue Client
import ClientFinanceSwitchboardRibbon from './ClientFinanceSwitchboardRibbon';
import ClientFinancePerspectiveBanner from './ClientFinancePerspectiveBanner';
import ClientFinanceContextBar from './ClientFinanceContextBar';
import ClientCockpitFinance from './ClientCockpitFinance';
import ClientBudgetPerformance from './ClientBudgetPerformance';
import ClientOperationsDocuments from './ClientOperationsDocuments';
import ClientFacturationEcheancier from './ClientFacturationEcheancier';
import ClientValidationsApprobations from './ClientValidationsApprobations';
import ClientPrevisionsAlertes from './ClientPrevisionsAlertes';
import ClientReportingAudit from './ClientReportingAudit';

// Modals
import ClientFinancialActionModal from './modals/ClientFinancialActionModal';
import ClientDocumentDetailModal from './modals/ClientDocumentDetailModal';
import ClientCampaignBudgetModal from './modals/ClientCampaignBudgetModal';
import ClientReallocationSimulatorModal from './modals/ClientReallocationSimulatorModal';
import ClientFinanceExportModal from './modals/ClientFinanceExportModal';

export default function ClientFinancePage() {
  // Navigation active parmi les 7 sections du Cahier des Charges
  const [activeTab, setActiveTab] = useState('cockpit'); // 'cockpit' | 'budget_performance' | 'operations_docs' | 'facturation_pipeline' | 'validations_actions' | 'previsions_alertes' | 'reporting_audit'

  // Perspective client active
  const [perspective, setPerspective] = useState('valideur_orange'); // 'valideur_orange' | 'controleur_gestion' | 'lecteur_orange' | 'admin_orange'

  // Devise active (FCFA, EUR, USD)
  const [currency, setCurrency] = useState('FCFA');

  // Filtres globaux (Page 1 du cahier des charges)
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('s38_2026');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedBudgetLine, setSelectedBudgetLine] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // États dynamiques
  const [kpis, setKpis] = useState(CLIENT_COCKPIT_KPIS);
  const [decisions, setDecisions] = useState(DECISIONS_PRIORITAIRES);
  const [documents, setDocuments] = useState(CLIENT_FINANCIAL_DOCUMENTS);
  const [actions, setActions] = useState(CLIENT_FINANCIAL_ACTIONS);
  const [alerts, setAlerts] = useState(CLIENT_FINANCIAL_ALERTS);
  const [auditLogs, setAuditLogs] = useState(CLIENT_AUDIT_LOGS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [actionModalItem, setActionModalItem] = useState(null);
  const [actionModalType, setActionModalType] = useState('valider');
  const [selectedDocForDetail, setSelectedDocForDetail] = useState(null);
  const [selectedCampaignForModal, setSelectedCampaignForModal] = useState(null);
  const [isReallocationOpen, setIsReallocationOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Formateur monétaire selon devise
  const formatMoney = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0 FCFA';
    const rate = CURRENCY_RATES[currency] || 1;
    const converted = amount * rate;

    if (currency === 'FCFA') {
      return `${Math.round(converted).toLocaleString('fr-FR')} FCFA`;
    }
    if (currency === 'EUR') {
      return `${Math.round(converted).toLocaleString('fr-FR')} €`;
    }
    if (currency === 'USD') {
      return `${Math.round(converted).toLocaleString('fr-FR')} $`;
    }
    return `${Math.round(converted).toLocaleString('fr-FR')} ${currency}`;
  };

  // Rafraîchissement simulé avec feedback
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Réinitialisation des filtres
  const handleResetFilters = () => {
    setSelectedEntity('all');
    setSelectedPeriod('s38_2026');
    setSelectedCampaign('all');
    setSelectedBudgetLine('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  // Traitement d'une action financière avec mise à jour du journal d'audit
  const handleCompleteAction = ({ actionId, type, comment, signed }) => {
    // Retirer ou mettre à jour l'action
    setActions((prev) => prev.filter((a) => a.id !== actionId && a.reference !== actionId));

    // Ajouter une ligne dans l'audit log
    const newLog = {
      id: `log_${Date.now()}`,
      date: 'Aujourd’hui à ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      acteur: 'Utilisateur Orange (Valideur)',
      role: 'Valideur Orange',
      action: type === 'valider' ? 'Approbation & Signature' : type === 'refuser' ? 'Demande de correction' : 'Commentaire déposé',
      detail: `${comment || 'Opération enregistrée sans réserve'} ${signed ? '(Signature certifiée)' : ''}`,
      statut: 'Conforme',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Mettre à jour les KPI
    setKpis((prev) => ({
      ...prev,
      enAttenteValidationCount: Math.max(0, prev.enAttenteValidationCount - 1),
    }));
  };

  // Application d'un arbitrage réallocation
  const handleApplyArbitrage = ({ source, target, montant }) => {
    const newLog = {
      id: `log_${Date.now()}`,
      date: 'Aujourd’hui à ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      acteur: 'Utilisateur Orange (Contrôleur)',
      role: 'Contrôleur de Gestion Orange',
      action: 'Arbitrage Réallocation Média',
      detail: `Transfert de ${formatMoney(montant)} depuis « ${source} » vers « ${target} » soumis à l’équipe McCann.`,
      statut: 'En cours',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Clic sur une décision prioritaire
  const handleSelectDecision = (dec, buttonType) => {
    if (dec.type === 'arbitrage_budget') {
      setIsReallocationOpen(true);
    } else if (dec.type === 'validation_piece') {
      const doc = documents.find((d) => d.reference === 'PRF-2026-0092') || documents[1];
      if (buttonType === 'primary') {
        setActionModalItem(doc);
        setActionModalType('valider');
      } else {
        setSelectedDocForDetail(doc);
      }
    } else if (dec.type === 'echeance_proche') {
      if (buttonType === 'primary') {
        const act = actions.find((a) => a.id === 'act_3') || actions[0];
        setActionModalItem(act);
        setActionModalType('valider');
      } else {
        setActiveTab('facturation_pipeline');
      }
    }
  };

  // Filtrage des documents selon filtres globaux
  const filteredDocuments = documents.filter((doc) => {
    if (selectedEntity !== 'all') {
      if (selectedEntity === 'orange_cameroun' && !doc.clientEntite.includes('Orange Cameroun')) return false;
      if (selectedEntity === 'orange_money' && !doc.clientEntite.includes('Orange Money')) return false;
      if (selectedEntity === 'orange_business' && !doc.clientEntite.includes('Business')) return false;
    }
    if (selectedCampaign !== 'all') {
      if (selectedCampaign === 'mayi_2026' && !doc.campagne.includes('Mayi')) return false;
      if (selectedCampaign === 'pulse_generation' && !doc.campagne.includes('Pulse')) return false;
      if (selectedCampaign === 'om_kiff' && !doc.campagne.includes('Orange Money')) return false;
      if (selectedCampaign === 'biz_connect' && !doc.campagne.includes('Cloud')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = doc.reference.toLowerCase().includes(q);
      const matchCampagne = doc.campagne.toLowerCase().includes(q);
      const matchType = doc.typeLabel.toLowerCase().includes(q);
      if (!matchRef && !matchCampagne && !matchType) return false;
    }
    return true;
  });

  return (
    <div className="client-finance-container" style={{ padding: '0 4px' }}>
      {/* ─── BANDEAU DE PERSPECTIVE CLIENT & CONTRÔLES ─── */}
      <ClientFinancePerspectiveBanner
        currentPerspective={perspective}
        onChangePerspective={setPerspective}
        currency={currency}
        onChangeCurrency={setCurrency}
        onOpenExport={() => setIsExportOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* ─── RUBAN SWITCHBOARD DES 7 SECTIONS DU CAHIER DES CHARGES ─── */}
      <ClientFinanceSwitchboardRibbon
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        kpis={kpis}
        decisionsCount={decisions.length}
        validationsCount={actions.length}
        alertesCount={alerts.length}
      />

      {/* ─── BARRE DE CONTEXTE ET FILTRES GLOBAUX ─── */}
      <ClientFinanceContextBar
        selectedEntity={selectedEntity}
        onChangeEntity={setSelectedEntity}
        selectedPeriod={selectedPeriod}
        onChangePeriod={setSelectedPeriod}
        selectedCampaign={selectedCampaign}
        onChangeCampaign={setSelectedCampaign}
        selectedBudgetLine={selectedBudgetLine}
        onChangeBudgetLine={setSelectedBudgetLine}
        selectedStatus={selectedStatus}
        onChangeStatus={setSelectedStatus}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        onResetFilters={handleResetFilters}
      />

      {/* ─── RENDU DE LA SECTION ACTIVE DU CAHIER DES CHARGES ─── */}
      <main style={{ marginTop: 16 }}>
        {/* Section 1 : Cockpit Financier */}
        {activeTab === 'cockpit' && (
          <ClientCockpitFinance
            kpis={kpis}
            decisions={decisions}
            currency={currency}
            formatMoney={formatMoney}
            onNavigateTab={setActiveTab}
            onSelectDecision={handleSelectDecision}
            onOpenReallocationSimulator={() => setIsReallocationOpen(true)}
          />
        )}

        {/* Section 2 : Budget & Performance */}
        {activeTab === 'budget_performance' && (
          <ClientBudgetPerformance
            formatMoney={formatMoney}
            onOpenCampaignModal={(cmp) => setSelectedCampaignForModal(cmp)}
            onOpenReallocationSimulator={() => setIsReallocationOpen(true)}
          />
        )}

        {/* Section 3 : Opérations & Documents */}
        {activeTab === 'operations_docs' && (
          <ClientOperationsDocuments
            documents={filteredDocuments}
            formatMoney={formatMoney}
            onOpenDocumentDetail={(doc) => setSelectedDocForDetail(doc)}
            onOpenActionModal={(doc) => {
              setActionModalItem(doc);
              setActionModalType('valider');
            }}
          />
        )}

        {/* Section 4 : Facturation Client & Échéancier */}
        {activeTab === 'facturation_pipeline' && (
          <ClientFacturationEcheancier
            dossiers={CLIENT_PIPELINE_DOSSIERS}
            formatMoney={formatMoney}
            onOpenDocumentDetail={(doc) => setSelectedDocForDetail(doc)}
          />
        )}

        {/* Section 5 : Validations & Approbations */}
        {activeTab === 'validations_actions' && (
          <ClientValidationsApprobations
            actions={actions}
            formatMoney={formatMoney}
            onOpenActionModal={(act, type = 'valider') => {
              setActionModalItem(act);
              setActionModalType(type);
            }}
          />
        )}

        {/* Section 6 : Prévisions & Alertes */}
        {activeTab === 'previsions_alertes' && (
          <ClientPrevisionsAlertes
            alerts={alerts}
            forecastData={CLIENT_FORECAST_SCENARIOS}
            formatMoney={formatMoney}
            onOpenReallocationSimulator={() => setIsReallocationOpen(true)}
            onOpenActionModal={(act) => {
              setActionModalItem(act);
              setActionModalType('valider');
            }}
          />
        )}

        {/* Section 7 : Reporting & Audit */}
        {activeTab === 'reporting_audit' && (
          <ClientReportingAudit
            auditLogs={auditLogs}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* ─── MODALS CLIENTS DÉDIÉS ─── */}
      {actionModalItem && (
        <ClientFinancialActionModal
          action={actionModalItem}
          actionType={actionModalType}
          onClose={() => setActionModalItem(null)}
          onSubmit={handleCompleteAction}
          formatMoney={formatMoney}
        />
      )}

      {selectedDocForDetail && (
        <ClientDocumentDetailModal
          document={selectedDocForDetail}
          onClose={() => setSelectedDocForDetail(null)}
          formatMoney={formatMoney}
          onOpenActionModal={(doc) => {
            setActionModalItem(doc);
            setActionModalType('valider');
          }}
        />
      )}

      {selectedCampaignForModal && (
        <ClientCampaignBudgetModal
          campaign={selectedCampaignForModal}
          onClose={() => setSelectedCampaignForModal(null)}
          formatMoney={formatMoney}
          onOpenDocumentDetail={(doc) => setSelectedDocForDetail(doc)}
        />
      )}

      {isReallocationOpen && (
        <ClientReallocationSimulatorModal
          onClose={() => setIsReallocationOpen(false)}
          formatMoney={formatMoney}
          onApplyArbitrage={handleApplyArbitrage}
        />
      )}

      {isExportOpen && (
        <ClientFinanceExportModal
          onClose={() => setIsExportOpen(false)}
          formatMoney={formatMoney}
        />
      )}
    </div>
  );
}
