// Seed data for the Client View of Traffic Manager (Conforme au Cahier des Charges Septembre 2026)
// Plateforme Bridge — Espace Client Partagé Orange Cameroun × McCann Douala

export const CLIENT_ENTITIES = [
  { id: 'all', label: 'Toutes les Entités', icon: '🏢' },
  { id: 'orange_cameroun', label: 'Orange Cameroun (Telco)', icon: '🟠' },
  { id: 'orange_money', label: 'Orange Money (OM)', icon: '💳' },
  { id: 'orange_business', label: 'Orange Business (B2B)', icon: '💼' },
  { id: 'orange_pulse', label: 'Orange Pulse (Jeunes)', icon: '⚡' },
];

export const CLIENT_UNIVERSES = [
  { id: 'all', label: 'Tous les Univers' },
  { id: 'social_media', label: 'Social Media', icon: '📱' },
  { id: 'paid_media', label: 'Paid Media', icon: '🎯' },
  { id: 'brand', label: 'Brand & Image', icon: '🌟' },
  { id: 'crm', label: 'CRM & Fidélisation', icon: '📬' },
  { id: 'influence', label: 'Influence & Talents', icon: '✨' },
  { id: 'digital_ux', label: 'Digital / UX', icon: '💻' },
  { id: 'b2b', label: 'B2B & Corporate', icon: '🤝' },
];

export const CLIENT_PERIODS = [
  { id: 's38_2026', label: 'Semaine S38 (14 au 20 Sept. 2026)' },
  { id: 's39_2026', label: 'Semaine S39 (21 au 27 Sept. 2026)' },
  { id: 'month_09_2026', label: 'Mois Septembre 2026' },
  { id: 'camp_pulse', label: 'Campagne Lions4Life & Pulse' },
  { id: 'custom', label: 'Période Personnalisée...' },
];

// Les 8 Statuts Client officiels du cahier des charges (Page 2 & 3)
export const CLIENT_STATUSES = [
  {
    id: 'nouvelle_demande',
    label: 'Nouvelle demande reçue',
    shortLabel: 'Demande reçue',
    step: 1,
    color: '#78909C',
    bg: '#ECEFF1',
    operationalEquiv: 'Backlog / qualification',
    clientMeaning: 'La demande a été prise en compte ; McCann analyse le besoin.',
    icon: '📥',
  },
  {
    id: 'cadrage',
    label: 'Cadrage en cours',
    shortLabel: 'Cadrage',
    step: 2,
    color: '#5C6BC0',
    bg: '#E8EAF6',
    operationalEquiv: 'Estimation et clarification',
    clientMeaning: 'Les objectifs, livrables, calendrier et prérequis sont en cours de consolidation.',
    icon: '📐',
  },
  {
    id: 'planifie',
    label: 'Planifié',
    shortLabel: 'Planifié',
    step: 3,
    color: '#00ACC1',
    bg: '#E0F7FA',
    operationalEquiv: 'Prêt à produire / priorisé',
    clientMeaning: 'Le travail est validé et intégré au planning agence.',
    icon: '📅',
  },
  {
    id: 'production',
    label: 'En production',
    shortLabel: 'Production',
    step: 4,
    color: '#FF7900',
    bg: '#FFF3E0',
    operationalEquiv: 'Production créative, média ou contenu',
    clientMeaning: 'L’agence est en cours d’exécution.',
    icon: '⚙️',
  },
  {
    id: 'revue_interne',
    label: 'Revue interne',
    shortLabel: 'Revue interne',
    step: 5,
    color: '#8E24AA',
    bg: '#F3E5F5',
    operationalEquiv: 'QA créative, technique ou stratégique',
    clientMeaning: 'Contrôles qualité McCann en cours avant partage.',
    icon: '🔍',
  },
  {
    id: 'a_valider',
    label: 'À valider par Orange',
    shortLabel: 'À valider',
    step: 6,
    color: '#1E88E5',
    bg: '#E3F2FD',
    operationalEquiv: 'Validation client',
    clientMeaning: 'Une action précise est attendue du client.',
    icon: '⚡',
  },
  {
    id: 'ajustements',
    label: 'Ajustements en cours',
    shortLabel: 'Ajustements',
    step: 7,
    color: '#E65100',
    bg: '#FBE9E7',
    operationalEquiv: 'Révisions',
    clientMeaning: 'Les retours reçus sont intégrés.',
    icon: '🔄',
  },
  {
    id: 'livre',
    label: 'Livré / publié',
    shortLabel: 'Livré / publié',
    step: 8,
    color: '#2E7D32',
    bg: '#E8F5E9',
    operationalEquiv: 'Livrable final, mise en ligne ou campagne lancée',
    clientMeaning: 'Le sujet est clôturé ou entre en phase de suivi.',
    icon: '✅',
  },
];

