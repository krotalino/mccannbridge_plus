// Données réelles extraites des bilans hebdomadaires et des spécifications du cahier des charges
// Semaine S38 : Du 14 au 20 Septembre 2026 (vs Semaine S37 : Du 07 au 13 Septembre 2026)
// Périmètres : Orange Cameroun (Telco), Orange Money, Orange Business, Vue Consolidée

export const REPORTING_PERIODS = [
  { id: 's38_2026', label: 'Semaine S38 (14 au 20 Septembre 2026)', isCurrent: true, start: '2026-09-14', end: '2026-09-20', prevLabel: 'S37 (07 au 13 Sept)' },
  { id: 's37_2026', label: 'Semaine S37 (07 au 13 Septembre 2026)', isCurrent: false, start: '2026-09-07', end: '2026-09-13', prevLabel: 'S36 (31 Août au 06 Sept)' },
  { id: 'm09_2026', label: 'Mois de Septembre 2026 (M-T-D)', isCurrent: false, start: '2026-09-01', end: '2026-09-20', prevLabel: 'Mois d’Août 2026' },
  { id: 'q3_2026', label: '3e Trimestre 2026 (Q3)', isCurrent: false, start: '2026-07-01', end: '2026-09-20', prevLabel: '2e Trimestre 2026 (Q2)' },
  { id: 'custom', label: 'Période personnalisée...', isCurrent: false, start: '2026-09-14', end: '2026-09-20', prevLabel: 'Période précédente équivalente' }
];

export const BRAND_PERIMETERS = [
  { id: 'all', label: 'Vue Consolidée (360°)', shortName: 'Consolidé', badgeColor: '#FF7900' },
  { id: 'orange_telco', label: 'Orange Cameroun (Telco)', shortName: 'Telco', badgeColor: '#FF7900' },
  { id: 'orange_money', label: 'Orange Money (OM)', shortName: 'Money', badgeColor: '#00A859' },
  { id: 'orange_business', label: 'Orange Business (B2B)', shortName: 'Business', badgeColor: '#004F9F' }
];

export const DIFFUSION_TYPES = [
  { id: 'total', label: 'Total (Organique + Paid)' },
  { id: 'organic', label: 'Organique uniquement' },
  { id: 'paid', label: 'Sponsorisé / Paid Media' }
];

// Synthèse automatique validable « À retenir cette période »
export const PERIOD_SYNTHESIS = {
  all: {
    success: 'L’engagement progresse fortement sur Facebook (+62,8% sur Telco, +56,3% sur Orange Money) grâce aux activations participatives (Lions4Life, Best Deal, OM Fidélité). Les vues vidéo atteignent un record de 207 022 vues combinées.',
    vigilance: 'Recul marqué de la visibilité sur Orange Business (-58,2% d’impressions et engagements sur LinkedIn) et légère érosion habituelle de 279 abonnés sur la page Facebook Telco.',
    recommendation: 'Accélérer les formats vidéo courts (Reels, TikTok) et humaniser les prises de parole B2B avec des témoignages terrain et collaborateurs plutôt que des posts purement techniques.'
  },
  orange_telco: {
    success: 'Facebook enregistre une accélération majeure des interactions (27 496 vs 16 888, soit +62,8%) et des vues vidéo (+59,8%), portée par le soutien du sponsoring et les contenus participatifs.',
    vigilance: 'La portée reste quasi stable (+1,7%) malgré +30,3% de publications (43 posts vs 33), illustrant un palier de diffusion organique.',
    recommendation: 'Capitaliser sur l’engouement des Lions Indomptables (Lions4Life) pour convertir les interactions en souscriptions concrètes via l’application My Orange / Max it.'
  },
  orange_money: {
    success: 'Performance historique des vues vidéo (+965,1% avec 34 350 vues) et bond des interactions (+56,3%) avec pourtant 5 publications de moins qu’en S37.',
    vigilance: 'Forte dépendance aux activations ponctuelles (caravane OM Fidélité Ngaoundéré) qui doit être relayée par des rituels hebdomadaires pérennes.',
    recommendation: 'Poursuivre les quiz interactifs et les challenges de transferts régionaux qui surperforment MoMo de +1 686% en volume d’engagement.'
  },
  orange_business: {
    success: 'Taux d’engagement qualitatif maintenu à 1,53% sur LinkedIn avec un engagement moyen par post supérieur à MTN Business (17,3 vs 11,6).',
    vigilance: 'Baisse sensible des impressions (-58,2%) et volume d’interactions restreint (138 vs 330) sur LinkedIn, présence quasi inactive sur X (0 engagement sur 5 tweets).',
    recommendation: 'Activer la caisse de résonance des cadres et ambassadeurs internes (Employee Advocacy) pour doubler le reach organique des offres Cloud et Sécurité.'
  }
};

