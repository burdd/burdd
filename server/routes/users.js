import express from 'express'
import { searchUsers, getUser } from '../controllers/users.js'

const router = express.Router()

router.get('/search', searchUsers)
router.get('/:userId', getUser)

export default router
