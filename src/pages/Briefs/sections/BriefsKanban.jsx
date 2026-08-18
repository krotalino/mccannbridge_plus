import { BRIEF_STATUSES } from '../../../data/briefs';
import { formatCurrency } from '../../../utils/helpers';

export default function BriefsKanban({ briefs, onSelectBrief, onStatusChange }) {
  // 8 column stages
  const columns = [
    BRIEF_STATUSES.draft,
    BRIEF_STATUSES.submitted,
    BRIEF_STATUSES.tech_review,
    BRIEF_STATUSES.approved,
    BRIEF_STATUSES.in_progress,
    BRIEF_STATUSES.uat,
    BRIEF_STATUSES.live,
    BRIEF_STATUSES.on_hold,
  ];

  return (
    <div className="briefs-kanban-board">
      {columns.map(col => {
        const colBriefs = briefs.filter(b => b.status === col.id);

        return (
          <div key={col.id} className="kanban-column">
            {/* Column Header */}
            <div className="kanban-col-header" style={{ borderTopColor: col.color }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="kanban-col-icon">{col.icon}</span>
                <span className="kanban-col-title">{col.label}</span>
              </div>
              <span className="kanban-col-count" style={{ background: col.bg, color: col.color }}>
                {colBriefs.length}
              </span>
            </div>

            {/* Column Body / Cards */}
            <div className="kanban-col-body">
              {colBriefs.length === 0 ? (
                <div className="kanban-empty-slot">
                  <span>Aucun brief</span>
                </div>
              ) : (
                colBriefs.map(brief => {
                  // Days left
                  let daysToGoLive = null;
                  if (brief.goLiveDate) {
                    const target = new Date(brief.goLiveDate);
                    const now = new Date();
                    daysToGoLive = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
                  }

                  return (
                    <div
                      key={brief.id}
                      className="kanban-brief-card"
                      onClick={() => onSelectBrief(brief)}
                    >
                      {/* Top Badges */}
                      <div className="kanban-card-top">
                        <span className="kanban-card-id">{brief.id}</span>
                        <span className="tag tag-blue" style={{ fontSize: 10 }}>{brief.typology}</span>
                      </div>

                      {/* Title */}
                      <h4 className="kanban-card-title">{brief.title}</h4>

                      {/* Go-Live & SubStatus */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, margin: '8px 0' }}>
                        {brief.subStatus && (
                          <span className="tag tag-muted" style={{ fontSize: 10 }}>
                            ⚙️ {brief.subStatus}
                          </span>
                        )}
                        {daysToGoLive !== null && (
                          <span className={`tag ${daysToGoLive <= 15 ? 'tag-red' : daysToGoLive <= 45 ? 'tag-orange' : 'tag-green'}`} style={{ fontSize: 10 }}>
                            🚀 {daysToGoLive > 0 ? `J-${daysToGoLive}` : 'Live'}
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div style={{ margin: '8px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>
                          <span>Avancement</span>
                          <span style={{ fontWeight: 700 }}>{brief.progress}%</span>
                        </div>
                        <div className="progress-bar-sm">
                          <div
                            className="progress-fill-sm"
                            style={{
                              width: `${brief.progress}%`,
                              background: brief.progress === 100 ? 'var(--green)' : col.color,
                            }}
                          />
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="kanban-card-footer">
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--dark)' }}>
                          {brief.budget ? formatCurrency(brief.budget) : 'Budget NC'}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {/* Quick Status Mover */}
                          <select
                            value={brief.status}
                            onClick={e => e.stopPropagation()}
                            onChange={e => {
                              e.stopPropagation();
                              onStatusChange(brief.id, e.target.value);
                            }}
                            className="kanban-quick-select"
                            title="Déplacer vers un autre statut"
                          >
                            {columns.map(c => (
                              <option key={c.id} value={c.id}>{c.icon} {c.shortLabel}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
