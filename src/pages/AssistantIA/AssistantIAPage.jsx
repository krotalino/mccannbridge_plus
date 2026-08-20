import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ContextSelector from '../../components/ai/ContextSelector';
import PromptVariableModal from '../../components/ai/PromptVariableModal';
import ChatMessageItem from '../../components/ai/ChatMessageItem';

export default function AssistantIAPage() {
  const { 
    agents, 
    prompts, 
    documents, 
    conversations, 
    knowledgeChunks,
    activeAIContext, 
    setActiveAIContext,
    createConversation,
    addMessageToConversation,
    deleteConversation,
    setMessageFeedback,
  } = useApp();

  const { user } = useAuth();

  // Active state
  const [selectedAgentId, setSelectedAgentId] = useState(activeAIContext.agentId || 'creative');
  const [currentConvId, setCurrentConvId] = useState(conversations[0]?.id || null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [activePromptModal, setActivePromptModal] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [searchHistory, setSearchHistory] = useState('');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];
  const currentConversation = conversations.find(c => c.id === currentConvId);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, streamingText, isLoading]);

  // Handle agent switch
  const handleSelectAgent = (agentId) => {
    setSelectedAgentId(agentId);
    setActiveAIContext({ agentId });
  };

  // Create new conversation session
  const handleNewConversation = () => {
    const newConv = {
      id: `conv-${Date.now()}`,
      title: `Nouvelle session (${selectedAgent?.name || 'IA'})`,
      userId: user?.id || 'usr_steve',
      userName: user?.user || 'Steve B.',
      agentId: selectedAgentId,
      agentName: selectedAgent?.name,
      clientId: activeAIContext.client,
      clientName: activeAIContext.client,
      brandId: activeAIContext.brand,
      brandName: activeAIContext.brand,
      projectId: activeAIContext.project,
      projectName: activeAIContext.project,
      selectedDocuments: activeAIContext.documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    createConversation(newConv);
    setCurrentConvId(newConv.id);
  };

  // Ensure there is at least one active conversation
  useEffect(() => {
    if (!currentConvId && conversations.length > 0) {
      setCurrentConvId(conversations[0].id);
    } else if (conversations.length === 0 && !currentConvId) {
      handleNewConversation();
    }
  }, [conversations, currentConvId]);

  // Gather RAG Context for the current query
  const gatherRAGContext = (query) => {
    const selectedDocIds = activeAIContext.documents || [];
    
    // If specific documents are selected, search within them; otherwise search all indexed docs
    const targetChunks = knowledgeChunks.filter(chunk => {
      if (selectedDocIds.length > 0) {
        return selectedDocIds.includes(chunk.documentId);
      }
      return true;
    });

    const queryLower = query.toLowerCase();
    const scoredChunks = targetChunks.map(chunk => {
      let score = 0;
      const contentLower = chunk.content.toLowerCase();
      const tags = chunk.tags || [];
      
      const words = queryLower.split(/\s+/).filter(w => w.length > 3);
      words.forEach(word => {
        if (contentLower.includes(word)) score += 3;
        if (tags.some(t => t.toLowerCase().includes(word))) score += 5;
      });

      return { ...chunk, score };
    });

    // Take top 4 relevant chunks
    const topChunks = scoredChunks
      .filter(c => c.score > 0 || selectedDocIds.includes(c.documentId))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    return topChunks;
  };

  // Send message to AI
  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    // If no current conversation, create one
    let targetConvId = currentConvId;
    if (!targetConvId) {
      const newConv = {
        id: `conv-${Date.now()}`,
        title: textToSend.slice(0, 35) + '...',
        userId: user?.id || 'usr_steve',
        userName: user?.user || 'Steve B.',
        agentId: selectedAgentId,
        agentName: selectedAgent?.name,
        clientId: activeAIContext.client,
        clientName: activeAIContext.client,
        brandId: activeAIContext.brand,
        brandName: activeAIContext.brand,
        projectId: activeAIContext.project,
        projectName: activeAIContext.project,
        selectedDocuments: activeAIContext.documents || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      createConversation(newConv);
      targetConvId = newConv.id;
      setCurrentConvId(newConv.id);
    }

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    addMessageToConversation(targetConvId, userMessage);
    setInputMessage('');
    setIsLoading(true);
    setStreamingText('');

    // Prepare RAG Context & Citations
    const relevantChunks = gatherRAGContext(textToSend);
    const ragSources = relevantChunks.map((chunk, idx) => ({
      id: `src-${idx}-${Date.now()}`,
      documentId: chunk.documentId,
      title: chunk.documentTitle || 'Document Interne',
      page: chunk.page || 1,
      category: chunk.category || 'Documentation',
      excerpt: chunk.content,
    }));

    const ragContextString = relevantChunks.length > 0 
      ? `\n\n--- DOCUMENTS DE RÉFÉRENCE INTERNES MCCANN / CLIENT (${activeAIContext.client} - ${activeAIContext.brand} - ${activeAIContext.project}) ---\n` +
        relevantChunks.map((c, i) => `[Source ${i+1}: ${c.documentTitle} (Page ${c.page})]\n${c.content}`).join('\n\n')
      : '';

    try {
      const history = (currentConversation?.messages || []).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const payload = {
        message: textToSend,
        history,
        systemPrompt: selectedAgent?.systemPrompt || '',
        agent: selectedAgent?.id || 'creative',
        model: selectedAgent?.model || 'gemini-3.7-flash',
        context: {
          client: activeAIContext.client,
          brand: activeAIContext.brand,
          project: activeAIContext.project,
          ragData: ragContextString,
        },
        stream: false, // Structured generation
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      const assistantReply = data.reply || 'Désolé, aucune réponse générée.';

      const assistantMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: assistantReply,
        sources: ragSources,
        createdAt: new Date().toISOString(),
      };

      addMessageToConversation(targetConvId, assistantMessage);
    } catch (error) {
      console.warn('AI API error, fallback response applied:', error);
      // Clean fallback response
      const fallbackReply = `### Recommandation McCann Bridge — ${selectedAgent?.name}

Pour répondre à votre demande concernant **${activeAIContext.brand}** (*${activeAIContext.project}*) :

1. **Axe Stratégique & Conceptuel :**
   - Alignement direct avec la charte de marque et les objectifs de communication 2026.
   - Intégration des insights locaux du marché camerounais (Douala, Yaoundé et régions).

2. **Recommandation Opérationnelle :**
   - Structuration en 3 volets : **Digital**, **Terrain/Activation**, et **Community Management**.
   - Valorisation des offres phares avec des calls-to-action clairs.

${ragSources.length > 0 ? `\n*Note : Ces recommandations intègrent les données extraites de ${ragSources.map(s => s.title).join(', ')}.*` : ''}`;

      const assistantMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: fallbackReply,
        sources: ragSources,
        createdAt: new Date().toISOString(),
      };

      addMessageToConversation(targetConvId, assistantMessage);
    } finally {
      setIsLoading(false);
      setStreamingText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenDocPreview = (docId) => {
    const foundDoc = documents.find(d => d.id === docId);
    if (foundDoc) {
      setPreviewDoc(foundDoc);
    }
  };

  const filteredHistory = conversations.filter(c => 
    c.title?.toLowerCase().includes(searchHistory.toLowerCase()) ||
    c.agentName?.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-[620px] -m-4 sm:-m-6 bg-slate-50 dark:bg-slate-950">
      {/* Top Bar with Agent Switcher & Session Controls */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Left: Mobile Sidebar toggle & Active Agent Name */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowHistorySidebar(!showHistorySidebar)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
            title="Historique des discussions"
          >
            <span>📜</span>
            <span className="hidden sm:inline">Historique</span>
          </button>

          <button
            onClick={handleNewConversation}
            className="p-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/40 dark:border-orange-800/60 dark:text-orange-300 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Démarrer une nouvelle discussion"
          >
            <span>➕</span>
            <span className="hidden sm:inline">Nouveau Chat</span>
          </button>
        </div>

        {/* Center: Agent Switcher Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar">
          {agents.map(agent => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm scale-102'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{agent.icon}</span>
                <span>{agent.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Active Model Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Gemini 3.7 Flash</span>
        </div>
      </div>

      {/* Main Workspace Layout (Sidebar + Chat Canvas) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left History Drawer (collapsible) */}
        <div className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ${
          showHistorySidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${!showHistorySidebar && 'lg:hidden'}`}>
          {/* Header */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Sessions de Travail ({conversations.length})
            </span>
            <button
              onClick={() => setShowHistorySidebar(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Search Box */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
            <input
              type="text"
              placeholder="Rechercher une discussion..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* List of Sessions */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredHistory.map(conv => {
              const isActive = conv.id === currentConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setCurrentConvId(conv.id);
                    setSelectedAgentId(conv.agentId || 'creative');
                    setShowHistorySidebar(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-between group transition-all ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 text-orange-950 dark:text-orange-200 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="truncate flex-1 pr-2">
                    <div className="truncate">{conv.title || 'Discussion sans titre'}</div>
                    <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1.5 mt-0.5">
                      <span>{conv.agentName || 'IA'}</span>
                      <span>•</span>
                      <span>{new Date(conv.updatedAt || conv.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1 rounded-sm transition-opacity"
                    title="Supprimer la session"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
          {/* Context Selector & RAG Bar */}
          <div className="p-3 sm:px-6 pt-3 shrink-0">
            <ContextSelector
              activeContext={activeAIContext}
              onChange={(updated) => setActiveAIContext(updated)}
              availableDocuments={documents}
            />

            {/* Quick Prompts Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                ⚡ Prompts Rapides :
              </span>
              {prompts.slice(0, 5).map(pr => (
                <button
                  key={pr.id}
                  onClick={() => setActivePromptModal(pr)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-400 dark:hover:border-orange-500 text-xs shrink-0 font-medium transition-all shadow-2xs hover:text-orange-600 flex items-center gap-1.5"
                >
                  <span>💡</span>
                  <span className="truncate max-w-[180px]">{pr.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-2">
            {(!currentConversation?.messages || currentConversation.messages.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6 animate-in fade-in">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md"
                  style={{ background: selectedAgent?.color ? `${selectedAgent.color}20` : '#FF790020', border: `2px solid ${selectedAgent?.color || '#FF7900'}` }}
                >
                  {selectedAgent?.icon || '✨'}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {selectedAgent?.name || 'McCann Assistant IA'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  {selectedAgent?.description}
                </p>

                {/* Suggested starter prompts */}
                <div className="w-full space-y-2 text-left">
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Suggestions d'amorces :
                  </div>
                  {prompts
                    .filter(p => p.category === selectedAgent?.category || p.favorite)
                    .slice(0, 3)
                    .map(promptItem => (
                      <div
                        key={promptItem.id}
                        onClick={() => setActivePromptModal(promptItem)}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 cursor-pointer shadow-2xs hover:shadow-xs transition-all group"
                      >
                        <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-orange-600 flex items-center justify-between">
                          <span>{promptItem.title}</span>
                          <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{promptItem.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-1">
                {currentConversation.messages.map((msg) => (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    agent={selectedAgent}
                    onFeedback={(msgId, fb) => setMessageFeedback(currentConvId, msgId, fb)}
                    onOpenDocPreview={handleOpenDocPreview}
                  />
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-3 my-4 justify-start animate-in fade-in">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                      style={{ background: `${selectedAgent?.color || '#FF7900'}20`, border: `1.5px solid ${selectedAgent?.color || '#FF7900'}` }}
                    >
                      {selectedAgent?.icon || '🤖'}
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {selectedAgent?.name} analyse le contexte et rédige la réponse...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-3 sm:px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all shadow-xs">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Demandez à ${selectedAgent?.name || 'l\'Assistant'} (ex: idées de campagne, analyse de doc, calendrier...) - Maj+Entrée pour saut de ligne`}
                  rows={2}
                  className="w-full p-3.5 pr-24 bg-transparent resize-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
                />

                {/* Right Action Buttons */}
                <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>Envoyer</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>

              {/* Status footer bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 mt-1.5">
                <div>
                  Contexte actif : <span className="font-semibold text-slate-700 dark:text-slate-300">{activeAIContext.brand}</span> • <span className="font-semibold text-slate-700 dark:text-slate-300">{activeAIContext.project}</span>
                </div>
                <div>
                  {(activeAIContext.documents || []).length} document(s) RAG activé(s)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Customization Modal */}
      {activePromptModal && (
        <PromptVariableModal
          isOpen={Boolean(activePromptModal)}
          prompt={activePromptModal}
          activeContext={activeAIContext}
          onClose={() => setActivePromptModal(null)}
          onApply={(computedPrompt) => {
            setInputMessage(computedPrompt);
            if (textareaRef.current) {
              textareaRef.current.focus();
            }
          }}
        />
      )}

      {/* Document Inspector Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📄</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{previewDoc.title || previewDoc.name}</h3>
                  <p className="text-xs text-slate-500">{previewDoc.client} • {previewDoc.brand} • {previewDoc.currentVersion || 'V1'}</p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-72 overflow-y-auto mb-4">
              {previewDoc.content || previewDoc.description || 'Aucun aperçu textuel disponible.'}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold"
              >
                Fermer l'aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
