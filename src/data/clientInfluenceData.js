/**
 * BRIDGE — Données certifiées Vue Client : Module Influence & Ambassadeurs
 * Conforme rigoureusement au Cahier des Charges "Vue Client — module Influence" (Septembre 2026)
 *
 * Protection absolue des données confidentielles de l'Agence McCann :
 * - Aucune marge d'agence
 * - Aucun montant négocié unitaire brut
 * - Aucune coordonnée personnelle confidentielle
 * - Notes internes de casting et négociation masquées
 */

// ─── 1. ENTITÉS, STATUTS & FILTRES DU BANDEAU CLIENT ───
export const INFLUENCE_ENTITIES = [
  { id: 'all', label: 'Toutes les entités' },
  { id: 'orange_cm', label: 'Orange Cameroun', badge: 'Telco' },
  { id: 'orange_money', label: 'Orange Money', badge: 'Fintech' },
  { id: 'orange_business', label: 'Orange Business', badge: 'B2B' },
];

export const INFLUENCE_NETWORKS = [
  { id: 'all', label: 'Tous les réseaux', icon: '🌐' },
  { id: 'facebook', label: 'Facebook', icon: '🔵' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'x', label: 'X (Twitter)', icon: '✖️' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
];

export const TALENT_TYPES = [
  { id: 'all', label: 'Tous les types' },
  { id: 'ambassadeur', label: 'Ambassadeur officiel' },
  { id: 'mega', label: 'Méga-influenceur (> 1M)' },
  { id: 'macro', label: 'Macro-influenceur (100k - 1M)' },
  { id: 'micro', label: 'Micro-influenceur (10k - 100k)' },
  { id: 'nano', label: 'Nano-influenceur (< 10k)' },
  { id: 'ugc', label: 'Créateur UGC' },
  { id: 'page_populaire', label: 'Page populaire / Webzine' },
  { id: 'expert_b2b', label: 'Expert B2B / Leader d’opinion' },
  { id: 'artiste', label: 'Artiste / Célébrité' },
  { id: 'communaute', label: 'Média ou communauté' },
];

export const CAMPAIGN_OBJECTIVES = [
  { id: 'all', label: 'Tous les objectifs' },
  { id: 'notoriete', label: 'Notoriété & Visibilité' },
  { id: 'engagement', label: 'Engagement & Conversation' },
  { id: 'trafic', label: 'Trafic web & téléchargement app' },
  { id: 'consideration', label: 'Considération de marque' },
  { id: 'conversion', label: 'Conversion & Souscription offre' },
  { id: 'recrutement', label: 'Recrutement nouveaux abonnés' },
  { id: 'fidelisation', label: 'Fidélisation & Usage répété' },
];

export const CAMPAIGN_STATUSES = [
  { id: 'all', label: 'Tous les statuts' },
  { id: 'casting', label: 'Casting & Sélection' },
  { id: 'en_validation', label: 'En validation Orange' },
  { id: 'contractualise', label: 'Contractualisé' },
  { id: 'en_production', label: 'En production' },
  { id: 'publie', label: 'Publié & Actif' },
  { id: 'en_bilan', label: 'En bilan & Reporting' },
];

// ─── 2. RÔLES ET PERSPECTIVES CLIENT (BANDEAU DE PERSPECTIVES) ───
export const CLIENT_INFLUENCE_ROLES = [
  {
    id: 'chef_de_marque',
    label: 'Chef de Marque Orange',
    subtitle: 'Direction Marque & Comms',
    icon: '👑',
    color: '#FF7900',
    description: 'Validation finale des concepts, conformité de l’image de marque Orange et alignement des prises de parole avec les priorités business.',
    permissions: ['Validation des BAT & briefs', 'Arbitrage des shortlists', 'Consultation des bilans consolidés'],
    suggestedTab: 'cockpit'
  },
  {
    id: 'responsable_media',
    label: 'Responsable Média & Influence',
    subtitle: 'Pôle Digital & Contenus',
    icon: '📊',
    color: '#2980B9',
    description: 'Pilotage tactique des publications, synchronisation du calendrier éditorial, suivi de la portée certifiée et détection des conflits de dates.',
    permissions: ['Gestion du calendrier', 'Validation des légendes et CTA', 'Suivi du reporting d’engagement'],
    suggestedTab: 'calendrier'
  },
  {
    id: 'juridique_conformite',
    label: 'Affaires Juridiques & Conformité',
    subtitle: 'Risk & Brand Safety',
    icon: '⚖️',
    color: '#27AE60',
    description: 'Contrôle des mentions légales de partenariat sponsorisé (#PartenariatOrange), respect des droits à l’image et conformité réglementaire ARSEL/MINPOSTEL.',
    permissions: ['Checklist de conformité en 9 points', 'Vérification des clauses d’exclusivité', 'Alertes Brand Safety'],
    suggestedTab: 'validations'
  },
  {
    id: 'direction_marketing',
    label: 'Direction Marketing & Expérience',
    subtitle: 'Vision Stratégique & ROI',
    icon: '💼',
    color: '#8E44AD',
    description: 'Supervision du portefeuille d’activations, analyse des best performers, retour sur investissement et arbitrages de tests créatifs.',
    permissions: ['Vue Cockpit 360°', 'Lecture des tops performers', 'Validation des recommandations d’expérimentation'],
    suggestedTab: 'reporting'
  }
];

// ─── 3. KPI DU COCKPIT (PAGE 2 DU CAHIER DES CHARGES) ───
export const INITIAL_CLIENT_COCKPIT_KPIS = {
  talentsActifs: 24, // Nombre de créateurs qualifiés
  activationsEnCours: 0, // Aucune campagne exemple, seules les nouvelles créations
  contenusDiffuses: 0, // Livrables réellement publiés
  porteeCumulee: '—', // Exposition cumulée
  vuesVideo: '—', // Consommation vidéo
  engagementsCumules: '—', // Réactions, commentaires, partages
  tauxEngagement: '—', // Qualité relative
  livrablesAValider: 0, // En attente de décision Orange
  alertesActives: 0, // Alertes prioritaires
};

// Bloc « À Retenir » (Page 2 du Cahier des Charges)
export const INITIAL_CLIENT_A_RETENIR = {
  meilleureActivation: null,
  decisionRequise: null,
  opportuniteExploiter: null
};

// ─── 4. CATALOGUE TALENTS CÔTÉ CLIENT (PAGE 2 & 3) ───
// Information sensible d'agence masquée par défaut (marges, montants négociés privés, contrats internes)
export const INITIAL_CLIENT_TALENTS = [
  {
    id: 'TAL-carles-antonio',
    displayName: 'Carles Antonio',
    pseudo: '@carlesantonio',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    type: 'macro',
    typeLabel: 'Macro-influenceur',
    status: 'actif',
    statusLabel: 'Partenaire actif Orange',
    category: 'Humour & Lifestyle',
    city: 'Douala / National',
    platforms: ['tiktok', 'instagram', 'facebook'],
    communityTotal: '1.45M',
    communities: {
      tiktok: '850K',
      instagram: '420K',
      facebook: '180K'
    },
    primaryAudience: {
      age: '18-24 ans (56%), 25-34 ans (34%)',
      gender: '52% Hommes, 48% Femmes',
      location: 'Cameroun 84% (Douala 48%, Ydé 32%), Diaspora 16%',
      interests: 'Divertissement, Gaming, Musique urbaine, Mobile Life'
    },
    languages: ['Français', 'Pidgin', 'Camfranglais'],
    formatsMastered: ['Reel dynamique', 'TikTok sketch', 'Story interactive', 'Live streaming', 'Présence terrain'],
    orangeHistory: {
      totalCampaigns: 0,
      lastCampaign: '—',
      totalContentPublished: 0,
      averageEngagementRate: '—',
      reliabilityScore: '—'
    },
    mccannRecommendation: {
      level: 'Hautement recommandé',
      score: 96,
      strategicRationale: 'Créateur référent sur la cible 18-25 ans urbaine. Capacité unique à intégrer naturellement les offres Data et Mobile Money dans des sketchs viraux sans saturation publicitaire.',
      recommendedOffer: 'Offres Jeunesse Orange Pulse, Forfaits Maxi Data, Orange Money Épargne'
    },
    complianceBadge: {
      contractSigned: true,
      imageRightsSecured: true,
      brandCharterValidated: true,
      adminDocumentsVerified: true,
      exclusivityActive: true,
      exclusivityDetails: 'Exclusivité sectorielle Télécoms & Paiement Mobile certifiée jusqu’au 31/12/2026'
    },
    brandSafety: {
      riskLevel: 'Faible',
      vigilanceNotes: 'Humour bienveillant. Attention à valider préalablement les mentions d’argot local pour conserver la tonalité Orange.',
      framingGuidelines: 'Briefs détaillés requis sur les conditions tarifaires précises.'
    },
    bio: 'Humoriste, créateur de contenu et streamer camerounais parmi les plus influents de sa génération. Connu pour ses chroniques de vie quotidienne et sa proximité avec la jeunesse urbaine.'
  },
  {
    id: 'TAL-simplest-tuthi',
    displayName: 'Simplest Tuthi',
    pseudo: '@simplesttuthi',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    type: 'macro',
    typeLabel: 'Macro-influenceur',
    status: 'actif',
    statusLabel: 'Partenaire actif Orange',
    category: 'Entrepreneuriat & Tech',
    city: 'Yaoundé / National',
    platforms: ['tiktok', 'instagram', 'facebook', 'youtube'],
    communityTotal: '920K',
    communities: {
      tiktok: '510K',
      instagram: '240K',
      facebook: '120K',
      youtube: '50K'
    },
    primaryAudience: {
      age: '20-35 ans (68%)',
      gender: '58% Hommes, 42% Femmes',
      location: 'Cameroun 88% (Yaoundé 45%, Douala 38%), Sous-région 12%',
      interests: 'Finances personnelles, Digital, E-commerce, Astuces Tech'
    },
    languages: ['Français', 'Anglais'],
    formatsMastered: ['Vidéo explicative face-cam', 'Tutoriel app', 'Carrousel pédagogique', 'Story test produit'],
    orangeHistory: {
      totalCampaigns: 0,
      lastCampaign: '—',
      totalContentPublished: 0,
      averageEngagementRate: '—',
      reliabilityScore: '—'
    },
    mccannRecommendation: {
      level: 'Hautement recommandé',
      score: 98,
      strategicRationale: 'Le pédagogue de référence pour la vulgarisation des fonctionnalités bancaires et digitales d’Orange Money. Rigueur éditoriale exemplaire et crédibilité maximale auprès des jeunes actifs.',
      recommendedOffer: 'Orange Money, Application Max It, Solutions Fibre Domicile'
    },
    complianceBadge: {
      contractSigned: true,
      imageRightsSecured: true,
      brandCharterValidated: true,
      adminDocumentsVerified: true,
      exclusivityActive: true,
      exclusivityDetails: 'Exclusivité Fintech / Opérateurs Télécoms jusqu’au 30/11/2026'
    },
    brandSafety: {
      riskLevel: 'Nul',
      vigilanceNotes: 'Profil extrêmement rigoureux, aucun écart éditorial relevé depuis 3 ans de collaboration.',
      framingGuidelines: 'Mettre à sa disposition les versions beta des fonctionnalités de l’application Max It.'
    },
    bio: 'Créateur de contenu spécialisé dans l’éducation financière, la transformation digitale et les technologies au Cameroun. Accompagne des milliers d’utilisateurs dans la maîtrise des outils numériques.'
  },
  {
    id: 'TAL-queen-diva',
    displayName: 'Queen Diva',
    pseudo: '@queendiva',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    type: 'macro',
    typeLabel: 'Macro-influenceur',
    status: 'actif',
    statusLabel: 'Partenaire actif Orange',
    category: 'Mode, Beauté & Lifestyle',
    city: 'Douala / Diaspora',
    platforms: ['instagram', 'tiktok', 'facebook'],
    communityTotal: '1.18M',
    communities: {
      instagram: '680K',
      tiktok: '380K',
      facebook: '120K'
    },
    primaryAudience: {
      age: '18-35 ans (74%)',
      gender: '68% Femmes, 32% Hommes',
      location: 'Cameroun 72%, France & Belgique 28%',
      interests: 'Mode africaine, Shopping, Lifestyle, Sorties, Musique'
    },
    languages: ['Français', 'Anglais'],
    formatsMastered: ['Reel esthétique', 'Story daily vlog', 'Carrousel lookbook', 'Live interactif'],
    orangeHistory: {
      totalCampaigns: 0,
      lastCampaign: '—',
      totalContentPublished: 0,
      averageEngagementRate: '—',
      reliabilityScore: '—'
    },
    mccannRecommendation: {
      level: 'Recommandé',
      score: 91,
      strategicRationale: 'Excellente pénétration sur le segment féminin CSP+ et la diaspora. Parfaite pour positionner Orange comme une marque d’élégance, de connectivité et de modernité.',
      recommendedOffer: 'Offres Roaming & Pass Voyage, Événements de marque Orange, Forfaits Lifestyle'
    },
    complianceBadge: {
      contractSigned: true,
      imageRightsSecured: true,
      brandCharterValidated: true,
      adminDocumentsVerified: true,
      exclusivityActive: true,
      exclusivityDetails: 'Exclusivité Télécoms active'
    },
    brandSafety: {
      riskLevel: 'Faible',
      vigilanceNotes: 'Vérifier la bonne présence des mentions légales de sponsoring dans les premières secondes des stories.',
      framingGuidelines: 'Privilégier un habillage soigné respectant les codes couleurs Orange.'
    },
    bio: 'Entrepreneure de mode et influenceuse lifestyle majeure en Afrique centrale. Ambassadrice de plusieurs marques internationales de prestige.'
  },
  {
    id: 'TAL-dr-ngassa',
    displayName: 'Dr. David Ngassa',
    pseudo: '@dr_ngassa',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    type: 'expert_b2b',
    typeLabel: 'Expert B2B / Leader d’opinion',
    status: 'recommande',
    statusLabel: 'Talent recommandé',
    category: 'Tech, Cloud & Entreprise B2B',
    city: 'Douala / Yaoundé',
    platforms: ['linkedin', 'x', 'youtube'],
    communityTotal: '115K',
    communities: {
      linkedin: '78K',
      x: '24K',
      youtube: '13K'
    },
    primaryAudience: {
      age: '28-55 ans (82%)',
      gender: '62% Hommes, 38% Femmes',
      location: 'Cameroun 75%, Afrique de l’Ouest & Centrale 25%',
      interests: 'Cloud computing, Cybersécurité, Télécoms Pro, Management'
    },
    languages: ['Français', 'Anglais'],
    formatsMastered: ['Article d’opinion LinkedIn', 'Carrousel infographique', 'Webinaire pro', 'Vidéo podcast'],
    orangeHistory: {
      totalCampaigns: 0,
      lastCampaign: '—',
      totalContentPublished: 0,
      averageEngagementRate: '—',
      reliabilityScore: '—'
    },
    mccannRecommendation: {
      level: 'Prioritaire B2B',
      score: 97,
      strategicRationale: 'Voix hautement crédible auprès des DSI, directeurs d’achats et chefs d’entreprises PME/PMI au Cameroun. Indispensable pour la conquête de parts de marché Orange Business.',
      recommendedOffer: 'Orange Business Cloud, Fibre Pro Sécurisée, Solutions IoT PME'
    },
    complianceBadge: {
      contractSigned: true,
      imageRightsSecured: true,
      brandCharterValidated: true,
      adminDocumentsVerified: true,
      exclusivityActive: false,
      exclusivityDetails: 'Pas d’exclusivité formelle demandée hors période d’activation active'
    },
    brandSafety: {
      riskLevel: 'Nul',
      vigilanceNotes: 'Discours technique irréprochable et mesuré.',
      framingGuidelines: 'Co-rédiger les fiches techniques avec l’équipe Produit Orange Business.'
    },
    bio: 'Ingénieur en télécommunications et consultant senior en transformation digitale des entreprises en Afrique centrale. Auteur de nombreuses tribunes économiques.'
  },
  {
    id: 'TAL-mayole-francine',
    displayName: 'Mayole Francine',
    pseudo: '@mayolefrancine',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    type: 'micro',
    typeLabel: 'Micro-influenceur',
    status: 'actif',
    statusLabel: 'Partenaire actif Orange',
    category: 'Famille, Éducation & Société',
    city: 'Bafoussam / Ouest',
    platforms: ['facebook', 'tiktok', 'instagram'],
    communityTotal: '240K',
    communities: {
      facebook: '140K',
      tiktok: '75K',
      instagram: '25K'
    },
    primaryAudience: {
      age: '25-45 ans (78%)',
      gender: '72% Femmes, 28% Hommes',
      location: 'Régions de l’Ouest, Littoral et Centre Cameroun',
      interests: 'Vie de famille, Scolarité, Épargne des ménages, Solidarité'
    },
    languages: ['Français', 'Ghomálá’', 'Camfranglais'],
    formatsMastered: ['Vlog du quotidien', 'Vidéo conseil pratique', 'Story témoignage réel', 'Reel tuto'],
    orangeHistory: {
      totalCampaigns: 0,
      lastCampaign: '—',
      totalContentPublished: 0,
      averageEngagementRate: '—',
      reliabilityScore: '—'
    },
    mccannRecommendation: {
      level: 'Recommandé Proximité',
      score: 93,
      strategicRationale: 'Excellente ancre régionale pour les campagnes à fort impact sociétal. Permet à Orange de toucher les mères de famille et les responsables de foyers hors des grandes métropoles.',
      recommendedOffer: 'Paiement scolarité Orange Money, Forfaits Famille, Pass Région'
    },
    complianceBadge: {
      contractSigned: true,
      imageRightsSecured: true,
      brandCharterValidated: true,
      adminDocumentsVerified: true,
      exclusivityActive: true,
      exclusivityDetails: 'Exclusivité Télécoms & Paiements'
    },
    brandSafety: {
      riskLevel: 'Nul',
      vigilanceNotes: 'Tonalité chaleureuse, respectueuse des valeurs familiales.',
      framingGuidelines: 'Valider les mises en situation budgétaires réelles.'
    },
    bio: 'Éducatrice et créatrice de contenu familial basée à Bafoussam. Partage des astuces d’organisation familiale et de gestion du budget domestique.'
  },
  {
    id: 'TAL-bkbaptist',
    displayName: 'Bk Baptist',
    pseudo: '@bkbaptist',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    type: 'macro',
    typeLabel: 'Macro-influenceur',
    status: 'actif',
    statusLabel: 'Partenaire actif Orange',
    category: 'Musique, Danse & Culture',
    city: 'Douala / Littoral',
    platforms: ['tiktok', 'instagram', 'youtube'],
    communityTotal: '880K',
    communities: {
      tiktok: '620K',
      instagram: '210K',
      youtube: '50K'
    },
    primaryAudience: {
      age: '16-28 ans (85%)',
      gender: '50% Hommes, 50% Femmes',
      location: 'Cameroun 80%, Afrique Centrale 20%',
      interests: 'Afrobeats, Danse urbaine, Mode streetwear, Défis viraux'
    },
    languages: ['Français', 'Anglais', 'Pidgin'],
    formatsMastered: ['Chorégraphie virale', 'Sound design TikTok', 'Reel musical', 'Duo & Stitch'],
    orangeHistory: {
      totalCampaigns: 0,
      lastCampaign: '—',
      totalContentPublished: 0,
      averageEngagementRate: '—',
      reliabilityScore: '—'
    },
    mccannRecommendation: {
      level: 'Recommandé Viralité',
      score: 94,
      strategicRationale: 'Capacité avérée à lancer des tendances de danse et de jingles musicaux qui se propagent sur TikTok et WhatsApp Status. Moteur d’engagement jeunesse garanti.',
      recommendedOffer: 'Orange Pulse, Pass Streaming & Réseaux Sociaux, Concerts partenaires Orange'
    },
    complianceBadge: {
      contractSigned: true,
      imageRightsSecured: true,
      brandCharterValidated: true,
      adminDocumentsVerified: true,
      exclusivityActive: true,
      exclusivityDetails: 'Exclusivité Télécoms active'
    },
    brandSafety: {
      riskLevel: 'Moyen',
      vigilanceNotes: 'Vérifier systématiquement les droits musicaux des bandes sonores utilisées pour éviter tout blocage d’algorithme.',
      framingGuidelines: 'Utiliser exclusivement les musiques libres de droits ou le jingle sonore officiel Orange.'
    },
    bio: 'Danseur professionnel et créateur de contenu musical renommé. A chorégraphié plusieurs défis viraux adoptés à travers toute l’Afrique centrale.'
  }
];

// ─── 5. PORTEFEUILLE DES CAMPAGNES & ACTIVATIONS (PAGES 3 & 4) ───
export const INITIAL_CLIENT_CAMPAIGNS = [];

// ─── 6. CALENDRIER DE DIFFUSION & CONTENUS (PAGE 4) ───
// Inclut dates tournage, soumission BAT, validation Orange, publication prévues, détecteur de conflits
export const INITIAL_CLIENT_CALENDAR_ITEMS = [];

// ─── 7. CENTRE DE VALIDATION ORANGE & CHECKLIST CONFORMITÉ (PAGE 5) ───
// Centralise : Shortlists, Casting, Briefs, Concepts, Scripts, BAT visuels, Légendes/Hashtags/Mentions, Plans de publication, Bilans
export const INITIAL_CLIENT_VALIDATIONS = [];

// ─── 8. REGISTRE DES ALERTES INFLUENCE (PAGE 5 DU CAHIER DES CHARGES) ───
export const INITIAL_CLIENT_ALERTS = [];

// ─── 9. REPORTING MULTIDIMENSIONNEL & BEST PERFORMERS (PAGE 6) ───
export const INITIAL_CLIENT_REPORTING = {
  // Top 5 Talents par Engagement
  topTalentsEngagement: [
    { rank: 1, name: 'Bk Baptist', pseudo: '@bkbaptist', platform: 'tiktok', views: '1.2M', engagements: '109.2K', rate: '9.1%', status: 'Surperformance', recommendation: 'Reconduire & Élargir' },
    { rank: 2, name: 'Mayole Francine', pseudo: '@mayolefrancine', platform: 'facebook', views: '680K', engagements: '55.7K', rate: '8.2%', status: 'Excellente proximité', recommendation: 'Reconduire' },
    { rank: 3, name: 'Dr. David Ngassa', pseudo: '@dr_ngassa', platform: 'linkedin', views: '460K', engagements: '35.8K', rate: '7.8%', status: 'Lead generator', recommendation: 'Poursuivre B2B' },
    { rank: 4, name: 'Carles Antonio', pseudo: '@carlesantonio', platform: 'tiktok', views: '2.4M', engagements: '153.6K', rate: '6.4%', status: 'Tête de pont', recommendation: 'Reconduire' },
    { rank: 5, name: 'Simplest Tuthi', pseudo: '@simplesttuthi', platform: 'tiktok', views: '1.8M', engagements: '104.4K', rate: '5.8%', status: 'Pédagogie solide', recommendation: 'Reconduire' },
  ],

  // Top 5 Talents par Portée / Impressions
  topTalentsReach: [
    { rank: 1, name: 'Carles Antonio', reach: '3.8M impressions', views: '2.4M', followers: '1.45M', costRatio: 'Optimal' },
    { rank: 2, name: 'Queen Diva', reach: '2.9M impressions', views: '1.6M', followers: '1.18M', costRatio: 'Très bon' },
    { rank: 3, name: 'Simplest Tuthi', reach: '2.6M impressions', views: '1.8M', followers: '920K', costRatio: 'Excellent' },
    { rank: 4, name: 'Bk Baptist', reach: '1.9M impressions', views: '1.2M', followers: '880K', costRatio: 'Très fort' },
    { rank: 5, name: 'Mayole Francine', reach: '1.1M impressions', views: '680K', followers: '240K', costRatio: 'Très performant' },
  ],

  // Top Contenus Vidéo
  topVideoContents: [
    { rank: 1, title: 'Sketch Défi Gaming Pulse #MaxiData', creator: 'Carles Antonio', format: 'TikTok', views: '1.45M', comments: '3 840', shares: '12 400', retentionRate: '68%' },
    { rank: 2, title: 'Chorégraphie Pulse Dance Challenge', creator: 'Bk Baptist', format: 'Reel IG', views: '980K', comments: '2 150', shares: '8 900', retentionRate: '74%' },
    { rank: 3, title: 'Démonstration Retrait QR Code Sans Frais', creator: 'Simplest Tuthi', format: 'TikTok', views: '840K', comments: '1 980', shares: '5 400', retentionRate: '62%' },
  ],

  // Comparaison par format
  formatComparison: [
    { format: 'Reel Instagram', count: 18, avgViews: '142K', avgEngagement: '6.2%', sentiment: '94% Positif' },
    { format: 'TikTok Vidéo', count: 24, avgViews: '215K', avgEngagement: '7.8%', sentiment: '91% Positif' },
    { format: 'Carrousel LinkedIn / IG', count: 8, avgViews: '58K', avgEngagement: '8.4%', sentiment: '98% Positif' },
    { format: 'Story Interactive', count: 42, avgViews: '48K', avgEngagement: '4.1%', sentiment: '92% Positif' },
    { format: 'Vidéo Longue YouTube', count: 4, avgViews: '85K', avgEngagement: '5.2%', sentiment: '95% Positif' },
  ],

  // Statuts de gouvernance talents
  governanceTalents: [
    { name: 'Carles Antonio', category: 'Humour', statusAction: 'reconduire', label: 'À Reconduire', note: 'Partenaire stratégique incontournable pour les cibles jeunes.' },
    { name: 'Simplest Tuthi', category: 'Fintech', statusAction: 'reconduire', label: 'À Reconduire', note: 'Excellente rigueur et maîtrise des offres Orange Money.' },
    { name: 'Dr. David Ngassa', category: 'B2B', statusAction: 'reconduire', label: 'À Reconduire', note: 'Pilier d’autorité pour les solutions Orange Business.' },
    { name: 'Profil Test Lifestyle C', category: 'Mode', statusAction: 'challenger', label: 'À Challenger', note: 'Portée satisfaisante mais taux d’engagement en baisse (3.1%). Proposer une nouvelle mécanique.' },
    { name: 'Créateur Z (Ancien Partenaire)', category: 'Vlog', statusAction: 'remplacer', label: 'À Remplacer', note: 'Retards répétés sur les soumissions BAT et baisse d’affinité d’audience.' },
  ]
};

// ─── 10. VEILLE, BENCHMARK & RECOMMANDATIONS ACTIONNABLES (PAGE 7) ───
// Fiches en 6 points structurés :
// 1. Constat — 2. Preuve — 3. Interprétation — 4. Décision recommandée — 5. Hypothèse de test — 6. Statut Orange
export const INITIAL_CLIENT_RECOMMENDATIONS = [
  {
    id: 'REC-2026-001',
    title: 'Déploiement d’un format "Micro-Tutos Démo Écran" sur TikTok pour Orange Money',
    constat: 'Les vidéos axées sur la démonstration directe en split-screen génèrent 2.4x plus de conversions vers le téléchargement de l’application que les sketchs purement humoristiques.',
    preuve: 'Tutoriel @simplesttuthi (840K vues, 19 400 clics de redirection app, taux de complétion de 62%) vs sketch générique (portée équivalente mais seulement 4 100 clics).',
    interpretation: 'L’audience camerounaise sur TikTok recherche des solutions concrètes pour économiser sur les frais de transaction et a besoin de voir l’interface réelle pour être rassurée sur la simplicité d’usage.',
    decisionRecommandee: 'répliquer', // 'amplifier' | 'répliquer' | 'adapter' | 'arrêter' | 'tester'
    decisionLabel: 'Répliquer & Standardiser',
    hypotheseTest: 'Produire une série de 4 micro-tutos de 30 secondes avec deux nouveaux créateurs de la région Ouest et Nord pour tester la réceptivité en dehors de Douala et Yaoundé.',
    statutDecisionOrange: 'accepte', // 'a_examiner' | 'accepte' | 'en_test' | 'cloture'
    statutLabel: 'Accepté par Orange (En préparation)',
    date: '2026-09-18',
    entity: 'orange_money',
    budgetEstime: '3 500 000 FCFA'
  },
  {
    id: 'REC-2026-002',
    title: 'Amplification Média ciblée sur les contenus viraux de danse Pulse',
    constat: 'Le son officiel du défi Orange Pulse a été réutilisé de façon organique par plus de 450 créateurs secondaires, créant un effet boule de neige inattendu.',
    preuve: 'Surperformance du post de @bkbaptist (+38% vs moyenne) et émergence de challenges spontanés dans les campus universitaires de Dschang et Buea.',
    interpretation: 'La dynamique virale est actuellement à son zénith. Sans amplification média payante immédiate, l’attention risque de retomber d’ici 10 jours au profit d’une campagne concurrente.',
    decisionRecommandee: 'amplifier',
    decisionLabel: 'Amplifier d’Urgence',
    hypotheseTest: 'Injecter une enveloppe de 1 500 000 FCFA en TikTok Spark Ads sur les vidéos des 3 meilleurs créateurs participants pour convertir la viralité en activation de forfaits Pulse.',
    statutDecisionOrange: 'a_examiner',
    statutLabel: 'À examiner par Orange (Comité Comms)',
    date: '2026-09-20',
    entity: 'orange_cm',
    budgetEstime: '1 500 000 FCFA'
  },
  {
    id: 'REC-2026-003',
    title: 'Expérimentation du format Carrousel LinkedIn orienté "Retour sur Investissement Cloud" pour Orange Business',
    constat: 'Les décideurs B2B au Cameroun interagissent très peu avec les vidéos promotionnelles génériques, mais enregistrent massivement les carrousels de cas d’études chiffrés.',
    preuve: 'Le carrousel du Dr. David Ngassa sur la cybersécurité des PME a généré un taux de sauvegarde record de 8.4% et 142 demandes d’audit qualifiées.',
    interpretation: 'Les DSI et chefs d’entreprises ont besoin d’arguments tangibles à présenter à leurs comités de direction pour justifier une migration vers les offres Cloud Orange Business.',
    decisionRecommandee: 'tester',
    decisionLabel: 'Tester une Nouvelle Mécanique',
    hypotheseTest: 'Co-construire une série de 3 carrousels "Success Story Client Camerounais" avec un chef d’entreprise de l’agro-industrie utilisant la Fibre Pro et le Cloud souverain.',
    statutDecisionOrange: 'en_test',
    statutLabel: 'En cours de test (Phase pilote)',
    date: '2026-09-15',
    entity: 'orange_business',
    budgetEstime: '2 800 000 FCFA'
  }
];

// Veille Marché et Benchmark Concurrents (MTN, Moov, Wave au Cameroun)
export const INITIAL_CLIENT_BENCHMARK = [
  {
    competitor: 'MTN Cameroun',
    color: '#FFCC00',
    campaignObserved: 'MTN Y’ello Pulse Gaming League',
    influencersMobilized: 26,
    mainPlatform: 'TikTok & Discord',
    estimatedShareOfVoice: '44%',
    analysis: 'Stratégie très agressive sur le gaming avec dotations en espèces et tournois hebdomadaires. Risque de saturation sur les 18-20 ans.',
    orangeCountermeasure: 'Miser sur la qualité et la stabilité du réseau 4.5G Orange avec des preuves de débit in-game.'
  },
  {
    competitor: 'Moov Africa',
    color: '#0066CC',
    campaignObserved: 'Moov Money Zéro Frais Retrait',
    influencersMobilized: 12,
    mainPlatform: 'Facebook & Radios locales',
    estimatedShareOfVoice: '18%',
    analysis: 'Campagne de proximité axée sur les régions rurales et périurbaines avec des comédiens traditionnels.',
    orangeCountermeasure: 'Valoriser la modernité et l’étendue du réseau d’agents de distribution Orange Money.'
  },
  {
    competitor: 'Wave Cameroun',
    color: '#1DC4F2',
    campaignObserved: 'Wave QR Code Parrainage 1000F',
    influencersMobilized: 18,
    mainPlatform: 'Instagram & TikTok',
    estimatedShareOfVoice: '22%',
    analysis: 'Parrainage d’influenceurs lifestyle avec code promo individuel générant un bouche-à-oreille important chez les commerçantes.',
    orangeCountermeasure: 'Mettre en avant la sécurité, l’ancienneté et l’écosystème complet Orange Money (Épargne Otélé, Paiement factures Eneo/Camwater).'
  }
];
