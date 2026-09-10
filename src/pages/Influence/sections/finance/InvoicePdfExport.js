import { jsPDF } from 'jspdf';
import { formatNumber, formatCurrency } from '../../../../utils/helpers.js';

/**
 * Génère et télécharge une facture PDF officielle chartée Orange Cameroun & McCann pour un influenceur.
 * @param {Object} invoice - Données de la facture
 * @param {Object} influencer - Données de l'influenceur
 * @param {Object} contract - Données contractuelles associées (optionnel)
 */
export function exportInvoiceToPdf(invoice, influencer, contract = null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  let currentY = 15;

  // 1. Bandeau supérieur Orange #FF7900
  doc.setFillColor(255, 121, 0);
  doc.rect(0, 0, pageWidth, 7, 'F');

  // 2. En-tête : Logo & Identification
  currentY = 16;
  doc.setFillColor(26, 26, 26);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');

  // Marque Orange
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 121, 0);
  doc.text('orange™', margin + 8, currentY + 11);

  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Cameroun', margin + 32, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('Pôle Influence & Médias Digitaux • Partenariat McCann Douala', margin + 8, currentY + 18);

  // Numéro & Titre Facture à droite
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('FACTURE PRESTATION', pageWidth - margin - 8, currentY + 10, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(255, 121, 0);
  doc.text(`N° ${invoice.numeroFacture || invoice.id || 'FAC-2026-001'}`, pageWidth - margin - 8, currentY + 17, { align: 'right' });

  currentY += 30;

  // 3. Statut en filigrane / badge
  const statutColors = {
    payee: [39, 174, 96],
    validee: [41, 128, 185],
    envoyee: [255, 121, 0],
    brouillon: [120, 120, 120]
  };
  const statutLabels = {
    payee: 'PAYÉE ✓',
    validee: 'VALIDÉE',
    envoyee: 'ENVOYÉE / EN ATTENTE',
    brouillon: 'BROUILLON'
  };
  const currentStatut = invoice.statut || 'brouillon';
  const [sR, sG, sB] = statutColors[currentStatut] || [120, 120, 120];

  // 4. Deux colonnes : Émetteur (Influenceur) & Destinataire (Client / Agence)
  const colWidth = (contentWidth - 10) / 2;

  // Bloc Émetteur (Influenceur)
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(margin, currentY, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(margin, currentY, colWidth, 42, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 121, 0);
  doc.text('PRESTATAIRE / CRÉATEUR DE CONTENU', margin + 6, currentY + 8);

  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  const infDisplayName = influencer.realName || `${influencer.prenom || ''} ${influencer.nom || ''}`.trim() || influencer.name || 'Créateur';
  doc.text(infDisplayName, margin + 6, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text(`Pseudo : @${influencer.pseudo || influencer.name || 'influencer'}`, margin + 6, currentY + 22);
  doc.text(`Tél : ${influencer.phone || influencer.telephone || '+237 6XX XX XX XX'}`, margin + 6, currentY + 27);
  doc.text(`Email : ${influencer.email || 'influenceur@orange-partenaire.cm'}`, margin + 6, currentY + 32);
  doc.text(`Ville : ${influencer.city || influencer.ville || 'Douala'}, Cameroun`, margin + 6, currentY + 37);

  // Bloc Destinataire (Orange / McCann)
  const rightColX = margin + colWidth + 10;
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(rightColX, currentY, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(rightColX, currentY, colWidth, 42, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 121, 0);
  doc.text('DESTINATAIRE / ANNONCEUR', rightColX + 6, currentY + 8);

  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text('Orange Cameroun S.A.', rightColX + 6, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text('Direction Marque, Communication & Médias Digitaux', rightColX + 6, currentY + 22);
  doc.text('Bvd de la Liberté, BP 1864, Akwa - Douala', rightColX + 6, currentY + 27);
  doc.text('RCCM: RC/DLA/2000/B/024503 • NIU: M010200012480R', rightColX + 6, currentY + 32);
  doc.text('Agence mandataire : McCann Douala Partners', rightColX + 6, currentY + 37);

  currentY += 48;

  // 5. Informations administratives & dates
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, currentY, contentWidth, 16, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text('DATE D\'ÉMISSION', margin + 6, currentY + 6);
  doc.text('ÉCHÉANCE DE RÈGLEMENT', margin + 50, currentY + 6);
  doc.text('CAMPAGNE ASSOCIÉE', margin + 100, currentY + 6);
  doc.text('RÉF. CONTRAT', margin + 145, currentY + 6);

  doc.setFontSize(9);
  doc.setTextColor(26, 26, 26);
  doc.text(invoice.dateEmission || new Date().toISOString().split('T')[0], margin + 6, currentY + 12);
  doc.text(invoice.dateEcheance || 'À réception (15j)', margin + 50, currentY + 12);
  doc.text((invoice.campagne || 'Campagne Digitale').slice(0, 24), margin + 100, currentY + 12);
  doc.text(invoice.contratRef || contract?.id || 'CTR-2026-OR', margin + 145, currentY + 12);

  currentY += 22;

  // 6. Tableau des Prestations / Livrables
  doc.setFillColor(26, 26, 26);
  doc.rect(margin, currentY, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('DÉSIGNATION DE LA PRESTATION / LIVRABLE', margin + 6, currentY + 5.5);
  doc.text('QUANTITÉ', margin + 105, currentY + 5.5, { align: 'center' });
  doc.text('PRIX UNIT. HT', margin + 135, currentY + 5.5, { align: 'right' });
  doc.text('TOTAL HT', margin + contentWidth - 6, currentY + 5.5, { align: 'right' });

  currentY += 8;

  // Lignes de prestations (calculées ou fournies)
  const items = invoice.items && invoice.items.length > 0 ? invoice.items : [
    {
      description: `Prestation d'influence & diffusion de contenus — ${invoice.campagne || 'Campagne Marque'}`,
      quantite: 1,
      prixUnit: invoice.montantHT || 1000000,
      total: invoice.montantHT || 1000000
    },
    ...(invoice.avanceDeduite ? [{
      description: `Déduction de l'acompte/avance déjà perçu(e)`,
      quantite: 1,
      prixUnit: -invoice.avanceDeduite,
      total: -invoice.avanceDeduite
    }] : [])
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);

  items.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(252, 252, 252);
      doc.rect(margin, currentY, contentWidth, 8, 'F');
    }

    doc.text(item.description.slice(0, 55), margin + 6, currentY + 5.5);
    doc.text(String(item.quantite || 1), margin + 105, currentY + 5.5, { align: 'center' });
    doc.text(formatCurrency(item.prixUnit), margin + 135, currentY + 5.5, { align: 'right' });
    doc.text(formatCurrency(item.total), margin + contentWidth - 6, currentY + 5.5, { align: 'right' });

    doc.setDrawColor(240, 240, 240);
    doc.line(margin, currentY + 8, margin + contentWidth, currentY + 8);
    currentY += 8;
  });

  currentY += 6;

  // 7. Totaux (HT, TVA, TTC, Acompte, Net à payer)
  const totalBoxX = margin + 95;
  const totalBoxWidth = contentWidth - 95;

  const montantHT = invoice.montantHT || 1000000;
  const tvaTaux = invoice.tvaTaux !== undefined ? invoice.tvaTaux : 19.25;
  const tvaMontant = invoice.tvaMontant !== undefined ? invoice.tvaMontant : Math.round(montantHT * (tvaTaux / 100));
  const montantTTC = invoice.montantTTC || (montantHT + tvaMontant);
  const avance = invoice.avanceDeduite || 0;
  const netAPayer = Math.max(0, montantTTC - avance);

  doc.setFillColor(250, 250, 250);
  doc.roundedRect(totalBoxX, currentY, totalBoxWidth, 42, 1, 1, 'F');
  doc.setDrawColor(225, 225, 225);
  doc.roundedRect(totalBoxX, currentY, totalBoxWidth, 42, 1, 1, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);

  doc.text('Total Hors Taxes (HT) :', totalBoxX + 6, currentY + 8);
  doc.text(formatCurrency(montantHT), totalBoxX + totalBoxWidth - 6, currentY + 8, { align: 'right' });

  doc.text(`TVA (${tvaTaux}%) :`, totalBoxX + 6, currentY + 15);
  doc.text(formatCurrency(tvaMontant), totalBoxX + totalBoxWidth - 6, currentY + 15, { align: 'right' });

  if (avance > 0) {
    doc.text('Acompte / Avance déduite :', totalBoxX + 6, currentY + 22);
    doc.text(`- ${formatCurrency(avance)}`, totalBoxX + totalBoxWidth - 6, currentY + 22, { align: 'right' });
  }

  // Bandeau Total TTC / Net à Payer
  doc.setFillColor(255, 121, 0);
  doc.roundedRect(totalBoxX, currentY + 27, totalBoxWidth, 15, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('NET À PAYER (TTC) :', totalBoxX + 6, currentY + 36);
  doc.setFontSize(11);
  doc.text(formatCurrency(netAPayer), totalBoxX + totalBoxWidth - 6, currentY + 36, { align: 'right' });

  // 8. Conditions & Modalités de paiement (bloc gauche)
  const condBoxWidth = 85;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, currentY, condBoxWidth, 42, 1, 1, 'F');
  doc.setDrawColor(225, 225, 225);
  doc.roundedRect(margin, currentY, condBoxWidth, 42, 1, 1, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 121, 0);
  doc.text('MODALITÉS DE RÈGLEMENT', margin + 6, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 70);
  doc.text(`Conditions : ${invoice.conditionsPaiement || 'Virement sous 15 jours à validation'}`, margin + 6, currentY + 14);
  doc.text(`Mode : ${invoice.modalitesPaiement || contract?.modalitesPaiement || 'Virement bancaire / Orange Money'}`, margin + 6, currentY + 20);

  const ribInfo = influencer.documentsLegaux?.rib?.nom ? `RIB disponible (${influencer.documentsLegaux.rib.nom})` : 'RIB / Compte Orange Money vérifié';
  doc.text(`Coordonnées : ${ribInfo}`, margin + 6, currentY + 26);
  doc.text(`Statut actuel : ${statutLabels[currentStatut] || currentStatut}`, margin + 6, currentY + 32);

  // Badge Statut
  doc.setFillColor(sR, sG, sB);
  doc.roundedRect(margin + 6, currentY + 35, 34, 5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(statutLabels[currentStatut] || currentStatut, margin + 23, currentY + 38.5, { align: 'center' });

  currentY += 50;

  // 9. Signatures & Validations
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('BON POUR ACCORD & BON À PAYER', margin + 6, currentY);
  doc.text('VISA DIRECTION MARQUE ORANGE', margin + contentWidth - 6, currentY, { align: 'right' });

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(130, 130, 130);
  doc.text(`Signature du créateur (@${influencer.pseudo || influencer.name})`, margin + 6, currentY);
  doc.text('Validation Contrôle Financier & Budgétaire', margin + contentWidth - 6, currentY, { align: 'right' });

  // 10. Pied de page
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  const footerY = pageHeight - 10;
  doc.text('Orange Cameroun S.A. au capital de 10 000 000 000 FCFA • Facture dématérialisée conforme aux dispositions de la législation fiscale camerounaise.', margin, footerY);
  doc.text(`Document émis le ${new Date().toLocaleDateString('fr-FR')} • Page 1/1`, pageWidth - margin, footerY, { align: 'right' });

  // Téléchargement
  const filename = `Facture_${invoice.numeroFacture || invoice.id || 'FAC'}_${(influencer.pseudo || influencer.name || 'influenceur').replace(/[^a-zA-Z0-9_]/g, '_')}.pdf`;
  doc.save(filename);
  return filename;
}
