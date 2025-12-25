# DSA Pattern Learning Platform - Complete Guide

## 🎯 Platform Overview

This is a **pattern-first DSA learning platform** designed to help students master coding interviews by understanding patterns, not memorizing solutions.

### Core Philosophy
**"Don't memorize solutions. Recognize patterns."**

When you master patterns like Two Pointers or Sliding Window, you unlock dozens of problems. This platform focuses on pattern recognition over rote memorization.

---

## 🚀 Getting Started

### For Students

1. **Sign Up**: Create a free account at `/auth/sign-up`
2. **Browse Patterns**: Explore 27+ algorithmic patterns at `/patterns`
3. **Start Learning**: Pick a pattern and work through the problem ladder
4. **Track Progress**: Mark problems complete, rate confidence, save notes
5. **Review & Master**: Use the revision queue and pattern heatmap

### For Developers (Local Setup)

#### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)
- Git

#### Installation Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd dsa-pattern-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
# The following environment variables are already configured in your Vercel project:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - POSTGRES_URL (and related database URLs)

# 4. Run database migrations
# Go to your Supabase project dashboard (https://supabase.com/dashboard)
# Navigate to SQL Editor
# Run the scripts in order:
#   - scripts/001_create_tables.sql
#   - scripts/002_seed_data.sql
#   - scripts/003_seed_remaining_patterns.sql
#   - scripts/004_seed_remaining_patterns_complete.sql
#   - scripts/005_add_revision_features.sql
#   - scripts/006_add_resource_links.sql
#   - scripts/007_enhance_schema_with_metadata.sql

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

---

## 📊 How Supabase Works Here

### Data Storage Structure

```
Supabase PostgreSQL Database
│
├── patterns (27 rows)
│   ├── id, name, slug, description
│   ├── explanation, when_to_use, common_mistakes
│   └── time_complexity, space_complexity, difficulty_level
│
├── questions (200+ rows)
│   ├── id, pattern_id, title, difficulty
│   ├── leetcode_link, youtube_link, gfg_link
│   ├── pattern_trigger, common_mistake
│   └── problem_level (discovery/stabilization/twist/interview)
│
├── profiles (user accounts)
│   └── id, email, display_name, created_at
│
├── user_progress (tracks per-question progress)
│   ├── user_id, question_id, status
│   ├── notes, confidence_level (0-3)
│   └── completed_at, last_revised_at
│
└── revision_schedules (spaced repetition)
    └── user_id, question_id, next_review_date
```

### Authentication Flow

1. **Sign Up**: Supabase Auth creates user account
2. **Profile Creation**: Trigger automatically creates profile record
3. **Session Management**: JWT tokens stored in HTTP-only cookies
4. **RLS Policies**: Row Level Security ensures users only see their own data

### Where Data Lives

- **Cloud**: All data stored in Supabase PostgreSQL (hosted on AWS)
- **Local Dev**: Connects to same Supabase project (no local database needed)
- **Backups**: Automatic daily backups by Supabase
- **Security**: RLS policies prevent unauthorized access

---

## 🎨 Design System

### Theme: Blue & White (Coder-Focused)

```css
Colors:
- Primary Blue: #3B82F6 (for CTAs, highlights)
- White: #FFFFFF (clean backgrounds)
- Gray Scale: #F9FAFB → #111827 (text, borders)
- Success Green: #10B981
- Warning Amber: #F59E0B
- Danger Red: #EF4444
```

### Typography
- **Headings**: Inter (bold, large sizes)
- **Body**: Inter (regular, readable sizes)
- **Code**: JetBrains Mono (for difficulty badges, stats)

---

## 🧩 Key Features Explained

### 1. Pattern-Based Organization

**Problem**: Random problem-solving leads to overwhelm and pattern blindness.

**Solution**: Group questions by algorithmic pattern (Two Pointers, Sliding Window, etc.)

**How It Works**:
- Each pattern has explanation, use cases, common mistakes
- Questions organized in ladder: Discovery → Stabilization → Twist → Interview
- Learn the pattern once, solve 20+ variations

### 2. Pattern Triggers

**What**: A single sentence explaining WHY a question uses that pattern

**Example**:
```
Question: "Two Sum in Sorted Array"
Trigger: "Keywords: 'sorted array', 'pair' → Use two pointers from both ends"
```

**Purpose**: Train pattern recognition, not solution memorization

### 3. Resource Links (4-Part System)

For each question, we provide:
1. **LeetCode**: Official problem link (if available)
2. **GFG**: GeeksforGeeks solution (if available)
3. **YouTube**: Curated video explanation
4. **Articles**: Written tutorials

**Handling Missing Links**:
- Gracefully show "Not Available" badge
- No broken links or empty sections

### 4. Notes System

**Active Learning**: Students write their own:
- Approach
- Dry run
- Mistakes made
- Key insights

**Pattern Notes**: After solving 5+ problems in a pattern, see consolidated learnings

### 5. Confidence Tracking

4-level system:
- **0 - Not Attempted**: Haven't tried yet
- **1 - Need Practice**: Solved but struggled
- **2 - Comfortable**: Can solve with hints
- **3 - Confident**: Can solve independently

