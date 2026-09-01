import { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, ShieldCheck, Zap, Award, Sparkles, Flame } from 'lucide-react';
import { COMPETITORS_LIST } from '../../../data/reportsData';

export default function ReportBenchmarkInsights({ report, onUpdateData, isAgency }) {
  const benchmark = report.data?.benchmark || {
    competitors: [
      { name: 'MTN Cameroon', followers: '2.1M', engagement: '3.9%', postsPerWeek: 14, topFormat: 'Vidéo Courte / Humour', threatLevel: 'Élevé' },
      { name: 'Camtel (Blue)', followers: '480K', engagement: '2.1%', postsPerWeek: 8, topFormat: 'Carrousel Offres Fixe/Fibre', threatLevel: 'Moyen' }
    ],
    orange: { name: 'Orange Cameroun', followers: '1.42M', engagement: '5.8%', postsPerWeek: 18, topFormat: 'Reels Pulse & Tutos Maxit', advantage: 'Leader sur l’engagement & conversion' },
    insights: [
      'Orange conserve le leadership net sur le taux d’engagement (5.8% vs 3.9% pour MTN).',
      'MTN a intensifié ses publications humoristiques sponsorisées sur TikTok, générant une forte viralité organique auprès des 18-25 ans.',
      'Camtel concentre ses efforts sur les forfaits Blue Data mais accuse un déficit de conversion directe.'
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Benchmark Matrix */}
      <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/30">
              <Target size={20} />
            </span>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                Matrice Concurrentielle Cosmique (Orange vs MTN vs Camtel)
              </h3>
              <p className="text-xs text-slate-400">
                Période d'analyse : {report.period?.label || 'Août 2026'}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
            Orange : Leader National Taux d'Engagement
          </span>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          {/* Orange Card */}
          <div className="p-5 rounded-2xl border-2 border-[#FF6600] bg-gradient-to-b from-[#FF6600]/20 to-[#0A0E27]/90 relative overflow-hidden shadow-[0_0_25px_rgba(255,102,0,0.25)]">
            <span className="absolute -top-1 right-3 text-[9px] font-black uppercase bg-[#FF6600] text-white px-2 py-0.5 rounded-b-md shadow-xs">
              Notre Marque
            </span>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-[#FF6600] animate-pulse"></span>
              <h4 className="font-black text-sm text-white">Orange Cameroun</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Communauté :</span>
                <strong className="text-white font-black font-mono">1 422 000</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Taux d'Engagement :</span>
                <strong className="text-[#00D4FF] font-black text-sm">5.8% 🚀</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Rythme Hebdo :</span>
                <strong className="text-white font-bold">18 posts / sem.</strong>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-0.5 text-[11px]">Format Fort :</span>
                <strong className="text-slate-200 text-xs">Reels Pulse Gaming & Tutos Maxit</strong>
              </div>
            </div>
          </div>

          {/* MTN Card */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <h4 className="font-bold text-sm text-white">MTN Cameroon</h4>
              </div>
              <span className="text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">
                Concurrent #1
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Communauté :</span>
                <strong className="text-white font-bold font-mono">2 100 000</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Taux d'Engagement :</span>
                <strong className="text-slate-200 font-bold">3.9%</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Rythme Hebdo :</span>
                <strong className="text-slate-200">14 posts / sem.</strong>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-0.5 text-[11px]">Format Fort :</span>
                <strong className="text-slate-300 text-xs">Vidéo Humour / TikTok Skits</strong>
              </div>
            </div>
          </div>

          {/* Camtel Card */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <h4 className="font-bold text-sm text-white">Camtel (Blue)</h4>
              </div>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                Opérateur Fixe
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Communauté :</span>
                <strong className="text-white font-bold font-mono">480 000</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Taux d'Engagement :</span>
                <strong className="text-slate-200 font-bold">2.1%</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Rythme Hebdo :</span>
                <strong className="text-slate-200">8 posts / sem.</strong>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-0.5 text-[11px]">Format Fort :</span>
                <strong className="text-slate-300 text-xs">Carrousel Offres Fixe/Fibre</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Strategic Analysis Bullets */}
        <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-[#00D4FF] uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Enseignements Concurrentiels & Recommandations McCann</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            {benchmark.insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] mt-1.5 shrink-0" />
                <p className="leading-relaxed">{ins}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
