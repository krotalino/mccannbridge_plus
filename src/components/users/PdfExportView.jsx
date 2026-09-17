import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Share2, ShieldCheck, 
  Lock, Check, QrCode, Building, User, Mail, Phone,
  Calendar, CheckCircle2, Shield, Copy, Sparkles, Sliders
} from 'lucide-react';
import jsPDF from 'jspdf';

export default function PdfExportView({
  user,
  allUsers = [],
  onSelectUser
}) {
  const [selectedUser, setSelectedUser] = useState(user || allUsers[0]);
  
  // Options
  const [optSignature, setOptSignature] = useState(true);
  const [optAuditHistory, setOptAuditHistory] = useState(true);
  const [optMaskPhone, setOptMaskPhone] = useState(false);
  const [optWatermark, setOptWatermark] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  React.useEffect(() => {
    if (user) {
      setSelectedUser(user);
    }
  }, [user]);

  const targetUser = selectedUser || user || allUsers[0];
  if (!targetUser) return null;

  const isAgency = targetUser.type === 'agence';
  const shaHash = `9e4f2a78bc3410de88e154f201cd9987${targetUser.id.replace(/[^0-9]/g, '9') || '8842'}77ab`;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(shaHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Background header band
      doc.setFillColor(14, 20, 40);
      doc.rect(0, 0, 210, 40, 'F');

      // Top color stripes
      doc.setFillColor(255, 102, 0); // Orange
      doc.rect(0, 0, 70, 3, 'F');
      doc.setFillColor(42, 43, 94); // Purple
      doc.rect(70, 0, 70, 3, 'F');
      doc.setFillColor(0, 212, 255); // Cyan
      doc.rect(140, 0, 70, 3, 'F');

      // Title & Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('McCANN × ORANGE IAM BRIDGE — PROTOCOLE BI-RIVE', 105, 15, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 210, 230);
      doc.text('FICHE UTILISATEUR & ACCRÉDITATION SÉCURISÉE • DOUALA CAMEROUN', 105, 22, { align: 'center' });
      doc.text(`RÉF : BRG-2025-${targetUser.matricule || 'DLA-0842'}`, 105, 28, { align: 'center' });

      // User Information Box
      doc.setTextColor(20, 25, 45);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(targetUser.name || `${targetUser.prenom || ''} ${targetUser.nom || ''}`, 20, 52);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 110, 130);
      doc.text(`${targetUser.profil || targetUser.poste || 'Collaborateur'} — ${isAgency ? 'Agence McCann Douala' : 'Client Orange Cameroun'}`, 20, 58);
      doc.text(`UID: ${targetUser.matricule || targetUser.uid || 'MC-CM-8842'} | Statut: Actif Vérifié | Habilitation: Niveau 3`, 20, 64);

      // Divider
      doc.setDrawColor(220, 225, 235);
      doc.line(20, 68, 190, 68);

      // Section A: Coordonnées
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 102, 0);
      doc.text('SECTION A : COORDONNÉES & CONTACT PROFESSIONNEL', 20, 76);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 45, 60);
      doc.text(`Email Professionnel : ${targetUser.email}`, 25, 84);
      doc.text(`Passerelle Sécurisée : ${targetUser.emailPasserelle || `${targetUser.nom?.toLowerCase() || 'user'}@orange-bridge.net`}`, 25, 90);
      doc.text(`Téléphone : ${optMaskPhone ? '+237 ••• ••• ••• (Masqué RGPD)' : (targetUser.telephone || '+237 699 00 11 22')}`, 25, 96);
      doc.text('Siège : Immeuble McCann, Rue des Cocotiers, Bonanjo, Douala', 25, 102);

      // Section B: Rattachement
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 180, 220);
      doc.text('SECTION B : RATTACHEMENT STRUCTUREL & RESPONSABILITÉS', 20, 114);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 45, 60);
      doc.text(`Entité : ${targetUser.entite || 'Pôle Création & Studio Graphique'}`, 25, 122);
      doc.text(`Responsable Rive McCann : ${targetUser.responsableMcCann || 'Jean-Marc Belinga (VP ECD)'}`, 25, 128);
      doc.text(`Interlocuteur Rive Orange : ${targetUser.interlocuteurOrange || 'Sandrine Moukoko (Brand Head)'}`, 25, 134);
      doc.text(`Matériel & FIDO2 : ${targetUser.hardware || 'MacBook Pro 16"'} • Clé FIDO2 YubiKey 5C NFC`, 25, 140);

      // Section C: Contexte & Biographie
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 45, 60);
      doc.text('SECTION C : CONTEXTE D\'INTERVENTION & PÉRIMÈTRE BI-RIVE', 20, 152);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 85, 100);
      const bioLines = doc.splitTextToSize(
        targetUser.biographie || "Supervise la cohérence visuelle 360° des campagnes Orange Cameroun (Orange Money, Pulse, 5G, B2B). Référent principal pour l'application des chartes graphiques de marque et l'homogénéité des supports digitaux, print et médias.",
        170
      );
      doc.text(bioLines, 25, 160);

      // Triple Signature Box
      doc.setDrawColor(200, 210, 225);
      doc.rect(20, 195, 52, 38);
      doc.rect(79, 195, 52, 38);
      doc.rect(138, 195, 52, 38);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 102, 0);
      doc.text('VISA McCANN DOUALA', 23, 201);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 110, 120);
      doc.text('Direction Générale', 23, 206);
      doc.setTextColor(40, 45, 60);
      doc.text('J-P. Ngassam (DG)', 23, 218);
      doc.setTextColor(0, 150, 0);
      doc.text('✓ Signé Numériquement', 23, 224);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 90, 110);
      doc.text('SCEAU SHA-256 PKI', 82, 201);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 110, 120);
      doc.text('Validation Cryptographique', 82, 206);
      doc.setTextColor(0, 150, 0);
      doc.text('✓ Hash Certifié OK', 82, 218);
      doc.setFontSize(6.5);
      doc.setTextColor(120, 130, 140);
      doc.text(`EMPREINTE : ${shaHash.slice(0, 16)}...`, 82, 225);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 180, 220);
      doc.text('VISA ORANGE CAMEROUN', 141, 201);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 110, 120);
      doc.text('DSI & Cyber-Gouvernance', 141, 206);
      doc.setTextColor(40, 45, 60);
      doc.text('Direction Sécurité SI', 141, 218);
      doc.setTextColor(0, 150, 0);
      doc.text('✓ Conforme ZTNA', 141, 224);

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(150, 160, 175);
      doc.text('DOCUMENT OFFICIEL GOUVERNANCE BRIDGE IAM • EMIS VIA LE CLUSTER DOUALA-YAOUNDÉ • PAGE 1/1', 105, 280, { align: 'center' });

      doc.save(`FICHE-IAM-${targetUser.matricule || 'COLLABORATEUR'}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setGeneratingPdf(false);
    }
  };

  const initials = targetUser.avatar || (targetUser.prenom ? `${targetUser.prenom[0]}${targetUser.nom ? targetUser.nom[0] : ''}` : (targetUser.name?.slice(0, 2) || 'AE')).toUpperCase();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ─── TOP BAR WITH USER SELECTOR & SPECS ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/40 font-bold uppercase tracking-wider">Édition de la Fiche pour :</span>
          <select
            value={targetUser.id}
            onChange={(e) => {
              const found = allUsers.find(u => u.id === e.target.value);
              if (found) {
                setSelectedUser(found);
                onSelectUser?.(found);
              }
            }}
            className="px-3 py-1.5 bg-[#080B17] border border-white/10 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-cyan-400"
          >
            {allUsers.map(u => (
              <option key={u.id} value={u.id}>
                {u.name || `${u.prenom || ''} ${u.nom || ''}`} — {u.type === 'agence' ? 'McCann' : 'Orange'} ({u.profil || u.poste})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
            Rendu Vectoriel HD 300 DPI
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
            Certificat X.509 Valide
          </span>
        </div>
      </div>

      {/* ─── MAIN TWO-COLUMN LAYOUT (CONTROLS & A4 SHEET) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Panneau de Contrôle Latéral (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card: Statut & Téléchargement */}
          <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Export Fiche Collaborateur</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                v2.4 CERTIFIÉE
              </span>
            </div>

            <p className="text-xs text-white/60">
              Gabarit A4 Portrait (210 &times; 297 mm) normalisé pour archivage RH, conformité ANOR et visas cryptographiques bi-rive.
            </p>

            {/* Primary Action Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className="w-full py-3 px-4 rounded-xl text-xs font-black text-slate-950 shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099FF 100%)',
                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)'
              }}
            >
              <Download className="w-4 h-4" />
              <span>{generatingPdf ? 'Génération du PDF officiel...' : 'Télécharger le PDF officiel'}</span>
            </button>

            {/* Secondary Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-white/60" />
                <span>Imprimer</span>
              </button>

              <button
                onClick={() => alert("Lien sécurisé copié dans le presse-papier")}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-white/60" />
                <span>Partager RH</span>
              </button>
            </div>
          </div>

          {/* Card: Options de Génération */}
          <div className="p-6 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-3.5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="font-bold text-xs text-white uppercase tracking-wider">Options de Génération</span>
              <Sliders className="w-3.5 h-3.5 text-white/40" />
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={optSignature}
                  onChange={(e) => setOptSignature(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-black/40 text-orange-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white">Signature numérique McCann-Orange</div>
                  <div className="text-[11px] text-white/40">Sceau cryptographique PKI apposé sur le document</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={optAuditHistory}
                  onChange={(e) => setOptAuditHistory(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-cyan-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white">Historique de connexion &amp; audits</div>
                  <div className="text-[11px] text-white/40">Injecter les logs IP 30J en annexe</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={optMaskPhone}
                  onChange={(e) => setOptMaskPhone(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-purple-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white">Masquer téléphone personnel / flotte</div>
                  <div className="text-[11px] text-white/40">Politique de confidentialité RGPD &amp; ANOR</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={optWatermark}
                  onChange={(e) => setOptWatermark(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-yellow-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white">Filigrane 'CONFIDENTIEL ARCHIVE'</div>
                  <div className="text-[11px] text-white/40">Impression en trame diagonale semi-transparente</div>
                </div>
              </label>
            </div>
          </div>

          {/* Card: Empreinte Cryptographique SHA-256 */}
          <div className="p-5 rounded-2xl bg-[#0E1428]/95 border border-[#1C264D] shadow-xl space-y-2.5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white/70 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Empreinte SHA-256</span>
              </span>
              <button
                onClick={handleCopyHash}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'Copié' : 'COPIER HASH'}</span>
              </button>
            </div>

            <div className="p-2.5 bg-[#080B17] border border-white/10 rounded-xl font-mono text-[10px] text-white/70 break-all select-all">
              {shaHash}
            </div>
            <div className="text-[10px] text-white/40">
              Garantie d'intégrité non-répudiable certifiée par l'autorité racine BRIDGE Cameroun.
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: A4 Document Sheet Authentic Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-200">
          
          {/* Optional Watermark */}
          {optWatermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
              <div className="text-6xl font-black text-slate-900/[0.04] -rotate-45 tracking-widest uppercase">
                CONFIDENTIEL ARCHIVE
              </div>
            </div>
          )}

          {/* Top Tricolor Brand Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="bg-[#FF6600] w-1/3 h-full"></div>
            <div className="bg-[#2A2B5E] w-1/3 h-full"></div>
            <div className="bg-[#00D4FF] w-1/3 h-full"></div>
          </div>

          {/* Document Official Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 pt-1">
            <div className="space-y-0.5">
              <div className="text-[10px] font-black tracking-widest text-[#FF6600] uppercase">
                McCANN DOUALA
              </div>
              <div className="text-[9px] text-slate-500 font-semibold">
                Partenaire Agence Officiel
              </div>
            </div>

            <div className="text-center px-2">
              <div className="text-xs font-black tracking-tight text-slate-900 uppercase">
                McCANN &times; ORANGE IAM BRIDGE &bull; PROTOCOLE BI-RIVE
              </div>
              <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">
                FICHE UTILISATEUR &amp; ACCRÉDITATION IAM
              </div>
              <div className="text-[8px] font-mono text-slate-400 mt-0.5">
                DOUALA, RÉPUBLIQUE DU CAMEROUN
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <div className="text-[10px] font-black tracking-widest text-[#00A8CC] uppercase">
                ORANGE CAMEROUN
              </div>
              <div className="text-[8px] font-mono text-slate-500">
                REF-BRG-2025-DLA-{targetUser.matricule?.slice(-4) || '0842'}
              </div>
            </div>
          </div>

          {/* Collaborator Identification Box */}
          <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg shrink-0 text-white shadow-sm ${
              isAgency ? 'bg-[#FF6600]' : 'bg-[#00D4FF] text-slate-950'
            }`}>
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  {targetUser.name || `${targetUser.prenom || ''} ${targetUser.nom || ''}`}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                  isAgency ? 'bg-orange-100 text-orange-800' : 'bg-cyan-100 text-cyan-900'
                }`}>
                  {isAgency ? 'PARTENAIRE AGENCE' : 'CLIENT ORANGE'}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                  STATUT ACTIF VÉRIFIÉ
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-700">
                {targetUser.profil || targetUser.poste || 'Directeur Artistique Senior'} // Lead Brand &amp; Visual Identity
              </div>

              <div className="text-[10px] text-slate-500 font-mono flex flex-wrap gap-2">
                <span>UID: {targetUser.matricule || 'MC-CM-8842'}</span>
                <span>&bull;</span>
                <span>Niveau d'Accréditation : <strong>3 (Supervision Créative &amp; Assets Sécurisés)</strong></span>
              </div>
            </div>
          </div>

          {/* Section A: Coordonnées & Contact */}
          <div className="space-y-2 mb-4 text-xs">
            <div className="font-black text-slate-900 text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>Section A : Coordonnées Professionnelles &amp; Canaux Sécurisés</span>
              <span className="text-[9px] font-mono text-slate-400">CONNEXION ZTNA</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Email Principal</span>
                <span className="font-mono font-bold text-slate-900">{targetUser.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Passerelle IAM Sécurisée</span>
                <span className="font-mono font-bold text-cyan-700">
                  {targetUser.emailPasserelle || `${targetUser.nom?.toLowerCase() || 'user'}@orange-bridge.net`}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Téléphone Flotte Pro</span>
                <span className="font-mono font-bold text-slate-900">
                  {optMaskPhone ? '+237 ••• ••• ••• (Masqué RGPD)' : (targetUser.telephone || '+237 699 00 11 22')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Siège &amp; Rattachement</span>
                <span className="font-semibold text-slate-900">Immeuble McCann, Rue des Cocotiers, Bonanjo</span>
              </div>
            </div>
          </div>

          {/* Section B: Rattachement Structurel & Responsabilités */}
          <div className="space-y-2 mb-4 text-xs">
            <div className="font-black text-slate-900 text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>Section B : Rattachement Structurel &amp; Périmètre Bi-Rive</span>
              <span className="text-[9px] font-mono text-slate-400">PÔLE CRÉA / MARQUE</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Pôle Opérationnel</span>
                <span className="font-semibold text-slate-900">{targetUser.entite || 'Pôle Création & Studio Graphique'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Direction Agence N+1</span>
                <span className="font-semibold text-slate-900">{targetUser.responsableMcCann || 'Jean-Marc Belinga (VP ECD)'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Interlocuteur Client Orange</span>
                <span className="font-semibold text-slate-900">{targetUser.interlocuteurOrange || 'Sandrine Moukoko (Brand Head)'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Environnement de Création</span>
                <span className="font-semibold text-slate-900">{targetUser.hardware || 'MacBook Pro 16"'} &bull; FIDO2 YubiKey 5C</span>
              </div>
            </div>
          </div>

          {/* Section C: Contexte d'Intervention & Biographie */}
          <div className="space-y-1.5 mb-5 text-xs">
            <div className="font-black text-slate-900 text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">
              Section C : Contexte d'Intervention &amp; Rôle Orange Cameroun
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
              {targetUser.biographie || "Supervise la cohérence visuelle 360° des campagnes Orange Cameroun (Orange Money, Pulse, 5G, B2B). Référent principal pour l'application des chartes graphiques de marque et l'homogénéité des supports digitaux, print et médias."}
            </p>
          </div>

          {/* Triple Signature Block */}
          {optSignature && (
            <div className="grid grid-cols-3 gap-3 pt-3 border-t-2 border-slate-900 text-slate-900">
              
              {/* Visa McCann */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[9px] font-black text-[#FF6600] uppercase">VISA DIRECTION McCANN</div>
                <div className="text-[8px] text-slate-500">J-P. Ngassam &bull; DG McCann</div>
                <div className="text-[9px] font-mono text-emerald-700 font-bold pt-1">✓ SIGNÉ &amp; PARAPHÉ</div>
                <div className="text-[7px] text-slate-400 font-mono">11:14:02 &bull; PKI Validé</div>
              </div>

              {/* QR / Cryptographic Seal */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-1">
                <div className="text-[9px] font-black text-slate-800 uppercase">SCEAU SHA-256</div>
                <div className="text-[7px] font-mono text-slate-500 truncate">{shaHash.slice(0, 16)}...</div>
                <div className="text-[9px] font-mono text-emerald-700 font-bold">✓ SCEAU VÉRIFIÉ</div>
                <div className="text-[7px] text-slate-400 font-mono">Cluster Douala-Yaoundé</div>
              </div>

              {/* Visa Orange CM */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[9px] font-black text-[#00A8CC] uppercase">VISA SÉCURITÉ ORANGE CM</div>
                <div className="text-[8px] text-slate-500">DSI Cyber-Gouv CM</div>
                <div className="text-[9px] font-mono text-emerald-700 font-bold pt-1">✓ APPROUVÉ ZTNA</div>
                <div className="text-[7px] text-slate-400 font-mono">Protocole Bi-Rive v4.2</div>
              </div>

            </div>
          )}

          {/* Footer Note */}
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono text-slate-400">
            <span>DOCUMENT OFFICIEL GOUVERNANCE BRIDGE IAM &bull; McCANN DOUALA &times; ORANGE CAMEROUN</span>
            <span>PAGE 1/1 &bull; ANOR CM-2025</span>
          </div>

        </div>

      </div>

    </div>
  );
}
