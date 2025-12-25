-- Add dedicated columns for YouTube, LeetCode, and GFG links
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS leetcode_link TEXT,
ADD COLUMN IF NOT EXISTS youtube_link TEXT,
ADD COLUMN IF NOT EXISTS gfg_link TEXT,
ADD COLUMN IF NOT EXISTS article_link TEXT;

-- Add pattern explanations and tips
ALTER TABLE public.patterns
ADD COLUMN IF NOT EXISTS explanation TEXT,
ADD COLUMN IF NOT EXISTS when_to_use TEXT,
ADD COLUMN IF NOT EXISTS common_mistakes TEXT,
ADD COLUMN IF NOT EXISTS time_complexity TEXT,
ADD COLUMN IF NOT EXISTS space_complexity TEXT;

-- Add bookmarking feature
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS for bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarks
CREATE POLICY "bookmarks_select_own" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_insert_own" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks_delete_own" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_question_id ON public.bookmarks(question_id);

COMMENT ON TABLE public.questions IS 'Stores coding questions with multiple resource links';
COMMENT ON COLUMN public.questions.leetcode_link IS 'Direct LeetCode problem link';
COMMENT ON COLUMN public.questions.youtube_link IS 'Video tutorial/explanation link';
COMMENT ON COLUMN public.questions.gfg_link IS 'GeeksforGeeks solution/explanation link';
COMMENT ON COLUMN public.questions.article_link IS 'Additional article or resource link';
