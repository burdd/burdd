import express from 'express'
import { addUpvote, removeUpvote } from '../controllers/upvotes.js'

const router = express.Router()

router.post('/', addUpvote)
router.delete('/', removeUpvote)

export default router
