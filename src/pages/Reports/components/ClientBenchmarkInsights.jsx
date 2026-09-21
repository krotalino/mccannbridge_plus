import { useState } from 'react';
import { 
  BarChart2, Award, Zap, ShieldCheck, ChevronRight, HelpCircle, 
  Sparkles, Layers, CheckCircle2, TrendingUp, AlertTriangle, Lightbulb 
} from 'lucide-react';
import SocialPlatformIcon from '../../../components/common/SocialPlatformIcon';
import { 
  BENCHMARK_SPACES, 
  REAL_BEST_POSTS, 
  STANDARDIZED_ACTIONABLE_INSIGHTS 
} from '../../../data/reportingWeeklyDataSept2026';

export default function ClientBenchmarkInsights() {
  const [activeBenchmarkSpace, setActiveBenchmarkSpace] = useState('telco'); // 'telco' | 'mobile_money' | 'b2b'
  const [activeTab, setActiveTab] = useState('benchmarks'); // 'benchmarks' | 'insights' | 'competitor_posts'

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* ─── EN-TÊTE DE SECTION (Cahier des charges Page 5) ─── */}
      <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                ⚖️
              </span>
              <h2 className="text-base font-black text-gray-900 m-0">Benchmark Concurrentiel & Insights</h2>
            </div>
            <p className="text-xs text-gray-500 m-0 mt-0.5">
              Trois espaces indépendants et étanches • Méthode d’insights formalisée en 6 points
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('benchmarks')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'benchmarks'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3 Espaces Concurrentiels
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'insights'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Insights Normalisés (6 points)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('competitor_posts')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'competitor_posts'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Best Posts Concurrence
            </button>
          </div>
        </div>

        {/* Sélecteur des 3 espaces étanches */}
        {activeTab === 'benchmarks' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveBenchmarkSpace('telco')}
              className={`p-3 rounded-lg border text-left transition-all ${
                activeBenchmarkSpace === 'telco'
                  ? 'bg-orange-50 border-orange-500 shadow-xs'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-1">
                <span>1. Telco Grand Public</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-orange-200 text-orange-900">
                  90,3% Part d’Eng.
                </span>
              </div>
              <p className="text-[11px] text-gray-600 m-0">
                Orange Cameroun vs. MTN Cameroun vs. CAMTEL
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveBenchmarkSpace('mobile_money')}
              className={`p-3 rounded-lg border text-left transition-all ${
                activeBenchmarkSpace === 'mobile_money'
                  ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-1">
                <span>2. Mobile Money</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                  94,7% Part d’Eng.
                </span>
              </div>
              <p className="text-[11px] text-gray-600 m-0">
                Orange Money vs. MoMo (MTN)
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveBenchmarkSpace('b2b')}
              className={`p-3 rounded-lg border text-left transition-all ${
                activeBenchmarkSpace === 'b2b'
                  ? 'bg-blue-50 border-blue-500 shadow-xs'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-1">
                <span>3. B2B & Entreprises</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-blue-200 text-blue-900">
                  LinkedIn & X
                </span>
              </div>
              <p className="text-[11px] text-gray-600 m-0">
                Orange Business vs. MTN Business
              </p>
            </button>
          </div>
        )}
      </div>

      {/* ─── CONTENU DU SOUS-ONGLET 1 : LES 3 ESPACES COMPARATIFS ─── */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-4">
          
          {/* ESPACE 1 : TELCO GRAND PUBLIC */}
          {activeBenchmarkSpace === 'telco' && (
            <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                    {BENCHMARK_SPACES.telco.title}
                  </h3>
                  <p className="text-xs text-gray-500 m-0">{BENCHMARK_SPACES.telco.period}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-orange-100 text-orange-900 text-xs font-black">
                  Orange Leader Absolu Facebook
                </span>
              </div>

              {/* Résumé textuel */}
              <div className="p-3 mb-4 rounded-lg bg-orange-50/80 border border-orange-200 text-xs text-gray-800 leading-relaxed">
                <strong>Analyse de la période :</strong> {BENCHMARK_SPACES.telco.summaryText}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Opérateur</th>
                      <th className="py-2.5 px-3">Engagements Totaux</th>
                      <th className="py-2.5 px-3">Part d’Engagement</th>
                      <th className="py-2.5 px-3">Vues Vidéo</th>
                      <th className="py-2.5 px-3">Publications</th>
                      <th className="py-2.5 px-3">Eng. Moyen / Post</th>
                      <th className="py-2.5 px-3 text-right">Vues Moy. / Post</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {BENCHMARK_SPACES.telco.metrics.map(op => (
                      <tr key={op.actor} className="hover:bg-gray-50/80">
                        <td className="py-2.5 px-3 font-bold text-gray-900 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: op.color }}></span>
                          <span>{op.actor}</span>
                        </td>
                        <td className="py-2.5 px-3 font-black text-gray-900">{op.engagements.toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded font-black text-xs" style={{ backgroundColor: `${op.color}20`, color: op.color }}>
                            {op.share}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-gray-800">{op.videoViews.toLocaleString()}</td>
                        <td className="py-2.5 px-3">{op.posts}</td>
                        <td className="py-2.5 px-3 font-bold text-orange-600">{op.engPerPost}</td>
                        <td className="py-2.5 px-3 text-right font-medium">{op.viewsPerPost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ESPACE 2 : MOBILE MONEY */}
          {activeBenchmarkSpace === 'mobile_money' && (
            <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                    {BENCHMARK_SPACES.mobile_money.title}
                  </h3>
                  <p className="text-xs text-gray-500 m-0">{BENCHMARK_SPACES.mobile_money.period}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 text-xs font-black">
                  Orange Money Domine (+1 686% Eng.)
                </span>
              </div>

              <div className="p-3 mb-4 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-gray-800 leading-relaxed">
                <strong>Analyse de la période :</strong> {BENCHMARK_SPACES.mobile_money.summaryText}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Acteur Mobile Money</th>
                      <th className="py-2.5 px-3">Engagements Totaux</th>
                      <th className="py-2.5 px-3">Part d’Engagement</th>
                      <th className="py-2.5 px-3">Vues Vidéo</th>
                      <th className="py-2.5 px-3">Publications</th>
                      <th className="py-2.5 px-3 text-right">Eng. Moyen / Post</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {BENCHMARK_SPACES.mobile_money.metrics.map(mm => (
                      <tr key={mm.actor} className="hover:bg-gray-50/80">
                        <td className="py-2.5 px-3 font-bold text-gray-900 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mm.color }}></span>
                          <span>{mm.actor}</span>
                        </td>
                        <td className="py-2.5 px-3 font-black text-gray-900">{mm.engagements.toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded font-black text-xs" style={{ backgroundColor: `${mm.color}20`, color: mm.color }}>
                            {mm.share}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-gray-800">{mm.videoViews.toLocaleString()}</td>
                        <td className="py-2.5 px-3">{mm.posts}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{mm.engPerPost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ESPACE 3 : B2B / ENTREPRISES */}
          {activeBenchmarkSpace === 'b2b' && (
            <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                    {BENCHMARK_SPACES.b2b.title}
                  </h3>
                  <p className="text-xs text-gray-500 m-0">{BENCHMARK_SPACES.b2b.period}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-900 text-xs font-black">
                  Focalisation LinkedIn
                </span>
              </div>

              <div className="p-3 mb-4 rounded-lg bg-blue-50/80 border border-blue-200 text-xs text-gray-800 leading-relaxed">
                <strong>Analyse de la période :</strong> {BENCHMARK_SPACES.b2b.summaryText}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* LinkedIn Card */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-200">
                    <SocialPlatformIcon platform="linkedin" size={16} />
                    <span className="font-bold text-xs text-gray-900">Comparatif LinkedIn B2B</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                      <span className="font-semibold text-gray-700">Publications diffusées :</span>
                      <span>OB : <strong>8 posts</strong> vs MTN B : <strong>24 posts</strong></span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                      <span className="font-semibold text-gray-700">Impressions cumulées :</span>
                      <span>OB : <strong>9 010</strong> vs MTN B : <strong>17 008</strong></span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                      <span className="font-semibold text-gray-700">Engagements totaux :</span>
                      <span>OB : <strong>138</strong> vs MTN B : <strong>278</strong></span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                      <span className="font-semibold text-gray-700">Vues vidéo :</span>
                      <span>OB : <strong className="text-emerald-700">6 129</strong> vs MTN B : <strong>5 107</strong></span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                      <span className="font-semibold text-gray-700">Engagement moyen / post :</span>
                      <span>OB : <strong className="text-orange-600">17,3</strong> vs MTN B : <strong>11,6</strong></span>
                    </div>
                  </div>
                </div>

                {/* X / Twitter Card */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-200">
                    <SocialPlatformIcon platform="x" size={16} />
                    <span className="font-bold text-xs text-gray-900">Comparatif X (Twitter) B2B</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                      <span className="font-semibold text-gray-700">Volume de tweets :</span>
                      <span>OB : <strong>5 tweets</strong> vs MTN B : <strong>20 tweets</strong></span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                      <span className="font-semibold text-gray-700">Impressions cumulées :</span>
                      <span>OB : <strong>97</strong> vs MTN B : <strong>606</strong></span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                      <span className="font-semibold text-gray-700">Engagements :</span>
                      <span>OB : <strong className="text-rose-600">0</strong> vs MTN B : <strong>23</strong></span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                      <strong>Recommandation :</strong> Réorienter les efforts B2B prioritairement sur LinkedIn où le ROI qualitatif est avéré.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ─── CONTENU DU SOUS-ONGLET 2 : INSIGHTS NORMALISÉS EN 6 POINTS ─── */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                  Insights Actionnables Normalisés (Cahier des charges Page 6)
                </h3>
                <p className="text-xs text-gray-500 m-0">
                  Chaque constat respecte rigoureusement la grille en 6 points : Catégorie, Constat, Explication, Preuve, Impact et Recommandation
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Méthode McCann Certifiée
              </span>
            </div>

            <div className="space-y-4">
              {STANDARDIZED_ACTIONABLE_INSIGHTS.map((ins, index) => (
                <div 
                  key={ins.id}
                  className="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs hover:border-orange-300 transition-all"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-[11px]">
                        {index + 1}
                      </span>
                      <span className="text-xs font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {ins.category}
                      </span>
                      <h4 className="text-sm font-black text-gray-900 m-0">
                        {ins.title}
                      </h4>
                    </div>

                    <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      Niveau de confiance : <strong>{ins.confidence}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-gray-50 rounded-lg">
                      <strong className="text-gray-900 block mb-0.5 font-bold">1. Constat Chiffré :</strong>
                      <p className="m-0 text-gray-700 leading-relaxed">{ins.constat}</p>
                    </div>

                    <div className="p-2.5 bg-gray-50 rounded-lg">
                      <strong className="text-gray-900 block mb-0.5 font-bold">2. Explication Causale :</strong>
                      <p className="m-0 text-gray-700 leading-relaxed">{ins.explication}</p>
                    </div>

                    <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-lg">
                      <strong className="text-blue-900 block mb-0.5 font-bold">3. Preuve issue des Données :</strong>
                      <p className="m-0 text-blue-950 leading-relaxed">{ins.preuve}</p>
                    </div>

                    <div className="p-2.5 bg-amber-50/60 border border-amber-100 rounded-lg">
                      <strong className="text-amber-900 block mb-0.5 font-bold">4. Impact Business / Image :</strong>
                      <p className="m-0 text-amber-950 leading-relaxed">{ins.impact}</p>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs">
                    <strong className="text-emerald-900 block mb-0.5 font-bold">5 & 6. Recommandation Opérationnelle & Prochaine Étape :</strong>
                    <p className="m-0 text-emerald-950 font-medium leading-relaxed">{ins.recommandation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── CONTENU DU SOUS-ONGLET 3 : BEST POSTS CONCURRENCE ─── */}
      {activeTab === 'competitor_posts' && (
        <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                Best Posts Concurrents Analysés
              </h3>
              <p className="text-xs text-gray-500 m-0">
                Veille active sur les mécaniques de MTN, Camtel et MoMo pour anticiper leurs activations
              </p>
            </div>
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              Contre-Attaque & Veille
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REAL_BEST_POSTS.filter(p => !p.actor.includes('Orange')).map(post => (
              <div 
                key={post.id}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SocialPlatformIcon platform={post.platform} size={15} />
                      <div>
                        <div className="text-xs font-bold text-gray-900">{post.actor}</div>
                        <div className="text-[10px] text-gray-500">{post.date}</div>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-black px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                      {post.badge}
                    </span>
                  </div>

                  <div className="p-3 text-xs">
                    <h4 className="font-bold text-gray-900 text-xs mb-1.5">{post.title}</h4>
                    <p className="text-[11px] text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 leading-relaxed m-0 italic">
                      « {post.message} »
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/70 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-500 font-semibold">Engagements :</span>
                    <strong className="text-gray-900 font-black">{post.engagements}</strong>
                  </div>
                  <div className="text-[10px] text-gray-600">
                    Mécanique : <strong>{post.driver}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
