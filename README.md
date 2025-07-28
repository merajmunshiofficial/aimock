# AI Mock Interview Platform

A comprehensive frontend-based AI Mock Interview Platform built with React that provides an interactive interview experience with AI-powered question generation, evaluation, and recording capabilities.

## 🚀 Features

### Core Features
- **AI-Powered Interviews**: Integration with OpenAI GPT-3.5 Turbo and Perplexity Sonar models
- **Authentication**: Secure Auth0 integration for user management
- **Audio/Video Recording**: Full interview recording with webcam and microphone
- **Speech Integration**: Text-to-speech and speech-to-text capabilities
- **Code Editor**: Monaco Editor integration for coding interviews
- **Study Materials**: Question banks, MCQs, and tutorials for different tech stacks

### Interview Types
- Single Tech Stack Interview
- Mixed Tech Stack Interview
- Custom Profile Interview
- Sequential or Random question modes

### Recording Capabilities
- Webcam recording with react-webcam
- Audio recording with microphone integration
- Screen recording for coding interviews
- Auto-download recordings after completion

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Routing**: React Router v6
- **Authentication**: Auth0
- **AI Integration**: OpenAI GPT-3.5 Turbo, Perplexity Sonar
- **State Management**: React Context API
- **Recording**: react-webcam, react-mic-recorder
- **Speech**: react-speech-kit
- **Code Editor**: Monaco Editor
- **Markdown**: react-markdown
- **Deployment**: GitHub Pages

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Auth0 account
- OpenAI API key
- Perplexity API key (optional)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-mock-interview-platform.git
   cd ai-mock-interview-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your actual values:
   ```env
   # OpenAI Configuration
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

   # Perplexity Configuration (Optional)
   REACT_APP_PERPLEXITY_API_KEY=your_perplexity_api_key_here

   # Auth0 Configuration
   REACT_APP_AUTH0_DOMAIN=your_auth0_domain.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
   REACT_APP_AUTH0_AUDIENCE=your_auth0_audience

   # Application Configuration
   REACT_APP_API_BASE_URL=http://localhost:3000
   REACT_APP_ENVIRONMENT=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## 🔑 Auth0 Setup

1. Create an Auth0 account at [auth0.com](https://auth0.com)
2. Create a new Single Page Application
3. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Copy your Domain and Client ID to the `.env` file

## 🤖 AI API Setup

### OpenAI Setup
1. Create an account at [OpenAI](https://openai.com)
2. Generate an API key from the API section
3. Add the key to your `.env` file

### Perplexity Setup (Optional)
1. Create an account at [Perplexity](https://perplexity.ai)
2. Generate an API key
3. Add the key to your `.env` file

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/                 # Authentication components
│   ├── Common/              # Shared components
│   ├── Dashboard/           # Dashboard and study materials
│   ├── Interview/           # Interview flow components
│   └── Recording/           # Recording management
├── contexts/                # React contexts
├── services/               # API and utility services
├── types/                  # TypeScript type definitions
├── data/                   # Static data files
└── styles/                 # Additional styles
```

## 🎯 Usage

### Starting an Interview
1. Sign in with Auth0
2. Complete your profile setup
3. Choose interview type and preferences
4. Start the AI-powered interview session
5. Receive real-time feedback and evaluation

### Study Materials
- Browse question banks by tech stack
- Practice with MCQs
- Read comprehensive tutorials
- Search across all content

### Recording Management
- View all your interview recordings
- Download recordings in various formats
- Manage storage and playback

## 🚀 Deployment

### GitHub Pages Deployment

1. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/ai-mock-interview-platform"
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Environment Variables for Production
Make sure to update your Auth0 settings for production:
- **Allowed Callback URLs**: `https://yourusername.github.io/ai-mock-interview-platform`
- **Allowed Logout URLs**: `https://yourusername.github.io/ai-mock-interview-platform`
- **Allowed Web Origins**: `https://yourusername.github.io/ai-mock-interview-platform`

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Customization

### Themes
The application supports light/dark themes using DaisyUI. Themes can be customized in `tailwind.config.js`.

### Question Banks
Add new question banks by creating JSON files in `src/data/questions/` following the established schema.

### AI Models
Switch between OpenAI and Perplexity models using the AI service configuration.

## 🐛 Troubleshooting

### Common Issues

1. **Auth0 Configuration Error**
   - Verify your Auth0 domain and client ID
   - Check callback URLs match your deployment URL

2. **API Key Issues**
   - Ensure API keys are correctly set in environment variables
   - Check API key permissions and quotas

3. **Recording Issues**
   - Grant microphone and camera permissions
   - Check browser compatibility for MediaRecorder API

4. **Build Issues**
   - Clear node_modules and reinstall dependencies
   - Check for TypeScript errors

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-3.5 Turbo API
- Auth0 for authentication services
- DaisyUI for beautiful UI components
- React community for excellent libraries

## 📞 Support

For support, please open an issue on GitHub or contact [your-email@example.com](mailto:your-email@example.com).

---

**Happy Interviewing! 🎯**
