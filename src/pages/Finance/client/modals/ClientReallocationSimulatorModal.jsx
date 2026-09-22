import React, { useState } from 'react';
import { BUDGET_VS_REEL_POSTES } from '../../../../data/clientFinanceData';

export default function ClientReallocationSimulatorModal({
  onClose,
  formatMoney,
  onApplyArbitrage,
}) {
  const [sourcePoste, setSourcePoste] = useState('p_production'); // Production vidéo sous-consommée
  const [targetPoste, setTargetPoste] = useState('p_influence'); // Influence sous tension
  const [montantTransfert, setMontantTransfert] = useState(3500000); // 3.5 M FCFA
  const [submitted, setSubmitted] = useState(false);

  const sourceObj = BUDGET_VS_REEL_POSTES.find((p) => p.id === sourcePoste) || BUDGET_VS_REEL_POSTES[2];
  const targetObj = BUDGET_VS_REEL_POSTES.find((p) => p.id === targetPoste) || BUDGET_VS_REEL_POSTES[1];

  // Calculs dynamiques de projection
  const projectedImpressions = Math.round((montantTransfert / 1000) * 1200); // ~4.2M impressions
  const projectedConversions = Math.round(montantTransfert / 2200); // ~1,590 conversions
  const estimatedRoasBoost = '+0.32x';

  const handleConfirm = () => {
    setSubmitted(true);
    setTimeout(() => {
      onApplyArbitrage({
        source: sourceObj.poste,
        target: targetObj.poste,
        montant: montantTransfert,
      });
      onClose();
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card p-20 animate-fade"
        style={{
          width: '100%',
          maxWidth: 620,
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🧮</span>
            <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
              SIMULATEUR D’ARBITRAGE & RÉALLOCATION BUDGÉTAIRE
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--muted)' }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 16px 0', lineHeight: 1.45 }}>
          Conformément au cadre contractuel Orange Cameroun (OCM), arbitrez le redéploiement d'économies budgétaires vers les postes à fort retour sur investissement publicitaire (ROAS).
        </p>

        {/* Sélection Source & Cible */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
              1. POSTE SOURCE (ÉCONOMIE / RELIQUAT)
            </label>
            <select
              value={sourcePoste}
              onChange={(e) => setSourcePoste(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {BUDGET_VS_REEL_POSTES.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === targetPoste}>
                  {p.poste} (Dispo: {formatMoney(p.resteDisponible)})
                </option>
              ))}
            </select>
            <div style={{ fontSize: 10, color: '#059669', marginTop: 3 }}>
              Solde disponible : {formatMoney(sourceObj.resteDisponible)}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
              2. POSTE CIBLE (BOOST / PERFORMANCE)
            </label>
            <select
              value={targetPoste}
              onChange={(e) => setTargetPoste(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {BUDGET_VS_REEL_POSTES.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === sourcePoste}>
                  {p.poste} ({p.statut})
                </option>
              ))}
            </select>
            <div style={{ fontSize: 10, color: '#D97706', marginTop: 3 }}>
              Statut actuel : {targetObj.statut}
            </div>
          </div>
        </div>

        {/* Montant du transfert */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
            <span>Montant à réallouer :</span>
            <span style={{ color: '#FF7900', fontSize: 14 }}>{formatMoney(montantTransfert)}</span>
          </div>
          <input
            type="range"
            min={500000}
            max={20000000}
            step={500000}
            value={montantTransfert}
            onChange={(e) => setMontantTransfert(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#FF7900', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
            <span>500 000 FCFA</span>
            <span>10 000 000 FCFA</span>
            <span>20 000 000 FCFA</span>
          </div>
        </div>

        {/* Impact Estimé sur les Métriques Marketing */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
            border: '1.5px solid #BBF7D0',
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: '#166534', marginBottom: 8 }}>
            IMPACT PRÉVISIONNEL SUR LES PERFORMANCES MARKETING (IA PLANNING)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
            <div style={{ background: '#FFFFFF', padding: 8, borderRadius: 6, border: '1px solid #DCFCE7' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Impressions Média</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#059669' }}>
                +{projectedImpressions.toLocaleString()}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', padding: 8, borderRadius: 6, border: '1px solid #DCFCE7' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Conversions Est.</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#2563EB' }}>
                +{projectedConversions.toLocaleString()}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', padding: 8, borderRadius: 6, border: '1px solid #DCFCE7' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Gain ROAS Global</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#D97706' }}>
                {estimatedRoasBoost}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost"
            style={{ border: '1px solid #CBD5E1' }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitted}
            className="btn btn-sm"
            style={{
              background: '#FF7900',
              color: '#FFFFFF',
              fontWeight: 800,
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            {submitted ? 'Transmission à McCann...' : 'Valider la Proposition d’Arbitrage'}
          </button>
        </div>
      </div>
    </div>
  );
}
