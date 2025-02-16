import { z } from 'zod'
import {
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { Product } from '@/payload-types'


export const productRouter = router({

    fabricOptions: publicProcedure
    .input(
          z.object({
            maxRate: z.number().min(1),
            clothCategory: z.string()
          })
        )
    .mutation(async ({ input }) => {
      const { maxRate,clothCategory } = input;
      try {
        const payload = await getPayloadClient();
        
        const { docs: products } = await payload.find({
            collection: 'products',
            depth: 2,
            where: {
                category: {
                    equals: 'raw_materials',
                },
                subcategory:{
                    contains: clothCategory
                },
                'price.finalPrice':{
                  less_than_equal: maxRate
                },
                approvedForSale:{
                  equals: 'approved'
                }
                
            },
        });
        return products as unknown as Product[];

      } catch (err) {
        console.log(err);
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
    }),

})
