import { useApp } from '../../context/AppContext';
import { TEAM } from '../../data/team';

export default function ValidationPage() {
  const { calendar, validateCalendarItem, rejectCalendarItem } = useApp();
  const pendingItems = calendar.map((item, idx) => ({ ...item, globalIdx: idx })).filter(c => c.status === 'pending');

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-4">✅ Validation Client</h1>
      <p className="text-base text-muted mb-8">File de validation classée par l'IA Traffic — contenus urgents en premier</p>

      <div className="ai-banner mb-20">
        🤖 « {pendingItems.length} productions en attente de validation. Les 2 premières bloquent le calendrier de lundi. Temps estimé de validation : 3 min. »
      </div>

      {pendingItems.length === 0 ? (
        <div className="card text-center" style={{ padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div className="text-lg font-semibold text-green">Tout est validé !</div>
          <div className="text-sm text-muted mt-4">Aucun contenu en attente de validation client</div>
        </div>
      ) : (
        pendingItems.map(item => {
          const cm = TEAM.cm.find(c => c.id === item.cm);
          return (
            <div key={item.globalIdx} className="card mb-16 animate-fade" style={{ borderLeft: '4px solid var(--red)' }}>
              <div className="val-card-layout">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="tag tag-red mb-8">⚡ Bloque le calendrier</span>
                  <h3 className="text-lg font-bold text-dark" style={{ marginTop: 8, marginBottom: 4 }}>{item.content}</h3>
                  <div className="text-sm text-muted">📱 {item.platform} • {item.day} • CM : {cm?.name || '—'}</div>
                  <div className="text-sm text-muted mt-4">Sponsoring : {item.sponsoring > 0 ? (item.sponsoring / 1000).toFixed(0) + 'K FCFA' : 'Non sponsorisé'}</div>
                  <div style={{ background: '#f5f5f5', borderRadius: 6, padding: 12, marginTop: 12, fontSize: 12 }}>
                    <div className="font-semibold text-orange text-sm mb-4">APERÇU DU CONTENU</div>
                    Contenu prêt pour publication. Visuel validé en interne. CTA vérifié ✓. Relecture croisée effectuée ✓.
                  </div>
                </div>
                <div className="val-preview-box">
                  [Aperçu visuel]
                </div>
              </div>
              <div className="val-actions-row">
                <button onClick={() => validateCalendarItem(item.globalIdx, item.content)} className="btn btn-green">✓ Approuver</button>
                <button className="btn btn-ghost">✎ Demander modification</button>
                <button onClick={() => rejectCalendarItem(item.globalIdx, item.content)} className="btn btn-red">✕ Rejeter</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
