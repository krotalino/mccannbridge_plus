import { useState } from 'react';
import { 
  FileText, Download, Share2, Eye, Search, Filter, 
  CheckCircle2, Clock, Calendar, Sparkles, ExternalLink, 
  Layers, ArrowUpRight, Copy, Check, ShieldCheck, History
} from 'lucide-react';
import { REPORT_STATUSES, REPORT_TYPES, BRANDS_LIST } from '../../../data/reportsData';

export default function ReportLibraryView({
  reports = [],
  onSelectReport,
  onOpenExport,
  onCreateReport
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const filteredReports = reports.filter(r => {
    const matchesSearch = (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.brands || []).some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBrand = selectedBrand === 'all' || (r.brands || []).includes(selectedBrand);
    const matchesType = selectedType === 'all' || r.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    return matchesSearch && matchesBrand && matchesType && matchesStatus;
  });

  const handleCopyLink = (reportId) => {
    const shareUrl = `${window.location.origin}/reports?view=${reportId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(reportId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getBrandChip = (brandName) => {
    const found = BRANDS_LIST.find(b => b.name === brandName);
    const color = found ? found.color : '#FF7900';
    return (
      <span
        key={brandName}
        className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold"
        style={{ backgroundColor: color + '15', color: color, border: `1px solid ${color}35` }}
      >
        {brandName.replace('Orange ', '')}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 30 }}>
      
      {/* ─── EN-TÊTE DE SECTION (Dashboard Analytics Style) ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#FF7900',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 2px 8px rgba(255, 121, 0, 0.25)'
            }}
          >
            📄
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>
              Livrables & Fiches PDF — Bibliothèque Versionnée
            </h2>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, marginTop: 2 }}>
              Répertoire certifié des bilans de performance, fiches téléchargeables et versioning multi-formats
            </p>
          </div>
        </div>

        {/* Boutons d'action rapide */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              fontSize: 11.5, 
              fontWeight: 700, 
              background: '#FFF', 
              padding: '6px 12px', 
              borderRadius: 8, 
              border: '1px solid #E5E7EB' 
            }}
          >
            <span style={{ color: '#27AE60', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#27AE60' }}></span>
              {reports.filter(r => r.status === 'delivered' || r.status === 'approved').length} Validés / Livrés
            </span>
            <span style={{ color: '#D1D5DB' }}>•</span>
            <span style={{ color: '#FF7900', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7900' }}></span>
              {reports.filter(r => r.status === 'client_review' || r.status === 'internal_review').length} En révision
            </span>
          </div>

          <button
            type="button"
            onClick={onCreateReport}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF7900', color: '#FFF' }}
          >
            <span>+</span>
            <span>Nouvelle Demande</span>
          </button>
        </div>
      </div>

      {/* ─── FILTRE RECHERCHE (Dashboard Analytics Style) ─── */}
      <div 
        className="card p-14 animate-fade"
        style={{
          background: '#FFF',
          borderRadius: 12,
          border: '1px solid #E0E0E0',
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <div style={{ flex: '2 1 240px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Rechercher par titre, ID (REP-...), marque..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: 40, fontSize: 12.5, borderRadius: 8, border: '1px solid #D1D5DB' }}
          />
        </div>

        <select
          className="form-input"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          style={{ flex: '1 1 150px', height: 40, fontSize: 12.5, borderRadius: 8, border: '1px solid #D1D5DB' }}
        >
          <option value="all">Toutes les marques</option>
          {BRANDS_LIST.map((b) => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
        </select>

        <select
          className="form-input"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ flex: '1 1 160px', height: 40, fontSize: 12.5, borderRadius: 8, border: '1px solid #D1D5DB' }}
        >
          <option value="all">Tous types de rapport</option>
          {REPORT_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>

        <select
          className="form-input"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ flex: '1 1 160px', height: 40, fontSize: 12.5, borderRadius: 8, border: '1px solid #D1D5DB' }}
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(REPORT_STATUSES).map(([k, s]) => (
            <option key={k} value={k}>{s.label}</option>
          ))}
        </select>

        {(searchQuery || selectedBrand !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedBrand('all');
              setSelectedType('all');
              setSelectedStatus('all');
            }}
            className="btn btn-ghost btn-sm"
            style={{ height: 40, border: '1px solid #D0D0D0' }}
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* ─── GRID DES RAPPORTS & FICHES (Dashboard Analytics Cards) ─── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: 16 
        }}
      >
        {filteredReports.map((report) => {
          const statusCfg = REPORT_STATUSES[report.status] || REPORT_STATUSES.draft;
          return (
            <div
              key={report.id}
              className="card p-16 flex flex-col justify-between transition-all"
              style={{ 
                background: '#FFF', 
                borderRadius: 12, 
                border: '1px solid #E0E0E0',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF7900';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,121,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                {/* Card Top: ID, Version, Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span 
                      style={{ 
                        fontFamily: 'monospace', 
                        fontWeight: 800, 
                        fontSize: 11.5, 
                        padding: '2px 6px', 
                        borderRadius: 4, 
                        background: '#FFF0E5', 
                        color: '#FF7900', 
                        border: '1px solid #FFD0B3' 
                      }}
                    >
                      {report.id}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>
                      {report.version || 'v1.0'}
                    </span>
                  </div>

                  <span 
                    className="tag"
                    style={{
                      backgroundColor: statusCfg.color + '15',
                      color: statusCfg.color,
                      border: `1px solid ${statusCfg.color}35`,
                      fontSize: 10.5,
                      fontWeight: 700
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusCfg.color, display: 'inline-block', marginRight: 4 }}></span>
                    {statusCfg.label}
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectReport(report)}
                  style={{ 
                    fontSize: 14, 
                    fontWeight: 800, 
                    color: 'var(--dark)', 
                    marginBottom: 6, 
                    cursor: 'pointer',
                    lineHeight: 1.4 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF7900'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark)'}
                >
                  {report.title}
                </h3>

                {/* Brands */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {(report.brands || []).map(b => getBrandChip(b))}
                </div>

                {/* Summary / Highlights */}
                <div 
                  style={{ 
                    fontSize: 11.5, 
                    color: '#4B5563', 
                    background: '#F9FAFB', 
                    padding: '8px 10px', 
                    borderRadius: 8, 
                    marginBottom: 12,
                    lineHeight: 1.5,
                    border: '1px solid #F3F4F6'
                  }}
                >
                  {report.summary ? (
                    report.summary.length > 110 ? report.summary.slice(0, 110) + '...' : report.summary
                  ) : (
                    'Rapport d’analyse consolidé, couverture cross-plateformes et livrables KPIs.'
                  )}
                </div>

                {/* Metadata details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={12} />
                    <span>Période : <strong>{report.period?.label || 'Août 2026'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>✍️</span>
                    <span>Analyste : <strong>{report.assignee?.name || 'Steve BESSOUBE'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                <button
                  type="button"
                  onClick={() => onSelectReport(report)}
                  className="btn btn-ghost btn-sm"
                  style={{ flex: 1, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11.5 }}
                >
                  <Eye size={13} />
                  <span>Consulter</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenExport(report)}
                  className="btn btn-ghost btn-sm"
                  style={{ flex: 1, border: '1px solid #FFD0B3', background: '#FFF8F2', color: '#FF7900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11.5 }}
                >
                  <Download size={13} />
                  <span>Exporter</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyLink(report.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px 8px', border: '1px solid #E5E7EB' }}
                  title="Copier le lien direct du rapport"
                >
                  {copiedId === report.id ? <Check size={13} style={{ color: '#27AE60' }} /> : <Share2 size={13} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
