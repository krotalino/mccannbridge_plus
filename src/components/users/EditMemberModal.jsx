import React, { useState } from 'react';
import { X, Check, Save } from 'lucide-react';

export default function EditMemberModal({ member, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: member.name || '',
    poste: member.poste || member.profil || '',
    entite: member.entite || member.department || 'Création',
    statut: member.statut || 'actif',
    email: member.email || '',
    telephone: member.telephone || '',
    avatar: member.avatar || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...member,
      ...formData,
      department: formData.entite,
      profil: formData.poste
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#14161C] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#101217]">
          <div>
            <h2 className="text-base font-bold text-white">Modifier le collaborateur</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{member.name}</p>
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
          <div>
            <label className="block text-zinc-400 font-semibold mb-1.5">Nom complet</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Rôle / Intitulé de poste</label>
              <input
                type="text"
                required
                value={formData.poste}
                onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6600]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Département</label>
              <select
                value={formData.entite}
                onChange={(e) => setFormData({ ...formData, entite: e.target.value })}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6600]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Téléphone</label>
              <input
                type="text"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6600]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Statut de disponibilité</label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6600]"
              >
                <option value="actif">En ligne (Actif)</option>
                <option value="inactif">Hors ligne (Inactif)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Initiales Avatar</label>
              <input
                type="text"
                maxLength={3}
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2.5 bg-[#1C1F26] border border-white/10 rounded-xl text-white uppercase focus:outline-none focus:border-[#FF6600]"
              />
            </div>
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
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
