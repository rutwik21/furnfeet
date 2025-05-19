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

const CancelOrder = ({productId, orderId}
  :{productId:string, orderId:string}) => {
  const router = useRouter();
  const [cancellationReason, setCancellationReason] = useState<string>();
  let otherCancelReason = "";

  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  useEffect(() => {
    setIsMounted(true)
  }, []);

  const { mutate: cancelOrder, isLoading } =
      trpc.order.cancelOrder.useMutation({
        onSuccess: async (success) => {
          if(success){
            router.refresh();
            setTimeout(() => {
              toast.success('Order cancelled successful');
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
                <Button variant={'outline'} >Cancel order</Button>
              </AlertDialogTrigger>
      
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reason for cancellation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please tell us the reason for cancellation, this information only help us to improve our service.
                   
                    <SearchableDropdown
                      className='md:w-full w-full mt-2'
                      options={ORDER_CANCELATION_REASONS} 
                      placeholder='Select reason' 
                      getSelectedOption={setCancellationReason}/>
                    
                    {
                      cancellationReason=="other"?
                      <div  className='mt-2'>
                        <Label htmlFor='reason'>Tell us more</Label>
                        <Input id='reason' type='text' required onChange={($event)=>{
                          otherCancelReason = $event.target.value;
                        }}/>
                      </div>
                      :null
                    }
      
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Back</AlertDialogCancel>
                  <AlertDialogAction onClick={()=>{
                    if(cancellationReason){
                      if(cancellationReason === 'other'){
                        cancelOrder({productId, orderId, reason: otherCancelReason!});
                      }else{
                        cancelOrder({productId, orderId, reason: cancellationReason!});
                      }
                    }else{
                      toast.error('Please select the reason for cancellation')
                    }
                    }}>
                      {isLoading ? (
                        <Loader2 className='w-4 h-4 animate-spin mr-1.5' />
                      ) : null}
                      Cancel order
                    </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
      
          </>
        );
      }
};

export default CancelOrder;
