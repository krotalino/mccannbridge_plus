/**
 * Utilitaires pour extraire, normaliser et manipuler les livrables
 * et cahiers des charges associés au profil d'un influenceur.
 */

export const DELIVERABLE_STATUS_CONFIG = {
  a_faire: { label: 'À faire', color: '#8C8C8C', bg: 'rgba(140, 140, 140, 0.12)', defaultProgress: 0 },
  en_cours: { label: 'En cours', color: '#2980B9', bg: 'rgba(41, 128, 185, 0.12)', defaultProgress: 45 },
  livre: { label: 'Livré / Soumis', color: '#E67E22', bg: 'rgba(230, 126, 34, 0.12)', defaultProgress: 85 },
  valide: { label: 'Validé ✓', color: '#27AE60', bg: 'rgba(39, 174, 96, 0.12)', defaultProgress: 100 },
  en_retard: { label: 'En retard ⚠️', color: '#E74C3C', bg: 'rgba(231, 76, 60, 0.12)', defaultProgress: 30 }
};

export const DELIVERABLE_TYPES = [
  { id: 'story', label: 'Story Instagram / Facebook', icon: '📱' },
  { id: 'video', label: 'Vidéo YouTube / Long format', icon: '🎬' },
  { id: 'reel', label: 'Reel Instagram / TikTok', icon: '🎵' },
  { id: 'post', label: 'Post Image / Carrousel', icon: '📸' },
  { id: 'live', label: 'Live Stream Événementiel', icon: '🔴' },
  { id: 'autre', label: 'Autre Livrable Spécifique', icon: '📄' }
];

export function getDeliverableTypeLabel(type) {
  const found = DELIVERABLE_TYPES.find(t => t.id === type);
  return found ? found.label : (type || 'Livrable');
}

export function getDeliverableTypeIcon(type) {
  const found = DELIVERABLE_TYPES.find(t => t.id === type);
  return found ? found.icon : '📄';
}

/**
 * Récupère tous les cahiers des charges et livrables d'un influenceur avec normalisation
 */
