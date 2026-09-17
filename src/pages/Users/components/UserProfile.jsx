import React, { useState } from 'react';
import { useIAM } from '../iamContext';
import { PROFILE_SUB_TABS, MCCANN_DEPTS, ORANGE_DEPTS } from '../constants';
import Avatar from './Avatar';
import PhotoUpload from './PhotoUpload';
import LegalDocUpload from './LegalDocUpload';
import { 
  UserCheck, Camera, Printer, Trash2, Shield, 
  KeyRound, RefreshCw, Smartphone, Globe, Mail, 
  Phone, MapPin, Check, FileText, Download, Eye, 
  AlertCircle, Briefcase, Plus, ExternalLink, SlidersHorizontal, Info
} from 'lucide-react';

export default function UserProfile({ user = null, onBack, onExportPdf, onViewDoc }) {
  const { updateUser, deleteUser, toast, confirm, users, setSelectedUser } = useIAM();
  const [subTab, setSubTab] = useState("infos");
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  // If no user selected or directory is empty
  if (!user) {
    return (
      <div className="iam-card" style={{ padding: "64px 24px", textAlign: "center" }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(0, 212, 255, 0.12)",
          color: "var(--iam-cyan)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px"
        }}>
          <UserCheck size={30} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--iam-text)", marginBottom: 8 }}>
          Aucun profil sélectionné
        </h2>
        <p style={{ color: "var(--iam-text-3)", fontSize: 14, maxWidth: 460, margin: "0 auto 20px" }}>
          Veuillez sélectionner un collaborateur depuis l'annuaire ou en créer un nouveau pour afficher sa fiche détaillée.
        </p>
        <button className="iam-btn iam-btn-primary" onClick={onBack}>
          Retourner à l'Annuaire
        </button>
      </div>
    );
  }

  const handleUpdate = (field, value) => {
    updateUser(user.uid, { [field]: value });
  };

  const handlePhotoChange = (base64) => {
    updateUser(user.uid, { photo: base64 });
    setIsEditingPhoto(false);
    toast("Photo de profil mise à jour avec succès", "success");
  };

  const handlePhotoRemove = () => {
    updateUser(user.uid, { photo: null });
    setIsEditingPhoto(false);
    toast("Photo de profil supprimée", "info");
  };

  const handleDocUpload = (docType, docPayload) => {
    const updatedDocs = {
      ...(user.documents || {}),
      [docType]: docPayload
    };
    updateUser(user.uid, { documents: updatedDocs });
    toast(`Document ${docPayload.title} archivé au format PDF`, "success");
  };

  const handleDocRemove = (docType) => {
    const updatedDocs = { ...(user.documents || {}) };
    delete updatedDocs[docType];
    updateUser(user.uid, { documents: updatedDocs });
    toast("Document légal supprimé", "info");
  };

  const handleDelete = () => {
    confirm({
      title: `Révoquer l'accès de ${user.name}`,
      message: `Êtes-vous sûr de vouloir supprimer définitivement ce compte ? Tous les accès bi-rive associés seront révoqués.`,
      typedConfirm: "SUPPRIMER",
      onConfirm: () => {
        deleteUser(user.uid);
        onBack();
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Profile Hero Banner */}
      <div className="iam-profile-cover">
        <div className="iam-profile-head">
          {/* Avatar with Camera Overlay */}
          <div style={{ position: "relative" }}>
            <Avatar user={user} size={84} presence={true} />
            <button
              type="button"
              className="iam-btn iam-btn-sm"
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                borderRadius: "50%",
                width: 28,
                height: 28,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--iam-orange)",
                borderColor: "#0D1233",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
              }}
              onClick={() => setIsEditingPhoto(prev => !prev)}
              title="Changer la photo de profil"
            >
              <Camera size={13} />
            </button>
          </div>

          {/* Identity details */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--iam-text)", margin: 0 }}>
                {user.name}
              </h1>
              <span className={`iam-badge ${user.tenant === 'orange' ? 'iam-badge-orange' : 'iam-badge-mccann'}`}>
                {user.tenant === 'orange' ? 'CLIENT ORANGE' : user.tenant === 'birive' ? 'BI-RIVE' : 'AGENCE McCANN'}
              </span>
              <span className="iam-badge iam-badge-active">
                {user.rbac === 'admin' ? 'ADMIN' : user.rbac === 'validateur' ? 'VALIDATEUR' : user.rbac === 'contributeur' ? 'CONTRIBUTEUR' : 'LECTEUR'}
              </span>
            </div>

            <div style={{ fontSize: 13.5, color: "var(--iam-cyan)", marginTop: 4, fontWeight: 500 }}>
              {user.role} · {user.dept}
            </div>

            <div className="iam-mono" style={{ fontSize: 11.5, color: "var(--iam-text-3)", marginTop: 4, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span>UID: {user.uid}</span>
              {user.idMcann && <span>ID: {user.idMcann}</span>}
              <span>Email: {user.email}</span>
              {user.phone && <span>Tél: {user.phone}</span>}
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="iam-btn iam-btn-primary"
              onClick={() => onExportPdf(user)}
              style={{ fontSize: 13 }}
            >
              <Printer size={15} /> Exporter Fiche PDF
            </button>

            <button
              className="iam-btn"
              onClick={handleDelete}
              style={{ color: "var(--iam-red)", borderColor: "rgba(255, 77, 94, 0.3)", fontSize: 13 }}
              title="Révoquer ce collaborateur"
            >
              <Trash2 size={15} /> Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Optional Photo Edit Popup/Drawer */}
      {isEditingPhoto && (
        <div className="iam-card" style={{ padding: 20, border: "1px solid var(--iam-orange)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--iam-text)" }}>
              Modifier la photo de profil de {user.name}
            </div>
            <button className="iam-btn iam-btn-sm" onClick={() => setIsEditingPhoto(false)}>Fermer</button>
          </div>
          <PhotoUpload 
            value={user.photo}
            onChange={handlePhotoChange}
            onRemove={handlePhotoRemove}
            name={user.name}
            size={90}
          />
        </div>
      )}

      {/* 2. Sub-Tabs Bar */}
      <div className="iam-card" style={{ padding: 6 }}>
        <div className="iam-tabs" style={{ width: "100%", justifyContent: "flex-start", gap: 4 }}>
          {PROFILE_SUB_TABS.map(tab => (
            <button
              key={tab.id}
              className={`iam-tab ${subTab === tab.id ? 'active' : ''}`}
              onClick={() => setSubTab(tab.id)}
              style={{
                position: "relative",
                fontWeight: subTab === tab.id ? 700 : 500,
                color: tab.highlight && subTab !== tab.id ? "var(--iam-cyan)" : undefined
              }}
            >
              {tab.label}
              {tab.id === 'docs' && (
                <span style={{
                  marginLeft: 6,
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontSize: 10,
                  background: (user.documents?.cni && user.documents?.niu) ? "rgba(46, 204, 113, 0.2)" : "rgba(255, 102, 0, 0.2)",
                  color: (user.documents?.cni && user.documents?.niu) ? "var(--iam-green)" : "var(--iam-orange)"
                }}>
                  {(user.documents?.cni && user.documents?.niu) ? "2/2 ✓" : user.documents?.cni || user.documents?.niu ? "1/2" : "0/2"}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Sub-Tab Content */}
      <div className="iam-card" style={{ padding: 24 }}>
        {/* SUB-TAB 1: Informations Générales */}
        {subTab === "infos" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--iam-text)" }}>
                Coordonnées & Informations Personnelles
              </h3>
            </div>

            <div className="iam-grid-2" style={{ gap: 18 }}>
              <div className="iam-field">
                <label>Nom complet</label>
                <input 
                  type="text" 
                  className="iam-input"
                  value={user.name || ""}
                  onChange={(e) => handleUpdate("name", e.target.value)}
                />
              </div>

              <div className="iam-field">
                <label>Email professionnel bi-rive</label>
                <input 
                  type="email" 
                  className="iam-input"
                  value={user.email || ""}
                  onChange={(e) => handleUpdate("email", e.target.value)}
                />
              </div>

              <div className="iam-field">
                <label>Numéro de téléphone mobile</label>
                <input 
                  type="text" 
                  className="iam-input"
                  value={user.phone || ""}
                  onChange={(e) => handleUpdate("phone", e.target.value)}
                  placeholder="+237 6XX XX XX XX"
                />
              </div>

              <div className="iam-field">
                <label>Matricule RH</label>
                <input 
                  type="text" 
                  className="iam-input"
                  value={user.matricule || ""}
                  onChange={(e) => handleUpdate("matricule", e.target.value)}
                />
              </div>

              <div className="iam-field">
                <label>Statut de connexion</label>
                <select 
                  className="iam-select"
                  value={user.status || "active"}
                  onChange={(e) => handleUpdate("status", e.target.value)}
                >
                  <option value="active">Actif / En service</option>
                  <option value="suspended">Suspendu temporairement</option>
                  <option value="pending">En attente d'activation</option>
                </select>
              </div>

              <div className="iam-field">
                <label>Présence en temps réel</label>
                <select 
                  className="iam-select"
                  value={user.presence || "online"}
                  onChange={(e) => handleUpdate("presence", e.target.value)}
                >
                  <option value="online">En ligne (Douala - GMT+1)</option>
                  <option value="away">Absent / En réunion</option>
                  <option value="offline">Hors ligne</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: Description & Poste */}
        {subTab === "desc" && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--iam-text)", marginBottom: 18 }}>
              Rôle, Compétences & Campagnes Assignées
            </h3>

            <div className="iam-field" style={{ marginBottom: 18 }}>
              <label>Département / Direction</label>
              <select 
                className="iam-select"
                value={user.dept || ""}
                onChange={(e) => handleUpdate("dept", e.target.value)}
              >
                {(user.tenant === "orange" ? ORANGE_DEPTS : MCCANN_DEPTS).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="iam-field" style={{ marginBottom: 18 }}>
              <label>Bio / Description du poste</label>
              <textarea 
                className="iam-input"
                rows={4}
                value={user.bio || ""}
                onChange={(e) => handleUpdate("bio", e.target.value)}
                placeholder="Description des responsabilités bi-rive…"
              />
            </div>
          </div>
        )}

        {/* SUB-TAB 3: DOCUMENTS LÉGAUX (CNI, NIU, etc. en PDF) */}
        {subTab === "docs" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--iam-text)", display: "flex", alignItems: "center", gap: 8 }}>
                  <FileText size={20} style={{ color: "var(--iam-cyan)" }} />
                  Documents Légaux & Conformité (Format PDF)
                </h3>
                <p style={{ fontSize: 13, color: "var(--iam-text-3)", marginTop: 4 }}>
                  Pièces justificatives d'identité et de fiscalité requises pour l'accréditation bi-rive.
                </p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <span className={`iam-badge ${(user.documents?.cni && user.documents?.niu) ? 'iam-badge-active' : 'iam-badge-neutral'}`}>
                  {(user.documents?.cni && user.documents?.niu) ? 'Dossier Conforme (100%)' : 'Dossier Incomplet'}
                </span>
              </div>
            </div>

            <div className="iam-doc-upload-grid">
              {/* Carte Nationale d'Identité (CNI) */}
              <LegalDocUpload 
                title="Carte Nationale d'Identité (CNI)"
                docType="cni"
                document={user.documents?.cni}
                onUpload={(docPayload) => handleDocUpload("cni", docPayload)}
                onRemove={() => handleDocRemove("cni")}
                onView={onViewDoc}
                required={true}
                description="Scan recto-verso ou passeport en cours de validité (PDF)"
              />

              {/* Numéro d'Identification Unique (NIU) */}
              <LegalDocUpload 
                title="Numéro d'Identification Unique (NIU)"
                docType="niu"
                document={user.documents?.niu}
                onUpload={(docPayload) => handleDocUpload("niu", docPayload)}
                onRemove={() => handleDocRemove("niu")}
                onView={onViewDoc}
                required={false}
                description="Attestation d'immatriculation fiscale officielle (PDF)"
              />
            </div>

            {/* Document complémentaire */}
            <div style={{ marginTop: 20 }}>
              <LegalDocUpload 
                title="Document Légal Complémentaire (PDF)"
                docType="other"
                document={user.documents?.other}
                onUpload={(docPayload) => handleDocUpload("other", docPayload)}
                onRemove={() => handleDocRemove("other")}
                onView={onViewDoc}
                required={false}
                description="Contrat de travail, Casier judiciaire, Accord de confidentialité bi-rive (PDF)"
              />
            </div>
          </div>
        )}

        {/* SUB-TAB 4: Réseaux & Canaux */}
        {subTab === "social" && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--iam-text)", marginBottom: 18 }}>
              Canaux de Collaboration & Messageries Pro
            </h3>
            <div className="iam-grid-2" style={{ gap: 18 }}>
              <div className="iam-field">
                <label>Microsoft Teams / Email</label>
                <input 
                  type="text" 
                  className="iam-input"
                  value={user.email || ""}
                  disabled
                />
              </div>

              <div className="iam-field">
                <label>LinkedIn Pro</label>
                <input 
                  type="text" 
                  className="iam-input"
                  placeholder="https://linkedin.com/in/..."
                  value={user.socialLinkedin || ""}
                  onChange={(e) => handleUpdate("socialLinkedin", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 5: Paramètres IAM & Sessions */}
        {subTab === "iam" && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--iam-text)", marginBottom: 18 }}>
              Politiques de Sécurité IAM & Révocation
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: 14, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid var(--iam-border)" }}>
                <div style={{ fontWeight: 600, color: "var(--iam-text)", fontSize: 13.5 }}>
                  Authentification Multi-Facteurs (MFA)
                </div>
                <div style={{ fontSize: 12, color: "var(--iam-text-3)", marginTop: 2 }}>
                  Statut : {user.requireMfa !== false ? "Activée et obligatoire" : "Désactivée"}
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid var(--iam-border)" }}>
                <div style={{ fontWeight: 600, color: "var(--iam-text)", fontSize: 13.5 }}>
                  Chiffrement de Session & Coffre ZTNA
                </div>
                <div style={{ fontSize: 12, color: "var(--iam-text-3)", marginTop: 2 }}>
                  Certificat FIDO2 actif · Token session 24h
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 6: Préférences & Alertes */}
        {subTab === "prefs" && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--iam-text)", marginBottom: 18 }}>
              Préférences & Alertes Système
            </h3>
            <p style={{ color: "var(--iam-text-3)", fontSize: 13 }}>
              Notifications pour les livrables, validations budgétaires et échéances de campagnes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
