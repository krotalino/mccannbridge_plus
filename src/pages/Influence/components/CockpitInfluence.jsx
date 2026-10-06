import React, { useMemo } from 'react';
import {
  computeCockpitKpis,
  computePrioritaryRisks,
  getDeliverableSnapshots
} from '../InfluenceStore';
import { formatNumber, Badge, PlatformIcon, AnalyticsKpiCard } from './InfluenceCommon';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function CockpitInfluence({ data, onNavigate }) {
  const kpis = useMemo(() => computeCockpitKpis(data), [data]);
  const risks = useMemo(() => computePrioritaryRisks(data), [data]);
  const snapshots = useMemo(() => getDeliverableSnapshots(data.snapshots || []), [data.snapshots]);

  // Platforms breakdown formatted for Recharts
  const platformsData = useMemo(() => {
    const map = new Map();
    for (const d of data.deliverables || []) {
      const p = d.platform || 'unknown';
      map.set(p, (map.get(p) || 0) + 1);
    }
    const colors = {
      tiktok: '#8E44AD',
      facebook: '#2980B9',
      instagram: '#FF7900',
      youtube: '#E74C3C',
      website: '#7F8C8D',
      unknown: '#BDC3C7'
    };
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([plat, count]) => ({
        name: plat.charAt(0).toUpperCase() + plat.slice(1),
        rawPlatform: plat,
        count,
        fill: colors[plat] || '#FF7900'
      }));
  }, [data.deliverables]);

  // Content subjects breakdown
  const subjects = useMemo(() => {
    const map = new Map();
    for (const d of data.deliverables || []) {
      const sub = (d.content_subject || 'Non renseigné').trim();
      map.set(sub, (map.get(sub) || 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [data.deliverables]);

  // Campaigns performance overview (strictly real data, filtering out demo/example campaigns)
  const campaignsSummary = useMemo(() => {
    const cleanCampaigns = (data.campaigns || []).filter(
      camp => camp && !camp.isDemo && !camp.isExample && camp.id !== 'CAMP-ORANGE-Q4-2025' && !camp.id?.startsWith('mock-')
    );
    return cleanCampaigns.map(camp => {
      const delivs = (data.deliverables || []).filter(d => d.campaign_id === camp.id && !d.isDemo && !d.isExample);
      const talentSet = new Set(delivs.map(d => d.talent_id).filter(Boolean));
      let vues = 0;
      let eng = 0;
      let hasVues = false;

      for (const d of delivs) {
        const snap = snapshots.get(d.id);
        if (snap && !snap.isDemo && !snap.isExample) {
          if (snap.views !== null && snap.views !== undefined) {
            vues += snap.views;
            hasVues = true;
          }
          if (snap.engagement_calculated) {
            eng += snap.engagement_calculated;
          }
        }
      }

      const riskCount = risks.filter(r => r.ref && r.ref.campaign_id === camp.id).length;

      return {
        camp,
        total: delivs.length,
        talents: talentSet.size,
        vues,
        hasVues,
        eng,
        riskCount
      };
    }).sort((a, b) => b.total - a.total);
  }, [data.campaigns, data.deliverables, snapshots, risks]);

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* ─── 1. GRILLE DE CARTES KPI PRINCIPAUX (Style Dashboard Analytics) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14
        }}
      >
        <AnalyticsKpiCard
          title="TALENTS QUALIFIÉS"
          tag="👥 Vivier"
          tagColor="tag-orange"
          value={formatNumber(kpis.talentsActifs || 0)}
          sparklineData={null}
          sparklineColor="#FF7900"
          trend={`${kpis.talentsActifs || 0} actif(s)`}
          trendLabel={`${(data.talents || []).length} au registre`}
          isPositive={true}
          clickable={true}
          onClick={() => onNavigate('talents')}
        />

        <AnalyticsKpiCard
          title="ACTIVATIONS EN COURS"
          tag="⚡ Campagnes"
          tagColor="tag-blue"
          value={formatNumber(kpis.activations || 0)}
          sparklineData={null}
          sparklineColor="#2980B9"
          trend={kpis.activations > 0 ? `${kpis.activations} active(s)` : '0 activation'}
          trendLabel={kpis.activations > 0 ? "en cours d'exécution" : "Aucune campagne active"}
          isPositive={kpis.activations > 0}
          clickable={true}
          onClick={() => onNavigate('campagnes')}
        />

        <AnalyticsKpiCard
          title="PUBLICATIONS DIFFUSÉES"
          tag="📄 Contenus"
          tagColor="tag-green"
          value={formatNumber(kpis.publications || 0)}
          sparklineData={null}
          sparklineColor="#27AE60"
          trend={`${kpis.publications || 0} diffusée(s)`}
          trendLabel={`${(data.deliverables || []).filter(d => !d.isDemo && !d.isExample).length} livrables suivis`}
          isPositive={true}
          clickable={true}
          onClick={() => onNavigate('livrables')}
        />

        <AnalyticsKpiCard
          title="VUES TOTALES CERTIFIÉES"
          tag="👁 Impressions"
          tagColor="tag-orange"
          value={kpis.views > 0 ? (kpis.views >= 1000000 ? `${(kpis.views / 1000000).toFixed(1)}M` : formatNumber(kpis.views)) : '0'}
          sparklineData={null}
          sparklineColor="#FF7900"
          trend={kpis.views > 0 ? formatNumber(kpis.views) : '—'}
          trendLabel={kpis.views > 0 ? "vues réelles mesurées" : "Aucune vue enregistrée"}
          isPositive={kpis.views > 0}
          clickable={true}
          onClick={() => onNavigate('reporting')}
        />

        <AnalyticsKpiCard
          title="ENGAGEMENT CALCULÉ"
          tag="❤️ Réactions"
          tagColor="tag-purple"
          value={kpis.engagement > 0 ? (kpis.engagement >= 1000000 ? `${(kpis.engagement / 1000000).toFixed(1)}M` : formatNumber(kpis.engagement)) : '0'}
          sparklineData={null}
          sparklineColor="#8E44AD"
          trend={kpis.engagement > 0 ? formatNumber(kpis.engagement) : '—'}
          trendLabel={kpis.engagement > 0 ? "likes, coms, partages" : "0 interaction enregistrée"}
          isPositive={kpis.engagement > 0}
          clickable={true}
          onClick={() => onNavigate('reporting')}
        />

        <AnalyticsKpiCard
          title="TAUX SUR VUES"
          tag="📈 Ratio"
          tagColor={kpis.rate !== null ? 'tag-green' : 'tag-yellow'}
          value={kpis.rate !== null ? `${kpis.rate}%` : '—'}
          sparklineData={null}
          sparklineColor="#27AE60"
          trend={kpis.rate !== null ? `${kpis.rate}% effectif` : '—'}
          trendLabel={kpis.rate !== null ? "sur données complètes" : "En attente de livrables et vues"}
          isPositive={kpis.rate !== null}
          clickable={true}
          onClick={() => onNavigate('reporting')}
        />

        <AnalyticsKpiCard
          title="DONNÉES INCOMPLÈTES"
          tag="⚠️ Données"
          tagColor={kpis.incomplete > 0 ? 'tag-yellow' : 'tag-green'}
          value={formatNumber(kpis.incomplete || 0)}
          sparklineData={null}
          sparklineColor="#F39C12"
          trend={kpis.incomplete > 0 ? `${kpis.incomplete} à enrichir` : 'Données complètes'}
          trendLabel={kpis.incomplete > 0 ? "en cours de collecte" : "Tous les livrables sont complets"}
          isPositive={kpis.incomplete === 0}
          clickable={true}
          onClick={() => onNavigate('reporting')}
        />

        <AnalyticsKpiCard
          title="ARBITRAGES DOUBLONS"
          tag="🎯 Qualité"
          tagColor={kpis.doublons > 0 ? 'tag-red' : 'tag-green'}
          value={formatNumber(kpis.doublons || 0)}
          sparklineData={null}
          sparklineColor={kpis.doublons > 0 ? '#E74C3C' : '#27AE60'}
          trend={kpis.doublons > 0 ? `${kpis.doublons} à arbitrer` : '0 doublon'}
          trendLabel={kpis.doublons > 0 ? "candidats en attente" : "Aucun doublon détecté"}
          isPositive={kpis.doublons === 0}
          clickable={true}
          onClick={() => onNavigate('talents')}
        />
      </div>

      {/* ─── 2. GRILLE CENTRALE DEUX COLONNES (Style Dashboard Analytics) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 16
        }}
      >
        {/* Colonne gauche : Risques & Relances Prioritaires */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚠️</span> Risques & Relances Prioritaires
                </h3>
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                  Détection automatique des dépassements de SLA, URL manquantes et BAT
                </p>
              </div>
              <span className="tag tag-red" style={{ fontWeight: 800 }}>
                {risks.length} alerte(s)
              </span>
            </div>

            {risks.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--muted)', background: '#FAFAFC', borderRadius: 8, border: '1px dashed #E0E0E0' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>Tous les indicateurs sont conformes</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>Aucun point de blocage ou anomalie détectée sur les livrables.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {risks.map((r, idx) => {
                  const pColor = r.priority === 'p0' ? 'tag-red' : r.priority === 'p1' ? 'tag-orange' : 'tag-muted';
                  return (
                    <div
                      key={r.id || idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid #E5E7EB',
                        background: '#FAFAFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className={`tag ${pColor}`} style={{ fontSize: 10, fontWeight: 800 }}>
                            {r.priority ? r.priority.toUpperCase() : 'ALERT'}
                          </span>
                          <strong style={{ fontSize: 13, color: 'var(--dark)' }}>{r.motif}</strong>
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>
                          {r.obj}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ whiteSpace: 'nowrap', border: '1px solid #FF7900', color: '#FF7900', minHeight: 32 }}
                        onClick={() => onNavigate(r.navigate || 'livrables')}
                      >
                        {r.action ? r.action.split('(')[0] : 'Traiter'} →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--muted)' }}>
            <span>Circuit de validation McCann ⇄ Orange</span>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: 'transparent', color: '#FF7900', fontWeight: 700, padding: 0 }}
              onClick={() => onNavigate('livrables')}
            >
              Consulter tous les livrables →
            </button>
          </div>
        </div>

        {/* Colonne droite : Activations & Campagnes Clés */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🗂</span> Activations & Campagnes Clés
                </h3>
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                  Suivi direct des temps forts commerciaux et dispositifs récents
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onNavigate('campagnes')}
                style={{ fontSize: 11, border: '1px solid #D0D0D0' }}
              >
                Voir tout ({campaignsSummary.length})
              </button>
            </div>

            {campaignsSummary.length === 0 ? (
              <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--muted)', background: '#FAFAFC', borderRadius: 8, border: '1px dashed #E0E0E0' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🗂</div>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>Aucune activation ni campagne enregistrée</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>Les opérations commerciales et dispositifs réels s'afficheront ici automatiquement sans données exemples.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {campaignsSummary.slice(0, 4).map(({ camp, total, talents, vues, eng, riskCount }) => (
                  <div
                    key={camp.id}
                    onClick={() => onNavigate('campagnes')}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      background: '#FAFAFC',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14 }}>🎯</span>
                        <strong style={{ fontSize: 13, color: 'var(--dark)' }}>{camp.name}</strong>
                      </div>
                      {riskCount > 0 ? (
                        <span className="tag tag-yellow" style={{ fontSize: 10 }}>
                          {riskCount} point(s) à surveiller
                        </span>
                      ) : (
                        <span className="tag tag-green" style={{ fontSize: 10 }}>
                          ✓ Nominal
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 11.5, color: 'var(--muted)' }}>
                      <span>📄 <strong>{total}</strong> livrables</span>
                      <span>👥 <strong>{talents}</strong> talents</span>
                      <span>👁 <strong>{vues > 0 ? formatNumber(vues) : '0'}</strong> vues</span>
                      <span>❤️ <strong>{eng > 0 ? formatNumber(eng) : '0'}</strong> réact.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
            <span style={{ color: 'var(--muted)' }}>Gouvernance McCann × Orange</span>
            <span className="tag tag-orange" style={{ fontSize: 11 }}>
              {campaignsSummary.length} dispositif(s) au plan
            </span>
          </div>
        </div>
      </div>

      {/* ─── 3. ANALYSE VOLUMES & SUJETS ÉDITORIAUX (Style Recharts Dashboard Analytics) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 16
        }}
      >
        {/* Graphique Recharts Volume par Plateforme */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📱</span> Volume par Plateforme Sociale
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Répartition des publications et canaux mobilisés
              </p>
            </div>
            <span className="tag tag-blue" style={{ fontSize: 11 }}>
              {data.deliverables.length} contenus
            </span>
          </div>

          <div style={{ height: 220, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={platformsData}
                margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16213E', borderColor: '#FF7900', borderRadius: 8, color: '#fff' }}
                  formatter={(value) => [`${value} livrables`, 'Volume']}
                />
                <Bar dataKey="count" fill="#FF7900" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sujets & Thématiques de contenu */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏷</span> Thématiques Éditoriales Prisées
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Axes de communication Orange les plus relayés par les créateurs
              </p>
            </div>
            <span className="tag tag-orange" style={{ fontSize: 11 }}>
              Top Thématiques
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {subjects.map(([subject, count]) => {
              const max = subjects[0] ? subjects[0][1] : 1;
              const pct = Math.round((count / max) * 100);
              return (
                <div key={subject}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--dark)' }}>{subject}</span>
                    <span style={{ fontWeight: 800, color: '#FF7900' }}>{count} pub.</span>
                  </div>
                  <div style={{ height: 6, width: '100%', background: '#F0F0F0', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #FF7900 0%, #FF9D3D 100%)',
                        borderRadius: 4
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
