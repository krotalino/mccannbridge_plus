export function formatCurrency(amount) {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M FCFA';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K FCFA';
  return amount.toLocaleString('fr-FR') + ' FCFA';
}

export function formatNumber(n) {
  return n.toLocaleString('fr-FR');
}

export function getPriorityColor(priority) {
  const map = { critique: '#E74C3C', urgente: '#F39C12', haute: '#FF7900', normale: '#27AE60' };
  return map[priority] || '#8C8C8C';
}

export function getStatusColor(status) {
  const map = {
    validated: '#27AE60', pending: '#F39C12', draft: '#8C8C8C',
    production: '#2980B9', reserved: '#1A1A2E', rejected: '#E74C3C',
    attente: '#F39C12', livre: '#27AE60', validation: '#F39C12',
    active: '#27AE60', warning: '#F39C12', new: '#2980B9',
    en_cours: '#2980B9', valide: '#27AE60', en_attente: '#F39C12',
    refuse: '#E74C3C', confirme: '#27AE60', preparation: '#FF7900',
    planifie: '#F39C12', pause: '#F39C12',
  };
  return map[status] || '#8C8C8C';
}

export function getStatusLabel(status) {
  const map = {
    validated: 'Validé ✓', pending: 'En attente', draft: 'Brouillon',
    production: 'Production', reserved: 'Slot', rejected: 'Rejeté ✕',
    attente: 'En attente', livre: 'Livré ✓', validation: 'Validation',
    active: 'Actif', warning: 'Alerte', new: 'Nouveau',
    en_cours: 'En cours', valide: 'Validé', en_attente: 'En attente',
    refuse: 'Refusé', confirme: 'Confirmé', preparation: 'Préparation',
    planifie: 'Planifié', pause: 'Pause',
  };
  return map[status] || status;
}

export function calcScore(ticket) {
  const deadlineScore = Math.max(0, 1 - (ticket.daysLeft / 14)) * 35;
  const priorityMap = { critique: 25, urgente: 17.5, normale: 7.5 };
  const priorityScore = priorityMap[ticket.priority] || 7.5;
  const budgetScore = Math.min(20, (ticket.budget / 2000000) * 20);
  const blockScore = ticket.blocksCalendar ? 10 : 0;
  const lateScore = ticket.daysLeft <= 0 ? 10 : (ticket.daysLeft <= 1 ? 5 : 0);
  return Math.round(deadlineScore + priorityScore + budgetScore + blockScore + lateScore);
}

export function getCreativeLoad(creativeId, tickets, team) {
  const assigned = tickets.filter(t => t.assignee === creativeId && t.status !== 'livre');
  const creative = team.find(c => c.id === creativeId);
  const maxCap = creative?.capacity || 100;
  const load = assigned.reduce((sum, t) => sum + (100 - t.progress) * 0.5, 0);
  return Math.min(100, Math.round((load / maxCap) * 100));
}

export function getLoadColor(load) {
  if (load >= 85) return '#E74C3C';
  if (load >= 60) return '#F39C12';
  return '#27AE60';
}

export function getScoreColor(score) {
  if (score >= 80) return '#E74C3C';
  if (score >= 50) return '#F39C12';
  return '#27AE60';
}

export function getFridayCountdown() {
  const now = new Date();
  const day = now.getDay();
  const fridayTarget = new Date(now);
  if (day <= 5) {
    fridayTarget.setDate(now.getDate() + (5 - day));
  } else {
    fridayTarget.setDate(now.getDate() + (12 - day));
  }
  fridayTarget.setHours(17, 0, 0, 0);
  let diff = fridayTarget - now;
  if (diff < 0) diff = 0;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    isPassed: diff <= 0,
  };
}

export function getChecklistCount(cl) {
  let count = 0;
  if (cl.visuel) count++;
  if (cl.copie) count++;
  if (cl.cta || cl.ctaTeste) count++;
  if (cl.sponsoValide) count++;
  return count;
}

export function findTeamMember(id, team) {
  for (const key in team) {
    const member = team[key].find(m => m.id === id);
    if (member) return member;
  }
  return null;
}
