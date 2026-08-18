import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { 
  db, 
  auth, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';
import { INITIAL_TICKETS } from '../data/tickets';
import { INITIAL_CALENDAR } from '../data/calendar';
import { CM_DATA } from '../data/community';
import { INITIAL_BRIEFS } from '../data/briefs';
import { INITIAL_REPORTS, REPORT_STATUSES } from '../data/reportsData';

const AppContext = createContext(null);

// Build initial publications from CM_DATA.posts with unique IDs
const INITIAL_PUBLICATIONS = CM_DATA.posts.map(p => ({
  ...p,
  description: '',
  dateTarget: '',
  heureTarget: '',
  createdAt: null,
  submittedAt: null,
  validatedAt: null,
  scheduledAt: null,
  publishedAt: null,
}));

// Build initial calendar posts from CM_DATA.advancedCalendar.posts
const INITIAL_CALENDAR_POSTS = CM_DATA.advancedCalendar.posts.map(p => ({ ...p }));

let nextPubId = 100;
let nextCalPostId = 100;

// Load briefs from localStorage if available fallback
const loadSavedBriefs = () => {
  try {
    const saved = localStorage.getItem('bridge_briefs_v2');
    return saved ? JSON.parse(saved) : INITIAL_BRIEFS;
  } catch (e) {
    return INITIAL_BRIEFS;
  }
};

// Load reports from localStorage if available fallback
const loadSavedReports = () => {
  try {
    const saved = localStorage.getItem('bridge_reports_v2');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  } catch (e) {
    return INITIAL_REPORTS;
  }
};

const initialState = {
  tickets: INITIAL_TICKETS,
  calendar: INITIAL_CALENDAR,
  publications: INITIAL_PUBLICATIONS,
  calendarPosts: INITIAL_CALENDAR_POSTS,
  briefs: loadSavedBriefs(),
  reports: loadSavedReports(),
  notifications: [],
  firestoreReady: false,
};

function appReducer(state, action) {
  switch (action.type) {
    // ─── Direct Firestore Sync ───
    case 'SYNC_BRIEFS':
      return { ...state, briefs: action.briefs, firestoreReady: true };

    case 'SYNC_REPORTS':
      return { ...state, reports: action.reports, firestoreReady: true };

    case 'SYNC_TICKETS':
      return { ...state, tickets: action.tickets, firestoreReady: true };

    case 'SYNC_PUBLICATIONS':
      return { ...state, publications: action.publications, firestoreReady: true };

    case 'SYNC_CALENDAR_POSTS':
      return { ...state, calendarPosts: action.calendarPosts, firestoreReady: true };

    case 'SYNC_NOTIFICATIONS':
      return { ...state, notifications: action.notifications, firestoreReady: true };

    // ─── Briefs Workflow ───
    case 'ADD_BRIEF': {
      const updatedBriefs = [action.brief, ...state.briefs.filter(b => b.id !== action.brief.id)];
      try { localStorage.setItem('bridge_briefs_v2', JSON.stringify(updatedBriefs)); } catch (e) {}
      return { ...state, briefs: updatedBriefs };
    }

    case 'UPDATE_BRIEF': {
      const updatedBriefs = state.briefs.map(b =>
        b.id === action.id ? { ...b, ...action.updatedFields, updatedAt: new Date().toISOString() } : b
      );
      try { localStorage.setItem('bridge_briefs_v2', JSON.stringify(updatedBriefs)); } catch (e) {}
      return { ...state, briefs: updatedBriefs };
    }

    case 'UPDATE_BRIEF_STATUS': {
      const updatedBriefs = state.briefs.map(b => {
        if (b.id === action.id) {
          const progressMap = {
            draft: 5,
            submitted: 15,
            tech_review: 30,
            approved: 45,
            in_progress: action.progress !== undefined ? action.progress : 65,
            uat: 88,
            live: 100,
            on_hold: b.progress,
          };
          const newProgress = action.progress !== undefined ? action.progress : (progressMap[action.status] || b.progress);
          return {
            ...b,
            status: action.status,
            subStatus: action.subStatus !== undefined ? action.subStatus : b.subStatus,
            progress: newProgress,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      });
      try { localStorage.setItem('bridge_briefs_v2', JSON.stringify(updatedBriefs)); } catch (e) {}
      return { ...state, briefs: updatedBriefs };
    }

    case 'ADD_BRIEF_COMMENT': {
      const updatedBriefs = state.briefs.map(b => {
        if (b.id === action.briefId) {
          const comments = b.comments || [];
          return {
            ...b,
            comments: [...comments, action.comment],
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      });
      try { localStorage.setItem('bridge_briefs_v2', JSON.stringify(updatedBriefs)); } catch (e) {}
      return { ...state, briefs: updatedBriefs };
    }

    case 'ADD_BRIEF_ASSET': {
      const updatedBriefs = state.briefs.map(b => {
        if (b.id === action.briefId) {
          const assets = b.assets || [];
          return {
            ...b,
            assets: [action.asset, ...assets],
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      });
      try { localStorage.setItem('bridge_briefs_v2', JSON.stringify(updatedBriefs)); } catch (e) {}
      return { ...state, briefs: updatedBriefs };
    }

    case 'UPDATE_BRIEF_MILESTONE': {
      const updatedBriefs = state.briefs.map(b => {
        if (b.id === action.briefId) {
          const milestones = (b.milestones || []).map(m =>
            m.id === action.milestoneId ? { ...m, percentage: action.percentage, status: action.status || m.status } : m
          );
          const avgProgress = milestones.length > 0
            ? Math.round(milestones.reduce((acc, m) => acc + (m.percentage || 0), 0) / milestones.length)
            : b.progress;
          return {
            ...b,
            milestones,
            progress: avgProgress,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      });
      try { localStorage.setItem('bridge_briefs_v2', JSON.stringify(updatedBriefs)); } catch (e) {}
      return { ...state, briefs: updatedBriefs };
    }

    case 'DELETE_BRIEF': {
      const updatedBriefs = state.briefs.filter(b => b.id !== action.id);
      try { localStorage.setItem('bridge_briefs_v2', JSON.stringify(updatedBriefs)); } catch (e) {}
      return { ...state, briefs: updatedBriefs };
    }

    // ─── Reporting & Insights Workflow ───
    case 'ADD_REPORT': {
      const updatedReports = [action.report, ...state.reports.filter(r => r.id !== action.report.id)];
      try { localStorage.setItem('bridge_reports_v2', JSON.stringify(updatedReports)); } catch (e) {}
      return { ...state, reports: updatedReports };
    }

    case 'UPDATE_REPORT': {
      const updatedReports = state.reports.map(r =>
        r.id === action.id ? { ...r, ...action.updatedFields, updatedAt: new Date().toISOString() } : r
      );
      try { localStorage.setItem('bridge_reports_v2', JSON.stringify(updatedReports)); } catch (e) {}
      return { ...state, reports: updatedReports };
    }

    case 'UPDATE_REPORT_STATUS': {
      const updatedReports = state.reports.map(r => {
        if (r.id === action.id) {
          const now = new Date();
          const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
          
          let newVersion = r.version;
          const versions = [...(r.versions || [])];
          if (action.status === 'delivered' && !r.version?.includes('Verrouillée')) {
            newVersion = `${r.version || 'v1.0'} (Verrouillée)`;
            versions.push({
              versionNumber: newVersion,
              date: timestamp,
              author: action.author || 'Système McCann',
              changelog: 'Livraison finale et verrouillage du rapport officiel'
            });
          }

          const auditEntry = {
            timestamp,
            user: action.author || 'Utilisateur',
            action: `Statut → ${action.statusLabel || action.status}`,
            detail: action.note || `Transition vers le statut ${action.statusLabel || action.status}`
          };

          return {
            ...r,
            status: action.status,
            version: newVersion,
            versions,
            deliveredDate: action.status === 'delivered' ? now.toISOString().slice(0,10) : r.deliveredDate,
            auditLog: [auditEntry, ...(r.auditLog || [])],
            updatedAt: now.toISOString(),
          };
        }
        return r;
      });
      try { localStorage.setItem('bridge_reports_v2', JSON.stringify(updatedReports)); } catch (e) {}
      return { ...state, reports: updatedReports };
    }

    case 'ADD_REPORT_COMMENT': {
      const updatedReports = state.reports.map(r => {
        if (r.id === action.reportId) {
          const comments = r.comments || [];
          return {
            ...r,
            comments: [...comments, action.comment],
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      });
      try { localStorage.setItem('bridge_reports_v2', JSON.stringify(updatedReports)); } catch (e) {}
      return { ...state, reports: updatedReports };
    }

    case 'ADD_REPORT_SPEECH': {
      const updatedReports = state.reports.map(r => {
        if (r.id === action.reportId) {
          const speeches = r.data?.speeches || [];
          return {
            ...r,
            data: {
              ...r.data,
              speeches: [action.speech, ...speeches]
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      });
      try { localStorage.setItem('bridge_reports_v2', JSON.stringify(updatedReports)); } catch (e) {}
      return { ...state, reports: updatedReports };
    }

    case 'UPDATE_REPORT_DATA': {
      const updatedReports = state.reports.map(r => {
        if (r.id === action.reportId) {
          return {
            ...r,
            data: {
              ...r.data,
              ...action.data
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      });
      try { localStorage.setItem('bridge_reports_v2', JSON.stringify(updatedReports)); } catch (e) {}
      return { ...state, reports: updatedReports };
    }

    case 'DELETE_REPORT': {
      const updatedReports = state.reports.filter(r => r.id !== action.id);
      try { localStorage.setItem('bridge_reports_v2', JSON.stringify(updatedReports)); } catch (e) {}
      return { ...state, reports: updatedReports };
    }

    case 'UPDATE_TICKET_STATUS':
      return {
        ...state,
        tickets: state.tickets.map(t =>
          t.id === action.ticketId
            ? { ...t, status: action.status, progress: action.status === 'livre' ? 100 : action.status === 'validation' ? 90 : t.progress }
            : t
        ),
      };

    case 'REASSIGN_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(t =>
          t.id === action.ticketId ? { ...t, assignee: action.assignee } : t
        ),
      };

    case 'ADD_TICKET':
      return { ...state, tickets: [...state.tickets, action.ticket] };

    case 'VALIDATE_CALENDAR':
      return {
        ...state,
        calendar: state.calendar.map((c, i) =>
          i === action.index ? { ...c, status: 'validated' } : c
        ),
      };

    case 'REJECT_CALENDAR':
      return {
        ...state,
        calendar: state.calendar.map((c, i) =>
          i === action.index ? { ...c, status: 'rejected' } : c
        ),
      };

    case 'SUBMIT_CALENDAR':
      return {
        ...state,
        calendar: state.calendar.map((c, i) =>
          i === action.index ? { ...c, status: 'pending' } : c
        ),
      };

    case 'PUBLISH_CALENDAR':
      return {
        ...state,
        calendar: state.calendar.map((c, i) =>
          i === action.index ? { ...c, publishedAt: new Date().toISOString() } : c
        ),
      };

    // ─── Publication Workflow ───
    case 'ADD_PUBLICATION': {
      const pub = {
        id: String(action.payload.id || nextPubId++),
        title: action.payload.title,
        plateforme: action.payload.plateforme,
        format: action.payload.format,
        description: action.payload.description || '',
        dateTarget: action.payload.dateTarget || '',
        heureTarget: action.payload.heureTarget || '10:00',
        statut: 'Brouillon',
        action: 'Éditer',
        createdAt: new Date().toISOString(),
        submittedAt: null,
        validatedAt: null,
        scheduledAt: null,
        publishedAt: null,
      };
      return { ...state, publications: [pub, ...state.publications] };
    }

    case 'SUBMIT_FOR_VALIDATION':
      return {
        ...state,
        publications: state.publications.map(p =>
          String(p.id) === String(action.id)
            ? { ...p, statut: 'En validation', action: 'Relancer', submittedAt: new Date().toISOString() }
            : p
        ),
      };

    case 'VALIDATE_PUBLICATION': {
      const pub = state.publications.find(p => String(p.id) === String(action.id));
      if (!pub) return state;

      const now = new Date();
      const targetDate = pub.dateTarget ? new Date(pub.dateTarget) : now;
      const day = targetDate.getDate();

      const canalMap = { 'Facebook': 'Facebook', 'Instagram': 'Instagram', 'TikTok': 'TikTok', 'LinkedIn': 'LinkedIn', 'Twitter/X': 'X' };
      const canal = canalMap[pub.plateforme] || pub.plateforme;

      const newCalPost = {
        id: String(nextCalPostId++),
        client: 'Orange Telco',
        canal,
        type: pub.format === 'Carrousel' ? 'Carrousel' : pub.format === 'Reels' || pub.format === 'Story' ? 'Réels et Story' : 'Feed',
        format: 'Paysage',
        time: pub.heureTarget || '10:00',
        status: 'PENDING',
        title: pub.title,
        generation: 'Manual',
        desc: pub.description || pub.title,
        day,
        image: null,
      };

      return {
        ...state,
        publications: state.publications.map(p =>
          String(p.id) === String(action.id)
            ? { ...p, statut: 'Validé', action: 'Programmer', validatedAt: new Date().toISOString() }
            : p
        ),
        calendarPosts: [...state.calendarPosts, newCalPost],
      };
    }

    case 'REJECT_PUBLICATION':
      return {
        ...state,
        publications: state.publications.map(p =>
          String(p.id) === String(action.id)
            ? { ...p, statut: 'À corriger', action: 'Corriger' }
            : p
        ),
      };

    case 'SCHEDULE_PUBLICATION':
      return {
        ...state,
        publications: state.publications.map(p =>
          String(p.id) === String(action.id)
            ? {
              ...p,
              statut: 'Programmé',
              action: 'Voir',
              scheduledAt: new Date().toISOString(),
              dateTarget: action.date || p.dateTarget,
              heureTarget: action.heure || p.heureTarget,
            }
            : p
        ),
        calendarPosts: state.calendarPosts.map(cp =>
          cp.title === state.publications.find(pp => String(pp.id) === String(action.id))?.title
            ? { ...cp, status: 'SCHEDULED', time: action.heure || cp.time }
            : cp
        ),
      };

    case 'PUBLISH_PUBLICATION':
      return {
        ...state,
        publications: state.publications.map(p =>
          String(p.id) === String(action.id)
            ? { ...p, statut: 'Publié', action: 'Voir', publishedAt: new Date().toISOString() }
            : p
        ),
        calendarPosts: state.calendarPosts.map(cp =>
          cp.title === state.publications.find(pp => String(pp.id) === String(action.id))?.title
            ? { ...cp, status: 'PUBLISHED' }
            : cp
        ),
      };

    case 'ADD_NOTIFICATION': {
      const notif = { 
        id: String(Date.now()), 
        text: action.text, 
        type: action.notifType || 'info', 
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString()
      };
      return { ...state, notifications: [notif, ...state.notifications.slice(0, 19)] };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isInitializedRef = useRef(false);

  // ─── Realtime Firestore Synchronization ───
  useEffect(() => {
    let unsubs = [];

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous listeners
      unsubs.forEach(unsub => unsub && unsub());
      unsubs = [];

      if (!firebaseUser) {
        return;
      }

      try {
        // 1. Briefs Listener
        const briefsCol = collection(db, 'briefs');
        const unsubBriefs = onSnapshot(briefsCol, async (snapshot) => {
          if (snapshot.empty && !isInitializedRef.current) {
            // Seed initial briefs if Firestore is completely empty
            for (const brief of INITIAL_BRIEFS) {
              await setDoc(doc(db, 'briefs', brief.id), brief);
            }
          } else {
            const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            if (list.length > 0) {
              dispatch({ type: 'SYNC_BRIEFS', briefs: list });
            }
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'briefs');
        });
        unsubs.push(unsubBriefs);

        // 2. Reports Listener
        const reportsCol = collection(db, 'reports');
        const unsubReports = onSnapshot(reportsCol, async (snapshot) => {
          if (snapshot.empty && !isInitializedRef.current) {
            // Seed initial reports
            for (const report of INITIAL_REPORTS) {
              await setDoc(doc(db, 'reports', report.id), report);
            }
          } else {
            const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            if (list.length > 0) {
              dispatch({ type: 'SYNC_REPORTS', reports: list });
            }
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'reports');
        });
        unsubs.push(unsubReports);

        // 3. Tickets Listener
        const ticketsCol = collection(db, 'tickets');
        const unsubTickets = onSnapshot(ticketsCol, async (snapshot) => {
          if (snapshot.empty && !isInitializedRef.current) {
            for (const ticket of INITIAL_TICKETS) {
              await setDoc(doc(db, 'tickets', ticket.id), ticket);
            }
          } else {
            const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            if (list.length > 0) {
              dispatch({ type: 'SYNC_TICKETS', tickets: list });
            }
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'tickets');
        });
        unsubs.push(unsubTickets);

        // 4. Calendar Posts Listener
        const calCol = collection(db, 'calendarPosts');
        const unsubCal = onSnapshot(calCol, async (snapshot) => {
          if (snapshot.empty && !isInitializedRef.current) {
            for (const item of INITIAL_CALENDAR_POSTS) {
              await setDoc(doc(db, 'calendarPosts', String(item.id)), { ...item, id: String(item.id) });
            }
          } else {
            const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            if (list.length > 0) {
              dispatch({ type: 'SYNC_CALENDAR_POSTS', calendarPosts: list });
            }
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'calendarPosts');
        });
        unsubs.push(unsubCal);

        // 5. Publications Listener
        const pubCol = collection(db, 'publications');
        const unsubPub = onSnapshot(pubCol, async (snapshot) => {
          if (snapshot.empty && !isInitializedRef.current) {
            for (const item of INITIAL_PUBLICATIONS) {
              await setDoc(doc(db, 'publications', String(item.id)), { ...item, id: String(item.id) });
            }
          } else {
            const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            if (list.length > 0) {
              dispatch({ type: 'SYNC_PUBLICATIONS', publications: list });
            }
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'publications');
        });
        unsubs.push(unsubPub);

        // 6. Notifications Listener
        const notifCol = collection(db, 'notifications');
        const unsubNotif = onSnapshot(notifCol, (snapshot) => {
          const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
          if (list.length > 0) {
            dispatch({ type: 'SYNC_NOTIFICATIONS', notifications: list });
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'notifications');
        });
        unsubs.push(unsubNotif);

        isInitializedRef.current = true;
      } catch (e) {
        console.warn('Firestore initial sync error:', e);
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      unsubs.forEach(unsub => unsub && unsub());
    };
  }, []);

  // ─── Action Handlers with Firestore Writes ───

  const updateTicketStatus = useCallback(async (ticketId, status) => {
    dispatch({ type: 'UPDATE_TICKET_STATUS', ticketId, status });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Ticket ${ticketId} → ${status.toUpperCase()}`, notifType: 'info' });

    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        status,
        progress: status === 'livre' ? 100 : status === 'validation' ? 90 : 50,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  }, []);

  const reassignTicket = useCallback(async (ticketId, assignee, assigneeName) => {
    dispatch({ type: 'REASSIGN_TICKET', ticketId, assignee });
    dispatch({ type: 'ADD_NOTIFICATION', text: `IA Traffic : ${ticketId} réassigné à ${assigneeName}`, notifType: 'success' });

    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        assignee,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  }, []);

  const addTicket = useCallback(async (ticket) => {
    dispatch({ type: 'ADD_TICKET', ticket });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Brief soumis : ${ticket.title}`, notifType: 'success' });

    try {
      const ticketRef = doc(db, 'tickets', ticket.id);
      await setDoc(ticketRef, {
        ...ticket,
        createdAt: ticket.createdAt || new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `tickets/${ticket.id}`);
    }
  }, []);

  const validateCalendarItem = useCallback((index, contentName) => {
    dispatch({ type: 'VALIDATE_CALENDAR', index });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Validé : ${contentName}`, notifType: 'success' });
  }, []);

  const rejectCalendarItem = useCallback((index, contentName) => {
    dispatch({ type: 'REJECT_CALENDAR', index });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Rejeté : ${contentName} — modification requise`, notifType: 'warning' });
  }, []);

  const submitCalendarItem = useCallback((index, contentName) => {
    dispatch({ type: 'SUBMIT_CALENDAR', index });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Soumis : ${contentName}`, notifType: 'info' });
  }, []);

  const publishCalendarItem = useCallback((index, contentName) => {
    dispatch({ type: 'PUBLISH_CALENDAR', index });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Publié : ${contentName}`, notifType: 'success' });
  }, []);

  // ─── Briefs Workflow Actions ───
  const addBrief = useCallback(async (brief) => {
    dispatch({ type: 'ADD_BRIEF', brief });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Nouveau Brief créé : ${brief.title} (${brief.id})`, notifType: 'success' });

    try {
      const briefRef = doc(db, 'briefs', brief.id);
      await setDoc(briefRef, {
        ...brief,
        createdAt: brief.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `briefs/${brief.id}`);
    }
  }, []);

  const updateBrief = useCallback(async (id, updatedFields) => {
    dispatch({ type: 'UPDATE_BRIEF', id, updatedFields });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Brief mis à jour : ${id}`, notifType: 'info' });

    try {
      const briefRef = doc(db, 'briefs', id);
      await updateDoc(briefRef, {
        ...updatedFields,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `briefs/${id}`);
    }
  }, []);

  const updateBriefStatus = useCallback(async (id, status, subStatus, comment, progress) => {
    dispatch({ type: 'UPDATE_BRIEF_STATUS', id, status, subStatus, progress });
    const statusLabels = {
      draft: 'Brouillon',
      submitted: 'Soumis pour Analyse',
      tech_review: 'Faisabilité Tech & Chiffrage',
      approved: 'Validé / Kick-off',
      in_progress: 'En Production',
      uat: 'Recette Client (UAT)',
      live: 'Livré / En Ligne',
      on_hold: 'Révision Requise',
    };
    dispatch({ type: 'ADD_NOTIFICATION', text: `Statut Brief ${id} → ${statusLabels[status] || status}`, notifType: status === 'live' || status === 'approved' ? 'success' : 'info' });

    try {
      const briefRef = doc(db, 'briefs', id);
      const updates = {
        status,
        updatedAt: new Date().toISOString()
      };
      if (subStatus !== undefined) updates.subStatus = subStatus;
      if (progress !== undefined) updates.progress = progress;
      await updateDoc(briefRef, updates);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `briefs/${id}`);
    }
  }, []);

  const addBriefComment = useCallback(async (briefId, comment) => {
    dispatch({ type: 'ADD_BRIEF_COMMENT', briefId, comment });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Nouveau commentaire ajouté sur le brief ${briefId}`, notifType: 'info' });

    try {
      const brief = state.briefs.find(b => b.id === briefId);
      const comments = brief?.comments || [];
      const briefRef = doc(db, 'briefs', briefId);
      await updateDoc(briefRef, {
        comments: [...comments, comment],
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `briefs/${briefId}`);
    }
  }, [state.briefs]);

  const addBriefAsset = useCallback(async (briefId, asset) => {
    dispatch({ type: 'ADD_BRIEF_ASSET', briefId, asset });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Document attaché au brief ${briefId} : ${asset.name}`, notifType: 'success' });

    try {
      const brief = state.briefs.find(b => b.id === briefId);
      const assets = brief?.assets || [];
      const briefRef = doc(db, 'briefs', briefId);
      await updateDoc(briefRef, {
        assets: [asset, ...assets],
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `briefs/${briefId}`);
    }
  }, [state.briefs]);

  const updateBriefMilestone = useCallback(async (briefId, milestoneId, percentage, status) => {
    dispatch({ type: 'UPDATE_BRIEF_MILESTONE', briefId, milestoneId, percentage, status });

    try {
      const brief = state.briefs.find(b => b.id === briefId);
      if (brief) {
        const milestones = (brief.milestones || []).map(m =>
          m.id === milestoneId ? { ...m, percentage, status: status || m.status } : m
        );
        const avgProgress = milestones.length > 0
          ? Math.round(milestones.reduce((acc, m) => acc + (m.percentage || 0), 0) / milestones.length)
          : brief.progress;

        const briefRef = doc(db, 'briefs', briefId);
        await updateDoc(briefRef, {
          milestones,
          progress: avgProgress,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `briefs/${briefId}`);
    }
  }, [state.briefs]);

  const deleteBrief = useCallback(async (id) => {
    dispatch({ type: 'DELETE_BRIEF', id });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Brief archivé/supprimé : ${id}`, notifType: 'warning' });

    try {
      const briefRef = doc(db, 'briefs', id);
      await deleteDoc(briefRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `briefs/${id}`);
    }
  }, []);

  // ─── Publication workflow actions ───
  const addPublication = useCallback(async (payload) => {
    const pubId = String(payload.id || nextPubId++);
    const pub = {
      id: pubId,
      title: payload.title,
      plateforme: payload.plateforme,
      format: payload.format,
      description: payload.description || '',
      dateTarget: payload.dateTarget || '',
      heureTarget: payload.heureTarget || '10:00',
      statut: 'Brouillon',
      action: 'Éditer',
      createdAt: new Date().toISOString(),
      submittedAt: null,
      validatedAt: null,
      scheduledAt: null,
      publishedAt: null,
    };
    dispatch({ type: 'ADD_PUBLICATION', payload: pub });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Publication créée : ${payload.title}`, notifType: 'success' });

    try {
      await setDoc(doc(db, 'publications', pubId), pub);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `publications/${pubId}`);
    }
  }, []);

  const submitForValidation = useCallback(async (id, title) => {
    dispatch({ type: 'SUBMIT_FOR_VALIDATION', id });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Soumis pour validation : ${title}`, notifType: 'info' });

    try {
      await updateDoc(doc(db, 'publications', String(id)), {
        statut: 'En validation',
        action: 'Relancer',
        submittedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `publications/${id}`);
    }
  }, []);

  const validatePublication = useCallback(async (id, title) => {
    dispatch({ type: 'VALIDATE_PUBLICATION', id });
    dispatch({ type: 'ADD_NOTIFICATION', text: `✅ Publication validée : ${title} — ajoutée au calendrier`, notifType: 'success' });

    try {
      await updateDoc(doc(db, 'publications', String(id)), {
        statut: 'Validé',
        action: 'Programmer',
        validatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `publications/${id}`);
    }
  }, []);

  const rejectPublication = useCallback(async (id, title) => {
    dispatch({ type: 'REJECT_PUBLICATION', id });
    dispatch({ type: 'ADD_NOTIFICATION', text: `❌ Publication rejetée : ${title} — corrections requises`, notifType: 'warning' });

    try {
      await updateDoc(doc(db, 'publications', String(id)), {
        statut: 'À corriger',
        action: 'Corriger',
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `publications/${id}`);
    }
  }, []);

  const schedulePublication = useCallback(async (id, title, date, heure) => {
    dispatch({ type: 'SCHEDULE_PUBLICATION', id, date, heure });
    dispatch({ type: 'ADD_NOTIFICATION', text: `📅 Publication programmée : ${title}`, notifType: 'success' });

    try {
      await updateDoc(doc(db, 'publications', String(id)), {
        statut: 'Programmé',
        action: 'Voir',
        scheduledAt: new Date().toISOString(),
        dateTarget: date,
        heureTarget: heure,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `publications/${id}`);
    }
  }, []);

  const publishPublication = useCallback(async (id, title) => {
    dispatch({ type: 'PUBLISH_PUBLICATION', id });
    dispatch({ type: 'ADD_NOTIFICATION', text: `🚀 Publication publiée : ${title}`, notifType: 'success' });

    try {
      await updateDoc(doc(db, 'publications', String(id)), {
        statut: 'Publié',
        action: 'Voir',
        publishedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `publications/${id}`);
    }
  }, []);

  // ─── Reporting & Insights workflow actions ───
  const addReport = useCallback(async (report) => {
    dispatch({ type: 'ADD_REPORT', report });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Nouvelle demande de rapport créée : ${report.title} (${report.id})`, notifType: 'success' });

    try {
      await setDoc(doc(db, 'reports', report.id), {
        ...report,
        createdAt: report.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `reports/${report.id}`);
    }
  }, []);

  const updateReport = useCallback(async (id, updatedFields) => {
    dispatch({ type: 'UPDATE_REPORT', id, updatedFields });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Rapport mis à jour : ${id}`, notifType: 'info' });

    try {
      await updateDoc(doc(db, 'reports', id), {
        ...updatedFields,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `reports/${id}`);
    }
  }, []);

  const updateReportStatus = useCallback(async (id, status, author, note) => {
    const statusLabel = REPORT_STATUSES[status]?.label || status;
    dispatch({ type: 'UPDATE_REPORT_STATUS', id, status, author, note, statusLabel });
    const isSuccess = status === 'approved' || status === 'delivered';
    dispatch({ type: 'ADD_NOTIFICATION', text: `Statut Rapport ${id} → ${statusLabel}`, notifType: isSuccess ? 'success' : 'info' });

    try {
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const auditEntry = {
        timestamp,
        user: author || 'Utilisateur',
        action: `Statut → ${statusLabel}`,
        detail: note || `Transition vers le statut ${statusLabel}`
      };

      const report = state.reports.find(r => r.id === id);
      const auditLog = [auditEntry, ...(report?.auditLog || [])];

      await updateDoc(doc(db, 'reports', id), {
        status,
        auditLog,
        deliveredDate: status === 'delivered' ? now.toISOString().slice(0,10) : report?.deliveredDate || null,
        updatedAt: now.toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `reports/${id}`);
    }
  }, [state.reports]);

  const addReportComment = useCallback(async (reportId, comment) => {
    dispatch({ type: 'ADD_REPORT_COMMENT', reportId, comment });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Nouveau commentaire sur le rapport ${reportId}`, notifType: 'info' });

    try {
      const report = state.reports.find(r => r.id === reportId);
      const comments = report?.comments || [];
      await updateDoc(doc(db, 'reports', reportId), {
        comments: [...comments, comment],
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `reports/${reportId}`);
    }
  }, [state.reports]);

  const addReportSpeech = useCallback(async (reportId, speech) => {
    dispatch({ type: 'ADD_REPORT_SPEECH', reportId, speech });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Prise de parole ajoutée au rapport ${reportId} : ${speech.name}`, notifType: 'success' });

    try {
      const report = state.reports.find(r => r.id === reportId);
      const speeches = report?.data?.speeches || [];
      await updateDoc(doc(db, 'reports', reportId), {
        'data.speeches': [speech, ...speeches],
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `reports/${reportId}`);
    }
  }, [state.reports]);

  const updateReportData = useCallback(async (reportId, data) => {
    dispatch({ type: 'UPDATE_REPORT_DATA', reportId, data });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Données du rapport actualisées : ${reportId}`, notifType: 'success' });

    try {
      const report = state.reports.find(r => r.id === reportId);
      await updateDoc(doc(db, 'reports', reportId), {
        data: {
          ...(report?.data || {}),
          ...data
        },
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `reports/${reportId}`);
    }
  }, [state.reports]);

  const deleteReport = useCallback(async (id) => {
    dispatch({ type: 'DELETE_REPORT', id });
    dispatch({ type: 'ADD_NOTIFICATION', text: `Rapport archivé / supprimé : ${id}`, notifType: 'warning' });

    try {
      await deleteDoc(doc(db, 'reports', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `reports/${id}`);
    }
  }, []);

  const addNotification = useCallback(async (text, type) => {
    const notif = {
      id: String(Date.now()),
      text,
      type: type || 'info',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_NOTIFICATION', text, notifType: type });

    try {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (e) {
      // Notification errors are non-blocking
    }
  }, []);

  return (
    <AppContext.Provider value={{
      ...state, 
      updateTicketStatus, 
      reassignTicket, 
      addTicket,
      validateCalendarItem, 
      rejectCalendarItem, 
      submitCalendarItem,
      publishCalendarItem, 
      addNotification,
      addPublication, 
      submitForValidation, 
      validatePublication,
      rejectPublication, 
      schedulePublication, 
      publishPublication,
      addBrief, 
      updateBrief, 
      updateBriefStatus, 
      addBriefComment,
      addBriefAsset, 
      updateBriefMilestone, 
      deleteBrief,
      addReport, 
      updateReport, 
      updateReportStatus, 
      addReportComment,
      addReportSpeech, 
      updateReportData, 
      deleteReport,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
