import { useState } from 'react';
import { 
  X, Download, FileText, Presentation, Table, Share2, 
  Copy, Check, ShieldCheck, Lock, ExternalLink, Sparkles, Printer 
} from 'lucide-react';

export default function ReportExportModal({ isOpen, onClose, report }) {
  const [activeExportType, setActiveExportType] = useState('pdf'); // pdf | ppt | csv | link
  const [copied, setCopied] = useState(false);
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
        window.print();
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-orange-100 text-[#FF7900] px-2 py-0.5 rounded">
                {report.id}
              </span>
              <h2 className="text-base font-bold text-dark">
                Centre d'Export & Partage du Rapport
              </h2>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Génération des livrables conformes à la charte McCann × Orange Cameroun
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-dark text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Format Selection Tabs */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 border-b border-gray-100">
          {[
            { id: 'pdf', label: 'PDF Officiel', icon: <FileText size={18} /> },
            { id: 'ppt', label: 'PowerPoint (.PPTX)', icon: <Presentation size={18} /> },
            { id: 'csv', label: 'Excel / CSV Bruts', icon: <Table size={18} /> },
            { id: 'link', label: 'Lien Web Sécurisé', icon: <Share2 size={18} /> }
          ].map(f => {
            const isSel = activeExportType === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveExportType(f.id)}
                className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                  isSel
                    ? 'bg-orange-50 border-[#FF7900] text-[#FF7900] font-bold shadow-xs'
                    : 'bg-white border-gray-200 text-muted hover:text-dark hover:border-gray-300'
                }`}
              >
                <div className={isSel ? 'text-[#FF7900]' : 'text-gray-500'}>{f.icon}</div>
                <span className="text-xs mt-1 font-semibold">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Export Body Preview */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* PDF Preview */}
          {activeExportType === 'pdf' && (
            <div className="space-y-3">
              <div className="border border-dashed border-orange-300 bg-orange-50/30 rounded-xl p-5 text-center">
                <FileText size={36} className="mx-auto text-[#FF7900] mb-2" />
                <h3 className="text-sm font-bold text-dark">
                  {report.title} — Livrable PDF Haute Définition
                </h3>
                <p className="text-xs text-muted mt-1">
                  Format A4 Paysage • Charte McCann × Orange 2026 • 12 pages consolidées
                </p>
              </div>

              <div className="space-y-2 text-xs text-dark bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSpeeches}
                    onChange={(e) => setIncludeSpeeches(e.target.checked)}
                    className="rounded text-[#FF7900]"
                  />
                  <span>Inclure le détail complet des fiches de prises de parole</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBenchmark}
                    onChange={(e) => setIncludeBenchmark(e.target.checked)}
                    className="rounded text-[#FF7900]"
                  />
                  <span>Inclure la matrice concurrentielle (MTN vs Camtel)</span>
                </label>
              </div>
            </div>
          )}

          {/* PPT Preview */}
          {activeExportType === 'ppt' && (
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="text-xs font-bold text-dark mb-2.5 flex items-center gap-1.5 uppercase">
                  <Presentation size={15} className="text-[#FF7900]" />
                  <span>Structure de la Présentation PowerPoint (8 Slides) :</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-dark">
                  <div className="p-2 bg-white rounded border border-gray-200 font-medium">1. Titre & Périmètre</div>
                  <div className="p-2 bg-white rounded border border-gray-200 font-medium">2. Synthèse Exécutive & KPIs</div>
                  <div className="p-2 bg-white rounded border border-gray-200 font-medium">3. Évolution Communautés</div>
                  <div className="p-2 bg-white rounded border border-gray-200 font-medium">4. Performance par Réseau</div>
                  <div className="p-2 bg-white rounded border border-gray-200 font-medium">5. Top Publications & Formats</div>
                  <div className="p-2 bg-white rounded border border-gray-200 font-medium">6. Benchmark Orange vs MTN vs Camtel</div>
                  <div className="p-2 bg-white rounded border border-gray-200 font-medium">7. Bilan Média & Budget</div>
                  <div className="p-2 bg-white rounded border border-gray-200 font-medium">8. Recommandations Stratégiques</div>
                </div>
              </div>
            </div>
          )}

          {/* CSV Preview */}
          {activeExportType === 'csv' && (
            <div className="space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-xs text-green-900 space-y-1">
                <div className="font-bold text-sm">Export Tabulaire CSV / Excel Prêt</div>
                <p>Contient toutes les métriques brutes, reach par plateforme, engagements, clics et conversions pour exploitation directe dans vos tableurs.</p>
              </div>
            </div>
          )}

          {/* Secure Web Link */}
          {activeExportType === 'link' && (
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-xs">
                <div className="font-bold text-dark mb-1">Lien de consultation sécurisé (Tokenisé)</div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="form-input flex-1 font-mono text-[11px] bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="btn btn-orange text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
                <p className="text-muted text-[11px] mt-2">Lien valable 30 jours, réservé aux collaborateurs Orange Cameroun et McCann.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost border px-4 py-2 text-xs font-bold"
          >
            Fermer
          </button>

          {activeExportType !== 'link' && (
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleTriggerDownload(activeExportType)}
              className="btn btn-orange text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 shadow-sm"
            >
              <Download size={14} />
              <span>{isGenerating ? 'Génération en cours...' : `Télécharger le fichier (${activeExportType.toUpperCase()})`}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
