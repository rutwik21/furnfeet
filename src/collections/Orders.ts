import { Access, CollectionConfig } from 'payload/types'
import { boolean } from 'zod'

const yourOwn: Access = ({ req: { user } }) => {
  if (user.role === 'admin') return true

  return {
    user: {
      equals: user?.id,
    },
  }
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'Your Orders',
    description:
      'A summary of all your orders on Furnfeet.',
  },
  access: {
    read: yourOwn,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
    create: ({ req }) => req.user.role === 'admin',
  },
  fields: [
    {
      name: '_isPaid',
      type: 'checkbox',
      access: {
        read: ({ req }) => req.user.role === 'admin',
        create: () => false,
        update: ({ req }) => req.user.role === 'admin',
      },
      defaultValue: false,
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      type: 'row',
      fields:[
        {
          name: 'orderId',
          type: 'text',
          access: {
            create:  ({ req }) => req.user.role === 'admin',
            read:  ({ req }) => req.user.role === 'admin',
            update: () => false
          },
          required: true,
        },
        {
          name: 'user',
          type: 'relationship',
          access: {
            create:  ({ req }) => req.user.role === 'admin',
            read:  ({ req }) => req.user.role === 'admin',
            update: ({ req }) => req.user.role === 'admin',
          },
          relationTo: 'users',
          required: true,
        },
        {
          name: 'address',
          type: 'relationship',
          relationTo: 'addresses',
          required: true,
          hasMany: false,
        },
      ]
    },
    {
      type: 'row',
      fields:[
        {
          name: 'paymentMode',
          type:"select",
          required: false,
          options:[
            {label:"Online" ,value:"online"},
            {label:"Cash on delivery" ,value:"cashOnDelivery"},
          ]
        },
        {
          name: 'totalOrderValue',
          type: 'number',
          required: true,
        },
      ]
    },
    {
      name: 'data',
      type: 'array',
      fields:[
        {
          name: "productId",
          type:"relationship",
          relationTo:"products",
          required: true,
          hasMany: false
        },
        {
          type:'row',
          fields:[
            {
              name: "orderStatus",
              type:"select",
              required: false,
              defaultValue: "received",
              options:[
                {label:"Received" ,value:"received"},
                {label:"In Process" ,value:"inProcess"},
                {label:"In Transit" ,value:"inTransit"},
                {label:"Rejected" ,value:"rejected"},
                {label:"Confirmed" ,value:"confirmed"},
                {label:"Shipped" ,value:"shipped"},
                {label:"Out for delivery" ,value:"outForDelivery"},
                {label:"Delivered" ,value:"delivered"},
                {label:"Cancelled" ,value:"cancelled"},
              ]
            },
            {
              name: "estimatedDeliveryDate",
              type:"date",
              hooks: {
                beforeChange: [
                  ({ data }) => {
                    if(!data){
                      const currentDate = new Date();
                      const sixDaysAfter = new Date(currentDate);
                      sixDaysAfter.setDate(currentDate.getDate() + 6);
                      return sixDaysAfter;
                    }
                  }
                ],
              },
              required: false
            },
          ]
        },
        {
          name: "dimensions",
          type:"array",
          fields:[
            {
              type: 'row',
              fields:[
                {
                  name: "length",
                  type:"number",
                  hasMany: false,
                  required: true
                },
                {
                  name: "width",
                  type:"number",
                  hasMany: false,
                  required: true
                },
                {
                  name: "height",
                  type:"number",
                  hasMany: false,
                  required: false
                },
                {
                  name: "unit",
                  type: 'select',
                  options: [{label: 'Inch', value:'inch'}],
                  hasMany: false,
                  required: true
                },
              ]
            },
          ]
        },
        {
          type: 'row',
          fields:[
            {
              name: "price",
              type:"number",
              hasMany: false,
              required: true
            },
            {
              name: "qty",
              type:"number",
              hasMany: false,
              defaultValue: 1
            },
            {
              name: "fabric",
              type:"relationship",
              relationTo:"products",
              required: false,
              hasMany: false
            },
            {
              name: "foam",
              type:"text",
              required: false
            },
          ]
        },
        {
          type: 'row',
          fields:[
            {
              name: "isCustomized",
              type:"checkbox",
              defaultValue: false,
              required: false
            },
           
            {
              name: "isOrderCancelled",
              type:"checkbox",
              defaultValue: false,
              required: false
            },
            {
              name: "isMoneyRefunded",
              type:"checkbox",
              defaultValue: false,
              required: false,
              admin:{
                condition:(_,{isOrderCancelled})=> Boolean(isOrderCancelled) || false
              }
            },
          ]
        },
        {
          name: "reasonForCancellation",
          type:"text", 
          required: false,
          admin:{
            condition:(_,{isOrderCancelled})=> Boolean(isOrderCancelled) || false
          }
        },
        {
          type: 'row',
          fields:[
            {
              name: "profit",
              label: "Profit",
              type:"number", 
              required: false,
            },
            {
              name: "commission",
              label: "Commission",
              type:"number", 
              required: false,
            },
          ]
        },
        {
          name: "updatedAt",
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
      required: true,
    },
  ],
}