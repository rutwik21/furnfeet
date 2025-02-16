import { BeforeChangeHook } from 'payload/dist/collections/config/types'
import { Address, User } from '../payload-types'
import { Access, CollectionConfig } from 'payload/types'

const isAdminOrHasAccessToAddresses =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined

    if (!user) return false
    if (user.role === 'admin') return true

    return {
      user: {
        equals: req.user.id,
      },
    }
  }
  const addUser: BeforeChangeHook<Address> = async ({
    req,
    data,
  }) => {
    const user = req.user
    return { ...data, user: user.id }
  }
export const Addresses: CollectionConfig = {
  slug: 'addresses',
  hooks: {
    beforeChange: [
      addUser
    ],
  },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer

      if (!req.user || !referer?.includes('sell')) {
        return true
      }

      return await isAdminOrHasAccessToAddresses()({ req })
    },
    delete: isAdminOrHasAccessToAddresses(),
    update: isAdminOrHasAccessToAddresses(),
  },
  admin: {
    hidden: ({ user }) => user.role !== 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      hasMany: false,
    },
    {
      name: 'contact',
      type: 'number',
      required: true,
      hasMany: false,
    },
    {
      name: 'addressLine1',
      type: 'text',
      required: true,
      hasMany: false,
    },
    {
      name: 'addressLine2',
      type: 'text',
      required: false,
      hasMany: false,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      hasMany: false,
    },
    {
      name: 'state',
      type: 'text',
      required: true,
      hasMany: false,
    },
    {
      name: 'pinCode',
      type: 'text',
      required: true,
      hasMany: false,
    },
    {
      name: 'isDefaultAddress',
      type: 'checkbox',
    },
  ],
}
