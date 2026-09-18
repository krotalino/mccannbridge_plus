import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import MiniSparkline from './MiniSparkline';

export default function OverviewView({ data, onNavigateTab, currentPerspective }) {
  const { metrics, breakdowns, trends } = data;
  const [metricMode, setMetricMode] = useState('budget'); // 'budget' | 'publications'

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* ─── 1. GRILLE DE SUPERBES CARTES KPI (Style Traffic Manager) ─── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: 14 
        }}
      >
        {/* KPI 1 : Total Publications */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              PUBLICATIONS
            </span>
            <span className="tag tag-orange" style={{ fontSize: 11 }}>
              📅 Contenus
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--dark)' }}>
              {metrics.totalPublications}
            </div>
            <MiniSparkline data={[12, 18, 15, 22, 28, 24, metrics.totalPublications]} color="#FF7900" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: '#27AE60', fontWeight: 700 }}>
              ▲ +14.2%
            </span>
            <span style={{ color: 'var(--muted)' }}>vs période préc.</span>
          </div>
        </div>

        {/* KPI 2 : Taux de Sponsoring */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              TAUX SPONSORING
            </span>
            <span className="tag tag-blue" style={{ fontSize: 11 }}>
              ⚡ Boost
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--dark)' }}>
              {metrics.sponsoringRate}%
            </div>
            <MiniSparkline data={[45, 50, 52, 60, 58, 64, metrics.sponsoringRate]} color="#2980B9" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: '#27AE60', fontWeight: 700 }}>
              ▲ +5.8%
            </span>
            <span style={{ color: 'var(--muted)' }}>{metrics.totalSponsoredPubs} sponsorisées</span>
          </div>
        </div>

        {/* KPI 3 : Budget Ads Dépensé */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              BUDGET ADS DÉPENSÉ
            </span>
            <span className="tag tag-yellow" style={{ fontSize: 11 }}>
              🎯 Média
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#E06800' }}>
              {(metrics.totalAdsSpent / 1000000).toFixed(1)}M
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginLeft: 4 }}>FCFA</span>
            </div>
            <MiniSparkline data={[14, 22, 31, 38, 42, 45, Math.round(metrics.totalAdsSpent / 1000000)]} color="#F39C12" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: '#27AE60', fontWeight: 700 }}>
              ▲ +18.5%
            </span>
            <span style={{ color: 'var(--muted)' }}>CTR {metrics.avgCTR}%</span>
          </div>
        </div>

        {/* KPI 4 : CA / Facturation Globale */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              FACTURATION CA TTC
            </span>
            <span className="tag tag-green" style={{ fontSize: 11 }}>
              💰 Finance
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#27AE60' }}>
              {(metrics.totalTTC / 1000000).toFixed(1)}M
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginLeft: 4 }}>FCFA</span>
            </div>
            <MiniSparkline data={[68, 74, 82, 93, 108, 116, Math.round(metrics.totalTTC / 5000000)]} color="#27AE60" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: '#27AE60', fontWeight: 700 }}>Conso {metrics.tauxConsommation}%</span>
            <span style={{ color: 'var(--muted)' }}>Marge {(metrics.commission / 1000000).toFixed(1)}M</span>
          </div>
        </div>

        {/* KPI 5 : Utilisateurs Actifs */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              UTILISATEURS ACTIFS
            </span>
            <span className="tag tag-purple" style={{ fontSize: 11 }}>
              👥 IAM
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--dark)' }}>
              {metrics.activeUsersCount}
            </div>
            <MiniSparkline data={[24, 28, 30, 35, 38, 40, metrics.activeUsersCount]} color="#8E44AD" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: '#27AE60', fontWeight: 700 }}>
              ▲ +12.0%
            </span>
            <span style={{ color: 'var(--muted)' }}>Adoption 94%</span>
          </div>
        </div>

        {/* KPI 6 : Influenceurs sous Contrat */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              INFLUENCEURS ACTIFS
            </span>
            <span className="tag tag-red" style={{ fontSize: 11 }}>
              ⭐ KOL
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--dark)' }}>
              {metrics.activeInfluencersCount}
            </div>
            <MiniSparkline data={[14, 18, 22, 25, 29, 31, metrics.activeInfluencersCount]} color="#E74C3C" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: 'var(--body)', fontWeight: 600 }}>{metrics.contractsSignedCount} sous contrat</span>
            <span style={{ color: 'var(--muted)' }}>Reach 14.8M</span>
          </div>
        </div>
      </div>

      {/* ─── 2. GRAPHIQUE CENTRAL & RÉPARTITIONS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {/* Grande courbe combinée Recharts */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📈</span> Évolution Temporelle Transverse (Janvier — Juin 2026)
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Rythme de publication, dépenses Ads et dynamique financière globale
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                onClick={() => setMetricMode('budget')}
                className="btn btn-sm"
                style={{
                  background: metricMode === 'budget' ? '#FF7900' : 'transparent',
                  color: metricMode === 'budget' ? '#FFFFFF' : 'var(--dark)',
                  border: metricMode === 'budget' ? 'none' : '1px solid #E0E0E0',
                  borderRadius: 6,
                  fontWeight: 700,
                  padding: '5px 12px',
                  transition: 'all 0.15s ease'
                }}
              >
                Budget & CA (FCFA)
              </button>
              <button
                type="button"
                onClick={() => setMetricMode('publications')}
                className="btn btn-sm"
                style={{
                  background: metricMode === 'publications' ? '#FF7900' : 'transparent',
                  color: metricMode === 'publications' ? '#FFFFFF' : 'var(--dark)',
                  border: metricMode === 'publications' ? 'none' : '1px solid #E0E0E0',
                  borderRadius: 6,
                  fontWeight: 700,
                  padding: '5px 12px',
                  transition: 'all 0.15s ease'
                }}
              >
                Publications & Ads
              </button>
            </div>
          </div>

          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              {metricMode === 'budget' ? (
                <AreaChart data={trends} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#27AE60" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#27AE60" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7900" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF7900" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                    formatter={(val) => [`${Number(val).toLocaleString('fr-FR')} FCFA`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Area type="monotone" dataKey="caFacture" name="CA Facturé TTC" stroke="#27AE60" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCa)" />
                  <Area type="monotone" dataKey="budgetReal" name="Budget Consommé" stroke="#FF7900" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReal)" />
                </AreaChart>
              ) : (
                <BarChart data={trends} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="publications" name="Volume Publications" fill="#FF7900" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversions" name="Conversions / Leads" fill="#2980B9" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Camembert : Répartition par Client */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🎯</span> Part des Publications par Client
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
              Volume total distribué sur les 4 grands comptes
            </p>
            <div style={{ height: 180, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdowns.publicationsByClient}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="client"
                  >
                    {breakdowns.publicationsByClient.map((entry, index) => (
                      <Cell key={`cell-client-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                    formatter={(val, name) => [`${val} publications`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ paddingTop: 12, borderTop: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {breakdowns.publicationsByClient.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c.color }} />
                  <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{c.client}</span>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--dark)' }}>{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. ALERTES TRANSVERSES & ACTIONS OPÉRATIONNELLES (Style TrafficSmartAlerts) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {/* Alertes Synthétiques */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🚨</span> Alertes Transverses & Vigilances
            </h3>
            <span className="tag tag-yellow" style={{ fontSize: 11, fontWeight: 700 }}>
              3 notifications critiques
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Alerte 1 */}
            <div 
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: '#FFF8F2',
                borderLeft: '4px solid #E74C3C',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 18 }}>🚨</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#C0392B' }}>
                    Seuil Budgétaire 80% — Poste Influence KOL
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--body)', marginTop: 2 }}>
                    Le poste influence Mayi Festival a atteint 83.9% (23.5M / 28M FCFA). Risque de dépassement d’ici le 25 Mai.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('finance')}
                className="btn btn-sm btn-orange"
                style={{ fontSize: 11, padding: '4px 10px', flexShrink: 0 }}
              >
                Ajuster
              </button>
            </div>

            {/* Alerte 2 */}
            <div 
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: '#FFF8F2',
                borderLeft: '4px solid #F39C12',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 18 }}>⏳</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#D35400' }}>
                    Validation Client en attente (48h dépassées)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--body)', marginTop: 2 }}>
                    Campagne Orange Business « Cloud & Cybersécurité PME » en attente de signature Sandrine Moukoko.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('calendar')}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 11, padding: '4px 10px', flexShrink: 0 }}
              >
                Voir BAT
              </button>
            </div>

            {/* Alerte 3 */}
            <div 
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: '#F0F7FD',
                borderLeft: '4px solid #2980B9',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 18 }}>🚀</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#2980B9' }}>
                    Sur-performance Ads TikTok — Pulse Gaming
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--body)', marginTop: 2 }}>
                    Le CTR atteint 4.2% avec un CPC record de 50 FCFA. Recommandation : réallouer 1.5M FCFA de Facebook Ads vers TikTok.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('ads')}
                className="btn btn-sm"
                style={{ background: '#2980B9', color: '#FFF', fontSize: 11, padding: '4px 10px', flexShrink: 0 }}
              >
                Optimiser
              </button>
            </div>
          </div>
        </div>

        {/* Accès Rapide & Diagnostics Directs */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚡</span> Diagnostics Opérationnels Rapides
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 14px 0' }}>
              Accéder directement aux sous-tableaux de bord métier
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
              <button
                type="button"
                onClick={() => onNavigateTab('calendar')}
                style={{
                  padding: '12px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  background: '#FAFAFA',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>📅 Calendrier & Formats</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>→</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {metrics.totalPublications} contenus planifiés · 6 canaux
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('ads')}
                style={{
                  padding: '12px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  background: '#FAFAFA',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>⚡ Ads & Sponsoring</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>→</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {(metrics.totalAdsSpent / 1000000).toFixed(1)}M dépensés · {metrics.totalClicks.toLocaleString()} clics
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('finance')}
                style={{
                  padding: '12px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  background: '#FAFAFA',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>💰 Suivi Financier</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>→</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {(metrics.totalTTC / 1000000).toFixed(1)}M TTC · {metrics.tauxConsommation}% exécuté
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('influence')}
                style={{
                  padding: '12px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  background: '#FAFAFA',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>⭐ Influenceurs & ROI</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>→</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {metrics.activeInfluencersCount} talents actifs · Reach 14.8M
                </div>
              </button>
            </div>
          </div>

          <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
            <span>Données rafraîchies via Bridge Data Bus</span>
            <span style={{ fontWeight: 700, color: '#27AE60' }}>SLA Conformité 99.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
