import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export const IAMContext = createContext(null);

export const useIAM = () => {
  const ctx = useContext(IAMContext);
  if (!ctx) {
    throw new Error("useIAM must be used within an IAMProvider");
  }
  return ctx;
};

const STORAGE_USERS_KEY = "mccann_bridge_iam_users";
const STORAGE_LOGS_KEY = "mccann_bridge_iam_audit_logs";
const STORAGE_NOTIFS_KEY = "mccann_bridge_iam_notifications";

export function IAMProvider({ children }) {
  // 1. Clean Users state - NO dummy/mock data
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure no old dummy users with mock UIDs exist
        const cleaned = parsed.filter(u => !u.uid?.startsWith("UID-2021-0842") && u.name !== "Alain Patrick Eboa");
        return cleaned;
      }
    } catch (e) {
      console.error("Error reading users from localStorage:", e);
    }
    return [];
  });

  // 2. Active view & selections
  const [activeTab, setActiveTab] = useState("directory");
  const [selectedUser, setSelectedUser] = useState(null);
  const [scope, setScope] = useState("global");

  // 3. Toasts system
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const toast = useCallback((message, tone = "success", detail = "") => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, tone, detail }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 240);
  }, []);

  // 4. Confirm dialog
  const [confirmOpts, setConfirmOpts] = useState(null);
  const confirm = useCallback((opts) => {
    setConfirmOpts(opts);
  }, []);

  // 5. Dynamic Audit Logs
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "log-init",
        time: new Date().toLocaleTimeString("fr-FR"),
        type: "INITIALISATION IAM",
        severity: "info",
        shore: "birive",
        title: "Coffre IAM Bi-Rive Initialisé",
        lines: [
          "Données d'exemples purgées avec succès.",
          "Coffre fort prêt pour l'enregistrement des nouveaux collaborateurs."
        ],
        meta: "Système de Gouvernance Bi-Rive",
        verdict: "CONFORME",
        verdictTone: "green",
        hash: "init_vault_001",
        gateway: "bridge-iam.vault",
        json: { event: "vault.ready", status: "clean", storage: "persistent" }
      }
    ];
  });

  const addAuditLog = useCallback((entry) => {
    const newEntry = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString("fr-FR"),
      ...entry,
      hash: Math.random().toString(16).substring(2, 10) + "…" + Math.random().toString(16).substring(2, 6)
    };
    setAuditLogs(prev => {
      const updated = [newEntry, ...prev.slice(0, 49)];
      try {
        localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // 6. Notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Sync users to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Error saving users to localStorage:", e);
    }
  }, [users]);

  // Load real users from Firestore on initial mount if localStorage was empty
  useEffect(() => {
    let isMounted = true;
    async function loadFirestoreUsers() {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, "users"));
        if (!snap.empty && isMounted) {
          const fsUsers = [];
          snap.forEach(docSnap => {
            const data = docSnap.data();
            // Exclude mock users if any
            if (data.name && data.name !== "Alain Patrick Eboa") {
              fsUsers.push({
                uid: docSnap.id,
                ...data
              });
            }
          });
          if (fsUsers.length > 0) {
            setUsers(prev => {
              if (prev.length === 0) return fsUsers;
              // Merge preserving local
              const existingUids = new Set(prev.map(u => u.uid));
              const missing = fsUsers.filter(u => !existingUids.has(u.uid));
              return [...prev, ...missing];
            });
          }
        }
      } catch (err) {
        console.info("Firestore users read error (using local state):", err.message);
      }
    }
    loadFirestoreUsers();
    return () => { isMounted = false; };
  }, []);

  // User Actions
  const addUser = useCallback((newUser) => {
    setUsers(prev => {
      const exists = prev.some(u => u.uid === newUser.uid || u.email === newUser.email);
      const updated = exists ? prev.map(u => u.uid === newUser.uid ? { ...u, ...newUser } : u) : [newUser, ...prev];
      return updated;
    });

    // Firestore async sync
    if (db && newUser.uid) {
      setDoc(doc(db, "users", newUser.uid), {
        ...newUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => console.warn("Firestore sync warning:", err));
    }

    addAuditLog({
      type: "CRÉATION COMPTE",
      severity: "info",
      shore: newUser.tenant || "mccann",
      title: `Création du compte collaborateur : ${newUser.name}`,
      lines: [
        `Rattachement : ${newUser.role || 'Collaborateur'} (${newUser.dept || 'Département'})`,
        `Identifiant Unique : ${newUser.uid} · ID-McCann : ${newUser.idMcann || 'N/A'}`
      ],
      meta: `Matricule: ${newUser.matricule || 'N/A'}`,
      verdict: "DÉPLOYÉ",
      verdictTone: "green",
      gateway: "bridge-iam.provisioning",
      json: { uid: newUser.uid, email: newUser.email, rbac: newUser.rbac }
    });

    toast(`Collaborateur ${newUser.name} enregistré avec succès`, "success", "Enregistré dans le registre sécurisé IAM");
  }, [addAuditLog, toast]);

  const updateUser = useCallback((uid, updates) => {
    setUsers(prev => {
      const updated = prev.map(u => {
        if (u.uid === uid) {
          return { ...u, ...updates, updatedAt: new Date().toISOString() };
        }
        return u;
      });
      return updated;
    });

    if (selectedUser && selectedUser.uid === uid) {
      setSelectedUser(prev => ({ ...prev, ...updates }));
    }

    // Firestore async sync
    if (db && uid) {
      setDoc(doc(db, "users", uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => console.warn("Firestore sync warning:", err));
    }

    addAuditLog({
      type: "MODIFICATION PROFIL",
      severity: "info",
      shore: updates.tenant || "mccann",
      title: `Mise à jour profil : ${uid}`,
      lines: [
        `Champs mis à jour : ${Object.keys(updates).join(', ')}`
      ],
      meta: "Administration IAM",
      verdict: "ACTUALISÉ",
      verdictTone: "green",
      gateway: "bridge-iam.profile",
      json: { uid, updatedFields: Object.keys(updates) }
    });

    toast("Profil collaborateur mis à jour", "success");
  }, [selectedUser, addAuditLog, toast]);

  const deleteUser = useCallback((uid) => {
    setUsers(prev => prev.filter(u => u.uid !== uid));
    if (selectedUser && selectedUser.uid === uid) {
      setSelectedUser(null);
    }

    if (db && uid) {
      deleteDoc(doc(db, "users", uid)).catch(err => console.warn("Firestore delete warning:", err));
    }

    addAuditLog({
      type: "SUPPRESSION COMPTE",
      severity: "warning",
      shore: "birive",
      title: `Suppression du compte : ${uid}`,
      lines: ["Le compte et les habilitations associées ont été révoqués."],
      meta: "Sécurité & Révocation ZTNA",
      verdict: "RÉVOQUÉ",
      verdictTone: "red",
      gateway: "bridge-iam.deprovisioning",
      json: { uid }
    });

    toast("Compte collaborateur révoqué et supprimé", "info");
  }, [selectedUser, addAuditLog, toast]);

  const contextValue = {
    users,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    activeTab,
    setActiveTab,
    selectedUser,
    setSelectedUser,
    scope,
    setScope,
    toasts,
    toast,
    dismissToast,
    confirm,
    confirmOpts,
    setConfirmOpts,
    auditLogs,
    addAuditLog,
    notifications,
    setNotifications
  };

  return (
    <IAMContext.Provider value={contextValue}>
      {children}
    </IAMContext.Provider>
  );
}
