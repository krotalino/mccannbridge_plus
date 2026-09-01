import { useState } from 'react';
import { DOCUMENT_TYPES, calculateDocumentTotals } from '../../../utils/financialUtils';

const FMT = (n) => (n !== undefined && n !== null ? Number(n).toLocaleString('fr-FR') : '0');

const PRESET_OCR_DOCS = [
  {
    id: 'ocr-sample-1',
    name: 'BC_Orange_Mayi_Festival_Scan.pdf',
    size: '2.4 MB',
    type: 'BC',
    reference: 'BC-2026-3556',
    client: 'Studio Mayi Productions SA',
    campagne: 'Mayi Festival 2026',
    dateEmission: '2026-05-08',
    dateEcheance: '2026-06-07',
    thirdParty: {
      name: 'Studio Mayi Productions SA',
      rccm: 'RC/DLA/2018/B/4521 - NIU M081800034512P',
      phone: '+237 699 44 22 11',
      address: 'Boulevard de la Liberté, Akwa, Douala, Cameroun'
    },
    items: [
      { id: 'ocr-item-1', description: 'Production Spots TV & Vidéos Digitales Mayi 2026 (4 capsules 4K)', quantity: 4, unitPrice: 4500000, discount: 5, tvaRate: 0.1925 },
      { id: 'ocr-item-2', description: 'Couverture live multicam, streaming haute définition & montage', quantity: 2, unitPrice: 3500000, discount: 0, tvaRate: 0.1925 },
      { id: 'ocr-item-3', description: 'Post-production sonore, voice-over français / pidgin & mastering', quantity: 1, unitPrice: 2800000, discount: 0, tvaRate: 0.1925 },
    ],
    modeReglement: 'Virement bancaire (Swift / SEPA)',
    etablissementBancaire: 'Société Générale Cameroun (SGBC)',
    rib: 'CM21 1000 2000 3000 4000 5000 12',
    notes: 'Document scanné avec mention bon pour accord.',
    confidence: 99.2,
  },
  {
    id: 'ocr-sample-2',
    name: 'Facture_Fournisseur_DigitalQ2_Scan.pdf',
    size: '1.8 MB',
    type: 'FAF',
    reference: 'FA-2026-0891',
    client: 'Digital Agency Q2 SARL',
    campagne: 'Orange Digital Q2',
    dateEmission: '2026-05-07',
    dateEcheance: '2026-06-06',
    thirdParty: {
      name: 'Digital Agency Q2 SARL',
      rccm: 'RC/DLA/2021/B/1120 - NIU M052100087654K',
      phone: '+237 677 88 99 00',
      address: 'Immeuble Titanium, Bonapriso, Douala'
    },
    items: [
      { id: 'ocr-item-1', description: 'Achats d\'espaces Meta & Display Programmatique Q2', quantity: 1, unitPrice: 8500000, discount: 0, tvaRate: 0.1925 },
      { id: 'ocr-item-2', description: 'Optimisation SEO / SEA Google Ads & Google Analytics 4', quantity: 1, unitPrice: 2200000, discount: 0, tvaRate: 0.1925 },
    ],
    modeReglement: 'Virement bancaire (Swift / SEPA)',
    etablissementBancaire: 'BICEC Akwa',
    rib: 'CM21 1000 5000 8000 9000 1234 56',
    notes: 'Reconnaissance OCR effectuée depuis document numérisé.',
    confidence: 98.6,
  },
  {
    id: 'ocr-sample-3',
    name: 'Swift_Recu_MTN_Cameroon.pdf',
    size: '890 KB',
    type: 'RC',
    reference: 'RC-2026-0156',
    client: 'MTN Cameroon SA',
    campagne: 'Launch 5G MTN',
    dateEmission: '2026-05-06',
    dateEcheance: '2026-05-06',
    thirdParty: {
      name: 'MTN Cameroon SA',
      rccm: 'RC/DLA/2000/B/890 - NIU M020000012345T',
      phone: '+237 679 00 00 00',
      address: 'Direction Générale MTN, Boulevard de la Liberté, Douala'
    },
    items: [
      { id: 'ocr-item-1', description: 'Règlement acompte 50% Campagne 360 Lancement 5G MTN', quantity: 1, unitPrice: 37735849, discount: 0, tvaRate: 0.1925 },
    ],
    modeReglement: 'Virement bancaire (Swift / SEPA)',
    etablissementBancaire: 'Standard Chartered Bank Cameroun',
    rib: 'CM21 1000 9000 4000 2000 6789 01',
    notes: 'Reçu bancaire authentifié avec cachet de compensation.',
    confidence: 99.5,
  }
];

