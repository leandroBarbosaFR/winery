import {createMCPClient} from '@ai-sdk/mcp'
import type {ToolSet} from 'ai'

/**
 * Optional: Sanity Context MCP in Knowledge Base mode.
 *
 * Set SANITY_CONTEXT_MCP_URL to your Context endpoint with
 *   ?mode=knowledge_base&knowledgeBases=kb...
 * and SANITY_ORGANIZATION_TOKEN to an org-level token.
 * When unset, the sommelier runs on the GROQ catalog tools alone.
 */
export async function connectKnowledgeBase(): Promise<{
  tools: ToolSet
  reference: string | null
  close: () => Promise<void>
}> {
  const url = process.env.SANITY_CONTEXT_MCP_URL
  const token = process.env.SANITY_ORGANIZATION_TOKEN
  if (!url || !token) return {tools: {}, reference: null, close: async () => {}}

  const headers = {Authorization: `Bearer ${token}`}

  // Initial context gives the agent an overview up front and saves a tool call.
  const initialContextUrl = new URL(url)
  initialContextUrl.pathname = `${initialContextUrl.pathname.replace(/\/$/, '')}/initial-context`
  const reference = await fetch(initialContextUrl, {headers})
    .then((r) => (r.ok ? r.text() : null))
    .catch(() => null)

  const mcp = await createMCPClient({transport: {type: 'http', url, headers}})
  const {initial_context: _ignored, ...tools} = await mcp.tools()

  return {tools: tools as ToolSet, reference, close: () => mcp.close()}
}
