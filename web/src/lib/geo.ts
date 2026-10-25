/** Great-circle distance in km. */
export function distanceKm(a: {lat: number; lng: number}, b: {lat: number; lng: number}) {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** A few city centres so "Marseille" works without a geocoding API. Extend or swap for a real geocoder. */
export const KNOWN_CITIES: Record<string, {lat: number; lng: number}> = {
  marseille: {lat: 43.2965, lng: 5.3698},
  aix: {lat: 43.5297, lng: 5.4474},
  'aix-en-provence': {lat: 43.5297, lng: 5.4474},
  toulon: {lat: 43.1242, lng: 5.928},
  nice: {lat: 43.7102, lng: 7.262},
  avignon: {lat: 43.9493, lng: 4.8055},
  montpellier: {lat: 43.6108, lng: 3.8767},
  lyon: {lat: 45.764, lng: 4.8357},
  paris: {lat: 48.8566, lng: 2.3522},
  bordeaux: {lat: 44.8378, lng: -0.5792},
  gemenos: {lat: 43.2955, lng: 5.6283},
  cassis: {lat: 43.2148, lng: 5.5396},
}

export function cityToPoint(city?: string) {
  if (!city) return undefined
  const key = city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
  return KNOWN_CITIES[key]
}
