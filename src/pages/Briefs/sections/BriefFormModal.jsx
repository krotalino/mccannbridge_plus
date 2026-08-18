import { useState } from 'react';
import { BRIEF_TYPOLOGIES, ORANGE_SPONSORS, MCCANN_TEAM_MEMBERS, BRIEF_TEMPLATE_ORANGE_TALK } from '../../../data/briefs';
import { useApp } from '../../../context/AppContext';

export default function BriefFormModal({ isOpen, onClose, editingBrief = null }) {
  const { addBrief, updateBrief } = useApp();
  const [activeTab, setActiveTab] = useState('A');

  // Initial State Form
  const [formData, setFormData] = useState(() => {
    if (editingBrief) {
      return { ...editingBrief };
    }
    return {
      title: '',
      typology: 'Plateforme Web',
      submissionDate: new Date().toISOString().split('T')[0],
      goLiveDate: '',
      budget: '',
      budgetConfidential: false,
      timelineFrequency: '',
      sponsors: [
        { name: 'Lauriane NGAMENI', role: 'Chef de Projet Digital', phone: '699 94 54 97', email: 'lauriane.ngameni@orange.cm' },
      ],
      contacts: '699 94 54 97',
      assignedTeam: ['victor', 'georges', 'serge'],
      marketBackground: '',
      projectContext: '',
      targetPersonas: ['Jeunes 18-35 ans', 'Étudiants', 'Jeunes actifs'],
      currentBrandAwareness: '',
      userJourney: '',
      mechanicsSteps: [
        "Identification de l'abonné (Login / SSO Orange ou vérification OTP SMS rapide).",
        "Module d'enregistrement audio (Voice Note) natif web HTML5 Audio.",
        "Back-office de modération et d'extraction des audios pour la régie radio.",
      ],
      specificFeatures: [
        { id: 'f1', label: "Formulaire d'enregistrement vocal natif web (Voice Note)", checked: true, status: 'Spécifié' },
        { id: 'f2', label: "Intégration API & Back-office d'extraction Régie Radio", checked: true, status: 'Spécifié' },
        { id: 'f3', label: "Système de Modération des contenus & RGPD", checked: true, status: 'Spécifié' },
        { id: 'f4', label: "Player Audio interactif avec Waveform", checked: true, status: 'Spécifié' },
        { id: 'f5', label: "Bouton de partage direct WhatsApp & Réseaux Sociaux", checked: true, status: 'Spécifié' },
      ],
      ecosystem: ['TikTok', 'Instagram', 'Facebook', 'WhatsApp'],
      objectives: [
        'Notoriété et préférence de marque',
        'Engagement digital fort',
        'Création de communauté participative',
      ],
      kpis: '',
      toneAndVoice: '',
      mandatories: [
        { label: "Respect strict de la charte graphique Orange (Brand Center 2026)", checked: true },
        { label: "Cohérence cross-canal TV / Digital / Radio", checked: true },
        { label: "RGPD & Protection des données personnelles", checked: true },
        { label: "Optimisation mobile-first (temps de chargement < 2.2s)", checked: true },
      ],
      deliverables: [
        { label: "Maquettes UX/UI (Figma)", checked: true, progress: 0, done: false },
        { label: "Développement Front-end & Back-end", checked: true, progress: 0, done: false },
        { label: "Hébergement et configuration serveur haute capacité", checked: true, progress: 0, done: false },
        { label: "Recette et tests UAT avec PV de conformité", checked: true, progress: 0, done: false },
        { label: "Kit de communication Social Media", checked: true, progress: 0, done: false },
      ],
      figmaUrl: '',
      jiraUrl: '',
      stagingUrl: '',
      liveUrl: '',
    };
  });

  const [newStepText, setNewStepText] = useState('');
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newPersonaText, setNewPersonaText] = useState('');

  if (!isOpen) return null;

  const handleLoadOrangeTalkPreset = () => {
    setFormData({
      ...formData,
      ...BRIEF_TEMPLATE_ORANGE_TALK,
      submissionDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleToggleEcosystem = (channel) => {
    const list = formData.ecosystem || [];
    if (list.includes(channel)) {
      setFormData({ ...formData, ecosystem: list.filter(c => c !== channel) });
    } else {
      setFormData({ ...formData, ecosystem: [...list, channel] });
    }
  };

  const handleToggleObjective = (obj) => {
    const list = formData.objectives || [];
    if (list.includes(obj)) {
      setFormData({ ...formData, objectives: list.filter(o => o !== obj) });
    } else {
      setFormData({ ...formData, objectives: [...list, obj] });
    }
  };

  const handleAddPersona = () => {
    if (!newPersonaText.trim()) return;
    setFormData({
      ...formData,
      targetPersonas: [...(formData.targetPersonas || []), newPersonaText.trim()],
    });
    setNewPersonaText('');
  };

  const handleRemovePersona = (index) => {
    setFormData({
      ...formData,
      targetPersonas: formData.targetPersonas.filter((_, i) => i !== index),
    });
  };

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    setFormData({
      ...formData,
      mechanicsSteps: [...(formData.mechanicsSteps || []), newStepText.trim()],
    });
    setNewStepText('');
  };

  const handleRemoveStep = (index) => {
    setFormData({
      ...formData,
      mechanicsSteps: formData.mechanicsSteps.filter((_, i) => i !== index),
    });
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const newFeat = {
      id: 'f_' + Date.now(),
      label: newFeatureText.trim(),
      checked: true,
      status: 'À développer',
    };
    setFormData({
      ...formData,
      specificFeatures: [...(formData.specificFeatures || []), newFeat],
    });
    setNewFeatureText('');
  };

  const handleToggleMandatory = (index) => {
    const updated = [...formData.mandatories];
    updated[index].checked = !updated[index].checked;
    setFormData({ ...formData, mandatories: updated });
  };

  const handleToggleDeliverable = (index) => {
    const updated = [...formData.deliverables];
    updated[index].checked = !updated[index].checked;
    setFormData({ ...formData, deliverables: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Veuillez renseigner le nom du projet.');
      setActiveTab('A');
      return;
    }

    if (editingBrief) {
      updateBrief(editingBrief.id, formData);
    } else {
      const newBriefId = `BR-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
      const newBrief = {
        id: newBriefId,
        ...formData,
        status: 'submitted',
        subStatus: 'Soumis pour Analyse',
        progress: 15,
        budget: Number(formData.budget) || 15000000,
        milestones: [
          { id: 'm1', title: 'Cadrage & Spécifications Tech', percentage: 20, owner: 'Victor F. AKOA', dueDate: formData.goLiveDate ? '2026-04-10' : '', status: 'in_progress' },
          { id: 'm2', title: 'Maquettes UX/UI Wireframes', percentage: 0, owner: 'Georges BAKOUME', dueDate: '', status: 'upcoming' },
          { id: 'm3', title: 'Développement Front/Back', percentage: 0, owner: 'Serge NDJOCK', dueDate: '', status: 'upcoming' },
          { id: 'm4', title: 'Recette UAT Client', percentage: 0, owner: 'Équipe Orange', dueDate: '', status: 'upcoming' },
          { id: 'm5', title: 'Go-Live Officiel', percentage: 0, owner: 'Équipe McCann × Orange', dueDate: formData.goLiveDate, status: 'upcoming' },
        ],
        assets: [],
        comments: [
          {
            id: 'c_' + Date.now(),
            author: 'Système Bridge',
            role: 'Notification',
            team: 'orange',
            avatar: 'OR',
            fieldTarget: 'Création du Brief',
            text: `Brief créé et soumis avec succès par ${formData.sponsors?.[0]?.name || 'le client Orange'}. Notifié aux équipes McCann.`,
            timestamp: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
            resolved: true,
          }
        ],
        createdAt: new Date().toISOString(),
      };
      addBrief(newBrief);
    }
    onClose();
  };

  const tabs = [
    { id: 'A', label: 'A. Général & Porteurs', icon: '👤', sub: 'Projet, Typologie & Sponsors' },
    { id: 'B', label: 'B. Contexte Stratégique', icon: '🎯', sub: 'Enjeux, Cible & Notoriété' },
    { id: 'C', label: 'C. Mécanique & Spécifications', icon: '⚙️', sub: 'User Journey, Features & Canaux' },
    { id: 'D', label: 'D. Objectifs & KPIs', icon: '📈', sub: 'Succès mesurable & Tonalité' },
    { id: 'E', label: 'E. Contraintes & Budget', icon: '💰', sub: 'Mandatories, Livrables & Liens' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-brief-lg" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid #e8e8e8', padding: '18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: 'var(--orange)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700
            }}>
              📋
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--dark)' }}>
                {editingBrief ? `Modifier le Brief — ${editingBrief.id}` : 'Nouveau Formulaire de Brief de Projet'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>McCann Douala × Orange Cameroun</span>
                <span>•</span>
                <span style={{ color: 'var(--orange)', fontWeight: 600 }}>Cahier des charges standardisé</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!editingBrief && (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: 12, padding: '6px 12px' }}
                onClick={handleLoadOrangeTalkPreset}
                title="Pré-remplir avec le cas d'usage de référence Orange Talk"
              >
                ⚡ Modèle Référence "ORANGE TALK"
              </button>
            )}
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Tab Stepper Bar */}
        <div className="brief-stepper-tabs">
          {tabs.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              className={`brief-step-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="step-num">{t.id}</span>
              <div className="step-labels">
                <span className="step-title">{t.label}</span>
                <span className="step-sub">{t.sub}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            
            {/* ────────── SECTION A : INFORMATIONS GÉNÉRALES & PORTEURS DU PROJET ────────── */}
            {activeTab === 'A' && (
              <div className="animate-fade">
                <div className="brief-section-banner">
                  <span className="section-badge">Section A</span>
                  <div>
                    <h3 className="section-title">Informations Générales & Porteurs du Projet</h3>
                    <p className="section-desc">Identifiez le nom du projet, sa typologie digitale, l'équipe sponsor côté Orange et les dates clés.</p>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group full-width">
                    <label className="form-label required">1. Nom du Projet</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="ex. ORANGE TALK — Plateforme d’écoute & Voice Notes Radio"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">2. Typologie du Brief</label>
                    <select
                      className="form-select"
                      value={formData.typology}
                      onChange={e => setFormData({ ...formData, typology: e.target.value })}
                    >
                      {BRIEF_TYPOLOGIES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">3. Date de soumission</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.submissionDate}
                      onChange={e => setFormData({ ...formData, submissionDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">4. Date de lancement souhaitée (Go-Live)</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={formData.goLiveDate}
                      onChange={e => setFormData({ ...formData, goLiveDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contacts & Téléphones d'urgence</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ex. 699 94 54 97 / 699 94 86 61"
                      value={formData.contacts}
                      onChange={e => setFormData({ ...formData, contacts: e.target.value })}
                    />
                  </div>
                </div>

                {/* Sponsors Orange Selection */}
                <div style={{ marginTop: 20 }}>
                  <label className="form-label" style={{ marginBottom: 10 }}>5. Équipe Cliente (Sponsors Orange Cameroun)</label>
                  <div className="sponsors-grid">
                    {ORANGE_SPONSORS.map(sp => {
                      const isSelected = (formData.sponsors || []).some(s => s.email === sp.email || s.name === sp.name);
                      return (
                        <div
                          key={sp.id}
                          className={`sponsor-select-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            if (isSelected) {
                              setFormData({
                                ...formData,
                                sponsors: formData.sponsors.filter(s => s.email !== sp.email && s.name !== sp.name),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                sponsors: [...(formData.sponsors || []), { name: sp.name, role: sp.role, phone: sp.phone, email: sp.email }],
                              });
                            }
                          }}
                        >
                          <div className="sponsor-avatar">{sp.avatar}</div>
                          <div style={{ flex: 1 }}>
                            <div className="sponsor-name">{sp.name}</div>
                            <div className="sponsor-role">{sp.role}</div>
                            <div className="sponsor-phone">📞 {sp.phone}</div>
                          </div>
                          <div className="sponsor-checkbox">{isSelected ? '✓' : ''}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* McCann Agency Team Selection */}
                <div style={{ marginTop: 20 }}>
                  <label className="form-label" style={{ marginBottom: 10 }}>Équipe Agence Assignée (McCann Douala)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {MCCANN_TEAM_MEMBERS.map(m => {
                      const isAssigned = (formData.assignedTeam || []).includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          className={`tag ${isAssigned ? 'tag-orange' : 'tag-muted'}`}
                          style={{ cursor: 'pointer', padding: '6px 12px', fontSize: 12 }}
                          onClick={() => {
                            if (isAssigned) {
                              setFormData({
                                ...formData,
                                assignedTeam: (formData.assignedTeam || []).filter(id => id !== m.id),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                assignedTeam: [...(formData.assignedTeam || []), m.id],
                              });
                            }
                          }}
                        >
                          <span style={{ fontWeight: 700, marginRight: 4 }}>{m.avatar}</span>
                          {m.name} ({m.role}) {isAssigned ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ────────── SECTION B : CONTEXTE STRATÉGIQUE (LE "POURQUOI") ────────── */}
            {activeTab === 'B' && (
              <div className="animate-fade">
                <div className="brief-section-banner">
                  <span className="section-badge">Section B</span>
                  <div>
                    <h3 className="section-title">Contexte Stratégique (Le "Pourquoi")</h3>
                    <p className="section-desc">Définissez les enjeux marché, le contexte du projet, les cibles personas et la perception de la marque.</p>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label required">1. Background / Enjeux Marché</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    required
                    placeholder="Expliquez la situation de marché, les opportunités concurrentielles ou le déclencheur de la demande..."
                    value={formData.marketBackground}
                    onChange={e => setFormData({ ...formData, marketBackground: e.target.value })}
                  />
                  <span className="form-hint">Ex: Bataille de notoriété sur le terrain du contenu et de l'engagement jeune...</span>
                </div>

                <div className="form-group full-width" style={{ marginTop: 16 }}>
                  <label className="form-label required">2. Contexte du Projet</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    required
                    placeholder="Décrivez l'initiative, le programme média ou l'offre commerciale sous-jacente..."
                    value={formData.projectContext}
                    onChange={e => setFormData({ ...formData, projectContext: e.target.value })}
                  />
                  <span className="form-hint">Ex: Programme radio articulé autour des problématiques du quotidien des abonnés, synchronisé avec la plateforme web...</span>
                </div>

                <div className="form-group full-width" style={{ marginTop: 16 }}>
                  <label className="form-label">3. Cible (Personas)</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ajouter une cible (ex. Jeunes 18-35 ans, Étudiants, Jeunes actifs...)"
                      value={newPersonaText}
                      onChange={e => setNewPersonaText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddPersona(); } }}
                    />
                    <button type="button" className="btn btn-secondary" onClick={handleAddPersona}>+ Ajouter</button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(formData.targetPersonas || []).map((persona, idx) => (
                      <span key={idx} className="tag tag-blue" style={{ fontSize: 13, padding: '4px 10px' }}>
                        🎯 {persona}
                        <button
                          type="button"
                          onClick={() => handleRemovePersona(idx)}
                          style={{ marginLeft: 6, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width" style={{ marginTop: 16 }}>
                  <label className="form-label">4. Niveau de Notoriété Actuel</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Niveau de notoriété existant et objectifs d'évolution (ex. Forte notoriété opérateur, besoin de renforcer la notoriété émotionnelle et l'utilité perçue)..."
                    value={formData.currentBrandAwareness}
                    onChange={e => setFormData({ ...formData, currentBrandAwareness: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* ────────── SECTION C : MÉCANIQUE & SPÉCIFICATIONS WEB (LE "COMMENT") ────────── */}
            {activeTab === 'C' && (
              <div className="animate-fade">
                <div className="brief-section-banner">
                  <span className="section-badge">Section C</span>
                  <div>
                    <h3 className="section-title">Mécanique & Spécifications Web (Le "Comment")</h3>
                    <p className="section-desc">Détaillez le parcours utilisateur (User Journey), les étapes mécaniques, les fonctionnalités spécifiques et l'écosystème digital.</p>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label required">1. Tâche à accomplir (User Journey)</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    required
                    placeholder="Comment l'utilisateur découvre, interagit et convertit sur la plateforme..."
                    value={formData.userJourney}
                    onChange={e => setFormData({ ...formData, userJourney: e.target.value })}
                  />
                  <span className="form-hint">Ex: L'abonné découvre le thème radio via les réseaux sociaux, accède à la plateforme web sur mobile, s'identifie, enregistre sa note vocale (Voice Note 90s), réécoute et valide sa participation.</span>
                </div>

                <div className="form-group full-width" style={{ marginTop: 16 }}>
                  <label className="form-label">2. Mécanique détaillée (Étapes clés)</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ajouter une étape mécanique (ex. Identification SSO, Enregistrement audio, Modération...)"
                      value={newStepText}
                      onChange={e => setNewStepText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddStep(); } }}
                    />
                    <button type="button" className="btn btn-secondary" onClick={handleAddStep}>+ Ajouter</button>
                  </div>

                  <div className="mechanics-steps-list">
                    {(formData.mechanicsSteps || []).map((step, idx) => (
                      <div key={idx} className="mechanic-step-item">
                        <div className="step-badge">{idx + 1}</div>
                        <div className="step-text">{step}</div>
                        <button
                          type="button"
                          className="step-delete"
                          onClick={() => handleRemoveStep(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width" style={{ marginTop: 16 }}>
                  <label className="form-label">3. Fonctionnalités Spécifiques à explorer</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ajouter une fonctionnalité spécifique..."
                      value={newFeatureText}
                      onChange={e => setNewFeatureText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                    />
                    <button type="button" className="btn btn-secondary" onClick={handleAddFeature}>+ Ajouter</button>
                  </div>

                  <div className="features-checklist">
                    {(formData.specificFeatures || []).map((feat, idx) => (
                      <label key={feat.id || idx} className="feature-check-item">
                        <input
                          type="checkbox"
                          checked={feat.checked}
                          onChange={() => {
                            const updated = [...formData.specificFeatures];
                            updated[idx].checked = !updated[idx].checked;
                            setFormData({ ...formData, specificFeatures: updated });
                          }}
                        />
                        <span style={{ flex: 1, fontWeight: 600 }}>{feat.label}</span>
                        <span className="tag tag-muted" style={{ fontSize: 11 }}>{feat.status || 'Spécifié'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width" style={{ marginTop: 16 }}>
                  <label className="form-label">4. Écosystème Digital (Plateformes & Canaux Connexes)</label>
                  <div className="ecosystem-pills">
                    {['TikTok', 'Instagram', 'Facebook', 'YouTube', 'X', 'LinkedIn', 'WhatsApp', 'Site Web Orange'].map(ch => {
                      const isSelected = (formData.ecosystem || []).includes(ch);
                      return (
                        <button
                          key={ch}
                          type="button"
                          className={`eco-pill ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleToggleEcosystem(ch)}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ────────── SECTION D : OBJECTIFS & KPIS (LE "SUCCÈS") ────────── */}
            {activeTab === 'D' && (
              <div className="animate-fade">
                <div className="brief-section-banner">
                  <span className="section-badge">Section D</span>
                  <div>
                    <h3 className="section-title">Objectifs & KPIs (Le "Succès")</h3>
                    <p className="section-desc">Précisez les objectifs stratégiques, les indicateurs clés de succès (KPIs) et le positionnement éditorial.</p>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">1. Objectifs de haut niveau (Sélection multiple)</label>
                  <div className="objectives-grid">
                    {[
                      'Notoriété et préférence de marque',
                      'Engagement digital fort',
                      'Création de communauté participative',
                      'Amplification d’un événement (Radio/TV)',
                      'Génération de leads / Téléchargements',
                      'Collecte de données (Opt-in marketing)',
                      'Conversion & Vente de forfaits / Cartes',
                    ].map(obj => {
                      const isSelected = (formData.objectives || []).includes(obj);
                      return (
                        <div
                          key={obj}
                          className={`objective-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleToggleObjective(obj)}
                        >
                          <span className="obj-checkbox">{isSelected ? '✓' : ''}</span>
                          <span className="obj-text">{obj}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group full-width" style={{ marginTop: 16 }}>
                  <label className="form-label required">2. KPIs de Succès (À quoi ressemble le succès ?)</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    required
                    placeholder="Chiffres cibles, métriques quantitatives et qualitatives..."
                    value={formData.kpis}
                    onChange={e => setFormData({ ...formData, kpis: e.target.value })}
                  />
                  <span className="form-hint">Ex: Plus de 15 000 notes vocales enregistrées en saison 1. Croissance de +35% de l'engagement social media...</span>
                </div>

                <div className="form-group full-width" style={{ marginTop: 16 }}>
                  <label className="form-label">3. Ton & Positionnement</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="ex. Jeune, accessible, inspirant, empathique et bienveillant. Facilitateur d'opportunités..."
                    value={formData.toneAndVoice}
                    onChange={e => setFormData({ ...formData, toneAndVoice: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* ────────── SECTION E : CONTRAINTES, LIVRABLES & BUDGET ────────── */}
            {activeTab === 'E' && (
              <div className="animate-fade">
                <div className="brief-section-banner">
                  <span className="section-badge">Section E</span>
                  <div>
                    <h3 className="section-title">Contraintes, Livrables & Budget</h3>
                    <p className="section-desc">Validez les mandatories stricts Orange, la liste des livrables agence, l'enveloppe budgétaire et les liens de suivi.</p>
                  </div>
                </div>

                {/* Mandatories */}
                <div className="form-group full-width">
                  <label className="form-label">1. Mandatories (Contraintes strictes)</label>
                  <div className="mandatories-list">
                    {(formData.mandatories || []).map((m, idx) => (
                      <label key={idx} className="mandatory-item">
                        <input
                          type="checkbox"
                          checked={m.checked}
                          onChange={() => handleToggleMandatory(idx)}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{m.label}</span>
                        <span className="mandatory-tag">Mandatory</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div className="form-group full-width" style={{ marginTop: 16 }}>
                  <label className="form-label">2. Livrables attendus de l'agence McCann</label>
                  <div className="deliverables-checklist">
                    {(formData.deliverables || []).map((d, idx) => (
                      <label key={idx} className="deliverable-item">
                        <input
                          type="checkbox"
                          checked={d.checked}
                          onChange={() => handleToggleDeliverable(idx)}
                        />
                        <span style={{ flex: 1, fontWeight: 600 }}>{d.label}</span>
                        <span className="tag tag-orange" style={{ fontSize: 11 }}>Attendu</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget & Timeline */}
                <div className="form-grid-2" style={{ marginTop: 16 }}>
                  <div className="form-group">
                    <label className="form-label">3. Budget Alloué (FCFA)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="ex. 18500000"
                      value={formData.budget}
                      onChange={e => setFormData({ ...formData, budget: e.target.value })}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.budgetConfidential}
                        onChange={e => setFormData({ ...formData, budgetConfidential: e.target.checked })}
                      />
                      Budget confidentiel (accès restreint Management)
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">4. Timeline & Fréquence de déploiement</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ex. Production hebdomadaire, Go-Live 05/11/2026"
                      value={formData.timelineFrequency}
                      onChange={e => setFormData({ ...formData, timelineFrequency: e.target.value })}
                    />
                  </div>
                </div>

                {/* Direct Tracking Links */}
                <div style={{ marginTop: 20 }}>
                  <label className="form-label" style={{ marginBottom: 8 }}>5. Liens de Suivi Direct (Optionnel)</label>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label style={{ fontSize: 12, color: 'var(--muted)' }}>🎨 Lien Maquette Figma</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://figma.com/@mccann-orange/..."
                        value={formData.figmaUrl || ''}
                        onChange={e => setFormData({ ...formData, figmaUrl: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: 12, color: 'var(--muted)' }}>🎫 Lien Jira / Tickets Dev</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://jira.mccann.cm/browse/..."
                        value={formData.jiraUrl || ''}
                        onChange={e => setFormData({ ...formData, jiraUrl: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: 12, color: 'var(--muted)' }}>🧪 URL Recette Staging</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://staging.orange.cm/..."
                        value={formData.stagingUrl || ''}
                        onChange={e => setFormData({ ...formData, stagingUrl: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: 12, color: 'var(--muted)' }}>🚀 URL Production Live</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://orange.cm/..."
                        value={formData.liveUrl || ''}
                        onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Controls */}
          <div className="modal-footer" style={{ borderTop: '1px solid #e8e8e8', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
            <div>
              {activeTab !== 'A' && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    const order = ['A', 'B', 'C', 'D', 'E'];
                    const currentIdx = order.indexOf(activeTab);
                    if (currentIdx > 0) setActiveTab(order[currentIdx - 1]);
                  }}
                >
                  ← Précédent
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Annuler
              </button>

              {activeTab !== 'E' ? (
                <button
                  type="button"
                  className="btn btn-orange"
                  onClick={() => {
                    const order = ['A', 'B', 'C', 'D', 'E'];
                    const currentIdx = order.indexOf(activeTab);
                    if (currentIdx < order.length - 1) setActiveTab(order[currentIdx + 1]);
                  }}
                >
                  Suivant →
                </button>
              ) : (
                <button type="submit" className="btn btn-orange" style={{ padding: '10px 24px', fontSize: 14 }}>
                  {editingBrief ? '💾 Enregistrer les modifications' : '🚀 Soumettre le Brief à l’Agence'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
