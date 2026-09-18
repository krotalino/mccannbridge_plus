import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  INITIAL_INFLUENCE_TALENTS,
  INITIAL_INFLUENCE_DELIVERABLES,
  INITIAL_INFLUENCE_CAMPAIGNS,
  INITIAL_AMBASSADOR_GROUPS,
  INITIAL_INFLUENCE_SNAPSHOTS,
  INITIAL_INFLUENCE_DUPLICATES,
  INITIAL_INFLUENCE_INSIGHTS,
  INITIAL_IMPORT_BATCH
} from '../../data/influenceSeedData';

const STORAGE_KEY = 'bridge-influence-import-v1';

const getInitialData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.talents && parsed.talents.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse cached influence data:', e);
  }

  // Initial issues from duplicates
  const initialIssues = (INITIAL_INFLUENCE_DUPLICATES || []).map((dup, idx) => ({
    id: `iss-dup-${idx + 1}`,
    code: 'duplicate_candidate',
    sheet_name: dup.sheet_a || "O'Ambassadeurs",
    row_reference: dup.row_a || idx + 2,
    message: `Doublon potentiel entre ${dup.name_a} et ${dup.name_b}`,
    raw_value: JSON.stringify({ talentA: dup.talent_a_id, talentB: dup.talent_b_id }),
    resolution_status: 'open',
    created_at: new Date().toISOString()
  }));

  // Activations synthesised from deliverables
  const initialActivations = [];
  const actMap = new Set();
  (INITIAL_INFLUENCE_DELIVERABLES || []).forEach(d => {
    const key = `${d.campaign_id}|${d.talent_id}`;
    if (!actMap.has(key)) {
      actMap.add(key);
      initialActivations.push({
        id: `act-${initialActivations.length + 1}`,
        campaign_id: d.campaign_id,
        talent_id: d.talent_id,
        contract_status: d.campaign_id === 'CAMP-ORANGE-Q4-2025' ? 'contrat_signe' : 'non_renseigne',
        deliverable_commitment: true
      });
    }
  });

  return {
    batches: [INITIAL_IMPORT_BATCH],
    talents: INITIAL_INFLUENCE_TALENTS || [],
    groups: INITIAL_AMBASSADOR_GROUPS || [],
    campaigns: INITIAL_INFLUENCE_CAMPAIGNS || [],
    activations: initialActivations,
    deliverables: INITIAL_INFLUENCE_DELIVERABLES || [],
    snapshots: INITIAL_INFLUENCE_SNAPSHOTS || [],
    issues: initialIssues,
    aggregates: [],
    insights: INITIAL_INFLUENCE_INSIGHTS || []
  };
};

let globalState = getInitialData();
const listeners = new Set();

const notify = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
  } catch (e) {
    console.error('Storage error', e);
  }
  listeners.forEach(fn => fn(globalState));
};

export const updateGlobalState = (updater) => {
  globalState = typeof updater === 'function' ? updater(globalState) : { ...globalState, ...updater };
  notify();
};

export const getDeliverableSnapshots = (snapshots = []) => {
  const map = new Map();
  for (const s of snapshots) {
    const existing = map.get(s.deliverable_id);
    if (!existing || s.captured_at >= existing.captured_at) {
      map.set(s.deliverable_id, s);
    }
  }
  return map;
};

export const computeCockpitKpis = (data) => {
  const snaps = getDeliverableSnapshots(data.snapshots || []);
  let likes = 0, comments = 0, shares = 0, views = 0, engagement = 0, viewsWithCompletedEng = 0;
  let incomplete = 0, inconsistent = 0;

  for (const snap of snaps.values()) {
    likes += snap.likes || 0;
    comments += snap.comments || 0;
    shares += snap.shares || 0;
    if (snap.views !== null && snap.views !== undefined) views += snap.views;
    if (snap.engagement_calculated !== null && snap.engagement_calculated !== undefined) {
      engagement += snap.engagement_calculated;
    }
    if (snap.views !== null && !snap.engagement_partial && snap.engagement_calculated !== null) {
      viewsWithCompletedEng += snap.views;
    }
    if (snap.quality_status === 'incomplete') incomplete++;
    if (snap.quality_status === 'inconsistent') inconsistent++;
  }

  const rate = viewsWithCompletedEng > 0 ? Math.round((engagement / viewsWithCompletedEng) * 10000) / 100 : null;

  return {
    talentsActifs: (data.talents || []).filter(u => u.record_status === 'active' && u.type !== 'ambassador').length,
    activations: (data.activations || []).length,
    publications: (data.deliverables || []).filter(u => u.status === 'publie').length,
    engagement,
    views,
    rate,
    incomplete,
    inconsistent,
    doublons: (data.issues || []).filter(u => u.code === 'duplicate_candidate' && u.resolution_status === 'open').length,
    anomalies: (data.issues || []).filter(u => u.resolution_status === 'open' && u.code !== 'duplicate_candidate').length
  };
};

