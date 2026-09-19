import { useState, useRef } from 'react';
import InfluencerDeliverablesSection from './sections/fiche/InfluencerDeliverablesSection';
import { exportInfluencerProfileToPdf } from './sections/fiche/InfluencerProfilePdfExport';
import ShareProfileModal from './sections/fiche/ShareProfileModal';
import { getTalentPhoto } from './utils/talentPhotos';
import ErrorBoundary from '../../components/common/ErrorBoundary';

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

export const INFLUENCER_TYPES = [
  { id: 'Méga', label: 'Méga (1M+ abonnés)' },
  { id: 'Macro', label: 'Macro (100K - 1M abonnés)' },
  { id: 'Micro', label: 'Micro (10K - 100K abonnés)' },
  { id: 'Nano', label: 'Nano (< 10K abonnés)' },
];

export const SOCIAL_NETWORKS = [
  { id: 'youtube', label: 'YouTube', icon: '▶️', placeholderUrl: 'https://youtube.com/@...', color: '#FF0000' },
  { id: 'xtwitter', label: 'X (Twitter)', icon: '𝕏', placeholderUrl: 'https://x.com/...', color: '#14171A' },
  { id: 'facebook', label: 'Facebook', icon: '📘', placeholderUrl: 'https://facebook.com/...', color: '#1877F2' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', placeholderUrl: 'https://linkedin.com/in/...', color: '#0A66C2' },
  { id: 'instagram', label: 'Instagram', icon: '📷', placeholderUrl: 'https://instagram.com/...', color: '#E1306C' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', placeholderUrl: 'https://tiktok.com/@...', color: '#000000' },
];

function formatFollowers(n) {
  if (!n || n === 0) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString();
}

/* ─── Profile Modal ─── */
export function ProfileModal({ inf: propInf, influencer, onClose, onEdit, onDelete, setInfluencers }) {
  const inf = propInf || influencer;
  const [profileTab, setProfileTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  if (!inf) return null;

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      exportInfluencerProfileToPdf(inf);
      setToastMsg('✓ Fiche PDF Orange Cameroun générée');
      setTimeout(() => setToastMsg(''), 3500);
    } catch (e) {
      console.error('Erreur export PDF:', e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble", icon: '🏠' },
    { id: 'socials', label: 'Réseaux & Liens', icon: '🌐' },
    { id: 'content', label: 'Livrables & CDC', icon: '📦' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'contact', label: 'Contact & Legal', icon: '💬' },
  ];

  const photoUrl = inf.photo || getTalentPhoto(inf);
  const displayName = inf.display_name || inf.realName || `${inf.prenom || inf.first_name || ''} ${inf.nom || inf.last_name || ''}`.trim() || inf.name || inf.pseudo || 'Créateur';
  const cleanPseudo = (inf.pseudo || inf.handle || inf.name || displayName || 'profil').replace(/^@/, '');
  const initialLetter = (cleanPseudo || displayName || '?').charAt(0).toUpperCase();

  // Unification des réseaux sociaux entre socialLinks et platform_profiles
  const resolvedSocials = { ...(inf.socialLinks || {}) };
  if (Array.isArray(inf.platform_profiles)) {
    inf.platform_profiles.forEach(p => {
      const key = p.platform === 'x' ? 'xtwitter' : p.platform;
      if (!resolvedSocials[key] || (!resolvedSocials[key].url && !resolvedSocials[key].username)) {
        resolvedSocials[key] = {
          url: p.url || '',
          username: (p.handle || cleanPseudo).replace(/^@/, ''),
          followers: p.followers || 0
        };
      }
    });
  }

  const categories = (Array.isArray(inf.categories) && inf.categories.length > 0
    ? inf.categories
    : [inf.niche || inf.segment || 'Lifestyle']).filter(Boolean);

  return (
    <div className="inf-modal-overlay" onClick={onClose}>
      <div className="inf-profile-modal" onClick={e => e.stopPropagation()}>
        <button className="inf-modal-close" onClick={onClose} aria-label="Fermer">✕</button>

        <ErrorBoundary onClose={onClose}>
          {/* Header */}
          <div className="inf-profile-banner" />
          <div className="inf-profile-head">
            <div className="inf-profile-avatar-wrap">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={displayName}
                  className="inf-profile-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.parentElement.querySelector('.inf-avatar-placeholder');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="inf-profile-avatar inf-avatar-placeholder"
                style={{ display: photoUrl ? 'none' : 'flex' }}
              >
                {initialLetter}
              </div>
            </div>
            <div className="inf-profile-info">
              <div className="flex items-center gap-8 flex-wrap mb-4">
                <h2 className="inf-profile-name m-0">@{cleanPseudo}</h2>
                <span className="tag tag-orange font-bold text-xs">{inf.type || 'Macro'}</span>
                <span className="tag tag-ghost font-semibold text-xs">📍 {inf.city ? `${inf.city} (${inf.region || 'Littoral'})` : inf.region || 'Cameroun'}</span>
              </div>
              <div className="text-sm text-muted mb-6">{displayName}</div>
              <div className="inf-profile-tags">
                <span className="tag tag-blue font-semibold">{inf.platform || 'Multi-plateforme'}</span>
                {categories.map((cat, i) => (
                  <span key={i} className="tag tag-ghost" style={{ fontSize: 11 }}>{cat}</span>
                ))}
              </div>
              <div className="inf-profile-stats mt-8">
                <span>👥 <strong>{inf.followers || '0'}</strong> abonnés globaux</span>
                <span>♡ <strong>{inf.engagement || '0%'}</strong> engagement</span>
                <span>👁 <strong>{inf.avgViews || '0'}</strong> vues moy.</span>
              </div>
            </div>
            <div className="inf-profile-actions flex items-center gap-6 flex-wrap">
              <button
                className="btn btn-sm flex items-center gap-4"
                style={{ background: '#FF7900', color: '#fff', border: 'none', fontWeight: 700 }}
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                title="Exporter la fiche officielle au format PDF Orange Cameroun"
              >
                <span>📄</span>
                <span>{isExportingPdf ? 'Export...' : 'PDF Fiche'}</span>
              </button>
              <button
                className="btn btn-ghost btn-sm flex items-center gap-4"
                onClick={() => setShowShareModal(true)}
                title="Partager le profil ou copier le lien"
              >
                <span>🔗</span>
                <span>Partager</span>
              </button>
              {onEdit && (
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(inf)} title="Modifier">
                  ✏️ Modifier
                </button>
              )}
              {onDelete && (
                <button className="btn btn-ghost btn-sm" onClick={() => onDelete(inf.id)} title="Supprimer" style={{ color: 'var(--red)' }}>
                  🗑
                </button>
              )}
            </div>
          </div>

          {toastMsg && (
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '6px 16px', fontSize: 12, fontWeight: 600, borderBottom: '1px solid #a5d6a7' }}>
              {toastMsg}
            </div>
          )}

          {/* Tabs */}
          <div className="inf-profile-tabs">
            {tabs.map(t => (
              <button key={t.id} className={`inf-ptab ${profileTab === t.id ? 'active' : ''}`} onClick={() => setProfileTab(t.id)}>{t.icon} {t.label}</button>
            ))}
          </div>

          {/* Tab content */}
          <div className="inf-profile-body">
            {profileTab === 'overview' && (
              <div className="inf-overview-grid">
                <div className="inf-ov-card"><div className="inf-ov-label">BIO & PRÉSENTATION</div><p>{inf.bio || 'Aucune biographie disponible.'}</p></div>
                <div className="inf-ov-card"><div className="inf-ov-label">CONTRAT</div><p style={{ color: inf.contractStatus === 'actif' ? 'var(--green)' : 'var(--yellow)', fontWeight: 700 }}>{inf.contractStatus === 'actif' ? 'Actif' : inf.contractStatus === 'en_revision' ? 'En révision' : 'Prospect'}</p>{inf.contractEnd && <p className="text-sm text-muted">Expire: {inf.contractEnd}</p>}</div>
                <div className="inf-ov-card"><div className="inf-ov-label">CATÉGORIES / NICHES</div><p>{categories.join(', ')}</p></div>
                <div className="inf-ov-card"><div className="inf-ov-label">RISQUE & MORALITÉ</div><p style={{ color: (inf.riskScore || 0) <= 1 ? 'var(--green)' : (inf.riskScore || 0) <= 2 ? 'var(--yellow)' : 'var(--red)', fontWeight: 700 }}>Score Risque: {inf.riskScore ?? 0}/5</p><p className="text-xs text-muted">{inf.riskNotes || 'Aucun risque particulier signalé.'}</p></div>
                <div className="inf-ov-card"><div className="inf-ov-label">CAMPAGNES</div><p className="text-lg font-bold">{inf.campaigns || 0}</p><p className="text-xs text-muted">Dernière: {inf.lastCampaign || '—'}</p></div>
                <div className="inf-ov-card"><div className="inf-ov-label">DISPONIBILITÉ & STATUT</div><div className="flex gap-6 mt-4"><span className={`tag ${inf.disponibilite === 'disponible' ? 'tag-green' : 'tag-yellow'}`}>{inf.disponibilite || 'disponible'}</span><span className="tag tag-ghost">{inf.status === 'active' ? 'Actif' : inf.status === 'warning' ? 'Alerte' : 'Nouveau'}</span></div></div>
              </div>
            )}

            {profileTab === 'socials' && (
              <div>
                <div className="flex justify-between items-center mb-12">
                  <h4 className="text-sm font-bold text-dark m-0">Comptes & Réseaux Sociaux Référencés</h4>
                  <span className="text-xs text-muted">YouTube, X, Facebook, LinkedIn, Instagram, TikTok</span>
                </div>
                <div className="grid grid-2 gap-12">
                  {SOCIAL_NETWORKS.map(net => {
                    const data = resolvedSocials[net.id];
                    const hasLink = Boolean(data && (data.url || data.username || (data.followers > 0)));
                    return (
                      <div key={net.id} className="p-12 border rounded" style={{ background: hasLink ? '#fff' : '#fafafa', opacity: hasLink ? 1 : 0.65, borderLeft: `3px solid ${hasLink ? net.color : '#e0e0e0'}` }}>
                        <div className="flex justify-between items-center mb-6">
                          <span className="font-bold text-sm flex items-center gap-6">
                            <span style={{ fontSize: 16 }}>{net.icon}</span>
                            <span>{net.label}</span>
                          </span>
                          {hasLink ? <span className="tag tag-green text-xs">Configuré</span> : <span className="tag text-xs">Non renseigné</span>}
                        </div>

                        {hasLink ? (
                          <div className="space-y-4 text-xs">
                            {data.username && (
                              <div className="text-dark font-semibold">
                                Pseudo / Chaîne : <span className="text-blue">@{String(data.username).replace(/^@/, '')}</span>
                              </div>
                            )}
                            <div className="text-muted">
                              Abonnés : <strong className="text-dark">{data.followers ? Number(data.followers).toLocaleString() : '0'}</strong> ({formatFollowers(data.followers)})
                            </div>
                            {data.url ? (
                              <div className="pt-4">
                                <a href={data.url} target="_blank" rel="noreferrer" className="text-xs text-blue underline break-all inline-flex items-center gap-4">
                                  <span>🔗 Ouvrir le profil</span> ↗
                                </a>
                              </div>
                            ) : (
                              <span className="text-muted italic">Aucun lien direct</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-muted italic">Aucun compte renseigné pour ce réseau.</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {profileTab === 'content' && (
              <InfluencerDeliverablesSection
                influencer={inf}
                setInfluencers={setInfluencers}
                onExportPdf={handleExportPdf}
                onShare={() => setShowShareModal(true)}
              />
            )}

            {profileTab === 'analytics' && (
              <div>
                <h4 className="text-sm font-bold text-dark mb-12">Historique de Performance</h4>
                {inf.performanceHistory && inf.performanceHistory.length > 0 ? (
                  <table className="table w-full"><thead><tr><th>Campagne</th><th className="text-right">Reach</th><th className="text-right">Engagement</th><th className="text-center">Qualité</th></tr></thead>
                    <tbody>{inf.performanceHistory.map((p, i) => (<tr key={i}><td>{p.campaign}</td><td className="text-right" style={{ color: p.kpiReach >= (p.kpiTarget || 1) ? 'var(--green)' : 'var(--red)' }}>{Math.round(p.kpiReach / (p.kpiTarget || 1) * 100)}%</td><td className="text-right" style={{ color: p.kpiEngagement >= (p.engagementTarget || 1) ? 'var(--green)' : 'var(--red)' }}>{Math.round(p.kpiEngagement / (p.engagementTarget || 1) * 100)}%</td><td className="text-center">{p.contentQuality}/5</td></tr>))}</tbody></table>
                ) : <p className="text-muted text-sm">Pas encore de données d'analytics pour cet influenceur.</p>}
              </div>
            )}

            {profileTab === 'contact' && (
              <div className="inf-contact-grid">
                <div className="inf-contact-details" style={{ width: '100%' }}>
                  <h4 className="text-sm font-bold text-dark mb-12">Coordonnées Complètes</h4>
                  <div className="inf-contact-row"><span className="inf-contact-icon" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)' }}>📍</span><div><div className="inf-ov-label">ADRESSE & LOCALISATION</div><strong>{inf.adresse || inf.city || 'Non renseignée'} ({inf.region || 'Cameroun'})</strong></div></div>
                  <div className="inf-contact-row"><span className="inf-contact-icon" style={{ background: 'rgba(41,128,185,0.1)', color: 'var(--blue)' }}>✉</span><div><div className="inf-ov-label">EMAIL DIRECT</div><strong style={{ fontSize: 12 }}>{inf.email || 'Non renseigné'}</strong></div></div>
                  <div className="inf-contact-row"><span className="inf-contact-icon" style={{ background: 'rgba(39,174,96,0.1)', color: 'var(--green)' }}>📞</span><div><div className="inf-ov-label">TÉLÉPHONES</div><strong>{inf.phone || 'Non renseigné'}</strong> {inf.telephone2 && <span> / {inf.telephone2}</span>}</div></div>
                  <div className="inf-contact-row"><span className="inf-contact-icon" style={{ background: 'rgba(142,68,173,0.1)', color: 'var(--purple)' }}>📑</span><div><div className="inf-ov-label">DOCUMENTS LÉGAUX</div><strong>CNI: {inf.documentsLegaux?.pieceIdentite?.present ? '✓ Conforme' : '⚠️ Manquant'} • RIB: {inf.documentsLegaux?.rib?.present ? '✓ Conforme' : '⚠️ Manquant'}</strong></div></div>
                </div>
              </div>
            )}
          </div>
        </ErrorBoundary>

        {showShareModal && (
          <ShareProfileModal
            influencer={inf}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Edit/Add Modal ─── */
export function EditModal({ inf: propInf, influencer, onClose, onSave }) {
  const inf = propInf || influencer;
  const isNew = !inf;
  
  // Normalisation des réseaux sociaux
  const initialSocials = {
    youtube: { url: '', username: '', followers: 0 },
    xtwitter: { url: '', username: '', followers: 0 },
    facebook: { url: '', username: '', followers: 0 },
    linkedin: { url: '', username: '', followers: 0 },
    instagram: { url: '', username: '', followers: 0 },
    tiktok: { url: '', username: '', followers: 0 },
    ...(inf?.socialLinks || {}),
  };

  // Assurer que chaque réseau dispose d'un objet avec url, username, followers
  SOCIAL_NETWORKS.forEach(net => {
    if (!initialSocials[net.id]) {
      initialSocials[net.id] = { url: '', username: '', followers: 0 };
    } else {
      initialSocials[net.id] = {
        url: initialSocials[net.id].url || '',
        username: initialSocials[net.id].username || '',
        followers: initialSocials[net.id].followers || 0,
      };
    }
  });

  const [form, setForm] = useState(inf ? {
    ...inf,
    type: inf.type || 'Micro',
    region: inf.region || 'Littoral',
    socialLinks: initialSocials,
  } : {
    name: '', prenom: '', nom: '', pseudo: '', handle: '', followers: '10K', engagement: '5.0%', engagementNum: 5.0, avgViews: '50K',
    type: 'Micro', city: 'Douala', region: 'Littoral', score: 4.0, segment: 'Lifestyle', niche: 'Lifestyle', categories: ['Lifestyle'], platform: 'Instagram',
    status: 'new', contractStatus: 'prospect', contractEnd: null, cachetBase: 0, cachetVariable: 0,
    campaigns: 0, lastCampaign: '—', brandsActives: 0, exclusivite: false, photo: null,
    email: '', phone: '', telephone2: '', adresse: '', langues: 'Français', bio: '', disponibilite: 'disponible',
    reseaux: ['Instagram'],
    socialLinks: initialSocials,
    moralityCheck: { done: false, date: null, result: null, notes: '' },
    riskScore: 0, riskNotes: '', performanceHistory: [], pendingDeliverables: [], competitorAlert: false,
  });

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'socials'
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({ ...f, photo: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSocialChange = (networkId, field, value) => {
    setForm(f => {
      const currentNet = f.socialLinks?.[networkId] || { url: '', username: '', followers: 0 };
      const updatedNet = {
        ...currentNet,
        [field]: field === 'followers' ? (parseInt(value, 10) || 0) : value,
      };
      return {
        ...f,
        socialLinks: {
          ...(f.socialLinks || {}),
          [networkId]: updatedNet,
        },
      };
    });
  };

  const handleSubmit = () => {
    if (!form.name && !form.pseudo && !form.prenom) {
      return alert('Le prénom, nom ou pseudo est requis');
    }
    const finalName = form.pseudo || form.name || `${form.prenom || ''} ${form.nom || ''}`.trim();
    const finalForm = {
      ...form,
      name: finalName,
      pseudo: form.pseudo || finalName,
      realName: form.realName || `${form.prenom || ''} ${form.nom || ''}`.trim(),
    };
    onSave(finalForm);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="inf-modal-overlay" onClick={onClose}>
      <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-center pb-12 border-b">
          <div>
            <h3 className="text-lg font-bold text-dark m-0">{isNew ? '✨ Ajouter un nouvel influenceur' : `✏️ Modifier la fiche : @${form.pseudo || form.name}`}</h3>
            <p className="text-xs text-muted m-0 mt-2">Renseignez les informations générales, la région, la taille et les liens de réseaux sociaux (YouTube, X, Facebook, LinkedIn...).</p>
          </div>
          <button className="inf-modal-close" style={{ position: 'static' }} onClick={onClose}>✕</button>
        </div>

        {/* Sous-onglets du formulaire d'édition */}
        <div className="flex gap-8 pt-12 pb-8 border-b">
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'general' ? 'btn-orange' : 'btn-ghost'}`}
            onClick={() => setActiveTab('general')}
          >
            📋 Informations Générales & Profil
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'socials' ? 'btn-orange' : 'btn-ghost'}`}
            onClick={() => setActiveTab('socials')}
          >
            🌐 Réseaux Sociaux (YouTube, X, FB, LinkedIn...)
          </button>
        </div>

        <div style={{ overflowY: 'auto', paddingRight: 4, flex: 1 }} className="py-12">
          {activeTab === 'general' && (
            <div>
              {/* Photo & Identité */}
              <div className="inf-edit-photo-row mb-16 p-12 bg-light rounded flex items-center gap-16">
                {form.photo ? (
                  <img src={form.photo} className="inf-edit-avatar" alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div className="inf-edit-avatar inf-avatar-placeholder" style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24 }}>
                    {(form.pseudo || form.name || form.prenom || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <button type="button" className="btn btn-ghost btn-sm mb-4" onClick={() => fileRef.current?.click()}>
                    📷 {form.photo ? 'Changer la photo de profil' : 'Charger une photo de profil'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
                  <div className="text-xs text-muted">Format JPG, PNG ou WebP conseillé</div>
                </div>
              </div>

              <div className="inf-edit-grid">
                <div>
                  <label className="form-label font-bold">Prénom *</label>
                  <input className="form-input" placeholder="ex: Patrick" value={form.prenom || ''} onChange={e => set('prenom', e.target.value)} />
                </div>
                <div>
                  <label className="form-label font-bold">Nom *</label>
                  <input className="form-input" placeholder="ex: Kameni" value={form.nom || ''} onChange={e => set('nom', e.target.value)} />
                </div>
                <div>
                  <label className="form-label font-bold">Pseudo / Nom Public *</label>
                  <input className="form-input" placeholder="ex: Kameni_Official" value={form.pseudo || form.name || ''} onChange={e => { set('pseudo', e.target.value); set('name', e.target.value); }} />
                </div>
                <div>
                  <label className="form-label">Handle (@)</label>
                  <input className="form-input" placeholder="ex: kameni_official" value={form.handle || ''} onChange={e => set('handle', e.target.value)} />
                </div>

                {/* Filtres & Catégorisation Clés : Région et Taille */}
                <div>
                  <label className="form-label font-bold" style={{ color: 'var(--orange)' }}>Région (Cameroun) *</label>
                  <select className="form-input" value={form.region || 'Littoral'} onChange={e => set('region', e.target.value)}>
                    {CAMEROON_REGIONS.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label font-bold" style={{ color: 'var(--orange)' }}>Taille du profil *</label>
                  <select className="form-input" value={form.type || 'Micro'} onChange={e => set('type', e.target.value)}>
                    {INFLUENCER_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Ville</label>
                  <input className="form-input" placeholder="ex: Douala, Yaoundé, Buéa, Garoua..." value={form.city || ''} onChange={e => set('city', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Adresse / Quartier</label>
                  <input className="form-input" placeholder="ex: Akwa, Bastos, Molyko..." value={form.adresse || ''} onChange={e => set('adresse', e.target.value)} />
                </div>

                <div>
                  <label className="form-label font-bold">Téléphone principal *</label>
                  <input className="form-input" placeholder="+237 6..." value={form.phone || ''} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Téléphone secondaire</label>
                  <input className="form-input" placeholder="+237 6..." value={form.telephone2 || ''} onChange={e => set('telephone2', e.target.value)} />
                </div>
                <div>
                  <label className="form-label font-bold">Email direct *</label>
                  <input className="form-input" type="email" placeholder="contact@..." value={form.email || ''} onChange={e => set('email', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Langues parlées</label>
                  <input className="form-input" placeholder="Français · Anglais · Pidgin..." value={form.langues || ''} onChange={e => set('langues', e.target.value)} />
                </div>

                <div>
                  <label className="form-label">Nombre d'abonnés principal (Affichage)</label>
                  <input className="form-input" placeholder="ex: 245K ou 1.2M" value={form.followers || ''} onChange={e => set('followers', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Taux d'engagement (%)</label>
                  <input className="form-input" type="number" step="0.1" placeholder="ex: 6.2" value={form.engagementNum || ''} onChange={e => { set('engagementNum', parseFloat(e.target.value) || 0); set('engagement', (parseFloat(e.target.value) || 0) + '%'); }} />
                </div>

                <div>
                  <label className="form-label">Catégorie Principale</label>
                  <select className="form-input" value={form.niche || 'Lifestyle'} onChange={e => { set('niche', e.target.value); set('categories', [e.target.value]); }}>
                    <option>Lifestyle</option>
                    <option>Humour</option>
                    <option>Tech</option>
                    <option>Beauté</option>
                    <option>Sport</option>
                    <option>Musique</option>
                    <option>Cuisine</option>
                    <option>Mode</option>
                    <option>Business</option>
                    <option>Culture</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Disponibilité</label>
                  <select className="form-input" value={form.disponibilite || 'disponible'} onChange={e => set('disponibilite', e.target.value)}>
                    <option value="disponible">Disponible</option>
                    <option value="occupée">Occupée</option>
                  </select>
                </div>

                <div className="inf-edit-full">
                  <label className="form-label">Bio & Présentation du créateur</label>
                  <textarea className="form-input" rows={2} placeholder="Courte biographie, ligne éditoriale, positionnement..." value={form.bio || ''} onChange={e => set('bio', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'socials' && (
            <div className="space-y-16">
              <div className="p-10 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 mb-12">
                💡 Renseignez pour chaque réseau : <strong>l'URL du profil</strong>, le <strong>pseudo / nom de chaîne</strong> et le <strong>nombre d'abonnés</strong>.
              </div>

              {/* Grille pour les 6 réseaux sociaux : YouTube, X, Facebook, LinkedIn, Instagram, TikTok */}
              <div className="grid grid-2 gap-12">
                {SOCIAL_NETWORKS.map(net => {
                  const netData = form.socialLinks?.[net.id] || { url: '', username: '', followers: 0 };
                  return (
                    <div key={net.id} className="p-12 border rounded bg-white" style={{ borderTop: `3px solid ${net.color}` }}>
                      <div className="flex items-center justify-between mb-8 pb-4 border-b">
                        <span className="font-bold text-sm flex items-center gap-6">
                          <span style={{ fontSize: 16 }}>{net.icon}</span>
                          <span>{net.label}</span>
                        </span>
                        {netData.url ? <span className="tag tag-green text-xs">Actif</span> : <span className="tag text-xs">Optionnel</span>}
                      </div>

                      <div className="space-y-8">
                        <div>
                          <label className="form-label text-xs font-semibold mb-2">URL du profil / de la chaîne</label>
                          <input
                            className="form-input text-xs"
                            placeholder={net.placeholderUrl}
                            value={netData.url || ''}
                            onChange={e => handleSocialChange(net.id, 'url', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-2 gap-8">
                          <div>
                            <label className="form-label text-xs font-semibold mb-2">Pseudo / Chaîne</label>
                            <input
                              className="form-input text-xs"
                              placeholder={net.id === 'youtube' ? 'Nom chaîne' : '@pseudo'}
                              value={netData.username || ''}
                              onChange={e => handleSocialChange(net.id, 'username', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label text-xs font-semibold mb-2">Nb abonnés</label>
                            <input
                              className="form-input text-xs"
                              type="number"
                              placeholder="ex: 150000"
                              value={netData.followers || ''}
                              onChange={e => handleSocialChange(net.id, 'followers', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-12 border-t mt-8">
          <div className="text-xs text-muted">
            {activeTab === 'general' ? 'Étape 1 sur 2 : Infos générales' : 'Étape 2 sur 2 : Réseaux sociaux'}
          </div>
          <div className="flex gap-8">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            {activeTab === 'general' ? (
              <button type="button" className="btn btn-blue" onClick={() => setActiveTab('socials')}>
                Suivant : Réseaux Sociaux ➔
              </button>
            ) : (
              <button type="button" className="btn btn-ghost" onClick={() => setActiveTab('general')}>
                ⬅ Précédent
              </button>
            )}
            <button type="button" className="btn btn-orange font-bold" onClick={handleSubmit}>
              💾 {isNew ? 'Créer la fiche influenceur' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

