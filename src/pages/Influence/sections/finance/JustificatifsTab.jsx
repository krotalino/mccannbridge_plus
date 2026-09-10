import { useState, useMemo } from 'react';
import { 
  FileCheck, 
  UploadCloud, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  FileText, 
  Image, 
  Search, 
  Filter,
  ShieldCheck,
  AlertTriangle,
  Eye,
  Trash2
} from 'lucide-react';
import JustificatifModal from './JustificatifModal.jsx';

export default function JustificatifsTab({ influencer, influencers, setInfluencers }) {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const contracts = influencer?.contracts || [];

  const campaignsList = useMemo(() => {
    const list = [];
    if (Array.isArray(influencer?.performanceHistory)) {
      influencer.performanceHistory.forEach((h, idx) => {
        list.push({
          id: h.id || `HIST-${idx}`,
          campaign: h.campaign || h.name || `Campagne #${idx + 1}`
        });
      });
    }
    if (Array.isArray(influencer?.cahierDesCharges)) {
      influencer.cahierDesCharges.forEach((c) => {
        if (!list.some(l => l.campaign === c.campagneNom)) {
          list.push({
            id: c.campagneId || c.id,
            campaign: c.campagneNom
          });
        }
      });
    }
    return list;
  }, [influencer]);

  // Agrégation synchronisée des pièces justificatives :
  // Inclut les pièces de `influencer.piecesJustificatives`, plus automatiquement `documentsLegaux.pieceIdentite` et `documentsLegaux.rib` pour éviter tout doublon !
  const pieces = useMemo(() => {
    const list = [];

    // 1. CNI / Pièce d'identité depuis documentsLegaux
    if (influencer?.documentsLegaux?.pieceIdentite?.present) {
      list.push({
        id: 'LEG-CNI',
        type: 'cni',
        titre: 'Pièce d\'Identité Officielle (CNI / Passeport)',
        campagne: 'Général / Administratif',
        contratRef: 'Dossier Talent',
        dateAjout: influencer.documentsLegaux.pieceIdentite.uploadDate || '2026-01-10',
        fichierNom: influencer.documentsLegaux.pieceIdentite.nom || 'CNI_Officielle.pdf',
        fichierTaille: '2.4 Mo',
        statutValidation: 'valide',
        validePar: 'Cellule Juridique McCann',
        commentaire: 'Identité vérifiée et conforme aux registres légaux.',
        isLegalBase: true
      });
    }

    // 2. RIB depuis documentsLegaux
    if (influencer?.documentsLegaux?.rib?.present) {
      list.push({
        id: 'LEG-RIB',
        type: 'rib',
        titre: 'Relevé d\'Identité Bancaire (RIB)',
        campagne: 'Général / Comptabilité',
        contratRef: 'Dossier Talent',
        dateAjout: influencer.documentsLegaux.rib.uploadDate || '2026-01-10',
        fichierNom: influencer.documentsLegaux.rib.nom || 'RIB_Virement.pdf',
        fichierTaille: '1.1 Mo',
        statutValidation: 'valide',
        validePar: 'Service Comptabilité Orange',
        commentaire: 'Coordonnées bancaires domiciliées au Cameroun conformes pour virement.',
        isLegalBase: true
      });
    }

    // 3. Autres documents déjà enregistrés dans documentsLegaux.autresDocuments
    if (Array.isArray(influencer?.documentsLegaux?.autresDocuments)) {
      influencer.documentsLegaux.autresDocuments.forEach((d, idx) => {
        list.push({
          id: `LEG-AUTRE-${idx}`,
          type: 'autre',
          titre: d.nom,
          campagne: 'Général',
          contratRef: 'Dossier Talent',
          dateAjout: d.uploadDate || '2026-02-01',
          fichierNom: d.nom,
          fichierTaille: '1.8 Mo',
          statutValidation: 'valide',
          validePar: 'Equipe Marque',
          commentaire: 'Document annexe rattaché.',
          isLegalBase: true
        });
      });
    }

    // 4. Pièces justificatives enrichies spécifiques
    if (Array.isArray(influencer?.piecesJustificatives)) {
      influencer.piecesJustificatives.forEach(pj => {
        list.push(pj);
      });
    } else {
      // Données de départ représentatives pour les tests
      const lastCamp = influencer?.lastCampaign || 'Orange Weekend Mars';
      list.push({
        id: 'PJ-001',
        type: 'contrat_signe',
        titre: `Contrat de Partenariat Signé — ${lastCamp}`,
        campagne: lastCamp,
        contratRef: contracts[0]?.id || 'CTR-001',
        dateAjout: '2026-02-15',
        fichierNom: `Contrat_Signe_${influencer?.pseudo || 'Influenceur'}_${lastCamp.replace(/\s+/g, '_')}.pdf`,
        fichierTaille: '3.8 Mo',
        statutValidation: 'valide',
        validePar: 'Direction Juridique Orange',
        commentaire: 'Paraphé et signé avec clauses de confidentialité et exclusivité.'
      });

      list.push({
        id: 'PJ-002',
        type: 'justificatif_publication',
        titre: `Captures & Statistiques Certifiées Instagram (Story + Reel)`,
        campagne: lastCamp,
        contratRef: contracts[0]?.id || 'CTR-001',
        dateAjout: '2026-03-25',
        fichierNom: `Screenshots_Stats_${lastCamp.replace(/\s+/g, '_')}.pdf`,
        fichierTaille: '8.4 Mo',
        statutValidation: 'valide',
        validePar: 'Pôle Média Digital',
        commentaire: 'Reach et impressions vérifiés sur Meta Business Suite.'
      });

      list.push({
        id: 'PJ-003',
        type: 'rapport_campagne',
        titre: `Rapport de Clôture de Campagne & Analyse ROI`,
        campagne: lastCamp,
        contratRef: contracts[0]?.id || 'CTR-001',
        dateAjout: '2026-03-28',
        fichierNom: `Rapport_Performance_${lastCamp.replace(/\s+/g, '_')}.pdf`,
        fichierTaille: '4.2 Mo',
        statutValidation: 'valide',
        validePar: 'Contrôle de Gestion McCann',
        commentaire: 'Objectifs de portée dépassés à 120%.'
      });
    }

    return list;
  }, [influencer, contracts]);

  // Filtrage
  const filteredPieces = useMemo(() => {
    return pieces.filter(p => {
      if (filterType !== 'all' && p.type !== filterType) return false;
      if (filterStatus !== 'all' && p.statutValidation !== filterStatus) return false;
      return true;
    });
  }, [pieces, filterType, filterStatus]);

  // KPIs
  const totalDocs = pieces.length;
  const totalValides = pieces.filter(p => p.statutValidation === 'valide').length;
  const totalEnAttente = pieces.filter(p => p.statutValidation === 'en_attente').length;
  const totalRejetes = pieces.filter(p => p.statutValidation === 'rejete').length;

  const handleSaveJustificatif = (newDoc) => {
    if (!setInfluencers) return;

    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const current = Array.isArray(inf.piecesJustificatives) ? [...inf.piecesJustificatives] : pieces.filter(p => !p.isLegalBase);
      current.unshift(newDoc);

      // Si c'est un RIB ou une CNI, synchroniser aussi documentsLegaux
      const docsLegaux = { ...(inf.documentsLegaux || {}) };
      if (newDoc.type === 'cni') {
        docsLegaux.pieceIdentite = { nom: newDoc.fichierNom, uploadDate: newDoc.dateAjout, present: true };
      } else if (newDoc.type === 'rib') {
        docsLegaux.rib = { nom: newDoc.fichierNom, uploadDate: newDoc.dateAjout, present: true };
      }

      return {
        ...inf,
        piecesJustificatives: current,
        documentsLegaux: docsLegaux
      };
    }));

    setIsModalOpen(false);
  };

  const handleUpdateStatus = (docId, newStatus) => {
    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const current = Array.isArray(inf.piecesJustificatives) ? [...inf.piecesJustificatives] : pieces.filter(p => !p.isLegalBase);
      const updated = current.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            statutValidation: newStatus,
            validePar: newStatus === 'valide' ? 'Equipe Finance McCann' : null
          };
        }
        return d;
      });

      return {
        ...inf,
        piecesJustificatives: updated
      };
    }));
  };

  const handleDeleteJustificatif = (docId) => {
    if (!confirm('Supprimer cette pièce justificative ?')) return;
    setInfluencers(prev => prev.map(inf => {
      if (String(inf.id) !== String(influencer.id)) return inf;
      const current = Array.isArray(inf.piecesJustificatives) ? [...inf.piecesJustificatives] : pieces.filter(p => !p.isLegalBase);
      return {
        ...inf,
        piecesJustificatives: current.filter(p => p.id !== docId)
      };
    }));
  };

  const getTypeBadge = (type) => {
    const config = {
      contrat_signe: { label: '📑 Contrat signé', color: 'var(--blue, #2980B9)', bg: 'rgba(41, 128, 185, 0.1)' },
      facture: { label: '💰 Facture', color: 'var(--green, #27AE60)', bg: 'rgba(39, 174, 96, 0.1)' },
      preuve_livraison: { label: '📦 Preuve de livraison', color: 'var(--orange, #FF7900)', bg: 'rgba(255, 121, 0, 0.1)' },
      rapport_campagne: { label: '📊 Rapport de campagne', color: '#8E44AD', bg: 'rgba(142, 68, 173, 0.1)' },
      justificatif_publication: { label: '📸 Justificatif publication', color: '#16A085', bg: 'rgba(22, 160, 133, 0.1)' },
      rib: { label: '🏦 RIB bancaire', color: 'var(--dark, #1A1A1A)', bg: '#f0f0f0' },
      cni: { label: '🪪 Pièce d\'identité', color: 'var(--dark, #1A1A1A)', bg: '#f0f0f0' },
      autre: { label: '📎 Autre', color: '#666', bg: '#f5f5f5' }
    }[type] || { label: type, color: '#555', bg: '#eee' };

    return (
      <span className="tag text-xxs font-bold" style={{ background: config.bg, color: config.color }}>
        {config.label}
      </span>
    );
  };

  return (
    <div>
      {/* 1. KPIs Statut Conformité */}
      <div className="grid grid-4 gap-12 mb-20">
        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--blue, #2980B9)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider">Total Pièces Justificatives</div>
          <div className="text-xl font-extrabold text-dark mt-6">{totalDocs} document(s)</div>
          <div className="text-xxs text-muted mt-4">Dossier administratif & financier complet</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--green, #27AE60)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider">Pièces Validées / Conformes</div>
          <div className="text-xl font-extrabold text-green mt-6">{totalValides} conformes ✓</div>
          <div className="text-xxs text-muted mt-4">Contrôlées par la finance & juridique</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--orange, #FF7900)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider">En Attente de Validation</div>
          <div className="text-xl font-extrabold text-orange mt-6">{totalEnAttente} en revue ⏳</div>
          <div className="text-xxs text-muted mt-4">Nécessite vérification avant mise en paiement</div>
        </div>

        <div className="card shadow-sm p-14 border-l-4" style={{ borderLeftColor: 'var(--red, #E74C3C)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider">Rejetés / Non Conformes</div>
          <div className="text-xl font-extrabold text-red mt-6">{totalRejetes} rejeté(s) ✕</div>
          <div className="text-xxs text-muted mt-4">Pièces manquantes ou illisibles</div>
        </div>
      </div>

      {/* 2. Filtres & Ajout */}
      <div className="card mb-20">
        <div className="flex flex-wrap justify-between items-center gap-12 mb-16">
          <div>
            <h3 className="text-md font-bold text-dark m-0">Pièces Justificatives & Dossier de Preuves</h3>
            <p className="text-xs text-muted m-0">Contrats signés, factures certifiées, preuves de livraison, captures statistiques et rapports</p>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            {/* Filtre Type */}
            <select
              className="form-input text-xs py-4"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{ width: 170 }}
            >
              <option value="all">Tous les types</option>
              <option value="contrat_signe">Contrats signés</option>
              <option value="facture">Factures</option>
              <option value="justificatif_publication">Justificatifs de publication</option>
              <option value="preuve_livraison">Preuves de livraison</option>
              <option value="rapport_campagne">Rapports de campagne</option>
              <option value="rib">RIB Bancaire</option>
              <option value="cni">CNI / Passeport</option>
            </select>

            {/* Filtre Statut */}
            <select
              className="form-input text-xs py-4"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ width: 140 }}
            >
              <option value="all">Tous les statuts</option>
              <option value="valide">Validé ✓</option>
              <option value="en_attente">En attente ⏳</option>
              <option value="rejete">Rejeté ✕</option>
            </select>

            {/* Bouton Téléverser */}
            <button
              type="button"
              className="btn btn-orange btn-sm text-xs font-bold flex items-center gap-6"
              style={{ background: 'var(--orange, #FF7900)', color: '#fff' }}
              onClick={() => setIsModalOpen(true)}
            >
              <UploadCloud size={15} />
              <span>Ajouter un Justificatif</span>
            </button>
          </div>
        </div>

        {/* Tableau des pièces justificatives */}
        <div className="overflow-x-auto">
          <table className="table w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs text-muted" style={{ background: '#f8f9fa' }}>
                <th className="py-8 px-10">Titre & Type de Document</th>
                <th className="py-8 px-10">Campagne Associée</th>
                <th className="py-8 px-10">Fichier Joint & Taille</th>
                <th className="py-8 px-10">Date d'Ajout</th>
                <th className="py-8 px-10 text-center">Statut Conformité</th>
                <th className="py-8 px-10">Validateur / Remarques</th>
                <th className="py-8 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPieces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center text-muted text-xs">
                    Aucune pièce justificative répertoriée pour ces critères.
                  </td>
                </tr>
              ) : (
                filteredPieces.map((p, idx) => {
                  const isValide = p.statutValidation === 'valide';
                  const isEnAttente = p.statutValidation === 'en_attente';

                  return (
                    <tr key={p.id || idx} className="border-b text-xs hover:bg-gray-50" style={{ borderColor: '#f1f1f1' }}>
                      <td className="py-10 px-10">
                        <div className="font-bold text-dark flex items-center gap-6">
                          <FileText size={15} className="text-orange" />
                          <span>{p.titre}</span>
                        </div>
                        <div className="mt-4">{getTypeBadge(p.type)}</div>
                      </td>
                      <td className="py-10 px-10">
                        <div className="font-semibold text-dark">{p.campagne}</div>
                        <div className="text-xxs text-muted">{p.contratRef}</div>
                      </td>
                      <td className="py-10 px-10">
                        <div className="font-mono text-xs text-dark">{p.fichierNom}</div>
                        <div className="text-xxs text-muted">{p.fichierTaille}</div>
                      </td>
                      <td className="py-10 px-10 text-muted">
                        {p.dateAjout}
                      </td>
                      <td className="py-10 px-10 text-center">
                        <span
                          className="tag text-xxs font-bold"
                          style={{
                            background: isValide ? 'rgba(39, 174, 96, 0.1)' : isEnAttente ? 'rgba(255, 121, 0, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                            color: isValide ? 'var(--green, #27AE60)' : isEnAttente ? 'var(--orange, #FF7900)' : 'var(--red, #E74C3C)'
                          }}
                        >
                          {isValide ? 'Validé ✓' : isEnAttente ? 'En attente ⏳' : 'Rejeté ✕'}
                        </span>
                      </td>
                      <td className="py-10 px-10 text-xs">
                        <div className="text-dark font-medium">{p.validePar || '—'}</div>
                        {p.commentaire && (
                          <div className="text-xxs text-muted italic mt-2">{p.commentaire}</div>
                        )}
                      </td>
                      <td className="py-10 px-10 text-right">
                        <div className="flex justify-end items-center gap-6">
                          {/* Télécharger / Aperçu */}
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm p-4 text-orange border flex items-center gap-4 text-xxs font-bold"
                            onClick={() => setPreviewDoc(p)}
                            title="Consulter la pièce justificative"
                          >
                            <Eye size={13} />
                            <span>Voir</span>
                          </button>

                          {/* Action Validation Rapide */}
                          {!p.isLegalBase && (
                            <>
                              {p.statutValidation !== 'valide' && (
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm p-4 text-green"
                                  onClick={() => handleUpdateStatus(p.id, 'valide')}
                                  title="Marquer comme Validé"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              {p.statutValidation !== 'rejete' && (
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm p-4 text-red"
                                  onClick={() => handleUpdateStatus(p.id, 'rejete')}
                                  title="Marquer comme Rejeté"
                                >
                                  <XCircle size={16} />
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm p-4 text-muted hover:text-red"
                                onClick={() => handleDeleteJustificatif(p.id)}
                                title="Supprimer ce document"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
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

      {/* Modal Aperçu Pièce Justificative */}
      {previewDoc && (
        <div className="inf-modal-overlay" onClick={() => setPreviewDoc(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1060, padding: 16
        }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 520, background: '#fff', borderRadius: 12, padding: 24
          }}>
            <div className="flex justify-between items-center pb-12 mb-16 border-b">
              <div className="flex items-center gap-8">
                <FileCheck size={20} className="text-orange" />
                <h3 className="font-bold text-lg text-dark m-0">Aperçu Pièce Justificative</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setPreviewDoc(null)}>✕</button>
            </div>

            <div className="p-16 border rounded bg-light mb-16 text-center">
              <div style={{ fontSize: 44, marginBottom: 8 }}>📄</div>
              <h4 className="font-bold text-dark text-sm mb-4">{previewDoc.titre}</h4>
              <div className="text-xs text-muted mb-8">{previewDoc.fichierNom} ({previewDoc.fichierTaille})</div>
              <div>{getTypeBadge(previewDoc.type)}</div>
            </div>

            <div className="text-xs space-y-8 mb-16">
              <div className="flex justify-between">
                <span className="text-muted">Campagne :</span>
                <span className="font-bold text-dark">{previewDoc.campagne}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Date de dépôt :</span>
                <span className="font-semibold text-dark">{previewDoc.dateAjout}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Statut de validation :</span>
                <span className="font-bold text-green">{previewDoc.statutValidation}</span>
              </div>
              {previewDoc.commentaire && (
                <div className="p-8 rounded bg-gray-50 border text-muted italic">
                  "{previewDoc.commentaire}"
                </div>
              )}
            </div>

            <div className="flex justify-end gap-8">
              <button
                type="button"
                className="btn btn-orange btn-sm flex items-center gap-6"
                onClick={() => {
                  alert(`Téléchargement de la pièce jointe : ${previewDoc.fichierNom}`);
                  setPreviewDoc(null);
                }}
              >
                <Download size={15} />
                <span>Télécharger le document</span>
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setPreviewDoc(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajout */}
      {isModalOpen && (
        <JustificatifModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveJustificatif}
          influencer={influencer}
          campaigns={campaignsList}
          contracts={contracts}
        />
      )}
    </div>
  );
}
