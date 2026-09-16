import { useState } from 'react';
import { 
  Plus, Download, Upload, Trash2, Edit2, Search, 
  ExternalLink, BarChart3, TrendingUp, CheckCircle, Sparkles, X,
  Layers, Flame, Activity
} from 'lucide-react';
import { BRANDS_LIST, CHANNELS_LIST } from '../../../data/reportsData';

export default function ReportDataStudio({
  report,
  reports = [],
  onSelectReport,
  onAddSpeech,
  onUpdateData,
  isAgency
}) {
  const currentReport = report || (reports.length > 0 ? reports[0] : null);
  const speeches = currentReport?.data?.speeches || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Speech Form State
  const [newSpeech, setNewSpeech] = useState({
    id: `SP-${Date.now().toString().slice(-4)}`,
    brand: currentReport?.brands?.[0] || 'Orange TELCO',
    name: '',
    channel: 'Facebook',
    format: 'Vidéo Courte / Reel',
    objective: 'Engagement',
    date: new Date().toISOString().slice(0, 10),
    reach: 120000,
    impressions: 165000,
    engagements: 8500,
    engagementRate: 5.15,
    videoViews: 65000,
    clicks: 1200,
    conversions: 450,
    sentiment: '85% Positif',
    isPaid: true,
    spend: 150000,
    insight: 'Bonne dynamique sur l’accroche initiale avec un fort taux de rétention.'
  });

  const filteredSpeeches = speeches.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.format.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || s.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  // Totals
  const totalReach = speeches.reduce((acc, s) => acc + (s.reach || 0), 0);
  const totalImpressions = speeches.reduce((acc, s) => acc + (s.impressions || 0), 0);
  const totalEngagements = speeches.reduce((acc, s) => acc + (s.engagements || 0), 0);
  const avgEngagementRate = speeches.length > 0 
    ? (speeches.reduce((acc, s) => acc + (s.engagementRate || 0), 0) / speeches.length).toFixed(2) 
    : 0;

  const handleSaveSpeech = (e) => {
    e.preventDefault();
    if (!newSpeech.name.trim() || !currentReport) return;

    if (onAddSpeech) {
      onAddSpeech(currentReport.id, {
        ...newSpeech,
        reach: Number(newSpeech.reach),
        impressions: Number(newSpeech.impressions),
        engagements: Number(newSpeech.engagements),
        engagementRate: Number(newSpeech.engagementRate),
        videoViews: Number(newSpeech.videoViews),
        clicks: Number(newSpeech.clicks),
        conversions: Number(newSpeech.conversions),
        spend: Number(newSpeech.spend)
      });
    }

    setIsModalOpen(false);
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
            <BarChart3 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
              4. Prises de Parole & Formats — Saisie & Suivi des Publications
            </h2>
            <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
              Inventaire exhaustif des publications, formats de contenus, impressions, interactions et conversions
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-8 flex-wrap">
          {reports.length > 1 && onSelectReport && (
            <select
              className="form-input text-xs font-bold"
              value={currentReport?.id || ''}
              onChange={(e) => {
                const target = reports.find(r => r.id === e.target.value);
                if (target) onSelectReport(target);
              }}
              style={{ minWidth: 220, background: '#fff' }}
            >
              {reports.map(r => (
                <option key={r.id} value={r.id}>{r.id} - {r.title.slice(0, 35)}...</option>
              ))}
            </select>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-orange text-xs font-semibold flex items-center gap-6 px-14 py-8 rounded-lg shadow-sm"
          >
            <Plus size={15} />
            <span>Ajouter une Publication</span>
          </button>
        </div>
      </div>

      {/* 4 Macro KPI Cards (Style Influence) */}
      <div className="grid grid-4 gap-12 mb-16">
        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #FF7900', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Total Prises de Parole</div>
          <div className="text-xl font-bold text-dark">
            {speeches.length} <span className="text-xs font-normal text-muted">formats enregistrés</span>
          </div>
        </div>

        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #0099FF', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Portée Cumulée (Reach)</div>
          <div className="text-xl font-bold" style={{ color: '#0099FF' }}>
            {totalReach.toLocaleString('fr-FR')} <span className="text-xs font-normal text-muted">personnes</span>
          </div>
        </div>

        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #28A745', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Volume d'Impressions</div>
          <div className="text-xl font-bold" style={{ color: '#28A745' }}>
            {totalImpressions.toLocaleString('fr-FR')} <span className="text-xs font-normal text-muted">vues</span>
          </div>
        </div>

        <div className="card p-12" style={{ background: '#fff', borderRadius: 8, borderLeft: '4px solid #6C757D', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="text-xs text-muted font-bold uppercase tracking-wider mb-4">Taux d'Engagement Moyen</div>
          <div className="text-xl font-bold text-dark">
            {avgEngagementRate} % <span className="text-xs font-normal text-green-600 font-bold">↑ Supérieur au benchmark</span>
          </div>
        </div>
      </div>

      {/* Barre de Recherche & Filtres (Style inf-search-panel) */}
      <div className="inf-search-panel" style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 16 }}>
        <div className="inf-search-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Filtrer par nom de publication, canal ou format..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 2, minWidth: 240 }}
          />

          <select
            className="form-input"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            style={{ flex: 1, minWidth: 160 }}
          >
            <option value="all">Toutes les entités de marque</option>
            {BRANDS_LIST.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Détaillée des Livrables (Style Influence) */}
      <div className="card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                <th className="py-10 px-12 text-xs font-bold text-muted uppercase tracking-wider text-left">Publication & Date</th>
                <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-left">Marque & Canal</th>
                <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-left">Format & Objectif</th>
                <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-right">Reach</th>
                <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-right">Impressions</th>
                <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-right">Interactions</th>
                <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-right">Taux Eng.</th>
                <th className="py-10 px-12 text-xs font-bold text-muted uppercase tracking-wider text-center">Type Paid</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpeeches.map((sp) => (
                <tr key={sp.id} className="border-b hover:bg-orange-50/20 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                  <td className="py-12 px-12">
                    <div className="font-bold text-dark text-xs">{sp.name}</div>
                    <div className="text-[11px] text-muted mt-0.5">{sp.date} • {sp.id}</div>
                  </td>
                  <td className="py-12 px-8">
                    <div className="text-xs font-bold text-dark">{sp.brand}</div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {sp.channel}
                    </span>
                  </td>
                  <td className="py-12 px-8">
                    <div className="text-xs font-medium text-dark">{sp.format}</div>
                    <div className="text-[11px] text-muted">{sp.objective}</div>
                  </td>
                  <td className="py-12 px-8 text-right font-mono text-xs font-bold text-dark">
                    {(sp.reach || 0).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-12 px-8 text-right font-mono text-xs text-muted">
                    {(sp.impressions || 0).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-12 px-8 text-right font-mono text-xs font-bold" style={{ color: '#FF7900' }}>
                    {(sp.engagements || 0).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-12 px-8 text-right font-mono text-xs font-black text-green-700">
                    {sp.engagementRate}%
                  </td>
                  <td className="py-12 px-12 text-center">
                    {sp.isPaid ? (
                      <span className="tag" style={{ background: '#FF790018', color: '#FF7900', fontSize: 10, fontWeight: 700 }}>
                        Sponsorisé
                      </span>
                    ) : (
                      <span className="tag" style={{ background: '#28A74518', color: '#28A745', fontSize: 10, fontWeight: 700 }}>
                        Organique
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout de publication (Style Influence) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-xl w-full overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-base font-bold text-dark flex items-center gap-2">
                <Plus size={18} className="text-[#FF7900]" />
                Ajouter une Prise de Parole / Publication
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-dark text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSpeech} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-dark mb-1">Titre de la publication / Post *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lancement Forfaits Maxit 4G+ Campus"
                  className="form-input w-full"
                  value={newSpeech.name}
                  onChange={(e) => setNewSpeech({ ...newSpeech, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-dark mb-1">Entité de Marque</label>
                  <select
                    className="form-input w-full"
                    value={newSpeech.brand}
                    onChange={(e) => setNewSpeech({ ...newSpeech, brand: e.target.value })}
                  >
                    {BRANDS_LIST.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark mb-1">Canal de diffusion</label>
                  <select
                    className="form-input w-full"
                    value={newSpeech.channel}
                    onChange={(e) => setNewSpeech({ ...newSpeech, channel: e.target.value })}
                  >
                    {CHANNELS_LIST.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-dark mb-1">Reach (Portée)</label>
                  <input
                    type="number"
                    className="form-input w-full"
                    value={newSpeech.reach}
                    onChange={(e) => setNewSpeech({ ...newSpeech, reach: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark mb-1">Impressions</label>
                  <input
                    type="number"
                    className="form-input w-full"
                    value={newSpeech.impressions}
                    onChange={(e) => setNewSpeech({ ...newSpeech, impressions: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark mb-1">Interactions</label>
                  <input
                    type="number"
                    className="form-input w-full"
                    value={newSpeech.engagements}
                    onChange={(e) => setNewSpeech({ ...newSpeech, engagements: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost border px-4 py-2 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-orange px-4 py-2 text-xs font-bold"
                >
                  Enregistrer la Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