// 7 KPI Prioritaires pour le Cockpit exécutif
export const EXECUTIVE_KPIS = {
  all: [
    { id: 'reach', label: 'Portée / Individus atteints', value: '788 402', prevValue: '687 156', change: '+14,7%', isPositive: true, explication: 'Nombre d’individus uniques exposés aux publications de la marque' },
    { id: 'impressions', label: 'Impressions cumulées', value: '1 185 971', prevValue: '988 573', change: '+20,0%', isPositive: true, explication: 'Volume total d’affichages des contenus sur les fils d’actualité' },
    { id: 'engagements', label: 'Volume d’engagements', value: '41 813', prevValue: '26 289', change: '+59,1%', isPositive: true, explication: 'Réactions, commentaires, partages et clics sur tous les canaux' },
    { id: 'video_views', label: 'Consommation vidéo', value: '207 022', prevValue: '116 569', change: '+77,6%', isPositive: true, explication: 'Vues vidéo de plus de 3 secondes sur Facebook, YouTube et Reels' },
    { id: 'posts_count', label: 'Publications diffusées', value: '72', prevValue: '69', change: '+4,3%', isPositive: true, explication: 'Intensité éditoriale globale sur la semaine d’analyse' },
    { id: 'community_net', label: 'Communauté nette', value: '887 508', prevValue: '886 166', change: '+1 342 net', isPositive: true, explication: 'Totalité des abonnés après gains et pertes sur les 6 réseaux' },
    { id: 'engagement_rate', label: 'Taux d’engagement moyen', value: '5,30 %', prevValue: '3,83 %', change: '+1,47 pt', isPositive: true, formula: '(Engagements / Portée) × 100', explication: 'Efficacité relative des contenus rapportée aux personnes touchées' }
  ],
  orange_telco: [
    { id: 'reach', label: 'Portée Facebook & Social', value: '569 219', prevValue: '559 924', change: '+1,7%', isPositive: true, explication: 'Individus uniques touchés par les publications Orange Cameroun' },
    { id: 'impressions', label: 'Impressions Facebook', value: '854 907', prevValue: '780 423', change: '+9,5%', isPositive: true, explication: 'Volume d’expositions totales aux contenus Telco' },
    { id: 'engagements', label: 'Total Engagements', value: '27 496', prevValue: '16 888', change: '+62,8%', isPositive: true, explication: 'Réactions, partages, commentaires et clics enregistrés' },
    { id: 'video_views', label: 'Vues Vidéo', value: '166 543', prevValue: '104 214', change: '+59,8%', isPositive: true, explication: 'Consommation vidéo sur Facebook et Instagram' },
    { id: 'posts_count', label: 'Nombre de posts', value: '43', prevValue: '33', change: '+30,3%', isPositive: true, explication: 'Rythme éditorial soutenu (43 publications)' },
    { id: 'community_net', label: 'Followers Facebook', value: '582 541', prevValue: '582 820', change: '-279', isPositive: false, explication: 'Base abonnés Facebook après fluctuations de la semaine' },
    { id: 'engagement_rate', label: 'Taux d’engagement', value: '4,83 %', prevValue: '3,02 %', change: '+1,81 pt', isPositive: true, formula: '(Engagements / Portée) × 100', explication: 'Intensité d’interaction moyenne par individu exposé' }
  ],
  orange_money: [
    { id: 'reach', label: 'Portée personnes atteintes', value: '219 183', prevValue: '127 232', change: '+72,3%', isPositive: true, explication: 'Nombre d’individus touchés par Orange Money' },
    { id: 'impressions', label: 'Impressions totales', value: '322 054', prevValue: '186 574', change: '+72,6%', isPositive: true, explication: 'Expositions cumulées des publications OM' },
    { id: 'engagements', label: 'Total Engagements', value: '14 179', prevValue: '9 071', change: '+56,3%', isPositive: true, explication: 'Interactions massives stimulées par les quiz et jeux' },
    { id: 'video_views', label: 'Vues vidéo', value: '34 350', prevValue: '3 225', change: '+965,1%', isPositive: true, explication: 'Explosion des vues vidéo liée à la caravane OM Fidélité' },
    { id: 'posts_count', label: 'Nombre de posts', value: '21', prevValue: '26', change: '-19,2%', isPositive: true, explication: 'Efficacité accrue malgré une baisse de publications' },
    { id: 'community_net', label: 'Abonnés Facebook OM', value: '154 640', prevValue: '154 234', change: '+406', isPositive: true, explication: 'Progression continue de la communauté Orange Money' },
    { id: 'engagement_rate', label: 'Taux d’engagement', value: '6,47 %', prevValue: '7,13 %', change: '-0,66 pt', isPositive: false, formula: '(Engagements / Portée) × 100', explication: 'Taux d’engagement calculé sur la portée totale' }
  ],
  orange_business: [
    { id: 'reach', label: 'Portée estimée', value: '12 850', prevValue: '28 400', change: '-54,8%', isPositive: false, explication: 'Portée organique et sponsorisée LinkedIn & X' },
    { id: 'impressions', label: 'Impressions LinkedIn', value: '9 010', prevValue: '21 576', change: '-58,2%', isPositive: false, explication: 'Affichages sur les fils professionnels LinkedIn' },
    { id: 'engagements', label: 'Engagements LinkedIn', value: '138', prevValue: '330', change: '-58,2%', isPositive: false, explication: 'Interactions de décideurs et professionnels B2B' },
    { id: 'video_views', label: 'Vues vidéo LinkedIn', value: '6 129', prevValue: '9 130', change: '-32,9%', isPositive: false, explication: 'Consommation vidéo des capsules business' },
    { id: 'posts_count', label: 'Publications LinkedIn', value: '8', prevValue: '10', change: '-20,0%', isPositive: false, explication: 'Volume de posts professionnels sur la période' },
    { id: 'community_net', label: 'Followers LinkedIn', value: '2 751', prevValue: '2 536', change: '+215', isPositive: true, explication: 'Forte dynamique de recrutement organique B2B' },
    { id: 'engagement_rate', label: 'Taux d’engagement LinkedIn', value: '1,53 %', prevValue: '1,53 %', change: 'Stable', isPositive: true, formula: '(Engagements / Impressions) × 100', explication: 'Régularité du ratio d’engagement B2B' }
  ]
};

