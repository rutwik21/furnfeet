import { getServerSideUser } from '@/lib/payload-utils'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/get-payload'
import { notFound, redirect } from 'next/navigation'
import { Address, Order, Product, User } from '@/payload-types'
import { ADDED_CHARGES, PRODUCT_CATEGORIES } from '@/config'
import { formatPrice } from '@/lib/utils'
import { OrderItem } from '@/lib/custom_interfaces'
import Link from 'next/link'
import PaymentStatus from '@/components/PaymentStatus'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const ThankYouPage = async ({
  searchParams,
}: PageProps) => {
  const orderId = searchParams.orderId
  const nextCookies = cookies()
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
      `/sign-in?origin=thank-you?orderId=${order.id}`
    )
  }

  const data = order.data as OrderItem[];
  const address = order.address as Address;

  const orderTotal = order.totalOrderValue as number;

  return (
    <main className='relative lg:min-h-full'>
      <div className='hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
        <Image
          fill
          src='/checkout-thank-you1.gif'
          className='h-full w-full object-cover object-center'
          alt='thank you for your order'
        />
      </div>

      <div>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
          <div className='lg:col-start-2'>
            <p className='text-sm font-medium text-blue-600'>
              Order successful
            </p>
            <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
              Thanks for ordering
            </h1>
            {order._isPaid ? (
              <p className='mt-2 text-base text-muted-foreground'>
                Your order has recived. We&apos;ve sent
                your receipt and order details to{' '}
                {typeof order.user !== 'string' ? (
                  <span className='font-medium text-gray-900'>
                    {(order.user as User).email}
                  </span>
                ) : null}
                .
              </p>
            ) : (
              <p className='mt-2 text-base text-muted-foreground'>
                We appreciate your order, and we&apos;re
                currently processing it. So hang tight and
                we&apos;ll send you confirmation very soon!
              </p>
            )}

            <div className='mt-16 text-sm font-medium'>
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
              {/* <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                {(order.products as Product[]).map(
                  (product) => {
                    const label = PRODUCT_CATEGORIES.find(
                      ({ value }) =>
                        value === product.category
                    )?.label

                    const downloadUrl = ''
                    // (
                    //   product.product_files as ProductFile
                    // ).url as string

                    const { image } = product.images[0]

                    return (
                      <li
                        key={product.id}
                        className='flex space-x-6 py-6'>
                        <div className='relative h-24 w-24'>
                          {typeof image !== 'string' &&
                          image.url ? (
                            <Image
                              fill
                              src={image.url}
                              alt={`${product.name} image`}
                              className='flex-none rounded-md bg-gray-100 object-cover object-center'
                            />
                          ) : null}
                        </div>

                        <div className='flex-auto flex flex-col justify-between'>
                          <div className='space-y-1'>
                            <h3 className='text-gray-900'>
                              {product.name}
                            </h3>

                            <p className='my-1'>
                              Category: {label}
                            </p>
                          </div>

                          {order._isPaid ? (
                            <a
                              href={downloadUrl}
                              download={product.name}
                              className='text-blue-600 hover:underline underline-offset-2'>
                              Download asset
                            </a>
                          ) : null}
                        </div>

                        <p className='flex-none font-medium text-gray-900'>
                          {formatPrice(product.price)}
                        </p>
                      </li>
                    )
                  }
                )}
              </ul> */}

              <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                {/* <div className='flex justify-between'>
                  <p>Subtotal</p>
                  <p className='text-gray-900'>
                    {formatPrice(orderTotal - FLAT_TRANSACTION_FEE)}
                  </p>
                </div> */}

                {
                  ADDED_CHARGES.map((ele,i)=>{
                    return <div key={i} className='flex justify-between'>
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
    </main>
  )
}

export default ThankYouPage
