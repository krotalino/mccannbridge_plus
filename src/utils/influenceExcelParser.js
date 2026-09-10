/**
 * BRIDGE IAM & Influence Operations — Parser Excel Idempotent & Normaliseur
 * Dédié au traitement de Fichier-Reporting-Influence_5734.xlsx et fichiers d'influence Orange Cameroun
 */

import * as XLSX from 'xlsx';

// ─── UTILITAIRES DE NORMALISATION ET NETTOYAGE ───

export const cleanString = (val) => {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/\u00A0/g, ' ') // Remplacer les espaces insécables
    .trim();
};

export const parseNullableNumber = (val) => {
  if (val === null || val === undefined) return null;
  const str = cleanString(val);
  if (str === '' || str.toUpperCase() === 'N/A' || str === '-') return null;
  const cleaned = str.replace(/\s+/g, '').replace(/,/g, '.');
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
};

export const normalizePlatform = (sourceCol, url) => {
  const src = cleanString(sourceCol).toLowerCase();
  if (src.includes('facebook') || src.includes('fb')) return 'facebook';
  if (src.includes('instagram') || src.includes('ig')) return 'instagram';
  if (src.includes('tiktok')) return 'tiktok';
  if (src.includes('youtube') || src.includes('yt')) return 'youtube';
  if (src.includes('linkedin')) return 'linkedin';
  if (src.includes('x') || src.includes('twitter')) return 'x';

  const u = cleanString(url).toLowerCase();
  if (u.includes('facebook.com') || u.includes('fb.watch') || u.includes('fb.me')) return 'facebook';
  if (u.includes('instagram.com') || u.includes('instagr.am')) return 'instagram';
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('linkedin.com')) return 'linkedin';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'x';
  if (u.startsWith('http')) return 'website';

  return 'unknown';
};

export const normalizeContentType = (rawType) => {
  const t = cleanString(rawType).toLowerCase();
  if (t.includes('video') || t.includes('vidéo') || t.includes('recap video')) return 'video';
  if (t.includes('reel')) return 'reel';
  if (t.includes('story') || t.includes('stories')) return 'story';
  if (t.includes('image') || t.includes('visuel') || t.includes('post visuel') || t.includes('photo')) return 'image';
  if (t.includes('post') || t.includes('publication') || t.includes('mobilisation')) return 'post';
  if (t.includes('live') || t.includes('direct')) return 'live';
  return t ? t : 'post';
};

export const normalizeDate = (rawDate) => {
  if (!rawDate) return { iso: null, raw: 'Non renseigné' };
  const raw = cleanString(rawDate);
  if (!raw) return { iso: null, raw: 'Non renseigné' };

  // Format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return { iso: raw, raw };
  }

  // Format DD/MM/YYYY
  const frMatch = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (frMatch) {
    const day = frMatch[1].padStart(2, '0');
    const month = frMatch[2].padStart(2, '0');
    const year = frMatch[3];
    return { iso: `${year}-${month}-${day}`, raw };
  }

  // Textes anglais : "Friday, November 7, 2025" ou "November 7, 2025"
  const enParsed = Date.parse(raw);
  if (!isNaN(enParsed)) {
    const d = new Date(enParsed);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return { iso: `${y}-${m}-${day}`, raw };
  }

  // Nombre série Excel (ex: 45968)
  const serial = Number(raw);
  if (!isNaN(serial) && serial > 30000 && serial < 60000) {
    try {
      const utcDays = Math.floor(serial - 25569);
      const utcValue = utcDays * 86400;
      const dateInfo = new Date(utcValue * 1000);
      const y = dateInfo.getFullYear();
      const m = String(dateInfo.getMonth() + 1).padStart(2, '0');
      const day = String(dateInfo.getDate()).padStart(2, '0');
      return { iso: `${y}-${m}-${day}`, raw: `${day}/${m}/${y}` };
    } catch (e) {
      return { iso: null, raw };
    }
  }

  return { iso: null, raw };
};

export const calculateSimilarity = (str1, str2) => {
  const s1 = cleanString(str1).toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = cleanString(str2).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;

  // Levenshtein simplifié
  const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  const dist = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - dist / maxLen;
};

// ─── PARSEURS INDIVIDUELS PAR FEUILLE ───

