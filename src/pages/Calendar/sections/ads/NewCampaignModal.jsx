import React, { useState } from 'react';
import { X, Plus, Sparkles, DollarSign, Globe, Monitor, Share2, Layers } from 'lucide-react';

export default function NewCampaignModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [type, setType] = useState('social'); // 'social' | 'display'
  const [formData, setFormData] = useState({
    client: 'Orange Cameroun',
    clientLogo: '🍊',
    campaignName: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    budgetTotal: 1500000,
    budgetSpent: 0,
    status: 'Active',
    
    // Social specific
    platform: 'Meta',
    objective: 'Notoriété & Visibilité',
    copyText: '',
    targetAudience: 'Douala, Yaoundé · 18-35 ans',
    visualUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    organicReach: 25000,
    paidReach: 150000,

    // Display specific
    displayType: 'Bannière',
    format: '300x250 Pavé',
    cpm: 950,
    headline: '',
    description: '',
    callToAction: 'En savoir plus',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  });

  const CLIENTS = [
    { name: 'Orange Cameroun', logo: '🍊' },
    { name: 'Canal+ Cameroun', logo: '📺' },
    { name: 'TotalEnergies', logo: '⛽' },
    { name: 'Guinness Cameroun', logo: '🍺' },
    { name: 'Nestlé Cameroun', logo: '🥛' },
    { name: 'Autre Client', logo: '🏢' },
  ];

  const handleClientChange = (clientName) => {
    const found = CLIENTS.find(c => c.name === clientName);
    setFormData(prev => ({
      ...prev,
      client: clientName,
      clientLogo: found ? found.logo : '🏢'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.campaignName.trim()) {
      alert('Veuillez renseigner le nom de la campagne.');
      return;
    }

    const budgetTotalNum = parseFloat(formData.budgetTotal) || 0;
    const budgetSpentNum = parseFloat(formData.budgetSpent) || 0;

    if (type === 'social') {
      const estimatedImpressions = Math.round(budgetSpentNum > 0 ? (budgetSpentNum / 2) : 50000);
      const estimatedClics = Math.round(estimatedImpressions * 0.02);
      const ctr = 2.0;
      const cpc = estimatedClics > 0 ? (budgetSpentNum / estimatedClics) : 65;

      const newSocialCampaign = {
        id: `SOC-${Date.now().toString().slice(-4)}`,
        client: formData.client,
        clientLogo: formData.clientLogo,
        platform: formData.platform,
        campaignName: formData.campaignName.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        budgetTotal: budgetTotalNum,
        budgetSpent: budgetSpentNum,
        impressions: estimatedImpressions,
        clics: estimatedClics,
        ctr: ctr,
        cpc: Math.round(cpc),
        status: formData.status,
        objective: formData.objective,
        targeting: formData.targetAudience,
        copyText: formData.copyText || `Découvrez la nouvelle offre ${formData.campaignName} de ${formData.client}.`,
        visualUrl: formData.visualUrl,
        organicReach: parseInt(formData.organicReach) || 20000,
        paidReach: parseInt(formData.paidReach) || 120000,
        budgetHistory: [
          {
            id: `BH-${Date.now().toString().slice(-4)}`,
            date: new Date().toLocaleDateString('fr-FR'),
            author: 'Community Manager',
            changeAmount: `Création : ${budgetTotalNum.toLocaleString('fr-FR')} FCFA`,
            newBudget: budgetTotalNum,
            reason: 'Allocation initiale de la campagne'
          }
        ]
      };
      onSave('social', newSocialCampaign);
    } else {
      const estimatedImpressions = Math.round(budgetSpentNum > 0 ? (budgetSpentNum / (formData.cpm / 1000)) : 100000);
      const estimatedClics = Math.round(estimatedImpressions * 0.012);
      const ctr = 1.2;
      const conversions = Math.round(estimatedClics * 0.03);

      const newDisplayCampaign = {
        id: `DIS-${Date.now().toString().slice(-4)}`,
        client: formData.client,
        clientLogo: formData.clientLogo,
        campaignName: formData.campaignName.trim(),
        displayType: formData.displayType,
        format: formData.format,
        startDate: formData.startDate,
        endDate: formData.endDate,
        period: `${formData.startDate} - ${formData.endDate}`,
        budgetTotal: budgetTotalNum,
        budgetSpent: budgetSpentNum,
        impressions: estimatedImpressions,
        clics: estimatedClics,
        ctr: ctr,
        cpm: parseFloat(formData.cpm) || 950,
        conversions: conversions,
        conversionRate: 3.0,
        status: formData.status,
        creativePreview: {
          headline: formData.headline || formData.campaignName,
          description: formData.description || `Offre exclusive ${formData.client}`,
          callToAction: formData.callToAction || 'En savoir plus',
          imageUrl: formData.imageUrl,
          brandColor: '#ff7900'
        },
        placements: [
          { site: 'ActuCameroun.com', url: 'https://actucameroun.com', format: formData.format, impressions: Math.round(estimatedImpressions * 0.4), clics: Math.round(estimatedClics * 0.4), ctr: 1.2 },
          { site: 'Camfoot.com', url: 'https://camfoot.com', format: formData.format, impressions: Math.round(estimatedImpressions * 0.35), clics: Math.round(estimatedClics * 0.35), ctr: 1.2 },
          { site: 'Google Display Network', url: 'https://google.com/ads', format: formData.format, impressions: Math.round(estimatedImpressions * 0.25), clics: Math.round(estimatedClics * 0.25), ctr: 1.1 },
        ]
      };
      onSave('display', newDisplayCampaign);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Créer une nouvelle campagne</h3>
              <p className="text-xs text-gray-500">Ajout d'une publication sponsorisée Social Ads ou Display programmatique</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Campaign Type Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Type de Campagne Publicitaire</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('social')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  type === 'social' 
                    ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Share2 className="w-4 h-4 text-orange-600" />
                <span>1. Social Ads (Publications sponsorisées)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('display')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  type === 'display' 
                    ? 'bg-cyan-50 border-cyan-600 text-cyan-800 shadow-xs' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Monitor className="w-4 h-4 text-cyan-700" />
                <span>2. Display (Bannières & Programmatique)</span>
              </button>
            </div>
          </div>

          {/* Common Fields: Client & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Client Annonceur *</label>
              <select
                value={formData.client}
                onChange={e => handleClientChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:border-orange-500 outline-none"
              >
                {CLIENTS.map(c => (
                  <option key={c.name} value={c.name}>{c.logo} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nom de la Campagne *</label>
              <input
                type="text"
                required
                placeholder="Ex: Campagne 4G Max Été 2026"
                value={formData.campaignName}
                onChange={e => setFormData({ ...formData, campaignName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:border-orange-500 outline-none"
              >
              </input>
            </div>
          </div>

          {/* Dates & Budgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Budget Total (FCFA)</label>
              <input
                type="number"
                value={formData.budgetTotal}
                onChange={e => setFormData({ ...formData, budgetTotal: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:border-orange-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Budget Dépensé Actuel</label>
              <input
                type="number"
                value={formData.budgetSpent}
                onChange={e => setFormData({ ...formData, budgetSpent: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:border-orange-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Statut Initial</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:border-orange-500 outline-none"
              >
                <option value="Active">Active</option>
                <option value="En pause">En pause</option>
                <option value="Terminée">Terminée</option>
              </select>
            </div>
          </div>

          {/* Type Specific Fields */}
          {type === 'social' ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <span className="text-xs font-bold text-gray-900 block">Paramètres Spécifiques Social Ads</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Plateforme</label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-orange-500 outline-none"
                  >
                    <option value="Meta">Meta (Facebook & Instagram)</option>
                    <option value="TikTok">TikTok Ads</option>
                    <option value="LinkedIn">LinkedIn Sponsored</option>
                    <option value="X">X (Twitter)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Objectif Marketing</label>
                  <input
                    type="text"
                    placeholder="Ex: Conversions, Notoriété"
                    value={formData.objective}
                    onChange={e => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Texte / Accroche de la publication</label>
                <textarea
                  rows={2}
                  placeholder="Rédigez l'accroche promotionnelle sponsorisée..."
                  value={formData.copyText}
                  onChange={e => setFormData({ ...formData, copyText: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Portée Organique Initiale</label>
                  <input
                    type="number"
                    value={formData.organicReach}
                    onChange={e => setFormData({ ...formData, organicReach: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-orange-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Portée Payante (Boost)</label>
                  <input
                    type="number"
                    value={formData.paidReach}
                    onChange={e => setFormData({ ...formData, paidReach: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-orange-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <span className="text-xs font-bold text-gray-900 block">Paramètres Spécifiques Display & Programmatique</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Type Display</label>
                  <select
                    value={formData.displayType}
                    onChange={e => setFormData({ ...formData, displayType: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-cyan-600 outline-none"
                  >
                    <option value="Bannière">Bannière Web</option>
                    <option value="Vidéo">Vidéo Preroll</option>
                    <option value="Natif">Natif In-Feed</option>
                    <option value="Interstitiel">Interstitiel Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Format Standard</label>
                  <select
                    value={formData.format}
                    onChange={e => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-cyan-600 outline-none"
                  >
                    <option value="300x250 Pavé">300x250 Pavé</option>
                    <option value="728x90 Leaderboard">728x90 Leaderboard</option>
                    <option value="16:9 Full HD Video">16:9 Full HD Video</option>
                    <option value="320x480 Interstitiel">320x480 Interstitiel</option>
                    <option value="300x600 Grand Angle">300x600 Grand Angle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">CPM Moyen (FCFA)</label>
                  <input
                    type="number"
                    value={formData.cpm}
                    onChange={e => setFormData({ ...formData, cpm: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-cyan-600 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Call To Action (Bouton)</label>
                  <input
                    type="text"
                    value={formData.callToAction}
                    onChange={e => setFormData({ ...formData, callToAction: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-cyan-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">URL Visuel Image/Bannière</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-cyan-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-orange px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Créer la campagne</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
