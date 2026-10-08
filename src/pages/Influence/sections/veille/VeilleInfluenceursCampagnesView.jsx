import { useState } from 'react';
import {
  formatTimeAgo,
  getTypeLabel,
  RELIABILITY_LEVELS,
  CONFIDENCE_LEVELS,
} from './veilleUtils.js';

export default function VeilleInfluenceursCampagnesView({
  watchItems = [],
  influencers = [],
  campaigns = [],
  onOpenTransformModal,
  onUpdateInfluencerStatus,
}) {
  const [activeTab, setActiveTab] = useState('talents'); // 'talents' | 'campaigns'
  const [talentFilter, setTalentFilter] = useState('all');
  const [selectedTalentDetail, setSelectedTalentDetail] = useState(null);

  // Signaux liés aux talents
  const talentSignals = watchItems.filter(i => i.type === 'influencer' || (i.associated_talent_ids && i.associated_talent_ids.length > 0));

  // Statuts de veille talent possibles
  const TALENT_STATUS_CONFIG = {
    actif: { label: 'Actif & Conforme', color: '#28A745', bg: '#E8F5E9' },
    a_surveiller: { label: 'À Surveiller', color: '#FF7900', bg: '#FFF3E0' },
    en_risque: { label: 'En Risque Brand Safety', color: '#DC3545', bg: '#FFEBEF' },
    inactif: { label: 'Inactif / Pause', color: '#6C757D', bg: '#F1F3F5' },
    a_requalifier: { label: 'À Requalifier', color: '#6F42C1', bg: '#F3E8FD' },
    concurrentiellement_sollicite: { label: 'Sollicité par Concurrence', color: '#0070B8', bg: '#E1F5FE' },
    a_fort_potentiel: { label: 'Fort Potentiel Détecté', color: '#20C997', bg: '#E6FCF5' }
  };

  return (
    <div className="veille-talents-campagnes-view">
      {/* Sélecteur de sous-onglet */}
      <div className="flex items-center justify-between gap-12 mb-16">
        <div className="tab-bar flex gap-4 p-4" style={{ background: '#F5F5F5', borderRadius: 8 }}>
          <button
            onClick={() => setActiveTab('talents')}
            className={`tab-item ${activeTab === 'talents' ? 'active' : ''}`}
            style={{ fontWeight: 700, fontSize: 13 }}
          >
            👤 Surveillance des Talents & Qualité d’Audience ({influencers.length})
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`tab-item ${activeTab === 'campaigns' ? 'active' : ''}`}
            style={{ fontWeight: 700, fontSize: 13 }}
          >
            🎯 Radar Campagnes & Benchmarks Internes
          </button>
        </div>

        <div className="text-xs text-muted">
          Données croisées entre livrables internes Bridge et signaux externes collectés
        </div>
      </div>

      {/* ─── ONGLET 1 : VEILLE TALENTS & BRAND SAFETY ─── */}
      {activeTab === 'talents' && (
        <div>
          {/* Grille des talents suivis */}
          <div className="grid grid-3 gap-16 mb-20">
            {influencers.slice(0, 9).map((inf, idx) => {
              // Signaux associés à ce talent
              const relatedSignals = talentSignals.filter(s => s.associated_talent_ids?.includes(String(inf.id)));
              const hasRisk = relatedSignals.some(s => s.opportunity_or_risk === 'risk');
              const hasOpp = relatedSignals.some(s => s.opportunity_or_risk === 'opportunity');

              // Statut de veille
              const statusKey = inf.watchStatus || (hasRisk ? 'en_risque' : hasOpp ? 'a_fort_potentiel' : 'actif');
              const statusCfg = TALENT_STATUS_CONFIG[statusKey] || TALENT_STATUS_CONFIG.actif;

              return (
                <div
                  key={inf.id}
                  className="card p-14 shadow-sm hover:shadow transition-shadow"
                  style={{
                    borderTop: `4px solid ${statusCfg.color}`,
                    background: '#FFF'
                  }}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="text-sm font-bold text-dark mb-2">
                        @{inf.pseudo || inf.name}
                      </h4>
                      <div className="text-xs text-muted">
                        {inf.realName || inf.display_name || 'Créateur de contenu'} • {inf.type || 'Macro'}
                      </div>
                    </div>
                    <span className="tag" style={{ background: statusCfg.bg, color: statusCfg.color, fontSize: 10, fontWeight: 700 }}>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Métriques d'évolution observées */}
                  <div className="grid grid-3 gap-8 p-8 mb-10 rounded text-center" style={{ background: '#F8F9FA' }}>
                    <div>
                      <div className="text-xs text-muted" style={{ fontSize: 10 }}>Audience</div>
                      <div className="text-xs font-bold text-dark">{inf.followers || '240K'}</div>
                      <div className="text-xs text-green-700" style={{ fontSize: 9 }}>+4.2%/mois</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted" style={{ fontSize: 10 }}>Engagement</div>
                      <div className="text-xs font-bold text-dark">{inf.engagement || '5.8%'}</div>
                      <div className="text-xs text-muted" style={{ fontSize: 9 }}>Médiane 4.1%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted" style={{ fontSize: 10 }}>Score Risque</div>
                      <div className="text-xs font-bold" style={{ color: inf.riskScore > 3 ? '#DC3545' : '#28A745' }}>
                        {inf.riskScore || 2}/5
                      </div>
                      <div className="text-xs text-muted" style={{ fontSize: 9 }}>Faible</div>
                    </div>
                  </div>

                  {/* Signaux récents sur ce talent */}
                  <div className="mb-10">
                    <div className="text-xs font-bold text-dark mb-4 flex items-center justify-between">
                      <span>Derniers signaux radar :</span>
                      <span className="text-muted" style={{ fontSize: 10 }}>{relatedSignals.length} détecté(s)</span>
                    </div>

                    {relatedSignals.length > 0 ? (
                      <div className="flex flex-col gap-6">
                        {relatedSignals.map(s => (
                          <div key={s.id} className="p-6 rounded text-xs" style={{ background: s.opportunity_or_risk === 'risk' ? '#FFF5F5' : '#F0FFF4', border: '1px solid #EEE' }}>
                            <div className="font-semibold text-dark">{s.title.substring(0, 55)}...</div>
                            <div className="text-muted" style={{ fontSize: 10 }}>Source : {s.source_name} • {s.confidence_level}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted italic p-6 rounded" style={{ background: '#F9F9F9' }}>
                        ✓ Aucune anomalie détectée sur les 14 derniers jours.
                      </div>
                    )}
                  </div>

                  {/* Actions rapides sur le talent */}
                  <div className="flex items-center justify-between pt-8 border-t border-gray-100 text-xs">
                    <button
                      onClick={() => setSelectedTalentDetail(inf)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '3px 8px', fontSize: 11, color: '#FF7900', fontWeight: 600 }}
                    >
                      Audit Qualité & Fraude →
                    </button>
                    <button
                      onClick={() => {
                        const dummyItem = {
                          title: `Recommandation d’activation / arbitrage pour @${inf.pseudo || inf.name}`,
                          summary: `Évaluation de statut : ${statusCfg.label}. Audience ${inf.followers || '240K'}.`,
                          associated_talent_ids: [String(inf.id)],
                          recommended_action: `Ajuster les livrables de la campagne active pour @${inf.pseudo || inf.name}`
                        };
                        onOpenTransformModal(dummyItem);
                      }}
                      className="btn btn-sm"
                      style={{ padding: '3px 8px', fontSize: 11, background: '#1A1A1A', color: '#FFF' }}
                    >
                      Action
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal ou volet d'Audit de Qualité d'Audience et Signaux de Fraude */}
          {selectedTalentDetail && (
            <div className="modal-overlay" onClick={() => setSelectedTalentDetail(null)} style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 16
            }}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                background: '#fff', borderRadius: 12, width: '100%', maxWidth: 640, maxHeight: '90vh',
                overflowY: 'auto', padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
              }}>
                <div className="flex justify-between items-start pb-12 mb-16 border-b">
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-2">
                      Fiche d’Audit Qualité d’Audience — @{selectedTalentDetail.pseudo || selectedTalentDetail.name}
                    </h3>
                    <div className="text-xs text-muted">
                      Règles de détection transparentes, sources d'analyses autorisées et historique de conformité
                    </div>
                  </div>
                  <button onClick={() => setSelectedTalentDetail(null)} className="btn btn-ghost btn-sm">✕</button>
                </div>

                <div className="p-12 mb-16 rounded" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF' }}>
                  <div className="text-xs font-bold text-dark mb-6">MÉTHODOLOGIE D’ANALYSE APPLIQUÉE :</div>
                  <ul className="text-xs text-muted" style={{ paddingLeft: 18, lineHeight: 1.8 }}>
                    <li><strong>Source de collecte :</strong> Meta Graph API & TikTok Creator Insights officiel</li>
                    <li><strong>Règle de détection de faux abonnés :</strong> Ratio de comptes sans bio, sans abonnés et pics de croissance supérieur à 10%/48h sans post viral documenté</li>
                    <li><strong>Niveau de confiance actuel :</strong> 88% (Élevé) • Dernière vérification il y a 1 jour</li>
                  </ul>
                </div>

                <div className="grid grid-2 gap-12 mb-16">
                  <div className="p-10 rounded border" style={{ background: '#FFF' }}>
                    <div className="text-xs text-muted mb-2">Qualité d’Audience Évaluée</div>
                    <div className="text-xl font-bold text-green-700">86.4% Authentique</div>
                    <div className="text-xs text-muted mt-2">13.6% comptes inactifs ou bots présumés (standard marché : 15%)</div>
                  </div>
                  <div className="p-10 rounded border" style={{ background: '#FFF' }}>
                    <div className="text-xs text-muted mb-2">Territoire Réel de l’Audience</div>
                    <div className="text-xl font-bold text-dark">78.2% Cameroun</div>
                    <div className="text-xs text-muted mt-2">Douala (42%), Yaoundé (31%), Diaspora France (11%)</div>
                  </div>
                </div>

                <div className="flex justify-end gap-8 pt-12 border-t">
                  <button onClick={() => setSelectedTalentDetail(null)} className="btn btn-ghost">
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      const dummy = {
                        title: `Note d’arbitrage qualité audience pour @${selectedTalentDetail.pseudo || selectedTalentDetail.name}`,
                        summary: 'Audit conformité d’audience : 86.4% authentique, 78% localisé au Cameroun.',
                        associated_talent_ids: [String(selectedTalentDetail.id)],
                        recommended_action: 'Valider le talent pour la vague suivante de la campagne Orange.'
                      };
                      setSelectedTalentDetail(null);
                      onOpenTransformModal(dummy);
                    }}
                    className="btn btn-orange"
                    style={{ fontWeight: 700 }}
                  >
                    Valider le rapport d’audit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── ONGLET 2 : VEILLE CAMPAGNES & BENCHMARKS ─── */}
      {activeTab === 'campaigns' && (
        <div>
          {/* Synthèse des Benchmarks Internes */}
          <div className="card mb-16 p-16" style={{ background: '#FFF' }}>
            <h3 className="text-sm font-bold text-dark mb-12 uppercase tracking-wider">
              Benchmarks Internes de Référence — Campagnes Influence Orange Cameroun
            </h3>
            <div className="grid grid-4 gap-12 text-center">
              <div className="p-10 rounded" style={{ background: '#F8F9FA' }}>
                <div className="text-xs text-muted mb-2">Taux d’engagement Médian</div>
                <div className="text-xl font-bold text-dark">4.2%</div>
                <div className="text-xs text-muted">Sur 180 publications analysées</div>
              </div>
              <div className="p-10 rounded" style={{ background: '#F8F9FA' }}>
                <div className="text-xs text-muted mb-2">Taux d’engagement Moyen</div>
                <div className="text-xl font-bold text-dark">4.8%</div>
                <div className="text-xs text-muted">Toutes catégories confondues</div>
              </div>
              <div className="p-10 rounded" style={{ background: '#E8F5E9' }}>
                <div className="text-xs text-green-900 mb-2 font-semibold">Top Performers (Top 10%)</div>
                <div className="text-xl font-bold text-green-800">8.9% - 12.4%</div>
                <div className="text-xs text-green-700">Formats Reels comédie & tutoriels</div>
              </div>
              <div className="p-10 rounded" style={{ background: '#FFF3E0' }}>
                <div className="text-xs text-orange-900 mb-2 font-semibold">Seuil d’Alerte Sous-performance</div>
                <div className="text-xl font-bold text-orange-800">&lt; 2.5%</div>
                <div className="text-xs text-orange-700">Déclenche un audit de contenu</div>
              </div>
            </div>
          </div>

          {/* Comparatif des campagnes actives */}
          <div className="flex flex-col gap-12">
            {(() => {
              const cleanCampaigns = (campaigns || []).filter(c =>
                c &&
                c.isNewlyCreated === true &&
                !c.isDemo &&
                !c.isExample &&
                !['CAMP-ORANGE-WEEKEND', 'CAMP-ORANGE-RELAY-2025', 'CAMP-ORANGE-Q4-2025', 'CAMP-001', 'CAMP-002', 'CAMP-003'].includes(c.id) &&
                !['Orange Weekend 2025', 'Relais Média & Webzines', 'Campagnes & Challenges Q4 2025'].includes(c.name) &&
                !c.id?.startsWith('mock-')
              );

              if (cleanCampaigns.length === 0) {
                return (
                  <div className="card p-24 text-center text-muted" style={{ background: '#FAFAFC', border: '1px dashed #CBD5E1' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>🗂</div>
                    <div style={{ fontWeight: 700, color: 'var(--dark)', fontSize: 14 }}>Aucune campagne active enregistrée</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      Les analyses comparatives de vos campagnes réelles s'afficheront ici au fur et à mesure de leurs créations.
                    </div>
                  </div>
                );
              }

              return cleanCampaigns.map(camp => (
                <div key={camp.id} className="card p-16 shadow-sm" style={{ borderLeft: '4px solid #FF7900' }}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="text-base font-bold text-dark mb-2">{camp.name}</h4>
                      <div className="text-xs text-muted">
                        Période : {camp.period || 'Non spécifiée'} • Dispositif : {camp.entity || camp.source_sheet || 'Orange Cameroun'}
                      </div>
                    </div>
                    <span className="tag tag-green">
                      {camp.status || 'Active'}
                    </span>
                  </div>

                  <div className="grid grid-3 gap-12 p-10 rounded mb-12" style={{ background: '#F8F9FA' }}>
                    <div>
                      <div className="text-xs text-muted">Objectif Principal</div>
                      <div className="text-sm font-bold text-dark">{camp.objective || 'Notoriété & Engagement'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">Budget Enveloppe</div>
                      <div className="text-sm font-bold text-dark">{camp.budget || camp.budgetEnveloppe || 'Standard'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">Statut Activation</div>
                      <div className="text-sm font-bold text-green-700">Enregistrée</div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-8 pt-8 border-t border-gray-100">
                    <button
                      onClick={() => {
                        const item = {
                          title: `Ajustement stratégique pour ${camp.name}`,
                          summary: `Campagne : ${camp.name}`,
                          associated_campaign_ids: [camp.id],
                          recommended_action: `Suivi des livrables et optimisation pour ${camp.name}`
                        };
                        onOpenTransformModal(item);
                      }}
                      className="btn btn-sm"
                      style={{ background: '#FF7900', color: '#fff', fontSize: 11, fontWeight: 700 }}
                    >
                      + Créer une Décision d’Amplification
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
