import React, { useState } from 'react';
import { X, Upload, FileText, Download, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function CsvImportModal({ isOpen, onClose, onImportData }) {
  if (!isOpen) return null;

  const [importTarget, setImportTarget] = useState('social'); // 'social' | 'display'
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successCount, setSuccessCount] = useState(0);

  const sampleSocialCsv = `Client;Plateforme;NomCampagne;DateDebut;DateFin;BudgetTotal;BudgetDepense;Impressions;Clics;CTR;CPC;Statut;Objectif
Orange Cameroun;Meta;Promo Fibre Etudiants;2026-09-01;2026-09-30;1200000;850000;650000;18200;2.80;46.7;Active;Acquisition
Canal+ Cameroun;TikTok;Grand Derby Soir;2026-09-10;2026-09-25;1500000;1200000;1100000;24000;2.18;50.0;Active;Engagement`;

  const sampleDisplayCsv = `Client;NomCampagne;TypeDisplay;Format;Periode;BudgetTotal;BudgetDepense;Impressions;Clics;CTR;CPM;Conversions;Statut
TotalEnergies;Fleet B2B 2026;Bannière;300x250 Pavé;01-30 Sep 2026;1800000;1400000;1200000;14400;1.20;1166;350;Active
Orange Cameroun;Max It Banner;Natif;Natif In-feed;10-30 Sep 2026;1100000;750000;900000;11700;1.30;833;280;Active`;

  const handleDownloadSample = () => {
    const content = importTarget === 'social' ? sampleSocialCsv : sampleDisplayCsv;
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modele_import_${importTarget}_ads.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || '';
      setCsvText(text);
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const parseCsv = (raw) => {
    setErrorMsg('');
    setParsedRows([]);
    try {
      const lines = raw.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        setErrorMsg('Le fichier CSV doit comporter au moins une ligne d\'en-tête et une ligne de données.');
        return;
      }

      const delimiter = lines[0].includes(';') ? ';' : ',';
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length < 3) continue;

        if (importTarget === 'social') {
          const client = values[0] || 'Client Inconnu';
          const platform = values[1] || 'Meta';
          const campaignName = values[2] || `Campagne ${i}`;
          const startDate = values[3] || '2026-09-01';
          const endDate = values[4] || '2026-09-30';
          const budgetTotal = parseFloat(values[5]) || 1000000;
          const budgetSpent = parseFloat(values[6]) || 500000;
          const impressions = parseInt(values[7]) || 100000;
          const clics = parseInt(values[8]) || 2000;
          const ctr = parseFloat(values[9]) || (impressions > 0 ? Number(((clics / impressions) * 100).toFixed(2)) : 1.5);
          const cpc = parseFloat(values[10]) || (clics > 0 ? Math.round(budgetSpent / clics) : 50);
          const status = values[11] || 'Active';
          const objective = values[12] || 'Trafic & Portée';

          rows.push({
            id: `SOC-IMP-${Date.now().toString().slice(-4)}-${i}`,
            client,
            clientLogo: client.toLowerCase().includes('orange') ? '🍊' : client.toLowerCase().includes('canal') ? '📺' : '🏢',
            platform,
            campaignName,
            startDate,
            endDate,
            budgetTotal,
            budgetSpent,
            impressions,
            clics,
            ctr,
            cpc,
            status,
            objective,
            targeting: 'Douala, Yaoundé · 18-35 ans',
            copyText: `Communication sponsorisée officielle ${client} sur ${platform}.`,
            visualUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
            organicReach: Math.round(impressions * 0.25),
            paidReach: Math.round(impressions * 0.75),
            budgetHistory: [
              {
                id: `BH-IMP-${i}`,
                date: new Date().toLocaleDateString('fr-FR'),
                author: 'Import CSV Quotidien',
                changeAmount: `Import initial : ${budgetTotal.toLocaleString('fr-FR')} FCFA`,
                newBudget: budgetTotal,
                reason: 'Importation automatique de données'
              }
            ]
          });
        } else {
          const client = values[0] || 'Client Inconnu';
          const campaignName = values[1] || `Display ${i}`;
          const displayType = values[2] || 'Bannière';
          const format = values[3] || '300x250 Pavé';
          const period = values[4] || 'Septembre 2026';
          const budgetTotal = parseFloat(values[5]) || 1500000;
          const budgetSpent = parseFloat(values[6]) || 750000;
          const impressions = parseInt(values[7]) || 120000;
          const clics = parseInt(values[8]) || 1800;
          const ctr = parseFloat(values[9]) || (impressions > 0 ? Number(((clics / impressions) * 100).toFixed(2)) : 1.2);
          const cpm = parseFloat(values[10]) || 950;
          const conversions = parseInt(values[11]) || 50;
          const status = values[12] || 'Active';

          rows.push({
            id: `DIS-IMP-${Date.now().toString().slice(-4)}-${i}`,
            client,
            clientLogo: client.toLowerCase().includes('orange') ? '🍊' : client.toLowerCase().includes('canal') ? '📺' : '🏢',
            campaignName,
            displayType,
            format,
            period,
            startDate: '2026-09-01',
            endDate: '2026-09-30',
            budgetTotal,
            budgetSpent,
            impressions,
            clics,
            ctr,
            cpm,
            conversions,
            conversionRate: 2.5,
            status,
            creativePreview: {
              headline: campaignName,
              description: `Offre publicitaire programmatique ${client}`,
              callToAction: 'En savoir plus',
              imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
              brandColor: '#ff7900'
            },
            placements: [
              { site: 'ActuCameroun.com', url: 'https://actucameroun.com', format, impressions: Math.round(impressions * 0.4), clics: Math.round(clics * 0.4), ctr: 1.2 },
              { site: 'Camfoot.com', url: 'https://camfoot.com', format, impressions: Math.round(impressions * 0.35), clics: Math.round(clics * 0.35), ctr: 1.2 },
              { site: 'Google Display Network', url: 'https://google.com/ads', format, impressions: Math.round(impressions * 0.25), clics: Math.round(clics * 0.25), ctr: 1.1 },
            ]
          });
        }
      }

      setParsedRows(rows);
    } catch (err) {
      setErrorMsg(`Erreur d'analyse CSV : ${err.message}`);
    }
  };

  const handleValidateImport = () => {
    if (parsedRows.length === 0) return;
    onImportData(importTarget, parsedRows);
    setSuccessCount(parsedRows.length);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Importer des données de performance (CSV)</h3>
              <p className="text-xs text-gray-500">Mise à jour rapide des métriques Social Ads ou Display Programmatique</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

          {/* Type selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setImportTarget('social'); setParsedRows([]); }}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                importTarget === 'social' 
                  ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              📥 Fichier pour Social Ads
            </button>
            <button
              onClick={() => { setImportTarget('display'); setParsedRows([]); }}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                importTarget === 'display' 
                  ? 'bg-cyan-50 border-cyan-600 text-cyan-800 shadow-xs' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              📥 Fichier pour Display Programmatique
            </button>
          </div>

          {/* Sample Download Bar */}
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <FileText className="w-4 h-4 text-orange-600" />
              <span>Besoin du gabarit de colonnes standard ?</span>
            </div>
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-bold px-2.5 py-1 bg-white border border-orange-200 rounded-lg shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger le modèle CSV</span>
            </button>
          </div>

          {/* Upload Area */}
          <div className="p-6 border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-2xl bg-gray-50/50 text-center transition-colors">
            <input
              type="file"
              accept=".csv,text/csv"
              id="csv-file-input"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="csv-file-input" className="cursor-pointer block space-y-2">
              <div className="w-12 h-12 mx-auto bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-900">
                Cliquez pour sélectionner votre fichier .CSV
              </p>
              <p className="text-xs text-gray-500">
                Supporte les séparateurs point-virgule (;) et virgule (,)
              </p>
            </label>
          </div>

          {/* Paste manual CSV alternative */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Ou collez directement vos lignes CSV ici :
            </label>
            <textarea
              rows={4}
              value={csvText}
              onChange={e => {
                setCsvText(e.target.value);
                parseCsv(e.target.value);
              }}
              placeholder={`Client;Plateforme;NomCampagne;...`}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-800 focus:bg-white focus:border-orange-500 outline-none resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Rows Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900">
                  Aperçu des données prêtes à être importées ({parsedRows.length} lignes)
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Format valide
                </span>
              </div>

              <div className="overflow-x-auto max-h-44 border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50 text-[10px] text-gray-600 uppercase border-b border-gray-200 font-bold">
                    <tr>
                      <th className="py-2 px-3">Client</th>
                      <th className="py-2 px-3">Campagne</th>
                      <th className="py-2 px-3 text-right">Budget dépensé</th>
                      <th className="py-2 px-3 text-right">Impressions</th>
                      <th className="py-2 px-3 text-right">Clics</th>
                      <th className="py-2 px-3 text-right">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="py-2 px-3 font-semibold text-gray-900">{r.client}</td>
                        <td className="py-2 px-3 max-w-xs truncate">{r.campaignName}</td>
                        <td className="py-2 px-3 text-right font-mono text-gray-900 font-bold">{r.budgetSpent.toLocaleString('fr-FR')} F</td>
                        <td className="py-2 px-3 text-right font-mono">{r.impressions.toLocaleString('fr-FR')}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-gray-900">{r.clics.toLocaleString('fr-FR')}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-orange-600">{r.ctr}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successCount > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successCount} campagnes importées avec succès dans le tableau de bord !</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
          >
            Fermer
          </button>
          <button
            onClick={handleValidateImport}
            disabled={parsedRows.length === 0}
            className="btn btn-orange px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Confirmer l'import ({parsedRows.length})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
