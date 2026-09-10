import { useState } from 'react';
import {
  getInfluencerCdcAndDeliverables,
  DELIVERABLE_STATUS_CONFIG,
  DELIVERABLE_TYPES,
  getDeliverableTypeLabel,
  getDeliverableTypeIcon
} from './deliverableUtils';

export default function InfluencerDeliverablesSection({ influencer, setInfluencers, onExportPdf, onShare }) {
  const { activeCdc, allCdc, activeDeliverables, stats } = getInfluencerCdcAndDeliverables(influencer);
  const [selectedCdcId, setSelectedCdcId] = useState(activeCdc?.id || null);
  const [editingLivrableId, setEditingLivrableId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');

  const currentCdc = allCdc.find(c => c.id === selectedCdcId) || activeCdc;
  const deliverablesToShow = (currentCdc?.livrables || activeDeliverables).filter(d => {
    if (filterType !== 'all' && d.type !== filterType) return false;
    if (filterStatut !== 'all' && d.statut !== filterStatut) return false;
    return true;
  });

  const handleStartEdit = (livrable) => {
    setEditingLivrableId(livrable.id);
    setEditForm({
      statut: livrable.statut || 'en_cours',
      avancement: livrable.avancement ?? 50,
      lienPublication: livrable.lienPublication || '',
      commentaires: livrable.commentaires || ''
    });
  };

  const handleSaveEdit = (livrableId) => {
    if (!setInfluencers) {
      setEditingLivrableId(null);
      return;
    }

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;

      const cdcList = (inf.cahierDesCharges || []).map(cdc => {
        if (currentCdc && cdc.id !== currentCdc.id) return cdc;
        const livrables = (cdc.livrables || []).map(l => {
          if (l.id === livrableId) {
            return {
              ...l,
              statut: editForm.statut,
              avancement: Number(editForm.avancement),
              lienPublication: editForm.lienPublication,
              commentaires: editForm.commentaires
            };
          }
          return l;
        });
        return { ...cdc, livrables };
      });

      return { ...inf, cahierDesCharges: cdcList };
    }));

    setEditingLivrableId(null);
  };

  const handleQuickStatutChange = (livrableId, newStatut) => {
    if (!setInfluencers) return;
    const defaultProg = DELIVERABLE_STATUS_CONFIG[newStatut]?.defaultProgress ?? 50;

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const cdcList = (inf.cahierDesCharges || []).map(cdc => {
        if (currentCdc && cdc.id !== currentCdc.id) return cdc;
        const livrables = (cdc.livrables || []).map(l => {
          if (l.id === livrableId) {
            return {
              ...l,
              statut: newStatut,
              avancement: newStatut === 'valide' ? 100 : (l.avancement || defaultProg)
            };
          }
          return l;
        });
        return { ...cdc, livrables };
      });
      return { ...inf, cahierDesCharges: cdcList };
    }));
  };

  return (
    <div className="space-y-16">
      {/* ──── BANDEAU SUPÉRIEUR RÉCAPITULATIF ──── */}
      <div
        className="p-16 rounded-lg border flex flex-wrap justify-between items-center gap-12"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          color: '#fff',
          borderLeft: '5px solid #FF7900'
        }}
      >
        <div>
          <div className="flex items-center gap-8 mb-4">
            <span style={{ fontSize: 18 }}>📦</span>
            <h3 className="m-0 text-base font-bold text-white">
              Travaux & Livrables en Cours
            </h3>
            <span
              className="text-xs px-8 py-2 rounded-full font-bold"
              style={{ background: '#FF7900', color: '#fff' }}
            >
              {stats.globalProgress}% global
            </span>
          </div>
          <p className="m-0 text-xs text-muted" style={{ color: '#ccc' }}>
            Suivi des engagements contractuels et cahiers des charges Orange Cameroun
          </p>
        </div>

        <div className="flex items-center gap-8 flex-wrap">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="btn btn-sm flex items-center gap-6"
              style={{ background: '#FF7900', color: '#fff', border: 'none', fontWeight: 700 }}
              title="Générer la fiche PDF chartée Orange"
            >
              <span>📄</span>
              <span>Export PDF Charté</span>
            </button>
          )}

          {onShare && (
            <button
              onClick={onShare}
              className="btn btn-ghost btn-sm flex items-center gap-6"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
              title="Partager la fiche ou copier le lien"
            >
              <span>🔗</span>
              <span>Partager</span>
            </button>
          )}
        </div>
      </div>

      {/* ──── STATISTIQUES RAPIDES DES LIVRABLES ──── */}
      <div className="grid grid-4 gap-10">
        <div className="p-10 bg-white rounded border text-center">
          <div className="text-xs text-muted font-bold">TOTAL ATTENDUS</div>
          <div className="text-xl font-bold text-dark">{stats.total}</div>
          <div className="text-xs text-muted">Livrables briefs</div>
        </div>

        <div className="p-10 bg-white rounded border text-center">
          <div className="text-xs text-green font-bold">VALIDÉS ✓</div>
          <div className="text-xl font-bold text-green">{stats.valides}</div>
          <div className="text-xs text-muted">Conformes charte</div>
        </div>

        <div className="p-10 bg-white rounded border text-center">
          <div className="text-xs text-blue font-bold">EN COURS / SOUMIS</div>
          <div className="text-xl font-bold text-blue">{stats.enCours + stats.livres}</div>
          <div className="text-xs text-muted">En production</div>
        </div>

        <div className="p-10 bg-white rounded border text-center">
          <div className="text-xs text-red font-bold">EN RETARD ⚠️</div>
          <div className="text-xl font-bold text-red">{stats.enRetard}</div>
          <div className="text-xs text-muted">Deadline dépassée</div>
        </div>
      </div>

      {/* ──── SÉLECTEUR DE CAHIER DES CHARGES S'IL Y EN A PLUSIEURS ──── */}
      {allCdc.length > 1 && (
        <div className="flex gap-8 items-center flex-wrap">
          <span className="text-xs font-bold text-dark">Sélectionner le Cahier des Charges :</span>
          {allCdc.map(cdc => (
            <button
              key={cdc.id}
              onClick={() => setSelectedCdcId(cdc.id)}
              className={`btn btn-sm ${selectedCdcId === cdc.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 12, fontWeight: selectedCdcId === cdc.id ? 700 : 500 }}
            >
              📋 {cdc.campagneNom} ({cdc.id})
            </button>
          ))}
        </div>
      )}

      {/* ──── 1. CADRAGE DU CAHIER DES CHARGES (CDC) ──── */}
      {currentCdc && (
        <div className="p-16 rounded-lg border bg-white space-y-12" style={{ borderTop: '3px solid #FF7900' }}>
          <div className="flex justify-between items-start flex-wrap gap-8">
            <div>
              <div className="flex items-center gap-8 mb-2">
                <span className="tag tag-orange font-bold text-xs">{currentCdc.id}</span>
                <h4 className="m-0 text-sm font-bold text-dark">
                  Campagne : {currentCdc.campagneNom}
                </h4>
              </div>
              <p className="m-0 text-xs text-muted">
                📅 Période contractuelle : <strong>du {currentCdc.dateDebut} au {currentCdc.dateFin}</strong> • Produits cibles : <strong>{(currentCdc.produits || []).join(', ')}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-muted">Échéances globales :</span>
              <div className="text-xs font-bold text-dark">
                {currentCdc.livrables?.length || 0} livrables programmés
              </div>
            </div>
          </div>

          {/* Grille : Objectifs & Contraintes */}
          <div className="grid grid-2 gap-12 pt-8 border-t">
            {/* Objectifs */}
            <div className="p-10 rounded bg-gray-50 border">
              <div className="text-xs font-bold text-orange mb-4 flex items-center gap-6">
                <span>🎯</span>
                <span>OBJECTIFS DE LA CAMPAGNE</span>
              </div>
              <p className="text-xs text-dark m-0 leading-relaxed">
                {currentCdc.objectifs}
              </p>
            </div>

            {/* Contraintes */}
            <div className="p-10 rounded bg-gray-50 border">
              <div className="text-xs font-bold text-dark mb-4 flex items-center gap-6">
                <span>⚠️</span>
                <span>CONTRAINTES DE DIFFUSION & EXCLUSIVITÉS</span>
              </div>
              <p className="text-xs text-muted m-0 leading-relaxed">
                {currentCdc.contraintes}
              </p>
            </div>
          </div>

          {/* Points Clés : Ton, Mentions, Hashtags */}
          <div className="p-10 rounded border flex flex-wrap items-center justify-between gap-10" style={{ background: '#FFF9F2', borderColor: '#FFE2C6' }}>
            <div className="flex items-center gap-8">
              <span style={{ fontSize: 16 }}>🎨</span>
              <div>
                <span className="text-xs font-bold text-dark">Ton de marque : </span>
                <span className="text-xs text-muted">{currentCdc.guidelineMarque?.ton || 'Dynamique et jeune'}</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <span style={{ fontSize: 16 }}>🏷️</span>
              <div>
                <span className="text-xs font-bold text-dark">Hashtags officiels : </span>
                <span className="text-xs font-semibold text-orange">
                  {(currentCdc.guidelineMarque?.hashtags || ['#OrangeCameroun']).join(' ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <span style={{ fontSize: 16 }}>📢</span>
              <div>
                <span className="text-xs font-bold text-dark">Mentions obligatoires : </span>
                <span className="text-xs font-bold text-blue">
                  {(currentCdc.guidelineMarque?.mentions || ['@OrangeCameroun']).join(' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──── 2. LISTE DES LIVRABLES ATTENDUS ──── */}
      <div className="space-y-12">
        <div className="flex justify-between items-center flex-wrap gap-8">
          <h4 className="text-sm font-bold text-dark m-0 flex items-center gap-8">
            <span>Détail des Livrables Attendus</span>
            <span className="tag tag-ghost text-xs">({deliverablesToShow.length})</span>
          </h4>

          {/* Filtres de la liste */}
          <div className="flex items-center gap-8 flex-wrap">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs p-4 border rounded bg-white"
            >
              <option value="all">Tous types</option>
              {DELIVERABLE_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>

            <select
              value={filterStatut}
              onChange={e => setFilterStatut(e.target.value)}
              className="text-xs p-4 border rounded bg-white"
            >
              <option value="all">Tous statuts</option>
              <option value="a_faire">À faire</option>
              <option value="en_cours">En cours</option>
              <option value="livre">Livré / Soumis</option>
              <option value="valide">Validé</option>
              <option value="en_retard">En retard</option>
            </select>
          </div>
        </div>

        {deliverablesToShow.length === 0 ? (
          <div className="p-20 text-center bg-white rounded border text-muted text-xs">
            Aucun livrable ne correspond aux critères de filtre.
          </div>
        ) : (
          <div className="space-y-10">
            {deliverablesToShow.map((liv) => {
              const stConfig = DELIVERABLE_STATUS_CONFIG[liv.statut] || DELIVERABLE_STATUS_CONFIG.en_cours;
              const isEditing = editingLivrableId === liv.id;
              const progress = liv.avancement ?? 50;

              return (
                <div
                  key={liv.id}
                  className="p-14 bg-white rounded-lg border shadow-xs transition-all hover:border-gray-400"
                  style={{ borderLeft: `4px solid ${stConfig.color}` }}
                >
                  <div className="flex justify-between items-start flex-wrap gap-10 mb-8">
                    {/* Colonne gauche : Type, Titre, Description */}
                    <div style={{ flex: '1 1 340px' }}>
                      <div className="flex items-center gap-6 mb-4 flex-wrap">
                        <span style={{ fontSize: 16 }}>{getDeliverableTypeIcon(liv.type)}</span>
                        <span className="font-bold text-dark text-sm">{liv.titre}</span>
                        <span className="tag tag-ghost text-xs" style={{ fontSize: 11 }}>
                          {getDeliverableTypeLabel(liv.type)}
                        </span>
                        {liv.produit && (
                          <span className="tag tag-orange text-xs" style={{ fontSize: 10 }}>
                            {liv.produit}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted m-0 mb-6 leading-relaxed">
                        {liv.description}
                      </p>

                      {/* Lien et commentaire */}
                      <div className="flex items-center gap-12 flex-wrap text-xs">
                        {liv.lienPublication ? (
                          <a
                            href={liv.lienPublication}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue underline font-semibold flex items-center gap-4"
                          >
                            <span>🔗 Voir publication / fichier</span> ↗
                          </a>
                        ) : (
                          <span className="text-muted italic">Aucun lien déposé</span>
                        )}

                        {liv.commentaires && (
                          <span className="text-dark bg-yellow-50 px-6 py-2 rounded border border-yellow-200">
                            💬 {liv.commentaires}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Colonne droite : Statut, Échéance, Avancement */}
                    <div style={{ minWidth: 200 }} className="space-y-6">
                      <div className="flex justify-between items-center gap-8">
                        <span className="text-xs text-muted">Échéance :</span>
                        <strong className="text-xs text-dark">
                          📅 {liv.deadline || '—'}
                        </strong>
                      </div>

                      {/* Sélecteur de statut rapide */}
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-xs text-muted">Statut :</span>
                        <select
                          value={liv.statut}
                          onChange={(e) => handleQuickStatutChange(liv.id, e.target.value)}
                          className="text-xs font-bold py-2 px-6 rounded border cursor-pointer"
                          style={{
                            background: stConfig.bg,
                            color: stConfig.color,
                            borderColor: stConfig.color
                          }}
                        >
                          <option value="a_faire">À faire</option>
                          <option value="en_cours">En cours</option>
                          <option value="livre">Livré / Soumis</option>
                          <option value="valide">Validé ✓</option>
                          <option value="en_retard">En retard ⚠️</option>
                        </select>
                      </div>

                      {/* Barre d'avancement */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="text-muted">Avancement</span>
                          <strong style={{ color: stConfig.color }}>{progress}%</strong>
                        </div>
                        <div
                          className="w-full bg-gray-200 rounded-full overflow-hidden"
                          style={{ height: 6 }}
                        >
                          <div
                            style={{
                              width: `${progress}%`,
                              height: '100%',
                              backgroundColor: stConfig.color,
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                      </div>

                      {/* Bouton d'édition avancée */}
                      <div className="text-right pt-4">
                        <button
                          onClick={() => isEditing ? setEditingLivrableId(null) : handleStartEdit(liv)}
                          className="btn btn-ghost btn-sm text-xs p-2"
                        >
                          {isEditing ? 'Annuler' : '✏️ Mettre à jour'}
                        </button>
                      </div>
                    </div>
                  </div>

                    {/* Mode édition inline */}
                    {isEditing && (
                    <div className="mt-12 p-12 bg-gray-50 border rounded-lg space-y-10">
                      <h5 className="m-0 text-xs font-bold text-dark">
                        Mise à jour rapide du livrable
                      </h5>

                      <div className="grid grid-2 gap-10">
                        <div>
                          <label className="text-xs text-muted block mb-2 font-semibold">
                            Lien de la publication / aperçu Drive
                          </label>
                          <input
                            type="text"
                            placeholder="https://instagram.com/..."
                            value={editForm.lienPublication}
                            onChange={e => setEditForm({ ...editForm, lienPublication: e.target.value })}
                            className="w-full text-xs p-6 border rounded bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-muted block mb-2 font-semibold">
                            Avancement : {editForm.avancement}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={editForm.avancement}
                            onChange={e => setEditForm({ ...editForm, avancement: e.target.value })}
                            className="w-full cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-muted block mb-2 font-semibold">
                          Commentaires & Retours équipe McCann / Orange
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Story validée par le pôle digital, en attente de mise en ligne..."
                          value={editForm.commentaires}
                          onChange={e => setEditForm({ ...editForm, commentaires: e.target.value })}
                          className="w-full text-xs p-6 border rounded bg-white"
                        />
                      </div>

                      <div className="flex justify-end gap-6">
                        <button
                          onClick={() => setEditingLivrableId(null)}
                          className="btn btn-ghost btn-sm text-xs"
                        >
                          Fermer
                        </button>
                        <button
                          onClick={() => handleSaveEdit(liv.id)}
                          className="btn btn-sm text-xs font-bold"
                          style={{ background: '#FF7900', color: '#fff', border: 'none' }}
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