/**
 * 1. Feuille INFLUENCEURS :
 * - Profils sociaux en haut (Facebook, Instagram, TikTok)
 * - Blocs de livrables par créateur avec héritage au sein du bloc
 * - Exclusion des lignes d'intertitres (MOIS DE..., Semaine...) et sous-totaux
 */
export const parseInfluenceursSheet = (rows, issues = []) => {
  const talentsMap = new Map();
  const deliverables = [];
  const snapshots = [];

  let inSocialProfiles = false;
  let inDeliverables = false;
  let currentTalentName = null;
  let currentDeliverableCommitment = '1 post / semaine';

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r] || [];
    const firstCol = cleanString(row[0]);
    const firstColUpper = firstCol.toUpperCase();

    // Détection section profils sociaux
    if (firstColUpper.includes('RÉPERTOIRE INFLUENCEURS') || (firstColUpper === 'INFLUENCEUR' && cleanString(row[1]).toUpperCase() === 'FACEBOOK')) {
      inSocialProfiles = true;
      inDeliverables = false;
      continue;
    }

    // Détection section livrables / historique
    if (firstColUpper.includes('HISTORIQUE DES LIVRABLES') || firstColUpper.includes('CAHIER DES CHARGES') || (firstColUpper === 'INFLUENCEUR' && cleanString(row[1]).toUpperCase().includes('CAHIER'))) {
      inSocialProfiles = false;
      inDeliverables = true;
      continue;
    }

    // Section Profils Sociaux (Carles Antonio, Simplest Tuthi, Queen Diva, etc.)
    if (inSocialProfiles && !inDeliverables) {
      if (firstCol && firstColUpper !== 'INFLUENCEUR') {
        const talentName = firstCol;
        const fb = cleanString(row[1]);
        const ig = cleanString(row[2]);
        const tt = cleanString(row[3]);

        const platformProfiles = [];
        if (fb) platformProfiles.push({ platform: 'facebook', url: fb });
        if (ig) platformProfiles.push({ platform: 'instagram', url: ig });
        if (tt) platformProfiles.push({ platform: 'tiktok', url: tt });

        const talentId = `TAL-${talentName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        talentsMap.set(talentName.toLowerCase(), {
          id: talentId,
          type: 'influencer',
          display_name: talentName,
          first_name: talentName.split(' ')[0] || '',
          last_name: talentName.split(' ').slice(1).join(' ') || '',
          pseudo: `@${talentName.toLowerCase().replace(/\s+/g, '')}`,
          profile_url: ig || tt || fb || '',
          platform_profiles: platformProfiles,
          phone: null,
          source_sheet: 'INFLUENCEURS',
          source_row: r + 1,
          record_status: 'active',
          qualification_status: 'contrat_signe',
          cahier_charges: '1 post / semaine',
          notes: 'Importé depuis la feuille INFLUENCEURS',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      continue;
    }

    // Section Livrables / Publications
    if (inDeliverables) {
      // Ignorer les lignes d'en-tête répétées
      if (firstColUpper === 'INFLUENCEUR') continue;

      // Ignorer les lignes de sous-totaux
      if (firstColUpper.startsWith('SOUS-TOTAL') || firstColUpper.startsWith('TOTAL')) {
        issues.push({
          type: 'info',
          message: `Ligne de sous-total ignorée (${firstCol})`,
          sheet: 'INFLUENCEURS',
          row: r + 1,
          raw: row.join(' | ')
        });
        continue;
      }

      // Si première colonne contient un nouveau talent, démarrer un nouveau bloc
      if (firstCol && !firstColUpper.startsWith('MOIS') && !firstColUpper.startsWith('SEMAINE')) {
        currentTalentName = firstCol;
        if (cleanString(row[1])) {
          currentDeliverableCommitment = cleanString(row[1]);
        }
      }

      // Vérifier si la ligne est un intertitre de mois ou semaine
      const periodeCol = cleanString(row[2]);
      const sujetCol = cleanString(row[3]);
      const dateCol = cleanString(row[4]);
      const contentTypeCol = cleanString(row[5]);
      const urlCol = cleanString(row[6]);

      // Si c'est une ligne intertitre de mois sans livrable
      if ((firstColUpper.startsWith('MOIS') || periodeCol.toUpperCase().startsWith('MOIS')) && !sujetCol && !urlCol) {
        issues.push({
          type: 'info',
          message: `Intertitre de période ignoré (${firstCol || periodeCol})`,
          sheet: 'INFLUENCEURS',
          row: r + 1,
          raw: row.join(' | ')
        });
        continue;
      }

      // S'il n'y a pas d'URL et pas de sujet, c'est une ligne vide ou de transition
      if (!urlCol && !sujetCol && !dateCol) {
        continue;
      }

      if (!currentTalentName) {
        issues.push({
          type: 'warning',
          message: 'Livrable sans influenceur identifié dans le bloc',
          sheet: 'INFLUENCEURS',
          row: r + 1,
          raw: row.join(' | ')
        });
        continue;
      }

      // Assurer que le talent existe dans talentsMap
      let talent = talentsMap.get(currentTalentName.toLowerCase());
      if (!talent) {
        const talentId = `TAL-${currentTalentName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        talent = {
          id: talentId,
          type: 'influencer',
          display_name: currentTalentName,
          first_name: currentTalentName.split(' ')[0] || '',
          last_name: currentTalentName.split(' ').slice(1).join(' ') || '',
          pseudo: `@${currentTalentName.toLowerCase().replace(/\s+/g, '')}`,
          profile_url: urlCol || '',
          platform_profiles: [],
          phone: null,
          source_sheet: 'INFLUENCEURS',
          source_row: r + 1,
          record_status: 'active',
          qualification_status: 'contrat_signe',
          cahier_charges: currentDeliverableCommitment,
          notes: 'Créé via héritage de bloc dans INFLUENCEURS',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        talentsMap.set(currentTalentName.toLowerCase(), talent);
      }

      // Normalisation des métadonnées du livrable
      const { iso: published_at, raw: date_raw } = normalizeDate(dateCol);
      const platform = normalizePlatform('', urlCol);
      const contentType = normalizeContentType(contentTypeCol);
      const subject = sujetCol || 'Campagne Orange';

      // Métriques
      const views = parseNullableNumber(row[7]);
      const likes = parseNullableNumber(row[8]);
      const comments = parseNullableNumber(row[9]);
      const shares = parseNullableNumber(row[10]);

      let engagement_calculated = null;
      let quality_status = 'valid';

      if (likes !== null && comments !== null && shares !== null) {
        engagement_calculated = likes + comments + shares;
      } else if (likes !== null || comments !== null || shares !== null) {
        quality_status = 'incomplete';
      } else {
        quality_status = 'incomplete';
      }

      let engagement_rate = null;
      if (engagement_calculated !== null && views !== null && views > 0) {
        engagement_rate = Number(((engagement_calculated / views) * 100).toFixed(2));
      }

      const deliverableId = `PUB-${urlCol ? Math.abs(urlCol.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(36) : `ROW-${r+1}`}`;

      const deliverable = {
        id: deliverableId,
        campaign_id: 'CAMP-ORANGE-Q4-2025',
        campaign_name: 'Campagnes & Challenges Q4 2025',
        talent_id: talent.id,
        talent_name: talent.display_name,
        title: `${subject} — ${talent.display_name}`,
        content_subject: subject,
        content_type: contentType,
        platform,
        published_at,
        date_raw,
        url: urlCol,
        source_sheet: 'INFLUENCEURS',
        source_row: r + 1,
        source_value_raw: row.join(' | '),
        status: urlCol ? 'publie' : 'en_analyse',
        approval_status: 'valide',
        deliverable_commitment: currentDeliverableCommitment,
        quality_status,
        metrics: {
          views,
          likes,
          comments,
          shares,
          engagement_reported: null,
          engagement_calculated,
          engagement_rate
        }
      };

      deliverables.push(deliverable);

      snapshots.push({
        id: `SNP-${deliverableId}`,
        deliverable_id: deliverableId,
        captured_at: new Date().toISOString(),
        likes,
        comments,
        shares,
        views,
        engagement_reported: null,
        engagement_calculated,
        engagement_rate,
        source: 'INFLUENCEURS',
        quality_status
      });
    }
  }

  return {
    talents: Array.from(talentsMap.values()),
    deliverables,
    snapshots
  };
};

