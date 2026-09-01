import { useState, useEffect, useMemo } from 'react';
import { 
  X, Check, AlertCircle, FileText, Calendar, Building2, 
  Layers, Upload, Link as LinkIcon, Sparkles, HelpCircle, 
  Clock, ShieldAlert, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { 
  REPORT_TYPES, BRANDS_LIST, CHANNELS_LIST, 
  REPORT_SECTIONS_CATALOG, COMPETITORS_LIST 
} from '../../../data/reportsData';

export default function NewReportRequestModal({
  isOpen,
  onClose,
  onSubmitReport,
  currentUser,
  prefilledTemplate = null
}) {
  // Generate random reference code
  const generatedId = useMemo(() => {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const month = '08';
    return `REP-2026-${month}${randomHex}`;
  }, [isOpen]);

  const [activeStep, setActiveStep] = useState(1); // 1: Info générale & Période, 2: Contexte & Canaux, 3: Sections & Validation

  // Form State
  const [formData, setFormData] = useState({
    id: generatedId,
    title: '',
    type: 'hebdomadaire',
    client: 'Orange Cameroun',
    brands: ['Orange TELCO'],
    requesterName: currentUser?.user || 'Lauriane Ngameni',
    requesterRole: currentUser?.poste || 'Digital Brand Manager',
    clientContact: 'Patrick Tuete (Head of Digital Marketing)',
    assigneeName: 'Steve BESSOUBE',
    priority: 'haute',
    urgentReason: '',
    dueDate: '2026-08-19',
    
    // Period & Scope
    startDate: '2026-08-11',
    endDate: '2026-08-17',
    periodLabel: 'Semaine du 11 au 17 août 2026',
    comparisonType: 'periode_precedente',
    dataType: 'mixte',
    channels: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'X (Twitter)', 'YouTube'],
    region: 'Cameroun (National)',
    currency: 'XAF',

    // Context
    campaignName: '',
    marketingObjective: 'Engagement & Conversions Maxit',
    businessQuestion: '',
    hypotheses: '',
    keyMoments: '',
    briefNotes: '',
    attachments: [],

    // Sections
    selectedSections: [
      'cover', 'executive_summary', 'community_growth', 'platform_performance',
      'period_comparison', 'speeches_analysis', 'qualitative_insights',
      'competitive_benchmark', 'best_posts', 'actionable_recos'
    ]
  });

  // Apply template if passed
  useEffect(() => {
    if (prefilledTemplate) {
      setFormData(prev => ({
        ...prev,
        type: prefilledTemplate.type,
        title: `Rapport ${prefilledTemplate.title.replace('Modèle ', '')} — Août 2026`,
        selectedSections: prefilledTemplate.recommendedSections || prev.selectedSections,
        channels: prefilledTemplate.recommendedChannels || prev.channels,
      }));
    }
  }, [prefilledTemplate]);

  // Handle report type switch
  const handleTypeChange = (newType) => {
    const typeObj = REPORT_TYPES.find(t => t.id === newType);
    const defaultSections = REPORT_SECTIONS_CATALOG
      .filter(sec => sec.defaultIn.includes(newType))
      .map(sec => sec.id);

    // Auto title helper
    let defaultTitle = `Rapport ${typeObj?.label || newType} — Août 2026`;
    if (newType === 'hebdomadaire') defaultTitle = 'Rapport Hebdomadaire Social Media — S34 (18 au 24 Août 2026)';
    if (newType === 'mensuel') defaultTitle = 'Rapport Mensuel Consolidé 360° — Août 2026';
    if (newType === 'spontane') defaultTitle = 'Rapport Spontané Ad Hoc — Analyse Spécifique';
    if (newType === 'campagne') defaultTitle = 'Rapport de Campagne — Bilan d’Activation';
    if (newType === 'benchmark') defaultTitle = 'Rapport de Benchmark Concurrentiel — Orange vs MTN vs Camtel';
    if (newType === 'executif') defaultTitle = 'Rapport Exécutif — Synthèse Direction & KPI';

    // Due date suggestion
    let suggestedDue = '2026-08-20';
    if (newType === 'spontane') suggestedDue = '2026-08-18';
    if (newType === 'mensuel') suggestedDue = '2026-09-05';

    setFormData(prev => ({
      ...prev,
      type: newType,
      title: defaultTitle,
      selectedSections: defaultSections,
      dueDate: suggestedDue
    }));
  };

  // Toggle brand
  const handleToggleBrand = (brandName) => {
    setFormData(prev => {
      const exists = prev.brands.includes(brandName);
      if (exists) {
        if (prev.brands.length === 1) return prev; // keep at least 1
        return { ...prev, brands: prev.brands.filter(b => b !== brandName) };
      } else {
        return { ...prev, brands: [...prev.brands, brandName] };
      }
    });
  };

  // Toggle channel
  const handleToggleChannel = (chanName) => {
    setFormData(prev => {
      const exists = prev.channels.includes(chanName);
      if (exists) {
        if (prev.channels.length === 1) return prev;
        return { ...prev, channels: prev.channels.filter(c => c !== chanName) };
      } else {
        return { ...prev, channels: [...prev.channels, chanName] };
      }
    });
  };

  // Toggle section
  const handleToggleSection = (secId) => {
    setFormData(prev => {
      const exists = prev.selectedSections.includes(secId);
      if (exists) {
        return { ...prev, selectedSections: prev.selectedSections.filter(s => s !== secId) };
      } else {
        return { ...prev, selectedSections: [...prev.selectedSections, secId] };
      }
    });
  };

  // Calculate Brief Completeness %
  const completenessScore = useMemo(() => {
    let score = 20; // base for type and client
    if (formData.title.trim().length > 5) score += 15;
    if (formData.brands.length > 0) score += 10;
    if (formData.startDate && formData.endDate) score += 15;
    if (formData.channels.length >= 2) score += 10;
    if (formData.marketingObjective) score += 10;
    if (formData.businessQuestion.trim().length > 10) score += 10;
    if (formData.selectedSections.length >= 4) score += 10;
    return Math.min(100, score);
  }, [formData]);

  // Validation
  const canSubmit = formData.title.trim().length > 3 && 
                    formData.brands.length > 0 && 
                    formData.dueDate &&
                    (formData.priority !== 'urgente' || formData.urgentReason.trim().length > 5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const newReport = {
      id: formData.id,
      title: formData.title,
      type: formData.type,
      client: formData.client,
      brands: formData.brands,
      requester: {
        name: formData.requesterName,
        role: formData.requesterRole,
        email: `${formData.requesterName.toLowerCase().replace(' ', '.')}@orange.cm`,
        avatar: formData.requesterName.split(' ').map(w => w[0]).join('').slice(0, 2)
      },
      clientContact: {
        name: formData.clientContact.split(' (')[0],
        role: 'Client Sponsor'
      },
      assignee: {
        name: formData.assigneeName,
        role: 'Digital Web Analyst Lead',
        avatar: 'SB'
      },
      priority: formData.priority,
      urgentReason: formData.urgentReason,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      dueDate: formData.dueDate,
      deliveredDate: null,
      briefCompleteness: completenessScore,
      version: 'v1.0 (Soumis)',
      versions: [
        {
          versionNumber: 'v1.0',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          author: formData.requesterName,
          changelog: 'Soumission initiale de la demande de rapport'
        }
      ],
      period: {
        start: formData.startDate,
        end: formData.endDate,
        label: formData.periodLabel || `${formData.startDate} au ${formData.endDate}`,
        comparisonType: formData.comparisonType,
        comparisonLabel: formData.comparisonType === 'periode_precedente' ? 'vs Période précédente' : 'Sans comparaison',
        dataTypes: formData.dataType,
        channels: formData.channels,
        region: formData.region,
        currency: formData.currency
      },
      context: {
        campaignName: formData.campaignName || formData.title,
        marketingObjective: formData.marketingObjective,
        businessQuestion: formData.businessQuestion || 'Mesure et analyse des performances digitales.',
        hypotheses: formData.hypotheses,
        keyMoments: formData.keyMoments,
        attachments: formData.attachments.length > 0 ? formData.attachments : [
          { name: `Brief_${formData.id}.pdf`, size: '1.4 MB', type: 'pdf' }
        ]
      },
      selectedSections: formData.selectedSections,
      comments: [
        {
          id: `c_${Date.now()}`,
          author: formData.requesterName,
          role: formData.requesterRole,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          type: 'client',
          text: `Demande de rapport créée et soumise pour traitement. Objectif principal : ${formData.marketingObjective}.`,
          resolved: false
        }
      ],
      auditLog: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          user: formData.requesterName,
          action: 'Création',
          detail: `Demande de rapport ${formData.id} soumise avec statut "Soumise"`
        }
      ],
      data: {
        executiveSummary: {
          highlights: [
            'Rapport nouvellement initié en attente de collecte et traitement des données par l’analyste.',
            `Périmètre ciblé : ${formData.brands.join(', ')} sur ${formData.channels.length} canaux.`
          ],
          alerts: [],
          priorityRecos: []
        },
        communityEvolution: { initialTotal: 1422000, finalTotal: 1422000, netGrowth: 0, growthPercent: 0, byPlatform: [] },
        platformPerformance: [],
        speeches: [],
        benchmark: { period: formData.periodLabel, competitors: COMPETITORS_LIST.map(c => ({ name: c.name, followers: 'En cours', engagement: '—', postsPerWeek: 0 })), orange: {}, insights: [] },
        bestPosts: [],
        paidMedia: { budgetSpent: 0, paidReach: 0, impressions: 0, cpm: '0', cpc: '0', ctr: '0%', conversions: 0, cpa: '0', channelsBreakdown: [] },
        sentimentAnalysis: { positive: 70, neutral: 20, negative: 10, topKeywords: [], riskMentions: [] },
        recommendations: { editorial: [], media: [], creative: [], strategic: [] }
      }
    };

    onSubmitReport(newReport);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col cosmic-glass-card border border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xs bg-[#FF6600]/20 text-[#FF8C00] px-2 py-0.5 rounded-md border border-[#FF6600]/30">
                {formData.id}
              </span>
              <h2 className="text-base font-black text-white">
                Nouvelle Demande de Rapport & Insights
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Formulaire structuré conforme aux normes de gouvernance McCann × Orange Cameroun
            </p>
          </div>

          {/* Completeness indicator badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Complétude brief</div>
                <div className="text-xs font-black text-emerald-400">{completenessScore}%</div>
              </div>
              <div className="w-12 bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completenessScore}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Multi-step progress navigation */}
        <div className="px-6 py-3 bg-black/30 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 text-xs">
            {[
              { num: 1, label: 'Général & Période' },
              { num: 2, label: 'Contexte & Canaux' },
              { num: 3, label: 'Rubriques du Rapport' }
            ].map(step => {
              const isCur = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(step.num)}
                  className={`flex items-center gap-2 font-bold py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                    isCur 
                      ? 'cosmic-tab-active shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isCur ? 'bg-black text-white' : 'bg-white/10 text-slate-400'
                  }`}>{step.num}</span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: General Info & Period */}
          {activeStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Report Type Selector */}
              <div>
                <label className="block text-xs font-black text-[#FF8C00] uppercase tracking-wider mb-2">
                  1. Type de Rapport Souhaité <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {REPORT_TYPES.map((type) => {
                    const isSelected = formData.type === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleTypeChange(type.id)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-[#FF6600] bg-gradient-to-b from-[#FF6600]/25 to-black/60 shadow-[0_0_15px_rgba(255,102,0,0.3)] text-white' 
                            : 'border-white/10 bg-black/40 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl">{type.icon}</span>
                          <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                            {type.sla}
                          </span>
                        </div>
                        <div className="text-xs font-black mt-1">{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Client */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Titre du Rapport / Référence explicite <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Rapport Hebdomadaire S33 — Focus Promo Maxit & Pulse Gaming"
                    className="w-full text-xs font-semibold p-3 cosmic-glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Client <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.client}
                    className="w-full text-xs font-black p-3 bg-white/5 border border-white/10 rounded-xl text-slate-300"
                  />
                </div>
              </div>

              {/* Brands / BUs Multi-select */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Marques & Business Units concernées <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BRANDS_LIST.map((b) => {
                    const isChecked = formData.brands.includes(b.name);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleToggleBrand(b.name)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked 
                            ? 'border-[#FF6600] bg-[#FF6600]/20 text-white font-black shadow-[0_0_10px_rgba(255,102,0,0.2)]' 
                            : 'border-white/10 bg-black/40 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }}></span>
                          <span className="text-xs">{b.name}</span>
                        </div>
                        {isChecked && <Check size={14} className="text-[#FF8C00]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority & Urgency */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Niveau de Priorité <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full text-xs font-semibold p-2.5 cosmic-glass-input text-white"
                    >
                      <option value="normale" className="bg-[#0A0E27] text-white">🟢 Normale (SLA standard)</option>
                      <option value="haute" className="bg-[#0A0E27] text-white">🟠 Haute (Livraison prioritaire)</option>
                      <option value="urgente" className="bg-[#0A0E27] text-white">🔥 Urgente (SLA exceptionnel &lt; 24h)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Date limite souhaitée / Échéance <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full text-xs font-semibold p-2.5 cosmic-glass-input text-white"
                    />
                  </div>
                </div>

                {/* If priority is urgent, require urgent reason */}
                {formData.priority === 'urgente' && (
                  <div className="pt-3 border-t border-red-500/30 animate-fadeIn">
                    <label className="block text-xs font-black text-red-400 mb-1.5 flex items-center gap-1.5">
                      <ShieldAlert size={15} />
                      <span>Motif explicite de l'urgence (Obligatoire) *</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.urgentReason}
                      onChange={(e) => setFormData({ ...formData, urgentReason: e.target.value })}
                      placeholder="Indiquez le contexte exceptionnel justifiant un SLA < 24h (ex: crise, incident technique, comité de crise, bad buzz...)"
                      className="w-full text-xs p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                )}
              </div>

              {/* Period and Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Date Début Période</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full text-xs p-2.5 cosmic-glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Date Fin Période</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full text-xs p-2.5 cosmic-glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Période de Comparaison</label>
                  <select
                    value={formData.comparisonType}
                    onChange={(e) => setFormData({ ...formData, comparisonType: e.target.value })}
                    className="w-full text-xs p-2.5 cosmic-glass-input text-white"
                  >
                    <option value="periode_precedente" className="bg-[#0A0E27]">Période précédente (S-1 / M-1)</option>
                    <option value="meme_periode_mois_precedent" className="bg-[#0A0E27]">Même période du mois précédent</option>
                    <option value="meme_periode_annee_precedente" className="bg-[#0A0E27]">Même période année précédente (N-1)</option>
                    <option value="aucune" className="bg-[#0A0E27]">Aucune comparaison</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Context & Channels */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Channels selector */}
              <div>
                <label className="block text-xs font-black text-[#00D4FF] uppercase tracking-wider mb-2">
                  2. Canaux & Réseaux Sociaux Concernés <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CHANNELS_LIST.map((chan) => {
                    const isChecked = formData.channels.includes(chan.name);
                    return (
                      <button
                        key={chan.id}
                        type="button"
                        onClick={() => handleToggleChannel(chan.name)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked 
                            ? 'border-[#00D4FF] bg-[#00D4FF]/20 text-white font-black shadow-[0_0_10px_rgba(0,212,255,0.2)]' 
                            : 'border-white/10 bg-black/40 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{chan.icon}</span>
                          <span className="text-xs">{chan.name}</span>
                        </div>
                        {isChecked && <Check size={14} className="text-[#00D4FF]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Data Type & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Type de Données Analysées</label>
                  <select
                    value={formData.dataType}
                    onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                    className="w-full text-xs p-2.5 cosmic-glass-input text-white"
                  >
                    <option value="mixte" className="bg-[#0A0E27]">Mixte (Organique + Sponsorisé / Paid)</option>
                    <option value="organique" className="bg-[#0A0E27]">Organique uniquement</option>
                    <option value="sponsorise" className="bg-[#0A0E27]">Sponsorisé / Paid Media uniquement</option>
                    <option value="campagne_landing" className="bg-[#0A0E27]">Campagne & Landing Page</option>
                    <option value="crm_conversion" className="bg-[#0A0E27]">CRM & Données de Conversion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Zone Géographique / Marché</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Ex: Cameroun (National), Douala, Yaoundé..."
                    className="w-full text-xs p-2.5 cosmic-glass-input text-white"
                  />
                </div>
              </div>

              {/* Marketing Objective & Business Question */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Objectif Marketing Principal
                  </label>
                  <select
                    value={formData.marketingObjective}
                    onChange={(e) => setFormData({ ...formData, marketingObjective: e.target.value })}
                    className="w-full text-xs p-2.5 cosmic-glass-input text-white"
                  >
                    <option value="Engagement & Conversions Maxit" className="bg-[#0A0E27]">Engagement & Conversions Maxit</option>
                    <option value="Notoriété & Visibilité de Marque" className="bg-[#0A0E27]">Notoriété & Visibilité de Marque</option>
                    <option value="Génération de Leads B2B" className="bg-[#0A0E27]">Génération de Leads B2B (Orange Business)</option>
                    <option value="Trafic Web & Téléchargements Application" className="bg-[#0A0E27]">Trafic Web & Téléchargements Application</option>
                    <option value="Adoption Services Financiers (Orange Money)" className="bg-[#0A0E27]">Adoption Services Financiers (Orange Money)</option>
                    <option value="Recrutement Jeunes & Gaming (Orange Pulse)" className="bg-[#0A0E27]">Recrutement Jeunes & Gaming (Orange Pulse)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Question Métier à laquelle le rapport doit répondre
                  </label>
                  <textarea
                    rows={2}
                    value={formData.businessQuestion}
                    onChange={(e) => setFormData({ ...formData, businessQuestion: e.target.value })}
                    placeholder="Ex: Quel a été le format le plus performant pour générer des souscriptions et comment se positionne MTN sur la même période ?"
                    className="w-full text-xs p-3 cosmic-glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Informations sur les Temps Forts (Offres, Événements, Partenariats)
                  </label>
                  <input
                    type="text"
                    value={formData.keyMoments}
                    onChange={(e) => setFormData({ ...formData, keyMoments: e.target.value })}
                    placeholder="Ex: Lancement tournoi Orange Pulse Gaming + Promo Maxit 50% data"
                    className="w-full text-xs p-2.5 cosmic-glass-input text-white"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Report Sections Selector */}
          {activeStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-white uppercase tracking-wider">
                  3. Rubriques & Blocs de Contenu du Rapport ({formData.selectedSections.length} sélectionnés)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedSections: REPORT_SECTIONS_CATALOG.map(s => s.id) })}
                    className="text-xs font-bold text-[#FF8C00] hover:underline cursor-pointer"
                  >
                    Tout sélectionner
                  </button>
                  <span className="text-white/20">|</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedSections: ['cover', 'executive_summary'] })}
                    className="text-xs font-bold text-slate-400 hover:underline cursor-pointer"
                  >
                    Minimal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {REPORT_SECTIONS_CATALOG.map((sec) => {
                  const isChecked = formData.selectedSections.includes(sec.id);
                  return (
                    <div
                      key={sec.id}
                      onClick={() => handleToggleSection(sec.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isChecked 
                          ? 'border-[#FF6600] bg-[#FF6600]/15 text-white' 
                          : 'border-white/10 bg-black/40 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#FF6600] text-white' : 'border border-white/30 bg-white/5'
                      }`}>
                        {isChecked && <Check size={12} />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-black">{sec.label}</div>
                        <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{sec.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary recap box */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200">
                  <div className="font-black text-emerald-400 mb-0.5">Demande prête à être transmise à l'équipe McCann</div>
                  <p className="text-slate-300 leading-relaxed">
                    À la soumission, une notification sera envoyée au Digital Web Analyst (Steve BESSOUBE) pour qualification et planification de la collecte.
                  </p>
                </div>
              </div>

            </div>
          )}

        </form>

        {/* Modal Footer / Step Controls */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <div>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 cosmic-btn-glass rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                ← Étape précédente
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cosmic-btn-glass rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Annuler
            </button>

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 cosmic-btn-primary rounded-xl text-xs font-black shadow-md cursor-pointer transition-all"
              >
                <span>Étape suivante</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                  canSubmit 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black shadow-lg cursor-pointer' 
                    : 'bg-white/10 text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                <Check size={15} />
                <span>Soumettre la Demande ({formData.id})</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
