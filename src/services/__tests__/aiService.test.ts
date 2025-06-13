import { AIService } from '../aiService';
import { Message } from '../../types';

describe('AIService', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      content: 'Hello',
      role: 'user',
      timestamp: new Date(),
    },
  ];

  it('generates response for code-related queries', async () => {
    const codeMessages: Message[] = [
      {
        id: '1',
        content: 'Can you help me write some code?',
        role: 'user',
        timestamp: new Date(),
      },
    ];

    const response = await AIService.generateResponse(codeMessages, 'gpt-4-turbo');

    expect(response).toContain('code example');
    expect(response).toContain('```python');
    expect(response).toContain('gpt-4-turbo');
  });

  it('generates help response for help queries', async () => {
    const helpMessages: Message[] = [
      {
        id: '1',
        content: 'I need help with something',
        role: 'user',
        timestamp: new Date(),
      },
    ];

    const response = await AIService.generateResponse(helpMessages, 'claude-3-opus');

    expect(response).toContain('I\'m here to help');
    expect(response).toContain('Programming and software development');
  });

  it('generates generic response for other queries', async () => {
    const response = await AIService.generateResponse(mockMessages, 'gpt-4-turbo');

    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
    expect(response).toContain('gpt-4-turbo');
  });

  it('includes model name in response', async () => {
    const response = await AIService.generateResponse(mockMessages, 'claude-3-sonnet');

    expect(response).toContain('claude-3-sonnet');
  });

  it('simulates realistic response time', async () => {
    const startTime = Date.now();
    await AIService.generateResponse(mockMessages, 'gpt-4-turbo');
    const endTime = Date.now();

    const responseTime = endTime - startTime;
    expect(responseTime).toBeGreaterThan(1000); // At least 1 second
    expect(responseTime).toBeLessThan(4000); // Less than 4 seconds
  });
});