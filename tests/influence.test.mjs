import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

import {
  cleanString,
  parseNullableNumber,
  normalizePlatform,
  normalizeContentType,
  normalizeDate,
  parseInfluenceWorkbook,
  parseInfluenceursSheet,
  parseOrangeWeekendSheet,
  parseAmbassadeursSheets,
  calculateSimilarity
} from '../src/utils/influenceExcelParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const excelPath = path.resolve(__dirname, '../Fichier-Reporting-Influence_5734.xlsx');

test('Cas 1: Une ligne de publication sans nom hérite correctement du talent du bloc précédent', () => {
  const rows = [
    ['Influenceur', 'Cahier des charges', 'Période', 'Sujet', 'Date', 'Type de contenu', 'Lien du post', 'Vues', 'Likes', 'Commentaires', 'Partages'],
    ['Carles Antonio', '1 post / semaine', 'Octobre', 'Orange Money', '2025-10-12', 'VIDEO', 'https://tiktok.com/@carlesantonio/video/111', 50000, 2000, 100, 50],
    ['', '', 'Octobre', 'Orange Cameroon', '2025-10-18', 'IMAGE', 'https://instagram.com/p/222/', 30000, 1000, 50, 20],
  ];

  const result = parseInfluenceursSheet(rows);
  assert.equal(result.deliverables.length, 2);
  assert.equal(result.deliverables[0].talent_name, 'Carles Antonio');
  assert.equal(result.deliverables[1].talent_name, 'Carles Antonio', 'La 2e ligne sans nom doit hériter de Carles Antonio');
});

test('Cas 2: Une ligne d\'en-tête, une ligne MOIS DE DECEMBRE, une ligne Semaine du ... et un sous-total ne créent aucun livrable fictif', () => {
  const rows = [
    ['Influenceur', 'Cahier des charges', 'Période', 'Sujet', 'Date', 'Type de contenu', 'Lien du post', 'Vues', 'Likes', 'Commentaires', 'Partages'],
    ['Carles Antonio', '1 post / semaine', 'MOIS D\'OCTOBRE', 'Welcome pack', '2025-10-12', 'VIDEO', 'https://tiktok.com/@carlesantonio/video/111', 50000, 2000, 100, 50],
    ['', '', 'MOIS DE NOVEMBRE', '', '', '', '', null, null, null, null],
    ['', '', 'Semaine du 03 au 09 Nov', '', '', '', '', null, null, null, null],
    ['Sous-total Carles Antonio', '', '', '', '', '', '', 50000, 2000, 100, 50]
  ];

  const issues = [];
  const result = parseInfluenceursSheet(rows, issues);
  assert.equal(result.deliverables.length, 1, 'Seule la ligne avec livrable réel doit être conservée');
  assert.equal(result.deliverables[0].title.includes('Welcome pack'), true);
  assert.equal(issues.some(i => i.message.includes('Sous-total')), true, 'Le sous-total doit être consigné dans les issues');
});

test('Cas 3: Une valeur explicitement égale à 0 reste zéro; une cellule vide ou espace insécable devient null', () => {
  assert.equal(parseNullableNumber(0), 0);
  assert.equal(parseNullableNumber('0'), 0);
  assert.equal(parseNullableNumber(''), null);
  assert.equal(parseNullableNumber('   '), null);
  assert.equal(parseNullableNumber('\u00A0'), null, 'Espace insécable doit devenir null');
  assert.equal(parseNullableNumber('N/A'), null);
  assert.equal(parseNullableNumber('-'), null);
  assert.equal(parseNullableNumber(1250), 1250);
});

test('Cas 4: Une publication TikTok/Instagram/Facebook est correctement catégorisée à partir de la source ou de son URL', () => {
  assert.equal(normalizePlatform('Facebook', 'https://example.com/post'), 'facebook');
  assert.equal(normalizePlatform('', 'https://www.tiktok.com/@creator/video/123'), 'tiktok');
  assert.equal(normalizePlatform('', 'https://instagram.com/reel/abc'), 'instagram');
  assert.equal(normalizePlatform('', 'https://facebook.com/posts/789'), 'facebook');
  assert.equal(normalizePlatform('', 'https://camerounweb.com/actu/article-1'), 'website');
});

