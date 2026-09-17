import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, Users, Target, TrendingUp, 
  BarChart3, MousePointer, CheckCircle2, Clock, 
  Sparkles, Percent, ShieldCheck, Eye, Zap, 
  Edit3, Trash2, Plus, ChevronDown, ChevronUp, AlertCircle, X
} from 'lucide-react';

const FMT = (n) => (typeof n === 'number' && !isNaN(n) ? n.toLocaleString('fr-FR') : n || '0');

/**
 * Normalizes sponsoring data from a post.
 * Handles backward compatibility:
 * - post.sponsoring as a number (e.g. 150000)
 * - post.sponsoring as an object
 * - post.isSponsored boolean
 */
export function getNormalizedSponsoring(post) {
  if (!post) return { isSponsored: false };

  const sp = post.sponsoring;
  if (typeof sp === 'number') {
    return {
      isSponsored: sp > 0,
      budget: sp,
      budgetSpent: Math.round(sp * 0.95),
      currency: 'FCFA',
      dailyBudget: Math.round(sp / 7),
      startDate: post.date || '',
      endDate: '',
      durationDays: 7,
      status: 'active',
      objective: 'Engagement & Conversions',
      campaignName: post.campaign || `Boost · ${post.title || 'Publication'}`,
      platformAdAccount: `Meta Ads · ${post.client || 'Orange'}`,
      reach: Math.round(sp * 2.3),
      impressions: Math.round(sp * 3.4),
      frequency: 1.48,
      cpm: 295,
      targetAudience: '18-35 ans · Cameroun (Douala, Yaoundé) · Intérêts: Digital & Télécoms',
      clicks: Math.round(sp * 0.12),
      ctr: 3.5,
      cpc: 8.3,
      conversions: Math.round(sp * 0.008),
      conversionRate: 6.7,
      cpa: 125,
      roas: '4.2x',
      notes: ''
    };
  }

  if (sp && typeof sp === 'object') {
    const isSponsored = Boolean(sp.isSponsored ?? (sp.budget > 0 || post.isSponsored));
    return {
      isSponsored,
      budget: Number(sp.budget) || 0,
      budgetSpent: Number(sp.budgetSpent) || 0,
      currency: sp.currency || 'FCFA',
      dailyBudget: sp.dailyBudget || '',
      startDate: sp.startDate || post.date || '',
      endDate: sp.endDate || '',
      durationDays: sp.durationDays || '',
      status: sp.status || 'active',
      objective: sp.objective || 'Engagement & Conversions',
      campaignName: sp.campaignName || post.campaign || '',
      platformAdAccount: sp.platformAdAccount || `Meta Ads · ${post.client || 'Orange'}`,
      reach: Number(sp.reach) || 0,
      impressions: Number(sp.impressions) || 0,
      frequency: sp.frequency || '',
      cpm: sp.cpm || '',
      targetAudience: sp.targetAudience || '',
      clicks: Number(sp.clicks) || 0,
      ctr: sp.ctr || '',
      cpc: sp.cpc || '',
      conversions: Number(sp.conversions) || 0,
      conversionRate: sp.conversionRate || '',
      cpa: sp.cpa || '',
      roas: sp.roas || '',
      notes: sp.notes || ''
    };
  }

  if (post.isSponsored) {
    return {
      isSponsored: true,
      budget: 150000,
      budgetSpent: 140000,
      currency: 'FCFA',
      dailyBudget: 21400,
      startDate: post.date || '',
      endDate: '',
      durationDays: 7,
      status: 'active',
      objective: 'Engagement & Conversions',
      campaignName: post.campaign || `Boost · ${post.title || 'Publication'}`,
      platformAdAccount: `Meta Ads · ${post.client || 'Orange'}`,
      reach: 345000,
      impressions: 512000,
      frequency: 1.48,
      cpm: 273,
      targetAudience: '18-35 ans · Cameroun (Douala, Yaoundé) · Intérêts: Mobile Money & Fintech',
      clicks: 18400,
      ctr: 3.59,
      cpc: 7.6,
      conversions: 1240,
      conversionRate: 6.74,
      cpa: 112.9,
      roas: '4.8x',
      notes: ''
    };
  }

  return { isSponsored: false };
}

