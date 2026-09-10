import { useState, useEffect } from 'react';
import { X, FileText, Calendar, DollarSign, CheckCircle2, Plus, Trash2, Download } from 'lucide-react';
import { formatCurrency } from '../../../../utils/helpers.js';
import { exportInvoiceToPdf } from './InvoicePdfExport.js';

export default function InvoiceModal({ isOpen, onClose, onSave, influencer, initialInvoice = null, campaigns = [], contracts = [] }) {
  const [formData, setFormData] = useState({
    id: '',
    numeroFacture: '',
    dateEmission: new Date().toISOString().split('T')[0],
    dateEcheance: '',
    statut: 'brouillon', // 'brouillon' | 'envoyee' | 'validee' | 'payee'
    campagne: '',
    contratRef: '',
    montantHT: 1000000,
    tvaTaux: 19.25, // Taux légal Cameroun par défaut
    tvaExoneree: false,
    avanceDeduite: 0,
    conditionsPaiement: 'Virement bancaire sous 15 jours après service fait',
    modalitesPaiement: 'Virement bancaire',
    items: [
      { description: 'Prestation de création et diffusion de contenus influence', quantite: 1, prixUnit: 1000000, total: 1000000 }
    ],
    notes: '',
  });

  useEffect(() => {
    if (initialInvoice) {
      setFormData({
        id: initialInvoice.id || '',
        numeroFacture: initialInvoice.numeroFacture || `FAC-${Date.now().toString().slice(-6)}`,
        dateEmission: initialInvoice.dateEmission || new Date().toISOString().split('T')[0],
        dateEcheance: initialInvoice.dateEcheance || '',
        statut: initialInvoice.statut || 'brouillon',
        campagne: initialInvoice.campagne || (campaigns[0]?.campaign || ''),
        contratRef: initialInvoice.contratRef || (contracts[0]?.id || ''),
        montantHT: initialInvoice.montantHT || 1000000,
        tvaTaux: initialInvoice.tvaTaux !== undefined ? initialInvoice.tvaTaux : 19.25,
        tvaExoneree: initialInvoice.tvaTaux === 0,
        avanceDeduite: initialInvoice.avanceDeduite || 0,
        conditionsPaiement: initialInvoice.conditionsPaiement || 'Virement bancaire sous 15 jours après service fait',
        modalitesPaiement: initialInvoice.modalitesPaiement || 'Virement bancaire',
        items: initialInvoice.items && initialInvoice.items.length > 0 ? initialInvoice.items : [
          { description: `Prestation campagne ${initialInvoice.campagne || 'Orange'}`, quantite: 1, prixUnit: initialInvoice.montantHT || 1000000, total: initialInvoice.montantHT || 1000000 }
        ],
        notes: initialInvoice.notes || '',
      });
    } else {
      const defaultCampaign = campaigns[0]?.campaign || contracts[0]?.campagne || 'Campagne Digitale Orange';
      const defaultMontant = contracts[0]?.montant || influencer?.cachetBase || 1500000;
      const today = new Date();
      const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      setFormData({
        id: `FAC-${Date.now().toString().slice(-6)}`,
        numeroFacture: `FAC-2026-${Math.floor(100 + Math.random() * 900)}`,
        dateEmission: today.toISOString().split('T')[0],
        dateEcheance: in15Days,
        statut: 'brouillon',
        campagne: defaultCampaign,
        contratRef: contracts[0]?.id || 'CTR-001',
        montantHT: defaultMontant,
        tvaTaux: 19.25,
        tvaExoneree: false,
        avanceDeduite: 0,
        conditionsPaiement: 'Virement sous 15 jours à validation des livrables',
        modalitesPaiement: contracts[0]?.modalitesPaiement || 'Virement bancaire',
        items: [
          { description: `Prestation d'influence — Campagne ${defaultCampaign}`, quantite: 1, prixUnit: defaultMontant, total: defaultMontant }
        ],
        notes: 'Facture soumise à la validation de la Direction Marque Orange Cameroun.',
      });
    }
  }, [initialInvoice, isOpen, influencer, campaigns, contracts]);

  if (!isOpen) return null;

  // Calculs financiers dynamiques
  const tvaEffectiveRate = formData.tvaExoneree ? 0 : Number(formData.tvaTaux || 0);
  const totalHT = formData.items.reduce((sum, it) => sum + (Number(it.total) || 0), 0) || Number(formData.montantHT) || 0;
  const montantTVA = Math.round(totalHT * (tvaEffectiveRate / 100));
  const montantTTC = totalHT + montantTVA;
  const netAPayer = Math.max(0, montantTTC - (Number(formData.avanceDeduite) || 0));

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { description: 'Livrable supplémentaire (ex: Story / Reel)', quantite: 1, prixUnit: 250000, total: 250000 }
      ]
    }));
  };

  const handleUpdateItem = (idx, field, value) => {
    setFormData(prev => {
      const items = [...prev.items];
      const item = { ...items[idx], [field]: value };
      if (field === 'quantite' || field === 'prixUnit') {
        const qty = field === 'quantite' ? Number(value) : Number(item.quantite || 1);
        const unit = field === 'prixUnit' ? Number(value) : Number(item.prixUnit || 0);
        item.total = qty * unit;
      }
      items[idx] = item;
      const newHT = items.reduce((s, it) => s + (it.total || 0), 0);
      return { ...prev, items, montantHT: newHT };
    });
  };

  const handleRemoveItem = (idx) => {
    if (formData.items.length <= 1) return;
    setFormData(prev => {
      const items = prev.items.filter((_, i) => i !== idx);
      const newHT = items.reduce((s, it) => s + (it.total || 0), 0);
      return { ...prev, items, montantHT: newHT };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.numeroFacture.trim()) {
      alert('Veuillez spécifier un numéro de facture.');
      return;
    }

    const payload = {
      ...formData,
      montantHT: totalHT,
      tvaTaux: tvaEffectiveRate,
      tvaMontant: montantTVA,
      montantTTC,
      netAPayer,
      updatedAt: new Date().toISOString()
    };

    onSave(payload);
  };

  const handleDirectDownloadPdf = () => {
    const payload = {
      ...formData,
      montantHT: totalHT,
      tvaTaux: tvaEffectiveRate,
      tvaMontant: montantTVA,
      montantTTC,
      netAPayer,
    };
    exportInvoiceToPdf(payload, influencer, contracts.find(c => c.id === formData.contratRef));
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
          maxWidth: 720,
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
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark m-0">
                {initialInvoice ? `Modifier Facture ${formData.numeroFacture}` : 'Nouvelle Facture Influenceur'}
              </h3>
              <p className="text-xs text-muted m-0">
                Émetteur : <strong>@{influencer?.pseudo || influencer?.name}</strong> • Client : <strong>Orange Cameroun S.A.</strong>
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
          {/* Ligne 1 : Numéro, Statut & Dates */}
          <div className="grid grid-4 gap-10 mb-14">
            <div>
              <label className="block text-xs font-bold text-dark mb-4">Numéro Facture *</label>
              <input
                type="text"
                className="form-input w-full text-xs font-bold"
                value={formData.numeroFacture}
                onChange={e => setFormData(prev => ({ ...prev, numeroFacture: e.target.value }))}
                placeholder="FAC-2026-001"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark mb-4">Statut Facture *</label>
              <select
                className="form-input w-full text-xs font-semibold"
                value={formData.statut}
                onChange={e => setFormData(prev => ({ ...prev, statut: e.target.value }))}
              >
                <option value="brouillon">📝 Brouillon</option>
                <option value="envoyee">📤 Envoyée</option>
                <option value="validee">✅ Validée</option>
                <option value="payee">💰 Payée</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark mb-4">Date d'émission *</label>
              <input
                type="date"
                className="form-input w-full text-xs"
                value={formData.dateEmission}
                onChange={e => setFormData(prev => ({ ...prev, dateEmission: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark mb-4">Date d'échéance</label>
              <input
                type="date"
                className="form-input w-full text-xs"
                value={formData.dateEcheance}
                onChange={e => setFormData(prev => ({ ...prev, dateEcheance: e.target.value }))}
              />
            </div>
          </div>

          {/* Ligne 2 : Campagne & Contrat synchronisé */}
          <div className="grid grid-2 gap-12 mb-14 p-10 rounded border bg-light">
            <div>
              <label className="block text-xs font-bold text-dark mb-4">Campagne rattachée *</label>
              <select
                className="form-input w-full text-xs font-semibold"
                value={formData.campagne}
                onChange={e => setFormData(prev => ({ ...prev, campagne: e.target.value }))}
                required
              >
                {campaigns.map((c, idx) => (
                  <option key={c.id || idx} value={c.campaign || c.name}>
                    {c.campaign || c.name} ({c.brand || 'Orange'})
                  </option>
                ))}
                {campaigns.length === 0 && (
                  <option value="Campagne Orange Digitale">Campagne Orange Digitale</option>
                )}
                <option value="Partenariat Annuel">Partenariat Annuel Ambassadeur</option>
                <option value="Autre prestation ponctuelle">Autre prestation ponctuelle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark mb-4">Référence Contrat lié</label>
              <select
                className="form-input w-full text-xs font-semibold"
                value={formData.contratRef}
                onChange={e => setFormData(prev => ({ ...prev, contratRef: e.target.value }))}
              >
                <option value="">-- Aucun contrat lié --</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} ({c.type}) — {formatCurrency(c.montant || 0)}
                  </option>
                ))}
                {contracts.length === 0 && <option value="CTR-001">CTR-001 (Contrat standard)</option>}
              </select>
            </div>
          </div>

          {/* Lignes de facturation (Prestations) */}
          <div className="mb-14">
            <div className="flex justify-between items-center mb-6">
              <label className="block text-xs font-bold text-dark">Détail des prestations / livrables facturés</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="btn btn-ghost btn-sm text-xs text-orange flex items-center gap-4 py-2"
              >
                <Plus size={14} /> Ajouter une ligne
              </button>
            </div>

            <div className="border rounded overflow-hidden">
              <table className="table w-full text-xs">
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #e5e7eb' }}>
                    <th className="py-6 px-8 text-left font-bold text-muted">Désignation</th>
                    <th className="py-6 px-8 text-center font-bold text-muted" style={{ width: 60 }}>Qté</th>
                    <th className="py-6 px-8 text-right font-bold text-muted" style={{ width: 120 }}>Prix Unit. HT</th>
                    <th className="py-6 px-8 text-right font-bold text-muted" style={{ width: 120 }}>Total HT</th>
                    <th className="py-6 px-8 text-center font-bold text-muted" style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((it, idx) => (
                    <tr key={idx} className="border-b" style={{ borderColor: '#f3f4f6' }}>
                      <td className="p-4">
                        <input
                          type="text"
                          className="form-input w-full text-xs"
                          value={it.description}
                          onChange={e => handleUpdateItem(idx, 'description', e.target.value)}
                          placeholder="Description de la prestation..."
                          required
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          min="1"
                          className="form-input text-center text-xs w-full"
                          value={it.quantite}
                          onChange={e => handleUpdateItem(idx, 'quantite', e.target.value)}
                          required
                        />
                      </td>
                      <td className="p-4 text-right">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          className="form-input text-right text-xs w-full font-semibold"
                          value={it.prixUnit}
                          onChange={e => handleUpdateItem(idx, 'prixUnit', e.target.value)}
                          required
                        />
                      </td>
                      <td className="p-4 text-right font-bold text-dark">
                        {formatCurrency(it.total || 0)}
                      </td>
                      <td className="p-4 text-center">
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red p-2 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TVA & Acomptes déduits */}
          <div className="grid grid-2 gap-16 mb-16">
            {/* Modalités & Conditions de règlement */}
            <div>
              <div className="mb-10">
                <label className="block text-xs font-bold text-dark mb-4">Conditions de règlement *</label>
                <input
                  type="text"
                  className="form-input w-full text-xs"
                  value={formData.conditionsPaiement}
                  onChange={e => setFormData(prev => ({ ...prev, conditionsPaiement: e.target.value }))}
                  placeholder="ex: Virement à 15 jours fin de mois"
                  required
                />
              </div>

              <div className="mb-10">
                <label className="block text-xs font-bold text-dark mb-4">Mode de règlement</label>
                <select
                  className="form-input w-full text-xs"
                  value={formData.modalitesPaiement}
                  onChange={e => setFormData(prev => ({ ...prev, modalitesPaiement: e.target.value }))}
                >
                  <option value="Virement bancaire">Virement bancaire</option>
                  <option value="Orange Money">Orange Money Pro</option>
                  <option value="Chèque certifié">Chèque bancaire</option>
                  <option value="Mobile Money">MTN MoMo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark mb-4">Déduction avance / acompte déjà payé (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="form-input w-full text-xs font-semibold text-orange"
                  value={formData.avanceDeduite}
                  onChange={e => setFormData(prev => ({ ...prev, avanceDeduite: Number(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Récapitulatif financier & TVA */}
            <div className="p-12 rounded border bg-light flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs mb-8">
                  <span className="text-muted">Total Hors Taxes (HT) :</span>
                  <span className="font-bold text-dark text-sm">{formatCurrency(totalHT)}</span>
                </div>

                <div className="flex justify-between items-center text-xs mb-8">
                  <div className="flex items-center gap-6">
                    <span className="text-muted">Taux TVA :</span>
                    <label className="flex items-center gap-4 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.tvaExoneree}
                        onChange={e => setFormData(prev => ({ ...prev, tvaExoneree: e.target.checked }))}
                      />
                      <span className="text-xs text-muted">Exonéré (0%)</span>
                    </label>
                  </div>
                  <span className="font-semibold text-dark">
                    {formData.tvaExoneree ? '0%' : `${formData.tvaTaux}%`} ({formatCurrency(montantTVA)})
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs mb-8">
                  <span className="text-muted">Total TTC :</span>
                  <span className="font-bold text-dark">{formatCurrency(montantTTC)}</span>
                </div>

                {formData.avanceDeduite > 0 && (
                  <div className="flex justify-between items-center text-xs mb-8 text-orange">
                    <span>Avance / Acompte déduit :</span>
                    <span className="font-bold">- {formatCurrency(formData.avanceDeduite)}</span>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t flex justify-between items-center mt-8">
                <div>
                  <div className="text-xs font-bold text-dark">NET À PAYER</div>
                  <div className="text-xxs text-muted">À régler au créateur</div>
                </div>
                <div className="text-lg font-bold text-green">
                  {formatCurrency(netAPayer)}
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-between items-center pt-12 border-t">
            <button
              type="button"
              className="btn btn-ghost btn-sm flex items-center gap-6 text-orange border"
              onClick={handleDirectDownloadPdf}
              title="Télécharger une prévisualisation de la facture PDF"
            >
              <Download size={15} />
              <span>Générer Facture PDF</span>
            </button>

            <div className="flex gap-10">
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
                <span>{initialInvoice ? 'Mettre à jour' : 'Enregistrer la facture'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
