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
        // Print / simulated high-res document output
        window.print();
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col cosmic-glass-card border border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xs bg-[#FF6600]/20 text-[#FF8C00] px-2 py-0.5 rounded border border-[#FF6600]/30">
                {report.id}
              </span>
              <h2 className="text-base font-black text-white">
                Centre d'Export & Partage Sécurisé
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Génération des livrables conformes à la charte graphique McCann × Orange Cameroun
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Format Selection Tabs */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-black/40 border-b border-white/10">
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
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-r from-[#FF6600]/20 to-[#FF8C00]/20 border-[#FF6600] text-white font-black shadow-[0_0_15px_rgba(255,102,0,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className={isSel ? 'text-[#FF8C00]' : 'text-slate-400'}>{f.icon}</div>
                <span className="text-xs mt-1.5 font-bold">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Export Body Preview */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* PDF Preview */}
          {activeExportType === 'pdf' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 bg-black/30 text-center">
                <FileText size={40} className="mx-auto text-[#FF6600] mb-2 drop-shadow-[0_0_12px_rgba(255,102,0,0.5)]" />
                <h3 className="text-sm font-black text-white">
                  {report.title} — Livrable PDF Haute Définition
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Format A4 Paysage haute résolution • Charte McCann × Orange 2026 • 12 pages consolidées
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 text-xs text-slate-300 bg-white/5 p-4 rounded-xl border border-white/10">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSpeeches}
                    onChange={(e) => setIncludeSpeeches(e.target.checked)}
                    className="rounded text-[#FF6600] focus:ring-[#FF6600]"
                  />
                  <span>Inclure le détail complet des fiches de prises de parole</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBenchmark}
                    onChange={(e) => setIncludeBenchmark(e.target.checked)}
                    className="rounded text-[#FF6600] focus:ring-[#FF6600]"
                  />
                  <span>Inclure la matrice concurrentielle cosmique (MTN vs Camtel)</span>
                </label>
              </div>
            </div>
          )}

          {/* PPT Preview */}
          {activeExportType === 'ppt' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border border-white/10 rounded-xl p-5 bg-black/40">
                <div className="text-xs font-black text-[#FF8C00] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <Presentation size={16} />
                  <span>Structure de la Présentation PowerPoint (8 Slides) :</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">1. Slide de Titre & Périmètre</div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">2. Résumé Exécutif & KPI Clés</div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">3. Évolution des Communautés</div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">4. Performance par Réseau Social</div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">5. Top 5 Best Posts & Créas</div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">6. Benchmark Orange vs MTN vs Camtel</div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">7. Analyse Média & ROAS</div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">8. Recommandations Stratégiques</div>
                </div>
              </div>
            </div>
          )}

          {/* CSV Preview */}
          {activeExportType === 'csv' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-slate-200 space-y-1">
                <div className="font-black text-emerald-400 text-sm">Export Tabulaire CSV / Excel Prêt</div>
                <p className="leading-relaxed">Contient toutes les métriques brutes, la portée par canal, les engagements, les clics et les conversions pour traitement dans vos modèles décisionnels.</p>
              </div>
            </div>
          )}

          {/* Secure Web Link */}
          {activeExportType === 'link' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Lien de Consultation Sécurisé & Chiffré
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="flex-1 text-xs font-mono p-3 cosmic-glass-input text-[#00D4FF]"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-5 py-2.5 cosmic-btn-primary text-white rounded-xl text-xs font-black transition-colors shrink-0 cursor-pointer"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-emerald-400">
                  <ShieldCheck size={16} />
                  <span>Sécurité & Confidentialité Certifiée</span>
                </div>
                <p className="text-slate-400">Lien chiffré HTTPS valide pendant 30 jours. Consultation directe sans authentification requise.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 cosmic-btn-glass rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Fermer
          </button>

          {activeExportType !== 'link' && (
            <button
              onClick={() => handleTriggerDownload(activeExportType)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 cosmic-btn-primary rounded-xl text-xs font-black shadow-lg transition-all cursor-pointer"
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
