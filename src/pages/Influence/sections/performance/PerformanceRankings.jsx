import { useState } from 'react';
import { formatNumber } from '../../../../utils/helpers';
import { Trophy, Award, Eye, Calculator, Percent, ExternalLink, Globe, User, Flame } from 'lucide-react';

export default function PerformanceRankings({
  deliverables = [],
  talentsMetrics = [],
  onOpenDeliverable,
}) {
  const [rankMetric, setRankMetric] = useState('views'); // 'views' | 'engagement_calculated' | 'engagement_rate'
  const [rankingView, setRankingView] = useState('contents'); // 'contents' | 'talents'

  // Tri Top Contenus
  const sortedContents = [...deliverables].sort((a, b) => {
    if (rankMetric === 'views') {
      return (b.metrics?.views || 0) - (a.metrics?.views || 0);
    }
    if (rankMetric === 'engagement_calculated') {
      return (b.metrics?.engagement_calculated || 0) - (a.metrics?.engagement_calculated || 0);
    }
    if (rankMetric === 'engagement_rate') {
      return (b.metrics?.engagement_rate || 0) - (a.metrics?.engagement_rate || 0);
    }
    return 0;
  });

  // Tri Top Talents
  const sortedTalents = [...talentsMetrics].sort((a, b) => {
    if (rankMetric === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    if (rankMetric === 'engagement_calculated') {
      return (b.calculatedEngagement || 0) - (a.calculatedEngagement || 0);
    }
    if (rankMetric === 'engagement_rate') {
      return (b.rateOnViews || 0) - (a.rateOnViews || 0);
    }
    return 0;
  });

  // Maximum pour la barre relative
  const maxContentVal = sortedContents.length > 0
    ? (rankMetric === 'views'
        ? (sortedContents[0].metrics?.views || 1)
        : rankMetric === 'engagement_calculated'
          ? (sortedContents[0].metrics?.engagement_calculated || 1)
          : (sortedContents[0].metrics?.engagement_rate || 1))
    : 1;

  const maxTalentVal = sortedTalents.length > 0
    ? (rankMetric === 'views'
        ? (sortedTalents[0].views || 1)
        : rankMetric === 'engagement_calculated'
          ? (sortedTalents[0].calculatedEngagement || 1)
          : (sortedTalents[0].rateOnViews || 1))
    : 1;

  const metricLabels = {
    views: { title: 'Vues / Impressions', icon: Eye, unit: '', color: '#2563EB' },
    engagement_calculated: { title: 'Engagement Calculé', icon: Calculator, unit: '', color: '#059669' },
    engagement_rate: { title: 'Taux sur Vues (%)', icon: Percent, unit: '%', color: '#D97706' },
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getPlatformBadge = (platform) => {
    const p = String(platform || '').toLowerCase();
    const colors = {
      tiktok: { bg: '#000000', text: '#FFFFFF' },
      instagram: { bg: '#E1306C', text: '#FFFFFF' },
      facebook: { bg: '#1877F2', text: '#FFFFFF' },
      youtube: { bg: '#FF0000', text: '#FFFFFF' },
      website: { bg: '#4B5563', text: '#FFFFFF' },
    };
    const c = colors[p] || { bg: '#6B7280', text: '#FFFFFF' };
    return (
      <span
        className="px-6 py-2 rounded text-xs font-bold uppercase"
        style={{ background: c.bg, color: c.text, fontSize: 10 }}
      >
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
      {/* Barre d'en-tête avec contrôles interactifs */}
      <div className="flex flex-wrap items-center justify-between gap-16 mb-20 pb-16" style={{ borderBottom: '1px solid #f3f4f6' }}>
        <div>
          <div className="flex items-center gap-8">
            <span
              className="text-xs font-bold px-8 py-2 rounded"
              style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}
            >
              PALMARÈS & LEADERBOARD
            </span>
            <h3 className="text-base font-bold text-dark" style={{ margin: 0 }}>
              Classements de Performance
            </h3>
          </div>
          <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
            Basculez librement entre les volumes de vues, l'engagement calculé et le taux de conversion sur vues
          </p>
        </div>

        {/* Contrôles combinés : Vue + Métrique */}
        <div className="flex flex-wrap items-center gap-12">
          {/* Bascule Top Contenus / Top Talents */}
          <div className="flex p-2 rounded-lg bg-gray-100 border border-gray-200">
            <button
              onClick={() => setRankingView('contents')}
              className={`px-12 py-6 rounded text-xs font-bold transition-all ${
                rankingView === 'contents'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-muted hover:text-dark'
              }`}
            >
              🏆 Top Contenus ({sortedContents.length})
            </button>
            <button
              onClick={() => setRankingView('talents')}
              className={`px-12 py-6 rounded text-xs font-bold transition-all ${
                rankingView === 'talents'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-muted hover:text-dark'
              }`}
            >
              🌟 Top Talents ({sortedTalents.length})
            </button>
          </div>

          {/* Sélecteur de Métrique */}
          <div className="flex p-2 rounded-lg bg-gray-100 border border-gray-200">
            <button
              onClick={() => setRankMetric('views')}
              className={`flex items-center gap-4 px-10 py-6 rounded text-xs font-bold transition-all ${
                rankMetric === 'views'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-muted hover:text-dark'
              }`}
            >
              <Eye size={13} />
              Vues
            </button>
            <button
              onClick={() => setRankMetric('engagement_calculated')}
              className={`flex items-center gap-4 px-10 py-6 rounded text-xs font-bold transition-all ${
                rankMetric === 'engagement_calculated'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted hover:text-dark'
              }`}
            >
              <Calculator size={13} />
              Engagement Calculé
            </button>
            <button
              onClick={() => setRankMetric('engagement_rate')}
              className={`flex items-center gap-4 px-10 py-6 rounded text-xs font-bold transition-all ${
                rankMetric === 'engagement_rate'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-muted hover:text-dark'
              }`}
            >
              <Percent size={13} />
              Taux sur Vues
            </button>
          </div>
        </div>
      </div>

      {/* Vue Top Contenus */}
      {rankingView === 'contents' && (
        <div className="flex flex-col gap-8">
          {sortedContents.length === 0 ? (
            <div className="text-center py-32 text-muted italic text-xs">
              Aucun contenu disponible selon les critères sélectionnés.
            </div>
          ) : (
            sortedContents.slice(0, 15).map((item, index) => {
              const metricVal = rankMetric === 'views'
                ? (item.metrics?.views || 0)
                : rankMetric === 'engagement_calculated'
                  ? (item.metrics?.engagement_calculated || 0)
                  : (item.metrics?.engagement_rate || 0);

              const percentOfMax = maxContentVal > 0 ? Math.min(100, Math.round((metricVal / maxContentVal) * 100)) : 0;
              const isPodium = index < 3;

              return (
                <div
                  key={item.id || index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-12 rounded-lg transition-colors gap-8 hover:bg-gray-50"
                  style={{
                    background: isPodium ? (index === 0 ? '#FEFCE8' : index === 1 ? '#F8FAFC' : '#FFF7ED') : '#FFFFFF',
                    border: isPodium
                      ? (index === 0 ? '1px solid #FEF08A' : index === 1 ? '1px solid #E2E8F0' : '1px solid #FFEDD5')
                      : '1px solid #F1F5F9',
                  }}
                >
                  {/* Rang & Info Contenu */}
                  <div className="flex items-center gap-12 flex-1 min-w-0">
                    <div
                      className="text-base font-black flex items-center justify-center"
                      style={{ width: 36, height: 36, borderRadius: '50%', background: isPodium ? '#FFFFFF' : '#F1F5F9' }}
                    >
                      {getMedal(index)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-8 flex-wrap">
                        {getPlatformBadge(item.platform)}
                        <span className="text-xs font-bold text-dark truncate" title={item.title}>
                          {item.title}
                        </span>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted hover:text-blue-600 transition-colors"
                            title="Ouvrir le lien du post"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-8 text-xs text-muted mt-2 flex-wrap">
                        <span className="font-semibold text-gray-700">👤 {item.talent_name}</span>
                        <span>•</span>
                        <span>🏷️ {item.content_subject || 'Général'}</span>
                        <span>•</span>
                        <span>📅 {item.published_at || item.date_raw || 'Non daté'}</span>
                        <span>•</span>
                        <span className="capitalize">{item.content_type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Métrique & Barre relative */}
                  <div className="flex items-center gap-16 min-w-[220px] justify-end">
                    <div className="flex flex-col items-end w-full max-w-[160px]">
                      <div className="text-sm font-black text-dark font-mono">
                        {rankMetric === 'engagement_rate'
                          ? `${metricVal}%`
                          : formatNumber(metricVal)
                        }
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentOfMax}%`,
                            background: metricLabels[rankMetric].color,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted mt-1">
                        {metricLabels[rankMetric].title}
                      </span>
                    </div>

                    <div className="hidden lg:flex flex-col text-right text-[11px] text-muted min-w-[90px]">
                      <span>{formatNumber(item.metrics?.views || 0)} vues</span>
                      <span>{formatNumber(item.metrics?.engagement_calculated || 0)} eng.</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Vue Top Talents */}
      {rankingView === 'talents' && (
        <div className="flex flex-col gap-8">
          {sortedTalents.length === 0 ? (
            <div className="text-center py-32 text-muted italic text-xs">
              Aucun talent disponible selon les critères sélectionnés.
            </div>
          ) : (
            sortedTalents.slice(0, 15).map((talent, index) => {
              const metricVal = rankMetric === 'views'
                ? (talent.views || 0)
                : rankMetric === 'engagement_calculated'
                  ? (talent.calculatedEngagement || 0)
                  : (talent.rateOnViews || 0);

              const percentOfMax = maxTalentVal > 0 ? Math.min(100, Math.round((metricVal / maxTalentVal) * 100)) : 0;
              const isPodium = index < 3;

              return (
                <div
                  key={talent.name + index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-12 rounded-lg transition-colors gap-8 hover:bg-gray-50"
                  style={{
                    background: isPodium ? (index === 0 ? '#FEFCE8' : index === 1 ? '#F8FAFC' : '#FFF7ED') : '#FFFFFF',
                    border: isPodium
                      ? (index === 0 ? '1px solid #FEF08A' : index === 1 ? '1px solid #E2E8F0' : '1px solid #FFEDD5')
                      : '1px solid #F1F5F9',
                  }}
                >
                  {/* Rang & Info Talent */}
                  <div className="flex items-center gap-12 flex-1 min-w-0">
                    <div
                      className="text-base font-black flex items-center justify-center"
                      style={{ width: 36, height: 36, borderRadius: '50%', background: isPodium ? '#FFFFFF' : '#F1F5F9' }}
                    >
                      {getMedal(index)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-8">
                        <span className="text-sm font-bold text-dark">
                          {talent.name}
                        </span>
                        <span className="text-xs px-8 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold">
                          {talent.publicationsCount} publication{talent.publicationsCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-muted mt-2">
                        {talent.campaigns ? talent.campaigns.join(', ') : 'Campagnes actives'}
                      </div>
                    </div>
                  </div>

                  {/* Métrique & Barre relative */}
                  <div className="flex items-center gap-16 min-w-[220px] justify-end">
                    <div className="flex flex-col items-end w-full max-w-[160px]">
                      <div className="text-sm font-black text-dark font-mono">
                        {rankMetric === 'engagement_rate'
                          ? `${metricVal}%`
                          : formatNumber(metricVal)
                        }
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentOfMax}%`,
                            background: metricLabels[rankMetric].color,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted mt-1">
                        {metricLabels[rankMetric].title}
                      </span>
                    </div>

                    <div className="hidden lg:flex flex-col text-right text-[11px] text-muted min-w-[100px]">
                      <span>{formatNumber(talent.views)} vues</span>
                      <span>{formatNumber(talent.calculatedEngagement)} eng.</span>
                      <span className="text-emerald-700 font-medium">{talent.rateOnViews ? `${talent.rateOnViews}%` : 'N/D'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
