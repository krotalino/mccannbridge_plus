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

// Ne charge que les publications réellement créées par l'utilisateur (exclut tout exemple ou démo)
const getInitialInfluencePosts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(p =>
          p &&
          p.isNewlyCreated === true &&
          !p.isDemo &&
          !p.isExample &&
          !['INF-POST-101', 'INF-POST-102', 'INF-POST-103', 'INF-POST-104'].includes(p.id)
        );
      }
    }
  } catch (e) {
    console.error('Storage parse error', e);
  }
  return [];
};

// Trouver le livrable correspondant dans influenceDeliverables (source de vérité pour Performances & KPIs)
export const findMatchingDeliverable = (post, deliverables = []) => {
  if (!post || !Array.isArray(deliverables)) return null;
  return deliverables.find(d =>
    d &&
    (d.id === post.id ||
     d.id === post.deliverableId ||
     post.deliverableId === d.id ||
     (d.title && post.title && d.title.trim().toLowerCase() === post.title.trim().toLowerCase()))
  ) || null;
};

// Récupération certifiée et normalisée des métriques de performance
export const getPostCertifiedMetrics = (post, deliverables = []) => {
  if (!post) {
    return { views: 0, likes: 0, comments: 0, shares: 0, calculatedEngagement: 0, rate: '—' };
  }
  const matchingDeliv = findMatchingDeliverable(post, deliverables);

  // Si le livrable existe dans la section Performances & KPIs, ses chiffres font foi
  const views = matchingDeliv?.metrics?.views ?? post?.metrics?.views ?? 0;
  const likes = matchingDeliv?.metrics?.likes ?? post?.metrics?.likes ?? 0;
  const comments = matchingDeliv?.metrics?.comments ?? post?.metrics?.comments ?? 0;
  const shares = matchingDeliv?.metrics?.shares ?? post?.metrics?.shares ?? 0;
  const calculatedEngagement = (Number(likes) || 0) + (Number(comments) || 0) + (Number(shares) || 0);

  let engagementRate = '—';
  if (matchingDeliv?.metrics?.engagement_rate !== null && matchingDeliv?.metrics?.engagement_rate !== undefined) {
    engagementRate = `${matchingDeliv.metrics.engagement_rate}%`;
  } else if (Number(views) > 0) {
    engagementRate = `${((calculatedEngagement / Number(views)) * 100).toFixed(2)}%`;
  } else if (post?.metrics?.rate && post.metrics.rate !== '—') {
    engagementRate = post.metrics.rate;
  }

  return {
    views: Number(views) || 0,
    likes: Number(likes) || 0,
    comments: Number(comments) || 0,
    shares: Number(shares) || 0,
    calculatedEngagement,
    rate: engagementRate,
    matchingDeliverable: matchingDeliv
  };
};

