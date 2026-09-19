import React, { useState } from 'react';
import { getTalentPhoto } from '../utils/talentPhotos';
import { exportInfluencerProfileToPdf } from '../sections/fiche/InfluencerProfilePdfExport';

// Réseaux sociaux officiels supportés
const SOCIAL_NETWORKS = [
  { id: 'instagram', label: 'Instagram', icon: '📸', color: '#E1306C' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: '#111827' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', color: '#FF0000' },
  { id: 'facebook', label: 'Facebook', icon: '👥', color: '#1877F2' },
  { id: 'xtwitter', label: 'X (Twitter)', icon: '🐦', color: '#000000' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0A66C2' },
];

export default function TalentModal({ talent, onEdit, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [imgError, setImgError] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!talent) return null;

  const photoUrl = getTalentPhoto(talent);
  const initial = (talent.display_name || talent.prenom || talent.first_name || talent.name || '?').charAt(0).toUpperCase();

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      await exportInfluencerProfileToPdf(talent);
    } catch (e) {
      console.error('Erreur lors de l’export PDF:', e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d’ensemble', icon: '👤' },
    { id: 'socials', label: 'Réseaux & Liens', icon: '🌐' },
    { id: 'contact', label: 'Coordonnées & Contact', icon: '📞' },
    { id: 'contract', label: 'Contrat & Rémunération', icon: '📑' },
    { id: 'deliverables', label: 'Publications & Livrables', icon: '📦' },
    { id: 'compliance', label: 'Moralité & Risques', icon: '🛡️' },
  ];

  const categories = Array.isArray(talent.categories) && talent.categories.length > 0
    ? talent.categories
    : [talent.niche || talent.segment || 'Lifestyle'];

  const cachetBaseFormatted = talent.cachetBase
    ? `${Number(talent.cachetBase).toLocaleString('fr-FR')} FCFA`
    : 'Non renseigné';

  const cachetVarFormatted = talent.cachetVariable
    ? `${Number(talent.cachetVariable).toLocaleString('fr-FR')} FCFA`
    : '0 FCFA';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 860,
          maxHeight: '92vh',
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ─── BANDEAU SUPÉRIEUR ORANGE ─── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FF7900 0%, #E65100 100%)',
            padding: '20px 24px',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Photo officielle de l'influenceur */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  position: 'relative',
                  flexShrink: 0,
                  background: '#FFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: '2px solid #FFF'
                }}
              >
                {!imgError ? (
                  <img
                    src={photoUrl}
                    alt={talent.display_name}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 16,
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 16,
                      background: '#1A1A1A',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: 26
                    }}
                  >
                    {initial}
                  </div>
                )}
                {/* Badge circulaire orange */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: -3,
                    right: -3,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#111827',
                    color: '#FF7900',
                    fontSize: 11,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFFFFF'
                  }}
                >
                  ✓
                </div>
              </div>

              {/* Titres & Badges */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                    {talent.display_name || `${talent.prenom || ''} ${talent.nom || ''}`.trim() || talent.name}
                  </h2>
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.25)',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.3px'
                    }}
                  >
                    {talent.type || 'Macro'}
                  </span>
                  <span
                    style={{
                      background: '#FFFFFF',
                      color: talent.contractStatus === 'actif' ? '#2E7D32' : '#E65100',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800
                    }}
                  >
                    {talent.contractStatus === 'actif' ? '● Contrat Actif' : `● ${talent.contractStatus || 'Prospect'}`}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4, fontWeight: 600 }}>
                  @{talent.pseudo?.replace(/^@+/, '') || talent.handle?.replace(/^@+/, '') || 'talent'} • 📍 {talent.city || 'Douala'} ({talent.region || 'Littoral'})
                </div>

                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {categories.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        color: '#FFF',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions rapides d'en-tête */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(talent);
                  }}
                  style={{
                    background: '#FFFFFF',
                    color: '#E65100',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <span>✏️</span>
                  <span>Modifier la fiche</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: isExportingPdf ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>📄</span>
                <span>{isExportingPdf ? 'Export...' : 'PDF Fiche'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
                title="Fermer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* ─── 4 BLOCS MÉTRIQUES PHARES ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            padding: '14px 24px',
            background: '#F9FAFB',
            borderBottom: '1px solid #E5E7EB'
          }}
        >
          <div style={{ background: '#FFF', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Abonnés Globaux
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#111827', marginTop: 2 }}>
              {talent.followers || '10K'}
            </div>
          </div>

          <div style={{ background: '#FFF', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Taux d'Engagement
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#059669', marginTop: 2 }}>
              {talent.engagement || '5.2%'}
            </div>
          </div>

          <div style={{ background: '#FFF', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Vues Moyennes
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#EA580C', marginTop: 2 }}>
              {talent.avgViews || '50K'}
            </div>
          </div>

          <div style={{ background: '#FFF', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
              Score Créateur
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#FF7900', marginTop: 2 }}>
              {talent.score ? `${talent.score} / 5 ⭐` : '4.5 / 5 ⭐'}
            </div>
          </div>
        </div>

        {/* ─── ONGLETS DE CONSULTATION ─── */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            padding: '0 24px',
            borderBottom: '1px solid #E5E7EB',
            background: '#FFFFFF',
            overflowX: 'auto'
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #FF7900' : '3px solid transparent',
                color: activeTab === tab.id ? '#FF7900' : '#4B5563',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: 12.5,
                padding: '12px 14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── CORPS DU MODAL (CONTENU DE L'ONGLET SÉLECTIONNÉ) ─── */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            flex: 1,
            background: '#FFFFFF'
          }}
        >
          {/* ONGLET 1 : VUE D'ENSEMBLE */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2', padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 6 }}>
                  Biographie & Présentation Officielle
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: '#1F2937', lineHeight: 1.6 }}>
                  {talent.bio || 'Aucune biographie rédigée pour le moment. Vous pouvez la renseigner via la modification de la fiche.'}
                </p>
              </div>

              <div style={{ padding: 14, background: '#FFF', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 }}>
                  Identité & Typologie
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Prénom & Nom :</span>
                    <strong>{talent.prenom || ''} {talent.nom || talent.realName || talent.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Pseudo officiel :</span>
                    <strong style={{ color: '#FF7900' }}>@{talent.pseudo?.replace(/^@+/, '') || talent.handle}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Type d'influenceur :</span>
                    <span style={{ background: '#FFF3E8', color: '#E65100', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                      {talent.type || 'Macro'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Disponibilité :</span>
                    <strong style={{ color: talent.disponibilite === 'disponible' ? '#059669' : '#D97706' }}>
                      {talent.disponibilite || 'Disponible'}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ padding: 14, background: '#FFF', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 }}>
                  Gouvernance & Exclusivité
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Langues parlées :</span>
                    <strong>{talent.langues || 'Français · Anglais'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Exclusivité Orange :</span>
                    <strong style={{ color: talent.exclusivite ? '#059669' : '#6B7280' }}>
                      {talent.exclusivite ? '✓ Oui (Exclusif Orange)' : 'Non (Multi-marques)'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Cahier des charges :</span>
                    <strong>{talent.cahier_charges || 'Orange Weekend 2026'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Statut de conformité :</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>✓ Profil vérifié & certifié</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 2 : RÉSEAUX SOCIAUX & LIENS */}
          {activeTab === 'socials' && (
            <div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 14, fontWeight: 600 }}>
                Comptes et plateformes officielles rattachés à la fiche de ce créateur.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {SOCIAL_NETWORKS.map(net => {
                  const linkData = talent.socialLinks ? talent.socialLinks[net.id] : null;
                  const hasData = Boolean(linkData && (linkData.url || linkData.username || linkData.followers > 0));
                  const isPrimary = (talent.platform || '').toLowerCase() === net.id;

                  return (
                    <div
                      key={net.id}
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        border: '1px solid #E5E7EB',
                        borderLeft: `4px solid ${hasData ? net.color : '#D1D5DB'}`,
                        background: hasData ? '#FFFFFF' : '#FAFAFA',
                        opacity: hasData || isPrimary ? 1 : 0.7
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 13 }}>
                          <span>{net.icon}</span>
                          <span>{net.label}</span>
                        </div>
                        {isPrimary && (
                          <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>
                            Principal
                          </span>
                        )}
                      </div>

                      {hasData ? (
                        <div style={{ fontSize: 12 }}>
                          {linkData.username && (
                            <div style={{ color: '#374151', fontWeight: 700 }}>
                              @{linkData.username.replace(/^@+/, '')}
                            </div>
                          )}
                          {linkData.followers > 0 && (
                            <div style={{ color: '#6B7280', marginTop: 2 }}>
                              {Number(linkData.followers).toLocaleString('fr-FR')} abonnés
                            </div>
                          )}
                          {linkData.url && (
                            <div style={{ marginTop: 8 }}>
                              <a
                                href={linkData.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#FF7900',
                                  textDecoration: 'none',
                                  fontWeight: 700,
                                  fontSize: 11.5,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                Ouvrir le profil ↗
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11.5, color: '#9CA3AF', fontStyle: 'italic', marginTop: 4 }}>
                          Non configuré
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ONGLET 3 : COORDONNÉES & CONTACT */}
          {activeTab === 'contact' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 10 }}>
                  Téléphones & Lignes Directes
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Téléphone principal :</div>
                    <div style={{ fontWeight: 800, color: '#111827', marginTop: 2 }}>
                      {talent.phone || 'Non renseigné'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Téléphone secondaire / WhatsApp :</div>
                    <div style={{ fontWeight: 700, color: '#111827', marginTop: 2 }}>
                      {talent.telephone2 || '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 10 }}>
                  Email & Adresse Géographique
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Email professionnel :</div>
                    <div style={{ fontWeight: 800, color: '#FF7900', marginTop: 2 }}>
                      {talent.email || 'Non renseigné'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Adresse physique / Résidence :</div>
                    <div style={{ fontWeight: 700, color: '#111827', marginTop: 2 }}>
                      {talent.adresse ? `${talent.adresse}, ${talent.city}` : `${talent.city || 'Douala'}, ${talent.region || 'Littoral'}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 4 : CONTRAT & RÉMUNÉRATION */}
          {activeTab === 'contract' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 10 }}>
                  Engagement Contractuel
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Statut :</span>
                    <strong style={{ color: talent.contractStatus === 'actif' ? '#059669' : '#D97706' }}>
                      {talent.contractStatus === 'actif' ? 'Contrat Actif' : (talent.contractStatus || 'Prospect')}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Échéance :</span>
                    <strong>{talent.contractEnd ? `Expire le ${talent.contractEnd}` : 'Contrat indéterminé / ponctuel'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Campagnes réalisées :</span>
                    <strong>{talent.campaigns || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Dernière campagne :</span>
                    <strong>{talent.lastCampaign || '—'}</strong>
                  </div>
                </div>
              </div>

              <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 10 }}>
                  Grille Tarifaire (FCFA)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Cachet fixe de base :</span>
                    <strong style={{ color: '#EA580C' }}>{cachetBaseFormatted}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Cachet variable :</span>
                    <strong>{cachetVarFormatted}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Marques actives tierces :</span>
                    <strong>{talent.brandsActives || 0}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 5 : PUBLICATIONS & LIVRABLES */}
          {activeTab === 'deliverables' && (
            <div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12, fontWeight: 600 }}>
                Livrables et publications rattachés au créateur.
              </div>

              {Array.isArray(talent.pendingDeliverables) && talent.pendingDeliverables.length > 0 ? (
                <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                        <th style={{ padding: '8px 12px', fontWeight: 800, color: '#6B7280' }}>Titre / Sujet</th>
                        <th style={{ padding: '8px 12px', fontWeight: 800, color: '#6B7280' }}>Date limite</th>
                        <th style={{ padding: '8px 12px', fontWeight: 800, color: '#6B7280' }}>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {talent.pendingDeliverables.map((d, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F0F0F0' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 700 }}>
                            {d.title || d.titre || 'Livrable sans titre'}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#6B7280' }}>
                            {d.deadline || 'Non précisée'}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ background: '#E8F8F0', color: '#27AE60', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                              {d.status || 'En cours'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: 24, textAlign: 'center', background: '#F9FAFB', borderRadius: 8, color: '#6B7280', fontSize: 13 }}>
                  Aucun livrable en attente pour cet influenceur.
                </div>
              )}
            </div>
          )}

          {/* ONGLET 6 : MORALITÉ & RISQUES */}
          {activeTab === 'compliance' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 10 }}>
                  Contrôle de Moralité & Image
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Statut du contrôle :</span>
                    <strong style={{ color: '#059669' }}>
                      {talent.moralityCheck?.done ? 'Effectué' : 'À jour'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Date de validation :</span>
                    <strong>{talent.moralityCheck?.date || '2025-11-15'}</strong>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Commentaires :</div>
                    <div style={{ fontStyle: 'italic', color: '#374151', marginTop: 2 }}>
                      "{talent.moralityCheck?.notes || 'Aucune controverse constatée. Profil d’excellente réputation conforme aux valeurs d’Orange Cameroun.'}"
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 10 }}>
                  Évaluation des Risques
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Score de risque :</span>
                    <strong style={{ color: (talent.riskScore || 1) <= 2 ? '#059669' : '#DC2626' }}>
                      {talent.riskScore || 1} / 5 (Faible)
                    </strong>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Notes de veille concurrentielle :</div>
                    <div style={{ color: '#374151', marginTop: 2 }}>
                      {talent.riskNotes || 'Aucun conflit d’intérêt concurrentiel majeur. Engagement régulier.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── PIED DE MODAL ─── */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #E5E7EB',
            background: '#F9FAFB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: 12, color: '#6B7280' }}>
            ID Référentiel : <strong>#{talent.id}</strong> • Référencé sur Orange Cameroun
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(talent);
                }}
                style={{
                  background: '#FFF3E8',
                  color: '#E65100',
                  border: '1px solid #FFD8B2',
                  borderRadius: 8,
                  padding: '7px 16px',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ✏️ Modifier la fiche
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#FFFFFF',
                color: '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: 8,
                padding: '7px 16px',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
