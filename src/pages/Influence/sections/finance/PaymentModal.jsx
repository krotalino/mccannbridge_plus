import { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, FileText, CheckCircle2, ShieldAlert, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../../../utils/helpers.js';

export default function PaymentModal({ isOpen, onClose, onSave, influencer, initialPayment = null, campaigns = [], contracts = [] }) {
  const [formData, setFormData] = useState({
    id: '',
    type: 'avance', // 'avance' | 'solde' | 'echeance' | 'bonus' | 'penalite'
    campagne: '',
    contratRef: '',
    montant: '',
    date: new Date().toISOString().split('T')[0],
    modePaiement: 'Virement bancaire',
    reference: '',
    statut: 'paye', // 'paye' | 'en_attente'
    notes: '',
    motifBonusPenalite: '',
  });

  useEffect(() => {
    if (initialPayment) {
      setFormData({
        id: initialPayment.id || '',
        type: initialPayment.type || 'solde',
        campagne: initialPayment.campagne || (campaigns[0]?.campaign || ''),
        contratRef: initialPayment.contratRef || (contracts[0]?.id || ''),
        montant: initialPayment.montant || '',
        date: initialPayment.date || new Date().toISOString().split('T')[0],
        modePaiement: initialPayment.modePaiement || 'Virement bancaire',
        reference: initialPayment.reference || '',
        statut: initialPayment.statut || 'paye',
        notes: initialPayment.notes || '',
        motifBonusPenalite: initialPayment.motifBonusPenalite || '',
      });
    } else {
      setFormData({
        id: `PAY-${Date.now().toString().slice(-6)}`,
        type: 'avance',
        campagne: campaigns[0]?.campaign || (contracts[0]?.campagne || 'Campagne en cours'),
        contratRef: contracts[0]?.id || '',
        montant: '',
        date: new Date().toISOString().split('T')[0],
        modePaiement: contracts[0]?.modalitesPaiement?.toLowerCase().includes('orange money') ? 'Orange Money' : 'Virement bancaire',
        reference: `VIR-${Date.now().toString().slice(-6)}`,
        statut: 'paye',
        notes: '',
        motifBonusPenalite: '',
      });
    }
  }, [initialPayment, isOpen, influencer, campaigns, contracts]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.montant || Number(formData.montant) <= 0) {
      alert('Veuillez saisir un montant valide supérieur à 0.');
      return;
    }
    if (!formData.campagne) {
      alert('Veuillez sélectionner ou renseigner la campagne concernée.');
      return;
    }

    onSave({
      ...formData,
      montant: Number(formData.montant),
      reference: formData.reference || `REF-${Date.now().toString().slice(-6)}`
    });
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
          maxWidth: 580,
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
              justifyContent: 'center',
              fontWeight: 800
            }}>
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark m-0">
                {initialPayment ? 'Modifier le Versement' : 'Enregistrer un Versement'}
              </h3>
              <p className="text-xs text-muted m-0">
                Bénéficiaire : <strong>@{influencer?.pseudo || influencer?.name}</strong> ({influencer?.realName || 'Créateur'})
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
          {/* Type d'opération financière */}
          <div className="mb-14">
            <label className="block text-xs font-bold text-dark mb-6">Type d'opération financière *</label>
            <div className="grid grid-3 gap-8">
              {[
                { id: 'avance', label: 'Avance / Acompte', icon: '⚡' },
                { id: 'solde', label: 'Règlement de Solde', icon: '🏁' },
                { id: 'echeance', label: 'Échéance prévue', icon: '📅' },
                { id: 'bonus', label: 'Prime / Bonus', icon: '🎁' },
                { id: 'penalite', label: 'Retenue / Pénalité', icon: '⚠️' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: item.id }))}
                  className="p-8 rounded text-left border text-xs font-semibold flex items-center gap-6"
                  style={{
                    background: formData.type === item.id ? 'rgba(255,121,0,0.1)' : '#fff',
                    borderColor: formData.type === item.id ? 'var(--orange, #FF7900)' : '#e5e7eb',
                    color: formData.type === item.id ? 'var(--orange, #FF7900)' : '#374151',
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Campagne & Référence Contrat */}
          <div className="grid grid-2 gap-12 mb-14">
            <div>
              <label className="block text-xs font-bold text-dark mb-4">Campagne associée *</label>
              <select
                className="form-input w-full text-xs font-semibold"
                value={formData.campagne}
                onChange={e => setFormData(prev => ({ ...prev, campagne: e.target.value }))}
                required
              >
                <option value="">-- Sélectionner une campagne --</option>
                {campaigns.map((c, idx) => (
                  <option key={c.id || idx} value={c.campaign || c.name}>
                    {c.campaign || c.name} ({c.brand || 'Orange'})
                  </option>
                ))}
                {campaigns.length === 0 && (
                  <option value="Campagne Orange Digitale">Campagne Orange Digitale</option>
                )}
                <option value="Partenariat Annuel Ambassadeur">Partenariat Annuel Ambassadeur</option>
                <option value="Autre prestation ponctuelle">Autre prestation ponctuelle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark mb-4">Réf. Contrat (optionnel)</label>
              <select
                className="form-input w-full text-xs"
                value={formData.contratRef}
                onChange={e => setFormData(prev => ({ ...prev, contratRef: e.target.value }))}
              >
                <option value="">-- Non rattaché --</option>
                {contracts.map((ctr) => (
                  <option key={ctr.id} value={ctr.id}>
                    {ctr.id} — {ctr.type || 'Contrat'} ({formatCurrency(ctr.montant || 0)})
                  </option>
                ))}
                {contracts.length === 0 && <option value="CTR-001">CTR-001 (Par défaut)</option>}
              </select>
            </div>
          </div>

          {/* Montant & Date */}
          <div className="grid grid-2 gap-12 mb-14">
            <div>
              <label className="block text-xs font-bold text-dark mb-4">Montant (en FCFA) *</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="ex: 1250000"
                  className="form-input w-full font-bold text-sm"
                  value={formData.montant}
                  onChange={e => setFormData(prev => ({ ...prev, montant: e.target.value }))}
                  required
                />
                <span className="absolute right-10 top-8 text-xs text-muted font-bold pointer-events-none">
                  FCFA
                </span>
              </div>
              {formData.montant > 0 && (
                <div className="text-xs text-green mt-4 font-semibold">
                  = {formatCurrency(Number(formData.montant))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-dark mb-4">Date de règlement / valeur *</label>
              <input
                type="date"
                className="form-input w-full text-xs font-semibold"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Mode de paiement & Référence transaction */}
          <div className="grid grid-2 gap-12 mb-14">
            <div>
              <label className="block text-xs font-bold text-dark mb-4">Mode de règlement *</label>
              <select
                className="form-input w-full text-xs font-semibold"
                value={formData.modePaiement}
                onChange={e => setFormData(prev => ({ ...prev, modePaiement: e.target.value }))}
              >
                <option value="Virement bancaire">🏦 Virement bancaire (UBA / Afriland / BICEC)</option>
                <option value="Orange Money">🟠 Orange Money (Transfert direct Pro)</option>
                <option value="Chèque certifié">📑 Chèque certifié</option>
                <option value="Paiement Mobile MTN MoMo">📱 MTN Mobile Money</option>
                <option value="Caisse / Espèces">💵 Caisse de régie (Espèces)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark mb-4">Réf. transaction / Bordereau</label>
              <input
                type="text"
                placeholder="ex: VIR-2026-0042 ou OM-TX-8823"
                className="form-input w-full text-xs"
                value={formData.reference}
                onChange={e => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              />
            </div>
          </div>

          {/* Statut du paiement */}
          <div className="mb-14">
            <label className="block text-xs font-bold text-dark mb-6">Statut du versement *</label>
            <div className="flex gap-12">
              <label className="flex items-center gap-8 text-xs cursor-pointer p-8 rounded border flex-1" style={{
                background: formData.statut === 'paye' ? 'rgba(39,174,96,0.08)' : '#fff',
                borderColor: formData.statut === 'paye' ? 'var(--green, #27AE60)' : '#e5e7eb'
              }}>
                <input
                  type="radio"
                  name="statut"
                  value="paye"
                  checked={formData.statut === 'paye'}
                  onChange={() => setFormData(prev => ({ ...prev, statut: 'paye' }))}
                />
                <span className="font-bold text-green">✓ Payé / Décaissé</span>
                <span className="text-muted text-xs ml-auto">Fonds transférés</span>
              </label>

              <label className="flex items-center gap-8 text-xs cursor-pointer p-8 rounded border flex-1" style={{
                background: formData.statut === 'en_attente' ? 'rgba(255,121,0,0.08)' : '#fff',
                borderColor: formData.statut === 'en_attente' ? 'var(--orange, #FF7900)' : '#e5e7eb'
              }}>
                <input
                  type="radio"
                  name="statut"
                  value="en_attente"
                  checked={formData.statut === 'en_attente'}
                  onChange={() => setFormData(prev => ({ ...prev, statut: 'en_attente' }))}
                />
                <span className="font-bold text-orange">⏳ En attente de paiement</span>
                <span className="text-muted text-xs ml-auto">Ordre programmé</span>
              </label>
            </div>
          </div>

          {/* Motif si bonus ou pénalité */}
          {(formData.type === 'bonus' || formData.type === 'penalite') && (
            <div className="mb-14 p-10 rounded border" style={{
              background: formData.type === 'bonus' ? 'rgba(39,174,96,0.05)' : 'rgba(231,76,60,0.05)',
              borderColor: formData.type === 'bonus' ? 'rgba(39,174,96,0.3)' : 'rgba(231,76,60,0.3)'
            }}>
              <label className="block text-xs font-bold text-dark mb-4">
                {formData.type === 'bonus' ? '🎁 Justification du bonus de surperformance' : '⚠️ Motif de la pénalité / retenue'}
              </label>
              <input
                type="text"
                placeholder={formData.type === 'bonus' ? 'ex: Dépassement de 25% du reach cible sur le Reel Instagram' : 'ex: 5 jours de retard non justifié sur la livraison du post'}
                className="form-input w-full text-xs"
                value={formData.motifBonusPenalite}
                onChange={e => setFormData(prev => ({ ...prev, motifBonusPenalite: e.target.value }))}
                required
              />
            </div>
          )}

          {/* Commentaires / Notes internes */}
          <div className="mb-20">
            <label className="block text-xs font-bold text-dark mb-4">Notes internes & Justification</label>
            <textarea
              rows="2"
              placeholder="Commentaires internes sur le versement (ex: 50% avance après validation du brief par l'équipe marque)..."
              className="form-input w-full text-xs"
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          {/* Boutons d'action */}
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
              <span>{initialPayment ? 'Mettre à jour' : 'Enregistrer le versement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
