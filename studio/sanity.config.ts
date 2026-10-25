import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Sommelier',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [structureTool({structure}), visionTool()],
  schema: {types: schemaTypes},
})
