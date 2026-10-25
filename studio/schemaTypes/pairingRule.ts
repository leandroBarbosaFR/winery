import {defineArrayMember, defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {FLAVORS, PROTEINS, WINE_COLORS} from './shared'

/**
 * Editorial pairing logic — the heart of the product.
 * The agent reads these (and the Knowledge Base built from them)
 * to turn a dish into a target wine profile.
 */
export const pairingRule = defineType({
  name: 'pairingRule',
  title: 'Pairing rule',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'when', title: 'When it applies', default: true},
    {name: 'then', title: 'What to pour'},
    {name: 'why', title: 'Why'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'when',
      placeholder: 'Tomato sauces need acidity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'appliesToFlavors',
      type: 'array',
      group: 'when',
      of: [defineArrayMember({type: 'string'})],
      options: {list: FLAVORS},
    }),
    defineField({
      name: 'appliesToProteins',
      type: 'array',
      group: 'when',
      of: [defineArrayMember({type: 'string'})],
      options: {list: PROTEINS},
    }),
    defineField({
      name: 'priority',
      type: 'number',
      group: 'when',
      description: 'Higher wins when rules conflict',
      initialValue: 5,
      validation: (rule) => rule.min(1).max(10),
    }),

    defineField({
      name: 'preferredColors',
      type: 'array',
      group: 'then',
      of: [defineArrayMember({type: 'string'})],
      options: {list: WINE_COLORS},
    }),
    defineField({
      name: 'target',
      title: 'Target wine profile',
      type: 'object',
      group: 'then',
      description: 'Ranges on the 1–5 scale. Leave a bound empty if it does not matter.',
      fields: [
        defineField({name: 'acidityMin', type: 'number'}),
        defineField({name: 'bodyMin', type: 'number'}),
        defineField({name: 'bodyMax', type: 'number'}),
        defineField({name: 'tanninMin', type: 'number'}),
        defineField({name: 'tanninMax', type: 'number'}),
        defineField({name: 'sweetnessMax', type: 'number'}),
      ],
      options: {columns: 2},
    }),
    defineField({
      name: 'recommendedGrapes',
      type: 'array',
      group: 'then',
      of: [defineArrayMember({type: 'reference', to: [{type: 'grape'}]})],
    }),
    defineField({
      name: 'avoid',
      type: 'text',
      rows: 2,
      group: 'then',
      placeholder: 'Very oaky, high-alcohol reds: tomato makes them taste bitter',
    }),

    defineField({
      name: 'explanation',
      type: 'array',
      group: 'why',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'exampleDishes',
      type: 'array',
      group: 'why',
      of: [defineArrayMember({type: 'reference', to: [{type: 'dish'}]})],
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'priority'}},
})
