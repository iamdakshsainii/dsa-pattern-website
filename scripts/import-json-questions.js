require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGODB_URI;
const dbName = "dsa_patterns";

// All 27 patterns with their slugs
const patterns = [
  {
    name: "Two Pointers",
    slug: "two-pointers",
    description: "Use two pointers to iterate through data structures efficiently",
    order: 1,
    complexity: { time: "O(n)", space: "O(1)" },
    whenToUse: [
      "Array is sorted or can be sorted",
      "Need to find pairs with specific sum",
      "Remove duplicates in-place"
    ]
  },
  {
    name: "Fast & Slow Pointers",
    slug: "fast-slow-pointers",
    description: "Use two pointers moving at different speeds",
    order: 2,
    complexity: { time: "O(n)", space: "O(1)" },
    whenToUse: [
      "Detecting cycles in linked lists",
      "Finding middle of linked list"
    ]
  },
  {
    name: "Sliding Window",
    slug: "sliding-window",
    description: "Maintain a window and slide it across array/string",
    order: 3,
    complexity: { time: "O(n)", space: "O(k)" }
  },
  {
    name: "Merge Intervals",
    slug: "merge-intervals",
    description: "Sort and merge overlapping intervals",
    order: 6,
    complexity: { time: "O(n log n)", space: "O(n)" }
  },
  {
    name: "Cyclic Sort",
    slug: "cyclic-sort",
    description: "Sort arrays by placing numbers at correct indices",
    order: 7,
    complexity: { time: "O(n)", space: "O(1)" }
  },
  {
    name: "In-place Reversal of LinkedList",
    slug: "linkedlist-reversal",
    description: "Reverse linked lists by changing pointers",
    order: 8,
    complexity: { time: "O(n)", space: "O(1)" }
  },
  {
    name: "Stack",
    slug: "stack",
    description: "Use LIFO data structure for nested structures",
    order: 9,
    complexity: { time: "O(n)", space: "O(n)" }
  },
  {
    name: "Hash Maps",
    slug: "hash-maps",
    description: "Use hash tables for O(1) lookups",
    order: 10,
    complexity: { time: "O(n)", space: "O(n)" }
  },
  {
    name: "Tree BFS",
    slug: "tree-bfs",
    description: "Level-order traversal using queues",
    order: 11,
    complexity: { time: "O(n)", space: "O(n)" }
  },
  {
    name: "Tree DFS",
    slug: "tree-dfs",
    description: "Depth-first exploration of trees",
    order: 12,
    complexity: { time: "O(n)", space: "O(h)" }
  },
  {
    name: "Graphs",
    slug: "graphs",
    description: "Traverse and analyze graph structures",
    order: 13,
    complexity: { time: "O(V + E)", space: "O(V)" }
  },
  {
    name: "Islands (Matrix Traversal)",
    slug: "islands",
    description: "DFS/BFS on 2D grids",
    order: 14,
    complexity: { time: "O(m * n)", space: "O(m * n)" }
  },
  {
    name: "Two Heaps",
    slug: "two-heaps",
    description: "Use min-heap and max-heap together",
    order: 15,
    complexity: { time: "O(n log n)", space: "O(n)" }
  },
  {
    name: "Subsets",
    slug: "subsets",
    description: "Generate combinations using backtracking",
    order: 16,
    complexity: { time: "O(2^n)", space: "O(n)" }
  },
  {
    name: "Modified Binary Search",
    slug: "modified-binary-search",
    description: "Binary search variations",
    order: 17,
    complexity: { time: "O(log n)", space: "O(1)" }
  },
  {
    name: "Bitwise XOR",
    slug: "bitwise-xor",
    description: "Use XOR properties",
    order: 18,
    complexity: { time: "O(n)", space: "O(1)" }
  },
  {
    name: "Top K Elements",
    slug: "top-k-elements",
    description: "Use heaps to find top K",
    order: 19,
    complexity: { time: "O(n log k)", space: "O(k)" }
  },
  {
    name: "K-way Merge",
    slug: "k-way-merge",
    description: "Merge K sorted arrays efficiently",
    order: 20,
    complexity: { time: "O(N log K)", space: "O(K)" }
  },
  {
    name: "Greedy Algorithms",
    slug: "greedy",
    description: "Make locally optimal choices",
    order: 21,
    complexity: { time: "O(n log n)", space: "O(1)" }
  },
  {
    name: "0/1 Knapsack (DP)",
    slug: "knapsack",
    description: "Dynamic programming for optimization",
    order: 22,
    complexity: { time: "O(n * W)", space: "O(n * W)" }
  },
  {
    name: "Backtracking",
    slug: "backtracking",
    description: "Explore all possible solutions",
    order: 23,
    complexity: { time: "O(2^n)", space: "O(n)" }
  },
  {
    name: "Trie",
    slug: "trie",
    description: "Tree structure for string operations",
    order: 24,
    complexity: { time: "O(m)", space: "O(n * m)" }
  },
  {
    name: "Topological Sort",
    slug: "topological-sort",
    description: "Linear ordering in DAG",
    order: 25,
    complexity: { time: "O(V + E)", space: "O(V)" }
  },
  {
    name: "Union Find",
    slug: "union-find",
    description: "Disjoint set data structure",
    order: 26,
    complexity: { time: "O(α(n))", space: "O(n)" }
  },
  {
    name: "Ordered Set",
    slug: "ordered-set",
    description: "Balanced BST for sorted order",
    order: 27,
    complexity: { time: "O(log n)", space: "O(n)" }
  },
  {
    name: "Kadane's Algorithm",
    slug: "kadane-algorithm",
    description: "Dynamic programming for max subarray",
    order: 4,
    complexity: { time: "O(n)", space: "O(1)" }
  },
  {
    name: "Prefix Sum",
    slug: "prefix-sum",
    description: "Precompute cumulative sums",
    order: 5,
    complexity: { time: "O(n)", space: "O(n)" }
  }
];

