import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { getDeliverableSnapshots } from '../InfluenceStore';
import { formatNumber, Badge, PlatformIcon, TALENT_TYPES } from './InfluenceCommon';
import TalentModal from './TalentModal';
import DuplicatesModal from './DuplicatesModal';
import TalentCard from './TalentCard';
import { getTalentPhoto } from '../utils/talentPhotos';

const ITEMS_PER_PAGE = 8;

// SVG Badge vérifié pour les créateurs officiels
function VerifiedBadge() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#1D9BF0"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      title="Profil vérifié Orange Cameroun"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

export default function TalentsAmbassadeurs({
  data = {},
  influencers: rawInfluencers,
  onEdit,
  onAdd,
  onDelete,
  onMerge,
  onKeepSeparate
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
  const [viewMode, setViewMode] = useState('sync'); // 'sync' | 'table'

  const appContext = useApp?.() || {};
  const currentInfluencers = (rawInfluencers && rawInfluencers.length > 0)
    ? rawInfluencers
    : (appContext.influencers || []);

  const snapshots = useMemo(() => getDeliverableSnapshots(data.snapshots || []), [data.snapshots]);

  // Normalisation des influenceurs réels de la plateforme (aucun profil fictif)
  const unifiedTalents = useMemo(() => {
    return (currentInfluencers || []).map(inf => {
      const platform_profiles = [];
      if (inf.socialLinks && typeof inf.socialLinks === 'object') {
        for (const [net, info] of Object.entries(inf.socialLinks)) {
          if (info && (info.url || info.username || (info.followers && info.followers > 0))) {
            platform_profiles.push({
              platform: net,
              handle: info.username ? (info.username.startsWith('@') ? info.username : `@${info.username}`) : `@${inf.pseudo || inf.name}`,
              url: info.url || '',
              followers: info.followers || 0
            });
          }
        }
      }
      if (platform_profiles.length === 0 && Array.isArray(inf.reseaux)) {
        inf.reseaux.forEach(r => {
          platform_profiles.push({
            platform: String(r).toLowerCase(),
            handle: `@${inf.pseudo || inf.handle || inf.name}`,
            url: ''
          });
        });
      }
      if (platform_profiles.length === 0) {
        platform_profiles.push({
          platform: (inf.platform || 'instagram').toLowerCase(),
          handle: `@${inf.pseudo || inf.handle || inf.name}`,
          url: ''
        });
      }

      const displayName = inf.realName || `${inf.prenom || ''} ${inf.nom || ''}`.trim() || inf.name || inf.pseudo;

      return {
        ...inf,
        id: inf.id,
        display_name: displayName,
        first_name: inf.prenom || displayName.split(' ')[0] || displayName,
        last_name: inf.nom || displayName.split(' ').slice(1).join(' ') || '',
        pseudo: inf.pseudo || inf.handle || inf.name,
        handle: inf.handle || inf.pseudo || inf.name,
        photo: inf.photo || null,
        type: inf.type || 'Macro',
        platform: inf.platform || 'Instagram',
        platform_profiles,
        city: inf.city || 'Douala',
        region: inf.region || 'Littoral',
        phone: inf.phone || inf.telephone2 || '',
        cahier_charges: inf.cahierDesCharges?.[0]?.campagneNom || inf.lastCampaign || 'Orange Weekend 2026',
        status: inf.status || 'active',
        contractStatus: inf.contractStatus || 'actif',
        contractEnd: inf.contractEnd || null,
        cachetBase: inf.cachetBase || 0,
        cachetVariable: inf.cachetVariable || 0,
        followers: inf.followers || '10K',
        engagement: inf.engagement || '5.0%',
        avgViews: inf.avgViews || '50K',
        bio: inf.bio || '',
        disponibilite: inf.disponibilite || 'disponible',
        langues: inf.langues || 'Français',
        exclusivite: !!inf.exclusivite,
        score: inf.score || 4.2
      };
    });
  }, [currentInfluencers]);

  // Calcul des statistiques par créateur
  const talentStats = useMemo(() => {
    const stats = new Map();
    for (const t of unifiedTalents) {
      stats.set(t.id, { delivs: 0, views: 0, engagement: 0, hasViews: false });
    }
    for (const d of data.deliverables || []) {
      if (!d.talent_id) continue;
      const st = stats.get(d.talent_id) || { delivs: 0, views: 0, engagement: 0, hasViews: false };
      st.delivs++;
      const s = snapshots.get(d.id);
      if (s) {
        if (s.views !== null && s.views !== undefined) {
          st.views += s.views;
          st.hasViews = true;
        }
        if (s.engagement_calculated) st.engagement += s.engagement_calculated;
      }
      stats.set(d.talent_id, st);
    }
    return stats;
  }, [unifiedTalents, data.deliverables, snapshots]);

  // Détection de doublons dans l'annuaire unifié
  const duplicateIssues = useMemo(() => {
    const issues = [];
    const map = new Map();
    unifiedTalents.forEach(t => {
      const cleanPseudo = (t.pseudo || t.name || '').toLowerCase().replace(/[@\s]/g, '');
      if (cleanPseudo && cleanPseudo.length > 2) {
        if (map.has(cleanPseudo)) {
          const first = map.get(cleanPseudo);
          issues.push({
            id: `iss-dup-${first.id}-${t.id}`,
            code: 'duplicate_candidate',
            message: `Doublon potentiel entre ${first.display_name} et ${t.display_name} (@${cleanPseudo})`,
            raw_value: JSON.stringify({ talentA: first.id, talentB: t.id }),
            resolution_status: 'open'
          });
        } else {
          map.set(cleanPseudo, t);
        }
      }
    });
    return issues;
  }, [unifiedTalents]);

  const duplicateTalentIds = useMemo(() => {
    const set = new Set();
    for (const iss of duplicateIssues) {
      try {
        const pair = JSON.parse(iss.raw_value || '{}');
        if (pair.talentA) set.add(pair.talentA);
        if (pair.talentB) set.add(pair.talentB);
      } catch (e) {
        console.error(e);
      }
    }
    return set;
  }, [duplicateIssues]);

  // Filtrage des talents
  const filteredTalents = useMemo(() => {
    let list = unifiedTalents;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        t =>
          (t.display_name || '').toLowerCase().includes(q) ||
          (t.pseudo || '').toLowerCase().includes(q) ||
          (t.phone || '').toLowerCase().includes(q) ||
          (t.city || '').toLowerCase().includes(q) ||
          (t.region || '').toLowerCase().includes(q) ||
          (t.niche || '').toLowerCase().includes(q)
      );
    }
    if (typeFilter) {
      list = list.filter(t => (t.type || '').toLowerCase() === typeFilter.toLowerCase());
    }
    if (platformFilter) {
      list = list.filter(t =>
        (t.platform_profiles || []).some(p => p.platform.toLowerCase() === platformFilter.toLowerCase()) ||
        (t.platform || '').toLowerCase() === platformFilter.toLowerCase()
      );
    }
    if (qualityFilter === 'duplicates') {
      list = list.filter(t => duplicateTalentIds.has(t.id));
    } else if (qualityFilter === 'no_profile') {
      list = list.filter(t => !(t.platform_profiles || []).length && !t.profile_url);
    } else if (qualityFilter === 'actif') {
      list = list.filter(t => t.contractStatus === 'actif');
    } else if (qualityFilter === 'exclusif') {
      list = list.filter(t => t.exclusivite);
    }
    return list;
  }, [unifiedTalents, search, typeFilter, platformFilter, qualityFilter, duplicateTalentIds]);

  const totalPages = Math.ceil(filteredTalents.length / ITEMS_PER_PAGE) || 1;
  const pagedTalents = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTalents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTalents, page]);

  // Comptages globaux réels
  const totalInfluencers = unifiedTalents.filter(t => {
    const tp = (t.type || '').toLowerCase();
    return tp.includes('macro') || tp.includes('micro') || tp.includes('nano') || tp.includes('mega') || tp.includes('influence');
  }).length;
  const totalAmbassadeurs = unifiedTalents.filter(t => {
    const tp = (t.type || '').toLowerCase();
    return tp.includes('ambassa') || tp.includes('etudiant');
  }).length;
  const totalMedia = unifiedTalents.filter(t => {
    const tp = (t.type || '').toLowerCase();
    return tp.includes('media') || tp.includes('relais') || tp.includes('webzine');
  }).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ─── 1. BANDEAU DE STATS SOMMAIRE ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14
        }}
      >
        <div className="card" style={{ padding: '16px 20px', background: '#FFF' }}>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Créateurs Enregistrés
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--dark)', marginTop: 4 }}>
            {unifiedTalents.length}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            Influenceurs & ambassadeurs plateforme
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', background: '#FFF' }}>
          <div style={{ fontSize: 11.5, color: '#E65100', fontWeight: 700, textTransform: 'uppercase' }}>
            Influenceurs Stars & Leaders
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#FF7900', marginTop: 4 }}>
            {totalInfluencers}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            Créateurs de contenu certifiés
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', background: '#FFF' }}>
          <div style={{ fontSize: 11.5, color: '#1B5E20', fontWeight: 700, textTransform: 'uppercase' }}>
            Ambassadeurs & Étudiants
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#2E7D32', marginTop: 4 }}>
            {totalAmbassadeurs}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            Réseau campus & pôles régionaux
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', background: '#FFF' }}>
          <div style={{ fontSize: 11.5, color: '#0D47A1', fontWeight: 700, textTransform: 'uppercase' }}>
            Webzines & Pages Relais
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#1565C0', marginTop: 4 }}>
            {totalMedia}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            Presse digitale & canaux partenaires
          </div>
        </div>
      </div>

      {/* ─── 2. BARRE D'ACTIONS ET FILTRES ─── */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          background: '#FFF',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
              Annuaire Unifié des Talents & Ambassadeurs
            </span>
            <span className="tag tag-orange" style={{ fontWeight: 800, fontSize: 11 }}>
              {filteredTalents.length} créateur(s)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onAdd && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onAdd}
                style={{
                  background: '#FF7900',
                  color: '#FFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>+</span>
                <span>Nouvel influenceur</span>
              </button>
            )}

            {duplicateIssues.length > 0 && (
              <button
                type="button"
                className="btn"
                onClick={() => setShowDuplicatesModal(true)}
                style={{
                  background: '#FEF3C7',
                  color: '#92400E',
                  borderColor: '#FCD34D',
                  fontWeight: 700,
                  fontSize: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>⚠️</span>
                <span>Arbitrer les doublons ({duplicateIssues.length})</span>
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="input"
            style={{ minWidth: 260, flex: 1 }}
            placeholder="Rechercher par nom, pseudo (@...), téléphone, ville..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="input"
            style={{ width: 'auto' }}
            value={typeFilter}
            onChange={e => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les types d'influenceur</option>
            <option value="Macro">Macro</option>
            <option value="Micro">Micro</option>
            <option value="Nano">Nano</option>
            <option value="Mega">Mega</option>
            <option value="Ambassadeur">Ambassadeur</option>
            <option value="Admin Ambassadeur">Admin Ambassadeur</option>
            <option value="Webzine">Webzine / Presse</option>
            <option value="Page Relais">Page Relais</option>
          </select>

          <select
            className="input"
            style={{ width: 'auto' }}
            value={platformFilter}
            onChange={e => {
              setPlatformFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toutes les plateformes</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">X (Twitter)</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <select
            className="input"
            style={{ width: 'auto' }}
            value={qualityFilter}
            onChange={e => {
              setQualityFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les profils</option>
            <option value="actif">Contrat Actif uniquement</option>
            <option value="exclusif">Exclusifs Orange uniquement</option>
            <option value="duplicates">Doublons à arbitrer</option>
            <option value="no_profile">Sans profil social rattaché</option>
          </select>

          {/* Switch de vue */}
          <div style={{ display: 'inline-flex', border: '1px solid #D1D5DB', borderRadius: 8, overflow: 'hidden', marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => setViewMode('sync')}
              style={{
                padding: '6px 12px',
                background: viewMode === 'sync' ? '#FF7900' : '#FFF',
                color: viewMode === 'sync' ? '#FFF' : '#374151',
                border: 'none',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Grille
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px',
                background: viewMode === 'table' ? '#FF7900' : '#FFF',
                color: viewMode === 'table' ? '#FFF' : '#374151',
                border: 'none',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Tableau
            </button>
          </div>
        </div>
      </div>

      {/* ─── 3. VUE GRILLE DE CARTES ─── */}
      {viewMode === 'sync' && (
        <div>
          {pagedTalents.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', background: '#FFF' }}>
              Aucun créateur ne correspond à vos critères de recherche.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
                gap: 18
              }}
            >
              {pagedTalents.map(talent => {
                const st = talentStats.get(talent.id) || {};
                const isDuplicate = duplicateTalentIds.has(talent.id);
                return (
                  <TalentCard
                    key={talent.id}
                    talent={talent}
                    stats={st}
                    isDuplicate={isDuplicate}
                    onOpenProfile={() => setSelectedTalent(talent)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── 4. VUE TABLEAU DÉTAILLÉ ─── */}
      {viewMode === 'table' && (
        <div className="card" style={{ background: '#FFF', borderRadius: 12, overflow: 'hidden', padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 800, color: 'var(--muted)' }}>Talent / Créateur</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)' }}>Typologie</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)' }}>Plateformes</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', textAlign: 'center' }}>Livrables</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', textAlign: 'right' }}>Abonnés / Vues</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', textAlign: 'right' }}>Engagement</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', textAlign: 'center' }}>Statut</th>
                  <th style={{ padding: '12px 18px', fontWeight: 800, color: 'var(--muted)', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedTalents.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
                      Aucun créateur trouvé.
                    </td>
                  </tr>
                ) : (
                  pagedTalents.map(talent => {
                    const isDuplicate = duplicateTalentIds.has(talent.id);
                    const photoUrl = getTalentPhoto(talent);

                    return (
                      <tr
                        key={talent.id}
                        style={{
                          borderBottom: '1px solid #F0F0F0',
                          transition: 'background 0.15s ease',
                          background: isDuplicate ? '#FEFDF8' : '#FFF'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FFF9F4'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = isDuplicate ? '#FEFDF8' : '#FFF'; }}
                      >
                        {/* 1. Colonne Talent avec Photo Réelle */}
                        <td style={{ padding: '12px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 10,
                                position: 'relative',
                                flexShrink: 0,
                                background: '#F3F4F6'
                              }}
                            >
                              <img
                                src={photoUrl}
                                alt={talent.display_name}
                                referrerPolicy="no-referrer"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: 10,
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                              />
                            </div>

                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span>{talent.display_name}</span>
                                <VerifiedBadge />
                              </div>
                              <div style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 500 }}>
                                @{talent.pseudo?.replace(/^@+/, '') || talent.handle}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Typologie */}
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              background: '#FFF3E8',
                              color: '#E65100',
                              border: '1px solid #FFE0CC',
                              borderRadius: 6,
                              padding: '2px 8px',
                              fontSize: 11,
                              fontWeight: 700
                            }}
                          >
                            {talent.type || 'Macro'}
                          </span>
                        </td>

                        {/* 3. Plateformes */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {(talent.platform_profiles || []).map((p, idx) => (
                              <span
                                key={idx}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: '2px 7px',
                                  borderRadius: 4,
                                  background: '#F3F4F6',
                                  fontSize: 11,
                                  color: '#4B5563',
                                  fontWeight: 600
                                }}
                              >
                                <PlatformIcon platform={p.platform} />
                                <span>{p.platform}</span>
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* 4. Livrables */}
                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>
                          <span style={{ background: '#F3F4F6', padding: '2px 8px', borderRadius: 10, fontSize: 11.5, color: '#374151' }}>
                            {talent.pendingDeliverables?.length || talent.campaigns || 1}
                          </span>
                        </td>

                        {/* 5. Vues / Abonnés */}
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#EA580C', fontSize: 13 }}>
                          {talent.followers || talent.avgViews || '10K'}
                        </td>

                        {/* 6. Engagement */}
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: 13 }}>
                          {talent.engagement || '5.2%'}
                        </td>

                        {/* 7. Statut */}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              background: talent.contractStatus === 'actif' ? '#E8F8F0' : '#FFF3E8',
                              color: talent.contractStatus === 'actif' ? '#27AE60' : '#E65100',
                              borderRadius: 12,
                              padding: '2px 8px',
                              fontSize: 10.5,
                              fontWeight: 700
                            }}
                          >
                            {talent.contractStatus === 'actif' ? 'Qualifié' : (talent.contractStatus || 'Prospect')}
                          </span>
                        </td>

                        {/* 8. Action */}
                        <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedTalent(talent)}
                            style={{
                              background: '#FFF3E8',
                              color: '#E65100',
                              border: 'none',
                              borderRadius: 6,
                              padding: '5px 12px',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#FFE8D6'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#FFF3E8'; }}
                          >
                            Fiche →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── 5. PAGINATION COMMUNE ─── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 12 }}
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            ← Précédent
          </button>
          <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>
            Page {page} sur {totalPages} ({filteredTalents.length} créateurs)
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 12 }}
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Suivant →
          </button>
        </div>
      )}

      {/* Modale de consultation de la Fiche Talent & Ambassadeur */}
      {selectedTalent && (
        <TalentModal
          talent={selectedTalent}
          onEdit={(t) => {
            setSelectedTalent(null);
            if (onEdit) onEdit(t);
          }}
          onClose={() => setSelectedTalent(null)}
        />
      )}

      {/* Modale d'arbitrage des doublons */}
      {showDuplicatesModal && (
        <DuplicatesModal
          issues={duplicateIssues}
          data={data}
          onMerge={(targetId, absorbedId) => {
            if (onMerge) onMerge(targetId, absorbedId);
          }}
          onKeepSeparate={talentIds => {
            if (onKeepSeparate) onKeepSeparate(talentIds);
          }}
          onClose={() => setShowDuplicatesModal(false)}
        />
      )}
    </div>
  );
}
