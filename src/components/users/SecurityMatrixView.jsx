import React, { useState } from 'react';
import { 
  Shield, Lock, ShieldCheck, AlertTriangle, Check, 
  RefreshCw, Activity, Terminal, Eye, Sliders,
  CheckCircle2, XCircle, Clock, Search, Filter,
  ArrowUpRight, KeyRound, Cpu, ShieldAlert, Sparkles
} from 'lucide-react';

const INITIAL_MATRIX = {
  'Directeur de Clientèle (McCann)': [
    { module: 'Briefs & Campagnes 360', read: 'granted', write: 'granted', finance: 'double', publish: 'double' },
    { module: 'Calendrier Éditorial Bi-Rive', read: 'granted', write: 'granted', finance: 'locked', publish: 'double' },
    { module: 'Suivi Budgétaire & Facturation', read: 'granted', write: 'double', finance: 'double', publish: 'locked' },
    { module: 'Validation BAT & Livrables', read: 'granted', write: 'granted', finance: 'locked', publish: 'double' },
    { module: 'Module Influence & Talents', read: 'granted', write: 'granted', finance: 'double', publish: 'double' },
    { module: 'Console IAM & Sécurité', read: 'granted', write: 'locked', finance: 'locked', publish: 'locked' }
  ],
  'Brand Manager (Orange)': [
    { module: 'Briefs & Campagnes 360', read: 'granted', write: 'double', finance: 'granted', publish: 'granted' },
    { module: 'Calendrier Éditorial Bi-Rive', read: 'granted', write: 'double', finance: 'locked', publish: 'granted' },
    { module: 'Suivi Budgétaire & Facturation', read: 'granted', write: 'granted', finance: 'granted', publish: 'granted' },
    { module: 'Validation BAT & Livrables', read: 'granted', write: 'double', finance: 'locked', publish: 'granted' },
    { module: 'Module Influence & Talents', read: 'granted', write: 'double', finance: 'granted', publish: 'granted' },
    { module: 'Console IAM & Sécurité', read: 'granted', write: 'locked', finance: 'locked', publish: 'locked' }
  ],
  'Directeur de Création (McCann)': [
    { module: 'Briefs & Campagnes 360', read: 'granted', write: 'granted', finance: 'locked', publish: 'double' },
    { module: 'Calendrier Éditorial Bi-Rive', read: 'granted', write: 'granted', finance: 'locked', publish: 'granted' },
    { module: 'Suivi Budgétaire & Facturation', read: 'granted', write: 'locked', finance: 'locked', publish: 'locked' },
    { module: 'Validation BAT & Livrables', read: 'granted', write: 'granted', finance: 'locked', publish: 'double' },
    { module: 'Module Influence & Talents', read: 'granted', write: 'granted', finance: 'locked', publish: 'double' },
    { module: 'Console IAM & Sécurité', read: 'locked', write: 'locked', finance: 'locked', publish: 'locked' }
  ],
  'Resp. Orange Money (Orange)': [
    { module: 'Briefs & Campagnes 360', read: 'granted', write: 'double', finance: 'granted', publish: 'granted' },
    { module: 'Calendrier Éditorial Bi-Rive', read: 'granted', write: 'double', finance: 'locked', publish: 'granted' },
    { module: 'Suivi Budgétaire & Facturation', read: 'granted', write: 'granted', finance: 'granted', publish: 'granted' },
    { module: 'Validation BAT & Livrables', read: 'granted', write: 'double', finance: 'locked', publish: 'granted' },
    { module: 'Module Influence & Talents', read: 'granted', write: 'double', finance: 'granted', publish: 'double' },
    { module: 'Console IAM & Sécurité', read: 'granted', write: 'locked', finance: 'locked', publish: 'locked' }
  ]
};

