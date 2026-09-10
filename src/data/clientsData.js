// Data definition for Bridge B2B Platform: Clients, Agency Profiles, and Client Profiles

export const CLIENTS_LIST = [
  {
    id: 'orange-cameroun',
    name: 'Orange Cameroun',
    fullName: 'Orange Cameroun S.A.',
    hub: 'Douala & Yaoundé, Cameroun',
    country: 'Cameroun',
    countryCode: 'CM',
    flag: '🇨🇲',
    sector: 'Télécommunications & Mobile Money',
    description: 'Leader des télécoms, de la connectivité 4G/5G, de la fibre optique et des services financiers mobiles Orange Money.',
    color: '#FF7900',
    accentColor: '#FF6600',
    secondaryColor: '#000000',
    initials: 'OC',
    subBrands: ['Orange TELCO', 'Orange Money', 'Orange Pulse (Jeunes)', 'Orange Business'],
    stats: {
      activeBriefs: 14,
      liveCampaigns: 6,
      slaRate: '99.4%',
      monthlyReach: '4.8M',
      teamSize: '18 colab.'
    },
    defaultClientContact: 'Patrick Tuete (Head of Digital Marketing)'
  },
  {
    id: 'orange-burkina',
    name: 'Orange Burkina',
    fullName: 'Orange Burkina Faso S.A.',
    hub: 'Ouagadougou, Burkina Faso',
    country: 'Burkina Faso',
    countryCode: 'BF',
    flag: '🇧🇫',
    sector: 'Télécommunications & Innovation Numérique',
    description: 'Opérateur télécom majeur au Burkina Faso, pionnier du haut débit mobile et de l’inclusion financière digitale.',
    color: '#FF7900',
    accentColor: '#009E49',
    secondaryColor: '#EF2B2D',
    initials: 'OB',
    subBrands: ['Orange Telco BF', 'Orange Money Burkina', 'B2B Entreprises'],
    stats: {
      activeBriefs: 9,
      liveCampaigns: 4,
      slaRate: '99.1%',
      monthlyReach: '3.2M',
      teamSize: '12 colab.'
    },
    defaultClientContact: 'Aminata Ouedraogo (Directrice Marque & Com)'
  },
  {
    id: 'boissons-du-cameroun',
    name: 'Boissons du Cameroun',
    fullName: 'Société Anonyme des Boissons du Cameroun (Groupe SABC)',
    hub: 'Douala, Cameroun (Direction Générale)',
    country: 'Cameroun',
    countryCode: 'CM',
    flag: '🇨🇲',
    sector: 'Agroalimentaire, Brasserie & Boissons',
    description: 'Leader historique de l’industrie agroalimentaire camerounaise, brassage de bières de renommée, boissons gazeuses et eaux minérales.',
    color: '#E11D48',
    accentColor: '#D97706',
    secondaryColor: '#1E3A8A',
    initials: 'BDC',
    subBrands: ['Castel Beer', 'Beaufort Lager', '33 Export', 'Top Boissons', 'D’jino', 'Tangui'],
    stats: {
      activeBriefs: 12,
      liveCampaigns: 7,
      slaRate: '98.8%',
      monthlyReach: '5.4M',
      teamSize: '16 colab.'
    },
    defaultClientContact: 'Jean-Marc Ekotto (Directeur Marketing & Marques)'
  },
  {
    id: 'chococam',
    name: 'Chococam',
    fullName: 'Chocolaterie et Confiserie Camerounaise (Tiger Brands)',
    hub: 'Douala, Cameroun (Zone Industrielle Bassa)',
    country: 'Cameroun',
    countryCode: 'CM',
    flag: '🇨🇲',
    sector: 'Confiserie & Chocolaterie Industrielle',
    description: 'Référence incontestée du chocolat, des pâtes à tartiner et de la confiserie en Afrique Centrale avec des marques patrimoniales.',
    color: '#78350F',
    accentColor: '#F59E0B',
    secondaryColor: '#10B981',
    initials: 'CC',
    subBrands: ['Mambo Chocolat', 'Matinal (Pâte à tartiner)', 'Aristo', 'Bonbons Chococam'],
    stats: {
      activeBriefs: 8,
      liveCampaigns: 3,
      slaRate: '99.5%',
      monthlyReach: '2.9M',
      teamSize: '10 colab.'
    },
    defaultClientContact: 'Sandrine Nguemo (Chef de Groupe Confiserie)'
  }
];

