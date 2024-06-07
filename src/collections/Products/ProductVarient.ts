// import { Access, CollectionConfig } from 'payload/types'
// import {  User } from '../../payload-types'

// const isAdminOrHasAccess =
//   (): Access =>
//   ({ req: { user: _user } }) => {
//     const user = _user as User | undefined

//     if (!user) return false
//     if (user.role === 'admin') return true

//     const userProductIDs = (user.products || []).reduce<
//       Array<string>
//     >((acc, product) => {
//       if (!product) return acc
//       if (typeof product === 'string') {
//         acc.push(product)
//       } else {
//         acc.push(product.id)
//       }

//       return acc
//     }, [])

//     return {
//       id: {
//         in: userProductIDs,
//       },
//     }
//   }

// export const ProductVarient: CollectionConfig = {
//   slug: 'product_varient',
//   admin: {
//     useAsTitle: 'Product Varient',
//   },
//   labels:{singular:'Product Varient',plural:'Product Varients'},
//   // access: {
//   //   read: isAdminOrHasAccess(),
//   //   update: isAdminOrHasAccess(),
//   //   delete: isAdminOrHasAccess(),
//   // },
  
//   fields: [
//   {
//       name: 'products',
//       type: 'relationship',
//       relationTo: 'products',
//       required: true,
//       hasMany: true,
//   },
//     {
//       name: 'color',
//       label: 'Color',
//       type: 'select',
//       options: [
//         { label: 'Red', value:'red' },
//         { label: 'Green', value: 'green' },
//         { label: 'Blue', value: 'blue' },
//       ],
//     },
//     {
//       name: 'size',
//       label: 'Size in Ft/In seperate with "X"',
//       type: 'text',
//       required:true
//     },
//     {
//       name: 'unit',
//       label: 'Unit',
//       type: 'select',
//       options: [
//         { label: 'Feet', value: 'ft' },
//         { label: 'Inch', value: 'in' },
//       ],
//       required:true
//     },
//   ]
// }
