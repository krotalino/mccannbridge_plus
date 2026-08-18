// ============================================
// Growth Hacking Module — Mock Data
// McCann × Bridge
// ============================================

export const GROWTH_KPIS = [
  { id: 'mrr', label: 'MRR', value: '284.5M FCFA', trend: '+12.3%', trendUp: true, icon: '💰' },
  { id: 'cac', label: 'CAC Moyen', value: '18 200 FCFA', trend: '-8.1%', trendUp: true, icon: '🎯' },
  { id: 'ltv', label: 'LTV / CAC', value: '4.2x', trend: '+0.6', trendUp: true, icon: '📈' },
  { id: 'churn', label: 'Churn Rate', value: '3.8%', trend: '+0.2%', trendUp: false, icon: '🔄' },
  { id: 'activation', label: 'Activation Rate', value: '67%', trend: '+5.3%', trendUp: true, icon: '⚡' },
  { id: 'nps', label: 'NPS Score', value: '72', trend: '+4', trendUp: true, icon: '⭐' },
];

export const GROWTH_EXPERIMENTS = [
  {
    id: 'exp-001',
    name: 'CTA "Essai Gratuit 7j" vs "Découvrir Maintenant"',
    hypothesis: 'Un CTA axé sur l\'essai gratuit augmentera le taux de conversion de la landing page de 15%.',
    status: 'running',
    stage: 'Acquisition',
    priority: 'high',
    scoreICE: { impact: 8, confidence: 7, ease: 9, total: 72 },
    metric: 'Taux de conversion LP',
    baseline: '3.2%',
    target: '3.7%',
    current: '3.9%',
    variants: [
      { name: 'Contrôle', traffic: 50, conversion: 3.2, visitors: 12400 },
      { name: 'Variant A', traffic: 50, conversion: 3.9, visitors: 12380 },
    ],
    significance: 94.2,
    startDate: '2026-05-01',
    endDate: '2026-05-21',
    daysLeft: 5,
    owner: 'Steve B.',
    tags: ['landing-page', 'CTA', 'acquisition'],
  },
  {
    id: 'exp-002',
    name: 'Onboarding gamifié vs classique',
    hypothesis: 'Un onboarding gamifié avec barre de progression augmentera le taux d\'activation de 20%.',
    status: 'running',
    stage: 'Activation',
    priority: 'high',
    scoreICE: { impact: 9, confidence: 6, ease: 5, total: 54 },
    metric: 'Taux d\'activation J+7',
    baseline: '42%',
    target: '50%',
    current: '51.3%',
    variants: [
      { name: 'Contrôle', traffic: 50, conversion: 42.0, visitors: 3200 },
      { name: 'Gamifié', traffic: 50, conversion: 51.3, visitors: 3180 },
    ],
    significance: 97.8,
    startDate: '2026-04-25',
    endDate: '2026-05-18',
    daysLeft: 2,
    owner: 'Marie K.',
    tags: ['onboarding', 'gamification', 'activation'],
  },
  {
    id: 'exp-003',
    name: 'Email de rétention J+30 personnalisé',
    hypothesis: 'Un email personnalisé avec usage réel réduira le churn de 10% sur la cohorte 30 jours.',
    status: 'paused',
    stage: 'Rétention',
    priority: 'medium',
    scoreICE: { impact: 7, confidence: 5, ease: 8, total: 56 },
    metric: 'Churn rate M+1',
    baseline: '8.2%',
    target: '7.4%',
    current: '7.9%',
    variants: [
      { name: 'Contrôle', traffic: 50, conversion: 8.2, visitors: 5400 },
      { name: 'Personnalisé', traffic: 50, conversion: 7.9, visitors: 5380 },
    ],
    significance: 62.1,
    startDate: '2026-04-15',
    endDate: '2026-05-30',
    daysLeft: 14,
    owner: 'Paul N.',
    tags: ['email', 'rétention', 'personnalisation'],
  },
  {
    id: 'exp-004',
    name: 'Pricing page — mise en avant du plan annuel',
    hypothesis: 'Mettre le plan annuel en premier augmentera les souscriptions annuelles de 25%.',
    status: 'completed',
    stage: 'Revenu',
    priority: 'high',
    scoreICE: { impact: 9, confidence: 8, ease: 9, total: 81 },
    metric: 'Souscriptions annuelles',
    baseline: '28%',
    target: '35%',
    current: '38.4%',
    variants: [
      { name: 'Contrôle', traffic: 50, conversion: 28.0, visitors: 8900 },
      { name: 'Annuel first', traffic: 50, conversion: 38.4, visitors: 8920 },
    ],
    significance: 99.1,
    result: 'winner',
    startDate: '2026-03-10',
    endDate: '2026-04-10',
    daysLeft: 0,
    owner: 'Steve B.',
    tags: ['pricing', 'revenu', 'conversion'],
    learning: 'L\'ancrage visuel sur le plan annuel avec économies affichées en % génère un uplift significatif (+37%). Déployer sur tous les marchés.',
  },
  {
    id: 'exp-005',
    name: 'Referral — récompense double face',
    hypothesis: 'Un programme de referral avec récompense parrain + filleul générera 2x plus de parrainages.',
    status: 'completed',
    stage: 'Referral',
    priority: 'medium',
    scoreICE: { impact: 7, confidence: 6, ease: 7, total: 49 },
    metric: 'Taux de referral actif',
    baseline: '4.1%',
    target: '8.2%',
    current: '6.8%',
    variants: [
      { name: 'Parrain seul', traffic: 50, conversion: 4.1, visitors: 6200 },
      { name: 'Double face', traffic: 50, conversion: 6.8, visitors: 6180 },
    ],
    significance: 96.5,
    result: 'partial',
    startDate: '2026-03-20',
    endDate: '2026-04-20',
    daysLeft: 0,
    owner: 'Marie K.',
    tags: ['referral', 'parrainage', 'viral'],
    learning: 'Amélioration de +66% vs objectif +100%. Le programme double face fonctionne mais la mécanique virale reste limitée par le UX du partage.',
  },
];

