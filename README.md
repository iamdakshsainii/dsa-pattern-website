# 🚀 DSA Patterns - Master Data Structures & Algorithms

<div align="center">

![DSA Patterns Platform](https://img.shields.io/badge/DSA-Patterns-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A comprehensive platform for mastering Data Structures & Algorithms through pattern-based learning**

[Live Demo](#) • [Features](#-features) • [Get Started](#-getting-started)

</div>

---

## 📖 About

DSA Patterns is a modern learning platform designed to help students and developers master Data Structures & Algorithms through a **pattern-based approach**. Learn by understanding core patterns that appear repeatedly in coding interviews instead of solving problems randomly.

### 🎯 Why Use DSA Patterns?

- 80% of coding problems follow recognizable patterns
- Learn one pattern, solve dozens of problems
- Structured learning path from basics to advanced
- Perfect for FAANG interview preparation
- Track your progress with detailed analytics

---

## ✨ Key Features

### 📚 Learning & Practice
- **22+ DSA Patterns** with 150+ curated problems
- Multiple solution approaches (Brute Force, Optimal)
- Time & space complexity analysis for every solution
- Pattern sheets (Blind 75, NeetCode 150, Striver SDE)
- Step-by-step explanations with examples

### 📊 Progress Tracking
- Real-time dashboard with statistics
- GitHub-style activity heatmap
- Daily streak counter
- Pattern mastery tracking
- Difficulty-wise problem breakdown

### 🏆 Achievements & Gamification
- 10+ unlockable achievement badges
- Real-time toast notifications for milestones
- Profile completion tracker
- Weekly challenges and contests

### 👤 Profile Management
- Professional profile with avatar upload
- Education and work experience
- Social links (GitHub, LinkedIn, LeetCode, Codeforces)
- Skills showcase
- Resume upload and management

### 💼 Career Tools
- **Resume Manager** - Upload, view, and share your resume
- **Interview Prep Checklist** - 6-step preparation guide
- **Company Tracker** - Track problems by target companies
- **Daily Challenges** - Personalized problem recommendations

### 💬 Community
- Active WhatsApp community with 500+ members
- Study groups and mock interviews
- Job referrals and placement support
- Success stories from FAANG employees

### 🔖 Organization
- Bookmark important problems
- Take notes for each problem
- Advanced search and filtering
- Recent activity tracking

---

## 🛠️ Tech Stack

**Frontend:** Next.js 16, React 19, Tailwind CSS, shadcn/ui
**Backend:** Next.js API Routes, MongoDB
**Storage:** Cloudinary (Images & Files)
**Auth:** JWT Authentication
**Charts:** Recharts
**Deployment:** Vercel/Railway ready

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dsa-patterns-platform.git
cd dsa-patterns-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dsa_patterns

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Seed the database**
```bash
# Seed patterns and questions
npm run seed

# Seed collections for achievements, resumes, etc.
npm run seed-db
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

---

## 💻 For Contributors & Developers

### Using VS Code

**Recommended VS Code Extensions:**

1. **ES7+ React/Redux/React-Native snippets** - `dsznajder.es7-react-js-snippets`
2. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
3. **ESLint** - `dbaeumer.vscode-eslint`
4. **Prettier** - `esbenp.prettier-vscode`
5. **Auto Rename Tag** - `formulahendry.auto-rename-tag`
6. **Path Intellisense** - `christian-kohler.path-intellisense`

**VS Code Settings (`.vscode/settings.json`):**

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

**Keyboard Shortcuts (VS Code):**
- `Ctrl + P` - Quick file navigation
- `Ctrl + Shift + P` - Command palette
- `Ctrl + ~` - Open integrated terminal
- `Ctrl + B` - Toggle sidebar
- `Alt + Click` - Multi-cursor editing

---

## 📚 Usage Guide

### For Students

1. **Sign up** for a free account
2. **Complete your profile** to unlock all features
3. **Choose a learning pattern** (start with Two Pointers or Sliding Window)
4. **Solve problems** with detailed explanations
5. **Track your progress** on the dashboard
6. **Earn achievements** as you improve
7. **Join the community** for support and motivation

### For Recruiters

1. Browse student profiles with detailed stats
2. View uploaded resumes and projects
3. Check problem-solving metrics
4. See social profiles and portfolios
5. Connect with top performers

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed patterns and questions
npm run seed-db      # Seed database collections
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Please ensure:**
- Code follows ESLint rules
- All tests pass
- Documentation is updated
- Commit messages are clear

---

---

## 🙏 Acknowledgments

- Problem collection inspired by NeetCode, Blind 75, and Striver's SDE Sheet
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide Icons](https://lucide.dev/)
- Community support from 500+ active learners

---

## 🌟 Show Your Support

If this project helped you, please give it a ⭐️ on GitHub!
