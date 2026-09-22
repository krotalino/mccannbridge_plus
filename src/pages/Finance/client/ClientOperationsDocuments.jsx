import React, { useState } from 'react';

export default function ClientOperationsDocuments({
  documents = [],
  formatMoney,
  onOpenDocumentDetail,
  onOpenActionModal,
}) {
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDocs = documents.filter((d) => {
    if (docTypeFilter !== 'all' && d.type !== docTypeFilter) return false;
    if (statusFilter !== 'all' && d.statut !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-16 animate-fade">
      {/* ─── BANDEAU DE GOUVERNANCE & CONFIDENTIALITÉ ─── */}
      <div
        className="card p-14"
        style={{
          borderRadius: 12,
          border: '1px solid #C8E6C9',
          background: '#F1F8E9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#2E7D32' }}>
              REGISTRE DOCUMENTAIRE PARTAGÉ — PÉRIMÈTRE VISIBLE ORANGE CAMEROUN
            </div>
            <div style={{ fontSize: 11, color: '#33691E' }}>
              Ce registre contient exclusivement les pièces contractuelles partagées (BC, Devis, Avenants, Factures, Reçus, Justificatifs).
              Les données internes d'agence (factures fournisseurs, marges et feuilles de temps McCann) sont strictement isolées.
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 12,
            background: '#2E7D32',
            color: '#FFFFFF',
          }}
        >
          Auditabilité OHADA / CEMAC
        </span>
      </div>

      {/* ─── FILTRES DU REGISTRE DOCUMENTAIRE ─── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Tous les types' },
            { id: 'BC', label: 'Bons de Commande (BC)' },
            { id: 'Devis', label: 'Devis' },
            { id: 'Proforma', label: 'Proformas' },
            { id: 'Avenant', label: 'Avenants' },
            { id: 'Facture', label: 'Factures Client' },
            { id: 'Reçu', label: 'Reçus de Paiement' },
            { id: 'RapportExecution', label: 'Rapports d’Exécution' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDocTypeFilter(item.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 800,
                border: docTypeFilter === item.id ? '2px solid #FF7900' : '1px solid #CBD5E1',
                background: docTypeFilter === item.id ? '#FFF8F2' : '#FFFFFF',
                color: docTypeFilter === item.id ? '#D35400' : '#475569',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
          {filteredDocs.length} pièce(s) documentaire(s) conforme(s)
        </div>
      </div>

      {/* ─── TABLEAU DU REGISTRE DOCUMENTAIRE ─── */}
      <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: 'var(--muted)', fontSize: 11 }}>
                <th style={{ padding: '10px 12px' }}>DOCUMENT & RÉFÉRENCE</th>
                <th style={{ padding: '10px 12px' }}>CAMPAGNE / ENTITÉ</th>
                <th style={{ padding: '10px 12px' }}>MONTANT TTC</th>
                <th style={{ padding: '10px 12px' }}>ÉMISSION & ÉCHÉANCE</th>
                <th style={{ padding: '10px 12px' }}>STATUT NORMALISÉ</th>
                <th style={{ padding: '10px 12px' }}>ACTION REQUISE ORANGE</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => {
                const needsAction = doc.actionType !== 'none';
                return (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    {/* Document & Réf */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: 6,
                            background: '#F1F5F9',
                            color: '#1E293B',
                          }}
                        >
                          {doc.type}
                        </span>
                        <strong style={{ color: '#FF7900' }}>{doc.reference}</strong>
                        <span style={{ fontSize: 10, color: 'var(--muted)' }}>({doc.version})</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                        {doc.typeLabel}
                      </div>
                    </td>

                    {/* Campagne */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{doc.campagne}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{doc.clientEntite}</div>
                    </td>

                    {/* Montant TTC */}
                    <td style={{ padding: '12px' }}>
                      {doc.montantTTC > 0 ? (
                        <div>
                          <div style={{ fontWeight: 800, color: '#1E293B' }}>{formatMoney(doc.montantTTC)}</div>
                          <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                            HT: {formatMoney(doc.montantHT)} (TVA 19.25%)
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>Justificatif d’exécution</span>
                      )}
                    </td>

                    {/* Dates */}
                    <td style={{ padding: '12px' }}>
                      <div>Émis le : <strong>{doc.dateEmission}</strong></div>
                      <div style={{ fontSize: 11, color: doc.dateEcheance !== '—' ? '#D97706' : 'var(--muted)' }}>
                        Échéance : {doc.dateEcheance}
                      </div>
                    </td>

                    {/* Statut */}
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 10,
                          background: doc.statut.includes('Validé') || doc.statut.includes('Réglé')
                            ? '#E8F5E9'
                            : doc.statut.includes('validation')
                            ? '#FEF3C7'
                            : '#F1F5F9',
                          color: doc.statut.includes('Validé') || doc.statut.includes('Réglé')
                            ? '#2E7D32'
                            : doc.statut.includes('validation')
                            ? '#B45309'
                            : '#475569',
                        }}
                      >
                        {doc.statut}
                      </span>
                    </td>

                    {/* Action attendue */}
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          color: needsAction ? '#DC2626' : 'var(--muted)',
                          fontWeight: needsAction ? 700 : 500,
                        }}
                      >
                        {doc.actionRequiseClient}
                      </span>
                    </td>

                    {/* Actions interactives */}
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => onOpenDocumentDetail(doc)}
                          className="btn btn-xs"
                          style={{ background: '#F1F5F9', color: '#1E293B', fontWeight: 700, border: '1px solid #CBD5E1' }}
                        >
                          👁️ Voir
                        </button>

                        {needsAction && (
                          <button
                            type="button"
                            onClick={() => onOpenActionModal(doc)}
                            className="btn btn-xs"
                            style={{ background: '#FF7900', color: '#FFFFFF', fontWeight: 800, border: 'none' }}
                          >
                            ✍️ Valider
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
