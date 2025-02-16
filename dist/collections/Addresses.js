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
exports.Addresses = void 0;
const isAdminOrHasAccessToAddresses = () => (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
    const user = req.user;
    if (!user)
        return false;
    if (user.role === 'admin')
        return true;
    return {
        user: {
            equals: req.user.id,
        },
    };
});
const addUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, data, }) {
    const user = req.user;
    return Object.assign(Object.assign({}, data), { user: user.id });
});
exports.Addresses = {
    slug: 'addresses',
    hooks: {
        beforeChange: [
            addUser
        ],
    },
    access: {
        read: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
            const referer = req.headers.referer;
            if (!req.user || !(referer === null || referer === void 0 ? void 0 : referer.includes('sell'))) {
                return true;
            }
            return yield isAdminOrHasAccessToAddresses()({ req });
        }),
        delete: isAdminOrHasAccessToAddresses(),
        update: isAdminOrHasAccessToAddresses(),
    },
    admin: {
        hidden: ({ user }) => user.role !== 'admin',
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            hasMany: false,
            admin: {
                condition: () => false,
            },
        },
        {
            name: 'name',
            type: 'text',
            required: true,
            hasMany: false,
        },
        {
            name: 'contact',
            type: 'number',
            required: true,
            hasMany: false,
        },
        {
            name: 'addressLine1',
            type: 'text',
            required: true,
            hasMany: false,
        },
        {
            name: 'addressLine2',
            type: 'text',
            required: false,
            hasMany: false,
        },
        {
            name: 'city',
            type: 'text',
            required: true,
            hasMany: false,
        },
        {
            name: 'state',
            type: 'text',
            required: true,
            hasMany: false,
        },
        {
            name: 'pinCode',
            type: 'text',
            required: true,
            hasMany: false,
        },
        {
            name: 'isDefaultAddress',
            type: 'checkbox',
        },
    ],
};
