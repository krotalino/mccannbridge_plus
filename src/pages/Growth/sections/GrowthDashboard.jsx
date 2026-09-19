import React from 'react';
import { GROWTH_KPIS, GROWTH_EXPERIMENTS, GROWTH_ALERTS, GROWTH_NEXT_ACTIONS } from '../../../data/growth';
import MiniSparkline from '../components/MiniSparkline';

export default function GrowthDashboard({ onNavigate }) {
  const liveExps = GROWTH_EXPERIMENTS.filter(e => e.status === 'running');
  const critAlerts = GROWTH_ALERTS.filter(a => !a.acknowledged && (a.type === 'critical' || a.type === 'warning'));

  const kpiSparklineMap = {
    mrr: [210, 225, 240, 255, 268, 284],
    cac: [24000, 22500, 21000, 19500, 18800, 18200],
    ltv: [3.2, 3.4, 3.6, 3.8, 4.0, 4.2],
    churn: [4.1, 4.0, 3.9, 3.7, 3.6, 3.8],
    activation: [52, 55, 59, 61, 64, 67],
    nps: [62, 65, 66, 68, 70, 72]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* ─── BRIEFING CROISSANCE IA (Style Cockpit Influence) ─── */}
      <div 
        className="card p-16 animate-fade"
        style={{
          background: 'linear-gradient(135deg, #FFF8F2 0%, #FFF3E8 100%)',
          borderRadius: 12,
          border: '1px solid #FFE0B2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#FF7900',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(255,121,0,0.25)',
              flexShrink: 0
            }}
          >
            🚀
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#E65100', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Briefing Growth & Performance AARRR — Semaine 20
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--dark)', marginTop: 2 }}>
              <strong>{liveExps.length} expériences actives</strong> • {critAlerts.length} alertes non traitées • LTV/CAC optimisé à <strong>4.2x (+0.6)</strong> • Opportunité : conversion organique +18% identifiée.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => onNavigate('experiments')}
            className="btn btn-primary btn-sm"
            style={{ background: '#FF7900', color: '#FFF', fontWeight: 700 }}
          >
            Voir les Expériences →
          </button>
        </div>
      </div>

      {/* ─── GRILLE DES 6 CARTES KPI (Style Influence & Dashboard Analytics) ─── */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14
        }}
      >
        {GROWTH_KPIS.map((kpi) => {
          const sparkData = kpiSparklineMap[kpi.id] || [20, 35, 45, 60, 55, 75];
          const isGood = kpi.trendUp;
          const trendColor = isGood ? '#27AE60' : '#E74C3C';
          const trendBg = isGood ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)';

          return (
            <div
              key={kpi.id}
              className="card p-16"
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E0E0E0',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 115
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF7900';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 121, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header: Label + Sparkline */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{kpi.icon}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {kpi.label}
                  </span>
                </div>
                <MiniSparkline data={sparkData} color={trendColor} width={68} height={24} />
              </div>

              {/* Value + Trend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--dark)', letterSpacing: '-0.5px' }}>
                  {kpi.value}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: trendBg,
                    color: trendColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  <span>{kpi.trendUp ? '▲' : '▼'}</span>
                  <span>{kpi.trend}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── EXPÉRIENCES LIVE & ACTIONS RECOMMANDÉES (Style Influence) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16 }}>
        {/* Expériences Live */}
        <div 
          className="card p-16"
          style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🧪</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
                Expériences A/B en Cours
              </h3>
            </div>
            <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 700 }}>
              {liveExps.length} actives
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {liveExps.map((exp) => {
              const sigColor = exp.significance >= 95 ? '#27AE60' : exp.significance >= 85 ? '#F39C12' : '#7F8C8D';
              return (
                <div
                  key={exp.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderLeft: `4px solid ${sigColor}`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>{exp.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                        {exp.stage} • Resp: <strong>{exp.owner}</strong> • {exp.daysLeft}j restants
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: sigColor + '18',
                        color: sigColor,
                        border: `1px solid ${sigColor}40`
                      }}
                    >
                      {exp.significance}% sig.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 14, fontSize: 11.5, marginTop: 6, paddingTop: 6, borderTop: '1px solid #EEF0F2' }}>
                    <div><span style={{ color: 'var(--muted)' }}>Baseline :</span> <strong>{exp.baseline}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>Actuel :</span> <strong style={{ color: '#27AE60' }}>{exp.current}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>Cible :</span> <strong>{exp.target}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onNavigate('experiments')}
            style={{ width: '100%', marginTop: 12, border: '1px solid #E5E7EB', color: '#FF7900', fontWeight: 700 }}
          >
            Accéder au laboratoire d'expériences →
          </button>
        </div>

        {/* Actions Recommandées */}
        <div 
          className="card p-16"
          style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
                Next Best Actions (SLA & Décisions)
              </h3>
            </div>
            <span className="tag tag-blue" style={{ fontSize: 11, fontWeight: 700 }}>
              Priorisées
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {GROWTH_NEXT_ACTIONS.map((act) => {
              const uc = act.urgency === 'critical' ? '#E74C3C' : act.urgency === 'high' ? '#FF7900' : '#2980B9';
              const typeIcon = { decision: '🎯', deploy: '🚀', investigate: '🔍', fix: '🔧', plan: '📋' }[act.type] || '📌';
              return (
                <div
                  key={act.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderLeft: `4px solid ${uc}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--dark)' }}>
                      {typeIcon} {act.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      {act.owner} • Échéance : <strong>{act.dueDate}</strong>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: uc + '15',
                      color: uc,
                      border: `1px solid ${uc}30`,
                      textTransform: 'uppercase'
                    }}
                  >
                    {act.urgency}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onNavigate('ideas')}
            style={{ width: '100%', marginTop: 12, border: '1px solid #E5E7EB', color: '#2980B9', fontWeight: 700 }}
          >
            Consulter le backlog complet d'idées ICE →
          </button>
        </div>
      </div>

      {/* ─── ALERTES CRITIQUES & ANOMALIES SI PRÉSENTES ─── */}
      {critAlerts.length > 0 && (
        <div 
          className="card p-16"
          style={{ background: '#FFF8F2', borderRadius: 12, border: '1px solid #FFD0B3' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: '#C0392B', margin: 0 }}>
                Alertes & Signaux de Vigilance Détectés ({critAlerts.length})
              </h3>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigate('alerts')}
              style={{ color: '#C0392B', fontWeight: 700 }}
            >
              Gérer les alertes →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {critAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid #FADBD8',
                  borderLeft: '4px solid #E74C3C'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                    {alert.type === 'critical' ? '🚨' : '⚠️'} {alert.title}
                  </div>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{alert.timestamp}</span>
                </div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
