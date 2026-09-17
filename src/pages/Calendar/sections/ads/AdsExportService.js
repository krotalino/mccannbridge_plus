// Service d'export CSV et PDF pour le module Ads & Sponsoring (Community Managers)
import { jsPDF } from 'jspdf';

export const exportToCsv = (filename, rows, columns) => {
  if (!rows || !rows.length) {
    alert('Aucune donnée à exporter.');
    return;
  }

  // Header
  const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(';');
  
  // Rows
  const body = rows.map(row => {
    return columns.map(c => {
      let val = c.getValue ? c.getValue(row) : row[c.key];
      if (val === null || val === undefined) val = '';
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(';');
  }).join('\n');

  const csvContent = '\uFEFF' + headers + '\n' + body;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportSocialAdsCsv = (campaigns) => {
  const columns = [
    { key: 'client', label: 'Client' },
    { key: 'platform', label: 'Plateforme' },
    { key: 'campaignName', label: 'Nom de la campagne' },
    { key: 'startDate', label: 'Date de début' },
    { key: 'endDate', label: 'Date de fin' },
    { key: 'budgetTotal', label: 'Budget Total (FCFA)' },
    { key: 'budgetSpent', label: 'Budget Dépensé (FCFA)' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clics', label: 'Clics' },
    { key: 'ctr', label: 'CTR (%)', getValue: r => `${r.ctr}%` },
    { key: 'cpc', label: 'CPC (FCFA)', getValue: r => `${r.cpc} FCFA` },
    { key: 'status', label: 'Statut' },
    { key: 'objective', label: 'Objectif' },
    { key: 'organicReach', label: 'Portée Organique' },
    { key: 'paidReach', label: 'Portée Payante' },
  ];
  exportToCsv('Rapport_Social_Ads_McCann', campaigns, columns);
};

export const exportDisplayCsv = (campaigns) => {
  const columns = [
    { key: 'client', label: 'Client' },
    { key: 'campaignName', label: 'Nom de la campagne' },
    { key: 'displayType', label: 'Type de display' },
    { key: 'format', label: 'Format' },
    { key: 'period', label: 'Période' },
    { key: 'budgetTotal', label: 'Budget Total (FCFA)' },
    { key: 'budgetSpent', label: 'Budget Dépensé (FCFA)' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clics', label: 'Clics' },
    { key: 'ctr', label: 'CTR (%)', getValue: r => `${r.ctr}%` },
    { key: 'cpm', label: 'CPM (FCFA)', getValue: r => `${r.cpm} FCFA` },
    { key: 'conversions', label: 'Conversions' },
    { key: 'conversionRate', label: 'Taux Conversion (%)', getValue: r => `${r.conversionRate}%` },
    { key: 'status', label: 'Statut' },
  ];
  exportToCsv('Rapport_Display_McCann', campaigns, columns);
};

export const exportAdsPdfReport = ({ type, campaigns, totals, clientFilter = 'Tous les clients' }) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const title = type === 'social' ? 'RAPPORT DE PERFORMANCE · SOCIAL ADS' : 'RAPPORT DE PERFORMANCE · CAMPAGNES DISPLAY';

  // Background header band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Agency branding
  doc.setFontSize(14);
  doc.setTextColor(255, 121, 0); // Orange Bridge
  doc.text('McCANN BRIDGE', 14, 11);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Community Management & Media Buying · Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 18);

  // Document title
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(title, pageWidth - 14, 12, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(`Périmètre : ${clientFilter} · ${campaigns.length} campagne(s)`, pageWidth - 14, 19, { align: 'right' });

  // Summary Metrics Cards
  let y = 34;
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, pageWidth - 28, 24, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 24, 'S');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('BUDGET TOTAL DÉPENSÉ', 22, y + 8);
  doc.text('IMPRESSIONS TOTALES', 85, y + 8);
  doc.text('CLICS TOTAUX', 145, y + 8);
  doc.text(type === 'social' ? 'CTR MOYEN / CPC' : 'CTR MOYEN / CONVERSIONS', 205, y + 8);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${(totals.spent || 0).toLocaleString('fr-FR')} FCFA`, 22, y + 16);
  doc.text((totals.impressions || 0).toLocaleString('fr-FR'), 85, y + 16);
  doc.text((totals.clics || 0).toLocaleString('fr-FR'), 145, y + 16);
  doc.text(
    type === 'social' 
      ? `${totals.avgCtr || '0.00'}% · CPC ${(totals.avgCpc || 0).toFixed(1)} FCFA` 
      : `${totals.avgCtr || '0.00'}% · ${(totals.conversions || 0).toLocaleString('fr-FR')} conv.`,
    205, y + 16
  );

  // Table Headers
  y = 66;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 8, 'F');

  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  if (type === 'social') {
    doc.text('CLIENT', 16, y + 5.5);
    doc.text('RÉSEAU', 45, y + 5.5);
    doc.text('NOM DE LA CAMPAGNE', 65, y + 5.5);
    doc.text('PÉRIODE', 125, y + 5.5);
    doc.text('BUDGET DÉPENSÉ', 158, y + 5.5);
    doc.text('IMPRESSIONS', 198, y + 5.5);
    doc.text('CLICS', 228, y + 5.5);
    doc.text('CTR', 246, y + 5.5);
    doc.text('CPC', 260, y + 5.5);
    doc.text('STATUT', 274, y + 5.5);
  } else {
    doc.text('CLIENT', 16, y + 5.5);
    doc.text('NOM DE LA CAMPAGNE', 45, y + 5.5);
    doc.text('TYPE DISPLAY', 105, y + 5.5);
    doc.text('FORMAT', 130, y + 5.5);
    doc.text('PÉRIODE', 165, y + 5.5);
    doc.text('BUDGET', 195, y + 5.5);
    doc.text('IMPR.', 222, y + 5.5);
    doc.text('CLICS', 240, y + 5.5);
    doc.text('CTR', 255, y + 5.5);
    doc.text('CPM / CONV.', 268, y + 5.5);
  }

  // Rows
  y += 9;
  doc.setFontSize(7.5);

  campaigns.slice(0, 16).forEach((c, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 2, pageWidth - 28, 7.5, 'F');
    }

    doc.setTextColor(30, 41, 59);

    if (type === 'social') {
      doc.text(String(c.client).slice(0, 15), 16, y + 3);
      doc.text(String(c.platform), 45, y + 3);
      doc.text(String(c.campaignName).slice(0, 32), 65, y + 3);
      doc.text(`${c.startDate.slice(5)} au ${c.endDate.slice(5)}`, 125, y + 3);
      doc.text(`${(c.budgetSpent || 0).toLocaleString('fr-FR')} F`, 158, y + 3);
      doc.text((c.impressions || 0).toLocaleString('fr-FR'), 198, y + 3);
      doc.text((c.clics || 0).toLocaleString('fr-FR'), 228, y + 3);
      doc.text(`${c.ctr}%`, 246, y + 3);
      doc.text(`${Math.round(c.cpc || 0)} F`, 260, y + 3);
      doc.text(c.status, 274, y + 3);
    } else {
      doc.text(String(c.client).slice(0, 15), 16, y + 3);
      doc.text(String(c.campaignName).slice(0, 30), 45, y + 3);
      doc.text(String(c.displayType), 105, y + 3);
      doc.text(String(c.format).slice(0, 16), 130, y + 3);
      doc.text(String(c.period || `${c.startDate} - ${c.endDate}`).slice(0, 16), 165, y + 3);
      doc.text(`${(c.budgetSpent || 0).toLocaleString('fr-FR')} F`, 195, y + 3);
      doc.text((c.impressions || 0).toLocaleString('fr-FR'), 222, y + 3);
      doc.text((c.clics || 0).toLocaleString('fr-FR'), 240, y + 3);
      doc.text(`${c.ctr}%`, 255, y + 3);
      doc.text(`${Math.round(c.cpm || 0)} F / ${c.conversions || 0}`, 268, y + 3);
    }

    y += 8;
  });

  // Footer note
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Rapport certifié et édité via la plateforme McCann Bridge pour le suivi des campagnes digitales au Cameroun.', 14, 198);
  doc.text(`Page 1/1 · Document confidentiel`, pageWidth - 14, 198, { align: 'right' });

  doc.save(`Rapport_${type === 'social' ? 'Social_Ads' : 'Display'}_McCann_${new Date().toISOString().slice(0, 10)}.pdf`);
};
