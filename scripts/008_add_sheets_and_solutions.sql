-- Add sheets table for multiple curated problem lists
CREATE TABLE IF NOT EXISTS public.sheets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  creator TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'mixed')),
  total_problems INTEGER DEFAULT 0,
  color_theme TEXT, -- hex color for sheet theme
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sheet_questions junction table
CREATE TABLE IF NOT EXISTS public.sheet_questions (
  id SERIAL PRIMARY KEY,
  sheet_id INTEGER NOT NULL REFERENCES public.sheets(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sheet_id, question_id)
);

-- Add solutions table
CREATE TABLE IF NOT EXISTS public.solutions (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  approach_type TEXT CHECK (approach_type IN ('brute', 'better', 'optimal')) NOT NULL,
  title TEXT NOT NULL,
  explanation TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  code_snippet TEXT,
  pros TEXT,
  cons TEXT,
  when_to_use TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS
ALTER TABLE public.sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sheet_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sheets (public read)
CREATE POLICY "sheets_select_all" ON public.sheets FOR SELECT USING (true);

-- RLS Policies for sheet_questions (public read)
CREATE POLICY "sheet_questions_select_all" ON public.sheet_questions FOR SELECT USING (true);

-- RLS Policies for solutions (public read)
CREATE POLICY "solutions_select_all" ON public.solutions FOR SELECT USING (true);

-- RLS Policies for bookmarks
CREATE POLICY "bookmarks_select_own" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_insert_own" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks_delete_own" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_sheet_questions_sheet_id ON public.sheet_questions(sheet_id);
CREATE INDEX idx_sheet_questions_question_id ON public.sheet_questions(question_id);
CREATE INDEX idx_solutions_question_id ON public.solutions(question_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_question_id ON public.bookmarks(question_id);

-- Insert popular sheets
INSERT INTO public.sheets (name, slug, description, creator, difficulty_level, total_problems, color_theme, order_index) VALUES
('Blind 75', 'blind-75', 'The famous 75 LeetCode questions that cover all important patterns. Perfect for interview prep.', 'Blind (Tech Lead)', 'intermediate', 75, '#6366f1', 1),
('NeetCode 150', 'neetcode-150', 'Comprehensive list of 150 problems covering all patterns. Organized by pattern difficulty.', 'NeetCode', 'mixed', 150, '#f59e0b', 2),
('Striver A2Z DSA Sheet', 'striver-a2z', 'Complete A to Z DSA sheet by Striver. From basics to advanced with 450+ problems.', 'Striver (Raj Vikramaditya)', 'beginner', 450, '#10b981', 3),
('Grind 169', 'grind-169', 'Extended version of Blind 75 with 169 questions. More comprehensive interview prep.', 'Tech Interview Handbook', 'intermediate', 169, '#8b5cf6', 4),
('LeetCode Top 100', 'leetcode-top-100', 'Top 100 liked questions on LeetCode. Community favorite problems.', 'LeetCode Community', 'mixed', 100, '#ef4444', 5),
('AlgoExpert 160', 'algoexpert-160', '160 hand-picked questions covering all important concepts and patterns.', 'AlgoExpert', 'intermediate', 160, '#06b6d4', 6),
('Love Babbar 450', 'love-babbar-450', 'Famous 450 DSA questions sheet. Covers all topics comprehensively.', 'Love Babbar', 'beginner', 450, '#ec4899', 7);
