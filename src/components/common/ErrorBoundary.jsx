import React from 'react';

/**
 * Composant ErrorBoundary robuste pour intercepter toute exception runtime
 * et éviter le plantage d'un composant ou d'une page en écran blanc.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur interceptée par ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div
          style={{
            padding: '24px',
            background: '#FFF5F5',
            border: '1px solid #FEB2B2',
            borderRadius: '12px',
            margin: '16px 0',
            color: '#9B2C2C',
            fontFamily: 'inherit'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#C53030' }}>
              Une erreur inattendue est survenue dans cet affichage
            </h3>
          </div>
          <p style={{ fontSize: 13, color: '#4A5568', margin: '4px 0 16px 0' }}>
            {this.state.error?.message || 'Impossible de charger les données du profil.'}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                background: '#FF7900',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              🔄 Réessayer
            </button>
            {this.props.onClose && (
              <button
                type="button"
                onClick={this.props.onClose}
                style={{
                  background: '#EDF2F7',
                  color: '#4A5568',
                  border: '1px solid #CBD5E0',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