// Évolution chronologique hebdomadaire (Recharts combiné)
export const TIMELINE_PERFORMANCE_DATA = [
  { week: 'Sem 35 (24-30 Août)', reach: 610000, impressions: 890000, engagements: 21500, views: 88000, posts: 58, rate: 3.52 },
  { week: 'Sem 36 (31 Août-06 Sept)', reach: 645000, impressions: 940000, engagements: 23800, views: 96000, posts: 64, rate: 3.69 },
  { week: 'Sem 37 (07-13 Sept)', reach: 687156, impressions: 988573, engagements: 26289, views: 116569, posts: 69, rate: 3.83 },
  { week: 'Sem 38 (14-20 Sept) *Actuelle*', reach: 788402, impressions: 1185971, engagements: 41813, views: 207022, posts: 72, rate: 5.30 }
];

// Tableau comparatif multi-plateformes
export const PLATFORM_BENCHMARK_MATRIX = [
  {
    platform: 'Facebook',
    reach: '569 219 (Telco) + 219 183 (OM)',
    impressions: '1 176 961',
    engagements: '41 675',
    videoViews: '200 893',
    posts: '64',
    growth: '+127 net',
    clientExpectation: 'Canal de diffusion et d’animation de masse',
    status: 'Excellent',
    statusColor: '#27AE60'
  },
  {
    platform: 'Instagram',
    reach: '98 500',
    impressions: '142 000',
    engagements: '330',
    videoViews: '57 246',
    posts: '9',
    growth: '+17 abonnés (Leader : 112 849)',
    clientExpectation: 'Attractivité visuelle et proximité de marque',
    status: 'Leader Visibilité',
    statusColor: '#FF7900'
  },
  {
    platform: 'TikTok',
    reach: '15 400',
    impressions: '22 000',
    engagements: '8',
    videoViews: '52',
    posts: '4',
    growth: '+18 abonnés (Total : 12 080)',
    clientExpectation: 'Potentiel vidéo et affinité jeunes (À accélérer vs MTN)',
    status: 'En progression',
    statusColor: '#F39C12'
  },
  {
    platform: 'X (Twitter)',
    reach: '35 000',
    impressions: '14 092',
    engagements: '104',
    videoViews: '3 301',
    posts: '25',
    growth: '0 (Total : 175 789)',
    clientExpectation: 'Conversation, réactivité et actualité en temps réel',
    status: 'Actif',
    statusColor: '#2980B9'
  },
  {
    platform: 'LinkedIn',
    reach: '22 400',
    impressions: '25 814',
    engagements: '399',
    videoViews: '17 062',
    posts: '12',
    growth: '+1 453 abonnés (Forte traction B2B)',
    clientExpectation: 'Crédibilité corporate, B2B et expertise télécom',
    status: 'Fort potentiel B2B',
    statusColor: '#8E44AD'
  },
  {
    platform: 'YouTube',
    reach: '28 000',
    impressions: '45 000',
    engagements: '540',
    videoViews: '18 400',
    posts: '2',
    growth: 'Leader Cameroun (14 000 abonnés)',
    clientExpectation: 'Profondeur de consommation vidéo et tutoriels',
    status: 'Leader',
    statusColor: '#E74C3C'
  }
];

// Communautés et leadership détaillé par réseau
export const COMMUNITY_LEADERSHIP_DATA = {
  summary: {
    facebook: { leader: 'MTN Cameroun (922 382)', orange: 'Orange Cameroun (582 541)', orangeMoney: 'Orange Money (154 640)', camtel: 'Blue Camtel (50 748)', momo: 'MoMo MTN (31 828)' },
    instagram: { leader: 'Orange Cameroun (112 849) ★ LEADER', mtn: 'MTN Cameroun (97 648)', camtel: 'Blue Camtel (6 957)' },
    x: { leader: 'MTN Cameroun (281 117)', orange: 'Orange Cameroun (175 755)', camtel: 'Blue Camtel (4 333)', mtnB: 'MTN Business (461)', ob: 'Orange Business (34)' },
    linkedin: { leader: 'MTN Cameroun (163 611)', orange: 'Orange Cameroun (123 112)', camtel: 'Blue Camtel (120 488)', om: 'Orange Money (7 662)', mtnB: 'MTN Business (7 135)', ob: 'Orange Business (2 751)', wave: 'Wave (945)' },
    youtube: { leader: 'Orange Cameroun (14 000) ★ LEADER', mtn: 'MTN Cameroun (11 100)', camtel: 'Blue Camtel (1 890)' },
    tiktok: { leader: 'MTN Cameroun (29 736)', orange: 'Orange Cameroun (12 080)' }
  },
  table: [
    { network: 'LinkedIn', mtn: '163 611 (+795)', orangeTelco: '123 112 (+1 238)', camtel: '120 488 (+1 357)', orangeMoney: '7 662 (+340)', orangeBiz: '2 751 (+215)', mtnBiz: '7 135 (+308)', wave: '945 (+39)', leader: 'MTN Cameroun', orangeRank: '2e (+1 238 net)' },
    { network: 'Instagram', mtn: '97 648 (-16)', orangeTelco: '112 849 (+17)', camtel: '6 957 (-11)', orangeMoney: '—', orangeBiz: '—', mtnBiz: '—', wave: '—', leader: 'Orange Cameroun', orangeRank: '1er (LEADER)' },
    { network: 'YouTube', mtn: '11 100 (0)', orangeTelco: '14 000 (0)', camtel: '1 890 (0)', orangeMoney: '—', orangeBiz: '—', mtnBiz: '—', wave: '—', leader: 'Orange Cameroun', orangeRank: '1er (LEADER)' },
    { network: 'TikTok', mtn: '29 736 (+35)', orangeTelco: '12 080 (+18)', camtel: '—', orangeMoney: '—', orangeBiz: '—', mtnBiz: '—', wave: '—', leader: 'MTN Cameroun', orangeRank: '2e (12K)' },
    { network: 'Facebook', mtn: '922 382 (-646)', orangeTelco: '582 541 (-279)', camtel: '50 748 (+95)', orangeMoney: '154 640 (+406)', orangeBiz: '—', mtnBiz: '—', wave: '—', leader: 'MTN Cameroun', orangeRank: '2e + OM 3e' },
    { network: 'X / Twitter', mtn: '281 117 (-22)', orangeTelco: '175 755 (-1)', camtel: '4 333 (+14)', orangeMoney: '—', orangeBiz: '34 (+1)', mtnBiz: '461 (+145)', wave: '—', leader: 'MTN Cameroun', orangeRank: '2e (175K)' }
  ]
};

