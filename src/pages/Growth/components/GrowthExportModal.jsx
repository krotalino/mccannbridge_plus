import React, { useState } from 'react';
import { GROWTH_KPIS, GROWTH_EXPERIMENTS, GROWTH_IDEAS, GROWTH_ALERTS } from '../../../data/growth';

export default function GrowthExportModal({
  isOpen,
  onClose,
  activeTab,
  onExport
}) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [scope, setScope] = useState('current');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const tabLabels = {
    cockpit: 'Cockpit Growth & Synthèse LTV/CAC',
    ideas: "Backlog d'Idées & Matrice ICE",
    experiments: 'Rapport Expériences A/B & Significativité',
    funnel: 'Funnel AARRR & Analyse de Rétention',
    alerts: 'Journal des Alertes & Décrochages',
    recommendations: 'Recommandations & Opportunités IA',
    workflows: 'Cartographie des Automatisations & Webhooks',
    knowledge: 'Base de Savoirs & Playbooks Growth',
    connectors: 'Connecteurs & Intégrations Data',
    audit: 'Audit de Conformité & Gouvernance'
  };

  const handleExecuteExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        if (exportFormat === 'csv') {
          // Generate CSV download
          let csvHeaders = ['ID', 'Nom / Titre', 'Stage / Type', 'Statut', 'Métrique / Valeur'];
          let rows = [];

          if (activeTab === 'experiments') {
            csvHeaders = ['ID', 'Nom', 'Stage', 'Statut', 'Métrique', 'Baseline', 'Actuel', 'Cible', 'Significativité'];
            rows = GROWTH_EXPERIMENTS.map(e => [
              e.id,
              `"${e.name.replace(/"/g, '""')}"`,
              e.stage,
              e.status,
              `"${e.metric}"`,
              e.baseline,
              e.current,
              e.target,
              `${e.significance}%`
            ]);
          } else if (activeTab === 'ideas') {
            csvHeaders = ['ID', 'Titre', 'Stage', 'Auteur', 'Statut', 'Score_ICE', 'Votes'];
            rows = GROWTH_IDEAS.map(i => [
              i.id,
              `"${i.title.replace(/"/g, '""')}"`,
              i.stage,
              i.author,
              i.status,
              i.scoreICE.total,
              i.votes
            ]);
          } else {
            // General cockpit KPIs
            rows = GROWTH_KPIS.map(k => [
              k.id,
              `"${k.label}"`,
              'KPI',
              k.trendUp ? 'Croissance' : 'Baisse',
              `"${k.value} (${k.trend})"`
            ]);
          }

          const csvContent = 'data:text/csv;charset=utf-8,' + [csvHeaders.join(','), ...rows.map(r => r.join(','))].join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', `mccann_growth_export_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Print / PDF preview
          window.print();
        }

        if (onExport) {
          onExport({ format: exportFormat, scope, tab: activeTab });
        }
      } catch (err) {
        console.error('Export error:', err);
      } finally {
        setIsExporting(false);
        onClose();
      }
    }, 400);
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
        className="card"
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: 24,
          maxWidth: 520,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E5E7EB',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>📥</span>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
                Exporter le Rapport Growth & Expériences
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
                Génération de livrables exécutifs certifiés McCann × Orange Cameroun
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 8px', fontSize: 16 }}
          >
            ✕
          </button>
        </div>

        {/* Section périmètre */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 6 }}>
            Périmètre d'exportation :
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                background: scope === 'current' ? '#FFF8F2' : '#F9FAFB',
                border: scope === 'current' ? '1px solid #FF7900' : '1px solid #E5E7EB',
                cursor: 'pointer',
                fontSize: 13
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
                <strong>Onglet actif :</strong> {tabLabels[activeTab] || activeTab}
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Données filtrées actuellement affichées à l'écran</div>
              </div>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                background: scope === 'full' ? '#FFF8F2' : '#F9FAFB',
                border: scope === 'full' ? '1px solid #FF7900' : '1px solid #E5E7EB',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              <input
                type="radio"
                name="exportScope"
                value="full"
                checked={scope === 'full'}
                onChange={() => setScope('full')}
                style={{ accentColor: '#FF7900' }}
              />
              <div>
                <strong>Bilan Consolidé 360° :</strong> Cockpit + Expériences + Backlog ICE
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Toutes les métriques de croissance et alertes</div>
              </div>
            </label>
          </div>
        </div>

        {/* Format sélectionné */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 6 }}>
            Format de fichier :
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { id: 'pdf', label: 'PDF Exécutif', icon: '📄', desc: 'Impression & Fiche' },
              { id: 'csv', label: 'Fichier CSV', icon: '📊', desc: 'Excel / Datastudio' },
              { id: 'json', label: 'Données JSON', icon: '💾', desc: 'Flux API' }
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setExportFormat(fmt.id)}
                style={{
                  padding: '10px 8px',
                  borderRadius: 8,
                  textAlign: 'center',
                  background: exportFormat === fmt.id ? '#FFF8F2' : '#F9FAFB',
                  border: exportFormat === fmt.id ? '2px solid #FF7900' : '1px solid #E5E7EB',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: 18 }}>{fmt.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: exportFormat === fmt.id ? '#FF7900' : 'var(--dark)', marginTop: 2 }}>
                  {fmt.label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{fmt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            disabled={isExporting}
            style={{ border: '1px solid #D0D0D0' }}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleExecuteExport}
            disabled={isExporting}
            style={{ background: '#FF7900', color: '#FFF', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {isExporting ? (
              <>
                <span className="spinner-sm" />
                <span>Génération...</span>
              </>
            ) : (
              <>
                <span>📥</span>
                <span>Télécharger le document</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
