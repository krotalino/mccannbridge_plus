const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const wb = xlsx.utils.book_new();

// ─── Sheet 1: INFLUENCEURS ───
const sheet1Data = [
  ['RÉPERTOIRE INFLUENCEURS & HISTORIQUE DES LIVRABLES (OCTOBRE - DÉCEMBRE 2025)'],
  ['Influenceur', 'Facebook', 'Instagram', 'TikTok'],
  ['Carles Antonio', 'https://facebook.com/carlesantonio.officiel', 'https://instagram.com/carles_antonio', 'https://tiktok.com/@carlesantonio'],
  ['Simplest Tuthi', 'https://facebook.com/simplest.tuthi.page', 'https://instagram.com/simplest_tuthi', 'https://tiktok.com/@simplesttuthi'],
  ['Queen Diva', 'https://facebook.com/queendiva.officiel', 'https://instagram.com/queen_diva_cm', 'https://tiktok.com/@queendivaofficiel'],
  ['Blanche Bahoken', 'https://facebook.com/blanche.bahoken', 'https://instagram.com/blanchebahoken', 'https://tiktok.com/@blanche_bahoken'],
  ['Mayole Francine', 'https://facebook.com/mayole.francine.officiel', 'https://instagram.com/mayole_francine', 'https://tiktok.com/@mayolefrancine'],
  ['Bk Baptist', 'https://facebook.com/bk.baptist.page', 'https://instagram.com/bk_baptist', 'https://tiktok.com/@bkbaptist'],
  [],
  ['HISTORIQUE DES LIVRABLES ET STATUTS DE DIFFUSION PAR CRÉATEUR'],
  ['Influenceur', 'Cahier des charges', 'Période', 'Sujet', 'Date', 'Type de contenu', 'Lien du post', 'Vues', 'Likes', 'Commentaires', 'Partages'],
  
  // Bloc Carles Antonio
  ['Carles Antonio', '1 post / semaine', 'MOIS D\'OCTOBRE', 'Welcome pack', '2025-10-12', 'VIDEO', 'https://tiktok.com/@carlesantonio/video/72891234567', 84500, 4200, 310, 180],
  ['', '', 'Semaine du 13 au 19 Oct', 'Orange Money', 'Friday, October 17, 2025', 'IMAGE', 'https://facebook.com/carlesantonio.officiel/posts/1029384756', 32000, 1450, 95, 40],
  ['', '', 'MOIS DE NOVEMBRE', '', '', '', '', null, null, null, null], // Intertitre à ignorer
  ['', '', 'Semaine du 03 au 09 Nov', 'Orange Cameroon', '2025-11-07', 'VIDEO', 'https://instagram.com/reel/DC19827364/', 120000, 8900, 620, 450],
  ['', '', 'Semaine du 24 au 30 Nov', 'Orange Money', '2025-11-28', 'IMAGE', 'https://facebook.com/carlesantonio.officiel/posts/1029384799', 28000, 980, 60, 25],
  ['', '', 'MOIS DE DECEMBRE', '', '', '', '', null, null, null, null], // Intertitre à ignorer
  ['', '', 'Semaine du 08 au 14 Dec', 'Orange Cameroon', '2025-12-12', 'VIDEO', 'https://tiktok.com/@carlesantonio/video/72987654321', 95000, 5400, 420, 210],
  ['', '', 'Semaine du 22 au 28 Dec', 'End Of Year', '2025-12-24', 'IMAGE', 'https://instagram.com/p/DD29384756/', 45000, 2100, 180, 90],
  ['Sous-total Carles Antonio', '', '', '', '', '', '', 404500, 23030, 1685, 995], // Sous-total à ignorer

  // Bloc Simplest Tuthi
  ['Simplest Tuthi', '1 post / semaine', 'MOIS D\'OCTOBRE', 'Orange Story Time Challenge', '2025-10-18', 'VIDEO', 'https://tiktok.com/@simplesttuthi/video/72899988776', 145000, 9800, 850, 620],
  ['', '', 'Semaine du 20 au 26 Oct', 'Orange Money', '2025-10-24', 'IMAGE', 'https://facebook.com/simplest.tuthi.page/posts/5544332211', 38000, 1850, 140, 80],
  ['', '', 'MOIS DE NOVEMBRE', 'Orange Story Time Challenge', 'Friday, November 14, 2025', 'VIDEO', 'https://instagram.com/reel/DC99221133/', 180000, 14200, 1100, 950],
  ['', '', 'Semaine du 24 au 30 Nov', 'Orange Cameroon', '2025-11-27', 'VIDEO', 'https://tiktok.com/@simplesttuthi/video/72911223344', 110000, 7600, 580, 390],
  ['', '', 'MOIS DE DECEMBRE', 'End Of Year', '2025-12-19', 'IMAGE', 'https://facebook.com/simplest.tuthi.page/posts/5544339900', 42000, 2100, 190, 110],
  ['Sous-total Simplest Tuthi', '', '', '', '', '', '', 515000, 35550, 2860, 2150],

  // Bloc Queen Diva
  ['Queen Diva', '1 post / semaine', 'MOIS DE NOVEMBRE', 'Orange Story Time Challenge', '2025-11-10', 'VIDEO', 'https://tiktok.com/@queendivaofficiel/video/72901122334', 210000, 16500, 1400, 1200],
  ['', '', 'Semaine du 17 au 23 Nov', '#DreamList', '2025-11-21', 'IMAGE', 'https://instagram.com/p/DC44556677/', 58000, 3400, 280, 160],
  ['', '', 'MOIS DE DECEMBRE', '#DreamList', '2025-12-05', 'VIDEO', 'https://tiktok.com/@queendivaofficiel/video/72955667788', 190000, 13800, 950, 810],
  ['', '', 'Semaine du 15 au 21 Dec', 'End Of Year', '2025-12-18', 'IMAGE', 'https://facebook.com/queendiva.officiel/posts/7788990011', 65000, 3900, 310, 220],

  // Bloc Blanche Bahoken
  ['Blanche Bahoken', '1 post / semaine', 'MOIS D\'OCTOBRE', 'Welcome pack', '2025-10-25', 'IMAGE', 'https://instagram.com/p/DB11223344/', 36000, 2200, 140, 75],
  ['', '', 'MOIS DE NOVEMBRE', 'Orange Money', '2025-11-12', 'VIDEO', 'https://facebook.com/blanche.bahoken/videos/8899112233', 78000, 4900, 340, 190],
  ['', '', 'Semaine du 17 au 23 Nov', 'Orange Cameroon', '2025-11-20', 'VIDEO', 'https://tiktok.com/@blanche_bahoken/video/72922334455', 105000, 7100, 520, 340],
  ['', '', 'MOIS DE DECEMBRE', 'End Of Year', '2025-12-15', 'IMAGE', 'https://instagram.com/p/DD33445566/', 51000, 2900, 210, 130],

  // Bloc Mayole Francine
  ['Mayole Francine', '1 post / semaine', 'MOIS D\'OCTOBRE', 'Orange Story Time Challenge', '2025-10-29', 'VIDEO', 'https://tiktok.com/@mayolefrancine/video/72895566778', 165000, 12400, 1050, 890],
  ['', '', 'MOIS DE NOVEMBRE', 'Welcome pack', '2025-11-08', 'IMAGE', 'https://instagram.com/p/DC11224455/', 42000, 2800, 195, 110],
  ['', '', 'Semaine du 17 au 23 Nov', 'Orange Money', '2025-11-22', 'VIDEO', 'https://facebook.com/mayole.francine.officiel/videos/6677889900', 92000, 6300, 480, 310],

  // Bloc Bk Baptist
  ['Bk Baptist', '1 post / semaine', 'MOIS DE NOVEMBRE', 'Orange Money', '2025-11-15', 'VIDEO', 'https://tiktok.com/@bkbaptist/video/72906677889', 135000, 8900, 710, 480],
  ['', '', 'Semaine du 24 au 30 Nov', '#DreamList', '2025-11-29', 'IMAGE', 'https://facebook.com/bk.baptist.page/posts/4455667788', 34000, 1700, 130, 65],
  ['', '', 'MOIS DE DECEMBRE', '#DreamList', '2025-12-10', 'VIDEO', 'https://instagram.com/reel/DD11556677/', 148000, 10500, 820, 610],
  ['', '', 'Semaine du 15 au 21 Dec', 'End Of Year', '2025-12-20', 'IMAGE', 'https://tiktok.com/@bkbaptist/video/72977889900', 89000, 5200, 390, 240]
];

