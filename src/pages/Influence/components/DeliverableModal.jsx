import React, { useState } from 'react';
import { getDeliverableSnapshots } from '../InfluenceStore';
import {
  formatNumber,
  Badge,
  PlatformIcon,
  Modal,
  DELIVERABLE_STATUSES,
  QUALITY_STATUSES
} from './InfluenceCommon';

export default function DeliverableModal({ d, deliverable, data, snaps, canEdit = true, onClose, setStatus }) {
  const item = deliverable || d || {};
  const deliverableSnapshots = snaps || getDeliverableSnapshots(data?.snapshots || []);
  const snap = deliverableSnapshots.get ? deliverableSnapshots.get(item.id) : null;
  const talent = (data?.talents || []).find(t => t.id === item.talent_id);
  const campaign = (data?.campaigns || []).find(c => c.id === item.campaign_id);
  const [comment, setComment] = useState('');

  const handleStatusChange = (statusId) => {
    if (setStatus) {
      setStatus(item.id, statusId, { comment, author: 'Consultant Stratégie Bridge' });
    }
    setComment('');
  };

  const currentStatus = DELIVERABLE_STATUSES.find(s => s.id === item.status) || {
    id: item.status,
    label: item.status || 'Non renseigné',
    badge: 'tag-muted'
  };

  const qualityConfig = QUALITY_STATUSES[snap?.quality_status || 'to_review'] || {
    label: 'À vérifier',
    badge: 'tag-muted'
  };

  return (
    <Modal
      title={item.content_subject || item.title || 'Livrable sans titre'}
      subtitle={`Livrable • ${talent?.display_name || 'Talent non résolu'} • ${campaign?.name || 'Campagne à confirmer'}`}
      category="WORKFLOW & VALIDATION DE CONTENU"
      onClose={onClose}
      width={780}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Colonne gauche : Publication & Métadonnées */}
        <div style={{ padding: '16px 18px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FAFAFC' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🔗</span> Publication & Aperçu Source
          </div>

          {item.url ? (
            <a
              className="btn btn-primary"
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              style={{
                textDecoration: 'none',
                marginBottom: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#FF7900',
                color: '#FFF',
                fontSize: 12
              }}
            >
              <span>Ouvrir le lien source externe</span> ↗
            </a>
          ) : (
            <div style={{ padding: '8px 12px', background: '#FEE2E2', borderRadius: 6, color: '#DC2626', fontSize: 12, marginBottom: 14 }}>
              ⚠️ Aucun lien de publication direct renseigné dans la source.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
              <span style={{ color: 'var(--muted)' }}>Créateur rattaché :</span>
              <strong style={{ color: 'var(--dark)' }}>{talent?.display_name || 'Non résolu'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
              <span style={{ color: 'var(--muted)' }}>Dispositif :</span>
              <strong style={{ color: 'var(--dark)' }}>{campaign?.name || 'Campagne en cours'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
              <span style={{ color: 'var(--muted)' }}>Plateforme :</span>
              <span className="tag tag-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <PlatformIcon platform={item.platform} />
                <span style={{ textTransform: 'capitalize' }}>{item.platform}</span>
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
              <span style={{ color: 'var(--muted)' }}>Format de contenu :</span>
              <strong style={{ color: 'var(--dark)' }}>{item.content_type || 'Vidéo / Post'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
              <span style={{ color: 'var(--muted)' }}>Date de diffusion :</span>
              <strong style={{ color: 'var(--dark)' }}>{item.published_at || item.published_raw || 'Non renseigné'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Feuille source :</span>
              <span style={{ color: 'var(--dark)', fontFamily: 'monospace' }}>{item.source_sheet} L{item.source_row}</span>
            </div>
          </div>
        </div>

        {/* Colonne droite : Performance & Métriques */}
        <div style={{ padding: '16px 18px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FFF8F2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>📊 Métriques & Portée Réelle</span>
            <Badge tone={qualityConfig.badge}>{qualityConfig.label}</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ padding: 10, background: '#FFF', borderRadius: 8, border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>VUES MESURÉES</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#FF7900', marginTop: 2 }}>
                {snap?.views !== null && snap?.views !== undefined ? formatNumber(snap.views) : '—'}
              </div>
            </div>

            <div style={{ padding: 10, background: '#FFF', borderRadius: 8, border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>ENGAGEMENT CALCULÉ</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#27AE60', marginTop: 2 }}>
                {snap?.engagement_calculated !== null && snap?.engagement_calculated !== undefined
                  ? formatNumber(snap.engagement_calculated)
                  : '—'}
              </div>
            </div>

            <div style={{ padding: 10, background: '#FFF', borderRadius: 8, border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>LIKES</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>
                {snap?.likes !== null && snap?.likes !== undefined ? formatNumber(snap.likes) : '—'}
              </div>
            </div>

            <div style={{ padding: 10, background: '#FFF', borderRadius: 8, border: '1px solid #FFE0B2' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>COMMENTAIRES</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>
                {snap?.comments !== null && snap?.comments !== undefined ? formatNumber(snap.comments) : '—'}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11.5, color: 'var(--muted)', padding: '8px 10px', background: '#FFF', borderRadius: 6, border: '1px solid #FFE0B2' }}>
            Taux d'interaction : <strong>{snap?.engagement_rate ? `${snap.engagement_rate}%` : 'Non calculable'}</strong>
          </div>
        </div>
      </div>

      {/* ─── 3. ACTIONS DE VALIDATION ─── */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', textTransform: 'uppercase' }}>
            🛠 Circuit de Validation & Workflow d'Approbation
          </span>
          <Badge tone={currentStatus.badge}>Statut actuel : {currentStatus.label}</Badge>
        </div>

        {canEdit && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {DELIVERABLE_STATUSES.map(st => {
                const isActive = item.status === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleStatusChange(st.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      border: isActive ? '1px solid #FF7900' : '1px solid #E5E7EB',
                      background: isActive ? '#FF7900' : '#FFF',
                      color: isActive ? '#FFF' : 'var(--dark)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isActive ? '● ' : ''}{st.label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                className="form-input"
                style={{ flex: 1, fontSize: 12 }}
                placeholder="Ajouter une note de validation ou consigne de correction..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleStatusChange(item.status || 'valide')}
                style={{ background: '#FF7900', color: '#FFF' }}
              >
                Valider la note
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Fermer
        </button>
      </div>
    </Modal>
  );
}
