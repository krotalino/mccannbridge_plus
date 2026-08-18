import { useState } from 'react';

export default function TasksPage() {
  const mockTasks = [
    { id: 'T1', title: 'Mettre à jour le guideline', type: 'Action liée à doc', assignee: 'Design Team', status: 'À faire', deadline: '20/04/2026' },
    { id: 'T2', title: 'Créer projet pour Ramadan', type: 'Automation', assignee: 'Steve B.', status: 'Terminé', deadline: '10/04/2026' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-24" style={{ borderBottom: '2px solid #eee', paddingBottom: 12 }}>
        <h1 className="text-2xl font-bold text-dark">✓ Tâches transverses & Automations</h1>
        <button className="btn btn-primary">Nouvelle Tâche</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Tâche</th>
              <th>Type</th>
              <th>Assigné à</th>
              <th>Statut</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTasks.map(task => (
              <tr key={task.id}>
                <td className="font-bold">{task.title}</td>
                <td><span className="tag tag-muted">{task.type}</span></td>
                <td>{task.assignee}</td>
                <td>
                  <span className={`tag ${task.status === 'Terminé' ? 'tag-green' : 'tag-yellow'}`}>
                    {task.status}
                  </span>
                </td>
                <td className={task.status !== 'Terminé' ? 'text-red' : 'text-muted'}>{task.deadline}</td>
                <td>
                  <button className="btn btn-sm btn-ghost">Éditer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
