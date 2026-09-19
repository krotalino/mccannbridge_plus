import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useInfluenceStore, computeCockpitKpis } from './InfluenceStore';
import { Badge } from './components/InfluenceCommon';

// Nouveaux composants conformes au design Dashboard Analytics & OCM Growth Bridge
import InfluenceSwitchboardRibbon from './components/InfluenceSwitchboardRibbon';
import InfluencePerspectiveBanner, { INFLUENCE_PERSPECTIVES } from './components/InfluencePerspectiveBanner';
import InfluenceExportModal from './components/InfluenceExportModal';
import CockpitInfluence from './components/CockpitInfluence';
import TalentsAmbassadeurs from './components/TalentsAmbassadeurs';
import CampagnesActivations from './components/CampagnesActivations';
import LivrablesValidations from './components/LivrablesValidations';
import ReportingInfluence from './components/ReportingInfluence';
import VeilleStrategique from './components/VeilleStrategique';
import ImportExcel from './components/ImportExcel';

// Composants outils métier (historique)
import InfluenceFiche from './sections/InfluenceFiche';
import InfluenceContrats from './sections/InfluenceContrats';
import InfluenceCahierCharges from './sections/InfluenceCahierCharges';
import InfluencePerformance from './sections/InfluencePerformance';
import InfluenceHistorique from './sections/InfluenceHistorique';
import InfluenceFinance from './sections/InfluenceFinance';
import { ProfileModal, EditModal } from './InfluenceModals';