const AUDIT_LOGS = [
  {
    id: 'log-1',
    time: '11:22:15',
    action: 'AUTH_SAML_OK',
    actionColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    user: 'Alain Patrick Eboa (McCann)',
    ip: '102.244.155.12 (Douala Akwa)',
    status: '[SUCCÈS]',
    statusColor: 'text-emerald-400',
    hash: 'sha256:4f8a912e34bca89d'
  },
  {
    id: 'log-2',
    time: '11:14:02',
    action: 'ONBOARD_USER_SUCCESS',
    actionColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    user: 'K. Manga (Admin)',
    ip: '154.72.168.45 (Douala Bonanjo)',
    status: '[VALIDÉ]',
    statusColor: 'text-cyan-400',
    hash: 'sha256:9e4f2a78bc3410de'
  },
  {
    id: 'log-3',
    time: '10:48:33',
    action: 'RBAC_UPDATE_POLICY',
    actionColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    user: 'Sandrine Moukoko (Orange CM)',
    ip: '102.244.140.22 (Yaoundé Siege)',
    status: '[VÉRIFIÉ]',
    statusColor: 'text-orange-400',
    hash: 'sha256:71de84fa920cc144'
  },
  {
    id: 'log-4',
    time: '09:30:12',
    action: 'SESSION_ZTNA_REFRESH',
    actionColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    user: 'Jean-Marc Belinga (McCann)',
    ip: '102.244.155.12 (Douala Bonanjo)',
    status: '[SUCCÈS]',
    statusColor: 'text-emerald-400',
    hash: 'sha256:1a8f67ee4299bb30'
  },
  {
    id: 'log-5',
    time: '08:15:40',
    action: 'FIDO2_KEY_REGISTERED',
    actionColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    user: 'Audrey Ndjock (McCann)',
    ip: '102.244.155.88 (Douala Akwa)',
    status: '[SUCCÈS]',
    statusColor: 'text-emerald-400',
    hash: 'sha256:3c8d19ab47ef22aa'
  }
];

