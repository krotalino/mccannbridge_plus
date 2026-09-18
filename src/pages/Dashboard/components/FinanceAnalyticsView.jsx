import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function FinanceAnalyticsView({ data }) {
  const { metrics, breakdowns, trends } = data;

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* ─── 1. CARTES FINANCIÈRES SYNTHÉTIQUES (Style Traffic Manager) ─── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: 14 
        }}
      >
        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            BUDGET TOTAL ALLOUÉ
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
            {(metrics.totalBudgetHT / 1000000).toFixed(1)}M <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>FCFA HT</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            Enveloppe annuelle 2026
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            DÉPENSÉ RÉEL HT
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FF7900', marginTop: 4 }}>
            {(metrics.totalSpentHT / 1000000).toFixed(1)}M <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>FCFA HT</span>
          </div>
          <div style={{ fontSize: 11, color: '#FF7900', fontWeight: 700, marginTop: 4 }}>
            {metrics.tauxConsommation}% consommé
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            RESTE À ENGAGER
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#27AE60', marginTop: 4 }}>
            {((metrics.totalBudgetHT - metrics.totalSpentHT) / 1000000).toFixed(1)}M <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>FCFA</span>
          </div>
          <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 700, marginTop: 4 }}>
            Trésorerie saine & sous contrôle
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            FACTURATION CA TTC
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
            {(metrics.totalTTC / 1000000).toFixed(1)}M <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>FCFA</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            TVA 19.25% incluse
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            MARGE BRUTE MCCANN
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#8E44AD', marginTop: 4 }}>
            {(metrics.commission / 1000000).toFixed(1)}M <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>FCFA</span>
          </div>
          <div style={{ fontSize: 11, color: '#8E44AD', fontWeight: 700, marginTop: 4 }}>
            Honoraires & Com. 8%
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            TAUX D’EXÉCUTION
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2980B9', marginTop: 4 }}>
            {metrics.tauxConsommation}%
          </div>
          <div style={{ fontSize: 11, color: '#2980B9', fontWeight: 700, marginTop: 4 }}>
            Conforme aux prévisions Q2
          </div>
        </div>
      </div>

      {/* ─── 2. GRAPHIQUE PRÉVISIONNEL VS RÉEL & POSTES DE DÉPENSES ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {/* Évolution Mensuelle Prévisionnel vs Réel */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📈</span> Budget Prévisionnel vs Réel (Mensuel 2026)
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
            Suivi de la variance budgétaire mois par mois
          </p>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                  formatter={val => [`${(Number(val) / 1000000).toFixed(1)}M FCFA`, '']}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar dataKey="budgetPrevu" name="Budget Prévisionnel" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="budgetReal" name="Consommation Réelle" fill="#FF7900" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consommation par Poste Budgétaire */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📊</span> Répartition et Consommation par Poste
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
            Comparaison Budget Alloué vs Réalisé
          </p>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={breakdowns.financialPostes}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                  formatter={val => [`${(Number(val) / 1000000).toFixed(1)}M FCFA`, '']}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar dataKey="budget" name="Budget Alloué" fill="#CBD5E1" radius={[0, 4, 4, 0]} />
                <Bar dataKey="reel" name="Réalisé" fill="#27AE60" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── 3. TABLEAU ANALYTIQUE DES POSTES BUDGÉTAIRES (Style Traffic Manager) ─── */}
      <div className="card" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0E0E0', background: '#FFFFFF' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💰</span> Ventilation Détaillée des Postes Budgétaires
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
            Écarts d’exécution, taux de consommation et statuts d’alerte
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E0E0E0' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Poste Analytique</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)' }}>Budget Alloué</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)' }}>Prévisionnel Q2</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)' }}>Consommation Réelle</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)' }}>Solde Disponible</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Taux Conso</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: 'var(--dark)' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {breakdowns.financialPostes.map((p, idx) => {
                const taux = Math.round((p.reel / p.budget) * 100);
                const solde = p.budget - p.reel;
                const isAlert = taux >= 80;

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--dark)' }}>{p.name}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: 'var(--dark)' }}>
                      {p.budget.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--muted)' }}>
                      {p.prevision.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#FF7900' }}>
                      {p.reel.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#27AE60' }}>
                      {solde.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td style={{ padding: '10px 14px', minWidth: 140 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: isAlert ? '#E74C3C' : 'var(--dark)' }}>{taux}%</span>
                      </div>
                      <div style={{ width: '100%', background: '#EAEAEA', height: 6, borderRadius: 10, overflow: 'hidden' }}>
                        <div
                          style={{
                            background: isAlert ? '#E74C3C' : '#27AE60',
                            height: '100%',
                            borderRadius: 10,
                            width: `${Math.min(100, taux)}%`
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      {isAlert ? (
                        <span className="tag tag-yellow">
                          Seuil 80%
                        </span>
                      ) : (
                        <span className="tag tag-green">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
