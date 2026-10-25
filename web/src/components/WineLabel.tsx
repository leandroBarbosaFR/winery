import type {Recommendation, WineColor} from '@/lib/types'

const COLOR_NAME: Record<WineColor, string> = {
  red: 'Red',
  white: 'White',
  rose: 'Rosé',
  sparkling: 'Sparkling',
  sweet: 'Sweet',
  orange: 'Orange',
}

const STRIPE: Record<WineColor, string> = {
  red: 'bg-wine-red',
  white: 'bg-wine-white',
  rose: 'bg-wine-rose',
  sparkling: 'bg-wine-sparkling',
  sweet: 'bg-wine-sweet',
  orange: 'bg-wine-orange',
}

const ROLE: Record<Recommendation['role'], string> = {
  local: 'From near you',
  classic: 'The classic match',
  budget: 'Easy on the wallet',
  alternative: 'Another way',
}

const PRICE: Record<string, string> = {budget: '€', mid: '€€', premium: '€€€', luxury: '€€€€'}

/** Five glasses, filled to the level: body, acidity, tannin read at a glance. */
function Level({label, value}: {label: string; value: number | null}) {
  if (value == null) return null
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-smoke">{label}</dt>
      <dd className="flex gap-1" aria-label={`${label} ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            aria-hidden
            className={`h-3 w-2 rounded-b-full ${i <= value ? 'bg-chalk' : 'bg-must-2'}`}
          />
        ))}
      </dd>
    </div>
  )
}

export function WineLabel({rec, index}: {rec: Recommendation; index: number}) {
  const {wine} = rec
  const offer = wine.offers?.[0]
  return (
    <article
      className="animate-pour relative overflow-hidden rounded-sm bg-must pl-5"
      style={{animationDelay: `${index * 110}ms`}}
    >
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1.5 ${STRIPE[wine.color]}`} />
      <div className="grid gap-5 p-5 pl-2 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm text-rose">{ROLE[rec.role]}</p>
          <h3 className="mt-1 font-display text-3xl leading-none">{wine.appellation?.name ?? wine.name}</h3>
          <p className="mt-2 text-smoke">
            {wine.name}
            {wine.vintage ? `, ${wine.vintage}` : ''}
            {wine.producer ? ` — ${wine.producer}` : ''}
          </p>
          <p className="mt-4 max-w-prose leading-relaxed">{rec.reason}</p>
        </div>

        <dl className="grid content-start gap-2 text-sm sm:w-44">
          <div className="flex justify-between">
            <dt className="text-smoke">Style</dt>
            <dd>
              {COLOR_NAME[wine.color]}
              {wine.priceRange ? `, ${PRICE[wine.priceRange]}` : ''}
            </dd>
          </div>
          <Level label="Body" value={wine.body} />
          <Level label="Acidity" value={wine.acidity} />
          <Level label="Tannin" value={wine.tannin} />
          {wine.servingTemp ? (
            <div className="flex justify-between">
              <dt className="text-smoke">Serve at</dt>
              <dd>{wine.servingTemp} °C</dd>
            </div>
          ) : null}
        </dl>
      </div>

      {offer ? (
        <a
          href={offer.url}
          target="_blank"
          rel="noopener sponsored"
          className="block border-t border-must-2 px-2 py-3 text-sm text-chalk hover:text-rose"
        >
          See it at {offer.merchant}
          {offer.price ? `, ${offer.price.toFixed(2)} ${offer.currency ?? 'EUR'}` : ''}
        </a>
      ) : null}
    </article>
  )
}
