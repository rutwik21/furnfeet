import { z } from 'zod'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { CommissionLedger, Order, Product } from '@/payload-types'
import { createCommissionEntry, getLastEntryFromCommissionLedger, updateProductQty } from './payment-router'
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

export const commissionRouter = router({

    requestWithdrawal: privateProcedure
    .input(
      z.object({
        amount: z.number(),
        paymentMode: z.enum(['UPI','Wallet','Bank','Cash']),
        acDetails: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      const { amount, paymentMode, acDetails } = input;
      
      try {
        const payload = await getPayloadClient();

        const lastEntry = await getLastEntryFromCommissionLedger(payload, user.id);
        
        const newBalance = (lastEntry[0]?.balance || 0) - amount;
        
        const commissionLedgerEntry =  await createCommissionEntry(payload, "Withdrawal request", 0, amount, newBalance, user.id);

        await payload.create({
          collection: 'withdrawalRequests',
          data:{
            user: user.id,
            amount: amount,
            paymentMode: paymentMode,
            acDetails: acDetails,
            comment: "",
            status: "Pending",
            commissionLedger: (commissionLedgerEntry as unknown as CommissionLedger).id
          }
        });
        
        return { success: true }
        
      } catch (err) {
        console.log(err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }),

})
