import { Search, X, RotateCcw, Download } from 'lucide-react';
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
    <div className="inf-search-panel" style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 16 }}>
      <div className="inf-search-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Search input */}
        <div style={{ flex: 2, minWidth: 240, position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Rechercher par référence (REP-...), mot-clé, campagne, auteur..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: '100%', paddingRight: 28 }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                fontSize: 14
              }}
              title="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>

        {/* Brand select */}
        <select
          className="form-input"
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          style={{ flex: 1, minWidth: 150 }}
        >
          <option value="all">Toutes marques ({BRANDS_LIST.length})</option>
          {BRANDS_LIST.map((b) => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
        </select>

        {/* Type select */}
        <select
          className="form-input"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          style={{ flex: 1, minWidth: 160 }}
        >
          <option value="all">Tous types de rapport ({REPORT_TYPES.length})</option>
          {REPORT_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
          ))}
        </select>

        {/* Status select */}
        <select
          className="form-input"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{ flex: 1, minWidth: 160 }}
        >
          <option value="all">Tous statuts workflow</option>
          {Object.entries(REPORT_STATUSES).map(([key, st]) => (
            <option key={key} value={key}>{st.label}</option>
          ))}
        </select>

        {/* Priority select */}
        <select
          className="form-input"
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          style={{ flex: 1, minWidth: 130 }}
        >
          <option value="all">Toutes priorités</option>
          <option value="urgente">🔥 Urgente (&lt;24h)</option>
          <option value="haute">🟠 Haute (&lt;48h)</option>
          <option value="normale">🟢 Normale (Standard)</option>
        </select>

        {/* Action buttons */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="btn btn-ghost border"
            style={{ fontWeight: 600, fontSize: 12, padding: '8px 12px', background: '#fff' }}
            title="Réinitialiser tous les filtres"
          >
            ✕ Réinitialiser
          </button>
        )}

        {onExportCsv && (
          <button
            onClick={onExportCsv}
            className="btn btn-ghost border"
            style={{ fontWeight: 600, fontSize: 12, padding: '8px 14px', background: '#fff' }}
            title="Exporter la sélection en CSV"
          >
            📥 Exporter ({totalResults})
          </button>
        )}
      </div>
    </div>
  );
}
