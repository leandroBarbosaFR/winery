// Generates seed/seed.ndjson — demo content for local development.
// Run:  node seed/build-seed.mjs && npm run seed
//
// The wines are DEMO entries ("Domaine Exemple") so nothing here pretends
// to be a real bottle. Replace them with your feed/API import.
// Explicit _ids are used only so the seed file can wire references.

import {writeFileSync} from 'node:fs'

const docs = []
const ref = (_ref) => ({_type: 'reference', _ref})
const refs = (ids) => ids.map((id) => ({...ref(id), _key: id}))
const slug = (s) => ({_type: 'slug', current: s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})
const block = (text, i) => ({
  _type: 'block', _key: `b${i}`, style: 'normal', markDefs: [],
  children: [{_type: 'span', _key: `s${i}`, text, marks: []}],
})
const blocks = (...texts) => texts.map(block)

// ── Grapes ───────────────────────────────────────────────────────────
const grapes = [
  ['grenache', 'Grenache', 'red', 3, 2, 2, ['red fruit', 'garrigue', 'spice']],
  ['syrah', 'Syrah', 'red', 4, 3, 4, ['black pepper', 'blackberry', 'olive']],
  ['mourvedre', 'Mourvèdre', 'red', 4, 3, 5, ['dark fruit', 'leather', 'game']],
  ['cinsault', 'Cinsault', 'red', 2, 3, 2, ['strawberry', 'flowers']],
  ['sangiovese', 'Sangiovese', 'red', 3, 5, 3, ['sour cherry', 'tomato leaf', 'herbs']],
  ['barbera', 'Barbera', 'red', 3, 5, 2, ['cherry', 'plum']],
  ['pinot-noir', 'Pinot Noir', 'red', 2, 4, 2, ['cherry', 'forest floor']],
  ['cabernet-sauvignon', 'Cabernet Sauvignon', 'red', 5, 3, 5, ['cassis', 'cedar']],
  ['rolle', 'Rolle (Vermentino)', 'white', 3, 3, null, ['citrus', 'pear', 'bitter almond']],
  ['clairette', 'Clairette', 'white', 3, 2, null, ['white flowers', 'apple']],
  ['marsanne', 'Marsanne', 'white', 4, 2, null, ['almond', 'honey', 'pear']],
  ['chardonnay', 'Chardonnay', 'white', 3, 3, null, ['apple', 'butter', 'hazelnut']],
]
for (const [id, name, color, body, acidity, tannin, aromas] of grapes) {
  docs.push({_id: `grape-${id}`, _type: 'grape', name, color, body, acidity, ...(tannin ? {tannin} : {}), aromas})
}

// ── Appellations (approximate centres) ───────────────────────────────
const apps = [
  ['bandol', 'Bandol', 'Provence', 43.14, 5.75, ['red', 'rose', 'white'], ['mourvedre', 'grenache', 'cinsault']],
  ['cotes-de-provence', 'Côtes de Provence', 'Provence', 43.4, 6.2, ['rose', 'red', 'white'], ['grenache', 'cinsault', 'syrah', 'rolle']],
  ['cassis', 'Cassis', 'Provence', 43.21, 5.54, ['white', 'rose'], ['clairette', 'marsanne']],
  ['palette', 'Palette', 'Provence', 43.49, 5.5, ['white', 'red', 'rose'], ['grenache', 'mourvedre', 'clairette']],
  ['coteaux-aix', "Coteaux d'Aix-en-Provence", 'Provence', 43.6, 5.4, ['rose', 'red'], ['grenache', 'syrah', 'cabernet-sauvignon']],
  ['baux', 'Les Baux-de-Provence', 'Provence', 43.74, 4.8, ['red', 'rose'], ['grenache', 'syrah']],
  ['cotes-du-rhone', 'Côtes du Rhône', 'Rhône', 44.1, 4.8, ['red', 'rose', 'white'], ['grenache', 'syrah', 'mourvedre']],
  ['gigondas', 'Gigondas', 'Rhône', 44.16, 5.0, ['red'], ['grenache', 'syrah', 'mourvedre']],
  ['chateauneuf', 'Châteauneuf-du-Pape', 'Rhône', 44.06, 4.83, ['red', 'white'], ['grenache', 'syrah', 'mourvedre']],
  ['chianti-classico', 'Chianti Classico', 'Tuscany', 43.5, 11.3, ['red'], ['sangiovese'], 'Italy'],
  ['barbera-asti', "Barbera d'Asti", 'Piedmont', 44.9, 8.2, ['red'], ['barbera'], 'Italy'],
  ['bourgogne', 'Bourgogne', 'Burgundy', 47.0, 4.8, ['red', 'white'], ['pinot-noir', 'chardonnay']],
]
for (const [id, name, region, lat, lng, typicalColors, mainGrapes, country = 'France'] of apps) {
  docs.push({
    _id: `appellation-${id}`, _type: 'appellation', name, slug: slug(name), region, country,
    location: {_type: 'geopoint', lat, lng}, typicalColors, mainGrapes: refs(mainGrapes.map((g) => `grape-${g}`)),
  })
}

