import { useState, useRef } from 'react';
import { TEAM } from '../../data/team';

export default function UsersPage() {
  const [teamData, setTeamData] = useState(TEAM);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Tous');

  // Form State
  const [formData, setFormData] = useState({
    group: 'creatives',
    id: '',
    name: '',
    role: '',
    segment: '',
    specialty: '',
    avatar: '',
    photo: ''
  });
  
  const fileInputRef = useRef(null);

  const filterTabs = ['Tous', 'Direction', 'Commercial', 'Création', 'Digital', 'Production', 'Finance', 'IT'];

  // Map internal groups to display departments for the mock
  const groupToDept = {
    creatives: 'Création',
    cdp: 'Digital',
    cm: 'Digital',
    specialists: 'Direction'
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setViewingUser(null);
    setFormData({ group: 'creatives', id: '', name: '', role: '', segment: '', specialty: '', avatar: '', photo: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (user, groupKey) => {
    setViewingUser(null);
    setEditingUser({ ...user, originalGroup: groupKey });
    setFormData({
      group: groupKey,
      id: user.id,
      name: user.name,
      role: user.role,
      segment: user.segment || '',
      specialty: user.specialty || '',
      avatar: user.avatar || '',
      photo: user.photo || ''
    });
    setModalOpen(true);
  };

  const handleOpenView = (user, groupLabel) => {
    setViewingUser({ ...user, groupLabel });
  };

  const handleDelete = (userId, groupKey) => {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      const newTeam = { ...teamData };
      newTeam[groupKey] = newTeam[groupKey].filter(u => u.id !== userId);
      setTeamData(newTeam);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTeam = { ...teamData };
    
    const finalAvatar = formData.photo ? '' : (formData.avatar || generateInitials(formData.name));
    
    const newUserObj = {
      id: formData.id || Date.now().toString(),
      name: formData.name,
      role: formData.role,
      segment: formData.segment,
      specialty: formData.specialty,
      avatar: finalAvatar,
      photo: formData.photo
    };

    if (editingUser) {
      newTeam[editingUser.originalGroup] = newTeam[editingUser.originalGroup].filter(u => u.id !== editingUser.id);
      newTeam[formData.group].push(newUserObj);
    } else {
      newTeam[formData.group].push(newUserObj);
    }

    setTeamData(newTeam);
    setModalOpen(false);
  };

  // Flatten users
  const allUsers = Object.entries(teamData).flatMap(([groupKey, users]) => 
    users.map(u => ({ ...u, groupKey, department: groupToDept[groupKey] || 'Digital' }))
  );

  const displayedUsers = activeFilter === 'Tous' 
    ? allUsers 
    : allUsers.filter(u => u.department === activeFilter);

  return (
    <div className="users-page-wrapper">
      <div className="users-page-header">
        <div>
          <h1 className="text-3xl font-bold mb-8" style={{ color: '#fff' }}>Équipe McCann Douala</h1>
          <p className="text-base" style={{ color: '#aaa' }}>Gérez les membres de votre équipe</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-orange" style={{ padding: '12px 24px', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>+</span> Ajouter un membre
        </button>
      </div>

      {/* Filter Bar */}
      <div className="users-filter-bar">
        <div className="users-filter-tabs">
          {filterTabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`users-tab-btn ${activeFilter === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="users-count-badge">
          {displayedUsers.length} membres
        </div>
      </div>

      {/* Grid */}
      <div className="users-grid">
        {displayedUsers.map(user => (
          <div key={user.id} className="user-profile-card">
            
            {/* Edit/Delete tiny buttons on top right */}
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
              <button onClick={() => handleOpenEdit(user, user.groupKey)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }} title="Modifier">✏️</button>
              <button onClick={() => handleDelete(user.id, user.groupKey)} style={{ background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer' }} title="Supprimer">🗑️</button>
            </div>

            <div className="avatar" style={{ 
              width: 80, height: 80, margin: '0 auto 20px', 
              background: 'var(--orange)', fontSize: 28, fontWeight: 'bold',
              backgroundImage: user.photo ? `url(${user.photo})` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center',
              color: user.photo ? 'transparent' : 'white',
              boxShadow: '0 8px 16px rgba(255,121,0,0.2)'
            }}>
              {user.photo ? '' : user.avatar}
            </div>
            
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#fff' }}>{user.name}</h3>
            <div style={{ color: 'var(--orange)', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{user.role}</div>
            <div style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>{user.department} {user.segment ? `• ${user.segment}` : ''}</div>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, background: '#2ecc71', borderRadius: '50%', marginRight: 8, boxShadow: '0 0 8px #2ecc71' }}></span>
              En ligne
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <button onClick={() => alert("Ouverture de la messagerie pour " + user.name)} style={{ background: '#333', border: '1px solid #444', padding: '10px 0', borderRadius: 8, color: '#ccc', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.target.style.background='#444'} onMouseOut={e=>e.target.style.background='#333'} title="Envoyer un email">✉️</button>
              <button onClick={() => alert("Démarrer un chat avec " + user.name)} style={{ background: '#333', border: '1px solid #444', padding: '10px 0', borderRadius: 8, color: '#ccc', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.target.style.background='#444'} onMouseOut={e=>e.target.style.background='#333'} title="Message interne">💬</button>
              <button onClick={() => handleOpenView(user, user.department)} style={{ background: 'var(--orange)', border: 'none', padding: '10px 0', borderRadius: 8, color: '#fff', cursor: 'pointer', transition: 'opacity 0.2s', boxShadow: '0 4px 12px rgba(255,121,0,0.3)' }} onMouseOver={e=>e.target.style.opacity=0.9} onMouseOut={e=>e.target.style.opacity=1} title="Voir Profil">👤</button>
            </div>
          </div>
        ))}
      </div>

      {displayedUsers.length === 0 && (
        <div style={{ textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 }}>Aucun membre trouvé dans cette catégorie.</div>
      )}

      {/* Edit/Add Modal */}
      {modalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ width: 500, maxWidth: '90%', background: '#242424', padding: 32, borderRadius: 16, position: 'relative', border: '1px solid #444', color: '#fff' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}>×</button>
            <h2 className="text-xl font-bold mb-20">{editingUser ? 'Modifier Membre' : 'Nouveau Membre'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="flex gap-16 items-center">
                <div className="avatar" style={{ 
                    background: 'var(--orange)', 
                    backgroundImage: formData.photo ? `url(${formData.photo})` : 'none',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    cursor: 'pointer', width: 80, height: 80, fontSize: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: formData.photo ? 'transparent' : 'white'
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  {!formData.photo && (formData.avatar || generateInitials(formData.name) || '?')}
                </div>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block', color: '#aaa' }}>Photo de profil</label>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <button type="button" onClick={() => fileInputRef.current.click()} style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Choisir une image</button>
                  {formData.photo && <button type="button" onClick={() => setFormData({...formData, photo: ''})} style={{ background: 'transparent', color: 'var(--red)', border: 'none', padding: '6px 12px', cursor: 'pointer' }}>Retirer</button>}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block', color: '#aaa' }}>Groupe système</label>
                <select value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} required style={{ width: '100%', padding: 12, background: '#1c1c1c', border: '1px solid #444', borderRadius: 8, color: '#fff', outline: 'none' }}>
                  <option value="creatives">Création</option>
                  <option value="cdp">Chefs de Projet (Digital)</option>
                  <option value="cm">Community Managers</option>
                  <option value="specialists">Spécialistes (Direction/IT)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block', color: '#aaa' }}>Nom Complet</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Ex: Jean Dupont" style={{ width: '100%', padding: 12, background: '#1c1c1c', border: '1px solid #444', borderRadius: 8, color: '#fff', outline: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block', color: '#aaa' }}>Rôle / Titre</label>
                <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required placeholder="Ex: Administrateur" style={{ width: '100%', padding: 12, background: '#1c1c1c', border: '1px solid #444', borderRadius: 8, color: '#fff', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block', color: '#aaa' }}>Segment</label>
                  <input type="text" value={formData.segment} onChange={e => setFormData({...formData, segment: e.target.value})} placeholder="Ex: Telco" style={{ width: '100%', padding: 12, background: '#1c1c1c', border: '1px solid #444', borderRadius: 8, color: '#fff', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block', color: '#aaa' }}>Spécialité</label>
                  <input type="text" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} placeholder="Ex: Motion" style={{ width: '100%', padding: 12, background: '#1c1c1c', border: '1px solid #444', borderRadius: 8, color: '#fff', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'transparent', color: '#ccc', border: '1px solid #444', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>Annuler</button>
                <button type="submit" style={{ background: 'var(--orange)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>{editingUser ? 'Enregistrer' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal (Kept the beautiful one but adapted colors) */}
      {viewingUser && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ width: 450, maxWidth: '90%', background: '#242424', padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 16, border: '1px solid #444', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            
            <div style={{ height: 120, background: 'linear-gradient(135deg, var(--orange), var(--orangeLight))' }}></div>
            <button onClick={() => setViewingUser(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            
            <div style={{ padding: '0 32px 32px', textAlign: 'center', marginTop: -50 }}>
              <div className="avatar" style={{ 
                width: 100, height: 100, fontSize: 36, margin: '0 auto 16px', border: '4px solid #242424', boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                background: 'var(--orange)', 
                backgroundImage: viewingUser.photo ? `url(${viewingUser.photo})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center',
                color: viewingUser.photo ? 'transparent' : 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {viewingUser.photo ? '' : viewingUser.avatar}
              </div>
              
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{viewingUser.name}</h2>
              <div style={{ fontSize: 16, color: '#aaa', marginBottom: 16 }}>{viewingUser.role}</div>
              <span style={{ background: 'rgba(255,121,0,0.15)', color: 'var(--orange)', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>{viewingUser.department}</span>

              <div style={{ borderTop: '1px solid #333', margin: '32px 0 24px', paddingTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'left' }}>
                {viewingUser.segment && (
                  <div>
                    <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 4 }}>Segment</div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{viewingUser.segment}</div>
                  </div>
                )}
                {viewingUser.specialty && (
                  <div>
                    <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 4 }}>Spécialité</div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{viewingUser.specialty}</div>
                  </div>
                )}
              </div>
              
              <button style={{ background: 'var(--orange)', color: '#fff', border: 'none', padding: '12px', width: '100%', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }} onClick={() => {
                handleOpenEdit(viewingUser, viewingUser.groupKey);
              }}>
                Modifier le profil
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
