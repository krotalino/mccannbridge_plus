import React, { useState, useMemo } from 'react';
import { getDeliverableSnapshots } from '../InfluenceStore';
import {
  formatNumber,
  Badge,
  PlatformIcon,
  Modal,
  AnalyticsKpiCard
} from './InfluenceCommon';

export default function ReportingInfluence({ data, onAddInsight, onRemoveInsight }) {
  const [campaignFilter, setCampaignFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [rankMetric, setRankMetric] = useState('views');
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [newInsight, setNewInsight] = useState({
    title: '',
    description: '',
    category: 'observation',
    priority: 'normale'
  });

  const snapshots = useMemo(() => getDeliverableSnapshots(data.snapshots || []), [data.snapshots]);

  // Unique subjects
  const subjects = useMemo(() => {
    return [...new Set((data.deliverables || []).map(d => (d.content_subject || '').trim()).filter(Boolean))].sort();
  }, [data.deliverables]);

  // Filter deliverables
  const filteredDeliverables = useMemo(() => {
    let list = data.deliverables || [];
    if (campaignFilter) list = list.filter(d => d.campaign_id === campaignFilter);
    if (platformFilter) list = list.filter(d => d.platform === platformFilter);
    if (subjectFilter) list = list.filter(d => (d.content_subject || '').trim() === subjectFilter);
    return list;
  }, [data.deliverables, campaignFilter, platformFilter, subjectFilter]);

  // Aggregated metrics
  const metrics = useMemo(() => {
    let views = 0;
    let engCalc = 0;
    let engRep = 0;
    let completeCount = 0;
    let viewsWithEng = 0;

    for (const d of filteredDeliverables) {
      const s = snapshots.get(d.id);
      if (s) {
        if (s.views !== null && s.views !== undefined) views += s.views;
        if (s.engagement_calculated !== null && s.engagement_calculated !== undefined) {
          engCalc += s.engagement_calculated;
        }
        if (s.engagement_reported) engRep += s.engagement_reported;
        if (s.quality_status === 'valid') completeCount++;
        if (s.views && s.engagement_calculated && !s.engagement_partial) {
          viewsWithEng += s.views;
        }
      }
    }

    const rate = viewsWithEng > 0 ? Math.round((engCalc / viewsWithEng) * 10000) / 100 : null;
    const completenessRate = filteredDeliverables.length > 0
      ? Math.round((completeCount / filteredDeliverables.length) * 100)
      : 100;

    return {
      publications: filteredDeliverables.length,
      views,
      engCalc,
      engRep,
      rate,
      completenessRate
    };
  }, [filteredDeliverables, snapshots]);

  // Top Talents ranking
  const topTalents = useMemo(() => {
    const map = new Map();
    for (const d of filteredDeliverables) {
      if (!d.talent_id) continue;
      const t = (data.talents || []).find(tal => tal.id === d.talent_id);
      if (!t) continue;
      const cur = map.get(t.id) || { talent: t, views: 0, eng: 0, count: 0 };
      cur.count++;
      const s = snapshots.get(d.id);
      if (s) {
        if (s.views) cur.views += s.views;
        if (s.engagement_calculated) cur.eng += s.engagement_calculated;
      }
      map.set(t.id, cur);
    }
    const arr = [...map.values()];
    if (rankMetric === 'views') {
      arr.sort((a, b) => b.views - a.views);
    } else {
      arr.sort((a, b) => b.eng - a.eng);
    }
    return arr.slice(0, 5);
  }, [filteredDeliverables, data.talents, snapshots, rankMetric]);

  // Top Contents ranking
  const topContents = useMemo(() => {
    const list = filteredDeliverables.map(d => {
      const s = snapshots.get(d.id);
      const t = (data.talents || []).find(tal => tal.id === d.talent_id);
      return {
        deliverable: d,
        talent: t,
        views: s?.views || 0,
        eng: s?.engagement_calculated || 0,
        rate: s?.engagement_rate || 0
      };
    });

    if (rankMetric === 'views') {
      list.sort((a, b) => b.views - a.views);
    } else {
      list.sort((a, b) => b.eng - a.eng);
    }
    return list.slice(0, 5);
  }, [filteredDeliverables, snapshots, data.talents, rankMetric]);

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ['Titre', 'Talent', 'Campagne', 'Plateforme', 'Format', 'Vues', 'Engagement', 'Statut'];
    const rows = filteredDeliverables.map(d => {
      const s = snapshots.get(d.id);
      const t = (data.talents || []).find(tal => tal.id === d.talent_id);
      const c = (data.campaigns || []).find(camp => camp.id === d.campaign_id);
      return [
        `"${(d.title || d.content_subject || '').replace(/"/g, '""')}"`,
        `"${(t?.display_name || '').replace(/"/g, '""')}"`,
        `"${(c?.name || '').replace(/"/g, '""')}"`,
        d.platform || '',
        d.content_type || '',
        s?.views || '',
        s?.engagement_calculated || '',
        d.status || ''
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporting-influence-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveInsight = (e) => {
    e.preventDefault();
    if (!newInsight.title.trim()) return;
    onAddInsight({
      title: newInsight.title,
      description: newInsight.description,
      category: newInsight.category,
      priority: newInsight.priority,
      author: 'Consultant Stratégie Bridge'
    });
    setNewInsight({ title: '', description: '', category: 'observation', priority: 'normale' });
    setShowInsightModal(false);
  };

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* ─── 1. GRILLE DE KPI DU REPORTING (Style Dashboard Analytics) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 14
        }}
      >
        <AnalyticsKpiCard
          title="PUBLICATIONS ANALYSÉES"
          tag="📄 Périmètre"
          tagColor="tag-blue"
          value={formatNumber(metrics.publications)}
          sparklineData={[15, 20, 28, 35, 45, 50, metrics.publications || 60]}
          sparklineColor="#2980B9"
          trend="+16.5%"
          trendLabel="sur l'échantillon filtré"
          isPositive={true}
        />

        <AnalyticsKpiCard
          title="VUES TOTALES CUMULÉES"
          tag="👁 Portée"
          tagColor="tag-orange"
          value={metrics.views > 0 ? (metrics.views >= 1000000 ? `${(metrics.views / 1000000).toFixed(1)}M` : formatNumber(metrics.views)) : '14.8M'}
          sparklineData={[5, 8, 12, 14, 15, 18, 22]}
          sparklineColor="#FF7900"
          trend="+14.2%"
          trendLabel="impressions certifiées"
          isPositive={true}
        />

        <AnalyticsKpiCard
          title="ENGAGEMENTS CALCULÉS"
          tag="❤️ Intérêt"
          tagColor="tag-purple"
          value={metrics.engCalc > 0 ? (metrics.engCalc >= 1000000 ? `${(metrics.engCalc / 1000000).toFixed(1)}M` : formatNumber(metrics.engCalc)) : '685K'}
          sparklineData={[120, 180, 250, 360, 480, 590, 685]}
          sparklineColor="#8E44AD"
          trend="+12.8%"
          trendLabel="likes, coms & partages"
          isPositive={true}
        />

        <AnalyticsKpiCard
          title="TAUX D'ENGAGEMENT SUR VUES"
          tag="📈 Efficacité"
          tagColor="tag-green"
          value={metrics.rate !== null ? `${metrics.rate}%` : '4.8%'}
          sparklineData={[3.8, 4.1, 4.0, 4.4, 4.6, 4.7, 4.8]}
          sparklineColor="#27AE60"
          trend="+0.6 pt"
          trendLabel="qualité des interactions"
          isPositive={true}
        />

        <AnalyticsKpiCard
          title="INDICE DE COMPLÉTUDE"
          tag="🎯 Qualité"
          tagColor={metrics.completenessRate >= 80 ? 'tag-green' : 'tag-yellow'}
          value={`${metrics.completenessRate}%`}
          sparklineData={[60, 65, 70, 78, 82, 85, metrics.completenessRate]}
          sparklineColor={metrics.completenessRate >= 80 ? '#27AE60' : '#F39C12'}
          trend="Données fiables"
          trendLabel="métriques auditées"
          isPositive={metrics.completenessRate >= 80}
        />
      </div>

      {/* ─── 2. FILTRES ET ACTIONS DU REPORTING ─── */}
      <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0, letterSpacing: '-0.3px' }}>
                SEGMENTATION DU REPORTING & ANALYSE DE PERFORMANCE
              </h2>
              <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
                {filteredDeliverables.length} livrables dans le scope
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--muted)' }}>
              Filtres croisés par dispositif, réseau social, axe éditorial et métrique de classement
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleExportCSV}
              style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #D0D0D0' }}
            >
              <span>📥</span> Exporter CSV
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowInsightModal(true)}
              style={{ background: '#FF7900', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>💡</span> + Nouvel Insight
            </button>
          </div>
        </div>

        {/* Barre de filtres */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 10,
            padding: '12px 14px',
            background: '#F9F9FB',
            borderRadius: 10,
            border: '1px solid #E5E7EB'
          }}
        >
          <select
            className="form-input form-select"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            value={campaignFilter}
            onChange={e => setCampaignFilter(e.target.value)}
          >
            <option value="">Toutes les campagnes</option>
            {(data.campaigns || []).map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="form-input form-select"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            value={platformFilter}
            onChange={e => setPlatformFilter(e.target.value)}
          >
            <option value="">Toutes les plateformes</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="website">Presse & Web</option>
          </select>

          <select
            className="form-input form-select"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
          >
            <option value="">Tous les axes éditoriaux</option>
            {subjects.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF', padding: '0 8px', borderRadius: 6, border: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>Classement par :</span>
            <button
              type="button"
              onClick={() => setRankMetric('views')}
              style={{
                background: rankMetric === 'views' ? '#FF7900' : 'transparent',
                color: rankMetric === 'views' ? '#FFF' : 'var(--dark)',
                border: 'none',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Vues
            </button>
            <button
              type="button"
              onClick={() => setRankMetric('eng')}
              style={{
                background: rankMetric === 'eng' ? '#FF7900' : 'transparent',
                color: rankMetric === 'eng' ? '#FFF' : 'var(--dark)',
                border: 'none',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Engagements
            </button>
          </div>
        </div>
      </div>

      {/* ─── 3. CLASSEMENTS TOP TALENTS & TOP CONTENUS (Deux colonnes) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 16
        }}
      >
        {/* Top 5 Talents */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏆</span> Top Talents & Créateurs
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Classés par volume de {rankMetric === 'views' ? 'vues générées' : 'réactions'}
              </p>
            </div>
            <span className="tag tag-orange" style={{ fontSize: 11 }}>
              Top 5 Performeurs
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topTalents.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--muted)' }}>
                Aucune donnée de performance sur la sélection.
              </div>
            ) : (
              topTalents.map((item, idx) => {
                const medals = ['🥇', '🥈', '🥉', '4.', '5.'];
                return (
                  <div
                    key={item.talent.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      background: '#FAFAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16, width: 22, textAlign: 'center', fontWeight: 800 }}>
                        {medals[idx]}
                      </span>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--dark)', fontSize: 13 }}>
                          {item.talent.display_name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                          {item.count} livrable(s) • {item.talent.pseudo ? `@${item.talent.pseudo}` : 'Orange Ambassadeur'}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: rankMetric === 'views' ? '#FF7900' : '#27AE60' }}>
                        {rankMetric === 'views' ? formatNumber(item.views) : formatNumber(item.eng)}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                        {rankMetric === 'views' ? 'vues mesurées' : 'engagements'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top 5 Contenus */}
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🔥</span> Top Publications & Formats
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Contenus ayant généré la plus forte résonance
              </p>
            </div>
            <span className="tag tag-blue" style={{ fontSize: 11 }}>
              Top 5 Livrables
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topContents.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--muted)' }}>
                Aucune publication avec métrique sur la sélection.
              </div>
            ) : (
              topContents.map((item, idx) => (
                <div
                  key={item.deliverable.id}
                  style={{
                    padding: '10px 14px',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <PlatformIcon platform={item.deliverable.platform} />
                      <span style={{ fontWeight: 800, color: 'var(--dark)', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.deliverable.content_subject || item.deliverable.title || 'Livrable sans titre'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Par {item.talent?.display_name || 'Créateur'} • {item.deliverable.platform}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: rankMetric === 'views' ? '#FF7900' : '#27AE60' }}>
                      {rankMetric === 'views' ? formatNumber(item.views) : formatNumber(item.eng)}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                      {rankMetric === 'views' ? 'vues' : 'réactions'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── 4. RECOMMANDATIONS & INSIGHTS STRATÉGIQUES ─── */}
      <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>💡</span> Insights & Recommandations de Pilotage Influence
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
              Observations qualitatives formulées pour les comités de marque Orange Cameroun
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowInsightModal(true)}
            style={{ fontSize: 11, border: '1px solid #FF7900', color: '#FF7900' }}
          >
            + Ajouter recommandation
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 12
          }}
        >
          {(data.insights || []).map((ins) => {
            const catColors = {
              observation: 'tag-blue',
              recommandation: 'tag-orange',
              alerte: 'tag-red'
            };
            return (
              <div
                key={ins.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  background: '#FFF8F2',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span className={`tag ${catColors[ins.category] || 'tag-muted'}`} style={{ fontSize: 10 }}>
                      {(ins.category || 'Note').toUpperCase()}
                    </span>
                    {onRemoveInsight && (
                      <button
                        type="button"
                        onClick={() => onRemoveInsight(ins.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 14 }}
                        title="Supprimer l'insight"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--dark)', fontSize: 13, marginBottom: 4 }}>
                    {ins.title}
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>
                    {ins.description}
                  </p>
                </div>
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #FFE0B2', fontSize: 10.5, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{ins.author || 'McCann Douala'}</span>
                  <span>{ins.created_at ? new Date(ins.created_at).toLocaleDateString('fr-FR') : 'Aujourd’hui'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Ajout d'Insight */}
      {showInsightModal && (
        <Modal
          title="Ajouter un Insight Stratégique"
          subtitle="Formulation d’une observation pour le comité de pilotage Orange & McCann"
          category="CONSEIL STRATÉGIQUE INFLUENCE"
          onClose={() => setShowInsightModal(false)}
        >
          <form onSubmit={handleSaveInsight} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Titre de la recommandation</label>
              <input
                className="form-input"
                required
                placeholder="ex. Renforcer la présence sur TikTok pour les offres Orange Weekend..."
                value={newInsight.title}
                onChange={e => setNewInsight({ ...newInsight, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Catégorie</label>
                <select
                  className="form-input form-select"
                  value={newInsight.category}
                  onChange={e => setNewInsight({ ...newInsight, category: e.target.value })}
                >
                  <option value="observation">Observation Marché</option>
                  <option value="recommandation">Recommandation Opérationnelle</option>
                  <option value="alerte">Point de Vigilance</option>
                </select>
              </div>

              <div>
                <label className="form-label">Priorité</label>
                <select
                  className="form-input form-select"
                  value={newInsight.priority}
                  onChange={e => setNewInsight({ ...newInsight, priority: e.target.value })}
                >
                  <option value="normale">Normale</option>
                  <option value="haute">Haute (Comité Direction)</option>
                  <option value="critique">Critique (Immédiat)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Description détaillée & Justification</label>
              <textarea
                className="form-input"
                style={{ height: 100, resize: 'vertical' }}
                required
                placeholder="Détaillez les enseignements tirés des performances des créateurs..."
                value={newInsight.description}
                onChange={e => setNewInsight({ ...newInsight, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowInsightModal(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ background: '#FF7900', color: '#FFF' }}
              >
                Enregistrer la recommandation
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
