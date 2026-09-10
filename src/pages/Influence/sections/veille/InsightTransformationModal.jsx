import { useState } from 'react';
import { useApp } from '../../../../context/AppContext';

export default function InsightTransformationModal({ item, onClose, onTransformed }) {
  const { addInfluenceInsight, influenceCampaigns = [], influencers = [] } = useApp();

  const [transformationType, setTransformationType] = useState('insight'); // 'insight' | 'recommendation' | 'risk' | 'task'
  const [formData, setFormData] = useState({
    title: item?.title || '',
    observation: item?.content || item?.summary || '',
    proof_sources: item?.source_name ? `${item.source_name} (${item.source_url || 'Observé'})` : '',
    scope: item?.geographic_scope || 'Cameroun',
    potential_impact: item?.opportunity_or_risk === 'risk' ? 'Risque de saturation ou de controverse' : 'Gain d’engagement & visibilité accrue',
    confidence_level: item?.confidence_level || 'Confirmé',
    recommendation: item?.recommended_action || '',
    priority: item?.priority || 'important',
    responsible: 'Influence Manager',
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    decision_status: 'a_valider', // 'a_valider' | 'approuve' | 'en_cours' | 'cloture'
    associated_campaign_id: item?.associated_campaign_ids?.[0] || '',
    associated_talent_id: item?.associated_talent_ids?.[0] || '',
    notes: `Issu du signal de veille #${item?.id || 'MANUEL'} (Collecté le ${item?.collected_at ? item.collected_at.slice(0, 10) : 'Aujourd’hui'})`
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newInsight = {
        id: `INS-${Date.now().toString().slice(-6)}`,
        title: formData.title,
        type: transformationType,
        observation: formData.observation,
        proof_sources: formData.proof_sources,
        scope: formData.scope,
        potential_impact: formData.potential_impact,
        confidence_level: formData.confidence_level,
        recommendation: formData.recommendation,
        priority: formData.priority,
        responsible: formData.responsible,
        due_date: formData.due_date,
        decision_status: formData.decision_status,
        associated_campaign_id: formData.associated_campaign_id,
        associated_talent_id: formData.associated_talent_id,
        source_watch_item_id: item?.id,
        created_at: new Date().toISOString(),
      };

      if (addInfluenceInsight) {
        addInfluenceInsight(newInsight);
      }

      setSuccessMsg(`✓ Signal transformé avec succès en ${transformationType.toUpperCase()} dans Bridge !`);
      setTimeout(() => {
        if (onTransformed) onTransformed(item?.id, newInsight);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: 16
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 12, width: '100%', maxWidth: 680, maxHeight: '92vh',
        overflowY: 'auto', padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', position: 'relative'
      }}>
        {/* Header */}
        <div className="flex justify-between items-start pb-12 mb-16 border-b">
          <div>
            <div className="flex items-center gap-8 mb-4">
              <span style={{ fontSize: 20 }}>🔄</span>
              <h2 className="text-xl font-bold text-dark">Transformer en Décision Actionnable</h2>
            </div>
            <p className="text-xs text-muted">
              Reliez ce signal de veille aux modules métier Bridge (Insights, Tâches, Campagnes & Décisions)
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ fontSize: 18 }}>✕</button>
        </div>

        {successMsg ? (
          <div style={{ padding: 30, textAlign: 'center', background: '#e8f5e9', borderRadius: 8, color: '#2e7d32', fontWeight: 700 }}>
            {successMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Choix du format cible */}
            <div className="mb-16">
              <label className="text-xs font-bold text-dark mb-6 block uppercase tracking-wider">
                Format de destination dans Bridge :
              </label>
              <div className="grid grid-4 gap-8">
                {[
                  { id: 'insight', label: 'Insight Stratégique', icon: '💡', desc: 'Analyse & Constat' },
                  { id: 'recommendation', label: 'Recommandation', icon: '🎯', desc: 'Plan d’action client' },
                  { id: 'risk', label: 'Fiche Risque', icon: '⚠️', desc: 'Brand Safety & Dérive' },
                  { id: 'task', label: 'Tâche Opérationnelle', icon: '✓', desc: 'Action à mener' }
                ].map(t => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTransformationType(t.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 8,
                      border: transformationType === t.id ? '2px solid #FF7900' : '1px solid #ddd',
                      background: transformationType === t.id ? '#FFF3E0' : '#fff',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 16 }}>{t.icon}</div>
                    <div className="text-xs font-bold text-dark mt-2">{t.label}</div>
                    <div className="text-xs text-muted" style={{ fontSize: 10 }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Titre & Périmètre */}
            <div className="grid grid-2 gap-12 mb-12">
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Intitulé de la décision *</label>
                <input
                  type="text"
                  required
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Périmètre concerné</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                >
                  <option value="Cameroun">Cameroun (National)</option>
                  <option value="Douala / Littoral">Douala / Littoral</option>
                  <option value="Yaoundé / Centre">Yaoundé / Centre</option>
                  <option value="Grand-Nord / Ouest">Grand-Nord / Ouest</option>
                  <option value="CEMAC">Zone CEMAC</option>
                  <option value="Global">Global / Réseaux Sociaux</option>
                </select>
              </div>
            </div>

            {/* Observation & Preuves */}
            <div className="mb-12">
              <label className="text-xs font-semibold text-dark mb-4 block">Observation factuelle & Contexte</label>
              <textarea
                rows={3}
                className="input"
                style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
              />
            </div>

            <div className="mb-12">
              <label className="text-xs font-semibold text-dark mb-4 block">Preuves, données chiffrées & sources traçables</label>
              <input
                type="text"
                className="input"
                style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                value={formData.proof_sources}
                placeholder="ex: Radar TikTok Bridge, 248K vues (+185%), URL..."
                onChange={(e) => setFormData({ ...formData, proof_sources: e.target.value })}
              />
            </div>

            {/* Recommandation & Impact */}
            <div className="grid grid-2 gap-12 mb-12">
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Recommandation d’action concrète *</label>
                <textarea
                  rows={2}
                  required
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.recommendation}
                  placeholder="Que devons-nous faire exactement ?"
                  onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Impact potentiel attendu</label>
                <textarea
                  rows={2}
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.potential_impact}
                  placeholder="ex: +400K impressions, protection marque, gain de PDM..."
                  onChange={(e) => setFormData({ ...formData, potential_impact: e.target.value })}
                />
              </div>
            </div>

            {/* Objets métier associés */}
            <div className="grid grid-2 gap-12 mb-12">
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Associer à une campagne Bridge</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.associated_campaign_id}
                  onChange={(e) => setFormData({ ...formData, associated_campaign_id: e.target.value })}
                >
                  <option value="">-- Aucune campagne spécifique --</option>
                  {influenceCampaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name || c.title || c.id}</option>
                  ))}
                  <option value="CAMP-001">Orange Weekend Mars 2026</option>
                  <option value="CAMP-002">Ramadan & Générosité Orange</option>
                  <option value="CAMP-003">Pulse Jeunesse & Gaming</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Associer à un talent / influenceur</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.associated_talent_id}
                  onChange={(e) => setFormData({ ...formData, associated_talent_id: e.target.value })}
                >
                  <option value="">-- Aucun talent spécifique --</option>
                  {influencers.map(inf => (
                    <option key={inf.id} value={inf.id}>@{inf.pseudo || inf.name} ({inf.realName || inf.display_name || ''})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Responsable & Échéance */}
            <div className="grid grid-3 gap-12 mb-16">
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Responsable assigné</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                >
                  <option value="Influence Manager">Influence Manager</option>
                  <option value="Chef de Projet Digital">Chef de Projet Digital</option>
                  <option value="Digital Web Analyst">Digital Web Analyst</option>
                  <option value="Community Manager">Community Manager</option>
                  <option value="Direction Agence">Direction Agence</option>
                  <option value="Client Lead Orange">Client Lead Orange</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Priorité d’exécution</label>
                <select
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="bloquant">Bloquant (Urgent & Immédiat)</option>
                  <option value="critique">Critique (Sous 24h)</option>
                  <option value="important">Important (Sous 72h)</option>
                  <option value="a_surveiller">À surveiller (Semaine)</option>
                  <option value="information">Information (Standard)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-dark mb-4 block">Échéance cible</label>
                <input
                  type="date"
                  className="input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #ccc' }}
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-8 pt-12 border-t">
              <button type="button" onClick={onClose} className="btn btn-ghost">
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-orange flex items-center gap-6"
                disabled={isSubmitting}
                style={{ fontWeight: 700 }}
              >
                <span>✓</span>
                <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer dans Bridge'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