export default function InfluencePage() {
  const [activeTab, setActiveTab] = useState('cockpit');
  const [legacySubTab, setLegacySubTab] = useState('fiche');
  const [currentPerspective, setCurrentPerspective] = useState('traffic_ops');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });

  // Store centralisé de l'influence synchronisé avec le classeur Excel
  const {
    data,
    runImport,
    setDeliverableStatus,
    addInsight,
    removeInsight,
    mergeTalents,
    keepTalentsSeparate,
    resetImport
  } = useInfluenceStore();

  // AppContext pour les outils métier historiques
  const { influencers = [], addInfluencer, updateInfluencer, deleteInfluencer } = useApp();
  const [profileInf, setProfileInf] = useState(null);
  const [editInf, setEditInf] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState({
    text: '', niche: '', platform: '', type: '', region: '', engagement: '', disponibilite: '', status: ''
  });

  // KPIs consolidés pour le switchboard et les perspectives
  const kpis = useMemo(() => computeCockpitKpis(data), [data]);

  const lastBatch = (data.batches || [])[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 450);
  };

  const handleChangePerspective = (perspectiveId) => {
    setCurrentPerspective(perspectiveId);
    const pers = INFLUENCE_PERSPECTIVES.find(p => p.id === perspectiveId);
    if (pers && pers.suggestedTab) {
      setActiveTab(pers.suggestedTab);
    }
  };

  const tabs = [
    { id: 'cockpit', label: 'Vue d’ensemble 360°', icon: '📊', badge: null },
    { id: 'talents', label: 'Talents & Ambassadeurs', icon: '👥', badge: (influencers || []).length },
    { id: 'campagnes', label: 'Campagnes & Activations', icon: '🗂', badge: (data.campaigns || []).length },
    { id: 'livrables', label: 'Livrables & Validations', icon: '📄', badge: (data.deliverables || []).length },
    { id: 'reporting', label: 'Reporting & Analyses', icon: '📈', badge: `${kpis.rate || '4.8'}%` },
    { id: 'veille', label: 'Veille Stratégique', icon: '📡', badge: '3' },
    { id: 'import', label: 'Import Excel', icon: '📥', badge: '6' },
    { id: 'outils', label: 'Outils Métier', icon: '🧰', badge: null }
  ];

  const legacyTabs = [
    { id: 'fiche', label: '1. Fiche Influence' },
    { id: 'contrats', label: '2. Contrats' },
    { id: 'cahier', label: '3. Cahier des charges' },
    { id: 'performance', label: '4. Performance & KPIs' },
    { id: 'historique', label: '5. Historique campagnes' },
    { id: 'finance', label: '6. Budgets & Paiements' }
  ];

  const handleSave = async (form) => {
    if (form.id) {
      await updateInfluencer(form.id, form);
    } else {
      const newId = `INF-${Date.now().toString().slice(-6)}`;
      await addInfluencer({ ...form, id: newId });
    }
    setEditInf(null);
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet influenceur ?')) {
      await deleteInfluencer(id);
      setProfileInf(null);
    }
  };

  const handleSetInfluencers = async (updaterOrList) => {
    if (typeof updaterOrList === 'function') {
      const updatedList = updaterOrList(influencers);
      for (const inf of updatedList) {
        const old = influencers.find(i => String(i.id) === String(inf.id));
        if (!old) {
          await addInfluencer(inf);
        } else if (JSON.stringify(old) !== JSON.stringify(inf)) {
          await updateInfluencer(inf.id, inf);
        }
      }
      for (const old of influencers) {
        if (!updatedList.some(i => String(i.id) === String(old.id))) {
          await deleteInfluencer(old.id);
        }
      }
    } else if (Array.isArray(updaterOrList)) {
      for (const inf of updaterOrList) {
        await updateInfluencer(inf.id, inf);
      }
    }
  };

  return (
    <div className="dashboard-analytics-page animate-fade" style={{ paddingBottom: 60 }}>
      {/* ─── 1. TOP HEADER (Identique à Dashboard Analytics / Traffic Manager) ─── */}
      <div className="flex justify-between items-center flex-wrap gap-14 mb-20">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.5px', color: 'var(--dark)' }}>
              MODULE INFLUENCE & AMBASSADEURS
            </h1>
            <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
              MCCANN × ORANGE CAMEROUN
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 13 }}>
            Tour de contrôle, gestion des créateurs, validation des BAT, mesure des performances et veille marché.
          </p>
        </div>

        {/* Boutons d'action & Indicateur de Synchronisation */}
        <div className="flex items-center gap-12 flex-wrap">
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
            className="btn btn-secondary btn-sm"
            onClick={() => setShowAdd(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF3E8', color: '#E65100', border: '1px solid #FFD8BE', fontWeight: 700 }}
          >
            <span>+</span> Nouvel influenceur
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsExportModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF7900', color: '#FFF' }}
          >
            <span>📥</span> Exporter Fiche Influence
          </button>
        </div>
      </div>

      {/* ─── 2. THE VISUAL INFLUENCE SWITCHBOARD RIBBON (Style Dashboard Analytics) ─── */}
      <InfluenceSwitchboardRibbon
        data={data}
        kpis={kpis}
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      {/* ─── 3. PERSPECTIVE ROLE BANNER ─── */}
      <InfluencePerspectiveBanner
        currentPerspective={currentPerspective}
        onChangePerspective={handleChangePerspective}
        onQuickExport={() => setIsExportModalOpen(true)}
        onRefresh={handleRefresh}
      />

      {/* ─── 4. BARRE DE NAVIGATION DES ONGLETS (Style Dashboard Analytics) ─── */}
      <div
        className="card mb-20 p-8"
        style={{
          borderRadius: 12,
          border: '1px solid #E0E0E0',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          alignItems: 'center',
          background: '#FFFFFF',
          marginBottom: 20
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                border: 'none',
                background: isActive ? '#FF7900' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--dark)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== null && tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 10,
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#F0F0F0',
                    color: isActive ? '#FFFFFF' : 'var(--muted)'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── 5. CONTENU DE L'ONGLET ACTIF ─── */}
      {activeTab === 'cockpit' && (
        <CockpitInfluence data={data} onNavigate={(tabId) => setActiveTab(tabId)} />
      )}

      {activeTab === 'talents' && (
        <TalentsAmbassadeurs
          data={data}
          influencers={influencers}
          onEdit={(inf) => setEditInf(inf)}
          onAdd={() => setShowAdd(true)}
          onDelete={(id) => handleDelete(id)}
          onMerge={mergeTalents}
          onKeepSeparate={keepTalentsSeparate}
        />
      )}

      {activeTab === 'campagnes' && (
        <CampagnesActivations
          data={data}
          setStatus={setDeliverableStatus}
        />
      )}

      {activeTab === 'livrables' && (
        <LivrablesValidations
          data={data}
          setStatus={setDeliverableStatus}
        />
      )}

      {activeTab === 'reporting' && (
        <ReportingInfluence
          data={data}
          onAddInsight={addInsight}
          onRemoveInsight={removeInsight}
        />
      )}

      {activeTab === 'veille' && (
        <VeilleStrategique />
      )}

      {activeTab === 'import' && (
        <ImportExcel
          data={data}
          onRunImport={runImport}
          onResetImport={resetImport}
        />
      )}

      {/* ─── ONGLET OUTILS MÉTIER (HISTORIQUE) ─── */}
      {activeTab === 'outils' && (
        <div className="flex flex-col gap-16 animate-fade">
          <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--dark)', margin: 0 }}>
                  Modules Métier & Gestion Avancée des Fiches
                </h3>
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
                  Éditeur complet des profils, contrats types, briefs d'influence, performance unitaire et suivi financier.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowAdd(true)}
                style={{ background: '#FF7900', color: '#FFF' }}
              >
                + Nouvel influenceur
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 6,
                padding: '4px',
                background: '#F8F9FA',
                borderRadius: 8,
                overflowX: 'auto'
              }}
            >
              {legacyTabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setLegacySubTab(t.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    border: 'none',
                    background: legacySubTab === t.id ? '#FF7900' : 'transparent',
                    color: legacySubTab === t.id ? '#FFF' : 'var(--dark)',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {legacySubTab === 'fiche' && (
            <InfluenceFiche
              influencers={influencers}
              setInfluencers={handleSetInfluencers}
              filters={filters}
              setFilters={setFilters}
              onViewProfile={setProfileInf}
              onSelect={setProfileInf}
              onEdit={setEditInf}
              onDelete={handleDelete}
              onAdd={() => setShowAdd(true)}
            />
          )}

          {legacySubTab === 'contrats' && (
            <InfluenceContrats
              influencers={influencers}
              onSelect={setProfileInf}
              onEdit={setEditInf}
            />
          )}

          {legacySubTab === 'cahier' && (
            <InfluenceCahierCharges influencers={influencers} />
          )}

          {legacySubTab === 'performance' && (
            <InfluencePerformance influencers={influencers} onSelect={setProfileInf} />
          )}

          {legacySubTab === 'historique' && (
            <InfluenceHistorique influencers={influencers} onSelect={setProfileInf} />
          )}

          {legacySubTab === 'finance' && (
            <InfluenceFinance
              influencers={influencers}
              setInfluencers={handleSetInfluencers}
              onSelect={setProfileInf}
            />
          )}

          {profileInf && (
            <ProfileModal
              inf={profileInf}
              influencer={profileInf}
              onClose={() => setProfileInf(null)}
              onEdit={(inf) => {
                setProfileInf(null);
                setEditInf(inf);
              }}
              onDelete={handleDelete}
              setInfluencers={handleSetInfluencers}
            />
          )}

          {(editInf || showAdd) && (
            <EditModal
              inf={editInf}
              influencer={editInf}
              onClose={() => {
                setEditInf(null);
                setShowAdd(false);
              }}
              onSave={handleSave}
            />
          )}
        </div>
      )}

      {/* ─── MODAL D'EXPORTATION UNIFIÉ (Style Dashboard Analytics) ─── */}
      {isExportModalOpen && (
        <InfluenceExportModal
          data={data}
          kpis={kpis}
          activeTab={activeTab}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
}
