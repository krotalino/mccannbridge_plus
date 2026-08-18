// McCann Bridge — Reporting & Insights Module Data Store
// Conforme au Cahier des Charges Août 2026

export const REPORT_STATUSES = {
  draft: { label: 'Brouillon', color: '#8C8C8C', bg: '#F2F2F2', step: 1, desc: 'Demande commencée mais non soumise' },
  submitted: { label: 'Soumise', color: '#2980B9', bg: '#EBF5FB', step: 2, desc: 'Demande transmise à McCann' },
  needs_info: { label: 'À compléter', color: '#E74C3C', bg: '#FDEDEC', step: 2, desc: 'Informations ou fichiers manquants' },
  qualified: { label: 'Qualifiée', color: '#8E44AD', bg: '#F4ECF7', step: 3, desc: 'Périmètre validé, production planifiée' },
  in_production: { label: 'En production', color: '#D35400', bg: '#FBEEE6', step: 4, desc: 'Collecte, analyse et production en cours' },
  internal_review: { label: 'Revue interne', color: '#F39C12', bg: '#FEF9E7', step: 5, desc: 'Rapport soumis au contrôle qualité McCann' },
  internal_fixes: { label: 'Corrections internes', color: '#E67E22', bg: '#FDF2E9', step: 5, desc: 'Ajustements demandés par le reviewer' },
  client_review: { label: 'En validation client', color: '#FF7900', bg: '#FFF4E6', step: 6, desc: 'Rapport partagé au client pour approbation' },
  client_fixes: { label: 'Corrections client', color: '#C0392B', bg: '#FADBD8', step: 6, desc: 'Retours du client à intégrer' },
  approved: { label: 'Validée', color: '#27AE60', bg: '#EAFAF1', step: 7, desc: 'Rapport approuvé par le client' },
  delivered: { label: 'Livrée', color: '#1E8449', bg: '#D5F5E3', step: 8, desc: 'Livrable final transmis et archivé' },
  cancelled: { label: 'Annulée', color: '#7F8C8D', bg: '#EAEDED', step: 0, desc: 'Demande abandonnée ou remplacée' },
};

export const REPORT_WORKFLOW_STEPS = [
  { id: 'submitted', label: '1. Soumission' },
  { id: 'qualified', label: '2. Qualification' },
  { id: 'in_production', label: '3. Production' },
  { id: 'internal_review', label: '4. Revue Interne' },
  { id: 'client_review', label: '5. Validation Client' },
  { id: 'approved', label: '6. Approbation' },
  { id: 'delivered', label: '7. Livraison Finale' },
];

export const REPORT_TYPES = [
  { id: 'hebdomadaire', label: 'Rapport hebdomadaire', periodDefault: 'Semaine (J+2/J+3)', icon: '📅', sla: 'J+2 ouvré' },
  { id: 'mensuel', label: 'Rapport mensuel', periodDefault: 'Mois civil (J+5)', icon: '📊', sla: 'J+5 ouvrés' },
  { id: 'spontane', label: 'Rapport spontané / ponctuel', periodDefault: 'Ad hoc / Incident', icon: '⚡', sla: 'Selon urgence (24h-72h)' },
  { id: 'campagne', label: 'Rapport de campagne', periodDefault: 'Durée campagne', icon: '🎯', sla: 'J+3 fin de vague' },
  { id: 'benchmark', label: 'Rapport de benchmark', periodDefault: 'Trimestriel / Mensuel', icon: '🔍', sla: 'J+7 ouvrés' },
  { id: 'executif', label: 'Rapport exécutif (Direction)', periodDefault: 'Synthèse trimestrielle', icon: '👔', sla: 'J+4 comité' },
];

export const BRANDS_LIST = [
  { id: 'orange_telco', name: 'Orange TELCO', segment: 'Grand Public & Mobile', color: '#FF7900' },
  { id: 'orange_money', name: 'Orange Money (OM)', segment: 'Services Financiers Mobiles', color: '#00A859' },
  { id: 'orange_business', name: 'Orange Business', segment: 'B2B & Entreprises', color: '#004F9F' },
  { id: 'orange_pulse', name: 'Orange Pulse', segment: 'Jeunes & Gaming (18-25)', color: '#FF4D80' },
];

export const COMPETITORS_LIST = [
  { id: 'mtn_cameroon', name: 'MTN Cameroun', color: '#FFCC00' },
  { id: 'mtn_momo', name: 'MoMo MTN', color: '#FFB800' },
  { id: 'mtn_business', name: 'MTN Business', color: '#003366' },
  { id: 'camtel_blue', name: 'Blue by Camtel', color: '#0066CC' },
];

export const CHANNELS_LIST = [
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'youtube', name: 'YouTube', icon: '▶️' },
  { id: 'x_twitter', name: 'X (Twitter)', icon: '🐦' },
  { id: 'website_landing', name: 'Site Web / Landing Page', icon: '🌐' },
  { id: 'paid_display', name: 'Meta & Google Ads / Display', icon: '📢' },
  { id: 'whatsapp_direct', name: 'WhatsApp Business / Direct', icon: '💬' },
];

export const REPORT_SECTIONS_CATALOG = [
  { id: 'cover', label: 'Page de couverture', desc: 'Métadonnées, logos, période, type et auteurs', defaultIn: ['hebdomadaire', 'mensuel', 'spontane', 'campagne', 'benchmark', 'executif'] },
  { id: 'executive_summary', label: 'Résumé exécutif', desc: 'Principaux résultats, faits marquants, alertes & reco prioritaires', defaultIn: ['hebdomadaire', 'mensuel', 'spontane', 'campagne', 'benchmark', 'executif'] },
  { id: 'community_growth', label: 'Évolution des communautés', desc: 'Base initiale, gains nets, taux de croissance par canal et marque', defaultIn: ['hebdomadaire', 'mensuel', 'campagne'] },
  { id: 'platform_performance', label: 'Performance par plateforme', desc: 'Reach, impressions, engagements, taux, vues vidéos, clics', defaultIn: ['hebdomadaire', 'mensuel', 'campagne', 'benchmark'] },
  { id: 'period_comparison', label: 'Comparaison de périodes', desc: 'Comparatif N vs N-1 (semaine ou mois précédent) en absolu et %', defaultIn: ['hebdomadaire', 'mensuel'] },
  { id: 'speeches_analysis', label: 'Performance des prises de parole', desc: 'Résultats détaillés par offre, activation, post ou thème éditorial', defaultIn: ['hebdomadaire', 'mensuel', 'campagne'] },
  { id: 'qualitative_insights', label: 'Insights qualitatifs', desc: 'Moteurs de performance, limites, apprentissages terrain', defaultIn: ['hebdomadaire', 'mensuel', 'spontane', 'campagne', 'benchmark', 'executif'] },
  { id: 'format_analysis', label: 'Analyse des formats', desc: 'Vidéos/Reels, Carousels, Photos, Stories, Quiz, Liens web', defaultIn: ['mensuel', 'campagne'] },
  { id: 'competitive_benchmark', label: 'Benchmark concurrentiel', desc: 'Comparatif Orange vs MTN vs Camtel (Part de voix, interactions)', defaultIn: ['hebdomadaire', 'mensuel', 'benchmark'] },
  { id: 'best_posts', label: 'Best posts & Top contenus', desc: 'Top publications avec captures, KPI et analyse de succès', defaultIn: ['hebdomadaire', 'mensuel', 'campagne'] },
  { id: 'paid_media_roi', label: 'Analyse Paid Media & Sponsoring', desc: 'Budget engagé, CPM, CPC, CTR, CPA et coût par résultat', defaultIn: ['mensuel', 'campagne'] },
  { id: 'sentiment_social_listening', label: 'Analyse de sentiment & Veille', desc: 'Tonalité, verbatims, risques réputationnels et thèmes récurrents', defaultIn: ['spontane', 'mensuel', 'benchmark'] },
  { id: 'actionable_recos', label: 'Recommandations & Plan d’action', desc: 'Actions éditoriales, média, créatives et stratégiques', defaultIn: ['hebdomadaire', 'mensuel', 'spontane', 'campagne', 'benchmark', 'executif'] },
  { id: 'raw_data_annexes', label: 'Annexes & Données brutes', desc: 'Exports chiffrés, définitions des KPI et méthodologie', defaultIn: ['mensuel', 'campagne', 'benchmark'] },
];

