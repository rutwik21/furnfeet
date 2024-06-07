//   import { Access, CollectionConfig } from 'payload/types'
//   import {  User , ProductOffer, Product} from '../../payload-types'
// import { AfterChangeHook, BeforeChangeHook } from 'payload/dist/collections/config/types'
// import payload from 'payload'
  
// const addUser: BeforeChangeHook<Product> = async ({
//   req,
//   data,
// }) => {
//   const user = req.user

//   return { ...data, user: user.id }
// }

//   const syncUser: AfterChangeHook<ProductOffer> = async ({
//     req,
//     doc,
//   }) => {
//     const fullUser = await req.payload.findByID({
//       collection: 'users',
//       id: req.user.id,
//     })
  
//     if (fullUser && typeof fullUser === 'object') {
//       const { product_offer } = fullUser
  
//       const allIDs = [
//         ...(product_offer?.map((productOffer) =>
//           typeof productOffer === 'object' ? productOffer.id : productOffer
//         ) || []),
//       ]
  
//       const createdProductOfferIDs = allIDs.filter(
//         (id, index) => allIDs.indexOf(id) === index
//       )
  
//       const dataToUpdate = [...createdProductOfferIDs, doc.id]
  
//       await req.payload.update({
//         collection: 'users',
//         id: fullUser.id,
//         data: {
//           product_offer: dataToUpdate,
//         },
//       })
//     }
//   }

//   const isAdminOrHasAccess = (): Access => ({ req: { user: _user } }) => {
//       const user = _user as User | undefined
  
//       if (!user) return false
//       if (user.role === 'admin') return true
  
//       const userProductOfferIDs = (user.product_offer || []).reduce< Array<string> >((acc, product_offer) => {
//         if (!product_offer) return acc
//         if (typeof product_offer === 'string') {
//           acc.push(product_offer)
//         } else {
//           acc.push(product_offer.id)
//         }
  
//         return acc
//       }, [])
//       return {
//         id: {
//           in: userProductOfferIDs,
//         },
//       }
//     }
  
//   export const ProductOffers: CollectionConfig = {
//     slug: 'product_offer',
//     admin: {
//       useAsTitle: 'name',
//     },
//     labels:{singular:'Product Offer',plural:'Product Offers'},
//     // access: {
//     //   read: isAdminOrHasAccess(),
//     //   update: isAdminOrHasAccess(),
//     //   delete: isAdminOrHasAccess(),
//     // },
//     hooks: {
//         afterChange: [syncUser],
//         beforeChange: [addUser]
//     },
//     fields: [
//     {
//         name: 'user',
//         type: 'relationship',
//         relationTo: 'users',
//         required: true,
//         hasMany: false,
//         admin: {
//         condition: () => false,
//         },
//     },
//       {
//         name: 'coupon_code',
//         label: 'Coupon Code',
//         type: 'text',
//         required: true,
//       },
//       {
//         name: 'min_order_value',
//         label: 'Min Order Value',
//         type: 'number',
//         required: true,
//       },
//       {
//         name: 'start_date',
//         type: 'date',
//         label: 'Start Date',
//         required: true,
//       },
//       {
//         name: 'end_date',
//         type: 'date',
//         label: 'End Date',
//         required: true,
//       },
//     ]
//   }
  