import { PrimaryActionEmailHtml } from '../components/emails/PrimaryActionEmail'
import { Access, CollectionConfig } from 'payload/types'

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === 'admin') return true

  return {
    id: {
      equals: user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify:
    {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: "verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
        })
      },
    },
    tokenExpiration: 2592000, // 30 days
  },
  access: {
    read: adminsAndUser,
    create: () => true,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
  },
  admin: {
    hidden: ({ user }) => user.role !== 'admin',
    defaultColumns: ['id'],
  },
  fields: [
    {
      name: 'products',
      label: 'Products',
      admin: {
        condition: () => false,
      },
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    // {
    //   name: 'product_offer',
    //   label: 'Product Offer',
    //   admin: {
    //     condition: () => false,
    //   },
    //   type: 'relationship',
    //   relationTo: 'product_offer',
    //   hasMany: true,
    // },
    {
      name: 'phone',
      label: 'Phone',
      type: 'number',
      hasMany: false,
      required: true,
    },
    {
      name: 'role',
      defaultValue: 'user',
      required: true,
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Architect', value: 'architect' },
        { label: 'Interior Designer', value: 'interiorDesigner' },
        { label: 'Karagir', value: 'karagir' },
      ],
    },
    {
      name: 'referedBy',
      label: 'Refered By',
      type: 'relationship',
      relationTo:'users',
      hasMany: false,
    },
    {
      name: 'paymentDetails',
      label: 'Payment Details',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'select',
          options: [
            {label: "UPI", value: "UPI"},
            {label: "Bank", value: "Bank"},
            {label: "Wallet", value: "Wallet"},
          ],
          required: true,
          hasMany: false
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ]
      
    },
    {
      name: 'isEligibleForReferalProgram',
      label: 'Aligible for referal program?',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}