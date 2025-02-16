"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("./trpc");
const server_1 = require("@trpc/server");
const get_payload_1 = require("../get-payload");
// import { stripe } from '../lib/stripe'
// import type Stripe from 'stripe'
const razorpay_1 = require("../lib/razorpay");
exports.paymentRouter = (0, trpc_1.router)({
    createSession: trpc_1.privateProcedure
        .input(zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string(),
        qty: zod_1.z.number().int(),
        dimensions: zod_1.z.array(zod_1.z.object({
            length: zod_1.z.number(),
            width: zod_1.z.number(),
            height: zod_1.z.number().nullable().optional(),
            unit: zod_1.z.literal("inch"),
            id: zod_1.z.string().nullable().optional(),
        })),
        price: zod_1.z.number(),
        totalPrice: zod_1.z.number(),
    })))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const { user } = ctx;
        if (input.length === 0) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST' });
        }
        const payload = yield (0, get_payload_1.getPayloadClient)();
        const priceArray = input.map(({ totalPrice }) => (totalPrice));
        let totalCartPrice = 10;
        priceArray.forEach((price) => {
            totalCartPrice = totalCartPrice + Number(price);
        });
        const data = input.map((productDetails) => {
            return { productId: productDetails.productId, qty: productDetails.qty,
                dimensions: productDetails.dimensions, price: productDetails.totalPrice };
        });
        try {
            const options = {
                amount: totalCartPrice + '00', // amount in the smallest currency unit
                currency: "INR"
            };
            let orderId1 = '';
            razorpay_1.razorpayInstance.orders.create(options, (err, order) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    throw new server_1.TRPCError({ code: 'BAD_REQUEST' });
                }
                const { docs: defaultAddress } = yield payload.find({
                    collection: 'addresses',
                    where: {
                        user: {
                            equals: user.id
                        },
                        isDefaultAddress: {
                            equals: true
                        }
                    },
                    limit: 1
                });
                yield payload.create({
                    collection: 'orders',
                    data: {
                        _isPaid: false,
                        orderId: order.id,
                        address: defaultAddress[0].id,
                        data: data,
                        totalOrderValue: totalCartPrice,
                        user: user.id,
                    },
                });
                orderId1 = order.id;
            }));
            while (!orderId1) {
                yield new Promise((resolve) => setTimeout(resolve, 500));
            }
            return { key_id: process.env.RAZORPAY_KEY_ID, orderId: orderId1 };
        }
        catch (err) {
            return { key_id: null, orderId: null };
        }
    })),
    markOrderAsPaid: trpc_1.privateProcedure
        .input(razorpay_1.RezorpaySuccessResponseValidator)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const { user } = ctx;
        try {
            if (!input.orderId || !input.razorpay_order_id) {
                throw new server_1.TRPCError({ code: 'BAD_REQUEST' });
            }
            const payload = yield (0, get_payload_1.getPayloadClient)();
            yield payload.update({
                collection: 'orders',
                data: {
                    _isPaid: true,
                    razorpayPaymentId: input.razorpay_payment_id
                },
                where: {
                    orderId: {
                        equals: input.orderId
                    },
                    user: {
                        equals: user.id
                    }
                }
            });
            return input.orderId;
        }
        catch (error) {
            return null;
        }
    })),
    pollOrderStatus: trpc_1.privateProcedure
        .input(zod_1.z.object({ orderId: zod_1.z.string() }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { orderId } = input;
        const payload = yield (0, get_payload_1.getPayloadClient)();
        const { docs: orders } = yield payload.find({
            collection: 'orders',
            where: {
                id: {
                    equals: orderId,
                },
            },
        });
        if (!orders.length) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        }
        const [order] = orders;
        return { isPaid: order._isPaid };
    })),
});
