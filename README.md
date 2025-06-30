# 🎵 Music- AI-Powered Music Recommendation System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2+-green.svg)](https://djangoproject.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.13+-orange.svg)](https://tensorflow.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)

> **An intelligent music recommendation system that analyzes your emotions through AI and suggests personalized music from Spotify to match your mood.**

## 🌟 Overview

Moodify is a cutting-edge, full-stack web application that combines artificial intelligence, emotion detection, and music streaming to create a personalized music discovery experience. Using advanced machine learning algorithms, the app analyzes user emotions through multiple input methods and provides tailored music recommendations via the Spotify API.

### ✨ Key Features

- **🤖 AI-Powered Emotion Detection** - TensorFlow-based emotion recognition from text and images
- **🎵 Spotify Integration** - Seamless access to millions of songs and playlists
- **📱 Progressive Web App (PWA)** - Install and use like a native mobile app
- **🎨 Modern UI/UX** - Glassmorphism design with responsive Bootstrap components
- **🔐 Secure Authentication** - JWT-based user authentication and session management
- **📊 Mood Analytics** - Track your emotional patterns and music preferences
- **🌍 International Ready** - Professional documentation and code standards
- **⚡ Real-time Recommendations** - Instant music suggestions based on detected mood

## 🏗️ Architecture

### Technology Stack

#### Frontend (React.js)
- **React 18.3.1** - Modern component-based UI framework
- **Bootstrap 5.3.3** - Responsive design and UI components
- **TailwindCSS 4.1.7** - Utility-first CSS framework
- **Axios 1.7.3** - HTTP client for API communication
- **HTML2Canvas & jsPDF** - Export functionality for mood reports

#### Backend (Django)
- **Django 4.2+** - Robust web framework
- **Django REST Framework** - API development and serialization
- **TensorFlow 2.13+** - Machine learning and emotion detection
- **PostgreSQL/SQLite** - Database management
- **JWT Authentication** - Secure user sessions

#### APIs & Services
- **Spotify Web API** - Music streaming and playlist access
- **Custom AI Models** - Emotion detection and sentiment analysis

## 📁 Project Structure

```
Moodify/
├── 📂 moody-music/                 # React Frontend Application
│   ├── 📂 public/                 # Static assets and PWA configuration
│   │   ├── index.html             # Main HTML template with SEO optimization
│   │   ├── manifest.json          # PWA configuration
│   │   └── robots.txt             # SEO crawler configuration
│   ├── 📂 src/
│   │   ├── 📂 components/         # React Components
│   │   │   ├── App.js             # Main application component
│   │   │   ├── MoodInput.js       # Emotion input handling
│   │   │   ├── SongSuggestions.js # Music recommendation display
│   │   │   ├── AuthWrapper.js     # Authentication state management
│   │   │   ├── Login.js & Register.js # User authentication
│   │   │   ├── apiService.js      # Backend API communication
│   │   │   └── authService.js     # Authentication logic
│   │   ├── App.css                # Comprehensive styling system
│   │   └── index.js               # Application entry point
│   ├── package.json               # Frontend dependencies and scripts
│   └── package-lock.json          # Dependency version locking
├── 📂 music_backend/              # Django Backend API
│   ├── 📂 music/                  # Main Django app
│   │   ├── 📂 models/             # AI models directory
│   │   │   └── emotion_model.h5   # Pre-trained emotion detection model
│   │   ├── 📂 migrations/         # Database migrations
│   │   ├── 📂 management/commands/ # Custom Django commands
│   │   ├── models.py              # Database models
│   │   ├── views.py               # API endpoints and business logic
│   │   ├── serializers.py         # Data serialization
│   │   ├── urls.py                # URL routing
│   │   ├── admin.py               # Django admin interface
│   │   └── tests.py               # Comprehensive test suite
│   ├── 📂 music_backend/          # Django project configuration
│   │   ├── settings.py            # Project settings and configuration
│   │   ├── urls.py                # Main URL configuration
│   │   ├── wsgi.py & asgi.py      # Deployment configurations
│   │   └── __init__.py            # Package initialization
│   ├── requirements.txt           # Python dependencies with versions
│   ├── manage.py                  # Django management script
│   ├── setup_initial_data.py      # Database initialization script
│   └── db.sqlite3                 # SQLite database (development)
├── package.json                   # Workspace configuration
├── package-lock.json              # Root dependency locking
└── README.md                      # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 16.0+** and **npm 8.0+**
- **Python 3.8+** and **pip**
- **Git** for version control
- **Spotify Developer Account** ([Create here](https://developer.spotify.com/dashboard/))

### 1. Clone the Repository

```bash
git clone https://github.com/218451LIJIAQI/AI_PROJECT.git
cd AI_PROJECT
```

### 2. Backend Setup (Django)

```bash
# Navigate to backend directory
cd music_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Initialize sample data
python setup_initial_data.py

