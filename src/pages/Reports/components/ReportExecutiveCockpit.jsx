import { useState } from 'react';
import { 
  TrendingUp, Users, Eye, Zap, Target, DollarSign, Award, 
  ArrowUpRight, ArrowDownRight, Sparkles, BarChart2, ShieldCheck, 
  Layers, Compass, Flame, AlertTriangle, CheckCircle2, ChevronRight,
  PieChart, Activity, Globe, Send, BarChart3
} from 'lucide-react';
import { BRANDS_LIST } from '../../../data/reportsData';

export default function ReportExecutiveCockpit({
  reports = [],
  onNavigateToTab,
  onOpenNewReport,
  onCreateReport,
  onSelectReport
}) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month'); // 'week' | 'month' | 'quarter' | 'ytd'
  const [activeBrandFilter, setActiveBrandFilter] = useState('all');

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

  // Global Social Media & Performance Metrics (Aug 2026 consolidation)
  const macroKPIs = [
    {
      id: 'reach',
      label: 'Audience Totale Touchée (Reach 360°)',
      value: '14.82 M',
      change: '+18.4%',
      isPositive: true,
      subtext: 'vs M-1 (12.52 M) • 4 Marques',
      icon: <Users size={20} />,
      borderLeft: '4px solid #0099FF',
      color: '#0099FF'
    },
    {
      id: 'engagements',
      label: 'Volume Total Interactions & Clics',
      value: '1 248 500',
      change: '+22.6%',
      isPositive: true,
      subtext: 'Record historique T3 2026',
      icon: <Flame size={20} />,
      borderLeft: '4px solid #FF7900',
      color: '#FF7900'
    },
    {
      id: 'engagement_rate',
      label: 'Taux d’Engagement Global Mixte',
      value: '5.84 %',
      change: '+1.1 pt',
      isPositive: true,
      subtext: 'Leader national vs MTN (3.9%)',
      icon: <Zap size={20} />,
      borderLeft: '4px solid #28A745',
      color: '#28A745'
    },
    {
      id: 'paid_efficiency',
      label: 'Efficacité Paid Media (CPM Moyen)',
      value: '420 FCFA',
      change: '-14.2%',
      isPositive: true,
      subtext: 'Économie budgétaire : 4.8M FCFA',
      icon: <DollarSign size={20} />,
      borderLeft: '4px solid #6C757D',
      color: '#6C757D'
    }
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
      color: '#0099FF',
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
    <div className="space-y-5 animate-fadeIn pb-10">
      
      {/* En-tête de section avec navigation claire (Style Influence) */}
      <div className="flex flex-wrap items-center justify-between gap-16 mb-16">
        <div className="flex items-center gap-10">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#FF7900',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255, 121, 0, 0.25)',
            }}
          >
            <BarChart3 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
              2. Cockpit Exécutif 360° — Pilotage Stratégique & Live KPIs
            </h2>
            <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
              Consolidation multi-marques Orange Cameroun × Agence McCann • Période active : Août 2026
            </p>
          </div>
        </div>

        {/* Boutons d'action rapide */}
        <div className="flex items-center gap-8 flex-wrap">
          {/* Timeframe selector */}
          <div className="flex items-center p-1 rounded-lg bg-white border border-gray-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            {[
              { id: 'week', label: 'Semaine' },
              { id: 'month', label: 'Mois (Août)' },
              { id: 'quarter', label: 'Trimestre (T3)' },
              { id: 'ytd', label: 'Année 2026' }
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setSelectedTimeframe(tf.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  selectedTimeframe === tf.id
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-muted hover:text-dark'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenNew}
            className="btn btn-orange text-xs font-semibold flex items-center gap-6 px-14 py-8 rounded-lg shadow-sm"
          >
            <span>+</span>
            <span>Nouvelle Demande</span>
          </button>
        </div>
      </div>

      {/* 4 Macro KPI Cards (Style Influence) */}
      <div className="grid grid-4 gap-12 mb-16">
        {macroKPIs.map((kpi) => (
          <div
            key={kpi.id}
            className="card p-16"
            style={{ 
              background: '#fff', 
              borderRadius: 8, 
              borderLeft: kpi.borderLeft, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted font-bold uppercase tracking-wider">
                {kpi.label}
              </span>
              <span style={{ color: kpi.color }}>
                {kpi.icon}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-2xl font-black text-dark tracking-tight">
                {kpi.value}
              </div>
              <span 
                className="text-xs font-bold px-1.5 py-0.5 rounded"
                style={{ 
                  background: kpi.isPositive ? '#28A74515' : '#DC354515', 
                  color: kpi.isPositive ? '#28A745' : '#DC3545' 
                }}
              >
                {kpi.change}
              </span>
            </div>

            <p className="text-xs text-muted">
              {kpi.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Grid: Matrice de Performance par Marque + Répartition Canaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Colonne Gauche (2/3): Matrice Marques */}
        <div className="lg:col-span-2 card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between mb-16 pb-12 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-dark flex items-center gap-2">
                <span>🏢</span>
                <span>Matrice de Performance par Entité de Marque</span>
              </h3>
              <p className="text-xs text-muted mt-1">
                Suivi du reach, taux d'engagement et dynamique de croissance par ligne de business
              </p>
            </div>
            <span className="text-xs font-bold text-muted bg-gray-100 px-2.5 py-1 rounded">
              4 Marques Actives
            </span>
          </div>

          <div className="space-y-4">
            {brandMetrics.map((brand) => (
              <div
                key={brand.id}
                className="p-14 rounded-lg border border-gray-100 hover:border-orange-300 hover:bg-orange-50/10 transition-all"
                style={{ background: '#fafafa' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: brand.color }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-dark leading-tight">
                        {brand.name}
                      </h4>
                      <span className="text-xs text-muted">
                        {brand.tagline}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-muted text-[11px] block">Reach :</span>
                      <strong className="text-dark font-bold">{brand.reach}</strong>
                    </div>
                    <div>
                      <span className="text-muted text-[11px] block">Engagement :</span>
                      <strong className="text-dark font-bold">{brand.engagementRate}</strong>
                    </div>
                    <div>
                      <span className="text-muted text-[11px] block">Croissance :</span>
                      <span className="font-bold text-green-600">{brand.growth}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar and top format */}
                <div className="space-y-1.5 pt-2 border-t border-gray-200/60">
                  <div className="flex justify-between text-[11px] text-muted">
                    <span>Part de voix globale ({brand.share}%)</span>
                    <span>Campagne active : <strong className="text-dark">{brand.activeCampaign}</strong></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${brand.share}%`, backgroundColor: brand.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Droite (1/3): Répartition par Canal & Gouvernance */}
        <div className="space-y-5">
          
          {/* Canaux Sociaux */}
          <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
              <span>📱</span>
              <span>Mix de Canaux & Diffusion</span>
            </h3>
            <p className="text-xs text-muted mb-4">
              Répartition du volume d'impressions et de visibilité
            </p>

            <div className="space-y-3">
              {channels.map((ch) => (
                <div key={ch.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-dark">{ch.name}</span>
                    <span className="text-muted">
                      {ch.reach} • <strong className="text-green-600">{ch.growth}</strong>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${ch.share}%`, backgroundColor: ch.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA & Gouvernance Workflow */}
          <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #28A745' }}>
            <h3 className="text-sm font-bold text-dark mb-2 flex items-center gap-2">
              <span>🛡️</span>
              <span>Gouvernance & SLA Agence McCann</span>
            </h3>
            <p className="text-xs text-muted mb-4">
              Suivi contractuel du délai de livraison des rapports d'analyses
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-muted">Rapports Livrés à date :</span>
                <strong className="text-green-600 font-bold">{deliveredReports} livrés</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-muted">En validation / review :</span>
                <strong className="text-blue-600 font-bold">{inReviewReports} en cours</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-muted">Demandes Urgentes :</span>
                <strong className="text-orange-600 font-bold">{urgentCount} actives</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted">Conformité globale :</span>
                <span className="font-black text-dark">98.5% respecté</span>
              </div>
            </div>

            <button
              onClick={() => handleNavigate('demandes')}
              className="mt-4 w-full btn btn-ghost border text-xs font-bold py-2 rounded-lg text-center"
              style={{ background: '#fff' }}
            >
              Consulter le Registre Détaillé →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
