import {convertToModelMessages, stepCountIs, streamText, type UIMessage} from 'ai'
import {client} from '@/sanity/client'
import {APPELLATIONS_QUERY} from '@/sanity/queries'
import {sommelierModel} from '@/lib/agent/model'
import {buildSystemPrompt} from '@/lib/agent/prompt'
import {catalogTools} from '@/lib/agent/tools'
import {connectKnowledgeBase} from '@/lib/agent/knowledge-base'
import {cityToPoint, distanceKm} from '@/lib/geo'
import type {DiningContext} from '@/lib/types'

export const maxDuration = 60

type Body = {messages: UIMessage[]; context?: Partial<DiningContext>}

export async function POST(req: Request) {
  const {messages, context}: Body = await req.json()

  let model
  try {
    model = sommelierModel()
  } catch (e) {
    // Config errors (missing key) are shown as-is in the UI, so the fix is obvious.
    return new Response(e instanceof Error ? e.message : 'Model is not configured', {status: 500})
  }

  const ctx: DiningContext = {
    city: context?.city?.slice(0, 80),
    lat: typeof context?.lat === 'number' ? context.lat : undefined,
    lng: typeof context?.lng === 'number' ? context.lng : undefined,
    localTime: /^\d{1,2}:\d{2}$/.test(context?.localTime ?? '') ? context!.localTime! : '20:00',
    timeZone: context?.timeZone ?? 'Europe/Paris',
    locale: context?.locale ?? 'fr-FR',
  }

  const point = ctx.lat != null && ctx.lng != null ? {lat: ctx.lat, lng: ctx.lng} : cityToPoint(ctx.city)

  type Appellation = {_id: string; name: string; region: string; lat: number | null; lng: number | null}
  const appellations = await client.fetch<Appellation[]>(APPELLATIONS_QUERY)
  const nearby = point
    ? appellations
        .flatMap((a) => (a.lat != null && a.lng != null ? [{...a, lat: a.lat, lng: a.lng}] : []))
        .map((a) => ({_id: a._id, name: a.name, region: a.region, km: distanceKm(point, a)}))
        .sort((a, b) => a.km - b.km)
        .slice(0, 8)
    : []

  const kb = await connectKnowledgeBase()

  const result = streamText({
    model,
    system: buildSystemPrompt({ctx, nearby, knowledgeBase: kb.reference}),
    messages: await convertToModelMessages(messages),
    tools: {...kb.tools, ...catalogTools({nearby, point})},
    stopWhen: stepCountIs(8),
    onFinish: () => kb.close(),
    onError: ({error}) => {
      console.error('[sommelier] stream error', error)
      return kb.close()
    },
  })

  return result.toUIMessageStreamResponse()
}
