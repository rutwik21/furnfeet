"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("payload/config");
const bundler_webpack_1 = require("@payloadcms/bundler-webpack");
const db_mongodb_1 = require("@payloadcms/db-mongodb");
const richtext_slate_1 = require("@payloadcms/richtext-slate");
const path_1 = __importDefault(require("path"));
const Users_1 = require("./collections/Users");
const dotenv_1 = __importDefault(require("dotenv"));
const Products_1 = require("./collections/Products/Products");
const Media_1 = require("./collections/Media");
const Orders_1 = require("./collections/Orders");
const plugin_cloud_storage_1 = require("@payloadcms/plugin-cloud-storage");
const s3_1 = require("@payloadcms/plugin-cloud-storage/s3");
const Addresses_1 = require("./collections/Addresses");
const ProductPriceList_1 = require("./collections/Products/ProductPriceList");
// import { ProductOffers } from './collections/Products/ProductOffer'
// import { ProductVarient } from './collections/Products/ProductVarient'
// import { ProductReview } from './collections/Products/ProductReview'
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../.env'),
});
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    collections: [Users_1.Users, Products_1.Products, Media_1.Media, Orders_1.Orders, Addresses_1.Addresses, ProductPriceList_1.ProductPriceList],
    routes: {
        admin: '/sell',
    },
    admin: {
        user: 'users',
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: '- FurnFeet',
            favicon: '/favicon.ico',
            ogImage: '/thumbnail.jpg',
        },
    },
    rateLimit: {
        max: 2000,
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URL,
    }),
    typescript: {
        outputFile: path_1.default.resolve(__dirname, 'payload-types.ts'),
    },
    plugins: [
        // Pass the plugin to Payload
        (0, plugin_cloud_storage_1.cloudStorage)({
            collections: {
                // Enable cloud storage for Media collection
                media: {
                    // Create the S3 adapter
                    adapter: (0, s3_1.s3Adapter)({
                        config: {
                            endpoint: process.env.S3_ENDPOINT,
                            region: process.env.S3_REGION,
                            credentials: {
                                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                            },
                        },
                        bucket: process.env.S3_BUCKET,
                    }),
                },
            },
        }),
    ],
});
