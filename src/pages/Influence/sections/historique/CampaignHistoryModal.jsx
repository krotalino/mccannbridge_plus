import { useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

const POPULAR_BRANDS = [
  'Orange Cameroun',
  'Orange Money',
  'Pulse Orange',
  'Maxit Super App',
  'Orange Fibre Optique',
  'Orange Energie',
  'Fondation Orange',
];

const AVAILABLE_NETWORKS = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'X (Twitter)', 'LinkedIn'];
const AVAILABLE_CONTENT_TYPES = ['Story', 'Reel / TikTok', 'Post Carrousel', 'Post Image', 'Vidéo YouTube', 'Live Stream', 'Article Web'];

export default function CampaignHistoryModal({
  isOpen,
  onClose,
  onSave,
  influencer,
  campaignToEdit = null,
}) {
  const isEditing = !!campaignToEdit;

  const [form, setForm] = useState(() => {
    if (campaignToEdit) {
      return {
        campaign: campaignToEdit.campaign || campaignToEdit.name || '',
        brand: campaignToEdit.brand || campaignToEdit.marque || 'Orange Cameroun',
        dateDebut: campaignToEdit.dateDebut || '2026-01-01',
        dateFin: campaignToEdit.dateFin || '2026-01-31',
        dates: campaignToEdit.dates || '',
        status: campaignToEdit.status || 'terminee',
        networks: Array.isArray(campaignToEdit.networks) ? campaignToEdit.networks : (campaignToEdit.reseaux ? [campaignToEdit.reseaux] : ['Instagram', 'TikTok']),
        contentTypes: Array.isArray(campaignToEdit.contentTypes) ? campaignToEdit.contentTypes : ['Story', 'Reel / TikTok'],

        // Résultats chiffrés
        kpiReach: campaignToEdit.kpiReach || campaignToEdit.reach || 150000,
        kpiTarget: campaignToEdit.kpiTarget || 120000,
        impressions: campaignToEdit.impressions || 195000,
        kpiEngagement: campaignToEdit.kpiEngagement || campaignToEdit.engagementRate || 5.5,
        engagementTarget: campaignToEdit.engagementTarget || 5.0,
        clicks: campaignToEdit.clicks || campaignToEdit.clics || 4200,
        conversions: campaignToEdit.conversions || 650,
        salesVolume: campaignToEdit.salesVolume || 0,

        // Évaluation qualitative
        contentQuality: campaignToEdit.contentQuality || 4,
        onTime: campaignToEdit.onTime !== undefined ? campaignToEdit.onTime : true,
        variablePaid: campaignToEdit.variablePaid !== undefined ? campaignToEdit.variablePaid : 100,
        notesInternes: {
          noteGlobale: campaignToEdit.notesInternes?.noteGlobale || campaignToEdit.contentQuality || 4.5,
          fiabilite: campaignToEdit.notesInternes?.fiabilite || 4,
          qualiteCollaboration: campaignToEdit.notesInternes?.qualiteCollaboration || 5,
          respectDelais: campaignToEdit.notesInternes?.respectDelais || 4,
          commentaire: campaignToEdit.notesInternes?.commentaire || '',
          pointsForts: Array.isArray(campaignToEdit.notesInternes?.pointsForts)
            ? campaignToEdit.notesInternes.pointsForts.join(', ')
            : (campaignToEdit.notesInternes?.pointsForts || 'Qualité visuelle soignée, excellente réactivité'),
          axesAmelioration: Array.isArray(campaignToEdit.notesInternes?.axesAmelioration)
            ? campaignToEdit.notesInternes.axesAmelioration.join(', ')
            : (campaignToEdit.notesInternes?.axesAmelioration || 'Anticiper les sous-titrages des vidéos'),
        },

        // Livrables
        livrables: Array.isArray(campaignToEdit.livrables) && campaignToEdit.livrables.length > 0
          ? campaignToEdit.livrables
          : [
            { id: 'L-1', titre: 'Story Teaser de lancement', type: 'Story', url: 'https://instagram.com/p/sample1', statut: 'valide' },
            { id: 'L-2', titre: 'Reel Démonstration du produit', type: 'Reel / TikTok', url: 'https://instagram.com/reel/sample2', statut: 'valide' },
          ],

        // Rémunération & Avantages
        remuneration: {
          base: campaignToEdit.remuneration?.base || campaignToEdit.basePay || campaignToEdit.cachetBase || 1500000,
          variable: campaignToEdit.remuneration?.variable || 300000,
          avantages: campaignToEdit.remuneration?.avantages || campaignToEdit.avantages || 'Dotation forfait Pulse illimité 3 mois + Goodies Orange',
        },

        // Informations contractuelles
        contractInfo: {
          contratRef: campaignToEdit.contractInfo?.contratRef || `CTR-2026-${Math.floor(100 + Math.random() * 900)}`,
          exclusivite: campaignToEdit.contractInfo?.exclusivite || false,
          droitsImage: campaignToEdit.contractInfo?.droitsImage || 'Droits digitaux 12 mois - Réseaux sociaux Cameroun & CEMAC',
        }
      };
    } else {
      return {
        campaign: '',
        brand: 'Orange Cameroun',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        dates: '',
        status: 'terminee',
        networks: ['Instagram', 'TikTok'],
        contentTypes: ['Story', 'Reel / TikTok'],

        kpiReach: 100000,
        kpiTarget: 100000,
        impressions: 135000,
        kpiEngagement: 5.0,
        engagementTarget: 5.0,
        clicks: 3500,
        conversions: 420,
        salesVolume: 0,

        contentQuality: 4,
        onTime: true,
        variablePaid: 100,
        notesInternes: {
          noteGlobale: 4.5,
          fiabilite: 4,
          qualiteCollaboration: 4,
          respectDelais: 4,
          commentaire: 'Campagne exécutée en conformité avec la charte Orange.',
          pointsForts: 'Réactivité de l\'influenceur, engagement fidèle',
          axesAmelioration: 'Optimiser le CTA de fin de vidéo',
        },

        livrables: [
          { id: `L-${Date.now()}-1`, titre: 'Story Teaser', type: 'Story', url: '', statut: 'valide' },
          { id: `L-${Date.now()}-2`, titre: 'Reel promo', type: 'Reel / TikTok', url: '', statut: 'valide' },
        ],

        remuneration: {
          base: 1500000,
          variable: 300000,
          avantages: 'Forfait Pulse Data 5G offert + Kit Goodies',
        },

        contractInfo: {
          contratRef: `CTR-2026-${Math.floor(100 + Math.random() * 900)}`,
          exclusivite: false,
          droitsImage: 'Droits digitaux 12 mois - Territoire national Cameroun',
        }
      };
    }
  });

  if (!isOpen) return null;

  const handleNetworkToggle = (net) => {
    setForm(prev => {
      const exists = prev.networks.includes(net);
      const networks = exists ? prev.networks.filter(n => n !== net) : [...prev.networks, net];
      return { ...prev, networks };
    });
  };

  const handleContentTypeToggle = (t) => {
    setForm(prev => {
      const exists = prev.contentTypes.includes(t);
      const contentTypes = exists ? prev.contentTypes.filter(c => c !== t) : [...prev.contentTypes, t];
      return { ...prev, contentTypes };
    });
  };

  const handleAddLivrable = () => {
    setForm(prev => ({
      ...prev,
      livrables: [
        ...prev.livrables,
        { id: `L-${Date.now()}`, titre: 'Nouveau livrable', type: 'Story', url: '', statut: 'valide' }
      ]
    }));
  };

  const handleRemoveLivrable = (idx) => {
    setForm(prev => ({
      ...prev,
      livrables: prev.livrables.filter((_, i) => i !== idx)
    }));
  };

  const handleUpdateLivrable = (idx, field, val) => {
    setForm(prev => {
      const livrables = [...prev.livrables];
      livrables[idx] = { ...livrables[idx], [field]: val };
      return { ...prev, livrables };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.campaign.trim()) {
      alert('Veuillez saisir le nom de la campagne.');
      return;
    }

    const payload = {
      ...form,
      dates: form.dates || `${form.dateDebut} au ${form.dateFin}`,
      notesInternes: {
        ...form.notesInternes,
        pointsForts: typeof form.notesInternes.pointsForts === 'string'
          ? form.notesInternes.pointsForts.split(',').map(s => s.trim()).filter(Boolean)
          : form.notesInternes.pointsForts,
        axesAmelioration: typeof form.notesInternes.axesAmelioration === 'string'
          ? form.notesInternes.axesAmelioration.split(',').map(s => s.trim()).filter(Boolean)
          : form.notesInternes.axesAmelioration,
      }
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="inf-modal-overlay" onClick={onClose}>
      <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 780, maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="inf-modal-close" onClick={onClose}>✕</button>

        <div className="mb-16">
          <h2 className="text-xl font-bold text-dark">
            {isEditing ? `Modifier la campagne : ${form.campaign}` : `Ajouter une campagne historique pour @${influencer.pseudo || influencer.name}`}
          </h2>
          <p className="text-xs text-muted">
            Renseignez l'ensemble des indicateurs de performance, évaluations qualitatives, livrables et conditions contractuelles Orange Cameroun.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-20">
          {/* ── SECTION 1 : IDENTIFICATION DE LA CAMPAGNE ── */}
          <div className="p-16 rounded" style={{ background: '#fbfcfd', border: '1px solid #e1e4e8' }}>
            <h4 className="text-sm font-bold text-dark mb-12 flex items-center gap-6">
              🏷️ 1. IDENTIFICATION DE LA CAMPAGNE
            </h4>

            <div className="inf-edit-grid">
              <div>
                <label className="form-label">Nom de la campagne *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ex: Orange Weekend Mars, Pulse Jeunesse..."
                  value={form.campaign}
                  onChange={e => setForm({ ...form, campaign: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Marque / Produit Orange *</label>
                <select
                  className="form-input"
                  value={form.brand}
                  onChange={e => setForm({ ...form, brand: e.target.value })}
                >
                  {POPULAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Date de début</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.dateDebut}
                  onChange={e => setForm({ ...form, dateDebut: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Date de fin</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.dateFin}
                  onChange={e => setForm({ ...form, dateFin: e.target.value })}
                />
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Statut de la campagne</label>
                <div className="flex gap-12">
                  {[
                    { id: 'terminee', label: 'Terminée', color: '#27AE60' },
                    { id: 'en_cours', label: 'En cours', color: '#2980B9' },
                    { id: 'reportee', label: 'Reportée', color: '#F39C12' },
                    { id: 'annulee', label: 'Annulée', color: '#E74C3C' },
                  ].map(st => (
                    <label key={st.id} className="flex items-center gap-6 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="camp_status"
                        checked={form.status === st.id}
                        onChange={() => setForm({ ...form, status: st.id })}
                      />
                      <span className="font-semibold" style={{ color: st.color }}>{st.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Réseaux sociaux concernés</label>
                <div className="flex flex-wrap gap-6">
                  {AVAILABLE_NETWORKS.map(net => {
                    const active = form.networks.includes(net);
                    return (
                      <button
                        type="button"
                        key={net}
                        onClick={() => handleNetworkToggle(net)}
                        className={`tag cursor-pointer ${active ? 'tag-orange' : ''}`}
                        style={{
                          background: active ? '#FF7900' : '#f0f0f0',
                          color: active ? '#fff' : '#333',
                          border: 'none',
                          padding: '4px 10px'
                        }}
                      >
                        {net}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Types de contenus produits</label>
                <div className="flex flex-wrap gap-6">
                  {AVAILABLE_CONTENT_TYPES.map(ct => {
                    const active = form.contentTypes.includes(ct);
                    return (
                      <button
                        type="button"
                        key={ct}
                        onClick={() => handleContentTypeToggle(ct)}
                        className="tag cursor-pointer"
                        style={{
                          background: active ? '#2A2A3C' : '#f0f0f0',
                          color: active ? '#fff' : '#333',
                          border: 'none',
                          padding: '4px 10px'
                        }}
                      >
                        {ct}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2 : RÉSULTATS CHIFFRÉS ── */}
          <div className="p-16 rounded" style={{ background: '#fbfcfd', border: '1px solid #e1e4e8' }}>
            <h4 className="text-sm font-bold text-dark mb-12 flex items-center gap-6">
              📊 2. RÉSULTATS CHIFFRÉS (MÉTRIQUES DE PERFORMANCE)
            </h4>

            <div className="inf-edit-grid">
              <div>
                <label className="form-label">Portée obtenue (Reach)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.kpiReach}
                  onChange={e => setForm({ ...form, kpiReach: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Objectif de portée (Target Reach)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.kpiTarget}
                  onChange={e => setForm({ ...form, kpiTarget: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Impressions totales</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.impressions}
                  onChange={e => setForm({ ...form, impressions: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Taux d'engagement obtenu (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={form.kpiEngagement}
                  onChange={e => setForm({ ...form, kpiEngagement: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Cible de taux d'engagement (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={form.engagementTarget}
                  onChange={e => setForm({ ...form, engagementTarget: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Clics sortants (Stickers, liens bio)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.clicks}
                  onChange={e => setForm({ ...form, clicks: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Conversions / Activations de compte</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.conversions}
                  onChange={e => setForm({ ...form, conversions: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Ventes / CA généré (FCFA, optionnel)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.salesVolume}
                  onChange={e => setForm({ ...form, salesVolume: Number(e.target.value) })}
                  placeholder="ex: 3500000"
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 3 : ÉVALUATION QUALITATIVE ── */}
          <div className="p-16 rounded" style={{ background: '#fbfcfd', border: '1px solid #e1e4e8' }}>
            <h4 className="text-sm font-bold text-dark mb-12 flex items-center gap-6">
              📝 3. ÉVALUATION QUALITATIVE & COLLABORATION
            </h4>

            <div className="inf-edit-grid">
              <div>
                <label className="form-label">Note globale (1 à 5 ⭐)</label>
                <select
                  className="form-input font-bold text-orange"
                  value={form.notesInternes.noteGlobale}
                  onChange={e => setForm({
                    ...form,
                    contentQuality: Number(e.target.value),
                    notesInternes: { ...form.notesInternes, noteGlobale: Number(e.target.value) }
                  })}
                >
                  <option value={5}>5 / 5 ⭐ — Excellent</option>
                  <option value={4.5}>4.5 / 5 ⭐ — Très bon</option>
                  <option value={4}>4 / 5 ⭐ — Bon</option>
                  <option value={3.5}>3.5 / 5 ⭐ — Satisfaisant</option>
                  <option value={3}>3 / 5 ⭐ — Moyen</option>
                  <option value={2}>2 / 5 ⭐ — Insatisfaisant</option>
                  <option value={1}>1 / 5 ⭐ — Problématique</option>
                </select>
              </div>

              <div>
                <label className="form-label">Respect des délais</label>
                <select
                  className="form-input"
                  value={form.onTime ? 'true' : 'false'}
                  onChange={e => setForm({ ...form, onTime: e.target.value === 'true' })}
                >
                  <option value="true">✓ Délais respectés</option>
                  <option value="false">⚠️ Retard de livraison</option>
                </select>
              </div>

              <div>
                <label className="form-label">Qualité de collaboration (1 à 5)</label>
                <select
                  className="form-input"
                  value={form.notesInternes.qualiteCollaboration}
                  onChange={e => setForm({
                    ...form,
                    notesInternes: { ...form.notesInternes, qualiteCollaboration: Number(e.target.value) }
                  })}
                >
                  <option value={5}>5 - Très pro & disponible</option>
                  <option value={4}>4 - Bonne communication</option>
                  <option value={3}>3 - Correct</option>
                  <option value={2}>2 - Difficile à coordonner</option>
                  <option value={1}>1 - Pas professionnel</option>
                </select>
              </div>

              <div>
                <label className="form-label">Fiabilité éditoriale (1 à 5)</label>
                <select
                  className="form-input"
                  value={form.notesInternes.fiabilite}
                  onChange={e => setForm({
                    ...form,
                    notesInternes: { ...form.notesInternes, fiabilite: Number(e.target.value) }
                  })}
                >
                  <option value={5}>5 - Respect strict de la charte</option>
                  <option value={4}>4 - Conforme avec ajustements mineurs</option>
                  <option value={3}>3 - Révisions nécessaires</option>
                  <option value={2}>2 - Nombreux écarts de charte</option>
                  <option value={1}>1 - Non conforme</option>
                </select>
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Points forts constatés</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ex: Créativité des visuels, ton authentique, réactivité éditoriale"
                  value={form.notesInternes.pointsForts}
                  onChange={e => setForm({
                    ...form,
                    notesInternes: { ...form.notesInternes, pointsForts: e.target.value }
                  })}
                />
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Axes d'amélioration</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ex: Prévoir un cadrage son plus net, valider les stories 24h avant"
                  value={form.notesInternes.axesAmelioration}
                  onChange={e => setForm({
                    ...form,
                    notesInternes: { ...form.notesInternes, axesAmelioration: e.target.value }
                  })}
                />
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Commentaires de l'équipe (Avis confidentiel McCann / Orange)</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Notes détaillées sur le déroulement de la campagne, la réceptivité de la communauté et le suivi..."
                  value={form.notesInternes.commentaire}
                  onChange={e => setForm({
                    ...form,
                    notesInternes: { ...form.notesInternes, commentaire: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 4 : LIVRABLES RÉALISÉS ── */}
          <div className="p-16 rounded" style={{ background: '#fbfcfd', border: '1px solid #e1e4e8' }}>
            <div className="flex justify-between items-center mb-12">
              <h4 className="text-sm font-bold text-dark flex items-center gap-6">
                🎬 4. LIVRABLES RÉALISÉS & LIENS DES PUBLICATIONS
              </h4>
              <button
                type="button"
                className="btn btn-ghost btn-sm text-orange"
                onClick={handleAddLivrable}
              >
                <Plus size={14} /> Ajouter un livrable
              </button>
            </div>

            <div className="space-y-8">
              {form.livrables.map((liv, idx) => (
                <div key={idx} className="flex items-center gap-8 p-8 rounded bg-white border">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Titre du livrable..."
                    value={liv.titre}
                    onChange={e => handleUpdateLivrable(idx, 'titre', e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <select
                    className="form-input"
                    value={liv.type}
                    onChange={e => handleUpdateLivrable(idx, 'type', e.target.value)}
                    style={{ flex: 1.2 }}
                  >
                    {AVAILABLE_CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Lien vers la publication (URL)..."
                    value={liv.url || ''}
                    onChange={e => handleUpdateLivrable(idx, 'url', e.target.value)}
                    style={{ flex: 2.5 }}
                  />
                  <select
                    className="form-input"
                    value={liv.statut || 'valide'}
                    onChange={e => handleUpdateLivrable(idx, 'statut', e.target.value)}
                    style={{ flex: 1 }}
                  >
                    <option value="valide">Validé ✓</option>
                    <option value="livre">Livré</option>
                    <option value="en_cours">En cours</option>
                  </select>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-red"
                    onClick={() => handleRemoveLivrable(idx)}
                    title="Supprimer le livrable"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 5 : RÉMUNÉRATION & INFORMATIONS CONTRACTUELLES ── */}
          <div className="p-16 rounded" style={{ background: '#fbfcfd', border: '1px solid #e1e4e8' }}>
            <h4 className="text-sm font-bold text-dark mb-12 flex items-center gap-6">
              💰 5. RÉMUNÉRATION & CADRE CONTRACTUEL
            </h4>

            <div className="inf-edit-grid">
              <div>
                <label className="form-label">Cachet de base perçu (FCFA)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.remuneration.base}
                  onChange={e => setForm({
                    ...form,
                    remuneration: { ...form.remuneration, base: Number(e.target.value) }
                  })}
                />
              </div>

              <div>
                <label className="form-label">Part variable versée (FCFA)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.remuneration.variable}
                  onChange={e => setForm({
                    ...form,
                    remuneration: { ...form.remuneration, variable: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Avantages perçus / en nature</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ex: Forfait Pulse 5G illimité 6 mois, Smartphone de test, invitations VIP événements..."
                  value={form.remuneration.avantages}
                  onChange={e => setForm({
                    ...form,
                    remuneration: { ...form.remuneration, avantages: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="form-label">N° Réf Contrat / Avenant</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.contractInfo.contratRef}
                  onChange={e => setForm({
                    ...form,
                    contractInfo: { ...form.contractInfo, contratRef: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="form-label">Clause d'exclusivité secteur telco</label>
                <select
                  className="form-input"
                  value={form.contractInfo.exclusivite ? 'true' : 'false'}
                  onChange={e => setForm({
                    ...form,
                    contractInfo: { ...form.contractInfo, exclusivite: e.target.value === 'true' }
                  })}
                >
                  <option value="true">Oui — Exclusivité stricte</option>
                  <option value="false">Non — Non exclusive</option>
                </select>
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Cession des droits d'image</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.contractInfo.droitsImage}
                  onChange={e => setForm({
                    ...form,
                    contractInfo: { ...form.contractInfo, droitsImage: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-12 pt-16 border-t">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-orange">
              {isEditing ? 'Enregistrer les modifications' : 'Ajouter cette campagne'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
