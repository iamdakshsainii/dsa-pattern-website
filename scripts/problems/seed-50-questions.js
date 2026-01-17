// scripts/seed-complete-two-pointers-sliding-window.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI not found in .env.local')
}

// Complete Two Pointers (16 problems) + Sliding Window (14 problems) = 30 total
const questionsData = [
  // ==========================================
  // PATTERN 1: TWO POINTERS (16 PROBLEMS)
  // ==========================================
  {
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "two-sum-ii-input-array-sorted",
    order: 1,
    tags: ["array", "two-pointers"],
    companies: ["Google", "Facebook", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use two pointers from start and end",
      "If sum is too small, move left pointer right",
      "If sum is too large, move right pointer left"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Classic opposite-direction pointers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "remove-duplicates-from-sorted-array",
    order: 2,
    tags: ["array", "two-pointers"],
    companies: ["Facebook", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use two pointers - one for unique, one for scanning",
      "Keep unique elements at the beginning"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Same-direction slow-fast pointer",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Move Zeroes",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "move-zeroes",
    order: 3,
    tags: ["array", "two-pointers"],
    companies: ["Facebook", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/move-zeroes/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Maintain pointer for non-zero elements",
      "Swap non-zero elements to front"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Two-pointer partition technique",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Squares of a Sorted Array",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "squares-of-sorted-array",
    order: 4,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Facebook", "Bloomberg"],
    links: {
      leetcode: "https://leetcode.com/problems/squares-of-a-sorted-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Array can have negative numbers",
      "Compare absolute values from both ends",
      "Fill result array from right to left"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Merge from both ends",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "valid-palindrome",
    order: 5,
    tags: ["string", "two-pointers"],
    companies: ["Facebook", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/valid-palindrome/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Skip non-alphanumeric characters",
      "Compare characters from both ends",
      "Ignore case differences"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Left-right comparison",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Remove Element",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "remove-element",
    order: 6,
    tags: ["array", "two-pointers"],
    companies: ["Google"],
    links: {
      leetcode: "https://leetcode.com/problems/remove-element/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Keep pointer for valid elements",
      "Overwrite elements to remove"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "In-place removal",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sort Colors (Dutch National Flag)",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "sort-colors",
    order: 7,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Microsoft", "Apple", "Adobe"],
    links: {
      leetcode: "https://leetcode.com/problems/sort-colors/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use three pointers: low, mid, high",
      "0s go to low, 2s go to high, 1s stay in middle",
      "Single pass solution"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Three-way partitioning",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "container-with-most-water",
    order: 8,
    tags: ["array", "greedy", "two-pointers"],
    companies: ["Google", "Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/container-with-most-water/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Start with widest container",
      "Move pointer with smaller height",
      "Area = min(height[left], height[right]) * (right - left)"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Greedy pointer movement",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "3sum",
    order: 9,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Facebook", "Amazon", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/3sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort array first",
      "Fix one element, use two pointers for rest",
      "Skip duplicates to avoid duplicate triplets"
    ],
    complexity: { time: "O(n²)", space: "O(1)" },
    keyLearning: "Fix one + two pointers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "3Sum Closest",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "3sum-closest",
    order: 10,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Google"],
    links: {
      leetcode: "https://leetcode.com/problems/3sum-closest/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Similar to 3Sum but track closest sum",
      "Update closest when current sum is closer to target"
    ],
    complexity: { time: "O(n²)", space: "O(1)" },
    keyLearning: "Minimize distance",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "4Sum",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "4sum",
    order: 11,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Facebook", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/4sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Fix two elements, use two pointers for remaining",
      "Similar structure to 3Sum but with nested loop"
    ],
    complexity: { time: "O(n³)", space: "O(1)" },
    keyLearning: "Nested two pointers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    pattern_id: "two-pointers",
    slug: "trapping-rain-water",
    order: 12,
    tags: ["array", "two-pointers", "stack"],
    companies: ["Google", "Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/trapping-rain-water/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Water trapped depends on min of max left and max right heights",
      "Track leftMax and rightMax while moving pointers"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Max height tracking both sides",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Boats to Save People",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "boats-to-save-people",
    order: 13,
    tags: ["array", "greedy", "two-pointers"],
    companies: ["Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/boats-to-save-people/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort people by weight",
      "Try pairing heaviest with lightest",
      "Greedy approach minimizes boats"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Greedy pairing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Partition Labels",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "partition-labels",
    order: 14,
    tags: ["string", "greedy", "two-pointers"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/partition-labels/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find last occurrence of each character",
      "Extend partition to include all occurrences"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Last occurrence tracking",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Backspace String Compare",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "backspace-string-compare",
    order: 15,
    tags: ["string", "two-pointers", "stack"],
    companies: ["Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/backspace-string-compare/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Process strings from end to beginning",
      "Skip characters when encountering '#'"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Process from end",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Valid Palindrome II",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "valid-palindrome-ii",
    order: 16,
    tags: ["string", "two-pointers"],
    companies: ["Facebook", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/valid-palindrome-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "When mismatch found, try skipping left or right character",
      "Check if remaining substring is palindrome"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "One deletion allowed",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ==========================================
  // PATTERN 2: SLIDING WINDOW (14 PROBLEMS)
  // ==========================================
  {
    title: "Maximum Sum Subarray of Size K",
    difficulty: "Easy",
    pattern_id: "sliding-window",
    slug: "max-sum-subarray-of-size-k",
    order: 1,
    tags: ["array", "sliding-window"],
    companies: ["Microsoft", "Amazon"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
      article: ""
    },
    hints: [
      "Calculate sum of first K elements",
      "Slide window by removing first element and adding next",
      "Track maximum sum"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Fixed window foundation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Smallest Subarray with Given Sum",
    difficulty: "Easy",
    pattern_id: "sliding-window",
    slug: "smallest-subarray-with-given-sum",
    order: 2,
    tags: ["array", "sliding-window"],
    companies: ["Amazon"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/minimum-length-subarray-sum-greater-given-value/",
      article: ""
    },
    hints: [
      "Expand window until sum >= target",
      "Shrink window while sum >= target",
      "Track minimum length"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Dynamic window shrinking",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Substring with K Distinct Characters",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "longest-substring-k-distinct-characters",
    order: 3,
    tags: ["string", "sliding-window", "hash-map"],
    companies: ["Google", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use HashMap to track character frequencies",
      "Expand window and add characters",
      "Shrink when distinct characters > K"
    ],
    complexity: { time: "O(n)", space: "O(k)" },
    keyLearning: "HashMap + expansion",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Fruit Into Baskets",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "fruit-into-baskets",
    order: 4,
    tags: ["array", "sliding-window"],
    companies: ["Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/fruit-into-baskets/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "At most 2 different types (K=2)",
      "Same as longest substring with K=2 distinct"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "At most K=2 distinct",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "longest-substring-without-repeating-characters",
    order: 5,
    tags: ["string", "sliding-window", "hash-map"],
    companies: ["Google", "Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use HashMap to track character indices",
      "Expand window and shrink when duplicate found",
      "Move start pointer to position after duplicate"
    ],
    complexity: { time: "O(n)", space: "O(min(m,n))" },
    keyLearning: "Shrink on duplicate",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "longest-repeating-character-replacement",
    order: 6,
    tags: ["string", "sliding-window"],
    companies: ["Facebook", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/longest-repeating-character-replacement/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track max frequency in window",
      "window_size - max_frequency <= K is valid",
      "Shrink window when condition breaks"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "K replacements allowed",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Max Consecutive Ones III",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "max-consecutive-ones-iii",
    order: 7,
    tags: ["array", "sliding-window"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/max-consecutive-ones-iii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count zeros in window",
      "Shrink window when zeros > K",
      "Similar to character replacement"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Flip at most K zeros",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Permutation in String",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "permutation-in-string",
    order: 8,
    tags: ["string", "sliding-window"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/permutation-in-string/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Fixed window size equal to pattern length",
      "Compare character frequencies",
      "Slide window one character at a time"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Fixed window anagram",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find All Anagrams in a String",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "find-all-anagrams-in-string",
    order: 9,
    tags: ["string", "sliding-window"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Similar to permutation in string",
      "Store starting indices of all anagrams"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Sliding hash frequency",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Window Substring",
    difficulty: "Hard",
    pattern_id: "sliding-window",
    slug: "minimum-window-substring",
    order: 10,
    tags: ["string", "sliding-window", "hash-map"],
    companies: ["Google", "Facebook", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/minimum-window-substring/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use two HashMaps - one for window, one for target",
      "Expand until all characters found",
      "Shrink to minimize window"
    ],
    complexity: { time: "O(n)", space: "O(m)" },
    keyLearning: "Complex character count",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "minimum-size-subarray-sum",
    order: 11,
    tags: ["array", "sliding-window"],
    companies: ["Facebook", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/minimum-size-subarray-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Expand window until sum >= target",
      "Shrink window to minimize length"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Shrink for sum >= target",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximum Points You Can Obtain from Cards",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "max-points-from-cards",
    order: 12,
    tags: ["array", "sliding-window"],
    companies: ["Google", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Pick K cards from either end",
      "Minimize sum of middle (n-K) cards",
      "Total - min(middle) = max(ends)"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Window from both ends",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Grumpy Bookstore Owner",
    difficulty: "Medium",
    pattern_id: "sliding-window",
    slug: "grumpy-bookstore-owner",
    order: 13,
    tags: ["array", "sliding-window"],
    companies: ["Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/grumpy-bookstore-owner/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Calculate satisfied customers without technique",
      "Find window of K minutes that maximizes additional satisfied",
      "Add base satisfaction + max additional"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Maximize in window",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    pattern_id: "sliding-window",
    slug: "sliding-window-maximum",
    order: 14,
    tags: ["array", "sliding-window", "deque"],
    companies: ["Google", "Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/sliding-window-maximum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use deque to maintain decreasing elements",
      "Front of deque always has maximum",
      "Remove elements outside window"
    ],
    complexity: { time: "O(n)", space: "O(k)" },
    keyLearning: "Deque for max tracking",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedCompleteQuestions() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting complete Two Pointers & Sliding Window seeding...\n')

    // Check for existing questions for these patterns
    const existingTwoPointers = await questionsCollection.countDocuments({ pattern_id: 'two-pointers' })
    const existingSlidingWindow = await questionsCollection.countDocuments({ pattern_id: 'sliding-window' })

    console.log(`📊 Current state:`)
    console.log(`   Two Pointers: ${existingTwoPointers} questions`)
    console.log(`   Sliding Window: ${existingSlidingWindow} questions\n`)

    if (existingTwoPointers > 0 || existingSlidingWindow > 0) {
      console.log('⚠️  Found existing questions for these patterns')
      console.log('🗑️  Cleaning up old questions...\n')

      await questionsCollection.deleteMany({
        pattern_id: { $in: ['two-pointers', 'sliding-window'] }
      })

      console.log('✅ Cleaned up existing questions\n')
    }

    // Insert all new questions
    console.log('📥 Inserting complete question set...\n')
    const result = await questionsCollection.insertMany(questionsData)

    console.log(`✅ Successfully seeded ${result.insertedCount} questions!\n`)

    // Display summary
    const byPattern = {}
    const byDifficulty = {}

    questionsData.forEach(q => {
      byPattern[q.pattern_id] = (byPattern[q.pattern_id] || 0) + 1
      byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1
    })

    console.log('📊 Questions by Pattern:')
    Object.entries(byPattern).forEach(([pattern, count]) => {
      console.log(`   ✓ ${pattern}: ${count} questions`)
    })

    console.log('\n📈 Questions by Difficulty:')
    Object.entries(byDifficulty).forEach(([diff, count]) => {
      const emoji = diff === 'Easy' ? '🟢' : diff === 'Medium' ? '🟡' : '🔴'
      console.log(`   ${emoji} ${diff}: ${count} questions`)
    })

    console.log('\n✨ Complete seed successful!')
    console.log('\n📋 Summary:')
    console.log(`   • Two Pointers: 16 questions (6 Easy, 8 Medium, 2 Hard)`)
    console.log(`   • Sliding Window: 14 questions (2 Easy, 11 Medium, 1 Hard)`)
    console.log(`   • Total: 30 questions`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedCompleteQuestions()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
