# 🎯 DSA Patterns - Interactive Learning Platform

A comprehensive full-stack platform for mastering Data Structures & Algorithms through pattern-based learning, curated roadmaps, and interactive challenges.

> **⚠️ PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED**
> This is a private learning platform. Unauthorized copying, distribution, modification, or commercial use is strictly prohibited.

---

## 🌟 Features Overview

### 📊 Core Learning System
- **22 DSA Patterns** - Master problem-solving through proven patterns
- **153+ Practice Questions** - Categorized by difficulty (Easy/Medium/Hard)
- **Pattern-Based Approach** - Learn the underlying patterns, not just solutions
- **Progress Tracking** - Real-time stats on completion rates and streaks

### 🗺️ Interactive Roadmaps
- **Metro Map Visualization** - Beautiful visual learning paths with node-based progression
- **Multiple Domains** - Data Analyst, Web Dev, Cybersecurity, DSA Mastery
- **Hybrid Content** - Internal lessons + curated external resources
- **Progress Sync** - Auto-save with subtopic-level tracking
- **Quiz System** - Unlock quizzes at 90% completion
- **Certificates** - Earn certificates on roadmap completion

### 📝 Rich Note-Taking
- **Markdown Editor** - Full-featured editor with live preview
- **Code Snippets** - Syntax-highlighted code blocks
- **Image Support** - Embed images and diagrams
- **PDF Export** - Download notes as formatted PDFs
- **Problem Linking** - Notes attached to specific questions
- **Search** - Find notes across all problems

### 📋 Curated Sheets
- **7 Industry Sheets** - Blind 75, NeetCode 150, Striver A2Z, Grind 169, etc.
- **Smart Filtering** - By timeline, goal, and difficulty level
- **Comparison Tool** - Side-by-side sheet analysis
- **Quiz Helper** - Find the perfect sheet for your goals

### 🎯 Interview Preparation
- **Company-Specific Prep** - FAANG-focused question banks
- **Mock Interview Timer** - Simulate real interview conditions
- **Emergency Prep** - Last-minute study guides
- **Interview Checklist** - Track your readiness

### 👤 User Experience
- **Profile System** - Customizable avatars with Cloudinary integration
- **Achievement System** - Unlock badges and milestones
- **Activity Feed** - Track your learning journey
- **Bookmarks** - Save problems for later
- **Streak Tracking** - Maintain daily learning habits
- **Dark Mode** - Eye-friendly dark theme

### 🏆 Admin Panel
- **Content Management** - Create/edit patterns, questions, roadmaps
- **User Analytics** - View platform statistics
- **Quiz Manager** - Design and deploy quizzes
- **Roadmap Builder** - Visual roadmap creation tools
- **Bug Reports** - Track and resolve user issues
- **Mentorship Requests** - Manage student requests

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **State**: React Hooks (useState, useEffect)
- **Forms**: Native HTML5 validation
- **Rich Text**: Custom markdown editor
- **PDF Generation**: Client-side PDF export

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: MongoDB Atlas
- **Authentication**: JWT + httpOnly cookies
- **File Upload**: Cloudinary API
- **Authorization**: Role-based access control (Admin/User)

### DevOps & Tools
- **Hosting**: Vercel
- **Version Control**: Git
- **Package Manager**: npm
- **Database GUI**: MongoDB Compass

---

## 📁 Platform Architecture

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
└── hooks/                              # Custom React hooks
    └── use-toast.ts                    # Toast notifications
```

---

## 🚀 System Requirements

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Cloudinary account (for image storage)

### Development Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access platform at http://localhost:3000
```

---

## 📊 Feature Highlights

### Database Collections
- **users** - User authentication and profile data
- **patterns** - DSA pattern definitions
- **questions** - Practice problems linked to patterns
- **roadmaps** - Learning roadmap metadata
- **roadmap_nodes** - Topics/milestones within roadmaps
- **roadmap_progress** - User progress tracking
- **notes** - User-created notes
- **bookmarks** - Saved problems
- **achievements** - User achievements and badges
- **quiz_results** - Quiz attempt history
- **certificates** - Earned certificates

### 🎯 Key Features Deep Dive

#### 🗺️ Roadmap System Architecture
**Metro Map Visualization**
- SVG-based interactive map
- Week-based grouping with visual connection paths
- Node states: locked, unlocked, in-progress, completed
- Smooth animations and hover effects
- Mobile-responsive with list view fallback

**Node Structure**
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

**Progress Tracking**
- Auto-save every 2 seconds (debounced)
- Subtopic-level completion tracking
- Overall percentage calculation
- Milestone markers at 25%, 50%, 75%, 90%
- Quiz unlocks at 90% completion

#### 📝 Notes System
**Features**
- Rich markdown editor with live preview
- Syntax-highlighted code blocks
- Image upload via Cloudinary
- Linked to specific problems
- Export to PDF with formatting
- Full-text search across all notes

