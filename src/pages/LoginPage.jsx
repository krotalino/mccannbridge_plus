import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Grands comptes pilotés dans Bridge (identique à https://ocmgrowthbridge.thekoutoswiss.com/login)
const CLIENTS_LIST = [
  {
    id: 'orange-cm',
    name: 'Orange Cameroun',
    desc: 'Télécommunications · Compte historique',
    mark: 'orange',
    bg: '#FF7900',
    fg: '#fff',
  },
  {
    id: 'orange-bf',
    name: 'Orange Burkina Faso',
    desc: 'Télécommunications · Marché UEMOA',
    mark: 'orange',
    bg: '#FF7900',
    fg: '#fff',
  },
  {
    id: 'sabc',
    name: 'Boissons du Cameroun',
    desc: 'Agro-alimentaire · SABC (Groupe Castel)',
    mark: 'SABC',
    bg: 'linear-gradient(135deg, #0E8A45, #D4A017)',
    fg: '#fff',
  },
  {
    id: 'chococam',
    name: 'Chococam',
    desc: 'Confiserie & chocolaterie · Groupe Tiger Brands',
    mark: 'COCO',
    bg: 'linear-gradient(135deg, #5B3A1E, #8A5A2B)',
    fg: '#fff',
  },
];

// Profils Agence McCann (Étape 2)
const AGENCY_PROFILES = [
  { id: 'cm', name: 'Community Manager', avatar: '💬', accent: '#2E6BFF', team: 'Équipe digitale McCann' },
  { id: 'analyst', name: 'Digital Web Analyst', avatar: '📊', accent: '#C936D9', team: 'Équipe digitale McCann' },
  { id: 'growth', name: 'Growth Hacker', avatar: '🚀', accent: '#2BE8A0', team: 'Équipe digitale McCann' },
  { id: 'motion', name: 'Motion Designer', avatar: '🎬', accent: '#FF7900', team: 'Studio créatif' },
  { id: 'infographe', name: 'Infographe', avatar: '🎨', accent: '#C936D9', team: 'Studio créatif' },
  { id: 'influence', name: 'Influence Manager', avatar: '🌟', accent: '#FF7900', team: 'Pôle Influence' },
  { id: 'cdp', name: 'Chef de projet', avatar: '🗂', accent: '#2E6BFF', team: 'Traffic & production' },
  { id: 'dc', name: 'Directeur clientèle', avatar: '🤝', accent: '#2BE8A0', team: 'Direction de clientèle' },
  { id: 'admin', name: 'Administrateur', avatar: '🛡', accent: '#C936D9', team: 'Super Admin Bridge' },
];

// Interlocuteurs Côté Client (Étape 3)
const CLIENT_INTERLOCUTEURS = [
  { id: 'rc', name: 'Responsable de la communication', avatar: '📣', accent: '#FF7900', team: 'Direction communication' },
  { id: 'cs', name: 'Communication Specialist', avatar: '✍️', accent: '#2E6BFF', team: 'Communication' },
  { id: 'bm', name: 'Brand Manager', avatar: '🏷', accent: '#C936D9', team: 'Marketing' },
  { id: 'dm', name: 'Directeur Marketing', avatar: '🧭', accent: '#2BE8A0', team: 'Direction marketing' },
  { id: 'media', name: 'Chef de groupe média', avatar: '📡', accent: '#FF7900', team: 'Média' },
  { id: 'data', name: 'Data & Insights Manager', avatar: '📈', accent: '#2E6BFF', team: 'Data & performance' },
];

// Étapes guidées
const STEPS = [
  { id: 1, label: 'Client' },
  { id: 2, label: 'Profil agence' },
  { id: 3, label: 'Côté client' },
];

// Composant Logo Client SVG / Textuel
function ClientLogo({ client, size = 44, radius = 12, fontSize = 11 }) {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    background: client.bg,
    color: client.fg,
    fontSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    letterSpacing: '0.02em',
    flexShrink: 0,
    boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
  };

  if (client.mark === 'orange') {
    return (
      <div style={containerStyle} aria-hidden="true">
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="2" />
          <path d="M7 15c1.2 1.6 3 2.6 5 2.6s3.8-1 5-2.6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="9" r="2.6" fill="#fff" />
        </svg>
      </div>
    );
  }

  return (
    <div style={containerStyle} aria-hidden="true">
      {client.mark}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  // Wizard state
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgencyProfile, setSelectedAgencyProfile] = useState(null);
  const [selectedClientStakeholder, setSelectedClientStakeholder] = useState(null);
  const [side, setSide] = useState('agence'); // 'agence' | 'client'
  const [isShaking, setIsShaking] = useState(false);
  const [missingHint, setMissingHint] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Filter clients by search
  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CLIENTS_LIST;
    return CLIENTS_LIST.filter(
      (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Is all 3 selections completed
  const isComplete = Boolean(selectedClient && selectedAgencyProfile && selectedClientStakeholder);

  // Move directly to step
  const handleGoToStep = (targetStep) => {
    setErrorMessage('');
    setStep(targetStep);
  };

  // Next step button
  const handleNextStep = () => {
    if (step === 1 && !selectedClient) {
      return triggerShake('Sélectionnez d’abord le grand compte client.');
    }
    if (step === 2 && !selectedAgencyProfile) {
      return triggerShake('Choisissez votre profil côté Agence McCann.');
    }
    if (step === 3 && (!selectedClientStakeholder || !isComplete)) {
      return triggerShake(
        selectedClientStakeholder
          ? 'Complétez aussi votre profil côté Agence (étape 2).'
          : 'Sélectionnez l’interlocuteur côté client.'
      );
    }
    setErrorMessage('');
    setMissingHint('');
    setStep((prev) => Math.min(3, prev + 1));
  };

  // Trigger shake animation with feedback
  const triggerShake = (msg) => {
    setMissingHint(msg);
    setErrorMessage(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Connect to workspace
  const handleConnect = () => {
    if (!isComplete) {
      if (!selectedClient) {
        setStep(1);
        return triggerShake('Étape 1 incomplète : choisissez le client.');
      }
      if (!selectedAgencyProfile) {
        setStep(2);
        return triggerShake('Étape 2 incomplète : choisissez le profil agence.');
      }
      return triggerShake('Étape 3 incomplète : choisissez l’interlocuteur client.');
    }

    setErrorMessage('');
    const targetUser = side === 'agence' ? selectedAgencyProfile : selectedClientStakeholder;

    const userData = {
      role: side,
      user: targetUser.name,
      email: `${targetUser.id}@${selectedClient.id}.bridge`,
      poste: targetUser.name,
      client: selectedClient.name,
      interlocuteurClient: selectedClientStakeholder.name,
      profilAgence: selectedAgencyProfile.name,
    };

    try {
      localStorage.setItem('bridge_active_client', selectedClient.name);
    } catch (e) {}

    login(userData);
    navigate('/');
  };

  // Google Login
  const handleGoogleConnect = async () => {
    if (!isComplete) {
      return triggerShake('Complétez les 3 étapes avant la connexion Google.');
    }
    setGoogleLoading(true);
    setErrorMessage('');
    try {
      const targetUser = side === 'agence' ? selectedAgencyProfile : selectedClientStakeholder;
      await loginWithGoogle(side, targetUser.name);
      try {
        localStorage.setItem('bridge_active_client', selectedClient.name);
      } catch (e) {}
      navigate('/');
    } catch {
      setErrorMessage('Connexion Google annulée ou indisponible. Utilisez « Accéder à l’espace de travail ».');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="hp-page">
      {/* Background Blobs & Floating Lights */}
      <div className="hp-blobs" aria-hidden="true">
        <div className="hp-blob b1" />
        <div className="hp-blob b2" />
        <div className="hp-blob b3" />
        <div className="hp-blob b4" />
      </div>

      {/* Grid Pattern */}
      <div className="hp-grid" aria-hidden="true" />

      {/* Top Navbar */}
      <nav className="hp-topnav">
        <div className="hp-brand">
          <div className="hp-brand-orb" aria-hidden="true" />
          <div>
            <div className="hp-brand-name">BRIDGE</div>
            <div className="hp-brand-sub">McCann × Grands comptes</div>
          </div>
        </div>

        <div className="hp-status">
          <span className="dot" />
          <span>Digital Operating System · connecté</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hp-hero">
        <div>
          <div className="hp-badge">✦ Digital Operating System B2B</div>
          <h1 className="hp-headline">
            Le pont opérationnel entre{' '}
            <span className="hp-grad-text">l'agence</span> et{' '}
            <span className="hp-grad-text">les grands comptes</span>.
          </h1>

          <p className="hp-description">
            Bridge orchestre briefs, calendriers, validations, influence, reporting et suivi financier entre les équipes de McCann Douala et de ses grands comptes — Orange Cameroun, Orange Burkina Faso, Boissons du Cameroun et Chococam — autour d'un même rythme d'exécution.
          </p>

          {/* Accounts List Pills */}
          <div className="hp-accounts" aria-label="Comptes pilotés dans Bridge">
            {CLIENTS_LIST.map((c) => (
              <span key={c.id} className="hp-account-pill">
                <ClientLogo client={c} size={22} radius={7} fontSize={7} />
                {c.name}
              </span>
            ))}
          </div>

          {/* Interactive Floating Mockups */}
          <div className="hp-mockups" aria-hidden="true">
            {/* KPI Realtime Card */}
            <div className="hp-mock m-kpi">
              <div className="hp-mock-label">📊 Tableau de bord · KPI temps réel</div>
              <div className="hp-kpi-row">
                <div className="hp-kpi-box c1">
                  <div className="v">+18%</div>
                  <div className="l">Reach</div>
                </div>
                <div className="hp-kpi-box c2">
                  <div className="v">7,4%</div>
                  <div className="l">Engagement</div>
                </div>
                <div className="hp-kpi-box c3">
                  <div className="v">96</div>
                  <div className="l">Validations</div>
                </div>
              </div>
              <div className="hp-bars">
                <i style={{ height: '55%' }} />
                <i style={{ height: '78%' }} />
                <i style={{ height: '64%' }} />
                <i style={{ height: '92%' }} />
                <i style={{ height: '72%' }} />
              </div>
            </div>

            {/* Sync Card */}
            <div className="hp-mock m-sync">
              <div className="hp-mock-label">🔄 Synchronisation</div>
              <div className="hp-sync-row">
                <span className="sdot" /> Briefs validés · il y a 2 min
              </div>
              <div className="hp-sync-row">
                <span className="sdot b" /> Calendriers synchronisés · il y a 5 min
              </div>
              <div className="hp-sync-row">
                <span className="sdot" /> Rapports consolidés · il y a 12 min
              </div>
              <div className="hp-sync-line" />
              <div className="hp-sync-row" style={{ fontSize: 10 }}>
                Tunnel chiffré McCann ⇄ Clients · 0 dérive
              </div>
            </div>

            {/* Influence Card */}
            <div className="hp-mock m-inf">
              <div className="hp-mock-label">🌟 Influence · talents suivis</div>
              {[
                { n: 'Queen Diva', i: 'QD', c: '#C936D9', tag: '7,2%', tc: 'rgba(43,232,160,0.15)', tcol: '#2BE8A0' },
                { n: 'Bk Baptist', i: 'BB', c: '#2E6BFF', tag: '5,1%', tc: 'rgba(46,107,255,0.15)', tcol: '#6FA0FF' },
                { n: 'Blanche Bahoken', i: 'BB', c: '#FF7900', tag: '6,8%', tc: 'rgba(255,121,0,0.15)', tcol: '#FFB35C' },
              ].map((talent) => (
                <div key={talent.n} className="hp-inf-row">
                  <div className="hp-inf-av" style={{ background: talent.c }}>
                    {talent.i}
                  </div>
                  <div className="hp-inf-name">{talent.n}</div>
                  <span className="hp-inf-tag" style={{ background: talent.tc, color: talent.tcol }}>
                    {talent.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Validation Card */}
            <div className="hp-mock m-valid">
              <div className="hp-mock-label">✅ Validation sécurisée</div>
              {[
                { i: '📝', t: 'Brief Q3 — validé', bg: 'rgba(43,232,160,0.15)' },
                { i: '🗓', t: 'Calendrier Août — en revue', bg: 'rgba(255,197,61,0.15)' },
                { i: '🔐', t: 'Signature double OK', bg: 'rgba(46,107,255,0.15)' },
              ].map((item) => (
                <div key={item.t} className="hp-val-row">
                  <span className="hp-val-ic" style={{ background: item.bg }}>
                    {item.i}
                  </span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 3-Step Guided Wizard */}
        <div>
          <div
            className={`hp-wizard ${isShaking ? 'shake' : ''}`}
            role="form"
            aria-label="Assistant de connexion Bridge"
          >
            <div className="hp-wizard-title">Accès à votre espace</div>
            <div className="hp-wizard-sub">Identifiez-vous en 3 étapes guidées — aucune saisie fastidieuse.</div>

            {/* Stepper with connecting lines */}
            <div className="hp-steps" aria-label={`Étape ${step} sur 3`}>
              {STEPS.map((s, idx) => (
                <div key={s.id} style={{ display: 'contents' }}>
                  <div
                    className={`hp-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}
                    onClick={() => {
                      if (s.id === 1 || (s.id === 2 && selectedClient) || (s.id === 3 && selectedAgencyProfile)) {
                        handleGoToStep(s.id);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="hp-step-dot">{step > s.id ? '✓' : s.id}</div>
                    <span className="hp-step-label">{s.label}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`hp-step-line ${step > s.id ? 'done' : ''}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="hp-error" role="alert">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* STEP 1: Client Selection */}
            {step === 1 && (
              <div className="hp-panel">
                <div className="hp-panel-label">Étape 1 · Grand compte client</div>
                <div className="hp-search-wrap">
                  <span className="hp-search-icon">🔍</span>
                  <input
                    className="hp-search"
                    placeholder="Rechercher un client…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Rechercher un client"
                  />
                </div>

                <div className="hp-clients">
                  {filteredClients.map((client) => {
                    const isSelected = selectedClient?.id === client.id;
                    return (
                      <button
                        key={client.id}
                        type="button"
                        className={`hp-client ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedClient(client);
                          setErrorMessage('');
                          setMissingHint('');
                          setStep(2);
                        }}
                        aria-pressed={isSelected}
                      >
                        <ClientLogo client={client} />
                        <div>
                          <div className="hp-client-name">{client.name}</div>
                          <div className="hp-client-desc">{client.desc}</div>
                        </div>
                        <span className="hp-client-check">✓</span>
                      </button>
                    );
                  })}
                  {filteredClients.length === 0 && (
                    <div className="hp-empty-list">Aucun client ne correspond à « {searchQuery} ».</div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Agency Profile */}
            {step === 2 && (
              <div className="hp-panel">
                <button
                  type="button"
                  className="hp-back"
                  onClick={() => handleGoToStep(1)}
                >
                  ← Client : {selectedClient?.name}
                </button>
                <div className="hp-panel-label">Étape 2 · Votre profil — Agence McCann</div>
                <div className="hp-roles">
                  {AGENCY_PROFILES.map((profile) => {
                    const isSelected = selectedAgencyProfile?.id === profile.id;
                    return (
                      <button
                        key={profile.id}
                        type="button"
                        className={`hp-role ${isSelected ? 'selected' : ''}`}
                        style={{ '--hp-accent': profile.accent }}
                        onClick={() => {
                          setSelectedAgencyProfile(profile);
                          setErrorMessage('');
                          setMissingHint('');
                          setStep(3);
                        }}
                        aria-pressed={isSelected}
                      >
                        <span className="hp-role-av" aria-hidden="true">
                          {profile.avatar}
                        </span>
                        <div>
                          <div className="hp-role-name">{profile.name}</div>
                          <div className="hp-role-team">{profile.team}</div>
                        </div>
                        <span className="hp-role-check">●</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Client Stakeholder */}
            {step === 3 && (
              <div className="hp-panel">
                <button
                  type="button"
                  className="hp-back"
                  onClick={() => handleGoToStep(2)}
                >
                  ← Modifier le profil agence
                </button>
                <div className="hp-panel-label">
                  Étape 3 · Interlocuteur côté {selectedClient?.name}
                </div>
                <div className="hp-roles">
                  {CLIENT_INTERLOCUTEURS.map((interlocuteur) => {
                    const isSelected = selectedClientStakeholder?.id === interlocuteur.id;
                    return (
                      <button
                        key={interlocuteur.id}
                        type="button"
                        className={`hp-role ${isSelected ? 'selected' : ''}`}
                        style={{ '--hp-accent': interlocuteur.accent }}
                        onClick={() => {
                          setSelectedClientStakeholder(interlocuteur);
                          setErrorMessage('');
                          setMissingHint('');
                        }}
                        aria-pressed={isSelected}
                      >
                        <span className="hp-role-av" aria-hidden="true">
                          {interlocuteur.avatar}
                        </span>
                        <div>
                          <div className="hp-role-name">{interlocuteur.name}</div>
                          <div className="hp-role-team">{interlocuteur.team}</div>
                        </div>
                        <span className="hp-role-check">●</span>
                      </button>
                    );
                  })}
                </div>

                <div className="hp-panel-label" style={{ marginTop: 18 }}>
                  Se connecter en tant que
                </div>
                <div className="hp-side-toggle" role="radiogroup" aria-label="Côté d'identification">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={side === 'agence'}
                    className={`hp-side-btn ${side === 'agence' ? 'active' : ''}`}
                    onClick={() => setSide('agence')}
                  >
                    🏢 Agence — {selectedAgencyProfile?.name}
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={side === 'client'}
                    data-side="client"
                    className={`hp-side-btn ${side === 'client' ? 'active' : ''}`}
                    onClick={() => setSide('client')}
                  >
                    🟠 Client — {selectedClientStakeholder?.name || 'à choisir'}
                  </button>
                </div>
              </div>
            )}

            {/* Recap chips */}
            {(selectedClient || selectedAgencyProfile || selectedClientStakeholder) && (
              <div className="hp-recap" aria-label="Récapitulatif de votre session">
                {selectedClient && (
                  <span className="hp-recap-chip">
                    <ClientLogo client={selectedClient} size={16} radius={5} fontSize={5} />
                    {selectedClient.name}
                  </span>
                )}
                {selectedAgencyProfile && (
                  <span className="hp-recap-chip">🏢 {selectedAgencyProfile.name}</span>
                )}
                {selectedClientStakeholder && (
                  <span className="hp-recap-chip">🟠 {selectedClientStakeholder.name}</span>
                )}
                {step < 3 && !isComplete && (
                  <button
                    type="button"
                    className="btn-like hp-recap-chip"
                    style={{ cursor: 'pointer', color: '#FFC58A', background: 'transparent', border: 'none' }}
                    onClick={handleNextStep}
                  >
                    Étape suivante →
                  </button>
                )}
              </div>
            )}

            {/* Main CTA */}
            <button
              type="button"
              className={`hp-cta ${isComplete ? 'ready' : ''} ${missingHint && !isComplete ? 'missing' : ''}`}
              disabled={!isComplete}
              onClick={handleConnect}
            >
              Accéder à l'espace de travail <span aria-hidden="true">→</span>
            </button>

            {/* Hint below CTA */}
            <div className="hp-cta-hint" aria-live="polite">
              {isComplete
                ? `Prêt · session ${side === 'agence' ? 'Agence McCann' : selectedClient?.name} — ${side === 'agence' ? selectedAgencyProfile?.name : selectedClientStakeholder?.name}`
                : missingHint || 'Complétez les 3 étapes pour activer l’accès.'}
            </div>

            {/* Google Authentication */}
            <button
              type="button"
              className="hp-google"
              onClick={handleGoogleConnect}
              disabled={googleLoading}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {googleLoading ? 'Connexion en cours…' : 'Continuer avec Google (Firebase)'}
            </button>

            <div className="hp-note">
              Démo — aucun mot de passe requis. Vos sélections pré-remplissent votre espace.
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Rituels de pilotage */}
      <section className="hp-bottom">
        <div className="hp-bottom-label">Plateforme de pilotage digital</div>
        <div className="hp-rituals">
          <div className="hp-ritual r1">
            <h3>
              <span>⚡</span> Journalier
            </h3>
            <p>Suivi des tickets, validations, charge créative, urgences et publication.</p>
          </div>
          <div className="hp-ritual r2">
            <h3>
              <span>✦</span> Hebdomadaire
            </h3>
            <p>Cadence des contenus, waves, reporting d'avancement, sprint opérationnel.</p>
          </div>
          <div className="hp-ritual r3">
            <h3>
              <span>◈</span> Mensuel
            </h3>
            <p>Recommandations, performance, budget, influence et pilotage transverse.</p>
          </div>
        </div>
        <div className="hp-footer">
          © 2026 McCann Douala × Grands comptes — Bridge, Digital Operating System
        </div>
      </section>
    </div>
  );
}
