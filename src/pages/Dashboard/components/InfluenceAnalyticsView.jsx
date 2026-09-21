import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function InfluenceAnalyticsView({ data }) {
  const navigate = useNavigate();
  const { filteredInfluencers, breakdowns } = data;
  const [localSearch, setLocalSearch] = useState('');

  const displayInfluencers = filteredInfluencers.filter(inf => {
    if (localSearch.trim()) {
      const term = localSearch.toLowerCase();
      return (inf.display_name || '').toLowerCase().includes(term) ||
             (inf.pseudo || '').toLowerCase().includes(term) ||
             (inf.cahier_charges || '').toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* ─── 1. CARTES SYNTHÉTIQUES INFLUENCE & CRÉATEURS (Style Traffic Manager) ─── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: 14 
        }}
      >
        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            VIVIER DE TALENTS
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
            {filteredInfluencers.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            Créateurs qualifiés
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            CONTRATS ACTIFS
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#27AE60', marginTop: 4 }}>
            22
          </div>
          <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 700, marginTop: 4 }}>
            ✓ Engagements fermes signés
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            PORTÉE CUMULÉE (REACH)
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FF7900', marginTop: 4 }}>
            14.8M
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            Audience brute totale
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            ENGAGEMENT MOYEN
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2980B9', marginTop: 4 }}>
            4.5%
          </div>
          <div style={{ fontSize: 11, color: '#2980B9', fontWeight: 700, marginTop: 4 }}>
            ▲ Audience très réactive
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            RESPECT LIVRABLES
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
            95.4%
          </div>
          <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 700, marginTop: 4 }}>
            ✓ Cahier des charges tenu
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            EMV GÉNÉRÉ ESTIMÉ
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#8E44AD', marginTop: 4 }}>
            42.5M
          </div>
          <div style={{ fontSize: 11, color: '#8E44AD', fontWeight: 700, marginTop: 4 }}>
            FCFA valeur média équiv.
          </div>
        </div>
      </div>

      {/* ─── 2. RÉPARTITION PAR TIER & PAR CATÉGORIE ÉDITORIALE ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {/* Par Tier */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⭐</span> Répartition du Vivier par Tier (Taille)
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
              Stratégie mixant Nano, Micro et Mega-influenceurs
            </p>

            <div style={{ height: 180, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdowns.influencersByTier}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                  >
                    {breakdowns.influencersByTier.map((entry, index) => (
                      <Cell key={`cell-tier-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                    formatter={(val, name) => [`${val} talents`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, paddingTop: 12, borderTop: '1px solid #F0F0F0' }}>
            {breakdowns.influencersByTier.map((t, idx) => (
              <div key={idx} style={{ padding: '8px 10px', borderRadius: 8, background: '#FAFAFA', border: '1px solid #E5E5E5', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--dark)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: t.color }} />
                  {t.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {t.count} talents · Reach {t.reach}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Par Catégorie Thématique */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎨</span> Thématiques Éditoriales Prisées
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
            Répartition des créateurs par univers d’expression
          </p>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={breakdowns.influencersByCategory}
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                />
                <Bar dataKey="count" name="Créateurs" fill="#FF7900" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── 3. TABLEAU DES TALENTS & LIVRABLES (Style Traffic Manager) ─── */}
      <div className="card" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: '#FFFFFF' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⭐</span> Fiches Opérationnelles des Influenceurs ({displayInfluencers.length})
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
              Talents sous contrat, cahier des charges et statuts de qualification
            </p>
          </div>

          <input
            type="search"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="🔍 Rechercher nom, pseudo..."
            style={{ fontSize: 13, padding: '7px 12px', borderRadius: 8, border: '1px solid #D0D0D0', width: 220, outline: 'none' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E0E0E0' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Créateur / Talent</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Pseudo Social</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Réseaux Principaux</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Cahier des Charges</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Statut Contractuel</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)' }}>EMV Estimée</th>
              </tr>
            </thead>
            <tbody>
              {displayInfluencers.slice(0, 15).map((inf, i) => (
                <tr key={inf.id || i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--dark)' }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/influence?tab=fiche&influencerId=${encodeURIComponent(inf.id)}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        font: 'inherit',
                        fontWeight: 700,
                        color: 'var(--dark)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#FF7900'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--dark)'}
                      title="Consulter la fiche profil de ce talent"
                    >
                      {inf.display_name} ↗
                    </button>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#FF7900' }}>
                    {inf.pseudo || '@talent'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(inf.platform_profiles || []).map((p, pIdx) => (
                        <span key={pIdx} className="tag tag-gray" style={{ fontSize: 10 }}>
                          {p.platform}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--body)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={inf.cahier_charges}>
                    {inf.cahier_charges || '1 post + 2 stories / semaine'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="tag tag-green">
                      {inf.qualification_status === 'contrat_signe' ? 'Contrat Signé' : 'Actif'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#8E44AD' }}>
                    {((i + 1) * 1250000).toLocaleString('fr-FR')} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
