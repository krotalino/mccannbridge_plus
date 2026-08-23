import React, { useState } from 'react';
import { 
  X, Download, Printer, FileText, Check, ShieldCheck, 
  TrendingUp, DollarSign, AlertTriangle, Layers, BarChart2,
  PieChart, Share2, Copy
} from 'lucide-react';

const FMT = (n) => (typeof n === 'number' ? n.toLocaleString('fr-FR') : n);

export default function AdsReportExportModal({ isOpen, onClose, data }) {
  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' | 'csv'
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // 'today' | 'week' | 'month' | 'campaign'
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState('all');
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includePlatforms, setIncludePlatforms] = useState(true);
  const [includeCreatives, setIncludeCreatives] = useState(true);
  const [includeGeoHourly, setIncludeGeoHourly] = useState(true);
  const [includeAiRecs, setIncludeAiRecs] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const { strategicKpis, platforms, campaigns, creatives, geographicDistribution, dayparting, alerts } = data;

  const filteredCampaigns = selectedCampaignFilter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.id === selectedCampaignFilter);

  const handlePrintPdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      window.print();
    }, 600);
  };

  const handleExportCsv = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const headers = ['Campagne', 'Marque', 'Objectif', 'Plateformes', 'Budget Planifie (FCFA)', 'Budget Consomme (FCFA)', '% Consomme', 'Pacing', 'CPA Cible (FCFA)', 'CPA Reel (FCFA)', 'ROAS', 'Impressions', 'Reach', 'CTR (%)', 'Conversions', 'Frequence'];
      const rows = filteredCampaigns.map(c => [
        `"${c.title}"`,
        `"${c.brand}"`,
        `"${c.objective}"`,
        `"${c.platforms.join(' / ')}"`,
        c.budgetPlanifie,
        c.budgetConsomme,
        `${((c.budgetConsomme / c.budgetPlanifie) * 100).toFixed(1)}%`,
        `"${c.pacingText}"`,
        c.cpaTarget,
        c.cpaCurrent,
        `${c.roas}x`,
        c.impressions,
        c.reach,
        `${c.ctr}%`,
        c.conversions,
        c.frequency
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Rapport_Ads_Sponsoring_Orange_Cameroun_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
  };

  const handleCopyShareLink = () => {
    const url = `https://bridge.mccann.cm/ads/report/orange-cm-${Date.now().toString(36)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#151821] text-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0d1017]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-bold text-white shadow-md">
              📢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                  EXPORT OFFICIEL MCCANN × ORANGE
                </span>
                <span className="text-xs text-slate-400">Pôle Digital & Sponsoring</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Rapport de Performance Ads, Display & Sponsoring
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Controls: Format & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#1e2430] p-4 rounded-xl border border-white/5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Format du livrable
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFormat('pdf')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    exportFormat === 'pdf'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <FileText size={14} /> PDF Imprimable
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat('csv')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    exportFormat === 'csv'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Download size={14} /> CSV / Excel
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Période analysée
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full bg-[#151821] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="today">Aujourd'hui (Temps Réel)</option>
                <option value="week">Semaine en cours (S34 - Août 2026)</option>
                <option value="month">Mois en cours (Août 2026 - Global)</option>
                <option value="campaign">Bilan de fin d'opération</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Périmètre Campagne
              </label>
              <select
                value={selectedCampaignFilter}
                onChange={(e) => setSelectedCampaignFilter(e.target.value)}
                className="w-full bg-[#151821] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">Toutes les campagnes ({campaigns.length})</option>
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.title} ({c.brand})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section Selection Toggles */}
          <div className="bg-[#1e2430]/60 p-4 rounded-xl border border-white/5">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Sections incluses dans le rapport
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeFinancials} 
                  onChange={(e) => setIncludeFinancials(e.target.checked)} 
                  className="rounded border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>1. Suivi Budgétaire & Pacing (FCFA)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includePlatforms} 
                  onChange={(e) => setIncludePlatforms(e.target.checked)} 
                  className="rounded border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>2. Media Mix (6 Plateformes)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeCreatives} 
                  onChange={(e) => setIncludeCreatives(e.target.checked)} 
                  className="rounded border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>3. Scores Créatifs & Fatigue</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeGeoHourly} 
                  onChange={(e) => setIncludeGeoHourly(e.target.checked)} 
                  className="rounded border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>4. Géographie & Dayparting</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeAiRecs} 
                  onChange={(e) => setIncludeAiRecs(e.target.checked)} 
                  className="rounded border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>5. Alertes & Recommandations IA</span>
              </label>
            </div>
          </div>

          {/* Document Preview Container (What gets printed/exported) */}
          <div className="bg-[#0f1219] p-6 rounded-xl border border-white/10 shadow-inner space-y-6">
            
            {/* Header Document Preview */}
            <div className="flex flex-wrap justify-between items-start border-b border-white/10 pb-4">
              <div>
                <div className="text-orange-500 font-extrabold text-lg tracking-wide">
                  ORANGE CAMEROUN × MCCANN BRIDGE
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Rapport Consolidé de Pilotage Média & Sponsoring
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Édité le {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} · Devise : FCFA
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold rounded-full border border-emerald-500/30">
                  STATUT : ROAS 5.2x (CONFORME)
                </span>
                <div className="text-xs text-slate-400 mt-1">
                  Pacing Global : {strategicKpis.pacingLabel}
                </div>
              </div>
            </div>

            {/* Strategic KPIs Block */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#1a1f2c] p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">ROAS Global</div>
                <div className="text-xl font-black text-emerald-400 mt-1">{strategicKpis.roasGlobal}x</div>
                <div className="text-[10px] text-emerald-400">{strategicKpis.roasDelta}</div>
              </div>
              <div className="bg-[#1a1f2c] p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Budget Consommé / Planifié</div>
                <div className="text-sm font-black text-white mt-1">{FMT(strategicKpis.budgetTotalConsomme)} FCFA</div>
                <div className="text-[10px] text-orange-400">{strategicKpis.pctBudgetConsomme}% de {FMT(strategicKpis.budgetTotalPlanifie)} FCFA</div>
              </div>
              <div className="bg-[#1a1f2c] p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">CPA Moyen Pondéré</div>
                <div className="text-xl font-black text-white mt-1">{strategicKpis.cpaMoyenPondere} FCFA</div>
                <div className="text-[10px] text-emerald-400">{strategicKpis.cpaDelta}</div>
              </div>
              <div className="bg-[#1a1f2c] p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Reach / Impressions</div>
                <div className="text-sm font-black text-white mt-1">{(strategicKpis.reachUnique / 1000000).toFixed(2)}M / {(strategicKpis.impressionsTotales / 1000000).toFixed(1)}M</div>
                <div className="text-[10px] text-slate-400">Freq: {strategicKpis.frequenceGlobale} · CTR: {strategicKpis.ctrMoyen}%</div>
              </div>
            </div>

            {/* Financial & Platform Table */}
            {includeFinancials && (
              <div>
                <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <DollarSign size={14} /> 1. Synthèse Budgétaire & Pacing par Plateforme
                </div>
                <div className="overflow-x-auto rounded-lg border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1a1f2c] text-slate-300 font-semibold">
                      <tr>
                        <th className="p-2.5">Plateforme</th>
                        <th className="p-2.5 text-right">Budget Planifié</th>
                        <th className="p-2.5 text-right">Budget Consommé</th>
                        <th className="p-2.5 text-center">% Consommé</th>
                        <th className="p-2.5 text-right">CPA Réel</th>
                        <th className="p-2.5 text-right">CPM</th>
                        <th className="p-2.5 text-center">ROAS</th>
                        <th className="p-2.5 text-center">Pacing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {platforms.map(p => (
                        <tr key={p.id} className="hover:bg-white/5">
                          <td className="p-2.5 font-semibold text-white flex items-center gap-2">
                            <span>{p.icon}</span> {p.name}
                          </td>
                          <td className="p-2.5 text-right text-slate-300">{FMT(p.budgetPlanifie)} FCFA</td>
                          <td className="p-2.5 text-right font-bold text-white">{FMT(p.budgetConsomme)} FCFA</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.pctConsomme > 90 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {p.pctConsomme}%
                            </span>
                          </td>
                          <td className="p-2.5 text-right text-emerald-400 font-semibold">{p.cpa} FCFA</td>
                          <td className="p-2.5 text-right text-slate-300">{p.cpm} FCFA</td>
                          <td className="p-2.5 text-center font-bold text-emerald-400">{p.roas}x</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              p.pacing === 'on_track' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              {p.pacing === 'on_track' ? 'Optimal' : 'Under-spend'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Creatives & Fatigue Table */}
            {includeCreatives && (
              <div>
                <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={14} /> 2. Classement des Créatifs & Fatigue Score
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {creatives.map(crt => (
                    <div key={crt.id} className="bg-[#1a1f2c] p-3 rounded-lg border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{crt.thumbnailEmoji}</span>
                        <div>
                          <div className="text-xs font-bold text-white line-clamp-1">{crt.title}</div>
                          <div className="text-[10px] text-slate-400">{crt.platform} · {crt.format}</div>
                          <div className="text-[10px] text-slate-300 mt-0.5">
                            CTR: <strong className="text-white">{crt.ctr}%</strong> · CPA: <strong className="text-emerald-400">{crt.cpa} FCFA</strong> · ROAS: <strong className="text-white">{crt.roas}x</strong>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          crt.fatigueStatus === 'fresh' ? 'bg-emerald-500/20 text-emerald-400' :
                          crt.fatigueStatus === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400 animate-pulse'
                        }`}>
                          {crt.fatigueLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">Freq: {crt.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Recommendations Block */}
            {includeAiRecs && (
              <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4 rounded-xl border border-orange-500/20">
                <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> 3. Recommandations Stratégiques pour le Comité Orange Cameroun
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Maximiser le Prime Time (18h-22h)</strong> : 41% des conversions globales ont lieu le soir. Augmenter de +15% les enchères sur TikTok et Meta Reels pendant ce créneau.</li>
                  <li><strong>Remplacement Immédiat Créatif Saturé</strong> : Le visuel <em>'Promo Recharge Ancienne'</em> a atteint une fréquence de 3.82. Activer la variante neuve pour stopper la baisse de CTR.</li>
                  <li><strong>Rééquilibrage LinkedIn & B2B</strong> : Sous-consommation de 18% sur l'offre Fibre Pro. Élargir le ciblage aux directeurs financiers et chefs de projets Douala/Yaoundé.</li>
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0d1017] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Lien copié dans le presse-papier !' : 'Copier le lien de consultation sécurisé'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Fermer
            </button>
            {exportFormat === 'pdf' ? (
              <button
                type="button"
                onClick={handlePrintPdf}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Printer size={14} />
                <span>{isGenerating ? 'Préparation du PDF...' : 'Générer & Imprimer le PDF'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>{isGenerating ? 'Export en cours...' : 'Télécharger le fichier CSV'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
