import {defineArrayMember, defineField, defineType} from 'sanity'
import {LemonIcon} from '@sanity/icons/Lemon'
import {FLAVORS, PROTEINS} from './shared'

export const dish = defineType({
  name: 'dish',
  title: 'Dish',
  type: 'document',
  icon: LemonIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'aliases',
      type: 'array',
      description: 'Other names people type: "spag bol", "bolo", "spaghetti à la bolognaise"',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({name: 'cuisine', type: 'string', placeholder: 'Italian, Provençal…'}),
    defineField({
      name: 'mainProtein',
      type: 'string',
      options: {list: PROTEINS},
    }),
    defineField({
      name: 'dominantFlavors',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {list: FLAVORS},
    }),
    defineField({
      name: 'intensity',
      type: 'number',
      description: 'How powerful is the dish? 1 = delicate, 5 = very powerful',
      options: {list: [1, 2, 3, 4, 5], layout: 'radio', direction: 'horizontal'},
    }),
    defineField({name: 'description', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'name', subtitle: 'cuisine'}},
})
