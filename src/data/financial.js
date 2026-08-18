export const FINANCIAL_DATA = {
  year: 2026, quarter: 'Q2', client: 'Orange Cameroun',
  totalBudgetHT: 460000000, totalSpentHT: 407940226, commission: 32635218, tva: 85036234, totalTTC: 526782901, tauxConsommation: 88.7,

  // Cockpit KPIs
  cockpit: {
    budgetAlloue: 450000000,
    budgetRealise: 312450000,
    ecartPct: 18.2,
    ecartNote: 'Surconsommation poste Influence',
    tresorerieDisponible: 137550000,
    tresorerieNote: 'Liquidité OK — 30 jours',
    enAttenteValidation: 14,
    attenteDetail: '6 BC · 8 Factures',
    alertesActives: 3,
    alertesDetail: '1 critique · 2 warnings',
  },

  // Budget execution by campaign
  budgetExecution: {
    campagne: 'Campagne Mayi 2026',
    postes: [
      { name: 'Média Digital', budget: 80000000, reel: 72000000, prevision: 78000000 },
      { name: 'Influenceurs KOL', budget: 28000000, reel: 23500000, prevision: 30000000 },
      { name: 'Production vidéo', budget: 35000000, reel: 18000000, prevision: 32000000 },
      { name: 'Activations', budget: 20000000, reel: 8000000, prevision: 19000000 },
      { name: 'Community Mgmt', budget: 15000000, reel: 6500000, prevision: 14000000 },
      { name: 'Reporting', budget: 12000000, reel: 3200000, prevision: 11000000 },
    ],
    ecarts: [
      { type: 'warning', text: 'Poste « Influenceurs KOL » dépasse de 24 % — réallocation ou avenant recommandé.' },
      { type: 'info', text: 'Poste « Production vidéo » sous-consommé de 12 % — possible virement interne.' },
    ],
  },

  // Workflow steps
  workflow: {
    steps: [
      { num: 1, label: 'Cash', active: true },
      { num: 2, label: 'Réconcilier', active: true },
      { num: 3, label: 'Approuver', active: true },
      { num: 4, label: 'Allouer', active: false },
      { num: 5, label: 'Analyser', active: false },
      { num: 6, label: 'Reporter', active: false },
    ],
    currentStep: 3,
    counts: [
      { label: 'À réconcilier', count: 2, color: '#2980B9' },
      { label: 'En validation', count: 6, color: '#F39C12' },
      { label: 'Validé / À allouer', count: 8, color: '#27AE60' },
      { label: 'Rapport généré / Diffusé', count: 4, color: '#8E44AD' },
    ],
  },

  // Operations register
  operations: [
    { id: 1, type: 'Bon de Commande', reference: 'BC-2026-0442', client: 'Orange / Mayi Festival', montant: 28500000, date: '08/05/2026', statut: 'En validation', pieces: 'PDF', action: 'Approuver' },
    { id: 2, type: 'Facture Fournisseur', reference: 'FA-2026-0891', client: 'Orange / Digital Q2', montant: 12750000, date: '07/05/2026', statut: 'Validée', pieces: 'PDF · XML', action: 'Voir' },
    { id: 3, type: 'Reçu Paiement', reference: 'RC-2026-0156', client: 'MTN / Launch 5G', montant: 45000000, date: '06/05/2026', statut: 'Réconcilié', pieces: 'PDF · Swift', action: 'Voir' },
    { id: 4, type: 'Bon de Commande', reference: 'BC-2026-0443', client: 'Orange / Influence', montant: 8200000, date: '09/05/2026', statut: 'À réconcilier', pieces: '—', action: 'Réconcilier' },
    { id: 5, type: 'Facture Fournisseur', reference: 'FA-2026-0892', client: 'Orange / Production', montant: 5400000, date: '05/05/2026', statut: 'En validation', pieces: 'PDF', action: 'Approuver' },
    { id: 6, type: 'Bon de Commande', reference: 'BC-2026-0444', client: 'Orange / Community', montant: 3800000, date: '04/05/2026', statut: 'Validée', pieces: 'PDF', action: 'Voir' },
  ],

  // Alerts
  alerts: [
    { id: 1, severity: 'critical', title: 'Alerte Seuil 80 %', text: 'Poste « Influenceurs KOL » Mayi Festival atteint 83 % (23,5 M / 28 M). Avenant ou réallocation recommandée.', action: 'Réallouer', actionColor: '#E67E22' },
    { id: 2, severity: 'warning', title: 'Alerte Trésorerie', text: 'Projection à 14 jours : solde Orange Q2 inférieur à 20 M FCFA compte tenu des factures en pipeline.', action: 'Prévisionnel', actionColor: '#F39C12' },
    { id: 3, severity: 'info', title: 'Approbation Requise', text: 'Facture MTN Launch 5G excède le BC initial de 4,2 M. Justification obligatoire avant validation.', action: 'Approuver', actionColor: '#27AE60' },
  ],

  // Reporting
  reporting: {
    dernierRapport: {
      title: 'Dernier rapport mensuel',
      periode: 'Avril 2026 — Orange CMR (PDF, Excel)',
      diffuse: 'Diffusé le 03/05',
    },
    prevision: {
      title: 'Prévision de fin de campagne (IA / Planning)',
      probabilite: 72,
      note: 'au rythme actuel. Ajustement recommandé sur poste production.',
    },
  },

  // Treasury
  treasury: {
    soldeActuel: 137550000,
    entrees30j: 85000000,
    sorties30j: 62000000,
    projection30j: 160550000,
    facutresEnAttente: 8,
    montantEnAttente: 45200000,
    history: [
      { month: 'Jan', solde: 180000000 },
      { month: 'Fév', solde: 165000000 },
      { month: 'Mar', solde: 155000000 },
      { month: 'Avr', solde: 148000000 },
      { month: 'Mai', solde: 137550000 },
    ],
  },

  // Rapprochements
  rapprochements: [
    { id: 1, reference: 'BC-2026-0442', fournisseur: 'Studio Mayi', montantBC: 28500000, montantFacture: 28500000, ecart: 0, statut: 'Concordant', date: '08/05/2026' },
    { id: 2, reference: 'FA-2026-0891', fournisseur: 'Digital Agency Q2', montantBC: 13000000, montantFacture: 12750000, ecart: -250000, statut: 'Écart mineur', date: '07/05/2026' },
    { id: 3, reference: 'BC-2026-0443', fournisseur: 'Influence Corp', montantBC: 8200000, montantFacture: null, ecart: null, statut: 'En attente facture', date: '09/05/2026' },
    { id: 4, reference: 'FA-2026-0888', fournisseur: 'Prod House CMR', montantBC: 6800000, montantFacture: 7200000, ecart: 400000, statut: 'Écart critique', date: '03/05/2026' },
  ],

  // Budget vs Réel détaillé
  budgetVsReel: {
    categories: [
      { name: 'Média Digital', budget: 180000000, reel: 163000000, pct: 90.6, color: '#2980B9' },
      { name: 'Influenceurs', budget: 138000000, reel: 119000000, pct: 86.2, color: '#8E44AD' },
      { name: 'Production', budget: 80000000, reel: 62000000, pct: 77.5, color: '#E67E22' },
      { name: 'Activations', budget: 30000000, reel: 22000000, pct: 73.3, color: '#27AE60' },
      { name: 'Community Mgmt', budget: 15000000, reel: 11500000, pct: 76.7, color: '#E74C3C' },
      { name: 'Outils & Abonnements', budget: 7000000, reel: 5440000, pct: 77.7, color: '#F39C12' },
    ],
  },

  // Audit logs
  auditLogs: [
    { id: 1, date: '09/05/2026 14:32', user: 'Jean Philippe', action: 'Création BC', detail: 'BC-2026-0443 — Orange / Influence — 8 200 000 FCFA', level: 'info' },
    { id: 2, date: '08/05/2026 11:15', user: 'Marie Claire', action: 'Validation Facture', detail: 'FA-2026-0891 — Validée sans réserve', level: 'success' },
    { id: 3, date: '08/05/2026 09:45', user: 'Système IA', action: 'Alerte automatique', detail: 'Seuil 80% atteint — Influenceurs KOL Mayi Festival', level: 'warning' },
    { id: 4, date: '07/05/2026 16:20', user: 'Victor N.', action: 'Réconciliation', detail: 'RC-2026-0156 rapproché avec BC-2026-0438', level: 'info' },
    { id: 5, date: '06/05/2026 10:00', user: 'Jean Paul', action: 'Rejet Facture', detail: 'FA-2026-0887 — Montant excède BC de 15%', level: 'error' },
    { id: 6, date: '05/05/2026 14:45', user: 'Marie Claire', action: 'Export Rapport', detail: 'Rapport Avril 2026 — PDF + Excel généré', level: 'info' },
    { id: 7, date: '04/05/2026 09:30', user: 'Système', action: 'Import OCR', detail: '3 factures importées automatiquement', level: 'info' },
    { id: 8, date: '03/05/2026 17:00', user: 'Jean Philippe', action: 'Diffusion Rapport', detail: 'Rapport Avril diffusé au client Orange CMR', level: 'success' },
  ],

  categories: [
    { id: 'achats', name: "Achats d'espace", budget: 184000000, spent: 163183582, solde: 20816418, color: '#2980B9', months: [{ month: 'Jan', spent: 12500000 },{ month: 'Fev', spent: 14200000 },{ month: 'Mar', spent: 18700000 },{ month: 'Avr', spent: 16300000 },{ month: 'Mai', spent: 15800000 },{ month: 'Jun', spent: 14600000 },{ month: 'Jul', spent: 17200000 },{ month: 'Aou', spent: 13400000 },{ month: 'Sep', spent: 11800000 },{ month: 'Oct', spent: 10500000 },{ month: 'Nov', spent: 9600000 },{ month: 'Dec', spent: 8583582 }], subItems: [{ name: 'Sponsoring META (Facebook/Instagram)', spent: 98500000, devis: 245, status: 'en_cours' },{ name: 'Sponsoring X (Twitter)', spent: 12300000, devis: 18, status: 'en_cours' },{ name: 'Sponsoring TikTok', spent: 8900000, devis: 12, status: 'en_cours' },{ name: 'Google Ads / Display', spent: 28400000, devis: 35, status: 'en_cours' },{ name: 'Programmatique', spent: 15083582, devis: 8, status: 'en_cours' }] },
    { id: 'influenceurs', name: 'Influenceurs', budget: 138000000, spent: 119064000, solde: 18936000, color: '#8E44AD', months: [{ month: 'Jan', spent: 0 },{ month: 'Fev', spent: 0 },{ month: 'Mar', spent: 0 },{ month: 'Avr', spent: 75950000 },{ month: 'Mai', spent: 8800000 },{ month: 'Jun', spent: 1200000 },{ month: 'Jul', spent: 6500000 },{ month: 'Aou', spent: 4200000 },{ month: 'Sep', spent: 5800000 },{ month: 'Oct', spent: 6300000 },{ month: 'Nov', spent: 5414000 },{ month: 'Dec', spent: 4900000 }], subItems: [{ name: 'Ambassadeurs musique', spent: 69000000, devis: 3, status: 'facture' },{ name: 'Ambassadeurs jeunes', spent: 5850000, devis: 5, status: 'facture' },{ name: 'UGC Creators', spent: 8750000, devis: 12, status: 'en_cours' },{ name: 'Micro-influenceurs regionaux', spent: 18200000, devis: 22, status: 'en_cours' },{ name: 'Pulse Masters', spent: 7264000, devis: 8, status: 'facture' },{ name: 'Couvertures evenementielles', spent: 10000000, devis: 15, status: 'en_cours' }] },
    { id: 'animations', name: 'Animations Digitales/Productions', budget: 138000000, spent: 125692644, solde: 12307356, color: '#E67E22', months: [{ month: 'Jan', spent: 0 },{ month: 'Fev', spent: 97200 },{ month: 'Mar', spent: 5372223 },{ month: 'Avr', spent: 10703191 },{ month: 'Mai', spent: 4815000 },{ month: 'Jun', spent: 3968185 },{ month: 'Jul', spent: 12500000 },{ month: 'Aou', spent: 18200000 },{ month: 'Sep', spent: 22500000 },{ month: 'Oct', spent: 19800000 },{ month: 'Nov', spent: 15236845 },{ month: 'Dec', spent: 12500000 }], subItems: [{ name: 'Abonnements outils (Karma, Evento, LiveReacting)', spent: 488800, devis: 3, status: 'facture' },{ name: 'Gains participants jeux/concours', spent: 1071383, devis: 8, status: 'en_cours' },{ name: 'Couverture evenements (photo/video)', spent: 12542000, devis: 18, status: 'en_cours' },{ name: 'Production capsules video (Red Zone, etc.)', spent: 6350000, devis: 2, status: 'facture' },{ name: 'Achats materiel terrain', spent: 1673000, devis: 4, status: 'facture' },{ name: 'Riposte Gaming & Activations speciales', spent: 2622240, devis: 1, status: 'facture' },{ name: 'Insertions webzines', spent: 2000000, devis: 3, status: 'en_cours' },{ name: 'Autres productions & per diem', spent: 98945221, devis: 45, status: 'en_cours' }] },
  ],
  recentTransactions: [
    { date: '2026-03-20', description: 'Sponsoring META — Campagne Maxit Promo', amount: 328000, category: 'achats', demandeur: 'Jean Philippe', status: 'paye' },
    { date: '2026-03-18', description: 'Couverture photo DMC Digital Innovation Festival', amount: 600000, category: 'animations', demandeur: 'Jean Philippe', status: 'devis' },
    { date: '2026-03-15', description: 'Paiement UGC Challenge BREF', amount: 600000, category: 'influenceurs', demandeur: 'Jean Paul', status: 'paye' },
    { date: '2026-03-12', description: 'Sponsoring META — Facture 9180947765348696', amount: 91850, category: 'achats', demandeur: 'Jean Philippe', status: 'paye' },
    { date: '2026-03-10', description: 'Abonnement annuel Evento Motion Designer', amount: 100000, category: 'animations', demandeur: 'Felix', status: 'facture' },
    { date: '2026-03-08', description: 'Paiement ambassadeurs musique', amount: 69000000, category: 'influenceurs', demandeur: 'Jean Paul', status: 'paye' },
    { date: '2026-03-05', description: 'Production capsules Road Trip Red Zone', amount: 6350000, category: 'animations', demandeur: 'Victor', status: 'facture' },
    { date: '2026-03-01', description: 'Sponsoring META — Factures multiples mars', amount: 360777, category: 'achats', demandeur: 'Jean Philippe', status: 'paye' },
  ],

  // ─── Facturation Client ───
  facturation: {
    // KPI CA Facturé Client
    caFacture: 385000000,
    resteAFacturer: 65000000,
    caEncaisse: 310000000,
    enCoursEncaissement: 75000000,
    dso: 38, // Délai moyen de paiement en jours
    facutresImpayees: 2,

    // Pipeline stages
    pipelineStages: ['Devis', 'Avenant', 'Proforma', 'Facture Finale', 'Encaissement'],

    // Dossiers clients avec position dans le pipeline
    dossiers: [
      {
        id: 1, client: 'Orange / Mayi Festival', reference: 'DOS-2026-MF',
        devis: { montant: 45000000, statut: 'Validé', date: '15/03/2026', signe: true },
        avenant: { montant: 8000000, statut: 'Signé', date: '02/04/2026', signe: true },
        proforma: { montant: 63200000, statut: 'En attente validation client', date: '28/04/2026', tvaPct: 19.25, montantTTC: 75366000 },
        facture: null,
        encaissement: null,
        currentStage: 2, // 0-indexed: Proforma
      },
      {
        id: 2, client: 'Société Générale / Q2 Digital', reference: 'DOS-2026-SG',
        devis: { montant: 22000000, statut: 'Validé', date: '10/02/2026', signe: true },
        avenant: null,
        proforma: { montant: 22000000, statut: 'Validée', date: '01/03/2026', tvaPct: 19.25, montantTTC: 26235000 },
        facture: { reference: 'FC-2026-0088', montant: 26235000, date: '05/03/2026', echeance: '04/04/2026', statut: 'Impayée J+11' },
        encaissement: null,
        currentStage: 3, // Facture Finale émise mais impayée
      },
      {
        id: 3, client: 'Orange / Digital Q1', reference: 'DOS-2026-DQ1',
        devis: { montant: 68000000, statut: 'Validé', date: '05/01/2026', signe: true },
        avenant: { montant: 5000000, statut: 'Signé', date: '20/01/2026', signe: true },
        proforma: { montant: 87012500, statut: 'Validée', date: '25/01/2026', tvaPct: 19.25, montantTTC: 87012500 },
        facture: { reference: 'FC-2026-0045', montant: 87012500, date: '01/02/2026', echeance: '03/03/2026', statut: 'Payée' },
        encaissement: { montant: 87012500, date: '28/02/2026', reference: 'ENC-2026-0045', banque: 'SGBC' },
        currentStage: 4, // Encaissé
      },
      {
        id: 4, client: 'MTN / Launch 5G', reference: 'DOS-2026-MTN5G',
        devis: { montant: 120000000, statut: 'Validé', date: '12/03/2026', signe: true },
        avenant: { montant: 15000000, statut: 'En cours de signature', date: '05/05/2026', signe: false },
        proforma: null,
        facture: null,
        encaissement: null,
        currentStage: 1, // Avenant en cours
      },
      {
        id: 5, client: 'Orange / Influence Q2', reference: 'DOS-2026-INF',
        devis: { montant: 35000000, statut: 'En création', date: '08/05/2026', signe: false },
        avenant: null,
        proforma: null,
        facture: null,
        encaissement: null,
        currentStage: 0, // Devis
      },
    ],

    // Registre des factures client
    factures: [
      { id: 1, reference: 'FC-2026-0092', client: 'Orange / Mayi Festival', montantHT: 53000000, tva: 10202500, montantTTC: 63202500, dateEmission: '—', echeance: '—', statut: 'Proforma en attente', relance: null },
      { id: 2, reference: 'FC-2026-0088', client: 'Société Générale / Q2 Digital', montantHT: 22000000, tva: 4235000, montantTTC: 26235000, dateEmission: '05/03/2026', echeance: '04/04/2026', statut: 'Impayée', relance: 'J+5 envoyé · J+11 en cours' },
      { id: 3, reference: 'FC-2026-0045', client: 'Orange / Digital Q1', montantHT: 73000000, tva: 14052500, montantTTC: 87012500, dateEmission: '01/02/2026', echeance: '03/03/2026', statut: 'Encaissée', relance: null },
      { id: 4, reference: 'FC-2026-0039', client: 'Orange / Activations Dec', montantHT: 42000000, tva: 8085000, montantTTC: 50085000, dateEmission: '15/01/2026', echeance: '14/02/2026', statut: 'Encaissée', relance: null },
      { id: 5, reference: 'FC-2026-0095', client: 'MTN / Launch 5G', montantHT: 120000000, tva: 23100000, montantTTC: 143100000, dateEmission: '—', echeance: '—', statut: 'Devis en cours', relance: null },
    ],

    // Relances automatisées
    relances: [
      { id: 1, facture: 'FC-2026-0088', client: 'Société Générale', type: 'J-5', date: '30/03/2026', canal: 'Email', statut: 'Envoyé', reponse: 'Aucune' },
      { id: 2, facture: 'FC-2026-0088', client: 'Société Générale', type: 'J+5', date: '09/04/2026', canal: 'Email + SMS', statut: 'Envoyé', reponse: 'Promesse paiement semaine 16' },
      { id: 3, facture: 'FC-2026-0088', client: 'Société Générale', type: 'J+15', date: '19/04/2026', canal: 'Email', statut: 'Programmé', reponse: '—' },
    ],

    // Lettrage (matching encaissements/factures)
    lettrage: [
      { id: 1, facture: 'FC-2026-0045', client: 'Orange / Digital Q1', montantFacture: 87012500, encaissement: 87012500, ecart: 0, dateMatch: '28/02/2026', statut: 'Lettré', banque: 'SGBC' },
      { id: 2, facture: 'FC-2026-0039', client: 'Orange / Activations Dec', montantFacture: 50085000, encaissement: 50085000, ecart: 0, dateMatch: '12/02/2026', statut: 'Lettré', banque: 'BICEC' },
      { id: 3, facture: 'FC-2026-0088', client: 'Société Générale', montantFacture: 26235000, encaissement: 0, ecart: -26235000, dateMatch: null, statut: 'Non lettré', banque: '—' },
    ],

    // Échéancier prévisionnel
    echeancier: [
      { mois: 'Mai 2026', entrees: 26235000, sorties: 45000000, soldePrevu: 118785000 },
      { mois: 'Juin 2026', entrees: 63202500, sorties: 38000000, soldePrevu: 143987500 },
      { mois: 'Juil 2026', entrees: 143100000, sorties: 52000000, soldePrevu: 235087500 },
    ],

    // Fonctions du module
    fonctions: [
      { name: 'Devis', description: 'Création tarifée poste par poste, signature électronique client, gel automatique de la ligne budgétaire correspondante', impact: 'Engagement client formel avant tout déclenchement de dépenses' },
      { name: 'Avenant', description: "Modification d'un devis validé avec recalcul automatique et historisation des versions", impact: 'Flexibilité contractuelle sans perte de traçabilité' },
      { name: 'Proforma', description: 'Génération automatique depuis devis + avenants, lien de partage client sécurisé, suivi de consultation', impact: "Pré-validation client avant émission de la facture définitive" },
      { name: 'Facture Finale', description: 'Émission post-validation proforma, numérotation séquentielle, application TVA CEMAC (19,25%), export comptable immédiat', impact: 'Conformité fiscale OHADA et accélération du cycle de facturation' },
      { name: 'Relances', description: 'Relances automatiques J-5 avant échéance, J+5 et J+15 après impayé (email/SMS)', impact: 'Réduction du DSO (délai moyen de paiement)' },
      { name: 'Lettrage', description: 'Matching automatique encaissement bancaire → facture émise, solde client temps réel', impact: 'Visibilité immédiate des impayés et arrêté de compte fiable' },
    ],

    // Règles métier automatisées
    regles: [
      'Un devis validé déclenche la réservation budgétaire en mode « gelé » sans consommation réelle.',
      'L\'avenant met à jour la ligne budgétaire et recalcule le reste à facturer en temps réel.',
      'La facture finale peut être émise automatiquement après validation de la proforma, ou manuellement à échéance contractuelle.',
      'Le module alimente directement le calendrier des échéances et les alertes trésorerie : une facture impayée à J+11 déclenche automatiquement une alerte dans le panel Alertes si elle menace la projection de solde.',
    ],
  },
};
