import React, { useState, useEffect, useMemo } from 'react';
import { 
  Share2, Monitor, Plus, Upload, Download, RefreshCw, 
  Search, Filter, ShieldAlert, AlertCircle, CheckCircle2, 
  DollarSign, TrendingUp, Eye, MousePointer, Layers, 
  FileText, ExternalLink, Zap, ChevronDown, BarChart3, Sparkles,
  RotateCcw, Megaphone, Target, ArrowUpRight, BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

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

  // ─── 2. Active Tab (Matching Dashboard & Influence UX) ───
  // 'social' | 'display' | 'synthesis' | 'regies'
  const [activeTab, setActiveTab] = useState('social');

  // ─── 3. Filter States ───
  const [clientFilter, setClientFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAlerts, setOnlyAlerts] = useState(false);
  const [showCharts, setShowCharts] = useState(true);

  // ─── 4. Modals State & Sync Status ───
  const [selectedSocialCamp, setSelectedSocialCamp] = useState(null);
  const [selectedDisplayCamp, setSelectedDisplayCamp] = useState(null);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [isApiSyncOpen, setIsApiSyncOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('14:30');
  const [notification, setNotification] = useState('');

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
      triggerNotification('Données publicitaires et métriques synchronisées en temps réel.');
    }, 600);
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

  // ─── 8. Summary KPIs for Active Tab & Global ───
  const activeKPIs = useMemo(() => {
    const list = activeTab === 'social' ? filteredSocialCampaigns : filteredDisplayCampaigns;
    const totalSpent = list.reduce((sum, c) => sum + (c.budgetSpent || 0), 0);
    const totalBudget = list.reduce((sum, c) => sum + (c.budgetTotal || 0), 0);
    const totalImpressions = list.reduce((sum, c) => sum + (c.impressions || 0), 0);
    const totalClics = list.reduce((sum, c) => sum + (c.clics || 0), 0);
    const averageCtr = totalImpressions > 0 ? ((totalClics / totalImpressions) * 100).toFixed(2) : '0.00';
    const averageCpc = totalClics > 0 ? Math.round(totalSpent / totalClics) : 0;
    const totalConversions = activeTab === 'display' 
      ? list.reduce((sum, c) => sum + (c.conversions || 0), 0)
      : Math.round(totalClics * 0.088); // 8.8% conv rate estimation for social

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

  // Global consolidated numbers
  const globalMetrics = useMemo(() => {
    const all = [...socialCampaigns, ...displayCampaigns];
    const totalSpent = all.reduce((sum, c) => sum + (c.budgetSpent || 0), 0);
    const totalBudget = all.reduce((sum, c) => sum + (c.budgetTotal || 0), 0);
    const totalImpressions = all.reduce((sum, c) => sum + (c.impressions || 0), 0);
    const totalClics = all.reduce((sum, c) => sum + (c.clics || 0), 0);
    const avgCtr = totalImpressions > 0 ? ((totalClics / totalImpressions) * 100).toFixed(2) : '0.00';
    const avgCpc = totalClics > 0 ? Math.round(totalSpent / totalClics) : 0;

    return {
      totalSpent,
      totalBudget,
      totalImpressions,
      totalClics,
      avgCtr,
      avgCpc
    };
  }, [socialCampaigns, displayCampaigns]);

  // Dynamic Chart Breakdown Data (Channel Performance)
  const channelPerformanceChartData = useMemo(() => {
    const channelMap = new Map();

    socialCampaigns.forEach(c => {
      const channel = c.platform || 'Social';
      if (!channelMap.has(channel)) {
        channelMap.set(channel, { channel, spent: 0, clics: 0, impressions: 0 });
      }
      const item = channelMap.get(channel);
      item.spent += (c.budgetSpent || 0);
      item.clics += (c.clics || 0);
      item.impressions += (c.impressions || 0);
    });

    displayCampaigns.forEach(c => {
      const channel = c.displayType || 'Display';
      if (!channelMap.has(channel)) {
        channelMap.set(channel, { channel, spent: 0, clics: 0, impressions: 0 });
      }
      const item = channelMap.get(channel);
      item.spent += (c.budgetSpent || 0);
      item.clics += (c.clics || 0);
      item.impressions += (c.impressions || 0);
    });

    return Array.from(channelMap.values()).map(item => ({
      ...item,
      ctr: item.impressions > 0 ? Number(((item.clics / item.impressions) * 100).toFixed(2)) : 0,
      cpc: item.clics > 0 ? Math.round(item.spent / item.clics) : 0
    })).sort((a, b) => b.spent - a.spent);
  }, [socialCampaigns, displayCampaigns]);

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

  // Switchboard Nodes (Modeled exclusively on Dashboard Analytics Switchboard)
  const socialSpent = socialCampaigns.reduce((sum, c) => sum + (c.budgetSpent || 0), 0);
  const displaySpent = displayCampaigns.reduce((sum, c) => sum + (c.budgetSpent || 0), 0);

  const switchboardNodes = [
    {
      id: 'social',
      label: 'Publications Social Ads',
      icon: '📱',
      metric: `${filteredSocialCampaigns.length} Publications`,
      sub: `${(socialSpent / 1000000).toFixed(1)}M FCFA · Meta, TikTok, X`,
      color: '#FF7900'
    },
    {
      id: 'display',
      label: 'Display & Programmatique',
      icon: '🖥️',
      metric: `${filteredDisplayCampaigns.length} Campagnes`,
      sub: `${(displaySpent / 1000000).toFixed(1)}M FCFA · GDN, Eskimi DSP`,
      color: '#2980B9'
    },
    {
      id: 'synthesis',
      label: 'Synthèse & Alertes ROI',
      icon: '📊',
      metric: `${alerts.length} Alertes actives`,
      sub: `${((socialSpent + displaySpent) / 1000000).toFixed(1)}M FCFA Consolidé`,
      color: '#F39C12'
    },
    {
      id: 'regies',
      label: 'Régies & Connecteurs API',
      icon: '⚡',
      metric: '3 Régies Connectées',
      sub: 'Meta, Google DV360, Eskimi',
      color: '#27AE60'
    }
  ];

  return (
    <div className="ads-sponsoring-section animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ─── TOAST NOTIFICATION ─── */}
      {notification && (
        <div 
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 18px',
            backgroundColor: '#16213E',
            color: '#FFFFFF',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            fontSize: 12,
            fontWeight: 700,
            border: '1px solid #FF7900'
          }}
        >
          <CheckCircle2 size={16} color="#27AE60" />
          <span>{notification}</span>
        </div>
      )}

      {/* ─── 1. TOP HEADER (Identical to Dashboard & Analytics) ─── */}
      <div className="flex justify-between items-center flex-wrap gap-14 mb-4">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              COCKPIT ADS & SPONSORING
            </h1>
            <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
              MCCANN × ORANGE CAMEROUN
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 13 }}>
            Tour de contrôle média, monitoring des investissements Social & Programmatique et ROI 360° en temps réel.
          </p>
        </div>

        {/* Action buttons & Live Sync Status */}
        <div className="flex items-center gap-12 flex-wrap">
          {/* Live sync chip matching Dashboard & Analytics */}
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
                Flux Régies Connecté • {lastSyncTime}
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
            <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span> {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </button>

          <button 
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsApiSyncOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
          >
            <span>⚡</span> Synchroniser API
          </button>

          <button 
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsCsvImportOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
          >
            <span>📤</span> Importer CSV
          </button>

          {/* Export dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
            >
              <span>📥</span> Exporter <ChevronDown size={12} />
            </button>

            {showExportMenu && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: 6,
                  width: 220,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E0E0E0',
                  borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 40,
                  padding: 6
                }}
                onClick={() => setShowExportMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => exportAdsPdfReport(activeTab === 'social' ? filteredSocialCampaigns : filteredDisplayCampaigns, activeTab)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 6,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#E65100'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFF8F2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <FileText size={14} color="#FF7900" />
                  <span>Rapport d'audit PDF Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => activeTab === 'social' ? exportSocialAdsCsv(filteredSocialCampaigns) : exportDisplayCsv(filteredDisplayCampaigns)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 6,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--dark)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Download size={14} color="#666" />
                  <span>Exporter Données (CSV)</span>
                </button>
              </div>
            )}
          </div>

          <button 
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsNewCampaignOpen(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              background: '#FF7900',
              borderColor: '#FF7900',
              boxShadow: '0 2px 8px rgba(255, 121, 0, 0.3)'
            }}
          >
            <Plus size={15} />
            <span>Nouvelle Campagne</span>
          </button>
        </div>
      </div>

      {/* ─── 2. THE VISUAL ANALYTICS SWITCHBOARD RIBBON (Directly from Dashboard & Analytics) ─── */}
      <div 
        className="card mb-4 bridge-ribbon-container animate-fade"
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          color: '#FFFFFF',
          borderRadius: 14,
          padding: '18px 24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div 
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 10, 
                background: 'rgba(255, 121, 0, 0.15)', 
                border: '1px solid rgba(255, 121, 0, 0.4)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 22 
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.5px' }}>THE ADS & SPONSORING SWITCHBOARD</span>
                <span 
                  style={{ 
                    fontSize: 11, 
                    fontWeight: 700, 
                    padding: '3px 9px', 
                    borderRadius: 20, 
                    background: alerts.length > 0 ? 'rgba(243, 156, 18, 0.15)' : 'rgba(39, 174, 96, 0.15)', 
                    color: alerts.length > 0 ? '#F39C12' : '#2ECC71', 
                    border: alerts.length > 0 ? '1px solid #F39C12' : '1px solid #27AE60' 
                  }}
                >
                  {alerts.length > 0 ? `🟠 Vigilance Active (${alerts.length} alertes)` : '🟢 Flux Nominal • Synchronisé'}
                </span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                Tour de Contrôle Transverse • Pilotage direct <strong>Orange Cameroun ⇄ McCann Douala</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Audience Cumulée Reach</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#FF9D3D' }}>
                {(globalMetrics.totalImpressions / 1000000).toFixed(2)}M d'impressions
              </div>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 16 }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Budget Consommé Global</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#2ECC71' }}>
                {(globalMetrics.totalSpent / 1000000).toFixed(1)}M FCFA HT
              </div>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 16 }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Efficacité Moyenne</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#00D2D3' }}>
                CTR {globalMetrics.avgCtr}% · ROAS 4.2x
              </div>
            </div>
          </div>
        </div>

        {/* The Visual Bridge Ribbon (from Left Orange to Right McCann) */}
        <div 
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: 12,
            padding: '14px 18px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF7900' }}></span>
              <span>ORANGE CAMEROUN (Gouvernance, Budgets & Stratégie)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>MCCANN DOUALA (Media Buying, Création & Optimisation)</span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2980B9' }}></span>
            </div>
          </div>

          {/* Step Nodes Ribbon */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 8,
              position: 'relative',
            }}
          >
            {switchboardNodes.map((node) => {
              const isSelected = activeTab === node.id;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveTab(node.id)}
                  style={{
                    background: isSelected 
                      ? 'rgba(255, 121, 0, 0.25)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isSelected 
                      ? `2px solid ${node.color}` 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    textAlign: 'left',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>{node.icon}</span>
                    <span 
                      style={{ 
                        fontSize: 10, 
                        fontWeight: 700, 
                        color: node.color, 
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px' 
                      }}
                    >
                      {isSelected ? '● ACTIF' : 'CONSULTER'}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2 }}>
                    {node.label}
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 700, color: '#FFD1A4', marginTop: 4 }}>
                    {node.metric}
                  </div>

                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
                    {node.sub}
                  </div>

                  {isSelected && (
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: node.color
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 3. DETAILED KPI DECK (Matching Dashboard AdsAnalyticsView) ─── */}
      {(activeTab === 'social' || activeTab === 'display') && (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
            gap: 10 
          }}
        >
          <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0', padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>BUDGET ALLOUÉ</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>
              {(activeKPIs.totalBudget / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>FCFA HT</div>
          </div>

          <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0', padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>BUDGET DÉPENSÉ</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FF7900', marginTop: 2 }}>
              {(activeKPIs.totalSpent / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: 10, color: '#27AE60', fontWeight: 700, marginTop: 2 }}>
              {activeKPIs.totalBudget > 0 ? Math.round((activeKPIs.totalSpent / activeKPIs.totalBudget) * 100) : 0}% engagé
            </div>
          </div>

          <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0', padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>IMPRESSIONS</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>
              {(activeKPIs.totalImpressions / 1000000).toFixed(2)}M
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Vues payantes</div>
          </div>

          <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0', padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CLICS TOTAUX</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#2980B9', marginTop: 2 }}>
              {(activeKPIs.totalClics / 1000).toFixed(1)}K
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Trafic qualifié</div>
          </div>

          <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0', padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CTR MOYEN</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#27AE60', marginTop: 2 }}>
              {activeKPIs.averageCtr}%
            </div>
            <div style={{ fontSize: 10, color: '#27AE60', fontWeight: 700, marginTop: 2 }}>
              +0.8% vs benchmark
            </div>
          </div>

          <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0', padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CPC MOYEN</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>
              {activeKPIs.averageCpc} F
            </div>
            <div style={{ fontSize: 10, color: '#27AE60', fontWeight: 700, marginTop: 2 }}>
              Très efficient
            </div>
          </div>

          <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0', padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CPM MOYEN</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>
              {activeKPIs.totalImpressions > 0 ? Math.round((activeKPIs.totalSpent / activeKPIs.totalImpressions) * 1000) : 0} F
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Pour 1000 vues</div>
          </div>

          <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0', padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CONVERSIONS</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#8E44AD', marginTop: 2 }}>
              {activeKPIs.totalConversions.toLocaleString('fr-FR')}
            </div>
            <div style={{ fontSize: 10, color: '#8E44AD', fontWeight: 700, marginTop: 2 }}>
              ROAS moyen 4.5x
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. INTERACTIVE RECHARTS PERFORMANCE CHARTS (From Dashboard AdsAnalyticsView) ─── */}
      {(activeTab === 'social' || activeTab === 'display') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📈</span> MONITORING ANALYTIQUE DES RÉGIES & LEVIERS MEDIA
            </div>
            <button
              type="button"
              onClick={() => setShowCharts(!showCharts)}
              className="btn btn-ghost btn-xs"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}
            >
              <span>{showCharts ? '🔼 Masquer les graphiques' : '🔽 Afficher les graphiques'}</span>
            </button>
          </div>

          {showCharts && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
              {/* Chart 1: Budget Spent vs Clics */}
              <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📊</span> Budget Dépensé vs Clics Générés par Canal Ads
                </h3>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
                  Volume des dépenses et acquisition de trafic par régie publicitaire
                </p>

                <div style={{ height: 250, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelPerformanceChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={v => `${(v / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                      <Bar yAxisId="left" dataKey="spent" name="Dépensé (FCFA)" fill="#FF7900" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="clics" name="Clics Obtenus" fill="#2980B9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: CTR vs CPC */}
              <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🎯</span> Efficacité Tarifaire : CTR (%) vs Coût Par Clic (CPC)
                </h3>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
                  Analyse de la rentabilité des enchères sur chaque levier publicitaire
                </p>

                <div style={{ height: 250, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelPerformanceChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={v => `${v}%`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={v => `${v} F`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                      <Bar yAxisId="left" dataKey="ctr" name="Taux de Clic (CTR %)" fill="#27AE60" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="cpc" name="Coût par Clic (CPC FCFA)" fill="#8E44AD" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── 5. FILTER BAR (Matching Dashboard & Analytics Filter Bar) ─── */}
      {(activeTab === 'social' || activeTab === 'display') && (
        <div 
          className="card" 
          style={{ 
            background: '#FFFFFF', 
            border: '1px solid #E0E0E0', 
            borderRadius: 12, 
            padding: '12px 16px', 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: 12 
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, flex: 1, minWidth: 280 }}>
            {/* Search input */}
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#888' }} />
              <input
                type="text"
                placeholder={activeTab === 'social' ? "Rechercher une publication sponsorisée, un client..." : "Rechercher une campagne display, format, client..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: 32,
                  paddingRight: 12,
                  paddingTop: 7,
                  paddingBottom: 7,
                  backgroundColor: '#F8F9FA',
                  border: '1px solid #D0D0D0',
                  borderRadius: 8,
                  fontSize: 12,
                  outline: 'none'
                }}
              />
            </div>

            {/* Client Filter */}
            <select
              value={clientFilter}
              onChange={e => setClientFilter(e.target.value)}
              style={{
                padding: '7px 12px',
                backgroundColor: '#F8F9FA',
                border: '1px solid #D0D0D0',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--dark)',
                outline: 'none'
              }}
            >
              <option value="all">Tous les clients</option>
              {uniqueClients.map(cl => (
                <option key={cl} value={cl}>{cl}</option>
              ))}
            </select>

            {/* Platform / Format Filter */}
            {activeTab === 'social' ? (
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  backgroundColor: '#F8F9FA',
                  border: '1px solid #D0D0D0',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--dark)',
                  outline: 'none'
                }}
              >
                <option value="all">Toutes plateformes</option>
                <option value="Meta">Meta (Facebook/Instagram)</option>
                <option value="TikTok">TikTok Ads</option>
                <option value="LinkedIn">LinkedIn Ads</option>
                <option value="X">X (Twitter)</option>
              </select>
            ) : (
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  backgroundColor: '#F8F9FA',
                  border: '1px solid #D0D0D0',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--dark)',
                  outline: 'none'
                }}
              >
                <option value="all">Tous formats Display</option>
                <option value="Bannière">Bannières Web</option>
                <option value="Vidéo">Vidéos Preroll</option>
                <option value="Natif">Natif In-Feed</option>
                <option value="Interstitiel">Interstitiels Mobiles</option>
              </select>
            )}

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                padding: '7px 12px',
                backgroundColor: '#F8F9FA',
                border: '1px solid #D0D0D0',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--dark)',
                outline: 'none'
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="Active">Active</option>
              <option value="En pause">En pause</option>
              <option value="Terminée">Terminée</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Vigilance Toggle Button */}
            <button
              type="button"
              onClick={() => setOnlyAlerts(!onlyAlerts)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: onlyAlerts ? '1px solid #D97706' : '1px solid #D0D0D0',
                backgroundColor: onlyAlerts ? '#F59E0B' : '#F8F9FA',
                color: onlyAlerts ? '#FFFFFF' : '#64748B'
              }}
            >
              <ShieldAlert size={14} />
              <span>Vigilance ({alerts.length})</span>
            </button>

            {/* Reset Filters */}
            {(clientFilter !== 'all' || platformFilter !== 'all' || statusFilter !== 'all' || searchQuery || onlyAlerts) && (
              <button
                type="button"
                onClick={handleResetFilters}
                title="Réinitialiser tous les filtres"
                style={{
                  padding: 8,
                  borderRadius: 8,
                  border: '1px solid #D0D0D0',
                  backgroundColor: '#F8F9FA',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── 6. TAB CONTENT VIEWS ─── */}

      {/* VUE 1 : SOCIAL ADS */}
      {activeTab === 'social' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SocialAdsTable
            campaigns={filteredSocialCampaigns}
            onSelectCampaign={(c) => setSelectedSocialCamp(c)}
            onToggleStatus={handleToggleSocialStatus}
          />
        </div>
      )}

      {/* VUE 2 : DISPLAY & PROGRAMMATIQUE */}
      {activeTab === 'display' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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

      {/* ─── 7. MODALS ─── */}
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