// Rôles et droits Client (Cahier des charges Page 7)
export const CLIENT_ROLES = [
  {
    id: 'valideur_orange',
    label: 'Valideur Orange',
    badge: 'Décisionnel',
    desc: 'Approuve/refuse les créas, les calendriers, les recommandations et les livrables finaux.',
    icon: '🛡️',
    permissions: ['Approuver/Refuser livrables', 'Arbitrer recommandations', 'Valider plannings', 'Créer des briefs'],
  },
  {
    id: 'contributeur_orange',
    label: 'Contributeur Orange',
    badge: 'Opérationnel',
    desc: 'Crée une demande, ajoute des documents de référence, commente et répond aux questions de cadrage.',
    icon: '✍️',
    permissions: ['Créer des briefs', 'Déposer assets/fichiers', 'Commenter les travaux', 'Consulter le calendrier'],
  },
  {
    id: 'lecteur_orange',
    label: 'Lecteur Orange',
    badge: 'Consultation',
    desc: 'Consulte les travaux, calendriers, livrables, recommandations et statuts sans pouvoir d’approbation.',
    icon: '👁️',
    permissions: ['Consulter les travaux', 'Consulter les calendriers', 'Télécharger les bilans'],
  },
  {
    id: 'traffic_mccann',
    label: 'Traffic Manager McCann',
    badge: 'Agence Lead',
    desc: 'Qualifie, priorise, planifie, coordonne et publie les informations destinées au client.',
    icon: '🚦',
    permissions: ['Supervision globale', 'Mise à jour des statuts', 'Partage des livrables', 'Gestion des risques'],
  },
];

// Données initiales des Travaux en Cours (Cahier des charges Page 2 & 3)
export const INITIAL_CLIENT_DOSSIERS = [];

// Les 6 KPI de pilotage pour le Cockpit Client (Page 2)
export const CLIENT_PILOTAGE_KPIS = [
  {
    id: 'travaux_actifs',
    title: 'TRAVAUX ACTIFS',
    value: 0,
    unit: 'dossiers',
    subtitle: 'Demandes prises en charge',
    trend: 'Temps réel',
    trendPositive: true,
    tag: 'Activité en cours',
    tagClass: 'tag-orange',
    icon: '⚙️',
    color: '#FF7900',
    interet: 'Mesurer l’activité en cours',
  },
  {
    id: 'a_valider_orange',
    title: 'À VALIDER PAR ORANGE',
    value: 0,
    unit: 'actions',
    subtitle: 'Feedbacks ou validations requis',
    trend: 'À jour',
    trendPositive: true,
    tag: 'Décision requise',
    tagClass: 'tag-blue',
    icon: '⚡',
    color: '#1E88E5',
    interet: 'Réduire les retards de décision',
  },
  {
    id: 'jalons_semaine',
    title: 'JALONS DE LA SEMAINE',
    value: 0,
    unit: 'échéances',
    subtitle: 'Livrables, lancements & réunions',
    trend: '0 planifié',
    trendPositive: true,
    tag: 'Planning',
    tagClass: 'tag-purple',
    icon: '📅',
    color: '#8E24AA',
    interet: 'Anticiper les échéances',
  },
  {
    id: 'a_risque',
    title: 'POINTS DE VIGILANCE',
    value: 0,
    unit: 'à risque',
    subtitle: 'Risque de décalage identifié',
    trend: 'Aucun risque',
    trendPositive: true,
    tag: 'Alerte délai',
    tagClass: 'tag-yellow',
    icon: '⚠️',
    color: '#E65100',
    interet: 'Permettre l’arbitrage tôt',
  },
  {
    id: 'livrables_remis',
    title: 'LIVRABLES REMIS',
    value: 0,
    unit: 'documents',
    subtitle: 'Créas, bilans & plannings déposés',
    trend: 'À jour',
    trendPositive: true,
    tag: 'Visibilité réelle',
    tagClass: 'tag-green',
    icon: '📁',
    color: '#2E7D32',
    interet: 'Donner de la visibilité sur l’avancement réel',
  },
  {
    id: 'recommandations_arbitrer',
    title: 'RECOMMANDATIONS À DÉCIDER',
    value: 0,
    unit: 'propositions',
    subtitle: 'Innovations & opportunités prêtes',
    trend: '0 en attente',
    trendPositive: true,
    tag: 'Go / No-go',
    tagClass: 'tag-purple',
    icon: '💡',
    color: '#6A1B9A',
    interet: 'Faire vivre la proactivité de l’agence',
  },
];

// Centre de validation client : « Actions attendues de votre part » (Page 5)
export const INITIAL_CLIENT_VALIDATIONS = [];

// Registre des Recommandations Digitales McCann (Page 4)
export const INITIAL_CLIENT_RECOMMENDATIONS = [];

// Calendrier Partagé : Publications, Média & Temps Forts (Page 3 & 4)
export const INITIAL_CLIENT_CALENDAR_ITEMS = [];

// Conflits de calendrier détectés automatiquement (Page 4)
export const CALENDAR_CONFLICT_ALERTS = [];

// Bibliothèque des Livrables et Bilans (Page 6)
export const INITIAL_CLIENT_LIVRABLES = [];

// Historique et Gouvernance : Timeline & Compte-rendus (Page 7)
export const INITIAL_CLIENT_GOVERNANCE_EVENTS = [];