// Campagnes & Prises de parole issues des rapports (Slide 5 + Rapports de campagne)
export const CAMPAIGNS_PERFORMANCE_DATA = [
  {
    id: 'camp_lions4life',
    name: 'Lions4Life — Soutien Lions Indomptables',
    brand: 'Orange TELCO',
    objective: 'Engagement & Mobilisation',
    period: 'Septembre 2026',
    networks: ['Facebook', 'Instagram', 'X'],
    reach: 169508,
    reachShare: '29,8%',
    impressions: 263272,
    impressionsShare: '30,8%',
    engagements: 8974,
    engagementsShare: '32,7%',
    videoViews: 0,
    status: 'en_cours',
    rankingTag: 'Top Engagement',
    insight: 'Génère le plus grand volume d’engagements (8 974). Bénéficie d’une très forte visibilité organique soutenue par la passion sportive.',
    recommendation: 'Continuer le déploiement avant les matchs clés et coupler avec un jeu concours maillot.',
    budgetSpent: '650 000 FCFA'
  },
  {
    id: 'camp_autres_anim',
    name: 'Autres Animations (Fil Rouge & Tutos)',
    brand: 'Orange TELCO',
    objective: 'Notoriété & Portée',
    period: '14 au 20 Septembre 2026',
    networks: ['Facebook', 'YouTube', 'Instagram'],
    reach: 172242,
    reachShare: '30,2%',
    impressions: 278685,
    impressionsShare: '32,6%',
    engagements: 5439,
    engagementsShare: '19,8%',
    videoViews: 64725,
    videoViewsShare: '38,9%',
    status: 'en_cours',
    rankingTag: 'Top Visibilité & Vidéo',
    insight: 'Regroupe plusieurs contenus et thématiques générant 30,2% de la portée et 38,9% des vues vidéo.',
    recommendation: 'Maintenir la régularité et isoler les sous-thèmes les plus engageants.',
    budgetSpent: '900 000 FCFA'
  },
  {
    id: 'camp_best_deal',
    name: 'Best Deal (Promos Forfaits & Data)',
    brand: 'Orange TELCO',
    objective: 'Considération & Conversion',
    period: 'Septembre 2026',
    networks: ['Facebook'],
    reach: 53379,
    reachShare: '9,4%',
    impressions: 85100,
    impressionsShare: '9,9%',
    engagements: 6372,
    engagementsShare: '23,2%',
    videoViews: 0,
    status: 'en_cours',
    rankingTag: 'Meilleur Rendement Paid',
    insight: 'Enregistre 6 372 engagements (23,2%) avec une très forte intensité d’interaction au regard de sa portée.',
    recommendation: 'Augmenter le budget sponsoring pour démultiplier ce ratio d’engagement exceptionnel.',
    budgetSpent: '450 000 FCFA'
  },
  {
    id: 'camp_funtone',
    name: 'Funtone (Tonalités d’Attente Musicales)',
    brand: 'Orange TELCO',
    objective: 'Activation & Recrutement',
    period: 'Septembre 2026',
    networks: ['Facebook'],
    reach: 20664,
    reachShare: '3,6%',
    impressions: 32063,
    impressionsShare: '3,7%',
    engagements: 3364,
    engagementsShare: '12,2%',
    videoViews: 0,
    status: 'a_optimiser',
    rankingTag: 'Taux Record (16,3%)',
    insight: 'Génère 3 364 engagements et affiche le taux d’engagement relatif le plus élevé (16,3%) rapporté à sa portée.',
    recommendation: 'Tester des formats Reels sonores avec extraits musicaux pour élargir l’audience.',
    budgetSpent: '200 000 FCFA'
  },
  {
    id: 'camp_music_talents',
    name: 'Orange Music Talents 2026',
    brand: 'Orange TELCO',
    objective: 'Notoriété Vidéo & Jeunesse',
    period: 'Août - Septembre 2026',
    networks: ['Facebook', 'Instagram', 'YouTube', 'TikTok'],
    reach: 96228,
    reachShare: '16,9%',
    impressions: 126898,
    impressionsShare: '14,8%',
    engagements: 2803,
    engagementsShare: '10,2%',
    videoViews: 46281,
    videoViewsShare: '27,8%',
    status: 'en_cours',
    rankingTag: 'Pilier Vidéo',
    insight: 'Contribue principalement aux vues vidéo (46 281 soit 27,8% du mix) malgré un engagement plus modéré.',
    recommendation: 'Intégrer des sondages en direct et des votes dans les stories pour dynamiser le call-to-action.',
    budgetSpent: '850 000 FCFA'
  },
  {
    id: 'camp_fondation',
    name: 'Fondation Orange — Écoles Numériques',
    brand: 'Orange TELCO',
    objective: 'RSE & Notoriété Institutionnelle',
    period: 'Septembre 2026',
    networks: ['Facebook', 'LinkedIn'],
    reach: 43147,
    reachShare: '7,6%',
    impressions: 54817,
    impressionsShare: '6,4%',
    engagements: 542,
    engagementsShare: '2,0%',
    videoViews: 41465,
    videoViewsShare: '24,9%',
    status: 'en_cours',
    rankingTag: 'Impact Vidéo RSE',
    insight: 'Orientée quasi exclusivement sur la consommation vidéo (41 465 vues) avec un sentiment de marque très positif.',
    recommendation: 'Associer les témoignages des bénéficiaires et instituteurs pour stimuler les partages.',
    budgetSpent: '300 000 FCFA'
  },
  {
    id: 'camp_ready_party',
    name: 'Ready Party Back to School (Orange Pulse)',
    brand: 'Orange TELCO',
    objective: 'Notoriété & Affinité Jeunes',
    period: 'Août - Septembre 2026',
    networks: ['Facebook', 'TikTok', 'Instagram'],
    reach: 235266,
    reachShare: '—',
    impressions: 345000,
    impressionsShare: '—',
    engagements: 7502,
    engagementsShare: '—',
    videoViews: 160833,
    videoViewsShare: '—',
    status: 'terminee',
    rankingTag: 'Top Visibilité Hebdo',
    insight: 'Campagne de référence sur la visibilité jeunesse avec 235 266 personnes touchées et 160 833 vues vidéo.',
    recommendation: 'Capitaliser sur la base d’abonnés acquise pour promouvoir les offres forfaits Pulse.',
    budgetSpent: '1 200 000 FCFA'
  }
];