// Function to read all JSON files from solutions directory
function readAllJsonFiles(solutionsDir) {
  const questions = [];

  // Check if solutions directory exists
  if (!fs.existsSync(solutionsDir)) {
    console.error(`❌ Solutions directory not found: ${solutionsDir}`);
    return questions;
  }

  // Read all pattern folders
  const patternFolders = fs.readdirSync(solutionsDir);

  console.log(`\n📁 Found ${patternFolders.length} pattern folders`);

  for (const folder of patternFolders) {
    const folderPath = path.join(solutionsDir, folder);

    // Skip if not a directory
    if (!fs.statSync(folderPath).isDirectory()) {
      continue;
    }

    console.log(`\n📂 Reading: ${folder}`);

    // Read all JSON files in this pattern folder
    const files = fs.readdirSync(folderPath);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    console.log(`   Found ${jsonFiles.length} JSON files`);

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const questionData = JSON.parse(fileContent);

        // Add pattern slug from folder name
        questionData.pattern = folder;

        questions.push({
          file: file,
          folder: folder,
          data: questionData
        });

        console.log(`   ✓ ${file}`);
      } catch (error) {
        console.error(`   ✗ Error reading ${file}:`, error.message);
      }
    }
  }

  return questions;
}

// Function to extract title from approaches or use filename
function extractQuestionTitle(questionData, filename) {
  // Try to extract from first approach name or use filename
  if (questionData.approaches && questionData.approaches.length > 0) {
    // Use the problem name if available in approaches
    return filename.replace('.json', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  return filename.replace('.json', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Function to determine difficulty from approaches or default to Medium
function extractDifficulty(questionData) {
  // You can add logic to determine difficulty
  // For now, default to Medium
  return "Medium";
}

async function importQuestions() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("\n✅ Connected to MongoDB");

    const db = client.db(dbName);

    // Clear existing data
    console.log("\n🗑️  Clearing existing data...");
    await db.collection("patterns").deleteMany({});
    await db.collection("questions").deleteMany({});
    await db.collection("progress").deleteMany({});
    console.log("✅ Cleared collections");

    // Insert patterns
    console.log("\n📊 Inserting patterns...");
    const patternResult = await db.collection("patterns").insertMany(patterns);
    console.log(`✅ Inserted ${patternResult.insertedCount} patterns`);

    // Create pattern map for lookup
    const patternMap = {};
    for (const pattern of patterns) {
      const inserted = await db.collection("patterns").findOne({ slug: pattern.slug });
      patternMap[pattern.slug] = inserted._id;
    }

    // Read all JSON files
    const solutionsDir = path.join(__dirname, '..', 'solutions');
    console.log(`\n📖 Reading questions from: ${solutionsDir}`);

    const jsonQuestions = readAllJsonFiles(solutionsDir);
    console.log(`\n✅ Total JSON files read: ${jsonQuestions.length}`);

    if (jsonQuestions.length === 0) {
      console.log("\n⚠️  No JSON files found. Please check your solutions directory.");
      return;
    }

    // Transform and insert questions
    console.log("\n💾 Inserting questions into MongoDB...");

    const questionsToInsert = [];
    let orderCounter = {};

    for (const jsonQ of jsonQuestions) {
      const { folder, file, data } = jsonQ;

      // Initialize order counter for this pattern
      if (!orderCounter[folder]) {
        orderCounter[folder] = 1;
      }

      // Create question document
      const questionDoc = {
        _id: new ObjectId(),
        pattern: folder,
        pattern_id: patternMap[folder],
        title: extractQuestionTitle(data, file),
        slug: file.replace('.json', ''),
        difficulty: extractDifficulty(data),
        order: orderCounter[folder]++,

        // Copy all data from JSON
        patternTriggers: data.patternTriggers || "",
        approaches: data.approaches || [],
        resources: data.resources || {},
        commonMistakes: data.commonMistakes || [],
        hints: data.hints || [],
        followUp: data.followUp || [],
        companies: data.companies || [],
        tags: data.tags || [],
        relatedProblems: data.relatedProblems || [],

        // Metadata
        createdAt: new Date(),
        updatedAt: new Date()
      };

      questionsToInsert.push(questionDoc);
    }

    // Bulk insert
    if (questionsToInsert.length > 0) {
      const questionResult = await db.collection("questions").insertMany(questionsToInsert);
      console.log(`✅ Inserted ${questionResult.insertedCount} questions`);
    }

    // Update pattern question counts
    console.log("\n🔢 Updating pattern question counts...");
    for (const pattern of patterns) {
      const count = await db.collection("questions").countDocuments({ pattern: pattern.slug });
      await db.collection("patterns").updateOne(
        { slug: pattern.slug },
        { $set: { questionCount: count } }
      );
      console.log(`   ${pattern.slug}: ${count} questions`);
    }

    // Create indexes
    console.log("\n🔍 Creating indexes...");
    await db.collection("patterns").createIndex({ slug: 1 }, { unique: true });
    await db.collection("questions").createIndex({ pattern: 1 });
    await db.collection("questions").createIndex({ pattern_id: 1 });
    await db.collection("questions").createIndex({ slug: 1 });
    await db.collection("progress").createIndex({ userId: 1, questionId: 1 });
    console.log("✅ Indexes created");

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DATABASE IMPORT COMPLETE!");
    console.log("=".repeat(60));

    const totalQuestions = await db.collection("questions").countDocuments();
    const totalPatterns = await db.collection("patterns").countDocuments();

    console.log(`\n📊 Summary:`);
    console.log(`   Database: ${dbName}`);
    console.log(`   Patterns: ${totalPatterns}`);
    console.log(`   Questions: ${totalQuestions}`);

    console.log(`\n📋 Questions per Pattern:`);
    for (const pattern of patterns) {
      const count = await db.collection("questions").countDocuments({ pattern: pattern.slug });
      if (count > 0) {
        console.log(`   ${pattern.name}: ${count}`);
      }
    }

    console.log(`\n💡 Next Steps:`);
    console.log(`   1. Restart dev server: npm run dev`);
    console.log(`   2. Visit: http://localhost:3000/dashboard`);
    console.log(`   3. Navigate to patterns`);
    console.log(`   4. All questions should now work! ✨`);

  } catch (error) {
    console.error("\n❌ Error importing questions:", error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run the import
console.log("🚀 Starting JSON import...");
console.log("📂 Current directory:", __dirname);
importQuestions();
