import { z } from "zod"

export const NewAddressValidator = z.object({
  name: z.string(),
  contact: z.number().or(z.string()),
  addressLine1: z.string(),
  addressLine2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  pinCode: z.string(),
})
export const UpdateAddressValidator = z.object({
  id: z.string(),
  name: z.string(),
  contact: z.number().or(z.string()),
  addressLine1: z.string(),
  addressLine2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  pinCode: z.string(),
  isDefaultAddress: z.boolean(),
})

export type TNewAddressValidator = z.infer<
  typeof NewAddressValidator
>

export type TUpdateAddressValidator = z.infer<
  typeof UpdateAddressValidator
>
