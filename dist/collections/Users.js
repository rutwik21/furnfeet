"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const PrimaryActionEmail_1 = require("../components/emails/PrimaryActionEmail");
const adminsAndUser = ({ req: { user } }) => {
    if (user.role === 'admin')
        return true;
    return {
        id: {
            equals: user.id,
        },
    };
};
exports.Users = {
    slug: 'users',
    auth: {
        verify: {
            generateEmailHTML: ({ token }) => {
                return (0, PrimaryActionEmail_1.PrimaryActionEmailHtml)({
                    actionLabel: "verify your account",
                    buttonText: "Verify Account",
                    href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
                });
            },
        },
    },
    access: {
        read: adminsAndUser,
        create: () => true,
        update: ({ req }) => req.user.role === 'admin',
        delete: ({ req }) => req.user.role === 'admin',
    },
    admin: {
        hidden: ({ user }) => user.role !== 'admin',
        defaultColumns: ['id'],
    },
    fields: [
        {
            name: 'products',
            label: 'Products',
            admin: {
                condition: () => false,
            },
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
        },
        // {
        //   name: 'product_offer',
        //   label: 'Product Offer',
        //   admin: {
        //     condition: () => false,
        //   },
        //   type: 'relationship',
        //   relationTo: 'product_offer',
        //   hasMany: true,
        // },
        {
            name: 'phone',
            label: 'Phone',
            type: 'number',
            hasMany: false,
            required: true,
        },
        {
            name: 'role',
            defaultValue: 'user',
            required: true,
            type: 'select',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
                { label: 'Architect', value: 'architect' },
                { label: 'Interior Designer', value: 'interiorDesigner' },
                { label: 'Karagir', value: 'karagir' },
            ],
        },
        {
            name: 'referedBy',
            label: 'Refered By',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
        },
    ],
};
