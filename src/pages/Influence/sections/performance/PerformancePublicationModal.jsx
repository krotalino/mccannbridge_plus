import { useState, useEffect } from 'react';
import { X, Save, Calculator, Eye, Heart, MessageSquare, Share2, HelpCircle, Layers, Globe, User, Tag } from 'lucide-react';

export default function PerformancePublicationModal({
  deliverable, // null for new, or object for edit
  onClose,
  onSave,
  campaigns = [],
  talents = [],
}) {
  const isEditing = Boolean(deliverable?.id);

  const [form, setForm] = useState({
    title: '',
    talent_name: '',
    campaign_name: '',
    platform: 'instagram',
    content_type: 'video',
    content_subject: 'Orange Money',
    published_at: new Date().toISOString().split('T')[0],
    url: '',
    views: '',
    likes: '',
    comments: '',
    shares: '',
    engagement_reported: '',
    status: 'publie',
  });

  useEffect(() => {
    if (deliverable) {
      setForm({
        title: deliverable.title || '',
        talent_name: deliverable.talent_name || '',
        campaign_name: deliverable.campaign_name || deliverable.campaign_id || '',
        platform: deliverable.platform || 'instagram',
        content_type: deliverable.content_type || 'video',
        content_subject: deliverable.content_subject || '',
        published_at: deliverable.published_at || deliverable.date_raw || new Date().toISOString().split('T')[0],
        url: deliverable.url || '',
        views: deliverable.metrics?.views !== null && deliverable.metrics?.views !== undefined ? deliverable.metrics.views : '',
        likes: deliverable.metrics?.likes !== null && deliverable.metrics?.likes !== undefined ? deliverable.metrics.likes : '',
        comments: deliverable.metrics?.comments !== null && deliverable.metrics?.comments !== undefined ? deliverable.metrics.comments : '',
        shares: deliverable.metrics?.shares !== null && deliverable.metrics?.shares !== undefined ? deliverable.metrics.shares : '',
        engagement_reported: deliverable.metrics?.engagement_reported !== null && deliverable.metrics?.engagement_reported !== undefined ? deliverable.metrics.engagement_reported : '',
        status: deliverable.status || 'publie',
      });
    }
  }, [deliverable]);

  // Recalcul en temps réel
  const numViews = Number(form.views) || 0;
  const numLikes = Number(form.likes) || 0;
  const numComments = Number(form.comments) || 0;
  const numShares = Number(form.shares) || 0;
  const calculatedEngagement = numLikes + numComments + numShares;
  const engagementRate = numViews > 0 ? ((calculatedEngagement / numViews) * 100).toFixed(2) : null;
  const isDataComplete = numViews > 0 && form.likes !== '' && form.comments !== '' && form.shares !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Veuillez saisir un titre pour la publication.');
      return;
    }
    if (!form.talent_name.trim()) {
      alert('Veuillez renseigner le talent associé.');
      return;
    }

    const payload = {
      ...(deliverable || {}),
      id: deliverable?.id || `PUB-${Date.now().toString().slice(-6)}`,
      title: form.title.trim(),
      talent_name: form.talent_name.trim(),
      campaign_name: form.campaign_name.trim() || 'Campagnes Q4 2025',
      platform: form.platform,
      content_type: form.content_type,
      content_subject: form.content_subject.trim(),
      published_at: form.published_at,
      date_raw: form.published_at,
      url: form.url.trim(),
      status: form.status,
      quality_status: isDataComplete ? 'valid' : 'incomplete',
      metrics: {
        views: form.views !== '' ? Number(form.views) : null,
        likes: form.likes !== '' ? Number(form.likes) : null,
        comments: form.comments !== '' ? Number(form.comments) : null,
        shares: form.shares !== '' ? Number(form.shares) : null,
        engagement_reported: form.engagement_reported !== '' ? Number(form.engagement_reported) : null,
        engagement_calculated: calculatedEngagement,
        engagement_rate: engagementRate !== null ? Number(engagementRate) : null,
      }
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
        {/* En-tête du modal */}
        <div
          className="px-20 py-16 flex items-center justify-between"
          style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}
        >
          <div>
            <span
              className="text-[10px] font-bold px-8 py-2 rounded uppercase"
              style={{
                background: isEditing ? '#EFF6FF' : '#ECFDF5',
                color: isEditing ? '#1D4ED8' : '#047857',
                border: `1px solid ${isEditing ? '#BFDBFE' : '#A7F3D0'}`,
              }}
            >
              {isEditing ? 'Modification Publication' : 'Nouvelle Publication'}
            </span>
            <h3 className="text-base font-bold text-dark mt-4" style={{ margin: 0 }}>
              {isEditing ? `Éditer les KPIs de « ${deliverable.title} »` : 'Ajouter une Publication & ses Métriques'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-6 rounded-lg text-muted hover:text-dark hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulaire avec scroll */}
        <form onSubmit={handleSubmit} className="p-20 overflow-y-auto flex-1 flex flex-col gap-16">
          {/* Bloc 1 : Métadonnées générales */}
          <div className="p-12 rounded-lg bg-gray-50 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase mb-8 flex items-center gap-4">
              <Layers size={13} />
              1. Informations Générales
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted mb-2 block">Titre de la publication *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Reel Welcome pack — Diana Bouli"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="form-input text-xs w-full"
                  style={{ height: 36, borderRadius: 8 }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted mb-2 block">Talent / Influenceur *</label>
                <input
                  type="text"
                  required
                  list="talents-list"
                  placeholder="Nom du créateur"
                  value={form.talent_name}
                  onChange={e => setForm({ ...form, talent_name: e.target.value })}
                  className="form-input text-xs w-full"
                  style={{ height: 36, borderRadius: 8 }}
                />
                <datalist id="talents-list">
                  {talents.map(t => <option key={t} value={t} />)}
                </datalist>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted mb-2 block">Campagne</label>
                <input
                  type="text"
                  list="campaigns-list"
                  placeholder="Nom de la campagne"
                  value={form.campaign_name}
                  onChange={e => setForm({ ...form, campaign_name: e.target.value })}
                  className="form-input text-xs w-full"
                  style={{ height: 36, borderRadius: 8 }}
                />
                <datalist id="campaigns-list">
                  {campaigns.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted mb-2 block">Plateforme</label>
                <select
                  value={form.platform}
                  onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="form-input text-xs w-full"
                  style={{ height: 36, borderRadius: 8 }}
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="website">Webzine / Site</option>
                  <option value="x">X (Twitter)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted mb-2 block">Format / Type de contenu</label>
                <select
                  value={form.content_type}
                  onChange={e => setForm({ ...form, content_type: e.target.value })}
                  className="form-input text-xs w-full capitalize"
                  style={{ height: 36, borderRadius: 8 }}
                >
                  <option value="video">Vidéo</option>
                  <option value="reel">Reel</option>
                  <option value="image">Image / Visuel</option>
                  <option value="story">Story</option>
                  <option value="post">Post standard</option>
                  <option value="live">Live / Direct</option>
                  <option value="article">Article web</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted mb-2 block">Sujet / Thématique</label>
                <input
                  type="text"
                  placeholder="ex: Orange Money, Fibre, Pack Étudiant..."
                  value={form.content_subject}
                  onChange={e => setForm({ ...form, content_subject: e.target.value })}
                  className="form-input text-xs w-full"
                  style={{ height: 36, borderRadius: 8 }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted mb-2 block">Date de publication</label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={e => setForm({ ...form, published_at: e.target.value })}
                  className="form-input text-xs w-full"
                  style={{ height: 36, borderRadius: 8 }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-muted mb-2 block">Lien URL du post</label>
                <input
                  type="url"
                  placeholder="https://tiktok.com/@talent/video/..."
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  className="form-input text-xs w-full"
                  style={{ height: 36, borderRadius: 8 }}
                />
              </div>
            </div>
          </div>

          {/* Bloc 2 : Métriques Mesurées */}
          <div className="p-12 rounded-lg bg-blue-50/40 border border-blue-200">
            <h4 className="text-xs font-bold text-blue-900 uppercase mb-8 flex items-center gap-4">
              <Eye size={13} />
              2. Métriques Mesurées (Collecte Directe Brute)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Vues / Impressions</label>
                <input
                  type="number"
                  min="0"
                  placeholder="ex: 85000"
                  value={form.views}
                  onChange={e => setForm({ ...form, views: e.target.value })}
                  className="form-input text-xs w-full font-mono font-bold"
                  style={{ height: 36, borderRadius: 8 }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Likes</label>
                <input
                  type="number"
                  min="0"
                  placeholder="ex: 4200"
                  value={form.likes}
                  onChange={e => setForm({ ...form, likes: e.target.value })}
                  className="form-input text-xs w-full font-mono"
                  style={{ height: 36, borderRadius: 8 }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Commentaires</label>
                <input
                  type="number"
                  min="0"
                  placeholder="ex: 310"
                  value={form.comments}
                  onChange={e => setForm({ ...form, comments: e.target.value })}
                  className="form-input text-xs w-full font-mono"
                  style={{ height: 36, borderRadius: 8 }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Partages</label>
                <input
                  type="number"
                  min="0"
                  placeholder="ex: 180"
                  value={form.shares}
                  onChange={e => setForm({ ...form, shares: e.target.value })}
                  className="form-input text-xs w-full font-mono"
                  style={{ height: 36, borderRadius: 8 }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Engagement Déclaré (Optionnel / Fourni par tiers)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Laisser vide si non déclaré"
                  value={form.engagement_reported}
                  onChange={e => setForm({ ...form, engagement_reported: e.target.value })}
                  className="form-input text-xs w-full font-mono"
                  style={{ height: 36, borderRadius: 8 }}
                />
              </div>
            </div>
          </div>

          {/* Bloc 3 : Recalcul Automatique en Temps Réel */}
          <div className="p-12 rounded-lg bg-emerald-50/50 border border-emerald-200">
            <h4 className="text-xs font-bold text-emerald-900 uppercase mb-8 flex items-center gap-4">
              <Calculator size={13} />
              3. Métriques Calculées Automatiquement
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-xs">
              <div className="p-8 rounded bg-white border border-emerald-100">
                <span className="text-muted block">Engagement Calculé :</span>
                <span className="text-lg font-black text-emerald-800 font-mono">
                  {calculatedEngagement.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted block mt-1">Likes + Comm + Partages</span>
              </div>

              <div className="p-8 rounded bg-white border border-emerald-100">
                <span className="text-muted block">Taux sur Vues :</span>
                <span className="text-lg font-black text-amber-800 font-mono">
                  {engagementRate !== null ? `${engagementRate}%` : 'Non calculable'}
                </span>
                <span className="text-[10px] text-muted block mt-1">(Eng. / Vues) × 100</span>
              </div>

              <div className="p-8 rounded bg-white border border-emerald-100">
                <span className="text-muted block">Statut de Complétude :</span>
                <span className={`font-bold inline-block px-8 py-2 rounded-full text-xs mt-1 ${isDataComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {isDataComplete ? '✓ Validé (100%)' : '⚠️ Incomplet / Vues manquantes'}
                </span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
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
              {isEditing ? 'Enregistrer les modifications' : 'Créer la publication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
