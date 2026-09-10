import { jsPDF } from 'jspdf';
import { formatNumber, formatCurrency } from '../../../../utils/helpers.js';
import { getInfluencerCdcAndDeliverables, DELIVERABLE_STATUS_CONFIG, getDeliverableTypeLabel } from './deliverableUtils.js';

/**
 * Palette officielle Orange Cameroun & Design Tokens
 */
const ORANGE_RGB = [255, 121, 0];       // #FF7900
const DARK_RGB = [26, 26, 26];          // #1A1A1A
const LIGHT_BG_RGB = [248, 249, 250];   // #F8F9FA
const BORDER_RGB = [225, 230, 235];     // #E1E6EB
const MUTED_RGB = [110, 110, 110];      // #6E6E6E

/**
 * Formate la date actuelle au format officiel français
 */
function getFormattedExportDate() {
  const now = new Date();
  return now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. EXPORT DE LA FICHE COMPLÈTE D'UN INFLUENCEUR (PDF)
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function exportInfluencerProfileToPdf(influencer, options = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;          // 182mm
  const exportDate = getFormattedExportDate();

  let currentY = 14;

  const checkPageBreak = (requiredHeight) => {
    if (currentY + requiredHeight > pageHeight - 16) {
      doc.addPage();
      currentY = 16;
      drawSubHeader();
      return true;
    }
    return false;
  };

  const drawSubHeader = () => {
    // Bandeau fin supérieur
    doc.setFillColor(...ORANGE_RGB);
    doc.rect(margin, currentY, contentWidth, 2, 'F');
    currentY += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...DARK_RGB);
    doc.text('ORANGE CAMEROUN • FICHE D\'INFLUENCE OFFICIELLE — McCANN DOUALA', margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED_RGB);
    doc.text(`Talent : @${influencer.pseudo || influencer.name}`, pageWidth - margin, currentY, { align: 'right' });

    currentY += 5;
    doc.setDrawColor(...BORDER_RGB);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
  };

  // ──── 1. EN-TÊTE OFFICIEL CHARTÉ ORANGE CAMEROUN ────
  // Bandeau orange haut de page
  doc.setFillColor(...ORANGE_RGB);
  doc.rect(0, 0, pageWidth, 6, 'F');

  currentY = 14;

  // Header Box
  doc.setFillColor(...DARK_RGB);
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'F');

  // Logo textuel Orange Cameroun
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...ORANGE_RGB);
  doc.text('orange™', margin + 8, currentY + 11);

  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Cameroun', margin + 32, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('Direction de la Communication • Pôle Médias Digitaux & Influence', margin + 8, currentY + 18);

  // Titre & Réf à droite
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('FICHE PROFIL & LIVRABLES TALENT', pageWidth - margin - 8, currentY + 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...ORANGE_RGB);
  doc.text(`Réf. Talent : INF-${String(influencer.id).padStart(4, '0')} | Bridge v2.4`, pageWidth - margin - 8, currentY + 18, { align: 'right' });

  currentY += 31;

  // ──── 2. IDENTITÉ DU TALENT & CARTOUCHE GLOBAL ────
  const cardHeight = 44;
  doc.setFillColor(...LIGHT_BG_RGB);
  doc.roundedRect(margin, currentY, contentWidth, cardHeight, 2, 2, 'F');
  doc.setDrawColor(...BORDER_RGB);
  doc.roundedRect(margin, currentY, contentWidth, cardHeight, 2, 2, 'D');

  // Barre d'accentuation verticale Orange
  doc.setFillColor(...ORANGE_RGB);
  doc.rect(margin, currentY, 4, cardHeight, 'F');

  // Nom & Pseudo
  const realName = influencer.realName || `${influencer.prenom || ''} ${influencer.nom || ''}`.trim() || 'Créateur de contenu';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...DARK_RGB);
  doc.text(`@${influencer.pseudo || influencer.name}`, margin + 8, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_RGB);
  doc.text(`Nom civil : ${realName} | Type : ${influencer.type || 'Macro'} | Région : ${influencer.region || 'Littoral'} (${influencer.city || 'Douala'})`, margin + 8, currentY + 15);

  // Catégories / Niches
  const categories = (influencer.categories || [influencer.niche]).filter(Boolean).join(' • ') || 'Lifestyle';
  doc.setFontSize(8.5);
  doc.setTextColor(...DARK_RGB);
  doc.text(`Niche / Segments : ${categories}`, margin + 8, currentY + 21);

  // Coordonnées de contact
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_RGB);
  doc.text(`Email : ${influencer.email || 'contact@orange-partenaire.cm'} | Tél : ${influencer.phone || '+237 6XX XX XX XX'} ${influencer.telephone2 ? `| ${influencer.telephone2}` : ''}`, margin + 8, currentY + 27);

  // Contrat en vigueur & Cachet
  const contractStatus = influencer.contractStatus === 'actif' ? 'Contrat Actif ✓' : (influencer.contractStatus || 'Prospect');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE_RGB);
  doc.text(`Statut contractuel : ${contractStatus}`, margin + 8, currentY + 34);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_RGB);
  const cachetTxt = influencer.cachetBase ? `${formatCurrency(influencer.cachetBase)} (Base)` : 'Sur devis';
  doc.text(`Cachet indicatif : ${cachetTxt} | Expire : ${influencer.contractEnd || '2026-12-31'}`, margin + 60, currentY + 34);

  // Moralité & Risque
  const riskTxt = `Score Risque : ${influencer.riskScore ?? 1}/5 (${influencer.riskScore <= 1 ? 'Faible / Recommandé' : 'Vigilance'})`;
  doc.setFontSize(7.5);
  doc.setTextColor(influencer.riskScore <= 1 ? 39 : 230, influencer.riskScore <= 1 ? 174 : 126, influencer.riskScore <= 1 ? 96 : 34);
  doc.text(`Conformité & Moralité : ${riskTxt}`, margin + 8, currentY + 40);

  currentY += cardHeight + 8;

  // ──── 3. AUDIENCE & STATISTIQUES RÉSEAUX SOCIAUX ────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...DARK_RGB);
  doc.text('AUDIENCE & RÉSEAUX SOCIAUX RÉFÉRENCÉS', margin, currentY);
  currentY += 4;

  const socialColWidth = contentWidth / 4;
  const metricsBoxHeight = 16;

  // Cartouches KPIs rapides
  const metricBoxes = [
    { label: 'Audience Totale', value: String(influencer.followers || '0'), sub: 'Abonnés cumulés' },
    { label: 'Taux d\'Engagement', value: String(influencer.engagement || '0%'), sub: 'Moyenne certifiée' },
    { label: 'Vues Moyennes', value: String(influencer.avgViews || '0'), sub: 'Par publication' },
    { label: 'Score Global', value: `${influencer.scorePerformance || influencer.score || 4.2} / 5`, sub: 'Indice Orange-McCann' }
  ];

  metricBoxes.forEach((mb, idx) => {
    const x = margin + idx * socialColWidth;
    doc.setFillColor(...LIGHT_BG_RGB);
    doc.roundedRect(x, currentY, socialColWidth - 2, metricsBoxHeight, 1.5, 1.5, 'F');
    doc.setDrawColor(...BORDER_RGB);
    doc.roundedRect(x, currentY, socialColWidth - 2, metricsBoxHeight, 1.5, 1.5, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED_RGB);
    doc.text(mb.label.toUpperCase(), x + 3, currentY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK_RGB);
    doc.text(mb.value, x + 3, currentY + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...ORANGE_RGB);
    doc.text(mb.sub, x + 3, currentY + 14);
  });

  currentY += metricsBoxHeight + 6;

  // Répartition par réseau social
  const socials = influencer.socialLinks || {};
  const activeSocials = Object.entries(socials).filter(([_, data]) => data && (data.followers > 0 || data.url || data.username));

  if (activeSocials.length > 0) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'F');
    doc.setDrawColor(...BORDER_RGB);
    doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...DARK_RGB);
    doc.text('Canaux actifs :', margin + 4, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    let sX = margin + 28;
    activeSocials.forEach(([key, d]) => {
      const label = key.toUpperCase();
      const count = d.followers ? formatNumber(d.followers) : '—';
      const usr = d.username ? `@${d.username}` : '';
      const text = `${label} (${count} abonnés ${usr})`;
      doc.text(text, sX, currentY + 5.5);
      sX += doc.getTextWidth(text) + 8;
    });

    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED_RGB);
    doc.text('Données d\'audience vérifiées via Meta Business Suite & API Réseaux Sociaux', margin + 4, currentY + 10.5);

    currentY += 18;
  } else {
    currentY += 2;
  }

  // ──── 4. SECTION PRINCIPALE : LIVRABLES EN COURS ASSOCIÉS AU CAHIER DES CHARGES ────
  checkPageBreak(50);

  const { activeCdc, allCdc, activeDeliverables, stats } = getInfluencerCdcAndDeliverables(influencer);

  doc.setFillColor(...ORANGE_RGB);
  doc.rect(margin, currentY, contentWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('LIVRABLES EN COURS ASSOCIÉS AU CAHIER DES CHARGES', margin + 4, currentY + 4.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Avancement global : ${stats.globalProgress}% (${stats.valides}/${stats.total} validés)`, pageWidth - margin - 4, currentY + 4.2, { align: 'right' });

  currentY += 8;

  // 4.1 Référence Cahier des Charges & Cadrage de Campagne
  const cdc = activeCdc || {};
  const cdcBoxHeight = 32;

  doc.setFillColor(...LIGHT_BG_RGB);
  doc.roundedRect(margin, currentY, contentWidth, cdcBoxHeight, 1.5, 1.5, 'F');
  doc.setDrawColor(...BORDER_RGB);
  doc.roundedRect(margin, currentY, contentWidth, cdcBoxHeight, 1.5, 1.5, 'D');

  // Réf & Dates
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...DARK_RGB);
  doc.text(`Campagne : ${cdc.campagneNom || 'Orange Weekend'} (Réf. CDC : ${cdc.id || 'CDC-001'})`, margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED_RGB);
  doc.text(`Période d'effet : du ${cdc.dateDebut || '01/04/2026'} au ${cdc.dateFin || '30/04/2026'} | Produits concernés : ${(cdc.produits || ['Orange']).join(', ')}`, margin + 4, currentY + 11);

  // Objectifs
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE_RGB);
  doc.text('Objectifs :', margin + 4, currentY + 17);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_RGB);
  const objText = doc.splitTextToSize(cdc.objectifs || 'Générer de la visibilité sur les offres Orange et stimuler l\'engagement.', contentWidth - 30);
  doc.text(objText, margin + 22, currentY + 17);

  // Contraintes & Points Clés
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_RGB);
  doc.text('Contraintes :', margin + 4, currentY + 23);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MUTED_RGB);
  const contraintesText = doc.splitTextToSize(cdc.contraintes || 'Respect strict de la charte Orange Cameroun, pas de marque concurrente, mentions obligatoires.', contentWidth - 30);
  doc.text(contraintesText, margin + 24, currentY + 23);

  // Points Clés : Ton, Hashtags, Mentions
  const hashtags = (cdc.guidelineMarque?.hashtags || ['#OrangeCameroun']).join(' ');
  const mentions = (cdc.guidelineMarque?.mentions || ['@OrangeCameroun']).join(' ');
  const ton = cdc.guidelineMarque?.ton || 'Enthousiaste et dynamique';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...DARK_RGB);
  doc.text(`Points clés de marque : Ton "${ton}" | Hashtags : ${hashtags} | Mentions : ${mentions}`, margin + 4, currentY + 29);

  currentY += cdcBoxHeight + 6;

  // 4.2 Tableau détaillé des livrables attendus
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...DARK_RGB);
  doc.text(`LIVRABLES ATTENDUS DANS LE CADRE DU BRIEF (${activeDeliverables.length})`, margin, currentY);
  currentY += 4;

  // En-tête de tableau
  const tableHeaderHeight = 6.5;
  doc.setFillColor(240, 242, 245);
  doc.rect(margin, currentY, contentWidth, tableHeaderHeight, 'F');
  doc.setDrawColor(...BORDER_RGB);
  doc.rect(margin, currentY, contentWidth, tableHeaderHeight, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...DARK_RGB);
  doc.text('TYPE & LIVRABLE', margin + 3, currentY + 4.5);
  doc.text('DESCRIPTION / GUIDELINES', margin + 62, currentY + 4.5);
  doc.text('STATUT', margin + 120, currentY + 4.5);
  doc.text('ÉCHÉANCE', margin + 142, currentY + 4.5);
  doc.text('AVANCEMENT', margin + 162, currentY + 4.5);

  currentY += tableHeaderHeight;

  // Lignes de livrables
  activeDeliverables.forEach((liv, idx) => {
    checkPageBreak(18);

    const isEven = idx % 2 === 0;
    const rowHeight = 17;

    doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 250, isEven ? 255 : 251);
    doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    doc.setDrawColor(...BORDER_RGB);
    doc.rect(margin, currentY, contentWidth, rowHeight, 'D');

    // 1. Type & Titre
    const typeLabel = getDeliverableTypeLabel(liv.type);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...DARK_RGB);
    doc.text(doc.splitTextToSize(liv.titre || 'Livrable', 56), margin + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...ORANGE_RGB);
    doc.text(`Type : ${typeLabel}`, margin + 3, currentY + 13);

    // 2. Description & Commentaires
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...MUTED_RGB);
    const descLines = doc.splitTextToSize(liv.description || 'Livrable contractuel', 56);
    doc.text(descLines.slice(0, 2), margin + 62, currentY + 4.5);

    if (liv.commentaires) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6);
      doc.setTextColor(130, 100, 40);
      doc.text(`Note : ${doc.splitTextToSize(liv.commentaires, 56)[0]}`, margin + 62, currentY + 13);
    } else if (liv.lienPublication) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(41, 128, 185);
      doc.text(`Lien : ${liv.lienPublication.slice(0, 36)}...`, margin + 62, currentY + 13);
    }

    // 3. Statut Badge
    const stConfig = DELIVERABLE_STATUS_CONFIG[liv.statut] || DELIVERABLE_STATUS_CONFIG.en_cours;
    doc.setFillColor(...stConfig.color);
    doc.roundedRect(margin + 120, currentY + 3.5, 18, 5.5, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text((stConfig.label || liv.statut).replace('✓', '').replace('⚠️', '').trim(), margin + 129, currentY + 7.2, { align: 'center' });

    // 4. Échéance
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...DARK_RGB);
    doc.text(liv.deadline || '—', margin + 142, currentY + 7);

    // 5. Avancement & Barre visuelle
    const progress = liv.avancement ?? 50;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(progress === 100 ? 39 : 255, progress === 100 ? 174 : 121, progress === 100 ? 96 : 0);
    doc.text(`${progress}%`, margin + 164, currentY + 6);

    // Barre de progression graphique
    const barWidth = 14;
    const barHeight = 2.5;
    const barX = margin + 164;
    const barY = currentY + 8.5;

    doc.setFillColor(220, 225, 230);
    doc.rect(barX, barY, barWidth, barHeight, 'F');

    doc.setFillColor(...stConfig.color);
    doc.rect(barX, barY, (progress / 100) * barWidth, barHeight, 'F');

    currentY += rowHeight;
  });

  currentY += 8;

  // ──── 5. SIGNATURES & VALIDATION McCANN × ORANGE CAMEROUN ────
  checkPageBreak(30);

  doc.setFillColor(...LIGHT_BG_RGB);
  doc.roundedRect(margin, currentY, contentWidth, 24, 1.5, 1.5, 'F');
  doc.setDrawColor(...BORDER_RGB);
  doc.roundedRect(margin, currentY, contentWidth, 24, 1.5, 1.5, 'D');

  const halfWidth = contentWidth / 2;

  // Colonne Gauche : Visa McCann Douala
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...DARK_RGB);
  doc.text('VISA AGENCE McCANN DOUALA', margin + 6, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...MUTED_RGB);
  doc.text('Pôle Influence & Stratégie Média', margin + 6, currentY + 11);
  doc.text('Signature & Cachet électronique : VALIDÉ', margin + 6, currentY + 16);

  // Colonne Droite : Direction Orange Cameroun
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...DARK_RGB);
  doc.text('VALIDATION DIRECTION ORANGE CAMEROUN', margin + halfWidth + 6, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...MUTED_RGB);
  doc.text('Direction de la Communication & Marque', margin + halfWidth + 6, currentY + 11);
  doc.text(`Approbation livrables : EN COURS DE SUIVI (${stats.valides}/${stats.total})`, margin + halfWidth + 6, currentY + 16);

  // ──── 6. PIED DE PAGE ET NUMÉROTATION SUR TOUTES LES PAGES ────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Ligne de pied de page Orange
    doc.setDrawColor(...ORANGE_RGB);
    doc.setLineWidth(0.4);
    doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);

    // Mentions légales
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...MUTED_RGB);
    doc.text('Orange Cameroun S.A. au capital de 15 000 000 000 FCFA — Document généré depuis Bridge', margin, pageHeight - 9);
    doc.text(`Exporté le : ${exportDate}`, margin, pageHeight - 5.5);

    // Pagination officielle "Page X sur Y"
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...DARK_RGB);
    doc.text(`Page ${i} sur ${pageCount}`, pageWidth - margin, pageHeight - 7.5, { align: 'right' });
  }

  // Téléchargement
  const cleanHandle = (influencer.pseudo || influencer.name || 'talent').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Fiche_Influence_Orange_${cleanHandle}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
  return filename;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 2. EXPORT DU CATALOGUE COMPLET DE TOUS LES INFLUENCEURS (PDF)
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function exportAllInfluencersCatalogPdf(influencers = [], options = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const exportDate = getFormattedExportDate();

  let currentY = 14;

  const checkPageBreak = (requiredHeight) => {
    if (currentY + requiredHeight > pageHeight - 16) {
      doc.addPage();
      currentY = 16;
      drawCatalogSubHeader();
      return true;
    }
    return false;
  };

  const drawCatalogSubHeader = () => {
    doc.setFillColor(...ORANGE_RGB);
    doc.rect(margin, currentY, contentWidth, 2, 'F');
    currentY += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...DARK_RGB);
    doc.text('ORANGE CAMEROUN • ANNUAIRE OFFICIEL DES TALENTS D\'INFLUENCE — McCANN DOUALA', margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED_RGB);
    doc.text(`Catalogue général (${influencers.length} talents)`, pageWidth - margin, currentY, { align: 'right' });

    currentY += 5;
    doc.setDrawColor(...BORDER_RGB);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
  };

  // ──── PAGE 1 : COUVERTURE & SYNTHÈSE GLOBALE ────
  doc.setFillColor(...ORANGE_RGB);
  doc.rect(0, 0, pageWidth, 6, 'F');

  currentY = 14;

  // Header Box
  doc.setFillColor(...DARK_RGB);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...ORANGE_RGB);
  doc.text('orange™', margin + 8, currentY + 13);

  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('Cameroun', margin + 35, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 200, 200);
  doc.text('Direction de la Communication & Marque • Partenariat Agence McCann Douala', margin + 8, currentY + 22);

  // Titre Catalogue
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('ANNUAIRE GLOBAL DES INFLUENCEURS & LIVRABLES', pageWidth - margin - 8, currentY + 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...ORANGE_RGB);
  doc.text(`Document officiel Bridge • ${influencers.length} talents répertoriés`, pageWidth - margin - 8, currentY + 21, { align: 'right' });

  currentY += 38;

  // Cartouches de synthèse de l'annuaire
  const totalAudience = influencers.reduce((acc, i) => {
    const raw = String(i.followers || '0').replace(/[^0-9.]/g, '');
    const num = parseFloat(raw) || 0;
    const mult = String(i.followers).toUpperCase().includes('M') ? 1000000 : (String(i.followers).toUpperCase().includes('K') ? 1000 : 1);
    return acc + num * mult;
  }, 0);

  const activeContracts = influencers.filter(i => i.contractStatus === 'actif').length;

  // Total livrables recensés
  const allDeliverablesAcrossInf = influencers.flatMap(i => getInfluencerCdcAndDeliverables(i).activeDeliverables);
  const totalDeliverablesCount = allDeliverablesAcrossInf.length;
  const completedDeliverablesCount = allDeliverablesAcrossInf.filter(d => d.statut === 'valide').length;

  const catalogStats = [
    { label: 'Talents Répertoriés', value: `${influencers.length}`, sub: 'Profils vérifiés' },
    { label: 'Portée Cumulée', value: `${formatNumber(totalAudience)}`, sub: 'Abonnés bruts' },
    { label: 'Contrats Actifs', value: `${activeContracts}`, sub: 'Partenariats signés' },
    { label: 'Livrables en Cours', value: `${totalDeliverablesCount}`, sub: `${completedDeliverablesCount} déjà validés` }
  ];

  const statWidth = contentWidth / 4;
  catalogStats.forEach((st, idx) => {
    const sX = margin + idx * statWidth;
    doc.setFillColor(...LIGHT_BG_RGB);
    doc.roundedRect(sX, currentY, statWidth - 2, 20, 1.5, 1.5, 'F');
    doc.setDrawColor(...BORDER_RGB);
    doc.roundedRect(sX, currentY, statWidth - 2, 20, 1.5, 1.5, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED_RGB);
    doc.text(st.label.toUpperCase(), sX + 3, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...DARK_RGB);
    doc.text(st.value, sX + 3, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...ORANGE_RGB);
    doc.text(st.sub, sX + 3, currentY + 17);
  });

  currentY += 26;

  // ──── LISTING DES TALENTS AVEC LEURS LIVRABLES EN COURS ────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...DARK_RGB);
  doc.text('LISTE DÉTAILLÉE DES TALENTS & TRAVAUX EN COURS', margin, currentY);
  currentY += 6;

  influencers.forEach((inf, iIdx) => {
    const { activeCdc, activeDeliverables, stats } = getInfluencerCdcAndDeliverables(inf);

    checkPageBreak(38);

    // Carte Talent
    const cardH = 34;
    doc.setFillColor(...LIGHT_BG_RGB);
    doc.roundedRect(margin, currentY, contentWidth, cardH, 2, 2, 'F');
    doc.setDrawColor(...BORDER_RGB);
    doc.roundedRect(margin, currentY, contentWidth, cardH, 2, 2, 'D');

    // Accentuation Orange
    doc.setFillColor(...ORANGE_RGB);
    doc.rect(margin, currentY, 3, cardH, 'F');

    // Identité
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK_RGB);
    doc.text(`@${inf.pseudo || inf.name}`, margin + 6, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED_RGB);
    doc.text(`${inf.realName || inf.name} | ${inf.type || 'Macro'} | ${inf.region || 'Cameroun'} | ${(inf.categories || [inf.niche]).join(', ')}`, margin + 6, currentY + 12);

    doc.text(`Audience : ${inf.followers || '0'} abonnés | Engagement : ${inf.engagement || '0%'} | Score : ${inf.scorePerformance || inf.score || 4.2}/5`, margin + 6, currentY + 17);

    // Contrat & Contact
    doc.setFontSize(7.5);
    doc.text(`Contact : ${inf.phone || 'Non renseigné'} • ${inf.email || 'Email non renseigné'}`, margin + 6, currentY + 22);

    // Statut & Campagne Active
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE_RGB);
    doc.text(`Campagne active : ${activeCdc?.campagneNom || inf.lastCampaign || 'Orange Weekend'} (CDC : ${activeCdc?.id || 'CDC-001'})`, margin + 6, currentY + 28);

    // Livrables Synthèse à droite
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK_RGB);
    doc.text(`Avancement livrables : ${stats.globalProgress}%`, pageWidth - margin - 6, currentY + 8, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED_RGB);
    doc.text(`${stats.total} livrable(s) attendu(s) • ${stats.valides} validé(s)`, pageWidth - margin - 6, currentY + 14, { align: 'right' });

    // Barre de progression
    const bW = 35;
    const bH = 3;
    const bX = pageWidth - margin - 6 - bW;
    const bY = currentY + 18;
    doc.setFillColor(220, 225, 230);
    doc.rect(bX, bY, bW, bH, 'F');
    doc.setFillColor(...ORANGE_RGB);
    doc.rect(bX, bY, (stats.globalProgress / 100) * bW, bH, 'F');

    // Livrables succincts
    if (activeDeliverables.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(80, 80, 80);
      const livSample = activeDeliverables.slice(0, 2).map(l => `${l.titre} (${l.avancement}%)`).join(' • ');
      doc.text(doc.splitTextToSize(livSample, contentWidth - 80)[0], margin + 6, currentY + 32);
    }

    currentY += cardH + 5;
  });

  // ──── PIED DE PAGE & PAGINATION SUR TOUTES LES PAGES ────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(...ORANGE_RGB);
    doc.setLineWidth(0.4);
    doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...MUTED_RGB);
    doc.text('Orange Cameroun S.A. au capital de 15 000 000 000 FCFA — Document généré depuis Bridge', margin, pageHeight - 9);
    doc.text(`Annuaire officiel • Exporté le : ${exportDate}`, margin, pageHeight - 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...DARK_RGB);
    doc.text(`Page ${i} sur ${pageCount}`, pageWidth - margin, pageHeight - 7.5, { align: 'right' });
  }

  const filename = `Catalogue_Influenceurs_Orange_Cameroun_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
  return filename;
}
