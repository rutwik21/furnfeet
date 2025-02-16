"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAuthCredentialsValidator = exports.AuthCredentialsValidator = void 0;
const zod_1 = require("zod");
exports.AuthCredentialsValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    phone: zod_1.z.number().or(zod_1.z.string()),
    password: zod_1.z.string().min(8, {
        message: 'Password must be at least 8 characters long.',
    }),
});
exports.LoginAuthCredentialsValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