export default function PostSponsoringSection({ post, onUpdateSponsoring, canEdit = true }) {
  const currentSponsoring = getNormalizedSponsoring(post);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('budget'); // 'budget' | 'audience' | 'conversions'
  
  // Local form state
  const [formData, setFormData] = useState({ ...currentSponsoring });

  // Synchronize when post changes
  useEffect(() => {
    setFormData(getNormalizedSponsoring(post));
    setIsEditing(false);
  }, [post?.id, post?.sponsoring, post?.isSponsored]);

  // Handle toggle sponsored status
  const handleToggleSponsoring = async (newVal) => {
    const updated = {
      ...formData,
      isSponsored: newVal,
      budget: newVal ? (formData.budget || 150000) : 0,
      currency: formData.currency || 'FCFA',
      status: newVal ? (formData.status || 'active') : 'completed',
    };
    setFormData(updated);
    if (!newVal) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
    if (onUpdateSponsoring) {
      await onUpdateSponsoring(updated);
    }
  };

  // Helper auto-calculate indicators
  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };

      // Auto-calculate duration if start & end date exist
      if ((field === 'startDate' || field === 'endDate') && next.startDate && next.endDate) {
        try {
          const d1 = new Date(next.startDate);
          const d2 = new Date(next.endDate);
          const diffTime = Math.abs(d2 - d1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          if (!isNaN(diffDays) && diffDays > 0) {
            next.durationDays = diffDays;
            if (next.budget && diffDays > 0) {
              next.dailyBudget = Math.round(Number(next.budget) / diffDays);
            }
          }
        } catch (e) {
          // ignore date parse errors
        }
      }

      // Auto-calculate CPM if impressions and budgetSpent
      if (field === 'impressions' || field === 'budgetSpent' || field === 'budget') {
        const spent = Number(next.budgetSpent || next.budget || 0);
        const imp = Number(next.impressions || 0);
        if (spent > 0 && imp > 0) {
          next.cpm = Math.round((spent / imp) * 1000);
        }
      }

      // Auto-calculate Frequency if Reach and Impressions
      if (field === 'reach' || field === 'impressions') {
        const reach = Number(next.reach || 0);
        const imp = Number(next.impressions || 0);
        if (reach > 0 && imp > 0) {
          next.frequency = (imp / reach).toFixed(2);
        }
      }

      // Auto-calculate CTR if Clicks and Impressions
      if (field === 'clicks' || field === 'impressions') {
        const clicks = Number(next.clicks || 0);
        const imp = Number(next.impressions || 0);
        if (clicks > 0 && imp > 0) {
          next.ctr = ((clicks / imp) * 100).toFixed(2);
        }
      }

      // Auto-calculate CPC if Clicks and budgetSpent
      if (field === 'clicks' || field === 'budgetSpent' || field === 'budget') {
        const spent = Number(next.budgetSpent || next.budget || 0);
        const clicks = Number(next.clicks || 0);
        if (spent > 0 && clicks > 0) {
          next.cpc = (spent / clicks).toFixed(2);
        }
      }

      // Auto-calculate Conversion Rate if Conversions and Clicks
      if (field === 'conversions' || field === 'clicks') {
        const conv = Number(next.conversions || 0);
        const clicks = Number(next.clicks || 0);
        if (conv > 0 && clicks > 0) {
          next.conversionRate = ((conv / clicks) * 100).toFixed(2);
        }
      }

      // Auto-calculate CPA if Conversions and budgetSpent
      if (field === 'conversions' || field === 'budgetSpent' || field === 'budget') {
        const spent = Number(next.budgetSpent || next.budget || 0);
        const conv = Number(next.conversions || 0);
        if (spent > 0 && conv > 0) {
          next.cpa = (spent / conv).toFixed(1);
        }
      }

      return next;
    });
  };

  // Apply Benchmark Preset
  const handleApplyPreset = (type) => {
    if (type === 'engagement') {
      const p = {
        ...formData,
        isSponsored: true,
        budget: 120000,
        budgetSpent: 114000,
        currency: 'FCFA',
        status: 'active',
        objective: 'Engagement & Portée',
        durationDays: 7,
        reach: 285000,
        impressions: 430000,
        frequency: 1.51,
        cpm: 265,
        targetAudience: '18-35 ans · Cameroun Urbain · Intérêts: Lifestyle, Musique, Social Media',
        clicks: 16200,
        ctr: 3.77,
        cpc: 7.04,
        conversions: 980,
        conversionRate: 6.05,
        cpa: 116.3,
        roas: '3.9x'
      };
      setFormData(p);
    } else if (type === 'conversions') {
      const p = {
        ...formData,
        isSponsored: true,
        budget: 250000,
        budgetSpent: 238000,
        currency: 'FCFA',
        status: 'active',
        objective: 'Conversions & Ventes (Souscriptions)',
        durationDays: 10,
        reach: 450000,
        impressions: 720000,
        frequency: 1.6,
        cpm: 330,
        targetAudience: '22-45 ans · National Cameroun · Intérêts: Fintech, Mobile Banking, E-commerce',
        clicks: 29400,
        ctr: 4.08,
        cpc: 8.1,
        conversions: 2280,
        conversionRate: 7.75,
        cpa: 104.4,
        roas: '5.2x'
      };
      setFormData(p);
    } else if (type === 'notoriete') {
      const p = {
        ...formData,
        isSponsored: true,
        budget: 180000,
        budgetSpent: 180000,
        currency: 'FCFA',
        status: 'completed',
        objective: 'Notoriété de Marque & Vues Vidéo',
        durationDays: 14,
        reach: 620000,
        impressions: 980000,
        frequency: 1.58,
        cpm: 184,
        targetAudience: 'Grand public 16-55 ans · Cameroun National (10 régions)',
        clicks: 21500,
        ctr: 2.19,
        cpc: 8.37,
        conversions: 1850,
        conversionRate: 8.6,
        cpa: 97.3,
        roas: '3.4x'
      };
      setFormData(p);
    }
  };

  // Submit saving
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (onUpdateSponsoring) {
      await onUpdateSponsoring({
        ...formData,
        isSponsored: true
      });
    }
    setIsEditing(false);
  };

  const getSponsorStatusBadge = (st) => {
    switch (st) {
      case 'active':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">● Diffusion Active</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40">📅 Diffusion Programmée</span>;
      case 'paused':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">⏸ En Pause</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40">✓ Campagne Terminée</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">● Sponsorisé</span>;
    }
  };

  const pctSpent = formData.budget > 0 
    ? Math.min(100, Math.round(((formData.budgetSpent || formData.budget) / formData.budget) * 100))
    : 0;

  return (
    <div className="rounded-xl border border-white/10 bg-[#121620] overflow-hidden transition-all shadow-lg">
      
      {/* ─── Header: Sponsoring Status & Quick Toggle ─── */}
      <div className="px-4 py-3 bg-[#181d2a] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Zap size={16} className={currentSponsoring.isSponsored ? "fill-orange-400 text-orange-400 animate-pulse" : ""} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Sponsoring & Performance Ads
              </span>
              {currentSponsoring.isSponsored ? (
                getSponsorStatusBadge(currentSponsoring.status)
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-white/10">
                  Organique (Non sponsorisé)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Budget, calendrier de diffusion, métriques d'audience et retour sur conversion (AARRR)
            </p>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            {!currentSponsoring.isSponsored ? (
              <button
                type="button"
                onClick={() => handleToggleSponsoring(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={13} />
                <span>Déclarer comme sponsorisée</span>
              </button>
            ) : !isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={13} className="text-orange-400" />
                  <span>Paramétrer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleSponsoring(false)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all flex items-center gap-1 cursor-pointer"
                  title="Désactiver le statut sponsorisé de cette publication"
                >
                  <X size={13} />
                  <span>Retirer</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                Fermer l'éditeur
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── Case 1: NOT SPONSORED (Empty Call to Action) ─── */}
      {!currentSponsoring.isSponsored && !isEditing && (
        <div className="p-5 text-center flex flex-col items-center justify-center gap-2.5 bg-slate-900/30">
          <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-400 text-lg">
            📢
          </div>
          <div className="max-w-md">
            <h4 className="text-xs font-bold text-slate-200">
              Publication diffusée à 100% en portée organique
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Pour suivre l'allocation budgétaire, la période d'activation, la portée payante et les conversions générées sur ce post, activez le module de sponsoring.
            </p>
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={() => handleToggleSponsoring(true)}
              className="mt-1 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap size={14} />
              <span>Activer le Sponsoring Ads sur cette publication</span>
            </button>
          )}
        </div>
      )}

      {/* ─── Case 2: SPONSORED (Dashboard & Metrics View) ─── */}
      {currentSponsoring.isSponsored && !isEditing && (
        <div className="p-4 space-y-4 text-xs">
          
          {/* Top Bar: Budget & Duration Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Card 1: Budget */}
            <div className="bg-[#181e2b] p-3 rounded-xl border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign size={12} className="text-emerald-400" />
                  Budget Alloué
                </span>
                <span className="text-[10px] font-semibold text-emerald-400">
                  {currentSponsoring.currency || 'FCFA'}
                </span>
              </div>
              <div className="text-base font-black text-white">
                {FMT(currentSponsoring.budget)} <span className="text-xs font-bold text-slate-400">{currentSponsoring.currency || 'FCFA'}</span>
              </div>
              
              {/* Progress bar */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Consommé: {FMT(currentSponsoring.budgetSpent || currentSponsoring.budget)} {currentSponsoring.currency || 'FCFA'}</span>
                  <span className="font-bold text-emerald-400">{pctSpent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                    style={{ width: `${pctSpent}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Period */}
            <div className="bg-[#181e2b] p-3 rounded-xl border border-white/10">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={12} className="text-sky-400" />
                  Période de Diffusion
                </span>
                {currentSponsoring.durationDays ? (
                  <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                    {currentSponsoring.durationDays} Jours
                  </span>
                ) : null}
              </div>
              <div className="text-xs font-bold text-white mt-1">
                {currentSponsoring.startDate ? (
                  <span>Du <strong className="text-sky-300">{currentSponsoring.startDate}</strong></span>
                ) : (
                  <span>Date début non spécifiée</span>
                )}
                {currentSponsoring.endDate ? (
                  <span> au <strong className="text-sky-300">{currentSponsoring.endDate}</strong></span>
                ) : (
                  <span className="text-slate-400"> (En continu)</span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <Clock size={11} className="text-slate-500" />
                <span>Rythme: ~{FMT(currentSponsoring.dailyBudget || (currentSponsoring.durationDays ? Math.round(currentSponsoring.budget / currentSponsoring.durationDays) : Math.round(currentSponsoring.budget / 7)))} {currentSponsoring.currency || 'FCFA'}/jour</span>
              </div>
            </div>

            {/* Card 3: Objective & Ad Account */}
            <div className="bg-[#181e2b] p-3 rounded-xl border border-white/10">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Target size={12} className="text-orange-400" />
                Objectif de Campagne
              </div>
              <div className="text-xs font-bold text-orange-400">
                {currentSponsoring.objective || 'Engagement & Conversions'}
              </div>
              <div className="mt-2 text-[10px] text-slate-300 bg-black/30 px-2 py-1 rounded border border-white/5 truncate" title={currentSponsoring.platformAdAccount}>
                💼 {currentSponsoring.platformAdAccount || `Compte Ads · ${post.client || 'Orange'}`}
              </div>
            </div>

          </div>

          {/* ─── SECTION 1: INDICATEURS D'AUDIENCE ─── */}
          <div className="bg-[#151a26] p-3.5 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-sky-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Indicateurs d'Audience & Portée Payante
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Couverture & Visibilité Cible
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* Reach */}
              <div className="bg-[#1c2233] p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 font-medium">Portée (Reach Unique)</div>
                <div className="text-sm font-black text-sky-400 mt-0.5">
                  {FMT(currentSponsoring.reach)} <span className="text-[10px] font-normal text-slate-400">pers.</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Personnes uniques touchées</div>
              </div>

              {/* Impressions */}
              <div className="bg-[#1c2233] p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 font-medium">Impressions Totales</div>
                <div className="text-sm font-black text-white mt-0.5">
                  {FMT(currentSponsoring.impressions)}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Affichages totaux générés</div>
              </div>

              {/* Fréquence */}
              <div className="bg-[#1c2233] p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 font-medium">Fréquence Moyenne</div>
                <div className="text-sm font-black text-amber-400 mt-0.5">
                  {currentSponsoring.frequency || (currentSponsoring.reach > 0 ? (currentSponsoring.impressions / currentSponsoring.reach).toFixed(2) : '1.45')}x
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Expositions par personne</div>
              </div>

              {/* CPM */}
              <div className="bg-[#1c2233] p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 font-medium">CPM (Coût / 1000 imp.)</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">
                  {FMT(currentSponsoring.cpm || (currentSponsoring.impressions > 0 ? Math.round((currentSponsoring.budget / currentSponsoring.impressions) * 1000) : 280))} <span className="text-[9px] font-normal text-slate-400">{currentSponsoring.currency || 'FCFA'}</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Efficacité d'achat média</div>
              </div>

            </div>

            {/* Target Audience Spec */}
            {currentSponsoring.targetAudience && (
              <div className="mt-2.5 px-3 py-2 rounded-lg bg-[#11151f] border border-white/5 flex items-start gap-2">
                <span className="text-xs">🎯</span>
                <div className="flex-1 text-[11px]">
                  <strong className="text-slate-300">Ciblage appliqué :</strong>{' '}
                  <span className="text-slate-400">{currentSponsoring.targetAudience}</span>
                </div>
              </div>
            )}
          </div>

          {/* ─── SECTION 2: INDICATEURS DE CONVERSION ─── */}
          <div className="bg-[#151a26] p-3.5 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Indicateurs de Conversion, Clics & ROI
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Génération de leads & Rentabilité
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* Clics */}
              <div className="bg-[#1c2233] p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
                  <span>Clics Liens / CTA</span>
                  <MousePointer size={10} className="text-teal-400" />
                </div>
                <div className="text-sm font-black text-teal-400 mt-0.5">
                  {FMT(currentSponsoring.clicks)} <span className="text-[10px] font-normal text-slate-400">clics</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Interactions avec le CTA</div>
              </div>

              {/* CTR % */}
              <div className="bg-[#1c2233] p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
                  <span>Taux de Clic (CTR)</span>
                  <Percent size={10} className="text-sky-400" />
                </div>
                <div className="text-sm font-black text-sky-400 mt-0.5">
                  {currentSponsoring.ctr || (currentSponsoring.impressions > 0 ? ((currentSponsoring.clicks / currentSponsoring.impressions) * 100).toFixed(2) : '3.60')}%
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Clics / Impressions</div>
              </div>

              {/* CPC */}
              <div className="bg-[#1c2233] p-2.5 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
                  <span>Coût par Clic (CPC)</span>
                  <DollarSign size={10} className="text-emerald-400" />
                </div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">
                  {currentSponsoring.cpc || (currentSponsoring.clicks > 0 ? (currentSponsoring.budget / currentSponsoring.clicks).toFixed(1) : '7.8')} <span className="text-[9px] font-normal text-slate-400">{currentSponsoring.currency || 'FCFA'}</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Dépense moyenne par clic</div>
              </div>

              {/* Conversions / Leads */}
              <div className="bg-[#1c2233] p-2.5 rounded-lg border border-emerald-500/20 bg-gradient-to-b from-[#1c2233] to-emerald-950/20">
                <div className="text-[10px] text-emerald-300 font-bold flex items-center justify-between">
                  <span>Conversions / Leads</span>
                  <CheckCircle2 size={10} className="text-emerald-400" />
                </div>
                <div className="text-sm font-black text-emerald-300 mt-0.5">
                  {FMT(currentSponsoring.conversions)} <span className="text-[10px] font-normal text-slate-400">actions</span>
                </div>
                <div className="text-[9px] text-emerald-500/80 mt-0.5">Souscriptions / Inscriptions</div>
              </div>

            </div>

            {/* Additional Conversion KPIs: Conv Rate, CPA & ROAS */}
            <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#11151f] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-slate-400 block">Taux de Conversion</span>
                <strong className="text-xs text-white">
                  {currentSponsoring.conversionRate || (currentSponsoring.clicks > 0 ? ((currentSponsoring.conversions / currentSponsoring.clicks) * 100).toFixed(2) : '6.7')}%
                </strong>
              </div>
              <div className="bg-[#11151f] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-slate-400 block">Coût par Action (CPA)</span>
                <strong className="text-xs text-emerald-400">
                  {currentSponsoring.cpa || (currentSponsoring.conversions > 0 ? Math.round(currentSponsoring.budget / currentSponsoring.conversions) : '115')} {currentSponsoring.currency || 'FCFA'}
                </strong>
              </div>
              <div className="bg-[#11151f] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-slate-400 block">ROAS Estimé</span>
                <strong className="text-xs text-amber-400">
                  {currentSponsoring.roas || '4.5x'}
                </strong>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─── Case 3: EDITING / CONFIGURATION INLINE FORM ─── */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-4 space-y-4 bg-[#141824] text-xs">
          
          {/* Quick Presets for CM */}
          <div className="bg-[#1b2131] p-3 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-orange-400" />
                Modèles de Référence Prédéfinis (Gain de temps) :
              </span>
              <span className="text-[10px] text-slate-400">1-clic pour charger des benchmarks réalistes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('engagement')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all cursor-pointer"
              >
                ⚡ Boost Engagement (120 000 FCFA)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('conversions')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all cursor-pointer"
              >
                🎯 Campagne Performance Leads (250 000 FCFA)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('notoriete')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all cursor-pointer"
              >
                📢 Notoriété Vidéo / Reels (180 000 FCFA)
              </button>
            </div>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-white/10 gap-2">
            {[
              { id: 'budget', label: '1. Budget & Calendrier', icon: DollarSign },
              { id: 'audience', label: '2. Indicateurs d\'Audience', icon: Users },
              { id: 'conversions', label: '3. Indicateurs de Conversion', icon: TrendingUp },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeFormTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id)}
                  className={`px-3 py-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    isActive 
                      ? 'border-orange-500 text-orange-400 bg-orange-500/10' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: BUDGET & DATES */}
          {activeFormTab === 'budget' && (
            <div className="space-y-3 animate-fade">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Budget Total Alloué *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formData.budget}
                    onChange={e => handleFieldChange('budget', Number(e.target.value))}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-orange-500 outline-none"
                    placeholder="150000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Budget Consommé / Dépensé
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formData.budgetSpent}
                    onChange={e => handleFieldChange('budgetSpent', Number(e.target.value))}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-orange-500 outline-none"
                    placeholder="142500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Devise
                  </label>
                  <select
                    value={formData.currency}
                    onChange={e => handleFieldChange('currency', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none"
                  >
                    <option value="FCFA">FCFA (XAF)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              {/* Dates & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => handleFieldChange('startDate', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => handleFieldChange('endDate', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Durée (Jours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationDays}
                    onChange={e => handleFieldChange('durationDays', Number(e.target.value))}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-orange-500 outline-none"
                    placeholder="7"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Statut de diffusion
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => handleFieldChange('status', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none"
                  >
                    <option value="active">● En cours (Actif)</option>
                    <option value="scheduled">📅 Programmé</option>
                    <option value="paused">⏸ En pause</option>
                    <option value="completed">✓ Terminé</option>
                  </select>
                </div>
              </div>

              {/* Campaign name & objective */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Objectif Publicitaire
                  </label>
                  <select
                    value={formData.objective}
                    onChange={e => handleFieldChange('objective', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none"
                  >
                    <option value="Engagement & Conversions">Engagement & Conversions</option>
                    <option value="Conversions & Ventes">Conversions / Ventes (Souscriptions)</option>
                    <option value="Trafic vers site / App">Trafic vers site web / Max It</option>
                    <option value="Génération de Leads">Génération de Leads & Formulaires</option>
                    <option value="Notoriété & Couverture">Notoriété & Portée Max</option>
                    <option value="Vues Vidéo & Reels">Vues Vidéo & Réels (ThruPlay)</option>
                    <option value="Messages WhatsApp">Messages & Conversations WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Compte Publicitaire / Ad Manager
                  </label>
                  <input
                    type="text"
                    value={formData.platformAdAccount}
                    onChange={e => handleFieldChange('platformAdAccount', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none"
                    placeholder="Meta Ads · Orange Money"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIENCE INDICATORS */}
          {activeFormTab === 'audience' && (
            <div className="space-y-3 animate-fade">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Portée Unique (Reach)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reach}
                    onChange={e => handleFieldChange('reach', Number(e.target.value))}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-sky-400 font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="345000"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Impressions Totales
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.impressions}
                    onChange={e => handleFieldChange('impressions', Number(e.target.value))}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="512000"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Fréquence Moyenne
                  </label>
                  <input
                    type="text"
                    value={formData.frequency}
                    onChange={e => handleFieldChange('frequency', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-amber-400 font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="1.48"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    CPM (Coût / 1 000 imp.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cpm}
                    onChange={e => handleFieldChange('cpm', Number(e.target.value))}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-emerald-400 font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="293"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Critères de Ciblage d'Audience (Âge, Villes, Centres d'intérêts)
                </label>
                <textarea
                  rows={2}
                  value={formData.targetAudience}
                  onChange={e => handleFieldChange('targetAudience', e.target.value)}
                  className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-orange-500 outline-none resize-none"
                  placeholder="Ex: 18-35 ans · Cameroun (Douala, Yaoundé, Bafoussam) · Intérêts: Mobile Money, Fintech, Smartphones"
                />
              </div>
            </div>
          )}

          {/* TAB 3: CONVERSION INDICATORS */}
          {activeFormTab === 'conversions' && (
            <div className="space-y-3 animate-fade">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Clics Liens / Interactions
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.clicks}
                    onChange={e => handleFieldChange('clicks', Number(e.target.value))}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-teal-400 font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="18400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Taux de Clic (CTR %)
                  </label>
                  <input
                    type="text"
                    value={formData.ctr}
                    onChange={e => handleFieldChange('ctr', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-sky-400 font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="3.59"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Coût par Clic (CPC)
                  </label>
                  <input
                    type="text"
                    value={formData.cpc}
                    onChange={e => handleFieldChange('cpc', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-emerald-400 font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="7.74"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Conversions / Actions Clés
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.conversions}
                    onChange={e => handleFieldChange('conversions', Number(e.target.value))}
                    className="w-full bg-[#0d1017] border border-emerald-500/40 rounded-lg px-3 py-2 text-emerald-300 font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="1240"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Taux de Conversion (%)
                  </label>
                  <input
                    type="text"
                    value={formData.conversionRate}
                    onChange={e => handleFieldChange('conversionRate', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="6.74"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Coût par Acquisition (CPA)
                  </label>
                  <input
                    type="text"
                    value={formData.cpa}
                    onChange={e => handleFieldChange('cpa', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-emerald-400 font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="114.9"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Retour sur Dépenses (ROAS)
                  </label>
                  <input
                    type="text"
                    value={formData.roas}
                    onChange={e => handleFieldChange('roas', e.target.value)}
                    className="w-full bg-[#0d1017] border border-white/10 rounded-lg px-3 py-2 text-amber-400 font-mono focus:border-orange-500 outline-none font-bold"
                    placeholder="4.8x"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            >
              Annuler
            </button>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={13} />
                <span>Enregistrer les paramètres de sponsoring</span>
              </button>
            </div>
          </div>

        </form>
      )}

    </div>
  );
}
