import {defineArrayMember, defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons/Book'

/** Long-form editorial: regional guides, "wine at midnight", etc. Good Knowledge Base source. */
export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'excerpt', type: 'text', rows: 2}),
    defineField({
      name: 'appellations',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'appellation'}]})],
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
})