export const computePrioritaryRisks = (data) => {
  const risks = [];
  const snaps = getDeliverableSnapshots(data.snapshots || []);

  const noUrl = (data.deliverables || []).filter(d => !d.url);
  if (noUrl.length > 0) {
    risks.push({
      id: 'grp-missing-url',
      priority: 'p1',
      grouped: true,
      motif: `${noUrl.length} livrable(s) sans lien de publication`,
      obj: noUrl.slice(0, 3).map(m => m.title).join(' · ') + (noUrl.length > 3 ? ` … (+${noUrl.length - 3})` : ''),
      action: 'Compléter les URLs depuis la source (vue Livrables → filtre)',
      navigate: 'livrables',
      type: 'missing_url'
    });
  }

  const incomp = [...snaps.values()].filter(m => m.quality_status === 'incomplete');
  if (incomp.length > 0) {
    risks.push({
      id: 'grp-quality',
      priority: 'p2',
      grouped: true,
      motif: `${incomp.length} publication(s) avec données de performance incomplètes`,
      obj: 'Valeurs absentes de la source conservées à null — enrichissement manuel ou nouvelle mesure',
      action: 'Compléter les métriques (vue Reporting → complétude)',
      navigate: 'reporting',
      type: 'quality'
    });
  }

  const dups = (data.issues || []).filter(m => m.code === 'duplicate_candidate' && m.resolution_status === 'open');
  if (dups.length > 0) {
    risks.push({
      id: 'grp-dup',
      priority: 'p2',
      grouped: true,
      motif: `${dups.length} doublon(s) potentiel(s) d'ambassadeurs entre les annuaires`,
      obj: 'Aucune fusion automatique appliquée',
      action: 'Revue manuelle : fusionner ou conserver séparés (vue Talents)',
      navigate: 'talents',
      type: 'duplicate'
    });
  }

  const now = new Date().getTime();
  for (const d of (data.deliverables || [])) {
    if (d.status === 'livrable_soumis') {
      const diffDays = (now - new Date(d.updated_at || d.created_at || now).getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 3) {
        risks.push({
          id: `v-${d.id}`,
          priority: 'p0',
          motif: `Validation en attente depuis ${Math.floor(diffDays)} j (SLA 3 j)`,
          obj: d.title,
          ref: d,
          date: d.updated_at,
          action: 'Relancer le validateur',
          type: 'sla'
        });
      }
    }
  }

  const pOrder = { p0: 0, p1: 1, p2: 2 };
  return risks.sort((a, b) => pOrder[a.priority] - pOrder[b.priority]);
};

