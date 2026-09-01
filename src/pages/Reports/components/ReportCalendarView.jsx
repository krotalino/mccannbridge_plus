import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { REPORT_STATUSES, REPORT_TYPES } from '../../../data/reportsData';

export default function ReportCalendarView({ reports, onSelectReport }) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // 7 = August (0-indexed)

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate days in month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const startingDay = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayReports = reports.filter(r => r.dueDate === dateStr || (r.deliveredDate === dateStr && r.status === 'delivered'));
    calendarDays.push({
      day: d,
      dateStr,
      isCurrentMonth: true,
      reports: dayReports
    });
  }

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="p-6 rounded-2xl cosmic-glass-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2 tracking-tight">
            <CalendarIcon size={18} className="text-[#FF6600]" />
            <span>Calendrier Cosmique des Livraisons & Échéances SLA</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Suivi temps réel des jalons de clôture (Hebdo J+2, Mensuel J+5, Spontané SLA & Comités)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-black text-white px-3 min-w-[120px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => { setCurrentMonth(7); setCurrentYear(2026); }}
            className="text-xs font-black px-3 py-1.5 rounded-xl cosmic-btn-cyan cursor-pointer"
          >
            Août 2026 (Actuel)
          </button>
        </div>
      </div>

      {/* Week days grid header */}
      <div className="grid grid-cols-7 gap-px bg-white/10 rounded-t-xl overflow-hidden border border-white/10">
        {weekDays.map((wd, i) => (
          <div 
            key={wd} 
            className={`py-2.5 text-center text-xs font-extrabold ${
              i >= 5 ? 'bg-black/60 text-slate-500' : 'bg-black/40 text-slate-300'
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-px bg-white/10 border-x border-b border-white/10 rounded-b-xl overflow-hidden">
        {calendarDays.map((cell, idx) => {
          if (!cell.isCurrentMonth) {
            return (
              <div key={`empty-${idx}`} className="bg-black/40 min-h-[100px] p-2 opacity-20"></div>
            );
          }

          const hasReports = cell.reports && cell.reports.length > 0;
          const isToday = cell.dateStr === '2026-08-16';

          return (
            <div 
              key={cell.dateStr} 
              className={`bg-black/30 min-h-[105px] p-2.5 flex flex-col justify-between transition-colors ${
                isToday ? 'bg-[#FF6600]/15 ring-1 ring-inset ring-[#FF6600]' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black ${isToday ? 'text-[#FF6600]' : 'text-slate-200'}`}>
                  {cell.day}
                </span>
                {isToday && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-[#FF6600] to-[#FF8C00] text-white shadow-xs">
                    AUJOURD'HUI
                  </span>
                )}
              </div>

              {/* Reports in day */}
              <div className="space-y-1.5 my-1.5">
                {cell.reports?.map((rep) => {
                  const isUrgent = rep.priority === 'urgente';
                  const isDelivered = rep.status === 'delivered';

                  return (
                    <button
                      key={rep.id}
                      onClick={() => onSelectReport(rep)}
                      className={`w-full text-left p-1.5 rounded-lg border text-[10px] leading-tight transition-all block cursor-pointer ${
                        isUrgent 
                          ? 'bg-red-500/20 border-red-500/40 text-red-300 font-black animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                          : isDelivered 
                          ? 'bg-emerald-500/20 border-emerald-500/35 text-emerald-300 font-bold'
                          : 'bg-[#FF6600]/20 border-[#FF6600]/35 text-[#FFA040] font-bold hover:border-[#FF6600]'
                      }`}
                      title={`${rep.id} - ${rep.title}`}
                    >
                      <div className="flex items-center gap-1 truncate">
                        {isUrgent && <AlertTriangle size={10} className="text-red-400 shrink-0" />}
                        {isDelivered && <CheckCircle2 size={10} className="text-emerald-400 shrink-0" />}
                        <span className="font-mono truncate">{rep.id}</span>
                      </div>
                      <div className="truncate text-[9px] text-slate-300 mt-0.5">
                        {rep.brands?.[0] || 'Orange'}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-[9px] text-slate-500 font-semibold text-right">
                {hasReports ? `${cell.reports.length} livrable(s)` : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* SLA Guidelines Summary */}
      <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div className="p-3 rounded-xl bg-black/40 border border-[#FF6600]/30">
          <div className="font-black text-[#FF8C00] flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6600]"></span>
            Rapports Hebdomadaires
          </div>
          <p className="text-[11px] text-slate-300">
            Clôture dimanche minuit → Livraison J+2 / J+3 (Mardi 10h max).
          </p>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-[#00D4FF]/30">
          <div className="font-black text-[#00D4FF] flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF]"></span>
            Rapports Mensuels
          </div>
          <p className="text-[11px] text-slate-300">
            Consolidation fin de mois → Livraison J+5 ouvrés pour comité.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-red-500/30">
          <div className="font-black text-red-400 flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Rapports Spontanés & Urgences
          </div>
          <p className="text-[11px] text-slate-300">
            SLA sous 24h à 48h avec validation de crise express.
          </p>
        </div>
      </div>
    </div>
  );
}
