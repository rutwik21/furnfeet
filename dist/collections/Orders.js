"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const yourOwn = ({ req: { user } }) => {
    if (user.role === 'admin')
        return true;
    return {
        user: {
            equals: user === null || user === void 0 ? void 0 : user.id,
        },
    };
};
exports.Orders = {
    slug: 'orders',
    admin: {
        useAsTitle: 'Your Orders',
        description: 'A summary of all your orders on Furnfeet.',
    },
    access: {
        read: yourOwn,
        update: ({ req }) => req.user.role === 'admin',
        delete: ({ req }) => req.user.role === 'admin',
        create: ({ req }) => req.user.role === 'admin',
    },
    fields: [
        {
            name: '_isPaid',
            type: 'checkbox',
            access: {
                read: ({ req }) => req.user.role === 'admin',
                create: () => false,
                update: () => false,
            },
            defaultValue: false,
            admin: {
                hidden: true,
            },
            required: true,
        },
        {
            name: 'orderId',
            type: 'text',
            access: {
                create: () => false,
                read: () => false,
                update: () => false,
            },
            admin: {
                hidden: true,
            },
            required: true,
        },
        {
            name: 'user',
            type: 'relationship',
            admin: {
                hidden: true,
            },
            relationTo: 'users',
            required: true,
        },
        {
            name: 'address',
            type: 'relationship',
            relationTo: 'addresses',
            required: true,
            hasMany: false,
        },
        {
            name: 'razorpayOrderId',
            type: 'text',
        },
        {
            name: 'razorpayPaymentId',
            type: 'text',
        },
        {
            name: 'status',
            type: 'text',
        },
        {
            name: 'paymentMode',
            type: 'text',
        },
        {
            name: 'totalOrderValue',
            type: 'number',
            required: true,
        },
        {
            name: 'data',
            type: 'array',
            fields: [
                {
                    name: "productId",
                    type: "relationship",
                    relationTo: "products",
                    required: true,
                    hasMany: false
                },
                {
                    name: "dimensions",
                    type: "array",
                    fields: [
                        {
                            name: "length",
                            type: "number",
                            hasMany: false,
                            required: true
                        },
                        {
                            name: "width",
                            type: "number",
                            hasMany: false,
                            required: true
                        },
                        {
                            name: "height",
                            type: "number",
                            hasMany: false,
                            required: false
                        },
                        {
                            name: "unit",
                            type: 'select',
                            options: [{ label: 'Inch', value: 'inch' }],
                            hasMany: false,
                            required: true
                        },
                    ]
                },
                {
                    name: "qty",
                    type: "number",
                    hasMany: false,
                    defaultValue: 1
                },
                {
                    name: "price",
                    type: "number",
                    hasMany: false,
                    required: true
                },
            ],
            required: true,
        },
    ],
};
