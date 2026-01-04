const fs = require('fs').promises;
const path = require('path');

const SOLUTIONS_DIR = path.join(__dirname, '../solutions');

const PATTERN_DEFAULTS = {
  'two-pointers': { Easy: 0.5, Medium: 0.4, Hard: 0.1 },
  'sliding-window': { Easy: 0.4, Medium: 0.5, Hard: 0.1 },
  'cyclic-sort': { Easy: 0.6, Medium: 0.3, Hard: 0.1 },
  'merge-intervals': { Easy: 0.2, Medium: 0.6, Hard: 0.2 },
  'tree-bfs': { Easy: 0.2, Medium: 0.5, Hard: 0.3 },
  'tree-dfs': { Easy: 0.1, Medium: 0.6, Hard: 0.3 },
  '01-knapsack': { Easy: 0, Medium: 0.3, Hard: 0.7 },
  'two-heaps': { Easy: 0, Medium: 0.4, Hard: 0.6 },
  'backtracking': { Easy: 0.1, Medium: 0.4, Hard: 0.5 },
};

const DEFAULT_DISTRIBUTION = { Easy: 0.3, Medium: 0.5, Hard: 0.2 };

function inferDifficulty(patternSlug, questionData) {
  const distribution = PATTERN_DEFAULTS[patternSlug] || DEFAULT_DISTRIBUTION;

  const timeComplexity = questionData.approaches?.[0]?.complexity?.time || '';

  if (timeComplexity.includes('2^n') || timeComplexity.includes('n!')) {
    return 'Hard';
  }
  if (timeComplexity.includes('n²') || timeComplexity.includes('n log n')) {
    return 'Medium';
  }
  if (timeComplexity.includes('O(n)') || timeComplexity.includes('O(log n)')) {
    const rand = Math.random();
    if (rand < distribution.Easy) return 'Easy';
    if (rand < distribution.Easy + distribution.Medium) return 'Medium';
    return 'Hard';
  }

  const rand = Math.random();
  if (rand < distribution.Easy) return 'Easy';
  if (rand < distribution.Easy + distribution.Medium) return 'Medium';
  return 'Hard';
}

async function getAllPatternFolders() {
  const items = await fs.readdir(SOLUTIONS_DIR, { withFileTypes: true });
  return items.filter(item => item.isDirectory()).map(item => item.name);
}

async function processPattern(patternSlug, dryRun = true) {
  const patternDir = path.join(SOLUTIONS_DIR, patternSlug);
  const files = await fs.readdir(patternDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const results = {
    total: jsonFiles.length,
    alreadyHas: 0,
    added: 0,
    errors: []
  };

  for (const file of jsonFiles) {
    const filePath = path.join(patternDir, file);

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);

      if (data.difficulty) {
        results.alreadyHas++;
        continue;
      }

      const difficulty = inferDifficulty(patternSlug, data);
      data.difficulty = difficulty;

      if (!dryRun) {
        const backupPath = `${filePath}.backup`;
        await fs.writeFile(backupPath, content, 'utf8');

        await fs.writeFile(
          filePath,
          JSON.stringify(data, null, 2),
          'utf8'
        );
      }

      results.added++;
      console.log(`  ${dryRun ? '[DRY RUN]' : '[UPDATED]'} ${file} -> ${difficulty}`);

    } catch (error) {
      results.errors.push({ file, error: error.message });
      console.error(`  [ERROR] ${file}: ${error.message}`);
    }
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  const specificPattern = args.find(arg => !arg.startsWith('--'));

  console.log('\n===========================================');
  console.log('  ADD DIFFICULTY TO JSON FILES');
  console.log('===========================================\n');

  if (dryRun) {
    console.log('MODE: DRY RUN (no changes will be made)');
    console.log('Use --apply flag to actually update files\n');
  } else {
    console.log('MODE: APPLY (files will be updated with backups)\n');
  }

  const patterns = specificPattern
    ? [specificPattern]
    : await getAllPatternFolders();

  const summary = {
    totalFiles: 0,
    alreadyHas: 0,
    added: 0,
    errors: []
  };

  for (const pattern of patterns) {
    console.log(`\nProcessing: ${pattern}`);
    console.log('-------------------------------------------');

    try {
      const results = await processPattern(pattern, dryRun);

      summary.totalFiles += results.total;
      summary.alreadyHas += results.alreadyHas;
      summary.added += results.added;
      summary.errors.push(...results.errors.map(e => ({ pattern, ...e })));

      console.log(`  Total: ${results.total} | Already has: ${results.alreadyHas} | Added: ${results.added}`);

    } catch (error) {
      console.error(`  [ERROR] Failed to process pattern: ${error.message}`);
    }
  }

  console.log('\n===========================================');
  console.log('  SUMMARY');
  console.log('===========================================');
  console.log(`Total files scanned: ${summary.totalFiles}`);
  console.log(`Already have difficulty: ${summary.alreadyHas}`);
  console.log(`${dryRun ? 'Would add' : 'Added'} difficulty: ${summary.added}`);
  console.log(`Errors: ${summary.errors.length}`);

  if (summary.errors.length > 0) {
    console.log('\nErrors encountered:');
    summary.errors.forEach(({ pattern, file, error }) => {
      console.log(`  ${pattern}/${file}: ${error}`);
    });
  }

  if (dryRun && summary.added > 0) {
    console.log('\nTo apply these changes, run:');
    console.log('  node scripts/add-difficulty-to-json.js --apply');
  }

  console.log('\n');
}

main().catch(console.error);
