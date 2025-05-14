"use client"

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import SearchableDropdown from './product/searchableProductDropdown';
import { ORDER_CANCELATION_REASONS } from '@/config';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { trpc } from '@/trpc/client'
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

const WithdrawRequest = ({availableBalance}: {availableBalance:number}) => {
  const router = useRouter();
  const [amount, setAmount] = useState<number>();
  const [paymentMode, setPaymentMode] = useState< "UPI" | "Wallet" | "Bank" | "Cash" >();
  const [acDetails, setAcDetails] = useState<string>();

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const PAYMENT_MODES = [
    {label: "UPI", value: "UPI"},
    {label: "Bank", value: "Bank"},
    {label: "Wallet", value: "Wallet"},
  ]
  
  useEffect(() => {
    setIsMounted(true)
  }, []);

  const { mutate: requestWithdrawal, isLoading } =
      trpc.commission.requestWithdrawal.useMutation({
        onSuccess: async (success) => {
          if(success){
            router.refresh();
            setTimeout(() => {
              toast.success('Request submitted');
            }, 200);
          }
        },
        onError: (err) => {
          console.log(err);
          toast.error('Something went wrong.')
        },
      })

      if(!isMounted){
        return <div>Loading</div>
      }else{
        return (
          <>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant={'outline'} >Withdraw</Button>
              </AlertDialogTrigger>
      
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Withdraw request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please enter your account details.
                    <div className='mt-2'>
                      <Label htmlFor='amount'>Amount</Label>
                      <Input id='amount' className='my-1' type='number' min={1000} max={availableBalance} required onChange={($event)=>{
                        setAmount(Number($event.target.value));
                      }}/>
                      <p>Available balance: {availableBalance}</p>
                    </div>
                    <div className='mt-2'>
                      <SearchableDropdown
                        className='md:w-full w-full'
                        options={PAYMENT_MODES} 
                        placeholder='Select payment method' 
                        getSelectedOption={setPaymentMode}/>
                    </div>
                    {
                      paymentMode=="UPI"?
                      <div  className='mt-2'>
                        <Label htmlFor='reason'>UPI ID</Label>
                        <Input id='reason' type='text' required onChange={($event)=>{
                          setAcDetails($event.target.value);
                        }}/>
                      </div>
                      :null
                    }
                    {
                      paymentMode=="Bank"?
                      <div  className='mt-2'>
                        <Label htmlFor='reason'>Bank details</Label>
                        <Input id='reason' type='text' required onChange={($event)=>{
                          setAcDetails($event.target.value);
                        }}/>
                      </div>
                      :null
                    }
      
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Back</AlertDialogCancel>
                  <AlertDialogAction onClick={()=>{
                    if(amount && paymentMode && acDetails){
                      if(amount>availableBalance){
                        toast.error("Available balance to withraw is " + availableBalance +"rs");
                      }else if(amount<1000){
                        toast.error("Minimum withdrawable amount is 1000rs");
                      }else{
                        requestWithdrawal({amount: amount, paymentMode: paymentMode, acDetails: acDetails});
                      }
                    }else{
                      toast.error("Please fill all the information");
                    }
                    }}>
                      {isLoading ? (
                        <Loader2 className='w-4 h-4 animate-spin mr-1.5' />
                      ) : null}
                      Submit
                    </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
      
          </>
        );
      }
};

export default WithdrawRequest;
