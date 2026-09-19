import React from 'react';
import { Badge, Modal } from './InfluenceCommon';

export default function DuplicatesModal({ issues, data, onMerge, onKeepSeparate, onClose }) {
  const unresolvedIssues = (issues || []).filter(
    iss => iss.code === 'duplicate_candidate' && iss.resolution_status === 'open'
  );

  return (
    <Modal
      title="Revue des doublons potentiels d'ambassadeurs"
      subtitle="Arbitrage manuel — aucune fusion n'est appliquée de manière automatique"
      onClose={onClose}
      width={860}
    >
      <div className="ifx-note" style={{ marginBottom: 16 }}>
        Chaque paire ci-dessous a été détectée entre les listes <strong>O'Ambassadeurs</strong> et{' '}
        <strong>O'Ambassadeurs (2)</strong>. Choisissez <strong>Fusionner</strong> pour regrouper les profils
        (le profil cible absorbe l'historique et les livrables) ou <strong>Conserver séparés</strong> pour valider qu'il s'agit de deux personnes distinctes.
      </div>

      {unresolvedIssues.length === 0 ? (
        <div className="ifx-empty">
          <div className="e-icon">🎉</div>
          <div>Tous les doublons candidats ont été arbitrés avec succès.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {unresolvedIssues.map((iss, index) => {
            let pair = {};
            try {
              pair = JSON.parse(iss.raw_value || '{}');
            } catch (e) {
              console.error(e);
            }
            const talentA = (data.talents || []).find(t => t.id === pair.talentA);
            const talentB = (data.talents || []).find(t => t.id === pair.talentB);

            if (!talentA || !talentB) return null;

            return (
              <div key={iss.id} className="ifx-card" style={{ marginBottom: 0, borderLeft: '3px solid var(--orange)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge tone="ifx-b-yellow">Candidat {index + 1} / {unresolvedIssues.length}</Badge>
                    <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                      Profil #{talentA.id.replace('TAL-', '').replace('AMB-', '')} ↔ Profil #{talentB.id.replace('TAL-', '').replace('AMB-', '')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="ifx-btn ifx-btn-sm ifx-btn-primary"
                      onClick={() => onMerge(talentA.id, talentB.id)}
                    >
                      Fusionner vers {talentA.display_name}
                    </button>
                    <button
                      className="ifx-btn ifx-btn-sm"
                      onClick={() => onKeepSeparate([talentA.id, talentB.id])}
                    >
                      Conserver séparés
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 12 }}>
                  <div style={{ padding: 10, background: '#F8F9FC', borderRadius: 8 }}>
                    <div style={{ fontWeight: 800, color: 'var(--dark)' }}>{talentA.display_name}</div>
                    <div style={{ color: 'var(--muted)', marginTop: 2 }}>{talentA.phone || 'Sans téléphone'}</div>
                    <div className="mono" style={{ fontSize: 11, marginTop: 4 }}>{talentA.profile_url || 'Sans profil'}</div>
                  </div>
                  <div style={{ padding: 10, background: '#F8F9FC', borderRadius: 8 }}>
                    <div style={{ fontWeight: 800, color: 'var(--dark)' }}>{talentB.display_name}</div>
                    <div style={{ color: 'var(--muted)', marginTop: 2 }}>{talentB.phone || 'Sans téléphone'}</div>
                    <div className="mono" style={{ fontSize: 11, marginTop: 4 }}>{talentB.profile_url || 'Sans profil'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
