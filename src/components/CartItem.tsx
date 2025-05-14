import { PRODUCT_CATEGORIES } from '@/config'
import { useCart } from '@/hooks/use-cart'
import { CartItem as CartItemm} from '@/lib/custom_interfaces'
import { formatPrice } from '@/lib/utils'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

const CartItem = ({ cartItem }: {cartItem:CartItemm }) => {
  const { image } = cartItem.product.images[0]

  const { removeItem, addItem, reduceItem } = useCart()

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === cartItem.product.category
  )?.label

  return (
    <div className='space-y-3 py-2'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center space-x-4'>
          <div className='relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded'>
            {typeof image !== 'string' && image.url ? (
              <Image
                src={image.url}
                alt={cartItem.product.name}
                fill
                className='absolute object-cover'
              />
            ) : (
              <div className='flex h-full items-center justify-center bg-secondary'>
                <ImageIcon
                  aria-hidden='true'
                  className='h-4 w-4 text-muted-foreground'
                />
              </div>
            )}
          </div>

          <div className='flex flex-col self-start'>
            <span className='line-clamp-1 text-sm font-medium mb-1'>
              {cartItem.product.name}
            </span>

            <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
              {label}
            </span>

            <div className='mt-4 text-xs text-muted-foreground'>
              <button
                onClick={() => removeItem(cartItem.product.id)}
                className='flex items-center gap-0.5'>
                <X className='w-3 h-4' />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-col space-y-1 font-medium'>
          <span className='ml-auto line-clamp-1 text-sm'>
            {
              typeof cartItem.price != 'string'?
              formatPrice(cartItem.price! * cartItem.qty)
              :null
            }
          </span>
          <p className='flex gap-2 font-extralight ml-auto line-clamp-1 text-xs capitalize text-muted-foreground'>
            {
              typeof cartItem.price != 'string'?
              formatPrice(cartItem.price!)
              :null
            } X {cartItem.qty}
          </p>
          <div className='flex gap-2 ml-auto bg-gray-50 px-2 rounded-sm line-clamp-1 text-sm'>
              <button
                onClick={() => reduceItem(cartItem.product)}
                className='flex items-center gap-0.5'>
                -
              </button>
              <p>{cartItem.qty}</p>
              <button
                onClick={() => addItem(cartItem)}
                className='flex items-center gap-0.5'>
                +
              </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
