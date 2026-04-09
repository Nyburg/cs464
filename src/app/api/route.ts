import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const dataDir = path.join(process.cwd(), 'sample_data')
  const files = await fs.readdir(dataDir)
  const jsonFiles = files.filter((file) => file.endsWith('.json'))

  return Response.json({ files: jsonFiles })
}