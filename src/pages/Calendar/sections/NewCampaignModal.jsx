import React, { useState } from 'react';
import { X, Sparkles, DollarSign, Calendar, Layers, Target, Globe, Clock, Check } from 'lucide-react';

export default function NewCampaignModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Orange Telco');
  const [objective, setObjective] = useState('Conversions');
  const [budgetPlanifie, setBudgetPlanifie] = useState('5000000');
  const [dailyBudget, setDailyBudget] = useState('200000');
  const [cpaTarget, setCpaTarget] = useState('400');
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-09-15');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Facebook', 'Instagram', 'TikTok']);
  const [selectedRegions, setSelectedRegions] = useState(['Douala (Littoral)', 'Yaoundé (Centre)']);
  const [daypartingFocus, setDaypartingFocus] = useState('Soirée (18h-22h)');
  const [abTestingEnabled, setAbTestingEnabled] = useState(true);

  if (!isOpen) return null;

  const platformOptions = [
    { id: 'Facebook', label: 'Facebook', icon: '📘' },
    { id: 'Instagram', label: 'Instagram', icon: '📸' },
    { id: 'TikTok', label: 'TikTok Ads', icon: '🎵' },
    { id: 'LinkedIn', label: 'LinkedIn Marketing', icon: '💼' },
    { id: 'X (Twitter)', label: 'X (Twitter)', icon: '𝕏' },
    { id: 'Chaîne WhatsApp', label: 'Chaîne WhatsApp', icon: '💬' },
    { id: 'Display', label: 'Display Programmatique', icon: '🌐' }
  ];

  const regionOptions = [
    'Douala (Littoral)',
    'Yaoundé (Centre)',
    'Bafoussam (Ouest)',
    'Garoua & Maroua (Nord)',
    'Bamenda / Sud-Ouest',
    'Tout le Cameroun (National)'
  ];

  const togglePlatform = (id) => {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const toggleRegion = (reg) => {
    if (selectedRegions.includes(reg)) {
      if (selectedRegions.length > 1) {
        setSelectedRegions(selectedRegions.filter(r => r !== reg));
      }
    } else {
      setSelectedRegions([...selectedRegions, reg]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCampaign = {
      id: `CAMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      brand,
      objective,
      platforms: selectedPlatforms,
      budgetPlanifie: parseInt(budgetPlanifie, 10) || 1000000,
      budgetConsomme: 0,
      dailyBudget: parseInt(dailyBudget, 10) || 50000,
      dailySpentToday: 0,
      startDate,
      endDate,
      daysLeft: 20,
      status: 'active',
      pacing: 'on_track',
      pacingText: 'Nouvelle campagne initialisée',
      cpaTarget: parseInt(cpaTarget, 10) || 400,
      cpaCurrent: parseInt(cpaTarget, 10) || 400,
      roas: 5.0,
      impressions: 0,
      reach: 0,
      clicks: 0,
      ctr: 1.8,
      conversions: 0,
      cvr: 22.0,
      frequency: 1.0,
      fatigueLevel: 'low',
      fatigueColor: '#27AE60',
      daypartingFocus,
      abTestingEnabled,
      regions: selectedRegions
    };

    onSave(newCampaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#151821] text-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0d1017]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white shadow-md">
              🚀
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Créer / Booster une Campagne Ads & Sponsoring
              </h2>
              <p className="text-xs text-slate-400">
                Paramétrage budgétaire, ciblage fin & tracking AARRR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Nom de la campagne *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Opération Pass Nuit Max it 4.5G"
                className="w-full bg-[#1e2430] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Marque / Entité
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#1e2430] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Orange Telco">Orange Telco</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Orange Business">Orange Business</option>
                <option value="Orange Digital Center">Orange Digital Center</option>
                <option value="Pulse">Pulse Cameroun</option>
                <option value="Max it">App Max it</option>
              </select>
            </div>
          </div>

          {/* Objective & Platforms */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Objectif Stratégique (AARRR)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Conversions Pass/MoMo', 'Trafic Web & App', 'Notoriété & Portée', 'Lead Gen B2B'].map((obj) => (
                <button
                  key={obj}
                  type="button"
                  onClick={() => setObjective(obj)}
                  className={`p-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                    objective === obj
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                      : 'bg-[#1e2430] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Plateformes de diffusion sélectionnées
            </label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((p) => {
                const active = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      active
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-[#1e2430] text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                    {active && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget, Daily & CPA Target */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#1e2430] p-4 rounded-xl border border-white/5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Budget Total (FCFA)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={budgetPlanifie}
                  onChange={(e) => setBudgetPlanifie(e.target.value)}
                  className="w-full bg-[#151821] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Budget Journalier (FCFA)
              </label>
              <input
                type="number"
                required
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                className="w-full bg-[#151821] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                CPA Cible (FCFA)
              </label>
              <input
                type="number"
                required
                value={cpaTarget}
                onChange={(e) => setCpaTarget(e.target.value)}
                className="w-full bg-[#151821] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Dates & Dayparting */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#1e2430] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Date de fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#1e2430] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Créneau Dayparting Prioritaire
              </label>
              <select
                value={daypartingFocus}
                onChange={(e) => setDaypartingFocus(e.target.value)}
                className="w-full bg-[#1e2430] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Soirée (18h-22h)">Soirée Prime (18h-22h) - Recommandé</option>
                <option value="Matinée (07h-09h)">Matinée (07h-09h)</option>
                <option value="Pause Midi (12h-14h)">Pause Midi (12h-14h)</option>
                <option value="Continu 24/7">Diffusion Continue 24/7</option>
              </select>
            </div>
          </div>

          {/* Geographic selection & A/B test toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Zones géographiques prioritaires
            </label>
            <div className="flex flex-wrap gap-2">
              {regionOptions.map((reg) => {
                const active = selectedRegions.includes(reg);
                return (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => toggleRegion(reg)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                        : 'bg-[#1e2430] text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {reg}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={abTestingEnabled}
                onChange={(e) => setAbTestingEnabled(e.target.checked)}
                className="rounded border-slate-700 text-orange-500 focus:ring-orange-500"
              />
              <span>Activer l'Attribution des tests A/B automatique (Visuel A vs Visuel B)</span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <span>Lancer la campagne</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
