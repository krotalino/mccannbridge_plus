import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AGENCY_PROFILES = [
  { id: 'victor', name: 'Victor F. AKOA', poste: 'Traffic Manager & Chef de Projet Lead', email: 'victor.akoa@mccann.cm' },
  { id: 'alain-eboa', name: 'Alain Patrick EBOA', poste: 'Directeur Artistique Senior', email: 'a.eboa@mccann.cm' },
  { id: 'claire', name: 'Claire MOUKOKO', poste: 'Directrice Clientèle & Stratégie', email: 'claire.moukoko@mccann.cm' },
  { id: 'patrice', name: 'Patrice EBANG', poste: 'Directeur de Création', email: 'patrice.ebang@mccann.cm' },
  { id: 'georges', name: 'Georges BAKOUME', poste: 'Lead DA & Infographe Senior', email: 'georges.bakoume@mccann.cm' },
  { id: 'annette', name: 'Annette NGONDI', poste: 'Infographe', email: 'annette.ngondi@mccann.cm' },
  { id: 'adrien', name: 'Adrien KAME', poste: 'Motion Designer (PT)', email: 'adrien.kame@mccann.cm' },
  { id: 'linda', name: 'Linda BILL', poste: 'CM Telco & Social Specialist', email: 'linda.bill@mccann.cm' },
  { id: 'jessica', name: 'Jessica OKALA', poste: 'CM Business & B2B Lead', email: 'jessica.okala@mccann.cm' },
  { id: 'william', name: 'William MBEDE', poste: 'CM Money & Fintech', email: 'william.mbede@mccann.cm' },
  { id: 'jeanpaul', name: 'Jean Paul MBA', poste: 'Influencer Manager', email: 'jeanpaul.mba@mccann.cm' },
  { id: 'steve', name: 'Steve BESSOUBE', poste: 'Digital Web Analyst', email: 'steve.bessoube@mccann.cm' },
  { id: 'alain-t', name: 'Alain TCHAPTCHET', poste: 'Growth Hacker', email: 'alain.tchaptchet@mccann.cm' },
  { id: 'mireille', name: 'Mireille NGO', poste: 'Contrôleur de Gestion & Finance', email: 'mireille.ngo@mccann.cm' },
  { id: 'bella', name: 'Jean-Marc BELLA', poste: 'DAF & Super Admin BRIDGE', email: 'jm.bella@mccann.cm' },
];

