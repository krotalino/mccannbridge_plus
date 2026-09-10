import { useState } from 'react';
import { formatNumber } from '../../../../utils/helpers';
import { Download, Plus, Edit, Trash2, ExternalLink, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export default function PerformanceDeliverablesTable({
  deliverables = [],
  onEdit,
  onDelete,
  onAddNew,
  totalDeliverablesCount = 0,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const totalPages = Math.ceil(deliverables.length / pageSize) || 1;
  const paginatedItems = deliverables.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Fonction d'export CSV conforme et respectant les filtres actifs
  const handleExportCSV = () => {
    if (deliverables.length === 0) {
      alert('Aucune donnée à exporter avec les filtres actuels.');
      return;
    }

    const headers = [
      'ID',
      'Titre',
      'Campagne',
      'Talent',
      'Plateforme',
      'Format',
      'Sujet',
      'Date Publication',
      'Vues (Mesure)',
      'Likes (Mesure)',
      'Commentaires (Mesure)',
      'Partages (Mesure)',
      'Engagement Declare (Mesure)',
      'Engagement Calcule (Calcul)',
      'Taux sur Vues (%) (Calcul)',
      'Completude Donnees',
      'URL'
    ];

    const escapeCSV = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = deliverables.map(d => {
      const isComplete = d.metrics?.views > 0 &&
        d.metrics?.likes !== null &&
        d.metrics?.comments !== null &&
        d.metrics?.shares !== null;

      return [
        escapeCSV(d.id),
        escapeCSV(d.title),
        escapeCSV(d.campaign_name || d.campaign_id),
        escapeCSV(d.talent_name),
        escapeCSV(d.platform),
        escapeCSV(d.content_type),
        escapeCSV(d.content_subject),
        escapeCSV(d.published_at || d.date_raw || ''),
        d.metrics?.views !== null && d.metrics?.views !== undefined ? d.metrics.views : 'N/D',
        d.metrics?.likes !== null && d.metrics?.likes !== undefined ? d.metrics.likes : 'N/D',
        d.metrics?.comments !== null && d.metrics?.comments !== undefined ? d.metrics.comments : 'N/D',
        d.metrics?.shares !== null && d.metrics?.shares !== undefined ? d.metrics.shares : 'N/D',
        d.metrics?.engagement_reported !== null && d.metrics?.engagement_reported !== undefined ? d.metrics.engagement_reported : 'N/D',
        d.metrics?.engagement_calculated !== null && d.metrics?.engagement_calculated !== undefined ? d.metrics.engagement_calculated : 'N/D',
        d.metrics?.engagement_rate !== null && d.metrics?.engagement_rate !== undefined ? `${d.metrics.engagement_rate}%` : 'N/D',
        escapeCSV(isComplete ? 'Complete' : 'Incomplete / Partielle'),
        escapeCSV(d.url || '')
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const nowStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `Performances_Influence_Export_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPlatformBadge = (platform) => {
    const p = String(platform || '').toLowerCase();
    const styles = {
      tiktok: 'bg-black text-white',
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      facebook: 'bg-blue-600 text-white',
      youtube: 'bg-red-600 text-white',
      website: 'bg-gray-700 text-white',
    };
    return (
      <span className={`px-6 py-2 rounded text-[10px] font-bold uppercase ${styles[p] || 'bg-gray-500 text-white'}`}>
        {p}
      </span>
    );
  };

  return (
    <div
      className="card mb-24"
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Barre de contrôle d'actions du tableau */}
      <div className="flex flex-wrap items-center justify-between gap-12 mb-16 pb-12" style={{ borderBottom: '1px solid #f3f4f6' }}>
        <div>
          <div className="flex items-center gap-8">
            <span
              className="text-xs font-bold px-8 py-2 rounded"
              style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
            >
              DONNÉES BRUTES & ÉDITION
            </span>
            <h3 className="text-base font-bold text-dark" style={{ margin: 0 }}>
              Table de Détail des Publications & KPIs
            </h3>
          </div>
          <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
            Visualisez, modifiez ou supprimez les métriques de chaque livrable. Exportez le rapport au format CSV/Excel.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={handleExportCSV}
            className="btn text-xs font-semibold flex items-center gap-6 px-12 py-6 rounded-lg transition-all"
            style={{
              background: '#F0FDF4',
              color: '#15803D',
              border: '1px solid #BBF7D0',
            }}
            title="Télécharger les données filtrées au format CSV (compatible Excel)"
          >
            <Download size={14} />
            Exporter CSV ({deliverables.length})
          </button>

          <button
            onClick={onAddNew}
            className="btn btn-orange text-xs font-semibold flex items-center gap-6 px-12 py-6 rounded-lg"
            title="Ajouter une nouvelle publication avec ses métriques de performance"
          >
            <Plus size={14} />
            Nouvelle Publication
          </button>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="overflow-x-auto" style={{ maxHeight: 600 }}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            {/* Ligne de regroupement méthodologique des colonnes */}
            <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th colSpan={4} className="py-6 px-12 text-gray-600 font-bold">
                1. Identification Contenu
              </th>
              <th colSpan={5} className="py-6 px-8 text-blue-800 font-bold bg-blue-100/50 text-center border-l border-r border-blue-200">
                2. Métriques Mesurées (Collecte Directe)
              </th>
              <th colSpan={2} className="py-6 px-8 text-emerald-800 font-bold bg-emerald-100/50 text-center border-r border-emerald-200">
                3. Métriques Calculées
              </th>
              <th colSpan={2} className="py-6 px-8 text-gray-600 font-bold text-center">
                4. Gestion
              </th>
            </tr>
            {/* Colonnes individuelles */}
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
              <th className="py-10 px-12 font-bold min-w-[220px]">Publication & Sujet</th>
              <th className="py-10 px-8 font-bold min-w-[120px]">Talent</th>
              <th className="py-10 px-8 font-bold">Plateforme</th>
              <th className="py-10 px-8 font-bold min-w-[90px]">Date</th>
              {/* Mesurées */}
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40">Vues</th>
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40">Likes</th>
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40">Comm.</th>
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40">Partages</th>
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40 border-r border-blue-200">Eng. Déclaré</th>
              {/* Calculées */}
              <th className="py-10 px-8 font-bold text-right text-emerald-800 bg-emerald-50/40">⚡ Calculé</th>
              <th className="py-10 px-8 font-bold text-right text-emerald-800 bg-emerald-50/40 border-r border-emerald-200">📈 Taux / Vues</th>
              {/* Complétude & Actions */}
              <th className="py-10 px-8 font-bold text-center">Complétude</th>
              <th className="py-10 px-8 font-bold text-center min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliverables.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-40 text-muted italic">
                  Aucune publication ne correspond aux filtres actifs.
                </td>
              </tr>
            ) : (
              paginatedItems.map((d, idx) => {
                const isComplete = d.metrics?.views > 0 &&
                  d.metrics?.likes !== null &&
                  d.metrics?.comments !== null &&
                  d.metrics?.shares !== null;

                return (
                  <tr
                    key={d.id || idx}
                    className="hover:bg-amber-50/30 transition-colors"
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                    }}
                  >
                    {/* Publication & Sujet */}
                    <td className="py-10 px-12">
                      <div className="font-semibold text-dark flex items-center gap-6">
                        <span className="truncate max-w-[200px]" title={d.title}>
                          {d.title}
                        </span>
                        {d.url && (
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Ouvrir le post dans un nouvel onglet"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <div className="text-[11px] text-muted flex items-center gap-6 mt-1 flex-wrap">
                        <span className="px-6 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                          {d.content_subject || 'Général'}
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[140px] text-gray-500" title={d.campaign_name}>
                          {d.campaign_name || d.campaign_id}
                        </span>
                      </div>
                    </td>

                    {/* Talent */}
                    <td className="py-10 px-8 font-medium text-dark">
                      {d.talent_name}
                    </td>

                    {/* Plateforme & Format */}
                    <td className="py-10 px-8">
                      <div className="flex flex-col gap-2">
                        {getPlatformBadge(d.platform)}
                        <span className="text-[10px] text-muted capitalize">
                          {d.content_type || 'post'}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-10 px-8 text-muted whitespace-nowrap">
                      {d.published_at || d.date_raw || 'N/D'}
                    </td>

                    {/* Vues (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono bg-blue-50/20">
                      {d.metrics?.views !== null && d.metrics?.views !== undefined ? (
                        <span className="font-semibold text-dark">{formatNumber(d.metrics.views)}</span>
                      ) : (
                        <span className="text-muted italic">N/D</span>
                      )}
                    </td>

                    {/* Likes (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono text-dark bg-blue-50/20">
                      {d.metrics?.likes !== null && d.metrics?.likes !== undefined
                        ? formatNumber(d.metrics.likes)
                        : <span className="text-muted italic">N/D</span>}
                    </td>

                    {/* Commentaires (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono text-dark bg-blue-50/20">
                      {d.metrics?.comments !== null && d.metrics?.comments !== undefined
                        ? formatNumber(d.metrics.comments)
                        : <span className="text-muted italic">N/D</span>}
                    </td>

                    {/* Partages (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono text-dark bg-blue-50/20">
                      {d.metrics?.shares !== null && d.metrics?.shares !== undefined
                        ? formatNumber(d.metrics.shares)
                        : <span className="text-muted italic">N/D</span>}
                    </td>

                    {/* Engagement Déclaré (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono bg-blue-50/20 border-r border-blue-200">
                      {d.metrics?.engagement_reported !== null && d.metrics?.engagement_reported !== undefined ? (
                        <span className="text-dark font-medium">{formatNumber(d.metrics.engagement_reported)}</span>
                      ) : (
                        <span className="text-muted italic">N/D</span>
                      )}
                    </td>

                    {/* Engagement Calculé (⚡) */}
                    <td className="py-10 px-8 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">
                      {d.metrics?.engagement_calculated !== null && d.metrics?.engagement_calculated !== undefined
                        ? formatNumber(d.metrics.engagement_calculated)
                        : <span className="text-muted italic">N/D</span>}
                    </td>

                    {/* Taux sur Vues (⚡) */}
                    <td className="py-10 px-8 text-right font-mono font-bold bg-emerald-50/30 border-r border-emerald-200">
                      {d.metrics?.engagement_rate !== null && d.metrics?.engagement_rate !== undefined ? (
                        <span className="px-6 py-2 rounded bg-emerald-100 text-emerald-800">
                          {d.metrics.engagement_rate}%
                        </span>
                      ) : (
                        <span className="text-[10px] px-6 py-2 rounded bg-gray-100 text-muted italic" title="Vues non renseignées">
                          N/D
                        </span>
                      )}
                    </td>

                    {/* Complétude */}
                    <td className="py-10 px-8 text-center">
                      <span
                        className="inline-flex items-center gap-4 px-6 py-2 rounded-full text-[10px] font-semibold"
                        style={{
                          background: isComplete ? '#ECFDF5' : '#FFFBEB',
                          color: isComplete ? '#047857' : '#B45309',
                          border: `1px solid ${isComplete ? '#A7F3D0' : '#FDE68A'}`,
                        }}
                        title={isComplete ? 'Toutes les métriques sont renseignées' : 'Données partielles ou vues manquantes'}
                      >
                        {isComplete ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                        {isComplete ? 'Validé' : 'Partiel'}
                      </span>
                    </td>

                    {/* Actions : Modifier & Supprimer */}
                    <td className="py-10 px-8 text-center">
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => onEdit(d)}
                          className="p-6 rounded hover:bg-blue-50 text-blue-600 transition-colors border border-transparent hover:border-blue-200"
                          title="Modifier les performances & KPIs de cette publication"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(d.id)}
                          className="p-6 rounded hover:bg-rose-50 text-rose-600 transition-colors border border-transparent hover:border-rose-200"
                          title="Supprimer cette publication"
                        >
                          <Trash2 size={14} />
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-16 pt-12 border-t border-gray-200 text-xs text-muted">
          <span>
            Affichage de {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, deliverables.length)} sur {deliverables.length} livrables
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-10 py-4 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >
              Précédent
            </button>
            <span className="px-8 font-semibold text-dark">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-10 py-4 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
