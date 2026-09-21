import React from 'react';
import { CLIENT_ENTITIES, CLIENT_UNIVERSES, CLIENT_PERIODS } from '../../../data/clientTrafficData';
import { RefreshCw, Filter, Calendar, Zap, FolderOpen, Clock } from 'lucide-react';

export default function ClientTrafficContextBar({
  selectedPeriod,
  onChangePeriod,
  selectedEntity,
  onChangeEntity,
  selectedUniverse,
  onChangeUniverse,
  onRefresh,
  isRefreshing,
  lastSyncTime,
  onQuickNav,
  validationsCount = 2,
  dossiersCount = 8,
}) {
  return (
    <div
      className="card mb-20 p-12 animate-fade"
      style={{
        borderRadius: 12,
        background: '#FFFFFF',
        border: '1px solid #E0E0E0',
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 12,
        }}
      >
        {/* Bandeau de Contexte Title & Sync */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--muted)',
            }}
          >
            BANDEAU DE CONTEXTE & FILTRES MÉTIER
          </span>
          {/* Synchronisation live badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 8px',
              borderRadius: 6,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              fontSize: 11,
              fontWeight: 700,
              color: '#15803D',
            }}
          >
            <span style={{ fontSize: 12 }}>⚡</span>
            <span>Flux Synchronisé • {lastSyncTime}</span>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
              fontSize: 11,
              padding: '3px 8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              border: '1px solid #D1D5DB',
            }}
          >
            <RefreshCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
          </button>
        </div>

        {/* Accès rapides (Cahier des charges Page 1) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>Accès rapides :</span>
          <button
            type="button"
            onClick={() => onQuickNav('validations')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 11.5,
              fontWeight: 800,
              background: '#FFF8F2',
              border: '1px solid #FFCC80',
              color: '#E65100',
              cursor: 'pointer',
            }}
          >
            <Zap size={12} />
            <span>Mes validations</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                background: '#FF7900',
                color: '#FFFFFF',
                padding: '0 5px',
                borderRadius: 10,
              }}
            >
              {validationsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onQuickNav('travaux')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 11.5,
              fontWeight: 800,
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              color: '#0369A1',
              cursor: 'pointer',
            }}
          >
            <FolderOpen size={12} />
            <span>Mes demandes</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                background: '#0284C7',
                color: '#FFFFFF',
                padding: '0 5px',
                borderRadius: 10,
              }}
            >
              {dossiersCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onQuickNav('calendrier')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 11.5,
              fontWeight: 800,
              background: '#FDF4FF',
              border: '1px solid #F0ABFC',
              color: '#86198F',
              cursor: 'pointer',
            }}
          >
            <Calendar size={12} />
            <span>Calendrier de la semaine</span>
          </button>
        </div>
      </div>

      {/* Selectors Grid (Période, Entité, Univers) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          paddingTop: 10,
          borderTop: '1px solid #F3F4F6',
        }}
      >
        {/* Période */}
        <div>
          <label
            htmlFor="clientPeriodSelect"
            style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#374151', marginBottom: 4 }}
          >
            📅 Période d’analyse
          </label>
          <select
            id="clientPeriodSelect"
            className="form-control w-full"
            value={selectedPeriod}
            onChange={e => onChangePeriod(e.target.value)}
            style={{ fontSize: 12.5, fontWeight: 700, padding: '6px 10px', borderRadius: 8, height: 38 }}
          >
            {CLIENT_PERIODS.map(p => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Entité Orange */}
        <div>
          <label
            htmlFor="clientEntitySelect"
            style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#374151', marginBottom: 4 }}
          >
            🏢 Entité Orange
          </label>
          <select
            id="clientEntitySelect"
            className="form-control w-full"
            value={selectedEntity}
            onChange={e => onChangeEntity(e.target.value)}
            style={{ fontSize: 12.5, fontWeight: 700, padding: '6px 10px', borderRadius: 8, height: 38 }}
          >
            {CLIENT_ENTITIES.map(ent => (
              <option key={ent.id} value={ent.id}>
                {ent.icon} {ent.label}
              </option>
            ))}
          </select>
        </div>

        {/* Univers Métier */}
        <div>
          <label
            htmlFor="clientUniverseSelect"
            style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#374151', marginBottom: 4 }}
          >
            🎯 Univers d’action
          </label>
          <select
            id="clientUniverseSelect"
            className="form-control w-full"
            value={selectedUniverse}
            onChange={e => onChangeUniverse(e.target.value)}
            style={{ fontSize: 12.5, fontWeight: 700, padding: '6px 10px', borderRadius: 8, height: 38 }}
          >
            {CLIENT_UNIVERSES.map(u => (
              <option key={u.id} value={u.id}>
                {u.icon ? `${u.icon} ` : ''}{u.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