// ── Demo producer ────────────────────────────────────────────────────
docs.push({_id: 'producer-demo', _type: 'producer', name: 'Domaine Exemple (demo)', description: 'Placeholder producer for development data.'})

// ── Demo wines ───────────────────────────────────────────────────────
// [id, name, appellation, color, grapes, body, acidity, tannin, sweetness, abv, price, temp, notes]
const wines = [
  ['bandol-rouge', 'Bandol Rouge', 'bandol', 'red', ['mourvedre', 'grenache'], 4, 3, 4, 1, 14, 'premium', '16–18', 'Dark fruit, garrigue and a firm, savoury finish. Built for slow-cooked meat.'],
  ['bandol-rose', 'Bandol Rosé', 'bandol', 'rose', ['mourvedre', 'cinsault'], 3, 3, 1, 1, 13, 'mid', '10–12', 'More structure than most rosés; peach, herbs, saline finish.'],
  ['provence-rose', 'Côtes de Provence Rosé', 'cotes-de-provence', 'rose', ['grenache', 'cinsault'], 2, 3, 1, 1, 12.5, 'budget', '8–10', 'Pale, crisp, red-currant and citrus. Easy-drinking.'],
  ['provence-rouge', 'Côtes de Provence Rouge', 'cotes-de-provence', 'red', ['grenache', 'syrah'], 3, 3, 3, 1, 13.5, 'budget', '15–16', 'Juicy red fruit, a touch of pepper, soft tannins.'],
  ['cassis-blanc', 'Cassis Blanc', 'cassis', 'white', ['clairette', 'marsanne'], 3, 3, null, 1, 13, 'mid', '10–12', 'Sea-breeze white: white flowers, almond and salinity.'],
  ['aix-rouge', "Coteaux d'Aix Rouge", 'coteaux-aix', 'red', ['grenache', 'syrah', 'cabernet-sauvignon'], 3, 3, 3, 1, 13.5, 'budget', '15–17', 'Ripe cherry, herbs, medium body.'],
  ['cdr-rouge', 'Côtes du Rhône Rouge', 'cotes-du-rhone', 'red', ['grenache', 'syrah'], 3, 3, 3, 1, 14, 'budget', '15–17', 'Classic bistro red: raspberry, pepper, supple.'],
  ['gigondas', 'Gigondas', 'gigondas', 'red', ['grenache', 'syrah', 'mourvedre'], 5, 3, 4, 1, 14.5, 'premium', '16–18', 'Powerful, kirsch and spice, grippy tannins.'],
  ['chianti', 'Chianti Classico', 'chianti-classico', 'red', ['sangiovese'], 3, 5, 3, 1, 13.5, 'mid', '16–17', 'Sour cherry, dried herbs, bright acidity — a tomato-sauce classic.'],
  ['barbera', "Barbera d'Asti", 'barbera-asti', 'red', ['barbera'], 3, 5, 2, 1, 13.5, 'budget', '15–16', 'Lively cherry, low tannin, high acidity.'],
  ['bourgogne-rouge', 'Bourgogne Rouge', 'bourgogne', 'red', ['pinot-noir'], 2, 4, 2, 1, 12.5, 'mid', '14–16', 'Light, red cherry and earth.'],
]
for (const [id, name, app, color, gr, body, acidity, tannin, sweetness, abv, priceRange, servingTemp, tastingNotes] of wines) {
  docs.push({
    _id: `wine-${id}`, _type: 'wine', name: `${name} (demo)`, slug: slug(`${name}-demo`),
    producer: ref('producer-demo'), appellation: ref(`appellation-${app}`), color,
    grapes: refs(gr.map((g) => `grape-${g}`)), body, acidity, ...(tannin ? {tannin} : {}), sweetness, abv,
    priceRange, servingTemp, tastingNotes, reviewStatus: 'needsReview',
  })
}

