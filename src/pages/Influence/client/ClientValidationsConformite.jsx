import React, { useState } from 'react';

export default function ClientValidationsConformite({
  validations = [],
  alerts = [],
  onArbitrateValidation,
  onOpenValidationModal
}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredValidations = validations.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const pendingCount = validations.filter(v => v.status === 'en_attente').length;

  return (
    <div className="space-y-6 animate-fade">
      {/* ─── BANDEAU SUPÉRIEUR DU CENTRE DE VALIDATION ─── */}
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
              <span style={{ fontSize: 20 }}>⚡</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                Centre de Validation Orange & Contrôle de Conformité
              </h3>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: '#FEE2E2',
                  color: '#DC2626'
                }}
              >
                {pendingCount} décision(s) attendue(s)
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Validation formelle des BAT, scripts, shortlists et captions • Checklist de marque en 9 points
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              className="form-control"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ height: 32, fontSize: 11, padding: '0 8px', borderRadius: 6 }}
            >
              <option value="all">Toutes les catégories</option>
              <option value="script_storyboard">Scripts & Storyboards</option>
              <option value="bat_visuel">BAT Visuels & Montages</option>
              <option value="shortlist_casting">Shortlists de Casting</option>
            </select>

            <select
              className="form-control"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ height: 32, fontSize: 11, padding: '0 8px', borderRadius: 6 }}
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente de décision</option>
              <option value="approuve">Approuvés</option>
              <option value="modifications_demandees">Modifications demandées</option>
              <option value="refuse">Refusés</option>
              <option value="reporte">Reportés</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── LISTE DES ÉLÉMENTS SOUMIS À DÉCISION ORANGE ─── */}
      <div className="space-y-4">
        {filteredValidations.map((item) => {
          const isUrgent = item.priority === 'urgente';
          const isPending = item.status === 'en_attente';

          return (
            <div
              key={item.id}
              className="card"
              style={{
                borderRadius: 14,
                padding: '20px',
                background: '#FFFFFF',
                border: isUrgent && isPending ? '2px solid #FF7900' : '1px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                marginBottom: 16
              }}
            >
              {/* Ligne 1 : Badges, Délais et Valideur désigné */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginBottom: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                    {item.categoryLabel}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)' }}>
                    {item.campaignName}
                  </span>
                  {item.talentName && (
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      • Créateur : <strong>{item.talentName}</strong>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: isUrgent ? '#FFF3E8' : '#F1F5F9',
                      color: isUrgent ? '#E65100' : '#475569',
                      border: isUrgent ? '1px solid #FFD8BE' : 'none'
                    }}
                  >
                    ⏳ Échéance : {item.hoursRemaining}h restantes
                  </span>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background:
                        item.status === 'approuve' ? '#DCFCE7' :
                        item.status === 'modifications_demandees' ? '#FEF3C7' :
                        item.status === 'refuse' ? '#FEE2E2' :
                        item.status === 'reporte' ? '#F3E8FF' : '#FFF7ED',
                      color:
                        item.status === 'approuve' ? '#166534' :
                        item.status === 'modifications_demandees' ? '#92400E' :
                        item.status === 'refuse' ? '#991B1B' :
                        item.status === 'reporte' ? '#6B21A8' : '#C2410C'
                    }}
                  >
                    ● {item.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Titre et description de l'élément */}
              <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                {item.title}
              </h4>
              <p style={{ margin: '0 0 12px', fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                {item.description}
              </p>

              {/* Aperçu du contenu ou script */}
              {item.previewContent && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    fontFamily: item.previewType === 'document' ? 'monospace' : 'inherit',
                    fontSize: 11,
                    color: '#334155',
                    whiteSpace: 'pre-wrap',
                    maxHeight: 140,
                    overflowY: 'auto',
                    marginBottom: 12
                  }}
                >
                  {item.previewContent}
                </div>
              )}

              {/* Impact en cas de non-réponse */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  fontSize: 11,
                  color: '#991B1B',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>⚠️</span>
                <span><strong>Impact en cas de retard :</strong> {item.impactNonReponse}</span>
              </div>

              {/* Checklist de Conformité en 9 points (Page 5) */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Vérification Checklist de Conformité (9 points) :
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 6, fontSize: 11 }}>
                  <span style={{ color: item.checklist.logoCharteConforme ? '#16A34A' : '#DC2626' }}>
                    {item.checklist.logoCharteConforme ? '✓' : '✗'} 1. Logo & Charte de marque Orange
                  </span>
                  <span style={{ color: item.checklist.offreConditionsCorrectes ? '#16A34A' : '#DC2626' }}>
                    {item.checklist.offreConditionsCorrectes ? '✓' : '✗'} 2. Exactitude offre & tarifs
                  </span>
                  <span style={{ color: item.checklist.ctaLienVerifies ? '#16A34A' : '#DC2626' }}>
                    {item.checklist.ctaLienVerifies ? '✓' : '✗'} 3. CTA & code redirection vérifiés
                  </span>
                  <span style={{ color: item.checklist.mentionsLegalesIncluses ? '#16A34A' : '#DC2626' }}>
                    {item.checklist.mentionsLegalesIncluses ? '✓' : '✗'} 4. Mention #PartenariatOrange
                  </span>
                  <span style={{ color: item.checklist.droitsMusicauxImagesValides ? '#16A34A' : '#DC2626' }}>
                    {item.checklist.droitsMusicauxImagesValides ? '✓' : '✗'} 5. Droits musicaux & image
                  </span>
                  <span style={{ color: item.checklist.absenceConflitExclusivite ? '#16A34A' : '#DC2626' }}>
                    {item.checklist.absenceConflitExclusivite ? '✓' : '✗'} 6. Absence conflit exclusivité
                  </span>
                  <span style={{ color: item.checklist.dateCanalCoherents ? '#16A34A' : '#DC2626' }}>
                    {item.checklist.dateCanalCoherents ? '✓' : '✗'} 7. Date & canal cohérents
                  </span>
                  <span style={{ color: item.checklist.validationOrangeObtenue ? '#16A34A' : '#EA580C', fontWeight: 700 }}>
                    {item.checklist.validationOrangeObtenue ? '✓ 8. Validé Orange' : '○ 8. Validation requise'}
                  </span>
                  <span style={{ color: item.checklist.publicationConfirmee ? '#16A34A' : '#94A3B8' }}>
                    {item.checklist.publicationConfirmee ? '✓ 9. Publication confirmée' : '○ 9. En attente de diff.'}
                  </span>
                </div>
              </div>

              {/* ─── LES 5 ACTIONS CLIENT ORANGE (PAGE 5 DU CAHIER DES CHARGES) ─── */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  paddingTop: 14,
                  borderTop: '1px solid #F1F5F9'
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  Valideur désigné : <strong>{item.designatedValidator}</strong>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {/* Action 1 : Approuver */}
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => onArbitrateValidation(item.id, 'approuve')}
                    style={{
                      background: '#16A34A',
                      color: '#FFF',
                      fontWeight: 800,
                      borderRadius: 8,
                      border: 'none',
                      padding: '8px 14px'
                    }}
                  >
                    ✓ Approuver
                  </button>

                  {/* Action 2 : Commenter */}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onOpenValidationModal(item, 'commenter')}
                    style={{
                      border: '1px solid #CBD5E1',
                      fontWeight: 700,
                      borderRadius: 8
                    }}
                  >
                    💬 Commenter
                  </button>

                  {/* Action 3 : Demander Modifications */}
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => onOpenValidationModal(item, 'modifier')}
                    style={{
                      background: '#F59E0B',
                      color: '#FFF',
                      fontWeight: 700,
                      borderRadius: 8,
                      border: 'none'
                    }}
                  >
                    ✏️ Demander Modifications
                  </button>

                  {/* Action 4 : Refuser */}
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => onOpenValidationModal(item, 'refuser')}
                    style={{
                      background: '#EF4444',
                      color: '#FFF',
                      fontWeight: 700,
                      borderRadius: 8,
                      border: 'none'
                    }}
                  >
                    ✗ Refuser
                  </button>

                  {/* Action 5 : Reporter la décision */}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onOpenValidationModal(item, 'reporter')}
                    style={{
                      border: '1px solid #CBD5E1',
                      fontWeight: 600,
                      borderRadius: 8,
                      color: '#64748B'
                    }}
                  >
                    ⏱ Reporter
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── REGISTRE DES ALERTES DE CONFORMITÉ (PAGE 5) ─── */}
      <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>🚨</span>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--dark)' }}>
            Registre des Alertes de Conformité & Risques Éditoriaux
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
          {alerts.map((alt) => (
            <div
              key={alt.id}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: alt.severity === 'haute' ? '#FEF2F2' : '#FFFBEB',
                border: `1px solid ${alt.severity === 'haute' ? '#FCA5A5' : '#FCD34D'}`
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: alt.severity === 'haute' ? '#B91C1C' : '#92400E', marginBottom: 4 }}>
                {alt.title}
              </div>
              <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 6 }}>
                <strong>Impact :</strong> {alt.consequence}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FF7900' }}>
                💡 Action : {alt.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
