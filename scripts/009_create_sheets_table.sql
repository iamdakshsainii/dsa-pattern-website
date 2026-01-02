-- Create sheets table for curated problem lists
CREATE TABLE IF NOT EXISTS public.sheets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color_theme TEXT DEFAULT '#6366f1',
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  total_problems INTEGER DEFAULT 0,
  creator TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sheets ENABLE ROW LEVEL SECURITY;

-- RLS Policy for sheets (public read)
CREATE POLICY "sheets_select_all" ON public.sheets FOR SELECT USING (true);

-- Insert the 7 curated sheets
INSERT INTO public.sheets (name, slug, description, color_theme, difficulty_level, total_problems, creator, order_index) VALUES
('Blind 75', 'blind-75', 'The essential 75 LeetCode questions curated by a former Facebook engineer. Perfect for interview prep.', '#3b82f6', 'intermediate', 75, 'Blind Community', 1),
('NeetCode 150', 'neetcode-150', 'NeetCode''s hand-picked 150 questions covering all major patterns with video explanations.', '#8b5cf6', 'intermediate', 150, 'NeetCode', 2),
('Striver A2Z DSA', 'striver-a2z', 'Comprehensive A to Z Data Structures and Algorithms sheet by Striver covering 450+ problems.', '#ec4899', 'beginner', 450, 'Striver', 3),
('Grind 169', 'grind-169', 'An extension of Blind 75 with 169 questions organized by topic and difficulty.', '#f59e0b', 'intermediate', 169, 'Tech Interview Handbook', 4),
('LeetCode Top 100', 'leetcode-top-100', 'LeetCode''s most liked and frequently asked 100 problems across all difficulty levels.', '#10b981', 'intermediate', 100, 'LeetCode', 5),
('AlgoExpert 160', 'algoexpert-160', '160 curated questions from AlgoExpert covering fundamental to advanced algorithms.', '#06b6d4', 'advanced', 160, 'AlgoExpert', 6),
('Love Babbar 450', 'love-babbar-450', 'Love Babbar''s famous 450 DSA questions sheet covering all topics comprehensively.', '#f43f5e', 'beginner', 450, 'Love Babbar', 7);