export const GROWTH_IDEAS = [
  { id: 'idea-001', title: 'Push notification géolocalisée Douala', stage: 'Acquisition', author: 'Steve B.', date: '2026-05-14', scoreICE: { impact: 8, confidence: 6, ease: 7, total: 56 }, status: 'submitted', votes: 5 },
  { id: 'idea-002', title: 'Réduire les étapes du checkout de 5 à 3', stage: 'Revenu', author: 'Marie K.', date: '2026-05-13', scoreICE: { impact: 9, confidence: 8, ease: 4, total: 48 }, status: 'approved', votes: 8 },
  { id: 'idea-003', title: 'Gamification badge "client fidèle" après 6 mois', stage: 'Rétention', author: 'Paul N.', date: '2026-05-12', scoreICE: { impact: 5, confidence: 4, ease: 9, total: 45 }, status: 'submitted', votes: 3 },
  { id: 'idea-004', title: 'A/B test sur les visuels produit (lifestyle vs packshot)', stage: 'Activation', author: 'Steve B.', date: '2026-05-10', scoreICE: { impact: 6, confidence: 7, ease: 8, total: 56 }, status: 'in_test', votes: 6 },
  { id: 'idea-005', title: 'Widget NPS in-app après activation', stage: 'Referral', author: 'Marie K.', date: '2026-05-09', scoreICE: { impact: 7, confidence: 5, ease: 8, total: 56 }, status: 'submitted', votes: 4 },
  { id: 'idea-006', title: 'Email win-back J+60 avec offre exclusive', stage: 'Rétention', author: 'Paul N.', date: '2026-05-08', scoreICE: { impact: 8, confidence: 6, ease: 9, total: 72 }, status: 'approved', votes: 7 },
  { id: 'idea-007', title: 'Simplifier la page pricing mobile', stage: 'Revenu', author: 'Steve B.', date: '2026-05-06', scoreICE: { impact: 9, confidence: 7, ease: 6, total: 63 }, status: 'submitted', votes: 9 },
];

