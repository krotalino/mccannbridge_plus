import React, { useState } from 'react';
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

export default function CalendarAnalyticsView({ data }) {
  const { filteredPublications, breakdowns } = data;
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filtrage local
  const displayPubs = filteredPublications.filter(p => {
    if (statusFilter !== 'all' && p.statut !== statusFilter) return false;
    if (localSearch.trim()) {
      const term = localSearch.toLowerCase();
      return p.titre.toLowerCase().includes(term) ||
             p.clientName.toLowerCase().includes(term) ||
             p.canal.toLowerCase().includes(term);
    }
    return true;
  }).sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Données pour le bar chart empilé par canal & statut
  const channels = ['facebook', 'instagram', 'tiktok', 'linkedin', 'twitter', 'youtube'];
  const stackedData = channels.map(c => {
    const pubs = filteredPublications.filter(p => p.canal === c);
    return {
      channel: c.toUpperCase(),
      publie: pubs.filter(p => p.statut === 'publie').length,
      valide: pubs.filter(p => p.statut === 'valide').length,
      en_validation: pubs.filter(p => p.statut === 'en_validation').length,
      brouillon: pubs.filter(p => p.statut === 'brouillon').length
    };
  });

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* ─── 1. CARTES MÉTRIQUES ÉDITORIALES (Style Traffic Manager) ─── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 14 
        }}
      >
        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            TOTAL PUBLICATIONS
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
            {filteredPublications.length}
          </div>
          <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 600, marginTop: 4 }}>
            ✓ 100% assignées aux équipes CM
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            VALIDATION 1ER COUP
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
            92.4%
          </div>
          <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 600, marginTop: 4 }}>
            ▲ SLA Agence McCann dépassé
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            RESPECT DU PLANNING
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
            96.8%
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            Décalages minimes (&lt; 24h)
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            ENGAGEMENT MOYEN / POST
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FF7900', marginTop: 4 }}>
            8.4K
          </div>
          <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 600, marginTop: 4 }}>
            ▲ +14.2% vs trimestre N-1
          </div>
        </div>
      </div>

      {/* ─── 2. GRAPHIQUES : BARRES EMPILÉES PAR CANAL & DONUT FORMATS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {/* Barres empilées Statut par Canal */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📊</span> Répartition des Statuts de Publication par Canal
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
            Volume de posts par état d’avancement dans le pipeline éditorial
          </p>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar dataKey="publie" name="Publié" stackId="a" fill="#27AE60" />
                <Bar dataKey="valide" name="Validé (BAT prêt)" stackId="a" fill="#2980B9" />
                <Bar dataKey="en_validation" name="En validation client" stackId="a" fill="#F39C12" />
                <Bar dataKey="brouillon" name="Brouillon agence" stackId="a" fill="#95A5A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Formats de contenu */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🎨</span> Formats de Contenus Prisés
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
              Reels et Carrousels dominent la stratégie
            </p>

            <div style={{ height: 180, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdowns.publicationsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="type"
                  >
                    {breakdowns.publicationsByType.map((entry, index) => (
                      <Cell key={`cell-type-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                    formatter={(val, name) => [`${val} contenus`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ paddingTop: 12, borderTop: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {breakdowns.publicationsByType.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: t.color }} />
                  <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{t.type}</span>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--dark)' }}>{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. TABLEAU DES PUBLICATIONS (Style Traffic Manager) ─── */}
      <div className="card" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', padding: 0 }}>
        {/* Table Top Toolbar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: '#FFFFFF' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📅</span> Registre Détaillé des Publications ({displayPubs.length})
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
              Toutes les publications validées et diffusées sur les comptes gérés
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="search"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="🔍 Rechercher sujet, client..."
              style={{ fontSize: 13, padding: '7px 12px', borderRadius: 8, border: '1px solid #D0D0D0', width: 220, outline: 'none' }}
            />

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ fontSize: 13, padding: '7px 12px', borderRadius: 8, border: '1px solid #D0D0D0', background: '#FFFFFF', outline: 'none' }}
            >
              <option value="all">Tous statuts</option>
              <option value="publie">Publié</option>
              <option value="valide">Validé</option>
              <option value="en_validation">En validation</option>
              <option value="brouillon">Brouillon</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E0E0E0' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Client</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Titre du Contenu</th>
                <th 
                  style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)', cursor: 'pointer' }}
                  onClick={() => toggleSort('canal')}
                >
                  Canal ⬍
                </th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Format</th>
                <th 
                  style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)', cursor: 'pointer' }}
                  onClick={() => toggleSort('date')}
                >
                  Date ⬍
                </th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Statut</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)' }}>Sponsoring Ads</th>
                <th 
                  style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)', cursor: 'pointer' }}
                  onClick={() => toggleSort('impressions')}
                >
                  Impressions ⬍
                </th>
              </tr>
            </thead>
            <tbody>
              {displayPubs.map(pub => {
                const getStatusTag = (st) => {
                  switch (st) {
                    case 'publie': return <span className="tag tag-green">Publié</span>;
                    case 'valide': return <span className="tag tag-blue">Validé (BAT)</span>;
                    case 'en_validation': return <span className="tag tag-yellow">En validation</span>;
                    default: return <span className="tag tag-gray">Brouillon</span>;
                  }
                };

                return (
                  <tr key={pub.id} style={{ borderBottom: '1px solid #F0F0F0', transition: 'background 0.15s' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--dark)', whiteSpace: 'nowrap' }}>
                      {pub.clientName}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--body)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={pub.titre}>
                      {pub.titre}
                    </td>
                    <td style={{ padding: '10px 14px', textTransform: 'uppercase', fontWeight: 800, color: '#2980B9' }}>
                      {pub.canal}
                    </td>
                    <td style={{ padding: '10px 14px', textTransform: 'capitalize', color: 'var(--muted)' }}>
                      {pub.type}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {pub.date}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      {getStatusTag(pub.statut)}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      {pub.sponsoring ? (
                        <span style={{ fontWeight: 800, color: '#FF7900' }}>
                          {(pub.budgetAds).toLocaleString('fr-FR')} FCFA
                        </span>
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>Organique</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--dark)' }}>
                      {pub.impressions?.toLocaleString('fr-FR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
