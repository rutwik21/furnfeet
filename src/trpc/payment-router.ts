import { z } from 'zod'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
// import { stripe } from '../lib/stripe'
// import type Stripe from 'stripe'
import { razorpayInstance } from '../lib/razorpay'

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      let { productIds } = input

      if (productIds.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()

      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          id: {
            in: productIds,
          },
        },
      })

      const filteredProducts = products.filter((prod) =>
        Boolean(prod.price)
      )

      const priceArray = filteredProducts.map((prod) => prod.price);
      let totalCartPrice:number = 0;
      priceArray.forEach((price) =>{
        totalCartPrice = totalCartPrice + Number(price)
      });

      try {
        const options = {
          amount: totalCartPrice + '00',  // amount in the smallest currency unit
          currency: "INR"
        };
        let orderId1: string = '';
        razorpayInstance.orders.create(options, async (err, order) => {
          if(err){
            throw new TRPCError({ code: 'BAD_REQUEST' })
          }
          await payload.create({
            collection: 'orders',
            data: {
              _isPaid: false,
              orderId: order.id,
              products: filteredProducts.map((prod) => prod.id) as string[],
              user: user.id,
            },
          })
          orderId1 = order.id;
        });
        while(!orderId1){
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        return { key_id : process.env.RAZORPAY_KEY_ID!, orderId : orderId1! }

      } catch (err) {
        return { key_id : null, orderId : null };
      }
    }),

  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input

      const payload = await getPayloadClient()

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: orderId,
          },
        },
      })

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const [order] = orders

      return { isPaid: order._isPaid }
    }),
})
