export type WineColor = 'red' | 'white' | 'rose' | 'sparkling' | 'sweet' | 'orange'
export type PriceRange = 'budget' | 'mid' | 'premium' | 'luxury'

export type WineCard = {
  _id: string
  name: string
  slug: string | null
  color: WineColor
  vintage: number | null
  body: number | null
  acidity: number | null
  tannin: number | null
  sweetness: number | null
  abv: number | null
  priceRange: PriceRange | null
  servingTemp: string | null
  tastingNotes: string | null
  producer: string | null
  appellation: {name: string; region: string; country: string | null; lat: number | null; lng: number | null} | null
  grapes: string[] | null
  image: string | null
  offers: {_key: string; merchant: string; url: string; price: number | null; currency: string | null}[] | null
}

/** A wine the sommelier picked, with the reason shown on the label. */
export type Recommendation = {
  role: 'local' | 'classic' | 'budget' | 'alternative'
  reason: string
  wine: WineCard
}

/** What the browser knows about the moment, sent with every message. */
export type DiningContext = {
  city?: string
  lat?: number
  lng?: number
  localTime: string // "23:40"
  timeZone: string // "Europe/Paris"
  locale: string // "fr-FR"
}
