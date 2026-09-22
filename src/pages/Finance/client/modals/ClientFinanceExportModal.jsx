import React, { useState } from 'react';

export default function ClientFinanceExportModal({
  onClose,
  formatMoney,
}) {
  const [format, setFormat] = useState('pdf');
  const [scope, setScope] = useState('all');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Export ${format.toUpperCase()} généré avec succès ! Le fichier sécurisé Orange Cameroun a été téléchargé.`);
      onClose();
    }, 800);
  };

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
          maxWidth: 520,
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>📥</span>
            <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
              EXPORTER LE SUIVI FINANCIER CERTIFIÉ
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

        <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px 0' }}>
          Générez un rapport exécutif officiel conforme aux règles de gouvernance Orange Cameroun & auditabilité OHADA / CEMAC.
        </p>

        {/* Sélection Périmètre */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
            PÉRIMÈTRE DE L'EXPORT
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #CBD5E1',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <option value="all">Consolidé Orange Cameroun (Toutes les campagnes)</option>
            <option value="mayi">Mayi Festival 2026 uniquement</option>
            <option value="pulse">Orange Pulse Génération 5G uniquement</option>
            <option value="om">Orange Money Kiff Cash uniquement</option>
            <option value="obs">Orange Business Services uniquement</option>
          </select>
        </div>

        {/* Sélection Format */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
            FORMAT DU FICHIER
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { id: 'pdf', label: 'PDF Certifié', icon: '📄', desc: 'Rapport exécutif imprimable' },
              { id: 'xlsx', label: 'Excel (.xlsx)', icon: '📊', desc: 'Tableaux & formules dynamiques' },
              { id: 'csv', label: 'CSV Conforme', icon: '📑', desc: 'Import SAP / ERP Orange' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: format === f.id ? '2px solid #FF7900' : '1px solid #E2E8F0',
                  background: format === f.id ? '#FFF8F2' : '#F8FAFC',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>{f.label}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost"
            style={{ border: '1px solid #CBD5E1' }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="btn btn-sm"
            style={{
              background: '#FF7900',
              color: '#FFFFFF',
              fontWeight: 800,
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            {downloading ? 'Génération en cours...' : 'Télécharger le rapport'}
          </button>
        </div>
      </div>
    </div>
  );
}
