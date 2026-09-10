import React, { useState } from 'react';
import { ShieldCheck, Lock, Activity, AlertTriangle, CheckCircle2, Download, Search, RefreshCw, KeyRound, Globe } from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from './usersConstants';

export default function AuditSecurityTab() {
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [searchLog, setSearchLog] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredLogs = logs.filter(l => {
    if (filterSeverity !== 'all' && l.severity !== filterSeverity) return false;
    if (searchLog.trim()) {
      const q = searchLog.toLowerCase();
      return (
        l.actor.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.ip.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bridge-audit-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Security Health Checks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F142D] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Politique de Mots de Passe</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">Strict BRIDGE</div>
          <div className="text-[11px] text-emerald-400 mt-1">Min. 8 car. + symboles requis</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F142D] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Protection des Domaines</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">Actif (2 Rives)</div>
          <div className="text-[11px] text-cyan-400 mt-1">@mccann.cm &amp; @orange.cm</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F142D] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sessions &amp; Tokens</span>
            <KeyRound className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white">Expiration 24h</div>
          <div className="text-[11px] text-white/40 mt-1">Révocation automatique</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F142D] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Chiffrement Données</span>
            <Globe className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-black text-white">TLS 1.3 / AES-256</div>
          <div className="text-[11px] text-emerald-400 mt-1">Conformité RGPD / BEAC</div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-5 rounded-2xl bg-[#0F142D] border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchLog}
            onChange={(e) => setSearchLog(e.target.value)}
            placeholder="Filtrer les événements de sécurité..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none"
          >
            <option value="all">Toutes les criticités</option>
            <option value="info">Info</option>
            <option value="success">Succès</option>
            <option value="warning">Avertissement</option>
          </select>

          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter Logs (JSON)
          </button>
        </div>
      </div>

      {/* 3. Audit Logs Timeline Table */}
      <div className="rounded-2xl bg-[#0F142D] border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#0A0E27] text-white/50 uppercase font-black tracking-wider border-b border-white/10 text-[11px]">
              <tr>
                <th className="py-4 px-4">Horodatage</th>
                <th className="py-4 px-4">Événement &amp; Action</th>
                <th className="py-4 px-4">Opérateur (Acteur)</th>
                <th className="py-4 px-4">Cible</th>
                <th className="py-4 px-4">Détails Opérationnels</th>
                <th className="py-4 px-4">Adresse IP &amp; Localisation</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-medium">
              {filteredLogs.map((log) => {
                let badgeStyle = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                if (log.severity === 'success') badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                if (log.severity === 'warning') badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

                return (
                  <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-white/50 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${badgeStyle}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      {log.actor}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-white/80">
                      {log.target}
                    </td>

                    <td className="py-3.5 px-4 text-white/70 max-w-xs">
                      {log.details}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-white/50 text-[11px] whitespace-nowrap">
                      {log.ip}
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
