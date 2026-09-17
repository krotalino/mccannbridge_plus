import React from 'react';
import { X, Download, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

export default function PdfViewerModal({ doc = null, onClose }) {
  if (!doc) return null;

  const handleDownload = () => {
    if (!doc.data) return;
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name || 'document_legal.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    if (!doc.data) return;
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${doc.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
  };

  return (
    <div 
      className="iam-pdf-viewer-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="iam-pdf-viewer-modal" role="dialog" aria-modal="true">
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--iam-border)",
          background: "rgba(10, 14, 39, 0.95)",
          flexWrap: "wrap",
          gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "rgba(0, 212, 255, 0.12)",
              color: "var(--iam-cyan)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--iam-text)" }}>
                {doc.title || doc.name || "Visualisation du document légal"}
              </div>
              <div className="iam-mono" style={{ fontSize: 11, color: "var(--iam-text-3)", marginTop: 2 }}>
                {doc.name} {doc.size ? `· ${doc.size}` : ''} {doc.uploadedAt ? `· Déposé le ${doc.uploadedAt}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="iam-badge iam-badge-active" style={{ fontSize: 11 }}>
              <ShieldCheck size={12} style={{ verticalAlign: "-1px" }} /> PDF Intègre & Certifié
            </span>

            <button 
              type="button"
              className="iam-btn iam-btn-sm"
              onClick={handleDownload}
              title="Télécharger le fichier PDF"
            >
              <Download size={14} /> Télécharger
            </button>

            <button 
              type="button"
              className="iam-btn iam-btn-sm"
              onClick={handleOpenNewTab}
              title="Ouvrir dans un nouvel onglet"
            >
              <ExternalLink size={14} /> Nouvel onglet
            </button>

            <button 
              type="button"
              className="iam-btn-ghost iam-btn"
              onClick={onClose}
              style={{ padding: 6, border: "none", background: "none", color: "var(--iam-text-2)" }}
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div style={{ flex: 1, position: "relative", background: "#1c2333" }}>
          {doc.data ? (
            <iframe 
              src={doc.data}
              title={doc.name || "PDF Preview"}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "#ffffff"
              }}
            />
          ) : (
            <div className="iam-empty" style={{ height: "100%", justifyContent: "center" }}>
              <FileText size={48} style={{ color: "var(--iam-text-3)", marginBottom: 12 }} />
              <div>Aucun contenu PDF disponible pour ce document.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
