import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

export const producer = defineType({
  name: 'producer',
  title: 'Producer',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'appellation', type: 'reference', to: [{type: 'appellation'}]}),
    defineField({name: 'website', type: 'url'}),
    defineField({name: 'description', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'name', subtitle: 'appellation.name'}},
})
