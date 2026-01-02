require('dotenv').config();
const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "dsa_patterns"

const patterns = [
  {
    name: "Two Pointers",
    slug: "two-pointers",
    description: "Use two pointers to iterate through data structures efficiently, often used in sorted arrays",
    order: 1,
    questionCount: 12,
    complexity: { time: "O(n)", space: "O(1)" },
    whenToUse: [
      "Array is sorted or can be sorted",
      "Need to find pairs with specific sum",
      "Need to remove duplicates in-place",
      "Problems involving subarrays or subsequences",
    ],
    commonMistakes: [
      "Forgetting to handle edge cases with empty arrays",
      "Not considering when pointers cross each other",
      "Incorrect pointer movement logic",
    ],
  },
  {
    name: "Fast & Slow Pointers",
    slug: "fast-slow-pointers",
    description: "Use two pointers moving at different speeds to detect cycles and find middle elements",
    order: 2,
    questionCount: 8,
    complexity: { time: "O(n)", space: "O(1)" },
    whenToUse: [
      "Detecting cycles in linked lists",
      "Finding middle of linked list",
      "Checking for palindromes",
      "Cycle detection in sequences",
    ],
    commonMistakes: [
      "Not initializing pointers correctly",
      "Missing null pointer checks",
      "Incorrect cycle detection logic",
    ],
  },
  {
    name: "Sliding Window",
    slug: "sliding-window",
    description: "Maintain a window of elements and slide it across array/string to find optimal solutions",
    order: 3,
    questionCount: 12,
    complexity: { time: "O(n)", space: "O(k)" },
    whenToUse: [
      "Finding subarrays of fixed or variable size",
      "Problems with contiguous elements",
      "Maximum/minimum of all subarrays",
      "String pattern matching",
    ],
    commonMistakes: [
      "Not properly maintaining window invariant",
      "Incorrect shrinking/expanding logic",
      "Missing edge cases for window size",
    ],
  },
  {
    name: "Kadane's Algorithm",
    slug: "kadane-algorithm",
    description: "Dynamic programming technique for finding maximum/minimum subarray sums",
    order: 4,
    questionCount: 6,
    complexity: { time: "O(n)", space: "O(1)" },
    whenToUse: [
      "Finding maximum sum subarray",
      "Finding minimum sum subarray",
      "Maximum product subarray",
      "Circular array variants",
    ],
    commonMistakes: [
      "Not resetting current sum when it becomes negative",
      "Missing edge case of all negative numbers",
      "Incorrect handling of circular arrays",
    ],
  },
  {
    name: "Prefix Sum",
    slug: "prefix-sum",
    description: "Precompute cumulative sums to answer range queries efficiently",
    order: 5,
    questionCount: 6,
    complexity: { time: "O(n)", space: "O(n)" },
    whenToUse: ["Range sum queries", "Subarray sum problems", "Finding equilibrium index", "2D matrix sum queries"],
    commonMistakes: [
      "Off-by-one errors in index calculations",
      "Not handling empty subarrays",
      "Incorrect prefix array initialization",
    ],
  },
  {
    name: "Merge Intervals",
    slug: "merge-intervals",
    description: "Sort intervals and merge overlapping ones to solve scheduling and interval problems",
    order: 6,
    questionCount: 6,
    complexity: { time: "O(n log n)", space: "O(n)" },
    whenToUse: [
      "Merging overlapping intervals",
      "Finding free time slots",
      "Interval intersection",
      "Meeting room problems",
    ],
    commonMistakes: [
      "Not sorting intervals first",
      "Incorrect overlap condition",
      "Missing edge cases with empty intervals",
    ],
  },
  {
    name: "Cyclic Sort",
    slug: "cyclic-sort",
    description: "Sort arrays containing numbers in a given range by placing each number at its correct index",
    order: 7,
    questionCount: 7,
    complexity: { time: "O(n)", space: "O(1)" },
    whenToUse: [
      "Array contains numbers in range [1, n]",
      "Finding missing/duplicate numbers",
      "In-place sorting required",
      "Numbers are in limited range",
    ],
    commonMistakes: [
      "Infinite loops due to incorrect swap logic",
      "Not checking if number is already in correct position",
      "Handling duplicate numbers incorrectly",
    ],
  },
  {
    name: "In-place Reversal of LinkedList",
    slug: "linkedlist-reversal",
    description: "Reverse linked lists or parts of them by changing next pointers in-place",
    order: 8,
    questionCount: 5,
    complexity: { time: "O(n)", space: "O(1)" },
    whenToUse: [
      "Reversing entire linked list",
      "Reversing sub-parts of linked list",
      "Rotating linked list",
      "Palindrome checks",
    ],
    commonMistakes: ["Losing reference to next node", "Not handling single node", "Incorrect boundary conditions"],
  },
  {
    name: "Stack",
    slug: "stack",
    description: "Use LIFO data structure to solve problems involving nested structures and backt racking",
    order: 9,
    questionCount: 8,
    complexity: { time: "O(n)", space: "O(n)" },
    whenToUse: [
      "Matching parentheses/brackets",
      "Next greater/smaller element",
      "Expression evaluation",
      "Monotonic stack problems",
    ],
    commonMistakes: [
      "Not checking if stack is empty before pop",
      "Incorrect order of operations",
      "Missing edge cases with empty input",
    ],
  },
  {
    name: "Hash Maps",
    slug: "hash-maps",
    description: "Use hash tables for O(1) lookups to solve frequency and mapping problems",
    order: 10,
    questionCount: 4,
    complexity: { time: "O(n)", space: "O(n)" },
    whenToUse: ["Counting frequencies", "Finding duplicates", "Two sum variations", "Character mapping"],
    commonMistakes: ["Not handling hash collisions properly", "Incorrect key-value mapping", "Missing null checks"],
  },
  {
    name: "Tree BFS",
    slug: "tree-bfs",
    description: "Level-order traversal using queues to explore tree nodes level by level",
    order: 11,
    questionCount: 10,
    complexity: { time: "O(n)", space: "O(n)" },
    whenToUse: [
      "Level order traversal",
      "Finding tree level information",
      "Zigzag traversal",
      "Connecting nodes at same level",
    ],
    commonMistakes: ["Not tracking level boundaries", "Incorrect queue operations", "Missing null node checks"],
  },
  {
    name: "Tree DFS",
    slug: "tree-dfs",
    description: "Depth-first exploration of trees using recursion or stack for path problems",
    order: 12,
    questionCount: 7,
    complexity: { time: "O(n)", space: "O(h)" },
    whenToUse: ["Finding paths in tree", "Sum path problems", "Tree diameter", "Maximum path sum"],
    commonMistakes: ["Not backtracking properly", "Missing base cases", "Incorrect path tracking"],
  },
  {
    name: "Graphs",
    slug: "graphs",
    description: "Traverse and analyze graph structures using DFS and BFS techniques",
    order: 13,
    questionCount: 3,
    complexity: { time: "O(V + E)", space: "O(V)" },
    whenToUse: ["Finding connected components", "Path existence", "Shortest paths", "Cycle detection"],
    commonMistakes: [
      "Not marking visited nodes",
      "Incorrect adjacency list construction",
      "Missing disconnected components",
    ],
  },
  {
    name: "Islands (Matrix Traversal)",
    slug: "islands",
    description: "DFS/BFS on 2D grids to find connected components and solve matrix problems",
    order: 14,
    questionCount: 5,
    complexity: { time: "O(m * n)", space: "O(m * n)" },
    whenToUse: ["Counting islands", "Flood fill problems", "Finding largest area", "Matrix connectivity"],
    commonMistakes: [
      "Not handling matrix boundaries",
      "Incorrect visited marking",
      "Missing diagonal cases when needed",
    ],
  },
  {
    name: "Two Heaps",
    slug: "two-heaps",
    description: "Use min-heap and max-heap together to solve median and optimization problems",
    order: 15,
    questionCount: 4,
    complexity: { time: "O(n log n)", space: "O(n)" },
    whenToUse: ["Finding median of stream", "Sliding window median", "Maximize capital", "Balancing two sets"],
    commonMistakes: ["Not balancing heap sizes", "Incorrect heap operations", "Missing size checks"],
  },
  {
    name: "Subsets",
    slug: "subsets",
    description: "Generate all combinations and permutations using backtracking",
    order: 16,
    questionCount: 6,
    complexity: { time: "O(2^n)", space: "O(n)" },
    whenToUse: ["Generating all subsets", "Generating permutations", "Combination problems", "Power set generation"],
    commonMistakes: ["Not handling duplicates", "Incorrect backtracking", "Missing base cases"],
  },
  {
    name: "Modified Binary Search",
    slug: "modified-binary-search",
    description: "Apply binary search variations to solve search problems in modified sorted arrays",
    order: 17,
    questionCount: 14,
    complexity: { time: "O(log n)", space: "O(1)" },
    whenToUse: [
      "Rotated sorted arrays",
      "Finding ceil/floor",
      "Search in matrix",
      "Minimization/maximization with condition",
    ],
    commonMistakes: ["Off-by-one errors", "Infinite loops", "Incorrect mid calculation"],
  },
  {
    name: "Bitwise XOR",
    slug: "bitwise-xor",
    description: "Use XOR properties to solve problems involving finding unique elements",
    order: 18,
    questionCount: 4,
    complexity: { time: "O(n)", space: "O(1)" },
    whenToUse: ["Finding single number", "Finding two unique numbers", "Bit manipulation", "Complement problems"],
    commonMistakes: ["Not understanding XOR properties", "Incorrect bit operations", "Missing edge cases"],
  },
  {
    name: "Top K Elements",
    slug: "top-k-elements",
    description: "Use heaps to efficiently find top K largest/smallest elements",
    order: 19,
    questionCount: 14,
    complexity: { time: "O(n log k)", space: "O(k)" },
    whenToUse: [
      "Finding K largest/smallest",
      "K closest points",
      "Frequency-based problems",
      "Scheduling with priority",
    ],
    commonMistakes: [
      "Using wrong heap type (min vs max)",
      "Not maintaining heap size at K",
      "Incorrect comparator function",
    ],
  },
  {
    name: "K-way Merge",
    slug: "k-way-merge",
    description: "Merge K sorted arrays/lists efficiently using heaps",
    order: 20,
    questionCount: 5,
    complexity: { time: "O(N log K)", space: "O(K)" },
    whenToUse: [
      "Merging K sorted lists",
      "Finding Kth smallest in sorted matrix",
      "Smallest range in K lists",
      "K-way merge sort",
    ],
    commonMistakes: ["Not tracking which list element came from", "Incorrect heap comparisons", "Missing null checks"],
  },
  {
    name: "Greedy Algorithms",
    slug: "greedy",
    description: "Make locally optimal choices at each step to find global optimum",
    order: 21,
    questionCount: 6,
    complexity: { time: "O(n log n)", space: "O(1)" },
    whenToUse: ["Activity selection", "Minimum operations", "Interval scheduling", "Optimization with constraints"],
    commonMistakes: ["Assuming greedy works without proof", "Incorrect sorting criteria", "Missing counterexamples"],
  },
  {
    name: "0/1 Knapsack (DP)",
    slug: "knapsack",
    description: "Dynamic programming for optimization problems with binary choices",
    order: 22,
    questionCount: 6,
    complexity: { time: "O(n * W)", space: "O(n * W)" },
    whenToUse: ["Subset sum problems", "Equal partition", "Minimum subset difference", "Target sum problems"],
    commonMistakes: ["Not defining DP state correctly", "Incorrect base cases", "Missing space optimization"],
  },
  {
    name: "Backtracking",
    slug: "backtracking",
    description: "Explore all possible solutions by building candidates and abandoning failures",
    order: 23,
    questionCount: 5,
    complexity: { time: "O(2^n)", space: "O(n)" },
    whenToUse: ["Combination sum", "Word search", "Sudoku solver", "Generating all solutions"],
    commonMistakes: ["Not restoring state after recursion", "Incorrect pruning", "Missing duplicate handling"],
  },
  {
    name: "Trie",
    slug: "trie",
    description: "Tree structure for efficient string prefix operations and searches",
    order: 24,
    questionCount: 5,
    complexity: { time: "O(m)", space: "O(n * m)" },
    whenToUse: ["Autocomplete systems", "Word search", "Prefix matching", "Dictionary problems"],
    commonMistakes: [
      "Not handling end of word properly",
      "Memory inefficient implementation",
      "Incorrect trie traversal",
    ],
  },
  {
    name: "Topological Sort",
    slug: "topological-sort",
    description: "Linear ordering of vertices in directed acyclic graph for dependency resolution",
    order: 25,
    questionCount: 7,
    complexity: { time: "O(V + E)", space: "O(V)" },
    whenToUse: ["Course scheduling", "Build order", "Dependency resolution", "Task ordering"],
    commonMistakes: ["Not detecting cycles", "Incorrect in-degree calculation", "Missing isolated nodes"],
  },
  {
    name: "Union Find",
    slug: "union-find",
    description: "Disjoint set data structure for tracking connected components efficiently",
    order: 26,
    questionCount: 4,
    complexity: { time: "O(α(n))", space: "O(n)" },
    whenToUse: [
      "Finding connected components",
      "Detecting cycles in undirected graphs",
      "Network connectivity",
      "Kruskal's MST",
    ],
    commonMistakes: ["Not using path compression", "Incorrect union by rank", "Missing parent initialization"],
  },
  {
    name: "Ordered Set",
    slug: "ordered-set",
    description: "Balanced BST for maintaining sorted order with efficient operations",
    order: 27,
    questionCount: 3,
    complexity: { time: "O(log n)", space: "O(n)" },
    whenToUse: ["Range queries", "Finding Kth element", "Interval operations", "Maintaining sorted order"],
    commonMistakes: [
      "Not understanding balanced BST properties",
      "Incorrect comparator",
      "Missing iterator operations",
    ],
  },
]

