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
    "id": "REP-2026-0817-TELCO",
    "title": "Rapport Hebdomadaire Social Media — S33 (11 au 17 Août 2026)",
    "type": "hebdomadaire",
    "client": "Orange Cameroun",
    "brands": [
      "Orange TELCO"
    ],
    "status": "delivered",
    "version": "v2.0",
    "priority": "haute",
    "dueDate": "2026-08-19",
    "createdAt": "2026-08-17T08:30:00Z",
    "updatedAt": "2026-08-19T11:00:00Z",
    "period": {
      "start": "2026-08-11",
      "end": "2026-08-17",
      "label": "Semaine S33 (11 au 17 Août 2026)",
      "comparisonType": "periode_precedente"
    },
    "requester": {
      "name": "Lauriane Ngameni",
      "role": "Digital Brand Manager",
      "email": "lauriane.ngameni@orange.cm"
    },
    "assignee": {
      "name": "Steve BESSOUBE",
      "role": "Digital Web Analyst & Media"
    },
    "clientContact": "Patrick Tuete (Head of Digital Marketing)",
    "channels": [
      "Facebook",
      "Instagram",
      "TikTok",
      "LinkedIn",
      "X (Twitter)",
      "YouTube"
    ],
    "sections": [
      "cover",
      "executive_summary",
      "community_growth",
      "platform_performance",
      "period_comparison",
      "speeches_analysis",
      "qualitative_insights",
      "competitive_benchmark",
      "best_posts",
      "actionable_recos"
    ],
    "context": {
      "campaignName": "Good Deal Data & Rentrée 4G+",
      "marketingObjective": "Notoriété & Engagement My Orange",
      "businessQuestion": "Quel impact de l’activation Good Deal du vendredi 15 août sur le volume de téléchargements et les réactions ?",
      "hypotheses": "Le format Reel humoristique génère un taux d’engagement supérieur à 8% et draine du trafic vers l’application.",
      "keyMoments": "Flash Promo data 5 Go à 1 000 FCFA le vendredi 15 août."
    },
    "data": {
      "summaryKpis": {
        "followers": 2450000,
        "followersGrowth": 18450,
        "growthRate": 0.76,
        "reach": 3850000,
        "impressions": 6200000,
        "engagements": 248000,
        "engagementRate": 6.44,
        "videoViews": 1420000,
        "videoCompletionRate": 38.5,
        "linkClicks": 42300,
        "adSpend": 2850000,
        "cpm": 460,
        "cpc": 67,
        "ctr": 2.85,
        "cpa": 240
      },
      "platformBreakdown": [
        {
          "channel": "Facebook",
          "followers": 1650000,
          "growth": 7200,
          "reach": 2100000,
          "engagements": 135000,
          "rate": 6.43,
          "posts": 14
        },
        {
          "channel": "TikTok",
          "followers": 420000,
          "growth": 8400,
          "reach": 1150000,
          "engagements": 82000,
          "rate": 7.13,
          "posts": 6
        },
        {
          "channel": "Instagram",
          "followers": 235000,
          "growth": 1950,
          "reach": 380000,
          "engagements": 21000,
          "rate": 5.53,
          "posts": 9
        },
        {
          "channel": "LinkedIn",
          "followers": 98000,
          "growth": 650,
          "reach": 145000,
          "engagements": 7200,
          "rate": 4.96,
          "posts": 4
        },
        {
          "channel": "X (Twitter)",
          "followers": 47000,
          "growth": 250,
          "reach": 75000,
          "engagements": 2800,
          "rate": 3.73,
          "posts": 12
        }
      ],
      "periodComparison": {
        "nVsNMinus1": [
          {
            "kpi": "Portée Totale (Reach)",
            "n": "3.85 M",
            "nMinus1": "3.20 M",
            "diff": "+20.3%",
            "isPositive": true
          },
          {
            "kpi": "Engagements Globaux",
            "n": "248.0 K",
            "nMinus1": "212.5 K",
            "diff": "+16.7%",
            "isPositive": true
          },
          {
            "kpi": "Taux d’engagement moyen",
            "n": "6.44%",
            "nMinus1": "6.12%",
            "diff": "+0.32 pt",
            "isPositive": true
          },
          {
            "kpi": "Vues de vidéos (>3s)",
            "n": "1.42 M",
            "nMinus1": "1.10 M",
            "diff": "+29.1%",
            "isPositive": true
          },
          {
            "kpi": "Clics vers My Orange",
            "n": "42.3 K",
            "nMinus1": "35.8 K",
            "diff": "+18.2%",
            "isPositive": true
          }
        ]
      },
      "speeches": [
        {
          "id": "SP-001",
          "brand": "Orange TELCO",
          "name": "Good Deal 5Go Weekend Promo",
          "channel": "Facebook",
          "format": "Reel & Carrousel",
          "objective": "Engagement & Clics",
          "date": "2026-08-15",
          "reach": 840000,
          "impressions": 1250000,
          "engagements": 68500,
          "engagementRate": 8.15,
          "videoViews": 450000,
          "clicks": 18400,
          "conversions": 6200,
          "sentiment": "91% Positif",
          "isPaid": true,
          "spend": 850000,
          "insight": "L’accroche directe sur le prix barré a suscité un partage massif sur WhatsApp et Facebook."
        },
        {
          "id": "SP-002",
          "brand": "Orange TELCO",
          "name": "Tutoriel Auto-assistance USSD #150#",
          "channel": "TikTok",
          "format": "Vidéo Courte Face Cam",
          "objective": "Éducation & Notoriété",
          "date": "2026-08-13",
          "reach": 480000,
          "impressions": 720000,
          "engagements": 41200,
          "engagementRate": 8.58,
          "videoViews": 390000,
          "clicks": 4200,
          "conversions": 1850,
          "sentiment": "88% Positif",
          "isPaid": false,
          "spend": 0,
          "insight": "Le ton décalé avec le créateur local Ulrich a généré plus de 1 200 commentaires constructifs."
        },
        {
          "id": "SP-003",
          "brand": "Orange TELCO",
          "name": "Conseils Sécurité SIM & Phishing",
          "channel": "LinkedIn",
          "format": "Document PDF Infographie",
          "objective": "Confiance & Corporate",
          "date": "2026-08-12",
          "reach": 95000,
          "impressions": 130000,
          "engagements": 4800,
          "engagementRate": 5.05,
          "videoViews": 0,
          "clicks": 2100,
          "conversions": 350,
          "sentiment": "94% Positif",
          "isPaid": false,
          "spend": 0,
          "insight": "Fort taux de republication par les cadres RH et chefs d’entreprises locaux."
        }
      ],
      "bestPosts": [
        {
          "id": "BP-01",
          "channel": "TikTok",
          "title": "Quand tu actives les 5 Go du Good Deal à 23h59 🏃💨",
          "format": "Reel / Vidéo humoristique",
          "date": "15 Août 2026",
          "reach": "520 K",
          "engagements": "48.2 K",
          "rate": "9.27%",
          "url": "https://tiktok.com/@orangecameroon",
          "successFactor": "Format court de 12s calé sur une musique tendance camerounaise. Rétention à 68% jusqu’à la fin."
        },
        {
          "id": "BP-02",
          "channel": "Facebook",
          "title": "Alerte Promo : Rechargez via My Orange et gagnez 100% de bonus data immédiat",
          "format": "Carrousel interactif 4 visuels",
          "date": "14 Août 2026",
          "reach": "780 K",
          "engagements": "52.4 K",
          "rate": "6.71%",
          "url": "https://facebook.com/orangecameroon",
          "successFactor": "Design épuré fond noir et orange néon avec bouton CTA direct vers la boutique en ligne."
        }
      ],
      "benchmark": {
        "competitors": [
          {
            "name": "Orange TELCO",
            "shareOfVoice": "44.5%",
            "interactions": "248 K",
            "posts": 45,
            "sentimentPositive": "84%"
          },
          {
            "name": "MTN Cameroun",
            "shareOfVoice": "38.2%",
            "interactions": "198 K",
            "posts": 38,
            "sentimentPositive": "78%"
          },
          {
            "name": "Blue by Camtel",
            "shareOfVoice": "17.3%",
            "interactions": "64 K",
            "posts": 22,
            "sentimentPositive": "71%"
          }
        ]
      },
      "qualitativeInsights": {
        "drivers": [
          "Le levier des micro-promotions week-end (Good Deal) reste le principal vecteur d’engagement spontané et de clics qualifiés.",
          "Forte progression de TikTok (+8 400 abonnés en 7 jours) grâce à une stratégie de co-création de contenu avec des créateurs camerounais."
        ],
        "friction": [
          "Légère saturation sur les publications de service client générique sous forme d’images statiques le lundi matin.",
          "Temps de réponse community management moyen mesuré à 14 min le dimanche (objectif : <10 min)."
        ],
        "learnings": [
          "Privilégier les publications vidéo courtes de 15 à 30 secondes pour toutes les annonces de tarif.",
          "Les Stories interactives avec stickers sondages augmentent la mémorisation de marque de 32%."
        ]
      },
      "actionableRecos": [
        "Reconduire l’offre Good Deal sur la tranche horaire 18h-22h avec amplification Meta Ads à 300 000 FCFA.",
        "Accélérer sur TikTok en programmant 3 capsules éducatives supplémentaires avec l’ambassadeur local.",
        "Renforcer la modération active sur Facebook durant les pics de questions sur l’itinérance réseau."
      ]
    },
    "comments": [
      {
        "id": "c1",
        "author": "Lauriane Ngameni",
        "role": "Demandeur Client",
        "date": "2026-08-17 08:35",
        "text": "Merci d’inclure un focus particulier sur la conversion de l’offre data du 15 août."
      },
      {
        "id": "c2",
        "author": "Steve BESSOUBE",
        "role": "Digital Analyst",
        "date": "2026-08-18 14:10",
        "text": "Données consolidées et intégrées dans le Data Studio avec le détail par canal."
      },
      {
        "id": "c3",
        "author": "Victor F. AKOA",
        "role": "Reviewer McCann",
        "date": "2026-08-18 17:30",
        "text": "Revue interne effectuée : les KPI et le benchmark concurrentiel sont validés. Rapport transmis au client."
      },
      {
        "id": "c4",
        "author": "Patrick Tuete",
        "role": "Client Lead",
        "date": "2026-08-19 10:45",
        "text": "Rapport validé sans réserve. Excellente analyse des formats TikTok."
      }
    ],
    "workflowHistory": [
      {
        "step": "submitted",
        "label": "Demande soumise",
        "date": "2026-08-17 08:30",
        "author": "Lauriane Ngameni"
      },
      {
        "step": "qualified",
        "label": "Demande qualifiée & planifiée",
        "date": "2026-08-17 09:15",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "in_production",
        "label": "Collecte & Analyse en cours",
        "date": "2026-08-17 10:00",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "internal_review",
        "label": "Soumis au contrôle qualité McCann",
        "date": "2026-08-18 16:30",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "client_review",
        "label": "Transmis au client Orange",
        "date": "2026-08-18 17:35",
        "author": "Victor F. AKOA"
      },
      {
        "step": "approved",
        "label": "Validé par le client",
        "date": "2026-08-19 10:45",
        "author": "Patrick Tuete"
      },
      {
        "step": "delivered",
        "label": "Livrable officiel livré et archivé",
        "date": "2026-08-19 11:00",
        "author": "Steve BESSOUBE"
      }
    ],
    "auditLog": [
      {
        "action": "CREATION",
        "author": "Lauriane Ngameni",
        "date": "2026-08-17 08:30:12"
      },
      {
        "action": "DATA_IMPORT",
        "author": "Steve BESSOUBE",
        "date": "2026-08-18 11:45:00",
        "details": "Import de 5 plateformes via Data Studio"
      },
      {
        "action": "STATUS_UPDATE",
        "author": "Victor F. AKOA",
        "date": "2026-08-18 17:35:00",
        "details": "Passage au statut en validation client"
      },
      {
        "action": "CLIENT_APPROVAL",
        "author": "Patrick Tuete",
        "date": "2026-08-19 10:45:00",
        "details": "Validation client approuvée"
      },
      {
        "action": "EXPORT_PDF",
        "author": "Steve BESSOUBE",
        "date": "2026-08-19 11:02:15",
        "details": "Export version définitive v2.0"
      }
    ]
  },
  {
    "id": "REP-2026-0731-MONEY",
    "title": "Rapport Mensuel Consolidé 360° & FinTech — Juillet 2026",
    "type": "mensuel",
    "client": "Orange Cameroun",
    "brands": [
      "Orange Money (OM)"
    ],
    "status": "client_review",
    "version": "v1.1",
    "priority": "haute",
    "dueDate": "2026-08-07",
    "createdAt": "2026-08-01T09:00:00Z",
    "updatedAt": "2026-08-05T16:20:00Z",
    "period": {
      "start": "2026-07-01",
      "end": "2026-07-31",
      "label": "Mois de Juillet 2026",
      "comparisonType": "periode_precedente"
    },
    "requester": {
      "name": "Martial Manga",
      "role": "Product Marketing Manager OM",
      "email": "martial.manga@orange.cm"
    },
    "assignee": {
      "name": "Steve BESSOUBE",
      "role": "Digital Analyst"
    },
    "clientContact": "Mireille Etoa (Head of Mobile Financial Services)",
    "channels": [
      "Facebook",
      "Instagram",
      "LinkedIn",
      "TikTok",
      "YouTube",
      "Meta & Google Ads / Display"
    ],
    "sections": [
      "cover",
      "executive_summary",
      "community_growth",
      "platform_performance",
      "period_comparison",
      "speeches_analysis",
      "qualitative_insights",
      "format_analysis",
      "competitive_benchmark",
      "best_posts",
      "paid_media_roi",
      "sentiment_social_listening",
      "actionable_recos",
      "raw_data_annexes"
    ],
    "context": {
      "campaignName": "Campagne 0 Frais Transferts & Maxit App",
      "marketingObjective": "Adoption de l’application Maxit & Transactionnel",
      "businessQuestion": "Quelle est l’efficacité comparée de nos prises de parole face à MoMo MTN sur le segment des commerçants et jeunes ?",
      "hypotheses": "La gratuité des retraits jusqu’à 5 000 FCFA entraîne une baisse sensible des réclamations négatives.",
      "keyMoments": "Campagne display sponsorisée tout le mois de juillet + tournoi vacances inter-quartiers."
    },
    "data": {
      "summaryKpis": {
        "followers": 1850000,
        "followersGrowth": 34200,
        "growthRate": 1.88,
        "reach": 7450000,
        "impressions": 14200000,
        "engagements": 512000,
        "engagementRate": 6.87,
        "videoViews": 3200000,
        "videoCompletionRate": 41.2,
        "linkClicks": 112000,
        "adSpend": 6500000,
        "cpm": 457,
        "cpc": 58,
        "ctr": 3.12,
        "cpa": 380
      },
      "platformBreakdown": [
        {
          "channel": "Facebook",
          "followers": 1200000,
          "growth": 14500,
          "reach": 4100000,
          "engagements": 285000,
          "rate": 6.95,
          "posts": 28
        },
        {
          "channel": "TikTok",
          "followers": 350000,
          "growth": 15200,
          "reach": 2400000,
          "engagements": 172000,
          "rate": 7.16,
          "posts": 14
        },
        {
          "channel": "LinkedIn",
          "followers": 160000,
          "growth": 2800,
          "reach": 520000,
          "engagements": 34000,
          "rate": 6.53,
          "posts": 10
        },
        {
          "channel": "Instagram",
          "followers": 140000,
          "growth": 1700,
          "reach": 430000,
          "engagements": 21000,
          "rate": 4.88,
          "posts": 12
        }
      ],
      "periodComparison": {
        "nVsNMinus1": [
          {
            "kpi": "Reach Consolidé",
            "n": "7.45 M",
            "nMinus1": "6.10 M",
            "diff": "+22.1%",
            "isPositive": true
          },
          {
            "kpi": "Engagements Totaux",
            "n": "512.0 K",
            "nMinus1": "420.0 K",
            "diff": "+21.9%",
            "isPositive": true
          },
          {
            "kpi": "Clics vers Maxit",
            "n": "112.0 K",
            "nMinus1": "86.5 K",
            "diff": "+29.4%",
            "isPositive": true
          },
          {
            "kpi": "Dépenses Média Ads",
            "n": "6.50 M XAF",
            "nMinus1": "5.80 M XAF",
            "diff": "+12.0%",
            "isPositive": false
          },
          {
            "kpi": "Coût par Clic (CPC)",
            "n": "58 XAF",
            "nMinus1": "67 XAF",
            "diff": "-13.4%",
            "isPositive": true
          }
        ]
      },
      "speeches": [
        {
          "id": "SP-101",
          "brand": "Orange Money (OM)",
          "name": "Zéro frais sur retraits jusqu’à 5 000 F",
          "channel": "Facebook",
          "format": "Vidéo Motion Design",
          "objective": "Notoriété & Confiance",
          "date": "2026-07-08",
          "reach": 1850000,
          "impressions": 3400000,
          "engagements": 142000,
          "engagementRate": 7.67,
          "videoViews": 1100000,
          "clicks": 34000,
          "conversions": 8400,
          "sentiment": "89% Positif",
          "isPaid": true,
          "spend": 2100000,
          "insight": "Levier d’acquisition majeur : plus de 8 400 nouveaux comptes Maxit activés."
        },
        {
          "id": "SP-102",
          "brand": "Orange Money (OM)",
          "name": "Paiement Commerçant QR Code en Boutique",
          "channel": "TikTok",
          "format": "Reel Caméra Cachée",
          "objective": "Usage & Pédagogie",
          "date": "2026-07-16",
          "reach": 920000,
          "impressions": 1600000,
          "engagements": 78000,
          "engagementRate": 8.47,
          "videoViews": 750000,
          "clicks": 12500,
          "conversions": 3200,
          "sentiment": "92% Positif",
          "isPaid": true,
          "spend": 900000,
          "insight": "Le format éducatif montrant la simplicité du scan QR code séduit les 18-30 ans."
        }
      ],
      "bestPosts": [
        {
          "id": "BP-OM-01",
          "channel": "Facebook",
          "title": "Envoyez l’argent des vacances à la famille au village sans stress ni frais cachés 📲💚",
          "format": "Vidéo courte 25s",
          "date": "12 Juillet 2026",
          "reach": "1.2 M",
          "engagements": "84 K",
          "rate": "7.00%",
          "url": "https://facebook.com/orangemoneycameroun",
          "successFactor": "Connexion émotionnelle forte avec le contexte des grandes vacances scolaires."
        }
      ],
      "benchmark": {
        "competitors": [
          {
            "name": "Orange Money",
            "shareOfVoice": "51.8%",
            "interactions": "512 K",
            "posts": 64,
            "sentimentPositive": "82%"
          },
          {
            "name": "MoMo MTN",
            "shareOfVoice": "42.4%",
            "interactions": "410 K",
            "posts": 58,
            "sentimentPositive": "76%"
          },
          {
            "name": "Autres FinTech",
            "shareOfVoice": "5.8%",
            "interactions": "45 K",
            "posts": 18,
            "sentimentPositive": "70%"
          }
        ]
      },
      "qualitativeInsights": {
        "drivers": [
          "Leadership affirmé sur la part de voix FinTech (51.8% vs 42.4% pour MoMo MTN).",
          "L’application Maxit s’impose comme le premier mot-clé de conversion dans les commentaires."
        ],
        "friction": [
          "Quelques interrogations récurrentes sur les plafonds de transfert mensuels pour les comptes non certifiés."
        ],
        "learnings": [
          "Les vidéos démo avec écran partagé génèrent 3x plus d’installation d’appli que les affiches statiques."
        ]
      },
      "actionableRecos": [
        "Lancer un volet de vidéos FAQ courtes pour lever les doutes sur l’identification biométrique.",
        "Consolider le partenariat avec les commerces de proximité dans les zones universitaires."
      ]
    },
    "comments": [
      {
        "id": "c1",
        "author": "Martial Manga",
        "role": "Product Marketing",
        "date": "2026-08-01 09:12",
        "text": "Bien vérifier le rapprochement des dépenses média Meta et Google Ads."
      },
      {
        "id": "c2",
        "author": "Steve BESSOUBE",
        "role": "Digital Analyst",
        "date": "2026-08-04 18:00",
        "text": "Données publicitaires réconciliées avec l’équipe média McCann. CPC en baisse de 13.4%."
      },
      {
        "id": "c3",
        "author": "Victor F. AKOA",
        "role": "Reviewer McCann",
        "date": "2026-08-05 16:20",
        "text": "Revue interne validée avec mention très favorable. Transmis à Madame Etoa pour approbation finale."
      }
    ],
    "workflowHistory": [
      {
        "step": "submitted",
        "label": "Demande soumise",
        "date": "2026-08-01 09:00",
        "author": "Martial Manga"
      },
      {
        "step": "qualified",
        "label": "Demande qualifiée",
        "date": "2026-08-01 11:30",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "in_production",
        "label": "Production & Consolidation 360°",
        "date": "2026-08-02 08:30",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "internal_review",
        "label": "Contrôle qualité interne",
        "date": "2026-08-05 14:00",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "client_review",
        "label": "En cours de validation client",
        "date": "2026-08-05 16:20",
        "author": "Victor F. AKOA"
      }
    ],
    "auditLog": [
      {
        "action": "CREATION",
        "author": "Martial Manga",
        "date": "2026-08-01 09:00:00"
      },
      {
        "action": "STATUS_UPDATE",
        "author": "Victor F. AKOA",
        "date": "2026-08-05 16:20:00",
        "details": "Transmis en validation client"
      }
    ]
  },
  {
    "id": "REP-2026-0812-SPONT",
    "title": "Rapport Spontané — Incident Réseau & Sentiment Clients (Fibre & 4G+)",
    "type": "spontane",
    "client": "Orange Cameroun",
    "brands": [
      "Orange Business",
      "Orange TELCO"
    ],
    "status": "in_production",
    "version": "v1.0",
    "priority": "urgente",
    "urgentReason": "Cellule de crise suite à la coupure du câble sous-marin SAT-3 le 11 août. Demande DG pour le comité exécutif.",
    "dueDate": "2026-08-13",
    "createdAt": "2026-08-12T07:15:00Z",
    "updatedAt": "2026-08-12T15:40:00Z",
    "period": {
      "start": "2026-08-11",
      "end": "2026-08-12",
      "label": "48h Post-Incident (11-12 Août 2026)",
      "comparisonType": "aucune"
    },
    "requester": {
      "name": "Arnaud Kamdem",
      "role": "Corporate Communications Lead",
      "email": "arnaud.kamdem@orange.cm"
    },
    "assignee": {
      "name": "Steve BESSOUBE",
      "role": "Digital Analyst"
    },
    "clientContact": "Serge Mvondo (Directeur de la Communication)",
    "channels": [
      "X (Twitter)",
      "Facebook",
      "LinkedIn",
      "WhatsApp Business / Direct"
    ],
    "sections": [
      "cover",
      "executive_summary",
      "platform_performance",
      "qualitative_insights",
      "sentiment_social_listening",
      "actionable_recos"
    ],
    "context": {
      "campaignName": "Communication de crise & Restauration Réseau",
      "marketingObjective": "Réputation / Veille & Réassurance",
      "businessQuestion": "Quelle est l’ampleur du bad buzz et la part de sentiment négatif sur X et Facebook ?",
      "hypotheses": "Le communiqué officiel diffusé à 11h30 a permis d’inverser la courbe de panique et de rassurer les entreprises B2B.",
      "keyMoments": "Incident majeur fibre optique à 08h15, reprise partielle à 14h00, rétablissement 100% à 20h00."
    },
    "data": {
      "summaryKpis": {
        "followers": 1748000,
        "followersGrowth": -120,
        "growthRate": -0.01,
        "reach": 2850000,
        "impressions": 4900000,
        "engagements": 168000,
        "engagementRate": 5.89,
        "videoViews": 410000,
        "videoCompletionRate": 28.4,
        "linkClicks": 52000,
        "adSpend": 0,
        "cpm": 0,
        "cpc": 0,
        "ctr": 0,
        "cpa": 0
      },
      "platformBreakdown": [
        {
          "channel": "X (Twitter)",
          "followers": 47000,
          "growth": 1200,
          "reach": 890000,
          "engagements": 74000,
          "rate": 8.31,
          "posts": 8
        },
        {
          "channel": "Facebook",
          "followers": 1600000,
          "growth": -1500,
          "reach": 1650000,
          "engagements": 81000,
          "rate": 4.9,
          "posts": 5
        },
        {
          "channel": "LinkedIn",
          "followers": 101000,
          "growth": 180,
          "reach": 310000,
          "engagements": 13000,
          "rate": 4.19,
          "posts": 3
        }
      ],
      "speeches": [
        {
          "id": "SP-201",
          "brand": "Orange Business",
          "name": "Point de situation technique n°1 : Incident Câble sous-marin",
          "channel": "X (Twitter)",
          "format": "Thread Info & Communiqué officiel",
          "objective": "Réassurance & Transparence",
          "date": "2026-08-11",
          "reach": 450000,
          "impressions": 920000,
          "engagements": 38000,
          "engagementRate": 8.44,
          "videoViews": 0,
          "clicks": 18000,
          "conversions": 0,
          "sentiment": "62% Négatif (atténué)",
          "isPaid": false,
          "spend": 0,
          "insight": "La rapidité de publication a évité la propagation de fake news sur un incident national généralisé."
        }
      ],
      "qualitativeInsights": {
        "drivers": [
          "Transparence technique saluée sur LinkedIn par les DSI et administrateurs réseaux.",
          "Mise en place d’un thread actualisé toutes les 2 heures sur X très appréciée."
        ],
        "friction": [
          "Tonalité fortement négative sur Facebook durant les 4 premières heures (manque de connectivité marchande)."
        ],
        "learnings": [
          "Les clients pardonnent l’aléa technique si l’information sur l’heure estimée de rétablissement est fournie."
        ]
      },
      "actionableRecos": [
        "Diffuser un message de remerciement et une compensation symbolique data aux abonnés impactés.",
        "Envoyer une note de synthèse personnalisée à tous les comptes VIP Orange Business."
      ]
    },
    "comments": [
      {
        "id": "c1",
        "author": "Arnaud Kamdem",
        "role": "Comms Lead",
        "date": "2026-08-12 07:18",
        "text": "Urgence absolue : document attendu pour la réunion du comité directeur à 16h30."
      },
      {
        "id": "c2",
        "author": "Steve BESSOUBE",
        "role": "Digital Analyst",
        "date": "2026-08-12 11:30",
        "text": "Traitement en cours, social listening X et Facebook consolidé."
      }
    ],
    "workflowHistory": [
      {
        "step": "submitted",
        "label": "Demande urgente soumise",
        "date": "2026-08-12 07:15",
        "author": "Arnaud Kamdem"
      },
      {
        "step": "qualified",
        "label": "Qualifiée en urgence",
        "date": "2026-08-12 07:45",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "in_production",
        "label": "Production accélérée",
        "date": "2026-08-12 08:00",
        "author": "Steve BESSOUBE"
      }
    ],
    "auditLog": [
      {
        "action": "CREATION",
        "author": "Arnaud Kamdem",
        "date": "2026-08-12 07:15:00"
      },
      {
        "action": "PRIORITY_SET_URGENT",
        "author": "Arnaud Kamdem",
        "date": "2026-08-12 07:15:00"
      }
    ]
  },
  {
    "id": "REP-2026-0820-PULSE",
    "title": "Rapport de Campagne — Ready Party & Good Deal (Vague Estivale 2026)",
    "type": "campagne",
    "client": "Orange Cameroun",
    "brands": [
      "Orange Pulse"
    ],
    "status": "internal_review",
    "version": "v1.0",
    "priority": "haute",
    "dueDate": "2026-08-22",
    "createdAt": "2026-08-18T10:00:00Z",
    "updatedAt": "2026-08-20T14:15:00Z",
    "period": {
      "start": "2026-08-01",
      "end": "2026-08-18",
      "label": "Activation Ready Party (1er au 18 Août 2026)",
      "comparisonType": "periode_precedente"
    },
    "requester": {
      "name": "Carole Ndom",
      "role": "Brand Specialist Pulse",
      "email": "carole.ndom@orange.cm"
    },
    "assignee": {
      "name": "Steve BESSOUBE",
      "role": "Digital Analyst"
    },
    "clientContact": "Christian Ewane (Marketing Lead Pulse)",
    "channels": [
      "TikTok",
      "Instagram",
      "Facebook",
      "YouTube",
      "Site Web / Landing Page"
    ],
    "sections": [
      "cover",
      "executive_summary",
      "platform_performance",
      "speeches_analysis",
      "qualitative_insights",
      "format_analysis",
      "best_posts",
      "paid_media_roi",
      "actionable_recos"
    ],
    "context": {
      "campaignName": "Ready Party — Gaming, Musique & Good Deal Jeunes",
      "marketingObjective": "Engagement & Téléchargement Application Maxit Pulse",
      "businessQuestion": "Comment l’événementiel physique couplé aux lives TikTok et Reels a boosté l’engagement des 15-24 ans ?",
      "hypotheses": "Le challenge de danse TikTok génère plus de 2 millions de vues organiques.",
      "keyMoments": "Concert Ready Party à Douala Bercy le 14 août avec retransmission live."
    },
    "data": {
      "summaryKpis": {
        "followers": 485000,
        "followersGrowth": 28600,
        "growthRate": 6.27,
        "reach": 4120000,
        "impressions": 8900000,
        "engagements": 385000,
        "engagementRate": 9.34,
        "videoViews": 2450000,
        "videoCompletionRate": 46.8,
        "linkClicks": 58000,
        "adSpend": 3400000,
        "cpm": 382,
        "cpc": 58,
        "ctr": 3.48,
        "cpa": 195
      },
      "speeches": [
        {
          "id": "SP-301",
          "brand": "Orange Pulse",
          "name": "Live Streaming Ready Party Douala",
          "channel": "TikTok",
          "format": "Live Interactif & Duos",
          "objective": "Engagement & Branding",
          "date": "2026-08-14",
          "reach": 820000,
          "impressions": 1950000,
          "engagements": 145000,
          "engagementRate": 11.2,
          "videoViews": 780000,
          "clicks": 22000,
          "conversions": 4200,
          "sentiment": "96% Positif",
          "isPaid": true,
          "spend": 800000,
          "insight": "Pic d’audience à 34 000 spectateurs simultanés durant le set DJ."
        }
      ],
      "bestPosts": [
        {
          "id": "BP-PULSE-01",
          "channel": "TikTok",
          "title": "Ambiance au Ready Party : qui a remporté le duel de breakdance ? 🔥",
          "format": "Vidéo Reel 18s",
          "date": "15 Août 2026",
          "reach": "680 K",
          "engagements": "72 K",
          "rate": "10.58%",
          "url": "https://tiktok.com/@orangepulse",
          "successFactor": "Montage dynamique avec transitions rythmées et son exclusif Pulse."
        }
      ],
      "qualitativeInsights": {
        "drivers": [
          "Format événementiel retransmis en direct sur TikTok : record absolu d’engagement de l’année pour Orange Pulse.",
          "Coût par acquisition d’un utilisateur actif Maxit Pulse divisé par 2 (195 FCFA vs benchmark 400 FCFA)."
        ],
        "friction": [],
        "learnings": [
          "Le public jeune réclame la duplication du format dans d’autres villes (Yaoundé, Bafoussam)."
        ]
      },
      "actionableRecos": [
        "Planifier la Vague 2 du Ready Party à Yaoundé pour la rentrée de septembre.",
        "Monétiser l’engouement avec un bundle data spécial étudiants."
      ]
    },
    "comments": [
      {
        "id": "c1",
        "author": "Carole Ndom",
        "role": "Brand Lead",
        "date": "2026-08-18 10:05",
        "text": "Merci de bien détailler le ROI des créateurs de contenu invités."
      },
      {
        "id": "c2",
        "author": "Steve BESSOUBE",
        "role": "Digital Analyst",
        "date": "2026-08-20 14:15",
        "text": "Rapport prêt et finalisé. Soumis au reviewer interne pour validation."
      }
    ],
    "workflowHistory": [
      {
        "step": "submitted",
        "label": "Demande créée",
        "date": "2026-08-18 10:00",
        "author": "Carole Ndom"
      },
      {
        "step": "qualified",
        "label": "Périmètre validé",
        "date": "2026-08-18 11:00",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "in_production",
        "label": "Analyse des KPI de campagne",
        "date": "2026-08-19 09:00",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "internal_review",
        "label": "En revue interne McCann",
        "date": "2026-08-20 14:15",
        "author": "Steve BESSOUBE"
      }
    ],
    "auditLog": [
      {
        "action": "CREATION",
        "author": "Carole Ndom",
        "date": "2026-08-18 10:00:00"
      },
      {
        "action": "SUBMIT_INTERNAL_REVIEW",
        "author": "Steve BESSOUBE",
        "date": "2026-08-20 14:15:00"
      }
    ]
  },
  {
    "id": "REP-2026-0815-BENCH",
    "title": "Rapport de Benchmark Concurrentiel — Télécom & FinTech S32-S33",
    "type": "benchmark",
    "client": "Orange Cameroun",
    "brands": [
      "Orange TELCO",
      "Orange Money (OM)"
    ],
    "status": "delivered",
    "version": "v1.0",
    "priority": "normale",
    "dueDate": "2026-08-17",
    "createdAt": "2026-08-10T14:00:00Z",
    "updatedAt": "2026-08-16T17:00:00Z",
    "period": {
      "start": "2026-08-01",
      "end": "2026-08-15",
      "label": "Quinzaine du 1er au 15 Août 2026",
      "comparisonType": "periode_precedente"
    },
    "requester": {
      "name": "Patrick Tuete",
      "role": "Head of Digital Marketing",
      "email": "patrick.tuete@orange.cm"
    },
    "assignee": {
      "name": "Steve BESSOUBE",
      "role": "Digital Analyst"
    },
    "clientContact": "Patrick Tuete",
    "channels": [
      "Facebook",
      "Instagram",
      "TikTok",
      "LinkedIn",
      "YouTube",
      "X (Twitter)"
    ],
    "sections": [
      "cover",
      "executive_summary",
      "competitive_benchmark",
      "qualitative_insights",
      "sentiment_social_listening",
      "actionable_recos",
      "raw_data_annexes"
    ],
    "context": {
      "campaignName": "Veille Concurrentielle & Parts de Voix Quinzaine",
      "marketingObjective": "Surveillance de la concurrence & Parts de voix",
      "businessQuestion": "Quelles sont les offensives tarifaires et activations de MTN Cameroun et Camtel en cette période de rentrée ?",
      "hypotheses": "MTN mise fortement sur les offres voix illimitées tandis que Camtel pousse son offre Blue Home.",
      "keyMoments": "Lancement de la campagne rentrée MTN Wan'De."
    },
    "data": {
      "summaryKpis": {
        "followers": 4300000,
        "followersGrowth": 52000,
        "growthRate": 1.22,
        "reach": 9200000,
        "impressions": 18500000,
        "engagements": 760000,
        "engagementRate": 8.26,
        "videoViews": 4100000,
        "videoCompletionRate": 42.1,
        "linkClicks": 145000,
        "adSpend": 0,
        "cpm": 0,
        "cpc": 0,
        "ctr": 0,
        "cpa": 0
      },
      "benchmark": {
        "competitors": [
          {
            "name": "Orange Cameroun (Groupe)",
            "shareOfVoice": "46.2%",
            "interactions": "760 K",
            "posts": 98,
            "sentimentPositive": "83%"
          },
          {
            "name": "MTN Cameroun (Groupe)",
            "shareOfVoice": "39.5%",
            "interactions": "580 K",
            "posts": 84,
            "sentimentPositive": "77%"
          },
          {
            "name": "Blue by Camtel",
            "shareOfVoice": "14.3%",
            "interactions": "190 K",
            "posts": 42,
            "sentimentPositive": "73%"
          }
        ]
      },
      "qualitativeInsights": {
        "drivers": [
          "Orange conserve une avance confortable de +6.7 points de part de voix sur MTN sur les réseaux sociaux.",
          "La campagne Good Deal Orange compense efficacement la pression publicitaire agressive de MTN Wan'De."
        ],
        "friction": [
          "Blue by Camtel progresse rapidement sur le segment internet fixe / fibre résidentielle avec un discours prix très agressif."
        ],
        "learnings": [
          "Maintenir une présence quotidienne en vidéo pour contrer la stratégie carrousel de MTN."
        ]
      },
      "actionableRecos": [
        "Préparer une riposte sur les forfaits mixtes Data + Voix pour fin août.",
        "Renforcer le sponsoring des événements e-sport pour verrouiller le territoire gaming face à MTN."
      ]
    },
    "comments": [
      {
        "id": "c1",
        "author": "Patrick Tuete",
        "role": "Client Lead",
        "date": "2026-08-16 16:50",
        "text": "Rapport très instructif, partagé avec la direction générale."
      }
    ],
    "workflowHistory": [
      {
        "step": "submitted",
        "label": "Demande initiée",
        "date": "2026-08-10 14:00",
        "author": "Patrick Tuete"
      },
      {
        "step": "qualified",
        "label": "Périmètre validé",
        "date": "2026-08-11 09:00",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "in_production",
        "label": "Collecte & Analyse benchmark",
        "date": "2026-08-12 10:00",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "internal_review",
        "label": "Revue interne McCann",
        "date": "2026-08-15 15:00",
        "author": "Steve BESSOUBE"
      },
      {
        "step": "client_review",
        "label": "Partagé pour validation",
        "date": "2026-08-16 10:00",
        "author": "Victor F. AKOA"
      },
      {
        "step": "approved",
        "label": "Validé par le client",
        "date": "2026-08-16 16:50",
        "author": "Patrick Tuete"
      },
      {
        "step": "delivered",
        "label": "Livrable final archivé",
        "date": "2026-08-16 17:00",
        "author": "Steve BESSOUBE"
      }
    ],
    "auditLog": [
      {
        "action": "CREATION",
        "author": "Patrick Tuete",
        "date": "2026-08-10 14:00:00"
      },
      {
        "action": "DELIVERY",
        "author": "Steve BESSOUBE",
        "date": "2026-08-16 17:00:00"
      }
    ]
  },
  {
    "id": "REP-2026-0818-EXEC",
    "title": "Synthèse Exécutive Direction Générale — T2 & Rentrée Stratégique",
    "type": "executif",
    "client": "Orange Cameroun",
    "brands": [
      "Orange TELCO",
      "Orange Money (OM)",
      "Orange Business"
    ],
    "status": "qualified",
    "version": "v1.0",
    "priority": "haute",
    "dueDate": "2026-08-25",
    "createdAt": "2026-08-18T16:00:00Z",
    "updatedAt": "2026-08-18T16:30:00Z",
    "period": {
      "start": "2026-04-01",
      "end": "2026-06-30",
      "label": "Trimestre T2 & Perspectives Q3 2026",
      "comparisonType": "meme_periode_annee_precedente"
    },
    "requester": {
      "name": "Patrick Tuete",
      "role": "Head of Digital Marketing",
      "email": "patrick.tuete@orange.cm"
    },
    "assignee": {
      "name": "Steve BESSOUBE",
      "role": "Digital Analyst"
    },
    "clientContact": "Comité de Direction Orange",
    "channels": [
      "Tous les canaux"
    ],
    "sections": [
      "cover",
      "executive_summary",
      "qualitative_insights",
      "competitive_benchmark",
      "actionable_recos"
    ],
    "context": {
      "campaignName": "Gouvernance & Bilan Digital T2",
      "marketingObjective": "Synthèse stratégique & Arbitrages Budgétaires Q3/Q4",
      "businessQuestion": "Quels ont été les retours sur investissements digitaux au T2 et quelles sont les priorités d’allocations médias pour le S2 ?",
      "hypotheses": "La réallocation de 30% du budget affichage vers TikTok et Meta Reels a amélioré le ROI de 24%.",
      "keyMoments": "Conseil d’administration et présentation du plan stratégique annuel fin août."
    },
    "data": {
      "summaryKpis": {
        "followers": 4300000,
        "followersGrowth": 142000,
        "growthRate": 3.42,
        "reach": 18500000,
        "impressions": 42000000,
        "engagements": 1950000,
        "engagementRate": 7.15,
        "videoViews": 12500000,
        "videoCompletionRate": 44.5,
        "linkClicks": 420000,
        "adSpend": 24500000,
        "cpm": 420,
        "cpc": 58,
        "ctr": 3.12,
        "cpa": 285
      },
      "qualitativeInsights": {
        "drivers": [
          "Croissance continue du parc d’abonnés digitaux (+142 000 au T2).",
          "Maturité croissante des audiences B2B sur LinkedIn avec un taux d’engagement record de 5.2%."
        ],
        "friction": [
          "Besoins d’optimisation continue du tracking applicatif iOS face aux restrictions de confidentialité."
        ],
        "learnings": [
          "L’écosystème Maxit représente désormais 42% du total des clics digitaux sortants."
        ]
      },
      "actionableRecos": [
        "Augmenter l’allocation budgétaire sur TikTok de 15% pour anticiper les activations jeunes de fin d’année.",
        "Industrialiser les formats de vidéo snack (moins de 20s) pour toutes les Business Units."
      ]
    },
    "comments": [
      {
        "id": "c1",
        "author": "Patrick Tuete",
        "role": "Client Lead",
        "date": "2026-08-18 16:30",
        "text": "Planning de production calé pour finalisation le 23 août."
      }
    ],
    "workflowHistory": [
      {
        "step": "submitted",
        "label": "Demande initiée",
        "date": "2026-08-18 16:00",
        "author": "Patrick Tuete"
      },
      {
        "step": "qualified",
        "label": "Demande qualifiée & assignée",
        "date": "2026-08-18 16:30",
        "author": "Steve BESSOUBE"
      }
    ],
    "auditLog": [
      {
        "action": "CREATION",
        "author": "Patrick Tuete",
        "date": "2026-08-18 16:00:00"
      },
      {
        "action": "QUALIFICATION",
        "author": "Steve BESSOUBE",
        "date": "2026-08-18 16:30:00"
      }
    ]
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
