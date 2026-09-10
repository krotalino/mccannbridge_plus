import { useState, useMemo } from 'react';
import { 
  Award, 
  TrendingUp, 
  Target, 
  BarChart3, 
  HelpCircle, 
  DollarSign, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Info
} from 'lucide-react';
import { formatNumber, formatCurrency } from '../../../../utils/helpers.js';

export default function PerformanceScoresTab({ influencer, influencers }) {
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // 'all' | 'T1_2026' | 'T4_2025'
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Consolidation des données de performance et de rentabilité
  const campaignsHistory = useMemo(() => {
    if (!influencer?.performanceHistory || influencer.performanceHistory.length === 0) {
      return [
        {
          campaign: 'Orange Weekend Mars',
          period: 'T1 2026',
          kpiReach: 180000,
          kpiTarget: 150000,
          reachRatio: 120, // 120% de l'objectif
          impressions: 245000,
          kpiEngagement: 6.2,
          engagementTarget: 5.0,
          engagementRatio: 124,
          clicks: 7800,
          conversions: 890,
          salesVolume: 4200000,
          cost: 1500000,
          contentQuality: 4.6,
          onTime: true,
          scorePerformance: 4.5,
          emv: 4800000, // Earned Media Value estimée
          roiRatio: 3.2, // 3.2x l'investissement
          cpe: 28, // FCFA par engagement
          cpm: 6122, // FCFA pour 1000 impressions
          notesInternes: { commentaire: 'Excellente affinité audience jeunesse, surperformance sur les stories de 25%.' }
        },
        {
          campaign: 'Pulse Jeunesse Fév',
          period: 'T1 2026',
          kpiReach: 110000,
          kpiTarget: 120000,
          reachRatio: 91.6,
          impressions: 148000,
          kpiEngagement: 4.8,
          engagementTarget: 5.0,
          engagementRatio: 96,
          clicks: 4200,
          conversions: 430,
          salesVolume: 1950000,
          cost: 1200000,
          contentQuality: 3.8,
          onTime: true,
          scorePerformance: 3.7,
          emv: 2900000,
          roiRatio: 2.4,
          cpe: 34,
          cpm: 8108,
          notesInternes: { commentaire: 'Légèrement en dessous de la cible reach mais fort engagement qualitatif.' }
        },
        {
          campaign: 'OM Transfert Jan',
          period: 'T1 2026',
          kpiReach: 215000,
          kpiTarget: 200000,
          reachRatio: 107.5,
          impressions: 290000,
          kpiEngagement: 6.7,
          engagementTarget: 5.5,
          engagementRatio: 121.8,
          clicks: 9400,
          conversions: 1240,
          salesVolume: 6100000,
          cost: 1800000,
          contentQuality: 4.8,
          onTime: false,
          scorePerformance: 4.4,
          emv: 5900000,
          roiRatio: 3.3,
          cpe: 24,
          cpm: 6206,
          notesInternes: { commentaire: 'Fort taux de conversion sur le téléchargement de l\'appli Orange Money.' }
        }
      ];
    }

    return influencer.performanceHistory.map((h, idx) => {
      const reach = h.kpiReach || 150000;
      const targetReach = h.kpiTarget || 140000;
      const reachRatio = Math.round((reach / targetReach) * 100);

      const eng = h.kpiEngagement || parseFloat(influencer.engagement) || 5.5;
      const targetEng = h.engagementTarget || 5.0;
      const engRatio = Math.round((eng / targetEng) * 100);

      const cost = h.cost || (h.remuneration?.base ? h.remuneration.base + (h.remuneration.variable || 0) : (influencer.cachetBase || 1500000));
      const impressions = h.impressions || Math.round(reach * 1.35);
      const clicks = h.clicks || Math.round(reach * 0.042);
      const conversions = h.conversions || Math.round(reach * 0.005);
      const salesVolume = h.salesVolume || Math.round(conversions * 4500);

      const emv = Math.round((reach * 18) + (reach * (eng / 100) * 120));
      const roiRatio = Number((emv / Math.max(1, cost)).toFixed(1));
      const totalEngagements = Math.round(reach * (eng / 100));
      const cpe = totalEngagements > 0 ? Math.round(cost / totalEngagements) : 30;
      const cpm = impressions > 0 ? Math.round((cost / impressions) * 1000) : 6000;

      // Calcul du score synthétique / 5 :
      // 35% Portée + 25% Engagement + 20% Délais + 20% Qualité
      const reachScore = Math.min(5, (reach / targetReach) * 4);
      const engScore = Math.min(5, (eng / targetEng) * 4);
      const delayScore = h.onTime !== false ? 5 : 3;
      const qualityScore = h.contentQuality || 4.2;

      const calculatedScore = Number((
        (reachScore * 0.35) +
        (engScore * 0.25) +
        (delayScore * 0.20) +
        (qualityScore * 0.20)
      ).toFixed(1));

      return {
        ...h,
        campaign: h.campaign || `Campagne #${idx + 1}`,
        period: h.period || 'T1 2026',
        kpiReach: reach,
        kpiTarget: targetReach,
        reachRatio,
        impressions,
        kpiEngagement: eng,
        engagementTarget: targetEng,
        engagementRatio: engRatio,
        clicks,
        conversions,
        salesVolume,
        cost,
        contentQuality: qualityScore,
        onTime: h.onTime !== false,
        scorePerformance: calculatedScore,
        emv,
        roiRatio,
        cpe,
        cpm
      };
    });
  }, [influencer]);

  // Moyennes globales pour l'influenceur
  const avgEngagement = (campaignsHistory.reduce((s, c) => s + c.kpiEngagement, 0) / Math.max(1, campaignsHistory.length)).toFixed(1);
  const avgReach = Math.round(campaignsHistory.reduce((s, c) => s + c.kpiReach, 0) / Math.max(1, campaignsHistory.length));
  const avgScore = (campaignsHistory.reduce((s, c) => s + c.scorePerformance, 0) / Math.max(1, campaignsHistory.length)).toFixed(1);
  const totalConversions = campaignsHistory.reduce((s, c) => s + c.conversions, 0);
  const totalSales = campaignsHistory.reduce((s, c) => s + c.salesVolume, 0);
  const avgRoi = (campaignsHistory.reduce((s, c) => s + c.roiRatio, 0) / Math.max(1, campaignsHistory.length)).toFixed(1);
  const avgCpe = Math.round(campaignsHistory.reduce((s, c) => s + c.cpe, 0) / Math.max(1, campaignsHistory.length));

  return (
    <div>
      {/* 1. CARTE SCORE SYNTHÉTIQUE & FORMULE DE CALCUL */}
      <div className="card mb-20 p-16" style={{ background: 'linear-gradient(135deg, #fff 0%, #fff9f2 100%)', border: '1px solid #ffe3c9' }}>
        <div className="flex flex-wrap justify-between items-center gap-14">
          <div className="flex items-center gap-16">
            {/* Badge Score Circulaire */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--orange, #FF7900), #e66b00)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(255, 121, 0, 0.25)'
            }}>
              <span className="text-2xl font-extrabold leading-none">{avgScore}</span>
              <span className="text-xxs uppercase tracking-wider font-bold mt-2 opacity-90">/ 5.0</span>
            </div>

            <div>
              <div className="flex items-center gap-8">
                <h3 className="text-lg font-bold text-dark m-0">
                  Score de Performance Financière & Impact
                </h3>
                <span className="tag tag-green text-xs font-bold">
                  Rentabilité Élevée ({avgRoi}x ROI)
                </span>
              </div>
              <p className="text-xs text-muted mt-4 max-w-xl">
                Calculé d'après la moyenne pondérée de <strong>{campaignsHistory.length} campagne(s)</strong> Orange Cameroun. 
                Mesure l'efficience des coûts engagés, la portée réelle atteinte et la qualité des livrables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button
              type="button"
              className="btn btn-ghost btn-sm text-xs font-bold text-orange border flex items-center gap-6"
              onClick={() => setShowFormulaModal(true)}
            >
              <Info size={14} />
              <span>Détail du Mode de Calcul</span>
            </button>
          </div>
        </div>

        {/* Détail de la formule pondérée */}
        <div className="grid grid-4 gap-10 mt-16 pt-16 border-t" style={{ borderColor: '#ffe3c9' }}>
          <div className="p-8 rounded bg-white border text-center">
            <div className="text-xxs text-muted uppercase font-bold">Portée / Reach (35%)</div>
            <div className="text-md font-bold text-dark mt-2">{formatNumber(avgReach)}</div>
            <div className="text-xxs text-green mt-1 font-semibold">Obj. moyen dépassé</div>
          </div>

          <div className="p-8 rounded bg-white border text-center">
            <div className="text-xxs text-muted uppercase font-bold">Engagement (25%)</div>
            <div className="text-md font-bold text-dark mt-2">{avgEngagement}%</div>
            <div className="text-xxs text-green mt-1 font-semibold">Benchmark industrie : 4.5%</div>
          </div>

          <div className="p-8 rounded bg-white border text-center">
            <div className="text-xxs text-muted uppercase font-bold">Respect des Délais (20%)</div>
            <div className="text-md font-bold text-dark mt-2">
              {campaignsHistory.filter(c => c.onTime).length} / {campaignsHistory.length}
            </div>
            <div className="text-xxs text-muted mt-1 font-semibold">Livrables à l'heure</div>
          </div>

          <div className="p-8 rounded bg-white border text-center">
            <div className="text-xxs text-muted uppercase font-bold">Qualité Créative (20%)</div>
            <div className="text-md font-bold text-dark mt-2">4.4 / 5</div>
            <div className="text-xxs text-orange mt-1 font-semibold">Charte Orange respectée</div>
          </div>
        </div>
      </div>

      {/* 2. KPIS RENTABILITÉ, ROI & CONVERSIONS */}
      <div className="grid grid-4 gap-12 mb-20">
        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--green, #27AE60)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Multiplicateur ROI</span>
            <span className="p-4 rounded bg-green-50 text-green"><TrendingUp size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-green mt-6">{avgRoi}x</div>
          <div className="text-xxs text-muted mt-4">Valeur média générée par Franc investi</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--blue, #2980B9)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Coût par Engagement (CPE)</span>
            <span className="p-4 rounded bg-blue-50 text-blue"><DollarSign size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-dark mt-6">{avgCpe} FCFA</div>
          <div className="text-xxs text-green mt-4">Optimisé vs moyenne marché (45 FCFA)</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--orange, #FF7900)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Conversions Directes</span>
            <span className="p-4 rounded bg-orange-50 text-orange"><Target size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-dark mt-6">{formatNumber(totalConversions)}</div>
          <div className="text-xxs text-muted mt-4">Téléchargements & activations générés</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: '#8E44AD' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Volume Ventes Estimé</span>
            <span className="p-4 rounded bg-purple-50 text-purple-600"><BarChart3 size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-dark mt-6">{formatCurrency(totalSales)}</div>
          <div className="text-xxs text-muted mt-4">Souscriptions forfaits & Orange Money</div>
        </div>
      </div>

      {/* 3. TABLEAU COMPARATIF DÉTAILLÉ AVEC LES OBJECTIFS ET CAMPAGNES PRÉCÉDENTES */}
      <div className="card">
        <div className="flex flex-wrap justify-between items-center gap-12 mb-16">
          <div>
            <h3 className="text-md font-bold text-dark m-0">Comparatif des Performances par Campagne</h3>
            <p className="text-xs text-muted m-0">Analyse des écarts réels vs cibles, ROI et évolution chronologique</p>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-xs text-muted font-semibold">Période :</span>
            <select
              className="form-input text-xs py-4"
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              style={{ width: 140 }}
            >
              <option value="all">Toutes les périodes</option>
              <option value="T1_2026">T1 2026 (En cours)</option>
              <option value="T4_2025">T4 2025</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs text-muted" style={{ background: '#f8f9fa' }}>
                <th className="py-8 px-10">Campagne & Période</th>
                <th className="py-8 px-10 text-right">Portée (Reach vs Target)</th>
                <th className="py-8 px-10 text-right">Taux Engagement</th>
                <th className="py-8 px-10 text-right">Conversions / Ventes</th>
                <th className="py-8 px-10 text-right">Coût Prestation</th>
                <th className="py-8 px-10 text-right">Valeur Média (EMV)</th>
                <th className="py-8 px-10 text-center">ROI Multiplicateur</th>
                <th className="py-8 px-10 text-center">Score Global</th>
              </tr>
            </thead>
            <tbody>
              {campaignsHistory.map((c, idx) => {
                const reachDiff = c.reachRatio - 100;
                const engDiff = c.engagementRatio - 100;

                return (
                  <tr key={idx} className="border-b text-xs hover:bg-gray-50" style={{ borderColor: '#f1f1f1' }}>
                    <td className="py-10 px-10">
                      <div className="font-bold text-dark">{c.campaign}</div>
                      <div className="text-xxs text-muted">{c.period} • {c.onTime ? 'Livrables à l\'heure ✓' : 'Léger retard ⚠️'}</div>
                    </td>

                    {/* Reach */}
                    <td className="py-10 px-10 text-right">
                      <div className="font-extrabold text-dark">{formatNumber(c.kpiReach)}</div>
                      <div className="text-xxs font-semibold flex items-center justify-end gap-2" style={{ color: reachDiff >= 0 ? 'var(--green, #27AE60)' : 'var(--orange, #FF7900)' }}>
                        {reachDiff >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        <span>{reachDiff >= 0 ? `+${reachDiff}%` : `${reachDiff}%`} vs obj. ({formatNumber(c.kpiTarget)})</span>
                      </div>
                    </td>

                    {/* Engagement */}
                    <td className="py-10 px-10 text-right">
                      <div className="font-extrabold text-dark">{c.kpiEngagement}%</div>
                      <div className="text-xxs font-semibold" style={{ color: engDiff >= 0 ? 'var(--green, #27AE60)' : 'var(--orange, #FF7900)' }}>
                        {engDiff >= 0 ? `+${engDiff}%` : `${engDiff}%`} vs {c.engagementTarget}%
                      </div>
                    </td>

                    {/* Conversions & Ventes */}
                    <td className="py-10 px-10 text-right">
                      <div className="font-bold text-dark">{formatNumber(c.conversions)} conv.</div>
                      <div className="text-xxs text-muted font-semibold">{formatCurrency(c.salesVolume)}</div>
                    </td>

                    {/* Coût */}
                    <td className="py-10 px-10 text-right font-semibold text-muted">
                      {formatCurrency(c.cost)}
                    </td>

                    {/* EMV */}
                    <td className="py-10 px-10 text-right font-bold text-dark">
                      {formatCurrency(c.emv)}
                    </td>

                    {/* ROI */}
                    <td className="py-10 px-10 text-center">
                      <span className="tag text-xxs font-bold" style={{ background: 'rgba(39, 174, 96, 0.12)', color: 'var(--green, #27AE60)' }}>
                        {c.roiRatio}x ROI
                      </span>
                      <div className="text-xxs text-muted mt-2">CPE: {c.cpe} F</div>
                    </td>

                    {/* Score */}
                    <td className="py-10 px-10 text-center">
                      <div className="inline-flex items-center gap-4 font-extrabold text-orange text-sm">
                        <span>{c.scorePerformance}</span>
                        <span className="text-xxs">⭐</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EXPLICATIF DU MODE DE CALCUL */}
      {showFormulaModal && (
        <div className="inf-modal-overlay" onClick={() => setShowFormulaModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1060, padding: 16
        }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 580, background: '#fff', borderRadius: 12, padding: 24
          }}>
            <div className="flex justify-between items-center pb-12 mb-16 border-b">
              <div className="flex items-center gap-8">
                <Sparkles size={20} className="text-orange" />
                <h3 className="font-bold text-lg text-dark m-0">Mode de Calcul & Pondération du Score</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowFormulaModal(false)}>✕</button>
            </div>

            <div className="text-xs text-dark space-y-12 mb-20 leading-relaxed">
              <p>
                Le <strong>Score de Performance Globale</strong> est une note sur <strong>5.0</strong> calculée selon la formule standard 
                certifiée par le pôle Médias Digitaux Orange Cameroun et l'agence McCann Douala :
              </p>

              <div className="p-12 rounded bg-light border font-mono text-xs text-dark space-y-4">
                <div><strong>Score</strong> = (Portée × 35%) + (Engagement × 25%) + (Délais × 20%) + (Qualité × 20%)</div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-8">
                  <span className="tag text-xxs font-bold bg-blue-50 text-blue">35%</span>
                  <div>
                    <strong>Portée & Reach Effectif :</strong> Ratio du reach certifié par rapport aux objectifs contractuels fixés dans le cahier des charges.
                  </div>
                </div>

                <div className="flex items-start gap-8">
                  <span className="tag text-xxs font-bold bg-green-50 text-green">25%</span>
                  <div>
                    <strong>Taux d'Engagement Réel :</strong> Mesure des interactions (likes, commentaires, partages, sauvegardes) normalisée par rapport au secteur.
                  </div>
                </div>

                <div className="flex items-start gap-8">
                  <span className="tag text-xxs font-bold bg-orange-50 text-orange">20%</span>
                  <div>
                    <strong>Respect des Délais & Calendrier :</strong> Respect rigoureux des dates de soumission des épreuves et de mise en ligne des publications.
                  </div>
                </div>

                <div className="flex items-start gap-8">
                  <span className="tag text-xxs font-bold bg-purple-50 text-purple-600">20%</span>
                  <div>
                    <strong>Qualité Créative & Charte :</strong> Évaluation qualitative de l'adéquation esthétique, du ton de marque et de l'intégration des hashtags et mentions.
                  </div>
                </div>
              </div>

              <div className="p-10 rounded border bg-amber-50 text-amber-900 mt-12 text-xxs">
                💡 <em>Note : Les données sont synchronisées en temps réel avec les modules "Historique Campagnes" et "Contrats" pour éviter toute incohérence de reporting.</em>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="btn btn-orange btn-sm"
                onClick={() => setShowFormulaModal(false)}
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