// Top Contenus & Best Posts réels avec captures et métriques exactes (Slides 7-10, 15-17, 21)
export const REAL_BEST_POSTS = [
  // TELCO FACEBOOK
  {
    id: 'bp_telco_orange_1',
    rank: 1,
    title: 'Instant fun 🤩 Demande la connexion sans utiliser les mots Internet, data, mégas ou gigas ?',
    actor: 'Orange Cameroun',
    platform: 'Facebook',
    date: '14 sept. 2026',
    format: 'Image participative',
    engagements: 3579,
    reach: 78500,
    impressions: 112000,
    shares: 412,
    comments: 2980,
    badge: '★ Best Post Semaine Orange',
    message: 'Instant Fun ! 🤩 Demande la connexion à ton pote sans utiliser les mots : Internet, Data, Mégas, Connexion ou Gigas ! 🤫😜 Dis-nous en commentaire ! 🎁 Les réponses les plus originales repartent avec des cadeaux ! #InstantFun #OrangeEstLà',
    cta: 'Commenter & Gagner',
    driver: 'Jeu participatif, appel aux commentaires et humour local'
  },
  {
    id: 'bp_telco_orange_2',
    rank: 2,
    title: 'Les Lions sont de retour dans les stades',
    actor: 'Orange Cameroun',
    platform: 'Facebook',
    date: '14 sept. 2026',
    format: 'Image événementielle',
    engagements: 2638,
    reach: 65200,
    impressions: 94000,
    shares: 198,
    comments: 890,
    badge: 'Top 2 Facebook',
    message: 'La mission du 24 septembre est lancée ! 🇨🇲 Le hemlè est à 100% ! Nos Lions sont prêts à faire vibrer tout le pays sur la pelouse. ⚽ Une seule mission: imposer notre rythme, honorer les couleurs et décrocher une victoire éclatante ! 💚💛❤️ #Lions4Life #OrangeEstLà',
    cta: 'Soutien aux Lions',
    driver: 'Ferveur nationale, identité sportive et engagement émotionnel'
  },
  {
    id: 'bp_telco_orange_3',
    rank: 3,
    title: 'Après les Lionnes, les Lions entrent en jeu (Offre Maillot Fan)',
    actor: 'Orange Cameroun',
    platform: 'Facebook',
    date: '16 sept. 2026',
    format: 'Image promotionnelle',
    engagements: 2117,
    reach: 58900,
    impressions: 84000,
    shares: 145,
    comments: 620,
    badge: 'Top 3 Facebook',
    message: 'Garoua va vibrer et on s’équipe en mode 100% 237 ! 🇨🇲 Rendez-vous ce 24 septembre à 20h au stade de Roumdé Adjia pour le choc Cameroun VS Comores ! Orange valide le bon plan parfait pour les supporters : 🎁 1 maillot fan acheté = 1 maillot fan OFFERT !',
    cta: 'Boutique Orange',
    driver: 'Offre promotionnelle 1+1 et fierté locale'
  },

  // TELCO CONCURRENTS FACEBOOK
  {
    id: 'bp_telco_mtn_1',
    rank: 1,
    title: 'Trouve le sac différent — Rentrée avec YaMo',
    actor: 'MTN Cameroun',
    platform: 'Facebook',
    date: '16 sept. 2026',
    format: 'Image jeu',
    engagements: 261,
    reach: 18400,
    impressions: 24000,
    badge: 'Top 1 MTN',
    message: 'Jeu participatif invitant la communauté à identifier le bon sac pour gagner 50 000 FCFA de crédit.',
    driver: 'Jeu concours rentrée'
  },
  {
    id: 'bp_telco_camtel_1',
    rank: 1,
    title: 'Blue Mo — 1,5 Go à 300 FCFA',
    actor: 'Blue by Camtel',
    platform: 'Facebook',
    date: '16 sept. 2026',
    format: 'Image offre data',
    engagements: 599,
    reach: 22100,
    impressions: 29500,
    badge: 'Top 1 Camtel',
    message: 'Mise en avant de l’offre data Blue Mo 1,5 Go à seulement 300 FCFA valable 24h.',
    driver: 'Prix bas et volume data agressif'
  },

  // ORANGE MONEY vs MoMo FACEBOOK
  {
    id: 'bp_om_1',
    rank: 1,
    title: 'C’est le retour des Lions — Paie ton ticket via OM sur Max it',
    actor: 'Orange Money',
    platform: 'Facebook',
    date: '15 sept. 2026',
    format: 'Image activation',
    engagements: 1727,
    reach: 48000,
    impressions: 72000,
    badge: '★ Best Post Orange Money',
    message: 'Le stade Roumdé Adjia de Garoua s’apprête à faire le plein ! 🇨🇲 Le 24 septembre à 20h, nos Lions reprennent les commandes du terrain. Sécurise ton ticket immédiatement avec Orange Money ici sur Market Place Max it !',
    cta: 'Acheter sur Max it',
    driver: 'Billetterie exclusive digitale Orange Money'
  },
  {
    id: 'bp_om_2',
    rank: 2,
    title: 'Quel pays est l’intrus pour les transferts OM vers l’Afrique ?',
    actor: 'Orange Money',
    platform: 'Facebook',
    date: '18 sept. 2026',
    format: 'Image quiz',
    engagements: 1629,
    reach: 44000,
    impressions: 66000,
    badge: 'Top 2 Orange Money',
    message: 'Tu peux transférer de l’argent du Cameroun vers +10 pays en Afrique en toute rapidité... mais quel est l’intrus parmi les pays ici ? Nigéria, Côte d’Ivoire, RDC ou Ghana ?',
    cta: 'Composer #150*12#',
    driver: 'Éducation produit sous forme de devinette'
  },
  {
    id: 'bp_om_3',
    rank: 3,
    title: 'Vendredi grill — OM Fidélité Ngaoundéré',
    actor: 'Orange Money',
    platform: 'Facebook',
    date: '18 sept. 2026',
    format: 'Image promo terrain',
    engagements: 1395,
    reach: 39500,
    impressions: 58000,
    badge: 'Top 3 Orange Money',
    message: 'Les vendredis, il faut d’abord bien manger. 🍗 Souscris à OM Fidélité sur Max it, scanne le QR code pour payer tes grillades et gagne du cash !',
    cta: 'Souscrire OM Fidélité',
    driver: 'Offre food & lifestyle, proximité terrain'
  },
  {
    id: 'bp_momo_1',
    rank: 1,
    title: 'Quiz 2 — Quel est le bon code pour envoyer à travers l’Afrique ?',
    actor: 'MoMo MTN',
    platform: 'Facebook',
    date: '16 sept. 2026',
    format: 'Image quiz',
    engagements: 455,
    reach: 14200,
    impressions: 19800,
    badge: 'Top 1 MoMo',
    message: 'Une seule réponse est vraie pour gagner 25 000 FCFA à se partager.',
    driver: 'Quiz code USSD'
  },

  // ORANGE BUSINESS vs MTN BUSINESS LINKEDIN
  {
    id: 'bp_ob_1',
    rank: 1,
    title: 'Comprendre les entreprises commence par les écouter — Journée Tous Vendeurs',
    actor: 'Orange Business CM',
    platform: 'LinkedIn',
    date: '17 sept. 2026',
    format: 'Image terrain & collaborateurs',
    engagements: 54,
    reach: 2200,
    impressions: 3701,
    badge: '★ Best Post Orange Business',
    message: 'À Yaoundé, la Journée Tous Vendeurs a permis aux équipes Orange Business d’aller au contact direct des clients, de recueillir leurs retours et d’échanger autour de leurs besoins réels en connectivité et sécurité.',
    cta: 'Découvrir nos solutions B2B',
    driver: 'Mise en avant humaine des équipes et de l’écoute client'
  },
  {
    id: 'bp_mtn_b_1',
    rank: 1,
    title: 'Global Appreciation Week — Human Rainbow Monochrome Day',
    actor: 'MTN Business Cameroon',
    platform: 'LinkedIn',
    date: '17 sept. 2026',
    format: 'Image célébration interne',
    engagements: 87,
    reach: 3400,
    impressions: 5120,
    badge: 'Top 1 MTN Business',
    message: 'Célébration des collaborateurs et architectes de la croissance MTN Business.',
    driver: 'Culture d’entreprise et cohésion d’équipe'
  }
];

