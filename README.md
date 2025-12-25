# DSA Pattern Mastery Platform 🚀

**Master patterns, not problems.** A comprehensive platform to ace coding interviews through pattern-based learning inspired by **Padho with Pratyush**.

## 🎯 Philosophy

> "Don't memorize solutions. Recognize patterns."

This platform teaches you to **think** like an expert by mastering algorithmic patterns. When you understand Two Pointers, you unlock 50+ problems. Learn Sliding Window, and another 40 become trivial.

## ✨ Complete Feature List

### 🧠 Pattern-First Learning
- **27+ Algorithmic Patterns** with detailed explanations
- **Pattern Triggers**: Learn to recognize WHEN to apply each pattern
- **Common Mistakes**: Avoid pitfalls before you make them
- **Complexity Analysis**: Time and space complexity for every pattern

### 📚 Smart Question Organization
- **200+ Curated Problems** from top problem sets
- **Difficulty Levels**: Easy, Medium, Hard
- **Problem Ladder**: Discovery → Stabilization → Twist → Interview
- **Pattern Triggers per Question**: One-line explanation of why this pattern applies
- **4-Part Resource System**:
  - LeetCode problem links
  - YouTube video explanations
  - GeeksforGeeks articles
  - Additional learning articles

### 💻 Solution Pages
- **Approach Section**: Step-by-step problem-solving approach
- **Multi-Language Code**: Solutions in 6 languages (C++, Java, Python, JavaScript, C#, Go)
- **Interactive Code Tabs**: Switch between languages with copy functionality
- **Complexity Analysis**: Detailed time/space complexity with explanations
- **Common Mistakes**: What to avoid when implementing

### 📊 Curated Problem Sheets
Access 7 famous problem lists:
1. **Blind 75** (75 problems)
2. **NeetCode 150** (150 problems)
3. **Striver A2Z DSA** (450 problems)
4. **Grind 169** (169 problems)
5. **LeetCode Top 100** (100 problems)
6. **AlgoExpert 160** (160 problems)
7. **Love Babbar 450** (450 problems)

### 🎨 Modern Design
- **Clean Blue & Purple Theme**: Coding-focused, distraction-free
- **Mobile Responsive**: Learn on any device
- **Fast Performance**: Optimized MongoDB queries
- **Intuitive Navigation**: Easy to browse patterns and questions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: JavaScript (JSX for components)
- **Database**: MongoDB (flexible, easy to extend)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB (local or MongoDB Atlas account - free tier works)

### Local Setup

1. **Clone or download the project**

2. **Install dependencies**:
```bash
npm install
```

3. **Set up MongoDB**:

   **Option A: MongoDB Atlas (Cloud - Recommended)**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free account
   - Create new cluster (free M0 tier)
   - Click "Connect" → "Connect your application"
   - Copy connection string
   
   **Option B: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Connection string: `mongodb://localhost:27017`

4. **Create `.env.local` file**:
```bash
MONGODB_URI=your_mongodb_connection_string_here
```

5. **Seed the database**:
```bash
npm run seed
```

This creates:
- `dsa_patterns` database
- `patterns` collection (pattern metadata)
- `questions` collection (problem details with solutions)
- `user_progress` collection (for future auth integration)

6. **Start development server**:
```bash
npm run dev
```

7. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
├── app/
│   ├── auth/                    # Login, Sign-up pages (UI only)
│   ├── dashboard/               # User dashboard
│   ├── patterns/                # Pattern listing
│   │   └── [slug]/              # Pattern detail with questions
│   ├── questions/               
│   │   └── [id]/                # Solution page (approach + code)
│   ├── sheets/                  # Curated problem lists
│   ├── layout.jsx               # Root layout
│   ├── globals.css              # Tailwind + theme
│   └── page.jsx                 # Landing page
│
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── question-list.jsx        # Question cards with links
│   └── solution-tabs.jsx        # Multi-language code tabs
│
├── lib/
│   ├── mongodb.js               # MongoDB connection (singleton)
│   └── db.js                    # Database helper functions
│
├── scripts/
│   └── seed-db.js               # Database seeding script
│
└── public/images/               # Static assets
```

## 🗄️ Database Schema (MongoDB)

### Collections

**patterns**
```javascript
{
  _id: ObjectId,
  name: "Two Pointers",
  slug: "two-pointers",
  description: "Use two pointers...",
  order: 1,
  questionCount: 15,
  complexity: { time: "O(n)", space: "O(1)" },
  whenToUse: ["Array is sorted", "..."],
  commonMistakes: ["Off-by-one errors", "..."]
}
```

**questions**
```javascript
{
  _id: ObjectId,
  pattern_id: "two-pointers",
  title: "Two Sum II",
  slug: "two-sum-ii",
  difficulty: "Easy",
  level: "Discovery",
  order: 1,
  patternTriggers: "Array is sorted...",
  approach: ["Step 1", "Step 2", "..."],
  solutions: {
    cpp: "class Solution {...}",
    python: "class Solution:...",
    javascript: "var twoSum = ...",
    // ... more languages
  },
  complexity: {
    time: "O(n)",
    space: "O(1)",
    timeExplanation: "...",
    spaceExplanation: "..."
  },
  commonMistakes: ["..."],
  links: {
    leetcode: "https://...",
    youtube: "https://...",
    gfg: "https://...",
    article: "https://..."
  }
}
```

**user_progress** (for future use)
```javascript
{
  _id: ObjectId,
  user_id: "user123",
  question_id: ObjectId,
  status: "completed",
  confidence: 3,
  notes: "My approach was...",
  last_attempted: Date
}
```

## 📖 How to Add New Content

### Adding New Patterns

Edit `scripts/seed-db.js` and add to the `patterns` array:

```javascript
{
  name: "Your Pattern Name",
  slug: "your-pattern-slug",
  description: "What this pattern does...",
  order: 28, // next order number
  questionCount: 0,
  complexity: { time: "O(n)", space: "O(1)" },
  whenToUse: [
    "When you see X condition",
    "When problem asks for Y",
  ],
  commonMistakes: [
    "Mistake 1",
    "Mistake 2",
  ]
}
```

### Adding New Questions

Add to the `questions` array in `scripts/seed-db.js`:

```javascript
{
  pattern_id: "two-pointers", // match pattern slug
  title: "Your Question Title",
  slug: "your-question-slug",
  difficulty: "Medium",
  level: "Stabilization",
  order: 1,
  patternTriggers: "Why this pattern applies...",
  approach: [
    "Step 1: Do this",
    "Step 2: Then this",
  ],
  solutions: {
    cpp: "// Your C++ solution",
    python: "# Your Python solution",
    javascript: "// Your JavaScript solution",
  },
  complexity: {
    time: "O(n)",
    space: "O(1)",
    timeExplanation: "We traverse once...",
    spaceExplanation: "Only use constant variables..."
  },
  commonMistakes: [
    "Forgetting edge case X",
  ],
  links: {
    leetcode: "https://leetcode.com/...",
    youtube: "https://youtube.com/...",
    gfg: "https://geeksforgeeks.org/...",
  }
}
```

Then re-run:
```bash
npm run seed
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Buttons, links
- **Accent**: Purple (#A855F7) - Highlights
- **Background**: White/Light gray
- **Success**: Green - Completed
- **Warning**: Yellow - In Progress
- **Danger**: Red - Difficult

### Typography
- **Font**: Inter (clean, modern)
- Consistent spacing and sizing
- Readable code blocks

## 🔑 Key Differentiators

### vs Other Platforms
✅ **Pattern Recognition Training** - Not just problem lists  
✅ **Multi-Resource Links** - 4 learning sources per question  
✅ **Solution Approach** - Step-by-step before code  
✅ **Multi-Language Support** - 6+ languages  
✅ **Easy to Extend** - Simple JSON format  
✅ **No Complex Setup** - Just MongoDB + Next.js  
✅ **Flexible Schema** - MongoDB allows evolution  

## 🐛 Troubleshooting

### No data showing
1. Check MongoDB connection string in `.env.local`
2. Verify database was seeded: `npm run seed`
3. Check terminal for connection errors
4. Ensure MongoDB service is running (if local)

### MongoDB connection failed
- **Atlas**: Check IP whitelist (allow 0.0.0.0/0 for dev)
- **Local**: Ensure MongoDB service is running
- **Credentials**: Verify username/password in connection string

### Seed script errors
- MongoDB connection must be active first
- Check for duplicate slugs in seed data
- Clear old data: Delete `dsa_patterns` database and re-run seed

## 🚢 Deployment

### Deploy to Vercel (One Click)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variable:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
4. Deploy
5. Run seed script once deployed (or seed before deployment)

### Alternative Platforms
- Netlify
- Railway (has built-in MongoDB option)
- AWS Amplify
- Self-hosted with Docker

## 📊 Platform Stats

- 27+ Algorithmic Patterns
- 200+ Curated Problems  
- 6 Programming Languages
- 4-Part Resource System
- 7 Famous Problem Sheets
- 100% Mobile Responsive
- 0 Complex Setup Steps

## 🙏 Credits & Inspiration

**Special Thanks to:**
- **[Padho with Pratyush](https://www.youtube.com/@padho_with_pratyush)** - Creator of the original DSA pattern sheet that inspired this platform
- Striver's A2Z DSA Sheet
- NeetCode
- LeetCode Patterns Community

This platform is a tribute to pattern-based learning and making quality DSA education accessible to everyone.

## 📝 License

MIT License - Free to use, modify, and share

---

**Remember**: Patterns over problems. Understanding over memorization. Thinking over grinding. 

Happy learning! 🎯
