import { Access, CollectionConfig } from 'payload/types'

const yourOwn: Access = ({ req: { user } }) => {
  if (user.role === 'admin') return true

  return {
    user: {
      equals: user?.id,
    },
  }
}

export const WithdrawalRequests: CollectionConfig = {
  slug: 'withdrawalRequests',
  admin: {
    useAsTitle: 'Withdrawal Requests',
    description:
      'List of all Withdrawal Requests.',
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
      name: 'comment',
      label:'Comment (UTR no. or any comment)',
      type: 'text',
      access: {
        create:  ({ req }) => req.user.role === 'admin',
        read:  ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      required: false,
    },
    {
      name: 'amount',
      label:'Amount',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'acDetails',
      label:'Account Details',
      type: 'text',
      required: true,
    },
    {
      name: 'commissionLedger',
      label:'Commission ledger entry ID',
      type: 'relationship',
      relationTo: 'commissionLedger',
      required: true,
    },
    {
      name: 'paymentMode',
      label:'Payment mode',
      type: 'select',
      options:[
        {label: "UPI", value: "UPI"},
        {label: "Bank", value: "Bank"},
        {label: "Wallet", value: "Wallet"},
        {label: "Cash", value: "Cash"},
      ],
      required: true,
    },
    {
      name: 'status',
      label:'Status',
      type: 'select',
      defaultValue: "Pending",
      options:[
        {label: "Pending", value: "Pending"},
        {label: "Complete", value: "Complete"},
        {label: "Rejected", value: "Rejected"},
        {label: "Cancelled", value: "Cancelled"},
      ],
      access: {
        create:  ({ req }) => req.user.role === 'admin',
        read:  ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      required: true,
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