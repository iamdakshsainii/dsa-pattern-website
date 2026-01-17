// scripts/problems/seed-tree-traversals.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 19: Tree Traversals & Properties (15 core problems)
const questionsData = [
  {
    title: "Binary Tree Preorder Traversal",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "preorder-traversal",
    order: 1,
    tags: ["stack", "tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/binary-tree-preorder-traversal/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Root-Left-Right order",
      "Recursive: process root, then left, then right",
      "Iterative: use stack, push right then left"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Root-Left-Right",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "inorder-traversal",
    order: 2,
    tags: ["stack", "tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Left-Root-Right order",
      "Gives sorted order for BST",
      "Iterative: go left until null, then process and go right"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Left-Root-Right",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Binary Tree Postorder Traversal",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "postorder-traversal",
    order: 3,
    tags: ["stack", "tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/binary-tree-postorder-traversal/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Left-Right-Root order",
      "Process children before parent",
      "Iterative: use two stacks or reverse preorder (Root-Right-Left)"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Left-Right-Root",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    pattern_id: "tree-traversals",
    slug: "level-order-traversal",
    order: 4,
    tags: ["tree", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use queue for BFS",
      "Process level by level",
      "Track level size before processing each level"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "BFS with queue",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Binary Tree Zigzag Level Order Traversal",
    difficulty: "Medium",
    pattern_id: "tree-traversals",
    slug: "zigzag-level-order",
    order: 5,
    tags: ["tree", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Level order with direction flag",
      "Reverse odd levels or use deque",
      "Alternate left-to-right and right-to-left"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Alternate directions",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "maximum-depth",
    order: 6,
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Recursively find max of left and right subtree depths",
      "Add 1 for current node",
      "Or use level order and count levels"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Height calculation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "balanced-binary-tree",
    order: 7,
    tags: ["tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/balanced-binary-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "For each node, check if |left_height - right_height| <= 1",
      "Return height and balance status together",
      "Stop early if any subtree unbalanced"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Height diff <= 1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "diameter-binary-tree",
    order: 8,
    tags: ["tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/diameter-of-binary-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Longest path may not pass through root",
      "For each node: diameter = left_height + right_height",
      "Track global maximum while computing heights"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Longest path",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    pattern_id: "tree-traversals",
    slug: "binary-tree-max-path-sum",
    order: 9,
    tags: ["dynamic-programming", "tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Path can start and end at any node",
      "For each node: max_path = node + max(0, left) + max(0, right)",
      "Return to parent: node + max(0, left, right)"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Any node to node",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "invert-binary-tree",
    order: 10,
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/invert-binary-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Swap left and right children",
      "Recursively invert subtrees",
      "Can use any traversal order"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Swap children",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Symmetric Tree",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "symmetric-tree",
    order: 11,
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/symmetric-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Check if left subtree is mirror of right subtree",
      "Compare left.left with right.right and left.right with right.left",
      "Can use recursion or two queues"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Mirror check",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Same Tree",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "same-tree",
    order: 12,
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/same-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Check values and structure recursively",
      "Both null: true, one null: false",
      "Values equal and subtrees same"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Structural equality",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "subtree-of-another-tree",
    order: 13,
    tags: ["tree", "depth-first-search", "string-matching", "binary-tree", "hash-function"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/subtree-of-another-tree/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "For each node in main tree, check if it's same as subRoot",
      "Use isSameTree helper function",
      "Or serialize both trees and check substring"
    ],
    complexity: { time: "O(m*n)", space: "O(h)" },
    keyLearning: "Pattern matching",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    pattern_id: "tree-traversals",
    slug: "binary-tree-right-side-view",
    order: 14,
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/binary-tree-right-side-view/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Level order traversal, take rightmost node at each level",
      "Or DFS: go right first, add node when visiting level for first time",
      "Track level depth"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Rightmost at each level",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Binary Tree Left Side View",
    difficulty: "Easy",
    pattern_id: "tree-traversals",
    slug: "binary-tree-left-side-view",
    order: 15,
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/left-view-of-binary-tree/1",
      article: ""
    },
    hints: [
      "Level order traversal, take leftmost node at each level",
      "Or DFS: go left first, add node when visiting level for first time",
      "Similar to right side view"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    keyLearning: "Leftmost at each level",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "All Traversals in One",
    difficulty: "Medium",
    pattern_id: "tree-traversals",
    slug: "all-traversals-in-one",
    isAdditional: true,
    tags: ["tree", "depth-first-search"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use single traversal to get all three orders",
      "Track state: 1=preorder, 2=inorder, 3=postorder",
      "Use stack with state pairs"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    note: "⭐ Similar: Combined approach for practice",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Boundary Traversal of Binary Tree",
    difficulty: "Medium",
    pattern_id: "tree-traversals",
    slug: "boundary-traversal",
    isAdditional: true,
    tags: ["tree", "depth-first-search", "binary-tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1",
      article: ""
    },
    hints: [
      "Three parts: left boundary, leaves, right boundary (reverse)",
      "Left boundary: keep going left, if no left go right",
      "Leaves: inorder without intermediate nodes"
    ],
    complexity: { time: "O(n)", space: "O(h)" },
    note: "⭐ Similar: Combination of traversals",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedTreeTraversals() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Tree Traversals & Properties pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'tree-traversals' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'tree-traversals' })
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
    console.log(`   • Core Problems: 15 (counted in 300)`)
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

seedTreeTraversals()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
