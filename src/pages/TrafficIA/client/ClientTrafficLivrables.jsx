import React, { useState } from 'react';
import { Download, Search, Filter, FileText, CheckCircle2, Clock, Eye, Layers, FolderCheck } from 'lucide-react';

export default function ClientTrafficLivrables({
  livrables = [],
  selectedEntity = 'all',
  selectedPeriod = 'all',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = [
    { id: 'all', label: 'Toutes catégories' },
    { id: 'bilans', label: '📊 Rapports & bilans' },
    { id: 'creas', label: '🎨 Créas validées & exports' },
    { id: 'calendriers', label: '📅 Calendriers de contenus' },
    { id: 'recommandations', label: '💡 Recommandations' },
    { id: 'compte_rendus', label: '📝 Compte-rendus COPIL' },
  ];

  const filteredLivrables = livrables.filter(liv => {
    if (selectedCategory !== 'all' && liv.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && liv.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = liv.name.toLowerCase().includes(q);
      const matchCampaign = liv.campaign.toLowerCase().includes(q);
      const matchAuthor = liv.author.toLowerCase().includes(q);
      if (!matchName && !matchCampaign && !matchAuthor) return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'livre':
        return { label: 'Validé & Livré', bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' };
      case 'a_valider':
        return { label: 'À Valider par Orange', bg: '#E3F2FD', text: '#1565C0', border: '#BBDEFB' };
      case 'en_revue':
        return { label: 'Revue interne McCann', bg: '#FFF3E0', text: '#E65100', border: '#FFE0B2' };
      case 'archive':
        return { label: 'Archivé', bg: '#F5F5F5', text: '#616161', border: '#E0E0E0' };
      default:
        return { label: 'Brouillon', bg: '#ECEFF1', text: '#455A64', border: '#CFD8DC' };
    }
  };

  const getFileTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF': return '📄';
      case 'MP4': return '🎬';
      case 'XLSX':
      case 'EXCEL': return '📊';
      case 'ZIP': return '📦';
      default: return '📁';
    }
  };

  const handleDownload = (liv) => {
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `${liv.name}.${liv.fileType.toLowerCase()}`);
    // Simulate instantaneous download feedback
    alert(`Téléchargement initié : ${liv.name} (${liv.version} - ${liv.fileSize})`);
  };

  return (
    <div className="client-traffic-livrables space-y-20 animate-fade">
      {/* ─── BANDEAU HEADER LIVRABLES & BILANS ─── */}
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
                BIBLIOTHÈQUE DES LIVRABLES, BILANS & ASSETS CERTIFIÉS
              </h2>
              <span className="tag tag-green" style={{ fontSize: 11, fontWeight: 800 }}>
                {filteredLivrables.length} documents disponibles
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 12.5 }}>
              Dépôt certifié par campagne, demande et période • Téléchargement direct avec historique des versions
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 8,
                background: '#F0FDF4',
                color: '#166534',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <FolderCheck size={14} />
              <span>Bilan S38 Certifié disponible</span>
            </span>
          </div>
        </div>

        {/* Filtres & Recherche */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid #F3F4F6',
          }}
        >
          {/* Recherche */}
          <div style={{ flex: '2 1 200px', minWidth: 180, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--muted)' }} />
            <input
              type="search"
              placeholder="Rechercher un livrable, bilan, campagne..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 32px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                fontSize: 12,
                height: 38,
              }}
            />
          </div>

          {/* Catégorie */}
          <div style={{ flex: '1 1 180px', minWidth: 160 }}>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                fontSize: 12,
                height: 38,
                fontWeight: 700,
              }}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div style={{ flex: '1 1 150px', minWidth: 140 }}>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                fontSize: 12,
                height: 38,
                fontWeight: 700,
              }}
            >
              <option value="all">Tous statuts</option>
              <option value="livre">Validé & Livré</option>
              <option value="a_valider">À Valider par Orange</option>
              <option value="en_revue">Revue interne McCann</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── LISTE DES DOCUMENTS & LIVRABLES (Page 6 du Cahier des Charges) ─── */}
      <div className="space-y-12">
        {filteredLivrables.map(liv => {
          const statusBadge = getStatusBadge(liv.status);
          const icon = getFileTypeIcon(liv.fileType);

          return (
            <div
              key={liv.id}
              className="card"
              style={{
                borderRadius: 12,
                padding: '16px 20px',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 260 }}>
                {/* File format icon block */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: statusBadge.bg,
                        color: statusBadge.text,
                        border: `1px solid ${statusBadge.border}`,
                      }}
                    >
                      {statusBadge.label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#FF7900' }}>
                      {liv.version}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      • {liv.entity}
                    </span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                      ({liv.categoryLabel})
                    </span>
                  </div>

                  <h3 style={{ fontSize: 14, fontWeight: 900, color: 'var(--dark)', margin: '0 0 4px 0' }}>
                    {liv.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11.5, color: '#6B7280', flexWrap: 'wrap' }}>
                    <span>✍️ <strong>Auteur :</strong> {liv.author}</span>
                    <span>📅 Déposé le {liv.depositDate}</span>
                    <span>📦 {liv.fileSize} ({liv.fileType})</span>
                    <span>💬 {liv.commentsCount} commentaire(s)</span>
                  </div>
                </div>
              </div>

              {/* Action: Télécharger & Consulter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDownload(liv)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#FF7900',
                    border: 'none',
                    fontWeight: 800,
                  }}
                >
                  <Download size={14} />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
