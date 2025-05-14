import Razorpay from "razorpay";
import { z } from 'zod'

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const RezorpaySuccessResponseValidator = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
    orderId: z.string(),
    commisionPerProduct: z.array(z.object({
        productName: z.string(), 
        category: z.string(), 
        commissionInPercent: z.number(), 
        commision:  z.number(),
    })),
    isEligibleToRecieveCommission: z.boolean(),
    commisionGoesTo: z.string()
})

export type TRezorpaySuccessResponseValidator = z.infer<typeof RezorpaySuccessResponseValidator>