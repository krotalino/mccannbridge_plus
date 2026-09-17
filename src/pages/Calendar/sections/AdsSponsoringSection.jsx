import React, { useState, useEffect, useMemo } from 'react';
import { 
  Share2, Monitor, Plus, Upload, Download, RefreshCw, 
  Search, Filter, ShieldAlert, AlertCircle, CheckCircle2, 
  DollarSign, TrendingUp, Eye, MousePointer, Layers, 
  FileText, ExternalLink, Zap, ChevronDown, BarChart3, Sparkles,
  RotateCcw, Megaphone
} from 'lucide-react';

import { INITIAL_SOCIAL_ADS, INITIAL_DISPLAY_CAMPAIGNS } from './ads/adsData';
import SocialAdsTable from './ads/SocialAdsTable';
import DisplayTable from './ads/DisplayTable';
import SocialAdDetailModal from './ads/SocialAdDetailModal';
import DisplayDetailModal from './ads/DisplayDetailModal';
import NewCampaignModal from './ads/NewCampaignModal';
import CsvImportModal from './ads/CsvImportModal';
import ApiSyncModal from './ads/ApiSyncModal';
import AdsSynthesisView from './ads/AdsSynthesisView';
import AdsRegiesView from './ads/AdsRegiesView';
import { exportSocialAdsCsv, exportDisplayCsv, exportAdsPdfReport } from './ads/AdsExportService';

