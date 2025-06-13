import { render, screen, fireEvent } from '@testing-library/react';
import { MessageBubble } from '../MessageBubble';
import { Message } from '../../types';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

const mockUserMessage: Message = {
  id: '1',
  content: 'Hello, how are you?',
  role: 'user',
  timestamp: new Date(),
};

const mockAssistantMessage: Message = {
  id: '2',
  content: 'I am doing well, thank you for asking!',
  role: 'assistant',
  timestamp: new Date(),
  model: 'gpt-4-turbo',
};

describe('MessageBubble', () => {
  it('renders user message correctly', () => {
    render(<MessageBubble message={mockUserMessage} />);

    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    // User messages should not have copy button
    expect(screen.queryByLabelText(/copy message/i)).not.toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    render(<MessageBubble message={mockAssistantMessage} />);

    expect(screen.getByText('I am doing well, thank you for asking!')).toBeInTheDocument();
    // Assistant messages should have copy button (visible on hover)
    expect(screen.getByLabelText(/copy message/i)).toBeInTheDocument();
  });

  it('copies message content to clipboard when copy button is clicked', async () => {
    render(<MessageBubble message={mockAssistantMessage} />);

    const copyButton = screen.getByLabelText(/copy message/i);
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'I am doing well, thank you for asking!'
    );
  });

  it('shows different icons for user and assistant messages', () => {
    const { rerender } = render(<MessageBubble message={mockUserMessage} />);
    
    // Check for user icon (User component from lucide-react)
    expect(document.querySelector('[data-lucide="user"]')).toBeInTheDocument();

    rerender(<MessageBubble message={mockAssistantMessage} />);
    
    // Check for bot icon (Bot component from lucide-react)
    expect(document.querySelector('[data-lucide="bot"]')).toBeInTheDocument();
  });

  it('applies correct styling for user vs assistant messages', () => {
    const { rerender } = render(<MessageBubble message={mockUserMessage} />);
    
    let messageContent = screen.getByText('Hello, how are you?').closest('div');
    expect(messageContent).toHaveClass('bg-blue-500');

    rerender(<MessageBubble message={mockAssistantMessage} />);
    
    messageContent = screen.getByText('I am doing well, thank you for asking!').closest('div');
    expect(messageContent).toHaveClass('bg-white/90');
  });
});