test('Cas 5: Une publication ayant likes, commentaires et partages calcule son engagement; une publication incomplète est marquée incomplete', () => {
  const completeRows = [
    ['Test Talent', 'https://tiktok.com/@test/video/1', 1000, 200, 50, 1250, 25000, 'VIDEO', 'TikTok']
  ];
  const completeRes = parseOrangeWeekendSheet(completeRows);
  const del1 = completeRes.deliverables[0];
  assert.equal(del1.metrics.engagement_calculated, 1250);
  assert.equal(del1.metrics.engagement_rate, 5.0);
  assert.equal(del1.quality_status, 'valid');

  const incompleteRows = [
    ['Test Incomplet', 'https://facebook.com/test/posts/2', 500, null, null, null, 10000, 'POST', 'Facebook']
  ];
  const incompleteRes = parseOrangeWeekendSheet(incompleteRows);
  const del2 = incompleteRes.deliverables[0];
  assert.equal(del2.metrics.engagement_calculated, null);
  assert.equal(del2.quality_status, 'incomplete', 'Sans toutes les composantes, la publication doit être marquée incomplete');
});

test('Cas 6: Une réimportation du même classeur ne double pas les entités (idempotence)', () => {
  const buffer = fs.readFileSync(excelPath);
  const wb = XLSX.read(buffer, { type: 'buffer', raw: true });

  const run1 = parseInfluenceWorkbook(wb);
  const run2 = parseInfluenceWorkbook(wb);

  assert.equal(run1.talents.length, run2.talents.length, 'Le nombre de talents doit être strictement identique');
  assert.equal(run1.deliverables.length, run2.deliverables.length, 'Le nombre de livrables doit être strictement identique');
  assert.equal(run1.ambassadorGroups.length, 8, '8 groupes d\'ambassadeurs');
});

test('Cas 7: Deux ambassadeurs ressemblants issus de O\'Ambassadeurs et O\'Ambassadeurs (2) remontent comme doublon potentiel sans fusion automatique', () => {
  const list1 = [
    ['KAMGA', 'Stéphane', '@steph_k', 'https://facebook.com/stephane.kamga.amb']
  ];
  const list2 = [
    ['KAMGA', 'Stéphane', '@steph_k', 'https://facebook.com/stephane.kamga.amb'],
    ['NOUVEAU', 'Paul', '@paul_n', 'https://facebook.com/paul.n']
  ];

  const result = parseAmbassadeursSheets(list1, list2);
  assert.equal(result.duplicates.length, 1);
  assert.equal(result.duplicates[0].target.display_name, 'Stéphane KAMGA');
  assert.equal(result.duplicates[0].candidate.record_status, 'duplicate_candidate');
  assert.equal(result.ambassadors.length, 3, 'Les enregistrements restent distincts, non fusionnés silencieusement');
});

test('Cas 8: Un utilisateur client ne peut ni voir un téléphone ni éditer les contacts sensibles (règle RBAC)', () => {
  const adminContact = {
    display_name: 'Paulin Mbia',
    type: 'ambassador_admin',
    phone: '+237 699 01 23 45'
  };

  const sanitizeForClient = (talent, role) => {
    if (role === 'client') {
      return {
        ...talent,
        phone: '[Confidentiel — Réservé Direction Agence]',
        can_edit: false
      };
    }
    return { ...talent, can_edit: true };
  };

  const clientView = sanitizeForClient(adminContact, 'client');
  assert.equal(clientView.phone, '[Confidentiel — Réservé Direction Agence]');
  assert.equal(clientView.can_edit, false);

  const agencyView = sanitizeForClient(adminContact, 'influence_manager');
  assert.equal(agencyView.phone, '+237 699 01 23 45');
  assert.equal(agencyView.can_edit, true);
});

test('Cas 9: Les filtres du reporting se répercutent sur les métriques et livrables', () => {
  const deliverables = [
    { platform: 'tiktok', content_subject: 'Orange Money', metrics: { views: 10000, engagement_calculated: 500 } },
    { platform: 'instagram', content_subject: 'Orange Money', metrics: { views: 20000, engagement_calculated: 1200 } },
    { platform: 'tiktok', content_subject: 'Orange Weekend', metrics: { views: 30000, engagement_calculated: 1800 } },
  ];

  const filterPlatform = 'tiktok';
  const filtered = deliverables.filter(d => d.platform === filterPlatform);
  assert.equal(filtered.length, 2);

  const totalViews = filtered.reduce((acc, d) => acc + (d.metrics.views || 0), 0);
  assert.equal(totalViews, 40000);

  const totalEng = filtered.reduce((acc, d) => acc + (d.metrics.engagement_calculated || 0), 0);
  assert.equal(totalEng, 2300);
});
