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
    <div className="space-y-5 animate-fadeIn pb-10">
      
      {/* En-tête de section (Style Influence) */}
      <div className="flex flex-wrap items-center justify-between gap-16 mb-16">
        <div className="flex items-center gap-10">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#FF7900',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255, 121, 0, 0.25)',
            }}
          >
            <CalendarIcon size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-dark" style={{ margin: 0 }}>
              6. Calendrier & Échéances — Planning des Livraisons SLA
            </h2>
            <p className="text-xs text-muted mt-2" style={{ margin: 0 }}>
              Suivi des jalons de clôture (Hebdo J+2, Mensuel J+5, Spontané SLA et Comités de performance)
            </p>
          </div>
        </div>

        {/* Navigation Mois & Bouton Aujourd'hui */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-muted hover:text-dark hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-dark px-3 min-w-[130px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-muted hover:text-dark hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => { setCurrentMonth(7); setCurrentYear(2026); }}
            className="btn btn-ghost border text-xs font-bold px-3 py-1.5 rounded"
            style={{ background: '#fff' }}
          >
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* Grille du Calendrier (Style Influence) */}
      <div className="card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Days of the week */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center py-2.5">
          {weekDays.map(wd => (
            <div key={wd} className="text-xs font-bold text-muted uppercase tracking-wider">
              {wd}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 bg-white">
          {calendarDays.map((cd, index) => {
            if (!cd.isCurrentMonth) {
              return (
                <div key={index} className="min-h-[110px] p-2 bg-gray-50/50 opacity-40" />
              );
            }

            const isToday = cd.dateStr === '2026-08-16';

            return (
              <div
                key={index}
                className={`min-h-[110px] p-2.5 transition-colors ${
                  isToday ? 'bg-orange-50/20' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      isToday
                        ? 'bg-[#FF7900] text-white'
                        : 'text-dark'
                    }`}
                  >
                    {cd.day}
                  </span>

                  {cd.reports.length > 0 && (
                    <span className="text-[10px] font-bold text-muted bg-gray-100 px-1.5 py-0.2 rounded">
                      {cd.reports.length}
                    </span>
                  )}
                </div>

                {/* Day events pills */}
                <div className="space-y-1">
                  {cd.reports.map(r => {
                    const statusCfg = REPORT_STATUSES[r.status] || REPORT_STATUSES.draft;
                    const isDelivered = r.status === 'delivered';
                    return (
                      <div
                        key={r.id}
                        onClick={() => onSelectReport(r)}
                        className="p-1 rounded text-[10px] font-bold truncate cursor-pointer transition-all hover:opacity-90"
                        style={{
                          backgroundColor: statusCfg.color + '18',
                          color: statusCfg.color,
                          border: `1px solid ${statusCfg.color}40`
                        }}
                        title={`${r.id} - ${r.title}`}
                      >
                        {isDelivered ? '✓' : '⏰'} {r.id}: {r.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
