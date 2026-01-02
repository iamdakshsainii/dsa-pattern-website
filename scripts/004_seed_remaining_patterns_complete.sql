-- Cyclic Sort Pattern
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'cyclic-sort'), 'Cyclic Sort', 'easy', 'https://www.geeksforgeeks.org/sort-an-array-which-contain-1-to-n-values-in-on-using-cycle-sort/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'cyclic-sort'), 'Find the Missing Number', 'easy', 'https://leetcode.com/problems/missing-number/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'cyclic-sort'), 'Find all Missing Numbers', 'easy', 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'cyclic-sort'), 'Find the Duplicate Number', 'easy', 'https://leetcode.com/problems/find-the-duplicate-number/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'cyclic-sort'), 'Find all Duplicate Numbers', 'easy', 'https://leetcode.com/problems/find-all-duplicates-in-an-array/', NULL, NULL, 5),
((SELECT id FROM public.patterns WHERE slug = 'cyclic-sort'), 'Find the Corrupt Pair', 'easy', 'https://thecodingsimplified.com/find-currupt-pair/', NULL, NULL, 6),
((SELECT id FROM public.patterns WHERE slug = 'cyclic-sort'), 'Find the Smallest Missing Positive Number', 'medium', 'https://leetcode.com/problems/first-missing-positive/', NULL, NULL, 7),
((SELECT id FROM public.patterns WHERE slug = 'cyclic-sort'), 'Find the First K Missing Positive Numbers', 'hard', 'https://thecodingsimplified.com/find-the-first-k-missing-positive-number/', NULL, NULL, 8);

-- In-place Reversal of LinkedList
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'linked-list-reversal'), 'Reverse a LinkedList', 'easy', 'https://leetcode.com/problems/reverse-linked-list/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'linked-list-reversal'), 'Reverse a Sub-list', 'medium', 'https://leetcode.com/problems/reverse-linked-list-ii/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'linked-list-reversal'), 'Reverse every K-element Sub-list', 'medium', 'https://leetcode.com/problems/reverse-nodes-in-k-group/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'linked-list-reversal'), 'Reverse alternating K-element Sub-list', 'medium', 'https://www.geeksforgeeks.org/reverse-alternate-k-nodes-in-a-singly-linked-list/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'linked-list-reversal'), 'Rotate a LinkedList', 'medium', 'https://leetcode.com/problems/rotate-list/', NULL, NULL, 5);

-- Hash Maps
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'hash-maps'), 'First Non-repeating Character', 'easy', 'https://leetcode.com/problems/first-unique-character-in-a-string/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'hash-maps'), 'Maximum Number of Balloons', 'easy', 'https://leetcode.com/problems/maximum-number-of-balloons/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'hash-maps'), 'Longest Palindrome', 'easy', 'https://leetcode.com/problems/longest-palindrome/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'hash-maps'), 'Ransom Note', 'easy', 'https://leetcode.com/problems/ransom-note/', NULL, NULL, 4);

-- Tree BFS
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Binary Tree Level Order Traversal', 'easy', 'https://leetcode.com/problems/binary-tree-level-order-traversal/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Reverse Level Order Traversal', 'easy', 'https://leetcode.com/problems/binary-tree-level-order-traversal-ii/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Zigzag Traversal', 'medium', 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Level Averages in a Binary Tree', 'easy', 'https://leetcode.com/problems/average-of-levels-in-binary-tree/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Minimum Depth of a Binary Tree', 'easy', 'https://leetcode.com/problems/minimum-depth-of-binary-tree/', NULL, NULL, 5),
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Maximum Depth of a Binary Tree', 'easy', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', NULL, NULL, 6),
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Level Order Successor', 'easy', 'https://www.geeksforgeeks.org/level-order-successor-of-a-node-in-binary-tree/', NULL, NULL, 7),
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Connect Level Order Siblings', 'medium', 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/', NULL, NULL, 8),
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Connect All Level Order Siblings', 'medium', 'https://www.educative.io/m/connect-all-siblings', NULL, NULL, 9),
((SELECT id FROM public.patterns WHERE slug = 'tree-bfs'), 'Right View of a Binary Tree', 'easy', 'https://leetcode.com/problems/binary-tree-right-side-view/', NULL, NULL, 10);

