import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { BRAND_IMAGE_PRESETS, processImageFile } from '../../Calendar/sections/PublicationImageManager';
import '../../Calendar/sections/calendar.css';

// Formattage date sûr YYYY-MM-DD
const formatDateToYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const STORAGE_KEY = 'bridge_influence_calendar_v1';

// Seed initial réaliste centré sur la semaine du 5 au 11 octobre 2026 (date active du système)
const getInitialInfluencePosts = (influencers = []) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Storage parse error', e);
  }

  const findInf = (query) => {
    return influencers.find(inf => 
      (inf.pseudo && inf.pseudo.toLowerCase().includes(query.toLowerCase())) ||
      (inf.name && inf.name.toLowerCase().includes(query.toLowerCase()))
    ) || influencers[0] || null;
  };

  const inf1 = findInf('carles') || { id: 'INF-001', name: 'Carles Antonio', pseudo: '@carlesantonio' };
  const inf2 = findInf('simplest') || { id: 'INF-002', name: 'Simplest Tuthi', pseudo: '@simplesttuthi' };
  const inf3 = findInf('ange_mbayen') || { id: 'INF-003', name: 'Ange Mbayen', pseudo: '@ange_mbayen' };
  const inf4 = findInf('mimie') || { id: 'INF-004', name: 'Mimie', pseudo: '@mimie_officiel' };

  return [
    {
      id: 'INF-POST-101',
      influencerId: inf2.id,
      influencerName: inf2.name || 'Simplest Tuthi',
      influencerPseudo: inf2.pseudo || '@simplesttuthi',
      title: 'Tutoriel Carrousel : Activer la Sécurité Renforcée Orange Money',
      canal: 'Instagram',
      format: 'Post Carrousel',
      date: '2026-10-06',
      time: '11:30',
      day: 6,
      status: 'PUBLISHED',
      campaign: 'Orange Money Sécurité 2026',
      client: 'Orange Cameroun',
      desc: 'Guide visuel pas à pas expliquant la double authentification et les alertes SMS instantanées pour les retraits sécurisés.',
      url: 'https://instagram.com/p/om-securite-2026',
      image: BRAND_IMAGE_PRESETS[1]?.url || '',
      isSponsored: true,
      metrics: {
        views: 48500,
        likes: 3820,
        comments: 294,
        shares: 610,
        rate: '7.8%'
      },
      createdAt: '2026-10-06T08:00:00.000Z'
    },
    {
      id: 'INF-POST-102',
      influencerId: inf3.id,
      influencerName: inf3.name || 'Ange Mbayen',
      influencerPseudo: inf3.pseudo || '@ange_mbayen',
      title: 'Sketch Vidéo : Quand ton pote n\'a plus de Data en plein appel',
      canal: 'TikTok',
      format: 'TikTok sketch',
      date: '2026-10-07',
      time: '18:00',
      day: 7,
      status: 'SCHEDULED',
      campaign: 'Orange Pulse Jeunesse',
      client: 'Orange Cameroun',
      desc: 'Mise en scène humoristique avec chute sur le Pass Pulse Nuit et Maxi Data. Intégration du jingle Orange en outro.',
      url: 'https://tiktok.com/@ange_mbayen/video/orange-pulse-01',
      image: BRAND_IMAGE_PRESETS[2]?.url || '',
      isSponsored: false,
      metrics: { views: 0, likes: 0, comments: 0, shares: 0, rate: '—' },
      createdAt: '2026-10-05T14:20:00.000Z'
    },
    {
      id: 'INF-POST-103',
      influencerId: inf1.id,
      influencerName: inf1.name || 'Carles Antonio',
      influencerPseudo: inf1.pseudo || '@carlesantonio',
      title: 'Reel Dynamique : Les Coulisses du Tournage Orange Weekend',
      canal: 'Instagram',
      format: 'Reel dynamique',
      date: '2026-10-09',
      time: '19:30',
      day: 9,
      status: 'SCHEDULED',
      campaign: 'Orange Weekend Spécial',
      client: 'Orange Cameroun',
      desc: 'Format immersif face cam avec micro cravate, immersion dans une agence Orange et jeu concours pour gagner 100 Go de data.',
      url: '',
      image: BRAND_IMAGE_PRESETS[0]?.url || '',
      isSponsored: true,
      metrics: { views: 0, likes: 0, comments: 0, shares: 0, rate: '—' },
      createdAt: '2026-10-05T16:00:00.000Z'
    },
    {
      id: 'INF-POST-104',
      influencerId: inf4.id,
      influencerName: inf4.name || 'Mimie',
      influencerPseudo: inf4.pseudo || '@mimie_officiel',
      title: 'Story Interactive & Sondage : Quelle est votre playlist pour bosser ?',
      canal: 'Instagram',
      format: 'Story interactive',
      date: '2026-10-08',
      time: '14:00',
      day: 8,
      status: 'PENDING',
      campaign: 'Max it Lifestyle & Musique',
      client: 'Orange Cameroun',
      desc: 'Série de 3 stories avec sticker question, intégration du lien swipe-up vers le catalogue musical de l\'application Max it.',
      url: '',
      image: BRAND_IMAGE_PRESETS[2]?.url || '',
      isSponsored: false,
      metrics: { views: 0, likes: 0, comments: 0, shares: 0, rate: '—' },
      createdAt: '2026-10-06T09:10:00.000Z'
    }
  ];
};

