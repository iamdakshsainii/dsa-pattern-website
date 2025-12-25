require('dotenv').config();
const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "dsa_patterns"

const patterns = [
  {
    name: "Two Pointers",
    slug: "two-pointers",
    description: "Use two pointers moving in the same or opposite directions to solve problems efficiently",
    order: 1,
    questionCount: 15,
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
    name: "Sliding Window",
    slug: "sliding-window",
    description: "Maintain a window of elements and slide it across the array to find optimal solutions",
    order: 2,
    questionCount: 18,
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
    name: "Binary Search",
    slug: "binary-search",
    description: "Efficiently search in sorted data by repeatedly dividing the search space in half",
    order: 3,
    questionCount: 20,
    complexity: { time: "O(log n)", space: "O(1)" },
    whenToUse: [
      "Data is sorted or can be viewed as monotonic",
      "Need to find element or insertion position",
      "Search space can be divided",
      "Finding minimum/maximum with condition",
    ],
    commonMistakes: [
      "Off-by-one errors in boundary conditions",
      "Infinite loops due to incorrect mid calculation",
      "Not handling duplicate elements properly",
    ],
  },
]

const questions = [
  {
    pattern_id: "two-pointers",
    title: "Two Sum II - Input Array Is Sorted",
    slug: "two-sum-ii",
    difficulty: "Easy",
    level: "Discovery",
    order: 1,
    patternTriggers: "Array is sorted and we need to find a pair with target sum - perfect for two pointers",
    approach: [
      "Receive Input: Get sorted array and target sum",
      "Initialize two pointers: left at start, right at end",
      "While left < right: calculate current sum",
      "If sum equals target: return indices",
      "If sum < target: move left pointer right",
      "If sum > target: move right pointer left",
    ],
    solutions: {
      cpp: `class Solution {
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
    },
    complexity: {
      time: "O(n)",
      space: "O(1)",
      timeExplanation:
        "We traverse the array once with two pointers, visiting each element at most once regardless of input size.",
      spaceExplanation:
        "We only use two pointer variables (left and right), no additional data structures that grow with input.",
    },
    commonMistakes: [
      "Forgetting the array is 1-indexed in the return value",
      "Not handling the case when no solution exists",
      "Using nested loops instead of two pointers (O(n²) instead of O(n))",
    ],
    links: {
      leetcode: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      youtube: "https://www.youtube.com/watch?v=cQ1Oz4ckceM",
      gfg: "https://www.geeksforgeeks.org/two-pointers-technique/",
    },
  },
]

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
    const patternResult = await db.collection("patterns").insertMany(patterns)
    console.log(`Inserted ${patternResult.insertedCount} patterns`)

    // Insert questions
    const questionResult = await db.collection("questions").insertMany(questions)
    console.log(`Inserted ${questionResult.insertedCount} questions`)

    // Create indexes
    await db.collection("patterns").createIndex({ slug: 1 }, { unique: true })
    await db.collection("questions").createIndex({ pattern_id: 1 })
    await db.collection("questions").createIndex({ slug: 1 }, { unique: true })
    console.log("Created indexes")

    console.log("\n✅ Database seeded successfully!")
    console.log(`\nDatabase: ${dbName}`)
    console.log(`Patterns: ${patternResult.insertedCount}`)
    console.log(`Questions: ${questionResult.insertedCount}`)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seedDatabase()
