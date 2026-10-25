# Sommelier

"I'm in Marseille, it's 00:12 and we're eating spaghetti bolognese." → three real bottles from your catalog, with the reason on each label.

```
sommelier/
├── studio/   Sanity Studio (standalone) — schemas, desk structure, seed data
└── web/      Next.js 16 + Tailwind 4 — the sentence form, the agent route, wine labels
```

## How it answers

```
Browser ── city / GPS, local time, timezone, locale ──▶ /api/chat
                                                        │
             nearest appellations (from Sanity geopoints)┤
                                                        ▼
                    AI SDK agent loop (model in web/src/lib/agent/model.ts)
                      1. findDish          GROQ → dish flavours, protein, intensity
                      2. getPairingRules   GROQ → house rules → target profile
                      3. (optional) Knowledge Base tools via Sanity Context MCP
                      4. searchWines       GROQ → catalog filtered by profile, local first
                      5. showRecommendations → re-fetches the picked ids → wine label cards
```

Cards are always rendered from catalog data fetched by id, never from model text, so the agent can't invent a bottle, price or merchant.

## Setup

1. Create a Sanity project (or reuse one) and note its project id.
2. Studio:
   ```bash
   cd studio
   npm install
   export SANITY_STUDIO_PROJECT_ID=<your id>
   node seed/build-seed.mjs   # writes seed/seed.ndjson (demo data)
   npm run seed               # imports it into the production dataset
   npm run dev                # http://localhost:3333
   ```
3. Web:
   ```bash
   cd web
   npm install
   cp .env.example .env.local   # fill in project id + ANTHROPIC_API_KEY
   npm run dev                  # http://localhost:3000
   ```

The seed wines are clearly marked "(demo)" and have no merchant links. Replace them with your feed import.

## Content model

| Type | Role |
|---|---|
| `wine` | The catalog. Taste profile on a 1–5 scale, `offers[]` for buy links, `externalIds` (LWIN, feed id) for sync, `reviewStatus` for AI-enriched data |
| `appellation` | Region + geopoint, used to find what's local to the user |
| `grape`, `producer` | Reference data |
| `dish` | Flavours, protein, intensity, aliases ("spag bol") |
| `pairingRule` | The house doctrine: when it applies → target profile → why. This is your moat |
| `guide` | Long-form editorial, the best Knowledge Base source |

## Knowledge Base (optional)

The agent works without it. To add one:

1. Enable Knowledge Bases under Apps on sanity.io/manage (beta).
2. Create a Knowledge Base whose sources are the `pairingRule` and `guide` documents (not the raw catalog).
3. Put the Context MCP URL with `?mode=knowledge_base&knowledgeBases=kb_…` in `SANITY_CONTEXT_MCP_URL`, and an org token in `SANITY_ORGANIZATION_TOKEN`.

The route then merges the KB tools with the catalog tools and adds the initial context to the system prompt.

## Changing the model (and "Jev")

Everything goes through `web/src/lib/agent/model.ts`. Swap the provider there; the rest of the code doesn't change. Jev is mentioned in Sanity's engineering blog but isn't documented as a public API yet. If Sanity exposes it through an OpenAI-compatible endpoint, the commented snippet in that file is all you need.

## Before launch

- **Loi Évin**: the footer health message is in place; have the affiliate copy and any promotion reviewed.
- **Age gate**: client-side only, stored in localStorage. Good enough for a prototype, not a legal guarantee.
- **Geocoding**: `web/src/lib/geo.ts` knows a dozen cities. Swap in a real geocoder (or rely on "Use my location").
- **Rate limiting** on `/api/chat` before it's public.
- **Typegen**: `studio/sanity.cli.ts` is configured to write types into `web/src/sanity/sanity.types.ts`.

## Next steps

- `studio/scripts/sync-*.ts`: import an affiliate feed, upsert by `externalIds.feedId`, only fill empty editorial fields.
- A `/wines/[slug]` page per bottle (good for SEO and as Knowledge Base URLs).
- Remember a user's taste across visits (Project Horizon, once it leaves experimental).
