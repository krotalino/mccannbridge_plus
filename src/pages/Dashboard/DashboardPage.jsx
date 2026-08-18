import { useState } from 'react';
import { ANALYTICS_DATA } from '../../data/analytics';

export default function DashboardPage() {
  const [tab, setTab] = useState('strategic');
  const [selectedCamp, setSelectedCamp] = useState(null);

  const tabs = [
    { id: 'strategic', label: 'Pilotage Stratégique' }, { id: 'deepdive', label: 'Deep Dive Campagnes' },
    { id: 'benchmark', label: 'Benchmark' }, { id: 'reporting', label: 'Calendrier Reporting' },
    { id: 'terrain', label: 'Terrain & Insights' },
  ];

  return (
    <div>
      <div className="dashboard-header-row mb-20">
        <h1 className="text-2xl font-bold text-dark">📊 Dashboard Analytics</h1>
        <div className="dashboard-tab-bar">
          {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`tab-item ${tab === t.id ? 'active' : ''}`}>{t.label}</button>)}
        </div>
      </div>

      {tab === 'strategic' && (
        <div>
          <div className="ai-banner mb-20">
            <strong>📊 BRIEFING STRATÉGIQUE — Steve BESSOUBE</strong><br />
            {ANALYTICS_DATA.campaigns.filter(c => c.status === 'active').length} campagnes actives. {ANALYTICS_DATA.campaigns.filter(c => c.verdict === 'ajuster').length} en ajustement. Engagement moyen : 5.1% (vs 4.7% benchmark). Opportunité : MTN accélère sur TikTok — Orange doit prioritiser Reels + Shorts.
          </div>
          <div className="grid grid-4 mb-20">
            {[{ l: 'Reach total', v: (ANALYTICS_DATA.campaigns.reduce((s, c) => s + (c.results?.reach || 0), 0) / 1000000).toFixed(1) + 'M', c: 'var(--orange)' }, { l: 'Engagement moyen', v: '5.1%', c: 'var(--blue)' }, { l: 'Contenus publiés', v: ANALYTICS_DATA.platforms.reduce((s, p) => s + p.posts, 0).toString(), c: 'var(--dark)' }, { l: 'Objectifs atteints', v: '50%', c: 'var(--green)' }].map((k, i) => (
              <div key={i} className="card kpi-card"><div className="kpi-label">{k.l}</div><div className="kpi-value" style={{ color: k.c }}>{k.v}</div></div>
            ))}
          </div>
          <h3 className="text-md font-bold text-dark mb-12">Santé des campagnes en cours</h3>
          {ANALYTICS_DATA.campaigns.filter(c => c.status === 'active').map(camp => {
            const rp = Math.round((camp.results.reach / camp.briefObjectives.reach) * 100);
            const ep = Math.round((camp.results.engagement / camp.briefObjectives.engagement) * 100);
            const cp = Math.round((camp.results.conversions / camp.briefObjectives.conversions) * 100);
            const vc = camp.verdict === 'maintenir' ? 'var(--green)' : camp.verdict === 'ajuster' ? 'var(--yellow)' : 'var(--red)';
            return (
              <div key={camp.id} className="card mb-12">
                <div className="flex justify-between items-start mb-12">
                  <div><div className="text-md font-bold text-dark">{camp.name}</div><div className="text-sm text-muted">{camp.segment} • {camp.startDate} → {camp.endDate}</div></div>
                  <span className="tag" style={{ background: vc + '22', color: vc }}>{camp.verdict.toUpperCase()}</span>
                </div>
                {camp.alertMidParcours && <div className="alert alert-red mb-12"><strong>⚠️ ALERTE</strong><div className="text-sm mt-4">{camp.alertMidParcours.message}</div></div>}
                <div className="grid grid-3 gap-12 mb-12">
                  {[{ l: 'Reach', p: rp }, { l: 'Engagement', p: ep }, { l: 'Conversions', p: cp }].map((m, i) => { const mc = m.p >= 85 ? 'var(--green)' : m.p >= 65 ? 'var(--yellow)' : 'var(--red)'; return (
                    <div key={i}><div className="text-xs text-muted mb-4">{m.l}</div><div className="progress-track mb-4"><div className="progress-fill" style={{ background: mc, width: `${Math.min(100, m.p)}%` }} /></div><div className="text-xs font-bold" style={{ color: mc }}>{m.p}%</div></div>
                  ); })}
                </div>
                <button onClick={() => { setSelectedCamp(camp.id); setTab('deepdive'); }} className="btn btn-ghost btn-full">Deep Dive →</button>
              </div>
            );
          })}
          <h3 className="text-md font-bold text-dark mb-12 mt-20">Performance par plateforme</h3>
          <div className="grid grid-5">
            {ANALYTICS_DATA.platforms.map((p, i) => (
              <div key={i} className="card kpi-card">
                <div className="text-sm font-bold text-dark mb-8">{p.name}</div>
                <div className="font-bold text-dark">{(p.followers / 1000).toFixed(0)}K</div><div className="text-xs text-muted mb-4">followers</div>
                <div className="text-sm font-bold text-blue">{p.engagement}%</div><div className="text-xs text-muted">engagement</div>
                <div className="text-xs mt-8" style={{ color: p.growth.includes('+') ? 'var(--green)' : 'var(--red)' }}>{p.growth}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'deepdive' && (
        <div>
          {!selectedCamp ? (
            <div className="card text-center" style={{ padding: 40 }}>
              <div className="text-md text-muted mb-12">Sélectionnez une campagne pour l'analyse approfondie</div>
              <div className="flex gap-8 justify-center flex-wrap">{ANALYTICS_DATA.campaigns.map(c => <button key={c.id} onClick={() => setSelectedCamp(c.id)} className="btn btn-orange">{c.name}</button>)}</div>
            </div>
          ) : (() => {
            const camp = ANALYTICS_DATA.campaigns.find(c => c.id === selectedCamp);
            if (!camp) return null;
            return (
              <div>
                <div className="flex justify-between items-start mb-20">
                  <div><h2 className="text-xl font-bold text-dark mb-4">{camp.name}</h2><div className="text-sm text-muted">{camp.segment} • {camp.startDate} → {camp.endDate}</div></div>
                  <button onClick={() => setSelectedCamp(null)} className="btn btn-ghost">← Retour</button>
                </div>
                <div className="card mb-16"><h3 className="text-base font-bold text-dark mb-12">Brief Initial</h3><p className="text-sm" style={{ lineHeight: 1.6 }}>{camp.briefObjectives.description}</p>
                  <div className="grid grid-3 gap-12 mt-12">
                    <div><div className="text-xs text-muted">Reach cible</div><div className="text-lg font-bold">{(camp.briefObjectives.reach / 1000).toFixed(0)}K</div></div>
                    <div><div className="text-xs text-muted">Engagement cible</div><div className="text-lg font-bold">{camp.briefObjectives.engagement}%</div></div>
                    <div><div className="text-xs text-muted">Conversions cible</div><div className="text-lg font-bold">{camp.briefObjectives.conversions.toLocaleString()}</div></div>
                  </div>
                </div>
                <div className="card mb-16"><h3 className="text-base font-bold text-dark mb-12">Analyse Critique (Deep Dive)</h3>
                  <div style={{ background: '#f9f9f9', borderRadius: 6, padding: 12, borderLeft: '3px solid var(--blue)', fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{camp.deepDive}</div>
                </div>
                <div className="card mb-16 text-center" style={{ padding: 24 }}>
                  <div className="text-sm text-muted mb-8">Verdict Stratégique</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: camp.verdict === 'maintenir' ? 'var(--green)' : camp.verdict === 'ajuster' ? 'var(--yellow)' : 'var(--red)', textTransform: 'uppercase' }}>{camp.verdict}</div>
                </div>
                {camp.learnings.length > 0 && <div className="card mb-16"><h3 className="text-base font-bold text-dark mb-12">Enseignements (Test & Learn)</h3><ul style={{ marginLeft: 20 }}>{camp.learnings.map((l, i) => <li key={i} className="text-sm mb-8" style={{ lineHeight: 1.5 }}>{l}</li>)}</ul></div>}
                {camp.terrainNotes && <div className="card mb-16"><h3 className="text-base font-bold text-dark mb-12">📍 Notes Terrain</h3><div style={{ background: camp.stevePresent ? '#E8F5E9' : '#f0f0f0', borderRadius: 6, padding: 12, borderLeft: `3px solid ${camp.stevePresent ? 'var(--green)' : 'var(--muted)'}` }}><div className="text-sm font-bold text-dark mb-8">{camp.stevePresent ? '✅ Présent sur le terrain' : '❌ Non présent'}</div><div className="text-sm" style={{ lineHeight: 1.6 }}>{camp.terrainNotes}</div></div></div>}
              </div>
            );
          })()}
        </div>
      )}

      {tab === 'benchmark' && (
        <div>
          <p className="text-base text-muted mb-20">Veille concurrentielle — {ANALYTICS_DATA.benchmark.period}</p>
          <div className="card mb-20"><h3 className="text-base font-bold text-dark mb-12">Orange vs Concurrents</h3>
            <table className="table"><thead><tr><th>Métrique</th><th className="text-center">Orange 🟠</th><th className="text-center">MTN</th><th className="text-center">Camtel</th></tr></thead>
              <tbody>{[{ l: 'Followers', o: ANALYTICS_DATA.benchmark.orangeStats.followers, m: ANALYTICS_DATA.benchmark.competitors[0].followers, c: ANALYTICS_DATA.benchmark.competitors[1].followers }, { l: 'Engagement', o: ANALYTICS_DATA.benchmark.orangeStats.engagement, m: ANALYTICS_DATA.benchmark.competitors[0].engagement, c: ANALYTICS_DATA.benchmark.competitors[1].engagement }, { l: 'Posts/semaine', o: ANALYTICS_DATA.benchmark.orangeStats.postsPerWeek, m: ANALYTICS_DATA.benchmark.competitors[0].postsPerWeek, c: ANALYTICS_DATA.benchmark.competitors[1].postsPerWeek }, { l: 'Format dominant', o: ANALYTICS_DATA.benchmark.orangeStats.topFormat, m: ANALYTICS_DATA.benchmark.competitors[0].topFormat, c: ANALYTICS_DATA.benchmark.competitors[1].topFormat }].map((r, i) => <tr key={i}><td className="font-semibold">{r.l}</td><td className="text-center">{r.o}</td><td className="text-center">{r.m}</td><td className="text-center">{r.c}</td></tr>)}</tbody></table>
          </div>
          <div className="grid grid-2 gap-12 mb-20">
            <div className="card" style={{ background: 'rgba(39,174,96,0.06)', borderLeft: '4px solid var(--green)' }}><div className="text-sm font-bold text-green mb-8">💪 Point Fort Orange</div><div className="text-sm">Engagement supérieur (4.7% vs 3.8% MTN) — notre contenu est meilleur</div></div>
            <div className="card" style={{ background: 'rgba(231,76,60,0.06)', borderLeft: '4px solid var(--red)' }}><div className="text-sm font-bold text-red mb-8">⚠️ Point Faible Orange</div><div className="text-sm">Distribution inférieure (1.4M vs 2.1M followers MTN)</div></div>
          </div>
          <div className="card"><h3 className="text-base font-bold text-dark mb-12">Recommandations</h3><ol style={{ marginLeft: 20 }}>{ANALYTICS_DATA.benchmark.recommendations.map((r, i) => <li key={i} className="text-sm mb-8" style={{ lineHeight: 1.6 }}>{r}</li>)}</ol></div>
        </div>
      )}

      {tab === 'reporting' && (
        <div>
          <div className="card mb-20"><h3 className="text-base font-bold text-dark mb-12">Calendrier de Livraison</h3>
            <table className="table"><thead><tr><th>Type</th><th>Deadline</th><th>Statut</th><th>Dernière Livraison</th><th>Destinataire</th></tr></thead>
              <tbody>{ANALYTICS_DATA.reportingCalendar.map((r, i) => { const sc = r.status === 'en_retard' ? 'var(--red)' : r.status === 'en_cours' ? 'var(--yellow)' : 'var(--blue)'; const sl = r.status === 'en_retard' ? 'EN RETARD' : r.status === 'en_cours' ? 'EN COURS' : 'À VENIR'; return (<tr key={i}><td className="font-bold">{r.type}</td><td>{r.deadline}</td><td><span className="tag" style={{ background: sc + '22', color: sc }}>{sl}</span></td><td className="text-muted">{r.lastDelivered}</td><td>{r.recipient}</td></tr>); })}</tbody></table>
          </div>
          {ANALYTICS_DATA.reportingCalendar.find(r => r.status === 'en_retard') && <div className="alert alert-red mb-20" style={{ padding: 16 }}><strong>🚨 RETARD DÉTECTÉ</strong><div className="text-sm mt-4">Le rapport hebdomadaire devait être livré lundi 10h. Relancer Steve pour livraison urgente.</div></div>}
        </div>
      )}

      {tab === 'terrain' && (
        <div>
          <div className="alert alert-blue mb-20" style={{ padding: 16 }}><strong>💡 Vérité Terrain vs Apparence Digitale</strong><div className="text-sm mt-8" style={{ lineHeight: 1.6 }}>La présence terrain révèle des discordances. Exemple: Pulse Campus annonce 500 visiteurs, réalité ~200. Digital seul ne capture pas ces frictions.</div></div>
          <h3 className="text-base font-bold text-dark mb-12">Présence par campagne</h3>
          {ANALYTICS_DATA.campaigns.map((c, i) => (
            <div key={i} className="card mb-12">
              <div className="flex justify-between items-start mb-12"><div className="text-sm font-bold text-dark">{c.name}</div><span className={`tag ${c.stevePresent ? 'tag-green' : 'tag-muted'}`}>{c.stevePresent ? '✅ Présent' : 'Non présent'}</span></div>
              {c.terrainNotes && <div style={{ background: '#f9f9f9', borderRadius: 6, padding: 10, fontSize: 11, lineHeight: 1.6, fontStyle: 'italic', borderLeft: '3px solid var(--orange)' }}>{c.terrainNotes}</div>}
              {!c.terrainNotes && !c.stevePresent && <div className="text-sm text-muted" style={{ fontStyle: 'italic' }}>Pas d'observations terrain</div>}
            </div>
          ))}
          <h3 className="text-base font-bold text-dark mb-12 mt-20">Compilation des Enseignements</h3>
          <div className="card"><ul style={{ marginLeft: 20 }}>{ANALYTICS_DATA.campaigns.flatMap(c => c.learnings).map((l, i) => <li key={i} className="text-sm mb-8" style={{ lineHeight: 1.5 }}>{l}</li>)}</ul></div>
        </div>
      )}
    </div>
  );
}
