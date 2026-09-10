import { useState } from 'react';
import {
  formatTimeAgo,
  formatFullDateFr,
  getPlatformBadge,
  getTypeLabel,
  RELIABILITY_LEVELS,
} from './veilleUtils.js';

export default function TendancesReglementationView({
  watchItems = [],
  onOpenTransformModal,
}) {
  const [activeTab, setActiveTab] = useState('formats'); // 'formats' | 'regulation' | 'macro'

  const formatTrends = watchItems.filter(i => i.type === 'trend' || i.type === 'platform');
  const legalItems = watchItems.filter(i => i.type === 'regulation');
  const macroItems = watchItems.filter(i => i.type === 'sector' || i.type === 'media');

  return (
    <div className="tendances-reglementation-view">
      {/* Sélecteur de sous-rubrique */}
      <div className="tab-bar flex gap-4 p-4 mb-16" style={{ background: '#F5F5F5', borderRadius: 8 }}>
        <button
          onClick={() => setActiveTab('formats')}
          className={`tab-item ${activeTab === 'formats' ? 'active' : ''}`}
          style={{ fontWeight: 700, fontSize: 13 }}
        >
          📱 Plateformes, Formats Viraux & Algorithmes ({formatTrends.length})
        </button>
        <button
          onClick={() => setActiveTab('regulation')}
          className={`tab-item ${activeTab === 'regulation' ? 'active' : ''}`}
          style={{ fontWeight: 700, fontSize: 13 }}
        >
          ⚖️ Réglementation, CNC & Transparence Légale ({legalItems.length})
        </button>
        <button
          onClick={() => setActiveTab('macro')}
          className={`tab-item ${activeTab === 'macro' ? 'active' : ''}`}
          style={{ fontWeight: 700, fontSize: 13 }}
        >
          🌐 Études Marché Télécoms & Usages Cameroun
        </button>
      </div>

      {/* ─── RUBRIQUE 1 : FORMATS VIRAUX & ALGORITHMES ─── */}
      {activeTab === 'formats' && (
        <div>
          {/* Radar des formats du moment au Cameroun */}
          <div className="card mb-16 p-16" style={{ background: '#FFF' }}>
            <h3 className="text-sm font-bold text-dark mb-12 uppercase tracking-wider">
              Baromètre des Formats Émergents & Dynamique Algorithmique (Q1 2026)
            </h3>
            <div className="grid grid-3 gap-12">
              <div className="p-12 rounded border" style={{ background: '#F8FFF9', borderColor: '#C8E6C9' }}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-green-900">1. Storytime & Saynètes Camfranglais</span>
                  <span className="tag tag-green">+185% reach</span>
                </div>
                <p className="text-xs text-muted mb-6 leading-relaxed">
                  Sur Instagram Reels & TikTok : micro-sketchs de 45s intégrant le service Orange au cœur de l’intrigue.
                </p>
                <div className="text-xs font-semibold text-green-800">
                  Recommandation : Co-produire avec Simplest Tuthi et comédiens Douala.
                </div>
              </div>

              <div className="p-12 rounded border" style={{ background: '#FFFDF5', borderColor: '#FFE0B2' }}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-orange-900">2. Démo Live Stream Mobile Money</span>
                  <span className="tag tag-orange">+42% conversion</span>
                </div>
                <p className="text-xs text-muted mb-6 leading-relaxed">
                  Sessions de questions/réponses en direct sur les plafonds, commissions et transferts Orange Money.
                </p>
                <div className="text-xs font-semibold text-orange-800">
                  Recommandation : Programmer 2 lives mensuels avec modération dédiée.
                </div>
              </div>

              <div className="p-12 rounded border" style={{ background: '#F0F7FF', borderColor: '#BBDEFB' }}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-blue-900">3. Carrousels Pédagogiques LinkedIn</span>
                  <span className="tag tag-blue">+68% B2B</span>
                </div>
                <p className="text-xs text-muted mb-6 leading-relaxed">
                  Slides explicatifs sur la transformation digitale des PME et solutions fibre Orange Pro.
                </p>
                <div className="text-xs font-semibold text-blue-800">
                  Recommandation : Activer 3 micro-influenceurs tech et consultants RH.
                </div>
              </div>
            </div>
          </div>

          {/* Liste des signaux plateformes */}
          <div className="flex flex-col gap-12">
            {formatTrends.map(item => {
              const pBadge = getPlatformBadge(item.platform);
              return (
                <div key={item.id} className="card p-16 shadow-sm" style={{ borderLeft: '4px solid #0099FF' }}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-6">
                      <span className="tag" style={{ background: pBadge.bg, color: pBadge.color, fontSize: 10 }}>
                        {pBadge.icon} {pBadge.label}
                      </span>
                      <h4 className="text-sm font-bold text-dark">{item.title}</h4>
                    </div>
                    <span className="text-xs text-muted">{formatTimeAgo(item.published_at)}</span>
                  </div>

                  <p className="text-xs text-muted mb-10 leading-relaxed">
                    {item.content || item.summary}
                  </p>

                  <div className="p-8 rounded text-xs mb-10" style={{ background: '#E3F2FD', border: '1px solid #BBDEFB' }}>
                    <strong className="text-blue-900">Impact opérationnel pour nos campagnes : </strong>
                    <span className="text-blue-800">{item.recommended_action}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-8 border-t border-gray-100">
                    <span className="text-muted">Source : <strong>{item.source_name}</strong></span>
                    <button
                      onClick={() => onOpenTransformModal(item)}
                      className="btn btn-sm"
                      style={{ background: '#FF7900', color: '#fff', fontSize: 11, fontWeight: 700 }}
                    >
                      + Appliquer à nos briefs
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── RUBRIQUE 2 : RÉGLEMENTATION & CNC ─── */}
      {activeTab === 'regulation' && (
        <div>
          <div className="card mb-16 p-16" style={{ background: '#FFFDF5', border: '1px solid #FFE0B2' }}>
            <div className="flex items-center gap-8 mb-8">
              <span style={{ fontSize: 20 }}>⚖️</span>
              <h3 className="text-sm font-bold text-dark uppercase tracking-wider">
                Cadre Réglementaire de l’Influence Commerciale au Cameroun
              </h3>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-12">
              Conformément aux instructions conjointes du MINPOSTEL, de l’ARSEL et du Conseil National de la Communication (CNC), toute publication rémunérée doit comporter une mention claire et explicite informant le public de sa nature commerciale.
            </p>

            <div className="grid grid-3 gap-12 text-xs">
              <div className="p-10 rounded bg-white border">
                <div className="font-bold text-dark mb-4">1. Mentions obligatoires</div>
                <div className="text-muted leading-relaxed">
                  Afficher obligatoirement en début de légende ou sur l’image : <strong className="text-orange-700">#CollaborationCommerciale</strong>, <strong className="text-orange-700">#PartenariatOrange</strong> ou <strong className="text-orange-700">#Publicite</strong>.
                </div>
              </div>
              <div className="p-10 rounded bg-white border">
                <div className="font-bold text-dark mb-4">2. Protection des mineurs</div>
                <div className="text-muted leading-relaxed">
                  Interdiction stricte de promesses de gains d’argent faciles ou de jeux de hasard non autorisés auprès des audiences mineures.
                </div>
              </div>
              <div className="p-10 rounded bg-white border">
                <div className="font-bold text-dark mb-4">3. Responsabilité juridique</div>
                <div className="text-muted leading-relaxed">
                  L’agence et la marque commanditaire sont solidairement responsables du respect de la législation en cas de contrôle ARMP ou CNC.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            {legalItems.map(item => (
              <div key={item.id} className="card p-16 shadow-sm" style={{ borderLeft: '4px solid #6F42C1' }}>
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-sm font-bold text-dark">{item.title}</h4>
                  <span className="tag" style={{ background: '#F3E8FD', color: '#6F42C1', fontSize: 10, fontWeight: 700 }}>
                    Officiel CNC / MINPOSTEL
                  </span>
                </div>

                <p className="text-xs text-muted mb-10 leading-relaxed">
                  {item.content || item.summary}
                </p>

                <div className="p-8 rounded text-xs mb-10" style={{ background: '#F8F9FA', border: '1px solid #EEE' }}>
                  <strong>Directive opérationnelle McCANN : </strong>
                  <span className="text-dark">{item.recommended_action}</span>
                </div>

                <div className="flex justify-between items-center text-xs pt-8 border-t border-gray-100">
                  <span className="text-muted">Source officielle : <strong>{item.source_name}</strong></span>
                  <button
                    onClick={() => onOpenTransformModal(item)}
                    className="btn btn-sm"
                    style={{ background: '#6F42C1', color: '#fff', fontSize: 11, fontWeight: 700 }}
                  >
                    Créer Note de Conformité
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── RUBRIQUE 3 : ÉTUDES MACRO & USAGES CAMEROUN ─── */}
      {activeTab === 'macro' && (
        <div>
          <div className="grid grid-2 gap-16 mb-16">
            <div className="card p-16" style={{ background: '#FFF' }}>
              <h4 className="text-sm font-bold text-dark mb-8">Pénétration des Réseaux Sociaux au Cameroun (2026)</h4>
              <div className="flex flex-col gap-8 text-xs">
                {[
                  { name: 'WhatsApp', pct: '89%', users: '~11.2M', desc: 'Canal n°1 de partage viral privé et statut' },
                  { name: 'Facebook', pct: '74%', users: '~9.3M', desc: 'Média de masse incontournable pour l’info et les buzz' },
                  { name: 'TikTok', pct: '52%', users: '~6.5M', desc: 'Croissance la plus rapide chez les 15-28 ans' },
                  { name: 'Instagram', pct: '34%', users: '~4.2M', desc: 'Canal lifestyle, créateurs urbains et diaspora' },
                  { name: 'YouTube', pct: '41%', users: '~5.1M', desc: 'Consommation croissante via forfaits data nuit' },
                  { name: 'LinkedIn', pct: '14%', users: '~1.8M', desc: 'Écosystème corporate, tech et RH' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-8 rounded" style={{ background: '#F8F9FA' }}>
                    <div>
                      <span className="font-bold text-dark">{s.name}</span>
                      <span className="text-muted ml-8">{s.desc}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-orange-600">{s.pct}</span>
                      <span className="text-xs text-muted ml-4">({s.users})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-16" style={{ background: '#FFF' }}>
              <h4 className="text-sm font-bold text-dark mb-8">Comportements d’Achat & Mobile Money au Cameroun</h4>
              <ul className="text-xs text-muted leading-relaxed" style={{ paddingLeft: 18 }}>
                <li className="mb-8">
                  <strong>68% des internautes urbains</strong> déclarent avoir déjà acheté un forfait data ou un produit suite à la recommandation d’un créateur local.
                </li>
                <li className="mb-8">
                  <strong>L’humour et la proximité culturelle</strong> sont les 2 facteurs de mémorisation publicitaire les plus puissants cités (78% de préférence pour les contenus en Camfranglais).
                </li>
                <li className="mb-8">
                  <strong>Orange Money :</strong> Forte perception de sécurité et de stabilité du réseau, opportunité de renforcer la pédagogie sur les tarifs face aux offres agressives de MTN MoMo.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
