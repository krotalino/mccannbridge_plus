import { useState } from 'react';

export default function DocumentsPage() {
  const mockDocs = [
    { id: 'D1', name: 'Brand_Guidelines_2026.pdf', type: 'guideline', project: 'Global', author: 'Steve B.', date: '01/04/2026' },
    { id: 'D2', name: 'Brief_Ramadan.docx', type: 'brief', project: 'Ramadan 2026', author: 'Marie D.', date: '15/04/2026' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-24" style={{ borderBottom: '2px solid #eee', paddingBottom: 12 }}>
        <h1 className="text-2xl font-bold text-dark">📁 Documents & Collaboration</h1>
        <button className="btn btn-primary">Uploader un document</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nom du fichier</th>
              <th>Type</th>
              <th>Projet</th>
              <th>Auteur</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockDocs.map(doc => (
              <tr key={doc.id}>
                <td className="font-bold flex items-center gap-8">📄 {doc.name}</td>
                <td><span className="tag tag-muted">{doc.type}</span></td>
                <td>{doc.project}</td>
                <td>{doc.author}</td>
                <td className="text-muted">{doc.date}</td>
                <td>
                  <button className="btn btn-sm btn-ghost">Ouvrir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
