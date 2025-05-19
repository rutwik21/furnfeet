import { getServerSideUser } from '@/lib/payload-utils'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/get-payload'
import { notFound, redirect } from 'next/navigation'
import { Address, Order, Product, User } from '@/payload-types'
import { ADDED_CHARGES, PRODUCT_CATEGORIES } from '@/config'
import { cn, formatPrice } from '@/lib/utils'
import { OrderItem } from '@/lib/custom_interfaces'
import Link from 'next/link'
import PaymentStatus from '@/components/PaymentStatus'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ImageSlider from '@/components/ImageSlider'
import dynamic from 'next/dynamic';

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
  params: {
    orderId: string
  }
}

const OrderDetailsPage = async ({
  searchParams,
  params
}: PageProps) => {
  const orderId = params.orderId
  const productId = searchParams.productId
  const nextCookies = cookies()

  if(!productId) return notFound()

  const { user } = await getServerSideUser(await nextCookies)
  const payload = await getPayloadClient()

  const { docs: orders }= await payload.find({
    collection: 'orders',
    depth: 2,
    where: {
      orderId: {
        equals: orderId,
      },
    },
  })
  const [order] = orders 
  if (!order) return notFound()
    
  const orderUserId = typeof order.user === 'string' ? order.user : (order.user as User).id

  if (orderUserId !== user?.id) {
    return redirect(
      `/sign-in?origin=orderHistory/${order.id}?productId=${productId}`
    )
  }

  const data = order.data as OrderItem[];
  const address = order.address as Address;

  const selectedOrder = data.filter(ele => typeof ele.productId !='string'?ele.productId.id === productId:null)[0];
  if(!selectedOrder) return notFound();
  const product = typeof selectedOrder.productId != 'string'? selectedOrder.productId: null;
  if(!product) return notFound()

  const orderTotal = order.totalOrderValue as number;
  const validUrls = product.images
    .map(({ image }) =>
      typeof image === 'string' ? image : image.url
    )
    .filter(Boolean) as string[]

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) =>
      value === product.category
  )?.label

  return (
    <MaxWidthWrapper>
       <div className='bg-white'>
       <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 sm:pt-14 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          
          {/* Product Info */}
          <div className='lg:max-w-lg lg:self-end mt-2 lg:mt-8'>
            <h1 className={cn('mb-4 text-lg capitalize font-semibold py-2 px-4 rounded-md tracking-tight text-gray-900 sm:text-xl',{
              'bg-green-50':selectedOrder.orderStatus =='delivered',
              'bg-gray-50':selectedOrder.orderStatus !='delivered'
            })}>
              <p className='line-clamp-1 text-xs font-normal capitalize text-muted-foreground'>
                Order Status
              </p>
              {selectedOrder.orderStatus}
            </h1>
            <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/product/${product.id}`}>
              <div className='aspect-square rounded-lg'>
                <ImageSlider urls={validUrls} />
              </div>
            </Link>

            <h1 className='mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl'>
              {product.name}
            </h1>
            <p className='line-clamp-1 text-xs capitalize  mb-4 text-muted-foreground'>
              Category: {label}
            </p>
          

            <div className='space-y-2 bg-gray-50 p-2 md:p-4 rounded-md border-gray-200 pt-2 text-sm font-medium text-muted-foreground'>


            {selectedOrder.dimensions && selectedOrder.dimensions.length>0?

              <div className='flex items-center justify-between border-gray-200  text-gray-900'>
                <p className='text-base'>Size</p>
                <div className='text-base'>
                  <ul>
                    {selectedOrder.dimensions && selectedOrder.dimensions?.length>0?
                      selectedOrder.dimensions?.map((size, i)=>{
                        return <li key={i}>{size.length}L x {size.width}W x {size.height}H</li>
                      })
                    :""}
                  </ul>
                </div>
              </div>

              :null}


                  
              <div className='flex items-center justify-between border-gray-200  text-gray-900'>
                <p className='text-base'>Item price</p>
                <p className='text-base'>
                  {formatPrice(selectedOrder.price)}
                </p>
              </div>
            </div>
            

          </div>

          
          {/* Order Details */}
          <div className='mt-2 lg:col-start-2 lg:row-span-2 lg:mt-8 lg:self-start'>
            <div className='lg:col-span-7 rounded-lg md:border-2 md:border-dashed border-zinc-200 md:p-12'>
              <div className='text-sm font-medium'>

                <h1 className='mt-2 mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
                  Total items in this cart
                </h1>

                <div className='text-muted-foreground'>
                  Order nr.
                </div>
                <div className='mt-2 text-gray-900'>
                  {order.id}
                </div>
  
                <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                  {(data).map(
                    ({productId:product, price, qty, dimensions}) => {
                      if(typeof product == 'string') return null
                      const label = PRODUCT_CATEGORIES.find(
                        ({ value }) =>
                          value === product.category
                      )?.label
                      // (
                      //   product.product_files as ProductFile
                      // ).url as string
  
                      const { image } = product.images[0]
  
                      return (
                        <li
                          key={product.id}
                          className='flex space-x-6 py-6'
                          >
                          <div className='relative h-24 w-24'>
                            {typeof image !== 'string' &&
                            image.url ? (
                              <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/product/${product.id}`}>
                              <Image
                                fill
                                src={image.url}
                                alt={`${product.name} image`}
                                className='flex-none rounded-md bg-gray-100 object-cover object-center'
                              /></Link>
                            ) : null}
                          </div>
  
                          <div className='flex-auto flex flex-col justify-between'>
                            <div className='space-y-1'>
                              <h3 className='text-gray-900'>
                                {product.name}
                              </h3>
  
                              <p className='line-clamp-1 text-xs capitalize my-1 text-muted-foreground'>
                                Category: {label}
                              </p>
                              {dimensions && dimensions.length>0?
                              <div className="flex gap-2 my-1">
                                
                                  <div className="flex gap-1">
                                    <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
                                    Size:
                                    </span>
                                    <ul>
                                      {dimensions && dimensions?.length>0?
                                        dimensions?.map((size, i)=>{
                                          return <li key={i} className='line-clamp-1 text-xs capitalize text-muted-foreground'>{size.length}L x {size.width}W x {size.height}H</li>
                                        })
                                      :""}
                                    </ul>

                                  </div>
                              </div>:null}
                              <p className='line-clamp-1 text-xs capitalize my-1 text-muted-foreground'>
                                Qty: {qty}
                              </p>
                            </div>
  
                          </div>
  
                          <p className='flex-none font-medium text-gray-900'>
                            {formatPrice(price)}
                          </p>
                        </li>
                      )
                    }
                  )}
                </ul>
                <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                  
                  <div className='flex items-center justify-between border-gray-200 pt-6 text-gray-900'>
                    <p className='text-base'>Total</p>
                    <p className='text-base'>
                      {formatPrice(orderTotal)}
                    </p>
                  </div>
                </div>
  
                <PaymentStatus
                  isPaid={order._isPaid as boolean}
                  orderEmail={(order.user as User).email}
                  orderId={order.id as string}
                  address={address}
                  page='orderStatus'
                />
  
                <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                  <Link
                    href='/products'
                    className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                    Continue shopping &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          
        </div>



       </div>




      {/* <main className='relative md:flex lg:min-h-full'>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 mt-16 rounded-lg bg-gray-50 '>
          <div className='flex flex-col gap-2 space-y-4'>

          <div className='lg:max-w-lg lg:self-end'>
            
            <div className='aspect-square rounded-lg'>
            {
                typeof product.images[0].image != 'string' && product.images[0].image.url ?
                  <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/product/${product.id}`}>
                  <Image
                    fill
                    src={product.images[0].image.url}
                    alt={`${product.name} image`}
                    className='flex-none rounded-md bg-gray-100 object-cover object-center'
                  /></Link>
                  : ""
              }
            </div>

          </div>



            <div className='relative h-48 w-48'>
              {
                typeof product.images[0].image != 'string' && product.images[0].image.url ?
                  <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/product/${product.id}`}>
                  <Image
                    fill
                    src={product.images[0].image.url}
                    alt={`${product.name} image`}
                    className='flex-none rounded-md bg-gray-100 object-cover object-center'
                  /></Link>
                  : ""
              }
            </div>
            <h5 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
              {product.name}
            </h5>

            <p className='mt-2 text-base text-muted-foreground'>
              Size: 
                <span className='font-medium text-gray-900'>
                  {
                    selectedOrder.dimensions?
                    selectedOrder.dimensions.map(({id, length, width, height})=>{
                      return <p key={id}>{length}L X {width}W X {height}H</p>
                    }): null
                  }
                </span>
            </p>

          </div>
          
        </div>
  
        <div>
          <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 '>
            <div className='lg:col-start-2'>
              <div className='lg:col-span-7 rounded-lg md:border-2 md:border-dashed border-zinc-200 md:p-12'>
                <div className='text-sm font-medium'>

                  <h1 className='my-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
                    Total items in this cart
                  </h1>

                  <div className='text-muted-foreground'>
                    Order nr.
                  </div>
                  <div className='mt-2 text-gray-900'>
                    {order.id}
                  </div>
    
                  <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                    {(data).map(
                      ({productId:product, price, qty, dimensions}) => {
                        if(typeof product == 'string') return null
                        const label = PRODUCT_CATEGORIES.find(
                          ({ value }) =>
                            value === product.category
                        )?.label
                        // (
                        //   product.product_files as ProductFile
                        // ).url as string
    
                        const { image } = product.images[0]
    
                        return (
                          <li
                            key={product.id}
                            className='flex space-x-6 py-6'
                            >
                            <div className='relative h-24 w-24'>
                              {typeof image !== 'string' &&
                              image.url ? (
                                <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/product/${product.id}`}>
                                <Image
                                  fill
                                  src={image.url}
                                  alt={`${product.name} image`}
                                  className='flex-none rounded-md bg-gray-100 object-cover object-center'
                                /></Link>
                              ) : null}
                            </div>
    
                            <div className='flex-auto flex flex-col justify-between'>
                              <div className='space-y-1'>
                                <h3 className='text-gray-900'>
                                  {product.name}
                                </h3>
    
                                <p className='line-clamp-1 text-xs capitalize my-1 text-muted-foreground'>
                                  Category: {label}
                                </p>
                                {dimensions && dimensions.length>0?
                                <div className="flex gap-2 my-1">
                                  
                                    <div className="flex gap-1">
                                      <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
                                      Size:
                                      </span>
                                      <ul>
                                        {dimensions && dimensions?.length>0?
                                          dimensions?.map((size, i)=>{
                                            return <li key={i} className='line-clamp-1 text-xs capitalize text-muted-foreground'>{size.length}L x {size.width}W x {size.height}H</li>
                                          })
                                        :""}
                                      </ul>

                                    </div>
                                </div>:null}
                                <p className='line-clamp-1 text-xs capitalize my-1 text-muted-foreground'>
                                  Qty: {qty}
                                </p>
                              </div>
    
                            </div>
    
                            <p className='flex-none font-medium text-gray-900'>
                              {formatPrice(price)}
                            </p>
                          </li>
                        )
                      }
                    )}
                  </ul>
                  <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                    <div className='flex justify-between'>
                      <p>Subtotal</p>
                      <p className='text-gray-900'>
                        {formatPrice(orderTotal - FLAT_TRANSACTION_FEE)}
                      </p>
                    </div>
    
                    {
                      ADDED_CHARGES.map(ele=>{
                        return <div className='flex justify-between'>
                          <p>{ele.label}</p>
                          <p className='text-gray-900'>
                            {formatPrice(ele.value)}
                          </p>
                        </div>
                      })
                    }
                    
    
                    <div className='flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900'>
                      <p className='text-base'>Total</p>
                      <p className='text-base'>
                        {formatPrice(orderTotal)}
                      </p>
                    </div>
                  </div>
    
                  <PaymentStatus
                    isPaid={order._isPaid as boolean}
                    orderEmail={(order.user as User).email}
                    orderId={order.id as string}
                    address={address}
                    page='orderStatus'
                  />
    
                  <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                    <Link
                      href='/products'
                      className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                      Continue shopping &rarr;
                    </Link>
                  </div>
                </div>
              </div>
  
              
            </div>
          </div>
        </div>
      </main> */}
    </MaxWidthWrapper>
    )
}

export default OrderDetailsPage;
// export default dynamic(() => Promise.resolve(OrderDetailsPage) , { ssr: false }); 
