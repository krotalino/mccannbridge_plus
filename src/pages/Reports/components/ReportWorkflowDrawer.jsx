import { useState } from 'react';
import { 
  CheckCircle, Clock, AlertTriangle, MessageSquare, Send, 
  User, ShieldCheck, ArrowRight, CornerDownRight, CheckCircle2, X 
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
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-orange-600" />
          <span>Gouvernance & Jalons du Workflow (8 Étapes)</span>
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Suivi des étapes d'élaboration, qualification, revue interne et validation client.
        </p>

        {/* Steps track */}
        <div className="relative">
          <div className="hidden md:flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-0"></div>
            
            {REPORT_WORKFLOW_STEPS.map((step, idx) => {
              const isPast = currentStepIndex > idx || report.status === 'delivered';
              const isCurrent = report.status === step.id;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center text-center max-w-[100px]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    isCurrent 
                      ? 'bg-orange-600 text-white ring-4 ring-orange-200 scale-110'
                      : isPast
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <div className={`text-[11px] font-semibold mt-2 leading-tight ${
                    isCurrent ? 'text-orange-600 font-bold' : isPast ? 'text-gray-800' : 'text-gray-400'
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
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
          <span>Actions Rapides & Transitions Disponibles</span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
            Rôle : {isAgency ? '🏢 Agence McCann' : '📱 Client Orange'}
          </span>
        </h3>

        {/* Agency actions */}
        {isAgency ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.status === 'submitted' && (
                <button
                  onClick={() => handleApplyStatus('qualified', 'Demande qualifiée et assignée')}
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <div>1. Qualifier la Demande</div>
                    <div className="text-[10px] font-normal text-blue-700">Assigner à Steve B.</div>
                  </div>
                  <ArrowRight size={15} />
                </button>
              )}

              {(report.status === 'qualified' || report.status === 'needs_info') && (
                <button
                  onClick={() => handleApplyStatus('in_production', 'Données en cours de collecte et analyse')}
                  className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <div>2. Passer en Production</div>
                    <div className="text-[10px] font-normal text-amber-700">Collecte des KPI en cours</div>
                  </div>
                  <ArrowRight size={15} />
                </button>
              )}

              {(report.status === 'in_production' || report.status === 'internal_fixes') && (
                <button
                  onClick={() => handleApplyStatus('internal_review', 'Rapport finalisé, soumis à la revue interne QA')}
                  className="p-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border border-yellow-200 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <div>3. Soumettre à la Revue Interne</div>
                    <div className="text-[10px] font-normal text-yellow-700">Contrôle qualité & cohérence</div>
                  </div>
                  <ArrowRight size={15} />
                </button>
              )}

              {report.status === 'internal_review' && (
                <>
                  <button
                    onClick={() => handleApplyStatus('client_review', 'Revue interne validée. Transmis au client pour validation.')}
                    className="p-3 bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div>4. Transmettre au Client</div>
                      <div className="text-[10px] font-normal text-orange-700">Ouvrir la phase de validation</div>
                    </div>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    onClick={() => handleApplyStatus('internal_fixes', 'Corrections internes requises par le Lead')}
                    className="p-3 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 rounded-xl text-left font-bold text-xs transition-colors"
                  >
                    <div>Rejeter / Demander retouches internes</div>
                  </button>
                </>
              )}

              {report.status === 'client_fixes' && (
                <button
                  onClick={() => handleApplyStatus('client_review', 'Modifications client intégrées en v1.2. Transmis pour approbation finale.')}
                  className="p-3 bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <div>Renvoyer après modifications</div>
                    <div className="text-[10px] font-normal text-orange-700">Version v1.2 prête</div>
                  </div>
                  <ArrowRight size={15} />
                </button>
              )}

              {report.status === 'approved' && (
                <button
                  onClick={() => handleApplyStatus('delivered', 'Rapport final livré et archivé officiellement (v2.0).')}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl text-left font-bold text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <div>5. Clôturer & Livrer (v2.0)</div>
                    <div className="text-[10px] font-normal text-emerald-700">Archivage et diffusion finale</div>
                  </div>
                  <CheckCircle size={15} className="text-emerald-600" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Client actions */
          <div className="space-y-4">
            {report.status === 'client_review' ? (
              <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-orange-900">
                  Le livrable est actuellement en attente de votre revue et validation :
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleApplyStatus('approved', 'Rapport approuvé et validé sans réserve par le client.')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    <span>Approuver & Valider le Rapport</span>
                  </button>

                  <button
                    onClick={() => handleApplyStatus('client_fixes', 'Demande d’ajustement sur les KPI et recommandations')}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Demander des Ajustements / Corrections
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-xl border border-gray-200">
                Statut actuel : <strong className="text-gray-800">{currentStatusCfg.label}</strong>. Aucune action bloquante requise de votre part pour le moment.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Threaded Discussion & Notes */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
          <MessageSquare size={18} className="text-orange-600" />
          <span>Fil de Discussion & Échanges Horodatés ({report.comments?.length || 0})</span>
        </h3>

        {/* Comments List */}
        <div className="space-y-3 mb-5 max-h-[350px] overflow-y-auto pr-1">
          {report.comments?.map((comment) => {
            const isAg = comment.type === 'agency';
            return (
              <div 
                key={comment.id}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isAg 
                    ? 'bg-orange-50/40 border-orange-200/80 text-orange-950' 
                    : 'bg-blue-50/40 border-blue-200/80 text-blue-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <span>{comment.author}</span>
                    <span className="text-[10px] font-normal text-gray-500 px-1.5 py-0.5 bg-white rounded border border-gray-200">
                      {comment.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{comment.date}</span>
                </div>
                <p>{comment.text}</p>
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
            className="flex-1 text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Send size={14} />
            <span>Envoyer</span>
          </button>
        </form>
      </div>

    </div>
  );
}
