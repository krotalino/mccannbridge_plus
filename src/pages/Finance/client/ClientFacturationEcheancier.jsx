import React, { useState } from 'react';
import { CLIENT_PIPELINE_DOSSIERS } from '../../../data/clientFinanceData';

export default function ClientFacturationEcheancier({
  dossiers = CLIENT_PIPELINE_DOSSIERS,
  formatMoney,
  onOpenDocumentDetail,
}) {
  const [activePipelineFilter, setActivePipelineFilter] = useState('all');

  const pipelineStages = [
    { num: 1, label: '1. Devis Initial', desc: 'Proposition tarifée & gel budgétaire' },
    { num: 2, label: '2. Avenant', desc: 'Ajustement périmètre ou enveloppe' },
    { num: 3, label: '3. Proforma', desc: 'Pré-validation avant facture finale' },
    { num: 4, label: '4. Facture Finale', desc: 'Émise pour paiement contractuel' },
    { num: 5, label: '5. Encaissement', desc: 'Règlement lettré & rapproché' },
  ];

  const filteredDossiers = dossiers.filter((d) => {
    if (activePipelineFilter === 'all') return true;
    return d.currentStage === parseInt(activePipelineFilter, 10);
  });

  return (
    <div className="space-y-20 animate-fade">
      {/* ─── BANDEAU INDICATEUR DSO DIPLOMATIQUE & SYNTHÈSE PIPELINE ─── */}
      <div
        className="card p-16"
        style={{
          borderRadius: 12,
          background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
          border: '1px solid #E2E8F0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
            DÉLAI MOYEN DE RÈGLEMENT (DSO CLIENT)
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#059669', marginTop: 4 }}>
            34 Jours
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Indicateur diplomatique : Fluidité optimale des règlements Orange
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
            EN COURS DE FACTURATION
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#2563EB', marginTop: 4 }}>
            {formatMoney(75369000)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Proformas en cours d'approbation préalable
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
            FACTURES EN ATTENTE D'ÉCHÉANCE
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#D97706', marginTop: 4 }}>
            {formatMoney(26235000)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Échéance sous 4 jours (FC-2026-0088)
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
            TOTAL RÈGLEMENTS RAPPROCHÉS
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#059669', marginTop: 4 }}>
            {formatMoney(334915000)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Quittances et reçus bancaires archivés
          </div>
        </div>
      </div>

      {/* ─── VISUALISATION DU PIPELINE EN 5 JALONS (Cahier des Charges Page 5) ─── */}
      <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
            PARCOURS DE FACTURATION EN 5 JALONS NORMALISÉS
          </h3>
          <p style={{ margin: '3px 0 0 0', fontSize: 11, color: 'var(--muted)' }}>
            Traçabilité contractuelle rigoureuse de la proposition tarifée jusqu'au lettrage bancaire final.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {pipelineStages.map((stg, idx) => {
            const isFilterActive = activePipelineFilter === String(idx);
            return (
              <button
                key={stg.num}
                type="button"
                onClick={() => setActivePipelineFilter(isFilterActive ? 'all' : String(idx))}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: 12,
                  borderRadius: 10,
                  border: isFilterActive ? '2px solid #FF7900' : '1px solid #E2E8F0',
                  background: isFilterActive ? '#FFF8F2' : '#F8FAFC',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#FF7900' }}>JALON {stg.num}</span>
                  <span style={{ fontSize: 12 }}>
                    {idx === 0 ? '📝' : idx === 1 ? '🔄' : idx === 2 ? '📋' : idx === 3 ? '🧾' : '🏦'}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
                  {stg.label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                  {stg.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── DOSSIERS DE FACTURATION CLIENT & PROGRESSION ─── */}
      <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
            DOSSIERS FINANCIERS PAR CAMPAGNE ({filteredDossiers.length})
          </h3>
          {activePipelineFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setActivePipelineFilter('all')}
              className="btn btn-xs btn-ghost"
              style={{ color: '#FF7900', fontWeight: 700 }}
            >
              Afficher tous les dossiers
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredDossiers.map((dos) => (
            <div
              key={dos.id}
              style={{
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* Entête du dossier */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#FF7900' }}>{dos.reference}</span>
                    <strong style={{ fontSize: 14, color: 'var(--dark)' }}>{dos.titre}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    Client : {dos.client} • Campagne : {dos.campagne}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 10,
                      background: dos.currentStage === 4 ? '#E8F5E9' : '#FEF3C7',
                      color: dos.currentStage === 4 ? '#2E7D32' : '#B45309',
                    }}
                  >
                    Étape : {pipelineStages[dos.currentStage].label}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 6px',
                      borderRadius: 6,
                      background: '#F1F5F9',
                      color: 'var(--muted)',
                    }}
                  >
                    Risque : {dos.risqueRetard}
                  </span>
                </div>
              </div>

              {/* Barre de progression des 5 étapes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {pipelineStages.map((stg, i) => {
                  const isPassed = i <= dos.currentStage;
                  const isCurrent = i === dos.currentStage;
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        background: isCurrent ? '#FFF0E5' : isPassed ? '#F0FDF4' : '#F8FAFC',
                        border: isCurrent ? '1.5px solid #FF7900' : isPassed ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                        fontSize: 10,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: isCurrent ? '#D35400' : isPassed ? '#166534' : 'var(--muted)' }}>
                        {isPassed && !isCurrent ? '✓ ' : ''}{stg.label.split('. ')[1]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Détails financiers par jalon */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, background: '#F8FAFC', padding: 10, borderRadius: 8 }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', display: 'block' }}>1. Devis Initial</span>
                  <strong style={{ fontSize: 11, color: 'var(--dark)' }}>{formatMoney(dos.devis.montantTTC)}</strong>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Réf: {dos.devis.ref}</div>
                </div>

                <div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', display: 'block' }}>2. Avenant</span>
                  <strong style={{ fontSize: 11, color: dos.avenant.montantTTC > 0 ? '#2563EB' : 'var(--muted)' }}>
                    {dos.avenant.montantTTC > 0 ? `+${formatMoney(dos.avenant.montantTTC)}` : 'Non requis'}
                  </strong>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Réf: {dos.avenant.ref}</div>
                </div>

                <div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', display: 'block' }}>3. Proforma</span>
                  <strong style={{ fontSize: 11, color: '#D97706' }}>
                    {dos.proforma ? formatMoney(dos.proforma.montantTTC) : '—'}
                  </strong>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Réf: {dos.proforma ? dos.proforma.ref : '—'}</div>
                </div>

                <div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', display: 'block' }}>4. Facture Finale</span>
                  <strong style={{ fontSize: 11, color: '#1E293B' }}>
                    {dos.facture ? formatMoney(dos.facture.montantTTC) : '—'}
                  </strong>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Réf: {dos.facture ? dos.facture.ref : '—'}</div>
                </div>

                <div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', display: 'block' }}>Prochain Acteur</span>
                  <strong style={{ fontSize: 11, color: '#FF7900' }}>{dos.prochainActeur}</strong>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Échéance: {dos.echeanceProchaine}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ÉCHÉANCIER PRÉVISIONNEL À 30 / 60 / 90 JOURS ─── */}
      <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        <h3 style={{ fontSize: 14, fontWeight: 900, margin: '0 0 12px 0', color: 'var(--dark)' }}>
          CALENDRIER DES ÉCHÉANCES & PRÉVISIONS DE FACTURATION (Q3 / Q4 2026)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {[
            {
              periode: 'Sous 30 Jours (Fin Septembre 2026)',
              factures: 'Facture FC-2026-0088 + Proforma PRF-2026-0092',
              montantAttendu: 101604000,
              statut: 'Très actif',
              badgeColor: '#E65100',
            },
            {
              periode: 'À 60 Jours (Octobre 2026)',
              factures: 'Factures clôture Mayi Phase 2 + Pulse T3',
              montantAttendu: 148500000,
              statut: 'En préparation',
              badgeColor: '#1976D2',
            },
            {
              periode: 'À 90 Jours (Novembre 2026)',
              factures: 'Lancement campagnes fin d’année & Noël',
              montantAttendu: 185000000,
              statut: 'Prévisionnel',
              badgeColor: '#00796B',
            },
          ].map((ech, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                padding: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>{ech.periode}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 6,
                    background: ech.badgeColor,
                    color: '#FFFFFF',
                  }}
                >
                  {ech.statut}
                </span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#1E293B', marginBottom: 4 }}>
                {formatMoney(ech.montantAttendu)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                {ech.factures}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
