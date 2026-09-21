import React from 'react';
import { X, CheckCircle2, Calendar, Share2, Eye, DollarSign, Target, User } from 'lucide-react';

export default function ClientContentDetailModal({ content, isOpen, onClose }) {
  if (!isOpen || !content) return null;

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
          maxWidth: 680,
          borderRadius: 14,
          background: '#FFFFFF',
          padding: '24px 28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>📱</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--dark)' }}>
                {content.network}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>
                • {content.brand}
              </span>
              <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                {content.status}
              </span>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
              {content.title}
            </h3>
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

        <div className="space-y-16">
          {/* Post Copy / Message */}
          <div style={{ padding: '14px 16px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
              Texte de la publication (Copywriting)
            </div>
            <p style={{ fontSize: 13, color: '#1E293B', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
              « {content.message} »
            </p>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              padding: 14,
              borderRadius: 10,
              background: '#FAFAFA',
              border: '1px solid #E5E7EB',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 2 }}>
                📅 DATE & HEURE PROGRAMMÉE
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#FF7900' }}>
                {content.date} à {content.time}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 2 }}>
                📐 FORMAT VISUEL
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--dark)' }}>
                {content.format}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 2 }}>
                🎯 KPI ATTENDU
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#15803D' }}>
                {content.expectedKpi}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 2 }}>
                💰 BUDGET MÉDIA PRÉVU
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0369A1' }}>
                {content.mediaBudget || 'Organique'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 2 }}>
                👤 CRÉATEUR / COMMUNITY MANAGER
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--dark)' }}>
                {content.creator}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 14, borderTop: '1px solid #E5E7EB' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ fontSize: 12, fontWeight: 800 }}
          >
            Fermer
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              alert('Publication marquée comme validée avec succès.');
              onClose();
            }}
            style={{ fontSize: 12, fontWeight: 800, background: '#2E7D32', border: 'none' }}
          >
            ✓ Valider le contenu
          </button>
        </div>
      </div>
    </div>
  );
}