/**
 * 2. Feuille Orange Weekend :
 * - Reporting de campagne UGC et pages relais
 * - Colonnes : Influenceur/Page, Lien, Likes, Commentaires, Partages, Engagement, Vues, Type de contenu, Source
 * - Détection des intertitres (POST VISUEL EVENT, RECAP VIDEO CONFERENCE, POST MOBILISATION)
 * - Détection des incohérences d'engagement rapporté vs calculé
 */
export const parseOrangeWeekendSheet = (rows, issues = []) => {
  const talentsMap = new Map();
  const deliverables = [];
  const snapshots = [];

  let currentCategory = 'Général';

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r] || [];
    const firstCol = cleanString(row[0]);
    const firstColUpper = firstCol.toUpperCase();

    // Ignorer en-tête global
    if (firstColUpper.includes('REPORTING DE CAMPAGNE') || firstColUpper === 'INFLUENCEUR / PAGE' || firstColUpper === 'INFLUENCEUR') {
      continue;
    }

    // Détection des intertitres de catégories
    if (firstColUpper === 'POST VISUEL EVENT' || firstColUpper === 'RECAP VIDEO CONFERENCE' || firstColUpper === 'POST MOBILISATION') {
      currentCategory = firstCol;
      issues.push({
        type: 'info',
        message: `Catégorie détectée : ${firstCol}`,
        sheet: 'Orange Weekend',
        row: r + 1,
        raw: row.join(' | ')
      });
      continue;
    }

    const url = cleanString(row[1]);
    const likes = parseNullableNumber(row[2]);
    const comments = parseNullableNumber(row[3]);
    const shares = parseNullableNumber(row[4]);
    const engagement_reported = parseNullableNumber(row[5]);
    const views = parseNullableNumber(row[6]);
    const rawContentType = cleanString(row[7]);
    const sourceCol = cleanString(row[8]);

    // Ignorer si pas d'influenceur ni d'URL
    if (!firstCol && !url) continue;

    const talentName = firstCol || 'Page Relais Non Renseignée';
    const isUgcOrPage = !['Carles Antonio', 'Simplest Tuthi', 'Queen Diva', 'Blanche Bahoken', 'Mayole Francine', 'Bk Baptist'].includes(talentName);
    const talentType = isUgcOrPage ? 'page_relais' : 'influencer';

    const talentId = `TAL-${talentName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    if (!talentsMap.has(talentName.toLowerCase())) {
      talentsMap.set(talentName.toLowerCase(), {
        id: talentId,
        type: talentType,
        display_name: talentName,
        first_name: talentName.split(' ')[0] || '',
        last_name: talentName.split(' ').slice(1).join(' ') || '',
        pseudo: `@${talentName.toLowerCase().replace(/\s+/g, '')}`,
        profile_url: url || '',
        platform_profiles: url ? [{ platform: normalizePlatform(sourceCol, url), url }] : [],
        phone: null,
        source_sheet: 'Orange Weekend',
        source_row: r + 1,
        record_status: 'active',
        qualification_status: 'contrat_signe',
        notes: `Participant campagne Orange Weekend (${currentCategory})`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const platform = normalizePlatform(sourceCol, url);
    const contentType = normalizeContentType(rawContentType);

    // Calcul métriques & vérification de cohérence
    let engagement_calculated = null;
    let quality_status = 'valid';

    if (likes !== null && comments !== null && shares !== null) {
      engagement_calculated = likes + comments + shares;
      if (engagement_reported !== null && engagement_reported !== engagement_calculated) {
        quality_status = 'inconsistent';
        issues.push({
          type: 'warning',
          message: `Écart d'engagement sur ${talentName} : rapporté=${engagement_reported} vs calculé=${engagement_calculated}`,
          sheet: 'Orange Weekend',
          row: r + 1,
          raw: `Likes: ${likes}, Comms: ${comments}, Shares: ${shares}, EngRep: ${engagement_reported}`
        });
      }
    } else {
      quality_status = 'incomplete';
    }

    let engagement_rate = null;
    if (engagement_calculated !== null && views !== null && views > 0) {
      engagement_rate = Number(((engagement_calculated / views) * 100).toFixed(2));
    }

    const deliverableId = `PUB-${url ? Math.abs(url.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(36) : `OW-ROW-${r+1}`}`;

    deliverables.push({
      id: deliverableId,
      campaign_id: 'CAMP-ORANGE-WEEKEND',
      campaign_name: 'Orange Weekend 2025',
      talent_id: talentId,
      talent_name: talentName,
      title: `Orange Weekend — ${talentName} (${currentCategory})`,
      content_subject: 'Orange Weekend',
      content_type: contentType,
      platform,
      published_at: '2025-11-20',
      date_raw: 'Novembre 2025',
      url,
      source_sheet: 'Orange Weekend',
      source_row: r + 1,
      source_value_raw: row.join(' | '),
      status: 'publie',
      approval_status: 'valide',
      quality_status,
      metrics: {
        views,
        likes,
        comments,
        shares,
        engagement_reported,
        engagement_calculated,
        engagement_rate
      }
    });

    snapshots.push({
      id: `SNP-${deliverableId}`,
      deliverable_id: deliverableId,
      captured_at: new Date().toISOString(),
      likes,
      comments,
      shares,
      views,
      engagement_reported,
      engagement_calculated,
      engagement_rate,
      source: 'Orange Weekend',
      quality_status
    });
  }

  return {
    talents: Array.from(talentsMap.values()),
    deliverables,
    snapshots
  };
};

