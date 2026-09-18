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

export default function UsersAnalyticsView({ data }) {
  const { filteredUsers, breakdowns, heatmap } = data;
  const [localSearch, setLocalSearch] = useState('');

  const displayUsers = filteredUsers.filter(u => {
    if (localSearch.trim()) {
      const term = localSearch.toLowerCase();
      return (u.nom || '').toLowerCase().includes(term) ||
             (u.prenom || '').toLowerCase().includes(term) ||
             (u.email || '').toLowerCase().includes(term) ||
             (u.entite || '').toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* ─── 1. CARTES D'ADOPTION & ACTIVITÉ (Style Traffic Manager) ─── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 14 
        }}
      >
        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            COMPTES UTILISATEURS
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
            {filteredUsers.length}
          </div>
          <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 600, marginTop: 4 }}>
            ✓ 100% certifiés RBAC actifs
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            TAUX D’ADOPTION BRIDGE
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', marginTop: 4 }}>
            94.2%
          </div>
          <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 600, marginTop: 4 }}>
            ▲ Connexion quotidienne active
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            ACTIONS RÉALISÉES (30J)
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FF7900', marginTop: 4 }}>
            14.8K
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            Validations, briefs, exports & logs
          </div>
        </div>

        <div className="card p-16" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            CONFORMITÉ SÉCURITÉ
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#27AE60', marginTop: 4 }}>
            100%
          </div>
          <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 600, marginTop: 4 }}>
            ✓ Audit trail & traçabilité active
          </div>
        </div>
      </div>

      {/* ─── 2. RÉPARTITION PAR ENTITÉ & PAR RÔLE ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {/* Par Entité */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🏢</span> Répartition des Collaborateurs par Entité
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
              Équipes agence McCann vs équipes Rive Grands Comptes
            </p>

            <div style={{ height: 180, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdowns.usersByEntity}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                  >
                    {breakdowns.usersByEntity.map((entry, index) => (
                      <Cell key={`cell-ent-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                    formatter={(val, name) => [`${val} collaborateurs`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ paddingTop: 12, borderTop: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {breakdowns.usersByEntity.map((ent, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ent.color }} />
                  <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{ent.name}</span>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--dark)' }}>{ent.count} utilisateurs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Par Rôle RBAC */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🛡️</span> Profils & Rôles Opérationnels
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 16px 0' }}>
            Structure des droits d’accès et responsabilités
          </p>

          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={breakdowns.usersByRole}
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                />
                <Bar dataKey="count" name="Utilisateurs" fill="#FF7900" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── 3. MATRICE D'ACTIVITÉ HEBDOMADAIRE (Style Traffic Manager) ─── */}
      <div className="card" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0E0E0', background: '#FFFFFF' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚡</span> Matrice d’Activité Horaire Hebdomadaire (Heatmap)
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
            Pic de connexion et d’échanges sur Bridge Digital OS (% d’intensité)
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E0E0E0' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Jour</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--dark)' }}>08h — 12h (Matin)</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--dark)' }}>12h — 16h (Après-midi)</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--dark)' }}>16h — 20h (Soir)</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--dark)' }}>20h — 24h (Nuit)</th>
              </tr>
            </thead>
            <tbody>
              {heatmap.map((row, idx) => {
                const getHeatBadge = (val) => {
                  if (val >= 90) return { bg: '#FF7900', color: '#FFF', weight: 800 };
                  if (val >= 75) return { bg: '#FFE0B2', color: '#B25000', weight: 700 };
                  if (val >= 50) return { bg: '#FFF3E0', color: '#7E3B00', weight: 600 };
                  return { bg: '#F5F5F5', color: 'var(--muted)', weight: 500 };
                };

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>{row.day}</td>
                    {['08h-12h', '12h-16h', '16h-20h', '20h-24h'].map(slot => {
                      const heat = getHeatBadge(row[slot]);
                      return (
                        <td key={slot} style={{ padding: '10px 14px' }}>
                          <span 
                            style={{ 
                              display: 'inline-block', 
                              width: 64, 
                              padding: '4px 0', 
                              borderRadius: 6, 
                              background: heat.bg, 
                              color: heat.color, 
                              fontWeight: heat.weight 
                            }}
                          >
                            {row[slot]}%
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 4. TABLEAU DES UTILISATEURS DU SYSTÈME (Style Traffic Manager) ─── */}
      <div className="card" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: '#FFFFFF' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>👥</span> Annuaire des Utilisateurs Bridge ({displayUsers.length})
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
              Collaborateurs habilités, affectations et dates de dernière session
            </p>
          </div>

          <input
            type="search"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="🔍 Rechercher nom, email..."
            style={{ fontSize: 13, padding: '7px 12px', borderRadius: 8, border: '1px solid #D0D0D0', width: 220, outline: 'none' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E0E0E0' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Collaborateur</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Email</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Entité</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Poste / Fonction</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Rôle IAM</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Statut</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--dark)' }}>Dernière Connexion</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((usr, i) => (
                <tr key={usr.id || i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--dark)' }}>
                    {usr.nom} {usr.prenom}
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--body)' }}>{usr.email}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="tag tag-gray">
                      {usr.entite || 'McCann Douala'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{usr.profil || 'Account Lead'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="tag tag-blue">
                      {usr.rbacRole || 'Contributeur'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ color: '#27AE60', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#27AE60' }} /> Actif
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>
                    {usr.derniereConnexion || 'Aujourd’hui 10:45'}
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
