import React, { useState } from 'react';
import { Badge, PlatformIcon, Modal, AnalyticsKpiCard } from './InfluenceCommon';

const INITIAL_SIGNALS = [
  {
    id: 'sig-1',
    title: 'Campagne offensive MTN Pulse avec 15 créateurs gaming',
    competitor: 'MTN Cameroun',
    platform: 'tiktok',
    theme: 'Offre Jeunesse / Gaming',
    date: '2026-03-24',
    impact: 'fort',
    status: 'en_cours',
    summary: 'Déploiement massif sur TikTok avec concours et dotations data. Forte viralité observée sur la tranche 18-25 ans.'
  },
  {
    id: 'sig-2',
    title: 'Partenariat exclusif Moov Africa & Top influenceurs Lifestyle',
    competitor: 'Moov Africa',
    platform: 'instagram',
    theme: 'Mobile Money Cashback',
    date: '2026-03-22',
    impact: 'moyen',
    status: 'analysé',
    summary: 'Mise en avant du zéro frais sur les retraits via des stories quotidiennes et codes parrainage influenceurs.'
  },
  {
    id: 'sig-3',
    title: 'Nouveau format live shopping Wave Côte d\'Ivoire & Cameroun',
    competitor: 'Wave',
    platform: 'facebook',
    theme: 'Paiement Marchand',
    date: '2026-03-20',
    impact: 'faible',
    status: 'archivé',
    summary: 'Session live avec démos de paiement sans contact chez des commerçants partenaires.'
  }
];

const COMPETITORS = [
  {
    name: 'MTN Cameroun',
    marketShare: '42%',
    activeInfluencers: 28,
    primaryPlatform: 'tiktok',
    tone: 'tag-yellow',
    recentMove: 'Offre Data Nuit & Partenariats Streamers'
  },
  {
    name: 'Moov Africa',
    marketShare: '24%',
    activeInfluencers: 14,
    primaryPlatform: 'facebook',
    tone: 'tag-blue',
    recentMove: 'Offre Fibre promotionnelle et relais webzines'
  },
  {
    name: 'Wave Cameroun',
    marketShare: '18%',
    activeInfluencers: 19,
    primaryPlatform: 'instagram',
    tone: 'tag-purple',
    recentMove: 'Campagne parrainage virale micro-influenceurs'
  }
];

