import React from 'react';

export default function ClientCampaignDetailModal({ campaign, onClose, onNavigateTab }) {
  if (!campaign) return null;

  const entityLabel = campaign.entityLabel || campaign.entity || campaign.source_sheet || 'Orange Cameroun';
  const period = campaign.period || 'Campagne en cours';
  const businessObjective = campaign.businessObjective || campaign.objective || campaign.description || 'Notoriété, acquisition et engagement de marque';
  const commObjective = campaign.commObjective || campaign.objective || 'Mise en avant des services et offres Orange';
  const targetAudience = campaign.targetAudience || 'Grand public Cameroun, cibles jeunes & digitales';
  const keyMessage = campaign.keyMessage || 'Orange vous rapproche de l’essentiel';
  const mandatoryMentions = campaign.mandatoryMentions || '#OrangeCameroun #Partenariat';

  const talentsList = Array.isArray(campaign.selectedTalents) && campaign.selectedTalents.length > 0
    ? campaign.selectedTalents
    : (Array.isArray(campaign.talentNames) && campaign.talentNames.length > 0
        ? campaign.talentNames.map(name => ({ name, role: 'Créateur sélectionné' }))
        : []);

  const kpiReal = campaign.kpiReal || {
    views: campaign.views ? Number(campaign.views).toLocaleString('fr-FR') : (campaign.vues ? Number(campaign.vues).toLocaleString('fr-FR') : '—'),
    engagementRate: campaign.engagementRate || '3.5%',
    appInstalls: campaign.conversions || '—'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        className="card animate-fade"
        style={{
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 16,
          background: '#FFFFFF',
          padding: 24,
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            color: 'var(--muted)'
          }}
        >
          ✕
        </button>

        <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
              {entityLabel}
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>
              📅 {period}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 12,
                background: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0'
              }}
            >
              ● {campaign.status || 'Active'}
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--dark)' }}>
            {campaign.name}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Objectifs */}
          <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 12, marginBottom: 6 }}>
              <strong>Objectif Business :</strong> {businessObjective}
            </div>
            <div style={{ fontSize: 12 }}>
              <strong>Objectif Com :</strong> {commObjective}
            </div>
          </div>

          {/* Cibles & Messages */}
          <div style={{ padding: '12px 14px', borderRadius: 8, background: '#FFF9F5', border: '1px solid #FFE4D0' }}>
            <div style={{ fontSize: 12, marginBottom: 6 }}>
              <strong>Audience Ciblée :</strong> {targetAudience}
            </div>
            <div style={{ fontSize: 12, marginBottom: 6 }}>
              <strong>Message Clé :</strong> « {keyMessage} »
            </div>
            <div style={{ fontSize: 11, color: '#64748B' }}>
              <strong>Mentions Obligatoires :</strong> {mandatoryMentions}
            </div>
          </div>

          {/* Talents */}
          <div>
            <h5 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
              Talents mobilisés {talentsList.length > 0 ? `(${talentsList.length})` : ''} :
            </h5>
            {talentsList.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', padding: '6px 0' }}>
                Aucun talent spécifié pour ce dispositif.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                {talentsList.map((t, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', borderRadius: 6, background: '#F1F5F9', fontSize: 11 }}>
                    <strong>{t.name}</strong> • {t.role || 'Créateur sélectionné'}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KPI */}
          <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <h5 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
              Performance Réelle vs Objectifs Cibles :
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center', fontSize: 11 }}>
              <div>
                <div style={{ color: 'var(--muted)' }}>Vues Réelles</div>
                <div style={{ fontWeight: 800, color: '#059669', fontSize: 13 }}>{kpiReal.views || '—'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)' }}>Taux d'Engagement</div>
                <div style={{ fontWeight: 800, color: '#059669', fontSize: 13 }}>{kpiReal.engagementRate || '—'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)' }}>Conversions / App</div>
                <div style={{ fontWeight: 800, color: '#059669', fontSize: 13 }}>{kpiReal.appInstalls || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              onClose();
              if (onNavigateTab) onNavigateTab('calendrier');
            }}
            style={{ fontWeight: 700 }}
          >
            📅 Voir les Livrables dans le Calendrier
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ fontWeight: 700 }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