export const GROWTH_FUNNEL = {
  stages: [
    { name: 'Visiteurs', value: 245000, rate: 100, color: '#2980B9' },
    { name: 'Inscrits', value: 18200, rate: 7.4, color: '#8E44AD' },
    { name: 'Activés', value: 12194, rate: 67, color: '#FF7900' },
    { name: 'Engagés (J+7)', value: 8536, rate: 70, color: '#F39C12' },
    { name: 'Payants', value: 3414, rate: 40, color: '#27AE60' },
    { name: 'Référents', value: 478, rate: 14, color: '#E74C3C' },
  ],
  frictions: [
    { from: 'Visiteurs', to: 'Inscrits', dropRate: 92.6, severity: 'high', insight: 'Le formulaire d\'inscription comporte 7 champs. Benchmark: 3-4 champs.' },
    { from: 'Activés', to: 'Engagés (J+7)', dropRate: 30, severity: 'medium', insight: 'Manque de trigger email J+3 pour réengager les utilisateurs dormants.' },
    { from: 'Engagés (J+7)', to: 'Payants', dropRate: 60, severity: 'high', insight: 'Le paywall arrive trop tôt. Tester un free tier plus généreux.' },
  ],
  cohorts: [
    { period: 'Jan 2026', m0: 100, m1: 72, m2: 58, m3: 48, m4: 42 },
    { period: 'Fév 2026', m0: 100, m1: 74, m2: 61, m3: 52, m4: null },
    { period: 'Mar 2026', m0: 100, m1: 78, m2: 65, m3: null, m4: null },
    { period: 'Avr 2026', m0: 100, m1: 76, m2: null, m3: null, m4: null },
    { period: 'Mai 2026', m0: 100, m1: null, m2: null, m3: null, m4: null },
  ],
};

export const GROWTH_ALERTS = [
  { id: 'alert-001', type: 'critical', title: 'Churn spike détecté', message: 'Le churn rate a augmenté de 0.8% sur les 48 dernières heures sur le segment "nouveaux clients Yaoundé".', timestamp: '2026-05-16 09:15', metric: 'Churn Rate', threshold: '4%', current: '4.6%', acknowledged: false },
  { id: 'alert-002', type: 'warning', title: 'CAC en hausse sur Google Ads', message: 'Le CAC campagne Google Ads dépasse le seuil de 22 000 FCFA depuis 3 jours.', timestamp: '2026-05-15 14:30', metric: 'CAC Google Ads', threshold: '22 000 FCFA', current: '24 800 FCFA', acknowledged: false },
  { id: 'alert-003', type: 'opportunity', title: 'Conversion organique en hausse', message: 'Le taux de conversion organique a augmenté de 18% cette semaine. Investiguer les sources.', timestamp: '2026-05-15 10:00', metric: 'Conv. Organique', threshold: 'n/a', current: '+18%', acknowledged: true },
  { id: 'alert-004', type: 'info', title: 'Test "CTA Essai Gratuit" approche significativité', message: 'L\'expérience EXP-001 atteint 94.2% de significativité. Décision possible sous 48h.', timestamp: '2026-05-14 16:45', metric: 'Significativité', threshold: '95%', current: '94.2%', acknowledged: true },
  { id: 'alert-005', type: 'critical', title: 'Source analytics en retard', message: 'Google Analytics n\'a pas synchronisé depuis 6h. SLA: 1h. Vérifier le connecteur.', timestamp: '2026-05-16 10:30', metric: 'Fraîcheur GA', threshold: '1h', current: '6h', acknowledged: false },
];

export const GROWTH_RECOMMENDATIONS = [
  { id: 'rec-001', type: 'action', priority: 'high', title: 'Arrêter la campagne Google Ads "Max Orange"', description: 'Le CAC dépasse 24 800 FCFA vs seuil 22 000 FCFA depuis 3 jours. ROI négatif estimé à -15%.', impact: 'Économie estimée: 1.2M FCFA/mois', source: 'Règle: CAC > seuil × 1.1 pendant 72h', stage: 'Acquisition' },
  { id: 'rec-002', type: 'test', priority: 'high', title: 'Lancer un test sur le formulaire inscription (3 champs vs 7)', description: 'Le drop-off visiteur→inscrit est de 92.6%. Le benchmark secteur est 85%. Réduire les frictions d\'inscription.', impact: 'Potentiel: +2 700 inscrits/mois', source: 'Analyse funnel automatique', stage: 'Acquisition' },
  { id: 'rec-003', type: 'action', priority: 'medium', title: 'Déployer le variant gagnant "Plan annuel first"', description: 'Test EXP-004 terminé avec 99.1% de significativité et +37% de souscriptions annuelles. Prêt pour déploiement.', impact: 'Revenu annuel: +18M FCFA estimé', source: 'Résultat expérience validée', stage: 'Revenu' },
  { id: 'rec-004', type: 'investigate', priority: 'medium', title: 'Investiguer le pic de churn Yaoundé', description: 'Churn anormal sur segment "nouveaux clients Yaoundé" (+0.8% en 48h). Vérifier incidents réseau ou satisfaction.', impact: 'Risque: perte de 120 clients/mois', source: 'Détection d\'anomalie', stage: 'Rétention' },
  { id: 'rec-005', type: 'test', priority: 'low', title: 'Tester un trigger email J+3 pour les dormants', description: 'Les utilisateurs activés mais non engagés à J+7 représentent 30% de drop. Un nudge email pourrait réduire cette friction.', impact: 'Potentiel: +1 200 utilisateurs engagés/mois', source: 'Analyse de cohorte', stage: 'Activation' },
];

