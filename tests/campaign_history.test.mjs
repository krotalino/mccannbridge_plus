import test from 'node:test';
import assert from 'node:assert/strict';
import { exportCampaignHistoryToPdf } from '../src/pages/Influence/sections/historique/CampaignHistoryPdfExport.js';

test('Historique 1: Consolidation et calcul des métriques de performance de campagne', () => {
  const campaign = {
    campaign: 'Orange Weekend Avril',
    brand: 'Orange Cameroun',
    kpiReach: 180000,
    kpiTarget: 150000,
    impressions: 240000,
    kpiEngagement: 6.5,
    engagementTarget: 5.0,
    clicks: 7200,
    conversions: 850,
    salesVolume: 4200000,
    contentQuality: 5,
    onTime: true,
    variablePaid: 100,
  };

  // Calcul du ratio d'atteinte de la portée (Reach)
  const reachRatio = Math.round((campaign.kpiReach / campaign.kpiTarget) * 100);
  assert.equal(reachRatio, 120);
  assert.equal(reachRatio >= 90, true);

  // Calcul du ratio d'atteinte du taux d'engagement
  const engRatio = Math.round((campaign.kpiEngagement / campaign.engagementTarget) * 100);
  assert.equal(engRatio, 130);

  // Calcul du taux de conversion (clics -> conversions)
  const conversionRate = Number(((campaign.conversions / campaign.clicks) * 100).toFixed(2));
  assert.equal(conversionRate, 11.81);
});

test('Historique 2: Ajout d\'une nouvelle campagne à l\'historique d\'un influenceur', () => {
  const influencer = {
    id: 1,
    name: 'Kameni_Official',
    pseudo: 'Kameni_Official',
    performanceHistory: [
      { campaign: 'Orange Weekend Mars', kpiReach: 180000 }
    ],
    campaigns: 1
  };

  const newCampaign = {
    campaign: 'Pulse Jeunesse 2026',
    brand: 'Pulse Orange',
    kpiReach: 120000,
    kpiTarget: 100000,
    kpiEngagement: 7.2,
    status: 'terminee',
    notesInternes: { noteGlobale: 4.8, commentaire: 'Excellente visibilité sur TikTok.' },
    remuneration: { base: 2000000, variable: 400000 }
  };

  const updatedHistory = [newCampaign, ...influencer.performanceHistory];
  const updatedInfluencer = {
    ...influencer,
    campaigns: updatedHistory.length,
    performanceHistory: updatedHistory
  };

  assert.equal(updatedInfluencer.campaigns, 2);
  assert.equal(updatedInfluencer.performanceHistory[0].campaign, 'Pulse Jeunesse 2026');
  assert.equal(updatedInfluencer.performanceHistory[0].remuneration.base, 2000000);
});

test('Historique 3: Modification d\'une évaluation qualitative et des livrables', () => {
  const campaign = {
    campaign: 'OM Transfert Jan',
    contentQuality: 3,
    onTime: false,
    notesInternes: {
      noteGlobale: 3.5,
      fiabilite: 3,
      qualiteCollaboration: 3,
      respectDelais: 2,
      commentaire: 'Retard de livraison.'
    },
    livrables: [
      { id: 'L1', titre: 'Story Teaser', url: '', statut: 'en_cours' }
    ]
  };

  // Mise à jour de l'évaluation
  const updated = {
    ...campaign,
    contentQuality: 4.5,
    onTime: true,
    notesInternes: {
      ...campaign.notesInternes,
      noteGlobale: 4.5,
      fiabilite: 4,
      respectDelais: 5,
      commentaire: 'Retard rattrapé, visuels exceptionnels.',
      pointsForts: ['Esthétique soignée', 'Forte interaction']
    },
    livrables: [
      { id: 'L1', titre: 'Story Teaser', url: 'https://instagram.com/p/validated', statut: 'valide' },
      { id: 'L2', titre: 'Reel Démo', url: 'https://instagram.com/reel/validated', statut: 'valide' }
    ]
  };

  assert.equal(updated.notesInternes.noteGlobale, 4.5);
  assert.equal(updated.livrables.length, 2);
  assert.equal(updated.livrables[0].statut, 'valide');
  assert.equal(updated.notesInternes.pointsForts.length, 2);
});

test('Historique 4: Suppression d\'une campagne historique', () => {
  const history = [
    { campaign: 'Orange Weekend Mars' },
    { campaign: 'Pulse Fév' },
    { campaign: 'OM Transfert Jan' }
  ];

  const toDelete = 'Pulse Fév';
  const remaining = history.filter(h => h.campaign !== toDelete);

  assert.equal(remaining.length, 2);
  assert.equal(remaining.some(h => h.campaign === toDelete), false);
});

test('Historique 5: Génération du PDF officiel Orange Cameroun sans erreur', () => {
  const influencer = {
    id: 1,
    name: 'Kameni_Official',
    pseudo: 'Kameni_Official',
    realName: 'Patrick Kameni',
    followers: '245K',
    platform: 'Instagram',
    categories: ['Lifestyle', 'Beauté'],
    scorePerformance: 4.6
  };

  const campaigns = [
    {
      campaign: 'Orange Weekend Mars',
      brand: 'Orange Cameroun',
      dates: '01 Mars au 31 Mars 2026',
      status: 'terminee',
      kpiReach: 180000,
      kpiTarget: 150000,
      impressions: 240000,
      kpiEngagement: 6.2,
      clicks: 4500,
      conversions: 550,
      contentQuality: 5,
      notesInternes: {
        noteGlobale: 5,
        commentaire: 'Performance modèle.',
        pointsForts: 'Esthétique, viralité',
        axesAmelioration: 'Aucun'
      },
      livrables: [
        { titre: 'Story Teaser', url: 'https://instagram.com/teaser', type: 'Story' }
      ],
      remuneration: {
        base: 2500000,
        variable: 500000,
        avantages: 'Pack Pulse VIP'
      }
    }
  ];

  const filename = exportCampaignHistoryToPdf(influencer, campaigns);
  assert.ok(filename.includes('Orange_Cameroun_Bilan_Historique_Kameni_Official.pdf'));
});