export const AGENCY_PROFILES = [
  {
    id: 'community-manager',
    title: 'Community Manager',
    category: 'Social Media',
    pole: 'Pôle Social & Modération',
    icon: '💬',
    avatar: 'CM',
    color: '#00D4FF',
    badgeClass: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    description: 'Gestion des communautés en temps réel, modération active, engagement et amplification des conversations.',
    defaultName: 'Marc Ekwalla',
    defaultEmail: 'marc.ekwalla@mccann.cm'
  },
  {
    id: 'digital-web-analyst',
    title: 'Digital Web Analyst',
    category: 'Data & Analytics',
    pole: 'Pôle Insights & Performance',
    icon: '📊',
    avatar: 'SB',
    color: '#FF6600',
    badgeClass: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    description: 'Suivi des KPI, reporting consolidé 360°, analyse des parcours digitaux et benchmarks concurrentiels.',
    defaultName: 'Steve BESSOUBE',
    defaultEmail: 'steve.bessoube@mccann.cm'
  },
  {
    id: 'growth-hacker',
    title: 'Growth Hacker',
    category: 'Acquisition',
    pole: 'Pôle Media & Performance',
    icon: '🚀',
    avatar: 'GH',
    color: '#10B981',
    badgeClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    description: 'Optimisation des tunnels de conversion, campagnes Paid Media (Meta, Google, TikTok) et acquisition ROIste.',
    defaultName: 'Boris Kamdem',
    defaultEmail: 'boris.kamdem@mccann.cm'
  },
  {
    id: 'motion-designer',
    title: 'Motion Designer',
    category: 'Création',
    pole: 'Pôle Studio & Vidéo',
    icon: '🎬',
    avatar: 'MD',
    color: '#D946EF',
    badgeClass: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
    description: 'Création de vidéos dynamiques, formats TikTok/Reels immersifs, animations 2D/3D et habillages de marque.',
    defaultName: 'Lionel Ndong',
    defaultEmail: 'lionel.ndong@mccann.cm'
  },
  {
    id: 'infographe-da',
    title: 'Infographe / DA Junior',
    category: 'Création',
    pole: 'Pôle Direction Artistique',
    icon: '🎨',
    avatar: 'DA',
    color: '#E11D48',
    badgeClass: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    description: 'Conception graphique des affiches, carrousels, déclinaisons de formats et respect strict des chartes de marque.',
    defaultName: 'Sylvie Mballa',
    defaultEmail: 'sylvie.mballa@mccann.cm'
  },
  {
    id: 'influence-manager',
    title: 'Influence Manager',
    category: 'Influence',
    pole: 'Pôle Relations Talents',
    icon: '⭐',
    avatar: 'IM',
    color: '#F59E0B',
    badgeClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    description: 'Sourcing de créateurs, contractualisation, validation des livrables créateurs et mesure du ROI d’influence.',
    defaultName: 'Astride Kouam',
    defaultEmail: 'astride.kouam@mccann.cm'
  },
  {
    id: 'chef-de-projet',
    title: 'Chef de projet Digital',
    category: 'Pilotage',
    pole: 'Pôle Coordination & Delivery',
    icon: '⏱️',
    avatar: 'CP',
    color: '#3B82F6',
    badgeClass: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    description: 'Pilotage opérationnel des sprints, suivi des retroplannings, gestion des priorités et liaison quotidienne.',
    defaultName: 'Christian Talla',
    defaultEmail: 'christian.talla@mccann.cm'
  },
  {
    id: 'directeur-clientele',
    title: 'Directeur de Clientèle',
    category: 'Gouvernance',
    pole: 'Pôle Conseil & Stratégie',
    icon: '👔',
    avatar: 'DC',
    color: '#8B5CF6',
    badgeClass: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    description: 'Supervision stratégique des comptes, cadrage budgétaire, gouvernance contractuelle et comités de direction.',
    defaultName: 'Fabrice Nguena',
    defaultEmail: 'fabrice.nguena@mccann.cm'
  },
  {
    id: 'administrateur',
    title: 'Administrateur',
    category: 'Système',
    pole: 'Pôle Direction McCann',
    icon: '🛡️',
    avatar: 'AD',
    color: '#EC4899',
    badgeClass: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    description: 'Accès omnipotent à l’ensemble des comptes, configuration des workflows, gestion des utilisateurs et audit IA.',
    defaultName: 'Direction Générale McCann',
    defaultEmail: 'admin@mccann.cm'
  }
];

