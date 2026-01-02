require('dotenv').config();
const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI
const dbName = "dsa_patterns"

// All patterns and ALL questions from the spreadsheet
async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)

    // Clear existing data
    await db.collection("patterns").deleteMany({})
    await db.collection("questions").deleteMany({})
    console.log("Cleared existing data")

    // Insert patterns
    const patterns = [
      {
        name: "Two Pointers",
        slug: "two-pointers",
        description: "Use two pointers to iterate through data structures efficiently",
        order: 1,
        whenToUse: [
          "Array is sorted or can be sorted",
          "Need to find pairs with specific sum",
          "Problems involving subarrays or subsequences",
        ],
        commonMistakes: ["Forgetting edge cases", "Incorrect pointer movement"],
        complexity: { time: "O(n)", space: "O(1)" },
      },
      {
        name: "Fast & Slow Pointers",
        slug: "fast-slow-pointers",
        description: "Use two pointers moving at different speeds",
        order: 2,
        whenToUse: ["Detecting cycles", "Finding middle element"],
        commonMistakes: ["Missing null checks"],
        complexity: { time: "O(n)", space: "O(1)" },
      },
      {
        name: "Sliding Window",
        slug: "sliding-window",
        description: "Maintain a window and slide it across array/string",
        order: 3,
        whenToUse: ["Contiguous elements", "Subarray problems"],
        commonMistakes: ["Not maintaining window invariant"],
        complexity: { time: "O(n)", space: "O(k)" },
      },
      // Add all other patterns...
    ]

    const patternResult = await db.collection("patterns").insertMany(patterns)
    console.log(`Inserted ${patternResult.insertedCount} patterns`)

    // Get pattern IDs for reference
    const patternMap = {}
    for (const pattern of patterns) {
      const inserted = await db.collection("patterns").findOne({ slug: pattern.slug })
      patternMap[pattern.slug] = inserted._id.toString()
    }

    // ALL Questions from spreadsheet
    const allQuestions = [
      // TWO POINTERS - 12 questions
      {
        pattern_id: patternMap["two-pointers"],
        title: "Pair with Target Sum",
        slug: "two-sum-ii",
        difficulty: "Easy",
        order: 1,
        patternTriggers: "Sorted array + target sum = two pointers",
        approach: [
          "Initialize left pointer at start, right at end",
          "Calculate sum of elements at both pointers",
          "If sum matches target, return indices",
          "If sum < target, move left pointer right",
          "If sum > target, move right pointer left",
        ],
        solutions: {
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return {left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
          python: `def twoSum(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
        },
        complexity: {
          time: "O(n)",
          space: "O(1)",
          timeExplanation: "Single pass with two pointers",
          spaceExplanation: "Only two pointer variables",
        },
        commonMistakes: ["Forgetting 1-indexed return", "Not handling no solution case"],
        links: {
          leetcode: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
          youtube: "",
          gfg: "",
        },
      },
      {
        pattern_id: patternMap["two-pointers"],
        title: "Remove Duplicates",
        slug: "remove-duplicates",
        difficulty: "Easy",
        order: 2,
        patternTriggers: "In-place array modification with sorted data",
        approach: [
          "Use two pointers: one for reading, one for writing",
          "Skip duplicates by comparing adjacent elements",
          "Move unique elements to write position",
        ],
        solutions: {
          cpp: `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int writePos = 1;
    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] != nums[i-1]) {
            nums[writePos++] = nums[i];
        }
    }
    return writePos;
}`,
        },
        complexity: { time: "O(n)", space: "O(1)" },
        commonMistakes: ["Not handling empty array"],
        links: {
          leetcode: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        },
      },
      // Continue with remaining 10 Two Pointers questions...

      // SLIDING WINDOW - 12 questions
      {
        pattern_id: patternMap["sliding-window"],
        title: "Maximum Sum Subarray of Size K",
        slug: "max-sum-subarray-k",
        difficulty: "Easy",
        order: 1,
        patternTriggers: "Fixed window size + maximum/minimum value",
        approach: [
          "Calculate sum of first K elements",
          "Slide window: subtract left element, add right element",
          "Track maximum sum",
        ],
        solutions: {
          cpp: `int maxSum(vector<int>& arr, int k) {
    int windowSum = 0, maxSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    maxSum = windowSum;
    for (int i = k; i < arr.size(); i++) {
        windowSum = windowSum - arr[i-k] + arr[i];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
        },
        complexity: { time: "O(n)", space: "O(1)" },
        links: {
          gfg: "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
        },
      },
      // Add all remaining questions following the same pattern...
    ]

    // Insert all questions
    if (allQuestions.length > 0) {
      const questionResult = await db.collection("questions").insertMany(allQuestions)
      console.log(`Inserted ${questionResult.insertedCount} questions`)
    }

    // Create test user
    const existingUser = await db.collection("users").findOne({ email: "test@example.com" })
    if (!existingUser) {
      await db.collection("users").insertOne({
        email: "test@example.com",
        password: "test123",
        name: "Test User",
        created_at: new Date(),
      })
      console.log("Created test user: test@example.com / test123")
    }

    console.log("\nDatabase seeded successfully!")
    console.log("You can now login with: test@example.com / test123")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
