import React, { useState, useMemo } from 'react';
import { useIAM } from '../iamContext';
import Avatar from './Avatar';
import { 
  UsersRound, UserPlus, Search, Filter, Download, 
  ChevronDown, Eye, Printer, Trash2, MoreVertical, 
  Check, FileText, LayoutGrid, ListFilter, ShieldCheck, 
  ShieldAlert, Sparkles, AlertCircle, RefreshCw, Smartphone
} from 'lucide-react';

export default function UserDirectory({ onSelectUser, onOnboard, onExportPdf, onViewDoc }) {
  const { users, deleteUser, updateUser, toast, confirm, scope, setScope } = useIAM();

  const [searchTerm, setSearchTerm] = useState("");
  const [tenantFilter, setTenantFilter] = useState("all");
  const [selectedUids, setSelectedUids] = useState(new Set());
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'
  const [quickUser, setQuickUser] = useState(null);

  // Dynamic KPIs derived from real state
  const kpis = useMemo(() => {
    const total = users.length;
    const mccannCount = users.filter(u => u.tenant === "mccann").length;
    const orangeCount = users.filter(u => u.tenant === "orange").length;
    const activeCount = users.filter(u => u.status === "active").length;
    const pendingCount = users.filter(u => u.status === "pending").length;
    const withCni = users.filter(u => Boolean(u.documents?.cni?.data || u.documents?.cni?.name)).length;
    const withNiu = users.filter(u => Boolean(u.documents?.niu?.data || u.documents?.niu?.name)).length;
    const fullDocs = users.filter(u => Boolean(u.documents?.cni) && Boolean(u.documents?.niu)).length;

    return [
      {
        id: "total",
        label: "TOTAL COLLABORATEURS",
        value: total,
        delta: total > 0 ? `${total} enregistré(s)` : "Aucun",
        sub: `${mccannCount} Agence · ${orangeCount} Client`,
        color: "var(--iam-orange)"
      },
      {
        id: "active",
        label: "COMPTES ACTIFS",
        value: activeCount,
        delta: total > 0 ? `${Math.round((activeCount / Math.max(1, total)) * 100)}%` : "0%",
        sub: `${activeCount} opérationnel(s)`,
        color: "var(--iam-cyan)"
      },
      {
        id: "pending",
        label: "INVITATIONS EN ATTENTE",
        value: pendingCount,
        delta: pendingCount > 0 ? `${pendingCount} à valider` : "À jour",
        sub: "En attente 1ère connexion",
        color: "var(--iam-yellow)"
      },
      {
        id: "cni_niu",
        label: "CONFORMITÉ CNI & NIU (PDF)",
        value: total > 0 ? `${fullDocs}/${total}` : "0/0",
        delta: total > 0 ? `${Math.round((fullDocs / Math.max(1, total)) * 100)}% complet` : "0%",
        sub: `CNI: ${withCni} · NIU: ${withNiu}`,
        color: "var(--iam-green)"
      },
      {
        id: "parity",
        label: "PARITÉ BI-RIVE",
        value: total > 0 ? `${mccannCount}/${orangeCount}` : "0/0",
        delta: "McCann vs Orange",
        sub: "Ratio Agence vs Client CM",
        color: "#A855F7"
      },
      {
        id: "compliance",
        label: "SÉCURITÉ & AUDIT",
        value: "100%",
        delta: "Registre chiffré",
        sub: "AES-256 & Audit FIDO2",
        color: "var(--iam-cyan)"
      }
    ];
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Shore filter
      if (tenantFilter === "mccann" && u.tenant !== "mccann") return false;
      if (tenantFilter === "orange" && u.tenant !== "orange") return false;
      if (tenantFilter === "birive" && u.tenant !== "birive") return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = (u.name || "").toLowerCase().includes(query);
        const matchEmail = (u.email || "").toLowerCase().includes(query);
        const matchRole = (u.role || "").toLowerCase().includes(query);
        const matchDept = (u.dept || "").toLowerCase().includes(query);
        const matchId = (u.idMcann || u.uid || "").toLowerCase().includes(query);
        return matchName || matchEmail || matchRole || matchDept || matchId;
      }
      return true;
    });
  }, [users, tenantFilter, searchTerm]);

  const toggleSelect = (uid) => {
    setSelectedUids(prev => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedUids.size === filteredUsers.length) {
      setSelectedUids(new Set());
    } else {
      setSelectedUids(new Set(filteredUsers.map(u => u.uid)));
    }
  };

  const handleBulkDelete = () => {
    confirm({
      title: "Révocation groupée de comptes",
      message: `Êtes-vous certain de vouloir supprimer ${selectedUids.size} collaborateur(s) ? Cette action est irréversible.`,
      typedConfirm: "SUPPRIMER",
      onConfirm: () => {
        selectedUids.forEach(uid => deleteUser(uid));
        setSelectedUids(new Set());
        toast(`${selectedUids.size} comptes supprimés`, "info");
      }
    });
  };

  const handleExportCsv = () => {
    if (users.length === 0) {
      toast("Aucun utilisateur à exporter", "warning");
      return;
    }
    const headers = ["UID", "Nom", "Email", "Rive", "Département", "Rôle", "CNI_PDF", "NIU_PDF", "Statut"];
    const rows = users.map(u => [
      u.uid,
      `"${u.name || ''}"`,
      u.email || '',
      u.tenant || '',
      `"${u.dept || ''}"`,
      `"${u.role || ''}"`,
      u.documents?.cni ? "OUI" : "NON",
      u.documents?.niu ? "OUI" : "NON",
      u.status || 'active'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IAM_Collaborateurs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Annuaire exporté en CSV avec succès", "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Dynamic KPI Header */}
      <div className="iam-kpi-grid">
        {kpis.map(kpi => (
          <div key={kpi.id} className="iam-kpi">
            <div className="iam-kpi-head">
              <span className="iam-kpi-label">{kpi.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: kpi.color }}>
                {kpi.delta}
              </span>
            </div>
            <div className="iam-kpi-value" style={{ color: "var(--iam-text)" }}>
              {kpi.value}
            </div>
            <div className="iam-kpi-sub">
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Search, Filters & Actions Bar */}
      <div className="iam-card" style={{ padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          {/* Rive Filter Chips */}
          <div className="iam-filter-group" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { id: "all", label: "TOUS", count: users.length },
              { id: "mccann", label: "CÔTÉ AGENCE McCANN", count: users.filter(u => u.tenant === "mccann").length },
              { id: "orange", label: "CÔTÉ CLIENT ORANGE", count: users.filter(u => u.tenant === "orange").length },
              { id: "birive", label: "BI-RIVE", count: users.filter(u => u.tenant === "birive").length }
            ].map(tab => (
              <button
                key={tab.id}
                className={`iam-filter-pill ${tenantFilter === tab.id ? 'active' : ''}`}
                onClick={() => setTenantFilter(tab.id)}
              >
                {tab.label}
                <span className="iam-filter-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Search bar & CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", flex: "1 1 auto", justifyContent: "flex-end" }}>
            <div style={{ position: "relative", minWidth: 260, maxWidth: 360, flex: 1 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--iam-text-3)" }} />
              <input 
                type="text"
                className="iam-search-input"
                style={{ paddingLeft: 36, width: "100%" }}
                placeholder="Rechercher par nom, email, rôle, ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              className="iam-btn iam-btn-sm" 
              onClick={handleExportCsv}
              title="Exporter les données au format CSV"
            >
              <Download size={14} /> CSV
            </button>

            <button 
              className="iam-btn iam-btn-primary"
              onClick={onOnboard}
              style={{ fontWeight: 600 }}
            >
              <UserPlus size={16} /> + Nouveau Collaborateur
            </button>
          </div>
        </div>
      </div>

      {/* 3. Empty State vs Directory Table */}
      {users.length === 0 ? (
        <div className="iam-card" style={{ padding: "64px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(255, 102, 0, 0.12)",
            color: "var(--iam-orange)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            boxShadow: "0 0 30px rgba(255, 102, 0, 0.2)"
          }}>
            <UsersRound size={34} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--iam-text)", marginBottom: 10 }}>
            Aucun collaborateur enregistré
          </h2>
          <p style={{ color: "var(--iam-text-2)", fontSize: 14.5, maxWidth: 540, lineHeight: 1.6, marginBottom: 28 }}>
            Toutes les données d'exemples ont été supprimées du module. Le coffre-fort sécurisé IAM est prêt pour l'enregistrement de vos collaborateurs bi-rive avec leurs photos et leurs documents légaux (CNI, NIU en format PDF).
          </p>
          <button 
            className="iam-btn iam-btn-primary" 
            onClick={onOnboard}
            style={{ padding: "12px 28px", fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 10 }}
          >
            <UserPlus size={18} /> Enregistrer le premier collaborateur
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="iam-card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <AlertCircle size={36} style={{ color: "var(--iam-text-3)", margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--iam-text)", marginBottom: 6 }}>
            Aucun résultat pour cette recherche
          </h3>
          <p style={{ color: "var(--iam-text-3)", fontSize: 13.5, marginBottom: 18 }}>
            Aucun collaborateur ne correspond aux filtres appliqués.
          </p>
          <button 
            className="iam-btn iam-btn-sm"
            onClick={() => { setSearchTerm(""); setTenantFilter("all"); }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="iam-card" style={{ overflow: "hidden", padding: 0 }}>
          <div style={{ overflowX: "auto" }}>
            <table className="iam-table">
              <thead>
                <tr>
                  <th style={{ width: 44, textAlign: "center" }}>
                    <input 
                      type="checkbox" 
                      checked={selectedUids.size > 0 && selectedUids.size === filteredUsers.length}
                      onChange={selectAll}
                    />
                  </th>
                  <th>COLLABORATEUR</th>
                  <th>ENTITÉ & PÔLE</th>
                  <th>RÔLE & HABILITATION</th>
                  <th>RIVE & STATUT</th>
                  <th>DOCUMENTS LÉGAUX (PDF)</th>
                  <th style={{ textAlign: "right", paddingRight: 20 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const hasCni = Boolean(user.documents?.cni?.data || user.documents?.cni?.name);
                  const hasNiu = Boolean(user.documents?.niu?.data || user.documents?.niu?.name);
                  const isSelected = selectedUids.has(user.uid);

                  return (
                    <tr 
                      key={user.uid}
                      style={{ background: isSelected ? "rgba(0, 212, 255, 0.05)" : "transparent" }}
                    >
                      <td style={{ textAlign: "center" }}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(user.uid)}
                        />
                      </td>

                      {/* User Identity + Avatar */}
                      <td>
                        <div 
                          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                          onClick={() => onSelectUser(user)}
                        >
                          <Avatar user={user} size={38} />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--iam-text)", fontSize: 14 }}>
                              {user.name}
                            </div>
                            <div className="iam-mono" style={{ fontSize: 11, color: "var(--iam-text-3)", marginTop: 2 }}>
                              {user.email} {user.idMcann ? `· ${user.idMcann}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td>
                        <div style={{ fontSize: 13, color: "var(--iam-text)", fontWeight: 500 }}>
                          {user.dept || "Direction Générale"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--iam-text-3)", marginTop: 2 }}>
                          {user.pole || "Pôle Stratégique"}
                        </div>
                      </td>

                      {/* Role & RBAC */}
                      <td>
                        <div style={{ fontSize: 13, color: "var(--iam-text)", fontWeight: 500 }}>
                          {user.role || "Collaborateur"}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <span className={`iam-badge ${user.rbac === 'admin' ? 'iam-badge-admin' : 'iam-badge-neutral'}`} style={{ fontSize: 10 }}>
                            {user.rbac === 'admin' ? 'ADMINISTRATEUR' : user.rbac === 'validateur' ? 'VALIDATEUR' : user.rbac === 'contributeur' ? 'CONTRIBUTEUR' : 'LECTEUR'}
                          </span>
                        </div>
                      </td>

                      {/* Shore & Status */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <span className={`iam-badge ${user.tenant === 'orange' ? 'iam-badge-orange' : 'iam-badge-mccann'}`} style={{ fontSize: 10 }}>
                            {user.tenant === 'orange' ? 'CLIENT ORANGE' : user.tenant === 'birive' ? 'BI-RIVE' : 'AGENCE McCANN'}
                          </span>
                          <span style={{ fontSize: 11, color: user.status === 'active' ? 'var(--iam-green)' : 'var(--iam-yellow)', display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: user.status === 'active' ? 'var(--iam-green)' : 'var(--iam-yellow)' }} />
                            {user.status === 'active' ? 'Actif' : 'En attente'}
                          </span>
                        </div>
                      </td>

                      {/* Legal Docs (CNI & NIU en PDF) */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          {/* CNI Badge */}
                          <button
                            type="button"
                            className={`iam-badge ${hasCni ? 'iam-badge-active' : 'iam-badge-neutral'}`}
                            style={{ 
                              cursor: hasCni ? 'pointer' : 'default',
                              fontSize: 10.5,
                              padding: "3px 7px",
                              border: hasCni ? '1px solid rgba(46, 204, 113, 0.4)' : '1px solid rgba(255,255,255,0.08)'
                            }}
                            onClick={() => hasCni && onViewDoc && onViewDoc(user.documents.cni)}
                            title={hasCni ? `CNI fournie (${user.documents.cni.name}) - Cliquer pour voir` : "CNI non fournie"}
                          >
                            <FileText size={10} style={{ verticalAlign: "-1px" }} />
                            CNI {hasCni ? '✓' : '—'}
                          </button>

                          {/* NIU Badge */}
                          <button
                            type="button"
                            className={`iam-badge ${hasNiu ? 'iam-badge-active' : 'iam-badge-neutral'}`}
                            style={{ 
                              cursor: hasNiu ? 'pointer' : 'default',
                              fontSize: 10.5,
                              padding: "3px 7px",
                              border: hasNiu ? '1px solid rgba(46, 204, 113, 0.4)' : '1px solid rgba(255,255,255,0.08)'
                            }}
                            onClick={() => hasNiu && onViewDoc && onViewDoc(user.documents.niu)}
                            title={hasNiu ? `NIU fourni (${user.documents.niu.name}) - Cliquer pour voir` : "NIU non fourni"}
                          >
                            <FileText size={10} style={{ verticalAlign: "-1px" }} />
                            NIU {hasNiu ? '✓' : '—'}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right", paddingRight: 20 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <button
                            type="button"
                            className="iam-btn iam-btn-sm"
                            onClick={() => onSelectUser(user)}
                            title="Voir le profil complet"
                          >
                            <Eye size={13} /> Profil
                          </button>

                          <button
                            type="button"
                            className="iam-btn iam-btn-sm"
                            onClick={() => onExportPdf(user)}
                            title="Exporter la fiche PDF"
                          >
                            <Printer size={13} /> Fiche
                          </button>

                          <button
                            type="button"
                            className="iam-btn iam-btn-sm"
                            style={{ color: "var(--iam-red)", borderColor: "rgba(255, 77, 94, 0.2)" }}
                            onClick={() => {
                              confirm({
                                title: `Révoquer le compte de ${user.name}`,
                                message: `Êtes-vous certain de vouloir supprimer définitivement l'accès de ce collaborateur ?`,
                                typedConfirm: "SUPPRIMER",
                                onConfirm: () => deleteUser(user.uid)
                              });
                            }}
                            title="Supprimer ce collaborateur"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bulk Action Bar if selection active */}
          {selectedUids.size > 0 && (
            <div className="iam-bulkbar" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {selectedUids.size} collaborateur(s) sélectionné(s)
              </span>
              <button 
                className="iam-btn iam-btn-sm"
                style={{ color: "var(--iam-red)", borderColor: "rgba(255, 77, 94, 0.4)" }}
                onClick={handleBulkDelete}
              >
                <Trash2 size={14} /> Supprimer la sélection
              </button>
              <button
                className="iam-btn iam-btn-sm"
                onClick={() => setSelectedUids(new Set())}
              >
                Désélectionner
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
