import { render, screen, fireEvent } from '@testing-library/react';
import { ModelSelector } from '../ModelSelector';
import { availableModels } from '../../data/models';

const mockOnModelChange = vi.fn();

describe('ModelSelector', () => {
  beforeEach(() => {
    mockOnModelChange.mockClear();
  });

  it('renders with selected model', () => {
    render(
      <ModelSelector
        models={availableModels}
        selectedModel="gpt-4-turbo"
        onModelChange={mockOnModelChange}
      />
    );

    expect(screen.getByText('GPT-4 Turbo')).toBeInTheDocument();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(
      <ModelSelector
        models={availableModels}
        selectedModel="gpt-4-turbo"
        onModelChange={mockOnModelChange}
      />
    );

    const button = screen.getByRole('button', { name: /select ai model/i });
    fireEvent.click(button);

    expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
    expect(screen.getByText('Claude 3 Opus')).toBeInTheDocument();
  });

  it('calls onModelChange when a model is selected', () => {
    render(
      <ModelSelector
        models={availableModels}
        selectedModel="gpt-4-turbo"
        onModelChange={mockOnModelChange}
      />
    );

    const button = screen.getByRole('button', { name: /select ai model/i });
    fireEvent.click(button);

    const claudeOption = screen.getByText('Claude 3 Opus');
    fireEvent.click(claudeOption);

    expect(mockOnModelChange).toHaveBeenCalledWith('claude-3-opus');
  });

  it('displays model capabilities', () => {
    render(
      <ModelSelector
        models={availableModels}
        selectedModel="gpt-4-turbo"
        onModelChange={mockOnModelChange}
      />
    );

    const button = screen.getByRole('button', { name: /select ai model/i });
    fireEvent.click(button);

    expect(screen.getByText('Text Generation')).toBeInTheDocument();
    expect(screen.getByText('Code Analysis')).toBeInTheDocument();
  });
});