export default function SecurityMatrixView() {
  const [selectedRole, setSelectedRole] = useState('Directeur de Clientèle (McCann)');
  const [matrixData, setMatrixData] = useState(INITIAL_MATRIX);
  const [auditFilter, setAuditFilter] = useState('all'); // 'all' | 'mfa' | 'onboarding'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cycle permission status on click: granted -> double -> locked -> granted
  const handleCellClick = (moduleIndex, field) => {
    setMatrixData(prev => {
      const currentList = [...(prev[selectedRole] || [])];
      const currentObj = { ...currentList[moduleIndex] };
      const currentVal = currentObj[field];
      
      let nextVal = 'granted';
      if (currentVal === 'granted') nextVal = 'double';
      else if (currentVal === 'double') nextVal = 'locked';
      else nextVal = 'granted';

      currentObj[field] = nextVal;
      currentList[moduleIndex] = currentObj;

      return {
        ...prev,
        [selectedRole]: currentList
      };
    });
  };

  const handleSaveToVault = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const renderBadge = (status, moduleIndex, field) => {
    if (status === 'granted') {
      return (
        <button
          type="button"
          onClick={() => handleCellClick(moduleIndex, field)}
          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 hover:scale-105 transition-transform"
          title="Cliquez pour changer d'état"
        >
          ACCORDÉ
        </button>
      );
    }
    if (status === 'double') {
      return (
        <button
          type="button"
          onClick={() => handleCellClick(moduleIndex, field)}
          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/40 hover:scale-105 transition-transform"
          title="Cliquez pour changer d'état"
        >
          DOUBLE VALIDATION
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => handleCellClick(moduleIndex, field)}
        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:scale-105 transition-transform"
        title="Cliquez pour changer d'état"
      >
        VERROUILLÉ
      </button>
    );
  };

  const filteredLogs = AUDIT_LOGS.filter(l => {
    if (auditFilter === 'mfa' && !l.action.includes('AUTH') && !l.action.includes('FIDO')) return false;
    if (auditFilter === 'onboarding' && !l.action.includes('ONBOARD') && !l.action.includes('RBAC')) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ─── TOP SECURITY CORE BAR ─── */}
      <div className="p-4 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
              <span>BRIDGE // SECURITY CORE V4.2.0</span>
              <span className="text-white/30">&bull;</span>
              <span className="text-cyan-400">CLUSTER DOUALA-YAOUNDÉ SÉCURISÉ</span>
            </div>
            <div className="text-[11px] text-white/50">
              Politique Zéro Trust Certifiée &bull; ANOR CM-2025-CYBER &bull; Chiffrement TLS 1.3 Strict
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>SIEM LIVE SYNC: ACTIF</span>
        </div>
      </div>

      {/* ─── 4 TOP SECURITY KPI CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/50 uppercase">
            <span>Couplage Inter-Tenant</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">100% Synchro</div>
          <div className="text-[11px] text-white/50">248 Identités Actives</div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex">
            <div className="bg-[#FF6600] h-full" style={{ width: '46%' }}></div>
            <div className="bg-[#00D4FF] h-full" style={{ width: '54%' }}></div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/50 uppercase">
            <span>Matrice RBAC Granulaire</span>
            <Sliders className="w-4 h-4 text-[#FF6600]" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">10 Matrices</div>
          <div className="text-[11px] text-white/50">6 Profils Clés Définis</div>
          <div className="text-[10px] text-emerald-400 font-medium">Strict PAM 2.0</div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/50 uppercase">
            <span>Consensus Bi-Latéral</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">Double Check</div>
          <div className="text-[11px] text-white/50">03 Privilèges Sensibles</div>
          <div className="text-[10px] text-cyan-300 font-medium">Clé Partagée Validée</div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/50 uppercase">
            <span>État MFA &amp; SIEM</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">Actif 99.8%</div>
          <div className="text-[11px] text-white/50">0 violation détectée</div>
          <div className="text-[10px] text-emerald-400 font-medium">Dernier Scan : il y a 2 min</div>
        </div>

      </div>

      {/* ─── SECTION 1: AFFECTATION MATRICIELLE DYNAMIQUE (RBAC) ─── */}
      <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-5 backdrop-blur-xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>Affectation Matricielle Dynamique des Rôles Bi-Rive</span>
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Configuration des privilèges d'écriture, validation et consensus bilatéral par fonction opérationnelle.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Accordé Immédiat</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#FF6600]">
              <span className="w-2 h-2 rounded-full bg-[#FF6600]"></span>
              <span>Double Validation</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Verrouillé</span>
            </span>
          </div>
        </div>

        {/* Role Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.keys(matrixData).map(role => {
            const isSelected = selectedRole === role;
            const isRoleMcCann = role.includes('McCann');
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? isRoleMcCann 
                      ? 'bg-[#FF6600] text-white shadow-lg shadow-orange-500/20' 
                      : 'bg-[#00D4FF] text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                    : 'bg-[#080B17] text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>

        {/* Dynamic RBAC Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#080B17]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider bg-black/30">
                <th className="p-3.5">Module &amp; Périmètre Sécurisé</th>
                <th className="p-3.5 text-center">Consultation (Read)</th>
                <th className="p-3.5 text-center">Dépôt &amp; Édition (Write)</th>
                <th className="p-3.5 text-center">Approbation Budget (Finance)</th>
                <th className="p-3.5 text-center">Publication Finale (Publish)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(matrixData[selectedRole] || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{row.module}</span>
                  </td>
                  <td className="p-3.5 text-center">
                    {renderBadge(row.read, idx, 'read')}
                  </td>
                  <td className="p-3.5 text-center">
                    {renderBadge(row.write, idx, 'write')}
                  </td>
                  <td className="p-3.5 text-center">
                    {renderBadge(row.finance, idx, 'finance')}
                  </td>
                  <td className="p-3.5 text-center">
                    {renderBadge(row.publish, idx, 'publish')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-white/40">
            Astuce : Cliquez sur n'importe quel badge d'autorisation pour modifier dynamiquement son état RBAC.
          </span>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Enregistré dans le Vault !
              </span>
            )}
            <button
              onClick={handleSaveToVault}
              className="px-4 py-2 rounded-xl text-xs font-black text-white shadow-lg transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FF6600, #FF8C00)',
                boxShadow: '0 4px 15px rgba(255, 102, 0, 0.3)'
              }}
            >
              PUBLIER DANS LE VAULT RBAC
            </button>
          </div>
        </div>

      </div>

      {/* ─── SECTION 2: JOURNAL D'AUDIT & TRAÇABILITÉ SIEM EN DIRECT ─── */}
      <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-4 backdrop-blur-xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Journal d'Audit &amp; Traçabilité Bi-Rive en Direct (SIEM)</h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setAuditFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                auditFilter === 'all' ? 'bg-[#FF6600] text-white' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              Tous les événements
            </button>
            <button
              onClick={() => setAuditFilter('mfa')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                auditFilter === 'mfa' ? 'bg-[#00D4FF] text-slate-950 font-bold' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              Connexions &amp; MFA
            </button>
            <button
              onClick={() => setAuditFilter('onboarding')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                auditFilter === 'onboarding' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              Création &amp; Onboarding
            </button>
          </div>
        </div>

        {/* Live log rows */}
        <div className="space-y-2 font-mono text-xs">
          {filteredLogs.map(log => (
            <div 
              key={log.id} 
              className="p-3 rounded-xl bg-[#080B17] border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-white/40">{log.time}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${log.actionColor}`}>
                  {log.action}
                </span>
                <span className="text-white font-sans font-bold">{log.user}</span>
                <span className="text-white/40 text-[11px]">{log.ip}</span>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <span className={`text-[11px] font-bold ${log.statusColor}`}>
                  {log.status}
                </span>
                <span className="text-[10px] text-white/30 truncate max-w-[140px]" title={log.hash}>
                  {log.hash}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
