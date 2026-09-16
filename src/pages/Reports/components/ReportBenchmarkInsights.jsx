import { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, ShieldCheck, Zap, Award, Sparkles, Flame } from 'lucide-react';
import { COMPETITORS_LIST } from '../../../data/reportsData';

export default function ReportBenchmarkInsights({ report, reports = [], onSelectReport, onUpdateData, isAgency }) {
  const currentReport = report || (reports.length > 0 ? reports[0] : null);

  const benchmark = currentReport?.data?.benchmark || {
    competitors: [
      { name: 'MTN Cameroon', followers: '2.1M', engagement: '3.9%', postsPerWeek: 14, topFormat: 'Vidéo Courte / Humour', threatLevel: 'Élevé', color: '#FFCC00' },
      { name: 'Camtel (Blue)', followers: '480K', engagement: '2.1%', postsPerWeek: 8, topFormat: 'Carrousel Offres Fixe/Fibre', threatLevel: 'Moyen', color: '#0099FF' }
    ],
    orange: { 
      name: 'Orange Cameroun', 
      followers: '1.42M', 
      engagement: '5.8%', 
      postsPerWeek: 18, 
      topFormat: 'Reels Pulse & Tutos Maxit', 
      advantage: 'Leader sur l’engagement & conversion',
      color: '#FF7900'
    },
    insights: [
      'Orange conserve le leadership net sur le taux d’engagement (5.8% vs 3.9% pour MTN).',
      'MTN a intensifié ses publications humoristiques sponsorisées sur TikTok, générant une forte viralité organique auprès des 18-25 ans.',
      'Camtel concentre ses efforts sur les forfaits Blue Data mais accuse un déficit de conversion directe.'
    ]
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-10">
      
      {/* En-tête de section (Style Influence) */}
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
            <Target size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
              5. Benchmark & Veille Concurrentielle — Part de Voix & Marché
            </h2>
            <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
              Comparatif direct Orange vs MTN vs Camtel • Période d'analyse : {currentReport?.period?.label || 'Août 2026'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 flex-wrap">
          <span className="tag" style={{ background: '#28A74518', color: '#28A745', fontWeight: 700, fontSize: 12 }}>
            🏆 Orange : Leader National Taux d'Engagement (5.8%)
          </span>
        </div>
      </div>

      {/* Comparison Cards Grid (Style Influence) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        
        {/* Orange Card */}
        <div 
          className="card p-20"
          style={{ 
            background: '#fff', 
            borderRadius: 8, 
            borderTop: '4px solid #FF7900',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF7900]"></span>
              <h4 className="font-black text-sm text-dark">Orange Cameroun</h4>
            </div>
            <span className="tag" style={{ background: '#FF790018', color: '#FF7900', fontSize: 10, fontWeight: 700 }}>
              Notre Marque
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Communauté Sociale :</span>
              <strong className="text-dark font-black font-mono">1 422 000</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Taux d'Engagement :</span>
              <strong className="text-green-600 font-black text-sm">5.8% 🚀</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Rythme de publication :</span>
              <strong className="text-dark font-bold">18 posts / sem.</strong>
            </div>
            <div className="py-2">
              <span className="text-muted block mb-1 text-[11px]">Format Fort :</span>
              <strong className="text-dark text-xs">Reels Pulse Gaming & Tutos Maxit</strong>
            </div>
          </div>
        </div>

        {/* MTN Card */}
        <div 
          className="card p-20"
          style={{ 
            background: '#fff', 
            borderRadius: 8, 
            borderTop: '4px solid #FFCC00',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <h4 className="font-black text-sm text-dark">MTN Cameroon</h4>
            </div>
            <span className="tag" style={{ background: '#DC354518', color: '#DC3545', fontSize: 10, fontWeight: 700 }}>
              Concurrent Principal
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Communauté Sociale :</span>
              <strong className="text-dark font-bold font-mono">2 100 000</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Taux d'Engagement :</span>
              <strong className="text-dark font-bold text-sm">3.9%</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Rythme de publication :</span>
              <strong className="text-dark font-bold">14 posts / sem.</strong>
            </div>
            <div className="py-2">
              <span className="text-muted block mb-1 text-[11px]">Format Fort :</span>
              <strong className="text-dark text-xs">Vidéos Humour / TikTok Skits</strong>
            </div>
          </div>
        </div>

        {/* Camtel Card */}
        <div 
          className="card p-20"
          style={{ 
            background: '#fff', 
            borderRadius: 8, 
            borderTop: '4px solid #0099FF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <h4 className="font-black text-sm text-dark">Camtel (Blue)</h4>
            </div>
            <span className="tag" style={{ background: '#0099FF18', color: '#0099FF', fontSize: 10, fontWeight: 700 }}>
              Opérateur Fixe / Fibre
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Communauté Sociale :</span>
              <strong className="text-dark font-bold font-mono">480 000</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Taux d'Engagement :</span>
              <strong className="text-dark font-bold text-sm">2.1%</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Rythme de publication :</span>
              <strong className="text-dark font-bold">8 posts / sem.</strong>
            </div>
            <div className="py-2">
              <span className="text-muted block mb-1 text-[11px]">Format Fort :</span>
              <strong className="text-dark text-xs">Carrousels Offres Blue Home</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Part de Voix & Recommandations Stratégiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Part de Voix Médias Sociaux */}
        <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>Part de Voix (Share of Voice - SOV) Mensuel</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-dark">Orange Cameroun</span>
                <span className="font-black" style={{ color: '#FF7900' }}>46% (Leader)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '46%', backgroundColor: '#FF7900' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-dark">MTN Cameroon</span>
                <span className="font-black text-yellow-600">41%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="h-full rounded-full bg-yellow-400" style={{ width: '41%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-dark">Camtel (Blue)</span>
                <span className="font-black text-blue-600">13%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: '13%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommandations Stratégiques McCann */}
        <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #FF7900' }}>
          <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>Insights Clés & Recommandations Stratégiques</span>
          </h3>

          <ul className="space-y-3 text-xs">
            {benchmark.insights.map((insight, idx) => (
              <li key={idx} className="p-3 rounded-lg bg-orange-50/40 border border-orange-100 flex items-start gap-2.5">
                <span className="font-bold text-[#FF7900] mt-0.5">•</span>
                <span className="text-dark leading-relaxed font-medium">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
