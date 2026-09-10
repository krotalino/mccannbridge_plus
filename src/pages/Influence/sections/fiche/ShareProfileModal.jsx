import { useState } from 'react';
import { exportInfluencerProfileToPdf } from './InfluencerProfilePdfExport';
import { getInfluencerCdcAndDeliverables } from './deliverableUtils';

export default function ShareProfileModal({ influencer, onClose }) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState('');

  if (!influencer) return null;

  const { activeCdc, stats, activeDeliverables } = getInfluencerCdcAndDeliverables(influencer);

  // Génération de l'URL virtuelle directe du profil
  const currentOrigin = window.location.origin;
  const profileUrl = `${currentOrigin}/influence?tab=fiche&influencerId=${influencer.id}&pseudo=${encodeURIComponent(influencer.pseudo || influencer.name)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setToast('✓ Lien copié dans le presse-papier !');
      setTimeout(() => setCopied(false), 3000);
      setTimeout(() => setToast(''), 3500);
    });
  };

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      exportInfluencerProfileToPdf(influencer);
      setToast('✓ Fiche PDF Orange Cameroun téléchargée');
      setTimeout(() => setToast(''), 3500);
    } catch (err) {
      console.error('Erreur export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Préparation du texte de partage
  const shareTitle = `[ORANGE CAMEROUN] Fiche Influence & Livrables : @${influencer.pseudo || influencer.name}`;
  const shareBody = `Bonjour l'équipe,\n\nVoici la fiche profil et le suivi des livrables pour le talent @${influencer.pseudo || influencer.name} :\n` +
    `- Nom : ${influencer.realName || influencer.name}\n` +
    `- Audience : ${influencer.followers || '0'} abonnés | Engagement : ${influencer.engagement || '0%'}\n` +
    `- Campagne en cours : ${activeCdc?.campagneNom || influencer.lastCampaign || 'Orange Weekend'} (Réf CDC : ${activeCdc?.id || 'CDC-001'})\n` +
    `- Avancement des livrables : ${stats.globalProgress}% (${stats.valides}/${stats.total} validés)\n` +
    `- Lien de consultation interne Bridge : ${profileUrl}\n\n` +
    `Direction de la Communication Orange Cameroun & Agence McCann Douala.`;

  const handleShareEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareBody)}`;
    window.location.href = mailtoUrl;
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n\n${shareBody}`)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyCardText = () => {
    navigator.clipboard.writeText(shareBody).then(() => {
      setToast('✓ Synthèse copiée au format texte !');
      setTimeout(() => setToast(''), 3500);
    });
  };

  return (
    <div className="inf-modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="inf-profile-modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 560, padding: 0, overflow: 'hidden', borderRadius: 12 }}
      >
        {/* En-tête Orange Cameroun */}
        <div style={{ background: '#1a1a1a', padding: '18px 24px', borderTop: '4px solid #FF7900', position: 'relative' }}>
          <button
            className="inf-modal-close"
            onClick={onClose}
            style={{ position: 'absolute', top: 16, right: 16, color: '#fff' }}
          >
            ✕
          </button>
          <div className="flex items-center gap-8">
            <span style={{ fontSize: 20 }}>🔗</span>
            <div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 700 }}>
                Partager la Fiche Influence
              </h3>
              <p style={{ margin: 0, color: '#FF7900', fontSize: 12, fontWeight: 600 }}>
                @{influencer.pseudo || influencer.name} • {influencer.realName || ''}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: 24, maxHeight: '80vh', overflowY: 'auto' }}>
          {toast && (
            <div
              style={{
                background: '#e8f5e9',
                color: '#2e7d32',
                border: '1px solid #a5d6a7',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span>{toast}</span>
            </div>
          )}

          {/* Résumé du profil et livrables */}
          <div
            style={{
              background: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: 8,
              padding: 14,
              marginBottom: 20,
              borderLeft: '4px solid #FF7900'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <strong style={{ fontSize: 13, color: '#1a1a1a' }}>Campagne & Travaux en cours</strong>
              <span
                style={{
                  background: 'rgba(255, 121, 0, 0.1)',
                  color: '#FF7900',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 700
                }}
              >
                {stats.globalProgress}% achevé
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#495057' }}>
              <strong>Campagne :</strong> {activeCdc?.campagneNom || influencer.lastCampaign || 'Orange Weekend'}{' '}
              <span style={{ color: '#868e96' }}>({activeCdc?.id || 'CDC-001'})</span>
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#495057' }}>
              <strong>Livrables :</strong> {stats.valides} validé(s) sur {stats.total} attendu(s)
            </p>
          </div>

          {/* 1. Lien direct */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
              Lien direct de consultation interne (Bridge)
            </label>
            <div className="flex gap-8">
              <input
                type="text"
                readOnly
                value={profileUrl}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: 12,
                  borderRadius: 6,
                  border: '1px solid #ced4da',
                  background: '#fff',
                  color: '#495057',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={handleCopyLink}
                className="btn btn-sm"
                style={{
                  background: copied ? '#27ae60' : '#FF7900',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 12,
                  padding: '0 14px',
                  whiteSpace: 'nowrap'
                }}
              >
                {copied ? '✓ Copié !' : 'Copier'}
              </button>
            </div>
          </div>

          {/* 2. Bouton d'export PDF officiel */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
              Document officiel Orange Cameroun
            </label>
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="btn btn-sm w-full flex items-center justify-center gap-8"
              style={{
                background: '#1a1a1a',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                border: '1px solid #333'
              }}
            >
              <span>📄</span>
              <span>{isExporting ? 'Génération du PDF...' : 'Télécharger la Fiche Complète (PDF Charté Orange)'}</span>
            </button>
            <p style={{ margin: '6px 0 0', fontSize: 11, color: '#868e96', textAlign: 'center' }}>
              Inclut l'identité, les statistiques, le cahier des charges, les livrables et la mention « Document généré depuis Bridge ».
            </p>
          </div>

          {/* 3. Canaux de diffusion rapide */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>
              Partager directement auprès des équipes
            </label>
            <div className="grid grid-3 gap-8">
              <button
                onClick={handleShareEmail}
                className="btn btn-ghost btn-sm flex items-center justify-center gap-6"
                style={{ border: '1px solid #dee2e6', padding: '10px 6px', fontSize: 12, fontWeight: 600 }}
              >
                <span>✉️</span>
                <span>Email</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="btn btn-ghost btn-sm flex items-center justify-center gap-6"
                style={{ border: '1px solid #dee2e6', padding: '10px 6px', fontSize: 12, fontWeight: 600, color: '#25D366' }}
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyCardText}
                className="btn btn-ghost btn-sm flex items-center justify-center gap-6"
                style={{ border: '1px solid #dee2e6', padding: '10px 6px', fontSize: 12, fontWeight: 600, color: '#0078D4' }}
              >
                <span>📋</span>
                <span>Copier texte</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: '#f8f9fa', padding: '12px 24px', borderTop: '1px solid #dee2e6', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ fontWeight: 600 }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
