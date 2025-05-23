/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User;
    products: Product;
    media: Media;
    orders: Order;
    addresses: Address;
    productPriceList: ProductPriceList;
    commissionLedger: CommissionLedger;
    withdrawalRequests: WithdrawalRequest;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  products?: (string | Product)[] | null;
  phone: number;
  role: 'admin' | 'user' | 'architect' | 'interiorDesigner' | 'karagir';
  referedBy?: (string | null) | User;
  paymentDetails?:
    | {
        label: 'UPI' | 'Bank' | 'Wallet';
        value: string;
        id?: string | null;
      }[]
    | null;
  isEligibleForReferalProgram?: boolean | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  _verified?: boolean | null;
  _verificationToken?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products".
 */
export interface Product {
  id: string;
  user?: (string | null) | User;
  name: string;
  brand?: string | null;
  description?: string | null;
  avg_rating?: number | null;
  category: 'sofa_and_seating' | 'mattresses' | 'home_decor' | 'furnishings' | 'raw_materials';
  subcategory: (
    | 'sofa'
    | 'l_shape_sofa'
    | '3_seat_sofa'
    | '2_seat_sofa'
    | '1_seat_sofa'
    | 'recliners'
    | '3_seat_recliner'
    | '2_seat_recliner'
    | '1_seat_recliner'
    | 'sofa_cum_bed'
    | 'bean_bag'
    | ''
    | 'spring_mattresses'
    | 'pocket_spring_mattress'
    | 'bonnell_spring_mattress'
    | 'foam_mattress'
    | 'memory_foam_mattress'
    | 'latex_foam_mattress'
    | 'bonded_foam_mattress'
    | 'hr_foam_mattress'
    | 'hitlon_mattress'
    | 'coir_mattress'
    | 'vases'
    | 'table_vases'
    | 'floor_vases'
    | 'table_decor'
    | 'decorative_boxes'
    | 'desk_organizers'
    | 'magazine_racks'
    | 'photo_frames'
    | 'single'
    | 'collage'
    | 'clip_photo'
    | 'candles'
    | 'decorative_candles'
    | 'scented_candles'
    | 'tea_lights_candles'
    | 'outdoor_decor'
    | 'artificial_grass'
    | 'artificial_plants'
    | 'artificial_flowers'
    | 'vertical_garden'
    | 'wall_decor'
    | 'wall_art'
    | 'wall_hangings'
    | 'wallpaper_for_wall'
    | 'wall_stickers'
    | 'bed_sheets'
    | 'king_bed_sheets'
    | 'queen_bed_sheets'
    | 'single_bed_sheets'
    | 'blankets_and_quilts'
    | 'quilts'
    | 'dohars'
    | 'blankets'
    | 'curtains'
    | 'door_curtains'
    | 'window_curtains'
    | 'blinds'
    | 'carpets'
    | '3_by_5'
    | '5_by_7'
    | '6_by_9'
    | '8_by_10'
    | '9_by_12'
    | 'cushions_and_covers'
    | 'pillow'
    | 'pillow_covers'
    | 'cushions'
    | 'cushion_cover'
    | 'bolster'
    | 'furnishings'
    | 'towels'
    | 'comforters'
    | 'door_mats'
    | 'fabric'
    | 'sofa_fabric'
    | 'curtain_fabric'
    | 'foam'
    | '50Density'
    | '40Density'
    | '30Density'
  )[];
  roomType?: ('living' | 'bed' | 'kitchen' | 'bath')[] | null;
  firmness?: ('hard' | 'medium' | 'soft' | 'superSoft')[] | null;
  color?: string | null;
  warranty?: number | null;
  dimensions?:
    | {
        length: number;
        width: number;
        height?: number | null;
        unit: 'inch';
        id?: string | null;
      }[]
    | null;
  price: string | ProductPriceList;
  quantity: number;
  margin: number;
  isCashOnDeliveryOptionAvailable: boolean;
  overrideCommission: boolean;
  architect: number;
  interiorDesigner: number;
  karagir: number;
  approvedForSale?: ('pending' | 'approved' | 'denied') | null;
  images: {
    image: string | Media;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "productPriceList".
 */
export interface ProductPriceList {
  isCustomizable?: boolean | null;
  hasStandardSizes?: boolean | null;
  roundupStandardSize?: boolean | null;
  id: string;
  mrp: number;
  unit: 'perSqFt' | 'perRunningFt' | 'perFt' | 'perMtr' | 'perSqMtr';
  discount?: number | null;
  finalPrice?: number | null;
  whatIsCustomizable?: ('height' | 'width' | 'length' | 'fabric' | 'foam')[] | null;
  fabricType?: ('sofa_fabric' | 'curtain_fabric') | null;
  fabric?: (string | null) | Product;
  maxFabricPrice?: number | null;
  minLength?: number | null;
  minWidth?: number | null;
  minHeight?: number | null;
  maxLength?: number | null;
  maxWidth?: number | null;
  maxHeight?: number | null;
  customizedSizeMrp?: string | null;
  customizedSizeUnit?: ('perSqFt' | 'perRunningFt' | 'perFt' | 'perMtr' | 'perSqMtr') | null;
  customizedSizeFinalPrice?: number | null;
  sizes?:
    | {
        length: number;
        width: number;
        height?: number | null;
        mrp: number;
        finalPrice?: number | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  user?: (string | null) | User;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    tablet?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "orders".
 */
export interface Order {
  id: string;
  _isPaid: boolean;
  orderId: string;
  user: string | User;
  address: string | Address;
  paymentMode?: ('online' | 'cashOnDelivery') | null;
  totalOrderValue: number;
  data: {
    productId: string | Product;
    orderStatus?:
      | (
          | 'received'
          | 'inProcess'
          | 'inTransit'
          | 'rejected'
          | 'confirmed'
          | 'shipped'
          | 'outForDelivery'
          | 'delivered'
          | 'cancelled'
        )
      | null;
    estimatedDeliveryDate?: string | null;
    dimensions?:
      | {
          length: number;
          width: number;
          height?: number | null;
          unit: 'inch';
          id?: string | null;
        }[]
      | null;
    price: number;
    qty?: number | null;
    fabric?: (string | null) | Product;
    foam?: string | null;
    isCustomized?: boolean | null;
    isOrderCancelled?: boolean | null;
    isMoneyRefunded?: boolean | null;
    reasonForCancellation?: string | null;
    profit?: number | null;
    commission?: number | null;
    updatedAt?: string | null;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "addresses".
 */
export interface Address {
  id: string;
  user?: (string | null) | User;
  name: string;
  contact: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pinCode: string;
  isDefaultAddress?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "commissionLedger".
 */
export interface CommissionLedger {
  id: string;
  user: string | User;
  description: string;
  credit?: number | null;
  debit?: number | null;
  balance: number;
  isCompleted: boolean;
  isCancelled?: boolean | null;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "withdrawalRequests".
 */
export interface WithdrawalRequest {
  id: string;
  user: string | User;
  comment?: string | null;
  amount: number;
  acDetails: string;
  commissionLedger: string | CommissionLedger;
  paymentMode: 'UPI' | 'Bank' | 'Wallet' | 'Cash';
  status: 'Pending' | 'Complete' | 'Rejected' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}