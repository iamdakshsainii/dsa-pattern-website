# 🎯 DSA Patterns - Interactive Learning Platform

> A comprehensive full-stack platform for mastering Data Structures & Algorithms through pattern-based learning, curated roadmaps, and interactive challenges.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🌟 Features Overview

### 📊 **Core Learning System**
- **22 DSA Patterns** - Master problem-solving through proven patterns
- **153+ Practice Questions** - Categorized by difficulty (Easy/Medium/Hard)
- **Pattern-Based Approach** - Learn the underlying patterns, not just solutions
- **Progress Tracking** - Real-time stats on completion rates and streaks

### 🗺️ **Interactive Roadmaps**
- **Metro Map Visualization** - Beautiful visual learning paths with node-based progression
- **Multiple Domains** - Data Analyst, Web Dev, Cybersecurity, DSA Mastery
- **Hybrid Content** - Internal lessons + curated external resources
- **Progress Sync** - Auto-save with subtopic-level tracking
- **Quiz System** - Unlock quizzes at 90% completion
- **Certificates** - Earn certificates on roadmap completion

### 📝 **Rich Note-Taking**
- **Markdown Editor** - Full-featured editor with live preview
- **Code Snippets** - Syntax-highlighted code blocks
- **Image Support** - Embed images and diagrams
- **PDF Export** - Download notes as formatted PDFs
- **Problem Linking** - Notes attached to specific questions
- **Search** - Find notes across all problems

### 📋 **Curated Sheets**
- **7 Industry Sheets** - Blind 75, NeetCode 150, Striver A2Z, Grind 169, etc.
- **Smart Filtering** - By timeline, goal, and difficulty level
- **Comparison Tool** - Side-by-side sheet analysis
- **Quiz Helper** - Find the perfect sheet for your goals

### 🎯 **Interview Preparation**
- **Company-Specific Prep** - FAANG-focused question banks
- **Mock Interview Timer** - Simulate real interview conditions
- **Emergency Prep** - Last-minute study guides
- **Interview Checklist** - Track your readiness

### 👤 **User Experience**
- **Profile System** - Customizable avatars with Cloudinary integration
- **Achievement System** - Unlock badges and milestones
- **Activity Feed** - Track your learning journey
- **Bookmarks** - Save problems for later
- **Streak Tracking** - Maintain daily learning habits
- **Dark Mode** - Eye-friendly dark theme

### 🏆 **Admin Panel**
- **Content Management** - Create/edit patterns, questions, roadmaps
- **User Analytics** - View platform statistics
- **Quiz Manager** - Design and deploy quizzes
- **Roadmap Builder** - Visual roadmap creation tools
- **Bug Reports** - Track and resolve user issues
- **Mentorship Requests** - Manage student requests

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS + shadcn/ui components
- **Icons:** Lucide React
- **State:** React Hooks (useState, useEffect)
- **Forms:** Native HTML5 validation
- **Rich Text:** Custom markdown editor
- **PDF Generation:** Client-side PDF export

### **Backend**
- **Runtime:** Node.js (Next.js API Routes)
- **Database:** MongoDB Atlas
- **Authentication:** JWT + httpOnly cookies
- **File Upload:** Cloudinary API
- **Authorization:** Role-based access control (Admin/User)

### **DevOps & Tools**
- **Hosting:** Vercel
- **Version Control:** Git
- **Package Manager:** npm
- **Code Editor:** VS Code
- **Database GUI:** MongoDB Compass

---

## 📁 Project Structure

