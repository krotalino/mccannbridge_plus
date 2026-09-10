const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Import the parser functions via require / dynamic import
async function main() {
  const filePath = path.resolve(__dirname, '../Fichier-Reporting-Influence_5734.xlsx');
  const buffer = fs.readFileSync(filePath);
  const wb = xlsx.read(buffer, { type: 'buffer', raw: true });

  const { parseInfluenceWorkbook } = await import('../src/utils/influenceExcelParser.js');
  const result = parseInfluenceWorkbook(wb);

  console.log('=== RÉSULTATS DU PARSING ===');
  console.log('Batch ID:', result.batchId);
  console.log('Talents total:', result.talents.length);
  console.log('Talents par type:', result.summary.byType);
  console.log('Livrables total:', result.deliverables.length);
  console.log('Groupes d\'ambassadeurs:', result.ambassadorGroups.length);
  console.log('Doublons candidats détectés:', result.duplicateCandidates.length);
  console.log('Anomalies détectées (issues):', result.issues.length);

  // Check key influencers from prompt
  const keyNames = ['Carles Antonio', 'Simplest Tuthi', 'Queen Diva', 'Blanche Bahoken', 'Mayole Francine', 'Bk Baptist'];
  for (const name of keyNames) {
    const found = result.talents.find(t => t.display_name.toLowerCase() === name.toLowerCase());
    console.log(`- ${name}:`, found ? `OK (${found.platform_profiles.length} profils)` : 'MANQUANT');
  }

  // Check 8 groups
  console.log('Groupes 1 à 8:', result.ambassadorGroups.map(g => g.name).join(', '));

  // Check duplicate candidate
  result.duplicateCandidates.forEach(dc => {
    console.log(`Doublon: ${dc.candidate.display_name} -> ${dc.target.display_name} (${(dc.similarity * 100).toFixed(0)}%)`);
  });
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});
