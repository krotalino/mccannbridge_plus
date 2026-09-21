import React, { useState, useMemo } from 'react';
import { CLIENT_STATUSES } from '../../../data/clientTrafficData';
import { Search, Filter, LayoutList, Columns, Calendar, AlertTriangle, CheckCircle2, Clock, ChevronRight, User, Plus } from 'lucide-react';

export default function ClientTrafficPortfolio({
  dossiers = [],
  onOpenDossier,
  onOpenNewBrief,
  selectedEntity = 'all',
  selectedUniverse = 'all',
}) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban' | 'timeline'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [aarrrFilter, setAarrrFilter] = useState('all');

  // Filtered dossiers
  const filteredDossiers = useMemo(() => {
    return dossiers.filter(d => {
      // Entity filter
      if (selectedEntity !== 'all') {
        const entityMatches = {
          orange_cameroun: d.brand.toLowerCase().includes('telco') || d.brand.toLowerCase().includes('cameroun'),
          orange_money: d.brand.toLowerCase().includes('money'),
          orange_business: d.brand.toLowerCase().includes('business') || d.brand.toLowerCase().includes('b2b'),
          orange_pulse: d.brand.toLowerCase().includes('pulse'),
        };
        if (!entityMatches[selectedEntity]) return false;
      }

      // Universe filter
      if (selectedUniverse !== 'all' && d.universe !== selectedUniverse) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && d.clientStatus !== statusFilter) {
        return false;
      }

      // AARRR filter
      if (aarrrFilter !== 'all' && d.aarrr !== aarrrFilter) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = d.title.toLowerCase().includes(query);
        const matchId = d.id.toLowerCase().includes(query);
        const matchBrand = d.brand.toLowerCase().includes(query);
        const matchLead = d.mccannLead?.name?.toLowerCase().includes(query);
        const matchContact = d.orangeContact?.name?.toLowerCase().includes(query);
        if (!matchTitle && !matchId && !matchBrand && !matchLead && !matchContact) return false;
      }

      return true;
    });
  }, [dossiers, selectedEntity, selectedUniverse, statusFilter, aarrrFilter, searchQuery]);

  // Priority color badges
  const getPriorityBadge = (p) => {
    switch (p) {
      case 'critique':
        return { label: 'Critique', bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2' };
      case 'haute':
        return { label: 'Haute', bg: '#FFF3E0', text: '#E65100', border: '#FFE0B2' };
      case 'normale':
        return { label: 'Normale', bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' };
      default:
        return { label: 'Faible', bg: '#F5F5F5', text: '#616161', border: '#E0E0E0' };
    }
  };

  // AARRR color badges
  const getAarrrBadge = (tag) => {
    switch (tag) {
      case 'Acquisition':
        return { bg: '#E3F2FD', text: '#1565C0' };
      case 'Activation':
        return { bg: '#FFF3E0', text: '#E65100' };
      case 'Rétention':
        return { bg: '#F3E5F5', text: '#7B1FA2' };
      case 'Revenu':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'Référence':
        return { bg: '#E0F2F1', text: '#00695C' };
      default:
        return { bg: '#F5F5F5', text: '#424242' };
    }
  };

  // Risk badges
  const getRiskBadge = (risk) => {
    if (risk?.level === 'rouge') {
      return { icon: '🔴', label: 'Vigilance forte', text: '#C62828', bg: '#FFEBEE' };
    }
    if (risk?.level === 'orange') {
      return { icon: '🟠', label: 'Point d’attention', text: '#E65100', bg: '#FFF3E0' };
    }
    return { icon: '🟢', label: 'Nominal', text: '#2E7D32', bg: '#E8F5E9' };
  };

  return (
    <div className="client-traffic-portfolio space-y-20 animate-fade">
      {/* ─── HEADER DE SECTION & SÉLECTEUR DE MODE ─── */}
      <div
        className="card p-16"
        style={{
          borderRadius: 12,
          background: '#FFFFFF',
          border: '1px solid #E0E0E0',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
                PORTEFEUILLE DES TRAVAUX EN COURS
              </h2>
              <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
                {filteredDossiers.length} dossiers affichés
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 12.5 }}>
              Visualisation décisionnelle des demandes et campagnes Orange traitées par McCann • 1 carte par travail
            </p>
          </div>

          {/* 3 Modes d'affichage (Cahier des charges Page 2) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                background: '#F3F4F6',
                padding: 3,
                borderRadius: 8,
                border: '1px solid #E5E7EB',
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  border: 'none',
                  background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'list' ? '#FF7900' : '#4B5563',
                  boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <LayoutList size={14} />
                <span>1. Liste priorisée</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  border: 'none',
                  background: viewMode === 'kanban' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'kanban' ? '#FF7900' : '#4B5563',
                  boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <Columns size={14} />
                <span>2. Kanban simplifié</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  border: 'none',
                  background: viewMode === 'timeline' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'timeline' ? '#FF7900' : '#4B5563',
                  boxShadow: viewMode === 'timeline' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <Calendar size={14} />
                <span>3. Chronologique</span>
              </button>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenNewBrief}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#FF7900',
                border: 'none',
                fontWeight: 800,
              }}
            >
              <Plus size={14} />
              <span>Nouveau Brief</span>
            </button>
          </div>
        </div>

        {/* Filtres internes (Recherche, Statut, AARRR) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid #F3F4F6',
          }}
        >
          {/* Recherche */}
          <div style={{ flex: '2 1 200px', minWidth: 180, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--muted)' }} />
            <input
              type="search"
              placeholder="Rechercher par titre, référence, marque, contact..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 32px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                fontSize: 12,
                height: 38,
              }}
            />
          </div>

          {/* Filtre Statut Client */}
          <div style={{ flex: '1 1 180px', minWidth: 160 }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                fontSize: 12,
                height: 38,
                fontWeight: 700,
              }}
            >
              <option value="all">⚡ Tous les Statuts Client</option>
              {CLIENT_STATUSES.map(st => (
                <option key={st.id} value={st.id}>
                  {st.icon} {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre Tag AARRR */}
          <div style={{ flex: '1 1 160px', minWidth: 140 }}>
            <select
              value={aarrrFilter}
              onChange={e => setAarrrFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                fontSize: 12,
                height: 38,
                fontWeight: 700,
              }}
            >
              <option value="all">🎯 Tous Objectifs AARRR</option>
              <option value="Acquisition">Acquisition</option>
              <option value="Activation">Activation</option>
              <option value="Rétention">Rétention</option>
              <option value="Revenu">Revenu</option>
              <option value="Référence">Référence</option>
            </select>
          </div>

          {(searchQuery || statusFilter !== 'all' || aarrrFilter !== 'all') && (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setAarrrFilter('all');
              }}
              style={{ fontSize: 11, color: '#C62828', height: 38 }}
            >
              ✕ Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* ─── RENDU DU MODE CHOISI ─── */}

      {/* MODE 1: VUE LISTE PRIORISÉE (Idéale pour les responsables Orange) */}
      {viewMode === 'list' && (
        <div className="space-y-12">
          {filteredDossiers.map(dossier => {
            const prioBadge = getPriorityBadge(dossier.priority);
            const aarrrBadge = getAarrrBadge(dossier.aarrr);
            const riskBadge = getRiskBadge(dossier.risk);
            const statusConfig = CLIENT_STATUSES.find(s => s.id === dossier.clientStatus) || CLIENT_STATUSES[0];

            return (
              <div
                key={dossier.id}
                className="card"
                onClick={() => onOpenDossier(dossier)}
                style={{
                  borderRadius: 12,
                  padding: '16px 20px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderLeft: `4px solid ${statusConfig.color}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#FF7900' }}>
                      {dossier.id}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: prioBadge.bg,
                        color: prioBadge.text,
                        border: `1px solid ${prioBadge.border}`,
                      }}
                    >
                      {prioBadge.label}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: aarrrBadge.bg,
                        color: aarrrBadge.text,
                      }}
                    >
                      🎯 {dossier.aarrr}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>
                      • {dossier.brand}
                    </span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                      ({dossier.typeLabel})
                    </span>
                  </div>

                  {/* Statut client & Risque */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: riskBadge.bg,
                        color: riskBadge.text,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>{riskBadge.icon}</span>
                      <span>{riskBadge.label}</span>
                    </span>

                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: statusConfig.bg,
                        color: statusConfig.color,
                        border: `1px solid ${statusConfig.color}40`,
                      }}
                    >
                      {statusConfig.icon} {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Titre */}
                <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: '0 0 8px 0' }}>
                  {dossier.title}
                </h3>

                {/* Prochaine étape claire (Cahier des charges Page 3) */}
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: '#F9FAFB',
                    border: '1px solid #F3F4F6',
                    fontSize: 12,
                    color: '#374151',
                    marginBottom: 10,
                  }}
                >
                  <strong style={{ color: '#FF7900' }}>Prochaine étape :</strong> {dossier.nextStep}
                </div>

                {/* Footer de carte : Interlocuteurs, Échéance, Dernière activité */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    fontSize: 11.5,
                    color: 'var(--muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <span>
                      🎨 <strong>Lead McCann :</strong> {dossier.mccannLead?.name} ({dossier.mccannLead?.role})
                    </span>
                    <span>
                      👤 <strong>Contact Orange :</strong> {dossier.orangeContact?.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontWeight: 800, color: '#1565C0' }}>
                      📅 Échéance : {dossier.deadline ? new Date(dossier.deadline).toLocaleDateString('fr-FR') : 'À fixer'}
                    </span>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>
                      {dossier.lastActivity}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: VUE KANBAN SIMPLIFIÉE (Visualisation du parcours, Page 2) */}
      {viewMode === 'kanban' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 12,
            alignItems: 'start',
            overflowX: 'auto',
            paddingBottom: 16,
          }}
        >
          {CLIENT_STATUSES.map(status => {
            const dossiersInStatus = filteredDossiers.filter(d => d.clientStatus === status.id);

            return (
              <div
                key={status.id}
                style={{
                  background: '#F9FAFB',
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  padding: 12,
                  minWidth: 260,
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                    paddingBottom: 8,
                    borderBottom: `2px solid ${status.color}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{status.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--dark)' }}>
                      {status.shortLabel}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 900,
                      padding: '1px 7px',
                      borderRadius: 10,
                      background: status.bg,
                      color: status.color,
                    }}
                  >
                    {dossiersInStatus.length}
                  </span>
                </div>

                {/* Subtitle / Meaning */}
                <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.3 }}>
                  {status.clientMeaning}
                </div>

                {/* Cards in column */}
                <div className="space-y-8">
                  {dossiersInStatus.map(dossier => {
                    const prio = getPriorityBadge(dossier.priority);
                    const risk = getRiskBadge(dossier.risk);

                    return (
                      <div
                        key={dossier.id}
                        onClick={() => onOpenDossier(dossier)}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: 8,
                          padding: 10,
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: '#FF7900' }}>
                            {dossier.id}
                          </span>
                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 800,
                              padding: '1px 5px',
                              borderRadius: 4,
                              background: prio.bg,
                              color: prio.text,
                            }}
                          >
                            {prio.label}
                          </span>
                        </div>

                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginBottom: 4, lineHeight: 1.3 }}>
                          {dossier.title}
                        </div>

                        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 6 }}>
                          {dossier.brand}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 6,
                            borderTop: '1px solid #F3F4F6',
                            fontSize: 10,
                          }}
                        >
                          <span style={{ color: risk.text, fontWeight: 700 }}>
                            {risk.icon} {risk.label}
                          </span>
                          <span style={{ fontWeight: 800, color: '#1E88E5' }}>
                            🎯 {dossier.aarrr}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {dossiersInStatus.length === 0 && (
                    <div style={{ padding: '16px 8px', textAlign: 'center', color: '#9CA3AF', fontSize: 11, fontStyle: 'italic' }}>
                      Aucun dossier à cette étape
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 3: VUE CHRONOLOGIQUE (Dates de livraison, lancements, dépendances) */}
      {viewMode === 'timeline' && (
        <div
          className="card p-20"
          style={{
            borderRadius: 12,
            background: '#FFFFFF',
            border: '1px solid #E0E0E0',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
              Chronogramme des Livraisons & Lancements S38 / S39
            </h3>
            <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0 }}>
              Ordonnancement séquentiel par date d’échéance contractuelle
            </p>
          </div>

          <div className="space-y-16">
            {filteredDossiers
              .slice()
              .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
              .map((dossier, idx) => {
                const statusConfig = CLIENT_STATUSES.find(s => s.id === dossier.clientStatus) || CLIENT_STATUSES[0];
                const risk = getRiskBadge(dossier.risk);

                return (
                  <div
                    key={dossier.id}
                    onClick={() => onOpenDossier(dossier)}
                    style={{
                      display: 'flex',
                      gap: 16,
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: idx % 2 === 0 ? '#FAFAFA' : '#FFFFFF',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    {/* Date Block */}
                    <div
                      style={{
                        minWidth: 90,
                        textAlign: 'center',
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: '#FFF8F2',
                        border: '1px solid #FFE0B2',
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#E65100', textTransform: 'uppercase' }}>
                        ÉCHÉANCE
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#FF7900' }}>
                        {dossier.deadline ? new Date(dossier.deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'S38'}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: '#FF7900' }}>{dossier.id}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>• {dossier.brand}</span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: statusConfig.bg,
                            color: statusConfig.color,
                          }}
                        >
                          {statusConfig.label}
                        </span>
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 4 }}>
                        {dossier.title}
                      </div>

                      <div style={{ fontSize: 11.5, color: '#4B5563' }}>
                        <strong>Prochaine étape :</strong> {dossier.nextStep}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: risk.text }}>
                        {risk.icon} {risk.label}
                      </span>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                        Lead : {dossier.mccannLead?.name}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
