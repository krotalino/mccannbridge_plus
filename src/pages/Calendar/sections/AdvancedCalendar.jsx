import { useState } from 'react';
import { CM_DATA } from '../../../data/community';
import { useApp } from '../../../context/AppContext';
import './calendar.css';

export default function AdvancedCalendar({ onOpenArchive }) {
  const calData = CM_DATA.advancedCalendar;
  const { calendarPosts, addPublication } = useApp();
  const [filterClient, setFilterClient] = useState('All');
  const [filterCanal, setFilterCanal] = useState('All');
  const [activeNav, setActiveNav] = useState('calendar');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostForm, setNewPostForm] = useState({
    title: '', client: 'Orange Telco', canal: 'Facebook', type: 'Feed', format: 'Paysage',
    time: '10:00', desc: '', day: 19,
  });

  // Filter posts from context
  const filteredPosts = calendarPosts.filter(p => {
    if (filterClient !== 'All' && p.client !== filterClient) return false;
    if (filterCanal !== 'All' && p.canal !== filterCanal) return false;
    return true;
  });

  // Filter by active nav
  const displayPosts = activeNav === 'calendar'
    ? filteredPosts
    : activeNav === 'queue'
      ? filteredPosts.filter(p => p.status === 'PENDING' || p.status === 'SCHEDULED')
      : activeNav === 'drafts'
        ? filteredPosts.filter(p => p.status === 'DRAFT')
        : filteredPosts;

  const days = [
    { name: 'SUN', date: '17' },
    { name: 'MON', date: '18' },
    { name: 'TUE', date: '19', isToday: true },
    { name: 'WED', date: '20' },
    { name: 'THU', date: '21' },
    { name: 'FRI', date: '22' },
    { name: 'SAT', date: '23' }
  ];

  const getStatusColor = (s) => {
    switch (s) {
      case 'PUBLISHED': return 'var(--green)';
      case 'SCHEDULED': return '#3498db';
      case 'PENDING': return 'var(--blue)';
      case 'DRAFT': return '#8c8c8c';
      default: return 'var(--blue)';
    }
  };

  const getStatusLabel = (s) => {
    switch (s) {
      case 'PUBLISHED': return '✅ PUBLIÉ';
      case 'SCHEDULED': return '📅 PROGRAMMÉ';
      case 'PENDING': return '⏳ EN ATTENTE';
      case 'DRAFT': return '📝 BROUILLON';
      default: return s;
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

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostForm.title.trim()) return;
    // Also add to publications via context
    const platMap = { 'Facebook': 'Facebook', 'Instagram': 'Instagram', 'X': 'Twitter/X', 'LinkedIn': 'LinkedIn', 'TikTok': 'TikTok' };
    addPublication({
      title: newPostForm.title,
      plateforme: platMap[newPostForm.canal] || newPostForm.canal,
      format: newPostForm.type === 'Carrousel' ? 'Carrousel' : newPostForm.type === 'Réels et Story' ? 'Reels' : 'Image',
      description: newPostForm.desc,
      dateTarget: `2026-05-${newPostForm.day.toString().padStart(2, '0')}`,
      heureTarget: newPostForm.time,
    });
    setShowNewPost(false);
    setNewPostForm({ title: '', client: 'Orange Telco', canal: 'Facebook', type: 'Feed', format: 'Paysage', time: '10:00', desc: '', day: 19 });
  };

  return (
    <div className="adv-calendar-container">
      {/* Top Bar Navigation */}
      <div className="adv-cal-topbar">
        <div className="adv-cal-nav">
          <button className={activeNav === 'calendar' ? 'active' : ''} onClick={() => setActiveNav('calendar')}>
            📅 Calendar
            <span className="adv-nav-count">{calendarPosts.length}</span>
          </button>
          <button className={activeNav === 'queue' ? 'active' : ''} onClick={() => setActiveNav('queue')}>
            ⏸ Queue
            <span className="adv-nav-count">{calendarPosts.filter(p => p.status === 'PENDING' || p.status === 'SCHEDULED').length}</span>
          </button>
          <button className={activeNav === 'drafts' ? 'active' : ''} onClick={() => setActiveNav('drafts')}>
            📝 Drafts
            <span className="adv-nav-count">{calendarPosts.filter(p => p.status === 'DRAFT').length}</span>
          </button>
          <button>🏷 Labels</button>
          <button>🚀 Campaigns</button>
        </div>
        <div className="adv-cal-top-actions">
          <button className="btn btn-ghost btn-sm" onClick={onOpenArchive}>📂 Archives</button>
          <div className="user-avatar-small">CM</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="adv-cal-controls">
        <div className="flex items-center gap-16">
          <div className="adv-cal-date-display">
            <span className="icon">🗓</span>
            <div>
              <div className="text-xs text-muted">PUBLISHING</div>
              <div className="font-bold text-lg">May 2026</div>
            </div>
          </div>
          <div className="adv-cal-view-toggles">
            <button>Month</button>
            <button className="active">Week</button>
          </div>
          <div className="adv-cal-nav-arrows">
            <button>‹</button>
            <button>›</button>
            <button className="btn-today">Today</button>
          </div>
        </div>
        <div className="flex items-center gap-12">
          {/* Custom Filters matching the specs */}
          <select className="adv-cal-select" value={filterClient} onChange={(e) => setFilterClient(e.target.value)}>
            <option value="All">Tous les Clients</option>
            {calData.clients.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="adv-cal-select" value={filterCanal} onChange={(e) => setFilterCanal(e.target.value)}>
            <option value="All">Tous les Canaux</option>
            {calData.canaux.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-blue btn-sm" onClick={() => setShowNewPost(true)}>➕ New Post</button>
          <button className="btn btn-ghost btn-sm">⚙ Filters</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="adv-cal-grid">
        {days.map((d, index) => {
          const dayPosts = displayPosts.filter(p => p.day === parseInt(d.date));
          return (
            <div key={index} className={`adv-cal-col ${d.isToday ? 'is-today' : ''}`}>
              <div className="adv-cal-col-header">
                <div className="adv-cal-col-name">{d.name}</div>
                <div className="adv-cal-col-date">
                  {d.date}
                  {d.isToday && <span className="today-badge">TODAY</span>}
                </div>
                <div className="adv-cal-col-count">{dayPosts.length} ITEMS</div>
              </div>
              <div className="adv-cal-cards">
                {dayPosts.map(post => (
                  <div key={post.id} className="adv-post-card">
                    <div className="adv-post-header">
                      <div className="adv-post-platform">
                        {getPlatformIcon(post.canal)} {post.time}
                      </div>
                      <div className="adv-post-status" style={{ color: getStatusColor(post.status) }}>
                        {getStatusLabel(post.status)}
                      </div>
                    </div>
                    <div className="adv-post-title">{post.title}</div>
                    <div className="adv-post-meta">
                      <span className={`tag-micro ${post.generation === 'AI' ? 'tag-purple' : 'tag-green'}`}>
                        {post.generation}
                      </span>
                      <span className="text-xs text-muted ml-8">{post.client}</span>
                    </div>
                    
                    <div className="adv-post-body flex gap-8 mt-12">
                      <p className="adv-post-desc flex-1">{post.desc}</p>
                      {post.image && (
                        <div className="adv-post-thumb" style={{ backgroundImage: `url(${post.image})` }}></div>
                      )}
                    </div>
                    
                    <div className="adv-post-footer">
                      <button className="btn-icon">👁</button>
                      <button className="btn-edit">Edit Post</button>
                      <div className="adv-post-menu-wrap">
                        <button className="btn-icon btn-more">···</button>
                      </div>
                    </div>
                  </div>
                ))}
                {dayPosts.length === 0 && (
                  <div className="adv-cal-empty-day">
                    <span className="adv-cal-empty-icon">+</span>
                    <span className="adv-cal-empty-text">Ajouter</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Post modal */}
      {showNewPost && (
        <div className="pub-modal-overlay" onClick={() => setShowNewPost(false)}>
          <div className="pub-modal" onClick={e => e.stopPropagation()}>
            <div className="pub-modal-header">
              <h2 className="pub-modal-title">➕ Nouveau Post — Calendrier</h2>
              <button className="pub-modal-close" onClick={() => setShowNewPost(false)}>✕</button>
            </div>
            <form onSubmit={handleCreatePost} className="pub-modal-form">
              <div className="pub-form-group">
                <label className="pub-form-label">Titre *</label>
                <input className="pub-form-input" type="text" placeholder="Titre du post" value={newPostForm.title}
                  onChange={e => setNewPostForm({ ...newPostForm, title: e.target.value })} autoFocus />
              </div>
              <div className="pub-form-row">
                <div className="pub-form-group">
                  <label className="pub-form-label">Client</label>
                  <select className="pub-form-select" value={newPostForm.client} onChange={e => setNewPostForm({ ...newPostForm, client: e.target.value })}>
                    {calData.clients.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="pub-form-group">
                  <label className="pub-form-label">Canal</label>
                  <select className="pub-form-select" value={newPostForm.canal} onChange={e => setNewPostForm({ ...newPostForm, canal: e.target.value })}>
                    {calData.canaux.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="pub-form-row">
                <div className="pub-form-group">
                  <label className="pub-form-label">Type</label>
                  <select className="pub-form-select" value={newPostForm.type} onChange={e => setNewPostForm({ ...newPostForm, type: e.target.value })}>
                    {calData.types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="pub-form-group">
                  <label className="pub-form-label">Jour (17-23)</label>
                  <input className="pub-form-input" type="number" min={17} max={23} value={newPostForm.day}
                    onChange={e => setNewPostForm({ ...newPostForm, day: parseInt(e.target.value) || 19 })} />
                </div>
                <div className="pub-form-group">
                  <label className="pub-form-label">Heure</label>
                  <input className="pub-form-input" type="time" value={newPostForm.time}
                    onChange={e => setNewPostForm({ ...newPostForm, time: e.target.value })} />
                </div>
              </div>
              <div className="pub-form-group">
                <label className="pub-form-label">Description</label>
                <textarea className="pub-form-textarea" rows={3} placeholder="Description du post..."
                  value={newPostForm.desc} onChange={e => setNewPostForm({ ...newPostForm, desc: e.target.value })} />
              </div>
              <div className="pub-form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowNewPost(false)}>Annuler</button>
                <button type="submit" className="btn btn-blue">➕ Créer le post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
