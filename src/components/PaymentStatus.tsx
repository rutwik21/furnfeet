'use client'

import { Address } from '@/payload-types'
import { trpc } from '@/trpc/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PaymentStatusProps {
  orderEmail: string
  orderId: string
  isPaid: boolean
  address: Address
  page?: string
}

const PaymentStatus = ({
  orderEmail,
  orderId,
  isPaid,
  address,
  page
}: PaymentStatusProps) => {
  const router = useRouter()

  // const { data } = trpc.payment.pollOrderStatus.useQuery(
  //   { orderId },
  //   {
  //     enabled: isPaid === false,
  //     refetchInterval: (data) =>
  //       data?.isPaid ? false : 1000,
  //   }
  // )
  let data = {isPaid:true}

  useEffect(() => {
    if (data?.isPaid) router.refresh()
  }, [data?.isPaid, router])

  return (
    <div className='mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600'>
      <div>
        <p className='font-medium text-gray-900'>
          {page && page=='orderStatus'?"Address":"Shipping To"}
        </p>
        <p className='text-sm w-auto font-semibold text-gray-900'>{address.name}</p>
        <p>{address.addressLine1}, {address.addressLine2}</p>
        <p>{address.city}, {address.state} - {address.pinCode}</p>
        <p className='text-sm w-auto font-semibold text-gray-900'>{address.contact}</p>
        <p className='text-sm w-auto font-semibold text-gray-900'>{orderEmail}</p>
      </div>

      <div>
        <p className='font-medium text-gray-900'>
          Order Status
        </p>
        <p>
          {isPaid
            ? 'Payment successful'
            : 'Pending payment'}
        </p>
      </div>
    </div>
  )
}

export default PaymentStatus
