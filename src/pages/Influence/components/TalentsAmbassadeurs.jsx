import React, { useState, useMemo } from 'react';
import { getDeliverableSnapshots } from '../InfluenceStore';
import { formatNumber, Badge, PlatformIcon, TALENT_TYPES } from './InfluenceCommon';
import TalentModal from './TalentModal';
import DuplicatesModal from './DuplicatesModal';

const ITEMS_PER_PAGE = 25;

export default function TalentsAmbassadeurs({ data, onMerge, onKeepSeparate }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);

  const snapshots = useMemo(() => getDeliverableSnapshots(data.snapshots || []), [data.snapshots]);

  // Compute stats per talent
  const talentStats = useMemo(() => {
    const stats = new Map();
    for (const t of data.talents || []) {
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
  }, [data.talents, data.deliverables, snapshots]);

  // Open duplicate issues
  const duplicateIssues = useMemo(() => {
    return (data.issues || []).filter(
      iss => iss.code === 'duplicate_candidate' && iss.resolution_status === 'open'
    );
  }, [data.issues]);

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

  // Filter talents
  const filteredTalents = useMemo(() => {
    let list = data.talents || [];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        t =>
          (t.display_name || '').toLowerCase().includes(q) ||
          (t.pseudo || '').toLowerCase().includes(q) ||
          (t.phone || '').toLowerCase().includes(q) ||
          (t.profile_url || '').toLowerCase().includes(q)
      );
    }
    if (typeFilter) {
      list = list.filter(t => t.type === typeFilter);
    }
    if (platformFilter) {
      list = list.filter(t => (t.platform_profiles || []).some(p => p.platform === platformFilter));
    }
    if (qualityFilter === 'duplicates') {
      list = list.filter(t => duplicateTalentIds.has(t.id));
    } else if (qualityFilter === 'no_profile') {
      list = list.filter(t => !(t.platform_profiles || []).length && !t.profile_url);
    }
    return list;
  }, [data.talents, search, typeFilter, platformFilter, qualityFilter, duplicateTalentIds]);

  const totalPages = Math.max(1, Math.ceil(filteredTalents.length / ITEMS_PER_PAGE));
  const pagedTalents = filteredTalents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* En-tête & Filtres Style Dashboard Analytics */}
      <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0, letterSpacing: '-0.3px' }}>
                ANNUAIRE UNIFIÉ DES TALENTS & AMBASSADEURS
              </h2>
              <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
                {filteredTalents.length} créateurs affichés
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Vivier centralisé Orange Cameroun : influenceurs, ambassadeurs universitaires, webzines et relais d'opinion
            </p>
          </div>

          {duplicateIssues.length > 0 && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowDuplicatesModal(true)}
              style={{ background: '#F39C12', color: '#FFF', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>⚠️</span> Arbitrer {duplicateIssues.length} doublon(s)
            </button>
          )}
        </div>

        {/* Barre de recherche et filtres */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 10,
            padding: '12px 14px',
            background: '#F9F9FB',
            borderRadius: 10,
            border: '1px solid #E5E7EB'
          }}
        >
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              style={{ height: 38, fontSize: 12, borderRadius: 6 }}
              placeholder="🔍 Rechercher nom, pseudo, lien..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            className="form-input form-select"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            value={typeFilter}
            onChange={e => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les types ({data.talents.length})</option>
            <option value="influencer">Influenceurs</option>
            <option value="ambassador">Ambassadeurs</option>
            <option value="ambassador_admin">Admins Ambassadeur</option>
            <option value="page_relais">Pages Relais</option>
            <option value="webzine">Webzines</option>
          </select>

          <select
            className="form-input form-select"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            value={platformFilter}
            onChange={e => {
              setPlatformFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toutes plateformes</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="website">Presse & Web</option>
          </select>

          <select
            className="form-input form-select"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            value={qualityFilter}
            onChange={e => {
              setQualityFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toutes qualités</option>
            <option value="duplicates">Doublons potentiels ({duplicateIssues.length})</option>
            <option value="no_profile">Sans lien social externe</option>
          </select>
        </div>

        {/* Alerte Doublons si présents */}
        {duplicateIssues.length > 0 && qualityFilter !== 'duplicates' && (
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 8,
              background: '#FFF8F2',
              border: '1px solid #FFE0B2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠️</span>
              <span style={{ color: 'var(--dark)' }}>
                <strong>Vigilance Annuaire :</strong> {duplicateIssues.length} paire(s) de créateurs présentent des pseudos ou numéros identiques.
              </span>
            </div>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setQualityFilter('duplicates')}
              style={{ background: 'transparent', color: '#FF7900', fontWeight: 700, padding: 0 }}
            >
              Filtrer les doublons →
            </button>
          </div>
        )}
      </div>

      {/* Tableau des talents style Dashboard Analytics */}
      <div className="card p-0" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', marginBottom: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Talent / Créateur
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Typologie
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Origine
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Plateformes & Profils
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Livrables
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Vues Mesurées
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Engagements
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Statut
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedTalents.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--muted)' }}>
                    Aucun talent ne correspond à vos filtres de recherche.
                  </td>
                </tr>
              ) : (
                pagedTalents.map((talent, idx) => {
                  const st = talentStats.get(talent.id) || { delivs: 0, views: 0, engagement: 0, hasViews: false };
                  const typeInfo = TALENT_TYPES[talent.type] || { label: talent.type, badge: 'tag-muted' };
                  const isDuplicate = duplicateTalentIds.has(talent.id);

                  return (
                    <tr
                      key={talent.id}
                      style={{
                        borderBottom: '1px solid #F0F0F0',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF8F2'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC'}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: '#FF7900',
                              color: '#FFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: 12,
                              flexShrink: 0
                            }}
                          >
                            {(talent.display_name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              {isDuplicate && <span title="Doublon potentiel non arbitré">⚠️</span>}
                              <span>{talent.display_name}</span>
                            </div>
                            {talent.pseudo && (
                              <div style={{ fontSize: 11, color: '#FF7900', fontWeight: 600 }}>
                                @{talent.pseudo}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <Badge tone={typeInfo.badge}>{typeInfo.label}</Badge>
                      </td>

                      <td style={{ padding: '12px 16px', fontSize: 11.5, color: 'var(--muted)' }}>
                        {talent.source_sheet_name || 'Excel'}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          {(talent.platform_profiles || []).map((p, i) => (
                            <span key={i} className="tag tag-muted" style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <PlatformIcon platform={p.platform} />
                              <span>{p.handle || p.platform}</span>
                            </span>
                          ))}
                          {!(talent.platform_profiles || []).length && (
                            <span style={{ fontSize: 11, color: 'var(--muted)' }}>—</span>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--dark)' }}>
                        {st.delivs}
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 700, color: st.hasViews ? '#FF7900' : 'var(--muted)' }}>
                        {st.hasViews ? formatNumber(st.views) : '—'}
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 700, color: st.engagement > 0 ? '#27AE60' : 'var(--muted)' }}>
                        {st.engagement > 0 ? formatNumber(st.engagement) : '—'}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        {isDuplicate ? (
                          <span className="tag tag-yellow" style={{ fontSize: 10 }}>À arbitrer</span>
                        ) : (
                          <span className="tag tag-green" style={{ fontSize: 10 }}>Qualifié</span>
                        )}
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setSelectedTalent(talent)}
                          style={{ border: '1px solid #D0D0D0', fontSize: 11 }}
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

        {/* Pagination Style Dashboard Analytics */}
        <div
          style={{
            padding: '12px 16px',
            background: '#F8F9FA',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--muted)'
          }}
        >
          <div>
            Affichage de <strong>{Math.min(filteredTalents.length, (page - 1) * ITEMS_PER_PAGE + 1)}</strong> à{' '}
            <strong>{Math.min(filteredTalents.length, page * ITEMS_PER_PAGE)}</strong> sur{' '}
            <strong>{filteredTalents.length}</strong> talents
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{ border: '1px solid #D0D0D0' }}
            >
              ← Précédent
            </button>
            <span style={{ fontWeight: 700, color: 'var(--dark)', padding: '0 8px' }}>
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              style={{ border: '1px solid #D0D0D0' }}
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedTalent && (
        <TalentModal
          talent={selectedTalent}
          data={data}
          onClose={() => setSelectedTalent(null)}
        />
      )}

      {showDuplicatesModal && (
        <DuplicatesModal
          data={data}
          onClose={() => setShowDuplicatesModal(false)}
          onMerge={onMerge}
          onKeepSeparate={onKeepSeparate}
        />
      )}
    </div>
  );
}
