import { useState } from 'react';
import GrowthDashboard from './sections/GrowthDashboard';
import GrowthIdeas from './sections/GrowthIdeas';
import GrowthExperiments from './sections/GrowthExperiments';
import GrowthFunnel from './sections/GrowthFunnel';
import GrowthAlerts from './sections/GrowthAlerts';
import GrowthRecommendations from './sections/GrowthRecommendations';
import GrowthWorkflows from './sections/GrowthWorkflows';
import GrowthKnowledge from './sections/GrowthKnowledge';
import GrowthConnectors from './sections/GrowthConnectors';
import GrowthAudit from './sections/GrowthAudit';

const SECTIONS = [
  { id: 'cockpit', label: 'Cockpit Growth', icon: '🚀' },
  { id: 'ideas', label: 'Backlog d\'idées', icon: '💡' },
  { id: 'experiments', label: 'Expériences A/B', icon: '🧪' },
  { id: 'funnel', label: 'Funnel & Cohortes', icon: '🔄' },
  { id: 'alerts', label: 'Alertes & Anomalies', icon: '🔔' },
  { id: 'recommendations', label: 'Recommandations IA', icon: '🤖' },
  { id: 'workflows', label: 'Automatisation', icon: '⚙️' },
  { id: 'knowledge', label: 'Base de savoirs', icon: '📚' },
  { id: 'connectors', label: 'Connecteurs', icon: '🔗' },
  { id: 'audit', label: 'Audit & Gouvernance', icon: '🛡️' },
];

export default function GrowthPage() {
  const [activeSection, setActiveSection] = useState('cockpit');

  const renderSection = () => {
    switch (activeSection) {
      case 'cockpit': return <GrowthDashboard onNavigate={setActiveSection} />;
      case 'ideas': return <GrowthIdeas />;
      case 'experiments': return <GrowthExperiments />;
      case 'funnel': return <GrowthFunnel />;
      case 'alerts': return <GrowthAlerts />;
      case 'recommendations': return <GrowthRecommendations />;
      case 'workflows': return <GrowthWorkflows />;
      case 'knowledge': return <GrowthKnowledge />;
      case 'connectors': return <GrowthConnectors />;
      case 'audit': return <GrowthAudit />;
      default: return <GrowthDashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="gh-layout">
      <aside className="gh-sidebar">
        <div className="gh-sidebar-header">
          <div className="gh-sidebar-brand">🚀 GROWTH</div>
          <div className="gh-sidebar-sub">MODULE HACKING</div>
        </div>
        <nav className="gh-sidebar-nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`gh-sidebar-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="gh-sidebar-icon">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
        <div className="gh-sidebar-footer">
          <div className="gh-env-badge">
            <span className="gh-env-dot"></span>
            Production
          </div>
        </div>
      </aside>
      <div className="gh-main">
        <header className="gh-header">
          <h1 className="gh-title">
            {SECTIONS.find(s => s.id === activeSection)?.icon}{' '}
            {SECTIONS.find(s => s.id === activeSection)?.label}
          </h1>
          <div className="gh-header-right">
            <span className="gh-freshness">🟢 Données à jour — 10:15</span>
          </div>
        </header>
        <div className="gh-content">{renderSection()}</div>
      </div>
    </div>
  );
}