-- Tree DFS
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'tree-dfs'), 'Binary Tree Path Sum', 'easy', 'https://leetcode.com/problems/path-sum/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'tree-dfs'), 'All Paths for a Sum', 'medium', 'https://leetcode.com/problems/path-sum-iii/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'tree-dfs'), 'Sum of Path Numbers', 'medium', 'https://leetcode.com/problems/sum-root-to-leaf-numbers/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'tree-dfs'), 'Path With Given Sequence', 'medium', 'https://www.geeksforgeeks.org/check-root-leaf-path-given-sequence/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'tree-dfs'), 'Count Paths for a Sum', 'medium', 'https://leetcode.com/problems/path-sum-iii/', NULL, NULL, 5),
((SELECT id FROM public.patterns WHERE slug = 'tree-dfs'), 'Tree Diameter', 'medium', 'https://leetcode.com/problems/diameter-of-binary-tree/', NULL, NULL, 6),
((SELECT id FROM public.patterns WHERE slug = 'tree-dfs'), 'Path with Maximum Sum', 'hard', 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', NULL, NULL, 7);

-- Graphs
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'graphs'), 'Find if Path Exists in Graph', 'easy', 'https://leetcode.com/problems/find-if-path-exists-in-graph/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'graphs'), 'Number of Provinces', 'medium', 'https://leetcode.com/problems/number-of-provinces/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'graphs'), 'Minimum Number of Vertices to Reach All Nodes', 'medium', 'https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/', NULL, NULL, 3);

-- Islands
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'islands'), 'Number of Islands', 'easy', 'https://leetcode.com/problems/number-of-islands/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'islands'), 'Flood Fill', 'easy', 'https://leetcode.com/problems/flood-fill/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'islands'), 'Number of Closed Islands', 'easy', 'https://leetcode.com/problems/number-of-closed-islands/', NULL, NULL, 3);

-- Two Heaps
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'two-heaps'), 'Find the Median of a Number Stream', 'medium', 'https://leetcode.com/problems/find-median-from-data-stream/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'two-heaps'), 'Sliding Window Median', 'hard', 'https://leetcode.com/problems/sliding-window-median/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'two-heaps'), 'Maximize Capital', 'hard', 'https://leetcode.com/problems/ipo/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'two-heaps'), 'Maximum Sum Combinations', 'medium', 'https://www.interviewbit.com/problems/maximum-sum-combinations/', NULL, NULL, 4);

-- Subsets
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'subsets'), 'Subsets', 'easy', 'https://www.educative.io/courses/grokking-the-coding-interview/gx2OqlvEnWG', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'subsets'), 'Subsets With Duplicates', 'easy', 'https://www.educative.io/courses/grokking-the-coding-interview/7npk3V3JQNr', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'subsets'), 'Permutations', 'medium', 'https://www.educative.io/courses/grokking-the-coding-interview/B8R83jyN3KY', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'subsets'), 'Unique Generalized Abbreviations', 'hard', 'https://leetcode.com/problems/generalized-abbreviation/', NULL, NULL, 4);

