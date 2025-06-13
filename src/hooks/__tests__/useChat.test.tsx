import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat } from '../useChat';
import { AIService } from '../../services/aiService';

// Mock the AI service
vi.mock('../../services/aiService', () => ({
  AIService: {
    generateResponse: vi.fn(),
  },
}));

const mockAIService = AIService as any;

describe('useChat', () => {
  beforeEach(() => {
    mockAIService.generateResponse.mockClear();
    // Mock window.alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with empty messages', () => {
    const { result } = renderHook(() => useChat('gpt-4-turbo'));

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('sends message and receives response', async () => {
    mockAIService.generateResponse.mockResolvedValue('AI response');

    const { result } = renderHook(() => useChat('gpt-4-turbo'));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].content).toBe('Hello');
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[1].content).toBe('AI response');
      expect(result.current.messages[1].role).toBe('assistant');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('shows loading state while generating response', async () => {
    mockAIService.generateResponse.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve('AI response'), 100))
    );

    const { result } = renderHook(() => useChat('gpt-4-turbo'));

    act(() => {
      result.current.sendMessage('Hello');
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('handles errors gracefully', async () => {
    mockAIService.generateResponse.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useChat('gpt-4-turbo'));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[1].content).toContain('Sorry, I encountered an error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('alerts when no model is selected', async () => {
    const { result } = renderHook(() => useChat(''));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(window.alert).toHaveBeenCalledWith('Please select a model first');
    expect(result.current.messages).toHaveLength(0);
  });

  it('clears chat messages', () => {
    const { result } = renderHook(() => useChat('gpt-4-turbo'));

    act(() => {
      result.current.sendMessage('Hello');
    });

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toEqual([]);
  });
});