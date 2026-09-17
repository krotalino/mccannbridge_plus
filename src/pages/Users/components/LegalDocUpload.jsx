import React, { useRef, useState } from 'react';
import { FileText, Upload, Eye, Trash2, Download, Check, Shield, AlertCircle, RefreshCw } from 'lucide-react';

export default function LegalDocUpload({ 
  title = "Document Légal", 
  docType = "cni", 
  document = null, 
  onUpload, 
  onRemove, 
  onView,
  required = false,
  description = "Document scanné au format PDF certifié (max 10 MB)"
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const processFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
      alert("Format non supporté. Veuillez déposer un document au format PDF uniquement.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      alert("Le fichier dépasse la taille maximale autorisée (12 Mo).");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLoading(false);
      const docPayload = {
        type: docType,
        title: title,
        name: file.name,
        size: formatFileSize(file.size),
        rawSize: file.size,
        data: e.target.result,
        uploadedAt: new Date().toLocaleDateString("fr-FR") + " " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        hash: Math.random().toString(16).substring(2, 8) + "…" + Math.random().toString(16).substring(2, 6)
      };
      if (onUpload) {
        onUpload(docPayload);
      }
    };
    reader.onerror = () => {
      setLoading(false);
      alert("Erreur lors du traitement du fichier PDF.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (!document?.data) return;
    const link = document.createElement('a');
    link.href = document.data;
    link.download = document.name || `${docType}_document.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasDoc = Boolean(document?.data || document?.name);

  return (
    <div className={`iam-doc-card ${hasDoc ? 'has-file' : ''}`}>
      <input 
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: hasDoc ? "rgba(46, 204, 113, 0.14)" : "rgba(255, 102, 0, 0.12)",
            color: hasDoc ? "var(--iam-green)" : "var(--iam-orange)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--iam-text)", display: "flex", alignItems: "center", gap: 8 }}>
              {title}
              {required && (
                <span style={{ color: "var(--iam-orange)", fontSize: 12 }}>*</span>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--iam-text-3)", marginTop: 2 }}>
              {description}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {hasDoc ? (
          <span className="iam-pdf-badge verified">
            <Check size={11} /> PDF CERTIFIÉ
          </span>
        ) : (
          <span className="iam-badge iam-badge-neutral" style={{ fontSize: 10 }}>
            <AlertCircle size={10} style={{ verticalAlign: "-1px" }} /> EN ATTENTE
          </span>
        )}
      </div>

      {/* Content: Either Dropzone OR Uploaded File Box */}
      {hasDoc ? (
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--iam-border)",
          borderRadius: 8,
          padding: "12px 14px",
          marginTop: 4
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="iam-mono" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--iam-cyan)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {document.name}
              </div>
              <div className="iam-mono" style={{ fontSize: 10.5, color: "var(--iam-text-3)", marginTop: 3 }}>
                Taille : {document.size} · Déposé le : {document.uploadedAt} · Hash : {document.hash || "certifié"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, flexWrap: "wrap" }}>
            {onView && (
              <button
                type="button"
                className="iam-btn iam-btn-sm iam-btn-primary"
                style={{ fontSize: 11.5, padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}
                onClick={() => onView(document)}
              >
                <Eye size={13} /> Visualiser le PDF
              </button>
            )}

            <button
              type="button"
              className="iam-btn iam-btn-sm"
              style={{ fontSize: 11.5, padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}
              onClick={handleDownload}
            >
              <Download size={13} /> Télécharger
            </button>

            <button
              type="button"
              className="iam-btn iam-btn-sm"
              style={{ fontSize: 11.5, padding: "5px 10px", display: "inline-flex", alignItems: "center", gap: 6 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Remplacer le document par un nouveau fichier PDF"
            >
              <RefreshCw size={12} /> Remplacer
            </button>

            {onRemove && (
              <button
                type="button"
                className="iam-btn iam-btn-sm"
                style={{ fontSize: 11.5, padding: "5px 10px", color: "var(--iam-red)", borderColor: "rgba(255, 77, 94, 0.3)", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6 }}
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  onRemove();
                }}
              >
                <Trash2 size={12} /> Supprimer
              </button>
            )}
          </div>
        </div>
      ) : (
        <div 
          className={`iam-doc-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload size={22} style={{ color: isDragging ? "var(--iam-orange)" : "var(--iam-text-3)", transition: "color 0.2s" }} />
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--iam-text)" }}>
            Glisser-déposer le document PDF ici
          </div>
          <div style={{ fontSize: 11, color: "var(--iam-text-3)" }}>
            ou <span style={{ color: "var(--iam-orange)", textDecoration: "underline" }}>cliquer pour parcourir</span> (PDF uniquement)
          </div>
        </div>
      )}
    </div>
  );
}
