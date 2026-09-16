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
    <div className="space-y-5 animate-fadeIn pb-10">
      
      {/* Workflow Progress Timeline Bar (Style Influence) */}
      <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 className="text-sm font-bold text-dark mb-1 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#FF7900]" />
          <span>Gouvernance & Jalons du Workflow (8 Étapes)</span>
        </h3>
        <p className="text-xs text-muted mb-6">
          Suivi des étapes d'élaboration, qualification, revue interne McCann et validation client Orange
        </p>

        {/* Steps track */}
        <div className="relative">
          <div className="hidden md:flex items-center justify-between relative">
            <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 -z-0"></div>
            
            {REPORT_WORKFLOW_STEPS.map((step, idx) => {
              const isPast = currentStepIndex > idx || report.status === 'delivered';
              const isCurrent = report.status === step.id;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center text-center max-w-[100px]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCurrent 
                      ? 'bg-[#FF7900] text-white shadow-md ring-4 ring-orange-100 scale-110'
                      : isPast
                      ? 'bg-green-600 text-white font-black'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <div className={`text-[10px] font-bold mt-2 leading-tight ${
                    isCurrent ? 'text-[#FF7900]' : isPast ? 'text-dark' : 'text-muted'
                  }`}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role-Based Action Panel (Style Influence) */}
      <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-dark">
            Actions Rapides & Changement de Statut
          </h3>
          <span className="tag" style={{ background: '#FF790018', color: '#FF7900', fontWeight: 700, fontSize: 11 }}>
            Rôle Actif : {isAgency ? '🏢 Agence McCann' : '📱 Client Orange'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {report.status === 'draft' && (
            <button
              type="button"
              onClick={() => handleApplyStatus('submitted', 'Demande soumise et enregistrée.')}
              className="btn btn-orange text-xs font-bold px-4 py-2 rounded"
            >
              🚀 Soumettre la Demande
            </button>
          )}

          {report.status === 'submitted' && (
            <button
              type="button"
              onClick={() => handleApplyStatus('in_progress', 'Prise en charge par l’analyste.')}
              className="btn btn-orange text-xs font-bold px-4 py-2 rounded"
            >
              ⚙️ Démarrer l'Analyse
            </button>
          )}

          {report.status === 'in_progress' && (
            <button
              type="button"
              onClick={() => handleApplyStatus('internal_review', 'Données consolidées, transmis en revue interne.')}
              className="btn btn-orange text-xs font-bold px-4 py-2 rounded"
            >
              🔍 Transmettre en Revue Interne
            </button>
          )}

          {report.status === 'internal_review' && (
            <button
              type="button"
              onClick={() => handleApplyStatus('client_review', 'Revue interne validée, transmis au client.')}
              className="btn btn-orange text-xs font-bold px-4 py-2 rounded"
            >
              📤 Transmettre au Client Orange
            </button>
          )}

          {report.status === 'client_review' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleApplyStatus('approved', 'Rapport approuvé par le client.')}
                className="btn btn-green text-xs font-bold px-4 py-2 rounded"
                style={{ background: '#28A745', color: '#fff' }}
              >
                ✓ Approuver le Rapport
              </button>
              <button
                type="button"
                onClick={() => handleApplyStatus('changes_requested', 'Corrections demandées.')}
                className="btn btn-ghost border text-xs font-bold px-4 py-2 rounded text-red-600 border-red-200"
              >
                ↺ Demander des Retouches
              </button>
            </div>
          )}

          {report.status === 'approved' && (
            <button
              type="button"
              onClick={() => handleApplyStatus('delivered', 'Livrable final officiel archivé.')}
              className="btn btn-green text-xs font-bold px-4 py-2 rounded"
              style={{ background: '#28A745', color: '#fff' }}
            >
              🎉 Marquer comme Livré & Clôturé
            </button>
          )}
        </div>
      </div>

      {/* Commentaires & Fil de discussion (Style Influence) */}
      <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2">
          <MessageSquare size={16} className="text-[#FF7900]" />
          <span>Fil d'Échange Bi-Rive (McCann × Orange) ({report.comments?.length || 0})</span>
        </h3>

        {/* Comments List */}
        <div className="space-y-3 mb-5 max-h-80 overflow-y-auto pr-1">
          {report.comments && report.comments.length > 0 ? (
            report.comments.map(c => {
              const isAg = c.type === 'agency';
              return (
                <div 
                  key={c.id} 
                  className="p-3.5 rounded-lg border text-xs"
                  style={{
                    background: isAg ? '#fff' : '#f0f7ff',
                    borderColor: isAg ? '#e9ecef' : '#b8daff'
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-dark">{c.author} <span className="text-muted font-normal">({c.role})</span></span>
                    <span className="text-[10px] text-muted">{c.date}</span>
                  </div>
                  <p className="text-dark leading-relaxed font-medium">{c.text}</p>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-muted italic">Aucun commentaire pour le moment.</p>
          )}
        </div>

        {/* Add comment form */}
        <form onSubmit={handleSendComment} className="flex gap-2">
          <input
            type="text"
            className="form-input flex-1 text-xs"
            placeholder="Écrire une observation, remarque ou validation..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-orange text-xs font-bold flex items-center gap-1.5 px-4 py-2 rounded"
          >
            <Send size={13} />
            <span>Envoyer</span>
          </button>
        </form>
      </div>

    </div>
  );
}
