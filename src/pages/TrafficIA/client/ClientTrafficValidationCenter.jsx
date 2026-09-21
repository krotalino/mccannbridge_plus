import React, { useState } from 'react';
import { Zap, CheckCircle2, MessageSquare, Edit3, Clock, XCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ClientTrafficValidationCenter({
  validations = [],
  onOpenValidationModal,
  onQuickApprove,
  selectedEntity = 'all',
}) {
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredValidations = validations.filter(v => {
    if (filterCategory !== 'all' && v.category !== filterCategory) return false;
    return true;
  });

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'crea':
        return { label: 'Créa à approuver', bg: '#E3F2FD', text: '#1565C0', icon: '🎨' };
      case 'calendrier':
        return { label: 'Calendrier à valider', bg: '#F3E5F5', text: '#7B1FA2', icon: '📅' };
      case 'recommandation':
        return { label: 'Recommandation à arbitrer', bg: '#EDE7F6', text: '#512DA8', icon: '💡' };
      case 'brief':
        return { label: 'Brief à compléter', bg: '#FFF3E0', text: '#E65100', icon: '📝' };
      default:
        return { label: 'Validation requise', bg: '#ECEFF1', text: '#37474F', icon: '⚡' };
    }
  };

  return (
    <div className="client-traffic-validation-center space-y-20 animate-fade">
      {/* ─── BANDEAU HEADER DU CENTRE DE VALIDATION ─── */}
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
                ACTIONS ATTENDUES DE VOTRE PART (VALIDATIONS ORANGE)
              </h2>
              <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
                {filteredValidations.length} décisions requises
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 12.5 }}>
              Centre d'arbitrage unique : chaque validation précise le décideur, l'échéance et l'impact direct sur la diffusion
            </p>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              background: '#FFF8F2',
              border: '1px solid #FFE0B2',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 800,
              color: '#E65100',
            }}
          >
            <Clock size={15} />
            <span>Échéance critique : Vendredi 25 Septembre à 17h00</span>
          </div>
        </div>

        {/* Filtre par catégorie de validation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid #F3F4F6',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)' }}>Filtrer par nature :</span>
          {[
            { id: 'all', label: 'Toutes les actions' },
            { id: 'crea', label: '🎨 Créas à approuver' },
            { id: 'calendrier', label: '📅 Calendriers éditoriaux' },
            { id: 'recommandation', label: '💡 Recommandations' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 800,
                border: filterCategory === cat.id ? '1px solid #FF7900' : '1px solid #E5E7EB',
                background: filterCategory === cat.id ? '#FFF8F2' : '#FFFFFF',
                color: filterCategory === cat.id ? '#FF7900' : '#4B5563',
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── LISTE DES VALIDATIONS DÉTAILLÉES (Page 5 du Cahier des Charges) ─── */}
      <div className="space-y-16">
        {filteredValidations.map(val => {
          const catBadge = getCategoryBadge(val.category);

          return (
            <div
              key={val.id}
              className="card"
              style={{
                borderRadius: 14,
                padding: '20px 24px',
                background: '#FFFFFF',
                border: '1.5px solid #BBDEFB',
                boxShadow: '0 4px 12px rgba(30, 136, 229, 0.06)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: catBadge.bg,
                        color: catBadge.text,
                      }}
                    >
                      {catBadge.icon} {catBadge.label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#1E88E5' }}>
                      {val.ticketId}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>
                      • {val.entity}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
                    {val.subject}
                  </h3>
                </div>

                {/* Compte à rebours */}
                <div
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: '#FFEBEE',
                    border: '1px solid #FFCDD2',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#C62828', textTransform: 'uppercase' }}>
                    Compte à rebours
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#B71C1C' }}>
                    ⏳ {val.deadlineHoursLeft}h restantes
                  </div>
                </div>
              </div>

              {/* Les 4 éléments clés (Cahier des charges Page 5) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 10,
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#1565C0', textTransform: 'uppercase', marginBottom: 2 }}>
                    🎯 Ce qui est attendu
                  </div>
                  <div style={{ fontSize: 12, color: '#1E293B', fontWeight: 600 }}>
                    {val.whatIsExpected}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#7B1FA2', textTransform: 'uppercase', marginBottom: 2 }}>
                    👤 Qui doit répondre côté Orange
                  </div>
                  <div style={{ fontSize: 12, color: '#1E293B', fontWeight: 600 }}>
                    {val.whoMustAnswer}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#E65100', textTransform: 'uppercase', marginBottom: 2 }}>
                    📅 Date limite impérative
                  </div>
                  <div style={{ fontSize: 12, color: '#1E293B', fontWeight: 600 }}>
                    {val.deadline}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#C62828', textTransform: 'uppercase', marginBottom: 2 }}>
                    ⚠️ Impact en cas d’absence de réponse
                  </div>
                  <div style={{ fontSize: 12, color: '#B91C1C', fontWeight: 700 }}>
                    {val.impactIfNotAnswered}
                  </div>
                </div>
              </div>

              {/* Les 5 boutons d'action prescrits (Page 5) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  paddingTop: 12,
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                  {val.status === 'en_attente' ? (
                    <span style={{ color: '#E65100', fontWeight: 700 }}>● Décision en attente</span>
                  ) : (
                    <span style={{ color: '#2E7D32', fontWeight: 700 }}>✓ Traité</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {/* 1. Approuver */}
                  <button
                    type="button"
                    onClick={() => onQuickApprove(val.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '7px 14px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      background: '#2E7D32',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>1. Approuver</span>
                  </button>

                  {/* 2. Commenter */}
                  <button
                    type="button"
                    onClick={() => onOpenValidationModal(val, 'commenter')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '7px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      background: '#F0F9FF',
                      color: '#0284C7',
                      border: '1px solid #BAE6FD',
                      cursor: 'pointer',
                    }}
                  >
                    <MessageSquare size={14} />
                    <span>2. Commenter</span>
                  </button>

                  {/* 3. Demander une modification */}
                  <button
                    type="button"
                    onClick={() => onOpenValidationModal(val, 'modifier')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '7px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      background: '#FFF3E0',
                      color: '#E65100',
                      border: '1px solid #FFE0B2',
                      cursor: 'pointer',
                    }}
                  >
                    <Edit3 size={14} />
                    <span>3. Demander une modification</span>
                  </button>

                  {/* 4. Repousser */}
                  <button
                    type="button"
                    onClick={() => onOpenValidationModal(val, 'repousser')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '7px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      background: '#F3F4F6',
                      color: '#4B5563',
                      border: '1px solid #E5E7EB',
                      cursor: 'pointer',
                    }}
                  >
                    <Clock size={14} />
                    <span>4. Repousser</span>
                  </button>

                  {/* 5. Refuser */}
                  <button
                    type="button"
                    onClick={() => onOpenValidationModal(val, 'refuser')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '7px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      background: '#FFEBEE',
                      color: '#C62828',
                      border: '1px solid #FFCDD2',
                      cursor: 'pointer',
                    }}
                  >
                    <XCircle size={14} />
                    <span>5. Refuser</span>
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
