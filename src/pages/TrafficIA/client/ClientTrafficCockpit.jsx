import React from 'react';
import { CLIENT_PILOTAGE_KPIS } from '../../../data/clientTrafficData';
import { Zap, AlertTriangle, Calendar, CheckCircle2, ArrowRight, Clock, ShieldAlert, Sparkles, FileText, ChevronRight } from 'lucide-react';

export default function ClientTrafficCockpit({
  dossiers = [],
  validations = [],
  recommendations = [],
  calendarItems = [],
  onNavigateTab,
  onOpenValidation,
  onOpenDossier,
  onOpenNewBrief,
}) {
  const pendingValidations = validations.filter(v => v.status === 'en_attente');
  const atRiskDossiers = dossiers.filter(d => d.risk?.level === 'rouge' || d.risk?.level === 'orange');
  const upcomingMilestones = calendarItems.slice(0, 4);

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
                SYNTHÈSE DÉCISIONNELLE S38 EN QUELQUES SECONDES
              </span>
              <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                Directoire Marketing Orange
              </span>
            </div>
            {/* The exact message from Page 2 */}
            <p
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: '#212121',
                margin: '4px 0 8px 0',
                lineHeight: 1.45,
              }}
            >
              « <strong style={{ color: '#FF7900' }}>8 sujets sont actifs</strong> ;{' '}
              <strong style={{ color: '#1E88E5' }}>2 validations Orange sont requises avant vendredi</strong> ;{' '}
              <strong style={{ color: '#E65100' }}>1 échéance présente un risque de décalage</strong> ;{' '}
              <strong style={{ color: '#6A1B9A' }}>3 recommandations sont prêtes à arbitrer</strong>. »
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#555' }}>
              <span>• <strong>Qu’est-ce qui est en cours ?</strong> 8 campagnes & formats en production ou cadrage</span>
              <span>• <strong>Qui le traite ?</strong> Équipes dédiées McCann Douala sous la régulation du Traffic</span>
              <span>• <strong>Qu’attend McCann d’Orange ?</strong> 2 validations sur OM Transfert et Pulse</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. LES 6 CARTES KPI DE PILOTAGE (Page 2 du Cahier des Charges) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {CLIENT_PILOTAGE_KPIS.map(kpi => (
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

              {/* Huge Value with unit */}
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
                  2 validations pour maintenir les calendriers de diffusion
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
            {pendingValidations.map(val => (
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
            ))}
          </div>
        </div>

        {/* Block B: Dépendances & Points de vigilance (Cahier des charges Page 6) */}
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
                background: '#FFEBEE',
                color: '#C62828',
              }}
            >
              1 risque identifié
            </span>
          </div>

          <div className="space-y-12">
            {atRiskDossiers.map(dossier => (
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
                    Risque {dossier.risk.level}
                  </span>
                </div>

                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 6 }}>
                  {dossier.title}
                </div>

                {/* 4 specific fields required by the cahier des charges (Page 6) */}
                <div style={{ fontSize: 11.5, lineHeight: 1.4, color: '#374151' }} className="space-y-4">
                  <div>
                    <strong style={{ color: '#E65100' }}>Cause :</strong> {dossier.risk.cause}
                  </div>
                  <div>
                    <strong style={{ color: '#C62828' }}>Conséquence :</strong> {dossier.risk.consequence}
                  </div>
                  <div>
                    <strong style={{ color: '#1565C0' }}>Date de décision requise :</strong> {dossier.risk.decisionDate}
                  </div>
                  <div>
                    <strong style={{ color: '#2E7D32' }}>Action recommandée :</strong> {dossier.risk.recommendedAction}
                  </div>
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
            ))}

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
                    {item.date} à {item.time}
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
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>👤 {item.creator.split(' ')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
