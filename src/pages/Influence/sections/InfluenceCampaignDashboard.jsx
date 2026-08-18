import { INFLUENCE_CAMPAIGNS } from '../../../data/influencers';

export default function InfluenceCampaignDashboard({ influencers }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-dark mb-16">Supervision & Pilotage des Campagnes</h2>
      
      {INFLUENCE_CAMPAIGNS.map(camp => {
        const campInf = influencers.filter(i => camp.influencers.includes(i.id));
        return (
          <div key={camp.id} className="card mb-16 shadow-sm" style={{ borderLeft: `4px solid ${camp.status === 'active' ? 'var(--green)' : 'var(--yellow)'}` }}>
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-lg font-bold text-dark mb-4">{camp.name}</h3>
                <div className="text-sm text-muted">{camp.startDate} → {camp.endDate} • Budget: {(camp.budget / 1000000).toFixed(1)}M FCFA</div>
              </div>
              <span className={`tag ${camp.status === 'active' ? 'tag-green' : 'tag-yellow'}`}>{camp.status === 'active' ? 'En cours' : 'Briefing / Setup'}</span>
            </div>
            
            <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div className="text-sm font-semibold text-dark mb-8">Casting & Avancement ({campInf.length} talents)</div>
              <div className="flex flex-wrap gap-8">
                {campInf.map(i => (
                  <span key={i.id} className="tag" style={{ background: 'var(--orange)', color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:'var(--green)'}}></div>
                    @{i.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-3 gap-16 mb-16">
              {[{ l: 'Reach Global', c: camp.results.reach, t: camp.kpis.reachTarget }, 
                { l: 'Engagement Total', c: camp.results.engagement, t: camp.kpis.engagementTarget }, 
                { l: 'Conversions', c: camp.results.conversions, t: camp.kpis.conversionsTarget }].map((k, i) => (
                <div key={i} className="kpi-card p-12" style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8 }}>
                  <div className="text-xs text-muted mb-4">{k.l}</div>
                  <div className="text-base font-bold text-dark mb-4">{k.c} <span className="text-xs font-normal text-muted">/ {k.t}</span></div>
                  <div className="progress-track mt-8">
                    <div className="progress-fill" style={{ background: 'var(--orange)', width: `${Math.min(100, (k.c / k.t) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-8 mt-12 text-sm border-t pt-12 border-gray-100">
              <span className="font-semibold text-muted text-xs mr-8">État des livrables :</span>
              <div className="tag tag-green text-xs">✓ {camp.contentValidated} validés</div>
              <div className="tag tag-yellow text-xs">⏳ {camp.contentPending} en attente</div>
              <div className="tag tag-red text-xs">⚠ 0 en retard</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
