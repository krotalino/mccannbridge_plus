import React from 'react';

export default function ClientCockpitInfluence({
  kpis,
  aRetenir,
  campaigns = [],
  alerts = [],
  onNavigateTab,
  onSelectCampaign,
  onSelectValidation
}) {
  const kpiGrid = [
    {
      id: 'talentsActifs',
      title: 'Talents Actifs',
      value: kpis.talentsActifs || 24,
      sub: 'Créateurs & ambassadeurs mobilisés',
      icon: '👥',
      color: '#FF7900',
      tag: 'Vivier Actif',
      trend: '+4 ce mois'
    },
    {
      id: 'activationsEnCours',
      title: 'Activations en Cours',
      value: kpis.activationsEnCours || 6,
      sub: 'Opérations en exécution',
      icon: '🚀',
      color: '#2980B9',
      tag: '3 Entités',
      trend: '100% dans les délais'
    },
    {
      id: 'contenusDiffuses',
      title: 'Contenus Diffusés',
      value: kpis.contenusDiffuses || 48,
      sub: 'Livrables publiés & conformes',
      icon: '📱',
      color: '#27AE60',
      tag: 'BAT Validés',
      trend: '19 Reels • 24 TikToks'
    },
    {
      id: 'porteeCumulee',
      title: 'Portée / Impressions',
      value: kpis.porteeCumulee || '16.4M',
      sub: 'Exposition cumulée certifiée',
      icon: '🌐',
      color: '#8E44AD',
      tag: '+24% vs Q2',
      trend: 'Audience Cameroun & Diaspora'
    },
    {
      id: 'vuesVideo',
      title: 'Vues Vidéo',
      value: kpis.vuesVideo || '8.9M',
      sub: 'Consommation Reels, TikTok, YT',
      icon: '▶️',
      color: '#D35400',
      tag: '68% rétention',
      trend: 'Format court dominant'
    },
    {
      id: 'engagementsCumules',
      title: 'Engagements Cumulés',
      value: kpis.engagementsCumules || '742K',
      sub: 'Réactions, partages, clics, saves',
      icon: '💬',
      color: '#16A085',
      tag: 'Qualitatif',
      trend: 'Partages en forte hausse'
    },
    {
      id: 'tauxEngagement',
      title: 'Taux d’Engagement',
      value: kpis.tauxEngagement || '5.2%',
      sub: 'Qualité relative des interactions',
      icon: '🔥',
      color: '#C0392B',
      tag: 'Bench: 3.8%',
      trend: '+1.4 pt vs marché telco'
    },
    {
      id: 'livrablesAValider',
      title: 'Livrables à Valider',
      value: kpis.livrablesAValider || 7,
      sub: 'En attente décision Orange',
      icon: '⚡',
      color: '#E67E22',
      tag: 'Action Orange',
      trend: '2 sous 24h',
      highlight: true
    },
    {
      id: 'alertesActives',
      title: 'Alertes Prioritaires',
      value: kpis.alertesActives || alerts.length || 3,
      sub: 'Retards, conformité, surperf',
      icon: '⚠️',
      color: '#E74C3C',
      tag: 'À surveiller',
      trend: '1 chevauchement com'
    }
  ];

  return (
    <div className="space-y-6 animate-fade">
      {/* ─── 1. GRILLE DES 9 KPI OFFICIELS (PAGE 2) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 20
        }}
      >
        {kpiGrid.map((kpi) => (
          <div
            key={kpi.id}
            className="card"
            style={{
              padding: '16px 18px',
              borderRadius: 12,
              background: kpi.highlight ? '#FFF9F5' : '#FFFFFF',
              border: kpi.highlight ? '2px solid #FF7900' : '1px solid #E5E7EB',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{kpi.icon}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: 10,
                  background: kpi.highlight ? '#FFE4D0' : '#F1F5F9',
                  color: kpi.highlight ? '#E65100' : '#475569'
                }}
              >
                {kpi.tag}
              </span>
            </div>

            <div style={{ fontSize: 26, fontWeight: 900, color: kpi.highlight ? '#FF7900' : 'var(--dark)', lineHeight: 1.1 }}>
              {kpi.value}
            </div>

            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
              {kpi.title}
            </div>

            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {kpi.sub}
            </div>

            <div
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTop: '1px solid #F1F5F9',
                fontSize: 11,
                fontWeight: 600,
                color: kpi.highlight ? '#E65100' : '#059669'
              }}
            >
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* ─── 2. BLOC « À RETENIR » (PAGE 2 DU CAHIER DES CHARGES) ─── */}
      <div
        className="card"
        style={{
          borderRadius: 16,
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          color: '#FFFFFF',
          marginBottom: 20,
          border: '1px solid rgba(255, 121, 0, 0.3)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📌</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.3px' }}>
                BLOC « À RETENIR » — LES 3 MESSAGES ESSENTIELS
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                Synthèse opérationnelle certifiée pour le Comité de Marque & Direction Orange
              </p>
            </div>
          </div>

          <span
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              background: 'rgba(255, 121, 0, 0.2)',
              border: '1px solid #FF7900',
              color: '#FF9E40',
              fontSize: 11,
              fontWeight: 800
            }}
          >
            SYNTHÈSE S38
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16
          }}
        >
          {/* 1. Meilleure Activation */}
          <div
            style={{
              padding: '16px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(39, 174, 96, 0.2)',
                    color: '#2ECC71'
                  }}
                >
                  {aRetenir.meilleureActivation.badge}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Performance</span>
              </div>

              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>
                {aRetenir.meilleureActivation.title}
              </h4>

              <div style={{ fontSize: 13, fontWeight: 800, color: '#2ECC71', marginBottom: 8 }}>
                {aRetenir.meilleureActivation.metric}
              </div>

              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                {aRetenir.meilleureActivation.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('campagnes')}
              style={{
                marginTop: 14,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {aRetenir.meilleureActivation.actionText} →
            </button>
          </div>

          {/* 2. Décision Orange Requise */}
          <div
            style={{
              padding: '16px',
              borderRadius: 12,
              background: 'rgba(255, 121, 0, 0.12)',
              border: '1px solid rgba(255, 121, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(255, 121, 0, 0.3)',
                    color: '#FF9E40'
                  }}
                >
                  {aRetenir.decisionRequise.badge}
                </span>
                <span style={{ fontSize: 11, color: '#FFB266', fontWeight: 700 }}>
                  {aRetenir.decisionRequise.metric}
                </span>
              </div>

              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>
                {aRetenir.decisionRequise.title}
              </h4>

              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                {aRetenir.decisionRequise.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('validations')}
              style={{
                marginTop: 14,
                padding: '8px 12px',
                borderRadius: 8,
                background: '#FF7900',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(255, 121, 0, 0.4)'
              }}
            >
              ⚡ {aRetenir.decisionRequise.actionText} →
            </button>
          </div>

          {/* 3. Principale Opportunité à Exploiter */}
          <div
            style={{
              padding: '16px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(52, 152, 219, 0.2)',
                    color: '#3498DB'
                  }}
                >
                  {aRetenir.opportuniteExploiter.badge}
                </span>
                <span style={{ fontSize: 11, color: '#85C1E9', fontWeight: 700 }}>
                  {aRetenir.opportuniteExploiter.metric}
                </span>
              </div>

              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>
                {aRetenir.opportuniteExploiter.title}
              </h4>

              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                {aRetenir.opportuniteExploiter.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('veille')}
              style={{
                marginTop: 14,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {aRetenir.opportuniteExploiter.actionText} →
            </button>
          </div>
        </div>
      </div>

      {/* ─── 3. DEUX COLONNES : ACTIVATIONS EN COURS & ALERTES PRIORITAIRES ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20
        }}
      >
        {/* Portefeuille d'activations en direct */}
        <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🗂</span>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
                Activations en Cours d’Exécution
              </h3>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigateTab('campagnes')}
              style={{ fontSize: 11, fontWeight: 700, color: '#FF7900' }}
            >
              Tout voir ({campaigns.length}) →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => onSelectCampaign(camp)}
                style={{
                  padding: '14px',
                  borderRadius: 10,
                  border: '1px solid #F1F5F9',
                  background: '#F8FAFC',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                    {camp.entityLabel}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>
                    {camp.period}
                  </span>
                </div>

                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', marginBottom: 4 }}>
                  {camp.name}
                </div>

                <div style={{ fontSize: 12, color: '#475569', marginBottom: 10 }}>
                  <strong>Livrables :</strong> {camp.publishedCount} diffusés sur {camp.contractualCount} prévus
                </div>

                {/* Barre de progression */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#E2E8F0', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${camp.progressPercent}%`,
                        height: '100%',
                        background: '#FF7900',
                        borderRadius: 3
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#FF7900' }}>
                    {camp.progressPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registre des Alertes Opérationnelles */}
        <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
                Registre des Alertes & Vigilances
              </h3>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigateTab('validations')}
              style={{ fontSize: 11, fontWeight: 700, color: '#E74C3C' }}
            >
              Centre d'alertes ({alerts.length}) →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.map((alt) => {
              const isHigh = alt.severity === 'haute';
              return (
                <div
                  key={alt.id}
                  style={{
                    padding: '14px',
                    borderRadius: 10,
                    borderLeft: `4px solid ${isHigh ? '#E74C3C' : '#F39C12'}`,
                    background: isHigh ? '#FEF2F2' : '#FFFBEB',
                    borderTop: '1px solid #F1F5F9',
                    borderRight: '1px solid #F1F5F9',
                    borderBottom: '1px solid #F1F5F9'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: isHigh ? '#B91C1C' : '#B45309'
                      }}
                    >
                      {alt.type.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{alt.date}</span>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>
                    {alt.title}
                  </div>

                  <div style={{ fontSize: 12, color: '#4B5563', marginBottom: 6 }}>
                    <strong>Conséquence :</strong> {alt.consequence}
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 600, color: isHigh ? '#DC2626' : '#D97706' }}>
                    💡 <strong>Action recommandée :</strong> {alt.recommendedAction}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
