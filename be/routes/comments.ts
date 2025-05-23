import express from 'express'

import multer from 'multer'
import {
  getComments,
  createComment,
  createBatchComments,
  searchComments,
  uploadCSV,
} from '../controllers/comments.js'

const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.get('/', searchComments)

router.post('/', createComment)

router.post('/bulk', createBatchComments)

router.post('/api/upload', upload.single('file'), uploadCSV)

// router.get('/search', searchComments)

export default router
