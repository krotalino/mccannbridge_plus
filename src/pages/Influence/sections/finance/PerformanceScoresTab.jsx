import { useState, useMemo, useEffect } from 'react';
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
  Info,
  Trash2
} from 'lucide-react';
import { formatNumber, formatCurrency } from '../../../../utils/helpers.js';
import { useApp } from '../../../../context/AppContext.jsx';

export default function PerformanceScoresTab({ influencer, influencers, setInfluencers }) {
  const { updateInfluencer, addNotification } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // 'all' | 'T1_2026' | 'T4_2025'
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState({
    campaign: '',
    period: 'T1 2026',
    kpiReach: '',
    kpiTarget: '',
    kpiEngagement: '',
    engagementTarget: '',
    cost: '',
    conversions: '',
    salesVolume: '',
    contentQuality: 4.5,
    onTime: true
  });

  // Nettoyage automatique de toute donnée d'exemple résiduelle
  useEffect(() => {
    if (!influencer?.id) return;
    let needUpdate = false;
    let cleanedHist = Array.isArray(influencer?.performanceHistory) ? influencer.performanceHistory : [];

    const hasExamples = cleanedHist.some(h => 
      !h ||
      !h.isNewlyCreated ||
      h.isDemo ||
      h.isExample ||
      h.campaign === 'Orange Weekend Mars' || 
      h.campaign === 'Pulse Jeunesse Fév' || 
      h.campaign === 'OM Transfert Jan'
    );

    if (hasExamples) {
      cleanedHist = cleanedHist.filter(h =>
        h &&
        h.isNewlyCreated === true &&
        !h.isDemo &&
        !h.isExample &&
        h.campaign !== 'Orange Weekend Mars' &&
        h.campaign !== 'Pulse Jeunesse Fév' &&
        h.campaign !== 'OM Transfert Jan'
      );
      needUpdate = true;
    }

    const hasExampleScore = !influencer.isNewlyCreated && (influencer.scorePerformance !== null || influencer.score !== null) && cleanedHist.length === 0;
    if (hasExampleScore) {
      needUpdate = true;
    }

    if (needUpdate) {
      const updates = {
        performanceHistory: cleanedHist,
        ...(cleanedHist.length === 0 ? { scorePerformance: null, score: null } : {})
      };
      if (typeof updateInfluencer === 'function') {
        updateInfluencer(influencer.id, updates);
      }
      if (typeof setInfluencers === 'function') {
        setInfluencers(prev => (Array.isArray(prev) ? prev : []).map(inf =>
          String(inf.id) === String(influencer.id) ? { ...inf, ...updates } : inf
        ));
      }
    }
  }, [influencer?.id]);

  // Consolidation des données réelles de performance et de rentabilité
  const campaignsHistory = useMemo(() => {
    if (!influencer?.performanceHistory || !Array.isArray(influencer.performanceHistory)) {
      return [];
    }

    // Filtrer pour éliminer strictement toute campagne d'exemple
    const realHistory = influencer.performanceHistory.filter(h =>
      h &&
      h.isNewlyCreated === true &&
      !h.isDemo &&
      !h.isExample &&
      h.campaign !== 'Orange Weekend Mars' &&
      h.campaign !== 'Pulse Jeunesse Fév' &&
      h.campaign !== 'OM Transfert Jan'
    );

    return realHistory.map((h, idx) => {
      const reach = Number(h.kpiReach) || 0;
      const targetReach = Number(h.kpiTarget) || 0;
      const reachRatio = targetReach > 0 ? Math.round((reach / targetReach) * 100) : 100;

      const eng = Number(h.kpiEngagement) || 0;
      const targetEng = Number(h.engagementTarget) || 0;
      const engRatio = targetEng > 0 ? Math.round((eng / targetEng) * 100) : 100;

      const cost = Number(h.cost) || (h.remuneration?.base ? Number(h.remuneration.base) + (Number(h.remuneration.variable) || 0) : 0);
      const impressions = Number(h.impressions) || (reach > 0 ? Math.round(reach * 1.35) : 0);
      const clicks = Number(h.clicks) || (reach > 0 ? Math.round(reach * 0.042) : 0);
      const conversions = Number(h.conversions) || 0;
      const salesVolume = Number(h.salesVolume) || 0;

      const emv = Math.round((reach * 18) + (reach * (eng / 100) * 120));
      const roiRatio = cost > 0 ? Number((emv / cost).toFixed(1)) : 0;
      const totalEngagements = Math.round(reach * (eng / 100));
      const cpe = totalEngagements > 0 ? Math.round(cost / totalEngagements) : 0;
      const cpm = impressions > 0 ? Math.round((cost / impressions) * 1000) : 0;

      // Calcul du score synthétique / 5 :
      // 35% Portée + 25% Engagement + 20% Délais + 20% Qualité
      const reachScore = targetReach > 0 ? Math.min(5, (reach / targetReach) * 4) : 4;
      const engScore = targetEng > 0 ? Math.min(5, (eng / targetEng) * 4) : 4;
      const delayScore = h.onTime !== false ? 5 : 3;
      const qualityScore = Number(h.contentQuality) || 4.0;

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

  // Moyennes globales pour l'influenceur (null-safe quand aucune campagne n'existe)
  const hasHistory = campaignsHistory.length > 0;
  const avgEngagement = hasHistory
    ? (campaignsHistory.reduce((s, c) => s + c.kpiEngagement, 0) / campaignsHistory.length).toFixed(1)
    : '—';
  const avgReach = hasHistory
    ? Math.round(campaignsHistory.reduce((s, c) => s + c.kpiReach, 0) / campaignsHistory.length)
    : 0;
  const avgScore = hasHistory
    ? (campaignsHistory.reduce((s, c) => s + c.scorePerformance, 0) / campaignsHistory.length).toFixed(1)
    : '—';
  const avgQuality = hasHistory
    ? (campaignsHistory.reduce((s, c) => s + c.contentQuality, 0) / campaignsHistory.length).toFixed(1)
    : '—';
  const totalConversions = campaignsHistory.reduce((s, c) => s + c.conversions, 0);
  const totalSales = campaignsHistory.reduce((s, c) => s + c.salesVolume, 0);
  const avgRoi = hasHistory
    ? (campaignsHistory.reduce((s, c) => s + c.roiRatio, 0) / campaignsHistory.length).toFixed(1)
    : '—';
  const avgCpe = hasHistory
    ? Math.round(campaignsHistory.reduce((s, c) => s + c.cpe, 0) / campaignsHistory.length)
    : '—';

  // Ajout d'une évaluation réelle de campagne
  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (!newEvaluation.campaign.trim()) {
      alert('Veuillez renseigner le nom de la campagne.');
      return;
    }
    const reach = Number(newEvaluation.kpiReach) || 0;
    const targetReach = Number(newEvaluation.kpiTarget) || reach || 100000;
    const eng = Number(newEvaluation.kpiEngagement) || 0;
    const targetEng = Number(newEvaluation.engagementTarget) || 5.0;
    const cost = Number(newEvaluation.cost) || 0;
    const reachScore = targetReach > 0 ? Math.min(5, (reach / targetReach) * 4) : 4;
    const engScore = targetEng > 0 ? Math.min(5, (eng / targetEng) * 4) : 4;
    const delayScore = newEvaluation.onTime ? 5 : 3;
    const qualityScore = Number(newEvaluation.contentQuality) || 4.5;
    const calcScore = Number(((reachScore * 0.35) + (engScore * 0.25) + (delayScore * 0.20) + (qualityScore * 0.20)).toFixed(1));

    const item = {
      id: `EVAL-${Date.now().toString().slice(-6)}`,
      campaign: newEvaluation.campaign.trim(),
      period: newEvaluation.period || 'T1 2026',
      kpiReach: reach,
      kpiTarget: targetReach,
      kpiEngagement: eng,
      engagementTarget: targetEng,
      cost,
      conversions: Number(newEvaluation.conversions) || 0,
      salesVolume: Number(newEvaluation.salesVolume) || 0,
      contentQuality: qualityScore,
      onTime: Boolean(newEvaluation.onTime),
      scorePerformance: calcScore,
      isNewlyCreated: true,
      isReal: true,
      isDemo: false,
      isExample: false,
    };

    const currentHistory = Array.isArray(influencer.performanceHistory) ? influencer.performanceHistory : [];
    const updated = [item, ...currentHistory];

    if (typeof updateInfluencer === 'function') {
      await updateInfluencer(influencer.id, {
        performanceHistory: updated,
        scorePerformance: calcScore,
        score: calcScore
      });
    }
    if (typeof setInfluencers === 'function') {
      setInfluencers(prev => (Array.isArray(prev) ? prev : []).map(inf =>
        String(inf.id) === String(influencer.id) ? {
          ...inf,
          performanceHistory: updated,
          scorePerformance: calcScore,
          score: calcScore
        } : inf
      ));
    }

    if (addNotification) {
      addNotification(`Évaluation enregistrée pour ${item.campaign} (Score : ${calcScore}/5)`, 'success');
    }
    setShowEvaluationModal(false);
    setNewEvaluation({
      campaign: '',
      period: 'T1 2026',
      kpiReach: '',
      kpiTarget: '',
      kpiEngagement: '',
      engagementTarget: '',
      cost: '',
      conversions: '',
      salesVolume: '',
      contentQuality: 4.5,
      onTime: true
    });
  };

  const handleDeleteCampaignHistory = async (campId, campName) => {
    if (!window.confirm(`Supprimer cette évaluation de performance pour "${campName}" ?`)) return;
    const currentHistory = Array.isArray(influencer.performanceHistory) ? influencer.performanceHistory : [];
    const updated = currentHistory.filter(c => (c.id ? c.id !== campId : c.campaign !== campName));
    const newScore = updated.length > 0
      ? Number((updated.reduce((s, c) => s + (Number(c.scorePerformance) || 4), 0) / updated.length).toFixed(1))
      : null;

    if (typeof updateInfluencer === 'function') {
      await updateInfluencer(influencer.id, {
        performanceHistory: updated,
        scorePerformance: newScore,
        score: newScore
      });
    }
    if (typeof setInfluencers === 'function') {
      setInfluencers(prev => (Array.isArray(prev) ? prev : []).map(inf =>
        String(inf.id) === String(influencer.id) ? {
          ...inf,
          performanceHistory: updated,
          scorePerformance: newScore,
          score: newScore
        } : inf
      ));
    }
    if (addNotification) {
      addNotification('Évaluation de performance supprimée', 'info');
    }
  };

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
              background: hasHistory ? 'linear-gradient(135deg, var(--orange, #FF7900), #e66b00)' : '#E2E8F0',
              color: hasHistory ? '#fff' : '#64748B',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: hasHistory ? '0 8px 16px rgba(255, 121, 0, 0.25)' : 'none'
            }}>
              <span className="text-2xl font-extrabold leading-none">{avgScore}</span>
              <span className="text-xxs uppercase tracking-wider font-bold mt-2 opacity-90">/ 5.0</span>
            </div>

            <div>
              <div className="flex items-center gap-8">
                <h3 className="text-lg font-bold text-dark m-0">
                  Score de Performance Financière & Impact
                </h3>
                <span className={`tag text-xs font-bold ${hasHistory ? 'tag-green' : 'bg-gray-100 text-muted'}`}>
                  {hasHistory ? `Rentabilité (${avgRoi}x ROI)` : 'Données en attente'}
                </span>
              </div>
              <p className="text-xs text-muted mt-4 max-w-xl">
                {hasHistory ? (
                  <>
                    Calculé d'après la moyenne pondérée de <strong>{campaignsHistory.length} campagne(s)</strong> Orange Cameroun. 
                    Mesure l'efficience des coûts engagés, la portée réelle atteinte et la qualité des livrables.
                  </>
                ) : (
                  <>
                    Aucune donnée de performance enregistrée pour cet influenceur. Les données d'exemple ont été retirées.
                  </>
                )}
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
            <button
              type="button"
              className="btn btn-orange btn-sm text-xs font-bold flex items-center gap-6"
              onClick={() => setShowEvaluationModal(true)}
            >
              <Sparkles size={14} />
              <span>+ Évaluer une Campagne</span>
            </button>
          </div>
        </div>

        {/* Détail de la formule pondérée */}
        <div className="grid grid-4 gap-10 mt-16 pt-16 border-t" style={{ borderColor: '#ffe3c9' }}>
          <div className="p-8 rounded bg-white border text-center">
            <div className="text-xxs text-muted uppercase font-bold">Portée / Reach (35%)</div>
            <div className="text-md font-bold text-dark mt-2">{hasHistory ? formatNumber(avgReach) : '—'}</div>
            <div className="text-xxs text-muted mt-1 font-semibold">{hasHistory ? 'Obj. moyen évalué' : '0 campagne enregistrée'}</div>
          </div>

          <div className="p-8 rounded bg-white border text-center">
            <div className="text-xxs text-muted uppercase font-bold">Engagement (25%)</div>
            <div className="text-md font-bold text-dark mt-2">{hasHistory ? `${avgEngagement}%` : '—'}</div>
            <div className="text-xxs text-muted mt-1 font-semibold">{hasHistory ? 'Taux moyen réel' : 'N/D'}</div>
          </div>

          <div className="p-8 rounded bg-white border text-center">
            <div className="text-xxs text-muted uppercase font-bold">Respect des Délais (20%)</div>
            <div className="text-md font-bold text-dark mt-2">
              {hasHistory ? `${campaignsHistory.filter(c => c.onTime).length} / ${campaignsHistory.length}` : '0 / 0'}
            </div>
            <div className="text-xxs text-muted mt-1 font-semibold">{hasHistory ? 'Livrables à l\'heure' : 'Aucun livrable'}</div>
          </div>

          <div className="p-8 rounded bg-white border text-center">
            <div className="text-xxs text-muted uppercase font-bold">Qualité Créative (20%)</div>
            <div className="text-md font-bold text-dark mt-2">{hasHistory ? `${avgQuality} / 5` : '—'}</div>
            <div className="text-xxs text-muted mt-1 font-semibold">{hasHistory ? 'Charte respectée' : 'N/D'}</div>
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
          <div className="text-xl font-extrabold text-green mt-6">{hasHistory ? `${avgRoi}x` : '—'}</div>
          <div className="text-xxs text-muted mt-4">Valeur média générée par Franc investi</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--blue, #2980B9)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Coût par Engagement (CPE)</span>
            <span className="p-4 rounded bg-blue-50 text-blue"><DollarSign size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-dark mt-6">{hasHistory ? `${avgCpe} FCFA` : '—'}</div>
          <div className="text-xxs text-muted mt-4">{hasHistory ? 'Coût unitaire moyen' : 'Données non renseignées'}</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--orange, #FF7900)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Conversions Directes</span>
            <span className="p-4 rounded bg-orange-50 text-orange"><Target size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-dark mt-6">{hasHistory ? formatNumber(totalConversions) : '0'}</div>
          <div className="text-xxs text-muted mt-4">Téléchargements & activations générés</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: '#8E44AD' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Volume Ventes Estimé</span>
            <span className="p-4 rounded bg-purple-50 text-purple-600"><BarChart3 size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-dark mt-6">{hasHistory ? formatCurrency(totalSales) : '0 FCFA'}</div>
          <div className="text-xxs text-muted mt-4">Souscriptions forfaits & Orange Money</div>
        </div>
      </div>

      {/* 3. TABLEAU COMPARATIF DÉTAILLÉ AVEC LES OBJECTIFS ET CAMPAGNES */}
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
                <th className="py-8 px-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {campaignsHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-32 text-center text-muted text-xs">
                    <div style={{ fontSize: 24, marginBottom: 6 }}>📊</div>
                    <strong style={{ color: 'var(--dark)' }}>Aucune donnée de performance enregistrée pour cet influenceur</strong>
                    <p style={{ margin: '4px 0 0', color: 'var(--muted)' }}>
                      Les données d'exemples ont été retirées. Vous pouvez enregistrer une évaluation réelle ci-dessous ou dès qu'une activation est réalisée.
                    </p>
                    <div className="mt-12">
                      <button
                        type="button"
                        className="btn btn-orange btn-sm text-xs font-semibold"
                        onClick={() => setShowEvaluationModal(true)}
                      >
                        + Enregistrer une Évaluation Réelle
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                campaignsHistory.map((c, idx) => {
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

                      {/* Action */}
                      <td className="py-10 px-10 text-center">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm p-4 hover:bg-red-50 text-red-600 rounded"
                          onClick={() => handleDeleteCampaignHistory(c.id, c.campaign)}
                          title="Supprimer cette évaluation"
                        >
                          <Trash2 size={14} />
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

      {/* MODAL ÉVALUATION D'UNE CAMPAGNE */}
      {showEvaluationModal && (
        <div className="inf-modal-overlay" onClick={() => setShowEvaluationModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1060, padding: 16
        }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 540, background: '#fff', borderRadius: 12, padding: 24, maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div className="flex justify-between items-center pb-12 mb-16 border-b">
              <div className="flex items-center gap-8">
                <Sparkles size={20} className="text-orange" />
                <h3 className="font-bold text-base text-dark m-0">Évaluer une Campagne Réelle</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowEvaluationModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-12 text-xs">
              <div>
                <label className="form-label font-bold">Nom de la Campagne *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Campagne Fibre Orange Douala"
                  className="form-input text-xs"
                  value={newEvaluation.campaign}
                  onChange={e => setNewEvaluation({ ...newEvaluation, campaign: e.target.value })}
                />
              </div>

              <div className="grid grid-2 gap-10">
                <div>
                  <label className="form-label">Période</label>
                  <input
                    type="text"
                    placeholder="ex: T1 2026"
                    className="form-input text-xs"
                    value={newEvaluation.period}
                    onChange={e => setNewEvaluation({ ...newEvaluation, period: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Coût Prestation (FCFA)</label>
                  <input
                    type="number"
                    placeholder="ex: 1500000"
                    className="form-input text-xs"
                    value={newEvaluation.cost}
                    onChange={e => setNewEvaluation({ ...newEvaluation, cost: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-10">
                <div>
                  <label className="form-label">Portée Atteinte (Reach)</label>
                  <input
                    type="number"
                    placeholder="ex: 180000"
                    className="form-input text-xs"
                    value={newEvaluation.kpiReach}
                    onChange={e => setNewEvaluation({ ...newEvaluation, kpiReach: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Objectif Portée (Target)</label>
                  <input
                    type="number"
                    placeholder="ex: 150000"
                    className="form-input text-xs"
                    value={newEvaluation.kpiTarget}
                    onChange={e => setNewEvaluation({ ...newEvaluation, kpiTarget: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-10">
                <div>
                  <label className="form-label">Taux d'Engagement (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="ex: 6.2"
                    className="form-input text-xs"
                    value={newEvaluation.kpiEngagement}
                    onChange={e => setNewEvaluation({ ...newEvaluation, kpiEngagement: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Objectif Engagement (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="ex: 5.0"
                    className="form-input text-xs"
                    value={newEvaluation.engagementTarget}
                    onChange={e => setNewEvaluation({ ...newEvaluation, engagementTarget: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-10">
                <div>
                  <label className="form-label">Conversions directes</label>
                  <input
                    type="number"
                    placeholder="ex: 120"
                    className="form-input text-xs"
                    value={newEvaluation.conversions}
                    onChange={e => setNewEvaluation({ ...newEvaluation, conversions: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Volume de Ventes (FCFA)</label>
                  <input
                    type="number"
                    placeholder="ex: 540000"
                    className="form-input text-xs"
                    value={newEvaluation.salesVolume}
                    onChange={e => setNewEvaluation({ ...newEvaluation, salesVolume: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-10">
                <div>
                  <label className="form-label">Note Qualité Créative (/5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className="form-input text-xs"
                    value={newEvaluation.contentQuality}
                    onChange={e => setNewEvaluation({ ...newEvaluation, contentQuality: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Respect des Délais</label>
                  <select
                    className="form-input text-xs"
                    value={newEvaluation.onTime ? 'true' : 'false'}
                    onChange={e => setNewEvaluation({ ...newEvaluation, onTime: e.target.value === 'true' })}
                  >
                    <option value="true">Livrables à l'heure (✓)</option>
                    <option value="false">Léger retard (⚠️)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-10 pt-12 border-t mt-16">
                <button
                  type="button"
                  className="btn btn-ghost text-xs"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-orange text-xs font-bold"
                >
                  Enregistrer l'évaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
