import React, { useState } from 'react';

export default function ChatMessageItem({
  message,
  agent,
  onFeedback,
  onOpenDocPreview
}) {
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(true);

  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown-like renderer for headlines, bullet points, bold and tables
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Heading 3 / 4
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2.5 mb-1">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      if (line.startsWith('---')) {
        return <hr key={idx} className="my-3 border-slate-200 dark:border-slate-800" />;
      }
      // List items
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 ml-4 list-disc my-0.5 leading-relaxed">
            {renderBoldAndItalics(itemText)}
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s+/.test(line.trim())) {
        const numText = line.trim().replace(/^\d+\.\s+/, '');
        return (
          <div key={idx} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 ml-2 my-1 flex gap-2 leading-relaxed">
            <span className="font-semibold text-orange-600 dark:text-orange-400">{line.trim().match(/^\d+\./)[0]}</span>
            <span>{renderBoldAndItalics(numText)}</span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Standard text line
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed my-1">
          {renderBoldAndItalics(line)}
        </p>
      );
    });
  };

  const renderBoldAndItalics = (text) => {
    // Replace **bold** and *italic*
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-950 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-700 dark:text-slate-300">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className={`flex gap-3 my-4 ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}>
      {/* Assistant Avatar */}
      {isAssistant && (
        <div 
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-base"
          style={{ background: agent?.color ? `${agent.color}20` : '#FF790020', border: `1.5px solid ${agent?.color || '#FF7900'}` }}
        >
          {agent?.icon || '🤖'}
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-xs ${
        isAssistant 
          ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800' 
          : 'bg-orange-600 text-white rounded-br-xs'
      }`}>
        {/* Header with Agent Name / Role */}
        {isAssistant && (
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {agent?.name || 'McCann Assistant IA'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {agent?.role || 'Expert'}
              </span>
            </div>
            {message.createdAt && (
              <span className="text-[10px] text-slate-400">
                {new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={`space-y-1 ${!isAssistant && 'text-white'}`}>
          {isAssistant ? (
            renderFormattedContent(message.content)
          ) : (
            <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}
        </div>

        {/* Sources / Citations list for RAG */}
        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div 
              onClick={() => setShowSources(!showSources)}
              className="flex items-center justify-between cursor-pointer py-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">📑</span>
                <span>Sources documentaires citées ({message.sources.length})</span>
              </div>
              <span className="text-[10px] text-slate-400">{showSources ? '▲ Masquer' : '▼ Afficher'}</span>
            </div>

            {showSources && (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {message.sources.map((src, i) => (
                  <div 
                    key={i}
                    onClick={() => onOpenDocPreview && onOpenDocPreview(src.documentId)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <span>📄</span>
                        <span>{src.title}</span>
                        {src.page && <span className="text-[10px] text-slate-400 font-normal">(Page {src.page})</span>}
                      </div>
                      {src.excerpt && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 line-clamp-2">
                          "{src.excerpt}"
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-blue-600 underline shrink-0 mt-0.5">Consulter</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assistant Bottom Toolbar */}
        {isAssistant && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copier la réponse"
              >
                <span>{copied ? '✓' : '📋'}</span>
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            {/* Like / Dislike Feedback */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onFeedback && onFeedback(message.id, 'positive')}
                className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  message.feedback === 'positive' ? 'text-green-600 bg-green-50 dark:bg-green-950/40' : 'hover:text-green-600'
                }`}
                title="Réponse utile"
              >
                👍
              </button>
              <button
                type="button"
                onClick={() => onFeedback && onFeedback(message.id, 'negative')}
                className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  message.feedback === 'negative' ? 'text-red-600 bg-red-50 dark:bg-red-950/40' : 'hover:text-red-600'
                }`}
                title="À améliorer"
              >
                👎
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
          👤
        </div>
      )}
    </div>
  );
}
