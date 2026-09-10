import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  // Selected access profile: 'agence' (McCann Douala) or 'client' (Orange Cameroun)
  const [selectedRole, setSelectedRole] = useState('agence');
  
  // Quick persona selections
  const [selectedAgencyMember, setSelectedAgencyMember] = useState('victor');
  const [selectedClientMember, setSelectedClientMember] = useState('patrick');
  const [selectedClientPartner, setSelectedClientPartner] = useState('Orange Cameroun');

  // Manual credentials toggle
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [manualPoste, setManualPoste] = useState('');
  
  // Loading & error states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Agency profiles data
  const AGENCY_MEMBERS = [
    { id: 'victor', name: 'Victor F. AKOA', poste: 'Traffic Manager & Chef de Projet Lead', email: 'victor.akoa@mccann.cm' },
    { id: 'felix', name: 'Félix MBETBO', poste: 'Chef de Projet Digital', email: 'felix.mbetbo@mccann.cm' },
    { id: 'annette', name: 'Annette NGONDI', poste: 'Infographe & Créa', email: 'annette.ngondi@mccann.cm' },
    { id: 'georges', name: 'Georges BAKOUME', poste: 'Lead DA & Infographe Senior', email: 'georges.bakoume@mccann.cm' },
    { id: 'linda', name: 'Linda BILL', poste: 'CM Telco & Social Specialist', email: 'linda.bill@mccann.cm' },
    { id: 'steve', name: 'Steve BESSOUBE', poste: 'Digital Web Analyst', email: 'steve.bessoube@mccann.cm' },
    { id: 'jeanpaul', name: 'Jean Paul MBA', poste: 'Influencer Manager', email: 'jeanpaul.mba@mccann.cm' },
    { id: 'claire', name: 'Claire MOUKOKO', poste: 'Directrice Clientèle & Stratégie', email: 'claire.moukoko@mccann.cm' },
  ];

  // Client profiles data
  const CLIENT_MEMBERS = [
    { id: 'patrick', name: 'Patrick TUETE', poste: 'Communication Specialist', email: 'patrick.tuete@orange.cm' },
    { id: 'lauriane', name: 'Lauriane NGAMENI', poste: 'Chef de Projet Digital', email: 'lauriane.ngameni@orange.cm' },
    { id: 'boris', name: 'Boris TIENTCHEU', poste: 'Digital Media Lead', email: 'boris.tientcheu@orange.cm' },
  ];

  const CLIENT_PARTNERS = [
    'Orange Cameroun',
    'Orange Burkina Faso',
    'Boissons du Cameroun',
    'Chococam Tiger Brands',
  ];

  const handleConnect = (e) => {
    e?.preventDefault();
    setErrorMessage('');

    let userData;

    if (isManualMode) {
      if (!manualEmail) {
        setErrorMessage('Veuillez renseigner votre adresse e-mail professionnelle.');
        return;
      }
      const displayName = manualEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      userData = {
        role: selectedRole,
        user: displayName || 'Collaborateur',
        email: manualEmail,
        poste: manualPoste || (selectedRole === 'agence' ? 'Chef de Projet Digital' : 'Brand Manager'),
        client: selectedClientPartner,
      };
    } else {
      if (selectedRole === 'agence') {
        const member = AGENCY_MEMBERS.find(m => m.id === selectedAgencyMember) || AGENCY_MEMBERS[0];
        userData = {
          role: 'agence',
          user: member.name,
          email: member.email,
          poste: member.poste,
          client: selectedClientPartner,
        };
      } else {
        const member = CLIENT_MEMBERS.find(m => m.id === selectedClientMember) || CLIENT_MEMBERS[0];
        userData = {
          role: 'client',
          user: member.name,
          email: member.email,
          poste: member.poste,
          client: selectedClientPartner,
        };
      }
    }

    try {
      localStorage.setItem('bridge_active_client', selectedClientPartner);
    } catch (err) {
      console.warn(err);
    }

    login(userData);
    navigate('/');
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage('');
    try {
      const defaultPoste = selectedRole === 'agence' ? 'Chef de Projet Digital' : 'Brand Manager';
      await loginWithGoogle(selectedRole, defaultPoste);
      try {
        localStorage.setItem('bridge_active_client', selectedClientPartner);
      } catch (err) {
        console.warn(err);
      }
      navigate('/');
    } catch (err) {
      console.error('Google Sign-In:', err);
      setErrorMessage('Connexion Google interrompue. Vous pouvez continuer via le sélecteur d\'équipe.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Top navigation */}
      <header className="login-topnav">
        <div className="login-topnav-left">
          <div className="login-topnav-icon">B</div>
          <div>
            <div className="login-topnav-brand">BRIDGE</div>
            <div className="login-topnav-sub">McCann × {selectedClientPartner}</div>
          </div>
        </div>

        <div className="login-status-badge">
          <span className="login-status-dot"></span>
          <span>Système Opérationnel</span>
        </div>
      </header>

      {/* Hero section — two columns */}
      <main className="login-hero">
        
        {/* Left Column: Vision & Rituals */}
        <div className="login-hero-left">
          <div className="login-system-badge">
            <span className="login-system-badge-icon">⚡</span>
            <span>SYSTÈME D'EXPLOITATION OPÉRATIONNEL</span>
          </div>

          <h1 className="login-headline">
            La passerelle <span className="highlight">Agence — Annonceur</span> haute performance.
          </h1>

          <p className="login-description">
            Synchronisation des briefs, validation des calendriers, reporting en temps réel et pilotage des campagnes entre l'agence McCann Douala et {selectedClientPartner}.
          </p>

          <div className="login-rituals">
            <div className="login-ritual-pill">
              <span className="login-ritual-icon">⚡</span>
              <span>Daily · 09h00 (Priorités)</span>
            </div>
            <div className="login-ritual-pill">
              <span className="login-ritual-icon">✦</span>
              <span>Weekly · Lundi 10h (Calendriers)</span>
            </div>
            <div className="login-ritual-pill">
              <span className="login-ritual-icon">◈</span>
              <span>Monthly · J+3 (Reporting)</span>
            </div>
            <div className="login-ritual-pill">
              <span className="login-ritual-icon">🚨</span>
              <span>Flash P0 · En temps réel</span>
            </div>
          </div>
        </div>

        {/* Right Column: Connection Card */}
        <div className="login-hero-right">
          <div className="login-connexion-card">
            <h2 className="login-connexion-title">Connexion à votre espace</h2>
            <p className="login-connexion-subtitle">Sélectionnez votre profil d'accès</p>

            {/* Role 1: Agence McCann Douala */}
            <div 
              className={`login-role-card ${selectedRole === 'agence' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('agence')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('agence')}
            >
              <div className="login-role-icon">🏢</div>
              <div className="login-role-info">
                <div className="login-role-name">Agence McCann Douala</div>
                <div className="login-role-team">Équipe opérationnelle &amp; créative</div>
                <ul className="login-role-features">
                  <li>Briefs, calendriers &amp; déclinaisons</li>
                  <li>Pilotage des campagnes &amp; reporting</li>
                  <li>Gestion de l'influence &amp; communauté</li>
                </ul>
              </div>
            </div>

            {/* Role 2: Annonceur / Compte Client */}
            <div 
              className={`login-role-card ${selectedRole === 'client' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('client')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('client')}
            >
              <div className="login-role-icon">🟠</div>
              <div className="login-role-info">
                <div className="login-role-name">{selectedClientPartner}</div>
                <div className="login-role-team">Validation &amp; suivi annonceur</div>
                <ul className="login-role-features">
                  <li>Émission des briefs &amp; validations</li>
                  <li>Consultation des calendriers &amp; livrables</li>
                  <li>Reporting KPI &amp; suivi budgétaire</li>
                </ul>
              </div>
            </div>

            {/* Account / Partner selector */}
            <div className="login-form-group">
              <label className="login-form-label" htmlFor="client-partner-select">
                Compte annonceur partenaire
              </label>
              <select
                id="client-partner-select"
                className="login-form-select"
                value={selectedClientPartner}
                onChange={(e) => setSelectedClientPartner(e.target.value)}
              >
                {CLIENT_PARTNERS.map(partner => (
                  <option key={partner} value={partner}>{partner}</option>
                ))}
              </select>
            </div>

            {/* User Persona or Manual Credentials */}
            {!isManualMode ? (
              <div className="login-form-group">
                <label className="login-form-label" htmlFor="team-member-select">
                  {selectedRole === 'agence' ? 'Membre de l’équipe McCann' : 'Interlocuteur Annonceur'}
                </label>
                {selectedRole === 'agence' ? (
                  <select
                    id="team-member-select"
                    className="login-form-select"
                    value={selectedAgencyMember}
                    onChange={(e) => setSelectedAgencyMember(e.target.value)}
                  >
                    {AGENCY_MEMBERS.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} — {member.poste}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    id="team-member-select"
                    className="login-form-select"
                    value={selectedClientMember}
                    onChange={(e) => setSelectedClientMember(e.target.value)}
                  >
                    {CLIENT_MEMBERS.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} — {member.poste}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <form onSubmit={handleConnect} className="login-form-group">
                <div style={{ marginBottom: '10px' }}>
                  <label className="login-form-label">Adresse email professionnelle</label>
                  <input
                    type="email"
                    required
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder={selectedRole === 'agence' ? 'prenom.nom@mccann.cm' : 'contact@orange.cm'}
                    className="login-form-input"
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label className="login-form-label">Mot de passe</label>
                  <input
                    type="password"
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="login-form-input"
                  />
                </div>
                <div>
                  <label className="login-form-label">Fonction / Poste</label>
                  <input
                    type="text"
                    value={manualPoste}
                    onChange={(e) => setManualPoste(e.target.value)}
                    placeholder={selectedRole === 'agence' ? 'Chef de Projet Digital' : 'Brand Manager'}
                    className="login-form-input"
                  />
                </div>
              </form>
            )}

            {errorMessage && (
              <div className="login-error-badge">
                {errorMessage}
              </div>
            )}

            {/* Main Action Button */}
            <button
              type="button"
              className="login-connect-btn active"
              onClick={handleConnect}
            >
              Accéder à l'espace {selectedRole === 'agence' ? 'Agence' : selectedClientPartner} →
            </button>

            {/* Google Authentication Alternative */}
            <button
              type="button"
              className="login-google-btn"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{googleLoading ? 'Connexion en cours...' : 'Connexion rapide Google Workspace'}</span>
            </button>

            {/* Toggle manual / quick persona mode */}
            <div className="login-switch-mode">
              <button
                type="button"
                className="login-switch-mode-btn"
                onClick={() => setIsManualMode(!isManualMode)}
              >
                {isManualMode ? '← Revenir au sélecteur d’équipe rapide' : 'Se connecter avec identifiants personnalisés'}
              </button>
            </div>

            <p className="login-demo-note">
              Mode démo actif — Accès instantané et synchronisé aux tableaux de bord
            </p>
          </div>
        </div>

      </main>

      {/* Bottom section — ritual cards */}
      <footer className="login-bottom">
        <div className="login-bottom-label">RITUELS DE COLLABORATION McCANN × ORANGE</div>
        <div className="login-ritual-cards">
          <div className="login-ritual-card">
            <div className="login-ritual-card-title">Daily &amp; Priorités · 09h00</div>
            <div className="login-ritual-card-desc">
              Points opérationnels chaque matin pour arbitrer les urgences P0, calibrer la charge créative du studio et fluidifier les échanges quotidiens.
            </div>
          </div>
          <div className="login-ritual-card">
            <div className="login-ritual-card-title">Calendriers &amp; Validations · Lundi 10h</div>
            <div className="login-ritual-card-desc">
              Revue hebdomadaire des grilles éditoriales, validation des créas à J-3, déclinaisons multi-formats et calage des sponsorisations média.
            </div>
          </div>
          <div className="login-ritual-card">
            <div className="login-ritual-card-title">Reporting Consolidé &amp; ROI · J+3</div>
            <div className="login-ritual-card-desc">
              Comités mensuels de performance, bilans d'influence, analyse fine des conversions et recommandations stratégiques continues.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
