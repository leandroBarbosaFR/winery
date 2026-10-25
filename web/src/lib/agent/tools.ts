import {tool} from 'ai'
import {z} from 'zod'
import {client} from '@/sanity/client'
import {
  DISH_SEARCH_QUERY,
  PAIRING_RULES_QUERY,
  WINE_SEARCH_QUERY,
  WINES_BY_ID_QUERY,
} from '@/sanity/queries'
import type {Recommendation, WineCard} from '@/lib/types'
import {distanceKm} from '@/lib/geo'

const COLORS = ['red', 'white', 'rose', 'sparkling', 'sweet', 'orange'] as const
const FLAVORS = ['tomato', 'umami', 'fat', 'cream', 'spicy', 'herbs', 'salty', 'sweet', 'smoky', 'iodine', 'earthy', 'bitter'] as const
const PROTEINS = ['red-meat', 'pork', 'poultry', 'fish', 'shellfish', 'cheese', 'vegetarian', 'game'] as const
const PRICES = ['budget', 'mid', 'premium', 'luxury'] as const
const scale = z.number().int().min(1).max(5)

type NearbyAppellation = {_id: string; name: string; region: string; km: number}

/** Tools that read the catalog directly with GROQ. Deterministic and cheap. */
export function catalogTools({
  nearby,
  point,
}: {
  nearby: NearbyAppellation[]
  point?: {lat: number; lng: number}
}) {
  return {
    findDish: tool({
      description:
        'Look up a dish in the catalog to get its flavours, main protein and intensity. Use simple terms ("bolognese", "daube").',
      inputSchema: z.object({term: z.string().min(2)}),
      execute: async ({term}) => {
        const dishes = await client.fetch(DISH_SEARCH_QUERY, {term: `${term}*`})
        return dishes.length ? {found: true, dishes} : {found: false, dishes: []}
      },
    }),

    getPairingRules: tool({
      description: 'Get the house pairing rules for a set of flavours and proteins. Returns target wine profiles.',
      inputSchema: z.object({
        flavors: z.array(z.enum(FLAVORS)).default([]),
        proteins: z.array(z.enum(PROTEINS)).default([]),
      }),
      execute: async ({flavors, proteins}) => {
        return client.fetch(PAIRING_RULES_QUERY, {flavors, proteins})
      },
    }),

    searchWines: tool({
      description:
        'Search the wine catalog by profile. Profile values use a 1–5 scale. Set localOnly to restrict to appellations near the user.',
      inputSchema: z.object({
        colors: z.array(z.enum(COLORS)).optional(),
        localOnly: z.boolean().default(false),
        acidityMin: scale.optional(),
        bodyMin: scale.optional(),
        bodyMax: scale.optional(),
        tanninMin: scale.optional(),
        tanninMax: scale.optional(),
        priceRanges: z.array(z.enum(PRICES)).optional(),
      }),
      execute: async ({localOnly, ...filters}) => {
        const appellationIds = localOnly && nearby.length ? nearby.slice(0, 6).map((a) => a._id) : null
        const wines = await client.fetch<WineCard[]>(WINE_SEARCH_QUERY, {
          colors: filters.colors ?? null,
          appellationIds,
          acidityMin: filters.acidityMin ?? null,
          bodyMin: filters.bodyMin ?? null,
          bodyMax: filters.bodyMax ?? null,
          tanninMin: filters.tanninMin ?? null,
          tanninMax: filters.tanninMax ?? null,
          priceRanges: filters.priceRanges ?? null,
        })
        // Give the model a compact view, closest first.
        return wines
          .map((w) => ({
            id: w._id,
            name: w.name,
            color: w.color,
            appellation: w.appellation?.name,
            region: w.appellation?.region,
            km:
              point && w.appellation?.lat != null && w.appellation.lng != null
                ? Math.round(distanceKm(point, {lat: w.appellation.lat, lng: w.appellation.lng}))
                : null,
            profile: {body: w.body, acidity: w.acidity, tannin: w.tannin},
            abv: w.abv,
            priceRange: w.priceRange,
            notes: w.tastingNotes,
          }))
          .sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9))
      },
    }),

    showRecommendations: tool({
      description:
        'Display your final picks to the user as wine cards. Call exactly once, with 1–3 ids returned by searchWines.',
      inputSchema: z.object({
        picks: z
          .array(
            z.object({
              id: z.string(),
              role: z.enum(['local', 'classic', 'budget', 'alternative']),
              reason: z.string().max(140).describe('One short sentence shown on the card'),
            }),
          )
          .min(1)
          .max(3),
      }),
      // Re-fetch by id so cards always show real catalog data, never model text.
      execute: async ({picks}): Promise<Recommendation[]> => {
        const wines = await client.fetch<WineCard[]>(WINES_BY_ID_QUERY, {ids: picks.map((p) => p.id)})
        const byId = new Map(wines.map((w) => [w._id, w]))
        return picks.flatMap((p) => {
          const wine = byId.get(p.id)
          return wine ? [{role: p.role, reason: p.reason, wine}] : []
        })
      },
    }),
  }
}
