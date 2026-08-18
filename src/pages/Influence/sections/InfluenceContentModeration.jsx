export default function InfluenceContentModeration({ influencers }) {
  const allDel = influencers.flatMap(i => i.pendingDeliverables.map(d => ({ ...d, influencer: i.name })));
  const overdue = allDel.filter(d => d.daysLeft < 0);

  return (
    <div>
      <h2 className="text-xl font-bold text-dark mb-16">Modération & Validation des Contenus</h2>
      
      <div className="grid mb-20" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {['Brouillons soumis', 'En révision', 'Modifications demandées', 'Approuvés (Prêts à publier)'].map((s, i) => (
          <div key={i} className="card text-center py-12" style={{ background: i === 3 ? 'rgba(39,174,96,0.1)' : '#f9f9f9' }}>
            <div className="text-xl font-bold" style={{ color: i === 3 ? 'var(--green)' : 'var(--dark)' }}>{i === 0 ? 5 : i === 1 ? 2 : i === 2 ? 1 : 12}</div>
            <div className="text-xs text-muted font-semibold mt-4">{s}</div>
          </div>
        ))}
      </div>

      {overdue.length > 0 && (
        <div className="alert alert-red mb-16">
          <strong>ALERT: {overdue.length} livrable(s) en retard</strong>
          {overdue.map((d, i) => <div key={i} className="text-sm mt-4">• @{d.influencer} — {d.title} (retard de {-d.daysLeft}j)</div>)}
        </div>
      )}

      {allDel.length === 0 ? (
        <div className="text-sm text-muted text-center" style={{ padding: 20 }}>Aucun livrable en attente</div>
      ) : (
        <div className="grid grid-auto gap-16">
          {allDel.map((d, i) => {
            const sc = { non_soumis: '#aaa', brouillon_soumis: 'var(--yellow)', en_retard: 'var(--red)' }[d.status] || 'var(--muted)';
            const sl = { non_soumis: 'Non soumis', brouillon_soumis: 'Brouillon à valider', en_retard: 'EN RETARD' }[d.status] || d.status;
            
            return (
              <div key={i} className="card shadow-sm" style={{ borderLeft: `4px solid ${sc}` }}>
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="text-sm font-bold text-dark">@{d.influencer}</div>
                    <div className="text-sm text-muted mt-2">{d.title}</div>
                    <div className="text-xs font-semibold mt-6" style={{ color: d.daysLeft > 0 ? 'var(--muted)' : 'var(--red)' }}>
                      Deadline: {d.deadline} {d.daysLeft > 0 ? `(${d.daysLeft}j restants)` : ''}
                    </div>
                  </div>
                  <span className="tag" style={{ background: sc + '22', color: sc }}>{sl}</span>
                </div>
                
                {d.status === 'brouillon_soumis' && (
                  <div className="mb-12" style={{ background: '#f5f5f5', borderRadius: 4, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>
                    [Aperçu du média]
                  </div>
                )}

                <div className="flex gap-8">
                  <button className="btn btn-green btn-sm" style={{ flex: 1 }}>✓ Approuver</button>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1, border: '1px solid #ddd' }}>💬 Demander retouches</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
