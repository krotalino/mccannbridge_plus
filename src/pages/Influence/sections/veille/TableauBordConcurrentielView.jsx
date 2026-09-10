import { useState } from 'react';
import {
  formatTimeAgo,
  formatFullDateFr,
  CONFIDENCE_LEVELS,
} from './veilleUtils.js';

export default function TableauBordConcurrentielView({
  competitors = [],
  watchItems = [],
  onOpenTransformModal,
  onSaveCompetitor,
}) {
  const [selectedCompId, setSelectedCompId] = useState(competitors[0]?.id || 'COMP-MTN-CM');
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedComp = competitors.find(c => c.id === selectedCompId) || competitors[0];

  // Signaux associés au concurrent sélectionné
  const compSignals = watchItems.filter(i =>
    i.associated_competitor_ids?.includes(selectedComp?.id) ||
    i.title?.toLowerCase().includes(selectedComp?.name?.toLowerCase().split(' ')[0] || '') ||
    i.summary?.toLowerCase().includes(selectedComp?.name?.toLowerCase().split(' ')[0] || '')
  );

  return (
    <div className="tableau-bord-concurrentiel-view">
      {/* Sélecteur des concurrents surveillés */}
      <div className="flex flex-wrap items-center justify-between gap-12 mb-16">
        <div className="flex items-center gap-8 flex-wrap">
          <span className="text-xs font-bold text-dark uppercase tracking-wider">Marque analysée :</span>
          {competitors.map(comp => (
            <button
              key={comp.id}
              onClick={() => setSelectedCompId(comp.id)}
              className={`btn btn-sm ${selectedCompId === comp.id ? 'btn-orange' : 'btn-white'}`}
              style={{
                fontWeight: selectedCompId === comp.id ? 700 : 500,
                border: selectedCompId === comp.id ? 'none' : '1px solid #ddd'
              }}
            >
              {comp.name}
            </button>
          ))}
        </div>

        <div className="text-xs text-muted">
          Règle déontologique : les estimations budgétaires sont explicitement signalées avec leur degré de certitude.
        </div>
      </div>

      {selectedComp && (
        <div>
          {/* Fiche d'identité et Radar du concurrent sélectionné */}
          <div className="card mb-16 p-16" style={{ background: '#FFF' }}>
            <div className="flex flex-wrap items-start justify-between gap-16 mb-16 pb-12 border-b">
              <div>
                <div className="flex items-center gap-8 mb-4">
                  <h3 className="text-lg font-bold text-dark">{selectedComp.name}</h3>
                  <span className="tag tag-blue">{selectedComp.category}</span>
                  <span className="tag" style={{ background: selectedComp.risk_level === 'élevé' ? '#FFEBEF' : '#FFF3E0', color: selectedComp.risk_level === 'élevé' ? '#DC3545' : '#FF7900', fontWeight: 700 }}>
                    Menace : {selectedComp.risk_level}
                  </span>
                </div>
                <div className="text-xs text-muted">
                  Pays : {selectedComp.country} • Marques associées : {(selectedComp.brands || []).join(', ')} • Dernière activité : {selectedComp.last_activity_date}
                </div>
              </div>

              {/* Bloc Budget Estimé avec Mention Transparente */}
              <div className="p-10 rounded text-right" style={{ background: '#FFF8F0', border: '1px solid #FFE0B2', minWidth: 260 }}>
                <div className="text-xs text-muted mb-2">Budget Mensuel Influence Estimé</div>
                <div className="text-xl font-bold text-dark">
                  {(selectedComp.estimated_monthly_influence_budget / 1000000).toFixed(1)}M FCFA
                </div>
                <div className="flex items-center justify-end gap-6 mt-4">
                  <span className="tag tag-orange" style={{ fontSize: 10 }}>
                    Niveau : {selectedComp.budget_confidence}
                  </span>
                </div>
                <div className="text-xs text-muted mt-4 italic" style={{ fontSize: 10 }}>
                  Source : {selectedComp.budget_source}
                </div>
              </div>
            </div>

            {/* Grille analytique : Créateurs, Formats, Hashtags & Mécaniques */}
            <div className="grid grid-3 gap-16 mb-16">
              {/* Créateurs mobilisés */}
              <div className="p-12 rounded border" style={{ background: '#F8FAFC' }}>
                <div className="text-xs font-bold text-dark mb-8 flex items-center gap-6">
                  <span>👥</span>
                  <span>Créateurs & Ambassadeurs identifiés</span>
                </div>
                <div className="flex flex-wrap gap-6">
                  {selectedComp.primary_creators_used?.map((c, i) => (
                    <span key={i} className="tag tag-white" style={{ border: '1px solid #CBD5E1', fontSize: 11 }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mécaniques & Appels à l'action */}
              <div className="p-12 rounded border" style={{ background: '#F8FAFC' }}>
                <div className="text-xs font-bold text-dark mb-8 flex items-center gap-6">
                  <span>⚙️</span>
                  <span>Mécaniques d’activation observées</span>
                </div>
                <ul className="text-xs text-muted" style={{ paddingLeft: 16, lineHeight: 1.7 }}>
                  {selectedComp.key_mechanics?.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Mots-clés & Hashtags surveillés */}
              <div className="p-12 rounded border" style={{ background: '#F8FAFC' }}>
                <div className="text-xs font-bold text-dark mb-8 flex items-center gap-6">
                  <span>🏷️</span>
                  <span>Hashtags & Mots-clés surveillés</span>
                </div>
                <div className="flex flex-wrap gap-6 mb-8">
                  {selectedComp.monitored_hashtags?.map((h, i) => (
                    <span key={i} className="tag tag-blue" style={{ fontSize: 10 }}>
                      {h}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-muted">
                  Keywords : {(selectedComp.monitored_keywords || []).join(', ')}
                </div>
              </div>
            </div>

            {/* Comptes officiels */}
            <div className="flex items-center gap-12 p-8 rounded mb-16 text-xs" style={{ background: '#F1F5F9' }}>
              <span className="font-bold text-dark">Comptes officiels surveillés :</span>
              {selectedComp.official_profiles?.map((p, i) => (
                <span key={i} className="text-muted">
                  <strong>{p.platform.toUpperCase()}</strong> : {p.handle} ({p.followers})
                </span>
              ))}
            </div>

            {/* Opportunités vs Menaces pour Orange Cameroun */}
            <div className="grid grid-2 gap-12 text-xs">
              <div className="p-12 rounded" style={{ background: '#FFEBEF', border: '1px solid #FFA8B6' }}>
                <div className="font-bold text-red-900 mb-4">⚠️ Menace concurrentielle pour Orange Cameroun :</div>
                <div className="text-red-800 leading-relaxed">{selectedComp.threat_level}</div>
              </div>

              <div className="p-12 rounded" style={{ background: '#E8F5E9', border: '1px solid #C8E6C9' }}>
                <div className="font-bold text-green-900 mb-4">🟢 Opportunité de contre-positionnement :</div>
                <div className="text-green-800 leading-relaxed">
                  Mettre en avant la supériorité de la couverture 4G Orange et la transparence des frais Orange Money face aux promotions temporaires de {selectedComp.name}.
                </div>
              </div>
            </div>
          </div>

          {/* Flux des signaux récents sur ce concurrent */}
          <div className="card p-16" style={{ background: '#FFF' }}>
            <h4 className="text-sm font-bold text-dark mb-12 flex items-center justify-between">
              <span>Signaux récents détectés sur {selectedComp.name}</span>
              <span className="text-xs text-muted font-normal">{compSignals.length} signal(aux)</span>
            </h4>

            {compSignals.length > 0 ? (
              <div className="flex flex-col gap-10">
                {compSignals.map(sig => (
                  <div key={sig.id} className="p-10 rounded border" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-bold text-dark text-xs">{sig.title}</div>
                      <span className="text-xs text-muted">{formatTimeAgo(sig.collected_at)}</span>
                    </div>
                    <div className="text-xs text-muted mb-6">{sig.summary}</div>
                    <div className="flex justify-between items-center text-xs pt-4 border-t border-gray-100">
                      <span className="text-muted">Source : <strong>{sig.source_name}</strong> • Certitude : <span className="text-blue-700">{sig.confidence_level}</span></span>
                      <button
                        onClick={() => onOpenTransformModal(sig)}
                        className="btn btn-sm"
                        style={{ padding: '3px 8px', fontSize: 11, background: '#FF7900', color: '#FFF' }}
                      >
                        Riposter / Action
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center text-xs text-muted">
                Aucune anomalie ou nouvelle campagne agressive détectée ces 7 derniers jours sur {selectedComp.name}.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
