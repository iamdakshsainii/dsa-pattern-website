// scripts/problems/seed-tree-advanced.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 20: Tree - Advanced Problems (13 core problems)
const questionsData = [
  {
    title: "Lowest Common Ancestor of Binary Tree",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "lowest-common-ancestor",
    order: 1,
    tags: ["tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "If root is one of p or q, return root",
      "Recursively search in left and right subtrees",
      "If both return non-null, root is LCA; else return non-null side"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "LCA in binary tree",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximum Width of Binary Tree",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "maximum-width-binary-tree",
    order: 2,
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/maximum-width-of-binary-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Assign index to each node (like heap indexing)",
      "At each level, width = rightmost_index - leftmost_index + 1",
      "Use level order traversal with indices"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Level width tracking",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Vertical Order Traversal of Binary Tree",
    difficulty: "Hard",
    pattern_id: "tree-advanced",
    slug: "vertical-order-traversal",
    order: 3,
    tags: ["hash-table", "tree", "depth-first-search", "breadth-first-search", "sorting", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track column number for each node",
      "Go left: column-1, go right: column+1",
      "Group by column, sort by row then value"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Column-wise grouping",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Top View of Binary Tree",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "top-view-binary-tree",
    order: 4,
    tags: ["tree", "depth-first-search", "breadth-first-search", "hash-table", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1",
      article: ""
    },
    hints: [
      "Track column and level for each node",
      "For each column, take node at minimum level (first seen)",
      "Use level order traversal"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "First at each column",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Bottom View of Binary Tree",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "bottom-view-binary-tree",
    order: 5,
    tags: ["tree", "depth-first-search", "breadth-first-search", "hash-table", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1",
      article: ""
    },
    hints: [
      "Track column for each node",
      "For each column, keep updating with latest node (last seen)",
      "Use level order traversal"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Last at each column",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "All Nodes Distance K in Binary Tree",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "all-nodes-distance-k",
    order: 6,
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Build parent pointers using DFS/BFS",
      "From target, do BFS in all directions (left, right, parent)",
      "Track visited nodes to avoid cycles"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Distance K from target",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Construct Binary Tree from Inorder and Preorder",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "construct-tree-inorder-preorder",
    order: 7,
    tags: ["array", "hash-table", "divide-and-conquer", "tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "First element of preorder is root",
      "Find root in inorder to split left and right subtrees",
      "Recursively build left and right"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Build from traversals",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Construct Binary Tree from Inorder and Postorder",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "construct-tree-inorder-postorder",
    order: 8,
    tags: ["array", "hash-table", "divide-and-conquer", "tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Last element of postorder is root",
      "Find root in inorder to split subtrees",
      "Recursively build right then left (postorder goes backward)"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Alternative construction",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    pattern_id: "tree-advanced",
    slug: "serialize-deserialize-binary-tree",
    order: 9,
    tags: ["string", "tree", "depth-first-search", "breadth-first-search", "design", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use preorder with null markers",
      "Serialize: 'val,left,right' format",
      "Deserialize: split by delimiter, build recursively"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Encode/decode tree",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Flatten Binary Tree to Linked List",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "flatten-binary-tree",
    order: 10,
    tags: ["linked-list", "stack", "tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Flatten in preorder (root, left, right)",
      "Move left subtree to right, append old right to end",
      "Or use Morris traversal for O(1) space"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Right-skewed tree",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Binary Tree Path Sum",
    difficulty: "Easy",
    pattern_id: "tree-advanced",
    slug: "path-sum",
    order: 11,
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/path-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Check if any root-to-leaf path sums to target",
      "Recursively subtract node value from target",
      "Base case: leaf node with remaining sum == 0"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Root-to-leaf check",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Path Sum II",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "path-sum-ii",
    order: 12,
    tags: ["backtracking", "tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/path-sum-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find all root-to-leaf paths with target sum",
      "Use backtracking to track current path",
      "Add to result when leaf with target sum found"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "All root-to-leaf paths",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Path Sum III",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "path-sum-iii",
    order: 13,
    tags: ["tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/path-sum-iii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Path can start from any node (not just root)",
      "Use prefix sum technique with HashMap",
      "Track cumulative sum and count paths"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Any path with sum",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Time to Burn Binary Tree",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "time-to-burn-tree",
    isAdditional: true,
    tags: ["tree", "depth-first-search", "breadth-first-search"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/burning-tree/1",
      article: ""
    },
    hints: [
      "Similar to All Nodes Distance K",
      "Find maximum distance from target node",
      "Use BFS with parent pointers"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    note: "⭐ Similar: Distance-based problem",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Count Complete Tree Nodes",
    difficulty: "Medium",
    pattern_id: "tree-advanced",
    slug: "count-complete-tree-nodes",
    isAdditional: true,
    tags: ["binary-search", "tree", "binary-tree"],
    companies: ["Amazon", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/count-complete-tree-nodes/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "For complete tree, use binary search",
      "Check if left and right heights equal",
      "O(log²n) instead of O(n)"
    ],
    complexity: { time: "O(log²n)", space: "O(log n)" },
    note: "⭐ Similar: Optimized counting",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedTreeAdvanced() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Tree - Advanced Problems pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'tree-advanced' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'tree-advanced' })
      console.log('✅ Cleaned up\n')
    }

    console.log('📥 Inserting core questions...\n')
    const coreResult = await questionsCollection.insertMany(questionsData)
    console.log(`✅ Inserted ${coreResult.insertedCount} core questions\n`)

    console.log('📥 Inserting additional practice problems...\n')
    const additionalResult = await questionsCollection.insertMany(additionalProblems)
    console.log(`✅ Inserted ${additionalResult.insertedCount} additional problems\n`)

    const byDifficulty = {}
    questionsData.forEach(q => {
      byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1
    })

    console.log('📈 Core Questions by Difficulty:')
    Object.entries(byDifficulty).forEach(([diff, count]) => {
      const emoji = diff === 'Easy' ? '🟢' : diff === 'Medium' ? '🟡' : '🔴'
      console.log(`   ${emoji} ${diff}: ${count} questions`)
    })

    console.log('\n✨ Seed successful!')
    console.log('\n📋 Summary:')
    console.log(`   • Core Problems: 13 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length}`)
    console.log(`   • Cross-references: 0`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedTreeAdvanced()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
