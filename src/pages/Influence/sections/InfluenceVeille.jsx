import { useState, useEffect, useMemo } from 'react';
import {
  loadStrategicWatchItems,
  saveStrategicWatchItems,
  loadWatchlists,
  saveWatchlists,
  loadWatchAlerts,
  saveWatchAlerts,
  loadCompetitors,
  saveCompetitors,
  computeCockpitMetrics,
  generateSimulatedSyncRun,
  RBAC_ROLES,
} from './veille/veilleUtils.js';

import CockpitView from './veille/CockpitView.jsx';
import FluxVeilleView from './veille/FluxVeilleView.jsx';
import VeilleInfluenceursCampagnesView from './veille/VeilleInfluenceursCampagnesView.jsx';
import TableauBordConcurrentielView from './veille/TableauBordConcurrentielView.jsx';
import TendancesReglementationView from './veille/TendancesReglementationView.jsx';
import WatchlistsAlertesView from './veille/WatchlistsAlertesView.jsx';
import InsightTransformationModal from './veille/InsightTransformationModal.jsx';
import AddWatchItemModal from './veille/AddWatchItemModal.jsx';
import { exportStrategicWatchPdf } from './veille/exportVeillePdf.js';

export default function InfluenceVeille({ influencers = [], setInfluencers }) {
  // ─── 1. ÉTAT LOCAL ET PERSISTANCE ───
  const [watchItems, setWatchItems] = useState(() => loadStrategicWatchItems());
  const [watchlists, setWatchlists] = useState(() => loadWatchlists());
  const [alerts, setAlerts] = useState(() => loadWatchAlerts());
  const [competitors, setCompetitors] = useState(() => loadCompetitors());

  // Navigation interne dans la section Veille Stratégique
  const [subTab, setSubTab] = useState('cockpit'); // 'cockpit' | 'flux' | 'talents_campagnes' | 'concurrents' | 'tendances_macro' | 'watchlists_alertes'

  // Gestion du rôle actif (RBAC)
  const [currentRole, setCurrentRole] = useState('influence_manager');

  // Modals
  const [transformModalItem, setTransformModalItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState('');

  // Sauvegardes synchronisées
  useEffect(() => {
    saveStrategicWatchItems(watchItems);
  }, [watchItems]);

  useEffect(() => {
    saveWatchlists(watchlists);
  }, [watchlists]);

  useEffect(() => {
    saveWatchAlerts(alerts);
  }, [alerts]);

  useEffect(() => {
    saveCompetitors(competitors);
  }, [competitors]);

  // Calcul dynamique des métriques du cockpit
  const metrics = useMemo(() => {
    return computeCockpitMetrics(watchItems, alerts, competitors, influencers);
  }, [watchItems, alerts, competitors, influencers]);

  // Rôle configuration
  const roleConfig = RBAC_ROLES[currentRole] || RBAC_ROLES.influence_manager;

  // ─── 2. HANDLERS OPÉRATIONNELS ───
  const handleAddItem = (newItem) => {
    setWatchItems(prev => [newItem, ...prev]);
    showToast(`✓ Nouveau signal « ${newItem.title.substring(0, 30)}... » ajouté avec succès`);
  };

  const handleResolveAlert = (alertId, note) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'resolu',
          resolution_note: note || 'Résolu et archivé',
          resolved_at: new Date().toISOString()
        };
      }
      return a;
    }));
    showToast(`✓ Alerte #${alertId} marquée comme résolue`);
  };

  const handleMarkItemRead = (itemId) => {
    setWatchItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status: 'lu', updated_at: new Date().toISOString() };
      }
      return item;
    }));
  };

  const handleDeleteItem = (itemId) => {
    if (confirm('Supprimer définitivement ce signal de veille ?')) {
      setWatchItems(prev => prev.filter(i => i.id !== itemId));
      showToast('Signal supprimé');
    }
  };

  const handleSaveWatchlist = (newWl) => {
    setWatchlists(prev => [newWl, ...prev]);
    showToast(`✓ Watchlist « ${newWl.name} » enregistrée`);
  };

  const handleSaveCompetitor = (updatedComp) => {
    setCompetitors(prev => prev.map(c => c.id === updatedComp.id ? updatedComp : c));
    showToast(`✓ Données concurrentielles de « ${updatedComp.name} » mises à jour`);
  };

  const handleRunSimulatedSync = () => {
    const runResult = generateSimulatedSyncRun();
    // Injecte éventuellement un signal automatique de démonstration
    const autoSignal = {
      id: `SW-AUTO-${Date.now().toString().slice(-4)}`,
      type: 'competitor',
      title: 'Campagne Flash MTN 100% Bonus Nuit détectée sur TikTok',
      summary: 'Plusieurs influenceurs comédie relaient simultanément le code USSD *126# avec un jingle propriétaire.',
      content: 'Observation automatisée via écoute des hashtags #MTNMoMo et #CamerounTikTok.',
      source_name: 'TikTok Creator Monitor (Auto)',
      source_url: 'https://tiktok.com',
      source_type: 'automated',
      published_at: new Date().toISOString(),
      collected_at: new Date().toISOString(),
      freshness_status: 'en_temps_reel',
      reliability_level: 'A_CONFIRMEE',
      relevance_score: 92,
      confidence_level: 'Confirmé',
      geographic_scope: 'Cameroun',
      platform: 'tiktok',
      themes: ['Offensive Tarifaire', 'Promotion Nuit'],
      associated_competitor_ids: ['COMP-MTN-CM'],
      status: 'nouveau',
      priority: 'critique',
      recommended_action: 'Préparer un push SMS ou Dark Post riposte sur l’offre Orange Bonus Nuit.',
      opportunity_or_risk: 'risk',
      created_at: new Date().toISOString()
    };

    setWatchItems(prev => [autoSignal, ...prev]);
    showToast(`⚡ Synchronisation réussie : ${runResult.rows_created} nouveaux signaux détectés en temps réel !`);
    return runResult;
  };

  const handleExportPdf = () => {
    exportStrategicWatchPdf({
      watchItems,
      alerts,
      competitors,
      activeRole: currentRole,
      filterLabel: subTab === 'cockpit' ? 'Vue Globale Cockpit' : subTab,
      metrics
    });
    showToast('📄 Téléchargement du rapport PDF officiel Orange Cameroun lancé...');
  };

  const showToast = (msg) => {
    setNotificationBanner(msg);
    setTimeout(() => {
      setNotificationBanner('');
    }, 3800);
  };

  // ─── 3. NAVIGATION DANS LES SOUS-ONGLETS ───
  const subTabs = [
    { id: 'cockpit', label: '🔭 Cockpit Décisionnel', count: null },
    { id: 'flux', label: '📡 Flux de Veille', count: watchItems.length },
    { id: 'talents_campagnes', label: '👤 Suivi Talents & Campagnes', count: influencers.length },
    { id: 'concurrents', label: '⚔️ Veille Concurrence (MTN, Camtel)', count: competitors.length },
    { id: 'tendances_macro', label: '📱 Formats & Réglementation', count: null },
    { id: 'watchlists_alertes', label: '🚨 Alertes & Watchlists', count: alerts.filter(a => a.status !== 'resolu').length, badgeColor: '#DC3545' },
  ];

  return (
    <div className="section-influence-veille">
      {/* Toast de notification flottant */}
      {notificationBanner && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 999999,
          background: '#1A1A1A',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          borderLeft: '4px solid #FF7900',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span>{notificationBanner}</span>
        </div>
      )}

      {/* ─── BARRE SUPÉRIEURE DE CONTRÔLE : ACTIONS & RBAC ─── */}
      <div className="card mb-16 p-14 flex flex-wrap items-center justify-between gap-12" style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 8
      }}>
        <div>
          <div className="flex items-center gap-8 mb-2">
            <h2 className="text-lg font-bold text-dark">Module Veille Stratégique & Radar Influence</h2>
            <span className="tag" style={{ background: '#FFF3E0', color: '#FF7900', fontWeight: 700, fontSize: 11 }}>
              Orange Cameroun • McCANN
            </span>
          </div>
          <p className="text-xs text-muted">
            Veille décisionnelle 360° : talents, campagnes, concurrents télécoms, formats émergents et conformité légale.
          </p>
        </div>

        {/* Contrôles globaux : Ajout, Export PDF, Rôle RBAC */}
        <div className="flex flex-wrap items-center gap-8">
          {/* Sélecteur de Rôle RBAC */}
          <div className="flex items-center gap-6 p-4 rounded" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
            <span className="text-xs text-muted font-semibold">Profil actif :</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="input text-xs font-bold"
              style={{ padding: '3px 8px', fontSize: 11, background: '#fff', border: '1px solid #ddd', borderRadius: 4 }}
            >
              <option value="influence_manager">👑 Influence Manager</option>
              <option value="chef_projet_digital">💼 Chef de Projet Digital</option>
              <option value="digital_analyst">📊 Digital Web Analyst</option>
              <option value="community_manager">💬 Community Manager</option>
              <option value="direction_agence">🏛️ Direction Agence</option>
              <option value="client_orange">🍊 Client Lead Orange Cameroun</option>
            </select>
            <span className="tag tag-white text-xs" style={{ fontSize: 9 }}>
              {roleConfig.badge}
            </span>
          </div>

          {/* Bouton Export PDF Officiel */}
          <button
            onClick={handleExportPdf}
            className="btn btn-white btn-sm flex items-center gap-6"
            title="Exporter le bulletin officiel au format PDF charté Orange Cameroun"
            style={{ fontWeight: 600, border: '1px solid #D1D5DB' }}
          >
            <span>📄</span>
            <span>Export PDF Charté</span>
          </button>

          {/* Bouton Synchro Rapide */}
          <button
            onClick={handleRunSimulatedSync}
            className="btn btn-white btn-sm flex items-center gap-6"
            title="Interroger les APIs et sources officielles en arrière-plan"
            style={{ fontWeight: 600, border: '1px solid #D1D5DB' }}
          >
            <span>⚡</span>
            <span>Synchro APIs</span>
          </button>

          {/* Bouton Ajouter un signal */}
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-orange btn-sm flex items-center gap-6"
            style={{ fontWeight: 700 }}
          >
            <span>+</span>
            <span>Ajouter un Signal / Import</span>
          </button>
        </div>
      </div>

      {/* ─── BARRE D'ONGLETS THÉMATIQUES DE LA VEILLE ─── */}
      <div className="tab-bar flex flex-wrap gap-4 p-4 mb-16" style={{ background: '#ECEFF1', borderRadius: 8 }}>
        {subTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`tab-item ${subTab === t.id ? 'active' : ''}`}
            style={{
              fontWeight: subTab === t.id ? 700 : 500,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>{t.label}</span>
            {t.count !== null && (
              <span className="tag" style={{
                fontSize: 10,
                background: t.badgeColor || '#E0E0E0',
                color: t.badgeColor ? '#FFF' : '#333',
                padding: '1px 6px'
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── CONTENU DYNAMIQUE DE LA SOUS-VUE SÉLECTIONNÉE ─── */}
      {subTab === 'cockpit' && (
        <CockpitView
          metrics={metrics}
          watchItems={watchItems}
          alerts={alerts}
          competitors={competitors}
          influencers={influencers}
          onOpenTransformModal={(item) => setTransformModalItem(item)}
          onResolveAlert={handleResolveAlert}
          onNavigateSubtab={(targetTab) => setSubTab(targetTab)}
          onMarkItemRead={handleMarkItemRead}
        />
      )}

      {subTab === 'flux' && (
        <FluxVeilleView
          watchItems={watchItems}
          influencers={influencers}
          competitors={competitors}
          onOpenTransformModal={(item) => setTransformModalItem(item)}
          onMarkItemRead={handleMarkItemRead}
          onDeleteItem={handleDeleteItem}
        />
      )}

      {subTab === 'talents_campagnes' && (
        <VeilleInfluenceursCampagnesView
          watchItems={watchItems}
          influencers={influencers}
          onOpenTransformModal={(item) => setTransformModalItem(item)}
        />
      )}

      {subTab === 'concurrents' && (
        <TableauBordConcurrentielView
          competitors={competitors}
          watchItems={watchItems}
          onOpenTransformModal={(item) => setTransformModalItem(item)}
          onSaveCompetitor={handleSaveCompetitor}
        />
      )}

      {subTab === 'tendances_macro' && (
        <TendancesReglementationView
          watchItems={watchItems}
          onOpenTransformModal={(item) => setTransformModalItem(item)}
        />
      )}

      {subTab === 'watchlists_alertes' && (
        <WatchlistsAlertesView
          watchlists={watchlists}
          alerts={alerts}
          watchItems={watchItems}
          onSaveWatchlist={handleSaveWatchlist}
          onResolveAlert={handleResolveAlert}
          onOpenTransformModal={(item) => setTransformModalItem(item)}
        />
      )}

      {/* ─── MODAL DE TRANSFORMATION EN INSIGHT / TÂCHE ACTIONNABLE ─── */}
      {transformModalItem && (
        <InsightTransformationModal
          item={transformModalItem}
          onClose={() => setTransformModalItem(null)}
          onTransformed={(itemId, newInsight) => {
            if (itemId) {
              handleMarkItemRead(itemId);
            }
            showToast(`✓ Décision créée et intégrée aux modules de pilotage !`);
          }}
        />
      )}

      {/* ─── MODAL D'AJOUT DE SIGNAL OU IMPORT ─── */}
      {showAddModal && (
        <AddWatchItemModal
          onClose={() => setShowAddModal(false)}
          onAddItem={handleAddItem}
          onRunSimulatedSync={handleRunSimulatedSync}
          influencers={influencers}
        />
      )}
    </div>
  );
}
