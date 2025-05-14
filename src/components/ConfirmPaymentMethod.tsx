"use client"

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PAYMENT_METHODS } from '@/config';


type ChildProps = {
  enableCashOnDelivery: boolean;
  handlePaymentMethod: (data: 'cashOnDelivery' | 'online') => 'cashOnDelivery' | 'online';
};
const ConfirmPaymentMethod:  React.FC<ChildProps> = ({handlePaymentMethod, enableCashOnDelivery}) => {
  
  const [selectedMethod, setSelectedMethod] = useState<'cashOnDelivery' | 'online'>();
  return (
    <div className='rounded-lg border-2 border-dashed border-zinc-200 p-4 md:p-12 lg:col-span-7'>
      <div className="">
          <div className='flex col-span-full justify-between pb-4 mb-4'>
            <h2 className='text-xl font-bold my-1 text-gray-900'>
              Payment method
            </h2>
          </div>
              <RadioGroup defaultValue="" className="space-y-2">
                {
                  PAYMENT_METHODS.map(({label, value}, i) => {
                    const disableCashOnDelivery = value=='cashOnDelivery' && !enableCashOnDelivery;
                    return <div key={value} 
                            className={cn("flex justify-between p-4 border", 
                              {'border-primary': selectedMethod==value},{'opacity-70 bg-gray-50': disableCashOnDelivery}
                            )}>
                              <div className={cn('flex items-center space-x-4')}>
                                <RadioGroupItem value={value} id={value} onClick={()=>{
                                  setSelectedMethod(handlePaymentMethod(value));
                                }} disabled={disableCashOnDelivery} />
                                <div>
                                  <Label htmlFor={value}>
                                    {label}
                                  </Label>
                                  {
                                    disableCashOnDelivery?
                                      <p className='text-xs text-red-700'>This option is disabled for some product in your cart.</p>
                                    :null
                                  }
                                </div>
                              </div>
                              <div className='inline-flex space-x-[-5%] justify-end'>
                                {
                                  value=="online"?
                                  <>
                                    <Avatar>
                                      <AvatarImage src="/upi.png"/>
                                      <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                    <Avatar>
                                      <AvatarImage src="/mastercard.png"/>
                                      <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                    <Avatar>
                                      <AvatarImage src="/visa.png"/>
                                      <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                    <Avatar>
                                      <AvatarImage src="/bank.jpg"/>
                                      <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                  </>
                                  :value=="cashOnDelivery"?
                                  <>
                                    <Avatar>
                                      <AvatarImage src="/cash.jpg" />
                                      <AvatarFallback>cash</AvatarFallback>
                                    </Avatar>
                                  </>
                                  :null
                                }

                              </div>
                            </div>
                  })
                }
              </RadioGroup>
              
      </div>

    </div>
  );
};

export default ConfirmPaymentMethod;
