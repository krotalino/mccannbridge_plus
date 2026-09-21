import React from 'react';
import { X, CheckCircle2, AlertTriangle, FileText, Download, User, Calendar, Clock, ArrowRight } from 'lucide-react';
import { CLIENT_STATUSES } from '../../../data/clientTrafficData';

export default function ClientDossierDetailModal({ dossier, isOpen, onClose }) {
  if (!isOpen || !dossier) return null;

  const statusConfig = CLIENT_STATUSES.find(s => s.id === dossier.clientStatus) || CLIENT_STATUSES[0];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 14,
          background: '#FFFFFF',
          padding: '24px 28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#FF7900' }}>
                {dossier.id}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: statusConfig.bg,
                  color: statusConfig.color,
                  border: `1px solid ${statusConfig.color}40`,
                }}
              >
                {statusConfig.icon} {statusConfig.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: '#E3F2FD',
                  color: '#1565C0',
                }}
              >
                🎯 {dossier.aarrr}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>
                • {dossier.brand}
              </span>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, color: 'var(--dark)' }}>
              {dossier.title}
            </h2>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-16">
          {/* Prochaine étape immédiate */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: '#FFF8F2',
              border: '1.5px solid #FFCC80',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: '#E65100', textTransform: 'uppercase', marginBottom: 2 }}>
              ⚡ PROCHAINE ÉTAPE CLAIRE (ATTENTE MCCANN / ORANGE)
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#212121' }}>
              {dossier.nextStep}
            </div>
          </div>

          {/* Interlocuteurs clés & Échéance */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
              padding: 14,
              borderRadius: 10,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 2 }}>
                🎨 PILOTE MCCANN DOUALA
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                {dossier.mccannLead?.name}
              </div>
              <div style={{ fontSize: 11, color: '#4B5563' }}>
                {dossier.mccannLead?.role} • {dossier.mccannLead?.email}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 2 }}>
                👤 CONTACT ORANGE CAMEROUN
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>
                {dossier.orangeContact?.name}
              </div>
              <div style={{ fontSize: 11, color: '#4B5563' }}>
                {dossier.orangeContact?.role} • {dossier.orangeContact?.email}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', marginBottom: 2 }}>
                📅 ÉCHÉANCE CONTRACTUELLE
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#FF7900' }}>
                {dossier.deadline ? new Date(dossier.deadline).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'À fixer'}
              </div>
              <div style={{ fontSize: 11, color: '#4B5563' }}>
                Priorité : <strong>{dossier.priority.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          {/* Point de vigilance / Risque */}
          {dossier.risk && (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: dossier.risk.level === 'vert' ? '#F0FDF4' : '#FFFDF9',
                border: dossier.risk.level === 'vert' ? '1px solid #BBF7D0' : '1.5px solid #FFCC80',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <AlertTriangle size={15} color={dossier.risk.level === 'vert' ? '#2E7D32' : '#E65100'} />
                <span style={{ fontSize: 11.5, fontWeight: 900, textTransform: 'uppercase', color: dossier.risk.level === 'vert' ? '#2E7D32' : '#E65100' }}>
                  Niveau de risque : {dossier.risk.level.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.4, color: '#374151' }} className="space-y-2">
                <div><strong>Cause :</strong> {dossier.risk.cause}</div>
                <div><strong>Conséquence :</strong> {dossier.risk.consequence}</div>
                <div><strong>Date de décision :</strong> {dossier.risk.decisionDate}</div>
                <div><strong>Action recommandée :</strong> {dossier.risk.recommendedAction}</div>
              </div>
            </div>
          )}

          {/* Timeline des 10 étapes */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 900, color: 'var(--dark)', marginBottom: 10 }}>
              Chronologie des 10 Étapes du Dossier
            </h4>
            <div className="space-y-6">
              {dossier.timeline?.map((step) => (
                <div
                  key={step.step}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: step.done ? '#F0FDF4' : '#F9FAFB',
                    border: step.done ? '1px solid #DCFCE7' : '1px solid #E5E7EB',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: step.done ? '#2E7D32' : '#E5E7EB',
                        color: step.done ? '#FFFFFF' : '#9CA3AF',
                        fontSize: 11,
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.done ? '✓' : step.step}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: step.done ? 800 : 600, color: step.done ? '#166534' : '#4B5563' }}>
                      {step.step}. {step.label}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>
                    <span>{step.date}</span> • <span>{step.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assets joints */}
          {dossier.assets && dossier.assets.length > 0 && (
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 900, color: 'var(--dark)', marginBottom: 8 }}>
                Documents & Livrables Rattachés
              </h4>
              <div className="space-y-6">
                {dossier.assets.map((asset, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={16} className="text-gray-500" />
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--dark)' }}>
                        {asset.name}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                        ({asset.size})
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => alert(`Téléchargement de ${asset.name}`)}
                      style={{ fontSize: 11, fontWeight: 800, color: '#FF7900' }}
                    >
                      <Download size={12} /> Télécharger
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 14, borderTop: '1px solid #E5E7EB' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ fontSize: 12, fontWeight: 800 }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