**Storage**
- Notes stored in MongoDB with full content
- Images hosted on Cloudinary
- PDF generation client-side (no server processing)

#### 🎯 Pattern-Based Learning
**Why Patterns?**
Instead of memorizing 500+ individual solutions, master 22 core patterns that solve 90% of DSA problems.

**Pattern Examples**
- Two Pointers
- Sliding Window
- Fast & Slow Pointers
- Merge Intervals
- Cyclic Sort
- Binary Search Variations
- Tree BFS/DFS
- Dynamic Programming

---

## 🛡️ Security & Access Control

### Authentication Flow
1. User registration with email/password
2. Password hashing using bcrypt (10 rounds)
3. JWT token generation and storage in httpOnly cookies
4. Token verification on protected routes
5. Auto-logout on token expiry

### Security Measures
- ✅ Passwords hashed (never stored in plain text)
- ✅ JWT stored in httpOnly cookies (not localStorage)
- ✅ CSRF protection via SameSite cookies
- ✅ Input validation on all forms
- ✅ NoSQL injection prevention
- ✅ XSS protection via React's built-in escaping
- ✅ Role-based access control (Admin/User)

---

## 🎨 Design Philosophy

### UI/UX Principles
- **Colors**: Blue-Purple gradient theme
- **Typography**: System fonts for optimal performance
- **Spacing**: 4px base unit (Tailwind defaults)
- **Animations**: Subtle micro-interactions for engagement
- **Dark Mode**: Full support with system detection

### Component Library
Built on shadcn/ui components:
- Button, Card, Badge, Dialog
- Dropdown Menu, Progress Bar
- Toast Notifications
- Form Inputs

### Responsive Design
- **Mobile** (sm: 640px)
- **Tablet** (md: 768px)
- **Desktop** (lg: 1024px)
- **Wide Desktop** (xl: 1280px)

---

## 📊 Admin Features

### Admin Panel Access
Only authorized users can access `/admin` dashboard

### Admin Capabilities
- **Pattern Management** - Add/edit/delete patterns
- **Question Management** - CRUD operations on problems
- **Roadmap Builder** - Visual roadmap creator
- **Quiz Manager** - Create quizzes with scoring
- **User Analytics** - View platform statistics
- **Bug Reports** - Track and resolve issues
- **Mentorship** - Manage mentor requests
- **User Management** - Block/unblock users
- **Activity Logs** - Track all admin actions

---

## 🚢 Deployment

### Production Deployment
The platform is deployed on **Vercel** for optimal performance and scalability.

**Deployment Features**:
- Automatic deployments on repository updates
- Global CDN for fast content delivery
- Environment variable management
- SSL/TLS certificate management
- Automatic scaling based on traffic

### Platform Access
Visit the live platform at your configured domain. User registration is required for access to all features.

---

## 📈 Planned Features

### Future Enhancements
- 🤖 AI-powered hints for problem-solving
- 💻 Live coding playground with test cases
- 👥 Peer-to-peer code reviews
- 🎥 Video solution explanations
- 🤝 Social features (follow users, study groups)
- 📱 Mobile application (React Native)
- 🔗 LeetCode API integration
- 🧠 Spaced repetition system
- 💬 AI chat assistant for learning support

---

## 📜 License & Usage

### Copyright Notice
**© 2024-2025 DSA Patterns Platform. All Rights Reserved.**

This platform and its source code are proprietary and confidential. Unauthorized access, copying, modification, distribution, or commercial use of any part of this platform is strictly prohibited without explicit written permission.

### Permitted Use
- ✅ Personal learning and skill development
- ✅ Portfolio demonstration (screenshots only)
- ✅ Educational reference (with attribution)

### Prohibited Actions
- ❌ Copying or redistributing source code
- ❌ Commercial use or monetization
- ❌ Creating derivative works
- ❌ Removing copyright notices
- ❌ Reverse engineering

**For licensing inquiries, contact**: sainidaskh70@gmail.com

---

## 👨‍💻 Platform Developer

**Developer**: Daskh Saini
**Email**: sainidaskh70@gmail.com
**Purpose**: Educational learning platform for DSA mastery

---

## 🙏 Acknowledgments

### Technologies Used
- **Next.js** - The React framework for production
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **MongoDB** - NoSQL database solution
- **Cloudinary** - Image hosting and management
- **Lucide** - Beautiful icon library

---

## 📞 Support & Contact

### Get Help
- **Bug Reports**: Available to registered users only
- **Feature Requests**: Submit through in-platform feedback
- **Technical Support**: sainidaskh70@gmail.com
- **Platform Access**: Registration required

---

<div align="center">

### 🎓 Built for Learners, By a Learner

**Empowering developers to master DSA through pattern-based learning**

---

**© 2024-2025 DSA Patterns Platform** | **All Rights Reserved** | **Proprietary Software**

*Unauthorized copying, distribution, or use is strictly prohibited*

</div>
