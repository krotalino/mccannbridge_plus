import { useState } from 'react';
import { 
  Settings, Shield, Clock, Users, Building2, Layers, 
  Target, Globe, CheckCircle2, AlertTriangle, FileText, 
  Save, Plus, Trash2, Edit3, Key, Database, RefreshCw
} from 'lucide-react';
import { BRANDS_LIST, COMPETITORS_LIST, CHANNELS_LIST, REPORT_STATUSES, REPORT_TYPES } from '../../../data/reportsData';

export default function ReportAdminSettings() {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState('perimeters'); // perimeters | slas | workflow | roles
  const [brands, setBrands] = useState(BRANDS_LIST);
  const [competitors, setCompetitors] = useState(COMPETITORS_LIST);
  const [channels, setChannels] = useState(CHANNELS_LIST);
  const [isSaved, setIsSaved] = useState(false);

  // SLA config state
  const [slaConfigs, setSlaConfigs] = useState([
    { type: 'hebdomadaire', label: 'Rapport Hebdomadaire', target: 'J+2 ouvrés', deadlineTime: 'Mardi 10:00', alertHours: 24 },
    { type: 'mensuel', label: 'Rapport Mensuel Consolidé', target: 'J+5 ouvrés', deadlineTime: 'Le 5 du mois à 18:00', alertHours: 48 },
    { type: 'spontane', label: 'Rapport Spontané / Ad hoc', target: '24h à 72h', deadlineTime: 'Variable selon urgence', alertHours: 12 },
    { type: 'campagne', label: 'Rapport de Campagne', target: 'J+3 ouvrés', deadlineTime: 'Fin de vague à 17:00', alertHours: 24 },
    { type: 'benchmark', label: 'Rapport Benchmark Sectoriel', target: 'J+7 ouvrés', deadlineTime: 'Fin de quinzaine', alertHours: 48 },
    { type: 'executif', label: 'Rapport Exécutif Direction', target: 'J+4 ouvrés', deadlineTime: 'Avant séance du conseil', alertHours: 24 },
  ]);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const adminTabs = [
    { id: 'perimeters', label: 'Périmètres & Marques', icon: <Building2 size={14} /> },
    { id: 'slas', label: 'SLA & Délais de Livraison', icon: <Clock size={14} /> },
    { id: 'workflow', label: 'Workflow (12 étapes)', icon: <Shield size={14} /> },
    { id: 'roles', label: 'Rôles & Habilitations', icon: <Users size={14} /> }
  ];

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
            <Settings size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
              Administration & Gouvernance du Module Reporting
            </h2>
            <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
              Paramétrage des entités de marque, concurrents, délais contractuels SLA et règles d'approbation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="btn btn-orange text-xs font-semibold flex items-center gap-6 px-14 py-8 rounded-lg shadow-sm"
        >
          {isSaved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          <span>{isSaved ? 'Modifications enregistrées !' : 'Enregistrer les paramètres'}</span>
        </button>
      </div>

      {/* Barre de sous-onglets Admin (Style Influence tab-bar) */}
      <div className="tab-bar mb-16 flex flex-wrap gap-4" style={{ background: '#fff', padding: '6px 12px', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {adminTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveAdminSubTab(t.id)}
            className={`tab-item ${activeAdminSubTab === t.id ? 'active' : ''}`}
            style={{ fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Perimeters */}
      {activeAdminSubTab === 'perimeters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Brands Card */}
          <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
              <Building2 size={16} className="text-[#FF7900]" />
              Entités de Marque Orange Cameroun ({brands.length})
            </h3>
            <div className="space-y-2">
              {brands.map(b => (
                <div key={b.id} className="p-3 rounded-lg border border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                    <span className="text-xs font-bold text-dark">{b.name}</span>
                  </div>
                  <span className="tag" style={{ background: b.color + '15', color: b.color, fontSize: 10, fontWeight: 700 }}>
                    Actif
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Competitors Card */}
          <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
              <Target size={16} className="text-[#FF7900]" />
              Concurrents Surveillés au Benchmark ({competitors.length})
            </h3>
            <div className="space-y-2">
              {competitors.map(c => (
                <div key={c.id} className="p-3 rounded-lg border border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <div className="text-xs font-bold text-dark">{c.name}</div>
                    <div className="text-[11px] text-muted">{c.type || 'Opérateur Télécoms'}</div>
                  </div>
                  <span className="tag" style={{ background: '#0099FF15', color: '#0099FF', fontSize: 10, fontWeight: 700 }}>
                    Monitoring Actif
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: SLAs */}
      {activeAdminSubTab === 'slas' && (
        <div className="card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-dark flex items-center gap-2">
              <Clock size={16} className="text-[#FF7900]" />
              Matrice Contractuelle des Engagements SLA McCann × Orange Cameroun
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                  <th className="py-10 px-12 text-xs font-bold text-muted uppercase tracking-wider text-left">Type de Livrable</th>
                  <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-left">Délai Contractuel</th>
                  <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-left">Heure Limite de Remise</th>
                  <th className="py-10 px-8 text-xs font-bold text-muted uppercase tracking-wider text-center">Seuil Alerte Proactive</th>
                  <th className="py-10 px-12 text-xs font-bold text-muted uppercase tracking-wider text-right">Statut Accord</th>
                </tr>
              </thead>
              <tbody>
                {slaConfigs.map((sla, idx) => (
                  <tr key={idx} className="border-b hover:bg-orange-50/20 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                    <td className="py-12 px-12 font-bold text-dark text-xs">{sla.label}</td>
                    <td className="py-12 px-8">
                      <span className="tag" style={{ background: '#FF790018', color: '#FF7900', fontSize: 11, fontWeight: 700 }}>
                        {sla.target}
                      </span>
                    </td>
                    <td className="py-12 px-8 text-xs text-dark font-medium">{sla.deadlineTime}</td>
                    <td className="py-12 px-8 text-center text-xs text-muted font-mono">{sla.alertHours}h avant</td>
                    <td className="py-12 px-12 text-right">
                      <span className="tag" style={{ background: '#28A74518', color: '#28A745', fontSize: 10, fontWeight: 700 }}>
                        ✓ Validé Copil
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Workflow */}
      {activeAdminSubTab === 'workflow' && (
        <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2">
            <Shield size={16} className="text-[#FF7900]" />
            Workflow d'Approbation en 12 Étapes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(REPORT_STATUSES).map(([key, st], index) => (
              <div key={key} className="p-3 rounded-lg border border-gray-100 bg-gray-50 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs" style={{ background: st.color + '20', color: st.color }}>
                  {index + 1}
                </span>
                <div>
                  <div className="text-xs font-bold text-dark">{st.label}</div>
                  <div className="text-[10px] text-muted font-mono">{key}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Roles */}
      {activeAdminSubTab === 'roles' && (
        <div className="card p-20" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2">
            <Users size={16} className="text-[#FF7900]" />
            Matrice des Habilitations RBAC (McCann Agence vs Orange Client)
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-gray-100 bg-orange-50/30">
              <div className="font-bold text-[#FF7900] mb-1">Équipe Agence McCann (Analystes & Media Planners)</div>
              <p className="text-muted leading-relaxed">
                Création des demandes, saisie des données Data Studio, calculs de KPIs, transmission pour revue interne et proposition de livrables finaux.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-gray-100 bg-blue-50/30">
              <div className="font-bold text-[#0099FF] mb-1">Direction de Marque Orange Cameroun (Validateurs Métier)</div>
              <p className="text-muted leading-relaxed">
                Émission des briefs de rapports, formulation des questions business, validation finale des livrables ou demande d'ajustements / correctifs.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
