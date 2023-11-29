import { z } from 'zod'

export const userSchema = z.object({
  email: z.string({}).refine(mail => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail), {
    message: 'User mail must be a valid email address'
  }),
  username: z.string({
    invalid_type_error: 'User name must be a string',
    required_error: 'Username is required'
  }).min(4, { message: 'User name must be at least 5 characters long' }),
  password: z.string({
    invalid_type_error: 'User password must be a string',
    required_error: 'User password is required'
  }).min(5, { message: 'User password must be at least 5 characters long' }).refine((password) => /^(?=.*[A-Za-z])(?=.*\d)/.test(password), {
    message: 'User password must contain at least one character and one number'
  })
})

export const validateUser = (user) => {
  return userSchema.safeParse(user)
}
