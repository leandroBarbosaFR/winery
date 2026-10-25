'use client'

import {useEffect, useState} from 'react'

const KEY = 'sommelier:age-ok'

export function AgeGate() {
  const [state, setState] = useState<'checking' | 'ask' | 'ok' | 'under'>('checking')

  useEffect(() => {
    let ok = false
    try {
      ok = window.localStorage.getItem(KEY) === '1'
    } catch {
      // storage blocked: ask every visit
    }
    setState(ok ? 'ok' : 'ask')
  }, [])

  if (state === 'ok' || state === 'checking') return null

  const confirm = () => {
    try {
      window.localStorage.setItem(KEY, '1')
    } catch {}
    setState('ok')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      className="fixed inset-0 z-50 grid place-items-center bg-lees/95 px-4 backdrop-blur-sm"
    >
      <div className="max-w-sm">
        {state === 'ask' ? (
          <>
            <h2 id="age-title" className="font-display text-4xl leading-tight">
              Are you of legal drinking age?
            </h2>
            <p className="mt-3 text-smoke">You need to be 18 or older to use this site in France.</p>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={confirm}
                className="rounded-full bg-rose px-6 py-3 font-medium text-lees hover:bg-rose-deep"
              >
                I’m 18 or older
              </button>
              <button
                type="button"
                onClick={() => setState('under')}
                className="rounded-full border border-must-2 px-6 py-3 text-chalk hover:border-smoke"
              >
                I’m not
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="age-title" className="font-display text-4xl leading-tight">
              Come back when you’re 18.
            </h2>
            <p className="mt-3 text-smoke">Until then, a fresh lemonade goes with almost everything.</p>
          </>
        )}
      </div>
    </div>
  )
}
