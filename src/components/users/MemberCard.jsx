import React from 'react';
import { Pencil, Trash2, Mail, MessageSquare, User } from 'lucide-react';

export default function MemberCard({
  member,
  onEdit,
  onDelete,
  onMail,
  onChat,
  onOpenProfile
}) {
  const isOnline = member.statut === 'actif';
  const roleText = member.poste || member.profil || member.role || 'Collaborateur';
  const deptText = member.entite || member.department || 'Général';
  const avatarText = member.avatar || (member.name ? member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??');

  return (
    <div className="bg-[#14161C] border border-white/5 hover:border-white/10 rounded-2xl p-6 relative flex flex-col items-center text-center shadow-lg transition-all duration-200 hover:-translate-y-1">
      
      {/* ─── Top Right Quick Action Icons (Pencil & Trash) ─── */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(member);
          }}
          title="Modifier le membre"
          className="text-orange-400/80 hover:text-orange-400 transition-colors p-1"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(member);
          }}
          title="Supprimer le membre"
          className="text-zinc-500 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── Big Orange Circular Avatar ─── */}
      <div className="w-20 h-20 rounded-full bg-[#FF6600] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/20 mb-4 select-none">
        {avatarText}
      </div>

      {/* ─── Member Full Name ─── */}
      <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
        {member.name}
      </h3>

      {/* ─── Role / Title (Vibrant Orange) ─── */}
      <p className="text-sm font-semibold text-[#FF6600] mt-1 line-clamp-1">
        {roleText}
      </p>

      {/* ─── Department ─── */}
      <p className="text-xs text-zinc-400 mt-1">
        {deptText}
      </p>

      {/* ─── Status Pill Badge: "● En ligne" ─── */}
      <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11241B] border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`}></span>
        <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
      </div>

      {/* ─── Bottom 3 Action Buttons [ Mail ] [ Message ] [ Orange User ] ─── */}
      <div className="grid grid-cols-3 gap-2 w-full mt-6">
        <button
          type="button"
          onClick={() => onMail(member)}
          title={`Envoyer un email à ${member.name}`}
          className="h-10 bg-[#222630] hover:bg-[#2C3240] text-zinc-300 rounded-lg flex items-center justify-center transition-colors"
        >
          <Mail className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onChat(member)}
          title={`Discuter avec ${member.name}`}
          className="h-10 bg-[#222630] hover:bg-[#2C3240] text-zinc-300 rounded-lg flex items-center justify-center transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onOpenProfile(member)}
          title={`Voir le profil complet de ${member.name}`}
          className="h-10 bg-[#FF6600] hover:bg-[#E55B00] text-white rounded-lg flex items-center justify-center transition-colors shadow-md shadow-orange-500/20"
        >
          <User className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
