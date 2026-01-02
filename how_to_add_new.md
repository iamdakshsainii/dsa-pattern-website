# 📚 Complete Guide: Adding Content to Your DSA Pattern Website

## 🎯 Overview
Your website uses **MongoDB for metadata** and **JSON files for content**. Here's the complete flow:

---

## 1️⃣ Adding a NEW PATTERN

### Step 1: Add to MongoDB
Edit your `seed.js` file and add the pattern to the `patterns` array:

```javascript
const patterns = [
  // ... existing patterns ...
  {
    name: "Dynamic Programming",
    slug: "dynamic-programming",
    description: "Break down problems into smaller subproblems and store results",
    icon: "Zap",
    color: "purple",
    whenToUse: [
      "Problem has overlapping subproblems",
      "Problem has optimal substructure",
      "Need to optimize recursive solutions"
    ],
    commonMistakes: [
      "Not identifying the base cases",
      "Incorrect state definition",
      "Missing memoization"
    ],
    complexity: {
      time: "O(n²) typically",
      space: "O(n) with optimization"
    }
  }
]
```

### Step 2: Run seed script
```bash
node seed.js
```

✅ **Result:** Pattern appears at `/patterns` page

---

## 2️⃣ Adding a NEW QUESTION

### Method 1: Add to seed.js (Recommended for bulk)

Edit `seed.js` and add to the `questions` array:

```javascript
const questions = [
  // ... existing questions ...
  {
    pattern_id: "dynamic-programming",  // Must match pattern slug
    title: "Fibonacci Number",
    slug: "fibonacci-number",
    difficulty: "Easy",
    order: 1,
    patternTriggers: "Classic DP problem with overlapping subproblems",
    links: {
      leetcode: "https://leetcode.com/problems/fibonacci-number/",
      youtube: "https://youtube.com/watch?v=...",
      gfg: "https://geeksforgeeks.org/...",
      article: "https://example.com/article"
    }
  }
]
```

Then run:
```bash
node seed.js
```

### Method 2: Add directly to MongoDB (For single questions)

```javascript
// Create a script: scripts/add-question.js
import clientPromise from "../lib/mongodb.js"

async function addQuestion() {
  const client = await clientPromise
  const db = client.db("dsa_patterns")

  await db.collection("questions").insertOne({
    pattern_id: "dynamic-programming",
    title: "Fibonacci Number",
    slug: "fibonacci-number",
    difficulty: "Easy",
    order: 1,
    patternTriggers: "Classic DP problem",
    links: {
      leetcode: "https://leetcode.com/problems/fibonacci-number/",
      youtube: null,
      gfg: null,
      article: null
    }
  })

  console.log("✅ Question added!")
  process.exit(0)
}

addQuestion()
```

Run it:
```bash
node scripts/add-question.js
```

---

## 3️⃣ Adding SOLUTION (Rich Content)

### Step 1: Get Question ID
Visit the question page in your browser:
```
http://localhost:3000/questions/694d4a3a98494915f3bc8e79
                                 ^^^ This is the question ID
```

Or query MongoDB:
```bash
mongosh
use dsa_patterns
db.questions.find({ slug: "fibonacci-number" })
# Copy the _id value
```

### Step 2: Create JSON file

Create: `solutions/{pattern-slug}/{question-slug}.json`

Example: `solutions/dynamic-programming/fibonacci-number.json`

```json
{
  "id": "694d4a3a98494915f3bc8e79",
  "approach": [
    "Start with base cases: F(0) = 0, F(1) = 1",
    "Use recursion with memoization to avoid recomputation",
    "Or use bottom-up DP with array",
    "Optimize to O(1) space using two variables"
  ],
  "solutions": {
    "cpp": {
      "code": "class Solution {\npublic:\n    int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n};",
      "approaches": [
        {
          "name": "Recursion with Memoization",
          "code": "// Memoization approach\nclass Solution {\nprivate:\n    unordered_map<int, int> memo;\npublic:\n    int fib(int n) {\n        if (n <= 1) return n;\n        if (memo.count(n)) return memo[n];\n        memo[n] = fib(n-1) + fib(n-2);\n        return memo[n];\n    }\n};",
          "complexity": {
            "time": "O(n)",
            "space": "O(n)"
          }
        },
        {
          "name": "Bottom-Up DP",
          "code": "// Array approach\nclass Solution {\npublic:\n    int fib(int n) {\n        if (n <= 1) return n;\n        vector<int> dp(n+1);\n        dp[0] = 0; dp[1] = 1;\n        for (int i = 2; i <= n; i++) {\n            dp[i] = dp[i-1] + dp[i-2];\n        }\n        return dp[n];\n    }\n};",
          "complexity": {
            "time": "O(n)",
            "space": "O(n)"
          }
        },
        {
          "name": "Space Optimized",
          "code": "// O(1) space\nclass Solution {\npublic:\n    int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n};",
          "complexity": {
            "time": "O(n)",
            "space": "O(1)"
          }
        }
      ]
    },
    "java": {
      "code": "class Solution {\n    public int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n}",
      "approaches": []
    },
    "python": {
      "code": "class Solution:\n    def fib(self, n: int) -> int:\n        if n <= 1:\n            return n\n        a, b = 0, 1\n        for _ in range(2, n + 1):\n            a, b = b, a + b\n        return b",
      "approaches": []
    }
  },
  "complexity": {
    "time": "O(n)",
    "space": "O(1)",
    "timeExplanation": "Single loop from 2 to n",
    "spaceExplanation": "Only two variables used"
  },
  "resources": {
    "leetcode": "https://leetcode.com/problems/fibonacci-number/",
    "videos": [
      {
        "title": "Fibonacci DP Explained",
        "url": "https://youtube.com/watch?v=abc123",
        "channel": "NeetCode",
        "duration": "12:45",
        "language": "English"
      },
      {
        "title": "5 Ways to Solve Fibonacci",
        "url": "https://youtube.com/watch?v=def456",
        "channel": "Striver",
        "duration": "18:30",
        "language": "English"
      }
    ],
    "articles": [
      {
        "title": "Understanding Fibonacci with DP",
        "url": "https://example.com/article",
        "platform": "Medium",
        "author": "John Doe"
      }
    ],
    "practice": [
      {
        "title": "Fibonacci Number",
        "url": "https://geeksforgeeks.org/fibonacci-number/",
        "platform": "GeeksforGeeks"
      }
    ]
  },
  "patternTriggers": "This is a classic Dynamic Programming problem because it has overlapping subproblems (fib(n) needs fib(n-1) and fib(n-2)) and optimal substructure.",
  "commonMistakes": [
    "Using pure recursion without memoization (exponential time)",
    "Not handling base cases properly",
    "Integer overflow for large n"
  ],
  "hints": [
    "Think about what fib(n) depends on",
    "Can you store previous results?",
    "Do you need to store all previous results?",
    "Can you optimize to O(1) space?"
  ],
  "companies": ["Amazon", "Google", "Microsoft", "Apple"],
  "tags": ["Dynamic Programming", "Recursion", "Math"],
  "relatedProblems": [
    "Climbing Stairs",
    "Min Cost Climbing Stairs",
    "House Robber"
  ],
  "followUp": [
    "What if n is very large (10^6)?",
    "Can you solve it in O(log n) time?",
    "How would you handle negative n?"
  ]
}
```

