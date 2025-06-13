import { AIModel } from '../types';

export const availableModels: AIModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Most capable model for complex reasoning and analysis',
    provider: 'OpenAI',
    capabilities: ['Text Generation', 'Code Analysis', 'Mathematical Reasoning', 'Creative Writing']
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most conversational tasks',
    provider: 'OpenAI',
    capabilities: ['Text Generation', 'Basic Coding', 'Q&A', 'Summarization']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Excellent for analysis, math, and creative tasks',
    provider: 'Anthropic',
    capabilities: ['Advanced Analysis', 'Creative Writing', 'Code Review', 'Research']
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance for everyday tasks',
    provider: 'Anthropic',
    capabilities: ['Text Generation', 'Code Help', 'Analysis', 'Writing']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s advanced multimodal AI model',
    provider: 'Google',
    capabilities: ['Text Generation', 'Multimodal', 'Code Generation', 'Reasoning']
  }
];