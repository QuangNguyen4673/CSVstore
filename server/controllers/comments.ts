import { Request, Response } from 'express'
import { zodCommentSchema as schema } from '../types/schema'
import { commentsCollection } from '../db/mymongo'
import { Comment } from '../types'
import { parseBrokenCSVRow } from '../utils'
import csv from 'csv-parser'
import fs from 'fs'

export const getComments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const total = await commentsCollection.countDocuments()
    const data = await commentsCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray()

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
}

export const searchComments = async (req: Request, res: Response) => {
  try {
    const search = req.query.q as string
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // case-insensitive regex search on multiple fields
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { body: { $regex: search, $options: 'i' } },
          ],
        }
      : {}
    console.log(filter.$or?.[1])

    const total = await commentsCollection.countDocuments(filter)
    const data = await commentsCollection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray()

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to search comments' })
  }
}

export const createComment = async (req: Request, res: Response) => {
  const result = schema.safeParse(req.body)
  if (result.success) {
    await commentsCollection.insertOne(result.data)
    res.status(200).json(result.data)
  } else {
    res.status(400).json({
      message: 'Validation failed',
      errors: result.error.errors,
    })
  }
}

export const createBatchComments = async (req: Request, res: Response) => {
  const comments: Comment[] = []

  for (const c of req.body) {
    const result = schema.safeParse(c)

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.errors,
      })
    }
    comments.push(result.data)
  }

  try {
    await commentsCollection.insertMany(comments)
    res.status(200).json(comments)
  } catch (err) {
    res.status(500).json({ message: 'Error inserting comments', error: err })
  }
}

export const uploadCSV = async (req: Request, res: Response) => {
  const filePath = req.file?.path
  if (!filePath) return res.status(400).json({ error: 'No file uploaded' })
  const rawRows: any[] = []
  const validRows: any[] = []
  const invalidRows: { index: number; errors: string[] }[] = []

  fs.createReadStream(filePath)
    .pipe(
      csv({
        skipLines: 0,
        separator: ',',
        mapHeaders: ({ header }) => header.trim().replace(/^"|"$/g, ''), // remove surrounding quotes
        mapValues: ({ value }) => value.trim().replace(/^"|"$/g, ''), // remove quotes from values
      })
    )
    .on('data', data => {
      rawRows.push(data)
    })
    .on('end', async () => {
      rawRows.forEach((row, index) => {
        const result = schema.safeParse(row)
        if (result.success) {
          validRows.push(result.data)
        } else {
          invalidRows.push({
            index: index + 1,
            errors: result.error.errors.map(e => e.message),
          })
        }
      })

      if (validRows.length === 0) {
        fs.unlinkSync(filePath)
        return res.status(400).json({ error: 'No valid rows', invalidRows })
      }

      try {
        await commentsCollection.insertMany(validRows)
        fs.unlinkSync(filePath)

        res.status(200).json({
          message: 'CSV uploaded',
          inserted: validRows.length,
          skipped: invalidRows.length,
          errors: invalidRows,
        })
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to process CSV' })
      }
    })
}