### Step 3: Verify
Visit: `http://localhost:3000/questions/694d4a3a98494915f3bc8e79`

✅ You should see all the content from JSON file!

---

## 4️⃣ QUICK ADD: Copy Template

### Copy an existing JSON file:
```bash
# Copy a similar question
cp solutions/dynamic-programming/fibonacci-number.json solutions/dynamic-programming/climbing-stairs.json

# Edit the new file
# Change: id, approach, solutions, resources, etc.
```

---

## 5️⃣ File Structure Reference

```
dsa-pattern-website/
├── seed.js                          # Add patterns & questions here
├── solutions/                       # JSON content files
│   ├── two-pointers/
│   │   ├── pair-with-target-sum.json
│   │   └── remove-duplicates.json
│   ├── sliding-window/
│   │   └── maximum-sum-subarray.json
│   ├── dynamic-programming/        # Create new folders as needed
│   │   └── fibonacci-number.json
│   └── ...
├── scripts/
│   ├── migrate-to-json.js          # Migrate from MongoDB
│   └── add-question.js             # Quick add script
└── lib/
    └── db.js                        # Database functions
```

---

## 6️⃣ Workflow Summary

### Adding New Pattern:
1. Edit `seed.js` → Add to `patterns` array
2. Run `node seed.js`
3. Visit `/patterns` to see it

### Adding New Question:
1. Edit `seed.js` → Add to `questions` array
2. Run `node seed.js`
3. Get question ID from MongoDB or URL
4. Create `solutions/{pattern-slug}/{question-slug}.json`
5. Fill in the JSON template
6. Visit `/questions/{id}` to see it

### Updating Existing Question:
1. Edit the JSON file directly: `solutions/{pattern}/{question}.json`
2. Save file
3. Refresh page ✅ (instant update!)

---

## 7️⃣ Pro Tips

### Adding Multiple Videos:
```json
"videos": [
  { "title": "Video 1", "url": "...", "channel": "NeetCode" },
  { "title": "Video 2", "url": "...", "channel": "Striver" },
  { "title": "Video 3", "url": "...", "channel": "Abdul Bari" }
]
```
The question card will show: **[YouTube] Video +2**

### Adding Companies:
```json
"companies": ["Google", "Amazon", "Microsoft", "Meta", "Apple"]
```

### Adding Tags:
```json
"tags": ["Array", "Two Pointers", "Hash Table", "Sorting"]
```

### Multiple Approaches in Code:
```json
"cpp": {
  "approaches": [
    {
      "name": "Brute Force",
      "code": "...",
      "complexity": { "time": "O(n²)", "space": "O(1)" }
    },
    {
      "name": "Optimized",
      "code": "...",
      "complexity": { "time": "O(n)", "space": "O(n)" }
    }
  ]
}
```

---

## 8️⃣ Troubleshooting

### Question not showing?
- Check MongoDB: `db.questions.find({ slug: "your-slug" })`
- Verify `pattern_id` matches pattern `slug`
- Check `order` field (questions are sorted by order)

### Solution not loading?
- Check file path: `solutions/{pattern-slug}/{question-slug}.json`
- Verify `id` in JSON matches question `_id` in MongoDB
- Check JSON syntax (use a validator)

### Links not clickable?
- Ensure JSON file exists
- Check `resources` object structure
- Verify URLs are complete (include `https://`)

---

## 9️⃣ Quick Commands

```bash
# Reseed database (⚠️ deletes all data)
node seed.js

# Add single question
node scripts/add-question.js

# Check database
mongosh
use dsa_patterns
db.patterns.find()
db.questions.find()

# Count questions per pattern
db.questions.aggregate([
  { $group: { _id: "$pattern_id", count: { $sum: 1 } } }
])
```

