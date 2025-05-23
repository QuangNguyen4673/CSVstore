import mongoose from 'mongoose'
import { z } from 'zod'

export const dbCommentSchema = new mongoose.Schema({
  id: Number,
  postId: Number,
  name: String,
  email: String,
  body: String,
})

export const zodCommentSchema = z.object({
  id: z.coerce.number(),
  postId: z.coerce.number(),
  name: z.string().min(3),
  email: z.string().email(),
  body: z.string(),
})
