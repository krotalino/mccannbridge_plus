import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Shield, Activity, Download, Plus, Search, 
  LayoutGrid, List, RefreshCw, CheckCircle2, Building2
} from 'lucide-react';
import { INITIAL_USERS } from '../../data/initialUsers';
import UsersDirectoryTab from '../../components/users/UsersDirectoryTab';
import RolesPermissionsTab from '../../components/users/RolesPermissionsTab';
import AuditSecurityTab from '../../components/users/AuditSecurityTab';
import UsersExportTab from '../../components/users/UsersExportTab';
import MemberCard from '../../components/users/MemberCard';
import AddMemberModal from '../../components/users/AddMemberModal';
import EditMemberModal from '../../components/users/EditMemberModal';
import QuickMessageModal from '../../components/users/QuickMessageModal';
import UserProfileModal from '../../components/users/UserProfileModal';

const LOCAL_STORAGE_KEY = 'mccann_bridge_team_v4';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('annuaire');

  // Persistence Locale
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erreur lecture localStorage:', e);
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Erreur écriture localStorage:', e);
    }
  }, [users]);

  // Filtres Annuaire
  const [selectedTeam, setSelectedTeam] = useState('mccann'); // 'mccann' | 'orange' | 'all'
  const [activeDept, setActiveDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [messagingMember, setMessagingMember] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Réinitialiser la liste
  const handleReset = () => {
    if (window.confirm("Réinitialiser l'annuaire avec la liste officielle initiale des collaborateurs ?")) {
      setUsers(INITIAL_USERS);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      triggerToast("Annuaire réinitialisé avec succès");
    }
  };

  // Actions CRUD
  const handleAddMember = (newMember) => {
    const formatted = {
      ...newMember,
      id: newMember.id || `user-custom-${Date.now()}`,
      matricule: newMember.matricule || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      type: newMember.team === 'orange' ? 'client' : 'agence',
      statut: newMember.statut || 'actif',
      derniereConnexion: 'À l\'instant',
    };
    setUsers(prev => [formatted, ...prev]);
    setShowAddModal(false);
    triggerToast(`✓ Collaborateur ${formatted.name} ajouté avec succès`);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (viewingProfile?.id === updatedUser.id) {
      setViewingProfile(updatedUser);
    }
    setEditingMember(null);
    triggerToast(`✓ Profil de ${updatedUser.name} mis à jour`);
  };

  const handleDeleteUser = (member) => {
    if (window.confirm(`Voulez-vous vraiment retirer ${member.name} de l'équipe ?`)) {
      setUsers(prev => prev.filter(u => u.id !== member.id));
      if (viewingProfile?.id === member.id) setViewingProfile(null);
      triggerToast(`Collaborateur ${member.name} retiré`);
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.statut === 'actif' ? 'inactif' : 'actif';
        triggerToast(`Statut de ${u.name} : ${newStatus.toUpperCase()}`);
        return { ...u, statut: newStatus };
      }
      return u;
    }));
  };

  const handleSendMessage = (member, msg) => {
    triggerToast(`✓ Message direct envoyé à ${member.name}`);
    setMessagingMember(null);
  };

  const handleMail = (member) => {
    if (member.email) {
      window.location.href = `mailto:${member.email}`;
    } else {
      triggerToast(`Aucune adresse email configurée pour ${member.name}`);
    }
  };

  // Liste des départements calculée dynamiquement
  const departments = useMemo(() => {
    const relevantUsers = selectedTeam === 'all'
      ? users
      : users.filter(u => selectedTeam === 'mccann' ? u.type === 'agence' : u.type === 'client');
    
    const set = new Set();
    relevantUsers.forEach(u => {
      const d = u.department || u.entite;
      if (d) set.add(d.trim());
    });
    return ['all', ...Array.from(set)];
  }, [users, selectedTeam]);

  // Utilisateurs filtrés pour l'affichage en cartes ou tableau
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Équipe
      if (selectedTeam === 'mccann' && u.type !== 'agence') return false;
      if (selectedTeam === 'orange' && u.type !== 'client') return false;

      // Pôle / Département
      if (activeDept !== 'all') {
        const dept = (u.department || u.entite || '').toLowerCase();
        if (!dept.includes(activeDept.toLowerCase())) return false;
      }

      // Recherche texte
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const n = (u.name || '').toLowerCase();
        const e = (u.email || '').toLowerCase();
        const p = (u.poste || u.profil || '').toLowerCase();
        const d = (u.department || u.entite || '').toLowerCase();
        if (!n.includes(q) && !e.includes(q) && !p.includes(q) && !d.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [users, selectedTeam, activeDept, searchQuery]);

  const mccannCount = useMemo(() => users.filter(u => u.type === 'agence').length, [users]);
  const orangeCount = useMemo(() => users.filter(u => u.type === 'client').length, [users]);

  const tabs = [
    { id: 'annuaire', label: 'Annuaire des Membres', icon: Users, count: users.length },
    { id: 'roles', label: 'Rôles & Permissions', icon: Shield },
    { id: 'audit', label: 'Audit & Sécurité', icon: Activity },
    { id: 'export', label: 'Export & Données', icon: Download },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#0E1428] border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. EN-TÊTE PRINCIPAL ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-orange-500/20 text-[#FF6600] border border-orange-500/30">
                <Users className="w-6 h-6" />
              </span>
              Utilisateurs & Droits
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Gouvernance des équipes Agence McCann Douala & Client Orange Cameroun
          </p>
        </div>

        {/* Boutons d'actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
            title="Réinitialiser l'annuaire"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Réinitialiser démo</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6600] to-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un collaborateur</span>
          </button>
        </div>
      </div>

      {/* ─── 2. ONGLETS DE NAVIGATION ─── */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0F142D] border border-white/10 rounded-2xl w-full sm:w-max overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF6600] to-orange-500 text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── 3. CONTENU DES ONGLETS ─── */}

      {/* ONGLET 1: ANNUAIRE DES MEMBRES */}
      {activeTab === 'annuaire' && (
        <div className="space-y-6">

          {/* Bandeau de contrôle : Bascule Équipe + Recherche + Mode d'affichage */}
          <div className="p-4 rounded-2xl bg-[#0F142D] border border-white/10 shadow-xl space-y-4">
            
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              {/* Sélecteur d'équipe (McCann / Orange / Tous) */}
              <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl border border-white/10 overflow-x-auto">
                <button
                  onClick={() => {
                    setSelectedTeam('mccann');
                    setActiveDept('all');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
                    selectedTeam === 'mccann'
                      ? 'bg-[#FF6600] text-white shadow-md'
                      : 'text-orange-400/70 hover:text-orange-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>ÉQUIPE McCANN DOUALA ({mccannCount})</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedTeam('orange');
                    setActiveDept('all');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
                    selectedTeam === 'orange'
                      ? 'bg-[#00D4FF] text-[#080B17] shadow-md'
                      : 'text-cyan-400/70 hover:text-cyan-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#080B17]"></span>
                  <span>ÉQUIPE CLIENT ORANGE ({orangeCount})</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedTeam('all');
                    setActiveDept('all');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedTeam === 'all'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <span>TOUS ({users.length})</span>
                </button>
              </div>

              {/* Recherche + Bascule Cartes / Tableau */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, rôle, entité..."
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF6600]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Bascule Mode Cartes / Tableau */}
                <div className="flex items-center p-1 bg-black/40 rounded-xl border border-white/10">
                  <button
                    onClick={() => setViewMode('cards')}
                    title="Vue Grille de Cartes"
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'cards'
                        ? 'bg-[#FF6600] text-white shadow-md'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setViewMode('table')}
                    title="Vue Tableau Console IAM"
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'table'
                        ? 'bg-[#FF6600] text-white shadow-md'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Pilules de filtres par pôle / département */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-thin">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider flex-shrink-0 mr-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                Pôles :
              </span>
              {departments.map((dept) => {
                const isSelected = activeDept === dept;
                const label = dept === 'all' ? 'Tous les pôles' : dept;
                return (
                  <button
                    key={dept}
                    onClick={() => setActiveDept(dept)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? selectedTeam === 'orange'
                          ? 'bg-[#00D4FF] text-[#080B17] font-bold shadow-md'
                          : 'bg-[#FF6600] text-white font-bold shadow-md'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* AFFICHAGE EN MODE CARTES (MEMBERCARD) */}
          {viewMode === 'cards' && (
            <div>
              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0F142D] border border-white/10">
                  <p className="text-sm font-semibold text-white/60">
                    Aucun collaborateur ne correspond à ces critères de recherche.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveDept('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-bold transition-all"
                  >
                    Effacer les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredUsers.map((u) => (
                    <MemberCard
                      key={u.id}
                      member={u}
                      onEdit={(m) => setEditingMember(m)}
                      onDelete={(m) => handleDeleteUser(m)}
                      onMail={(m) => handleMail(m)}
                      onChat={(m) => setMessagingMember(m)}
                      onOpenProfile={(m) => setViewingProfile(m)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AFFICHAGE EN MODE TABLEAU CONSOLE IAM (USERSDIRECTORYTAB) */}
          {viewMode === 'table' && (
            <UsersDirectoryTab
              users={filteredUsers}
              onViewProfile={(u) => setViewingProfile(u)}
              onExportPdf={() => setActiveTab('export')}
              onOpenSecurity={() => setActiveTab('roles')}
              onToggleStatus={handleToggleStatus}
              onOpenCreate={() => setShowAddModal(true)}
            />
          )}

        </div>
      )}

      {/* ONGLET 2: RÔLES & PERMISSIONS RBAC */}
      {activeTab === 'roles' && (
        <RolesPermissionsTab />
      )}

      {/* ONGLET 3: AUDIT & SÉCURITÉ */}
      {activeTab === 'audit' && (
        <AuditSecurityTab />
      )}

      {/* ONGLET 4: EXPORT & DONNÉES */}
      {activeTab === 'export' && (
        <UsersExportTab users={users} />
      )}

      {/* ─── MODALES ─── */}

      {/* Modale d'ajout d'un collaborateur */}
      {showAddModal && (
        <AddMemberModal
          defaultTeam={selectedTeam === 'orange' ? 'orange' : 'mccann'}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMember}
        />
      )}

      {/* Modale d'édition rapide */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleUpdateUser}
        />
      )}

      {/* Modale d'envoi de message rapide direct */}
      {messagingMember && (
        <QuickMessageModal
          member={messagingMember}
          onClose={() => setMessagingMember(null)}
          onSend={handleSendMessage}
        />
      )}

      {/* Modale de fiche profil complète (Screen 1 à 5) */}
      {viewingProfile && (
        <UserProfileModal
          user={viewingProfile}
          onClose={() => setViewingProfile(null)}
          onUpdateUser={handleUpdateUser}
          onToggleStatus={handleToggleStatus}
          onExportPdf={() => {
            setViewingProfile(null);
            setActiveTab('export');
          }}
        />
      )}

    </div>
  );
}
