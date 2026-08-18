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
  const [activeTab, setActiveTab] = useState('document'); // document | speeches | benchmark | workflow | versions | share
  const [isAddingSpeech, setIsAddingSpeech] = useState(false);

  const statusCfg = REPORT_STATUSES[report.status] || REPORT_STATUSES.draft;
  const isDelivered = report.status === 'delivered';
  const isApproved = report.status === 'approved';
  const isClientReview = report.status === 'client_review';
  const isInternalReview = report.status === 'internal_review';

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors shrink-0 mt-0.5"
            title="Retour à la liste des demandes"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono font-bold text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md border border-orange-200">
                {report.id}
              </span>
              <span 
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                style={{ backgroundColor: statusCfg.bg, color: statusCfg.color, borderColor: statusCfg.color + '50' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.color }}></span>
                {statusCfg.label}
              </span>
              <span className="text-xs text-gray-500 font-semibold px-2 py-0.5 bg-gray-100 rounded-md">
                {report.version || 'v1.0'}
              </span>
              {report.priority === 'urgente' && (
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md animate-pulse">
                  🔥 Urgente
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1.5">
              <span className="font-medium text-gray-700">
                📅 {report.period?.label || `${report.period?.start} au ${report.period?.end}`}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                🏢 {report.brands?.join(', ')}
              </span>
              <span>•</span>
              <span>Analyste : <strong className="text-gray-800">{report.assignee?.name || 'Steve BESSOUBE'}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
          {/* Quick Client Approval Button if in client_review */}
          {isClientReview && (
            <button
              onClick={() => onUpdateStatus(report.id, 'approved', currentUser?.user || 'Client Orange', 'Rapport approuvé avec succès par le client.')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <CheckCircle size={15} />
              <span>Valider le rapport</span>
            </button>
          )}

          {/* Quick Internal Review Button if in internal_review */}
          {isInternalReview && isAgency && (
            <button
              onClick={() => onUpdateStatus(report.id, 'client_review', currentUser?.user || 'Victor F. AKOA', 'Revue interne McCann validée. Transmis au client.')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <CheckCircle size={15} />
              <span>Transmettre au Client</span>
            </button>
          )}

          {/* Final Delivery Button if approved */}
          {isApproved && isAgency && (
            <button
              onClick={() => onUpdateStatus(report.id, 'delivered', currentUser?.user || 'Steve BESSOUBE', 'Livraison officielle du rapport final verrouillé v2.0.')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Check size={15} />
              <span>Marquer Livré & Clôturé</span>
            </button>
          )}

          <button
            onClick={() => onOpenExport(report)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Download size={14} />
            <span>Exporter (PDF / PPT)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-1 bg-white px-4 pt-2 rounded-t-xl">
        <button
          onClick={() => setActiveTab('document')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'document' 
              ? 'border-orange-600 text-orange-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <FileText size={15} />
          <span>1. Document & Rapport 360°</span>
        </button>

        <button
          onClick={() => setActiveTab('speeches')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'speeches' 
              ? 'border-orange-600 text-orange-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <BarChart3 size={15} />
          <span>2. Prises de Parole & Data Studio ({report.data?.speeches?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmark')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'benchmark' 
              ? 'border-orange-600 text-orange-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <Target size={15} />
          <span>3. Benchmark & Concurrents (MTN / Camtel)</span>
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'workflow' 
              ? 'border-orange-600 text-orange-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <CheckCircle size={15} />
          <span>4. Workflow & Validation ({report.comments?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('versions')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'versions' 
              ? 'border-orange-600 text-orange-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <History size={15} />
          <span>5. Versions & Audit ({report.auditLog?.length || 0})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: Full Document View */}
      {activeTab === 'document' && (
        <div className="space-y-6">
          
          {/* Executive Summary Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <Sparkles size={18} />
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Résumé Exécutif & Faits Marquants
                </h3>
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                Synthèse Stratégique
              </span>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Principaux Succès</span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-1.5 font-medium">
                  {report.data?.executiveSummary?.highlights?.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{h}</span>
                    </li>
                  )) || <li>Collecte en cours</li>}
                </ul>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Points d'Attention & Alertes</span>
                </div>
                <ul className="text-xs text-amber-950 space-y-1.5 font-medium">
                  {report.data?.executiveSummary?.alerts?.length > 0 ? (
                    report.data.executiveSummary.alerts.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold shrink-0">⚠</span>
                        <span>{a}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">Aucune anomalie critique relevée.</li>
                  )}
                </ul>
              </div>

              <div className="p-4 bg-orange-50/70 border border-orange-200/80 rounded-xl">
                <div className="text-xs font-bold text-orange-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span>Recommandations Prioritaires</span>
                </div>
                <ul className="text-xs text-orange-950 space-y-1.5 font-medium">
                  {report.data?.executiveSummary?.priorityRecos?.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-orange-600 font-bold shrink-0">→</span>
                      <span>{r}</span>
                    </li>
                  )) || <li>Voir section recommandations</li>}
                </ul>
              </div>
            </div>

            {/* Core KPI metrics row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-gray-500 uppercase">Portée Globale</div>
                <div className="text-lg font-bold text-gray-900 mt-0.5">2.45M</div>
                <span className="text-[10px] font-bold text-emerald-600">+14.2% vs S-1</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-gray-500 uppercase">Taux d'Engagement</div>
                <div className="text-lg font-bold text-orange-600 mt-0.5">5.8%</div>
                <span className="text-[10px] font-bold text-emerald-600">vs 3.9% (MTN)</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-gray-500 uppercase">Conversions Maxit</div>
                <div className="text-lg font-bold text-gray-900 mt-0.5">9 200</div>
                <span className="text-[10px] font-bold text-emerald-600">115% de l'objectif</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-gray-500 uppercase">Gain Communautés</div>
                <div className="text-lg font-bold text-gray-900 mt-0.5">+15 000</div>
                <span className="text-[10px] font-bold text-emerald-600">+1.07% net</span>
              </div>
            </div>
          </div>

          {/* Community Evolution & Growth */}
          {report.data?.communityEvolution && report.data.communityEvolution.byPlatform?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-blue-100 text-blue-600">
                    <Users size={18} />
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Évolution des Communautés & Abonnés
                  </h3>
                </div>
                <div className="text-xs text-gray-600 font-semibold">
                  Total : <strong className="text-gray-900 font-mono text-sm">{report.data.communityEvolution.finalTotal?.toLocaleString('fr-FR')}</strong> abonnés
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {report.data.communityEvolution.byPlatform.map((p) => {
                  const isPositive = p.net >= 0;
                  return (
                    <div key={p.platform} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-800">{p.platform}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isPositive ? `+${p.growth}%` : `${p.growth}%`}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-extrabold text-gray-900 font-mono">
                          {p.final?.toLocaleString('fr-FR')}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
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
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-purple-100 text-purple-600">
                    <BarChart3 size={18} />
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Performance par Plateforme (Comparatif N vs N-1)
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Plateforme</th>
                      <th className="py-2.5 px-3">Portée / Reach</th>
                      <th className="py-2.5 px-3">Impressions</th>
                      <th className="py-2.5 px-3">Engagements</th>
                      <th className="py-2.5 px-3">Taux Eng.</th>
                      <th className="py-2.5 px-3">Vues Vidéo</th>
                      <th className="py-2.5 px-3">Clics</th>
                      <th className="py-2.5 px-3">Posts</th>
                      <th className="py-2.5 px-3">Évolution vs N-1</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {report.data.platformPerformance.map((row) => (
                      <tr key={row.name} className="hover:bg-orange-50/20">
                        <td className="py-3 px-3 font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{row.name}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-medium">{row.reach?.toLocaleString('fr-FR')}</td>
                        <td className="py-3 px-3 font-mono text-gray-500">{row.impressions?.toLocaleString('fr-FR')}</td>
                        <td className="py-3 px-3 font-mono font-semibold">{row.engagements?.toLocaleString('fr-FR')}</td>
                        <td className="py-3 px-3 font-bold text-orange-600">{row.engagementRate}%</td>
                        <td className="py-3 px-3 font-mono text-gray-600">{row.videoViews?.toLocaleString('fr-FR')}</td>
                        <td className="py-3 px-3 font-mono text-gray-600">{row.clicks?.toLocaleString('fr-FR')}</td>
                        <td className="py-3 px-3 text-center">{row.posts}</td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
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

          {/* Speeches & Activations Cards */}
          {report.data?.speeches && report.data.speeches.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                    <Award size={18} />
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Analyse Détaillée des Prises de Parole & Campagnes
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('speeches')}
                  className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <span>Gérer dans Data Studio</span>
                  <span>→</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.data.speeches.map((sp) => (
                  <div key={sp.id} className="border border-gray-200 rounded-xl p-4.5 bg-gray-50/40 hover:border-orange-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">
                          {sp.id} • {sp.brand}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          sp.isPaid ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {sp.isPaid ? 'Sponsorisé / Paid' : 'Organique'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 mb-1">{sp.name}</h4>
                      <p className="text-xs text-gray-500 mb-3">
                        {sp.channel} • {sp.format} • Objectif : {sp.objective}
                      </p>

                      {/* KPI metrics badge grid */}
                      <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-gray-200 mb-3 text-center">
                        <div>
                          <div className="text-[10px] text-gray-400 font-semibold uppercase">Portée</div>
                          <div className="text-xs font-extrabold text-gray-900 font-mono">{sp.reach?.toLocaleString('fr-FR')}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 font-semibold uppercase">Taux Eng.</div>
                          <div className="text-xs font-extrabold text-orange-600">{sp.engagementRate}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 font-semibold uppercase">Conversions</div>
                          <div className="text-xs font-extrabold text-emerald-600 font-mono">{sp.conversions?.toLocaleString('fr-FR') || '—'}</div>
                        </div>
                      </div>

                      {/* Insight & Reco */}
                      <div className="text-xs text-gray-700 bg-orange-50/60 p-2.5 rounded-lg border border-orange-100">
                        <div className="font-bold text-orange-950 mb-0.5">💡 Insight Analyste (Steve B.) :</div>
                        <p className="leading-relaxed">{sp.insight}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Posts Showcase */}
          {report.data?.bestPosts && report.data.bestPosts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-yellow-100 text-yellow-700">
                    <Award size={18} />
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Top Contenus & Best Posts de la Période
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.data.bestPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row bg-white shadow-2xs">
                    {post.imageUrl && (
                      <div className="sm:w-44 h-40 sm:h-auto bg-gray-100 shrink-0 relative overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded">
                          {post.channel}
                        </span>
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                          <span>{post.date}</span>
                          <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            Taux : {post.rate}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 mb-1.5">{post.title}</h4>
                        <p className="text-xs text-gray-600 italic line-clamp-2 mb-2.5">
                          "{post.caption}"
                        </p>
                      </div>

                      <div className="p-2 bg-gray-50 rounded-lg text-[11px] text-gray-700 border border-gray-200">
                        <strong className="text-gray-900">Enseignement :</strong> {post.lesson}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paid Media ROI & Budget Analysis */}
          {report.data?.paidMedia && report.data.paidMedia.budgetSpent > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <DollarSign size={18} />
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Analyse des Investissements Paid Media & Efficience
                  </h3>
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  Budget Engagé : {report.data.paidMedia.budgetSpent?.toLocaleString('fr-FR')} FCFA
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase">CPM Moyen</div>
                  <div className="text-base font-bold text-gray-900 mt-0.5">{report.data.paidMedia.cpm}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase">CPC Moyen</div>
                  <div className="text-base font-bold text-emerald-600 mt-0.5">{report.data.paidMedia.cpc}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase">CTR Global</div>
                  <div className="text-base font-bold text-orange-600 mt-0.5">{report.data.paidMedia.ctr}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase">Coût par Résultat (CPA)</div>
                  <div className="text-base font-bold text-gray-900 mt-0.5">{report.data.paidMedia.cpa}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actionable Recommendations by Pillar */}
          {report.data?.recommendations && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
                    <Target size={18} />
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Plan d'Action & Recommandations Opérationnelles
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>✍️</span> Recommandations Éditoriales & Contenu
                  </h4>
                  <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                    {report.data.recommendations.editorial?.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-orange-600 font-bold shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    )) || <li>Maintenir la cadence des vidéos courtes.</li>}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>📢</span> Recommandations Média & Sponsoring
                  </h4>
                  <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                    {report.data.recommendations.media?.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold shrink-0">•</span>
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
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <History size={18} className="text-orange-600" />
              <span>Historique des Versions du Livrable</span>
            </h3>

            <div className="space-y-3">
              {report.versions?.map((v, i) => (
                <div key={i} className="p-3.5 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{v.versionNumber}</span>
                      <span className="text-[11px] text-gray-500">{v.date}</span>
                      <span className="text-[11px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                        Par : {v.author}
                      </span>
                    </div>
                    <div className="text-xs text-gray-700 mt-1">{v.changelog}</div>
                  </div>
                  <button
                    onClick={() => onOpenExport(report)}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Download size={13} />
                    <span>Livrable</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Full Audit Log */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <ShieldAlert size={18} className="text-blue-600" />
              <span>Journal d'Activité & Traçabilité Complète</span>
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {report.auditLog?.map((log, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white"></div>
                  <div className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                    <span>{log.action}</span>
                    <span className="text-gray-400 font-normal">• {log.timestamp}</span>
                    <span className="text-gray-500 font-normal">par <strong>{log.user}</strong></span>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">{log.detail}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
