import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

/**
 * Utilitaire d'export universel charté Orange pour le module Dashboard Analytics
 */

export const exportAnalyticsCsv = ({ data, activeTab, filterClient, filterPeriod }) => {
  const { metrics, filteredPublications, filteredAds, breakdowns } = data;
  let rows = [];
  let filename = `Bridge_Analytics_${activeTab}_${filterClient}_${new Date().toISOString().slice(0, 10)}`;

  if (activeTab === 'calendar' || activeTab === 'overview') {
    rows = filteredPublications.map(p => ({
      ID: p.id,
      Client: p.clientName,
      Canal: p.canal?.toUpperCase(),
      Type: p.type,
      Titre: p.titre,
      Statut: p.statut,
      Date: p.date,
      Sponsorisé: p.sponsoring ? 'OUI' : 'NON',
      Budget_Ads_FCFA: p.budgetAds,
      Impressions: p.impressions,
      Clics: p.clics,
      Engagements: p.engagements
    }));
  } else if (activeTab === 'ads') {
    rows = filteredAds.map(a => ({
      ID: a.id,
      Client: a.clientName,
      Campagne: a.name,
      Canal: a.channelName,
      Statut: a.status,
      Budget_Total_FCFA: a.budgetTotal,
      Budget_Dépensé_FCFA: a.budgetSpent,
      Impressions: a.impressions,
      Clics: a.clics,
      CTR_Pct: `${a.ctr}%`,
      CPC_FCFA: `${a.cpc} FCFA`,
      Conversions: a.conversions,
      Portée: a.reach,
      ROAS: `${a.roas}x`
    }));
  } else if (activeTab === 'finance') {
    rows = breakdowns.financialPostes.map(f => ({
      Poste_Dépense: f.name,
      Budget_Alloué_FCFA: f.budget,
      Prévision_FCFA: f.prevision,
      Réalisé_FCFA: f.reel,
      Taux_Consommation: `${Math.round((f.reel / f.budget) * 100)}%`
    }));
  } else {
    rows = [
      { Indicateur: 'Total Publications', Valeur: metrics.totalPublications },
      { Indicateur: 'Taux de Sponsoring', Valeur: `${metrics.sponsoringRate}%` },
      { Indicateur: 'Budget Ads Dépensé', Valeur: `${metrics.totalAdsSpent.toLocaleString('fr-FR')} FCFA` },
      { Indicateur: 'Chiffre d’Affaires TTC', Valeur: `${metrics.totalTTC.toLocaleString('fr-FR')} FCFA` },
      { Indicateur: 'Utilisateurs Actifs', Valeur: metrics.activeUsersCount },
      { Indicateur: 'Influenceurs Actifs', Valeur: metrics.activeInfluencersCount }
    ];
  }

  if (!rows.length) {
    alert('Aucune donnée à exporter pour ce filtre.');
    return;
  }

  const keys = Object.keys(rows[0]);
  const headers = keys.join(';');
  const body = rows.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
  const csvContent = '\uFEFF' + headers + '\n' + body;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAnalyticsExcel = ({ data, activeTab, filterClient, filterPeriod }) => {
  const { metrics, filteredPublications, filteredAds, breakdowns, filteredUsers, filteredInfluencers } = data;
  const wb = XLSX.utils.book_new();

  // 1. Feuille Synthèse KPIs
  const kpiData = [
    { Métrique: 'Périmètre Client', Valeur: filterClient === 'all' ? 'Tous les clients' : filterClient },
    { Métrique: 'Période Analysée', Valeur: filterPeriod },
    { Métrique: 'Total Publications', Valeur: metrics.totalPublications },
    { Métrique: 'Publications Sponsorisées', Valeur: metrics.totalSponsoredPubs },
    { Métrique: 'Taux de Sponsoring', Valeur: `${metrics.sponsoringRate}%` },
    { Métrique: 'Budget Ads Alloué', Valeur: `${metrics.totalAdsBudget.toLocaleString('fr-FR')} FCFA` },
    { Métrique: 'Budget Ads Dépensé', Valeur: `${metrics.totalAdsSpent.toLocaleString('fr-FR')} FCFA` },
    { Métrique: 'Impressions Totales Ads', Valeur: metrics.totalImpressions.toLocaleString('fr-FR') },
    { Métrique: 'Clics Totaux', Valeur: metrics.totalClicks.toLocaleString('fr-FR') },
    { Métrique: 'CTR Moyen', Valeur: `${metrics.avgCTR}%` },
    { Métrique: 'CPC Moyen', Valeur: `${metrics.avgCPC} FCFA` },
    { Métrique: 'Conversions / Leads', Valeur: metrics.totalConversions.toLocaleString('fr-FR') },
    { Métrique: 'Portée Globale (Reach)', Valeur: metrics.totalReach.toLocaleString('fr-FR') },
    { Métrique: 'Budget Client Alloué HT', Valeur: `${metrics.totalBudgetHT.toLocaleString('fr-FR')} FCFA` },
    { Métrique: 'Budget Dépensé HT', Valeur: `${metrics.totalSpentHT.toLocaleString('fr-FR')} FCFA` },
    { Métrique: 'Marge Brute Agence McCann', Valeur: `${metrics.commission.toLocaleString('fr-FR')} FCFA` },
    { Métrique: 'Total Facturé TTC', Valeur: `${metrics.totalTTC.toLocaleString('fr-FR')} FCFA` },
    { Métrique: 'Taux d’Exécution Budgétaire', Valeur: `${metrics.tauxConsommation}%` },
    { Métrique: 'Collaborateurs Actifs Bridge', Valeur: metrics.activeUsersCount },
    { Métrique: 'Influenceurs Vivier Actif', Valeur: metrics.activeInfluencersCount }
  ];
  const wsKPI = XLSX.utils.json_to_sheet(kpiData);
  XLSX.utils.book_append_sheet(wb, wsKPI, 'Synthèse_Générale');

  // 2. Feuille Calendrier Publications
  if (filteredPublications?.length) {
    const pubData = filteredPublications.map(p => ({
      ID: p.id,
      Client: p.clientName,
      Canal: p.canal?.toUpperCase(),
      Format: p.type,
      Titre: p.titre,
      Statut: p.statut,
      Date_Publication: p.date,
      Sponsoring: p.sponsoring ? 'Oui' : 'Non',
      Budget_Ads: p.budgetAds,
      Impressions: p.impressions,
      Clics: p.clics,
      Engagements: p.engagements
    }));
    const wsPub = XLSX.utils.json_to_sheet(pubData);
    XLSX.utils.book_append_sheet(wb, wsPub, 'Calendrier_Contenus');
  }

  // 3. Feuille Campagnes Ads
  if (filteredAds?.length) {
    const adsData = filteredAds.map(a => ({
      Campagne: a.name,
      Client: a.clientName,
      Canal: a.channelName,
      Statut: a.status,
      Objectif: a.objective,
      Budget_Alloué: a.budgetTotal,
      Budget_Dépensé: a.budgetSpent,
      Impressions: a.impressions,
      Clics: a.clics,
      CTR: `${a.ctr}%`,
      CPC: a.cpc,
      CPM: a.cpm,
      Conversions: a.conversions,
      Reach: a.reach,
      ROAS: `${a.roas}x`
    }));
    const wsAds = XLSX.utils.json_to_sheet(adsData);
    XLSX.utils.book_append_sheet(wb, wsAds, 'Social_Ads_Sponsoring');
  }

  // 4. Feuille Finances & Postes
  if (breakdowns?.financialPostes?.length) {
    const finData = breakdowns.financialPostes.map(f => ({
      Poste_Analytique: f.name,
      Budget_Alloué: f.budget,
      Prévisionnel: f.prevision,
      Réalisé: f.reel,
      Écart_FCFA: f.budget - f.reel,
      Taux_Consommation: `${Math.round((f.reel / f.budget) * 100)}%`
    }));
    const wsFin = XLSX.utils.json_to_sheet(finData);
    XLSX.utils.book_append_sheet(wb, wsFin, 'États_Financiers');
  }

  // 5. Feuille Utilisateurs IAM
  if (filteredUsers?.length) {
    const usrData = filteredUsers.map(u => ({
      Nom_Complet: `${u.nom || ''} ${u.prenom || ''}`.trim() || u.name,
      Email: u.email,
      Entité: u.entite || u.tenancyLabel,
      Poste_Fonction: u.profil || u.poste,
      Rôle_RBAC: u.rbacRole,
      Statut: u.statut,
      Dernière_Connexion: u.derniereConnexion
    }));
    const wsUsr = XLSX.utils.json_to_sheet(usrData);
    XLSX.utils.book_append_sheet(wb, wsUsr, 'Utilisateurs_Bridge');
  }

  const filename = `Bridge_Rapport_Analytics_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportAnalyticsPdf = ({ data, activeTab, filterClient, filterPeriod }) => {
  const { metrics, filteredPublications, filteredAds, breakdowns } = data;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Bandeau supérieur officiel McCann Bridge
  doc.setFillColor(22, 33, 62); // Dark Card / Navy
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Liseré Orange Signature Bridge
  doc.setFillColor(255, 121, 0); // Orange Brand
  doc.rect(0, 26, pageWidth, 2, 'F');

  // Titre et branding
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 121, 0);
  doc.text('McCANN BRIDGE', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 190, 205);
  doc.text('Digital Operating System · Direction des Opérations', 14, 18);
  doc.text(`Édité le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR').slice(0, 5)}`, 14, 23);

  // Titre du rapport à droite
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  const reportTitles = {
    overview: 'FICHE SYNTHÈSE ANALYTIQUE CONSOLIDÉE',
    calendar: 'RAPPORT DE PERFORMANCE · CALENDRIER DE CONTENUS',
    ads: 'BILAN DE PERFORMANCE · ADS & SPONSORING',
    finance: 'BILAN FINANCIER & EXÉCUTION BUDGÉTAIRE',
    users: 'RAPPORT D’ADOPTION & ACTIVITÉ UTILISATEURS',
    influence: 'RAPPORT DE GESTION & ROI INFLUENCEURS'
  };
  doc.text(reportTitles[activeTab] || 'RAPPORT ANALYTICS BRIDGE', pageWidth - 14, 12, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 179, 102);
  doc.text(`Périmètre : ${filterClient === 'all' ? 'Tous les Grands Comptes' : filterClient} · Période : ${filterPeriod}`, pageWidth - 14, 19, { align: 'right' });

  // 2. Grille de Cartes KPI Synthétiques
  let y = 35;
  const cardWidth = (pageWidth - 28 - 20) / 5;
  const cardHeight = 22;

  const kpisToDraw = [
    { label: 'PUBLICATIONS', value: `${metrics.totalPublications}`, sub: `${metrics.sponsoringRate}% sponsorisées`, color: [255, 121, 0] },
    { label: 'BUDGET ADS DÉPENSÉ', value: `${(metrics.totalAdsSpent / 1000000).toFixed(1)}M FCFA`, sub: `Alloué : ${(metrics.totalAdsBudget / 1000000).toFixed(1)}M`, color: [230, 126, 34] },
    { label: 'IMPRESSIONS TOTALES', value: `${(metrics.totalImpressions / 1000000).toFixed(1)}M`, sub: `CTR moy. : ${metrics.avgCTR}%`, color: [41, 128, 185] },
    { label: 'FACTURATION GLOBALE', value: `${(metrics.totalTTC / 1000000).toFixed(1)}M FCFA`, sub: `Conso. : ${metrics.tauxConsommation}%`, color: [39, 174, 96] },
    { label: 'COLLABORATEURS & TALENTS', value: `${metrics.activeUsersCount} U. · ${metrics.activeInfluencersCount} Inf.`, sub: 'Vivier actif Bridge', color: [142, 68, 173] }
  ];

  kpisToDraw.forEach((kpi, idx) => {
    const x = 14 + idx * (cardWidth + 5);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'S');

    // Petite barre latérale colorée
    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.roundedRect(x, y, 2.5, cardHeight, 1, 1, 'F');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 6, y + 6);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.value, x + 6, y + 13);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(kpi.sub, x + 6, y + 18.5);
  });

  // 3. Tableaux selon la vue sélectionnée
  y = 64;

  if (activeTab === 'ads') {
    // Entête tableau Ads
    doc.setFillColor(255, 121, 0);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('CLIENT & CAMPAGNE ADS', 16, y + 5);
    doc.text('CANAL', 95, y + 5);
    doc.text('STATUT', 125, y + 5);
    doc.text('BUDGET DÉPENSÉ', 150, y + 5);
    doc.text('IMPRESSIONS', 185, y + 5);
    doc.text('CLICS', 215, y + 5);
    doc.text('CTR (%)', 235, y + 5);
    doc.text('CPC (FCFA)', 255, y + 5);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    filteredAds.slice(0, 14).forEach((ad, i) => {
      const rowY = y + i * 8.5;
      if (rowY > pageHeight - 20) return;
      doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
      doc.rect(14, rowY, pageWidth - 28, 8.5, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, rowY + 8.5, pageWidth - 14, rowY + 8.5);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(ad.name.slice(0, 42), 16, rowY + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(ad.clientName, 16, rowY + 7.5);

      doc.setTextColor(15, 23, 42);
      doc.text(ad.channelName, 95, rowY + 5.5);
      doc.text(ad.status.toUpperCase(), 125, rowY + 5.5);
      doc.text(`${(ad.budgetSpent / 1000).toFixed(0)}K FCFA`, 150, rowY + 5.5);
      doc.text(ad.impressions.toLocaleString('fr-FR'), 185, rowY + 5.5);
      doc.text(ad.clics.toLocaleString('fr-FR'), 215, rowY + 5.5);
      doc.text(`${ad.ctr}%`, 235, rowY + 5.5);
      doc.text(`${ad.cpc} F`, 255, rowY + 5.5);
    });

  } else if (activeTab === 'finance') {
    // Entête tableau financier
    doc.setFillColor(255, 121, 0);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('POSTE BUDGÉTAIRE ANALYTIQUE', 16, y + 5);
    doc.text('BUDGET INITIAL ALLOUÉ', 110, y + 5);
    doc.text('PRÉVISION RECALIBRÉE', 160, y + 5);
    doc.text('DÉPENSÉ RÉEL', 210, y + 5);
    doc.text('TAUX CONSO', 255, y + 5);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    breakdowns.financialPostes.forEach((poste, i) => {
      const rowY = y + i * 11;
      doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
      doc.rect(14, rowY, pageWidth - 28, 11, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, rowY + 11, pageWidth - 14, rowY + 11);

      const taux = Math.round((poste.reel / poste.budget) * 100);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(poste.name, 16, rowY + 7);

      doc.setFont('helvetica', 'normal');
      doc.text(`${(poste.budget).toLocaleString('fr-FR')} FCFA`, 110, rowY + 7);
      doc.text(`${(poste.prevision).toLocaleString('fr-FR')} FCFA`, 160, rowY + 7);
      doc.text(`${(poste.reel).toLocaleString('fr-FR')} FCFA`, 210, rowY + 7);

      if (taux >= 80) doc.setTextColor(231, 76, 60);
      else doc.setTextColor(39, 174, 96);
      doc.setFont('helvetica', 'bold');
      doc.text(`${taux}%`, 255, rowY + 7);
    });

  } else {
    // Entête générique pour calendrier et overview
    doc.setFillColor(255, 121, 0);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TITRE DU CONTENU / SUJET', 16, y + 5);
    doc.text('CLIENT', 105, y + 5);
    doc.text('CANAL', 150, y + 5);
    doc.text('FORMAT', 180, y + 5);
    doc.text('STATUT', 215, y + 5);
    doc.text('SPONSORING', 250, y + 5);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    filteredPublications.slice(0, 14).forEach((pub, i) => {
      const rowY = y + i * 8.5;
      if (rowY > pageHeight - 20) return;
      doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
      doc.rect(14, rowY, pageWidth - 28, 8.5, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, rowY + 8.5, pageWidth - 14, rowY + 8.5);

      doc.setTextColor(15, 23, 42);
      doc.text(pub.titre.slice(0, 48), 16, rowY + 5.5);
      doc.text(pub.clientName, 105, rowY + 5.5);
      doc.text(pub.canal.toUpperCase(), 150, rowY + 5.5);
      doc.text(pub.type.toUpperCase(), 180, rowY + 5.5);

      if (pub.statut === 'publie') doc.setTextColor(39, 174, 96);
      else if (pub.statut === 'valide') doc.setTextColor(41, 128, 185);
      else if (pub.statut === 'en_validation') doc.setTextColor(243, 156, 18);
      else doc.setTextColor(140, 140, 140);

      doc.setFont('helvetica', 'bold');
      doc.text(pub.statut.toUpperCase(), 215, rowY + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(pub.sponsoring ? `${(pub.budgetAds / 1000).toFixed(0)}K F` : 'Organique', 250, rowY + 5.5);
    });
  }

  // 4. Pied de page certifié
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('© 2026 McCann Douala · Bridge Digital Operating System · Document confidentiel à usage exclusif des équipes de pilotage', 14, pageHeight - 7);
  doc.text('Certifié conforme aux métadonnées réelles de production · Page 1 / 1', pageWidth - 14, pageHeight - 7, { align: 'right' });

  const filename = `Fiche_Analytics_${activeTab}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
