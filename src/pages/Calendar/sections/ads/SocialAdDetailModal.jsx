import React, { useState } from 'react';
import { 
  X, DollarSign, Calendar, TrendingUp, Eye, MousePointer, 
  Share2, ArrowUpRight, Copy, Check, Plus, AlertCircle, 
  Sparkles, CheckCircle2, ShieldAlert
} from 'lucide-react';

export default function SocialAdDetailModal({ campaign, isOpen, onClose, onUpdateCampaign }) {
  if (!isOpen || !campaign) return null;

  const [copied, setCopied] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [reason, setReason] = useState('');
  const [author, setAuthor] = useState('Sarah M. (CM Bridge)');

  const totalReach = (campaign.organicReach || 0) + (campaign.paidReach || 0);
  const organicPct = totalReach > 0 ? Math.round(((campaign.organicReach || 0) / totalReach) * 100) : 0;
  const paidPct = totalReach > 0 ? (100 - organicPct) : 0;

  const budgetPct = campaign.budgetTotal > 0 
    ? Math.min(100, Math.round(((campaign.budgetSpent || 0) / campaign.budgetTotal) * 100)) 
    : 0;
  const isBudgetWarning = budgetPct >= 90;
  const isLowCtr = campaign.ctr < 0.8;

  const handleCopyText = () => {
    if (!campaign.copyText) return;
    navigator.clipboard?.writeText(campaign.copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddBudgetAdjustment = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(newAmount.replace(/\s/g, ''));
    if (!amountNum || isNaN(amountNum)) {
      alert('Veuillez renseigner un montant valide.');
      return;
    }

    const nextTotalBudget = (campaign.budgetTotal || 0) + amountNum;
    const newHistoryEntry = {
      id: `BH-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      author: author.trim() || 'Community Manager',
      changeAmount: `${amountNum > 0 ? '+' : ''}${amountNum.toLocaleString('fr-FR')} FCFA`,
      newBudget: nextTotalBudget,
      reason: reason.trim() || 'Ajustement de budget de campagne'
    };

    const updated = {
      ...campaign,
      budgetTotal: nextTotalBudget,
      budgetHistory: [newHistoryEntry, ...(campaign.budgetHistory || [])]
    };

    onUpdateCampaign(updated);
    setNewAmount('');
    setReason('');
    setShowAddBudget(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{campaign.clientLogo || '📱'}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  {campaign.campaignName}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  campaign.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : campaign.status === 'En pause'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  ● {campaign.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Client : <span className="text-gray-900 font-semibold">{campaign.client}</span> · Plateforme : <span className="text-orange-600 font-semibold">{campaign.platform}</span> · Objectif : <span className="text-gray-700 font-medium">{campaign.objective || 'Notoriété'}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* Alert Banner if budget warning or low CTR */}
          {(isBudgetWarning || isLowCtr) && (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Vigilance opérationnelle :</p>
                {isBudgetWarning && (
                  <p>• Le budget alloué est consommé à <strong>{budgetPct}%</strong> ({campaign.budgetSpent.toLocaleString('fr-FR')} FCFA). Pensez à réapprovisionner la campagne.</p>
                )}
                {isLowCtr && (
                  <p>• Le CTR est de <strong>{campaign.ctr}%</strong> (&lt; 0.8%). Nous conseillons de renouveler l'accroche ou la vignette.</p>
                )}
              </div>
            </div>
          )}

          {/* Grid: Visual Preview (Left) + KPIs & Portée (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual & Copy Section (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50 shadow-2xs">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-700 bg-white">
                  <span>Aperçu du Visuel Sponsorisé</span>
                  <span className="text-[10px] text-gray-500 font-normal">Format Post Social</span>
                </div>
                <div className="relative aspect-square w-full bg-gray-100 overflow-hidden flex items-center justify-center group">
                  <img 
                    src={campaign.visualUrl} 
                    alt={campaign.campaignName} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-semibold">Ciblage : {campaign.targeting || '25-45 ans · Urbain Cameroun'}</span>
                  </div>
                </div>
              </div>

              {/* Copywriting / Texte de la publication */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Texte / Accroche de la publication</span>
                  <button 
                    onClick={handleCopyText}
                    className="flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-700 font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-700 bg-white p-3 rounded-lg border border-gray-200 leading-relaxed font-sans select-text">
                  {campaign.copyText || "Découvrez nos offres exclusives disponibles dès maintenant en agence et sur nos applications mobiles."}
                </p>
              </div>
            </div>

            {/* KPIs & Organic vs Paid Breakdown (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Main 4 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-medium">Budget dépensé</div>
                  <div className="text-sm font-extrabold font-mono text-gray-900 mt-1">
                    {campaign.budgetSpent.toLocaleString('fr-FR')} <span className="text-[10px] font-normal text-gray-500">F</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    sur {campaign.budgetTotal.toLocaleString('fr-FR')} F
                  </div>
                </div>

                <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-medium">Impressions</div>
                  <div className="text-sm font-extrabold font-mono text-gray-900 mt-1">
                    {(campaign.impressions || 0).toLocaleString('fr-FR')}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Affichages totaux
                  </div>
                </div>

                <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-medium">Clics & CTR</div>
                  <div className="text-sm font-extrabold font-mono text-blue-700 mt-1">
                    {(campaign.clics || 0).toLocaleString('fr-FR')}
                  </div>
                  <div className="text-[10px] font-bold text-blue-600 mt-0.5">
                    CTR {campaign.ctr}%
                  </div>
                </div>

                <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-medium">Coût par Clic (CPC)</div>
                  <div className="text-sm font-extrabold font-mono text-orange-600 mt-1">
                    {(campaign.cpc || 0).toFixed(1)} <span className="text-[10px] font-normal text-gray-500">FCFA</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Moyenne régie
                  </div>
                </div>
              </div>

              {/* SPEC MANDATORY: Portée Organique vs Payante */}
              <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-gray-900">
                      Décomposition de la Portée (Reach) : Organique vs Payante
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-900">
                    Total : {totalReach.toLocaleString('fr-FR')} personnes
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all" 
                    style={{ width: `${organicPct}%` }}
                    title={`Organique : ${organicPct}%`}
                  />
                  <div 
                    className="bg-orange-500 h-full transition-all" 
                    style={{ width: `${paidPct}%` }}
                    title={`Payant (Sponsoring) : ${paidPct}%`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                    <div>
                      <span className="text-gray-500">Portée Organique : </span>
                      <strong className="text-gray-900 font-mono">{(campaign.organicReach || 0).toLocaleString('fr-FR')}</strong>
                      <span className="text-emerald-700 font-semibold font-mono ml-1">({organicPct}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-orange-500" />
                    <div>
                      <span className="text-gray-500">Portée Payante (Ads) : </span>
                      <strong className="text-gray-900 font-mono">{(campaign.paidReach || 0).toLocaleString('fr-FR')}</strong>
                      <span className="text-orange-600 font-semibold font-mono ml-1">({paidPct}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPEC MANDATORY: Historique des modifications de budget */}
              <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-gray-900">
                      Historique des Réallocations & Modifications de Budget
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAddBudget(!showAddBudget)}
                    className="px-2.5 py-1 text-[11px] font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-500 border border-orange-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajuster le Budget</span>
                  </button>
                </div>

                {/* Form to adjust budget */}
                {showAddBudget && (
                  <form onSubmit={handleAddBudgetAdjustment} className="p-3.5 bg-white border border-orange-200 rounded-xl space-y-3 animate-fadeIn">
                    <div className="text-xs font-bold text-gray-900">Nouvel ajustement de budget</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-1 font-semibold">Montant d'ajustement (FCFA)</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: 50000 ou -20000"
                          value={newAmount}
                          onChange={e => setNewAmount(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-1 font-semibold">Auteur de la modification</label>
                        <input
                          type="text"
                          value={author}
                          onChange={e => setAuthor(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-1 font-semibold">Motif de réallocation</label>
                        <input
                          type="text"
                          placeholder="Ex: Boost week-end promo"
                          value={reason}
                          onChange={e => setReason(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddBudget(false)}
                        className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg"
                      >
                        Valider l'ajustement
                      </button>
                    </div>
                  </form>
                )}

                {/* History Table */}
                <div className="overflow-x-auto max-h-44 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="text-[10px] uppercase text-gray-500 border-b border-gray-200 bg-white">
                      <tr>
                        <th className="py-2 px-2.5 font-bold">Date & Heure</th>
                        <th className="py-2 px-2.5 font-bold">Auteur</th>
                        <th className="py-2 px-2.5 font-bold text-right">Variation</th>
                        <th className="py-2 px-2.5 font-bold text-right">Nouveau Plafond</th>
                        <th className="py-2 px-2.5 font-bold">Motif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {(campaign.budgetHistory || []).map((h, i) => (
                        <tr key={i} className="hover:bg-white/60">
                          <td className="py-2 px-2.5 font-mono text-gray-600 whitespace-nowrap text-[11px]">{h.date}</td>
                          <td className="py-2 px-2.5 font-medium text-gray-900 whitespace-nowrap text-[11px]">{h.author}</td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-emerald-700 whitespace-nowrap text-[11px]">{h.changeAmount}</td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-gray-900 whitespace-nowrap text-[11px]">{h.newBudget.toLocaleString('fr-FR')} F</td>
                          <td className="py-2 px-2.5 text-gray-600 text-[11px] max-w-xs truncate">{h.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Identifiant de campagne : <span className="font-mono text-gray-700 font-semibold">{campaign.id}</span></span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-2xs transition-colors"
          >
            Fermer la fiche
          </button>
        </div>

      </div>
    </div>
  );
}
