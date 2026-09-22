import React, { useState } from 'react';

export default function ClientValidationModal({ item, initialAction = 'commenter', onClose, onConfirm }) {
  if (!item) return null;

  const [action, setAction] = useState(
    initialAction === 'modifier' ? 'modifications_demandees' :
    initialAction === 'refuser' ? 'refuse' :
    initialAction === 'reporter' ? 'reporte' :
    initialAction === 'approuve' ? 'approuve' : 'commenter'
  );
  const [commentText, setCommentText] = useState('');
  const [checklistState, setChecklistState] = useState(item.checklist || {});

  const handleToggleChecklist = (key) => {
    setChecklistState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(item.id, action, commentText, checklistState);
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
        background: 'rgba(0, 0, 0, 0.65)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        className="card animate-fade"
        style={{
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 16,
          background: '#FFFFFF',
          padding: 24,
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            color: 'var(--muted)'
          }}
        >
          ✕
        </button>

        <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
              {item.categoryLabel}
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              Échéance : {item.hoursRemaining}h restantes
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--dark)' }}>
            Arbitrage & Validation : {item.title}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sélection de l'action parmi les 5 options prescrites */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 8 }}>
              Décision Orange (Sélectionnez parmi les 5 options prescrites) :
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: 6 }}>
              <button
                type="button"
                onClick={() => setAction('approuve')}
                style={{
                  padding: '8px 6px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  border: action === 'approuve' ? '2px solid #16A34A' : '1px solid #CBD5E1',
                  background: action === 'approuve' ? '#DCFCE7' : '#FFF',
                  color: action === 'approuve' ? '#166534' : '#334155',
                  cursor: 'pointer'
                }}
              >
                ✓ Approuver
              </button>

              <button
                type="button"
                onClick={() => setAction('commenter')}
                style={{
                  padding: '8px 6px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  border: action === 'commenter' ? '2px solid #2563EB' : '1px solid #CBD5E1',
                  background: action === 'commenter' ? '#DBEAFE' : '#FFF',
                  color: action === 'commenter' ? '#1E40AF' : '#334155',
                  cursor: 'pointer'
                }}
              >
                💬 Commenter
              </button>

              <button
                type="button"
                onClick={() => setAction('modifications_demandees')}
                style={{
                  padding: '8px 6px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  border: action === 'modifications_demandees' ? '2px solid #F59E0B' : '1px solid #CBD5E1',
                  background: action === 'modifications_demandees' ? '#FEF3C7' : '#FFF',
                  color: action === 'modifications_demandees' ? '#92400E' : '#334155',
                  cursor: 'pointer'
                }}
              >
                ✏️ Modifications
              </button>

              <button
                type="button"
                onClick={() => setAction('refuse')}
                style={{
                  padding: '8px 6px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  border: action === 'refuse' ? '2px solid #EF4444' : '1px solid #CBD5E1',
                  background: action === 'refuse' ? '#FEE2E2' : '#FFF',
                  color: action === 'refuse' ? '#991B1B' : '#334155',
                  cursor: 'pointer'
                }}
              >
                ✗ Refuser
              </button>

              <button
                type="button"
                onClick={() => setAction('reporte')}
                style={{
                  padding: '8px 6px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  border: action === 'reporte' ? '2px solid #8B5CF6' : '1px solid #CBD5E1',
                  background: action === 'reporte' ? '#F3E8FF' : '#FFF',
                  color: action === 'reporte' ? '#6B21A8' : '#334155',
                  cursor: 'pointer'
                }}
              >
                ⏱ Reporter
              </button>
            </div>
          </div>

          {/* Saisie de commentaire / note explicative */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
              Commentaire, modifications demandées ou motif de décision :
            </label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Indiquez ici les corrections attendues, le cadrage ou la confirmation..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ width: '100%', fontSize: 12, padding: 10, borderRadius: 8 }}
            />
          </div>

          {/* Checklist de Conformité (9 points interactifs) */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0'
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--dark)', marginBottom: 8, textTransform: 'uppercase' }}>
              Checklist de Conformité Orange (Cocher pour certifier) :
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 6, fontSize: 11 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(checklistState.logoCharteConforme)}
                  onChange={() => handleToggleChecklist('logoCharteConforme')}
                />
                1. Logo & Charte de marque
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(checklistState.offreConditionsCorrectes)}
                  onChange={() => handleToggleChecklist('offreConditionsCorrectes')}
                />
                2. Exactitude offre & tarifs
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(checklistState.ctaLienVerifies)}
                  onChange={() => handleToggleChecklist('ctaLienVerifies')}
                />
                3. CTA & code redirection
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(checklistState.mentionsLegalesIncluses)}
                  onChange={() => handleToggleChecklist('mentionsLegalesIncluses')}
                />
                4. Mention #PartenariatOrange
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(checklistState.droitsMusicauxImagesValides)}
                  onChange={() => handleToggleChecklist('droitsMusicauxImagesValides')}
                />
                5. Droits musicaux & image
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(checklistState.absenceConflitExclusivite)}
                  onChange={() => handleToggleChecklist('absenceConflitExclusivite')}
                />
                6. Absence conflit exclusivité
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(checklistState.dateCanalCoherents)}
                  onChange={() => handleToggleChecklist('dateCanalCoherents')}
                />
                7. Date & canal cohérents
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(checklistState.validationOrangeObtenue)}
                  onChange={() => handleToggleChecklist('validationOrangeObtenue')}
                />
                8. Accord formel Orange
              </label>
            </div>
          </div>

          {/* Boutons validation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 10 }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              style={{ fontWeight: 600 }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                fontWeight: 800,
                background: '#FF7900',
                border: 'none',
                padding: '8px 20px',
                borderRadius: 8
              }}
            >
              Enregistrer la Décision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