export function getInfluencerCdcAndDeliverables(influencer) {
  if (!influencer) return { activeCdc: null, allCdc: [], activeDeliverables: [], stats: { total: 0, valides: 0, enCours: 0, enRetard: 0, globalProgress: 0 } };

  const cdcList = Array.isArray(influencer.cahierDesCharges) && influencer.cahierDesCharges.length > 0
    ? influencer.cahierDesCharges
    : [
        {
          id: 'CDC-001',
          campagneId: 'CP-2026-04',
          campagneNom: influencer.lastCampaign || 'Orange Weekend Avril',
          dateDebut: '2026-04-01',
          dateFin: '2026-04-30',
          objectifs: 'Accroître la notoriété des offres week-end, générer du trafic en boutique et stimuler les téléchargements My Orange.',
          contraintes: 'Respect strict de la charte graphique Orange Cameroun, pas de marque concurrente, affichage obligatoire des mentions légales et sticker de lien.',
          guidelineMarque: {
            ton: 'Enthousiaste, dynamique, jeune et accessible',
            visuels: 'Couleurs officielles Orange (#FF7900), contrastes maîtrisés, logo visible dès les 3 premières secondes',
            hashtags: ['#OrangeCameroun', '#OrangeWeekend', '#PulseOrange'],
            mentions: ['@OrangeCameroun']
          },
          produits: ['Forfait Orange Weekend', 'Orange Money'],
          livrables: [
            {
              id: 'LIV-001',
              titre: 'Story teaser de lancement avec sticker de redirection',
              type: 'story',
              deadline: '2026-04-08',
              statut: 'livre',
              avancement: 85,
              description: 'Séquence de 3 stories dynamiques présentant l\'offre Orange Weekend avec code promo exclusif.',
              lienPublication: 'https://instagram.com/stories/highlights/1789234892/',
              commentaires: 'Brouillon soumis à validation. Visuel conforme à la charte McCann.',
              produit: 'Forfait Orange Weekend'
            },
            {
              id: 'LIV-002',
              titre: 'Reel Instagram & TikTok démonstration et cas d\'usage',
              type: 'reel',
              deadline: '2026-04-14',
              statut: 'en_cours',
              avancement: 50,
              description: 'Vidéo verticale de 30-45s illustrant l\'achat du pass week-end via Orange Money.',
              lienPublication: '',
              commentaires: 'Tournage prévu le 10 avril au campus de Douala. En attente de validation du script.',
              produit: 'Orange Money'
            },
            {
              id: 'LIV-003',
              titre: 'Post carrousel récapitulatif des avantages & concours',
              type: 'post',
              deadline: '2026-04-22',
              statut: 'a_faire',
              avancement: 10,
              description: 'Publication de 4 slides pédagogiques résumant les offres avec jeu concours Orange.',
              lienPublication: '',
              commentaires: 'Éléments visuels transmis par l\'agence McCann.',
              produit: 'Forfait Orange Weekend'
            }
          ]
        }
      ];

  // Enrichir chaque livrable avec des valeurs calculées
  const allDeliverables = [];

  const enrichedCdc = cdcList.map((cdc, cdcIdx) => {
    const defaultDateDebut = cdc.dateDebut || '2026-04-01';
    const defaultDateFin = cdc.dateFin || '2026-04-30';
    const defaultObjectifs = cdc.objectifs || 'Générer de la visibilité sur les offres Orange, stimuler l\'engagement de la communauté cible et amplifier le message de marque.';
    const defaultContraintes = cdc.contraintes || 'Respect strict de la charte visuelle Orange Cameroun, validation préalable de l\'équipe McCann avant diffusion, exclusion de toute marque télécom concurrente.';

    const rawLivrables = Array.isArray(cdc.livrables) && cdc.livrables.length > 0
      ? cdc.livrables
      : (Array.isArray(influencer.pendingDeliverables) && influencer.pendingDeliverables.length > 0
          ? influencer.pendingDeliverables.map((pd, pidx) => ({
              id: `LIV-${pidx + 1}`,
              titre: pd.title || `Livrable #${pidx + 1}`,
              type: 'story',
              deadline: pd.deadline || '2026-04-15',
              statut: pd.status === 'valide' ? 'valide' : (pd.status?.includes('soumis') ? 'livre' : 'en_cours'),
              avancement: pd.status === 'valide' ? 100 : 60,
              description: 'Livrable contractuel issu du cahier des charges officiel',
              lienPublication: '',
              commentaires: ''
            }))
          : []
        );

    const enrichedLivrables = rawLivrables.map((liv, lIdx) => {
      const isLate = liv.deadline ? new Date(liv.deadline) < new Date() && liv.statut !== 'valide' : false;
      const statut = isLate ? 'en_retard' : (liv.statut || 'en_cours');
      const avancement = typeof liv.avancement === 'number' 
        ? liv.avancement 
        : (DELIVERABLE_STATUS_CONFIG[statut]?.defaultProgress ?? 50);

      const item = {
        ...liv,
        id: liv.id || `LIV-${cdcIdx}-${lIdx + 1}`,
        titre: liv.titre || liv.title || `Livrable #${lIdx + 1}`,
        type: liv.type || 'story',
        deadline: liv.deadline || '2026-04-15',
        statut,
        avancement,
        description: liv.description || liv.guidelines || 'Contenu contractuel conforme au brief de campagne',
        lienPublication: liv.lienPublication || liv.url || '',
        commentaires: liv.commentaires || liv.commentaire || '',
        cdcId: cdc.id || `CDC-${cdcIdx + 1}`,
        campagneNom: cdc.campagneNom || influencer.lastCampaign || 'Campagne Orange'
      };

      allDeliverables.push(item);
      return item;
    });

    return {
      ...cdc,
      id: cdc.id || `CDC-00${cdcIdx + 1}`,
      campagneNom: cdc.campagneNom || influencer.lastCampaign || 'Campagne Orange Cameroun',
      dateDebut: defaultDateDebut,
      dateFin: defaultDateFin,
      objectifs: defaultObjectifs,
      contraintes: defaultContraintes,
      guidelineMarque: {
        ton: cdc.guidelineMarque?.ton || 'Enthousiaste, dynamique et jeune',
        visuels: cdc.guidelineMarque?.visuels || 'Charte Orange Cameroun (#FF7900)',
        hashtags: Array.isArray(cdc.guidelineMarque?.hashtags) && cdc.guidelineMarque.hashtags.length > 0
          ? cdc.guidelineMarque.hashtags
          : ['#OrangeCameroun', '#PulseOrange'],
        mentions: Array.isArray(cdc.guidelineMarque?.mentions) && cdc.guidelineMarque.mentions.length > 0
          ? cdc.guidelineMarque.mentions
          : ['@OrangeCameroun']
      },
      produits: Array.isArray(cdc.produits) ? cdc.produits : ['Orange Cameroun'],
      livrables: enrichedLivrables
    };
  });

  // Calcul des statistiques globales
  const total = allDeliverables.length;
  const valides = allDeliverables.filter(d => d.statut === 'valide').length;
  const livres = allDeliverables.filter(d => d.statut === 'livre').length;
  const enCours = allDeliverables.filter(d => d.statut === 'en_cours' || d.statut === 'a_faire').length;
  const enRetard = allDeliverables.filter(d => d.statut === 'en_retard').length;
  const globalProgress = total > 0
    ? Math.round(allDeliverables.reduce((acc, d) => acc + (d.avancement || 0), 0) / total)
    : 0;

  return {
    activeCdc: enrichedCdc[0] || null,
    allCdc: enrichedCdc,
    activeDeliverables: allDeliverables,
    stats: {
      total,
      valides,
      livres,
      enCours,
      enRetard,
      globalProgress
    }
  };
}
