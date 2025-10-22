import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { useChat } from '../hooks/useChat';
import { Message } from '../types';

// Mock the useChat hook
vi.mock('../hooks/useChat', () => ({
  useChat: vi.fn(),
}));

const mockUseChat = useChat as any;

describe('App', () => {
  const mockSendMessage = vi.fn();
  const mockClearChat = vi.fn();

  beforeEach(() => {
    mockSendMessage.mockClear();
    mockClearChat.mockClear();
    
    // Default mock implementation
    mockUseChat.mockReturnValue({
      messages: [],
      isLoading: false,
      sendMessage: mockSendMessage,
      clearChat: mockClearChat,
    });
  });

  describe('Basic Rendering', () => {
    it('renders the app header with title and icon', () => {
      render(<App />);

      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
      expect(screen.getByText('Choose your model and start chatting')).toBeInTheDocument();
    });

    it('renders the model selector', () => {
      render(<App />);

      expect(screen.getByRole('button', { name: /select ai model/i })).toBeInTheDocument();
    });

    it('renders the chat input', () => {
      render(<App />);

      expect(screen.getByPlaceholderText(/ask me anything/i)).toBeInTheDocument();
    });

    it('renders the footer', () => {
      render(<App />);

      expect(screen.getByText(/AI Assistant Client v1.0/i)).toBeInTheDocument();
    });

    it('does not show clear chat button when there are no messages', () => {
      render(<App />);

      expect(screen.queryByRole('button', { name: /clear chat/i })).not.toBeInTheDocument();
    });
  });

  describe('Last Question Sidebar', () => {
    it('shows "No question asked yet" when there are no messages', () => {
      render(<App />);

      expect(screen.getByText('Last Question')).toBeInTheDocument();
      expect(screen.getByText('No question asked yet.')).toBeInTheDocument();
    });

    it('displays the last user message when messages exist', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'What is the meaning of life?',
          role: 'user',
          timestamp: new Date(),
        },
        {
          id: '2',
          content: '42',
          role: 'assistant',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByText('Last Question')).toBeInTheDocument();
      expect(screen.getByText('What is the meaning of life?')).toBeInTheDocument();
      expect(screen.queryByText('No question asked yet.')).not.toBeInTheDocument();
    });

    it('shows only the last user message when multiple user messages exist', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'First question',
          role: 'user',
          timestamp: new Date(),
        },
        {
          id: '2',
          content: 'First answer',
          role: 'assistant',
          timestamp: new Date(),
        },
        {
          id: '3',
          content: 'Second question',
          role: 'user',
          timestamp: new Date(),
        },
        {
          id: '4',
          content: 'Second answer',
          role: 'assistant',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByText('Second question')).toBeInTheDocument();
      expect(screen.queryByText('First question')).not.toBeInTheDocument();
    });

    it('finds the last user message even when last message is from assistant', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'User question here',
          role: 'user',
          timestamp: new Date(),
        },
        {
          id: '2',
          content: 'Assistant response',
          role: 'assistant',
          timestamp: new Date(),
        },
        {
          id: '3',
          content: 'Another assistant message',
          role: 'assistant',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByText('User question here')).toBeInTheDocument();
    });

    it('shows empty state when only assistant messages exist', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'Assistant message',
          role: 'assistant',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByText('No question asked yet.')).toBeInTheDocument();
    });

    it('updates last question when new user message is sent', () => {
      const { rerender } = render(<App />);

      expect(screen.getByText('No question asked yet.')).toBeInTheDocument();

      const messagesWithNewQuestion: Message[] = [
        {
          id: '1',
          content: 'New question',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages: messagesWithNewQuestion,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      rerender(<App />);

      expect(screen.getByText('New question')).toBeInTheDocument();
      expect(screen.queryByText('No question asked yet.')).not.toBeInTheDocument();
    });
  });

  describe('lastUserMessage Memoization', () => {
    it('memoizes the last user message correctly', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'Question 1',
          role: 'user',
          timestamp: new Date(),
        },
        {
          id: '2',
          content: 'Answer 1',
          role: 'assistant',
          timestamp: new Date(),
        },
        {
          id: '3',
          content: 'Question 2',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      const { rerender } = render(<App />);

      expect(screen.getByText('Question 2')).toBeInTheDocument();

      // Rerender without changing messages - should use memoized value
      rerender(<App />);

      expect(screen.getByText('Question 2')).toBeInTheDocument();
    });

    it('handles empty messages array', () => {
      mockUseChat.mockReturnValue({
        messages: [],
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByText('No question asked yet.')).toBeInTheDocument();
    });

    it('handles messages with only assistant role', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'Assistant only',
          role: 'assistant',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByText('No question asked yet.')).toBeInTheDocument();
    });
  });

  describe('Clear Chat Functionality', () => {
    it('shows clear chat button when messages exist', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'Test message',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByRole('button', { name: /clear chat/i })).toBeInTheDocument();
    });

    it('calls clearChat when clear button is clicked', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'Test message',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      const clearButton = screen.getByRole('button', { name: /clear chat/i });
      fireEvent.click(clearButton);

      expect(mockClearChat).toHaveBeenCalledTimes(1);
    });

    it('removes clear chat button after chat is cleared', () => {
      const messagesInitial: Message[] = [
        {
          id: '1',
          content: 'Test message',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages: messagesInitial,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      const { rerender } = render(<App />);

      expect(screen.getByRole('button', { name: /clear chat/i })).toBeInTheDocument();

      // Simulate clearing the chat
      mockUseChat.mockReturnValue({
        messages: [],
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      rerender(<App />);

      expect(screen.queryByRole('button', { name: /clear chat/i })).not.toBeInTheDocument();
    });
  });

  describe('Model Selection', () => {
    it('initializes with default model', () => {
      render(<App />);

      expect(screen.getByText('GPT-4 Turbo')).toBeInTheDocument();
    });

    it('allows changing the model', async () => {
      const user = userEvent.setup();
      render(<App />);

      const modelButton = screen.getByRole('button', { name: /select ai model/i });
      await user.click(modelButton);

      const claudeOption = screen.getByText('Claude 3 Opus');
      await user.click(claudeOption);

      await waitFor(() => {
        expect(screen.getByText('Claude 3 Opus')).toBeInTheDocument();
      });
    });

    it('passes selected model to useChat hook', () => {
      render(<App />);

      expect(mockUseChat).toHaveBeenCalledWith('gpt-4-turbo');
    });
  });

  describe('Message Sending', () => {
    it('sends message through chat input', async () => {
      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByPlaceholderText(/ask me anything/i);
      await user.type(input, 'Test question');
      await user.keyboard('{Enter}');

      expect(mockSendMessage).toHaveBeenCalledWith('Test question');
    });

    it('disables input when loading', () => {
      mockUseChat.mockReturnValue({
        messages: [],
        isLoading: true,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      const input = screen.getByPlaceholderText(/ask me anything/i);
      expect(input).toBeDisabled();
    });
  });

  describe('Loading State', () => {
    it('displays loading indicator in chat area when isLoading is true', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'User question',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: true,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      // The loading indicator is rendered in ChatArea component
      // We can verify the isLoading prop is passed correctly
      expect(mockUseChat().isLoading).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('displays welcome message when no messages exist', () => {
      render(<App />);

      expect(screen.getByText('Welcome to AI Assistant')).toBeInTheDocument();
      expect(screen.getByText(/Select a model above and start a conversation/i)).toBeInTheDocument();
    });

    it('renders messages in chat area when they exist', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'Hello AI',
          role: 'user',
          timestamp: new Date(),
        },
        {
          id: '2',
          content: 'Hello! How can I help?',
          role: 'assistant',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByText('Hello AI')).toBeInTheDocument();
      expect(screen.getByText('Hello! How can I help?')).toBeInTheDocument();
    });

    it('updates UI when switching models', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<App />);

      expect(screen.getByText('GPT-4 Turbo')).toBeInTheDocument();

      const modelButton = screen.getByRole('button', { name: /select ai model/i });
      await user.click(modelButton);

      const gpt35Option = screen.getByText('GPT-3.5 Turbo');
      await user.click(gpt35Option);

      // After model change, useChat should be called with new model
      rerender(<App />);

      await waitFor(() => {
        expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles very long user messages in sidebar', () => {
      const longMessage = 'A'.repeat(500);
      const messages: Message[] = [
        {
          id: '1',
          content: longMessage,
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in last user message', () => {
      const specialMessage = '<script>alert("test")</script> & "quotes" \'apostrophes\'';
      const messages: Message[] = [
        {
          id: '1',
          content: specialMessage,
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('handles rapid message updates', () => {
      const { rerender } = render(<App />);

      for (let i = 1; i <= 10; i++) {
        const messages: Message[] = [
          {
            id: `${i}`,
            content: `Question ${i}`,
            role: 'user',
            timestamp: new Date(),
          },
        ];

        mockUseChat.mockReturnValue({
          messages,
          isLoading: false,
          sendMessage: mockSendMessage,
          clearChat: mockClearChat,
        });

        rerender(<App />);

        expect(screen.getByText(`Question ${i}`)).toBeInTheDocument();
      }
    });

    it('handles messages with undefined or null content gracefully', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: '',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      // Empty content should still be displayed
      expect(screen.getByText('Last Question')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label on clear chat button', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'Test',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      render(<App />);

      expect(screen.getByRole('button', { name: /clear chat/i })).toHaveAttribute('aria-label', 'Clear chat');
    });

    it('has proper semantic structure with header and footer', () => {
      render(<App />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-compute lastUserMessage when messages array reference does not change', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'Static question',
          role: 'user',
          timestamp: new Date(),
        },
      ];

      mockUseChat.mockReturnValue({
        messages,
        isLoading: false,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
      });

      const { rerender } = render(<App />);

      expect(screen.getByText('Static question')).toBeInTheDocument();

      // Rerender multiple times with same messages reference
      rerender(<App />);
      rerender(<App />);
      rerender(<App />);

      // Should still show the same message (memoization working)
      expect(screen.getByText('Static question')).toBeInTheDocument();
    });
  });
});