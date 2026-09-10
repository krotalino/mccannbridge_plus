import { useState } from 'react';
import {
  formatTimeAgo,
  getTypeLabel,
  getTypeIcon,
  getPlatformBadge,
  RELIABILITY_LEVELS,
  ALERT_PRIORITIES,
} from './veilleUtils.js';

export default function CockpitView({
  metrics,
  watchItems = [],
  alerts = [],
  competitors = [],
  influencers = [],
  onOpenTransformModal,
  onResolveAlert,
  onNavigateSubtab,
  onMarkItemRead,
  onQuickAssignTask
}) {
  const [selectedQuickAction, setSelectedQuickAction] = useState(null);

  const urgentAlerts = alerts.filter(a => a.status !== 'resolu' && a.status !== 'ignore').slice(0, 4);
  const weeklyOpportunities = watchItems.filter(i => i.opportunity_or_risk === 'opportunity').slice(0, 4);
  const brandSafetySignals = watchItems.filter(i => i.themes?.includes('Brand Safety') || i.themes?.includes('Modération')).slice(0, 3);
  const recentCompetitorSignals = watchItems.filter(i => i.type === 'competitor').slice(0, 3);

  return (
    <div className="cockpit-view">
      {/* ─── 1. BANDEAU DE STATUT & COUVERTURE ─── */}
      <div className="card mb-16 p-16 flex flex-wrap items-center justify-between gap-16" style={{
        background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
        color: '#fff',
        borderRadius: 10,
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
      }}>
        <div className="flex items-center gap-16">
          <div style={{
            width: 44, height: 44, borderRadius: 8, background: '#FF7900',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>
            🔭
          </div>
          <div>
            <div className="flex items-center gap-8 mb-4">
              <span className="text-base font-bold">Cockpit Décisionnel de Veille & Radar Influence</span>
              <span className="tag tag-green" style={{ fontSize: 11, background: '#28A745', color: '#fff' }}>
                ● Radar Actif
              </span>
            </div>
            <div className="text-xs text-gray-300">
              Anticipation des risques, détection d’opportunités d’amplification et surveillance concurrentielle MTN / Camtel.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-20">
          <div className="text-right">
            <div className="text-xs text-gray-400">Fraîcheur des données</div>
            <div className="text-lg font-bold text-white flex items-center justify-end gap-6">
              <span style={{ color: '#28A745' }}>{metrics.freshnessRate}%</span>
              <span className="text-xs text-gray-400">à jour</span>
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: '#444' }} />
          <div className="text-right">
            <div className="text-xs text-gray-400">Couverture Talents & Campagnes</div>
            <div className="text-lg font-bold text-white flex items-center justify-end gap-6">
              <span style={{ color: '#FF7900' }}>{metrics.talentCoverageRate}%</span>
              <span className="text-xs text-gray-400">surveillés</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. GRILLE DES 4 KPI CRITIQUES ─── */}
      <div className="grid grid-4 gap-12 mb-16">
        <div className="card p-12" style={{ borderLeft: '4px solid #DC3545', background: '#FFF' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs text-muted font-bold">Alertes Requérant Action</span>
            <span className="tag" style={{ background: '#FFEBEF', color: '#DC3545', fontSize: 10, fontWeight: 700 }}>
              Prioritaire
            </span>
          </div>
          <div className="text-2xl font-bold text-dark mb-2">{metrics.priorityAlertsCount}</div>
          <div className="text-xs text-muted">
            {metrics.activeAlertsCount} alertes actives au total
          </div>
        </div>

        <div className="card p-12" style={{ borderLeft: '4px solid #28A745', background: '#FFF' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs text-muted font-bold">Opportunités d’Amplification</span>
            <span className="tag" style={{ background: '#E8F5E9', color: '#28A745', fontSize: 10, fontWeight: 700 }}>
              + RoI
            </span>
          </div>
          <div className="text-2xl font-bold text-dark mb-2">{metrics.opportunitiesCount}</div>
          <div className="text-xs text-muted">Reels viraux, UGC & formats émergents</div>
        </div>

        <div className="card p-12" style={{ borderLeft: '4px solid #FF7900', background: '#FFF' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs text-muted font-bold">Risques & Brand Safety</span>
            <span className="tag" style={{ background: '#FFF3E0', color: '#FF7900', fontSize: 10, fontWeight: 700 }}>
              Surveillance
            </span>
          </div>
          <div className="text-2xl font-bold text-dark mb-2">{metrics.risksCount}</div>
          <div className="text-xs text-muted">Controverses & anomalies d’audience</div>
        </div>

        <div className="card p-12" style={{ borderLeft: '4px solid #0099FF', background: '#FFF' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs text-muted font-bold">Activité Concurrence</span>
            <span className="tag" style={{ background: '#E3F2FD', color: '#0099FF', fontSize: 10, fontWeight: 700 }}>
              Direct
            </span>
          </div>
          <div className="text-2xl font-bold text-dark mb-2">{metrics.activeCompetitorsCount}</div>
          <div className="text-xs text-muted">Marques suivies (MTN, Camtel, Nexttel)</div>
        </div>
      </div>

      {/* ─── 3. ZONE « QUE FAIRE MAINTENANT ? » ─── */}
      <div className="card mb-20 p-16" style={{
        background: '#FFF9F2',
        border: '1px solid #FFE0B2',
        borderRadius: 8
      }}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-8">
            <span style={{ fontSize: 18 }}>⚡</span>
            <h3 className="text-sm font-bold text-dark uppercase tracking-wider">
              Que faire maintenant ? — Matrice des décisions prioritaires
            </h3>
          </div>
          <span className="text-xs text-muted">
            Cliquez sur une action pour appliquer directement un traitement traçable
          </span>
        </div>

        <div className="grid grid-4 gap-8">
          <button
            onClick={() => onNavigateSubtab('watchlists_alertes')}
            className="card p-10 text-left hover:shadow-md transition-shadow"
            style={{ background: '#FFF', border: '1px solid #FFCC80', borderRadius: 6, cursor: 'pointer' }}
          >
            <div className="flex items-center gap-6 mb-4">
              <span className="tag tag-red" style={{ fontSize: 9 }}>URGENT</span>
              <span className="text-xs font-bold text-dark">Traiter l’alerte Brand Safety</span>
            </div>
            <div className="text-xs text-muted mb-6" style={{ fontSize: 11 }}>
              Briefer l’agent du talent sur la polémique live TikTok et mettre en pause le post.
            </div>
            <div className="text-xs font-semibold" style={{ color: '#FF7900' }}>→ Ouvrir le ticket alerte</div>
          </button>

          <button
            onClick={() => onNavigateSubtab('talents_campagnes')}
            className="card p-10 text-left hover:shadow-md transition-shadow"
            style={{ background: '#FFF', border: '1px solid #A5D6A7', borderRadius: 6, cursor: 'pointer' }}
          >
            <div className="flex items-center gap-6 mb-4">
              <span className="tag tag-green" style={{ fontSize: 9 }}>OPPORTUNITÉ</span>
              <span className="text-xs font-bold text-dark">Amplifier le Reel Simplest Tuthi</span>
            </div>
            <div className="text-xs text-muted mb-6" style={{ fontSize: 11 }}>
              Surperformance +185% : soumettre la proposition de Dark Post Meta au client Orange.
            </div>
            <div className="text-xs font-semibold text-green-700">→ Créer la recommandation</div>
          </button>

          <button
            onClick={() => onNavigateSubtab('concurrents')}
            className="card p-10 text-left hover:shadow-md transition-shadow"
            style={{ background: '#FFF', border: '1px solid #90CAF9', borderRadius: 6, cursor: 'pointer' }}
          >
            <div className="flex items-center gap-6 mb-4">
              <span className="tag tag-blue" style={{ fontSize: 9 }}>CONCURRENCE</span>
              <span className="text-xs font-bold text-dark">Riposte MTN Pulse 2026</span>
            </div>
            <div className="text-xs text-muted mb-6" style={{ fontSize: 11 }}>
              Activer les talents comédie Orange sur le challenge data étudiant #OrangeWeekend.
            </div>
            <div className="text-xs font-semibold text-blue-700">→ Comparer les activations</div>
          </button>

          <button
            onClick={() => onNavigateSubtab('tendances_macro')}
            className="card p-10 text-left hover:shadow-md transition-shadow"
            style={{ background: '#FFF', border: '1px solid #E0E0E0', borderRadius: 6, cursor: 'pointer' }}
          >
            <div className="flex items-center gap-6 mb-4">
              <span className="tag tag-muted" style={{ fontSize: 9 }}>CONFORMITÉ</span>
              <span className="text-xs font-bold text-dark">Vérifier les mentions CNC</span>
            </div>
            <div className="text-xs text-muted mb-6" style={{ fontSize: 11 }}>
              Contrôler la présence systématique du hashtag #PartenariatOrange sur les livrables.
            </div>
            <div className="text-xs font-semibold text-gray-700">→ Consulter la directive</div>
          </button>
        </div>
      </div>

      {/* ─── 4. BLOCS JUMEAUX : ALERTES URGENTES VS OPPORTUNITÉS DE LA SEMAINE ─── */}
      <div className="grid grid-2 gap-16 mb-20">
        {/* Colonne Gauche : Alertes Prioritaires à traiter */}
        <div className="card p-16">
          <div className="flex justify-between items-center mb-12 pb-8 border-b">
            <div className="flex items-center gap-8">
              <span style={{ fontSize: 16 }}>🚨</span>
              <h3 className="text-sm font-bold text-dark">Alertes Prioritaires à Traiter</h3>
            </div>
            <button
              onClick={() => onNavigateSubtab('watchlists_alertes')}
              className="text-xs font-semibold hover:underline"
              style={{ color: '#FF7900' }}
            >
              Voir toutes ({alerts.length}) →
            </button>
          </div>

          <div className="flex flex-col gap-10">
            {urgentAlerts.map(alert => {
              const pConfig = ALERT_PRIORITIES[alert.priority?.toUpperCase()] || ALERT_PRIORITIES.IMPORTANT;
              return (
                <div
                  key={alert.id}
                  className="p-10 rounded border transition-colors"
                  style={{ background: alert.priority === 'bloquant' ? '#FFF5F5' : '#FAFAFA', borderColor: '#EAEAEA' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-6">
                      <span className="tag" style={{ background: pConfig.bg, color: pConfig.color, border: `1px solid ${pConfig.border}`, fontSize: 10, fontWeight: 700 }}>
                        {pConfig.label}
                      </span>
                      <span className="text-xs font-bold text-dark">{alert.title}</span>
                    </div>
                    <span className="text-xs text-muted">{formatTimeAgo(alert.created_at)}</span>
                  </div>

                  <p className="text-xs text-muted mb-6" style={{ fontSize: 11 }}>
                    Action recommandée : <strong className="text-dark">{alert.recommended_action}</strong>
                  </p>

                  <div className="flex justify-between items-center text-xs pt-4 border-t border-gray-100">
                    <span className="text-muted">
                      Assigné : <span className="font-semibold text-dark">{alert.assigned_to || 'Équipe'}</span>
                    </span>
                    <div className="flex items-center gap-8">
                      <button
                        onClick={() => onResolveAlert(alert.id, 'Traité depuis le cockpit rapide')}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '3px 8px', fontSize: 11, color: '#28A745' }}
                      >
                        ✓ Résoudre
                      </button>
                      <button
                        onClick={() => {
                          const item = watchItems.find(w => w.id === alert.watch_item_id) || { title: alert.title, recommended_action: alert.recommended_action };
                          onOpenTransformModal(item);
                        }}
                        className="btn btn-sm"
                        style={{ padding: '3px 8px', fontSize: 11, background: '#FF7900', color: '#fff' }}
                      >
                        Créer Insight / Tâche
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne Droite : Opportunités Détectées Cette Semaine */}
        <div className="card p-16">
          <div className="flex justify-between items-center mb-12 pb-8 border-b">
            <div className="flex items-center gap-8">
              <span style={{ fontSize: 16 }}>🎯</span>
              <h3 className="text-sm font-bold text-dark">Opportunités Détectées Cette Semaine</h3>
            </div>
            <button
              onClick={() => onNavigateSubtab('flux')}
              className="text-xs font-semibold hover:underline"
              style={{ color: '#28A745' }}
            >
              Explorer le flux →
            </button>
          </div>

          <div className="flex flex-col gap-10">
            {weeklyOpportunities.map(item => {
              const pBadge = getPlatformBadge(item.platform);
              return (
                <div key={item.id} className="p-10 rounded border" style={{ background: '#F8FDF9', borderColor: '#C8E6C9' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-6">
                      <span className="tag" style={{ background: pBadge.bg, color: pBadge.color, fontSize: 10 }}>
                        {pBadge.icon} {pBadge.label}
                      </span>
                      <span className="text-xs font-bold text-dark">{item.title}</span>
                    </div>
                    <span className="tag tag-green" style={{ fontSize: 10 }}>Score {item.relevance_score}/100</span>
                  </div>

                  <p className="text-xs text-muted mb-6" style={{ fontSize: 11 }}>
                    {item.summary}
                  </p>

                  <div className="flex justify-between items-center text-xs pt-4 border-t border-green-100">
                    <span className="text-green-800 font-semibold">
                      Prochaine étape : {item.recommended_action || 'Activation recommandée'}
                    </span>
                    <button
                      onClick={() => onOpenTransformModal(item)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '3px 8px', fontSize: 11, color: '#1E7E34', fontWeight: 600 }}
                    >
                      + Transformer en Insight
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 5. VEILLE CONCURRENTIELLE & RADAR DES CAMPAGNES ─── */}
      <div className="grid grid-2 gap-16">
        {/* Radar des marques concurrentes */}
        <div className="card p-16">
          <div className="flex justify-between items-center mb-12 pb-8 border-b">
            <div className="flex items-center gap-8">
              <span style={{ fontSize: 16 }}>⚔️</span>
              <h3 className="text-sm font-bold text-dark">Dernière Activité Concurrentielle Détectée</h3>
            </div>
            <button
              onClick={() => onNavigateSubtab('concurrents')}
              className="text-xs font-semibold hover:underline"
              style={{ color: '#0099FF' }}
            >
              Tableau comparatif →
            </button>
          </div>

          <div className="flex flex-col gap-10">
            {recentCompetitorSignals.map(item => (
              <div key={item.id} className="p-10 rounded border" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-dark">{item.title}</span>
                  <span className="tag tag-blue" style={{ fontSize: 10 }}>{item.confidence_level}</span>
                </div>
                <div className="text-xs text-muted mb-6" style={{ fontSize: 11 }}>
                  {item.summary}
                </div>
                <div className="flex justify-between items-center text-xs text-muted">
                  <span>Source : <strong>{item.source_name}</strong></span>
                  <span style={{ color: '#0070B8' }}>{formatTimeAgo(item.collected_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Safety & Modération des contenus */}
        <div className="card p-16">
          <div className="flex justify-between items-center mb-12 pb-8 border-b">
            <div className="flex items-center gap-8">
              <span style={{ fontSize: 16 }}>🛡️</span>
              <h3 className="text-sm font-bold text-dark">Brand Safety, Modération & Signaux de Risque</h3>
            </div>
            <button
              onClick={() => onNavigateSubtab('talents_campagnes')}
              className="text-xs font-semibold hover:underline text-muted"
            >
              Audits talents →
            </button>
          </div>

          <div className="flex flex-col gap-10">
            {brandSafetySignals.length > 0 ? brandSafetySignals.map(item => (
              <div key={item.id} className="p-10 rounded border" style={{ background: '#FFFDF5', borderColor: '#FEE5A5' }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-dark">{item.title}</span>
                  <span className="tag tag-yellow" style={{ fontSize: 10 }}>Risque modéré</span>
                </div>
                <div className="text-xs text-muted mb-6" style={{ fontSize: 11 }}>
                  {item.summary}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-red-700 font-semibold">Protocole : Clause de réserve activée</span>
                  <button
                    onClick={() => onOpenTransformModal(item)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, padding: '2px 6px' }}
                  >
                    Notifier Client
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-xs text-muted">
                ✓ Aucun incident de Brand Safety actif sur les créateurs sous contrat.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
