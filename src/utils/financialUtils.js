/**
 * Financial utilities for McCann Bridge Financial Tracking Module
 */

// Convert numbers to French words for formal invoicing
export function numberToFrenchWords(num) {
  if (num === null || num === undefined || isNaN(num)) return 'Zéro Francs CFA';
  const integerPart = Math.floor(Math.abs(num));
  
  if (integerPart === 0) return 'Zéro Francs CFA';

  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];

  function convertGroup(n) {
    let res = '';
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;

    if (hundreds > 0) {
      if (hundreds === 1) {
        res += 'cent ';
      } else {
        res += units[hundreds] + (remainder === 0 ? ' cents ' : ' cent ');
      }
    }

    if (remainder > 0) {
      if (remainder < 20) {
        res += units[remainder] + ' ';
      } else {
        const ten = Math.floor(remainder / 10);
        const unit = remainder % 10;

        if (ten === 7) {
          res += 'soixante-' + (unit === 1 ? 'et-onze ' : units[10 + unit] + ' ');
        } else if (ten === 8) {
          if (unit === 0) {
            res += 'quatre-vingts ';
          } else {
            res += 'quatre-vingt-' + units[unit] + ' ';
          }
        } else if (ten === 9) {
          res += 'quatre-vingt-' + units[10 + unit] + ' ';
        } else {
          if (unit === 1 && ten !== 8) {
            res += tens[ten] + '-et-un ';
          } else if (unit > 0) {
            res += tens[ten] + '-' + units[unit] + ' ';
          } else {
            res += tens[ten] + ' ';
          }
        }
      }
    }
    return res.trim();
  }

  let words = '';
  const billions = Math.floor(integerPart / 1000000000);
  const millions = Math.floor((integerPart % 1000000000) / 1000000);
  const thousands = Math.floor((integerPart % 1000000) / 1000);
  const unitsGroup = integerPart % 1000;

  if (billions > 0) {
    words += (billions === 1 ? 'un milliard ' : convertGroup(billions) + ' milliards ');
  }
  if (millions > 0) {
    words += (millions === 1 ? 'un million ' : convertGroup(millions) + ' millions ');
  }
  if (thousands > 0) {
    words += (thousands === 1 ? 'mille ' : convertGroup(thousands) + ' mille ');
  }
  if (unitsGroup > 0) {
    words += convertGroup(unitsGroup) + ' ';
  }

  words = words.trim();
  if (!words) words = 'zéro';
  
  // Capitalize first letter
  const formatted = words.charAt(0).toUpperCase() + words.slice(1);
  return `${formatted} Francs CFA (XAF)`;
}

export const DOCUMENT_TYPES = [
  { id: 'BC', label: 'Bon de Commande', prefix: 'BC-2026-', icon: '📦', color: '#27AE60', category: 'Achats & Engagements' },
  { id: 'FAF', label: 'Facture Fournisseur', prefix: 'FAF-2026-', altPrefix: 'FA-2026-', icon: '📑', color: '#8E44AD', category: 'Dépenses & Fournisseurs' },
  { id: 'FC', label: 'Facture Client', prefix: 'FC-2026-', icon: '🧾', color: '#2980B9', category: 'Ventes & Recouvrement' },
  { id: 'RC', label: 'Reçu de Paiement', prefix: 'RC-2026-', icon: '💳', color: '#E67E22', category: 'Trésorerie & Encaissements' },
  { id: 'DEV', label: 'Devis Prestation', prefix: 'DEV-2026-', icon: '📝', color: '#F39C12', category: 'Offres Commerciales' },
  { id: 'PRO', label: 'Facture Pro-forma', prefix: 'PRO-2026-', icon: '📄', color: '#16A085', category: 'Pré-facturation' },
];

export const DOCUMENT_STATUSES = [
  { id: 'Brouillon', label: 'Brouillon', color: '#7f8c8d', badgeClass: 'tag-muted' },
  { id: 'En validation', label: 'En validation', color: '#f39c12', badgeClass: 'tag-yellow' },
  { id: 'Validée', label: 'Validée', color: '#27ae60', badgeClass: 'tag-green' },
  { id: 'Réconcilié', label: 'Réconcilié', color: '#2980b9', badgeClass: 'tag-blue' },
  { id: 'À réconcilier', label: 'À réconcilier', color: '#8e44ad', badgeClass: 'tag-purple' },
  { id: 'Encaissée / Payée', label: 'Encaissée / Payée', color: '#2ecc71', badgeClass: 'tag-green' },
  { id: 'Impayée', label: 'Impayée', color: '#e74c3c', badgeClass: 'tag-red' },
];

