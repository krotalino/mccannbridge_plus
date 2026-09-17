// Données de base et structure pour Social Ads & Display (Community Managers)

export const INITIAL_SOCIAL_ADS = [
  {
    id: 'SOC-001',
    client: 'Orange Cameroun',
    clientLogo: '🍊',
    platform: 'Meta', // Facebook & Instagram
    platformIcon: 'facebook',
    campaignName: 'Promo Max It 5G · Rentrée Connectée',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    budgetTotal: 3500000,
    budgetSpent: 3220000, // >90% -> alerte
    impressions: 1450000,
    clics: 42500,
    ctr: 2.93,
    cpc: 75.76,
    status: 'Active',
    objective: 'Téléchargements d\'application',
    targetAudience: '18-35 ans · Yaoundé, Douala, Bafoussam · Intérêts: Tech, Gaming, Lifestyle',
    visualUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    copyText: '🚀 Passez à la vitesse supérieure avec la 5G Orange ! Téléchargez l\'application Max It dès aujourd\'hui et profitez de 10 Go offerts pour votre rentrée. #OrangeCameroun #MaxIt #5G',
    organicReach: 142000,
    paidReach: 1180000,
    organicEngagement: 18400,
    paidEngagement: 68900,
    budgetHistory: [
      {
        id: 'BH-101',
        date: '2026-09-01 09:00',
        author: 'Sarah M. (Media Buyer)',
        changeAmount: '+2 500 000 FCFA',
        newBudget: 2500000,
        reason: 'Allocation initiale de la campagne de rentrée'
      },
      {
        id: 'BH-102',
        date: '2026-09-12 14:30',
        author: 'Alain K. (Head of Social)',
        changeAmount: '+1 000 000 FCFA',
        newBudget: 3500000,
        reason: 'Sur-performance du CTR (+2.9%) et forte traction téléchargements Max It'
      }
    ]
  },
  {
    id: 'SOC-002',
    client: 'Canal+ Cameroun',
    clientLogo: '📺',
    platform: 'TikTok',
    platformIcon: 'tiktok',
    campaignName: 'Pack English Premier League · Weekend Foot',
    startDate: '2026-09-05',
    endDate: '2026-09-28',
    budgetTotal: 2200000,
    budgetSpent: 1650000,
    impressions: 2180000,
    clics: 38400,
    ctr: 1.76,
    cpc: 42.96,
    status: 'Active',
    objective: 'Engagement & Réabonnement',
    targetAudience: '16-40 ans · Tout Cameroun · Passionnés de Football & Sport',
    visualUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    copyText: '⚽ Le choc Arsenal vs Man City se vit en direct et en HD sur CANAL+ Sport ! Réabonnez-vous en 2 clics via Orange Money ou MTN MoMo sans bouger de votre canapé.',
    organicReach: 280000,
    paidReach: 1720000,
    organicEngagement: 45000,
    paidEngagement: 124000,
    budgetHistory: [
      {
        id: 'BH-201',
        date: '2026-09-05 10:00',
        author: 'Christian D. (CM Canal+)',
        changeAmount: '+2 200 000 FCFA',
        newBudget: 2200000,
        reason: 'Budget validé pour la couverture des 4 grands matchs de septembre'
      }
    ]
  },
  {
    id: 'SOC-003',
    client: 'TotalEnergies',
    clientLogo: '⛽',
    platform: 'LinkedIn',
    platformIcon: 'linkedin',
    campaignName: 'Programme Jeunes Talents & Transition Énergétique',
    startDate: '2026-08-15',
    endDate: '2026-09-15',
    budgetTotal: 1800000,
    budgetSpent: 1800000,
    impressions: 480000,
    clics: 12600,
    ctr: 2.62,
    cpc: 142.85,
    status: 'Terminée',
    objective: 'Recrutement & Image Institutionnelle',
    targetAudience: 'Diplômés Universités & Grandes Écoles · Ingénieurs · Douala, Yaoundé',
    visualUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    copyText: 'Rejoignez les bâtisseurs de l\'énergie de demain en Afrique centrale. Le programme Jeunes Cadres TotalEnergies Cameroun ouvre ses candidatures pour la promotion 2026-2027.',
    organicReach: 85000,
    paidReach: 390000,
    organicEngagement: 9200,
    paidEngagement: 21500,
    budgetHistory: [
      {
        id: 'BH-301',
        date: '2026-08-15 08:30',
        author: 'Françoise N. (HR Brand)',
        changeAmount: '+1 800 000 FCFA',
        newBudget: 1800000,
        reason: 'Lancement de la campagne institutionnelle annuelle'
      }
    ]
  },
  {
    id: 'SOC-004',
    client: 'Guinness Cameroun',
    clientLogo: '🍺',
    platform: 'Instagram',
    platformIcon: 'instagram',
    campaignName: 'Guinness Smooth Session · Soirées Akwa',
    startDate: '2026-09-08',
    endDate: '2026-09-25',
    budgetTotal: 1500000,
    budgetSpent: 620000,
    impressions: 890000,
    clics: 5800,
    ctr: 0.65, // < 0.8% -> alerte CTR bas
    cpc: 106.89,
    status: 'Active',
    objective: 'Trafic Événementiel',
    targetAudience: '21-38 ans · Douala (Akwa, Bonapriso, Bonamoussadi)',
    visualUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    copyText: 'La fraîcheur et l\'audace au rendez-vous ce vendredi. Découvrez l\'expérience Smooth dans vos spots préférés à Douala. Consommez avec modération (+21).',
    organicReach: 95000,
    paidReach: 740000,
    organicEngagement: 11200,
    paidEngagement: 28400,
    budgetHistory: [
      {
        id: 'BH-401',
        date: '2026-09-08 11:15',
        author: 'Kevin B. (Social Ads)',
        changeAmount: '+1 500 000 FCFA',
        newBudget: 1500000,
        reason: 'Budget initial boost Instagram Ads'
      }
    ]
  },
  {
    id: 'SOC-005',
    client: 'Orange Cameroun',
    clientLogo: '🍊',
    platform: 'X',
    platformIcon: 'twitter',
    campaignName: 'Live Event Orange Money Flash Promo',
    startDate: '2026-09-02',
    endDate: '2026-09-10',
    budgetTotal: 900000,
    budgetSpent: 900000,
    impressions: 620000,
    clics: 14200,
    ctr: 2.29,
    cpc: 63.38,
    status: 'Terminée',
    objective: 'Engagement Conversationnel & Promo',
    targetAudience: 'Utilisateurs X Cameroun · Tech & Fintech · 20-45 ans',
    visualUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    copyText: 'Envoyez de l\'argent à vos proches avec 0 frais de transfert aujourd\'hui uniquement avec Orange Money ! Tapez #150# ou ouvrez Max It. #OrangeMoneyZeroFrais',
    organicReach: 110000,
    paidReach: 490000,
    organicEngagement: 19500,
    paidEngagement: 34000,
    budgetHistory: [
      {
        id: 'BH-501',
        date: '2026-09-02 08:00',
        author: 'Sarah M.',
        changeAmount: '+900 000 FCFA',
        newBudget: 900000,
        reason: 'Budget flash 8 jours sur X Ads'
      }
    ]
  },
  {
    id: 'SOC-006',
    client: 'Nestlé Cameroun',
    clientLogo: '🥛',
    platform: 'Facebook',
    platformIcon: 'facebook',
    campaignName: 'Nido Croissance · Le Petit-Déjeuner des Champions',
    startDate: '2026-09-10',
    endDate: '2026-10-10',
    budgetTotal: 2800000,
    budgetSpent: 850000,
    impressions: 1120000,
    clics: 28900,
    ctr: 2.58,
    cpc: 29.41,
    status: 'En pause',
    objective: 'Notoriété & Confiance de Marque',
    targetAudience: 'Parents 25-45 ans · Femmes & Hommes · Toutes villes Cameroun',
    visualUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    copyText: 'Offrez à vos enfants toute l\'énergie nécessaire pour briller à l\'école avec Nido Croissance, enrichi en fer, zinc et vitamines essentielles. #NidoChampions',
    organicReach: 160000,
    paidReach: 890000,
    organicEngagement: 24000,
    paidEngagement: 62000,
    budgetHistory: [
      {
        id: 'BH-601',
        date: '2026-09-10 10:00',
        author: 'Clarisse T.',
        changeAmount: '+2 800 000 FCFA',
        newBudget: 2800000,
        reason: 'Campagne de rentrée scolaire mères de famille'
      }
    ]
  }
];

