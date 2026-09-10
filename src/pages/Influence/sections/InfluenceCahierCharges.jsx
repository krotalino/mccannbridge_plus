import { useState } from 'react';

const LIVRABLE_STATUTS = [
  { id: 'a_faire', label: 'À faire', color: '#8C8C8C' },
  { id: 'en_cours', label: 'En cours', color: '#2980B9' },
  { id: 'livre', label: 'Livré', color: '#F39C12' },
  { id: 'valide', label: 'Validé', color: '#27AE60' }
];

const LIVRABLE_TYPES = [
  { id: 'story', label: 'Story', icon: '📱' },
  { id: 'video', label: 'Vidéo', icon: '🎬' },
  { id: 'reel', label: 'Reel / TikTok', icon: '🎵' },
  { id: 'post', label: 'Post Image', icon: '📸' },
  { id: 'carrousel', label: 'Carrousel', icon: '📑' },
  { id: 'live', label: 'Live Stream', icon: '🔴' },
  { id: 'autre', label: 'Autre', icon: '📄' }
];

function getStatutLabel(s) {
  const item = LIVRABLE_STATUTS.find(x => x.id === s);
  return item ? item.label : s;
}

function getStatutColor(s) {
  const item = LIVRABLE_STATUTS.find(x => x.id === s);
  return item ? item.color : '#8C8C8C';
}

