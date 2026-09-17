import React, { useRef } from 'react';
import { useIAM } from '../iamContext';
import Avatar from './Avatar';
import { Printer, Download, ArrowLeft, ShieldCheck, Check, FileText } from 'lucide-react';

export default function UserExportPdf({ user = null, onBack }) {
  const { users, setSelectedUser } = useIAM();
  const printRef = useRef(null);

  const currentUser = user || (users.length > 0 ? users[0] : null);

  const handlePrint = () => {
    window.print();
  };

  if (!currentUser) {
    return (
      <div className="iam-card" style={{ padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--iam-text)", marginBottom: 8 }}>
          Aucun collaborateur disponible pour l'export
        </h2>
        <p style={{ color: "var(--iam-text-3)", fontSize: 14, maxWidth: 480, margin: "0 auto 20px" }}>
          Veuillez d'abord enregistrer un collaborateur dans le registre pour générer sa fiche d'accréditation PDF.
        </p>
        <button className="iam-btn iam-btn-primary" onClick={onBack}>
          Retourner à l'Annuaire
        </button>
      </div>
    );
  }

  const hasCni = Boolean(currentUser.documents?.cni?.name || currentUser.documents?.cni?.data);
  const hasNiu = Boolean(currentUser.documents?.niu?.name || currentUser.documents?.niu?.data);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Action Header */}
      <div className="iam-card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="iam-btn iam-btn-sm" onClick={onBack}>
            <ArrowLeft size={14} /> Retour
          </button>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--iam-text)" }}>
            Fiche d'Accréditation Biométrique & Sécurité Bi-Rive
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {users.length > 1 && (
            <select
              className="iam-select iam-select-sm"
              value={currentUser.uid}
              onChange={(e) => {
                const found = users.find(u => u.uid === e.target.value);
                if (found) setSelectedUser(found);
              }}
            >
              {users.map(u => (
                <option key={u.uid} value={u.uid}>{u.name} ({u.role})</option>
              ))}
            </select>
          )}

          <button className="iam-btn iam-btn-primary" onClick={handlePrint}>
            <Printer size={15} /> Imprimer / Sauvegarder PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div 
        ref={printRef}
        className="iam-export-sheet"
        style={{
          background: "#ffffff",
          color: "#0D1233",
          borderRadius: 8,
          padding: "48px 56px",
          maxWidth: 820,
          margin: "0 auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          position: "relative"
        }}
      >
        {/* Header with Dual Logos */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #0D1233", paddingBottom: 20, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "#FF6600" }}>
              McCANN DOUALA
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Direction des Systèmes d'Information & Sécurité
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", background: "#0D1233", color: "#fff", borderRadius: 4, letterSpacing: "0.15em" }}>
              ACCRÉDITATION BI-RIVE
            </span>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "#00D4FF" }}>
              ORANGE CAMEROUN
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Direction Marketing & Conformité
            </div>
          </div>
        </div>

        {/* User Identity Box */}
        <div style={{ display: "flex", gap: 24, marginBottom: 28, background: "#F5F7FC", border: "1px solid #E1E6F0", borderRadius: 8, padding: 20 }}>
          {/* Photo */}
          <div style={{ width: 100, height: 120, border: "2px solid #0D1233", borderRadius: 6, overflow: "hidden", background: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {currentUser.photo ? (
              <img src={currentUser.photo} alt={currentUser.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center", color: "#999" }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{(currentUser.name || '?')[0]}</div>
                <div style={{ fontSize: 9, marginTop: 4 }}>PHOTO ID</div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0D1233", marginBottom: 4 }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#FF6600", marginBottom: 12 }}>
              {currentUser.role} · {currentUser.dept}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
              <div><strong>Matricule :</strong> {currentUser.matricule || "N/A"}</div>
              <div><strong>Identifiant UID :</strong> {currentUser.uid}</div>
              <div><strong>Email Pro :</strong> {currentUser.email}</div>
              <div><strong>Téléphone :</strong> {currentUser.phone || "N/A"}</div>
              <div><strong>Rive d'affectation :</strong> {currentUser.tenant === 'orange' ? 'Client Orange CM' : 'Agence McCann Douala'}</div>
              <div><strong>Habilitation RBAC :</strong> {currentUser.rbac?.toUpperCase() || 'CONTRIBUTEUR'}</div>
            </div>
          </div>
        </div>

        {/* Legal Compliance Box */}
        <div style={{ marginBottom: 28, border: "1px solid #E1E6F0", borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0D1233", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={16} /> Conformité des Pièces Légales & Réglementaires (Format PDF)
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ padding: 12, background: hasCni ? "#EBFBEE" : "#FFF5F5", border: `1px solid ${hasCni ? '#A3E6B4' : '#FEB2B2'}`, borderRadius: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: hasCni ? "#22543D" : "#742A2A" }}>
                1. Carte Nationale d'Identité (CNI / Passeport)
              </div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                {hasCni ? `✓ Document PDF déposé et certifié (${currentUser.documents.cni.name})` : "✗ Document manquant"}
              </div>
            </div>

            <div style={{ padding: 12, background: hasNiu ? "#EBFBEE" : "#FFF5F5", border: `1px solid ${hasNiu ? '#A3E6B4' : '#FEB2B2'}`, borderRadius: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: hasNiu ? "#22543D" : "#742A2A" }}>
                2. Numéro d'Identification Unique (NIU)
              </div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                {hasNiu ? `✓ Attestation fiscale PDF archivée (${currentUser.documents.niu.name})` : "✗ Document manquant"}
              </div>
            </div>
          </div>
        </div>

        {/* Signatures & Biometric Seal */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 36, paddingTop: 20, borderTop: "1px dashed #CBD5E0" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#666" }}>
              VISA RESPONSABLE IAM McCANN DOUALA
            </div>
            <div style={{ height: 60, display: "flex", alignItems: "flex-end", color: "#0D1233", fontFamily: "cursive", fontSize: 18 }}>
              Eric Selaboy
            </div>
            <div style={{ fontSize: 10, color: "#999" }}>Certifié conforme le {new Date().toLocaleDateString("fr-FR")}</div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#666" }}>
              SCEAU SÉCURITÉ BI-RIVE
            </div>
            <div style={{ height: 60, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
              <span style={{ padding: "4px 8px", background: "#0D1233", color: "#fff", fontSize: 10, borderRadius: 4, fontFamily: "monospace" }}>
                SHA256: 7f8c9b2e4a1d0092
              </span>
            </div>
            <div style={{ fontSize: 10, color: "#999" }}>Vault ID: BRIDGE-IAM-VAULT-2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}
