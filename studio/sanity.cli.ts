import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'your-project-id',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  typegen: {
    enabled: true,
    path: '../web/src/**/*.{ts,tsx}',
    generates: '../web/src/sanity/sanity.types.ts',
  },
})
