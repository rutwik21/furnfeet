'use client'

import ConfirmAddress from '@/components/ConfirmAddress'
import ConfirmPaymentMethod from '@/components/ConfirmPaymentMethod'
import { Button } from '@/components/ui/button'
import { ADDED_CHARGES, PRODUCT_CATEGORIES, RAZORPAY_KEY_ID } from '@/config'
import { useCart } from '@/hooks/use-cart'
import { TRezorpaySuccessResponseValidator } from '@/lib/razorpay'
import { cn, formatPrice } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { Check, Loader2, X, ShoppingCart, MapPin, Wallet } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Page = () => {
  const { items, removeItem, reduceItem, addItem, clearCart } = useCart()
  const [ confirmAddress, setConfirmAddress ] = useState(false);
  const [addressConfirmed, setaddressConfirmed] = useState(false);
  let [paymentMethod, setPaymentMethod] = useState<'cashOnDelivery' | 'online' >();
  const router = useRouter()

  const handleAddressConfirmation = (data: boolean)=>{
    setaddressConfirmed(data);
  }
  const handlePaymentMethod = (data: 'cashOnDelivery' | 'online' ):'cashOnDelivery' | 'online'=>{
    paymentMethod = data;
    setPaymentMethod(data);
    if(!paymentMethod) {
      setPaymentMethod('online');
      return 'online'
    };
    return paymentMethod;
  }

  const {mutate: markOrderAsPaid}=
  trpc.payment.markOrderAsPaid.useMutation({
    onError:(err)=>{
      console.log(err);
      toast.error("Something went wrong! Please reach out to us if you faced some issue while payment");
    },
    onSuccess:(orderId)=>{
      if(orderId){
        clearCart();
        router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`)
      }else{
        toast.error("Something went wrong! Please reach out to us if you faced some issue while payment");
      }
    }
  });
  const { mutate: deleteOrder } = trpc.payment.deleteOrder.useMutation({
    onError:(err)=>{
      console.log(err);
      toast.error("Something went wrong! Please reach out to us if you faced some issue while payment");
    },
    onSuccess:(order)=>{

    }
  });

  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ success, orderId, key_id, commisionPerProduct,commisionGoesTo, isEligibleToRecieveCommission, errors }) => {
        if (orderId && key_id) {
          const options = {
            "key" : key_id,
            "order_id" : orderId, 
            "name": "furnfeet",
            "description": "Test Transaction",
            "handler": function (response: TRezorpaySuccessResponseValidator){
              response.orderId = orderId;
              response.commisionPerProduct = commisionPerProduct;
              response.commisionGoesTo = commisionGoesTo;
              response.isEligibleToRecieveCommission = isEligibleToRecieveCommission || false;
              markOrderAsPaid(response);
            },
            "image": `https://furnfeettest.s3.eu-north-1.amazonaws.com/ff_logo.png`,
            "theme": {
                "color": "#f97316"
            },
            "modal":{
              ondismiss: function() {
                deleteOrder({orderId: orderId});
              }
            }
          };
          const rzp1 =new (window as any).Razorpay(options);
          rzp1.open();
          rzp1.on("payment.failed", function(response: any) {
            deleteOrder({orderId: orderId});
            toast.error(response.error.reason);
          })
        }
        else if(errors.length>0){
          errors.forEach(err=>{
            toast.error(err);
          })
        }
        else{
          toast.error('something went wrong');
        }
      },
    });
  
  const { mutate: createOrder, isLoading: isLoadingCreateOrder } =
    trpc.payment.createOrder.useMutation({
      onSuccess: ({ errors, success, orderId }) => {
        if (success) {
          clearCart();
          router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`)
        }
        else if(errors.length>0){
          errors.forEach(err=>{
            toast.error(err);
          })
        }
        else{
          toast.error('something went wrong');
        }
      },
    })

  const products = items.map(({ product, qty, dimensions, price, totalPrice }) => {
   return {productId: product.id, qty: qty, dimensions: dimensions, price: price, totalPrice: price*qty }
  })

  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, []);

  let isThisOrderContainsCustomizedProduct = false;
  let isThisOrderContainsProductWithCODDisabled = false;

  const cartTotal = items.reduce(
    (total, { price, qty, isCustomized, product }) => {

      if(isCustomized) isThisOrderContainsCustomizedProduct = true;
      if(product.isCashOnDeliveryOptionAvailable !=undefined && !product.isCashOnDeliveryOptionAvailable){
         isThisOrderContainsProductWithCODDisabled = true;
      }
      const finalPrice = typeof price != 'string'?price!:null
      if(finalPrice){
        return total + (finalPrice * qty)
      }
      return 0
    },
    0
  )
  const PRODUCT_CHECKOUT_STEPS = [
    {title:"Shopping cart", description: "Review products and prices", icon: "ShoppingCart"}, 
    {title:"Address", description: "Select an address", icon: "MapPin"}, 
    {title:"Payment", description: "Choose payment method", icon: "Wallet"}
  ];
  const [currentStep, setCurrentStep] = useState<number>(0);
  const fee = ADDED_CHARGES.reduce((sum, charge) => sum + charge.value, 0);

  return (
    <div className='bg-white'>
        <script src="https://checkout.razorpay.com/v1/checkout.js" defer></script>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        <div className='grid  grid-flow-col'>
          {
            PRODUCT_CHECKOUT_STEPS.map(({title, description, icon},i)=>{
              return <div key={title} 
                  onClick={()=>{currentStep>=i?setCurrentStep(i):null}}
                  className={cn("flex gap-3 relative px-4 py-4 cursor-pointer border-t border-b-4",
                  {
                    'border-b-black':i==currentStep,
                    'border-b-gray-400 hidden lg:flex':i!=currentStep,
                    'border-b-green-500 hidden lg:flex':i<currentStep,
                    'lg:border-s':i===0,
                    'lg:border-e':i===2,
                  })}>
                    {
                      icon==="ShoppingCart"?<ShoppingCart className='w-10 h-10'/>:
                      icon==="MapPin"?<MapPin className='w-10 h-10'/>:
                      icon==="Wallet"?<Wallet className='w-10 h-10'/>:null
                    }
                    <div>
                      <p className='text-sm font-semibold'>Step {i+1}. {title}</p>
                      <p className='text-sm text-muted-foreground'>{description}</p>
                    </div>
                    {
                      i!=0?
                      <div className='absolute inset-0 hidden w-3 lg:block'>
                        <svg
                          className='h-full w-full text-gray-300'
                          viewBox='0 0 12 82'
                          fill='none'
                          preserveAspectRatio='none'>
                          <path
                            d='M0.5 0V31L10.5 41L0.5 51V82'
                            stroke='currentcolor'
                            vectorEffect='non-scaling-stroke'
                          />
                        </svg>
                      </div>
                      :null
                    }
                </div>
            })
          }

        </div>

        <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>

          <div
            className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12':
                isMounted && items.length === 0,
            },{"hidden": currentStep!=0})}>
            <h2 className='sr-only'>
              Items in your shopping cart
            </h2>

            {isMounted && items.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-y-1'>
                <div
                  aria-hidden='true'
                  className='relative mb-4 h-40 w-40 text-muted-foreground'>
                  <Image
                    src='/emptyCart.png'
                    fill
                    loading='eager'
                    alt='empty shopping cart hippo'
                  />
                </div>
                <h3 className='font-semibold text-2xl'>
                  Your cart is empty
                </h3>
                <p className='text-muted-foreground text-center'>
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                'divide-y divide-gray-200 border-b border-t border-gray-200':
                  isMounted && items.length > 0,
              })}>
              {isMounted &&
                items.map((cartItem) => {
                  const label = PRODUCT_CATEGORIES.find(
                    (c) => c.value === cartItem.product.category
                  )?.label

                  const { image } = cartItem.product.images[0]
                  console.log(cartItem)
                  return (
                    <li
                      key={cartItem.product.id}
                      className='flex py-6 sm:py-10'>
                      <div className='flex-shrink-0'>
                        <div className='relative h-24 w-24'>
                          {typeof image !== 'string' &&
                          image.url ? (
                            <Image
                              fill
                              src={image.url}
                              alt='product image'
                              className='h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48'
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
                        <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                          <div>
                            <div className='flex justify-between'>
                              <h3 className='text-sm'>
                                <Link
                                  href={`/product/${cartItem.product.id}`}
                                  className='font-medium text-gray-700 hover:text-gray-800'>
                                  {cartItem.product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className='mt-1 flex text-xs'>
                              <p className='text-muted-foreground'>
                                Category: {label}
                              </p>
                            </div>

                            {
                            cartItem.dimensions && cartItem.dimensions.length>0?
                              <div className="mt-1 flex gap-1">
                                <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
                                Size:
                                </span>
                                <ul>
                                  {
                                    cartItem.dimensions?.map((size, i)=>{
                                      return <li key={i} className='line-clamp-1 text-xs capitalize text-muted-foreground'>{size.length}L x {size.width}W x {size.height}H</li>
                                    })
                                  }
                                </ul>
                              </div>
                            :null}
                            {
                            cartItem.fabric?
                            <div className='mt-1 flex text-xs'>
                              <p className='text-muted-foreground'>
                                Fabric: {cartItem.fabricName}
                              </p>
                            </div>
                            :null}
                            {
                            cartItem.foam?
                            <div className='mt-1 flex text-xs'>
                              <p className='text-muted-foreground'>
                                Foam: {cartItem.foam}
                              </p>
                            </div>
                            :null}
                           

                            <div className='mt-1 gap-2 flex text-xs'>
                              <p className='text-muted-foreground'>
                                Qty: 
                              </p>
                                <div className='flex gap-2 px-2 bg-gray-50 rounded-sm  text-sm'>
                                  <button
                                    onClick={() => reduceItem(cartItem.product)}
                                    className='flex self-center'>
                                    -
                                  </button>
                                  <p>{cartItem.qty}</p>
                                  <button
                                    onClick={() => addItem(cartItem)}
                                    className='flex self-center'>
                                    +
                                  </button>
                                </div>
                            </div>
                            

                            <p className='mt-1 text-sm font-medium text-gray-900'>
                            {
                              typeof cartItem.price != 'string'?
                              formatPrice(cartItem.price! * cartItem.qty)
                              :null
                            }
                            </p>
                          </div>

                          <div className='mt-4 sm:mt-0 sm:pr-9 w-20'>
                            <div className='absolute right-0 top-0'>
                              <Button
                                aria-label='remove product'
                                onClick={() =>
                                  removeItem(cartItem.product.id)
                                }
                                variant='ghost'>
                                <X
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
            </ul>
          </div>

          <div
            className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12':
                isMounted && items.length === 0,
            },{"hidden": currentStep!=1})}>
              <ConfirmAddress handleAddressConfirmation={handleAddressConfirmation} />
          </div>
          <div
            className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12':
                isMounted && items.length === 0,
            },{"hidden": currentStep!=2})}>
              <ConfirmPaymentMethod handlePaymentMethod={handlePaymentMethod} 
              enableCashOnDelivery={!isThisOrderContainsCustomizedProduct && !isThisOrderContainsProductWithCODDisabled} />
          </div>

          <section className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
            <h2 className='text-lg font-medium text-gray-900'>
              Order summary
            </h2>

            <div className='mt-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>
                  Subtotal
                </p>
                <p className='text-sm font-medium text-gray-900'>
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                  )}
                </p>
              </div>

              {
                ADDED_CHARGES.map(ele=>{
                  return <div key={ele.label} className='flex items-center justify-between border-t border-gray-200 pt-4'>
                            <div className='flex items-center text-sm text-muted-foreground'>
                              <span>{ele.label}</span>
                            </div>
                            <div className='text-sm font-medium text-gray-900'>
                              {isMounted ? (
                                formatPrice(ele.value)
                              ) : (
                                <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                              )}
                            </div>
                          </div>
                })
              }
                            

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='text-base font-medium text-gray-900'>
                  Order Total
                </div>
                <div className='text-base font-medium text-gray-900'>
                  {isMounted ? (
                    formatPrice(cartTotal + fee)
                  ) : (
                    <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                  )}
                </div>
              </div>
            </div>

            <div className='mt-6'>
              {
                confirmAddress && currentStep==2?

                  <Button
                    disabled={items.length === 0 || (confirmAddress && !addressConfirmed) || cartTotal === 0}
                    onClick={() => {
                      if(paymentMethod=='cashOnDelivery'){
                        console.log(products)
                        createOrder(products)
                      }else if(paymentMethod == 'online'){
                        createCheckoutSession( products )
                      }else{
                        toast.error('Please select payment method first')
                      }
                    }}
                    className='w-full'
                    size='lg'>
                    {isLoading || isLoadingCreateOrder ? (
                      <Loader2 className='w-4 h-4 animate-spin mr-1.5' />
                    ) : null
                    }
                    Place order
                  </Button>
                
                :confirmAddress && currentStep==1?

                  <Button
                    disabled={items.length === 0 || (confirmAddress && !addressConfirmed) || cartTotal === 0}
                    onClick={() => {setCurrentStep(currentStep=>currentStep+1);}}
                    className='w-full'
                    size='lg'>
                    {isLoading ? (
                      <Loader2 className='w-4 h-4 animate-spin mr-1.5' />
                    ) : null
                    }
                    Save
                  </Button>

                :
                  <Button
                    disabled={items.length === 0 || cartTotal === 0}
                    onClick={() =>{setCurrentStep(currentStep=>currentStep+1); setConfirmAddress( true )}}
                    className='w-full'
                    size='lg'>
                    {isLoading ? (
                      <Loader2 className='w-4 h-4 animate-spin mr-1.5' />
                    ) : null
                    }
                    Checkout
                  </Button>
              }
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Page
