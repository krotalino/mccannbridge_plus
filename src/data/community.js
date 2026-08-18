export const CM_DATA = {
  // KPIs temps réel
  kpis: {
    postsAValider: 12,
    postsAValiderDelta: '↑ 3 vs hier',
    postsProgrammes: 48,
    postsProgrammesDelta: '↑ 8 vs semaine dernière',
    campagnesSponsoActives: 5,
    campagnesDelta: '↓ 1 vs hier',
    engagementRate: 4.2,
    engagementDelta: '↑ 0.3pts vs hier',
  },

  // Workflow recommandé (6 étapes)
  workflow: [
    { id: 1, label: 'Prévoir', sub: 'Planning & priorités', icon: '📅', active: true },
    { id: 2, label: 'Produire', sub: 'Créer / adapter', icon: '🔥', active: false },
    { id: 3, label: 'Valider', sub: 'Soumettre & corriger', icon: '✅', active: false },
    { id: 4, label: 'Publier', sub: 'Programmer', icon: '🚀', active: false },
    { id: 5, label: 'Engager', sub: 'Animer la communauté', icon: '💬', active: false },
    { id: 6, label: 'Mesurer', sub: 'KPIs & rapports', icon: '📊', active: false },
  ],

  // Briefs & Priorités du jour
  briefs: [
    { id: 1, title: 'Campagne lancement produit X', source: 'Chef de projet A', priority: 'haute', deadline: 'Livraison avant 14h' },
    { id: 2, title: 'Réactivité crise réseau', source: 'Direction Com', priority: 'urgent', deadline: 'Réponse communauté' },
    { id: 3, title: 'Calendrier Mai — volet 2', source: 'Planning éditorial', priority: 'normale', deadline: '12 posts à produire' },
  ],

  // Planning éditorial semaine
  planning: {
    semaine: 19,
    mois: 'Mai 2026',
    debut: '5',
    fin: '11',
    jours: [
      { label: 'L', num: 5, posts: [{ statut: 'programme' }] },
      { label: 'M', num: 6, posts: [{ statut: 'programme' }, { statut: 'publie' }] },
      { label: 'M', num: 7, posts: [{ statut: 'publie' }] },
      { label: 'J', num: 8, posts: [{ statut: 'a_corriger' }] },
      { label: 'V', num: 9, posts: [{ statut: 'programme' }, { statut: 'programme' }] },
      { label: 'S', num: 10, posts: [] },
      { label: 'D', num: 11, posts: [{ statut: 'programme' }] },
    ],
  },

  // Calendrier Avancé (Nouveau Module)
  advancedCalendar: {
    clients: ['Orange Telco', 'Orange Money', 'Orange Business', 'Orange LinkedIn', 'Orange Digital Center', 'Orange WhatssApp', 'Max it', 'Site web'],
    types: ['Feed', 'Réels et Story', 'Carrousel'],
    formats: ['Portraits', 'Paysage'],
    canaux: ['Facebook', 'Instagram', 'LinkedIn', 'X', 'TikTok', 'Chaine WhatsApp'],
    posts: [
      { id: 1, client: 'Orange Telco', canal: 'Facebook', type: 'Feed', format: 'Paysage', time: '10:00', status: 'PUBLISHED', title: 'Facebook published local highlight', generation: 'Manual', desc: 'A published Facebook image sample post so the calendar feels active instead of empty.', day: 17, image: 'https://placehold.co/100x100/f39c12/white?text=FB' },
      { id: 2, client: 'Orange Money', canal: 'Instagram', type: 'Feed', format: 'Portraits', time: '09:05', status: 'PUBLISHED', title: 'Instagram published update', generation: 'Manual', desc: 'A published Instagram image sample post so the calendar feels active instead of empty.', day: 18, image: 'https://placehold.co/100x100/9b59b6/white?text=IG' },
      { id: 3, client: 'Orange Business', canal: 'Instagram', type: 'Carrousel', format: 'Portraits', time: '10:00', status: 'PENDING', title: 'Instagram queued promo', generation: 'Manual', desc: 'Queued Instagram text-only content prepared for an upcoming slot in the next few days.', day: 19, image: null },
      { id: 4, client: 'Orange Digital Center', canal: 'X', type: 'Feed', format: 'Paysage', time: '08:30', status: 'PENDING', title: 'X queued campaign', generation: 'Manual', desc: 'Queued X image content prepared for an upcoming slot in the next few days.', day: 20, image: 'https://placehold.co/100x100/34495e/white?text=X' },
      { id: 5, client: 'Max it', canal: 'Facebook', type: 'Carrousel', format: 'Paysage', time: '09:00', status: 'PENDING', title: 'Facebook queued product teaser', generation: 'Manual', desc: 'Queued Facebook image content prepared for an upcoming slot in the next few days.', day: 21, image: 'https://placehold.co/100x100/2980b9/white?text=FB' },
      { id: 6, client: 'Orange Telco', canal: 'Instagram', type: 'Réels et Story', format: 'Portraits', time: '13:15', status: 'PUBLISHED', title: 'AI Instagram published recap', generation: 'AI', desc: 'AI-generated Instagram post already published to show a completed automation result.', day: 17, image: 'https://placehold.co/100x100/111111/ffffff?text=AI' },
      { id: 7, client: 'Site web', canal: 'Facebook', type: 'Feed', format: 'Paysage', time: '11:30', status: 'PENDING', title: 'AI Facebook queued idea', generation: 'AI', desc: 'AI-generated Facebook preview copy queued for automatic publishing.', day: 21, image: 'https://placehold.co/100x100/ecf0f1/333333?text=Web' },
    ]
  },


  // Statuts clés sur les actions en cours
  statuts: [
    { label: 'Brouillon', count: 8, color: '#8C8C8C' },
    { label: 'En Validation', count: 5, color: '#F39C12' },
    { label: 'À Corriger', count: 3, color: '#E74C3C' },
    { label: 'Validé', count: 12, color: '#27AE60' },
    { label: 'Programmé', count: 24, color: '#2980B9' },
    { label: 'Publié', count: 156, color: '#8E44AD' },
    { label: 'En Analyse', count: 7, color: '#E67E22' },
    { label: 'Archive', count: 412, color: '#95A5A6' },
  ],

  // Création / Adaptation par plateforme
  plateformes: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter/X'],
  posts: [
    { id: 1, title: 'Carousel produit mai', plateforme: 'Instagram', format: 'Carrousel', statut: 'Brouillon', action: 'Éditer' },
    { id: 2, title: 'Vidéo tuto #FastTips', plateforme: 'TikTok', format: 'Reels', statut: 'À corriger', action: 'Corriger' },
    { id: 3, title: 'Post annonce partenariat', plateforme: 'LinkedIn', format: 'Image', statut: 'Validé', action: 'Programmer' },
    { id: 4, title: 'Thread récap événement', plateforme: 'Twitter/X', format: 'Thread', statut: 'En validation', action: 'Relancer' },
    { id: 5, title: 'Story coulisses bureau', plateforme: 'Instagram', format: 'Story', statut: 'Brouillon', action: 'Éditer' },
    { id: 6, title: 'Infographie Q2 results', plateforme: 'LinkedIn', format: 'Image', statut: 'Validé', action: 'Programmer' },
    { id: 7, title: 'Reel tendance challenge', plateforme: 'TikTok', format: 'Reels', statut: 'Brouillon', action: 'Éditer' },
    { id: 8, title: 'Post promo flash', plateforme: 'Facebook', format: 'Image', statut: 'Programmé', action: 'Voir' },
  ],

  // Circuit de validation
  validation: {
    etapes: [
      { num: 1, title: 'Soumission au validateur', desc: 'Envoyer les posts prêts vers le Chef de projet pour relecture.', action: 'Soumettre' },
      { num: 2, title: 'Retours & corrections', desc: 'Intégrer les feedbacks, ajuster le copy et les visuels.', action: 'Voir retours (2)' },
      { num: 3, title: 'Programmation', desc: 'Planifier la publication aux créneaux optimaux par plateforme.', action: 'Programmer' },
    ],
    fileAttente: {
      copywriting: { valides: 7, total: 10 },
      visuels: { valides: 4, total: 10 },
    },
  },

  // Pilotage Sponsoring
  sponsoring: {
    budgetMensuel: 5000000,
    budgetConsomme: 3100000,
    pctConsomme: 62,
    campagnes: [
      { name: 'Lancement Mai', plateforme: 'Facebook', statut: 'En cours' },
      { name: 'Retargeting visiteurs', plateforme: 'Instagram', statut: 'En cours' },
      { name: 'Top funnel pros', plateforme: 'LinkedIn', statut: 'Ajustements' },
    ],
  },

  // Mesure & Communauté
  engagement: {
    semaine: [
      { jour: 'Lun', value: 320 },
      { jour: 'Mar', value: 480 },
      { jour: 'Mer', value: 650 },
      { jour: 'Jeu', value: 890 },
      { jour: 'Ven', value: 720 },
      { jour: 'Sam', value: 380 },
      { jour: 'Dim', value: 290 },
    ],
    commentaires: 1240,
    partages: 8500,
    abonnes: 124,
  },

  // Rapport rapide
  rapport: {
    objectif: 'Workflow simple et traçable pour accélérer les validations et la publication multi-plateformes.',
    jauges: [
      { label: 'Taux validation', value: 84, color: '#FF7900' },
      { label: 'Respect planning', value: 92, color: '#27AE60' },
      { label: 'Temps moyen validation', value: 65, color: '#F39C12', display: '3h20' },
      { label: 'Sponsoring ROAS', value: 42, color: '#27AE60', display: '4.2x' },
    ],
  },
};
