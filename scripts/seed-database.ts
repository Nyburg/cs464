import path from 'path';
import fs from 'fs/promises';
import { DataFile as DF, DataItem as DI } from '../src/types/data';
import { createClient } from '@supabase/supabase-js';

type DataItem = DI & { id?: number } // Support `id` field since `bh_legends.json` uses `id` instead of `order`
type DataFile = Omit<DF, 'items'> & { items: DataItem[] } // replace items with overridden version

/**
 * Seed a Supabase database with datasets from the `data/` directory.  
 * This script is intended for use in the `package.json` file, and can be run with `npm run db:seed`. It requires the appropriate Supabase environment variables to be set.
 */

async function seedSupabase() {
  // Determine target environment
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if(!supabaseUrl) {
    console.error("No SUPABASE_URL provided. This URL is required for seeding")
    process.exit(1)
  }
  if(!supabaseKey) {
    console.error("No SUPABASE_SERVICE_ROLE_KEY provided. This key is required for seeding")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Load all JSON datasets
    const dataDir = path.join(process.cwd(), 'data')
    const files = (await fs.readdir(dataDir)).filter((f) => f.endsWith('.json')).sort()

    let successfulFiles: string[] = []
    let failedFiles: string[] = []

    for (const file of files) {
      const dataset_slug = file.replace('.json', '')
      const filePath = path.join(dataDir, file)

      try {
        const content = await fs.readFile(filePath, 'utf-8')
        const data: DataFile = JSON.parse(content)

        // Upsert dataset record
        const { data: upsertedDatasets, error: datasetError } = await supabase
          .from('datasets')
          .upsert(
            {
              dataset_slug,
              title: data.title,
              description: data.description || '',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'dataset_slug' }
          )
          .select('id');

        if(datasetError) {
          console.error(`Failed to add JSON file ${file} to database:`, datasetError)
          failedFiles.push(file)
          continue
        }

        const datasetId = upsertedDatasets?.[0]?.id;

        if(!datasetId) {
          console.error(`No dataset ID returned for ${dataset_slug}`)
          failedFiles.push(file)
          continue
        }

        successfulFiles.push(file)

        // Insert the file's items
        const itemsToInsert = data.items.map((item, index) => ({
          dataset_id: datasetId,
          item_name: item.name,
          item_order: item.order !== undefined ? item.order : item.id ?? index + 1, // One file uses "id" instead of order, so support both
        }))

        if (itemsToInsert.length > 0) {
          await supabase
            .from('dataset_items')
            .upsert(itemsToInsert, { onConflict: 'dataset_id,item_name,item_order' })
        }
      } catch (error) {
        console.error(`Error encountered while processing ${file}:`, error)
        failedFiles.push(file)
      }
    }

    // Print results
    console.log(`Database successfully seeded (${successfulFiles.length}/${files.length} files inserted)`)
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1)
  }
}

seedSupabase()
