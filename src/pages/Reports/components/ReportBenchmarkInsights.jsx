import { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, ShieldCheck, Zap, Award, Sparkles } from 'lucide-react';
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
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Target size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Matrice Concurrentielle (Orange vs MTN vs Camtel)
              </h3>
              <p className="text-xs text-gray-500">
                Période d'analyse : {report.period?.label || 'Août 2026'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Orange : Leader Taux d'Engagement
          </span>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          {/* Orange Card */}
          <div className="p-4 rounded-xl border-2 border-orange-500 bg-orange-50/30 relative">
            <span className="absolute -top-3 right-3 text-[10px] font-extrabold uppercase bg-orange-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
              Notre Marque
            </span>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3.5 h-3.5 rounded-full bg-orange-500"></span>
              <h4 className="font-bold text-sm text-gray-900">Orange Cameroun</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-orange-100">
                <span className="text-gray-600">Communauté Totale :</span>
                <strong className="text-gray-900">1 422 000</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-orange-100">
                <span className="text-gray-600">Taux d'Engagement :</span>
                <strong className="text-orange-600 font-bold text-sm">5.8% 🚀</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-orange-100">
                <span className="text-gray-600">Rythme Hebdo :</span>
                <strong className="text-gray-900">18 posts / sem.</strong>
              </div>
              <div className="py-1">
                <span className="text-gray-600 block mb-0.5">Format Fort :</span>
                <strong className="text-gray-800 text-[11px]">Reels Pulse Gaming & Tutos Maxit</strong>
              </div>
            </div>
          </div>

          {/* MTN Card */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400"></span>
                <h4 className="font-bold text-sm text-gray-900">MTN Cameroon</h4>
              </div>
              <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                Concurrent Direct
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Communauté Totale :</span>
                <strong className="text-gray-900">2 100 000</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Taux d'Engagement :</span>
                <strong className="text-gray-900">3.9%</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Rythme Hebdo :</span>
                <strong className="text-gray-900">14 posts / sem.</strong>
              </div>
              <div className="py-1">
                <span className="text-gray-600 block mb-0.5">Format Fort :</span>
                <strong className="text-gray-800 text-[11px]">Sketches Humour TikTok / MoMo</strong>
              </div>
            </div>
          </div>

          {/* Camtel Card */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600"></span>
                <h4 className="font-bold text-sm text-gray-900">Camtel (Blue)</h4>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Challenger Fixe/Data
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Communauté Totale :</span>
                <strong className="text-gray-900">480 000</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Taux d'Engagement :</span>
                <strong className="text-gray-900">2.1%</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Rythme Hebdo :</span>
                <strong className="text-gray-900">8 posts / sem.</strong>
              </div>
              <div className="py-1">
                <span className="text-gray-600 block mb-0.5">Format Fort :</span>
                <strong className="text-gray-800 text-[11px]">Visuels Produits Blue Home & Fibre</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Strategic Market Insights */}
        <div className="p-4 bg-orange-50/60 border border-orange-200/80 rounded-xl space-y-2">
          <div className="text-xs font-bold text-orange-950 flex items-center gap-1.5 mb-1">
            <Sparkles size={15} className="text-orange-600" />
            <span>Enseignements Concurrentiels & Réponses Recommandées</span>
          </div>

          <div className="space-y-2">
            {benchmark.insights.map((ins, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-800 font-medium">
                <span className="text-orange-600 font-bold shrink-0">#{idx + 1}</span>
                <p>{ins}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