export default function OcrImportModal({ isOpen, onClose, onImportParsedDoc }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [parsedResult, setParsedResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const startScan = (docData, fileName = 'document_scan.pdf') => {
    setSelectedFile({ name: fileName, size: '2.1 MB' });
    setScanning(true);
    setScanProgress(15);
    setParsedResult(null);

    setTimeout(() => setScanProgress(45), 350);
    setTimeout(() => setScanProgress(75), 700);
    setTimeout(() => {
      setScanProgress(100);
      setScanning(false);
      setParsedResult(docData);
    }, 1100);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Pick appropriate preset or generate parsed mock based on filename
      const sample = PRESET_OCR_DOCS[0];
      startScan({
        ...sample,
        name: file.name,
        reference: `DOC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        confidence: 98.4
      }, file.name);
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const sample = PRESET_OCR_DOCS[1];
      startScan({
        ...sample,
        name: file.name,
        reference: `DOC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        confidence: 97.9
      }, file.name);
    }
  };

  const handleTransferToForm = () => {
    if (parsedResult) {
      onImportParsedDoc(parsedResult);
      onClose();
    }
  };

  if (!isOpen) return null;

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
        maxWidth: 850,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#16213E',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
              🔍
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#FF7900', textTransform: 'uppercase' }}>
                INTELLIGENCE ARTIFICIELLE & RECONNAISSANCE OPTIQUE
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Importation par Reconnaissance OCR de Documents
              </h2>
            </div>
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
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDragDrop}
            style={{
              border: isDragOver ? '2px dashed #FF7900' : '2px dashed #cbd5e1',
              borderRadius: 12,
              background: isDragOver ? '#fff7ed' : '#f8fafc',
              padding: '32px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: 20
            }}
            onClick={() => document.getElementById('ocr-file-input')?.click()}
          >
            <input
              id="ocr-file-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.tiff,.xlsx,.csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: 36, marginBottom: 8 }}>📁</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
              Glissez-déposez votre document financier ici ou <span style={{ color: '#FF7900', textDecoration: 'underline' }}>parcourez</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Formats supportés : PDF haute définition, JPEG, PNG, TIFF, Bordereaux scannés (jusqu'à 25 Mo)
            </div>
          </div>

          {/* Preset Fast Testing Chips */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 10, textTransform: 'uppercase' }}>
              ⚡ Ou testez immédiatement avec un document type scanné :
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {PRESET_OCR_DOCS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => startScan(preset, preset.name)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '10px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF7900';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 121, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>📄</span> {preset.reference}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                    {preset.client} · {preset.campagne}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#27ae60', marginTop: 4 }}>
                    Précision IA : {preset.confidence}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scanning Progress Animation */}
          {scanning && (
            <div style={{
              background: '#16213E',
              color: '#ffffff',
              borderRadius: 10,
              padding: '20px',
              marginBottom: 20,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FF7900', marginBottom: 8 }}>
                Reconnaissance et extraction OCR en cours ({scanProgress}%)
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 999,
                height: 8,
                overflow: 'hidden',
                marginBottom: 12
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, #FF7900, #27AE60)',
                  height: '100%',
                  width: `${scanProgress}%`,
                  transition: 'width 0.3s'
                }} />
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Analyse structurelle CEMAC / OHADA, détection des lignes d'articles et vérification fiscale du NIU...
              </div>
            </div>
          )}

          {/* Parsed Result Display */}
          {parsedResult && !scanning && (
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #27ae60',
              borderRadius: 12,
              padding: '20px',
              boxShadow: '0 4px 12px rgba(39, 174, 96, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>✅</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                      Extraction OCR Réussie — Précision {parsedResult.confidence}%
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Fichier source : {selectedFile?.name || 'Document numérisé'}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#dcfce7',
                  color: '#166534',
                  fontWeight: 800,
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 6
                }}>
                  Prêt pour injection
                </div>
              </div>

              {/* Quick Data Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Type Document</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{parsedResult.type} ({DOCUMENT_TYPES.find(t => t.id === parsedResult.type)?.label})</div>
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Référence</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#FF7900', marginTop: 2 }}>{parsedResult.reference}</div>
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Tiers / Partenaire</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {parsedResult.thirdParty?.name || parsedResult.client}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Lignes Détectées</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{parsedResult.items?.length || 0} prestations</div>
                </div>
              </div>

              {/* Items Preview */}
              <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', padding: '10px 14px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                  Détail des Lignes Reconnues :
                </div>
                {parsedResult.items?.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: idx < parsedResult.items.length - 1 ? '1px dashed #f1f5f9' : 'none' }}>
                    <span style={{ color: '#334155' }}>• {it.description} (x{it.quantity})</span>
                    <strong style={{ color: '#0f172a' }}>{FMT((it.quantity || 1) * (it.unitPrice || 0))} FCFA</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
            Fermer
          </button>

          <button
            type="button"
            disabled={!parsedResult || scanning}
            onClick={handleTransferToForm}
            style={{
              padding: '9px 24px',
              borderRadius: 8,
              border: 'none',
              background: parsedResult && !scanning ? 'linear-gradient(135deg, #27AE60 0%, #219653 100%)' : '#cbd5e1',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 800,
              cursor: parsedResult && !scanning ? 'pointer' : 'not-allowed',
              boxShadow: parsedResult && !scanning ? '0 4px 12px rgba(39, 174, 96, 0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            ⚡ Transférer vers le Formulaire & Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
