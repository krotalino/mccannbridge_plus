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
    <div 
      className="card mb-16 p-14 animate-fade"
      style={{
        background: '#FFF',
        borderRadius: 12,
        border: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Search input */}
        <div style={{ flex: '2 1 240px', position: 'relative' }}>
          <span 
            style={{ 
              position: 'absolute', 
              left: 12, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--muted)', 
              fontSize: 14,
              pointerEvents: 'none'
            }}
          >
            🔍
          </span>
          <input
            type="text"
            className="form-input"
            placeholder="Rechercher par référence (REP-...), mot-clé, campagne, auteur..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: 34,
              paddingRight: searchQuery ? 32 : 12,
              height: 40,
              fontSize: 12.5,
              borderRadius: 8,
              border: '1px solid #D1D5DB'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                fontSize: 13,
                padding: 4
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
          style={{ flex: '1 1 150px', height: 40, fontSize: 12.5, borderRadius: 8, border: '1px solid #D1D5DB' }}
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
          style={{ flex: '1 1 160px', height: 40, fontSize: 12.5, borderRadius: 8, border: '1px solid #D1D5DB' }}
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
          style={{ flex: '1 1 160px', height: 40, fontSize: 12.5, borderRadius: 8, border: '1px solid #D1D5DB' }}
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
          style={{ flex: '1 1 130px', height: 40, fontSize: 12.5, borderRadius: 8, border: '1px solid #D1D5DB' }}
        >
          <option value="all">Toutes priorités</option>
          <option value="urgente">🔴 Urgente</option>
          <option value="haute">🟠 Haute</option>
          <option value="normale">🟢 Normale</option>
          <option value="basse">⚪ Basse</option>
        </select>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="btn btn-ghost btn-sm"
            style={{ height: 40, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0', color: '#E65100' }}
            title="Réinitialiser tous les filtres"
          >
            <RotateCcw size={13} />
            <span>Effacer filtres</span>
          </button>
        )}
      </div>

      {/* Filter status strip & Results count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, paddingTop: 8, borderTop: '1px solid #F3F4F6' }}>
        <div style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>
            Affichage de <strong>{totalResults}</strong> livrable(s) selon les critères sélectionnés
          </span>
          {hasActiveFilters && (
            <span className="tag tag-orange" style={{ fontSize: 10.5 }}>
              Filtres actifs
            </span>
          )}
        </div>

        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px' }}
          >
            <Download size={13} />
            <span>Exporter vue CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}
