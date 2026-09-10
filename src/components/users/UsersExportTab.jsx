import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileCode, Printer, CheckCircle2, Users, Building, Shield } from 'lucide-react';

export default function UsersExportTab({ users }) {
  const [exportColumns, setExportColumns] = useState({
    name: true,
    email: true,
    telephone: true,
    type: true,
    entite: true,
    profil: true,
    statut: true,
    dateArrivee: true,
    derniereConnexion: true
  });

  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const toggleColumn = (key) => {
    setExportColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportCsv = () => {
    const headers = [];
    if (exportColumns.name) headers.push('Nom Complet');
    if (exportColumns.email) headers.push('Email');
    if (exportColumns.telephone) headers.push('Téléphone');
    if (exportColumns.type) headers.push('Organisation');
    if (exportColumns.entite) headers.push('Entité / Département');
    if (exportColumns.profil) headers.push('Rôle / Profil');
    if (exportColumns.statut) headers.push('Statut');
    if (exportColumns.dateArrivee) headers.push('Date Arrivée');
    if (exportColumns.derniereConnexion) headers.push('Dernière Connexion');

    const rows = users.map(u => {
      const row = [];
      if (exportColumns.name) row.push(`"${u.name}"`);
      if (exportColumns.email) row.push(`"${u.email}"`);
      if (exportColumns.telephone) row.push(`"${u.telephone || ''}"`);
      if (exportColumns.type) row.push(`"${u.type === 'agence' ? 'Agence McCann Douala' : 'Client Orange Cameroun'}"`);
      if (exportColumns.entite) row.push(`"${u.entite}"`);
      if (exportColumns.profil) row.push(`"${u.profil}"`);
      if (exportColumns.statut) row.push(`"${u.statut}"`);
      if (exportColumns.dateArrivee) row.push(`"${u.dateArrivee || ''}"`);
      if (exportColumns.derniereConnexion) row.push(`"${u.derniereConnexion || ''}"`);
      return row.join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bridge-utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
    URL.revokeObjectURL(url);

    triggerSuccess('Fichier CSV exporté avec succès');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(users, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bridge-directory-schema-${new Date().toISOString().slice(0, 10)}.json`);
    link.click();
    URL.revokeObjectURL(url);

    triggerSuccess('Annuaire JSON exporté avec succès');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const triggerSuccess = (msg) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {downloadSuccess}
          </span>
          <button onClick={() => setDownloadSuccess(null)} className="text-white/60 hover:text-white">✕</button>
        </div>
      )}

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: CSV Export */}
        <div className="p-6 rounded-2xl bg-[#0F142D] border border-white/10 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Export Tableur CSV</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Téléchargement au format Excel / CSV avec encodage UTF-8 (compatible caractères accentués).
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            Télécharger CSV ({users.length} entrées)
          </button>
        </div>

        {/* Card 2: JSON Export */}
        <div className="p-6 rounded-2xl bg-[#0F142D] border border-white/10 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
              <FileCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Export JSON / LDAP</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Format brut JSON pour synchronisation Active Directory, Google Workspace ou ERP RH.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            Télécharger Schéma JSON
          </button>
        </div>

        {/* Card 3: Global PDF Report */}
        <div className="p-6 rounded-2xl bg-[#0F142D] border border-white/10 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-4">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Rapport d’Effectifs A4</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Génération du bilan synthétique RH &amp; Conformité des accès pour les comités paritaires.
            </p>
          </div>

          <button
            onClick={handlePrintReport}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            Imprimer / PDF Global
          </button>
        </div>

      </div>

      {/* Column Selection for CSV */}
      <div className="p-6 rounded-2xl bg-[#0F142D] border border-white/10 shadow-2xl space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">
          Colonnes Incluses dans l'Export CSV
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-white">
          {[
            { key: 'name', label: 'Nom & Prénom' },
            { key: 'email', label: 'Email Professionnel' },
            { key: 'telephone', label: 'Numéro de Téléphone' },
            { key: 'type', label: 'Type (Agence / Client)' },
            { key: 'entite', label: 'Entité de Rattachement' },
            { key: 'profil', label: 'Rôle Métier (Profil)' },
            { key: 'statut', label: 'Statut du Compte' },
            { key: 'dateArrivee', label: 'Date d’Arrivée' },
            { key: 'derniereConnexion', label: 'Dernière Connexion' },
          ].map((col) => (
            <label key={col.key} className="flex items-center gap-2 p-2 bg-black/20 rounded-lg cursor-pointer hover:bg-white/5">
              <input
                type="checkbox"
                checked={exportColumns[col.key]}
                onChange={() => toggleColumn(col.key)}
                className="rounded bg-black/40 border-white/20 text-orange-500 focus:ring-0"
              />
              <span className="font-semibold">{col.label}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}