export default function VeilleStrategique() {
  const [subtab, setSubtab] = useState('cockpit');
  const [signals, setSignals] = useState(INITIAL_SIGNALS);
  const [showAddSignalModal, setShowAddSignalModal] = useState(false);
  const [newSignal, setNewSignal] = useState({
    title: '',
    competitor: 'MTN Cameroun',
    platform: 'tiktok',
    theme: '',
    impact: 'moyen',
    summary: ''
  });

  const handleAddSignal = (e) => {
    e.preventDefault();
    if (!newSignal.title.trim()) return;
    setSignals([
      {
        id: `sig-${Date.now()}`,
        ...newSignal,
        date: new Date().toISOString().slice(0, 10),
        status: 'en_cours'
      },
      ...signals
    ]);
    setShowAddSignalModal(false);
    setNewSignal({
      title: '',
      competitor: 'MTN Cameroun',
      platform: 'tiktok',
      theme: '',
      impact: 'moyen',
      summary: ''
    });
  };

  return (
    <div className="flex flex-col gap-20 animate-fade">
      {/* ─── BARRE DE NAVIGATION INTERNE VEILLE (Style Dashboard Analytics) ─── */}
      <div
        className="card p-12"
        style={{
          borderRadius: 12,
          border: '1px solid #E0E0E0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 0
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            ['cockpit', '📡 Cockpit Veille'],
            ['flux', `Flux des Signaux (${signals.length})`],
            ['concurrents', 'Concurrents Suivis (3)'],
            ['watchlists', 'Alertes & Mots-clés']
          ].map(([id, label]) => {
            const isActive = subtab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSubtab(id)}
                style={{
                  background: isActive ? '#FF7900' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--dark)',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddSignalModal(true)}
          style={{ background: '#FF7900', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span>➕</span> Nouveau Signal
        </button>
      </div>

      {subtab === 'cockpit' && (
        <>
          {/* KPIs Veille */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: 14
            }}
          >
            <AnalyticsKpiCard
              title="SIGNAUX CRITIQUES"
              tag="🚨 Alertes"
              tagColor="tag-red"
              value="2"
              sparklineData={[1, 0, 2, 1, 3, 2, 2]}
              sparklineColor="#E74C3C"
              trend="Impact fort"
              trendLabel="actions requises"
              isPositive={false}
            />

            <AnalyticsKpiCard
              title="ACTIVATIONS CONCURRENTS"
              tag="👥 Créateurs"
              tagColor="tag-blue"
              value="61"
              sparklineData={[40, 45, 52, 55, 58, 60, 61]}
              sparklineColor="#2980B9"
              trend="+12%"
              trendLabel="suivis en continu"
              isPositive={true}
            />

            <AnalyticsKpiCard
              title="PART DE VOIX ORANGE"
              tag="👑 Leader"
              tagColor="tag-green"
              value="48.2%"
              sparklineData={[42, 44, 45, 46, 47, 47.5, 48.2]}
              sparklineColor="#27AE60"
              trend="+3.2 pts"
              trendLabel="leader segment télécom"
              isPositive={true}
            />

            <AnalyticsKpiCard
              title="PRESSION MÉDIA CONCURRENTE"
              tag="⚡ Indice"
              tagColor="tag-yellow"
              value="+14%"
              sparklineData={[5, 8, 10, 11, 12, 13, 14]}
              sparklineColor="#F39C12"
              trend="Hausse modérée"
              trendLabel="vs mois précédent"
              isPositive={false}
            />
          </div>

          {/* Grille Cockpit Veille */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 16
            }}
          >
            {/* Derniers signaux concurrents */}
            <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🚨</span> Derniers Signaux Concurrents Captés
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                    Surveillance temps réel des activations marché au Cameroun
                  </p>
                </div>
                <span className="tag tag-red" style={{ fontSize: 11 }}>
                  {signals.length} détectés
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {signals.map(s => {
                  const pColor = s.impact === 'fort' ? 'tag-red' : s.impact === 'moyen' ? 'tag-yellow' : 'tag-muted';
                  return (
                    <div
                      key={s.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid #E5E7EB',
                        background: '#FAFAFC'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <PlatformIcon platform={s.platform} />
                        <strong style={{ fontSize: 13, color: 'var(--dark)' }}>{s.title}</strong>
                        <span className={`tag ${pColor}`} style={{ fontSize: 10 }}>
                          Impact {s.impact}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                        {s.summary}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span>🏢 <strong>{s.competitor}</strong></span>
                        <span>🏷 Thème : {s.theme}</span>
                        <span>📅 {s.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Synthèse des concurrents */}
            <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🏢</span> Synthèse des Concurrents Actifs
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0 0' }}>
                    Cartographie des parts de voix et stratégies d'activation
                  </p>
                </div>
                <span className="tag tag-orange" style={{ fontSize: 11 }}>
                  3 Acteurs Clés
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {COMPETITORS.map(c => (
                  <div
                    key={c.name}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      background: '#FAFAFC'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: 14, color: 'var(--dark)' }}>{c.name}</strong>
                      <span className={`tag ${c.tone}`} style={{ fontSize: 11, fontWeight: 800 }}>
                        {c.marketShare} PDV
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
                      Dernier mouvement : <strong style={{ color: 'var(--dark)' }}>{c.recentMove}</strong>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', display: 'flex', gap: 14 }}>
                      <span>👥 {c.activeInfluencers} créateurs actifs</span>
                      <span style={{ textTransform: 'capitalize' }}>📱 Canal : {c.primaryPlatform}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {subtab === 'flux' && (
        <div className="card p-0" style={{ borderRadius: 12, border: '1px solid #E0E0E0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', background: '#F8F9FA', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: 0 }}>
              Flux d'Intelligence & Signaux Faibles
            </h3>
            <span className="tag tag-orange" style={{ fontSize: 11 }}>
              {signals.length} signaux indexés
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Signal & Synthèse</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Acteur</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Plateforme</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Thématique</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Impact</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((s, idx) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: '1px solid #F0F0F0',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC'
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--dark)' }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.summary}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>{s.competitor}</td>
                    <td style={{ padding: '12px 16px' }}><PlatformIcon platform={s.platform} /> {s.platform}</td>
                    <td style={{ padding: '12px 16px' }}>{s.theme}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`tag ${s.impact === 'fort' ? 'tag-red' : s.impact === 'moyen' ? 'tag-yellow' : 'tag-muted'}`} style={{ fontSize: 10 }}>
                        {s.impact}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 11.5, color: 'var(--muted)' }}>{s.date}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="tag tag-blue" style={{ fontSize: 10 }}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subtab === 'concurrents' && (
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: '0 0 16px 0' }}>
            🎯 Fiches Concurrents & Stratégies d'Influence
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {COMPETITORS.map(c => (
              <div
                key={c.name}
                style={{
                  padding: '16px 18px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  background: '#FFF8F2'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>{c.name}</span>
                  <span className={`tag ${c.tone}`} style={{ fontSize: 11, fontWeight: 800 }}>{c.marketShare} PDV</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Créateurs mobilisés :</span>
                    <strong style={{ color: 'var(--dark)' }}>{c.activeInfluencers}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Plateforme clé :</span>
                    <strong style={{ color: 'var(--dark)', textTransform: 'capitalize' }}>{c.primaryPlatform}</strong>
                  </div>
                  <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #FFE0B2', fontSize: 11.5, color: 'var(--muted)' }}>
                    Dernière offensive : <strong style={{ color: 'var(--dark)' }}>{c.recentMove}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subtab === 'watchlists' && (
        <div className="card p-20" style={{ borderRadius: 12, border: '1px solid #E0E0E0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--dark)', margin: '0 0 16px 0' }}>
            🔔 Mots-clés & Watchlists Automatisées
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              '#OrangeWeekend',
              '#OrangeMoney',
              'MTN Pulse',
              'Moov Money',
              'Wave Cameroun',
              'Forfait Nuit Data',
              'Fibre Télécom'
            ].map((kw, i) => (
              <span key={i} className="tag tag-orange" style={{ fontSize: 12, padding: '6px 12px' }}>
                🔍 {kw}
              </span>
            ))}
          </div>
          <div style={{ padding: '12px 16px', background: '#FAFAFC', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12, color: 'var(--muted)' }}>
            Le module de veille scanne les mentions publiques, hashtags et publications de créateurs pour notifier l'équipe de toute offensive commerciale concurrente.
          </div>
        </div>
      )}

      {/* Modal Ajout Signal */}
      {showAddSignalModal && (
        <Modal
          title="Ajouter un Signal de Veille"
          subtitle="Enregistrer une observation ou une campagne concurrente détectée"
          category="VEILLE & INTELLIGENCE MARCHÉ"
          onClose={() => setShowAddSignalModal(false)}
          width={640}
        >
          <form onSubmit={handleAddSignal} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Titre du signal *</label>
              <input
                className="form-input"
                placeholder="ex. Lancement concours TikTok avec 10 ambassadeurs..."
                value={newSignal.title}
                onChange={e => setNewSignal({ ...newSignal, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Acteur concurrent</label>
                <select
                  className="form-input form-select"
                  value={newSignal.competitor}
                  onChange={e => setNewSignal({ ...newSignal, competitor: e.target.value })}
                >
                  <option value="MTN Cameroun">MTN Cameroun</option>
                  <option value="Moov Africa">Moov Africa</option>
                  <option value="Wave Cameroun">Wave Cameroun</option>
                  <option value="Autre">Autre acteur</option>
                </select>
              </div>

              <div>
                <label className="form-label">Plateforme</label>
                <select
                  className="form-input form-select"
                  value={newSignal.platform}
                  onChange={e => setNewSignal({ ...newSignal, platform: e.target.value })}
                >
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="website">Presse & Web</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Thématique</label>
                <input
                  className="form-input"
                  placeholder="ex. Offre Data / CashBack..."
                  value={newSignal.theme}
                  onChange={e => setNewSignal({ ...newSignal, theme: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Niveau d'impact</label>
                <select
                  className="form-input form-select"
                  value={newSignal.impact}
                  onChange={e => setNewSignal({ ...newSignal, impact: e.target.value })}
                >
                  <option value="faible">Faible</option>
                  <option value="moyen">Moyen</option>
                  <option value="fort">Fort</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Synthèse de l'observation</label>
              <textarea
                className="form-input"
                style={{ minHeight: 80, resize: 'vertical' }}
                placeholder="Description concise de la mécanique, portée estimée, réactions observées..."
                value={newSignal.summary}
                onChange={e => setNewSignal({ ...newSignal, summary: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowAddSignalModal(false)}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" style={{ background: '#FF7900', color: '#FFF' }}>
                Enregistrer le signal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
