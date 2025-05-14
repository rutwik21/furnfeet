import { Access, CollectionConfig } from 'payload/types'

const yourOwn: Access = ({ req: { user } }) => {
  if (user.role === 'admin') return true

  return {
    user: {
      equals: user?.id,
    },
  }
}

export const CommissionLedger: CollectionConfig = {
  slug: 'commissionLedger',
  admin: {
    useAsTitle: 'Your commission ledger',
    description:
      'A summary of all your commission on Furnfeet.',
  },
  access: {
    read: yourOwn,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
    create: ({ req }) => req.user.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      label:'User',
      type: 'relationship',
      relationTo: 'users',
      access: {
        read: ({ req }) => req.user.role === 'admin',
        create: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      required: true,
    },
    {
      name: 'description',
      label:'Description',
      type: 'text',
      access: {
        create:  ({ req }) => req.user.role === 'admin',
        read:  ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      required: true,
    },
    {
      name: 'credit',
      label:'Credit',
      type: 'number',
      defaultValue: 0,
      required: false,
    },
    {
      name: 'debit',
      label:'Debit',
      type: 'number',
      defaultValue: 0,
      required: false,
    },
    {
      name: 'balance',
      label:'Balance',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'isCompleted',
      label:'Mark as complete?',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create:  ({ req }) => req.user.role === 'admin',
        read:  ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      required: true,
    },
    {
      name: 'isCancelled',
      label:'Mark as cancelled?',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create:  ({ req }) => req.user.role === 'admin',
        read:  ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
    },
    {
      name: "createdAt",
      type:"date",
      admin: {
        hidden: true, // hides from admin UI
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Set to current date before any change
            return new Date();
          }
        ],
      },
      required: false
    },
  ],
}