export default function InfluenceCalendrier({
  influencers = [],
  setInfluencers,
  initialInfluencerId = null,
  onSelectInfluencer
}) {
  const { addInfluenceDeliverable, updateInfluenceDeliverable, deleteInfluenceDeliverable } = useApp();

  // Liste garantie d'influenceurs
  const effectiveInfluencers = useMemo(() => {
    if (Array.isArray(influencers) && influencers.length > 0) return influencers;
    return [];
  }, [influencers]);

  // Posts du calendrier
  const [posts, setPosts] = useState(() => getInitialInfluencePosts(effectiveInfluencers));

  // Sauvegarde persistante
  const savePosts = (newPosts) => {
    setPosts(newPosts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
    } catch (e) {
      console.error('Save error', e);
    }
  };

  // State Navigation & Vues (identique au Calendrier CM)
  const [viewMode, setViewMode] = useState('week'); // 'month' | 'week' | 'day'
  const [activeNav, setActiveNav] = useState('calendar'); // 'calendar' | 'queue' | 'drafts' | 'campaigns'
  // Date de référence calée sur la semaine du 6 octobre 2026
  const [currentDate, setCurrentDate] = useState(() => new Date('2026-10-06T10:00:00'));

  // Filtres
  const [selectedInfluencerFilter, setSelectedInfluencerFilter] = useState(() => initialInfluencerId || 'All');
  const [filterCanal, setFilterCanal] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modales
  const [viewModalPost, setViewModalPost] = useState(null);
  const [editModalState, setEditModalState] = useState(null); // { mode: 'create'|'edit', data: {...} }
  const [deleteModalPost, setDeleteModalPost] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [toastNotification, setToastNotification] = useState('');
  const fileInputRef = useRef(null);

  // Synchronisation avec initialInfluencerId si sélectionné depuis l'extérieur
  useEffect(() => {
    if (initialInfluencerId) {
      setSelectedInfluencerFilter(initialInfluencerId);
    }
  }, [initialInfluencerId]);

  const showToast = (msg) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(''), 3000);
  };

  // Safe external URL helper
  const formatExternalUrl = (url) => {
    if (!url) return '#';
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  // Date helper
  const getPostDateStr = (post) => {
    if (post.date) return post.date;
    if (post.day) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}-${String(post.day).padStart(2, '0')}`;
    }
    return formatDateToYMD(currentDate);
  };

  // Titre dynamique de période
  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    }
    if (viewMode === 'week') {
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

  // Gestion du statut et couleurs
  const getStatusColor = (s) => {
    switch (s) {
      case 'PUBLISHED': return '#27ae60';
      case 'SCHEDULED': return '#3498db';
      case 'PENDING': return '#f39c12';
      case 'DRAFT': return '#94a3b8';
      default: return '#3498db';
    }
  };

  const getStatusLabel = (s) => {
    switch (s) {
      case 'PUBLISHED': return '✅ PUBLIÉ';
      case 'SCHEDULED': return '📅 PROGRAMMÉ';
      case 'PENDING': return '⏳ EN VALIDATION';
      case 'DRAFT': return '📝 BROUILLON';
      default: return s || 'PROGRAMMÉ';
    }
  };

  const getPlatformIcon = (canal) => {
    switch (canal) {
      case 'Instagram': return '📸';
      case 'TikTok': return '🎵';
      case 'YouTube': return '▶️';
      case 'Facebook': return '📘';
      case 'X': return '✖️';
      case 'Chaine WhatsApp': return '💬';
      case 'LinkedIn': return '💼';
      default: return '🌐';
    }
  };

  // Navigation calendrier
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
    setCurrentDate(new Date('2026-10-06T10:00:00'));
  };

  // Filtrage des posts
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      // Filtre Influenceur
      if (selectedInfluencerFilter !== 'All') {
        const infIdMatch = String(p.influencerId || '').toLowerCase() === String(selectedInfluencerFilter).toLowerCase();
        const infPseudoMatch = String(p.influencerPseudo || '').toLowerCase().includes(String(selectedInfluencerFilter).toLowerCase().replace(/^@/, ''));
        if (!infIdMatch && !infPseudoMatch) return false;
      }

      // Filtre Canal
      if (filterCanal !== 'All' && p.canal !== filterCanal) return false;

      // Filtre Statut
      if (filterStatus !== 'All' && p.status !== filterStatus) return false;

      // Recherche texte
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchDesc = (p.desc || '').toLowerCase().includes(q);
        const matchInf = (p.influencerName || '').toLowerCase().includes(q) || (p.influencerPseudo || '').toLowerCase().includes(q);
        const matchCamp = (p.campaign || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchInf && !matchCamp) return false;
      }

      // Filtre Top Nav
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
  }, [posts, selectedInfluencerFilter, filterCanal, filterStatus, searchQuery, activeNav]);

  // Jours de la semaine courante pour la vue Semaine
  const weekDays = useMemo(() => {
    const dayOfWeek = currentDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + diffToMonday);

    const names = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
    return names.map((name, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const today = new Date('2026-10-06T10:00:00');
      return {
        name,
        dateObj: d,
        dateStr: formatDateToYMD(d),
        dayNum: d.getDate(),
        isToday: isSameDay(d, today)
      };
    });
  }, [currentDate]);

  // Cellules pour la vue Mois
  const monthCells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysFromPrevMonth = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    const cells = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }

    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      cells.push({
        date: new Date(year, month, d),
        isCurrentMonth: true
      });
    }

    const totalCells = Math.ceil(cells.length / 7) * 7;
    let nextMonthDay = 1;
    while (cells.length < totalCells) {
      cells.push({
        date: new Date(year, month + 1, nextMonthDay++),
        isCurrentMonth: false
      });
    }

    return cells;
  }, [currentDate]);

  // Créneaux horaires pour la vue Jour
  const dayHours = useMemo(() => {
    const hours = [];
    for (let h = 8; h <= 21; h++) {
      hours.push(`${String(h).padStart(2, '0')}:00`);
    }
    return hours;
  }, []);

  // Handlers CRUD
  const handleOpenCreateModal = (presetDate = null, presetTime = '12:00') => {
    const targetDate = presetDate ? formatDateToYMD(presetDate) : formatDateToYMD(currentDate);
    const dayNumber = presetDate ? presetDate.getDate() : currentDate.getDate();

    // Influenceur par défaut
    const defaultInf = effectiveInfluencers.find(i => String(i.id) === String(selectedInfluencerFilter)) || effectiveInfluencers[0] || null;

    setEditModalState({
      mode: 'create',
      data: {
        id: `INF-POST-${Date.now().toString().slice(-5)}`,
        influencerId: defaultInf?.id || '',
        influencerName: defaultInf?.name || defaultInf?.display_name || '',
        influencerPseudo: defaultInf?.pseudo || '',
        title: '',
        canal: filterCanal !== 'All' ? filterCanal : 'Instagram',
        format: 'Reel dynamique',
        date: targetDate,
        time: presetTime,
        day: dayNumber,
        status: 'SCHEDULED',
        campaign: 'Orange Weekend 2026',
        client: 'Orange Cameroun',
        desc: '',
        url: '',
        image: BRAND_IMAGE_PRESETS[0]?.url || '',
        isSponsored: false,
        metrics: { views: 0, likes: 0, comments: 0, shares: 0, rate: '—' }
      }
    });
  };

  const handleOpenEditModal = (post) => {
    setEditModalState({
      mode: 'edit',
      data: {
        ...post,
        date: getPostDateStr(post),
        day: post.day || (post.date ? parseInt(post.date.split('-')[2], 10) : 6)
      }
    });
    if (viewModalPost) setViewModalPost(null);
  };

  const handleSaveModalForm = (e) => {
    e.preventDefault();
    const formData = editModalState.data;
    if (!formData.title.trim()) return;

    // Récupérer les infos de l'influenceur
    const matchedInf = effectiveInfluencers.find(i => String(i.id) === String(formData.influencerId));
    const finalPost = {
      ...formData,
      influencerName: matchedInf?.name || matchedInf?.display_name || formData.influencerName || 'Influenceur Orange',
      influencerPseudo: matchedInf?.pseudo || formData.influencerPseudo || '@orange_talent',
      day: formData.date ? parseInt(formData.date.split('-')[2], 10) : formData.day || 6,
      url: (formData.url || '').trim(),
      updatedAt: new Date().toISOString()
    };

    if (editModalState.mode === 'create') {
      const updated = [finalPost, ...posts];
      savePosts(updated);
      if (addInfluenceDeliverable) {
        addInfluenceDeliverable({
          id: finalPost.id,
          talent_id: finalPost.influencerId,
          title: finalPost.title,
          platform: finalPost.canal.toLowerCase(),
          format: finalPost.format,
          status: finalPost.status === 'PUBLISHED' ? 'publie' : 'programme',
          url: finalPost.url,
          isNewlyCreated: true
        });
      }
      showToast('Publication influence planifiée avec succès !');
    } else {
      const updated = posts.map(p => p.id === finalPost.id ? finalPost : p);
      savePosts(updated);
      if (updateInfluenceDeliverable) {
        updateInfluenceDeliverable(finalPost.id, {
          title: finalPost.title,
          url: finalPost.url,
          status: finalPost.status === 'PUBLISHED' ? 'publie' : 'programme'
        });
      }
      showToast('Publication mise à jour !');
    }

    setEditModalState(null);
  };

  const handleDeletePost = (post) => {
    const updated = posts.filter(p => p.id !== post.id);
    savePosts(updated);
    if (deleteInfluenceDeliverable) {
      deleteInfluenceDeliverable(post.id);
    }
    setDeleteModalPost(null);
    if (viewModalPost?.id === post.id) setViewModalPost(null);
    showToast('Publication retirée du calendrier');
  };

  const handleArchivePost = (post) => {
    setArchivedPosts(prev => [post, ...prev]);
    const updated = posts.filter(p => p.id !== post.id);
    savePosts(updated);
    if (viewModalPost?.id === post.id) setViewModalPost(null);
    showToast('Publication archivée');
  };

  const handleRestoreArchived = (post) => {
    setArchivedPosts(prev => prev.filter(p => p.id !== post.id));
    savePosts([post, ...posts]);
    showToast('Publication restaurée dans le calendrier');
  };

  const handleQuickPublish = (post) => {
    const updatedPost = {
      ...post,
      status: 'PUBLISHED',
      metrics: {
        views: post.metrics?.views || 12500,
        likes: post.metrics?.likes || 980,
        comments: post.metrics?.comments || 64,
        shares: post.metrics?.shares || 112,
        rate: post.metrics?.rate || '8.2%'
      }
    };
    const updated = posts.map(p => p.id === post.id ? updatedPost : p);
    savePosts(updated);
    setViewModalPost(updatedPost);
    showToast('Statut mis à jour : PUBLIÉ en direct ✅');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await processImageFile(file);
      if (editModalState) {
        setEditModalState(prev => ({
          ...prev,
          data: { ...prev.data, image: res.dataUrl }
        }));
      }
    } catch (err) {
      alert(err.message || 'Erreur lors du traitement de l\'image.');
    }
  };

  return (
    <div className="flex flex-col gap-16 animate-fade">
      {/* ─── BANDEAU SUPÉRIEUR MODULE INFLUENCE : PRÉSENTATION & SÉLECTION RAPIDE ─── */}
      <div 
        className="card p-20"
        style={{
          borderRadius: 14,
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 121, 0, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div 
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #FF7900, #E65100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: '0 4px 12px rgba(255, 121, 0, 0.4)'
            }}
          >
            📅
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                Calendrier des Publications & Contenus d'Influence
              </h2>
              <span className="tag tag-orange" style={{ fontSize: 10, fontWeight: 800 }}>
                MODULE INFLUENCE
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#94A3B8' }}>
              Suivi en direct des diffusions programmées, publications certifiées et coordination éditoriale des créateurs Orange Cameroun.
            </p>
          </div>
        </div>

        {/* Sélecteur rapide d'influenceur */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Filtrer sur un créateur :</span>
          <select
            value={selectedInfluencerFilter}
            onChange={(e) => {
              setSelectedInfluencerFilter(e.target.value);
              if (onSelectInfluencer && e.target.value !== 'All') {
                const inf = effectiveInfluencers.find(i => String(i.id) === String(e.target.value));
                if (inf) onSelectInfluencer(inf);
              }
            }}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: '1px solid #FF7900',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <option value="All">👥 Tous les influenceurs ({effectiveInfluencers.length})</option>
            {effectiveInfluencers.map(inf => (
              <option key={inf.id} value={inf.id}>
                {inf.pseudo || inf.name || inf.display_name} — {inf.name || inf.display_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toast Notification */}
      {toastNotification && (
        <div 
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: '#1E293B',
            color: '#FFFFFF',
            border: '1px solid #FF7900',
            borderRadius: 10,
            padding: '12px 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 700,
            fontSize: 13
          }}
          className="animate-fade"
        >
          <span>⚡</span>
          <span>{toastNotification}</span>
        </div>
      )}

      {/* ─── CONTENEUR SOMBRE DU CALENDRIER (MÊME DESIGN ET ARCHITECTURE QUE COMMUNITY MANAGERS) ─── */}
      <div className="adv-calendar-container animate-fade" id="adv-calendar-module">
        {/* ─── 1. TOPBAR NAVIGATION ─── */}
        <div className="adv-cal-topbar">
          <div className="adv-cal-nav">
            <button
              className={activeNav === 'calendar' ? 'active' : ''}
              onClick={() => setActiveNav('calendar')}
            >
              📅 Calendrier
              <span className="adv-nav-count">{posts.length}</span>
            </button>
            <button
              className={activeNav === 'queue' ? 'active' : ''}
              onClick={() => setActiveNav('queue')}
            >
              ⏸ File d'attente
              <span className="adv-nav-count">
                {posts.filter(p => p.status === 'PENDING' || p.status === 'SCHEDULED').length}
              </span>
            </button>
            <button
              className={activeNav === 'drafts' ? 'active' : ''}
              onClick={() => setActiveNav('drafts')}
            >
              📝 Brouillons
              <span className="adv-nav-count">
                {posts.filter(p => p.status === 'DRAFT').length}
              </span>
            </button>
            <button
              className={activeNav === 'campaigns' ? 'active' : ''}
              onClick={() => setActiveNav('campaigns')}
            >
              🚀 Campagnes
              <span className="adv-nav-count">
                {posts.filter(p => Boolean(p.campaign)).length}
              </span>
            </button>
          </div>

          <div className="adv-cal-top-actions">
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => setIsArchiveModalOpen(true)}
              style={{ color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              📁 Archives {archivedPosts.length > 0 && `(${archivedPosts.length})`}
            </button>
            <div className="user-avatar-small" title="Pôle Influence & Ambassadeurs" style={{ background: 'linear-gradient(135deg, #FF7900, #D35400)' }}>
              INF
            </div>
          </div>
        </div>

        {/* ─── 2. BARRE DE CONTRÔLES & FILTRES ─── */}
        <div className="adv-cal-controls">
          <div className="flex items-center gap-16 flex-wrap">
            <div className="adv-cal-date-display">
              <span className="icon">🗓</span>
              <div>
                <div className="text-xs text-muted font-semibold">PLANNING & DIFFUSIONS D'INFLUENCE</div>
                <div className="font-bold text-lg text-white">
                  {getHeaderTitle()}
                </div>
              </div>
            </div>

            {/* Sélecteur de vue : Mois / Semaine / Jour */}
            <div className="adv-cal-view-toggles">
              <button
                className={viewMode === 'month' ? 'active' : ''}
                onClick={() => setViewMode('month')}
              >
                📅 Mois
              </button>
              <button
                className={viewMode === 'week' ? 'active' : ''}
                onClick={() => setViewMode('week')}
              >
                📊 Semaine
              </button>
              <button
                className={viewMode === 'day' ? 'active' : ''}
                onClick={() => setViewMode('day')}
              >
                🕒 Jour
              </button>
            </div>

            {/* Navigation Période : ‹ › Aujourd'hui */}
            <div className="adv-cal-nav-arrows">
              <button onClick={handlePrev} title="Période précédente">‹</button>
              <button onClick={handleNext} title="Période suivante">›</button>
              <button className="btn-today" onClick={handleToday}>
                Aujourd'hui
              </button>
            </div>
          </div>

          {/* Filtres & Actions */}
          <div className="flex items-center gap-10 flex-wrap">
            {/* Recherche */}
            <input
              type="text"
              className="adv-cal-search"
              placeholder="🔍 Rechercher un contenu, influenceur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Filtre Influenceur */}
            <select
              className="adv-cal-select"
              value={selectedInfluencerFilter}
              onChange={(e) => setSelectedInfluencerFilter(e.target.value)}
            >
              <option value="All">👥 Tous les Influenceurs</option>
              {effectiveInfluencers.map(inf => (
                <option key={inf.id} value={inf.id}>
                  {inf.pseudo || inf.name || inf.display_name}
                </option>
              ))}
            </select>

            {/* Filtre Canal */}
            <select
              className="adv-cal-select"
              value={filterCanal}
              onChange={(e) => setFilterCanal(e.target.value)}
            >
              <option value="All">📱 Tous les Canaux</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Facebook">Facebook</option>
              <option value="X">X (Twitter)</option>
              <option value="Chaine WhatsApp">Chaine WhatsApp</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>

            {/* Filtre Statut */}
            <select
              className="adv-cal-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">🚦 Tous les Statuts</option>
              <option value="PUBLISHED">✅ Publié</option>
              <option value="SCHEDULED">📅 Programmé</option>
              <option value="PENDING">⏳ En validation</option>
              <option value="DRAFT">📝 Brouillon</option>
            </select>

            {/* Bouton Nouveau Post Influence */}
            <button
              className="btn btn-orange btn-sm"
              onClick={() => handleOpenCreateModal()}
              style={{ fontWeight: 800, whiteSpace: 'nowrap' }}
            >
              ➕ Nouveau Contenu Influence
            </button>
          </div>
        </div>

        {/* ─── 3. VUE 1 : MOIS (MONTH) ─── */}
        {viewMode === 'month' && (
          <div className="adv-month-container animate-fade">
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
                const isToday = isSameDay(cell.date, new Date('2026-10-06T10:00:00'));

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
                        title="Programmer une publication ce jour"
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
                          title={`${post.influencerPseudo} : ${post.title} — ${post.canal} (${post.time})`}
                        >
                          <span>{getPlatformIcon(post.canal)}</span>
                          <span className="adv-chip-time">{post.time}</span>
                          <span className="adv-chip-title">
                            <strong>{post.influencerPseudo}</strong> : {post.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── 4. VUE 2 : SEMAINE (WEEK) — IDENTIQUE AU SCREENSHOT 1 ─── */}
        {viewMode === 'week' && (
          <div className="adv-cal-grid animate-fade">
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

                        {/* Tag Créateur / Ambassadeur */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0 4px 0' }}>
                          <span style={{ fontSize: 13 }}>👑</span>
                          <strong style={{ fontSize: 12, color: '#FF7900' }}>
                            {post.influencerPseudo || post.influencerName}
                          </strong>
                          {post.influencerName && post.influencerPseudo && (
                            <span style={{ fontSize: 11, color: '#94A3B8' }}>
                              ({post.influencerName.split(' ')[0]})
                            </span>
                          )}
                        </div>

                        <div className="adv-post-title" style={{ fontSize: 13, fontWeight: 700 }}>
                          {post.title}
                        </div>

                        <div className="adv-post-meta">
                          {post.format && <span className="tag-micro tag-purple">{post.format}</span>}
                          {post.campaign && <span className="adv-campaign-tag">{post.campaign}</span>}
                          {post.isSponsored && (
                            <span 
                              className="tag-micro" 
                              style={{ background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.45)' }}
                              title="Contenu boosté / rémunéré"
                            >
                              ⚡ Sponsoring
                            </span>
                          )}
                        </div>

                        <div className="adv-post-body">
                          <p className="adv-post-desc flex-1">
                            {post.desc || 'Aucun texte de publication ou brief spécifié.'}
                          </p>
                          {post.image && (
                            <div
                              className="adv-post-thumb"
                              style={{ backgroundImage: `url(${post.image})` }}
                              title="Aperçu visuel"
                            />
                          )}
                        </div>

                        {/* Métriques si post publié */}
                        {post.status === 'PUBLISHED' && post.metrics?.views > 0 && (
                          <div 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: 10.5,
                              color: '#94A3B8',
                              background: 'rgba(255,255,255,0.03)',
                              padding: '4px 8px',
                              borderRadius: 6,
                              margin: '6px 0',
                              border: '1px solid rgba(255,255,255,0.05)'
                            }}
                          >
                            <span>👁 <strong>{post.metrics.views.toLocaleString()}</strong> vues</span>
                            <span>❤️ <strong>{post.metrics.likes.toLocaleString()}</strong></span>
                            <span>💬 <strong>{post.metrics.comments}</strong></span>
                            <span style={{ color: '#2ECC71', fontWeight: 700 }}>{post.metrics.rate}</span>
                          </div>
                        )}

                        <div className="adv-post-footer">
                          <div className="adv-post-actions-left">
                            <button
                              className="btn-icon-sm"
                              title="Consulter les détails complets"
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
                            {post.url && (
                              <a
                                href={formatExternalUrl(post.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-icon-sm"
                                style={{ color: '#ff9233', borderColor: 'rgba(255, 121, 0, 0.35)' }}
                                title="Voir la publication sur le réseau"
                                onClick={(e) => e.stopPropagation()}
                              >
                                🌐 Lien ↗
                              </a>
                            )}
                          </div>

                          <button
                            className="btn-icon-sm btn-danger"
                            title="Supprimer du calendrier"
                            onClick={() => setDeleteModalPost(post)}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* État vide du jour & bouton rapide (Exactement comme Screenshot 1) */}
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

        {/* ─── 5. VUE 3 : JOUR (DAY) ─── */}
        {viewMode === 'day' && (
          <div className="adv-day-container animate-fade">
            <div className="adv-day-timeline">
              {dayHours.map((hour) => {
                const currentDateStr = formatDateToYMD(currentDate);
                const hourPosts = filteredPosts.filter(p => {
                  const pDate = getPostDateStr(p);
                  const isDay = pDate === currentDateStr || p.day === currentDate.getDate();
                  const pTimePrefix = (p.time || '12:00').split(':')[0];
                  const hourPrefix = hour.split(':')[0];
                  return isDay && pTimePrefix === hourPrefix;
                });

                return (
                  <div key={hour} className="adv-day-hour-row">
                    <div className="adv-day-hour-label">{hour}</div>
                    <div className="adv-day-hour-content">
                      {hourPosts.map(post => (
                        <div
                          key={post.id}
                          className="adv-post-card mb-8 animate-fade"
                          style={{ maxWidth: 640 }}
                        >
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

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0 4px 0' }}>
                            <span style={{ fontSize: 13 }}>👑</span>
                            <strong style={{ fontSize: 13, color: '#FF7900' }}>{post.influencerPseudo}</strong>
                            <span style={{ fontSize: 12, color: '#94A3B8' }}>— {post.influencerName}</span>
                          </div>

                          <div className="adv-post-title">{post.title}</div>

                          <p className="adv-post-desc">
                            {post.desc || 'Aucune consigne de publication spécifiée.'}
                          </p>

                          <div className="adv-post-footer">
                            <div className="adv-post-actions-left">
                              <button className="btn-icon-sm" onClick={() => setViewModalPost(post)}>
                                👁 Voir
                              </button>
                              <button className="btn-icon-sm" onClick={() => handleOpenEditModal(post)}>
                                ✏️ Éditer
                              </button>
                              {post.url && (
                                <a
                                  href={formatExternalUrl(post.url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-icon-sm"
                                  style={{ color: '#FF7900' }}
                                >
                                  🌐 Lien ↗
                                </a>
                              )}
                            </div>
                            <button
                              className="btn-icon-sm btn-danger"
                              onClick={() => setDeleteModalPost(post)}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}

                      {hourPosts.length === 0 && (
                        <div
                          className="adv-day-empty-slot"
                          onClick={() => handleOpenCreateModal(currentDate, hour)}
                        >
                          + Planifier un contenu influence à {hour}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── MODALE DÉTAIL / APERÇU COMPLET DE PUBLICATION ─── */}
      {viewModalPost && (
        <div 
          className="modal-backdrop animate-fade"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewModalPost(null);
          }}
        >
          <div 
            className="card animate-fade"
            style={{
              width: '100%',
              maxWidth: 720,
              maxHeight: '92vh',
              overflowY: 'auto',
              borderRadius: 14,
              padding: 24,
              background: '#151821',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 48px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{getPlatformIcon(viewModalPost.canal)}</span>
                  <span className="tag tag-orange">{viewModalPost.canal}</span>
                  <span
                    className="tag"
                    style={{
                      color: getStatusColor(viewModalPost.status),
                      background: `${getStatusColor(viewModalPost.status)}20`,
                      border: `1px solid ${getStatusColor(viewModalPost.status)}50`
                    }}
                  >
                    {getStatusLabel(viewModalPost.status)}
                  </span>
                  {viewModalPost.isSponsored && (
                    <span className="tag tag-yellow">⚡ Sponsoring Actif</span>
                  )}
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>
                  {viewModalPost.title}
                </h3>
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setViewModalPost(null)}
                style={{ color: '#94A3B8', fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            {/* Infos Influenceur */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 18
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div 
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#FF7900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 14,
                    color: '#fff'
                  }}
                >
                  {viewModalPost.influencerPseudo ? viewModalPost.influencerPseudo.replace('@', '').slice(0, 2).toUpperCase() : 'IN'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: 14 }}>
                    {viewModalPost.influencerPseudo}
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>
                    {viewModalPost.influencerName} · Format : <strong>{viewModalPost.format}</strong>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: 12 }}>
                <div style={{ color: '#94A3B8' }}>Diffusion programmée :</div>
                <div style={{ color: '#FF7900', fontWeight: 800 }}>
                  {viewModalPost.date} à {viewModalPost.time}
                </div>
              </div>
            </div>

            {/* Image / Visuel si présent */}
            {viewModalPost.image && (
              <div style={{ marginBottom: 18, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img 
                  src={viewModalPost.image} 
                  alt={viewModalPost.title} 
                  style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            {/* Texte / Brief */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Texte de la publication & Légende
              </div>
              <div 
                style={{
                  padding: 14,
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: 13,
                  color: '#E2E8F0',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {viewModalPost.desc || 'Aucun texte renseigné.'}
              </div>
            </div>

            {/* Métriques si publié */}
            {viewModalPost.status === 'PUBLISHED' && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
                  Performances Réelles Certifiées
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>VUES TOTALES</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#FF7900', marginTop: 2 }}>
                      {viewModalPost.metrics?.views?.toLocaleString() || '—'}
                    </div>
                  </div>
                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>LIKES</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
                      {viewModalPost.metrics?.likes?.toLocaleString() || '—'}
                    </div>
                  </div>
                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>COMMENTAIRES</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
                      {viewModalPost.metrics?.comments?.toLocaleString() || '—'}
                    </div>
                  </div>
                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>TAUX SUR VUES</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#2ECC71', marginTop: 2 }}>
                      {viewModalPost.metrics?.rate || '—'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions modale */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {viewModalPost.status !== 'PUBLISHED' && (
                  <button
                    className="btn btn-sm"
                    style={{ background: '#27AE60', color: '#fff', fontWeight: 800 }}
                    onClick={() => handleQuickPublish(viewModalPost)}
                  >
                    ✅ Marquer comme Publié
                  </button>
                )}
                {viewModalPost.url && (
                  <a
                    href={formatExternalUrl(viewModalPost.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: 'transparent', border: '1px solid #FF7900', color: '#FF7900', fontWeight: 700 }}
                  >
                    🌐 Ouvrir sur {viewModalPost.canal} ↗
                  </a>
                )}
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#94A3B8' }}
                  onClick={() => handleArchivePost(viewModalPost)}
                >
                  📁 Archiver
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-sm"
                  style={{ background: '#334155', color: '#fff' }}
                  onClick={() => handleOpenEditModal(viewModalPost)}
                >
                  ✏️ Modifier
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: '#E74C3C', color: '#fff' }}
                  onClick={() => {
                    setDeleteModalPost(viewModalPost);
                  }}
                >
                  🗑 Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODALE CRÉATION & ÉDITION DE PUBLICATION ─── */}
      {editModalState && (
        <div 
          className="modal-backdrop animate-fade"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditModalState(null);
          }}
        >
          <div 
            className="card animate-fade"
            style={{
              width: '100%',
              maxWidth: 760,
              maxHeight: '92vh',
              overflowY: 'auto',
              borderRadius: 14,
              padding: 24,
              background: '#151821',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 48px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 14, marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#FFFFFF' }}>
                  {editModalState.mode === 'create' ? '➕ Planifier une Nouvelle Publication Influence' : '✏️ Modifier la Publication Influence'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94A3B8' }}>
                  Configuration certifiée de la diffusion, assignation créateur et canaux Orange Cameroun.
                </p>
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setEditModalState(null)}
                style={{ color: '#94A3B8', fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModalForm}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 16 }}>
                {/* Influenceur */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Influenceur / Ambassadeur *
                  </label>
                  <select
                    required
                    className="adv-cal-select"
                    style={{ width: '100%', padding: '10px 12px' }}
                    value={editModalState.data.influencerId}
                    onChange={(e) => {
                      const sel = effectiveInfluencers.find(i => String(i.id) === String(e.target.value));
                      setEditModalState(prev => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          influencerId: e.target.value,
                          influencerName: sel?.name || sel?.display_name || '',
                          influencerPseudo: sel?.pseudo || ''
                        }
                      }));
                    }}
                  >
                    <option value="">Sélectionner un talent...</option>
                    {effectiveInfluencers.map(inf => (
                      <option key={inf.id} value={inf.id}>
                        {inf.pseudo || inf.name || inf.display_name} ({inf.name || inf.display_name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Canal */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Réseau Social & Canal *
                  </label>
                  <select
                    className="adv-cal-select"
                    style={{ width: '100%', padding: '10px 12px' }}
                    value={editModalState.data.canal}
                    onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, canal: e.target.value } }))}
                  >
                    <option value="Instagram">📸 Instagram</option>
                    <option value="TikTok">🎵 TikTok</option>
                    <option value="YouTube">▶️ YouTube</option>
                    <option value="Facebook">📘 Facebook</option>
                    <option value="X">✖️ X (Twitter)</option>
                    <option value="Chaine WhatsApp">💬 Chaine WhatsApp</option>
                    <option value="LinkedIn">💼 LinkedIn</option>
                  </select>
                </div>
              </div>

              {/* Titre */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                  Titre du Contenu / Angle Éditorial *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Sketch Reel Orange Pulse - Les Gigas qui ne finissent pas"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#0F172A',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: 13
                  }}
                  value={editModalState.data.title}
                  onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))}
                />
              </div>

              {/* Format, Date, Heure, Statut */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Format
                  </label>
                  <select
                    className="adv-cal-select"
                    style={{ width: '100%', padding: '9px 10px' }}
                    value={editModalState.data.format}
                    onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, format: e.target.value } }))}
                  >
                    <option value="Reel dynamique">Reel dynamique</option>
                    <option value="TikTok sketch">TikTok sketch</option>
                    <option value="Story interactive">Story interactive</option>
                    <option value="Vidéo longue YouTube">Vidéo longue YouTube</option>
                    <option value="Post Carrousel">Post Carrousel</option>
                    <option value="Post Photo">Post Photo / Visuel</option>
                    <option value="Live streaming">Live streaming</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Date de diffusion *
                  </label>
                  <input
                    type="date"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: 8,
                      background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: 12.5
                    }}
                    value={editModalState.data.date}
                    onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, date: e.target.value } }))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Horaire (Heure)
                  </label>
                  <input
                    type="time"
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: 8,
                      background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: 12.5
                    }}
                    value={editModalState.data.time}
                    onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, time: e.target.value } }))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Statut initial
                  </label>
                  <select
                    className="adv-cal-select"
                    style={{ width: '100%', padding: '9px 10px' }}
                    value={editModalState.data.status}
                    onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, status: e.target.value } }))}
                  >
                    <option value="SCHEDULED">📅 Programmé</option>
                    <option value="PENDING">⏳ En validation BAT</option>
                    <option value="PUBLISHED">✅ Publié</option>
                    <option value="DRAFT">📝 Brouillon</option>
                  </select>
                </div>
              </div>

              {/* Campagne & Lien */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Dispositif / Campagne
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Orange Pulse Jeunesse 2026"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: 12.5
                    }}
                    value={editModalState.data.campaign}
                    onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, campaign: e.target.value } }))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Lien direct de publication (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/p/... ou lien BAT Drive"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: 12.5
                    }}
                    value={editModalState.data.url}
                    onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, url: e.target.value } }))}
                  />
                </div>
              </div>

              {/* Brief & Légende */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#CBD5E1' }}>
                    Brief & Légende de la publication
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      style={{ fontSize: 11, background: '#1E293B', border: '1px solid #334155', color: '#FF7900', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}
                      onClick={() => {
                        const current = editModalState.data.desc || '';
                        setEditModalState(prev => ({
                          ...prev,
                          data: { ...prev.data, desc: current + '\n#OrangeCameroun #OrangeMoney #Pulse' }
                        }));
                      }}
                    >
                      + Hashtags Orange
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  placeholder="Consignes précises, script ou légende avec mentions (@OrangeCameroun) et call-to-action..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#0F172A',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: 12.5,
                    lineHeight: 1.5
                  }}
                  value={editModalState.data.desc}
                  onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, desc: e.target.value } }))}
                />
              </div>

              {/* Visuel & Presets */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                  Visuel / Aperçu média
                </label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ background: '#334155', color: '#fff', fontSize: 12 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📁 Importer un visuel local
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />

                  {BRAND_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: editModalState.data.image === preset.url ? '#FF7900' : '#1E293B',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.15)',
                        fontSize: 11,
                        cursor: 'pointer'
                      }}
                      onClick={() => setEditModalState(prev => ({ ...prev, data: { ...prev.data, image: preset.url } }))}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {editModalState.data.image && (
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img 
                      src={editModalState.data.image} 
                      alt="Aperçu" 
                      style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 6, border: '1px solid #FF7900' }}
                    />
                    <button
                      type="button"
                      style={{ background: 'transparent', border: 'none', color: '#E74C3C', fontSize: 11, cursor: 'pointer' }}
                      onClick={() => setEditModalState(prev => ({ ...prev, data: { ...prev.data, image: '' } }))}
                    >
                      ✕ Retirer le visuel
                    </button>
                  </div>
                )}
              </div>

              {/* Sponsoring Toggle */}
              <div 
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(255, 121, 0, 0.08)',
                  border: '1px solid rgba(255, 121, 0, 0.25)',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <input
                  type="checkbox"
                  id="chk-sponsor"
                  checked={editModalState.data.isSponsored}
                  onChange={(e) => setEditModalState(prev => ({ ...prev, data: { ...prev.data, isSponsored: e.target.checked } }))}
                  style={{ width: 16, height: 16, accentColor: '#FF7900', cursor: 'pointer' }}
                />
                <label htmlFor="chk-sponsor" style={{ fontSize: 12.5, color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>
                  ⚡ Activer le Sponsoring Média / Boost Ads sur cette publication
                </label>
              </div>

              {/* Boutons validation */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setEditModalState(null)}
                  style={{ color: '#94A3B8' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-orange btn-sm"
                  style={{ fontWeight: 800, padding: '8px 24px' }}
                >
                  {editModalState.mode === 'create' ? 'Enregistrer dans le Calendrier' : 'Sauvegarder les Modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODALE DE CONFIRMATION DE SUPPRESSION ─── */}
      {deleteModalPost && (
        <div 
          className="modal-backdrop animate-fade"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
        >
          <div 
            className="card animate-fade"
            style={{
              width: '100%',
              maxWidth: 440,
              padding: 24,
              background: '#151821',
              color: '#FFFFFF',
              borderRadius: 14,
              border: '1px solid #E74C3C',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>🗑</div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Retirer du calendrier ?</h3>
            <p style={{ margin: '8px 0 20px 0', fontSize: 12.5, color: '#94A3B8' }}>
              Êtes-vous sûr de vouloir supprimer la publication <strong>"{deleteModalPost.title}"</strong> de {deleteModalPost.influencerPseudo} ?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDeleteModalPost(null)}
                style={{ color: '#94A3B8' }}
              >
                Annuler
              </button>
              <button
                className="btn btn-sm"
                style={{ background: '#E74C3C', color: '#fff', fontWeight: 800 }}
                onClick={() => handleDeletePost(deleteModalPost)}
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODALE ARCHIVES ─── */}
      {isArchiveModalOpen && (
        <div 
          className="modal-backdrop animate-fade"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsArchiveModalOpen(false);
          }}
        >
          <div 
            className="card animate-fade"
            style={{
              width: '100%',
              maxWidth: 620,
              maxHeight: '85vh',
              overflowY: 'auto',
              borderRadius: 14,
              padding: 24,
              background: '#151821',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                📂 Publications Archivées ({archivedPosts.length})
              </h3>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setIsArchiveModalOpen(false)}
                style={{ color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            {archivedPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#94A3B8', fontSize: 13 }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>🗂</span>
                Aucune publication archivée pour le moment.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {archivedPosts.map(p => (
                  <div 
                    key={p.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{p.title}</div>
                      <div style={{ fontSize: 11.5, color: '#94A3B8' }}>
                        {p.influencerPseudo} · {p.canal} · {p.date}
                      </div>
                    </div>
                    <button
                      className="btn btn-sm"
                      style={{ background: '#FF7900', color: '#fff', fontSize: 11, fontWeight: 700 }}
                      onClick={() => handleRestoreArchived(p)}
                    >
                      Restaurer ↩
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
