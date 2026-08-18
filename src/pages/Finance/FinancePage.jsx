import { useState } from 'react';
import { FINANCIAL_DATA } from '../../data/financial';

const FMT = (n) => n.toLocaleString('fr-FR');

const FINANCE_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'operations', label: 'Opérations (BC / Factures / Reçus)', icon: '📄' },
  { id: 'facturation', label: 'Facturation Client', icon: '🧾' },
  { id: 'tresorerie', label: 'Trésorerie & Alertes', icon: '💰' },
  { id: 'rapprochements', label: 'Rapprochements & Approbations', icon: '🔗' },
  { id: 'budget-reel', label: 'Budget vs Réel', icon: '📈' },
  { id: 'reporting', label: 'Reporting & Prévisions', icon: '📋' },
  { id: 'audit', label: 'Audit & Logs', icon: '🔒' },
];

/* ─── Sub-components ─── */

function KpiCards() {
  const c = FINANCIAL_DATA.cockpit;
  const f = FINANCIAL_DATA.facturation;
  const kpis = [
    { label: 'BUDGET ALLOUÉ', value: FMT(c.budgetAlloue), sub: 'Campagnes Q2 — Mayi + Digital', color: 'var(--dark)', unit: 'FCFA' },
    { label: 'BUDGET RÉALISÉ', value: FMT(c.budgetRealise), sub: '69,4 % consommé', color: 'var(--dark)', unit: 'FCFA' },
    { label: 'CA FACTURÉ CLIENT', value: FMT(f.caFacture), sub: `Reste à facturer: ${FMT(f.resteAFacturer)}`, color: 'var(--blue)', unit: 'FCFA' },
    { label: 'ÉCART BUDGET/RÉEL', value: `+${c.ecartPct} %`, sub: c.ecartNote, color: 'var(--green)', unit: '' },
    { label: 'TRÉSORERIE DISPONIBLE', value: FMT(c.tresorerieDisponible), sub: c.tresorerieNote, color: 'var(--green)', unit: 'FCFA' },
    { label: 'EN ATTENTE VALIDATION', value: c.enAttenteValidation, sub: c.attenteDetail, color: 'var(--dark)', unit: '' },
    { label: 'ALERTES ACTIVES', value: c.alertesActives, sub: c.alertesDetail, color: 'var(--red)', unit: '' },
  ];

  return (
    <div className="fin-kpi-row">
      {kpis.map((k, i) => (
        <div key={i} className="fin-kpi-card">
          <div className="fin-kpi-label">{k.label}</div>
          <div className="fin-kpi-value" style={{ color: k.color }}>{k.value}</div>
          {k.unit && <div className="fin-kpi-unit">{k.unit}</div>}
          <div className="fin-kpi-sub">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}

function BudgetChart() {
  const data = FINANCIAL_DATA.budgetExecution;
  const maxVal = Math.max(...data.postes.flatMap(p => [p.budget, p.reel, p.prevision]));

  return (
    <div className="fin-section-card">
      <h3 className="fin-section-title">EXÉCUTION BUDGET VS RÉEL — {data.campagne.toUpperCase()}</h3>
      <div className="fin-chart-area">
        <div className="fin-chart-bars">
          {data.postes.map((p, i) => (
            <div key={i} className="fin-chart-group">
              <div className="fin-chart-bar-set">
                <div className="fin-chart-bar fin-bar-budget" style={{ height: `${(p.budget / maxVal) * 100}%` }} title={`Budget: ${FMT(p.budget)}`} />
                <div className="fin-chart-bar fin-bar-reel" style={{ height: `${(p.reel / maxVal) * 100}%` }} title={`Réel: ${FMT(p.reel)}`} />
                <div className="fin-chart-bar fin-bar-prev" style={{ height: `${(p.prevision / maxVal) * 100}%` }} title={`Prévision: ${FMT(p.prevision)}`} />
              </div>
              <div className="fin-chart-label">{p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name}</div>
            </div>
          ))}
        </div>
        <div className="fin-chart-legend">
          <span><i className="fin-legend-dot" style={{ background: 'var(--orange)' }} /> Budget</span>
          <span><i className="fin-legend-dot" style={{ background: '#E74C3C' }} /> Réel</span>
          <span><i className="fin-legend-dot" style={{ background: '#ddd' }} /> Prévision</span>
        </div>
      </div>
      <div className="fin-ecarts">
        <strong>Analyse automatique des écarts :</strong>
        <ul>
          {data.ecarts.map((e, i) => (
            <li key={i} className={`fin-ecart-item fin-ecart-${e.type}`}>
              {e.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WorkflowPanel() {
  const wf = FINANCIAL_DATA.workflow;
  return (
    <div className="fin-section-card">
      <h3 className="fin-section-title">WORKFLOW DES ACTIONS EN COURS</h3>
      <div className="fin-workflow-steps">
        {wf.steps.map((s, i) => (
          <div key={i} className="fin-wf-step-wrapper">
            <div className={`fin-wf-step ${s.num <= wf.currentStep ? 'active' : ''}`}>
              {s.num}
            </div>
            {i < wf.steps.length - 1 && <div className={`fin-wf-line ${s.num < wf.currentStep ? 'active' : ''}`} />}
          </div>
        ))}
      </div>
      <div className="fin-workflow-labels">
        {wf.steps.map((s, i) => (
          <div key={i} className="fin-wf-label">{s.label}</div>
        ))}
      </div>
      <div className="fin-workflow-counts">
        {wf.counts.map((c, i) => (
          <div key={i} className="fin-wf-count-row">
            <span className="fin-wf-count-label">
              <i className="fin-legend-dot" style={{ background: c.color }} /> {c.label}
            </span>
            <span className="fin-wf-count-value">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OperationsRegister() {
  const ops = FINANCIAL_DATA.operations;
  const getStatutClass = (s) => {
    if (s === 'En validation') return 'tag-yellow';
    if (s === 'Validée') return 'tag-green';
    if (s === 'Réconcilié') return 'tag-blue';
    if (s === 'À réconcilier') return 'tag-purple';
    return 'tag-muted';
  };
  const getActionClass = (a) => {
    if (a === 'Approuver') return 'btn-orange';
    if (a === 'Réconcilier') return 'btn-green';
    return 'btn-ghost';
  };

  return (
    <div className="fin-section-card">
      <h3 className="fin-section-title">REGISTRE DES OPÉRATIONS — BC · FACTURES · REÇUS</h3>
      <div className="fin-ops-actions">
        <button className="btn btn-green btn-sm">+ Bon de Commande</button>
        <button className="btn btn-green btn-sm">+ Facture</button>
        <button className="btn btn-orange btn-sm">+ Reçu</button>
        <button className="btn btn-ghost btn-sm">Rapprochement Bancaire</button>
        <button className="btn btn-ghost btn-sm">Import Automatique (OCR)</button>
      </div>
      <table className="table fin-ops-table">
        <thead>
          <tr>
            <th>TYPE</th>
            <th>RÉFÉRENCE</th>
            <th>CLIENT / CAMPAGNE</th>
            <th className="text-right">MONTANT</th>
            <th>DATE</th>
            <th className="text-center">STATUT</th>
            <th>PIÈCES</th>
            <th className="text-center">ACTION RAPIDE</th>
          </tr>
        </thead>
        <tbody>
          {ops.map(op => (
            <tr key={op.id}>
              <td><span className={`fin-op-type ${op.type.includes('Bon') ? 'type-bc' : op.type.includes('Facture') ? 'type-fa' : 'type-rc'}`}>{op.type}</span></td>
              <td className="font-semibold">{op.reference}</td>
              <td>{op.client}</td>
              <td className="text-right font-semibold">{FMT(op.montant)} FCFA</td>
              <td>{op.date}</td>
              <td className="text-center"><span className={`tag ${getStatutClass(op.statut)}`}>{op.statut}</span></td>
              <td className="text-muted">{op.pieces}</td>
              <td className="text-center"><button className={`btn btn-sm ${getActionClass(op.action)}`}>{op.action}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AlertsSection() {
  return (
    <div className="fin-section-card">
      <h3 className="fin-section-title">ALERTES BUDGET & TRÉSORERIE</h3>
      <div className="fin-alerts-list">
        {FINANCIAL_DATA.alerts.map(a => (
          <div key={a.id} className={`fin-alert-card fin-alert-${a.severity}`}>
            <div className="fin-alert-content">
              <strong>{a.title}</strong> — {a.text}
            </div>
            <button className="btn btn-sm" style={{ background: a.actionColor, color: '#fff', flexShrink: 0 }}>{a.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportingSection() {
  const r = FINANCIAL_DATA.reporting;
  return (
    <div className="fin-section-card">
      <h3 className="fin-section-title">REPORTING & PRÉVISIONS</h3>
      <div className="fin-reporting-grid">
        <div className="fin-report-block">
          <div className="fin-report-label">{r.dernierRapport.title}</div>
          <div className="fin-report-detail">{r.dernierRapport.periode}</div>
          <div className="fin-report-date">{r.dernierRapport.diffuse}</div>
        </div>
        <div className="fin-report-block">
          <div className="fin-report-label">{r.prevision.title}</div>
          <div className="fin-report-detail">
            Probabilité de dépassement : <strong style={{ color: 'var(--orange)' }}>{r.prevision.probabilite} %</strong> {r.prevision.note}
          </div>
          <div className="progress-track progress-track-lg" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ background: 'var(--orange)', width: `${r.prevision.probabilite}%` }} />
          </div>
        </div>
      </div>
      <div className="fin-report-buttons">
        <button className="btn btn-orange btn-sm">Générer Report Client</button>
        <button className="btn btn-green btn-sm">Export Audit BEAC</button>
        <button className="btn btn-ghost btn-sm">Prévisionnel PDF</button>
      </div>
    </div>
  );
}

/* ─── Tab content panels ─── */

function DashboardTab() {
  return (
    <>
      <KpiCards />
      <div className="fin-two-cols">
        <BudgetChart />
        <WorkflowPanel />
      </div>
      <OperationsRegister />
      <div className="fin-two-cols">
        <AlertsSection />
        <ReportingSection />
      </div>
    </>
  );
}

function OperationsTab() {
  return <OperationsRegister />;
}

function TresorerieTab() {
  const t = FINANCIAL_DATA.treasury;
  return (
    <>
      <div className="fin-kpi-row">
        <div className="fin-kpi-card"><div className="fin-kpi-label">SOLDE ACTUEL</div><div className="fin-kpi-value" style={{ color: 'var(--green)' }}>{FMT(t.soldeActuel)}</div><div className="fin-kpi-unit">FCFA</div></div>
        <div className="fin-kpi-card"><div className="fin-kpi-label">ENTRÉES (30J)</div><div className="fin-kpi-value" style={{ color: 'var(--blue)' }}>{FMT(t.entrees30j)}</div><div className="fin-kpi-unit">FCFA</div></div>
        <div className="fin-kpi-card"><div className="fin-kpi-label">SORTIES (30J)</div><div className="fin-kpi-value" style={{ color: 'var(--red)' }}>{FMT(t.sorties30j)}</div><div className="fin-kpi-unit">FCFA</div></div>
        <div className="fin-kpi-card"><div className="fin-kpi-label">PROJECTION 30J</div><div className="fin-kpi-value" style={{ color: 'var(--purple)' }}>{FMT(t.projection30j)}</div><div className="fin-kpi-unit">FCFA</div></div>
      </div>
      <div className="fin-section-card">
        <h3 className="fin-section-title">ÉVOLUTION TRÉSORERIE</h3>
        <div className="fin-treasury-chart">
          {t.history.map((h, i) => {
            const maxH = Math.max(...t.history.map(x => x.solde));
            return (
              <div key={i} className="fin-treasury-bar-group">
                <div className="fin-treasury-bar" style={{ height: `${(h.solde / maxH) * 100}%` }}>
                  <span className="fin-treasury-bar-val">{(h.solde / 1000000).toFixed(0)}M</span>
                </div>
                <div className="fin-chart-label">{h.month}</div>
              </div>
            );
          })}
        </div>
      </div>
      <AlertsSection />
    </>
  );
}

function RapprochmentsTab() {
  const getStatClass = (s) => {
    if (s === 'Concordant') return 'tag-green';
    if (s === 'Écart mineur') return 'tag-yellow';
    if (s === 'Écart critique') return 'tag-red';
    return 'tag-muted';
  };
  return (
    <div className="fin-section-card">
      <h3 className="fin-section-title">RAPPROCHEMENTS & APPROBATIONS</h3>
      <table className="table fin-ops-table">
        <thead>
          <tr>
            <th>RÉFÉRENCE</th>
            <th>FOURNISSEUR</th>
            <th className="text-right">MONTANT BC</th>
            <th className="text-right">MONTANT FACTURE</th>
            <th className="text-right">ÉCART</th>
            <th className="text-center">STATUT</th>
            <th>DATE</th>
            <th className="text-center">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {FINANCIAL_DATA.rapprochements.map(r => (
            <tr key={r.id}>
              <td className="font-semibold">{r.reference}</td>
              <td>{r.fournisseur}</td>
              <td className="text-right">{FMT(r.montantBC)} FCFA</td>
              <td className="text-right">{r.montantFacture ? FMT(r.montantFacture) + ' FCFA' : '—'}</td>
              <td className="text-right" style={{ color: r.ecart > 0 ? 'var(--red)' : r.ecart < 0 ? 'var(--blue)' : 'var(--green)' }}>
                {r.ecart !== null ? (r.ecart >= 0 ? '+' : '') + FMT(r.ecart) : '—'}
              </td>
              <td className="text-center"><span className={`tag ${getStatClass(r.statut)}`}>{r.statut}</span></td>
              <td>{r.date}</td>
              <td className="text-center">
                {r.statut === 'Écart critique' && <button className="btn btn-red btn-sm">Investiguer</button>}
                {r.statut === 'En attente facture' && <button className="btn btn-ghost btn-sm">Relancer</button>}
                {r.statut === 'Concordant' && <span className="text-muted text-sm">✓ OK</span>}
                {r.statut === 'Écart mineur' && <button className="btn btn-ghost btn-sm">Accepter</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BudgetVsReelTab() {
  const cats = FINANCIAL_DATA.budgetVsReel.categories;
  return (
    <div className="fin-section-card">
      <h3 className="fin-section-title">BUDGET VS RÉEL — DÉTAIL PAR CATÉGORIE</h3>
      <div className="fin-bvr-grid">
        {cats.map((cat, i) => {
          const solde = cat.budget - cat.reel;
          return (
            <div key={i} className="fin-bvr-card" style={{ borderLeft: `4px solid ${cat.color}` }}>
              <div className="fin-bvr-name">{cat.name}</div>
              <div className="fin-bvr-amounts">
                <span>Budget: <strong>{FMT(cat.budget)}</strong></span>
                <span>Réel: <strong>{FMT(cat.reel)}</strong></span>
              </div>
              <div className="progress-track progress-track-lg" style={{ margin: '10px 0' }}>
                <div className="progress-fill" style={{ background: cat.color, width: `${cat.pct}%` }} />
              </div>
              <div className="fin-bvr-footer">
                <span>{cat.pct}% consommé</span>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>Solde: {FMT(solde)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReportingTab() {
  return (
    <>
      <ReportingSection />
      <div className="fin-section-card">
        <h3 className="fin-section-title">HISTORIQUE DES RAPPORTS</h3>
        <table className="table fin-ops-table">
          <thead>
            <tr>
              <th>PÉRIODE</th>
              <th>CLIENT</th>
              <th>FORMAT</th>
              <th>DATE DIFFUSION</th>
              <th className="text-center">STATUT</th>
              <th className="text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-semibold">Avril 2026</td>
              <td>Orange CMR</td>
              <td>PDF, Excel</td>
              <td>03/05/2026</td>
              <td className="text-center"><span className="tag tag-green">Diffusé</span></td>
              <td className="text-center"><button className="btn btn-ghost btn-sm">Télécharger</button></td>
            </tr>
            <tr>
              <td className="font-semibold">Mars 2026</td>
              <td>Orange CMR</td>
              <td>PDF</td>
              <td>05/04/2026</td>
              <td className="text-center"><span className="tag tag-green">Diffusé</span></td>
              <td className="text-center"><button className="btn btn-ghost btn-sm">Télécharger</button></td>
            </tr>
            <tr>
              <td className="font-semibold">Février 2026</td>
              <td>Orange CMR</td>
              <td>PDF, Excel</td>
              <td>03/03/2026</td>
              <td className="text-center"><span className="tag tag-green">Diffusé</span></td>
              <td className="text-center"><button className="btn btn-ghost btn-sm">Télécharger</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function AuditTab() {
  const getLevelIcon = (l) => {
    if (l === 'success') return '✅';
    if (l === 'warning') return '⚠️';
    if (l === 'error') return '❌';
    return 'ℹ️';
  };
  return (
    <div className="fin-section-card">
      <h3 className="fin-section-title">JOURNAL D'AUDIT & LOGS</h3>
      <table className="table fin-ops-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}></th>
            <th>DATE & HEURE</th>
            <th>UTILISATEUR</th>
            <th>ACTION</th>
            <th>DÉTAIL</th>
          </tr>
        </thead>
        <tbody>
          {FINANCIAL_DATA.auditLogs.map(log => (
            <tr key={log.id}>
              <td className="text-center">{getLevelIcon(log.level)}</td>
              <td className="text-muted">{log.date}</td>
              <td className="font-semibold">{log.user}</td>
              <td><span className={`tag ${log.level === 'success' ? 'tag-green' : log.level === 'warning' ? 'tag-yellow' : log.level === 'error' ? 'tag-red' : 'tag-blue'}`}>{log.action}</span></td>
              <td className="text-muted">{log.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Facturation Client Tab ─── */

function FacturationTab() {
  const fact = FINANCIAL_DATA.facturation;
  const [subTab, setSubTab] = useState('pipeline');

  const getStatutClass = (s) => {
    if (s === 'Encaissée' || s === 'Payée' || s === 'Lettré') return 'tag-green';
    if (s === 'Impayée' || s === 'Non lettré') return 'tag-red';
    if (s === 'Proforma en attente' || s === 'En création') return 'tag-yellow';
    if (s === 'Devis en cours') return 'tag-muted';
    if (s === 'Envoyé') return 'tag-blue';
    if (s === 'Programmé') return 'tag-purple';
    if (s === 'Écart mineur') return 'tag-yellow';
    return 'tag-muted';
  };

  const SUB_TABS = [
    { id: 'pipeline', label: 'Pipeline & Dossiers' },
    { id: 'factures', label: 'Registre Factures' },
    { id: 'relances', label: 'Relances' },
    { id: 'lettrage', label: 'Lettrage' },
    { id: 'echeancier', label: 'Échéancier' },
    { id: 'fonctions', label: 'Fonctions & Règles' },
  ];

  return (
    <>
      {/* KPIs Facturation */}
      <div className="fin-kpi-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="fin-kpi-card"><div className="fin-kpi-label">CA FACTURÉ</div><div className="fin-kpi-value" style={{ color: 'var(--blue)' }}>{FMT(fact.caFacture)}</div><div className="fin-kpi-unit">FCFA</div></div>
        <div className="fin-kpi-card"><div className="fin-kpi-label">RESTE À FACTURER</div><div className="fin-kpi-value" style={{ color: 'var(--orange)' }}>{FMT(fact.resteAFacturer)}</div><div className="fin-kpi-unit">FCFA</div></div>
        <div className="fin-kpi-card"><div className="fin-kpi-label">CA ENCAISSÉ</div><div className="fin-kpi-value" style={{ color: 'var(--green)' }}>{FMT(fact.caEncaisse)}</div><div className="fin-kpi-unit">FCFA</div></div>
        <div className="fin-kpi-card"><div className="fin-kpi-label">EN COURS ENCAISSEMENT</div><div className="fin-kpi-value" style={{ color: 'var(--yellow)' }}>{FMT(fact.enCoursEncaissement)}</div><div className="fin-kpi-unit">FCFA</div></div>
        <div className="fin-kpi-card"><div className="fin-kpi-label">DSO MOYEN</div><div className="fin-kpi-value" style={{ color: fact.dso > 30 ? 'var(--red)' : 'var(--green)' }}>{fact.dso} j</div><div className="fin-kpi-sub">{fact.facutresImpayees} facture(s) impayée(s)</div></div>
      </div>

      {/* Sub-tabs */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {SUB_TABS.map(t => (
          <button key={t.id} className={`tab-item ${subTab === t.id ? 'active' : ''}`} onClick={() => setSubTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Pipeline & Dossiers */}
      {subTab === 'pipeline' && (
        <>
          <div className="fin-section-card">
            <h3 className="fin-section-title">PIPELINE FACTURATION — CYCLE DEVIS → ENCAISSEMENT</h3>
            <div className="fin-pipeline-header">
              {fact.pipelineStages.map((stage, i) => (
                <div key={i} className="fin-pipeline-stage-header">
                  <div className="fin-pipeline-stage-num">{i + 1}</div>
                  <span>{stage}</span>
                  {i < fact.pipelineStages.length - 1 && <div className="fin-pipeline-arrow">→</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="fin-section-card">
            <h3 className="fin-section-title">DOSSIERS CLIENTS</h3>
            <div className="fin-dossiers-list">
              {fact.dossiers.map(d => (
                <div key={d.id} className="fin-dossier-card">
                  <div className="fin-dossier-header">
                    <div>
                      <div className="fin-dossier-client">{d.client}</div>
                      <div className="fin-dossier-ref">{d.reference}</div>
                    </div>
                    <div className="fin-dossier-stage-badge" style={{ background: d.currentStage >= 4 ? 'var(--green)' : d.currentStage >= 3 ? 'var(--blue)' : 'var(--orange)' }}>
                      {fact.pipelineStages[d.currentStage]}
                    </div>
                  </div>
                  <div className="fin-dossier-pipeline">
                    {fact.pipelineStages.map((stage, i) => {
                      const data = i === 0 ? d.devis : i === 1 ? d.avenant : i === 2 ? d.proforma : i === 3 ? d.facture : d.encaissement;
                      const isActive = i <= d.currentStage;
                      const isCurrent = i === d.currentStage;
                      return (
                        <div key={i} className="fin-dossier-step">
                          <div className={`fin-dossier-dot ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                            {isActive && data ? '✓' : i + 1}
                          </div>
                          {i < 4 && <div className={`fin-dossier-line ${i < d.currentStage ? 'active' : ''}`} />}
                          <div className="fin-dossier-step-label">{stage}</div>
                          {data && (
                            <div className="fin-dossier-step-info">
                              {data.montant ? `${FMT(data.montant)} FCFA` : ''}
                              {data.statut && <div className="fin-dossier-step-status">{data.statut}</div>}
                            </div>
                          )}
                          {!data && i <= d.currentStage && <div className="fin-dossier-step-info fin-dossier-na">—</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Registre Factures */}
      {subTab === 'factures' && (
        <div className="fin-section-card">
          <h3 className="fin-section-title">REGISTRE DES FACTURES CLIENT</h3>
          <div className="fin-ops-actions">
            <button className="btn btn-orange btn-sm">+ Nouveau Devis</button>
            <button className="btn btn-green btn-sm">+ Émettre Proforma</button>
            <button className="btn btn-ghost btn-sm">+ Facture Finale</button>
            <button className="btn btn-ghost btn-sm">Export Comptable</button>
          </div>
          <table className="table fin-ops-table">
            <thead>
              <tr>
                <th>RÉFÉRENCE</th>
                <th>CLIENT</th>
                <th className="text-right">MONTANT HT</th>
                <th className="text-right">TVA 19,25%</th>
                <th className="text-right">MONTANT TTC</th>
                <th>ÉMISSION</th>
                <th>ÉCHÉANCE</th>
                <th className="text-center">STATUT</th>
                <th>RELANCE</th>
              </tr>
            </thead>
            <tbody>
              {fact.factures.map(f => (
                <tr key={f.id}>
                  <td className="font-semibold">{f.reference}</td>
                  <td>{f.client}</td>
                  <td className="text-right">{FMT(f.montantHT)}</td>
                  <td className="text-right text-muted">{FMT(f.tva)}</td>
                  <td className="text-right font-semibold">{FMT(f.montantTTC)}</td>
                  <td>{f.dateEmission}</td>
                  <td>{f.echeance}</td>
                  <td className="text-center"><span className={`tag ${getStatutClass(f.statut)}`}>{f.statut}</span></td>
                  <td className="text-muted text-sm">{f.relance || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Relances */}
      {subTab === 'relances' && (
        <div className="fin-section-card">
          <h3 className="fin-section-title">RELANCES AUTOMATISÉES</h3>
          <div className="ai-banner" style={{ marginBottom: 16 }}>
            <strong>⚡ Automatisation active</strong> — Relances J-5, J+5, J+15 configurées. Canal : Email + SMS. {fact.facutresImpayees} facture(s) en suivi actif.
          </div>
          <table className="table fin-ops-table">
            <thead>
              <tr>
                <th>FACTURE</th>
                <th>CLIENT</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>CANAL</th>
                <th className="text-center">STATUT</th>
                <th>RÉPONSE</th>
              </tr>
            </thead>
            <tbody>
              {fact.relances.map(r => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.facture}</td>
                  <td>{r.client}</td>
                  <td><span className={`tag ${r.type.includes('-') ? 'tag-blue' : 'tag-yellow'}`}>{r.type}</span></td>
                  <td>{r.date}</td>
                  <td>{r.canal}</td>
                  <td className="text-center"><span className={`tag ${getStatutClass(r.statut)}`}>{r.statut}</span></td>
                  <td className="text-muted">{r.reponse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lettrage */}
      {subTab === 'lettrage' && (
        <div className="fin-section-card">
          <h3 className="fin-section-title">LETTRAGE — MATCHING ENCAISSEMENT / FACTURE</h3>
          <div className="ai-banner" style={{ marginBottom: 16 }}>
            <strong>🔗 Matching automatique</strong> — Rapprochement bancaire → facture émise en temps réel. Solde client calculé automatiquement.
          </div>
          <table className="table fin-ops-table">
            <thead>
              <tr>
                <th>FACTURE</th>
                <th>CLIENT</th>
                <th className="text-right">MONTANT FACTURE</th>
                <th className="text-right">ENCAISSEMENT</th>
                <th className="text-right">ÉCART</th>
                <th>DATE MATCH</th>
                <th className="text-center">STATUT</th>
                <th>BANQUE</th>
              </tr>
            </thead>
            <tbody>
              {fact.lettrage.map(l => (
                <tr key={l.id}>
                  <td className="font-semibold">{l.facture}</td>
                  <td>{l.client}</td>
                  <td className="text-right">{FMT(l.montantFacture)} FCFA</td>
                  <td className="text-right">{l.encaissement > 0 ? FMT(l.encaissement) + ' FCFA' : '—'}</td>
                  <td className="text-right" style={{ color: l.ecart === 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                    {l.ecart === 0 ? '0' : FMT(l.ecart)}
                  </td>
                  <td>{l.dateMatch || '—'}</td>
                  <td className="text-center"><span className={`tag ${getStatutClass(l.statut)}`}>{l.statut}</span></td>
                  <td className="text-muted">{l.banque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Échéancier */}
      {subTab === 'echeancier' && (
        <div className="fin-section-card">
          <h3 className="fin-section-title">ÉCHÉANCIER PRÉVISIONNEL — ENTRÉES & SORTIES</h3>
          <table className="table fin-ops-table">
            <thead>
              <tr>
                <th>MOIS</th>
                <th className="text-right">ENTRÉES PRÉVUES</th>
                <th className="text-right">SORTIES PRÉVUES</th>
                <th className="text-right">SOLDE PRÉVU</th>
                <th className="text-center">TENDANCE</th>
              </tr>
            </thead>
            <tbody>
              {fact.echeancier.map((e, i) => (
                <tr key={i}>
                  <td className="font-semibold">{e.mois}</td>
                  <td className="text-right" style={{ color: 'var(--green)' }}>+{FMT(e.entrees)}</td>
                  <td className="text-right" style={{ color: 'var(--red)' }}>-{FMT(e.sorties)}</td>
                  <td className="text-right font-semibold">{FMT(e.soldePrevu)} FCFA</td>
                  <td className="text-center">
                    {e.entrees >= e.sorties
                      ? <span style={{ color: 'var(--green)', fontSize: 18 }}>↗</span>
                      : <span style={{ color: 'var(--red)', fontSize: 18 }}>↘</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="fin-echeancier-chart">
            {fact.echeancier.map((e, i) => {
              const maxVal = Math.max(...fact.echeancier.map(x => Math.max(x.entrees, x.sorties)));
              return (
                <div key={i} className="fin-ech-bar-group">
                  <div className="fin-ech-bars">
                    <div className="fin-ech-bar" style={{ height: `${(e.entrees / maxVal) * 100}%`, background: 'var(--green)' }} title={`Entrées: ${FMT(e.entrees)}`} />
                    <div className="fin-ech-bar" style={{ height: `${(e.sorties / maxVal) * 100}%`, background: 'var(--red)' }} title={`Sorties: ${FMT(e.sorties)}`} />
                  </div>
                  <div className="fin-chart-label">{e.mois.split(' ')[0]}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fonctions & Règles */}
      {subTab === 'fonctions' && (
        <>
          <div className="fin-section-card">
            <h3 className="fin-section-title">FONCTIONS DU MODULE FACTURATION CLIENT</h3>
            <table className="table fin-ops-table">
              <thead>
                <tr>
                  <th style={{ width: 120 }}>FONCTION</th>
                  <th>DESCRIPTION</th>
                  <th>IMPACT MÉTIER</th>
                </tr>
              </thead>
              <tbody>
                {fact.fonctions.map((fn, i) => (
                  <tr key={i}>
                    <td><span className="fin-func-badge">{fn.name}</span></td>
                    <td className="text-sm">{fn.description}</td>
                    <td className="text-sm" style={{ color: 'var(--dark)', fontWeight: 500 }}>{fn.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="fin-section-card">
            <h3 className="fin-section-title">RÈGLES MÉTIER AUTOMATISÉES</h3>
            <div className="fin-rules-list">
              {fact.regles.map((r, i) => (
                <div key={i} className="fin-rule-item">
                  <span className="fin-rule-bullet">⚙</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ─── Main Page ─── */

export default function FinancePage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardTab />;
      case 'operations': return <OperationsTab />;
      case 'facturation': return <FacturationTab />;
      case 'tresorerie': return <TresorerieTab />;
      case 'rapprochements': return <RapprochmentsTab />;
      case 'budget-reel': return <BudgetVsReelTab />;
      case 'reporting': return <ReportingTab />;
      case 'audit': return <AuditTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="fin-layout">
      {/* Internal sidebar */}
      <aside className="fin-sidebar">
        <div className="fin-sidebar-header">
          <div className="fin-sidebar-brand">McCANN BRIDGE</div>
          <div className="fin-sidebar-sub">FINANCIAL MANAGER</div>
        </div>
        <nav className="fin-sidebar-nav">
          {FINANCE_SECTIONS.map(s => (
            <button
              key={s.id}
              className={`fin-sidebar-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="fin-sidebar-icon">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="fin-main">
        <header className="fin-header">
          <div className="fin-header-left">
            <h1 className="fin-title">
              Cockpit Financier — Client : {FINANCIAL_DATA.client} · {FINANCIAL_DATA.cockpit ? 'Q2' : ''} {FINANCIAL_DATA.year}
            </h1>
          </div>
          <div className="fin-header-right">
            <select className="form-input form-select" style={{ width: 200, padding: '6px 12px' }}>
              <option>Orange Cameroun</option>
              <option>MTN Cameroun</option>
              <option>Tous les clients</option>
            </select>
          </div>
        </header>
        <div className="fin-content animate-fade">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
