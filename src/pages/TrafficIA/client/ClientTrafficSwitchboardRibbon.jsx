import React from 'react';
import { ShieldCheck, ArrowRight, Zap, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function ClientTrafficSwitchboardRibbon({
  dossiers = [],
  validations = [],
  recommendations = [],
  activeTab,
  onSelectTab,
  selectedEntity = 'all',
  lastSyncTime = '15:50',
}) {
  const activeDossiers = dossiers.filter(d => d.clientStatus !== 'livre').length;
  const pendingValidations = validations.filter(v => v.status === 'en_attente').length;
  const atRiskCount = dossiers.filter(d => d.risk?.level === 'rouge' || d.risk?.level === 'orange').length;
  const readyRecommendations = recommendations.filter(r => r.clientDecision === 'a_examiner').length;

  return (
    <div
      className="card mb-20 client-traffic-ribbon animate-fade"
      style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        color: '#FFFFFF',
        borderRadius: 14,
        padding: '18px 24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: 20,
      }}
    >
      {/* Background Animated Light Beam */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 121, 0, 0.18), rgba(39, 174, 96, 0.18), transparent)',
          animation: 'bridgeSweep 6s infinite linear',
          pointerEvents: 'none',
        }}
      />

      {/* Ribbon Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'rgba(255, 121, 0, 0.15)',
              border: '1px solid rgba(255, 121, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            🌉
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.5px' }}>
                THE BRIDGE SWITCHBOARD • VUE CLIENT
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: 'rgba(39, 174, 96, 0.15)',
                  color: '#2ECC71',
                  border: '1px solid rgba(39, 174, 96, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <ShieldCheck size={12} /> Flux Partagé Certifié
              </span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
              Passerelle de régulation et de décision bilatérale : <strong>Orange Cameroun ⇄ McCann Douala</strong> • Synchro {lastSyncTime}
            </div>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Activité en cours</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#FF9D3D' }}>
              {activeDossiers} dossiers actifs
            </div>
          </div>
          {pendingValidations > 0 && (
            <button
              type="button"
              onClick={() => onSelectTab('validations')}
              style={{
                padding: '6px 14px',
                background: 'rgba(255, 121, 0, 0.22)',
                border: '1px solid #FF7900',
                borderRadius: 8,
                color: '#FFB74D',
                fontSize: 12,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Consulter les validations requises"
            >
              <Zap size={14} className="text-orange-400" />
              <span>{pendingValidations} validation(s) Orange attendue(s)</span>
            </button>
          )}
        </div>
      </div>

      {/* The Visual Bridge Switchboard Ribbon Grid */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.38)',
          borderRadius: 12,
          padding: '14px 16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF7900' }}></span>
            <span>ORANGE CAMEROUN (Demandes, Arbitrages & Validations)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>MCCANN DOUALA (Cadrage, Création & Production Média)</span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3498DB' }}></span>
          </div>
        </div>

        {/* 6 Key Operational Nodes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 10,
          }}
        >
          {/* Node 1: Travaux Actifs */}
          <button
            type="button"
            onClick={() => onSelectTab('travaux')}
            style={{
              background: activeTab === 'travaux' ? 'rgba(255, 121, 0, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === 'travaux' ? '1px solid #FF7900' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '10px 12px',
              textAlign: 'left',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16 }}>⚙️</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#FF7900' }}>PORTFOLIO</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>8 Actifs</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>En production agence</div>
          </button>

          {/* Node 2: À Valider Orange */}
          <button
            type="button"
            onClick={() => onSelectTab('validations')}
            style={{
              background: activeTab === 'validations' ? 'rgba(30, 136, 229, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === 'validations' ? '1px solid #1E88E5' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '10px 12px',
              textAlign: 'left',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#64B5F6' }}>ACTION REQUISE</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4, color: '#64B5F6' }}>2 Validations</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Avant vendredi 17h</div>
          </button>

          {/* Node 3: Jalons Semaine */}
          <button
            type="button"
            onClick={() => onSelectTab('calendrier')}
            style={{
              background: activeTab === 'calendrier' ? 'rgba(142, 36, 170, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === 'calendrier' ? '1px solid #8E24AA' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '10px 12px',
              textAlign: 'left',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16 }}>📅</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#BA68C8' }}>PLANNING</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>5 Jalons</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Publications & livraisons</div>
          </button>

          {/* Node 4: Points de vigilance (Risque) */}
          <button
            type="button"
            onClick={() => onSelectTab('cockpit')}
            style={{
              background: atRiskCount > 0 ? 'rgba(230, 81, 0, 0.22)' : 'rgba(255, 255, 255, 0.05)',
              border: atRiskCount > 0 ? '1px solid #FF9800' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '10px 12px',
              textAlign: 'left',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#FFB74D' }}>VIGILANCE</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4, color: '#FFB74D' }}>1 À Risque</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Arbitrage anticipé</div>
          </button>

          {/* Node 5: Recommandations */}
          <button
            type="button"
            onClick={() => onSelectTab('recommandations')}
            style={{
              background: activeTab === 'recommandations' ? 'rgba(106, 27, 154, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === 'recommandations' ? '1px solid #AB47BC' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '10px 12px',
              textAlign: 'left',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#CE93D8' }}>PROACTIVITÉ</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>3 Prêtes</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Propositions digitales</div>
          </button>

          {/* Node 6: Livrables Remis */}
          <button
            type="button"
            onClick={() => onSelectTab('livrables')}
            style={{
              background: activeTab === 'livrables' ? 'rgba(46, 125, 50, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === 'livrables' ? '1px solid #2E7D32' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '10px 12px',
              textAlign: 'left',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16 }}>📁</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#81C784' }}>LIVRABLES</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4, color: '#81C784' }}>14 Remis</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Disponibles au clic</div>
          </button>
        </div>
      </div>
    </div>
  );
}
