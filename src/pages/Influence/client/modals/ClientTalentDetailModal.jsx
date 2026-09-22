import React from 'react';

export default function ClientTalentDetailModal({ talent, onClose }) {
  if (!talent) return null;

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
          maxWidth: 750,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 16,
          background: '#FFFFFF',
          padding: 24,
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}
      >
        {/* Bouton fermeture */}
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

        {/* En-tête : Photo, Nom, Score McCann */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #E5E7EB' }}>
          <img
            src={talent.photo}
            alt={talent.displayName}
            referrerPolicy="no-referrer"
            style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', border: '3px solid #FF7900' }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--dark)' }}>
                {talent.displayName}
              </h3>
              <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
                {talent.category}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
              {talent.pseudo} • 📍 {talent.city}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#DCFCE7', color: '#166534' }}>
                ✓ {talent.statusLabel}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#FFF3E8', color: '#E65100' }}>
                Brand Fit Score : {talent.mccannRecommendation?.score}/100
              </span>
            </div>
          </div>
        </div>

        {/* Note de confidentialité Agence */}
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            fontSize: 11,
            color: '#64748B',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span>🔒</span>
          <span>
            <strong>Confidentialité certifiée :</strong> Fiche client sans données de négociation interne, coordonnées privées ou marges d'agence.
          </span>
        </div>

        <div className="space-y-4">
          {/* Biographie & Univers Éditorial */}
          <div>
            <h5 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
              Biographie & Univers Éditorial :
            </h5>
            <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
              {talent.bio}
            </p>
          </div>

          {/* Démographie & Audience Principale */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: '#F8FAFC',
              border: '1px solid #F1F5F9'
            }}
          >
            <h5 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
              Audience & Répartition Démographique :
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, fontSize: 11, color: '#334155' }}>
              <div><strong>Tranches d’âge :</strong> {talent.primaryAudience?.age}</div>
              <div><strong>Genre :</strong> {talent.primaryAudience?.gender}</div>
              <div><strong>Géographie :</strong> {talent.primaryAudience?.location}</div>
              <div><strong>Centres d’intérêt :</strong> {talent.primaryAudience?.interests}</div>
            </div>
          </div>

          {/* Avis Stratégique & Recommandation McCann */}
          <div
            style={{
              padding: '14px',
              borderRadius: 10,
              background: '#FFF9F5',
              border: '1px solid #FFE4D0'
            }}
          >
            <h5 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: '#E65100' }}>
              Avis Stratégique McCann — Pourquoi ce profil pour Orange ?
            </h5>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#334155', lineHeight: 1.5 }}>
              {talent.mccannRecommendation?.strategicRationale}
            </p>
            <div style={{ fontSize: 11, color: '#9A3412', fontWeight: 700 }}>
              Offres Orange recommandées : {talent.mccannRecommendation?.recommendedOffer}
            </div>
          </div>

          {/* Brand Safety & Vigilance */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <strong style={{ fontSize: 12, color: '#166534' }}>
                Niveau de Vigilance & Brand Safety : {talent.brandSafety?.riskLevel}
              </strong>
            </div>
            <div style={{ fontSize: 11, color: '#15803D', lineHeight: 1.4 }}>
              {talent.brandSafety?.vigilanceNotes}
            </div>
            <div style={{ fontSize: 11, color: '#166534', marginTop: 4 }}>
              <strong>Cadrage requis :</strong> {talent.brandSafety?.framingGuidelines}
            </div>
          </div>

          {/* Statut Juridique & Conformité */}
          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 11 }}>
            <strong style={{ color: 'var(--dark)' }}>Engagement d’Exclusivité :</strong>{' '}
            <span style={{ color: '#475569' }}>{talent.complianceBadge?.exclusivityDetails}</span>
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            style={{ fontWeight: 700, padding: '8px 18px', borderRadius: 8 }}
          >
            Fermer la Fiche
          </button>
        </div>
      </div>
    </div>
  );
}
