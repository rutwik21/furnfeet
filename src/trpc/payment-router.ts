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
import { razorpayInstance, RezorpaySuccessResponseValidator } from '../lib/razorpay'
import { Address } from '@/payload-types'

export const paymentRouter = router({
  createSession: privateProcedure
    .input( z.array(z.object({
      productId: z.string(),
      qty: z.number().int(),
      dimensions: z.array(z.object({
          length: z.number(),
          width: z.number(),
          height: z.number().nullable().optional(),
          unit: z.literal("inch"),
          id: z.string().nullable().optional(),
      })),
      price: z.number(),
      totalPrice: z.number(),
    })))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      
      if (input.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()

      const priceArray = input.map(({totalPrice}) => (totalPrice));
      let totalCartPrice:number = 10;
      priceArray.forEach((price) =>{
        totalCartPrice = totalCartPrice + Number(price)
      });

      const data = input.map((productDetails)=>{
        return {productId: productDetails.productId , qty: productDetails.qty, 
          dimensions: productDetails.dimensions, price: productDetails.totalPrice}
      })
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
          const {docs: defaultAddress} = await payload.find({
            collection: 'addresses',
            where:{
              user:{
                equals: user.id
              },
              isDefaultAddress: {
                equals: true
              }
            },
            limit: 1
          });

          await payload.create({
            collection: 'orders',
            data: {
              _isPaid: false,
              orderId: order.id,
              address: (defaultAddress as unknown as Address[] )[0].id,
              data: data,
              totalOrderValue: totalCartPrice,
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
  
  markOrderAsPaid: privateProcedure
    .input(RezorpaySuccessResponseValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      try {
        if (!input.orderId || !input.razorpay_order_id) {
          throw new TRPCError({ code: 'BAD_REQUEST' })
        }

        const payload = await getPayloadClient()
        await payload.update({
          collection: 'orders',
          data: {
            _isPaid: true,
            razorpayPaymentId: input.razorpay_payment_id
          },
          where:{
            orderId:{
              equals: input.orderId
            },
            user:{
              equals: user.id
            }
          }
        });
        return input.orderId;
      } 
      catch (error) {
        return null;
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