export default function AdsSponsoringSection() {
  // ─── 1. Persistent State (localStorage) ───
  const [socialCampaigns, setSocialCampaigns] = useState(() => {
    const saved = localStorage.getItem('bridge_ads_social_campaigns_v2');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_ADS;
  });

  const [displayCampaigns, setDisplayCampaigns] = useState(() => {
    const saved = localStorage.getItem('bridge_ads_display_campaigns_v2');
    return saved ? JSON.parse(saved) : INITIAL_DISPLAY_CAMPAIGNS;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('bridge_ads_social_campaigns_v2', JSON.stringify(socialCampaigns));
  }, [socialCampaigns]);

  useEffect(() => {
    localStorage.setItem('bridge_ads_display_campaigns_v2', JSON.stringify(displayCampaigns));
  }, [displayCampaigns]);

  // ─── 2. Active Tab (Matching Influence UX) ───
  // 'social' | 'display' | 'synthesis' | 'regies'
  const [activeTab, setActiveTab] = useState('social');

  // ─── 3. Filter States ───
  const [clientFilter, setClientFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAlerts, setOnlyAlerts] = useState(false);

  // ─── 4. Modals State ───
  const [selectedSocialCamp, setSelectedSocialCamp] = useState(null);
  const [selectedDisplayCamp, setSelectedDisplayCamp] = useState(null);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [isApiSyncOpen, setIsApiSyncOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [notification, setNotification] = useState('');

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // ─── 5. Unique Clients for Dropdown ───
  const uniqueClients = useMemo(() => {
    const set = new Set();
    socialCampaigns.forEach(c => c.client && set.add(c.client));
    displayCampaigns.forEach(c => c.client && set.add(c.client));
    return Array.from(set);
  }, [socialCampaigns, displayCampaigns]);

  // ─── 6. Alerts Detection ───
  const alerts = useMemo(() => {
    const list = [];
    socialCampaigns.forEach(c => {
      const pct = c.budgetTotal > 0 ? (c.budgetSpent / c.budgetTotal) * 100 : 0;
      if (pct >= 90 && c.status === 'Active') {
        list.push({
          type: 'budget',
          tab: 'social',
          id: c.id,
          title: `Budget dépassé à ${Math.round(pct)}%`,
          desc: `Campagne "${c.campaignName}" (${c.client}) a consommé ${(c.budgetSpent || 0).toLocaleString('fr-FR')} / ${(c.budgetTotal || 0).toLocaleString('fr-FR')} FCFA`,
          campaign: c
        });
      }
      if (c.ctr < 0.8 && c.status === 'Active') {
        list.push({
          type: 'ctr',
          tab: 'social',
          id: c.id,
          title: `CTR bas (${c.ctr}%)`,
          desc: `Campagne "${c.campaignName}" sur ${c.platform} sous la cible de 1.0%`,
          campaign: c
        });
      }
    });

    displayCampaigns.forEach(c => {
      const pct = c.budgetTotal > 0 ? (c.budgetSpent / c.budgetTotal) * 100 : 0;
      if (pct >= 90 && c.status === 'Active') {
        list.push({
          type: 'budget',
          tab: 'display',
          id: c.id,
          title: `Budget display alloué à ${Math.round(pct)}%`,
          desc: `Campagne "${c.campaignName}" (${c.client}) proche du plafond`,
          campaign: c
        });
      }
      if (c.ctr < 0.8 && c.status === 'Active') {
        list.push({
          type: 'ctr',
          tab: 'display',
          id: c.id,
          title: `CTR display faible (${c.ctr}%)`,
          desc: `Campagne "${c.campaignName}" (${c.format})`,
          campaign: c
        });
      }
    });

    return list;
  }, [socialCampaigns, displayCampaigns]);

  // ─── 7. Filtered Datasets ───
  const filteredSocialCampaigns = useMemo(() => {
    return socialCampaigns.filter(c => {
      if (clientFilter !== 'all' && c.client !== clientFilter) return false;
      if (platformFilter !== 'all' && c.platform.toLowerCase() !== platformFilter.toLowerCase()) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.campaignName?.toLowerCase().includes(q);
        const matchClient = c.client?.toLowerCase().includes(q);
        const matchObj = c.objective?.toLowerCase().includes(q);
        if (!matchName && !matchClient && !matchObj) return false;
      }
      if (onlyAlerts) {
        const pct = c.budgetTotal > 0 ? (c.budgetSpent / c.budgetTotal) * 100 : 0;
        const hasAlert = (pct >= 90 && c.status === 'Active') || (c.ctr < 0.8 && c.status === 'Active');
        if (!hasAlert) return false;
      }
      return true;
    });
  }, [socialCampaigns, clientFilter, platformFilter, statusFilter, searchQuery, onlyAlerts]);

  const filteredDisplayCampaigns = useMemo(() => {
    return displayCampaigns.filter(c => {
      if (clientFilter !== 'all' && c.client !== clientFilter) return false;
      if (platformFilter !== 'all' && c.displayType.toLowerCase() !== platformFilter.toLowerCase()) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.campaignName?.toLowerCase().includes(q);
        const matchClient = c.client?.toLowerCase().includes(q);
        const matchFormat = c.format?.toLowerCase().includes(q);
        if (!matchName && !matchClient && !matchFormat) return false;
      }
      if (onlyAlerts) {
        const pct = c.budgetTotal > 0 ? (c.budgetSpent / c.budgetTotal) * 100 : 0;
        const hasAlert = (pct >= 90 && c.status === 'Active') || (c.ctr < 0.8 && c.status === 'Active');
        if (!hasAlert) return false;
      }
      return true;
    });
  }, [displayCampaigns, clientFilter, platformFilter, statusFilter, searchQuery, onlyAlerts]);

  // ─── 8. Summary KPIs for Active Tab ───
  const activeKPIs = useMemo(() => {
    const list = activeTab === 'social' ? filteredSocialCampaigns : filteredDisplayCampaigns;
    const totalSpent = list.reduce((sum, c) => sum + (c.budgetSpent || 0), 0);
    const totalBudget = list.reduce((sum, c) => sum + (c.budgetTotal || 0), 0);
    const totalImpressions = list.reduce((sum, c) => sum + (c.impressions || 0), 0);
    const totalClics = list.reduce((sum, c) => sum + (c.clics || 0), 0);
    const averageCtr = totalImpressions > 0 ? ((totalClics / totalImpressions) * 100).toFixed(2) : 0;
    const averageCpc = totalClics > 0 ? Math.round(totalSpent / totalClics) : 0;
    const totalConversions = activeTab === 'display' 
      ? list.reduce((sum, c) => sum + (c.conversions || 0), 0)
      : 0;

    return {
      count: list.length,
      totalSpent,
      totalBudget,
      totalImpressions,
      totalClics,
      averageCtr,
      averageCpc,
      totalConversions
    };
  }, [activeTab, filteredSocialCampaigns, filteredDisplayCampaigns]);

  // ─── 9. Handlers ───
  const handleToggleSocialStatus = (id) => {
    setSocialCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const next = c.status === 'Active' ? 'En pause' : c.status === 'En pause' ? 'Terminée' : 'Active';
        return { ...c, status: next };
      }
      return c;
    }));
    triggerNotification('Statut de la campagne Social Ads actualisé.');
  };

  const handleToggleDisplayStatus = (id) => {
    setDisplayCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const next = c.status === 'Active' ? 'En pause' : c.status === 'En pause' ? 'Terminée' : 'Active';
        return { ...c, status: next };
      }
      return c;
    }));
    triggerNotification('Statut de la campagne Display actualisé.');
  };

  const handleUpdateSocialCampaign = (updated) => {
    setSocialCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedSocialCamp(updated);
    triggerNotification(`Campagne "${updated.campaignName}" mise à jour.`);
  };

  const handleUpdateDisplayCampaign = (updated) => {
    setDisplayCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedDisplayCamp(updated);
    triggerNotification(`Campagne "${updated.campaignName}" mise à jour.`);
  };

  const handleSaveNewCampaign = (type, newCamp) => {
    if (type === 'social') {
      setSocialCampaigns(prev => [newCamp, ...prev]);
      setActiveTab('social');
      triggerNotification(`Publication Social Ads "${newCamp.campaignName}" ajoutée avec succès !`);
    } else {
      setDisplayCampaigns(prev => [newCamp, ...prev]);
      setActiveTab('display');
      triggerNotification(`Campagne Display "${newCamp.campaignName}" enregistrée avec succès !`);
    }
  };

  const handleImportCsv = (type, rows) => {
    if (type === 'social') {
      setSocialCampaigns(prev => [...rows, ...prev]);
      setActiveTab('social');
      triggerNotification(`${rows.length} campagnes Social Ads importées depuis le CSV.`);
    } else {
      setDisplayCampaigns(prev => [...rows, ...prev]);
      setActiveTab('display');
      triggerNotification(`${rows.length} campagnes Display importées depuis le CSV.`);
    }
  };

  const handleResetFilters = () => {
    setClientFilter('all');
    setPlatformFilter('all');
    setPeriodFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
    setOnlyAlerts(false);
  };

  // ─── 10. Navigation Tabs Definition (Influence UX) ───
  const tabs = [
    { 
      id: 'social', 
      label: '1. Publications Sponsorisées (Social Ads)', 
      icon: Share2, 
      count: filteredSocialCampaigns.length 
    },
    { 
      id: 'display', 
      label: '2. Display & Programmatique', 
      icon: Monitor, 
      count: filteredDisplayCampaigns.length 
    },
    { 
      id: 'synthesis', 
      label: '3. Synthèse Budgétaire & Alertes', 
      icon: BarChart3, 
      badge: alerts.length > 0 ? `${alerts.length} alerte${alerts.length > 1 ? 's' : ''}` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { 
      id: 'regies', 
      label: '4. Régies & Connecteurs API', 
      icon: Zap, 
      badge: '3 connectés',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ─── TOAST NOTIFICATION ─── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ─── 1. HEADER (Styled like InfluencePerformance.jsx) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: '#FF7900',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255, 121, 0, 0.25)',
            }}
          >
            <Megaphone size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
              Cockpit Ads & Sponsoring — Pilotage & Performances
            </h2>
            <p className="text-xs text-muted mt-1" style={{ margin: 0 }}>
              Centralisation des publications sponsorisées Social Ads et campagnes display pour piloter les budgets et générer des rapports clients percutants
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewCampaignOpen(true)}
            className="btn btn-orange text-xs font-bold flex items-center gap-2 px-3.5 py-2 rounded-lg shadow-sm"
          >
            <Plus size={15} />
            <span>Nouvelle Campagne</span>
          </button>

          <button
            onClick={() => setIsCsvImportOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Upload size={14} className="text-gray-500" />
            <span>Importer CSV</span>
          </button>

          <button
            onClick={() => setIsApiSyncOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={14} className="text-orange-600" />
            <span>Synchroniser API</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Download size={14} className="text-gray-500" />
              <span>Exporter</span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>

            {showExportMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-1.5 text-xs animate-fadeIn"
                onClick={() => setShowExportMenu(false)}
              >
                <button
                  onClick={() => exportAdsPdfReport(activeTab === 'social' ? filteredSocialCampaigns : filteredDisplayCampaigns, activeTab)}
                  className="w-full text-left px-3 py-2 hover:bg-orange-50 text-gray-700 hover:text-orange-700 rounded-lg flex items-center gap-2 font-medium"
                >
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span>Rapport d'audit PDF Client</span>
                </button>
                <button
                  onClick={() => activeTab === 'social' ? exportSocialAdsCsv(filteredSocialCampaigns) : exportDisplayCsv(filteredDisplayCampaigns)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center gap-2 font-medium"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                  <span>Exporter les données (CSV)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. TAB BAR (Matching Influence Module Navigation Pattern) ─── */}
      <div 
        className="tab-bar flex flex-wrap gap-2 p-1.5 rounded-xl bg-white border border-gray-200 shadow-xs"
        style={{ background: '#fff', padding: '6px 8px', borderRadius: 10 }}
      >
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={{
                background: isActive ? '#FF7900' : 'transparent',
                color: isActive ? '#fff' : 'inherit'
              }}
            >
              <Icon size={15} />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-black/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {t.count}
                </span>
              )}
              {t.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white text-orange-600' : (t.badgeColor || 'bg-orange-100 text-orange-800')
                }`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── 3. TAB CONTENT VIEWS ─── */}

      {/* VUE 1 : SOCIAL ADS */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                <span className="font-semibold">Budget Dépensé Social</span>
                <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-gray-900">
                {activeKPIs.totalSpent.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-500">FCFA</span>
              </div>
              <div className="mt-2 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Plafond : {activeKPIs.totalBudget.toLocaleString('fr-FR')} F</span>
                <span className="font-bold text-orange-600 font-mono">
                  {activeKPIs.totalBudget > 0 ? Math.round((activeKPIs.totalSpent / activeKPIs.totalBudget) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                <span className="font-semibold">Impressions Totales</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-gray-900">
                {activeKPIs.totalImpressions.toLocaleString('fr-FR')}
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                Affichages sponsorisés Meta, TikTok, X
              </div>
            </div>

            <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                <span className="font-semibold">Clics & Taux de Clic (CTR)</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <MousePointer className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-emerald-700">
                {activeKPIs.totalClics.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-500">clics</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 font-bold font-mono">
                CTR Moyen Pondéré : {activeKPIs.averageCtr}%
              </div>
            </div>

            <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                <span className="font-semibold">Coût Moyen par Clic (CPC)</span>
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-purple-700">
                {activeKPIs.averageCpc} <span className="text-xs font-normal text-gray-500">FCFA / clic</span>
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                Moyenne multi-plateformes
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="card bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher une campagne, un client..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              {/* Client Filter */}
              <select
                value={clientFilter}
                onChange={e => setClientFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:border-orange-500 outline-none"
              >
                <option value="all">Tous les clients</option>
                {uniqueClients.map(cl => (
                  <option key={cl} value={cl}>{cl}</option>
                ))}
              </select>

              {/* Platform Filter */}
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:border-orange-500 outline-none"
              >
                <option value="all">Toutes plateformes</option>
                <option value="Meta">Meta (Facebook/Instagram)</option>
                <option value="TikTok">TikTok Ads</option>
                <option value="LinkedIn">LinkedIn Ads</option>
                <option value="X">X (Twitter)</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:border-orange-500 outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="Active">Active</option>
                <option value="En pause">En pause</option>
                <option value="Terminée">Terminée</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {/* Only Alerts Toggle Button */}
              <button
                onClick={() => setOnlyAlerts(!onlyAlerts)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  onlyAlerts 
                    ? 'bg-amber-500 text-white shadow-xs' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Vigilance ({alerts.length})</span>
              </button>

              {/* Reset Filters */}
              {(clientFilter !== 'all' || platformFilter !== 'all' || statusFilter !== 'all' || searchQuery || onlyAlerts) && (
                <button
                  onClick={handleResetFilters}
                  title="Réinitialiser tous les filtres"
                  className="p-1.5 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Social Ads Table */}
          <SocialAdsTable
            campaigns={filteredSocialCampaigns}
            onSelectCampaign={(c) => setSelectedSocialCamp(c)}
            onToggleStatus={handleToggleSocialStatus}
          />
        </div>
      )}

      {/* VUE 2 : DISPLAY & PROGRAMMATIQUE */}
      {activeTab === 'display' && (
        <div className="space-y-4">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                <span className="font-semibold">Budget Dépensé Display</span>
                <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-gray-900">
                {activeKPIs.totalSpent.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-500">FCFA</span>
              </div>
              <div className="mt-2 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Plafond : {activeKPIs.totalBudget.toLocaleString('fr-FR')} F</span>
                <span className="font-bold text-cyan-700 font-mono">
                  {activeKPIs.totalBudget > 0 ? Math.round((activeKPIs.totalSpent / activeKPIs.totalBudget) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                <span className="font-semibold">Impressions Programmatiques</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-gray-900">
                {activeKPIs.totalImpressions.toLocaleString('fr-FR')}
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                Diffusées sur GDN, Eskimi DSP & régies médias
              </div>
            </div>

            <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                <span className="font-semibold">Clics & Taux de Clic (CTR)</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <MousePointer className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-emerald-700">
                {activeKPIs.totalClics.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-500">clics</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 font-bold font-mono">
                CTR Moyen : {activeKPIs.averageCtr}%
              </div>
            </div>

            <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                <span className="font-semibold">Conversions Directes</span>
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-purple-700">
                {activeKPIs.totalConversions.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-500">actions</span>
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                Inscriptions, leads ou ventes tracées
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="card bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher une campagne display, format, client..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:border-cyan-600 outline-none"
                />
              </div>

              <select
                value={clientFilter}
                onChange={e => setClientFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:border-cyan-600 outline-none"
              >
                <option value="all">Tous les clients</option>
                {uniqueClients.map(cl => (
                  <option key={cl} value={cl}>{cl}</option>
                ))}
              </select>

              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:border-cyan-600 outline-none"
              >
                <option value="all">Tous les types Display</option>
                <option value="Bannière">Bannières Web</option>
                <option value="Vidéo">Vidéos Preroll</option>
                <option value="Natif">Natif In-Feed</option>
                <option value="Interstitiel">Interstitiels Mobiles</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:border-cyan-600 outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="Active">Active</option>
                <option value="En pause">En pause</option>
                <option value="Terminée">Terminée</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyAlerts(!onlyAlerts)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  onlyAlerts 
                    ? 'bg-amber-500 text-white shadow-xs' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Vigilance ({alerts.length})</span>
              </button>

              {(clientFilter !== 'all' || platformFilter !== 'all' || statusFilter !== 'all' || searchQuery || onlyAlerts) && (
                <button
                  onClick={handleResetFilters}
                  title="Réinitialiser tous les filtres"
                  className="p-1.5 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Display Table */}
          <DisplayTable
            campaigns={filteredDisplayCampaigns}
            onSelectCampaign={(c) => setSelectedDisplayCamp(c)}
            onToggleStatus={handleToggleDisplayStatus}
          />
        </div>
      )}

      {/* VUE 3 : SYNTHÈSE BUDGÉTAIRE & ALERTES */}
      {activeTab === 'synthesis' && (
        <AdsSynthesisView
          socialCampaigns={socialCampaigns}
          displayCampaigns={displayCampaigns}
          onSelectSocial={(c) => { setSelectedSocialCamp(c); }}
          onSelectDisplay={(c) => { setSelectedDisplayCamp(c); }}
          onOpenNewCampaign={() => setIsNewCampaignOpen(true)}
        />
      )}

      {/* VUE 4 : RÉGIES & CONNECTEURS API */}
      {activeTab === 'regies' && (
        <AdsRegiesView
          onOpenApiModal={() => setIsApiSyncOpen(true)}
          onQuickSync={() => triggerNotification('Flux de données régies actualisé avec succès !')}
        />
      )}

      {/* ─── 4. MODALS ─── */}
      {selectedSocialCamp && (
        <SocialAdDetailModal
          campaign={selectedSocialCamp}
          isOpen={!!selectedSocialCamp}
          onClose={() => setSelectedSocialCamp(null)}
          onUpdateCampaign={handleUpdateSocialCampaign}
        />
      )}

      {selectedDisplayCamp && (
        <DisplayDetailModal
          campaign={selectedDisplayCamp}
          isOpen={!!selectedDisplayCamp}
          onClose={() => setSelectedDisplayCamp(null)}
          onUpdateCampaign={handleUpdateDisplayCampaign}
        />
      )}

      {isNewCampaignOpen && (
        <NewCampaignModal
          isOpen={isNewCampaignOpen}
          onClose={() => setIsNewCampaignOpen(false)}
          onSave={handleSaveNewCampaign}
        />
      )}

      {isCsvImportOpen && (
        <CsvImportModal
          isOpen={isCsvImportOpen}
          onClose={() => setIsCsvImportOpen(false)}
          onImportData={handleImportCsv}
        />
      )}

      {isApiSyncOpen && (
        <ApiSyncModal
          isOpen={isApiSyncOpen}
          onClose={() => setIsApiSyncOpen(false)}
          onSyncSuccess={() => triggerNotification('Synchronisation API réussie avec toutes les régies actives.')}
        />
      )}

    </div>
  );
}
