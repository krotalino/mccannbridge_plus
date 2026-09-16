import { useState } from 'react';
import { 
  FileText, Download, Share2, Eye, Search, Filter, 
  CheckCircle2, Clock, Calendar, Sparkles, ExternalLink, 
  Layers, ArrowUpRight, Copy, Check, ShieldCheck, History
} from 'lucide-react';
import { REPORT_STATUSES, REPORT_TYPES, BRANDS_LIST } from '../../../data/reportsData';

export default function ReportLibraryView({
  reports,
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
        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
        style={{ backgroundColor: color + '15', color: color, border: `1px solid ${color}35` }}
      >
        {brandName.replace('Orange ', '')}
      </span>
    );
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-10">
      
      {/* En-tête de section (Style Influence) */}
      <div className="flex flex-wrap items-center justify-between gap-16 mb-16">
        <div className="flex items-center gap-10">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#FF7900',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255, 121, 0, 0.25)',
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
              3. Livrables & Fiches PDF — Bibliothèque Versionnée
            </h2>
            <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
              Répertoire certifié des rapports d'analyses, fiches téléchargeables, versioning v1/v2 et bilans de campagnes
            </p>
          </div>
        </div>

        {/* Boutons d'action rapide */}
        <div className="flex items-center gap-8 flex-wrap">
          <div className="flex items-center gap-4 text-xs font-bold text-muted bg-white p-2 rounded-lg border border-gray-200">
            <span className="flex items-center gap-1.5 text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {reports.filter(r => r.status === 'delivered' || r.status === 'approved').length} Validés / Livrés
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-orange-700">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              {reports.filter(r => r.status === 'client_review' || r.status === 'internal_review').length} En révision
            </span>
          </div>

          <button
            onClick={onCreateReport}
            className="btn btn-orange text-xs font-semibold flex items-center gap-6 px-14 py-8 rounded-lg shadow-sm"
          >
            <span>+</span>
            <span>Nouvelle Demande</span>
          </button>
        </div>
      </div>

      {/* Barre de Recherche & Filtres (Style inf-search-panel) */}
      <div className="inf-search-panel" style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 16 }}>
        <div className="inf-search-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Rechercher par titre, ID (REP-...), marque..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 2, minWidth: 240 }}
          />

          <select
            className="form-input"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            style={{ flex: 1, minWidth: 150 }}
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
            style={{ flex: 1, minWidth: 160 }}
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
            style={{ flex: 1, minWidth: 160 }}
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(REPORT_STATUSES).map(([k, s]) => (
              <option key={k} value={k}>{s.label}</option>
            ))}
          </select>

          {(searchQuery || selectedBrand !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('all');
                setSelectedType('all');
                setSelectedStatus('all');
              }}
              className="btn btn-ghost border"
              style={{ fontWeight: 600, fontSize: 12, padding: '8px 12px', background: '#fff' }}
            >
              ✕ Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => {
          const statusCfg = REPORT_STATUSES[report.status] || REPORT_STATUSES.draft;
          return (
            <div
              key={report.id}
              className="card p-16 flex flex-col justify-between transition-all hover:border-orange-400 hover:shadow-md"
              style={{ 
                background: '#fff', 
                borderRadius: 8, 
                border: '1px solid #e9ecef', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
              }}
            >
              <div>
                {/* Card Top: ID, Version, Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="font-mono font-bold text-xs px-2 py-0.5 rounded"
                      style={{ background: '#FFF0E5', color: 'var(--orange)', border: '1px solid #FFD0B3' }}
                    >
                      {report.id}
                    </span>
                    <span className="text-[10px] font-bold text-muted bg-gray-100 px-1.5 py-0.5 rounded">
                      {report.version || 'v1.0'}
                    </span>
                  </div>

                  <span
                    className="tag"
                    style={{
                      backgroundColor: statusCfg.color + '15',
                      color: statusCfg.color,
                      fontSize: 10,
                      fontWeight: 700
                    }}
                  >
                    {statusCfg.label}
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectReport(report)}
                  className="font-bold text-dark text-sm hover:text-[#FF7900] transition-colors cursor-pointer line-clamp-2 mb-2"
                >
                  {report.title}
                </h3>

                {/* Brands pills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {report.brands?.map(b => getBrandChip(b))}
                </div>

                {/* Key specs */}
                <div className="p-2 rounded-md bg-gray-50 text-xs space-y-1 mb-4 border border-gray-100">
                  <div className="flex justify-between text-muted">
                    <span>Période :</span>
                    <strong className="text-dark">{report.period?.label || 'Août 2026'}</strong>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Analyste :</span>
                    <span className="text-dark font-medium">{report.assignee?.name || 'Steve BESSOUBE'}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Échéance SLA :</span>
                    <span className="text-dark font-medium">{report.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyLink(report.id)}
                  className="btn btn-ghost text-xs text-muted hover:text-dark flex items-center gap-1 p-1.5"
                  title="Copier le lien direct du rapport"
                >
                  {copiedId === report.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  <span>{copiedId === report.id ? 'Copié !' : 'Partager'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenExport(report)}
                    className="btn btn-ghost border text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded"
                    style={{ background: '#fff' }}
                  >
                    <Download size={13} />
                    <span>PDF / XLS</span>
                  </button>

                  <button
                    onClick={() => onSelectReport(report)}
                    className="btn btn-orange text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded"
                  >
                    <Eye size={13} />
                    <span>Consulter</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="card p-24 text-center" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <FileText size={40} className="mx-auto text-muted mb-3 opacity-50" />
          <h3 className="text-base font-bold text-dark mb-1">Aucun rapport trouvé dans la bibliothèque</h3>
          <p className="text-xs text-muted max-w-md mx-auto">
            Ajustez vos filtres de recherche pour afficher les documents disponibles.
          </p>
        </div>
      )}

    </div>
  );
}
