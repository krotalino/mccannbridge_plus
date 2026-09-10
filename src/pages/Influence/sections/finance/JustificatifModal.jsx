import { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

export default function JustificatifModal({ isOpen, onClose, onSave, influencer, campaigns = [], contracts = [] }) {
  const [formData, setFormData] = useState({
    type: 'contrat_signe', // 'contrat_signe' | 'facture' | 'preuve_livraison' | 'rapport_campagne' | 'justificatif_publication' | 'rib' | 'cni' | 'autre'
    titre: '',
    campagne: campaigns[0]?.campaign || 'Orange Weekend Mars',
    contratRef: contracts[0]?.id || 'CTR-001',
    dateAjout: new Date().toISOString().split('T')[0],
    fichierNom: '',
    fichierTaille: '1.2 Mo',
    statutValidation: 'valide', // 'en_attente' | 'valide' | 'rejete'
    commentaire: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFormData(prev => ({
        ...prev,
        fichierNom: file.name,
        fichierTaille: `${sizeMb} Mo`,
        titre: prev.titre || file.name.replace(/\.[^/.]+$/, "")
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fichierNom && !selectedFile) {
      alert('Veuillez sélectionner un fichier à téléverser.');
      return;
    }

    const payload = {
      id: `DOC-${Date.now().toString().slice(-6)}`,
      ...formData,
      fichierNom: formData.fichierNom || selectedFile?.name || 'document_justificatif.pdf',
      titre: formData.titre || formData.fichierNom || 'Justificatif',
      statutValidation: formData.statutValidation || 'en_attente',
      dateAjout: formData.dateAjout || new Date().toISOString().split('T')[0],
      validePar: formData.statutValidation === 'valide' ? 'Equipe Finance McCann' : null
    };

    onSave(payload);
  };

  return (
    <div className="inf-modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: 16
    }}>
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 540,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
        }}
      >
        <div className="flex justify-between items-center pb-12 mb-16 border-b">
          <div className="flex items-center gap-10">
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: 'rgba(255, 121, 0, 0.12)',
              color: 'var(--orange, #FF7900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark m-0">Ajouter une Pièce Justificative</h3>
              <p className="text-xs text-muted m-0">
                Pour l'influenceur : <strong>@{influencer?.pseudo || influencer?.name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm p-4"
            onClick={onClose}
            style={{ color: '#888' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type de pièce justificative */}
          <div className="mb-14">
            <label className="block text-xs font-bold text-dark mb-4">Type de pièce justificative *</label>
            <select
              className="form-input w-full text-xs font-semibold"
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
              required
            >
              <option value="contrat_signe">📑 Contrat signé (Paraphé & Daté)</option>
              <option value="facture">💰 Facture émise par le créateur</option>
              <option value="preuve_livraison">📦 Preuve de livraison (Goodies, kits, cartes SIM)</option>
              <option value="rapport_campagne">📊 Rapport de fin de campagne / Performance</option>
              <option value="justificatif_publication">📸 Justificatif de publication (Captures d'écran, Statistiques Réseaux)</option>
              <option value="rib">🏦 Relevé d'Identité Bancaire (RIB) / Attestation de compte</option>
              <option value="cni">🪪 CNI / Passeport / Titre de séjour</option>
              <option value="autre">📎 Autre pièce justificative</option>
            </select>
          </div>

          {/* Intitulé du document */}
          <div className="mb-14">
            <label className="block text-xs font-bold text-dark mb-4">Libellé / Titre de la pièce *</label>
            <input
              type="text"
              className="form-input w-full text-xs font-semibold"
              placeholder="ex: Contrat signé Partenariat Orange Money T1"
              value={formData.titre}
              onChange={e => setFormData(prev => ({ ...prev, titre: e.target.value }))}
              required
            />
          </div>

          {/* Campagne & Réf contrat */}
          <div className="grid grid-2 gap-12 mb-14">
            <div>
              <label className="block text-xs font-bold text-dark mb-4">Campagne rattachée</label>
              <select
                className="form-input w-full text-xs"
                value={formData.campagne}
                onChange={e => setFormData(prev => ({ ...prev, campagne: e.target.value }))}
              >
                <option value="">-- Non rattaché à une campagne --</option>
                {campaigns.map((c, i) => (
                  <option key={c.id || i} value={c.campaign || c.name}>
                    {c.campaign || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark mb-4">Contrat lié</label>
              <select
                className="form-input w-full text-xs"
                value={formData.contratRef}
                onChange={e => setFormData(prev => ({ ...prev, contratRef: e.target.value }))}
              >
                <option value="">-- Non rattaché à un contrat --</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} ({c.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fichier joint & zone d'import */}
          <div className="mb-14">
            <label className="block text-xs font-bold text-dark mb-4">Fichier joint (PDF, JPG, PNG, DOCX) *</label>
            <div className="border-2 border-dashed rounded p-16 text-center" style={{ borderColor: '#d1d5db', background: '#fafafa' }}>
              <input
                type="file"
                id="justificatif_upload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                onChange={handleFileChange}
              />
              <label htmlFor="justificatif_upload" className="cursor-pointer block">
                <UploadCloud size={32} className="mx-auto mb-8 text-orange" style={{ color: 'var(--orange, #FF7900)' }} />
                <div className="text-xs font-bold text-dark mb-2">
                  {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner ou glissez le document ici'}
                </div>
                <div className="text-xxs text-muted">Formats acceptés : PDF, PNG, JPG, DOCX (Max 15 Mo)</div>
              </label>
            </div>
          </div>

          {/* Statut de validation */}
          <div className="mb-14">
            <label className="block text-xs font-bold text-dark mb-4">Statut de conformité / validation</label>
            <div className="grid grid-3 gap-8">
              {[
                { id: 'valide', label: 'Validé / Conforme ✓', color: 'var(--green, #27AE60)', bg: 'rgba(39,174,96,0.1)' },
                { id: 'en_attente', label: 'En attente de vérification ⏳', color: 'var(--orange, #FF7900)', bg: 'rgba(255,121,0,0.1)' },
                { id: 'rejete', label: 'Rejeté / Incomplet ✕', color: 'var(--red, #E74C3C)', bg: 'rgba(231,76,60,0.1)' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, statutValidation: st.id }))}
                  className="p-8 rounded text-left border text-xs font-semibold"
                  style={{
                    borderColor: formData.statutValidation === st.id ? st.color : '#e5e7eb',
                    background: formData.statutValidation === st.id ? st.bg : '#fff',
                    color: formData.statutValidation === st.id ? st.color : '#4b5563'
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Commentaire optionnel */}
          <div className="mb-20">
            <label className="block text-xs font-bold text-dark mb-4">Observations / Note de validation</label>
            <input
              type="text"
              className="form-input w-full text-xs"
              placeholder="ex: Document conforme vérifié par la cellule juridique & marque"
              value={formData.commentaire}
              onChange={e => setFormData(prev => ({ ...prev, commentaire: e.target.value }))}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-10 pt-12 border-t">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-orange btn-sm flex items-center gap-6"
              style={{ background: 'var(--orange, #FF7900)', color: '#fff' }}
            >
              <CheckCircle2 size={16} />
              <span>Enregistrer le justificatif</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