function getTypeIcon(t) {
  const item = LIVRABLE_TYPES.find(x => x.id === t);
  return item ? item.icon : '📄';
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

export default function InfluenceCahierCharges({ influencers = [], setInfluencers }) {
  // Filtres
  const [filterInf, setFilterInf] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [searchCampaign, setSearchCampaign] = useState('');

  // Modales
  const [showCdcModal, setShowCdcModal] = useState(false);
  const [editingCdc, setEditingCdc] = useState(null);
  const [originalInfId, setOriginalInfId] = useState(null);

  const [showGuidelinesModal, setShowGuidelinesModal] = useState(null);
  const [showLivrableModal, setShowLivrableModal] = useState(null); // { infId, cdcId, livrable: {...} }
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Rassembler tous les cahiers des charges avec métadonnées de l'influenceur
  const allCdc = (influencers || []).flatMap(inf =>
    (inf.cahierDesCharges || []).map(cdc => ({
      ...cdc,
      influencerId: inf.id,
      influencerName: inf.pseudo || inf.name,
      influencerRealName: inf.realName || `${inf.prenom || ''} ${inf.nom || ''}`.trim(),
      influencerPhoto: inf.photo || null,
    }))
  );

  // Filtrage
  const filteredCdc = allCdc.filter(cdc => {
    if (filterInf && String(cdc.influencerId) !== String(filterInf)) return false;
    if (filterStatut) {
      const hasStatut = (cdc.livrables || []).some(l => l.statut === filterStatut);
      if (!hasStatut) return false;
    }
    if (searchCampaign.trim()) {
      const q = searchCampaign.toLowerCase();
      const matchName = (cdc.campagneNom || '').toLowerCase().includes(q);
      const matchInf = (cdc.influencerName || '').toLowerCase().includes(q) || (cdc.influencerRealName || '').toLowerCase().includes(q);
      const matchProd = (cdc.produits || []).some(p => p.toLowerCase().includes(q));
      const matchLiv = (cdc.livrables || []).some(l => (l.titre || '').toLowerCase().includes(q));
      if (!matchName && !matchInf && !matchProd && !matchLiv) return false;
    }
    return true;
  });

  // KPIs livrables
  const allLivrables = allCdc.flatMap(cdc => cdc.livrables || []);
  const kpis = {
    total: allLivrables.length,
    aFaire: allLivrables.filter(l => l.statut === 'a_faire').length,
    enCours: allLivrables.filter(l => l.statut === 'en_cours').length,
    livres: allLivrables.filter(l => l.statut === 'livre').length,
    valides: allLivrables.filter(l => l.statut === 'valide').length,
    enRetard: allLivrables.filter(l => {
      const days = getDaysUntil(l.deadline);
      return days !== null && days < 0 && l.statut !== 'valide';
    }).length,
  };

  // Changement rapide de statut d'un livrable
  const handleStatutChange = (infId, cdcId, livrableId, newStatut) => {
    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(infId)) return inf;
      const cahierDesCharges = (inf.cahierDesCharges || []).map(cdc => {
        if (cdc.id !== cdcId) return cdc;
        const livrables = (cdc.livrables || []).map(l => l.id === livrableId ? { ...l, statut: newStatut } : l);
        return { ...cdc, livrables };
      });
      return { ...inf, cahierDesCharges };
    }));
    triggerToast(`Statut mis à jour : ${getStatutLabel(newStatut)}`);
  };

  // ─── 1. CRÉATION D'UN CAHIER DES CHARGES ───
  const handleOpenCreate = () => {
    const firstInf = influencers[0];
    setEditingCdc({
      id: '',
      influencerId: firstInf ? firstInf.id : '',
      campagneId: `CP-${Date.now().toString().slice(-4)}`,
      campagneNom: '',
      produitsInput: 'Orange Money, Forfait Pulse',
      produits: ['Orange Money', 'Forfait Pulse'],
      guidelineMarque: {
        ton: 'Enthousiaste, dynamique et jeune',
        visuels: 'Charte Orange Cameroun (orange, noir et blanc, logo visible)',
        hashtags: ['#OrangeCameroun', '#PulseOrange'],
        mentions: ['@OrangeCameroun']
      },
      hashtagsInput: '#OrangeCameroun, #PulseOrange',
      mentionsInput: '@OrangeCameroun',
      livrables: [
        {
          id: `L-${Date.now()}-1`,
          titre: 'Story teaser de lancement',
          type: 'story',
          deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          statut: 'a_faire',
          guidelines: 'Format 9:16 avec sticker de lien et mention du compte officiel',
          produit: 'Orange Money'
        },
        {
          id: `L-${Date.now()}-2`,
          titre: 'Vidéo Reel démonstration produit',
          type: 'video',
          deadline: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
          statut: 'a_faire',
          guidelines: 'Démonstration fluide, ton naturel et CTA final clair',
          produit: 'Forfait Pulse'
        }
      ]
    });
    setOriginalInfId(null);
    setShowCdcModal(true);
  };

  // ─── 2. MODIFICATION D'UN CAHIER DES CHARGES ───
  const handleOpenEdit = (cdc) => {
    setEditingCdc({
      id: cdc.id,
      influencerId: cdc.influencerId,
      campagneId: cdc.campagneId || `CP-${Date.now().toString().slice(-4)}`,
      campagneNom: cdc.campagneNom || '',
      produits: Array.isArray(cdc.produits) ? [...cdc.produits] : [],
      produitsInput: Array.isArray(cdc.produits) ? cdc.produits.join(', ') : '',
      guidelineMarque: {
        ton: cdc.guidelineMarque?.ton || '',
        visuels: cdc.guidelineMarque?.visuels || '',
        hashtags: Array.isArray(cdc.guidelineMarque?.hashtags) ? [...cdc.guidelineMarque.hashtags] : [],
        mentions: Array.isArray(cdc.guidelineMarque?.mentions) ? [...cdc.guidelineMarque.mentions] : []
      },
      hashtagsInput: Array.isArray(cdc.guidelineMarque?.hashtags) ? cdc.guidelineMarque.hashtags.join(', ') : '',
      mentionsInput: Array.isArray(cdc.guidelineMarque?.mentions) ? cdc.guidelineMarque.mentions.join(', ') : '',
      livrables: Array.isArray(cdc.livrables) ? cdc.livrables.map(l => ({ ...l })) : []
    });
    setOriginalInfId(cdc.influencerId);
    setShowCdcModal(true);
  };

  // ─── SAUVEGARDE (CRÉATION OU MODIFICATION) ───
  const handleSaveCdc = (e) => {
    if (e) e.preventDefault();
    if (!editingCdc.campagneNom.trim()) {
      alert('Veuillez saisir un nom de campagne.');
      return;
    }
    if (!editingCdc.influencerId) {
      alert('Veuillez sélectionner un influenceur.');
      return;
    }

    const produits = editingCdc.produitsInput
      ? editingCdc.produitsInput.split(',').map(s => s.trim()).filter(Boolean)
      : (editingCdc.produits || []);

    const hashtags = editingCdc.hashtagsInput
      ? editingCdc.hashtagsInput.split(',').map(s => s.trim()).filter(Boolean)
      : (editingCdc.guidelineMarque?.hashtags || []);

    const mentions = editingCdc.mentionsInput
      ? editingCdc.mentionsInput.split(',').map(s => s.trim()).filter(Boolean)
      : (editingCdc.guidelineMarque?.mentions || []);

    const cdcId = editingCdc.id || `CDC-${Date.now().toString().slice(-6)}`;
    const formattedCdc = {
      id: cdcId,
      campagneId: editingCdc.campagneId || `CP-${Date.now().toString().slice(-4)}`,
      campagneNom: editingCdc.campagneNom.trim(),
      produits: produits.length > 0 ? produits : ['Orange Cameroun'],
      guidelineMarque: {
        ton: editingCdc.guidelineMarque?.ton?.trim() || 'Enthousiaste et dynamique',
        visuels: editingCdc.guidelineMarque?.visuels?.trim() || 'Charte graphique Orange Cameroun',
        hashtags: hashtags.length > 0 ? hashtags : ['#OrangeCameroun'],
        mentions: mentions.length > 0 ? mentions : ['@OrangeCameroun']
      },
      livrables: (editingCdc.livrables || []).map((liv, idx) => ({
        id: liv.id || `L-${Date.now()}-${idx + 1}`,
        titre: liv.titre?.trim() || `Livrable ${idx + 1}`,
        type: liv.type || 'story',
        deadline: liv.deadline || new Date().toISOString().split('T')[0],
        statut: liv.statut || 'a_faire',
        guidelines: liv.guidelines?.trim() || '',
        produit: liv.produit?.trim() || (produits[0] || 'Orange Cameroun')
      }))
    };

    const targetInfId = editingCdc.influencerId;
    const isNew = !editingCdc.id;

    setInfluencers(prev => {
      // Cas 1 : Réassignation d'un CDC existant à un autre influenceur
      if (!isNew && originalInfId && String(originalInfId) !== String(targetInfId)) {
        return prev.map(inf => {
          if (String(inf.id) === String(originalInfId)) {
            return {
              ...inf,
              cahierDesCharges: (inf.cahierDesCharges || []).filter(c => c.id !== cdcId)
            };
          }
          if (String(inf.id) === String(targetInfId)) {
            return {
              ...inf,
              cahierDesCharges: [...(inf.cahierDesCharges || []), formattedCdc]
            };
          }
          return inf;
        });
      }

      // Cas 2 : Ajout ou mise à jour normale
      return prev.map(inf => {
        if (String(inf.id) !== String(targetInfId)) return inf;
        const currentList = inf.cahierDesCharges || [];
        if (isNew) {
          return {
            ...inf,
            cahierDesCharges: [formattedCdc, ...currentList]
          };
        } else {
          return {
            ...inf,
            cahierDesCharges: currentList.map(c => c.id === cdcId ? formattedCdc : c)
          };
        }
      });
    });

    setShowCdcModal(false);
    triggerToast(isNew ? '✓ Cahier des charges créé avec succès' : '✓ Cahier des charges mis à jour avec succès');
  };

  // ─── 3. SUPPRESSION D'UN CAHIER DES CHARGES ───
  const handleDeleteCdc = (infId, cdcId, campagneNom) => {
    if (!window.confirm(`Confirmer la suppression du cahier des charges "${campagneNom || cdcId}" ?\nTous les livrables et guidelines associés seront supprimés.`)) {
      return;
    }

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(infId)) return inf;
      return {
        ...inf,
        cahierDesCharges: (inf.cahierDesCharges || []).filter(c => c.id !== cdcId)
      };
    }));

    triggerToast(`✓ Cahier des charges "${campagneNom || cdcId}" supprimé`);
  };

  // ─── GESTION DES LIVRABLES DU FORMULAIRE CDC ───
  const handleAddLivrableToForm = () => {
    const newLiv = {
      id: `L-${Date.now()}-${(editingCdc.livrables || []).length + 1}`,
      titre: '',
      type: 'story',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      statut: 'a_faire',
      guidelines: '',
      produit: ''
    };
    setEditingCdc(prev => ({
      ...prev,
      livrables: [...(prev.livrables || []), newLiv]
    }));
  };

  const handleUpdateLivrableInForm = (index, field, value) => {
    setEditingCdc(prev => {
      const copy = [...(prev.livrables || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, livrables: copy };
    });
  };

  const handleRemoveLivrableFromForm = (index) => {
    setEditingCdc(prev => ({
      ...prev,
      livrables: (prev.livrables || []).filter((_, i) => i !== index)
    }));
  };

  // ─── GESTION DIRECTE D'UN LIVRABLE SUR LA CARTE ───
  const handleOpenAddLivrableDirect = (cdc) => {
    setShowLivrableModal({
      infId: cdc.influencerId,
      cdcId: cdc.id,
      campagneNom: cdc.campagneNom,
      produits: cdc.produits || [],
      livrable: {
        id: '',
        titre: '',
        type: 'story',
        deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        statut: 'a_faire',
        guidelines: '',
        produit: (cdc.produits && cdc.produits[0]) || ''
      }
    });
  };

  const handleOpenEditLivrableDirect = (cdc, livrable) => {
    setShowLivrableModal({
      infId: cdc.influencerId,
      cdcId: cdc.id,
      campagneNom: cdc.campagneNom,
      produits: cdc.produits || [],
      livrable: { ...livrable }
    });
  };

  const handleSaveLivrableDirect = (e) => {
    if (e) e.preventDefault();
    if (!showLivrableModal || !showLivrableModal.livrable.titre.trim()) {
      alert('Veuillez saisir un titre pour le livrable.');
      return;
    }

    const { infId, cdcId, livrable } = showLivrableModal;
    const isNew = !livrable.id;
    const finalLivrable = {
      ...livrable,
      id: livrable.id || `L-${Date.now()}`,
      titre: livrable.titre.trim(),
      deadline: livrable.deadline || new Date().toISOString().split('T')[0],
      statut: livrable.statut || 'a_faire'
    };

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(infId)) return inf;
      const cahierDesCharges = (inf.cahierDesCharges || []).map(cdc => {
        if (cdc.id !== cdcId) return cdc;
        let livrables = cdc.livrables || [];
        if (isNew) {
          livrables = [...livrables, finalLivrable];
        } else {
          livrables = livrables.map(l => l.id === finalLivrable.id ? finalLivrable : l);
        }
        return { ...cdc, livrables };
      });
      return { ...inf, cahierDesCharges };
    }));

    setShowLivrableModal(null);
    triggerToast(isNew ? '✓ Livrable ajouté au cahier des charges' : '✓ Livrable mis à jour');
  };

  const handleDeleteLivrableDirect = (infId, cdcId, livrableId, livrableTitre) => {
    if (!window.confirm(`Supprimer le livrable "${livrableTitre}" ?`)) return;

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(infId)) return inf;
      const cahierDesCharges = (inf.cahierDesCharges || []).map(cdc => {
        if (cdc.id !== cdcId) return cdc;
        return {
          ...cdc,
          livrables: (cdc.livrables || []).filter(l => l.id !== livrableId)
        };
      });
      return { ...inf, cahierDesCharges };
    }));

    triggerToast(`✓ Livrable supprimé`);
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#0E1428] border border-[#FF6600] text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-fade-in"
          style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#0F142D', border: '1px solid var(--orange)', color: '#fff' }}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* En-tête principal avec bouton de création */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-16">
        <div>
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <span>📝</span> Cahier des Charges
          </h2>
          <p className="text-sm text-muted">Livrables, deadlines, guidelines et suivi d'exécution par campagne</p>
        </div>

        <button 
          className="btn btn-orange flex items-center gap-2 shadow-md hover:brightness-110"
          onClick={handleOpenCreate}
          style={{ fontWeight: 700, padding: '10px 18px' }}
        >
          <span>➕</span>
          <span>Nouveau cahier des charges</span>
        </button>
      </div>

      {/* KPI Kanban-like counters */}
      <div className="grid mb-20" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total Livrables', count: kpis.total, color: 'var(--orange)', icon: '📦' },
          { label: 'À faire', count: kpis.aFaire, color: '#8C8C8C', icon: '📋' },
          { label: 'En cours', count: kpis.enCours, color: '#2980B9', icon: '🔄' },
          { label: 'Livrés', count: kpis.livres, color: '#F39C12', icon: '📤' },
          { label: 'Validés', count: kpis.valides, color: '#27AE60', icon: '✅' },
          { label: 'En retard', count: kpis.enRetard, color: '#E74C3C', icon: '⚠️' },
        ].map((k, i) => (
          <div key={i} className="card text-center py-12" style={{ borderBottom: `3px solid ${k.color}` }}>
            <div className="text-xl font-bold" style={{ color: k.color }}>{k.count}</div>
            <div className="text-xs text-muted font-semibold mt-4">{k.icon} {k.label}</div>
          </div>
        ))}
      </div>

      {/* Barre de filtres et recherche */}
      <div className="inf-search-panel" style={{ marginBottom: 16 }}>
        <div className="inf-search-row">
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Rechercher par campagne, produit, influenceur..."
            value={searchCampaign}
            onChange={e => setSearchCampaign(e.target.value)}
            style={{ flex: 2 }}
          />

          <select className="form-input" value={filterInf} onChange={e => setFilterInf(e.target.value)}>
            <option value="">Tous les influenceurs ({influencers.length})</option>
            {influencers.map(i => (
              <option key={i.id} value={i.id}>@{i.pseudo || i.name} — {i.realName || i.name}</option>
            ))}
          </select>

          <select className="form-input" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
            <option value="">Tous les statuts de livrable</option>
            {LIVRABLE_STATUTS.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          {(filterInf || filterStatut || searchCampaign) && (
            <button
              className="btn btn-ghost btn-sm text-xs"
              onClick={() => {
                setFilterInf('');
                setFilterStatut('');
                setSearchCampaign('');
              }}
            >
              ✕ Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Liste des cahiers des charges */}
      {filteredCdc.length === 0 ? (
        <div className="card text-center py-20" style={{ background: '#fff', borderRadius: 12 }}>
          <div className="text-3xl mb-8">📭</div>
          <div className="font-bold text-dark text-base mb-4">Aucun cahier des charges trouvé</div>
          <p className="text-sm text-muted mb-16">
            {allCdc.length === 0
              ? 'Aucun cahier des charges n’a encore été créé. Commencez par en créer un.'
              : 'Aucun élément ne correspond aux filtres sélectionnés.'}
          </p>
          <button className="btn btn-orange" onClick={handleOpenCreate}>
            ➕ Créer un cahier des charges
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {filteredCdc.map(cdc => {
            const livrables = cdc.livrables || [];
            const livrablesValides = livrables.filter(l => l.statut === 'valide').length;
            const progressPercent = livrables.length > 0 ? Math.round((livrablesValides / livrables.length) * 100) : 0;

            return (
              <div 
                key={`${cdc.influencerId}-${cdc.id}`} 
                className="card mb-16 shadow-sm hover:shadow-md transition-shadow" 
                style={{ borderLeft: '4px solid var(--orange)', background: '#fff', borderRadius: 8, padding: 18 }}
              >
                {/* En-tête campagne & influenceur & Actions CRUD */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 pb-10 border-b" style={{ borderColor: '#f1f1f1' }}>
                  <div className="flex items-center gap-10">
                    <div className="inf-avatar-placeholder" style={{ width: 44, height: 44, borderRadius: '50%', fontSize: 16 }}>
                      {cdc.influencerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-8 flex-wrap">
                        <h3 className="text-lg font-bold text-dark m-0">{cdc.campagneNom}</h3>
                        <span className="tag" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)', fontSize: 11, fontWeight: 700 }}>
                          ID: {cdc.id}
                        </span>
                        <span className="tag" style={{ background: progressPercent === 100 ? 'rgba(39,174,96,0.1)' : 'rgba(41,128,185,0.1)', color: progressPercent === 100 ? 'var(--green)' : 'var(--blue)', fontSize: 11 }}>
                          Progression: {progressPercent}% ({livrablesValides}/{livrables.length})
                        </span>
                      </div>
                      <div className="text-xs text-muted mt-2">
                        Assigné à : <strong className="text-dark">@{cdc.influencerName}</strong> {cdc.influencerRealName ? `(${cdc.influencerRealName})` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Actions sur le cahier des charges : Modifier / Supprimer / Guidelines */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <button 
                      className="btn btn-ghost btn-sm text-xs flex items-center gap-1"
                      onClick={() => setShowGuidelinesModal(cdc)}
                      title="Consulter les guidelines de marque"
                    >
                      <span>📖</span>
                      <span>Guidelines</span>
                    </button>

                    <button 
                      className="btn btn-ghost btn-sm text-xs flex items-center gap-1 text-blue"
                      onClick={() => handleOpenEdit(cdc)}
                      title="Modifier ce cahier des charges"
                      style={{ color: 'var(--blue)' }}
                    >
                      <span>✏️</span>
                      <span>Modifier</span>
                    </button>

                    <button 
                      className="btn btn-ghost btn-sm text-xs flex items-center gap-1"
                      onClick={() => handleDeleteCdc(cdc.influencerId, cdc.id, cdc.campagneNom)}
                      title="Supprimer ce cahier des charges"
                      style={{ color: 'var(--red)' }}
                    >
                      <span>🗑️</span>
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>

                {/* Produits / Services ciblés */}
                <div className="flex items-center gap-4 flex-wrap mb-14">
                  <span className="text-xs font-semibold text-muted">Produits / Services :</span>
                  {(cdc.produits || []).map((p, i) => (
                    <span key={i} className="tag" style={{ background: 'rgba(41,128,185,0.08)', color: 'var(--blue)', fontSize: 11, fontWeight: 600 }}>
                      🏷️ {p}
                    </span>
                  ))}
                  {cdc.guidelineMarque?.ton && (
                    <span className="text-xs text-muted" style={{ marginLeft: 12 }}>
                      <strong>Ton :</strong> {cdc.guidelineMarque.ton}
                    </span>
                  )}
                </div>

                {/* En-tête des livrables avec bouton d'ajout rapide */}
                <div className="flex justify-between items-center mb-8">
                  <div className="text-xs font-bold text-dark uppercase tracking-wider">
                    Livrables attendus ({livrables.length})
                  </div>

                  <button 
                    className="btn btn-ghost btn-sm text-xs flex items-center gap-1 text-orange"
                    onClick={() => handleOpenAddLivrableDirect(cdc)}
                    style={{ color: 'var(--orange)', fontWeight: 600 }}
                  >
                    <span>➕</span>
                    <span>Ajouter un livrable</span>
                  </button>
                </div>

                {/* Tableau des livrables */}
                {livrables.length === 0 ? (
                  <div className="p-12 text-center text-xs text-muted bg-gray-50 rounded" style={{ background: '#fafafa', borderRadius: 6 }}>
                    Aucun livrable défini pour cette campagne. Cliquez sur « Ajouter un livrable » pour en créer un.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full text-left" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr className="border-b" style={{ borderColor: '#eee' }}>
                          <th className="py-8 text-xs font-semibold text-muted">Livrable & Produit</th>
                          <th className="py-8 text-xs font-semibold text-muted text-center">Type</th>
                          <th className="py-8 text-xs font-semibold text-muted text-center">Deadline</th>
                          <th className="py-8 text-xs font-semibold text-muted text-center">Jours restants</th>
                          <th className="py-8 text-xs font-semibold text-muted text-center">Statut</th>
                          <th className="py-8 text-xs font-semibold text-muted">Consignes clés</th>
                          <th className="py-8 text-xs font-semibold text-muted text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {livrables.map(livrable => {
                          const days = getDaysUntil(livrable.deadline);
                          const isOverdue = days !== null && days < 0 && livrable.statut !== 'valide';
                          const stColor = isOverdue ? 'var(--red)' : getStatutColor(livrable.statut);

                          return (
                            <tr 
                              key={livrable.id} 
                              className="border-b hover:bg-gray-50/50 transition-colors" 
                              style={{ borderColor: '#f4f4f4', background: isOverdue ? 'rgba(231,76,60,0.03)' : 'transparent' }}
                            >
                              <td className="py-10">
                                <div className="font-semibold text-sm text-dark">{livrable.titre}</div>
                                {livrable.produit && (
                                  <div className="text-[11px] text-muted mt-1">
                                    Produit : <span className="font-medium text-dark">{livrable.produit}</span>
                                  </div>
                                )}
                              </td>
                              <td className="py-10 text-center">
                                <span className="tag" style={{ background: '#f5f5f5', color: 'var(--dark)', fontSize: 11, fontWeight: 600 }}>
                                  {getTypeIcon(livrable.type)} {livrable.type}
                                </span>
                              </td>
                              <td className="py-10 text-center text-xs font-medium">{livrable.deadline || '—'}</td>
                              <td className="py-10 text-center">
                                <span className="text-xs font-bold" style={{ color: isOverdue ? 'var(--red)' : (days !== null && days <= 3) ? 'var(--yellow)' : 'var(--green)' }}>
                                  {days === null ? '—' : isOverdue ? `⚠️ ${Math.abs(days)}j de retard` : `${days}j`}
                                </span>
                              </td>
                              <td className="py-10 text-center">
                                <select
                                  className="form-input"
                                  value={livrable.statut}
                                  onChange={e => handleStatutChange(cdc.influencerId, cdc.id, livrable.id, e.target.value)}
                                  style={{
                                    fontSize: 11,
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    background: stColor + '15',
                                    color: stColor,
                                    fontWeight: 700,
                                    border: `1px solid ${stColor}40`,
                                    cursor: 'pointer',
                                    maxWidth: 130
                                  }}
                                >
                                  {LIVRABLE_STATUTS.map(s => (
                                    <option key={s.id} value={s.id}>{s.label}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-10 text-xs text-muted" style={{ maxWidth: 200 }}>
                                {livrable.guidelines || '—'}
                              </td>
                              <td className="py-10 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    className="btn btn-ghost btn-sm p-1 text-xs"
                                    onClick={() => handleOpenEditLivrableDirect(cdc, livrable)}
                                    title="Modifier ce livrable"
                                    style={{ color: 'var(--blue)' }}
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="btn btn-ghost btn-sm p-1 text-xs"
                                    onClick={() => handleDeleteLivrableDirect(cdc.influencerId, cdc.id, livrable.id, livrable.titre)}
                                    title="Supprimer ce livrable"
                                    style={{ color: 'var(--red)' }}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── MODAL 1: CRÉATION / MODIFICATION D'UN CAHIER DES CHARGES ─── */}
      {showCdcModal && editingCdc && (
        <div className="inf-modal-overlay" onClick={() => setShowCdcModal(false)}>
          <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <button className="inf-modal-close" onClick={() => setShowCdcModal(false)}>✕</button>
            
            <div className="mb-16">
              <h3 className="text-lg font-bold text-dark m-0">
                {editingCdc.id ? '✏️ Modifier le cahier des charges' : '➕ Nouveau cahier des charges'}
              </h3>
              <p className="text-xs text-muted mt-1">
                Configurez la campagne, l'influenceur assigné, les guidelines de marque et les livrables attendus.
              </p>
            </div>

            <form onSubmit={handleSaveCdc}>
              {/* Section 1: Informations Générales */}
              <div className="inf-edit-grid mb-16">
                <div>
                  <label className="form-label font-bold text-xs">Influenceur assigné *</label>
                  <select 
                    className="form-input" 
                    value={editingCdc.influencerId}
                    onChange={e => setEditingCdc(c => ({ ...c, influencerId: e.target.value }))}
                    required
                  >
                    {influencers.map(i => (
                      <option key={i.id} value={i.id}>@{i.pseudo || i.name} — {i.realName || i.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label font-bold text-xs">Nom de la campagne *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Orange Money Ramadan 2026"
                    value={editingCdc.campagneNom}
                    onChange={e => setEditingCdc(c => ({ ...c, campagneNom: e.target.value }))}
                    required
                  />
                </div>

                <div className="inf-edit-full">
                  <label className="form-label font-bold text-xs">Produits / Services à promouvoir (séparés par virgules)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Forfait Orange Weekend, Max It, Orange Money"
                    value={editingCdc.produitsInput}
                    onChange={e => setEditingCdc(c => ({ ...c, produitsInput: e.target.value }))}
                  />
                </div>
              </div>

              {/* Section 2: Guidelines de Marque */}
              <div className="card p-12 mb-16" style={{ background: '#fcfcfc', border: '1px solid #eee', borderRadius: 8 }}>
                <div className="text-xs font-bold text-dark uppercase tracking-wider mb-8 flex items-center gap-1">
                  <span>📖</span> Guidelines de marque
                </div>

                <div className="inf-edit-grid">
                  <div>
                    <label className="form-label text-xs">Ton de communication</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Jeune, dynamique et festif"
                      value={editingCdc.guidelineMarque?.ton || ''}
                      onChange={e => setEditingCdc(c => ({
                        ...c,
                        guidelineMarque: { ...c.guidelineMarque, ton: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">Visuels & Charte</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Fond blanc/orange, logo lisible"
                      value={editingCdc.guidelineMarque?.visuels || ''}
                      onChange={e => setEditingCdc(c => ({
                        ...c,
                        guidelineMarque: { ...c.guidelineMarque, visuels: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">Hashtags obligatoires</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="#OrangeCameroun, #PulseOrange"
                      value={editingCdc.hashtagsInput}
                      onChange={e => setEditingCdc(c => ({ ...c, hashtagsInput: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">Mentions obligatoires</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="@OrangeCameroun, @OrangeMoney"
                      value={editingCdc.mentionsInput}
                      onChange={e => setEditingCdc(c => ({ ...c, mentionsInput: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Livrables inclus */}
              <div className="mb-20">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-xs font-bold text-dark uppercase tracking-wider flex items-center gap-1">
                    <span>📦</span> Livrables attendus ({(editingCdc.livrables || []).length})
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm text-xs text-orange"
                    onClick={handleAddLivrableToForm}
                    style={{ color: 'var(--orange)', fontWeight: 700 }}
                  >
                    ➕ Ajouter un livrable
                  </button>
                </div>

                <div className="space-y-8" style={{ maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}>
                  {(editingCdc.livrables || []).length === 0 ? (
                    <div className="text-center py-12 text-xs text-muted bg-gray-50 rounded">
                      Aucun livrable. Cliquez sur « Ajouter un livrable » pour en créer.
                    </div>
                  ) : (
                    editingCdc.livrables.map((liv, idx) => (
                      <div key={liv.id || idx} className="p-10 rounded border" style={{ background: '#fff', borderColor: '#e8e8e8', borderRadius: 6 }}>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          <div className="sm:col-span-4">
                            <input 
                              type="text" 
                              className="form-input text-xs" 
                              placeholder="Titre du livrable *"
                              value={liv.titre}
                              onChange={e => handleUpdateLivrableInForm(idx, 'titre', e.target.value)}
                              required
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <select 
                              className="form-input text-xs" 
                              value={liv.type}
                              onChange={e => handleUpdateLivrableInForm(idx, 'type', e.target.value)}
                            >
                              {LIVRABLE_TYPES.map(t => (
                                <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-3">
                            <input 
                              type="date" 
                              className="form-input text-xs" 
                              value={liv.deadline}
                              onChange={e => handleUpdateLivrableInForm(idx, 'deadline', e.target.value)}
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <select 
                              className="form-input text-xs" 
                              value={liv.statut}
                              onChange={e => handleUpdateLivrableInForm(idx, 'statut', e.target.value)}
                            >
                              {LIVRABLE_STATUTS.map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-1 text-right">
                            <button 
                              type="button" 
                              className="btn btn-ghost btn-sm p-1 text-xs"
                              onClick={() => handleRemoveLivrableFromForm(idx)}
                              title="Supprimer ce livrable"
                              style={{ color: 'var(--red)' }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            className="form-input text-[11px]" 
                            placeholder="Produit associé (ex: Forfait Pulse)"
                            value={liv.produit || ''}
                            onChange={e => handleUpdateLivrableInForm(idx, 'produit', e.target.value)}
                          />
                          <input 
                            type="text" 
                            className="form-input text-[11px]" 
                            placeholder="Consignes / CTA spécifiques (ex: Format vertical 9:16)"
                            value={liv.guidelines || ''}
                            onChange={e => handleUpdateLivrableInForm(idx, 'guidelines', e.target.value)}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Boutons d'action du modal */}
              <div className="flex justify-end gap-3 pt-12 border-t" style={{ borderColor: '#eee' }}>
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => setShowCdcModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-orange font-bold px-5"
                >
                  {editingCdc.id ? '💾 Enregistrer les modifications' : '✨ Créer le cahier des charges'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: AJOUT / MODIFICATION D'UN LIVRABLE DIRECT ─── */}
      {showLivrableModal && (
        <div className="inf-modal-overlay" onClick={() => setShowLivrableModal(null)}>
          <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <button className="inf-modal-close" onClick={() => setShowLivrableModal(null)}>✕</button>

            <h3 className="text-lg font-bold text-dark mb-4">
              {showLivrableModal.livrable.id ? '✏️ Modifier le livrable' : '➕ Ajouter un livrable'}
            </h3>
            <p className="text-xs text-muted mb-16">
              Campagne : <strong>{showLivrableModal.campagneNom}</strong>
            </p>

            <form onSubmit={handleSaveLivrableDirect}>
              <div className="inf-edit-grid mb-16">
                <div className="inf-edit-full">
                  <label className="form-label text-xs font-bold">Titre du livrable *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Story unboxing & présentation offre"
                    value={showLivrableModal.livrable.titre}
                    onChange={e => setShowLivrableModal(prev => ({
                      ...prev,
                      livrable: { ...prev.livrable, titre: e.target.value }
                    }))}
                    required
                  />
                </div>

                <div>
                  <label className="form-label text-xs font-bold">Format / Type</label>
                  <select 
                    className="form-input" 
                    value={showLivrableModal.livrable.type}
                    onChange={e => setShowLivrableModal(prev => ({
                      ...prev,
                      livrable: { ...prev.livrable, type: e.target.value }
                    }))}
                  >
                    {LIVRABLE_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs font-bold">Deadline de livraison *</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={showLivrableModal.livrable.deadline}
                    onChange={e => setShowLivrableModal(prev => ({
                      ...prev,
                      livrable: { ...prev.livrable, deadline: e.target.value }
                    }))}
                    required
                  />
                </div>

                <div>
                  <label className="form-label text-xs font-bold">Statut</label>
                  <select 
                    className="form-input" 
                    value={showLivrableModal.livrable.statut}
                    onChange={e => setShowLivrableModal(prev => ({
                      ...prev,
                      livrable: { ...prev.livrable, statut: e.target.value }
                    }))}
                  >
                    {LIVRABLE_STATUTS.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs font-bold">Produit ciblé</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Orange Money"
                    value={showLivrableModal.livrable.produit || ''}
                    onChange={e => setShowLivrableModal(prev => ({
                      ...prev,
                      livrable: { ...prev.livrable, produit: e.target.value }
                    }))}
                  />
                </div>

                <div className="inf-edit-full">
                  <label className="form-label text-xs font-bold">Consignes & Guidelines spécifiques</label>
                  <textarea 
                    className="form-input" 
                    rows={3} 
                    placeholder="Précisez le message clé, le format technique, le CTA..."
                    value={showLivrableModal.livrable.guidelines || ''}
                    onChange={e => setShowLivrableModal(prev => ({
                      ...prev,
                      livrable: { ...prev.livrable, guidelines: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-12 border-t" style={{ borderColor: '#eee' }}>
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => setShowLivrableModal(null)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-orange font-bold px-5"
                >
                  {showLivrableModal.livrable.id ? '💾 Enregistrer' : '➕ Ajouter le livrable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: GUIDELINES DE MARQUE ─── */}
      {showGuidelinesModal && (
        <div className="inf-modal-overlay" onClick={() => setShowGuidelinesModal(null)}>
          <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <button className="inf-modal-close" onClick={() => setShowGuidelinesModal(null)}>✕</button>
            <h3 className="text-lg font-bold text-dark mb-16 flex items-center gap-2">
              <span>📖</span> Guidelines de marque
            </h3>
            <p className="text-sm text-muted mb-12">
              Campagne : <strong>{showGuidelinesModal.campagneNom}</strong> — @{showGuidelinesModal.influencerName}
            </p>

            <div className="inf-overview-grid" style={{ gap: 12 }}>
              <div className="inf-ov-card">
                <div className="inf-ov-label">TON DE COMMUNICATION</div>
                <p className="text-sm font-medium">{showGuidelinesModal.guidelineMarque?.ton || '—'}</p>
              </div>
              <div className="inf-ov-card">
                <div className="inf-ov-label">VISUELS & CHARTE</div>
                <p className="text-sm font-medium">{showGuidelinesModal.guidelineMarque?.visuels || '—'}</p>
              </div>
              <div className="inf-ov-card">
                <div className="inf-ov-label">HASHTAGS OBLIGATOIRES</div>
                <div className="flex gap-4 flex-wrap mt-4">
                  {(showGuidelinesModal.guidelineMarque?.hashtags || []).map((h, i) => (
                    <span key={i} className="tag" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)', fontSize: 11, fontWeight: 700 }}>
                      {h}
                    </span>
                  ))}
                  {(!showGuidelinesModal.guidelineMarque?.hashtags || showGuidelinesModal.guidelineMarque.hashtags.length === 0) && (
                    <span className="text-xs text-muted">Aucun</span>
                  )}
                </div>
              </div>
              <div className="inf-ov-card">
                <div className="inf-ov-label">MENTIONS OBLIGATOIRES</div>
                <div className="flex gap-4 flex-wrap mt-4">
                  {(showGuidelinesModal.guidelineMarque?.mentions || []).map((m, i) => (
                    <span key={i} className="tag" style={{ background: 'rgba(41,128,185,0.1)', color: 'var(--blue)', fontSize: 11, fontWeight: 700 }}>
                      {m}
                    </span>
                  ))}
                  {(!showGuidelinesModal.guidelineMarque?.mentions || showGuidelinesModal.guidelineMarque.mentions.length === 0) && (
                    <span className="text-xs text-muted">Aucune</span>
                  )}
                </div>
              </div>
              <div className="inf-ov-card" style={{ gridColumn: '1 / -1' }}>
                <div className="inf-ov-label">PRODUITS / SERVICES À PROMOUVOIR</div>
                <div className="flex gap-4 flex-wrap mt-4">
                  {(showGuidelinesModal.produits || []).map((p, i) => (
                    <span key={i} className="tag" style={{ background: 'rgba(39,174,96,0.1)', color: 'var(--green)', fontSize: 11, fontWeight: 700 }}>
                      🏷️ {p}
                    </span>
                  ))}
                  {(!showGuidelinesModal.produits || showGuidelinesModal.produits.length === 0) && (
                    <span className="text-xs text-muted">Aucun produit renseigné</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-16 pt-12 border-t" style={{ borderColor: '#eee' }}>
              <button 
                className="btn btn-ghost btn-sm text-blue"
                onClick={() => {
                  const cdcToEdit = showGuidelinesModal;
                  setShowGuidelinesModal(null);
                  handleOpenEdit(cdcToEdit);
                }}
                style={{ color: 'var(--blue)', fontWeight: 600 }}
              >
                ✏️ Modifier les guidelines
              </button>
              <button className="btn btn-ghost" onClick={() => setShowGuidelinesModal(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

