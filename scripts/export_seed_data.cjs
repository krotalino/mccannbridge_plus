const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

async function main() {
  const filePath = path.resolve(__dirname, '../Fichier-Reporting-Influence_5734.xlsx');
  const buffer = fs.readFileSync(filePath);
  const wb = xlsx.read(buffer, { type: 'buffer', raw: true });

  const { parseInfluenceWorkbook } = await import('../src/utils/influenceExcelParser.js');
  const parsed = parseInfluenceWorkbook(wb);

  const insights = [
    {
      id: 'INS-001',
      campaign_id: 'CAMP-ORANGE-Q4-2025',
      campaign_name: 'Campagnes & Challenges Q4 2025',
      title: 'Surperformance du format Reel & TikTok sur le Story Time Challenge',
      observation: 'Les formats vidéo courts sur TikTok et Instagram Reel ont généré 78% des vues totales de la campagne Q4, avec un taux d\'engagement moyen de 6.8% contre 3.4% pour les posts statiques.',
      recommendation: 'Augmenter le ratio vidéo à 70% pour le prochain brief Q1 2026 et privilégier des hooks créatifs dès les 3 premières secondes.',
      priority: 'haute',
      owner: 'Alain Patrick Eboa',
      deadline: '2026-03-31',
      created_at: '2025-12-28T10:00:00.000Z'
    },
    {
      id: 'INS-002',
      campaign_id: 'CAMP-ORANGE-WEEKEND',
      campaign_name: 'Orange Weekend 2025',
      title: 'Effet de synergie entre créateurs phares et pages relais locales',
      observation: 'La combinaison de 6 macro-créateurs et 6 pages d\'actualités locales (Buzz 237, Douala Vibes, Le Tarmac CM) a permis de toucher les bassins d\'audience jeunes de Douala et Yaoundé sans saturation publicitaire.',
      recommendation: 'Systématiser la clause de rediffusion cross-pages dans les futurs contrats d\'ambassadeurs.',
      priority: 'moyenne',
      owner: 'Influence Manager',
      deadline: '2026-04-15',
      created_at: '2025-12-05T14:30:00.000Z'
    },
    {
      id: 'INS-003',
      campaign_id: 'CAMP-ORANGE-RELAY-2025',
      campaign_name: 'Relais Média & Webzines',
      title: 'Retombées SEO pérennes sur les webzines partenaires',
      observation: 'Les 6 articles webzines (CamerounWeb, ActuCameroun, Laura Dave) assurent une indexation permanente des offres Orange Money et forfaits data sur Google Search Afrique Centrale.',
      recommendation: 'Fournir systématiquement un kit de balisage UTM et liens vers la landing page Maxit pour chaque article.',
      priority: 'normale',
      owner: 'Digital Web Analyst',
      deadline: '2026-05-01',
      created_at: '2025-12-18T16:00:00.000Z'
    }
  ];

  const alerts = [
    {
      id: 'ALT-INF-001',
      priority: 'haute',
      type: 'inconsistent_engagement',
      title: 'Écart métrique d\'engagement déclaré vs calculé',
      reason: 'Sur la publication de Cameroun Web Infos (Orange Weekend), l\'engagement rapporté (5 000) diffère de la somme Likes (4 100) + Commentaires (390) + Partages (280) = 4 770.',
      target_id: 'PUB-CamerounWebInfos',
      target_name: 'Cameroun Web Infos',
      responsible: 'Digital Web Analyst',
      date: '2025-11-22',
      action_resolution: 'Vérifier la capture d\'écran d\'origine et aligner la métrique officielle',
      status: 'a_traiter'
    },
    {
      id: 'ALT-INF-002',
      priority: 'moyenne',
      type: 'incomplete_metrics',
      title: 'Données de performance incomplètes après publication',
      reason: 'Lien de Post Relais Yaoundé publié sans métriques de likes, commentaires ou partages renseignées dans le classeur.',
      target_id: 'PUB-RelaisYaounde',
      target_name: 'Post Relais Yaoundé',
      responsible: 'Influence Manager',
      date: '2025-11-25',
      action_resolution: 'Compléter le snapshot avec les statistiques réelles de la page',
      status: 'a_traiter'
    },
    {
      id: 'ALT-INF-003',
      priority: 'haute',
      type: 'duplicate_candidate',
      title: '4 doublons ambassadeurs à statuer',
      reason: 'La feuille O\'Ambassadeurs (2) contient 4 profils présentant plus de 85% de similarité avec des ambassadeurs déjà enregistrés (Stéphane KAMGA, Danielle NDONGO, Marie-Claire BELLA, Kévin FOTSO).',
      target_id: 'AMB-2-LIST',
      target_name: 'Annuaire O\'Ambassadeurs',
      responsible: 'Influence Manager',
      date: '2025-12-01',
      action_resolution: 'Arbitrer dans le gestionnaire de doublons : Fusionner, Conserver séparés ou Ignorer',
      status: 'a_traiter'
    },
    {
      id: 'ALT-INF-004',
      priority: 'moyenne',
      type: 'missing_contract',
      title: 'Cahier des charges actif sans numéro de contrat archivé',
      reason: 'Engagement de 1 post / semaine déclaré pour Carles Antonio et Mayole Francine nécessitant vérification du contrat juridique signé.',
      target_id: 'TAL-carles_antonio',
      target_name: 'Carles Antonio',
      responsible: 'Financial Manager / Chef de Projet',
      date: '2025-10-15',
      action_resolution: 'Rattacher le PDF du contrat signé dans l\'onglet Contrats',
      status: 'en_cours'
    }
  ];

  const content = `/**
 * BRIDGE IAM & Influence Operations — Données d'amorçage issues de Fichier-Reporting-Influence_5734.xlsx
 * Généré automatiquement pour respecter la stricte exactitude du classeur source.
 */

export const INITIAL_INFLUENCE_TALENTS = ${JSON.stringify(parsed.talents, null, 2)};

export const INITIAL_INFLUENCE_DELIVERABLES = ${JSON.stringify(parsed.deliverables, null, 2)};

export const INITIAL_INFLUENCE_SNAPSHOTS = ${JSON.stringify(parsed.snapshots, null, 2)};

export const INITIAL_INFLUENCE_CAMPAIGNS = ${JSON.stringify(parsed.campaigns, null, 2)};

export const INITIAL_AMBASSADOR_GROUPS = ${JSON.stringify(parsed.ambassadorGroups, null, 2)};

export const INITIAL_INFLUENCE_DUPLICATES = ${JSON.stringify(parsed.duplicateCandidates, null, 2)};

export const INITIAL_INFLUENCE_INSIGHTS = ${JSON.stringify(insights, null, 2)};

export const INITIAL_INFLUENCE_ALERTS = ${JSON.stringify(alerts, null, 2)};

export const INITIAL_IMPORT_BATCH = ${JSON.stringify(parsed.summary, null, 2)};
`;

  const dest = path.resolve(__dirname, '../src/data/influenceSeedData.js');
  fs.writeFileSync(dest, content, 'utf8');
  console.log('Successfully written seed data to:', dest);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
