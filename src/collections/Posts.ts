import { CollectionConfig, AccessArgs } from 'payload'
import type { User } from '../payload-types'

export const Posts: CollectionConfig = {
  slug: 'posts',
  auth: true,
  access: {
    create: ({ req }: AccessArgs) => {
      const user = req.user as User | undefined
      return user?.role === 'admin'
    },
    read: () => true,
    update: ({ req }: AccessArgs) => {
      const user = req.user as User | undefined
      return user?.role === 'admin' || user?.role === 'editor'
    },
    delete: ({ req }: AccessArgs) => {
      const user = req.user as User | undefined
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.createdAt = new Date()
        }
        return data
      },
    ],
  },
}
