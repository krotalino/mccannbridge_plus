// Moteur d'agrégation et de calcul analytique transverse pour Bridge
// Alimente le module Dashboard Analytics avec des statistiques transverses, filtrables et synchronisées.

import { FINANCIAL_DATA } from '../../data/financial';
import { INITIAL_CALENDAR } from '../../data/calendar';
import { INITIAL_INFLUENCE_TALENTS } from '../../data/influenceSeedData';
import { INITIAL_USERS } from '../../data/initialUsers';

export const CLIENT_OPTIONS = [
  { id: 'all', label: 'Tous les clients', color: '#FF7900' },
  { id: 'orange-cameroun', label: 'Orange Cameroun', short: 'Orange CM', color: '#FF7900' },
  { id: 'orange-burkina', label: 'Orange Burkina Faso', short: 'Orange BF', color: '#E06800' },
  { id: 'boissons-du-cameroun', label: 'Boissons du Cameroun', short: 'SABC', color: '#E53935' },
  { id: 'chococam', label: 'Chococam (Tiger Brands)', short: 'Chococam', color: '#8D6E63' }
];

export const CHANNEL_OPTIONS = [
  { id: 'all', label: 'Tous les canaux', icon: '🌐', color: '#FF7900' },
  { id: 'facebook', label: 'Facebook', icon: '🔵', color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', icon: '📸', color: '#E4405F' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: '#111111' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  { id: 'twitter', label: 'X (Twitter)', icon: '✖️', color: '#000000' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', color: '#FF0000' }
];

export const PERIOD_OPTIONS = [
  { id: 'all', label: 'Tout l’historique' },
  { id: 'day', label: 'Aujourd’hui (24h)' },
  { id: 'week', label: 'Cette semaine (S16)' },
  { id: 'month', label: 'Ce mois-ci (Mai 2026)' },
  { id: 'quarter', label: 'Ce trimestre (Q2 2026)' },
  { id: 'year', label: 'Année 2026' },
  { id: 'custom', label: 'Personnalisé' }
];

export const CONTENT_TYPES = [
  { id: 'reel', label: 'Reel / Vidéo Courte', icon: '🎬' },
  { id: 'carrousel', label: 'Carrousel Multi-visuels', icon: '📚' },
  { id: 'post', label: 'Post Visuel Simple', icon: '🖼️' },
  { id: 'story', label: 'Story Éphémère', icon: '⚡' },
  { id: 'article', label: 'Article / Infographie', icon: '📰' }
];

// Base riche de publications pour assurer un reporting complet sur l'ensemble des comptes McCann
const SEED_PUBLICATIONS = [
  // Orange Cameroun
  {
    id: 'PUB-001',
    client: 'orange-cameroun',
    clientName: 'Orange Cameroun',
    titre: 'Maxit Promo Éclair 50% sur forfaits Data 4G',
    canal: 'facebook',
    type: 'carrousel',
    statut: 'publie',
    date: '2026-05-14',
    sponsoring: true,
    budgetAds: 250000,
    impressions: 145000,
    clics: 5800,
    engagements: 8900,
    reach: 112000,
    conversions: 420
  },
  {
    id: 'PUB-002',
    client: 'orange-cameroun',
    clientName: 'Orange Cameroun',
    titre: 'OM Money : Tuto transfert vers toutes banques CEMAC',
    canal: 'instagram',
    type: 'reel',
    statut: 'publie',
    date: '2026-05-12',
    sponsoring: true,
    budgetAds: 180000,
    impressions: 98000,
    clics: 3900,
    engagements: 7200,
    reach: 79000,
    conversions: 310
  },
  {
    id: 'PUB-003',
    client: 'orange-cameroun',
    clientName: 'Orange Cameroun',
    titre: 'Pulse Gaming : Défi esport FIFA 26 Bonanjo',
    canal: 'tiktok',
    type: 'reel',
    statut: 'publie',
    date: '2026-05-10',
    sponsoring: true,
    budgetAds: 220000,
    impressions: 210000,
    clics: 9400,
    engagements: 19800,
    reach: 165000,
    conversions: 590
  },
  {
    id: 'PUB-004',
    client: 'orange-cameroun',
    clientName: 'Orange Cameroun',
    titre: 'Orange Business : Cloud & Sécurité bancaire',
    canal: 'linkedin',
    type: 'article',
    statut: 'valide',
    date: '2026-05-18',
    sponsoring: true,
    budgetAds: 95000,
    impressions: 42000,
    clics: 1680,
    engagements: 1850,
    reach: 34000,
    conversions: 85
  },
  {
    id: 'PUB-005',
    client: 'orange-cameroun',
    clientName: 'Orange Cameroun',
    titre: 'Fibre Pro : Offre PME connectivité garantie',
    canal: 'twitter',
    type: 'post',
    statut: 'en_validation',
    date: '2026-05-20',
    sponsoring: false,
    budgetAds: 0,
    impressions: 18000,
    clics: 720,
    engagements: 940,
    reach: 14000,
    conversions: 22
  },
  {
    id: 'PUB-006',
    client: 'orange-cameroun',
    clientName: 'Orange Cameroun',
    titre: 'Story coulisses Festival Mayi 2026 avec les influenceurs',
    canal: 'instagram',
    type: 'story',
    statut: 'brouillon',
    date: '2026-05-22',
    sponsoring: false,
    budgetAds: 0,
    impressions: 28000,
    clics: 1100,
    engagements: 2300,
    reach: 22000,
    conversions: 45
  },
  // Orange Burkina Faso
  {
    id: 'PUB-007',
    client: 'orange-burkina',
    clientName: 'Orange Burkina Faso',
    titre: 'Orange Money Burkina : Zéro frais de retrait week-end',
    canal: 'facebook',
    type: 'carrousel',
    statut: 'publie',
    date: '2026-05-13',
    sponsoring: true,
    budgetAds: 160000,
    impressions: 115000,
    clics: 4600,
    engagements: 6700,
    reach: 89000,
    conversions: 280
  },
  {
    id: 'PUB-008',
    client: 'orange-burkina',
    clientName: 'Orange Burkina Faso',
    titre: 'Pass Internet Nuit Ouaga : Connectivité Illimitée',
    canal: 'tiktok',
    type: 'reel',
    statut: 'publie',
    date: '2026-05-09',
    sponsoring: true,
    budgetAds: 140000,
    impressions: 130000,
    clics: 5200,
    engagements: 12400,
    reach: 98000,
    conversions: 350
  },
  {
    id: 'PUB-009',
    client: 'orange-burkina',
    clientName: 'Orange Burkina Faso',
    titre: 'Orange Énergie Solaire : Kit raccordement rural Bobo',
    canal: 'youtube',
    type: 'reel',
    statut: 'valide',
    date: '2026-05-17',
    sponsoring: true,
    budgetAds: 120000,
    impressions: 55000,
    clics: 2200,
    engagements: 3800,
    reach: 41000,
    conversions: 95
  },
  {
    id: 'PUB-010',
    client: 'orange-burkina',
    clientName: 'Orange Burkina Faso',
    titre: 'Témoignage entrepreneur connecté Koudougou',
    canal: 'linkedin',
    type: 'article',
    statut: 'en_validation',
    date: '2026-05-19',
    sponsoring: false,
    budgetAds: 0,
    impressions: 16000,
    clics: 680,
    engagements: 790,
    reach: 12000,
    conversions: 18
  },
  // Boissons du Cameroun
  {
    id: 'PUB-011',
    client: 'boissons-du-cameroun',
    clientName: 'Boissons du Cameroun',
    titre: 'Castel Beer : Le goût de notre fierté nationale',
    canal: 'facebook',
    type: 'reel',
    statut: 'publie',
    date: '2026-05-11',
    sponsoring: true,
    budgetAds: 280000,
    impressions: 195000,
    clics: 7800,
    engagements: 15400,
    reach: 148000,
    conversions: 510
  },
  {
    id: 'PUB-012',
    client: 'boissons-du-cameroun',
    clientName: 'Boissons du Cameroun',
    titre: 'Top Grenadine : Rafraîchissement garanti pour les jeunes',
    canal: 'tiktok',
    type: 'reel',
    statut: 'publie',
    date: '2026-05-08',
    sponsoring: true,
    budgetAds: 190000,
    impressions: 175000,
    clics: 6900,
    engagements: 16800,
    reach: 132000,
    conversions: 440
  },
  {
    id: 'PUB-013',
    client: 'boissons-du-cameroun',
    clientName: 'Boissons du Cameroun',
    titre: 'Vimto Fest : Grand jeu concours pack famille',
    canal: 'instagram',
    type: 'carrousel',
    statut: 'valide',
    date: '2026-05-16',
    sponsoring: true,
    budgetAds: 150000,
    impressions: 82000,
    clics: 3300,
    engagements: 6100,
    reach: 64000,
    conversions: 190
  },
  {
    id: 'PUB-014',
    client: 'boissons-du-cameroun',
    clientName: 'Boissons du Cameroun',
    titre: 'Recrutement tournée estivale ambassadeurs SABC',
    canal: 'linkedin',
    type: 'post',
    statut: 'brouillon',
    date: '2026-05-24',
    sponsoring: false,
    budgetAds: 0,
    impressions: 22000,
    clics: 950,
    engagements: 1100,
    reach: 17000,
    conversions: 35
  },
  // Chococam
  {
    id: 'PUB-015',
    client: 'chococam',
    clientName: 'Chococam',
    titre: 'Tartina : La tartine gourmande des champions du matin',
    canal: 'facebook',
    type: 'post',
    statut: 'publie',
    date: '2026-05-14',
    sponsoring: true,
    budgetAds: 170000,
    impressions: 118000,
    clics: 4700,
    engagements: 8100,
    reach: 92000,
    conversions: 320
  },
  {
    id: 'PUB-016',
    client: 'chococam',
    clientName: 'Chococam',
    titre: 'Challenge Recette Mambo Chocolat Pur Plaisir',
    canal: 'tiktok',
    type: 'reel',
    statut: 'publie',
    date: '2026-05-07',
    sponsoring: true,
    budgetAds: 160000,
    impressions: 155000,
    clics: 6200,
    engagements: 14500,
    reach: 119000,
    conversions: 390
  },
  {
    id: 'PUB-017',
    client: 'chococam',
    clientName: 'Chococam',
    titre: 'Matinal Cacao : Énergie saine pour toute la famille',
    canal: 'instagram',
    type: 'carrousel',
    statut: 'en_validation',
    date: '2026-05-19',
    sponsoring: false,
    budgetAds: 0,
    impressions: 34000,
    clics: 1350,
    engagements: 2600,
    reach: 26000,
    conversions: 45
  },
  {
    id: 'PUB-018',
    client: 'chococam',
    clientName: 'Chococam',
    titre: 'Visite d’usine Chococam Douala Bassa (RSE & Qualité)',
    canal: 'youtube',
    type: 'reel',
    statut: 'valide',
    date: '2026-05-21',
    sponsoring: true,
    budgetAds: 110000,
    impressions: 48000,
    clics: 1900,
    engagements: 3100,
    reach: 36000,
    conversions: 80
  }
];

// Campagnes Ads & Sponsoring consolidées
export const ADS_CAMPAIGNS = [
  {
    id: 'ADS-001',
    client: 'orange-cameroun',
    clientName: 'Orange Cameroun',
    name: 'Maxit Boost Forfaits & Recharges 4G/5G',
    channel: 'facebook',
    channelName: 'Facebook Ads',
    status: 'active',
    budgetTotal: 12500000,
    budgetSpent: 9800000,
    impressions: 2450000,
    clics: 88200,
    ctr: 3.6,
    cpc: 111.1,
    cpm: 4000,
    conversions: 5400,
    reach: 1680000,
    roas: 4.8,
    objective: 'App Installs & Recharges',
    period: '01 Mai → 31 Mai 2026'
  },
  {
    id: 'ADS-002',
    client: 'orange-cameroun',
    clientName: 'Orange Cameroun',
    name: 'Orange Pulse Gaming Challenge TikTok',
    channel: 'tiktok',
    channelName: 'TikTok Ads',
    status: 'active',
    budgetTotal: 8000000,
    budgetSpent: 6400000,
    impressions: 3200000,
    clics: 128000,
    ctr: 4.0,
    cpc: 50.0,
    cpm: 2000,
    conversions: 7800,
    reach: 2200000,
    roas: 5.2,
    objective: 'Engagement & Communauté Jeunes',
    period: '05 Mai → 25 Mai 2026'
  },
  {
    id: 'ADS-003',
    client: 'orange-cameroun',
    clientName: 'Orange Cameroun',
    name: 'Orange Money International Transferts',
    channel: 'instagram',
    channelName: 'Instagram Ads',
    status: 'active',
    budgetTotal: 9500000,
    budgetSpent: 7200000,
    impressions: 1750000,
    clics: 52500,
    ctr: 3.0,
    cpc: 137.1,
    cpm: 4114,
    conversions: 3200,
    reach: 1250000,
    roas: 3.9,
    objective: 'Transactions & Notoriété',
    period: '01 Mai → 30 Mai 2026'
  },
  {
    id: 'ADS-004',
    client: 'orange-burkina',
    clientName: 'Orange Burkina Faso',
    name: 'Orange Money Faso Koom (Zéro Frais)',
    channel: 'facebook',
    channelName: 'Facebook Ads',
    status: 'active',
    budgetTotal: 6500000,
    budgetSpent: 4900000,
    impressions: 1350000,
    clics: 47250,
    ctr: 3.5,
    cpc: 103.7,
    cpm: 3629,
    conversions: 2900,
    reach: 980000,
    roas: 4.2,
    objective: 'Adoption Mobile Money',
    period: '01 Mai → 31 Mai 2026'
  },
  {
    id: 'ADS-005',
    client: 'orange-burkina',
    clientName: 'Orange Burkina Faso',
    name: 'Fibre Optique Ouaga 2000 B2B',
    channel: 'linkedin',
    channelName: 'LinkedIn Ads',
    status: 'en_pause',
    budgetTotal: 4000000,
    budgetSpent: 2800000,
    impressions: 380000,
    clics: 9500,
    ctr: 2.5,
    cpc: 294.7,
    cpm: 7368,
    conversions: 420,
    reach: 260000,
    roas: 3.1,
    objective: 'Leads Entreprises & B2B',
    period: '15 Avr → 15 Mai 2026'
  },
  {
    id: 'ADS-006',
    client: 'boissons-du-cameroun',
    clientName: 'Boissons du Cameroun',
    name: 'Castel Beer Football Champions Campaign',
    channel: 'facebook',
    channelName: 'Facebook Ads',
    status: 'active',
    budgetTotal: 11000000,
    budgetSpent: 9100000,
    impressions: 2900000,
    clics: 92800,
    ctr: 3.2,
    cpc: 98.1,
    cpm: 3137,
    conversions: 6100,
    reach: 1950000,
    roas: 4.5,
    objective: 'Notoriété & Activations Bars',
    period: '01 Mai → 31 Mai 2026'
  },
  {
    id: 'ADS-007',
    client: 'boissons-du-cameroun',
    clientName: 'Boissons du Cameroun',
    name: 'Top Fraîcheur Vacances TikTok Challenge',
    channel: 'tiktok',
    channelName: 'TikTok Ads',
    status: 'active',
    budgetTotal: 7000000,
    budgetSpent: 5300000,
    impressions: 2600000,
    clics: 117000,
    ctr: 4.5,
    cpc: 45.3,
    cpm: 2038,
    conversions: 6800,
    reach: 1820000,
    roas: 5.6,
    objective: 'Engagement Génération Z',
    period: '08 Mai → 30 Mai 2026'
  },
  {
    id: 'ADS-008',
    client: 'chococam',
    clientName: 'Chococam',
    name: 'Tartina Le Goûter Idéal Douala & Yaoundé',
    channel: 'facebook',
    channelName: 'Facebook Ads',
    status: 'active',
    budgetTotal: 6000000,
    budgetSpent: 4600000,
    impressions: 1400000,
    clics: 46200,
    ctr: 3.3,
    cpc: 99.6,
    cpm: 3285,
    conversions: 3100,
    reach: 990000,
    roas: 4.1,
    objective: 'Trafic Rayons & Ventes',
    period: '01 Mai → 25 Mai 2026'
  },
  {
    id: 'ADS-009',
    client: 'chococam',
    clientName: 'Chococam',
    name: 'Mambo Chocolat Pur Plaisir Reel Spark Ads',
    channel: 'tiktok',
    channelName: 'TikTok Ads',
    status: 'terminee',
    budgetTotal: 3500000,
    budgetSpent: 3500000,
    impressions: 1850000,
    clics: 77700,
    ctr: 4.2,
    cpc: 45.0,
    cpm: 1891,
    conversions: 4100,
    reach: 1280000,
    roas: 5.0,
    objective: 'Notoriété Produit',
    period: '15 Avr → 05 Mai 2026'
  }
];

// Données mensuelles pour l'évolution financière et de production
export const MONTHLY_TRENDS_DATA = [
  { month: 'Jan 26', publications: 48, adsSpent: 6200000, budgetReal: 52000000, budgetPrevu: 55000000, caFacture: 68000000, marge: 12500000, impressions: 3800000, conversions: 8200 },
  { month: 'Fév 26', publications: 56, adsSpent: 7100000, budgetReal: 58000000, budgetPrevu: 60000000, caFacture: 74000000, marge: 13800000, impressions: 4400000, conversions: 9400 },
  { month: 'Mar 26', publications: 64, adsSpent: 8900000, budgetReal: 67000000, budgetPrevu: 65000000, caFacture: 82000000, marge: 15100000, impressions: 5600000, conversions: 11600 },
  { month: 'Avr 26', publications: 72, adsSpent: 11400000, budgetReal: 76000000, budgetPrevu: 72000000, caFacture: 93000000, marge: 17200000, impressions: 7200000, conversions: 14800 },
  { month: 'Mai 26', publications: 88, adsSpent: 14900000, budgetReal: 89000000, budgetPrevu: 85000000, caFacture: 108000000, marge: 19800000, impressions: 9400000, conversions: 18900 },
  { month: 'Juin 26 (P)', publications: 95, adsSpent: 16500000, budgetReal: 96000000, budgetPrevu: 92000000, caFacture: 116000000, marge: 21500000, impressions: 10800000, conversions: 21200 }
];

// Matrice d'activité hebdomadaire (Heatmap 7 jours × 4 tranches horaires)
export const WEEKLY_HEATMAP_DATA = [
  { day: 'Lundi', '08h-12h': 85, '12h-16h': 92, '16h-20h': 78, '20h-24h': 42 },
  { day: 'Mardi', '08h-12h': 94, '12h-16h': 98, '16h-20h': 84, '20h-24h': 48 },
  { day: 'Mercredi', '08h-12h': 89, '12h-16h': 95, '16h-20h': 91, '20h-24h': 54 },
  { day: 'Jeudi', '08h-12h': 96, '12h-16h': 100, '16h-20h': 88, '20h-24h': 61 },
  { day: 'Vendredi', '08h-12h': 98, '12h-16h': 94, '16h-20h': 72, '20h-24h': 38 },
  { day: 'Samedi', '08h-12h': 45, '12h-16h': 58, '16h-20h': 65, '20h-24h': 52 },
  { day: 'Dimanche', '08h-12h': 32, '12h-16h': 41, '16h-20h': 49, '20h-24h': 44 }
];

/**
 * Fonction centrale de calcul des métriques avec application de filtres multidimensionnels
 */
export function computeAnalytics({
  appContextPublications = [],
  appContextFinancialDocs = [],
  appContextInfluencers = [],
  filterPeriod = 'all',
  filterClient = 'all',
  filterChannel = 'all',
  filterStatus = 'all',
  searchTerm = ''
}) {
  // 1. Fusionner les publications live et d'amorcage
  const normalizedLivePubs = (appContextPublications || []).map((p, idx) => ({
    id: p.id || `live-pub-${idx}`,
    client: p.client || 'orange-cameroun',
    clientName: p.clientName || 'Orange Cameroun',
    titre: p.titre || p.content || 'Contenu éditorial',
    canal: (p.plateforme || p.canal || 'facebook').toLowerCase(),
    type: p.typeContenu || p.type || 'post',
    statut: (p.statut || 'publie').toLowerCase().replace(' ', '_'),
    date: p.datePublication || p.date || new Date().toISOString().slice(0, 10),
    sponsoring: !!(p.sponsoring || p.sponsorise),
    budgetAds: Number(p.budgetAds || p.budgetSponsoring || p.sponsoring || 0),
    impressions: Number(p.impressions || (p.sponsoring ? 95000 : 24000)),
    clics: Number(p.clics || (p.sponsoring ? 3800 : 960)),
    engagements: Number(p.engagements || 4200),
    reach: Number(p.reach || (p.sponsoring ? 78000 : 19000)),
    conversions: Number(p.conversions || 180)
  }));

  const allPublications = [...SEED_PUBLICATIONS, ...normalizedLivePubs];

  // 2. Filtrer les publications
  const filteredPublications = allPublications.filter(pub => {
    if (filterClient !== 'all' && pub.client !== filterClient) return false;
    if (filterChannel !== 'all' && pub.canal !== filterChannel) return false;
    if (filterStatus !== 'all') {
      if (filterStatus === 'publie' && pub.statut !== 'publie') return false;
      if (filterStatus === 'valide' && pub.statut !== 'valide') return false;
      if (filterStatus === 'en_validation' && pub.statut !== 'en_validation') return false;
      if (filterStatus === 'brouillon' && pub.statut !== 'brouillon') return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const match = pub.titre.toLowerCase().includes(term) ||
                    pub.clientName.toLowerCase().includes(term) ||
                    pub.canal.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  // 3. Filtrer les campagnes Ads
  const filteredAds = ADS_CAMPAIGNS.filter(ad => {
    if (filterClient !== 'all' && ad.client !== filterClient) return false;
    if (filterChannel !== 'all' && ad.channel !== filterChannel) return false;
    if (filterStatus !== 'all') {
      if (filterStatus === 'active' && ad.status !== 'active') return false;
      if (filterStatus === 'en_pause' && ad.status !== 'en_pause') return false;
      if (filterStatus === 'terminee' && ad.status !== 'terminee') return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const match = ad.name.toLowerCase().includes(term) ||
                    ad.clientName.toLowerCase().includes(term) ||
                    ad.channelName.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  // 4. Utilisateurs (chargement direct depuis le cache local ou d'amorcage)
  let userList = INITIAL_USERS;
  try {
    const savedUsers = localStorage.getItem('bridge_iam_users_v3');
    if (savedUsers) {
      const parsed = JSON.parse(savedUsers);
      if (Array.isArray(parsed) && parsed.length > 0) userList = parsed;
    }
  } catch (e) {
    // fallback to initial
  }

  const filteredUsers = userList.filter(u => {
    if (filterClient !== 'all') {
      if (filterClient === 'orange-cameroun' && !u.entite?.toLowerCase().includes('orange')) return false;
      if (filterClient === 'orange-burkina' && !u.entite?.toLowerCase().includes('burkina')) return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const match = (u.nom || '').toLowerCase().includes(term) ||
                    (u.prenom || '').toLowerCase().includes(term) ||
                    (u.profil || '').toLowerCase().includes(term) ||
                    (u.entite || '').toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  // 5. Influenceurs
  const rawInfluencers = appContextInfluencers.length > 0 ? appContextInfluencers : INITIAL_INFLUENCE_TALENTS;
  const filteredInfluencers = rawInfluencers.filter(inf => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const match = (inf.display_name || '').toLowerCase().includes(term) ||
                    (inf.pseudo || '').toLowerCase().includes(term) ||
                    (inf.notes || '').toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  // Calcul des totaux et agrégations
  const totalPublications = filteredPublications.length;
  const totalSponsoredPubs = filteredPublications.filter(p => p.sponsoring).length;
  const sponsoringRate = totalPublications > 0 ? Math.round((totalSponsoredPubs / totalPublications) * 100) : 0;

  const totalAdsBudget = filteredAds.reduce((acc, a) => acc + a.budgetTotal, 0);
  const totalAdsSpent = filteredAds.reduce((acc, a) => acc + a.budgetSpent, 0);
  const totalImpressions = filteredAds.reduce((acc, a) => acc + a.impressions, 0);
  const totalClicks = filteredAds.reduce((acc, a) => acc + a.clics, 0);
  const totalConversions = filteredAds.reduce((acc, a) => acc + a.conversions, 0);
  const totalReach = filteredAds.reduce((acc, a) => acc + a.reach, 0);

  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const avgCPC = totalClicks > 0 ? Math.round(totalAdsSpent / totalClicks) : 0;
  const avgCPM = totalImpressions > 0 ? Math.round((totalAdsSpent / totalImpressions) * 1000) : 0;

  // Calcul financier consolidé
  const totalBudgetHT = FINANCIAL_DATA.totalBudgetHT;
  const totalSpentHT = FINANCIAL_DATA.totalSpentHT;
  const commission = FINANCIAL_DATA.commission;
  const totalTTC = FINANCIAL_DATA.totalTTC;
  const tauxConsommation = FINANCIAL_DATA.tauxConsommation;

  // Répartition par canal pour le calendrier
  const publicationsByChannel = [
    { channel: 'Facebook', count: filteredPublications.filter(p => p.canal === 'facebook').length, color: '#1877F2' },
    { channel: 'Instagram', count: filteredPublications.filter(p => p.canal === 'instagram').length, color: '#E4405F' },
    { channel: 'TikTok', count: filteredPublications.filter(p => p.canal === 'tiktok').length, color: '#111111' },
    { channel: 'LinkedIn', count: filteredPublications.filter(p => p.canal === 'linkedin').length, color: '#0A66C2' },
    { channel: 'X (Twitter)', count: filteredPublications.filter(p => p.canal === 'twitter').length, color: '#555555' },
    { channel: 'YouTube', count: filteredPublications.filter(p => p.canal === 'youtube').length, color: '#FF0000' }
  ].filter(c => c.count > 0);

  // Répartition par client
  const publicationsByClient = [
    { client: 'Orange Cameroun', count: filteredPublications.filter(p => p.client === 'orange-cameroun').length, color: '#FF7900' },
    { client: 'Orange Burkina Faso', count: filteredPublications.filter(p => p.client === 'orange-burkina').length, color: '#E06800' },
    { client: 'Boissons du Cameroun', count: filteredPublications.filter(p => p.client === 'boissons-du-cameroun').length, color: '#E53935' },
    { client: 'Chococam', count: filteredPublications.filter(p => p.client === 'chococam').length, color: '#8D6E63' }
  ].filter(c => c.count > 0);

  // Répartition par statut
  const publicationsByStatus = [
    { status: 'Publié', key: 'publie', count: filteredPublications.filter(p => p.statut === 'publie').length, color: '#27AE60' },
    { status: 'Validé (Prêt)', key: 'valide', count: filteredPublications.filter(p => p.statut === 'valide').length, color: '#2980B9' },
    { status: 'En validation', key: 'en_validation', count: filteredPublications.filter(p => p.statut === 'en_validation').length, color: '#F39C12' },
    { status: 'Brouillon', key: 'brouillon', count: filteredPublications.filter(p => p.statut === 'brouillon').length, color: '#8C8C8C' }
  ];

  // Répartition par format de contenu
  const publicationsByType = [
    { type: 'Reel & Vidéo', count: filteredPublications.filter(p => p.type === 'reel').length, color: '#9B59B6' },
    { type: 'Carrousel', count: filteredPublications.filter(p => p.type === 'carrousel').length, color: '#3498DB' },
    { type: 'Post Simple', count: filteredPublications.filter(p => p.type === 'post').length, color: '#E67E22' },
    { type: 'Story', count: filteredPublications.filter(p => p.type === 'story').length, color: '#F1C40F' },
    { type: 'Article', count: filteredPublications.filter(p => p.type === 'article').length, color: '#1ABC9C' }
  ].filter(t => t.count > 0);

  // Performance des canaux Ads
  const adsPerformanceByChannel = [
    { channel: 'Facebook Ads', spent: 34500000, impressions: 8100000, clics: 274450, ctr: 3.38, cpc: 125, conversions: 17500 },
    { channel: 'TikTok Ads', spent: 22200000, impressions: 9450000, clics: 399700, ctr: 4.23, cpc: 55, conversions: 22800 },
    { channel: 'Instagram Ads', spent: 18400000, impressions: 4800000, clics: 153600, ctr: 3.20, cpc: 119, conversions: 9800 },
    { channel: 'LinkedIn Ads', spent: 8200000, impressions: 920000, clics: 24840, ctr: 2.70, cpc: 330, conversions: 1450 }
  ];

  // Budget par poste financier
  const financialPostes = FINANCIAL_DATA.budgetExecution?.postes || [
    { name: 'Média Digital', budget: 80000000, reel: 72000000, prevision: 78000000 },
    { name: 'Influenceurs KOL', budget: 28000000, reel: 23500000, prevision: 30000000 },
    { name: 'Production vidéo', budget: 35000000, reel: 18000000, prevision: 32000000 },
    { name: 'Activations', budget: 20000000, reel: 8000000, prevision: 19000000 },
    { name: 'Community Mgmt', budget: 15000000, reel: 6500000, prevision: 14000000 },
    { name: 'Reporting & Data', budget: 12000000, reel: 3200000, prevision: 11000000 }
  ];

  // Répartition des utilisateurs par entité
  const usersByEntity = [
    { name: 'McCann Douala', count: filteredUsers.filter(u => u.type === 'agence' || u.entite?.toLowerCase().includes('mccann')).length, color: '#16213E' },
    { name: 'Orange Cameroun', count: filteredUsers.filter(u => u.type === 'client' || u.entite?.toLowerCase().includes('orange')).length, color: '#FF7900' },
    { name: 'Orange Burkina', count: 4, color: '#E06800' },
    { name: 'Boissons du Cameroun', count: 3, color: '#E53935' },
    { name: 'Chococam', count: 3, color: '#8D6E63' }
  ];

  // Répartition des utilisateurs par rôle
  const usersByRole = [
    { role: 'Direction & Super Admin', count: 6, color: '#FF7900' },
    { role: 'Account & Traffic Manager', count: 12, color: '#2980B9' },
    { role: 'Création & Direction Artistique', count: 10, color: '#9B59B6' },
    { role: 'Community Managers', count: 8, color: '#27AE60' },
    { role: 'Validateurs Clients Rive', count: 14, color: '#E67E22' },
    { role: 'Data & Contrôle de Gestion', count: 6, color: '#34495E' }
  ];

  // Influenceurs stats
  const activeInfluencersCount = filteredInfluencers.filter(i => i.record_status === 'active').length || 28;
  const contractsSignedCount = filteredInfluencers.filter(i => i.qualification_status === 'contrat_signe').length || 22;

  const influencersByTier = [
    { name: 'Nano (1K-10K)', count: 8, color: '#3498DB', reach: '68K', avgEngagement: '6.4%' },
    { name: 'Micro (10K-100K)', count: 16, color: '#2ECC71', reach: '840K', avgEngagement: '5.1%' },
    { name: 'Macro (100K-1M)', count: 7, color: '#F39C12', reach: '3.2M', avgEngagement: '3.8%' },
    { name: 'Mega / Star (>1M)', count: 3, color: '#E74C3C', reach: '10.7M', avgEngagement: '2.9%' }
  ];

  const influencersByCategory = [
    { name: 'Humour & Stand-up', count: 9, color: '#F1C40F' },
    { name: 'Lifestyle & Société', count: 8, color: '#E67E22' },
    { name: 'Tech & Télécoms', count: 5, color: '#FF7900' },
    { name: 'Musique & Culture', count: 5, color: '#9B59B6' },
    { name: 'Gaming & Esport', count: 4, color: '#1ABC9C' },
    { name: 'Business & Finance', count: 3, color: '#34495E' }
  ];

  return {
    filteredPublications,
    filteredAds,
    filteredUsers,
    filteredInfluencers,
    metrics: {
      totalPublications,
      totalSponsoredPubs,
      sponsoringRate,
      totalAdsBudget,
      totalAdsSpent,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalReach,
      avgCTR,
      avgCPC,
      avgCPM,
      totalBudgetHT,
      totalSpentHT,
      commission,
      totalTTC,
      tauxConsommation,
      activeUsersCount: filteredUsers.length,
      activeInfluencersCount,
      contractsSignedCount
    },
    breakdowns: {
      publicationsByChannel,
      publicationsByClient,
      publicationsByStatus,
      publicationsByType,
      adsPerformanceByChannel,
      financialPostes,
      usersByEntity,
      usersByRole,
      influencersByTier,
      influencersByCategory
    },
    trends: MONTHLY_TRENDS_DATA,
    heatmap: WEEKLY_HEATMAP_DATA
  };
}
