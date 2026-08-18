import { useState } from 'react';
import { getStatusColor } from '../../../utils/helpers';

const SOCIAL_ICONS = {
  instagram: { label: 'Instagram', icon: '📷', color: '#E1306C' },
  tiktok: { label: 'TikTok', icon: '🎵', color: '#000000' },
  youtube: { label: 'YouTube', icon: '▶️', color: '#FF0000' },
  facebook: { label: 'Facebook', icon: '📘', color: '#1877F2' },
  xtwitter: { label: 'X/Twitter', icon: '𝕏', color: '#000000' },
  linkedin: { label: 'LinkedIn', icon: '💼', color: '#0A66C2' },
};

function formatFollowers(n) {
  if (!n || n === 0) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function MiniSparkline({ data, width = 80, height = 24 }) {
  if (!data || data.length < 2) return null;
  const values = data.map(d => d.total);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const growth = values[values.length - 1] - values[0];
  const growthPercent = ((growth / values[0]) * 100).toFixed(1);
  const isPositive = growth >= 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={width} height={height} style={{ display: 'block' }}>
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? 'var(--green)' : 'var(--red)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xs font-semibold" style={{ color: isPositive ? 'var(--green)' : 'var(--red)' }}>
        {isPositive ? '+' : ''}{growthPercent}%
      </span>
    </div>
  );
}

