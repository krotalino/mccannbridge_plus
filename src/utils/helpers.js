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
  if (!ticket) return 0;
  // Days left calculation
  let daysLeft = ticket.daysLeft;
  if (daysLeft === undefined && ticket.deadline) {
    const diff = new Date(ticket.deadline) - new Date();
    daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  if (daysLeft === undefined) daysLeft = 3;

  const deadlineScore = Math.max(0, 1 - (daysLeft / 14)) * 35;
  
  const priorityMap = { 
    p0_urgent: 30, 
    critique: 30, 
    p1_strategic: 20, 
    urgente: 20, 
    haute: 20, 
    p2_recurrent: 10, 
    normale: 10 
  };
  const priorityScore = priorityMap[ticket.priority] || 10;
  const budgetScore = Math.min(15, ((ticket.budget || 0) / 2000000) * 15);
  const blockScore = ticket.blocksCalendar ? 10 : 0;
  const blockageActiveScore = ticket.blockage?.isBlocked ? 10 : 0;
  const revisionScore = Math.min(10, (ticket.revisionCount || 0) * 5);
  const lateScore = daysLeft <= 0 ? 10 : (daysLeft <= 1 ? 5 : 0);

  return Math.min(100, Math.round(deadlineScore + priorityScore + budgetScore + blockScore + blockageActiveScore + revisionScore + lateScore));
}

export function getCreativeLoad(creativeId, tickets = [], team = []) {
  const activeTickets = tickets.filter(t => t.assignee === creativeId && t.status !== 'delivered' && t.status !== 'livre');
  const allMembers = [
    ...(team.creatives || []),
    ...(team.cdp || []),
    ...(team.cm || []),
    ...(team.specialists || []),
    ...(team.directors || []),
    ...(team.finance || []),
    ...(Array.isArray(team) ? team : []),
  ];
  const member = allMembers.find(c => c.id === creativeId);
  const maxCap = member?.capacity || 100;
  
  // Calculate based on remaining hours and progress
  let totalHoursWorkload = 0;
  activeTickets.forEach(t => {
    const estimated = t.estimatedHours || 8;
    const progress = t.progress || 0;
    const remainingHours = estimated * ((100 - progress) / 100);
    totalHoursWorkload += Math.max(1, remainingHours);
  });

  // Base standard week is 35 hours
  const standardCapHours = (maxCap / 100) * 35;
  const loadPercentage = Math.round((totalHoursWorkload / standardCapHours) * 100);
  return Math.min(130, Math.max(0, loadPercentage));
}

export function getSlaCountdown(deadlineISO) {
  if (!deadlineISO) return { text: 'N/A', isPassed: false, hours: 0, minutes: 0 };
  const target = new Date(deadlineISO);
  const now = new Date();
  const diff = target - now;
  const isPassed = diff <= 0;
  const absDiff = Math.abs(diff);

  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    isPassed,
    hours,
    minutes,
    text: isPassed ? `Dépassé de ${hours}h ${minutes}m` : `${hours}h ${minutes}m restants`,
  };
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
