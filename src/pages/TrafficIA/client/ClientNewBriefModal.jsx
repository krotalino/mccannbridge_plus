import React, { useState } from 'react';
import { X, Plus, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ClientNewBriefModal({ isOpen, onClose, onSubmitBrief }) {
  const [formData, setFormData] = useState({
    title: '',
    brand: 'Orange Cameroun (Telco)',
    context: '',
    businessGoal: '',
    comGoal: '',
    aarrr: 'Activation',
    targetAudience: 'Grand Public & Utilisateurs Data',
    keyMessage: '',
    mandatoryCta: '',
    legalMentions: '',
    channels: ['Facebook', 'Instagram'],
    deliverables: '',
    budget: '',
    urgency: 'P1 - Normal / Planifié',
    desiredDeadline: '',
    orangeValidator: 'Patrick Tuete (Head of Digital Marketing)',
    referenceLinks: '',
  });

  const availableChannels = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'X (Twitter)', 'YouTube', 'WhatsApp Bot', 'CRM Push / SMS'];

  if (!isOpen) return null;

  const handleChannelToggle = (ch) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(ch)
        ? prev.channels.filter(c => c !== ch)
        : [...prev.channels, ch],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Veuillez renseigner au minimum le titre du sujet.');
      return;
    }
    onSubmitBrief(formData);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 780,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 14,
          background: '#FFFFFF',
          padding: '24px 28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📝</span>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
                NOUVEAU BRIEF STRUCTURÉ ORANGE
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 12 }}>
              Formulaire de cadrage paritaire conforme au cahier des charges Septembre 2026
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          {/* Section 1: Contexte & Titre */}
          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: 13, fontWeight: 900, color: '#1E293B', margin: '0 0 10px 0' }}>
              1. Contexte & Enjeu Métier
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Titre du sujet / Nom de l’opération *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Campagne Promo OM Rentrée — Formats Verticaux"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Marque / Entité Orange
                </label>
                <select
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, fontWeight: 700 }}
                >
                  <option value="Orange Cameroun (Telco)">Orange Cameroun (Telco)</option>
                  <option value="Orange Money (OM)">Orange Money (OM)</option>
                  <option value="Orange Business (B2B)">Orange Business (B2B)</option>
                  <option value="Orange Pulse (Jeunes)">Orange Pulse (Jeunes)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                Contexte et enjeu spécifique
              </label>
              <textarea
                rows={2}
                placeholder="Décrivez l'enjeu commercial, l'offre sous-jacente ou le constat de départ..."
                value={formData.context}
                onChange={e => setFormData({ ...formData, context: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
              />
            </div>
          </div>

          {/* Section 2: Objectifs & AARRR */}
          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: 13, fontWeight: 900, color: '#1E293B', margin: '0 0 10px 0' }}>
              2. Objectifs & Cadre AARRR
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Cadre AARRR
                </label>
                <select
                  value={formData.aarrr}
                  onChange={e => setFormData({ ...formData, aarrr: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, fontWeight: 700 }}
                >
                  <option value="Acquisition">Acquisition (Nouveaux clients)</option>
                  <option value="Activation">Activation (Premier usage / téléchargement)</option>
                  <option value="Rétention">Rétention (Fidélisation & récurrence)</option>
                  <option value="Revenu">Revenu (Panier moyen / recharge)</option>
                  <option value="Référence">Référence (Recommandation & Image)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Cible prioritaire
                </label>
                <input
                  type="text"
                  placeholder="Ex : Jeunes 18-25 ans, PME, Marchands..."
                  value={formData.targetAudience}
                  onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Objectif de communication
                </label>
                <input
                  type="text"
                  placeholder="Ex : Notoriété de la baisse des frais"
                  value={formData.comGoal}
                  onChange={e => setFormData({ ...formData, comGoal: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Messages, CTA & Mentions */}
          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: 13, fontWeight: 900, color: '#1E293B', margin: '0 0 10px 0' }}>
              3. Message Obligatoire, CTA & Mentions Légales
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Message clé obligatoire
                </label>
                <input
                  type="text"
                  placeholder="Ex : Transférez sans stress avec 0 frais cachés"
                  value={formData.keyMessage}
                  onChange={e => setFormData({ ...formData, keyMessage: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Call to Action (CTA) impératif
                </label>
                <input
                  type="text"
                  placeholder="Ex : Composez le #150*1# ou cliquez ici"
                  value={formData.mandatoryCta}
                  onChange={e => setFormData({ ...formData, mandatoryCta: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                Mentions légales obligatoires
              </label>
              <input
                type="text"
                placeholder="Ex : Voir conditions tarifaires en agence et sur le site orange.cm"
                value={formData.legalMentions}
                onChange={e => setFormData({ ...formData, legalMentions: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
              />
            </div>
          </div>

          {/* Section 4: Canaux concernés & Livrables */}
          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: 13, fontWeight: 900, color: '#1E293B', margin: '0 0 10px 0' }}>
              4. Canaux de Diffusion & Livrables Attendus
            </h4>

            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 6, color: '#374151' }}>
                Canaux ciblés (Sélectionnez les plateformes)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {availableChannels.map(ch => {
                  const isChecked = formData.channels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => handleChannelToggle(ch)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 800,
                        border: isChecked ? '1px solid #FF7900' : '1px solid #D1D5DB',
                        background: isChecked ? '#FFF3E0' : '#FFFFFF',
                        color: isChecked ? '#E65100' : '#4B5563',
                        cursor: 'pointer',
                      }}
                    >
                      {isChecked ? '✓ ' : '+ '}{ch}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                Livrables attendus (formats & résolutions)
              </label>
              <input
                type="text"
                placeholder="Ex : 1 Vidéo 15s 9:16 + 2 visuels statiques 1:1 + 1 bannière 1200x628"
                value={formData.deliverables}
                onChange={e => setFormData({ ...formData, deliverables: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
              />
            </div>
          </div>

          {/* Section 5: Planning, Validateur & Urgence */}
          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: 13, fontWeight: 900, color: '#1E293B', margin: '0 0 10px 0' }}>
              5. Planning, Validateur Orange & Niveau d’Urgence
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Niveau d’urgence
                </label>
                <select
                  value={formData.urgency}
                  onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, fontWeight: 700 }}
                >
                  <option value="P0 - Urgent (Campagne spontanée 24-48h)">P0 - Urgent (Spontané 24-48h)</option>
                  <option value="P1 - Normal / Planifié">P1 - Normal (Planning contractuel)</option>
                  <option value="P2 - Récurrent / Veille">P2 - Récurrent / Veille</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Date souhaitée de livraison
                </label>
                <input
                  type="date"
                  value={formData.desiredDeadline}
                  onChange={e => setFormData({ ...formData, desiredDeadline: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                  Validateur Orange désigné
                </label>
                <input
                  type="text"
                  value={formData.orangeValidator}
                  onChange={e => setFormData({ ...formData, orangeValidator: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, paddingTop: 12, borderTop: '1px solid #E5E7EB' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              style={{ fontSize: 12, fontWeight: 800 }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                fontSize: 12,
                fontWeight: 900,
                background: '#FF7900',
                border: 'none',
                padding: '8px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <CheckCircle2 size={16} />
              <span>Transmettre le Brief à McCann Douala</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
