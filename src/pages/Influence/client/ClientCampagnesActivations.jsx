import React, { useState, useMemo } from 'react';

export default function ClientCampagnesActivations({
  campaigns = [],
  talents = [],
  onSelectCampaign,
  onNavigateTab,
  selectedEntity = 'all',
  onAddCampaign,
  onUpdateCampaign,
  onDeleteCampaign
}) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    entity: 'Orange Weekend',
    status: 'Active',
    period: 'Octobre - Décembre 2026',
    budgetEnveloppe: '',
    objective: '',
    commObjective: '',
    keyMessage: '',
    cta: '',
    mandatoryMentions: '#OrangeCameroun #Partenariat',
    selectedTalentNames: [],
    description: ''
  });

  const filteredCampaigns = useMemo(() => {
    let list = campaigns;
    if (selectedEntity !== 'all') {
      list = list.filter(c => (c.entity === selectedEntity || c.source_sheet === selectedEntity));
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.entity || c.source_sheet || '').toLowerCase().includes(q) ||
        (c.objective || c.businessObjective || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [campaigns, selectedEntity, search]);

  const handleOpenCreateModal = () => {
    setEditingCamp(null);
    setFormData({
      name: '',
      entity: selectedEntity !== 'all' ? selectedEntity : 'Orange Weekend',
      status: 'Active',
      period: 'Octobre - Décembre 2026',
      budgetEnveloppe: '',
      objective: '',
      commObjective: '',
      keyMessage: '',
      cta: '',
      mandatoryMentions: '#OrangeCameroun #Partenariat',
      selectedTalentNames: [],
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (camp) => {
    setEditingCamp(camp);
    const existingTalents = Array.isArray(camp.talentNames)
      ? camp.talentNames
      : (Array.isArray(camp.selectedTalents) ? camp.selectedTalents.map(t => t.name) : []);

    setFormData({
      name: camp.name || '',
      entity: camp.entity || camp.source_sheet || 'Orange Weekend',
      status: camp.status || 'Active',
      period: camp.period || '',
      budgetEnveloppe: camp.budgetEnveloppe || camp.budget || '',
      objective: camp.businessObjective || camp.objective || '',
      commObjective: camp.commObjective || '',
      keyMessage: camp.keyMessage || '',
      cta: camp.cta || '',
      mandatoryMentions: camp.mandatoryMentions || '#OrangeCameroun #Partenariat',
      selectedTalentNames: existingTalents,
      description: camp.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      id: editingCamp ? editingCamp.id : `CAMP-${Date.now().toString().slice(-6)}`,
      name: formData.name.trim(),
      entity: formData.entity,
      entityLabel: formData.entity,
      source_sheet: formData.entity,
      status: formData.status,
      period: formData.period.trim(),
      budget: formData.budgetEnveloppe.trim(),
      budgetEnveloppe: formData.budgetEnveloppe.trim(),
      objective: formData.objective.trim(),
      businessObjective: formData.objective.trim(),
      commObjective: formData.commObjective.trim(),
      keyMessage: formData.keyMessage.trim(),
      cta: formData.cta.trim(),
      mandatoryMentions: formData.mandatoryMentions.trim(),
      talentNames: formData.selectedTalentNames,
      selectedTalents: formData.selectedTalentNames.map(name => ({
        name,
        role: 'Créateur certifié Orange'
      })),
      description: formData.description.trim(),
      isNewlyCreated: true,
      isReal: true,
      isDemo: false,
      isExample: false,
      created_at: editingCamp?.created_at || new Date().toISOString()
    };

    if (editingCamp) {
      if (onUpdateCampaign) onUpdateCampaign(editingCamp.id, payload);
    } else {
      if (onAddCampaign) onAddCampaign(payload);
    }

    setIsModalOpen(false);
    setEditingCamp(null);
  };

  const handleDelete = (id) => {
    if (onDeleteCampaign) onDeleteCampaign(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-fade">
      {/* ─── EN-TÊTE DU PORTEFEUILLE DES CAMPAGNES ─── */}
      <div
        className="card"
        style={{
          borderRadius: 14,
          padding: '16px 20px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🗂</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                Portefeuille des Campagnes & Activations Influence
              </h3>
              <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                {filteredCampaigns.length} opération(s) active(s)
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Vision unifiée : qui publie quoi, pour quelle campagne, avec quel statut et quel ROI
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('calendrier')}
              style={{
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>📅</span> Calendrier Global
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreateModal}
              style={{
                fontSize: 12,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8
              }}
            >
              <span>➕</span> Nouvelle Campagne
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div style={{ marginTop: 14, maxWidth: 420 }}>
          <input
            type="text"
            className="form-input"
            style={{ height: 36, fontSize: 12, borderRadius: 6, width: '100%' }}
            placeholder="🔍 Filtrer les activations par mot-clé, talent, objectif..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ─── LISTE DÉTAILLÉE DES CAMPAGNES ─── */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div
            className="card"
            style={{
              borderRadius: 14,
              padding: '48px 20px',
              background: '#FFFFFF',
              border: '1px dashed #CBD5E1',
              textAlign: 'center',
              color: 'var(--muted)'
            }}
          >
            <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>🗂</span>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
              {search ? 'Aucune campagne ne correspond à votre recherche' : 'Aucune campagne en cours enregistrée'}
            </h4>
            <p style={{ margin: '6px 0 16px', fontSize: 12.5, color: 'var(--muted)' }}>
              {search
                ? 'Essayez de modifier votre requête ou de réinitialiser le filtre.'
                : 'Toutes les données exemples ont été supprimées. Seules les campagnes nouvellement créées apparaîtront ici.'}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenCreateModal}
              style={{ fontSize: 12.5, fontWeight: 800, padding: '8px 18px', borderRadius: 8 }}
            >
              ➕ Enregistrer une Nouvelle Campagne
            </button>
          </div>
        ) : (
          filteredCampaigns.map((camp) => {
            const entityLabel = camp.entityLabel || camp.entity || camp.source_sheet || 'Orange Cameroun';
            const statusLabel = camp.statusLabel || camp.status || 'Active';
            const talentsList = Array.isArray(camp.selectedTalents) && camp.selectedTalents.length > 0
              ? camp.selectedTalents
              : (Array.isArray(camp.talentNames) ? camp.talentNames.map(n => ({ name: n, role: 'Créateur sélectionné' })) : []);
            const budgetVal = camp.budgetEnveloppe || camp.budget || '';

            return (
              <div
                key={camp.id}
                className="card"
                style={{
                  borderRadius: 14,
                  padding: '20px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  marginBottom: 16
                }}
              >
                {/* Ligne 1 : Nom, Entité, Période, Statut & Actions rapides */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 12,
                    paddingBottom: 14,
                    borderBottom: '1px solid #F1F5F9',
                    marginBottom: 14
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                        {entityLabel}
                      </span>
                      {camp.period && (
                        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                          📅 {camp.period}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 12,
                          background: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0'
                        }}
                      >
                        ● {statusLabel}
                      </span>
                    </div>

                    <h4 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--dark)' }}>
                      {camp.name}
                    </h4>
                  </div>

                  {/* Enveloppe budgétaire & Actions modifier / supprimer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {budgetVal && (
                      <div
                        style={{
                          textAlign: 'right',
                          padding: '6px 12px',
                          borderRadius: 8,
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0'
                        }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                          Enveloppe
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                          {budgetVal}
                        </div>
                      </div>
                    )}

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
                      title="Supprimer"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Ligne 2 : Objectifs Business & Communication */}
                {(camp.businessObjective || camp.commObjective || camp.objective || camp.description) && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: 14,
                      marginBottom: 14
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: 8,
                        background: '#F8FAFC',
                        border: '1px solid #F1F5F9'
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>
                        🎯 Objectif Principal :
                      </div>
                      <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                        {camp.businessObjective || camp.objective || camp.description || 'Notoriété et engagement'}
                      </div>
                    </div>

                    {camp.commObjective && (
                      <div
                        style={{
                          padding: '12px 14px',
                          borderRadius: 8,
                          background: '#F8FAFC',
                          border: '1px solid #F1F5F9'
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>
                          📢 Objectif Communication :
                        </div>
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                          {camp.commObjective}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Ligne 3 : Message Clé, CTA & Mentions */}
                {(camp.keyMessage || camp.cta || camp.mandatoryMentions) && (
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: '#FFF9F5',
                      border: '1px solid #FFE4D0',
                      marginBottom: 14
                    }}
                  >
                    {camp.keyMessage && (
                      <div style={{ fontSize: 12, color: '#334155', marginBottom: 6 }}>
                        <strong>Message Clé :</strong> « {camp.keyMessage} »
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: '#64748B', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      {camp.cta && <span><strong>CTA :</strong> {camp.cta}</span>}
                      {camp.mandatoryMentions && <span><strong>Mentions :</strong> {camp.mandatoryMentions}</span>}
                    </div>
                  </div>
                )}

                {/* Ligne 4 : Talents mobilisés */}
                {talentsList.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                      Talents sélectionnés & Rôles dans la campagne ({talentsList.length}) :
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
                      {talentsList.map((t, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '8px 10px',
                            borderRadius: 6,
                            background: '#F1F5F9',
                            fontSize: 11,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <span style={{ fontWeight: 800, color: '#1E293B' }}>{t.name}</span>
                          <span style={{ color: 'var(--muted)' }}>•</span>
                          <span style={{ color: '#475569' }}>{t.role || 'Créateur actif'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ligne 5 : Progression des Livrables & Action */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 12,
                    borderTop: '1px solid #F1F5F9',
                    flexWrap: 'wrap',
                    gap: 12
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    Statut du dispositif : <strong style={{ color: 'var(--dark)' }}>{statusLabel}</strong>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectCampaign(camp)}
                      style={{
                        fontWeight: 700,
                        fontSize: 11,
                        background: '#FFF3E8',
                        color: '#E65100',
                        border: '1px solid #FFD8BE'
                      }}
                    >
                      Détails de la Campagne →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── MODALE DE CRÉATION & ÉDITION D'UNE CAMPAGNE ─── */}
      {isModalOpen && (
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
            if (e.target === e.currentTarget) setIsModalOpen(false);
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
                  {editingCamp ? '✏️ Modifier la Campagne / Activation' : '➕ Nouvelle Campagne / Activation'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                  Enregistrement d'un dispositif officiel Orange Cameroun
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsModalOpen(false)}
                style={{ fontSize: 16, color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                  Nom de la Campagne / Activation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Orange Pulse Back to School, Maxi Forfaits Week-end..."
                  className="form-input"
                  style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 13 }}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                    Gamme / Entité Orange *
                  </label>
                  <select
                    className="form-input"
                    style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 12.5 }}
                    value={formData.entity}
                    onChange={e => setFormData({ ...formData, entity: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                    Période d'activation
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Du 1er Novembre au 31 Décembre 2026"
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
                    placeholder="Ex : 15 000 000 FCFA"
                    className="form-input"
                    style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 12.5 }}
                    value={formData.budgetEnveloppe}
                    onChange={e => setFormData({ ...formData, budgetEnveloppe: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                  Objectif Stratégique / Business
                </label>
                <input
                  type="text"
                  placeholder="Ex : Recruter 30 000 souscripteurs forfaits Maxi Pulse et stimuler l'usage OM"
                  className="form-input"
                  style={{ width: '100%', height: 40, borderRadius: 6, fontSize: 12.5 }}
                  value={formData.objective}
                  onChange={e => setFormData({ ...formData, objective: e.target.value })}
                />
              </div>

              {/* Talents mobilisés */}
              {talents && talents.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                    Talents associés ({formData.selectedTalentNames.length} sélectionné(s))
                  </label>
                  <div
                    style={{
                      maxHeight: 130,
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
                    {talents.map(inf => {
                      const name = inf.name || inf.displayName || inf.pseudo || inf.display_name;
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
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                  Consignes & Périmètre éditorial
                </label>
                <textarea
                  rows={2}
                  className="form-input"
                  style={{ width: '100%', borderRadius: 6, fontSize: 12.5, padding: '8px 10px' }}
                  placeholder="Notes de cadrage, canaux prioritaires, livrables attendus..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid #E5E7EB' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                  style={{ fontSize: 12.5 }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: 12.5, fontWeight: 800, padding: '8px 20px' }}
                >
                  {editingCamp ? 'Enregistrer les modifications' : 'Créer la Campagne'}
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
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
