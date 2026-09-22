import React, { useState } from 'react';
import { CLIENT_AUDIT_LOGS } from '../../../data/clientFinanceData';

export default function ClientReportingAudit({
  auditLogs = CLIENT_AUDIT_LOGS,
  onOpenExport,
}) {
  const [activeReportTab, setActiveReportTab] = useState('exports'); // 'exports' | 'audit' | 'gouvernance'

  const exportTypes = [
    {
      id: 'exp_bvr',
      titre: 'Synthèse Budget vs Réel par Campagne',
      desc: 'Tableau consolidé tous leviers avec écarts, taux d’exécution et projections à fin d’exercice.',
      formats: ['Excel (.xlsx)', 'PDF Certifié', 'CSV'],
      taille: '1.4 Mo',
      frequence: 'Hebdomadaire',
    },
    {
      id: 'exp_postes',
      titre: 'État des Engagements & Dépenses par Poste',
      desc: 'Ventilation poste par poste (Média, Influence, Production, Terrain, CM, Reporting).',
      formats: ['Excel (.xlsx)', 'CSV'],
      taille: '890 Ko',
      frequence: 'Temps réel',
    },
    {
      id: 'exp_factures',
      titre: 'Registre des Factures, Proformas & Échéancier',
      desc: 'Ensemble des pièces de facturation client, statut de lettrage et calendrier des règlements.',
      formats: ['Excel (.xlsx)', 'PDF'],
      taille: '2.1 Mo',
      frequence: 'Mensuelle',
    },
    {
      id: 'exp_avenants',
      titre: 'Historique des Avenants Budgétaires & Justificatifs',
      desc: 'Traçabilité exhaustive des augmentations ou réallocations d’enveloppe approuvées.',
      formats: ['PDF Archive', 'Excel'],
      taille: '3.4 Mo',
      frequence: 'Par événement',
    },
    {
      id: 'exp_rapport_mensuel',
      titre: 'Rapport Mensuel Officiel McCann x Orange Cameroun',
      desc: 'Livrable mensuel complet intégrant les analyses média, ROI, CPA et recommandations stratégiques.',
      formats: ['PDF Exécutif'],
      taille: '6.8 Mo',
      frequence: 'Août 2026 (Disponible)',
      isHighlight: true,
    },
  ];

  return (
    <div className="space-y-16 animate-fade">
      {/* ─── NAVIGATION SOUS-ONGLETS REPORTING & AUDIT ─── */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
        {[
          { id: 'exports', label: '📥 Centre d’Exports & Rapports Périodiques' },
          { id: 'audit', label: '📜 Journal d’Audit & Traçabilité' },
          { id: 'gouvernance', label: '🛡️ Matrice de Gouvernance & Rôles' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveReportTab(tab.id)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              border: activeReportTab === tab.id ? '2px solid #FF7900' : '1px solid #CBD5E1',
              background: activeReportTab === tab.id ? '#FFF8F2' : '#FFFFFF',
              color: activeReportTab === tab.id ? '#D35400' : 'var(--dark)',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── ONGLET 1 : EXPORTS & RAPPORTS TÉLÉCHARGEABLES ─── */}
      {activeReportTab === 'exports' && (
        <div className="space-y-14">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
            {exportTypes.map((exp) => (
              <div
                key={exp.id}
                className="card p-16"
                style={{
                  borderRadius: 12,
                  border: exp.isHighlight ? '2px solid #FF7900' : '1px solid #E2E8F0',
                  background: exp.isHighlight ? '#FFFDFB' : '#FFFFFF',
                  boxShadow: exp.isHighlight ? '0 4px 12px rgba(255, 121, 0, 0.1)' : '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#FF7900' }}>
                      {exp.frequence}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                      Taille : {exp.taille}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 14, fontWeight: 900, color: 'var(--dark)', margin: '0 0 6px 0' }}>
                    {exp.titre}
                  </h3>

                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                    {exp.desc}
                  </p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {exp.formats.map((fmt, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: '#F1F5F9',
                          color: '#475569',
                        }}
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                  <button
                    type="button"
                    onClick={onOpenExport}
                    className="btn btn-sm btn-primary"
                    style={{
                      width: '100%',
                      background: exp.isHighlight ? '#FF7900' : '#1E293B',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span>📥</span> Télécharger le document
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── ONGLET 2 : JOURNAL D'AUDIT & TRAÇABILITÉ ─── */}
      {activeReportTab === 'audit' && (
        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
              JOURNAL DES OPÉRATIONS & HORODATAGE IMMUABLE
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--muted)' }}>
              Historique inaltérable de chaque consultation, validation, signature d'avenant ou accusé de réception.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: 'var(--muted)', fontSize: 11 }}>
                  <th style={{ padding: '8px 12px' }}>HORODATAGE</th>
                  <th style={{ padding: '8px 12px' }}>ACTEUR & RÔLE</th>
                  <th style={{ padding: '8px 12px' }}>ACTION EXÉCUTÉE</th>
                  <th style={{ padding: '8px 12px' }}>DÉTAIL DE L'OPÉRATION</th>
                  <th style={{ padding: '8px 12px' }}>STATUT D'AUDIT</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--dark)' }}>
                      {log.date}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 800 }}>{log.acteur}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{log.role}</div>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#FF7900' }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>
                      {log.detail}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 8,
                          background: '#E8F5E9',
                          color: '#2E7D32',
                        }}
                      >
                        {log.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── ONGLET 3 : MATRICE DE GOUVERNANCE & RÔLES ─── */}
      {activeReportTab === 'gouvernance' && (
        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
              MATRICE DES DROITS & CONFIDENTIALITÉ (Cahier des Charges Page 8)
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--muted)' }}>
              Séparation stricte des privilèges d'approbation et isolation hermétique des données agence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {[
              {
                role: 'Lecteur Orange',
                cible: 'Chefs de produit, Coordinateurs, Auditeurs externes',
                droits: 'Accès au cockpit, budgets, campagnes, documents publiés et prévisions.',
                interdits: 'Ne peut ni valider, ni modifier, ni arbitrer.',
              },
              {
                role: 'Contrôleur de Gestion Orange',
                cible: 'Direction financière Orange Cameroun, Trésorerie',
                droits: 'Détails budgétaires, analyse des écarts, échéanciers, exports comptables.',
                interdits: 'Ne valide pas directement les devis opérationnels.',
              },
              {
                role: 'Valideur Orange',
                cible: 'Directeurs marketing, Chefs de division, Signataires autorisés',
                droits: 'Signature électronique des devis, BC, avenants, proformas et factures.',
                interdits: 'Aucun accès aux marges agence ni feuilles de temps McCann.',
              },
              {
                role: 'Admin Entité Orange',
                cible: 'Administrateurs Plateforme Orange',
                droits: 'Gestion des profils de son entité, paramétrage des seuils d’alerte.',
                interdits: 'Limité strictement au périmètre de son entité.',
              },
            ].map((gov, i) => (
              <div
                key={i}
                style={{
                  background: '#F8FAFC',
                  borderRadius: 10,
                  border: '1px solid #E2E8F0',
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 900, color: '#FF7900', marginBottom: 4 }}>
                  {gov.role}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                  <strong>Profils concernés :</strong> {gov.cible}
                </div>
                <div style={{ fontSize: 11, color: '#166534', marginBottom: 4 }}>
                  <strong>✓ Droits :</strong> {gov.droits}
                </div>
                <div style={{ fontSize: 11, color: '#991B1B' }}>
                  <strong>✕ Restrictions :</strong> {gov.interdits}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
