import {defineType, defineField} from 'sanity'

export const analysis = defineType({
  name: 'analysis',
  title: 'Analysis',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
    }),
    defineField({
      name: 'isgood',
      title: 'Ali je analiza dobra',
      type: 'boolean',
    }),
    defineField({
      name: 'userinput',
      title: 'Uporabnikov vnos',
      type: 'markdown',
      validation: (Rule) => Rule.min(10).max(500).required().error("please enter valid number of characters!"),
    }),
    defineField({
      name: 'aianalysis',
      title: 'AIanaliza',
      type: 'markdown',
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{type: 'user'}],
    }),
  ],
  preview: {
        select: {
            title: "title",
        },
    },
})