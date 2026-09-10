import { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Filter, 
  CreditCard,
  Layers,
  ArrowDownRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../../../utils/helpers.js';
import PaymentModal from './PaymentModal.jsx';

export default function FinancialSummaryTab({ influencer, influencers, setInfluencers, onSwitchTab }) {
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  // Consolidation des contrats et des campagnes associées à l'influenceur
  const contracts = influencer?.contracts || [];
  const campaignsList = useMemo(() => {
    const list = [];
    if (Array.isArray(influencer?.performanceHistory)) {
      influencer.performanceHistory.forEach((h, idx) => {
        list.push({
          id: h.id || `HIST-${idx}`,
          campaign: h.campaign || h.name || `Campagne #${idx + 1}`,
          brand: h.brand || 'Orange Cameroun',
          budgetAlloue: h.remuneration?.base ? h.remuneration.base + (h.remuneration.variable || 0) : (influencer?.cachetBase || 1500000),
          montantNegocie: h.remuneration?.base ? h.remuneration.base + (h.remuneration.variable || 0) : (influencer?.cachetBase || 1500000),
          statut: h.status || 'terminee'
        });
      });
    }
    if (Array.isArray(influencer?.cahierDesCharges)) {
      influencer.cahierDesCharges.forEach((c) => {
        if (!list.some(l => l.campaign === c.campagneNom)) {
          list.push({
            id: c.campagneId || c.id,
            campaign: c.campagneNom,
            brand: 'Orange Cameroun',
            budgetAlloue: influencer?.cachetBase || 2000000,
            montantNegocie: influencer?.cachetBase || 2000000,
            statut: 'en_cours'
          });
        }
      });
    }
    if (list.length === 0) {
      list.push({
        id: 'DEFAULT-01',
        campaign: influencer?.lastCampaign || 'Campagne Digitale Orange',
        brand: 'Orange Cameroun',
        budgetAlloue: influencer?.cachetBase || 1500000,
        montantNegocie: influencer?.cachetBase || 1500000,
        statut: 'en_cours'
      });
    }
    return list;
  }, [influencer]);

  // Liste de tous les versements de l'influenceur
  const paiements = useMemo(() => {
    if (!influencer?.paiements) return [];
    return influencer.paiements.map(p => ({
      ...p,
      type: p.type || (p.montant < (influencer?.cachetBase || 1500000) ? 'avance' : 'solde'),
      modePaiement: p.modePaiement || 'Virement bancaire',
      campagne: p.campagne || influencer?.lastCampaign || 'Campagne Orange'
    }));
  }, [influencer]);

  // Calculs synthétiques pour l'influenceur sélectionné
  const totalBudgetNegocie = useMemo(() => {
    // Si des contrats existent, la somme des montants de contrats
    if (contracts.length > 0) {
      return contracts.reduce((sum, c) => sum + (Number(c.montant) || 0), 0);
    }
    // Sinon somme des montants des campagnes
    return campaignsList.reduce((sum, c) => sum + (c.montantNegocie || 0), 0);
  }, [contracts, campaignsList]);

  // Budget alloué total (avec provision de marge / imprévus 10%)
  const totalBudgetAlloue = Math.round(totalBudgetNegocie * 1.05);

  // Total payé (effectué)
  const totalVerse = paiements
    .filter(p => p.statut === 'paye')
    .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  // Total des avances / acomptes versés
  const totalAvances = paiements
    .filter(p => p.statut === 'paye' && p.type === 'avance')
    .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  // Total en attente de décaissement
  const totalEnAttente = paiements
    .filter(p => p.statut === 'en_attente')
    .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  // Solde restant à verser
  const soldeRestant = Math.max(0, totalBudgetNegocie - totalVerse);

  // Taux de décaissement (%)
  const tauxDecaissement = totalBudgetNegocie > 0 
    ? Math.min(100, Math.round((totalVerse / totalBudgetNegocie) * 100))
    : 0;

  // Filtrage des paiements
  const filteredPaiements = paiements.filter(p => {
    if (selectedCampaignFilter !== 'all' && p.campagne !== selectedCampaignFilter) return false;
    if (selectedStatusFilter !== 'all' && p.statut !== selectedStatusFilter) return false;
    return true;
  });

  // Gestion des versements (Sauvegarde sans duplication)
  const handleSavePayment = (paymentData) => {
    if (!setInfluencers) return;

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const currentList = inf.paiements ? [...inf.paiements] : [];
      const existIdx = currentList.findIndex(p => p.id === paymentData.id);

      if (existIdx >= 0) {
        currentList[existIdx] = { ...currentList[existIdx], ...paymentData };
      } else {
        currentList.unshift(paymentData);
      }

      return {
        ...inf,
        paiements: currentList
      };
    }));

    setIsPaymentModalOpen(false);
    setEditingPayment(null);
  };

  const handleToggleStatus = (paymentId, currentStatus) => {
    const newStatus = currentStatus === 'paye' ? 'en_attente' : 'paye';
    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const updated = (inf.paiements || []).map(p => {
        if (p.id !== paymentId) return p;
        return {
          ...p,
          statut: newStatus,
          reference: newStatus === 'paye' ? (p.reference || `VIR-${Date.now().toString().slice(-6)}`) : p.reference
        };
      });
      return { ...inf, paiements: updated };
    }));
  };

  const handleDeletePayment = (paymentId) => {
    if (!confirm('Voulez-vous supprimer cette ligne de versement ?')) return;
    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      return {
        ...inf,
        paiements: (inf.paiements || []).filter(p => p.id !== paymentId)
      };
    }));
  };

  return (
    <div>
      {/* 1. CARTES KPI FINANCIÈRES DÉTAILLÉES */}
      <div className="grid grid-4 gap-12 mb-20">
        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--blue, #2980B9)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Budget Alloué Total</span>
            <span className="p-4 rounded bg-blue-50 text-blue"><Layers size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-dark mt-6">{formatCurrency(totalBudgetAlloue)}</div>
          <div className="text-xxs text-muted mt-4">
            Engagements contractuels : <strong>{formatCurrency(totalBudgetNegocie)}</strong>
          </div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--orange, #FF7900)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Montant Négocié</span>
            <span className="p-4 rounded bg-orange-50 text-orange"><CreditCard size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-dark mt-6">{formatCurrency(totalBudgetNegocie)}</div>
          <div className="text-xxs text-muted mt-4">
            Avances versées : <strong className="text-orange">{formatCurrency(totalAvances)}</strong>
          </div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--green, #27AE60)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Versements Effectués</span>
            <span className="p-4 rounded bg-green-50 text-green"><CheckCircle2 size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-green mt-6">{formatCurrency(totalVerse)}</div>
          <div className="text-xxs text-muted mt-4">
            Taux de décaissement : <strong>{tauxDecaissement}%</strong> ({paiements.filter(p => p.statut === 'paye').length} opérations)
          </div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: soldeRestant > 0 ? '#E67E22' : 'var(--muted, #8C8C8C)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Solde Restant</span>
            <span className="p-4 rounded bg-amber-50 text-amber-600"><Clock size={16} /></span>
          </div>
          <div className="text-xl font-extrabold text-dark mt-6" style={{ color: soldeRestant > 0 ? '#E67E22' : 'var(--green, #27AE60)' }}>
            {formatCurrency(soldeRestant)}
          </div>
          <div className="text-xxs text-muted mt-4">
            En attente de paiement : <strong>{formatCurrency(totalEnAttente)}</strong>
          </div>
        </div>
      </div>

      {/* Jauge visuelle de décaissement budgétaire */}
      <div className="card p-12 mb-20 bg-light border">
        <div className="flex justify-between items-center text-xs mb-6">
          <span className="font-bold text-dark flex items-center gap-6">
            <span>Progression du décaissement :</span>
            <span className="text-orange font-extrabold">{tauxDecaissement}% payé</span>
          </span>
          <span className="text-muted font-semibold">
            {formatCurrency(totalVerse)} réglés sur {formatCurrency(totalBudgetNegocie)} négociés
          </span>
        </div>
        <div className="w-full h-8 rounded-full overflow-hidden bg-gray-200">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${tauxDecaissement}%`,
              background: 'linear-gradient(90deg, var(--orange, #FF7900), var(--green, #27AE60))'
            }}
          />
        </div>
      </div>

      {/* 2. TABLEAU DE SUIVI PAR CAMPAGNE / CONTRAT */}
      <div className="card mb-20">
        <div className="flex justify-between items-center mb-14">
          <div>
            <h3 className="text-md font-bold text-dark m-0">Suivi Budgétaire par Campagne & Contrat</h3>
            <p className="text-xs text-muted m-0">Ventilation des budgets alloués, négociés, avances et soldes par opération</p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm text-xs text-orange border"
            onClick={() => onSwitchTab('facturation')}
          >
            Voir la Facturation Associée →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-left">
            <thead>
              <tr className="border-b text-xs text-muted" style={{ background: '#fcfcfc' }}>
                <th className="py-8 px-10">Campagne & Réf.</th>
                <th className="py-8 px-10 text-right">Budget Alloué</th>
                <th className="py-8 px-10 text-right">Montant Négocié</th>
                <th className="py-8 px-10 text-right">Avances Versées</th>
                <th className="py-8 px-10 text-right">Solde Restant</th>
                <th className="py-8 px-10 text-center">Statut Financier</th>
                <th className="py-8 px-10 text-right">Action Rapide</th>
              </tr>
            </thead>
            <tbody>
              {campaignsList.map((c, idx) => {
                // Paiements spécifiques à cette campagne
                const campPaiements = paiements.filter(p => p.campagne === c.campaign);
                const campPaye = campPaiements.filter(p => p.statut === 'paye').reduce((s, p) => s + (Number(p.montant) || 0), 0);
                const campAvance = campPaiements.filter(p => p.statut === 'paye' && p.type === 'avance').reduce((s, p) => s + (Number(p.montant) || 0), 0);
                const campSolde = Math.max(0, c.montantNegocie - campPaye);

                const statusLabel = campSolde === 0 && campPaye > 0
                  ? 'Totalement Soldé ✓'
                  : campAvance > 0
                  ? 'Avance versée (En cours)'
                  : campPaye > 0
                  ? 'Paiement partiel'
                  : 'En attente d\'acompte';

                const statusBg = campSolde === 0 && campPaye > 0
                  ? 'rgba(39, 174, 96, 0.1)'
                  : campAvance > 0
                  ? 'rgba(41, 128, 185, 0.1)'
                  : 'rgba(255, 121, 0, 0.1)';

                const statusColor = campSolde === 0 && campPaye > 0
                  ? 'var(--green, #27AE60)'
                  : campAvance > 0
                  ? 'var(--blue, #2980B9)'
                  : 'var(--orange, #FF7900)';

                return (
                  <tr key={c.id || idx} className="border-b text-xs hover:bg-gray-50" style={{ borderColor: '#f1f1f1' }}>
                    <td className="py-10 px-10">
                      <div className="font-bold text-dark">{c.campaign}</div>
                      <div className="text-xxs text-muted">{c.brand} • Réf: {contracts[idx]?.id || `CTR-2026-0${idx + 1}`}</div>
                    </td>
                    <td className="py-10 px-10 text-right font-semibold text-muted">
                      {formatCurrency(c.budgetAlloue)}
                    </td>
                    <td className="py-10 px-10 text-right font-bold text-dark">
                      {formatCurrency(c.montantNegocie)}
                    </td>
                    <td className="py-10 px-10 text-right font-semibold text-orange">
                      {campAvance > 0 ? formatCurrency(campAvance) : '—'}
                    </td>
                    <td className="py-10 px-10 text-right font-bold" style={{ color: campSolde === 0 ? 'var(--green, #27AE60)' : '#E67E22' }}>
                      {formatCurrency(campSolde)}
                    </td>
                    <td className="py-10 px-10 text-center">
                      <span className="tag text-xxs font-bold" style={{ background: statusBg, color: statusColor }}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="py-10 px-10 text-right">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-xxs font-bold text-orange p-4 border"
                        onClick={() => {
                          setEditingPayment({
                            campagne: c.campaign,
                            montant: campSolde > 0 ? campSolde : Math.round(c.montantNegocie * 0.5),
                            type: campAvance === 0 ? 'avance' : 'solde'
                          });
                          setIsPaymentModalOpen(true);
                        }}
                      >
                        + Verser
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. HISTORIQUE DÉTAILLÉ DES VERSEMENTS */}
      <div className="card">
        <div className="flex flex-wrap justify-between items-center gap-12 mb-16">
          <div>
            <h3 className="text-md font-bold text-dark m-0">Historique des Versements & Déblocages de Fonds</h3>
            <p className="text-xs text-muted m-0">Journal complet des transactions, acomptes, primes bonus et règlements de solde</p>
          </div>

          <div className="flex items-center gap-8">
            {/* Filtre Campagne */}
            <select
              className="form-input text-xs py-4"
              value={selectedCampaignFilter}
              onChange={e => setSelectedCampaignFilter(e.target.value)}
              style={{ width: 170 }}
            >
              <option value="all">Toutes les campagnes</option>
              {campaignsList.map((c, i) => (
                <option key={i} value={c.campaign}>{c.campaign}</option>
              ))}
            </select>

            {/* Filtre Statut */}
            <select
              className="form-input text-xs py-4"
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              style={{ width: 130 }}
            >
              <option value="all">Tous les statuts</option>
              <option value="paye">Payé ✓</option>
              <option value="en_attente">En attente ⏳</option>
            </select>

            {/* Bouton Ajouter Versement */}
            <button
              type="button"
              className="btn btn-orange btn-sm text-xs font-bold flex items-center gap-6"
              style={{ background: 'var(--orange, #FF7900)', color: '#fff' }}
              onClick={() => {
                setEditingPayment(null);
                setIsPaymentModalOpen(true);
              }}
            >
              <Plus size={15} />
              <span>Nouveau Versement</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs text-muted" style={{ background: '#f8f9fa' }}>
                <th className="py-8 px-10">Date d'opération</th>
                <th className="py-8 px-10">Type d'opération</th>
                <th className="py-8 px-10">Campagne associée</th>
                <th className="py-8 px-10 text-right">Montant</th>
                <th className="py-8 px-10">Mode de Règlement</th>
                <th className="py-8 px-10">Réf. Transaction</th>
                <th className="py-8 px-10 text-center">Statut</th>
                <th className="py-8 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPaiements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-24 text-center text-muted text-xs">
                    Aucun versement enregistré pour cette sélection. Cliquez sur "+ Nouveau Versement" pour ajouter un acompte ou un solde.
                  </td>
                </tr>
              ) : (
                filteredPaiements.map((p, idx) => {
                  const isPaye = p.statut === 'paye';
                  const typeLabel = {
                    avance: '⚡ Avance / Acompte',
                    solde: '🏁 Règlement Solde',
                    echeance: '📅 Échéance',
                    bonus: '🎁 Prime Surperformance',
                    penalite: '⚠️ Retenue Pénalité'
                  }[p.type] || 'Versement';

                  return (
                    <tr key={p.id || idx} className="border-b text-xs hover:bg-gray-50" style={{ borderColor: '#f1f1f1' }}>
                      <td className="py-10 px-10 font-semibold text-dark">
                        <div className="flex items-center gap-4">
                          <Calendar size={13} className="text-muted" />
                          <span>{p.date}</span>
                        </div>
                      </td>
                      <td className="py-10 px-10 font-bold text-dark">
                        <span>{typeLabel}</span>
                        {p.motifBonusPenalite && (
                          <div className="text-xxs text-muted italic mt-2">({p.motifBonusPenalite})</div>
                        )}
                      </td>
                      <td className="py-10 px-10 text-muted">
                        {p.campagne}
                      </td>
                      <td className="py-10 px-10 text-right font-extrabold text-sm" style={{ color: p.type === 'penalite' ? 'var(--red, #E74C3C)' : 'var(--dark, #1A1A1A)' }}>
                        {p.type === 'penalite' ? `- ${formatCurrency(p.montant)}` : formatCurrency(p.montant)}
                      </td>
                      <td className="py-10 px-10">
                        <span className="tag text-xxs bg-light border">
                          {p.modePaiement || 'Virement'}
                        </span>
                      </td>
                      <td className="py-10 px-10 text-muted text-xxs font-mono">
                        {p.reference || '—'}
                      </td>
                      <td className="py-10 px-10 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p.id, p.statut)}
                          title="Cliquer pour basculer le statut"
                          className="tag text-xxs font-bold cursor-pointer transition-all"
                          style={{
                            background: isPaye ? 'rgba(39,174,96,0.1)' : 'rgba(255,121,0,0.1)',
                            color: isPaye ? 'var(--green, #27AE60)' : 'var(--orange, #FF7900)',
                            border: '1px solid transparent'
                          }}
                        >
                          {isPaye ? 'Payé ✓' : 'En attente ⏳'}
                        </button>
                      </td>
                      <td className="py-10 px-10 text-right">
                        <div className="flex justify-end gap-6">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm p-4 text-muted text-xxs"
                            onClick={() => {
                              setEditingPayment(p);
                              setIsPaymentModalOpen(true);
                            }}
                          >
                            Éditer
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm p-4 text-red text-xxs"
                            onClick={() => handleDeletePayment(p.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Versement */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setEditingPayment(null);
          }}
          onSave={handleSavePayment}
          influencer={influencer}
          initialPayment={editingPayment}
          campaigns={campaignsList}
          contracts={contracts}
        />
      )}
    </div>
  );
}
