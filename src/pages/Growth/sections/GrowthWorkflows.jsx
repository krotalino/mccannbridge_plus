import { GROWTH_WORKFLOWS } from '../../../data/growth';

export default function GrowthWorkflows() {
  const statusMap = { active: { label: 'Actif', color: 'var(--green)' }, paused: { label: 'En pause', color: 'var(--yellow)' }, draft: { label: 'Brouillon', color: 'var(--muted)' } };

  return (
    <div>
      <div className="flex justify-between items-center mb-20">
        <p className="text-sm text-muted">Workflows automatiques basés sur des règles si/alors pour orchestrer les actions Growth.</p>
        <button className="btn btn-orange btn-sm">+ Nouveau Workflow</button>
      </div>
      {GROWTH_WORKFLOWS.map(wf => {
        const st = statusMap[wf.status] || { label: wf.status, color: 'var(--muted)' };
        return (
          <div key={wf.id} className="card mb-12">
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="flex items-center gap-8 mb-4">
                  <div className="text-md font-bold text-dark">⚙️ {wf.name}</div>
                  <span className="tag" style={{ background: st.color + '18', color: st.color }}>{st.label}</span>
                </div>
                <div className="text-xs text-muted">{wf.executions} exécutions{wf.lastRun ? ` • Dernière: ${wf.lastRun}` : ''}</div>
              </div>
            </div>
            <div className="gh-workflow-flow">
              <div className="gh-wf-trigger">
                <div className="text-xs font-bold text-muted mb-4">DÉCLENCHEUR</div>
                <div className="text-sm">{wf.trigger}</div>
              </div>
              <div className="gh-wf-arrow">→</div>
              <div className="gh-wf-actions">
                <div className="text-xs font-bold text-muted mb-4">ACTIONS</div>
                {wf.actions.map((a, i) => (
                  <div key={i} className="gh-wf-action-item">
                    <span className="gh-wf-step">{i + 1}</span> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
