import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, Check, RefreshCw } from 'lucide-react';

export default function PhotoUpload({ 
  value = null, 
  onChange, 
  onRemove, 
  name = "Collaborateur",
  size = 80,
  helperText = "Format JPG, PNG ou WebP (max 4 MB)" 
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La taille de l'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLoading(false);
      if (onChange) {
        onChange(e.target.result);
      }
    };
    reader.onerror = () => {
      setLoading(false);
      alert("Erreur lors de la lecture du fichier image.");
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

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map(p => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="iam-photo-uploader" style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Avatar circular preview */}
      <div 
        className="iam-photo-preview-wrap"
        style={{
          width: size,
          height: size,
          cursor: "pointer",
          borderColor: isDragging ? "var(--iam-cyan)" : value ? "var(--iam-orange)" : "var(--iam-border-strong)",
          position: "relative"
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title="Cliquer pour changer la photo"
      >
        {value ? (
          <img 
            src={value} 
            alt={name} 
            className="iam-photo-preview-img" 
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--iam-text-3)" }}>
            <Camera size={size * 0.32} style={{ color: "var(--iam-orange)", opacity: 0.8 }} />
            <span style={{ fontSize: 9, marginTop: 4, fontWeight: 700, color: "var(--iam-text-2)" }}>{initials}</span>
          </div>
        )}

        {/* Hover overlay badge */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10, 14, 39, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.2s",
          borderRadius: "50%"
        }}
        className="photo-hover-overlay"
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
        >
          <Camera size={20} style={{ color: "#fff" }} />
        </div>
      </div>

      {/* Controls & instructions */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--iam-text)", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          Photo d'Identité Biométrique
          {value && (
            <span className="iam-badge iam-badge-active" style={{ fontSize: 10, padding: "2px 8px" }}>
              <Check size={11} style={{ verticalAlign: "-1px" }} /> Photo chargée
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "var(--iam-text-3)", marginBottom: 10 }}>
          {helperText}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="iam-btn iam-btn-sm"
            style={{ fontSize: 12, padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            {value ? <RefreshCw size={13} /> : <Upload size={13} />}
            {value ? "Changer la photo" : "Importer une photo"}
          </button>

          {value && onRemove && (
            <button
              type="button"
              className="iam-btn iam-btn-sm"
              style={{ fontSize: 12, padding: "6px 12px", color: "var(--iam-red)", borderColor: "rgba(255, 77, 94, 0.3)", display: "inline-flex", alignItems: "center", gap: 6 }}
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = "";
                onRemove();
              }}
            >
              <Trash2 size={13} /> Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