export const GROWTH_WORKFLOWS = [
  { id: 'wf-001', name: 'Suspension auto campagne CAC élevé', trigger: 'CAC > seuil × 1.1 pendant 72h', actions: ['Notification Growth Lead', 'Pause campagne', 'Rapport automatique'], status: 'active', executions: 3, lastRun: '2026-05-15 14:30' },
  { id: 'wf-002', name: 'Alerte churn spike', trigger: 'Churn rate > moyenne + 2σ sur 48h', actions: ['Alerte Slack', 'Email Growth Team', 'Création ticket investigation'], status: 'active', executions: 1, lastRun: '2026-05-16 09:15' },
  { id: 'wf-003', name: 'Post-mortem automatique', trigger: 'Expérience terminée ou arrêtée', actions: ['Génération rapport', 'Archivage résultats', 'Notification équipe'], status: 'active', executions: 7, lastRun: '2026-05-10 11:00' },
  { id: 'wf-004', name: 'Relance email rétention J+30', trigger: 'Utilisateur inactif depuis 30 jours', actions: ['Email personnalisé', 'Push notification J+33', 'SMS J+37 si non réengagé'], status: 'paused', executions: 45, lastRun: '2026-05-12 08:00' },
  { id: 'wf-005', name: 'Déploiement automatique variant gagnant', trigger: 'Test significatif > 95% ET approuvé', actions: ['Notification responsable', 'Feature flag activation', 'Rapport déploiement'], status: 'draft', executions: 0, lastRun: null },
];

export const GROWTH_KNOWLEDGE = [
  {
    id: 'kb-001', title: 'CTA "Essai Gratuit" surperforme sur mobile',
    experiment: 'EXP-001', stage: 'Acquisition', date: '2026-05-16',
    result: 'winner', uplift: '+21.9%',
    insight: 'Le CTA "Essai Gratuit 7j" génère 21.9% de conversions supplémentaires vs "Découvrir Maintenant". L\'effet est plus fort sur mobile (+28%) que sur desktop (+14%).',
    decision: 'Déployer sur tous les touchpoints mobile. Tester un variant avec durée variable (3j vs 7j vs 14j).',
    tags: ['CTA', 'mobile', 'acquisition'],
  },
  {
    id: 'kb-002', title: 'Plan annuel en premier = +37% souscriptions',
    experiment: 'EXP-004', stage: 'Revenu', date: '2026-04-10',
    result: 'winner', uplift: '+37%',
    insight: 'L\'effet d\'ancrage visuel sur le plan annuel avec économies en % génère une préférence forte. Les clients qui souscrivent annuellement ont un churn 3x plus bas.',
    decision: 'Déployer sur tous les marchés. Ajouter un bandeau "Meilleur rapport qualité-prix" pour renforcer l\'ancrage.',
    tags: ['pricing', 'ancrage', 'revenu'],
  },
  {
    id: 'kb-003', title: 'Onboarding gamifié = meilleure activation',
    experiment: 'EXP-002', stage: 'Activation', date: '2026-05-18',
    result: 'winner', uplift: '+22.1%',
    insight: 'La barre de progression et les badges d\'accomplissement augmentent le taux d\'activation de 42% à 51.3%. Impact le plus fort chez les 18-25 ans.',
    decision: 'Déployer et itérer avec des récompenses tangibles (crédits, bonus data).',
    tags: ['gamification', 'onboarding', 'jeunes'],
  },
  {
    id: 'kb-004', title: 'Referral double-face: amélioration partielle',
    experiment: 'EXP-005', stage: 'Referral', date: '2026-04-20',
    result: 'partial', uplift: '+66%',
    insight: 'Le programme double-face (parrain+filleul) améliore de 66% le taux de referral, mais n\'atteint pas le 2x visé. Le point de friction est le mécanisme de partage (trop de clics).',
    decision: 'Garder le programme double-face mais simplifier le UX de partage. Tester un lien direct WhatsApp.',
    tags: ['referral', 'whatsapp', 'UX'],
  },
];

