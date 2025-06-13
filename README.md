# AI Assistant Client

A beautiful, production-ready AI assistant client built with React, TypeScript, and Tailwind CSS. This application provides an intuitive interface for interacting with various large language models through a modern chat interface.

## 🌟 Features

- **Multi-Model Support**: Choose from various AI models including GPT-4, Claude 3, and Gemini Pro
- **Modern Chat Interface**: Clean, responsive design with message bubbles and real-time updates
- **Copy Functionality**: Easily copy AI responses to clipboard
- **Model Information**: Detailed descriptions and capabilities for each AI model
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: Graceful error handling with user-friendly messages
- **TypeScript**: Full type safety throughout the application
- **Comprehensive Testing**: Unit tests with React Testing Library and Vitest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-assistant-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChatArea.tsx    # Main chat display area
│   ├── ChatInput.tsx   # Message input component
│   ├── MessageBubble.tsx # Individual message display
│   └── ModelSelector.tsx # AI model selection dropdown
├── data/               # Static data and configurations
│   └── models.ts       # Available AI models configuration
├── hooks/              # Custom React hooks
│   └── useChat.ts      # Chat state management hook
├── services/           # External service integrations
│   └── aiService.ts    # AI API service (mock implementation)
├── test/               # Test configuration and setup
│   └── setup.ts        # Test environment setup
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces and types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Design System

The application uses a carefully crafted design system with:

- **Color Palette**: 
  - Primary: Blue (#3B82F6)
  - Secondary: Indigo (#6366F1) 
  - Accent: Emerald (#10B981)
  - Status colors for success, warning, and error states

- **Typography**: Optimized font hierarchy with proper spacing
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and micro-interactions
- **Glass Morphism**: Modern translucent effects with backdrop blur

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Component testing with React Testing Library
- **Type Safety**: Full TypeScript coverage
- **Test Coverage**: Detailed coverage reporting
- **Mock Services**: Isolated testing with service mocks

Run tests:
```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🔧 Configuration

### Adding New AI Models

To add support for new AI models, update the `src/data/models.ts` file:

```typescript
export const availableModels: AIModel[] = [
  // ... existing models
  {
    id: 'new-model-id',
    name: 'New Model Name',
    description: 'Model description',
    provider: 'Provider Name',
    capabilities: ['Capability 1', 'Capability 2']
  }
];
```

### Integrating Real AI APIs

The current implementation uses a mock AI service. To integrate with real AI APIs:

1. Update `src/services/aiService.ts` with actual API endpoints
2. Add API keys to environment variables
3. Implement proper error handling and rate limiting
4. Update the response parsing logic

Example integration:
```typescript
// src/services/aiService.ts
export class AIService {
  static async generateResponse(messages: Message[], model: string): Promise<string> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_API_KEY}`
      },
      body: JSON.stringify({ messages, model })
    });
    
    const data = await response.json();
    return data.content;
  }
}
```

## 🚀 Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Traditional web hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'Add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the documentation above
2. Review existing issues in the GitHub repository
3. Create a new issue if your problem isn't already documented

## 🔮 Future Enhancements

- [ ] Real AI API integrations (OpenAI, Anthropic, Google)
- [ ] Chat history persistence
- [ ] Export chat conversations
- [ ] Custom model configuration
- [ ] Voice input/output
- [ ] File upload support
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Advanced formatting options
- [ ] Plugin system for extensions