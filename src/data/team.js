export const TEAM = {
  creatives: [
    { id: 'annette', name: 'Annette NGONDI', role: 'Infographe', pole: 'infographie', specialty: 'Multi-format, Pulse', capacity: 100, avatar: 'AN', backupId: 'jourdain' },
    { id: 'jourdain', name: 'Jourdain SONGUE', role: 'Infographe', pole: 'infographie', specialty: 'Promo, Maxit', capacity: 100, avatar: 'JS', backupId: 'annette' },
    { id: 'georges', name: 'Georges BAKOUME', role: 'Lead DA & Infographe Senior', pole: 'infographie', specialty: 'Identités visuelles, 360', capacity: 100, avatar: 'GB', backupId: 'annette' },
    { id: 'adrien', name: 'Adrien KAME', role: 'Motion Designer (PT)', pole: 'motion', specialty: 'Motion 2D/3D, Reels, Cut Vidéo', capacity: 50, avatar: 'AK', backupId: 'georges' },
    { id: 'serge', name: 'Serge NDJOCK', role: 'Lead Tech & Fullstack Dev', pole: 'dev', specialty: 'Web Apps, APIs, Intégration', capacity: 100, avatar: 'SN', backupId: 'victor' },
  ],
  cdp: [
    { id: 'victor', name: 'Victor F. AKOA', role: 'Traffic Manager & Chef de Projet Lead', pole: 'cdp', avatar: 'VA', specialty: 'Pilotage & Dispatch' },
    { id: 'felix', name: 'Félix MBETBO', role: 'Chef de Projet Digital', pole: 'cdp', avatar: 'FM', specialty: 'Coordination & Sprints' },
  ],
  directors: [
    { id: 'patrice', name: 'Patrice EBANG', role: 'Directeur de Création', pole: 'direction', avatar: 'PE', specialty: 'Validation Artistique & QA' },
    { id: 'claire', name: 'Claire MOUKOKO', role: 'Directrice Clientèle & Stratégie', pole: 'direction', avatar: 'CM', specialty: 'Revue Stratégique & Budgets' },
  ],
  cm: [
    { id: 'linda', name: 'Linda BILL', role: 'CM Telco & Social Specialist', pole: 'cm', segment: 'Telco', avatar: 'LB', capacity: 100, backupId: 'henriette' },
    { id: 'jessica', name: 'Jessica OKALA', role: 'CM Business & B2B Lead', pole: 'cm', segment: 'Business', avatar: 'JO', capacity: 100, backupId: 'linda' },
    { id: 'william', name: 'William MBEDE', role: 'CM Money & Fintech', pole: 'cm', segment: 'Money', avatar: 'WM', capacity: 100, backupId: 'linda' },
    { id: 'henriette', name: 'Henriette SILO', role: 'CM Specialist & Moderation', pole: 'cm', segment: 'Pulse', avatar: 'HS', capacity: 100, backupId: 'jessica' },
  ],
  specialists: [
    { id: 'jeanpaul', name: 'Jean Paul MBA', role: 'Influencer Manager', pole: 'influence', avatar: 'JP', capacity: 100, specialty: 'Casting & Contrats Créateurs' },
    { id: 'steve', name: 'Steve BESSOUBE', role: 'Digital Web Analyst', pole: 'analyst', avatar: 'SB', capacity: 100, specialty: 'Tracking GA4, Dashboards & ROI' },
    { id: 'alain', name: 'Alain TCHAPTCHET', role: 'Growth Hacker', pole: 'growth', avatar: 'AT', capacity: 100, specialty: 'A/B Testing & Funnels' },
  ],
  finance: [
    { id: 'mireille', name: 'Mireille NGO', role: 'Contrôleur de Gestion & Finance', pole: 'finance', avatar: 'MN', specialty: 'Audit Temps Passés & Facturation' },
  ],
  demanders: [
    { id: 'lauriane', name: 'Lauriane NGAMENI', role: 'Chef de Projet Digital', entity: 'Orange Cameroun', email: 'lauriane.ngameni@orange.cm', avatar: 'LN' },
    { id: 'patrick', name: 'Patrick TUETE', role: 'Communication Specialist', entity: 'Orange Cameroun', email: 'patrick.tuete@orange.cm', avatar: 'PT' },
    { id: 'boris', name: 'Boris TIENTCHEU', role: 'Digital Media Lead', entity: 'Orange Cameroun', email: 'boris.tientcheu@orange.cm', avatar: 'BT' },
  ],
};

export const POLES = [
  { id: 'infographie', label: 'Infographie & Design', color: '#FF7900', icon: '🎨' },
  { id: 'motion', label: 'Motion & Vidéo', color: '#9C27B0', icon: '🎬' },
  { id: 'cm', label: 'Community Management', color: '#2196F3', icon: '💬' },
  { id: 'dev', label: 'Dév & Tech', color: '#009688', icon: '💻' },
  { id: 'analyst', label: 'Digital Web Analytics', color: '#E91E63', icon: '📊' },
  { id: 'growth', label: 'Growth Hacking', color: '#FF9800', icon: '🚀' },
  { id: 'influence', label: 'Influence Management', color: '#673AB7', icon: '⭐' },
  { id: 'cdp', label: 'Chef de Projet / Traffic', color: '#607D8B', icon: '📋' },
];

