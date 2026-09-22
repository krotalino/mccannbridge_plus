import React from 'react';

export default function ClientCockpitFinance({
  kpis,
  decisions = [],
  currency = 'FCFA',
  formatMoney,
  onNavigateTab,
  onSelectDecision,
  onOpenReallocationSimulator,
}) {
  const kpiCards = [
    {
      id: 'kpi_alloue',
      label: 'BUDGET ALLOUÉ',
      value: formatMoney(kpis.budgetAlloue),
      sub: 'Enveloppe approuvée par Orange',
      color: '#1E293B',
      actionText: 'Ventilation par poste',
      tabTarget: 'budget_performance',
    },
    {
      id: 'kpi_engage',
      label: 'BUDGET ENGAGÉ',
      value: formatMoney(kpis.budgetEngage),
      sub: 'Couvert par BC, devis & avenants',
      color: '#0F766E',
      actionText: 'Vérifier engagements',
      tabTarget: 'budget_performance',
    },
    {
      id: 'kpi_realise',
      label: 'BUDGET RÉALISÉ',
      value: formatMoney(kpis.budgetRealise),
      sub: `${Math.round((kpis.budgetRealise / kpis.budgetAlloue) * 100)}% consommé à date`,
      color: '#D97706',
      actionText: 'Comparer au budget',
      tabTarget: 'budget_performance',
    },
    {
      id: 'kpi_ecart',
      label: 'ÉCART BUDGET / RÉEL',
      value: `+${kpis.ecartPct}%`,
      sub: `${formatMoney(Math.abs(kpis.ecartMontant))} en réserve`,
      color: '#15803D',
      actionText: 'Demander réallocation',
      tabTarget: 'budget_performance',
    },
    {
      id: 'kpi_facture',
      label: 'CA FACTURÉ CLIENT',
      value: formatMoney(kpis.caFacture),
      sub: 'Factures émises par McCann',
      color: '#2563EB',
      actionText: 'Voir les factures',
      tabTarget: 'facturation_pipeline',
    },
    {
      id: 'kpi_reste_facturer',
      label: 'RESTE À FACTURER',
      value: formatMoney(kpis.resteAFacturer),
      sub: 'Prestations validées non facturées',
      color: '#7C3AED',
      actionText: 'Anticiper échéances',
      tabTarget: 'facturation_pipeline',
    },
    {
      id: 'kpi_encaisse',
      label: 'MONTANT ENCAISSÉ',
      value: formatMoney(kpis.montantEncaisse),
      sub: 'Règlements reçus et rapprochés',
      color: '#059669',
      actionText: 'Confirmer règlements',
      tabTarget: 'facturation_pipeline',
    },
    {
      id: 'kpi_mobilisable',
      label: 'DISPONIBILITÉ ORANGE',
      value: formatMoney(kpis.budgetMobilisable),
      sub: 'Budget restant mobilisable',
      color: '#EA580C',
      actionText: 'Arbitrer investissements',
      tabTarget: 'budget_performance',
      isHero: true,
    },
    {
      id: 'kpi_validation',
      label: 'EN ATTENTE VALIDATION',
      value: `${kpis.enAttenteValidationCount} docs`,
      sub: `${formatMoney(kpis.enAttenteValidationMontant)} nécessitant action`,
      color: '#DC2626',
      actionText: 'Valider maintenant',
      tabTarget: 'validations_actions',
    },
    {
      id: 'kpi_alertes',
      label: 'ALERTES ACTIVES',
      value: `${kpis.alertesActivesCount} alertes`,
      sub: '1 critique · 2 seuils · 1 info',
      color: '#DC2626',
      actionText: 'Traiter selon priorité',
      tabTarget: 'previsions_alertes',
    },
  ];

  return (
    <div className="space-y-20 animate-fade">
      {/* ─── 1. GRILLE DES 10 CARTES KPI PRIORITAIRES (Cahier des Charges Page 2) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 12,
        }}
      >
        {kpiCards.map((kpi) => (
          <div
            key={kpi.id}
            className="card p-14"
            style={{
              borderRadius: 12,
              border: kpi.isHero ? '2px solid #FF7900' : '1px solid #E2E8F0',
              background: kpi.isHero ? '#FFF9F5' : '#FFFFFF',
              boxShadow: kpi.isHero ? '0 4px 12px rgba(255, 121, 0, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 124,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  color: kpi.isHero ? '#D35400' : 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{kpi.label}</span>
                {kpi.isHero && <span style={{ fontSize: 13 }}>⭐</span>}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: kpi.color,
                  marginTop: 6,
                  letterSpacing: '-0.3px',
                }}
              >
                {kpi.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                {kpi.sub}
              </div>
            </div>

            <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                onClick={() => onNavigateTab(kpi.tabTarget)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#FF7900',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>{kpi.actionText}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 2. ENCART PRIORITAIRE « À DÉCIDER CETTE PÉRIODE » (3 Messages Max, Page 2) ─── */}
      <div
        className="card p-16"
        style={{
          borderRadius: 14,
          background: 'linear-gradient(135deg, #FFF6EC 0%, #FFFFFF 100%)',
          border: '1.5px solid #FFD3B0',
          boxShadow: '0 4px 14px rgba(255, 121, 0, 0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: '#B45309', margin: 0 }}>
                À DÉCIDER CETTE PÉRIODE — {decisions.length} ARBITRAGES STRATÉGIQUES
              </h2>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: '#DC2626',
                  color: '#FFFFFF',
                }}
              >
                Action Requise Orange
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Décisions recommandées pour sécuriser les activations, respecter les délais légaux et optimiser le ROAS.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenReallocationSimulator}
            className="btn btn-sm"
            style={{
              background: '#FF7900',
              color: '#FFFFFF',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 8,
              border: 'none',
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            <span>🧮</span> Simuler Réallocation Budgétaire
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 12 }}>
          {decisions.map((dec) => {
            const isCritique = dec.severite === 'critique';
            const isEleve = dec.severite === 'eleve';
            const badgeBg = isCritique ? '#FEE2E2' : isEleve ? '#FEF3C7' : '#E0F2FE';
            const badgeColor = isCritique ? '#991B1B' : isEleve ? '#92400E' : '#0369A1';
            const borderCol = isCritique ? '#FCA5A5' : isEleve ? '#FCD34D' : '#BAE6FD';

            return (
              <div
                key={dec.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 10,
                  border: `1px solid ${borderCol}`,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: badgeBg,
                        color: badgeColor,
                        textTransform: 'uppercase',
                      }}
                    >
                      {dec.severite}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>
                      Échéance : <strong style={{ color: isCritique ? '#DC2626' : 'var(--dark)' }}>{dec.echeance}</strong>
                    </span>
                  </div>

                  <h3 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 6px 0', color: 'var(--dark)' }}>
                    {dec.title}
                  </h3>

                  <div style={{ fontSize: 11, fontWeight: 700, color: '#D97706', marginBottom: 6 }}>
                    {dec.campagne} • <span style={{ color: '#047857' }}>{formatMoney(dec.montant)}</span>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--dark)', lineHeight: 1.45, margin: '0 0 8px 0' }}>
                    « {dec.message} »
                  </p>

                  <div
                    style={{
                      fontSize: 11,
                      padding: '6px 10px',
                      borderRadius: 6,
                      background: '#F8FAFC',
                      color: 'var(--muted)',
                      border: '1px dashed #CBD5E1',
                      marginBottom: 12,
                    }}
                  >
                    <strong>Impact opérationnel :</strong> {dec.impact}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                  <button
                    type="button"
                    onClick={() => onSelectDecision(dec, 'primary')}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      background: isCritique ? '#DC2626' : '#FF7900',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {dec.actionLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectDecision(dec, 'secondary')}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#F1F5F9',
                      color: 'var(--dark)',
                      border: '1px solid #CBD5E1',
                      cursor: 'pointer',
                    }}
                  >
                    {dec.actionSecondaryLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 3. PANORAMA VISUEL : JAUGE DE CONSOMMATION & CASCADE BUDGÉTAIRE ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        {/* Jauge Globale & Répartition par Levier */}
        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>
              RÉPARTITION & CONSOMMATION PAR LEVIER
            </h3>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#D97706' }}>
              69.4% Consommé Global
            </span>
          </div>

          {/* Jauge visuelle */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
              <span>Consommation de l'enveloppe approuvée</span>
              <span>{formatMoney(kpis.budgetRealise)} / {formatMoney(kpis.budgetAlloue)}</span>
            </div>
            <div style={{ width: '100%', height: 12, background: '#E2E8F0', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '69.4%', background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 70%, #EF4444 100%)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
              <span>0% (Initial)</span>
              <span>50% (Sain)</span>
              <span style={{ color: '#D97706', fontWeight: 800 }}>80% (Seuil d'alerte)</span>
              <span>100% (Plafond)</span>
            </div>
          </div>

          {/* Ventilation par levier */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Paid Media & Achat d’espace', pct: 40.6, montant: 195000000, color: '#2563EB' },
              { label: 'Influence & Ambassadeurs KOL', pct: 20.4, montant: 98000000, color: '#7C3AED' },
              { label: 'Production Vidéo & Contenus', pct: 17.7, montant: 85000000, color: '#EA580C' },
              { label: 'Activations Terrain & Événements', pct: 9.4, montant: 45000000, color: '#059669' },
              { label: 'Community Management & Support', pct: 6.7, montant: 32000000, color: '#DC2626' },
              { label: 'Reporting, Audits & Outils', pct: 5.2, montant: 25000000, color: '#475569' },
            ].map((lev, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: lev.color }} />
                  <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{lev.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>{lev.pct}%</span>
                  <span style={{ fontWeight: 800, color: 'var(--dark)' }}>{formatMoney(lev.montant)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cascade d'Écart Budgétaire (Cahier des Charges Page 3) */}
        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>
              CASCADE D’ÉCART & TRAJECTOIRE BUDGÉTAIRE
            </h3>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 10,
                background: '#E8F5E9',
                color: '#2E7D32',
              }}
            >
              Équilibre Positif
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
            {[
              {
                etape: '1. Budget Initial Approuvé',
                detail: 'Enveloppe contractuelle initiale signée Orange',
                montant: 480000000,
                sign: '',
                color: '#1E293B',
              },
              {
                etape: '2. Avenants Budgétaires Signés',
                detail: 'Extension live TikTok Mayi + renforcement Meta',
                montant: 23500000,
                sign: '+',
                color: '#2563EB',
              },
              {
                etape: '3. Réallocations Internes Validées',
                detail: 'Virement de Production vidéo vers Influenceurs',
                montant: 0,
                sign: '±',
                color: '#7C3AED',
              },
              {
                etape: '4. Dépenses Réalisées Imputées',
                detail: 'Prestations reconnues et certifiées conformes',
                montant: -333150000,
                sign: '-',
                color: '#D97706',
              },
              {
                etape: '5. Solde Restant Mobilisable',
                detail: 'Trésorerie budgétaire disponible Orange pour réinvestissements',
                montant: 146850000,
                sign: '=',
                color: '#059669',
                isHighlight: true,
              },
            ].map((cas, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: cas.isHighlight ? '#ECFDF5' : '#F8FAFC',
                  border: cas.isHighlight ? '1.5px solid #A7F3D0' : '1px solid #F1F5F9',
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: cas.isHighlight ? '#065F46' : 'var(--dark)' }}>
                    {cas.etape}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {cas.detail}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: cas.color,
                  }}
                >
                  {cas.sign} {formatMoney(Math.abs(cas.montant))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
