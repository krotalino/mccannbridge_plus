import React from 'react';
import { CLIENT_FINANCIAL_ACTIONS } from '../../../data/clientFinanceData';

export default function ClientValidationsApprobations({
  actions = CLIENT_FINANCIAL_ACTIONS,
  formatMoney,
  onOpenActionModal,
}) {
  const urgentCount = actions.filter((a) => a.statut === 'urgent').length;
  const totalMontant = actions.reduce((acc, curr) => acc + curr.montant, 0);

  return (
    <div className="space-y-16 animate-fade">
      {/* ─── BANDEAU EXÉCUTIF DU CENTRE DE VALIDATION ─── */}
      <div
        className="card p-16"
        style={{
          borderRadius: 12,
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)',
          border: '1.5px solid #FECACA',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#DC2626',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            ✍️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: '#991B1B', margin: 0 }}>
                MES ACTIONS FINANCIÈRES EN ATTENTE ({actions.length})
              </h2>
              {urgentCount > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: '#DC2626',
                    color: '#FFFFFF',
                  }}
                >
                  {urgentCount} URGENTES
                </span>
              )}
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Validation formelle des devis, avenants, proformas et pièces requises côté Orange Cameroun.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>
            MONTANT TOTAL SOUMIS À APPROBATION
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#991B1B' }}>
            {formatMoney(totalMontant)}
          </div>
        </div>
      </div>

      {/* ─── LISTE DÉTAILLÉE DES ACTIONS FINANCIÈRES ATTENDUES ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {actions.map((act) => {
          const isUrgent = act.statut === 'urgent';
          return (
            <div
              key={act.id}
              className="card p-16"
              style={{
                borderRadius: 12,
                border: isUrgent ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
                background: isUrgent ? '#FFFDFD' : '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 8,
                        background: isUrgent ? '#FEE2E2' : '#F1F5F9',
                        color: isUrgent ? '#991B1B' : '#475569',
                        textTransform: 'uppercase',
                      }}
                    >
                      {isUrgent ? 'Action Prioritaire' : 'Validation Ordinaire'}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#FF7900' }}>
                      {act.campagne}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>• {act.entite}</span>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: '0 0 6px 0' }}>
                    {act.titre}
                  </h3>

                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                    {act.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>MONTANT CONCERNÉ</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#1E293B', marginTop: 2 }}>
                    {formatMoney(act.montant)}
                  </div>
                  <div style={{ fontSize: 11, color: isUrgent ? '#DC2626' : 'var(--muted)', fontWeight: 800, marginTop: 2 }}>
                    Date limite : {act.dateLimite} ({act.delaiRestant})
                  </div>
                </div>
              </div>

              {/* Conséquence de non-réponse (Page 6 du cahier des charges) */}
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px dashed #FECACA',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 11,
                  color: '#991B1B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span>
                  <strong>Conséquence opérationnelle d’une absence de réponse :</strong> {act.consequenceAbsence}
                </span>
              </div>

              {/* Pied de carte avec responsable et actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  👨‍💼 Responsable McCann : <strong>{act.responsableMcCann}</strong>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => onOpenActionModal(act, 'refuser')}
                    className="btn btn-xs"
                    style={{ background: '#F1F5F9', color: '#DC2626', fontWeight: 700, border: '1px solid #CBD5E1' }}
                  >
                    Demander Correction
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenActionModal(act, 'commenter')}
                    className="btn btn-xs"
                    style={{ background: '#F1F5F9', color: '#1E293B', fontWeight: 700, border: '1px solid #CBD5E1' }}
                  >
                    💬 Commenter
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenActionModal(act, 'valider')}
                    className="btn btn-xs"
                    style={{ background: '#FF7900', color: '#FFFFFF', fontWeight: 900, border: 'none', padding: '6px 14px' }}
                  >
                    ✓ Approuver & Signer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
