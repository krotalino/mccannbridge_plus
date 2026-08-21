import { useState } from 'react';
import { formatNumber } from '../../../utils/helpers';

export default function InfluenceHistorique({ influencers, setInfluencers }) {
  const [selectedInfId, setSelectedInfId] = useState(influencers[0]?.id || '');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [selectedCampaignForNote, setSelectedCampaignForNote] = useState(null);

  const [newNote, setNewNote] = useState({
    fiabilite: 5,
    qualiteCollaboration: 5,
    respectDelais: 5,
    commentaire: '',
  });

  const selectedInf = (influencers || []).find(i => String(i.id) === String(selectedInfId)) || influencers[0];

  if (!influencers || influencers.length === 0) {
    return (
      <div className="card text-center py-40" style={{ background: '#fff', border: '1px dashed #d0d7de', borderRadius: 12 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📜</div>
        <h3 className="text-lg font-bold text-dark mb-4">Aucun historique de campagne</h3>
        <p className="text-sm text-muted mb-20 max-w-md mx-auto">
          Aucun influenceur n'est encore enregistré dans la base de données. Créez un profil dans l'onglet "1. Fiche Influence" pour consigner l'historique de ses collaborations.
        </p>
      </div>
    );
  }
  const history = selectedInf?.performanceHistory || [];

  const handleOpenNoteModal = (camp) => {
    setSelectedCampaignForNote(camp);
    if (camp.notesInternes) {
      setNewNote({
        fiabilite: camp.notesInternes.fiabilite || 5,
        qualiteCollaboration: camp.notesInternes.qualiteCollaboration || 5,
        respectDelais: camp.notesInternes.respectDelais || 5,
        commentaire: camp.notesInternes.commentaire || '',
      });
    } else {
      setNewNote({ fiabilite: 5, qualiteCollaboration: 5, respectDelais: 5, commentaire: '' });
    }
    setShowAddNoteModal(true);
  };

  const handleSaveNote = () => {
    if (!selectedCampaignForNote) return;

    setInfluencers(prev => prev.map(inf => {
      if (inf.id !== selectedInf.id) return inf;
      const updatedHistory = inf.performanceHistory.map(h => {
        if (h.campaign !== selectedCampaignForNote.campaign) return h;
        return {
          ...h,
          notesInternes: { ...newNote }
        };
      });
      return {
        ...inf,
        performanceHistory: updatedHistory
      };
    }));

    setShowAddNoteModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div>
          <h2 className="text-xl font-bold text-dark mb-4">📜 Historique des Campagnes & Évaluations</h2>
          <p className="text-sm text-muted">Campagnes passées, résultats obtenus et évaluations de collaboration internes</p>
        </div>
      </div>

      {/* Sélecteur d'influenceur */}
      <div className="card mb-16 flex items-center justify-between" style={{ background: '#f8f9fa' }}>
        <div className="flex items-center gap-12">
          <span className="font-semibold text-sm text-dark">Influenceur :</span>
          <select
            className="form-input"
            style={{ width: 280, fontWeight: 700 }}
            value={selectedInfId}
            onChange={e => setSelectedInfId(e.target.value)}
          >
            {influencers.map(inf => (
              <option key={inf.id} value={inf.id}>
                @{inf.pseudo || inf.name} ({inf.realName || `${inf.prenom || ''} ${inf.nom || ''}`.trim()}) — {inf.performanceHistory?.length || 0} campagne(s)
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-muted">
          Total campagnes réalisées : <strong>{selectedInf.campaigns || history.length}</strong> •
          Score global : <strong className="text-orange">{selectedInf.scorePerformance || selectedInf.score}/5 ⭐</strong>
        </div>
      </div>

      {/* Cartes récapitulatives des campagnes de l'influenceur */}
      {history.length === 0 ? (
        <div className="card text-center py-20 text-muted">
          Aucun historique de campagne disponible pour cet influenceur.
        </div>
      ) : (
        <div className="grid gap-16">
          {history.map((camp, idx) => {
            const reachRatio = Math.round((camp.kpiReach / (camp.kpiTarget || 1)) * 100);
            const engRatio = Math.round(((camp.kpiEngagement || 0) / (camp.engagementTarget || 1)) * 100);
            const notes = camp.notesInternes;

            return (
              <div key={idx} className="card shadow-sm" style={{ borderLeft: `4px solid ${reachRatio >= 90 ? 'var(--green)' : 'var(--orange)'}` }}>
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-4">{camp.campaign}</h3>
                    <span className="tag" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)', fontSize: 11 }}>
                      Qualité contenu : {camp.contentQuality}/5 ⭐
                    </span>
                    <span className="tag" style={{ marginLeft: 8, background: camp.onTime ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)', color: camp.onTime ? 'var(--green)' : 'var(--red)', fontSize: 11 }}>
                      {camp.onTime ? '✓ Respect des délais' : '⚠️ Retard de livraison'}
                    </span>
                  </div>

                  <button className="btn btn-ghost btn-sm text-blue" onClick={() => handleOpenNoteModal(camp)}>
                    ✏️ {notes ? 'Modifier la note interne' : '+ Évaluer la collaboration'}
                  </button>
                </div>

                {/* KPIs campagne */}
                <div className="grid grid-4 gap-12 mb-12 p-12 rounded" style={{ background: '#f9fafb' }}>
                  <div>
                    <div className="text-xs text-muted mb-2">Reach obtenu vs Cible</div>
                    <div className="text-base font-bold text-dark">
                      {formatNumber(camp.kpiReach)} <span className="text-xs text-muted">/ {formatNumber(camp.kpiTarget)}</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ color: reachRatio >= 90 ? 'var(--green)' : 'var(--red)' }}>
                      {reachRatio}% de la cible
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted mb-2">Taux d'Engagement</div>
                    <div className="text-base font-bold text-dark">
                      {camp.kpiEngagement}% <span className="text-xs text-muted">/ {camp.engagementTarget}%</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ color: engRatio >= 90 ? 'var(--green)' : 'var(--red)' }}>
                      {engRatio >= 90 ? 'Objectif atteint' : 'Sous l\'objectif'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted mb-2">Qualité Visuelle</div>
                    <div className="text-base font-bold text-orange">{camp.contentQuality} / 5 ⭐</div>
                    <div className="text-xs text-muted">Avis équipe créa</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted mb-2">Part Variable Payée</div>
                    <div className="text-base font-bold text-green">{camp.variablePaid}%</div>
                    <div className="text-xs text-muted">Selon performance</div>
                  </div>
                </div>

                {/* Section Évaluation / Notes Internes */}
                <div style={{ background: '#f0f4f8', borderRadius: 6, padding: 12 }}>
                  <div className="text-xs font-bold text-dark mb-6 flex items-center justify-between">
                    <span>📝 ÉVALUATION INTERNE & COLLABORATION</span>
                    {notes && <span className="text-xs font-normal text-muted">Avis confidentiel McCann</span>}
                  </div>

                  {notes ? (
                    <div>
                      <div className="grid grid-3 gap-8 mb-8 text-xs">
                        <div>Fiabilité : <strong className="text-orange">{notes.fiabilite}/5</strong></div>
                        <div>Qualité collaboration : <strong className="text-blue">{notes.qualiteCollaboration}/5</strong></div>
                        <div>Respect des délais : <strong className="text-green">{notes.respectDelais}/5</strong></div>
                      </div>
                      {notes.commentaire && (
                        <p className="text-sm italic text-dark" style={{ borderLeft: '3px solid var(--orange)', paddingLeft: 8 }}>
                          "{notes.commentaire}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted">Aucune note interne saisie pour cette campagne.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Évaluation / Notes Internes */}
      {showAddNoteModal && selectedCampaignForNote && (
        <div className="inf-modal-overlay" onClick={() => setShowAddNoteModal(false)}>
          <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <button className="inf-modal-close" onClick={() => setShowAddNoteModal(false)}>✕</button>
            <h3 className="text-lg font-bold text-dark mb-12">
              Note interne — {selectedCampaignForNote.campaign}
            </h3>
            <p className="text-xs text-muted mb-16">
              Évaluation confidentielle de l'influenceur @{selectedInf.name} pour cette campagne.
            </p>

            <div className="inf-edit-grid">
              <div>
                <label className="form-label">Fiabilité globale (1 à 5)</label>
                <select
                  className="form-input"
                  value={newNote.fiabilite}
                  onChange={e => setNewNote({ ...newNote, fiabilite: parseInt(e.target.value) })}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Bon</option>
                  <option value={3}>3 - Moyen</option>
                  <option value={2}>2 - Insatisfaisant</option>
                  <option value={1}>1 - Très mauvais</option>
                </select>
              </div>

              <div>
                <label className="form-label">Qualité de collaboration (1 à 5)</label>
                <select
                  className="form-input"
                  value={newNote.qualiteCollaboration}
                  onChange={e => setNewNote({ ...newNote, qualiteCollaboration: parseInt(e.target.value) })}
                >
                  <option value={5}>5 - Très pro & réactif</option>
                  <option value={4}>4 - Bon contact</option>
                  <option value={3}>3 - Correct</option>
                  <option value={2}>2 - Difficile à joindre</option>
                  <option value={1}>1 - Non professionnel</option>
                </select>
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Respect des délais (1 à 5)</label>
                <select
                  className="form-input"
                  value={newNote.respectDelais}
                  onChange={e => setNewNote({ ...newNote, respectDelais: parseInt(e.target.value) })}
                >
                  <option value={5}>5 - Toujours en avance / à l'heure</option>
                  <option value={4}>4 - Délais respectés</option>
                  <option value={3}>3 - Légers retards justifiés</option>
                  <option value={2}>2 - Retards fréquents</option>
                  <option value={1}>1 - Non respect systématique</option>
                </select>
              </div>

              <div className="inf-edit-full">
                <label className="form-label">Commentaire interne & appréciations</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Notes confidentielles sur le comportement, l'attitude et la réactivité de l'influenceur..."
                  value={newNote.commentaire}
                  onChange={e => setNewNote({ ...newNote, commentaire: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-8 mt-16">
              <button className="btn btn-orange" style={{ flex: 1 }} onClick={handleSaveNote}>
                Enregistrer la note
              </button>
              <button className="btn btn-ghost" onClick={() => setShowAddNoteModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