// ── Dishes ───────────────────────────────────────────────────────────
const dishes = [
  ['spaghetti-bolognese', 'Spaghetti bolognese', ['spag bol', 'bolo', 'spaghetti à la bolognaise', 'pâtes bolognaise'], 'Italian', 'red-meat', ['tomato', 'umami', 'fat'], 3],
  ['pizza-margherita', 'Pizza margherita', ['pizza'], 'Italian', 'cheese', ['tomato', 'fat', 'herbs'], 2],
  ['bouillabaisse', 'Bouillabaisse', [], 'Provençal', 'fish', ['iodine', 'herbs', 'umami'], 4],
  ['aioli', 'Grand aïoli', ['aïoli provençal'], 'Provençal', 'fish', ['herbs', 'fat', 'salty'], 3],
  ['daube', 'Daube provençale', ['daube'], 'Provençal', 'red-meat', ['umami', 'fat', 'herbs'], 5],
  ['ratatouille', 'Ratatouille', [], 'Provençal', 'vegetarian', ['tomato', 'herbs'], 2],
  ['grilled-sea-bass', 'Grilled sea bass', ['loup grillé', 'bar grillé'], 'Mediterranean', 'fish', ['iodine', 'smoky'], 2],
  ['cheese-board', 'Cheese board', ['plateau de fromages'], 'French', 'cheese', ['salty', 'fat'], 3],
]
for (const [id, name, aliases, cuisine, mainProtein, dominantFlavors, intensity] of dishes) {
  docs.push({_id: `dish-${id}`, _type: 'dish', name, slug: slug(name), aliases, cuisine, mainProtein, dominantFlavors, intensity})
}

