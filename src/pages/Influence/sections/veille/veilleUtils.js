/**
 * Utility functions, persistence, and helpers for Strategic Watch (Veille Stratégique)
 */

import {
  INITIAL_WATCH_ITEMS,
  INITIAL_WATCHLISTS,
  INITIAL_STRATEGIC_ALERTS,
  INITIAL_COMPETITORS,
  INITIAL_COLLECTION_RUNS,
  RELIABILITY_LEVELS,
  CONFIDENCE_LEVELS,
  ALERT_PRIORITIES,
  RBAC_ROLES,
} from './strategicWatchData.js';

const STORAGE_KEYS = {
  ITEMS: 'bridge_strategic_watch_items_v1',
  WATCHLISTS: 'bridge_strategic_watchlists_v1',
  ALERTS: 'bridge_strategic_alerts_v1',
  COMPETITORS: 'bridge_strategic_competitors_v1',
  RUNS: 'bridge_strategic_runs_v1',
  ROLE: 'bridge_strategic_active_role_v1',
};

// ─── Persistence Helpers ───

export {
  RELIABILITY_LEVELS,
  CONFIDENCE_LEVELS,
  ALERT_PRIORITIES,
  RBAC_ROLES,
};

export function loadStoredWatchItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading watch items:', e);
  }
  return INITIAL_WATCH_ITEMS;
}

export function saveStoredWatchItems(items) {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving watch items:', e);
  }
}

export function loadStoredWatchlists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHLISTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading watchlists:', e);
  }
  return INITIAL_WATCHLISTS;
}

export function saveStoredWatchlists(lists) {
  try {
    localStorage.setItem(STORAGE_KEYS.WATCHLISTS, JSON.stringify(lists));
  } catch (e) {
    console.error('Error saving watchlists:', e);
  }
}

export function loadStoredAlerts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading alerts:', e);
  }
  return INITIAL_STRATEGIC_ALERTS;
}

export function saveStoredAlerts(alerts) {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (e) {
    console.error('Error saving alerts:', e);
  }
}

export function loadStoredCompetitors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPETITORS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading competitors:', e);
  }
  return INITIAL_COMPETITORS;
}

export function saveStoredCompetitors(comps) {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPETITORS, JSON.stringify(comps));
  } catch (e) {
    console.error('Error saving competitors:', e);
  }
}

// Aliases for convenience
export const loadStrategicWatchItems = loadStoredWatchItems;
export const saveStrategicWatchItems = saveStoredWatchItems;
export const loadWatchlists = loadStoredWatchlists;
export const saveWatchlists = saveStoredWatchlists;
export const loadWatchAlerts = loadStoredAlerts;
export const saveWatchAlerts = saveStoredAlerts;
export const loadCompetitors = loadStoredCompetitors;
export const saveCompetitors = saveStoredCompetitors;
export const loadRuns = loadStoredRuns;
export const saveRuns = saveStoredRuns;

export function loadStoredRuns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RUNS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading runs:', e);
  }
  return INITIAL_COLLECTION_RUNS;
}

export function saveStoredRuns(runs) {
  try {
    localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(runs));
  } catch (e) {
    console.error('Error saving runs:', e);
  }
}

export function loadActiveRole() {
  try {
    const r = localStorage.getItem(STORAGE_KEYS.ROLE);
    if (r && RBAC_ROLES[r]) return r;
  } catch (e) {}
  return 'influence_manager';
}

export function saveActiveRole(roleId) {
  try {
    localStorage.setItem(STORAGE_KEYS.ROLE, roleId);
  } catch (e) {}
}

// ─── Formatting & Label Helpers ───

export function formatTimeAgo(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    if (diffSeconds < 60) return "À l'instant";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  } catch (e) {
    return isoString;
  }
}

export function formatFullDateFr(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}

export function getTypeLabel(type) {
  const map = {
    influencer: 'Influenceur / Talent',
    campaign: 'Campagne',
    competitor: 'Concurrence',
    platform: 'Plateforme',
    trend: 'Tendance Contenu',
    media: 'Retombée Média',
    regulation: 'Réglementation',
    sector: 'Macro / Secteur'
  };
  return map[type] || type;
}

export function getTypeIcon(type) {
  const map = {
    influencer: '👤',
    campaign: '🎯',
    competitor: '⚔️',
    platform: '📱',
    trend: '🔥',
    media: '📰',
    regulation: '⚖️',
    sector: '🌐'
  };
  return map[type] || '📌';
}

export function getPlatformBadge(platform) {
  const map = {
    tiktok: { label: 'TikTok', color: '#000', icon: '🎵', bg: '#F1F1F1' },
    instagram: { label: 'Instagram', color: '#C13584', icon: '📸', bg: '#FCE4EC' },
    facebook: { label: 'Facebook', color: '#1877F2', icon: '👥', bg: '#E3F2FD' },
    youtube: { label: 'YouTube', color: '#FF0000', icon: '▶️', bg: '#FFEBEE' },
    linkedin: { label: 'LinkedIn', color: '#0A66C2', icon: '💼', bg: '#E8F4F9' },
    x: { label: 'X (Twitter)', color: '#000', icon: '𝕏', bg: '#EEEEEE' },
    multi: { label: 'Multi-plateformes', color: '#6C757D', icon: '🌐', bg: '#F5F5F5' },
    web: { label: 'Web & Presse', color: '#495057', icon: '📰', bg: '#E9ECEF' }
  };
  return map[platform?.toLowerCase()] || { label: platform || 'Autre', color: '#666', icon: '🔗', bg: '#F0F0F0' };
}

