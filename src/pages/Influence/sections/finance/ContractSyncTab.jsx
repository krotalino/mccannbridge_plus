import { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  CreditCard, 
  ShieldAlert, 
  Award, 
  Edit3, 
  CheckCircle2, 
  Plus,
  ArrowRight,
  Info
} from 'lucide-react';
import { formatCurrency } from '../../../../utils/helpers.js';

export default function ContractSyncTab({ influencer, influencers, setInfluencers }) {
  const [editingContract, setEditingContract] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Contrats de l'influenceur (synchronisés avec inf.contracts)
  const contracts = influencer?.contracts || [];

  const handleOpenEdit = (contract) => {
    setEditingContract({
      ...contract,
      modalitesPaiement: contract.modalitesPaiement || 'Virement bancaire — 50% au démarrage, 50% à la livraison finale',
      penalites: contract.penalites || 'Retenue forfaitaire de 5% par tranche de 72h de retard non justifié',
      bonusMalusConditions: contract.bonusMalusConditions || 'Bonus de +15% sur la part variable si le reach cible est dépassé de +20%',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveContractFinance = (e) => {
    e.preventDefault();
    if (!editingContract || !setInfluencers) return;

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const updatedContracts = (inf.contracts || []).map(c => {
        if (c.id === editingContract.id) {
          return {
            ...c,
            ...editingContract,
            montant: Number(editingContract.montant) || c.montant,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      });

      return {
        ...inf,
        contracts: updatedContracts
      };
    }));

    setIsEditModalOpen(false);
    setEditingContract(null);
  };

  return (
    <div>
      {/* En-tête informatif */}
      <div className="card mb-20 p-14 bg-light border flex flex-wrap justify-between items-center gap-12">
        <div className="flex items-center gap-10">
          <div className="p-8 rounded bg-white text-orange shadow-xs">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-bold text-dark text-sm m-0">
              Synchronisation Directe avec le Module Contrats
            </h3>
            <p className="text-xs text-muted m-0">
              Les données ci-dessous sont issues du dossier contractuel de <strong>@{influencer?.pseudo || influencer?.name}</strong>. Toute mise à jour est synchronisée en temps réel pour éliminer les doubles saisies.
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-muted">
          {contracts.length} contrat(s) actif(s) ou archivé(s)
        </div>
      </div>

      {/* Cartes des contrats avec focus financier */}
      <div className="space-y-16">
        {contracts.length === 0 ? (
          <div className="card text-center py-32 text-muted text-xs">
            Aucun contrat spécifique n'est actuellement rattaché à cet influenceur.
          </div>
        ) : (
          contracts.map((ctr, idx) => {
            const isActif = ctr.statut === 'actif';
            const statusBg = isActif ? 'rgba(39, 174, 96, 0.1)' : 'rgba(255, 121, 0, 0.1)';
            const statusColor = isActif ? 'var(--green, #27AE60)' : 'var(--orange, #FF7900)';

            return (
              <div key={ctr.id || idx} className="card shadow-sm border p-18">
                <div className="flex flex-wrap justify-between items-start gap-12 pb-14 border-b">
                  <div>
                    <div className="flex items-center gap-8">
                      <h4 className="font-extrabold text-base text-dark m-0">Contrat {ctr.id}</h4>
                      <span className="tag text-xxs font-bold uppercase tracking-wider" style={{ background: statusBg, color: statusColor }}>
                        {ctr.statut || 'Actif'}
                      </span>
                      <span className="tag text-xxs bg-light border text-muted">
                        Type : {ctr.type || 'Partenariat'}
                      </span>
                    </div>
                    <div className="text-xs text-muted mt-4 flex items-center gap-6">
                      <Calendar size={13} />
                      <span>Période d'effet : du <strong>{ctr.dateDebut || '2026-01-01'}</strong> au <strong>{ctr.dateFin || '2026-12-31'}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <div className="text-xxs text-muted uppercase font-bold">Montant Contractuel Global</div>
                      <div className="text-lg font-extrabold text-dark">{formatCurrency(ctr.montant || 0)}</div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-xs font-bold text-orange border flex items-center gap-4 py-4 px-8"
                      onClick={() => handleOpenEdit(ctr)}
                    >
                      <Edit3 size={14} />
                      <span>Ajuster Clauses Financières</span>
                    </button>
                  </div>
                </div>

                {/* Grille des 3 volets financiers contractuels */}
                <div className="grid grid-3 gap-14 mt-16 text-xs">
                  {/* Modalités de paiement */}
                  <div className="p-12 rounded border" style={{ background: 'rgba(41, 128, 185, 0.03)' }}>
                    <div className="flex items-center gap-6 font-bold text-dark mb-6">
                      <CreditCard size={15} className="text-blue" />
                      <span>Modalités de Paiement & Échéancier</span>
                    </div>
                    <p className="text-muted leading-relaxed m-0">
                      {ctr.modalitesPaiement || 'Virement bancaire / Orange Money selon calendrier validé. Acompte de 50% au brief et solde à réception des statistiques.'}
                    </p>
                  </div>

                  {/* Pénalités éventuelles */}
                  <div className="p-12 rounded border" style={{ background: 'rgba(231, 76, 60, 0.03)' }}>
                    <div className="flex items-center gap-6 font-bold text-dark mb-6">
                      <ShieldAlert size={15} className="text-red" />
                      <span>Clauses de Pénalités & Retards</span>
                    </div>
                    <p className="text-muted leading-relaxed m-0">
                      {ctr.penalites || 'Pénalité de 5% par semaine de retard de publication non justifiée. Obligation de rattrapage par stories additionnelles.'}
                    </p>
                  </div>

                  {/* Conditions de Bonus / Malus */}
                  <div className="p-12 rounded border" style={{ background: 'rgba(39, 174, 96, 0.03)' }}>
                    <div className="flex items-center gap-6 font-bold text-dark mb-6">
                      <Award size={15} className="text-green" />
                      <span>Conditions Bonus / Malus</span>
                    </div>
                    <p className="text-muted leading-relaxed m-0">
                      {ctr.bonusMalusConditions || 'Bonus de surperformance (+10% à +20% sur la part variable) si dépassement vérifié des cibles d\'impressions et d\'engagement.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal d'édition des clauses contractuelles */}
      {isEditModalOpen && editingContract && (
        <div className="inf-modal-overlay" onClick={() => setIsEditModalOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1060, padding: 16
        }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 600, background: '#fff', borderRadius: 12, padding: 24
          }}>
            <div className="flex justify-between items-center pb-12 mb-16 border-b">
              <div className="flex items-center gap-8">
                <FileText size={20} className="text-orange" />
                <h3 className="font-bold text-lg text-dark m-0">
                  Clauses Financières • Contrat {editingContract.id}
                </h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveContractFinance}>
              <div className="grid grid-2 gap-12 mb-14">
                <div>
                  <label className="block text-xs font-bold text-dark mb-4">Montant Total Contractuel (FCFA) *</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    className="form-input w-full text-xs font-bold"
                    value={editingContract.montant}
                    onChange={e => setEditingContract(prev => ({ ...prev, montant: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark mb-4">Statut Contractuel</label>
                  <select
                    className="form-input w-full text-xs font-semibold"
                    value={editingContract.statut}
                    onChange={e => setEditingContract(prev => ({ ...prev, statut: e.target.value }))}
                  >
                    <option value="actif">Actif</option>
                    <option value="en_negociation">En négociation</option>
                    <option value="expire">Expiré</option>
                    <option value="resilie">Résilié</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-2 gap-12 mb-14">
                <div>
                  <label className="block text-xs font-bold text-dark mb-4">Date de début</label>
                  <input
                    type="date"
                    className="form-input w-full text-xs"
                    value={editingContract.dateDebut || ''}
                    onChange={e => setEditingContract(prev => ({ ...prev, dateDebut: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark mb-4">Date de fin</label>
                  <input
                    type="date"
                    className="form-input w-full text-xs"
                    value={editingContract.dateFin || ''}
                    onChange={e => setEditingContract(prev => ({ ...prev, dateFin: e.target.value }))}
                  />
                </div>
              </div>

              {/* Modalités de paiement */}
              <div className="mb-14">
                <label className="block text-xs font-bold text-dark mb-4">Modalités de Paiement *</label>
                <textarea
                  rows="2"
                  className="form-input w-full text-xs"
                  placeholder="ex: Virement bancaire — 50% au démarrage, 50% à la livraison finale sous 15 jours"
                  value={editingContract.modalitesPaiement}
                  onChange={e => setEditingContract(prev => ({ ...prev, modalitesPaiement: e.target.value }))}
                  required
                />
              </div>

              {/* Pénalités éventuelles */}
              <div className="mb-14">
                <label className="block text-xs font-bold text-dark mb-4">Pénalités applicables</label>
                <textarea
                  rows="2"
                  className="form-input w-full text-xs"
                  placeholder="ex: Retenue de 5% par tranche de 72h de retard, clause de remboursement en cas d'inconduite"
                  value={editingContract.penalites}
                  onChange={e => setEditingContract(prev => ({ ...prev, penalites: e.target.value }))}
                />
              </div>

              {/* Bonus / Malus */}
              <div className="mb-20">
                <label className="block text-xs font-bold text-dark mb-4">Conditions de Bonus / Malus</label>
                <textarea
                  rows="2"
                  className="form-input w-full text-xs"
                  placeholder="ex: Prime de +15% en cas d'atteinte de +20% d'objectifs de reach"
                  value={editingContract.bonusMalusConditions}
                  onChange={e => setEditingContract(prev => ({ ...prev, bonusMalusConditions: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-10 pt-12 border-t">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-orange btn-sm flex items-center gap-6"
                  style={{ background: 'var(--orange, #FF7900)', color: '#fff' }}
                >
                  <CheckCircle2 size={16} />
                  <span>Mettre à jour et synchroniser</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
