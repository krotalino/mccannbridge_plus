import { useState } from 'react';
import { 
  CheckCircle2, Clock, AlertCircle, FileText, Download, 
  Send, MessageSquare, ChevronRight, Filter, ShieldCheck, 
  Sparkles, Layers, ArrowUpRight, History
} from 'lucide-react';
import { 
  CLIENT_RECOMMENDATIONS_PLAN, 
  CLIENT_DOWNLOADABLE_REPORTS 
} from '../../../data/reportingWeeklyDataSept2026';

export default function ClientRecommendationsActionPlan({ onOpenExportModal }) {
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations' | 'library' | 'validation'
  const [selectedEntityFilter, setSelectedEntityFilter] = useState('all');
  const [reportsList, setReportsList] = useState(CLIENT_DOWNLOADABLE_REPORTS);
  const [recommendations, setRecommendations] = useState(CLIENT_RECOMMENDATIONS_PLAN);
  const [adjustmentComment, setAdjustmentComment] = useState('');
  const [successToast, setSuccessToast] = useState(null);

  const filteredRecs = recommendations.filter(rec => {
    if (selectedEntityFilter === 'all') return true;
    return rec.entity.toLowerCase().includes(selectedEntityFilter.toLowerCase());
  });

  const handleValidateReport = (reportId) => {
    setReportsList(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status: 'approved', statusLabel: 'Validé par le Client' };
      }
      return r;
    }));
    setSuccessToast(`Le rapport ${reportId} a été officiellement approuvé par le Client.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleRequestAdjustment = (reportId) => {
    if (!adjustmentComment.trim()) return;
    setReportsList(prev => prev.map(r => {
      if (r.id === reportId) {
        return { 
          ...r, 
          status: 'in_review', 
          statusLabel: 'Ajustement demandé',
          summary: `${r.summary} • [Demande Client : ${adjustmentComment}]` 
        };
      }
      return r;
    }));
    setAdjustmentComment('');
    setSuccessToast(`Votre demande d'ajustement a été transmise aux analystes McCann.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleUpdateRecStatus = (recId, newStatus) => {
    setRecommendations(prev => prev.map(r => {
      if (r.id === recId) {
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* Toast de confirmation */}
      {successToast && (
        <div className="p-3 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-white hover:opacity-80">✕</button>
        </div>
      )}

      {/* ─── EN-TÊTE DE SECTION (Cahier des charges Page 7) ─── */}
      <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                📋
              </span>
              <h2 className="text-base font-black text-gray-900 m-0">Recommandations, Plan d’Action & Livrables</h2>
            </div>
            <p className="text-xs text-gray-500 m-0 mt-0.5">
              Passage du constat à la décision : matrice de pilotage, logique Test & Learn et téléchargement certifié
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('recommendations')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Plan d’Action Opérationnel ({recommendations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'library'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bibliothèque des Livrables PDF & Données ({reportsList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('validation')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'validation'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Circuit de Validation Client
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Livrable Actuel (S38)</span>
            <div className="text-xs font-black text-gray-900 mt-0.5">Bilan Hebdo S38 (14-20 Septembre 2026)</div>
            <div className="text-[11px] font-bold text-emerald-700 mt-0.5">22 slides PDF Charté Orange Cameroun</div>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Recommandations en cours</span>
            <div className="text-xs font-black text-gray-900 mt-0.5">4 actions majeures arbitrées</div>
            <div className="text-[11px] font-bold text-blue-700 mt-0.5">2 prioritaires (Paid Media & Quiz OM)</div>
          </div>

          <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200">
            <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Gouvernance Agence-Client</span>
            <div className="text-xs font-black text-gray-900 mt-0.5">Revue de cadrage hebdomadaire</div>
            <div className="text-[11px] font-bold text-orange-700 mt-0.5">Circuit de validation et retours intégrés</div>
          </div>
        </div>
      </div>

      {/* ─── CONTENU 1 : PLAN D'ACTION OPÉRATIONNEL (Cahier des charges Page 7) ─── */}
      {activeTab === 'recommendations' && (
        <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                Matrice des Recommandations Stratégiques
              </h3>
              <p className="text-xs text-gray-500 m-0">
                Chaque action associe entité, levier, justification chiffrée, priorité et responsable
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500 font-semibold">Filtrer par entité :</span>
              {['all', 'telco', 'money', 'business'].map(ent => (
                <button
                  key={ent}
                  type="button"
                  onClick={() => setSelectedEntityFilter(ent)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize transition-colors ${
                    selectedEntityFilter === ent
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {ent === 'all' ? 'Toutes' : ent}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Recommandation</th>
                  <th className="py-2.5 px-3">Entité</th>
                  <th className="py-2.5 px-3">Levier</th>
                  <th className="py-2.5 px-3">Justification Data</th>
                  <th className="py-2.5 px-3">Priorité</th>
                  <th className="py-2.5 px-3">Responsable</th>
                  <th className="py-2.5 px-3">Échéance</th>
                  <th className="py-2.5 px-3 text-right">Statut / Arbitrage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredRecs.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900 text-xs">{rec.recommendation}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Test prévu : {rec.testResult}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-gray-100 text-gray-800">
                        {rec.entity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-700">{rec.lever}</td>
                    <td className="py-2.5 px-3 text-gray-600 text-[11px] max-w-xs">{rec.justification}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        rec.priority === 'Élevée' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium">{rec.owner}</td>
                    <td className="py-2.5 px-3 text-gray-500 text-[11px]">{rec.dueDate}</td>
                    <td className="py-2.5 px-3 text-right">
                      <select
                        value={rec.status}
                        onChange={(e) => handleUpdateRecStatus(rec.id, e.target.value)}
                        className={`text-[10.5px] font-extrabold px-2 py-1 rounded border ${
                          rec.status === 'a_valider' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                          rec.status === 'planifiee' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                          rec.status === 'realisee' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-gray-50 text-gray-700 border-gray-300'
                        }`}
                      >
                        <option value="a_valider">À valider</option>
                        <option value="planifiee">Planifiée</option>
                        <option value="en_cours">En cours</option>
                        <option value="realisee">Réalisée</option>
                        <option value="ecartee">Écartée</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── CONTENU 2 : BIBLIOTHÈQUE DES RAPPORTS & LIVRABLES ─── */}
      {activeTab === 'library' && (
        <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                Bibliothèque des Livrables Certifiés
              </h3>
              <p className="text-xs text-gray-500 m-0">
                Téléchargement direct des bilans chartés Orange Cameroun et extraction des données brutes
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenExportModal}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs"
              >
                <Download size={13} />
                <span>Exporter le Rapport Personnalisé</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportsList.map(rep => (
              <div 
                key={rep.id}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs hover:border-orange-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                    <span className="text-[10px] font-bold font-mono text-gray-500 uppercase">{rep.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10.5px] font-extrabold ${
                      rep.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      rep.status === 'delivered' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rep.statusLabel}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm mb-1">{rep.title}</h4>
                  <p className="text-xs text-gray-600 m-0 mb-3 leading-relaxed">{rep.summary}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-lg mb-3">
                    <div>Périmètre : <strong>{rep.entity}</strong></div>
                    <div>Format : <strong>{rep.format}</strong></div>
                    <div>Période : <strong>{rep.period}</strong></div>
                    <div>Taille : <strong>{rep.fileSize} ({rep.pages} p.)</strong></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400">Mis à disposition : {rep.publishedAt}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Téléchargement simulé propre
                        const element = document.createElement("a");
                        const file = new Blob([JSON.stringify(rep, null, 2)], {type: 'application/json'});
                        element.href = URL.createObjectURL(file);
                        element.download = `${rep.id}-Orange-Cameroun.json`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="btn btn-ghost btn-sm text-xs flex items-center gap-1 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded"
                    >
                      <Download size={12} />
                      <span>Data (JSON/CSV)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Téléchargement du ${rep.title} (Format ${rep.format}, ${rep.fileSize})`)}
                      className="btn btn-sm text-xs flex items-center gap-1 font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded shadow-xs"
                    >
                      <FileText size={12} />
                      <span>Télécharger PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── CONTENU 3 : CIRCUIT DE VALIDATION DU LIVRABLE ─── */}
      {activeTab === 'validation' && (
        <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                Circuit de Validation & Échanges Client-Agence
              </h3>
              <p className="text-xs text-gray-500 m-0">
                Valider formellement les rapports reçus ou consigner des demandes d’ajustement pour l’équipe McCann
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Gouvernance Partagée
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Formulaire de validation / retour */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider m-0">
                Action sur le Bilan Hebdo S38 (Actuel)
              </h4>
              <p className="text-xs text-gray-600 m-0 leading-relaxed">
                Vous pouvez acter votre validation sans réserve du bilan S38 ou spécifier un point d’approfondissement à intégrer lors de la prochaine itération.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Commentaire ou demande d’ajustement (facultatif) :
                </label>
                <textarea
                  value={adjustmentComment}
                  onChange={(e) => setAdjustmentComment(e.target.value)}
                  placeholder="Ex : Pouvez-vous détailler le split des dépenses paid sur Lions4Life lors du prochain point ?"
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleValidateReport('REP-S38-2026')}
                  className="btn btn-sm text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 size={14} />
                  <span>Valider le Rapport S38</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestAdjustment('REP-S38-2026')}
                  disabled={!adjustmentComment.trim()}
                  className="btn btn-sm text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>Transmettre l’Ajustement</span>
                </button>
              </div>
            </div>

            {/* Historique des validations */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider m-0">
                Historique des Validations Récentes
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center font-bold text-gray-900 mb-0.5">
                    <span>Bilan S37 (07-13 Sept)</span>
                    <span className="text-emerald-700 font-extrabold text-[10px]">Validé le 15/09/2026</span>
                  </div>
                  <p className="text-[11px] text-gray-600 m-0">
                    Approuvé par Christian N. (Direction Marketing Orange Cameroun) sans réserve.
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center font-bold text-gray-900 mb-0.5">
                    <span>Bilan Mensuel Août 2026</span>
                    <span className="text-emerald-700 font-extrabold text-[10px]">Clôturé le 05/09/2026</span>
                  </div>
                  <p className="text-[11px] text-gray-600 m-0">
                    Revue trimestrielle effectuée en visio avec l’équipe de direction McCann.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
