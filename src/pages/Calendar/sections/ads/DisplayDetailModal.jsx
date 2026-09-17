import React from 'react';
import { 
  X, Globe, Monitor, Smartphone, Eye, MousePointer, 
  Layers, CheckCircle2, TrendingUp, Sparkles, ExternalLink,
  ShieldAlert, Target
} from 'lucide-react';

export default function DisplayDetailModal({ campaign, isOpen, onClose, onUpdateCampaign }) {
  if (!isOpen || !campaign) return null;

  const budgetPct = campaign.budgetTotal > 0 
    ? Math.min(100, Math.round(((campaign.budgetSpent || 0) / campaign.budgetTotal) * 100)) 
    : 0;
  const isBudgetWarning = budgetPct >= 90;
  const isLowCtr = campaign.ctr < 0.8;

  const creative = campaign.creativePreview || {};
  const placements = campaign.placements || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{campaign.clientLogo || '🖥️'}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  {campaign.campaignName}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  campaign.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : campaign.status === 'En pause'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  ● {campaign.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Client : <span className="text-gray-900 font-semibold">{campaign.client}</span> · Type : <span className="text-cyan-700 font-semibold">{campaign.displayType}</span> · Format : <span className="text-orange-600 font-semibold">{campaign.format}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* Quick Alert Banner if budget or CTR alert */}
          {(isBudgetWarning || isLowCtr) && (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Point de vigilance opérationnel Display :</p>
                {isBudgetWarning && (
                  <p>• Le budget alloué est consommé à <strong>{budgetPct}%</strong> ({campaign.budgetSpent.toLocaleString('fr-FR')} FCFA). Risque de suspension imminente de la diffusion programmatique.</p>
                )}
                {isLowCtr && (
                  <p>• Le CTR programmatique est de <strong>{campaign.ctr}%</strong> (&lt; 0.8%). Nous conseillons d'exclure les sites sous-performants et de rafraîchir la créa.</p>
                )}
              </div>
            </div>
          )}

          {/* Grid Layout: Visual Creative Mockup & Placements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Creative Banner Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50 shadow-2xs">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-700 bg-white">
                  <span>Aperçu de la Création Display</span>
                  <span className="text-[10px] text-gray-500 font-mono">{creative.dimensions || campaign.format}</span>
                </div>

                {/* Banner Display Preview Canvas */}
                <div className="p-4 bg-gray-100/70 flex flex-col items-center justify-center min-h-[220px]">
                  <div className="relative w-full max-w-[300px] bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    {creative.bannerUrl ? (
                      <img 
                        src={creative.bannerUrl} 
                        alt={creative.title || campaign.campaignName} 
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-contain max-h-[260px]"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    ) : (
                      <div className="p-6 text-center text-gray-400">
                        <Monitor className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <span className="text-xs">Bannière HTML5 interactive</span>
                      </div>
                    )}

                    {/* Overlay Tag */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white font-mono">
                      {creative.dimensions || '300x250'}
                    </div>
                  </div>

                  {/* Banner CTA & Destination URL */}
                  <div className="w-full mt-3 p-3 bg-white border border-gray-200 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-[10px] uppercase font-bold">Call To Action</span>
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 font-bold rounded text-[10px]">
                        {creative.cta || 'En savoir plus'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">URL de redirection</span>
                      <a 
                        href={creative.destinationUrl || '#'} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-cyan-700 hover:underline text-[11px] font-mono break-all flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span>{creative.destinationUrl || 'https://client.cm/landing-page'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                <span className="font-bold text-gray-800 block">Spécifications Techniques Régie</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                  <div>Régie : <strong className="text-gray-800">{campaign.dspNetwork || 'Google Display Network'}</strong></div>
                  <div>Format : <strong className="text-gray-800">{campaign.format}</strong></div>
                  <div>Poids max : <strong className="text-gray-800">&lt; 150 Ko</strong></div>
                  <div>Ciblage : <strong className="text-gray-800">{campaign.targeting || 'Contextuel & Géolocalisé'}</strong></div>
                </div>
              </div>
            </div>

            {/* KPIs & Publisher Sites Placements (7 cols) */}
            <div className="lg:col-span-7 space-y-5">

              {/* 4 Main KPIs Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-medium">Budget Consommé</div>
                  <div className="text-sm font-extrabold font-mono text-gray-900 mt-1">
                    {campaign.budgetSpent.toLocaleString('fr-FR')} <span className="text-[10px] font-normal text-gray-500">F</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    sur {campaign.budgetTotal.toLocaleString('fr-FR')} F
                  </div>
                </div>

                <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-medium">Impressions</div>
                  <div className="text-sm font-extrabold font-mono text-gray-900 mt-1">
                    {(campaign.impressions || 0).toLocaleString('fr-FR')}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    CPM {Math.round(campaign.cpm || 0)} F
                  </div>
                </div>

                <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-medium">Clics & CTR</div>
                  <div className="text-sm font-extrabold font-mono text-cyan-700 mt-1">
                    {(campaign.clics || 0).toLocaleString('fr-FR')}
                  </div>
                  <div className="text-[10px] font-bold text-cyan-700 mt-0.5">
                    CTR {campaign.ctr}%
                  </div>
                </div>

                <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-medium">Conversions</div>
                  <div className="text-sm font-extrabold font-mono text-emerald-700 mt-1">
                    {(campaign.conversions || 0).toLocaleString('fr-FR')}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                    CVR {campaign.conversionRate}%
                  </div>
                </div>
              </div>

              {/* SPEC MANDATORY: Sites diffuseurs (Emplacements programmatiques) */}
              <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-700" />
                    <span className="text-xs font-bold text-gray-900">
                      Sites Diffuseurs & Emplacements Programmatiques
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-700">
                    {placements.length} éditeurs audités
                  </span>
                </div>

                <p className="text-[11px] text-gray-500">
                  Performance ventilée par site média partenaire pour optimisation continue de la white-list / black-list.
                </p>

                {/* Placements Table */}
                <div className="overflow-x-auto max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="text-[10px] uppercase text-gray-500 border-b border-gray-200 bg-white">
                      <tr>
                        <th className="py-2.5 px-3 font-bold">Site Éditeur</th>
                        <th className="py-2.5 px-2.5 font-bold">Format</th>
                        <th className="py-2.5 px-3 font-bold text-right">Impressions</th>
                        <th className="py-2.5 px-3 font-bold text-right">Clics</th>
                        <th className="py-2.5 px-3 font-bold text-right">CTR</th>
                        <th className="py-2.5 px-3 font-bold text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {placements.map((p, idx) => (
                        <tr key={idx} className="hover:bg-white/60">
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-bold text-gray-900 text-xs">{p.site}</div>
                            <div className="text-[10px] text-gray-500 font-mono">{p.url}</div>
                          </td>
                          <td className="py-2.5 px-2.5 whitespace-nowrap">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                              {p.format}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-gray-700 whitespace-nowrap">
                            {(p.impressions || 0).toLocaleString('fr-FR')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                            {(p.clics || 0).toLocaleString('fr-FR')}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                              p.ctr >= 1.0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {p.ctr}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Diffusé
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Régie DSP : <span className="font-mono text-gray-700 font-semibold">{campaign.dspNetwork || 'Google Display'}</span> · ID : <span className="font-mono text-gray-700">{campaign.id}</span></span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-2xs transition-colors"
          >
            Fermer la fiche
          </button>
        </div>

      </div>
    </div>
  );
}
