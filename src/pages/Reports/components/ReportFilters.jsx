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
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 shadow-xs">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par référence (REP-...), mot-clé, campagne, auteur..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
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
              className="text-xs font-medium py-2 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">🏢 Toutes les Marques (4)</option>
              {BRANDS_LIST.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="text-xs font-medium py-2 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">📑 Tous les Types (6)</option>
              {REPORT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="text-xs font-medium py-2 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">🔄 Tous les Statuts (12)</option>
              {Object.entries(REPORT_STATUSES).map(([key, st]) => (
                <option key={key} value={key}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="text-xs font-medium py-2 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">⚡ Priorités</option>
              <option value="urgente">🔥 Urgente</option>
              <option value="haute">🟠 Haute</option>
              <option value="normale">🟢 Normale</option>
            </select>
          </div>

          {/* Action buttons */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-orange-600 px-2.5 py-2 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
              title="Réinitialiser tous les filtres"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
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
