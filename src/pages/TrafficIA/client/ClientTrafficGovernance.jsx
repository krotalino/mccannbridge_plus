import React, { useState } from 'react';
import { INITIAL_CLIENT_GOVERNANCE_EVENTS, CLIENT_ROLES } from '../../../data/clientTrafficData';
import { History, Shield, Users, FileCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function ClientTrafficGovernance() {
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'events' | 'copil' | 'roles'

  // The 10 official steps defined in the cahier des charges (Page 7)
  const officialSteps = [
    { step: 1, title: 'Demande créée', actor: 'Orange', desc: 'Saisie initiale de l’expression de besoin dans la plateforme.' },
    { step: 2, title: 'Brief complété', actor: 'Orange', desc: 'Cadrage métier, objectifs AARRR, cibles, messages et CTA renseignés.' },
    { step: 3, title: 'Cadrage & estimation', actor: 'McCann', desc: 'Analyse de faisabilité, découpage technique et délai estimé.' },
    { step: 4, title: 'Planification confirmée', actor: 'Traffic McCann', desc: 'Priorisation et intégration formelle au planning agence.' },
    { step: 5, title: 'Production démarrée', actor: 'Studio McCann', desc: 'Conception créative, déclinaison graphique ou paramétrage régie.' },
    { step: 6, title: 'Prévisualisation transmise', actor: 'McCann', desc: 'Dépôt des maquettes, BAT ou cuts vidéo pour consultation client.' },
    { step: 7, title: 'Feedback Orange requis', actor: 'Orange', desc: 'Revue, annotations ou demandes d’ajustements précis.' },
    { step: 8, title: 'Version finale validée', actor: 'Valideur Orange', desc: 'Bon à diffuser formel délivré par le décisionnaire Orange.' },
    { step: 9, title: 'Publication / livraison', actor: 'Régie / CM', desc: 'Mise en ligne sponsorisée, post organique ou remise des assets HD.' },
    { step: 10, title: 'Bilan & recommandation', actor: 'McCann', desc: 'Mesure d’impact, reporting de performance et boucle Test & Learn.' },
  ];

  return (
    <div className="client-traffic-governance space-y-20 animate-fade">
      {/* ─── BANDEAU HEADER GOUVERNANCE & HISTORIQUE ─── */}
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
                HISTORIQUE, GOUVERNANCE & PROTOCOLE PARITAIRE
              </h2>
              <span className="tag tag-orange" style={{ fontSize: 11, fontWeight: 800 }}>
                Orange Cameroun ⇄ McCann Douala
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 12.5 }}>
              Traçabilité intégrale des 10 étapes d’un dossier, journal d’audit partagé et relevés de décisions des comités COPIL
            </p>
          </div>

          {/* Sub-nav tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'timeline', label: '1. Les 10 étapes standard' },
              { id: 'events', label: '2. Journal d’audit temps réel' },
              { id: 'copil', label: '3. Comités de Pilotage (COPIL)' },
              { id: 'roles', label: '4. Charte des rôles & droits' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 800,
                  border: activeTab === tab.id ? '1px solid #FF7900' : '1px solid #E5E7EB',
                  background: activeTab === tab.id ? '#FFF8F2' : '#FFFFFF',
                  color: activeTab === tab.id ? '#FF7900' : '#4B5563',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CONTENU SELON L'ONGLET SÉLECTIONNÉ ─── */}

      {/* 1. LES 10 ÉTAPES OFFICIELLES (Page 7 du Cahier des Charges) */}
      {activeTab === 'timeline' && (
        <div
          className="card p-20"
          style={{
            borderRadius: 14,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: '0 0 4px 0' }}>
              Le Cycle de Vie Paritaire d’un Dossier (10 Jalons)
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
              Chaque travail en cours suit rigoureusement cette chaîne de valeur partagée pour éliminer toute friction
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            {officialSteps.map(step => (
              <div
                key={step.step}
                style={{
                  padding: '14px',
                  borderRadius: 10,
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderTop: `3px solid ${step.actor === 'Orange' ? '#FF7900' : '#1E88E5'}`,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: step.actor === 'Orange' ? '#FFF3E0' : '#E3F2FD',
                      color: step.actor === 'Orange' ? '#E65100' : '#1565C0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {step.step}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: step.actor === 'Orange' ? '#FFF8F2' : '#EFF6FF',
                      color: step.actor === 'Orange' ? '#C2410C' : '#1D4ED8',
                      border: `1px solid ${step.actor === 'Orange' ? '#FED7AA' : '#BFDBFE'}`,
                    }}
                  >
                    Acteur : {step.actor}
                  </span>
                </div>

                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', marginBottom: 4 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.35 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. JOURNAL D'AUDIT TEMPS RÉEL (Page 7) */}
      {activeTab === 'events' && (
        <div
          className="card p-20"
          style={{
            borderRadius: 14,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: '0 0 4px 0' }}>
              Journal d’Audit Partagé en Temps Réel
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
              Traçabilité horodatée de chaque action, dépôt de livrable et validation
            </p>
          </div>

          <div className="space-y-12">
            {INITIAL_CLIENT_GOVERNANCE_EVENTS.map(evt => (
              <div
                key={evt.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: '#FFF3E0',
                    color: '#E65100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  📜
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--dark)' }}>
                      {evt.action}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {evt.date}
                    </span>
                  </div>

                  <div style={{ fontSize: 11.5, color: '#374151', marginBottom: 4 }}>
                    {evt.details}
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    Acteur : <strong>{evt.actor}</strong> • Périmètre : <strong>{evt.entity}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. COMITÉS DE PILOTAGE (COPIL) */}
      {activeTab === 'copil' && (
        <div
          className="card p-20"
          style={{
            borderRadius: 14,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: '0 0 4px 0' }}>
                Comités de Pilotage & Décisions Stratégiques
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                Relevés de décisions des réunions de coordination paritaire hebdomadaire
              </p>
            </div>
            <span className="tag tag-green" style={{ fontSize: 11, fontWeight: 800 }}>
              COPIL Hebdomadaire Chaque Vendredi
            </span>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: 10,
              background: '#F0FDF4',
              border: '1.5px solid #BBF7D0',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#166534' }}>
                📋 Relevé de Décisions — COPIL S37 (Vendredi 18 Septembre 2026)
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#166534' }}>Certifié & Signé</span>
            </div>

            <ul style={{ margin: '0 0 10px 16px', padding: 0, fontSize: 12, color: '#14532D', lineHeight: 1.6 }}>
              <li><strong>Validation du Bilan S37 :</strong> Portée globale de 10.99M validée avec félicitations du directoire Orange.</li>
              <li><strong>Priorité S38 :</strong> Lancement du découpage vidéo 9:16 Orange Money Transfert sans dépassement budgétaire.</li>
              <li><strong>Arbitrage Pulse Lions4Life :</strong> Accord pour intégrer 6 carrousels et un jeu WhatsApp interactif.</li>
              <li><strong>Veille Riposte MTN :</strong> Activation d’une cellule éclair pour monitorer les offres concurrentes à frais zéro.</li>
            </ul>

            <div style={{ fontSize: 11, color: '#15803D', fontStyle: 'italic' }}>
              Présents : Patrick Tuete (Orange), Stéphane Engo (Orange), Audrey Mballa (Orange), Fabrice Tchounga (McCann), Directeur Conseil McCann.
            </div>
          </div>
        </div>
      )}

      {/* 4. CHARTE DES RÔLES & DROITS (Page 7) */}
      {activeTab === 'roles' && (
        <div
          className="card p-20"
          style={{
            borderRadius: 14,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--dark)', margin: '0 0 4px 0' }}>
              Charte des Rôles & Niveaux d’Accès Partagés
            </h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
              Délimitation stricte des pouvoirs de validation, contribution et consultation
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {CLIENT_ROLES.map(role => (
              <div
                key={role.id}
                style={{
                  padding: '16px',
                  borderRadius: 10,
                  background: '#FAFAFA',
                  border: '1px solid #E5E7EB',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{role.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--dark)' }}>
                      {role.label}
                    </div>
                    <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                      {role.badge}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: 11.5, color: '#4B5563', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                  {role.desc}
                </p>

                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 4 }}>
                  Permissions accordées :
                </div>
                <div className="space-y-4">
                  {role.permissions.map((p, idx) => (
                    <div key={idx} style={{ fontSize: 11, color: '#374151' }}>
                      ✓ {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
