import {AgeGate} from '@/components/AgeGate'
import {Sommelier} from '@/components/Sommelier'

export default function Home() {
  return (
    <>
      <AgeGate />
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 sm:px-6">
        <header className="flex items-baseline justify-between py-6">
          <p className="font-display text-xl">Sommelier</p>
          <p className="text-sm text-smoke">Pairings from our cellar notes</p>
        </header>

        <main className="flex-1 pb-16">
          <Sommelier />
        </main>

        <footer className="border-t border-must-2 py-6 text-sm text-smoke">
          {/* Mandatory health message for alcohol content in France (Loi Évin). */}
          <p>L’abus d’alcool est dangereux pour la santé, à consommer avec modération.</p>
        </footer>
      </div>
    </>
  )
}
