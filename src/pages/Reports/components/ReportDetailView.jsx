import { useState } from 'react';
import { 
  ArrowLeft, Download, Send, CheckCircle, AlertTriangle, 
  MessageSquare, Clock, ShieldCheck, ChevronRight, Sparkles, 
  Layers, MapPin, Mail, Calendar, Hash, FileText, Check, Database,
  TrendingUp, BarChart3, AlertCircle, ShieldAlert, CheckCircle2, User
} from 'lucide-react';
import { REPORT_STATUSES, REPORT_TYPES } from '../../../data/reportsData';
import ReportDataStudio from './ReportDataStudio';
import ReportBenchmarkInsights from './ReportBenchmarkInsights';
import ReportWorkflowDrawer from './ReportWorkflowDrawer';

export default function ReportDetailView({
  report,
  reports = [],
  onSelectReport,
  onBack,
  onUpdateStatus,
  onAddComment,
  onAddSpeech,
  onUpdateData,
  onOpenExport,
  currentUser,
  isAgency
}) {
  const [activeSubTab, setActiveSubTab] = useState('general'); // general | speeches | benchmark | workflow | audit

  if (!report) return null;

  const statusCfg = REPORT_STATUSES[report.status] || REPORT_STATUSES.draft;
  const isClientReview = report.status === 'client_review';
  const isInternalReview = report.status === 'internal_review';
  const isApproved = report.status === 'approved';

  const subTabs = [
    { id: 'general', num: '1', label: 'Fiche Synthèse Exécutive' },
    { id: 'speeches', num: '2', label: 'Prises de Parole & Formats', count: report.data?.speeches?.length || 0 },
    { id: 'benchmark', num: '3', label: 'Benchmark Concurrentiel' },
    { id: 'workflow', num: '4', label: 'Workflow & Validation' },
    { id: 'audit', num: '5', label: 'Journal d’Audit & SLA' }
  ];

  return (
    <div className="space-y-5 animate-fadeIn pb-10">
      
      {/* ─── 1. TOP BAR: RETOUR & ACTIONS ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="btn btn-ghost border text-xs font-bold flex items-center gap-2 px-3 py-2 rounded"
          style={{ background: '#fff' }}
        >
          <ArrowLeft size={15} />
          <span>← Retour au registre des demandes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenExport(report)}
            className="btn btn-orange text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded shadow-sm"
          >
            <Download size={14} />
            <span>Télécharger la fiche (PDF)</span>
          </button>
        </div>
      </div>

      {/* ─── 2. HERO CARD PROFIL DU RAPPORT (Style Influence) ─── */}
      <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e9ecef' }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="flex items-start sm:items-center gap-4">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: '#FF7900',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 20,
                boxShadow: '0 2px 8px rgba(255, 121, 0, 0.25)',
                flexShrink: 0
              }}
            >
              RP
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-muted bg-gray-100 px-2 py-0.5 rounded">
                  {report.id}
                </span>
                <h1 className="text-lg font-black text-dark" style={{ margin: 0 }}>
                  {report.title}
                </h1>
                <span className="tag" style={{ background: statusCfg.color + '18', color: statusCfg.color, fontWeight: 700, fontSize: 11 }}>
                  {statusCfg.label}
                </span>
              </div>

              <p className="text-xs font-semibold text-dark mt-1 mb-2">
                Analyste : <span className="text-[#FF7900]">{report.assignee?.name || 'Steve BESSOUBE'}</span> • Demandeur : {report.requester?.name || 'Lauriane Ngameni'}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-muted" />
                  <span>{report.period?.label || 'Août 2026'}</span>
                </span>
                <span>•</span>
                <span>Périmètre : <strong className="text-dark">{report.brands?.join(', ') || 'Orange TELCO'}</strong></span>
                <span>•</span>
                <span className="text-green-600 font-bold">SLA J+2 Respecté</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isClientReview && (
              <button
                onClick={() => onUpdateStatus(report.id, 'approved', currentUser?.user || 'Client Orange', 'Rapport approuvé avec succès par le client.')}
                className="btn btn-green text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded"
                style={{ background: '#28A745', color: '#fff' }}
              >
                <CheckCircle size={14} />
                <span>Valider le rapport</span>
              </button>
            )}

            {isInternalReview && isAgency && (
              <button
                onClick={() => onUpdateStatus(report.id, 'client_review', currentUser?.user || 'Victor F. AKOA', 'Revue interne validée. Transmis au client.')}
                className="btn btn-orange text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded"
              >
                <Send size={14} />
                <span>Transmettre au Client</span>
              </button>
            )}

            <button
              onClick={() => setActiveSubTab('workflow')}
              className="btn btn-ghost border text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded"
              style={{ background: '#fff' }}
            >
              <Layers size={14} />
              <span>Gérer le workflow</span>
            </button>
          </div>

        </div>
      </div>

      {/* ─── 3. SUB-TABS (Style Influence tab-bar) ─── */}
      <div className="tab-bar mb-16 flex flex-wrap gap-4" style={{ background: '#fff', padding: '6px 12px', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`tab-item ${activeSubTab === tab.id ? 'active' : ''}`}
            style={{ fontWeight: 700, fontSize: 13 }}
          >
            <span>{tab.num}.</span> <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1 text-xs opacity-75 font-mono">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* ─── 4. SUB-TAB CONTENT ─── */}

      {/* SUB-TAB 1: SYNTHÈSE EXÉCUTIVE */}
      {activeSubTab === 'general' && (
        <div className="space-y-5">
          
          {/* Bento Grid: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Card: Identité & Métadonnées (7 cols) */}
            <div className="lg:col-span-7 card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 className="text-sm font-bold text-dark mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText size={16} className="text-[#FF7900]" />
                  <span>Identité du Rapport & Périmètre Validé</span>
                </span>
                <span className="tag" style={{ background: '#28A74518', color: '#28A745', fontSize: 10, fontWeight: 700 }}>
                  Consensus Métier
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                <div>
                  <div className="text-muted text-[11px] font-bold uppercase">Titre Officiel</div>
                  <div className="font-bold text-dark mt-0.5">{report.title}</div>
                </div>

                <div>
                  <div className="text-muted text-[11px] font-bold uppercase">Type d'Analyse</div>
                  <div className="font-bold text-dark mt-0.5 capitalize">{report.type}</div>
                </div>

                <div>
                  <div className="text-muted text-[11px] font-bold uppercase">Périmètre Marques</div>
                  <div className="font-bold text-dark mt-0.5">{report.brands?.join(', ') || 'Orange TELCO'}</div>
                </div>

                <div>
                  <div className="text-muted text-[11px] font-bold uppercase">Période d'Analyse</div>
                  <div className="font-bold text-dark mt-0.5">{report.period?.label || 'Août 2026'}</div>
                </div>

                <div>
                  <div className="text-muted text-[11px] font-bold uppercase">Demandeur Orange</div>
                  <div className="font-bold text-dark mt-0.5">{report.requester?.name || 'Lauriane Ngameni'}</div>
                </div>

                <div>
                  <div className="text-muted text-[11px] font-bold uppercase">Analyste McCann</div>
                  <div className="font-bold text-dark mt-0.5">{report.assignee?.name || 'Steve BESSOUBE'}</div>
                </div>

                <div>
                  <div className="text-muted text-[11px] font-bold uppercase">Engagement SLA</div>
                  <div className="font-bold text-green-600 mt-0.5">J+2 Ouvrés (Respecté)</div>
                </div>

                <div>
                  <div className="text-muted text-[11px] font-bold uppercase">Statut Workflow</div>
                  <div className="font-bold text-dark mt-0.5">{statusCfg.label}</div>
                </div>
              </div>
            </div>

            {/* Right Card: Indicateurs Clés (5 cols) */}
            <div className="lg:col-span-5 card p-20 flex flex-col justify-between" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div>
                <h3 className="text-sm font-bold text-dark mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Database size={16} className="text-[#FF7900]" />
                    <span>Métrologie & Environnement</span>
                  </span>
                  <span className="tag" style={{ background: '#0099FF18', color: '#0099FF', fontSize: 10, fontWeight: 700 }}>
                    Données Réelles
                  </span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-muted">Canaux audités :</span>
                    <strong className="text-dark">Facebook, Instagram, TikTok, LinkedIn, X</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-muted">Portée (Reach) cumulée :</span>
                    <strong className="text-green-600 font-mono font-bold">2 450 000 pers.</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-muted">Taux d'engagement moyen :</span>
                    <strong className="text-blue-600 font-mono font-bold">5.82%</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted">Budget sponsoring engagé :</span>
                    <strong className="text-[#FF7900] font-mono font-bold">3 850 000 FCFA</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 text-[11px] text-muted flex items-center justify-between">
                <span>Version du rapport : <strong>{report.version || 'v2.0'}</strong></span>
                <span className="text-green-600 font-bold">✓ Données certifiées</span>
              </div>
            </div>

          </div>

          {/* Highlights & Faits Marquants */}
          <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-[#FF7900]" />
              <span>Synthèse Analytique & Faits Marquants</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-green-50/50 border border-green-200">
                <div className="font-bold text-green-800 uppercase text-[11px] mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                  <span>Principaux Succès</span>
                </div>
                <ul className="space-y-1.5 text-dark">
                  {report.data?.executiveSummary?.highlights?.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  )) || <li>Taux d'engagement supérieur aux attentes sur les formats vidéo.</li>}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-yellow-50/50 border border-yellow-200">
                <div className="font-bold text-yellow-800 uppercase text-[11px] mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-600"></span>
                  <span>Points d'Attention</span>
                </div>
                <ul className="space-y-1.5 text-dark">
                  {report.data?.executiveSummary?.alerts?.length > 0 ? (
                    report.data.executiveSummary.alerts.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-yellow-600 font-bold">•</span>
                        <span>{a}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted italic">Aucune anomalie critique constatée.</li>
                  )}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-orange-50/50 border border-orange-200">
                <div className="font-bold text-[#FF7900] uppercase text-[11px] mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF7900]"></span>
                  <span>Recommandations McCann</span>
                </div>
                <ul className="space-y-1.5 text-dark">
                  {report.data?.executiveSummary?.priorityRecos?.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#FF7900] font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  )) || <li>Accentuer le sponsoring sur TikTok aux heures de pointe.</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Tableau de Performance par Plateforme */}
          {report.data?.platformPerformance && report.data.platformPerformance.length > 0 && (
            <div className="card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-bold text-dark flex items-center gap-2">
                  <BarChart3 size={16} className="text-[#FF7900]" />
                  <span>Performance par Plateforme Social Media (Période N vs N-1)</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                      <th className="py-10 px-12 text-xs font-bold text-muted uppercase tracking-wider text-left">Plateforme</th>
                      <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-right">Reach</th>
                      <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-right">Impressions</th>
                      <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-right">Interactions</th>
                      <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-right">Taux Eng.</th>
                      <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-right">Vues Vidéo</th>
                      <th className="py-10 px-12 text-xs font-bold text-muted uppercase tracking-wider text-center">Évolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.data.platformPerformance.map((row) => (
                      <tr key={row.name} className="border-b hover:bg-orange-50/20 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                        <td className="py-12 px-12 font-bold text-dark text-xs">{row.name}</td>
                        <td className="py-12 px-8 text-right font-mono text-xs font-bold text-dark">{row.reach?.toLocaleString('fr-FR')}</td>
                        <td className="py-12 px-8 text-right font-mono text-xs text-muted">{row.impressions?.toLocaleString('fr-FR')}</td>
                        <td className="py-12 px-8 text-right font-mono text-xs font-bold" style={{ color: '#FF7900' }}>{row.engagements?.toLocaleString('fr-FR')}</td>
                        <td className="py-12 px-8 text-right font-mono text-xs font-black text-green-700">{row.engagementRate}%</td>
                        <td className="py-12 px-8 text-right font-mono text-xs text-muted">{row.videoViews?.toLocaleString('fr-FR')}</td>
                        <td className="py-12 px-12 text-center">
                          <span className="tag" style={{ background: '#28A74518', color: '#28A745', fontSize: 10, fontWeight: 700 }}>
                            {row.vsPrevious?.reach || '+12%'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 2: SPEECHES & DATA STUDIO */}
      {activeSubTab === 'speeches' && (
        <ReportDataStudio
          report={report}
          onAddSpeech={onAddSpeech}
          onUpdateData={onUpdateData}
          isAgency={isAgency}
        />
      )}

      {/* SUB-TAB 3: BENCHMARK INSIGHTS */}
      {activeSubTab === 'benchmark' && (
        <ReportBenchmarkInsights
          report={report}
          onUpdateData={onUpdateData}
          isAgency={isAgency}
        />
      )}

      {/* SUB-TAB 4: WORKFLOW & VALIDATION */}
      {activeSubTab === 'workflow' && (
        <ReportWorkflowDrawer
          report={report}
          onUpdateStatus={onUpdateStatus}
          onAddComment={onAddComment}
          isAgency={isAgency}
          currentUser={currentUser}
        />
      )}

      {/* SUB-TAB 5: AUDIT LOG & SLA */}
      {activeSubTab === 'audit' && (
        <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 className="text-sm font-bold text-dark pb-3 border-b border-gray-100 flex items-center gap-2 mb-4">
            <ShieldAlert size={16} className="text-[#FF7900]" />
            <span>Journal d'Activité & Traçabilité SLA</span>
          </h3>

          <div className="space-y-4">
            {report.auditLog?.map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7900] mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-dark">
                    {log.action} <span className="text-muted font-normal">• {log.timestamp} par <strong>{log.user}</strong></span>
                  </div>
                  <div className="text-muted mt-0.5">{log.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
