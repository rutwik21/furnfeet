import CancelOrder from '@/components/CancelOrder'
import { buttonVariants } from '@/components/ui/button'
import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/lib/payload-utils'
import { cn, formatPrice } from '@/lib/utils'
import { Order } from '@/payload-types'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
// import React from 'react'

const OrderHistory = async()=> {
    const nextCookies = cookies()
    const { user } = await getServerSideUser(await nextCookies);
    if(!user) return <div className='h-[80svh] flex flex-col items-center justify-center'>
        <h3 className='text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl mb-2 '>
          Please sign-in first to see your orders.
        </h3>
        <Link
          href='/sign-in?origin=orderHistory'
          className={buttonVariants()}>
          Sign-in here
        </Link>

    </div>
    const payload = await getPayloadClient()
    
    const { docs }= await payload.find({
      collection: 'orders',
      depth: 2,
      where: {
        user: {
          equals: user?.id,
        },
      },
    });

    const orders = docs as unknown as Order[];

    const dateConverter = (dateStr:string): string=>{
      if(!dateStr) return ""
      const date = new Date(dateStr);

      const formatter = new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return formatter.format(date);
    }

    return (

        <div className='bg-white'>
          <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Order History
            </h1>

            <div className=' mt-4 grid gap-y-3'>
              {
                    orders.map((order)=>{
                      return <section key={order.id} className={cn('rounded-lg max-w-[800px] px-2 py-2 sm:p-2 lg:col-span-5 lg:mt-0 lg:p-4',{'bg-green-50':order._isPaid, 'bg-gray-50':!order._isPaid})} >
                        <div className='mb-1 flex justify-between py-2'>
                          <div>
                            <h2 className='capitalize inline-flex ms-2 text-lg font-medium text-gray-900'>{order._isPaid?"Paid":"Unpaid"}</h2>
                          </div>
                          <div>
                            <p className='line-clamp-1 text-xs text-muted-foreground'>
                              Order nr: {order.id}
                            </p>
                            <p className='line-clamp-1 text-xs text-muted-foreground'>
                              
                              Ordered on: {//@ts-ignore
                                  dateConverter(order.createdAt)}
                            </p>
                          </div>
                          
                        </div>
                        {
                          order.data.map((prod)=>{
                            return <div key={typeof prod.productId=='string'?prod.productId:prod.productId.id} 
                            className='space-y-4 p-4 bg-white rounded mb-2 border flex justify-between'>
                              <div className='w-full'> 
                                <div className="flex w-full justify-between mb-2 pb-2 border-b">
                                  <div className='text-lg font-medium text-gray-900'>
                                  
                                    <h2 className='capitalize inline-flex'>
                                      {prod.orderStatus} {prod.updatedAt? 
                                      <span className='line-clamp-1 text-xs text-muted-foreground self-end pb-1 ps-1'>
                                        on {dateConverter(prod.updatedAt)}
                                      </span>
                                    :""}
                                    </h2>
                                    {prod.estimatedDeliveryDate &&( prod.orderStatus == 'confirmed' || prod.orderStatus == 'received' || prod.orderStatus == 'inProcess' || prod.orderStatus=='inTransit' || prod.orderStatus == 'shipped')?
                                      <span className='line-clamp-1 text-xs text-green-900'>
                                        Expected delivered on {dateConverter(prod.estimatedDeliveryDate)}
                                      </span>
                                    :""}
                                    
                                  </div>
                                </div>
                                <div className='flex gap-2 flex-col md:flex-row justify-between'>
                                  <div className='flex items-center border-b md:border-b-0 pb-2 md:pb-0 space-x-4'>
                                    {
                                      typeof prod.productId != 'string'?
                                      <>
                                        <div className='relative aspect-square h-24 w-24 min-w-fit overflow-hidden rounded'>
                                          {
                                            typeof prod.productId.images!= 'string'  && prod.productId.images[0].image ?
                                            
                                            <Image
                                            //@ts-ignore
                                              src={prod.productId.images[0].image.url}
                                              alt={prod.productId.name}
                                              fill
                                              className='absolute object-cover'
                                            />
                                            : ""

                                          }
                                        </div>
                              
                                        <div className='flex flex-col self-start'>
                                          <span className='line-clamp-1 text-sm font-medium mb-1'>
                                            {prod.productId.name}
                                          </span>
                                          {prod.dimensions && prod.dimensions?.length>0?
                                            <div className="flex gap-1">
                                              <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
                                              Size:
                                              </span>
                                              <ul>
                                                {
                                                  prod.dimensions?.map((size, i)=>{
                                                    return <li key={i} className='line-clamp-1 text-xs capitalize text-muted-foreground'>{size.length}L x {size.width}W x {size.height}H</li>
                                                  })
                                                }
                                              </ul>
                                            </div>
                                          :null}
                              
                                          <div className='text-xs text-muted-foreground'>
                                              Qty: {prod.qty}
                                          </div>
                                          <div className='text-xs text-muted-foreground'>
                                              Item price: <span className='text-black'>{formatPrice(prod.price)}</span> 
                                          </div>
                                          <Link 
                                            className='mt-4 text-xs text-muted-foreground' 
                                            href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orderHistory/${order.orderId}?productId=${prod.productId.id}`}>
                                            <button
                                              className='flex items-center gap-0.5'>
                                              Order details
                                            </button>

                                          </Link>
                                          
                                        </div>
                                      </>
                                      :""
                                    }
                                  </div>
                                  <div className='flex md:flex-col md:items-center'>
                                    {
                                      !prod.isCustomized && (prod.orderStatus != 'delivered' && prod.orderStatus != 'rejected' && !prod.isOrderCancelled) ?
                                       <CancelOrder 
                                        productId={typeof prod.productId=='string'?prod.productId:prod.productId.id} 
                                        orderId={order.id} />  
                                       // <Button variant={'outline'}>Cancel order</Button>
                                       :
                                       prod.isCustomized && prod.orderStatus == 'received' ?
                                       <CancelOrder 
                                        productId={typeof prod.productId=='string'?prod.productId:prod.productId.id} 
                                        orderId={order.id} />  
                                        // <Button variant={'outline'}>Cancel order</Button>
                                      :null
                                    }
                                  </div>
                                </div>

                              </div>
                              
                            </div>
                          })
                        }
                        
                      </section>
                    })
                  }


              {/* <div className='rounded-lg border-2 border-dashed border-zinc-200 p-4 lg:col-span-7'>
                <div className="container mx-auto px-4 py-8">

                  
                    
                </div>
              </div> */}

            </div>
          </div>
        </div>



        // <div>
        // {
        //     orders.map((order,i)=>{
        //         return <div key={order.id}>
        //             <p>Payment: {order._isPaid?"Completed":"Pending"}</p>
        //         </div>
        //     })
        // }
        // </div>
    )
}

export default OrderHistory