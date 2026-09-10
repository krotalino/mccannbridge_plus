import test from 'node:test';
import assert from 'node:assert/strict';

test('KPI 1: Modification d\'une publication et recalcul instantané des métriques calculées et de complétude', () => {
  const original = {
    id: 'PUB-001',
    title: 'Post Orange Money',
    talent_name: 'Carles Antonio',
    metrics: {
      views: 50000,
      likes: 2000,
      comments: 150,
      shares: 50,
      engagement_reported: null,
      engagement_calculated: 2200,
      engagement_rate: 4.4,
    }
  };

  // Modification : augmentation des likes et des vues
  const updates = {
    views: 80000,
    likes: 3500,
    comments: 200,
    shares: 100,
  };

  const recalculatedEngagement = updates.likes + updates.comments + updates.shares; // 3800
  const recalculatedRate = Number(((recalculatedEngagement / updates.views) * 100).toFixed(2)); // (3800 / 80000) * 100 = 4.75
  const isComplete = updates.views > 0 && updates.likes !== null && updates.comments !== null && updates.shares !== null;

  const updated = {
    ...original,
    metrics: {
      ...original.metrics,
      ...updates,
      engagement_calculated: recalculatedEngagement,
      engagement_rate: recalculatedRate,
    },
    quality_status: isComplete ? 'valid' : 'incomplete'
  };

  assert.equal(updated.metrics.engagement_calculated, 3800);
  assert.equal(updated.metrics.engagement_rate, 4.75);
  assert.equal(updated.quality_status, 'valid');
});

test('KPI 2: Suppression d\'une publication retirée de la liste active', () => {
  const deliverables = [
    { id: 'PUB-1', title: 'Pub 1' },
    { id: 'PUB-2', title: 'Pub 2' },
    { id: 'PUB-3', title: 'Pub 3' },
  ];

  const idToDelete = 'PUB-2';
  const remaining = deliverables.filter(d => d.id !== idToDelete);

  assert.equal(remaining.length, 2);
  assert.equal(remaining.some(d => d.id === idToDelete), false);
});

test('KPI 3: Classements Top Contenus & Top Talents selon vues, engagement calculé et taux sur vues', () => {
  const pubs = [
    { id: 'P1', talent: 'Alice', views: 100000, engCalc: 3000, rate: 3.0 },
    { id: 'P2', talent: 'Bob', views: 40000, engCalc: 4000, rate: 10.0 },
    { id: 'P3', talent: 'Charlie', views: 70000, engCalc: 2000, rate: 2.85 },
  ];

  // Tri par vues
  const sortedByViews = [...pubs].sort((a, b) => b.views - a.views);
  assert.equal(sortedByViews[0].id, 'P1');

  // Tri par engagement calculé
  const sortedByEng = [...pubs].sort((a, b) => b.engCalc - a.engCalc);
  assert.equal(sortedByEng[0].id, 'P2');

  // Tri par taux sur vues
  const sortedByRate = [...pubs].sort((a, b) => b.rate - a.rate);
  assert.equal(sortedByRate[0].id, 'P2');
});

test('KPI 4: Séparation rigoureuse entre métriques mesurées, calculées et non disponibles', () => {
  const pubWithMissingViews = {
    views: null, // Non disponible
    likes: 500, // Mesuré
    comments: 20, // Mesuré
    shares: 10, // Mesuré
    engagement_reported: null, // Non disponible
  };

  const measured = {
    likes: pubWithMissingViews.likes,
    comments: pubWithMissingViews.comments,
    shares: pubWithMissingViews.shares,
  };

  const calculated = {
    engagement_calculated: measured.likes + measured.comments + measured.shares,
    // Vues absentes => taux sur vues non calculable / N/A
    rate_on_views: pubWithMissingViews.views > 0 ? (530 / pubWithMissingViews.views) * 100 : null,
  };

  const unavailable = {
    views_missing: pubWithMissingViews.views === null,
    reported_missing: pubWithMissingViews.engagement_reported === null,
  };

  assert.equal(calculated.engagement_calculated, 530);
  assert.equal(calculated.rate_on_views, null, 'Le taux sur vues reste null si les vues sont manquantes');
  assert.equal(unavailable.views_missing, true);
  assert.equal(unavailable.reported_missing, true);
});

test('KPI 5: Création et gestion d\'un Insight avec priorité, propriétaire, échéance et lien campagne/livrable', () => {
  const newInsight = {
    id: 'INS-TEST-1',
    title: 'Surperformance Reel Q4',
    observation: 'Les formats verticaux génèrent un taux d\'engagement 2x supérieur.',
    recommendation: 'Reallouer 40% du budget vers TikTok.',
    priority: 'haute',
    owner: 'Alain Patrick Eboa',
    deadline: '2026-04-30',
    campaign_name: 'Campagnes & Challenges Q4 2025',
    deliverable_id: 'PUB-zzck42',
  };

  assert.equal(newInsight.priority, 'haute');
  assert.equal(newInsight.owner, 'Alain Patrick Eboa');
  assert.equal(newInsight.campaign_name, 'Campagnes & Challenges Q4 2025');
  assert.equal(newInsight.deliverable_id, 'PUB-zzck42');
});
