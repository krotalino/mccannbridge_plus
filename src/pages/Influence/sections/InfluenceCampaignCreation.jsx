import { useState } from 'react';

export default function InfluenceCampaignCreation({ influencers }) {
  const [step, setStep] = useState(1);
  const [briefData, setBriefData] = useState({ name: '', objective: '', budget: '', target: '' });

  const templates = [
    { id: 'awareness', name: 'Brand Awareness', desc: 'Objectif de visibilité maximale. Formats courts et viraux.' },
    { id: 'conversion', name: 'Drive to Store / Web', desc: 'Trafic et conversions. Codes promo et liens trackés.' },
    { id: 'event', name: 'Couverture Événementielle', desc: 'Teasing, Live Stories, Récapitulatif post-event.' }
  ];

  return (
    <div className="campaign-creation-flow">
      <h2 className="text-xl font-bold text-dark mb-16">Création de Campagne & Matchmaking</h2>
      
      <div className="grid grid-3 gap-16 mb-20">
        {[1, 2, 3].map(s => (
          <div key={s} className="card text-center" style={{ borderBottom: step === s ? '4px solid var(--orange)' : 'none', opacity: step >= s ? 1 : 0.5 }}>
            <h3 className="font-bold">Étape {s}</h3>
            <p className="text-xs text-muted">
              {s === 1 ? 'Template & Objectifs' : s === 2 ? 'Brief IA & Charte' : 'Matchmaking & Sélection'}
            </p>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-12">1. Sélection du modèle d'activation</h3>
          <div className="grid grid-3 gap-16 mb-20">
            {templates.map(t => (
              <div key={t.id} className="card cursor-pointer hover:shadow" style={{ border: '1px solid #eee' }} onClick={() => setStep(2)}>
                <h4 className="font-bold text-orange mb-8">{t.name}</h4>
                <p className="text-sm text-muted">{t.desc}</p>
                <button className="btn btn-ghost btn-sm mt-8 w-full">Utiliser ce modèle</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-12">2. Assistance au Brief (IA)</h3>
          <div className="form-group mb-12">
            <label className="text-sm font-semibold">Nom de la campagne</label>
            <input type="text" className="input" placeholder="Ex: Lancement Fibre Max..." />
          </div>
          <div className="form-group mb-12">
            <label className="text-sm font-semibold">Objectif & Messages clés</label>
            <textarea className="input" rows="4" placeholder="Décrivez les attentes..."></textarea>
            <button className="btn btn-ghost btn-sm text-orange mt-4">✨ Générer un brief optimisé avec l'IA</button>
          </div>
          <div className="flex justify-between mt-16">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Retour</button>
            <button className="btn btn-orange" onClick={() => setStep(3)}>Valider le brief →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-12">3. Matchmaking Influenceurs</h3>
          <p className="text-sm text-muted mb-16">Basé sur vos critères, voici les profils recommandés avec le meilleur taux d'affinité.</p>
          <div className="grid grid-auto gap-16">
            {influencers.slice(0, 3).map(inf => (
              <div key={inf.id} className="card" style={{ borderLeft: '4px solid var(--green)' }}>
                <div className="flex items-center gap-10 mb-8">
                  <div style={{width:40,height:40,borderRadius:'50%',background:'var(--orange)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800}}>{inf.name.charAt(0)}</div>
                  <div>
                    <div className="text-md font-bold text-dark">@{inf.name}</div>
                    <div className="text-xs text-green">Score Affinité : 94%</div>
                  </div>
                </div>
                <div className="text-xs text-muted mb-8">{inf.followers} abonnés • Engagement: {inf.engagement}</div>
                <button className="btn btn-ghost btn-sm w-full" style={{ border: '1px solid var(--orange)', color: 'var(--orange)' }}>Ajouter au casting</button>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-20 border-t pt-16">
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Retour au brief</button>
            <button className="btn btn-green">Lancer la campagne & Envoyer les contrats</button>
          </div>
        </div>
      )}
    </div>
  );
}
