import { formatCurrency } from '../../../utils/helpers';
import { BRIEF_STATUSES } from '../../../data/briefs';

export default function BriefPdfExportModal({ isOpen, onClose, brief }) {
  if (!isOpen || !brief) return null;

  const statusMeta = BRIEF_STATUSES[brief.status] || BRIEF_STATUSES.submitted;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-pdf-preview"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 900, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        {/* Actions Bar */}
        <div className="pdf-preview-toolbar no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📄</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Aperçu d'Export PDF — Brief de Projet</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Document Officiel McCann Douala × Orange Cameroun</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-orange" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🖨️</span> Imprimer / Enregistrer en PDF
            </button>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Printable PDF Canvas */}
        <div className="pdf-sheet-container" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#fff' }}>
          <div className="pdf-document" id="printable-brief">
            {/* Header with Logos & Watermark */}
            <div className="pdf-header">
              <div className="pdf-header-left">
                <div className="pdf-brand-bridge">BRIDGE</div>
                <div className="pdf-brand-sub">McCann Douala × Orange Cameroun</div>
                <div className="pdf-doc-type">CAHIER DES CHARGES / BRIEF DE PROJET</div>
              </div>
              <div className="pdf-header-right">
                <div className="pdf-badge-restricted">ORANGE RESTRICTED</div>
                <div className="pdf-ref">Réf: <strong>{brief.id}</strong></div>
                <div className="pdf-date">Généré le : {new Date().toLocaleDateString('fr-FR')}</div>
              </div>
            </div>

            {/* Status & Project Title Box */}
            <div className="pdf-hero-box">
              <div className="pdf-hero-meta">
                <span className="pdf-typology-tag">{brief.typology}</span>
                <span className="pdf-status-tag" style={{ background: statusMeta.bg, color: statusMeta.color, borderColor: statusMeta.color }}>
                  {statusMeta.icon} Statut : {statusMeta.label}
                </span>
                <span className="pdf-progress-tag">Avancement global : {brief.progress}%</span>
              </div>
              <h1 className="pdf-title">{brief.title}</h1>
              <div className="pdf-dates-row">
                <div>📅 Date de soumission : <strong>{brief.submissionDate || 'N/A'}</strong></div>
                <div>🚀 Date Go-Live souhaitée : <strong>{brief.goLiveDate || 'N/A'}</strong></div>
                <div>💰 Budget alloué : <strong>{brief.budget ? formatCurrency(brief.budget) : 'Non communiqué'}</strong></div>
              </div>
            </div>

            {/* SECTION A : INFORMATIONS GÉNÉRALES & PORTEURS DU PROJET */}
            <div className="pdf-section">
              <div className="pdf-section-title">
                <span>SECTION A</span>
                <h2>Informations Générales & Porteurs du Projet</h2>
              </div>
              <table className="pdf-table">
                <tbody>
                  <tr>
                    <td className="pdf-table-label" style={{ width: '30%' }}>Nom du Projet</td>
                    <td className="pdf-table-value"><strong>{brief.title}</strong></td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Typologie Digitale</td>
                    <td className="pdf-table-value">{brief.typology}</td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Équipe Sponsors (Orange)</td>
                    <td className="pdf-table-value">
                      {(brief.sponsors || []).map((s, i) => (
                        <div key={i} style={{ marginBottom: 4 }}>
                          • <strong>{s.name}</strong> — {s.role} ({s.phone || s.email})
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Contacts & Urgences</td>
                    <td className="pdf-table-value">{brief.contacts || '699 94 54 97 / 699 94 86 61'}</td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Lead Agence McCann</td>
                    <td className="pdf-table-value">{brief.agencyLead || 'Victor F. AKOA (CDP) & Serge NDJOCK (Lead Tech)'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION B : CONTEXTE STRATÉGIQUE (LE "POURQUOI") */}
            <div className="pdf-section">
              <div className="pdf-section-title">
                <span>SECTION B</span>
                <h2>Contexte Stratégique (Le "Pourquoi")</h2>
              </div>
              <table className="pdf-table">
                <tbody>
                  <tr>
                    <td className="pdf-table-label" style={{ width: '30%' }}>Background / Enjeux Marché</td>
                    <td className="pdf-table-value">{brief.marketBackground || 'Non renseigné'}</td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Contexte du Projet</td>
                    <td className="pdf-table-value">{brief.projectContext || 'Non renseigné'}</td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Cibles (Personas)</td>
                    <td className="pdf-table-value">
                      {(brief.targetPersonas || []).join(', ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Niveau de Notoriété Actuel</td>
                    <td className="pdf-table-value">{brief.currentBrandAwareness || 'Non renseigné'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION C : MÉCANIQUE & SPÉCIFICATIONS WEB (LE "COMMENT") */}
            <div className="pdf-section">
              <div className="pdf-section-title">
                <span>SECTION C</span>
                <h2>Mécanique & Spécifications Web (Le "Comment")</h2>
              </div>
              <table className="pdf-table">
                <tbody>
                  <tr>
                    <td className="pdf-table-label" style={{ width: '30%' }}>Tâche à accomplir (User Journey)</td>
                    <td className="pdf-table-value">{brief.userJourney || 'Non renseigné'}</td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Étapes de la Mécanique</td>
                    <td className="pdf-table-value">
                      <ol style={{ paddingLeft: 16, margin: 0 }}>
                        {(brief.mechanicsSteps || []).map((step, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>{step}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Fonctionnalités Spécifiques</td>
                    <td className="pdf-table-value">
                      {(brief.specificFeatures || []).map((f, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span>{f.checked ? '☑' : '☐'}</span>
                          <span>{f.label}</span>
                          {f.status && <span style={{ fontSize: 10, color: 'var(--muted)' }}>({f.status})</span>}
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Écosystème Digital</td>
                    <td className="pdf-table-value">
                      {(brief.ecosystem || []).join(' • ')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION D : OBJECTIFS & KPIS (LE "SUCCÈS") */}
            <div className="pdf-section">
              <div className="pdf-section-title">
                <span>SECTION D</span>
                <h2>Objectifs & KPIs (Le "Succès")</h2>
              </div>
              <table className="pdf-table">
                <tbody>
                  <tr>
                    <td className="pdf-table-label" style={{ width: '30%' }}>Objectifs Stratégiques</td>
                    <td className="pdf-table-value">
                      {(brief.objectives || []).map((obj, i) => (
                        <div key={i}>• {obj}</div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">KPIs de Succès</td>
                    <td className="pdf-table-value">{brief.kpis || 'Non renseigné'}</td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Ton & Positionnement</td>
                    <td className="pdf-table-value">{brief.toneAndVoice || 'Non renseigné'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION E : CONTRAINTES, LIVRABLES & BUDGET */}
            <div className="pdf-section">
              <div className="pdf-section-title">
                <span>SECTION E</span>
                <h2>Contraintes, Livrables & Budget</h2>
              </div>
              <table className="pdf-table">
                <tbody>
                  <tr>
                    <td className="pdf-table-label" style={{ width: '30%' }}>Mandatories (Contraintes)</td>
                    <td className="pdf-table-value">
                      {(brief.mandatories || []).map((m, idx) => (
                        <div key={idx} style={{ marginBottom: 4 }}>
                          ☑ <strong>{m.label}</strong>
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Livrables Attendus Agence</td>
                    <td className="pdf-table-value">
                      {(brief.deliverables || []).map((d, idx) => (
                        <div key={idx} style={{ marginBottom: 4 }}>
                          • {d.label} {d.done ? ' (Livré ✓)' : `(Avancement : ${d.progress || 0}%)`}
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Enveloppe Budgétaire</td>
                    <td className="pdf-table-value">
                      <strong>{brief.budget ? formatCurrency(brief.budget) : 'Non communiqué'}</strong>
                      {brief.budgetConfidential && <span style={{ color: 'var(--red)', fontSize: 11, marginLeft: 8 }}>[CONFIDENTIEL]</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Fréquence / Timeline</td>
                    <td className="pdf-table-value">{brief.timelineFrequency || 'Go-Live le ' + (brief.goLiveDate || 'N/A')}</td>
                  </tr>
                  <tr>
                    <td className="pdf-table-label">Liens de Suivi Direct</td>
                    <td className="pdf-table-value">
                      {brief.figmaUrl && <div>🎨 Figma : {brief.figmaUrl}</div>}
                      {brief.jiraUrl && <div>🎫 Jira : {brief.jiraUrl}</div>}
                      {brief.stagingUrl && <div>🧪 Staging : {brief.stagingUrl}</div>}
                      {brief.liveUrl && <div>🚀 Production : {brief.liveUrl}</div>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Validation & Signatures Block */}
            <div className="pdf-signatures-box">
              <div className="pdf-sign-col">
                <div className="pdf-sign-title">POUR ORANGE CAMEROUN</div>
                <div className="pdf-sign-name">Lauriane NGAMENI / Patrick TUETE</div>
                <div className="pdf-sign-role">Direction Digitale & Communication</div>
                <div className="pdf-sign-space">
                  <div className="pdf-stamp-approved">BON POUR ACCORD</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>Signature & Cachet</div>
                </div>
              </div>

              <div className="pdf-sign-col">
                <div className="pdf-sign-title">POUR MCCANN DOUALA</div>
                <div className="pdf-sign-name">Victor F. AKOA / Serge NDJOCK</div>
                <div className="pdf-sign-role">Direction des Projets & Direction Technique</div>
                <div className="pdf-sign-space">
                  <div className="pdf-stamp-agency">MCCANN BRIDGE REVIEWED</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>Visa Technique & Planning</div>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="pdf-footer">
              <div>MCCANN DOUALA — Agence Conseil en Communication 360° | ORANGE CAMEROUN</div>
              <div>Document généré automatiquement via la plateforme BRIDGE — Confidentiel Orange Restricted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
