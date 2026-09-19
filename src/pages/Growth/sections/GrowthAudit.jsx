import { GROWTH_AUDIT_LOG } from '../../../data/growth';

export default function GrowthAudit() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── 3 CARTES STATUT AUDIT (Style Influence) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        <div 
          className="card p-16" 
          style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0', borderLeft: '4px solid #27AE60' }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            Actions Traçables
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#27AE60', marginTop: 4 }}>
            {GROWTH_AUDIT_LOG.length} événements
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Journal immuable horodaté
          </div>
        </div>

        <div 
          className="card p-16" 
          style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0', borderLeft: '4px solid #2980B9' }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            Opérateurs Actifs
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#2980B9', marginTop: 4 }}>
            {new Set(GROWTH_AUDIT_LOG.map(l => l.user)).size} contributeurs
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Équipe McCann & Orange CM
          </div>
        </div>

        <div 
          className="card p-16" 
          style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0', borderLeft: '4px solid #FF7900' }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            Environnement de Production
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#FF7900', marginTop: 4 }}>
            Production Certifiée
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            Maxit v4.2 / OM Web
          </div>
        </div>
      </div>

      {/* ─── TABLE JOURNAL D'AUDIT ─── */}
      <div 
        className="card p-16" 
        style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden' }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', marginBottom: 12 }}>
          📋 Registre d'Audit & Gouvernance des Tests
        </h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr style={{ background: '#F8F9FA' }}>
                <th className="py-8 px-12 text-left text-xs font-bold text-muted">Horodatage</th>
                <th className="py-8 px-12 text-left text-xs font-bold text-muted">Action</th>
                <th className="py-8 px-12 text-left text-xs font-bold text-muted">Objet</th>
                <th className="py-8 px-12 text-left text-xs font-bold text-muted">Opérateur</th>
                <th className="py-8 px-12 text-left text-xs font-bold text-muted">Détail Opérationnel</th>
              </tr>
            </thead>
            <tbody>
              {GROWTH_AUDIT_LOG.map(log => (
                <tr key={log.id} className="border-b" style={{ borderColor: '#F0F0F0' }}>
                  <td className="py-10 px-12 text-xs text-muted" style={{ whiteSpace: 'nowrap' }}>{log.date}</td>
                  <td className="py-10 px-12">
                    <span className="tag tag-blue" style={{ fontSize: 10.5, fontWeight: 700 }}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-10 px-12 font-bold text-sm text-dark">{log.object}</td>
                  <td className="py-10 px-12 text-sm">{log.user}</td>
                  <td className="py-10 px-12 text-xs text-muted">{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── PERMISSIONS RBAC ─── */}
      <div 
        className="card p-16" 
        style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden' }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', marginBottom: 12 }}>
          🛡️ Matrice de Contrôle d'Accès RBAC Growth
        </h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr style={{ background: '#F8F9FA' }}>
                <th className="py-8 px-12 text-left text-xs font-bold text-muted">Rôle Métier</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">Consulter</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">Commenter</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">Créer Idée</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">Lancer A/B</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">Approuver</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">Exporter</th>
                <th className="py-8 px-12 text-center text-xs font-bold text-muted">Gouvernance</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: 'Growth Lead (McCann)', perms: [true, true, true, true, true, true, true] },
                { role: 'Growth Analyst', perms: [true, true, true, false, false, true, false] },
                { role: 'Product Manager (Orange CM)', perms: [true, true, false, false, true, true, false] },
                { role: 'Observateur & Direction', perms: [true, false, false, false, false, true, false] },
              ].map((r, i) => (
                <tr key={i} className="border-b" style={{ borderColor: '#F0F0F0' }}>
                  <td className="py-10 px-12 font-bold text-sm text-dark">{r.role}</td>
                  {r.perms.map((p, j) => (
                    <td key={j} className="py-10 px-12 text-center">
                      <span style={{ color: p ? '#27AE60' : '#E74C3C', fontWeight: 800, fontSize: 13 }}>
                        {p ? '✓' : '✗'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
