import { useState } from 'react';
import { 
  CheckCircle, Clock, AlertTriangle, MessageSquare, Send, 
  User, ShieldCheck, ArrowRight, CornerDownRight, CheckCircle2, X, Sparkles 
} from 'lucide-react';
import { REPORT_STATUSES, REPORT_WORKFLOW_STEPS } from '../../../data/reportsData';

export default function ReportWorkflowDrawer({
  report,
  onUpdateStatus,
  onAddComment,
  isAgency,
  currentUser
}) {
  const [commentText, setCommentText] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [selectedNextStatus, setSelectedNextStatus] = useState('');

  const currentStatusCfg = REPORT_STATUSES[report.status] || REPORT_STATUSES.draft;

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c_${Date.now()}`,
      author: currentUser?.user || (isAgency ? 'Steve BESSOUBE (Analyste)' : 'Lauriane Ngameni (Client)'),
      role: currentUser?.poste || (isAgency ? 'Agence McCann' : 'Orange Cameroun'),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: isAgency ? 'agency' : 'client',
      text: commentText.trim(),
      resolved: false
    };

    onAddComment(report.id, newComment);
    setCommentText('');
  };

  const handleApplyStatus = (statusKey, defaultNote) => {
    const author = currentUser?.user || (isAgency ? 'Steve BESSOUBE' : 'Lauriane Ngameni');
    const note = statusNote.trim() || defaultNote || `Changement de statut vers ${REPORT_STATUSES[statusKey]?.label || statusKey}`;
    onUpdateStatus(report.id, statusKey, author, note);
    setStatusNote('');
    setSelectedNextStatus('');
  };

  // Find index of current step in the 8-step workflow
  const currentStepIndex = REPORT_WORKFLOW_STEPS.findIndex(st => st.id === report.status);

  return (
    <div className="space-y-6">
      
      {/* Workflow Progress Timeline Bar */}
      <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <h3 className="text-base font-black text-white mb-1 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-[#FF6600]" />
          <span>Gouvernance & Jalons du Workflow (8 Étapes)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Suivi rigoureux des étapes d'élaboration, qualification, revue interne McCann et validation client Orange.
        </p>

        {/* Steps track */}
        <div className="relative">
          <div className="hidden md:flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-white/10 -z-0"></div>
            
            {REPORT_WORKFLOW_STEPS.map((step, idx) => {
              const isPast = currentStepIndex > idx || report.status === 'delivered';
              const isCurrent = report.status === step.id;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center text-center max-w-[100px]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-xs ${
                    isCurrent 
                      ? 'bg-gradient-to-r from-[#FF6600] to-[#FF8C00] text-white ring-4 ring-[#FF6600]/30 scale-110 shadow-[0_0_15px_rgba(255,102,0,0.5)]'
                      : isPast
                      ? 'bg-emerald-500 text-black font-black'
                      : 'bg-black/60 border border-white/20 text-slate-400'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <div className={`text-[10px] font-bold mt-2 leading-tight ${
                    isCurrent ? 'text-[#FF8C00] font-black' : isPast ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role-Based Action Panel */}
      <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <h3 className="text-base font-black text-white mb-3 pb-2 border-b border-white/10 flex items-center justify-between">
          <span>Actions Rapides & Transitions de Statut</span>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white/10 text-[#00D4FF] border border-[#00D4FF]/30">
            Rôle Actif : {isAgency ? '🏢 Agence McCann' : '📱 Client Orange'}
          </span>
        </h3>

        {/* Agency actions */}
        {isAgency ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.status === 'submitted' && (
                <button
                  onClick={() => handleApplyStatus('qualified', 'Demande qualifiée et assignée')}
                  className="p-3.5 bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 text-white border border-[#00D4FF]/30 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-[#00D4FF]">1. Qualifier la Demande</div>
                    <div className="text-[10px] font-normal text-slate-300">Assigner à Steve B.</div>
                  </div>
                  <ArrowRight size={15} className="text-[#00D4FF]" />
                </button>
              )}

              {(report.status === 'qualified' || report.status === 'needs_info') && (
                <button
                  onClick={() => handleApplyStatus('in_production', 'Données en cours de collecte et analyse')}
                  className="p-3.5 bg-[#FF8C00]/10 hover:bg-[#FF8C00]/20 text-white border border-[#FF8C00]/30 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-[#FF8C00]">2. Passer en Production</div>
                    <div className="text-[10px] font-normal text-slate-300">Collecte des KPI en cours</div>
                  </div>
                  <ArrowRight size={15} className="text-[#FF8C00]" />
                </button>
              )}

              {(report.status === 'in_production' || report.status === 'internal_fixes') && (
                <button
                  onClick={() => handleApplyStatus('internal_review', 'Rapport finalisé, soumis à la revue interne QA')}
                  className="p-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-white border border-amber-500/30 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-amber-300">3. Soumettre à Revue Interne</div>
                    <div className="text-[10px] font-normal text-slate-300">Contrôle qualité & cohérence</div>
                  </div>
                  <ArrowRight size={15} className="text-amber-300" />
                </button>
              )}

              {report.status === 'internal_review' && (
                <>
                  <button
                    onClick={() => handleApplyStatus('client_review', 'Revue interne validée. Transmis au client pour validation.')}
                    className="p-3.5 bg-[#FF6600]/15 hover:bg-[#FF6600]/25 text-white border border-[#FF6600]/40 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="text-[#FF6600]">4. Transmettre au Client</div>
                      <div className="text-[10px] font-normal text-slate-300">Ouvrir la validation client</div>
                    </div>
                    <ArrowRight size={15} className="text-[#FF6600]" />
                  </button>

                  <button
                    onClick={() => handleApplyStatus('internal_fixes', 'Corrections internes requises par le Lead')}
                    className="p-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-left font-bold text-xs transition-colors cursor-pointer"
                  >
                    <div>Demander retouches internes</div>
                  </button>
                </>
              )}

              {report.status === 'client_fixes' && (
                <button
                  onClick={() => handleApplyStatus('client_review', 'Modifications client intégrées en v1.2. Transmis pour approbation finale.')}
                  className="p-3.5 bg-[#FF6600]/20 hover:bg-[#FF6600]/30 text-white border border-[#FF6600]/40 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-[#FF8C00]">Renvoyer après modifications</div>
                    <div className="text-[10px] font-normal text-slate-300">Version corrigée prête</div>
                  </div>
                  <ArrowRight size={15} />
                </button>
              )}

              {report.status === 'approved' && (
                <button
                  onClick={() => handleApplyStatus('delivered', 'Rapport final livré et archivé officiellement (v2.0).')}
                  className="p-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-white border border-emerald-500/40 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-emerald-400">5. Clôturer & Livrer (v2.0)</div>
                    <div className="text-[10px] font-normal text-slate-300">Archivage et diffusion finale</div>
                  </div>
                  <CheckCircle size={15} className="text-emerald-400" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Client actions */
          <div className="space-y-4">
            {report.status === 'client_review' ? (
              <div className="p-4 rounded-xl bg-black/40 border border-[#FF6600]/30 space-y-3">
                <div className="text-xs font-bold text-white">
                  Le livrable est actuellement en attente de votre revue et validation :
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleApplyStatus('approved', 'Rapport approuvé et validé sans réserve par le client.')}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle size={16} />
                    <span>Approuver & Valider le Rapport</span>
                  </button>

                  <button
                    onClick={() => handleApplyStatus('client_fixes', 'Demande d’ajustement sur les KPI et recommandations')}
                    className="px-4 py-2.5 cosmic-btn-glass text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Demander des Ajustements / Corrections
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic p-3 bg-black/30 rounded-xl border border-white/10">
                Statut actuel : <strong className="text-white">{currentStatusCfg.label}</strong>. Aucune action bloquante requise pour le moment.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Threaded Discussion & Notes */}
      <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <h3 className="text-base font-black text-white mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
          <MessageSquare size={18} className="text-[#FF6600]" />
          <span>Fil de Discussion & Échanges Horodatés ({report.comments?.length || 0})</span>
        </h3>

        {/* Comments List */}
        <div className="space-y-3 mb-5 max-h-[350px] overflow-y-auto pr-1">
          {report.comments?.map((comment) => {
            const isAg = comment.type === 'agency';
            return (
              <div 
                key={comment.id}
                className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  isAg 
                    ? 'bg-[#FF6600]/10 border-[#FF6600]/25 text-slate-200' 
                    : 'bg-[#00D4FF]/10 border-[#00D4FF]/25 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <span className={isAg ? 'text-[#FF8C00]' : 'text-[#00D4FF]'}>{comment.author}</span>
                    <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 bg-black/40 rounded border border-white/10">
                      {comment.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{comment.date}</span>
                </div>
                <p className="text-slate-300">{comment.text}</p>
              </div>
            );
          })}
        </div>

        {/* New Comment Input Form */}
        <form onSubmit={handleSendComment} className="flex gap-2">
          <input
            type="text"
            required
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Écrire un commentaire, poser une question ou formuler un retour..."
            className="flex-1 text-xs p-2.5 rounded-xl cosmic-glass-input text-white"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 cosmic-btn-primary rounded-xl text-xs font-black shadow-xs cursor-pointer shrink-0"
          >
            <Send size={14} />
            <span>Envoyer</span>
          </button>
        </form>
      </div>

    </div>
  );
}
