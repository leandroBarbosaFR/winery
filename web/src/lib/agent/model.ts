import {anthropic} from '@ai-sdk/anthropic'
import type {LanguageModel} from 'ai'

/**
 * The one place the model is chosen.
 *
 * Any AI SDK provider works here (Anthropic, OpenAI, Google, Mistral, a gateway…).
 * To use another model — including "Jev", if Sanity exposes it through an
 * AI SDK-compatible or OpenAI-compatible endpoint — return that provider instead:
 *
 *   import {createOpenAICompatible} from '@ai-sdk/openai-compatible'
 *   const jev = createOpenAICompatible({name: 'jev', baseURL: process.env.JEV_BASE_URL!, apiKey: process.env.JEV_API_KEY})
 *   return jev(process.env.JEV_MODEL!)
 */
export function sommelierModel(): LanguageModel {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set in web/.env.local')
  return anthropic(process.env.SOMMELIER_MODEL ?? 'claude-sonnet-5-5')
}
