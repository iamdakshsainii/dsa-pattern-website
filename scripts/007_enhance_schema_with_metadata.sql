-- Add pattern metadata for better learning experience
ALTER TABLE public.patterns ADD COLUMN IF NOT EXISTS explanation TEXT;
ALTER TABLE public.patterns ADD COLUMN IF NOT EXISTS when_to_use TEXT;
ALTER TABLE public.patterns ADD COLUMN IF NOT EXISTS common_mistakes TEXT;
ALTER TABLE public.patterns ADD COLUMN IF NOT EXISTS time_complexity TEXT;
ALTER TABLE public.patterns ADD COLUMN IF NOT EXISTS space_complexity TEXT;
ALTER TABLE public.patterns ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'intermediate';

-- Add question metadata for pattern-based learning
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS pattern_trigger TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS common_mistake TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS youtube_link TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS gfg_link TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS leetcode_link TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS problem_level TEXT DEFAULT 'stabilization';
-- problem_level can be: discovery, stabilization, twist, interview

-- Add confidence tracking to user progress
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS confidence_level INTEGER DEFAULT 0;
-- confidence_level: 0 = not attempted, 1 = need practice, 2 = comfortable, 3 = confident
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS last_revised_at TIMESTAMPTZ;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS revision_count INTEGER DEFAULT 0;

-- Update existing patterns with metadata (Two Pointers example)
UPDATE public.patterns 
SET 
  explanation = 'Two Pointers is a technique where you use two indices to traverse a data structure, typically moving towards or away from each other. This pattern is extremely efficient for sorted arrays and linked lists.',
  when_to_use = 'Use when: Array is sorted, You need to find pairs/triplets, Comparing elements from both ends, Partitioning arrays',
  common_mistakes = 'Not handling edge cases (empty array), Moving pointers incorrectly, Missing duplicate elements, Not considering sorted vs unsorted',
  time_complexity = 'O(n) for single pass, O(n²) for nested loops',
  space_complexity = 'O(1) in most cases',
  difficulty_level = 'beginner'
WHERE slug = 'two-pointers';

UPDATE public.patterns 
SET 
  explanation = 'Sliding Window optimizes problems involving contiguous subarrays or substrings. You maintain a window that slides through the data structure, expanding and contracting based on conditions.',
  when_to_use = 'Use when: Finding subarrays/substrings, Maximum/minimum values in windows, Fixed or variable window size problems, String pattern matching',
  common_mistakes = 'Not understanding fixed vs variable window, Incorrectly updating window bounds, Missing edge cases with window size, Not removing elements properly',
  time_complexity = 'O(n) - each element visited at most twice',
  space_complexity = 'O(k) where k is distinct elements',
  difficulty_level = 'intermediate'
WHERE slug = 'sliding-window';

UPDATE public.patterns 
SET 
  explanation = 'Fast & Slow pointers (Floyd''s algorithm) uses two pointers moving at different speeds to detect cycles, find middle elements, or solve linked list problems elegantly.',
  when_to_use = 'Use when: Detecting cycles in linked lists, Finding middle of linked list, Detecting duplicates in arrays, Problems with circular references',
  common_mistakes = 'Not handling null pointers, Incorrect speed ratios, Missing cycle entry point logic, Not considering odd/even list lengths',
  time_complexity = 'O(n) for cycle detection',
  space_complexity = 'O(1) - no extra space needed',
  difficulty_level = 'intermediate'
WHERE slug = 'fast-slow-pointers';

UPDATE public.patterns 
SET 
  explanation = 'Tree DFS explores trees by going as deep as possible before backtracking. Includes preorder, inorder, and postorder traversals, each useful for different scenarios.',
  when_to_use = 'Use when: Traversing entire tree, Path problems, Tree construction, Checking tree properties, Serialization',
  common_mistakes = 'Mixing up traversal orders, Not handling null nodes, Incorrect recursion base cases, Missing return values',
  time_complexity = 'O(n) - visit each node once',
  space_complexity = 'O(h) where h is tree height (recursion stack)',
  difficulty_level = 'intermediate'
WHERE slug = 'tree-dfs';

-- Add pattern triggers to sample questions
UPDATE public.questions 
SET 
  pattern_trigger = 'Keywords: "sorted array", "two sum", "pair" → Think two pointers from both ends',
  common_mistake = 'Forgetting to handle the case when array has duplicates',
  youtube_link = 'https://www.youtube.com/watch?v=cQ1Oz4ckceM',
  leetcode_link = 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
  problem_level = 'discovery'
WHERE title = 'Pair with Target Sum';

UPDATE public.questions 
SET 
  pattern_trigger = 'Keywords: "cycle", "linked list" → Use fast (2x) and slow (1x) pointers',
  common_mistake = 'Not checking if list is empty or has only one node',
  youtube_link = 'https://www.youtube.com/watch?v=gBTe7lFR3vc',
  leetcode_link = 'https://leetcode.com/problems/linked-list-cycle/',
  problem_level = 'discovery'
WHERE title = 'LinkedList Cycle';

UPDATE public.questions 
SET 
  pattern_trigger = 'Keywords: "subarray", "maximum sum", "size K" → Fixed window sliding window',
  common_mistake = 'Not sliding the window correctly - must remove first element when adding new one',
  gfg_link = 'https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1',
  problem_level = 'discovery'
WHERE title = 'Maximum Sum Subarray of Size K';

UPDATE public.questions 
SET 
  pattern_trigger = 'Keywords: "maximum subarray" → Classic Kadane''s algorithm',
  common_mistake = 'Not handling all negative numbers correctly',
  youtube_link = 'https://www.youtube.com/watch?v=5WZl3MMT0Eg',
  leetcode_link = 'https://leetcode.com/problems/maximum-subarray/',
  problem_level = 'discovery'
WHERE title = 'Maximum Subarray Sum';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_pattern_level ON public.questions(problem_level);
CREATE INDEX IF NOT EXISTS idx_user_progress_confidence ON public.user_progress(confidence_level);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_revised ON public.user_progress(last_revised_at);