// Synthèse des formats et performance relative
export const FORMATS_PERFORMANCE_ANALYSIS = [
  { format: 'Jeux & Quiz participatifs', postsCount: 14, avgEngagements: 2150, avgReach: 48000, efficiencyIndex: 9.8, verdict: 'Format #1 en conversion et interaction' },
  { format: 'Images promotionnelles / Offres', postsCount: 28, avgEngagements: 890, avgReach: 32000, efficiencyIndex: 6.2, verdict: 'Volume régulier, forte mémorisation prix' },
  { format: 'Vidéos & Reels (15-60s)', postsCount: 18, avgEngagements: 1450, avgReach: 68000, efficiencyIndex: 8.5, verdict: 'Moteur de visibilité et rétention vidéo' },
  { format: 'Carrousels éducatifs (B2B/OM)', postsCount: 8, avgEngagements: 520, avgReach: 14500, efficiencyIndex: 5.4, verdict: 'Idéal pour expliquer les parcours USSD et Cloud' },
  { format: 'Posts texte seul / actualité', postsCount: 4, avgEngagements: 180, avgReach: 8200, efficiencyIndex: 3.1, verdict: 'Faible visibilité, à limiter' }
];

// Benchmark concurrentiel détaillé (3 espaces indépendants)
export const BENCHMARK_SPACES = {
  telco: {
    title: 'Telco Grand Public : Orange Cameroun vs. MTN Cameroun vs. CAMTEL',
    period: 'Semaine du 14 au 20 Septembre 2026',
    summaryText: 'Orange domine nettement la période en volume d’interactions (27 496, soit 90,3% de part d’engagement) et de vues vidéo (166 543). MTN privilégie une présence vidéo soutenue avec 25 publications pour 34 638 vues. Camtel reste en retrait avec 7 posts.',
    metrics: [
      { actor: 'Orange Cameroun', engagements: 27496, videoViews: 166543, posts: 43, engPerPost: 639, viewsPerPost: 3873, share: '90,3%', color: '#FF7900' },
      { actor: 'MTN Cameroun', engagements: 1872, videoViews: 34638, posts: 25, engPerPost: 75, viewsPerPost: 1386, share: '6,1%', color: '#FFCC00' },
      { actor: 'CAMTEL (Blue)', engagements: 1112, videoViews: 0, posts: 7, engPerPost: 159, viewsPerPost: 0, share: '3,6%', color: '#0066CC' }
    ]
  },
  mobile_money: {
    title: 'Mobile Money : Orange Money vs. MoMo (MTN)',
    period: 'Semaine du 14 au 20 Septembre 2026',
    summaryText: 'Orange Money écrase la concurrence avec 14 179 engagements (vs 794 pour MoMo) et 34 350 vues vidéo (vs 153). L’engagement moyen par post d’Orange Money est de 675 contre seulement 66 pour MoMo.',
    metrics: [
      { actor: 'Orange Money', engagements: 14179, videoViews: 34350, posts: 21, engPerPost: 675, share: '94,7%', color: '#00A859' },
      { actor: 'MoMo MTN', engagements: 794, videoViews: 153, posts: 12, engPerPost: 66, share: '5,3%', color: '#FFB800' }
    ]
  },
  b2b: {
    title: 'B2B & Entreprises : Orange Business vs. MTN Business',
    period: 'Période du 07 au 20 Septembre 2026 (LinkedIn & X)',
    summaryText: 'Sur LinkedIn, MTN Business publie davantage (24 vs 8 posts) et capitalise sur des événements internes. Cependant, Orange Business génère un engagement moyen par post supérieur (17,3 vs 11,6) et plus de vues vidéo (6 129 vs 5 107).',
    metrics: [
      { network: 'LinkedIn', ob: { eng: 138, imp: 9010, views: 6129, posts: 8, engRate: '1,53%', engPerPost: 17.3 }, mtnB: { eng: 278, imp: 17008, views: 5107, posts: 24, engRate: '1,63%', engPerPost: 11.6 } },
      { network: 'X (Twitter)', ob: { eng: 0, imp: 97, views: 71, posts: 5, engRate: '0,00%', engPerPost: 0 }, mtnB: { eng: 23, imp: 606, views: 162, posts: 20, engRate: '3,80%', engPerPost: 1.15 } }
    ]
  }
};

