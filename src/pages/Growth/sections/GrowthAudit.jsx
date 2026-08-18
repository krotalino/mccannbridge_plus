import { GROWTH_AUDIT_LOG } from '../../../data/growth';

export default function GrowthAudit() {
  return (
    <div>
      <div className="grid grid-3 mb-20">
        <div className="card kpi-card" style={{ borderLeft: '4px solid var(--green)' }}>
          <div className="kpi-label">Actions tracées</div>
          <div className="kpi-value" style={{ color: 'var(--green)' }}>{GROWTH_AUDIT_LOG.length}</div>
        </div>
        <div className="card kpi-card" style={{ borderLeft: '4px solid var(--blue)' }}>
          <div className="kpi-label">Utilisateurs actifs</div>
          <div className="kpi-value" style={{ color: 'var(--blue)' }}>{new Set(GROWTH_AUDIT_LOG.map(l => l.user)).size}</div>
        </div>
        <div className="card kpi-card" style={{ borderLeft: '4px solid var(--orange)' }}>
          <div className="kpi-label">Environnement</div>
          <div className="kpi-value text-orange" style={{ fontSize: 20 }}>Production</div>
        </div>
      </div>

      <h3 className="text-md font-bold text-dark mb-12">📋 Journal d'Audit</h3>
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Action</th><th>Objet</th><th>Utilisateur</th><th>Détail</th></tr>
          </thead>
          <tbody>
            {GROWTH_AUDIT_LOG.map(log => (
              <tr key={log.id}>
                <td className="text-xs text-muted" style={{ whiteSpace: 'nowrap' }}>{log.date}</td>
                <td><span className="tag tag-blue">{log.action}</span></td>
                <td className="font-bold text-sm">{log.object}</td>
                <td className="text-sm">{log.user}</td>
                <td className="text-xs text-muted">{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-md font-bold text-dark mb-12 mt-20">🛡️ Permissions RBAC Growth</h3>
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Rôle</th><th className="text-center">Voir</th><th className="text-center">Commenter</th><th className="text-center">Créer</th><th className="text-center">Lancer test</th><th className="text-center">Approuver</th><th className="text-center">Exporter</th><th className="text-center">Admin</th></tr>
          </thead>
          <tbody>
            {[
              { role: 'Growth Lead', perms: [true, true, true, true, true, true, true] },
              { role: 'Growth Analyst', perms: [true, true, true, false, false, true, false] },
              { role: 'Client Manager', perms: [true, true, false, false, true, true, false] },
              { role: 'Viewer', perms: [true, false, false, false, false, false, false] },
            ].map((r, i) => (
              <tr key={i}>
                <td className="font-bold text-sm">{r.role}</td>
                {r.perms.map((p, j) => (
                  <td key={j} className="text-center">
                    <span style={{ color: p ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>{p ? '✓' : '✗'}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
