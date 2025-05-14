import { z } from 'zod'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { Order, Product } from '@/payload-types'
import { updateProductQty } from './payment-router'
import { ProductsWithNewQty } from '@/lib/custom_interfaces'

const getDate=(which="today")=>{
  const currentDate = new Date();
  const date = new Date(currentDate);
  if(which=="deliveryDate"){
    date.setDate(currentDate.getDate() + 6);
    return date;
  }else{
    date.setDate(currentDate.getDate());
    return date;
  }
}

export const orderRouter = router({

    cancelOrder: privateProcedure
    .input(
      z.object({
        productId: z.string(),
        orderId: z.string(),
        reason: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      const { productId, orderId, reason } = input;
      try {
        const payload = await getPayloadClient();
        
        const {docs: orders} = await payload.find({
          collection: 'orders',
          depth:2,
          where:{
            id:{
              equals: orderId
            },
            user:{
              equals: user.id
            }
          }
        });

        const [order] = orders as unknown as Order[];

        if(!order) return new TRPCError({ code: 'NOT_FOUND' })

        const productsWithNewQty: ProductsWithNewQty[] = [];
        const dataToUpdate = order.data.map(item=>{
          if(typeof item.productId !='string' && item.productId.id === productId){
            const newQty = item.productId.quantity<0? -1 : item.productId.quantity + (item.qty || 0);
            productsWithNewQty.push({productId: productId, newQty: newQty});
          }
          if ((typeof item.productId =='string'?item.productId:item.productId.id) === productId) {
            item.estimatedDeliveryDate = null;
            item.updatedAt = getDate("today").toString(),
            item.orderStatus = 'cancelled';
            item.isOrderCancelled = true;
            item.reasonForCancellation = reason;
          }
          item.productId = (typeof item.productId =='string'?item.productId:item.productId.id)
          return item;
        });
        console.log(productsWithNewQty)
        updateProductQty(payload, order.data, productsWithNewQty);

        const result = await payload.update({
          collection: 'orders',
          data: {
           data: dataToUpdate 
          },
          where:{
            id:{
              equals: orderId
            },
            user:{
              equals: user.id
            }
          }
        });

        return { success: true }
        
      } catch (err) {
        console.log(err);
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
    }),

})
