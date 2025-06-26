import React from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { ModelSelector } from './components/ModelSelector';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { useChat } from './hooks/useChat';
import { availableModels } from './data/models';

function App() {
  const [selectedModel, setSelectedModel] = React.useState('gpt-4-turbo');
  const { messages, isLoading, sendMessage, clearChat } = useChat(selectedModel);

  // Get the last user message (question)
  const lastUserMessage = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        return messages[i];
      }
    }
    return undefined;
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col max-w-4xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
              <p className="text-sm text-gray-300">Choose your model and start chatting</p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-200"
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </button>
          )}
        </header>

        {/* Model Selection */}
        <div className="mb-6">
          <ModelSelector
            models={availableModels}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex-1 flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          {/* Left Sidebar for Last Question */}
          <div className="w-1/4 bg-white/10 border-r border-white/10 p-4 flex flex-col items-start justify-start">
            <h2 className="text-sm font-semibold text-gray-300 mb-2">Last Question</h2>
            {lastUserMessage ? (
              <div
                className="text-gray-100 text-base break-words"
                dangerouslySetInnerHTML={{ __html: lastUserMessage.content }}
              />
            ) : (
              <div className="text-gray-400 text-sm">No question asked yet.</div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <ChatArea messages={messages} isLoading={isLoading} />
            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              <ChatInput
                onSendMessage={sendMessage}
                disabled={isLoading || !selectedModel}
                placeholder={selectedModel ? "Ask me anything..." : "Select a model to start chatting"}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center text-sm text-gray-400">
          AI Assistant Client v1.0 - Built with React & TypeScript
        </footer>
      </div>
    </div>
  );
}

export default App;
