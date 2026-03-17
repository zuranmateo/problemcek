import {defineType, defineField} from 'sanity'

export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'id',
      type: 'number',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
        name: 'surname',
        title: 'Surname',
        type: 'string'
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
    }),
    defineField({
      name: "image",
       type:"image",
    }),
    defineField({
      name: "imageUrl",
      type:"url",
    }),
  ],
  preview: {
    select: {
      title: "email",
    },
  },
})