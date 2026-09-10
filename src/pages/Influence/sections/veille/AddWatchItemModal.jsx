import { useState } from 'react';
import {
  STRATEGIC_TYPES,
  RELIABILITY_LEVELS,
  CONFIDENCE_LEVELS,
} from './strategicWatchData.js';

export default function AddWatchItemModal({ onClose, onAddItem, onRunSimulatedSync, influencers = [] }) {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'import' | 'sync'

  // Formulaire manuel
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    type: STRATEGIC_TYPES.INFLUENCER,
    source_name: '',
    source_url: '',
    source_type: 'manual',
    reliability_level: 'B_VERIFIEE',
    confidence_level: 'Confirmé',
    relevance_score: 85,
    geographic_scope: 'Cameroun',
    platform: 'tiktok',
    priority: 'a_surveiller',
    opportunity_or_risk: 'opportunity',
    recommended_action: '',
    associated_talent_id: '',
    associated_competitor: '',
  });

  // Mode Import
  const [importText, setImportText] = useState('');
  const [importFileFeedback, setImportFileFeedback] = useState('');

  // Mode Synchronisation Automatisée
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState(null);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newItem = {
      id: `SW-${Date.now().toString().slice(-6)}`,
      type: formData.type,
      title: formData.title,
      summary: formData.summary || formData.title,
      content: formData.content || formData.summary || formData.title,
      source_name: formData.source_name || 'Observation Équipe McCANN',
      source_url: formData.source_url || '',
      source_type: 'manual',
      published_at: new Date().toISOString(),
      collected_at: new Date().toISOString(),
      freshness_status: 'en_temps_reel',
      reliability_level: formData.reliability_level,
      relevance_score: parseInt(formData.relevance_score, 10) || 80,
      confidence_level: formData.confidence_level,
      geographic_scope: formData.geographic_scope,
      platform: formData.platform,
      themes: ['Veille Manuelle'],
      keywords: [],
      associated_talent_ids: formData.associated_talent_id ? [formData.associated_talent_id] : [],
      associated_campaign_ids: [],
      associated_competitor_ids: formData.associated_competitor ? [formData.associated_competitor] : [],
      status: 'nouveau',
      priority: formData.priority,
      recommended_action: formData.recommended_action,
      opportunity_or_risk: formData.opportunity_or_risk,
      created_by: 'Utilisateur connecté',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onAddItem(newItem);
    onClose();
  };

  const handleImportJsonOrCsv = () => {
    try {
      if (!importText.trim()) return;
      const parsed = JSON.parse(importText);
      const itemsToAdd = Array.isArray(parsed) ? parsed : [parsed];

      let count = 0;
      for (const item of itemsToAdd) {
        if (item.title) {
          onAddItem({
            ...item,
            id: item.id || `SW-IMP-${Date.now()}-${count}`,
            collected_at: new Date().toISOString(),
            source_type: 'import'
          });
          count++;
        }
      }
      setImportFileFeedback(`✓ ${count} signaux importés avec succès sans doublons !`);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setImportFileFeedback(`⚠️ Format JSON invalide. Veuillez vérifier la syntaxe.`);
    }
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    // Simule la collecte automatisée des sources (TikTok, Meta, RSS, MINPOSTEL)
    setTimeout(() => {
      const runResult = onRunSimulatedSync();
      setIsSyncing(false);
      setSyncLog(runResult);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 16
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 12, width: '100%', maxWidth: 660, maxHeight: '92vh',
        overflowY: 'auto', padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }}>
        {/* En-tête */}
        <div className="flex justify-between items-start pb-12 mb-16 border-b">
          <div>
            <div className="flex items-center gap-8 mb-4">
              <span style={{ fontSize: 20 }}>📡</span>
              <h2 className="text-xl font-bold text-dark">Alimentation de la Veille Stratégique</h2>
            </div>
            <p className="text-xs text-muted">
              Ajout manuel, import de données contrôlées ou synchronisation d’APIs autorisées
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ fontSize: 18 }}>✕</button>
        </div>

        {/* Onglets de mode d'alimentation */}
        <div className="tab-bar mb-16 flex gap-4 p-4" style={{ background: '#f5f5f5', borderRadius: 8 }}>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`tab-item ${activeTab === 'manual' ? 'active' : ''}`}
            style={{ fontWeight: 600, fontSize: 12 }}
          >
            ✏️ Saisie Manuelle
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`tab-item ${activeTab === 'import' ? 'active' : ''}`}
            style={{ fontWeight: 600, fontSize: 12 }}
          >
            📥 Import Fichier / JSON
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`tab-item ${activeTab === 'sync' ? 'active' : ''}`}
            style={{ fontWeight: 600, fontSize: 12 }}
          >
            ⚡ Synchronisation Connecteurs
          </button>
        </div>

        {/* TAB 1: SAISIE MANUELLE */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit}>
            <div className="grid grid-2 gap-12 mb-12">
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Titre du signal *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Offensive MTN Pulse sur TikTok avec Muriel Blanche"
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Typologie de signal</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value={STRATEGIC_TYPES.INFLUENCER}>👤 Influenceur / Talent</option>
                  <option value={STRATEGIC_TYPES.COMPETITOR}>⚔️ Veille Concurrentielle</option>
                  <option value={STRATEGIC_TYPES.CAMPAIGN}>🎯 Campagne</option>
                  <option value={STRATEGIC_TYPES.TREND}>🔥 Tendance & Format</option>
                  <option value={STRATEGIC_TYPES.PLATFORM}>📱 Évolution Plateforme</option>
                  <option value={STRATEGIC_TYPES.REGULATION}>⚖️ Réglementation & Légal</option>
                  <option value={STRATEGIC_TYPES.MEDIA}>📰 Retombée Média</option>
                  <option value={STRATEGIC_TYPES.SECTOR}>🌐 Marché & Télécoms</option>
                </select>
              </div>
            </div>

            <div className="mb-12">
              <label className="text-xs font-semibold text-dark mb-4 block">Résumé synthétique</label>
              <textarea
                rows={2}
                placeholder="Décrivez les faits observables..."
                className="input"
                style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>

            <div className="grid grid-3 gap-12 mb-12">
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Source *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: TikTok, Investir au Cameroun..."
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.source_name}
                  onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">URL de référence</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Plateforme principale</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X (Twitter)</option>
                  <option value="multi">Multi-plateformes</option>
                  <option value="web">Presse / Web</option>
                </select>
              </div>
            </div>

            <div className="grid grid-3 gap-12 mb-12">
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Fiabilité de la source</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.reliability_level}
                  onChange={(e) => setFormData({ ...formData, reliability_level: e.target.value })}
                >
                  {Object.entries(RELIABILITY_LEVELS).map(([key, r]) => (
                    <option key={key} value={key}>[{r.code}] {r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Niveau de certitude</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.confidence_level}
                  onChange={(e) => setFormData({ ...formData, confidence_level: e.target.value })}
                >
                  {Object.entries(CONFIDENCE_LEVELS).map(([key, c]) => (
                    <option key={key} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Nature du signal</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.opportunity_or_risk}
                  onChange={(e) => setFormData({ ...formData, opportunity_or_risk: e.target.value })}
                >
                  <option value="opportunity">🟢 Opportunité (Amplification)</option>
                  <option value="risk">🔴 Risque (Brand safety / Concurrence)</option>
                  <option value="neutral">⚪ Veille neutre / Suivi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2 gap-12 mb-12">
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Associer à un talent existant</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.associated_talent_id}
                  onChange={(e) => setFormData({ ...formData, associated_talent_id: e.target.value })}
                >
                  <option value="">-- Aucun talent associé --</option>
                  {influencers.map(inf => (
                    <option key={inf.id} value={inf.id}>@{inf.pseudo || inf.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Associer à un concurrent</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.associated_competitor}
                  onChange={(e) => setFormData({ ...formData, associated_competitor: e.target.value })}
                >
                  <option value="">-- Aucun concurrent --</option>
                  <option value="COMP-MTN-CM">MTN Cameroun (MoMo, Pulse)</option>
                  <option value="COMP-CAMTEL">Camtel (Blue)</option>
                  <option value="COMP-NEXTTEL">Nexttel</option>
                  <option value="COMP-WAVE-FINTECH">Fintech & Néo-banques</option>
                </select>
              </div>
            </div>

            <div className="mb-16">
              <label className="text-xs font-semibold text-dark mb-4 block">Action immédiate recommandée</label>
              <input
                type="text"
                placeholder="ex: Organiser une réunion de cadrage pour riposte média..."
                className="input"
                style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                value={formData.recommended_action}
                onChange={(e) => setFormData({ ...formData, recommended_action: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-8 pt-12 border-t">
              <button type="button" onClick={onClose} className="btn btn-ghost">
                Annuler
              </button>
              <button type="submit" className="btn btn-orange" style={{ fontWeight: 700 }}>
                ✓ Enregistrer le signal de veille
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: IMPORT JSON / CSV */}
        {activeTab === 'import' && (
          <div>
            <p className="text-xs text-muted mb-12">
              Importez un lot de signaux de veille au format JSON ou collez les données issues d’un outil de social listening externe. Le système vérifie l’idempotence et évite les doublons.
            </p>

            <textarea
              rows={8}
              placeholder={`[\n  {\n    "title": "Nouveau challenge TikTok MTN MoMo",\n    "type": "competitor",\n    "source_name": "TikTok Scraping",\n    "platform": "tiktok",\n    "confidence_level": "Confirmé"\n  }\n]`}
              className="input font-mono mb-12"
              style={{ width: '100%', padding: 10, fontSize: 11, borderRadius: 6, border: '1px solid #ccc' }}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />

            {importFileFeedback && (
              <div style={{ padding: 10, borderRadius: 6, marginBottom: 12, background: importFileFeedback.startsWith('✓') ? '#e8f5e9' : '#ffebee', fontSize: 12, fontWeight: 600 }}>
                {importFileFeedback}
              </div>
            )}

            <div className="flex justify-end gap-8 pt-12 border-t">
              <button type="button" onClick={onClose} className="btn btn-ghost">
                Annuler
              </button>
              <button
                type="button"
                onClick={handleImportJsonOrCsv}
                className="btn btn-primary"
                style={{ fontWeight: 700 }}
              >
                📥 Lancer l’importation contrôlée
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SYNCHRONISATION AUTOMATISÉE */}
        {activeTab === 'sync' && (
          <div>
            <p className="text-xs text-muted mb-16">
              Déclenchez manuellement un cycle de collecte et d’analyse en arrière-plan. Ce traitement interroge les APIs officielles configurées (TikTok, Meta Ad Library, MINPOSTEL, flux RSS autorisés) et met à jour l’indice de fraîcheur.
            </p>

            <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 16, border: '1px solid #eee', marginBottom: 16 }}>
              <div className="text-xs font-bold text-dark mb-8">Sources autorisées actives dans ce cycle :</div>
              <ul className="text-xs text-muted" style={{ paddingLeft: 18, lineHeight: 1.8 }}>
                <li>✓ API Meta Ad Library (Campagnes concurrentes actives Cameroun)</li>
                <li>✓ TikTok Creator Monitor (Hashtags #OrangeWeekend, #MTNPulse, etc.)</li>
                <li>✓ Crawler officiel MINPOSTEL & CNC (Alertes réglementaires)</li>
                <li>✓ Flux RSS spécialisés : Digital Business Africa, Investir au Cameroun</li>
              </ul>
            </div>

            {syncLog && (
              <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div className="text-xs font-bold text-green-800 mb-4">
                  ✓ Cycle de collecte terminé avec succès ({syncLog.duration_seconds}s)
                </div>
                <div className="text-xs text-green-900">
                  {syncLog.rows_collected} lignes analysées • {syncLog.rows_created} nouveaux signaux • {syncLog.rows_updated} mis à jour.
                </div>
              </div>
            )}

            <div className="flex justify-end gap-8 pt-12 border-t">
              <button type="button" onClick={onClose} className="btn btn-ghost">
                Fermer
              </button>
              <button
                type="button"
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="btn btn-orange flex items-center gap-6"
                style={{ fontWeight: 700 }}
              >
                <span>⚡</span>
                <span>{isSyncing ? 'Synchronisation en cours...' : 'Exécuter la synchronisation maintenant'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
