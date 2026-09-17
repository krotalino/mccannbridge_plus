import React from 'react';
import { 
  Eye, Monitor, Globe, Smartphone, Play, Pause, Layers, Target 
} from 'lucide-react';

export default function DisplayTable({ campaigns, onSelectCampaign, onToggleStatus }) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="card text-center py-16 bg-white border border-gray-200 rounded-xl shadow-xs">
        <div className="text-3xl mb-3">🖥️</div>
        <h4 className="text-sm font-bold text-gray-900 mb-1">Aucune campagne Display trouvée</h4>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Aucune campagne display programmatique ne correspond à vos filtres actuels. Modifiez vos filtres ou créez une campagne.
        </p>
      </div>
    );
  }

  const getTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'bannière':
      case 'banniere':
        return { label: 'Bannière Web', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'vidéo':
      case 'video':
        return { label: 'Vidéo Preroll', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'natif':
        return { label: 'Natif In-Feed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'interstitiel':
        return { label: 'Interstitiel', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: type, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
    }
  };

  return (
    <div className="card bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Obligatory Columns */}
          <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Nom de la campagne</th>
              <th className="py-3 px-3">Type Display</th>
              <th className="py-3 px-3">Format</th>
              <th className="py-3 px-3 whitespace-nowrap">Période</th>
              <th className="py-3 px-3 text-right">Impressions</th>
              <th className="py-3 px-3 text-right">Clics</th>
              <th className="py-3 px-3 text-right">CTR</th>
              <th className="py-3 px-3 text-right">CPM</th>
              <th className="py-3 px-3 text-right">Conversions</th>
              <th className="py-3 px-3 text-center">Statut</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-700">
            {campaigns.map((camp) => {
              const typeBadge = getTypeBadge(camp.displayType);
              const budgetSpent = camp.budgetSpent || 0;
              const budgetTotal = camp.budgetTotal || 0;
              const budgetPct = budgetTotal > 0 ? Math.min(100, Math.round((budgetSpent / budgetTotal) * 100)) : 0;
              const isBudgetWarning = budgetPct >= 90;

              return (
                <tr 
                  key={camp.id}
                  onClick={() => onSelectCampaign(camp)}
                  className="hover:bg-cyan-50/30 transition-colors cursor-pointer group"
                >
                  {/* 1. Client */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{camp.clientLogo || '🖥️'}</span>
                      <span className="font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">
                        {camp.client}
                      </span>
                    </div>
                  </td>

                  {/* 2. Nom de la campagne */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900 group-hover:text-cyan-700 line-clamp-1 max-w-xs transition-colors">
                      {camp.campaignName}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 font-mono">
                      Budget : {budgetSpent.toLocaleString('fr-FR')} / {budgetTotal.toLocaleString('fr-FR')} F
                    </div>
                  </td>

                  {/* 3. Type de display */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${typeBadge.color}`}>
                      {typeBadge.label}
                    </span>
                  </td>

                  {/* 4. Format */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-700 border border-gray-200">
                      {camp.format}
                    </span>
                  </td>

                  {/* 5. Période */}
                  <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                    {camp.period || `${camp.startDate} - ${camp.endDate}`}
                  </td>

                  {/* 6. Impressions */}
                  <td className="py-3 px-3 text-right font-mono text-gray-700 whitespace-nowrap">
                    {(camp.impressions || 0).toLocaleString('fr-FR')}
                  </td>

                  {/* 7. Clics */}
                  <td className="py-3 px-3 text-right font-mono text-gray-900 font-bold whitespace-nowrap">
                    {(camp.clics || 0).toLocaleString('fr-FR')}
                  </td>

                  {/* 8. CTR */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                      camp.ctr >= 1.5 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : camp.ctr < 0.8 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {camp.ctr}%
                    </span>
                  </td>

                  {/* 9. CPM */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-cyan-700 whitespace-nowrap">
                    {Math.round(camp.cpm || 0).toLocaleString('fr-FR')} <span className="text-[10px] text-gray-500 font-normal">F</span>
                  </td>

                  {/* 10. Conversions */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="font-bold font-mono text-emerald-700">
                      {(camp.conversions || 0).toLocaleString('fr-FR')}
                    </div>
                    {camp.conversionRate && (
                      <div className="text-[10px] text-gray-500 font-mono">
                        {camp.conversionRate}% CVR
                      </div>
                    )}
                  </td>

                  {/* 11. Statut */}
                  <td className="py-3 px-3 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleStatus(camp.id)}
                      title="Cliquer pour modifier le statut"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all hover:scale-105 ${
                        camp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : camp.status === 'En pause'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        camp.status === 'Active' ? 'bg-emerald-500' : camp.status === 'En pause' ? 'bg-amber-500' : 'bg-gray-400'
                      }`} />
                      <span>{camp.status}</span>
                    </button>
                  </td>

                  {/* 12. Détails */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCampaign(camp);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-cyan-700 hover:text-white bg-cyan-50 hover:bg-cyan-600 border border-cyan-200 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <span>Créas & Sites</span>
                      <Eye className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
