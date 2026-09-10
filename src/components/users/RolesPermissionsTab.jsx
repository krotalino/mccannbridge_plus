import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, AlertTriangle, Eye, Edit3, Check, Sparkles } from 'lucide-react';
import { MODULES_RBAC, DEFAULT_PERMISSIONS, AGENCY_PROFILES, CLIENT_PROFILES } from './usersConstants';

export default function RolesPermissionsTab() {
  const [selectedRole, setSelectedRole] = useState('Traffic Manager');
  const [permissionsState, setPermissionsState] = useState(DEFAULT_PERMISSIONS);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentRolePerms = permissionsState[selectedRole] || {
    traffic: 'read', briefs: 'read', calendar: 'read', validation: 'read',
    influence: 'read', reports: 'read', finance: 'none', assistant_ia: 'read',
    admin_ia: 'none', users: 'none'
  };

  const handlePermChange = (moduleId, level) => {
    setPermissionsState(prev => ({
      ...prev,
      [selectedRole]: {
        ...(prev[selectedRole] || {}),
        [moduleId]: level
      }
    }));
  };

  const handleSaveMatrix = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const isClientProfile = CLIENT_PROFILES.includes(selectedRole);

  const PERMISSION_LEVELS = [
    { id: 'none', label: 'Aucun', color: 'bg-white/10 text-white/40', desc: 'Accès interdit au module' },
    { id: 'read', label: 'Lecture', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', desc: 'Consultation et reporting' },
    { id: 'write', label: 'Écriture', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', desc: 'Création et mise à jour' },
    { id: 'admin', label: 'Contrôle Total', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', desc: 'Administration et validation' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header card */}
      <div className="p-6 rounded-2xl bg-[#0F142D] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Matrice des Habilitations &amp; Permissions (RBAC)
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Gouvernance granulaire des privilèges d’accès selon le profil métier de l’Agence McCann ou du Client Orange.
          </p>
        </div>

        {/* Profile Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white/60">Profil :</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <optgroup label="── CÔTÉ AGENCE McCANN ──" className="bg-[#0A0E27] font-bold text-orange-400">
              {AGENCY_PROFILES.map((p, i) => (
                <option key={i} value={p} className="text-white font-normal">{p}</option>
              ))}
            </optgroup>
            <optgroup label="── CÔTÉ CLIENT ORANGE ──" className="bg-[#0A0E27] font-bold text-cyan-400">
              {CLIENT_PROFILES.map((p, i) => (
                <option key={i} value={p} className="text-white font-normal">{p}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Role Summary Banner */}
      <div 
        className="p-4 rounded-xl border flex items-center justify-between"
        style={{
          backgroundColor: isClientProfile ? 'rgba(0, 212, 255, 0.08)' : 'rgba(255, 102, 0, 0.08)',
          borderColor: isClientProfile ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255, 102, 0, 0.3)'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm"
            style={{ backgroundColor: isClientProfile ? '#00D4FF' : '#FF6600', color: isClientProfile ? '#0A0E27' : '#FFFFFF' }}
          >
            {isClientProfile ? 'CL' : 'AG'}
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Profil actif : <span className="underline">{selectedRole}</span>
            </div>
            <div className="text-xs text-white/60">
              Rattachement : {isClientProfile ? 'Annonceur Client Orange Cameroun' : 'Agence McCann Douala'}
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveMatrix}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md hover:brightness-110"
          style={{
            background: isClientProfile ? 'linear-gradient(135deg, #00A3FF, #00D4FF)' : 'linear-gradient(135deg, #FF6600, #FF8C00)',
            color: isClientProfile ? '#0A0E27' : '#FFFFFF'
          }}
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          {saveSuccess ? 'Enregistré avec succès' : 'Sauvegarder ces habilitations'}
        </button>
      </div>

      {/* Permissions Matrix Table */}
      <div className="rounded-2xl bg-[#0F142D] border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#0A0E27] text-white/50 uppercase font-black tracking-wider border-b border-white/10 text-[11px]">
              <tr>
                <th className="py-4 px-6 w-1/3">Module Applicatif BRIDGE</th>
                <th className="py-4 px-6">Description Opérationnelle</th>
                <th className="py-4 px-6 text-center">Niveau d'Habilitation Accordé</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-medium">
              {MODULES_RBAC.map((mod) => {
                const currentLevel = currentRolePerms[mod.id] || 'none';

                return (
                  <tr key={mod.id} className="hover:bg-white/[0.03] transition-colors">
                    
                    {/* Module Title */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{mod.label}</div>
                      <div className="text-[11px] text-white/40 font-mono mt-0.5">ID: bridge.{mod.id}</div>
                    </td>

                    {/* Module Description */}
                    <td className="py-4 px-6 text-white/70">
                      {mod.desc}
                    </td>

                    {/* Level Selector Pills */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 w-fit mx-auto">
                        {PERMISSION_LEVELS.map((lvl) => {
                          const isSelected = currentLevel === lvl.id;

                          return (
                            <button
                              key={lvl.id}
                              onClick={() => handlePermChange(mod.id, lvl.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isSelected
                                  ? `${lvl.color} shadow-md border`
                                  : 'text-white/40 hover:text-white hover:bg-white/5'
                              }`}
                              title={lvl.desc}
                            >
                              {lvl.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
