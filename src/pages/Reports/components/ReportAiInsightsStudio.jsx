import { useState } from 'react';
import { 
  Sparkles, Brain, Zap, Send, Copy, Check, Download, 
  RefreshCw, TrendingUp, AlertTriangle, ShieldCheck, 
  Flame, Target, Award, FileText, ChevronRight, MessageSquare 
} from 'lucide-react';

export default function ReportAiInsightsStudio({ reports = [], onSelectReport }) {
  const [selectedPromptPreset, setSelectedPromptPreset] = useState('executive_summary');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');

  // Preset Prompts
  const PRESETS = [
    {
      id: 'executive_summary',
      title: 'Synthèse Exécutive — Comité de Direction',
      desc: 'Faits saillants, KPI consolidés 360°, gains nets de communauté et arbitrage budgétaire.',
      badge: 'Direction Générale',
      prompt: 'Générer une synthèse exécutive haut niveau pour la Direction Marketing Orange Cameroun portant sur les performances cross-marques d’août 2026.'
    },
    {
      id: 'competitive_pressure',
      title: 'Audit Concurrentiel vs MTN & Camtel',
      desc: 'Analyse comparative des parts de voix, ripostes publicitaires et opportunités de conquête.',
      badge: 'Benchmark IA',
      prompt: 'Analyser la pression concurrentielle de MTN Cameroun sur TikTok et formuler la stratégie de riposte pour Orange Pulse & Orange Money.'
    },
    {
      id: 'paid_media_roi',
      title: 'Optimisation Paid Media & Coût par Acquisition (CPA)',
      desc: 'Détection des anomalies de CPM, réallocation budgétaire et scaling des campagnes rentables.',
      badge: 'Média & ROI',
      prompt: 'Auditer le mix média Paid (Meta vs Google vs TikTok Ads) et recommander les arbitrages pour baisser le CPA de l’application Maxit.'
    },
    {
      id: 'crisis_sentiment',
      title: 'Social Listening & Tonalité des Verbatims',
      desc: 'Veille sur la perception réseau 4G/Fibre, détection des signaux faibles et FAQ community management.',
      badge: 'Réputation',
      prompt: 'Analyser la perception des forfaits data Maxit sur Twitter et Facebook et lister les réponses types pour le service client.'
    }
  ];

  // Generated insights repository
  const [generatedOutput, setGeneratedOutput] = useState({
    title: 'SYNTHÈSE EXÉCUTIVE STRATÉGIQUE — AOÛT 2026 (MCCANN × ORANGE CAMEROUN)',
    date: 'Mise à jour le 19 Août 2026 à 10:45',
    kpis: [
      { label: 'Portée Globale 360°', val: '14.82 M (+18.4%)', note: 'Surperformance Meta & TikTok' },
      { label: 'Taux d’Engagement Mixte', val: '5.84% (Leader)', note: 'vs 3.9% pour MTN Cameroon' },
      { label: 'Gain Net Communauté', val: '+48 200 fans', note: 'Tirée par Orange Pulse' },
      { label: 'Indice Efficacité Média', val: '9.4 / 10', note: 'CPM réduit de 14.2%' }
    ],
    sections: [
      {
        heading: '1. Faits Marquants & Moteurs de Succès',
        points: [
          'Le lancement des capsules vidéo courtes "Reels Pulse Gaming" a généré à lui seul 3.2M de vues et 180K interactions, positionnant Orange comme la marque télécom la plus engageante auprès de la Gen-Z au Cameroun.',
          'La campagne "Orange Money Frais Zéro Marchand" a enregistré un taux de clic (CTR) de 3.8% (benchmark secteur: 1.9%), convertissant plus de 4 200 téléchargements directs de l’application Maxit.',
          'Sur LinkedIn, les prises de parole "Orange Business Cloud" ont augmenté les leads B2B qualifiés de +28% par rapport au mois de juillet 2026.'
        ]
      },
      {
        heading: '2. Alertes & Points de Vigilance',
        points: [
          'Forte intensification des investissements média sponsorisés de MTN Cameroun sur TikTok (+35% de pression publicitaire avec des créateurs humoristes locaux).',
          'Légère hausse des commentaires négatifs relatifs à la latence de la fibre en soirée dans la zone de Douala Bonapriso (pris en charge par la cellule technique).'
        ]
      },
      {
        heading: '3. Recommandations Actionnables Immédiates (Plan d’Action S34-S36)',
        points: [
          'Réallocation Média : Transférer 12% du budget Display web traditionnel vers les formats TikTok Spark Ads et Meta Reels sponsorisés pour contrer l’offensive de MTN.',
          'Co-création Influence : Activer un pool de 6 micro-influenceurs Tech/Lifestyle pour des démonstrations en direct de la recharge de crédit via Maxit.',
          'Format Prioritaire : Maintenir le rythme de 3 vidéos courtes hebdomadaires par sous-marque avec un sous-titrage bilingue (Français / Pidgin-English) pour maximiser l’inclusion.'
        ]
      }
    ]
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 900);
  };

  const handleCopy = () => {
    const text = `${generatedOutput.title}\n\n${generatedOutput.sections.map(s => `${s.heading}\n${s.points.map(p => `• ${p}`).join('\n')}`).join('\n\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl cosmic-glass-card relative overflow-hidden border border-[#00D4FF]/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D4FF] via-[#0099FF] to-[#0A0E27] flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,212,255,0.4)] shrink-0">
              <Brain size={26} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Studio Stratégique IA & Recommandations McCann
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30">
                  McCann Intelligence Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Génération assistée d'analyses prédictives, synthèses exécutives prêtes pour les comités et plans d'action sur mesure pour Orange Cameroun.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl cosmic-btn-cyan text-xs font-black flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,212,255,0.35)]"
          >
            <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
            <span>{isGenerating ? 'Génération en cours...' : 'Régénérer l’Analyse IA'}</span>
          </button>
        </div>
      </div>

      {/* Preset Prompts Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PRESETS.map((p) => {
          const isSelected = selectedPromptPreset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedPromptPreset(p.id);
                handleGenerate();
              }}
              className={`p-4 rounded-xl text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#00D4FF]/20 to-[#1A1F4E]/90 border-2 border-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.25)]'
                  : 'bg-black/40 border border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-[#00D4FF] text-black font-black' : 'bg-white/10 text-slate-300'
                }`}>
                  {p.badge}
                </span>
                {isSelected && <Zap size={14} className="text-[#00D4FF]" />}
              </div>

              <h4 className="font-extrabold text-xs text-white mb-1 leading-snug">
                {p.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Custom Prompt Bar */}
      <div className="p-4 rounded-xl cosmic-glass-card flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Posez une question analytique spécifique (ex: « Quel est l'impact du format Reel sur les forfaits Maxit ? »)..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl cosmic-glass-input text-xs"
          />
          <Sparkles size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00D4FF]" />
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2.5 rounded-xl cosmic-btn-primary text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Send size={14} />
          <span>Interroger l'IA</span>
        </button>
      </div>

      {/* Generated Strategic Report Card */}
      <div className="p-6 sm:p-8 rounded-2xl cosmic-glass-card border border-white/15 space-y-6">
        
        {/* Output Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6600]">
              Livrable Stratégique Validé
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-tight">
              {generatedOutput.title}
            </h3>
            <span className="text-xs text-slate-400">{generatedOutput.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl cosmic-btn-glass text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl cosmic-btn-glass text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Exporter Note PDF</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {generatedOutput.kpis.map((k, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">{k.label}</span>
              <strong className="text-sm sm:text-base font-black text-white block mt-0.5">{k.val}</strong>
              <span className="text-[10px] text-[#00D4FF] font-semibold">{k.note}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Strategic Sections */}
        <div className="space-y-6 text-slate-200 text-xs sm:text-sm leading-relaxed">
          {generatedOutput.sections.map((sec, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-black/30 border border-white/5 space-y-3">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6600]" />
                {sec.heading}
              </h4>
              <ul className="space-y-2 pl-4">
                {sec.points.map((pt, pIdx) => (
                  <li key={pIdx} className="list-disc text-slate-300 leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer signature */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>Généré par <strong>McCann Strategic AI Engine v4.2</strong> pour <strong>Orange Cameroun</strong></span>
          <span className="text-[#00D4FF] font-mono">ID: MCCANN-AI-2026-AUG-8842</span>
        </div>

      </div>

    </div>
  );
}
