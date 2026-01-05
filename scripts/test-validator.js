import { validateRoadmapJSON } from './validate-roadmap.js'
import fs from 'fs'

const jsonPath = './public/templates/roadmap-template.json'
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))

const result = validateRoadmapJSON(data)

if (result.valid) {
  console.log('✅ Valid roadmap JSON!')
  console.log('Stats:', result.stats)
} else {
  console.log('❌ Validation errors:')
  result.errors.forEach(err => console.log(`  - ${err}`))
}
