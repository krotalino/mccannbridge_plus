import React from 'react';

export default function ClientCampaignBudgetModal({
  campaign,
  onClose,
  formatMoney,
  onOpenDocumentDetail,
}) {
  if (!campaign) return null;

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
          maxWidth: 680,
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 10,
                background: '#FFF0E5',
                color: '#D35400',
              }}
            >
              {campaign.code} • {campaign.entite}
            </span>
            <h3 style={{ fontSize: 17, fontWeight: 900, margin: '4px 0 0 0', color: 'var(--dark)' }}>
              {campaign.nom}
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

        {/* Objectif & KPI */}
        <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 16, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>OBJECTIF STRATÉGIQUE</div>
          <p style={{ margin: '3px 0 6px 0', fontSize: 12, color: 'var(--dark)' }}>{campaign.objectif}</p>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#059669' }}>
            🎯 KPI Clé : {campaign.kpiCle}
          </div>
        </div>

        {/* Grille des montants */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          <div style={{ background: '#F1F5F9', padding: 10, borderRadius: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--muted)', display: 'block' }}>Budget Initial</span>
            <strong style={{ fontSize: 12, color: 'var(--dark)' }}>{formatMoney(campaign.budgetInitial)}</strong>
          </div>
          <div style={{ background: '#EFF6FF', padding: 10, borderRadius: 8 }}>
            <span style={{ fontSize: 10, color: '#2563EB', display: 'block' }}>Avenants</span>
            <strong style={{ fontSize: 12, color: '#2563EB' }}>+{formatMoney(campaign.avenantsMontant)}</strong>
          </div>
          <div style={{ background: '#FFF7ED', padding: 10, borderRadius: 8 }}>
            <span style={{ fontSize: 10, color: '#D97706', display: 'block' }}>Réalisé (Consommé)</span>
            <strong style={{ fontSize: 12, color: '#D97706' }}>{formatMoney(campaign.realise)}</strong>
          </div>
          <div style={{ background: '#ECFDF5', padding: 10, borderRadius: 8 }}>
            <span style={{ fontSize: 10, color: '#059669', display: 'block' }}>Solde Restant</span>
            <strong style={{ fontSize: 12, color: '#059669' }}>{formatMoney(campaign.resteDisponible)}</strong>
          </div>
        </div>

        {/* Historique des avenants (Page 4 du cahier des charges) */}
        <div style={{ marginBottom: 16 }}>
          <h4 style={{ fontSize: 13, fontWeight: 800, margin: '0 0 8px 0', color: 'var(--dark)' }}>
            HISTORIQUE DES AVENANTS BUDGÉTAIRES ({campaign.avenantsHistory?.length || 0})
          </h4>
          {campaign.avenantsHistory && campaign.avenantsHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {campaign.avenantsHistory.map((av) => (
                <div
                  key={av.id}
                  style={{
                    background: '#F8FAFC',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 12,
                  }}
                >
                  <div>
                    <strong style={{ color: '#FF7900' }}>{av.ref}</strong> • {av.date} : {av.objet}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, color: '#2563EB' }}>+{formatMoney(av.montant)}</span>
                    <span style={{ fontSize: 10, color: '#059669', display: 'block' }}>{av.statut}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', background: '#F8FAFC', padding: 10, borderRadius: 6 }}>
              Aucun avenant budgétaire sur cette campagne (budget initial respecté).
            </div>
          )}
        </div>

        {/* Pièces et Référents */}
        <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>
          <div>👨‍💼 Lead de Compte McCann : <strong>{campaign.responsableMcCann}</strong></div>
          <div style={{ marginTop: 2 }}>✍️ Valideur Orange Cameroun : <strong>{campaign.valideurOrange}</strong></div>
          <div style={{ marginTop: 4 }}>
            📑 Documents financiers liés : {(campaign.documentsAssocies || []).join(', ')}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-primary"
            style={{ background: '#FF7900', color: '#FFFFFF', fontWeight: 800 }}
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
}
