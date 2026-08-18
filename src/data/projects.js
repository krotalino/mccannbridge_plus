export const SAMPLE_PROJECTS = [
  { id: 'P01', name: 'Refonte site Orange.cm', progress: 65, status: 'en_cours', deadline: '2026-06-30', team: ['victor', 'georges'], phase: 'Développement' },
  { id: 'P02', name: 'App OM Mastercard', progress: 40, status: 'en_cours', deadline: '2026-05-15', team: ['felix'], phase: 'Design UI/UX' },
  { id: 'P03', name: 'Landing page Pulse Campus', progress: 90, status: 'en_cours', deadline: '2026-04-10', team: ['victor', 'annette'], phase: 'Intégration' },
  { id: 'P04', name: 'Chatbot WhatsApp OM', progress: 20, status: 'planifie', deadline: '2026-07-31', team: ['felix'], phase: 'Spécification' },
];

export const SAMPLE_EVENTS = [
  { id: 'E01', name: 'Orange Business Summit 2026', date: '2026-04-20', location: 'Hilton Yaoundé', status: 'preparation', budget: 15000000, type: 'B2B' },
  { id: 'E02', name: 'Pulse Campus Tour - Douala', date: '2026-04-12', location: 'Université de Douala', status: 'confirme', budget: 8000000, type: 'Activation' },
  { id: 'E03', name: 'OM Mastercard Launch', date: '2026-05-05', location: 'Akwa Palace Douala', status: 'planifie', budget: 25000000, type: 'Lancement' },
];

export const SAMPLE_DISPLAY = [
  { id: 'D01', name: 'Pulse Always-On Q2', status: 'active', budget: 12000000, spent: 4500000, impressions: 2800000, clicks: 34000, ctr: '1.21%', startDate: '2026-04-01', endDate: '2026-06-30' },
  { id: 'D02', name: 'OM Mastercard Awareness', status: 'active', budget: 8000000, spent: 2100000, impressions: 1500000, clicks: 18000, ctr: '1.20%', startDate: '2026-04-01', endDate: '2026-04-30' },
  { id: 'D03', name: 'Orange Business LinkedIn', status: 'pause', budget: 5000000, spent: 1800000, impressions: 450000, clicks: 5400, ctr: '1.20%', startDate: '2026-03-15', endDate: '2026-05-15' },
];

export const DEFAULT_PLATFORMS = [
  { id: 'telco', name: 'TELCO ORANGE CAMEROUN', channels: ['Facebook', 'Instagram', 'WhatsApp', 'X', 'LinkedIn', 'TikTok'], color: '#FF7900' },
  { id: 'money', name: 'ORANGE MONEY CAMEROUN', channels: ['Facebook', 'LinkedIn'], color: '#F39C12' },
  { id: 'business', name: 'ORANGE BUSINESS', channels: ['LinkedIn', 'X'], color: '#2980B9' },
  { id: 'maxit', name: 'MAX IT', channels: ['Facebook'], color: '#8E44AD' },
];
