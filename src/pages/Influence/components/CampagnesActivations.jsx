import React, { useState, useMemo } from 'react';
import { getDeliverableSnapshots } from '../InfluenceStore';
import { formatNumber, Badge } from './InfluenceCommon';
import CampaignModal from './CampaignModal';
import DeliverableModal from './DeliverableModal';
import { useApp } from '../../../context/AppContext';

export default function CampagnesActivations({
  data,
  setStatus,
  onOpenTalentProfile,
  onAddCampaign,
  onUpdateCampaign,
  onDeleteCampaign
}) {
  const [search, setSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  // AppContext pour synchronisation globale
  const {
    influencers = [],
    addInfluenceCampaign,
    updateInfluenceCampaign,
    deleteInfluenceCampaign
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    source_sheet: 'Orange Weekend',
    objective: '',
    status: 'Active',
    period: '',
    budget: '',
    selectedTalentNames: [],
    description: ''
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const snapshots = useMemo(() => getDeliverableSnapshots(data?.snapshots || []), [data?.snapshots]);

  // Filtrage strict : seules les campagnes nouvellement créées sont affichées, aucune donnée exemple
  const cleanCampaigns = useMemo(() => {
    return (data?.campaigns || []).filter(c =>
      c &&
      c.isNewlyCreated === true &&
      !c.isDemo &&
      !c.isExample &&
      !['CAMP-ORANGE-WEEKEND', 'CAMP-ORANGE-RELAY-2025', 'CAMP-ORANGE-Q4-2025', 'CAMP-001', 'CAMP-002', 'CAMP-003'].includes(c.id) &&
      !['Orange Weekend 2025', 'Relais Média & Webzines', 'Campagnes & Challenges Q4 2025'].includes(c.name) &&
      !c.id?.startsWith('mock-')
    );
  }, [data?.campaigns]);

  // Aggregate stats per campaign
  const campaignStats = useMemo(() => {
    return cleanCampaigns.map(camp => {
      const delivs = (data?.deliverables || []).filter(d => d.campaign_id === camp.id && !d.isDemo && !d.isExample);
      const talentSet = new Set([
        ...delivs.map(d => d.talent_id).filter(Boolean),
        ...(camp.talentNames || []).map(t => t)
      ]);
      let views = 0;
      let eng = 0;
      let hasViews = false;

      for (const d of delivs) {
        const s = snapshots.get(d.id);
        if (s) {
          if (s.views !== null && s.views !== undefined) {
            views += s.views;
            hasViews = true;
          }
          if (s.engagement_calculated) {
            eng += s.engagement_calculated;
          }
        }
      }

      return {
        camp,
        deliverablesCount: delivs.length,
        talentsCount: talentSet.size,
        views,
        hasViews,
        eng
      };
    });
  }, [cleanCampaigns, data?.deliverables, snapshots]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return campaignStats;
    return campaignStats.filter(c =>
      (c?.camp?.name || '').toLowerCase().includes(q) ||
      (c?.camp?.source_sheet || c?.camp?.entity || '').toLowerCase().includes(q) ||
      (c?.camp?.objective || '').toLowerCase().includes(q)
    );
  }, [campaignStats, search]);

  const totalDelivs = useMemo(() => {
    return filtered.reduce((acc, c) => acc + c.deliverablesCount, 0);
  }, [filtered]);

  const totalViews = useMemo(() => {
    return filtered.reduce((acc, c) => acc + c.views, 0);
  }, [filtered]);

  // Gestion de la modale de création / édition
  const handleOpenCreateModal = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      source_sheet: 'Orange Weekend',
      objective: '',
      status: 'Active',
      period: 'Septembre - Octobre 2026',
      budget: '',
      selectedTalentNames: [],
      description: ''
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (camp) => {
    setEditingCampaign(camp);
    setFormData({
      name: camp.name || '',
      source_sheet: camp.source_sheet || camp.entity || 'Orange Weekend',
      objective: camp.objective || '',
      status: camp.status || 'Active',
      period: camp.period || '',
      budget: camp.budget || camp.budgetEnveloppe || '',
      selectedTalentNames: Array.isArray(camp.talentNames) ? camp.talentNames : [],
      description: camp.description || ''
    });
    setIsFormModalOpen(true);
  };

  const handleSaveCampaign = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      id: editingCampaign ? editingCampaign.id : `CAMP-${Date.now().toString().slice(-6)}`,
      name: formData.name.trim(),
      source_sheet: formData.source_sheet || 'Orange Cameroun',
      entity: formData.source_sheet || 'Orange Cameroun',
      objective: formData.objective.trim(),
      status: formData.status || 'Active',
      period: formData.period.trim(),
      budget: formData.budget.trim(),
      budgetEnveloppe: formData.budget.trim(),
      talentNames: formData.selectedTalentNames,
      description: formData.description.trim(),
      isNewlyCreated: true,
      isReal: true,
      isDemo: false,
      isExample: false,
      created_at: editingCampaign?.created_at || new Date().toISOString()
    };

    if (editingCampaign) {
      if (onUpdateCampaign) onUpdateCampaign(editingCampaign.id, payload);
      if (updateInfluenceCampaign) updateInfluenceCampaign(editingCampaign.id, payload);
    } else {
      if (onAddCampaign) onAddCampaign(payload);
      if (addInfluenceCampaign) addInfluenceCampaign(payload);
    }

    setIsFormModalOpen(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (campaignId) => {
    if (onDeleteCampaign) onDeleteCampaign(campaignId);
    if (deleteInfluenceCampaign) deleteInfluenceCampaign(campaignId);
    setDeleteConfirmId(null);
    if (selectedCampaign?.id === campaignId) setSelectedCampaign(null);
  };

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* En-tête & Filtres Style Dashboard Analytics */}
      <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0, letterSpacing: '-0.3px' }}>
                CAMPAGNES & ACTIVATIONS COMMERCIALES
              </h2>
              <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
                {filtered.length} dispositif(s)
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Pilotage des activations réelles Orange Cameroun orchestrées par les créateurs de contenu
            </p>
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Livrables associés :</span>{' '}
              <strong style={{ fontSize: 13, color: 'var(--dark)' }}>{totalDelivs}</strong>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '1px solid #E5E7EB', paddingLeft: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Vues cumulées :</span>{' '}
              <strong style={{ fontSize: 13, color: '#FF7900' }}>
                {totalViews > 0 ? formatNumber(totalViews) : '0'}
              </strong>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenCreateModal}
              style={{
                fontSize: 12.5,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8
              }}
            >
              <span>➕</span> Nouvelle Campagne / Activation
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div style={{ maxWidth: 460 }}>
          <input
            className="form-input"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            placeholder="🔍 Rechercher une campagne ou une activation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des campagnes */}
      <div className="card p-0" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', marginBottom: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Campagne / Activation
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Dispositif / Gamme
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Talents Mobilisés
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Livrables Suivis
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Vues Mesurées
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Engagements
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Statut
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--muted)' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🗂</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--dark)' }}>
                      {search ? 'Aucune campagne ne correspond à votre recherche.' : 'Aucune campagne en cours enregistrée.'}
                    </div>
                    <p style={{ margin: '6px 0 16px', fontSize: 12, color: 'var(--muted)' }}>
                      {search ? 'Modifiez votre filtre pour afficher des résultats.' : 'Toutes les données exemples ont été supprimées. Seules les campagnes nouvellement créées apparaîtront ici.'}
                    </p>
                    {!search && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleOpenCreateModal}
                        style={{ fontSize: 12, fontWeight: 700 }}
                      >
                        ➕ Enregistrer une Première Campagne
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(({ camp, deliverablesCount, talentsCount, views, hasViews, eng }, idx) => (
                  <tr
                    key={camp.id}
                    style={{
                      borderBottom: '1px solid #F0F0F0',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF8F2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--dark)' }}>{camp.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {camp.period ? `📅 ${camp.period}` : 'Dispositif Orange Cameroun'}
                        {camp.objective ? ` · ${camp.objective}` : ''}
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', fontSize: 11.5, color: 'var(--muted)' }}>
                      <span className="tag tag-orange" style={{ fontSize: 10.5 }}>
                        {camp.source_sheet || camp.entity || 'Orange Weekend'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span className="tag tag-blue" style={{ fontSize: 11 }}>
                        {talentsCount ? `${talentsCount} talent(s)` : 'Non spécifié'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--dark)' }}>
                      {deliverablesCount}
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 700, color: hasViews ? '#FF7900' : 'var(--muted)' }}>
                      {hasViews ? formatNumber(views) : '—'}
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 700, color: eng > 0 ? '#27AE60' : 'var(--muted)' }}>
                      {eng > 0 ? formatNumber(eng) : '—'}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span
                        className="tag"
                        style={{
                          fontSize: 10,
                          background: camp.status === 'Active' ? '#ECFDF5' : '#F1F5F9',
                          color: camp.status === 'Active' ? '#059669' : '#64748B',
                          border: camp.status === 'Active' ? '1px solid #A7F3D0' : '1px solid #CBD5E1'
                        }}
                      >
                        ● {camp.status || 'Active'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setSelectedCampaign(camp)}
                          style={{ border: '1px solid #D0D0D0', fontSize: 11 }}
                          title="Consulter les détails"
                        >
                          Consulter →
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleOpenEditModal(camp)}
                          style={{ border: '1px solid #E2E8F0', fontSize: 11, color: '#334155' }}
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeleteConfirmId(camp.id)}
                          style={{ border: '1px solid #FCA5A5', fontSize: 11, color: '#DC2626' }}
                          title="Supprimer la campagne"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODALE CRÉATION & MODIFICATION D'UNE CAMPAGNE / ACTIVATION ─── */}
      {isFormModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFormModalOpen(false);
          }}
        >
          <div
            className="card animate-fade"
            style={{
              width: '100%',
              maxWidth: 640,
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 14,
              padding: 24,
              background: '#FFFFFF',
              boxShadow: '0 20px 48px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E7EB', paddingBottom: 14, marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--dark)' }}>
                  {editingCampaign ? '✏️ Modifier la Campagne / Activation' : '➕ Nouvelle Campagne / Activation Commerciale'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                  Enregistrement certifié d'une nouvelle opération marketing Orange Cameroun
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsFormModalOpen(false)}
                style={{ fontSize: 16, color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCampaign}>
              {/* Nom de la campagne */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                  Nom de la Campagne / Activation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Orange Pulse Gaming Tour 2026, Promo Ramadan Orange Money..."
                  className="form-input"
                  style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 13 }}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Dispositif & Statut */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                    Dispositif / Gamme Commerciale *
                  </label>
                  <select
                    className="form-input"
                    style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 12.5 }}
                    value={formData.source_sheet}
                    onChange={e => setFormData({ ...formData, source_sheet: e.target.value })}
                  >
                    <option value="Orange Weekend">Orange Weekend (Forfaits Data)</option>
                    <option value="Orange Pulse">Orange Pulse (Jeunesse & Gaming)</option>
                    <option value="Orange Money">Orange Money & Otélé</option>
                    <option value="Orange Business">Orange Business (B2B & Cloud)</option>
                    <option value="Max It">Application Max It</option>
                    <option value="O'Ambassadeurs">O'Ambassadeurs (Réseau Ambassadeurs)</option>
                    <option value="Marque & RSE">Image de Marque & RSE</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                    Statut de la Campagne
                  </label>
                  <select
                    className="form-input"
                    style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 12.5 }}
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">🟢 Active / En cours d'exécution</option>
                    <option value="En préparation">🟡 En préparation / Cadrage</option>
                    <option value="Terminée">⚪ Terminée</option>
                    <option value="En bilan">🔵 En bilan & Reporting</option>
                  </select>
                </div>
              </div>

              {/* Période & Budget */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                    Période d'activation
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Du 15 Octobre au 15 Novembre 2026"
                    className="form-input"
                    style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 12.5 }}
                    value={formData.period}
                    onChange={e => setFormData({ ...formData, period: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                    Enveloppe Budgétaire
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : 12 500 000 FCFA"
                    className="form-input"
                    style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 12.5 }}
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              {/* Objectif principal */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                  Objectif Stratégique / Business
                </label>
                <input
                  type="text"
                  placeholder="Ex : Recruter 50 000 souscripteurs forfaits Maxi Pulse et stimuler les transferts OM"
                  className="form-input"
                  style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 12.5 }}
                  value={formData.objective}
                  onChange={e => setFormData({ ...formData, objective: e.target.value })}
                />
              </div>

              {/* Talents mobilisés */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                  Talents & Influenceurs Associés ({formData.selectedTalentNames.length} sélectionné(s))
                </label>
                <div
                  style={{
                    maxHeight: 140,
                    overflowY: 'auto',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    padding: '8px 12px',
                    background: '#FAFAFC',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 6
                  }}
                >
                  {(influencers || []).map(inf => {
                    const name = inf.name || inf.pseudo || inf.display_name;
                    const isChecked = formData.selectedTalentNames.includes(name);
                    return (
                      <label
                        key={inf.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12,
                          color: '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                selectedTalentNames: [...formData.selectedTalentNames, name]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedTalentNames: formData.selectedTalentNames.filter(n => n !== name)
                              });
                            }
                          }}
                          style={{ accentColor: '#FF7900' }}
                        />
                        <span>{inf.pseudo || name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Description & Notes */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                  Consignes & Périmètre éditorial
                </label>
                <textarea
                  rows={3}
                  className="form-input"
                  style={{ width: '100%', borderRadius: 6, fontSize: 12.5, padding: '8px 10px' }}
                  placeholder="Notes de cadrage, canaux prioritaires (TikTok, Instagram), livrables attendus..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Boutons d'action */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid #E5E7EB' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsFormModalOpen(false)}
                  style={{ fontSize: 12.5 }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: 12.5, fontWeight: 800, padding: '8px 20px' }}
                >
                  {editingCampaign ? 'Enregistrer les modifications' : 'Créer la Campagne'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
        >
          <div className="card p-24" style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 12 }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
              Supprimer cette campagne ?
            </h4>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'var(--muted)' }}>
              Cette action retirera définitivement cette campagne de la liste des activations en cours.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setDeleteConfirmId(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#DC2626', color: '#fff', fontWeight: 700 }}
                onClick={() => handleDeleteCampaign(deleteConfirmId)}
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          data={data}
          snaps={snapshots}
          onClose={() => setSelectedCampaign(null)}
          onSelectDeliverable={d => setSelectedDeliverable(d)}
          onOpenDeliverable={d => setSelectedDeliverable(d)}
          onOpenTalentProfile={onOpenTalentProfile}
        />
      )}

      {selectedDeliverable && (
        <DeliverableModal
          deliverable={selectedDeliverable}
          data={data}
          setStatus={setStatus}
          onClose={() => setSelectedDeliverable(null)}
        />
      )}
    </div>
  );
}
