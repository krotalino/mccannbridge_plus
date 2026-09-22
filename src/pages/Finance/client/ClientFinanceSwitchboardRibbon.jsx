import React from 'react';

export default function ClientFinanceSwitchboardRibbon({
  activeTab,
  onSelectTab,
  kpis,
  decisionsCount = 3,
  validationsCount = 5,
  alertesCount = 4,
}) {
  const sections = [
    {
      id: 'cockpit',
      label: 'Cockpit Financier',
      icon: '📊',
      tag: 'Synthèse Exécutive',
      sub: `${kpis?.budgetMobilisable ? Math.round(kpis.budgetMobilisable / 1000000) : 147}M FCFA mobilisables`,
      badge: `${decisionsCount} arbitrages`,
      badgeColor: '#E65100',
    },
    {
      id: 'budget_performance',
      label: 'Budget & Performance',
      icon: '📈',
      tag: 'Budget vs Réel',
      sub: '6 postes · ROAS 4.85x',
      badge: '-13.6% éc.',
      badgeColor: '#2E7D32',
    },
    {
      id: 'operations_docs',
      label: 'Opérations & Documents',
      icon: '📄',
      tag: 'Registre Partagé',
      sub: 'BC, Devis, Factures, Reçus',
      badge: '8 docs',
      badgeColor: '#1976D2',
    },
    {
      id: 'facturation_pipeline',
      label: 'Facturation & Échéancier',
      icon: '🧾',
      tag: 'Parcours 5 Jalons',
      sub: 'DSO 34j · 4 dossiers',
      badge: '30/60/90j',
      badgeColor: '#5E35B1',
    },
    {
      id: 'validations_actions',
      label: 'Mes Actions Financières',
      icon: '✅',
      tag: 'À Valider Orange',
      sub: 'Devis, Avenants, Proformas',
      badge: `${validationsCount} requises`,
      badgeColor: '#C62828',
    },
    {
      id: 'previsions_alertes',
      label: 'Prévisions & Alertes',
      icon: '⚠️',
      tag: 'Anticipation & Risques',
      sub: '3 scénarios · Alertes',
      badge: `${alertesCount} actives`,
      badgeColor: '#F57C00',
    },
    {
      id: 'reporting_audit',
      label: 'Reporting & Audit',
      icon: '📑',
      tag: 'Exports & Traçabilité',
      sub: 'Rapports mensuels & Logs',
      badge: 'Certifié',
      badgeColor: '#00838F',
    },
  ];

  return (
    <div
      className="card mb-20 p-12"
      style={{
        borderRadius: 14,
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
          gap: 10,
        }}
      >
        {sections.map((sec) => {
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectTab(sec.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 10,
                border: isActive ? '2px solid #FF7900' : '1px solid #E2E8F0',
                background: isActive ? '#FFF8F2' : '#FAFAFA',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                position: 'relative',
                minHeight: 88,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = '#F3F4F6';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = '#FAFAFA';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>{sec.icon}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 10,
                    background: sec.badgeColor,
                    color: '#FFFFFF',
                  }}
                >
                  {sec.badge}
                </span>
              </div>

              <div style={{ marginTop: 6, width: '100%' }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: isActive ? '#D35400' : 'var(--dark)',
                    lineHeight: 1.2,
                  }}
                >
                  {sec.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    marginTop: 3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {sec.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
