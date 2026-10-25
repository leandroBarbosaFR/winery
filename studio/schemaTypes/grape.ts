import {defineArrayMember, defineField, defineType} from 'sanity'
import {LeaveIcon} from '@sanity/icons/Leave'
import {scaleField} from './shared'

export const grape = defineType({
  name: 'grape',
  title: 'Grape variety',
  type: 'document',
  icon: LeaveIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'color',
      type: 'string',
      options: {list: ['red', 'white'], layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    scaleField('body', 'Typical body'),
    scaleField('acidity', 'Typical acidity'),
    scaleField('tannin', 'Typical tannin', {description: 'Leave empty for white grapes'}),
    defineField({
      name: 'aromas',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({name: 'description', type: 'text', rows: 4}),
  ],
  preview: {select: {title: 'name', subtitle: 'color'}},
})
