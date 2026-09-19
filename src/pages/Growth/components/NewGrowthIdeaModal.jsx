import React, { useState } from 'react';
import { GROWTH_AARRR_STAGES } from '../../../data/growth';

export default function NewGrowthIdeaModal({
  isOpen,
  onClose,
  onSubmitIdea
}) {
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState('Acquisition');
  const [hypothesis, setHypothesis] = useState('');
  const [metric, setMetric] = useState('');
  const [impact, setImpact] = useState(8);
  const [confidence, setConfidence] = useState(7);
  const [ease, setEase] = useState(8);
  const [tags, setTags] = useState('landing-page, CTA');
  const [author, setAuthor] = useState('Steve B. (McCann)');

  if (!isOpen) return null;

  const totalIce = impact * confidence * ease;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newIdea = {
      id: `idea-${Date.now().toString().slice(-4)}`,
      title,
      stage,
      hypothesis,
      metric,
      author,
      date: new Date().toISOString().slice(0, 10),
      scoreICE: {
        impact: Number(impact),
        confidence: Number(confidence),
        ease: Number(ease),
        total: totalIce
      },
      votes: 1,
      status: 'submitted',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (onSubmitIdea) {
      onSubmitIdea(newIdea);
    }
    onClose();
  };

  return (
    <div
      className="modal-backdrop animate-fade"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1150,
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: 24,
          maxWidth: 580,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E5E7EB',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>💡</span>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
                Soumettre une Idée Growth
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0 0' }}>
                Qualification d'hypothèse AARRR & calcul automatique du score ICE
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 8px', fontSize: 16 }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Titre */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 4 }}>
              Titre de l'idée / levier d'optimisation *
            </label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="Ex: CTA WhatsApp direct sur parcours Orange Money..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', height: 40, borderRadius: 8, fontSize: 13 }}
            />
          </div>

          {/* Étape AARRR & Métrique */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 4 }}>
                Étape Funnel AARRR
              </label>
              <select
                className="form-input"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                style={{ width: '100%', height: 40, borderRadius: 8, fontSize: 13 }}
              >
                {GROWTH_AARRR_STAGES.map((s) => (
                  <option key={s.id} value={s.label}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 4 }}>
                Métrique clé ciblée
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Taux de conversion checkout"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                style={{ width: '100%', height: 40, borderRadius: 8, fontSize: 13 }}
              />
            </div>
          </div>

          {/* Hypothèse */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 4 }}>
              Hypothèse d'expérimentation
            </label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Si nous [action], alors nous observerons [résultat chiffré] parce que [raison comportementale]..."
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              style={{ width: '100%', borderRadius: 8, fontSize: 12.5, padding: '8px 10px' }}
            />
          </div>

          {/* Scoring ICE */}
          <div
            style={{
              background: '#FFF8F2',
              borderRadius: 10,
              padding: '14px 16px',
              border: '1px solid #FFE0B2',
              marginBottom: 16
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#E65100', textTransform: 'uppercase' }}>
                Évaluation ICE Score
              </span>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#FF7900' }}>
                Score Total : <span style={{ fontSize: 18 }}>{totalIce}</span> pts
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 2 }}>
                  Impact (1-10) : <strong>{impact}</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  style={{ width: '100%', accentColor: '#FF7900' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 2 }}>
                  Confiance (1-10) : <strong>{confidence}</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={confidence}
                  onChange={(e) => setConfidence(e.target.value)}
                  style={{ width: '100%', accentColor: '#FF7900' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 2 }}>
                  Facilité (1-10) : <strong>{ease}</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={ease}
                  onChange={(e) => setEase(e.target.value)}
                  style={{ width: '100%', accentColor: '#FF7900' }}
                />
              </div>
            </div>
          </div>

          {/* Tags & Auteur */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 4 }}>
                Tags (séparés par virgule)
              </label>
              <input
                type="text"
                className="form-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{ width: '100%', height: 38, borderRadius: 8, fontSize: 12.5 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 4 }}>
                Proposé par
              </label>
              <input
                type="text"
                className="form-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{ width: '100%', height: 38, borderRadius: 8, fontSize: 12.5 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              style={{ border: '1px solid #D0D0D0' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ background: '#FF7900', color: '#FFF', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>+</span>
              <span>Enregistrer au Backlog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
