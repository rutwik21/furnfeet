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
exports.productRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("./trpc");
const server_1 = require("@trpc/server");
const get_payload_1 = require("../get-payload");
exports.productRouter = (0, trpc_1.router)({
    fabricOptions: trpc_1.publicProcedure
        .input(zod_1.z.object({
        maxRate: zod_1.z.number().min(1),
        clothCategory: zod_1.z.string()
    }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { maxRate, clothCategory } = input;
        try {
            const payload = yield (0, get_payload_1.getPayloadClient)();
            const { docs: products } = yield payload.find({
                collection: 'products',
                depth: 2,
                where: {
                    category: {
                        equals: 'raw_materials',
                    },
                    subcategory: {
                        contains: clothCategory
                    },
                    'price.finalPrice': {
                        less_than_equal: maxRate
                    },
                    approvedForSale: {
                        equals: 'approved'
                    }
                },
            });
            return products;
        }
        catch (err) {
            console.log(err);
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        }
    })),
});
