import React, { useState } from 'react';

export default function ClientFinancialActionModal({
  action,
  actionType = 'valider', // 'valider' | 'refuser' | 'commenter'
  onClose,
  onSubmit,
  formatMoney,
}) {
  const [comment, setComment] = useState('');
  const [isSignedCheck, setIsSignedCheck] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!action) return null;

  const isValidation = actionType === 'valider';
  const isRefusal = actionType === 'refuser';

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({
        actionId: action.id || action.reference,
        type: actionType,
        comment,
        signed: isSignedCheck,
      });
      setSubmitting(false);
      onClose();
    }, 400);
  };

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
          maxWidth: 540,
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>
              {isValidation ? '✍️' : isRefusal ? '⚠️' : '💬'}
            </span>
            <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
              {isValidation ? 'Validation & Signature Électronique' : isRefusal ? 'Demande de Correction / Réserve' : 'Ajouter un Commentaire'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Détails de la pièce concernée */}
        <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 12, border: '1px solid #E2E8F0', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
            {action.titre || action.reference || action.typeLabel}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Campagne : {action.campagne || 'Orange Cameroun'} • Montant :{' '}
            <strong style={{ color: '#059669' }}>
              {action.montant ? formatMoney(action.montant) : action.montantTTC ? formatMoney(action.montantTTC) : 'Non tarifé'}
            </strong>
          </div>
        </div>

        {/* Champ Commentaire */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 4 }}>
            {isRefusal ? 'Motif précis de la demande de correction (obligatoire) :' : 'Commentaires ou observations (optionnel) :'}
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              isRefusal
                ? 'Ex : Écart constaté sur le coût unitaire des créateurs, merci de réviser la proforma selon le devis initial...'
                : 'Ex : Bon pour accord pour lancement immédiat de la phase live...'
            }
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #CBD5E1',
              fontSize: 12,
              outline: 'none',
            }}
          />
        </div>

        {/* Signature formelle pour validation */}
        {isValidation && (
          <div
            style={{
              background: '#FFF8F2',
              borderRadius: 8,
              padding: '10px 12px',
              border: '1px solid #FFD3B0',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <input
              type="checkbox"
              id="signCheck"
              checked={isSignedCheck}
              onChange={(e) => setIsSignedCheck(e.target.checked)}
              style={{ marginTop: 2, cursor: 'pointer' }}
            />
            <label htmlFor="signCheck" style={{ fontSize: 11, color: '#92400E', cursor: 'pointer', lineHeight: 1.4 }}>
              <strong>Signature certifiée Orange Cameroun :</strong> En cochant cette case, j’atteste que je dispose du pouvoir d’engagement nécessaire pour valider cette opération financière conformément au contrat d’agence cadre.
            </label>
          </div>
        )}

        {/* Boutons d'action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost"
            style={{ border: '1px solid #CBD5E1' }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || (isValidation && !isSignedCheck) || (isRefusal && !comment.trim())}
            className="btn btn-sm"
            style={{
              background: isValidation ? '#FF7900' : isRefusal ? '#DC2626' : '#1E293B',
              color: '#FFFFFF',
              fontWeight: 800,
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              opacity: (isValidation && !isSignedCheck) || (isRefusal && !comment.trim()) ? 0.5 : 1,
            }}
          >
            {submitting ? 'Traitement...' : isValidation ? 'Confirmer l’Approbation' : isRefusal ? 'Envoyer la Demande' : 'Enregistrer le Commentaire'}
          </button>
        </div>
      </div>
    </div>
  );
}