const ws1 = xlsx.utils.aoa_to_sheet(sheet1Data);
xlsx.utils.book_append_sheet(wb, ws1, 'INFLUENCEURS');

// ─── Sheet 2: Orange Weekend ───
const sheet2Data = [
  ['REPORTING DE CAMPAGNE — ORANGE WEEKEND (UGC & PAGES RELAIS)'],
  ['Influenceur / Page', 'Lien', 'Likes', 'Commentaires', 'Partages', 'Engagement', 'Vues', 'Type de contenu', 'Source'],
  ['POST VISUEL EVENT', '', '', '', '', '', '', '', ''],
  ['Le Tarmac CM', 'https://facebook.com/letarmaccm/posts/891234567', 1200, 180, 95, 1475, 28000, 'IMAGE', 'Facebook'],
  ['Buzz 237', 'https://facebook.com/buzz237officiel/posts/782345678', 2400, 310, 210, 2920, 45000, 'IMAGE', 'Facebook'],
  ['RECAP VIDEO CONFERENCE', '', '', '', '', '', '', '', ''],
  ['Douala Vibes', 'https://tiktok.com/@doualavibes/video/72881122334', 8500, 620, 480, 9600, 115000, 'VIDEO', 'TikTok'],
  ['Cameroun Web Infos', 'https://facebook.com/camerounwebinfos/videos/9988776655', 4100, 390, 280, 5000, 62000, 'VIDEO', 'Facebook'],
  ['POST MOBILISATION', '', '', '', '', '', '', '', ''],
  ['Carles Antonio', 'https://instagram.com/p/DC88776655/', 6200, 410, 310, 6920, 82000, 'IMAGE', 'Instagram'],
  ['Mayole Francine', 'https://tiktok.com/@mayolefrancine/video/72889900112', 11500, 920, 740, 13160, 142000, 'VIDEO', 'TikTok'],
  ['Simplest Tuthi', 'https://tiktok.com/@simplesttuthi/video/72884455667', 9800, 780, 590, 11170, 128000, 'VIDEO', 'TikTok'],
  ['Queen Diva', 'https://facebook.com/queendiva.officiel/posts/6677881122', 5400, 480, 320, 6200, 74000, 'IMAGE', 'Facebook'],
  ['Blanche Bahoken', 'https://instagram.com/reel/DC55667788/', 7900, 540, 380, 8820, 96000, 'VIDEO', 'Instagram'],
  ['Bk Baptist', 'https://tiktok.com/@bkbaptist/video/72887788990', 8200, 610, 430, 9240, 108000, 'VIDEO', 'TikTok'],
  ['Post Relais Yaoundé', 'https://facebook.com/relaisyaounde/posts/3344556677', null, null, null, null, 18000, 'POST', 'Facebook'],
  ['Post Relais Ouest', 'https://facebook.com/relaisouest/posts/2233445566', 450, 30, 0, 480, 12000, 'POST', 'Facebook']
];

