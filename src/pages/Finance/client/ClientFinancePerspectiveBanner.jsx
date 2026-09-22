import React from 'react';

export const CLIENT_PERSPECTIVES = [
  {
    id: 'valideur_orange',
    label: 'Valideur Orange',
    description: 'Pouvoir d’approbation des devis, BC, avenants, proformas et factures officielles.',
    icon: '✍️',
    badge: 'Approbation Active',
  },
  {
    id: 'controleur_gestion',
    label: 'Contrôleur de Gestion Orange',
    description: 'Surveillance des lignes budgétaires, analyse des écarts, échéanciers et rapports périodiques.',
    icon: '📊',
    badge: 'Contrôle & Arbitrage',
  },
  {
    id: 'lecteur_orange',
    label: 'Lecteur Direction / Marque',
    description: 'Consultation exécutive du cockpit, des KPI de campagnes et des prévisions de consommation.',
    icon: '👁️',
    badge: 'Lecture Seule',
  },
  {
    id: 'admin_orange',
    label: 'Administrateur Entité Orange',
    description: 'Gestion globale des droits, des référents de validation et des notifications budgétaires.',
    icon: '🛡️',
    badge: 'Périmètre Complet',
  },
];

export default function ClientFinancePerspectiveBanner({
  currentPerspective = 'valideur_orange',
  onChangePerspective,
  currency = 'FCFA',
  onChangeCurrency,
  onOpenExport,
  onRefresh,
  isRefreshing,
}) {
  const currentObj = CLIENT_PERSPECTIVES.find((p) => p.id === currentPerspective) || CLIENT_PERSPECTIVES[0];

  return (
    <div
      className="card mb-20 p-12"
      style={{
        borderRadius: 12,
        background: 'linear-gradient(135deg, #FFF9F5 0%, #FFFFFF 100%)',
        border: '1px solid #FFE4D0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: '#FF7900',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 2px 6px rgba(255, 121, 0, 0.3)',
          }}
        >
          {currentObj.icon}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--dark)' }}>
              PERSPECTIVE CLIENT : {currentObj.label.toUpperCase()}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 10,
                background: '#FFF0E5',
                color: '#E65100',
                border: '1px solid #FFD0B0',
              }}
            >
              {currentObj.badge}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 10,
                background: '#E8F5E9',
                color: '#2E7D32',
                border: '1px solid #C8E6C9',
              }}
            >
              🔒 Confidentialité Agence Préservée (Sans marge ni trésorerie interne)
            </span>
          </div>
          <p style={{ margin: '3px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
            {currentObj.description}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Sélecteur de rôle */}
        <select
          value={currentPerspective}
          onChange={(e) => onChangePerspective(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          {CLIENT_PERSPECTIVES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.icon} {p.label}
            </option>
          ))}
        </select>

        {/* Sélecteur de Devise */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F1F5F9',
            padding: 2,
            borderRadius: 8,
            border: '1px solid #CBD5E1',
          }}
        >
          {['FCFA', 'EUR', 'USD'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChangeCurrency(c)}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 800,
                border: 'none',
                background: currency === c ? '#FF7900' : 'transparent',
                color: currency === c ? '#FFFFFF' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Export & Rafraîchissement */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="btn btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #CBD5E1' }}
        >
          <span>🔄</span> {isRefreshing ? 'Actualisation...' : 'Actualiser'}
        </button>

        <button
          type="button"
          onClick={onOpenExport}
          className="btn btn-primary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#FF7900',
            color: '#FFFFFF',
            fontWeight: 800,
          }}
        >
          <span>📥</span> Exporter Synthèse
        </button>
      </div>
    </div>
  );
}
