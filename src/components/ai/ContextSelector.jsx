import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ContextSelector({ activeContext, onChange, availableDocuments = [] }) {
  const { clientsHierarchy } = useApp();
  const [showDocPicker, setShowDocPicker] = useState(false);

  const selectedClient = clientsHierarchy.find(c => c.name === activeContext.client) || clientsHierarchy[0];
  const availableBrands = selectedClient?.brands || [];
  const selectedBrand = availableBrands.find(b => b.name === activeContext.brand) || availableBrands[0];
  const availableProjects = selectedBrand?.projects || [];

  const handleClientChange = (clientName) => {
    const clientObj = clientsHierarchy.find(c => c.name === clientName);
    const firstBrand = clientObj?.brands?.[0]?.name || '';
    const firstProj = clientObj?.brands?.[0]?.projects?.[0]?.name || '';
    onChange({
      client: clientName,
      brand: firstBrand,
      project: firstProj,
    });
  };

  const handleBrandChange = (brandName) => {
    const brandObj = availableBrands.find(b => b.name === brandName);
    const firstProj = brandObj?.projects?.[0]?.name || '';
    onChange({
      brand: brandName,
      project: firstProj,
    });
  };

  const handleProjectChange = (projectName) => {
    onChange({ project: projectName });
  };

  const toggleDocument = (docId) => {
    const currentDocs = activeContext.documents || [];
    const isSelected = currentDocs.includes(docId);
    const newDocs = isSelected 
      ? currentDocs.filter(id => id !== docId)
      : [...currentDocs, docId];
    onChange({ documents: newDocs });
  };

  const attachedDocsCount = (activeContext.documents || []).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Hierarchy Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="text-sm">🎯</span> Contexte :
          </div>

          {/* Client Selector */}
          <div className="relative">
            <select
              value={activeContext.client}
              onChange={(e) => handleClientChange(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 pr-7 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none"
            >
              {clientsHierarchy.map(client => (
                <option key={client.id} value={client.name}>{client.name}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">▼</span>
          </div>

          {/* Brand Selector */}
          <div className="relative">
            <select
              value={activeContext.brand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 pr-7 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-lg text-orange-900 dark:text-orange-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none"
            >
              {availableBrands.map(brand => (
                <option key={brand.id} value={brand.name}>{brand.name}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-orange-500">▼</span>
          </div>

          {/* Project Selector */}
          <div className="relative">
            <select
              value={activeContext.project}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 pr-7 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none"
            >
              {availableProjects.map(proj => (
                <option key={proj.id} value={proj.name}>{proj.name}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">▼</span>
          </div>
        </div>

        {/* Attached Knowledge Documents Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDocPicker(!showDocPicker)}
            className={`text-xs font-medium py-1.5 px-3 rounded-lg border transition-all flex items-center gap-1.5 ${
              attachedDocsCount > 0
                ? 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-300'
                : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span>📚 Documents RAG</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              attachedDocsCount > 0 ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {attachedDocsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Document Picker Drawer / Tray */}
      {showDocPicker && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Documents disponibles pour l'analyse & RAG :
            </span>
            <span className="text-[11px] text-slate-500">
              Cochez les fichiers que l'IA doit analyser pour cette session
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {availableDocuments.map(doc => {
              const isChecked = (activeContext.documents || []).includes(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDocument(doc.id)}
                  className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-blue-50/80 border-blue-400 text-blue-900 dark:bg-blue-950/50 dark:border-blue-600 dark:text-blue-200 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">
                      {doc.fileType === 'pdf' ? '📕' : doc.fileType === 'docx' ? '📘' : doc.fileType === 'xlsx' ? '📊' : '📄'}
                    </span>
                    <span className="truncate">{doc.title || doc.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="accent-blue-600 rounded-sm ml-2 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
