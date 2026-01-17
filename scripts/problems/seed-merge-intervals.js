// scripts/seed-merge-intervals.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI not found in .env.local')
}

// Pattern 4: Merge Intervals (10 core problems)
const questionsData = [
  {
    title: "Merge Intervals",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "merge-intervals",
    order: 1,
    tags: ["array", "sorting"],
    companies: ["Facebook", "Google", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/merge-intervals/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort intervals by start time",
      "Compare current interval with last merged interval",
      "Merge if they overlap (current.start <= last.end)"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Basic merge on overlap",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Insert Interval",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "insert-interval",
    order: 2,
    tags: ["array"],
    companies: ["Google", "Facebook", "LinkedIn"],
    links: {
      leetcode: "https://leetcode.com/problems/insert-interval/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Add all intervals before new interval",
      "Merge all overlapping intervals with new interval",
      "Add all intervals after new interval"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Insert new then merge",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Interval List Intersections",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "interval-list-intersections",
    order: 3,
    tags: ["array", "two-pointers"],
    companies: ["Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/interval-list-intersections/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use two pointers for both lists",
      "Find intersection: max(start1, start2) to min(end1, end2)",
      "Move pointer with smaller end time"
    ],
    complexity: { time: "O(m+n)", space: "O(min(m,n))" },
    keyLearning: "Two pointers on intervals",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "non-overlapping-intervals",
    order: 4,
    tags: ["array", "greedy", "sorting"],
    companies: ["Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/non-overlapping-intervals/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort by end time",
      "Keep interval with earliest end time",
      "Count how many intervals to remove"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Greedy removal",
    crossReference: {
      pattern: "greedy",
      problemTitle: "Non-overlapping Intervals",
      note: "Also in Greedy pattern - activity selection variant"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Meeting Rooms",
    difficulty: "Easy",
    pattern_id: "merge-intervals",
    slug: "meeting-rooms",
    order: 5,
    tags: ["array", "sorting"],
    companies: ["Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/meeting-rooms/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort meetings by start time",
      "Check if any meeting overlaps with next",
      "Overlap exists if start[i+1] < end[i]"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Detect any overlap",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Meeting Rooms II",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "meeting-rooms-ii",
    order: 6,
    tags: ["array", "heap", "sorting"],
    companies: ["Google", "Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/meeting-rooms-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use min heap to track end times of ongoing meetings",
      "Sort meetings by start time",
      "When new meeting starts, remove finished meetings from heap"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Min meeting rooms needed",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Number of Arrows to Burst Balloons",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "minimum-arrows-burst-balloons",
    order: 7,
    tags: ["array", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort balloons by end position",
      "Shoot arrow at end of first balloon",
      "Count balloons that don't overlap with current arrow position"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Greedy interval scheduling",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Employee Free Time",
    difficulty: "Hard",
    pattern_id: "merge-intervals",
    slug: "employee-free-time",
    order: 8,
    tags: ["array", "heap", "sorting"],
    companies: ["Google", "Airbnb"],
    links: {
      leetcode: "https://leetcode.com/problems/employee-free-time/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Flatten all schedules into one list",
      "Merge overlapping intervals",
      "Gaps between merged intervals are free time"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Merge all schedules",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "My Calendar I",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "my-calendar-i",
    order: 9,
    tags: ["design", "binary-search"],
    companies: ["Google", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/my-calendar-i/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Store booked intervals in sorted order",
      "Check if new booking overlaps with any existing",
      "Two intervals overlap if: max(start1, start2) < min(end1, end2)"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Booking without overlap",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Car Pooling",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "car-pooling",
    order: 10,
    tags: ["array", "sorting", "heap"],
    companies: ["Amazon", "Uber"],
    links: {
      leetcode: "https://leetcode.com/problems/car-pooling/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track passengers getting in/out at each location",
      "Sort events by location",
      "Check if capacity ever exceeds limit"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Capacity constraint",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems to show (not counted in 300)
const additionalProblems = [
  {
    title: "Maximum CPU Load",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "maximum-cpu-load",
    isAdditional: true,
    tags: ["array", "heap", "sorting"],
    companies: ["Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/maximum-cpu-load-from-the-given-list-of-jobs/",
      article: ""
    },
    hints: [
      "Similar to Meeting Rooms II",
      "Track sum of loads instead of count",
      "Use heap to manage active jobs"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    note: "⭐ Similar: Peak interval weight - extension of Meeting Rooms II",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "My Calendar II",
    difficulty: "Medium",
    pattern_id: "merge-intervals",
    slug: "my-calendar-ii",
    isAdditional: true,
    tags: ["design", "binary-search"],
    companies: ["Google"],
    links: {
      leetcode: "https://leetcode.com/problems/my-calendar-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track single bookings and double bookings separately",
      "Check if new booking creates triple booking",
      "Allow at most double bookings"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    note: "⭐ Similar: Extension allowing up to 2 overlaps",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "My Calendar III",
    difficulty: "Hard",
    pattern_id: "merge-intervals",
    slug: "my-calendar-iii",
    isAdditional: true,
    tags: ["design", "binary-search", "segment-tree"],
    companies: ["Google"],
    links: {
      leetcode: "https://leetcode.com/problems/my-calendar-iii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track all start and end events",
      "Sort events by time",
      "Count maximum overlaps at any point"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    note: "⭐ Similar: Find maximum K-booking (most challenging variant)",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedMergeIntervals() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Merge Intervals pattern seeding...\n')

    // Check for existing questions
    const existing = await questionsCollection.countDocuments({
      pattern_id: 'merge-intervals'
    })

    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'merge-intervals' })
      console.log('✅ Cleaned up\n')
    }

    // Insert core questions
    console.log('📥 Inserting core questions...\n')
    const coreResult = await questionsCollection.insertMany(questionsData)
    console.log(`✅ Inserted ${coreResult.insertedCount} core questions\n`)

    // Insert additional problems
    console.log('📥 Inserting additional practice problems...\n')
    const additionalResult = await questionsCollection.insertMany(additionalProblems)
    console.log(`✅ Inserted ${additionalResult.insertedCount} additional problems\n`)

    // Display summary
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
    console.log(`   • Core Problems: 10 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length} (practice variants)`)
    console.log(`   • Cross-references: 1 (Non-overlapping Intervals → also in Greedy)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedMergeIntervals()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
