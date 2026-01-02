require('dotenv').config

const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "dsa_patterns"

// Complete patterns and questions data based on the spreadsheet
const seedData = {
  patterns: [
    {
      name: "Two Pointers",
      slug: "two-pointers",
      description:
        "Use two pointers to iterate through data structures efficiently, often solving problems in O(n) time",
      order: 1,
      questionCount: 12,
      complexity: { time: "O(n)", space: "O(1)" },
      whenToUse: [
        "Array is sorted or can be sorted",
        "Need to find pairs with specific sum",
        "Remove duplicates in-place",
        "Problems with opposite-direction scanning",
      ],
      commonMistakes: [
        "Forgetting to handle edge cases with empty arrays",
        "Not considering when pointers cross",
        "Incorrect pointer movement logic",
      ],
    },
    {
      name: "Sliding Window",
      slug: "sliding-window",
      description: "Maintain a window of elements and slide it across the data to find optimal solutions",
      order: 2,
      questionCount: 13,
      complexity: { time: "O(n)", space: "O(k)" },
      whenToUse: [
        "Finding subarrays of fixed or variable size",
        "Contiguous elements problems",
        "Maximum/minimum of all subarrays",
        "String pattern matching",
      ],
      commonMistakes: [
        "Not maintaining window invariant properly",
        "Incorrect shrinking/expanding logic",
        "Missing edge cases for window size",
      ],
    },
    {
      name: "Fast & Slow Pointers",
      slug: "fast-slow-pointers",
      description: "Use two pointers moving at different speeds to detect cycles and find middle elements",
      order: 3,
      questionCount: 8,
      complexity: { time: "O(n)", space: "O(1)" },
      whenToUse: [
        "Detecting cycles in linked lists",
        "Finding middle of linked list",
        "Palindrome checking in linked lists",
        "Cycle detection in sequences",
      ],
      commonMistakes: [
        "Not handling null pointers properly",
        "Incorrect cycle detection logic",
        "Missing edge cases for single/two node lists",
      ],
    },
    // Add remaining patterns...
  ],
  questions: [
    {
      pattern_id: "two-pointers",
      title: "Two Sum II - Input Array Is Sorted",
      slug: "two-sum-ii-sorted",
      difficulty: "Easy",
      order: 1,
      patternTriggers:
        "Array is sorted, need to find a pair that sums to target - perfect for two pointers moving from both ends",
      approach: [
        "Initialize two pointers: left at start (0), right at end (n-1)",
        "While left < right: calculate current sum = arr[left] + arr[right]",
        "If sum equals target: return the indices",
        "If sum < target: increment left pointer to increase sum",
        "If sum > target: decrement right pointer to decrease sum",
      ],
      solutions: {
        cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0, right = numbers.size() - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return {left + 1, right + 1};
            else if (sum < target) left++;
            else right--;
        }
        return {};
    }
};`,
        java: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return new int[]{left + 1, right + 1};
            else if (sum < target) left++;
            else right--;
        }
        return new int[]{};
    }
}`,
        python: `class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        left, right = 0, len(numbers) - 1

        while left < right:
            current_sum = numbers[left] + numbers[right]
            if current_sum == target:
                return [left + 1, right + 1]
            elif current_sum < target:
                left += 1
            else:
                right -= 1
        return []`,
        javascript: `var twoSum = function(numbers, target) {
    let left = 0, right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) return [left + 1, right + 1];
        else if (sum < target) left++;
        else right--;
    }
    return [];
};`,
        csharp: `public class Solution {
    public int[] TwoSum(int[] numbers, int target) {
        int left = 0, right = numbers.Length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return new int[] {left + 1, right + 1};
            else if (sum < target) left++;
            else right--;
        }
        return new int[] {};
    }
}`,
        go: `func twoSum(numbers []int, target int) []int {
    left, right := 0, len(numbers)-1

    for left < right {
        sum := numbers[left] + numbers[right]
        if sum == target {
            return []int{left + 1, right + 1}
        } else if sum < target {
            left++
        } else {
            right--
        }
    }
    return []int{}
}`,
      },
      complexity: {
        time: "O(n)",
        space: "O(1)",
        timeExplanation: "We traverse the array once with two pointers, each element is visited at most once.",
        spaceExplanation: "Only using two pointer variables, no additional data structures.",
      },
      commonMistakes: [
        "Forgetting the array is 1-indexed in return value",
        "Not handling no solution case",
        "Using nested loops (O(n²)) instead of two pointers",
      ],
      links: {
        leetcode: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        youtube: "",
        gfg: "",
        article: "",
      },
    },
    // This is a starter - the full seed would include ALL 200+ questions from the spreadsheet
  ],
}

async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(dbName)

    // Clear existing collections
    await db.collection("patterns").deleteMany({})
    await db.collection("questions").deleteMany({})
    await db.collection("users").deleteMany({})
    console.log("🧹 Cleared existing data")

    // Insert patterns
    const patternResult = await db.collection("patterns").insertMany(seedData.patterns)
    console.log(`📁 Inserted ${patternResult.insertedCount} patterns`)

    // Insert questions
    const questionResult = await db.collection("questions").insertMany(seedData.questions)
    console.log(`❓ Inserted ${questionResult.insertedCount} questions`)

    // Create test user
    await db.collection("users").insertOne({
      name: "Test User",
      email: "test@example.com",
      password: "test123", // In production, hash this!
      created_at: new Date(),
    })
    console.log("👤 Created test user (test@example.com / test123)")

    // Create indexes
    await db.collection("patterns").createIndex({ slug: 1 }, { unique: true })
    await db.collection("questions").createIndex({ pattern_id: 1 })
    await db.collection("questions").createIndex({ slug: 1 }, { unique: true })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("user_progress").createIndex({ user_id: 1, question_id: 1 })
    await db.collection("bookmarks").createIndex({ user_id: 1, question_id: 1 })
    await db.collection("notes").createIndex({ user_id: 1, question_id: 1 })
    console.log("🔍 Created indexes")

    console.log("\n🎉 Database seeded successfully!")
    console.log(`\n📊 Summary:`)
    console.log(`   Database: ${dbName}`)
    console.log(`   Patterns: ${patternResult.insertedCount}`)
    console.log(`   Questions: ${questionResult.insertedCount}`)
    console.log(`   Test User: test@example.com / test123`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seedDatabase()
