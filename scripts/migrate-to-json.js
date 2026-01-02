// scripts/migrate-to-json.js
// Run: node scripts/migrate-to-json.js

import { MongoClient } from 'mongodb'
import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env')
}

async function migrateToJSON() {
  console.log('🚀 Starting migration from MongoDB to JSON files...\n')

  // Connect to MongoDB
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  const db = client.db('dsa_patterns')

  console.log('✅ Connected to MongoDB\n')

  // Get all patterns
  const patterns = await db.collection('patterns').find({}).toArray()

  // Create pattern map by BOTH _id AND slug (for flexibility)
  const patternMapById = {}
  const patternMapBySlug = {}

  patterns.forEach(pattern => {
    patternMapById[pattern._id.toString()] = pattern.slug
    patternMapBySlug[pattern.slug] = pattern.slug
  })

  console.log(`✅ Found ${patterns.length} patterns:`)
  patterns.forEach(p => console.log(`   - ${p.name} (${p.slug})`))
  console.log()

  // Get all questions
  const questions = await db.collection('questions').find({}).toArray()
  console.log(`✅ Found ${questions.length} questions\n`)

  let migratedCount = 0
  let skippedCount = 0
  let errors = []

  // Process each question
  for (const question of questions) {
    try {
      // Handle pattern_id - could be ObjectId OR string slug
      let patternSlug

      if (typeof question.pattern_id === 'string') {
        // If pattern_id is already a slug string (like "two-pointers")
        patternSlug = patternMapBySlug[question.pattern_id] || question.pattern_id
      } else if (question.pattern_id?.toString) {
        // If pattern_id is ObjectId
        patternSlug = patternMapById[question.pattern_id.toString()]
      }

      if (!patternSlug) {
        console.log(`⚠️  Skipping "${question.title}" - pattern not found (pattern_id: ${question.pattern_id})`)
        skippedCount++
        continue
      }

      if (!question.slug) {
        console.log(`⚠️  Skipping "${question.title}" - missing slug`)
        skippedCount++
        continue
      }

      // Create folder structure
      const folderPath = path.join(process.cwd(), 'solutions', patternSlug)
      await fs.mkdir(folderPath, { recursive: true })

      // Check if JSON already exists
      const jsonPath = path.join(folderPath, `${question.slug}.json`)
      try {
        await fs.access(jsonPath)
        console.log(`⏭️  Skipping "${question.title}" - JSON already exists`)
        skippedCount++
        continue
      } catch {
        // File doesn't exist, proceed with migration
      }

      // Build JSON structure from MongoDB data
      const jsonContent = {
        questionId: question._id.toString(),
        questionSlug: question.slug,

        resources: {
          leetcode: question.links?.leetcode || "",
          videos: question.links?.youtube ? [{
            title: "Video Tutorial",
            url: question.links.youtube,
            channel: "Unknown",
            duration: "",
            language: "English"
          }] : [],
          articles: question.links?.article ? [{
            title: "Article",
            url: question.links.article,
            source: "Unknown"
          }] : [],
          practice: question.links?.gfg ? [{
            title: "Practice on GeeksforGeeks",
            url: question.links.gfg,
            platform: "GeeksforGeeks"
          }] : [],
          discussions: []
        },

        patternTriggers: question.patternTriggers || "",

        approaches: question.approach && question.approach.length > 0 ? [{
          name: "Solution",
          order: 1,
          intuition: "",
          approach: Array.isArray(question.approach) ? question.approach.join(' ') : question.approach,
          steps: Array.isArray(question.approach) ? question.approach : [question.approach],
          complexity: question.complexity || {
            time: "",
            space: "",
            timeExplanation: "",
            spaceExplanation: ""
          },
          code: question.solutions || {}
        }] : [],

        commonMistakes: question.commonMistakes || [],
        hints: question.hints || [],
        followUp: question.followUp || [],
        companies: question.companies || [],
        tags: question.tags || [],
        relatedProblems: question.relatedProblems || []
      }

      // Write JSON file
      await fs.writeFile(
        jsonPath,
        JSON.stringify(jsonContent, null, 2),
        'utf-8'
      )

      console.log(`✅ Migrated: ${patternSlug}/${question.slug}.json`)
      migratedCount++

    } catch (error) {
      console.error(`❌ Error migrating "${question.title}":`, error.message)
      errors.push({ question: question.title, error: error.message })
    }
  }

  // Close MongoDB connection
  await client.close()

  console.log('\n' + '='.repeat(60))
  console.log(`✅ Migration Complete!`)
  console.log(`   - Migrated: ${migratedCount} questions`)
  console.log(`   - Skipped: ${skippedCount} questions`)
  if (errors.length > 0) {
    console.log(`   - Errors: ${errors.length} questions`)
  }
  console.log('='.repeat(60))

  if (errors.length > 0) {
    console.log('\n❌ Errors:')
    errors.forEach(err => {
      console.log(`   - ${err.question}: ${err.error}`)
    })
  }

  console.log('\n📝 Next Steps:')
  console.log('1. Check solutions/ folder - should have 151 JSON files!')
  console.log('2. Test one question: npm run dev')
  console.log('3. Visit: http://localhost:3000/questions/{question-id}')
  console.log('4. If working perfectly, you can optionally clean MongoDB')
}

// Run migration
migrateToJSON().catch(error => {
  console.error('Migration failed:', error)
  process.exit(1)
})
