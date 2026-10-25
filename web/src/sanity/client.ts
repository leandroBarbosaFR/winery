import {createClient} from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'your-project-id'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

/**
 * Server-only client used by the agent tools.
 * The agent needs fresh data, so no CDN; a read token is optional for public datasets.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-10-01',
  useCdn: false,
  perspective: 'published',
  token: process.env.SANITY_API_READ_TOKEN,
})