**Used For**:
- Revision queue prioritization
- Pattern heatmap visualization
- Smart recommendations

### 6. Pattern Heatmap

**Visual Grid** showing mastery across all patterns:
- Gray: Not started
- Red: 0-25% complete
- Yellow: 25-75% complete
- Green: 75-100% complete

**Benefit**: Quickly identify weak patterns

### 7. Interview Mode

**Simulates Real Interviews**:
- Timer enabled
- Solutions hidden
- Random problem selection
- Pattern name hidden until submission

**Post-Attempt**:
1. Reveal pattern trigger
2. Show approach
3. Display solution
4. Highlight common mistakes

---

## 📚 Database Schema Details

### Tables & Relationships

```sql
patterns (1) ←→ (many) questions
users (1) ←→ (many) user_progress
questions (1) ←→ (many) user_progress
```

### Row Level Security (RLS)

**Critical for Security**:

```sql
-- Users can only read their own progress
CREATE POLICY "Users see own progress"
ON user_progress FOR SELECT
USING (auth.uid() = user_id);

-- Users can only update their own progress
CREATE POLICY "Users update own progress"
ON user_progress FOR UPDATE
USING (auth.uid() = user_id);
```

**Result**: Even if someone has your database URL, they can't access others' data

---

## 🔧 Running SQL Scripts

### Option 1: Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Paste script content
6. Click **Run**
7. Repeat for each script in numerical order

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

### Script Order (IMPORTANT)

Run in this exact sequence:
1. `001_create_tables.sql` - Creates schema
2. `002_seed_data.sql` - Seeds first 3 patterns
3. `003_seed_remaining_patterns.sql` - Seeds more patterns
4. `004_seed_remaining_patterns_complete.sql` - Completes all 27 patterns
5. `005_add_revision_features.sql` - Adds revision tables
6. `006_add_resource_links.sql` - Adds bookmark/resource tables
7. `007_enhance_schema_with_metadata.sql` - Adds pattern explanations, triggers

---

## 🎓 For Students: How to Use This Platform

### Week 1-2: Foundation Patterns
- Start with "Two Pointers" and "Sliding Window"
- Complete all "Discovery" level problems
- Save notes on your approach
- Rate confidence after each problem

### Week 3-4: Core Patterns
- Binary Search, Stack, Hash Maps
- Focus on "Stabilization" problems
- Review your pattern notes

### Week 5-6: Advanced Patterns
- Tree DFS/BFS, Dynamic Programming
- Tackle "Twist" problems
- Use Interview Mode for practice

### Week 7-8: Interview Prep
- Revision queue (spaced repetition)
- "Interview Level" problems
- Timed practice sessions

### Daily Routine
1. Check revision queue (5-10 problems due)
2. Solve 2-3 new problems
3. Review pattern notes before bed
4. Update confidence levels

---

## 🛠️ Technical Architecture

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State**: React hooks + Supabase realtime

### Backend
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (email/password)
- **API**: Next.js Server Actions
- **Security**: Row Level Security (RLS)

### Deployment
- **Platform**: Vercel
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network
- **SSL**: Automatic HTTPS

---

## 🐛 Troubleshooting

### "No data showing up"
1. Check if SQL scripts ran successfully
2. Verify Supabase environment variables
3. Check browser console for errors
4. Ensure RLS policies are created

### "Can't sign up"
1. Check Supabase Auth is enabled
2. Verify email templates configured
3. Check SMTP settings (if using custom email)
4. Look for auth errors in Supabase logs

### "Progress not saving"
1. Ensure user is logged in
2. Check RLS policies on user_progress table
3. Verify Supabase client initialization
4. Look for console errors

### "Images not loading"
1. Check Supabase Storage permissions
2. Verify image URLs are correct
3. Check CORS settings
4. Use browser network tab to debug

---

## 📈 Future Enhancements

### Planned Features
- [ ] Company-wise question filters (Google, Amazon, etc.)
- [ ] Weekly challenges
- [ ] Public profile pages
- [ ] Discussion forums per question
- [ ] AI-powered hint system
- [ ] Code submission & testing
- [ ] Peer comparisons (anonymized)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

### Adding New Patterns

1. Insert into `patterns` table:
```sql
INSERT INTO patterns (name, slug, description, explanation, when_to_use, order_index)
VALUES ('New Pattern', 'new-pattern', 'Description...', 'Explanation...', 'When to use...', 28);
```

2. Add questions:
```sql
INSERT INTO questions (pattern_id, title, difficulty, leetcode_link, ...)
VALUES ((SELECT id FROM patterns WHERE slug = 'new-pattern'), 'Problem Title', 'medium', 'https://...', ...);
```

3. Update pattern metadata (explanation, triggers, mistakes)

### Code Style
- Use TypeScript
- Follow existing component patterns
- Add comments for complex logic
- Test locally before committing

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Search GitHub issues
3. Create new issue with details
4. Tag as: `bug`, `feature`, `question`

---

## 📄 License

MIT License - Feel free to fork and customize!

---

**Remember**: This platform is about building thinking patterns, not collecting problem counts. Focus on understanding, and the solutions will follow. 🚀
