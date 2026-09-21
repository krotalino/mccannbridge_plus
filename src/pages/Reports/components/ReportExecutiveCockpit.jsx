import { useState } from 'react';
import { 
  Users, Flame, Zap, DollarSign, BarChart3, ChevronRight, CheckCircle2,
  Calendar, ArrowUpRight, TrendingUp, ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import MiniSparkline from './MiniSparkline';
import SocialPlatformIcon from '../../../components/common/SocialPlatformIcon';

export default function ReportExecutiveCockpit({
  reports = [],
  onNavigateToTab,
  onOpenNewReport,
  onCreateReport,
  onSelectReport
}) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month'); // 'week' | 'month' | 'quarter' | 'ytd'
  const [chartMetric, setChartMetric] = useState('reach'); // 'reach' | 'engagements' | 'rate'

  const handleOpenNew = onOpenNewReport || onCreateReport;
  const handleNavigate = (tab) => {
    if (typeof onNavigateToTab === 'function') {
      onNavigateToTab(tab);
    }
  };

  // Compute live aggregates across reports
  const totalReports = reports.length;
  const deliveredReports = reports.filter(r => r.status === 'delivered' || r.status === 'approved').length;
  const inReviewReports = reports.filter(r => r.status === 'client_review' || r.status === 'internal_review').length;
  const urgentCount = reports.filter(r => r.priority === 'urgente' && r.status !== 'delivered').length;

  // Global Social Media & Performance Metrics (Consolidated)
  const macroKPIs = [
    {
      id: 'reach',
      label: 'Audience Totale Touchée',
      tag: 'Reach 360°',
      value: '14.82 M',
      change: '+18.4%',
      isPositive: true,
      subtext: 'vs M-1 (12.52 M) • 4 Marques',
      sparkline: [9.8, 10.5, 11.2, 12.5, 13.1, 14.2, 14.82],
      color: '#2980B9'
    },
    {
      id: 'engagements',
      label: 'Volume Total Interactions',
      tag: 'Clics & Partages',
      value: '1 248 500',
      change: '+22.6%',
      isPositive: true,
      subtext: 'Record historique T3 2026',
      sparkline: [820, 890, 940, 1050, 1120, 1190, 1248],
      color: '#FF7900'
    },
    {
      id: 'engagement_rate',
      label: 'Taux d’Engagement Global',
      tag: 'Mixte Organique + Ads',
      value: '5.84 %',
      change: '+1.1 pt',
      isPositive: true,
      subtext: 'Leader national vs MTN (3.9%)',
      sparkline: [4.2, 4.5, 4.9, 5.1, 5.4, 5.6, 5.84],
      color: '#27AE60'
    },
    {
      id: 'paid_efficiency',
      label: 'Efficacité Paid Media',
      tag: 'CPM Moyen',
      value: '420 FCFA',
      change: '-14.2%',
      isPositive: true,
      subtext: 'Économie budgétaire : 4.8M FCFA',
      sparkline: [580, 540, 510, 480, 450, 435, 420],
      color: '#8E44AD'
    }
  ];

  // Dynamic Historical Data for Recharts
  const evolutionData = [
    { name: 'Sem 1', reach: 2.8, engagements: 240, rate: 4.8 },
    { name: 'Sem 2', reach: 3.4, engagements: 310, rate: 5.1 },
    { name: 'Sem 3', reach: 4.1, engagements: 380, rate: 5.6 },
    { name: 'Sem 4', reach: 4.5, engagements: 318, rate: 5.9 },
  ];

  // Brand breakdown performance
  const brandMetrics = [
    {
      id: 'orange_telco',
      name: 'Orange TELCO',
      tagline: 'Grand Public, Mobile & Fibre',
      reach: '7.85 M',
      engagementRate: '5.4%',
      topFormat: 'Reels Pulse & Tutos',
      growth: '+14.2%',
      share: 53,
      color: '#FF7900',
      activeCampaign: 'Forfaits Génération Maxit & 4G+'
    },
    {
      id: 'orange_money',
      name: 'Orange Money (OM)',
      tagline: 'Paiements, Transferts & Épargne',
      reach: '4.20 M',
      engagementRate: '6.8%',
      topFormat: 'Quiz Interactifs & Reels Promo',
      growth: '+28.5%',
      share: 28,
      color: '#2980B9',
      activeCampaign: 'Frais Zéro & Réductions Marchands'
    },
    {
      id: 'orange_pulse',
      name: 'Orange Pulse',
      tagline: 'Jeunes, Gaming & Culture (18-25)',
      reach: '1.95 M',
      engagementRate: '7.9%',
      topFormat: 'TikTok Challenge & Twitch Live',
      growth: '+42.1%',
      share: 13,
      color: '#E83E8C',
      activeCampaign: 'Pulse Gaming Championship 2026'
    },
    {
      id: 'orange_business',
      name: 'Orange Business',
      tagline: 'B2B, Cloud & Cybersécurité',
      reach: '0.82 M',
      engagementRate: '3.8%',
      topFormat: 'Carrousels LinkedIn & Livres Blancs',
      growth: '+8.9%',
      share: 6,
      color: '#6F42C1',
      activeCampaign: 'Solutions Cloud Hybride CEMAC'
    }
  ];

  // Channel matrix
  const channels = [
    { name: 'Facebook', share: 44, reach: '6.5M', growth: '+12%', color: '#1877F2' },
    { name: 'TikTok', share: 26, reach: '3.8M', growth: '+48%', color: '#00F2FE' },
    { name: 'Instagram', share: 18, reach: '2.7M', growth: '+19%', color: '#E1306C' },
    { name: 'YouTube', share: 8, reach: '1.2M', growth: '+15%', color: '#FF0000' },
    { name: 'LinkedIn', share: 4, reach: '0.6M', growth: '+24%', color: '#0A66C2' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 30 }}>
      
      {/* ─── EN-TÊTE DE SECTION (Dashboard Analytics Style) ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#FF7900',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 2px 8px rgba(255, 121, 0, 0.3)'
            }}
          >
            📊
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
              Cockpit Exécutif 360° — Pilotage Stratégique & Live KPIs
            </h2>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, marginTop: 2 }}>
              Consolidation multi-marques Orange Cameroun × Agence McCann • Période active : Août 2026
            </p>
          </div>
        </div>

        {/* Boutons d'action rapide */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Timeframe selector pills */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: 3, 
              borderRadius: 8, 
              background: '#FFF', 
              border: '1px solid #E5E7EB' 
            }}
          >
            {[
              { id: 'week', label: 'Semaine' },
              { id: 'month', label: 'Mois (Août)' },
              { id: 'quarter', label: 'Trimestre (T3)' },
              { id: 'ytd', label: 'Année 2026' }
            ].map(tf => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setSelectedTimeframe(tf.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: selectedTimeframe === tf.id ? 800 : 600,
                  border: 'none',
                  background: selectedTimeframe === tf.id ? '#FF7900' : 'transparent',
                  color: selectedTimeframe === tf.id ? '#FFFFFF' : 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpenNew}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF7900', color: '#FFF' }}
          >
            <span>+</span> Nouvelle Demande
          </button>
        </div>
      </div>

      {/* ─── 4 MACRO KPI CARDS (Dashboard Analytics Style) ─── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: 14 
        }}
      >
        {macroKPIs.map((kpi) => (
          <div
            key={kpi.id}
            className="card p-16"
            style={{ 
              borderRadius: 12, 
              border: '1px solid #E0E0E0', 
              background: '#FFF',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                {kpi.label}
              </span>
              <span className="tag" style={{ fontSize: 10.5, background: `${kpi.color}15`, color: kpi.color, border: `1px solid ${kpi.color}30` }}>
                {kpi.tag}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--dark)' }}>
                {kpi.value}
              </div>
              <MiniSparkline data={kpi.sparkline} color={kpi.color} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
              <span style={{ color: kpi.isPositive ? '#27AE60' : '#DC3545', fontWeight: 700 }}>
                ▲ {kpi.change}
              </span>
              <span style={{ color: 'var(--muted)' }}>
                {kpi.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── INTERACTIVE EVOLUTION CHART (Dashboard Analytics Chart Card) ─── */}
      <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0', background: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', margin: 0 }}>
              📈 Trajectoire de Performance & Dynamique Hebdomadaire
            </h3>
            <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0, marginTop: 2 }}>
              Évolution consolidée multi-canaux (Orange Telco, OM, Pulse, B2B)
            </p>
          </div>

          {/* Metric selector pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'reach', label: 'Portée (Millions)', color: '#2980B9' },
              { id: 'engagements', label: 'Interactions (k)', color: '#FF7900' },
              { id: 'rate', label: 'Taux d’Engagement (%)', color: '#27AE60' }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setChartMetric(m.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: chartMetric === m.id ? 800 : 600,
                  border: chartMetric === m.id ? `1px solid ${m.color}` : '1px solid #E5E7EB',
                  background: chartMetric === m.id ? `${m.color}15` : '#FFF',
                  color: chartMetric === m.id ? m.color : '#4B5563',
                  cursor: 'pointer'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7900" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FF7900" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="chartGradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2980B9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2980B9" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="chartGradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27AE60" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#27AE60" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: '#1A1A2E', 
                  color: '#FFF', 
                  borderRadius: 8, 
                  border: 'none', 
                  fontSize: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey={chartMetric} 
                stroke={chartMetric === 'reach' ? '#2980B9' : chartMetric === 'engagements' ? '#FF7900' : '#27AE60'} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill={chartMetric === 'reach' ? 'url(#chartGradBlue)' : chartMetric === 'engagements' ? 'url(#chartGradOrange)' : 'url(#chartGradGreen)'} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── GRID: MATRICE DE PERFORMANCE PAR MARQUE + RÉPARTITION CANAUX ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        
        {/* Colonne Gauche: Matrice Marques */}
        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0', background: '#FFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #F0F0F0' }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🏢</span> Matrice de Performance par Entité de Marque
              </h3>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, marginTop: 2 }}>
                Suivi du reach, taux d'engagement et dynamique par ligne de business
              </p>
            </div>
            <span className="tag tag-orange" style={{ fontSize: 10.5 }}>
              4 Marques Actives
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {brandMetrics.map((brand) => (
              <div
                key={brand.id}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  background: '#F9FAFB'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span 
                      style={{ 
                        width: 10, 
                        height: 10, 
                        borderRadius: '50%', 
                        background: brand.color, 
                        display: 'inline-block' 
                      }} 
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                        {brand.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {brand.tagline}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                    <div>
                      <span style={{ color: 'var(--muted)', display: 'block' }}>Reach:</span>
                      <strong style={{ color: 'var(--dark)' }}>{brand.reach}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--muted)', display: 'block' }}>Eng.:</span>
                      <strong style={{ color: 'var(--dark)' }}>{brand.engagementRate}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--muted)', display: 'block' }}>Gain:</span>
                      <strong style={{ color: '#27AE60' }}>{brand.growth}</strong>
                    </div>
                  </div>
                </div>

                {/* Progress bar and campaign */}
                <div style={{ paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--muted)', marginBottom: 4 }}>
                    <span>Part de voix globale ({brand.share}%)</span>
                    <span>Campagne : <strong style={{ color: 'var(--dark)' }}>{brand.activeCampaign}</strong></span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 3,
                        width: `${brand.share}%`,
                        backgroundColor: brand.color,
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Droite: Répartition Canaux & SLA Gouvernance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Canaux Sociaux */}
          <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0', background: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>📱</span> Mix de Canaux & Diffusion
                </h3>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, marginTop: 2 }}>
                  Répartition du volume d'impressions et de visibilité
                </p>
              </div>
              <span className="tag tag-blue" style={{ fontSize: 10.5 }}>
                5 Plateformes
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {channels.map((ch) => (
                <div key={ch.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <SocialPlatformIcon platform={ch.name} size={15} />
                      <span style={{ color: 'var(--dark)' }}>{ch.name}</span>
                    </div>
                    <span style={{ color: 'var(--muted)' }}>
                      {ch.reach} • <strong style={{ color: '#27AE60' }}>{ch.growth}</strong>
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 3,
                        width: `${ch.share}%`,
                        backgroundColor: ch.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA & Gouvernance */}
          <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0', background: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🛡️</span> Gouvernance & SLA Agence McCann
              </h3>
              <span className="tag tag-green" style={{ fontSize: 10.5 }}>
                Conformité 98.5%
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, marginBottom: 12 }}>
              Suivi contractuel du délai de livraison des bilans et analyses
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ color: 'var(--muted)' }}>Rapports Livrés à date :</span>
                <strong style={{ color: '#27AE60' }}>{deliveredReports} livrés</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ color: 'var(--muted)' }}>En validation / revue :</span>
                <strong style={{ color: '#2980B9' }}>{inReviewReports} en cours</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ color: 'var(--muted)' }}>Demandes Urgentes :</span>
                <strong style={{ color: '#FF7900' }}>{urgentCount} actives</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleNavigate('demandes')}
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 12, width: '100%', border: '1px solid #D0D0D0', textAlign: 'center', justifyContent: 'center' }}
            >
              Consulter le Registre Détaillé →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
