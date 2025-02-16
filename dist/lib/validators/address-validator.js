"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddressValidator = exports.NewAddressValidator = void 0;
const zod_1 = require("zod");
exports.NewAddressValidator = zod_1.z.object({
    name: zod_1.z.string(),
    contact: zod_1.z.number().or(zod_1.z.string()),
    addressLine1: zod_1.z.string(),
    addressLine2: zod_1.z.string().nullable(),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
    pinCode: zod_1.z.string(),
});
exports.UpdateAddressValidator = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    contact: zod_1.z.number().or(zod_1.z.string()),
    addressLine1: zod_1.z.string(),
    addressLine2: zod_1.z.string().nullable(),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
    pinCode: zod_1.z.string(),
    isDefaultAddress: zod_1.z.boolean(),
});
