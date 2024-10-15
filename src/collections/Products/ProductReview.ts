// import {
//     AfterChangeHook,
//     BeforeChangeHook,
//   } from 'payload/dist/collections/config/types'
//   import { PRODUCT_CATEGORIES, PRODUCT_SUB_CATEGORIES } from '../../config'
//   import { Access, CollectionConfig } from 'payload/types'
//   import { Product, User } from '../../payload-types'
  
//   const addUser: BeforeChangeHook<Product> = async ({
//     req,
//     data,
//   }) => {
//     const user = req.user
  
//     return { ...data, user: user.id }
//   }
  
//   export const ProductReview: CollectionConfig = {
//     slug: 'product_review',
//     admin: {
//       useAsTitle: 'name',
//       hidden:true
//     },
//     labels:{singular:'Product Review',plural:'Product Reviews'},
//     access: {
//       update: ({req})=>req.user.role==='admin',
//       delete: ({req})=>req.user.role==='admin'
//     },
//     hooks:{
//         beforeChange: [addUser],
//     },
//     fields: [
//         {
//             name: 'user',
//             type: 'relationship',
//             relationTo: 'users',
//             required: true,
//             hasMany: false,
//             admin: {
//                 condition: () => false,
//             },
//         },
//         {
//             name: 'products',
//             type: 'relationship',
//             relationTo: 'products',
//             required: true,
//             hasMany: false,
//             admin: {
//                 condition: () => false,
//             },
//         },
//         {
//             name: 'rating',
//             label: 'Rating',
//             type: 'number',
//             required:true
//         },
//         {
//             name: 'rewiew',
//             label: 'Rewiew',
//             type: 'text',
//         },
//     ]
//   }
  