const CLIENT_PROFILES = [
  { id: 'lauriane', name: 'Lauriane NGAMENI', poste: 'Chef de Projet Digital & Validateur', email: 'lauriane.ngameni@orange.cm' },
  { id: 'patrick', name: 'Patrick TUETE', poste: 'Communication Specialist & Marque', email: 'patrick.tuete@orange.cm' },
  { id: 'boris', name: 'Boris TIENTCHEU', poste: 'Digital Media Lead', email: 'boris.tientcheu@orange.cm' },
  { id: 'sandrine', name: 'Sandrine NGO BIKOI', poste: 'Brand Manager 4G/5G', email: 's.ngobikoi@orange.cm' },
  { id: 'estelle', name: 'Estelle FOTSO', poste: 'Resp. Orange Money & Fintech', email: 'e.fotso@orange.cm' },
  { id: 'carine', name: 'Carine ESSOMBA', poste: 'Contrôleur de Gestion Média', email: 'c.essomba@orange.cm' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [selectedRole, setSelectedRole] = useState('agence');
  const [selectedUserId, setSelectedUserId] = useState(AGENCY_PROFILES[0].id);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPoste, setCustomPoste] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'agence') {
      setSelectedUserId(AGENCY_PROFILES[0].id);
    } else {
      setSelectedUserId(CLIENT_PROFILES[0].id);
    }
  };

  const handleConnect = () => {
    setErrorMessage('');
    let userData;

    if (customMode) {
      if (!customName.trim()) {
        setErrorMessage('Veuillez entrer un nom.');
        return;
      }
      userData = {
        user: customName.trim(),
        poste: customPoste.trim() || (selectedRole === 'client' ? 'Brand Manager' : 'Chef de Projet Digital'),
        role: selectedRole,
        email: selectedRole === 'client' ? 'client@orange.cm' : 'collaborateur@mccann.cm',
      };
    } else {
      const list = selectedRole === 'agence' ? AGENCY_PROFILES : CLIENT_PROFILES;
      const persona = list.find((p) => p.id === selectedUserId) || list[0];
      userData = {
        user: persona.name,
        poste: persona.poste,
        role: selectedRole,
        email: persona.email,
      };
    }

    login(userData);
    navigate('/');
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage('');
    try {
      const defaultPoste = selectedRole === 'client' ? 'Brand Manager' : 'Chef de Projet Digital';
      await loginWithGoogle(selectedRole, defaultPoste);
      navigate('/');
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setErrorMessage('La connexion Google n’a pas abouti. Vous pouvez utiliser la sélection de profil rapide.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const currentUsersList = selectedRole === 'agence' ? AGENCY_PROFILES : CLIENT_PROFILES;

  return (
    <div className="login-page">
      {/* Top navigation */}
      <header className="login-topnav">
        <div className="login-topnav-left">
          <div className="login-topnav-icon">B</div>
          <div>
            <div className="login-topnav-brand">BRIDGE</div>
            <div className="login-topnav-sub">McCann × Orange Cameroun</div>
          </div>
        </div>

        <div className="login-status-badge">
          <span className="login-status-dot"></span>
          <span>Système Opérationnel</span>
        </div>
      </header>

      {/* Hero section — two columns */}
      <main className="login-hero">
        <div className="login-hero-left">
          <div className="login-system-badge">
            <span className="login-system-badge-icon">⚡</span>
            <span>Plateforme B2B de collaboration</span>
          </div>

          <h1 className="login-headline">
            La passerelle <span className="highlight">Agence ⇄ Annonceur</span> haute performance.
          </h1>

          <p className="login-description">
            Hub centralisé unifiant l'Agence McCann Douala et la Direction Marketing &amp; Communication d'Orange Cameroun 
            pour la gestion fluide des briefs, validations, calendriers éditoriaux et campagnes d'influence.
          </p>

          <div className="login-rituals">
            <div className="login-ritual-pill">
              <span className="login-ritual-icon">📅</span>
              <span>Daily &amp; Priorités</span>
            </div>
            <div className="login-ritual-pill">
              <span className="login-ritual-icon">✅</span>
              <span>Validation à J-3</span>
            </div>
            <div className="login-ritual-pill">
              <span className="login-ritual-icon">📊</span>
              <span>Reporting &amp; Comité Mensuel</span>
            </div>
            <div className="login-ritual-pill">
              <span className="login-ritual-icon">🎯</span>
              <span>Influence &amp; Contenus</span>
            </div>
          </div>
        </div>

        <div className="login-hero-right">
          <div className="login-connexion-card">
            <h2 className="login-connexion-title">Connexion</h2>
            <p className="login-connexion-subtitle">
              Sélectionnez votre profil pour accéder à l'espace
            </p>

            {/* Role cards */}
            <div
              id="login-role-agence"
              className={`login-role-card ${selectedRole === 'agence' ? 'selected' : ''}`}
              onClick={() => handleRoleChange('agence')}
            >
              <div className="login-role-icon">🏢</div>
              <div className="login-role-info">
                <div className="login-role-name">Agence McCann Douala</div>
                <div className="login-role-team">Studio Créa, Traffic, Médias &amp; Influence</div>
                <ul className="login-role-features">
                  <li>Gestion des briefs &amp; production créative</li>
                  <li>Planification &amp; calendrier éditorial</li>
                  <li>Pilotage des campagnes d'influence</li>
                  <li>Suivi du trafic et reporting</li>
                </ul>
              </div>
            </div>

            <div
              id="login-role-client"
              className={`login-role-card ${selectedRole === 'client' ? 'selected' : ''}`}
              onClick={() => handleRoleChange('client')}
            >
              <div className="login-role-icon">📱</div>
              <div className="login-role-info">
                <div className="login-role-name">Orange Cameroun</div>
                <div className="login-role-team">Direction Marketing, Com &amp; Orange Money</div>
                <ul className="login-role-features">
                  <li>Émission et cadrage des briefs</li>
                  <li>Validation des livrables &amp; BAT</li>
                  <li>Suivi des KPIs &amp; visibilité budgétaire</li>
                  <li>Validation des profils influenceurs</li>
                </ul>
              </div>
            </div>

            {/* Persona selector or custom input */}
            {!customMode ? (
              <div className="login-form-group">
                <label htmlFor="login-user-select" className="login-form-label">Collaborateur connecté</label>
                <select
                  id="login-user-select"
                  className="login-form-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {currentUsersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.poste}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="login-form-group">
                  <label htmlFor="login-custom-name" className="login-form-label">Nom complet</label>
                  <input
                    id="login-custom-name"
                    type="text"
                    className="login-form-input"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                <div className="login-form-group">
                  <label htmlFor="login-custom-poste" className="login-form-label">Poste / Fonction</label>
                  <input
                    id="login-custom-poste"
                    type="text"
                    className="login-form-input"
                    value={customPoste}
                    onChange={(e) => setCustomPoste(e.target.value)}
                    placeholder={selectedRole === 'client' ? 'Ex: Brand Manager' : 'Ex: Chef de Projet Digital'}
                  />
                </div>
              </div>
            )}

            {/* Switch mode */}
            <div className="login-switch-mode">
              <button
                type="button"
                className="login-switch-mode-btn"
                onClick={() => setCustomMode(!customMode)}
              >
                {customMode ? '← Revenir à la sélection rapide' : 'Saisir un autre nom ou fonction'}
              </button>
            </div>

            {/* Error badge */}
            {errorMessage && (
              <div className="login-error-badge">{errorMessage}</div>
            )}

            {/* Connect button */}
            <button
              id="login-connect-submit"
              type="button"
              className="login-connect-btn active"
              onClick={handleConnect}
            >
              {selectedRole === 'agence' ? "Accéder à l'espace Agence" : "Accéder à l'espace Orange Cameroun"}
            </button>

            {/* Divider */}
            <div className="login-divider">OU</div>

            {/* Google Workspace login button */}
            <button
              id="login-google-workspace"
              type="button"
              className="login-google-btn"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{googleLoading ? 'Connexion en cours...' : 'Se connecter avec Google Workspace'}</span>
            </button>

            <div className="login-demo-note">
              Accès direct sans mot de passe en environnement de démonstration
            </div>
          </div>
        </div>
      </main>

      {/* Bottom section — ritual cards */}
      <footer className="login-bottom">
        <div className="login-bottom-label">Rituels de collaboration opérationnelle</div>
        <div className="login-ritual-cards">
          <div className="login-ritual-card">
            <h3 className="login-ritual-card-title">Daily &amp; Priorités · 09h00</h3>
            <p className="login-ritual-card-desc">
              Revue quotidienne de la charge de production, arbitrage des urgences P0 et levée immédiate des points de blocage.
            </p>
          </div>

          <div className="login-ritual-card">
            <h3 className="login-ritual-card-title">Calendriers &amp; Validations · Lundi 10h</h3>
            <p className="login-ritual-card-desc">
              Validation des grilles éditoriales à J-3, validation BAT légal, sponsoring média et vérification des déclinaisons multi-formats.
            </p>
          </div>

          <div className="login-ritual-card">
            <h3 className="login-ritual-card-title">Comité ROI &amp; Bilan · J+3 Mensuel</h3>
            <p className="login-ritual-card-desc">
              Analyse consolidée des KPIs, reach réel des créateurs de contenu, respect des budgets et recommandations stratégiques continues.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
