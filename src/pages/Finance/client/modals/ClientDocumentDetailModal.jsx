import React from 'react';

export default function ClientDocumentDetailModal({
  document,
  onClose,
  formatMoney,
  onOpenActionModal,
}) {
  if (!document) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card p-20 animate-fade"
        style={{
          width: '100%',
          maxWidth: 620,
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Entête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 6,
                background: '#FF7900',
                color: '#FFFFFF',
              }}
            >
              {document.type}
            </span>
            <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
              {document.reference}
            </h3>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>({document.version || 'v1.0'})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Informations Métier */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>ENTITÉ & CLIENT</div>
            <strong style={{ fontSize: 13, color: 'var(--dark)' }}>{document.clientEntite}</strong>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{document.campagne}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>STATUT CONTRACTUEL</div>
            <strong style={{ fontSize: 13, color: '#FF7900' }}>{document.statut}</strong>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              Émis le : {document.dateEmission} • Échéance : {document.dateEcheance}
            </div>
          </div>
        </div>

        {/* Décomposition Financière HT / TVA / TTC */}
        {document.montantTTC > 0 && (
          <div
            style={{
              background: '#FFF9F5',
              border: '1px solid #FFD3B0',
              borderRadius: 10,
              padding: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#B45309', marginBottom: 8 }}>
              DÉCOMPOSITION FISCALE & RÈGLEMENT CEMAC
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>Montant Hors Taxes (HT) :</span>
              <strong>{formatMoney(document.montantHT)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span>TVA Légale CEMAC (19.25%) :</span>
              <strong>{formatMoney(document.tva)}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
                fontWeight: 900,
                color: '#1E293B',
                borderTop: '1.5px solid #FFD3B0',
                paddingTop: 6,
              }}
            >
              <span>TOTAL TOUTES TAXES COMPRISES (TTC) :</span>
              <span style={{ color: '#059669' }}>{formatMoney(document.montantTTC)}</span>
            </div>
          </div>
        )}

        {/* Pièces jointes vérifiées */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>
            PIÈCES JOINTES TÉLÉCHARGEABLES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(document.piecesJointes || ['Document_Officiel.pdf']).map((p, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#F8FAFC',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  fontSize: 12,
                }}
              >
                <span>📎 {p}</span>
                <button
                  type="button"
                  onClick={() => alert(`Téléchargement certifié de ${p} en cours...`)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    background: '#FF7900',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Télécharger PDF
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Responsables & Droits */}
        <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>
          <div>👨‍💼 Superviseur McCann : <strong>{document.responsableMcCann || 'Direction McCann Douala'}</strong></div>
          <div style={{ marginTop: 2 }}>✍️ Valideur Orange : <strong>{document.valideurOrange || 'Direction Orange Cameroun'}</strong></div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost"
            style={{ border: '1px solid #CBD5E1' }}
          >
            Fermer
          </button>
          {document.actionType && document.actionType !== 'none' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenActionModal(document);
              }}
              className="btn btn-sm"
              style={{ background: '#FF7900', color: '#FFFFFF', fontWeight: 800, border: 'none' }}
            >
              Procéder à la validation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
