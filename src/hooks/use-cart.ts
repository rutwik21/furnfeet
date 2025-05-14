import { CartItem } from '@/lib/custom_interfaces'
import { Product } from '@/payload-types'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware'

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
              if(!(i.product.quantity>0 && Number(i.qty + 1) > Number(i.product.quantity))){
                i.qty = i.qty + 1;
              }
              i.totalPrice = i.price * i.qty;
              isProductInCart = true
            }
            return i
          })
          if(isProductInCart){
            return {items: state.items}
          }
          return { items: [...state.items, { 
            product: cartItem.product, 
            qty: (cartItem.product.quantity > 0 && cartItem.qty > cartItem.product.quantity)? 
                cartItem.product.quantity :cartItem.qty || 1,
            isCustomized:cartItem.isCustomized, 
            dimensions:cartItem.dimensions,
            fabric: cartItem.fabric,
            fabricName: cartItem.fabricName,
            foam: cartItem.foam,
            price: cartItem.price  , 
            totalPrice: cartItem.price * ((cartItem.product.quantity > 0 && cartItem.qty > cartItem.product.quantity)? 
                cartItem.product.quantity :cartItem.qty || 1)
          }] }
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
