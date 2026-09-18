import React from 'react';
import { getDeliverableSnapshots } from '../InfluenceStore';
import { formatNumber, Badge, PlatformIcon, Modal, TALENT_TYPES } from './InfluenceCommon';

export default function TalentModal({ talent, data, snaps, canSeeContacts = true, onClose }) {
  const deliverableSnapshots = snaps || getDeliverableSnapshots(data.snapshots || []);
  const deliverables = (data.deliverables || []).filter(d => d.talent_id === talent.id);
  const typeConfig = TALENT_TYPES[talent.type] || { label: talent.type || 'Talent', badge: 'tag-muted' };

  let totalViews = 0;
  let totalEngagement = 0;
  let incompleteCount = 0;

  for (const d of deliverables) {
    const s = deliverableSnapshots.get ? deliverableSnapshots.get(d.id) : null;
    if (s) {
      if (s.views !== null && s.views !== undefined) totalViews += s.views;
      if (s.engagement_calculated) totalEngagement += s.engagement_calculated;
      if (s.quality_status === 'incomplete') incompleteCount++;
    }
  }

  return (
    <Modal
      title={talent.display_name}
      subtitle={`${typeConfig.label} • Feuille ${talent.source_sheet || 'INFLUENCEURS'} L${talent.source_row || '—'}`}
      category="FICHE TALENT & AMBASSADEUR"
      onClose={onClose}
      width={780}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Colonne gauche : Identité & Profils */}
        <div style={{ padding: '16px 18px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FAFAFC' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🪪</span> Identité & Profils Sociaux
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
              <span style={{ color: 'var(--muted)' }}>Nom complet :</span>
              <strong style={{ color: 'var(--dark)' }}>{talent.display_name}</strong>
            </div>

            {talent.pseudo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ color: 'var(--muted)' }}>Pseudo :</span>
                <strong style={{ color: '#FF7900' }}>@{talent.pseudo}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
              <span style={{ color: 'var(--muted)' }}>Typologie :</span>
              <Badge tone={typeConfig.badge}>{typeConfig.label}</Badge>
            </div>

            {talent.phone && canSeeContacts && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ color: 'var(--muted)' }}>Contact téléphonique :</span>
                <strong style={{ color: 'var(--dark)' }}>{talent.phone}</strong>
              </div>
            )}

            {talent.cahier_charges && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ color: 'var(--muted)' }}>Cahier des charges :</span>
                <strong style={{ color: 'var(--dark)' }}>{talent.cahier_charges}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Statut fiche :</span>
              <span className="tag tag-green" style={{ fontSize: 10 }}>Qualifié</span>
            </div>
          </div>

          {/* Profils sociaux */}
          <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              Réseaux Sociaux Rattachés
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(talent.platform_profiles || []).map((p, idx) => (
                <span key={idx} className="tag tag-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <PlatformIcon platform={p.platform} />
                  <span>{p.handle || p.platform}</span>
                </span>
              ))}
              {talent.profile_url && !(talent.platform_profiles || []).length && (
                <a
                  href={talent.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tag tag-orange"
                  style={{ textDecoration: 'none' }}
                >
                  🔗 Voir profil externe ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite : Synthèse de Performance */}
        <div style={{ padding: '16px 18px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FFF8F2' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📈</span> Performance & Volume Consolidé
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ padding: 10, background: '#FFF', borderRadius: 8, border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>LIVRABLES</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--dark)', marginTop: 2 }}>
                {deliverables.length}
              </div>
            </div>

            <div style={{ padding: 10, background: '#FFF', borderRadius: 8, border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>VUES CUMULÉES</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FF7900', marginTop: 2 }}>
                {totalViews > 0 ? formatNumber(totalViews) : '—'}
              </div>
            </div>

            <div style={{ padding: 10, background: '#FFF', borderRadius: 8, border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>ENGAGEMENT</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#27AE60', marginTop: 2 }}>
                {totalEngagement > 0 ? formatNumber(totalEngagement) : '—'}
              </div>
            </div>

            <div style={{ padding: 10, background: '#FFF', borderRadius: 8, border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>TAUX MOYEN</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--dark)', marginTop: 2 }}>
                {totalViews > 0 ? `${((totalEngagement / totalViews) * 100).toFixed(1)}%` : '—'}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11.5, color: 'var(--muted)', padding: '8px 10px', background: '#FFF', borderRadius: 6, border: '1px solid #FFE0B2' }}>
            {incompleteCount > 0 ? (
              <span style={{ color: '#E65100' }}>⚠️ {incompleteCount} livrable(s) avec métriques à compléter.</span>
            ) : (
              <span style={{ color: '#27AE60' }}>✓ Toutes les publications rattachées sont conformes.</span>
            )}
          </div>
        </div>
      </div>

      {/* Liste des Livrables de ce talent */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 10, textTransform: 'uppercase' }}>
          Publications & Livrables Associés ({deliverables.length})
        </div>

        {deliverables.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', background: '#FAFAFC', borderRadius: 8 }}>
            Aucun livrable rattaché pour l'instant.
          </div>
        ) : (
          <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E5E7EB', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 800, color: 'var(--muted)' }}>Sujet / Titre</th>
                  <th style={{ padding: '8px 12px', fontWeight: 800, color: 'var(--muted)' }}>Plateforme</th>
                  <th style={{ padding: '8px 12px', fontWeight: 800, color: 'var(--muted)' }}>Vues</th>
                  <th style={{ padding: '8px 12px', fontWeight: 800, color: 'var(--muted)' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.map(d => {
                  const snap = deliverableSnapshots.get ? deliverableSnapshots.get(d.id) : null;
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 700 }}>
                        {d.content_subject || d.title || 'Livrable sans titre'}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <PlatformIcon platform={d.platform} /> {d.platform}
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#FF7900' }}>
                        {snap?.views ? formatNumber(snap.views) : '—'}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <span className="tag tag-green" style={{ fontSize: 10 }}>{d.status || 'Validé'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Fermer la fiche
        </button>
      </div>
    </Modal>
  );
}