const ws2 = xlsx.utils.aoa_to_sheet(sheet2Data);
xlsx.utils.book_append_sheet(wb, ws2, 'Orange Weekend');

// ─── Sheet 3: O'Ambassadeurs ───
const sheet3Data = [
  ['Noms', 'Prénoms', 'Pseudo', 'Lien du profil'],
  ['KAMGA', 'Stéphane', '@steph_k', 'https://facebook.com/stephane.kamga.amb'],
  ['NDONGO', 'Danielle', '@dani_nd', 'https://instagram.com/dani_nd_amb'],
  ['TCHOUA', 'Boris', '@boris_t', 'https://tiktok.com/@boris_tchoua'],
  ['BELLA', 'Marie-Claire', '@bella_mc', 'https://facebook.com/marieclaire.bella'],
  ['ABENA', 'Marc Aurèle', '@marco_ab', 'https://instagram.com/marco_abena'],
  ['MVONGO', 'Cédric', '@ced_mv', 'https://facebook.com/cedric.mvongo'],
  ['FOTSO', 'Kévin', '@kev_fotso', 'https://tiktok.com/@kevin_fotso'],
  ['EBWELE', 'Raïssa', '@raissa_eb', 'https://instagram.com/raissa_ebwele'],
  ['BIYA', 'Christian', '@chris_b', 'https://facebook.com/christian.biya.amb'],
  ['NGUEMA', 'Patrick', '@pat_nguema', 'https://tiktok.com/@patrick_nguema'],
  ['OWONA', 'Jeanne', '@jeanne_ow', 'https://facebook.com/jeanne.owona.amb'],
  ['TALLA', 'Thierry', '@thierry_t', 'https://instagram.com/thierry_talla'],
  ['SOH', 'Estelle', '@estelle_soh', 'https://tiktok.com/@estelle_soh'],
  ['BINDZI', 'Arthur', '@arthur_b', 'https://facebook.com/arthur.bindzi'],
  ['EKANE', 'Mireille', '@mimi_ekane', 'https://instagram.com/mimi_ekane']
];

