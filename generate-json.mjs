import fs from 'fs'
import path from 'path'

const csvPath = 'e:/SCE Student Portal/Dataset_for_chatbot/timetable.csv'
const jsonPath = 'e:/SCE Student Portal/frontend/src/repositories/timetable-dataset.json'

const csvData = fs.readFileSync(csvPath, 'utf8')
const lines = csvData.trim().split('\n')
const headers = lines[0].split(',')

const result = []
for (let i = 1; i < lines.length; i++) {
  const obj = {}
  const currentline = lines[i].split(',')

  for (let j = 0; j < headers.length; j++) {
    let val = currentline[j]
    if (val && val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1)
    }
    obj[headers[j].trim()] = val ? val.trim() : ""
  }
  
  result.push(obj)
}

fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2))
console.log(`Generated JSON with ${result.length} entries at ${jsonPath}`)
