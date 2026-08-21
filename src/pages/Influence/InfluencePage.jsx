import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProfileModal, EditModal } from './InfluenceModals';

// Nouveaux composants de rubriques métier
import InfluenceFiche from './sections/InfluenceFiche';
import InfluenceContrats from './sections/InfluenceContrats';
import InfluenceCahierCharges from './sections/InfluenceCahierCharges';
import InfluencePerformance from './sections/InfluencePerformance';
import InfluenceHistorique from './sections/InfluenceHistorique';
import InfluenceFinance from './sections/InfluenceFinance';

export default function InfluencePage() {
  const [tab, setTab] = useState('fiche');
  const { influencers = [], addInfluencer, updateInfluencer, deleteInfluencer } = useApp();
  const [profileInf, setProfileInf] = useState(null);
  const [editInf, setEditInf] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState({
    text: '', niche: '', platform: '', type: '', region: '', engagement: '', disponibilite: '', status: ''
  });

  const tabs = [
    { id: 'fiche', label: '1. Fiche Influence' },
    { id: 'contrats', label: '2. Contrats' },
    { id: 'cahier', label: '3. Cahier des charges' },
    { id: 'performance', label: '4. Performance & KPIs' },
    { id: 'historique', label: '5. Historique campagnes' },
    { id: 'finance', label: '6. Budgets & Paiements' },
  ];

  const handleSave = async (form) => {
    if (form.id) {
      await updateInfluencer(form.id, form);
    } else {
      const newId = `INF-${Date.now().toString().slice(-6)}`;
      await addInfluencer({ ...form, id: newId });
    }
    setEditInf(null);
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer cet influenceur ?')) {
      await deleteInfluencer(id);
      setProfileInf(null);
    }
  };

  const handleSetInfluencers = async (updaterOrList) => {
    if (typeof updaterOrList === 'function') {
      const updatedList = updaterOrList(influencers);
      for (const inf of updatedList) {
        const old = influencers.find(i => String(i.id) === String(inf.id));
        if (!old) {
          await addInfluencer(inf);
        } else if (JSON.stringify(old) !== JSON.stringify(inf)) {
          await updateInfluencer(inf.id, inf);
        }
      }
      for (const old of influencers) {
        if (!updatedList.some(i => String(i.id) === String(old.id))) {
          await deleteInfluencer(old.id);
        }
      }
    } else if (Array.isArray(updaterOrList)) {
      for (const inf of updaterOrList) {
        await updateInfluencer(inf.id, inf);
      }
    }
  };

  return (
    <div>
      {/* Barre d'onglets principale avec les 6 nouvelles rubriques */}
      <div className="tab-bar mb-20 flex flex-wrap gap-4" style={{ background: '#fff', padding: '6px 12px', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tab-item ${tab === t.id ? 'active' : ''}`}
            style={{ fontWeight: 700, fontSize: 13 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Rendu dynamique des rubriques */}
      {tab === 'fiche' && (
        <InfluenceFiche
          influencers={influencers}
          onViewProfile={(inf) => setProfileInf(inf)}
          onEdit={(inf) => setEditInf(inf)}
          onDelete={handleDelete}
          onAdd={() => setShowAdd(true)}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {tab === 'contrats' && (
        <InfluenceContrats
          influencers={influencers}
          setInfluencers={handleSetInfluencers}
        />
      )}

      {tab === 'cahier' && (
        <InfluenceCahierCharges
          influencers={influencers}
          setInfluencers={handleSetInfluencers}
        />
      )}

      {tab === 'performance' && (
        <InfluencePerformance
          influencers={influencers}
          setInfluencers={handleSetInfluencers}
        />
      )}

      {tab === 'historique' && (
        <InfluenceHistorique
          influencers={influencers}
          setInfluencers={handleSetInfluencers}
        />
      )}

      {tab === 'finance' && (
        <InfluenceFinance
          influencers={influencers}
          setInfluencers={handleSetInfluencers}
        />
      )}

      {/* Modals de détail et d'édition globale */}
      {profileInf && (
        <ProfileModal
          inf={profileInf}
          onClose={() => setProfileInf(null)}
          onEdit={(inf) => { setProfileInf(null); setEditInf(inf); }}
          onDelete={handleDelete}
        />
      )}

      {editInf && (
        <EditModal
          inf={editInf}
          onClose={() => setEditInf(null)}
          onSave={handleSave}
        />
      )}

      {showAdd && (
        <EditModal
          inf={null}
          onClose={() => setShowAdd(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
