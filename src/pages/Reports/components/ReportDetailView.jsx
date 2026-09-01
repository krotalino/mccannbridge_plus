import { useState } from 'react';
import { 
  ArrowLeft, Download, CheckCircle, Clock, AlertTriangle, 
  FileText, Share2, Layers, MessageSquare, History, Edit3, 
  Sparkles, TrendingUp, Users, BarChart3, Target, Award, 
  DollarSign, ShieldAlert, Check, Plus, ExternalLink, RefreshCw 
} from 'lucide-react';
import { REPORT_STATUSES, BRANDS_LIST, REPORT_TYPES } from '../../../data/reportsData';
import ReportDataStudio from './ReportDataStudio';
import ReportBenchmarkInsights from './ReportBenchmarkInsights';
import ReportWorkflowDrawer from './ReportWorkflowDrawer';

export default function ReportDetailView({
  report,
  onBack,
  onUpdateStatus,
  onAddComment,
  onAddSpeech,
  onUpdateData,
  onOpenExport,
  isAgency,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('document'); // document | speeches | benchmark | workflow | versions
  const [isAddingSpeech, setIsAddingSpeech] = useState(false);

  const statusCfg = REPORT_STATUSES[report.status] || REPORT_STATUSES.draft;
  const isDelivered = report.status === 'delivered';
  const isApproved = report.status === 'approved';
  const isClientReview = report.status === 'client_review';
  const isInternalReview = report.status === 'internal_review';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div className="flex items-start gap-3">
          <button
            onClick={onBack}
            className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0 mt-0.5 cursor-pointer"
            title="Retour au registre des rapports"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono font-black text-xs bg-[#FF6600]/20 text-[#FF8C00] px-2 py-0.5 rounded-md border border-[#FF6600]/35">
                {report.id}
              </span>
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border"
                style={{ backgroundColor: statusCfg.color + '20', color: '#FFFFFF', borderColor: statusCfg.color + '60' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.color }}></span>
                {statusCfg.label}
              </span>
              <span className="text-xs text-slate-400 font-bold px-2 py-0.5 bg-white/5 rounded-md">
                {report.version || 'v1.0'}
              </span>
              {report.priority === 'urgente' && (
                <span className="text-xs font-black text-red-400 bg-red-500/20 px-2 py-0.5 rounded-md border border-red-500/30 animate-pulse">
                  🔥 Urgente
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-black text-white leading-tight">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
              <span className="font-semibold text-slate-200">
                📅 {report.period?.label || `${report.period?.start} au ${report.period?.end}`}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-200">
                🏢 {report.brands?.join(', ')}
              </span>
              <span>•</span>
              <span>Analyste : <strong className="text-amber-300">{report.assignee?.name || 'Steve BESSOUBE'}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
          {isClientReview && (
            <button
              onClick={() => onUpdateStatus(report.id, 'approved', currentUser?.user || 'Client Orange', 'Rapport approuvé avec succès par le client.')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle size={15} />
              <span>Valider le rapport</span>
            </button>
          )}

          {isInternalReview && isAgency && (
            <button
              onClick={() => onUpdateStatus(report.id, 'client_review', currentUser?.user || 'Victor F. AKOA', 'Revue interne McCann validée. Transmis au client.')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl cosmic-btn-primary text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle size={15} />
              <span>Transmettre au Client</span>
            </button>
          )}

          {isApproved && isAgency && (
            <button
              onClick={() => onUpdateStatus(report.id, 'delivered', currentUser?.user || 'Steve BESSOUBE', 'Livraison officielle du rapport final verrouillé v2.0.')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <Check size={15} />
              <span>Marquer Livré & Clôturé</span>
            </button>
          )}

          <button
            onClick={() => onOpenExport(report)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl cosmic-btn-cyan text-xs font-black shadow-xs transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Exporter (PDF / PPT)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-white/10 overflow-x-auto gap-2 p-1.5 rounded-2xl cosmic-glass-card">
        {[
          { id: 'document', label: '1. Document & Rapport 360°', icon: <FileText size={15} /> },
          { id: 'speeches', label: `2. Prises de Parole & Data Studio (${report.data?.speeches?.length || 0})`, icon: <BarChart3 size={15} /> },
          { id: 'benchmark', label: '3. Benchmark & Concurrents', icon: <Target size={15} /> },
          { id: 'workflow', label: `4. Workflow & Validation (${report.comments?.length || 0})`, icon: <CheckCircle size={15} /> },
          { id: 'versions', label: `5. Versions & Audit (${report.auditLog?.length || 0})`, icon: <History size={15} /> }
        ].map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'cosmic-tab-active' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: Full Document View */}
      {activeTab === 'document' && (
        <div className="space-y-6">
          
          {/* Executive Summary Card */}
          <div className="p-6 sm:p-7 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-xl bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/30">
                  <Sparkles size={18} />
                </span>
                <h3 className="text-base font-black text-white tracking-tight">
                  Résumé Exécutif & Faits Marquants
                </h3>
              </div>
              <span className="text-xs font-black text-[#00D4FF] bg-[#00D4FF]/15 px-3 py-1 rounded-full border border-[#00D4FF]/30">
                Synthèse Stratégique
              </span>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <div className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Principaux Succès</span>
                </div>
                <ul className="text-xs text-slate-200 space-y-2 font-medium">
                  {report.data?.executiveSummary?.highlights?.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{h}</span>
                    </li>
                  )) || <li>Collecte en cours</li>}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <div className="text-xs font-black text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Points d'Attention & Alertes</span>
                </div>
                <ul className="text-xs text-slate-200 space-y-2 font-medium">
                  {report.data?.executiveSummary?.alerts?.length > 0 ? (
                    report.data.executiveSummary.alerts.map((a, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">⚠</span>
                        <span>{a}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic">Aucune anomalie critique relevée.</li>
                  )}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#FF6600]/15 border border-[#FF6600]/30">
                <div className="text-xs font-black text-[#FF8C00] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF6600]"></span>
                  <span>Recommandations Prioritaires</span>
                </div>
                <ul className="text-xs text-slate-200 space-y-2 font-medium">
                  {report.data?.executiveSummary?.priorityRecos?.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FF6600] font-bold shrink-0">→</span>
                      <span>{r}</span>
                    </li>
                  )) || <li>Voir section recommandations</li>}
                </ul>
              </div>
            </div>

            {/* Core KPI metrics row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 border-t border-white/10">
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Portée Globale</div>
                <div className="text-lg font-black text-white mt-0.5">2.45M</div>
                <span className="text-[10px] font-extrabold text-emerald-400">+14.2% vs S-1</span>
              </div>

              <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Taux d'Engagement</div>
                <div className="text-lg font-black text-[#00D4FF] mt-0.5">5.8%</div>
                <span className="text-[10px] font-extrabold text-emerald-400">vs 3.9% (MTN)</span>
              </div>

              <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Conversions Maxit</div>
                <div className="text-lg font-black text-white mt-0.5">9 200</div>
                <span className="text-[10px] font-extrabold text-emerald-400">115% de l'objectif</span>
              </div>

              <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Gain Communautés</div>
                <div className="text-lg font-black text-[#FF8C00] mt-0.5">+15 000</div>
                <span className="text-[10px] font-extrabold text-emerald-400">+1.07% net</span>
              </div>
            </div>
          </div>

          {/* Community Evolution & Growth */}
          {report.data?.communityEvolution && report.data.communityEvolution.byPlatform?.length > 0 && (
            <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Users size={18} />
                  </span>
                  <h3 className="text-base font-black text-white">
                    Évolution des Communautés & Abonnés
                  </h3>
                </div>
                <div className="text-xs text-slate-300 font-semibold">
                  Total : <strong className="text-white font-mono text-sm">{report.data.communityEvolution.finalTotal?.toLocaleString('fr-FR')}</strong> abonnés
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {report.data.communityEvolution.byPlatform.map((p) => {
                  const isPositive = p.net >= 0;
                  return (
                    <div key={p.platform} className="p-4 rounded-xl border border-white/10 bg-black/30 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{p.platform}</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                          isPositive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {isPositive ? `+${p.growth}%` : `${p.growth}%`}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-black text-white font-mono">
                          {p.final?.toLocaleString('fr-FR')}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {isPositive ? `+${p.net?.toLocaleString('fr-FR')}` : p.net?.toLocaleString('fr-FR')} nets
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Platform Performance Table */}
          {report.data?.platformPerformance && report.data.platformPerformance.length > 0 && (
            <div className="rounded-2xl cosmic-glass-card overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <BarChart3 size={18} />
                  </span>
                  <h3 className="text-base font-black text-white">
                    Performance par Plateforme (Comparatif N vs N-1)
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-black/40 text-slate-400 font-extrabold border-b border-white/10 uppercase text-[10px]">
                      <th className="py-3 px-4">Plateforme</th>
                      <th className="py-3 px-3">Portée / Reach</th>
                      <th className="py-3 px-3">Impressions</th>
                      <th className="py-3 px-3">Engagements</th>
                      <th className="py-3 px-3">Taux Eng.</th>
                      <th className="py-3 px-3">Vues Vidéo</th>
                      <th className="py-3 px-3">Clics</th>
                      <th className="py-3 px-3">Posts</th>
                      <th className="py-3 px-4">Évolution vs N-1</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {report.data.platformPerformance.map((row) => (
                      <tr key={row.name} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                          <span>{row.name}</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-white">{row.reach?.toLocaleString('fr-FR')}</td>
                        <td className="py-3.5 px-3 font-mono text-slate-400">{row.impressions?.toLocaleString('fr-FR')}</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-[#00D4FF]">{row.engagements?.toLocaleString('fr-FR')}</td>
                        <td className="py-3.5 px-3 font-bold text-[#FF8C00]">{row.engagementRate}%</td>
                        <td className="py-3.5 px-3 font-mono text-slate-300">{row.videoViews?.toLocaleString('fr-FR')}</td>
                        <td className="py-3.5 px-3 font-mono text-slate-300">{row.clicks?.toLocaleString('fr-FR')}</td>
                        <td className="py-3.5 px-3 text-center">{row.posts}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                            {row.vsPrevious?.reach || '+10%'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Paid Media ROI & Budget Analysis */}
          {report.data?.paidMedia && report.data.paidMedia.budgetSpent > 0 && (
            <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <DollarSign size={18} />
                  </span>
                  <h3 className="text-base font-black text-white">
                    Analyse des Investissements Paid Media & Efficience
                  </h3>
                </div>
                <div className="text-xs font-black text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                  Budget Engagé : {report.data.paidMedia.budgetSpent?.toLocaleString('fr-FR')} FCFA
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CPM Moyen</div>
                  <div className="text-base font-black text-white mt-0.5">{report.data.paidMedia.cpm}</div>
                </div>
                <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CPC Moyen</div>
                  <div className="text-base font-black text-emerald-400 mt-0.5">{report.data.paidMedia.cpc}</div>
                </div>
                <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CTR Global</div>
                  <div className="text-base font-black text-[#FF8C00] mt-0.5">{report.data.paidMedia.ctr}</div>
                </div>
                <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Coût par Résultat (CPA)</div>
                  <div className="text-base font-black text-[#00D4FF] mt-0.5">{report.data.paidMedia.cpa}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actionable Recommendations by Pillar */}
          {report.data?.recommendations && (
            <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/30">
                    <Target size={18} />
                  </span>
                  <h3 className="text-base font-black text-white">
                    Plan d'Action & Recommandations Opérationnelles
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/10 bg-black/30">
                  <h4 className="text-xs font-black text-[#FF8C00] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span>✍️</span> Recommandations Éditoriales & Contenu
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2 font-medium">
                    {report.data.recommendations.editorial?.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#FF6600] font-bold shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    )) || <li>Maintenir la cadence des vidéos courtes.</li>}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-black/30">
                  <h4 className="text-xs font-black text-[#00D4FF] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span>📢</span> Recommandations Média & Sponsoring
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2 font-medium">
                    {report.data.recommendations.media?.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#00D4FF] font-bold shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    )) || <li>Optimiser la répartition des budgets sur TikTok et Reels.</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT 2: Speeches & Data Studio */}
      {activeTab === 'speeches' && (
        <ReportDataStudio
          report={report}
          onAddSpeech={onAddSpeech}
          onUpdateData={onUpdateData}
          isAgency={isAgency}
        />
      )}

      {/* TAB CONTENT 3: Benchmark Insights */}
      {activeTab === 'benchmark' && (
        <ReportBenchmarkInsights
          report={report}
          onUpdateData={onUpdateData}
          isAgency={isAgency}
        />
      )}

      {/* TAB CONTENT 4: Workflow & Validation Drawer */}
      {activeTab === 'workflow' && (
        <ReportWorkflowDrawer
          report={report}
          onUpdateStatus={onUpdateStatus}
          onAddComment={onAddComment}
          isAgency={isAgency}
          currentUser={currentUser}
        />
      )}

      {/* TAB CONTENT 5: Versions & Audit Trail */}
      {activeTab === 'versions' && (
        <div className="space-y-6">
          
          {/* Versions list */}
          <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-4">
            <h3 className="text-base font-black text-white mb-2 pb-2 border-b border-white/10 flex items-center gap-2">
              <History size={18} className="text-[#FF6600]" />
              <span>Historique des Versions du Livrable</span>
            </h3>

            <div className="space-y-3">
              {report.versions?.map((v, i) => (
                <div key={i} className="p-4 border border-white/10 rounded-xl bg-black/40 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-white">{v.versionNumber}</span>
                      <span className="text-[11px] text-slate-400">{v.date}</span>
                      <span className="text-[11px] font-bold text-[#FF8C00] bg-[#FF6600]/20 px-2 py-0.5 rounded border border-[#FF6600]/30">
                        Par : {v.author}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">{v.changelog}</div>
                  </div>
                  <button
                    onClick={() => onOpenExport(report)}
                    className="text-xs font-bold text-[#00D4FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Télécharger</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Full Audit Log */}
          <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-4">
            <h3 className="text-base font-black text-white mb-2 pb-2 border-b border-white/10 flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#00D4FF]" />
              <span>Journal d'Activité & Traçabilité Complète</span>
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {report.auditLog?.map((log, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#FF6600] ring-4 ring-black"></div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{log.action}</span>
                    <span className="text-slate-400 font-normal">• {log.timestamp}</span>
                    <span className="text-slate-400 font-normal">par <strong className="text-slate-200">{log.user}</strong></span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">{log.detail}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