export const INITIAL_REPORTS = [
  {
    id: 'REP-2026-0817-TELCO',
    title: 'Rapport Hebdomadaire Social Media — S33 (11 au 17 Août 2026)',
    type: 'hebdomadaire',
    client: 'Orange Cameroun',
    brands: ['Orange TELCO', 'Orange Money'],
    requester: { name: 'Lauriane Ngameni', role: 'Digital Brand Manager', email: 'lauriane.ngameni@orange.cm', avatar: 'LN' },
    clientContact: { name: 'Patrick Tuete', role: 'Head of Digital Marketing', email: 'patrick.tuete@orange.cm' },
    assignee: { name: 'Steve BESSOUBE', role: 'Digital Web Analyst Lead', email: 'steve.bessoube@mccann.cm', avatar: 'SB' },
    reviewer: { name: 'Victor F. AKOA', role: 'Directeur de Création & Stratégie', avatar: 'VA' },
    priority: 'haute',
    status: 'client_review',
    submittedAt: '2026-08-18T08:30:00Z',
    dueDate: '2026-08-19',
    deliveredDate: null,
    briefCompleteness: 100,
    version: 'v1.2',
    versions: [
      { versionNumber: 'v1.0', date: '2026-08-18 14:00', author: 'Steve BESSOUBE', changelog: 'Création initiale des métriques S33' },
      { versionNumber: 'v1.1', date: '2026-08-18 16:30', author: 'Victor F. AKOA', changelog: 'Revue interne : ajustement benchmark TikTok MTN' },
      { versionNumber: 'v1.2', date: '2026-08-18 18:00', author: 'Steve BESSOUBE', changelog: 'Soumission finale pour validation client' }
    ],
    period: {
      start: '2026-08-11',
      end: '2026-08-17',
      label: 'Semaine du 11 au 17 août 2026 (S33)',
      comparisonType: 'periode_precedente',
      comparisonLabel: 'vs Semaine précédente (S32)',
      dataTypes: 'mixte',
      channels: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'X (Twitter)', 'YouTube'],
      region: 'Cameroun (National)',
      currency: 'XAF',
    },
    context: {
      campaignName: 'Push Promo Maxit 50% & Pulse Campus Gaming',
      marketingObjective: 'Engagement & Conversions Maxit',
      businessQuestion: 'Quel est l’impact du format vidéo court TikTok/Reels sur les conversions Maxit face à l’offensive MoMo MTN ?',
      hypotheses: 'Le couplage des offres Telco avec le gaming génère 2x plus de partage sur TikTok.',
      keyMoments: 'Lancement du tournoi Orange Pulse E-Sport Douala + Promo Maxit 50% bonus data.',
      attachments: [
        { name: 'Plan_Media_S33_Orange.xlsx', size: '2.4 MB', type: 'excel' },
        { name: 'Brief_Promo_Maxit_Aout2026.pdf', size: '1.8 MB', type: 'pdf' }
      ]
    },
    selectedSections: [
      'cover', 'executive_summary', 'community_growth', 'platform_performance',
      'period_comparison', 'speeches_analysis', 'qualitative_insights',
      'competitive_benchmark', 'best_posts', 'actionable_recos'
    ],
    comments: [
      {
        id: 'c1',
        author: 'Victor F. AKOA',
        role: 'Directeur Conseil McCann',
        date: '2026-08-18 16:15',
        type: 'internal',
        text: 'Très bonne analyse sur TikTok. N\'oublie pas d\'insister sur le ratio coût par acquisition vs Facebook.',
        resolved: true
      },
      {
        id: 'c2',
        author: 'Lauriane Ngameni',
        role: 'Digital Brand Manager (Orange)',
        date: '2026-08-19 09:40',
        type: 'client',
        text: 'Nous apprécions le focus sur Pulse Gaming. Pouvez-vous préciser le taux de clic vers l\'application Maxit ?',
        resolved: false
      }
    ],
    auditLog: [
      { timestamp: '2026-08-18 08:30', user: 'Lauriane Ngameni', action: 'Création', detail: 'Demande hebdomadaire S33 soumise avec priorité Haute' },
      { timestamp: '2026-08-18 09:00', user: 'Victor F. AKOA', action: 'Qualification', detail: 'Demande qualifiée et assignée à Steve BESSOUBE' },
      { timestamp: '2026-08-18 14:00', user: 'Steve BESSOUBE', action: 'Production', detail: 'Importation des KPI et rédaction des insights qualitatifs' },
      { timestamp: '2026-08-18 16:30', user: 'Victor F. AKOA', action: 'Revue Interne', detail: 'Validation interne accordée avec mention mineure' },
      { timestamp: '2026-08-18 18:00', user: 'Steve BESSOUBE', action: 'Transmission Client', detail: 'Rapport v1.2 soumis en validation client' }
    ],
    data: {
      executiveSummary: {
        highlights: [
          'Portée globale consolidée de 2.45M personnes (+14.2% vs S32) tirée par la campagne Pulse Gaming.',
          'Taux d’engagement moyen record à 5.8% (vs 4.9% la semaine précédente), surperformant le benchmark MTN (4.1%).',
          '9 200 activations de l’offre Maxit générées directement depuis les liens sponsorisés.',
          'Surperformance spectaculaire de TikTok : +12.5% de communauté et 420K vues sur le sketch OM Transfer.'
        ],
        alerts: [
          'X (Twitter) en léger recul d’abonnés (-0.5%) suite aux réclamations relatives à la latence fibre du 13 août.',
          'Sous-exposition persistante des régions Grand Nord (Garoua, Maroua) représentant seulement 8% du reach payant.'
        ],
        priorityRecos: [
          'Réallouer 20% du sponsoring Facebook vers TikTok et Instagram Reels pour maximiser la cible 18-25 ans.',
          'Déployer une prise de parole rassurante sur X concernant la stabilité du réseau fibre et mobile.'
        ]
      },
      communityEvolution: {
        initialTotal: 1407000,
        finalTotal: 1422000,
        netGrowth: 15000,
        growthPercent: 1.07,
        byPlatform: [
          { platform: 'Facebook', initial: 882000, final: 890000, net: 8000, growth: 0.91 },
          { platform: 'Instagram', initial: 312000, final: 320000, net: 8000, growth: 2.56 },
          { platform: 'TikTok', initial: 75000, final: 85000, net: 10000, growth: 13.33 },
          { platform: 'LinkedIn', initial: 44200, final: 45000, net: 800, growth: 1.81 },
          { platform: 'X (Twitter)', initial: 67300, final: 67000, net: -300, growth: -0.45 },
          { platform: 'YouTube', initial: 26500, final: 27000, net: 500, growth: 1.88 },
        ]
      },
      platformPerformance: [
        { name: 'Facebook', followers: 890000, reach: 1200000, impressions: 2100000, engagements: 88200, engagementRate: 4.2, videoViews: 450000, clicks: 32000, posts: 14, growth: '+0.9%', vsPrevious: { reach: '+8.5%', engagement: '+0.4pt' } },
        { name: 'Instagram', followers: 320000, reach: 580000, impressions: 980000, engagements: 56840, engagementRate: 5.8, videoViews: 380000, clicks: 14500, posts: 10, growth: '+2.6%', vsPrevious: { reach: '+18.2%', engagement: '+1.1pt' } },
        { name: 'TikTok', followers: 85000, reach: 420000, impressions: 750000, engagements: 61500, engagementRate: 8.2, videoViews: 520000, clicks: 18200, posts: 6, growth: '+13.3%', vsPrevious: { reach: '+34.0%', engagement: '+2.3pt' } },
        { name: 'LinkedIn', followers: 45000, reach: 62000, impressions: 110000, engagements: 2860, engagementRate: 2.6, videoViews: 18000, clicks: 3400, posts: 4, growth: '+1.8%', vsPrevious: { reach: '+5.0%', engagement: '-0.2pt' } },
        { name: 'X (Twitter)', followers: 67000, reach: 95000, impressions: 180000, engagements: 3420, engagementRate: 1.9, videoViews: 22000, clicks: 4100, posts: 8, growth: '-0.5%', vsPrevious: { reach: '-12.0%', engagement: '-0.8pt' } },
        { name: 'YouTube', followers: 27000, reach: 93000, impressions: 150000, engagements: 4100, engagementRate: 4.4, videoViews: 88000, clicks: 2100, posts: 2, growth: '+1.9%', vsPrevious: { reach: '+15.0%', engagement: '+0.5pt' } },
      ],
      speeches: [
        {
          id: 'SP-01',
          name: 'Promo Maxit 50% Bonus Data',
          brand: 'Orange TELCO',
          period: '11-17 Août',
          objective: 'Conversions & Téléchargements',
          channel: 'Facebook & Instagram',
          format: 'Carrousel 5 slides + Reel',
          url: 'https://facebook.com/orangecameroon/posts/10162984',
          isPaid: true,
          impressions: 850000,
          reach: 602000,
          clicks: 24500,
          engagements: 36700,
          engagementRate: 6.1,
          videoViews: 195000,
          conversions: 9200,
          cpa: '135 FCFA',
          insight: 'Surperformance (+20% vs objectif). Le visuel combinant l’offre Data avec un bonus OM transfert suscite un fort intérêt croisé.',
          recommendation: 'Maintenir la rotation du carrousel et amplifier le sponsoring sur Douala et Bafoussam.'
        },
        {
          id: 'SP-02',
          name: 'Pulse Campus Gaming E-Sport',
          brand: 'Orange Pulse',
          period: '13-17 Août',
          objective: 'Notoriété & Engagement Jeunes',
          channel: 'TikTok & Instagram',
          format: 'Vidéo courte / Challenge TikTok',
          url: 'https://tiktok.com/@orangecameroon/video/849204',
          isPaid: true,
          impressions: 540000,
          reach: 410000,
          clicks: 12800,
          engagements: 48200,
          engagementRate: 8.9,
          videoViews: 390000,
          conversions: 1850,
          cpa: '210 FCFA',
          insight: 'Format ultra-dynamique avec créateurs gaming locaux (score d’affinité 9.2/10). Commentaires très positifs.',
          recommendation: 'Organiser une deuxième session live avec attribution de pass data gaming en direct.'
        },
        {
          id: 'SP-03',
          name: 'OM Transfert Zéro Frais Août',
          brand: 'Orange Money',
          period: '11-16 Août',
          objective: 'Transactions & Fidélisation',
          channel: 'Facebook & X',
          format: 'Infographie motion 15s',
          url: 'https://facebook.com/orangemoneycm/posts/948271',
          isPaid: false,
          impressions: 310000,
          reach: 220000,
          clicks: 6400,
          engagements: 9800,
          engagementRate: 4.4,
          videoViews: 95000,
          conversions: 3400,
          cpa: '0 FCFA (Organique)',
          insight: 'Le format infographie pédagogique a généré plus de 1 200 partages organiques par les utilisateurs satisfaits.',
          recommendation: 'Sponsoriser la vidéo motion pour contrer l’offensive MoMo MTN Zero Fees.'
        },
        {
          id: 'SP-04',
          name: 'Webinaire B2B — Cybersécurité PME',
          brand: 'Orange Business',
          period: '12-15 Août',
          objective: 'Lead Generation B2B',
          channel: 'LinkedIn',
          format: 'Bannière Carrousel Document',
          url: 'https://linkedin.com/company/orange-business-cm/posts/2391',
          isPaid: true,
          impressions: 48000,
          reach: 32000,
          clicks: 1950,
          engagements: 1240,
          engagementRate: 3.8,
          videoViews: 0,
          conversions: 440,
          cpa: '1 850 FCFA',
          insight: '88% de taux de complétion de l’objectif d’inscription. Profil des inscrits : DSI et Directeurs Financiers.',
          recommendation: 'Envoyer un rappel SMS 1h avant l’événement aux inscrits pour maximiser la présence réelle.'
        }
      ],
      benchmark: {
        period: 'Semaine 33 (Août 2026)',
        competitors: [
          { name: 'MTN Cameroun', followers: '2.12M', engagement: '3.9%', postsPerWeek: 26, topFormat: 'Vidéos Skit TikTok', topCampaign: 'MoMo Zero Fees Promo', insight: 'Présence agressive sur TikTok avec sponsoring lourd. Moins engageant sur LinkedIn.' },
          { name: 'Camtel (Blue)', followers: '182K', engagement: '2.0%', postsPerWeek: 7, topFormat: 'Statique corporate', topCampaign: 'Fibre Blue Ultra', insight: 'Activité faible le week-end. Focus sur les offres fibre.' }
        ],
        orange: { name: 'Orange Cameroun', followers: '1.42M', engagement: '5.8%', postsPerWeek: 20, topFormat: 'Reels / TikTok & Carrousel' },
        insights: [
          'Orange maintient le meilleur taux d’engagement sectoriel (5.8% vs 3.9% pour MTN et 2.0% pour Camtel).',
          'MTN conserve un avantage en volume d’abonnés bruts (+49%), mais avec un taux d’interaction par post inférieur de 32%.'
        ]
      },
      bestPosts: [
        {
          id: 'BP-01',
          title: 'Challenge Pulse Gaming Douala 🎮',
          channel: 'TikTok',
          format: 'Vidéo courte 22s',
          date: '14 Août 2026',
          reach: 385000,
          engagements: 42100,
          rate: '10.9%',
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
          caption: 'Qui est le champion FIFA de Douala ? Découvre les vainqueurs du tournoi Orange Pulse Gaming ! 🔥 #OrangePulse #GamingCM',
          keyDriver: 'Humour local et mise en avant des vrais joueurs de la communauté.',
          lesson: 'Les contenus avec visages de clients et gamers locaux génèrent 3x plus d’interactions spontanées.'
        },
        {
          id: 'BP-02',
          title: 'Carrousel : 5 Astuces pour doubler vos datas Maxit 🚀',
          channel: 'Instagram',
          format: 'Carrousel 5 slides',
          date: '12 Août 2026',
          reach: 240000,
          engagements: 19400,
          rate: '8.1%',
          imageUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80',
          caption: 'Ne perds plus un seul méga ! Swipe pour débloquer les 5 bonus cachés de l’application Maxit 📲✨',
          keyDriver: 'Format valeur ajoutée et utilité immédiate pour le portefeuille de l’utilisateur.',
          lesson: 'Les carrousels "How-to" ont le taux de sauvegarde le plus élevé (3 800 enregistrements).'
        }
      ],
      paidMedia: {
        budgetSpent: 3500000,
        paidReach: 1450000,
        impressions: 2900000,
        cpm: '1 206 FCFA',
        cpc: '48 FCFA',
        ctr: '2.51%',
        conversions: 11490,
        cpa: '304 FCFA',
        channelsBreakdown: [
          { channel: 'Meta Ads (FB/IG)', budget: 2200000, share: '63%', cpc: '42 FCFA', results: 8200 },
          { channel: 'TikTok Ads', budget: 900000, share: '26%', cpc: '38 FCFA', results: 2850 },
          { channel: 'LinkedIn Ads', budget: 400000, share: '11%', cpc: '205 FCFA', results: 440 }
        ]
      },
      sentimentAnalysis: {
        positive: 68,
        neutral: 22,
        negative: 10,
        topKeywords: ['Maxit Promo', 'Pulse Gaming', 'Rapidité Orange Money', 'Fibre Douala', 'Data Bonus'],
        riskMentions: ['Latence fibre Bonabéri le 13/08 (résolu en 2h)', 'Questions sur les conditions du bonus 50%']
      },
      recommendations: {
        editorial: [
          'Capitaliser sur l’engouement du gaming avec 2 vidéos courtes hebdomadaires régulières.',
          'Conserver le format carrousel éducatif le mardi matin (pic de rétention observé).'
        ],
        media: [
          'Augmenter de +15% l’allocation budgétaire sur TikTok Ads où le CPC (38 FCFA) est le plus efficient.',
          'Recentrer la diffusion géographique payante pour couvrir l’Ouest et le Grand Nord.'
        ],
        creative: [
          'Tester des vidéos avec sous-titres en Pidgin / Français familier pour maximiser la proximité.',
          'Accroître les éléments visuels de preuve (témoignages utilisateurs réels).'
        ],
        strategic: [
          'Préparer le dispositif de rentrée scolaire (Offre Rentrée Étudiante Pulse) dès S35.',
          'Monitorer le benchmark MoMo suite aux récentes annonces tarifaires de la concurrence.'
        ]
      }
    }
  },
  {
    id: 'REP-2026-07-360',
    title: 'Rapport Mensuel Consolidé 360° — Juillet 2026',
    type: 'mensuel',
    client: 'Orange Cameroun',
    brands: ['Orange TELCO', 'Orange Money', 'Orange Business', 'Orange Pulse'],
    requester: { name: 'Patrick Tuete', role: 'Head of Digital Marketing', email: 'patrick.tuete@orange.cm', avatar: 'PT' },
    clientContact: { name: 'Henriette Silo', role: 'Directrice Communication Marque', email: 'henriette.silo@orange.cm' },
    assignee: { name: 'Steve BESSOUBE', role: 'Digital Web Analyst Lead', email: 'steve.bessoube@mccann.cm', avatar: 'SB' },
    reviewer: { name: 'Victor F. AKOA', role: 'Directeur Conseil McCann', avatar: 'VA' },
    priority: 'normale',
    status: 'delivered',
    submittedAt: '2026-08-01T10:00:00Z',
    dueDate: '2026-08-07',
    deliveredDate: '2026-08-06',
    briefCompleteness: 100,
    version: 'v2.0 (Verrouillée)',
    versions: [
      { versionNumber: 'v1.0', date: '2026-08-04 11:00', author: 'Steve BESSOUBE', changelog: 'Version initiale mensuelle' },
      { versionNumber: 'v2.0', date: '2026-08-06 17:00', author: 'Steve BESSOUBE', changelog: 'Validation client finale & Clôture' }
    ],
    period: {
      start: '2026-07-01',
      end: '2026-07-31',
      label: 'Mois de Juillet 2026',
      comparisonType: 'periode_precedente',
      comparisonLabel: 'vs Juin 2026 (M-1)',
      dataTypes: 'mixte',
      channels: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'X (Twitter)', 'YouTube', 'Site Web'],
      region: 'National & Régions clés',
      currency: 'XAF',
    },
    context: {
      campaignName: 'Bilan Mensuel Digital & Campagne Vacances Connectées',
      marketingObjective: 'Notoriété, Recrutement & Ventes offres Data Vacances',
      businessQuestion: 'Quelles sont les performances globales sur les 4 BUs et le ROI des investissements médias digitaux de juillet ?',
      hypotheses: 'Le mois de juillet enregistre une hausse de +25% de trafic web suite au sponsoring football.',
      keyMoments: 'Sponsoring tournois de vacances, Lancement Promo OM Vacances, Campagne Fibre B2B.',
      attachments: [{ name: 'Bilan_Media_Juillet_2026.pdf', size: '4.8 MB', type: 'pdf' }]
    },
    selectedSections: [
      'cover', 'executive_summary', 'community_growth', 'platform_performance',
      'period_comparison', 'speeches_analysis', 'qualitative_insights', 'format_analysis',
      'competitive_benchmark', 'best_posts', 'paid_media_roi', 'sentiment_social_listening',
      'actionable_recos', 'raw_data_annexes'
    ],
    comments: [
      {
        id: 'c3',
        author: 'Henriette Silo',
        role: 'Directrice Communication',
        date: '2026-08-06 15:20',
        type: 'client',
        text: 'Rapport très complet et d’excellente facture. Validé sans réserve pour présentation au comité de direction.',
        resolved: true
      }
    ],
    auditLog: [
      { timestamp: '2026-08-01 10:00', user: 'Patrick Tuete', action: 'Création', detail: 'Demande mensuelle Juillet 2026' },
      { timestamp: '2026-08-06 15:20', user: 'Henriette Silo', action: 'Validation', detail: 'Approbation client officielle' },
      { timestamp: '2026-08-06 17:00', user: 'Steve BESSOUBE', action: 'Livraison', detail: 'Verrouillage v2.0 et archivage du livrable final' }
    ],
    data: {
      executiveSummary: {
        highlights: [
          'Reach mensuel net dédupliqué de 5.8 millions de personnes touchées (+18% vs Juin).',
          'Croissance nette des communautés de +48 500 nouveaux abonnés qualifiés sur l’ensemble des carrefours d’audience.',
          '18.4 millions d’impressions globales avec un taux d’engagement moyen consolidé de 5.2%.',
          'ROAS digital estimé à 4.6x sur les offres Maxit et souscriptions data vacances.'
        ],
        alerts: ['Tension concurrentielle accrue sur les tarifs transferts d’argent pendant la deuxième quinzaine.'],
        priorityRecos: ['Maintenir l’offensive sur le mobile gaming et intensifier la conversion sur l’app Maxit en août.']
      },
      communityEvolution: {
        initialTotal: 1358500,
        finalTotal: 1407000,
        netGrowth: 48500,
        growthPercent: 3.57,
        byPlatform: [
          { platform: 'Facebook', initial: 865000, final: 882000, net: 17000, growth: 1.96 },
          { platform: 'Instagram', initial: 298000, final: 312000, net: 14000, growth: 4.69 },
          { platform: 'TikTok', initial: 60000, final: 75000, net: 15000, growth: 25.0 },
          { platform: 'LinkedIn', initial: 42500, final: 44200, net: 1700, growth: 4.0 },
          { platform: 'X (Twitter)', initial: 66500, final: 67300, net: 800, growth: 1.2 },
          { platform: 'YouTube', initial: 26500, final: 26500, net: 0, growth: 0.0 }
        ]
      },
      platformPerformance: [
        { name: 'Facebook', followers: 882000, reach: 3800000, impressions: 8500000, engagements: 345000, engagementRate: 4.1, videoViews: 1800000, clicks: 125000, posts: 58, growth: '+1.96%', vsPrevious: { reach: '+12.0%', engagement: '+0.2pt' } },
        { name: 'Instagram', followers: 312000, reach: 1950000, impressions: 4200000, engagements: 218000, engagementRate: 5.2, videoViews: 1450000, clicks: 58000, posts: 42, growth: '+4.69%', vsPrevious: { reach: '+22.0%', engagement: '+0.6pt' } },
        { name: 'TikTok', followers: 75000, reach: 1450000, impressions: 3100000, engagements: 248000, engagementRate: 8.0, videoViews: 2200000, clicks: 64000, posts: 24, growth: '+25.0%', vsPrevious: { reach: '+65.0%', engagement: '+1.8pt' } },
        { name: 'LinkedIn', followers: 44200, reach: 240000, impressions: 480000, engagements: 11500, engagementRate: 2.4, videoViews: 65000, clicks: 14200, posts: 16, growth: '+4.0%', vsPrevious: { reach: '+8.0%', engagement: '+0.1pt' } },
        { name: 'X (Twitter)', followers: 67300, reach: 390000, impressions: 720000, engagements: 13800, engagementRate: 1.9, videoViews: 85000, clicks: 16500, posts: 32, growth: '+1.2%', vsPrevious: { reach: '+2.0%', engagement: '-0.1pt' } },
        { name: 'YouTube', followers: 26500, reach: 380000, impressions: 680000, engagements: 18200, engagementRate: 4.8, videoViews: 340000, clicks: 9400, posts: 8, growth: '+0.0%', vsPrevious: { reach: '+14.0%', engagement: '+0.4pt' } }
      ],
      speeches: [],
      benchmark: {
        period: 'Juillet 2026',
        competitors: [
          { name: 'MTN Cameroun', followers: '2.10M', engagement: '3.7%', postsPerWeek: 28, topFormat: 'Vidéos & Sponsoring influenceurs', topCampaign: 'MoMo Summer Deals', insight: 'Très forte présence événementielle sur le littoral.' },
          { name: 'Camtel Blue', followers: '180K', engagement: '2.1%', postsPerWeek: 8, topFormat: 'Statique', topCampaign: 'Fibre Été', insight: 'Progression modérée.' }
        ],
        orange: { name: 'Orange Cameroun', followers: '1.40M', engagement: '5.2%', postsPerWeek: 22, topFormat: 'Reels / Vidéos courtes & Carrousels' },
        insights: ['Orange surperforme sur la qualité d’engagement et la mémorisation publicitaire digitale.']
      },
      bestPosts: [],
      paidMedia: {
        budgetSpent: 14200000,
        paidReach: 4200000,
        impressions: 9800000,
        cpm: '1 448 FCFA',
        cpc: '45 FCFA',
        ctr: '2.48%',
        conversions: 46800,
        cpa: '303 FCFA',
        channelsBreakdown: []
      },
      sentimentAnalysis: { positive: 72, neutral: 20, negative: 8, topKeywords: ['Vacances Orange', 'OM Zéro Frais', 'Maxit', 'Fibre Orange'], riskMentions: [] },
      recommendations: { editorial: [], media: [], creative: [], strategic: [] }
    }
  },
  {
    id: 'REP-2026-0814-CRISIS',
    title: 'Rapport Spontané — Analyse Post-Incident Latence Fibre & Sentiment Social',
    type: 'spontane',
    client: 'Orange Cameroun',
    brands: ['Orange TELCO', 'Orange Business'],
    requester: { name: 'Henriette Silo', role: 'Directrice Communication Marque', email: 'henriette.silo@orange.cm', avatar: 'HS' },
    clientContact: { name: 'Lauriane Ngameni', role: 'Digital Brand Manager', email: 'lauriane.ngameni@orange.cm' },
    assignee: { name: 'Steve BESSOUBE', role: 'Digital Web Analyst Lead', email: 'steve.bessoube@mccann.cm', avatar: 'SB' },
    reviewer: { name: 'Victor F. AKOA', role: 'Directeur Conseil McCann', avatar: 'VA' },
    priority: 'urgente',
    urgentReason: 'Spike de réclamations sur X et Facebook suite à la rupture câble sous-marin WACS du 13 août 2026 (14h-18h). Nécessité d’un bilan e-réputation sous 24h pour le comité de crise.',
    status: 'in_production',
    submittedAt: '2026-08-14T09:15:00Z',
    dueDate: '2026-08-15',
    deliveredDate: null,
    briefCompleteness: 95,
    version: 'v1.0 (Draft)',
    versions: [
      { versionNumber: 'v1.0', date: '2026-08-14 11:30', author: 'Steve BESSOUBE', changelog: 'Extraction social listening et cartographie des volumes' }
    ],
    period: {
      start: '2026-08-13',
      end: '2026-08-14',
      label: '48h d’analyse d’incident (13-14 août 2026)',
      comparisonType: 'aucune',
      comparisonLabel: 'Sans comparaison',
      dataTypes: 'organique',
      channels: ['X (Twitter)', 'Facebook', 'LinkedIn'],
      region: 'Douala & Yaoundé',
      currency: 'XAF',
    },
    context: {
      campaignName: 'Veille de Crise — Coupure Fibre',
      marketingObjective: 'Veille & Préservation de l’e-réputation',
      businessQuestion: 'Quel a été l’impact de l’incident réseau sur le sentiment de marque et quel est le volume des verbatims négatifs ?',
      hypotheses: 'Le pic de négativité a été contenu grâce au communiqué officiel publié à 15h30.',
      keyMoments: '14h10 : début des lenteurs ; 15h30 : tweet d’information ; 18h00 : rétablissement total.',
      attachments: [{ name: 'Social_Listening_Export_1308.csv', size: '1.2 MB', type: 'csv' }]
    },
    selectedSections: ['cover', 'executive_summary', 'qualitative_insights', 'sentiment_social_listening', 'actionable_recos'],
    comments: [
      {
        id: 'c4',
        author: 'Steve BESSOUBE',
        role: 'Web Analyst',
        date: '2026-08-14 11:45',
        type: 'internal',
        text: 'Collecte de 1 450 tweets et 2 800 commentaires FB effectuée. Sentiment négatif tombé de 64% à 18% après le message de rétablissement.',
        resolved: false
      }
    ],
    auditLog: [
      { timestamp: '2026-08-14 09:15', user: 'Henriette Silo', action: 'Création Urgente', detail: 'Demande spontanée avec SLA 24h' },
      { timestamp: '2026-08-14 09:30', user: 'Victor F. AKOA', action: 'Attribution Directe', detail: 'Assigné en urgence à Steve BESSOUBE' }
    ],
    data: {
      executiveSummary: {
        highlights: [
          'Volume total de 4 250 mentions captées sur l’incident (82% sur Twitter/X et Facebook).',
          'La réactivité du community management (réponse sous 12 minutes) a permis d’éviter la viralité hors des cercles tech.',
          'Retour à la normale du sentiment net dès le 14 août au matin (74% de tonalité neutre ou positive).'
        ],
        alerts: ['3 comptes d’influenceurs tech locaux ont relayé l’incident avant le communiqué officiel.'],
        priorityRecos: ['Créer un canal WhatsApp direct d’alerte pour les 15 créateurs tech de référence en cas d’incident technique.']
      },
      communityEvolution: { initialTotal: 1422000, finalTotal: 1422000, netGrowth: 0, growthPercent: 0, byPlatform: [] },
      platformPerformance: [],
      speeches: [],
      benchmark: { period: '13-14 Août', competitors: [], orange: {}, insights: [] },
      bestPosts: [],
      paidMedia: { budgetSpent: 0, paidReach: 0, impressions: 0, cpm: '0', cpc: '0', ctr: '0%', conversions: 0, cpa: '0', channelsBreakdown: [] },
      sentimentAnalysis: {
        positive: 38,
        neutral: 44,
        negative: 18,
        topKeywords: ['Réseau', 'Fibre', 'Orange Cameroun', 'Bonabéri', 'Rétablissement rapide', 'Connexion'],
        riskMentions: ['Demandes de dédommagement data formulées par 120 utilisateurs sur X']
      },
      recommendations: {
        editorial: ['Publier un mot de remerciement pour la fidélité et la patience des abonnés.'],
        media: ['Suspendre les posts promotionnels sponsorisés pendant les 6h suivant un incident technique.'],
        creative: ['Préparer des gabarits d’infographies d’incident prêts à l’emploi pour gagner 30 minutes.'],
        strategic: ['Mettre en place un protocole d’information proactif SMS pour les clients Fibre Entreprise.']
      }
    }
  },
  {
    id: 'REP-2026-0801-PULSE',
    title: 'Rapport de Campagne — Orange Pulse Gaming & Campus Tour 2026',
    type: 'campagne',
    client: 'Orange Cameroun',
    brands: ['Orange Pulse', 'Orange TELCO'],
    requester: { name: 'Lauriane Ngameni', role: 'Digital Brand Manager', email: 'lauriane.ngameni@orange.cm', avatar: 'LN' },
    clientContact: { name: 'Patrick Tuete', role: 'Head of Digital Marketing', email: 'patrick.tuete@orange.cm' },
    assignee: { name: 'Steve BESSOUBE', role: 'Digital Web Analyst Lead', email: 'steve.bessoube@mccann.cm', avatar: 'SB' },
    reviewer: { name: 'Victor F. AKOA', role: 'Directeur Conseil McCann', avatar: 'VA' },
    priority: 'haute',
    status: 'internal_review',
    submittedAt: '2026-08-01T14:00:00Z',
    dueDate: '2026-08-20',
    deliveredDate: null,
    briefCompleteness: 100,
    version: 'v1.1',
    versions: [
      { versionNumber: 'v1.0', date: '2026-08-16 10:00', author: 'Steve BESSOUBE', changelog: 'Consolidation des données terrain campus + digital' },
      { versionNumber: 'v1.1', date: '2026-08-17 14:00', author: 'Steve BESSOUBE', changelog: 'Intégration du ROI influenceurs campus' }
    ],
    period: {
      start: '2026-07-15',
      end: '2026-08-15',
      label: 'Campagne Pulse Tour (15 Juillet - 15 Août 2026)',
      comparisonType: 'periode_precedente',
      comparisonLabel: 'vs Campagne Pulse 2025',
      dataTypes: 'mixte',
      channels: ['TikTok', 'Instagram', 'Facebook', 'YouTube'],
      region: 'Campus Douala, Yaoundé, Dschang, Buea',
      currency: 'XAF',
    },
    context: {
      campaignName: 'Pulse Campus Tour & E-Sport Championship',
      marketingObjective: 'Recrutement abonnés jeunes & Adoption Pass Pulse Gaming',
      businessQuestion: 'Quel est l’impact de l’activation hybride (physique + TikTok) sur les souscriptions au forfait Pulse Gaming ?',
      hypotheses: 'Le tournoi physique démultiplié en live TikTok génère un coût par acquisition divisé par deux.',
      keyMoments: '4 tournois inter-campus, 12 micro-influenceurs activés, 1 finale nationale e-sport.',
      attachments: [{ name: 'Bilan_Influenceurs_Pulse.xlsx', size: '3.1 MB', type: 'excel' }]
    },
    selectedSections: [
      'cover', 'executive_summary', 'community_growth', 'platform_performance',
      'speeches_analysis', 'qualitative_insights', 'format_analysis', 'best_posts',
      'paid_media_roi', 'actionable_recos'
    ],
    comments: [],
    auditLog: [
      { timestamp: '2026-08-01 14:00', user: 'Lauriane Ngameni', action: 'Création', detail: 'Demande de rapport de campagne' },
      { timestamp: '2026-08-17 14:30', user: 'Steve BESSOUBE', action: 'Revue Interne', detail: 'Soumis pour contrôle qualité McCann' }
    ],
    data: {
      executiveSummary: {
        highlights: [
          '1.85M de reach cumulé sur la cible 18-25 ans sur 30 jours d’activation.',
          '18 400 souscriptions au pass Pulse Gaming (123% de l’objectif initial de 15 000).',
          'Taux d’engagement record sur TikTok (9.4%) généré par les micro-influenceurs gamers.'
        ],
        alerts: ['L’activation sur le campus de Buea a manqué de couverture réseau le 2 août (corrigé avec camion relais).'],
        priorityRecos: ['Pérenniser la ligue E-Sport Orange Pulse avec des rendez-vous mensuels réguliers.']
      },
      communityEvolution: {
        initialTotal: 65000,
        finalTotal: 88000,
        netGrowth: 23000,
        growthPercent: 35.38,
        byPlatform: [
          { platform: 'TikTok', initial: 50000, final: 70000, net: 20000, growth: 40.0 },
          { platform: 'Instagram', initial: 15000, final: 18000, net: 3000, growth: 20.0 }
        ]
      },
      platformPerformance: [],
      speeches: [],
      benchmark: { period: '', competitors: [], orange: {}, insights: [] },
      bestPosts: [],
      paidMedia: { budgetSpent: 6500000, paidReach: 1400000, impressions: 3200000, cpm: '2031 FCFA', cpc: '52 FCFA', ctr: '3.1%', conversions: 18400, cpa: '353 FCFA', channelsBreakdown: [] },
      sentimentAnalysis: { positive: 88, neutral: 10, negative: 2, topKeywords: [], riskMentions: [] },
      recommendations: { editorial: [], media: [], creative: [], strategic: [] }
    }
  },
  {
    id: 'REP-2026-Q3-BENCH',
    title: 'Rapport de Benchmark Concurrentiel — Q3 2026 (Orange vs MTN vs Camtel)',
    type: 'benchmark',
    client: 'Orange Cameroun',
    brands: ['Orange TELCO', 'Orange Money', 'Orange Business'],
    requester: { name: 'Patrick Tuete', role: 'Head of Digital Marketing', email: 'patrick.tuete@orange.cm', avatar: 'PT' },
    clientContact: { name: 'Henriette Silo', role: 'Directrice Communication Marque', email: 'henriette.silo@orange.cm' },
    assignee: { name: 'Steve BESSOUBE', role: 'Digital Web Analyst Lead', email: 'steve.bessoube@mccann.cm', avatar: 'SB' },
    reviewer: { name: 'Victor F. AKOA', role: 'Directeur Conseil McCann', avatar: 'VA' },
    priority: 'normale',
    status: 'qualified',
    submittedAt: '2026-08-10T11:00:00Z',
    dueDate: '2026-08-25',
    deliveredDate: null,
    briefCompleteness: 90,
    version: 'v0.5',
    versions: [],
    period: {
      start: '2026-07-01',
      end: '2026-09-30',
      label: 'Benchmark Trimestriel Q3 2026',
      comparisonType: 'meme_periode_annee_precedente',
      comparisonLabel: 'vs Q3 2025 (N-1)',
      dataTypes: 'organique_et_sponsorise',
      channels: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'X (Twitter)'],
      region: 'Cameroun & Zone CEMAC',
      currency: 'XAF',
    },
    context: {
      campaignName: 'Veille Stratégique & Benchmark Telecom',
      marketingObjective: 'Part de Voix, Positionnement & Analyse des Tendances',
      businessQuestion: 'Quelles sont les parts de voix réelles, les investissements estimés et les stratégies de contenu des rivaux (MTN & Camtel) ?',
      hypotheses: 'MTN concentre 45% de son budget sur le sponsoring TikTok tandis qu’Orange domine en engagement qualitatif.',
      keyMoments: 'Lancement des offres rentrée scolaire et rentrée universitaire.',
      attachments: []
    },
    selectedSections: ['cover', 'executive_summary', 'competitive_benchmark', 'qualitative_insights', 'sentiment_social_listening', 'actionable_recos', 'raw_data_annexes'],
    comments: [],
    auditLog: [
      { timestamp: '2026-08-10 11:00', user: 'Patrick Tuete', action: 'Création', detail: 'Demande de benchmark trimestriel Q3' },
      { timestamp: '2026-08-11 09:00', user: 'Victor F. AKOA', action: 'Qualification', detail: 'Planification pour livraison le 25 août' }
    ],
    data: {
      executiveSummary: { highlights: ['Benchmark en cours de collecte des données Q3.'], alerts: [], priorityRecos: [] },
      communityEvolution: { initialTotal: 0, finalTotal: 0, netGrowth: 0, growthPercent: 0, byPlatform: [] },
      platformPerformance: [],
      speeches: [],
      benchmark: {
        period: 'Q3 2026 (En cours)',
        competitors: [
          { name: 'MTN Cameroun', followers: '2.12M', engagement: '3.9%', postsPerWeek: 26, topFormat: 'Vidéos Skit TikTok', topCampaign: 'MoMo Zero Fees Promo', insight: 'Présence agressive sur TikTok.' },
          { name: 'Camtel Blue', followers: '182K', engagement: '2.0%', postsPerWeek: 7, topFormat: 'Statique corporate', topCampaign: 'Fibre Blue Ultra', insight: 'Activité focalisée sur la fibre.' }
        ],
        orange: { name: 'Orange Cameroun', followers: '1.42M', engagement: '5.8%', postsPerWeek: 20, topFormat: 'Reels / TikTok & Carrousel' },
        insights: ['Collecte automatisée via API et social listening en cours d’agrégation.']
      },
      bestPosts: [],
      paidMedia: { budgetSpent: 0, paidReach: 0, impressions: 0, cpm: '0', cpc: '0', ctr: '0%', conversions: 0, cpa: '0', channelsBreakdown: [] },
      sentimentAnalysis: { positive: 65, neutral: 25, negative: 10, topKeywords: [], riskMentions: [] },
      recommendations: { editorial: [], media: [], creative: [], strategic: [] }
    }
  },
  {
    id: 'REP-2026-EX-08',
    title: 'Rapport Exécutif — Synthèse Direction & KPI Stratégiques Août 2026',
    type: 'executif',
    client: 'Orange Cameroun',
    brands: ['Orange TELCO', 'Orange Money', 'Orange Business'],
    requester: { name: 'Patrick Tuete', role: 'Head of Digital Marketing', email: 'patrick.tuete@orange.cm', avatar: 'PT' },
    clientContact: { name: 'Henriette Silo', role: 'Directrice Communication Marque', email: 'henriette.silo@orange.cm' },
    assignee: { name: 'Victor F. AKOA', role: 'Directeur Conseil McCann', email: 'victor.akoa@mccann.cm', avatar: 'VA' },
    reviewer: { name: 'Steve BESSOUBE', role: 'Digital Web Analyst Lead', avatar: 'SB' },
    priority: 'haute',
    status: 'delivered',
    submittedAt: '2026-08-05T08:00:00Z',
    dueDate: '2026-08-10',
    deliveredDate: '2026-08-09',
    briefCompleteness: 100,
    version: 'v2.0 Finale',
    versions: [
      { versionNumber: 'v1.0', date: '2026-08-08 12:00', author: 'Victor F. AKOA', changelog: 'Synthèse directoire' },
      { versionNumber: 'v2.0', date: '2026-08-09 16:00', author: 'Victor F. AKOA', changelog: 'Validation et livraison officielle' }
    ],
    period: {
      start: '2026-08-01',
      end: '2026-08-31',
      label: 'Synthèse Comité Direction — Août 2026',
      comparisonType: 'periode_precedente',
      comparisonLabel: 'vs Mois précédent',
      dataTypes: 'mixte',
      channels: ['Tous les canaux digitaux'],
      region: 'Cameroun',
      currency: 'XAF',
    },
    context: {
      campaignName: 'Gouvernance Stratégique Digitale',
      marketingObjective: 'Bilan exécutif et arbitrage des investissements H2 2026',
      businessQuestion: 'Quels sont les 5 enseignements majeurs et les arbitrages budgétaires prioritaires pour le second semestre ?',
      hypotheses: 'Le basculement de 30% du mix média vers les formats vidéos courts engendre une réduction de 22% du coût par acquisition global.',
      keyMoments: 'Comité de direction stratégique Orange Cameroun du 11 août 2026.',
      attachments: [{ name: 'Executive_Deck_Comite_Aout2026.pptx', size: '5.6 MB', type: 'powerpoint' }]
    },
    selectedSections: ['cover', 'executive_summary', 'qualitative_insights', 'competitive_benchmark', 'actionable_recos'],
    comments: [],
    auditLog: [
      { timestamp: '2026-08-05 08:00', user: 'Patrick Tuete', action: 'Création', detail: 'Demande exécutif direction' },
      { timestamp: '2026-08-09 16:00', user: 'Victor F. AKOA', action: 'Livraison Finale', detail: 'Validé et livré pour la réunion du comité' }
    ],
    data: {
      executiveSummary: {
        highlights: [
          'Performance globale du premier semestre supérieure de +14% aux objectifs fixés en début d’année.',
          'Orange Money et Orange Pulse représentent désormais 58% de l’ensemble des interactions digitales.',
          'L’optimisation du tunnel Maxit a permis d’abaisser le coût d’acquisition client de 420 FCFA à 304 FCFA.'
        ],
        alerts: ['Nécessité de sécuriser les partenariats influenceurs annuels avant le rush du Q4.'],
        priorityRecos: [
          'Sanctuariser une enveloppe d’innovation de 15% pour les activations TikTok et IA conversationnelle.',
          'Déployer le nouveau module Reporting & Insights en temps réel pour synchroniser les équipes Orange & McCann.'
        ]
      },
      communityEvolution: { initialTotal: 0, finalTotal: 0, netGrowth: 0, growthPercent: 0, byPlatform: [] },
      platformPerformance: [],
      speeches: [],
      benchmark: { period: '', competitors: [], orange: {}, insights: [] },
      bestPosts: [],
      paidMedia: { budgetSpent: 0, paidReach: 0, impressions: 0, cpm: '0', cpc: '0', ctr: '0%', conversions: 0, cpa: '0', channelsBreakdown: [] },
      sentimentAnalysis: { positive: 75, neutral: 20, negative: 5, topKeywords: [], riskMentions: [] },
      recommendations: { editorial: [], media: [], creative: [], strategic: [] }
    }
  }
];

