'use client'

import {useChat} from '@ai-sdk/react'
import {DefaultChatTransport, type UIMessage} from 'ai'
import {useEffect, useMemo, useRef, useState} from 'react'
import type {DiningContext, Recommendation} from '@/lib/types'
import {WineLabel} from './WineLabel'

const STEP_LABEL: Record<string, string> = {
  findDish: 'Reading the dish',
  getPairingRules: 'Checking the pairing notes',
  searchWines: 'Going through the cellar',
  showRecommendations: 'Pouring',
}

function nowHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** An inline input that sits inside the sentence and grows with its text. */
function Blank({
  value,
  onChange,
  placeholder,
  label,
  inputMode,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  label: string
  inputMode?: 'text' | 'numeric'
}) {
  return (
    <input
      aria-label={label}
      value={value}
      placeholder={placeholder}
      inputMode={inputMode}
      size={Math.max(value.length, placeholder.length, 3)}
      onChange={(e) => onChange(e.target.value)}
      className="mx-1 max-w-full min-w-[3ch] [field-sizing:content] border-b-2 border-rose/60 bg-transparent px-0.5 text-rose placeholder:text-rose/35 focus:border-rose focus:outline-none"
    />
  )
}

export function Sommelier() {
  const [city, setCity] = useState('')
  const [coords, setCoords] = useState<{lat: number; lng: number} | null>(null)
  const [locating, setLocating] = useState(false)
  const [time, setTime] = useState('')
  const [timeEdited, setTimeEdited] = useState(false)
  const [dish, setDish] = useState('')
  const [followUp, setFollowUp] = useState('')
  const threadEnd = useRef<HTMLDivElement>(null)

  // Keep the clock live until the user types their own time.
  useEffect(() => {
    if (timeEdited) return
    setTime(nowHHMM())
    const id = setInterval(() => setTime(nowHHMM()), 30_000)
    return () => clearInterval(id)
  }, [timeEdited])

  const transport = useMemo(() => new DefaultChatTransport({api: '/api/chat'}), [])
  const {messages, sendMessage, status, error, stop} = useChat({transport})
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    threadEnd.current?.scrollIntoView({behavior: 'smooth', block: 'end'})
  }, [messages.length])

  const context = (): DiningContext => ({
    city: city || undefined,
    lat: coords?.lat,
    lng: coords?.lng,
    localTime: time || nowHHMM(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: navigator.language,
  })

  const send = (text: string) => sendMessage({text}, {body: {context: context()}})

  const locate = () => {
    if (!('geolocation' in navigator)) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({lat: pos.coords.latitude, lng: pos.coords.longitude})
        if (!city) setCity('here')
        setLocating(false)
      },
      () => setLocating(false),
      {maximumAge: 600_000, timeout: 8_000},
    )
  }

  const ask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dish.trim() || busy) return
    const where = city && city !== 'here' ? `I'm in ${city}` : coords ? "I'm at my current location" : "I'm in France"
    send(`${where}, it's ${time || nowHHMM()} and we're eating ${dish.trim()}. Which wine should we drink?`)
  }

  const askFollowUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!followUp.trim() || busy) return
    send(followUp.trim())
    setFollowUp('')
  }

  return (
    <div>
      <form onSubmit={ask}>
        <h1 className="font-display text-4xl leading-[1.2] sm:text-5xl sm:leading-[1.15]">
          I’m in
          <Blank label="Where are you?" value={city} onChange={setCity} placeholder="Marseille" />, it’s
          <Blank
            label="What time is it?"
            value={time}
            onChange={(v) => {
              setTimeEdited(true)
              setTime(v)
            }}
            placeholder="20:00"
            inputMode="numeric"
          />
          and we’re eating
          <Blank label="What are you eating?" value={dish} onChange={setDish} placeholder="spaghetti bolognese" />.
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!dish.trim() || busy}
            className="rounded-full bg-rose px-6 py-3 font-medium text-lees transition-colors hover:bg-rose-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'Choosing…' : 'Choose my wine'}
          </button>
          <button
            type="button"
            onClick={locate}
            disabled={locating}
            className="text-sm text-smoke underline decoration-must-2 underline-offset-4 hover:text-chalk"
          >
            {coords ? 'Using your location' : locating ? 'Finding you…' : 'Use my location'}
          </button>
        </div>
      </form>

      <section aria-live="polite" className="mt-14 space-y-10">
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}

        {status === 'submitted' ? <p className="text-smoke">Thinking about it…</p> : null}

        {error ? (
          <p className="text-rose">
            The sommelier couldn’t answer: {error.message}. Check the API key and Sanity project in{' '}
            <code>.env.local</code>, then try again.
          </p>
        ) : null}
        <div ref={threadEnd} />
      </section>

      {messages.length > 0 ? (
        <form onSubmit={askFollowUp} className="mt-10 flex gap-2 border-t border-must-2 pt-6">
          <label htmlFor="followup" className="sr-only">
            Ask a follow-up
          </label>
          <input
            id="followup"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder="Something white instead? Under 15 €? No alcohol?"
            className="min-w-0 flex-1 rounded-full bg-must px-5 py-3 placeholder:text-smoke/70"
          />
          {busy ? (
            <button type="button" onClick={stop} className="rounded-full border border-must-2 px-5 py-3">
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!followUp.trim()}
              className="rounded-full bg-rose px-5 py-3 font-medium text-lees disabled:opacity-40"
            >
              Ask
            </button>
          )}
        </form>
      ) : null}
    </div>
  )
}

function Message({message}: {message: UIMessage}) {
  if (message.role === 'user') {
    const text = message.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')
    return <p className="border-l-2 border-must-2 pl-4 text-smoke">{text}</p>
  }

  return (
    <div className="space-y-6">
      {message.parts.map((part, i) => {
        if (part.type === 'text') {
          return part.text.trim() ? (
            <p key={i} className="max-w-prose text-lg leading-relaxed">
              {part.text}
            </p>
          ) : null
        }

        if (part.type === 'tool-showRecommendations' && part.state === 'output-available') {
          const recs = part.output as Recommendation[]
          return (
            <div key={i} className="space-y-4">
              {recs.map((rec, j) => (
                <WineLabel key={rec.wine._id} rec={rec} index={j} />
              ))}
            </div>
          )
        }

        // Any other tool still running: one quiet status line.
        if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
          const name =
            part.type === 'dynamic-tool' ? (part as {toolName: string}).toolName : part.type.slice(5)
          const state = (part as {state: string}).state
          if (state === 'output-available' || state === 'output-error') return null
          return (
            <p key={i} className="text-sm text-smoke">
              {STEP_LABEL[name] ?? 'Looking through the notes'}…
            </p>
          )
        }
        return null
      })}
    </div>
  )
}
