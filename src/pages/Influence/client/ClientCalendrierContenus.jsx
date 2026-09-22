import React, { useState } from 'react';

export default function ClientCalendrierContenus({
  calendarItems = [],
  onSelectContent,
  onNavigateTab
}) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'timeline'
  const [filterPlatform, setFilterPlatform] = useState('all');

  const filteredItems = filterPlatform === 'all'
    ? calendarItems
    : calendarItems.filter(item => item.platform === filterPlatform);

  // Recherche des conflits actifs
  const conflictItems = calendarItems.filter(item => Boolean(item.conflictWarning));

  return (
    <div className="space-y-6 animate-fade">
      {/* ─── BANDEAU SUPÉRIEUR & CONFLITS DÉTECTÉS ─── */}
      <div
        className="card"
        style={{
          borderRadius: 14,
          padding: '16px 20px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📅</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                Calendrier de Production, Validation & Diffusion
              </h3>
              <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                Semaine S38 — Septembre 2026
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Ordonnancement certifié : tournages, soumissions BAT, fenêtres de validation et créneaux de publication
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Filtre plateforme */}
            <select
              className="form-control"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              style={{ height: 32, fontSize: 11, padding: '0 8px', borderRadius: 6 }}
            >
              <option value="all">Toutes les plateformes</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>

            {/* Bascule vue */}
            <div style={{ display: 'flex', borderRadius: 6, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  border: 'none',
                  background: viewMode === 'cards' ? '#FF7900' : '#FFF',
                  color: viewMode === 'cards' ? '#FFF' : '#64748B',
                  cursor: 'pointer'
                }}
              >
                Grille Cartes
              </button>
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                style={{
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  border: 'none',
                  background: viewMode === 'timeline' ? '#FF7900' : '#FFF',
                  color: viewMode === 'timeline' ? '#FFF' : '#64748B',
                  cursor: 'pointer'
                }}
              >
                Chronologie
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DÉTECTEUR DE CONFLITS AVEC AUTRES COMMUNICATIONS ORANGE (PAGE 4) ─── */}
      {conflictItems.length > 0 && (
        <div
          className="card"
          style={{
            borderRadius: 12,
            padding: '14px 18px',
            background: '#FFFBEB',
            border: '1px solid #FCD34D',
            marginBottom: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <strong style={{ fontSize: 13, color: '#92400E' }}>
              DÉTECTEUR D'INTERFÉRENCES ÉDITORIALES & CONFLITS DE CALENDRIER ({conflictItems.length})
            </strong>
          </div>
          {conflictItems.map(item => (
            <div key={item.id} style={{ fontSize: 12, color: '#78350F', marginLeft: 24, lineHeight: 1.5 }}>
              • <strong>{item.title} ({item.talentName}) :</strong> {item.conflictWarning.message}
            </div>
          ))}
        </div>
      )}

      {/* ─── VUE GRILLE DE CARTES DE CONTENUS ─── */}
      {viewMode === 'cards' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 16
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                borderRadius: 14,
                padding: '16px',
                background: '#FFFFFF',
                border: item.conflictWarning ? '1px solid #FCD34D' : '1px solid #E5E7EB',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                {/* Aperçu Visuel & Badge Statut */}
                <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 160, marginBottom: 12 }}>
                  <img
                    src={item.draftPreviewUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      display: 'flex',
                      gap: 6
                    }}
                  >
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'rgba(0,0,0,0.75)',
                        color: '#FFF',
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.platform}
                    </span>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: '#FF7900',
                        color: '#FFF',
                        fontSize: 10,
                        fontWeight: 800
                      }}
                    >
                      {item.format}
                    </span>
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      right: 10,
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#FFF',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>Diffusion prévue :</span>
                    <span style={{ color: '#FFB266' }}>
                      {new Date(item.datePublicationScheduled).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Talent & Titre */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <img
                    src={item.talentPhoto}
                    alt={item.talentName}
                    referrerPolicy="no-referrer"
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>
                      {item.talentName}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                      {item.campaignName}
                    </div>
                  </div>
                </div>

                <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 800, color: 'var(--dark)' }}>
                  {item.title}
                </h4>

                {/* Légende / Caption */}
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: 11,
                    color: '#475569',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {item.caption}
                </p>

                {/* Mentions & CTA */}
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: '#F8FAFC',
                    fontSize: 10,
                    color: '#64748B',
                    marginBottom: 10
                  }}
                >
                  <div><strong>CTA :</strong> {item.cta}</div>
                  <div style={{ marginTop: 2, color: '#FF7900', fontWeight: 700 }}>
                    {item.partnershipMentionIncluded ? '✓ Mention #PartenariatOrange incluse' : '⚠️ Mention manquante'}
                  </div>
                </div>

                {/* Dates clés de la chaîne */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 6,
                    textAlign: 'center',
                    fontSize: 10,
                    marginBottom: 12
                  }}
                >
                  <div style={{ padding: '4px', borderRadius: 4, background: '#F1F5F9' }}>
                    <div style={{ color: 'var(--muted)' }}>Tournage</div>
                    <div style={{ fontWeight: 700 }}>{item.dateShooting}</div>
                  </div>
                  <div style={{ padding: '4px', borderRadius: 4, background: '#F1F5F9' }}>
                    <div style={{ color: 'var(--muted)' }}>BAT</div>
                    <div style={{ fontWeight: 700 }}>{item.dateBatSubmission}</div>
                  </div>
                  <div style={{ padding: '4px', borderRadius: 4, background: '#FFF3E8' }}>
                    <div style={{ color: '#E65100' }}>Valid. Orange</div>
                    <div style={{ fontWeight: 800, color: '#E65100' }}>{item.dateOrangeValidation}</div>
                  </div>
                </div>
              </div>

              {/* Bouton Fiche Contenu */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSelectContent(item)}
                  style={{
                    flex: 1,
                    fontSize: 11,
                    fontWeight: 700,
                    background: '#FFF3E8',
                    color: '#E65100',
                    border: '1px solid #FFD8BE'
                  }}
                >
                  Inspecter Contenu →
                </button>

                {item.status === 'en_validation_orange' && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onNavigateTab('validations')}
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background: '#FF7900'
                    }}
                  >
                    Valider ⚡
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── VUE CHRONOLOGIE LINÉAIRE ─── */
        <div className="card" style={{ padding: '20px', borderRadius: 14, background: '#FFF', border: '1px solid #E5E7EB' }}>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #F1F5F9',
                  background: '#F8FAFC',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={item.talentPhoto}
                    alt={item.talentName}
                    referrerPolicy="no-referrer"
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="tag tag-orange" style={{ fontSize: 9 }}>{item.platform}</span>
                      <strong style={{ fontSize: 13, color: 'var(--dark)' }}>{item.title}</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      {item.talentName} • {item.campaignName} • {item.format}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#FF7900' }}>
                      {new Date(item.datePublicationScheduled).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                      {item.statusLabel}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectContent(item)}
                    style={{ fontSize: 11, fontWeight: 700 }}
                  >
                    Détails →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
