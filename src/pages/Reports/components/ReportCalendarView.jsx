import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
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
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...
  const startingDay = firstDay === 0 ? 6 : firstDay - 1; // convert to Mon = 0
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  // Pad previous month days
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false });
  }
  // Days of current month
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
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon size={18} className="text-orange-600" />
            <span>Calendrier des Livraisons & Échéances SLA</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Suivi des jalons de clôture (Hebdo J+2, Mensuel J+5, Spontané SLA & Comités)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-gray-800 px-3 min-w-[120px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button
            onClick={() => { setCurrentMonth(7); setCurrentYear(2026); }}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors"
          >
            Août 2026 (Actuel)
          </button>
        </div>
      </div>

      {/* Week days grid header */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden border border-gray-200">
        {weekDays.map((wd, i) => (
          <div 
            key={wd} 
            className={`py-2 text-center text-xs font-bold ${
              i >= 5 ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 text-gray-700'
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 border-x border-b border-gray-200 rounded-b-lg overflow-hidden">
        {calendarDays.map((cell, idx) => {
          if (!cell.isCurrentMonth) {
            return (
              <div key={`empty-${idx}`} className="bg-gray-50/50 min-h-[90px] p-2 opacity-30"></div>
            );
          }

          const hasReports = cell.reports && cell.reports.length > 0;
          const isToday = cell.dateStr === '2026-08-16';

          return (
            <div 
              key={cell.dateStr} 
              className={`bg-white min-h-[95px] p-2 flex flex-col justify-between transition-colors ${
                isToday ? 'bg-orange-50/30 ring-1 ring-inset ring-orange-400' : 'hover:bg-gray-50/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>
                  {cell.day}
                </span>
                {isToday && (
                  <span className="text-[9px] font-extrabold px-1 rounded bg-orange-500 text-white">
                    AUJOURD'HUI
                  </span>
                )}
              </div>

              {/* Reports in day */}
              <div className="space-y-1 my-1">
                {cell.reports?.map((rep) => {
                  const statusCfg = REPORT_STATUSES[rep.status] || REPORT_STATUSES.draft;
                  const isUrgent = rep.priority === 'urgente';
                  const isDelivered = rep.status === 'delivered';

                  return (
                    <button
                      key={rep.id}
                      onClick={() => onSelectReport(rep)}
                      className={`w-full text-left p-1 rounded border text-[10px] leading-tight transition-all block ${
                        isUrgent 
                          ? 'bg-red-50 border-red-300 text-red-900 font-bold animate-pulse'
                          : isDelivered 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-orange-50 border-orange-200 text-orange-950 font-medium'
                      }`}
                      title={`${rep.id} - ${rep.title} (${statusCfg.label})`}
                    >
                      <div className="flex items-center gap-1 truncate">
                        {isUrgent && <AlertTriangle size={10} className="text-red-600 shrink-0" />}
                        {isDelivered && <CheckCircle2 size={10} className="text-emerald-600 shrink-0" />}
                        <span className="font-mono font-bold truncate">{rep.id}</span>
                      </div>
                      <div className="truncate text-[9px] text-gray-600 mt-0.5">
                        {rep.brands?.[0] || 'Orange'}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-[9px] text-gray-400 text-right">
                {hasReports ? `${cell.reports.length} livrable(s)` : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* SLA Guidelines Summary */}
      <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-100">
          <div className="font-bold text-orange-900 flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            Rapports Hebdomadaires
          </div>
          <p className="text-[11px] text-orange-800">
            Clôture dimanche minuit → Livraison J+2 / J+3 (Mardi 10h max).
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
          <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Rapports Mensuels
          </div>
          <p className="text-[11px] text-blue-800">
            Consolidation fin de mois → Livraison J+5 ouvrés pour comité.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-red-50 border border-red-100">
          <div className="font-bold text-red-900 flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Rapports Spontanés & Urgences
          </div>
          <p className="text-[11px] text-red-800">
            SLA sous 24h à 48h avec validation de crise express.
          </p>
        </div>
      </div>
    </div>
  );
}
