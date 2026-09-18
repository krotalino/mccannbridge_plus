import React, { useState } from 'react';
import { formatNumber, Badge } from './InfluenceCommon';

export default function ImportExcel({ data, onRunImport, onResetImport }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importReport, setImportReport] = useState(null);

  const lastBatch = (data.batches || [])[0];

  const handleLaunchImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = onRunImport({ importedBy: 'Administrateur Influence' });
      setImportReport(res);
      setIsProcessing(false);
    }, 600);
  };

  const sheetsConfig = [
    { name: 'INFLUENCEURS', role: 'Vivier créateurs & fiches profils', rows: 25, status: 'Prêt' },
    { name: 'Orange Weekend', role: 'Publications, métriques & URLs', rows: 75, status: 'Prêt' },
    { name: "O'Ambassadeurs", role: 'Annuaire ambassadeurs Orange', rows: 85, status: 'Prêt' },
    { name: "O'Ambassadeurs (2)", role: 'Mises à jour & compléments', rows: 45, status: 'Prêt' },
    { name: 'ADMINS O Ambassadeurs', role: 'Chefs de groupe & encadrement', rows: 6, status: 'Prêt' },
    { name: 'WEBZINES', role: 'Médias digitaux & relais presse', rows: 6, status: 'Prêt' }
  ];

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* En-tête & Notice Style Dashboard Analytics */}
      <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0, letterSpacing: '-0.3px' }}>
                INGESTION & SYNCHRONISATION DU CLASSEUR EXCEL
              </h2>
              {lastBatch && (
                <span className="tag tag-green" style={{ fontSize: 11, fontWeight: 800 }}>
                  ✓ Synchronisé le {new Date(lastBatch.imported_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Source officielle : <strong>Fichier-Reporting-Influence_5734.xlsx</strong> (6 onglets métier connectés)
            </p>
          </div>

          {onResetImport && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onResetImport}
              style={{ border: '1px solid #D0D0D0', fontSize: 11 }}
            >
              ↺ Réinitialiser l'annuaire
            </button>
          )}
        </div>

        <div style={{ padding: '12px 16px', background: '#FFF8F2', borderRadius: 8, borderLeft: '4px solid #FF7900', fontSize: 12, color: 'var(--dark)', marginBottom: 16 }}>
          Ce module ingère le classeur institutionnel <strong>Fichier-Reporting-Influence_5734.xlsx</strong>, réconcilie
          les feuilles d'annuaire et de publications, identifie les doublons potentiels sans écrasement destructif, et
          alimente le Cockpit 360° en continu.
        </div>

        {/* Étapes du processus */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 18 }}>
          <div style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#FAFAFC', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#27AE60', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>✓</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)' }}>1. Fichier Source</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Format XLSX certifié</div>
            </div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#FAFAFC', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#27AE60', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>✓</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)' }}>2. 6 Feuilles Mappées</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Extraction structurée</div>
            </div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#FAFAFC', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#27AE60', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>✓</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)' }}>3. Déduplication</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Arbitrage assisté</div>
            </div>
          </div>
        </div>

        {/* Dropzone d'importation */}
        <div
          onClick={handleLaunchImport}
          style={{
            padding: '30px 20px',
            borderRadius: 12,
            border: '2px dashed #FF7900',
            background: '#FFF8F2',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--dark)', marginBottom: 4 }}>
            Fichier cible : Fichier-Reporting-Influence_5734.xlsx
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
            Cliquez pour lancer la réindexation et le traitement automatique des 6 feuilles
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              handleLaunchImport();
            }}
            style={{ background: '#FF7900', color: '#FFF', padding: '10px 22px', fontSize: 13 }}
          >
            {isProcessing ? 'Traitement et indexation...' : '⚡ Lancer le traitement des données'}
          </button>
        </div>

        {/* Compte-rendu après traitement */}
        {importReport && (
          <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 8, background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div style={{ fontWeight: 800, color: '#166534', fontSize: 13, marginBottom: 4 }}>
              ✓ Traitement achevé avec succès
            </div>
            <div style={{ fontSize: 12, color: '#15803D' }}>
              {importReport.talentsCount} talents synchronisés • {importReport.deliverablesCount} livrables consolidés • {importReport.issuesCount} alertes détectées.
            </div>
          </div>
        )}
      </div>

      {/* Tableau des feuilles incluses */}
      <div className="card p-0" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', background: '#F8F9FA', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', margin: 0 }}>
            FEUILLES EXCEL ANALYSÉES DANS LE CLASSEUR
          </h3>
          <span className="tag tag-orange" style={{ fontSize: 11 }}>
            6 Feuilles Détectées
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Feuille</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Rôle Métier & Description</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Lignes Détectées</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Statut Traitement</th>
              </tr>
            </thead>
            <tbody>
              {sheetsConfig.map((s, idx) => (
                <tr
                  key={s.name}
                  style={{
                    borderBottom: '1px solid #F0F0F0',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC'
                  }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--dark)' }}>
                    📄 {s.name}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>
                    {s.role}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                    ~{s.rows} entrées
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="tag tag-green" style={{ fontSize: 10 }}>
                      ✓ {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
