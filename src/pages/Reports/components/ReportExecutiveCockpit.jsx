import { useState } from 'react';
import { 
  TrendingUp, Users, Eye, Zap, Target, DollarSign, Award, 
  ArrowUpRight, ArrowDownRight, Sparkles, BarChart2, ShieldCheck, 
  Layers, Compass, Flame, AlertTriangle, CheckCircle2, ChevronRight,
  PieChart, Activity, Globe, Send
} from 'lucide-react';
import { BRANDS_LIST } from '../../../data/reportsData';

export default function ReportExecutiveCockpit({
  reports = [],
  onNavigateToTab,
  onOpenNewReport,
  onSelectReport
}) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month'); // 'week' | 'month' | 'quarter' | 'ytd'
  const [activeBrandFilter, setActiveBrandFilter] = useState('all');

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
      icon: <Users size={22} className="text-[#00D4FF]" />,
      glow: 'rgba(0, 212, 255, 0.25)',
      gradient: 'from-[#00D4FF]/20 to-transparent',
      borderColor: 'border-[#00D4FF]/30'
    },
    {
      id: 'engagements',
      label: 'Volume Total Interactions & Clics',
      value: '1 248 500',
      change: '+22.6%',
      isPositive: true,
      subtext: 'Record historique T3 2026',
      icon: <Flame size={22} className="text-[#FF6600]" />,
      glow: 'rgba(255, 102, 0, 0.3)',
      gradient: 'from-[#FF6600]/25 to-transparent',
      borderColor: 'border-[#FF6600]/40'
    },
    {
      id: 'engagement_rate',
      label: 'Taux d’Engagement Global Mixte',
      value: '5.84 %',
      change: '+1.1 pt',
      isPositive: true,
      subtext: 'Leader national vs MTN (3.9%)',
      icon: <Zap size={22} className="text-[#00D4FF]" />,
      glow: 'rgba(0, 212, 255, 0.25)',
      gradient: 'from-[#00D4FF]/20 to-transparent',
      borderColor: 'border-[#00D4FF]/30'
    },
    {
      id: 'paid_efficiency',
      label: 'Efficacité Paid Media (CPM Moyen)',
      value: '420 FCFA',
      change: '-14.2%',
      isPositive: true, // Lower CPM is better
      subtext: 'Économie de budget : 4.8M FCFA',
      icon: <DollarSign size={22} className="text-[#FF8C00]" />,
      glow: 'rgba(255, 140, 0, 0.25)',
      gradient: 'from-[#FF8C00]/20 to-transparent',
      borderColor: 'border-[#FF8C00]/35'
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
      color: '#FF6600',
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
      color: '#00D4FF',
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
      color: '#FF4D80',
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
      color: '#3B82F6',
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
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* Volumetric Top Bar / Timeframe selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl cosmic-glass-card">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6600] to-[#FF8C00] flex items-center justify-center text-white shadow-[0_0_25px_rgba(255,102,0,0.45)]">
            <Activity size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Cockpit Stratégique Exécutif & Live KPIs
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live 360° Data Feed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Consolidation multi-marques Orange Cameroun × Agence McCann • Période active : Août 2026
            </p>
          </div>
        </div>

        {/* Action Pills & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10">
            {[
              { id: 'week', label: 'Semaine (S33)' },
              { id: 'month', label: 'Mois (Août 2026)' },
              { id: 'quarter', label: 'Trimestre (T3)' },
              { id: 'ytd', label: 'Année 2026 YTD' }
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setSelectedTimeframe(tf.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTimeframe === tf.id
                    ? 'bg-gradient-to-r from-[#FF6600] to-[#FF8C00] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigateToTab('ia_insights')}
            className="px-3.5 py-2 rounded-xl cosmic-btn-cyan text-xs font-black flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={15} />
            <span>Synthèse IA Exécutive</span>
          </button>
        </div>
      </div>

      {/* 4 Cinematic Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {macroKPIs.map((kpi) => (
          <div
            key={kpi.id}
            className={`p-5 rounded-2xl cosmic-glass-card relative overflow-hidden group hover:scale-[1.01] transition-all border ${kpi.borderColor}`}
          >
            {/* Background subtle radial glow */}
            <div 
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity"
              style={{ background: kpi.glow }}
            />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
                {kpi.label}
              </span>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                {kpi.icon}
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-2 relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {kpi.value}
              </span>
              <span className="inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ArrowUpRight size={13} className="mr-0.5" />
                {kpi.change}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-medium relative z-10 flex items-center justify-between">
              <span>{kpi.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 21:9 Wide Section: Multi-Brand Breakdown & Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Brand Performance Matrix */}
        <div className="lg:col-span-2 p-6 rounded-2xl cosmic-glass-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/30">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight">
                  Performance & Pénétration par Marque
                </h3>
                <p className="text-xs text-slate-400">
                  Ventilation de la portée, engagement moyen et activations clés
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('speeches')}
              className="text-xs font-bold text-[#00D4FF] hover:text-[#26DEFF] flex items-center gap-1 transition-colors"
            >
              <span>Voir Data Studio</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandMetrics.map((brand) => (
              <div
                key={brand.id}
                className="p-4 rounded-xl bg-black/30 border border-white/10 hover:border-white/20 transition-all relative overflow-hidden group"
              >
                <div 
                  className="absolute top-0 left-0 bottom-0 w-1.5"
                  style={{ backgroundColor: brand.color }}
                />

                <div className="flex items-start justify-between mb-2.5 pl-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                      {brand.name}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {brand.share}% Part
                      </span>
                    </h4>
                    <div className="text-[11px] text-slate-400">{brand.tagline}</div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {brand.growth}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pl-2 my-3 text-xs">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[10px] block">Portée (Reach)</span>
                    <strong className="text-white font-black text-sm">{brand.reach}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[10px] block">Taux Engagement</span>
                    <strong className="text-[#00D4FF] font-black text-sm">{brand.engagementRate}</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pl-2">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Format Fort : <strong className="text-slate-200">{brand.topFormat}</strong></span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${brand.share * 1.5}%`, backgroundColor: brand.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Channels Breakdown & Live Alerts Radar */}
        <div className="space-y-6">
          
          {/* Channel Share Card */}
          <div className="p-6 rounded-2xl cosmic-glass-card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-[#00D4FF]" />
                <h3 className="text-sm font-black text-white">Mix Canaux & Portée</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">Total : 14.8M</span>
            </div>

            <div className="space-y-3">
              {channels.map((ch) => (
                <div key={ch.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                      <span className="font-bold text-white">{ch.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="font-mono">{ch.reach}</span>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1 rounded">
                        {ch.growth}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${ch.share}%`, backgroundColor: ch.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Governance Snapshot */}
          <div className="p-6 rounded-2xl cosmic-glass-card bg-gradient-to-br from-[#1A1F4E]/60 to-black/60 border border-[#FF6600]/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#FF6600]" />
                <h4 className="text-sm font-black text-white">Santé Workflow & SLA</h4>
              </div>
              <span className="text-xs font-extrabold text-[#FF6600] bg-[#FF6600]/10 px-2 py-0.5 rounded-full border border-[#FF6600]/30">
                100% Respect SLA
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 my-3">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Rapports livrés & validés :</span>
                <strong className="text-emerald-400 font-bold">{deliveredReports} / {totalReports}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>En validation client / revue :</span>
                <strong className="text-amber-400 font-bold">{inReviewReports}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Alertes prioritaires / urgentes :</span>
                <strong className={urgentCount > 0 ? 'text-red-400 font-black' : 'text-slate-400'}>
                  {urgentCount} dossier(s)
                </strong>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('requests')}
              className="w-full mt-2 py-2.5 rounded-xl cosmic-btn-primary text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Accéder au Registre des Rapports</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

        </div>
      </div>

      {/* Strategic AI Insights Banner */}
      <div className="p-6 rounded-2xl cosmic-glass-card bg-gradient-to-r from-[#FF6600]/15 via-[#00D4FF]/10 to-[#1A1F4E]/60 border border-white/15 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#0088FF] text-black shadow-[0_0_20px_rgba(0,212,255,0.4)] shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-black text-white tracking-tight">
                  Recommandation Stratégique IA — Cap T4 2026
                </h3>
                <span className="text-[10px] font-extrabold uppercase bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-0.5 rounded-full border border-[#00D4FF]/30">
                  Généré par McCann AI
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                « Surperformance nette du format <strong>Reels & TikTok Pulse (+42% d’engagement organique)</strong>. Il est préconisé de réallouer 15% du budget Display vers le sponsoring des micro-créateurs Tech/Gaming pour accélérer l’acquisition Maxit auprès des 18-25 ans. »
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('ia_insights')}
            className="px-4 py-2.5 rounded-xl cosmic-btn-cyan text-xs font-black shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Ouvrir l'Espace Recommandations IA</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
