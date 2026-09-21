import { useState } from 'react';
import { 
  Target, Flame, Award, Video, TrendingUp, Sparkles, Filter, 
  ExternalLink, CheckCircle2, AlertCircle, BarChart3, Layers, Clock, Eye, Share2, MessageCircle
} from 'lucide-react';
import SocialPlatformIcon from '../../../components/common/SocialPlatformIcon';
import { 
  CAMPAIGNS_PERFORMANCE_DATA, 
  REAL_BEST_POSTS, 
  FORMATS_PERFORMANCE_ANALYSIS 
} from '../../../data/reportingWeeklyDataSept2026';

export default function ClientCampaignsContent() {
  const [activeSubTab, setActiveSubTab] = useState('campaigns'); // 'campaigns' | 'top_posts' | 'formats'
  const [selectedObjectiveFilter, setSelectedObjectiveFilter] = useState('all');
  const [selectedCampaignDetail, setSelectedCampaignDetail] = useState(null);

  const filteredCampaigns = CAMPAIGNS_PERFORMANCE_DATA.filter(camp => {
    if (selectedObjectiveFilter === 'all') return true;
    return camp.objective.toLowerCase().includes(selectedObjectiveFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* ─── EN-TÊTE DE SECTION (Cahier des charges Page 4) ─── */}
      <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                🎯
              </span>
              <h2 className="text-base font-black text-gray-900 m-0">Campagnes & Contenus</h2>
            </div>
            <p className="text-xs text-gray-500 m-0 mt-0.5">
              Relier les KPI aux publications concrètes : quelles prises de parole ont réellement contribué au résultat ?
            </p>
          </div>

          {/* Sous-onglets de navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveSubTab('campaigns')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeSubTab === 'campaigns'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Prises de Parole & Campagnes ({CAMPAIGNS_PERFORMANCE_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('top_posts')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeSubTab === 'top_posts'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Galerie Top Contenus ({REAL_BEST_POSTS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('formats')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeSubTab === 'formats'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analyse par Format ({FORMATS_PERFORMANCE_ANALYSIS.length})
            </button>
          </div>
        </div>

        {/* 5 Cartes de Classement Immédiat (Cahier des charges Page 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          
          <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200">
            <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Top 1 Visibilité</span>
            <div className="text-xs font-black text-gray-900 mt-0.5 truncate" title="Ready Party (235 266 touchés)">
              Ready Party / Autres Anim.
            </div>
            <div className="text-[11px] font-bold text-orange-600 mt-0.5">235 266 personnes touchées</div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Top 1 Engagement</span>
            <div className="text-xs font-black text-gray-900 mt-0.5 truncate" title="Lions4Life (8 974 interactions)">
              Lions4Life (Lions Indomptables)
            </div>
            <div className="text-[11px] font-bold text-emerald-600 mt-0.5">8 974 interactions (32,7%)</div>
          </div>

          <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Top Campagne Vidéo</span>
            <div className="text-xs font-black text-gray-900 mt-0.5 truncate" title="Autres Animations (64 725 vues)">
              Autres Animations & Tutos
            </div>
            <div className="text-[11px] font-bold text-purple-600 mt-0.5">64 725 vues vidéo (38,9%)</div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Potentiel d’Optimisation</span>
            <div className="text-xs font-black text-gray-900 mt-0.5 truncate" title="Funtone (Taux record de 16,3%)">
              Funtone (Tonalités)
            </div>
            <div className="text-[11px] font-bold text-amber-700 mt-0.5">Taux record 16,3% (Faible reach)</div>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Meilleur Rendement Paid</span>
            <div className="text-xs font-black text-gray-900 mt-0.5 truncate" title="Best Deal (Forfaits promos)">
              Best Deal (Forfaits)
            </div>
            <div className="text-[11px] font-bold text-blue-700 mt-0.5">6 372 interactions pour 85K imp.</div>
          </div>

        </div>
      </div>

      {/* ─── CONTENU DU SOUS-ONGLET 1 : PRISES DE PAROLE & CAMPAGNES ─── */}
      {activeSubTab === 'campaigns' && (
        <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                Répertoire des Prises de Parole Actives
              </h3>
              <p className="text-xs text-gray-500 m-0">
                Périmètre Orange Cameroun (S38) • Comparatif reach, impressions, interactions et recommandations
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500 font-semibold mr-1">Filtrer par objectif :</span>
              {['all', 'engagement', 'notoriété', 'considération', 'activation'].map(obj => (
                <button
                  key={obj}
                  type="button"
                  onClick={() => setSelectedObjectiveFilter(obj)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize transition-colors ${
                    selectedObjectiveFilter === obj
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {obj === 'all' ? 'Tous' : obj}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Prise de Parole</th>
                  <th className="py-2.5 px-3">Objectif</th>
                  <th className="py-2.5 px-3">Réseaux</th>
                  <th className="py-2.5 px-3">Portée (% Mix)</th>
                  <th className="py-2.5 px-3">Impressions</th>
                  <th className="py-2.5 px-3">Engagements (% Mix)</th>
                  <th className="py-2.5 px-3">Vues Vidéo</th>
                  <th className="py-2.5 px-3">Statut</th>
                  <th className="py-2.5 px-3 text-right">Action Recommandée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredCampaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900 text-xs">{camp.name}</div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 font-extrabold text-[9.5px]">
                          {camp.rankingTag}
                        </span>
                        {camp.budgetSpent && (
                          <span className="text-gray-500 font-medium">Budget : {camp.budgetSpent}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-700">{camp.objective}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        {camp.networks.map(net => (
                          <SocialPlatformIcon key={net} platform={net} size={14} />
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <strong className="text-gray-900">{camp.reach.toLocaleString()}</strong>
                      <span className="text-[10px] text-gray-500 ml-1">({camp.reachShare})</span>
                    </td>
                    <td className="py-2.5 px-3">{camp.impressions.toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      <strong className="text-orange-600 font-black">{camp.engagements.toLocaleString()}</strong>
                      <span className="text-[10px] text-gray-500 ml-1">({camp.engagementsShare})</span>
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      {camp.videoViews > 0 ? (
                        <span className="text-purple-700 font-bold">{camp.videoViews.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        camp.status === 'en_cours' ? 'bg-emerald-100 text-emerald-800' :
                        camp.status === 'a_optimiser' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {camp.status === 'en_cours' ? 'En cours' : camp.status === 'a_optimiser' ? 'À optimiser' : 'Terminée'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCampaignDetail(camp)}
                        className="text-orange-600 hover:text-orange-800 font-bold text-xs underline"
                      >
                        Voir Fiche & Reco
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal / Fiche détaillée si cliquée */}
          {selectedCampaignDetail && (
            <div className="mt-4 p-3.5 bg-orange-50/70 border border-orange-200 rounded-lg text-xs animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-orange-200">
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 text-sm">{selectedCampaignDetail.name}</span>
                  <span className="px-2 py-0.5 rounded bg-orange-500 text-white font-bold text-[10px]">
                    Fiche Décisionnelle
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCampaignDetail(null)}
                  className="text-gray-500 hover:text-gray-900 font-bold"
                >
                  ✕ Fermer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-800">
                <div>
                  <strong className="text-orange-950 font-bold">Insight Associé :</strong>
                  <p className="m-0 mt-0.5 text-gray-700 leading-relaxed">{selectedCampaignDetail.insight}</p>
                </div>
                <div>
                  <strong className="text-orange-950 font-bold">Recommandation Stratégique :</strong>
                  <p className="m-0 mt-0.5 text-gray-700 leading-relaxed">{selectedCampaignDetail.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── CONTENU DU SOUS-ONGLET 2 : GALERIE TOP CONTENUS & BEST POSTS ─── */}
      {activeSubTab === 'top_posts' && (
        <div className="space-y-4">
          <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                  Galerie des Top Contenus & Best Posts (S38)
                </h3>
                <p className="text-xs text-gray-500 m-0">
                  Publications les plus engageantes avec verbatims réels, visuels, call-to-action et métriques
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                ★ Best Post National : Instant Fun (3 579 interactions)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REAL_BEST_POSTS.slice(0, 6).map(post => (
                <div 
                  key={post.id}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:border-orange-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header carte post */}
                    <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SocialPlatformIcon platform={post.platform} size={15} />
                        <div>
                          <div className="text-xs font-bold text-gray-900">{post.actor}</div>
                          <div className="text-[10px] text-gray-500">{post.date} • {post.format}</div>
                        </div>
                      </div>
                      <span className="text-[10.5px] font-black px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                        {post.badge}
                      </span>
                    </div>

                    {/* Contenu textuel / message officiel */}
                    <div className="p-3 text-xs">
                      <h4 className="font-bold text-gray-900 text-xs mb-1.5 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 leading-relaxed m-0 italic line-clamp-4">
                        « {post.message} »
                      </p>
                    </div>
                  </div>

                  {/* Footer métriques & CTA */}
                  <div className="p-3 bg-gray-50/70 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2 text-center mb-2">
                      <div className="bg-white p-1.5 rounded border border-gray-200">
                        <span className="text-[9.5px] font-bold text-gray-500 uppercase block">Engagements</span>
                        <span className="text-sm font-black text-orange-600">{post.engagements.toLocaleString()}</span>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-gray-200">
                        <span className="text-[9.5px] font-bold text-gray-500 uppercase block">Portée</span>
                        <span className="text-sm font-black text-gray-800">{post.reach.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-600 flex items-center justify-between">
                      <span>Levier : <strong>{post.driver}</strong></span>
                      {post.cta && <span className="font-bold text-orange-600">CTA : {post.cta}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── CONTENU DU SOUS-ONGLET 3 : ANALYSE DES FORMATS ─── */}
      {activeSubTab === 'formats' && (
        <div className="card p-4 rounded-xl border border-gray-200 bg-white shadow-sm" style={{ borderRadius: 12 }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-black text-gray-900 m-0 uppercase tracking-wide">
                Analyse de Performance par Format Électoral
              </h3>
              <p className="text-xs text-gray-500 m-0">
                Les vidéos performent-elles mieux ? Les quiz sont-ils plus engageants ? Réponse chiffrée
              </p>
            </div>
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              Agrégation par Typologie
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Volume Posts</th>
                    <th className="py-2.5 px-3">Moy. Interactions</th>
                    <th className="py-2.5 px-3">Moy. Portée</th>
                    <th className="py-2.5 px-3 text-right">Score d’Efficacité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {FORMATS_PERFORMANCE_ANALYSIS.map(fmt => (
                    <tr key={fmt.format} className="hover:bg-gray-50/80">
                      <td className="py-2.5 px-3 font-bold text-gray-900">{fmt.format}</td>
                      <td className="py-2.5 px-3">{fmt.postsCount} posts</td>
                      <td className="py-2.5 px-3 font-bold text-orange-600">{fmt.avgEngagements.toLocaleString()}</td>
                      <td className="py-2.5 px-3">{fmt.avgReach.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[11px] font-black bg-orange-100 text-orange-800">
                          {fmt.efficiencyIndex} / 10
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2.5 p-3 rounded-xl bg-orange-50/60 border border-orange-200">
              <div className="text-xs font-black text-orange-950 uppercase tracking-wide">
                Enseignements Stratégiques McCann sur les Formats :
              </div>
              <ul className="text-xs text-gray-800 space-y-2 m-0 pl-4 list-disc leading-relaxed">
                <li>
                  <strong>Les Quiz & Jeux participatifs</strong> constituent le format champion absolu avec 2 150 interactions en moyenne par post, surperformant de +140% les images promotionnelles standards.
                </li>
                <li>
                  <strong>Les Vidéos & Reels courts (15-60s)</strong> sont indispensables pour maximiser la portée (68 000 individus touchés en moyenne), notamment sur Facebook et Instagram.
                </li>
                <li>
                  <strong>Les Carrousels</strong> sont à réserver aux parcours d’explication (ex: transferts internationaux Orange Money, forfaits Cloud B2B) où l’utilisateur recherche un contenu à forte valeur documentaire.
                </li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
