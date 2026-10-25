import {defineQuery} from 'next-sanity'

/** Card projection: everything the UI needs to render a wine label. */
const wineCard = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  color,
  vintage,
  body,
  acidity,
  tannin,
  sweetness,
  abv,
  priceRange,
  servingTemp,
  tastingNotes,
  "producer": producer->name,
  "appellation": appellation->{name, region, country, "lat": location.lat, "lng": location.lng},
  "grapes": grapes[]->name,
  "image": image.asset->url,
  offers[]{_key, merchant, url, price, currency}
`

export const APPELLATIONS_QUERY = defineQuery(/* groq */ `
  *[_type == "appellation" && defined(location)]{
    _id, name, region, "lat": location.lat, "lng": location.lng
  }
`)

export const DISH_SEARCH_QUERY = defineQuery(/* groq */ `
  *[_type == "dish" && (name match $term || $term in aliases[] || aliases[] match $term)][0...3]{
    _id, name, cuisine, mainProtein, dominantFlavors, intensity, description
  }
`)

export const PAIRING_RULES_QUERY = defineQuery(/* groq */ `
  *[_type == "pairingRule" && (
    count(appliesToFlavors[@ in $flavors]) > 0 ||
    count(appliesToProteins[@ in $proteins]) > 0 ||
    (!defined(appliesToFlavors) && !defined(appliesToProteins))
  )] | order(priority desc){
    title, priority, preferredColors, target, avoid,
    "recommendedGrapes": recommendedGrapes[]->name,
    "explanation": pt::text(explanation)
  }
`)

/**
 * Catalog search. Bounds are optional: a missing param is passed as null
 * and the `$x == null ||` guard skips that filter.
 */
export const WINE_SEARCH_QUERY = defineQuery(/* groq */ `
  *[_type == "wine"
    && ($colors == null || color in $colors)
    && ($appellationIds == null || appellation._ref in $appellationIds)
    && ($acidityMin == null || acidity >= $acidityMin)
    && ($bodyMin == null || body >= $bodyMin)
    && ($bodyMax == null || body <= $bodyMax)
    && ($tanninMin == null || tannin >= $tanninMin)
    && ($tanninMax == null || !defined(tannin) || tannin <= $tanninMax)
    && ($priceRanges == null || priceRange in $priceRanges)
  ][0...24]{ ${wineCard} }
`)

export const WINES_BY_ID_QUERY = defineQuery(/* groq */ `
  *[_type == "wine" && _id in $ids]{ ${wineCard} }
`)