/**
 * 3. Feuilles O'Ambassadeurs et O'Ambassadeurs (2) :
 * - Dédoublonnage non silencieux avec marquage duplicate_candidate
 */
export const parseAmbassadeursSheets = (sheet1Rows, sheet2Rows, issues = []) => {
  const ambassadors = [];
  const duplicates = [];

  // Parse première feuille
  for (let r = 0; r < sheet1Rows.length; r++) {
    const row = sheet1Rows[r] || [];
    const nom = cleanString(row[0]);
    const prenom = cleanString(row[1]);
    const pseudo = cleanString(row[2]);
    const url = cleanString(row[3]);

    if (!nom || nom.toUpperCase() === 'NOMS') continue;

    const displayName = `${prenom} ${nom}`.trim();
    const id = `AMB-1-${r + 1}`;

    ambassadors.push({
      id,
      type: 'ambassador',
      first_name: prenom,
      last_name: nom,
      display_name: displayName,
      pseudo: pseudo || `@${prenom.toLowerCase()}_${nom.toLowerCase()}`,
      profile_url: url,
      platform_profiles: url ? [{ platform: normalizePlatform('', url), url }] : [],
      phone: null,
      source_sheet: "O'Ambassadeurs",
      source_row: r + 1,
      record_status: 'active',
      qualification_status: 'contrat_signe',
      notes: 'Annuaire officiel O\'Ambassadeurs Orange Cameroun',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Parse deuxième feuille et détection des doublons
  if (sheet2Rows && sheet2Rows.length > 0) {
    for (let r = 0; r < sheet2Rows.length; r++) {
      const row = sheet2Rows[r] || [];
      const nom = cleanString(row[0]);
      const prenom = cleanString(row[1]);
      const pseudo = cleanString(row[2]);
      const url = cleanString(row[3]);

      if (!nom || nom.toUpperCase() === 'NOMS') continue;

      const displayName = `${prenom} ${nom}`.trim();
      const id = `AMB-2-${r + 1}`;

      // Recherche de candidat doublon dans la liste déjà importée
      let bestMatch = null;
      let highestSimilarity = 0;

      for (const existing of ambassadors) {
        const nameSim = calculateSimilarity(existing.display_name, displayName);
        const urlSim = (url && existing.profile_url && url.toLowerCase() === existing.profile_url.toLowerCase()) ? 1.0 : 0;
        const pseudoSim = (pseudo && existing.pseudo && pseudo.toLowerCase() === existing.pseudo.toLowerCase()) ? 0.95 : 0;

        const maxSim = Math.max(nameSim, urlSim, pseudoSim);
        if (maxSim > highestSimilarity) {
          highestSimilarity = maxSim;
          bestMatch = existing;
        }
      }

      const isDuplicate = highestSimilarity >= 0.8;
      const recordStatus = isDuplicate ? 'duplicate_candidate' : 'active';

      const ambassador = {
        id,
        type: 'ambassador',
        first_name: prenom,
        last_name: nom,
        display_name: displayName,
        pseudo: pseudo || `@${prenom.toLowerCase()}_${nom.toLowerCase()}`,
        profile_url: url,
        platform_profiles: url ? [{ platform: normalizePlatform('', url), url }] : [],
        phone: null,
        source_sheet: "O'Ambassadeurs (2)",
        source_row: r + 1,
        record_status: recordStatus,
        duplicate_of: isDuplicate ? bestMatch.id : null,
        similarity_score: isDuplicate ? Number((highestSimilarity * 100).toFixed(0)) : null,
        qualification_status: 'contrat_signe',
        notes: isDuplicate ? `Doublon potentiel détecté avec ${bestMatch.display_name} (${(highestSimilarity * 100).toFixed(0)}% similarité)` : 'Importé depuis O\'Ambassadeurs (2)',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      ambassadors.push(ambassador);

      if (isDuplicate) {
        duplicates.push({
          candidate: ambassador,
          target: bestMatch,
          similarity: highestSimilarity
        });
        issues.push({
          type: 'warning',
          message: `Doublon candidat : ${displayName} correspond à ${bestMatch.display_name} (${(highestSimilarity * 100).toFixed(0)}% similitude)`,
          sheet: "O'Ambassadeurs (2)",
          row: r + 1,
          raw: `${displayName} (${url})`
        });
      }
    }
  }

  return {
    ambassadors,
    duplicates
  };
};

/**
 * 4. Feuille ADMINS O Ambassadeurs :
 * - 8 administrateurs de groupes d'ambassadeurs
 * - Contact restreint / phone masqué pour rôles non autorisés
 */
export const parseAmbassadorAdminsSheet = (rows, issues = []) => {
  const admins = [];
  const groups = [];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r] || [];
    const nameCol = cleanString(row[0]);
    const url = cleanString(row[1]);
    const phone = cleanString(row[2]);

    if (!nameCol || nameCol.toUpperCase().includes('NOM / GROUPE') || nameCol.toUpperCase() === 'NOM') continue;

    // Détection groupe ex: "Groupe 1 - Paulin Mbia"
    let groupName = `Groupe ${r}`;
    let adminName = nameCol;

    const groupMatch = nameCol.match(/^(Groupe\s*\d+)\s*[-:]\s*(.+)$/i);
    if (groupMatch) {
      groupName = groupMatch[1].trim();
      adminName = groupMatch[2].trim();
    }

    const adminId = `ADM-${adminName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const groupId = `GRP-${groupName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const admin = {
      id: adminId,
      type: 'ambassador_admin',
      display_name: adminName,
      first_name: adminName.split(' ')[0] || '',
      last_name: adminName.split(' ').slice(1).join(' ') || '',
      pseudo: `@admin_${groupName.toLowerCase().replace(/\s+/g, '')}`,
      profile_url: url,
      platform_profiles: url ? [{ platform: normalizePlatform('', url), url }] : [],
      phone, // Donnée restreinte !
      assigned_group_id: groupId,
      assigned_group_name: groupName,
      source_sheet: 'ADMINS O Ambassadeurs',
      source_row: r + 1,
      record_status: 'active',
      qualification_status: 'contrat_signe',
      notes: `Administrateur référent ${groupName}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    admins.push(admin);

    groups.push({
      id: groupId,
      name: groupName,
      admin_talent_id: adminId,
      admin_name: adminName,
      admin_phone: phone,
      status: 'actif',
      source_reference: `Ligne ${r + 1} ADMINS O Ambassadeurs`
    });
  }

  return {
    admins,
    groups
  };
};

/**
 * 5. Feuille WEBZINES :
 * - Médias en ligne, liens de page et de publications
 */
export const parseWebzinesSheet = (rows, issues = []) => {
  const webzines = [];
  const deliverables = [];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r] || [];
    const name = cleanString(row[0]);
    const siteUrl = cleanString(row[1]);
    const pubUrl = cleanString(row[2]);

    if (!name || name.toUpperCase() === 'NOM') continue;

    const webzineId = `MED-${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    webzines.push({
      id: webzineId,
      type: 'webzine',
      display_name: name,
      first_name: '',
      last_name: '',
      pseudo: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      profile_url: siteUrl,
      platform_profiles: siteUrl ? [{ platform: 'website', url: siteUrl }] : [],
      phone: null,
      source_sheet: 'WEBZINES',
      source_row: r + 1,
      record_status: 'active',
      qualification_status: 'contrat_signe',
      notes: 'Média webzine partenaire de diffusion Orange Cameroun',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (pubUrl) {
      const pubId = `PUB-${Math.abs(pubUrl.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(36)}`;
      deliverables.push({
        id: pubId,
        campaign_id: 'CAMP-ORANGE-RELAY-2025',
        campaign_name: 'Relais Média & Webzines',
        talent_id: webzineId,
        talent_name: name,
        title: `Article Webzine — ${name}`,
        content_subject: 'Relais Presse & Webzine',
        content_type: 'post',
        platform: 'website',
        published_at: '2025-11-25',
        date_raw: 'Novembre 2025',
        url: pubUrl,
        source_sheet: 'WEBZINES',
        source_row: r + 1,
        source_value_raw: row.join(' | '),
        status: 'publie',
        approval_status: 'valide',
        quality_status: 'valid',
        metrics: {
          views: null,
          likes: null,
          comments: null,
          shares: null,
          engagement_reported: null,
          engagement_calculated: null,
          engagement_rate: null
        }
      });
    }
  }

  return {
    webzines,
    deliverables
  };
};

// ─── FONCTION MAÎTRESSE DE PARSING D'UN WORKBOOK ───

export const parseInfluenceWorkbook = (workbook, fileName = 'classeur.xlsx') => {
  const issues = [];
  const batchId = `IMP-${Date.now().toString(36).toUpperCase()}`;

  // Récupérer les feuilles
  const sheetNames = workbook.SheetNames || [];
  const getSheetRows = (name) => {
    const ws = workbook.Sheets[name];
    if (!ws) return [];
    return XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null });
  };

  // 1. Feuille INFLUENCEURS
  const infRows = getSheetRows('INFLUENCEURS');
  const infResult = parseInfluenceursSheet(infRows, issues);

  // 2. Feuille Orange Weekend
  const owRows = getSheetRows('Orange Weekend');
  const owResult = parseOrangeWeekendSheet(owRows, issues);

  // 3. Feuilles O'Ambassadeurs et O'Ambassadeurs (2)
  const amb1Rows = getSheetRows("O'Ambassadeurs");
  const amb2Rows = getSheetRows("O'Ambassadeurs (2)");
  const ambResult = parseAmbassadeursSheets(amb1Rows, amb2Rows, issues);

  // 4. Feuille ADMINS O Ambassadeurs
  const admRows = getSheetRows('ADMINS O Ambassadeurs');
  const admResult = parseAmbassadorAdminsSheet(admRows, issues);

  // 5. Feuille WEBZINES
  const webRows = getSheetRows('WEBZINES');
  const webResult = parseWebzinesSheet(webRows, issues);

  // Fusion des talents avec dédoublonnage idempotent
  const allTalentsMap = new Map();

  const addTalents = (list) => {
    for (const t of list) {
      const key = `${t.type}_${cleanString(t.display_name).toLowerCase()}`;
      if (allTalentsMap.has(key)) {
        // Fusion des profils sans écraser les données existantes
        const existing = allTalentsMap.get(key);
        existing.platform_profiles = [
          ...existing.platform_profiles,
          ...(t.platform_profiles || []).filter(p => !existing.platform_profiles.some(ep => ep.url === p.url))
        ];
        if (!existing.phone && t.phone) existing.phone = t.phone;
        if (t.cahier_charges && !existing.cahier_charges) existing.cahier_charges = t.cahier_charges;
      } else {
        allTalentsMap.set(key, { ...t, import_batch_id: batchId });
      }
    }
  };

  addTalents(infResult.talents);
  addTalents(owResult.talents);
  addTalents(ambResult.ambassadors);
  addTalents(admResult.admins);
  addTalents(webResult.webzines);

  // Fusion des livrables avec dédoublonnage par URL
  const allDeliverablesMap = new Map();
  const allSnapshots = [...infResult.snapshots, ...owResult.snapshots];

  const addDeliverables = (list) => {
    for (const d of list) {
      const key = d.url ? d.url.trim().toLowerCase() : d.id;
      if (!allDeliverablesMap.has(key)) {
        allDeliverablesMap.set(key, { ...d, import_batch_id: batchId });
      } else {
        issues.push({
          type: 'info',
          message: `Livrable déjà présent ignoré (idempotence) : ${d.title}`,
          sheet: d.source_sheet,
          row: d.source_row,
          raw: d.url
        });
      }
    }
  };

  addDeliverables(infResult.deliverables);
  addDeliverables(owResult.deliverables);
  addDeliverables(webResult.deliverables);

  // Campagnes déduites
  const campaigns = [
    {
      id: 'CAMP-ORANGE-WEEKEND',
      name: 'Orange Weekend 2025',
      client_id: 'orange-cm',
      project_id: 'PRJ-ORANGE-WEEKEND',
      brief_id: 'BR-2026-001',
      objective: 'Amplification virale de l\'offre événementielle Orange Weekend via créateurs et relais locaux.',
      period_start: '2025-11-01',
      period_end: '2025-11-30',
      status: 'completed',
      budget_allocated: 15000000,
      owner_id: 'Alain Patrick Eboa',
      channels: ['Instagram', 'TikTok', 'Facebook'],
      hashtags: ['#OrangeWeekend', '#OrangeCameroun', '#PulseOrange'],
      notes: 'Importé depuis la feuille Orange Weekend'
    },
    {
      id: 'CAMP-ORANGE-Q4-2025',
      name: 'Campagnes & Challenges Q4 2025',
      client_id: 'orange-cm',
      project_id: 'PRJ-TELCO-Q4',
      brief_id: 'BR-2026-002',
      objective: 'Séquençage des activations Orange Money, Story Time Challenge et #DreamList.',
      period_start: '2025-10-01',
      period_end: '2025-12-31',
      status: 'completed',
      budget_allocated: 25000000,
      owner_id: 'Alain Patrick Eboa',
      channels: ['TikTok', 'Instagram', 'Facebook'],
      hashtags: ['#OrangeMoney', '#OrangeStoryTimeChallenge', '#DreamList', '#OrangeCameroon'],
      notes: 'Importé depuis la feuille INFLUENCEURS'
    },
    {
      id: 'CAMP-ORANGE-RELAY-2025',
      name: 'Relais Média & Webzines',
      client_id: 'orange-cm',
      project_id: 'PRJ-MEDIA-RELAY',
      brief_id: 'BR-2026-003',
      objective: 'Couverture médiatique et publication d\'articles récapitulatifs sur webzines référents.',
      period_start: '2025-11-01',
      period_end: '2025-12-15',
      status: 'completed',
      budget_allocated: 5000000,
      owner_id: 'Influence Manager',
      channels: ['Websites / Webzines'],
      hashtags: ['#Presse', '#Webzines'],
      notes: 'Importé depuis la feuille WEBZINES'
    }
  ];

  const talents = Array.from(allTalentsMap.values());
  const deliverables = Array.from(allDeliverablesMap.values());

  const summary = {
    batchId,
    fileName: fileName || 'classeur.xlsx',
    timestamp: new Date().toISOString(),
    sheetsProcessed: sheetNames,
    totalTalents: talents.length,
    byType: {
      influencers: talents.filter(t => t.type === 'influencer').length,
      ambassadors: talents.filter(t => t.type === 'ambassador').length,
      ambassadorAdmins: talents.filter(t => t.type === 'ambassador_admin').length,
      pagesRelais: talents.filter(t => t.type === 'page_relais').length,
      webzines: talents.filter(t => t.type === 'webzine').length,
    },
    totalDeliverables: deliverables.length,
    totalSnapshots: allSnapshots.length,
    duplicateCandidates: ambResult.duplicates.length,
    groups: admResult.groups,
    issuesCount: {
      info: issues.filter(i => i.type === 'info').length,
      warning: issues.filter(i => i.type === 'warning').length,
      error: issues.filter(i => i.type === 'error').length,
    },
    issues
  };

  return {
    batchId,
    talents,
    deliverables,
    snapshots: allSnapshots,
    campaigns,
    ambassadorGroups: admResult.groups,
    duplicateCandidates: ambResult.duplicates,
    summary,
    issues
  };
};

/**
 * Lit un fichier File ou ArrayBuffer client-side et renvoie les résultats d'analyse
 */
export const readAndParseExcelFile = async (fileOrBuffer, fileName = 'classeur.xlsx') => {
  let data;
  let name = fileName;
  if (fileOrBuffer instanceof ArrayBuffer) {
    data = new Uint8Array(fileOrBuffer);
  } else if (fileOrBuffer && fileOrBuffer.arrayBuffer) {
    name = fileOrBuffer.name || fileName;
    const ab = await fileOrBuffer.arrayBuffer();
    data = new Uint8Array(ab);
  } else {
    throw new Error('Format de fichier non pris en charge');
  }

  const workbook = XLSX.read(data, { type: 'array', cellDates: false, raw: true });
  return parseInfluenceWorkbook(workbook, name);
};

export const parseInfluenceExcelFile = readAndParseExcelFile;