```
DSA-PATTERN-WEBSITE/
│
├── app/                                # Next.js 14 App Router
│   ├── achievements/                   # Achievement system
│   ├── activity/                       # User activity tracking
│   ├── admin/                          # Admin dashboard & tools
│   │   ├── analytics/                  # Platform analytics
│   │   ├── bug-reports/                # Bug tracking
│   │   ├── quiz-manager/               # Quiz creation
│   │   └── roadmap-manager/            # Roadmap builder
│   ├── api/                            # API routes
│   │   ├── auth/                       # Authentication endpoints
│   │   ├── patterns/                   # Pattern CRUD
│   │   ├── questions/                  # Question CRUD
│   │   ├── roadmaps/                   # Roadmap API
│   │   ├── profile/                    # User profile
│   │   └── notes/                      # Notes system
│   ├── auth/                           # Login/Signup pages
│   ├── bookmarks/                      # Saved problems
│   ├── community/                      # Community features
│   ├── dashboard/                      # User dashboard
│   ├── interview-prep/                 # Interview prep tools
│   ├── notes/                          # Notes manager
│   ├── patterns/                       # Pattern browser
│   │   └── [slug]/                     # Pattern detail
│   ├── profile/                        # User profile pages
│   │   ├── activities/                 # Activity feed
│   │   └── edit/                       # Profile editor
│   ├── questions/                      # Question browser
│   │   └── [id]/                       # Question detail
│   ├── quiz/                           # Quiz system
│   ├── resume/                         # Resume builder
│   ├── roadmaps/                       # Roadmap feature
│   │   ├── page.jsx                    # Browse roadmaps
│   │   └── [slug]/                     # Roadmap detail
│   │       ├── page.jsx                # Metro map view
│   │       ├── [nodeId]/               # Node detail
│   │       ├── certificate/            # Certificate page
│   │       └── quiz/                   # Roadmap quiz
│   ├── sheets/                         # Curated sheets
│   ├── stats/                          # User statistics
│   └── layout.jsx                      # Root layout
│
├── components/                         # React Components
│   ├── achievements/                   # Achievement UI
│   ├── admin/                          # Admin components
│   ├── dashboard/                      # Dashboard widgets
│   ├── filters/                        # Filter components
│   ├── interview-prep/                 # Interview prep UI
│   ├── patterns/                       # Pattern components
│   ├── profile/                        # Profile components
│   ├── questions/                      # Question components
│   ├── quiz-manager/                   # Quiz builder UI
│   ├── roadmaps/                       # Roadmap components
│   │   ├── metro-map/                  # Metro map visualization
│   │   ├── content/                    # Content renderers
│   │   ├── progress/                   # Progress tracking
│   │   └── quiz/                       # Roadmap quiz UI
│   ├── sheets/                         # Sheet components
│   ├── solutions/                      # Solution display
│   ├── ui/                             # shadcn/ui components
│   ├── navbar.jsx                      # Main navigation
│   └── theme-provider.jsx              # Dark mode provider
│
├── lib/                                # Utility libraries
│   ├── achievements/                   # Achievement logic
│   ├── admin/                          # Admin utilities
│   ├── models/                         # Data models
│   ├── roadmaps/                       # Roadmap logic
│   ├── validators/                     # Input validation
│   ├── db.js                           # MongoDB connection
│   ├── auth.js                         # JWT utilities
│   ├── cloudinary.js                   # Image upload
│   ├── mongodb.js                      # DB client
│   └── utils.js                        # Helper functions
│
├── data/                               # Static data
│   ├── company-interview-data.js       # Company questions
│   └── emergency-prep-data.js          # Quick prep guides
│
├── public/                             # Static assets
│   └── images/                         # Image files
│
├── hooks/                              # Custom React hooks
│   └── use-toast.ts                    # Toast notifications
│
├── .env.local                          # Environment variables
├── next.config.js                      # Next.js configuration
├── tailwind.config.js                  # Tailwind configuration
├── package.json                        # Dependencies
└── README.md                           # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dsa-patterns.git
cd dsa-patterns
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dsa_patterns

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Email (for admin access)
ADMIN_EMAIL=admin@example.com
```

