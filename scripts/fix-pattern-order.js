// Save as: scripts/fix-pattern-order-direct.js
// Run: node scripts/fix-pattern-order-direct.js
// This version has the MongoDB URI hardcoded (no .env needed)

const { MongoClient } = require('mongodb');

// Direct MongoDB connection (no .env file needed)
const MONGODB_URI = "mongodb+srv://dakshsaini:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority";

// Correct learning order for DSA patterns
const patternOrder = {
  // Phase 1: Foundations (Must Learn First)
  'two-pointers': 1,
  'sliding-window': 2,
  'fast-slow-pointers': 3,
  'hash-maps': 4,

  // Phase 2: Arrays & Sorting
  'kadane-pattern': 5,
  'prefix-sum': 6,
  'cyclic-sort': 7,
  'merge-intervals': 8,

  // Phase 3: Stacks & Basic Data Structures
  'stack': 9,
  'in-place-reversal-linkedlist': 10,

  // Phase 4: Trees (BFS then DFS)
  'tree-bfs': 11,
  'tree-dfs': 12,

  // Phase 5: Graphs & Islands
  'graphs': 13,
  'island-matrix-traversal': 14,

  // Phase 6: Heaps & Priority
  'two-heaps': 15,
  'top-k-elements': 16,

  // Phase 7: Backtracking & Recursion
  'subsets': 17,

  // Phase 8: Binary Search Variants
  'modified-binary-search': 18,

  // Phase 9: Advanced Techniques
  'bitwise-xor': 19,
  'k-way-merge': 20,
  'greedy-algorithms': 21,

  // Phase 10: Dynamic Programming
  '01-knapsack': 22
};

async function updatePatternOrder() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('dsa_patterns');
    const patternsCollection = db.collection('patterns');

    // Get all patterns
    const allPatterns = await patternsCollection.find({}).toArray();
    console.log(`\n📊 Found ${allPatterns.length} patterns in database`);

    if (allPatterns.length === 0) {
      console.log('⚠️  No patterns found in database. Make sure you have data in the patterns collection.');
      return;
    }

    // Update each pattern with correct order
    let updatedCount = 0;
    let notFoundCount = 0;

    console.log('\n🔄 Updating pattern order...\n');

    for (const pattern of allPatterns) {
      const newOrder = patternOrder[pattern.slug];

      if (newOrder !== undefined) {
        await patternsCollection.updateOne(
          { _id: pattern._id },
          { $set: { order: newOrder } }
        );
        console.log(`   ✅ Updated "${pattern.name}" (${pattern.slug}) → order: ${newOrder}`);
        updatedCount++;
      } else {
        console.log(`   ⚠️  Pattern "${pattern.name}" (${pattern.slug}) not in order list`);
        notFoundCount++;
      }
    }

    console.log('\n📈 Summary:');
    console.log(`   ✅ Updated: ${updatedCount} patterns`);
    console.log(`   ⚠️  Not found in order list: ${notFoundCount} patterns`);

    // Show final order
    console.log('\n🎯 Final Pattern Order:');
    const updatedPatterns = await patternsCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    updatedPatterns.forEach((p, index) => {
      const orderDisplay = p.order || 'N/A';
      console.log(`   ${String(index + 1).padStart(2)}. ${p.name.padEnd(30)} (order: ${orderDisplay})`);
    });

    console.log('\n✨ Pattern order update complete!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
console.log('🚀 Starting pattern order update...\n');
updatePatternOrder();
