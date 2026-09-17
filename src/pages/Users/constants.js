export const MCCANN_DEPTS = [
  "Account Management (Direction de Clientèle)",
  "Création & Brand Content",
  "Finance & Admin",
  "Production",
  "Digital & Social Media"
];

export const ORANGE_DEPTS = [
  "Direction Marketing",
  "Orange Money & Fintech",
  "Contrôle de Gestion",
  "DSI & Conformité",
  "Data & Analytics"
];

export const MCCANN_ROLES = [
  "Directeur de Clientèle (Lead Compte Orange)",
  "Chef de Pub (Account Manager)",
  "Directeur Artistique Senior",
  "Motion Designer",
  "Community Manager",
  "DAF & Super Admin"
];

export const ORANGE_ROLES = [
  "Brand Manager 4G/5G",
  "Resp. Orange Money & Fintech",
  "Contrôleur de Gestion Média",
  "Ingénieur SI & Conformité",
  "Data Analyst Marketing"
];

export const RBAC_PROFILES = [
  { id: "admin", name: "Administrateur", desc: "Tous droits entité & validation" },
  { id: "contributeur", name: "Contributeur", desc: "Stratégique Lead & production" },
  { id: "validateur", name: "Validateur", desc: "Signataire Budget & campagnes" },
  { id: "lecteur", name: "Lecteur Simple", desc: "Consultation pure" }
];

export const MODULE_PERMISSIONS = [
  {
    id: "calendar",
    name: "Calendrier Éditorial Bi-Rive",
    icon: "Calendar",
    tint: "cyan",
    perRole: {
      admin: "Édition Complète",
      contributeur: "Édition Complète",
      validateur: "Validation & Suivi",
      lecteur: "Lecture Seule"
    }
  },
  {
    id: "budget",
    name: "Suivi Budgétaire Campagnes Orange",
    icon: "Coins",
    tint: "orange",
    perRole: {
      admin: "Validation & Suivi",
      contributeur: "Validation & Suivi",
      validateur: "Signature Budget",
      lecteur: "Lecture Seule"
    }
  },
  {
    id: "validation",
    name: "Validation des Campagnes & Livrables",
    icon: "Check",
    tint: "green",
    perRole: {
      admin: "Signataire Agence",
      contributeur: "Proposition",
      validateur: "Signataire Agence",
      lecteur: "Lecture Seule"
    }
  },
  {
    id: "rbac",
    name: "Console RBAC Matrice Globale",
    icon: "Shield",
    tint: "violet",
    perRole: {
      admin: "Accès Restreint",
      contributeur: "Accès Restreint",
      validateur: "Accès Restreint",
      lecteur: "Aucun Accès"
    }
  }
];

export const IAM_TABS = [
  { id: "directory", label: "Annuaire & Dashboard", icon: "UsersRound" },
  { id: "onboarding", label: "Création & Onboarding", icon: "UserPlus" },
  { id: "profile", label: "Profil Détaillé", icon: "UserCheck" },
  { id: "export", label: "Fiche Export PDF", icon: "Printer" },
  { id: "security", label: "Rôles & Matrice", icon: "Shield" }
];

export const PROFILE_SUB_TABS = [
  { id: "infos", label: "1. Informations Générales", icon: "Info" },
  { id: "desc", label: "2. Description & Poste", icon: "Briefcase" },
  { id: "docs", label: "3. Documents Légaux (CNI, NIU, PDF)", icon: "FileText", highlight: true },
  { id: "social", label: "4. Réseaux & Canaux", icon: "Globe" },
  { id: "iam", label: "5. Paramètres IAM & Sessions", icon: "Shield" },
  { id: "prefs", label: "6. Préférences & Alertes", icon: "SlidersHorizontal" }
];
