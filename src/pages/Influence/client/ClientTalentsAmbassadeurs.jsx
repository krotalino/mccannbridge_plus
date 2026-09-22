import React, { useState, useMemo } from 'react';

export default function ClientTalentsAmbassadeurs({
  talents = [],
  onSelectTalent,
  searchQuery = '',
  selectedCategory = 'all'
}) {
  const [filterCategory, setFilterCategory] = useState(selectedCategory);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'community' | 'name'

  const categories = useMemo(() => {
    const set = new Set();
    talents.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return ['all', ...Array.from(set)];
  }, [talents]);

  const filteredTalents = useMemo(() => {
    let list = talents;

    if (filterCategory !== 'all') {
      list = list.filter(t => t.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      list = list.filter(t => t.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t =>
        t.displayName.toLowerCase().includes(q) ||
        t.pseudo.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.city && t.city.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'score') {
        return (b.mccannRecommendation?.score || 0) - (a.mccannRecommendation?.score || 0);
      }
      if (sortBy === 'name') {
        return a.displayName.localeCompare(b.displayName);
      }
      return 0;
    });
  }, [talents, filterCategory, filterStatus, searchQuery, sortBy]);

  return (
    <div className="space-y-6 animate-fade">
      {/* ─── BANDEAU SUPÉRIEUR DU CATALOGUE TALENTS ─── */}
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
              <span style={{ fontSize: 20 }}>👥</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                Catalogue Qualifié des Talents & Ambassadeurs
              </h3>
              <span className="tag tag-green" style={{ fontSize: 10, fontWeight: 800 }}>
                {filteredTalents.length} profil(s)
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Vivier certifié Orange Cameroun • Confidentialité des honoraires agence protégée
            </p>
          </div>

          {/* Filtres de la vue */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>Catégorie :</label>
              <select
                className="form-control"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ height: 32, fontSize: 11, padding: '0 8px', borderRadius: 6 }}
              >
                <option value="all">Toutes les catégories</option>
                {categories.filter(c => c !== 'all').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>Statut :</label>
              <select
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ height: 32, fontSize: 11, padding: '0 8px', borderRadius: 6 }}
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Partenaires actifs</option>
                <option value="recommande">Talents recommandés</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>Tri :</label>
              <select
                className="form-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ height: 32, fontSize: 11, padding: '0 8px', borderRadius: 6 }}
              >
                <option value="score">Score Recommandation McCann</option>
                <option value="name">Nom alphabétique</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─── GRILLE DES CARTES TALENTS ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 16
        }}
      >
        {filteredTalents.map((talent) => (
          <div
            key={talent.id}
            className="card"
            style={{
              borderRadius: 14,
              padding: '18px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              {/* En-tête : Photo, Nom, Badges */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                <img
                  src={talent.photo}
                  alt={talent.displayName}
                  referrerPolicy="no-referrer"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    objectFit: 'cover',
                    border: '2px solid #FF7900',
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                        {talent.displayName}
                      </h4>
                      <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                        {talent.pseudo}
                      </span>
                    </div>

                    {/* Score McCann */}
                    <div
                      style={{
                        textAlign: 'right',
                        padding: '4px 8px',
                        borderRadius: 8,
                        background: '#FFF3E8',
                        border: '1px solid #FFD8BE'
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#E65100' }}>
                        {talent.mccannRecommendation?.score}/100
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 800, color: '#B33C00', textTransform: 'uppercase' }}>
                        Brand Fit
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 700 }}>
                      {talent.category}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      📍 {talent.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Communauté & Réseaux */}
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  marginBottom: 12
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>
                    Audience cumulée :
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--dark)' }}>
                    {talent.communityTotal}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {Object.entries(talent.communities || {}).map(([plat, count]) => (
                    <span key={plat} style={{ fontSize: 11, color: '#334155' }}>
                      <strong style={{ textTransform: 'capitalize' }}>{plat} :</strong> {count}
                    </span>
                  ))}
                </div>
              </div>

              {/* Formats maîtrisés */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                  Formats maîtrisés :
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(talent.formatsMastered || []).slice(0, 3).map((fmt, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: '#EEF2F6',
                        color: '#334155'
                      }}
                    >
                      {fmt}
                    </span>
                  ))}
                  {(talent.formatsMastered || []).length > 3 && (
                    <span style={{ fontSize: 10, color: 'var(--muted)', alignSelf: 'center' }}>
                      +{talent.formatsMastered.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Historique Orange & Conformité */}
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: '#FFFDF9',
                  border: '1px solid #FFEACC',
                  marginBottom: 14
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9A5B00' }}>
                    Historique Orange :
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#FF7900' }}>
                    {talent.orangeHistory?.totalCampaigns} campagne(s) • Tx Eng. {talent.orangeHistory?.averageEngagementRate}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#27AE60', fontWeight: 700 }}>
                  <span>✓ Contrat signé</span>
                  <span>✓ Droits image</span>
                  <span>✓ Charte validée</span>
                </div>
              </div>
            </div>

            {/* Bouton d'action : Fiche Profil Détaillée */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onSelectTalent(talent)}
              style={{
                width: '100%',
                fontWeight: 700,
                fontSize: 12,
                padding: '8px 12px',
                borderRadius: 8,
                background: '#FFF3E8',
                color: '#E65100',
                border: '1px solid #FFD8BE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <span>📄</span> Consulter Fiche Profil Client →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
