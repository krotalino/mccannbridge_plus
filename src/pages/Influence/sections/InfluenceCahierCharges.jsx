import { useState } from 'react';

const LIVRABLE_STATUTS = ['a_faire', 'en_cours', 'livre', 'valide'];

function getStatutLabel(s) {
  const map = { a_faire: 'À faire', en_cours: 'En cours', livre: 'Livré', valide: 'Validé' };
  return map[s] || s;
}

function getStatutColor(s) {
  const map = { a_faire: '#8C8C8C', en_cours: '#2980B9', livre: '#F39C12', valide: '#27AE60' };
  return map[s] || '#8C8C8C';
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

export default function InfluenceCahierCharges({ influencers, setInfluencers }) {
  const [filterInf, setFilterInf] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(null);

  // Rassembler tous les cahiers des charges
  const allCdc = (influencers || []).flatMap(inf =>
    (inf.cahierDesCharges || []).map(cdc => ({
      ...cdc,
      influencerId: inf.id,
      influencerName: inf.pseudo || inf.name,
      influencerRealName: inf.realName || `${inf.prenom || ''} ${inf.nom || ''}`.trim(),
    }))
  );

  const filteredCdc = allCdc.filter(cdc => {
    if (filterInf && String(cdc.influencerId) !== String(filterInf)) return false;
    if (filterStatut) {
      const hasStatut = (cdc.livrables || []).some(l => l.statut === filterStatut);
      if (!hasStatut) return false;
    }
    return true;
  });

  // KPIs livrables
  const allLivrables = allCdc.flatMap(cdc => cdc.livrables);
  const kpis = {
    total: allLivrables.length,
    aFaire: allLivrables.filter(l => l.statut === 'a_faire').length,
    enCours: allLivrables.filter(l => l.statut === 'en_cours').length,
    livres: allLivrables.filter(l => l.statut === 'livre').length,
    valides: allLivrables.filter(l => l.statut === 'valide').length,
    enRetard: allLivrables.filter(l => {
      const days = getDaysUntil(l.deadline);
      return days !== null && days < 0 && l.statut !== 'valide';
    }).length,
  };

  const handleStatutChange = (infId, cdcId, livrableId, newStatut) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id !== infId) return inf;
      const cahierDesCharges = (inf.cahierDesCharges || []).map(cdc => {
        if (cdc.id !== cdcId) return cdc;
        const livrables = cdc.livrables.map(l => l.id === livrableId ? { ...l, statut: newStatut } : l);
        return { ...cdc, livrables };
      });
      return { ...inf, cahierDesCharges };
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div>
          <h2 className="text-xl font-bold text-dark mb-4">📝 Cahier des Charges</h2>
          <p className="text-sm text-muted">Livrables, deadlines et guidelines par campagne</p>
        </div>
      </div>

      {/* KPI Kanban-like counters */}
      <div className="grid mb-20" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { label: 'À faire', count: kpis.aFaire, color: '#8C8C8C', icon: '📋' },
          { label: 'En cours', count: kpis.enCours, color: '#2980B9', icon: '🔄' },
          { label: 'Livrés', count: kpis.livres, color: '#F39C12', icon: '📦' },
          { label: 'Validés', count: kpis.valides, color: '#27AE60', icon: '✅' },
          { label: 'En retard', count: kpis.enRetard, color: '#E74C3C', icon: '⚠️' },
        ].map((k, i) => (
          <div key={i} className="card text-center py-12" style={{ borderBottom: `3px solid ${k.color}` }}>
            <div className="text-xl font-bold" style={{ color: k.color }}>{k.count}</div>
            <div className="text-xs text-muted font-semibold mt-4">{k.icon} {k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="inf-search-panel" style={{ marginBottom: 16 }}>
        <div className="inf-search-row">
          <select className="form-input" value={filterInf} onChange={e => setFilterInf(e.target.value)}>
            <option value="">Tous les influenceurs</option>
            {influencers.map(i => <option key={i.id} value={i.id}>@{i.name}</option>)}
          </select>
          <select className="form-input" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            {LIVRABLE_STATUTS.map(s => <option key={s} value={s}>{getStatutLabel(s)}</option>)}
          </select>
        </div>
      </div>

      {/* Liste des cahiers des charges */}
      {filteredCdc.length === 0 ? (
        <div className="card text-center text-muted py-20">Aucun cahier des charges trouvé.</div>
      ) : filteredCdc.map(cdc => (
        <div key={cdc.id} className="card mb-16" style={{ borderLeft: '4px solid var(--orange)' }}>
          {/* En-tête campagne */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-lg font-bold text-dark mb-4">{cdc.campagneNom}</h3>
              <div className="text-sm text-muted">
                @{cdc.influencerName} — {cdc.influencerRealName}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm text-orange" onClick={() => setShowGuidelinesModal(cdc)}>
              📖 Guidelines
            </button>
          </div>

          {/* Produits à promouvoir */}
          <div className="flex gap-4 flex-wrap mb-12">
            <span className="text-xs font-semibold text-muted" style={{ marginRight: 4 }}>Produits :</span>
            {(cdc.produits || []).map((p, i) => (
              <span key={i} className="tag" style={{ background: 'rgba(41,128,185,0.1)', color: 'var(--blue)', fontSize: 10 }}>{p}</span>
            ))}
          </div>

          {/* Tableau des livrables */}
          <table className="table w-full">
            <thead>
              <tr>
                <th className="py-8 text-xs font-semibold">Livrable</th>
                <th className="py-8 text-xs font-semibold text-center">Type</th>
                <th className="py-8 text-xs font-semibold text-center">Deadline</th>
                <th className="py-8 text-xs font-semibold text-center">Jours restants</th>
                <th className="py-8 text-xs font-semibold text-center">Statut</th>
                <th className="py-8 text-xs font-semibold">Guidelines</th>
              </tr>
            </thead>
            <tbody>
              {cdc.livrables.map(livrable => {
                const days = getDaysUntil(livrable.deadline);
                const isOverdue = days !== null && days < 0 && livrable.statut !== 'valide';
                const stColor = isOverdue ? 'var(--red)' : getStatutColor(livrable.statut);
                return (
                  <tr key={livrable.id} className="border-b" style={{ borderColor: '#f1f1f1', background: isOverdue ? 'rgba(231,76,60,0.04)' : 'transparent' }}>
                    <td className="py-10">
                      <div className="font-semibold text-sm text-dark">{livrable.titre}</div>
                    </td>
                    <td className="py-10 text-center">
                      <span className="tag" style={{ background: '#f0f0f0', color: 'var(--dark)', fontSize: 10 }}>
                        {livrable.type === 'video' ? '🎬' : livrable.type === 'story' ? '📱' : livrable.type === 'post' ? '📸' : livrable.type === 'live' ? '🔴' : '📄'} {livrable.type}
                      </span>
                    </td>
                    <td className="py-10 text-center text-sm">{livrable.deadline}</td>
                    <td className="py-10 text-center">
                      <span className="text-sm font-bold" style={{ color: isOverdue ? 'var(--red)' : days <= 3 ? 'var(--yellow)' : 'var(--green)' }}>
                        {days === null ? '—' : isOverdue ? `${Math.abs(days)}j de retard` : `${days}j`}
                      </span>
                    </td>
                    <td className="py-10 text-center">
                      <select
                        className="form-input"
                        value={livrable.statut}
                        onChange={e => handleStatutChange(cdc.influencerId, cdc.id, livrable.id, e.target.value)}
                        style={{
                          fontSize: 11, padding: '4px 8px', borderRadius: 4,
                          background: stColor + '15', color: stColor, fontWeight: 700,
                          border: `1px solid ${stColor}40`, cursor: 'pointer', maxWidth: 120
                        }}
                      >
                        {LIVRABLE_STATUTS.map(s => <option key={s} value={s}>{getStatutLabel(s)}</option>)}
                      </select>
                    </td>
                    <td className="py-10 text-xs text-muted" style={{ maxWidth: 180 }}>{livrable.guidelines}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {/* Modal Guidelines */}
      {showGuidelinesModal && (
        <div className="inf-modal-overlay" onClick={() => setShowGuidelinesModal(null)}>
          <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <button className="inf-modal-close" onClick={() => setShowGuidelinesModal(null)}>✕</button>
            <h3 className="text-lg font-bold text-dark mb-16">📖 Guidelines de marque</h3>
            <p className="text-sm text-muted mb-12">{showGuidelinesModal.campagneNom} — @{showGuidelinesModal.influencerName}</p>

            <div className="inf-overview-grid" style={{ gap: 12 }}>
              <div className="inf-ov-card">
                <div className="inf-ov-label">TON</div>
                <p className="text-sm">{showGuidelinesModal.guidelineMarque?.ton || '—'}</p>
              </div>
              <div className="inf-ov-card">
                <div className="inf-ov-label">VISUELS</div>
                <p className="text-sm">{showGuidelinesModal.guidelineMarque?.visuels || '—'}</p>
              </div>
              <div className="inf-ov-card">
                <div className="inf-ov-label">HASHTAGS OBLIGATOIRES</div>
                <div className="flex gap-4 flex-wrap mt-4">
                  {(showGuidelinesModal.guidelineMarque?.hashtags || []).map((h, i) => (
                    <span key={i} className="tag" style={{ background: 'rgba(255,121,0,0.1)', color: 'var(--orange)', fontSize: 11 }}>{h}</span>
                  ))}
                </div>
              </div>
              <div className="inf-ov-card">
                <div className="inf-ov-label">MENTIONS OBLIGATOIRES</div>
                <div className="flex gap-4 flex-wrap mt-4">
                  {(showGuidelinesModal.guidelineMarque?.mentions || []).map((m, i) => (
                    <span key={i} className="tag" style={{ background: 'rgba(41,128,185,0.1)', color: 'var(--blue)', fontSize: 11 }}>{m}</span>
                  ))}
                </div>
              </div>
              <div className="inf-ov-card">
                <div className="inf-ov-label">PRODUITS / SERVICES À PROMOUVOIR</div>
                <div className="flex gap-4 flex-wrap mt-4">
                  {(showGuidelinesModal.produits || []).map((p, i) => (
                    <span key={i} className="tag" style={{ background: 'rgba(39,174,96,0.1)', color: 'var(--green)', fontSize: 11 }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn btn-ghost mt-16 w-full" onClick={() => setShowGuidelinesModal(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
