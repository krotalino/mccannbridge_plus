import React, { useState } from 'react';
import { POLES, TEAM } from '../../../data/team';
import { PRIORITY_LEVELS } from '../../../data/tickets';

export default function NewTicketModal({ onClose, onAddTicket, currentRole }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('p1_strategic');
  const [pole, setPole] = useState('infographie');
  const [assignee, setAssignee] = useState('');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]);
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [budget, setBudget] = useState(1000000);
  const [brand, setBrand] = useState('Orange Money');
  const [blocksCalendar, setBlocksCalendar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const id = `TCK-${Date.now().toString().slice(-4)}`;
    const newTicket = {
      id,
      title,
      description,
      brand,
      status: currentRole === 'demandeur' ? 'backlog' : (assignee ? 'ready' : 'cadrage'),
      priority,
      pole,
      assignee: assignee || (pole === 'infographie' ? 't1' : pole === 'motion' ? 't4' : 't7'),
      assigneeRole: POLES.find(p => p.id === pole)?.label || 'Créatif',
      backupId: pole === 'infographie' ? 't2' : 't5',
      deadline,
      daysLeft: Math.max(1, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))),
      estimatedHours: parseFloat(estimatedHours) || 8,
      loggedHours: 0,
      budget: parseFloat(budget) || 1000000,
      blocksCalendar,
      progress: 0,
      revisionCount: 0,
      qualificationDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(), // 4h SLA
      demandeur: {
        name: currentRole === 'demandeur' ? 'Lauriane NGAMENI' : 'Traffic Manager (McCann)',
        entity: currentRole === 'demandeur' ? 'Orange Cameroun' : 'McCann Douala',
      },
      deliverables: [
        { name: `${title} - Format Master`, type: pole === 'motion' ? 'video' : 'image', size: '1080x1920' },
      ],
      blockage: { isBlocked: false },
      createdAt: new Date().toISOString(),
    };

    onAddTicket(newTicket);
    onClose();
  };

  const isOrangeDemandeur = currentRole === 'demandeur';

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content animate-fade" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 640, width: '92%', borderRadius: 14, padding: 0, overflow: 'hidden' }}
      >
        <div style={{ padding: '18px 24px', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', color: '#FFF' }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
                {isOrangeDemandeur ? '📋 Soumettre une Demande (Brief Orange)' : '🚦 Créer un Ticket Opérationnel (McCann)'}
              </h3>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                {isOrangeDemandeur 
                  ? 'Entrée immédiate dans le Backlog Traffic avec SLA de qualification garanti sous 4h.' 
                  : 'Qualification et injection directe dans le Switchboard opérationnel.'}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 18, cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }} className="flex flex-col gap-14">
          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Titre de la demande *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: Campagne Énergie Solaire - Visuel Clé Social Media"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-2" style={{ gap: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Marque / Offre</label>
              <select className="form-control" value={brand} onChange={e => setBrand(e.target.value)}>
                <option value="Orange Money">Orange Money</option>
                <option value="Orange Pulse">Orange Pulse (Jeunes)</option>
                <option value="Orange B2B">Orange Business</option>
                <option value="Orange Brand & Corp">Orange Brand & RSE</option>
                <option value="Orange Fibre">Orange Fibre / Fixe</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Niveau de Priorité Métier *</label>
              <select className="form-control" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="p0_urgent">🚨 P0 : Urgent (Top Management / Crisis)</option>
                <option value="p1_strategic">⭐ P1 : Stratégique (Lancement produit / Campagne)</option>
                <option value="p2_recurrent">📅 P2 : Récurrent (Flux BAU / Posts réguliers)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: 12 }}>
            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Pôle d'Expertise Requis</label>
              <select className="form-control" value={pole} onChange={e => setPole(e.target.value)}>
                {POLES.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Date Limite (Deadline) *</label>
              <input
                type="date"
                className="form-control"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          {!isOrangeDemandeur && (
            <div className="grid grid-2" style={{ gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Temps estimé (Heures)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className="form-control"
                  value={estimatedHours}
                  onChange={e => setEstimatedHours(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Budget alloué (FCFA)</label>
                <input
                  type="number"
                  step="50000"
                  className="form-control"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 700 }}>Description & Objectif</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Précisez les cibles, messages clés et contraintes techniques..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={blocksCalendar}
              onChange={e => setBlocksCalendar(e.target.checked)}
            />
            <span><strong>Tâche bloquante</strong> pour le calendrier de publication des Community Managers</span>
          </label>

          <div className="flex justify-end gap-10 mt-10">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {isOrangeDemandeur ? '🚀 Soumettre au Traffic McCann' : '✓ Enregistrer le Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
