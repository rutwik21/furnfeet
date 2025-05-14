'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useCart } from '@/hooks/use-cart'
import { Product } from '@/payload-types'
import { CartItem } from '@/lib/custom_interfaces'

const AddToCartButton = ({
  product,
  cartItem
}: {
  product: Product,
  cartItem: CartItem
}) => {
  const { addItem } = useCart()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isSuccess])

  return (
    <Button
      onClick={() => {
        addItem(cartItem)
        setIsSuccess(true)
      }}
      size='lg'
      className='w-full'
      disabled={product.quantity==0 || 
      (product.quantity>0 && Number(cartItem.qty) > Number(product.quantity))
    }>
      {isSuccess ? 'Added!' : 'Add to cart'}
    </Button>
  )
}

export default AddToCartButton
