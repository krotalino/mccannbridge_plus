import React from 'react';
import {
  INFLUENCE_ENTITIES,
  INFLUENCE_NETWORKS,
  TALENT_TYPES,
  CAMPAIGN_OBJECTIVES,
  CAMPAIGN_STATUSES
} from '../../../data/clientInfluenceData';

export default function ClientInfluenceContextBar({
  filters,
  onFilterChange,
  onResetFilters,
  searchQuery,
  onSearchChange,
  campaigns = []
}) {
  const hasActiveFilters =
    filters.entity !== 'all' ||
    filters.network !== 'all' ||
    filters.talentType !== 'all' ||
    filters.objective !== 'all' ||
    filters.status !== 'all' ||
    filters.period !== 'all' ||
    filters.campaignId !== 'all' ||
    Boolean(searchQuery);

  return (
    <div
      className="card mb-20 animate-fade"
      style={{
        borderRadius: 14,
        padding: '16px 20px',
        border: '1px solid #E5E7EB',
        background: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        marginBottom: 20
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
            FILTRES STRATÉGIQUES DU PORTEFEUILLE INFLUENCE
          </span>
          <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 700 }}>
            Septembre 2026
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onResetFilters}
            style={{ fontSize: 11, fontWeight: 700, color: '#E65100', padding: '4px 8px' }}
          >
            ✕ Réinitialiser tous les filtres
          </button>
        )}
      </div>

      {/* Ligne 1 : Recherche + Entité + Campagne + Réseau */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 12
        }}
      >
        {/* Recherche rapide */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
            Recherche globale
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Talent, campagne, hashtag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: '100%', height: 36, fontSize: 12, borderRadius: 8, padding: '0 10px' }}
          />
        </div>

        {/* Entité Orange */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
            Entité Orange
          </label>
          <select
            className="form-control"
            value={filters.entity}
            onChange={(e) => onFilterChange('entity', e.target.value)}
            style={{ width: '100%', height: 36, fontSize: 12, borderRadius: 8, padding: '0 10px' }}
          >
            {INFLUENCE_ENTITIES.map(ent => (
              <option key={ent.id} value={ent.id}>
                {ent.label} {ent.badge ? `(${ent.badge})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Campagne ou Activation */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
            Campagne / Activation
          </label>
          <select
            className="form-control"
            value={filters.campaignId || 'all'}
            onChange={(e) => onFilterChange('campaignId', e.target.value)}
            style={{ width: '100%', height: 36, fontSize: 12, borderRadius: 8, padding: '0 10px' }}
          >
            <option value="all">Toutes les activations</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Réseau social */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
            Réseau social
          </label>
          <select
            className="form-control"
            value={filters.network}
            onChange={(e) => onFilterChange('network', e.target.value)}
            style={{ width: '100%', height: 36, fontSize: 12, borderRadius: 8, padding: '0 10px' }}
          >
            {INFLUENCE_NETWORKS.map(net => (
              <option key={net.id} value={net.id}>
                {net.icon} {net.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ligne 2 : Type de talent + Période + Statut + Objectif */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12
        }}
      >
        {/* Type de talent */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
            Type de talent
          </label>
          <select
            className="form-control"
            value={filters.talentType}
            onChange={(e) => onFilterChange('talentType', e.target.value)}
            style={{ width: '100%', height: 36, fontSize: 12, borderRadius: 8, padding: '0 10px' }}
          >
            {TALENT_TYPES.map(typ => (
              <option key={typ.id} value={typ.id}>
                {typ.label}
              </option>
            ))}
          </select>
        </div>

        {/* Période de diffusion */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
            Période de diffusion
          </label>
          <select
            className="form-control"
            value={filters.period}
            onChange={(e) => onFilterChange('period', e.target.value)}
            style={{ width: '100%', height: 36, fontSize: 12, borderRadius: 8, padding: '0 10px' }}
          >
            <option value="all">Toutes les périodes</option>
            <option value="semaine">Semaine en cours (S38)</option>
            <option value="mois">Mois de Septembre 2026</option>
            <option value="q3">Trimestre Q3 2026</option>
            <option value="custom">Période personnalisée...</option>
          </select>
        </div>

        {/* Statut d'avancement */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
            Statut du dossier
          </label>
          <select
            className="form-control"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            style={{ width: '100%', height: 36, fontSize: 12, borderRadius: 8, padding: '0 10px' }}
          >
            {CAMPAIGN_STATUSES.map(st => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Objectif de campagne */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
            Objectif business
          </label>
          <select
            className="form-control"
            value={filters.objective}
            onChange={(e) => onFilterChange('objective', e.target.value)}
            style={{ width: '100%', height: 36, fontSize: 12, borderRadius: 8, padding: '0 10px' }}
          >
            {CAMPAIGN_OBJECTIVES.map(obj => (
              <option key={obj.id} value={obj.id}>
                {obj.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
