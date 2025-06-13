import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '../ChatInput';

const mockOnSendMessage = vi.fn();

describe('ChatInput', () => {
  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it('renders input field and send button', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('calls onSendMessage when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send message/i });

    await user.type(input, 'Hello, AI!');
    await user.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello, AI!');
  });

  it('sends message on Enter key press', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText('Type your message...');

    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('does not send message on Shift+Enter', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText('Type your message...');

    await user.type(input, 'Test message');
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send message/i });

    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it('clears input after sending message', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText('Type your message...') as HTMLTextAreaElement;

    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('does not send empty or whitespace-only messages', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText('Type your message...');

    // Try to send empty message
    await user.keyboard('{Enter}');
    expect(mockOnSendMessage).not.toHaveBeenCalled();

    // Try to send whitespace-only message
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });
});