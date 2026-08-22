export const CM_DATA = {
  // KPIs temps réel (valeurs de référence si aucune donnée)
  kpis: {
    postsAValider: 0,
    postsAValiderDelta: '0 en attente',
    postsProgrammes: 0,
    postsProgrammesDelta: '0 programmé',
    campagnesSponsoActives: 0,
    campagnesDelta: '0 active',
    engagementRate: 0,
    engagementDelta: '0%',
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

  // Briefs & Priorités
  briefs: [],

  // Planning éditorial semaine (structure vide de base)
  planning: {
    semaine: 1,
    mois: '',
    debut: '1',
    fin: '7',
    jours: [
      { label: 'L', num: 1, posts: [] },
      { label: 'M', num: 2, posts: [] },
      { label: 'M', num: 3, posts: [] },
      { label: 'J', num: 4, posts: [] },
      { label: 'V', num: 5, posts: [] },
      { label: 'S', num: 6, posts: [] },
      { label: 'D', num: 7, posts: [] },
    ],
  },

  // Calendrier Avancé
  advancedCalendar: {
    clients: ['Orange Telco', 'Orange Money', 'Orange Business', 'Orange LinkedIn', 'Orange Digital Center', 'Orange WhatssApp', 'Max it', 'Site web'],
    types: ['Feed', 'Réels et Story', 'Carrousel'],
    formats: ['Portraits', 'Paysage'],
    canaux: ['Facebook', 'Instagram', 'LinkedIn', 'X', 'TikTok', 'Chaine WhatsApp'],
    posts: []
  },

  // Statuts clés sur les actions en cours
  statuts: [
    { label: 'Brouillon', count: 0, color: '#8C8C8C' },
    { label: 'En Validation', count: 0, color: '#F39C12' },
    { label: 'À Corriger', count: 0, color: '#E74C3C' },
    { label: 'Validé', count: 0, color: '#27AE60' },
    { label: 'Programmé', count: 0, color: '#2980B9' },
    { label: 'Publié', count: 0, color: '#8E44AD' },
    { label: 'En Analyse', count: 0, color: '#E67E22' },
    { label: 'Archive', count: 0, color: '#95A5A6' },
  ],

  // Création / Adaptation par plateforme
  plateformes: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter/X'],
  posts: [],

  // Circuit de validation
  validation: {
    etapes: [
      { num: 1, title: 'Soumission au validateur', desc: 'Envoyer les posts prêts vers le Chef de projet pour relecture.', action: 'Soumettre' },
      { num: 2, title: 'Retours & corrections', desc: 'Intégrer les feedbacks, ajuster le copy et les visuels.', action: 'Voir retours' },
      { num: 3, title: 'Programmation', desc: 'Planifier la publication aux créneaux optimaux par plateforme.', action: 'Programmer' },
    ],
    fileAttente: {
      copywriting: { valides: 0, total: 0 },
      visuels: { valides: 0, total: 0 },
    },
  },

  // Pilotage Sponsoring
  sponsoring: {
    budgetMensuel: 0,
    budgetConsomme: 0,
    pctConsomme: 0,
    campagnes: [],
  },

  // Mesure & Communauté
  engagement: {
    semaine: [
      { jour: 'Lun', value: 0 },
      { jour: 'Mar', value: 0 },
      { jour: 'Mer', value: 0 },
      { jour: 'Jeu', value: 0 },
      { jour: 'Ven', value: 0 },
      { jour: 'Sam', value: 0 },
      { jour: 'Dim', value: 0 },
    ],
    commentaires: 0,
    partages: 0,
    abonnes: 0,
  },

  // Rapport rapide
  rapport: {
    objectif: 'Workflow simple et traçable pour accélérer les validations et la publication multi-plateformes.',
    jauges: [
      { label: 'Taux validation', value: 0, color: '#FF7900' },
      { label: 'Respect planning', value: 0, color: '#27AE60' },
      { label: 'Temps moyen validation', value: 0, color: '#F39C12', display: '0h' },
      { label: 'Sponsoring ROAS', value: 0, color: '#27AE60', display: '0x' },
    ],
  },
};
