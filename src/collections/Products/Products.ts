import {
  AfterChangeHook,
  BeforeChangeHook,
} from 'payload/dist/collections/config/types'
import { PRODUCT_CATEGORIES } from '../../config'
import { Access, CollectionConfig } from 'payload/types'
import { Product, User } from '../../payload-types'
// import { CustomSelectComponent } from '../components/customSelect'
// import { stripe } from '../../lib/stripe'

const addUser: BeforeChangeHook<Product> = async ({
  req,
  data,
  operation
}) => {
  
  if (operation === 'update') {
    return data
  }

  const user = req.user

  return { ...data, user: user.id }
}

const syncUser: AfterChangeHook<Product> = async ({
  req,
  doc,
  operation
}) => {
  if (operation === 'update') {
    return
  }
  const fullUser = await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
  })

  if (fullUser && typeof fullUser === 'object') {
    const { products } = fullUser as unknown as {products: Product[]}
    const allIDs = [
      ...(products?.map((product) =>
        typeof product === 'object' ? product.id : product
      ) || []),
    ]

    const createdProductIDs = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index
    )

    const dataToUpdate = [...createdProductIDs, doc.id]

    await req.payload.update({
      collection: 'users',
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    })
  }
}

const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined

    if (!user) return false
    if (user.role === 'admin') return true

    const userProductIDs = (user.products || []).reduce<
      Array<string>
    >((acc, product) => {
      if (!product) return acc
      if (typeof product === 'string') {
        acc.push(product)
      } else {
        acc.push(product.id)
      }

      return acc
    }, [])

    return {
      id: {
        in: userProductIDs,
      },
    }
  }

  function getMeSubCategories(){
    let output:{label:string,value:string}[] = [];
    PRODUCT_CATEGORIES.forEach(({featured}) => {
      featured.forEach(({subCategories,name,value})=>{
        const temp1 = [{label:name,value:value}];
        const temp = subCategories.map(({name,value})=>({label:name,value:value}));
        output = [...output, ...temp1, ...temp ];
      })
    })
    return output;
  }
  function getMeRawMaterials(){

    let output:{label:string,value:string}[] = [
      {label: 'Height', value:'height'}, 
      {label: 'Width', value:'width'},
      {label: 'Length', value:'length'},
    ];

    PRODUCT_CATEGORIES.forEach(({featured, value}) => {
      if(value === 'raw_materials'){
        featured.forEach(({name,value})=>{
          const temp1 = [{label:name,value:value}];
          output = [...output, ...temp1];
        })
      }
    })
    return output;
  }
  function getMeFabricTypes(){

    let output:{label:string,value:string}[] = [];

    PRODUCT_CATEGORIES.forEach(({featured, value}) => {
      if(value === 'raw_materials'){
        featured.forEach(({value,subCategories})=>{
          if(value==='fabric'){
            const temp1 = subCategories.map(({name,value})=>({label:name,value:value}));
            output = [...output, ...temp1];
          }
        })
      }
    })
    return output;
  }

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  labels:{singular:'Product',plural:'Products'},
  access: {
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  hooks: {
    afterChange: [syncUser],
    beforeChange: [
      addUser,
      // async (args) => {
      //   if (args.operation === 'create') {
      //     const data = args.data as Product

      //     const createdProduct =
      //       await stripe.products.create({
      //         name: data.name,
      //         default_price_data: {
      //           currency: 'USD',
      //           unit_amount: Math.round(data.price * 100),
      //         },
      //       })

      //     const updated: Product = {
      //       ...data,
      //       stripeId: createdProduct.id,
      //       priceId: createdProduct.default_price as string,
      //     }

      //     return updated
      //   } else if (args.operation === 'update') {
      //     const data = args.data as Product

      //     const updatedProduct =
      //       await stripe.products.update(data.stripeId!, {
      //         name: data.name,
      //         default_price: data.priceId!,
      //       })

      //     const updated: Product = {
      //       ...data,
      //       stripeId: updatedProduct.id,
      //       priceId: updatedProduct.default_price as string,
      //     }

      //     return updated
      //   }
      // },
    ],
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
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Product details',
    },
    {
      name: 'avg_rating',
      label: 'Avg Rating',
      type: 'number',
      defaultValue: 0,
      admin:{
        condition: () => false,
      }
    },
    // {
    //   name: 'have_varient',
    //   label: 'Have Varients?',
    //   type: 'radio',
    //   options: [
    //     { label: 'Yes', value: 'yes' },
    //     { label: 'No', value: 'no' },
    //   ],
    //   defaultValue:'no',
    //   required: true,
    // },
    {
      type:'row',
      fields:[
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: PRODUCT_CATEGORIES.map(
            ({ label, value }) => ({ label, value })
          ),
          required: true,
        },
        {
          name: 'subcategory',
          label: 'Sub Category',
          type: 'select',
          hasMany:true,
          options: getMeSubCategories(),
          required: true,
        },

      ]
    },
    {
      type:'row',
      fields:[
        {
          name: 'roomType',
          label: 'Room Type',
          type: 'select',
          hasMany: true,
          options: [
            {label: 'Living Room', value:'living'}, 
            {label: 'Bed Room', value:'bed'},
            {label: 'Kitchen Room', value:'kitchen'},
            {label: 'Bath Room', value:'bath'},
          ],
        },
        {
          name: 'firmness',
          label: 'Firmness',
          type: 'select',
          hasMany: true,
          options: [
            {label: 'Hard', value:'hard'}, 
            {label: 'Medium', value:'medium'},
            {label: 'Soft', value:'soft'},
            {label: 'Super Soft', value:'superSoft'},
          ],
        },
        {
          name: 'color',
          label: 'Color',
          type: 'text',
        },
        {
          name: 'warranty',
          label: 'Warranty In Months',
          type: 'number',
        },
        
      ]
    },
    {
      name: 'dimensions',
      type: 'array',
      label: 'Specify Dimensions',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          type:'row',
          fields:[
            {
              name: 'length',
              label: 'Length',
              type: 'number',
              required: true
            },
            {
              name: 'width',
              label: 'Width',
              type: 'number',
              required: true
            },
            {
              name: 'height',
              label: 'Height',
              type: 'number',
            },
            {
              name: 'unit',
              label: 'Unit',
              type: 'select',
              hasMany:false,
              options: [{label: 'Inch', value:'inch'}],
              required: true,
              defaultValue:"inch"
            },
          ]
        },
      ],
    },
    {
      type:'row',
      fields:[
        {
          name: 'price',
          label:'Price',
          type:'relationship',
          relationTo:'productPriceList',
          hasMany:false,
          required: true,
        },
        {
          name: 'quantity',
          label: 'Quantity',
          type: 'number',
          defaultValue: -1,
          required: true,
        },
        {
          name: 'margin',
          label: 'Margin in percents on MRP (Mark down)',
          type: 'number',
          required: true,
        },
      ]
    },
    {
      name: 'isCashOnDeliveryOptionAvailable',
      label: 'Allow cash on delivery',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    
    {
      name: 'overrideCommission',
      label: 'Override commissions?',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
    {
      type:'row',
      fields:[
        {
          name: 'architect',
          label: 'Architect',
          type: 'number',
          required: true,
        },
        {
          name: 'interiorDesigner',
          label: 'Interior designer',
          type: 'number',
          required: true,
        },
        {
          name: 'karagir',
          label: 'Karagir',
          type: 'number',
          required: true,
        },
      ],
      admin:{
        condition: (_,{overrideCommission})=> Boolean(overrideCommission) || false
      }
    },
    {
      name: 'approvedForSale',
      label: 'Product Status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: ({ req }) => req.user.role === 'admin',
        read: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      options: [
        {
          label: 'Pending verification',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Denied',
          value: 'denied',
        },
      ],
    },
    // {
    //   name: 'product_offer',
    //   label: 'Product Offer',
    //   type: 'relationship',
    //   relationTo: 'product_offer',
    //   hasMany: true,
    // },
    {
      name: 'images',
      type: 'array',
      label: 'Product images',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
