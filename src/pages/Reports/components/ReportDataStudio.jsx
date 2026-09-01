import { useState } from 'react';
import { 
  Plus, Download, Upload, Trash2, Edit2, Search, 
  ExternalLink, BarChart3, TrendingUp, CheckCircle, Sparkles, X,
  Layers, Flame, Activity
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
    <div className="space-y-6">
      
      {/* Studio Header & Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl cosmic-glass-card text-center border border-white/10">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Prises de Parole</div>
          <div className="text-2xl font-black text-white mt-1">{speeches.length}</div>
        </div>

        <div className="p-4 rounded-2xl cosmic-glass-card text-center border border-white/10">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Reach Cumulé</div>
          <div className="text-2xl font-black text-[#00D4FF] mt-1 font-mono">
            {totalReach.toLocaleString('fr-FR')}
          </div>
        </div>

        <div className="p-4 rounded-2xl cosmic-glass-card text-center border border-white/10">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Impressions Totales</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            {totalImpressions.toLocaleString('fr-FR')}
          </div>
        </div>

        <div className="p-4 rounded-2xl cosmic-glass-card text-center border border-[#FF6600]/30 shadow-[0_0_20px_rgba(255,102,0,0.15)]">
          <div className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">Taux Eng. Moyen</div>
          <div className="text-2xl font-black text-[#FF6600] mt-1">
            {avgEngagementRate}%
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="p-4 rounded-2xl cosmic-glass-card flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/10">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrer les prises de parole..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl cosmic-glass-input text-white"
            />
          </div>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl cosmic-glass-input cursor-pointer"
          >
            <option value="all" className="bg-[#0A0E27] text-white">Toutes les marques</option>
            {BRANDS_LIST.map(b => (
              <option key={b.id} value={b.name} className="bg-[#0A0E27] text-white">{b.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportSpeechesCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white cosmic-btn-glass rounded-xl cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          {isAgency && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black cosmic-btn-primary rounded-xl shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Ajouter Prise de Parole</span>
            </button>
          )}
        </div>
      </div>

      {/* Speeches Table */}
      <div className="rounded-2xl cosmic-glass-card overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/40 text-slate-400 font-extrabold border-b border-white/10 uppercase text-[10px]">
                <th className="py-3.5 px-4">Prise de Parole</th>
                <th className="py-3.5 px-3">Marque & Canal</th>
                <th className="py-3.5 px-3">Format</th>
                <th className="py-3.5 px-3">Portée</th>
                <th className="py-3.5 px-3">Impressions</th>
                <th className="py-3.5 px-3">Engagements</th>
                <th className="py-3.5 px-3">Taux Eng.</th>
                <th className="py-3.5 px-3">Vues Vidéo</th>
                <th className="py-3.5 px-3">Conversions</th>
                <th className="py-3.5 px-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredSpeeches.map((sp) => (
                <tr key={sp.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] font-black text-[#FF6600] bg-[#FF6600]/15 px-1.5 py-0.5 rounded mr-1.5 border border-[#FF6600]/30">
                      {sp.id}
                    </span>
                    <strong className="text-white font-bold">{sp.name}</strong>
                    {sp.insight && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{sp.insight}</p>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{sp.brand}</div>
                    <div className="text-[11px] text-slate-400">{sp.channel}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                      {sp.format}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-white">{sp.reach?.toLocaleString('fr-FR')}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">{sp.impressions?.toLocaleString('fr-FR')}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#00D4FF]">{sp.engagements?.toLocaleString('fr-FR')}</td>
                  
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-[#FF8C00] bg-[#FF6600]/15 px-2 py-0.5 rounded border border-[#FF6600]/30">
                      {sp.engagementRate}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-300">{sp.videoViews ? sp.videoViews.toLocaleString('fr-FR') : '—'}</td>
                  <td className="py-3.5 px-3 font-mono font-black text-emerald-400">{sp.conversions ? sp.conversions.toLocaleString('fr-FR') : '—'}</td>

                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      sp.isPaid ? 'bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="cosmic-glass-card rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-white/20 bg-[#0A0E27]/95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="text-base font-black text-white">
                Ajouter une Prise de Parole & Données Brutes
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSpeech} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Marque *</label>
                  <select
                    value={newSpeech.brand}
                    onChange={(e) => setNewSpeech({ ...newSpeech, brand: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input cursor-pointer"
                  >
                    {BRANDS_LIST.map(b => (
                      <option key={b.id} value={b.name} className="bg-[#0A0E27] text-white">{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Canal *</label>
                  <select
                    value={newSpeech.channel}
                    onChange={(e) => setNewSpeech({ ...newSpeech, channel: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input cursor-pointer"
                  >
                    {CHANNELS_LIST.map(c => (
                      <option key={c.id} value={c.name} className="bg-[#0A0E27] text-white">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nom / Sujet du Post *</label>
                <input
                  type="text"
                  required
                  value={newSpeech.name}
                  onChange={(e) => setNewSpeech({ ...newSpeech, name: e.target.value })}
                  placeholder="Ex: Reel Tutoriel Transfert Orange Money vers Carte Visa"
                  className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Portée (Reach) *</label>
                  <input
                    type="number"
                    value={newSpeech.reach}
                    onChange={(e) => setNewSpeech({ ...newSpeech, reach: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Impressions *</label>
                  <input
                    type="number"
                    value={newSpeech.impressions}
                    onChange={(e) => setNewSpeech({ ...newSpeech, impressions: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Engagements *</label>
                  <input
                    type="number"
                    value={newSpeech.engagements}
                    onChange={(e) => setNewSpeech({ ...newSpeech, engagements: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Taux Eng. (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSpeech.engagementRate}
                    onChange={(e) => setNewSpeech({ ...newSpeech, engagementRate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Vues Vidéo</label>
                  <input
                    type="number"
                    value={newSpeech.videoViews}
                    onChange={(e) => setNewSpeech({ ...newSpeech, videoViews: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Conversions</label>
                  <input
                    type="number"
                    value={newSpeech.conversions}
                    onChange={(e) => setNewSpeech({ ...newSpeech, conversions: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Enseignement & Analyse Analyste</label>
                <textarea
                  rows={2}
                  value={newSpeech.insight}
                  onChange={(e) => setNewSpeech({ ...newSpeech, insight: e.target.value })}
                  placeholder="Pourquoi cette prise de parole a performé ?"
                  className="w-full text-xs p-2.5 rounded-xl cosmic-glass-input text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl cosmic-btn-glass text-xs font-bold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl cosmic-btn-primary text-xs font-bold cursor-pointer"
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