const ws3 = xlsx.utils.aoa_to_sheet(sheet3Data);
xlsx.utils.book_append_sheet(wb, ws3, "O'Ambassadeurs");

// ─── Sheet 4: O'Ambassadeurs (2) ───
const sheet4Data = [
  ['Noms', 'Prénoms', 'Pseudo', 'Lien du profil'],
  ['KAMGA', 'Stéphane', '@steph_k', 'https://facebook.com/stephane.kamga.amb'],
  ['NDONGO', 'Danielle', '@dani_nd', 'https://instagram.com/dani_nd_amb'],
  ['BELLA', 'Marie Claire', '@bella_mc', 'https://facebook.com/marieclaire.bella'],
  ['FOTSO', 'Kevin', '@kev_fotso', 'https://tiktok.com/@kevin_fotso'],
  ['MANGA', 'Rodrigue', '@rodrigue_m', 'https://facebook.com/rodrigue.manga'],
  ['NOUBI', 'Patricia', '@patou_noubi', 'https://instagram.com/patou_noubi'],
  ['ATANGANA', 'Lucas', '@lucas_at', 'https://tiktok.com/@lucas_atangana'],
  ['EPOPA', 'Vanessa', '@vane_epopa', 'https://facebook.com/vanessa.epopa']
];

const ws4 = xlsx.utils.aoa_to_sheet(sheet4Data);
xlsx.utils.book_append_sheet(wb, ws4, "O'Ambassadeurs (2)");

// ─── Sheet 5: ADMINS O Ambassadeurs ───
const sheet5Data = [
  ['Nom / Groupe', 'Lien de profil', 'Contact'],
  ['Groupe 1 - Paulin Mbia', 'https://facebook.com/paulin.mbia', '+237 699 01 23 45'],
  ['Groupe 2 - Nadine Ngo Bell', 'https://facebook.com/nadine.ngobell', '+237 695 12 34 56'],
  ['Groupe 3 - Eric Tsamo', 'https://facebook.com/eric.tsamo', '+237 677 23 45 67'],
  ['Groupe 4 - Carine Mengue', 'https://facebook.com/carine.mengue', '+237 690 34 56 78'],
  ['Groupe 5 - Landry Onana', 'https://facebook.com/landry.onana', '+237 675 45 67 89'],
  ['Groupe 6 - Sandrine Biyebe', 'https://facebook.com/sandrine.biyebe', '+237 691 56 78 90'],
  ['Groupe 7 - Fabrice Ekotto', 'https://facebook.com/fabrice.ekotto', '+237 678 67 89 01'],
  ['Groupe 8 - Valérie Tagne', 'https://facebook.com/valerie.tagne', '+237 694 78 90 12']
];

const ws5 = xlsx.utils.aoa_to_sheet(sheet5Data);
xlsx.utils.book_append_sheet(wb, ws5, 'ADMINS O Ambassadeurs');

// ─── Sheet 6: WEBZINES ───
const sheet6Data = [
  ['Nom', 'Lien de la page', 'Lien de publication'],
  ['CamerounWeb', 'https://camerounweb.com', 'https://camerounweb.com/actu/orange-weekend-succes'],
  ['ActuCameroun', 'https://actucameroun.com', 'https://actucameroun.com/orange-money-innovation'],
  ['Culturebene', 'https://culturebene.com', 'https://culturebene.com/orange-story-time-challenge'],
  ['Laura Dave Média', 'https://lauradavemedia.com', 'https://lauradavemedia.com/dreamlist-orange-cameroun'],
  ['Lebledparle', 'https://lebledparle.com', 'https://lebledparle.com/orange-cameroun-end-of-year-2025'],
  ['Digital Business Africa', 'https://digitalbusiness.africa', 'https://digitalbusiness.africa/orange-money-services']
];

const ws6 = xlsx.utils.aoa_to_sheet(sheet6Data);
xlsx.utils.book_append_sheet(wb, ws6, 'WEBZINES');

// Write out to root and public/
const filename = 'Fichier-Reporting-Influence_5734.xlsx';
const rootPath = path.resolve(__dirname, '..', filename);
const publicPath = path.resolve(__dirname, '..', 'public', filename);

xlsx.writeFile(wb, rootPath);
xlsx.writeFile(wb, publicPath);
console.log('Successfully generated:', rootPath);
console.log('Successfully generated:', publicPath);