export const PAYMENT_MODES = [
  'Virement bancaire (Swift / SEPA)',
  'Chèque de banque certifié',
  'Orange Money / MTN Mobile Money (Corporate)',
  'Traite bancaire',
  'Espèces (Caisse régie)',
];

export const CAMPAIGN_PRESETS = [
  'Mayi Festival 2026',
  'Launch 5G MTN',
  'Orange Digital Q2',
  'Campagne Ramadan 2026',
  'Société Générale Q2 Digital',
  'Orange / Influence Q2',
  'Orange / Community Mgmt',
  'Brand Awareness Pulse 360',
  'Fête de la Musique 2026',
  'Rentrée Scolaire 2026',
];

export const TVA_RATES = [
  { label: 'TVA CEMAC Standard (19,25 %)', rate: 0.1925 },
  { label: 'TVA Exonérée / Export (0 %)', rate: 0.0 },
  { label: 'TVA Taux Réduit (10 %)', rate: 0.10 },
];

export function generateDocumentReference(type, existingDocs = []) {
  const docType = DOCUMENT_TYPES.find(t => t.id === type || t.label === type) || DOCUMENT_TYPES[0];
  const prefix = docType.prefix;
  
  // Find highest sequence or generate random sequential
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const count = (existingDocs || []).filter(d => (d.type === docType.id || d.type === docType.label)).length + 1;
  const seq = String(count).padStart(4, '0');
  
  return `${prefix}${Math.max(parseInt(seq, 10), randomNum)}`;
}

export function calculateDocumentTotals(items = [], withAir = false, airRate = 0.055) {
  let subtotalHT = 0;
  let totalDiscount = 0;
  let totalTVA = 0;

  (items || []).forEach(item => {
    const qty = Number(item.quantity || item.qty || 1);
    const unitPrice = Number(item.unitPrice || item.price || 0);
    const discountPct = Number(item.discount || 0);
    const tvaRate = Number(item.tvaRate !== undefined ? item.tvaRate : 0.1925);

    const lineGrossHT = qty * unitPrice;
    const lineDiscount = lineGrossHT * (discountPct / 100);
    const lineNetHT = lineGrossHT - lineDiscount;
    const lineTVA = lineNetHT * tvaRate;

    subtotalHT += lineGrossHT;
    totalDiscount += lineDiscount;
    totalTVA += lineTVA;
  });

  const netHT = subtotalHT - totalDiscount;
  const withholdingTax = withAir ? netHT * airRate : 0;
  const totalTTC = Math.round(netHT + totalTVA - withholdingTax);

  return {
    subtotalHT: Math.round(subtotalHT),
    totalDiscount: Math.round(totalDiscount),
    netHT: Math.round(netHT),
    totalTVA: Math.round(totalTVA),
    withholdingTax: Math.round(withholdingTax),
    totalTTC: Math.max(0, totalTTC),
    inWords: numberToFrenchWords(totalTTC)
  };
}