export const INITIAL_DISPLAY_CAMPAIGNS = [
  {
    id: 'DISP-001',
    client: 'Orange Cameroun',
    clientLogo: '🍊',
    campaignName: 'Fibre Optique Pro · Douala & Yaoundé',
    displayType: 'Bannière',
    format: '300x250 Pavé',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    period: '01 Sep - 30 Sep 2026',
    budgetTotal: 2500000,
    budgetSpent: 2320000, // >90% -> alerte
    impressions: 2450000,
    clics: 29400,
    ctr: 1.20,
    cpm: 946.93,
    conversions: 840,
    conversionRate: 2.85,
    status: 'Active',
    creativePreview: {
      headline: 'Boostez votre entreprise avec la Fibre Orange 100 Mbps',
      description: 'Installation offerte sous 48h pour toute souscription PME avant le 30 septembre.',
      callToAction: 'Demander un devis pro',
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      brandColor: '#ff7900'
    },
    placements: [
      { siteName: 'Camfoot.com', category: 'Sport & Actualités', impressions: 720000, clics: 9800, ctr: 1.36, sharePct: 30 },
      { siteName: 'ActuCameroun.com', category: 'Presse & Info', impressions: 680000, clics: 8400, ctr: 1.23, sharePct: 28 },
      { siteName: 'Google Display Network (Cameroun)', category: 'Réseau Généraliste', impressions: 550000, clics: 6100, ctr: 1.10, sharePct: 22 },
      { siteName: 'Eskimi DSP Local Network', category: 'Réseau Mobile Local', impressions: 320000, clics: 3600, ctr: 1.12, sharePct: 13 },
      { siteName: 'LeBledParle.com', category: 'Société & Débats', impressions: 180000, clics: 1500, ctr: 0.83, sharePct: 7 }
    ]
  },
  {
    id: 'DISP-002',
    client: 'Canal+ Cameroun',
    clientLogo: '📺',
    campaignName: 'Décodeur HD à 1000 FCFA · Offre Choc',
    displayType: 'Vidéo',
    format: '16:9 Preroll Vidéo',
    startDate: '2026-09-05',
    endDate: '2026-09-26',
    period: '05 Sep - 26 Sep 2026',
    budgetTotal: 3000000,
    budgetSpent: 2150000,
    impressions: 1850000,
    clics: 41200,
    ctr: 2.22,
    cpm: 1162.16,
    conversions: 1460,
    conversionRate: 3.54,
    status: 'Active',
    creativePreview: {
      headline: 'Le décodeur HD à 1 000 FCFA seulement dès 1 mois de formule',
      description: 'Retrouvez toutes les chaînes nationales et internationales en qualité numérique.',
      callToAction: 'Profiter de l\'offre',
      imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80',
      brandColor: '#0f172a'
    },
    placements: [
      { siteName: 'YouTube Ads (Afrique Centrale)', category: 'Vidéo Streaming', impressions: 850000, clics: 22400, ctr: 2.63, sharePct: 46 },
      { siteName: 'Opera News App', category: 'Agrégateur Mobile', impressions: 480000, clics: 10200, ctr: 2.12, sharePct: 26 },
      { siteName: 'Cameroon-Info.Net', category: 'Presse Nationale', impressions: 320000, clics: 5400, ctr: 1.68, sharePct: 17 },
      { siteName: 'Eskimi Video Pre-roll', category: 'DSP Vidéo', impressions: 200000, clics: 3200, ctr: 1.60, sharePct: 11 }
    ]
  },
  {
    id: 'DISP-003',
    client: 'TotalEnergies',
    clientLogo: '⛽',
    campaignName: 'Carte Pétrolière Fleet & Carte Recharge Électrique',
    displayType: 'Bannière',
    format: '728x90 Mégabannière',
    startDate: '2026-08-20',
    endDate: '2026-09-12',
    period: '20 Août - 12 Sep 2026',
    budgetTotal: 1600000,
    budgetSpent: 1600000,
    impressions: 1200000,
    clics: 10800,
    ctr: 0.90,
    cpm: 1333.33,
    conversions: 320,
    conversionRate: 2.96,
    status: 'Terminée',
    creativePreview: {
      headline: 'Gérez vos flottes d\'entreprises avec précision et traçabilité',
      description: 'Contrôlez les consommations de carburant de vos collaborateurs en temps réel.',
      callToAction: 'Commander vos cartes',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      brandColor: '#e11d48'
    },
    placements: [
      { siteName: 'InvestirAuCameroun.com', category: 'Économie & Business', impressions: 510000, clics: 5100, ctr: 1.00, sharePct: 43 },
      { siteName: 'BusinessInCameroon.com', category: 'Finance Internationale', impressions: 390000, clics: 3600, ctr: 0.92, sharePct: 32 },
      { siteName: 'Google Display Network B2B', category: 'Réseau B2B', impressions: 300000, clics: 2100, ctr: 0.70, sharePct: 25 }
    ]
  },
  {
    id: 'DISP-004',
    client: 'Orange Cameroun',
    clientLogo: '🍊',
    campaignName: 'Assurance Santé Mobile · Orange Vie',
    displayType: 'Natif',
    format: 'Natif In-feed (Article sponsorisé)',
    startDate: '2026-09-08',
    endDate: '2026-09-29',
    period: '08 Sep - 29 Sep 2026',
    budgetTotal: 1400000,
    budgetSpent: 450000,
    impressions: 980000,
    clics: 5200,
    ctr: 0.53, // < 0.8% -> alerte CTR bas
    cpm: 459.18,
    conversions: 180,
    conversionRate: 3.46,
    status: 'Active',
    creativePreview: {
      headline: 'Comment protéger sa famille au Cameroun pour moins de 1 000 FCFA/mois',
      description: 'L\'offre de micro-assurance médicale pensée pour tous les foyers camerounais.',
      callToAction: 'Découvrir la couverture',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      brandColor: '#ff7900'
    },
    placements: [
      { siteName: 'ActuCameroun.com', category: 'Presse Générale', impressions: 420000, clics: 2300, ctr: 0.54, sharePct: 43 },
      { siteName: 'CameroonWeb.com', category: 'Portail d\'actualités', impressions: 340000, clics: 1800, ctr: 0.52, sharePct: 35 },
      { siteName: 'Eskimi Native Ads', category: 'DSP Native', impressions: 220000, clics: 1100, ctr: 0.50, sharePct: 22 }
    ]
  },
  {
    id: 'DISP-005',
    client: 'Guinness Cameroun',
    clientLogo: '🍺',
    campaignName: 'Black Shines Brightest · Campagne Digitale Urbaine',
    displayType: 'Interstitiel',
    format: '320x480 Plein Écran Mobile',
    startDate: '2026-09-03',
    endDate: '2026-09-22',
    period: '03 Sep - 22 Sep 2026',
    budgetTotal: 2000000,
    budgetSpent: 1200000,
    impressions: 1600000,
    clics: 28800,
    ctr: 1.80,
    cpm: 750.00,
    conversions: 950,
    conversionRate: 3.30,
    status: 'En pause',
    creativePreview: {
      headline: 'Célébrez l\'audace et la créativité avec Guinness',
      description: 'Participez au grand challenge des créateurs urbains et gagnez des pass VIP.',
      callToAction: 'Rejoindre le mouvement',
      imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80',
      brandColor: '#1c1917'
    },
    placements: [
      { siteName: 'Audiomack Cameroun', category: 'Musique Streaming', impressions: 750000, clics: 14500, ctr: 1.93, sharePct: 47 },
      { siteName: 'Boomplay Music', category: 'Musique Streaming', impressions: 510000, clics: 9100, ctr: 1.78, sharePct: 32 },
      { siteName: 'Eskimi Gaming Interstitial', category: 'Jeux Mobiles', impressions: 340000, clics: 5200, ctr: 1.52, sharePct: 21 }
    ]
  }
];

