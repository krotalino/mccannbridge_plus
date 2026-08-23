import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, AlertTriangle, Eye, ShieldAlert, 
  Layers, MapPin, Clock, Zap, Download, Plus, Pause, Play, 
  RefreshCw, CheckCircle2, ChevronRight, BarChart2, PieChart,
  Target, Info, ArrowUpRight, ArrowDownRight, ExternalLink
} from 'lucide-react';
import { ADS_SPONSORING_INITIAL_DATA } from '../../../data/adsSponsoringData';
import AdsReportExportModal from './AdsReportExportModal';
import NewCampaignModal from './NewCampaignModal';

const FMT = (n) => (typeof n === 'number' ? n.toLocaleString('fr-FR') : n);

export default function AdsSponsoringSection() {
  const [data, setData] = useState(ADS_SPONSORING_INITIAL_DATA);
  const [selectedPlatformTab, setSelectedPlatformTab] = useState('all'); // 'all' | 'meta' | 'tiktok' | 'linkedin' | 'twitter' | 'whatsapp' | 'display'
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [selectedObjectiveFilter, setSelectedObjectiveFilter] = useState('all');
  const [activeAlerts, setActiveAlerts] = useState(data.alerts);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [campaignsList, setCampaignsList] = useState(data.campaigns);
  const [activeViewMode, setActiveViewMode] = useState('overview'); // 'overview' | 'financial' | 'platforms' | 'creatives' | 'geo_hourly'

  const { strategicKpis, platforms, creatives, geographicDistribution, dayparting } = data;

  // Toggle Campaign status
  const handleToggleCampaignStatus = (id) => {
    setCampaignsList(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'paused' : 'active';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Add new campaign
  const handleSaveNewCampaign = (newCamp) => {
    setCampaignsList(prev => [newCamp, ...prev]);
  };

  // Dismiss alert
  const handleDismissAlert = (id) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
    setDismissedAlerts(prev => [...prev, id]);
  };

  // Filtered campaigns
  const filteredCampaigns = campaignsList.filter(c => {
    if (selectedBrandFilter !== 'all' && c.brand !== selectedBrandFilter) return false;
    if (selectedObjectiveFilter !== 'all' && !c.objective.toLowerCase().includes(selectedObjectiveFilter.toLowerCase())) return false;
    if (selectedPlatformTab !== 'all') {
      const matchMap = {
        meta: ['Facebook', 'Instagram'],
        tiktok: ['TikTok'],
        linkedin: ['LinkedIn'],
        twitter: ['X (Twitter)', 'Twitter'],
        whatsapp: ['Chaîne WhatsApp', 'WhatsApp'],
        display: ['Display']
      };
      const validNames = matchMap[selectedPlatformTab] || [];
      const hasPlatform = c.platforms.some(p => validNames.some(v => p.includes(v)));
      if (!hasPlatform) return false;
    }
    return true;
  });

  return (
    <div className="ads-sponsoring-container space-y-6">
      
      {/* ─── Top Header & Cockpit Action Bar ─── */}
      <div className="bg-[#151821] p-5 rounded-2xl border border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              PILOTAGE ADS & SPONSORING
            </span>
            <span className="text-xs text-slate-400">· McCann Bridge × Orange Cameroun</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">
            Cockpit de Suivi Budgétaire & Performance Multi-Plateformes
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Contrôle en temps réel du Cap Cost, métriques AARRR, fatigue créative et alertes sur Facebook, Instagram, TikTok, LinkedIn, X, WhatsApp & Display.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1e2430] hover:bg-[#283040] text-slate-200 border border-white/10 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Download size={14} className="text-orange-400" />
            <span>Exporter Rapports PDF</span>
          </button>
          
          <button
            onClick={() => setIsNewCampaignOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>+ Lancer / Booster Campagne</span>
          </button>
        </div>
      </div>

      {/* ─── 1. SYNTHÈSE STRATÉGIQUE (LE HAUT DU DASHBOARD) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : ROAS Global */}
        <div className="bg-[#151821] p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ROAS Global (ROI)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {strategicKpis.roasGlobal}x
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">1 FCFA dépensé</span> = <strong className="text-white">5,2 FCFA</strong> de revenus
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{strategicKpis.roasDelta}</div>
        </div>

        {/* KPI 2 : Cap Cost / Budget Consommé vs Planifié */}
        <div className="bg-[#151821] p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cap Cost (Budget)</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {FMT(strategicKpis.budgetTotalConsomme)} <span className="text-xs text-slate-400 font-normal">FCFA</span>
          </div>
          <div className="w-full bg-[#222838] h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${strategicKpis.pctBudgetConsomme}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>{strategicKpis.pctBudgetConsomme}% consommé</span>
            <span>Sur {FMT(strategicKpis.budgetTotalPlanifie)} FCFA</span>
          </div>
        </div>

        {/* KPI 3 : CPA Moyen Pondéré vs Cible */}
        <div className="bg-[#151821] p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CPA Moyen Pondéré</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
              <Target size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {strategicKpis.cpaMoyenPondere} <span className="text-xs text-slate-400 font-normal">FCFA</span>
          </div>
          <div className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <ArrowDownRight size={14} /> -108 FCFA sous la cible ({strategicKpis.cpaCiblePondere} FCFA)
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">CPM Moyen : {strategicKpis.cpmMoyenPondere} FCFA · CPC : {strategicKpis.cpcMoyenPondere} FCFA</div>
        </div>

        {/* KPI 4 : Pacing & Alertes Actives */}
        <div className="bg-[#151821] p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pacing & Alertes</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-base font-black text-emerald-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 size={16} /> {strategicKpis.pacingLabel}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            {strategicKpis.pacingProjection}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold">
              {activeAlerts.length} alerte{activeAlerts.length > 1 ? 's' : ''} active{activeAlerts.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

      </div>

      {/* ─── 2. SYSTÈME D'ALERTES AUTOMATIQUES (PILOTE AUTOMATIQUE) ─── */}
      {activeAlerts.length > 0 && (
        <div className="bg-[#151821] p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={16} /> Pilote Automatique : Alertes d'Efficacité Immédiates ({activeAlerts.length})
              </span>
              <span className="text-xs text-slate-400">· Réactivité en 15 minutes</span>
            </div>
            <span className="text-xs text-slate-400">Algorithme de surveillance McCann × Orange</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  alert.level === 'critical' 
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' 
                    : alert.level === 'warning'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-blue-950/30 border-blue-500/40 text-blue-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {alert.level === 'critical' ? '🚨' : alert.level === 'warning' ? '⚠️' : 'ℹ️'} {alert.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{alert.date}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-semibold mt-1">
                    Campagne : {alert.campaignName} ({alert.platform})
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {alert.message}
                  </div>
                  <div className="text-[11px] text-orange-300/90 mt-1.5 bg-black/20 p-2 rounded border border-white/5">
                    <strong>Action recommandée :</strong> {alert.recommendation}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                  <button
                    onClick={() => alert(`Action "${alert.actionLabel}" appliquée avec succès sur ${alert.campaignName}.`)}
                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-[11px] font-bold cursor-pointer transition-all"
                  >
                    {alert.actionLabel}
                  </button>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    Ignorer l'alerte
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 3. NAVIGATION PAR VUE THÉMATIQUE ─── */}
      <div className="flex flex-wrap items-center gap-2 bg-[#151821] p-2 rounded-xl border border-white/10">
        {[
          { id: 'overview', label: 'Vue Globale & Campagnes', icon: '📊' },
          { id: 'financial', label: 'Suivi Budgétaire & Cap Cost', icon: '💰' },
          { id: 'platforms', label: 'Media Mix (6 Plateformes)', icon: '📱' },
          { id: 'creatives', label: 'Scores Créatifs & Anti-Fatigue', icon: '🎨' },
          { id: 'geo_hourly', label: 'Ciblage Géographique & Dayparting', icon: '🗺️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveViewMode(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeViewMode === tab.id
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── VUE 1 : VUE GLOBALE & TABLEAU DE BORD DES CAMPAGNES ─── */}
      {(activeViewMode === 'overview' || activeViewMode === 'financial') && (
        <div className="space-y-6">
          
          {/* Tableau Comparatif des Campagnes */}
          <div className="bg-[#151821] p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span>📢</span> Suivi des Campagnes Actives ({filteredCampaigns.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Budget consommé vs planifié, Pacing journalier, CPA actuel vs cible et ROAS
                </p>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedBrandFilter}
                  onChange={(e) => setSelectedBrandFilter(e.target.value)}
                  className="bg-[#1e2430] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="all">Toutes les Marques</option>
                  <option value="Orange Telco">Orange Telco</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Orange Business">Orange Business</option>
                  <option value="Orange Digital Center">Orange Digital Center</option>
                </select>

                <select
                  value={selectedObjectiveFilter}
                  onChange={(e) => setSelectedObjectiveFilter(e.target.value)}
                  className="bg-[#1e2430] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="all">Tous les Objectifs</option>
                  <option value="conversions">Conversions</option>
                  <option value="acquisition">Acquisition</option>
                  <option value="leads">Leads B2B</option>
                  <option value="engagement">Engagement</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1a1f2c] text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Campagne & Marque</th>
                    <th className="p-3">Plateformes</th>
                    <th className="p-3 text-right">Budget Planifié</th>
                    <th className="p-3 text-right">Budget Consommé</th>
                    <th className="p-3 text-center">Rythme (Pacing)</th>
                    <th className="p-3 text-right">CPA Réel / Cible</th>
                    <th className="p-3 text-center">ROAS</th>
                    <th className="p-3 text-center">Fatigue Créative</th>
                    <th className="p-3 text-center">Statut / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCampaigns.map(c => {
                    const pctSpent = Math.round((c.budgetConsomme / c.budgetPlanifie) * 100);
                    return (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white text-xs">{c.title}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="text-orange-400 font-semibold">{c.brand}</span> · <span>{c.objective}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {c.platforms.map((p, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-300">
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right text-slate-300 font-medium">
                          {FMT(c.budgetPlanifie)} FCFA
                        </td>
                        <td className="p-3 text-right">
                          <div className="font-bold text-white">{FMT(c.budgetConsomme)} FCFA</div>
                          <div className="text-[10px] text-slate-400">{pctSpent}% consommé</div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.pacing === 'on_track' ? 'bg-emerald-500/20 text-emerald-400' :
                            c.pacing === 'over_spending' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {c.pacing === 'on_track' ? 'On-track' : c.pacing === 'over_spending' ? 'Over-spending' : 'Under-spending'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">{c.daysLeft} jours restants</div>
                        </td>
                        <td className="p-3 text-right">
                          <div className={`font-bold ${c.cpaCurrent <= c.cpaTarget ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {c.cpaCurrent} FCFA
                          </div>
                          <div className="text-[10px] text-slate-400">Cible: {c.cpaTarget} FCFA</div>
                        </td>
                        <td className="p-3 text-center font-bold text-emerald-400">
                          {c.roas}x
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.fatigueLevel === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                            c.fatigueLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-rose-500/20 text-rose-400'
                          }`}>
                            {c.fatigueLevel === 'low' ? '🟢 Neuf (<1.8)' : c.fatigueLevel === 'medium' ? '🟠 Moyen' : '🔴 Saturé (>3.0)'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">Freq: {c.frequency}</div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleCampaignStatus(c.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 mx-auto transition-all cursor-pointer ${
                              c.status === 'active'
                                ? 'bg-white/10 hover:bg-white/20 text-slate-200'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            }`}
                          >
                            {c.status === 'active' ? <><Pause size={10} /> Mettre en pause</> : <><Play size={10} /> Reprendre</>}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dépenses par Support & Comparaison de la Cherté de l'Inventaire (CPM) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Répartition Budgétaire (Media Mix) */}
            <div className="bg-[#151821] p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <PieChart size={16} className="text-orange-400" /> Répartition du Budget par Support
                </h3>
                <span className="text-xs text-slate-400">Total : {FMT(strategicKpis.budgetTotalConsomme)} FCFA</span>
              </div>

              <div className="space-y-3">
                {platforms.map(p => (
                  <div key={p.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span>{p.icon}</span> {p.name}
                      </span>
                      <span className="text-white">
                        {FMT(p.budgetConsomme)} FCFA <strong className="text-orange-400">({p.budgetPartPct}%)</strong>
                      </span>
                    </div>
                    <div className="w-full bg-[#1e2430] h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${p.budgetPartPct}%`, backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cherté Relative de l'Inventaire : CPM & CPC Comparatifs */}
            <div className="bg-[#151821] p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 size={16} className="text-blue-400" /> Benchmark CPM & CPA par Plateforme
                </h3>
                <span className="text-xs text-slate-400">Coût / 1 000 Impressions</span>
              </div>

              <div className="space-y-2.5">
                {platforms.map(p => (
                  <div key={p.id} className="bg-[#1a1f2c] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400">CTR : {p.ctr}% · CVR : {p.cvr}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-xs font-bold text-white">{p.cpm} FCFA</div>
                        <div className="text-[10px] text-slate-400">CPM (Mille)</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-400">{p.cpa} FCFA</div>
                        <div className="text-[10px] text-slate-400">CPA (Action)</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-orange-400">{p.roas}x</div>
                        <div className="text-[10px] text-slate-400">ROAS</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─── VUE 2 : MEDIA MIX & SPÉCIFICITÉS TECHNIQUES DES 6 PLATEFORMES ─── */}
      {(activeViewMode === 'overview' || activeViewMode === 'platforms') && (
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                LE SUIVI PAR PLATEFORME (SPÉCIFICITÉS TECHNIQUES)
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                Indicateurs Clés & Performance Adaptée à chaque Réseau
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedPlatformTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatformTab === 'all' ? 'bg-orange-500 text-white' : 'bg-[#1e2430] text-slate-400 hover:text-white'
                }`}
              >
                Toutes ({platforms.length})
              </button>
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatformTab(p.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedPlatformTab === p.id ? 'bg-orange-500 text-white' : 'bg-[#1e2430] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms
              .filter(p => selectedPlatformTab === 'all' || p.id === selectedPlatformTab)
              .map(p => (
                <div key={p.id} className="bg-[#1a1f2c] p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                          <h4 className="text-sm font-black text-white">{p.name}</h4>
                          <span className="text-[10px] text-slate-400">{p.specificMetrics.primaryObjective}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                        ROAS {p.roas}x
                      </span>
                    </div>

                    {/* Standard Metrics */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
                      <div className="bg-[#151821] p-2 rounded">
                        <div className="text-[10px] text-slate-400">Budget</div>
                        <div className="text-xs font-bold text-white">{FMT(p.budgetConsomme)} F</div>
                      </div>
                      <div className="bg-[#151821] p-2 rounded">
                        <div className="text-[10px] text-slate-400">CPA Réel</div>
                        <div className="text-xs font-bold text-emerald-400">{p.cpa} F</div>
                      </div>
                      <div className="bg-[#151821] p-2 rounded">
                        <div className="text-[10px] text-slate-400">CTR</div>
                        <div className="text-xs font-bold text-white">{p.ctr}%</div>
                      </div>
                    </div>

                    {/* Specific Technical Metrics Highlight */}
                    <div className="mt-3 bg-[#151821] p-3 rounded-lg border border-white/5 space-y-1.5">
                      <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                        Métriques Spécifiques Plateforme
                      </div>
                      
                      {p.id === 'meta' && (
                        <div className="text-xs text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span>Fréquences croisées :</span>
                            <strong className="text-white">Feed {p.specificMetrics.feedShare} · Reels {p.specificMetrics.reelsShare} · Stories {p.specificMetrics.storiesShare}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Coût par clic lien (CPL) :</span>
                            <strong className="text-emerald-400">{p.specificMetrics.costPerLinkClick} FCFA</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Ad Recall Lift :</span>
                            <strong className="text-blue-400">{p.specificMetrics.adRecallLift}</strong>
                          </div>
                        </div>
                      )}

                      {p.id === 'tiktok' && (
                        <div className="text-xs text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span>Swipe-Up Rate :</span>
                            <strong className="text-white">{p.specificMetrics.swipeUpRate}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Son Activé (Sound-On) :</span>
                            <strong className="text-emerald-400">{p.specificMetrics.soundOnRate}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Complétion 100% (VTR) :</span>
                            <strong className="text-blue-400">{p.specificMetrics.vtrFull100}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Partages viraux :</span>
                            <strong className="text-orange-400">{p.specificMetrics.viralShareRate}</strong>
                          </div>
                        </div>
                      )}

                      {p.id === 'linkedin' && (
                        <div className="text-xs text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span>Interaction C-Suite (VP/Dir) :</span>
                            <strong className="text-white">{p.specificMetrics.cSuiteInteractionRate}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Téléchargements Docs B2B :</span>
                            <strong className="text-emerald-400">{p.specificMetrics.whitepaperDownloads}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Taux d'ouverture InMail :</span>
                            <strong className="text-blue-400">{p.specificMetrics.sponsoredInMailOpenRate}</strong>
                          </div>
                        </div>
                      )}

                      {p.id === 'twitter' && (
                        <div className="text-xs text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span>Taux d'engagement (RT+Like) :</span>
                            <strong className="text-white">{p.specificMetrics.rtPlusLikesRate}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Sentiment Public :</span>
                            <strong className="text-emerald-400">{p.specificMetrics.sentimentPositive} Positif</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Hashtag Boost :</span>
                            <strong className="text-blue-400">{p.specificMetrics.trendingHashtagBoost}</strong>
                          </div>
                        </div>
                      )}

                      {p.id === 'whatsapp' && (
                        <div className="text-xs text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span>Taux d'ouverture (Click-to-Open) :</span>
                            <strong className="text-emerald-400">{p.specificMetrics.clickToOpenRate}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Clic sur CTA ("Acheter Pass") :</span>
                            <strong className="text-white">{p.specificMetrics.ctaClickRate}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Taux de désabonnement :</span>
                            <strong className="text-slate-400">{p.specificMetrics.optOutBlockRate} (Minimal)</strong>
                          </div>
                        </div>
                      )}

                      {p.id === 'display' && (
                        <div className="text-xs text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span>Viewability MRC :</span>
                            <strong className="text-emerald-400">{p.specificMetrics.viewabilityMRC}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Clics non-humains (Bots) :</span>
                            <strong className="text-emerald-400">{p.specificMetrics.invalidClicksRate}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Taux de rebond :</span>
                            <strong className="text-slate-300">{p.specificMetrics.landingPageBounceRate}</strong>
                          </div>
                          <div className="text-[10px] text-slate-400 pt-1">
                            Top sites : {p.specificMetrics.topPublishers}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-white/5">
                    <span>Reach : {(p.reach / 1000).toFixed(0)}k</span>
                    <span>Impressions : {(p.impressions / 1000).toFixed(0)}k</span>
                    <span className="text-emerald-400 font-bold">{p.conversions} conv.</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ─── VUE 3 : LE SUIVI CRÉATIF (SCORES DES ASSETS & FATIGUE SCORE) ─── */}
      {(activeViewMode === 'overview' || activeViewMode === 'creatives') && (
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                LE SUIVI CRÉATIF (LE SCORE DES ASSETS)
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                Classement Top / Flop & Détection de la Creative Fatigue (Anti-Usure)
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                🟢 Vert = Neuf (&lt; 1.8)
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold">
                🟠 Orange = Moyen (1.8 - 2.9)
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold">
                🔴 Rouge = À remplacer (&ge; 3.0)
              </span>
            </div>
          </div>

          {/* Grid Creatives */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creatives.map(crt => (
              <div 
                key={crt.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  crt.fatigueStatus === 'fatigued'
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : crt.fatigueStatus === 'medium'
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-[#1a1f2c] border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{crt.thumbnailEmoji}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      crt.fatigueStatus === 'fresh' ? 'bg-emerald-500/20 text-emerald-400' :
                      crt.fatigueStatus === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400 animate-pulse'
                    }`}>
                      {crt.fatigueLabel}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-white mt-2 line-clamp-1">{crt.title}</h4>
                  <div className="text-[10px] text-slate-400">{crt.platform} · {crt.format}</div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/10 text-center">
                    <div className="bg-[#151821] p-1.5 rounded">
                      <div className="text-[9px] text-slate-400">CTR</div>
                      <div className="text-xs font-bold text-white">{crt.ctr}%</div>
                    </div>
                    <div className="bg-[#151821] p-1.5 rounded">
                      <div className="text-[9px] text-slate-400">CPA</div>
                      <div className="text-xs font-bold text-emerald-400">{crt.cpa} F</div>
                    </div>
                    <div className="bg-[#151821] p-1.5 rounded">
                      <div className="text-[9px] text-slate-400">Fréquence</div>
                      <div className={`text-xs font-bold ${crt.frequency >= 3.0 ? 'text-rose-400' : 'text-white'}`}>
                        {crt.frequency}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-300 bg-[#151821] p-2 rounded space-y-0.5">
                    <div><strong>Test A/B :</strong> {crt.abVariant}</div>
                    <div><strong>Clics :</strong> {crt.ctaClickRate}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold text-orange-400">{crt.ranking}</span>
                  {crt.fatigueStatus === 'fatigued' ? (
                    <button
                      onClick={() => alert(`Remplacement de l'asset ${crt.id} par la variante neuve activé.`)}
                      className="px-2.5 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold cursor-pointer transition-all"
                    >
                      Remplacer d'urgence
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-400">Diffusion optimale</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* A/B Testing & Intention de Clic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#1a1f2c] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={14} /> Attribution des Tests A/B (Module Growth Hacking)
              </div>
              <div className="text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between bg-[#151821] p-2 rounded">
                  <span>Variante A (Néon Électrique Orange) :</span>
                  <strong className="text-emerald-400">Gagnante (+38% CVR, CPA -24%)</strong>
                </div>
                <div className="flex justify-between bg-[#151821] p-2 rounded">
                  <span>Variante B (Émotionnelle Famille) :</span>
                  <strong className="text-slate-400">Arrêtée (CPA 580 FCFA)</strong>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1f2c] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target size={14} /> Intention d'Achat : Clic sur CTA vs Clic sur Visuel
              </div>
              <div className="text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between bg-[#151821] p-2 rounded">
                  <span>Clics sur Bouton CTA Direct ("Acheter Pass") :</span>
                  <strong className="text-emerald-400">68% (Forte intention d'achat)</strong>
                </div>
                <div className="flex justify-between bg-[#151821] p-2 rounded">
                  <span>Clics sur Photo / Vidéo (Curiosité) :</span>
                  <strong className="text-slate-400">32% (Intention informative)</strong>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ─── VUE 4 : CIBLAGE GÉOGRAPHIQUE (HEATMAP) & PERFORMANCE HORAIRE (DAYPARTING) ─── */}
      {(activeViewMode === 'overview' || activeViewMode === 'geo_hourly') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Suivi Géographique (Villes Cameroun) */}
          <div className="bg-[#151821] p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-orange-400" /> Répartition Géographique des Conversions
              </h3>
              <span className="text-xs text-slate-400">Priorisation ROI</span>
            </div>

            <div className="space-y-3">
              {geographicDistribution.map((geo, idx) => (
                <div key={idx} className="bg-[#1a1f2c] p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: geo.color }} />
                      {geo.region}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {geo.pctShare}% des conversions ({FMT(geo.conversions)})
                    </span>
                  </div>

                  <div className="w-full bg-[#151821] h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${geo.pctShare}%`, backgroundColor: geo.color }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Budget : {FMT(geo.budgetConsomme)} FCFA</span>
                    <span>CPA : <strong className="text-white">{geo.cpa} FCFA</strong></span>
                    <span>ROAS : <strong className="text-emerald-400">{geo.roas}x</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suivi Horaire (Dayparting) */}
          <div className="bg-[#151821] p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-blue-400" /> Performance Horaire (Dayparting)
              </h3>
              <span className="text-xs text-slate-400">Pics d'Audience 24h</span>
            </div>

            <div className="space-y-2.5">
              {dayparting.map((dp, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border transition-all ${
                    dp.pctConversions >= 30 
                      ? 'bg-orange-950/20 border-orange-500/40' 
                      : 'bg-[#1a1f2c] border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{dp.slot}</span>
                    <span className={`font-black ${dp.pctConversions >= 30 ? 'text-orange-400 text-sm' : 'text-slate-300'}`}>
                      {dp.pctConversions}% des conversions
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1">
                    {dp.note}
                  </div>

                  <div className="text-[10px] text-emerald-400/90 font-semibold mt-1 bg-black/20 px-2 py-1 rounded">
                    ⚡ Stratégie : {dp.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ─── Modals ─── */}
      {isExportModalOpen && (
        <AdsReportExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={data}
        />
      )}

      {isNewCampaignOpen && (
        <NewCampaignModal
          isOpen={isNewCampaignOpen}
          onClose={() => setIsNewCampaignOpen(false)}
          onSave={handleSaveNewCampaign}
        />
      )}

    </div>
  );
}
