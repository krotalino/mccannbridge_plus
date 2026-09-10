import { Search, Filter, RotateCcw, Calendar, Layers, User, Globe, FileText, Tag } from 'lucide-react';

export default function PerformanceFilters({
  filters,
  setFilters,
  onReset,
  campaigns = [],
  talents = [],
  platforms = [],
  contentTypes = [],
  subjects = [],
  periods = [],
  totalCount = 0,
  filteredCount = 0,
}) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = Boolean(
    filters.campaign ||
    filters.talent ||
    filters.platform ||
    filters.contentType ||
    filters.subject ||
    filters.period ||
    filters.search
  );

  return (
    <div
      className="card mb-20"
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-12 mb-16 pb-12" style={{ borderBottom: '1px solid #f3f4f6' }}>
        <div className="flex items-center gap-8">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#FFF0E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF7900',
            }}
          >
            <Filter size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-dark" style={{ margin: 0 }}>
              Filtres Globaux de Performance & KPIs
            </h3>
            <p className="text-xs text-muted" style={{ margin: 0 }}>
              Affinez les métriques par campagne, talent, plateforme, format, sujet et période
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <span
            className="text-xs font-semibold px-10 py-4"
            style={{
              background: filteredCount === totalCount ? '#F3F4F6' : '#FFF0E5',
              color: filteredCount === totalCount ? '#4B5563' : '#FF7900',
              borderRadius: 20,
              border: `1px solid ${filteredCount === totalCount ? '#E5E7EB' : '#FED7AA'}`,
            }}
          >
            {filteredCount} / {totalCount} publication{totalCount > 1 ? 's' : ''} affichée{filteredCount > 1 ? 's' : ''}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="btn btn-ghost text-xs flex items-center gap-4 text-muted hover:text-dark px-8 py-4"
              style={{ borderRadius: 6, border: '1px solid #E5E7EB', background: '#F9FAFB' }}
              title="Réinitialiser tous les filtres"
            >
              <RotateCcw size={14} />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Barre de filtres réactive en grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-10 items-end">
        {/* Recherche texte */}
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-muted flex items-center gap-4 mb-4">
            <Search size={13} />
            Recherche libre
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Titre, sujet, mot-clé, URL..."
              value={filters.search || ''}
              onChange={e => handleChange('search', e.target.value)}
              className="form-input text-xs w-full"
              style={{
                height: 36,
                paddingLeft: 30,
                borderRadius: 8,
                border: '1px solid #D1D5DB',
              }}
            />
            <Search
              size={14}
              className="absolute text-muted"
              style={{ left: 10, top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        {/* Campagne */}
        <div>
          <label className="text-xs font-semibold text-muted flex items-center gap-4 mb-4">
            <Layers size={13} />
            Campagne
          </label>
          <select
            value={filters.campaign || ''}
            onChange={e => handleChange('campaign', e.target.value)}
            className="form-input text-xs w-full"
            style={{ height: 36, borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff' }}
          >
            <option value="">Toutes les campagnes</option>
            {campaigns.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Talent */}
        <div>
          <label className="text-xs font-semibold text-muted flex items-center gap-4 mb-4">
            <User size={13} />
            Talent / Créateur
          </label>
          <select
            value={filters.talent || ''}
            onChange={e => handleChange('talent', e.target.value)}
            className="form-input text-xs w-full"
            style={{ height: 36, borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff' }}
          >
            <option value="">Tous les talents</option>
            {talents.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Plateforme */}
        <div>
          <label className="text-xs font-semibold text-muted flex items-center gap-4 mb-4">
            <Globe size={13} />
            Plateforme
          </label>
          <select
            value={filters.platform || ''}
            onChange={e => handleChange('platform', e.target.value)}
            className="form-input text-xs w-full uppercase"
            style={{ height: 36, borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff' }}
          >
            <option value="">Toutes</option>
            {platforms.map(p => (
              <option key={p} value={p}>{p.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Type de contenu */}
        <div>
          <label className="text-xs font-semibold text-muted flex items-center gap-4 mb-4">
            <FileText size={13} />
            Format
          </label>
          <select
            value={filters.contentType || ''}
            onChange={e => handleChange('contentType', e.target.value)}
            className="form-input text-xs w-full capitalize"
            style={{ height: 36, borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff' }}
          >
            <option value="">Tous les formats</option>
            {contentTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Sujet & Période */}
        <div>
          <label className="text-xs font-semibold text-muted flex items-center gap-4 mb-4">
            <Tag size={13} />
            Sujet / Période
          </label>
          <div className="flex gap-4">
            <select
              value={filters.subject || ''}
              onChange={e => handleChange('subject', e.target.value)}
              className="form-input text-xs w-1/2"
              style={{ height: 36, borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff' }}
              title="Filtrer par sujet"
            >
              <option value="">Sujet: Tous</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={filters.period || ''}
              onChange={e => handleChange('period', e.target.value)}
              className="form-input text-xs w-1/2"
              style={{ height: 36, borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff' }}
              title="Filtrer par période"
            >
              <option value="">Période: Toutes</option>
              {periods.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
