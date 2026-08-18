import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { BRIEF_STATUSES, ORANGE_SPONSORS, MCCANN_TEAM_MEMBERS } from '../../../data/briefs';
import { formatCurrency } from '../../../utils/helpers';
import BriefPdfExportModal from './BriefPdfExportModal';

export default function BriefDetailModal({ isOpen, onClose, brief, onEdit }) {
  const { updateBriefStatus, addBriefComment, addBriefAsset, updateBriefMilestone } = useApp();
  const { user, isAgency } = useAuth();
  
  const [activeTab, setActiveTab] = useState('specs');
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [fieldTarget, setFieldTarget] = useState('Général / Projet');

  // Asset upload state
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState('charte');
  const [assetSize, setAssetSize] = useState('3.5 MB');

  if (!isOpen || !brief) return null;

  const statusMeta = BRIEF_STATUSES[brief.status] || BRIEF_STATUSES.submitted;

  // Calculate days left to Go-Live
  const calculateDaysToGoLive = () => {
    if (!brief.goLiveDate) return null;
    const target = new Date(brief.goLiveDate);
    const now = new Date();
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const daysToGoLive = calculateDaysToGoLive();

  const handleStatusChange = (newStatus) => {
    updateBriefStatus(brief.id, newStatus);
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: 'c_' + Date.now(),
      author: user?.user || (isAgency ? 'Victor F. AKOA' : 'Lauriane NGAMENI'),
      role: user?.poste || (isAgency ? 'Chef de Projet McCann' : 'Chef de Projet Orange'),
      team: isAgency ? 'mccann' : 'orange',
      avatar: user?.user ? user.user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : (isAgency ? 'VA' : 'LN'),
      fieldTarget: fieldTarget,
      text: commentText.trim(),
      timestamp: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      resolved: false,
    };

    addBriefComment(brief.id, newComment);
    setCommentText('');
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    const newAsset = {
      id: 'a_' + Date.now(),
      name: assetName.trim(),
      type: assetName.includes('.') ? assetName.split('.').pop().toUpperCase() : 'DOC',
      size: assetSize || '2.0 MB',
      category: assetCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      uploader: user?.user || (isAgency ? 'Victor F. AKOA (McCann)' : 'Lauriane NGAMENI (Orange)'),
    };

    addBriefAsset(brief.id, newAsset);
    setAssetName('');
  };

  const mentionPresets = [
    { name: '@Henriette SILO (CM Orange)', tag: '@Henriette SILO ' },
    { name: '@Lauriane NGAMENI (CDP Orange)', tag: '@Lauriane NGAMENI ' },
    { name: '@Patrick TUETE (Comm Orange)', tag: '@Patrick TUETE ' },
    { name: '@Victor F. AKOA (CDP McCann)', tag: '@Victor F. AKOA ' },
    { name: '@Serge NDJOCK (Tech Lead McCann)', tag: '@Serge NDJOCK ' },
    { name: '@Georges BAKOUME (UX/UI McCann)', tag: '@Georges BAKOUME ' },
  ];

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content modal-brief-detail" onClick={e => e.stopPropagation()}>
          
          {/* Header */}
          <div className="brief-detail-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span className="brief-id-tag">{brief.id}</span>
                  <span className="tag tag-blue">{brief.typology}</span>
                  
                  {/* Status Dropdown */}
                  <div className="brief-status-selector">
                    <span className="status-dot" style={{ background: statusMeta.color }} />
                    <select
                      value={brief.status}
                      onChange={e => handleStatusChange(e.target.value)}
                      className="brief-status-select"
                      style={{ color: statusMeta.color, fontWeight: 700 }}
                    >
                      {Object.values(BRIEF_STATUSES).map(s => (
                        <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Go-Live Countdown Badge */}
                  {daysToGoLive !== null && (
                    <span className={`tag ${daysToGoLive <= 15 ? 'tag-red' : daysToGoLive <= 45 ? 'tag-orange' : 'tag-green'}`} style={{ fontWeight: 700 }}>
                      🚀 Go-Live : {daysToGoLive > 0 ? `J-${daysToGoLive} (${brief.goLiveDate})` : `Aujourd’hui ! (${brief.goLiveDate})`}
                    </span>
                  )}
                </div>

                <h1 className="brief-detail-title">{brief.title}</h1>
                
                <div className="brief-detail-sub">
                  <span>📅 Soumis le {brief.submissionDate || '25/02/2026'}</span>
                  <span>•</span>
                  <span>💰 Budget : <strong>{brief.budget ? formatCurrency(brief.budget) : 'Non communiqué'}</strong></span>
                  <span>•</span>
                  <span>Lead : <strong>{brief.agencyLead || 'Victor F. AKOA'}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowPdfModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                  title="Générer un PDF officiel avec charte Orange et signatures"
                >
                  <span>📄</span> Exporter en PDF
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { onClose(); onEdit(brief); }}
                  style={{ fontSize: 13 }}
                >
                  ✏️ Modifier le Brief
                </button>

                <button className="modal-close" onClick={onClose}>✕</button>
              </div>
            </div>

            {/* Quick Link Environment Buttons */}
            {(brief.figmaUrl || brief.jiraUrl || brief.stagingUrl || brief.liveUrl) && (
              <div className="brief-quick-links-bar">
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>LIENS DIRECTS :</span>
                {brief.figmaUrl && (
                  <a href={brief.figmaUrl} target="_blank" rel="noreferrer" className="quick-link-btn figma">
                    🎨 Maquettes Figma ↗
                  </a>
                )}
                {brief.jiraUrl && (
                  <a href={brief.jiraUrl} target="_blank" rel="noreferrer" className="quick-link-btn jira">
                    🎫 Tickets Dev ↗
                  </a>
                )}
                {brief.stagingUrl && (
                  <a href={brief.stagingUrl} target="_blank" rel="noreferrer" className="quick-link-btn staging">
                    🧪 Recette Staging ↗
                  </a>
                )}
                {brief.liveUrl && (
                  <a href={brief.liveUrl} target="_blank" rel="noreferrer" className="quick-link-btn live">
                    🚀 URL Production ↗
                  </a>
                )}
              </div>
            )}

            {/* Nav Tabs */}
            <div className="brief-detail-nav">
              <button
                className={`detail-nav-tab ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                📋 Spécifications Complètes (A à E)
              </button>
              <button
                className={`detail-nav-tab ${activeTab === 'progress' ? 'active' : ''}`}
                onClick={() => setActiveTab('progress')}
              >
                📊 Avancement & Jalons ({brief.progress}%)
              </button>
              <button
                className={`detail-nav-tab ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                💬 Commentaires & Mentions ({(brief.comments || []).length})
              </button>
              <button
                className={`detail-nav-tab ${activeTab === 'assets' ? 'active' : ''}`}
                onClick={() => setActiveTab('assets')}
              >
                📎 Brand Center & Assets ({(brief.assets || []).length})
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="brief-detail-body">
            
            {/* ────────── TAB 1 : SPÉCIFICATIONS COMPLÈTES (SECTIONS A À E) ────────── */}
            {activeTab === 'specs' && (
              <div className="brief-specs-container animate-fade">
                
                {/* SECTION A */}
                <div className="spec-card">
                  <div className="spec-card-header">
                    <div className="spec-badge">Section A</div>
                    <h3 className="spec-title">Informations Générales & Porteurs du Projet</h3>
                  </div>
                  <div className="spec-card-body">
                    <div className="spec-row">
                      <div className="spec-label">Typologie du Brief</div>
                      <div className="spec-value"><span className="tag tag-orange">{brief.typology}</span></div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Équipe Sponsors Orange</div>
                      <div className="spec-value">
                        <div className="sponsors-pill-list">
                          {(brief.sponsors || []).map((s, i) => (
                            <div key={i} className="sponsor-pill">
                              <span className="sponsor-pill-avatar">{(s.name || 'O').slice(0, 2).toUpperCase()}</span>
                              <div>
                                <div style={{ fontWeight: 700 }}>{s.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.role} • 📞 {s.phone || '699 94 54 97'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Contacts & Urgences</div>
                      <div className="spec-value">{brief.contacts || '699 94 54 97 / 699 94 86 61'}</div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Équipe Agence Assignée</div>
                      <div className="spec-value">
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {(brief.assignedTeam || ['victor', 'georges', 'serge']).map(id => {
                            const member = MCCANN_TEAM_MEMBERS.find(m => m.id === id);
                            return member ? (
                              <span key={id} className="tag tag-muted">
                                👤 {member.name} ({member.role})
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION B */}
                <div className="spec-card">
                  <div className="spec-card-header">
                    <div className="spec-badge">Section B</div>
                    <h3 className="spec-title">Contexte Stratégique (Le "Pourquoi")</h3>
                  </div>
                  <div className="spec-card-body">
                    <div className="spec-row">
                      <div className="spec-label">Background / Enjeux Marché</div>
                      <div className="spec-value text-block">{brief.marketBackground || 'Non renseigné'}</div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Contexte du Projet</div>
                      <div className="spec-value text-block">{brief.projectContext || 'Non renseigné'}</div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Cibles (Personas)</div>
                      <div className="spec-value">
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {(brief.targetPersonas || []).map((p, i) => (
                            <span key={i} className="tag tag-blue">🎯 {p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Niveau de Notoriété Actuel</div>
                      <div className="spec-value text-block">{brief.currentBrandAwareness || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                {/* SECTION C */}
                <div className="spec-card">
                  <div className="spec-card-header">
                    <div className="spec-badge">Section C</div>
                    <h3 className="spec-title">Mécanique & Spécifications Web (Le "Comment")</h3>
                  </div>
                  <div className="spec-card-body">
                    <div className="spec-row">
                      <div className="spec-label">Tâche à accomplir (User Journey)</div>
                      <div className="spec-value text-block">{brief.userJourney || 'Non renseigné'}</div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Mécanique Détaillée (Étapes)</div>
                      <div className="spec-value">
                        <div className="mechanics-timeline">
                          {(brief.mechanicsSteps || []).map((st, i) => (
                            <div key={i} className="mechanics-timeline-item">
                              <div className="m-step-circle">{i + 1}</div>
                              <div className="m-step-desc">{st}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Fonctionnalités Spécifiques</div>
                      <div className="spec-value">
                        <div className="features-badge-list">
                          {(brief.specificFeatures || []).map((f, i) => (
                            <div key={i} className="feature-badge-row">
                              <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
                              <span style={{ flex: 1, fontWeight: 600 }}>{f.label}</span>
                              {f.status && <span className="tag tag-muted" style={{ fontSize: 11 }}>{f.status}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Écosystème Digital</div>
                      <div className="spec-value">
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {(brief.ecosystem || []).map((ch, i) => (
                            <span key={i} className="tag tag-purple">📡 {ch}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION D */}
                <div className="spec-card">
                  <div className="spec-card-header">
                    <div className="spec-badge">Section D</div>
                    <h3 className="spec-title">Objectifs & KPIs (Le "Succès")</h3>
                  </div>
                  <div className="spec-card-body">
                    <div className="spec-row">
                      <div className="spec-label">Objectifs Stratégiques</div>
                      <div className="spec-value">
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {(brief.objectives || []).map((obj, i) => (
                            <span key={i} className="tag tag-green">★ {obj}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">KPIs de Succès</div>
                      <div className="spec-value text-block" style={{ fontWeight: 600, color: 'var(--dark)' }}>
                        {brief.kpis || 'Non renseigné'}
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Ton & Positionnement</div>
                      <div className="spec-value text-block">{brief.toneAndVoice || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                {/* SECTION E */}
                <div className="spec-card">
                  <div className="spec-card-header">
                    <div className="spec-badge">Section E</div>
                    <h3 className="spec-title">Contraintes, Livrables & Budget</h3>
                  </div>
                  <div className="spec-card-body">
                    <div className="spec-row">
                      <div className="spec-label">Mandatories Orange</div>
                      <div className="spec-value">
                        {(brief.mandatories || []).map((m, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ color: 'var(--orange)', fontWeight: 800 }}>⚡</span>
                            <span style={{ fontWeight: 600 }}>{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Livrables Attendus Agence</div>
                      <div className="spec-value">
                        {(brief.deliverables || []).map((d, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ color: d.done ? 'var(--green)' : 'var(--orange)', fontWeight: 700 }}>
                              {d.done ? '✓' : '⏳'}
                            </span>
                            <span style={{ flex: 1 }}>{d.label}</span>
                            <span className={`tag ${d.done ? 'tag-green' : 'tag-muted'}`} style={{ fontSize: 11 }}>
                              {d.done ? 'Livré' : `${d.progress || 0}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Enveloppe Budgétaire</div>
                      <div className="spec-value">
                        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--dark)' }}>
                          {brief.budget ? formatCurrency(brief.budget) : 'Non communiqué'}
                        </span>
                        {brief.budgetConfidential && <span className="tag tag-red" style={{ marginLeft: 8 }}>Confidentiel</span>}
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-label">Fréquence / Timeline</div>
                      <div className="spec-value">{brief.timelineFrequency || 'Go-Live le ' + (brief.goLiveDate || 'N/A')}</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ────────── TAB 2 : AVANCEMENT & JALONS (DASHBOARD DUAL-VIEW) ────────── */}
            {activeTab === 'progress' && (
              <div className="brief-progress-container animate-fade">
                
                {/* Global Progress Bar */}
                <div className="card card-bordered" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Avancement Global du Projet</h3>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        Statut actuel : <strong style={{ color: statusMeta.color }}>{statusMeta.label}</strong> ({brief.subStatus || 'Production'})
                      </div>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--orange)' }}>
                      {brief.progress}%
                    </div>
                  </div>

                  <div className="progress-bar-lg">
                    <div
                      className="progress-fill-lg"
                      style={{
                        width: `${brief.progress}%`,
                        background: brief.progress === 100 ? 'var(--green)' : 'var(--orange)',
                      }}
                    />
                  </div>
                </div>

                {/* Sub-module Milestones Table */}
                <div className="card" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Jalons & Modules de Développement</h3>
                    <span className="tag tag-muted">Mise à jour en temps réel</span>
                  </div>

                  <div className="table-wrapper">
                    <table className="table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Module / Jalon</th>
                          <th>Responsable</th>
                          <th>Échéance</th>
                          <th>Avancement</th>
                          <th>Statut</th>
                          {isAgency && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {(brief.milestones || []).map((m) => (
                          <tr key={m.id}>
                            <td>
                              <div style={{ fontWeight: 700 }}>{m.title}</div>
                            </td>
                            <td>
                              <span style={{ fontSize: 12, color: 'var(--muted)' }}>👤 {m.owner}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: 12 }}>📅 {m.dueDate || 'À définir'}</span>
                            </td>
                            <td style={{ width: 140 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div className="progress-bar-sm" style={{ flex: 1 }}>
                                  <div
                                    className="progress-fill-sm"
                                    style={{
                                      width: `${m.percentage}%`,
                                      background: m.percentage === 100 ? 'var(--green)' : 'var(--orange)',
                                    }}
                                  />
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 700, minWidth: 32 }}>{m.percentage}%</span>
                              </div>
                            </td>
                            <td>
                              <span className={`tag ${m.status === 'completed' ? 'tag-green' : m.status === 'in_progress' ? 'tag-orange' : 'tag-muted'}`}>
                                {m.status === 'completed' ? 'Terminé ✓' : m.status === 'in_progress' ? 'En cours' : 'À venir'}
                              </span>
                            </td>
                            {isAgency && (
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-ghost"
                                  style={{ padding: '2px 8px', fontSize: 11 }}
                                  onClick={() => {
                                    const nextPct = m.percentage >= 100 ? 0 : Math.min(100, m.percentage + 25);
                                    const nextStatus = nextPct === 100 ? 'completed' : nextPct > 0 ? 'in_progress' : 'upcoming';
                                    updateBriefMilestone(brief.id, m.id, nextPct, nextStatus);
                                  }}
                                >
                                  +25%
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Deliverables Checklist Progress */}
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Validation des Livrables Clés</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    {(brief.deliverables || []).map((d, i) => (
                      <div key={i} className="deliverable-progress-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{d.label}</span>
                          <span className={`tag ${d.done ? 'tag-green' : 'tag-orange'}`} style={{ fontSize: 10 }}>
                            {d.done ? 'Livré' : 'En cours'}
                          </span>
                        </div>
                        <div className="progress-bar-sm">
                          <div className="progress-fill-sm" style={{ width: `${d.progress || (d.done ? 100 : 0)}%`, background: d.done ? 'var(--green)' : 'var(--orange)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ────────── TAB 3 : COMMENTAIRES CONTEXTUELS & MENTIONS ────────── */}
            {activeTab === 'comments' && (
              <div className="brief-comments-container animate-fade">
                
                {/* Add Comment Form */}
                <div className="card" style={{ marginBottom: 20 }}>
                  <form onSubmit={handleSendComment}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <label className="form-label" style={{ fontSize: 12 }}>Cibler un champ ou une section du brief :</label>
                        <select
                          className="form-select"
                          value={fieldTarget}
                          onChange={e => setFieldTarget(e.target.value)}
                          style={{ fontSize: 13 }}
                        >
                          <option value="Général / Projet">Général / Projet</option>
                          <option value="Section A — Sponsors & Dates">Section A — Sponsors & Dates</option>
                          <option value="Section B — Contexte & Cibles">Section B — Contexte & Cibles</option>
                          <option value="Section C — User Journey & Mécanique">Section C — User Journey & Mécanique</option>
                          <option value="Section C — Back-office Radio & Formats">Section C — Back-office Radio & Formats</option>
                          <option value="Section C — Module Audio Voice Recorder">Section C — Module Audio Voice Recorder</option>
                          <option value="Section D — KPIs & Objectifs">Section D — KPIs & Objectifs</option>
                          <option value="Section E — Mandatories & RGPD">Section E — Mandatories & RGPD</option>
                          <option value="Section E — Livrables & Recette UAT">Section E — Livrables & Recette UAT</option>
                          <option value="Section E — Budget & Faisabilité">Section E — Budget & Faisabilité</option>
                        </select>
                      </div>

                      {/* Mentions quick tags */}
                      <div style={{ flex: 2, minWidth: 280 }}>
                        <label className="form-label" style={{ fontSize: 12 }}>Taguer rapidement un collaborateur (@mention) :</label>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {mentionPresets.map(mp => (
                            <button
                              key={mp.tag}
                              type="button"
                              className="tag tag-muted"
                              style={{ cursor: 'pointer', fontSize: 11 }}
                              onClick={() => setCommentText(prev => prev + mp.tag)}
                            >
                              {mp.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <textarea
                        rows={3}
                        className="form-textarea"
                        placeholder="Écrivez votre commentaire ou posez une question précise (ex: @Henriette SILO, as-tu le format exact attendu pour l'extraction des audios ?)..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button type="submit" className="btn btn-orange">
                        💬 Publier le commentaire
                      </button>
                    </div>
                  </form>
                </div>

                {/* Comments List */}
                <div className="comments-timeline">
                  {(brief.comments || []).length === 0 ? (
                    <div className="empty-state">
                      <div style={{ fontSize: 32 }}>💬</div>
                      <div style={{ fontWeight: 700, marginTop: 8 }}>Aucun commentaire pour le moment</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Posez une question ou commentez une section pour lancer la discussion entre McCann et Orange.</div>
                    </div>
                  ) : (
                    (brief.comments || []).map((c) => (
                      <div key={c.id} className={`comment-card ${c.team === 'orange' ? 'comment-orange' : 'comment-mccann'}`}>
                        <div className="comment-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="comment-avatar">{c.avatar || 'U'}</div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13 }}>
                                {c.author}
                                <span className={`tag ${c.team === 'orange' ? 'tag-orange' : 'tag-blue'}`} style={{ marginLeft: 8, fontSize: 10 }}>
                                  {c.team === 'orange' ? 'Client Orange' : 'Agence McCann'}
                                </span>
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                                {c.role} • 🎯 {c.fieldTarget || 'Général'}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                            {c.timestamp}
                          </div>
                        </div>

                        <div className="comment-body">
                          {c.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* ────────── TAB 4 : BRAND CENTER & ASSETS ────────── */}
            {activeTab === 'assets' && (
              <div className="brief-assets-container animate-fade">
                
                {/* Upload Asset Box */}
                <div className="card" style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📎 Déposer un Asset / Document de Référence</h3>
                  <form onSubmit={handleAddAsset} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 2, minWidth: 200 }}>
                      <label className="form-label" style={{ fontSize: 12 }}>Nom du Fichier / Document :</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="ex. Charte_Graphique_Orange_2026.pdf"
                        value={assetName}
                        onChange={e => setAssetName(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 140 }}>
                      <label className="form-label" style={{ fontSize: 12 }}>Catégorie :</label>
                      <select
                        className="form-select"
                        value={assetCategory}
                        onChange={e => setAssetCategory(e.target.value)}
                      >
                        <option value="charte">Charte Graphique (Brand Center)</option>
                        <option value="benchmark">Benchmark & Éléments de Référence</option>
                        <option value="spec">Spécification Technique / API</option>
                        <option value="wireframe">Wireframe / Maquette</option>
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: 100 }}>
                      <label className="form-label" style={{ fontSize: 12 }}>Taille estimée :</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="ex. 4.2 MB"
                        value={assetSize}
                        onChange={e => setAssetSize(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-orange">
                      + Attacher le document
                    </button>
                  </form>
                </div>

                {/* Assets List */}
                <div className="assets-grid">
                  {(brief.assets || []).length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: 32 }}>📁</div>
                      <div style={{ fontWeight: 700, marginTop: 8 }}>Aucun document attaché</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Déposez les chartes graphiques, benchmarks audio, spécifications serveur ou maquettes.</div>
                    </div>
                  ) : (
                    (brief.assets || []).map((a) => (
                      <div key={a.id} className="asset-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="asset-icon">
                            {a.type === 'PDF' ? '📕' : a.type === 'FIGMA' ? '🎨' : a.type === 'DOCX' ? '📘' : '📄'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="asset-name" title={a.name}>{a.name}</div>
                            <div className="asset-meta">
                              <span>{a.size}</span>
                              <span>•</span>
                              <span className="tag tag-muted" style={{ fontSize: 10 }}>{a.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="asset-footer">
                          <span style={{ fontSize: 10, color: 'var(--muted)' }}>Par {a.uploader} ({a.uploadDate})</span>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            style={{ padding: '2px 8px', fontSize: 11 }}
                            onClick={() => alert(`Téléchargement simulé pour : ${a.name}`)}
                          >
                            ⬇ Télécharger
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* PDF Export Modal */}
      {showPdfModal && (
        <BriefPdfExportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          brief={brief}
        />
      )}
    </>
  );
}
