import { BRIEF_STATUSES } from '../../../data/briefs';
import { formatCurrency } from '../../../utils/helpers';

export default function BriefsListView({ briefs, onSelectBrief, onStatusChange, onEditBrief }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-wrapper">
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: 20 }}>Réf. & Projet</th>
              <th>Typologie</th>
              <th>Sponsors Orange</th>
              <th>Go-Live</th>
              <th>Budget</th>
              <th>Avancement</th>
              <th>Statut & Cycle</th>
              <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {briefs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                  Aucun brief ne correspond aux critères de recherche.
                </td>
              </tr>
            ) : (
              briefs.map(brief => {
                const statusMeta = BRIEF_STATUSES[brief.status] || BRIEF_STATUSES.submitted;
                
                let days = null;
                if (brief.goLiveDate) {
                  const diff = new Date(brief.goLiveDate) - new Date();
                  days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                }

                return (
                  <tr key={brief.id} style={{ cursor: 'pointer' }} onClick={() => onSelectBrief(brief)}>
                    <td style={{ paddingLeft: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="brief-id-tag">{brief.id}</span>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{brief.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                            Soumis le {brief.submissionDate || 'N/A'} • {brief.agencyLead || 'Victor F. AKOA'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="tag tag-blue">{brief.typology}</span>
                    </td>

                    <td>
                      <div style={{ fontSize: 12 }}>
                        {(brief.sponsors || []).map(s => s.name).join(', ') || 'Équipe Orange'}
                      </div>
                    </td>

                    <td>
                      {brief.goLiveDate ? (
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{brief.goLiveDate}</div>
                          {days !== null && (
                            <div style={{ fontSize: 10, color: days <= 15 ? 'var(--red)' : days <= 45 ? 'var(--orange)' : 'var(--green)', fontWeight: 700 }}>
                              {days > 0 ? `dans ${days} j` : 'Live'}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>À définir</span>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>
                        {brief.budget ? formatCurrency(brief.budget) : 'NC'}
                      </div>
                      {brief.budgetConfidential && (
                        <span style={{ fontSize: 10, color: 'var(--red)' }}>Confidentiel</span>
                      )}
                    </td>

                    <td style={{ width: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar-sm" style={{ flex: 1 }}>
                          <div
                            className="progress-fill-sm"
                            style={{
                              width: `${brief.progress}%`,
                              background: brief.progress === 100 ? 'var(--green)' : statusMeta.color,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, minWidth: 30 }}>{brief.progress}%</span>
                      </div>
                    </td>

                    <td>
                      <select
                        value={brief.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                          e.stopPropagation();
                          onStatusChange(brief.id, e.target.value);
                        }}
                        className="kanban-quick-select"
                        style={{ background: statusMeta.bg, color: statusMeta.color, fontWeight: 700 }}
                      >
                        {Object.values(BRIEF_STATUSES).map(s => (
                          <option key={s.id} value={s.id}>{s.icon} {s.shortLabel}</option>
                        ))}
                      </select>
                    </td>

                    <td style={{ textAlign: 'right', paddingRight: 20 }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          onClick={() => onSelectBrief(brief)}
                        >
                          Inspecter
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          onClick={() => onEditBrief(brief)}
                        >
                          Éditer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
