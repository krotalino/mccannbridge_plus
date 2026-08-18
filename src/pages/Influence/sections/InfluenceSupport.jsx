export default function InfluenceSupport() {
  return (
    <div className="grid grid-2 gap-20">
      <div>
        <h2 className="text-xl font-bold text-dark mb-16">Support & Chat Influenceurs</h2>
        
        <div className="card shadow-sm mb-16 p-0" style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
          <div className="p-16 border-b" style={{ borderColor: '#f1f1f1', background: '#fafafa' }}>
            <h3 className="font-bold text-dark">Chat Actif : @DianaBouli</h3>
            <p className="text-xs text-muted">Campagne: Brand Awareness Q2</p>
          </div>
          
          <div className="p-16 flex-1" style={{ overflowY: 'auto', background: '#fff' }}>
            <div className="flex mb-12">
              <div className="bg-gray-100 p-12 rounded-lg" style={{ maxWidth: '80%', borderRadius: '16px 16px 16px 0', background: '#f1f1f1' }}>
                <p className="text-sm">Hello l'équipe, est-ce que je peux publier la story ce soir à 19h au lieu de 18h ? Mon audience est plus active.</p>
                <span className="text-xs text-muted mt-4 block">10:42 AM</span>
              </div>
            </div>
            
            <div className="flex mb-12 justify-end">
              <div className="bg-orange text-white p-12 rounded-lg" style={{ maxWidth: '80%', borderRadius: '16px 16px 0 16px', background: 'var(--orange)', color: '#fff' }}>
                <p className="text-sm">Bonjour Diana, oui c'est parfait pour 19h ! N'oublie pas d'ajouter le sticker lien.</p>
                <span className="text-xs text-white opacity-75 mt-4 block text-right">10:45 AM</span>
              </div>
            </div>
          </div>
          
          <div className="p-16 border-t flex gap-8" style={{ borderColor: '#f1f1f1' }}>
            <input type="text" className="input flex-1" placeholder="Écrire un message..." style={{ borderRadius: 20 }} />
            <button className="btn btn-orange" style={{ borderRadius: 20 }}>Envoyer</button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-dark mb-16" style={{ opacity: 0 }}>Espace</h2>
        
        <div className="card shadow-sm mb-16">
          <h3 className="font-bold text-dark mb-12">Tickets & Résolution</h3>
          {[
            { id: '#T-492', inf: '@MoustikKarismatik', issue: 'Problème lien de tracking invalide', status: 'Ouvert', sc: 'var(--red)' },
            { id: '#T-491', inf: '@CroqueuseDeDiamant', issue: 'Retard de paiement facture F-2023', status: 'Résolu', sc: 'var(--green)' }
          ].map(t => (
            <div key={t.id} className="flex justify-between items-center p-12 mb-8 border" style={{ borderRadius: 8, borderColor: '#eee' }}>
              <div>
                <div className="text-sm font-bold text-dark">{t.id} - {t.inf}</div>
                <div className="text-xs text-muted">{t.issue}</div>
              </div>
              <span className="tag text-xs" style={{ background: t.sc + '22', color: t.sc }}>{t.status}</span>
            </div>
          ))}
        </div>

        <div className="card shadow-sm">
          <h3 className="font-bold text-dark mb-12">FAQ Influenceurs (Les plus consultées)</h3>
          <ul className="text-sm text-dark list-disc" style={{ paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Comment générer une facture conforme ?</li>
            <li>Où trouver le brandbook Orange Cameroun ?</li>
            <li>Quels sont les délais de paiement standards ?</li>
            <li>Comment contester un refus de modération ?</li>
          </ul>
          <button className="btn btn-ghost btn-sm text-orange w-full mt-12">Gérer le Centre d'Aide</button>
        </div>
      </div>
    </div>
  );
}
