import React, { useState } from 'react';
import { useIAM } from '../iamContext';
import { RBAC_PROFILES, MODULE_PERMISSIONS } from '../constants';
import { Shield, Lock, Check, Eye, AlertTriangle, FileText, Activity } from 'lucide-react';

export default function SecurityMatrix() {
  const { auditLogs } = useIAM();
  const [selectedRole, setSelectedRole] = useState(RBAC_PROFILES[0].id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* 1. ZTNA Policy Banner */}
      <div className="iam-sandbox-banner">
        <Shield size={20} style={{ color: "var(--iam-violet)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--iam-text)" }}>
            Politique Zero-Trust (ZTNA) & Gouvernance Bi-Rive
          </div>
          <div style={{ fontSize: 12.5, color: "var(--iam-text-3)", marginTop: 2 }}>
            Tous les accès sont cloisonnés entre l'Agence McCann Douala et le Client Orange Cameroun. Authentification par jeton cryptographique AES-256 et pièces légales obligatoires.
          </div>
        </div>
      </div>

      {/* 2. RBAC Roles Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {RBAC_PROFILES.map(role => (
          <div 
            key={role.id}
            className={`iam-card ${selectedRole === role.id ? 'active-border' : ''}`}
            style={{
              padding: 16,
              cursor: "pointer",
              borderColor: selectedRole === role.id ? "var(--iam-cyan)" : "var(--iam-border)",
              background: selectedRole === role.id ? "rgba(0, 212, 255, 0.05)" : "transparent"
            }}
            onClick={() => setSelectedRole(role.id)}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="iam-badge iam-badge-admin" style={{ fontSize: 10.5 }}>
                {role.name}
              </span>
              {selectedRole === role.id && <Check size={14} style={{ color: "var(--iam-cyan)" }} />}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--iam-text-2)" }}>
              {role.desc}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Module Permissions Table */}
      <div className="iam-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--iam-text)", marginBottom: 16 }}>
          Matrice d'Habilitation par Module Opérationnel
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table className="iam-table">
            <thead>
              <tr>
                <th>MODULE SYSTÈME</th>
                <th>ADMINISTRATEUR</th>
                <th>CONTRIBUTEUR</th>
                <th>VALIDATEUR</th>
                <th>LECTEUR SIMPLE</th>
              </tr>
            </thead>
            <tbody>
              {MODULE_PERMISSIONS.map(mod => (
                <tr key={mod.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--iam-text)", fontSize: 13.5 }}>
                      {mod.name}
                    </div>
                  </td>
                  <td>
                    <span className="iam-badge iam-badge-active" style={{ fontSize: 11 }}>
                      {mod.perRole.admin}
                    </span>
                  </td>
                  <td>
                    <span className="iam-badge" style={{ fontSize: 11 }}>
                      {mod.perRole.contributeur}
                    </span>
                  </td>
                  <td>
                    <span className="iam-badge iam-badge-orange" style={{ fontSize: 11 }}>
                      {mod.perRole.validateur}
                    </span>
                  </td>
                  <td>
                    <span className="iam-badge iam-badge-neutral" style={{ fontSize: 11 }}>
                      {mod.perRole.lecteur}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Live Audit Log */}
      <div className="iam-card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Activity size={18} style={{ color: "var(--iam-cyan)" }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--iam-text)" }}>
              Journal d'Audit Sécurisé en Temps Réel
            </h3>
          </div>
          <span className="iam-badge iam-badge-active" style={{ fontSize: 11 }}>
            Chiffrement SHA-256
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {auditLogs.map(log => (
            <div 
              key={log.id} 
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--iam-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                flexWrap: "wrap"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span className="iam-mono" style={{ fontSize: 11, color: "var(--iam-text-3)" }}>
                    {log.time}
                  </span>
                  <span className="iam-badge iam-badge-neutral" style={{ fontSize: 10 }}>
                    {log.type}
                  </span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--iam-text)" }}>
                  {log.title}
                </div>
                {log.lines?.length > 0 && (
                  <div style={{ fontSize: 12, color: "var(--iam-text-3)", marginTop: 2 }}>
                    {log.lines.join(" · ")}
                  </div>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <span className={`iam-badge ${log.verdictTone === 'green' ? 'iam-badge-active' : 'iam-badge-orange'}`} style={{ fontSize: 10 }}>
                  {log.verdict || "CONFORME"}
                </span>
                <div className="iam-mono" style={{ fontSize: 10, color: "var(--iam-text-3)", marginTop: 4 }}>
                  Hash: {log.hash || "certifié"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