4. **Seed the database (optional)**
```bash
# Import sample patterns and questions
npm run seed
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

---

## 🗄️ Database Schema

### Collections Overview

#### **users**
- User authentication and profile data
- Fields: `email`, `name`, `password`, `avatar`, `bio`, `role`

#### **patterns**
- DSA pattern definitions
- Fields: `slug`, `title`, `description`, `difficulty`, `companies`

#### **questions**
- Practice problems linked to patterns
- Fields: `title`, `difficulty`, `pattern`, `leetcodeUrl`, `solution`

#### **roadmaps**
- Learning roadmap metadata
- Fields: `slug`, `title`, `category`, `difficulty`, `estimatedWeeks`, `icon`, `color`

#### **roadmap_nodes**
- Topics/milestones within roadmaps
- Fields: `nodeId`, `roadmapId`, `title`, `subtopics[]`, `weekNumber`, `order`

#### **roadmap_progress**
- User progress through roadmaps
- Fields: `userId`, `roadmapId`, `overallProgress`, `nodesProgress[]`, `completedSubtopics[]`

#### **notes**
- User-created notes
- Fields: `userId`, `questionId`, `title`, `content`, `tags`, `createdAt`

#### **bookmarks**
- Saved problems
- Fields: `userId`, `questionId`, `createdAt`

#### **achievements**
- User achievements and badges
- Fields: `userId`, `achievementId`, `unlockedAt`

---

## 🎨 Key Features Deep Dive

### 🗺️ Roadmap System Architecture

#### **Metro Map Visualization**
- SVG-based interactive map
- Week-based grouping with visual connection paths
- Node states: `locked`, `unlocked`, `in-progress`, `completed`
- Smooth animations and hover effects
- Mobile-responsive with list view fallback

#### **Node Structure**
```javascript
{
  nodeId: "da-node-1",
  title: "Introduction to Databases",
  weekNumber: 1,
  subtopics: [
    {
      subtopicId: "da-1-1",
      title: "What is a Database?",
      estimatedMinutes: 15,
      resourceLinks: {
        youtube: "https://...",
        article: "https://...",
        practice: "https://..."
      }
    }
  ]
}
```

#### **Progress Tracking**
- Auto-save every 2 seconds (debounced)
- Subtopic-level completion tracking
- Overall percentage calculation
- Milestone markers at 25%, 50%, 75%, 90%
- Quiz unlocks at 90% completion

### 📝 Notes System

#### **Features**
- Rich markdown editor with live preview
- Syntax-highlighted code blocks
- Image upload via Cloudinary
- Linked to specific problems
- Export to PDF with formatting
- Full-text search across all notes

#### **Storage**
- Notes stored in MongoDB with full content
- Images hosted on Cloudinary
- PDF generation client-side (no server processing)

### 🎯 Pattern-Based Learning

#### **Why Patterns?**
Instead of memorizing 500+ individual solutions, master 22 core patterns that solve 90% of DSA problems.

#### **Pattern Examples**
- Two Pointers
- Sliding Window
- Fast & Slow Pointers
- Merge Intervals
- Cyclic Sort
- Binary Search Variations
- Tree BFS/DFS
- Dynamic Programming

---

## 🔐 Authentication & Security

### **Authentication Flow**
1. User signs up with email/password
2. Password hashed with bcrypt (10 rounds)
3. JWT token generated and stored in httpOnly cookie
4. Token verified on each protected route
5. Auto-logout on token expiry

### **Security Measures**
- ✅ Passwords hashed (never stored plain text)
- ✅ JWT stored in httpOnly cookies (not localStorage)
- ✅ CSRF protection via SameSite cookies
- ✅ Input validation on all forms
- ✅ SQL injection prevention (NoSQL)
- ✅ XSS protection via React's built-in escaping

---

## 🎨 UI/UX Design Principles

### **Design System**
- **Colors:** Blue-Purple gradient theme
- **Typography:** System fonts for speed
- **Spacing:** 4px base unit (Tailwind defaults)
- **Animations:** Subtle micro-interactions
- **Dark Mode:** Full support with system detection

### **Component Library**
Built on **shadcn/ui** for consistency:
- Button, Card, Badge, Dialog
- Dropdown Menu, Progress Bar
- Toast Notifications
- Form Inputs

### **Responsive Breakpoints**
- `sm`: 640px (mobile)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (wide desktop)

---

## 📊 Admin Features

### **Admin Panel Access**
Only users with emails in the admin list can access `/admin`

### **Admin Capabilities**
1. **Pattern Management** - Add/edit/delete patterns
2. **Question Management** - CRUD operations on problems
3. **Roadmap Builder** - Visual roadmap creator
4. **Quiz Manager** - Create quizzes with scoring
5. **User Analytics** - View platform statistics
6. **Bug Reports** - Track and resolve issues
7. **Mentorship** - Manage mentor requests

---

## 🚢 Deployment

### **Vercel Deployment (Recommended)**

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to `main`

### **Environment Variables in Production**
Ensure all `.env.local` variables are set in Vercel:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_*` variables
- `ADMIN_EMAIL`

---

## 📈 Future Enhancements

### **Planned Features**
- [ ] AI-powered hints for problems
- [ ] Live coding playground
- [ ] Peer-to-peer code reviews
- [ ] Video solution explanations
- [ ] Social features (follow users, study groups)
- [ ] Mobile app (React Native)
- [ ] Integration with LeetCode API
- [ ] Spaced repetition system
- [ ] AI chat assistant

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Code Style**
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Lucide](https://lucide.dev/) - Icon library
- Community contributors and beta testers

---

## 📞 Support

- **Bug Reports:** [Open an issue](https://github.com/yourusername/dsa-patterns/issues)
- **Feature Requests:** [Start a discussion](https://github.com/yourusername/dsa-patterns/discussions)
- **Email:** support@dsapatterns.com

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ for the programming community**

</div>
