// scripts/problems/seed-bst.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 21: Binary Search Trees (11 core problems)
const questionsData = [
  {
    title: "Search in a Binary Search Tree",
    difficulty: "Easy",
    pattern_id: "bst",
    slug: "search-in-bst",
    order: 1,
    tags: ["tree", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/search-in-a-binary-search-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use BST property: left < root < right",
      "If target < root.val, search left",
      "If target > root.val, search right"
    ],
    complexity: { time: "O(h)", space: "O(h)" },
    keyLearning: "Basic BST search",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Insert into a Binary Search Tree",
    difficulty: "Medium",
    pattern_id: "bst",
    slug: "insert-into-bst",
    order: 2,
    tags: ["tree", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find correct position using BST property",
      "Insert as leaf node",
      "No need to rebalance for this problem"
    ],
    complexity: { time: "O(h)", space: "O(h)" },
    keyLearning: "Maintain property",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Delete Node in a BST",
    difficulty: "Medium",
    pattern_id: "bst",
    slug: "delete-node-in-bst",
    order: 3,
    tags: ["tree", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/delete-node-in-a-bst/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Three cases: no child, one child, two children",
      "No child: just remove",
      "One child: replace with child",
      "Two children: replace with inorder successor/predecessor"
    ],
    complexity: { time: "O(h)", space: "O(h)" },
    keyLearning: "Three cases handling",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    pattern_id: "bst",
    slug: "validate-bst",
    order: 4,
    tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/validate-binary-search-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Each node must be within valid range [min, max]",
      "Left subtree: range [min, root.val]",
      "Right subtree: range [root.val, max]",
      "Or check if inorder is strictly increasing"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Range validation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    pattern_id: "bst",
    slug: "kth-smallest-in-bst",
    order: 5,
    tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Inorder traversal gives sorted order",
      "Count nodes during inorder",
      "Return when count reaches K"
    ],
    complexity: { time: "O(h + k)", space: "O(h)" },
    keyLearning: "Inorder traversal",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Lowest Common Ancestor of a BST",
    difficulty: "Easy",
    pattern_id: "bst",
    slug: "lca-of-bst",
    order: 6,
    tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use BST property for optimization",
      "If both p and q < root, LCA in left",
      "If both p and q > root, LCA in right",
      "Else root is LCA"
    ],
    complexity: { time: "O(h)", space: "O(h)" },
    keyLearning: "Use BST property",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Inorder Successor in BST",
    difficulty: "Medium",
    pattern_id: "bst",
    slug: "inorder-successor-bst",
    order: 7,
    tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/inorder-successor-in-bst/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "If node has right child, successor is leftmost in right subtree",
      "Else, successor is ancestor where we last went left",
      "Use BST property to navigate"
    ],
    complexity: { time: "O(h)", space: "O(1)" },
    keyLearning: "Next larger node",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Two Sum IV - Input is a BST",
    difficulty: "Easy",
    pattern_id: "bst",
    slug: "two-sum-iv-bst",
    order: 8,
    tags: ["hash-table", "two-pointers", "tree", "depth-first-search", "breadth-first-search", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Inorder gives sorted array, use two pointers",
      "Or use HashSet while traversing",
      "Or use two iterators (one forward, one backward)"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Pair with sum",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Recover Binary Search Tree",
    difficulty: "Hard",
    pattern_id: "bst",
    slug: "recover-binary-search-tree",
    order: 9,
    tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/recover-binary-search-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Two nodes are swapped in BST",
      "Inorder should be sorted, find violations",
      "First violation: first > second",
      "Second violation: first > second (second is the node)"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Fix two swapped nodes",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Convert Sorted Array to Binary Search Tree",
    difficulty: "Easy",
    pattern_id: "bst",
    slug: "convert-sorted-array-to-bst",
    order: 10,
    tags: ["array", "divide-and-conquer", "tree", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Middle element becomes root for balanced tree",
      "Recursively build left with left half",
      "Recursively build right with right half"
    ],
    complexity: { time: "O(n)", space: "O(log n)" },
    keyLearning: "Balanced BST",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Merge Two Binary Search Trees",
    difficulty: "Hard",
    pattern_id: "bst",
    slug: "merge-two-bsts",
    order: 11,
    tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/merge-two-bst-s/1",
      article: ""
    },
    hints: [
      "Get inorder of both trees (sorted arrays)",
      "Merge two sorted arrays",
      "Build balanced BST from merged array"
    ],
    complexity: { time: "O(m + n)", space: "O(m + n)" },
    keyLearning: "Maintain BST property",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Ceil in BST",
    difficulty: "Medium",
    pattern_id: "bst",
    slug: "ceil-in-bst",
    isAdditional: true,
    tags: ["tree", "binary-search-tree"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/implementing-ceil-in-bst/1",
      article: ""
    },
    hints: [
      "Find smallest value >= key",
      "If root.val >= key, answer might be in left or root",
      "If root.val < key, answer must be in right"
    ],
    complexity: { time: "O(h)", space: "O(h)" },
    note: "⭐ Similar: Smallest >= key",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Floor in BST",
    difficulty: "Medium",
    pattern_id: "bst",
    slug: "floor-in-bst",
    isAdditional: true,
    tags: ["tree", "binary-search-tree"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/floor-in-bst/1",
      article: ""
    },
    hints: [
      "Find largest value <= key",
      "If root.val <= key, answer might be in right or root",
      "If root.val > key, answer must be in left"
    ],
    complexity: { time: "O(h)", space: "O(h)" },
    note: "⭐ Similar: Largest <= key",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedBST() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Binary Search Trees pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'bst' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'bst' })
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
    console.log(`   • Core Problems: 11 (counted in 300)`)
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

seedBST()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