# Start development server
python manage.py runserver
```

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory (in new terminal)
cd moody-music

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Environment Configuration

#### Backend Environment Variables
Create `.env` file in `music_backend/`:
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
DJANGO_SECRET_KEY=your_secure_secret_key
DATABASE_URL=your_database_url  # For production
DEBUG=True  # Set to False in production
```

#### Frontend Environment Variables
Create `.env` file in `moody-music/`:
```env
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
REACT_APP_API_BASE_URL=http://localhost:8000
```

### 5. Spotify API Setup

1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new app
3. Add redirect URIs:
   - `http://localhost:3000/callback`
   - `http://localhost:3000/`
4. Copy Client ID and Client Secret to your environment files

## 🔧 Development Workflow

### Available Scripts

#### Root Level
```bash
npm run install:all     # Install all dependencies
npm run dev:frontend    # Start frontend development server
npm run build:frontend  # Build frontend for production
```

#### Backend Commands
```bash
python manage.py runserver          # Start development server
python manage.py test               # Run test suite
python manage.py makemigrations     # Create new migrations
python manage.py collectstatic      # Collect static files
python setup_initial_data.py        # Initialize database
```

#### Frontend Commands
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

## 🎯 How It Works

### 1. Emotion Detection Pipeline
- **Text Analysis**: Advanced sentiment analysis using TensorFlow
- **Image Processing**: Facial emotion recognition (if implemented)
- **Multi-modal Fusion**: Combining different input types for accuracy

### 2. Music Recommendation Engine
- **Mood Mapping**: Sophisticated algorithms map emotions to music characteristics
- **Spotify Integration**: Real-time access to millions of songs
- **Personalization**: Learning from user preferences and feedback

### 3. User Experience Flow
1. **Authentication**: Secure login/registration
2. **Mood Input**: Text, image, or direct mood selection
3. **AI Processing**: Emotion detection and analysis
4. **Music Discovery**: Curated recommendations
5. **Playback Integration**: Seamless Spotify integration

## 🌐 Deployment

### Frontend Deployment Options
- **Vercel** (Recommended): Zero-config deployment
- **Netlify**: JAMstack-optimized hosting
- **GitHub Pages**: Free static hosting

### Backend Deployment Options
- **Heroku**: Easy Django deployment
- **Railway**: Modern cloud platform
- **DigitalOcean App Platform**: Scalable hosting
- **AWS Elastic Beanstalk**: Enterprise-grade deployment

### Production Environment Setup
1. Set `DEBUG=False` in Django settings
2. Configure production database (PostgreSQL recommended)
3. Set up environment variables
4. Configure CORS settings
5. Set up SSL certificates
6. Configure CDN for static assets

## 🧪 Testing

### Backend Testing
```bash
cd music_backend
python manage.py test
```

### Frontend Testing
```bash
cd moody-music
npm test
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user

### Mood Analysis Endpoints
- `POST /api/mood/analyze-text/` - Analyze text for emotion
- `POST /api/mood/analyze-image/` - Analyze image for emotion
- `GET /api/mood/history/` - Get user's mood history

### Music Recommendation Endpoints
- `GET /api/music/recommendations/` - Get mood-based recommendations
- `POST /api/music/feedback/` - Submit user feedback
- `GET /api/music/playlists/` - Get user playlists

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Standards
- Follow PEP 8 for Python code
- Use ESLint and Prettier for JavaScript
- Write comprehensive tests
- Document all functions and components
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Development Team** - [218451LIJIAQI/224901NGOOIXUEYANG](https://github.com/218451LIJIAQI)

## 🙏 Acknowledgments

- **Spotify** for providing the Web API
- **TensorFlow** team for machine learning frameworks
- **React** and **Django** communities
- **Bootstrap** for UI components
- **Open source contributors** worldwide

## 📞 Support

For questions, issues, or contributions:
- 📧 Email: 218451@student.upm.edu.my
- 🐛 Issues: [GitHub Issues](https://github.com/218451LIJIAQI/AI_PROJECT/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/218451LIJIAQI/AI_PROJECT/discussions)

## 🔮 Future Enhancements

- **Voice Emotion Recognition** - Analyze vocal patterns
- **Social Features** - Share playlists and moods
- **Mobile App** - React Native implementation
- **Advanced Analytics** - Detailed mood insights
- **Multi-language Support** - International accessibility
- **Wearable Integration** - Smartwatch compatibility

---

<div align="center">

**Made with ❤️ by the MusicAi Team**

[⭐ Star this repository](https://github.com/218451LIJIAQI/AI_PROJECT) if you found it helpful!

</div>
