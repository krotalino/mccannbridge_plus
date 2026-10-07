import React from 'react';
import { Zap, AlertTriangle, Calendar, CheckCircle2, ArrowRight, Clock, Sparkles } from 'lucide-react';

export default function ClientTrafficCockpit({
  dossiers = [],
  validations = [],
  recommendations = [],
  calendarItems = [],
  livrables = [],
  onNavigateTab,
  onOpenValidation,
  onOpenDossier,
  onOpenNewBrief,
}) {
  const pendingValidations = validations.filter(v => v.status === 'en_attente');
  const atRiskDossiers = dossiers.filter(d => d.risk?.level === 'rouge' || d.risk?.level === 'orange');
  const upcomingMilestones = calendarItems.slice(0, 4);
  const activeDossiersCount = dossiers.filter(d => d.clientStatus !== 'livre').length;
  const readyRecommendationsCount = recommendations.filter(r => r.clientDecision === 'a_examiner' || !r.clientDecision).length;
  const deliveredLivrablesCount = (livrables || []).filter(l => l.status === 'livre').length;

  const dynamicKpis = [
    {
      id: 'travaux_actifs',
      title: 'TRAVAUX ACTIFS',
      value: activeDossiersCount,
      unit: 'dossiers',
      subtitle: 'Demandes prises en charge',
      trend: activeDossiersCount > 0 ? `${activeDossiersCount} en cours` : 'Aucun actif',
      trendPositive: true,
      tag: 'Activité en cours',
      tagClass: 'tag-orange',
      icon: '⚙️',
      color: '#FF7900',
      interet: 'Mesurer l’activité en cours',
    },
    {
      id: 'a_valider_orange',
      title: 'À VALIDER PAR ORANGE',
      value: pendingValidations.length,
      unit: 'actions',
      subtitle: 'Feedbacks ou validations requis',
      trend: pendingValidations.length > 0 ? `${pendingValidations.length} en attente` : 'À jour',
      trendPositive: pendingValidations.length === 0,
      tag: 'Décision requise',
      tagClass: 'tag-blue',
      icon: '⚡',
      color: '#1E88E5',
      interet: 'Réduire les retards de décision',
    },
    {
      id: 'jalons_semaine',
      title: 'JALONS DE LA SEMAINE',
      value: calendarItems.length,
      unit: 'échéances',
      subtitle: 'Livrables, lancements & réunions',
      trend: calendarItems.length > 0 ? `${calendarItems.length} planifié(s)` : '0 planifié',
      trendPositive: true,
      tag: 'Planning',
      tagClass: 'tag-purple',
      icon: '📅',
      color: '#8E24AA',
      interet: 'Anticiper les échéances',
    },
    {
      id: 'a_risque',
      title: 'POINTS DE VIGILANCE',
      value: atRiskDossiers.length,
      unit: 'à risque',
      subtitle: 'Risque de décalage identifié',
      trend: atRiskDossiers.length > 0 ? 'Vigilance requise' : 'Aucun risque',
      trendPositive: atRiskDossiers.length === 0,
      tag: 'Alerte délai',
      tagClass: 'tag-yellow',
      icon: '⚠️',
      color: '#E65100',
      interet: 'Permettre l’arbitrage tôt',
    },
    {
      id: 'livrables_remis',
      title: 'LIVRABLES REMIS',
      value: deliveredLivrablesCount,
      unit: 'documents',
      subtitle: 'Créas, bilans & plannings déposés',
      trend: deliveredLivrablesCount > 0 ? `${deliveredLivrablesCount} déposé(s)` : 'À jour',
      trendPositive: true,
      tag: 'Visibilité réelle',
      tagClass: 'tag-green',
      icon: '📁',
      color: '#2E7D32',
      interet: 'Donner de la visibilité sur l’avancement réel',
    },
    {
      id: 'recommandations_arbitrer',
      title: 'RECOMMANDATIONS À DÉCIDER',
      value: readyRecommendationsCount,
      unit: 'propositions',
      subtitle: 'Innovations & opportunités prêtes',
      trend: readyRecommendationsCount > 0 ? `${readyRecommendationsCount} à arbitrer` : '0 en attente',
      trendPositive: true,
      tag: 'Go / No-go',
      tagClass: 'tag-purple',
      icon: '💡',
      color: '#6A1B9A',
      interet: 'Faire vivre la proactivité de l’agence',
    },
  ];

  return (
    <div className="client-traffic-cockpit space-y-20 animate-fade">
      {/* ─── 1. SYNTHÈSE DÉCISIONNELLE IMMÉDIATE (Page 2 du Cahier des Charges) ─── */}
      <div
        className="card"
        style={{
          borderRadius: 14,
          padding: '18px 24px',
          background: 'linear-gradient(135deg, #FFF8F2 0%, #FFF3E0 100%)',
          border: '1.5px solid #FFCC80',
          boxShadow: '0 4px 16px rgba(255, 121, 0, 0.08)',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#FF7900',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🧭
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#E65100' }}>
                SYNTHÈSE DÉCISIONNELLE EN TEMPS RÉEL
              </span>
              <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                Directoire Marketing Orange
              </span>
            </div>
            
            <p
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: '#212121',
                margin: '4px 0 8px 0',
                lineHeight: 1.45,
              }}
            >
              {activeDossiersCount === 0 && pendingValidations.length === 0 && atRiskDossiers.length === 0 && readyRecommendationsCount === 0 ? (
                <>
                  « <strong style={{ color: '#FF7900' }}>0 sujet actif</strong> ;{' '}
                  <strong style={{ color: '#1E88E5' }}>0 validation requise</strong> ;{' '}
                  <strong style={{ color: '#E65100' }}>0 point de vigilance</strong> ;{' '}
                  <strong style={{ color: '#6A1B9A' }}>0 recommandation en attente</strong>. »
                </>
              ) : (
                <>
                  « <strong style={{ color: '#FF7900' }}>{activeDossiersCount} sujet{activeDossiersCount > 1 ? 's actifs' : ' actif'}</strong> ;{' '}
                  <strong style={{ color: '#1E88E5' }}>{pendingValidations.length} validation{pendingValidations.length > 1 ? 's Orange requises' : ' requise'}</strong> ;{' '}
                  <strong style={{ color: '#E65100' }}>{atRiskDossiers.length} échéance{atRiskDossiers.length > 1 ? 's à risque' : ' à risque'}</strong> ;{' '}
                  <strong style={{ color: '#6A1B9A' }}>{readyRecommendationsCount} recommandation{readyRecommendationsCount > 1 ? 's prêtes à arbitrer' : ' prête à arbitrer'}</strong>. »
                </>
              )}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#555' }}>
              <span>• <strong>Qu’est-ce qui est en cours ?</strong> {activeDossiersCount > 0 ? `${activeDossiersCount} campagne(s) & livrable(s) en cadrage ou production` : 'Aucun projet en production'}</span>
              <span>• <strong>Qui le traite ?</strong> Équipes dédiées McCann Douala sous la régulation du Traffic</span>
              <span>• <strong>Qu’attend McCann d’Orange ?</strong> {pendingValidations.length > 0 ? `${pendingValidations.length} validation(s) en attente de retour client` : 'Aucune action requise d’Orange'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. LES 6 CARTES KPI DE PILOTAGE ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {dynamicKpis.map(kpi => (
          <div
            key={kpi.id}
            className="card"
            style={{
              borderRadius: 12,
              padding: '16px 18px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Header card with tag and icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span
                  className={`tag ${kpi.tagClass}`}
                  style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}
                >
                  {kpi.tag}
                </span>
                <span style={{ fontSize: 18 }}>{kpi.icon}</span>
              </div>

              {/* Title */}
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {kpi.title}
              </div>

              {/* Value with unit */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '6px 0' }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--dark)', letterSpacing: '-0.5px' }}>
                  {kpi.value}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)' }}>
                  {kpi.unit}
                </span>
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginBottom: 8 }}>
                {kpi.subtitle}
              </div>
            </div>

            {/* Bottom info: interest & trend */}
            <div
              style={{
                paddingTop: 10,
                borderTop: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
              }}
            >
              <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                🎯 {kpi.interet}
              </span>
              <span style={{ fontWeight: 800, color: kpi.trendPositive ? '#2E7D32' : '#C62828' }}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 3. DEUX BLOCS PRINCIPAUX : ACTIONS ATTENDUES & POINTS DE VIGILANCE ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 18,
          marginBottom: 24,
        }}
      >
        {/* Block A: Actions attendues d'Orange (Validations prioritaires) */}
        <div
          className="card"
          style={{
            borderRadius: 14,
            padding: '20px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E88E5' }}>
                <Zap size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
                  Actions attendues de votre part
                </h3>
                <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0 }}>
                  {pendingValidations.length > 0 ? `${pendingValidations.length} validation(s) pour maintenir les calendriers de diffusion` : 'Flux de validation nominal'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => onNavigateTab('validations')}
              style={{ fontSize: 11, fontWeight: 800, color: '#1E88E5' }}
            >
              Voir tout ({validations.length}) →
            </button>
          </div>

          <div className="space-y-12">
            {pendingValidations.length === 0 ? (
              <div style={{ padding: '36px 16px', textAlign: 'center', background: '#F8FAFC', borderRadius: 10, border: '1px dashed #CBD5E1' }}>
                <CheckCircle2 size={32} style={{ color: '#10B981', margin: '0 auto 8px' }} />
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>Toutes les validations sont à jour</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>Aucune décision ou arbitrage Orange n’est en attente pour le moment.</div>
              </div>
            ) : (
              pendingValidations.map(val => (
                <div
                  key={val.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #BBDEFB',
                    background: '#F8FAFC',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                    <div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: '#E3F2FD',
                          color: '#1565C0',
                          marginRight: 6,
                        }}
                      >
                        {val.categoryLabel}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>
                        {val.entity}
                      </span>
                    </div>
                    {val.deadlineHoursLeft && (
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          color: '#C62828',
                          background: '#FFEBEE',
                          padding: '2px 8px',
                          borderRadius: 12,
                        }}
                      >
                        ⏳ {val.deadlineHoursLeft}h restantes
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 4 }}>
                    {val.subject}
                  </div>

                  <div style={{ fontSize: 11.5, color: '#4B5563', marginBottom: 8, lineHeight: 1.35 }}>
                    <strong>Attente :</strong> {val.whatIsExpected}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 8,
                      paddingTop: 8,
                      borderTop: '1px solid #E2E8F0',
                    }}
                  >
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      👤 <strong>Destinataire :</strong> {val.whoMustAnswer}
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      onClick={() => onOpenValidation(val)}
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background: '#1E88E5',
                        border: 'none',
                        padding: '4px 10px',
                      }}
                    >
                      Arbitrer maintenant →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Block B: Dépendances & Points de vigilance */}
        <div
          className="card"
          style={{
            borderRadius: 14,
            padding: '20px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E65100' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
                  Points de vigilance & Dépendances
                </h3>
                <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0 }}>
                  Visibilité sur les blocages sans dévoiler la charge RH interne
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 12,
                background: atRiskDossiers.length > 0 ? '#FFEBEE' : '#E8F5E9',
                color: atRiskDossiers.length > 0 ? '#C62828' : '#2E7D32',
              }}
            >
              {atRiskDossiers.length} {atRiskDossiers.length > 1 ? 'risques identifiés' : 'risque identifié'}
            </span>
          </div>

          <div className="space-y-12">
            {atRiskDossiers.length === 0 ? (
              <div style={{ padding: '36px 16px', textAlign: 'center', background: '#F0FDF4', borderRadius: 10, border: '1px dashed #86EFAC' }}>
                <CheckCircle2 size={32} style={{ color: '#16A34A', margin: '0 auto 8px' }} />
                <div style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>Aucun point de vigilance actif</div>
                <div style={{ fontSize: 11.5, color: '#15803D', marginTop: 2 }}>Tous les livrables progressent selon le planning contractuel nominal.</div>
              </div>
            ) : (
              atRiskDossiers.map(dossier => (
                <div
                  key={dossier.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1.5px solid #FFCC80',
                    background: '#FFFDF9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: '#E65100' }}>{dossier.id}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>• {dossier.brand}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: '#FFEBEE',
                        color: '#C62828',
                        textTransform: 'uppercase',
                      }}
                    >
                      Risque {dossier.risk?.level}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                    {dossier.title}
                  </div>

                  <div style={{ fontSize: 11.5, lineHeight: 1.4, color: '#374151' }} className="space-y-4">
                    {dossier.risk?.cause && (
                      <div>
                        <strong style={{ color: '#E65100' }}>Cause :</strong> {dossier.risk.cause}
                      </div>
                    )}
                    {dossier.risk?.consequence && (
                      <div>
                        <strong style={{ color: '#C62828' }}>Conséquence :</strong> {dossier.risk.consequence}
                      </div>
                    )}
                    {dossier.risk?.decisionDate && (
                      <div>
                        <strong style={{ color: '#1565C0' }}>Date de décision requise :</strong> {dossier.risk.decisionDate}
                      </div>
                    )}
                    {dossier.risk?.recommendedAction && (
                      <div>
                        <strong style={{ color: '#2E7D32' }}>Action recommandée :</strong> {dossier.risk.recommendedAction}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 10, textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => onOpenDossier(dossier)}
                      style={{ fontSize: 11, fontWeight: 800, color: '#E65100' }}
                    >
                      Ouvrir la fiche du dossier →
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Note sur la transparence maîtrisée */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: 11,
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🔒</span>
              <span>
                Conformité : Les dépendances exposent les causes et impacts réels sans dévoiler la planification RH individuelle de l’agence.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. JALONS DE LA SEMAINE & PROCHAINES ÉCHÉANCES ─── */}
      <div
        className="card"
        style={{
          borderRadius: 14,
          padding: '20px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E24AA' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
                Jalons de la semaine (Publications, Remises & Réunions)
              </h3>
              <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0 }}>
                Planning des livrables et des temps forts de la semaine en cours
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => onNavigateTab('calendrier')}
            style={{ fontSize: 11, fontWeight: 800, color: '#8E24AA' }}
          >
            Accéder au calendrier complet →
          </button>
        </div>

        {upcomingMilestones.length === 0 ? (
          <div style={{ padding: '36px 16px', textAlign: 'center', background: '#F9FAFB', borderRadius: 10, border: '1px dashed #E5E7EB' }}>
            <Calendar size={32} style={{ color: '#9CA3AF', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>Aucun jalon planifié pour cette semaine</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>Les futures diffusions et remises s’afficheront ici dès leur programmation.</div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 12,
            }}
          >
            {upcomingMilestones.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  background: '#FAFAFA',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: item.type === 'paid_media' ? '#E3F2FD' : item.type === 'temps_fort_orange' ? '#FFF3E0' : '#F3E5F5',
                        color: item.type === 'paid_media' ? '#1565C0' : item.type === 'temps_fort_orange' ? '#E65100' : '#7B1FA2',
                      }}
                    >
                      {item.network} • {item.type}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#FF7900' }}>
                      {item.date} {item.time ? `à ${item.time}` : ''}
                    </span>
                  </div>

                  <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--dark)', marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                    {item.brand}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 11,
                    paddingTop: 8,
                    borderTop: '1px solid #EEEEEE',
                    color: '#4B5563',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Statut : <strong>{item.status}</strong></span>
                  {item.creator && <span style={{ fontSize: 10, color: 'var(--muted)' }}>👤 {item.creator.split(' ')[0]}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
