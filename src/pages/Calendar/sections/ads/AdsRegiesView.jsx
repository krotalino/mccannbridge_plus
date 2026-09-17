import React, { useState } from 'react';
import { 
  Zap, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, 
  Settings, Key, Database, Globe, Layers, ArrowUpRight 
} from 'lucide-react';

export default function AdsRegiesView({ onOpenApiModal, onQuickSync }) {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const regies = [
    {
      id: 'meta',
      name: 'Meta Marketing API',
      subtitle: 'Facebook Ads & Instagram Sponsored Posts',
      logo: '📘',
      status: 'Connecté',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      account: 'act_718294018239 (McCann Bridge CM)',
      lastSync: 'Aujourd\'hui à 14:15',
      itemsCount: '4 campagnes synchronisées',
      tokenExpiry: 'Valide jusqu\'au 28 Décembre 2026',
      metricsFetched: ['Impressions', 'Clics', 'Spend', 'CTR', 'CPC', 'Portée Organique / Payante']
    },
    {
      id: 'google',
      name: 'Google Ads API & DV360',
      subtitle: 'Google Display Network, YouTube Ads & Search',
      logo: '🌐',
      status: 'Connecté',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      account: 'MCC-491-092-1180 (Bridge Media Display)',
      lastSync: 'Aujourd\'hui à 14:15',
      itemsCount: '2 campagnes Display actives',
      tokenExpiry: 'OAuth2 Refresh Token permanent',
      metricsFetched: ['Impressions', 'Clics', 'CTR', 'CPM', 'Conversions', 'Placement Sites']
    },
    {
      id: 'eskimi',
      name: 'Eskimi DSP & Programmatique Afrique',
      subtitle: 'Bannières mobiles opérateurs & Rich Media Cameroun',
      logo: '⚡',
      status: 'Connecté',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      account: 'ACC-ESK-CMR-9921',
      lastSync: 'Aujourd\'hui à 12:30',
      itemsCount: '1 campagne Interstitiel / Bannières',
      tokenExpiry: 'Clé API active',
      metricsFetched: ['Impressions', 'Clics', 'CTR', 'CPM', 'Sites Éditeurs Locaux']
    },
    {
      id: 'tiktok',
      name: 'TikTok Ads for Business',
      subtitle: 'TikTok Spark Ads & In-Feed Video Sponsorisé',
      logo: '🎵',
      status: 'En attente',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      account: 'Non rattaché (Mode Sandbox activé)',
      lastSync: 'Hier à 18:00',
      itemsCount: '0 campagne active',
      tokenExpiry: 'À renouveler via TikTok Business Center',
      metricsFetched: ['Vues vidéo 2s/6s', 'Clics', 'CTR', 'Partages', 'Coût par Vue']
    }
  ];

  const handleGlobalSync = () => {
    setSyncing(true);
    setSyncStatus(null);
    setTimeout(() => {
      setSyncing(false);
      setSyncStatus('Toutes les régies publicitaires ont été synchronisées avec succès.');
      if (onQuickSync) onQuickSync();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* En-tête & Action globale */}
      <div className="card bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-gray-900">
              Passerelles & Connecteurs Publicitaires Directs
            </h3>
          </div>
          <p className="text-xs text-gray-500 max-w-xl">
            Centralisation temps réel des métriques publicitaires (dépenses, impressions, clics, conversions) via les APIs des régies partenaires.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApiModal}
            className="px-3.5 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <Settings className="w-3.5 h-3.5 text-gray-500" />
            <span>Configurer les Clés API</span>
          </button>

          <button
            onClick={handleGlobalSync}
            disabled={syncing}
            className="px-4 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Synchronisation en cours...' : 'Synchroniser Toutes les Régies'}</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="card bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl p-3.5 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Grille des régies connectées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regies.map((regie) => (
          <div 
            key={regie.id}
            className="card bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-orange-200 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-gray-50 rounded-xl border border-gray-100">
                  {regie.logo}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span>{regie.name}</span>
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {regie.subtitle}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${regie.statusColor}`}>
                ● {regie.status}
              </span>
            </div>

            <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100 space-y-1.5 text-xs text-gray-600 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Compte publicitaire :</span>
                <span className="font-mono font-semibold text-gray-800">{regie.account}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Dernière synchro :</span>
                <span className="font-semibold text-gray-800">{regie.lastSync}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Flux d'actualisation :</span>
                <span className="font-semibold text-emerald-700">{regie.itemsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Sécurité Token :</span>
                <span className="text-[11px] text-gray-600">{regie.tokenExpiry}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {regie.metricsFetched.slice(0, 3).map((m, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-gray-600 border border-gray-200">
                    {m}
                  </span>
                ))}
                {regie.metricsFetched.length > 3 && (
                  <span className="text-[10px] text-gray-400">
                    +{regie.metricsFetched.length - 3}
                  </span>
                )}
              </div>

              <button 
                onClick={onOpenApiModal}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Paramètres</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
