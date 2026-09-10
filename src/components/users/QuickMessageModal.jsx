import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

export default function QuickMessageModal({ member, onClose, onSend }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(member, message.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#14161C] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#101217]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF6600] flex items-center justify-center text-white font-bold text-sm">
              {member.avatar || member.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Message à {member.name}</h2>
              <p className="text-[11px] text-[#FF6600]">{member.poste || member.profil}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1.5">Votre message</label>
            <textarea
              rows={4}
              required
              placeholder={`Bonjour ${member.name}, as-tu du nouveau sur le brief en cours ?`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-[#1C1F26] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6600] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-zinc-500">Canal BRIDGE Direct</span>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl font-medium transition-colors"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6600] hover:bg-[#E55B00] text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                Envoyer
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