// Insights Actionnables formalisés en 6 points (Cahier des charges Page 6)
export const STANDARDIZED_ACTIONABLE_INSIGHTS = [
  {
    id: 'ins_1',
    category: 'Média & Sponsoring',
    title: 'Sponsoring et amplification ciblée : Arbitrage reach vs qualité de conversion',
    constat: 'Les publications sponsorisées ont décuplé les impressions (+9,5%) et les vues vidéo (+59,8%), mais la portée organique pure stagne (+1,7%).',
    explication: 'L’algorithme Meta favorise la portée payée au détriment de l’organique sur les pages à très forte audience. Le public sponsorisé réagit vivement aux jeux mais moins aux offres sèches.',
    preuve: 'Lions4Life cumule 263 272 impressions pour 8 974 interactions tandis que Best Deal atteint 6 372 interactions sur seulement 85 100 impressions.',
    impact: 'Opportunité majeure d’optimiser le coût par engagement (CPE) en allouant 40% du budget sponsoring sur les posts à haute propension participative.',
    recommandation: 'Automatiser l’activation du boost média uniquement après détection d’un taux organique supérieur à 4% dans les 2 premières heures de diffusion.',
    confidence: 'Élevé'
  },
  {
    id: 'ins_2',
    category: 'Mécanique de Contenu',
    title: 'Contenus participatifs & Quiz : Véritable moteur d’engagement Orange Money',
    constat: 'Orange Money multiplie ses interactions par 17 face à MoMo grâce aux devinettes sur les transferts et à la caravane OM Fidélité.',
    explication: 'La gamification crée un réflexe d’auto-valorisation chez l’utilisateur qui répond en commentaire pour prouver sa sagacité ou tenter de remporter un lot.',
    preuve: 'Le post « Quel pays est l’intrus ? » réalise 1 629 engagements et 1 450 commentaires organiques sans investissement média lourd.',
    impact: 'Consolidation du leadership d’image d’Orange Money comme application populaire, proche et gratifiante.',
    recommandation: 'Instaurer un rendez-vous hebdomadaire récurrent « Le Quiz du Vendredi OM » avec tirage au sort transparent sur Max it.',
    confidence: 'Élevé'
  },
  {
    id: 'ins_3',
    category: 'Stratégie B2B',
    title: 'Humanisation et présence terrain pour Orange Business face à la technicité',
    constat: 'Recul de 58,2% des impressions et des interactions sur LinkedIn par rapport à la semaine précédente.',
    explication: 'La répétition de visuels corporate institutionnels ou trop techniques suscite peu de commentaires. À l’inverse, le post mettant en avant les collaborateurs terrain a surperformé.',
    preuve: 'Le post « Journée Tous Vendeurs » cumule 54 engagements et 3 701 impressions, soit 40% de l’activité LinkedIn de toute la semaine.',
    impact: 'Risque de baisse de pertinence de la marque auprès des décideurs IT si la tonalité reste impersonnelle.',
    recommandation: 'Diversifier la ligne éditoriale LinkedIn avec 50% de cas d’usage clients locaux, 30% d’expertise collaborative et 20% d’offres produit directes.',
    confidence: 'Moyen'
  }
];

