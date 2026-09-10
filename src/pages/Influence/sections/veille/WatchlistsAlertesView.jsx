import { useState } from 'react';
import {
  formatTimeAgo,
  formatFullDateFr,
  ALERT_PRIORITIES,
  CONFIDENCE_LEVELS,
} from './veilleUtils.js';

export default function WatchlistsAlertesView({
  watchlists = [],
  alerts = [],
  watchItems = [],
  onSaveWatchlist,
  onResolveAlert,
  onOpenTransformModal,
}) {
  const [subTab, setSubTab] = useState('alerts'); // 'alerts' | 'watchlists'
  const [alertFilter, setAlertFilter] = useState('all'); // 'all' | 'nouveau' | 'en_cours' | 'resolu'
  const [showAddWlModal, setShowAddWlModal] = useState(false);

  // Formulaire nouvelle Watchlist
  const [newWl, setNewWl] = useState({
    name: '',
    description: '',
    visibility: 'equipe',
    keywords: '',
    threshold_drop_pct: 15
  });

  const filteredAlerts = alerts.filter(a => {
    if (alertFilter === 'all') return true;
    return a.status === alertFilter;
  });

  const handleCreateWatchlist = (e) => {
    e.preventDefault();
    if (!newWl.name.trim()) return;

    const created = {
      id: `WL-${Date.now().toString().slice(-4)}`,
      name: newWl.name,
      description: newWl.description || 'Watchlist personnalisée',
      owner: 'Utilisateur Actif',
      visibility: newWl.visibility,
      active: true,
      filters: {
        keywords: newWl.keywords ? newWl.keywords.split(',').map(s => s.trim()) : []
      },
      thresholds: {
        engagement_drop_pct: parseInt(newWl.threshold_drop_pct, 10) || 15
      },
      notification_preferences: { in_app: true, email: true },
      item_count: 0
    };

    onSaveWatchlist(created);
    setShowAddWlModal(false);
    setNewWl({ name: '', description: '', visibility: 'equipe', keywords: '', threshold_drop_pct: 15 });
  };

  return (
    <div className="watchlists-alertes-view">
      {/* Barre d'onglets de gestion */}
      <div className="flex items-center justify-between gap-12 mb-16">
        <div className="tab-bar flex gap-4 p-4" style={{ background: '#F5F5F5', borderRadius: 8 }}>
          <button
            onClick={() => setSubTab('alerts')}
            className={`tab-item ${subTab === 'alerts' ? 'active' : ''}`}
            style={{ fontWeight: 700, fontSize: 13 }}
          >
            🚨 Gestion des Alertes & Triage ({alerts.filter(a => a.status !== 'resolu').length} en cours)
          </button>
          <button
            onClick={() => setSubTab('watchlists')}
            className={`tab-item ${subTab === 'watchlists' ? 'active' : ''}`}
            style={{ fontWeight: 700, fontSize: 13 }}
          >
            📋 Abonnements de Veille & Watchlists ({watchlists.length})
          </button>
        </div>

        {subTab === 'watchlists' && (
          <button
            onClick={() => setShowAddWlModal(true)}
            className="btn btn-orange btn-sm flex items-center gap-6"
            style={{ fontWeight: 700 }}
          >
            <span>+</span>
            <span>Créer une Watchlist</span>
          </button>
        )}
      </div>

      {/* ─── SOUS-ONGLET 1 : GESTION DES ALERTES & WORKFLOW ─── */}
      {subTab === 'alerts' && (
        <div>
          {/* Filtres de statut d'alerte */}
          <div className="flex items-center gap-8 mb-16 text-xs">
            <span className="font-bold text-dark">Filtrer par statut :</span>
            {['all', 'nouveau', 'en_cours', 'resolu'].map(st => (
              <button
                key={st}
                onClick={() => setAlertFilter(st)}
                className={`btn btn-sm ${alertFilter === st ? 'btn-dark' : 'btn-white'}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                {st === 'all' ? `Toutes (${alerts.length})` : st === 'nouveau' ? 'Nouveau' : st === 'en_cours' ? 'En cours' : 'Résolu'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-12">
            {filteredAlerts.map(alert => {
              const pConfig = ALERT_PRIORITIES[alert.priority?.toUpperCase()] || ALERT_PRIORITIES.IMPORTANT;
              const isResolved = alert.status === 'resolu';

              return (
                <div
                  key={alert.id}
                  className="card p-16 shadow-sm"
                  style={{
                    borderLeft: `4px solid ${pConfig.color}`,
                    background: isResolved ? '#FAFAFA' : '#FFF',
                    opacity: isResolved ? 0.85 : 1
                  }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-8">
                      <span className="tag" style={{ background: pConfig.bg, color: pConfig.color, border: `1px solid ${pConfig.border}`, fontSize: 10, fontWeight: 700 }}>
                        {pConfig.label}
                      </span>
                      <h4 className="text-sm font-bold text-dark">{alert.title}</h4>
                      <span className={`tag ${alert.status === 'nouveau' ? 'tag-red' : alert.status === 'en_cours' ? 'tag-yellow' : 'tag-green'}`} style={{ fontSize: 10 }}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-muted">{formatTimeAgo(alert.created_at)}</span>
                  </div>

                  <div className="grid grid-2 gap-12 p-10 rounded mb-10 text-xs" style={{ background: '#F8F9FA' }}>
                    <div>
                      <span className="text-muted">Règle de déclenchement : </span>
                      <strong className="text-dark">{alert.trigger_rule}</strong>
                    </div>
                    <div>
                      <span className="text-muted">Assigné à : </span>
                      <strong className="text-dark">{alert.assigned_to || 'Équipe'}</strong> • Échéance : {alert.due_at ? alert.due_at.substring(0, 10) : '24h'}
                    </div>
                  </div>

                  <div className="p-8 rounded text-xs mb-10" style={{ background: '#FFF3E0', border: '1px solid #FFE0B2' }}>
                    <strong className="text-orange-900">Action recommandée : </strong>
                    <span className="text-orange-900">{alert.recommended_action}</span>
                  </div>

                  {alert.resolution_note && (
                    <div className="p-8 rounded text-xs mb-10" style={{ background: '#E8F5E9', border: '1px solid #C8E6C9' }}>
                      <strong className="text-green-900">Note de résolution : </strong>
                      <span className="text-green-800">{alert.resolution_note}</span>
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="flex justify-between items-center pt-8 border-t border-gray-100 text-xs">
                    <span className="text-muted">ID Alerte : {alert.id}</span>
                    <div className="flex items-center gap-8">
                      {!isResolved && (
                        <button
                          onClick={() => {
                            const note = prompt('Note de résolution ou motif de clôture :', 'Traité et validé');
                            if (note !== null) {
                              onResolveAlert(alert.id, note);
                            }
                          }}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#28A745', fontWeight: 600 }}
                        >
                          ✓ Marquer Résolu
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const item = watchItems.find(w => w.id === alert.watch_item_id) || {
                            id: alert.id,
                            title: alert.title,
                            recommended_action: alert.recommended_action
                          };
                          onOpenTransformModal(item);
                        }}
                        className="btn btn-sm"
                        style={{ background: '#FF7900', color: '#FFF', fontWeight: 700 }}
                      >
                        Créer Décision / Tâche
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SOUS-ONGLET 2 : LISTE DES WATCHLISTS CONFIGURABLES ─── */}
      {subTab === 'watchlists' && (
        <div>
          <div className="grid grid-2 gap-16">
            {watchlists.map(wl => (
              <div key={wl.id} className="card p-16 shadow-sm" style={{ background: '#FFF' }}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-sm font-bold text-dark mb-2">{wl.name}</h4>
                    <div className="text-xs text-muted">
                      Propriétaire : {wl.owner} • Visibilité : <strong className="text-dark">{wl.visibility}</strong>
                    </div>
                  </div>
                  <span className={`tag ${wl.active ? 'tag-green' : 'tag-muted'}`} style={{ fontSize: 10 }}>
                    {wl.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-xs text-muted mb-12 leading-relaxed">
                  {wl.description}
                </p>

                <div className="p-8 rounded mb-12 text-xs" style={{ background: '#F8F9FA' }}>
                  <div className="text-dark font-semibold mb-4">Seuils d’alerte configurés :</div>
                  <ul className="text-muted" style={{ paddingLeft: 16, margin: 0 }}>
                    <li>Alerte baisse engagement : &gt; {wl.thresholds?.engagement_drop_pct || 15}%</li>
                    <li>Notifications : {wl.notification_preferences?.email ? 'In-App + Email' : 'In-App seulement'}</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-gray-100 text-xs text-muted">
                  <span>Filtres : {(wl.filters?.type || []).join(', ') || 'Tous types'}</span>
                  <span className="font-bold text-dark">{wl.item_count || 0} éléments suivis</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal d'ajout de Watchlist */}
      {showAddWlModal && (
        <div className="modal-overlay" onClick={() => setShowAddWlModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 16
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 12, width: '100%', maxWidth: 540, padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div className="flex justify-between items-start pb-12 mb-16 border-b">
              <h3 className="text-base font-bold text-dark">Nouvelle Watchlist de Veille</h3>
              <button onClick={() => setShowAddWlModal(false)} className="btn btn-ghost btn-sm">✕</button>
            </div>

            <form onSubmit={handleCreateWatchlist}>
              <div className="mb-12">
                <label className="text-xs font-semibold text-dark mb-4 block">Nom de la watchlist *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Veille Rentrée Scolaire & Forfaits Étudiants"
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={newWl.name}
                  onChange={(e) => setNewWl({ ...newWl, name: e.target.value })}
                />
              </div>

              <div className="mb-12">
                <label className="text-xs font-semibold text-dark mb-4 block">Description</label>
                <textarea
                  rows={2}
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={newWl.description}
                  onChange={(e) => setNewWl({ ...newWl, description: e.target.value })}
                />
              </div>

              <div className="grid grid-2 gap-12 mb-16">
                <div>
                  <label className="text-xs font-semibold text-dark mb-4 block">Visibilité</label>
                  <select
                    className="input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                    value={newWl.visibility}
                    onChange={(e) => setNewWl({ ...newWl, visibility: e.target.value })}
                  >
                    <option value="privee">Privée (Moi uniquement)</option>
                    <option value="equipe">Équipe Agence McCANN</option>
                    <option value="client_autorise">Client Orange Cameroun</option>
                    <option value="organisation">Organisation complète</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-dark mb-4 block">Seuil d’alerte baisse engagement (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    className="input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                    value={newWl.threshold_drop_pct}
                    onChange={(e) => setNewWl({ ...newWl, threshold_drop_pct: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-8 pt-12 border-t">
                <button type="button" onClick={() => setShowAddWlModal(false)} className="btn btn-ghost">
                  Annuler
                </button>
                <button type="submit" className="btn btn-orange" style={{ fontWeight: 700 }}>
                  Créer la Watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
