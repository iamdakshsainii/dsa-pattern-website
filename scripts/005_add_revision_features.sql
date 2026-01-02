-- Add interview mode tracking to user_progress
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS interview_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS interview_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;

-- Create revision schedules table for spaced repetition
CREATE TABLE IF NOT EXISTS public.revision_schedules (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  next_review_date TIMESTAMP WITH TIME ZONE NOT NULL,
  review_count INTEGER DEFAULT 0,
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5) DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS for revision schedules
ALTER TABLE public.revision_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for revision_schedules
CREATE POLICY "revision_select_own" ON public.revision_schedules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "revision_insert_own" ON public.revision_schedules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "revision_update_own" ON public.revision_schedules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "revision_delete_own" ON public.revision_schedules FOR DELETE USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_revision_schedules_user_id ON public.revision_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_revision_schedules_next_review ON public.revision_schedules(next_review_date);

-- Add pattern explanation fields
ALTER TABLE public.patterns 
ADD COLUMN IF NOT EXISTS when_to_use TEXT,
ADD COLUMN IF NOT EXISTS when_not_to_use TEXT,
ADD COLUMN IF NOT EXISTS common_mistakes TEXT,
ADD COLUMN IF NOT EXISTS time_complexity TEXT,
ADD COLUMN IF NOT EXISTS space_complexity TEXT;

-- Add question explanation fields
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS pattern_trigger TEXT,
ADD COLUMN IF NOT EXISTS hints TEXT;
