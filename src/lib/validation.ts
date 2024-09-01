import { string, z } from 'zod'

const requiredString = z.string().trim().min(1, 'Required')
const positiveInt = z.number().int().positive('Must be a positive number')

export const signUpSchema = z.object({
  email: requiredString.email('Invalid email address'),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    'Only letters, numbers, - and _ allowed'
  ),
  password: requiredString.min(8, 'Must be at least 8 characters'),
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
})

export type LoginValues = z.infer<typeof loginSchema>

export const createAboutSchema = z.object({
  title: requiredString,
  description: requiredString,
})

export const updateAboutSchema = z.object({
  id: requiredString,
  title: requiredString,
  description: requiredString,
})

export const createCategorySchema = z.object({
  name: requiredString,
})

export const updateCategorySchema = z.object({
  id: requiredString,
  name: requiredString,
})

export const createSizeSchema = z.object({
  name: requiredString,
})

export const updateSizeSchema = z.object({
  id: requiredString,
  name: requiredString,
})

export const sizeStockSchema = z.object({
  sizeId: z.string(),
  stock: z.number().min(0, 'Stock must be a positive number'),
})

export const createProductSchema = z.object({
  title: requiredString,
  price: positiveInt,
  categoryId: requiredString,
  features: z.array(z.string()),
  materials: z.array(z.string()),
  summary: requiredString,
  detailsSize: z.array(z.string()),
  sizeStocks: z.array(sizeStockSchema),
  mediaIds: z.array(z.string()).max(5, 'Cannot have more than 5 attachments'),
})

export const updateProductSchema = z.object({
  id: requiredString,
  title: requiredString,
  price: positiveInt,
  categoryId: requiredString,
  features: requiredString,
  materials: requiredString,
  summary: requiredString,
  detailsSize: requiredString,
})
