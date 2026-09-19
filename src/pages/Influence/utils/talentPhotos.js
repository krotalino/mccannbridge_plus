/**
 * Mapping d'avatars et photos réelles pour les talents et ambassadeurs d'Orange Cameroun
 * Priorité absolue aux photos téléversées ou enregistrées lors de la création d'un influenceur.
 */

export const TALENT_PHOTOS = {
  // Influenceurs réels enregistrés dans la plateforme
  '1': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80', // Patrick Kameni
  '2': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80', // Alain Ngoumou (TechVibes)
  '3': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80', // Cynthia Eboa
  '4': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80', // Hubert Martial Tagne (Moustik)
  '5': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80', // Laura Mballa
  '6': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80', // Armand Essomba
  '7': 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=256&h=256&q=80', // Blanche Bailly
  '8': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80', // Ulrich Takam
  '9': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&h=256&q=80', // Muriel Blanche
  '10': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=256&h=256&q=80', // Tenor
  '11': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&h=256&q=80', // Cabrel Nanjip
  '12': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=256&h=256&q=80', // Kocee
  
  // Mapping par pseudo
  'kameni_official': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
  'techvibes_cm': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
  'cynthia_fashion': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'moustik_karismatik_off': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
  'laura_fit237': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  'coach_armand': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
  'blancheb_official': 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=256&h=256&q=80',
  'ulrich_tak': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80',
  'muriel_blanche_cm': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&h=256&q=80',
  'tenor_officiel': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=256&h=256&q=80',
  'cabrel_nanjip': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&h=256&q=80',
  'kocee_official': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=256&h=256&q=80'
};

const DIVERSE_AVATAR_POOL = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=256&h=256&q=80'
];

/**
 * Récupère l'URL de la photo réelle de l'influenceur (téléversée ou profil) avec fallback propre
 */
export function getTalentPhoto(talent) {
  if (!talent) return DIVERSE_AVATAR_POOL[0];
  
  // 1. Photo explicitement téléversée ou configurée sur la fiche
  if (talent.photo) return talent.photo;
  
  // 2. Recherche par ID (ex: 1, 2, 'INF-123')
  const strId = String(talent.id || '');
  if (strId && TALENT_PHOTOS[strId]) {
    return TALENT_PHOTOS[strId];
  }

  // 3. Recherche par pseudo ou nom
  const cleanPseudo = (talent.pseudo || talent.handle || talent.name || '').toLowerCase().replace(/[@\s]/g, '');
  if (cleanPseudo && TALENT_PHOTOS[cleanPseudo]) {
    return TALENT_PHOTOS[cleanPseudo];
  }

  for (const [k, url] of Object.entries(TALENT_PHOTOS)) {
    if (cleanPseudo.includes(k) && k.length > 3) {
      return url;
    }
  }

  // 4. Fallback déterministe via hash
  const str = strId || talent.display_name || talent.name || 'talent';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DIVERSE_AVATAR_POOL.length;
  return DIVERSE_AVATAR_POOL[index];
}

/**
 * Toutes les données exemples et benchmarks artificiels ont été supprimés.
 * Les métriques proviennent exclusivement des données réelles de chaque influenceur.
 */
export const BENCHMARK_TALENT_METRICS = {};
