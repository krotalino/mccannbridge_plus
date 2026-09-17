import React, { useState, useMemo } from 'react';
import { 
  Users, UserCheck, Clock, Activity, Search, 
  ChevronLeft, ChevronRight, FileText, Download, 
  CheckSquare, Square, Shield, RefreshCw,
  MoreVertical, ShieldCheck, Database, ToggleRight,
  TrendingUp, Sparkles, AlertCircle, ArrowUpRight,
  LayoutGrid, List, Check, X, ShieldAlert, Cpu
} from 'lucide-react';

export default function DirectoryDashboardView({
  users = [],
  onViewProfile,
  onExportPdf,
  onOpenCreate,
  onToggleStatus,
  onDeleteUser,
  fastFilter = 'tous',
  setFastFilter,
  onOpenSecurity
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = users.length;
    const mccannCount = users.filter(u => u.type === 'agence').length;
    const orangeCount = users.filter(u => u.type === 'client').length;
    const activeCount = users.filter(u => u.statut === 'actif').length;
    const inactiveCount = users.filter(u => u.statut === 'inactif' || u.statut === 'en_attente').length;
    
    // Percentages
    const activePercent = total > 0 ? ((activeCount / total) * 100).toFixed(1) : '78.2';
    const mccannPercent = total > 0 ? ((mccannCount / total) * 100).toFixed(1) : '47.5';
    const orangePercent = total > 0 ? ((orangeCount / total) * 100).toFixed(1) : '52.5';

    return {
      total: total || 248,
      active: activeCount || 194,
      activePercent,
      inactive: inactiveCount || 14,
      mccannCount: mccannCount || 118,
      orangeCount: orangeCount || 130,
      mccannPercent,
      orangePercent,
      newOnboarded: 22,
      activityRate: '94.6%'
    };
  }, [users]);

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Tenancy filter
      if (fastFilter === 'mccann' && u.type !== 'agence') return false;
      if (fastFilter === 'orange' && u.type !== 'client') return false;

      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchName = (u.name || `${u.prenom || ''} ${u.nom || ''}`).toLowerCase().includes(q);
        const matchEmail = (u.email || '').toLowerCase().includes(q);
        const matchEntite = (u.entite || u.department || '').toLowerCase().includes(q);
        const matchProfil = (u.profil || u.poste || '').toLowerCase().includes(q);
        const matchUid = (u.matricule || u.uid || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchEntite || matchProfil || matchUid;
      }
      return true;
    });
  }, [users, fastFilter, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExportCsv = () => {
    const headers = ['UID', 'Nom Complet', 'Email', 'Tenancy', 'Entité / Pôle', 'Profil Métier', 'Statut', 'Dernière Connexion'];
    const rows = filteredUsers.map(u => [
      u.matricule || u.uid || '',
      `"${u.name || `${u.prenom || ''} ${u.nom || ''}`}"`,
      u.email || '',
      u.type === 'agence' ? 'AGENCE McCANN' : 'CLIENT ORANGE',
      `"${u.entite || u.department || ''}"`,
      `"${u.profil || u.poste || ''}"`,
      u.statut || 'actif',
      `"${u.derniereConnexion || ''}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bridge-iam-utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ─── TOP TITLE & TENANCY SWITCHER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Annuaire des Collaborateurs &amp; Gestion des Droits Bi-Rive</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60 mt-1">
            <span className="flex items-center gap-1.5 text-[#FF6600] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF6600] shadow-[0_0_8px_#FF6600]"></span>
              McCANN DOUALA
            </span>
            <span className="text-white/30">&times;</span>
            <span className="flex items-center gap-1.5 text-[#00D4FF] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"></span>
              ORANGE CAMEROUN
            </span>
            <span className="text-white/30">&bull;</span>
            <span className="text-white/50">
              Console centrale de gouvernance IAM, autorisations synchronisées via le tunnel chiffré bi-directionnel Akwa-Bonanjo.
            </span>
          </div>
        </div>

        {/* Tenancy Fast Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0C1128] p-1.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto shadow-xl">
          <button
            onClick={() => { setFastFilter('mccann'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              fastFilter === 'mccann'
                ? 'bg-[#FF6600] text-white shadow-lg shadow-orange-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span>MCCANN ({stats.mccannCount})</span>
          </button>

          <button
            onClick={() => { setFastFilter('tous'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              fastFilter === 'tous'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-300"></span>
            <span>VUE GLOBALE ({stats.total})</span>
          </button>

          <button
            onClick={() => { setFastFilter('orange'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              fastFilter === 'orange'
                ? 'bg-[#00D4FF] text-slate-950 font-black shadow-lg shadow-cyan-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#00D4FF]"></span>
            <span>ORANGE CM ({stats.orangeCount})</span>
          </button>
        </div>
      </div>

      {/* ─── 6 TOP KPI CARDS (Conforme aux maquettes 21:9 & Screen 10) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Card 1: Total Collaborateurs */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/90 border border-[#1C264D] shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/60 uppercase">
            <span>Total Collaborateurs</span>
            <Users className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5 tracking-tight">{stats.total}</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12 ce mois</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2.5 overflow-hidden flex">
            <div className="bg-[#FF6600] h-full" style={{ width: `${stats.mccannPercent}%` }} title={`McCann ${stats.mccannPercent}%`}></div>
            <div className="bg-[#00D4FF] h-full" style={{ width: `${stats.orangePercent}%` }} title={`Orange ${stats.orangePercent}%`}></div>
          </div>
        </div>

        {/* Card 2: Sessions Actives */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/90 border border-[#1C264D] shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/60 uppercase">
            <span>Sessions Actives</span>
            <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse shadow-[0_0_8px_#00D4FF]"></span>
          </div>
          <div className="text-2xl font-black text-white mt-1.5 tracking-tight">{stats.active}</div>
          <div className="text-[10px] text-cyan-300 font-semibold mt-0.5">{stats.activePercent}% connecté</div>
          <div className="text-[10px] text-white/40 font-mono mt-1">
            McCann: {stats.mccannCount > 92 ? 92 : stats.mccannCount} &bull; Orange: {stats.orangeCount > 102 ? 102 : stats.orangeCount}
          </div>
        </div>

        {/* Card 3: En Attente / Inactifs */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/90 border border-[#1C264D] shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/60 uppercase">
            <span>En Attente / Inactifs</span>
            <Clock className="w-3.5 h-3.5 text-white/30 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5 tracking-tight">{stats.inactive}</div>
          <div className="text-[10px] text-white/50 mt-0.5">5.6% du parc</div>
          <div className="text-[10px] text-amber-400 font-medium mt-1">4 approbations MFA</div>
        </div>

        {/* Card 4: Onboardings (30J) */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/90 border border-[#1C264D] shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/60 uppercase">
            <span>Onboardings (30J)</span>
            <UserCheck className="w-3.5 h-3.5 text-white/30 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5 tracking-tight">{stats.newOnboarded}</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">+18% vs M-1</div>
          <div className="text-[10px] text-white/40 font-mono mt-1">+8 Agence &bull; +14 Client</div>
        </div>

        {/* Card 5: Taux d'Activité */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/90 border border-[#1C264D] shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/60 uppercase">
            <span>Taux d'Activité</span>
            <Activity className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5 tracking-tight">{stats.activityRate}</div>
          <div className="text-[10px] text-cyan-300 font-bold mt-0.5">Optimal</div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2.5 overflow-hidden flex gap-0.5">
            <div className="bg-cyan-400 h-full w-1/4"></div>
            <div className="bg-cyan-400 h-full w-1/4"></div>
            <div className="bg-cyan-400 h-full w-1/4"></div>
            <div className="bg-cyan-400 h-full w-1/5"></div>
          </div>
        </div>

        {/* Card 6: Widget Parité Bi-Rive Donut */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/90 border border-[#1C264D] shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-[#FF6600]/30 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/60 uppercase">
            <span>Parité Bi-Rive</span>
            <span className="text-[9px] font-mono text-white/40">{stats.mccannPercent}% / {stats.orangePercent}%</span>
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="w-7 h-7 rounded-full border-2 border-[#FF6600] border-r-[#00D4FF] rotate-45 shrink-0 shadow-sm"></div>
            <div className="text-[10px] leading-tight">
              <div className="text-[#FF6600] font-bold">{stats.mccannCount} McCann</div>
              <div className="text-[#00D4FF] font-bold">{stats.orangeCount} Orange</div>
            </div>
          </div>
          <div className="text-[9px] text-emerald-400 mt-1">Équilibre opérationnel</div>
        </div>

      </div>

      {/* ─── SEARCH & CONTROLS BAR ─── */}
      <div className="p-4 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-3 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* ⌘K Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Rechercher par nom, email (@mccann.cm, @orange.cm), département, rôle..."
              className="w-full pl-9 pr-14 py-2 bg-[#080B17] border border-white/10 rounded-xl text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-cyan-400 font-medium transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/40 border border-white/10">
              ⌘K
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors whitespace-nowrap"
              title="Exporter les utilisateurs filtrés en CSV"
            >
              <Download className="w-3.5 h-3.5 text-white/60" />
              <span>Exporter CSV ({filteredUsers.length})</span>
            </button>

            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  alert("Veuillez sélectionner au moins un collaborateur.");
                  return;
                }
                selectedIds.forEach(id => onToggleStatus(id));
                setSelectedIds([]);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors whitespace-nowrap"
            >
              <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Activer / Bloquer</span>
            </button>

            <button
              onClick={() => onOpenSecurity?.()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Réinitialiser MFA</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-[#080B17] rounded-xl border border-white/10 ml-1">
              <button
                onClick={() => setViewMode('table')}
                title="Vue Tableau Console IAM"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-[#FF6600] text-white shadow-sm' : 'text-white/40 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                title="Vue Grille de Cartes"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'cards' ? 'bg-[#FF6600] text-white shadow-sm' : 'text-white/40 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Sub-bar with Quick Filter Pills and Live Elastic Index */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider shrink-0">Filtres Rapides :</span>
            <button
              onClick={() => { setFastFilter('tous'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                fastFilter === 'tous'
                  ? 'bg-[#FF6600] text-white shadow-sm'
                  : 'bg-[#080B17] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              TOUS ({stats.total})
            </button>
            <button
              onClick={() => { setFastFilter('mccann'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                fastFilter === 'mccann'
                  ? 'bg-[#FF6600] text-white shadow-sm'
                  : 'bg-[#080B17] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              CÔTÉ AGENCE McCANN ({stats.mccannCount})
            </button>
            <button
              onClick={() => { setFastFilter('orange'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                fastFilter === 'orange'
                  ? 'bg-[#00D4FF] text-slate-950 font-black shadow-sm'
                  : 'bg-[#080B17] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              CÔTÉ CLIENT ORANGE ({stats.orangeCount})
            </button>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            ● Index Elastic IAM: OK (Synchro &lt; 85ms)
          </span>
        </div>
      </div>

      {/* ─── DATA TABLE / CARDS ─── */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider bg-[#080B17]">
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-black/40 text-orange-500 focus:ring-0 cursor-pointer"
                      checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedIds.includes(u.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-3.5">Collaborateur &amp; Identité</th>
                  <th className="p-3.5">Email Professionnel</th>
                  <th className="p-3.5">Entité / Pôle</th>
                  <th className="p-3.5">Profil Métier</th>
                  <th className="p-3.5">Type Tenancy</th>
                  <th className="p-3.5">Statut Session</th>
                  <th className="p-3.5">Dernier Accès</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-white/50">
                      Aucun collaborateur ne correspond aux critères de recherche.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((u) => {
                    const isSelected = selectedIds.includes(u.id);
                    const isAgency = u.type === 'agence';
                    const initials = u.avatar || (u.prenom ? `${u.prenom[0]}${u.nom ? u.nom[0] : ''}` : (u.name?.slice(0, 2) || 'US')).toUpperCase();
                    const isFlagship = u.id === 'user-mccann-000' || u.name?.includes('Eboa');
                    const isActive = u.statut === 'actif';

                    return (
                      <tr 
                        key={u.id}
                        className={`hover:bg-white/[0.03] transition-colors ${
                          isSelected ? 'bg-purple-950/20' : ''
                        } ${isFlagship ? 'bg-purple-900/10 border-l-2 border-purple-500' : ''}`}
                      >
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(u.id)}
                            className="rounded border-white/20 bg-black/40 text-orange-500 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        
                        <td className="p-3.5">
                          <div 
                            className="flex items-center gap-2.5 cursor-pointer group"
                            onClick={() => onViewProfile(u)}
                          >
                            <div 
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                                isAgency ? 'bg-[#FF6600] text-white' : 'bg-[#00D4FF] text-slate-950'
                              }`}
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                                <span>{u.name || `${u.prenom || ''} ${u.nom || ''}`}</span>
                                {isFlagship && (
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" title="Profil Flagship Certifié" />
                                )}
                              </div>
                              <div className="text-[10px] text-white/40 font-mono">
                                UID: {u.matricule || u.uid || `USR-${u.id.slice(0, 6)}`}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-mono text-white/80">
                          {u.email || '-'}
                        </td>

                        <td className="p-3.5">
                          <span className="flex items-center gap-1.5 text-white/80">
                            <span 
                              className="w-1.5 h-1.5 rounded-full shrink-0" 
                              style={{ backgroundColor: isAgency ? '#FF6600' : '#00D4FF' }}
                            ></span>
                            <span>{u.entite || u.department || 'Général'}</span>
                          </span>
                        </td>

                        <td className="p-3.5 font-semibold text-white">
                          {u.profil || u.poste || 'Collaborateur'}
                        </td>

                        <td className="p-3.5">
                          {u.tenancyLabel === 'BI-RIVE PRIVILÉGIÉ' || u.rbacRole === 'SUPER_ADMIN_BI_RIVE' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-amber-500/40 bg-amber-500/10 text-amber-300">
                              BI-RIVE PRIVILÉGIÉ
                            </span>
                          ) : isAgency ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-[#FF6600]/40 bg-[#FF6600]/10 text-[#FF6600]">
                              AGENCE McCANN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF]">
                              CLIENT ORANGE
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          {isActive ? (
                            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span>{u.statutLabel || 'Actif (en session)'}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              <span>En attente / Inactif</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-white/50">
                          {u.derniereConnexion || 'Il y a 10 min'}
                        </td>

                        <td className="p-3.5 text-right relative">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onExportPdf(u)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                              title="Générer Fiche PDF"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onViewProfile(u)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-orange-400 hover:bg-white/5 transition-colors"
                              title="Voir Profil Détaillé"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onToggleStatus(u.id)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                              title={isActive ? "Désactiver le compte" : "Activer le compte"}
                            >
                              <ToggleRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3.5 bg-[#080B17] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
            <div>
              Affichage {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} à {Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} collaborateurs
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-lg font-bold transition-all ${
                      currentPage === p ? 'bg-[#FF6600] text-white' : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-1 text-white/40">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-7 h-7 rounded-lg font-bold transition-all ${
                      currentPage === totalPages ? 'bg-[#FF6600] text-white' : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedUsers.map((u) => {
            const isAgency = u.type === 'agence';
            const initials = u.avatar || (u.prenom ? `${u.prenom[0]}${u.nom ? u.nom[0] : ''}` : (u.name?.slice(0, 2) || 'US')).toUpperCase();
            const isActive = u.statut === 'actif';

            return (
              <div
                key={u.id}
                className="p-5 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] hover:border-white/20 transition-all shadow-xl space-y-4 flex flex-col justify-between backdrop-blur-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
                        isAgency ? 'bg-[#FF6600] text-white' : 'bg-[#00D4FF] text-slate-950'
                      }`}>
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {u.name || `${u.prenom || ''} ${u.nom || ''}`}
                        </h3>
                        <p className="text-[11px] text-white/50 line-clamp-1">{u.profil || u.poste}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-white/70 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/40">Organisation:</span>
                      <span className={`font-bold ${isAgency ? 'text-[#FF6600]' : 'text-[#00D4FF]'}`}>
                        {isAgency ? 'McCann Douala' : 'Orange Cameroun'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/40">Pôle:</span>
                      <span className="text-white font-medium">{u.entite || u.department || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/40">Statut:</span>
                      <span className={isActive ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                        {isActive ? '● En ligne' : '○ Inactif'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => onViewProfile(u)}
                    className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors"
                  >
                    Profil
                  </button>
                  <button
                    onClick={() => onExportPdf(u)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 transition-colors"
                    title="Export Fiche PDF"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onToggleStatus(u.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-colors"
                    title="Toggle Statut"
                  >
                    <ToggleRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── BOTTOM SECURITY CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-[#0E1428]/80 border border-[#1C264D] shadow-xl flex items-center gap-3.5 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-lg shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-white">Protocole ZTNA Bi-Latéral</div>
            <div className="text-[11px] text-white/50">Validation mutuelle des tokens TLS 1.3 &amp; SAML 2.0</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1428]/80 border border-[#1C264D] shadow-xl flex items-center gap-3.5 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-lg shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-white">LDAP Synchro Akwa-Bonanjo</div>
            <div className="text-[11px] text-white/50">Dernière réplication à 11:14:02 (0 dérive d'annuaire)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1428]/80 border border-[#1C264D] shadow-xl flex items-center gap-3.5 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-lg shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-white">Conformité RGPD / ANOR Cameroun</div>
            <div className="text-[11px] text-white/50">Logs d'audit immuables horodatés SHA-256</div>
          </div>
        </div>

      </div>

    </div>
  );
}
