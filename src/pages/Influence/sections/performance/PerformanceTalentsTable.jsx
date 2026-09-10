import { formatNumber } from '../../../../utils/helpers';
import { User, CheckCircle, AlertTriangle, Filter, ExternalLink } from 'lucide-react';

export default function PerformanceTalentsTable({
  talentsMetrics = [],
  onFilterTalent,
  activeTalentFilter = '',
}) {
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
      <div className="flex flex-wrap items-center justify-between gap-12 mb-16 pb-12" style={{ borderBottom: '1px solid #f3f4f6' }}>
        <div>
          <div className="flex items-center gap-8">
            <span
              className="text-xs font-bold px-8 py-2 rounded"
              style={{ background: '#FFF0E5', color: '#FF7900', border: '1px solid #FED7AA' }}
            >
              SYNTHÈSE TALENTS
            </span>
            <h3 className="text-base font-bold text-dark" style={{ margin: 0 }}>
              Indicateurs de Performance par Influenceur
            </h3>
          </div>
          <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
            Décomposition mesurée vs calculée, taux d'engagement effectif sur vues et complétude des données
          </p>
        </div>

        <div className="text-xs text-muted">
          <span className="font-semibold text-dark">{talentsMetrics.length}</span> talent{talentsMetrics.length > 1 ? 's' : ''} actif{talentsMetrics.length > 1 ? 's' : ''} sur le périmètre
        </div>
      </div>

      <div className="overflow-x-auto" style={{ maxHeight: 480 }}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
              <th className="py-10 px-12 font-bold">Influenceur / Talent</th>
              <th className="py-10 px-8 font-bold text-center">Pubs</th>
              {/* Colonnes Mesurées */}
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40">Vues (Mesuré)</th>
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40">Likes</th>
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40">Comm.</th>
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40">Partages</th>
              <th className="py-10 px-8 font-bold text-right text-blue-700 bg-blue-50/40">Eng. Déclaré</th>
              {/* Colonnes Calculées */}
              <th className="py-10 px-8 font-bold text-right text-emerald-800 bg-emerald-50/40">⚡ Eng. Calculé</th>
              <th className="py-10 px-8 font-bold text-right text-emerald-800 bg-emerald-50/40">📈 Taux / Vues</th>
              {/* Complétude */}
              <th className="py-10 px-10 font-bold text-center">Complétude Données</th>
              <th className="py-10 px-8 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {talentsMetrics.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-32 text-muted italic">
                  Aucun influenceur ne correspond aux filtres actifs.
                </td>
              </tr>
            ) : (
              talentsMetrics.map((t, idx) => {
                const isFiltered = activeTalentFilter === t.name;
                const isComplete = t.completenessRatio >= 100;
                const isPartial = t.completenessRatio > 0 && t.completenessRatio < 100;

                return (
                  <tr
                    key={t.name + idx}
                    className="hover:bg-gray-50 transition-colors"
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      background: isFiltered ? '#FFF7ED' : idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                    }}
                  >
                    {/* Nom Talent */}
                    <td className="py-10 px-12 font-medium text-dark">
                      <div className="flex items-center gap-8">
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#F1F5F9',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: 11,
                          }}
                        >
                          {t.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-dark flex items-center gap-4">
                            {t.name}
                            {isFiltered && (
                              <span className="text-xs px-6 py-1 rounded bg-orange-100 text-orange-800 font-normal">
                                Actif
                              </span>
                            )}
                          </div>
                          {t.campaigns && t.campaigns.length > 0 && (
                            <div className="text-xs text-muted truncate" style={{ maxWidth: 160 }}>
                              {t.campaigns.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Nombre de pubs */}
                    <td className="py-10 px-8 text-center font-bold text-dark">
                      <span className="px-8 py-2 rounded-full bg-gray-100 border border-gray-200">
                        {t.publicationsCount}
                      </span>
                    </td>

                    {/* Vues (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono bg-blue-50/20">
                      {t.views > 0 ? (
                        <span className="font-semibold text-dark">{formatNumber(t.views)}</span>
                      ) : (
                        <span className="text-muted italic">N/D</span>
                      )}
                    </td>

                    {/* Likes (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono text-dark bg-blue-50/20">
                      {formatNumber(t.likes)}
                    </td>

                    {/* Commentaires (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono text-dark bg-blue-50/20">
                      {formatNumber(t.comments)}
                    </td>

                    {/* Partages (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono text-dark bg-blue-50/20">
                      {formatNumber(t.shares)}
                    </td>

                    {/* Engagement Déclaré (Mesuré) */}
                    <td className="py-10 px-8 text-right font-mono bg-blue-50/20">
                      {t.reportedEngagement !== null ? (
                        <span className="text-dark font-medium">{formatNumber(t.reportedEngagement)}</span>
                      ) : (
                        <span className="text-muted italic">N/D</span>
                      )}
                    </td>

                    {/* Engagement Calculé (⚡) */}
                    <td className="py-10 px-8 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">
                      {formatNumber(t.calculatedEngagement)}
                    </td>

                    {/* Taux sur Vues (⚡) */}
                    <td className="py-10 px-8 text-right font-mono font-bold bg-emerald-50/30">
                      {t.rateOnViews !== null ? (
                        <span className="px-6 py-2 rounded bg-emerald-100 text-emerald-800">
                          {t.rateOnViews}%
                        </span>
                      ) : (
                        <span className="text-xs px-6 py-2 rounded bg-gray-100 text-muted italic" title="Vues non renseignées ou nulles">
                          Non calculable
                        </span>
                      )}
                    </td>

                    {/* Complétude */}
                    <td className="py-10 px-10 text-center">
                      <span
                        className="inline-flex items-center gap-4 px-8 py-2 rounded-full text-xs font-semibold"
                        style={{
                          background: isComplete ? '#ECFDF5' : isPartial ? '#FFFBEB' : '#FEF2F2',
                          color: isComplete ? '#047857' : isPartial ? '#B45309' : '#B91C1C',
                          border: `1px solid ${isComplete ? '#A7F3D0' : isPartial ? '#FDE68A' : '#FECACA'}`,
                        }}
                      >
                        {isComplete ? (
                          <CheckCircle size={12} />
                        ) : (
                          <AlertTriangle size={12} />
                        )}
                        {t.completenessRatio}% ({isComplete ? 'Complète' : isPartial ? 'Partielle' : 'Incomplète'})
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-10 px-8 text-center">
                      <button
                        onClick={() => onFilterTalent(isFiltered ? '' : t.name)}
                        className={`text-xs px-8 py-4 rounded border transition-colors flex items-center gap-4 mx-auto ${
                          isFiltered
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-dark hover:bg-gray-100 border-gray-300'
                        }`}
                        title={isFiltered ? 'Désactiver le filtre sur ce talent' : 'Filtrer uniquement ce talent'}
                      >
                        <Filter size={11} />
                        {isFiltered ? 'Retirer' : 'Filtrer'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
