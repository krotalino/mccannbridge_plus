import { X, Check, ArrowRight, Sparkles, Clock, Layers, ShieldCheck, Download } from 'lucide-react';
import { REPORT_TEMPLATES, REPORT_SECTIONS_CATALOG } from '../../../data/reportsData';

export default function ReportTemplatesModal({ isOpen, onClose, onSelectTemplate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col cosmic-glass-card border border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#FF6600]/20 text-[#FF8C00] border border-[#FF6600]/30">
                <Sparkles size={18} />
              </span>
              <h2 className="text-lg font-black text-white">
                Bibliothèque des Modèles de Rapports Standardisés
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sélectionnez un modèle préconfiguré pour standardiser la structure, les KPI et le SLA cible.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_TEMPLATES.map((tpl) => {
            return (
              <div
                key={tpl.id}
                className="border border-white/10 rounded-2xl p-5 hover:border-[#FF6600]/50 hover:shadow-[0_0_25px_rgba(255,102,0,0.2)] transition-all flex flex-col justify-between bg-black/40 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2.5 bg-white/5 rounded-xl border border-white/10">
                        {tpl.icon}
                      </span>
                      <div>
                        <h3 className="text-sm font-black text-white group-hover:text-[#FF8C00] transition-colors">
                          {tpl.title}
                        </h3>
                        <span className="inline-block text-[10px] font-black text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded-full border border-[#00D4FF]/20 mt-0.5 uppercase tracking-wider">
                          Type : {tpl.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3.5 mt-2">
                    {tpl.desc}
                  </p>

                  {/* SLA Target */}
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20 mb-3.5">
                    <Clock size={14} className="text-amber-400 shrink-0" />
                    <span><strong>SLA Cible :</strong> {tpl.sla}</span>
                  </div>

                  {/* Sections included */}
                  <div className="mb-3">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers size={13} className="text-slate-500" />
                      <span>{tpl.recommendedSections.length} sections incluses :</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tpl.recommendedSections.slice(0, 5).map((secId) => {
                        const secDef = REPORT_SECTIONS_CATALOG.find(s => s.id === secId);
                        return (
                          <span key={secId} className="text-[10px] bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded-md">
                            {secDef?.label || secId}
                          </span>
                        );
                      })}
                      {tpl.recommendedSections.length > 5 && (
                        <span className="text-[10px] bg-white/10 text-white font-bold px-2 py-0.5 rounded-md">
                          +{tpl.recommendedSections.length - 5} autres
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom action button */}
                <div className="pt-4 border-t border-white/10 mt-3">
                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl cosmic-btn-primary text-xs font-black shadow-md cursor-pointer transition-all"
                  >
                    <span>Utiliser ce modèle</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
