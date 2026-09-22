import React from 'react';

export default function ClientRecommendationModal({
  recommendation,
  onClose,
  onUpdateStatus
}) {
  if (!recommendation) return null;

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
              Fiche Méthodologique en 6 Points
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              Émise le {recommendation.date}
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--dark)' }}>
            {recommendation.title}
          </h3>
        </div>

        <div className="space-y-3">
          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 2 }}>
              1. Constat Factuel :
            </div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
              {recommendation.constat}
            </div>
          </div>

          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 2 }}>
              2. Preuve Chiffrée :
            </div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
              {recommendation.preuve}
            </div>
          </div>

          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 2 }}>
              3. Interprétation Stratégique :
            </div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
              {recommendation.interpretation}
            </div>
          </div>

          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#FFF9F5', border: '1px solid #FFE4D0' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#E65100', marginBottom: 2 }}>
              4. Décision Recommandée :
            </div>
            <div style={{ fontSize: 12, color: '#334155', fontWeight: 800 }}>
              {recommendation.decisionLabel}
            </div>
          </div>

          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#1D4ED8', marginBottom: 2 }}>
              5. Hypothèse de Test Cadrée :
            </div>
            <div style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.4 }}>
              {recommendation.hypotheseTest}
            </div>
          </div>

          <div style={{ padding: '12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
              6. Statut de la Décision Orange :
            </div>
            <select
              className="form-control"
              value={recommendation.statutDecisionOrange}
              onChange={(e) => {
                onUpdateStatus(recommendation.id, e.target.value);
              }}
              style={{ width: '100%', height: 36, fontSize: 12, fontWeight: 700, borderRadius: 8 }}
            >
              <option value="a_examiner">À examiner par Orange (Comité Comms)</option>
              <option value="accepte">Accepté par Orange (Mise en œuvre)</option>
              <option value="en_test">En cours de test (Phase pilote)</option>
              <option value="cloture">Clôturé / Archivé</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ fontWeight: 700 }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