const sampleQuestions = [
  // Two Pointers Pattern
  {
    pattern_id: "two-pointers",
    title: "Pair with Target Sum",
    slug: "two-sum-ii",
    difficulty: "Easy",
    level: "Discovery",
    order: 1,
    patternTriggers: "Array is sorted and we need to find a pair with target sum - perfect for two pointers approach",
    approach: [
      "Receive Input: Get sorted array and target sum from the user",
      "Initialize two pointers: left at index 0 (start), right at last index (end)",
      "While left < right: calculate current sum of elements at both pointers",
      "If sum equals target: return the indices (problem solved!)",
      "If sum < target: move left pointer right to increase sum",
      "If sum > target: move right pointer left to decrease sum",
    ],
    solutions: {
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0, right = numbers.size() - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return {left + 1, right + 1}; // 1-indexed
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }

        return {}; // No solution found
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return new int[]{left + 1, right + 1}; // 1-indexed
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }

        return new int[]{}; // No solution found
    }
}`,
      python: `class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        left, right = 0, len(numbers) - 1

        while left < right:
            current_sum = numbers[left] + numbers[right]

            if current_sum == target:
                return [left + 1, right + 1]  # 1-indexed
            elif current_sum < target:
                left += 1
            else:
                right -= 1

        return []  # No solution found`,
      javascript: `var twoSum = function(numbers, target) {
    let left = 0, right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];

        if (sum === target) {
            return [left + 1, right + 1]; // 1-indexed
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return []; // No solution found
};`,
      csharp: `public class Solution {
    public int[] TwoSum(int[] numbers, int target) {
        int left = 0, right = numbers.Length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return new int[] {left + 1, right + 1}; // 1-indexed
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }

        return new int[] {}; // No solution found
    }
}`,
      go: `func twoSum(numbers []int, target int) []int {
    left, right := 0, len(numbers)-1

    for left < right {
        sum := numbers[left] + numbers[right]

        if sum == target {
            return []int{left + 1, right + 1} // 1-indexed
        } else if sum < target {
            left++
        } else {
            right--
        }
    }

    return []int{} // No solution found
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(1)",
      timeExplanation:
        "We traverse the array once with two pointers moving towards each other, visiting each element at most once regardless of the input size.",
      spaceExplanation:
        "We only use two pointer variables (left and right), no additional data structures that grow with input size.",
    },
    commonMistakes: [
      "Forgetting the array is 1-indexed in the return value (many problems use 1-based indexing)",
      "Not handling the case when no solution exists (should return empty array)",
      "Using nested loops O(n²) instead of two pointers O(n) - defeats the purpose of sorted array",
    ],
    links: {
      leetcode: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      youtube: "https://www.youtube.com/watch?v=cQ1Oz4ckceM",
      gfg: "https://www.geeksforgeeks.org/two-pointers-technique/",
      article: "",
    },
  },
  {
    pattern_id: "sliding-window",
    title: "Maximum Sum Subarray of Size K",
    slug: "max-sum-subarray-k",
    difficulty: "Easy",
    level: "Discovery",
    order: 1,
    patternTriggers: "Need to find maximum sum in fixed-size window - classic sliding window pattern",
    approach: [
      "Calculate sum of first K elements (initialize the window)",
      "Store this sum as maxSum",
      "Slide the window: remove leftmost element, add new rightmost element",
      "Update maxSum if current window sum is greater",
      "Continue until window reaches end of array",
    ],
    solutions: {
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSumSubarray(vector<int>& arr, int k) {
        if (arr.size() < k) return -1;

        // Calculate sum of first window
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }

        int maxSum = windowSum;

        // Slide the window
        for (int i = k; i < arr.size(); i++) {
            windowSum = windowSum - arr[i - k] + arr[i];
            maxSum = max(maxSum, windowSum);
        }

        return maxSum;
    }
};`,
      java: `class Solution {
    public int maxSumSubarray(int[] arr, int k) {
        if (arr.length < k) return -1;

        // Calculate sum of first window
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }

        int maxSum = windowSum;

        // Slide the window
        for (int i = k; i < arr.length; i++) {
            windowSum = windowSum - arr[i - k] + arr[i];
            maxSum = Math.max(maxSum, windowSum);
        }

        return maxSum;
    }
}`,
      python: `class Solution:
    def maxSumSubarray(self, arr: List[int], k: int) -> int:
        if len(arr) < k:
            return -1

        # Calculate sum of first window
        window_sum = sum(arr[:k])
        max_sum = window_sum

        # Slide the window
        for i in range(k, len(arr)):
            window_sum = window_sum - arr[i - k] + arr[i]
            max_sum = max(max_sum, window_sum)

        return max_sum`,
      javascript: `var maxSumSubarray = function(arr, k) {
    if (arr.length < k) return -1;

    // Calculate sum of first window
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }

    let maxSum = windowSum;

    // Slide the window
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
};`,
      csharp: `public class Solution {
    public int MaxSumSubarray(int[] arr, int k) {
        if (arr.Length < k) return -1;

        // Calculate sum of first window
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }

        int maxSum = windowSum;

        // Slide the window
        for (int i = k; i < arr.Length; i++) {
            windowSum = windowSum - arr[i - k] + arr[i];
            maxSum = Math.Max(maxSum, windowSum);
        }

        return maxSum;
    }
}`,
      go: `func maxSumSubarray(arr []int, k int) int {
    if len(arr) < k {
        return -1
    }

    // Calculate sum of first window
    windowSum := 0
    for i := 0; i < k; i++ {
        windowSum += arr[i]
    }

    maxSum := windowSum

    // Slide the window
    for i := k; i < len(arr); i++ {
        windowSum = windowSum - arr[i-k] + arr[i]
        if windowSum > maxSum {
            maxSum = windowSum
        }
    }

    return maxSum
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(1)",
      timeExplanation: "We traverse the array once, performing O(1) operations at each step.",
      spaceExplanation: "We only use a few variables for tracking sums, no additional data structures.",
    },
    commonMistakes: [
      "Recalculating window sum from scratch each time (O(n*k) instead of O(n))",
      "Not handling edge case when array size is less than K",
      "Integer overflow for large sums (should use long in some languages)",
    ],
    links: {
      leetcode: "",
      youtube: "https://www.youtube.com/watch?v=KtpqeN0Goro",
      gfg: "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
      article: "",
    },
  },
]

const sheets = [
  {
    name: "Striver's A2Z DSA Sheet",
    slug: "striver-a2z",
    description: "Complete A to Z DSA preparation by Striver",
    questionCount: 450,
    difficulty: "Mixed",
    order: 1,
    color: "bg-blue-500",
  },
  {
    name: "Blind 75",
    slug: "blind-75",
    description: "75 must-do problems for coding interviews",
    questionCount: 75,
    difficulty: "Mixed",
    order: 2,
    color: "bg-purple-500",
  },
  {
    name: "NeetCode 150",
    slug: "neetcode-150",
    description: "150 essential problems curated by NeetCode",
    questionCount: 150,
    difficulty: "Mixed",
    order: 3,
    color: "bg-green-500",
  },
  {
    name: "Grind 169",
    slug: "grind-169",
    description: "169 problems to grind for tech interviews",
    questionCount: 169,
    difficulty: "Mixed",
    order: 4,
    color: "bg-orange-500",
  },
  {
    name: "LeetCode Top 100",
    slug: "leetcode-top-100",
    description: "Most liked LeetCode problems",
    questionCount: 100,
    difficulty: "Mixed",
    order: 5,
    color: "bg-red-500",
  },
  {
    name: "AlgoExpert 160",
    slug: "algoexpert-160",
    description: "Comprehensive problem list from AlgoExpert",
    questionCount: 160,
    difficulty: "Mixed",
    order: 6,
    color: "bg-indigo-500",
  },
  {
    name: "Love Babbar 450",
    slug: "love-babbar-450",
    description: "450 essential DSA problems by Love Babbar",
    questionCount: 450,
    difficulty: "Mixed",
    order: 7,
    color: "bg-pink-500",
  },
]

async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(dbName)

    // Clear existing data
    await db.collection("patterns").deleteMany({})
    await db.collection("questions").deleteMany({})
    await db.collection("sheets").deleteMany({})
    console.log("🗑️  Cleared existing data")

    // Insert patterns
    const patternResult = await db.collection("patterns").insertMany(patterns)
    console.log(`📊 Inserted ${patternResult.insertedCount} patterns`)

    // Insert sample questions
    const questionResult = await db.collection("questions").insertMany(sampleQuestions)
    console.log(`❓ Inserted ${questionResult.insertedCount} sample questions`)

    // Insert sheets
    const sheetResult = await db.collection("sheets").insertMany(sheets)
    console.log(`📚 Inserted ${sheetResult.insertedCount} sheets`)

    // Create indexes
    await db.collection("patterns").createIndex({ slug: 1 }, { unique: true })
    await db.collection("questions").createIndex({ pattern_id: 1 })
    await db.collection("questions").createIndex({ slug: 1 }, { unique: true })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("bookmarks").createIndex({ user_id: 1, question_id: 1 })
    await db.collection("notes").createIndex({ user_id: 1, question_id: 1 })
    await db.collection("user_progress").createIndex({ user_id: 1, question_id: 1 })
    console.log("🔍 Created indexes")

    console.log("\n✅ Database seeded successfully!")
    console.log(`\n📦 Database: ${dbName}`)
    console.log(`📊 Patterns: ${patternResult.insertedCount}`)
    console.log(`❓ Questions: ${questionResult.insertedCount}`)
    console.log(`📚 Sheets: ${sheetResult.insertedCount}`)
    console.log(
      "\n💡 Note: This is sample data. Add more questions by editing this file and rerunning the seed script.",
    )
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seedDatabase()
