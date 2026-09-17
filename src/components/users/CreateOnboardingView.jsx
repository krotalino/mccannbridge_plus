import React, { useState } from 'react';
import { 
  UserPlus, ShieldCheck, Key, Eye, EyeOff, RefreshCw, 
  Copy, Check, Send, Sparkles, Building2, User, 
  Briefcase, Mail, Phone, Calendar, Smartphone, Lock,
  FileCheck, Shield, CheckCircle2, ChevronRight, Sliders
} from 'lucide-react';

const ENTITIES_MCCANN = [
  'Account Management (Direction de Clientèle)',
  'Pôle Création & Studio Graphique',
  'Production Audiovisuelle & 3D',
  'Direction du Planning Stratégique',
  'Media Planning & Achat d\'Espace',
  'Direction Administrative & Financière'
];

const ENTITIES_ORANGE = [
  'Direction Marketing & Communication',
  'Orange Money Cameroun (Fintech)',
  'Direction Entreprises & B2B Solutions',
  'Expérience Client & Digital (Maxit)',
  'Direction des Systèmes d\'Information (DSI)',
  'Contrôle de Gestion Média & Achats'
];

const ROLES_MCCANN = [
  'Directeur de Clientèle (Lead Compte Orange)',
  'Directeur Artistique Senior',
  'Chef de Pub Senior',
  'Media Planner Télécoms',
  'Concepteur-Rédacteur 360',
  'Traffic Manager & Coordination'
];

const ROLES_ORANGE = [
  'Brand Manager 4G/5G & Produits',
  'Responsable Marketing Orange Money',
  'Head of Brand & Digital Experience',
  'Contrôleur de Gestion Média',
  'Chef de Projet Digital & Maxit',
  'DSI Administrateur Réseau & Sécurité'
];

function generateSecurePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*+';
  let pwd = '';
  for (let i = 0; i < 16; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

export default function CreateOnboardingView({ 
  onAddMember, 
  onCancel, 
  onSuccessNavigate 
}) {
  const [tenancy, setTenancy] = useState('mccann'); // 'mccann' | 'orange'
  
  // Form fields
  const [nom, setNom] = useState('Ndjock');
  const [prenom, setPrenom] = useState('Audrey Christiane');
  const [email, setEmail] = useState('audrey.ndjock@mccann.cm');
  const [telephone, setTelephone] = useState('+237 699 45 28 10');
  const [matricule, setMatricule] = useState('MCC-DLA-8834');
  
  const [entite, setEntite] = useState('Account Management (Direction de Clientèle)');
  const [profil, setProfil] = useState('Directeur de Clientèle (Lead Compte Orange)');
  const [rbacRole, setRbacRole] = useState('Contributeur'); // Administrateur | Contributeur | Validateur | Lecteur Simple
  
  // Credentials & Security
  const [tempPassword, setTempPassword] = useState(generateSecurePassword);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Toggles
  const [sendEmailInvite, setSendEmailInvite] = useState(true);
  const [sendSmsOtp, setSendSmsOtp] = useState(true);
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [enable2FA, setEnable2FA] = useState(true);

  // Switch tenancy helper
  const handleTenancyChange = (target) => {
    setTenancy(target);
    if (target === 'mccann') {
      setEmail(prev => prev.replace('@orange.cm', '@mccann.cm'));
      setMatricule(`MCC-DLA-${Math.floor(1000 + Math.random() * 9000)}`);
      setEntite(ENTITIES_MCCANN[0]);
      setProfil(ROLES_MCCANN[0]);
    } else {
      setEmail(prev => prev.replace('@mccann.cm', '@orange.cm'));
      setMatricule(`ORG-CM-${Math.floor(1000 + Math.random() * 9000)}`);
      setEntite(ENTITIES_ORANGE[0]);
      setProfil(ROLES_ORANGE[0]);
    }
  };

  const handleSuggestEmail = () => {
    const cleanFirst = prenom.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLast = nom.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const domain = tenancy === 'mccann' ? 'mccann.cm' : 'orange.cm';
    if (cleanFirst && cleanLast) {
      setEmail(`${cleanFirst}.${cleanLast}@${domain}`);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard?.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegeneratePassword = () => {
    setTempPassword(generateSecurePassword());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      alert("Veuillez remplir les champs obligatoires (*)");
      return;
    }

    const fullName = `${prenom.trim()} ${nom.trim()}`;
    const initials = `${prenom.trim()[0] || ''}${nom.trim()[0] || ''}`.toUpperCase();

    const newMember = {
      id: `user-${tenancy}-${Date.now()}`,
      matricule,
      uid: matricule,
      type: tenancy === 'mccann' ? 'agence' : 'client',
      tenancyLabel: tenancy === 'mccann' ? 'AGENCE McCANN' : 'CLIENT ORANGE',
      nom: nom.trim(),
      prenom: prenom.trim(),
      name: fullName,
      email: email.trim(),
      emailPasserelle: `${nom.trim().toLowerCase()}@orange-bridge.net`,
      telephone: telephone.trim(),
      entite,
      department: entite.split('(')[0].trim(),
      profil,
      poste: profil,
      statut: 'actif',
      statutLabel: 'Actif (Nouveau compte)',
      derniereConnexion: 'À l\'instant',
      dateArrivee: new Date().toLocaleDateString('fr-FR'),
      avatar: initials,
      responsableMcCann: 'Jean-Marc Belinga (VP Executive Creative Director)',
      interlocuteurOrange: 'Sandrine Moukoko (Head of Brand & Digital Experience)',
      hardware: tenancy === 'mccann' ? 'MacBook Pro 16" M3 Pro (#HW-MCC-89)' : 'Dell XPS 15 4K (#HW-ORG-44)',
      fidoKey: 'YubiKey 5C NFC Activée',
      rbacRole: tenancy === 'mccann' ? 'McCANN_ACCOUNT_LEAD' : 'ORANGE_BRAND_APPROVER',
      rbacClientRole: 'BRIDGE_CONTRIBUTOR_L2',
      biographie: `Collaborateur ${tenancy === 'mccann' ? 'McCann Douala' : 'Orange Cameroun'} nouvellement provisionné sur l'infrastructure sécurisée BRIDGE IAM. Affecté à la gestion des campagnes et des livrables de marque.`,
      competences: ['Gestion de Projet', 'Suivi de Campagnes', 'Gouvernance IAM', 'Validation Livrables'],
      reseaux: {
        linkedin: `https://linkedin.com/in/${prenom.toLowerCase().replace(/\s+/g, '-')}-${nom.toLowerCase()}`,
        twitter: '',
        instagram: '',
        facebook: '',
        siteWeb: ''
      },
      parametres: {
        fuseau: 'Africa/Douala',
        changementObligatoire: forcePasswordChange,
        doubleAuth2FA: enable2FA,
        sessionsActives: [
          { appareil: 'Session initiale d\'onboarding', ip: '102.244.155.12', lieu: 'Douala, Cameroun', date: 'Créé aujourd\'hui' }
        ]
      },
      preferences: {
        notifMessages: true,
        notifRapports: true,
        notifFinances: false,
        notifAlertes: true,
        theme: 'sombre'
      }
    };

    onAddMember(newMember);
  };

  const isAgency = tenancy === 'mccann';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ─── BREADCRUMB & HEADER ─── */}
      <div>
        <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
          <span>UTILISATEURS &amp; DROITS</span>
          <span>&gt;</span>
          <span>ONBOARDING</span>
          <span>&gt;</span>
          <span className="text-[#FF6600]">NOUVEAU PROFIL</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1.5">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-br from-[#FF6600] to-orange-500 text-white shadow-md">
              <UserPlus className="w-5 h-5" />
            </span>
            <span>Création &amp; Provisioning d'Accès Collaborateur</span>
          </h1>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 self-start flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Politique IAM Bi-Rive v4.2 Conforme</span>
          </span>
        </div>
        
        <p className="text-xs text-white/60 mt-1">
          Définition des métadonnées, assignation du département et calcul instantané des habilitations de sécurité bi-rive.
        </p>
      </div>

      {/* ─── TENANCY SELECTOR CARDS (Bi-Rive) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* McCann Card */}
        <div 
          onClick={() => handleTenancyChange('mccann')}
          className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between shadow-xl backdrop-blur-xl ${
            isAgency
              ? 'bg-gradient-to-r from-[#FF6600]/25 to-[#FF8C00]/15 border-2 border-[#FF6600] shadow-orange-950/40'
              : 'bg-[#0E1428]/90 border border-white/10 opacity-70 hover:opacity-100 hover:border-[#FF6600]/50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FF6600] text-white font-black text-sm flex items-center justify-center shadow-lg">
              MC
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#FF6600] uppercase tracking-wider">CÔTÉ AGENCE</div>
              <div className="font-extrabold text-white text-base">McCann Douala</div>
            </div>
          </div>

          {isAgency ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#FF6600] text-white shadow-md">
              ACTIF &rarr;
            </span>
          ) : (
            <Sliders className="w-4 h-4 text-white/40" />
          )}
        </div>

        {/* Orange Card */}
        <div 
          onClick={() => handleTenancyChange('orange')}
          className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between shadow-xl backdrop-blur-xl ${
            !isAgency
              ? 'bg-gradient-to-r from-[#00D4FF]/25 to-[#0EA5E9]/15 border-2 border-[#00D4FF] shadow-cyan-950/40'
              : 'bg-[#0E1428]/90 border border-white/10 opacity-70 hover:opacity-100 hover:border-[#00D4FF]/50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#00D4FF] text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
              OC
            </div>
            <div>
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">CÔTÉ CLIENT</div>
              <div className="font-extrabold text-white text-base">Orange Cameroun</div>
            </div>
          </div>

          {!isAgency ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#00D4FF] text-slate-950 shadow-md">
              ACTIF &rarr;
            </span>
          ) : (
            <Sliders className="w-4 h-4 text-white/40" />
          )}
        </div>

      </div>

      {/* ─── TWO-COLUMN FORM LAYOUT ─── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Identité & Rattachement (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Card: Identité & Coordonnées Pro */}
          <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF6600]" />
                <span>Identité &amp; Coordonnées Pro</span>
              </span>
              <span className="text-[10px] font-mono text-white/40">REF-ONB-2025-09</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase mb-1">Nom de Famille *</label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080B17] border border-white/10 rounded-xl text-white font-semibold focus:outline-none focus:border-[#FF6600] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase mb-1">Prénoms Complets *</label>
                <input
                  type="text"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080B17] border border-white/10 rounded-xl text-white font-semibold focus:outline-none focus:border-[#FF6600] transition-colors"
                />
              </div>
            </div>

            <div className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-white/70 uppercase">Adresse Email Professionnelle *</label>
                <span className="text-[10px] text-emerald-400 font-bold">● Domaine vérifié &amp; disponible</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3 pr-24 py-2 bg-[#080B17] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#FF6600] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleSuggestEmail}
                  className="absolute right-2 top-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
                >
                  @ Suggérer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase mb-1">Téléphone Mobile Pro (OTP / 2FA) *</label>
                <input
                  type="text"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080B17] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#FF6600] transition-colors"
                />
                <span className="text-[10px] text-white/40 block mt-1">Format validé : Réseau Cameroun (+237)</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase mb-1">Matricule RH Interne</label>
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080B17] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#FF6600] transition-colors"
                />
                <span className="text-[10px] text-white/40 block mt-1">Généré par le répertoire RH centralisé</span>
              </div>
            </div>
          </div>

          {/* Card: Rattachement Structurel */}
          <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Rattachement Structurel &amp; Rôle IAM</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isAgency 
                  ? 'bg-orange-500/10 text-[#FF6600] border border-orange-500/30' 
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              }`}>
                {isAgency ? 'McCANN DOUALA' : 'ORANGE CAMEROUN'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase mb-1">Entité / Direction *</label>
                <select
                  value={entite}
                  onChange={(e) => setEntite(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080B17] border border-white/10 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-400"
                >
                  {(isAgency ? ENTITIES_MCCANN : ENTITIES_ORANGE).map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase mb-1">Profil Métier Spécifique *</label>
                <select
                  value={profil}
                  onChange={(e) => setProfil(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080B17] border border-white/10 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-400"
                >
                  {(isAgency ? ROLES_MCCANN : ROLES_ORANGE).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rôle RBAC BRIDGE Pills */}
            <div className="text-xs">
              <label className="block text-[11px] font-bold text-white/70 uppercase mb-2">Rôle RBAC BRIDGE Autorisé *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Administrateur', sub: 'Tous droits entité', color: 'border-purple-500 bg-purple-500/20 text-purple-300' },
                  { id: 'Contributeur', sub: 'Stratégique Lead', color: 'border-orange-500 bg-orange-500/20 text-orange-400' },
                  { id: 'Validateur', sub: 'Signataire Budget', color: 'border-cyan-500 bg-cyan-500/20 text-cyan-300' },
                  { id: 'Lecteur Simple', sub: 'Consultation pure', color: 'border-emerald-500 bg-emerald-500/20 text-emerald-300' }
                ].map(r => {
                  const isCurrent = rbacRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRbacRole(r.id)}
                      className={`p-2.5 rounded-xl text-left transition-all ${
                        isCurrent 
                          ? `${r.color} shadow-lg border` 
                          : 'border border-white/10 bg-[#080B17] hover:border-white/30 text-white/70'
                      }`}
                    >
                      <div className="font-bold text-xs">{r.id}</div>
                      <div className="text-[9px] opacity-75">{r.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* N+1 Validator */}
            <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] font-bold text-white/40 uppercase">Validateur N+1 Requis</div>
                <div className="font-bold text-white">K. Manga (Super Admin BRIDGE / Directeur Général Adjoint)</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/60">Assigné automatiquement</span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Identifiants Temporaires & Modules (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card: Identifiants Temporaires */}
          <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#FF6600]" />
                <span>Identifiants Temporaires</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Chiffré AES-256</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/70 uppercase mb-1">Mot de passe temporaire généré</label>
              <div className="flex items-center justify-between p-2.5 bg-[#080B17] border border-white/10 rounded-xl font-mono text-white text-sm">
                <span>{showPassword ? tempPassword : '••••••••••••••••'}</span>
                <div className="flex items-center gap-2 text-white/40">
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-white transition-colors"
                    title={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleRegeneratePassword}
                    className="hover:text-white transition-colors"
                    title="Générer un nouveau mot de passe"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCopyPassword}
                    className="hover:text-white transition-colors"
                    title="Copier le mot de passe"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/50 mt-1.5">
                <span>Niveau de sécurité : <strong className="text-cyan-400 font-bold">Très Robuste</strong></span>
                <span>16 car. (Maj, Min, Symb, Chiffres)</span>
              </div>
              
              <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden flex gap-1">
                <div className="bg-cyan-400 h-full w-1/4"></div>
                <div className="bg-cyan-400 h-full w-1/4"></div>
                <div className="bg-cyan-400 h-full w-1/4"></div>
                <div className="bg-cyan-400 h-full w-1/4"></div>
              </div>
            </div>

            {/* Toggles & Options */}
            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendEmailInvite}
                  onChange={(e) => setSendEmailInvite(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-black/40 text-orange-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white">Envoyer l'invitation sécurisée par Email</div>
                  <div className="text-[11px] text-white/40">Lien chiffré à validité 48 heures avec jeton d'onboarding</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendSmsOtp}
                  onChange={(e) => setSendSmsOtp(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white">Notification SMS avec code OTP initial</div>
                  <div className="text-[11px] text-white/40">Envoi instantané sur le terminal mobile déclaré</div>
                </div>
              </label>

              <div className="p-3 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Changement obligatoire du mot de passe</div>
                  <div className="text-[10px] text-white/40">Imposé dès la première session IAM</div>
                </div>
                <button
                  type="button"
                  onClick={() => setForcePasswordChange(!forcePasswordChange)}
                  className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                    forcePasswordChange ? 'bg-[#FF6600] justify-end' : 'bg-white/20 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Activer la Double Authentification (2FA)</div>
                  <div className="text-[10px] text-white/40">Enrôlement FIDO2 / Authenticator obligatoire</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnable2FA(!enable2FA)}
                  className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                    enable2FA ? 'bg-[#00D4FF] justify-end' : 'bg-white/20 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-slate-950 shadow-sm"></div>
                </button>
              </div>
            </div>

          </div>

          {/* Card: Provisioning des Modules */}
          <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">Provisioning des Modules</span>
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-[11px] text-white/50">
              Modules BRIDGE assignés selon la politique du profil <strong className="text-white">{profil}</strong> :
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span>Calendrier Éditorial Bi-Rive</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                  {isAgency ? 'Édition Complète' : 'Validation & Vue'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <FileCheck className="w-3.5 h-3.5 text-white/40" />
                  <span>Suivi Budgétaire Campagnes Orange</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                  Validation &amp; Suivi
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/40" />
                  <span>Validation des Campagnes &amp; Livrables</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400">
                  {isAgency ? 'Signataire Agence' : 'Signataire Client Orange'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ACTION FOOTER */}
        <div className="lg:col-span-12 p-4 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Prêt pour déploiement IAM sécurisé &bull; Signature cryptographique automatique par le compte K. Manga</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              Annuler / Réinitialiser
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #FF6600, #FF8C00)',
                boxShadow: '0 4px 20px rgba(255, 102, 0, 0.4)'
              }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Créer &amp; Notifier le Collaborateur (Déployer l'accès)</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
