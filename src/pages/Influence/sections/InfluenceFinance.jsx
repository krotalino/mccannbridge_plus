import { useState, useMemo } from 'react';
import { formatCurrency, formatNumber } from '../../../utils/helpers';
import FinancialSummaryTab from './finance/FinancialSummaryTab';
import InvoicesTab from './finance/InvoicesTab';
import JustificatifsTab from './finance/JustificatifsTab';
import PerformanceScoresTab from './finance/PerformanceScoresTab';
import ContractSyncTab from './finance/ContractSyncTab';

export default function InfluenceFinance({ influencers = [], setInfluencers }) {
  const [selectedInfId, setSelectedInfId] = useState(influencers[0]?.id || '');
  // Sub-tabs: 'suivi_financier' | 'facturation' | 'justificatifs' | 'scores' | 'contrats'
  const [activeSubTab, setActiveSubTab] = useState('suivi_financier');

  // Influenceur sélectionné
  const selectedInf = useMemo(() => {
    return (influencers || []).find(i => String(i.id) === String(selectedInfId)) || influencers[0] || null;
  }, [influencers, selectedInfId]);

  if (!influencers || influencers.length === 0) {
    return (
      <div className="card text-center py-40" style={{ background: '#fff', border: '1px dashed #d0d7de', borderRadius: 12 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>💳</div>
        <h3 className="text-lg font-bold text-dark mb-4">Aucune donnée financière</h3>
        <p className="text-sm text-muted mb-20 max-w-md mx-auto">
          Aucun influenceur n'est encore enregistré dans la base de données. Créez un profil dans l'onglet "1. Fiche Influence" pour gérer les paiements, devis, factures et documents légaux.
        </p>
      </div>
    );
  }

  // Calculs consolidés à l'échelle de TOUS les influenceurs (pour la bannière globale)
  const allPaiements = useMemo(() => {
    return (influencers || []).flatMap(inf =>
      (inf.paiements || []).map(p => ({ ...p, influencerName: inf.pseudo || inf.name, influencerId: inf.id }))
    );
  }, [influencers]);

  const globalTotalPaye = allPaiements
    .filter(p => p.statut === 'paye')
    .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  const globalTotalEnAttente = allPaiements
    .filter(p => p.statut === 'en_attente')
    .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  const globalTotalContracts = (influencers || []).flatMap(inf => inf.contracts || []);
  const globalBudgetContracts = globalTotalContracts.reduce((sum, c) => sum + (Number(c.montant) || 0), 0);

  const subTabs = [
    { id: 'suivi_financier', label: '1. Suivi Budgétaire & Versements', icon: '💳' },
    { id: 'facturation', label: '2. Facturation & TVA (19.25%)', icon: '📑' },
    { id: 'justificatifs', label: '3. Pièces Justificatives', icon: '📎' },
    { id: 'scores', label: '4. Scores Performance & ROI', icon: '⭐' },
    { id: 'contrats', label: '5. Informations Contractuelles Liées', icon: '📄' },
  ];

  return (
    <div>
      {/* 1. EN-TÊTE DU MODULE BUDGÉTAIRE */}
      <div className="flex flex-wrap justify-between items-center gap-12 mb-16">
        <div>
          <h2 className="text-xl font-bold text-dark mb-4">💰 Budgets, Facturation & Performances Financières</h2>
          <p className="text-sm text-muted">
            Suivi financier rigoureux, factures normalisées Orange Cameroun, pièces justificatives certifiées et rentabilité ROI
          </p>
        </div>

        {/* Sélecteur d'influenceur */}
        <div className="flex items-center gap-10 p-6 rounded bg-white border shadow-xs">
          <span className="font-bold text-xs text-dark">Influenceur actif :</span>
          <select
            className="form-input text-xs py-4 font-bold text-dark border-0 bg-light"
            style={{ width: 280 }}
            value={selectedInf?.id || ''}
            onChange={e => setSelectedInfId(e.target.value)}
          >
            {influencers.map(inf => (
              <option key={inf.id} value={inf.id}>
                @{inf.pseudo || inf.name} ({inf.realName || `${inf.prenom || ''} ${inf.nom || ''}`.trim() || 'Créateur'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. CARTE D'IDENTITÉ DU TALENT SÉLECTIONNÉ */}
      {selectedInf && (
        <div className="card p-12 mb-16 bg-white border shadow-xs flex flex-wrap justify-between items-center gap-12">
          <div className="flex items-center gap-12">
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--orange, #FF7900), #e66b00)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16
            }}>
              {(selectedInf.prenom?.[0] || selectedInf.name?.[0] || 'I').toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-8">
                <span className="font-extrabold text-sm text-dark">@{selectedInf.pseudo || selectedInf.name}</span>
                <span className="tag text-xxs bg-orange-50 text-orange font-bold">
                  {selectedInf.platform || 'Instagram'} • {selectedInf.followers || '100K+'} abonnés
                </span>
                <span className="tag text-xxs bg-light border text-muted">
                  {selectedInf.type || 'Macro'} • {selectedInf.niche || selectedInf.segment || 'Lifestyle'}
                </span>
              </div>
              <div className="text-xs text-muted mt-2">
                Nom complet : <strong>{selectedInf.realName || `${selectedInf.prenom || ''} ${selectedInf.nom || ''}`.trim()}</strong> • Téléphone : {selectedInf.phone || '+237 6XX XX XX XX'} • Cachet base : {formatCurrency(selectedInf.cachetBase || 1500000)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-16">
            <div className="text-right">
              <div className="text-xxs text-muted uppercase font-bold">Contrat(s) en vigueur</div>
              <div className="text-sm font-extrabold text-dark">
                {selectedInf.contracts?.length || 1} contrat ({selectedInf.contractStatus || 'Actif'})
              </div>
            </div>
            <div className="text-right">
              <div className="text-xxs text-muted uppercase font-bold">Score Global</div>
              <div className="text-sm font-extrabold text-orange">
                {selectedInf.scorePerformance || selectedInf.score || 4.2} / 5 ⭐
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BARRE DE NAVIGATION DES SOUS-ONGLETS */}
      <div className="flex flex-wrap gap-6 mb-16 p-4 rounded bg-light border">
        {subTabs.map(t => {
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`btn btn-sm text-xs font-bold transition-all flex items-center gap-6 py-6 px-12 rounded ${
                isActive ? 'btn-orange shadow-xs' : 'btn-ghost text-muted hover:text-dark'
              }`}
              style={{
                background: isActive ? 'var(--orange, #FF7900)' : 'transparent',
                color: isActive ? '#fff' : 'inherit',
                border: isActive ? 'none' : 'transparent'
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. RENDU DYNAMIQUE DES 5 SOUS-MODULES */}
      {activeSubTab === 'suivi_financier' && (
        <FinancialSummaryTab
          influencer={selectedInf}
          influencers={influencers}
          setInfluencers={setInfluencers}
          onSwitchTab={(tabId) => setActiveSubTab(tabId)}
        />
      )}

      {activeSubTab === 'facturation' && (
        <InvoicesTab
          influencer={selectedInf}
          influencers={influencers}
          setInfluencers={setInfluencers}
        />
      )}

      {activeSubTab === 'justificatifs' && (
        <JustificatifsTab
          influencer={selectedInf}
          influencers={influencers}
          setInfluencers={setInfluencers}
        />
      )}

      {activeSubTab === 'scores' && (
        <PerformanceScoresTab
          influencer={selectedInf}
          influencers={influencers}
        />
      )}

      {activeSubTab === 'contrats' && (
        <ContractSyncTab
          influencer={selectedInf}
          influencers={influencers}
          setInfluencers={setInfluencers}
        />
      )}
    </div>
  );
}
