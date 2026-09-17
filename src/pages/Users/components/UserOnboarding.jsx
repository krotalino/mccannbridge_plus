import React, { useState } from 'react';
import { useIAM } from '../iamContext';
import { MCCANN_DEPTS, ORANGE_DEPTS, MCCANN_ROLES, ORANGE_ROLES, RBAC_PROFILES } from '../constants';
import PhotoUpload from './PhotoUpload';
import LegalDocUpload from './LegalDocUpload';
import Avatar from './Avatar';
import { 
  UserPlus, Check, ChevronRight, ChevronLeft, Shield, 
  KeyRound, RefreshCw, Send, CheckCircle2, FileText, 
  Sparkles, Camera, Phone, Mail, Building2, Briefcase, Eye
} from 'lucide-react';

export default function UserOnboarding({ onFinish, onCancel, onViewDoc }) {
  const { addUser, toast } = useIAM();

  const [step, setStep] = useState(0);
  const [createdUser, setCreatedUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    matricule: "",
    photo: null,
    tenant: "mccann", // 'mccann' | 'orange' | 'birive'
    dept: MCCANN_DEPTS[0],
    role: MCCANN_ROLES[0],
    rbac: "contributeur",
    accountType: "AGENCE",
    status: "active",
    presence: "online",
    password: generateInitialPassword(),
    requireMfa: true,
    sendEmailInvite: true,
    sendSmsOtp: false,
    documents: {
      cni: null,
      niu: null,
      other: null
    },
    skills: ["Gestion de Projet", "Stratégie de Marque"],
    campaigns: ["OM 2026", "Festif Brand"],
    bio: ""
  });

  function generateInitialPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$*";
    let pwd = "";
    for (let i = 0; i < 14; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleShoreChange = (tenant) => {
    const isOrange = tenant === "orange";
    const isBirive = tenant === "birive";
    setFormData(prev => ({
      ...prev,
      tenant,
      accountType: isBirive ? "BI-RIVE" : isOrange ? "CLIENT" : "AGENCE",
      dept: isOrange ? ORANGE_DEPTS[0] : MCCANN_DEPTS[0],
      role: isOrange ? ORANGE_ROLES[0] : MCCANN_ROLES[0]
    }));
  };

  const handleDocumentUpload = (docType, docPayload) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: docPayload
      }
    }));
    toast(`Document ${docPayload.title} chargé au format PDF`, "success");
  };

  const handleDocumentRemove = (docType) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: null
      }
    }));
  };

  const validateStep = () => {
    if (step === 0) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast("Veuillez renseigner le nom et le prénom du collaborateur", "error");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        toast("Veuillez renseigner une adresse email professionnelle valide", "error");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const handleDeploy = () => {
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const prefix = formData.tenant === "orange" ? "OC" : "MC";
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const uid = `UID-${year}-${randomNum}`;
    const idMcann = `${prefix}-CM-${randomNum}`;

    const newUser = {
      ...formData,
      uid,
      idMcann,
      name: fullName,
      createdAt: new Date().toISOString()
    };

    addUser(newUser);
    setCreatedUser(newUser);
  };

  // Success Screen
  if (createdUser) {
    return (
      <div className="iam-card" style={{ maxWidth: 740, margin: "20px auto", padding: "40px 32px", textAlign: "center" }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(46, 204, 113, 0.14)",
          color: "var(--iam-green)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 0 30px rgba(46, 204, 113, 0.25)"
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--iam-text)", marginBottom: 8 }}>
          Accès Collaborateur Déployé avec Succès
        </h2>
        <p style={{ color: "var(--iam-text-2)", fontSize: 14.5, maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.5 }}>
          Le profil de <strong>{createdUser.name}</strong> a été initialisé et certifié dans le registre sécurisé bi-rive.
        </p>

        {/* User Card Summary */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--iam-border)",
          borderRadius: 12,
          padding: 20,
          textAlign: "left",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap"
        }}>
          <Avatar user={createdUser} size={64} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--iam-text)" }}>
              {createdUser.name}
            </div>
            <div className="iam-mono" style={{ fontSize: 12, color: "var(--iam-text-3)", marginTop: 2 }}>
              UID: {createdUser.uid} · ID: {createdUser.idMcann}
            </div>
            <div style={{ fontSize: 13, color: "var(--iam-cyan)", marginTop: 4 }}>
              {createdUser.role} · {createdUser.dept}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 11, color: "var(--iam-text-3)" }}>Documents légaux :</div>
            <div style={{ display: "flex", gap: 6 }}>
              <span className={`iam-badge ${createdUser.documents?.cni ? 'iam-badge-active' : 'iam-badge-neutral'}`} style={{ fontSize: 10 }}>
                CNI {createdUser.documents?.cni ? '✓ Fournie' : '— Manquante'}
              </span>
              <span className={`iam-badge ${createdUser.documents?.niu ? 'iam-badge-active' : 'iam-badge-neutral'}`} style={{ fontSize: 10 }}>
                NIU {createdUser.documents?.niu ? '✓ Fourni' : '— Manquant'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button
            className="iam-btn iam-btn-primary"
            style={{ padding: "11px 24px", fontSize: 14 }}
            onClick={() => onFinish && onFinish(createdUser)}
          >
            Consulter le profil complet
          </button>
          <button
            className="iam-btn"
            style={{ padding: "11px 20px", fontSize: 14 }}
            onClick={() => {
              setCreatedUser(null);
              setStep(0);
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                matricule: "",
                photo: null,
                tenant: "mccann",
                dept: MCCANN_DEPTS[0],
                role: MCCANN_ROLES[0],
                rbac: "contributeur",
                accountType: "AGENCE",
                status: "active",
                presence: "online",
                password: generateInitialPassword(),
                requireMfa: true,
                sendEmailInvite: true,
                sendSmsOtp: false,
                documents: { cni: null, niu: null, other: null },
                skills: [],
                campaigns: [],
                bio: ""
              });
            }}
          >
            + Enregistrer un autre collaborateur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="iam-stepper-layout" style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* 1. Left Stepper Rail */}
      <div className="iam-stepper-rail iam-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--iam-text-3)", marginBottom: 16 }}>
          PROVISIONING VAULT
        </div>

        {[
          { stepNum: 0, title: "1. Identité & Photo", desc: "Coordonnées & Biométrie" },
          { stepNum: 1, title: "2. Rattachement & CNI/NIU", desc: "Rôle & Documents PDF" },
          { stepNum: 2, title: "3. Sécurité & Accès", desc: "Identifiants & MFA bi-rive" },
          { stepNum: 3, title: "4. Revue & Déploiement", desc: "Validation finale" }
        ].map(s => {
          const isActive = step === s.stepNum;
          const isDone = step > s.stepNum;

          return (
            <div 
              key={s.stepNum} 
              className={`iam-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => {
                if (isDone) setStep(s.stepNum);
              }}
              style={{ cursor: isDone ? 'pointer' : 'default' }}
            >
              <div className="iam-step-num">
                {isDone ? <Check size={14} /> : s.stepNum + 1}
              </div>
              <div className="iam-step-text">
                <div className="t">{s.title}</div>
                <div className="d">{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Main Step Content */}
      <div className="iam-card" style={{ padding: 28, flex: 1 }}>
        {/* STEP 0: Identité & Photo */}
        {step === 0 && (
          <div>
            <div style={{ borderBottom: "1px solid var(--iam-border)", paddingBottom: 16, marginBottom: 24 }}>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--iam-text)", marginBottom: 6 }}>
                Étape 1 : Identité & Photo de Profil
              </h2>
              <p style={{ color: "var(--iam-text-3)", fontSize: 13 }}>
                Renseignez les données d'état civil et téléversez la photo d'identité du collaborateur.
              </p>
            </div>

            {/* Photo Upload Card */}
            <div style={{ marginBottom: 24 }}>
              <PhotoUpload 
                value={formData.photo}
                onChange={(base64) => updateField("photo", base64)}
                onRemove={() => updateField("photo", null)}
                name={`${formData.firstName} ${formData.lastName}`}
                size={88}
                helperText="Glissez ou importez la photo officielle (JPG, PNG, WebP)"
              />
            </div>

            {/* Identity Form Fields */}
            <div className="iam-grid-2" style={{ gap: 18 }}>
              <div className="iam-field">
                <label>Prénom <span style={{ color: "var(--iam-orange)" }}>*</span></label>
                <input 
                  type="text" 
                  className="iam-input"
                  placeholder="Ex: Christian, Alain Patrick…"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </div>

              <div className="iam-field">
                <label>Nom de famille <span style={{ color: "var(--iam-orange)" }}>*</span></label>
                <input 
                  type="text" 
                  className="iam-input"
                  placeholder="Ex: Kameni, Eboa…"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>

              <div className="iam-field">
                <label>Email professionnel bi-rive <span style={{ color: "var(--iam-orange)" }}>*</span></label>
                <input 
                  type="email" 
                  className="iam-input"
                  placeholder="nom.prenom@mccann.cm ou @orange.cm"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>

              <div className="iam-field">
                <label>Téléphone professionnel (WhatsApp / Call)</label>
                <input 
                  type="tel" 
                  className="iam-input"
                  placeholder="+237 6XX XX XX XX"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <div className="iam-field">
                <label>Matricule interne</label>
                <input 
                  type="text" 
                  className="iam-input"
                  placeholder="Ex: MAT-2026-DLA-084"
                  value={formData.matricule}
                  onChange={(e) => updateField("matricule", e.target.value)}
                />
              </div>

              <div className="iam-field">
                <label>Type de rattachement</label>
                <select 
                  className="iam-select"
                  value={formData.accountType}
                  onChange={(e) => updateField("accountType", e.target.value)}
                >
                  <option value="AGENCE">Compte Collaborateur Agence (McCann)</option>
                  <option value="CLIENT">Compte Partenaire Client (Orange)</option>
                  <option value="BI-RIVE">Compte Superviseur Bi-Rive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Rattachement & Documents Légaux (PDF) */}
        {step === 1 && (
          <div>
            <div style={{ borderBottom: "1px solid var(--iam-border)", paddingBottom: 16, marginBottom: 24 }}>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--iam-text)", marginBottom: 6 }}>
                Étape 2 : Rattachement & Documents Légaux (Format PDF)
              </h2>
              <p style={{ color: "var(--iam-text-3)", fontSize: 13 }}>
                Sélectionnez le département d'affectation et déposez les pièces légales justificatives (CNI, NIU en PDF).
              </p>
            </div>

            {/* Shore Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--iam-text-3)", textTransform: "uppercase", marginBottom: 8 }}>
                Rive d'Appartenance
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { id: "mccann", label: "Agence McCann Douala", sub: "Production & Direction de Compte" },
                  { id: "orange", label: "Client Orange Cameroun", sub: "Fintech, Marketing & Validation" },
                  { id: "birive", label: "Coordination Bi-Rive", sub: "Direction Générale & Arbitrage" }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    className={`iam-card ${formData.tenant === r.id ? 'active-border' : ''}`}
                    style={{
                      padding: 14,
                      textAlign: "left",
                      cursor: "pointer",
                      borderColor: formData.tenant === r.id ? "var(--iam-orange)" : "var(--iam-border)",
                      background: formData.tenant === r.id ? "rgba(255, 102, 0, 0.06)" : "transparent"
                    }}
                    onClick={() => handleShoreChange(r.id)}
                  >
                    <div style={{ fontWeight: 600, color: "var(--iam-text)", fontSize: 13 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: "var(--iam-text-3)", marginTop: 3 }}>{r.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Department & Roles */}
            <div className="iam-grid-2" style={{ gap: 18, marginBottom: 28 }}>
              <div className="iam-field">
                <label>Département / Direction</label>
                <select 
                  className="iam-select"
                  value={formData.dept}
                  onChange={(e) => updateField("dept", e.target.value)}
                >
                  {(formData.tenant === "orange" ? ORANGE_DEPTS : MCCANN_DEPTS).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="iam-field">
                <label>Fonction / Rôle Opérationnel</label>
                <select 
                  className="iam-select"
                  value={formData.role}
                  onChange={(e) => updateField("role", e.target.value)}
                >
                  {(formData.tenant === "orange" ? ORANGE_ROLES : MCCANN_ROLES).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="iam-field">
                <label>Profil Habilitation RBAC</label>
                <select 
                  className="iam-select"
                  value={formData.rbac}
                  onChange={(e) => updateField("rbac", e.target.value)}
                >
                  {RBAC_PROFILES.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.desc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* LEGAL DOCUMENTS (CNI, NIU en PDF) SECTION */}
            <div style={{
              background: "rgba(0, 212, 255, 0.02)",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              borderRadius: 12,
              padding: 20
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <FileText size={18} style={{ color: "var(--iam-cyan)" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--iam-text)" }}>
                  Documents Légaux Obligatoires (Format PDF)
                </h3>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--iam-text-3)", marginBottom: 16 }}>
                Conformément aux protocoles de conformité bi-rive, déposez ici la CNI (Carte Nationale d'Identité ou Passeport) et le NIU (Numéro d'Identification Unique) au format PDF.
              </p>

              <div className="iam-doc-upload-grid">
                {/* CNI Upload Card */}
                <LegalDocUpload 
                  title="Carte Nationale d'Identité (CNI)"
                  docType="cni"
                  document={formData.documents.cni}
                  onUpload={(docPayload) => handleDocumentUpload("cni", docPayload)}
                  onRemove={() => handleDocumentRemove("cni")}
                  onView={onViewDoc}
                  required={true}
                  description="Scan recto-verso ou passeport (Format PDF, max 12 MB)"
                />

                {/* NIU Upload Card */}
                <LegalDocUpload 
                  title="Numéro d'Identification Unique (NIU)"
                  docType="niu"
                  document={formData.documents.niu}
                  onUpload={(docPayload) => handleDocumentUpload("niu", docPayload)}
                  onRemove={() => handleDocumentRemove("niu")}
                  onView={onViewDoc}
                  required={false}
                  description="Attestation d'immatriculation fiscale (Format PDF)"
                />
              </div>

              {/* Complementary document */}
              <div style={{ marginTop: 14 }}>
                <LegalDocUpload 
                  title="Document Légal Complémentaire (Optionnel)"
                  docType="other"
                  document={formData.documents.other}
                  onUpload={(docPayload) => handleDocumentUpload("other", docPayload)}
                  onRemove={() => handleDocumentRemove("other")}
                  onView={onViewDoc}
                  required={false}
                  description="Contrat de travail, Casier judiciaire, Accord de confidentialité (PDF)"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Identifiants & Sécurité */}
        {step === 2 && (
          <div>
            <div style={{ borderBottom: "1px solid var(--iam-border)", paddingBottom: 16, marginBottom: 24 }}>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--iam-text)", marginBottom: 6 }}>
                Étape 3 : Identifiants & Sécurité bi-rive
              </h2>
              <p style={{ color: "var(--iam-text-3)", fontSize: 13 }}>
                Définissez la politique d'accès initial, le mot de passe temporaire et les règles MFA.
              </p>
            </div>

            {/* Generated Password Box */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--iam-border)",
              borderRadius: 12,
              padding: 20,
              marginBottom: 24
            }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--iam-text-3)", textTransform: "uppercase", marginBottom: 8 }}>
                Mot de passe temporaire généré
              </label>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input 
                  type="text" 
                  className="iam-input iam-mono"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  style={{ fontSize: 14, letterSpacing: "0.08em", fontWeight: 600, color: "var(--iam-cyan)" }}
                />
                <button 
                  type="button"
                  className="iam-btn"
                  onClick={() => updateField("password", generateInitialPassword())}
                  title="Générer un nouveau mot de passe fort"
                >
                  <RefreshCw size={14} /> Régénérer
                </button>
              </div>
              <div style={{ fontSize: 11, color: "var(--iam-text-3)", marginTop: 6 }}>
                Ce mot de passe devra être renouvelé lors de la première connexion.
              </div>
            </div>

            {/* Security Switches */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={formData.requireMfa}
                  onChange={(e) => updateField("requireMfa", e.target.checked)}
                />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--iam-text)" }}>
                    Exiger l'Authentification Multi-Facteurs (MFA / 2FA)
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--iam-text-3)" }}>
                    Obligation de configurer une clé FIDO2 ou Google Authenticator.
                  </div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={formData.sendEmailInvite}
                  onChange={(e) => updateField("sendEmailInvite", e.target.checked)}
                />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--iam-text)" }}>
                    Envoyer le lien d'invitation sécurisé par Email
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--iam-text-3)" }}>
                    Transmet les instructions d'onboarding sur {formData.email || 'l’adresse pro'}.
                  </div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={formData.sendSmsOtp}
                  onChange={(e) => updateField("sendSmsOtp", e.target.checked)}
                />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--iam-text)" }}>
                    Notifier par SMS OTP au Cameroun (+237)
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--iam-text-3)" }}>
                    Envoi du code d'activation temporaire sur le numéro mobile.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Revue Récapitulative & Déploiement */}
        {step === 3 && (
          <div>
            <div style={{ borderBottom: "1px solid var(--iam-border)", paddingBottom: 16, marginBottom: 24 }}>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--iam-text)", marginBottom: 6 }}>
                Étape 4 : Revue Récapitulative & Déploiement dans le Vault
              </h2>
              <p style={{ color: "var(--iam-text-3)", fontSize: 13 }}>
                Vérifiez l'exactitude des informations et documents avant inscription définitive dans le registre IAM.
              </p>
            </div>

            {/* Profile Overview */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--iam-border)",
              borderRadius: 12,
              padding: 20,
              marginBottom: 20
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <Avatar user={{ ...formData, name: `${formData.firstName} ${formData.lastName}` }} size={64} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--iam-text)" }}>
                    {formData.firstName} {formData.lastName}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--iam-cyan)", marginTop: 2 }}>
                    {formData.role} · {formData.dept}
                  </div>
                  <div className="iam-mono" style={{ fontSize: 12, color: "var(--iam-text-3)", marginTop: 2 }}>
                    {formData.email} {formData.phone ? `· ${formData.phone}` : ''}
                  </div>
                </div>
              </div>

              <div className="iam-grid-2" style={{ gap: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--iam-text-3)", textTransform: "uppercase" }}>Rive d'affectation</div>
                  <div style={{ fontSize: 13.5, color: "var(--iam-text)", marginTop: 3 }}>
                    {formData.tenant === 'orange' ? 'Client Orange Cameroun' : formData.tenant === 'birive' ? 'Coordination Bi-Rive' : 'Agence McCann Douala'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--iam-text-3)", textTransform: "uppercase" }}>Habilitation RBAC</div>
                  <div style={{ fontSize: 13.5, color: "var(--iam-text)", marginTop: 3 }}>
                    {formData.rbac.toUpperCase()}
                  </div>
                </div>

                {/* Legal Docs Status */}
                <div style={{ gridColumn: "span 2" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--iam-text-3)", textTransform: "uppercase", marginBottom: 6 }}>
                    Documents Légaux Fournis (Format PDF)
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: formData.documents.cni ? "rgba(46, 204, 113, 0.1)" : "rgba(255, 255, 255, 0.03)",
                      border: "1px solid",
                      borderColor: formData.documents.cni ? "rgba(46, 204, 113, 0.3)" : "var(--iam-border)",
                      fontSize: 12
                    }}>
                      <strong>CNI / Passeport :</strong> {formData.documents.cni ? `${formData.documents.cni.name} (${formData.documents.cni.size})` : "Non fournie"}
                    </div>

                    <div style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: formData.documents.niu ? "rgba(46, 204, 113, 0.1)" : "rgba(255, 255, 255, 0.03)",
                      border: "1px solid",
                      borderColor: formData.documents.niu ? "rgba(46, 204, 113, 0.3)" : "var(--iam-border)",
                      fontSize: 12
                    }}>
                      <strong>NIU Fiscale :</strong> {formData.documents.niu ? `${formData.documents.niu.name} (${formData.documents.niu.size})` : "Non fourni"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28, borderTop: "1px solid var(--iam-border)", paddingTop: 20 }}>
          {step > 0 ? (
            <button
              type="button"
              className="iam-btn"
              onClick={prevStep}
            >
              <ChevronLeft size={16} /> Précédent
            </button>
          ) : (
            <button
              type="button"
              className="iam-btn"
              onClick={onCancel}
            >
              Annuler
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              className="iam-btn iam-btn-primary"
              onClick={nextStep}
            >
              Suivant <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="iam-btn iam-btn-primary"
              onClick={handleDeploy}
              style={{ fontWeight: 700, padding: "11px 24px" }}
            >
              <Sparkles size={16} /> Déployer l'accès dans le Vault IAM
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
