import { jsPDF } from 'jspdf';
import {
  getTypeLabel,
  RELIABILITY_LEVELS,
  formatFullDateFr,
} from './veilleUtils.js';

const ORANGE_RGB = [255, 121, 0];       // #FF7900
const DARK_RGB = [26, 26, 26];          // #1A1A1A
const LIGHT_BG_RGB = [248, 249, 250];   // #F8F9FA
const BORDER_RGB = [225, 230, 235];     // #E1E6EB
const MUTED_RGB = [110, 110, 110];      // #6E6E6E

export function exportStrategicWatchPdf({
  watchItems = [],
  alerts = [],
  competitors = [],
  activeRole = 'influence_manager',
  filterLabel = 'Toutes catégories',
  metrics = {}
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;          // 182mm
  const now = new Date();
  const exportDate = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

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
    doc.setFillColor(...ORANGE_RGB);
    doc.rect(margin, currentY, contentWidth, 2, 'F');
    currentY += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...DARK_RGB);
    doc.text('ORANGE CAMEROUN — RADAR & VEILLE STRATÉGIQUE INFLUENCE', margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED_RGB);
    doc.text(`Édition du ${exportDate}`, pageWidth - margin, currentY, { align: 'right' });
    currentY += 8;
  };

  // ─── 1. HEADER OFFICIEL ───
  doc.setFillColor(...DARK_RGB);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, 'F');

  // Badge Orange Logo
  doc.setFillColor(...ORANGE_RGB);
  doc.roundedRect(margin + 6, currentY + 6, 20, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('orange', margin + 7, currentY + 18);

  // Titres du document
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('BULLETIN OFFICIEL — VEILLE STRATÉGIQUE & RADAR INFLUENCE', margin + 32, currentY + 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(210, 210, 210);
  doc.text('Direction de la Marque & Communication — Partenariat McCANN Douala / Yaoundé', margin + 32, currentY + 18);
  doc.text(`Périmètre : ${filterLabel} • Export généré le ${exportDate}`, margin + 32, currentY + 24);

  // Sceau de confidentialité
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 38, currentY + 6, 32, 20, 1.5, 1.5, 'F');
  doc.setTextColor(...DARK_RGB);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('USAGE INTERNE', pageWidth - margin - 22, currentY + 13, { align: 'center' });
  doc.setTextColor(...ORANGE_RGB);
  doc.setFontSize(6.5);
  doc.text('STRICTEMENT CONFIDENTIEL', pageWidth - margin - 22, currentY + 19, { align: 'center' });

  currentY += 38;

  // ─── 2. COCKPIT & INDICATEURS CLÉS ───
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_RGB);
  doc.text('1. SYNTHÈSE EXÉCUTIVE DU RADAR', margin, currentY);
  currentY += 5;

  const kpiWidth = (contentWidth - 9) / 4;
  const kpis = [
    { label: 'Alertes Prioritaires', val: `${metrics.priorityAlertsCount || 0}`, sub: 'Bloquants & critiques', color: [220, 53, 69] },
    { label: 'Opportunités Semaine', val: `${metrics.opportunitiesCount || 0}`, sub: 'Amplifications détectées', color: [40, 167, 69] },
    { label: 'Taux de Fraîcheur', val: `${metrics.freshnessRate || 95}%`, sub: 'Sources synchronisées', color: ORANGE_RGB },
    { label: 'Concurrents Suivis', val: `${metrics.activeCompetitorsCount || 4}`, sub: 'MTN, Camtel, Nexttel', color: [0, 153, 255] }
  ];

  kpis.forEach((k, idx) => {
    const x = margin + idx * (kpiWidth + 3);
    doc.setFillColor(...LIGHT_BG_RGB);
    doc.roundedRect(x, currentY, kpiWidth, 18, 1.5, 1.5, 'F');
    doc.setDrawColor(...BORDER_RGB);
    doc.roundedRect(x, currentY, kpiWidth, 18, 1.5, 1.5, 'S');

    doc.setFillColor(...k.color);
    doc.rect(x, currentY, kpiWidth, 1.5, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED_RGB);
    doc.text(k.label, x + 3, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...DARK_RGB);
    doc.text(k.val, x + 3, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...MUTED_RGB);
    doc.text(k.sub, x + 3, currentY + 16);
  });

  currentY += 24;

  // ─── 3. ALERTES PRIORITAIRES ET ACTIONS IMMÉDIATES ───
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_RGB);
  doc.text('2. PLAN D’ACTION IMMÉDIAT & ALERTES ACTIVES', margin, currentY);
  currentY += 6;

  const urgentAlerts = alerts.filter(a => a.status !== 'resolu').slice(0, 4);

  if (urgentAlerts.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED_RGB);
    doc.text('Aucune alerte critique en cours. Tous les indicateurs de réputation et de veille sont stables.', margin, currentY);
    currentY += 8;
  } else {
    urgentAlerts.forEach((alert, i) => {
      checkPageBreak(18);
      const isCritical = alert.priority === 'bloquant' || alert.priority === 'critique';
      doc.setFillColor(isCritical ? 255 : 248, isCritical ? 235 : 249, isCritical ? 238 : 250);
      doc.roundedRect(margin, currentY, contentWidth, 15, 1, 1, 'F');
      doc.setDrawColor(isCritical ? 220 : 200, isCritical ? 53 : 200, isCritical ? 69 : 200);
      doc.roundedRect(margin, currentY, contentWidth, 15, 1, 1, 'S');

      // Puce statut
      doc.setFillColor(isCritical ? 220 : 255, isCritical ? 53 : 121, isCritical ? 69 : 0);
      doc.rect(margin, currentY, 2, 15, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...DARK_RGB);
      doc.text(`[${alert.priority.toUpperCase()}] ${alert.title}`, margin + 5, currentY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...MUTED_RGB);
      doc.text(`Action requise : ${alert.recommended_action || 'Traitement opérationnel en attente'}`, margin + 5, currentY + 9);
      doc.text(`Assigné à : ${alert.assigned_to || 'Non assigné'} • Échéance : ${alert.due_at ? alert.due_at.substring(0, 10) : 'Sous 24h'}`, margin + 5, currentY + 13);

      currentY += 18;
    });
  }

  currentY += 4;

  // ─── 4. VEILLE CONCURRENTIELLE : RADAR DES MARQUES ───
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_RGB);
  doc.text('3. RADAR CONCURRENTIEL TÉLÉCOMS & FINTECH', margin, currentY);
  currentY += 6;

  competitors.slice(0, 3).forEach(comp => {
    checkPageBreak(24);
    doc.setFillColor(...LIGHT_BG_RGB);
    doc.roundedRect(margin, currentY, contentWidth, 22, 1.5, 1.5, 'F');
    doc.setDrawColor(...BORDER_RGB);
    doc.roundedRect(margin, currentY, contentWidth, 22, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK_RGB);
    doc.text(`${comp.name} — ${comp.category}`, margin + 4, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED_RGB);
    doc.text(`Talents engagés observés : ${(comp.primary_creators_used || []).join(', ') || 'N/A'}`, margin + 4, currentY + 10.5);
    doc.text(`Estimation budgétaire mensuelle influence : ${(comp.estimated_monthly_influence_budget / 1000000).toFixed(1)}M FCFA (${comp.budget_confidence})`, margin + 4, currentY + 14.5);
    doc.setTextColor(220, 53, 69);
    doc.text(`Menace identifiée : ${comp.threat_level || 'Surveillance de routine'}`, margin + 4, currentY + 18.5);

    currentY += 26;
  });

  currentY += 4;

  // ─── 5. SIGNAUX STRATÉGIQUES DÉTAILLÉS ───
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_RGB);
  doc.text('4. SÉLECTION DES SIGNAUX & TENDANCES PRIORITAIRES', margin, currentY);
  currentY += 6;

  watchItems.slice(0, 6).forEach((item, idx) => {
    checkPageBreak(22);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, 20, 1, 1, 'F');
    doc.setDrawColor(...BORDER_RGB);
    doc.roundedRect(margin, currentY, contentWidth, 20, 1, 1, 'S');

    const reliability = RELIABILITY_LEVELS[item.reliability_level]?.label || 'Source documentée';
    const isOpp = item.opportunity_or_risk === 'opportunity';

    doc.setFillColor(isOpp ? 40 : 255, isOpp ? 167 : 121, isOpp ? 69 : 0);
    doc.circle(margin + 4, currentY + 5, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...DARK_RGB);
    const title = item.title.length > 80 ? item.title.substring(0, 78) + '...' : item.title;
    doc.text(`${title}`, margin + 8, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED_RGB);
    doc.text(`Type : ${getTypeLabel(item.type)} • Source : ${item.source_name} • Fiabilité : ${reliability} • Certitude : ${item.confidence_level}`, margin + 8, currentY + 10.5);

    const summary = item.summary.length > 105 ? item.summary.substring(0, 102) + '...' : item.summary;
    doc.text(summary, margin + 8, currentY + 14.5);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...ORANGE_RGB);
    const reco = item.recommended_action ? `Recommandation : ${item.recommended_action}` : '';
    const recoCut = reco.length > 105 ? reco.substring(0, 102) + '...' : reco;
    doc.text(recoCut, margin + 8, currentY + 18.5);

    currentY += 23;
  });

  // ─── 6. BAS DE PAGE / FOOTER ───
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED_RGB);

    // Ligne de séparation
    doc.setDrawColor(...BORDER_RGB);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text(
      `Bridge IAM & Influence — Orange Cameroun & McCANN • Confidentiel — Reproduction interdite sans autorisation`,
      margin,
      pageHeight - 8
    );
    doc.text(
      `Page ${i} sur ${pageCount}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  // Téléchargement
  const fileDate = now.toISOString().slice(0, 10);
  doc.save(`Rapport_Veille_Strategique_Orange_Cameroun_${fileDate}.pdf`);
}
