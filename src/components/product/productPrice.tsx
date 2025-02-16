"use client"

import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/utils';
import { Product } from '@/payload-types';
import CustomizeProduct from './customizeProduct';
import { CartItem } from '@/hooks/use-cart';



function ProductPrice({product, cartItem}:{product:Product, cartItem: CartItem}) {

    const price = typeof product.price != "string"?product.price:null
    
    const finalPrice = price?.finalPrice!;
    const mrp= price?.mrp!;

    const [finalRate, setFinalRate] = useState("");
    const [finalMrp, setFinalMrp] = useState("");
    const [discount, setDiscount] = useState("");
    const [cartItemState, setCartItemState] = useState<CartItem>(cartItem);

    useEffect(()=>{
        if(finalRate === ""){
            finalPrice?setFinalRate(formatPrice(finalPrice)):null;
    
            mrp?setFinalMrp(formatPrice(mrp)):null;
            setDiscount("(" + price?.discount +"% OFF)") ;
            
        }
        
    },[finalRate,finalMrp]);
    
    

    return (
        <div className='w-full'>
            <span className='w-full'>{finalRate}
                {finalMrp?
                    <span className='ms-1 md:ms-2 text-sm text-muted-foreground'>MRP <span className='line-through'>{finalMrp}</span></span>
                : null}
                {finalMrp?
                    <span className='text-sm md:text-base text-green-600'> {discount}</span>
                : null}
            </span>
            
            {price?.isCustomizable? 
                <div className='mt-2 w-full'>
                    <CustomizeProduct product={product} setFinalPrice={setFinalRate} 
                    setMrp={setFinalMrp} setCartItemState={setCartItemState} cartItem={cartItem}/>
                </div>
            :null}
        </div>
    )
}

export default ProductPrice
