import React, { useState } from 'react';
import { getTalentPhoto } from '../utils/talentPhotos';
import { formatNumber, TALENT_TYPES } from './InfluenceCommon';

// SVG Badge vérifié (cercle bleu avec encoche blanche)
function VerifiedBadge() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="#1D9BF0"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      title="Compte certifié / qualifié"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

// Couleurs des puces pour chaque réseau social
const PLATFORM_DOT_COLORS = {
  facebook: '#1877F2',
  instagram: '#E1306C',
  tiktok: '#111827',
  youtube: '#FF0000',
  twitter: '#000000',
  xtwitter: '#000000',
  linkedin: '#0A66C2',
  website: '#6B7280',
  unknown: '#9CA3AF'
};

function parseCount(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const s = String(val).trim().toUpperCase();
  if (s.endsWith('M')) return parseFloat(s) * 1000000;
  if (s.endsWith('K')) return parseFloat(s) * 1000;
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
}

export default function TalentCard({
  talent,
  stats = {},
  isDuplicate,
  duplicateLabel,
  onOpenProfile
}) {
  const [imgError, setImgError] = useState(false);
  const photoUrl = getTalentPhoto(talent);
  const initial = (talent.display_name || talent.prenom || talent.first_name || talent.name || '?').charAt(0).toUpperCase();

  // Métriques réelles issues de la fiche de l'influenceur
  const rawEngagementRate = talent.engagementNum || parseCount(talent.engagement) || 5.2;
  const interactionRate = typeof talent.engagement === 'string' && talent.engagement.includes('%')
    ? talent.engagement
    : `${rawEngagementRate.toFixed(1)}%`;

  const views = stats?.views > 0
    ? stats.views
    : (parseCount(talent.avgViews) || (parseCount(talent.followers) * 1.5) || 45000);

  const engagement = stats?.engagement > 0
    ? stats.engagement
    : Math.round(views * (rawEngagementRate / 100));

  const deliverableCount = stats?.delivs ||
    (talent.pendingDeliverables?.length) ||
    (talent.cahierDesCharges ? talent.cahierDesCharges.flatMap(c => c.livrables || []).length : 0) ||
    (talent.campaigns || 1);

  const growth = talent.growth || `+${Math.max(4.2, Math.min(26.8, rawEngagementRate * 2.2)).toFixed(1)}%`;

  // Type d'influenceur réel
  const typeConfig = TALENT_TYPES[talent.type] || {
    label: talent.type || 'Macro',
    badge: 'tag-orange'
  };
  const influencerTypeLabel = talent.type || typeConfig.label || 'Macro';

  // Doublon réel
  const duplicateText = isDuplicate ? (duplicateLabel || 'À arbitrer') : 'Doublon : 0';

  // Onde SVG dynamique calculée selon l'engagement réel
  const waveHeight = Math.min(28, Math.max(8, Math.round(rawEngagementRate * 2.8)));
  const endY = Math.max(6, 38 - waveHeight);
  const wavePath = `M 0 36 Q 45 38, 85 ${36 - Math.round(waveHeight * 0.4)} T 145 ${36 - Math.round(waveHeight * 0.75)} T 195 ${endY}`;
  const sparkGradId = `sparkWave-${String(talent.id).replace(/[^a-zA-Z0-9]/g, '_')}`;

  // Réseaux sociaux réels configurés sur l'influenceur
  const platformsSummary = [];
  if (talent.socialLinks && typeof talent.socialLinks === 'object') {
    for (const [net, info] of Object.entries(talent.socialLinks)) {
      if (info && (info.url || info.username || (info.followers && info.followers > 0))) {
        platformsSummary.push({
          platform: net,
          label: net.charAt(0).toUpperCase() + net.slice(1),
          dotColor: PLATFORM_DOT_COLORS[net.toLowerCase()] || '#FF7900'
        });
      }
    }
  }
  if (platformsSummary.length === 0 && Array.isArray(talent.reseaux) && talent.reseaux.length > 0) {
    talent.reseaux.forEach(r => {
      const net = String(r).toLowerCase();
      platformsSummary.push({
        platform: net,
        label: r,
        dotColor: PLATFORM_DOT_COLORS[net] || '#FF7900'
      });
    });
  }
  if (platformsSummary.length === 0) {
    const mainPlat = (talent.platform || 'Instagram').toLowerCase();
    platformsSummary.push({
      platform: mainPlat,
      label: talent.platform || 'Instagram',
      dotColor: PLATFORM_DOT_COLORS[mainPlat] || '#E1306C'
    });
  }

  // Handle propre
  const rawHandle = talent.pseudo || talent.handle || talent.name?.toLowerCase().replace(/\s+/g, '') || 'talent';
  const cleanHandle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;

  return (
    <div
      className="talent-card animate-fade"
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        border: '1px solid #E5E7EB',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(255,121,0,0.12)';
        e.currentTarget.style.borderColor = '#FFD8B2';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#E5E7EB';
      }}
    >
      {/* ─── 1. HEADER DU CRÉATEUR ─── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Avatar Photo avec badge lettre orange en bas à droite */}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              position: 'relative',
              flexShrink: 0,
              background: '#F3F4F6'
            }}
          >
            {!imgError ? (
              <img
                src={photoUrl}
                alt={talent.display_name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 14,
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #FF7900, #E65100)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 18
                }}
              >
                {initial}
              </div>
            )}

            {/* Badge lettre circulaire orange en bas à droite */}
            <div
              style={{
                position: 'absolute',
                bottom: -3,
                right: -3,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#FF7900',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
              }}
            >
              {initial}
            </div>
          </div>

          {/* Nom, Vérification, Pseudo et Type d'influenceur */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1.2
                }}
              >
                {talent.display_name}
              </span>
              <VerifiedBadge />
            </div>

            <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, marginTop: 1 }}>
              {cleanHandle}
            </div>

            {/* Type d'influenceur (sans mention de source) */}
            <div style={{ marginTop: 4 }}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#FFF3E8',
                  color: '#E65100',
                  border: '1px solid #FFE0CC',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  lineHeight: '14px'
                }}
              >
                {influencerTypeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Badge Statut en haut à droite */}
        <div>
          {isDuplicate ? (
            <span
              style={{
                display: 'inline-block',
                background: '#FEF9E7',
                color: '#B7950B',
                borderRadius: 12,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: 'nowrap'
              }}
            >
              À arbitrer
            </span>
          ) : (
            <span
              style={{
                display: 'inline-block',
                background: '#E8F8F0',
                color: '#27AE60',
                borderRadius: 12,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: 'nowrap'
              }}
            >
              Qualifié
            </span>
          )}
        </div>
      </div>

      {/* ─── 2. PUCS RÉSEAUX SOCIAUX ─── */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        {platformsSummary.map((p, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 9px',
              borderRadius: 6,
              background: '#F4F5F7',
              color: '#4B5563',
              fontSize: 11,
              fontWeight: 600
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: p.dotColor,
                display: 'inline-block'
              }}
            />
            <span>{p.label}</span>
          </span>
        ))}
      </div>

      {/* ─── 3. VUES CUMULÉES & LIVRABLES ─── */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>
            Vues Cumulées
          </span>
          <span style={{ fontSize: 12, color: '#10B981', fontWeight: 700 }}>
            ↗ {growth}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#EA580C',
              letterSpacing: '-0.5px'
            }}
          >
            {formatNumber(views)}
          </span>
          <span style={{ fontSize: 11.5, color: '#6B7280', fontWeight: 500 }}>
            {deliverableCount} Livrables
          </span>
        </div>
      </div>

      {/* ─── 4. COURBE D'ONDE SVG (Style exact de l'image) ─── */}
      <div style={{ width: '100%', height: 44, margin: '2px 0 10px 0' }}>
        <svg
          viewBox="0 0 200 45"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={sparkGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7900" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF7900" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Surface dégradée sous la vague */}
          <path
            d={`${wavePath} L 195 45 L 0 45 Z`}
            fill={`url(#${sparkGradId})`}
          />
          {/* Ligne orange vibrante */}
          <path
            d={wavePath}
            fill="none"
            stroke="#FF7900"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Point culminant orange à droite */}
          <circle cx="195" cy={wavePath.includes('T 195 8') ? '8' : wavePath.includes('T 195 14') ? '14' : wavePath.includes('T 195 12') ? '12' : '10'} r="3.5" fill="#FF7900" />
        </svg>
      </div>

      {/* ─── 5. BOÎTE 2 COLONNES ENGAGEMENTS & TAUX INTERACTION ─── */}
      <div
        style={{
          background: '#F9FAFB',
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #F3F4F6',
          marginBottom: 14
        }}
      >
        <div>
          <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 800, letterSpacing: '0.5px' }}>
            ENGAGEMENTS
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: '#059669', marginTop: 1 }}>
            {formatNumber(engagement)}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 800, letterSpacing: '0.5px' }}>
            TAUX INTERAC.
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: '#111827', marginTop: 1 }}>
            {interactionRate}
          </div>
        </div>
      </div>

      {/* ─── 6. BAS DE CARTE (Doublon & Bouton Fiche) ─── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: 4
        }}
      >
        <div style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 500 }}>
          {duplicateText}
        </div>

        <button
          type="button"
          onClick={() => onOpenProfile(talent)}
          style={{
            background: '#FFF3E8',
            color: '#E65100',
            border: 'none',
            borderRadius: 8,
            padding: '5px 14px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#FFE8D6';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#FFF3E8';
          }}
        >
          Fiche →
        </button>
      </div>
    </div>
  );
}
