import { useState } from 'react';
import { Mail, MessageCircle, Copy, Check, ExternalLink, Share2, Sparkles, Send } from 'lucide-react';
import { formatNumber, formatCurrency } from '../../../../utils/helpers';

export default function CampaignHistoryShareModal({
  isOpen,
  onClose,
  influencer,
  campaign,
  allCampaigns = [],
}) {
  const [selectedChannel, setSelectedChannel] = useState('mail'); // 'mail' | 'whatsapp' | 'teams'
  const [copied, setCopied] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  if (!isOpen || !influencer) return null;

  const isSingle = !!campaign;
  const talentName = influencer.pseudo || influencer.name || 'Talent';
  const realName = influencer.realName || `${influencer.prenom || ''} ${influencer.nom || ''}`.trim();

  // Construction du contenu de partage
  const buildShareContent = () => {
    if (isSingle) {
      const campName = campaign.campaign || campaign.name || 'Campagne';
      const brand = campaign.brand || campaign.marque || 'Orange Cameroun';
      const status = campaign.status || 'Terminée';
      const reach = campaign.kpiReach || campaign.reach || 0;
      const reachTarget = campaign.kpiTarget || 0;
      const reachPct = reachTarget > 0 ? `${Math.round((reach / reachTarget) * 100)}%` : '100%';
      const impressions = campaign.impressions || Math.round(reach * 1.35);
      const engRate = campaign.kpiEngagement || campaign.engagementRate || 0;
      const clicks = campaign.clicks || campaign.clics || Math.round(reach * 0.04);
      const conversions = campaign.conversions || Math.round(clicks * 0.12);
      const score = campaign.notesInternes?.noteGlobale || campaign.contentQuality || 4.5;
      const comment = campaign.notesInternes?.commentaire || 'Campagne exécutée avec succès selon le cahier des charges.';
      const basePay = campaign.remuneration?.base || campaign.basePay || campaign.cachetBase || 0;
      const perks = campaign.remuneration?.avantages || campaign.avantages || 'Dotation Pulse & Goodies';
      const deliverables = campaign.livrables || [
        { titre: 'Story teaser', url: 'https://instagram.com/p/teaser' },
        { titre: 'Reel promo', url: 'https://instagram.com/reel/promo' },
      ];

      const subject = `[Orange Cameroun - Bilan Campagne] ${talentName} — ${campName}`;

      const plainText = `ORANGE CAMEROUN • RAPPORT D'INFLUENCE
Campagne : ${campName} (${brand})
Talent : ${talentName} (${realName})
Statut : ${status.toUpperCase()}

RÉSULTATS CHIFFRÉS :
• Portée (Reach) : ${formatNumber(reach)} (${reachPct} de l'objectif)
• Impressions totales : ${formatNumber(impressions)}
• Taux d'engagement : ${engRate}%
• Clics générés : ${formatNumber(clicks)}
• Conversions : ${conversions} activations
${campaign.salesVolume ? `• Chiffre d'affaires généré : ${formatCurrency(campaign.salesVolume)}\n` : ''}
ÉVALUATION QUALITATIVE :
• Note globale : ${score}/5 ⭐
• Avis de l'équipe : "${comment}"
• Points forts : ${campaign.notesInternes?.pointsForts || 'Qualité visuelle, réactivité'}
• Axes d'amélioration : ${campaign.notesInternes?.axesAmelioration || 'Anticipation des délais'}

LIVRABLES RÉALISÉS (${deliverables.length}) :
${deliverables.map(d => `• ${d.titre} : ${d.url || 'Validé en interne'}`).join('\n')}

CONDITIONS & RÉMUNÉRATION :
• Cachet perçu : ${basePay > 0 ? formatCurrency(basePay) : 'Forfait cadre contractuel'}
• Avantages perçus : ${perks}

Émis par : Direction de la Communication Orange Cameroun & Agence McCann Douala`;

      const markdown = `### 🟠 **Orange Cameroun — Bilan de Campagne Influence**
**Campagne :** ${campName}  
**Marque :** ${brand} | **Statut :** \`${status.toUpperCase()}\`  
**Talent :** **${talentName}** (${realName})  

---
#### 📊 **Résultats Chiffrés Clés**
| Indicateur | Valeur obtenue | Objectif / Ratio |
| :--- | :--- | :--- |
| **Portée (Reach)** | **${formatNumber(reach)}** | ${reachPct} de l'objectif |
| **Impressions** | ${formatNumber(impressions)} | Vues complètes |
| **Taux d'Engagement** | **${engRate}%** | Interactions fortes |
| **Clics sortants** | ${formatNumber(clicks)} clics | Stickers & Bio |
| **Conversions** | ${conversions} act. | ${campaign.salesVolume ? formatCurrency(campaign.salesVolume) : 'Validé'} |

---
#### 📝 **Évaluation Qualitative**
- **Note Globale :** **${score}/5 ⭐**
- **Avis McCann & Orange :** _« ${comment} »_
- **Points forts :** ${campaign.notesInternes?.pointsForts || 'Professionnalisme et esthétique visuelle'}
- **Axes d'amélioration :** ${campaign.notesInternes?.axesAmelioration || 'Respect strict du retroplanning'}

---
#### 🎬 **Livrables Clés**
${deliverables.map(d => `- **${d.titre}** : [Lien direct](${d.url || '#'})`).join('\n')}

_Direction de la Communication Orange Cameroun & McCann Douala_`;

      return { subject, plainText, markdown };
    } else {
      // Global Talent History
      const totalReach = allCampaigns.reduce((s, c) => s + (c.kpiReach || c.reach || 0), 0);
      const avgEng = allCampaigns.length > 0
        ? (allCampaigns.reduce((s, c) => s + (c.kpiEngagement || c.engagementRate || 0), 0) / allCampaigns.length).toFixed(1)
        : 0;
      const totalPaid = allCampaigns.reduce((s, c) => s + (c.remuneration?.base || c.basePay || 0), 0);

      const subject = `[Orange Cameroun] Historique complet des campagnes — ${talentName}`;

      const plainText = `ORANGE CAMEROUN • SYNTHÈSE HISTORIQUE DU TALENT
Influenceur : ${talentName} (${realName})
Catégories : ${(influencer.categories || [influencer.niche]).filter(Boolean).join(', ')}
Plateformes : ${influencer.platform || 'Multi-plateformes'}
Score Global : ${influencer.scorePerformance || influencer.score || 4.5}/5 ⭐

SYNTHÈSE GLOBALE :
• Total campagnes : ${allCampaigns.length}
• Portée cumulée : ${formatNumber(totalReach)}
• Taux d'engagement moyen : ${avgEng}%
• Rémunération globale : ${totalPaid > 0 ? formatCurrency(totalPaid) : 'Sous contrat cadre'}

CAMPAGNES RÉPERTORIÉES :
${allCampaigns.map((c, i) => `${i + 1}. ${c.campaign || c.name} (${c.brand || 'Orange'}) : ${formatNumber(c.kpiReach || 0)} reach - Tx: ${c.kpiEngagement || c.engagementRate || 0}% - Statut: ${(c.status || 'Terminée').toUpperCase()}`).join('\n')}

Émis par : Direction de la Communication Orange Cameroun & Agence McCann Douala`;

      const markdown = `### 🟠 **Orange Cameroun — Historique Collaborations Influenceur**
**Talent :** **${talentName}** (${realName})  
**Catégorie :** ${(influencer.categories || [influencer.niche]).filter(Boolean).join(', ')}  
**Score global :** **${influencer.scorePerformance || influencer.score || 4.5} / 5 ⭐**  

---
#### 📈 **Bilan Chiffré Consolidé**
- **Campagnes exécutées :** **${allCampaigns.length}**
- **Portée cumulée totale :** **${formatNumber(totalReach)} personnes**
- **Taux d'engagement moyen :** **${avgEng}%**
- **Investissement honoraires :** ${totalPaid > 0 ? formatCurrency(totalPaid) : 'Tarification cadre'}

---
#### 📜 **Liste des Campagnes Passées**
${allCampaigns.map((c, i) => `${i + 1}. **${c.campaign || c.name}** (${c.brand || 'Orange Cameroun'}) — Statut : \`${(c.status || 'Terminée').toUpperCase()}\` | Reach : **${formatNumber(c.kpiReach || 0)}** | Engagement : **${c.kpiEngagement || c.engagementRate || 0}%**`).join('\n')}

_Direction de la Communication Orange Cameroun & McCann Douala_`;

      return { subject, plainText, markdown };
    }
  };

  const { subject, plainText, markdown } = buildShareContent();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendMail = () => {
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleSendWhatsApp = () => {
    const waText = `*${subject}*\n\n${plainText}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  const handleOpenTeams = () => {
    handleCopy(markdown);
    window.open('https://teams.microsoft.com', '_blank');
  };

  return (
    <div className="inf-modal-overlay" onClick={onClose}>
      <div className="inf-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <button className="inf-modal-close" onClick={onClose}>✕</button>

        <div className="flex items-center gap-10 mb-12">
          <div style={{ background: '#FFF3E0', color: '#FF7900', padding: 8, borderRadius: 8, display: 'flex' }}>
            <Share2 size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark">
              Partager l'historique — {isSingle ? campaign.campaign : `@${talentName}`}
            </h3>
            <p className="text-xs text-muted">
              Diffusion directe et professionnelle vers les parties prenantes Orange Cameroun & McCann
            </p>
          </div>
        </div>

        {/* Sélection du canal de partage */}
        <div className="flex gap-8 mb-16" style={{ background: '#F8F9FA', padding: 4, borderRadius: 8 }}>
          <button
            className={`btn btn-sm ${selectedChannel === 'mail' ? 'btn-orange' : 'btn-ghost'}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => setSelectedChannel('mail')}
          >
            <Mail size={16} /> Email
          </button>
          <button
            className={`btn btn-sm ${selectedChannel === 'whatsapp' ? 'btn-orange' : 'btn-ghost'}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: selectedChannel === 'whatsapp' ? '#25D366' : 'transparent', color: selectedChannel === 'whatsapp' ? '#fff' : 'inherit' }}
            onClick={() => setSelectedChannel('whatsapp')}
          >
            <MessageCircle size={16} /> WhatsApp
          </button>
          <button
            className={`btn btn-sm ${selectedChannel === 'teams' ? 'btn-orange' : 'btn-ghost'}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: selectedChannel === 'teams' ? '#464EB8' : 'transparent', color: selectedChannel === 'teams' ? '#fff' : 'inherit' }}
            onClick={() => setSelectedChannel('teams')}
          >
            <Sparkles size={16} /> MS Teams
          </button>
        </div>

        {/* Option Email */}
        {selectedChannel === 'mail' && (
          <div className="space-y-12 mb-16">
            <div>
              <label className="form-label">Destinataire (optionnel)</label>
              <input
                type="email"
                className="form-input"
                placeholder="ex: direction.marque@orange.cm, alain.eboa@mccann.cm"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Objet du mail</label>
              <input type="text" className="form-input" readOnly value={subject} />
            </div>
            <div>
              <label className="form-label">Corps du message (synthèse exécutive)</label>
              <textarea
                className="form-input"
                rows={8}
                readOnly
                value={plainText}
                style={{ fontSize: 12, fontFamily: 'monospace', background: '#FAFAFA' }}
              />
            </div>
            <div className="flex gap-8">
              <button
                className="btn btn-orange"
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={handleSendMail}
              >
                <Send size={16} /> Ouvrir dans mon client Email
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={() => handleCopy(plainText)}
              >
                {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>
        )}

        {/* Option WhatsApp */}
        {selectedChannel === 'whatsapp' && (
          <div className="space-y-12 mb-16">
            <div className="p-12 rounded" style={{ background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.25)' }}>
              <p className="text-xs text-dark">
                🟢 <strong>Diffusion instantanée WhatsApp :</strong> Le message est pré-formaté avec emojis, gras et puces pour une lecture immédiate sur smartphone.
              </p>
            </div>
            <div>
              <label className="form-label">Aperçu du message WhatsApp</label>
              <textarea
                className="form-input"
                rows={9}
                readOnly
                value={plainText}
                style={{ fontSize: 12, fontFamily: 'monospace', background: '#FAFAFA' }}
              />
            </div>
            <div className="flex gap-8">
              <button
                className="btn"
                style={{ flex: 2, background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={handleSendWhatsApp}
              >
                <MessageCircle size={16} /> Envoyer via WhatsApp
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={() => handleCopy(plainText)}
              >
                {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>
        )}

        {/* Option Microsoft Teams */}
        {selectedChannel === 'teams' && (
          <div className="space-y-12 mb-16">
            <div className="p-12 rounded" style={{ background: 'rgba(70, 78, 184, 0.08)', border: '1px solid rgba(70, 78, 184, 0.25)' }}>
              <p className="text-xs text-dark">
                🟣 <strong>Format Markdown Microsoft Teams :</strong> Copiez le bloc Markdown ci-dessous pour le coller directement dans le canal de discussion Teams Orange / McCann.
              </p>
            </div>
            <div>
              <label className="form-label">Contenu Markdown optimisé Teams</label>
              <textarea
                className="form-input"
                rows={9}
                readOnly
                value={markdown}
                style={{ fontSize: 12, fontFamily: 'monospace', background: '#FAFAFA' }}
              />
            </div>
            <div className="flex gap-8">
              <button
                className="btn"
                style={{ flex: 2, background: '#464EB8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={handleOpenTeams}
              >
                <Copy size={16} /> Copier & Ouvrir Teams Web
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={() => handleCopy(markdown)}
              >
                {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                {copied ? 'Copié !' : 'Copier le Markdown'}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-12 border-t">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
