import {defineArrayMember, defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'
import {WINE_COLORS} from './shared'

export const appellation = defineType({
  name: 'appellation',
  title: 'Appellation',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'region',
      type: 'string',
      description: 'Wine region, e.g. Provence, Rhône, Languedoc, Bordeaux',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'country', type: 'string', initialValue: 'France'}),
    defineField({
      name: 'location',
      type: 'geopoint',
      description: 'Approximate centre. Used to find wines local to the user.',
    }),
    defineField({
      name: 'typicalColors',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {list: WINE_COLORS},
    }),
    defineField({
      name: 'mainGrapes',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'grape'}]})],
    }),
    defineField({name: 'description', type: 'text', rows: 4}),
    defineField({
      name: 'externalId',
      title: 'INAO / external id',
      type: 'string',
      description: 'Source identity for imports. Never edit by hand.',
      readOnly: true,
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'region'}},
})
