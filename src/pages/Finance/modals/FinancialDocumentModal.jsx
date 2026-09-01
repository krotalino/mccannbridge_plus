import { useState, useEffect, useMemo } from 'react';
import { 
  DOCUMENT_TYPES, 
  DOCUMENT_STATUSES, 
  PAYMENT_MODES, 
  CAMPAIGN_PRESETS, 
  TVA_RATES, 
  generateDocumentReference, 
  calculateDocumentTotals, 
  numberToFrenchWords 
} from '../../../utils/financialUtils';

const FMT = (n) => (n !== undefined && n !== null ? Number(n).toLocaleString('fr-FR') : '0');

export default function FinancialDocumentModal({ isOpen, onClose, onSave, initialData, defaultType = 'BC', existingDocs = [] }) {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'items' | 'payment' | 'preview'
  const [docType, setDocType] = useState(defaultType);
  const [withholdingTaxActive, setWithholdingTaxActive] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    reference: '',
    campagne: CAMPAIGN_PRESETS[0],
    dateEmission: new Date().toISOString().split('T')[0],
    dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    statut: 'En validation',
    client: '',
    thirdParty: {
      name: '',
      rccm: 'RC/DLA/2020/B/123 - M051200045678W',
      phone: '+237 699 00 11 22',
      address: 'Boulevard de la Liberté, Akwa, Douala',
    },
    items: [
      {
        id: 'item-1',
        description: 'Prestation de communication digitale & production créative',
        quantity: 1,
        unitPrice: 5000000,
        discount: 0,
        tvaRate: 0.1925,
      }
    ],
    modeReglement: PAYMENT_MODES[0],
    etablissementBancaire: 'Société Générale Cameroun (SGBC)',
    rib: 'CM21 1000 2000 3000 4000 5000 12',
    notes: 'Mention de l\'avenant, retenue à la source 5.5%, référence du bon de commande initial...',
    pieces: ['document_justificatif.pdf'],
  });

  // Initialize or reset form data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDocType(initialData.type || defaultType);
        setFormData({
          id: initialData.id || '',
          reference: initialData.reference || generateDocumentReference(initialData.type || defaultType, existingDocs),
          campagne: initialData.campagne || CAMPAIGN_PRESETS[0],
          dateEmission: initialData.dateEmission || new Date().toISOString().split('T')[0],
          dateEcheance: initialData.dateEcheance || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          statut: initialData.statut || 'En validation',
          client: initialData.client || initialData.thirdParty?.name || '',
          thirdParty: {
            name: initialData.thirdParty?.name || initialData.client || '',
            rccm: initialData.thirdParty?.rccm || 'RC/DLA/2020/B/123 - M051200045678W',
            phone: initialData.thirdParty?.phone || '+237 699 00 11 22',
            address: initialData.thirdParty?.address || 'Boulevard de la Liberté, Akwa, Douala',
          },
          items: initialData.items && initialData.items.length > 0 ? initialData.items : [
            {
              id: 'item-1',
              description: 'Prestation & déploiement de campagne',
              quantity: 1,
              unitPrice: initialData.montantHT || initialData.montantTTC || 5000000,
              discount: 0,
              tvaRate: 0.1925,
            }
          ],
          modeReglement: initialData.modeReglement || PAYMENT_MODES[0],
          etablissementBancaire: initialData.etablissementBancaire || 'Société Générale Cameroun (SGBC)',
          rib: initialData.rib || 'CM21 1000 2000 3000 4000 5000 12',
          notes: initialData.notes || 'Mention de l\'avenant, retenue à la source 5.5%...',
          pieces: Array.isArray(initialData.pieces) ? initialData.pieces : (typeof initialData.pieces === 'string' && initialData.pieces !== '—' ? [initialData.pieces] : ['document_justificatif.pdf']),
        });
      } else {
        const initialRef = generateDocumentReference(defaultType, existingDocs);
        setDocType(defaultType);
        setFormData({
          id: '',
          reference: initialRef,
          campagne: CAMPAIGN_PRESETS[0],
          dateEmission: new Date().toISOString().split('T')[0],
          dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          statut: 'En validation',
          client: defaultType.includes('FC') || defaultType.includes('DEV') || defaultType.includes('PRO') ? 'Orange Cameroun SA' : 'Studio Havas Media',
          thirdParty: {
            name: defaultType.includes('FC') || defaultType.includes('DEV') || defaultType.includes('PRO') ? 'Orange Cameroun SA' : 'Studio Havas Media',
            rccm: 'RC/DLA/2020/B/123 - M051200045678W',
            phone: '+237 699 00 11 22',
            address: 'Boulevard de la Liberté, Akwa, Douala',
          },
          items: [
            {
              id: 'item-1',
              description: 'Production spots TV & activations digitales',
              quantity: 1,
              unitPrice: 15000000,
              discount: 0,
              tvaRate: 0.1925,
            }
          ],
          modeReglement: PAYMENT_MODES[0],
          etablissementBancaire: 'Société Générale Cameroun (SGBC)',
          rib: 'CM21 1000 2000 3000 4000 5000 12',
          notes: 'Mention de l\'avenant, retenue à la source 5.5%, référence du bon de commande initial...',
          pieces: ['devis_valide_prestation.pdf'],
        });
      }
      setActiveTab('general');
    }
  }, [isOpen, initialData, defaultType]);

  // Handle Type Change from header selector
  const handleTypeChange = (newType) => {
    setDocType(newType);
    if (!initialData) {
      setFormData(prev => ({
        ...prev,
        reference: generateDocumentReference(newType, existingDocs)
      }));
    }
  };

  // Calculations
  const totals = useMemo(() => {
    return calculateDocumentTotals(formData.items, withholdingTaxActive, 0.055);
  }, [formData.items, withholdingTaxActive]);

  // Dynamic Item Handlers
  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tvaRate: 0.1925,
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleUpdateItem = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(it => it.id === id ? { ...it, [field]: value } : it)
    }));
  };

  const handleRemoveItem = (id) => {
    if (formData.items.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id !== id)
    }));
  };

  const handleAddPiece = () => {
    const name = prompt('Nom de la pièce jointe (ex: facture_signee.pdf, bordereau.png) :');
    if (name && name.trim()) {
      setFormData(prev => ({
        ...prev,
        pieces: [...prev.pieces, name.trim()]
      }));
    }
  };

  const handleRemovePiece = (idx) => {
    setFormData(prev => ({
      ...prev,
      pieces: prev.pieces.filter((_, i) => i !== idx)
    }));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const currentTypeObj = DOCUMENT_TYPES.find(t => t.id === docType || t.label === docType) || DOCUMENT_TYPES[0];

    const finalDoc = {
      ...formData,
      id: formData.id || `fin-${Date.now()}`,
      type: currentTypeObj.id,
      typeLabel: currentTypeObj.label,
      client: formData.thirdParty?.name || formData.client || 'Client Non Renseigné',
      montantHT: totals.netHT,
      montantRemise: totals.totalDiscount,
      montantTVA: totals.totalTVA,
      montantTTC: totals.totalTTC,
      withholdingTax: totals.withholdingTax,
      inWords: totals.inWords,
    };

    onSave(finalDoc);
    onClose();
  };

  if (!isOpen) return null;

  const currentTypeConfig = DOCUMENT_TYPES.find(t => t.id === docType || t.label === docType) || DOCUMENT_TYPES[0];

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16,
    }}>
      <div className="fin-modal-card animate-scale-up" style={{
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: 1050,
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Top Dark Header */}
        <div style={{
          background: '#16213E',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #FF7900 0%, #E06800 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 4px 12px rgba(255, 121, 0, 0.35)'
            }}>
              {currentTypeConfig.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#FF7900', textTransform: 'uppercase' }}>
                {initialData ? 'ÉDITION DOCUMENT FINANCIER' : 'CRÉATION / ÉDITION'}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {currentTypeConfig.label} — <span style={{ color: '#FF7900' }}>{formData.reference}</span>
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <select
                value={docType}
                onChange={(e) => handleTypeChange(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {DOCUMENT_TYPES.map(t => (
                  <option key={t.id} value={t.id} style={{ background: '#16213E', color: '#ffffff' }}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#ffffff',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div style={{
          display: 'flex',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 24px',
          gap: 8
        }}>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              padding: '14px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: 13,
              fontWeight: 700,
              color: activeTab === 'general' ? '#FF7900' : '#64748b',
              borderBottom: activeTab === 'general' ? '3px solid #FF7900' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            📋 Informations Générales
          </button>

          <button
            onClick={() => setActiveTab('items')}
            style={{
              padding: '14px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: 13,
              fontWeight: 700,
              color: activeTab === 'items' ? '#FF7900' : '#64748b',
              borderBottom: activeTab === 'items' ? '3px solid #FF7900' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            📦 Articles & Prestations ({formData.items.length})
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            style={{
              padding: '14px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: 13,
              fontWeight: 700,
              color: activeTab === 'payment' ? '#FF7900' : '#64748b',
              borderBottom: activeTab === 'payment' ? '3px solid #FF7900' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            💳 Paiement & Facturation
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '14px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: 13,
              fontWeight: 700,
              color: activeTab === 'preview' ? '#FF7900' : '#64748b',
              borderBottom: activeTab === 'preview' ? '3px solid #FF7900' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            📄 Prévisualisation / PDF
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* TAB 1: INFORMATIONS GÉNÉRALES */}
          {activeTab === 'general' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              {/* Box 1: En-tête & Identifiants */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  1. En-tête & Identifiants
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Référence du Document *
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none'
                      }}
                      placeholder="ex: BC-2026-3556"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Campagne / Projet Associé
                    </label>
                    <select
                      value={formData.campagne}
                      onChange={(e) => setFormData({ ...formData, campagne: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 14,
                        color: '#0f172a',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    >
                      {CAMPAIGN_PRESETS.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                        Date d'Émission *
                      </label>
                      <input
                        type="date"
                        value={formData.dateEmission}
                        onChange={(e) => setFormData({ ...formData, dateEmission: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                        Date d'Échéance *
                      </label>
                      <input
                        type="date"
                        value={formData.dateEcheance}
                        onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Statut du Document
                    </label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1.5px solid #FF7900',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    >
                      {DOCUMENT_STATUSES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Box 2: Coordonnées Tiers */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  2. Coordonnées Fournisseur / Prestataire / Client
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Nom / Raison Sociale *
                    </label>
                    <input
                      type="text"
                      value={formData.thirdParty.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        client: e.target.value,
                        thirdParty: { ...formData.thirdParty, name: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                      placeholder="ex: Orange Cameroun SA, Studio Havas, MTN..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                        N° RCCM & NIU (Fiscal)
                      </label>
                      <input
                        type="text"
                        value={formData.thirdParty.rccm}
                        onChange={(e) => setFormData({
                          ...formData,
                          thirdParty: { ...formData.thirdParty, rccm: e.target.value }
                        })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          fontSize: 13,
                          outline: 'none'
                        }}
                        placeholder="ex: RC/DLA/2020/B/123 - M05..."
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                        Téléphone / Contact
                      </label>
                      <input
                        type="text"
                        value={formData.thirdParty.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          thirdParty: { ...formData.thirdParty, phone: e.target.value }
                        })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          fontSize: 13,
                          outline: 'none'
                        }}
                        placeholder="+237 699 00 11 22"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Adresse Géographique
                    </label>
                    <input
                      type="text"
                      value={formData.thirdParty.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        thirdParty: { ...formData.thirdParty, address: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 13,
                        outline: 'none'
                      }}
                      placeholder="Boulevard de la Liberté, Akwa, Douala"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLES & PRESTATIONS */}
          {activeTab === 'items' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', margin: 0, textTransform: 'uppercase' }}>
                  LIGNES DE PRESTATIONS & DÉCOMPTE FISCAL (CEMAC)
                </h4>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn btn-green btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span>+</span> Ajouter une ligne
                </button>
              </div>

              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                overflow: 'hidden',
                marginBottom: 20,
                background: '#ffffff'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                      <th style={{ padding: '10px 14px', width: '38%' }}>DÉSIGNATION / PRESTATION</th>
                      <th style={{ padding: '10px 10px', width: '10%', textAlign: 'center' }}>QTÉ</th>
                      <th style={{ padding: '10px 12px', width: '18%', textAlign: 'right' }}>P.U. HT (FCFA)</th>
                      <th style={{ padding: '10px 10px', width: '10%', textAlign: 'center' }}>REMISE %</th>
                      <th style={{ padding: '10px 10px', width: '14%', textAlign: 'center' }}>TVA</th>
                      <th style={{ padding: '10px 12px', width: '15%', textAlign: 'right' }}>TOTAL HT</th>
                      <th style={{ padding: '10px 8px', width: '5%', textAlign: 'center' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, idx) => {
                      const gross = (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0);
                      const discountVal = gross * ((Number(item.discount) || 0) / 100);
                      const net = gross - discountVal;

                      return (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 14px' }}>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                              placeholder="Description de la prestation..."
                              style={{
                                width: '100%',
                                padding: '6px 10px',
                                border: '1px solid #cbd5e1',
                                borderRadius: 6,
                                fontSize: 13,
                                outline: 'none'
                              }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #cbd5e1',
                                borderRadius: 6,
                                fontSize: 13,
                                textAlign: 'center',
                                outline: 'none'
                              }}
                            />
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <input
                              type="number"
                              min="0"
                              step="50000"
                              value={item.unitPrice}
                              onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Math.max(0, parseInt(e.target.value, 10) || 0))}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #cbd5e1',
                                borderRadius: 6,
                                fontSize: 13,
                                textAlign: 'right',
                                fontWeight: 600,
                                outline: 'none'
                              }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.discount}
                              onChange={(e) => handleUpdateItem(item.id, 'discount', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #cbd5e1',
                                borderRadius: 6,
                                fontSize: 13,
                                textAlign: 'center',
                                outline: 'none'
                              }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <select
                              value={item.tvaRate}
                              onChange={(e) => handleUpdateItem(item.id, 'tvaRate', parseFloat(e.target.value))}
                              style={{
                                width: '100%',
                                padding: '6px 6px',
                                border: '1px solid #cbd5e1',
                                borderRadius: 6,
                                fontSize: 12,
                                outline: 'none',
                                background: '#ffffff'
                              }}
                            >
                              {TVA_RATES.map((t, ti) => (
                                <option key={ti} value={t.rate}>{t.rate === 0.1925 ? '19,25%' : t.rate === 0 ? '0%' : '10%'}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                            {FMT(net)} FCFA
                          </td>
                          <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={formData.items.length <= 1}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: formData.items.length <= 1 ? '#cbd5e1' : '#ef4444',
                                cursor: formData.items.length <= 1 ? 'not-allowed' : 'pointer',
                                fontSize: 16
                              }}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Real-time Financial Breakdown & In Words summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                      Montant en toutes lettres (Norme OHADA & Fiscale)
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', fontStyle: 'italic', lineHeight: 1.5 }}>
                      « {totals.inWords} »
                    </div>
                  </div>

                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: '#475569' }}>
                      <input
                        type="checkbox"
                        checked={withholdingTaxActive}
                        onChange={(e) => setWithholdingTaxActive(e.target.checked)}
                        style={{ accentColor: '#FF7900', width: 16, height: 16 }}
                      />
                      <span>Appliquer la retenue à la source (Acompte AIR 5,5 %)</span>
                    </label>
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #FF7900',
                  borderRadius: 12,
                  padding: '16px 20px',
                  boxShadow: '0 2px 8px rgba(255, 121, 0, 0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    <span>Sous-total Brut HT :</span>
                    <strong style={{ color: '#0f172a' }}>{FMT(totals.subtotalHT)} FCFA</strong>
                  </div>
                  {totals.totalDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#27ae60', marginBottom: 6 }}>
                      <span>Remises Commerciales :</span>
                      <strong>- {FMT(totals.totalDiscount)} FCFA</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    <span>Total Net HT :</span>
                    <strong style={{ color: '#0f172a' }}>{FMT(totals.netHT)} FCFA</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    <span>Total TVA (19,25 %) :</span>
                    <strong style={{ color: '#8e44ad' }}>+{FMT(totals.totalTVA)} FCFA</strong>
                  </div>
                  {withholdingTaxActive && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#e74c3c', marginBottom: 6 }}>
                      <span>Retenue AIR (5,5 %) :</span>
                      <strong>-{FMT(totals.withholdingTax)} FCFA</strong>
                    </div>
                  )}

                  <div style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: '2px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>NET À PAYER (TTC) :</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#FF7900' }}>{FMT(totals.totalTTC)} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAIEMENT & FACTURATION */}
          {activeTab === 'payment' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              {/* Modalités de Règlement */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Modalités de Règlement
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Mode de Règlement Préconisé
                    </label>
                    <select
                      value={formData.modeReglement}
                      onChange={(e) => setFormData({ ...formData, modeReglement: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1.5px solid #FF7900',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    >
                      {PAYMENT_MODES.map((m, mi) => (
                        <option key={mi} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Établissement Bancaire
                    </label>
                    <input
                      type="text"
                      value={formData.etablissementBancaire}
                      onChange={(e) => setFormData({ ...formData, etablissementBancaire: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 13,
                        outline: 'none'
                      }}
                      placeholder="ex: Société Générale Cameroun, BICEC..."
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      RIB / IBAN du Compte
                    </label>
                    <input
                      type="text"
                      value={formData.rib}
                      onChange={(e) => setFormData({ ...formData, rib: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 14,
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        color: '#1e293b',
                        outline: 'none'
                      }}
                      placeholder="CM21 1000 2000 3000 4000 5000 12"
                    />
                  </div>
                </div>
              </div>

              {/* Notes, Pièces Jointes & Justificatifs */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Notes, Pièces Jointes & OCR
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Notes Internes & Instructions Spéciales
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 13,
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      placeholder="Mention de l'avenant, retenue à la source 5.5%, référence du bon de commande initial..."
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                        Pièces Jointes & Justificatifs Scannés
                      </label>
                      <button
                        type="button"
                        onClick={handleAddPiece}
                        style={{
                          background: '#fff7ed',
                          border: '1px solid #FF7900',
                          color: '#FF7900',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        + Joindre un document (PDF / Image)
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {formData.pieces.map((piece, pi) => (
                        <div
                          key={pi}
                          style={{
                            background: '#f1f5f9',
                            borderRadius: 6,
                            padding: '6px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 12,
                            color: '#334155'
                          }}
                        >
                          <span>📄 {piece}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePiece(pi)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              padding: 0,
                              fontSize: 13
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRÉVISUALISATION / PDF IMPRIMABLE */}
          {activeTab === 'preview' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Fiche officielle générée aux normes McCann Worldgroup & Direction Financière Douala.
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-ghost btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    🖨️ Imprimer la Fiche
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Téléchargement de la fiche ${formData.reference}.pdf initié avec succès !`)}
                    className="btn btn-orange btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    📥 Télécharger PDF
                  </button>
                </div>
              </div>

              {/* Formal Paper Invoicing Sheet */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '36px 40px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                color: '#1e293b',
                fontFamily: 'Inter, sans-serif'
              }}>
                {/* Document Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #FF7900', paddingBottom: 20, marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#FF7900', letterSpacing: '-0.5px' }}>
                      McCANN ERICKSON CAMEROUN
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 2 }}>
                      McCann Bridge — Direction Financière & Gestion Budgétaire
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                      Rue des Palmiers, Bonanjo, B.P. 1520 Douala — Cameroun<br />
                      RCCM: RC/DLA/2004/B/1458 · NIU: M040400018934P · Tél: +237 233 42 18 00
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-block',
                      background: currentTypeConfig.color,
                      color: '#ffffff',
                      padding: '6px 14px',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}>
                      {currentTypeConfig.label}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 8 }}>
                      N° {formData.reference}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      Date : {formData.dateEmission} · Échéance : {formData.dateEcheance}
                    </div>
                  </div>
                </div>

                {/* Third Party & Campaign Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#FF7900', textTransform: 'uppercase', marginBottom: 6 }}>
                      ÉMETTEUR / AGENCE
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>McCann Douala / McCann Bridge</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Direction des Opérations Financières</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Banque : {formData.etablissementBancaire}</div>
                    <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>RIB : {formData.rib}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#FF7900', textTransform: 'uppercase', marginBottom: 6 }}>
                      DESTINATAIRE / TIERS
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{formData.thirdParty.name || 'Nom du tiers'}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{formData.thirdParty.address}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Fiscal : {formData.thirdParty.rccm}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Contact : {formData.thirdParty.phone}</div>
                  </div>
                </div>

                {/* Items Table */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', marginBottom: 8, textTransform: 'uppercase' }}>
                    Projet / Campagne : <span style={{ color: '#FF7900' }}>{formData.campagne}</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#16213E', color: '#ffffff' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderRadius: '4px 0 0 0' }}>DESCRIPTION</th>
                        <th style={{ padding: '8px 8px', textAlign: 'center' }}>QTÉ</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>P.U. HT</th>
                        <th style={{ padding: '8px 8px', textAlign: 'center' }}>REMISE</th>
                        <th style={{ padding: '8px 8px', textAlign: 'center' }}>TVA</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', borderRadius: '0 4px 0 0' }}>TOTAL NET HT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, idx) => {
                        const gross = (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0);
                        const discountVal = gross * ((Number(item.discount) || 0) / 100);
                        const net = gross - discountVal;

                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.description || 'Prestation'}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>{item.quantity}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right' }}>{FMT(item.unitPrice)} FCFA</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>{item.discount > 0 ? `${item.discount}%` : '—'}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>{item.tvaRate === 0 ? '0%' : item.tvaRate === 0.1 ? '10%' : '19,25%'}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{FMT(net)} FCFA</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Recap Totals */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                  <div style={{ width: 340, background: '#f8fafc', padding: '14px 18px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span>Sous-total Brut HT :</span>
                      <span>{FMT(totals.subtotalHT)} FCFA</span>
                    </div>
                    {totals.totalDiscount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#27ae60', marginBottom: 4 }}>
                        <span>Remise commerciale :</span>
                        <span>-{FMT(totals.totalDiscount)} FCFA</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      <span>Net Hors Taxes :</span>
                      <span>{FMT(totals.netHT)} FCFA</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8e44ad', marginBottom: 4 }}>
                      <span>TVA CEMAC (19,25 %) :</span>
                      <span>+{FMT(totals.totalTVA)} FCFA</span>
                    </div>
                    {withholdingTaxActive && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#e74c3c', marginBottom: 4 }}>
                        <span>Retenue AIR (5,5 %) :</span>
                        <span>-{FMT(totals.withholdingTax)} FCFA</span>
                      </div>
                    )}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      fontWeight: 900,
                      color: '#FF7900',
                      borderTop: '2px solid #cbd5e1',
                      paddingTop: 8,
                      marginTop: 6
                    }}>
                      <span>TOTAL TTC NET :</span>
                      <span>{FMT(totals.totalTTC)} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Amount in words & Signatures */}
                <div style={{ background: '#f1f5f9', padding: '12px 16px', borderRadius: 6, fontSize: 12, marginBottom: 28 }}>
                  <strong>Arrêté le présent document à la somme de :</strong> {totals.inWords}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, paddingTop: 10 }}>
                  <div style={{ border: '1px dashed #cbd5e1', borderRadius: 6, padding: '16px', minHeight: 110, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Pour McCann Erickson Cameroun
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Direction Financière & Comptabilité</div>
                    <div style={{
                      display: 'inline-block',
                      border: '1.5px solid #27ae60',
                      color: '#27ae60',
                      fontWeight: 800,
                      fontSize: 11,
                      padding: '4px 10px',
                      borderRadius: 4,
                      marginTop: 18,
                      transform: 'rotate(-4deg)'
                    }}>
                      ✓ BON POUR ENGAGEMENT · VALIDÉ
                    </div>
                  </div>

                  <div style={{ border: '1px dashed #cbd5e1', borderRadius: 6, padding: '16px', minHeight: 110, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Pour le Tiers / Client / Prestataire
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Signature & Cachet précédés de la mention « Lu et Approuvé »</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: '1px solid #FF7900',
              background: '#ffffff',
              color: '#FF7900',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '9px 18px',
                borderRadius: 8,
                border: '1px solid #FF7900',
                background: '#ffffff',
                color: '#FF7900',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              👁 Aperçu Fiche
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              style={{
                padding: '9px 24px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, #FF7900 0%, #E06800 100%)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 121, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              💾 Enregistrer le Document ({FMT(totals.totalTTC)} FCFA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
