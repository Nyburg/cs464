import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const dataDir = path.join(process.cwd(), 'sample_data')
  const files = await fs.readdir(dataDir)
  const jsonFiles = files.filter((file) => file.endsWith('.json'))

  const allData = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(dataDir, file)
      const contents = await fs.readFile(filePath, 'utf8')
      const parsed = JSON.parse(contents)

      return {
        fileName: file,
        data: parsed,
      }
    })
  )

  return Response.json({ data: allData })
}