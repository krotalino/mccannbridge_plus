import React, { useState, useMemo } from 'react';
import { getDeliverableSnapshots } from '../InfluenceStore';
import {
  formatNumber,
  Badge,
  PlatformIcon,
  DELIVERABLE_STATUSES,
  QUALITY_STATUSES
} from './InfluenceCommon';
import DeliverableModal from './DeliverableModal';

const ITEMS_PER_PAGE = 30;

export default function LivrablesValidations({ data, setStatus, onOpenTalentProfile }) {
  const [search, setSearch] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);

  const snapshots = useMemo(() => getDeliverableSnapshots(data.snapshots || []), [data.snapshots]);

  // Unique subjects
  const subjects = useMemo(() => {
    return [...new Set((data.deliverables || []).map(d => (d.content_subject || '').trim()).filter(Boolean))].sort();
  }, [data.deliverables]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { total: (data.deliverables || []).length };
    for (const d of data.deliverables || []) {
      const st = d.status || 'livrable_soumis';
      counts[st] = (counts[st] || 0) + 1;
    }
    return counts;
  }, [data.deliverables]);

  // Filtered deliverables
  const filteredDeliverables = useMemo(() => {
    let list = data.deliverables || [];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(d => {
        const t = (data.talents || []).find(talent => talent.id === d.talent_id);
        return (
          (d.title || '').toLowerCase().includes(q) ||
          (d.url || '').toLowerCase().includes(q) ||
          (d.content_subject || '').toLowerCase().includes(q) ||
          (t?.display_name || '').toLowerCase().includes(q)
        );
      });
    }
    if (campaignFilter) {
      list = list.filter(d => d.campaign_id === campaignFilter);
    }
    if (subjectFilter) {
      list = list.filter(d => (d.content_subject || '').trim() === subjectFilter);
    }
    if (platformFilter) {
      list = list.filter(d => d.platform === platformFilter);
    }
    if (statusFilter) {
      list = list.filter(d => d.status === statusFilter);
    }
    return list;
  }, [data.deliverables, data.talents, search, campaignFilter, subjectFilter, platformFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDeliverables.length / ITEMS_PER_PAGE));
  const pagedDeliverables = filteredDeliverables.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* En-tête & Filtres Style Dashboard Analytics */}
      <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0, letterSpacing: '-0.3px' }}>
                REGISTRE DES LIVRABLES & WORKFLOW DE VALIDATION
              </h2>
              <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
                {filteredDeliverables.length} contenus
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Circuit d'approbation McCann ⇄ Orange Cameroun (BAT, conformité, URL certifiées et KPIs réels)
            </p>
          </div>

          {/* Quick status filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => { setStatusFilter(''); setPage(1); }}
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                border: !statusFilter ? '1px solid #FF7900' : '1px solid #E5E7EB',
                background: !statusFilter ? '#FFF8F2' : '#FFF',
                color: !statusFilter ? '#FF7900' : 'var(--dark)',
                cursor: 'pointer'
              }}
            >
              Tous ({statusCounts.total || 0})
            </button>
            {DELIVERABLE_STATUSES.map(st => {
              const isSelected = statusFilter === st.id;
              const count = statusCounts[st.id] || 0;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => { setStatusFilter(isSelected ? '' : st.id); setPage(1); }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    border: isSelected ? '1px solid #FF7900' : '1px solid #E5E7EB',
                    background: isSelected ? '#FFF8F2' : '#FFF',
                    color: isSelected ? '#FF7900' : 'var(--dark)',
                    cursor: 'pointer'
                  }}
                >
                  {st.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Barre de filtres multi-critères */}
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
          <input
            className="form-input"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            placeholder="🔍 Rechercher sujet, créateur, lien..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="form-input form-select"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            value={campaignFilter}
            onChange={e => {
              setCampaignFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toutes campagnes</option>
            {(data.campaigns || []).map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="form-input form-select"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            value={subjectFilter}
            onChange={e => {
              setSubjectFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les sujets éditoriaux</option>
            {subjects.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
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
            <option value="youtube">YouTube</option>
            <option value="website">Presse & Web</option>
          </select>
        </div>
      </div>

      {/* Tableau des livrables */}
      <div className="card p-0" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', marginBottom: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Livrable & Sujet
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Créateur
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Campagne
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Canal
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Vues Mesurées
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Engagement
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Statut
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', textAlign: 'right' }}>
                  Validation
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedDeliverables.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--muted)' }}>
                    Aucun livrable ne correspond à vos filtres.
                  </td>
                </tr>
              ) : (
                pagedDeliverables.map((d, idx) => {
                  const talent = (data.talents || []).find(t => t.id === d.talent_id);
                  const campaign = (data.campaigns || []).find(c => c.id === d.campaign_id);
                  const snap = snapshots.get(d.id);
                  const stConfig = DELIVERABLE_STATUSES.find(s => s.id === d.status) || {
                    label: d.status || 'Soumis',
                    badge: 'tag-orange'
                  };
                  const qConfig = QUALITY_STATUSES[snap?.quality_status] || {
                    label: 'Complète',
                    badge: 'tag-green'
                  };

                  return (
                    <tr
                      key={d.id}
                      style={{
                        borderBottom: '1px solid #F0F0F0',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF8F2'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC'}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--dark)' }}>
                          {d.content_subject || d.title || 'Livrable sans titre'}
                        </div>
                        {d.url ? (
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 11, color: '#FF7900', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 2 }}
                            onClick={e => e.stopPropagation()}
                          >
                            <span>🔗 Ouvrir le contenu</span> ↗
                          </a>
                        ) : (
                          <span style={{ fontSize: 11, color: '#E74C3C' }}>⚠️ Lien absent</span>
                        )}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        {talent ? (
                          <button
                            type="button"
                            onClick={() => onOpenTalentProfile?.(talent)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              font: 'inherit',
                              textAlign: 'left',
                              cursor: onOpenTalentProfile ? 'pointer' : 'default',
                              display: 'block'
                            }}
                            title="Consulter la fiche profil du talent"
                          >
                            <div style={{ fontWeight: 700, color: onOpenTalentProfile ? 'var(--orange, #FF7900)' : 'var(--dark)' }}>
                              {talent.display_name} ↗
                            </div>
                            {talent.pseudo && (
                              <div style={{ fontSize: 11, color: 'var(--muted)' }}>@{talent.pseudo}</div>
                            )}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--muted)' }}>Non rattaché</span>
                        )}
                      </td>

                      <td style={{ padding: '12px 16px', fontSize: 11.5, color: 'var(--muted)' }}>
                        {campaign?.name || 'Orange Weekend'}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span className="tag tag-muted" style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <PlatformIcon platform={d.platform} />
                          <span>{d.platform}</span>
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 700, color: snap?.views ? '#FF7900' : 'var(--muted)' }}>
                        {snap?.views ? formatNumber(snap.views) : '—'}
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 700, color: snap?.engagement_calculated ? '#27AE60' : 'var(--muted)' }}>
                        {snap?.engagement_calculated ? formatNumber(snap.engagement_calculated) : '—'}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <Badge tone={stConfig.badge}>{stConfig.label}</Badge>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setSelectedDeliverable(d)}
                          style={{ border: '1px solid #D0D0D0', fontSize: 11 }}
                        >
                          Évaluer →
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
            Affichage de <strong>{Math.min(filteredDeliverables.length, (page - 1) * ITEMS_PER_PAGE + 1)}</strong> à{' '}
            <strong>{Math.min(filteredDeliverables.length, page * ITEMS_PER_PAGE)}</strong> sur{' '}
            <strong>{filteredDeliverables.length}</strong> livrables
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

      {selectedDeliverable && (
        <DeliverableModal
          deliverable={selectedDeliverable}
          data={data}
          setStatus={setStatus}
          onClose={() => setSelectedDeliverable(null)}
        />
      )}
    </div>
  );
}
