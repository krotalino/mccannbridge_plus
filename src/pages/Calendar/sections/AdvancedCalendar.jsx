import { useState, useMemo } from 'react';
import { CM_DATA } from '../../../data/community';
import { useApp } from '../../../context/AppContext';
import './calendar.css';

export default function AdvancedCalendar({ onOpenArchive }) {
  const calData = CM_DATA.advancedCalendar;
  const { 
    calendarPosts = [], 
    addCalendarPost, 
    updateCalendarPost, 
    deleteCalendarPost, 
    addPublication 
  } = useApp();

  // ─── State Management ───
  const [viewMode, setViewMode] = useState('week'); // 'month' | 'week' | 'day'
  const [activeNav, setActiveNav] = useState('calendar'); // 'calendar' | 'queue' | 'drafts' | 'campaigns'
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Filters
  const [filterClient, setFilterClient] = useState('All');
  const [filterCanal, setFilterCanal] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [viewModalPost, setViewModalPost] = useState(null);
  const [editModalState, setEditModalState] = useState(null); // null | { mode: 'create'|'edit', data: {...} }
  const [deleteModalPost, setDeleteModalPost] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Preset image thumbnails for convenience
  const IMAGE_PRESETS = [
    { label: 'Orange Telco', url: 'https://placehold.co/400x300/ff7900/white?text=Orange+Telco' },
    { label: 'Orange Money', url: 'https://placehold.co/400x300/9b59b6/white?text=Orange+Money' },
    { label: 'Max it Promo', url: 'https://placehold.co/400x300/2980b9/white?text=Max+it+Promo' },
    { label: 'Digital Center', url: 'https://placehold.co/400x300/34495e/white?text=ODC+Tech' },
    { label: 'AI Gen Copy', url: 'https://placehold.co/400x300/111827/ffffff?text=AI+Generated' },
  ];

  // Helper date parsing and formatting
  const getPostDateStr = (post) => {
    if (post.date) return post.date;
    if (post.day) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}-${String(post.day).padStart(2, '0')}`;
    }
    return formatDateToYMD(currentDate);
  };

  const formatDateToYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper date comparison
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // ─── Filtered Posts ───
  const filteredPosts = useMemo(() => {
    return calendarPosts.filter(p => {
      // Client filter
      if (filterClient !== 'All' && p.client !== filterClient) return false;
      // Canal filter
      if (filterCanal !== 'All' && p.canal !== filterCanal) return false;
      // Status filter
      if (filterStatus !== 'All' && p.status !== filterStatus) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(query);
        const matchDesc = (p.desc || p.description || '').toLowerCase().includes(query);
        const matchClient = (p.client || '').toLowerCase().includes(query);
        const matchCampaign = (p.campaign || '').toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchClient && !matchCampaign) return false;
      }
      // Top nav filter
      if (activeNav === 'queue') {
        return p.status === 'PENDING' || p.status === 'SCHEDULED';
      }
      if (activeNav === 'drafts') {
        return p.status === 'DRAFT';
      }
      if (activeNav === 'campaigns') {
        return Boolean(p.campaign);
      }
      return true;
    });
  }, [calendarPosts, filterClient, filterCanal, filterStatus, searchQuery, activeNav]);

  // ─── Navigation Handlers ───
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() - 1);
    } else if (viewMode === 'week') {
      next.setDate(next.getDate() - 7);
    } else if (viewMode === 'day') {
      next.setDate(next.getDate() - 1);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else if (viewMode === 'week') {
      next.setDate(next.getDate() + 7);
    } else if (viewMode === 'day') {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-05-19T10:00:00'));
  };

  // Dynamic header title
  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    }
    if (viewMode === 'week') {
      // Calculate Monday of current week
      const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 1 is Monday
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(currentDate);
      monday.setDate(currentDate.getDate() + diffToMonday);
      
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const monStr = monday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      const sunStr = sunday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
      return `Semaine du ${monStr} au ${sunStr}`;
    }
    if (viewMode === 'day') {
      const dayStr = currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      return dayStr.charAt(0).toUpperCase() + dayStr.slice(1);
    }
    return '';
  };

  // ─── Status Colors & Labels ───
  const getStatusColor = (s) => {
    switch (s) {
      case 'PUBLISHED': return '#27ae60';
      case 'SCHEDULED': return '#3498db';
      case 'PENDING': return '#f39c12';
      case 'DRAFT': return '#94a3b8';
      default: return '#3b82f6';
    }
  };

  const getStatusLabel = (s) => {
    switch (s) {
      case 'PUBLISHED': return '✅ PUBLIÉ';
      case 'SCHEDULED': return '📅 PROGRAMMÉ';
      case 'PENDING': return '⏳ EN ATTENTE';
      case 'DRAFT': return '📝 BROUILLON';
      default: return s || 'BROUILLON';
    }
  };

  const getPlatformIcon = (canal) => {
    switch (canal) {
      case 'Facebook': return '📘';
      case 'Instagram': return '📸';
      case 'LinkedIn': return '💼';
      case 'X': return '✖️';
      case 'TikTok': return '🎵';
      case 'Chaine WhatsApp': return '💬';
      default: return '🌐';
    }
  };

  // ─── CRUD Action Handlers ───
  const handleOpenCreateModal = (presetDate = null, presetTime = '10:00') => {
    const targetDate = presetDate ? formatDateToYMD(presetDate) : formatDateToYMD(currentDate);
    const dayNumber = presetDate ? presetDate.getDate() : currentDate.getDate();

    setEditModalState({
      mode: 'create',
      data: {
        title: '',
        client: filterClient !== 'All' ? filterClient : 'Orange Telco',
        canal: filterCanal !== 'All' ? filterCanal : 'Facebook',
        type: 'Feed',
        format: 'Paysage',
        time: presetTime,
        date: targetDate,
        day: dayNumber,
        status: 'PENDING',
        generation: 'Manual',
        desc: '',
        image: '',
        campaign: '',
      }
    });
  };

  const handleOpenEditModal = (post) => {
    setEditModalState({
      mode: 'edit',
      data: {
        ...post,
        date: getPostDateStr(post),
        day: post.day || (post.date ? parseInt(post.date.split('-')[2], 10) : 19),
        desc: post.desc || post.description || '',
      }
    });
    if (viewModalPost) {
      setViewModalPost(null);
    }
  };

  const handleSaveModalForm = async (e) => {
    e.preventDefault();
    const formData = editModalState.data;
    if (!formData.title.trim()) return;

    const dayParsed = formData.date ? parseInt(formData.date.split('-')[2], 10) : formData.day || 19;

    if (editModalState.mode === 'create') {
      const newPost = {
        ...formData,
        day: dayParsed,
        createdAt: new Date().toISOString(),
      };
      await addCalendarPost(newPost);
      
      // Also register in publications context
      const platMap = { 'Facebook': 'Facebook', 'Instagram': 'Instagram', 'X': 'Twitter/X', 'LinkedIn': 'LinkedIn', 'TikTok': 'TikTok', 'Chaine WhatsApp': 'WhatsApp' };
      if (addPublication) {
        addPublication({
          title: formData.title,
          plateforme: platMap[formData.canal] || formData.canal,
          format: formData.type === 'Carrousel' ? 'Carrousel' : formData.type === 'Réels et Story' ? 'Reels' : 'Image',
          description: formData.desc,
          dateTarget: formData.date,
          heureTarget: formData.time,
        });
      }
    } else {
      // Edit mode
      await updateCalendarPost(formData.id, {
        ...formData,
        day: dayParsed,
        updatedAt: new Date().toISOString()
      });
    }

    setEditModalState(null);
  };

  const handleDeletePost = async () => {
    if (!deleteModalPost) return;
    await deleteCalendarPost(deleteModalPost.id);
    setDeleteModalPost(null);
    if (viewModalPost && viewModalPost.id === deleteModalPost.id) {
      setViewModalPost(null);
    }
  };

  const handleQuickStatusChange = async (postId, newStatus) => {
    await updateCalendarPost(postId, { status: newStatus });
    if (viewModalPost && viewModalPost.id === postId) {
      setViewModalPost(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleCopyDescription = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleGenerateAICaption = () => {
    if (!editModalState) return;
    const current = editModalState.data;
    const aiSuggestions = [
      `🚀 Découvrez les nouveaux avantages exclusifs avec ${current.client} ! Restez connectés, profitez du meilleur du numérique au Cameroun. 📲✨ #${current.client.replace(/\s+/g, '')} #Innovation`,
      `🔥 Offre spéciale à ne pas manquer ! Bénéficiez d'une expérience fluide et simplifiée dès aujourd'hui. Cliquez sur le lien en bio pour en savoir plus. 🇨🇲🎉 #OrangeCameroun #Pulse`,
      `💡 Saviez-vous que vous pouvez gérer toutes vos opérations en un clic ? Rejoignez la communauté et transformez votre quotidien avec ${current.client}. 🚀💫`
    ];
    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setEditModalState({
      ...editModalState,
      data: {
        ...editModalState.data,
        desc: (editModalState.data.desc ? editModalState.data.desc + '\n\n' : '') + randomSuggestion,
        generation: 'AI'
      }
    });
  };

  // ─── Month View Generator ───
  const monthCells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const totalDays = lastDayOfMonth.getDate();
    // Monday as first day: 0=Mon, 1=Tue, ..., 6=Sun
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const cells = [];

    // Leading padding days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      cells.push({ date: d, isCurrentMonth: false });
    }

    // Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      cells.push({ date: d, isCurrentMonth: true });
    }

    // Trailing padding days to complete full grid (multiple of 7)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({ date: d, isCurrentMonth: false });
    }

    return cells;
  }, [currentDate]);

  // ─── Week View Days Generator ───
  const weekDays = useMemo(() => {
    const dayOfWeek = currentDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + diffToMonday);

    const daysList = [];
    const dayNames = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isToday = isSameDay(d, new Date('2026-05-19T10:00:00'));
      daysList.push({
        name: dayNames[i],
        dateObj: d,
        dateStr: formatDateToYMD(d),
        dayNum: d.getDate(),
        isToday,
      });
    }
    return daysList;
  }, [currentDate]);

  // ─── Day View Hours Generator ───
  const dayHours = useMemo(() => {
    const hours = [];
    for (let h = 7; h <= 22; h++) {
      const timeStr = `${String(h).padStart(2, '0')}:00`;
      hours.push(timeStr);
    }
    return hours;
  }, []);

  return (
    <div className="adv-calendar-container animate-fade" id="adv-calendar-module">
      {/* ─── Top Bar Navigation ─── */}
      <div className="adv-cal-topbar" id="adv-cal-topbar">
        <div className="adv-cal-nav">
          <button 
            id="adv-tab-calendar"
            className={activeNav === 'calendar' ? 'active' : ''} 
            onClick={() => setActiveNav('calendar')}
          >
            📅 Calendrier
            <span className="adv-nav-count">{calendarPosts.length}</span>
          </button>
          <button 
            id="adv-tab-queue"
            className={activeNav === 'queue' ? 'active' : ''} 
            onClick={() => setActiveNav('queue')}
          >
            ⏸ File d'attente
            <span className="adv-nav-count">
              {calendarPosts.filter(p => p.status === 'PENDING' || p.status === 'SCHEDULED').length}
            </span>
          </button>
          <button 
            id="adv-tab-drafts"
            className={activeNav === 'drafts' ? 'active' : ''} 
            onClick={() => setActiveNav('drafts')}
          >
            📝 Brouillons
            <span className="adv-nav-count">
              {calendarPosts.filter(p => p.status === 'DRAFT').length}
            </span>
          </button>
          <button 
            id="adv-tab-campaigns"
            className={activeNav === 'campaigns' ? 'active' : ''} 
            onClick={() => setActiveNav('campaigns')}
          >
            🚀 Campagnes
            <span className="adv-nav-count">
              {calendarPosts.filter(p => Boolean(p.campaign)).length}
            </span>
          </button>
        </div>

        <div className="adv-cal-top-actions">
          <button id="adv-btn-archive" className="btn btn-ghost btn-sm" onClick={onOpenArchive}>
            📂 Archives
          </button>
          <div className="user-avatar-small" title="Community Manager">CM</div>
        </div>
      </div>

      {/* ─── Control Bar (View Toggles, Navigation, Filters) ─── */}
      <div className="adv-cal-controls" id="adv-cal-controls">
        <div className="flex items-center gap-16 flex-wrap">
          <div className="adv-cal-date-display">
            <span className="icon">🗓</span>
            <div>
              <div className="text-xs text-muted font-semibold">PLANNING & ÉDITION</div>
              <div className="font-bold text-lg text-white" id="adv-cal-current-label">
                {getHeaderTitle()}
              </div>
            </div>
          </div>

          {/* View Toggles: Mois / Semaine / Jour */}
          <div className="adv-cal-view-toggles" id="adv-cal-view-toggles">
            <button 
              id="adv-toggle-month"
              className={viewMode === 'month' ? 'active' : ''} 
              onClick={() => setViewMode('month')}
            >
              📅 Mois
            </button>
            <button 
              id="adv-toggle-week"
              className={viewMode === 'week' ? 'active' : ''} 
              onClick={() => setViewMode('week')}
            >
              📊 Semaine
            </button>
            <button 
              id="adv-toggle-day"
              className={viewMode === 'day' ? 'active' : ''} 
              onClick={() => setViewMode('day')}
            >
              🕒 Jour
            </button>
          </div>

          {/* Navigation Arrows & Today */}
          <div className="adv-cal-nav-arrows">
            <button id="adv-nav-prev" onClick={handlePrev} title="Période précédente">‹</button>
            <button id="adv-nav-next" onClick={handleNext} title="Période suivante">›</button>
            <button id="adv-nav-today" className="btn-today" onClick={handleToday}>
              Aujourd'hui
            </button>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-10 flex-wrap">
          {/* Search */}
          <input 
            id="adv-search-input"
            type="text" 
            className="adv-cal-search" 
            placeholder="🔍 Rechercher un post..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Client Filter */}
          <select 
            id="adv-filter-client"
            className="adv-cal-select" 
            value={filterClient} 
            onChange={(e) => setFilterClient(e.target.value)}
          >
            <option value="All">🏢 Tous les Clients</option>
            {calData.clients.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Canal Filter */}
          <select 
            id="adv-filter-canal"
            className="adv-cal-select" 
            value={filterCanal} 
            onChange={(e) => setFilterCanal(e.target.value)}
          >
            <option value="All">📱 Tous les Canaux</option>
            {calData.canaux.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Status Filter */}
          <select 
            id="adv-filter-status"
            className="adv-cal-select" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">🚦 Tous les Statuts</option>
            <option value="PUBLISHED">✅ Publié</option>
            <option value="SCHEDULED">📅 Programmé</option>
            <option value="PENDING">⏳ En attente</option>
            <option value="DRAFT">📝 Brouillon</option>
          </select>

          {/* Create Button */}
          <button 
            id="adv-btn-new-post"
            className="btn btn-orange btn-sm" 
            onClick={() => handleOpenCreateModal()}
          >
            ➕ Nouveau Post
          </button>
        </div>
      </div>

      {/* ─── VIEW 1: MONTH (MOIS) ─── */}
      {viewMode === 'month' && (
        <div className="adv-month-container animate-fade" id="adv-month-view">
          <div className="adv-month-weekdays">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(dayName => (
              <div key={dayName} className="adv-month-weekday-cell">
                {dayName}
              </div>
            ))}
          </div>

          <div className="adv-month-grid">
            {monthCells.map((cell, idx) => {
              const dateStr = formatDateToYMD(cell.date);
              const isToday = isSameDay(cell.date, new Date('2026-05-19T10:00:00'));
              
              // Find posts on this day
              const dayPosts = filteredPosts.filter(p => {
                const pDate = getPostDateStr(p);
                return pDate === dateStr || (cell.isCurrentMonth && p.day === cell.date.getDate());
              });

              return (
                <div 
                  key={idx} 
                  className={`adv-month-day-cell ${!cell.isCurrentMonth ? 'is-other-month' : ''} ${isToday ? 'is-today' : ''}`}
                >
                  <div className="adv-month-cell-header">
                    <span className="adv-month-day-number">
                      {cell.date.getDate()}
                    </span>
                    <button 
                      className="adv-month-add-btn" 
                      title="Ajouter une publication ce jour"
                      onClick={() => handleOpenCreateModal(cell.date)}
                    >
                      +
                    </button>
                  </div>

                  <div className="adv-month-posts-list">
                    {dayPosts.map(post => (
                      <div 
                        key={post.id} 
                        className={`adv-month-post-chip status-${(post.status || 'draft').toLowerCase()}`}
                        onClick={() => setViewModalPost(post)}
                        title={`${post.title} — ${post.canal} (${post.time})`}
                      >
                        <span>{getPlatformIcon(post.canal)}</span>
                        <span className="adv-chip-time">{post.time}</span>
                        <span className="adv-chip-title">{post.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── VIEW 2: WEEK (SEMAINE) ─── */}
      {viewMode === 'week' && (
        <div className="adv-cal-grid animate-fade" id="adv-week-view">
          {weekDays.map((col, index) => {
            const dayPosts = filteredPosts.filter(p => {
              const pDate = getPostDateStr(p);
              return pDate === col.dateStr || p.day === col.dayNum;
            });

            return (
              <div key={index} className={`adv-cal-col ${col.isToday ? 'is-today' : ''}`}>
                <div className="adv-cal-col-header">
                  <div className="adv-cal-col-name">{col.name}</div>
                  <div className="adv-cal-col-date">
                    <span>{col.dayNum}</span>
                    {col.isToday && <span className="today-badge">AUJOURD'HUI</span>}
                  </div>
                  <div className="adv-cal-col-count">{dayPosts.length} POSTS</div>
                </div>

                <div className="adv-cal-cards">
                  {dayPosts.map(post => (
                    <div key={post.id} className="adv-post-card animate-fade">
                      <div className="adv-post-header">
                        <div className="adv-post-platform">
                          <span>{getPlatformIcon(post.canal)}</span>
                          <span>{post.canal}</span>
                          <span className="text-muted ml-4 text-xs font-mono">{post.time}</span>
                        </div>
                        <div 
                          className="adv-post-status" 
                          style={{ 
                            color: getStatusColor(post.status),
                            background: `${getStatusColor(post.status)}18`,
                            border: `1px solid ${getStatusColor(post.status)}40`
                          }}
                        >
                          {getStatusLabel(post.status)}
                        </div>
                      </div>

                      <div className="adv-post-title">{post.title}</div>

                      <div className="adv-post-meta">
                        <span className={`tag-micro ${post.generation === 'AI' ? 'tag-purple' : 'tag-green'}`}>
                          {post.generation === 'AI' ? '🤖 IA' : '✍️ MANUEL'}
                        </span>
                        <span className="adv-client-pill">{post.client}</span>
                        {post.format && <span className="tag-micro tag-blue">{post.format}</span>}
                        {post.campaign && <span className="adv-campaign-tag">{post.campaign}</span>}
                      </div>
                      
                      <div className="adv-post-body">
                        <p className="adv-post-desc flex-1">
                          {post.desc || post.description || 'Aucun texte de publication spécifié.'}
                        </p>
                        {post.image && (
                          <div 
                            className="adv-post-thumb" 
                            style={{ backgroundImage: `url(${post.image})` }}
                            title="Aperçu visuel"
                          />
                        )}
                      </div>
                      
                      <div className="adv-post-footer">
                        <div className="adv-post-actions-left">
                          <button 
                            className="btn-icon-sm" 
                            title="Visualiser les détails"
                            onClick={() => setViewModalPost(post)}
                          >
                            👁 Voir
                          </button>
                          <button 
                            className="btn-icon-sm" 
                            title="Modifier cette publication"
                            onClick={() => handleOpenEditModal(post)}
                          >
                            ✏️ Éditer
                          </button>
                        </div>
                        
                        <button 
                          className="btn-icon-sm btn-danger" 
                          title="Supprimer"
                          onClick={() => setDeleteModalPost(post)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty state & quick add button */}
                  {dayPosts.length === 0 && (
                    <div 
                      className="adv-cal-empty-day"
                      onClick={() => handleOpenCreateModal(col.dateObj)}
                    >
                      <span className="font-bold text-lg">+</span>
                      <span className="text-xs font-semibold">Ajouter un post</span>
                    </div>
                  )}

                  <button 
                    className="adv-cal-add-col-btn"
                    onClick={() => handleOpenCreateModal(col.dateObj)}
                  >
                    ➕ Planifier pour ce jour
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── VIEW 3: DAY (JOUR) ─── */}
      {viewMode === 'day' && (
        <div className="adv-day-container animate-fade" id="adv-day-view">
          {/* Day summary header */}
          {(() => {
            const dateStr = formatDateToYMD(currentDate);
            const dayPosts = filteredPosts.filter(p => {
              const pDate = getPostDateStr(p);
              return pDate === dateStr || p.day === currentDate.getDate();
            });

            const publishedCount = dayPosts.filter(p => p.status === 'PUBLISHED').length;
            const scheduledCount = dayPosts.filter(p => p.status === 'SCHEDULED').length;
            const pendingCount = dayPosts.filter(p => p.status === 'PENDING').length;
            const draftCount = dayPosts.filter(p => p.status === 'DRAFT').length;

            return (
              <>
                <div className="adv-day-header-card">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">
                      {currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </h2>
                    <p className="text-sm text-muted">
                      Vue détaillée horaire des publications programmées et publiées.
                    </p>
                  </div>

                  <div className="adv-day-stats">
                    <div className="adv-day-stat-item">
                      <span className="adv-day-stat-val text-white">{dayPosts.length}</span>
                      <span className="adv-day-stat-label">Total</span>
                    </div>
                    <div className="adv-day-stat-item">
                      <span className="adv-day-stat-val text-green-400">{publishedCount}</span>
                      <span className="adv-day-stat-label">Publiés</span>
                    </div>
                    <div className="adv-day-stat-item">
                      <span className="adv-day-stat-val text-blue-400">{scheduledCount}</span>
                      <span className="adv-day-stat-label">Programmés</span>
                    </div>
                    <div className="adv-day-stat-item">
                      <span className="adv-day-stat-val text-yellow-400">{pendingCount}</span>
                      <span className="adv-day-stat-label">En attente</span>
                    </div>
                    <div className="adv-day-stat-item">
                      <span className="adv-day-stat-val text-slate-400">{draftCount}</span>
                      <span className="adv-day-stat-label">Brouillons</span>
                    </div>
                  </div>
                </div>

                {/* Hourly Timeline */}
                <div className="adv-day-timeline">
                  {dayHours.map(hour => {
                    const hourPrefix = hour.split(':')[0];
                    const hourPosts = dayPosts.filter(p => {
                      const postHour = (p.time || '10:00').split(':')[0];
                      return postHour === hourPrefix;
                    });

                    return (
                      <div key={hour} className="adv-day-hour-row">
                        <div className="adv-day-hour-label">{hour}</div>
                        
                        <div className="adv-day-hour-content">
                          {hourPosts.map(post => (
                            <div key={post.id} className="adv-day-card animate-fade">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-8">
                                    <span className="text-base">{getPlatformIcon(post.canal)}</span>
                                    <span className="font-bold text-sm text-white">{post.canal}</span>
                                    <span className="adv-client-pill">{post.client}</span>
                                    <span className={`tag-micro ${post.generation === 'AI' ? 'tag-purple' : 'tag-green'}`}>
                                      {post.generation === 'AI' ? '🤖 IA' : '✍️ MANUEL'}
                                    </span>
                                    {post.campaign && <span className="adv-campaign-tag">{post.campaign}</span>}
                                  </div>
                                  
                                  <div 
                                    className="adv-post-status" 
                                    style={{ 
                                      color: getStatusColor(post.status),
                                      background: `${getStatusColor(post.status)}18`,
                                      border: `1px solid ${getStatusColor(post.status)}40`
                                    }}
                                  >
                                    {getStatusLabel(post.status)}
                                  </div>
                                </div>

                                <div className="font-bold text-base text-white mb-6">
                                  {post.title}
                                </div>

                                <p className="text-sm text-slate-300 mb-10 leading-relaxed">
                                  {post.desc || post.description || 'Aucun texte descriptif.'}
                                </p>

                                <div className="flex items-center gap-8">
                                  <button 
                                    className="btn-icon-sm"
                                    onClick={() => setViewModalPost(post)}
                                  >
                                    👁 Visualiser
                                  </button>
                                  <button 
                                    className="btn-icon-sm"
                                    onClick={() => handleOpenEditModal(post)}
                                  >
                                    ✏️ Modifier
                                  </button>
                                  <button 
                                    className="btn-icon-sm btn-danger"
                                    onClick={() => setDeleteModalPost(post)}
                                  >
                                    🗑 Supprimer
                                  </button>
                                  {post.status !== 'PUBLISHED' && (
                                    <button 
                                      className="btn-icon-sm"
                                      style={{ color: '#27ae60', borderColor: '#27ae6050' }}
                                      onClick={() => handleQuickStatusChange(post.id, 'PUBLISHED')}
                                    >
                                      🚀 Publier immédiatement
                                    </button>
                                  )}
                                </div>
                              </div>

                              {post.image && (
                                <div 
                                  className="w-32 h-28 rounded-lg bg-cover bg-center border border-white/10 flex-shrink-0"
                                  style={{ backgroundImage: `url(${post.image})` }}
                                />
                              )}
                            </div>
                          ))}

                          {hourPosts.length === 0 && (
                            <div 
                              className="adv-day-empty-slot"
                              onClick={() => handleOpenCreateModal(currentDate, hour)}
                            >
                              <span>+</span>
                              <span>Planifier une publication à {hour}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* ─── MODAL 1: VISUALISATION / VIEW POST ─── */}
      {viewModalPost && (
        <div className="adv-modal-overlay" onClick={() => setViewModalPost(null)}>
          <div className="adv-modal animate-fade" onClick={e => e.stopPropagation()}>
            <div className="adv-modal-header">
              <h2 className="adv-modal-title">
                <span>{getPlatformIcon(viewModalPost.canal)}</span>
                <span>Détail de la Publication</span>
              </h2>
              <button className="adv-modal-close" onClick={() => setViewModalPost(null)}>✕</button>
            </div>

            <div className="adv-modal-body">
              {/* Hero details */}
              <div className="adv-detail-hero">
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    {viewModalPost.title}
                  </div>
                  <div className="flex items-center gap-8 flex-wrap">
                    <span className="adv-client-pill font-semibold">🏢 {viewModalPost.client}</span>
                    <span className="tag-micro tag-blue">📱 {viewModalPost.canal}</span>
                    <span className="tag-micro tag-orange">📐 {viewModalPost.format || 'Paysage'}</span>
                    <span className={`tag-micro ${viewModalPost.generation === 'AI' ? 'tag-purple' : 'tag-green'}`}>
                      {viewModalPost.generation === 'AI' ? '🤖 Généré par IA' : '✍️ Rédaction Manuelle'}
                    </span>
                    {viewModalPost.campaign && (
                      <span className="adv-campaign-tag">🎯 {viewModalPost.campaign}</span>
                    )}
                  </div>
                </div>

                <div 
                  className="adv-post-status text-sm" 
                  style={{ 
                    color: getStatusColor(viewModalPost.status),
                    background: `${getStatusColor(viewModalPost.status)}20`,
                    border: `1px solid ${getStatusColor(viewModalPost.status)}50`
                  }}
                >
                  {getStatusLabel(viewModalPost.status)}
                </div>
              </div>

              {/* Schedule time */}
              <div className="flex items-center justify-between bg-slate-900/60 p-12 rounded-lg border border-white/5 text-sm">
                <div className="flex items-center gap-8 text-slate-300">
                  <span>📅 <strong>Date cible :</strong> {getPostDateStr(viewModalPost)}</span>
                  <span>⏰ <strong>Heure :</strong> {viewModalPost.time || '10:00'}</span>
                </div>
                <div className="text-xs text-muted">
                  ID: #{viewModalPost.id}
                </div>
              </div>

              {/* Media preview if available */}
              {viewModalPost.image && (
                <div className="adv-detail-image-box">
                  <img src={viewModalPost.image} alt={viewModalPost.title} />
                </div>
              )}

              {/* Copywriting text */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase mb-6 flex justify-between items-center">
                  <span>Texte du Post / Copywriting</span>
                  {copiedNotification && <span className="text-green-400 text-xs">✓ Copié dans le presse-papier</span>}
                </div>
                <div className="adv-detail-copybox">
                  <button 
                    className="adv-copy-btn"
                    onClick={() => handleCopyDescription(viewModalPost.desc || viewModalPost.description)}
                  >
                    📋 Copier
                  </button>
                  {viewModalPost.desc || viewModalPost.description || 'Aucun contenu de texte saisi pour ce post.'}
                </div>
              </div>

              {/* Quick status change */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase mb-8">
                  Changer le statut rapidement :
                </div>
                <div className="adv-quick-status-selector">
                  {[
                    { key: 'DRAFT', label: '📝 Brouillon' },
                    { key: 'PENDING', label: '⏳ En attente' },
                    { key: 'SCHEDULED', label: '📅 Programmé' },
                    { key: 'PUBLISHED', label: '✅ Publié' },
                  ].map(st => (
                    <button
                      key={st.key}
                      className={`adv-status-btn ${viewModalPost.status === st.key ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange(viewModalPost.id, st.key)}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="adv-modal-footer">
              <button 
                className="btn btn-red btn-sm"
                onClick={() => {
                  setDeleteModalPost(viewModalPost);
                }}
              >
                🗑 Supprimer
              </button>
              <button 
                className="btn btn-blue btn-sm"
                onClick={() => handleOpenEditModal(viewModalPost)}
              >
                ✏️ Modifier la publication
              </button>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setViewModalPost(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: CRÉATION / ÉDITION (CREATE & EDIT MODAL) ─── */}
      {editModalState && (
        <div className="adv-modal-overlay" onClick={() => setEditModalState(null)}>
          <div className="adv-modal animate-fade" onClick={e => e.stopPropagation()}>
            <div className="adv-modal-header">
              <h2 className="adv-modal-title">
                {editModalState.mode === 'create' ? '➕ Nouveau Post au Calendrier' : '✏️ Modifier la Publication'}
              </h2>
              <button className="adv-modal-close" onClick={() => setEditModalState(null)}>✕</button>
            </div>

            <form onSubmit={handleSaveModalForm}>
              <div className="adv-modal-body">
                {/* Title */}
                <div className="pub-form-group">
                  <label className="pub-form-label">Titre de la publication *</label>
                  <input 
                    className="pub-form-input" 
                    type="text" 
                    placeholder="Ex: Campagne Max It — Bonus 100%" 
                    value={editModalState.data.title}
                    onChange={e => setEditModalState({
                      ...editModalState,
                      data: { ...editModalState.data, title: e.target.value }
                    })}
                    required
                    autoFocus
                  />
                </div>

                {/* Client & Platform */}
                <div className="pub-form-row">
                  <div className="pub-form-group">
                    <label className="pub-form-label">Client / Entité *</label>
                    <select 
                      className="pub-form-select" 
                      value={editModalState.data.client}
                      onChange={e => setEditModalState({
                        ...editModalState,
                        data: { ...editModalState.data, client: e.target.value }
                      })}
                    >
                      {calData.clients.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="pub-form-group">
                    <label className="pub-form-label">Canal / Plateforme *</label>
                    <select 
                      className="pub-form-select" 
                      value={editModalState.data.canal}
                      onChange={e => setEditModalState({
                        ...editModalState,
                        data: { ...editModalState.data, canal: e.target.value }
                      })}
                    >
                      {calData.canaux.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Type & Format */}
                <div className="pub-form-row">
                  <div className="pub-form-group">
                    <label className="pub-form-label">Type de contenu</label>
                    <select 
                      className="pub-form-select" 
                      value={editModalState.data.type}
                      onChange={e => setEditModalState({
                        ...editModalState,
                        data: { ...editModalState.data, type: e.target.value }
                      })}
                    >
                      {calData.types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="pub-form-group">
                    <label className="pub-form-label">Format visuel</label>
                    <select 
                      className="pub-form-select" 
                      value={editModalState.data.format}
                      onChange={e => setEditModalState({
                        ...editModalState,
                        data: { ...editModalState.data, format: e.target.value }
                      })}
                    >
                      {calData.formats.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="pub-form-row">
                  <div className="pub-form-group">
                    <label className="pub-form-label">Date de publication *</label>
                    <input 
                      className="pub-form-input" 
                      type="date" 
                      value={editModalState.data.date || '2026-05-19'}
                      onChange={e => setEditModalState({
                        ...editModalState,
                        data: { ...editModalState.data, date: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div className="pub-form-group">
                    <label className="pub-form-label">Heure *</label>
                    <input 
                      className="pub-form-input" 
                      type="time" 
                      value={editModalState.data.time || '10:00'}
                      onChange={e => setEditModalState({
                        ...editModalState,
                        data: { ...editModalState.data, time: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>

                {/* Status & Generation */}
                <div className="pub-form-row">
                  <div className="pub-form-group">
                    <label className="pub-form-label">Statut</label>
                    <select 
                      className="pub-form-select" 
                      value={editModalState.data.status || 'PENDING'}
                      onChange={e => setEditModalState({
                        ...editModalState,
                        data: { ...editModalState.data, status: e.target.value }
                      })}
                    >
                      <option value="DRAFT">📝 Brouillon</option>
                      <option value="PENDING">⏳ En attente</option>
                      <option value="SCHEDULED">📅 Programmé</option>
                      <option value="PUBLISHED">✅ Publié</option>
                    </select>
                  </div>

                  <div className="pub-form-group">
                    <label className="pub-form-label">Mode de création</label>
                    <select 
                      className="pub-form-select" 
                      value={editModalState.data.generation || 'Manual'}
                      onChange={e => setEditModalState({
                        ...editModalState,
                        data: { ...editModalState.data, generation: e.target.value }
                      })}
                    >
                      <option value="Manual">✍️ Rédaction Manuelle</option>
                      <option value="AI">🤖 Généré par IA</option>
                    </select>
                  </div>
                </div>

                {/* Campaign name */}
                <div className="pub-form-group">
                  <label className="pub-form-label">Campagne / Tag (Optionnel)</label>
                  <input 
                    className="pub-form-input" 
                    type="text" 
                    placeholder="Ex: #MaxItBonus2026, #PulseGaming" 
                    value={editModalState.data.campaign || ''}
                    onChange={e => setEditModalState({
                      ...editModalState,
                      data: { ...editModalState.data, campaign: e.target.value }
                    })}
                  />
                </div>

                {/* Image URL with presets */}
                <div className="pub-form-group">
                  <label className="pub-form-label">Image / Visuel (URL)</label>
                  <input 
                    className="pub-form-input" 
                    type="url" 
                    placeholder="https://..." 
                    value={editModalState.data.image || ''}
                    onChange={e => setEditModalState({
                      ...editModalState,
                      data: { ...editModalState.data, image: e.target.value }
                    })}
                  />
                  <div className="flex gap-6 mt-6 flex-wrap items-center text-xs text-slate-400">
                    <span>Présets rapides :</span>
                    {IMAGE_PRESETS.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        className="btn-icon-sm text-xs py-2 px-6"
                        onClick={() => setEditModalState({
                          ...editModalState,
                          data: { ...editModalState.data, image: preset.url }
                        })}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description / Copywriting with AI Generator Button */}
                <div className="pub-form-group">
                  <div className="flex justify-between items-center mb-6">
                    <label className="pub-form-label mb-0">Texte / Copywriting</label>
                    <button 
                      type="button" 
                      className="btn-icon-sm text-xs" 
                      style={{ color: '#ff7900', borderColor: '#ff790050' }}
                      onClick={handleGenerateAICaption}
                    >
                      ✨ Suggérer une idée avec l'IA
                    </button>
                  </div>
                  <textarea 
                    className="pub-form-textarea" 
                    rows={4} 
                    placeholder="Rédigez le texte de la publication, emojis, call-to-action et hashtags..." 
                    value={editModalState.data.desc || ''}
                    onChange={e => setEditModalState({
                      ...editModalState,
                      data: { ...editModalState.data, desc: e.target.value }
                    })}
                  />
                  <div className="text-right text-xs text-slate-400 mt-4">
                    {(editModalState.data.desc || '').length} caractères
                  </div>
                </div>
              </div>

              <div className="adv-modal-footer">
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => setEditModalState(null)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-orange"
                >
                  {editModalState.mode === 'create' ? '➕ Créer la publication' : '💾 Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: DELETE CONFIRMATION ─── */}
      {deleteModalPost && (
        <div className="adv-modal-overlay" onClick={() => setDeleteModalPost(null)}>
          <div className="adv-modal adv-modal-sm animate-fade" onClick={e => e.stopPropagation()}>
            <div className="adv-modal-header">
              <h2 className="adv-modal-title text-red-400">
                🗑 Confirmer la suppression
              </h2>
              <button className="adv-modal-close" onClick={() => setDeleteModalPost(null)}>✕</button>
            </div>

            <div className="adv-modal-body text-slate-200">
              <p className="mb-12">
                Êtes-vous sûr de vouloir supprimer définitivement cette publication du calendrier ?
              </p>
              
              <div className="bg-slate-900/80 p-12 rounded-lg border border-white/10 text-sm">
                <div className="font-bold text-white mb-4">
                  {deleteModalPost.title}
                </div>
                <div className="text-xs text-muted flex items-center gap-6">
                  <span>{getPlatformIcon(deleteModalPost.canal)} {deleteModalPost.canal}</span>
                  <span>·</span>
                  <span>🏢 {deleteModalPost.client}</span>
                  <span>·</span>
                  <span>📅 {getPostDateStr(deleteModalPost)} {deleteModalPost.time}</span>
                </div>
              </div>
            </div>

            <div className="adv-modal-footer">
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={() => setDeleteModalPost(null)}
              >
                Annuler
              </button>
              <button 
                type="button" 
                className="btn btn-red" 
                onClick={handleDeletePost}
              >
                🗑 Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