export const GROWTH_CONNECTORS = [
  { id: 'conn-001', name: 'Google Analytics 4', type: 'Analytics', status: 'error', lastSync: '2026-05-16 04:30', freshness: '6h de retard', icon: '📊' },
  { id: 'conn-002', name: 'HubSpot CRM', type: 'CRM', status: 'active', lastSync: '2026-05-16 10:00', freshness: 'À jour', icon: '🔗' },
  { id: 'conn-003', name: 'Google Ads', type: 'Ads', status: 'active', lastSync: '2026-05-16 09:45', freshness: 'À jour', icon: '📢' },
  { id: 'conn-004', name: 'Meta Ads', type: 'Ads', status: 'active', lastSync: '2026-05-16 09:50', freshness: 'À jour', icon: '📱' },
  { id: 'conn-005', name: 'Stripe', type: 'Revenue', status: 'active', lastSync: '2026-05-16 10:10', freshness: 'À jour', icon: '💳' },
  { id: 'conn-006', name: 'Mixpanel', type: 'Analytics', status: 'warning', lastSync: '2026-05-16 08:15', freshness: '2h de retard', icon: '📈' },
  { id: 'conn-007', name: 'Optimizely', type: 'Testing', status: 'active', lastSync: '2026-05-16 10:05', freshness: 'À jour', icon: '🧪' },
  { id: 'conn-008', name: 'Mailchimp', type: 'Email', status: 'active', lastSync: '2026-05-16 09:30', freshness: 'À jour', icon: '✉️' },
];

export const GROWTH_NEXT_ACTIONS = [
  { id: 'act-001', title: 'Décider EXP-001 (CTA Essai Gratuit)', urgency: 'high', dueDate: '2026-05-18', owner: 'Steve B.', type: 'decision' },
  { id: 'act-002', title: 'Déployer variant gagnant EXP-004 (Pricing)', urgency: 'high', dueDate: '2026-05-17', owner: 'Marie K.', type: 'deploy' },
  { id: 'act-003', title: 'Investiguer churn Yaoundé', urgency: 'critical', dueDate: '2026-05-16', owner: 'Paul N.', type: 'investigate' },
  { id: 'act-004', title: 'Réparer connecteur Google Analytics', urgency: 'critical', dueDate: '2026-05-16', owner: 'Tech Team', type: 'fix' },
  { id: 'act-005', title: 'Planifier test formulaire inscription simplifié', urgency: 'medium', dueDate: '2026-05-22', owner: 'Steve B.', type: 'plan' },
];

export const GROWTH_AARRR_STAGES = [
  { id: 'acquisition', label: 'Acquisition', icon: '🎯', color: '#2980B9' },
  { id: 'activation', label: 'Activation', icon: '⚡', color: '#FF7900' },
  { id: 'retention', label: 'Rétention', icon: '🔄', color: '#8E44AD' },
  { id: 'revenue', label: 'Revenu', icon: '💰', color: '#27AE60' },
  { id: 'referral', label: 'Referral', icon: '📣', color: '#E74C3C' },
];

export const GROWTH_AUDIT_LOG = [
  { id: 'log-001', action: 'Expérience créée', object: 'EXP-001', user: 'Steve B.', date: '2026-05-01 09:00', detail: 'Test CTA "Essai Gratuit 7j"' },
  { id: 'log-002', action: 'Expérience lancée', object: 'EXP-001', user: 'Steve B.', date: '2026-05-01 14:00', detail: 'Split 50/50 activé' },
  { id: 'log-003', action: 'Alerte déclenchée', object: 'ALERT-005', user: 'Système', date: '2026-05-16 10:30', detail: 'GA non synchronisé > 6h' },
  { id: 'log-004', action: 'Workflow exécuté', object: 'WF-002', user: 'Système', date: '2026-05-16 09:15', detail: 'Churn spike → alerte envoyée' },
  { id: 'log-005', action: 'Expérience terminée', object: 'EXP-004', user: 'Steve B.', date: '2026-04-10 17:00', detail: 'Variant B gagnant — 99.1% significativité' },
  { id: 'log-006', action: 'Recommandation créée', object: 'REC-003', user: 'Système', date: '2026-04-10 17:05', detail: 'Déployer variant gagnant pricing' },
  { id: 'log-007', action: 'Permission modifiée', object: 'RBAC', user: 'Admin', date: '2026-04-08 11:00', detail: 'Paul N. → rôle "Growth Analyst"' },
  { id: 'log-008', action: 'Idée soumise', object: 'IDEA-007', user: 'Steve B.', date: '2026-05-06 10:30', detail: 'Simplifier la page pricing mobile' },
];
