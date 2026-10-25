import {defineField} from 'sanity'

/** 1–5 scale used for body, acidity, tannin, sweetness on grapes and wines. */
export const scaleField = (
  name: string,
  title: string,
  {description, group}: {description?: string; group?: string} = {},
) =>
  defineField({
    name,
    title,
    type: 'number',
    description,
    group,
    options: {
      list: [
        {title: '1 · Very low', value: 1},
        {title: '2 · Low', value: 2},
        {title: '3 · Medium', value: 3},
        {title: '4 · High', value: 4},
        {title: '5 · Very high', value: 5},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    validation: (rule) => rule.min(1).max(5).integer(),
  })

export const WINE_COLORS = [
  {title: 'Red', value: 'red'},
  {title: 'White', value: 'white'},
  {title: 'Rosé', value: 'rose'},
  {title: 'Sparkling', value: 'sparkling'},
  {title: 'Sweet / Dessert', value: 'sweet'},
  {title: 'Orange', value: 'orange'},
]

export const FLAVORS = [
  {title: 'Tomato / acidic', value: 'tomato'},
  {title: 'Umami / savoury', value: 'umami'},
  {title: 'Fat / rich', value: 'fat'},
  {title: 'Cream / butter', value: 'cream'},
  {title: 'Spicy / heat', value: 'spicy'},
  {title: 'Herbs (garlic, basil, herbes de Provence)', value: 'herbs'},
  {title: 'Salty', value: 'salty'},
  {title: 'Sweet', value: 'sweet'},
  {title: 'Smoky / grilled', value: 'smoky'},
  {title: 'Iodine / seafood', value: 'iodine'},
  {title: 'Earthy / mushroom', value: 'earthy'},
  {title: 'Bitter', value: 'bitter'},
]

export const PROTEINS = [
  {title: 'Red meat', value: 'red-meat'},
  {title: 'Pork', value: 'pork'},
  {title: 'Poultry', value: 'poultry'},
  {title: 'Fish', value: 'fish'},
  {title: 'Shellfish', value: 'shellfish'},
  {title: 'Cheese', value: 'cheese'},
  {title: 'Vegetarian', value: 'vegetarian'},
  {title: 'Game', value: 'game'},
]

export const PRICE_RANGES = [
  {title: '€ · under 12', value: 'budget'},
  {title: '€€ · 12–25', value: 'mid'},
  {title: '€€€ · 25–50', value: 'premium'},
  {title: '€€€€ · 50+', value: 'luxury'},
]
