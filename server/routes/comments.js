import express from 'express'
import { getTicketComments, createTicketComment } from '../controllers/comments.js'

const router = express.Router()

router.get('/', getTicketComments)
router.post('/', createTicketComment)

export default router
