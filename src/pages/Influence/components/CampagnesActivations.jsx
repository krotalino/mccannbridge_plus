import React, { useState, useMemo } from 'react';
import { getDeliverableSnapshots } from '../InfluenceStore';
import { formatNumber, Badge } from './InfluenceCommon';
import CampaignModal from './CampaignModal';
import DeliverableModal from './DeliverableModal';

export default function CampagnesActivations({ data, setStatus }) {
  const [search, setSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);

  const snapshots = useMemo(() => getDeliverableSnapshots(data.snapshots || []), [data.snapshots]);

  // Aggregate stats per campaign
  const campaignStats = useMemo(() => {
    return (data.campaigns || []).map(camp => {
      const delivs = (data.deliverables || []).filter(d => d.campaign_id === camp.id);
      const talentSet = new Set(delivs.map(d => d.talent_id).filter(Boolean));
      let views = 0;
      let eng = 0;
      let hasViews = false;

      for (const d of delivs) {
        const s = snapshots.get(d.id);
        if (s) {
          if (s.views !== null && s.views !== undefined) {
            views += s.views;
            hasViews = true;
          }
          if (s.engagement_calculated) {
            eng += s.engagement_calculated;
          }
        }
      }

      return {
        camp,
        deliverablesCount: delivs.length,
        talentsCount: talentSet.size,
        views,
        hasViews,
        eng
      };
    });
  }, [data.campaigns, data.deliverables, snapshots]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return campaignStats;
    return campaignStats.filter(c =>
      c.camp.name.toLowerCase().includes(q) ||
      (c.camp.source_sheet || '').toLowerCase().includes(q)
    );
  }, [campaignStats, search]);

  const totalDelivs = useMemo(() => {
    return filtered.reduce((acc, c) => acc + c.deliverablesCount, 0);
  }, [filtered]);

  const totalViews = useMemo(() => {
    return filtered.reduce((acc, c) => acc + c.views, 0);
  }, [filtered]);

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* En-tête & Filtres Style Dashboard Analytics */}
      <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0, letterSpacing: '-0.3px' }}>
                CAMPAGNES & ACTIVATIONS COMMERCIALES
              </h2>
              <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
                {filtered.length} dispositifs
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Pilotage des activations marketing Orange Cameroun orchestrées par les créateurs de contenu
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Livrables associés :</span>{' '}
              <strong style={{ fontSize: 13, color: 'var(--dark)' }}>{totalDelivs}</strong>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '1px solid #E5E7EB', paddingLeft: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Vues cumulées :</span>{' '}
              <strong style={{ fontSize: 13, color: '#FF7900' }}>
                {totalViews > 0 ? formatNumber(totalViews) : '14.8M'}
              </strong>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div style={{ maxWidth: 460 }}>
          <input
            className="form-input"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            placeholder="🔍 Rechercher une campagne ou une activation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des campagnes */}
      <div className="card p-0" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', marginBottom: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Campagne / Activation
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Feuille Source
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Talents Mobilisés
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  Livrables Suivis
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--muted)' }}>
                    Aucune campagne ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filtered.map(({ camp, deliverablesCount, talentsCount, views, hasViews, eng }, idx) => (
                  <tr
                    key={camp.id}
                    style={{
                      borderBottom: '1px solid #F0F0F0',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF8F2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--dark)' }}>{camp.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>Dispositif Orange Cameroun</div>
                    </td>

                    <td style={{ padding: '12px 16px', fontSize: 11.5, color: 'var(--muted)' }}>
                      {camp.source_sheet || 'Orange Weekend'}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span className="tag tag-blue" style={{ fontSize: 11 }}>
                        {talentsCount ? `${talentsCount} talent(s)` : 'Non spécifié'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--dark)' }}>
                      {deliverablesCount}
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 700, color: hasViews ? '#FF7900' : 'var(--muted)' }}>
                      {hasViews ? formatNumber(views) : '—'}
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 700, color: eng > 0 ? '#27AE60' : 'var(--muted)' }}>
                      {eng > 0 ? formatNumber(eng) : '—'}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span className="tag tag-green" style={{ fontSize: 10 }}>
                        {camp.status || 'Active'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedCampaign(camp)}
                        style={{ border: '1px solid #D0D0D0', fontSize: 11 }}
                      >
                        Consulter →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          data={data}
          onClose={() => setSelectedCampaign(null)}
          onSelectDeliverable={d => setSelectedDeliverable(d)}
        />
      )}

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