export default function InfluenceCalendrier({
  influencers = [],
  setInfluencers,
  initialInfluencerId = null,
  onSelectInfluencer
}) {
  const { influenceDeliverables = [], addInfluenceDeliverable, updateInfluenceDeliverable, deleteInfluenceDeliverable } = useApp();

  // Liste garantie d'influenceurs
  const effectiveInfluencers = useMemo(() => {
    if (Array.isArray(influencers) && influencers.length > 0) return influencers;
    return [];
  }, [influencers]);

  // Posts du calendrier : uniquement les créations réelles
  const [posts, setPosts] = useState(getInitialInfluencePosts);

  // Nettoyage immédiat de tout exemple résiduel dans le stockage local au chargement
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(p =>
            p &&
            p.isNewlyCreated === true &&
            !p.isDemo &&
            !p.isExample &&
            !['INF-POST-101', 'INF-POST-102', 'INF-POST-103', 'INF-POST-104'].includes(p.id)
          );
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
            setPosts(cleaned);
          }
        }
      }
    } catch (e) {}
  }, []);

  // Synchronisation bidirectionnelle avec influenceDeliverables (Section Performances & KPIs)
  useEffect(() => {
    if (!Array.isArray(influenceDeliverables)) return;
    const realDelivs = influenceDeliverables.filter(d =>
      d &&
      d.isNewlyCreated === true &&
      !d.isDemo &&
      !d.isExample &&
      d.metrics?.views !== 205000 &&
      d.views !== 205000
    );

    if (realDelivs.length === 0) return;

    setPosts(prevPosts => {
      let hasChanges = false;
      const existingIds = new Set(prevPosts.map(p => p.id));
      const newlyAdded = [];

      realDelivs.forEach(deliv => {
        if (!existingIds.has(deliv.id)) {
          hasChanges = true;
          const pubDate = deliv.published_at || deliv.date_raw || '2026-10-06';
          const dayNum = parseInt(pubDate.split('-')[2], 10) || 6;
          const matchedInf = effectiveInfluencers.find(i =>
            String(i.id) === String(deliv.talent_id) ||
            i.name === deliv.talent_name ||
            i.pseudo === deliv.talent_name
          );

          newlyAdded.push({
            id: deliv.id,
            influencerId: matchedInf?.id || deliv.talent_id || '',
            influencerName: deliv.talent_name || matchedInf?.name || 'Influenceur Orange',
            influencerPseudo: matchedInf?.pseudo || (deliv.talent_name ? `@${deliv.talent_name.toLowerCase().replace(/\s+/g, '')}` : '@talent'),
            title: deliv.title,
            canal: deliv.platform ? (deliv.platform.charAt(0).toUpperCase() + deliv.platform.slice(1)) : 'Instagram',
            format: deliv.content_type || 'Reel dynamique',
            date: pubDate,
            time: '12:00',
            day: dayNum,
            status: deliv.status === 'publie' ? 'PUBLISHED' : 'SCHEDULED',
            campaign: deliv.campaign_name || '',
            client: 'Orange Cameroun',
            desc: deliv.content_subject || '',
            url: deliv.url || '',
            image: '',
            isSponsored: false,
            metrics: {
              views: deliv.metrics?.views || 0,
              likes: deliv.metrics?.likes || 0,
              comments: deliv.metrics?.comments || 0,
              shares: deliv.metrics?.shares || 0,
              rate: deliv.metrics?.engagement_rate ? `${deliv.metrics.engagement_rate}%` : '—'
            },
            isNewlyCreated: true
          });
        }
      });

      if (hasChanges && newlyAdded.length > 0) {
        const merged = [...newlyAdded, ...prevPosts];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {}
        return merged;
      }
      return prevPosts;
    });
  }, [influenceDeliverables, effectiveInfluencers]);

  // Sauvegarde persistante (seules les données nouvellement enregistrées sont conservées)
  const savePosts = (newPosts) => {
    const validOnly = (newPosts || []).filter(p =>
      p &&
      p.isNewlyCreated === true &&
      !p.isDemo &&
      !p.isExample &&
      !['INF-POST-101', 'INF-POST-102', 'INF-POST-103', 'INF-POST-104'].includes(p.id)
    );
    setPosts(validOnly);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validOnly));
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
        id: `INF-POST-${Date.now().toString().slice(-6)}`,
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
        campaign: '',
        client: 'Orange Cameroun',
        desc: '',
        url: '',
        image: '',
        isSponsored: false,
        views: '',
        likes: '',
        comments: '',
        shares: '',
        rate: '',
        metrics: { views: 0, likes: 0, comments: 0, shares: 0, rate: '—' },
        isNewlyCreated: true
      }
    });
  };

  const handleOpenEditModal = (post) => {
    const certMetrics = getPostCertifiedMetrics(post, influenceDeliverables);
    setEditModalState({
      mode: 'edit',
      data: {
        ...post,
        date: getPostDateStr(post),
        day: post.day || (post.date ? parseInt(post.date.split('-')[2], 10) : 6),
        // Chiffres certifiés pré-remplis identiques à Performances & KPIs
        views: certMetrics.views,
        likes: certMetrics.likes,
        comments: certMetrics.comments,
        shares: certMetrics.shares,
        rate: certMetrics.rate,
        metrics: {
          views: certMetrics.views,
          likes: certMetrics.likes,
          comments: certMetrics.comments,
          shares: certMetrics.shares,
          engagement_calculated: certMetrics.calculatedEngagement,
          rate: certMetrics.rate
        }
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

    // Normalisation des métriques manuelles éditées
    const viewsNum = formData.views !== '' && formData.views !== undefined ? Number(formData.views) : (formData.metrics?.views || 0);
    const likesNum = formData.likes !== '' && formData.likes !== undefined ? Number(formData.likes) : (formData.metrics?.likes || 0);
    const commentsNum = formData.comments !== '' && formData.comments !== undefined ? Number(formData.comments) : (formData.metrics?.comments || 0);
    const sharesNum = formData.shares !== '' && formData.shares !== undefined ? Number(formData.shares) : (formData.metrics?.shares || 0);
    const calcEngagement = (Number(likesNum) || 0) + (Number(commentsNum) || 0) + (Number(sharesNum) || 0);

    let rateNum = null;
    let rateStr = formData.rate;
    if (viewsNum > 0) {
      rateNum = Number(((calcEngagement / viewsNum) * 100).toFixed(2));
      if (!rateStr || rateStr === '—') {
        rateStr = `${rateNum}%`;
      }
    } else {
      rateStr = rateStr || '—';
    }

    const updatedMetrics = {
      views: viewsNum,
      likes: likesNum,
      comments: commentsNum,
      shares: sharesNum,
      engagement_calculated: calcEngagement,
      engagement_rate: rateNum,
      rate: rateStr
    };

    const finalPost = {
      ...formData,
      isNewlyCreated: true,
      influencerName: matchedInf?.name || matchedInf?.display_name || formData.influencerName || 'Influenceur Orange',
      influencerPseudo: matchedInf?.pseudo || formData.influencerPseudo || '@orange_talent',
      day: formData.date ? parseInt(formData.date.split('-')[2], 10) : formData.day || 6,
      url: (formData.url || '').trim(),
      metrics: updatedMetrics,
      updatedAt: new Date().toISOString()
    };

    // Payload rigoureusement identique pour la section Performances & KPIs
    const deliverablePayload = {
      id: finalPost.id,
      deliverableId: finalPost.id,
      title: finalPost.title,
      talent_id: finalPost.influencerId,
      talent_name: finalPost.influencerName,
      campaign_name: finalPost.campaign || 'Campagne sans nom',
      platform: (finalPost.canal || 'instagram').toLowerCase(),
      content_type: (finalPost.format || 'video').toLowerCase(),
      content_subject: finalPost.campaign || finalPost.title,
      published_at: finalPost.date,
      date_raw: finalPost.date,
      url: finalPost.url,
      status: finalPost.status === 'PUBLISHED' ? 'publie' : 'programme',
      isNewlyCreated: true,
      isReal: true,
      isDemo: false,
      isExample: false,
      metrics: {
        views: viewsNum,
        likes: likesNum,
        comments: commentsNum,
        shares: sharesNum,
        engagement_reported: null,
        engagement_calculated: calcEngagement,
        engagement_rate: rateNum,
      }
    };

    if (editModalState.mode === 'create') {
      const updated = [finalPost, ...posts];
      savePosts(updated);
      if (addInfluenceDeliverable) {
        addInfluenceDeliverable(deliverablePayload);
      }
      showToast('Publication planifiée et KPIs enregistrés avec succès !');
    } else {
      const updated = posts.map(p => p.id === finalPost.id ? finalPost : p);
      savePosts(updated);
      // Synchronisation directe avec influenceDeliverables
      const existingDeliv = (influenceDeliverables || []).find(d =>
        d && (d.id === finalPost.id || (d.talent_name === finalPost.influencerName && d.title === finalPost.title))
      );
      if (existingDeliv && updateInfluenceDeliverable) {
        updateInfluenceDeliverable(existingDeliv.id, deliverablePayload);
      } else if (updateInfluenceDeliverable) {
        updateInfluenceDeliverable(finalPost.id, deliverablePayload);
      } else if (addInfluenceDeliverable) {
        addInfluenceDeliverable(deliverablePayload);
      }
      showToast('Publication et performances certifiées mises à jour !');
    }

    // Synchronisation avec influencers.publicationStats
    if (setInfluencers) {
      setInfluencers(prev => (prev || []).map(inf => {
        if (
          String(inf.id) === String(finalPost.influencerId) ||
          inf.name === finalPost.influencerName ||
          inf.pseudo === finalPost.influencerPseudo
        ) {
          const stats = Array.isArray(inf.publicationStats) ? inf.publicationStats : [];
          const exists = stats.some(s => s.id === finalPost.id);
          const updatedStats = exists
            ? stats.map(s => s.id === finalPost.id ? { ...s, ...deliverablePayload, vues: viewsNum, views: viewsNum, likes: likesNum, commentaires: commentsNum, comments: commentsNum, partages: sharesNum, shares: sharesNum, tauxEngagement: rateNum } : s)
            : [{ ...deliverablePayload, vues: viewsNum, views: viewsNum, likes: likesNum, commentaires: commentsNum, comments: commentsNum, partages: sharesNum, shares: sharesNum, tauxEngagement: rateNum }, ...stats];
          return { ...inf, publicationStats: updatedStats };
        }
        return inf;
      }));
    }

    // Mettre à jour viewModalPost s'il s'agit de la même publication
    if (viewModalPost && viewModalPost.id === finalPost.id) {
      setViewModalPost(finalPost);
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
    setArchivedPosts(prev => [{ ...post, isNewlyCreated: true }, ...prev]);
    const updated = posts.filter(p => p.id !== post.id);
    savePosts(updated);
    if (viewModalPost?.id === post.id) setViewModalPost(null);
    showToast('Publication archivée');
  };

  const handleRestoreArchived = (post) => {
    setArchivedPosts(prev => prev.filter(p => p.id !== post.id));
    savePosts([{ ...post, isNewlyCreated: true }, ...posts]);
    showToast('Publication restaurée dans le calendrier');
  };

  const handleQuickPublish = (post) => {
    const certMetrics = getPostCertifiedMetrics(post, influenceDeliverables);
    const updatedPost = {
      ...post,
      isNewlyCreated: true,
      status: 'PUBLISHED',
      metrics: {
        views: certMetrics.views,
        likes: certMetrics.likes,
        comments: certMetrics.comments,
        shares: certMetrics.shares,
        rate: certMetrics.rate,
        engagement_calculated: certMetrics.calculatedEngagement
      }
    };
    const updated = posts.map(p => p.id === post.id ? updatedPost : p);
    savePosts(updated);
    if (updateInfluenceDeliverable) {
      updateInfluenceDeliverable(post.id, {
        status: 'publie',
        metrics: {
          views: certMetrics.views,
          likes: certMetrics.likes,
          comments: certMetrics.comments,
          shares: certMetrics.shares,
          engagement_calculated: certMetrics.calculatedEngagement,
          engagement_rate: certMetrics.views > 0 ? Number(((certMetrics.calculatedEngagement / certMetrics.views) * 100).toFixed(2)) : null
        }
      });
    }
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
      showToast(err.message || 'Erreur lors du traitement de l\'image.');
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

        {/* Notice si aucun contenu enregistré */}
        {posts.length === 0 && (
          <div
            style={{
              margin: '0 16px 16px 16px',
              padding: '12px 18px',
              borderRadius: 10,
              background: 'rgba(255, 121, 0, 0.08)',
              border: '1px dashed rgba(255, 121, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>✨</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#FF7900' }}>
                  Calendrier des Contenus d'Influence vierge
                </div>
                <div style={{ fontSize: 11.5, color: '#94A3B8' }}>
                  Toutes les données d’exemple ont été retirées. Seules les publications que vous enregistrez apparaîtront ici.
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-orange btn-xs"
              onClick={() => handleOpenCreateModal()}
              style={{ fontWeight: 800 }}
            >
              ➕ Planifier une publication
            </button>
          </div>
        )}

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

                        {/* Métriques certifiées si post publié ou avec vues */}
                        {(() => {
                          const postMetrics = getPostCertifiedMetrics(post, influenceDeliverables);
                          if (postMetrics.views > 0 || post.status === 'PUBLISHED') {
                            return (
                              <div 
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  fontSize: 10.5,
                                  color: '#CBD5E1',
                                  background: 'rgba(0,0,0,0.25)',
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  margin: '6px 0',
                                  border: '1px solid rgba(255,255,255,0.05)'
                                }}
                              >
                                <span>👁 <strong>{postMetrics.views.toLocaleString()}</strong> vues</span>
                                <span>❤️ <strong>{postMetrics.likes.toLocaleString()}</strong></span>
                                <span>💬 <strong>{postMetrics.comments.toLocaleString()}</strong></span>
                                <span style={{ color: '#2ECC71', fontWeight: 700 }}>{postMetrics.rate}</span>
                              </div>
                            );
                          }
                          return null;
                        })()}

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

            {/* Métriques certifiées de performance */}
            {(() => {
              const certMetrics = getPostCertifiedMetrics(viewModalPost, influenceDeliverables);
              const hasMetrics = certMetrics.views > 0 || certMetrics.likes > 0 || viewModalPost.status === 'PUBLISHED';
              if (!hasMetrics) return null;

              return (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Performances Réelles Certifiées
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        color: '#38BDF8',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      ✓ Chiffres certifiés (Section Performances & KPIs)
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.04)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>VUES TOTALES</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#FF7900', marginTop: 2 }}>
                        {certMetrics.views > 0 ? certMetrics.views.toLocaleString() : (certMetrics.views === 0 ? '0' : '—')}
                      </div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.04)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>LIKES</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
                        {certMetrics.likes > 0 ? certMetrics.likes.toLocaleString() : (certMetrics.likes === 0 ? '0' : '—')}
                      </div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.04)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>COMMENTAIRES</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
                        {certMetrics.comments > 0 ? certMetrics.comments.toLocaleString() : (certMetrics.comments === 0 ? '0' : '—')}
                      </div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.04)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>TAUX SUR VUES</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#2ECC71', marginTop: 2 }}>
                        {certMetrics.rate || '—'}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', padding: '0 4px', flexWrap: 'wrap', gap: 6 }}>
                    <span>Partages certifiés : <strong style={{ color: '#fff' }}>{certMetrics.shares.toLocaleString()}</strong></span>
                    <span>Engagement cumulé : <strong style={{ color: '#FF7900' }}>{certMetrics.calculatedEngagement.toLocaleString()}</strong> interactions</span>
                  </div>
                </div>
              );
            })()}

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
                  marginBottom: 16,
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

              {/* ─── SECTION MODIFICATION MANUELLE DES PERFORMANCES RÉELLES CERTIFIÉES & KPIS ─── */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 121, 0, 0.35)',
                  marginBottom: 20
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#FF7900', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>📊</span> Performances Réelles Certifiées & KPIs
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      Saisie manuelle certifiée des métriques réelles. Ces chiffres sont synchronisés directement avec la section « Performances & KPIs ».
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: 'rgba(46, 204, 113, 0.15)',
                      color: '#2ECC71',
                      border: '1px solid rgba(46, 204, 113, 0.3)'
                    }}
                  >
                    ✓ Synchronisation Active
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 12 }}>
                  {/* Vues réelles */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#CBD5E1', marginBottom: 4 }}>
                      Vues Totales *
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: '#0F172A',
                        border: '1px solid rgba(255, 121, 0, 0.4)',
                        color: '#FF7900',
                        fontSize: 13,
                        fontWeight: 700
                      }}
                      value={editModalState.data.views !== undefined ? editModalState.data.views : ''}
                      onChange={(e) => setEditModalState(prev => ({
                        ...prev,
                        data: { ...prev.data, views: e.target.value }
                      }))}
                    />
                  </div>

                  {/* Likes */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#CBD5E1', marginBottom: 4 }}>
                      Likes / J'aime
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: '#0F172A',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        fontSize: 13
                      }}
                      value={editModalState.data.likes !== undefined ? editModalState.data.likes : ''}
                      onChange={(e) => setEditModalState(prev => ({
                        ...prev,
                        data: { ...prev.data, likes: e.target.value }
                      }))}
                    />
                  </div>

                  {/* Commentaires */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#CBD5E1', marginBottom: 4 }}>
                      Commentaires
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: '#0F172A',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        fontSize: 13
                      }}
                      value={editModalState.data.comments !== undefined ? editModalState.data.comments : ''}
                      onChange={(e) => setEditModalState(prev => ({
                        ...prev,
                        data: { ...prev.data, comments: e.target.value }
                      }))}
                    />
                  </div>

                  {/* Partages */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#CBD5E1', marginBottom: 4 }}>
                      Partages
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: '#0F172A',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        fontSize: 13
                      }}
                      value={editModalState.data.shares !== undefined ? editModalState.data.shares : ''}
                      onChange={(e) => setEditModalState(prev => ({
                        ...prev,
                        data: { ...prev.data, shares: e.target.value }
                      }))}
                    />
                  </div>

                  {/* Taux d'engagement sur vues */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#CBD5E1', marginBottom: 4 }}>
                      Taux sur Vues (%)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto ou ex: 4.8%"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: '#0F172A',
                        border: '1px solid rgba(46, 204, 113, 0.4)',
                        color: '#2ECC71',
                        fontSize: 13,
                        fontWeight: 700
                      }}
                      value={
                        editModalState.data.rate !== undefined && editModalState.data.rate !== ''
                          ? editModalState.data.rate
                          : (Number(editModalState.data.views) > 0
                              ? `${(((Number(editModalState.data.likes) || 0) + (Number(editModalState.data.comments) || 0) + (Number(editModalState.data.shares) || 0)) / Number(editModalState.data.views) * 100).toFixed(2)}%`
                              : '—')
                      }
                      onChange={(e) => setEditModalState(prev => ({
                        ...prev,
                        data: { ...prev.data, rate: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                {/* Récapitulatif calculé en direct */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#94A3B8', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 6 }}>
                  <span>
                    Total interactions calculées : <strong style={{ color: '#fff' }}>{((Number(editModalState.data.likes) || 0) + (Number(editModalState.data.comments) || 0) + (Number(editModalState.data.shares) || 0)).toLocaleString()}</strong>
                  </span>
                  <span style={{ color: '#64748B' }}>
                    Formule certifiée : (Likes + Commentaires + Partages) / Vues
                  </span>
                </div>
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