export const REPORT_TEMPLATES = [
  {
    id: 'tpl_hebdo_social',
    title: 'Modèle Hebdomadaire Social Media & Benchmark',
    type: 'hebdomadaire',
    desc: 'Suivi hebdomadaire des KPI sociaux, benchmark concurrentiel, analyse des prises de parole et best posts.',
    recommendedChannels: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'X (Twitter)', 'YouTube'],
    recommendedSections: [
      'cover', 'executive_summary', 'community_growth', 'platform_performance',
      'period_comparison', 'speeches_analysis', 'qualitative_insights',
      'competitive_benchmark', 'best_posts', 'actionable_recos'
    ],
    sla: 'J+2 ouvré (Ex. livraison mardi 10h pour semaine précédente)',
    icon: '📅'
  },
  {
    id: 'tpl_mensuel_360',
    title: 'Modèle Mensuel Consolidé 360° & Paid Media',
    type: 'mensuel',
    desc: 'Bilan complet mensuel incluant performances organiques, investissements médias, ROI, formats et recommandations stratégiques.',
    recommendedChannels: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'X (Twitter)', 'YouTube', 'Site Web', 'Meta & Google Ads / Display'],
    recommendedSections: [
      'cover', 'executive_summary', 'community_growth', 'platform_performance',
      'period_comparison', 'speeches_analysis', 'qualitative_insights', 'format_analysis',
      'competitive_benchmark', 'best_posts', 'paid_media_roi', 'sentiment_social_listening',
      'actionable_recos', 'raw_data_annexes'
    ],
    sla: 'J+5 ouvrés après clôture du mois',
    icon: '📊'
  },
  {
    id: 'tpl_campagne_bilan',
    title: 'Modèle Bilan de Campagne & Activation Hybride',
    type: 'campagne',
    desc: 'Mesure de l’impact d’un lancement d’offre, événement, sponsoring ou opération promotionnelle avec calcul du coût par acquisition.',
    recommendedChannels: ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'Site Web / Landing Page'],
    recommendedSections: [
      'cover', 'executive_summary', 'platform_performance', 'speeches_analysis',
      'qualitative_insights', 'format_analysis', 'best_posts', 'paid_media_roi',
      'actionable_recos'
    ],
    sla: 'J+3 ouvré après la fin de vague',
    icon: '🎯'
  },
  {
    id: 'tpl_spontane_urgence',
    title: 'Modèle Rapport Spontané / Post-Incident & Veille',
    type: 'spontane',
    desc: 'Analyse d’un temps fort ad hoc, événement imprévu, question métier urgente ou veille de réputation de crise.',
    recommendedChannels: ['X (Twitter)', 'Facebook', 'LinkedIn'],
    recommendedSections: ['cover', 'executive_summary', 'qualitative_insights', 'sentiment_social_listening', 'actionable_recos'],
    sla: '24h à 48h selon niveau d’urgence',
    icon: '⚡'
  },
  {
    id: 'tpl_benchmark_deepdive',
    title: 'Modèle Benchmark Concurrentiel & Parts de Voix',
    type: 'benchmark',
    desc: 'Comparatif approfondi des acteurs du marché (Orange, MTN, Camtel) sur les volumes, formats dominants et angles de communication.',
    recommendedChannels: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'X (Twitter)'],
    recommendedSections: ['cover', 'executive_summary', 'competitive_benchmark', 'qualitative_insights', 'sentiment_social_listening', 'actionable_recos', 'raw_data_annexes'],
    sla: 'J+7 ouvrés',
    icon: '🔍'
  },
  {
    id: 'tpl_executif_direction',
    title: 'Modèle Synthèse Exécutive Direction & Conseil',
    type: 'executif',
    desc: 'Rapport synthétique à haute valeur décisionnelle pour comités de direction : résultats clés, risques et recommandations stratégiques.',
    recommendedChannels: ['Tous les canaux'],
    recommendedSections: ['cover', 'executive_summary', 'qualitative_insights', 'competitive_benchmark', 'actionable_recos'],
    sla: 'J+4 ouvré avant date du comité',
    icon: '👔'
  }
];
