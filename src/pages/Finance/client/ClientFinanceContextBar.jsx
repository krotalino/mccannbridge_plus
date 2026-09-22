import React from 'react';
import {
  CLIENT_ENTITIES,
  CLIENT_PERIODS,
  CLIENT_BUDGET_LINES,
  CLIENT_CAMPAIGNS,
} from '../../../data/clientFinanceData';

export const CLIENT_STATUS_FILTERS = [
  { id: 'all', label: 'Tous les statuts' },
  { id: 'engage', label: 'Engagé par BC/Devis' },
  { id: 'facture', label: 'Facturé' },
  { id: 'encaisse', label: 'Encaissé & Lettré' },
  { id: 'en_attente', label: 'En attente' },
  { id: 'a_valider', label: 'À valider Orange' },
  { id: 'depassement', label: 'En dépassement / Alerte' },
];

export default function ClientFinanceContextBar({
  selectedEntity,
  onChangeEntity,
  selectedPeriod,
  onChangePeriod,
  selectedCampaign,
  onChangeCampaign,
  selectedBudgetLine,
  onChangeBudgetLine,
  selectedStatus,
  onChangeStatus,
  searchQuery,
  onChangeSearchQuery,
  onResetFilters,
}) {
  const hasActiveFilters =
    selectedEntity !== 'all' ||
    selectedPeriod !== 's38_2026' ||
    selectedCampaign !== 'all' ||
    selectedBudgetLine !== 'all' ||
    selectedStatus !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div
      className="card mb-20 p-12"
      style={{
        borderRadius: 12,
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {/* Filtre Entité Orange */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>
            ENTITÉ ORANGE
          </label>
          <select
            value={selectedEntity}
            onChange={(e) => onChangeEntity(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
            }}
          >
            {CLIENT_ENTITIES.map((ent) => (
              <option key={ent.id} value={ent.id}>
                {ent.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre Période */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>
            PÉRIODE
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => onChangePeriod(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
            }}
          >
            {CLIENT_PERIODS.map((per) => (
              <option key={per.id} value={per.id}>
                {per.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre Campagne / Projet */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>
            CAMPAGNE / PROJET
          </label>
          <select
            value={selectedCampaign}
            onChange={(e) => onChangeCampaign(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
            }}
          >
            {CLIENT_CAMPAIGNS.map((cmp) => (
              <option key={cmp.id} value={cmp.id}>
                {cmp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre Centre de Coût / Ligne */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>
            LIGNE BUDGÉTAIRE
          </label>
          <select
            value={selectedBudgetLine}
            onChange={(e) => onChangeBudgetLine(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
            }}
          >
            {CLIENT_BUDGET_LINES.map((line) => (
              <option key={line.id} value={line.id}>
                {line.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre Statut Financier */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 3 }}>
            STATUT FINANCIER
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onChangeStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
            }}
          >
            {CLIENT_STATUS_FILTERS.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Barre de Recherche et Reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260 }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher par référence (BC, Proforma, Facture), mot-clé, objet ou valideur..."
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 12,
              border: '1px solid #CBD5E1',
              outline: 'none',
            }}
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="btn btn-ghost btn-xs"
            style={{ color: '#D35400', fontWeight: 700 }}
          >
            ✕ Réinitialiser les filtres
          </button>
        )}
      </div>
    </div>
  );
}
