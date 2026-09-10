import { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import PerformanceFilters from './performance/PerformanceFilters';
import PerformanceMetricsCards from './performance/PerformanceMetricsCards';
import PerformanceTalentsTable from './performance/PerformanceTalentsTable';
import PerformanceRankings from './performance/PerformanceRankings';
import PerformanceDeliverablesTable from './performance/PerformanceDeliverablesTable';
import PerformancePublicationModal from './performance/PerformancePublicationModal';
import PerformanceInsightsSection from './performance/PerformanceInsightsSection';
import PerformanceInsightModal from './performance/PerformanceInsightModal';

import {
  BarChart3,
  Trophy,
  Table,
  Lightbulb,
  Plus,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function InfluencePerformance({ influencers = [], setInfluencers }) {
  const {
    influenceDeliverables = [],
    influenceCampaigns = [],
    influenceInsights = [],
    addInfluenceDeliverable,
    updateInfluenceDeliverable,
    deleteInfluenceDeliverable,
    addInfluenceInsight,
    updateInfluenceInsight,
    deleteInfluenceInsight,
    addNotification,
  } = useApp();

  // Navigation par sous-onglets
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rankings' | 'table' | 'insights'

  // État des filtres globaux
  const [filters, setFilters] = useState({
    campaign: '',
    talent: '',
    platform: '',
    contentType: '',
    subject: '',
    period: '',
    search: '',
  });

  // Modals d'édition / création de publications
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  const [showAddDeliverableModal, setShowAddDeliverableModal] = useState(false);

  // Modals d'édition / création d'Insights
  const [editingInsight, setEditingInsight] = useState(null);
  const [showAddInsightModal, setShowAddInsightModal] = useState(false);

  // Consolidation de la source des livrables
  const allDeliverables = useMemo(() => {
    if (influenceDeliverables && influenceDeliverables.length > 0) {
      return influenceDeliverables;
    }
    // Fallback : extraire publicationStats depuis influencers si influenceDeliverables est vide
    const extracted = [];
    (influencers || []).forEach(inf => {
      if (Array.isArray(inf.publicationStats)) {
        inf.publicationStats.forEach(p => {
          extracted.push({
            id: p.id || `PUB-${Math.random().toString(36).substr(2, 6)}`,
            title: p.titre || p.title || `Publication de ${inf.name}`,
            talent_name: inf.name,
            campaign_name: p.campagne || 'Campagnes Q4 2025',
            platform: (p.plateforme || p.platform || 'instagram').toLowerCase(),
            content_type: (p.format || p.content_type || 'post').toLowerCase(),
            content_subject: p.sujet || p.content_subject || 'Général',
            published_at: p.date || p.published_at || new Date().toISOString().split('T')[0],
            url: p.url || '',
            status: 'publie',
            metrics: {
              views: p.vues || p.views || 0,
              likes: p.likes || 0,
              comments: p.commentaires || p.comments || 0,
              shares: p.partages || p.shares || 0,
              engagement_reported: p.engagement_reported || null,
              engagement_calculated: (p.likes || 0) + (p.commentaires || p.comments || 0) + (p.partages || p.shares || 0),
              engagement_rate: p.tauxEngagement || p.engagement_rate || 0,
            }
          });
        });
      }
    });
    return extracted;
  }, [influenceDeliverables, influencers]);

  // Options pour les filtres déduites des données
  const campaignOptions = useMemo(() => {
    const set = new Set();
    allDeliverables.forEach(d => {
      if (d.campaign_name) set.add(d.campaign_name);
    });
    (influenceCampaigns || []).forEach(c => {
      if (c.name) set.add(c.name);
    });
    return Array.from(set).sort();
  }, [allDeliverables, influenceCampaigns]);

  const talentOptions = useMemo(() => {
    const set = new Set();
    allDeliverables.forEach(d => {
      if (d.talent_name) set.add(d.talent_name);
    });
    (influencers || []).forEach(inf => {
      if (inf.name) set.add(inf.name);
    });
    return Array.from(set).sort();
  }, [allDeliverables, influencers]);

  const platformOptions = useMemo(() => {
    const set = new Set();
    allDeliverables.forEach(d => {
      if (d.platform) set.add(d.platform.toLowerCase());
    });
    ['tiktok', 'instagram', 'facebook', 'youtube', 'website'].forEach(p => set.add(p));
    return Array.from(set);
  }, [allDeliverables]);

  const contentTypeOptions = useMemo(() => {
    const set = new Set();
    allDeliverables.forEach(d => {
      if (d.content_type) set.add(d.content_type.toLowerCase());
    });
    ['video', 'reel', 'image', 'story', 'post', 'live'].forEach(t => set.add(t));
    return Array.from(set);
  }, [allDeliverables]);

  const subjectOptions = useMemo(() => {
    const set = new Set();
    allDeliverables.forEach(d => {
      if (d.content_subject) set.add(d.content_subject);
    });
    return Array.from(set).sort();
  }, [allDeliverables]);

  const periodOptions = [
    { id: '2025-10', label: 'Octobre 2025' },
    { id: '2025-11', label: 'Novembre 2025' },
    { id: '2025-12', label: 'Décembre 2025' },
    { id: '2026', label: 'Année 2026' },
  ];

  // Filtrage effectif des livrables
  const filteredDeliverables = useMemo(() => {
    return allDeliverables.filter(item => {
      // Filtre Campagne
      if (filters.campaign && item.campaign_name !== filters.campaign && item.campaign_id !== filters.campaign) {
        return false;
      }
      // Filtre Talent
      if (filters.talent && item.talent_name !== filters.talent) {
        return false;
      }
      // Filtre Plateforme
      if (filters.platform && String(item.platform).toLowerCase() !== filters.platform.toLowerCase()) {
        return false;
      }
      // Filtre Format / Type
      if (filters.contentType && String(item.content_type).toLowerCase() !== filters.contentType.toLowerCase()) {
        return false;
      }
      // Filtre Sujet
      if (filters.subject && item.content_subject !== filters.subject) {
        return false;
      }
      // Filtre Période
      if (filters.period) {
        const dStr = item.published_at || item.date_raw || '';
        if (!dStr.includes(filters.period)) {
          return false;
        }
      }
      // Recherche textuelle
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchTitle = String(item.title || '').toLowerCase().includes(q);
        const matchTalent = String(item.talent_name || '').toLowerCase().includes(q);
        const matchSubject = String(item.content_subject || '').toLowerCase().includes(q);
        const matchUrl = String(item.url || '').toLowerCase().includes(q);
        const matchCampaign = String(item.campaign_name || '').toLowerCase().includes(q);
        if (!matchTitle && !matchTalent && !matchSubject && !matchUrl && !matchCampaign) {
          return false;
        }
      }

      return true;
    });
  }, [allDeliverables, filters]);

  // Synthèse globale des métriques séparées (Mesurées, Calculées, Non disponibles)
  const metricsSummary = useMemo(() => {
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalReportedEngagement = 0;
    let reportedCount = 0;
    let totalCalculatedEngagement = 0;
    let completeCount = 0;
    let missingViewsCount = 0;

    filteredDeliverables.forEach(d => {
      const views = d.metrics?.views;
      const likes = d.metrics?.likes;
      const comments = d.metrics?.comments;
      const shares = d.metrics?.shares;
      const rep = d.metrics?.engagement_reported;

      if (views !== null && views !== undefined && views > 0) {
        totalViews += views;
      } else {
        missingViewsCount++;
      }

      if (likes !== null && likes !== undefined) totalLikes += likes;
      if (comments !== null && comments !== undefined) totalComments += comments;
      if (shares !== null && shares !== undefined) totalShares += shares;

      if (rep !== null && rep !== undefined && rep > 0) {
        totalReportedEngagement += rep;
        reportedCount++;
      }

      // Engagement calculé pour chaque livrable
      const calcEng = (likes || 0) + (comments || 0) + (shares || 0);
      totalCalculatedEngagement += calcEng;

      // Complétude
      const isComplete = views !== null && views !== undefined && views > 0 &&
        likes !== null && likes !== undefined &&
        comments !== null && comments !== undefined &&
        shares !== null && shares !== undefined;

      if (isComplete) completeCount++;
    });

    const averageRateOnViews = totalViews > 0
      ? Number(((totalCalculatedEngagement / totalViews) * 100).toFixed(2))
      : null;

    const totalCount = filteredDeliverables.length;
    const incompleteCount = totalCount - completeCount;
    const missingReportedCount = totalCount - reportedCount;

    return {
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalReportedEngagement: reportedCount > 0 ? totalReportedEngagement : null,
      totalCalculatedEngagement,
      averageRateOnViews,
      completeCount,
      incompleteCount,
      totalCount,
      missingViewsCount,
      missingReportedCount,
    };
  }, [filteredDeliverables]);

  // Indicateurs par Influenceurs
  const talentsMetrics = useMemo(() => {
    const talentMap = new Map();

    filteredDeliverables.forEach(d => {
      const name = d.talent_name || 'Influenceur Inconnu';
      if (!talentMap.has(name)) {
        talentMap.set(name, {
          name,
          campaigns: new Set(),
          publicationsCount: 0,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          reportedEngagement: 0,
          hasReported: false,
          calculatedEngagement: 0,
          completeCount: 0,
          missingViewsCount: 0,
        });
      }

      const t = talentMap.get(name);
      t.publicationsCount++;
      if (d.campaign_name) t.campaigns.add(d.campaign_name);

      const v = d.metrics?.views;
      if (v !== null && v !== undefined && v > 0) {
        t.views += v;
      } else {
        t.missingViewsCount++;
      }

      const l = d.metrics?.likes || 0;
      const c = d.metrics?.comments || 0;
      const s = d.metrics?.shares || 0;
      t.likes += l;
      t.comments += c;
      t.shares += s;

      if (d.metrics?.engagement_reported !== null && d.metrics?.engagement_reported !== undefined) {
        t.reportedEngagement += d.metrics.engagement_reported;
        t.hasReported = true;
      }

      const calc = (d.metrics?.likes || 0) + (d.metrics?.comments || 0) + (d.metrics?.shares || 0);
      t.calculatedEngagement += calc;

      const isComp = v !== null && v !== undefined && v > 0 &&
        d.metrics?.likes !== null && d.metrics?.likes !== undefined &&
        d.metrics?.comments !== null && d.metrics?.comments !== undefined &&
        d.metrics?.shares !== null && d.metrics?.shares !== undefined;
      if (isComp) t.completeCount++;
    });

    return Array.from(talentMap.values()).map(t => {
      const completenessRatio = t.publicationsCount > 0
        ? Math.round((t.completeCount / t.publicationsCount) * 100)
        : 0;
      const rateOnViews = t.views > 0
        ? Number(((t.calculatedEngagement / t.views) * 100).toFixed(2))
        : null;

      return {
        ...t,
        campaigns: Array.from(t.campaigns),
        completenessRatio,
        rateOnViews,
        reportedEngagement: t.hasReported ? t.reportedEngagement : null,
      };
    }).sort((a, b) => b.calculatedEngagement - a.calculatedEngagement);
  }, [filteredDeliverables]);

  // Gestion des modifications / ajouts de livrables
  const handleSaveDeliverable = (delivData) => {
    if (editingDeliverable) {
      updateInfluenceDeliverable(delivData.id, delivData);
      if (addNotification) {
        addNotification(`Publication modifiée : ${delivData.title}`, 'success');
      }
    } else {
      addInfluenceDeliverable(delivData);
      if (addNotification) {
        addNotification(`Nouvelle publication ajoutée : ${delivData.title}`, 'success');
      }
    }

    // Synchronisation éventuelle avec l'état local influencers
    if (setInfluencers) {
      setInfluencers(prev => prev.map(inf => {
        if (inf.name === delivData.talent_name) {
          const existingPubs = inf.publicationStats || [];
          const exists = existingPubs.some(p => p.id === delivData.id);
          const updatedPubs = exists
            ? existingPubs.map(p => p.id === delivData.id ? { ...p, ...delivData } : p)
            : [delivData, ...existingPubs];
          return { ...inf, publicationStats: updatedPubs };
        }
        return inf;
      }));
    }

    setEditingDeliverable(null);
    setShowAddDeliverableModal(false);
  };

  const handleDeleteDeliverable = (delivId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette publication et ses KPIs ? Cette action est irréversible.')) {
      return;
    }

    deleteInfluenceDeliverable(delivId);
    if (addNotification) {
      addNotification('Publication supprimée avec succès', 'warning');
    }

    if (setInfluencers) {
      setInfluencers(prev => prev.map(inf => ({
        ...inf,
        publicationStats: (inf.publicationStats || []).filter(p => p.id !== delivId)
      })));
    }
  };

  // Gestion des Insights
  const handleSaveInsight = (insightData) => {
    if (editingInsight) {
      updateInfluenceInsight(insightData.id, insightData);
      if (addNotification) {
        addNotification(`Recommandation mise à jour`, 'success');
      }
    } else {
      addInfluenceInsight(insightData);
      if (addNotification) {
        addNotification(`Nouvel insight enregistré`, 'success');
      }
    }
    setEditingInsight(null);
    setShowAddInsightModal(false);
  };

  const handleDeleteInsight = (insightId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette observation / recommandation ?')) {
      return;
    }
    deleteInfluenceInsight(insightId);
    if (addNotification) {
      addNotification('Recommandation retirée', 'warning');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      campaign: '',
      talent: '',
      platform: '',
      contentType: '',
      subject: '',
      period: '',
      search: '',
    });
  };

  return (
    <div>
      {/* En-tête de section avec navigation claire */}
      <div className="flex flex-wrap items-center justify-between gap-16 mb-20">
        <div>
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
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
                4. Performances & KPIs — Pilotage & Reporting
              </h2>
              <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
                Suivi multi-dimensions des publications, benchmarks d'influence, palmarès et recommandations stratégiques
              </p>
            </div>
          </div>
        </div>

        {/* Boutons d'action rapide */}
        <div className="flex items-center gap-10">
          <button
            onClick={() => setShowAddDeliverableModal(true)}
            className="btn btn-orange text-xs font-semibold flex items-center gap-6 px-14 py-8 rounded-lg shadow-sm"
          >
            <Plus size={15} />
            Ajouter une Publication
          </button>
        </div>
      </div>

      {/* Barre d'onglets de la section Performance */}
      <div
        className="flex flex-wrap gap-6 mb-20 p-4 rounded-xl bg-white border border-gray-200"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-8 px-14 py-8 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-muted hover:text-dark hover:bg-gray-100'
          }`}
        >
          <BarChart3 size={15} />
          Vue Globale & Synthèse
        </button>

        <button
          onClick={() => setActiveTab('rankings')}
          className={`flex items-center gap-8 px-14 py-8 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'rankings'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-muted hover:text-dark hover:bg-gray-100'
          }`}
        >
          <Trophy size={15} />
          Classements (Top Contenus & Talents)
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-8 px-14 py-8 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'table'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-muted hover:text-dark hover:bg-gray-100'
          }`}
        >
          <Table size={15} />
          Table Détaillée des Livrables ({filteredDeliverables.length})
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-8 px-14 py-8 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'insights'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-muted hover:text-dark hover:bg-gray-100'
          }`}
        >
          <Lightbulb size={15} />
          Zone Insights & Recommandations ({influenceInsights.length})
        </button>
      </div>

      {/* ─── BARRE DE FILTRES GLOBAUX (Affecte la vue globale, les classements et la table) ─── */}
      {activeTab !== 'insights' && (
        <PerformanceFilters
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          campaigns={campaignOptions}
          talents={talentOptions}
          platforms={platformOptions}
          contentTypes={contentTypeOptions}
          subjects={subjectOptions}
          periods={periodOptions}
          totalCount={allDeliverables.length}
          filteredCount={filteredDeliverables.length}
        />
      )}

      {/* ─── RENDU DU SOUS-ONGLET 1 : VUE GLOBALE & SYNTHÈSE ─── */}
      {activeTab === 'overview' && (
        <div>
          {/* Cartes avec séparation explicite : Mesurées, Calculées, Non disponibles */}
          <PerformanceMetricsCards metricsSummary={metricsSummary} />

          {/* Table des indicateurs par influenceur */}
          <PerformanceTalentsTable
            talentsMetrics={talentsMetrics}
            onFilterTalent={(talentName) => setFilters(prev => ({ ...prev, talent: talentName }))}
            activeTalentFilter={filters.talent}
          />
        </div>
      )}

      {/* ─── RENDU DU SOUS-ONGLET 2 : CLASSEMENTS (TOP CONTENUS & TOP TALENTS) ─── */}
      {activeTab === 'rankings' && (
        <PerformanceRankings
          deliverables={filteredDeliverables}
          talentsMetrics={talentsMetrics}
          onOpenDeliverable={(deliv) => setEditingDeliverable(deliv)}
        />
      )}

      {/* ─── RENDU DU SOUS-ONGLET 3 : TABLE DÉTAILLÉE EXPORTABLE ─── */}
      {activeTab === 'table' && (
        <PerformanceDeliverablesTable
          deliverables={filteredDeliverables}
          onEdit={(deliv) => setEditingDeliverable(deliv)}
          onDelete={handleDeleteDeliverable}
          onAddNew={() => setShowAddDeliverableModal(true)}
          totalDeliverablesCount={allDeliverables.length}
        />
      )}

      {/* ─── RENDU DU SOUS-ONGLET 4 : ZONE INSIGHTS ─── */}
      {activeTab === 'insights' && (
        <PerformanceInsightsSection
          insights={influenceInsights}
          onAddNew={() => setShowAddInsightModal(true)}
          onEdit={(ins) => setEditingInsight(ins)}
          onDelete={handleDeleteInsight}
          campaigns={campaignOptions}
        />
      )}

      {/* Modal d'édition / création de publication */}
      {(editingDeliverable || showAddDeliverableModal) && (
        <PerformancePublicationModal
          deliverable={editingDeliverable}
          onClose={() => {
            setEditingDeliverable(null);
            setShowAddDeliverableModal(false);
          }}
          onSave={handleSaveDeliverable}
          campaigns={campaignOptions}
          talents={talentOptions}
        />
      )}

      {/* Modal d'édition / création d'Insight */}
      {(editingInsight || showAddInsightModal) && (
        <PerformanceInsightModal
          insight={editingInsight}
          onClose={() => {
            setEditingInsight(null);
            setShowAddInsightModal(false);
          }}
          onSave={handleSaveInsight}
          campaigns={campaignOptions}
          deliverables={allDeliverables}
        />
      )}
    </div>
  );
}
