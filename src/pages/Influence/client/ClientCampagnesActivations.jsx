import React from 'react';

export default function ClientCampagnesActivations({
  campaigns = [],
  onSelectCampaign,
  onNavigateTab,
  selectedEntity = 'all'
}) {
  const filteredCampaigns = selectedEntity === 'all'
    ? campaigns
    : campaigns.filter(c => c.entity === selectedEntity);

  return (
    <div className="space-y-6 animate-fade">
      {/* ─── EN-TÊTE DU PORTEFEUILLE DES CAMPAGNES ─── */}
      <div
        className="card"
        style={{
          borderRadius: 14,
          padding: '16px 20px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🗂</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                Portefeuille des Campagnes & Activations Influence
              </h3>
              <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                {filteredCampaigns.length} opération(s) active(s)
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Vision unifiée : qui publie quoi, pour quelle campagne, avec quel statut et quel ROI
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('calendrier')}
              style={{
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>📅</span> Voir le Calendrier Global
            </button>
          </div>
        </div>
      </div>

      {/* ─── LISTE DÉTAILLÉE DES CAMPAGNES ─── */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div
            className="card"
            style={{
              borderRadius: 14,
              padding: '40px 20px',
              background: '#FFFFFF',
              border: '1px dashed #CBD5E1',
              textAlign: 'center',
              color: 'var(--muted)'
            }}
          >
            <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>🗂</span>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
              Aucune campagne en cours enregistrée
            </h4>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Seules les campagnes nouvellement enregistrées apparaîtront ici.
            </p>
          </div>
        ) : (
          filteredCampaigns.map((camp) => {
            const entityLabel = camp.entityLabel || camp.entity || camp.source_sheet || 'Orange Cameroun';
            const statusLabel = camp.statusLabel || camp.status || 'Active';
            const talentsList = Array.isArray(camp.selectedTalents)
              ? camp.selectedTalents
              : (Array.isArray(camp.talentNames) ? camp.talentNames.map(n => ({ name: n, role: 'Créateur sélectionné' })) : []);
            const budgetVal = camp.budgetEnveloppe || camp.budget || '';

            return (
              <div
                key={camp.id}
                className="card"
                style={{
                  borderRadius: 14,
                  padding: '20px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  marginBottom: 16
                }}
              >
                {/* Ligne 1 : Nom, Entité, Période, Statut */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 12,
                    paddingBottom: 14,
                    borderBottom: '1px solid #F1F5F9',
                    marginBottom: 14
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                        {entityLabel}
                      </span>
                      {camp.period && (
                        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                          📅 {camp.period}
                        </span>
                      )}
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
                        ● {statusLabel}
                      </span>
                    </div>

                    <h4 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--dark)' }}>
                      {camp.name}
                    </h4>
                  </div>

                  {/* Enveloppe budgétaire validée */}
                  {budgetVal && (
                    <div
                      style={{
                        textAlign: 'right',
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                        Enveloppe Globale
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                        {budgetVal}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ligne 2 : Objectifs Business & Communication */}
                {(camp.businessObjective || camp.commObjective || camp.objective || camp.description) && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: 14,
                      marginBottom: 14
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: 8,
                        background: '#F8FAFC',
                        border: '1px solid #F1F5F9'
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>
                        🎯 Objectif Principal :
                      </div>
                      <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                        {camp.businessObjective || camp.objective || camp.description || 'Notoriété et engagement'}
                      </div>
                    </div>

                    {camp.commObjective && (
                      <div
                        style={{
                          padding: '12px 14px',
                          borderRadius: 8,
                          background: '#F8FAFC',
                          border: '1px solid #F1F5F9'
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>
                          📢 Objectif Communication :
                        </div>
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                          {camp.commObjective}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Ligne 3 : Message Clé, CTA & Mentions Obligatoires */}
                {(camp.keyMessage || camp.cta || camp.mandatoryMentions) && (
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: '#FFF9F5',
                      border: '1px solid #FFE4D0',
                      marginBottom: 14
                    }}
                  >
                    {camp.keyMessage && (
                      <div style={{ fontSize: 12, color: '#334155', marginBottom: 6 }}>
                        <strong>Message Clé :</strong> « {camp.keyMessage} »
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: '#64748B', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      {camp.cta && <span><strong>CTA :</strong> {camp.cta}</span>}
                      {camp.mandatoryMentions && <span><strong>Mentions :</strong> {camp.mandatoryMentions}</span>}
                    </div>
                  </div>
                )}

                {/* Ligne 4 : Talents mobilisés & rôles */}
                {talentsList.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                      Talents sélectionnés & Rôles dans la campagne ({talentsList.length}) :
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
                      {talentsList.map((t, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '8px 10px',
                            borderRadius: 6,
                            background: '#F1F5F9',
                            fontSize: 11,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <span style={{ fontWeight: 800, color: '#1E293B' }}>{t.name}</span>
                          <span style={{ color: 'var(--muted)' }}>•</span>
                          <span style={{ color: '#475569' }}>{t.role || 'Créateur actif'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ligne 5 : Progression des Livrables & Action */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 12,
                    borderTop: '1px solid #F1F5F9',
                    flexWrap: 'wrap',
                    gap: 12
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    Statut du dispositif : <strong style={{ color: 'var(--dark)' }}>{statusLabel}</strong>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectCampaign(camp)}
                      style={{
                        fontWeight: 700,
                        fontSize: 11,
                        background: '#FFF3E8',
                        color: '#E65100',
                        border: '1px solid #FFD8BE'
                      }}
                    >
                      Détails de la Campagne →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
