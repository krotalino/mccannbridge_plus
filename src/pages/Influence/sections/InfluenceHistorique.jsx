import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileDown,
  Share2,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  DollarSign,
  CheckCircle2,
  Users,
  Layers,
  ArrowRight
} from 'lucide-react';
import { formatNumber, formatCurrency } from '../../../utils/helpers';
import CampaignHistoryCard from './historique/CampaignHistoryCard';
import CampaignHistoryModal from './historique/CampaignHistoryModal';
import CampaignHistoryShareModal from './historique/CampaignHistoryShareModal';
import { exportCampaignHistoryToPdf } from './historique/CampaignHistoryPdfExport';

export default function InfluenceHistorique({ influencers = [], setInfluencers }) {
  const [selectedInfId, setSelectedInfId] = useState(influencers[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'terminee' | 'en_cours' | 'reportee' | 'annulee'
  const [brandFilter, setBrandFilter] = useState('all');

  // Modales
  const [modalState, setModalState] = useState({ isOpen: false, campaignToEdit: null });
  const [shareModalState, setShareModalState] = useState({ isOpen: false, campaign: null });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedInf = useMemo(() => {
    return (influencers || []).find(i => String(i.id) === String(selectedInfId)) || influencers[0] || null;
  }, [influencers, selectedInfId]);

  // Consolidation des campagnes de l'influenceur
  const consolidatedCampaigns = useMemo(() => {
    if (!selectedInf) return [];

    const list = [];
    const seenNames = new Set();

    // 1. Depuis performanceHistory
    if (Array.isArray(selectedInf.performanceHistory)) {
      selectedInf.performanceHistory.forEach((h, idx) => {
        const campName = h.campaign || h.name || `Campagne #${idx + 1}`;
        seenNames.add(campName.toLowerCase());

        list.push({
          id: h.id || `HIST-${idx}-${campName.replace(/\s+/g, '_')}`,
          campaign: campName,
          brand: h.brand || h.marque || (campName.toLowerCase().includes('money') ? 'Orange Money' : campName.toLowerCase().includes('pulse') ? 'Pulse Orange' : 'Orange Cameroun'),
          status: h.status || 'terminee',
          dateDebut: h.dateDebut || '2026-01-10',
          dateFin: h.dateFin || '2026-02-10',
          dates: h.dates || (campName.includes('Mars') ? '01 Mars au 31 Mars 2026' : campName.includes('Fév') ? '01 Fév au 28 Fév 2026' : campName.includes('Jan') ? '01 Jan au 31 Jan 2026' : 'T1 2026'),
          networks: h.networks || (selectedInf.reseaux ? [...selectedInf.reseaux] : ['Instagram', 'TikTok']),
          contentTypes: h.contentTypes || ['Story', 'Reel / TikTok'],

          kpiReach: h.kpiReach || 150000,
          kpiTarget: h.kpiTarget || 120000,
          impressions: h.impressions || Math.round((h.kpiReach || 150000) * 1.32),
          kpiEngagement: h.kpiEngagement || 5.8,
          engagementTarget: h.engagementTarget || 5.0,
          clicks: h.clicks || Math.round((h.kpiReach || 150000) * 0.042),
          conversions: h.conversions || Math.round((h.kpiReach || 150000) * 0.005),
          salesVolume: h.salesVolume || 0,

          contentQuality: h.contentQuality || 4,
          onTime: h.onTime !== undefined ? h.onTime : true,
          variablePaid: h.variablePaid !== undefined ? h.variablePaid : 100,

          notesInternes: {
            noteGlobale: h.notesInternes?.noteGlobale || h.contentQuality || 4.2,
            fiabilite: h.notesInternes?.fiabilite || 4,
            qualiteCollaboration: h.notesInternes?.qualiteCollaboration || 4,
            respectDelais: h.notesInternes?.respectDelais || (h.onTime ? 5 : 3),
            commentaire: h.notesInternes?.commentaire || 'Campagne exécutée en accord avec les guidelines et objectifs Orange.',
            pointsForts: h.notesInternes?.pointsForts || ['Excellente affinité audience', 'Esthétique conforme à la charte'],
            axesAmelioration: h.notesInternes?.axesAmelioration || ['Optimiser les liens traqués dans les stories'],
          },

          livrables: h.livrables || [
            { id: `L-${idx}-1`, titre: `Story ${campName}`, type: 'Story', url: 'https://instagram.com/sample', statut: 'valide' },
            { id: `L-${idx}-2`, titre: `Reel ${campName}`, type: 'Reel / TikTok', url: 'https://instagram.com/reel/sample', statut: 'valide' }
          ],

          remuneration: {
            base: h.remuneration?.base || selectedInf.cachetBase || 1500000,
            variable: h.remuneration?.variable || (selectedInf.cachetVariable ? Math.round(selectedInf.cachetVariable * ((h.variablePaid || 100) / 100)) : 300000),
            avantages: h.remuneration?.avantages || 'Dotation forfait Pulse Data 5G illimité 3 mois + Goodies Orange',
          },

          contractInfo: {
            contratRef: h.contractInfo?.contratRef || `CTR-2026-${101 + idx}`,
            exclusivite: h.contractInfo?.exclusivite !== undefined ? h.contractInfo.exclusivite : false,
            droitsImage: h.contractInfo?.droitsImage || 'Droits digitaux 12 mois Cameroun & réseaux sociaux',
          }
        });
      });
    }

    // 2. Synchronisation depuis cahierDesCharges si la campagne n'est pas déjà dans l'historique
    if (Array.isArray(selectedInf.cahierDesCharges)) {
      selectedInf.cahierDesCharges.forEach((cdc, cIdx) => {
        const cdcName = cdc.campagneNom || `Cahier des charges #${cIdx + 1}`;
        if (!seenNames.has(cdcName.toLowerCase())) {
          seenNames.add(cdcName.toLowerCase());
          const cdcLivrables = Array.isArray(cdc.livrables) ? cdc.livrables : [];

          list.push({
            id: cdc.id || `CDC-HIST-${cIdx}`,
            campaign: cdcName,
            brand: cdc.produits?.[0] || 'Orange Cameroun',
            status: cdcLivrables.every(l => l.statut === 'valide') ? 'terminee' : 'en_cours',
            dateDebut: '2026-03-01',
            dateFin: '2026-04-30',
            dates: 'Campagne Active / En cours',
            networks: cdc.guidelineMarque?.mentions?.length ? ['Instagram', 'Facebook'] : ['Instagram', 'TikTok'],
            contentTypes: cdcLivrables.map(l => l.type).filter(Boolean) || ['Story', 'Reel'],

            kpiReach: 140000,
            kpiTarget: 150000,
            impressions: 185000,
            kpiEngagement: 6.2,
            engagementTarget: 5.5,
            clicks: 3900,
            conversions: 450,
            salesVolume: 0,

            contentQuality: 4,
            onTime: true,
            variablePaid: 100,

            notesInternes: {
              noteGlobale: 4.5,
              fiabilite: 5,
              qualiteCollaboration: 5,
              respectDelais: 4,
              commentaire: `Cahier des charges ${cdcName} avec ${cdcLivrables.length} livrable(s).`,
              pointsForts: ['Respect scrupuleux du brief de marque', 'Grande réactivité'],
              axesAmelioration: ['Maintenir la dynamique sur les stories'],
            },

            livrables: cdcLivrables.map(l => ({
              id: l.id,
              titre: l.titre,
              type: l.type,
              url: 'https://instagram.com',
              statut: l.statut || 'valide'
            })),

            remuneration: {
              base: selectedInf.cachetBase || 1500000,
              variable: selectedInf.cachetVariable || 400000,
              avantages: 'Pack goodies Pulse + 200 Go Data',
            },

            contractInfo: {
              contratRef: `CTR-CDC-${cIdx + 1}`,
              exclusivite: true,
              droitsImage: 'Droits complets réseaux sociaux & print Cameroun',
            }
          });
        }
      });
    }

    return list;
  }, [selectedInf]);

  // Filtrage des campagnes
  const filteredCampaigns = useMemo(() => {
    return consolidatedCampaigns.filter(c => {
      if (statusFilter !== 'all' && (c.status || 'terminee').toLowerCase() !== statusFilter) {
        return false;
      }
      if (brandFilter !== 'all' && (c.brand || '').toLowerCase() !== brandFilter.toLowerCase()) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = (c.campaign || '').toLowerCase().includes(q);
        const matchBrand = (c.brand || '').toLowerCase().includes(q);
        const matchNotes = (c.notesInternes?.commentaire || '').toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchNotes) return false;
      }
      return true;
    });
  }, [consolidatedCampaigns, statusFilter, brandFilter, searchTerm]);

  // Calcul des métriques globales de l'influenceur
  const summaryMetrics = useMemo(() => {
    const totalReach = consolidatedCampaigns.reduce((sum, c) => sum + (c.kpiReach || 0), 0);
    const avgEngagement = consolidatedCampaigns.length > 0
      ? (consolidatedCampaigns.reduce((sum, c) => sum + (c.kpiEngagement || 0), 0) / consolidatedCampaigns.length).toFixed(1)
      : '0.0';
    const totalPaid = consolidatedCampaigns.reduce((sum, c) => sum + (c.remuneration?.base || 0) + (c.remuneration?.variable || 0), 0);
    const avgRating = consolidatedCampaigns.length > 0
      ? (consolidatedCampaigns.reduce((sum, c) => sum + (c.notesInternes?.noteGlobale || c.contentQuality || 4), 0) / consolidatedCampaigns.length).toFixed(1)
      : '4.5';

    return { totalReach, avgEngagement, totalPaid, avgRating, count: consolidatedCampaigns.length };
  }, [consolidatedCampaigns]);

  // Actions de sauvegarde (création / modification)
  const handleSaveCampaign = (campaignData) => {
    if (!selectedInf) return;

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(selectedInf.id)) return inf;

      const currentHist = Array.isArray(inf.performanceHistory) ? [...inf.performanceHistory] : [];
      let updatedHist;

      if (modalState.campaignToEdit) {
        // Mise à jour existante
        const editKey = modalState.campaignToEdit.campaign;
        let found = false;
        updatedHist = currentHist.map(h => {
          if (h.campaign === editKey || h.id === modalState.campaignToEdit.id) {
            found = true;
            return { ...h, ...campaignData };
          }
          return h;
        });
        if (!found) {
          updatedHist.push(campaignData);
        }
      } else {
        // Ajout nouvelle campagne
        updatedHist = [campaignData, ...currentHist];
      }

      return {
        ...inf,
        campaigns: updatedHist.length,
        performanceHistory: updatedHist
      };
    }));

    showToast(modalState.campaignToEdit ? 'Campagne mise à jour avec succès !' : 'Nouvelle campagne ajoutée à l\'historique !');
    setModalState({ isOpen: false, campaignToEdit: null });
  };

  // Suppression d'une campagne
  const handleDeleteCampaign = (campaignToDelete) => {
    if (!confirm(`Supprimer la campagne "${campaignToDelete.campaign}" de l'historique de ${selectedInf.pseudo || selectedInf.name} ?`)) {
      return;
    }

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(selectedInf.id)) return inf;
      const updatedHist = (inf.performanceHistory || []).filter(h => (h.campaign !== campaignToDelete.campaign && h.id !== campaignToDelete.id));
      return {
        ...inf,
        campaigns: updatedHist.length,
        performanceHistory: updatedHist
      };
    }));

    showToast('Campagne retirée de l\'historique.');
  };

  // Export PDF pour l'ensemble ou une campagne
  const handleExportPdf = (singleCampaign = null) => {
    if (!selectedInf) return;
    try {
      const campsToExport = singleCampaign ? [singleCampaign] : filteredCampaigns;
      if (campsToExport.length === 0) {
        alert('Aucune campagne à exporter.');
        return;
      }
      const filename = exportCampaignHistoryToPdf(selectedInf, campsToExport, { singleCampaign });
      showToast(`Rapport PDF officiel Orange Cameroun généré (${filename})`);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la génération du PDF. Vérifiez la console.');
    }
  };

  // Ouverture du modal de partage
  const handleOpenShare = (campaign = null) => {
    setShareModalState({ isOpen: true, campaign });
  };

  if (!influencers || influencers.length === 0) {
    return (
      <div className="card text-center py-40" style={{ background: '#fff', border: '1px dashed #d0d7de', borderRadius: 12 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📜</div>
        <h3 className="text-lg font-bold text-dark mb-4">Aucun historique disponible</h3>
        <p className="text-sm text-muted mb-20 max-w-md mx-auto">
          Aucun influenceur n'est encore enregistré dans la base de données. Créez un profil dans l'onglet "1. Fiche Influence" pour consigner l'historique de ses collaborations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed bottom-24 right-24 z-50 p-12 px-20 rounded shadow-lg text-white font-semibold text-sm flex items-center gap-8"
          style={{ background: '#1A1A2E', borderLeft: '4px solid #FF7900' }}
        >
          <CheckCircle2 size={18} className="text-green" /> {toastMessage}
        </div>
      )}

      {/* ── EN-TÊTE PRINCIPAL ── */}
      <div className="flex flex-wrap justify-between items-center gap-12">
        <div>
          <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-8">
            📜 Historique des Campagnes Passées & Évaluations
          </h2>
          <p className="text-sm text-muted">
            Suivi exhaustif des collaborations Orange Cameroun : cahier des charges, résultats chiffrés, évaluations qualitatives, livrables et conditions contractuelles.
          </p>
        </div>

        <div className="flex items-center gap-8 flex-wrap">
          <button
            className="btn btn-ghost flex items-center gap-6"
            style={{ border: '1px solid #E1E4E8' }}
            onClick={() => handleExportPdf(null)}
            title="Exporter tout l'historique en PDF charté Orange Cameroun"
          >
            <FileDown size={16} className="text-orange" /> Exporter Bilan PDF
          </button>

          <button
            className="btn btn-ghost flex items-center gap-6"
            style={{ border: '1px solid #E1E4E8' }}
            onClick={() => handleOpenShare(null)}
            title="Partager l'historique complet par Mail, WhatsApp ou Teams"
          >
            <Share2 size={16} className="text-blue" /> Partager l'historique
          </button>

          <button
            className="btn btn-orange flex items-center gap-6"
            onClick={() => setModalState({ isOpen: true, campaignToEdit: null })}
          >
            <Plus size={16} /> Nouvelle campagne
          </button>
        </div>
      </div>

      {/* ── SÉLECTEUR D'INFLUENCEUR & FICHE D'IDENTITÉ ── */}
      <div
        className="card p-16 rounded-xl shadow-sm"
        style={{ background: '#ffffff', border: '1px solid #E1E4E8' }}
      >
        <div className="flex flex-wrap justify-between items-center gap-16 pb-16 border-b">
          <div className="flex items-center gap-12 flex-wrap">
            <span className="font-bold text-sm text-dark">Sélectionner un influenceur :</span>
            <select
              className="form-input font-bold"
              style={{ minWidth: 320, background: '#F8FAFC' }}
              value={selectedInfId}
              onChange={e => setSelectedInfId(e.target.value)}
            >
              {influencers.map(inf => {
                const count = (inf.performanceHistory?.length || 0) + (inf.cahierDesCharges?.length || 0);
                return (
                  <option key={inf.id} value={inf.id}>
                    @{inf.pseudo || inf.name} ({inf.realName || `${inf.prenom || ''} ${inf.nom || ''}`.trim() || 'Talent'}) — {count} campagne(s)
                  </option>
                );
              })}
            </select>
          </div>

          {selectedInf && (
            <div className="flex items-center gap-8 text-xs text-muted">
              <span>Audience : <strong className="text-dark">{selectedInf.followers || '250K'}</strong></span>
              <span>•</span>
              <span>Plateforme : <strong className="text-dark">{selectedInf.platform || 'Instagram'}</strong></span>
              <span>•</span>
              <span>Score global : <strong className="text-orange">{selectedInf.scorePerformance || selectedInf.score || 4.5}/5 ⭐</strong></span>
            </div>
          )}
        </div>

        {/* ── BANDEAU SYNTHÈSE EXÉCUTIVE DU TALENT ── */}
        <div className="grid grid-4 gap-12 pt-16">
          <div className="p-12 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #EAECEF' }}>
            <div className="text-xs text-muted mb-2 flex items-center justify-between">
              <span>Campagnes répertoriées</span>
              <Layers size={14} className="text-orange" />
            </div>
            <div className="text-xl font-bold text-dark">{summaryMetrics.count}</div>
            <div className="text-xs text-muted mt-2">Historique complet archivé</div>
          </div>

          <div className="p-12 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #EAECEF' }}>
            <div className="text-xs text-muted mb-2 flex items-center justify-between">
              <span>Portée totale cumulée</span>
              <TrendingUp size={14} className="text-green" />
            </div>
            <div className="text-xl font-bold text-dark">{formatNumber(summaryMetrics.totalReach)}</div>
            <div className="text-xs text-muted mt-2">Touchés par les activations</div>
          </div>

          <div className="p-12 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #EAECEF' }}>
            <div className="text-xs text-muted mb-2 flex items-center justify-between">
              <span>Taux d'engagement moyen</span>
              <Sparkles size={14} className="text-blue" />
            </div>
            <div className="text-xl font-bold text-dark">{summaryMetrics.avgEngagement}%</div>
            <div className="text-xs text-muted mt-2">Moyenne pondérée des posts</div>
          </div>

          <div className="p-12 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #EAECEF' }}>
            <div className="text-xs text-muted mb-2 flex items-center justify-between">
              <span>Note moyenne & Honoraires</span>
              <Award size={14} className="text-orange" />
            </div>
            <div className="text-xl font-bold text-orange">{summaryMetrics.avgRating} / 5 ⭐</div>
            <div className="text-xs text-muted mt-2">
              {summaryMetrics.totalPaid > 0 ? formatCurrency(summaryMetrics.totalPaid) : 'Sous contrat cadre'}
            </div>
          </div>
        </div>
      </div>

      {/* ── BARRE DE FILTRES ET RECHERCHE ── */}
      <div
        className="card p-12 rounded-lg flex flex-wrap items-center justify-between gap-12"
        style={{ background: '#ffffff', border: '1px solid #E1E4E8' }}
      >
        <div className="flex items-center gap-8 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-10 top-10 text-muted" />
            <input
              type="text"
              className="form-input pl-32 text-xs"
              placeholder="Rechercher par nom de campagne, marque, avis..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-8 flex-wrap">
          {/* Filtre Marque */}
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted font-medium">Marque :</span>
            <select
              className="form-input text-xs"
              style={{ width: 170 }}
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}
            >
              <option value="all">Toutes les marques</option>
              <option value="Orange Cameroun">Orange Cameroun</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Pulse Orange">Pulse Orange</option>
              <option value="Maxit Super App">Maxit Super App</option>
              <option value="Orange Fibre Optique">Orange Fibre Optique</option>
            </select>
          </div>

          {/* Filtre Statut */}
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted font-medium">Statut :</span>
            <select
              className="form-input text-xs"
              style={{ width: 150 }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="terminee">Terminée</option>
              <option value="en_cours">En cours</option>
              <option value="reportee">Reportée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── LISTE DES CARTES DE CAMPAGNES ── */}
      {filteredCampaigns.length === 0 ? (
        <div
          className="card text-center py-40 rounded-xl"
          style={{ background: '#ffffff', border: '1px dashed #D0D7DE' }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <h3 className="text-base font-bold text-dark mb-4">Aucune campagne ne correspond aux critères</h3>
          <p className="text-xs text-muted mb-16 max-w-sm mx-auto">
            Ajustez vos filtres de recherche ou ajoutez une nouvelle campagne historique pour ce talent.
          </p>
          <button
            className="btn btn-orange btn-sm"
            onClick={() => setModalState({ isOpen: true, campaignToEdit: null })}
          >
            + Ajouter une campagne historique
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {filteredCampaigns.map((camp, idx) => (
            <CampaignHistoryCard
              key={camp.id || idx}
              campaign={camp}
              index={idx}
              onEdit={(c) => setModalState({ isOpen: true, campaignToEdit: c })}
              onDelete={handleDeleteCampaign}
              onExportPdf={(c) => handleExportPdf(c)}
              onShare={(c) => handleOpenShare(c)}
            />
          ))}
        </div>
      )}

      {/* ── MODALE CRÉATION / MODIFICATION D'UNE CAMPAGNE ── */}
      {modalState.isOpen && selectedInf && (
        <CampaignHistoryModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, campaignToEdit: null })}
          onSave={handleSaveCampaign}
          influencer={selectedInf}
          campaignToEdit={modalState.campaignToEdit}
        />
      )}

      {/* ── MODALE PARTAGE MULTI-CANAL (MAIL, WHATSAPP, TEAMS) ── */}
      {shareModalState.isOpen && selectedInf && (
        <CampaignHistoryShareModal
          isOpen={shareModalState.isOpen}
          onClose={() => setShareModalState({ isOpen: false, campaign: null })}
          influencer={selectedInf}
          campaign={shareModalState.campaign}
          allCampaigns={filteredCampaigns}
        />
      )}
    </div>
  );
}
