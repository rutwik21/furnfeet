"use client"

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useState } from 'react';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { NewAddressValidator, TNewAddressValidator, TUpdateAddressValidator } from '@/lib/validators/address-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/trpc/client';
import { Address } from '@/payload-types';
import { toast } from 'sonner';
import { ZodError } from 'zod';
import { Check, Loader2 } from 'lucide-react';

type ChildProps = {
  handleAddressConfirmation: (data: boolean) => void;
};
const ConfirmAddress:  React.FC<ChildProps> = ({handleAddressConfirmation}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TNewAddressValidator>({
    resolver: zodResolver(NewAddressValidator),
  })
  
  const [showForm, setShowForm] = useState(false);
  const { mutate, isLoading } = 
    trpc.user.addNewAddress.useMutation({
      onError: (err) => {
        if (err.data?.code === 'BAD_REQUEST') {
          toast.error(
            'Please provide all the valid details'
          )

          return
        }

        if (err instanceof ZodError) {
          toast.error(err.issues[0].message)

          return
        }
        toast.error(
          'Something went wrong. Please try again.'
        )
      },
      onSuccess:(addresses)=>{
        if(addresses) setAddresses(addresses);
        (window.document.querySelector("#newAddressForm") as HTMLFormElement).reset();
        setShowForm(false);
      }
    });

    const updateAddress = 
    trpc.user.updateAddress.useMutation({
      onError: (err) => {
        if (err.data?.code === 'BAD_REQUEST') {
          toast.error(
            'Please provide all the valid details'
          )

          return
        }

        if (err instanceof ZodError) {
          toast.error(err.issues[0].message)

          return
        }
        toast.error(
          'Something went wrong. Please try again.'
        )
      },
      onSuccess:(addresses)=>{
        if(addresses) setAddresses(addresses);
      }
    });
    
    trpc.user.allAddresses.useQuery(undefined,{
      onError:(err)=>{
        console.log(err)
      },
      onSuccess:(addresses)=>{
        if(addresses) setAddresses(addresses);
      }
    });


    const onSubmit = ({
      name,
      contact,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode
    }: TNewAddressValidator) => {
      contact = Number(contact);
      mutate({ name,contact,addressLine1,addressLine2,city,state,pinCode });
    }
    const onUpadteAddressSubmit = ({
      id,
      name,
      contact,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      isDefaultAddress
    }: TUpdateAddressValidator) => {
      contact = Number(contact);
      updateAddress.mutate({id, name,contact,addressLine1,addressLine2,city,state,pinCode, isDefaultAddress })
    }

  return (
    <div className='rounded-lg border-2 border-dashed border-zinc-200 p-4 md:p-12 lg:col-span-7'>
      <div className="">
          <div className='flex col-span-full justify-between border-b pb-4 mb-4'>
            <h2 className='text-xl font-bold my-1 text-gray-900'>
              Your Addresses
            </h2>
            <Button
                className=" py-2 px-4"
                onClick={() => setShowForm(!showForm)}
                >
                {showForm ? 'Cancel' : 'Add New Address'}
            </Button>

          </div>
          
          {showForm && (
              <div className="rounded-lg p-6 mb-6 bg-gray-50 ">
                <h2 className='text-lg font-medium my-2 text-gray-900'>
                  Add New Address
                </h2>
                <form id="newAddressForm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Input 
                          type='text'
                          placeholder='Name*' 
                          {...register('name')}
                          className={cn({
                            'focus-visible:ring-red-500':
                              errors.name,
                          })}
                        />
                        {errors?.name && (
                          <p className='text-sm text-red-500'>
                            {errors.name.message}
                          </p>
                        )}

                      </div>
                      <div>
                        <Input 
                          type='number'
                          placeholder='Mobile no.*' 
                          {...register('contact')}
                          className={cn({
                            'focus-visible:ring-red-500':
                            errors.contact,
                          })}
                          />
                          {errors?.contact && (
                            <p className='text-sm text-red-500'>
                              {errors.contact.message}
                            </p>
                          )}

                      </div>
                      <div>
                        <Input
                            type="text"
                            placeholder="Address Line 1*"
                            {...register('addressLine1')}
                            className={cn({
                              'focus-visible:ring-red-500':
                              errors.addressLine1,
                            })}
                            required
                            />
                            {errors?.addressLine1 && (
                              <p className='text-sm text-red-500'>
                                {errors.addressLine1.message}
                              </p>
                            )}

                      </div>
                      <div>
                        <Input
                            type="text"
                            placeholder="Address Line 2"
                            {...register('addressLine2')}
                            className={cn({
                              'focus-visible:ring-red-500':
                                errors.addressLine2,
                            })}
                        />
                            {errors?.addressLine2 && (
                              <p className='text-sm text-red-500'>
                                {errors.addressLine2.message}
                              </p>
                            )}

                      </div>
                      <div>
                        <Input
                            type="text"
                            placeholder="City*"
                            {...register('city')}
                            className={cn({
                              'focus-visible:ring-red-500':
                                errors.city,
                            })}
                            required
                        />
                            {errors?.city && (
                              <p className='text-sm text-red-500'>
                                {errors.city.message}
                              </p>
                            )}

                      </div>
                      <div>
                        <Input
                            type="text"
                            placeholder="State*"
                            {...register('state')}
                            className={cn({
                              'focus-visible:ring-red-500':
                                errors.state,
                            })}
                            required
                        />
                        {errors?.state && (
                              <p className='text-sm text-red-500'>
                                {errors.state.message}
                              </p>
                            )}

                      </div>
                      <div>
                        <Input
                            type="text"
                            placeholder="Pin Code*"
                            {...register('pinCode')}
                            className={cn({
                              'focus-visible:ring-red-500':
                                errors.pinCode,
                            })}
                            required
                        />
                        {errors?.pinCode && (
                              <p className='text-sm text-red-500'>
                                {errors.pinCode.message}
                              </p>
                            )}
                        
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="mt-4 py-2 px-4"
                      >
                      {isLoading ? (
                        <Loader2 className='w-4 h-4 animate-spin mr-1.5' />
                      ) : null
                      }
                      Add Address
                    </Button>
                </form>
              </div>
          )}

          <div className="space-y-4">
              {addresses.map((address) => {
                if(address.isDefaultAddress) handleAddressConfirmation(true);
                return <div key={address.id}
                className={cn('border rounded-lg p-6',{
                  'bg-green-50 border-primary':address.isDefaultAddress,
                  'bg-white border-gray-500':!address.isDefaultAddress,
                })}
                >
                  <div className='flex justify-between'>
                    <h2 className='text-xl w-auto font-semibold text-gray-900'>
                      {address.name}
                    </h2>
                    {
                      address.isDefaultAddress
                      ?<Button size="sm"  variant="ghost" className='bg-green-100 text-black' > 
                      Selected <span><Check className='w-4 ms-1'/></span></Button>
                      :<Button
                        onClick={()=> {
                          address.addressLine2 = address.addressLine2!=undefined?address.addressLine2:null;
                          return onUpadteAddressSubmit({
                          id:address.id, name: address.name, contact:address.contact, addressLine1: address.addressLine1,
                          addressLine2: address.addressLine2 , city:address.city,state:address.state, pinCode:address.pinCode, 
                          isDefaultAddress:true
                        })}}
                      size="sm" 
                      className='bg-secondary text-black' 
                      >Select</Button>
                    }
                  </div>
                    <p>{address.addressLine1}, {address.addressLine2}</p>
                    <p>{address.city}, {address.state} - {address.pinCode}</p>
                    <p className='text-sm w-auto font-semibold text-gray-900'>Mobile No. : {address.contact}</p>
                </div>
              }
              )}
          </div>
      </div>

    </div>
  );
};

export default ConfirmAddress;
