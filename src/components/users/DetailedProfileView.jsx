import React, { useState } from 'react';
import { 
  User, Briefcase, Share2, Shield, Settings, FileText, 
  Mail, Phone, Building, Calendar, Globe, Plus, Trash2,
  Check, Lock, Smartphone, Laptop, AlertTriangle, ExternalLink,
  MapPin, ShieldCheck, Clock, CheckCircle2, ChevronRight,
  Sparkles, KeyRound, Monitor, Cpu, LogOut, Download
} from 'lucide-react';

export default function DetailedProfileView({
  user,
  allUsers = [],
  onSelectUser,
  onExportPdf,
  onUpdateUser
}) {
  const [activeSubTab, setActiveSubTab] = useState('poste'); // 'general' | 'poste' | 'social' | 'security' | 'preferences'
  
  // Local edit states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [newSkill, setNewSkill] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync with prop change
  React.useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-12 text-center text-white/50 rounded-2xl bg-[#0E1428] border border-white/10">
        Aucun collaborateur sélectionné.
      </div>
    );
  }

  const isAgency = formData.type === 'agence';
  const brandColor = isAgency ? '#FF6600' : '#00D4FF';
  const brandName = isAgency ? 'McCann Douala' : 'Orange Cameroun';
  const initials = formData.avatar || (formData.prenom ? `${formData.prenom[0]}${formData.nom ? formData.nom[0] : ''}` : (formData.name?.slice(0, 2) || 'AE')).toUpperCase();

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updated = [...(formData.competences || []), newSkill.trim()];
      setFormData(prev => ({ ...prev, competences: updated }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = (formData.competences || []).filter(s => s !== skillToRemove);
    setFormData(prev => ({ ...prev, competences: updated }));
  };

  const handleSaveProfile = () => {
    onUpdateUser?.(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ─── USER QUICK SWITCHER HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/40 font-bold uppercase tracking-wider">Collaborateur affiché :</span>
          <select
            value={user.id}
            onChange={(e) => {
              const found = allUsers.find(u => u.id === e.target.value);
              if (found) onSelectUser(found);
            }}
            className="px-3 py-1.5 bg-[#080B17] border border-white/10 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-cyan-400"
          >
            {allUsers.map(u => (
              <option key={u.id} value={u.id}>
                {u.name || `${u.prenom || ''} ${u.nom || ''}`} — {u.type === 'agence' ? 'McCann' : 'Orange'} ({u.profil || u.poste})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
              <Check className="w-3.5 h-3.5" /> Profil enregistré !
            </span>
          )}
          <button
            onClick={() => onExportPdf(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-bold border border-white/10 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Fiche PDF Officielle</span>
          </button>
        </div>
      </div>

      {/* ─── HERO PROFILE HEADER (Screen 6 Style) ─── */}
      <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-2xl shrink-0"
                style={{
                  background: isAgency 
                    ? 'linear-gradient(135deg, #FF6600 0%, #FF9D3D 100%)' 
                    : 'linear-gradient(135deg, #00D4FF 0%, #0077B6 100%)',
                  boxShadow: `0 8px 30px ${isAgency ? 'rgba(255, 102, 0, 0.4)' : 'rgba(0, 212, 255, 0.4)'}`
                }}
              >
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0E1428] flex items-center justify-center text-white" title="En Ligne">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Identity info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {formData.name || `${formData.prenom || ''} ${formData.nom || ''}`}
                </h1>
                
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isAgency 
                    ? 'border-[#FF6600]/40 bg-[#FF6600]/15 text-[#FF6600]' 
                    : 'border-[#00D4FF]/40 bg-[#00D4FF]/15 text-[#00D4FF]'
                }`}>
                  ● {isAgency ? 'AGENCE McCANN' : 'CLIENT ORANGE'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
                  ● En Ligne (Session active)
                </span>
              </div>

              <p className="text-xs text-white/80 font-semibold">
                {formData.profil || formData.poste || 'Collaborateur BRIDGE'} // Lead Brand &amp; Visual Identity
              </p>

              {/* Metadata chips */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-white/40" />
                  <span>Douala, Cameroun</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 font-mono text-white/70">
                  <Mail className="w-3.5 h-3.5 text-white/40" />
                  <span>{formData.email}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 font-mono text-cyan-400">
                  <span>Passerelle: {formData.emailPasserelle || `${formData.nom?.toLowerCase() || 'user'}@orange-bridge.net`}</span>
                </span>
                <span>&bull;</span>
                <span className="font-mono text-white/40">
                  UID: {formData.matricule || formData.uid || 'MC-CM-8842'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <button
              onClick={() => onExportPdf(user)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exporter la fiche PDF</span>
            </button>

            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Enregistrer</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-1.5"
                style={{
                  background: isAgency ? '#FF6600' : '#00D4FF',
                  color: isAgency ? '#ffffff' : '#080B17'
                }}
              >
                <span>MODIFIER LE PROFIL</span>
              </button>
            )}
          </div>

        </div>

        {/* ─── 5 SUB-TABS NAVIGATION (SCREEN 6) ─── */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-white/10 text-xs font-bold scrollbar-none">
          {[
            { id: 'general', label: '1. Informations Générales', icon: User },
            { id: 'poste', label: '2. Description & Poste', icon: Briefcase },
            { id: 'social', label: '3. Réseaux Sociaux & Liens', icon: Share2 },
            { id: 'security', label: '4. Paramètres IAM & Sécurité', icon: Shield },
            { id: 'preferences', label: '5. Préférences & Alertes', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#1C264D] text-white shadow-md border border-white/15'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? (isAgency ? 'text-[#FF6600]' : 'text-cyan-400') : 'text-white/40'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ─── SUB-TAB CONTENT ─── */}

      {/* ─── 2. DESCRIPTION & POSTE (THE FLAGSHIP IMMERSIVE SCREEN 6) ─── */}
      {activeSubTab === 'poste' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Card: Rôle Opérationnel & Périmètre Bi-Rive */}
            <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>Rôle Opérationnel &amp; Périmètre Bi-Rive</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Consensus Niveau L3-DIR
                </span>
              </div>

              {/* Roles & Managers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold text-white/40 uppercase">Intitulé Officiel du Poste</div>
                  <div className="font-bold text-white text-sm">{formData.profil || 'Directeur Artistique Senior'}</div>
                  <div className="text-[11px] text-white/50">{formData.entite || 'Pôle Création & Studio Graphique'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold text-white/40 uppercase">Service &amp; Rattachement</div>
                  <div className="font-bold text-white text-sm">Pôle Marque &amp; Campagnes 360</div>
                  <div className="text-[11px] text-white/50">Siège McCann Bonanjo &bull; Douala</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold text-[#FF6600] uppercase">Responsable Rive McCann</div>
                  <div className="font-bold text-white">{formData.responsableMcCann || 'Jean-Marc Belinga'}</div>
                  <div className="text-[11px] text-white/50">VP Executive Creative Director (Douala)</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold text-[#00D4FF] uppercase">Interlocuteur Rive Orange</div>
                  <div className="font-bold text-white">{formData.interlocuteurOrange || 'Sandrine Moukoko'}</div>
                  <div className="text-[11px] text-white/50">Head of Brand &amp; Digital Experience (Orange CM)</div>
                </div>
              </div>

              {/* Contexte & Biographie */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-white/70">Biographie &amp; Contexte d'Intervention :</div>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.biographie || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, biographie: e.target.value }))}
                    className="w-full p-3 bg-[#080B17] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                ) : (
                  <p className="text-white/70 leading-relaxed bg-[#080B17] p-3.5 rounded-xl border border-white/5">
                    {formData.biographie || "Supervise la cohérence visuelle 360° des campagnes Orange Cameroun (Orange Money, Pulse, 5G, B2B). Référent principal pour l'application des chartes graphiques de marque et l'homogénéité des supports digitaux, print et médias."}
                  </p>
                )}
              </div>

              {/* Compétences Certifiées */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white/70">Compétences Certifiées &amp; Domaines d'Expertise :</span>
                  <span className="text-[10px] text-cyan-400">Périmètre Bi-Rive Vérifié</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(formData.competences || [
                    'Direction Artistique 360', 'Typographie & Layouting', 'Brand Guidelines Orange',
                    'Campagnes 4G/5G', 'Motion Design', 'Suite Adobe CC', 'Figma Enterprise', 'Gestion de Budget Créa'
                  ]).map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/5 text-white/80 border border-white/10 flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      {isEditing && (
                        <button 
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-white/40 hover:text-red-400 transition-colors ml-1"
                        >
                          &times;
                        </button>
                      )}
                    </span>
                  ))}

                  {isEditing && (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Nouvelle compétence..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        className="px-2.5 py-1 bg-[#080B17] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Card: Campagnes Actives en Supervision Bi-Rive */}
            <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Campagnes Actives en Supervision Bi-Rive</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400">3 Projets en cours</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Projet 1 */}
                <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Orange Money Cameroun // Refresh Visuel</div>
                      <div className="text-[11px] text-white/50">Livrables 360, KV TVC &amp; Campagne Affichage Urbain</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      84% Complété
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-[#00D4FF] h-full" style={{ width: '84%' }}></div>
                  </div>
                </div>

                {/* Projet 2 */}
                <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Pulse Universe 2024 // Activation Jeunesse</div>
                      <div className="text-[11px] text-white/50">Direction Artistique Réseaux Sociaux &amp; Stream Festival</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Validation Client Orange
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                {/* Projet 3 */}
                <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Orange Business Tour // Kit Salons B2B</div>
                      <div className="text-[11px] text-white/50">Déclinaisons Stands Yaoundé &amp; Douala</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                      Planifié S42
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Widget: Environnement de Création */}
            <div className="p-5 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-3.5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#FF6600]" />
                  <span>Environnement de Travail</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Poste Connecté</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#080B17] border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold text-white/40 uppercase">Station Studio Bonanjo</div>
                  <div className="font-bold text-white">Poste Graphique 01 &bull; Calibrage Prépresse</div>
                  <div className="text-[11px] text-white/50">Écrans EIZO ColorEdge CG279X (Profil Fogra 39)</div>
                </div>

                <div className="p-3 rounded-xl bg-[#080B17] border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold text-white/40 uppercase">Matériel Déclaré</div>
                  <div className="font-bold text-white">{formData.hardware || 'MacBook Pro 16" M3 Max 64Go'}</div>
                  <div className="text-[11px] text-white/50">Tablette Wacom Cintiq Pro 27 (#TAB-MCC-44)</div>
                </div>
              </div>
            </div>

            {/* Widget: Habilitations BRIDGE */}
            <div className="p-5 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-3.5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Habilitations BRIDGE</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Accréditation Niveau 3</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#080B17] border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold text-white/40 uppercase">Rôle RBAC Rive 1</div>
                  <div className="font-mono text-xs font-bold text-[#FF6600]">{formData.rbacRole || 'McCann_CREATIVE_LEAD'}</div>
                  <div className="text-[11px] text-white/50">Dépôt et versioning des assets validés</div>
                </div>

                <div className="p-3 rounded-xl bg-[#080B17] border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold text-white/40 uppercase">Rôle RBAC Rive 2</div>
                  <div className="font-mono text-xs font-bold text-[#00D4FF]">{formData.rbacClientRole || 'ORANGE_ASSET_APPROVER'}</div>
                  <div className="text-[11px] text-white/50">Signature conjointe des épreuves BAT</div>
                </div>

                <div className="p-3 rounded-xl bg-[#080B17] border border-white/5 space-y-1">
                  <div className="text-[10px] font-bold text-white/40 uppercase">Clé Matérielle FIDO2</div>
                  <div className="font-mono text-xs text-white flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>YubiKey 5C NFC #8841-AEP</span>
                  </div>
                  <div className="text-[11px] text-emerald-400">Valide jusqu'au 31 Déc 2025</div>
                </div>
              </div>
            </div>

            {/* Widget: Journal d'Audit Récent */}
            <div className="p-5 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Journal d'Audit Récent</span>
                </span>
                <span className="text-[10px] text-white/40">SIEM En Ligne</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#080B17] border border-white/5 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <div>
                    <div className="font-semibold text-white">Validation Kit OM Festif</div>
                    <div className="text-[10px] text-white/40">Il y a 23 min &bull; IP 102.244.155.12</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#080B17] border border-white/5 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                  <div>
                    <div className="font-semibold text-white">Connexion SSO Orange VPN Gateway</div>
                    <div className="text-[10px] text-white/40">Il y a 2h &bull; Authentification FIDO2 OK</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#080B17] border border-white/5 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                  <div>
                    <div className="font-semibold text-white">Signature Cryptographique Accord Campagne</div>
                    <div className="text-[10px] text-white/40">Hier à 16:42 &bull; SHA-256 Validé</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─── 1. INFORMATIONS GÉNÉRALES ─── */}
      {activeSubTab === 'general' && (
        <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#FF6600]" />
              <span>Détails de l'Identité &amp; Informations Collaborateur</span>
            </h3>
            <span className="text-xs text-white/50">Dossier RH centralisé</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase">Nom Complet</div>
              <div className="font-bold text-white text-sm mt-1">{formData.name}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase">Email Professionnel</div>
              <div className="font-mono text-white text-sm mt-1">{formData.email}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase">Téléphone Pro (OTP)</div>
              <div className="font-mono text-white text-sm mt-1">{formData.telephone || '+237 699 00 11 22'}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase">Entité / Direction</div>
              <div className="font-bold text-white text-sm mt-1">{formData.entite || 'Pôle Création & Studio Graphique'}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase">Matricule RH Interne</div>
              <div className="font-mono text-cyan-400 text-sm mt-1">{formData.matricule || 'MC-CM-8842'}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080B17] border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase">Date d'Arrivée</div>
              <div className="font-bold text-white text-sm mt-1">{formData.dateArrivee || '15 Mars 2021'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. RÉSEAUX SOCIAUX & LIENS ─── */}
      {activeSubTab === 'social' && (
        <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Réseaux Professionnels &amp; Portfolios Numériques</span>
            </h3>
            <span className="text-xs text-white/50">Visibilité Réseau Bi-Rive</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              { label: 'LinkedIn Pro', value: 'https://linkedin.com/in/alain-patrick-eboa', icon: Globe },
              { label: 'Behance Portfolio', value: 'https://behance.net/alaineboa-mccann', icon: Globe },
              { label: 'Dribbble Studio', value: 'https://dribbble.com/alain-eboa', icon: Globe },
              { label: 'Twitter / X', value: '@alain_eboa_cm', icon: Globe }
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase">{s.label}</div>
                  <div className="font-mono text-white text-xs mt-0.5">{s.value}</div>
                </div>
                <a 
                  href={s.value} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 4. PARAMÈTRES IAM & SÉCURITÉ ─── */}
      {activeSubTab === 'security' && (
        <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Sessions Actives &amp; Sécurité IAM</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono">TLS 1.3 Strict &bull; Zero Trust</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="font-bold text-white">MacBook Pro 16" &bull; Chrome 128 (Douala, CM)</div>
                  <div className="text-[11px] text-white/50">IP: 102.244.155.12 &bull; Session active actuelle</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                Cette Session
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#FF6600]" />
                <div>
                  <div className="font-bold text-white">iPhone 15 Pro &bull; Safari iOS (Orange CM Network)</div>
                  <div className="text-[11px] text-white/50">IP: 154.72.168.45 &bull; Dernière activité il y a 45 min</div>
                </div>
              </div>
              <button className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors">
                Révoquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. PRÉFÉRENCES & ALERTES ─── */}
      {activeSubTab === 'preferences' && (
        <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-400" />
              <span>Préférences de Notification &amp; Canaux BRIDGE</span>
            </h3>
            <span className="text-xs text-white/50">Alertes personnalisées</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { title: 'Validation des Livrables & Campagnes', desc: 'Recevoir une alerte instantanée lors d\'une signature bi-rive' },
              { title: 'Alertes Budgétaires Orange', desc: 'Notifications de dépassement ou de réallocation' },
              { title: 'Sécurité & Accès au Compte', desc: 'Alerte immédiate en cas de nouvelle session ou anomalie IP' }
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#080B17] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{p.title}</div>
                  <div className="text-[11px] text-white/40">{p.desc}</div>
                </div>
                <div className="w-9 h-5 rounded-full p-0.5 bg-[#FF6600] flex items-center justify-end cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