export function getFreshnessBadge(freshness) {
  switch (freshness) {
    case 'en_temps_reel':
      return { label: 'Temps réel', color: '#28A745', bg: '#E8F5E9', icon: '⚡' };
    case 'a_jour':
      return { label: 'À jour (<24h)', color: '#0099FF', bg: '#E3F2FD', icon: '✓' };
    case 'recent':
      return { label: 'Récent (2-7j)', color: '#FF7900', bg: '#FFF3E0', icon: '⏱' };
    case 'obsolete':
    case 'a_rafraichir':
      return { label: 'À rafraîchir', color: '#DC3545', bg: '#FFEBEE', icon: '⚠️' };
    default:
      return { label: freshness || 'Normal', color: '#666', bg: '#F0F0F0', icon: '•' };
  }
}

// ─── Cockpit Metrics Calculator ───

export function calculateCockpitMetrics(watchItems, alerts, competitors, influencers = [], campaigns = []) {
  const activeAlerts = alerts.filter(a => a.status !== 'resolu' && a.status !== 'ignore');
  const priorityAlertsCount = activeAlerts.filter(a => a.priority === 'bloquant' || a.priority === 'critique').length;

  const opportunitiesCount = watchItems.filter(i => i.opportunity_or_risk === 'opportunity').length;
  const risksCount = watchItems.filter(i => i.opportunity_or_risk === 'risk').length;

  // Calcul du taux de fraîcheur des sources
  const freshItemsCount = watchItems.filter(i => i.freshness_status === 'en_temps_reel' || i.freshness_status === 'a_jour').length;
  const freshnessRate = watchItems.length > 0 ? Math.round((freshItemsCount / watchItems.length) * 100) : 100;

  // Taux de couverture des talents sous surveillance
  const monitoredTalentIds = new Set(watchItems.flatMap(i => i.associated_talent_ids || []));
  const totalTalents = influencers.length || 1;
  const talentCoverageRate = Math.min(100, Math.round((monitoredTalentIds.size / totalTalents) * 100));

  // Concurrents sous surveillance active
  const activeCompetitorsCount = competitors.filter(c => c.status === 'actif').length;

  return {
    totalItems: watchItems.length,
    activeAlertsCount: activeAlerts.length,
    priorityAlertsCount,
    opportunitiesCount,
    risksCount,
    freshnessRate,
    talentCoverageRate,
    activeCompetitorsCount,
  };
}

// ─── Export CSV Helper ───

export const computeCockpitMetrics = calculateCockpitMetrics;

export function generateSimulatedSyncRun() {
  const now = new Date();
  return {
    id: `RUN-${Date.now().toString().slice(-4)}`,
    started_at: new Date(now.getTime() - 2400).toISOString(),
    completed_at: now.toISOString(),
    trigger_type: 'manual_api_trigger',
    triggered_by: 'Influence Manager',
    status: 'success',
    duration_seconds: 2.4,
    sources_polled: ['Meta Ad Library', 'TikTok Creator Monitor', 'MINPOSTEL RSS', 'Digital Business Africa'],
    rows_collected: 42,
    rows_created: 3,
    rows_updated: 7,
    errors_count: 0
  };
}

export function exportWatchItemsToCsv(items, filename = 'veille_strategique_orange_cm.csv') {
  if (!items || items.length === 0) return;

  const headers = [
    'ID',
    'Titre',
    'Type',
    'Plateforme',
    'Source',
    'Fiabilité',
    'Niveau de Certitude',
    'Score Pertinence',
    'Priorité',
    'Risque / Opportunité',
    'Date de Publication',
    'Date de Collecte',
    'Fraîcheur',
    'Statut',
    'Action Recommandée',
    'Résumé'
  ];

  const rows = items.map(item => [
    `"${item.id || ''}"`,
    `"${(item.title || '').replace(/"/g, '""')}"`,
    `"${getTypeLabel(item.type)}"`,
    `"${item.platform || ''}"`,
    `"${(item.source_name || '').replace(/"/g, '""')}"`,
    `"${RELIABILITY_LEVELS[item.reliability_level]?.label || item.reliability_level || ''}"`,
    `"${item.confidence_level || ''}"`,
    `"${item.relevance_score || ''}"`,
    `"${item.priority || ''}"`,
    `"${item.opportunity_or_risk || ''}"`,
    `"${item.published_at || ''}"`,
    `"${item.collected_at || ''}"`,
    `"${item.freshness_status || ''}"`,
    `"${item.status || ''}"`,
    `"${(item.recommended_action || '').replace(/"/g, '""')}"`,
    `"${(item.summary || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
