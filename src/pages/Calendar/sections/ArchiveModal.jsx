export default function ArchiveModal({ onClose }) {
  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: 600, background: 'var(--bg-dark)', color: '#fff', border: '1px solid #333' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid #333' }}>
          <h2 className="text-lg font-bold">Importation d'Archives Calendaires</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ color: '#aaa' }}>✕</button>
        </div>
        <div className="modal-body p-20">
          <p className="text-sm text-muted mb-20">
            Importez vos anciens calendriers de contenus pour les consulter par client, canal ou période.
            Formats supportés : CSV, Excel, PDF, PPTX.
          </p>

          <div className="upload-zone mb-20" style={{ border: '2px dashed #444', borderRadius: 8, padding: 40, textAlign: 'center', cursor: 'pointer' }}>
            <div className="text-4xl mb-12">📄</div>
            <div className="font-semibold mb-4">Glissez-déposez vos fichiers ici</div>
            <div className="text-xs text-muted mb-12">ou cliquez pour parcourir</div>
            <button className="btn btn-blue btn-sm">Parcourir les fichiers</button>
          </div>

          <div className="form-group mb-16">
            <label className="text-sm font-semibold mb-8 block text-muted">Client associé à l'archive</label>
            <select className="adv-cal-select w-full">
              <option>Orange Telco</option>
              <option>Orange Money</option>
              <option>Orange Business</option>
            </select>
          </div>

          <div className="form-group mb-20">
            <label className="text-sm font-semibold mb-8 block text-muted">Période concernée</label>
            <div className="flex gap-12">
              <input type="month" className="adv-cal-select flex-1" />
              <span className="text-muted flex items-center">à</span>
              <input type="month" className="adv-cal-select flex-1" />
            </div>
          </div>
          
          <div className="flex justify-end gap-12 mt-24 border-t pt-20" style={{ borderColor: '#333' }}>
            <button className="btn btn-ghost" onClick={onClose} style={{ color: '#aaa' }}>Annuler</button>
            <button className="btn btn-green" onClick={() => { alert('Archive importée avec succès !'); onClose(); }}>Archiver et Consulter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
