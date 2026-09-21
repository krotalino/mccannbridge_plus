import React, { useState } from 'react';
import { CALENDAR_CONFLICT_ALERTS } from '../../../data/clientTrafficData';
import { Calendar, Filter, AlertTriangle, CheckCircle2, Clock, Plus, Share2, Layers, Eye } from 'lucide-react';

export default function ClientTrafficSharedCalendar({
  calendarItems = [],
  onOpenContentDetail,
  onOpenNewContent,
  selectedEntity = 'all',
}) {
  const [activeFilterType, setActiveFilterType] = useState('all'); // 'all' | 'organique' | 'paid_media' | 'temps_fort_orange' | 'temps_fort_local'
  const [selectedNetwork, setSelectedNetwork] = useState('all');

  const filteredItems = calendarItems.filter(item => {
    if (activeFilterType !== 'all' && item.type !== activeFilterType) return false;
    if (selectedNetwork !== 'all' && item.network !== selectedNetwork) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'valide':
        return { label: 'Validé / Prêt', bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' };
      case 'a_valider':
        return { label: 'À Valider par Orange', bg: '#E3F2FD', text: '#1565C0', border: '#BBDEFB' };
      case 'en_validation':
        return { label: 'En Revue Créa', bg: '#FFF3E0', text: '#E65100', border: '#FFE0B2' };
      default:
        return { label: 'Brouillon', bg: '#F5F5F5', text: '#616161', border: '#E0E0E0' };
    }
  };

  const getNetworkIcon = (network) => {
    switch (network?.toLowerCase()) {
      case 'facebook': return '📘';
      case 'instagram': return '📸';
      case 'tiktok': return '🎵';
      case 'linkedin': return '💼';
      case 'x':
      case 'twitter': return '🐦';
      case 'youtube': return '▶️';
      default: return '🌐';
    }
  };

  return (
    <div className="client-traffic-shared-calendar space-y-20 animate-fade">
      {/* ─── BANDEAU HEADER DU CALENDRIER ─── */}
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
                CALENDRIER PARTAGÉ & TEMPS FORTS
              </h2>
              <span className="tag tag-purple" style={{ fontSize: 11, fontWeight: 800 }}>
                Semaine S38 & S39 (Septembre 2026)
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 12.5 }}>
              Planning unifié : Publications organiques, Campagnes Paid Media, Événements Orange, Validation créas & COPIL
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)' }}>
              {filteredItems.length} contenus / temps forts
            </span>
          </div>
        </div>

        {/* Filtres par type et par réseau */}
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
          {/* Types de contenu pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'Tout le calendrier' },
              { id: 'organique', label: '📱 Organique Social' },
              { id: 'paid_media', label: '🎯 Campagnes Média' },
              { id: 'temps_fort_orange', label: '🟠 Temps Forts Orange' },
              { id: 'temps_fort_local', label: '🏆 Événements Locaux' },
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setActiveFilterType(type.id)}
                style={{
                  padding: '5px 11px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 800,
                  border: activeFilterType === type.id ? '1px solid #FF7900' : '1px solid #E5E7EB',
                  background: activeFilterType === type.id ? '#FFF8F2' : '#FFFFFF',
                  color: activeFilterType === type.id ? '#FF7900' : '#4B5563',
                  cursor: 'pointer',
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Réseau filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>Plateforme :</span>
            <select
              value={selectedNetwork}
              onChange={e => setSelectedNetwork(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #D1D5DB',
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              <option value="all">Toutes plateformes</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── DÉTECTION DES CONFLITS DE CALENDRIER (Page 4 du Cahier des Charges) ─── */}
      <div
        className="card"
        style={{
          borderRadius: 12,
          padding: '16px 20px',
          background: '#FFFDF0',
          border: '1.5px solid #FFE082',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} className="text-amber-600" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              DÉTECTION AUTOMATIQUE DES CONFLITS DE CALENDRIER
            </span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#B45309' }}>
            2 alertes de régulation
          </span>
        </div>

        <div className="space-y-8">
          {CALENDAR_CONFLICT_ALERTS.map(alert => (
            <div
              key={alert.id}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: '#FFFFFF',
                border: '1px solid #FDE68A',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: '#92400E', marginBottom: 2 }}>
                  ⚠️ {alert.title}
                </div>
                <div style={{ fontSize: 11.5, color: '#4B5563', marginBottom: 4 }}>
                  {alert.desc}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#15803D' }}>
                  💡 <strong>Arbitrage recommandé :</strong> {alert.recommendedFix}
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: alert.severity === 'moyen' ? '#FEF3C7' : '#EFF6FF',
                  color: alert.severity === 'moyen' ? '#B45309' : '#1D4ED8',
                  textTransform: 'uppercase',
                }}
              >
                Sévérité {alert.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── GRILLE DES CONTENUS & TEMPS FORTS ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 14,
        }}
      >
        {filteredItems.map(item => {
          const statusBadge = getStatusBadge(item.status);
          const icon = getNetworkIcon(item.network);

          return (
            <div
              key={item.id}
              className="card"
              onClick={() => onOpenContentDetail(item)}
              style={{
                borderRadius: 12,
                padding: '16px 18px',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
              }}
            >
              <div>
                {/* Header Card */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--dark)' }}>
                      {item.network}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>• {item.brand}</span>
                  </div>

                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 12,
                      background: statusBadge.bg,
                      color: statusBadge.text,
                      border: `1px solid ${statusBadge.border}`,
                    }}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                {/* Title */}
                <h4 style={{ fontSize: 14, fontWeight: 900, color: 'var(--dark)', margin: '0 0 6px 0' }}>
                  {item.title}
                </h4>

                {/* Message preview */}
                <p style={{ fontSize: 11.5, color: '#4B5563', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  « {item.message} »
                </p>

                {/* Format & Budget badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: '#F3F4F6',
                      color: '#374151',
                    }}
                  >
                    📐 {item.format}
                  </span>
                  {item.mediaBudget && (
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: '#E0F2FE',
                        color: '#0369A1',
                      }}
                    >
                      💰 {item.mediaBudget}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer info: Date, KPI, Creator */}
              <div
                style={{
                  paddingTop: 10,
                  borderTop: '1px solid #F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: 'var(--muted)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 800, color: '#FF7900' }}>
                    📅 {item.date}
                  </span>{' '}
                  à {item.time}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={13} className="text-gray-400" />
                  <span style={{ fontSize: 10.5, fontWeight: 700 }}>Détail complet →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
