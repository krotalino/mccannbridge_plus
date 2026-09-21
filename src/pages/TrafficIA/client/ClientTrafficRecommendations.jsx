import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, XCircle, RotateCcw, AlertCircle, ArrowUpRight, TrendingUp, Sparkles, Filter } from 'lucide-react';

export default function ClientTrafficRecommendations({
  recommendations = [],
  onUpdateDecision,
  onOpenNewProposal,
  selectedEntity = 'all',
}) {
  const [filterDecision, setFilterDecision] = useState('all'); // 'all' | 'a_examiner' | 'approuvee' | 'a_retravailler' | 'refusee'
  const [filterAarrr, setFilterAarrr] = useState('all');

  const filteredRecs = recommendations.filter(rec => {
    if (filterDecision !== 'all' && rec.clientDecision !== filterDecision) return false;
    if (filterAarrr !== 'all' && rec.aarrr !== filterAarrr) return false;
    return true;
  });

  const getDecisionBadge = (decision) => {
    switch (decision) {
      case 'approuvee':
        return { label: 'Approuvée par Orange', bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9', icon: '✅' };
      case 'a_retravailler':
        return { label: 'À réajuster', bg: '#FFF3E0', text: '#E65100', border: '#FFE0B2', icon: '🔄' };
      case 'refusee':
        return { label: 'Non retenue', bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2', icon: '❌' };
      default:
        return { label: 'Prête à arbitrer', bg: '#F3E5F5', text: '#7B1FA2', border: '#E1BEE7', icon: '⚡' };
    }
  };

  const getUrgencyBadge = (u) => {
    switch (u) {
      case 'élevé': return { bg: '#FFEBEE', text: '#C62828', label: 'Urgence Haute' };
      case 'moyen': return { bg: '#FFF3E0', text: '#E65100', label: 'Urgence Moyenne' };
      default: return { bg: '#F5F5F5', text: '#616161', label: 'Urgence Normale' };
    }
  };

  return (
    <div className="client-traffic-recommendations space-y-20 animate-fade">
      {/* ─── BANDEAU HEADER DU REGISTRE DES RECOMMANDATIONS ─── */}
      <div
        className="card p-16"
        style={{
          borderRadius: 12,
          background: '#FFFFFF',
          border: '1px solid #E0E0E0',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
                REGISTRE DES RECOMMANDATIONS DIGITALES MCCANN
              </h2>
              <span className="tag tag-purple" style={{ fontSize: 11, fontWeight: 800 }}>
                Programme Proactif Test & Learn
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 12.5 }}>
              Centralisation transparente des propositions proactives d’innovation, d’optimisation créative et d’opportunités média
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#6A1B9A' }}>
              💡 {filteredRecs.length} propositions enregistrées
            </span>
          </div>
        </div>

        {/* Filtres par décision et par AARRR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid #F3F4F6',
          }}
        >
          {/* Décision pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'Toutes les propositions' },
              { id: 'a_examiner', label: '⚡ Prêtes à arbitrer' },
              { id: 'approuvee', label: '✅ Approuvées' },
              { id: 'a_retravailler', label: '🔄 À retravailler' },
              { id: 'refusee', label: '❌ Non retenues' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterDecision(tab.id)}
                style={{
                  padding: '5px 11px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 800,
                  border: filterDecision === tab.id ? '1px solid #6A1B9A' : '1px solid #E5E7EB',
                  background: filterDecision === tab.id ? '#F3E5F5' : '#FFFFFF',
                  color: filterDecision === tab.id ? '#6A1B9A' : '#4B5563',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtre AARRR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>Objectif AARRR :</span>
            <select
              value={filterAarrr}
              onChange={e => setFilterAarrr(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #D1D5DB',
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              <option value="all">Tous objectifs</option>
              <option value="Acquisition">Acquisition</option>
              <option value="Activation">Activation</option>
              <option value="Rétention">Rétention</option>
              <option value="Revenu">Revenu</option>
              <option value="Référence">Référence</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── LISTE DÉTAILLÉE DES RECOMMANDATIONS (Page 4 du Cahier des Charges) ─── */}
      <div className="space-y-16">
        {filteredRecs.map(rec => {
          const decisionBadge = getDecisionBadge(rec.clientDecision);
          const urgencyBadge = getUrgencyBadge(rec.urgencyLevel);

          return (
            <div
              key={rec.id}
              className="card"
              style={{
                borderRadius: 14,
                padding: '20px 24px',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              {/* Header de la Recommandation */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#6A1B9A' }}>
                      {rec.id}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: '#EDE7F6',
                        color: '#512DA8',
                      }}
                    >
                      🎯 Objectif AARRR : {rec.aarrr}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: urgencyBadge.bg,
                        color: urgencyBadge.text,
                      }}
                    >
                      {urgencyBadge.label}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      Date : {rec.dateProposed}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--dark)', margin: '0 0 4px 0' }}>
                    {rec.title}
                  </h3>
                  <p style={{ fontSize: 12.5, color: '#4B5563', margin: 0, fontWeight: 600 }}>
                    {rec.summary}
                  </p>
                </div>

                {/* Badge de statut décisionnel actuel */}
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: decisionBadge.bg,
                    color: decisionBadge.text,
                    border: `1px solid ${decisionBadge.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span>{decisionBadge.icon}</span>
                  <span>{decisionBadge.label}</span>
                </span>
              </div>

              {/* Fiche d'argumentation structurée (Les 6 points du cahier des charges) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 12,
                  padding: '14px',
                  borderRadius: 10,
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  margin: '14px 0',
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', marginBottom: 2 }}>
                    📡 Signal déclencheur
                  </div>
                  <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
                    {rec.triggerSignal}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', marginBottom: 2 }}>
                    📊 Justification (Donnée & Apprentissage)
                  </div>
                  <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
                    {rec.justification}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', marginBottom: 2 }}>
                    🎨 Proposition créative / média
                  </div>
                  <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
                    {rec.creativeProposal}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: 2 }}>
                    ⚙️ Ressources, Délai & Budget
                  </div>
                  <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
                    {rec.resourcesNeeded} • <strong>{rec.budgetEstimate}</strong>
                  </div>
                </div>
              </div>

              {/* Résultat du test / Impact mesurable (Page 4) */}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  fontSize: 12,
                  color: '#166534',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <TrendingUp size={16} />
                <span>
                  <strong>Résultat / Hypothèse d’impact mesurable :</strong> {rec.testResult}
                </span>
              </div>

              {/* Boutons d'arbitrage Orange (Cahier des charges Page 4) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  paddingTop: 12,
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                  Arbitrage attendu de : <strong>Patrick Tuete (Head of Digital)</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => onUpdateDecision(rec.id, 'approuvee')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 800,
                      background: rec.clientDecision === 'approuvee' ? '#2E7D32' : '#E8F5E9',
                      color: rec.clientDecision === 'approuvee' ? '#FFFFFF' : '#2E7D32',
                      border: '1px solid #C8E6C9',
                      cursor: 'pointer',
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>Approuver l’opportunité</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateDecision(rec.id, 'a_retravailler')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 800,
                      background: rec.clientDecision === 'a_retravailler' ? '#E65100' : '#FFF3E0',
                      color: rec.clientDecision === 'a_retravailler' ? '#FFFFFF' : '#E65100',
                      border: '1px solid #FFE0B2',
                      cursor: 'pointer',
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>Demander ajustement</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateDecision(rec.id, 'refusee')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 800,
                      background: rec.clientDecision === 'refusee' ? '#C62828' : '#FFEBEE',
                      color: rec.clientDecision === 'refusee' ? '#FFFFFF' : '#C62828',
                      border: '1px solid #FFCDD2',
                      cursor: 'pointer',
                    }}
                  >
                    <XCircle size={13} />
                    <span>Non retenue</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
