import { buildConfig } from 'payload/config'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import { Users } from './collections/Users'
import dotenv from 'dotenv'
import { Products } from './collections/Products/Products'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { Addresses } from './collections/Addresses'
import { ProductPriceList } from './collections/Products/ProductPriceList'
import { CommissionLedger } from './collections/CommissionLedger'
import { WithdrawalRequests } from './collections/WithdrawalRequests'
// import { ProductOffers } from './collections/Products/ProductOffer'
// import { ProductVarient } from './collections/Products/ProductVarient'
// import { ProductReview } from './collections/Products/ProductReview'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  collections: [Users, Products, Media, Orders, Addresses, ProductPriceList, CommissionLedger, WithdrawalRequests],
  routes: {
    admin: '/sell',
  },
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- FurnFeet',
      favicon: '/favicon.ico',
      ogImage: '/thumbnail.jpg',
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [
    // Pass the plugin to Payload
    cloudStorage({
      collections: {
        // Enable cloud storage for Media collection
        media: {
          // Create the S3 adapter
          adapter: s3Adapter({
            config: {
              endpoint: process.env.S3_ENDPOINT as string,
              region: process.env.S3_REGION as string,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
              },
            },
            bucket: process.env.S3_BUCKET as string,
          }),
        },
      },
    }),
  ],
})
