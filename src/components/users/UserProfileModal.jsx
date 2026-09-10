import React, { useState } from 'react';
import { 
  X, User, Briefcase, Share2, Shield, Settings, FileText, 
  Mail, Phone, Building, Calendar, Globe, Plus, Trash2,
  Check, Lock, Smartphone, Laptop, AlertTriangle, ExternalLink
} from 'lucide-react';

export default function UserProfileModal({ 
  user, 
  onClose, 
  onUpdateUser, 
  onExportPdf,
  onToggleStatus 
}) {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'poste' | 'social' | 'security' | 'preferences'
  
  // Local edit states
  const [formData, setFormData] = useState({
    ...user,
    biographie: user.biographie || '',
    competences: user.competences || [],
    reseaux: user.reseaux || {
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: '',
      tiktok: '',
      behance: '',
      dribbble: '',
      youtube: '',
      siteWeb: ''
    },
    parametres: user.parametres || {
      fuseau: 'Africa/Douala',
      sessionsActives: [
        { appareil: 'MacBook Pro 16" (Chrome 128)', ip: '102.244.155.12', lieu: 'Douala, CM', date: 'Session active' }
      ]
    },
    preferences: user.preferences || {
      notifMessages: true,
      notifRapports: true,
      notifFinances: false,
      notifAlertes: true,
      theme: 'sombre'
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  if (!user) return null;

  const isAgency = formData.type === 'agence';
  const themeColor = isAgency ? '#FF6600' : '#00D4FF';
  const brandName = isAgency ? 'McCann Douala' : 'Orange Cameroun';

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.competences.includes(newSkill.trim())) {
      const updated = {
        ...formData,
        competences: [...formData.competences, newSkill.trim()]
      };
      setFormData(updated);
      setNewSkill('');
      onUpdateUser?.(updated);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = {
      ...formData,
      competences: formData.competences.filter(s => s !== skillToRemove)
    };
    setFormData(updated);
    onUpdateUser?.(updated);
  };

  const handleSaveSocial = () => {
    onUpdateUser?.(formData);
    showToastNotification();
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setPasswordFeedback('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setPasswordFeedback('✓ Mot de passe mis à jour avec succès');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordFeedback(''), 4000);
  };

  const handleForceDisconnect = () => {
    const updated = {
      ...formData,
      parametres: {
        ...formData.parametres,
        sessionsActives: [
          { appareil: 'Session actuelle (Ce navigateur)', ip: '102.244.155.12', lieu: 'Douala, CM', date: 'En cours' }
        ]
      }
    };
    setFormData(updated);
    onUpdateUser?.(updated);
    showToastNotification();
  };

  const showToastNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleTogglePreference = (key) => {
    const updated = {
      ...formData,
      preferences: {
        ...formData.preferences,
        [key]: !formData.preferences[key]
      }
    };
    setFormData(updated);
    onUpdateUser?.(updated);
  };

  const handleThemeChange = (theme) => {
    const updated = {
      ...formData,
      preferences: {
        ...formData.preferences,
        theme
      }
    };
    setFormData(updated);
    onUpdateUser?.(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0F142D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-6 text-white">
        
        {/* Header Hero */}
        <div 
          className="relative px-6 pt-6 pb-4 border-b border-white/10"
          style={{
            background: `radial-gradient(ellipse at top left, ${isAgency ? 'rgba(255,102,0,0.15)' : 'rgba(0,212,255,0.15)'}, transparent 70%), #0A0E27`
          }}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Identity Bar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar with dynamic ring */}
            <div 
              className="relative w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${themeColor}, ${isAgency ? '#FF8C00' : '#0099FF'})`,
                boxShadow: `0 0 24px ${themeColor}40`,
                border: `3px solid ${themeColor}`
              }}
            >
              {formData.avatar || formData.name.slice(0, 2).toUpperCase()}
              <span 
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0F142D] ${
                  formData.statut === 'actif' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                title={formData.statut === 'actif' ? 'Compte Actif' : 'Compte Inactif'}
              ></span>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{formData.name}</h1>
                
                <span 
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: `${themeColor}25`,
                    color: themeColor,
                    border: `1px solid ${themeColor}50`
                  }}
                >
                  {isAgency ? 'Agence McCann' : 'Client Orange'}
                </span>

                <span 
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    formData.statut === 'actif' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {formData.statut === 'actif' ? '● En service' : '○ Suspendu'}
                </span>
              </div>

              <div className="text-sm font-semibold text-white/80 mb-2">
                {formData.poste || formData.profil} — <span className="text-white/50">{formData.entite}</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  onClick={() => onExportPdf?.(formData)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-md hover:brightness-110"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor}, ${isAgency ? '#FF8C00' : '#0099FF'})`
                  }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Exporter la fiche PDF
                </button>

                <button
                  onClick={() => setShowStatusConfirm(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    formData.statut === 'actif' 
                      ? 'border-rose-500/40 text-rose-300 hover:bg-rose-500/20' 
                      : 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
                  }`}
                >
                  {formData.statut === 'actif' ? 'Suspendre le compte' : 'Réactiver le compte'}
                </button>
              </div>
            </div>
          </div>

          {/* 5 Thematic Tabs Navigation */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 no-scrollbar border-t border-white/5 pt-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'general'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              1. Infos Générales
            </button>

            <button
              onClick={() => setActiveTab('poste')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'poste'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              2. Description &amp; Poste
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'social'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              3. Réseaux Sociaux &amp; Liens
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              4. Paramètres du Compte
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              5. Préférences
            </button>
          </div>
        </div>

        {/* Modal Body Content by Tab */}
        <div className="p-6 overflow-y-auto max-h-[60vh] bg-[#0A0E27]/50">
          
          {/* TAB 1: INFORMATIONS GÉNÉRALES */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-xs text-white/50 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-white/40" />
                    Nom et Prénom
                  </div>
                  <div className="text-base font-bold text-white">{formData.nom} {formData.prenom}</div>
                  <div className="text-xs text-white/40 mt-1">Identifiant Système : {formData.id}</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-xs text-white/50 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-white/40" />
                    Email Professionnel
                  </div>
                  <div className="text-base font-bold text-white">{formData.email}</div>
                  <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Domaine validé ({isAgency ? '@mccann.cm' : '@orange.cm'})
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-xs text-white/50 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-white/40" />
                    Téléphone (+237 Cameroun)
                  </div>
                  <div className="text-base font-bold text-white font-mono">{formData.telephone || '+237 699 00 00 00'}</div>
                  <div className="text-xs text-white/40 mt-1">Format standard Douala/Yaoundé</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-xs text-white/50 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-white/40" />
                    Entité de Rattachement
                  </div>
                  <div className="text-base font-bold text-white">{formData.entite}</div>
                  <div className="text-xs text-white/40 mt-1">Rive : {brandName}</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-xs text-white/50 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-white/40" />
                    Rôle / Profil Métier
                  </div>
                  <div className="text-base font-bold text-white">{formData.profil}</div>
                  <div className="text-xs text-white/40 mt-1">Intitulé : {formData.poste || formData.profil}</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-xs text-white/50 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-white/40" />
                    Arrivée &amp; Activité
                  </div>
                  <div className="text-base font-bold text-white">{formData.dateArrivee || '01/01/2023'}</div>
                  <div className="text-xs text-white/40 mt-1">Dernier accès : {formData.derniereConnexion}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESCRIPTION ET POSTE */}
          {activeTab === 'poste' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                  Intitulé Précis du Poste
                </label>
                <input
                  type="text"
                  value={formData.poste}
                  onChange={(e) => {
                    const updated = { ...formData, poste: e.target.value };
                    setFormData(updated);
                    onUpdateUser?.(updated);
                  }}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Ex: Traffic Manager & Chef de Projet Lead"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                  Biographie Courte / Description du Rôle (Texte libre)
                </label>
                <textarea
                  rows={4}
                  value={formData.biographie}
                  onChange={(e) => {
                    const updated = { ...formData, biographie: e.target.value };
                    setFormData(updated);
                    onUpdateUser?.(updated);
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 leading-relaxed"
                  placeholder="Décrivez les responsabilités clés et le périmètre d'intervention..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                  Compétences Clés (Tags / Chips ajoutables)
                </label>
                
                {/* Current Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.competences.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 border border-white/15 text-white shadow-sm"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-white/40 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add new chip */}
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Ajouter une compétence (ex: Social Ads, GA4...)"
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="flex items-center gap-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RÉSEAUX SOCIAUX & LIENS EXTERNES */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <p className="text-xs text-white/50 mb-3">
                Renseignez les profils professionnels et portfolio. Les liens sont cliquables et intégrés dans la fiche PDF officielle.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/profil' },
                  { key: 'twitter', label: 'Twitter / X', icon: '🐦', placeholder: 'https://x.com/pseudo' },
                  { key: 'instagram', label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/pseudo' },
                  { key: 'facebook', label: 'Facebook', icon: '👥', placeholder: 'https://facebook.com/profil' },
                  { key: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@pseudo' },
                  { key: 'behance', label: 'Behance', icon: '🎨', placeholder: 'https://behance.net/portfolio' },
                  { key: 'dribbble', label: 'Dribbble', icon: '🏀', placeholder: 'https://dribbble.com/portfolio' },
                  { key: 'youtube', label: 'YouTube', icon: '▶️', placeholder: 'https://youtube.com/@chaine' },
                  { key: 'siteWeb', label: 'Site Web / Portfolio Pro', icon: '🌐', placeholder: 'https://mon-portfolio.cm' },
                ].map((item) => (
                  <div key={item.key} className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between text-xs font-bold text-white/80 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span>{item.icon}</span> {item.label}
                      </span>
                      {formData.reseaux?.[item.key] && (
                        <a 
                          href={formData.reseaux[item.key]} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          Tester <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={formData.reseaux?.[item.key] || ''}
                      onChange={(e) => {
                        const updated = {
                          ...formData,
                          reseaux: {
                            ...formData.reseaux,
                            [item.key]: e.target.value
                          }
                        };
                        setFormData(updated);
                        onUpdateUser?.(updated);
                      }}
                      placeholder={item.placeholder}
                      className="w-full px-3 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveSocial}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Sauvegarder les liens externes
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PARAMÈTRES DU COMPTE */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password change */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-400" />
                  Changement de Mot de Passe
                </h3>
                
                {/* Security policy reminder */}
                <div className="p-3 mb-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-orange-300">
                  <strong>Politique de sécurité BRIDGE :</strong> Minimum 8 caractères, incluant au moins une majuscule, un chiffre et un caractère spécial.
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/60 mb-1">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  {passwordFeedback && (
                    <div className="text-xs font-medium text-amber-300">
                      {passwordFeedback}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all shadow"
                  >
                    Mettre à jour le mot de passe
                  </button>
                </form>
              </div>

              {/* Timezone */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Fuseau Horaire Opérationnel</div>
                  <div className="text-xs text-white/50">Défini par défaut pour l'Afrique Centrale</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs font-mono font-bold text-cyan-400">
                  Africa/Douala (GMT+1)
                </div>
              </div>

              {/* Active Sessions */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      Sessions &amp; Appareils Actifs
                    </h3>
                    <div className="text-xs text-white/50">Surveillance des connexions sécurisées</div>
                  </div>

                  <button
                    onClick={handleForceDisconnect}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
                  >
                    Déconnexion forcée des autres sessions
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.parametres?.sessionsActives || []).map((session, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-black/20 border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-white/40" />
                        <div>
                          <div className="font-semibold text-white">{session.appareil}</div>
                          <div className="text-white/40 font-mono text-[11px]">{session.ip} • {session.lieu}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400">{session.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRÉFÉRENCES UTILISATEUR */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Notifications */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white mb-1">Notifications par Email &amp; Système</h3>
                
                {[
                  { key: 'notifMessages', title: 'Nouveaux messages & briefs', desc: 'Alertes lors de la réception d’un brief ou commentaire sur une créa' },
                  { key: 'notifRapports', title: 'Rapports & bilans mensuels', desc: 'Synthèses consolidées et bilans de performance' },
                  { key: 'notifFinances', title: 'Validations financières & devis', desc: 'Bons de commande, décomptes et alertes de facturation' },
                  { key: 'notifAlertes', title: 'Alertes urgentes & Flash P0', desc: 'Notification immédiate pour les requêtes critiques en temps réel' },
                ].map((notif) => (
                  <div key={notif.key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-xs font-bold text-white">{notif.title}</div>
                      <div className="text-[11px] text-white/50">{notif.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePreference(notif.key)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        formData.preferences?.[notif.key] ? 'bg-orange-500' : 'bg-white/20'
                      }`}
                    >
                      <span 
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          formData.preferences?.[notif.key] ? 'translate-x-5' : 'translate-x-0'
                        }`} 
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Theme Selector */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <h3 className="text-sm font-bold text-white mb-2">Thème de l’Interface Utilisateur</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'sombre', label: 'Sombre Cosmique', desc: 'Standard BRIDGE' },
                    { id: 'clair', label: 'Clair Épuré', desc: 'Contraste élevé' },
                    { id: 'auto', label: 'Auto BRIDGE', desc: 'Synchronisé OS' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.preferences?.theme === t.id
                          ? 'bg-white/15 border-orange-500 shadow-md'
                          : 'bg-black/20 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{t.label}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0A0E27] flex items-center justify-between">
          <div className="text-xs text-white/40">
            {saveToast && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Modifications enregistrées
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Suspend/Activate */}
      {showStatusConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90">
          <div className="w-full max-w-md bg-[#161B3D] border border-white/20 rounded-2xl p-6 text-white shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-center text-lg font-bold mb-2">
              {formData.statut === 'actif' ? 'Suspendre ce compte ?' : 'Réactiver ce compte ?'}
            </h3>

            <p className="text-center text-xs text-white/60 mb-6 leading-relaxed">
              {formData.statut === 'actif'
                ? `L'accès à la plateforme BRIDGE pour ${formData.name} sera immédiatement révoqué. Les sessions actives seront closes.`
                : `L'accès sera rétabli avec les permissions d'origine pour ${formData.name}.`
              }
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white/70 bg-white/10 hover:bg-white/20 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onToggleStatus?.(formData.id);
                  setFormData({
                    ...formData,
                    statut: formData.statut === 'actif' ? 'inactif' : 'actif'
                  });
                  setShowStatusConfirm(false);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow ${
                  formData.statut === 'actif' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
