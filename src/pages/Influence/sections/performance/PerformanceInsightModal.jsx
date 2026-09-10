import { useState, useEffect } from 'react';
import { X, Save, Lightbulb, AlertCircle, User, Calendar, Layers, FileText } from 'lucide-react';

export default function PerformanceInsightModal({
  insight, // null for new, object for edit
  onClose,
  onSave,
  campaigns = [],
  deliverables = [],
}) {
  const isEditing = Boolean(insight?.id);

  const [form, setForm] = useState({
    title: '',
    observation: '',
    recommendation: '',
    priority: 'haute',
    owner: 'Influence Manager',
    deadline: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    campaign_name: '',
    deliverable_id: '',
  });

  useEffect(() => {
    if (insight) {
      setForm({
        title: insight.title || '',
        observation: insight.observation || '',
        recommendation: insight.recommendation || '',
        priority: insight.priority || 'haute',
        owner: insight.owner || 'Influence Manager',
        deadline: insight.deadline || '',
        campaign_name: insight.campaign_name || '',
        deliverable_id: insight.deliverable_id || '',
      });
    }
  }, [insight]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.observation.trim()) {
      alert('Veuillez renseigner une observation.');
      return;
    }
    if (!form.recommendation.trim()) {
      alert('Veuillez renseigner une recommandation.');
      return;
    }

    const payload = {
      ...(insight || {}),
      id: insight?.id || `INS-${Date.now().toString().slice(-6)}`,
      title: form.title.trim() || `Insight: ${form.observation.slice(0, 40)}...`,
      observation: form.observation.trim(),
      recommendation: form.recommendation.trim(),
      priority: form.priority,
      owner: form.owner.trim() || 'Influence Manager',
      deadline: form.deadline,
      campaign_name: form.campaign_name.trim(),
      deliverable_id: form.deliverable_id,
      updated_at: new Date().toISOString(),
    };

    onSave(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-16"
      style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ border: '1px solid #E2E8F0' }}
      >
        {/* En-tête */}
        <div
          className="px-20 py-16 flex items-center justify-between"
          style={{ background: '#FFF7ED', borderBottom: '1px solid #FED7AA' }}
        >
          <div className="flex items-center gap-10">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#FF7900',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lightbulb size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-orange-800">
                {isEditing ? 'Édition Recommandation' : 'Nouvel Insight Stratégique'}
              </span>
              <h3 className="text-base font-bold text-dark" style={{ margin: 0 }}>
                {isEditing ? 'Modifier l’Insight' : 'Créer une Observation & Recommandation'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-6 rounded-lg text-muted hover:text-dark hover:bg-orange-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-20 overflow-y-auto flex-1 flex flex-col gap-16">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block">
              Titre synthétique de l'Insight *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Surperformance du format Reel sur la campagne Orange Money"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="form-input text-xs w-full"
              style={{ height: 36, borderRadius: 8 }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-4">
              <AlertCircle size={13} className="text-amber-600" />
              Observation (Constat analytique basé sur les données) *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Décrivez précisément ce que révèlent les données de performance (ex: les vidéos de 30s ont un taux d'engagement 2x supérieur aux carrousels statiques)..."
              value={form.observation}
              onChange={e => setForm({ ...form, observation: e.target.value })}
              className="form-input text-xs w-full"
              style={{ borderRadius: 8, padding: 10 }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-4">
              <Lightbulb size={13} className="text-emerald-600" />
              Recommandation (Action concrète préconisée pour l'équipe) *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Quelle action l'Influence Manager ou l'agence doit-il mettre en œuvre (ex: allouer 70% du budget créateurs aux reels TikTok au Q1 2026)..."
              value={form.recommendation}
              onChange={e => setForm({ ...form, recommendation: e.target.value })}
              className="form-input text-xs w-full"
              style={{ borderRadius: 8, padding: 10 }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {/* Priorité */}
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block">
                Niveau de Priorité
              </label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="form-input text-xs w-full font-bold"
                style={{ height: 36, borderRadius: 8 }}
              >
                <option value="urgente">🔥 Urgente</option>
                <option value="haute">⚡ Haute</option>
                <option value="moyenne">📌 Moyenne</option>
                <option value="normale">ℹ️ Normale / Basse</option>
              </select>
            </div>

            {/* Propriétaire */}
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-4">
                <User size={13} />
                Propriétaire / Responsable
              </label>
              <input
                type="text"
                placeholder="ex: Alain Patrick Eboa"
                value={form.owner}
                onChange={e => setForm({ ...form, owner: e.target.value })}
                className="form-input text-xs w-full"
                style={{ height: 36, borderRadius: 8 }}
              />
            </div>

            {/* Échéance */}
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-4">
                <Calendar size={13} />
                Échéance
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="form-input text-xs w-full"
                style={{ height: 36, borderRadius: 8 }}
              />
            </div>
          </div>

          {/* Liens Campagne et Livrable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 p-12 rounded-lg bg-gray-50 border border-gray-200">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-4">
                <Layers size={13} />
                Lien vers Campagne
              </label>
              <select
                value={form.campaign_name}
                onChange={e => setForm({ ...form, campaign_name: e.target.value })}
                className="form-input text-xs w-full"
                style={{ height: 36, borderRadius: 8, background: '#fff' }}
              >
                <option value="">Aucune campagne spécifique</option>
                {campaigns.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-4">
                <FileText size={13} />
                Lien vers Livrable / Publication
              </label>
              <select
                value={form.deliverable_id}
                onChange={e => setForm({ ...form, deliverable_id: e.target.value })}
                className="form-input text-xs w-full"
                style={{ height: 36, borderRadius: 8, background: '#fff' }}
              >
                <option value="">Tous les livrables / Global</option>
                {deliverables.slice(0, 50).map(d => (
                  <option key={d.id} value={d.id}>
                    [{d.talent_name}] {d.title.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-10 pt-12 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost text-xs px-16 py-8 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-orange text-xs font-semibold flex items-center gap-6 px-18 py-8 rounded-lg"
            >
              <Save size={14} />
              {isEditing ? 'Mettre à jour l’Insight' : 'Enregistrer l’Insight'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
