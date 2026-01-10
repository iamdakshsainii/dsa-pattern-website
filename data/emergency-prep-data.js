export const EMERGENCY_PREP_DATA = {
  patterns: [
    {
      name: 'Two Pointers',
      when: 'Sorted array, pairs, triplets',
      complexity: 'O(n)',
      tip: 'Start from both ends'
    },
    {
      name: 'Sliding Window',
      when: 'Subarray/substring problems',
      complexity: 'O(n)',
      tip: 'Expand window, then shrink'
    },
    {
      name: 'Fast & Slow Pointers',
      when: 'Cycle detection, middle element',
      complexity: 'O(n)',
      tip: 'Slow moves 1, fast moves 2'
    },
    {
      name: 'Binary Search',
      when: 'Sorted array, search space',
      complexity: 'O(log n)',
      tip: 'Always think: can I eliminate half?'
    },
    {
      name: 'BFS',
      when: 'Shortest path, level-order',
      complexity: 'O(V+E)',
      tip: 'Use queue, process level by level'
    },
    {
      name: 'DFS',
      when: 'All paths, backtracking',
      complexity: 'O(V+E)',
      tip: 'Use recursion or stack'
    },
    {
      name: 'Dynamic Programming',
      when: 'Optimization, counting ways',
      complexity: 'Varies',
      tip: 'Start with recursion, then memoize'
    },
    {
      name: 'Hash Map',
      when: 'Frequency, lookup',
      complexity: 'O(n)',
      tip: 'Trade space for time'
    },
    {
      name: 'Heap',
      when: 'Top K, median, priority',
      complexity: 'O(n log k)',
      tip: 'Min heap for largest, max heap for smallest'
    },
    {
      name: 'Union Find',
      when: 'Connected components, cycles',
      complexity: 'O(α(n))',
      tip: 'Path compression + union by rank'
    }
  ],

  complexity: [
    { notation: 'O(1)', name: 'Constant', example: 'Array access, hash lookup' },
    { notation: 'O(log n)', name: 'Logarithmic', example: 'Binary search' },
    { notation: 'O(n)', name: 'Linear', example: 'Single loop' },
    { notation: 'O(n log n)', name: 'Linearithmic', example: 'Merge sort, quick sort' },
    { notation: 'O(n²)', name: 'Quadratic', example: 'Nested loops' },
    { notation: 'O(2ⁿ)', name: 'Exponential', example: 'Recursive subsets' }
  ],

  mistakes: [
    {
      mistake: 'Jumping into code immediately',
      fix: 'Always clarify requirements and ask about edge cases first'
    },
    {
      mistake: 'Not discussing approach before coding',
      fix: 'Explain your high-level approach and get interviewer buy-in'
    },
    {
      mistake: 'Silent coding',
      fix: 'Think out loud! Explain your thought process continuously'
    },
    {
      mistake: 'Ignoring edge cases',
      fix: 'Always test: empty input, single element, duplicates, negatives'
    },
    {
      mistake: 'Not testing your code',
      fix: 'Dry run with 2-3 test cases before saying "done"'
    },
    {
      mistake: 'Giving up too quickly',
      fix: 'Ask for hints, discuss trade-offs, show problem-solving skills'
    },
    {
      mistake: 'Not discussing complexity',
      fix: 'Always mention time and space complexity at the end'
    },
    {
      mistake: 'Poor variable names',
      fix: 'Use meaningful names even in interviews (except i, j for loops)'
    }
  ],

  confidenceTips: [
    '🧘 Take a deep breath. You\'ve prepared for this.',
    '💪 You only need to solve 60-70% to pass most interviews',
    '🗣️ Asking questions shows you\'re thoughtful, not unprepared',
    '⏸️ It\'s okay to pause and think for 30 seconds',
    '🤝 The interviewer wants you to succeed',
    '📝 Writing pseudocode first is perfectly acceptable',
    '🔄 Getting hints is normal - shows you can take feedback'
  ],

  lastMinute: [
    '✅ Test your camera and mic 30 minutes before',
    '✅ Have pen and paper ready for diagrams',
    '✅ Close all other browser tabs and apps',
    '✅ Keep water nearby',
    '✅ Charge your laptop fully',
    '✅ Have backup internet (phone hotspot)',
    '📵 Turn off notifications',
    '😴 Get at least 7 hours of sleep - seriously!'
  ]
};
