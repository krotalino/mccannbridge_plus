import React, { useState } from 'react';
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

export default function AdsAnalyticsView({ data }) {
  const { filteredAds, metrics, breakdowns } = data;
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('budgetSpent');
  const [sortOrder, setSortOrder] = useState('desc');

  const displayAds = filteredAds.filter(ad => {
    if (statusFilter !== 'all' && ad.status !== statusFilter) return false;
    if (localSearch.trim()) {
      const term = localSearch.toLowerCase();
      return ad.name.toLowerCase().includes(term) ||
             ad.clientName.toLowerCase().includes(term) ||
             ad.channelName.toLowerCase().includes(term);
    }
    return true;
  }).sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* ─── 1. CARTES KPI DÉTAILLÉES ADS & SPONSORING (Style Traffic Manager) ─── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: 10 
        }}
      >
        <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>BUDGET ALLOUÉ</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>{(metrics.totalAdsBudget / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>FCFA HT</div>
        </div>

        <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>BUDGET DÉPENSÉ</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#FF7900', marginTop: 2 }}>{(metrics.totalAdsSpent / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: 10, color: '#27AE60', fontWeight: 700, marginTop: 2 }}>
            {Math.round((metrics.totalAdsSpent / (metrics.totalAdsBudget || 1)) * 100)}% engagé
          </div>
        </div>

        <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>IMPRESSIONS</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>{(metrics.totalImpressions / 1000000).toFixed(2)}M</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Vues payantes</div>
        </div>

        <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CLICS TOTAUX</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#2980B9', marginTop: 2 }}>{(metrics.totalClicks / 1000).toFixed(1)}K</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Trafic qualifié</div>
        </div>

        <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CTR MOYEN</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#27AE60', marginTop: 2 }}>{metrics.avgCTR}%</div>
          <div style={{ fontSize: 10, color: '#27AE60', fontWeight: 700, marginTop: 2 }}>+0.8% vs benchmark</div>
        </div>

        <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CPC MOYEN</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>{metrics.avgCPC} F</div>
          <div style={{ fontSize: 10, color: '#27AE60', fontWeight: 700, marginTop: 2 }}>Très efficient</div>
        </div>

        <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CPM MOYEN</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', marginTop: 2 }}>{metrics.avgCPM} F</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Pour 1000 vues</div>
        </div>

        <div className="card p-12" style={{ borderRadius: 10, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>CONVERSIONS</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#8E44AD', marginTop: 2 }}>{metrics.totalConversions.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: '#8E44AD', fontWeight: 700, marginTop: 2 }}>ROAS moyen 4.5x</div>
        </div>
      </div>

      {/* ─── 2. GRAPHIQUE COMPARATIF DE PERFORMANCE PAR CANAL ADS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📊</span> Budget Dépensé vs Clics Générés par Canal Ads
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
            Volume des dépenses et acquisition de trafic par régie publicitaire
          </p>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdowns.adsPerformanceByChannel} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar yAxisId="left" dataKey="spent" name="Dépensé (FCFA)" fill="#FF7900" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="clics" name="Clics Obtenus" fill="#2980B9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎯</span> Efficacité Tarifaire : CTR (%) vs Coût Par Clic (CPC)
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
            Analyse de la rentabilité des enchères sur chaque levier
          </p>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdowns.adsPerformanceByChannel} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={v => `${v}%`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={v => `${v} F`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar yAxisId="left" dataKey="ctr" name="Taux de Clic (CTR %)" fill="#27AE60" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="cpc" name="Coût par Clic (CPC FCFA)" fill="#8E44AD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── 3. TABLEAU DES CAMPAGNES ADS (Style Traffic Manager) ─── */}
      <div className="card" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', padding: 0 }}>
        {/* Table Toolbar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: '#FFFFFF' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚡</span> Bilan Opérationnel des Campagnes Ads ({displayAds.length})
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
              Toutes les campagnes sponsorisées avec métriques d’acquisition et conversions
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="search"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="🔍 Rechercher campagne..."
              style={{ fontSize: 13, padding: '7px 12px', borderRadius: 8, border: '1px solid #D0D0D0', width: 220, outline: 'none' }}
            />

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ fontSize: 13, padding: '7px 12px', borderRadius: 8, border: '1px solid #D0D0D0', background: '#FFFFFF', outline: 'none' }}
            >
              <option value="all">Tous statuts</option>
              <option value="active">Active</option>
              <option value="en_pause">En pause</option>
              <option value="terminee">Terminée</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E0E0E0' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Campagne Ads</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Client & Canal</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Statut</th>
                <th 
                  style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)', cursor: 'pointer' }}
                  onClick={() => toggleSort('budgetSpent')}
                >
                  Budget Dépensé ⬍
                </th>
                <th 
                  style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)', cursor: 'pointer' }}
                  onClick={() => toggleSort('impressions')}
                >
                  Impressions ⬍
                </th>
                <th 
                  style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)', cursor: 'pointer' }}
                  onClick={() => toggleSort('clics')}
                >
                  Clics ⬍
                </th>
                <th 
                  style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)', cursor: 'pointer' }}
                  onClick={() => toggleSort('ctr')}
                >
                  CTR ⬍
                </th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)' }}>CPC</th>
                <th 
                  style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)', cursor: 'pointer' }}
                  onClick={() => toggleSort('conversions')}
                >
                  Conversions ⬍
                </th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)' }}>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {displayAds.map(ad => {
                const percentSpent = Math.round((ad.budgetSpent / ad.budgetTotal) * 100);
                const getStatusTag = (st) => {
                  switch (st) {
                    case 'active': return <span className="tag tag-green">Active</span>;
                    case 'en_pause': return <span className="tag tag-yellow">En pause</span>;
                    default: return <span className="tag tag-gray">Terminée</span>;
                  }
                };

                return (
                  <tr key={ad.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{ad.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{ad.objective} · {ad.period}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{ad.clientName}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{ad.channelName}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      {getStatusTag(ad.status)}
                    </td>
                    <td style={{ padding: '10px 14px', minWidth: 140 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: 'var(--dark)' }}>{(ad.budgetSpent).toLocaleString('fr-FR')} F</span>
                        <span style={{ color: 'var(--muted)' }}>{percentSpent}%</span>
                      </div>
                      <div style={{ width: '100%', background: '#EAEAEA', height: 6, borderRadius: 10, overflow: 'hidden' }}>
                        <div
                          style={{
                            background: '#FF7900',
                            height: '100%',
                            borderRadius: 10,
                            width: `${Math.min(100, percentSpent)}%`
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: 'var(--body)' }}>
                      {ad.impressions.toLocaleString('fr-FR')}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#2980B9' }}>
                      {ad.clics.toLocaleString('fr-FR')}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#27AE60' }}>
                      {ad.ctr}%
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--muted)' }}>
                      {ad.cpc} F
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#8E44AD' }}>
                      {ad.conversions.toLocaleString('fr-FR')}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <span className="tag tag-green" style={{ fontSize: 11, fontWeight: 800 }}>
                        {ad.roas}x
                      </span>
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
