import { z } from "zod"

export const CustomizedProductValidator = z.object({
    isCustomizable: z.boolean(),
    // whatYouWantToCustomize: z.array(z.string()).nonempty("At least one customization option is required"),
    dimensions: z.array(
        z.object({
          length: z.number().positive("Length must be a positive number").optional(),
          width: z.number().positive("Width must be a positive number").optional(),
          height: z.number().positive("Height must be a positive number").optional(),
        })
      ).min(1, "At least one dimension is required").optional(),
    fabric: z.string().optional(),
    foam: z.string().optional(),
})

export type TCustomizedProductValidator = z.infer<
  typeof CustomizedProductValidator
>
