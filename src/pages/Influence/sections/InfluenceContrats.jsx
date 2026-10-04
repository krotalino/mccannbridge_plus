import { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';
import { useApp } from '../../../context/AppContext';

const CONTRACT_TYPES = ['exclusif', 'ponctuel', 'ambassadeur', 'partenariat'];
const CONTRACT_STATUTS = ['actif', 'en_negociation', 'expire', 'resilie'];

function getContractStatusColor(statut) {
  const map = { actif: 'var(--green)', en_negociation: 'var(--yellow)', expire: 'var(--muted)', resilie: 'var(--red)' };
  return map[statut] || 'var(--muted)';
}

function getContractStatusLabel(statut) {
  const map = { actif: 'Actif', en_negociation: 'En négociation', expire: 'Expiré', resilie: 'Résilié' };
  return map[statut] || statut;
}

function getContractTypeLabel(type) {
  const map = { exclusif: 'Exclusif', ponctuel: 'Ponctuel', ambassadeur: 'Ambassadeur', partenariat: 'Partenariat' };
  return map[type] || type;
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function AlertBadge({ days }) {
  if (days === null || days > 30) return null;
  const color = days <= 7 ? 'var(--red)' : days <= 15 ? 'var(--yellow)' : 'var(--orange)';
  const label = days <= 0 ? 'EXPIRÉ' : `Expire dans ${days}j`;
  return (
    <span className="tag" style={{ background: color + '18', color, fontSize: 10, fontWeight: 700, marginLeft: 8 }}>
      ⏰ {label}
    </span>
  );
}

export default function InfluenceContrats({ influencers = [], setInfluencers }) {
  const { updateInfluencer, addNotification } = useApp();
  const [filterInf, setFilterInf] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editContract, setEditContract] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rassembler tous les contrats de tous les influenceurs
  const allContracts = (influencers || []).flatMap(inf =>
    (inf.contracts || []).map(c => ({
      ...c,
      influencerName: inf.pseudo || inf.name || inf.display_name || 'Créateur',
      influencerRealName: inf.realName || `${inf.prenom || inf.first_name || ''} ${inf.nom || inf.last_name || ''}`.trim() || inf.name,
      influencerId: String(inf.id)
    }))
  );

  const filtered = allContracts.filter(c => {
    if (filterInf && String(c.influencerId) !== String(filterInf)) return false;
    if (filterStatut && c.statut !== filterStatut) return false;
    if (filterType && c.type !== filterType) return false;
    return true;
  });

  // KPIs
  const totalActifs = allContracts.filter(c => c.statut === 'actif').length;
  const totalEnNego = allContracts.filter(c => c.statut === 'en_negociation').length;
  const expirant30j = allContracts.filter(c => { const d = getDaysUntil(c.dateFin); return d !== null && d <= 30 && d > 0; }).length;
  const totalMontant = allContracts.filter(c => c.statut === 'actif').reduce((s, c) => s + (c.montant || 0), 0);

  const handleOpenAdd = (infId = null) => {
    const defaultInfId = infId ? String(infId) : (influencers[0]?.id !== undefined ? String(influencers[0].id) : '');
    setEditContract({
      id: '',
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: '',
      type: 'ponctuel',
      montant: 0,
      modalitesPaiement: '',
      statut: 'en_negociation',
      documentUrl: null,
      influencerId: defaultInfId,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (contract) => {
    setEditContract({
      ...contract,
      influencerId: String(contract.influencerId)
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSaveContract = async () => {
    setFormError('');

    if (!editContract.influencerId) {
      setFormError('Veuillez sélectionner un influenceur.');
      return;
    }

    if (!editContract.dateDebut) {
      setFormError('Veuillez renseigner la date de début.');
      return;
    }

    if (!editContract.dateFin) {
      setFormError('Veuillez renseigner la date de fin du contrat.');
      return;
    }

    if (editContract.dateFin < editContract.dateDebut) {
      setFormError('La date de fin ne peut pas être antérieure à la date de début.');
      return;
    }

    const montantVal = Number(editContract.montant);
    if (isNaN(montantVal) || montantVal < 0) {
      setFormError('Le montant doit être un nombre positif ou nul.');
      return;
    }

    const targetInf = (influencers || []).find(i => String(i.id) === String(editContract.influencerId));
    if (!targetInf) {
      setFormError('Influenceur sélectionné introuvable dans la base.');
      return;
    }

    setIsSubmitting(true);

    try {
      const currentContracts = Array.isArray(targetInf.contracts) ? [...targetInf.contracts] : [];
      let updatedContracts;
      let contractId = editContract.id;

      if (editContract.id) {
        // Mise à jour contrat existant
        updatedContracts = currentContracts.map(c =>
          String(c.id) === String(editContract.id)
            ? {
                ...c,
                ...editContract,
                montant: montantVal,
                isNewlyCreated: true,
                updatedAt: new Date().toISOString()
              }
            : c
        );
      } else {
        // Nouveau contrat
        contractId = `CTR-${Date.now().toString().slice(-6)}`;
        const newContract = {
          ...editContract,
          id: contractId,
          montant: montantVal,
          isNewlyCreated: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedContracts = [newContract, ...currentContracts];
      }

      const influencerUpdates = {
        contracts: updatedContracts,
        contractStatus: editContract.statut === 'actif' ? 'actif' : editContract.statut,
        contractEnd: editContract.dateFin || targetInf.contractEnd || '',
      };

      // 1. Mise à jour via updateInfluencer (persistance Firestore & State global)
      if (typeof updateInfluencer === 'function') {
        await updateInfluencer(targetInf.id, influencerUpdates);
      }

      // 2. Mise à jour via setInfluencers si transmis
      if (typeof setInfluencers === 'function') {
        setInfluencers(prev => prev.map(inf =>
          String(inf.id) === String(targetInf.id)
            ? { ...inf, ...influencerUpdates }
            : inf
        ));
      }

      if (addNotification) {
        addNotification(
          `Contrat ${contractId} ${editContract.id ? 'mis à jour' : 'enregistré'} avec succès pour @${targetInf.pseudo || targetInf.name}`,
          'success'
        );
      }

      setShowModal(false);
      setEditContract(null);
      setFormError('');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du contrat:', err);
      setFormError(`Erreur: ${err.message || 'Impossible d\'enregistrer le contrat'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContract = async (infId, contractId) => {
    const targetInf = (influencers || []).find(i => String(i.id) === String(infId));
    if (!targetInf) return;

    const updatedContracts = (targetInf.contracts || []).filter(c => String(c.id) !== String(contractId));
    const activeContract = updatedContracts.find(c => c.statut === 'actif');

    const influencerUpdates = {
      contracts: updatedContracts,
      contractStatus: activeContract ? 'actif' : (updatedContracts.length > 0 ? updatedContracts[0].statut : 'non_renseigne'),
      contractEnd: activeContract?.dateFin || updatedContracts[0]?.dateFin || ''
    };

    if (typeof updateInfluencer === 'function') {
      await updateInfluencer(targetInf.id, influencerUpdates);
    }

    if (typeof setInfluencers === 'function') {
      setInfluencers(prev => prev.map(inf =>
        String(inf.id) === String(targetInf.id)
          ? { ...inf, ...influencerUpdates }
          : inf
      ));
    }

    if (addNotification) {
      addNotification('Contrat retiré avec succès', 'info');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div>
          <h2 className="text-xl font-bold text-dark mb-4">📄 Gestion des Contrats</h2>
          <p className="text-sm text-muted">Paramétrage et suivi des contrats influenceurs</p>
        </div>
        <button className="btn btn-orange" onClick={() => handleOpenAdd()}>+ Nouveau contrat</button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-4 gap-16 mb-20">
        {[
          { l: 'Contrats actifs', v: totalActifs, c: 'var(--green)', icon: '✅' },
          { l: 'En négociation', v: totalEnNego, c: 'var(--yellow)', icon: '🤝' },
          { l: 'Expirent sous 30j', v: expirant30j, c: expirant30j > 0 ? 'var(--red)' : 'var(--green)', icon: '⏰' },
          { l: 'Valeur totale (actifs)', v: formatCurrency(totalMontant), c: 'var(--blue)', icon: '💰' },
        ].map((k, i) => (
          <div key={i} className="card kpi-card">
            <div className="text-sm text-muted mb-4">{k.icon} {k.l}</div>
            <div className="text-xl font-bold" style={{ color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="inf-search-panel" style={{ marginBottom: 16 }}>
        <div className="inf-search-row">
          <select className="form-input" value={filterInf} onChange={e => setFilterInf(e.target.value)}>
            <option value="">Tous les influenceurs</option>
            {influencers.map(i => (
              <option key={i.id} value={String(i.id)}>
                @{i.pseudo || i.name} — {i.realName || `${i.prenom || i.first_name || ''} ${i.nom || i.last_name || ''}`.trim() || i.name}
              </option>
            ))}
          </select>
          <select className="form-input" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            {CONTRACT_STATUTS.map(s => <option key={s} value={s}>{getContractStatusLabel(s)}</option>)}
          </select>
          <select className="form-input" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Tous les types</option>
            {CONTRACT_TYPES.map(t => <option key={t} value={t}>{getContractTypeLabel(t)}</option>)}
          </select>
        </div>
      </div>

      {/* Tableau des contrats */}
      <div className="card">
        <table className="table w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-8 text-sm font-semibold">Influenceur</th>
              <th className="py-8 text-sm font-semibold">Type</th>
              <th className="py-8 text-sm font-semibold">Période</th>
              <th className="py-8 text-sm font-semibold text-right">Montant</th>
              <th className="py-8 text-sm font-semibold">Modalités</th>
              <th className="py-8 text-sm font-semibold text-center">Statut</th>
              <th className="py-8 text-sm font-semibold text-center">Document</th>
              <th className="py-8 text-sm font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted py-24 text-xs">
                  {filterInf || filterStatut || filterType
                    ? 'Aucun contrat ne correspond aux filtres actifs.'
                    : 'Aucun contrat enregistré pour le moment. Seuls les contrats nouvellement enregistrés s\'afficheront ici.'}
                </td>
              </tr>
            ) : filtered.map(c => {
              const days = getDaysUntil(c.dateFin);
              const stColor = getContractStatusColor(c.statut);
              return (
                <tr key={c.id} className="border-b" style={{ borderColor: '#f1f1f1' }}>
                  <td className="py-12">
                    <div className="font-bold text-sm text-dark">@{c.influencerName}</div>
                    <div className="text-xs text-muted">{c.influencerRealName}</div>
                  </td>
                  <td className="py-12">
                    <span className="tag" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)', fontSize: 10 }}>
                      {getContractTypeLabel(c.type)}
                    </span>
                  </td>
                  <td className="py-12 text-sm">
                    <div>{c.dateDebut}</div>
                    <div className="text-muted">→ {c.dateFin}</div>
                    <AlertBadge days={days} />
                  </td>
                  <td className="py-12 text-right font-bold text-sm">{formatCurrency(c.montant)}</td>
                  <td className="py-12 text-xs text-muted" style={{ maxWidth: 150 }}>{c.modalitesPaiement || '—'}</td>
                  <td className="py-12 text-center">
                    <span className="tag" style={{ background: stColor + '18', color: stColor, fontSize: 10 }}>
                      {getContractStatusLabel(c.statut)}
                    </span>
                  </td>
                  <td className="py-12 text-center">
                    {c.documentUrl
                      ? <a href={c.documentUrl} className="text-blue text-xs font-semibold" target="_blank" rel="noreferrer">📎 {c.documentUrl}</a>
                      : <span className="text-xs text-muted">Aucun</span>
                    }
                  </td>
                  <td className="py-12 text-right">
                    <div className="flex gap-4 justify-end">
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(c)} title="Modifier ce contrat">✏️</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDeleteContract(c.influencerId, c.id)} title="Supprimer ce contrat">🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal ajout/modification contrat */}
      {showModal && editContract && (
        <div className="inf-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <button className="inf-modal-close" onClick={() => setShowModal(false)}>✕</button>
            <h3 className="text-lg font-bold text-dark mb-16">{editContract.id ? 'Modifier le contrat' : 'Nouveau contrat'}</h3>

            {formError && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #F87171',
                  color: '#991B1B',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            <div className="inf-edit-grid">
              <div className="inf-edit-full">
                <label className="form-label font-bold text-xs">Influenceur *</label>
                <select
                  className="form-input"
                  value={String(editContract.influencerId)}
                  onChange={e => {
                    setEditContract(c => ({ ...c, influencerId: e.target.value }));
                    if (formError) setFormError('');
                  }}
                  disabled={!!editContract.id}
                >
                  {influencers.map(i => (
                    <option key={i.id} value={String(i.id)}>
                      @{i.pseudo || i.name} — {i.realName || `${i.prenom || i.first_name || ''} ${i.nom || i.last_name || ''}`.trim() || i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label font-bold text-xs">Date de début *</label>
                <input
                  className="form-input"
                  type="date"
                  value={editContract.dateDebut}
                  onChange={e => {
                    setEditContract(c => ({ ...c, dateDebut: e.target.value }));
                    if (formError) setFormError('');
                  }}
                  required
                />
              </div>

              <div>
                <label className="form-label font-bold text-xs">Date de fin *</label>
                <input
                  className="form-input"
                  type="date"
                  value={editContract.dateFin}
                  onChange={e => {
                    setEditContract(c => ({ ...c, dateFin: e.target.value }));
                    if (formError) setFormError('');
                  }}
                  required
                />
              </div>

              <div>
                <label className="form-label font-bold text-xs">Type de contrat</label>
                <select
                  className="form-input"
                  value={editContract.type}
                  onChange={e => setEditContract(c => ({ ...c, type: e.target.value }))}
                >
                  {CONTRACT_TYPES.map(t => <option key={t} value={t}>{getContractTypeLabel(t)}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label font-bold text-xs">Montant (FCFA) *</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="10000"
                  value={editContract.montant}
                  onChange={e => {
                    const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0);
                    setEditContract(c => ({ ...c, montant: val }));
                    if (formError) setFormError('');
                  }}
                />
              </div>

              <div>
                <label className="form-label font-bold text-xs">Statut</label>
                <select
                  className="form-input"
                  value={editContract.statut}
                  onChange={e => setEditContract(c => ({ ...c, statut: e.target.value }))}
                >
                  {CONTRACT_STATUTS.map(s => <option key={s} value={s}>{getContractStatusLabel(s)}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label font-bold text-xs">Document contractuel</label>
                <input
                  className="form-input"
                  type="file"
                  accept=".pdf,.jpg,.png,.doc,.docx"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) setEditContract(c => ({ ...c, documentUrl: file.name }));
                  }}
                />
                {editContract.documentUrl && (
                  <div className="text-[11px] text-muted mt-2">
                    Fichier : <strong>{editContract.documentUrl}</strong>
                  </div>
                )}
              </div>

              <div className="inf-edit-full">
                <label className="form-label font-bold text-xs">Modalités de paiement</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={editContract.modalitesPaiement}
                  onChange={e => setEditContract(c => ({ ...c, modalitesPaiement: e.target.value }))}
                  placeholder="Ex: Virement — 50% au démarrage, 50% à la livraison des livrables"
                />
              </div>
            </div>

            <div className="flex gap-8 mt-16">
              <button
                className="btn btn-orange"
                style={{ flex: 1 }}
                onClick={handleSaveContract}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement en cours...' : (editContract.id ? 'Enregistrer les modifications' : 'Créer le contrat')}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
