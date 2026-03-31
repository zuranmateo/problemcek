
import { z } from 'zod'

export const formSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(5).max(150)
})

export const profileSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.email("Invalid email").max(100),
    file: z
    .instanceof(File)
    .nullable()
    .optional()
    .refine(
      (file) =>
        file === null ||
        file === undefined ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
    )
})

export const EditCommentSchema = z.object({
    title: z.string().min(3).max(100),
    desc: z.string().min(5).max(1000),
})