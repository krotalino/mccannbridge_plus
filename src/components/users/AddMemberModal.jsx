import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

export default function AddMemberModal({ defaultTeam = 'mccann', onClose, onAdd }) {
  const [team, setTeam] = useState(defaultTeam);
  const [name, setName] = useState('');
  const [poste, setPoste] = useState('');
  const [entite, setEntite] = useState('Création');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('+237 ');
  const [statut, setStatut] = useState('actif');

  // Auto-fill initials avatar
  const avatar = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CM';

  const handleNameChange = (val) => {
    setName(val);
    if (!email || email.includes('@mccann.cm') || email.includes('@orange.cm')) {
      const clean = val.toLowerCase().replace(/[^a-z0-9]/g, '.');
      const domain = team === 'mccann' ? 'mccann.cm' : 'orange.cm';
      setEmail(`${clean}@${domain}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember = {
      id: `user-${team}-${Date.now()}`,
      type: team === 'mccann' ? 'agence' : 'client',
      name: name.trim(),
      poste: poste.trim() || 'Collaborateur',
      profil: poste.trim() || 'Collaborateur',
      entite: entite,
      department: entite,
      email: email.trim(),
      telephone: telephone.trim(),
      statut: statut,
      derniereConnexion: 'À l’instant',
      dateArrivee: new Date().toLocaleDateString('fr-FR'),
      avatar: avatar,
      biographie: `Membre de l'équipe ${team === 'mccann' ? 'McCann Douala' : 'Orange Cameroun'}, département ${entite}.`,
      competences: [entite, 'Collaboration', 'BRIDGE'],
      reseaux: {
        linkedin: '',
        twitter: '',
        instagram: '',
        facebook: '',
        tiktok: '',
        behance: '',
        dribbble: '',
        youtube: '',
        siteWeb: ''
      },
      parametres: {
        fuseau: 'Africa/Douala',
        changementObligatoire: false,
        sessionsActives: []
      },
      preferences: {
        notifMessages: true,
        notifRapports: true,
        notifFinances: false,
        notifAlertes: true,
        theme: 'sombre'
      }
    };

    onAdd(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#14161C] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#101217]">
          <div>
            <h2 className="text-base font-bold text-white">Ajouter un nouveau membre</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Intégration d'un collaborateur dans l'équipe</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Team Selector Toggle */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1.5">Équipe de rattachement</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTeam('mccann')}
                className={`py-2 px-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${
                  team === 'mccann'
                    ? 'bg-[#FF6600] text-white shadow-lg shadow-orange-500/20'
                    : 'bg-[#1C1F26] text-zinc-400 hover:text-white'
                }`}
              >
                <span>McCann Douala</span>
              </button>
              <button
                type="button"
                onClick={() => setTeam('orange')}
                className={`py-2 px-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${
                  team === 'orange'
                    ? 'bg-[#00D4FF] text-[#0A0E27] shadow-lg shadow-cyan-500/20'
                    : 'bg-[#1C1F26] text-zinc-400 hover:text-white'
                }`}
              >
                <span>Orange Cameroun</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1.5">Nom complet (Prénom + NOM)</label>
            <input
              type="text"
              required
              placeholder="ex: Juliette ESSOMBA"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Rôle / Intitulé</label>
              <input
                type="text"
                required
                placeholder="ex: Infographe Junior"
                value={poste}
                onChange={(e) => setPoste(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6600]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Département</label>
              <select
                value={entite}
                onChange={(e) => setEntite(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6600]"
              >
                <option value="Direction">Direction</option>
                <option value="Commercial">Commercial</option>
                <option value="Création">Création</option>
                <option value="Digital">Digital</option>
                <option value="Production">Production</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Email professionnel</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6600]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Téléphone</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6600]"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1.5">Statut initial</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6600]"
            >
              <option value="actif">En ligne (Actif)</option>
              <option value="inactif">Hors ligne (Inactif)</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6600] hover:bg-[#E55B00] text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter le membre
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
