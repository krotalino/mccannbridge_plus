import { useState, useRef } from 'react';
import { formatNumber } from '../../../utils/helpers';

export default function InfluencePerformance({ influencers, setInfluencers }) {
  const [selectedInfId, setSelectedInfId] = useState(influencers[0]?.id || 1);
  const [activeSubTab, setActiveSubTab] = useState('publications'); // 'publications' | 'benchmark' | 'evolution'
  const [showAddPubModal, setShowAddPubModal] = useState(false);
  const [newPub, setNewPub] = useState({
    titre: '',
    date: new Date().toISOString().split('T')[0],
    plateforme: 'Instagram',
    vues: 0,
    likes: 0,
    commentaires: 0,
    partages: 0,
    reach: 0,
    impressions: 0,
  });

  const fileInputRef = useRef(null);

  const selectedInf = influencers.find(i => i.id === parseInt(selectedInfId)) || influencers[0];

  // Calcul du taux d'engagement global de l'influenceur sélectionné
  const pubStats = selectedInf?.publicationStats || [];
  const totalVues = pubStats.reduce((sum, p) => sum + (p.vues || 0), 0);
  const totalLikes = pubStats.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalComments = pubStats.reduce((sum, p) => sum + (p.commentaires || 0), 0);
  const totalPartages = pubStats.reduce((sum, p) => sum + (p.partages || 0), 0);
  const totalReach = pubStats.reduce((sum, p) => sum + (p.reach || 0), 0);
  const totalImpressions = pubStats.reduce((sum, p) => sum + (p.impressions || 0), 0);

  const avgEngagement = pubStats.length > 0
    ? (pubStats.reduce((sum, p) => sum + (p.tauxEngagement || 0), 0) / pubStats.length).toFixed(2)
    : selectedInf?.engagementNum || 0;

  // Importation Excel simulée
  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulation de données lues depuis un fichier Excel
    const simulatedImportedPubs = [
      {
        id: 'PUB-IMP-1',
        titre: 'Import Excel — Story Promo Fibre',
        date: new Date().toISOString().split('T')[0],
        plateforme: 'Instagram',
        vues: 65000,
        likes: 4200,
        commentaires: 310,
        partages: 520,
        reach: 58000,
        impressions: 74000,
        tauxEngagement: 8.4,
      },
      {
        id: 'PUB-IMP-2',
        titre: 'Import Excel — Video Test Maxit',
        date: new Date().toISOString().split('T')[0],
        plateforme: 'TikTok',
        vues: 140000,
        likes: 12500,
        commentaires: 890,
        partages: 1850,
        reach: 120000,
        impressions: 160000,
        tauxEngagement: 11.2,
      }
    ];

    setInfluencers(prev => prev.map(inf => {
      if (inf.id !== selectedInf.id) return inf;
      return {
        ...inf,
        publicationStats: [...(inf.publicationStats || []), ...simulatedImportedPubs]
      };
    }));

    alert(`✅ Importation réussie depuis "${file.name}" ! 2 nouvelles publications importées pour @${selectedInf.name}.`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPublication = () => {
    if (!newPub.titre) {
      alert('Veuillez entrer un titre pour la publication.');
      return;
    }
    const totalInteractions = (parseInt(newPub.likes) || 0) + (parseInt(newPub.commentaires) || 0) + (parseInt(newPub.partages) || 0);
    const reachVal = parseInt(newPub.reach) || parseInt(newPub.vues) || 1;
    const computedEng = ((totalInteractions / reachVal) * 100).toFixed(2);

    const pubObj = {
      id: 'PUB-' + Date.now(),
      ...newPub,
      vues: parseInt(newPub.vues) || 0,
      likes: parseInt(newPub.likes) || 0,
      commentaires: parseInt(newPub.commentaires) || 0,
      partages: parseInt(newPub.partages) || 0,
      reach: parseInt(newPub.reach) || 0,
      impressions: parseInt(newPub.impressions) || 0,
      tauxEngagement: parseFloat(computedEng),
    };

    setInfluencers(prev => prev.map(inf => {
      if (inf.id !== selectedInf.id) return inf;
      return {
        ...inf,
        publicationStats: [pubObj, ...(inf.publicationStats || [])]
      };
    }));

    setShowAddPubModal(false);
    setNewPub({
      titre: '',
      date: new Date().toISOString().split('T')[0],
      plateforme: 'Instagram',
      vues: 0,
      likes: 0,
      commentaires: 0,
      partages: 0,
      reach: 0,
      impressions: 0,
    });
  };

  // Tri benchmark influenceurs par Taux d'engagement ou par Reach
  const sortedInfluencersBenchmark = [...influencers].sort((a, b) => (b.engagementNum || 0) - (a.engagementNum || 0));

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div>
          <h2 className="text-xl font-bold text-dark mb-4">📊 Performance, Statistiques & KPIs</h2>
          <p className="text-sm text-muted">Suivi détaillé des publications, portée, engagement et benchmarks</p>
        </div>
        <div className="flex gap-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleExcelImport}
            accept=".xlsx, .xls, .csv"
            style={{ display: 'none' }}
          />
          <button className="btn btn-ghost border" onClick={() => fileInputRef.current?.click()}>
            📥 Importer fichier Excel / CSV
          </button>
          <button className="btn btn-orange" onClick={() => setShowAddPubModal(true)}>
            + Ajouter une publication
          </button>
        </div>
      </div>

      {/* Sélecteur d'influenceur */}
      <div className="card mb-16 flex items-center justify-between" style={{ background: '#f8f9fa' }}>
        <div className="flex items-center gap-12">
          <span className="font-semibold text-sm text-dark">Sélectionner un influenceur :</span>
          <select
            className="form-input"
            style={{ width: 260, fontWeight: 700 }}
            value={selectedInfId}
            onChange={e => setSelectedInfId(e.target.value)}
          >
            {influencers.map(inf => (
              <option key={inf.id} value={inf.id}>
                @{inf.name} ({inf.realName}) — {inf.followers} abonnés
              </option>
            ))}
          </select>
        </div>

        {/* Mini tabs */}
        <div className="flex gap-4">
          <button
            className={`btn btn-sm ${activeSubTab === 'publications' ? 'btn-orange' : 'btn-ghost'}`}
            onClick={() => setActiveSubTab('publications')}
          >
            📱 Publications ({pubStats.length})
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'evolution' ? 'btn-orange' : 'btn-ghost'}`}
            onClick={() => setActiveSubTab('evolution')}
          >
            📈 Évolution Abonnés
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'benchmark' ? 'btn-orange' : 'btn-ghost'}`}
            onClick={() => setActiveSubTab('benchmark')}
          >
            🏆 Benchmark / Classement
          </button>
        </div>
      </div>

      {/* Cartes KPI globales pour l'influenceur sélectionné */}
      {activeSubTab !== 'benchmark' && (
        <div className="grid grid-4 gap-16 mb-20">
          <div className="card kpi-card border-l-4" style={{ borderLeftColor: 'var(--blue)' }}>
            <div className="text-xs text-muted mb-4">Vues / Impressions Totales</div>
            <div className="text-xl font-bold text-dark">{formatNumber(totalVues || totalImpressions)}</div>
            <div className="text-xs text-muted mt-4">{pubStats.length} publication(s) enregistrée(s)</div>
          </div>
          <div className="card kpi-card border-l-4" style={{ borderLeftColor: 'var(--green)' }}>
            <div className="text-xs text-muted mb-4">Portée Globale (Reach)</div>
            <div className="text-xl font-bold" style={{ color: 'var(--green)' }}>{formatNumber(totalReach)}</div>
            <div className="text-xs text-muted mt-4">Interactions: {formatNumber(totalLikes + totalComments + totalPartages)}</div>
          </div>
          <div className="card kpi-card border-l-4" style={{ borderLeftColor: 'var(--orange)' }}>
            <div className="text-xs text-muted mb-4">Taux d'Engagement Moyen</div>
            <div className="text-xl font-bold" style={{ color: 'var(--orange)' }}>{avgEngagement}%</div>
            <div className="text-xs text-muted mt-4">Objectif campagne: 6.0%</div>
          </div>
          <div className="card kpi-card border-l-4" style={{ borderLeftColor: 'var(--purple)' }}>
            <div className="text-xs text-muted mb-4">Abonnés actuels</div>
            <div className="text-xl font-bold text-dark">{selectedInf?.followers}</div>
            <div className="text-xs text-muted mt-4">{selectedInf?.niche} • {selectedInf?.platform}</div>
          </div>
        </div>
      )}

      {/* Onglet 1: Statistiques par publication */}
      {activeSubTab === 'publications' && (
        <div className="card">
          <h3 className="text-md font-bold text-dark mb-12 flex items-center justify-between">
            <span>Publications de @{selectedInf.name}</span>
            <span className="text-xs font-normal text-muted">Données modifiables manuellement ou via import</span>
          </h3>

          {pubStats.length === 0 ? (
            <div className="text-center py-20 text-muted">
              Aucune publication enregistrée pour cet influenceur.<br />
              <button className="btn btn-ghost text-orange mt-8" onClick={() => setShowAddPubModal(true)}>
                + Saisir manuellement une publication
              </button>
            </div>
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-8 text-xs font-semibold">Titre publication</th>
                  <th className="py-8 text-xs font-semibold text-center">Plateforme</th>
                  <th className="py-8 text-xs font-semibold text-center">Date</th>
                  <th className="py-8 text-xs font-semibold text-right">Vues</th>
                  <th className="py-8 text-xs font-semibold text-right">Likes</th>
                  <th className="py-8 text-xs font-semibold text-right">Commentaires</th>
                  <th className="py-8 text-xs font-semibold text-right">Partages</th>
                  <th className="py-8 text-xs font-semibold text-right">Reach / Impressions</th>
                  <th className="py-8 text-xs font-semibold text-center">Taux d'Engagement</th>
                </tr>
              </thead>
              <tbody>
                {pubStats.map((pub, idx) => (
                  <tr key={pub.id || idx} className="border-b" style={{ borderColor: '#f1f1f1' }}>
                    <td className="py-10">
                      <div className="font-bold text-sm text-dark">{pub.titre}</div>
                    </td>
                    <td className="py-10 text-center">
                      <span className="tag" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)', fontSize: 10 }}>
                        {pub.plateforme}
                      </span>
                    </td>
                    <td className="py-10 text-center text-xs text-muted">{pub.date}</td>
                    <td className="py-10 text-right font-semibold text-sm">{formatNumber(pub.vues)}</td>
                    <td className="py-10 text-right text-sm">{formatNumber(pub.likes)}</td>
                    <td className="py-10 text-right text-sm">{formatNumber(pub.commentaires)}</td>
                    <td className="py-10 text-right text-sm">{formatNumber(pub.partages)}</td>
                    <td className="py-10 text-right text-sm">
                      <div><strong className="text-blue">{formatNumber(pub.reach)}</strong> (Reach)</div>
                      <div className="text-xs text-muted">{formatNumber(pub.impressions)} imp.</div>
                    </td>
                    <td className="py-10 text-center font-bold" style={{ color: pub.tauxEngagement >= 6 ? 'var(--green)' : 'var(--orange)' }}>
                      {pub.tauxEngagement}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Onglet 2: Évolution des abonnés pendant la campagne */}
      {activeSubTab === 'evolution' && (
        <div className="card">
          <h3 className="text-md font-bold text-dark mb-12">📈 Historique et évolution des abonnés pour @{selectedInf.name}</h3>
          {selectedInf.followersHistory && selectedInf.followersHistory.length > 0 ? (
            <div>
              <div className="grid grid-6 gap-12 mb-20 text-center">
                {selectedInf.followersHistory.map((fh, idx) => (
                  <div key={idx} className="p-12 border rounded" style={{ background: '#fafafa' }}>
                    <div className="text-xs text-muted mb-4">{fh.date}</div>
                    <div className="text-base font-bold text-dark">{formatNumber(fh.total)}</div>
                  </div>
                ))}
              </div>

              {/* Représentation graphique simple en barres */}
              <div className="p-16 border rounded" style={{ background: '#fff' }}>
                <div className="text-xs font-semibold text-muted mb-12">Courbe d'évolution (base 100k+)</div>
                <div className="flex items-end gap-16" style={{ height: 160, paddingBottom: 20, borderBottom: '1px solid #eee' }}>
                  {selectedInf.followersHistory.map((fh, idx) => {
                    const maxVal = Math.max(...selectedInf.followersHistory.map(f => f.total));
                    const heightPercent = Math.max(20, Math.round((fh.total / maxVal) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-6" style={{ height: '100%', justifyContent: 'flex-end' }}>
                        <div className="text-xs font-bold text-orange">{formatNumber(fh.total)}</div>
                        <div
                          style={{
                            width: '60%',
                            height: `${heightPercent}%`,
                            background: 'var(--orange)',
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s ease',
                          }}
                        />
                        <div className="text-xs text-muted mt-4">{fh.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted text-center py-16">Pas de données d'évolution pour cet influenceur.</div>
          )}
        </div>
      )}

      {/* Onglet 3: Comparatif entre influenceurs (Benchmark) */}
      {activeSubTab === 'benchmark' && (
        <div className="card">
          <h3 className="text-md font-bold text-dark mb-16">🏆 Benchmark & Classement des Influenceurs</h3>
          <p className="text-sm text-muted mb-16">Comparatif des performances globales, du taux d'engagement et de la réactivité.</p>

          <table className="table w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-8 text-xs font-semibold text-center">Rang</th>
                <th className="py-8 text-xs font-semibold">Influenceur</th>
                <th className="py-8 text-xs font-semibold">Plateforme & Niche</th>
                <th className="py-8 text-xs font-semibold text-right">Abonnés</th>
                <th className="py-8 text-xs font-semibold text-right">Vues Moyennes</th>
                <th className="py-8 text-xs font-semibold text-center">Taux Engagement</th>
                <th className="py-8 text-xs font-semibold text-center">Score Globale</th>
              </tr>
            </thead>
            <tbody>
              {sortedInfluencersBenchmark.map((inf, idx) => (
                <tr key={inf.id} className="border-b" style={{ borderColor: '#f1f1f1', background: inf.id === selectedInf.id ? 'rgba(255,121,0,0.05)' : 'transparent' }}>
                  <td className="py-12 text-center font-bold text-sm">
                    {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                  </td>
                  <td className="py-12">
                    <div className="font-bold text-sm text-dark">@{inf.name}</div>
                    <div className="text-xs text-muted">{inf.realName}</div>
                  </td>
                  <td className="py-12">
                    <span className="tag" style={{ background: '#f0f0f0', color: 'var(--dark)', fontSize: 10 }}>
                      {inf.platform} • {inf.niche}
                    </span>
                  </td>
                  <td className="py-12 text-right font-semibold text-sm">{inf.followers}</td>
                  <td className="py-12 text-right text-sm">{inf.avgViews}</td>
                  <td className="py-12 text-center font-bold text-sm text-green">
                    {inf.engagement}
                  </td>
                  <td className="py-12 text-center font-bold text-sm text-orange">
                    {inf.scorePerformance || inf.score}/5 ⭐
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Ajout Manuel Publication */}
      {showAddPubModal && (
        <div className="inf-modal-overlay" onClick={() => setShowAddPubModal(false)}>
          <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <button className="inf-modal-close" onClick={() => setShowAddPubModal(false)}>✕</button>
            <h3 className="text-lg font-bold text-dark mb-16">Saisir une publication pour @{selectedInf.name}</h3>

            <div className="inf-edit-grid">
              <div className="inf-edit-full">
                <label className="form-label">Titre / Description publication *</label>
                <input
                  className="form-input"
                  placeholder="Ex: Reel Promo Fibre Maxit..."
                  value={newPub.titre}
                  onChange={e => setNewPub({ ...newPub, titre: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Plateforme</label>
                <select
                  className="form-input"
                  value={newPub.plateforme}
                  onChange={e => setNewPub({ ...newPub, plateforme: e.target.value })}
                >
                  <option>Instagram</option>
                  <option>TikTok</option>
                  <option>YouTube</option>
                  <option>Facebook</option>
                  <option>X/Twitter</option>
                </select>
              </div>

              <div>
                <label className="form-label">Date publication</label>
                <input
                  type="date"
                  className="form-input"
                  value={newPub.date}
                  onChange={e => setNewPub({ ...newPub, date: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Vues</label>
                <input
                  type="number"
                  className="form-input"
                  value={newPub.vues}
                  onChange={e => setNewPub({ ...newPub, vues: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Likes</label>
                <input
                  type="number"
                  className="form-input"
                  value={newPub.likes}
                  onChange={e => setNewPub({ ...newPub, likes: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Commentaires</label>
                <input
                  type="number"
                  className="form-input"
                  value={newPub.commentaires}
                  onChange={e => setNewPub({ ...newPub, commentaires: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Partages</label>
                <input
                  type="number"
                  className="form-input"
                  value={newPub.partages}
                  onChange={e => setNewPub({ ...newPub, partages: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Reach (Portée unique)</label>
                <input
                  type="number"
                  className="form-input"
                  value={newPub.reach}
                  onChange={e => setNewPub({ ...newPub, reach: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Impressions Totales</label>
                <input
                  type="number"
                  className="form-input"
                  value={newPub.impressions}
                  onChange={e => setNewPub({ ...newPub, impressions: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-8 mt-16">
              <button className="btn btn-orange" style={{ flex: 1 }} onClick={handleAddPublication}>
                Enregistrer la publication
              </button>
              <button className="btn btn-ghost" onClick={() => setShowAddPubModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
