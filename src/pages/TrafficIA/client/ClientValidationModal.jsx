import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Edit3, Clock, XCircle, AlertTriangle } from 'lucide-react';

export default function ClientValidationModal({
  validation,
  actionType = 'commenter', // 'commenter' | 'modifier' | 'repousser' | 'refuser'
  isOpen,
  onClose,
  onSubmitAction,
}) {
  const [commentText, setCommentText] = useState('');
  const [postponedDate, setPostponedDate] = useState('2026-09-28');

  if (!isOpen || !validation) return null;

  const getActionConfig = () => {
    switch (actionType) {
      case 'modifier':
        return {
          title: 'Demander une modification précise',
          badge: 'Révision demandée',
          icon: <Edit3 size={18} className="text-amber-600" />,
          color: '#E65100',
          btnText: 'Transmettre la demande de révision',
          desc: 'Indiquez avec précision les éléments textuels, visuels ou de timing à retravailler.',
        };
      case 'repousser':
        return {
          title: 'Repousser l’échéance de décision',
          badge: 'Report de deadline',
          icon: <Clock size={18} className="text-gray-600" />,
          color: '#4B5563',
          btnText: 'Confirmer le report',
          desc: 'Fixez une nouvelle date cible d’arbitrage Orange.',
        };
      case 'refuser':
        return {
          title: 'Refuser / Ne pas retenir',
          badge: 'Refus motivé',
          icon: <XCircle size={18} className="text-red-600" />,
          color: '#C62828',
          btnText: 'Confirmer le refus motivé',
          desc: 'Veuillez motiver le refus pour permettre à McCann d’adapter ses propositions futures.',
        };
      default:
        return {
          title: 'Ajouter un commentaire ou une consigne',
          badge: 'Commentaire',
          icon: <MessageSquare size={18} className="text-blue-600" />,
          color: '#0284C7',
          btnText: 'Envoyer le commentaire',
          desc: 'Votre message sera immédiatement notifié au Traffic et au Lead créa McCann.',
        };
    }
  };

  const config = getActionConfig();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitAction({
      validationId: validation.id,
      actionType,
      comment: commentText,
      postponedDate: actionType === 'repousser' ? postponedDate : null,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 620,
          borderRadius: 14,
          background: '#FFFFFF',
          padding: '24px 28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {config.icon}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
                {config.title}
              </h3>
              <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)' }}>
                Dossier {validation.ticketId} • {validation.entity}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>
            {validation.subject}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            {config.desc}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-14">
          {actionType === 'repousser' && (
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
                Nouvelle date limite souhaitée
              </label>
              <input
                type="date"
                required
                value={postponedDate}
                onChange={e => setPostponedDate(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, marginBottom: 4, color: '#374151' }}>
              {actionType === 'refuser' ? 'Motif du refus *' : actionType === 'modifier' ? 'Modifications demandées *' : 'Votre commentaire / annotation'}
            </label>
            <textarea
              rows={4}
              required={actionType === 'modifier' || actionType === 'refuser'}
              placeholder="Rédigez vos consignes ici..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, paddingTop: 10, borderTop: '1px solid #E5E7EB' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              style={{ fontSize: 12, fontWeight: 800 }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{
                fontSize: 12,
                fontWeight: 800,
                background: config.color,
                border: 'none',
                padding: '8px 16px',
              }}
            >
              {config.btnText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