export const CLIENT_PROFILES = [
  {
    id: 'resp-communication',
    title: 'Responsable de la communication',
    shortTitle: 'Head of Communication',
    roleTag: 'Gouvernance & Marque',
    icon: '📢',
    avatar: 'RC',
    color: '#00D4FF',
    authority: 'Validation finale & Orientations',
    description: 'Validation finale des campagnes, orientation stratégique de la prise de parole et cohérence de réputation institutionnelle.'
  },
  {
    id: 'communication-specialist',
    title: 'Communication Specialist',
    shortTitle: 'Com Specialist',
    roleTag: 'Opérationnel & Contenus',
    icon: '✍️',
    avatar: 'CS',
    color: '#FF6600',
    authority: 'Revue éditoriale & validation Sprints',
    description: 'Coordination quotidienne des plannings de publication, relecture des copies et validation des déclinaisons opérationnelles.'
  },
  {
    id: 'brand-manager',
    title: 'Brand Manager / Chef de Marque',
    shortTitle: 'Brand Manager',
    roleTag: 'Produit & Performance',
    icon: '🏷️',
    avatar: 'BM',
    color: '#10B981',
    authority: 'Briefs d’activation & KPI Marché',
    description: 'Émission des briefs d’offres, suivi des objectifs de souscription / vente et alignement avec le plan marketing annuel.'
  },
  {
    id: 'dir-marketing-digital',
    title: 'Directeur Marketing & Digital',
    shortTitle: 'Marketing & Digital Director',
    roleTag: 'Direction & Arbitrage',
    icon: '🎯',
    avatar: 'MD',
    color: '#D946EF',
    authority: 'Arbitrage budgétaire & Feuilles de route',
    description: 'Supervision globale de l’écosystème digital, allocation des budgets médias et validation des comités mensuels de performance.'
  },
  {
    id: 'media-advertising-manager',
    title: 'Media & Advertising Manager',
    shortTitle: 'Media Manager',
    roleTag: 'Achat Média & ROI',
    icon: '📈',
    avatar: 'MM',
    color: '#F59E0B',
    authority: 'Plans médias & Investissements Paid',
    description: 'Suivi des budgets publicitaires sponsorisés, validation des plans médias digitaux et calcul du coût par acquisition (CPA).'
  },
  {
    id: 'chef-produit-digital',
    title: 'Chef de Produit Digital',
    shortTitle: 'Digital Product Owner',
    roleTag: 'Apps & Services Numériques',
    icon: '📱',
    avatar: 'PD',
    color: '#3B82F6',
    authority: 'Campagnes App & Parcours UX',
    description: 'Pilotage des campagnes de téléchargement et d’usage des applications mobiles (ex: Maxit, MyOrange, Orange Money).'
  }
];
