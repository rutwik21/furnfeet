import CancelOrder from '@/components/CancelOrder'
import ImageSlider from '@/components/ImageSlider'
import { Button, buttonVariants } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import WithdrawRequest from '@/components/WithdrawRequest'
import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/lib/payload-utils'
import { cn, formatPrice } from '@/lib/utils'
import { CommissionLedger, Order, Product } from '@/payload-types'
import { ImageIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Commission = async()=> {
    const nextCookies = cookies()
    const { user } = await getServerSideUser(await nextCookies);
    if(!user) return <div className='h-[80svh] flex flex-col items-center justify-center'>
        <h3 className='text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl mb-2 '>
          Please sign-in first to see your earned commision.
        </h3>
        <Link
          href='/sign-in?origin=orderHistory'
          className={buttonVariants()}>
          Sign-in here
        </Link>

    </div>
    const payload = await getPayloadClient()
    
    const { docs }= await payload.find({
      collection: 'commissionLedger',
      depth: 0,
      where: {
        user: {
          equals: user?.id,
        },
      },
      sort:"-createdAt",
      limit: 50
    });

    const records = docs as unknown as CommissionLedger[];

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
    
    const getAvailableBalance = ()=>{
      let lastBalance = 0;
      let pendingCreditedBalance = 0;
      let pendingDebitedBalance = 0;
      if(records && records.length>0){
        lastBalance = records[0].balance;

        for(let i=0; i<records.length; i++){

          if(!records[i].isCompleted && records[i]?.credit){
            pendingCreditedBalance = pendingCreditedBalance + records[i]?.credit!;
          }
        }
      }else return 0

      return lastBalance-pendingCreditedBalance;
    }

    return (
        <div className='bg-white'>
          <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
            <div className="md:flex md:justify-between">
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                Earnings
              </h1>
              <div className="flex gap-4 mt-6 md:mt-0">
                <div className='text-sm font-bold tracking-tight text-gray-900'>
                  <p className='text-xs md:text-sm text-muted-foreground m-0 p-0'>Available balance</p>
                  {formatPrice(getAvailableBalance() || 0, {currency:"INR"}) }
                </div>
                <span
                  className='h-10 w-px bg-gray-200'
                  aria-hidden='true'
                />
                <WithdrawRequest availableBalance={getAvailableBalance()||0} ></WithdrawRequest>
              </div>
            </div>

            <div className=' mt-4 grid gap-y-3'>

                <Table>
                  <TableCaption>A list of your earned commissions.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Credit</TableHead>
                      <TableHead>Debit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record)=>(
                      <TableRow key={record.id} className={cn({'bg-gray-50': !record.isCompleted})}>
                        <TableCell className="font-medium">{record.isCancelled? "Cancelled" :record.isCompleted?"Complete":"Pending"}</TableCell>
                        <TableCell className="font-medium text-nowrap">{record.description}</TableCell>
                        <TableCell className="font-medium text-nowrap">{dateConverter(record.createdAt)}</TableCell>
                        <TableCell>{record.credit}</TableCell>
                        <TableCell>{record.debit}</TableCell>
                        <TableCell className="text-right">{record.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>


            </div>
          </div>
        </div>


    )
}

export default Commission