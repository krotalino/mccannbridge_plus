import { useState } from 'react';
import { 
  Users, Flame, Zap, DollarSign, BarChart3, ChevronRight, CheckCircle2,
  Calendar, ArrowUpRight, TrendingUp, ShieldCheck, Clock, RefreshCw, 
  HelpCircle, Eye, Share2, Download, AlertTriangle, Lightbulb, Sparkles, Filter
} from 'lucide-react';
import SocialPlatformIcon from '../../../components/common/SocialPlatformIcon';
import MiniSparkline from './MiniSparkline';
import { 
  REPORTING_PERIODS, 
  BRAND_PERIMETERS, 
  DIFFUSION_TYPES, 
  PERIOD_SYNTHESIS, 
  EXECUTIVE_KPIS 
} from '../../../data/reportingWeeklyDataSept2026';

export default function ClientExecutiveCockpit({
  selectedPeriod,
  onPeriodChange,
  selectedBrand,
  onBrandChange,
  selectedChannel,
  onChannelChange,
  diffusionType,
  onDiffusionTypeChange,
  compareMode,
  onToggleCompareMode,
  lastSyncTime,
  onRefresh,
  isRefreshing,
  onNavigateToTab,
  onOpenExport
}) {
  const [synthesisValidated, setSynthesisValidated] = useState(true);
  const [validationComment, setValidationComment] = useState('Validé par Steve Bessoube (McCann) le 21/09/2026 à 09:30');

  const currentKPIs = EXECUTIVE_KPIS[selectedBrand] || EXECUTIVE_KPIS.all;
  const currentSynthesis = PERIOD_SYNTHESIS[selectedBrand] || PERIOD_SYNTHESIS.all;

  const channelsList = [
    { id: 'all', label: 'Tous les canaux' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'x', label: 'X (Twitter)' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'youtube', label: 'YouTube' }
  ];

  return (
    <div className="space-y-5 animate-fadeIn pb-10">
      
      {/* ─── BANDEAU DE CONTEXTE ET FILTRES (Cahier des charges Page 1) ─── */}
      <div 
        className="card p-14 rounded-xl border border-gray-200 bg-white shadow-sm"
        style={{ borderRadius: 12, border: '1px solid #E5E7EB' }}
      >
        {/* Ligne 1 : Titre cockpit & Fraîcheur des données */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div 
              style={{ 
                width: 36, 
                height: 36, 
                borderRadius: 8, 
                background: '#FF7900', 
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(255, 121, 0, 0.3)'
              }}
            >
              <BarChart3 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-gray-900 m-0">Cockpit Exécutif — Décisionnel Client</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                  Vue Synthèse 60s
                </span>
              </div>
              <p className="text-xs text-gray-500 m-0">
                Période active : Du 14 au 20 Septembre 2026 (Semaine S38) vs S37
              </p>
            </div>
          </div>

          {/* Statut de fraîcheur des données */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">Synchro Active :</span>
              <span>{lastSyncTime || '21 Septembre 2026 • 11:42'}</span>
            </div>
            <div className="text-[11px] text-gray-500 hidden sm:block">
              Couverture : <strong>100% Facebook, LinkedIn, X, Insta, YouTube</strong>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="btn btn-ghost btn-sm flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-300"
              title="Actualiser les données"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Synchro...' : 'Rafraîchir'}</span>
            </button>
          </div>
        </div>

        {/* Ligne 2 : Filtres dynamiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Période analysée */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
              Période analysée
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="w-full text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-md py-1.5 px-2.5 focus:outline-none focus:border-orange-500"
            >
              {REPORTING_PERIODS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Périmètre de marque */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
              Périmètre de marque
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="w-full text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-md py-1.5 px-2.5 focus:outline-none focus:border-orange-500"
            >
              {BRAND_PERIMETERS.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>

          {/* Type de diffusion */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
              Type de diffusion
            </label>
            <select
              value={diffusionType}
              onChange={(e) => onDiffusionTypeChange(e.target.value)}
              className="w-full text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-md py-1.5 px-2.5 focus:outline-none focus:border-orange-500"
            >
              {DIFFUSION_TYPES.map(d => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Comparaison temporelle */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
              Comparaison temporelle
            </label>
            <button
              type="button"
              onClick={onToggleCompareMode}
              className={`w-full text-xs font-bold py-1.5 px-2.5 rounded-md border flex items-center justify-between transition-colors ${
                compareMode 
                  ? 'bg-orange-500 text-white border-orange-600 shadow-sm' 
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <span>{compareMode ? '✓ vs. S37 (Période précédente)' : 'Période seule'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/15 font-mono">
                {compareMode ? 'ACTIF' : 'CLIQUEZ'}
              </span>
            </button>
          </div>
        </div>

        {/* Ligne 3 : Sélecteur de canal social avec vraies icônes */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-gray-500 mr-1">Canaux :</span>
            {channelsList.map(ch => {
              const isSelected = selectedChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onChannelChange(ch.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ch.id !== 'all' && (
                    <SocialPlatformIcon platform={ch.id} size={13} />
                  )}
                  <span>{ch.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToTab('action_plan')}
              className="btn btn-ghost btn-sm text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold"
            >
              <Download size={13} />
              <span>Télécharger le Bilan S38 (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 7 KPI PRIORITAIRES (Cahier des charges Page 2) ─── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
              KPI Prioritaires de la période
            </h3>
            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              7 Indicateurs Clés • Lecture Directe
            </span>
          </div>
          <div className="text-xs text-gray-600 font-medium">
            Formule Taux d’engagement : <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] text-gray-800 font-bold font-mono">(Engagements / Portée) × 100</code>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {currentKPIs.map((kpi, idx) => {
            const colors = ['#FF7900', '#2980B9', '#27AE60', '#8E44AD', '#E74C3C', '#F39C12', '#16A085'];
            const tags = ['👥 Audience', '👁 Visibilité', '❤️ Réactions', '📈 Taux', '▶️ Vidéos', '📄 Volume', '⚡ Rendement'];
            const tagClasses = ['tag-orange', 'tag-blue', 'tag-green', 'tag-purple', 'tag-red', 'tag-yellow', 'tag-blue'];
            const sparkData = [
              [12, 16, 18, 22, 25, 29, 34],
              [40, 52, 60, 75, 88, 95, 110],
              [8, 12, 15, 19, 22, 28, 31],
              [6.8, 6.5, 6.7, 6.4, 6.3, 6.5, 6.2],
              [20, 30, 45, 60, 95, 120, 150],
              [12, 15, 14, 18, 19, 21, 23],
              [85, 90, 92, 98, 100, 102, 105]
            ];

            return (
              <div 
                key={kpi.id}
                className="card p-14"
                style={{
                  borderRadius: 12,
                  border: '1px solid #E0E0E0',
                  background: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease',
                  marginBottom: 0
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={kpi.label}>
                      {kpi.label}
                    </span>
                    <span className={`tag ${tagClasses[idx % tagClasses.length]}`} style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 5px' }}>
                      {tags[idx % tags.length]}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4, marginBottom: 6 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--dark)', letterSpacing: '-0.5px' }}>
                      {kpi.value}
                    </div>
                    <MiniSparkline data={sparkData[idx % sparkData.length]} color={colors[idx % colors.length]} width={54} height={24} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 8 }}>
                    <span style={{ color: kpi.isPositive ? '#27AE60' : '#E74C3C', fontWeight: 800 }}>
                      {kpi.isPositive ? `▲ ${kpi.change}` : `▼ ${kpi.change}`}
                    </span>
                    <span style={{ color: 'var(--muted)' }}>
                      vs {kpi.prevValue}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 6 }}>
                  <p style={{ fontSize: 10, color: '#718096', margin: 0, lineHeight: 1.3 }} title={kpi.explication}>
                    {kpi.explication}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SYNTHÈSE AUTOMATIQUE VALIDABLE (Cahier des charges Page 2) ─── */}
      <div 
        className="card p-4 rounded-xl border border-orange-200 bg-gradient-to-br from-white via-orange-50/20 to-orange-100/30 shadow-sm"
        style={{ borderRadius: 12, border: '1px solid #FFE0B2' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 mb-3 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 m-0">
                À Retenir Cette Période — Synthèse Décisionnelle McCann
              </h4>
              <p className="text-[11px] text-gray-600 m-0">
                Trois messages brefs de direction validés et certifiés par l’équipe d’analyse
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              synthesisValidated ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              <CheckCircle2 size={12} />
              {synthesisValidated ? 'Synthèse Validée par McCann' : 'Revue Client en attente'}
            </span>

            <button
              type="button"
              onClick={() => setSynthesisValidated(!synthesisValidated)}
              className="text-xs text-orange-600 hover:text-orange-700 underline font-semibold ml-1"
            >
              {synthesisValidated ? 'Modifier' : 'Approuver'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* 1. Principal Succès */}
          <div className="p-3 bg-white rounded-lg border border-emerald-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>1. PRINCIPAL SUCCÈS</span>
            </div>
            <p className="text-xs text-gray-800 font-medium m-0 leading-relaxed">
              {currentSynthesis.success}
            </p>
          </div>

          {/* 2. Point de Vigilance */}
          <div className="p-3 bg-white rounded-lg border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>2. POINT DE VIGILANCE</span>
            </div>
            <p className="text-xs text-gray-800 font-medium m-0 leading-relaxed">
              {currentSynthesis.vigilance}
            </p>
          </div>

          {/* 3. Opportunité / Recommandation Immédiate */}
          <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-blue-700 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>3. RECOMMANDATION IMMÉDIATE</span>
            </div>
            <p className="text-xs text-gray-800 font-medium m-0 leading-relaxed">
              {currentSynthesis.recommendation}
            </p>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-orange-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>Signé : <strong>Steve Bessoube</strong> (Digital Web Analyst & Media, McCann)</span>
          <span className="italic">Prochaine revue hebdomadaire : Lundi 28 Septembre 2026 à 10h00</span>
        </div>
      </div>

      {/* ─── PASSERELLES VERS LES AUTRES SECTIONS (Navigation Client) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigateToTab('brand')}
          className="card p-16 text-left transition-all group"
          style={{
            borderRadius: 12,
            border: '1px solid #E0E0E0',
            background: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div className="flex items-center justify-between text-xs font-bold text-gray-900 group-hover:text-orange-600 mb-1">
            <span style={{ fontSize: 13, fontWeight: 800 }}>2. Performance Marque</span>
            <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-gray-500 m-0">
            Détail opérationnel par entité (Telco, OM, OB), graphiques et multi-plateforme.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('campaigns')}
          className="card p-16 text-left transition-all group"
          style={{
            borderRadius: 12,
            border: '1px solid #E0E0E0',
            background: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div className="flex items-center justify-between text-xs font-bold text-gray-900 group-hover:text-orange-600 mb-1">
            <span style={{ fontSize: 13, fontWeight: 800 }}>3. Campagnes & Contenus</span>
            <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-gray-500 m-0">
            Prises de parole Lions4Life, Best Deal, classements et top contenus.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('benchmark')}
          className="card p-16 text-left transition-all group"
          style={{
            borderRadius: 12,
            border: '1px solid #E0E0E0',
            background: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div className="flex items-center justify-between text-xs font-bold text-gray-900 group-hover:text-orange-600 mb-1">
            <span style={{ fontSize: 13, fontWeight: 800 }}>4. Benchmark & Insights</span>
            <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-gray-500 m-0">
            3 espaces (Orange vs MTN/Camtel, OM vs MoMo, OB vs MTN B) & best posts réels.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('action_plan')}
          className="card p-16 text-left transition-all group"
          style={{
            borderRadius: 12,
            border: '1px solid #E0E0E0',
            background: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div className="flex items-center justify-between text-xs font-bold text-gray-900 group-hover:text-orange-600 mb-1">
            <span style={{ fontSize: 13, fontWeight: 800 }}>5. Plan d’Action & Livrables</span>
            <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-gray-500 m-0">
            Plan d’action AARRR, validation des livrables et bibliothèque PDF S38.
          </p>
        </button>
      </div>

    </div>
  );
}
