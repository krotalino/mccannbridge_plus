import React, { useState } from 'react';
import { formatNumber, Badge, PlatformIcon, Modal } from './InfluenceCommon';

export default function CampaignModal({ campaign, data, snaps, onClose, onOpenDeliverable, onOpenTalentProfile }) {
  const [subtab, setSubtab] = useState('overview');

  const deliverables = (data.deliverables || []).filter(d => d.campaign_id === campaign.id);
  const talentIds = [...new Set(deliverables.map(d => d.talent_id).filter(Boolean))];
  const talents = talentIds.map(id => (data.talents || []).find(t => t.id === id)).filter(Boolean);

  let totalViews = 0;
  let totalEngagement = 0;
  let incompleteCount = 0;

  for (const d of deliverables) {
    const s = snaps.get(d.id);
    if (s) {
      if (s.views !== null && s.views !== undefined) totalViews += s.views;
      if (s.engagement_calculated) totalEngagement += s.engagement_calculated;
      if (s.quality_status === 'incomplete') incompleteCount++;
    }
  }

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'talents', label: `Talents (${talents.length})` },
    { id: 'deliverables', label: `Livrables (${deliverables.length})` },
    { id: 'risks', label: 'Risques & Conformité' }
  ];

  return (
    <Modal
      title={campaign.name}
      subtitle={`Campagne d'influence · ${campaign.source_sheet || 'Orange Weekend'}`}
      onClose={onClose}
      width={860}
    >
      <div className="ifx-subtabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`ifx-subtab ${subtab === t.id ? 'active' : ''}`}
            onClick={() => setSubtab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subtab === 'overview' && (
        <div className="ifx-grid-2">
          <div>
            <div className="ifx-card-title">📌 Périmètre de la campagne</div>
            <div className="ifx-kv">
              <span className="kv-k">Identifiant</span>
              <span className="kv-v mono">{campaign.id}</span>
            </div>
            <div className="ifx-kv">
              <span className="kv-k">Livrables prévus/suivis</span>
              <span className="kv-v strong">{deliverables.length}</span>
            </div>
            <div className="ifx-kv">
              <span className="kv-k">Talents mobilisés</span>
              <span className="kv-v strong">{talents.length}</span>
            </div>
            <div className="ifx-kv">
              <span className="kv-k">Feuille source</span>
              <span className="kv-v mono">{campaign.source_sheet || 'import'}</span>
            </div>
            <div className="ifx-kv">
              <span className="kv-k">Statut</span>
              <span className="kv-v">
                <Badge tone={campaign.status === 'active' ? 'ifx-b-green' : 'ifx-b-blue'}>
                  {campaign.status || 'active'}
                </Badge>
              </span>
            </div>
          </div>

          <div>
            <div className="ifx-card-title">📊 Synthèse de performance</div>
            <div className="ifx-kv">
              <span className="kv-k">Vues cumulées</span>
              <span className="kv-v strong">{totalViews > 0 ? formatNumber(totalViews) : '—'}</span>
            </div>
            <div className="ifx-kv">
              <span className="kv-k">Engagement calculé</span>
              <span className="kv-v strong">{totalEngagement > 0 ? formatNumber(totalEngagement) : '—'}</span>
            </div>
            <div className="ifx-kv">
              <span className="kv-k">Publications incomplètes</span>
              <span className="kv-v">{incompleteCount > 0 ? <Badge tone="ifx-b-yellow">{incompleteCount}</Badge> : '0'}</span>
            </div>
          </div>
        </div>
      )}

      {subtab === 'talents' && (
        <div>
          <div className="ifx-table-wrap">
            <table className="ifx-table">
              <thead>
                <tr>
                  <th>Talent</th>
                  <th>Type</th>
                  <th>Livrables</th>
                  <th>Profil social</th>
                </tr>
              </thead>
              <tbody>
                {talents.map(t => {
                  const talentDels = deliverables.filter(d => d.talent_id === t.id);
                  return (
                    <tr key={t.id}>
                      <td className="strong">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenTalentProfile) {
                              onOpenTalentProfile(t);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            font: 'inherit',
                            fontWeight: 700,
                            color: onOpenTalentProfile ? 'var(--orange, #FF7900)' : 'inherit',
                            cursor: onOpenTalentProfile ? 'pointer' : 'default',
                            textAlign: 'left'
                          }}
                          title="Consulter la fiche profil de ce talent"
                        >
                          {t.display_name} ↗
                        </button>
                      </td>
                      <td><Badge tone="ifx-b-blue">{t.type}</Badge></td>
                      <td>{talentDels.length} livrable(s)</td>
                      <td className="mono">
                        <button
                          type="button"
                          onClick={() => onOpenTalentProfile?.(t)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            color: 'var(--orange)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          Fiche talent ↗
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subtab === 'deliverables' && (
        <div>
          <div className="ifx-table-wrap">
            <table className="ifx-table">
              <thead>
                <tr>
                  <th>Titre / Sujet</th>
                  <th>Plat.</th>
                  <th>Format</th>
                  <th>Statut</th>
                  <th>Vues</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.map(d => {
                  const s = snaps.get(d.id);
                  return (
                    <tr key={d.id}>
                      <td className="strong">{d.title || d.content_subject}</td>
                      <td><PlatformIcon platform={d.platform} /></td>
                      <td className="mono">{d.content_type}</td>
                      <td><Badge tone="ifx-b-blue">{d.status}</Badge></td>
                      <td>{s?.views ? formatNumber(s.views) : '—'}</td>
                      <td>
                        <button
                          className="ifx-btn ifx-btn-sm"
                          onClick={() => {
                            if (onOpenDeliverable) onOpenDeliverable(d);
                          }}
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subtab === 'risks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {incompleteCount > 0 && (
            <div className="ifx-card" style={{ borderLeft: '3px solid var(--yellow)', marginBottom: 0 }}>
              <div style={{ fontWeight: 800, color: 'var(--dark)' }}>
                Données de métriques incomplètes ({incompleteCount} livrables)
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                Certaines publications n'ont pas de nombre de vues ou de likes renseignés dans le reporting d'origine.
              </div>
            </div>
          )}
          {deliverables.filter(d => !d.url).length > 0 && (
            <div className="ifx-card" style={{ borderLeft: '3px solid var(--orange)', marginBottom: 0 }}>
              <div style={{ fontWeight: 800, color: 'var(--dark)' }}>
                {deliverables.filter(d => !d.url).length} livrable(s) sans URL directe
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                Le lien de preuve ou de publication n'a pas été collé dans le fichier source.
              </div>
            </div>
          )}
          {incompleteCount === 0 && deliverables.filter(d => !d.url).length === 0 && (
            <div className="ifx-empty">
              <div className="e-icon">✅</div>
              <div>Aucune anomalie ou risque identifié sur cette campagne.</div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
