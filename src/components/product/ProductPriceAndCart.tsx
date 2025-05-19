"use client"
import { Product } from '@/payload-types';
import ProductPrice from './productPrice';
import AddToCartButton from '../AddToCartButton';
import { notFound } from 'next/navigation';
import { CartItem } from '@/lib/custom_interfaces';
import { cn } from '@/lib/utils';



function ProductPriceAndCart({product}:{product:Product}){
  
  const price = typeof product.price != 'string'?product.price:null;
  if(!price) return notFound();

  let cartItem:CartItem = {
    isCustomized:false,
    dimensions:product.dimensions?product.dimensions:[],
    product: product,
    qty: 0,
    price:price.finalPrice!,
    totalPrice:price.finalPrice!
  };

  return (
    <>
      <div className='mt-2 flex items-center'>
        <div className='font-medium text-lg text-gray-900'>
          <ProductPrice product={product} cartItem={cartItem} />
        </div>
      </div>
      
      <p className='mt-4 font-semibold'>Product Details:</p>
      <div className='mt-2 flex flex-wrap gap-y-4'>
        {
          product.dimensions && product.dimensions.length>0?
          <div className='w-1/2 text-sm'>
            <p className='text-sm md:text-base font-semibold'>Dimensions:</p>
            <div>
              {product.dimensions?.map((size,i) => {
                if(product.dimensions && product.dimensions?.length > 1){
                  return <p key={i} className='text-sm md:text-base text-muted-foreground'>Size{i+1}: {`${size.length}L x ${size.width}W ${size.height?'x ' + size.height + 'H':null}`}</p>
                }
                return <p key={i} className='text-sm md:text-base text-muted-foreground'>Size: {`${size.length}L x ${size.width}W ${size.height?'x ' + size.height + 'H':null}`}</p>
              })}
            </div>
          </div>:null
        }
        {
          product.brand?
          <div className='w-1/2 text-sm'>
            <p className='text-sm md:text-base font-semibold'>Brand:</p>
            <p className='text-sm md:text-base text-muted-foreground'>{product.brand}</p>
          </div>:null
        }
        {
          product.color?
          <div className='w-1/2 text-sm'>
            <p className='text-sm md:text-base font-semibold'>Color:</p>
            <p className='text-sm md:text-base text-muted-foreground'>{product.color}</p>
          </div>:null
        }
        {
          product.firmness?
          <div className='w-1/2 text-sm'>
            <p className='text-sm md:text-base font-semibold'>Firmness:</p>
            <p className='text-sm md:text-base text-muted-foreground'>{product.firmness}</p>
          </div>:null
        }
        {
          product.roomType?
          <div className='w-1/2 text-sm'>
            <p className='text-sm md:text-base font-semibold'>Room Type:</p>
            <p className='text-sm md:text-base text-muted-foreground'>{product.roomType}</p>
          </div>:null
        }
        {
          product.warranty?
          <div className='w-1/2 text-sm'>
            <p className='text-sm md:text-base font-semibold'>Warranty (Months):</p>
            <p className='text-sm md:text-base text-muted-foreground'>{product.warranty} {product.warranty/12 >= 1?"("+Math.round(product.warranty/12)+" year)": null}</p>
          </div>:null
        }
      </div>

      <div>
        <div className={cn('mt-4 fixed bottom-4 left-4 right-4 z-10 md:static ',{'bg-white': product.quantity==0})}>
          <AddToCartButton product={product} cartItem={cartItem} />
          {product.quantity==0?
            <p className='text-red-700 text-center text-sm'>Currently out of stock</p>
          :null}
          {product.quantity>0 && Number(cartItem.qty) > Number(product.quantity)?
            <p className='text-red-700 text-center text-sm'>Available quantity is {product.quantity}</p>
          :null}
        </div>
      </div>
    </>
  )
}

export default ProductPriceAndCart
