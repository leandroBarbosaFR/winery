import {defineArrayMember, defineField, defineType} from 'sanity'
import {BottleIcon} from '@sanity/icons/Bottle'
import {PRICE_RANGES, WINE_COLORS, scaleField} from './shared'

/**
 * A bottle in the catalog.
 *
 * Imported data (from feeds/APIs) lives in `externalIds` and `offers`.
 * Everything else is editorial: a sync script must only set fields
 * that are still empty, so editors' corrections are never overwritten.
 */
export const wine = defineType({
  name: 'wine',
  title: 'Wine',
  type: 'document',
  icon: BottleIcon,
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'profile', title: 'Taste profile'},
    {name: 'commerce', title: 'Where to buy'},
    {name: 'source', title: 'Source data'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'identity',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'producer',
      type: 'reference',
      group: 'identity',
      to: [{type: 'producer'}],
    }),
    defineField({
      name: 'appellation',
      type: 'reference',
      group: 'identity',
      to: [{type: 'appellation'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      type: 'string',
      group: 'identity',
      options: {list: WINE_COLORS, layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'vintage',
      type: 'number',
      group: 'identity',
      description: 'Leave empty for non-vintage',
    }),
    defineField({
      name: 'grapes',
      type: 'array',
      group: 'identity',
      of: [defineArrayMember({type: 'reference', to: [{type: 'grape'}]})],
    }),
    defineField({
      name: 'image',
      type: 'image',
      group: 'identity',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string'})],
    }),

    scaleField('body', 'Body', {group: 'profile'}),
    scaleField('acidity', 'Acidity', {group: 'profile'}),
    scaleField('tannin', 'Tannin', {group: 'profile'}),
    scaleField('sweetness', 'Sweetness', {group: 'profile'}),
    defineField({
      name: 'abv',
      title: 'Alcohol (% vol)',
      type: 'number',
      group: 'profile',
      validation: (rule) => rule.min(0).max(25),
    }),
    defineField({
      name: 'servingTemp',
      title: 'Serving temperature (°C)',
      type: 'string',
      group: 'profile',
      placeholder: '14–16',
    }),
    defineField({
      name: 'tastingNotes',
      type: 'text',
      rows: 4,
      group: 'profile',
    }),
    defineField({
      name: 'reviewStatus',
      type: 'string',
      group: 'profile',
      description: 'AI-enriched profiles stay "needs review" until a human checks them.',
      options: {
        list: [
          {title: 'Needs review', value: 'needsReview'},
          {title: 'Reviewed', value: 'reviewed'},
        ],
        layout: 'radio',
      },
      initialValue: 'needsReview',
    }),

    defineField({
      name: 'priceRange',
      type: 'string',
      group: 'commerce',
      options: {list: PRICE_RANGES, layout: 'radio'},
    }),
    defineField({
      name: 'offers',
      type: 'array',
      group: 'commerce',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'offer',
          fields: [
            defineField({name: 'merchant', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'url', type: 'url', validation: (r) => r.required()}),
            defineField({name: 'price', type: 'number'}),
            defineField({name: 'currency', type: 'string', initialValue: 'EUR'}),
          ],
          preview: {select: {title: 'merchant', subtitle: 'price'}},
        }),
      ],
    }),

    defineField({
      name: 'externalIds',
      type: 'object',
      group: 'source',
      description: 'Identity in external sources, used by sync scripts to find this wine.',
      readOnly: true,
      fields: [
        defineField({name: 'lwin', title: 'LWIN', type: 'string'}),
        defineField({name: 'feedId', title: 'Affiliate feed id', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'name', vintage: 'vintage', appellation: 'appellation.name', media: 'image'},
    prepare: ({title, vintage, appellation, media}) => ({
      title: vintage ? `${title} ${vintage}` : title,
      subtitle: appellation,
      media,
    }),
  },
})
