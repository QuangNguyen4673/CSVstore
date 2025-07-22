import { MongoClient, Collection, ServerApiVersion } from 'mongodb'
import { Comment } from '../types/'
import dotenv from 'dotenv'

dotenv.config()
const mongoURI = process.env.ATLAS_URI || ''
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

let commentsCollection: Collection<Comment>

export const dbconnect = async () => {
  if (!commentsCollection) {
    try {
      await client.connect()
      const database = client.db('CSVstore')
      commentsCollection = database.collection('comments')
      console.log('✅ Connected to MongoDB')
    } catch (err) {
      console.error('❌ MongoDB connection error:', err)
    }
  }
}

process.on('SIGINT', async () => {
  await client.close()
  console.log('💤 MongoDB disconnected (SIGINT)')
  process.exit(0)
})

export { commentsCollection }
