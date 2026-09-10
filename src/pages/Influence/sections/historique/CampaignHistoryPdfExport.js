import { jsPDF } from 'jspdf';
import { formatNumber, formatCurrency } from '../../../../utils/helpers.js';

/**
 * Génère et télécharge un rapport PDF charté Orange Cameroun pour un ou plusieurs historiques de campagnes d'un influenceur.
 * @param {Object} influencer - Objet influenceur complet
 * @param {Array} campaigns - Liste des campagnes à inclure (toutes ou sélectionnée)
 * @param {Object} options - Options supplémentaires { titleSuffix, singleCampaign }
 */
export function exportCampaignHistoryToPdf(influencer, campaigns = [], options = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  let currentY = 14;

  const checkPageBreak = (requiredHeight) => {
    if (currentY + requiredHeight > pageHeight - 16) {
      doc.addPage();
      currentY = 16;
      drawHeaderSmall();
      return true;
    }
    return false;
  };

  const drawHeaderSmall = () => {
    doc.setFillColor(255, 121, 0); // Orange #FF7900
    doc.rect(margin, currentY, contentWidth, 2, 'F');
    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('ORANGE CAMEROUN • RAPPORT HISTORIQUE D\'INFLUENCE — McCANN DOUALA', margin, currentY);
    doc.text(`Influenceur : ${influencer.pseudo || influencer.name}`, pageWidth - margin, currentY, { align: 'right' });
    currentY += 6;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
  };

  // ──────────────── 1. EN-TÊTE OFFICIEL CHARTÉ ORANGE CAMEROUN ────────────────
  // Bandeau orange supérieur
  doc.setFillColor(255, 121, 0); // #FF7900
  doc.rect(0, 0, pageWidth, 6, 'F');

  currentY = 14;

  // Header Box
  doc.setFillColor(26, 26, 26); // Dark #1A1A1A
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'F');

  // Logo textuel Orange Cameroun
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 121, 0); // Orange
  doc.text('orange™', margin + 8, currentY + 11);

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Cameroun', margin + 30, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('Direction de la Communication, de la Marque & de l\'Engagement', margin + 8, currentY + 18);
  doc.text('Gestionnaire : Agence McCann Douala — Pôle Influence Marketing', margin + 8, currentY + 22);

  // Date et référence à droite
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 121, 0);
  doc.text('HISTORIQUE OFFICIEL', pageWidth - margin - 8, currentY + 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(220, 220, 220);
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Date d'émission : ${dateStr}`, pageWidth - margin - 8, currentY + 17, { align: 'right' });
  doc.text(`Réf : INF-HIST-${influencer.id || '001'}-${Date.now().toString().slice(-4)}`, pageWidth - margin - 8, currentY + 22, { align: 'right' });

  currentY += 32;

  // Titre principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(26, 26, 26);
  const docTitle = options.singleCampaign
    ? `FICHE HISTORIQUE DE CAMPAGNE : ${options.singleCampaign.campaign || options.singleCampaign.name}`
    : `BILAN HISTORIQUE DES CAMPAGNES & ÉVALUATIONS`;
  doc.text(docTitle, margin, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text('Cahier des charges, résultats chiffrés, évaluations qualitatives, livrables et conditions contractuelles', margin, currentY);

  currentY += 8;

  // ──────────────── 2. FICHE D'IDENTITÉ INFLUENCEUR ────────────────
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(225, 228, 232);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  // Liseré orange à gauche
  doc.setFillColor(255, 121, 0);
  doc.rect(margin, currentY, 3, 24, 'F');

  const infName = influencer.pseudo || influencer.name || 'Talent';
  const realName = influencer.realName || `${influencer.prenom || ''} ${influencer.nom || ''}`.trim() || '—';
  const category = (influencer.categories || [influencer.niche]).filter(Boolean).join(', ') || 'Généraliste';
  const platform = influencer.platform || influencer.reseaux?.join(', ') || 'Multi-plateformes';
  const score = influencer.scorePerformance || influencer.score || 4.5;
  const followers = influencer.followers || '—';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(26, 26, 26);
  doc.text(`${infName} (${realName})`, margin + 8, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text(`Catégorie : ${category}  •  Plateforme principale : ${platform}  •  Audience : ${followers}`, margin + 8, currentY + 13);
  doc.text(`Localisation : ${influencer.city || influencer.region || 'Cameroun'}  •  Contact : ${influencer.phone || 'Non renseigné'}  •  Email : ${influencer.email || 'Non renseigné'}`, margin + 8, currentY + 18);

  // Score badge à droite
  doc.setFillColor(255, 243, 230);
  doc.setDrawColor(255, 121, 0);
  doc.roundedRect(pageWidth - margin - 38, currentY + 4, 32, 16, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 121, 0);
  doc.text('SCORE GLOBAL', pageWidth - margin - 22, currentY + 9, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`${score} / 5 ⭐`, pageWidth - margin - 22, currentY + 16, { align: 'center' });

  currentY += 30;

  // ──────────────── 3. RÉSUMÉ EXÉCUTIF CHIFFRÉ ────────────────
  const totalReach = campaigns.reduce((sum, c) => sum + (c.kpiReach || c.reach || 0), 0);
  const totalTargetReach = campaigns.reduce((sum, c) => sum + (c.kpiTarget || 0), 0);
  const avgEngagement = campaigns.length > 0
    ? (campaigns.reduce((sum, c) => sum + (c.kpiEngagement || c.engagementRate || 0), 0) / campaigns.length).toFixed(1)
    : 0;
  const totalPaid = campaigns.reduce((sum, c) => sum + (c.remuneration?.base || c.basePay || 0) + (c.remuneration?.variable || 0), 0);
  const totalDeliverables = campaigns.reduce((sum, c) => sum + (c.livrables?.length || (c.cahierDesChargesLivrables || []).length || 2), 0);

  const cardW = (contentWidth - 9) / 4;
  const metrics = [
    { label: 'Campagnes analysées', val: `${campaigns.length}`, sub: `${totalDeliverables} livrables réalisés` },
    { label: 'Portée totale cumulée', val: formatNumber(totalReach), sub: totalTargetReach ? `Obj : ${formatNumber(totalTargetReach)}` : 'Reach total mesuré' },
    { label: 'Taux engagement moy.', val: `${avgEngagement}%`, sub: 'Interactions / audience' },
    { label: 'Budget rémunération', val: totalPaid > 0 ? formatCurrency(totalPaid) : 'Sous contrat cadre', sub: 'Cachets & variables' }
  ];

  metrics.forEach((m, idx) => {
    const x = margin + idx * (cardW + 3);
    doc.setFillColor(250, 250, 252);
    doc.setDrawColor(220, 224, 230);
    doc.roundedRect(x, currentY, cardW, 18, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(110, 110, 110);
    doc.text(m.label, x + 3, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 121, 0);
    doc.text(m.val, x + 3, currentY + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(120, 120, 120);
    doc.text(m.sub, x + 3, currentY + 15.5);
  });

  currentY += 24;

  // ──────────────── 4. DÉTAIL DES CAMPAGNES HISTORIQUES ────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text('Détail des campagnes passées répertoriées', margin, currentY);
  currentY += 6;

  campaigns.forEach((camp, index) => {
    // Calcul de l'encombrement requis pour une carte de campagne (environ 65-80mm)
    checkPageBreak(75);

    const campName = camp.campaign || camp.name || `Campagne #${index + 1}`;
    const brand = camp.brand || camp.marque || 'Orange Cameroun';
    const dates = camp.dates || (camp.dateDebut && camp.dateFin ? `${camp.dateDebut} au ${camp.dateFin}` : 'T1 2026');
    const networks = Array.isArray(camp.networks) ? camp.networks.join(', ') : (camp.reseaux || 'Instagram, TikTok');
    const contentTypes = Array.isArray(camp.contentTypes) ? camp.contentTypes.join(', ') : (camp.typesContenu || 'Story, Reel, Post');
    const status = (camp.status || 'terminee').toLowerCase();

    const statusLabels = {
      terminee: 'Terminée',
      en_cours: 'En cours',
      reportee: 'Reportée',
      annulee: 'Annulée'
    };
    const statusText = statusLabels[status] || 'Terminée';

    // Cadre de la campagne
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 225, 230);
    doc.roundedRect(margin, currentY, contentWidth, 70, 2, 2, 'FD');

    // Bandeau d'en-tête de la campagne
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, currentY, contentWidth, 12, 2, 2, 'F');
    doc.rect(margin, currentY + 8, contentWidth, 4, 'F'); // Remplir les coins inférieurs du bandeau
    doc.setDrawColor(220, 225, 230);
    doc.line(margin, currentY + 12, pageWidth - margin, currentY + 12);

    // Titre de campagne et marque
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(26, 26, 26);
    doc.text(`${index + 1}. ${campName}`, margin + 5, currentY + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 121, 0);
    doc.text(`[${brand}]`, margin + 5 + doc.getTextWidth(`${index + 1}. ${campName} `), currentY + 8);

    // Badge Statut à droite
    let statusBg = [39, 174, 96]; // Vert
    if (status === 'en_cours') statusBg = [41, 128, 185]; // Bleu
    if (status === 'reportee') statusBg = [243, 156, 18]; // Orange/Jaune
    if (status === 'annulee') statusBg = [231, 76, 60]; // Rouge

    doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
    doc.roundedRect(pageWidth - margin - 26, currentY + 3, 22, 6, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(statusText.toUpperCase(), pageWidth - margin - 15, currentY + 7.2, { align: 'center' });

    // Ligne méta (dates, réseaux, types)
    currentY += 16;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`Période : ${dates}  |  Réseaux sociaux : ${networks}  |  Formats : ${contentTypes}`, margin + 5, currentY);

    // ── Table des résultats chiffrés ──
    currentY += 4;
    doc.setFillColor(250, 251, 252);
    doc.rect(margin + 5, currentY, contentWidth - 10, 15, 'F');
    doc.setDrawColor(230, 233, 238);
    doc.rect(margin + 5, currentY, contentWidth - 10, 15, 'D');

    const reach = camp.kpiReach || camp.reach || 0;
    const reachTarget = camp.kpiTarget || camp.targetReach || 0;
    const reachPct = reachTarget > 0 ? Math.round((reach / reachTarget) * 100) : 100;
    const impressions = camp.impressions || (reach * 1.35) || 0;
    const engagementRate = camp.kpiEngagement || camp.engagementRate || 0;
    const engagementCount = camp.engagementCount || Math.round(reach * (engagementRate / 100)) || 0;
    const clicks = camp.clicks || camp.clics || Math.round(reach * 0.04) || 0;
    const conversions = camp.conversions || Math.round(clicks * 0.12) || 0;

    const colW = (contentWidth - 10) / 5;
    const numKpis = [
      { label: 'Portée (Reach)', val: `${formatNumber(reach)}`, sub: reachTarget ? `${reachPct}% objectif` : 'Mesurée' },
      { label: 'Impressions', val: `${formatNumber(Math.round(impressions))}`, sub: 'Vues totales' },
      { label: 'Engagement', val: `${formatNumber(Math.round(engagementCount))}`, sub: `Taux: ${engagementRate}%` },
      { label: 'Clics sortants', val: `${formatNumber(clicks)}`, sub: 'Stickers & liens' },
      { label: 'Conversions/Ventes', val: `${conversions} act.`, sub: camp.salesVolume ? formatCurrency(camp.salesVolume) : 'Objectif atteint' }
    ];

    numKpis.forEach((kpi, kIdx) => {
      const kx = margin + 5 + kIdx * colW;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(110, 110, 110);
      doc.text(kpi.label, kx + 2, currentY + 4);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(26, 26, 26);
      doc.text(kpi.val, kx + 2, currentY + 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(120, 120, 120);
      doc.text(kpi.sub, kx + 2, currentY + 13);
    });

    // ── Évaluation qualitative & collaboration ──
    currentY += 19;
    const notes = camp.notesInternes || {};
    const globalScore = notes.noteGlobale || camp.contentQuality || 4;
    const comment = notes.commentaire || camp.comment || 'Collaboration constructive conforme au cahier des charges.';
    const strengths = Array.isArray(notes.pointsForts) ? notes.pointsForts.join(', ') : (notes.pointsForts || 'Qualité visuelle, réactivité éditoriale');
    const improvements = Array.isArray(notes.axesAmelioration) ? notes.axesAmelioration.join(', ') : (notes.axesAmelioration || 'Anticiper la livraison des stories');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 121, 0);
    doc.text(`ÉVALUATION : ${globalScore}/5 ⭐`, margin + 5, currentY);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(50, 50, 50);
    const splitComment = doc.splitTextToSize(`« ${comment} »`, contentWidth - 10);
    doc.text(splitComment, margin + 5, currentY + 4);

    currentY += 4 + splitComment.length * 3.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(39, 174, 96); // Vert
    doc.text(`Points forts : `, margin + 5, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.text(strengths, margin + 22, currentY);

    currentY += 3.5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(230, 126, 34); // Orange
    doc.text(`Axes d'amélioration : `, margin + 5, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.text(improvements, margin + 31, currentY);

    // ── Livrables & Rémunération ──
    currentY += 4.5;
    const basePay = camp.remuneration?.base || camp.basePay || camp.cachetBase || 1500000;
    const variablePay = camp.remuneration?.variable || (basePay * ((camp.variablePaid || 100) / 100) * 0.2) || 0;
    const perks = camp.remuneration?.avantages || camp.avantages || 'Dotation Data Pulse illimitée 3 mois + Goodies Orange';
    const deliverablesList = camp.livrables || [
      { titre: 'Story Teaser de lancement', url: 'https://instagram.com/p/teaser', type: 'story' },
      { titre: 'Reel Vidéo démonstration offre', url: 'https://instagram.com/reel/demo', type: 'video' }
    ];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(41, 128, 185); // Bleu
    doc.text(`Livrables réalisés (${deliverablesList.length}) :`, margin + 5, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    const livTitles = deliverablesList.map(l => l.titre || l.title || 'Livrable').slice(0, 3).join(' • ');
    doc.text(livTitles, margin + 35, currentY);

    currentY += 3.5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(`Rémunération : `, margin + 5, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.text(`Base : ${formatCurrency(basePay)} | Variable versé : ${formatCurrency(variablePay)} | Avantages : ${perks}`, margin + 25, currentY);

    currentY += 12;
  });

  // ──────────────── 5. PIED DE PAGE ET NUMÉROTATION ────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Ligne de pied de page
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(130, 130, 130);
    doc.text('DOCUMENT CONFIDENTIEL — DIRECTION DE LA COMMUNICATION ORANGE CAMEROUN & McCANN DOUALA', margin, pageHeight - 8);
    doc.text(`Page ${i} / ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // Téléchargement automatique
  const cleanName = (influencer.pseudo || influencer.name || 'talent').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = options.singleCampaign
    ? `Orange_Cameroun_Historique_${cleanName}_${(options.singleCampaign.campaign || 'Campagne').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
    : `Orange_Cameroun_Bilan_Historique_${cleanName}.pdf`;

  doc.save(filename);
  return filename;
}
