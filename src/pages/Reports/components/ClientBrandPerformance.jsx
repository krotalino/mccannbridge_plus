import { useState } from 'react';
import { 
  TrendingUp, BarChart2, Users, Layers, Award, Sparkles, 
  ArrowUpRight, ArrowDownRight, Eye, Calendar, Info, CheckCircle2, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import SocialPlatformIcon from '../../../components/common/SocialPlatformIcon';
import { 
  TIMELINE_PERFORMANCE_DATA, 
  PLATFORM_BENCHMARK_MATRIX, 
  COMMUNITY_LEADERSHIP_DATA 
} from '../../../data/reportingWeeklyDataSept2026';

export default function ClientBrandPerformance({
  selectedBrand = 'all',
  onBrandChange,
  compareMode = true
}) {
  const [activeMetric, setActiveMetric] = useState('engagements'); // 'engagements' | 'reach' | 'impressions' | 'views' | 'posts' | 'rate'
  const [activeAudienceView, setActiveAudienceView] = useState('table'); // 'table' | 'history'

  const entityTabs = [
    { id: 'all', label: 'Vue Consolidée (Toutes Entités)', color: '#FF7900' },
    { id: 'orange_telco', label: 'Orange TELCO', color: '#FF7900' },
    { id: 'orange_money', label: 'Orange Money (OM)', color: '#00A859' },
    { id: 'orange_business', label: 'Orange Business (B2B)', color: '#004F9F' }
  ];

  const metricTabs = [
    { id: 'engagements', label: 'Engagements' },
    { id: 'reach', label: 'Portée (Reach)' },
    { id: 'impressions', label: 'Impressions' },
    { id: 'views', label: 'Vues Vidéo' },
    { id: 'posts', label: 'Publications' },
    { id: 'rate', label: 'Taux d’engagement (%)' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* ─── EN-TÊTE ET ONGLETS PAR ENTITÉ (Cahier des charges Page 2) ─── */}
      <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                📈
              </span>
              <h2 className="text-base font-black text-gray-900 m-0">Performance de la Marque</h2>
            </div>
            <p className="text-xs text-gray-500 m-0 mt-0.5">
              Cœur analytique : du résultat consolidé au détail opérationnel par entité et canal de diffusion
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg">
            {entityTabs.map(tab => {
              const isSelected = selectedBrand === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onBrandChange(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={isSelected ? { borderLeft: `3px solid ${tab.color}` } : {}}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Détails rapides de l'entité active */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-2.5 rounded-lg bg-orange-50/60 border border-orange-200">
            <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Périmètre sélectionné</span>
            <div className="text-sm font-black text-gray-900 mt-0.5">
              {selectedBrand === 'all' && 'Consolidé Groupe (Telco + Money + Business)'}
              {selectedBrand === 'orange_telco' && 'Orange Cameroun — Grand Public & Mobile'}
              {selectedBrand === 'orange_money' && 'Orange Money (OM) — Services Financiers'}
              {selectedBrand === 'orange_business' && 'Orange Business — Solutions B2B & Cloud'}
            </div>
            <p className="text-[11px] text-gray-600 m-0 mt-1">
              {selectedBrand === 'all' && 'Multi-marques, 6 réseaux sociaux connectés, couverture nationale.'}
              {selectedBrand === 'orange_telco' && 'Leadership historique sur Facebook (582K) et Instagram (112K).'}
              {selectedBrand === 'orange_money' && 'Forte traction sur Facebook (+56,3% eng.) et 154K abonnés.'}
              {selectedBrand === 'orange_business' && 'Focalisation LinkedIn B2B et X pour les décideurs.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Comparaison S38 vs S37</span>
            <div className="text-sm font-black text-gray-900 mt-0.5">
              14-20 Septembre 2026 vs 07-13 Septembre
            </div>
            <p className="text-[11px] text-gray-600 m-0 mt-1">
              Lecture native semaine par semaine intégrée directement dans Bridge.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Statut des objectifs</span>
            <div className="text-sm font-black text-emerald-700 mt-0.5">
              Objectifs hebdomadaires dépassés (+59,1% interactions)
            </div>
            <p className="text-[11px] text-gray-600 m-0 mt-1">
              Levier principal : Contenus participatifs Lions4Life et activations terrain.
            </p>
          </div>
        </div>
      </div>

      {/* ─── ÉVOLUTION DES PERFORMANCES (Cahier des charges Page 2-3) ─── */}
      <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
              Évolution des Performances (S35 à S38)
            </h3>
            <p className="text-xs text-gray-500 m-0">
              Visualisation chronologique combinée pour observer la dynamique et le bond de la semaine
            </p>
          </div>

          {/* Sélecteur de métrique pour le graphique */}
          <div className="flex items-center gap-1 flex-wrap">
            {metricTabs.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMetric(m.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  activeMetric === m.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Graphique Recharts interactif */}
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TIMELINE_PERFORMANCE_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7900" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FF7900" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey={activeMetric} 
                stroke="#FF7900" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#metricGrad)" 
                name={metricTabs.find(m => m.id === activeMetric)?.label || activeMetric}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 mt-2">
          <span>Observation clé : <strong>Accélération marquée en Semaine 38 (+59,1% interactions)</strong> avec 41 813 engagements cumulés.</span>
          <span className="text-[11px] italic">Comparaison intégrée nativement dans la plateforme Bridge</span>
        </div>
      </div>

      {/* ─── PERFORMANCE PAR PLATEFORME (Cahier des charges Page 3) ─── */}
      <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
              Performance par Plateforme — Tableau Comparatif des Canaux
            </h3>
            <p className="text-xs text-gray-500 m-0">
              Identifier les canaux à renforcer ou à optimiser selon la lecture client attendue
            </p>
          </div>
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
            6 Canaux Analysés
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-[10.5px]">
                <th className="py-2.5 px-3">Plateforme</th>
                <th className="py-2.5 px-3">Portée / Reach</th>
                <th className="py-2.5 px-3">Impressions</th>
                <th className="py-2.5 px-3">Engagements</th>
                <th className="py-2.5 px-3">Vues Vidéo</th>
                <th className="py-2.5 px-3">Publications</th>
                <th className="py-2.5 px-3">Lecture Client Attendue</th>
                <th className="py-2.5 px-3 text-right">Statut Canal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {PLATFORM_BENCHMARK_MATRIX.map(row => (
                <tr key={row.platform} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-gray-900">
                    <SocialPlatformIcon platform={row.platform} size={16} showLabel={true} labelClass="font-bold text-xs" />
                  </td>
                  <td className="py-2.5 px-3 font-medium">{row.reach}</td>
                  <td className="py-2.5 px-3 font-medium">{row.impressions}</td>
                  <td className="py-2.5 px-3 font-bold text-gray-900">{row.engagements}</td>
                  <td className="py-2.5 px-3 font-semibold text-orange-600">{row.videoViews}</td>
                  <td className="py-2.5 px-3">{row.posts}</td>
                  <td className="py-2.5 px-3 text-gray-600 text-[11px] max-w-xs">{row.clientExpectation}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span 
                      className="inline-block px-2 py-0.5 rounded text-[10.5px] font-extrabold"
                      style={{ backgroundColor: `${row.statusColor}18`, color: row.statusColor, border: `1px solid ${row.statusColor}35` }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── AUDIENCE & COMMUNAUTÉS (Cahier des charges Page 3 + Slide 2) ─── */}
      <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-orange-500" />
              <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                Audience & Communautés — Positions de Leadership
              </h3>
            </div>
            <p className="text-xs text-gray-500 m-0 mt-0.5">
              Base de followers, évolution hebdomadaire exacte (S38 vs S37) et repères de leadership
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
              ★ Leader Instagram : Orange (112 849)
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
              ★ Leader YouTube : Orange (14 000)
            </span>
          </div>
        </div>

        {/* Insight clé followers directement extrait de la slide 2 */}
        <div className="p-3 mb-4 rounded-lg bg-orange-50/80 border border-orange-200 flex items-start gap-2.5 text-xs text-gray-800">
          <span className="text-base">💡</span>
          <div>
            <strong className="text-orange-900">Insight Clé Followers (Rapport Officiel S38) :</strong>
            <p className="m-0 mt-0.5 text-gray-700 leading-relaxed">
              « La baisse de 279 followers enregistrée sur Facebook reste limitée au regard de la taille de la communauté, 
              représentant environ 0,05 % de celle-ci. Cette évolution correspond aux fluctuations habituelles de la base d’abonnés 
              et ne traduit pas, à ce stade, une baisse de désirabilité, d’autant plus que les indicateurs de visibilité (+9,5%) 
              et d’engagement (+62,8%) sont en forte progression sur la période. »
            </p>
          </div>
        </div>

        {/* Tableau structuré par réseau comme dans le rapport (Slide 2) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-[10.5px]">
                <th className="py-2.5 px-3">Réseau Social</th>
                <th className="py-2.5 px-3">Orange TELCO</th>
                <th className="py-2.5 px-3">Orange Money</th>
                <th className="py-2.5 px-3">Orange Business</th>
                <th className="py-2.5 px-3">MTN Cameroun</th>
                <th className="py-2.5 px-3">Blue Camtel</th>
                <th className="py-2.5 px-3">Position Leader</th>
                <th className="py-2.5 px-3 text-right">Rang Orange</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {COMMUNITY_LEADERSHIP_DATA.table.map(row => (
                <tr key={row.network} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-gray-900">
                    <SocialPlatformIcon platform={row.network} size={15} showLabel={true} labelClass="font-bold text-xs" />
                  </td>
                  <td className="py-2.5 px-3 font-black text-gray-900">{row.orangeTelco}</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-700">{row.orangeMoney}</td>
                  <td className="py-2.5 px-3 font-semibold text-blue-700">{row.orangeBiz}</td>
                  <td className="py-2.5 px-3 text-gray-600">{row.mtn}</td>
                  <td className="py-2.5 px-3 text-gray-600">{row.camtel}</td>
                  <td className="py-2.5 px-3 font-bold text-gray-800">{row.leader}</td>
                  <td className="py-2.5 px-3 text-right font-black">
                    <span className={`px-2 py-0.5 rounded text-[10.5px] ${
                      row.orangeRank.includes('LEADER') 
                        ? 'bg-emerald-100 text-emerald-800 font-extrabold' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.orangeRank}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 pt-2 text-[11px] text-gray-500 flex justify-between items-center">
          <span>Historique de croissance : <strong>+18,4% sur 12 mois</strong> • <strong>+5,2% sur le dernier trimestre</strong></span>
          <span className="italic">Données consolidées via les API officielles des plateformes</span>
        </div>
      </div>

    </div>
  );
}
