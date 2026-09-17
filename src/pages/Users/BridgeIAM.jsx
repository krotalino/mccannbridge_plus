import React, { useState, useEffect } from 'react';
import { IAMProvider, useIAM } from './iamContext';
import { IAM_TABS } from './constants';
import UserDirectory from './components/UserDirectory';
import UserOnboarding from './components/UserOnboarding';
import UserProfile from './components/UserProfile';
import UserExportPdf from './components/UserExportPdf';
import SecurityMatrix from './components/SecurityMatrix';
import PdfViewerModal from './components/PdfViewerModal';
import { 
  UsersRound, UserPlus, UserCheck, Printer, Shield, 
  Search, Bell, X, Check, AlertCircle, Info, AlertTriangle 
} from 'lucide-react';
import '../../styles/iam.css';

function IAMContent() {
  const { 
    activeTab, 
    setActiveTab, 
    selectedUser, 
    setSelectedUser, 
    scope, 
    setScope,
    toasts,
    dismissToast,
    confirmOpts,
    setConfirmOpts,
    notifications,
    users
  } = useIAM();

  const [activePdfDoc, setActivePdfDoc] = useState(null);
  const [showCmdK, setShowCmdK] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [typedConfirmInput, setTypedConfirmInput] = useState("");

  // Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCmdK(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCmdK(false);
        setShowNotifs(false);
        setActivePdfDoc(null);
        if (confirmOpts) setConfirmOpts(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmOpts, setConfirmOpts]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setActiveTab("profile");
  };

  const handleExportUser = (user) => {
    setSelectedUser(user);
    setActiveTab("export");
  };

  const filteredCmdUsers = users.filter(u => {
    if (!cmdSearch.trim()) return true;
    const q = cmdSearch.toLowerCase();
    return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.role || "").toLowerCase().includes(q);
  });

  return (
    <div className="iam-root">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="iam-topnav">
        {/* Brand & Orb */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="iam-logo-orb">
            <div className="iam-logo-ring" />
            <div className="iam-logo-core" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="iam-logo-text">BRIDGE IAM</span>
              <span className="iam-badge" style={{ fontSize: 10, background: "rgba(255, 102, 0, 0.2)", color: "var(--iam-orange)" }}>
                VAULT
              </span>
            </div>
            <div className="iam-logo-sub">
              Gouvernance des identités & accès bi-rive
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="iam-tabs" role="tablist">
          {IAM_TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.id === 'directory' ? UsersRound
              : tab.id === 'onboarding' ? UserPlus
              : tab.id === 'profile' ? UserCheck
              : tab.id === 'export' ? Printer
              : Shield;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`iam-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Cmd+K, Scope, Notifications) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          {/* Cmd+K Trigger */}
          <button 
            type="button" 
            className="iam-btn iam-btn-sm"
            onClick={() => setShowCmdK(true)}
            style={{ fontSize: 12, padding: "5px 12px", display: "flex", alignItems: "center", gap: 8 }}
          >
            <Search size={13} />
            <span style={{ color: "var(--iam-text-3)" }}>Rechercher…</span>
            <span className="iam-kbd">⌘K</span>
          </button>

          {/* Scope Selector */}
          <div className="iam-scope">
            <button 
              className={`iam-scope-btn ${scope === 'global' ? 'active' : ''}`}
              onClick={() => setScope('global')}
            >
              Vue globale
            </button>
            <button 
              className={`iam-scope-btn ${scope === 'mccann' ? 'active' : ''}`}
              onClick={() => setScope('mccann')}
            >
              McCann
            </button>
            <button 
              className={`iam-scope-btn ${scope === 'orange' ? 'active' : ''}`}
              onClick={() => setScope('orange')}
            >
              Orange CM
            </button>
          </div>

          {/* Notifications Button */}
          <button 
            type="button" 
            className="iam-btn-icon" 
            onClick={() => setShowNotifs(prev => !prev)}
            title="Notifications IAM"
            style={{ position: "relative" }}
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--iam-orange)"
              }} />
            )}
          </button>
        </div>
      </header>

      {/* Notifications Popover */}
      {showNotifs && (
        <div className="iam-notif-pop" style={{ right: 24, top: 68 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--iam-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--iam-text)" }}>Notifications IAM</span>
            <span style={{ fontSize: 11, color: "var(--iam-text-3)" }}>{notifications.length} message(s)</span>
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "var(--iam-text-3)", fontSize: 12.5 }}>
              Aucune notification non lue.
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="iam-notif-item">
                <div style={{ fontSize: 12, color: "var(--iam-text)" }}>{n.title}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. MAIN VIEW SWITCHER */}
      <main className="iam-page">
        {activeTab === 'directory' && (
          <UserDirectory 
            onSelectUser={handleSelectUser}
            onOnboard={() => setActiveTab('onboarding')}
            onExportPdf={handleExportUser}
            onViewDoc={(doc) => setActivePdfDoc(doc)}
          />
        )}

        {activeTab === 'onboarding' && (
          <UserOnboarding 
            onFinish={handleSelectUser}
            onCancel={() => setActiveTab('directory')}
            onViewDoc={(doc) => setActivePdfDoc(doc)}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile 
            user={selectedUser || (users.length > 0 ? users[0] : null)}
            onBack={() => setActiveTab('directory')}
            onExportPdf={handleExportUser}
            onViewDoc={(doc) => setActivePdfDoc(doc)}
          />
        )}

        {activeTab === 'export' && (
          <UserExportPdf 
            user={selectedUser || (users.length > 0 ? users[0] : null)}
            onBack={() => setActiveTab('directory')}
          />
        )}

        {activeTab === 'security' && (
          <SecurityMatrix />
        )}
      </main>

      {/* 3. MODALS & OVERLAYS */}

      {/* PDF Viewer Modal */}
      {activePdfDoc && (
        <PdfViewerModal 
          doc={activePdfDoc}
          onClose={() => setActivePdfDoc(null)}
        />
      )}

      {/* Command Palette (Cmd+K) */}
      {showCmdK && (
        <div 
          className="iam-cmdk-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowCmdK(false);
          }}
        >
          <div className="iam-cmdk" role="dialog" aria-modal="true">
            <div className="iam-row" style={{ borderBottom: "1px solid var(--iam-border)" }}>
              <Search size={17} style={{ marginLeft: 18, color: "var(--iam-text-3)" }} />
              <input 
                className="iam-cmdk-input"
                autoFocus
                placeholder="Rechercher un collaborateur, un document ou un écran…"
                value={cmdSearch}
                onChange={(e) => setCmdSearch(e.target.value)}
              />
              <span className="iam-kbd" style={{ marginRight: 16 }}>ESC</span>
            </div>

            <div className="iam-cmdk-list">
              <div className="iam-cmdk-group" style={{ fontSize: 10, fontWeight: 700, color: "var(--iam-text-3)", textTransform: "uppercase" }}>
                Actions Rapides
              </div>
              <button 
                className="iam-cmdk-item" 
                onClick={() => { setActiveTab('onboarding'); setShowCmdK(false); }}
              >
                <UserPlus size={15} />
                <span>+ Enregistrer un nouveau collaborateur</span>
              </button>
              <button 
                className="iam-cmdk-item" 
                onClick={() => { setActiveTab('directory'); setShowCmdK(false); }}
              >
                <UsersRound size={15} />
                <span>Accéder à l'Annuaire complet</span>
              </button>
              <button 
                className="iam-cmdk-item" 
                onClick={() => { setActiveTab('security'); setShowCmdK(false); }}
              >
                <Shield size={15} />
                <span>Consulter la Matrice des Rôles & Sécurité</span>
              </button>

              {filteredCmdUsers.length > 0 && (
                <>
                  <div className="iam-cmdk-group" style={{ fontSize: 10, fontWeight: 700, color: "var(--iam-text-3)", textTransform: "uppercase", marginTop: 10 }}>
                    Collaborateurs Enregistrés ({filteredCmdUsers.length})
                  </div>
                  {filteredCmdUsers.slice(0, 5).map(u => (
                    <button 
                      key={u.uid} 
                      className="iam-cmdk-item"
                      onClick={() => {
                        handleSelectUser(u);
                        setShowCmdK(false);
                      }}
                    >
                      <UserCheck size={15} />
                      <span>{u.name} — <span style={{ color: "var(--iam-cyan)" }}>{u.role}</span></span>
                      <span className="cmd-hint">{u.uid}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmOpts && (
        <div className="iam-modal-overlay">
          <div className="iam-modal" role="dialog" aria-modal="true">
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255, 77, 94, 0.15)", color: "var(--iam-red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertTriangle size={18} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--iam-text)", margin: 0 }}>
                  {confirmOpts.title || "Confirmation requise"}
                </h3>
              </div>

              <p style={{ fontSize: 13.5, color: "var(--iam-text-2)", lineHeight: 1.5, marginBottom: 20 }}>
                {confirmOpts.message}
              </p>

              {confirmOpts.typedConfirm && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "var(--iam-text-3)", marginBottom: 6 }}>
                    Veuillez saisir <strong>{confirmOpts.typedConfirm}</strong> pour confirmer :
                  </div>
                  <input 
                    type="text"
                    className="iam-typed-confirm"
                    value={typedConfirmInput}
                    onChange={(e) => setTypedConfirmInput(e.target.value)}
                    placeholder={confirmOpts.typedConfirm}
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button 
                  className="iam-btn" 
                  onClick={() => { setConfirmOpts(null); setTypedConfirmInput(""); }}
                >
                  Annuler
                </button>
                <button 
                  className="iam-btn iam-btn-primary"
                  style={{ background: "var(--iam-red)", borderColor: "var(--iam-red)" }}
                  disabled={confirmOpts.typedConfirm && typedConfirmInput !== confirmOpts.typedConfirm}
                  onClick={() => {
                    confirmOpts.onConfirm && confirmOpts.onConfirm();
                    setConfirmOpts(null);
                    setTypedConfirmInput("");
                  }}
                >
                  Confirmer la suppression
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TOASTS SYSTEM */}
      <div className="iam-toasts" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`iam-toast ${t.tone || 'info'} ${t.leaving ? 'leaving' : ''}`}>
            <div className="iam-toast-icon">
              {t.tone === 'success' ? <Check size={16} /> : t.tone === 'error' ? <AlertCircle size={16} /> : <Info size={16} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--iam-text)" }}>
                {t.message}
              </div>
              {t.detail && (
                <div style={{ fontSize: 11.5, color: "var(--iam-text-3)", marginTop: 2 }}>
                  {t.detail}
                </div>
              )}
            </div>
            <button 
              type="button" 
              onClick={() => dismissToast(t.id)}
              style={{ background: "none", border: "none", color: "var(--iam-text-3)", cursor: "pointer", padding: 2 }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BridgeIAM() {
  return (
    <IAMProvider>
      <IAMContent />
    </IAMProvider>
  );
}
