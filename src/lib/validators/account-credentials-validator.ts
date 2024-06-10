import { z } from "zod"

export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  phone: z.number().or(z.string()),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
})
export const LoginAuthCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>
export type TLoginAuthCredentialsValidator = z.infer<
  typeof LoginAuthCredentialsValidator
>
