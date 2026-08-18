import { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';

export default function InfluenceFinance({ influencers, setInfluencers }) {
  const [selectedInfId, setSelectedInfId] = useState(influencers[0]?.id || 1);
  const [activeSubTab, setActiveSubTab] = useState('payments'); // 'payments' | 'documents' | 'scores'
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [docTypeToUpload, setDocTypeToUpload] = useState('pieceIdentite');

  const selectedInf = influencers.find(i => i.id === parseInt(selectedInfId)) || influencers[0];

  // Calcul du montant total payé et en attente à l'échelle de tous les influenceurs
  const allPaiements = influencers.flatMap(inf =>
    (inf.paiements || []).map(p => ({ ...p, influencerName: inf.name, influencerId: inf.id }))
  );

  const totalPaye = allPaiements
    .filter(p => p.statut === 'paye')
    .reduce((sum, p) => sum + (p.montant || 0), 0);

  const totalEnAttente = allPaiements
    .filter(p => p.statut === 'en_attente')
    .reduce((sum, p) => sum + (p.montant || 0), 0);

  const handleUpdatePaymentStatus = (infId, paymentId, newStatus) => {
    if (!setInfluencers) return;
    setInfluencers(prev => prev.map(inf => {
      if (inf.id !== infId) return inf;
      const updatedPaiements = (inf.paiements || []).map(p => {
        if (p.id !== paymentId) return p;
        return {
          ...p,
          statut: newStatus,
          reference: newStatus === 'paye' ? (p.reference || `VIR-${Date.now().toString().slice(-6)}`) : p.reference
        };
      });
      return { ...inf, paiements: updatedPaiements };
    }));
  };

  const handleSimulateDocUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !setInfluencers) return;

    setInfluencers(prev => prev.map(inf => {
      if (inf.id !== selectedInf.id) return inf;
      const docs = { ...(inf.documentsLegaux || {}) };
      if (docTypeToUpload === 'pieceIdentite') {
        docs.pieceIdentite = { nom: file.name, uploadDate: new Date().toISOString().split('T')[0], present: true };
      } else if (docTypeToUpload === 'rib') {
        docs.rib = { nom: file.name, uploadDate: new Date().toISOString().split('T')[0], present: true };
      } else {
        docs.autresDocuments = [...(docs.autresDocuments || []), { nom: file.name, uploadDate: new Date().toISOString().split('T')[0] }];
      }
      return { ...inf, documentsLegaux: docs };
    }));

    alert(`✅ Document "${file.name}" importé avec succès pour @${selectedInf.name}.`);
    setShowUploadDocModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div>
          <h2 className="text-xl font-bold text-dark mb-4">💰 Budgets, Paiements & Documents Légaux</h2>
          <p className="text-sm text-muted">Suivi financier, facturation, pièces justificatives et scores de performance</p>
        </div>

        <div className="flex gap-4">
          <button
            className={`btn btn-sm ${activeSubTab === 'payments' ? 'btn-orange' : 'btn-ghost'}`}
            onClick={() => setActiveSubTab('payments')}
          >
            💳 Suivi des Paiements
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'documents' ? 'btn-orange' : 'btn-ghost'}`}
            onClick={() => setActiveSubTab('documents')}
          >
            📑 Documents Légaux (RIB/CNI)
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'scores' ? 'btn-orange' : 'btn-ghost'}`}
            onClick={() => setActiveSubTab('scores')}
          >
            ⭐ Scores de Performance
          </button>
        </div>
      </div>

      {/* Cartes KPI Générales */}
      <div className="grid grid-3 gap-16 mb-20">
        <div className="card shadow-sm border-l-4" style={{ borderLeftColor: 'var(--blue)' }}>
          <div className="text-sm text-muted mb-4">Budget Total Engagé</div>
          <div className="text-2xl font-bold">{formatCurrency(totalPaye + totalEnAttente)}</div>
          <div className="text-xs text-muted mt-4">{allPaiements.length} opération(s) financière(s)</div>
        </div>
        <div className="card shadow-sm border-l-4" style={{ borderLeftColor: 'var(--green)' }}>
          <div className="text-sm text-muted mb-4">Paiements Effectués</div>
          <div className="text-2xl font-bold text-green">{formatCurrency(totalPaye)}</div>
          <div className="text-xs text-muted mt-4">Virements validés</div>
        </div>
        <div className="card shadow-sm border-l-4" style={{ borderLeftColor: 'var(--orange)' }}>
          <div className="text-sm text-muted mb-4">Paiements en Attente</div>
          <div className="text-2xl font-bold text-orange">{formatCurrency(totalEnAttente)}</div>
          <div className="text-xs text-muted mt-4">Factures / Devis à régler</div>
        </div>
      </div>

      {/* SUBTAB 1 : Suivi des paiements */}
      {activeSubTab === 'payments' && (
        <div className="card">
          <div className="flex justify-between items-center mb-16">
            <h3 className="text-lg font-semibold text-dark">Factures & Suivi des Paiements</h3>
            <button className="btn btn-ghost btn-sm text-orange border">Générer Fichier SEPA / Virement</button>
          </div>

          <table className="table w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-8 font-semibold text-sm">Influenceur</th>
                <th className="py-8 font-semibold text-sm">Campagne</th>
                <th className="py-8 font-semibold text-sm">Date</th>
                <th className="py-8 font-semibold text-sm">Montant</th>
                <th className="py-8 font-semibold text-sm">Référence</th>
                <th className="py-8 font-semibold text-sm">Statut</th>
                <th className="py-8 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allPaiements.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-muted">Aucun paiement répertorié.</td></tr>
              ) : (
                allPaiements.map((p, i) => (
                  <tr key={p.id || i} className="border-b" style={{ borderColor: '#f1f1f1' }}>
                    <td className="py-12 font-bold text-sm">@{p.influencerName}</td>
                    <td className="py-12 text-sm text-muted">{p.campagne}</td>
                    <td className="py-12 text-xs text-muted">{p.date}</td>
                    <td className="py-12 font-bold text-sm">{formatCurrency(p.montant)}</td>
                    <td className="py-12 text-xs text-muted">{p.reference || '—'}</td>
                    <td className="py-12">
                      <span
                        className="tag text-xs"
                        style={{
                          background: p.statut === 'paye' ? 'rgba(39,174,96,0.1)' : 'rgba(255,121,0,0.1)',
                          color: p.statut === 'paye' ? 'var(--green)' : 'var(--orange)'
                        }}
                      >
                        {p.statut === 'paye' ? 'Payé ✓' : 'En attente ⏳'}
                      </span>
                    </td>
                    <td className="py-12 text-right">
                      {p.statut === 'en_attente' ? (
                        <button
                          className="btn btn-green btn-sm"
                          onClick={() => handleUpdatePaymentStatus(p.influencerId, p.id, 'paye')}
                        >
                          Valider Paiement
                        </button>
                      ) : (
                        <button
                          className="btn btn-ghost btn-sm text-muted"
                          onClick={() => handleUpdatePaymentStatus(p.influencerId, p.id, 'en_attente')}
                        >
                          Marquer en attente
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB 2 : Documents Légaux */}
      {activeSubTab === 'documents' && (
        <div className="card">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-12">
              <span className="font-semibold text-sm text-dark">Sélectionner un influenceur :</span>
              <select
                className="form-input"
                style={{ width: 260, fontWeight: 700 }}
                value={selectedInfId}
                onChange={e => setSelectedInfId(e.target.value)}
              >
                {influencers.map(inf => (
                  <option key={inf.id} value={inf.id}>
                    @{inf.name} ({inf.realName})
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-orange btn-sm" onClick={() => setShowUploadDocModal(true)}>
              + Téléverser un document légal
            </button>
          </div>

          <h3 className="text-md font-bold text-dark mb-16">
            Dossier Administratif et Légale pour @{selectedInf.name}
          </h3>

          <div className="grid grid-2 gap-16 mb-20">
            {/* CNI */}
            <div className="p-16 border rounded" style={{ background: selectedInf.documentsLegaux?.pieceIdentite?.present ? 'rgba(39,174,96,0.04)' : '#fafafa' }}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="font-bold text-dark">🪪 Pièce d'Identité (CNI / Passeport)</h4>
                  <div className="text-xs text-muted mt-2">
                    {selectedInf.documentsLegaux?.pieceIdentite?.present
                      ? `Fichier: ${selectedInf.documentsLegaux.pieceIdentite.nom} (mis à jour le ${selectedInf.documentsLegaux.pieceIdentite.uploadDate})`
                      : 'Aucune pièce d\'identité disponible'}
                  </div>
                </div>
                <span className={`tag ${selectedInf.documentsLegaux?.pieceIdentite?.present ? 'tag-green' : 'tag-red'}`}>
                  {selectedInf.documentsLegaux?.pieceIdentite?.present ? 'Conforme ✓' : 'Manquant ⚠️'}
                </span>
              </div>
              {selectedInf.documentsLegaux?.pieceIdentite?.present && (
                <a href="#view" className="text-xs text-blue underline font-semibold" onClick={e => { e.preventDefault(); alert(`Aperçu du fichier: ${selectedInf.documentsLegaux.pieceIdentite.nom}`); }}>
                  Aperçu du document
                </a>
              )}
            </div>

            {/* RIB */}
            <div className="p-16 border rounded" style={{ background: selectedInf.documentsLegaux?.rib?.present ? 'rgba(39,174,96,0.04)' : '#fafafa' }}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="font-bold text-dark">🏦 Relevé d'Identité Bancaire (RIB)</h4>
                  <div className="text-xs text-muted mt-2">
                    {selectedInf.documentsLegaux?.rib?.present
                      ? `Fichier: ${selectedInf.documentsLegaux.rib.nom} (mis à jour le ${selectedInf.documentsLegaux.rib.uploadDate})`
                      : 'Aucun RIB disponible pour les virements'}
                  </div>
                </div>
                <span className={`tag ${selectedInf.documentsLegaux?.rib?.present ? 'tag-green' : 'tag-red'}`}>
                  {selectedInf.documentsLegaux?.rib?.present ? 'Conforme ✓' : 'Manquant ⚠️'}
                </span>
              </div>
              {selectedInf.documentsLegaux?.rib?.present && (
                <a href="#view" className="text-xs text-blue underline font-semibold" onClick={e => { e.preventDefault(); alert(`Aperçu du fichier: ${selectedInf.documentsLegaux.rib.nom}`); }}>
                  Aperçu du document
                </a>
              )}
            </div>
          </div>

          {/* Autres documents */}
          {selectedInf.documentsLegaux?.autresDocuments && selectedInf.documentsLegaux.autresDocuments.length > 0 && (
            <div className="mt-16">
              <h4 className="text-sm font-bold text-dark mb-8">Autres documents rattachés :</h4>
              <div className="flex gap-8 flex-wrap">
                {selectedInf.documentsLegaux.autresDocuments.map((doc, idx) => (
                  <span key={idx} className="tag tag-ghost p-8 border" style={{ fontSize: 11 }}>
                    📑 {doc.nom} <span className="text-muted">({doc.uploadDate})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3 : Score de Performance Globale */}
      {activeSubTab === 'scores' && (
        <div className="card">
          <h3 className="text-md font-bold text-dark mb-16">⭐ Score de Performance Globale des Influenceurs</h3>
          <p className="text-sm text-muted mb-16">Note synthétique calculée en fonction des statistiques d'engagement, du respect des délais et de la fiabilité globale.</p>

          <table className="table w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-8 text-xs font-semibold">Influenceur</th>
                <th className="py-8 text-xs font-semibold text-center">Score Globale</th>
                <th className="py-8 text-xs font-semibold text-center">Taux Engagement</th>
                <th className="py-8 text-xs font-semibold text-center">Qualité Créative</th>
                <th className="py-8 text-xs font-semibold text-center">Fiabilité & Délais</th>
                <th className="py-8 text-xs font-semibold text-center">Statut Recommandation</th>
              </tr>
            </thead>
            <tbody>
              {influencers.map(inf => {
                const score = inf.scorePerformance || inf.score || 3.5;
                const rec = score >= 4.0 ? 'Fortement Recommandé' : score >= 3.0 ? 'Recommandé sous condition' : 'À surveiller / Non recommandé';
                const recColor = score >= 4.0 ? 'var(--green)' : score >= 3.0 ? 'var(--orange)' : 'var(--red)';

                return (
                  <tr key={inf.id} className="border-b" style={{ borderColor: '#f1f1f1' }}>
                    <td className="py-12">
                      <div className="font-bold text-sm text-dark">@{inf.name}</div>
                      <div className="text-xs text-muted">{inf.realName} • {inf.platform}</div>
                    </td>
                    <td className="py-12 text-center">
                      <span className="text-lg font-bold" style={{ color: recColor }}>
                        {score} / 5 ⭐
                      </span>
                    </td>
                    <td className="py-12 text-center font-semibold text-sm">{inf.engagement}</td>
                    <td className="py-12 text-center text-sm">4.2 / 5</td>
                    <td className="py-12 text-center text-sm">
                      {inf.moralityCheck?.result === 'ok' ? '✅ Élevée' : '⚠️ Attention'}
                    </td>
                    <td className="py-12 text-center">
                      <span className="tag text-xs font-bold" style={{ background: recColor + '15', color: recColor }}>
                        {rec}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Import Document */}
      {showUploadDocModal && (
        <div className="inf-modal-overlay" onClick={() => setShowUploadDocModal(false)}>
          <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <button className="inf-modal-close" onClick={() => setShowUploadDocModal(false)}>✕</button>
            <h3 className="text-lg font-bold text-dark mb-16">Ajouter un document légal</h3>
            <p className="text-xs text-muted mb-12">Influenceur : <strong>@{selectedInf.name}</strong></p>

            <div className="form-group mb-12">
              <label className="form-label">Type de document</label>
              <select
                className="form-input"
                value={docTypeToUpload}
                onChange={e => setDocTypeToUpload(e.target.value)}
              >
                <option value="pieceIdentite">Pièce d'Identité (CNI / Passeport)</option>
                <option value="rib">Relevé d'Identité Bancaire (RIB)</option>
                <option value="autre">Autre document officiel</option>
              </select>
            </div>

            <div className="form-group mb-16">
              <label className="form-label">Fichier (PDF, JPG, PNG)</label>
              <input
                type="file"
                className="form-input"
                accept=".pdf, .jpg, .png"
                onChange={handleSimulateDocUpload}
              />
            </div>

            <div className="flex justify-end">
              <button className="btn btn-ghost" onClick={() => setShowUploadDocModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
