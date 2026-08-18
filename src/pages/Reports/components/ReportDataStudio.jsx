import { useState } from 'react';
import { 
  Plus, Download, Upload, Trash2, Edit2, Search, 
  ExternalLink, BarChart3, TrendingUp, CheckCircle, Sparkles, X 
} from 'lucide-react';
import { BRANDS_LIST, CHANNELS_LIST } from '../../../data/reportsData';

export default function ReportDataStudio({
  report,
  onAddSpeech,
  onUpdateData,
  isAgency
}) {
  const speeches = report.data?.speeches || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Speech Form State
  const [newSpeech, setNewSpeech] = useState({
    id: `SP-${Date.now().toString().slice(-4)}`,
    brand: report.brands?.[0] || 'Orange TELCO',
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
    insight: 'Bonne dynamique sur l’accroche initiale avec un taux de rétention élevé.'
  });

  const filteredSpeeches = speeches.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.format.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || s.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  // Calculate totals
  const totalReach = speeches.reduce((acc, s) => acc + (s.reach || 0), 0);
  const totalImpressions = speeches.reduce((acc, s) => acc + (s.impressions || 0), 0);
  const totalEngagements = speeches.reduce((acc, s) => acc + (s.engagements || 0), 0);
  const avgEngagementRate = speeches.length > 0 
    ? (speeches.reduce((acc, s) => acc + (s.engagementRate || 0), 0) / speeches.length).toFixed(2) 
    : 0;

  const handleSaveSpeech = (e) => {
    e.preventDefault();
    if (!newSpeech.name.trim()) return;

    onAddSpeech(report.id, {
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

    setIsModalOpen(false);
    setNewSpeech({
      id: `SP-${Date.now().toString().slice(-4)}`,
      brand: report.brands?.[0] || 'Orange TELCO',
      name: '',
      channel: 'Facebook',
      format: 'Vidéo Courte / Reel',
      objective: 'Engagement',
      date: new Date().toISOString().slice(0, 10),
      reach: 100000,
      impressions: 140000,
      engagements: 6000,
      engagementRate: 4.28,
      videoViews: 40000,
      clicks: 800,
      conversions: 200,
      sentiment: '80% Positif',
      isPaid: true,
      spend: 100000,
      insight: ''
    });
  };

  const handleExportSpeechesCsv = () => {
    const headers = ['ID', 'Marque', 'Nom Prise de Parole', 'Canal', 'Format', 'Objectif', 'Portée (Reach)', 'Impressions', 'Engagements', 'Taux Engagement (%)', 'Conversions', 'Type (Paid/Org)', 'Insight Analyste'];
    const rows = speeches.map(s => [
      s.id,
      `"${s.brand}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      s.channel,
      `"${s.format}"`,
      s.objective,
      s.reach,
      s.impressions,
      s.engagements,
      s.engagementRate,
      s.conversions || 0,
      s.isPaid ? 'Sponsorisé' : 'Organique',
      `"${(s.insight || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Speeches_${report.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      
      {/* Studio Header & Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
          <div className="text-[10px] text-gray-500 font-semibold uppercase">Total Prises de Parole</div>
          <div className="text-xl font-extrabold text-gray-900 mt-1">{speeches.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
          <div className="text-[10px] text-gray-500 font-semibold uppercase">Reach Cumulé</div>
          <div className="text-xl font-extrabold text-gray-900 mt-1 font-mono">
            {totalReach.toLocaleString('fr-FR')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
          <div className="text-[10px] text-gray-500 font-semibold uppercase">Impressions Totales</div>
          <div className="text-xl font-extrabold text-gray-900 mt-1 font-mono">
            {totalImpressions.toLocaleString('fr-FR')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
          <div className="text-[10px] text-gray-500 font-semibold uppercase">Taux Eng. Moyen</div>
          <div className="text-xl font-extrabold text-orange-600 mt-1">
            {avgEngagementRate}%
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrer les prises de parole..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium"
          >
            <option value="all">Toutes les marques</option>
            {BRANDS_LIST.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportSpeechesCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          {isAgency && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>Ajouter une Prise de Parole</span>
            </button>
          )}
        </div>
      </div>

      {/* Speeches Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 uppercase text-[10px]">
                <th className="py-3 px-3">Prise de Parole</th>
                <th className="py-3 px-3">Marque & Canal</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Portée</th>
                <th className="py-3 px-3">Impressions</th>
                <th className="py-3 px-3">Engagements</th>
                <th className="py-3 px-3">Taux Eng.</th>
                <th className="py-3 px-3">Vues Vidéo</th>
                <th className="py-3 px-3">Conversions</th>
                <th className="py-3 px-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredSpeeches.map((sp) => (
                <tr key={sp.id} className="hover:bg-orange-50/20">
                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] font-bold text-orange-600 bg-orange-50 px-1 py-0.5 rounded mr-1.5">
                      {sp.id}
                    </span>
                    <strong className="text-gray-900">{sp.name}</strong>
                    {sp.insight && (
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{sp.insight}</p>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-gray-800">{sp.brand}</div>
                    <div className="text-[11px] text-gray-500">{sp.channel}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      {sp.format}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono font-medium">{sp.reach?.toLocaleString('fr-FR')}</td>
                  <td className="py-3 px-3 font-mono text-gray-500">{sp.impressions?.toLocaleString('fr-FR')}</td>
                  <td className="py-3 px-3 font-mono font-semibold">{sp.engagements?.toLocaleString('fr-FR')}</td>
                  
                  <td className="py-3 px-3">
                    <span className="font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                      {sp.engagementRate}%
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-gray-600">{sp.videoViews ? sp.videoViews.toLocaleString('fr-FR') : '—'}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-700">{sp.conversions ? sp.conversions.toLocaleString('fr-FR') : '—'}</td>

                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sp.isPaid ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {sp.isPaid ? 'Sponsorisé' : 'Organique'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Speech Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Ajouter une Prise de Parole & Données Brutes
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSpeech} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Marque *</label>
                  <select
                    value={newSpeech.brand}
                    onChange={(e) => setNewSpeech({ ...newSpeech, brand: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  >
                    {BRANDS_LIST.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Canal *</label>
                  <select
                    value={newSpeech.channel}
                    onChange={(e) => setNewSpeech({ ...newSpeech, channel: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  >
                    {CHANNELS_LIST.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom / Sujet du Post *</label>
                <input
                  type="text"
                  required
                  value={newSpeech.name}
                  onChange={(e) => setNewSpeech({ ...newSpeech, name: e.target.value })}
                  placeholder="Ex: Reel Tutoriel Transfert Orange Money vers Carte Visa"
                  className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Portée (Reach) *</label>
                  <input
                    type="number"
                    value={newSpeech.reach}
                    onChange={(e) => setNewSpeech({ ...newSpeech, reach: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Impressions *</label>
                  <input
                    type="number"
                    value={newSpeech.impressions}
                    onChange={(e) => setNewSpeech({ ...newSpeech, impressions: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Engagements *</label>
                  <input
                    type="number"
                    value={newSpeech.engagements}
                    onChange={(e) => setNewSpeech({ ...newSpeech, engagements: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Taux Eng. (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSpeech.engagementRate}
                    onChange={(e) => setNewSpeech({ ...newSpeech, engagementRate: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Vues Vidéo</label>
                  <input
                    type="number"
                    value={newSpeech.videoViews}
                    onChange={(e) => setNewSpeech({ ...newSpeech, videoViews: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Conversions</label>
                  <input
                    type="number"
                    value={newSpeech.conversions}
                    onChange={(e) => setNewSpeech({ ...newSpeech, conversions: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Enseignement & Analyse Analyste</label>
                <textarea
                  rows={2}
                  value={newSpeech.insight}
                  onChange={(e) => setNewSpeech({ ...newSpeech, insight: e.target.value })}
                  placeholder="Pourquoi cette prise de parole a performé ?"
                  className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
