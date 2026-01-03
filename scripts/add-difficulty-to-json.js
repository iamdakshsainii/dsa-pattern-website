// scripts/add-difficulty-to-json.js
// Run this script ONCE to add difficulty and title to all JSON files

const fs = require('fs').promises;
const path = require('path');

// Difficulty mapping based on pattern (you can customize)
const difficultyMap = {
  'two-pointers': {
    'pair-with-target-sum': 'Easy',
    'remove-duplicates': 'Easy',
    'squaring-sorted-array': 'Easy',
    'triplet-sum-to-zero': 'Medium',
    'triplet-sum-close-to-target': 'Medium',
    'triplets-with-smaller-sum': 'Medium',
    'subarrays-with-product-less-than-target': 'Medium',
    'dutch-national-flag': 'Medium',
    'quadruple-sum-to-target': 'Medium',
    'comparing-strings-backspaces': 'Easy',
    'minimum-window-sort': 'Medium'
  },
  'fast-slow-pointers': {
    'linkedlist-cycle': 'Easy',
    'start-of-linkedlist-cycle': 'Medium',
    'happy-number': 'Easy',
    'middle-of-linkedlist': 'Easy',
    'palindrome-linkedlist': 'Easy',
    'rearrange-linkedlist': 'Medium',
    'cycle-in-circular-array': 'Hard',
    'find-duplicate-number-cyclic': 'Medium'
  },
  'merge-intervals': {
    'merge-intervals': 'Medium',
    'insert-interval': 'Medium',
    'intervals-intersection': 'Medium',
    'conflicting-appointments': 'Easy',
    'minimum-meeting-rooms': 'Hard',
    'maximum-cpu-load': 'Hard',
    'employee-free-time': 'Hard'
  },
  'cyclic-sort': {
    'cyclic-sort': 'Easy',
    'find-missing-number': 'Easy',
    'find-all-missing-numbers': 'Easy',
    'find-duplicate-number': 'Easy',
    'find-all-duplicates': 'Medium',
    'find-corrupt-pair': 'Easy',
    'first-missing-positive': 'Hard',
    'first-k-missing-positive': 'Hard'
  }
  // Add more patterns as needed
};

// Extract title from filename
function extractTitle(filename) {
  return filename
    .replace('.json', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Add difficulty and title to a JSON file
async function updateJsonFile(filePath, patternSlug, filename) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    // Skip if already has difficulty and title
    if (data.difficulty && data.title) {
      console.log(`✓ Skipped: ${filename} (already has difficulty and title)`);
      return { skipped: true };
    }

    // Get difficulty from map or default to Medium
    const slug = filename.replace('.json', '');
    const difficulty = difficultyMap[patternSlug]?.[slug] || 'Medium';

    // Get title
    const title = data.title || extractTitle(filename);

    // Add difficulty and title at the top of the object
    const updatedData = {
      questionId: data.questionId,
      questionSlug: data.questionSlug,
      title: title,
      difficulty: difficulty,
      ...data
    };

    // Remove old title/difficulty if they existed elsewhere
    delete updatedData.title;
    delete updatedData.difficulty;

    // Re-add at top
    const finalData = {
      questionId: updatedData.questionId,
      questionSlug: updatedData.questionSlug,
      title: title,
      difficulty: difficulty,
      resources: updatedData.resources,
      patternTriggers: updatedData.patternTriggers,
      approaches: updatedData.approaches,
      commonMistakes: updatedData.commonMistakes,
      hints: updatedData.hints,
      followUp: updatedData.followUp,
      companies: updatedData.companies,
      tags: updatedData.tags,
      relatedProblems: updatedData.relatedProblems
    };

    // Write back with proper formatting
    await fs.writeFile(
      filePath,
      JSON.stringify(finalData, null, 2),
      'utf8'
    );

    console.log(`✓ Updated: ${filename} (${difficulty})`);
    return { updated: true, difficulty, title };

  } catch (error) {
    console.error(`✗ Error updating ${filename}:`, error.message);
    return { error: true };
  }
}

// Process all patterns
async function processAllPatterns() {
  const solutionsDir = path.join(process.cwd(), 'solutions');

  try {
    const patterns = await fs.readdir(solutionsDir);

    let stats = {
      total: 0,
      updated: 0,
      skipped: 0,
      errors: 0
    };

    console.log('\n📁 Processing patterns...\n');

    for (const pattern of patterns) {
      const patternPath = path.join(solutionsDir, pattern);
      const patternStat = await fs.stat(patternPath);

      if (!patternStat.isDirectory()) continue;

      console.log(`\n📂 Pattern: ${pattern}`);

      const files = await fs.readdir(patternPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      for (const file of jsonFiles) {
        const filePath = path.join(patternPath, file);
        const result = await updateJsonFile(filePath, pattern, file);

        stats.total++;
        if (result.updated) stats.updated++;
        if (result.skipped) stats.skipped++;
        if (result.error) stats.errors++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total files processed: ${stats.total}`);
    console.log(`✓ Updated: ${stats.updated}`);
    console.log(`⊘ Skipped: ${stats.skipped}`);
    console.log(`✗ Errors: ${stats.errors}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('Error processing patterns:', error);
  }
}

// Run the script
processAllPatterns();
