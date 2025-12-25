-- Prefix Sum Pattern
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'prefix-sum'), 'Subarray Sum Equals K', 'easy', 'https://leetcode.com/problems/subarray-sum-equals-k/description/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'prefix-sum'), 'Find Pivot Index', 'easy', 'https://leetcode.com/problems/find-pivot-index/description/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'prefix-sum'), 'Subarray Sums Divisible By K', 'medium', 'https://leetcode.com/problems/subarray-sums-divisible-by-k/description/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'prefix-sum'), 'Contiguous Array', 'medium', 'https://leetcode.com/problems/contiguous-array/description/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'prefix-sum'), 'Shortest Subarray With Sum at Least K', 'hard', 'https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/description/', NULL, NULL, 5),
((SELECT id FROM public.patterns WHERE slug = 'prefix-sum'), 'Count Range Sum', 'hard', 'https://leetcode.com/problems/count-of-range-sum/description/', NULL, NULL, 6);

-- Merge Intervals
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'merge-intervals'), 'Merge Intervals', 'medium', 'https://leetcode.com/problems/merge-intervals/description/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'merge-intervals'), 'Insert Interval', 'medium', 'https://leetcode.com/problems/insert-interval/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'merge-intervals'), 'Intervals Intersection', 'medium', 'https://leetcode.com/problems/interval-list-intersections/description/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'merge-intervals'), 'Overlapping Intervals', 'medium', 'https://www.geeksforgeeks.org/check-if-any-two-intervals-overlap-among-a-given-set-of-intervals/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'merge-intervals'), 'Minimum Meeting Rooms', 'hard', 'https://www.geeksforgeeks.org/problems/attend-all-meetings-ii/1', NULL, NULL, 5),
((SELECT id FROM public.patterns WHERE slug = 'merge-intervals'), 'Maximum CPU Load', 'hard', 'https://www.geeksforgeeks.org/maximum-cpu-load-from-the-given-list-of-jobs/', NULL, NULL, 6),
((SELECT id FROM public.patterns WHERE slug = 'merge-intervals'), 'Employee Free Time', 'hard', 'https://www.codertrain.co/employee-free-time', NULL, NULL, 7);

-- Stack Pattern
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'stack'), 'Remove Adjacent Duplicates', 'easy', 'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/description/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'stack'), 'Balanced Parentheses', 'easy', 'https://leetcode.com/problems/valid-parentheses/description/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'stack'), 'Next Greater Element', 'easy', 'https://leetcode.com/problems/next-greater-element-ii/description/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'stack'), 'Daily Temperatures', 'easy', 'https://leetcode.com/problems/daily-temperatures/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'stack'), 'Remove Nodes From Linked List', 'easy', 'https://leetcode.com/problems/remove-nodes-from-linked-list/', NULL, NULL, 5),
((SELECT id FROM public.patterns WHERE slug = 'stack'), 'Remove All Adjacent Duplicates in String II', 'medium', 'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/', NULL, NULL, 6),
((SELECT id FROM public.patterns WHERE slug = 'stack'), 'Simplify Path', 'medium', 'https://leetcode.com/problems/simplify-path/', NULL, NULL, 7),
((SELECT id FROM public.patterns WHERE slug = 'stack'), 'Remove K Digits', 'hard', 'https://leetcode.com/problems/remove-k-digits/', NULL, NULL, 8);

-- Continuing with remaining patterns (abbreviated for space)
-- In production, all ~200+ questions would be seeded
