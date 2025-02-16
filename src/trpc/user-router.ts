import { z } from 'zod'
import {
  privateProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { Address } from '@/payload-types'
import {NewAddressValidator, UpdateAddressValidator} from '../lib/validators/address-validator';
export const userRouter = router({
    addNewAddress: privateProcedure
    .input(NewAddressValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      let {name, contact, addressLine1, addressLine2, city, state, pinCode} = input;
      if (input.name == "" || input.addressLine1 == "" ||input.city == "" ||input.state == ""|| input.pinCode == "" || input.contact.toString().length != 10) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
      try {
        const payload = await getPayloadClient();
        
        await payload.update({
            user: user, 
            collection: 'addresses',
            data: { isDefaultAddress: false },
            where:{
                user:{
                    equals: user.id
                }
            }
        });
        contact = Number(contact);
        await payload.create({
            user: user,
            collection: 'addresses',
            data:{
                name:name,
                contact:contact,
                addressLine1:addressLine1,
                addressLine2:addressLine2,
                city:city,
                state:state,
                pinCode:pinCode,
                isDefaultAddress: true
            }
        });
        
        const { docs: addresses } = await payload.find({
            collection: 'addresses',
            where: {
                user: {
                    equals: user.id,
                },
            },
        });

        return addresses as unknown as Address[];

      } catch (err) {
        console.log(err);
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
    }),

    updateAddress: privateProcedure
    .input(UpdateAddressValidator)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      let {id, name, contact, addressLine1, addressLine2, city, state, pinCode, isDefaultAddress} = input;
      if (input.id =="", input.name == "" || input.addressLine1 == "" ||input.city == "" ||input.state == ""|| input.pinCode == "" || input.contact.toString().length != 10) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
      try {
        const payload = await getPayloadClient();
        
        if(isDefaultAddress == true){
          await payload.update({
            user: user, 
            collection: 'addresses',
            data: { isDefaultAddress: false },
            where:{
                user:{
                    equals: user.id
                }
            }
          });
        }
        contact = Number(contact);
        await payload.update({
          user: user,
          collection: 'addresses',
          data:{
              name:name,
              contact:contact,
              addressLine1:addressLine1,
              addressLine2:addressLine2?addressLine2:"",
              city:city,
              state:state,
              pinCode:pinCode,
              isDefaultAddress: isDefaultAddress
          },
          where:{
            id:{
              equals: id
            },
          }
        });
        
        const { docs: addresses } = await payload.find({
            collection: 'addresses',
            where: {
                user: {
                    equals: user.id,
                },
            },
        });

        return addresses as unknown as Address[];

      } catch (err) {
        console.log(err);
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
    }),

    allAddresses: privateProcedure
    .query(async ({ ctx }) => {
      const { user } = ctx
      
      try {
        const payload = await getPayloadClient();
        
        const { docs: addresses } = await payload.find({
            collection: 'addresses',
            where: {
                user: {
                    equals: user.id,
                },
            },
        });

        return addresses as unknown as Address[];

      } catch (err) {
        console.log(err);
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
    }),

})
