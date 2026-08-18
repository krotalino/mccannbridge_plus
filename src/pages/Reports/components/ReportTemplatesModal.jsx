import { X, Check, ArrowRight, Sparkles, Clock, Layers, ShieldCheck, Download } from 'lucide-react';
import { REPORT_TEMPLATES, REPORT_SECTIONS_CATALOG } from '../../../data/reportsData';

export default function ReportTemplatesModal({ isOpen, onClose, onSelectTemplate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                <Sparkles size={18} />
              </span>
              <h2 className="text-lg font-bold text-gray-900">
                Bibliothèque des Modèles de Rapports Standardisés
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Sélectionnez un modèle préconfiguré pour standardiser la structure, les KPI et le SLA cible.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
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
                className="border border-gray-200 rounded-xl p-5 hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between bg-white group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 bg-orange-50 rounded-xl border border-orange-100">
                        {tpl.icon}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {tpl.title}
                        </h3>
                        <span className="inline-block text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full mt-0.5">
                          Type : {tpl.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-3.5">
                    {tpl.desc}
                  </p>

                  {/* SLA Target */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100 mb-3">
                    <Clock size={13} className="text-amber-600 shrink-0" />
                    <span><strong>SLA Cible :</strong> {tpl.sla}</span>
                  </div>

                  {/* Sections included */}
                  <div className="mb-3">
                    <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Layers size={12} className="text-gray-400" />
                      <span>{tpl.recommendedSections.length} sections incluses :</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tpl.recommendedSections.slice(0, 5).map((secId) => {
                        const secDef = REPORT_SECTIONS_CATALOG.find(s => s.id === secId);
                        return (
                          <span key={secId} className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                            {secDef?.label || secId}
                          </span>
                        );
                      })}
                      {tpl.recommendedSections.length > 5 && (
                        <span className="text-[10px] bg-gray-200 text-gray-800 font-bold px-1.5 py-0.5 rounded">
                          +{tpl.recommendedSections.length - 5} autres
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom action button */}
                <div className="pt-3 border-t border-gray-100 mt-2">
                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 shadow-xs transition-colors"
                  >
                    <span>Utiliser ce modèle</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Garantie de conformité au cahier des charges McCann × Orange 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
