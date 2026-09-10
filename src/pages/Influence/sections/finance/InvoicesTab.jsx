import { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Send, 
  Calendar,
  AlertCircle,
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../../../utils/helpers.js';
import { exportInvoiceToPdf } from './InvoicePdfExport.js';
import InvoiceModal from './InvoiceModal.jsx';

export default function InvoicesTab({ influencer, influencers, setInfluencers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'brouillon' | 'envoyee' | 'validee' | 'payee'
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  const contracts = influencer?.contracts || [];

  const campaignsList = useMemo(() => {
    const list = [];
    if (Array.isArray(influencer?.performanceHistory)) {
      influencer.performanceHistory.forEach((h, idx) => {
        list.push({
          id: h.id || `HIST-${idx}`,
          campaign: h.campaign || h.name || `Campagne #${idx + 1}`,
          brand: h.brand || 'Orange Cameroun'
        });
      });
    }
    if (Array.isArray(influencer?.cahierDesCharges)) {
      influencer.cahierDesCharges.forEach((c) => {
        if (!list.some(l => l.campaign === c.campagneNom)) {
          list.push({
            id: c.campagneId || c.id,
            campaign: c.campagneNom,
            brand: 'Orange Cameroun'
          });
        }
      });
    }
    if (list.length === 0) {
      list.push({
        id: 'DEFAULT-01',
        campaign: influencer?.lastCampaign || 'Campagne Digitale Orange',
        brand: 'Orange Cameroun'
      });
    }
    return list;
  }, [influencer]);

  // Récupération ou génération intelligente des factures pour l'influenceur
  const factures = useMemo(() => {
    if (Array.isArray(influencer?.factures) && influencer.factures.length > 0) {
      return influencer.factures;
    }

    // Si aucune facture n'est encore initialisée dans le profil, générer des factures de référence
    const generated = [];
    const baseAmount = influencer?.cachetBase || 1500000;
    const tvaRate = 19.25;

    // Facture 1 : liée aux paiements réels déjà effectués
    const lastCamp = influencer?.lastCampaign || 'Orange Weekend Mars';
    const ht1 = baseAmount;
    const tva1 = Math.round(ht1 * (tvaRate / 100));
    generated.push({
      id: `FAC-001`,
      numeroFacture: `FAC-2026-089`,
      dateEmission: '2026-03-01',
      dateEcheance: '2026-03-15',
      statut: 'payee',
      campagne: lastCamp,
      contratRef: contracts[0]?.id || 'CTR-001',
      montantHT: ht1,
      tvaTaux: tvaRate,
      tvaMontant: tva1,
      montantTTC: ht1 + tva1,
      avanceDeduite: 0,
      netAPayer: ht1 + tva1,
      conditionsPaiement: 'Virement sous 15 jours après diffusion',
      modalitesPaiement: 'Virement bancaire',
      items: [
        { description: `Création & diffusion de contenus d'influence — ${lastCamp}`, quantite: 1, prixUnit: ht1, total: ht1 }
      ],
      notes: 'Facture soldée après validation de conformité des livrables et statistiques.'
    });

    // Facture 2 : En cours / validée pour la campagne actuelle
    const currentCamp = campaignsList[0]?.campaign || 'Orange Weekend Avril';
    const ht2 = Math.round(baseAmount * 0.8);
    const tva2 = Math.round(ht2 * (tvaRate / 100));
    generated.push({
      id: `FAC-002`,
      numeroFacture: `FAC-2026-114`,
      dateEmission: '2026-04-02',
      dateEcheance: '2026-04-20',
      statut: 'validee',
      campagne: currentCamp,
      contratRef: contracts[0]?.id || 'CTR-001',
      montantHT: ht2,
      tvaTaux: tvaRate,
      tvaMontant: tva2,
      montantTTC: ht2 + tva2,
      avanceDeduite: Math.round(ht2 * 0.5),
      netAPayer: (ht2 + tva2) - Math.round(ht2 * 0.5),
      conditionsPaiement: '50% acompte à la signature / 50% solde à la livraison',
      modalitesPaiement: 'Virement bancaire',
      items: [
        { description: `Campagne ${currentCamp} (Stories + Reel)`, quantite: 1, prixUnit: ht2, total: ht2 }
      ],
      notes: 'Acompte déjà perçu. Solde soumis pour ordonnancement du virement.'
    });

    return generated;
  }, [influencer, contracts, campaignsList]);

  // Filtrage
  const filteredFactures = useMemo(() => {
    return factures.filter(f => {
      if (statusFilter !== 'all' && f.statut !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const num = (f.numeroFacture || f.id || '').toLowerCase();
        const camp = (f.campagne || '').toLowerCase();
        return num.includes(q) || camp.includes(q);
      }
      return true;
    });
  }, [factures, statusFilter, searchTerm]);

  // KPIs Facturation
  const totalFactureTTC = factures.reduce((s, f) => s + (f.montantTTC || 0), 0);
  const totalPayeTTC = factures.filter(f => f.statut === 'payee').reduce((s, f) => s + (f.montantTTC || 0), 0);
  const totalEnAttenteTTC = factures.filter(f => f.statut === 'validee' || f.statut === 'envoyee').reduce((s, f) => s + (f.netAPayer || f.montantTTC || 0), 0);

  // Sauvegarde d'une facture
  const handleSaveInvoice = (invoiceData) => {
    if (!setInfluencers) return;

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const currentList = Array.isArray(inf.factures) && inf.factures.length > 0 ? [...inf.factures] : [...factures];
      const existIdx = currentList.findIndex(f => f.id === invoiceData.id || f.numeroFacture === invoiceData.numeroFacture);

      if (existIdx >= 0) {
        currentList[existIdx] = { ...currentList[existIdx], ...invoiceData };
      } else {
        currentList.unshift(invoiceData);
      }

      return {
        ...inf,
        factures: currentList
      };
    }));

    setIsInvoiceModalOpen(false);
    setSelectedInvoiceForModal(null);
  };

  const handleUpdateStatus = (invoiceId, newStatus) => {
    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const list = Array.isArray(inf.factures) && inf.factures.length > 0 ? [...inf.factures] : [...factures];
      const updated = list.map(f => {
        if (f.id !== invoiceId && f.numeroFacture !== invoiceId) return f;
        return { ...f, statut: newStatus };
      });
      return { ...inf, factures: updated };
    }));
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (!confirm('Supprimer cette facture ?')) return;
    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const list = Array.isArray(inf.factures) && inf.factures.length > 0 ? [...inf.factures] : [...factures];
      return {
        ...inf,
        factures: list.filter(f => f.id !== invoiceId && f.numeroFacture !== invoiceId)
      };
    }));
  };

  const handleDownloadPdf = (fac) => {
    exportInvoiceToPdf(fac, influencer, contracts.find(c => c.id === fac.contratRef));
  };

  const getStatusBadge = (st) => {
    const config = {
      payee: { label: 'Payée ✓', bg: 'rgba(39, 174, 96, 0.1)', color: 'var(--green, #27AE60)' },
      validee: { label: 'Validée (B.A.P)', bg: 'rgba(41, 128, 185, 0.1)', color: 'var(--blue, #2980B9)' },
      envoyee: { label: 'Envoyée ⏳', bg: 'rgba(255, 121, 0, 0.1)', color: 'var(--orange, #FF7900)' },
      brouillon: { label: 'Brouillon 📝', bg: 'rgba(140, 140, 140, 0.12)', color: 'var(--muted, #777)' },
    }[st] || { label: st, bg: '#eee', color: '#555' };

    return (
      <span className="tag text-xxs font-bold" style={{ background: config.bg, color: config.color }}>
        {config.label}
      </span>
    );
  };

  return (
    <div>
      {/* 1. KPIs Facturation */}
      <div className="grid grid-3 gap-14 mb-20">
        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--blue, #2980B9)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider">Volume Total Facturé (TTC)</div>
          <div className="text-xl font-extrabold text-dark mt-6">{formatCurrency(totalFactureTTC)}</div>
          <div className="text-xxs text-muted mt-4">{factures.length} facture(s) émise(s)</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--green, #27AE60)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider">Factures Réglées (TTC)</div>
          <div className="text-xl font-extrabold text-green mt-6">{formatCurrency(totalPayeTTC)}</div>
          <div className="text-xxs text-muted mt-4">Règlements encaissés par le créateur</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--orange, #FF7900)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider">En Cours / À Payer (TTC)</div>
          <div className="text-xl font-extrabold text-orange mt-6">{formatCurrency(totalEnAttenteTTC)}</div>
          <div className="text-xxs text-muted mt-4">Factures validées / en attente de virement</div>
        </div>
      </div>

      {/* 2. BARRE D'ACTIONS ET FILTRES */}
      <div className="card mb-20">
        <div className="flex flex-wrap justify-between items-center gap-12 mb-16">
          <div>
            <h3 className="text-md font-bold text-dark m-0">Facturation des Prestations d'Influence</h3>
            <p className="text-xs text-muted m-0">Gestion dématérialisée, calcul de TVA (19.25%), export PDF officiel charté Orange</p>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            {/* Recherche */}
            <div className="relative" style={{ width: 220 }}>
              <input
                type="text"
                placeholder="Rechercher facture, n°..."
                className="form-input text-xs w-full pl-28 py-4"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search size={13} className="absolute left-8 top-8 text-muted" />
            </div>

            {/* Filtre Statut */}
            <select
              className="form-input text-xs py-4"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ width: 140 }}
            >
              <option value="all">Tous les statuts</option>
              <option value="payee">Payée</option>
              <option value="validee">Validée</option>
              <option value="envoyee">Envoyée</option>
              <option value="brouillon">Brouillon</option>
            </select>

            {/* Bouton Nouvelle Facture */}
            <button
              type="button"
              className="btn btn-orange btn-sm text-xs font-bold flex items-center gap-6"
              style={{ background: 'var(--orange, #FF7900)', color: '#fff' }}
              onClick={() => {
                setSelectedInvoiceForModal(null);
                setIsInvoiceModalOpen(true);
              }}
            >
              <Plus size={15} />
              <span>Créer une Facture</span>
            </button>
          </div>
        </div>

        {/* Tableau des factures */}
        <div className="overflow-x-auto">
          <table className="table w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs text-muted" style={{ background: '#f8f9fa' }}>
                <th className="py-8 px-10">N° Facture</th>
                <th className="py-8 px-10">Campagne & Contrat</th>
                <th className="py-8 px-10">Date Émission</th>
                <th className="py-8 px-10 text-right">Montant HT</th>
                <th className="py-8 px-10 text-right">TVA (19.25%)</th>
                <th className="py-8 px-10 text-right">Montant TTC</th>
                <th className="py-8 px-10">Conditions Règlement</th>
                <th className="py-8 px-10 text-center">Statut</th>
                <th className="py-8 px-10 text-right">Facture PDF & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFactures.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-24 text-center text-muted text-xs">
                    Aucune facture ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                filteredFactures.map((fac, idx) => {
                  return (
                    <tr key={fac.id || fac.numeroFacture || idx} className="border-b text-xs hover:bg-gray-50" style={{ borderColor: '#f1f1f1' }}>
                      <td className="py-10 px-10 font-bold text-dark">
                        <div className="flex items-center gap-6">
                          <FileText size={15} className="text-orange" />
                          <span>{fac.numeroFacture || fac.id}</span>
                        </div>
                      </td>
                      <td className="py-10 px-10">
                        <div className="font-semibold text-dark">{fac.campagne}</div>
                        <div className="text-xxs text-muted">Contrat: {fac.contratRef || 'CTR-2026'}</div>
                      </td>
                      <td className="py-10 px-10 text-muted">
                        <div>{fac.dateEmission}</div>
                        {fac.dateEcheance && (
                          <div className="text-xxs text-orange">Éch: {fac.dateEcheance}</div>
                        )}
                      </td>
                      <td className="py-10 px-10 text-right font-semibold text-dark">
                        {formatCurrency(fac.montantHT || 0)}
                      </td>
                      <td className="py-10 px-10 text-right text-muted text-xxs font-mono">
                        {formatCurrency(fac.tvaMontant || Math.round((fac.montantHT || 0) * 0.1925))}
                      </td>
                      <td className="py-10 px-10 text-right font-extrabold text-sm text-dark">
                        {formatCurrency(fac.montantTTC || (fac.montantHT + Math.round((fac.montantHT || 0) * 0.1925)))}
                      </td>
                      <td className="py-10 px-10 text-muted text-xxs">
                        {fac.conditionsPaiement || 'Virement sous 15 jours'}
                      </td>
                      <td className="py-10 px-10 text-center">
                        <select
                          className="form-input text-xxs py-2 px-4 rounded font-bold cursor-pointer"
                          value={fac.statut}
                          onChange={e => handleUpdateStatus(fac.id || fac.numeroFacture, e.target.value)}
                          style={{
                            background: fac.statut === 'payee' ? 'rgba(39, 174, 96, 0.1)' : fac.statut === 'validee' ? 'rgba(41, 128, 185, 0.1)' : 'rgba(255, 121, 0, 0.1)',
                            color: fac.statut === 'payee' ? 'var(--green, #27AE60)' : fac.statut === 'validee' ? 'var(--blue, #2980B9)' : 'var(--orange, #FF7900)',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <option value="brouillon">Brouillon</option>
                          <option value="envoyee">Envoyée</option>
                          <option value="validee">Validée</option>
                          <option value="payee">Payée</option>
                        </select>
                      </td>
                      <td className="py-10 px-10 text-right">
                        <div className="flex justify-end items-center gap-6">
                          {/* Télécharger PDF officiel */}
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm p-4 text-orange border flex items-center gap-4 text-xxs font-bold"
                            onClick={() => handleDownloadPdf(fac)}
                            title="Télécharger la facture PDF chartée Orange Cameroun"
                          >
                            <Download size={13} />
                            <span>PDF</span>
                          </button>

                          {/* Aperçu */}
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm p-4 text-muted hover:text-dark"
                            onClick={() => setPreviewInvoice(fac)}
                            title="Aperçu rapide des détails de la facture"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Éditer */}
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm p-4 text-muted hover:text-dark"
                            onClick={() => {
                              setSelectedInvoiceForModal(fac);
                              setIsInvoiceModalOpen(true);
                            }}
                            title="Modifier cette facture"
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Supprimer */}
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm p-4 text-red"
                            onClick={() => handleDeleteInvoice(fac.id || fac.numeroFacture)}
                            title="Supprimer la facture"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL APERÇU RAPIDE FACTURE */}
      {previewInvoice && (
        <div className="inf-modal-overlay" onClick={() => setPreviewInvoice(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1060, padding: 16
        }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 560, background: '#fff', borderRadius: 12, padding: 24
          }}>
            <div className="flex justify-between items-center pb-12 mb-16 border-b">
              <div className="flex items-center gap-8">
                <FileText size={20} className="text-orange" />
                <h3 className="font-bold text-lg text-dark m-0">Facture {previewInvoice.numeroFacture}</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setPreviewInvoice(null)}>✕</button>
            </div>

            <div className="p-12 rounded border bg-light mb-14 text-xs space-y-8">
              <div className="flex justify-between">
                <span className="text-muted">Émetteur :</span>
                <span className="font-bold text-dark">@{influencer.pseudo || influencer.name} ({influencer.realName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Client :</span>
                <span className="font-bold text-dark">Orange Cameroun S.A.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Campagne :</span>
                <span className="font-semibold text-dark">{previewInvoice.campagne}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Date d'émission :</span>
                <span className="font-semibold text-dark">{previewInvoice.dateEmission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Conditions de paiement :</span>
                <span className="font-semibold text-dark">{previewInvoice.conditionsPaiement}</span>
              </div>
            </div>

            {/* Totaux */}
            <div className="border rounded p-12 mb-16 text-xs">
              <div className="flex justify-between mb-6">
                <span>Montant Hors Taxes (HT) :</span>
                <span className="font-bold">{formatCurrency(previewInvoice.montantHT || 0)}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span>TVA ({previewInvoice.tvaTaux || 19.25}%) :</span>
                <span>{formatCurrency(previewInvoice.tvaMontant || Math.round((previewInvoice.montantHT || 0) * 0.1925))}</span>
              </div>
              {previewInvoice.avanceDeduite > 0 && (
                <div className="flex justify-between mb-6 text-orange">
                  <span>Avance déduite :</span>
                  <span>- {formatCurrency(previewInvoice.avanceDeduite)}</span>
                </div>
              )}
              <div className="flex justify-between pt-6 border-t font-extrabold text-sm text-green">
                <span>Total Net à Payer :</span>
                <span>{formatCurrency(previewInvoice.netAPayer || previewInvoice.montantTTC || 0)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                className="btn btn-orange btn-sm flex items-center gap-6"
                onClick={() => {
                  handleDownloadPdf(previewInvoice);
                  setPreviewInvoice(null);
                }}
              >
                <Download size={15} />
                <span>Télécharger le PDF officiel</span>
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setPreviewInvoice(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition/création */}
      {isInvoiceModalOpen && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedInvoiceForModal(null);
          }}
          onSave={handleSaveInvoice}
          influencer={influencer}
          initialInvoice={selectedInvoiceForModal}
          campaigns={campaignsList}
          contracts={contracts}
        />
      )}
    </div>
  );
}