// Plan d'action & Recommandations (AARRR)
export const CLIENT_RECOMMENDATIONS_PLAN = [
  {
    id: 'rec_1',
    recommendation: 'Activer un boost média systématique sur les posts participatifs dépassant 4% d’engagement en H+2',
    entity: 'Orange Telco',
    lever: 'Paid Media & Ciblage',
    justification: '+62,8% d’interactions constatées quand le sponsoring soutient un contenu déjà viral',
    priority: 'Élevée',
    owner: 'Partagé (McCann × Orange)',
    dueDate: '2026-09-28',
    status: 'a_valider',
    testResult: 'Hypothèse en attente d’arbitrage budgétaire'
  },
  {
    id: 'rec_2',
    recommendation: 'Créer le rendez-vous hebdomadaire « Le Quiz du Vendredi Orange Money » sur Facebook & Max it',
    entity: 'Orange Money',
    lever: 'Contenu & Fidélisation',
    justification: '1 629 interactions sur le quiz intrus vs 455 pour le meilleur post MoMo',
    priority: 'Élevée',
    owner: 'McCann',
    dueDate: '2026-10-02',
    status: 'planifiee',
    testResult: 'Gabarit graphique validé'
  },
  {
    id: 'rec_3',
    recommendation: 'Lancer un programme Ambassadeurs Internes (Employee Advocacy) pour doubler la portée LinkedIn',
    entity: 'Orange Business',
    lever: 'Influence & Collaborateurs',
    justification: 'La Journée Tous Vendeurs a généré 40% des engagements B2B de la semaine',
    priority: 'Moyenne',
    owner: 'Orange Cameroun',
    dueDate: '2026-10-15',
    status: 'a_valider',
    testResult: 'Identification de 15 profils commerciaux clés'
  },
  {
    id: 'rec_4',
    recommendation: 'Refondre la stratégie vidéo TikTok avec des formats courts humoristiques (15s) pour rattraper MTN',
    entity: 'Orange Telco',
    lever: 'Format & Vidéo',
    justification: 'MTN domine TikTok avec 29K followers vs 12K pour Orange',
    priority: 'Moyenne',
    owner: 'McCann',
    dueDate: '2026-10-10',
    status: 'a_valider',
    testResult: 'Casting de créateurs de contenu en cours'
  }
];

// Bibliothèque des rapports certifiés et livrables téléchargeables
export const CLIENT_DOWNLOADABLE_REPORTS = [
  {
    id: 'REP-S38-2026',
    title: 'Bilan Hebdomadaire Social Media — S38 (14 au 20 Septembre 2026)',
    period: '14 au 20 Septembre 2026',
    entity: 'Telco / Money / Business',
    version: 'v1.0 Certifiée',
    publishedAt: '2026-09-21 09:30',
    pages: 22,
    fileSize: '4.8 Mo',
    format: 'PDF Charté Orange',
    status: 'approved',
    statusLabel: 'Validé par le Client',
    downloadUrl: '#',
    hasCsv: true,
    summary: 'Couverture 360° des KPI Facebook, X, LinkedIn, TikTok, Instagram et YouTube. Comparatifs concurrentiels MTN & Camtel.'
  },
  {
    id: 'REP-S37-2026',
    title: 'Bilan Hebdomadaire Social Media — S37 (07 au 13 Septembre 2026)',
    period: '07 au 13 Septembre 2026',
    entity: 'Telco / Money / Business',
    version: 'v1.1 Finale',
    publishedAt: '2026-09-14 11:15',
    pages: 20,
    fileSize: '4.2 Mo',
    format: 'PDF Charté Orange',
    status: 'approved',
    statusLabel: 'Validé par le Client',
    downloadUrl: '#',
    hasCsv: true,
    summary: 'Rapport initial de rentrée des classes avec comparatifs de vagues et premières activations Back to School.'
  },
  {
    id: 'REP-M08-2026',
    title: 'Bilan Mensuel Consolidé — Août 2026 & Clôture Vacances',
    period: '01 au 31 Août 2026',
    entity: 'Vue Consolidée',
    version: 'v2.0 Archivée',
    publishedAt: '2026-09-04 16:45',
    pages: 36,
    fileSize: '7.9 Mo',
    format: 'PDF & Databook Excel',
    status: 'delivered',
    statusLabel: 'Livrable clôturé',
    downloadUrl: '#',
    hasCsv: true,
    summary: 'Analyse mensuelle globale avec ROI Paid Media, sentiment de marque et bilan complet des activations estivales.'
  },
  {
    id: 'REP-CAMP-LIONS-09',
    title: 'Fiche Synthèse Campagne — Lions4Life & Matchs Éliminatoires',
    period: 'Campagne active Septembre 2026',
    entity: 'Orange TELCO',
    version: 'v1.0 Live',
    publishedAt: '2026-09-18 14:00',
    pages: 8,
    fileSize: '2.1 Mo',
    format: 'PDF Fiche Campagne',
    status: 'in_review',
    statusLabel: 'En cours de validation',
    downloadUrl: '#',
    hasCsv: true,
    summary: 'Zoom performance sur les 3 activations Lions4Life, taux de clics boutique maillot fan et portée des publications.'
  }
];
