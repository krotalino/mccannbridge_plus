import React, { useState, useMemo } from 'react';
import { 
  Users, UserCheck, Clock, Activity, Search, Filter, 
  ChevronLeft, ChevronRight, FileText, Download, 
  CheckSquare, Square, KeyRound, Shield, RefreshCw,
  MoreVertical, ShieldCheck, Database, Lock, Power
} from 'lucide-react';

export default function UsersDirectoryTab({ 
  users, 
  onViewProfile, 
  onExportPdf, 
  onOpenSecurity,
  onToggleStatus, 
  onOpenCreate,
  activeTenancyFilter = 'tous',
  onTenancyFilterChange
}) {
  // Active fast filter pill: 'tous' | 'mccann' | 'orange'
  const [fastFilter, setFastFilter] = useState(activeTenancyFilter || 'tous');
  const safeViewProfile = typeof onViewProfile === 'function' ? onViewProfile : () => {};

  React.useEffect(() => {
    if (activeTenancyFilter) {
      setFastFilter(activeTenancyFilter);
    }
  }, [activeTenancyFilter]);

  const handleFastFilter = (val) => {
    setFastFilter(val);
    if (onTenancyFilterChange) onTenancyFilterChange(val);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');
  const [filterEntite, setFilterEntite] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered dataset
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Tenancy filter
      if (fastFilter === 'mccann' && u.type !== 'agence') return false;
      if (fastFilter === 'orange' && u.type !== 'client') return false;

      // Status filter
      if (filterStatut !== 'all' && u.statut !== filterStatut) return false;

      // Entite filter
      if (filterEntite !== 'all' && u.entite !== filterEntite) return false;

      // Role filter
      if (filterRole !== 'all' && u.profil !== filterRole) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchName = (u.name || '').toLowerCase().includes(q);
        const matchEmail = (u.email || '').toLowerCase().includes(q);
        const matchEntite = (u.entite || '').toLowerCase().includes(q);
        const matchProfil = (u.profil || '').toLowerCase().includes(q);
        const matchUid = (u.matricule || u.uid || u.id || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchEntite || matchProfil || matchUid;
      }

      return true;
    });
  }, [users, fastFilter, filterStatut, filterEntite, filterRole, searchTerm]);

  const totalFiltered = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length && paginatedUsers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedUsers.map(u => u.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExportCsv = () => {
    const headers = ['UID', 'Nom', 'Email', 'Entité', 'Profil Métier', 'Tenancy', 'Statut', 'Dernier Accès'];
    const rows = filteredUsers.map(u => [
      u.matricule || u.uid || u.id,
      `"${u.name}"`,
      u.email,
      `"${u.entite || ''}"`,
      `"${u.profil || ''}"`,
      u.type === 'agence' ? 'AGENCE McCANN' : 'CLIENT ORANGE',
      u.statut,
      `"${u.derniereConnexion || ''}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bridge-iam-export-${filteredUsers.length}-collaborateurs.csv`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast(`Export CSV généré pour ${filteredUsers.length} profils`);
  };

  return (
    <div className="space-y-5 text-white font-sans">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0E1530] border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. TOP HEADER BANNER (Exact Replica of Screen 10) ─── */}
      <div className="rounded-2xl bg-[#0E1428] border border-[#1C264D] p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">
            Annuaire des Collaborateurs &amp; Gestion des Droits Bi-Rive
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141D3B] border border-white/10 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#FF6600]">
                <span className="w-2 h-2 rounded-full bg-[#FF6600]"></span>
                McCANN DOUALA
              </span>
              <span className="text-white/30">&times;</span>
              <span className="flex items-center gap-1.5 text-[#00D4FF]">
                <span className="w-2 h-2 rounded-full bg-[#00D4FF]"></span>
                ORANGE CAMEROUN
              </span>
            </div>
            <p className="text-xs text-white/50">
              Console centrale de gouvernance IAM, autorisations synchronisées via le tunnel chiffré bi-directionnel Akwa-Bonanjo.
            </p>
          </div>
        </div>

        {/* Right Tenancy Quick Switchers */}
        <div className="flex items-center gap-2 bg-[#080B17] p-1.5 rounded-xl border border-white/10 flex-shrink-0 self-start lg:self-center">
          <button
            onClick={() => handleFastFilter('mccann')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              fastFilter === 'mccann'
                ? 'bg-[#1C2548] text-[#FF6600] border border-[#FF6600]/40'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF6600]"></span>
            <span>MCCANN (118)</span>
          </button>

          <button
            onClick={() => handleFastFilter('tous')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              fastFilter === 'tous'
                ? 'bg-[#2A2B5E] text-white shadow-md border border-purple-400/40'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>VUE GLOBALE (248)</span>
          </button>

          <button
            onClick={() => handleFastFilter('orange')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              fastFilter === 'orange'
                ? 'bg-[#1C2548] text-[#00D4FF] border border-[#00D4FF]/40'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#00D4FF]"></span>
            <span>ORANGE CM (130)</span>
          </button>
        </div>
      </div>

      {/* ─── 2. THE 6 KPI CARDS (Exact Replica of Screen 10) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: TOTAL COLLABORATEURS */}
        <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-bold uppercase tracking-wider">
            <span>TOTAL COLLABORATEURS</span>
            <Users className="w-4 h-4 text-white/40" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">248</span>
              <span className="text-xs text-white/50 font-semibold">+12 ce mois</span>
            </div>
            {/* Orange to Cyan Gradient Bar */}
            <div className="w-full h-1.5 rounded-full bg-black/40 mt-3 overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: '85%', 
                  background: 'linear-gradient(90deg, #FF6600 0%, #00D4FF 100%)' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Card 2: SESSIONS ACTIVES */}
        <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-bold uppercase tracking-wider">
            <span>SESSIONS ACTIVES</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"></span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">194</span>
              <span className="text-xs text-[#00D4FF] font-bold">78.2% connecté</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/5">
            <span>McCann: <strong className="text-white">92</strong></span>
            <span>Orange CM: <strong className="text-white">102</strong></span>
          </div>
        </div>

        {/* Card 3: EN ATTENTE / INACTIFS */}
        <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-bold uppercase tracking-wider">
            <span>EN ATTENTE / INACTIFS</span>
            <Clock className="w-4 h-4 text-white/40" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">14</span>
              <span className="text-xs text-white/50 font-semibold">5.6% du parc</span>
            </div>
          </div>
          <div className="text-[11px] text-[#FF8C00] font-bold pt-2 border-t border-white/5">
            4 approbations MFA en suspens
          </div>
        </div>

        {/* Card 4: ONBOARDINGS (30J) */}
        <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-bold uppercase tracking-wider">
            <span>ONBOARDINGS (30J)</span>
            <span className="text-purple-400 font-bold text-xs">+👤</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">22</span>
              <span className="text-xs text-purple-400 font-bold">+18% vs M-1</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-white/50 pt-2 border-t border-white/5">
            <span className="text-[#FF6600] font-bold">+8 Agence</span>
            <span className="text-[#00D4FF] font-bold">+14 Client</span>
          </div>
        </div>

        {/* Card 5: TAUX D'ACTIVITÉ */}
        <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-bold uppercase tracking-wider">
            <span>TAUX D'ACTIVITÉ</span>
            <Activity className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">94.6%</span>
              <span className="text-xs text-[#00D4FF] font-bold">Optimal</span>
            </div>
            {/* Segmented Cyan Bars */}
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 flex-1 rounded-full ${idx <= 4 ? 'bg-[#00D4FF]' : 'bg-white/10'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Card 6: PARITÉ BI-RIVE */}
        <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-bold uppercase tracking-wider">
            <span>PARITÉ BI-RIVE</span>
            <span className="text-[11px] text-white/70 font-mono">47.5% / 52.5%</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            {/* Mini Donut */}
            <div className="w-10 h-10 rounded-full border-4 border-[#FF6600] border-r-[#00D4FF] flex-shrink-0" />
            <div className="text-xs space-y-0.5">
              <div className="text-[#FF6600] font-bold">118 McCann</div>
              <div className="text-[#00D4FF] font-bold">130 Orange</div>
            </div>
          </div>
          <div className="text-[11px] text-white/50 pt-2 border-t border-white/5">
            Équilibre opérationnel vérifié
          </div>
        </div>

      </div>

      {/* ─── 3. SEARCH & ACTIONS BAR (Exact Replica of Screen 10) ─── */}
      <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] shadow-xl space-y-3">
        
        {/* Row 1: Search Input + Right Action Buttons */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full lg:flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Rechercher par nom, email (@mccann.cm, @orange.cm), département, rôle..."
              className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[#080B17] border border-white/10 text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#FF6600] transition-colors font-medium"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/40 font-mono">
              ⌘K
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#141D3B] hover:bg-[#1B2750] text-white text-xs font-bold border border-white/10 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-white/60" />
              <span>Exporter CSV (248 profils)</span>
            </button>

            <button
              onClick={() => triggerToast("Sélectionnez des comptes pour activer / bloquer.")}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#141D3B] hover:bg-[#1B2750] text-white text-xs font-bold border border-white/10 transition-all"
            >
              <Power className="w-3.5 h-3.5 text-white/60" />
              <span>Activer / Bloquer</span>
            </button>

            <button
              onClick={() => triggerToast("Clés MFA réinitialisées pour les comptes sélectionnés.")}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#141D3B] hover:bg-[#1B2750] text-white text-xs font-bold border border-white/10 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white/60" />
              <span>Réinitialiser MFA</span>
            </button>
          </div>

        </div>

        {/* Row 2: Fast Filter Pills + Dropdowns + Status */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider mr-1">
              FILTRES RAPIDES :
            </span>

            <button
              onClick={() => { setFastFilter('tous'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                fastFilter === 'tous'
                  ? 'bg-[#FF6600] text-white shadow-md'
                  : 'bg-[#080B17] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              TOUS (248)
            </button>

            <button
              onClick={() => { setFastFilter('mccann'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                fastFilter === 'mccann'
                  ? 'bg-[#FF6600] text-white shadow-md'
                  : 'bg-[#080B17] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              CÔTÉ AGENCE MCCANN (118)
            </button>

            <button
              onClick={() => { setFastFilter('orange'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                fastFilter === 'orange'
                  ? 'bg-[#00D4FF] text-[#080B17] font-black shadow-md'
                  : 'bg-[#080B17] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              CÔTÉ CLIENT ORANGE (130)
            </button>

            {/* Dropdown 1 */}
            <select
              value={filterStatut}
              onChange={(e) => { setFilterStatut(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1 rounded-lg bg-[#080B17] border border-white/10 text-white/80 font-medium focus:outline-none"
            >
              <option value="all">Statut: Actif / Inactif ⌵</option>
              <option value="actif">Actif uniquement</option>
              <option value="inactif">Inactif uniquement</option>
            </select>

            {/* Dropdown 2 */}
            <select
              value={filterEntite}
              onChange={(e) => { setFilterEntite(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1 rounded-lg bg-[#080B17] border border-white/10 text-white/80 font-medium focus:outline-none"
            >
              <option value="all">Entités &amp; Pôles Métier ⌵</option>
              <option value="Création">Création &amp; Studio</option>
              <option value="Direction Marketing">Direction Marketing</option>
              <option value="Account Management">Account Management</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Contrôle de Gestion">Contrôle de Gestion</option>
              <option value="Finance & Admin">Finance &amp; Admin</option>
            </select>

            {/* Dropdown 3 */}
            <select
              value={filterRole}
              onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1 rounded-lg bg-[#080B17] border border-white/10 text-white/80 font-medium focus:outline-none"
            >
              <option value="all">Rôles RBAC Bi-Rive ⌵</option>
              <option value="Directeur Artistique Senior">Directeur Artistique Senior</option>
              <option value="Brand Manager">Brand Manager</option>
              <option value="Chef de Pub">Chef de Pub (Account)</option>
              <option value="Super Admin BRIDGE">Super Admin BRIDGE</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-white/50 self-end lg:self-auto font-mono">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF]"></span>
            <span>Index Elastic IAM: OK (Synchro &lt; 85ms)</span>
          </div>

        </div>

      </div>

      {/* ─── 4. DATA TABLE (Exact Replica of Screen 10) ─── */}
      <div className="rounded-2xl bg-[#0E1428] border border-[#1C264D] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            
            <thead className="bg-[#090D1E] text-white/50 uppercase font-black tracking-wider border-b border-[#1C264D] text-[10px]">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-white/60 hover:text-white">
                    {selectedIds.length === paginatedUsers.length && paginatedUsers.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#FF6600]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">COLLABORATEUR &amp; IDENTITÉ</th>
                <th className="py-3.5 px-4">EMAIL PROFESSIONNEL</th>
                <th className="py-3.5 px-4">ENTITÉ / PÔLE</th>
                <th className="py-3.5 px-4">PROFIL MÉTIER</th>
                <th className="py-3.5 px-4 text-center">TYPE TENANCY</th>
                <th className="py-3.5 px-4">STATUT SESSION</th>
                <th className="py-3.5 px-4">DERNIER ACCÈS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-medium">
              {paginatedUsers.map((u) => {
                const isAgency = u.type === 'agence';
                const isSelected = selectedIds.includes(u.id);

                return (
                  <tr 
                    key={u.id}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      isSelected ? 'bg-[#FF6600]/10' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleToggleSelectOne(u.id)}
                        className="text-white/60 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#FF6600]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Collaborateur & Identité */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => safeViewProfile(u)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md flex-shrink-0 cursor-pointer border"
                          style={{
                            backgroundColor: isAgency ? '#2A180E' : '#0B2236',
                            borderColor: isAgency ? '#FF6600' : '#00D4FF',
                            color: isAgency ? '#FF8C00' : '#00D4FF'
                          }}
                        >
                          {u.avatar || u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div 
                            onClick={() => safeViewProfile(u)}
                            className="font-bold text-white text-sm hover:text-[#00D4FF] cursor-pointer transition-colors"
                          >
                            {u.name}
                          </div>
                          <div className="text-[10px] text-white/40 font-mono">
                            UID: {u.matricule || u.uid || u.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 font-mono text-white/80 text-xs">
                      {u.email}
                    </td>

                    {/* Entité / Pôle */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141D3B] text-[11px] text-white/80 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                        {u.entite}
                      </span>
                    </td>

                    {/* Profil Métier */}
                    <td className="py-3 px-4 font-semibold text-white/90">
                      {u.poste || u.profil}
                    </td>

                    {/* Type Tenancy Badge */}
                    <td className="py-3 px-4 text-center">
                      <span 
                        className="inline-block text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap"
                        style={{
                          backgroundColor: u.tenancyLabel?.includes('PRIVILÉGIÉ') 
                            ? '#3A1B4D' 
                            : (isAgency ? '#442615' : '#123348'),
                          color: u.tenancyLabel?.includes('PRIVILÉGIÉ')
                            ? '#D896FF'
                            : (isAgency ? '#FF944D' : '#00D4FF'),
                          border: `1px solid ${
                            u.tenancyLabel?.includes('PRIVILÉGIÉ')
                              ? '#7B3FAF'
                              : (isAgency ? '#FF660040' : '#00D4FF40')
                          }`
                        }}
                      >
                        {u.tenancyLabel || (isAgency ? 'AGENCE McCANN' : 'CLIENT ORANGE')}
                      </span>
                    </td>

                    {/* Statut Session */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: u.statut === 'inactif' 
                              ? '#EF4444' 
                              : (isAgency ? '#FF8C00' : '#00D4FF')
                          }}
                        />
                        <span>{u.statutLabel || (u.statut === 'actif' ? 'En ligne' : 'Inactif')}</span>
                      </span>
                    </td>

                    {/* Dernier Accès */}
                    <td className="py-3 px-4 text-white/60 text-xs">
                      {u.derniereConnexion || 'Il y a 5 min'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 text-white/50">
                        <button
                          onClick={() => onExportPdf(u)}
                          title="Fiche PDF officielle"
                          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenSecurity()}
                          title="Habilitations RBAC"
                          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => safeViewProfile(u)}
                          title="Menu actions"
                          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination Bar (Matches Screen 10) ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#090D1E] border-t border-[#1C264D] text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span>Affichage 1 à {Math.min(paginatedUsers.length, totalFiltered)} sur <strong className="text-white">{totalFiltered}</strong> collaborateurs</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Afficher</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 rounded bg-[#141D3B] border border-white/10 text-white focus:outline-none"
            >
              <option value={7}>7 par page</option>
              <option value={10}>10 par page</option>
              <option value={20}>20 par page</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded bg-[#FF6600] text-white font-bold text-xs">1</button>
            <button className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 text-white text-xs">2</button>
            <button className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 text-white text-xs">3</button>
            <span className="px-1 text-white/40">...</span>
            <button className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 text-white text-xs">25</button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── 5. BOTTOM 3 SECURITY TRUST BADGES (Exact Replica of Screen 10) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        {/* Badge 1 */}
        <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-[#00D4FF] mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Protocole ZTNA Bi-Latéral</div>
            <div className="text-[11px] text-white/50 mt-0.5">
              Validation mutuelle des tokens TLS 1.3 &amp; SAML 2.0
            </div>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">LDAP Synchro Akwa-Bonanjo</div>
            <div className="text-[11px] text-white/50 mt-0.5">
              Dernière réplication à 11:14:02 (0 dérive d'annuaire)
            </div>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="p-4 rounded-2xl bg-[#0E1428] border border-[#1C264D] flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Conformité RGPD / ANOR Cameroun</div>
            <div className="text-[11px] text-white/50 mt-0.5">
              Logs d'audit immuables horodatés SHA-256
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
