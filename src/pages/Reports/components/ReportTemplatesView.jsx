import { useState } from 'react';
import { 
  Sparkles, Clock, Layers, CheckCircle, ArrowRight, 
  Copy, Plus, ShieldCheck, Check, Search, Filter
} from 'lucide-react';
import { REPORT_TEMPLATES, REPORT_SECTIONS_CATALOG } from '../../../data/reportsData';

export default function ReportTemplatesView({ onUseTemplate }) {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredTemplates = REPORT_TEMPLATES.filter(tpl => {
    const matchesSearch = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || tpl.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDuplicate = (tplId) => {
    setCopiedId(tplId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-10">
      
      {/* En-tête de section (Style Influence) */}
      <div className="flex flex-wrap items-center justify-between gap-16 mb-16">
        <div className="flex items-center gap-10">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#FF7900',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255, 121, 0, 0.25)',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
              Bibliothèque des Modèles de Reporting Standardisés
            </h2>
            <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
              Modèles types garantissant la standardisation des rubriques obligatoires, des KPI socle et des SLA contractuels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
          <ShieldCheck size={15} />
          <span>Taux de réutilisation : <strong>88%</strong></span>
        </div>
      </div>

      {/* Barre de Recherche (Style inf-search-panel) */}
      <div className="inf-search-panel" style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 16 }}>
        <div className="inf-search-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Rechercher un modèle de rapport (ex: Hebdomadaire, Campagne, Benchmark)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 2, minWidth: 240 }}
          />

          <select
            className="form-input"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ flex: 1, minWidth: 180 }}
          >
            <option value="all">Tous les types de rapport</option>
            <option value="hebdomadaire">Hebdomadaire (SLA J+2)</option>
            <option value="mensuel">Mensuel (SLA J+5)</option>
            <option value="spontane">Spontané / Urgent (SLA &lt;24h)</option>
            <option value="campagne">Campagne (SLA J+3)</option>
            <option value="benchmark">Benchmark (SLA J+7)</option>
            <option value="executif">Exécutif Direction (SLA J+4)</option>
          </select>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="card p-16 flex flex-col justify-between hover:border-orange-400 hover:shadow-md transition-all"
            style={{ 
              background: '#fff', 
              borderRadius: 8, 
              border: '1px solid #e9ecef', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-muted bg-gray-100 px-2 py-0.5 rounded">
                  {tpl.id}
                </span>
                <span className="tag" style={{ background: '#FF790015', color: '#FF7900', fontSize: 10, fontWeight: 700 }}>
                  <Clock size={11} className="inline mr-1" />
                  SLA {tpl.sla}
                </span>
              </div>

              <h3 className="font-bold text-dark text-sm mb-1.5">
                {tpl.title}
              </h3>

              <p className="text-xs text-muted line-clamp-2 mb-4 leading-relaxed">
                {tpl.desc}
              </p>

              {/* Sections list */}
              {(() => {
                const sections = tpl.sections || tpl.recommendedSections || [];
                return (
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                      Rubriques types incluses ({sections.length}) :
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sections.map(secId => {
                        const sec = REPORT_SECTIONS_CATALOG.find(s => s.id === secId);
                        return (
                          <span
                            key={secId}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-50 text-dark border border-gray-200"
                          >
                            {sec?.label || secId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom button */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleDuplicate(tpl.id)}
                className="btn btn-ghost text-xs text-muted hover:text-dark flex items-center gap-1 p-1"
                title="Copier la configuration"
              >
                {copiedId === tpl.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copiedId === tpl.id ? 'Copié !' : 'Dupliquer'}</span>
              </button>

              <button
                type="button"
                onClick={() => onUseTemplate && onUseTemplate(tpl)}
                className="btn btn-orange text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded"
              >
                <span>Créer depuis ce modèle</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
