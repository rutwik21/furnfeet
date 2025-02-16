import { Product } from '@/payload-types'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware'

interface Dimensions {
  length: number,
  width: number,
  height?: number | null | undefined,
  unit: "inch",
  id?: string | null | undefined
}
export type CartItem = {
  isCustomized: boolean,
  product:Product,
  qty: number
  dimensions: Dimensions[],
  fabric?: string,
  foam?: string,
  price: number,
  totalPrice: number
}

type CartState = {
  items: CartItem[]
  addItem: (cartItem: CartItem) => void
  reduceItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (cartItem) =>
        set((state) => {
          let isProductInCart = false;
          state.items = state.items.map(i=>{
            if(i.product.id === cartItem.product.id){
              i.qty = i.qty + 1;
              i.totalPrice = i.price * i.qty;
              isProductInCart = true
            }
            return i
          })
          if(isProductInCart){
            return {items: state.items}
          }
          return { items: [...state.items, { product: cartItem.product, qty: cartItem.qty || 1,isCustomized:cartItem.isCustomized, dimensions:cartItem.dimensions, price: cartItem.price  , totalPrice: cartItem.price * cartItem.qty || 1}] }
        }),
        reduceItem: (product) =>
          set((state) => {
            let isProductInCart = false;
            state.items = state.items.map(i=>{
              if(i.product.id === product.id){
                i.qty = i.qty - 1
                i.totalPrice = i.price * i.qty;
                if(i.qty <= 0){
                  isProductInCart = true
                }
              }
              return i
            })
            if(isProductInCart){
              return {items: state.items.filter(
                (item) => item.product.id !== product.id
              )}
            }
            return { items: state.items }
          }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.product.id !== id
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
