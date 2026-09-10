import { formatNumber } from '../../../../utils/helpers';
import { Eye, Heart, MessageSquare, Share2, Calculator, Percent, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

export default function PerformanceMetricsCards({
  metricsSummary = {
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalReportedEngagement: null,
    totalCalculatedEngagement: 0,
    averageRateOnViews: null,
    completeCount: 0,
    incompleteCount: 0,
    totalCount: 0,
    missingViewsCount: 0,
    missingReportedCount: 0,
  }
}) {
  const {
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    totalReportedEngagement,
    totalCalculatedEngagement,
    averageRateOnViews,
    completeCount,
    incompleteCount,
    totalCount,
    missingViewsCount,
    missingReportedCount,
  } = metricsSummary;

  const completenessPercentage = totalCount > 0
    ? Math.round((completeCount / totalCount) * 100)
    : 0;

  return (
    <div className="mb-24 flex flex-col gap-16">
      {/* ─── 1. MÉTRIQUES MESURÉES (COLLECTE DIRECTE BRUTE) ─── */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '16px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-8 mb-12 pb-8" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="flex items-center gap-8">
            <span
              className="text-xs font-bold px-8 py-2 rounded"
              style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
            >
              1. MÉTRIQUES MESURÉES
            </span>
            <span className="text-xs text-muted">
              Données directes constatées et collectées sur les plateformes
            </span>
          </div>
          <span className="text-xs font-medium text-muted">
            Basé sur {totalCount} publication{totalCount > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12">
          {/* Vues */}
          <div
            className="p-12 rounded-lg"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
          >
            <div className="flex items-center justify-between text-muted text-xs mb-4">
              <span>Vues / Impressions</span>
              <Eye size={14} className="text-blue-500" />
            </div>
            <div className="text-xl font-bold text-dark">
              {formatNumber(totalViews)}
            </div>
            <div className="text-xs text-muted mt-2">
              {missingViewsCount > 0 ? (
                <span className="text-amber-600 font-medium">⚠️ {missingViewsCount} sans vues</span>
              ) : (
                <span className="text-emerald-600 font-medium">✓ 100% collectées</span>
              )}
            </div>
          </div>

          {/* Likes */}
          <div
            className="p-12 rounded-lg"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
          >
            <div className="flex items-center justify-between text-muted text-xs mb-4">
              <span>Likes</span>
              <Heart size={14} className="text-rose-500" />
            </div>
            <div className="text-xl font-bold text-dark">
              {formatNumber(totalLikes)}
            </div>
            <div className="text-xs text-muted mt-2">
              Réactions directes
            </div>
          </div>

          {/* Commentaires */}
          <div
            className="p-12 rounded-lg"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
          >
            <div className="flex items-center justify-between text-muted text-xs mb-4">
              <span>Commentaires</span>
              <MessageSquare size={14} className="text-indigo-500" />
            </div>
            <div className="text-xl font-bold text-dark">
              {formatNumber(totalComments)}
            </div>
            <div className="text-xs text-muted mt-2">
              Retours textuels
            </div>
          </div>

          {/* Partages */}
          <div
            className="p-12 rounded-lg"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
          >
            <div className="flex items-center justify-between text-muted text-xs mb-4">
              <span>Partages</span>
              <Share2 size={14} className="text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-dark">
              {formatNumber(totalShares)}
            </div>
            <div className="text-xs text-muted mt-2">
              Viralité externe
            </div>
          </div>

          {/* Engagement Déclaré */}
          <div
            className="p-12 rounded-lg"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
          >
            <div className="flex items-center justify-between text-muted text-xs mb-4">
              <span>Engagement Déclaré</span>
              <HelpCircle size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold text-dark">
              {totalReportedEngagement !== null && totalReportedEngagement > 0
                ? formatNumber(totalReportedEngagement)
                : <span className="text-muted font-normal text-sm italic">Non renseigné</span>
              }
            </div>
            <div className="text-xs text-muted mt-2">
              {missingReportedCount > 0 ? (
                <span className="text-amber-600 font-medium">N/D sur {missingReportedCount} posts</span>
              ) : (
                <span className="text-emerald-600 font-medium">✓ Spécifié par agence</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. MÉTRIQUES CALCULÉES & 3. NON DISPONIBLES (DÔME ANALYTIQUE) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Métriques Calculées (2 colonnes) */}
        <div
          className="lg:col-span-2"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-8 mb-12 pb-8" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <div className="flex items-center gap-8">
              <span
                className="text-xs font-bold px-8 py-2 rounded"
                style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}
              >
                2. MÉTRIQUES CALCULÉES
              </span>
              <span className="text-xs text-muted">
                Formules mathématiques certifiées sans biais de saisie
              </span>
            </div>
            <Calculator size={16} className="text-emerald-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {/* Engagement Calculé */}
            <div
              className="p-12 rounded-lg"
              style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
            >
              <div className="text-xs text-emerald-800 font-semibold mb-2">
                Engagement Calculé
              </div>
              <div className="text-2xl font-black text-emerald-900">
                {formatNumber(totalCalculatedEngagement)}
              </div>
              <div className="text-xs text-emerald-700 mt-4 font-mono">
                = Likes + Comm. + Partages
              </div>
            </div>

            {/* Taux sur Vues */}
            <div
              className="p-12 rounded-lg"
              style={{ background: '#FFF7ED', border: '1px solid #FFEDD5' }}
            >
              <div className="text-xs text-amber-800 font-semibold mb-2">
                Taux Moyen sur Vues
              </div>
              <div className="text-2xl font-black text-amber-900">
                {averageRateOnViews !== null ? `${averageRateOnViews}%` : 'N/D'}
              </div>
              <div className="text-xs text-amber-700 mt-4 font-mono">
                = (Engagement / Vues) × 100
              </div>
            </div>

            {/* Taux de Complétude */}
            <div
              className="p-12 rounded-lg"
              style={{ background: '#F5F3FF', border: '1px solid #DDD6FE' }}
            >
              <div className="text-xs text-purple-800 font-semibold mb-2">
                Complétude Globale
              </div>
              <div className="text-2xl font-black text-purple-900">
                {completenessPercentage}%
              </div>
              <div className="text-xs text-purple-700 mt-4">
                {completeCount} / {totalCount} livrables complets
              </div>
            </div>
          </div>
        </div>

        {/* Métriques Non Disponibles / Données Manquantes */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-center justify-between gap-8 mb-12 pb-8" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <div className="flex items-center gap-8">
              <span
                className="text-xs font-bold px-8 py-2 rounded"
                style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}
              >
                3. DONNÉES NON DISPONIBLES
              </span>
            </div>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>

          <div className="flex flex-col gap-8 text-xs">
            <div className="flex justify-between items-center p-8 rounded bg-gray-50 border border-gray-100">
              <span className="text-muted">Publications incomplètes</span>
              <span className="font-bold text-dark px-6 py-2 rounded bg-white border border-gray-200">
                {incompleteCount} / {totalCount}
              </span>
            </div>

            <div className="flex justify-between items-center p-8 rounded bg-gray-50 border border-gray-100">
              <span className="text-muted">Vues non renseignées</span>
              <span className={`font-bold px-6 py-2 rounded ${missingViewsCount > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-white text-emerald-700 border border-gray-200'}`}>
                {missingViewsCount}
              </span>
            </div>

            <div className="flex justify-between items-center p-8 rounded bg-gray-50 border border-gray-100">
              <span className="text-muted">Eng. déclaré N/D</span>
              <span className="font-bold text-muted px-6 py-2 rounded bg-white border border-gray-200">
                {missingReportedCount}
              </span>
            </div>

            <p className="text-xs text-muted italic mt-4" style={{ lineHeight: 1.4 }}>
              * Les indicateurs non disponibles sont isolés afin d’éviter toute distorsion dans les ratios de performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
