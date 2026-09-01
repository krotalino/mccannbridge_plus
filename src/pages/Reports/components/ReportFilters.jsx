import { Search, Filter, X, Download, RotateCcw, Building2, Tag, CheckSquare } from 'lucide-react';
import { BRANDS_LIST, REPORT_TYPES, REPORT_STATUSES } from '../../../data/reportsData';

export default function ReportFilters({
  searchQuery,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  onReset,
  totalResults,
  onExportCsv
}) {
  const hasActiveFilters = searchQuery || selectedBrand !== 'all' || selectedType !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all';

  return (
    <div className="p-4 rounded-2xl cosmic-glass-card mb-5 border border-white/10">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par référence (REP-...), mot-clé, campagne, auteur..."
            className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl cosmic-glass-input text-slate-100 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl cosmic-glass-input cursor-pointer"
            >
              <option value="all" className="bg-[#0A0E27] text-white">🏢 Toutes les Marques (4)</option>
              {BRANDS_LIST.map((b) => (
                <option key={b.id} value={b.name} className="bg-[#0A0E27] text-white">{b.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl cosmic-glass-input cursor-pointer"
            >
              <option value="all" className="bg-[#0A0E27] text-white">📑 Tous les Types (6)</option>
              {REPORT_TYPES.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#0A0E27] text-white">{t.icon} {t.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl cosmic-glass-input cursor-pointer"
            >
              <option value="all" className="bg-[#0A0E27] text-white">🔄 Tous les Statuts (12)</option>
              {Object.entries(REPORT_STATUSES).map(([key, st]) => (
                <option key={key} value={key} className="bg-[#0A0E27] text-white">{st.label}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl cosmic-glass-input cursor-pointer"
            >
              <option value="all" className="bg-[#0A0E27] text-white">⚡ Priorités</option>
              <option value="urgente" className="bg-[#0A0E27] text-red-400">🔥 Urgente</option>
              <option value="haute" className="bg-[#0A0E27] text-orange-400">🟠 Haute</option>
              <option value="normale" className="bg-[#0A0E27] text-emerald-400">🟢 Normale</option>
            </select>
          </div>

          {/* Action buttons */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-[#FF6600] px-3 py-2 rounded-xl cosmic-btn-glass cursor-pointer"
              title="Réinitialiser tous les filtres"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1 text-xs font-bold text-white px-3.5 py-2 rounded-xl cosmic-btn-glass cursor-pointer hover:border-[#00D4FF]"
            title="Exporter la sélection en CSV"
          >
            <Download size={13} />
            <span>Export ({totalResults})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
