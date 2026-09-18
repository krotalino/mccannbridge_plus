import React from 'react';
import MiniSparkline from './MiniSparkline';

export const PLATFORMS = {
  tiktok: { label: 'TikTok', icon: '🎵', tone: 'tag-purple' },
  facebook: { label: 'Facebook', icon: '📘', tone: 'tag-blue' },
  instagram: { label: 'Instagram', icon: '📸', tone: 'tag-orange' },
  youtube: { label: 'YouTube', icon: '▶️', tone: 'tag-red' },
  website: { label: 'Web / Presse', icon: '🌐', tone: 'tag-muted' },
  unknown: { label: 'Non spécifié', icon: '🔗', tone: 'tag-muted' },
};

export const DELIVERABLE_STATUSES = [
  { id: 'livrable_soumis', label: 'Soumis / À valider', badge: 'tag-orange' },
  { id: 'valide', label: 'Validé', badge: 'tag-green' },
  { id: 'publie', label: 'Publié', badge: 'tag-blue' },
  { id: 'a_corriger', label: 'À corriger', badge: 'tag-yellow' },
  { id: 'refuse', label: 'Refusé', badge: 'tag-red' },
];

export const QUALITY_STATUSES = {
  valid: { label: 'Complète', badge: 'tag-green' },
  incomplete: { label: 'Incomplète', badge: 'tag-yellow' },
  inconsistent: { label: 'Incohérente', badge: 'tag-red' },
  to_review: { label: 'À revoir', badge: 'tag-muted' },
};

export const TALENT_TYPES = {
  influencer: { label: 'Influenceur', badge: 'tag-orange' },
  ambassador: { label: 'Ambassadeur', badge: 'tag-blue' },
  ambassador_admin: { label: 'Admin Ambassadeurs', badge: 'tag-purple' },
  page_relais: { label: 'Page Relais', badge: 'tag-yellow' },
  webzine: { label: 'Webzine', badge: 'tag-muted' },
};

export const formatNumber = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(val).toLocaleString('fr-FR');
};

// Map legacy ifx classes to Dashboard Analytics tags
const TONE_MAP = {
  'ifx-b-orange': 'tag-orange',
  'ifx-b-green': 'tag-green',
  'ifx-b-blue': 'tag-blue',
  'ifx-b-red': 'tag-red',
  'ifx-b-yellow': 'tag-yellow',
  'ifx-b-purple': 'tag-purple',
  'ifx-b-gray': 'tag-muted',
};

export function Badge({ tone = 'tag-muted', children, style }) {
  const resolvedClass = TONE_MAP[tone] || tone || 'tag-muted';
  return (
    <span className={`tag ${resolvedClass.startsWith('tag-') ? resolvedClass : `tag-${resolvedClass}`}`} style={style}>
      {children}
    </span>
  );
}

export function PlatformIcon({ platform }) {
  const p = PLATFORMS[platform] || PLATFORMS.unknown;
  return (
    <span title={p.label} style={{ fontSize: 13, marginRight: 4, display: 'inline-flex', alignItems: 'center' }}>
      {p.icon}
    </span>
  );
}

// Composant Carte KPI conforme au Dashboard Analytics
export function AnalyticsKpiCard({
  title,
  tag,
  tagColor = 'tag-orange',
  value,
  sparklineData = [12, 18, 15, 22, 28, 24, 30],
  sparklineColor = '#FF7900',
  trend = '+14.2%',
  trendLabel = 'vs période préc.',
  isPositive = true,
  onClick,
  clickable = false
}) {
  return (
    <div
      className={`card p-16 ${clickable ? 'cursor-pointer' : ''}`}
      onClick={clickable ? onClick : undefined}
      style={{
        borderRadius: 12,
        border: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.15s ease',
        boxShadow: clickable ? '0 2px 6px rgba(0,0,0,0.04)' : undefined,
        marginBottom: 0
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          {title}
        </span>
        {tag && (
          <span className={`tag ${tagColor}`} style={{ fontSize: 11, fontWeight: 700 }}>
            {tag}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, marginTop: 4 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--dark)', letterSpacing: '-0.5px' }}>
          {value}
        </div>
        {sparklineData && (
          <MiniSparkline data={sparklineData} color={sparklineColor} />
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
        <span style={{ color: isPositive ? '#27AE60' : '#E74C3C', fontWeight: 700 }}>
          {trend ? (isPositive ? `▲ ${trend}` : `▼ ${trend}`) : '✓ Nominal'}
        </span>
        <span style={{ color: 'var(--muted)' }}>{trendLabel}</span>
      </div>
    </div>
  );
}

// Modal conforme au design system Dashboard Analytics / Traffic Manager
export function Modal({ title, subtitle, onClose, width = 720, children, category = 'INFLUENCE & TALENTS' }) {
  return (
    <div
      className="modal-backdrop animate-fade"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: 16
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card animate-fade"
        style={{
          width: '100%',
          maxWidth: width,
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 14,
          padding: 0,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          backgroundColor: '#FFFFFF',
          marginBottom: 0
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* En-tête style Traffic Manager / Dashboard Analytics */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
            color: '#FFF',
            borderBottom: '3px solid #FF7900',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FF7900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {category}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: '2px 0 0 0', letterSpacing: '-0.3px', color: '#FFFFFF' }}>
                {title}
              </h2>
              {subtitle && (
                <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.75)', marginTop: 4 }}>
                  {subtitle}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFF',
                fontSize: 22,
                cursor: 'pointer',
                opacity: 0.8,
                lineHeight: 1,
                padding: '4px 8px',
                borderRadius: 6
              }}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Corps de la modal */}
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}