-- Modified Binary Search
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Order-agnostic Binary Search', 'easy', 'https://www.geeksforgeeks.org/order-agnostic-binary-search/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Ceiling of a Number', 'medium', 'https://www.geeksforgeeks.org/ceiling-in-a-sorted-array/', 'https://www.geeksforgeeks.org/floor-in-a-sorted-array/', NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Next Letter', 'medium', 'https://leetcode.com/problems/find-smallest-letter-greater-than-target/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Number Range', 'medium', 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Search in a Sorted Infinite Array', 'medium', 'https://www.geeksforgeeks.org/find-position-element-sorted-array-infinite-numbers/', NULL, NULL, 5),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Bitonic Array Maximum', 'easy', 'https://www.geeksforgeeks.org/find-the-maximum-element-in-an-array-which-is-first-increasing-and-then-decreasing/', NULL, NULL, 6),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Search Bitonic Array', 'medium', 'https://leetcode.com/problems/find-in-mountain-array/', NULL, NULL, 7),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Search in Rotated Array', 'medium', 'https://leetcode.com/problems/search-in-rotated-sorted-array/', NULL, NULL, 8),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Rotation Count', 'medium', 'https://www.geeksforgeeks.org/find-rotation-count-rotated-sorted-array/', NULL, NULL, 9),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Search a 2D Matrix', 'medium', 'https://leetcode.com/problems/search-a-2d-matrix/', NULL, NULL, 10),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Minimum Number of Days to Make m Bouquets', 'medium', 'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/', NULL, NULL, 11),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Koko Eating Bananas', 'medium', 'https://leetcode.com/problems/koko-eating-bananas/', NULL, NULL, 12),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Capacity To Ship Packages Within D Days', 'medium', 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', NULL, NULL, 13),
((SELECT id FROM public.patterns WHERE slug = 'modified-binary-search'), 'Median of Two Sorted Arrays', 'hard', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', NULL, NULL, 14);

-- Top K Elements
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'top-k-elements'), 'Top K Numbers', 'easy', 'https://github.com/dipjul/Grokking-the-Coding-Interview-Patterns-for-Coding-Questions/blob/master/13.-pattern-top-k-elements/02.top-k-numbers.md', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'top-k-elements'), 'K Closest Points to the Origin', 'easy', 'https://leetcode.com/problems/k-closest-points-to-origin/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'top-k-elements'), 'Kth Largest Number in a Stream', 'medium', 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', NULL, NULL, 3);

-- K-way Merge
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'k-way-merge'), 'Merge K Sorted Lists', 'medium', 'https://leetcode.com/problems/merge-k-sorted-lists/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'k-way-merge'), 'Kth Smallest Number in M Sorted Lists', 'medium', 'https://www.geeksforgeeks.org/find-m-th-smallest-value-in-k-sorted-arrays/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'k-way-merge'), 'Kth Smallest Number in a Sorted Matrix', 'hard', 'https://www.educative.io/courses/grokking-the-coding-interview/x1NJVYKNvqz', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'k-way-merge'), 'Smallest Number Range', 'hard', 'https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/', NULL, NULL, 4);

-- Greedy
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'greedy'), 'Valid Palindrome II', 'easy', 'https://leetcode.com/problems/valid-palindrome-ii/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'greedy'), 'Maximum Length of Pair Chain', 'medium', 'https://leetcode.com/problems/maximum-length-of-pair-chain/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'greedy'), 'Minimum Add to Make Parentheses Valid', 'medium', 'https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'greedy'), 'Remove Duplicate Letters', 'medium', 'https://leetcode.com/problems/remove-duplicate-letters/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'greedy'), 'Largest Palindromic Number', 'medium', 'https://leetcode.com/problems/largest-palindromic-number/', NULL, NULL, 5),
((SELECT id FROM public.patterns WHERE slug = 'greedy'), 'Removing Minimum and Maximum From Array', 'medium', 'https://leetcode.com/problems/removing-minimum-and-maximum-from-array/', NULL, NULL, 6);

-- Knapsack DP
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'knapsack-dp'), '0/1 Knapsack', 'medium', 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'knapsack-dp'), 'Equal Subset Sum Partition', 'medium', 'https://leetcode.com/problems/partition-equal-subset-sum/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'knapsack-dp'), 'Subset Sum', 'medium', 'https://www.geeksforgeeks.org/subset-sum-problem-dp-25/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'knapsack-dp'), 'Minimum Subset Sum Difference', 'hard', 'https://www.geeksforgeeks.org/partition-a-set-into-two-subsets-such-that-the-difference-of-subset-sums-is-minimum/', NULL, NULL, 4);