export const INITIAL_API_REGIES = [
  {
    id: 'meta',
    name: 'Meta Ads (Facebook & Instagram)',
    provider: 'Graph API v19.0',
    icon: 'facebook',
    connected: true,
    lastSync: '2026-09-17 06:45',
    adAccountId: 'act_492019482019',
    autoSync: true,
    status: 'Connecté (Token Actif)'
  },
  {
    id: 'google',
    name: 'Google Ads & Display Network',
    provider: 'Google Ads API v16',
    icon: 'google',
    connected: true,
    lastSync: '2026-09-17 06:12',
    adAccountId: '829-491-0392',
    autoSync: true,
    status: 'Connecté (Token Actif)'
  },
  {
    id: 'eskimi',
    name: 'Eskimi DSP (Local African Inventory)',
    provider: 'Eskimi REST API v2',
    icon: 'globe',
    connected: true,
    lastSync: '2026-09-17 05:30',
    adAccountId: 'ESK-CMR-9921',
    autoSync: true,
    status: 'Connecté (Token Actif)'
  },
  {
    id: 'tiktok',
    name: 'TikTok for Business API',
    provider: 'Marketing API v1.3',
    icon: 'tiktok',
    connected: false,
    lastSync: 'Jamais',
    adAccountId: 'Non configuré',
    autoSync: false,
    status: 'Déconnecté'
  }
];
