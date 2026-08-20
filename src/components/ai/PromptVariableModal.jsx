import React, { useState, useEffect } from 'react';

export default function PromptVariableModal({ isOpen, onClose, prompt, onApply, activeContext }) {
  const [variables, setVariables] = useState({});
  const [detectedKeys, setDetectedKeys] = useState([]);

  useEffect(() => {
    if (!prompt?.content) return;

    // Detect all {{key}} in prompt.content
    const matches = prompt.content.match(/\{\{([^}]+)\}\}/g) || [];
    const keys = Array.from(new Set(matches.map(m => m.replace(/[{}]/g, '').trim())));
    setDetectedKeys(keys);

    // Provide smart defaults based on activeContext or key name
    const initialVars = {};
    keys.forEach(k => {
      const lower = k.toLowerCase();
      if (lower.includes('brand') || lower.includes('marque')) {
        initialVars[k] = activeContext?.brand || 'Orange Cameroun';
      } else if (lower.includes('campaign') || lower.includes('projet') || lower.includes('campagne')) {
        initialVars[k] = activeContext?.project || 'Campagne Ramadan 2026';
      } else if (lower.includes('audience') || lower.includes('cible')) {
        initialVars[k] = 'Jeunes actifs urbains (18-35 ans), Douala & Yaoundé';
      } else if (lower.includes('objective') || lower.includes('objectif')) {
        initialVars[k] = 'Augmenter l\'adoption des forfaits Data et l\'usage d\'Orange Money';
      } else if (lower.includes('tone') || lower.includes('ton')) {
        initialVars[k] = 'Chaleureux, dynamique, moderne et proche des réalités locales';
      } else {
        initialVars[k] = '';
      }
    });

    setVariables(initialVars);
  }, [prompt, activeContext]);

  if (!isOpen || !prompt) return null;

  const handleInputChange = (key, value) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const getComputedPrompt = () => {
    let result = prompt.content;
    Object.keys(variables).forEach(k => {
      const regex = new RegExp(`\\{\\{${k}\\}\\}`, 'g');
      result = result.replace(regex, variables[k] || `[${k}]`);
    });
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPrompt = getComputedPrompt();
    onApply(finalPrompt, prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Personnaliser le Prompt : {prompt.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{prompt.description}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {detectedKeys.length > 0 ? (
            <div className="space-y-3.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Variables du Template ({detectedKeys.length}) :
              </div>
              {detectedKeys.map(key => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                    {key.replace(/_/g, ' ')} :
                  </label>
                  <input
                    type="text"
                    required
                    value={variables[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={`Entrez la valeur pour ${key}...`}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-300">
              Ce template ne contient pas de variables dynamiques. Vous pouvez l'envoyer directement à l'Assistant IA.
            </div>
          )}

          {/* Live Preview of resulting prompt */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Aperçu du prompt prêt à l'emploi :
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {getComputedPrompt()}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:scale-98 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>🚀 Injecter dans l'Assistant IA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
