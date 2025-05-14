import { Product } from "../payload-types";
interface Dimensions {
  length: number,
  width: number,
  height?: number | null | undefined,
  unit: "inch",
  id?: string | null | undefined
}
export interface CartItem {
  isCustomized: boolean,
  product:Product,
  qty: number
  dimensions: Dimensions[],
  fabric?: string,
  fabricName?: string,
  foam?: string,
  price: number,
  totalPrice: number
}
export interface OrderItem {
  productId: string | Product;
  dimensions?:
    | Dimensions[]
    | null;
  qty?: number | null;
  price: number;
  isCustomized?: boolean | null;
  fabric?: (string | null) | Product;
  foam?: string | null;
  profit?: number | null;
  commission?: number | null;
  isOrderCancelled?: boolean | null;
  reasonForCancellation?: string | null;
  isMoneyRefunded?: boolean | null;
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
  updatedAt?: string | null;
  id?: string | null;
}

export interface ProductsWithNewQty {
  productId:string, 
  newQty:number
}