import React, { useState } from 'react';
import { Download } from 'lucide-react';

export default function ExportModal({
  isOpen,
  onClose,
  activeTab,
  filterClient,
  filterPeriod,
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
        onExport({
          format: exportFormat,
          scope,
          tab: activeTab,
          client: filterClient,
          period: filterPeriod
        });
      } finally {
        setIsExporting(false);
        onClose();
      }
    }, 300);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content animate-fade" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 580, width: '92%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 14, padding: 0 }}
      >
        {/* Header Style Traffic Manager */}
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', color: '#FFF', borderBottom: '3px solid #FF7900' }}>
          <div className="flex justify-between items-start">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FF7900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                EXPORTATION ANALYTIQUE CERTIFIÉE
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: '2px 0 0 0', letterSpacing: '-0.3px' }}>
                Génération de Fiche Chartée Orange & McCann
              </h2>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>
                Rapport analytique exécutif pour vos comités de pilotage et bilans de performance
              </div>
            </div>

            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 22, cursor: 'pointer', opacity: 0.8, lineHeight: 1 }}
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
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>Excel (.xlsx)</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Multi-onglets</div>
              </div>

              <div
                onClick={() => setExportFormat('csv')}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: exportFormat === 'csv' ? '2px solid #2980B9' : '1px solid #E0E0E0',
                  background: exportFormat === 'csv' ? '#F0F7FB' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 20 }}>📋</span>
                  {exportFormat === 'csv' && <span style={{ color: '#2980B9', fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>Données CSV</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Format brut UTF-8</div>
              </div>
            </div>
          </div>

          {/* Scope selection */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
              2. Périmètre des Données Incluses
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: scope === 'current' ? '1px solid #FF7900' : '1px solid #E0E0E0',
                  background: scope === 'current' ? '#FFFBF8' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="exportScope"
                  value="current"
                  checked={scope === 'current'}
                  onChange={() => setScope('current')}
                  style={{ accentColor: '#FF7900' }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>
                    Vue active ({activeTab.toUpperCase()})
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    Exporte uniquement les métriques et graphiques du module actuellement affiché
                  </div>
                </div>
              </label>

              <label 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: scope === 'all' ? '1px solid #FF7900' : '1px solid #E0E0E0',
                  background: scope === 'all' ? '#FFFBF8' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="exportScope"
                  value="all"
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                  style={{ accentColor: '#FF7900' }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>
                    Rapport consolidé transverse (Cockpit complet 360°)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    Combine contenus, ads sponsorisées, finances, utilisateurs et influenceurs
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Active parameters */}
          <div style={{ padding: '12px 16px', borderRadius: 8, background: '#F8F9FA', border: '1px solid #E0E0E0', fontSize: 12 }}>
            <div style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🔒</span> Filtres actifs enregistrés dans l’export :
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
              • Client ciblé : <strong style={{ color: 'var(--dark)' }}>{filterClient === 'all' ? 'Tous les clients' : filterClient}</strong><br />
              • Période d’analyse : <strong style={{ color: 'var(--dark)' }}>{filterPeriod}</strong>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '16px 24px', background: '#F8F9FA', borderTop: '1px solid #E0E0E0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: 13, padding: '8px 16px' }}
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExecuteExport}
            className="btn btn-primary"
            style={{ fontSize: 13, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {isExporting ? (
              <span>⏳ Génération...</span>
            ) : (
              <>
                <Download size={14} />
                <span>Télécharger l'Export</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
