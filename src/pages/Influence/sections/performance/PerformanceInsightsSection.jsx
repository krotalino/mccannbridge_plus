import { useState } from 'react';
import { Lightbulb, Plus, Edit, Trash2, Calendar, User, Layers, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function PerformanceInsightsSection({
  insights = [],
  onAddNew,
  onEdit,
  onDelete,
  campaigns = [],
}) {
  const [priorityFilter, setPriorityFilter] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');

  const filteredInsights = insights.filter(ins => {
    if (priorityFilter && ins.priority !== priorityFilter) return false;
    if (campaignFilter && ins.campaign_name !== campaignFilter) return false;
    return true;
  });

  const getPriorityBadge = (priority) => {
    const p = String(priority || 'normale').toLowerCase();
    const config = {
      urgente: { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA', label: '🔥 Urgente' },
      haute: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: '⚡ Haute' },
      moyenne: { bg: '#FEFCE8', text: '#A16207', border: '#FEF08A', label: '📌 Moyenne' },
      normale: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'ℹ️ Normale' },
    };
    const c = config[p] || config.normale;
    return (
      <span
        className="px-8 py-2 rounded-full text-xs font-bold"
        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
      >
        {c.label}
      </span>
    );
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div
      className="card mb-24"
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* En-tête Insights */}
      <div className="flex flex-wrap items-center justify-between gap-16 mb-20 pb-16" style={{ borderBottom: '1px solid #f3f4f6' }}>
        <div>
          <div className="flex items-center gap-8">
            <span
              className="text-xs font-bold px-8 py-2 rounded"
              style={{ background: '#FFF0E5', color: '#FF7900', border: '1px solid #FED7AA' }}
            >
              ZONE INSIGHTS & RECOMMANDATIONS
            </span>
            <h3 className="text-base font-bold text-dark" style={{ margin: 0 }}>
              Espace Stratégique Analyste & Influence Manager
            </h3>
          </div>
          <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
            Consignez les observations clés, formulez des recommandations actionnables et pilotez les priorités avec leurs propriétaires et échéances
          </p>
        </div>

        <div className="flex items-center gap-10">
          <button
            onClick={onAddNew}
            className="btn btn-orange text-xs font-semibold flex items-center gap-6 px-14 py-8 rounded-lg shadow-sm"
          >
            <Plus size={15} />
            Nouvel Insight / Recommandation
          </button>
        </div>
      </div>

      {/* Barre de filtres légers pour Insights */}
      <div className="flex flex-wrap items-center justify-between gap-10 mb-16 p-10 rounded-lg bg-gray-50 border border-gray-100">
        <div className="flex flex-wrap items-center gap-10">
          <span className="text-xs font-semibold text-muted">Filtrer par :</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="form-input text-xs"
            style={{ height: 32, borderRadius: 6, border: '1px solid #D1D5DB', background: '#fff' }}
          >
            <option value="">Toutes les priorités</option>
            <option value="urgente">Urgente</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="normale">Normale</option>
          </select>

          <select
            value={campaignFilter}
            onChange={e => setCampaignFilter(e.target.value)}
            className="form-input text-xs"
            style={{ height: 32, borderRadius: 6, border: '1px solid #D1D5DB', background: '#fff' }}
          >
            <option value="">Toutes les campagnes</option>
            {campaigns.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {(priorityFilter || campaignFilter) && (
            <button
              onClick={() => { setPriorityFilter(''); setCampaignFilter(''); }}
              className="text-xs text-orange-600 hover:underline"
            >
              Effacer les filtres
            </button>
          )}
        </div>

        <div className="text-xs text-muted">
          <span className="font-bold text-dark">{filteredInsights.length}</span> insight{filteredInsights.length > 1 ? 's' : ''} enregistré{filteredInsights.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Liste des cartes d'Insights */}
      <div className="flex flex-col gap-14">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-40 rounded-xl bg-gray-50 border border-dashed border-gray-300">
            <Lightbulb size={36} className="mx-auto text-amber-500 mb-8" />
            <h4 className="text-sm font-bold text-dark mb-4">Aucun insight enregistré</h4>
            <p className="text-xs text-muted max-w-md mx-auto mb-16">
              Créez votre première observation stratégique pour orienter les futures activations d'influence Orange Cameroun.
            </p>
            <button
              onClick={onAddNew}
              className="btn btn-orange text-xs font-semibold px-14 py-6 rounded-lg"
            >
              Créer un premier insight
            </button>
          </div>
        ) : (
          filteredInsights.map(ins => {
            const overdue = isOverdue(ins.deadline);

            return (
              <div
                key={ins.id}
                className="p-16 rounded-xl transition-all"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                }}
              >
                {/* Ligne d'en-tête de l'insight */}
                <div className="flex flex-wrap items-start justify-between gap-10 mb-12">
                  <div className="flex items-center gap-10 flex-1 min-w-0">
                    {getPriorityBadge(ins.priority)}
                    <h4 className="text-sm font-bold text-dark truncate" title={ins.title}>
                      {ins.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => onEdit(ins)}
                      className="p-6 rounded hover:bg-blue-50 text-blue-600 transition-colors border border-transparent hover:border-blue-200"
                      title="Modifier cet insight"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(ins.id)}
                      className="p-6 rounded hover:bg-rose-50 text-rose-600 transition-colors border border-transparent hover:border-rose-200"
                      title="Supprimer cet insight"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Grille : Observation & Recommandation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 text-xs">
                  {/* Observation */}
                  <div className="p-10 rounded-lg bg-amber-50/50 border border-amber-200/70">
                    <div className="font-bold text-amber-900 mb-4 flex items-center gap-4">
                      <span>🔍 Observation Analytique :</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed" style={{ margin: 0 }}>
                      {ins.observation}
                    </p>
                  </div>

                  {/* Recommandation */}
                  <div className="p-10 rounded-lg bg-emerald-50/50 border border-emerald-200/70">
                    <div className="font-bold text-emerald-900 mb-4 flex items-center gap-4">
                      <span>💡 Recommandation Actionnable :</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed" style={{ margin: 0 }}>
                      {ins.recommendation}
                    </p>
                  </div>
                </div>

                {/* Métadonnées : Propriétaire, Échéance, Campagne */}
                <div className="flex flex-wrap items-center justify-between gap-10 pt-10 border-t border-gray-100 text-xs text-muted">
                  <div className="flex flex-wrap items-center gap-14">
                    <span className="flex items-center gap-4 text-gray-700 font-medium">
                      <User size={13} className="text-muted" />
                      {ins.owner || 'Influence Manager'}
                    </span>

                    {ins.deadline && (
                      <span className={`flex items-center gap-4 font-medium ${overdue ? 'text-rose-600' : 'text-gray-700'}`}>
                        <Calendar size={13} className={overdue ? 'text-rose-500' : 'text-muted'} />
                        Échéance : {ins.deadline} {overdue && '(En retard)'}
                      </span>
                    )}

                    {ins.campaign_name && (
                      <span className="flex items-center gap-4 text-gray-700">
                        <Layers size={13} className="text-muted" />
                        Campagne : <strong className="text-dark">{ins.campaign_name}</strong>
                      </span>
                    )}

                    {ins.deliverable_id && (
                      <span className="flex items-center gap-4 text-gray-700">
                        <FileText size={13} className="text-muted" />
                        Livrable lié : <strong className="font-mono text-dark">{ins.deliverable_id}</strong>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-muted italic">
                    Créé le {new Date(ins.created_at || Date.now()).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
