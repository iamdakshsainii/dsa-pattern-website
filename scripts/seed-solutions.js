const { connectToDatabase } = require('./lib/db')
const fs = require('fs').promises
const path = require('path')

const SOLUTIONS_DIR = path.join(__dirname, 'solutions')

async function seedSolutions() {
  console.log('🚀 Starting solution import...\n')

  try {
    const { db } = await connectToDatabase()
    const questionsCollection = db.collection('questions')

    const patternFolders = await fs.readdir(SOLUTIONS_DIR)

    let totalProcessed = 0
    let totalSuccess = 0
    let totalFailed = 0
    const errors = []

    for (const patternFolder of patternFolders) {
      const patternPath = path.join(SOLUTIONS_DIR, patternFolder)
      const stats = await fs.stat(patternPath)

      if (!stats.isDirectory()) continue

      console.log(`📁 Processing pattern: ${patternFolder}`)

      const files = await fs.readdir(patternPath)
      const jsonFiles = files.filter(f => f.endsWith('.json'))

      for (const jsonFile of jsonFiles) {
        totalProcessed++
        const filePath = path.join(patternPath, jsonFile)
        const questionSlug = jsonFile.replace('.json', '')

        try {
          const fileContent = await fs.readFile(filePath, 'utf-8')
          const solutionData = JSON.parse(fileContent)

          const question = await questionsCollection.findOne({
            slug: questionSlug,
            pattern_id: patternFolder
          })

          if (!question) {
            console.log(`   ⚠️  Question not found: ${questionSlug}`)
            totalFailed++
            errors.push({ file: jsonFile, reason: 'Question not found in DB' })
            continue
          }

          const updateData = {
            approaches: solutionData.approaches || [],
            resources: solutionData.resources || null,
            patternTriggers: solutionData.patternTriggers || '',
            hints: solutionData.hints || [],
            commonMistakes: solutionData.commonMistakes || [],
            followUp: solutionData.followUp || [],
            complexity: solutionData.complexity || null,
            updatedAt: new Date()
          }

          if (solutionData.tags) {
            updateData.tags = solutionData.tags
          }
          if (solutionData.companies) {
            updateData.companies = solutionData.companies
          }

          await questionsCollection.updateOne(
            { _id: question._id },
            { $set: updateData }
          )

          console.log(`   ✅ ${questionSlug}`)
          totalSuccess++

        } catch (error) {
          console.log(`   ❌ Error processing ${jsonFile}: ${error.message}`)
          totalFailed++
          errors.push({ file: jsonFile, reason: error.message })
        }
      }

      console.log('')
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 IMPORT SUMMARY')
    console.log('='.repeat(50))
    console.log(`Total files processed: ${totalProcessed}`)
    console.log(`✅ Successfully imported: ${totalSuccess}`)
    console.log(`❌ Failed: ${totalFailed}`)

    if (errors.length > 0) {
      console.log('\n❌ ERRORS:')
      errors.forEach(err => {
        console.log(`   - ${err.file}: ${err.reason}`)
      })
    }

    console.log('\n✨ Solution import completed!')

  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  }

  process.exit(0)
}

seedSolutions()
