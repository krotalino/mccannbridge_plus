import { useState } from 'react';
import {
  Calendar,
  Eye,
  Heart,
  TrendingUp,
  Award,
  ExternalLink,
  Edit3,
  Trash2,
  FileDown,
  Share2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  ShieldCheck,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';
import { formatNumber, formatCurrency } from '../../../../utils/helpers';

export default function CampaignHistoryCard({
  campaign,
  index,
  onEdit,
  onDelete,
  onExportPdf,
  onShare,
}) {
  const [expanded, setExpanded] = useState(true);

  const campName = campaign.campaign || campaign.name || `Campagne #${index + 1}`;
  const brand = campaign.brand || campaign.marque || 'Orange Cameroun';
  const dates = campaign.dates || (campaign.dateDebut && campaign.dateFin ? `${campaign.dateDebut} au ${campaign.dateFin}` : 'Période passée');
  const networks = Array.isArray(campaign.networks) ? campaign.networks : (campaign.reseaux ? [campaign.reseaux] : ['Instagram', 'TikTok']);
  const contentTypes = Array.isArray(campaign.contentTypes) ? campaign.contentTypes : ['Story', 'Reel / TikTok'];
  const status = (campaign.status || 'terminee').toLowerCase();

  const statusConfig = {
    terminee: { label: 'Terminée', bg: 'rgba(39, 174, 96, 0.1)', color: '#27AE60', border: 'rgba(39, 174, 96, 0.3)', icon: CheckCircle2 },
    en_cours: { label: 'En cours', bg: 'rgba(41, 128, 185, 0.1)', color: '#2980B9', border: 'rgba(41, 128, 185, 0.3)', icon: Clock },
    reportee: { label: 'Reportée', bg: 'rgba(243, 156, 18, 0.1)', color: '#F39C12', border: 'rgba(243, 156, 18, 0.3)', icon: AlertTriangle },
    annulee: { label: 'Annulée', bg: 'rgba(231, 76, 60, 0.1)', color: '#E74C3C', border: 'rgba(231, 76, 60, 0.3)', icon: XCircle },
  };

  const currentStatus = statusConfig[status] || statusConfig.terminee;
  const StatusIcon = currentStatus.icon;

  // Calculs chiffrés
  const reach = campaign.kpiReach || campaign.reach || 0;
  const reachTarget = campaign.kpiTarget || campaign.targetReach || 0;
  const reachRatio = reachTarget > 0 ? Math.round((reach / reachTarget) * 100) : 100;
  const isReachAchieved = reachRatio >= 90;

  const impressions = campaign.impressions || Math.round(reach * 1.35);
  const engRate = campaign.kpiEngagement || campaign.engagementRate || 0;
  const engTarget = campaign.engagementTarget || 5.0;
  const engRatio = engTarget > 0 ? Math.round((engRate / engTarget) * 100) : 100;
  const isEngAchieved = engRatio >= 90;

  const clicks = campaign.clicks || campaign.clics || Math.round(reach * 0.04);
  const conversions = campaign.conversions || Math.round(clicks * 0.12);

  // Évaluation
  const notes = campaign.notesInternes || {};
  const globalScore = notes.noteGlobale || campaign.contentQuality || 4.5;
  const comment = notes.commentaire || campaign.comment || 'Campagne livrée selon le cahier des charges avec une bonne réceptivité de la communauté.';
  const pointsForts = Array.isArray(notes.pointsForts)
    ? notes.pointsForts
    : (notes.pointsForts ? notes.pointsForts.split(',').map(s => s.trim()) : ['Qualité esthétique', 'Forte interaction']);
  const axesAmelioration = Array.isArray(notes.axesAmelioration)
    ? notes.axesAmelioration
    : (notes.axesAmelioration ? notes.axesAmelioration.split(',').map(s => s.trim()) : ['Améliorer les CTA en fin de story']);

  // Livrables
  const livrables = campaign.livrables || [
    { id: 'L-1', titre: 'Story Teaser de lancement', type: 'Story', url: 'https://instagram.com', statut: 'valide' },
    { id: 'L-2', titre: 'Reel Démonstration du service', type: 'Reel / TikTok', url: 'https://instagram.com', statut: 'valide' },
  ];

  // Rémunération & Contrat
  const basePay = campaign.remuneration?.base || campaign.basePay || campaign.cachetBase || 1500000;
  const variablePay = campaign.remuneration?.variable || (basePay * ((campaign.variablePaid || 100) / 100) * 0.2) || 0;
  const variablePct = campaign.variablePaid !== undefined ? campaign.variablePaid : 100;
  const perks = campaign.remuneration?.avantages || campaign.avantages || 'Dotation Pulse Data 5G illimitée 3 mois + Goodies';
  const contractInfo = campaign.contractInfo || {
    contratRef: `CTR-2026-${100 + index}`,
    exclusivite: false,
    droitsImage: 'Droits digitaux 12 mois - Réseaux sociaux Cameroun',
  };

  return (
    <div
      className="card shadow-sm transition-all duration-200"
      style={{
        background: '#ffffff',
        border: '1px solid #E1E4E8',
        borderLeft: `5px solid ${isReachAchieved ? '#27AE60' : '#FF7900'}`,
        borderRadius: 10,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* ── EN-TÊTE DE LA CARTE ── */}
      <div
        className="p-16 flex flex-wrap justify-between items-start gap-12"
        style={{ background: '#F8FAFC', borderBottom: '1px solid #EAECEF' }}
      >
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center gap-8 mb-4 flex-wrap">
            <h3 className="text-lg font-bold text-dark">{campName}</h3>
            <span
              className="tag font-bold"
              style={{ background: 'rgba(255, 121, 0, 0.12)', color: '#FF7900', fontSize: 11 }}
            >
              {brand}
            </span>
            <span
              className="tag flex items-center gap-4 font-semibold"
              style={{
                background: currentStatus.bg,
                color: currentStatus.color,
                border: `1px solid ${currentStatus.border}`,
                fontSize: 11
              }}
            >
              <StatusIcon size={12} /> {currentStatus.label}
            </span>
          </div>

          <div className="flex items-center gap-12 text-xs text-muted flex-wrap">
            <span className="flex items-center gap-4">
              <Calendar size={13} className="text-orange" /> {dates}
            </span>
            <span>•</span>
            <span className="flex items-center gap-4">
              📱 {networks.join(', ')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-4">
              🎬 {contentTypes.join(', ')}
            </span>
          </div>
        </div>

        {/* Boutons d'action rapides */}
        <div className="flex items-center gap-8 flex-wrap">
          <button
            className="btn btn-ghost btn-sm text-dark flex items-center gap-4"
            style={{ border: '1px solid #E1E4E8' }}
            onClick={() => onExportPdf(campaign)}
            title="Exporter cette campagne en PDF charté Orange Cameroun"
          >
            <FileDown size={14} className="text-orange" /> PDF
          </button>

          <button
            className="btn btn-ghost btn-sm text-dark flex items-center gap-4"
            style={{ border: '1px solid #E1E4E8' }}
            onClick={() => onShare(campaign)}
            title="Partager par Mail, WhatsApp ou Teams"
          >
            <Share2 size={14} className="text-blue" /> Partager
          </button>

          <button
            className="btn btn-ghost btn-sm text-blue flex items-center gap-4"
            onClick={() => onEdit(campaign)}
            title="Modifier ou évaluer"
          >
            <Edit3 size={14} /> Modifier
          </button>

          <button
            className="btn btn-ghost btn-sm text-red flex items-center gap-4"
            onClick={() => onDelete(campaign)}
            title="Supprimer cette campagne de l'historique"
          >
            <Trash2 size={14} />
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Réduire' : 'Développer'}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* ── CORPS DE LA CARTE (DÉVELOPPÉ) ── */}
      {expanded && (
        <div className="p-16 space-y-16">
          {/* 1. RÉSULTATS CHIFFRÉS */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold text-dark tracking-wide uppercase flex items-center gap-6">
                📊 RÉSULTATS CHIFFRÉS & PERFORMANCE
              </span>
              <span className="text-xs text-muted">
                Qualité du contenu : <strong className="text-orange">{campaign.contentQuality || 4}/5 ⭐</strong> • {campaign.onTime ? '✓ Dans les délais' : '⚠️ En retard'}
              </span>
            </div>

            <div className="grid grid-4 gap-10">
              {/* Card 1 : Portée */}
              <div className="p-10 rounded" style={{ background: '#F8FAFC', border: '1px solid #EAECEF' }}>
                <div className="text-xs text-muted mb-2">Portée obtenue vs Cible</div>
                <div className="text-base font-bold text-dark">
                  {formatNumber(reach)}
                  {reachTarget > 0 && <span className="text-xs font-normal text-muted"> / {formatNumber(reachTarget)}</span>}
                </div>
                <div className="text-xs font-semibold mt-2" style={{ color: isReachAchieved ? '#27AE60' : '#E74C3C' }}>
                  {reachRatio}% de la cible {isReachAchieved ? '✓ Atteint' : '⚠️ Sous cible'}
                </div>
              </div>

              {/* Card 2 : Impressions & Vues */}
              <div className="p-10 rounded" style={{ background: '#F8FAFC', border: '1px solid #EAECEF' }}>
                <div className="text-xs text-muted mb-2">Impressions & Vues totales</div>
                <div className="text-base font-bold text-dark">
                  {formatNumber(impressions)}
                </div>
                <div className="text-xs text-muted mt-2">
                  Exposition totale du message
                </div>
              </div>

              {/* Card 3 : Taux d'engagement */}
              <div className="p-10 rounded" style={{ background: '#F8FAFC', border: '1px solid #EAECEF' }}>
                <div className="text-xs text-muted mb-2">Taux d'Engagement</div>
                <div className="text-base font-bold text-dark">
                  {engRate}% <span className="text-xs font-normal text-muted">/ obj: {engTarget}%</span>
                </div>
                <div className="text-xs font-semibold mt-2" style={{ color: isEngAchieved ? '#27AE60' : '#E74C3C' }}>
                  {isEngAchieved ? '✓ Au-dessus de la cible' : '⚠️ En dessous cible'}
                </div>
              </div>

              {/* Card 4 : Clics & Conversions */}
              <div className="p-10 rounded" style={{ background: '#F8FAFC', border: '1px solid #EAECEF' }}>
                <div className="text-xs text-muted mb-2">Clics & Conversions</div>
                <div className="text-base font-bold text-dark">
                  {formatNumber(clicks)} <span className="text-xs font-normal text-muted">clics</span>
                </div>
                <div className="text-xs font-semibold text-blue mt-2">
                  {conversions} conversions / activations
                </div>
              </div>
            </div>

            {campaign.salesVolume > 0 && (
              <div className="mt-8 p-8 rounded flex items-center justify-between text-xs" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                <span className="font-semibold text-green">💰 Chiffre d'affaires & ventes attribuées :</span>
                <strong className="text-green text-sm">{formatCurrency(campaign.salesVolume)}</strong>
              </div>
            )}
          </div>

          {/* 2. ÉVALUATION QUALITATIVE & COLLABORATION */}
          <div className="p-12 rounded" style={{ background: '#FBFBFC', border: '1px solid #E5E7EB' }}>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold text-dark flex items-center gap-6">
                📝 ÉVALUATION QUALITATIVE & AVIS McCANN / ORANGE
              </span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted">Note globale :</span>
                <span className="text-sm font-bold text-orange">{globalScore} / 5 ⭐</span>
              </div>
            </div>

            {/* Notes détaillées */}
            <div className="grid grid-3 gap-8 mb-8 text-xs">
              <div className="p-6 rounded bg-white border">
                Fiabilité éditoriale : <strong className="text-orange">{notes.fiabilite || 4}/5</strong>
              </div>
              <div className="p-6 rounded bg-white border">
                Qualité de collaboration : <strong className="text-blue">{notes.qualiteCollaboration || 5}/5</strong>
              </div>
              <div className="p-6 rounded bg-white border">
                Respect des délais : <strong className="text-green">{notes.respectDelais || 4}/5</strong>
              </div>
            </div>

            {/* Commentaire de l'équipe */}
            {comment && (
              <div
                className="text-xs italic text-dark mb-10 p-8 rounded bg-white"
                style={{ borderLeft: '3px solid #FF7900' }}
              >
                « {comment} »
              </div>
            )}

            {/* Points forts & Axes d'amélioration */}
            <div className="grid grid-2 gap-8 text-xs">
              <div className="p-8 rounded" style={{ background: 'rgba(39, 174, 96, 0.06)', border: '1px solid rgba(39, 174, 96, 0.2)' }}>
                <div className="font-bold text-green mb-4 flex items-center gap-4">
                  <CheckCircle2 size={13} /> Points forts :
                </div>
                <div className="flex flex-wrap gap-4">
                  {pointsForts.map((pf, pIdx) => (
                    <span key={pIdx} className="tag font-medium" style={{ background: '#fff', color: '#27AE60', border: '1px solid rgba(39, 174, 96, 0.3)', fontSize: 11 }}>
                      {pf}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded" style={{ background: 'rgba(243, 156, 18, 0.06)', border: '1px solid rgba(243, 156, 18, 0.2)' }}>
                <div className="font-bold text-orange mb-4 flex items-center gap-4">
                  <AlertTriangle size={13} /> Axes d'amélioration :
                </div>
                <div className="flex flex-wrap gap-4">
                  {axesAmelioration.map((ax, aIdx) => (
                    <span key={aIdx} className="tag font-medium" style={{ background: '#fff', color: '#D97706', border: '1px solid rgba(243, 156, 18, 0.3)', fontSize: 11 }}>
                      {ax}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. LIVRABLES RÉALISÉS & LIENS */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold text-dark tracking-wide uppercase flex items-center gap-6">
                🎬 LIVRABLES RÉALISÉS ({livrables.length})
              </span>
              <span className="text-xs text-muted">Contenus validés et publiés</span>
            </div>

            <div className="grid grid-2 gap-8">
              {livrables.map((liv, lIdx) => (
                <div
                  key={liv.id || lIdx}
                  className="p-8 rounded flex items-center justify-between gap-8 bg-white border"
                  style={{ borderLeft: '3px solid #2980B9' }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-6 mb-2">
                      <span className="tag text-xs" style={{ background: '#EEF2FF', color: '#4338CA', padding: '2px 6px' }}>
                        {liv.type || 'Post'}
                      </span>
                      <strong className="text-xs text-dark truncate block">{liv.titre || liv.title}</strong>
                    </div>
                    {liv.url ? (
                      <a
                        href={liv.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue flex items-center gap-4 hover:underline truncate"
                      >
                        <ExternalLink size={12} /> {liv.url}
                      </a>
                    ) : (
                      <span className="text-xs text-muted">Lien non renseigné</span>
                    )}
                  </div>
                  <span className="tag text-green font-semibold" style={{ background: 'rgba(39, 174, 96, 0.1)', fontSize: 11 }}>
                    {liv.statut === 'valide' ? 'Validé ✓' : (liv.statut || 'Livré')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. RÉMUNÉRATION & CADRE CONTRACTUEL */}
          <div className="p-10 rounded flex flex-wrap justify-between items-center gap-12" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-16 flex-wrap">
              <div>
                <span className="text-xs text-muted block">Cachet de base perçu</span>
                <strong className="text-sm text-dark">{formatCurrency(basePay)}</strong>
              </div>
              <div>
                <span className="text-xs text-muted block">Part variable versée</span>
                <strong className="text-sm text-green">{formatCurrency(variablePay)} ({variablePct}%)</strong>
              </div>
              <div>
                <span className="text-xs text-muted block">Avantages en nature</span>
                <span className="text-xs font-medium text-dark">{perks}</span>
              </div>
            </div>

            <div className="flex items-center gap-12 text-xs text-muted border-t sm:border-t-0 sm:border-l pl-0 sm:pl-12">
              <div>
                <span className="block text-muted">Réf Contrat : <strong className="text-dark">{contractInfo.contratRef}</strong></span>
                <span className="block text-muted">Exclusivité : <strong className="text-dark">{contractInfo.exclusivite ? 'Oui (Exclusif)' : 'Non'}</strong></span>
              </div>
              <div>
                <span className="block text-muted">Droits d'image :</span>
                <span className="text-dark font-medium">{contractInfo.droitsImage}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
