import express, { Express, Request, Response } from 'express'
import commentRoutes from './routes/comments'
import cors from 'cors'
import { dbconnect } from './db/mymongo'

dbconnect().catch(console.dir)
const port = 8000

const app: Express = express()

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('CSV store server is running')
})

app.use('/comments', commentRoutes)

app.listen(port, () => {
  console.log(`now listening on port ${port}`)
})
