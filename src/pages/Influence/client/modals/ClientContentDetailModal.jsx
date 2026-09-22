import React from 'react';

export default function ClientContentDetailModal({ content, onClose, onNavigateTab }) {
  if (!content) return null;

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
              {content.platform.toUpperCase()} • {content.format}
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              {content.statusLabel}
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--dark)' }}>
            {content.title}
          </h3>
        </div>

        {/* Aperçu visuel */}
        <div style={{ borderRadius: 10, overflow: 'hidden', height: 220, marginBottom: 16 }}>
          <img
            src={content.draftPreviewUrl}
            alt={content.title}
            referrerPolicy="no-referrer"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="space-y-4">
          {/* Légende / Caption */}
          <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
            <h5 style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>
              Légende / Caption Complète :
            </h5>
            <p style={{ margin: 0, fontSize: 12, color: '#334155', lineHeight: 1.5 }}>
              {content.caption}
            </p>
          </div>

          {/* Hashtags & Mentions */}
          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#FFF9F5', border: '1px solid #FFE4D0', fontSize: 11 }}>
            <div><strong>CTA :</strong> {content.cta}</div>
            <div style={{ marginTop: 4 }}><strong>Hashtags :</strong> {content.hashtags?.join(' ')}</div>
            <div style={{ marginTop: 4, color: '#FF7900', fontWeight: 700 }}>
              {content.partnershipMentionIncluded ? '✓ Mention #PartenariatOrange incluse' : '⚠️ Mention obligatoire absente'}
            </div>
          </div>

          {/* Dates de la chaîne */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, fontSize: 11 }}>
            <div style={{ padding: '8px', borderRadius: 6, background: '#F1F5F9' }}>
              <div style={{ color: 'var(--muted)' }}>Tournage</div>
              <div style={{ fontWeight: 700 }}>{content.dateShooting}</div>
            </div>
            <div style={{ padding: '8px', borderRadius: 6, background: '#F1F5F9' }}>
              <div style={{ color: 'var(--muted)' }}>Soumission BAT</div>
              <div style={{ fontWeight: 700 }}>{content.dateBatSubmission}</div>
            </div>
            <div style={{ padding: '8px', borderRadius: 6, background: '#F1F5F9' }}>
              <div style={{ color: 'var(--muted)' }}>Validation Orange</div>
              <div style={{ fontWeight: 700 }}>{content.dateOrangeValidation}</div>
            </div>
            <div style={{ padding: '8px', borderRadius: 6, background: '#FFF3E8' }}>
              <div style={{ color: '#E65100' }}>Publication Prévue</div>
              <div style={{ fontWeight: 800, color: '#E65100' }}>
                {new Date(content.datePublicationScheduled).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Relais Média */}
          <div style={{ fontSize: 11, color: '#64748B' }}>
            <strong>Dispositif de relais :</strong> {content.organicOrPaidRelay}
          </div>

          {/* Lien publié si disponible */}
          {content.publishedUrl && (
            <div style={{ padding: '10px 12px', borderRadius: 8, background: '#ECFDF5', border: '1px solid #A7F3D0', fontSize: 11 }}>
              <strong>Lien public de diffusion :</strong>{' '}
              <a href={content.publishedUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: 700 }}>
                {content.publishedUrl} ↗
              </a>
            </div>
          )}
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
