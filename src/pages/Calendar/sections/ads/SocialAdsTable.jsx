import React from 'react';
import { 
  Eye, MousePointer, TrendingUp, AlertTriangle, Play, Pause, 
  ExternalLink, Calendar, CheckCircle2, MoreHorizontal 
} from 'lucide-react';

export default function SocialAdsTable({ campaigns, onSelectCampaign, onToggleStatus }) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="card text-center py-16 bg-white border border-gray-200 rounded-xl shadow-xs">
        <div className="text-3xl mb-3">📱</div>
        <h4 className="text-sm font-bold text-gray-900 mb-1">Aucune campagne Social Ads trouvée</h4>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Aucune publication sponsorisée ne correspond à vos filtres actuels. Modifiez vos filtres ou ajoutez une nouvelle campagne.
        </p>
      </div>
    );
  }

  const getPlatformBadge = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'meta':
      case 'facebook':
        return { label: 'Meta (FB/IG)', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'instagram':
        return { label: 'Instagram', color: 'bg-pink-50 text-pink-700 border-pink-200' };
      case 'tiktok':
        return { label: 'TikTok Ads', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'linkedin':
        return { label: 'LinkedIn', color: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'x':
      case 'twitter':
        return { label: 'X (Twitter)', color: 'bg-gray-100 text-gray-700 border-gray-300' };
      default:
        return { label: platform, color: 'bg-orange-50 text-orange-700 border-orange-200' };
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
              <th className="py-3 px-3">Plateforme</th>
              <th className="py-3 px-4">Nom de la campagne</th>
              <th className="py-3 px-3 whitespace-nowrap">Date de début</th>
              <th className="py-3 px-3 whitespace-nowrap">Date de fin</th>
              <th className="py-3 px-4 text-right">Budget dépensé</th>
              <th className="py-3 px-3 text-right">Impressions</th>
              <th className="py-3 px-3 text-right">Clics</th>
              <th className="py-3 px-3 text-right">CTR</th>
              <th className="py-3 px-3 text-right">CPC</th>
              <th className="py-3 px-3 text-center">Statut</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-700">
            {campaigns.map((camp) => {
              const platformBadge = getPlatformBadge(camp.platform);
              const budgetSpent = camp.budgetSpent || 0;
              const budgetTotal = camp.budgetTotal || 0;
              const budgetPct = budgetTotal > 0 ? Math.min(100, Math.round((budgetSpent / budgetTotal) * 100)) : 0;
              const isBudgetWarning = budgetPct >= 90;

              return (
                <tr 
                  key={camp.id}
                  onClick={() => onSelectCampaign(camp)}
                  className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                >
                  {/* 1. Client */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{camp.clientLogo || '🏢'}</span>
                      <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {camp.client}
                      </span>
                    </div>
                  </td>

                  {/* 2. Plateforme */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${platformBadge.color}`}>
                      {platformBadge.label}
                    </span>
                  </td>

                  {/* 3. Nom de la campagne */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900 group-hover:text-orange-600 line-clamp-1 max-w-xs transition-colors">
                      {camp.campaignName}
                    </div>
                    {camp.objective && (
                      <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                        🎯 {camp.objective}
                      </div>
                    )}
                  </td>

                  {/* 4. Date de début */}
                  <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                    {camp.startDate}
                  </td>

                  {/* 5. Date de fin */}
                  <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                    {camp.endDate}
                  </td>

                  {/* 6. Budget dépensé */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="font-extrabold font-mono text-gray-900 text-xs">
                      {budgetSpent.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-500 font-normal">FCFA</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${isBudgetWarning ? 'bg-amber-500' : 'bg-orange-500'}`}
                          style={{ width: `${budgetPct}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${isBudgetWarning ? 'text-amber-600' : 'text-gray-500'}`}>
                        {budgetPct}%
                      </span>
                    </div>
                  </td>

                  {/* 7. Impressions */}
                  <td className="py-3 px-3 text-right font-mono text-gray-700 whitespace-nowrap">
                    {(camp.impressions || 0).toLocaleString('fr-FR')}
                  </td>

                  {/* 8. Clics */}
                  <td className="py-3 px-3 text-right font-mono text-gray-900 font-bold whitespace-nowrap">
                    {(camp.clics || 0).toLocaleString('fr-FR')}
                  </td>

                  {/* 9. CTR */}
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

                  {/* 10. CPC */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-orange-600 whitespace-nowrap">
                    {(camp.cpc || 0).toFixed(1)} <span className="text-[10px] text-gray-500 font-normal">F</span>
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
                      className="px-2.5 py-1 text-[11px] font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-500 border border-orange-200 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <span>Fiche</span>
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
