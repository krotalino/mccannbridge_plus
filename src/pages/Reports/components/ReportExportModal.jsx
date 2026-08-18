import { useState } from 'react';
import { 
  X, Download, FileText, Presentation, Table, Share2, 
  Copy, Check, ShieldCheck, Lock, ExternalLink, Sparkles, Printer 
} from 'lucide-react';

export default function ReportExportModal({ isOpen, onClose, report }) {
  const [activeExportType, setActiveExportType] = useState('pdf'); // pdf | ppt | csv | link
  const [copied, setCopied] = useState(false);
  const [includeRawData, setIncludeRawData] = useState(true);
  const [includeSpeeches, setIncludeSpeeches] = useState(true);
  const [includeBenchmark, setIncludeBenchmark] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !report) return null;

  const shareableUrl = `https://bridge.mccann.cm/share/rep/${report.id.toLowerCase()}?token=sec_${Date.now().toString(36)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerDownload = (format) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      if (format === 'csv') {
        const headers = ['Rubrique', 'Metrique', 'Valeur', 'Comparatif N-1', 'Commentaire'];
        const rows = [
          ['Portée Globale', 'Reach Cumulé', '2 450 000', '+14.2%', 'Surperformance sur TikTok & Reels'],
          ['Interactions', 'Total Engagements', '142 500', '+18.5%', 'Fort engagement sur le jeu concours Pulse'],
          ['Taux d’engagement', 'Engagement Moyen', '5.80%', '+0.4 pt', 'Orange vs 3.90% (MTN Cameroon)'],
          ['Conversions', 'Souscriptions Maxit', '9 200', '115% objectif', 'Excellente conversion du tutoriel vidéo'],
          ['Investissement Média', 'Budget Consommé', '1 450 000 FCFA', 'CPM 592 FCFA', 'CPC optimisé à 102 FCFA']
        ];
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${report.id}_Donnees_Brutes.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Trigger simulated document print / export
        window.print();
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                {report.id}
              </span>
              <h2 className="text-base font-bold text-gray-900">
                Centre d'Export & Partage Sécurisé
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Génération des livrables conformes à la charte graphique McCann × Orange Cameroun
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Format Selection Tabs */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-gray-100/70 border-b border-gray-200">
          <button
            onClick={() => setActiveExportType('pdf')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              activeExportType === 'pdf'
                ? 'bg-white border-orange-500 text-orange-950 font-bold shadow-xs ring-1 ring-orange-400'
                : 'bg-white/60 border-transparent text-gray-600 hover:bg-white'
            }`}
          >
            <FileText size={18} className={activeExportType === 'pdf' ? 'text-orange-600' : 'text-gray-500'} />
            <span className="text-xs mt-1">PDF Officiel</span>
          </button>

          <button
            onClick={() => setActiveExportType('ppt')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              activeExportType === 'ppt'
                ? 'bg-white border-orange-500 text-orange-950 font-bold shadow-xs ring-1 ring-orange-400'
                : 'bg-white/60 border-transparent text-gray-600 hover:bg-white'
            }`}
          >
            <Presentation size={18} className={activeExportType === 'ppt' ? 'text-orange-600' : 'text-gray-500'} />
            <span className="text-xs mt-1">PowerPoint (.PPTX)</span>
          </button>

          <button
            onClick={() => setActiveExportType('csv')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              activeExportType === 'csv'
                ? 'bg-white border-orange-500 text-orange-950 font-bold shadow-xs ring-1 ring-orange-400'
                : 'bg-white/60 border-transparent text-gray-600 hover:bg-white'
            }`}
          >
            <Table size={18} className={activeExportType === 'csv' ? 'text-orange-600' : 'text-gray-500'} />
            <span className="text-xs mt-1">Excel / CSV Bruts</span>
          </button>

          <button
            onClick={() => setActiveExportType('link')}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              activeExportType === 'link'
                ? 'bg-white border-orange-500 text-orange-950 font-bold shadow-xs ring-1 ring-orange-400'
                : 'bg-white/60 border-transparent text-gray-600 hover:bg-white'
            }`}
          >
            <Share2 size={18} className={activeExportType === 'link' ? 'text-orange-600' : 'text-gray-500'} />
            <span className="text-xs mt-1">Lien Web Sécurisé</span>
          </button>
        </div>

        {/* Export Body Preview */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* PDF Preview */}
          {activeExportType === 'pdf' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 bg-gray-50 text-center">
                <FileText size={36} className="mx-auto text-orange-600 mb-2" />
                <h3 className="text-sm font-bold text-gray-900">
                  {report.title} — Livrable PDF Standardisé
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Format A4 Paysage haute définition • Charte McCann × Orange 2026 • 12 pages
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 text-xs text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSpeeches}
                    onChange={(e) => setIncludeSpeeches(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Inclure le détail complet des fiches de prises de parole</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBenchmark}
                    onChange={(e) => setIncludeBenchmark(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Inclure la matrice concurrentielle (MTN vs Camtel)</span>
                </label>
              </div>
            </div>
          )}

          {/* PPT Preview */}
          {activeExportType === 'ppt' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                  <Presentation size={15} className="text-orange-600" />
                  <span>Structure de la Présentation PowerPoint (8 Slides) :</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
                  <div className="p-2 bg-white rounded border">1. Slide de Titre & Périmètre</div>
                  <div className="p-2 bg-white rounded border">2. Résumé Exécutif & KPI Clés</div>
                  <div className="p-2 bg-white rounded border">3. Évolution des Communautés</div>
                  <div className="p-2 bg-white rounded border">4. Performance par Réseau Social</div>
                  <div className="p-2 bg-white rounded border">5. Top 5 Best Posts & Créas</div>
                  <div className="p-2 bg-white rounded border">6. Benchmark Orange vs MTN vs Camtel</div>
                  <div className="p-2 bg-white rounded border">7. Analyse Média & ROAS</div>
                  <div className="p-2 bg-white rounded border">8. Recommandations Stratégiques</div>
                </div>
              </div>
            </div>
          )}

          {/* CSV Preview */}
          {activeExportType === 'csv' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                <div className="font-bold mb-1">Export Excel / CSV Prêt</div>
                <p>Contient toutes les métriques brutes, la portée par canal, les engagements, les clics et les conversions pour traitement dans vos modèles décisionnels.</p>
              </div>
            </div>
          )}

          {/* Secure Web Link */}
          {activeExportType === 'link' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Lien de Consultation Sécurisé
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="flex-1 text-xs font-mono p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Sécurité & Confidentialité</span>
                </div>
                <p>Lien chiffré valide pendant 30 jours. Consultation directe sans authentification requise.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Fermer
          </button>

          {activeExportType !== 'link' && (
            <button
              onClick={() => handleTriggerDownload(activeExportType)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              {isGenerating ? (
                <span>Génération en cours...</span>
              ) : (
                <>
                  <Download size={15} />
                  <span>Télécharger ({activeExportType.toUpperCase()})</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
