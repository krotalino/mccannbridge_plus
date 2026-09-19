import { useState } from 'react';
import { getStatusColor } from '../../../utils/helpers';
import { exportInfluencerProfileToPdf, exportAllInfluencersCatalogPdf } from './fiche/InfluencerProfilePdfExport';
import ShareProfileModal from './fiche/ShareProfileModal';
import {
  getInfluencerCdcAndDeliverables,
  getDeliverableTypeLabel,
  getDeliverableTypeIcon,
  DELIVERABLE_STATUS_CONFIG
} from './fiche/deliverableUtils';

const SOCIAL_ICONS = {
  youtube: { label: 'YouTube', icon: '▶️', color: '#FF0000' },
  xtwitter: { label: 'X (Twitter)', icon: '𝕏', color: '#000000' },
  facebook: { label: 'Facebook', icon: '📘', color: '#1877F2' },
  linkedin: { label: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  instagram: { label: 'Instagram', icon: '📷', color: '#E1306C' },
  tiktok: { label: 'TikTok', icon: '🎵', color: '#000000' },
};

export const CAMEROON_REGIONS = [
  'Centre',
  'Littoral',
  'Ouest',
  'Sud-Ouest',
  'Nord-Ouest',
  'Est',
  'Nord',
  'Extrême-Nord',
  'Adamaoua',
  'Sud',
];

export const INFLUENCER_SIZES = [
  { id: 'Méga', label: 'Méga (1M+ abonnés)' },
  { id: 'Macro', label: 'Macro (100K - 1M)' },
  { id: 'Micro', label: 'Micro (10K - 100K)' },
  { id: 'Nano', label: 'Nano (< 10K)' },
];

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

export default function InfluenceFiche({ influencers, setInfluencers, onViewProfile, onSelect, onEdit, onDelete, onAdd, filters, setFilters }) {
  const [sharingInf, setSharingInf] = useState(null);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [exportingSingleId, setExportingSingleId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [expandedCards, setExpandedCards] = useState({});

  const handleViewProfile = (inf) => {
    if (typeof onViewProfile === 'function') {
      onViewProfile(inf);
    } else if (typeof onSelect === 'function') {
      onSelect(inf);
    }
  };

  const toggleExpandCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleExportAll = () => {
    setIsExportingAll(true);
    try {
      const listToExport = filtered.length > 0 ? filtered : influencers;
      exportAllInfluencersCatalogPdf(listToExport);
      showToast(`✓ Annuaire complet (${listToExport.length} talents) exporté au format PDF Orange Cameroun`);
    } catch (err) {
      console.error(err);
      showToast('❌ Erreur lors de la génération du PDF');
    } finally {
      setIsExportingAll(false);
    }
  };

  const handleExportSingle = (inf, e) => {
    if (e) e.stopPropagation();
    setExportingSingleId(inf.id);
    try {
      exportInfluencerProfileToPdf(inf);
      showToast(`✓ Fiche de @${inf.pseudo || inf.name} exportée (PDF Orange)`);
    } catch (err) {
      console.error(err);
      showToast('❌ Erreur lors de la génération de la fiche PDF');
    } finally {
      setExportingSingleId(null);
    }
  };

  const niches = [...new Set(influencers.flatMap(i => i.categories || [i.niche]).filter(Boolean))];
  const regions = Array.from(new Set([...CAMEROON_REGIONS, ...influencers.map(i => i.region).filter(Boolean)]));
  const platforms = [...new Set(influencers.map(i => i.platform).filter(Boolean))];

  const filtered = influencers.filter(inf => {
    if (filters.text && !inf.name.toLowerCase().includes(filters.text.toLowerCase()) && !(inf.handle || '').toLowerCase().includes(filters.text.toLowerCase()) && !(inf.realName || '').toLowerCase().includes(filters.text.toLowerCase()) && !(inf.pseudo || '').toLowerCase().includes(filters.text.toLowerCase())) return false;
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

  // Métriques globales des livrables
  const deliverablesSummary = filtered.reduce((acc, inf) => {
    const { activeDeliverables, stats } = getInfluencerCdcAndDeliverables(inf);
    acc.total += stats.total;
    acc.completed += stats.completed;
    acc.inProgress += stats.inProgress;
    acc.late += stats.late;
    return acc;
  }, { total: 0, completed: 0, inProgress: 0, late: 0 });

  const globalProgressRate = deliverablesSummary.total > 0
    ? Math.round((deliverablesSummary.completed / deliverablesSummary.total) * 100)
    : 0;

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          background: '#111',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
          borderLeft: '4px solid #FF7900'
        }}>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
      )}

      {/* Header avec bouton d'export global */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div>
          <h1 className="text-2xl font-bold text-dark mb-4 flex items-center gap-8">
            <span>📋 Fiche Influence — Profils & Livrables en cours</span>
          </h1>
          <p className="text-base text-muted">
            {filtered.length}/{influencers.length} talents référencés • {deliverablesSummary.total} livrables suivis ({deliverablesSummary.completed} validés, {deliverablesSummary.inProgress} en cours)
          </p>
        </div>
        <div className="flex items-center gap-8 flex-wrap">
          <button
            className="btn btn-ghost border flex items-center gap-6"
            onClick={handleExportAll}
            disabled={isExportingAll}
            title="Générer et télécharger l'annuaire complet de tous les influenceurs au format PDF charté Orange Cameroun"
            style={{ fontWeight: 600, background: '#fff' }}
          >
            <span>📥</span>
            <span>{isExportingAll ? 'Génération du PDF...' : "Exporter l'annuaire complet (PDF)"}</span>
          </button>
          <button className="btn btn-orange flex items-center gap-6" onClick={onAdd}>
            <span>+</span>
            <span>Ajouter un influenceur</span>
          </button>
        </div>
      </div>

      {/* Bandeau KPIs livrables en cours */}
      <div className="grid grid-4 gap-12 mb-16">
        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #FF7900' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Talents Actifs</div>
          <div className="text-xl font-bold text-dark">
            {filtered.filter(i => i.status === 'active').length} <span className="text-xs font-normal text-muted">/ {filtered.length}</span>
          </div>
        </div>
        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #0099FF' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Livrables en cours</div>
          <div className="text-xl font-bold" style={{ color: '#0099FF' }}>
            {deliverablesSummary.inProgress} <span className="text-xs font-normal text-muted">en attente de validation</span>
          </div>
        </div>
        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #28A745' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Livrables Validés</div>
          <div className="text-xl font-bold" style={{ color: '#28A745' }}>
            {deliverablesSummary.completed} <span className="text-xs font-normal text-muted">sur {deliverablesSummary.total} total</span>
          </div>
        </div>
        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #6C757D' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Avancement Global</div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-dark">{globalProgressRate}%</div>
            <div style={{ flex: 1, maxWidth: 80, height: 6, background: '#e0e0e0', borderRadius: 3, marginLeft: 8, overflow: 'hidden' }}>
              <div style={{ width: `${globalProgressRate}%`, height: '100%', background: '#FF7900', borderRadius: 3 }} />
            </div>
          </div>
        </div>
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
            <option value="">Toutes tailles</option>
            {INFLUENCER_SIZES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="inf-search-row">
          <select className="form-input" value={filters.region} onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}>
            <option value="">Toutes régions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
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
      {filtered.length === 0 ? (
        <div className="card text-center py-40" style={{ background: '#fff', border: '1px dashed #d0d7de', borderRadius: 12 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>👥</div>
          <h3 className="text-lg font-bold text-dark mb-4">
            {influencers.length === 0 ? 'Aucun influenceur enregistré en base de données' : 'Aucun influenceur ne correspond à vos filtres'}
          </h3>
          <p className="text-sm text-muted mb-20 max-w-md mx-auto">
            {influencers.length === 0 
              ? 'La base de données est actuellement vide de données démo. Cliquez sur "Ajouter un influenceur" pour enregistrer votre premier talent.'
              : 'Essayez de modifier ou réinitialiser vos filtres de recherche pour afficher des résultats.'}
          </p>
          {influencers.length === 0 ? (
            <button className="btn btn-orange" onClick={onAdd}>+ Ajouter un influenceur</button>
          ) : (
            <button className="btn btn-ghost border" onClick={() => setFilters({ text: '', niche: '', platform: '', type: '', region: '', engagement: '', disponibilite: '', status: '' })}>
              🔄 Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-auto">
          {filtered.map(inf => {
            const sc = getStatusColor(inf.status);
            return (
              <div key={inf.id} className="card" style={{ borderLeft: `4px solid ${sc}` }}>
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-10">
                    {inf.photo
                      ? <img src={inf.photo} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                      : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>{(inf.pseudo || inf.name || '?').charAt(0)}</div>
                    }
                    <div>
                      <div className="flex items-center gap-6">
                        <div className="text-md font-bold text-dark">@{inf.pseudo || inf.name}</div>
                        <span className="tag tag-orange text-xs" style={{ fontSize: 9, padding: '1px 6px' }}>{inf.type || 'Micro'}</span>
                      </div>
                      <div className="text-sm text-muted">{inf.prenom || ''} {inf.nom || inf.realName}</div>
                      <div className="text-xs text-muted mt-2">📍 {inf.city ? `${inf.city} • ` : ''}{inf.region || 'Cameroun'}</div>
                    </div>
                  </div>
                  <span className="tag" style={{ background: sc + '22', color: sc }}>{inf.status === 'active' ? 'Actif' : inf.status === 'warning' ? 'Alerte' : 'Nouveau'}</span>
                </div>

                {/* Catégories */}
                <div className="flex gap-4 flex-wrap mb-8">
                  {(inf.categories || [inf.niche]).filter(Boolean).map((cat, i) => (
                    <span key={i} className="tag" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)', fontSize: 10 }}>{cat}</span>
                  ))}
                </div>

                {/* Coordonnées */}
                <div style={{ background: '#f9f9f9', borderRadius: 6, padding: 8, marginBottom: 10, fontSize: 11 }}>
                  <div className="flex items-center gap-6 mb-4">
                    <span>📧</span>
                    <span className="text-muted" style={{ wordBreak: 'break-all' }}>{inf.email || 'Email non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-6 mb-4">
                    <span>📱</span>
                    <span className="text-muted">{inf.phone || 'Non renseigné'}</span>
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
                  <div className="text-xs font-semibold text-dark mb-6 flex justify-between items-center">
                    <span>Réseaux sociaux</span>
                    <span className="text-muted" style={{ fontSize: 10 }}>YouTube, X, FB, LinkedIn...</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(SOCIAL_ICONS).map(([key, social]) => {
                      const val = (inf.socialLinks || {})[key];
                      const hasAccount = Boolean(val && (val.url || val.username || val.followers > 0));
                      return (
                        <div key={key} style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '3px 8px', borderRadius: 4, fontSize: 10,
                          background: hasAccount ? social.color + '14' : '#eee',
                          color: hasAccount ? (social.color === '#000000' ? '#111' : social.color) : '#999',
                          opacity: hasAccount ? 1 : 0.45,
                          border: hasAccount ? `1px solid ${social.color}33` : '1px solid transparent',
                        }} title={`${social.label}: ${hasAccount ? (val.username ? `@${val.username} (${formatFollowers(val.followers)})` : formatFollowers(val.followers)) : 'Non renseigné'}`}>
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
                    <div className="text-base font-bold text-dark">{inf.followers || '0'}</div>
                    <div className="text-xs text-muted">Abonnés</div>
                  </div>
                  <div className="text-center" style={{ borderRight: '1px solid #eee' }}>
                    <div className="text-base font-bold text-blue">{inf.engagement || '0%'}</div>
                    <div className="text-xs text-muted">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-orange">{inf.scorePerformance || inf.score || 4.0}/5</div>
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

                {/* Section Livrables en cours liés au cahier des charges */}
                {(() => {
                  const { activeCdc, activeDeliverables, stats } = getInfluencerCdcAndDeliverables(inf);
                  const isExpanded = Boolean(expandedCards[inf.id]);
                  return (
                    <div style={{ background: '#fbfbfb', border: '1px solid #e9ecef', borderRadius: 8, padding: 10, marginBottom: 12 }}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6" style={{ overflow: 'hidden' }}>
                          <span style={{ fontSize: 13 }}>📦</span>
                          <span className="font-bold text-xs text-dark truncate" title={activeCdc?.titre || 'Campagne en cours'}>
                            {activeCdc?.titre ? (activeCdc.titre.length > 20 ? activeCdc.titre.substring(0, 18) + '...' : activeCdc.titre) : 'Campagne en cours'}
                          </span>
                          {activeCdc?.reference && (
                            <span className="tag" style={{ fontSize: 9, padding: '1px 5px', background: '#f0f0f0', color: '#666' }}>
                              {activeCdc.reference}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="tag" style={{
                            fontSize: 9,
                            padding: '1px 6px',
                            background: stats.progress === 100 ? '#d4edda' : '#fff3cd',
                            color: stats.progress === 100 ? '#155724' : '#856404',
                            fontWeight: 700
                          }}>
                            {stats.progress}%
                          </span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleExpandCard(inf.id); }}
                            className="btn btn-ghost btn-xs"
                            style={{ padding: '1px 4px', fontSize: 10 }}
                            title={isExpanded ? 'Réduire les livrables' : 'Afficher les livrables détaillés'}
                          >
                            {isExpanded ? '▲' : '▼'}
                          </button>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div style={{ height: 4, background: '#e9ecef', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
                        <div style={{ width: `${stats.progress}%`, height: '100%', background: stats.progress === 100 ? '#28A745' : '#FF7900', borderRadius: 2 }} />
                      </div>

                      {/* Résumé condensé */}
                      <div className="flex justify-between items-center text-xs text-muted mb-6" style={{ fontSize: 10 }}>
                        <span>{stats.completed}/{stats.total} validés • {stats.inProgress} en cours</span>
                        {stats.late > 0 && <span style={{ color: 'var(--red)', fontWeight: 700 }}>⚠️ {stats.late} retard</span>}
                      </div>

                      {/* Liste des livrables */}
                      <div className="space-y-4">
                        {activeDeliverables.slice(0, isExpanded ? 10 : 2).map((deliv, idx) => {
                          const statusCfg = DELIVERABLE_STATUS_CONFIG[deliv.status] || DELIVERABLE_STATUS_CONFIG.a_faire;
                          return (
                            <div
                              key={deliv.id || idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '4px 6px',
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: 4,
                                fontSize: 10
                              }}
                            >
                              <div className="flex items-center gap-6" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 6 }}>
                                <span>{getDeliverableTypeIcon(deliv.type)}</span>
                                <span className="font-semibold text-dark truncate" title={deliv.titre || deliv.title}>
                                  {deliv.titre || deliv.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 shrink-0">
                                <span className="text-muted" style={{ fontSize: 9 }}>{deliv.dateEcheance || deliv.deadline || '—'}</span>
                                <span
                                  style={{
                                    padding: '1px 5px',
                                    borderRadius: 3,
                                    fontSize: 8,
                                    fontWeight: 700,
                                    background: statusCfg.bg,
                                    color: statusCfg.color
                                  }}
                                >
                                  {statusCfg.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Détails supplémentaires si étendu */}
                      {isExpanded && activeCdc && (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #e0e0e0', fontSize: 10 }} className="text-muted">
                          {activeCdc.objectifs && (
                            <div className="mb-4">
                              <strong className="text-dark">Objectifs:</strong> {activeCdc.objectifs}
                            </div>
                          )}
                          {activeCdc.contraintes && (
                            <div className="mb-4">
                              <strong className="text-dark">Contraintes:</strong> {activeCdc.contraintes}
                            </div>
                          )}
                          {activeCdc.dateDebut && (
                            <div>
                              <strong className="text-dark">Période:</strong> {activeCdc.dateDebut} au {activeCdc.dateFin || 'En cours'}
                            </div>
                          )}
                        </div>
                      )}

                      {activeDeliverables.length > 2 && !isExpanded && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleExpandCard(inf.id); }}
                          className="text-xs text-orange font-semibold mt-4 block w-full text-center"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10 }}
                        >
                          + {activeDeliverables.length - 2} autre(s) livrable(s)...
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* Actions */}
                <div className="flex gap-4 items-center">
                  <button onClick={() => handleViewProfile(inf)} className="btn btn-orange btn-sm" style={{ flex: 2 }}>
                    👁️ Voir fiche
                  </button>
                  <button
                    onClick={(e) => handleExportSingle(inf, e)}
                    className="btn btn-ghost btn-sm border"
                    style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
                    title="Exporter la fiche complète au format PDF Orange Cameroun"
                    disabled={exportingSingleId === inf.id}
                  >
                    {exportingSingleId === inf.id ? '...' : '📄 PDF'}
                  </button>
                  <button
                    onClick={() => setSharingInf(inf)}
                    className="btn btn-ghost btn-sm border"
                    style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
                    title="Partager le profil (Lien, Email, WhatsApp)"
                  >
                    🔗 Partager
                  </button>
                  <button onClick={() => onEdit(inf)} className="btn btn-ghost btn-sm" title="Modifier">✏️</button>
                  <button onClick={() => onDelete(inf.id)} className="btn btn-ghost btn-sm" title="Supprimer" style={{ color: 'var(--red)' }}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de partage */}
      {sharingInf && (
        <ShareProfileModal
          influencer={sharingInf}
          onClose={() => setSharingInf(null)}
        />
      )}
    </div>
  );
}
