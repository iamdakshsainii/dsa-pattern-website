const { MongoClient } = require('mongodb');

// Direct MongoDB connection (update this with your actual URI)
const MONGODB_URI = "mongodb+srv://dakshkumar:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority";

// Correct learning order for DSA patterns (based on your sheet)
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
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('dsa_patterns');
    const patternsCollection = db.collection('patterns');

    // Get all patterns
    const allPatterns = await patternsCollection.find({}).toArray();
    console.log(`📊 Found ${allPatterns.length} patterns in database\n`);

    if (allPatterns.length === 0) {
      console.log('⚠️  No patterns found in database.');
      console.log('   Make sure you have data in the patterns collection.');
      return;
    }

    // Update each pattern with correct order
    let updatedCount = 0;
    let notFoundCount = 0;
    const notFoundPatterns = [];

    console.log('🔄 Updating pattern order...\n');

    for (const pattern of allPatterns) {
      const newOrder = patternOrder[pattern.slug];

      if (newOrder !== undefined) {
        await patternsCollection.updateOne(
          { _id: pattern._id },
          { $set: { order: newOrder } }
        );
        console.log(`   ✅ ${String(newOrder).padStart(2, ' ')}. ${pattern.name.padEnd(35)} (${pattern.slug})`);
        updatedCount++;
      } else {
        console.log(`   ⚠️  Pattern "${pattern.name}" (${pattern.slug}) not in order list`);
        notFoundPatterns.push(pattern);
        notFoundCount++;
      }
    }

    console.log('\n' + '═'.repeat(70));
    console.log('📈 Summary:');
    console.log('═'.repeat(70));
    console.log(`   ✅ Updated: ${updatedCount} patterns`);
    console.log(`   ⚠️  Not found in order list: ${notFoundCount} patterns`);

    if (notFoundPatterns.length > 0) {
      console.log('\n⚠️  Patterns not in order list (these need to be added):');
      notFoundPatterns.forEach(p => {
        console.log(`   - ${p.name} (${p.slug})`);
      });
    }

    // Show final order
    console.log('\n' + '═'.repeat(70));
    console.log('🎯 Final Pattern Order (as students will see):');
    console.log('═'.repeat(70));

    const updatedPatterns = await patternsCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    updatedPatterns.forEach((p, index) => {
      const orderDisplay = p.order ? String(p.order).padStart(2, ' ') : 'N/A';
      const checkmark = p.order ? '✓' : '⚠';
      console.log(`   ${checkmark} ${orderDisplay}. ${p.name.padEnd(35)} (${p.totalQuestions || 0} questions)`);
    });

    console.log('\n✨ Pattern order update complete!');
    console.log('   Students will now see patterns numbered from 1 to ' + updatedCount);

  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error('═'.repeat(70));
    console.error('Error message:', error.message);
    console.error('\nFull error details:');
    console.error(error);
    console.error('═'.repeat(70));
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script with nice formatting
console.log('═'.repeat(70));
console.log('🚀 DSA Pattern Order Updater');
console.log('═'.repeat(70));
console.log('This script will update the order field in your patterns collection');
console.log('Students will see patterns numbered 1, 2, 3... on the cards\n');

updatePatternOrder();
