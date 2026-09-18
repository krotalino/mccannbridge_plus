import React, { useState } from 'react';

export default function InfluenceExportModal({
  isOpen,
  onClose,
  activeTab,
  onExport
}) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [scope, setScope] = useState('current');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExecuteExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        if (onExport) {
          onExport({
            format: exportFormat,
            scope,
            tab: activeTab
          });
        }
      } finally {
        setIsExporting(false);
        onClose();
      }
    }, 400);
  };

  const tabLabels = {
    cockpit: 'Cockpit 360° & Synthèse Globale',
    talents: 'Annuaire Unifié des Talents & Ambassadeurs',
    campagnes: 'Activations & Campagnes Spéciales',
    livrables: 'Registre des Livrables & Circuit de Validation',
    reporting: 'Rapport d’Audience & Performance EMV',
    veille: 'Veille Stratégique & Signaux Concurrentiels',
    import: 'Rapport d’Ingestion du Classeur Excel',
    outils: 'Dossiers Métier & Contrats'
  };

  return (
    <div
      className="modal-backdrop animate-fade"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1150,
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 580,
          width: '92%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 14,
          padding: 0,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          backgroundColor: '#FFFFFF',
          marginBottom: 0
        }}
      >
        {/* Header Style Traffic Manager / Dashboard Analytics */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
            color: '#FFF',
            borderBottom: '3px solid #FF7900'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FF7900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                EXPORTATION ANALYTIQUE CERTIFIÉE
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: '2px 0 0 0', letterSpacing: '-0.3px', color: '#FFFFFF' }}>
                Génération de Fiche Influence Orange & McCann
              </h2>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>
                Rapport exécutif pour comités de marque, bilans de campagne et reporting légal
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFF',
                fontSize: 22,
                cursor: 'pointer',
                opacity: 0.8,
                lineHeight: 1
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Format selection */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
              1. Sélectionnez le Format de Sortie
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div
                onClick={() => setExportFormat('pdf')}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: exportFormat === 'pdf' ? '2px solid #FF7900' : '1px solid #E0E0E0',
                  background: exportFormat === 'pdf' ? '#FFF5EC' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 20 }}>📄</span>
                  {exportFormat === 'pdf' && <span style={{ color: '#FF7900', fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>Fiche PDF</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Charte Orange HD</div>
              </div>

              <div
                onClick={() => setExportFormat('excel')}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: exportFormat === 'excel' ? '2px solid #27AE60' : '1px solid #E0E0E0',
                  background: exportFormat === 'excel' ? '#F2FAF5' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 20 }}>📊</span>
                  {exportFormat === 'excel' && <span style={{ color: '#27AE60', fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>Excel XLSX</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Format 6 Feuilles</div>
              </div>

              <div
                onClick={() => setExportFormat('csv')}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: exportFormat === 'csv' ? '2px solid #2980B9' : '1px solid #E0E0E0',
                  background: exportFormat === 'csv' ? '#F0F7FA' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 20 }}>📑</span>
                  {exportFormat === 'csv' && <span style={{ color: '#2980B9', fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>Fichier CSV</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Données brutes</div>
              </div>
            </div>
          </div>

          {/* Scope selection */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
              2. Périmètre des Données à Inclure
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #E0E0E0',
                  background: scope === 'current' ? '#F9F9FB' : '#FFF',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="scope"
                  checked={scope === 'current'}
                  onChange={() => setScope('current')}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>
                    Vue Actuelle : {tabLabels[activeTab] || 'Section Active'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    Exporte uniquement les données et tableaux filtrés de l'onglet ouvert
                  </div>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #E0E0E0',
                  background: scope === 'all' ? '#F9F9FB' : '#FFF',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="scope"
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>
                    Consolidation Globale 360° Influence
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    Agrège l'ensemble du vivier de créateurs, livrables certifiés, activations et reporting
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid #E5E7EB' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isExporting}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExecuteExport}
              disabled={isExporting}
              style={{ background: '#FF7900', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span>{isExporting ? '⏳' : '📥'}</span>
              <span>{isExporting ? 'Génération en cours...' : 'Télécharger le Rapport Fiche'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