export function useInfluenceStore() {
  const [data, setData] = useState(globalState);

  useEffect(() => {
    listeners.add(setData);
    return () => listeners.delete(setData);
  }, []);

  const runImport = useCallback(({ importedBy = 'Utilisateur Bridge' } = {}) => {
    const newBatch = {
      id: `IMP-${Date.now().toString(36).toUpperCase()}`,
      file_name: 'Fichier-Reporting-Influence_5734.xlsx',
      imported_by: importedBy,
      imported_at: new Date().toISOString(),
      sheets: [
        { sheet: 'INFLUENCEURS', rowsRead: 25, created: 25, skipped: 0 },
        { sheet: 'Orange Weekend', rowsRead: 75, created: 75, skipped: 0 },
        { sheet: "O'Ambassadeurs", rowsRead: 85, created: 85, skipped: 0 },
        { sheet: "O'Ambassadeurs (2)", rowsRead: 45, created: 45, skipped: 0 },
        { sheet: 'ADMINS O Ambassadeurs', rowsRead: 6, created: 6, skipped: 0 },
        { sheet: 'WEBZINES', rowsRead: 6, created: 6, skipped: 0 }
      ],
      totals: {
        rows_read: 242,
        created: 242,
        skipped: 0,
        talents: INITIAL_INFLUENCE_TALENTS.length,
        campaigns: INITIAL_INFLUENCE_CAMPAIGNS.length,
        activations: 120,
        deliverables: INITIAL_INFLUENCE_DELIVERABLES.length,
        snapshots: INITIAL_INFLUENCE_SNAPSHOTS.length,
        groups: INITIAL_AMBASSADOR_GROUPS.length,
        issues: INITIAL_INFLUENCE_DUPLICATES.length
      }
    };

    updateGlobalState(prev => ({
      ...prev,
      batches: [newBatch, ...(prev.batches || [])].slice(0, 20),
      lastBatch: newBatch
    }));

    return newBatch;
  }, []);

  const setDeliverableStatus = useCallback((deliverableId, newStatus, { author = 'Utilisateur Bridge', comment = '' } = {}) => {
    updateGlobalState(prev => ({
      ...prev,
      deliverables: prev.deliverables.map(d =>
        d.id === deliverableId
          ? {
              ...d,
              status: newStatus,
              updated_at: new Date().toISOString(),
              validation_history: [
                ...(d.validation_history || []),
                {
                  at: new Date().toISOString(),
                  author,
                  action: newStatus,
                  comment
                }
              ]
            }
          : d
      )
    }));
  }, []);

  const addInsight = useCallback((insight) => {
    updateGlobalState(prev => ({
      ...prev,
      insights: [
        {
          id: `ins-${Date.now().toString(36)}`,
          created_at: new Date().toISOString(),
          ...insight
        },
        ...(prev.insights || [])
      ]
    }));
  }, []);

  const removeInsight = useCallback((insightId) => {
    updateGlobalState(prev => ({
      ...prev,
      insights: (prev.insights || []).filter(i => i.id !== insightId)
    }));
  }, []);

  const resolveIssue = useCallback((issueId, resolutionStatus) => {
    updateGlobalState(prev => ({
      ...prev,
      issues: prev.issues.map(iss => (iss.id === issueId ? { ...iss, resolution_status: resolutionStatus } : iss))
    }));
  }, []);

  const mergeTalents = useCallback((keptId, mergedId) => {
    updateGlobalState(prev => ({
      ...prev,
      talents: prev.talents
        .filter(t => t.id !== mergedId)
        .map(t => (t.id === keptId ? { ...t, record_status: 'active', notes: `${t.notes ? t.notes + ' ' : ''}[Fusionné avec ${mergedId}]` } : t)),
      deliverables: prev.deliverables.map(d => (d.talent_id === mergedId ? { ...d, talent_id: keptId } : d)),
      activations: prev.activations.map(a => (a.talent_id === mergedId ? { ...a, talent_id: keptId } : a)),
      issues: prev.issues.map(iss => {
        if (iss.resolution_status === 'open' && iss.raw_value && iss.raw_value.includes(mergedId)) {
          return { ...iss, resolution_status: 'merged' };
        }
        return iss;
      })
    }));
  }, []);

  const keepTalentsSeparate = useCallback((talentIds) => {
    updateGlobalState(prev => ({
      ...prev,
      talents: prev.talents.map(t => (talentIds.includes(t.id) ? { ...t, record_status: 'active' } : t)),
      issues: prev.issues.map(iss => {
        if (talentIds.some(id => iss.raw_value && iss.raw_value.includes(id)) && iss.code === 'duplicate_candidate') {
          return { ...iss, resolution_status: 'kept_separate' };
        }
        return iss;
      })
    }));
  }, []);

  const resetImport = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    globalState = getInitialData();
    notify();
  }, []);

  return {
    data,
    runImport,
    setDeliverableStatus,
    addInsight,
    removeInsight,
    resolveIssue,
    mergeTalents,
    keepTalentsSeparate,
    resetImport
  };
}
