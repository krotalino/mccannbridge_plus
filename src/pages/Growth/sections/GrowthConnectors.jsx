import { GROWTH_CONNECTORS } from '../../../data/growth';

export default function GrowthConnectors() {
  const statusMap = { active: { label: 'Connecté', color: 'var(--green)', dot: '🟢' }, warning: { label: 'Retard', color: 'var(--yellow)', dot: '🟡' }, error: { label: 'Erreur', color: 'var(--red)', dot: '🔴' }, inactive: { label: 'Inactif', color: 'var(--muted)', dot: '⚪' } };
  const byType = {};
  GROWTH_CONNECTORS.forEach(c => { if (!byType[c.type]) byType[c.type] = []; byType[c.type].push(c); });

  return (
    <div>
      <div className="flex justify-between items-center mb-20">
        <div>
          <div className="flex gap-12">
            <span className="text-sm"><span style={{ color: 'var(--green)' }}>●</span> {GROWTH_CONNECTORS.filter(c => c.status === 'active').length} connectés</span>
            <span className="text-sm"><span style={{ color: 'var(--yellow)' }}>●</span> {GROWTH_CONNECTORS.filter(c => c.status === 'warning').length} retard</span>
            <span className="text-sm"><span style={{ color: 'var(--red)' }}>●</span> {GROWTH_CONNECTORS.filter(c => c.status === 'error').length} erreur</span>
          </div>
        </div>
        <button className="btn btn-orange btn-sm">+ Ajouter un connecteur</button>
      </div>
      {Object.entries(byType).map(([type, connectors]) => (
        <div key={type} className="mb-20">
          <h3 className="text-base font-bold text-dark mb-12">{type}</h3>
          <div className="grid grid-2 gap-12">
            {connectors.map(c => {
              const st = statusMap[c.status] || statusMap.inactive;
              return (
                <div key={c.id} className="card" style={{ borderLeft: `4px solid ${st.color}` }}>
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-10">
                      <span style={{ fontSize: 24 }}>{c.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-dark">{c.name}</div>
                        <div className="text-xs text-muted">{c.type}</div>
                      </div>
                    </div>
                    <span className="tag" style={{ background: st.color + '18', color: st.color }}>{st.dot} {st.label}</span>
                  </div>
                  <div className="flex gap-16 text-xs">
                    <div><span className="text-muted">Dernière sync:</span> <strong>{c.lastSync}</strong></div>
                    <div><span className="text-muted">Fraîcheur:</span> <strong style={{ color: c.status === 'active' ? 'var(--green)' : st.color }}>{c.freshness}</strong></div>
                  </div>
                  {c.status === 'error' && <button className="btn btn-red btn-sm mt-8">🔧 Reconnecter</button>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