// ── Pairing rules ────────────────────────────────────────────────────
const rules = [
  {
    id: 'tomato-acidity', title: 'Tomato sauces need acidity', flavors: ['tomato'], priority: 8,
    colors: ['red', 'rose'], target: {acidityMin: 4}, grapes: ['sangiovese', 'barbera', 'grenache'],
    avoid: 'Low-acid, very oaky or high-alcohol reds: next to tomato they taste flat and bitter.',
    text: ['Tomato is acidic. A wine with less acidity than the sauce tastes dull and flabby next to it.', 'Match acid with acid: Sangiovese and Barbera are the textbook choices; in the south of France a fresh Grenache-based red works.'],
    dishes: ['spaghetti-bolognese', 'pizza-margherita', 'ratatouille'],
  },
  {
    id: 'meat-sauce-tannin', title: 'Meat sauces like medium tannin', proteins: ['red-meat'], flavors: ['umami', 'fat'], priority: 6,
    colors: ['red'], target: {tanninMin: 2, tanninMax: 4, bodyMin: 3}, grapes: ['grenache', 'syrah', 'sangiovese'],
    text: ['Fat and protein soften tannin, so meat sauces can take a medium-tannin red.', 'Keep it medium: a very tannic wine overwhelms a pasta dish.'],
    dishes: ['spaghetti-bolognese'],
  },
  {
    id: 'slow-cooked-power', title: 'Powerful stews want powerful reds', proteins: ['red-meat', 'game'], priority: 7,
    colors: ['red'], target: {bodyMin: 4, tanninMin: 3}, grapes: ['mourvedre', 'syrah'],
    text: ['Match weight with weight. A daube cooked for hours needs a structured red such as Bandol or Gigondas.'],
    dishes: ['daube'],
  },
  {
    id: 'seafood-white', title: 'Seafood and iodine: crisp whites and pale rosés', proteins: ['fish', 'shellfish'], flavors: ['iodine'], priority: 8,
    colors: ['white', 'rose'], target: {tanninMax: 1, acidityMin: 3}, grapes: ['clairette', 'marsanne', 'rolle'],
    avoid: 'Tannic reds with oily fish or shellfish can taste metallic.',
    text: ['Tannin reacts badly with fish oils. Choose whites or rosés with enough freshness — Cassis blanc with bouillabaisse is the local classic.'],
    dishes: ['bouillabaisse', 'grilled-sea-bass', 'aioli'],
  },
  {
    id: 'garlic-herbs-rose', title: 'Garlic and Provençal herbs: structured rosé', flavors: ['herbs'], priority: 5,
    colors: ['rose', 'white'], target: {acidityMin: 3, bodyMin: 2},
    text: ['Garlic-heavy Provençal food (aïoli, tapenade) is easiest with a rosé or white with some body — Bandol rosé handles it well.'],
    dishes: ['aioli', 'ratatouille'],
  },
  {
    id: 'late-night-lighter', title: 'Late at night: lighter and lower alcohol', priority: 3,
    target: {bodyMax: 3},
    text: ['Near midnight, suggest lighter, fresher wines and moderate alcohol, and mention serving sizes. If the dish is heavy, it still wins on structure.'],
  },
]
for (const r of rules) {
  docs.push({
    _id: `pairingRule-${r.id}`, _type: 'pairingRule', title: r.title, priority: r.priority,
    ...(r.flavors ? {appliesToFlavors: r.flavors} : {}),
    ...(r.proteins ? {appliesToProteins: r.proteins} : {}),
    ...(r.colors ? {preferredColors: r.colors} : {}),
    target: {_type: 'object', ...r.target},
    ...(r.grapes ? {recommendedGrapes: refs(r.grapes.map((g) => `grape-${g}`))} : {}),
    ...(r.avoid ? {avoid: r.avoid} : {}),
    explanation: blocks(...r.text),
    ...(r.dishes ? {exampleDishes: refs(r.dishes.map((d) => `dish-${d}`))} : {}),
  })
}

// ── Guides (good Knowledge Base sources) ─────────────────────────────
docs.push({
  _id: 'guide-provence-pairing', _type: 'guide', title: 'Eating and drinking in Provence', slug: slug('Eating and drinking in Provence'),
  excerpt: 'The local logic: rosé and white by the sea, Bandol red with the daube.',
  appellations: refs(['bandol', 'cassis', 'cotes-de-provence'].map((a) => `appellation-${a}`)),
  body: blocks(
    'Provence pairs by place. By the sea, Cassis whites and pale Côtes de Provence rosés go with fish, aïoli and grilled vegetables.',
    'Inland and in winter, Bandol rouge (Mourvèdre) and Rhône reds go with daube and lamb.',
    'Bandol rosé is the most food-friendly rosé of the region and works with garlic-heavy dishes.',
  ),
})
docs.push({
  _id: 'guide-italian-pasta', _type: 'guide', title: 'Pasta with tomato sauce', slug: slug('Pasta with tomato sauce'),
  excerpt: 'Why Chianti works with bolognese — and the Provençal alternatives.',
  body: blocks(
    'Tomato-based pasta needs a wine with high acidity. Chianti Classico (Sangiovese) and Barbera are the classic Italian matches.',
    'In the south of France, a fresh Côtes du Rhône or Côtes de Provence red does the same job; avoid heavy, oaky reds.',
  ),
})

writeFileSync(new URL('./seed.ndjson', import.meta.url), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`Wrote ${docs.length} documents to seed/seed.ndjson`)