export default function InfluenceFiche({ influencers, onViewProfile, onEdit, onDelete, onAdd, filters, setFilters }) {
  const niches = [...new Set(influencers.flatMap(i => i.categories || [i.niche]).filter(Boolean))];
  const regions = [...new Set(influencers.map(i => i.region).filter(Boolean))];
  const platforms = [...new Set(influencers.map(i => i.platform).filter(Boolean))];

  const filtered = influencers.filter(inf => {
    if (filters.text && !inf.name.toLowerCase().includes(filters.text.toLowerCase()) && !(inf.handle || '').toLowerCase().includes(filters.text.toLowerCase()) && !inf.realName.toLowerCase().includes(filters.text.toLowerCase())) return false;
    if (filters.niche && !(inf.categories || []).includes(filters.niche) && inf.niche !== filters.niche) return false;
    if (filters.platform && inf.platform !== filters.platform) return false;
    if (filters.type && inf.type !== filters.type) return false;
    if (filters.region && inf.region !== filters.region) return false;
    if (filters.status && inf.status !== filters.status) return false;
    if (filters.disponibilite && inf.disponibilite !== filters.disponibilite) return false;
    if (filters.engagement === 'high' && inf.engagementNum <= 8) return false;
    if (filters.engagement === 'mid' && (inf.engagementNum < 4 || inf.engagementNum > 8)) return false;
    if (filters.engagement === 'low' && inf.engagementNum >= 4) return false;
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-2xl font-bold text-dark mb-4">📋 Fiche Influence — Informations générales</h1>
          <p className="text-base text-muted">{filtered.length}/{influencers.length} talents référencés</p>
        </div>
        <button className="btn btn-orange" onClick={onAdd}>+ Ajouter un influenceur</button>
      </div>

      {/* Filtres */}
      <div className="inf-search-panel">
        <div className="inf-search-row">
          <input className="form-input" placeholder="🔍 Rechercher par nom, pseudo, handle..." value={filters.text} onChange={e => setFilters(f => ({ ...f, text: e.target.value }))} style={{ flex: 2 }} />
          <select className="form-input" value={filters.niche} onChange={e => setFilters(f => ({ ...f, niche: e.target.value }))}>
            <option value="">Toutes catégories</option>{niches.map(n => <option key={n}>{n}</option>)}
          </select>
          <select className="form-input" value={filters.platform} onChange={e => setFilters(f => ({ ...f, platform: e.target.value }))}>
            <option value="">Toutes plateformes</option>{platforms.map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="form-input" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
            <option value="">Toutes tailles</option><option>Macro</option><option>Micro</option><option>Nano</option>
          </select>
        </div>
        <div className="inf-search-row">
          <select className="form-input" value={filters.region} onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}>
            <option value="">Toutes régions</option>{regions.map(r => <option key={r}>{r}</option>)}
          </select>
          <select className="form-input" value={filters.engagement} onChange={e => setFilters(f => ({ ...f, engagement: e.target.value }))}>
            <option value="">Tout engagement</option><option value="high">&gt; 8%</option><option value="mid">4-8%</option><option value="low">&lt; 4%</option>
          </select>
          <select className="form-input" value={filters.disponibilite} onChange={e => setFilters(f => ({ ...f, disponibilite: e.target.value }))}>
            <option value="">Toute dispo</option><option value="disponible">Disponible</option><option value="occupée">Occupée</option>
          </select>
          <select className="form-input" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="">Tout statut</option><option value="active">Actif</option><option value="warning">Alerte</option><option value="new">Nouveau</option>
          </select>
        </div>
      </div>

      {/* Grille des fiches */}
      <div className="grid grid-auto">
        {filtered.map(inf => {
          const sc = getStatusColor(inf.status);
          const activeSocials = Object.entries(inf.socialLinks || {}).filter(([, v]) => v.url);
          return (
            <div key={inf.id} className="card" style={{ borderLeft: `4px solid ${sc}` }}>
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-10">
                  {inf.photo
                    ? <img src={inf.photo} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                    : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>{inf.name.charAt(0)}</div>
                  }
                  <div>
                    <div className="text-md font-bold text-dark">@{inf.pseudo || inf.name}</div>
                    <div className="text-sm text-muted">{inf.prenom || ''} {inf.nom || inf.realName}</div>
                    <div className="text-xs text-muted mt-2">{inf.city} • {inf.region}</div>
                  </div>
                </div>
                <span className="tag" style={{ background: sc + '22', color: sc }}>{inf.status === 'active' ? 'Actif' : inf.status === 'warning' ? 'Alerte' : 'Nouveau'}</span>
              </div>

              {/* Catégories */}
              <div className="flex gap-4 flex-wrap mb-8">
                {(inf.categories || [inf.niche]).map((cat, i) => (
                  <span key={i} className="tag" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)', fontSize: 10 }}>{cat}</span>
                ))}
              </div>

              {/* Coordonnées */}
              <div style={{ background: '#f9f9f9', borderRadius: 6, padding: 8, marginBottom: 10, fontSize: 11 }}>
                <div className="flex items-center gap-6 mb-4">
                  <span>📧</span>
                  <span className="text-muted" style={{ wordBreak: 'break-all' }}>{inf.email}</span>
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <span>📱</span>
                  <span className="text-muted">{inf.phone}</span>
                  {inf.telephone2 && <span className="text-muted">/ {inf.telephone2}</span>}
                </div>
                {inf.adresse && (
                  <div className="flex items-center gap-6">
                    <span>📍</span>
                    <span className="text-muted">{inf.adresse}</span>
                  </div>
                )}
              </div>

              {/* Réseaux sociaux */}
              <div style={{ background: '#f4f7fb', borderRadius: 6, padding: 8, marginBottom: 10 }}>
                <div className="text-xs font-semibold text-dark mb-6">Réseaux sociaux</div>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(inf.socialLinks || {}).map(([key, val]) => {
                    const social = SOCIAL_ICONS[key];
                    if (!social) return null;
                    const hasAccount = val && val.url;
                    return (
                      <div key={key} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px', borderRadius: 4, fontSize: 10,
                        background: hasAccount ? social.color + '12' : '#eee',
                        color: hasAccount ? social.color : '#bbb',
                        opacity: hasAccount ? 1 : 0.5,
                      }}>
                        <span>{social.icon}</span>
                        <span className="font-semibold">{hasAccount ? formatFollowers(val.followers) : '—'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KPIs rapides */}
              <div className="grid grid-3 gap-8 mb-8 text-sm">
                <div className="text-center" style={{ borderRight: '1px solid #eee' }}>
                  <div className="text-base font-bold text-dark">{inf.followers}</div>
                  <div className="text-xs text-muted">Abonnés</div>
                </div>
                <div className="text-center" style={{ borderRight: '1px solid #eee' }}>
                  <div className="text-base font-bold text-blue">{inf.engagement}</div>
                  <div className="text-xs text-muted">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-orange">{inf.scorePerformance || inf.score}/5</div>
                  <div className="text-xs text-muted">Score</div>
                </div>
              </div>

              {/* Evolution abonnés */}
              {inf.followersHistory && inf.followersHistory.length >= 2 && (
                <div className="flex items-center justify-between mb-8" style={{ background: '#f9f9f9', borderRadius: 6, padding: '6px 10px' }}>
                  <span className="text-xs text-muted">Évolution abonnés</span>
                  <MiniSparkline data={inf.followersHistory} />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-6">
                <button onClick={() => onViewProfile(inf)} className="btn btn-orange btn-sm" style={{ flex: 1 }}>Voir fiche</button>
                <button onClick={() => onEdit(inf)} className="btn btn-ghost btn-sm">✏️</button>
                <button onClick={() => onDelete(inf.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>🗑</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