export const INITIAL_FINANCIAL_DOCUMENTS = [
  {
    id: 'fin-doc-1',
    type: 'BC',
    typeLabel: 'Bon de Commande',
    reference: 'BC-2026-0442',
    client: 'Orange Cameroun SA',
    campagne: 'Mayi Festival 2026',
    dateEmission: '2026-05-08',
    dateEcheance: '2026-06-07',
    statut: 'En validation',
    thirdParty: {
      name: 'Studio Mayi Productions SA',
      rccm: 'RC/DLA/2018/B/4521 - NIU M081800034512P',
      phone: '+237 699 44 22 11',
      address: 'Boulevard de la Liberté, Akwa, Douala, Cameroun'
    },
    items: [
      { id: 'item-1', description: 'Production Spots TV & Vidéos Digitales Mayi 2026 (4 capsules 4K)', quantity: 4, unitPrice: 4500000, discount: 5, tvaRate: 0.1925 },
      { id: 'item-2', description: 'Couverture live multicam, streaming haute définition & montage', quantity: 2, unitPrice: 3500000, discount: 0, tvaRate: 0.1925 },
      { id: 'item-3', description: 'Post-production sonore, voice-over français / pidgin & mastering', quantity: 1, unitPrice: 2800000, discount: 0, tvaRate: 0.1925 },
      { id: 'item-4', description: 'Scénarisation & Storyboards direction artistique', quantity: 1, unitPrice: 1600000, discount: 0, tvaRate: 0.1925 },
    ],
    montantHT: 25000000,
    montantRemise: 900000,
    montantTVA: 4639250,
    montantTTC: 28500000,
    modeReglement: 'Virement bancaire (Swift / SEPA)',
    etablissementBancaire: 'Société Générale Cameroun (SGBC)',
    rib: 'CM21 1000 2000 3000 4000 5000 12',
    notes: 'Avenant n°1 rattaché au contrat cadre Orange Q2. Retenue à la source 5.5% déductible.',
    pieces: ['bc_mayi_festival_signe.pdf', 'devis_valide_studio_mayi.pdf'],
    createdAt: '2026-05-08T10:00:00Z',
    updatedAt: '2026-05-08T10:00:00Z',
  },
  {
    id: 'fin-doc-2',
    type: 'FAF',
    typeLabel: 'Facture Fournisseur',
    reference: 'FA-2026-0891',
    client: 'Orange Cameroun SA',
    campagne: 'Orange Digital Q2',
    dateEmission: '2026-05-07',
    dateEcheance: '2026-06-06',
    statut: 'Validée',
    thirdParty: {
      name: 'Digital Agency Q2 SARL',
      rccm: 'RC/DLA/2021/B/1120 - NIU M052100087654K',
      phone: '+237 677 88 99 00',
      address: 'Immeuble Titanium, Bonapriso, Douala'
    },
    items: [
      { id: 'item-1', description: 'Achats d\'espaces Meta & Display Programmatique Q2', quantity: 1, unitPrice: 8500000, discount: 0, tvaRate: 0.1925 },
      { id: 'item-2', description: 'Optimisation SEO / SEA Google Ads & Google Analytics 4', quantity: 1, unitPrice: 2200000, discount: 0, tvaRate: 0.1925 },
    ],
    montantHT: 10700000,
    montantRemise: 0,
    montantTVA: 2059750,
    montantTTC: 12750000,
    modeReglement: 'Virement bancaire (Swift / SEPA)',
    etablissementBancaire: 'BICEC Akwa',
    rib: 'CM21 1000 5000 8000 9000 1234 56',
    notes: 'Facture conforme au BC-2026-0439. Validation comptable effectuée sans réserve.',
    pieces: ['facture_digital_q2_891.pdf', 'xml_export_ohada.xml'],
    createdAt: '2026-05-07T14:30:00Z',
    updatedAt: '2026-05-07T14:30:00Z',
  },
  {
    id: 'fin-doc-3',
    type: 'RC',
    typeLabel: 'Reçu de Paiement',
    reference: 'RC-2026-0156',
    client: 'MTN Cameroon',
    campagne: 'Launch 5G MTN',
    dateEmission: '2026-05-06',
    dateEcheance: '2026-05-06',
    statut: 'Réconcilié',
    thirdParty: {
      name: 'MTN Cameroon SA',
      rccm: 'RC/DLA/2000/B/890 - NIU M020000012345T',
      phone: '+237 679 00 00 00',
      address: 'Direction Générale MTN, Boulevard de la Liberté, Douala'
    },
    items: [
      { id: 'item-1', description: 'Règlement acompte 50% Campagne 360 Lancement 5G MTN', quantity: 1, unitPrice: 37735849, discount: 0, tvaRate: 0.1925 },
    ],
    montantHT: 37735849,
    montantRemise: 0,
    montantTVA: 7264151,
    montantTTC: 45000000,
    modeReglement: 'Virement bancaire (Swift / SEPA)',
    etablissementBancaire: 'Standard Chartered Bank Cameroun',
    rib: 'CM21 1000 9000 4000 2000 6789 01',
    notes: 'Paiement reçu sur compte SGBC. Rapprochement bancaire automatique concordant.',
    pieces: ['recu_swift_mtn_45m.pdf', 'swift_confirmation.txt'],
    createdAt: '2026-05-06T09:15:00Z',
    updatedAt: '2026-05-06T09:15:00Z',
  },
  {
    id: 'fin-doc-4',
    type: 'FC',
    typeLabel: 'Facture Client',
    reference: 'FC-2026-0092',
    client: 'Orange Cameroun SA',
    campagne: 'Mayi Festival 2026',
    dateEmission: '2026-05-02',
    dateEcheance: '2026-06-01',
    statut: 'En validation',
    thirdParty: {
      name: 'Orange Cameroun SA',
      rccm: 'RC/DLA/1999/B/001 - NIU M019900009876Q',
      phone: '+237 699 00 00 00',
      address: 'Siège Social Orange, Rue Prince Bell, Bonanjo, Douala'
    },
    items: [
      { id: 'item-1', description: 'Honoraires d\'Agence & Gestion Campagne Mayi 2026', quantity: 1, unitPrice: 28000000, discount: 0, tvaRate: 0.1925 },
      { id: 'item-2', description: 'Supervision & Coordination Régie Terrain Festival', quantity: 1, unitPrice: 15000000, discount: 0, tvaRate: 0.1925 },
      { id: 'item-3', description: 'Reporting d\'impact, Billetterie & Analytics post-campagne', quantity: 1, unitPrice: 10000000, discount: 0, tvaRate: 0.1925 },
    ],
    montantHT: 53000000,
    montantRemise: 0,
    montantTVA: 10202500,
    montantTTC: 63202500,
    modeReglement: 'Virement bancaire (Swift / SEPA)',
    etablissementBancaire: 'Société Générale Cameroun (SGBC)',
    rib: 'CM21 1000 2000 3000 4000 5000 12',
    notes: 'Facture soumise à validation de la direction marketing et achats Orange.',
    pieces: ['facture_orange_fc0092.pdf'],
    createdAt: '2026-05-02T11:00:00Z',
    updatedAt: '2026-05-02T11:00:00Z',
  },
  {
    id: 'fin-doc-5',
    type: 'DEV',
    typeLabel: 'Devis Prestation',
    reference: 'DEV-2026-0104',
    client: 'Société Générale Cameroun',
    campagne: 'Société Générale Q2 Digital',
    dateEmission: '2026-04-18',
    dateEcheance: '2026-05-18',
    statut: 'Validée',
    thirdParty: {
      name: 'Société Générale Cameroun',
      rccm: 'RC/DLA/1963/B/145 - NIU M016300001122S',
      phone: '+237 233 43 00 00',
      address: 'Rue Joffre, Akwa, Douala'
    },
    items: [
      { id: 'item-1', description: 'Stratégie de communication digitale & Contenus Réseaux Sociaux Q2', quantity: 3, unitPrice: 4000000, discount: 0, tvaRate: 0.1925 },
      { id: 'item-2', description: 'Création Motion Design & infographies produits bancaires', quantity: 10, unitPrice: 650000, discount: 0, tvaRate: 0.1925 },
      { id: 'item-3', description: 'Gestion de crise & Modération 24/7', quantity: 3, unitPrice: 1150000, discount: 0, tvaRate: 0.1925 },
    ],
    montantHT: 22000000,
    montantRemise: 0,
    montantTVA: 4235000,
    montantTTC: 26235000,
    modeReglement: 'Virement bancaire (Swift / SEPA)',
    etablissementBancaire: 'SGBC Siège',
    rib: 'CM21 1000 2000 3000 4000 5000 12',
    notes: 'Devis signé par la Direction de la Communication Société Générale.',
    pieces: ['devis_sgbc_signe_q2.pdf'],
    createdAt: '2026-04-18T16:00:00Z',
    updatedAt: '2026-04-18T16:00:00Z',
  },
  {
    id: 'fin-doc-6',
    type: 'PRO',
    typeLabel: 'Facture Pro-forma',
    reference: 'PRO-2026-0078',
    client: 'MTN Cameroon',
    campagne: 'Launch 5G MTN',
    dateEmission: '2026-04-25',
    dateEcheance: '2026-05-25',
    statut: 'Validée',
    thirdParty: {
      name: 'MTN Cameroon SA',
      rccm: 'RC/DLA/2000/B/890 - NIU M020000012345T',
      phone: '+237 679 00 00 00',
      address: 'Direction Générale MTN, Boulevard de la Liberté, Douala'
    },
    items: [
      { id: 'item-1', description: 'Conception événementielle & Scénographie Reveal 5G', quantity: 1, unitPrice: 45000000, discount: 0, tvaRate: 0.1925 },
      { id: 'item-2', description: 'Activation Key Opinion Leaders & Influenceurs VIP', quantity: 1, unitPrice: 35000000, discount: 0, tvaRate: 0.1925 },
      { id: 'item-3', description: 'Production 3D & Hologrammes de démonstration', quantity: 1, unitPrice: 20000000, discount: 0, tvaRate: 0.1925 },
    ],
    montantHT: 100000000,
    montantRemise: 0,
    montantTVA: 19250000,
    montantTTC: 119250000,
    modeReglement: 'Virement bancaire (Swift / SEPA)',
    etablissementBancaire: 'Standard Chartered Bank Cameroun',
    rib: 'CM21 1000 9000 4000 2000 6789 01',
    notes: 'Proforma transmise pour déblocage du bon de commande corporate MTN.',
    pieces: ['proforma_mtn_reveal_5g.pdf'],
    createdAt: '2026-04-25T15:00:00Z',
    updatedAt: '2026-04-25T15:00:00Z',
  }
];
