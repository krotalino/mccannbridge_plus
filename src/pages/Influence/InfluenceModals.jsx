import { useState, useRef } from 'react';

const SOCIAL_NETWORKS = [
  { id: 'instagram', label: 'Instagram', icon: '📷' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'xtwitter', label: 'X (Twitter)', icon: '𝕏' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
];

/* ─── Profile Modal ─── */
export function ProfileModal({ inf, onClose, onEdit, onDelete }) {
  const [profileTab, setProfileTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: "Vue d'ensemble", icon: '🏠' },
    { id: 'socials', label: 'Réseaux & Liens', icon: '🌐' },
    { id: 'content', label: 'Livrables', icon: '🖼' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'contact', label: 'Contact & Legal', icon: '💬' },
  ];

  return (
    <div className="inf-modal-overlay" onClick={onClose}>
      <div className="inf-profile-modal" onClick={e => e.stopPropagation()}>
        <button className="inf-modal-close" onClick={onClose}>✕</button>
        {/* Header */}
        <div className="inf-profile-banner" />
        <div className="inf-profile-head">
          <div className="inf-profile-avatar-wrap">
            {inf.photo ? <img src={inf.photo} alt={inf.name} className="inf-profile-avatar" /> : <div className="inf-profile-avatar inf-avatar-placeholder">{(inf.pseudo || inf.name).charAt(0)}</div>}
          </div>
          <div className="inf-profile-info">
            <h2 className="inf-profile-name">@{inf.pseudo || inf.name}</h2>
            <div className="text-sm text-muted mb-4">{inf.prenom || ''} {inf.nom || inf.realName}</div>
            <div className="inf-profile-tags">
              <span className="tag tag-orange">{inf.platform}</span>
              {(inf.categories || [inf.niche]).map((cat, i) => (
                <span key={i} className="tag tag-ghost" style={{ fontSize: 10 }}>{cat}</span>
              ))}
            </div>
            <div className="inf-profile-stats">
              <span>👥 <strong>{inf.followers}</strong> abonnés</span>
              <span>♡ <strong>{inf.engagement}</strong> engagement</span>
              <span>👁 <strong>{inf.avgViews}</strong> vues moy.</span>
            </div>
          </div>
          <div className="inf-profile-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => onEdit(inf)} title="Modifier">✏️</button>
            <button className="btn btn-ghost btn-sm" onClick={() => onDelete(inf.id)} title="Supprimer" style={{ color: 'var(--red)' }}>🗑</button>
          </div>
        </div>

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
              <div className="inf-ov-card"><div className="inf-ov-label">CATÉGORIES / NICHES</div><p>{(inf.categories || [inf.niche]).join(', ')}</p></div>
              <div className="inf-ov-card"><div className="inf-ov-label">RISQUE & MORALITÉ</div><p style={{ color: inf.riskScore <= 1 ? 'var(--green)' : inf.riskScore <= 2 ? 'var(--yellow)' : 'var(--red)', fontWeight: 700 }}>Score Risque: {inf.riskScore}/5</p><p className="text-xs text-muted">{inf.riskNotes}</p></div>
              <div className="inf-ov-card"><div className="inf-ov-label">CAMPAGNES</div><p className="text-lg font-bold">{inf.campaigns || 0}</p><p className="text-xs text-muted">Dernière: {inf.lastCampaign || '—'}</p></div>
              <div className="inf-ov-card"><div className="inf-ov-label">DISPONIBILITÉ</div><span className={`tag ${inf.disponibilite === 'disponible' ? 'tag-green' : 'tag-yellow'}`}>{inf.disponibilite}</span></div>
            </div>
          )}

          {profileTab === 'socials' && (
            <div>
              <h4 className="text-sm font-bold text-dark mb-12">Plateformes et liens réseaux sociaux</h4>
              <div className="grid grid-2 gap-12">
                {SOCIAL_NETWORKS.map(net => {
                  const data = (inf.socialLinks || {})[net.id];
                  const hasLink = data && data.url;
                  return (
                    <div key={net.id} className="p-12 border rounded" style={{ background: hasLink ? '#fff' : '#fafafa', opacity: hasLink ? 1 : 0.6 }}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-sm">{net.icon} {net.label}</span>
                        {hasLink ? <span className="tag tag-green text-xs">Actif</span> : <span className="tag text-xs">Non configuré</span>}
                      </div>
                      {hasLink ? (
                        <div>
                          <div className="text-xs text-muted mb-4">Abonnés: <strong>{data.followers ? data.followers.toLocaleString() : '—'}</strong></div>
                          <a href={data.url} target="_blank" rel="noreferrer" className="text-xs text-blue underline break-all">
                            {data.url}
                          </a>
                        </div>
                      ) : (
                        <div className="text-xs text-muted italic">Aucun lien disponible</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {profileTab === 'content' && (
            <div>
              <h4 className="text-sm font-bold text-dark mb-12">Livrables en cours / Cahier des charges</h4>
              {inf.pendingDeliverables && inf.pendingDeliverables.length > 0 ? inf.pendingDeliverables.map((d, i) => (
                <div key={i} className="inf-deliv-item"><span className="font-semibold">{d.title}</span><span className="text-muted text-sm">Deadline: {d.deadline}</span><span className={`tag ${d.daysLeft < 0 ? 'tag-red' : 'tag-yellow'}`}>{d.daysLeft < 0 ? 'EN RETARD' : d.status.replace('_', ' ')}</span></div>
              )) : <p className="text-muted text-sm">Aucun livrable en attente.</p>}
            </div>
          )}

          {profileTab === 'analytics' && (
            <div>
              <h4 className="text-sm font-bold text-dark mb-12">Historique de Performance</h4>
              {inf.performanceHistory && inf.performanceHistory.length > 0 ? (
                <table className="table w-full"><thead><tr><th>Campagne</th><th className="text-right">Reach</th><th className="text-right">Engagement</th><th className="text-center">Qualité</th></tr></thead>
                  <tbody>{inf.performanceHistory.map((p, i) => (<tr key={i}><td>{p.campaign}</td><td className="text-right" style={{ color: p.kpiReach >= p.kpiTarget ? 'var(--green)' : 'var(--red)' }}>{Math.round(p.kpiReach / (p.kpiTarget || 1) * 100)}%</td><td className="text-right" style={{ color: p.kpiEngagement >= p.engagementTarget ? 'var(--green)' : 'var(--red)' }}>{Math.round(p.kpiEngagement / (p.engagementTarget || 1) * 100)}%</td><td className="text-center">{p.contentQuality}/5</td></tr>))}</tbody></table>
              ) : <p className="text-muted text-sm">Pas encore de données d'analytics.</p>}
            </div>
          )}

          {profileTab === 'contact' && (
            <div className="inf-contact-grid">
              <div className="inf-contact-details" style={{ width: '100%' }}>
                <h4 className="text-sm font-bold text-dark mb-12">Coordonnées Complètes</h4>
                <div className="inf-contact-row"><span className="inf-contact-icon" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)' }}>📍</span><div><div className="inf-ov-label">ADRESSE & LOCALISATION</div><strong>{inf.adresse || inf.city || 'Non renseignée'} ({inf.region})</strong></div></div>
                <div className="inf-contact-row"><span className="inf-contact-icon" style={{ background: 'rgba(41,128,185,0.1)', color: 'var(--blue)' }}>✉</span><div><div className="inf-ov-label">EMAIL DIRECT</div><strong style={{ fontSize: 12 }}>{inf.email}</strong></div></div>
                <div className="inf-contact-row"><span className="inf-contact-icon" style={{ background: 'rgba(39,174,96,0.1)', color: 'var(--green)' }}>📞</span><div><div className="inf-ov-label">TÉLÉPHONES</div><strong>{inf.phone}</strong> {inf.telephone2 && <span> / {inf.telephone2}</span>}</div></div>
                <div className="inf-contact-row"><span className="inf-contact-icon" style={{ background: 'rgba(142,68,173,0.1)', color: 'var(--purple)' }}>📑</span><div><div className="inf-ov-label">DOCUMENTS LÉGAUX</div><strong>CNI: {inf.documentsLegaux?.pieceIdentite?.present ? '✓ Conforme' : '⚠️ Manquant'} • RIB: {inf.documentsLegaux?.rib?.present ? '✓ Conforme' : '⚠️ Manquant'}</strong></div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Edit/Add Modal ─── */
export function EditModal({ inf, onClose, onSave }) {
  const isNew = !inf;
  const [form, setForm] = useState(inf ? { ...inf } : {
    name: '', prenom: '', nom: '', pseudo: '', handle: '', followers: '', engagement: '', engagementNum: 0, avgViews: '',
    type: 'Micro', city: '', region: '', score: 0, segment: '', niche: 'Lifestyle', categories: ['Lifestyle'], platform: 'Instagram',
    status: 'new', contractStatus: 'prospect', contractEnd: null, cachetBase: 0, cachetVariable: 0,
    campaigns: 0, lastCampaign: '—', brandsActives: 0, exclusivite: false, photo: null,
    email: '', phone: '', telephone2: '', adresse: '', langues: 'Français', bio: '', disponibilite: 'disponible',
    reseaux: ['Instagram'], socialLinks: { instagram: { url: '', followers: 0 }, tiktok: { url: '', followers: 0 } },
    moralityCheck: { done: false, date: null, result: null, notes: '' },
    riskScore: 0, riskNotes: '', performanceHistory: [], pendingDeliverables: [], competitorAlert: false,
  });
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({ ...f, photo: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!form.name && !form.pseudo) return alert('Le nom/pseudo est requis');
    onSave(form);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="inf-modal-overlay" onClick={onClose}>
      <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <button className="inf-modal-close" onClick={onClose}>✕</button>
        <h3 className="text-lg font-bold text-dark mb-16">{isNew ? 'Ajouter un influenceur' : "Modifier la fiche influenceur"}</h3>

        <div className="inf-edit-photo-row mb-12">
          {form.photo ? <img src={form.photo} className="inf-edit-avatar" alt="" /> : <div className="inf-edit-avatar inf-avatar-placeholder">{(form.pseudo || form.name || '?').charAt(0)}</div>}
          <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>Charger photo de profil</button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
        </div>

        <div className="inf-edit-grid">
          <div><label className="form-label">Prénom *</label><input className="form-input" value={form.prenom || ''} onChange={e => set('prenom', e.target.value)} /></div>
          <div><label className="form-label">Nom *</label><input className="form-input" value={form.nom || ''} onChange={e => set('nom', e.target.value)} /></div>
          <div><label className="form-label">Pseudo / Nom Chaîne *</label><input className="form-input" value={form.pseudo || form.name || ''} onChange={e => { set('pseudo', e.target.value); set('name', e.target.value); }} /></div>
          <div><label className="form-label">Handle (@)</label><input className="form-input" value={form.handle || ''} onChange={e => set('handle', e.target.value)} /></div>

          <div><label className="form-label">Téléphone principal *</label><input className="form-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} /></div>
          <div><label className="form-label">Téléphone secondaire</label><input className="form-input" value={form.telephone2 || ''} onChange={e => set('telephone2', e.target.value)} /></div>
          <div><label className="form-label">Email direct *</label><input className="form-input" value={form.email || ''} onChange={e => set('email', e.target.value)} /></div>
          <div><label className="form-label">Adresse (Ville & Quartier)</label><input className="form-input" value={form.adresse || ''} onChange={e => set('adresse', e.target.value)} /></div>

          <div><label className="form-label">Ville</label><input className="form-input" value={form.city || ''} onChange={e => set('city', e.target.value)} /></div>
          <div><label className="form-label">Région</label><input className="form-input" value={form.region || ''} onChange={e => set('region', e.target.value)} /></div>

          <div><label className="form-label">Nombre d'abonnés principal</label><input className="form-input" value={form.followers || ''} onChange={e => set('followers', e.target.value)} /></div>
          <div><label className="form-label">Taux d'engagement (%)</label><input className="form-input" value={form.engagementNum || ''} onChange={e => { set('engagementNum', parseFloat(e.target.value) || 0); set('engagement', e.target.value + '%'); }} /></div>

          <div><label className="form-label">Catégorie Principale</label><select className="form-input" value={form.niche || ''} onChange={e => set('niche', e.target.value)}><option>Lifestyle</option><option>Humour</option><option>Tech</option><option>Beauté</option><option>Sport</option><option>Musique</option><option>Cuisine</option><option>Mode</option></select></div>
          <div><label className="form-label">Taille profil</label><select className="form-input" value={form.type || 'Micro'} onChange={e => set('type', e.target.value)}><option>Macro</option><option>Micro</option><option>Nano</option></select></div>

          <div className="inf-edit-full">
            <label className="form-label">Lien Instagram</label>
            <input className="form-input" value={(form.socialLinks?.instagram?.url) || ''} onChange={e => setForm(f => ({ ...f, socialLinks: { ...(f.socialLinks || {}), instagram: { ...(f.socialLinks?.instagram || {}), url: e.target.value } } }))} placeholder="https://instagram.com/..." />
          </div>
          <div className="inf-edit-full">
            <label className="form-label">Lien TikTok</label>
            <input className="form-input" value={(form.socialLinks?.tiktok?.url) || ''} onChange={e => setForm(f => ({ ...f, socialLinks: { ...(f.socialLinks || {}), tiktok: { ...(f.socialLinks?.tiktok || {}), url: e.target.value } } }))} placeholder="https://tiktok.com/@..." />
          </div>

          <div className="inf-edit-full"><label className="form-label">Bio / Présentation</label><textarea className="form-input" rows={2} value={form.bio || ''} onChange={e => set('bio', e.target.value)} /></div>
        </div>

        <div className="flex gap-8 mt-16">
          <button className="btn btn-orange" style={{ flex: 1 }} onClick={handleSubmit}>{isNew ? 'Ajouter' : 'Enregistrer'}</button>
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
