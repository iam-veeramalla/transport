import React from 'react';
import { ChevronDown, Bot } from 'lucide-react';
import { AIModel } from '../types';

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-200 group"
        aria-label="Select AI model"
      >
        <Bot className="w-5 h-5 text-blue-400" />
        <div className="flex-1 text-left">
          <div className="font-medium text-white">
            {selectedModelData?.name || 'Select Model'}
          </div>
          <div className="text-sm text-gray-300">
            {selectedModelData?.provider}
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                selectedModel === model.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="font-medium text-gray-900">{model.name}</div>
              <div className="text-sm text-gray-600 mb-1">{model.description}</div>
              <div className="flex gap-1 flex-wrap">
                {model.capabilities.slice(0, 3).map((cap) => (
                  <span
                    key={cap}
                    className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};