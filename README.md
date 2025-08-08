# 📚 StudyPal AI

**StudyPal AI** is an advanced productivity web application designed to help students stay focused, motivated, and engaged during study sessions. It combines powerful study tools with gamification elements and AI-powered assistance to create the ultimate learning companion.

---

## ✨ Features

### 🎯 Core Study Tools
- **⏱️ Dynamic Study Timer**: Interactive timer with visual progress ring and 20-minute cycles
- **📊 Real-time Statistics**: Track total study time and session counts
- **💬 AI Chat Assistant**: Integrated AI-powered chat for motivation, study tips, and productivity advice
- **📈 Study History**: Complete session tracking with visual charts and detailed analytics
- **🔄 Session Management**: Save, pause, resume, and finish study sessions with data persistence

### 🎮 Gamification & Rewards
- **🏆 Progressive Game Unlocks**: Earn mini-games by reaching study milestones
  - **✅ Palindrome Challenge** (Unlocks at 20 minutes)
  - **🧠 Brain Flash Quiz** (Unlocks at 40 minutes) 
  - **😊 Emoji Memory Puzzle** (Unlocks at 40 minutes)
- **📊 High Score Tracking**: Local storage of personal bests for each game
- **🎉 Achievement Celebrations**: Visual feedback for unlocking new content

### 🎨 User Experience
- **🌟 Animated Background**: Floating particle effects with neon cyber theme
- **📱 Fully Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎵 Visual Feedback**: Smooth animations, transitions, and progress indicators
- **🌙 Dark Theme**: Eye-friendly design for extended study sessions
- **⚡ Fast Performance**: Vanilla JavaScript for optimal speed and reliability


---

## �️ Installation & Setup

### Frontend Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/japjotsingh18/studypal-ai.git
   cd studypal-ai
   ```

2. **Open the frontend:**
   ```bash
   cd frontend/docs
   ```
   Open `index.html` in your browser or use Live Server in VS Code.

### Backend Setup (For AI Chat & Data Persistence)
1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv ../backend-env
   source ../backend-env/bin/activate  # On Windows: ../backend-env/Scripts/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install flask flask-cors openai python-dotenv requests
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Run the backend server:**
   ```bash
   python app.py
   ```
   The backend will run on `http://127.0.0.1:5001`

---

## 🏗️ Project Structure

```
studypal-ai/
├── 📁 frontend/
│   └── 📁 docs/
│       ├── 📄 index.html          # Main application interface
│       ├── 🎨 style.css           # Complete styling & responsive design
│       └── ⚡ script.js           # Frontend game logic & UI interactions
├── 📁 backend/
│   ├── 🐍 app.py                  # Flask API server
│   └── 🗃️ studypal_data.db       # SQLite database for session storage
├── 📁 backend-env/                # Python virtual environment
├── ⚙️ .vscode/settings.json       # VS Code configuration
├── 🚫 .gitignore                  # Git ignore rules
└── 📖 README.md                   # This file
```

---

## 💻 Technology Stack

### Frontend
- **HTML5** - Semantic structure and accessibility
- **CSS3** - Advanced styling, animations, and responsive design
- **JavaScript (ES6+)** - Interactive functionality and game logic
- **Chart.js** - Data visualization for study analytics
- **Font Awesome** - Professional iconography

### Backend
- **Python 3** - Server-side logic
- **Flask** - Lightweight web framework
- **SQLite** - Local database for session persistence
- **OpenAI API** - AI-powered chat assistance
- **Flask-CORS** - Cross-origin resource sharing

### Development Tools
- **Git** - Version control
- **VS Code** - Development environment
- **Live Server** - Local development server

---

## 🎮 Game Details

### Palindrome Challenge
- **Objective**: Check if words or sentences are palindromes
- **Features**: Real-time validation, case-insensitive checking
- **Unlock**: 20 minutes of study time

### Brain Flash Quiz
- **Objective**: Answer math and logic questions quickly
- **Features**: 60-second timer, multiple choice questions, high score tracking
- **Questions**: 20+ varied questions covering math and logic
- **Unlock**: 40 minutes of study time

### Emoji Memory Puzzle
- **Objective**: Remember and repeat emoji sequences
- **Features**: Progressive difficulty, visual sequence display, round tracking
- **Gameplay**: Watch the sequence, then repeat it correctly
- **Unlock**: 40 minutes of study time

---

## � Features in Detail

### Study Timer
- Visual progress ring with gradient colors
- Automatic 20-minute cycle tracking
- Pause/resume functionality
- Session completion with data saving

### AI Chat Assistant
- Natural language processing for study-related queries
- Motivational messages and productivity tips
- Real-time typing indicators
- Connection status monitoring

### Analytics Dashboard
- Session history with timestamps
- Visual charts showing study progress
- Time tracking with minute precision
- Exportable data for further analysis

### Responsive Design
- Mobile-first approach
- Tablet-specific optimizations (769px-812px breakpoint)
- Desktop layouts for larger screens
- Touch-friendly interface elements

---

## � Configuration

### Environment Variables
```env
OPENAI_API_KEY=your_api_key_here
FLASK_DEBUG=True  # For development
```

### Database Schema
```sql
CREATE TABLE study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_time INTEGER NOT NULL,
    session_count INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Test all features across different devices
- Update documentation for new features
- Ensure responsive design principles

---

## 👨‍💻 Author

**Japjot Singh**
- GitHub: [@japjotsingh18](https://github.com/japjotsingh18)
- Project: [StudyPal AI](https://github.com/japjotsingh18/studypal-ai)

---

## 🙏 Acknowledgments

- OpenAI for providing the AI chat capabilities
- Chart.js for beautiful data visualizations
- Font Awesome for the icon library
- The open-source community for inspiration and tools

---

⭐ **If you find StudyPal AI helpful, please give it a star!** ⭐

