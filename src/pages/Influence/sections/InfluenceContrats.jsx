import { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';

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

export default function InfluenceContrats({ influencers, setInfluencers }) {
  const [filterInf, setFilterInf] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editContract, setEditContract] = useState(null);
  const [editInfId, setEditInfId] = useState(null);

  // Rassembler tous les contrats de tous les influenceurs
  const allContracts = influencers.flatMap(inf =>
    (inf.contracts || []).map(c => ({ ...c, influencerName: inf.name, influencerRealName: inf.realName, influencerId: inf.id }))
  );

  const filtered = allContracts.filter(c => {
    if (filterInf && c.influencerId !== parseInt(filterInf)) return false;
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
    setEditContract({
      id: '',
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: '',
      type: 'ponctuel',
      montant: 0,
      modalitesPaiement: '',
      statut: 'en_negociation',
      documentUrl: null,
      influencerId: infId || (influencers[0]?.id || 0),
    });
    setEditInfId(infId);
    setShowModal(true);
  };

  const handleOpenEdit = (contract) => {
    setEditContract({ ...contract });
    setEditInfId(contract.influencerId);
    setShowModal(true);
  };

  const handleSaveContract = () => {
    if (!editContract.dateFin || !editContract.montant) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setInfluencers(prev => prev.map(inf => {
      if (inf.id !== editContract.influencerId) return inf;
      const contracts = [...(inf.contracts || [])];
      const existIdx = contracts.findIndex(c => c.id === editContract.id);
      if (existIdx >= 0) {
        contracts[existIdx] = editContract;
      } else {
        const newId = 'CTR-' + String(Math.max(0, ...influencers.flatMap(i => (i.contracts || []).map(c => parseInt(c.id.replace('CTR-', '')) || 0))) + 1).padStart(3, '0');
        contracts.push({ ...editContract, id: newId });
      }
      return { ...inf, contracts };
    }));
    setShowModal(false);
    setEditContract(null);
  };

  const handleDeleteContract = (infId, contractId) => {
    if (!confirm('Supprimer ce contrat ?')) return;
    setInfluencers(prev => prev.map(inf => {
      if (inf.id !== infId) return inf;
      return { ...inf, contracts: (inf.contracts || []).filter(c => c.id !== contractId) };
    }));
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
            {influencers.map(i => <option key={i.id} value={i.id}>@{i.name}</option>)}
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
            <tr>
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
              <tr><td colSpan={8} className="text-center text-muted py-16">Aucun contrat trouvé.</td></tr>
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
                  <td className="py-12 text-xs text-muted" style={{ maxWidth: 150 }}>{c.modalitesPaiement}</td>
                  <td className="py-12 text-center">
                    <span className="tag" style={{ background: stColor + '18', color: stColor, fontSize: 10 }}>
                      {getContractStatusLabel(c.statut)}
                    </span>
                  </td>
                  <td className="py-12 text-center">
                    {c.documentUrl
                      ? <a href={c.documentUrl} className="text-blue text-xs" target="_blank" rel="noreferrer">📎 Voir</a>
                      : <span className="text-xs text-muted">Aucun</span>
                    }
                  </td>
                  <td className="py-12 text-right">
                    <div className="flex gap-4 justify-end">
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(c)}>✏️</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDeleteContract(c.influencerId, c.id)}>🗑</button>
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
            <div className="inf-edit-grid">
              <div className="inf-edit-full">
                <label className="form-label">Influenceur</label>
                <select className="form-input" value={editContract.influencerId}
                  onChange={e => setEditContract(c => ({ ...c, influencerId: parseInt(e.target.value) }))}
                  disabled={!!editContract.id}>
                  {influencers.map(i => <option key={i.id} value={i.id}>@{i.name} — {i.realName}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Date de début *</label>
                <input className="form-input" type="date" value={editContract.dateDebut}
                  onChange={e => setEditContract(c => ({ ...c, dateDebut: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Date de fin *</label>
                <input className="form-input" type="date" value={editContract.dateFin}
                  onChange={e => setEditContract(c => ({ ...c, dateFin: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Type de contrat</label>
                <select className="form-input" value={editContract.type}
                  onChange={e => setEditContract(c => ({ ...c, type: e.target.value }))}>
                  {CONTRACT_TYPES.map(t => <option key={t} value={t}>{getContractTypeLabel(t)}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Montant (FCFA) *</label>
                <input className="form-input" type="number" value={editContract.montant}
                  onChange={e => setEditContract(c => ({ ...c, montant: parseInt(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-input" value={editContract.statut}
                  onChange={e => setEditContract(c => ({ ...c, statut: e.target.value }))}>
                  {CONTRACT_STATUTS.map(s => <option key={s} value={s}>{getContractStatusLabel(s)}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Document contractuel</label>
                <input className="form-input" type="file" accept=".pdf,.jpg,.png"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) setEditContract(c => ({ ...c, documentUrl: file.name }));
                  }} />
              </div>
              <div className="inf-edit-full">
                <label className="form-label">Modalités de paiement</label>
                <textarea className="form-input" rows={2} value={editContract.modalitesPaiement}
                  onChange={e => setEditContract(c => ({ ...c, modalitesPaiement: e.target.value }))} placeholder="Ex: Virement — 50% au démarrage, 50% à la livraison" />
              </div>
            </div>
            <div className="flex gap-8 mt-16">
              <button className="btn btn-orange" style={{ flex: 1 }} onClick={handleSaveContract}>
                {editContract.id ? 'Enregistrer' : 'Créer le contrat'}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
