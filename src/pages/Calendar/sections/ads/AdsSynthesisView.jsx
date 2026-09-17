import React, { useMemo } from 'react';
import { 
  BarChart3, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, 
  Layers, CheckCircle2, ArrowUpRight, PieChart, Target, Zap 
} from 'lucide-react';

export default function AdsSynthesisView({ 
  socialCampaigns = [], 
  displayCampaigns = [], 
  onSelectSocial, 
  onSelectDisplay,
  onOpenNewCampaign 
}) {
  // Aggregate budgets and spends by client
  const clientSummary = useMemo(() => {
    const map = new Map();

    const processCamp = (c, type) => {
      const client = c.client || 'Autre';
      if (!map.has(client)) {
        map.set(client, {
          client,
          logo: c.clientLogo || '🏢',
          totalBudget: 0,
          totalSpent: 0,
          impressions: 0,
          clics: 0,
          conversions: 0,
          socialCount: 0,
          displayCount: 0,
          campaigns: []
        });
      }
      const data = map.get(client);
      data.totalBudget += (c.budgetTotal || 0);
      data.totalSpent += (c.budgetSpent || 0);
      data.impressions += (c.impressions || 0);
      data.clics += (c.clics || 0);
      data.conversions += (c.conversions || 0);
      if (type === 'social') data.socialCount += 1;
      if (type === 'display') data.displayCount += 1;
      data.campaigns.push({ ...c, adType: type });
    };

    socialCampaigns.forEach(c => processCamp(c, 'social'));
    displayCampaigns.forEach(c => processCamp(c, 'display'));

    return Array.from(map.values()).map(cl => {
      const remaining = cl.totalBudget - cl.totalSpent;
      const absorptionPct = cl.totalBudget > 0 ? Math.round((cl.totalSpent / cl.totalBudget) * 100) : 0;
      const averageCtr = cl.impressions > 0 ? Number(((cl.clics / cl.impressions) * 100).toFixed(2)) : 0;
      return {
        ...cl,
        remaining,
        absorptionPct,
        averageCtr
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [socialCampaigns, displayCampaigns]);

  // Overall consolidated metrics
  const totals = useMemo(() => {
    const all = [...socialCampaigns, ...displayCampaigns];
    const budgetTotal = all.reduce((sum, c) => sum + (c.budgetTotal || 0), 0);
    const budgetSpent = all.reduce((sum, c) => sum + (c.budgetSpent || 0), 0);
    const impressions = all.reduce((sum, c) => sum + (c.impressions || 0), 0);
    const clics = all.reduce((sum, c) => sum + (c.clics || 0), 0);
    const conversions = displayCampaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
    const avgCtr = impressions > 0 ? Number(((clics / impressions) * 100).toFixed(2)) : 0;
    const avgCpc = clics > 0 ? Math.round(budgetSpent / clics) : 0;
    const absorptionRate = budgetTotal > 0 ? Math.round((budgetSpent / budgetTotal) * 100) : 0;

    return {
      budgetTotal,
      budgetSpent,
      budgetRemaining: budgetTotal - budgetSpent,
      impressions,
      clics,
      conversions,
      avgCtr,
      avgCpc,
      absorptionRate
    };
  }, [socialCampaigns, displayCampaigns]);

  // Alerts extraction
  const alerts = useMemo(() => {
    const list = [];
    socialCampaigns.forEach(c => {
      const pct = c.budgetTotal > 0 ? (c.budgetSpent / c.budgetTotal) * 100 : 0;
      if (pct >= 90) {
        list.push({
          type: 'budget',
          severity: 'warning',
          client: c.client,
          campaignName: c.campaignName,
          channel: `Social (${c.platform})`,
          message: `Budget absorbé à ${Math.round(pct)}% (${(c.budgetSpent || 0).toLocaleString('fr-FR')} FCFA sur ${(c.budgetTotal || 0).toLocaleString('fr-FR')} FCFA).`,
          campaign: c,
          campaignType: 'social'
        });
      }
      if (c.ctr < 0.8 && c.status === 'Active') {
        list.push({
          type: 'performance',
          severity: 'info',
          client: c.client,
          campaignName: c.campaignName,
          channel: `Social (${c.platform})`,
          message: `CTR inférieur à 0.8% (${c.ctr}%). Revoir le ciblage ou le visuel.`,
          campaign: c,
          campaignType: 'social'
        });
      }
    });

    displayCampaigns.forEach(c => {
      const pct = c.budgetTotal > 0 ? (c.budgetSpent / c.budgetTotal) * 100 : 0;
      if (pct >= 90) {
        list.push({
          type: 'budget',
          severity: 'warning',
          client: c.client,
          campaignName: c.campaignName,
          channel: `Display (${c.format})`,
          message: `Budget display alloué à ${Math.round(pct)}%. Risque de coupure programmatique.`,
          campaign: c,
          campaignType: 'display'
        });
      }
      if (c.ctr < 0.8 && c.status === 'Active') {
        list.push({
          type: 'performance',
          severity: 'info',
          client: c.client,
          campaignName: c.campaignName,
          channel: `Display (${c.format})`,
          message: `CTR display en dessous du seuil optimal (${c.ctr}%). Exclure les emplacements à faible rendement.`,
          campaign: c,
          campaignType: 'display'
        });
      }
    });

    return list;
  }, [socialCampaigns, displayCampaigns]);

  return (
    <div className="space-y-6">
      {/* 1. Alerte de vigilance budgétaire si existantes */}
      {alerts.length > 0 && (
        <div className="card bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-amber-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Points de Vigilance & Alertes Automatisées ({alerts.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((a, idx) => (
              <div 
                key={idx}
                onClick={() => a.campaignType === 'social' ? onSelectSocial(a.campaign) : onSelectDisplay(a.campaign)}
                className="bg-white border border-amber-200/80 rounded-lg p-3 hover:border-amber-400 cursor-pointer transition-all flex items-start justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-xs text-gray-900">{a.client}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 border border-gray-200">
                      {a.channel}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {a.campaignName}
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1">
                    {a.message}
                  </p>
                </div>
                <button className="text-[10px] font-bold text-orange-600 hover:text-orange-700 whitespace-nowrap px-2 py-1 bg-orange-50 rounded border border-orange-200 shrink-0">
                  Gérer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Cartes de synthèse financière */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
            <span className="font-semibold">Budget Consommé Total</span>
            <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold font-mono text-gray-900">
            {totals.budgetSpent.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-500">FCFA</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <span>Plafond : {totals.budgetTotal.toLocaleString('fr-FR')} FCFA</span>
            <span className="font-bold text-orange-600 font-mono">{totals.absorptionRate}% consommé</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, totals.absorptionRate)}%` }} />
          </div>
        </div>

        <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
            <span className="font-semibold">Reliquat Disponible</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold font-mono text-emerald-700">
            {totals.budgetRemaining.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-500">FCFA</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-500">
            Marge de manœuvre pour réallocations ou prolongations de campagnes.
          </div>
        </div>

        <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
            <span className="font-semibold">Volume d'Impressions</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold font-mono text-gray-900">
            {totals.impressions.toLocaleString('fr-FR')}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <span>{totals.clics.toLocaleString('fr-FR')} clics générés</span>
            <span className="font-bold text-blue-600 font-mono">CTR {totals.avgCtr}%</span>
          </div>
        </div>

        <div className="card bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
            <span className="font-semibold">Efficacité CPC / CVR</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold font-mono text-purple-700">
            {totals.avgCpc} <span className="text-xs font-normal text-gray-500">FCFA / clic</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <span>{totals.conversions.toLocaleString('fr-FR')} conversions</span>
            <span className="font-bold text-purple-600 font-mono">Display</span>
          </div>
        </div>
      </div>

      {/* 3. Tableau de bord par compte annonceur (Client) */}
      <div className="card bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                PILOTAGE ANNONCEURS
              </span>
              <h3 className="text-sm font-bold text-gray-900">
                Consommation Budgétaire & KPIs par Client
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Répartition des investissements publicitaires, volumes d'engagement et reliquats disponibles
            </p>
          </div>

          <div className="text-xs text-gray-500">
            <span className="font-bold text-gray-900">{clientSummary.length}</span> annonceurs actifs
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Annonceur / Client</th>
                <th className="py-3 px-3 text-center">Campagnes</th>
                <th className="py-3 px-4 text-right">Budget Alloué</th>
                <th className="py-3 px-4 text-right">Dépensé</th>
                <th className="py-3 px-3 text-center">Taux d'absorption</th>
                <th className="py-3 px-4 text-right">Reliquat</th>
                <th className="py-3 px-3 text-right">Impressions</th>
                <th className="py-3 px-3 text-right">CTR Moyen</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700">
              {clientSummary.map((cl, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{cl.logo}</span>
                      <div>
                        <div className="font-bold text-gray-900">{cl.client}</div>
                        <div className="text-[10px] text-gray-500">
                          {cl.socialCount} Social · {cl.displayCount} Display
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-bold text-gray-900">
                    {cl.campaigns.length}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-gray-900">
                    {cl.totalBudget.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-500 font-normal">F</span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-orange-600">
                    {cl.totalSpent.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-500 font-normal">F</span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${cl.absorptionPct >= 90 ? 'bg-amber-500' : 'bg-orange-500'}`}
                          style={{ width: `${Math.min(100, cl.absorptionPct)}%` }}
                        />
                      </div>
                      <span className={`text-[11px] font-mono font-bold ${cl.absorptionPct >= 90 ? 'text-amber-600' : 'text-gray-700'}`}>
                        {cl.absorptionPct}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-emerald-700">
                    {cl.remaining.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-500 font-normal">F</span>
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-gray-700">
                    {cl.impressions.toLocaleString('fr-FR')}
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap font-mono font-bold text-blue-700">
                    {cl.averageCtr}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
