import { useState, useMemo } from 'react';
import {
  formatTimeAgo,
  formatFullDateFr,
  getTypeLabel,
  getTypeIcon,
  getPlatformBadge,
  getFreshnessBadge,
  RELIABILITY_LEVELS,
  CONFIDENCE_LEVELS,
  ALERT_PRIORITIES,
} from './veilleUtils.js';

export default function FluxVeilleView({
  watchItems = [],
  influencers = [],
  competitors = [],
  onOpenTransformModal,
  onMarkItemRead,
  onDeleteItem,
}) {
  const [displayMode, setDisplayMode] = useState('cards'); // 'cards' | 'list' | 'grouped'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedReliability, setSelectedReliability] = useState('all');
  const [selectedNature, setSelectedNature] = useState('all'); // 'all' | 'opportunity' | 'risk'

  // Filtrage
  const filteredItems = useMemo(() => {
    return watchItems.filter(item => {
      // Recherche textuelle
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchSummary = item.summary?.toLowerCase().includes(q);
        const matchSource = item.source_name?.toLowerCase().includes(q);
        const matchKeywords = (item.keywords || []).some(k => k.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchSource && !matchKeywords) return false;
      }

      // Filtre Type
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      // Filtre Plateforme
      if (selectedPlatform !== 'all' && item.platform?.toLowerCase() !== selectedPlatform.toLowerCase()) return false;

      // Filtre Priorité
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;

      // Filtre Fiabilité
      if (selectedReliability !== 'all' && item.reliability_level !== selectedReliability) return false;

      // Filtre Nature (opportunité / risque)
      if (selectedNature !== 'all' && item.opportunity_or_risk !== selectedNature) return false;

      return true;
    });
  }, [watchItems, searchQuery, selectedType, selectedPlatform, selectedPriority, selectedReliability, selectedNature]);

  return (
    <div className="flux-veille-view">
      {/* ─── BARRE DE FILTRES MULTI-CRITÈRES ─── */}
      <div className="card mb-16 p-12" style={{ background: '#fff', borderRadius: 8 }}>
        <div className="flex flex-wrap items-center justify-between gap-12 mb-12">
          {/* Recherche */}
          <div className="flex items-center gap-8 flex-1" style={{ minWidth: 260 }}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher par mot-clé, marque (MTN, Camtel), créateur, hashtag..."
              className="input"
              style={{ width: '100%', padding: '7px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ddd' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                ✕
              </button>
            )}
          </div>

          {/* Sélecteur de mode d'affichage */}
          <div className="flex items-center gap-4 p-2" style={{ background: '#f0f0f0', borderRadius: 6 }}>
            <button
              onClick={() => setDisplayMode('cards')}
              className={`btn btn-sm ${displayMode === 'cards' ? 'btn-white' : 'btn-ghost'}`}
              style={{ padding: '4px 10px', fontSize: 11, fontWeight: displayMode === 'cards' ? 700 : 500 }}
            >
              🗂️ Cartes
            </button>
            <button
              onClick={() => setDisplayMode('list')}
              className={`btn btn-sm ${displayMode === 'list' ? 'btn-white' : 'btn-ghost'}`}
              style={{ padding: '4px 10px', fontSize: 11, fontWeight: displayMode === 'list' ? 700 : 500 }}
            >
              ☰ Liste dense
            </button>
          </div>
        </div>

        {/* Ligne des filtres détaillés */}
        <div className="flex flex-wrap items-center gap-8 text-xs">
          <select
            className="input"
            style={{ padding: '5px 8px', fontSize: 11, borderRadius: 6, border: '1px solid #ddd' }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Tous les types ({watchItems.length})</option>
            <option value="influencer">👤 Influenceurs / Talents</option>
            <option value="competitor">⚔️ Concurrence (MTN, Camtel)</option>
            <option value="campaign">🎯 Campagnes</option>
            <option value="trend">🔥 Tendances & Formats</option>
            <option value="platform">📱 Plateformes</option>
            <option value="regulation">⚖️ Réglementation & CNC</option>
          </select>

          <select
            className="input"
            style={{ padding: '5px 8px', fontSize: 11, borderRadius: 6, border: '1px solid #ddd' }}
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="all">Toutes plateformes</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="linkedin">LinkedIn</option>
            <option value="x">X (Twitter)</option>
            <option value="multi">Multi-plateformes</option>
          </select>

          <select
            className="input"
            style={{ padding: '5px 8px', fontSize: 11, borderRadius: 6, border: '1px solid #ddd' }}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="all">Toutes priorités</option>
            <option value="bloquant">Bloquant</option>
            <option value="critique">Critique</option>
            <option value="important">Important</option>
            <option value="a_surveiller">À surveiller</option>
            <option value="information">Information</option>
          </select>

          <select
            className="input"
            style={{ padding: '5px 8px', fontSize: 11, borderRadius: 6, border: '1px solid #ddd' }}
            value={selectedNature}
            onChange={(e) => setSelectedNature(e.target.value)}
          >
            <option value="all">Toutes natures</option>
            <option value="opportunity">🟢 Opportunités seulement</option>
            <option value="risk">🔴 Risques / Alertes</option>
          </select>

          <span className="text-muted ml-auto font-semibold">
            {filteredItems.length} signal{filteredItems.length > 1 ? 'aux' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ─── VUE 1 : GRILLE DE CARTES ENRICHIES ─── */}
      {displayMode === 'cards' && (
        <div className="grid grid-2 gap-16">
          {filteredItems.map(item => {
            const pBadge = getPlatformBadge(item.platform);
            const rLevel = RELIABILITY_LEVELS[item.reliability_level] || RELIABILITY_LEVELS.B_VERIFIEE;
            const fBadge = getFreshnessBadge(item.freshness_status);
            const isOpp = item.opportunity_or_risk === 'opportunity';
            const isRisk = item.opportunity_or_risk === 'risk';

            return (
              <div
                key={item.id}
                className="card p-16 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
                style={{
                  borderLeft: `4px solid ${isOpp ? '#28A745' : isRisk ? '#DC3545' : '#FF7900'}`,
                  background: item.status === 'lu' ? '#FAFAFA' : '#FFF'
                }}
              >
                <div>
                  {/* Header de carte */}
                  <div className="flex items-center justify-between gap-8 mb-8">
                    <div className="flex items-center gap-6 flex-wrap">
                      <span className="tag" style={{ background: '#F0F0F0', color: '#333', fontSize: 10, fontWeight: 700 }}>
                        {getTypeIcon(item.type)} {getTypeLabel(item.type)}
                      </span>
                      <span className="tag" style={{ background: pBadge.bg, color: pBadge.color, fontSize: 10 }}>
                        {pBadge.icon} {pBadge.label}
                      </span>
                      <span className="tag" style={{ background: fBadge.bg, color: fBadge.color, fontSize: 10 }}>
                        {fBadge.icon} {fBadge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-muted">
                      <span>{formatTimeAgo(item.published_at || item.collected_at)}</span>
                    </div>
                  </div>

                  {/* Titre */}
                  <h4 className="text-sm font-bold text-dark mb-6 leading-snug">
                    {item.title}
                  </h4>

                  {/* Résumé */}
                  <p className="text-xs text-muted mb-12 leading-relaxed" style={{ fontSize: 12 }}>
                    {item.summary}
                  </p>

                  {/* Métadonnées : Source & Certitude */}
                  <div className="p-8 mb-12 rounded flex flex-wrap items-center justify-between gap-8 text-xs" style={{ background: '#F8F9FA', border: '1px solid #EEE' }}>
                    <div>
                      <span className="text-muted">Source : </span>
                      <strong className="text-dark">{item.source_name}</strong>
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-6 text-orange hover:underline text-xs"
                          style={{ color: '#FF7900' }}
                        >
                          🔗 Lien source
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="tag" style={{ background: rLevel.bg, color: rLevel.color, fontSize: 10 }}>
                        [{rLevel.code}] {rLevel.label}
                      </span>
                      <span className="tag tag-blue" style={{ fontSize: 10 }}>
                        Certitude : {item.confidence_level}
                      </span>
                    </div>
                  </div>

                  {/* Recommandation associée */}
                  {item.recommended_action && (
                    <div className="p-8 mb-12 rounded text-xs" style={{ background: isOpp ? '#E8F5E9' : '#FFF3E0', border: isOpp ? '1px solid #C8E6C9' : '1px solid #FFE0B2' }}>
                      <strong style={{ color: isOpp ? '#2E7D32' : '#E65100' }}>Recommandation d’action : </strong>
                      <span className="text-dark">{item.recommended_action}</span>
                    </div>
                  )}

                  {/* Objets Bridge associés */}
                  {((item.associated_talent_ids && item.associated_talent_ids.length > 0) || (item.associated_competitor_ids && item.associated_competitor_ids.length > 0)) && (
                    <div className="flex items-center gap-6 flex-wrap text-xs mb-12">
                      <span className="text-muted font-semibold">Objets reliés :</span>
                      {item.associated_talent_ids?.map(tId => (
                        <span key={tId} className="tag tag-orange" style={{ fontSize: 10 }}>
                          👤 Talent #{tId}
                        </span>
                      ))}
                      {item.associated_competitor_ids?.map(cId => (
                        <span key={cId} className="tag tag-blue" style={{ fontSize: 10 }}>
                          ⚔️ {cId}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer avec actions directes */}
                <div className="flex items-center justify-between pt-10 border-t border-gray-100 mt-8">
                  <div className="flex items-center gap-6 text-xs text-muted">
                    <span>Statut : <strong className="text-dark uppercase">{item.status}</strong></span>
                  </div>

                  <div className="flex items-center gap-6">
                    {item.status !== 'lu' && (
                      <button
                        onClick={() => onMarkItemRead(item.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 11 }}
                      >
                        Marquer lu
                      </button>
                    )}
                    <button
                      onClick={() => onOpenTransformModal(item)}
                      className="btn btn-sm flex items-center gap-4"
                      style={{ background: '#FF7900', color: '#fff', fontSize: 11, fontWeight: 700 }}
                    >
                      <span>🔄</span>
                      <span>Transformer en Décision</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── VUE 2 : LISTE DENSE COMPARATIVE ─── */}
      {displayMode === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table" style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8F9FA' }}>
                <th>Signal & Contexte</th>
                <th>Type</th>
                <th>Plateforme</th>
                <th>Source & Fiabilité</th>
                <th>Certitude</th>
                <th>Date</th>
                <th>Action Recommandée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const pBadge = getPlatformBadge(item.platform);
                const rLevel = RELIABILITY_LEVELS[item.reliability_level] || RELIABILITY_LEVELS.B_VERIFIEE;

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="font-bold text-dark">{item.title}</div>
                      <div className="text-xs text-muted" style={{ maxWidth: 320 }}>
                        {item.summary?.substring(0, 90)}...
                      </div>
                    </td>
                    <td>
                      <span className="tag" style={{ fontSize: 10 }}>
                        {getTypeIcon(item.type)} {getTypeLabel(item.type)}
                      </span>
                    </td>
                    <td>
                      <span className="tag" style={{ background: pBadge.bg, color: pBadge.color, fontSize: 10 }}>
                        {pBadge.label}
                      </span>
                    </td>
                    <td>
                      <div className="font-semibold text-dark">{item.source_name}</div>
                      <div className="text-xs text-muted">[{rLevel.code}] {rLevel.label}</div>
                    </td>
                    <td>
                      <span className="tag tag-blue" style={{ fontSize: 10 }}>
                        {item.confidence_level}
                      </span>
                    </td>
                    <td className="text-muted whitespace-nowrap">
                      {formatTimeAgo(item.collected_at)}
                    </td>
                    <td style={{ maxWidth: 220 }}>
                      <span className="text-xs text-dark" style={{ fontStyle: 'italic' }}>
                        {item.recommended_action || '—'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap">
                      <button
                        onClick={() => onOpenTransformModal(item)}
                        className="btn btn-sm"
                        style={{ padding: '3px 8px', fontSize: 11, background: '#FF7900', color: '#fff' }}
                      >
                        Décider
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="card p-40 text-center text-muted">
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <div className="text-sm font-bold text-dark mb-4">Aucun signal ne correspond aux filtres sélectionnés</div>
          <div className="text-xs">Essayez d’élargir vos termes de recherche ou de réinitialiser les sélecteurs de type et de plateforme.</div>
        </div>
      )}
    </div>
  );
}