-- Backtracking
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'backtracking'), 'Combination Sum', 'medium', 'https://leetcode.com/problems/combination-sum/', 'https://leetcode.com/problems/combination-sum-ii/', 'https://leetcode.com/problems/combination-sum-iii/', 1),
((SELECT id FROM public.patterns WHERE slug = 'backtracking'), 'Word Search', 'medium', 'https://leetcode.com/problems/word-search/', 'https://leetcode.com/problems/word-search-ii/', NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'backtracking'), 'Sudoku Solver', 'hard', 'https://leetcode.com/problems/sudoku-solver/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'backtracking'), 'Factor Combinations', 'medium', 'https://leetcode.com/problems/factor-combinations/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'backtracking'), 'Split a String Into the Max Number of Unique Substrings', 'medium', 'https://leetcode.com/problems/split-a-string-into-the-max-number-of-unique-substrings/', NULL, NULL, 5);

-- Trie
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'trie'), 'Implement Trie (Prefix Tree)', 'medium', 'https://leetcode.com/problems/implement-trie-prefix-tree/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'trie'), 'Index Pairs of a String', 'easy', 'https://leetcode.com/problems/index-pairs-of-a-string/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'trie'), 'Design Add and Search Words Data Structure', 'medium', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'trie'), 'Extra Characters in a String', 'medium', 'https://leetcode.com/problems/extra-characters-in-a-string/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'trie'), 'Search Suggestions System', 'medium', 'https://leetcode.com/problems/search-suggestions-system/', NULL, NULL, 5);

-- Topological Sort
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'topological-sort'), 'Topological Sort', 'medium', 'https://www.youtube.com/watch?v=cIBFEhD77b4', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'topological-sort'), 'Tasks Scheduling', 'medium', 'https://leetcode.com/problems/course-schedule/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'topological-sort'), 'Tasks Scheduling Order', 'medium', 'https://leetcode.com/problems/course-schedule/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'topological-sort'), 'All Tasks Scheduling Orders', 'hard', 'https://leetcode.com/problems/course-schedule-ii/', NULL, NULL, 4),
((SELECT id FROM public.patterns WHERE slug = 'topological-sort'), 'Alien Dictionary', 'hard', 'https://leetcode.com/problems/alien-dictionary/', NULL, NULL, 5),
((SELECT id FROM public.patterns WHERE slug = 'topological-sort'), 'Reconstructing a Sequence', 'hard', 'https://leetcode.com/problems/sequence-reconstruction/', NULL, NULL, 6),
((SELECT id FROM public.patterns WHERE slug = 'topological-sort'), 'Minimum Height Trees', 'hard', 'https://leetcode.com/problems/minimum-height-trees/', NULL, NULL, 7);

-- Union Find
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'union-find'), 'Redundant Connection', 'medium', 'https://leetcode.com/problems/redundant-connection/', 'https://leetcode.com/problems/redundant-connection-ii/', NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'union-find'), 'Number of Provinces', 'medium', 'https://leetcode.com/problems/number-of-provinces/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'union-find'), 'Is Graph Bipartite?', 'medium', 'https://leetcode.com/problems/is-graph-bipartite/', NULL, NULL, 3),
((SELECT id FROM public.patterns WHERE slug = 'union-find'), 'Path With Minimum Effort', 'medium', 'https://leetcode.com/problems/path-with-minimum-effort/', NULL, NULL, 4);

-- Ordered Set
INSERT INTO public.questions (pattern_id, title, difficulty, link1, link2, link3, order_index) VALUES
((SELECT id FROM public.patterns WHERE slug = 'ordered-set'), 'Merge Similar Items', 'easy', 'https://leetcode.com/problems/merge-similar-items/', NULL, NULL, 1),
((SELECT id FROM public.patterns WHERE slug = 'ordered-set'), '132 Pattern', 'medium', 'https://leetcode.com/problems/132-pattern/', NULL, NULL, 2),
((SELECT id FROM public.patterns WHERE slug = 'ordered-set'), 'My Calendar I', 'medium', 'https://leetcode.com/problems/my-calendar-i/', 'https://leetcode.com/problems/my-calendar-ii/', 'https://leetcode.com/problems/my-calendar-iii/', 3);
