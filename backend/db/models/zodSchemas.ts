import { z } from 'zod'

export const zodUserSchema = z.object({
    nickname: z.string(),
    password: z.string(),
    age: z.number(),
    email: z.string(),
    school_year: z.string(),
    gender: z.string(),
    school_type: z.string(),
    state: z.string(),
    city: z.string(),
    isAdm: z.boolean(),
    register_date: z.date().optional(),
})